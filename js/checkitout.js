var checkitout = {

	init: function(){
		checkitout.addEvent();
	},

	addEvent: function(){
		//$('#test').click(function() {
		//	checkitout.testpopup();
		//});
	},

    getProduct: function(category, productName) {
        $.ajax({
            url: 'http://' + window.location.host + '/api/v1/product/list',
            method: "GET",
            data: { category: category, productName: productName },
            success: function (result, status, xhr) {

                // var ct = xhr.getResponseHeader("content-type") || "";
                // if (ct.indexOf('html') > -1) {
                //     //Sesseion exfired, Redirect login page
                //     $(location).attr('href', 'http://' + window.location.host + '/login');
                // }
                // else if (xhr.status == 200) {
                //     //GET Ok
                //     if (result != null) {
                //         coukie.index.appendRow(result);
                //     }
                // }
            },
            error: function () {
                //$(location).attr('href','http://'+window.location.host+'/index');
            }
        });
    },

	testpopup: function(){

		//chrome.browserAction.onClicked.addListener(function() {
		//	var w = 440;
		//	var h = 220;
		//	var left = (screen.width/2)-(w/2);
		//	var top = (screen.height/2)-(h/2);
		//
		//	chrome.windows.create({'url': 'http://local.coupang.com:9999/login_google', 'type': 'popup', 'width': w, 'height': h, 'left': left, 'top': top} , function(window) {
		//	});
		//});
	}
}

$(document).ready(function() {
    checkitout.init();
});