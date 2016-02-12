checkitout.request_book = {

	baseUrl : 'http://local.coupang.com:9999',
	cookieBook : {},
	availableCredit : 1000,

	init: function(){

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
		checkitout.request_book.addEvent();
	},

	addEvent: function(){
		var that = checkitout.request_book;
		$('button#addCart').click(function() {
			
		});

		var showToastButton = document.querySelector('#btn_request_book');
		var snackbarContainer = document.querySelector('#demo-toast-example');

		showToastButton.addEventListener('click', function() {
			var $parentBox = $(".parent-box");
			if($parentBox.hasClass('moved')){
				$parentBox.removeClass('moved')
				$parentBox.animate({ "left": "+=168px" }, "fast" );
			}
			else{
				$parentBox.addClass('moved')
				$parentBox.animate({ "left": "-=168px" }, "fast" );
			}
		});

		$('#btn_go_to_cart').click(function(){
			$(location).attr('href', 'cart.html');
		});

		$('#btn_cart_book').click(function(){
			var date = new Date();
	        checkitout.request_book.cookieBook.createdDate = date.getFullYear() + '년 ' + date.getMonth() + "월 " + date.getDate() + "일 " + date.getHours() + "시 " + date.getMinutes() + "분";
	        cartStorage.addItem(checkitout.request_book.cookieBook, function(data) {
	            hello = data;
	            console.log(hello);
	        });
		});

		$('#btn_order_book').click(function(){
			var data, handler;
			var price = parseInt(that.cookieBook.price);

			if(price > that.availableCredit){
				handler = function(event) {
					that.orderBook();
				};

				data = {
					message: 'The lack of credit is "' + ((that.availableCredit - price)*-1).format() + ' won"'
								+ ' - You must contact admin.',
					timeout: 4000,
					actionText: 'Force Order',
					actionHandler: handler
				};
				snackbarContainer.MaterialSnackbar.showSnackbar(data);
			}
			else{
				that.orderBook();
			}
		});

	},

	orderBook: function(){
		console.log(checkitout.request_book.cookieBook);
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
