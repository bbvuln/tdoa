if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;

        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        var len = O.length >>> 0;

        if (len === 0) {
            return -1;
        }

        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        if (n >= len) {
            return -1;
        }

        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
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
var getQueryParams = function() {
    var qs = location.search.length > 0 ? location.search.substr(1) : "";
    var args = Qs.parse(qs);
    return args;
};
var qsParams = getQueryParams();

// var stateTextMap = {
//     // 不一致
//     "0": "不一致",
//     // 查无此票
//     "1": "查无此票",
//     // 识别失败
//     "2": "识别失败"
// };
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
var createDom = function(keys) {
    var dom = "";
    $.each(keys, function(i, item) {
        var id = item.id;
        var value = item.value;
        var liDom =
            '<tr><td class="bg-color" width="450px"><div class="content-key">' +
            value +
            '：</div></td><td width="576px"><div class="content-value ellipsis" id="' +
            id +
            '">-</div></td></tr>';
        dom += liDom;
    });
    $(".content-table-tbody").append(dom);
};
createDom(resultKeys);
var getScanResult = function(opt) {
    $.ajax({
        url: "/general/appbuilder/web/invoice/invoice/invoicetips",
        data: opt,
        // type: "post",
        success: function(res) {
            if (res.status) {
                var data = res.data;
                var state = data.state;
                var msg = res.data.message ? res.data.message : "";
                $(".state-text").text(msg);
                if (state === "2") {
                    var resultImgDom;
                    if (data.is_pdf === "1") {
                        resultImgDom =
                            '<iframe src="' + data.ImgUrl + '" ></iframe>';
                    } else {
                        resultImgDom =
                            '<img  src="' +
                            data.ImgUrl +
                            '" class="result-img">';
                    }

                    $(".img-wrap").append(resultImgDom);
                } else {
                    $.each(resultKeys, function(i, item) {
                        var id = item.id;
                        $("#" + id)
                            .text(data[id])
                            .attr("title", data[id]);
                    });
                    $("#InvoiceTypeOrg").text(data.InvoiceTypeOrg);
                }
                $("#result_width").addClass("state-" + state + " show");
            }
        }
    });
};
$("#closebt").on("click", function() {
    window.close();
    location.href = "/general/sms/remind_center/receive/";
});
$("#printfp").on("click", function(e) {
    $("#print_area").printArea();
    // try {
    //     document.execCommand("print", false, null);
    // } catch (e) {
    //     print();
    // }
});
getScanResult(qsParams);
