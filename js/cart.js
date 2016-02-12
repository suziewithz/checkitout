
function setSnackBar(_message, _timeout, _actionHandler, _actionText) {
    'use strict';
    var data = {
        message: _message,
        timeout: _timeout,
        actionHandler: _actionHandler,
        actionText: _actionText
    };
    var snackbarContainer = document.querySelector('#snackbar');
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}
//setSnackBar('전체체크하였습니다', 2000, null, '닫기');

var cartPage = {
    cartList:{},
    init: function() {
        cartPage.loadList(function() {
            cartPage.makeList();
            cartPage.bindEvent();
        });
    },
    loadList : function(callback) {
        cartStorage.loadAllItems(function(data) {
            cartPage.cartList = data;
            callback();
        });
    },
    makeRow : function(index, book) {
        
        tableRow = "";
        if(index %2 == 0) {
            tableRow += '<tr class="even" id="' + book.isbn13 + '">'; 
        } else {
            tableRow += '<tr class="odd" id="' + book.isbn13 + '">';
        }

        tableRow += '<td>';
        tableRow += '<input type="hidden" class="input_json" value="' + book.isbn13 + '" />';
        tableRow += '<input type="checkbox" class="check_row" value="' + book.isbn13 + '" />';
        tableRow += '</td><td>';
        tableRow += book.name;
        tableRow += '</td><td>';
        tableRow += book.price;
        tableRow += '</td><td>';
        if(book.isEbook) {
            tableRow += "이북";
        } else {
            tableRow += "서적";
        }
        tableRow += '</td><td>';
        tableRow += book.createdDate;
        tableRow += '</td><td>'; 
        tableRow += '<button type="button" class="button_url" value="' + book.url +'">보기</button></td>';

        return tableRow;
    },
    makeList : function() {
        var tbodyParent = $('tbody.parent_tr');
        var bookList = cartPage.cartList;
        var i = 0;
        tbodyParent.html('');
        for(key in bookList) {
            var bookItem = bookList[key];
            tbodyParent.append(cartPage.makeRow(++i, bookItem));
        }

        if(i == 0) {
            tbodyParent.append('<div>찜 목록에 담긴 책이 없습니다. :)</div>');
        }
    },
    bindEvent : function() {

        $('button.button_url').click(function() {
            cartPage.focusOrCreateTab($(this).val());
        });

        $('input#check_all').click(function() {
            var isChecked = $(this).is(':checked') ? true : false;
            $('input.check_row').each(function() {
                $(this).prop('checked',isChecked);
            });
        });

        $('input.check_row').click(function() {
            var isChecked = $(this).is(':checked') ? true : false;
            console.log(isChecked);
            if(!isChecked) {
                $('input#check_all').prop('checked', false);
            } else {
                cartPage.setCheckAll();   
            }
        });

        $('button#button_order').click(function() {

        });

        $('button#button_delete').click(function() {
            if($('input#check_all').is(':checked')) {
                console.log("전체삭제");
                cartStorage.clear(function() {
                    console.log("클리어 성공");
                    cartPage.init();
                });
            } else {
                cartIsbnList = [];
                $('input.check_row').each(function() {
                    if($(this).is(':checked')) {
                        cartIsbnList.push($(this).val());
                    }
                })

                cartStorage.removeItems(cartIsbnList, function() {
                    cartPage.init();
                });
            }
        });
    },
    focusOrCreateTab : function(url) {
      chrome.windows.getAll({'populate':true}, function(windows) {
        var existing_tab = null;
        for (var i in windows) {
          var tabs = windows[i].tabs;
          for (var j in tabs) {
            var tab = tabs[j];
            if (tab.url == url) {
              existing_tab = tab;
              break;
            }
          }
        }
        if (existing_tab) {
          chrome.tabs.update(existing_tab.id, {'selected':true});
        } else {
          chrome.tabs.create({'url':url, 'selected':true});
        }
      });
    },
    setCheckAll : function() {
        var isAllChecked = true;
        $('input.check_row').each(function() {
            isAllChecked = isAllChecked && $(this).is(':checked');
        });
        
        $('input#check_all').prop('checked', isAllChecked);
    }

};

$(document).ready( function() {
    cartPage.init();
});
