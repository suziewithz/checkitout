function makeRow(index, book) {
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
    CartStorage.load(function(data) {
        if(data != null) {
            bookList = data;
        } else {
            bookList = [];
        }

        var tbodyParent = $('tbody.parent_tr');
    
        for(i = 0, len = bookList.length; i < len ; ++i) {
            var row = makeRow(i, bookList[i]);
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