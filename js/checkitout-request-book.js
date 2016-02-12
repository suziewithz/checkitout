var checkitout = {};

checkitout.request_book = {

	baseUrl : 'http://local.coupang.com:9999',
	cookieBook : {},
	availableCredit : 0,

	init: function(){
		checkitout.request_book.addEvent();
	},

	addEvent: function(){
		var that = checkitout.request_book;
		$('button#addCart').click(function() {
			//cookieBook.name = $('input[name="input_book_name"]').val();
			//cookieBook.price = $('input[name="input_price"]').val();
			//cookieBook.ebookPrice= $('input[name="input_ebook_price"]').val();
			//cookieBook.isbn13 = $('input[name="input_isbn13"]').val();
			//cookieBook.url = $('input[name="input_url"]').val();
			//isNeedToAdd = true;
			//
			//chrome.cookies.get({"name":"cartList", "url":"https://www.yes24.com/"}, function(cookie) {
			//	if(cookie != null) {
			//		cookieBookList = JSON.parse(cookie.value);
			//	} else {
			//		cookieBookList = [];
			//	}
			//
			//	for(i = 0 , len = cookieBookList.length; i < len; ++i) {
			//		if(cookieBookList[i].isbn13 == cookieBook.isbn13) {
			//			isNeedToAdd = false;
			//			console.log("already added");
			//			break;
			//		}
			//	}
			//
			//	if(isNeedToAdd) {
			//		cookieBookList.push(cookieBook);
			//		chrome.cookies.set({"name": "cartList", "url": "https://www.yes24.com/", "value": JSON.stringify(cookieBookList)}, function (cookie) {});
			//	}
			//});
		});

		var showToastButton = document.querySelector('#btn_request_book');
		var snackbarContainer = document.querySelector('#demo-toast-example');

		showToastButton.addEventListener('click', function() {
			var data;
			if(parseInt(that.cookieBook.price) > that.availableCredit){
				data = {
					message: '크레딧이 ' + that.availableCredit + "원 남았습니다",
					timeout: 800,
				};
				snackbarContainer.MaterialSnackbar.showSnackbar(data);
			}
			else{
				//TODO - do request task
			}
		});
	},

	renderUserInfo: function(userEmail){
		$('#user_email').text("id : " + userEmail)
		checkitout.request_book.cookieBook.name = userEmail;
	},

	renderPrice: function(priceText){
		$('#price').text(priceText + "원")
		checkitout.request_book.cookieBook.price = priceText.split(',').join("");
	},

	renderBookName : function(bookText){
		$('#book_name').text(bookText);
		checkitout.request_book.cookieBook.bookName = bookText;
	},

	renderISBN13: function(isbn13) {
		$('#isbn13').text("isbn :" + isbn13);
		checkitout.request_book.cookieBook.isbn13 = isbn13;
	},

	renderUrl: function(url) {
		$('#url').text("url : " + url);
		checkitout.request_book.cookieBook.url = url;
	},

	renderImg: function(imgUrl) {
		$('#mainImage').attr("src", imgUrl);
		checkitout.request_book.cookieBook.imgUrl = imgUrl;
	},

	renderBookType: function(type) {
		$('#bookType').text(type);
		checkitout.request_book.cookieBook.bookType = type;
	},

	renderEbookPrice: function(ebookPrice) {
		if(ebookPrice == "") {
			$('input[name="input_ebook_price"]').val(0);
		} else {
			$('#ebook_price').text("ebook price: " + ebookPrice + "원")
			checkitout.request_book.cookieBook.ebookPrice = ebookPrice;
		}
	},

	addBook: function() {
		$.ajax({
			url: checkitout.check_session.baseUrl + '/userinfo',
			method: "POST",
			success: function (result, status, xhr) {
				if (xhr.status == 200) {
					if (result != null) {
						var rcode = result.rcode;
						if(rcode == 'RET0000'){
							$(location).attr('href', '/html/requestBook.html');
						}
						else{
							$(location).attr('href', '/html/signin.html');
						}
					}
				}
			},
			error: function () {

			}
		});
	}
}

$(document).ready(function() {
	checkitout.request_book.init();
	chrome.tabs.executeScript(null, {file:"js/jquery.min.js"}, null);
	chrome.tabs.executeScript(null, {
		file: "js/getBookInfo.js"
	}, function() {
		if (chrome.extension.lastError) {
			document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
		}
	});

});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getPrice") {
		checkitout.request_book.renderPrice(request.source);
	}
});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getBookName") {
		checkitout.request_book.renderBookName(request.source);
	}
});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getUrl") {
		checkitout.request_book.renderUrl(request.source);
	}
});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getISBN13") {
		checkitout.request_book.renderISBN13(request.source);
	}
});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getImg") {
		checkitout.request_book.renderImg(request.source);
	}
});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getBookType") {
		checkitout.request_book.renderBookType(request.source);
	}
});
