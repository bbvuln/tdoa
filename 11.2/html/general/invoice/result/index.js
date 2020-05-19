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
    var qs = location.search.length > 0 ? location.search.substr(1) : "",
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
};
var qsParams = getQueryParams();

var stateTextMap = {
    // 不一致
    "0": "不一致",
    // 查无此票
    "1": "查无此票",
    // 识别失败
    "2": "识别失败"
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
                $(".state-text").text(stateTextMap[state]);
                if (state === "2") {
                    var resultImgDom =
                        '<img  src="' + data.ImgUrl + '" class="result-img">';
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
                $("#floatwin").addClass("state-" + state + " show");
            }
        }
    });
};
$("#closebt").on("click", function() {
    window.close();
});
$("#printfp").on("click", function(e) {
    try {
        document.execCommand("print", false, null);
    } catch (e) {
        print();
    }
});
getScanResult(qsParams);
