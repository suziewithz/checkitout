var checkitout = {};
checkitout.signin = {
	jsseionId : '',
	baseUrl : 'http://local.coupang.com:9999',
	init: function(){
		checkitout.signin.addEvent();
	},

	addEvent: function(){
	},

    test: function() {
        $.ajax({
            url: checkitout.signin.baseUrl + '/index',
            method: "GET",
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

}

$(document).ready(function() {
	checkitout.signin.init();
});