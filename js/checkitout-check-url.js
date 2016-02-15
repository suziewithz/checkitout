checkitout.checkUrl = {
	renderView: function(curUrl){
		var $contents = $('.mdl-layout__content');

		var yes24 = 'www.yes24.com/24/goods';
		var yes24Ebook = 'www.yes24.com/24/Goods';
		var hanbit = 'www.hanbit.co.kr/ebook/look';
		var hanbitEbook = 'www.hanbit.co.kr/book/look';
		var amazone = 'www.amazon.com/gp/product';
		var amazoneRex = new RegExp("www.amazon.com\/.*\/dp\/.*");

		if(curUrl.indexOf(yes24) == -1
			&& curUrl.indexOf(yes24Ebook) == -1
			&& curUrl.indexOf(hanbit) == -1
			&& curUrl.indexOf(hanbitEbook) == -1
			&& curUrl.indexOf(amazone) == -1
			&& !amazoneRex.test(curUrl)){
			$contents.empty();
			var tmp =
				'<div class="login-box is-active" id="overview">'
				+ '<section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp mdl-link-card">'
				+ '<div class="mdl-card mdl-cell mdl-cell--12-col">'
				+ '<div class="mdl-card__supporting-text">'
				+ '<h4>Info</h4>'
				+ 'Only use PDP page'
				+ '<br><h5><a href="http://www.yes24.com/" target="_blank">http://www.yes24.com</a></h5>'
				+ '<h5><a href="http://www.hanbit.co.kr/" target="_blank">http://www.hanbit.co.kr</a></h5>'
				+ '<h5><a href="http://www.amazon.com/" target="_blank">http://www.amazon.com</a></h5>'
				+ '</div>'
				+ '</div>'
				+ '</section>'
				+ '</div>';
			$contents.append(tmp);
		}
	}
}

$(document).ready(function() {
	chrome.tabs.executeScript(null, {
		file: "js/getUrl.js"
	}, function() {
		if (chrome.extension.lastError) {
			document.body.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
		}
	});
});

chrome.extension.onMessage.addListener(function(request, sender) {
	if (request.action == "getUrl") {
		checkitout.checkUrl.renderView(request.source);
	}
});