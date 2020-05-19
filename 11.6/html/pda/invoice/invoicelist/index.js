var closeWebview = function() {
    tMobileSDK.closeWebview();
};
var loading = false;
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
                    tip(msg);
                }
            }
        }
    });
};
var scan = function() {
    // location.href='http://192.168.1.62//pda/invoice/result/?&id=0&attach_id=466@1911_979377247&attach_name=%E5%8C%97%E4%BA%AC%E9%80%9A%E8%BE%BE%E4%BF%A1%E7%A7%91%E7%A7%91%E6%8A%80%E6%9C%89%E9%99%90%E5%85%AC%E5%8F%B82019%E4%BD%93%E6%A3%80%E9%A1%BB%E7%9F%A5.pdf&state=2&'
    checkauth(function() {
        if (!loading) {
            try {
                tMobileSDK.ocrScan({
                    fromCamera: true,
                    onSuccess: function(res) {
                        // console.log(res)
                        tip("该票据已上传，识别结果稍后通知您");
                        postImage(res);
                    }
                });
            } catch (error) {
                // alert(JSON.stringify(error));
            }
        }
    });
};
var createInvoiceCard = window.createInvoiceCard;
var postImage = function(res) {
    // $(".loading").addClass("show");
    // loading = true;
    $.ajax({
        url: "/general/appbuilder/web/invoice/invoice/ocr",
        // url:"http://192.168.1.62:3000/",
        data: Qs.stringify(res),
        type: "post",
        success: function(response) {
            // $(".loading").removeClass("show");
            // loading = false;
            // if (response.isinvoice === "1") {
            //     var obj = {};
            //     obj.imgId = res.id;
            //     obj.imgName = res.name;
            //     var url = addQueryStringToUrl(
            //         "/pda/invoice/invoicedetail/",
            //         obj
            //     );
            //     location.href = url;
            // } else {
            //     tip("未能成功识别，请重新拍摄");
            // }
        }
    });
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
var isReimbursement = false;
var toast = new Toast($("body"));
var tip = function(str) {
    toast.show(str);
};
function throttle(fn, delay) {
    var timer = null;
    return function() {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn.apply(context, args);
        }, delay);
    };
}
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
                title: "票夹子"
            },
            r: {
                class: "",
                title: "上传",
                event: "window.scan()"
            }
        };
        tMobileSDK.buildHeader(data);
        var createEmpty = function(text) {
            text ? null : (text = "暂无数据");
            return (
                '<div class="empty"><img class="img" src="/pda/officeProduct/applylist/img/todo_nodata_icon@3x.png"/><div class="empty-text">' +
                text +
                "</div></div>"
            );
        };
        var back = function() {
            location.href = "/pda/invoice/";
        };
        window.back = back;
        var emptyStr = createEmpty();
        (function() {
            var HomeTabs = function(el, opts) {
                this.init(el, opts);
            };
            HomeTabs.prototype = {
                init: function(el, opts) {
                    var defaultIndex = 0;
                    var data = opts.data ? opts.data : [];
                    var values = [];
                    var tabsNodes = "";
                    for (var i = 0; i < data.length; i++) {
                        var value = data[i].value;
                        var text =
                            '<div class="text">' + data[i].text + "</div>";
                        var liNode = "";
                        if (i === defaultIndex) {
                            liNode = '<li class="tab active">' + text + "</li>";
                        } else {
                            liNode = '<li class="tab">' + text + "</li>";
                        }
                        values.push(value);
                        tabsNodes += liNode;
                    }
                    tabsNodes = '<ul class="home-tabs">' + tabsNodes + "</ul>";
                    el.append(tabsNodes);
                    this.bindEvent(el, opts, values);
                },
                bindEvent: function(el, opts, values) {
                    var clickTab = opts.clickTab
                        ? opts.clickTab
                        : function() {};
                    el.children(".home-tabs").tap(function(e) {
                        var target = e.target;
                        if (e.target.className === "text") {
                            target = $(target).parent();
                        }
                        if (target.className !== "home-tabs") {
                            $(target)
                                .addClass("active")
                                .siblings()
                                .removeClass("active");
                            var index = $(target).index();
                            clickTab(values[index]);
                        }
                    });
                }
            };
            window.HomeTabs = HomeTabs;
        })();

        function trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
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
        var hasFlow = false;
        var queryParams = getQueryParams();
        var flowId = queryParams.flowId ? queryParams.flowId : "";
        var prcsId = queryParams.prcsId ? queryParams.prcsId : "";
        var flowPrcs = queryParams.flowPrcs ? queryParams.flowPrcs : "";
        var runId = queryParams.runId ? queryParams.runId : "";

        var current = "all";
        var keyword = "";
        var pageNo = 1;
        var pageSize = 10;
        var arr = ["all", "unused", "approval", "used"];
        var invoiceTypeArr = [];
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
        var data = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            data.push(dataMapType[item]);
        }
        var el = $(".tabs-wrap");
        var $searchIput = $("#apply-product-search");
        $searchIput.val("");
        var throttleFetchApplylist = throttle(fetchApplylist, 300);
        $searchIput.on("input", function(e) {
            var inputVal = $searchIput.val();
            var preKeyword = keyword;
            if (preKeyword !== inputVal) {
                pageNo = 1;
                keyword = trim(inputVal);
            }
            throttleFetchApplylist();
        });
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
        var complexQuery = function() {
            var obj = {};
            $.each(queryInputKeys, function(i, item) {
                var val = $("#" + item).val();
                if (item === "m-name") {
                    obj.name = val;
                } else {
                    obj[item] = val;
                }
            });
            if (check(obj)) {
                throttleFetchApplylist(obj);
                queryIns.hideDrawer();
            }
        };
        new HomeTabs(el, {
            data: data,
            clickTab: function(value) {
                current = value;
                $(".ui-container").attr("id", current);
                keyword = "";
                pageNo = 1;
                $searchIput.val("");
                complexQuery();
            }
        });
        var saveByFlowId = function(flowId) {
            $.ajax({
                url: "/inc/ocr/billToApproveCenter.php",
                type: "post",
                data: Qs.stringify({
                    billId: selected.join(","),
                    isMobile: "1",
                    flowId: flowId,
                    flowPrcs: 1
                }),
                success: function(res) {
                    location.href = res;
                }
            });
        };
        $(".office-product-list").addClass("show-reimbursement");
        var ins = new SelectFlow({
            cb: function() {
                // $(".office-product-list").addClass("show-reimbursement");
                hasFlow = true;
            },
            save: saveByFlowId
        });
        $(".reimbursement-btn").tap(function() {
            if (hasFlow) {
                if ($(".ui-list li").size()) {
                    // 展示两个按钮 在apply-list加标识
                    $(".reimbursement-btn").removeClass("show");
                    $(".btns").addClass("show");
                    $(".apply-list").addClass("selecting");
                }
            } else {
                tip("请先创建票据报销流程");
            }
        });
        var handleCancle = function() {
            selected = [];
            $(".img-select").removeClass("selected");
            $(".reimbursement-btn").addClass("show");
            $(".btns").removeClass("show");
            $(".apply-list").removeClass("selecting");
            $(".ui-dialog").removeClass("show");
        };
        $(".cancel").tap(function() {
            if (selected.length) {
                $(".cancle-dialog").addClass("show");
            } else {
                handleCancle();
            }
        });
        $(".btn-cancle").tap(function() {
            $(".ui-dialog").removeClass("show");
        });

        $(".btn-submit").tap(function() {
            handleCancle();
        });
        $(".save").tap(function() {
            if (selected.length) {
                // 执行报销
                handleSave();
            }
        });
        var handleSave = function() {
            ins.showDrawer();
        };
        function fetchApplylist(opt) {
            var list = $(".apply-list");
            list.empty();
            var params = {
                state: dataMapType[current].type,
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
            new gmu.Alist({
                el: list,
                template: {
                    item: $("#works-list-tmpl").html()
                },
                enablePullUp: false,
                enablePullDown: false,
                url: "/general/appbuilder/web/invoice/invoice/invoicelist",
                baseParam: params,
                itemclick: function() {
                    $(".office-product-list .ui-list").unbind();
                    $(".office-product-list .ui-list").on(
                        "tap",
                        ".apply-list-item",
                        function(e) {
                            var trans_id = $(e.currentTarget).attr(
                                "data-trans_id"
                            );
                            if (!$(e.target).hasClass("overlay")) {
                                if ($(".apply-list").hasClass("selecting")) {
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
                                    var tmp = {
                                        id: trans_id,
                                        flowId: flowId,
                                        prcsId: prcsId,
                                        flowPrcs: flowPrcs,
                                        runId: runId
                                    };
                                    var url = addQueryStringToUrl(
                                        "/pda/invoice/invoicedetail/",
                                        tmp
                                    );
                                    location.href = url;
                                }
                            }
                        }
                    );
                },
                dataFix: function(data) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        arr.push(
                            createInvoiceCard({
                                selected: selected,
                                item: data[i]
                            })
                        );
                    }
                    return arr;
                },
                param: function(dir, type, oldParam, changeDir) {
                    var data = {};
                    switch (dir) {
                        case "up":
                            pageNo = 1;
                            data.pageNo = pageNo;
                            changeDir("reload");
                            break;
                        case "down":
                            pageNo = pageNo + 1;
                            data.pageNo = pageNo;
                            break;
                        case "reload":
                            break;
                    }
                    return $.extend({}, this._options.baseParam, data);
                }
            });
        }
        fetchApplylist();

        var queryIns = new QueryContent();
        $(".date-wrap").each(function(index, item) {
            var defaultValue = "";
            var inputDateDom = $(this);
            $(item)
                .mobiscroll()
                .date({
                    theme: "ios7",
                    display: "bottom",
                    lang: "zh",
                    mode: "scroller",
                    dateFormat: "yy-mm-dd",
                    endYear: 3000,
                    onShow: function(html, valueText, inst) {
                        setTimeout(function() {
                            $(".dwbg").css({
                                top: "auto",
                                bottom: 0
                            });
                        });
                    },
                    defaultValue: defaultValue
                        ? new Date(defaultValue)
                        : new Date(),
                    onSelect: function(valueText, inst) {
                        //选择时事件（点击确定后），valueText 为选择的时间，
                        inputDateDom.attr("value", valueText);
                    }
                });
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
        $(".select-option").tap(function(e) {
            var el = $(e.currentTarget);
            var clickTarget = el.attr("InvoiceType");
            if (invoiceTypeArr.indexOf(clickTarget) > -1) {
                // 选中变为未选中
                invoiceTypeArr = filterArr(invoiceTypeArr, clickTarget);
                el.removeClass("selected");
            } else {
                invoiceTypeArr.push(clickTarget);
                el.addClass("selected");
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

        var clearQuery = function() {
            $.each(queryInputKeys, function(i, item) {
                $("#" + item).val("");
            });
            $.each(showClsMap, function(i, item) {
                $("." + item).removeClass("show");
            });
            $(".select-option").removeClass("selected");
            invoiceTypeArr = [];
        };
        var checkMoney = function(moneyStr) {
            // 金额正则
            var moneyReg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/;
            if (!moneyReg.test(moneyStr)) {
                tip("请正确输入金额");
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
                    tip("请正确输入金额");
                    return false;
                }
            }
            if (obj.startTime && obj.endTime) {
                if (obj.startTime > obj.endTime) {
                    tip("请正确输入日期");
                    return false;
                }
            }
            return true;
        };
        $(".submit").tap(function(e) {
            complexQuery();
        });
        $(".reset").tap(function(e) {
            clearQuery();
        });
    });
});
// $("body").css("overflow", "hidden");
