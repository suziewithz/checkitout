/**
 * Created by kyuta on 2016. 2. 12..
 */

require(['template', 'message', 'jquery',
    '/js/util/constants.js'], function (templateManager, messageManager) {

    var loadingScreen = $("#spinner");

    var loginCheck = function () {
        $.ajax({
            url: CONSTANT.BASEURL + '/userinfo',
            method: "POST",
            success: function (result, status, xhr) {
                if (xhr.status == 200) {
                    if (result != null) {
                        if (!result.rcode == 'RET0000') {
                            $(location).attr('href', '/html/signin.html');
                        }
                    }
                }
            },
            error: function () {
                console.log('error on loginCheck');
            }
        });
    }();

    var getHistory = function () {
        $.ajax({
            url: CONSTANT.BASEURL + '/api/v1/order/my',
            method: "GET",
            success: function (data, status, xhr) {
                if (xhr.status == 200) {
                    if (data != null) {
                        templateManager.setBooks(data);
                    }
                }
            },
            error: function () {
                console.log('error on getHistory');
            }
        });
    }();

    $('#btn_go_to_request').click(function () {
        $(location).attr('href', 'requestBook.html');
    });

    $('#btn_go_to_cart').click(function () {
        $(location).attr('href', 'cart.html');
    });

    $('#btn_go_to_history').click(function () {
        $(location).attr('href', 'history.html');
    });

    $('#history').on('click', 'div.delete', function (event) {
        var clickedElement = $(this);

        messageManager.sendMessage('도서 주문 신청을 취소하시겠습니까?', 4000, '신청 취소', function () {
            $('#history').find('section.history-card').hide();
            loadingScreen.show();

            $.ajax({
                url: CONSTANT.BASEURL + '/api/v1/order/cancel',
                method: 'POST',
                data: {orderSrl: clickedElement.data('order')},
                success: function (result, status, xhr) {
                    if (xhr.status == 200) {
                        if (result == 'cancelOk') {
                            location.reload();
                        }
                    }
                },
                error: function (xhr, status, error) {
                    console.log(xhr);
                    console.log(status);
                    console.log(error);
                }
            });
        });
    });

});

requirejs.config({
    paths: {
        'jquery': [
            '/js/jquery.min'
        ],
        'underscore': [
            '/js/lib/underscore.min'
        ],
        'moment': [
            '/js/lib/moment.min'
        ]
    },
    shim: {
        'underscore': {
            exports: function () {
                return _;
            }
        }
    }
});