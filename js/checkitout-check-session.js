checkitout.member = {};

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
						if(rcode != 'RET0000'){
							$(location).attr('href', '/html/signin.html');
						}
						else{
							checkitout.member = result.rdata.entityList[0];
							checkitout.check_session.renderText();
						}
					}
				}
			},
			error: function () {

			}
		});
	},

	renderText: function(){
		var teamStr = checkitout.member.teamName;
		var userStr = checkitout.member.userName;
		var teamIdStr = '[' + teamStr + '] </br>' + userStr;
		$('#team_id_text').append(teamIdStr);
	}
}

$(document).ready(function() {
	checkitout.check_session.init();
});