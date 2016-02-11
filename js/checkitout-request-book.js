checkitout.check_session = {
	jsseionId : '',
	baseUrl : 'http://local.coupang.com:9999',
	init: function(){
		checkitout.check_session.checkSession();
	},

	checkSession: function() {
		$.ajax({
			url: checkitout.check_session.baseUrl + '/userinfo',
			method: "POST",
			success: function (result, status, xhr) {
				if (xhr.status == 200) {
					if (result != null) {
						var rcode = result.rcode;
						if(rcode == 'RET0000'){
							$(location).attr('href', '/html/requestBook.html');
						}
						else{
							$(location).attr('href', '/html/signin.html');
						}
					}
				}
			},
			error: function () {

			}
		});
	}
}

$(document).ready(function() {
	checkitout.check_session.init();
});