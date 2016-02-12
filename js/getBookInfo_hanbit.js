function get_book_name(document) {
	var title = $("strong.tl")[0].innerHTML;
	return title;
}

function get_price_ebook(document) {
	var divPriceInfos = $("div.pricebar2")[0];
	var prices = divPriceInfos.find("strong.cC1");
	return price[0].innerHTML;
}

function get_price(document) {
	var divPriceInfos = $("div.pricebar2")[0];
	var prices = divPriceInfos.find("strong.cC1");
	return price[2].innerHTML;
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