/**
 * Created by kyuta on 2016. 2. 12..
 */

require(["../js/jquery.min.js", "../js/material.min.js", "../js/util/constants.js"], function () {
    $(document).ready(function () {
        var history = (function () {
            var sendMessage = function (msg) {
                var messageToast = document.querySelector('#message-toast');
                var data = {
                    message: msg
                };

                messageToast.MaterialSnackbar.showSnackbar(data);
                //console.log(data);
            };

            var loginCheck = function () {
                $.ajax({
                    url: CONSTANT.BASEURL + '/userinfo',
                    method: "POST",
                    success: function (result, status, xhr) {
                        if (xhr.status == 200) {
                            if (result != null) {
                                if (result.rcode == 'RET0000') {
                                    sendMessage(result.rdata.entityList[0].realName + '님 환영합니다!');
                                }
                                else {
                                    $(location).attr('href', '/html/signin.html');
                                }
                            }
                        }
                    },
                    error: function () {
                        console.log('error');
                    }
                });
            }();

            var getHistory = function () {
                $.ajax({
                    url: CONSTANT.BASEURL + '/api/v1/order/my',
                    method: "GET",
                    success: function (result, status, xhr) {
                        if (xhr.status == 200) {
                            if (result != null) {
                                console.log(result);
                            }
                        }
                    },
                    error: function () {
                        console.log('error');
                    }
                });
            }();

        })();
    });
});