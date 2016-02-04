function renderUserInfo(userEmail) {
  document.getElementById('user_email').textContent = "id : " + userEmail;
}

function renderPrice(priceText) {
	document.getElementById('price').textContent = "price: " + priceText;
}

function renderBookName(bookText) {
    document.getElementById('book_name').textContent = "book name : " + bookText;
}
	
function renderISBN13(isbn13) {
    document.getElementById('isbn13').textContent = "isbn :" + isbn13;
}

function renderUrl(url) {
    document.getElementById('url').textContent = "url : " + url;
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.identity.getProfileUserInfo(function(userInfo) {
		renderUserInfo(userInfo.email);
	});
});

function onWindowLoad() {
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