/**
 * Created by kyuta on 2016. 2. 15..
 */

define(["text!/html/template/history-list.hbs",
    "/js/lib/handlebars-v4.0.5.js", "underscore", "moment"], function (LIST_TEMPLATE, Handlebars, _, moment) {

    "use strict";

    var loadingScreen = $("#spinner");
    var historyScreen = $("#history");

    var historyData = {};
    var listTemplate = Handlebars.compile(LIST_TEMPLATE);

    var setBooks = function (data) {
        setData(data);

        loadingScreen.hide();

        _.each(historyData, function (data, key) {
            var currentTemplate = listTemplate({'orderDate': key, 'books': data});

            historyScreen.append(currentTemplate);
        });

        componentHandler.upgradeDom();
    };

    var setData = function (rawData) {
        _.each(rawData, function (entity) {
            var order = {};

            order['srl'] = entity.orderSrl;
            order['book'] = entity.book;
            order['price'] = entity.price;
            order['regDate'] = entity.regDttm;
            order['updateDate'] = entity.updDttm;

            switch (entity.status.statusCode) {
                case 1:
                    entity.status['icon'] = 'delete';
                    entity.status['message'] = '신청 취소';
                    break;
                case 2:
                case 3:
                case 4:
                    entity.status['icon'] = 'local_shipping';
                    break;
                case 5:
                    entity.status['icon'] = 'done';
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                    entity.status['icon'] = 'warning';
                    break;
            }

            order['status'] = entity.status;

            var orderDate = moment(entity.regDttm);
            var key = orderDate.format('YYYY년 MM월');

            var history = [];
            if (historyData.hasOwnProperty(key)) {
                history = historyData[key];
            }

            history.push(order);
            historyData[key] = history;
        });
    };

    return {
        setBooks: setBooks
    };
});