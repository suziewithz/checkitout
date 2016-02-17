var cartPage = {
    baseUrl : 'http://local.coupang.com:9999',
    cartList:{},
    limitCredit : 50000,
    init: function() {
        Number.prototype.format = function(){
            if(this==0) return 0;

            var reg = /(^[+-]?\d+)(\d{3})/;
            var n = (this + '');

            while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');

            return n;
        };

        String.prototype.format = function(){
            var num = parseFloat(this);
            if( isNaN(num) ) return "0";

            return num.format();
        };
        cartPage.bindEvent();
        cartPage.load();
    },
    load: function() {
        cartPage.loadList(function() {
            cartPage.makeList();
            cartPage.bindDynamicEvent();
        });
    },
    loadList : function(callback) {
        cartStorage.loadAllItems(function(data) {
            cartPage.cartList = data;
            callback();
        });
    },
    makeCard : function(book) {
        var card = '';
        var key = book.isbn13 + "|" + book.bookType;
        card += '<div class="demo-card-image mdl-card mdl-shadow--2dp mdl-cell mdl-cell--3-col" style="background:url(\''+book.imgUrl + '\') top / cover ; background-repeat: no-repeat;">';
        card += '<div id="'+key+'" class="mdl-card__title mdl-card--expand"></div>';
        card += '<div id="' + key + '" class="mdl-card__actions book-title"><div>';
        card += book.bookName;
        card += '</div></div>';
        card += '<div class="card-custom-area">';
        card += '<div class="book_type">' + book.bookType + '</div>'
        if(book.url.indexOf('amazon.com')!=-1) {
            card += '<div class="money">'+book.price.format()+'$</div>';
        } else {
            card += '<div class="money">'+book.price.format()+'원</div>';
        }
        card += '<div class="clearFix"></div>';
        card += '</div><div class="card-custom-area">';
        card += '<button alt="링크로 이동" value="' + book.url + '" class="button_url mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">link</i></button>';
        card += '<button alt="삭제하기" value="' + key + '" class="button_delete_item mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">delete</i></button>';
        card += '</div></div>';
        card += '</div>';
        card += '</div>';
        return card;
    },
    makeList : function() {
        var tbodyParent = $('.parent_tr');
        var bookList = cartPage.cartList;
        var i = 0;
        tbodyParent.html('');
        for(key in bookList) {
            var bookItem = bookList[key];
            tbodyParent.append(cartPage.makeCard(bookItem)).trigger("create");
            i++;
        }

        if(i == 0) {
            $('#tip').html('<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">찜 목록에 담긴 책이 없습니다. :)</a>');
        } else {
            $('#tip').html('<a class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored"><i class="material-icons">information</i></button>구매하려는 책을 클릭하면 구매 신청을 할 수 있습니다. :)</a>');
        }
    },
    bindDynamicEvent : function() {
        $('button.button_url').click(function() {
            cartPage.focusOrCreateTab($(this).val());
        });

        $('button.button_delete_item').click(function() {
            cartStorage.removeItems([$(this).val()], function() {
                cartPage.load();
            });
        });

        $('.mdl-card--expand, .mdl-card__actions').click(function() {
            var key = $(this).attr('id');
            var book = cartPage.cartList[key];
            if(book != null) {
                cartPage.setDialogContent(book);
                var dialog = document.querySelector('dialog');
                if (! dialog.showModal) {
                    dialogPolyfill.registerDialog(dialog);
                }
                dialog.showModal();
            }
            
        });
    },
    bindEvent : function() {
        $('#btn_go_to_request').click(function () {
            $(location).attr('href', 'requestBook.html');
        });

        $('#btn_go_to_cart').click(function () {
            $(location).attr('href', 'cart.html');
        });

        $('#btn_go_to_history').click(function () {
            $(location).attr('href', 'history.html');
        });
        
        $('button#button_delete_all').click(function() {
            cartStorage.clear(function() {
                cartPage.load();
            });
        });

        $('.mdl-dialog__actions button.order').click(function() {
            cartPage.orderBook($(this).val());
        });

        $('.mdl-dialog__actions button.close').click(function() {
            var dialog = document.querySelector('dialog');
            dialog.close();
        });
    },
    setDialogContent : function(book) {
        var dialog = $('dialog');
        var title = '<button class="mdl-button mdl-js-button mdl-button--icon"><i class="material-icons">shopping basket</i></button>';
        dialog.find('div#dialog_order_title').html(title + "Order [" + book.bookType + "]");
        var title = dialog.find('div#dialog_book_title').html(book.bookName);
        var price = 0;
        if(book.bookType == 'ebook') {
            price = book.ebookPrice;
            $('.dialog_ebook_info').show();
        }
        else {
            price = book.price;
            $('.dialog_ebook_info').hide();
        } 

        if(checkitout.member.totalAmount + price > cartPage.limitCredit) {
            $('.dialog_alert_credit').show();
        } else {
            $('.dialog_alert_credit').hide();
        }

        if(book.isInappropriate) {
            $('.dialog_alert_reject').show();
        } else {
            $('.dialog_alert_reject').hide();
        }
        
        dialog.find('#dialog_before_credit').html("이전 누적금액 : " + checkitout.member.totalAmount.format() + "원");
        
        if(book.url.indexOf('amazon.com')!=-1) {
            dialog.find('#dialog_price').html("price : " + price.format() + "$ (1$ : 1200원)");    
            dialog.find('#dialog_after_credit').html("합산 누적금액 : " + (checkitout.member.totalAmount + price * 1200).format() + "원");
        } else {
            dialog.find('#dialog_price').html("price : " + price.format() + "원");
            dialog.find('#dialog_after_credit').html("합산 누적금액 : " + (checkitout.member.totalAmount + price).format() + "원");
        }

        dialog.find('button.order').val(book.isbn13 + "|" + book.bookType);

    },
    closeDialog : function() {
        var dialog = document.querySelector('dialog');
        dialog.close();
    },
    orderBook: function(key) {
        console.log(key);
        var book = cartPage.cartList[key];

        if(book == null) {
            cartPage.load();
        } else {
            var price;

            if(book.bookType.toLowerCase() == 'ebook'){
                price = book.ebookPrice;
            }
            else{
                price = book.price;
            }

            var booksDto = {
                "bookSrl": 0,
                "isbn": book.isbn13,
                "title": book.bookName,
                "author": book.author,
                "url": book.url,
                "isInappropriate": "false"
            };

            $.ajax({
                url: cartPage.baseUrl + '/api/v1/order/new',
                method: "POST",
                dataType:"json",
                data: { booksDto: JSON.stringify(booksDto), bookType: book.bookType, price: price },
                success: function (result, status, xhr) {
                    if (xhr.status == 200) {
                        if (result != null) {
                            var rcode = result.rcode;
                            if(rcode == 'RET0000'){
                                checkitout.member = result.rdata.entityList[0];
                                cartPage.setSnackBar('The order has been requested!', 1000, null, "ok");
                                cartStorage.removeItems([key],function() {
                                    cartPage.load();
                                });
                                cartPage.closeDialog();
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
        
    },
    focusOrCreateTab : function(url) {
      chrome.windows.getAll({'populate':true}, function(windows) {
        var existing_tab = null;
        for (var i in windows) {
          var tabs = windows[i].tabs;
          for (var j in tabs) {
            var tab = tabs[j];
            if (tab.url == url) {
              existing_tab = tab;
              break;
            }
          }
        }
        if (existing_tab) {
          chrome.tabs.update(existing_tab.id, {'selected':true});
        } else {
          chrome.tabs.create({'url':url, 'selected':true});
        }
      });
    },
    setSnackBar : function(_message, _timeout, _actionHandler, _actionText) {
        'use strict';
            var data = {
                message: _message,
                timeout: _timeout,
                actionHandler: _actionHandler,
                actionText: _actionText
            };
            var snackbarContainer = document.querySelector('#snackbar');
            console.log("Why");
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
    }

};

$(document).ready( function() {
    cartPage.init();
});
