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
$("#myModal").modal();
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
$(".wrap").attr("id", current);
$("." + current).addClass("active");
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
        item.trans_id = item.id;
        var selectCls = "";
        if (selected.indexOf(item.id) !== -1) {
            selectCls = "selected";
        }
        // SellerName 销售方名称
        // item.SellerName = "北京通达科技有限公司";
        item.selectCls = selectCls;
        // 专用发票 是 1
        item.isNormal = item.InvoiceType !== 1 ? true : false;
        item.isNormalImgSrc = item.isNormal
            ? "./img/myticketfolder_ordinary_icon@3x.png"
            : "./img/myticketfolder_major_icon@3x.png";
        // state   0   未使用   1   已使用   all   全部
        item.isUsed = item.state === "1" ? true : false;
        item.usedCls = item.isUsed ? "used" : "";
        item.isUsedImgSrc = item.isUsed
            ? "./img/myticketfolder_used_icon@3x.png"
            : "./img/myticketfolder_notused_icon2@3x.png";
        item.money = item.AmountInFiguers;
        item.tax = item.TotalTax;
        item.time = item.InvoiceDate;
        var moneyDom =
            '<div class="money"><div class="value ellipsis" title="' +
            item.money +
            '">' +
            item.money +
            '</div><div class="des">金额(元)</div></div>';
        var taxDom =
            '<div class="tax"><div class="value ellipsis" title="' +
            item.tax +
            '">' +
            item.tax +
            '</div><div class="des">税额</div></div>';
        var liDom =
            '<li class="apply-list-item ' +
            item.usedCls +
            '" data-trans_id="' +
            item.trans_id +
            '"><div class="overlay"></div><div class="img-wrap"><div class="img-select ' +
            item.selectCls +
            '"><img  class="image" src="./img/select_icon@3x.png"></div></div><div class="isNormal"><img src="' +
            item.isNormalImgSrc +
            '"></div><div class="title"><img src="./img/myticketfolder_name_icon@3x.png"><div class="title-text ellipsis">' +
            item.SellerName +
            '</div></div><div class="content-wrap"><div class="content">' +
            moneyDom +
            taxDom +
            '</div><img src="' +
            item.isUsedImgSrc +
            '"></div><div class="title top-border"><img src="./img/myticketfolder_time_icon@3x.png"><div class="title-text ellipsis"><span class="time-des">开票时间：</span><span class="time-value">' +
            item.time +
            "</span></div></div></li>";
        dom += liDom;
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
    }
};
var arr = ["all", "unused", "used"];
var createBtn = function(arr) {
    $.each(arr, function(i, item) {
        $("." + item).on("click", function(e) {
            if (item !== current) {
                $("." + current).removeClass("active");
                $(e.currentTarget).addClass("active");
                current = item;
                $(".wrap").attr("id", current);
                pageNo = 1;
                fetchData();
            }
        });
    });
};
createBtn(arr);
$(".reimbursement-btn").on("click", function() {
    $(".wrap").addClass("selecting");
});
$(".cancel-btn").on("click", function() {
    selected = [];
    $(".img-select").removeClass("selected");
    $(".wrap").removeClass("selecting");
});
$(".next-btn").on("click", function() {
    if (selected.length) {
        ins.showModal();
    }
});
var saveByFlowId = function(flowId) {
    var tmpObj = {
        billId: selected.join(","),
        flowId: flowId
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
var fetchData = function() {
    var state = dataMapType[current].type;
    $.ajax({
        url: "/general/appbuilder/web/invoice/invoice/invoicelist",
        data: {
            state: state,
            pageSize: pageSize,
            keyword: keyword,
            pageNo: pageNo,
            flowId: flowId,
            prcsId: prcsId,
            flowPrcs: flowPrcs,
            runId: runId
        },
        success: function(res) {
            if (res.status) {
                total = parseInt(res.total, 10);
                if (total) {
                    createData(res.data);
                    $(".apply-list-item ").on("click", function(e) {
                        var trans_id = $(e.currentTarget).attr("data-trans_id");
                        if ($(".wrap").hasClass("selecting")) {
                            if (
                                $(e.target).hasClass("img-wrap") ||
                                $(e.target).hasClass("img-select") ||
                                $(e.target).hasClass("image")
                            ) {
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
                            }
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

                            location.href = addQueryStringToUrl(url, tmpObj);
                            // console.log("go-detail");
                        }
                    });
                } else {
                    $(".list-content")
                        .empty()
                        .append(emptyDom);
                }
                pag();
            }
        }
    });
};
var ins = new SelectFlow({
    cb: function() {
        $(".reimbursement-btn").addClass("show");
    },
    save: saveByFlowId
});

fetchData();
