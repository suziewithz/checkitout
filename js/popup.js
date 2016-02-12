function renderUserInfo(userEmail) {
    $('#user_email').text("id : " + userEmail);
    $('input[name="input_user_email"]').val(userEmail);
}

function renderPrice(priceText) {
	$('#price').text(priceText + "원")
    afterReplace = priceText.replace(/,/g,"");
    afterReplace = afterReplace.replace(/원/g, "");
    $('input[name="input_price"]').val(afterReplace);
}

function renderBookName(bookText) {
    $('#book_name').text(bookText);
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

function renderEbookPrice(ebookPrice) {
    if(ebookPrice == "") {
        $('input[name="input_ebook_price"]').val(0);   
    } else {
        $('#ebook_price').text("ebook price: " + ebookPrice + "원")
        afterReplace = ebookPrice.replace(/,/g,"");
        afterReplace = afterReplace.replace(/원/g, "");
        $('input[name="input_ebook_price"]').val(afterReplace);   
    }
    
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
/*
chrome.extension.onMessage.addListener(function (request, sender) {
    if (request.action == "getEbookPrice") {
        renderEbookPrice(request.source);
    }
});
*/

$(document).ready( function() {
    
    $('button#addCart').click(function() {
        cookieBook = {};
        cookieBook.name = $('input[name="input_book_name"]').val();
        cookieBook.price = $('input[name="input_price"]').val();
        cookieBook.ebookPrice= $('input[name="input_ebook_price"]').val();
        cookieBook.isbn13 = $('input[name="input_isbn13"]').val();
        cookieBook.url = $('input[name="input_url"]').val();
        cookieBook.isEbook = false;
        var date = new Date();
        cookieBook.createdDate = date.getFullYear() + '년 ' + date.getMonth() + "월 " + date.getDate() + "일 " + date.getHours() + "시 " + date.getMinutes() + "분";
        isNeedToAdd = true;

        cartStorage.addItem(cookieBook, function(data) {
            hello = data;
            console.log(hello);
        });
    });

    $('button#goToCart').click(function() {
        $(location).attr('href','cart.html');
    });

    $('button#goToHistory').click(function() {
        $(location).attr('href','history.html');
    });
});