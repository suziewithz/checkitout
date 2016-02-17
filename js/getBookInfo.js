var bookInfo = {

	init: function(){
		var yes24 = 'www.yes24.com';
		var hanbit = 'www.hanbit.co.kr';
		var amazon = 'www.amazon.com';

		var curUrl = bookInfo.getUrl();

		if(curUrl.indexOf(yes24) > -1){
			bookInfo.getBookInfo('yes24');
		}
		else if(curUrl.indexOf(hanbit) > -1){
			bookInfo.getBookInfo('hanbit');
		}
		else if(curUrl.indexOf(amazon) > -1){
			bookInfo.getBookInfo('amazon');
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
			action: "getAuthor",
			source: obj.getAuthor()
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
			var price = "0원";
			$('em.yes_b').each(function(index) {
				if(index==0) {
					price = $(this).text();
				}
			});
			price = price.replace(/,/g,"");
			price = price.replace(/원/g, "");
			return parseFloat(price);
		},

		getEbookPrice: function() {
			var price = "0원";
			$('em.yes_b').each(function(index) {
				if(index==1) {
					price = $(this).text();
				}
			});
			price = price.replace(/,/g,"");
			price = price.replace(/원/g, "");
			return parseFloat(price);
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
		},

		getAuthor: function() {
			var author = $('#title > p > a:eq(0)').text();
			return author;
		}
	},

	hanbit: {

		getBookType: function() {
			var url = location.href; 
			if(url.indexOf('/book/') != -1) {
				return 'book';
			}

			if(url.indexOf('/ebook/') != -1) {
				return 'ebook';
			}
			return 'undefined';
		},

		getBookName: function() {
			var title = $('strong.tl').text();
			return title;
		},

		getPrice: function() {
			var price = '0원';
			var type = bookInfo.hanbit.getBookType();
			if(type == 'book') {
				price = $('span.a2').text();
				var priceArray = price.split('(');
				price = priceArray[0];
			} else if(type == 'ebook') {
				var priceArea = $('div.pricebar2').html();
				var splitArray = priceArea.split('<br>');

				for(i=0 , len =splitArray.length ; i < len ; ++i) {
					var jqueryStr = "<div>" + splitArray[i] + "</div>"; 
					var html = $(jqueryStr);
					var id = html.find('input').val();
					var splitId = id.split("|");
					if(splitId.length == 2) {
						if(splitId[1] == 'print') {
							price = $(jqueryStr).find('strong.cC1').html();
						}
					}
				}	
			}
			
			price = price.replace(/,/g,"");
        	price = price.replace(/원/g, "");
        	return price == "" ? 0 :parseFloat(price);
        },
        
		getEbookPrice: function() {
			var price = '0원';
			var type = bookInfo.hanbit.getBookType();
			if(type == 'ebook') {
				var priceArea = $('div.pricebar2').html();
				var splitArray = priceArea.split('<br>');

				for(i=0 , len =splitArray.length ; i < len ; ++i) {
					var jqueryStr = "<div>" + splitArray[i] + "</div>"; 
					var id = $(jqueryStr).find('input[type="radio"]').val();
					var splitId = id.split("|");
					if(splitId.length == 2) {
						if(splitId[1] == 'ebook') {
							price = $(jqueryStr).find('strong.cC1').html();
						}
					}
				}	
			}
			
			price = price.replace(/,/g,"");
        	price = price.replace(/원/g, "");
			return price == "" ? 0 : parseFloat(price);
		},

		getISBN13: function(document) {
			var isbn13 = 'no isbn';
			var type = bookInfo.hanbit.getBookType();
			if(type == 'ebook') {
				$('input[name="productid"]').each(function(index) {
					if(index==0) {
						isbn13 = $(this).val();
					}
				});
				isbn13 = isbn13.split('|')[0];
			} else if(type == 'book') {
				var locationArray = location.href.split('isbn=');
				if(locationArray.length == 2) {
					return locationArray[1].replace(/-/g,'');
				}
			}
			
			return isbn13;
		},

		getImg: function() {
			var imgUrl = $('div.ctl > div.t1 > img').attr('src');
			return imgUrl
		},

		getAuthor: function() {
			var author = $('div.bx > div.set > strong').text();
			var authorSplit = author.split(']');
			if(authorSplit.length == 2) {
				author = authorSplit[1];
			}
			return author.trim();
			//return "true";
		}
	},

	amazon: {

		getBookType: function() {

		},

		getBookName: function() {
			var title = $('#productTitle').text();
			if(title == null || title == ''){
				title = $('#ebooksProductTitle').text();
			}
			return title;
		},

		getPrice: function() {
			var title, price = "";
			$('.a-nostyle.a-button-list.a-horizontal .swatchElement').each(function(index) {
				title = $(this).find('span > span > span > a > span:first').text();
				if(title == 'Hardcover'){
					price = $(this).find('span > span > span > a > span:eq(1)').text();
				}
			});

			if(price == ""){
				price = bookInfo.amazon.getPriceAllFind();
			}
			price = price.toString();
			price = price.replace(/from /g,"");
			price = price.replace(/,/g,"");
			price = price.replace(/\$/g, "");
			return price == "" ? 0 :parseFloat(price);
		},

		getEbookPrice: function() {
			var title, price = "";
			$('.a-nostyle.a-button-list.a-horizontal .swatchElement').each(function(index) {
				title = $(this).find('span > span > span > a > span:first').text();
				if(title == 'Kindle'){
					price = $(this).find('span > span > span > a > span:eq(1)').text();
				}
			});

			if(price == ""){
				price = bookInfo.amazon.getPriceAllFind();
			}

			price = price.toString();
			price = price.replace(/,/g,"");
			price = price.replace(/\$/g, "");
			return price == "" ? 0 :parseFloat(price);
		},

		getISBN13: function() {
			var isbn13 = '';
			var liStr;
			var flag = true;

			$('#productDetailsTable > tbody > tr > td > div > ul > li').each(function(index) {
				liStr = $(this).text();
				if(flag){
					if(liStr.indexOf('ISBN-13') > -1 || liStr.indexOf('ASIN') > -1){
						isbn13 = liStr;
						flag = false;
					}
				}
			});

			isbn13 = isbn13.replace(/ISBN-13: /g,"");
			isbn13 = isbn13.replace(/ASIN: /g,"");
			isbn13 = isbn13.replace(/-/g,"");
			return isbn13;
		},

		getImg: function() {
			var imgUrl = $('#img-canvas > img').attr('src');
			if(imgUrl == "" || imgUrl == undefined){
				imgUrl = $('#mainImageContainer > img').attr('src');
			}
			return imgUrl
		},

		getAuthor: function() {
			var author = $('.author.notFaded > span > a:eq(0)').text();
			if(author == null || author == ''){
				author = $('.author.notFaded > a').text();
			}
			return author;
		},

		getPriceAllFind: function(){
			var price = 0;
			$('#mediaTabs_tabSet > li').each(function(){
				if($(this).hasClass('a-active')){
					price = $(this).find('a > span > div:eq(1) > span').text();
				}
			});
			return price;
		}
	}
};

// get book info
bookInfo.init();