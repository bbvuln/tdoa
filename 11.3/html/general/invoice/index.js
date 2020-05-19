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
var throttle = function(fn, delay) {
    var timer = null;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
};

var tipModal = new TipModal({
    // text: "您正在使用的模块是票夹子(体验版)，该功能尚未正式发布，仅供体验了解",
    id: "tipModal"
});

var checkauth = function(cb) {
    $.ajax({
        url: "/general/appbuilder/web/invoice/invoice/checkauth",
        type: "GET",
        success: function(res) {
            if (res.status) {
                if (res.flag === "1") {
                    cb();
                } else {
                    var msg = res.message;
                    tipModal.changeText(msg);
                    tipModal.showModal();
                }
            }
        }
    });
};
var uploadSuccess = new TipModal({
    text: "该票据已上传，识别结果稍后通知您",
    id: "uploadSuccess"
});
var flowTip = new TipModal({
    text: "请先创建票据报销流程",
    id: "flowTip"
});
var refresh = function(url) {
    location.href = url;
};

var total = 0;
var keyword = "";
var pageNo = 1;
var pageSize = 40;
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
var queryParams = getQueryParams();
var flowId = queryParams.flowId ? queryParams.flowId : "";
var prcsId = queryParams.prcsId ? queryParams.prcsId : "";
var flowPrcs = queryParams.flowPrcs ? queryParams.flowPrcs : "";
var runId = queryParams.runId ? queryParams.runId : "";
var current = queryParams.type ? queryParams.type : "all";
// $(".wrap").attr("id", current);
// $("." + current).addClass("active");
var invoiceTypeArr = [];
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
var pag = function() {
    $(".M-box3")
        .unbind()
        .empty();
    $(".M-box3").pagination(
        {
            totalData: total,
            // pageCount: 1,
            current: pageNo,
            showData: pageSize,
            mode: "fixed",
            jump: true,
            coping: false,
            homePage: "首页",
            endPage: "末页",
            prevContent: "<上页",
            nextContent: "下页>",
            callback: function(api) {
                // console.log(api);
            }
        },
        function(a) {
            // setPageCount = a.setPageCount;
        }
    );
};
var selected = [];
var filterArr = function(ary, id) {
    var arr = [];
    for (var i = 0; i < ary.length; i++) {
        var _id = ary[i];
        if (_id !== id) {
            arr.push(_id);
        }
    }
    return arr;
};
var filterSelect = function(id) {
    var arr = [];
    for (var i = 0; i < selected.length; i++) {
        var _id = selected[i];
        if (_id !== id) {
            arr.push(_id);
        }
    }
    selected = arr;
};
var createData = function(data) {
    var dom = "";
    $.each(data, function(i, item) {
        dom += createInvoiceCard({
            selected: selected,
            item: item
        });
    });
    $(".list-content")
        .unbind()
        .empty()
        .append(dom);
};
var dataMapType = {
    unused: {
        type: "0",
        text: "未使用",
        value: "unused"
    },
    used: {
        type: "1",
        text: "已使用",
        value: "used"
    },
    all: {
        type: "all",
        text: "全部",
        value: "all"
    },
    approval: {
        type: "2",
        text: "审批中",
        value: "approval"
    }
};
$(".type-value").text(dataMapType[current].text);
var hasFlow = false;
$(".reimbursement-btn").on("click", function() {
    if (hasFlow) {
        $(".wrap").addClass("selecting");
    } else {
        flowTip.showModal();
    }
});
$(".cancel-btn").on("click", function() {
    selected = [];
    $(".img-select").removeClass("selected");
    $(".wrap").removeClass("selecting");
});
$(".next-btn").on("click", function() {
    if (selected.length) {
        ins.showModal();
    } else {
        alert("请选择发票");
    }
});
var saveByFlowId = function(flowId) {
    var tmpObj = {
        billId: selected.join(","),
        flowId: flowId,
        flowPrcs: 1
    };
    $.ajax({
        url: "/inc/ocr/billToApproveCenter.php",
        type: "post",
        data: tmpObj,
        success: function(res) {
            location.href = res;
        }
    });
};
var emptyDom = '<div class="empty-wrap"><div>暂无数据</div></div>';
function viewMore(item, width) {
    var mywidth = 1260;
    if (width) {
        mywidth = width;
    }
    var myleft = (screen.availWidth - mywidth) / 2;
    var mytop = 25;

    var myheight = 740;
    window.open(
        item.subject_url,
        "read_notify" + item.id,
        "height=" +
            myheight +
            ",width=" +
            mywidth +
            ",status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" +
            mytop +
            ",left=" +
            myleft +
            ",resizable=yes"
    );
}
var hideQueryContent = function() {
    $(".query-content").removeClass("show");
};
var fetchData = function(opt) {
    var state = dataMapType[current].type;
    var params = {
        state: state,
        pageSize: pageSize,
        keyword: keyword,
        pageNo: pageNo,
        flowId: flowId,
        prcsId: prcsId,
        flowPrcs: flowPrcs,
        runId: runId
    };
    if (opt) {
        params = $.extend(true, params, opt);
        params.InvoiceType = invoiceTypeArr.join(",");
    }
    $.ajax({
        url: "/general/appbuilder/web/invoice/invoice/invoicelist",
        data: params,
        success: function(res) {
            if (res.status) {
                total = parseInt(res.total, 10);
                if (total) {
                    createData(res.data);
                    $(".overlay").on("click", function(e) {
                        e.stopPropagation();
                    });
                    $(".apply-list-item ").on("click", function(e) {
                        var trans_id = $(e.currentTarget).attr("data-trans_id");
                        if ($(".wrap").hasClass("selecting")) {
                            // if (
                            //     $(e.target).hasClass("img-wrap") ||
                            //     $(e.target).hasClass("img-select") ||
                            //     $(e.target).hasClass("image")
                            // ) {
                            if (selected.indexOf(trans_id) === -1) {
                                selected.push(trans_id);
                                $(e.currentTarget)
                                    .find(".img-select")
                                    .addClass("selected");
                            } else {
                                filterSelect(trans_id);
                                $(e.currentTarget)
                                    .find(".img-select")
                                    .removeClass("selected");
                            }
                            // }
                        } else {
                            var tmpObj = {
                                id: trans_id,
                                type: current,
                                flowId: flowId,
                                prcsId: prcsId,
                                flowPrcs: flowPrcs,
                                runId: runId
                            };
                            var url = "/general/invoice/invoicedetail/";

                            // location.href = addQueryStringToUrl(url, tmpObj);
                            viewMore({
                                subject_url: addQueryStringToUrl(url, tmpObj),
                                id: trans_id
                            });
                        }
                    });
                } else {
                    $(".list-content")
                        .empty()
                        .append(emptyDom);
                }
                pag();
                if (opt) {
                    hideQueryContent();
                }
            }
        }
    });
};
var ins = new SelectFlow({
    cb: function() {
        // $(".reimbursement-btn").addClass("show");
        hasFlow = true;
    },
    save: saveByFlowId
});

