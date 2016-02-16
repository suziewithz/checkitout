/**
 * Created by kyuta on 2016. 2. 15..
 */

define(["/js/material.min.js"], function () {

    "use strict";

    var messageToast = document.querySelector('#message-toast');

    var sendMessage = function (msg, timeout, actionText, actionHandler) {

        var data = {
            message: msg,
            timeout: timeout,
            actionText: actionText,
            actionHandler: actionHandler
        };

        messageToast.MaterialSnackbar.showSnackbar(data);
    };

    return {sendMessage: sendMessage};
});