function renderUserInfo(userEmail) {
    $('#user_email').text("id : " + userEmail);
    $('input[name="input_user_email"]').val(userEmail);
}

function renderPrice(priceText) {
	$('#price').text("price: " + priceText + "원")
    afterReplace = priceText.replace(/,/g,"");
    afterReplace = afterReplace.replace(/원/g, "");
    $('input[name="input_price"]').val(afterReplace);
}

function renderBookName(bookText) {
    $('#book_name').text("book name : " + bookText);
    $('input[name="input_book_name"]').val(bookText);
}
	
function renderISBN13(isbn13) {
    $('#isbn13').text("isbn :" + isbn13);
    $('input[name="input_isbn13"]').val(isbn13);
}

function renderUrl(url) {
    $('#url').text("url : " + url);
    $('input[name="input_url"]').val(url);
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.identity.getProfileUserInfo(function(userInfo) {
		renderUserInfo(userInfo.email);
	});
});

function onWindowLoad() {
    chrome.tabs.executeScript(null, {file:"js/jquery.min.js"}, null);
    chrome.tabs.executeScript(null, {
        file: "js/getBookInfo.js"
        }, function() {
            if (chrome.extension.lastError) {
                document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
            }
        });
}

window.onload = onWindowLoad;

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "getPrice") {
    	renderPrice(request.source);
    }
});

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "getBookName") {
        renderBookName(request.source);
    }
});

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "getUrl") {
        renderUrl(request.source);
    }
});

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "getISBN13") {
        renderISBN13(request.source);
    }
});


$(document).ready( function() {
    
    $('button#addCart').click(function() {
        cookieBook = {};
        cookieBook.name = $('input[name="input_book_name"]').val();
        cookieBook.price = $('input[name="input_price"]').val();
        cookieBook.isbn13 = $('input[name="input_isbn13"]').val();
        cookieBook.url = $('input[name="input_url"]').val();
        isNeedToAdd = true;

        chrome.cookies.get({"name":"cartList", "url":"https://www.yes24.com/"}, function(cookie) {
            if(cookie != null) {
                cookieBookList = JSON.parse(cookie.value);
            } else {
                cookieBookList = [];
            }
            
            for(i = 0 , len = cookieBookList.length; i < len; ++i) {
                if(cookieBookList[i].isbn13 == cookieBook.isbn13) {
                    isNeedToAdd = false;
                    console.log("already added");
                    break;
                }
            }

            if(isNeedToAdd) {
                cookieBookList.push(cookieBook);
                chrome.cookies.set({"name": "cartList", "url": "https://www.yes24.com/", "value": JSON.stringify(cookieBookList)}, function (cookie) {});
            }
        });
    });
});