fetchData();
var tipUploadSuccess = function() {
    uploadSuccess.showModal();
};

var throttleFetchData = throttle(fetchData, 300);
var queryInputKeys = [
    "InvoiceNum",
    "SellerName",
    "minAmount",
    "maxAmount",
    "startTime",
    "endTime",
    "startLocation",
    "endLocation",
    "m-name"
];
var checkMoney = function(moneyStr) {
    // 金额正则
    var moneyReg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
    if (!moneyReg.test(moneyStr)) {
        alert("请正确输入金额");
        return false;
    }
    return true;
};
var check = function(obj) {
    if (obj.minAmount) {
        if (!checkMoney(obj.minAmount)) {
            return false;
        }
    }
    if (obj.maxAmount) {
        if (!checkMoney(obj.maxAmount)) {
            return false;
        }
    }
    if (obj.minAmount && obj.maxAmount) {
        if (parseFloat(obj.minAmount) > parseFloat(obj.maxAmount)) {
            alert("请正确输入金额");
            return false;
        }
    }
    if (obj.startTime && obj.endTime) {
        if (obj.startTime > obj.endTime) {
            alert("请正确输入日期");
            return false;
        }
    }
    return true;
};
var complexQuery = function() {
    var obj = {};
    $.each(queryInputKeys, function(i, item) {
        var val = $.trim($("#" + item).val());
        if (item === "m-name") {
            obj.name = val;
        } else {
            obj[item] = val;
        }
    });
    if (check(obj)) {
        throttleFetchData(obj);
    }
};
$(".select-type .dropdown-menu li").click(function(e) {
    var selectKey = $(e.target).attr("key");
    if (selectKey !== current) {
        current = selectKey;
        $(".type-value").text(dataMapType[current].text);
        pageNo = 1;
        complexQuery();
    }
});

