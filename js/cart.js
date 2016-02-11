function makeRow(index, cookieBook) {
    tableRow = "";
    if(index %2 == 0) {
        tableRow += '<tr class="even" id="' + cookieBook.isbn13 + '">'; 
    } else {
        tableRow += '<tr class="odd" id="' + cookieBook.isbn13 + '">';
    }

    tableRow += '<td>';
    tableRow += '<input type="hidden" class="input_json" value="' + JSON.stringify(cookieBook) + '" />';
    tableRow += '<input type="checkbox" class="check_row" value="' + cookieBook.isbn13 + '" />';
    tableRow += '</td><td>';
    tableRow += cookieBook.name;
    tableRow += '</td><td>';
    tableRow += cookieBook.price;
    tableRow += '</td><td>';
    if(cookieBook.isEbook) {
        tableRow += "이북";
    } else {
        tableRow += "서적";
    }
    tableRow += '</td><td>';
    tableRow += cookieBook.createdDate;
    tableRow += '</td><td>'; 
    tableRow += '<button type="button" class="button_url" value="' + cookieBook.url +'">보기</button></td>';

    return tableRow;
}

function focusOrCreateTab(url) {
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
}


function setCheckAll() {
    var isAllChecked = true;
    $('input.check_row').each(function() {
        isAllChecked = isAllChecked && $(this).is(':checked');
    });
    console.log(isAllChecked);
    $('input#check_all').prop('checked', isAllChecked);
}

$(document).ready( function() {
    chrome.cookies.get({'name':'cartList', 'url':'http://local.coupang.com/'}, function(cookie) {
        if(cookie != null) {
            cookieBookList = JSON.parse(cookie.value);
        } else {
            cookieBookList = [];
        }
        var tbodyParent = $('tbody.parent_tr');
    
        for(i = 0, len = cookieBookList.length; i < len ; ++i) {
            var row = makeRow(i, cookieBookList[i]);
            tbodyParent.append(row);
        }

        tbodyParent.find('button.button_url').each(function() {
            $(this).click(function() {
                focusOrCreateTab($(this).val());
            });
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
                setCheckAll();   
            }
        });
    });


});