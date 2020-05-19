var closeWebview = function() {
    tMobileSDK.closeWebview();
};
$(document).ready(function() {
    tMobileSDK.ready(function() {
        var data = {
            l: {
                class: "",
                event: "closeWebview();",
                title: ""
            },
            c: {
                class: "",
                title: "查验结果"
            },
            r: {
                show: false
            }
        };
        tMobileSDK.buildHeader(data);
        function getQueryParams() {
            var qs =
                    location.search.length > 0 ? location.search.substr(1) : "",
                args = {},
                items = qs.length > 0 ? qs.split("&") : [],
                item = null,
                name = null,
                value = null,
                i = 0,
                len = items.length;
            for (i = 0; i < len; i++) {
                item = items[i].split("=");
                name = decodeURIComponent(item[0]);
                value = decodeURIComponent(item[1]);

                if (name.length) {
                    args[name] = value;
                }
            }
            return args;
        }
        var addQueryStringToUrl = function(url, options) {
            if (!options) {
                return url;
            }
            var newUrl = url;
            if (newUrl.indexOf("?") === -1) {
                newUrl += "?";
            }
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    newUrl +=
                        "&" +
                        encodeURIComponent(key) +
                        "=" +
                        encodeURIComponent(options[key]);
                }
            }
            return newUrl;
        };

        var resultKeys = [
            {
                id: "InvoiceCode",
                value: "发票代码"
            },
            {
                id: "InvoiceNum",
                value: "发票号码"
            },
            {
                id: "InvoiceDate",
                value: "发票日期"
            },
            {
                id: "TotalAmount",
                value: "开具金额"
            }
        ];
        var createDom = function(arr) {
            var sellerKeysDom = "";
            $.each(arr, function(i, item) {
                var liDom = "";
                var spanDom = "";
                var itemValue = item.value;
                for (var j = 0; j < itemValue.length; j++) {
                    var letter = itemValue.substr(j, 1);
                    spanDom += '<span class="span-text">' + letter + "</span>";
                }
                liDom =
                    '<li class="line-content-item"><div class="key">' +
                    spanDom +
                    '</div><span class="pull-left">：</span><div class="value" id="' +
                    item.id +
                    '">--</div></li>';
                sellerKeysDom += liDom;
            });
            return sellerKeysDom;
        };
        $(".main").append(createDom(resultKeys));

        var stateImgMap = {
            // 不一致
            "0": "atypism_icon@3x.png",
            // 查无此票
            "1": "noticket_icon@3x.png",
            // 识别失败
            "2": "2019090wt.png"
        };

        var qsParams = getQueryParams();
        var getScanResult = function(opt) {
            $.ajax({
                url: "/general/appbuilder/web/invoice/invoice/invoicetips",
                data: opt,
                // type: "post",
                success: function(res) {
                    if (res.status) {
                        var data = res.data;
                        var state = data.state;

                        if (state === "2") {
                            $(".main").remove();
                            var resultImgDom;
                            if (res.data.is_pdf === "1") {
                                resultImgDom =
                                    '<div class="pdf-wrap">' +
                                    res.data.ImgUrl +
                                    "</div>";
                            } else {
                                resultImgDom =
                                    '<img  src="' +
                                    data.ImgUrl +
                                    '" class="result-img">';
                            }

                            $(".invoice-info").append(resultImgDom);
                            $(".result-img").tap(function(e) {
                                tMobileSDK.previewImage({
                                    urls: [e.target.src],
                                    allowDownload: false,
                                    onSuccess: function() {}
                                });
                            });
                        } else {
                            $.each(resultKeys, function(i, item) {
                                var key = item.id;
                                var val = $.trim(data[key]);
                                if (val) {
                                    $("#" + key).text(val);
                                }
                            });
                            $("#InvoiceTypeOrg").text(data.InvoiceTypeOrg);
                        }

                        var stateImgDom =
                            '<img  src="./img/' +
                            stateImgMap[state] +
                            '" class="state-img">';
                        $(".invoice-info")
                            .append(stateImgDom)
                            .addClass("state-" + state + " show");
                    }
                }
            });
        };
        getScanResult(qsParams);
    });
});
