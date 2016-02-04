function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function renderPrice(priceText) {
	document.getElementById('price').textContent = priceText;
}
	
document.addEventListener('DOMContentLoaded', function() {
	chrome.identity.getProfileUserInfo(function(userInfo) {
		renderStatus(userInfo.email);
	});
});

function onWindowLoad() {
    chrome.tabs.executeScript(null, {
        file: "getPrice.js"
        }, function() {
            if (chrome.extension.lastError) {
                document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
            }
        });
}

window.onload = onWindowLoad;

chrome.extension.onMessage.addListener(function(request, sender) {
    if (request.action == "getPrice") {
    	renderPrice(request.source);
    }
});