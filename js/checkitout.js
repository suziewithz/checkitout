var checkitout = {
	jsseionId : '',

	init: function(){
		checkitout.addEvent();
	},

	addEvent: function(){
		//$('#test').click(function() {
		//	checkitout.testpopup();
		//});
	},

    test: function() {
        $.ajax({
            url: 'http://local.coupang.com:9999/index',
            method: "GET",
            //data: { category: category, productName: productName },
            success: function (result, status, xhr) {
                 var ct = xhr.getResponseHeader("content-type") || "";
                 if (ct.indexOf('html') > -1) {
                     //Sesseion exfired, Redirect login page
                     $(location).attr('href', 'http://' + window.location.host + '/login');
                 }
                 else if (xhr.status == 200) {
                     //GET Ok
                     if (result != null) {
                         //coukie.index.appendRow(result);
                     }
                 }
            },
            error: function () {
                //$(location).attr('href','http://'+window.location.host+'/index');
            }
        });
    },

	getJSession: function(){
		chrome.cookies.get({"name":"JSESSIONID", "url":"http://local.coupang.com/"}, function(cookie) {
			if(cookie != null) {
				checkitout.jsseionId = JSON.parse(cookie.value);
			}
		});
	}
}

$(document).ready(function() {
    checkitout.init();
});