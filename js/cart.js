
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
function splitIdAndType(key) {
    var splitArray = key.split('|');
    
    if(splitArray.length == 2) {
        return splitArray;    
    } else {
        return [];  // error
    }
}

var cartPage = {
    cartList:{},
    init: function() {
        Number.prototype.format = function(){
            if(this==0) return 0;

            var reg = /(^[+-]?\d+)(\d{3})/;
            var n = (this + '');

            while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

            return n;
        };

        String.prototype.format = function(){
            var num = parseFloat(this);
            if( isNaN(num) ) return "0";

            return num.format();
        };

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
    makeCard : function(book) {
        var card = '';
        var key = book.isbn13 + "|" + book.bookType;
        card += '<div class="demo-card-image mdl-card mdl-shadow--2dp mdl-cell mdl-cell--3-col" style="background:url(\''+book.imgUrl + '\') top / cover ; background-repeat: no-repeat;">';
        card += '<div id="'+key+'" class="mdl-card__title mdl-card--expand"></div>';
        card += '<div id="' + key + '" class="mdl-card__actions book-title"><div>';
        card += book.bookName;
        card += '</div></div>';
        card += '<div class="card-custom-area">';
        card += '<div class="book_type">' + book.bookType + '</div>'
        card += '<div class="money">'+book.price.format()+'원</div>';
        card += '<div class="clearFix"></div>';
        card += '</div><div class="card-custom-area">';
        card += '<button alt="링크로 이동" value="' + book.url + '" class="button_url mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">link</i></button>';
        card += '<button alt="삭제하기" value="' + key + '" class="button_delete_item mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">delete</i></button>';
        card += '</div></div>';
        card += '</div>';
        card += '</div>';
        return card;
    },
    makeList : function() {
        var tbodyParent = $('.parent_tr');
        var bookList = cartPage.cartList;
        var i = 0;
        tbodyParent.html('');
        for(key in bookList) {
            var bookItem = bookList[key];
            tbodyParent.append(cartPage.makeCard(bookItem)).trigger("create");
            i++;
        }

        if(i == 0) {
            $('#tip').html('<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">찜 목록에 담긴 책이 없습니다. :)</a>');
        } else {
            $('#tip').html('<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"><i class="material-icons">information</i></button>구매하려는 책을 클릭하면 구매 신청을 할 수 있습니다. :)</a>');
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

        $('button.button_delete_item').click(function() {
            cartStorage.removeItems([$(this).val()], function() {
                cartPage.init();
            });
        });
        $('button#button_delete_all').click(function() {
            cartStorage.clear(function() {
                cartPage.init();
            });
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
                if(cartIsbnList.length == 0) {
                    setSnackBar('체크된 아이템이 없습니다', 2000, null, '닫기');
                } else {
                    cartStorage.removeItems(cartIsbnList, function() {
                        cartPage.init();
                    });
                }
                
            }
        });

        $('.mdl-card--expand, .mdl-card__actions').click(function() {
            var key = $(this).attr('id');
            var book = cartPage.cartList[key];
            if(book != null) {
                cartPage.setDialogContent(book);
                var dialog = document.querySelector('dialog');
                if (! dialog.showModal) {
                    dialogPolyfill.registerDialog(dialog);
                }
                
                dialog.querySelector('.order').addEventListener('click', function() {

                });
                dialog.querySelector('.close').addEventListener('click', function() {
                    dialog.close();
                });    

                dialog.showModal();
            }
            
        });
    },
    setDialogContent : function(book) {
        var dialog = $('dialog');
        dialog.find('div#dialog_order_title').html("Order [" + book.bookType + "]");
        var title = dialog.find('div#dialog_book_title').html(book.bookName);
        var price ="";
        if(book.bookType.toLowerCase() == 'ebook')
            price = book.ebookPrice.format();
        else 
            price = book.price.format();
        dialog.find('#mdl-dialog__price').html(price + "원");
        dialog.find('button.order').val(book.isbn13 + "|" + book.bookType);

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
