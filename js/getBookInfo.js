var bookInfo = {

	init: function(){
		var yes24 = 'www.yes24.com';
		var hanbit = 'www.hanbit.co.kr';
		var curUrl = bookInfo.getUrl();

		if(curUrl.indexOf(yes24) > -1){
			bookInfo.getBookInfo('yes24');
		}
		else if(curUrl.indexOf(hanbit) > -1){
			bookInfo.getBookInfo('hanbit');
		}
		else {

		}
	},

	getUrl: function() {
		return location.href;
	},

	getBookInfo: function(key){
		var obj = bookInfo[key];

		chrome.extension.sendMessage({
			action: "getUrl",
			source: bookInfo.getUrl()
		});

		chrome.extension.sendMessage({
			action: "getPrice",
			source: obj.getPrice()
		});

		chrome.extension.sendMessage({
			action: "getEbookPrice",
			source: obj.getEbookPrice()
		});

		chrome.extension.sendMessage({
			action: "getBookName",
			source: obj.getBookName()
		});

		chrome.extension.sendMessage({
			action: "getISBN13",
			source: obj.getISBN13(document)
		});

		chrome.extension.sendMessage({
			action: "getImg",
			source: obj.getImg()
		});

		chrome.extension.sendMessage({
			action: "getBookType",
			source: obj.getBookType()
		});
	},

	yes24: {

		getBookType: function() {
			var type = $('.rkeyL')[0].innerHTML;
			return type;
		},

		getBookName: function() {
			var title = $('#title > h1 > a').text();
			$('#title').find('.subtitle').each( function() {
				title = title + $(this).text();
			});
			return title;
		},

		getPrice: function() {
			var price = "";
			$('em.yes_b').each(function(index) {
				if(index==0) {
					price = $(this).text();
				}
			});
			return price;
		},

		getEbookPrice: function() {
			var price = "";
			$('em.yes_b').each(function(index) {
				if(index==1) {
					price = $(this).text();
				}
			});
			return price;
		},

		getISBN13: function(document) {
			var isbn13 = '';
			var isbn13Obj = document.getElementsByClassName("isbn10")[0];
			if(null != isbn13Obj) {
				isbn13 = isbn13Obj.getElementsByTagName("p")[0].innerHTML;
			}
			return isbn13
		},

		getImg: function() {
			var imgUrl = $('#mainImage').attr('src');
			return imgUrl
		}
	},
	hanbit: {
		getBookType: function() {
			var bookType = '';
			$('input[name="productid"]').each(function(index) {
				if(index==0) {
					bookType = $(this).val();
				}
			});
			bookType = bookType.split('|')[1];
			return bookType;
		},

		getBookName: function() {
			var title = $('strong.tl').text();
			return title;
		},

		getPrice: function() {
			var price = "";
			$('div.pricebar2 > strong.cC1').each(function(index) {
				if(index==0) {
					price = $(this).text();
				}
			});
			
        	price = price.replace(/,/g,"");
        	price = price.replace(/원/g, "");
        	return price;
        },
        
		getEbookPrice: function() {
			var price = "";
			$('div.pricebar2 > strong.cC1').each(function(index) {
				if(index==0) {
					price = $(this).text();
				}
			});
			
        	price = price.replace(/,/g,"");
        	price = price.replace(/원/g, "");
        	return price;
		},

		getISBN13: function(document) {
			var isbn13 = '';
			$('input[name="productid"]').each(function(index) {
				if(index==0) {
					isbn13 = $(this).val();
				}
			});
			isbn13 = isbn13.split('|')[0];
			return isbn13;
		},

		getImg: function() {
			//var imgUrl = $('#bookWrap > div.bDetail > div.detGp1 > div.bg > div.ctl > div.t1 > img').attr('src');
			var imgUrl = $('div.ctl > div.t1 > img').attr('src');
			return imgUrl
		}
	}
};

// get book info
bookInfo.init();