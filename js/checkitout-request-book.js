checkitout.request_book = {

	baseUrl : 'http://local.coupang.com:9999',
	cookieBook : {},

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

		$('.mdl-checkbox').removeClass('is-focused');
	},

	addEvent: function(){
		var that = checkitout.request_book;
		$('button#addCart').click(function() {
			
		});

		var showToastButton = document.querySelector('#btn_request_book');
		var snackbarContainer = document.querySelector('#demo-toast-example');
		var $btnRequestBookIcon = $('#btn_request_book_icon');

		showToastButton.addEventListener('click', function() {
			var $parentBox = $(".parent-box");
			if($parentBox.hasClass('moved')){
				$parentBox.removeClass('moved')
				$parentBox.animate({ "left": "+=168px" }, "fast" );
				$btnRequestBookIcon.text('keyboard_arrow_right')
			}
			else{
				$parentBox.addClass('moved')
				$parentBox.animate({ "left": "-=168px" }, "fast" );
				$btnRequestBookIcon.text('keyboard_arrow_left')
			}
		});

		$('#btn_go_to_cart').click(function(){
			$(location).attr('href', 'cart.html');
		});

		$('#btn_cart_book').click(function(){
			var date = new Date();
	        checkitout.request_book.cookieBook.createdDate = date.getFullYear() + '년 ' + date.getMonth() + "월 " + date.getDate() + "일 " + date.getHours() + "시 " + date.getMinutes() + "분";
	        cartStorage.addItem(checkitout.request_book.cookieBook, function(data) {
	            if($.isEmptyObject(data)) {
					message = {
						message: checkitout.request_book.cookieBook.bookName +' is added to cart',
						timeout: 800,
						actionText: 'done',
						actionHandler: null,
					};
					snackbarContainer.MaterialSnackbar.showSnackbar(message);
	            } else {
					message = {
						message: checkitout.request_book.cookieBook.bookName +' is already added',
						timeout: 800,
						actionText: 'done',
						actionHandler: null,
					};
					snackbarContainer.MaterialSnackbar.showSnackbar(message);
	            }
	        });
		});

		$('#btn_order_book').click(function(){
			var data, handler;
			var price = parseInt(that.cookieBook.price);
			var availableCredit = checkitout.member.credit;

			if(price > availableCredit){
				handler = function(event) {
					that.orderBook();
				};

				data = {
					message: '1. The lack of credit is "' + ((availableCredit - price)*-1).format() + ' won"'
								+ ' - You must contact admin.'
								+ ' 2. This book is inaprorpiate book',
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

		$('#btn_ebook').click(function(){
			var $bookType = $('#bookType');
			var $price = $('#price');
			var type, price;

			var $focusHelper = $('.mdl-checkbox__focus-helper');

			if($bookType.hasClass('bookType-ebook')){
				$bookType.removeClass('bookType-ebook');
				$focusHelper.css('background-color','transparent');

				type = checkitout.request_book.cookieBook.bookType = '도서';
				price = checkitout.request_book.cookieBook.price;

				$bookType.text(type);
				$price.text(price.format() + "원");
			}
			else{
				$bookType.addClass('bookType-ebook');
				$focusHelper.css('background-color','white');

				type = checkitout.request_book.cookieBook.bookType = 'ebook';
				price = checkitout.request_book.cookieBook.ebookPrice;

				$bookType.text(type);
				$price.text(price.format() + "원");
			}
		});
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
		if(ebookPrice != "") {
			checkitout.request_book.cookieBook.ebookPrice = ebookPrice.split(',').join("");
		}
		else{
			$('#btn_ebook').prop('disabled', true);
			$('#btn_ebook_text').css('color','grey');
		}
	},

	orderBook: function() {
		var book = checkitout.request_book.cookieBook;

		var booksDto = {
			"bookSrl": 0,
			"ISBN": book.isbn13,
			"title": book.bookName,
			"author": "123",
			"url": book.url,
			"price": book.price,
			"ebookPrice": book.ebookPrice,
			"isInappropriate": "false"
		};

		$.ajax({
			url: checkitout.request_book.baseUrl + '/api/v1/book',
			method: "POST",
			dataType:"json",
			//data: { booksDto: JSON.stringify(booksDto), bookType: book.bookType },
			data: { booksDto: JSON.stringify(booksDto) },
			success: function (result, status, xhr) {
				if (xhr.status == 200) {
					if (result != null) {
						var rcode = result.rcode;
						if(rcode == 'RET0000'){

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
	if (request.action == "getEbookPrice") {
		checkitout.request_book.renderEbookPrice(request.source);
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
