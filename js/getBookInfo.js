function get_book_name(document) {
	var title = document.getElementById("title");
	var h1 = title.getElementsByTagName("h1")[0].getElementsByTagName("a")[0].innerHTML;
	var subtitle = title.getElementsByClassName("subtitle")[0].innerHTML;
	var ret = h1 + subtitle
	return ret
}

function get_price(document) {
	var productInfos = document.getElementsByClassName("tbGoodsInfo firstTb");
	var price = productInfos[0].getElementsByClassName("yes_b")
	return price[0].innerHTML
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