var InvoiceTypeMapArr = {
    "01": ["InvoiceNum", "SellerName"],
    "04": ["InvoiceNum", "SellerName"],
    "10": ["InvoiceNum", "SellerName"],
    "21": ["name", "location"],
    "22": ["name", "location"],
    "23": ["InvoiceNum", "location"]
};
// 找出两个数组中的相同元素
var getArrEqual = function(arr1, arr2) {
    var newArr = [];
    for (var i = 0; i < arr2.length; i++) {
        for (var j = 0; j < arr1.length; j++) {
            if (arr1[j] === arr2[i]) {
                newArr.push(arr1[j]);
            }
        }
    }
    return newArr;
};
// 找到多个数组中的相同元素
var findCommonItem = function(arr) {
    var tmp = arr[0];
    for (var i = 1; i < arr.length; i++) {
        tmp = getArrEqual(tmp, arr[i]);
    }
    return tmp;
};
var showClsMap = {
    InvoiceNum: "InvoiceNum-wrap",
    SellerName: "SellerName-wrap",
    name: "name-wrap",
    location: "location-wrap"
};
$(".select-option").on("click", function(e) {
    var el = $(e.currentTarget);
    var clickTarget = el.attr("InvoiceType");
    if (invoiceTypeArr.indexOf(clickTarget) > -1) {
        // 选中变为未选中
        invoiceTypeArr = filterArr(invoiceTypeArr, clickTarget);
        el.find(".td-icon-select")
            .removeClass("td-icon-select")
            .addClass("td-icon-unselected");
    } else {
        invoiceTypeArr.push(clickTarget);
        el.find(".td-icon-unselected")
            .removeClass("td-icon-unselected")
            .addClass("td-icon-select");
    }
    $.each(showClsMap, function(i, item) {
        $("." + item).removeClass("show");
    });
    if (invoiceTypeArr.length) {
        var endArr = [];
        $.each(invoiceTypeArr, function(i, item) {
            endArr.push(InvoiceTypeMapArr[item]);
        });
        var showArr = findCommonItem(endArr);
        $.each(showArr, function(i, item) {
            $("." + showClsMap[item]).addClass("show");
        });
    }
});

var queryInput = function() {
    keyword = $.trim($("#queryInput").val());
    throttleFetchData();
};
$(".td-icon-search").on("click", function(e) {
    queryInput();
});
$(".td-icon-arrow").on("click", function(e) {
    $(".query-content").addClass("show");
});
$(".cancel-query").on("click", function(e) {
    hideQueryContent();
});
$(document).keydown(function(event) {
    if (event.keyCode === 13) {
        queryInput();
    }
});
$(".submit-query").on("click", function(e) {
    complexQuery();
});

// $(document).ready(function() {
//     $("img.DATE").bind("click", function() {
//         var date_format = $(this).attr("date_format");
//         if (!date_format) {
//             date_format = "yyyy-MM-dd";
//         }
//         var name = $(this).attr("name");
//         WdatePicker({ dateFmt: date_format, el: name });
//     });
// });
$(window).on("click", function(e) {
    var queryCity = document.getElementById("query-content");
    if (
        !queryCity.contains(e.target) &&
        !$(e.target).hasClass("td-icon-arrow")
    ) {
        hideQueryContent();
    }
});
var manualCheckInstance = new ManualCheck({
    onHidden: tipUploadSuccess
});

$(".manual-check").click(function() {
    checkauth(function() {
        manualCheckInstance.showModal();
    });
});
var billInstance = new BillUploader({
    onHidden: tipUploadSuccess
});

$(".upload-bill").click(function() {
    checkauth(function() {
        if (billInstance.loading) {
            alert("有文件在上传中、请稍候");
        } else {
            billInstance.showModal();
        }
    });
});
