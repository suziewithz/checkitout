function get_price(document) {
	var productInfos = document.getElementsByClassName("tbGoodsInfo firstTb");
	var price = productInfos[0].getElementsByClassName("yes_b")
	console.log(price)
	return price[0].innerHTML
}

chrome.extension.sendMessage({
    action: "getPrice",
    source: get_price(document)
});