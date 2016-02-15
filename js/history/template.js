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

        loadingScreen.remove();

        _.each(historyData, function (data, key) {
            var currentTemplate = listTemplate({'orderDate': key, 'books': data});

            historyScreen.append(currentTemplate);
        });
    };

    var setData = function (rawData) {
        _.each(rawData, function (entity) {
            var order = {};

            order['book'] = entity.book;
            order['status'] = entity.status.statusName;
            order['regDate'] = entity.regDttm;
            order['updateDate'] = entity.updDttm;

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