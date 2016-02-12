chrome.extension.sendMessage({
	action: "getUrl",
	source: getUrl()
});

function getUrl() {
	return location.href;
}