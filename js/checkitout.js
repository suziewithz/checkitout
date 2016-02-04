var checkitout = {

	init: function(){

	},

	addEvent: function(){

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
}

$(document).ready(function() {
    checkitout.init();
});