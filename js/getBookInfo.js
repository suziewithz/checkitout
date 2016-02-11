function get_book_name(document) {
	var title = $('#title > h1 > a').text();
	$('#title').find('.subtitle').each( function() {
		title = title + $(this).text();
	});
	return title;
}

function get_price(document) {
	var price = "";
	$('em.yes_b').each(function(index) {
		if(index==0) {
			price = $(this).text();
		}
	});
	return price;
}

function get_ebook_price(document) {
	var price = "";
	$('em.yes_b').each(function(index) {
		if(index==1) {
			price = $(this).text();
		}
	});
	return price;
}

function get_url() {
	return location.href
}

function getISBN13(document) {
	var isbn13 = document.getElementsByClassName("isbn10")[0].getElementsByTagName("p")[0].innerHTML
	return isbn13
}

chrome.extension.sendMessage({
    action: "getPrice",
    source: get_price(document)
});

chrome.extension.sendMessage({
	action: "getEbookPrice",
	source: get_ebook_price(document)
});

chrome.extension.sendMessage({
    action: "getBookName",
    source: get_book_name(document)
});

chrome.extension.sendMessage({
    action: "getUrl",
    source: get_url()
});

chrome.extension.sendMessage({
    action: "getISBN13",
    source: getISBN13(document)
});