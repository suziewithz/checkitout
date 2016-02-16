checkitout.request_book = {

	baseUrl : 'http://local.coupang.com:9999',
	cookieBook : {},
	renderCount : 0,
	isAmazone : false,
	isYes24 : false,

	init: function(){
		var that = checkitout.request_book;

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

		that.dialog = document.querySelector('dialog');
		if (!that.dialog.showModal) {
			dialogPolyfill.registerDialog(dialog);
		}
		that.dialog.querySelector('.close').addEventListener('click', function() {
			that.dialog.close();
		});

		that.dialog.querySelector('.confirm').addEventListener('click', function() {
			that.orderBook();
			that.dialog.close();
		});

		checkitout.request_book.addEvent();
		$('.mdl-checkbox').removeClass('is-focused');
	},

	addEvent: function(){
		var that = checkitout.request_book;

		var showToastButton = document.querySelector('#btn_request_book');
		var snackbarContainer = document.querySelector('#demo-toast-example');
		var $btnRequestBookIcon = $('#btn_request_book_icon');

		showToastButton.addEventListener('click', function() {
			var $parentBox = $(".parent-box");
			if($parentBox.hasClass('moved')){
				$parentBox.removeClass('moved')
				$parentBox.animate({ "left": "+=170px" }, "fast" );
				$btnRequestBookIcon.text('keyboard_arrow_right')
			}
			else{
				$parentBox.addClass('moved')
				$parentBox.animate({ "left": "-=170px" }, "fast" );
				$btnRequestBookIcon.text('keyboard_arrow_left')
			}
		});

		$('#btn_go_to_cart').click(function(){
			$(location).attr('href', 'cart.html');
		});

		$('#btn_go_to_history').click(function () {
			$(location).attr('href', 'history.html');
		});

		$('#btn_cart_book').click(function(){
			$.ajax({
                url: checkitout.request_book.baseUrl + '/api/v1/book/' + checkitout.request_book.cookieBook.isbn13 ,
                method: "GET",
                dataType:"json",
                // data: { booksDto: JSON.stringify(booksDto), bookType: book.bookType, price: price },
                success: function (result, status, xhr) {
                    if (xhr.status == 200) {
                        if (result != null) {
                            var rcode = result.rcode;
                            if(rcode == 'RET0000'){
                            	if(result.rdata != null) {
                            		bookList = result.rdata.entityList;
									console.log(bookList);
                            		if(bookList != null && bookList.length != 0) {
                            			bookDto = bookList[0];
										if(bookDto != null){
											checkitout.request_book.cookieBook.isInappropriate = bookDto.isinappropriate;
										}
                            		}
                            	}
                            }
                        }

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
                    }
                },
                error: function () {

                }
            });    
		});

		$('#btn_order_book').click(function(){
			var data, handler;
			var totalAmount = checkitout.member.totalAmount;

			if(50000 < totalAmount){
				handler = function(event) {
					that.dialog.showModal();
				};

				data = {
					message: '1. The totalAmount is "' + (totalAmount).format() + ' won"'
								+ ' - You must contact admin.'
								+ ' 2. This book is inaprorpiate book',
					timeout: 4000,
					actionText: 'Force Order',
					actionHandler: handler
				};
				snackbarContainer.MaterialSnackbar.showSnackbar(data);
			}
			else{
				that.dialog.showModal();
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

				type = checkitout.request_book.cookieBook.bookType = 'book';
				price = checkitout.request_book.cookieBook.price;

				$bookType.text(type);
			}
			else{
				$bookType.addClass('bookType-ebook');
				$focusHelper.css('background-color','white');

				type = checkitout.request_book.cookieBook.bookType = 'ebook';
				price = checkitout.request_book.cookieBook.ebookPrice;

				$bookType.text(type);
			}

			if(that.isAmazon){
				$price.text("$" + price.format());
			}
			else{
				$price.text(price.format() + "원");
			}
		});
	},

	renderPrice: function(price){
		checkitout.request_book.cookieBook.price = price;
		checkitout.request_book.renderView();
	},

	renderBookName : function(bookText){
		checkitout.request_book.cookieBook.bookName = bookText;
		checkitout.request_book.renderView();
	},

	renderISBN13: function(isbn13) {
		checkitout.request_book.cookieBook.isbn13 = isbn13;
		checkitout.request_book.renderView();
	},

	renderUrl: function(url) {
		checkitout.request_book.cookieBook.url = url;
		checkitout.request_book.renderView();
	},

	renderImg: function(imgUrl) {
		checkitout.request_book.cookieBook.imgUrl = imgUrl;
		checkitout.request_book.renderView();
	},

	renderEbookPrice: function(ebookPrice) {
		checkitout.request_book.cookieBook.ebookPrice = ebookPrice;
		checkitout.request_book.renderView();
	},

	renderAuthor: function(author) {
		checkitout.request_book.cookieBook.author = author;
		checkitout.request_book.renderView();
	},

	renderBookType: function(bookType) {
		checkitout.request_book.cookieBook.bookType = bookType;
		checkitout.request_book.renderView();
	},

	renderView: function(){
		if(++checkitout.request_book.renderCount == 9){
			var tmpPrice;
			var that = checkitout.request_book;
			var bookInfo = checkitout.request_book.cookieBook;

			var amazoneRex = new RegExp("www.amazon.com\/.*");
			var yes24Rex = new RegExp("www.yes24.com\/.*");

			var $price = $('#price');
			var $btn_ebook = $('#btn_ebook');

			that.isAmazon = amazoneRex.test(bookInfo.url);
			that.isYes24 = yes24Rex.test(bookInfo.url);

			$('#book_name').text(bookInfo.bookName);
			$('#author').text(bookInfo.author);
			$('#mainImage').attr("src", bookInfo.imgUrl);

			if(that.isYes24 && bookInfo.bookType.toLowerCase() == 'ebook'){
				tmpPrice = bookInfo.price;
				bookInfo.ebookPrice = tmpPrice;
				bookInfo.price = 0;
			}

			if(bookInfo.ebookPrice != 0) {
				if(bookInfo.price == 0){
					if(that.isAmazon){
						$price.text("$" + bookInfo.ebookPrice.format());
					}
					else{
						$price.text(bookInfo.ebookPrice.format() + "원");
					}

					$('#checkbox-label').addClass('is-checked');
					$btn_ebook.prop('disabled', true);
					checkitout.request_book.cookieBook.bookType = 'ebook';
				}
				else{
					if(that.isAmazon){
						$price.text("$" + bookInfo.price.format());
					}
					else{
						$price.text(bookInfo.price.format() + "원");
					}
					checkitout.request_book.cookieBook.bookType = 'book';
				}
			}
			else{
				if(that.isAmazon){
					$price.text("$" + bookInfo.price.format());
				}
				else{
					$price.text(bookInfo.price.format() + "원");
				}
				$btn_ebook.prop('disabled', true);
				$('#btn_ebook_text').css('color','grey');
				checkitout.request_book.cookieBook.bookType = 'book';
			}
			$('#bookType').text(bookInfo.bookType);
		}
	},

	orderBook: function() {
		var book = checkitout.request_book.cookieBook;
		var price;

		if(book.bookType.toLowerCase() == 'ebook'){
			price = book.ebookPrice;
		}
		else{
			price = book.price;
		}

		var booksDto = {
			"bookSrl": 0,
			"isbn": book.isbn13,
			"title": book.bookName,
			"author": book.author,
			"url": book.url,
			"isInappropriate": "false"
		};

		$.ajax({
			url: checkitout.request_book.baseUrl + '/api/v1/order/check',
			method: "POST",
			data: {bookIsbn: booksDto.isbn},
			success: function (result, status, xhr) {
				if (result == 'ok') {
					$.ajax({
						url: checkitout.request_book.baseUrl + '/api/v1/order/new',
						method: "POST",
						dataType: "json",
						data: {booksDto: JSON.stringify(booksDto), bookType: book.bookType, price: price},
						success: function (result, status, xhr) {
							if (xhr.status == 200) {
								if (result != null) {
									var rcode = result.rcode;
									if (rcode == 'RET0000') {
										message = {
											message: 'Thanks!',
											timeout: 2000,
											actionText: 'done',
											actionHandler: null,
										};
										document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar(message);

										setTimeout(function () {
											$(location).attr('href', '/html/history.html');
										}, 1000);
									}
									else {
										$(location).attr('href', '/html/signin.html');
									}
								}
							}
						},
						error: function () {

						}
					});
				} else if (result == 'duplicate') {
					message = {
						message: 'This book is already ordered',
						timeout: 2000,
						actionText: 'done',
						actionHandler: null,
					};
					document.querySelector('#demo-toast-example').MaterialSnackbar.showSnackbar(message);
				}
			},
			error: function () {
				console.log('error in /api/v1/order/check');
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
	if (request.action == "getAuthor") {
		checkitout.request_book.renderAuthor(request.source);
	}
});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getBookType") {
		checkitout.request_book.renderBookType(request.source);
	}
});