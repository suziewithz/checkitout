var cartStorage = {
    maxNum: 30,
    addItem: function(book, callback) {
        bookItem = {};
        var key = book.isbn13 + "|" + book.bookType;
        bookItem[key] = book;
        chrome.storage.local.get(key, function(data) {
            if($.isEmptyObject(data)) {
                chrome.storage.local.set(bookItem, callback);
            } else {
                callback(data);
            }
        });
    },
    loadAllItems : function(callback) {
        chrome.storage.local.get(null, function(data) {
            if(callback) {
                callback(data);
            }
        })
    },
    loadItems : function(isbnList, callback) {
        chrome.storage.local.get(isbnList, callback);
    },
    removeItems : function(isbnList, callback) {
        chrome.storage.local.remove(isbnList, callback);
    },
    clear : function(callback) {
        chrome.storage.local.clear(callback);
    }
};