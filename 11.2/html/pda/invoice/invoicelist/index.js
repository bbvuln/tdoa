var closeWebview = function() {
    tMobileSDK.closeWebview();
};
var loading = false;
var scan = function() {
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
};

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
            }
        };
        var queryParams = getQueryParams();
        var flowId = queryParams.flowId ? queryParams.flowId : "";
        var prcsId = queryParams.prcsId ? queryParams.prcsId : "";
        var flowPrcs = queryParams.flowPrcs ? queryParams.flowPrcs : "";
        var runId = queryParams.runId ? queryParams.runId : "";

        var current = "all";
        var keyword = "";
        var pageNo = 1;
        var pageSize = 10;
        var arr = ["all", "unused", "used"];
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
        var idMapUrl = {};
        var data = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            data.push(dataMapType[item]);
        }
        var el = $(".tabs-wrap");
        var $searchIput = $("#apply-product-search");
        $searchIput.val("");
        new HomeTabs(el, {
            data: data,
            clickTab: function(value) {
                current = value;
                $(".ui-container").attr("id", current);
                keyword = "";
                pageNo = 1;
                $searchIput.val("");
                fetchApplylist();
            }
        });
        var saveByFlowId = function(flowId) {
            $.ajax({
                url: "/inc/ocr/billToApproveCenter.php",
                type: "post",
                data: Qs.stringify({
                    billId: selected.join(","),
                    isMobile: "1",
                    flowId: flowId
                }),
                success: function(res) {
                    location.href = res;
                }
            });
        };
        var ins = new SelectFlow({
            cb: function() {
                $(".office-product-list").addClass("show-reimbursement");
            },
            save: saveByFlowId
        });
        $(".reimbursement-btn").tap(function() {
            // location.href =
            //     "/pda/invoice/result/?id=3&attach_id=5&attach_name=6";
            if ($(".ui-list li").size()) {
                // 展示两个按钮 在apply-list加标识
                $(".reimbursement-btn").removeClass("show");
                $(".btns").addClass("show");
                $(".apply-list").addClass("selecting");
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

        function fetchApplylist() {
            var list = $(".apply-list");
            list.empty();
            new gmu.Alist({
                el: list,
                template: {
                    item: $("#works-list-tmpl").html()
                },
                enablePullUp: false,
                enablePullDown: false,
                url: "/general/appbuilder/web/invoice/invoice/invoicelist",
                baseParam: {
                    state: dataMapType[current].type,
                    pageSize: pageSize,
                    keyword: keyword,
                    pageNo: pageNo,
                    flowId: flowId,
                    prcsId: prcsId,
                    flowPrcs: flowPrcs,
                    runId: runId
                },
                itemclick: function() {
                    $(".office-product-list .ui-list").unbind();
                    $(".office-product-list .ui-list").on(
                        "tap",
                        ".apply-list-item",
                        function(e) {
                            var trans_id = $(e.currentTarget).attr(
                                "data-trans_id"
                            );
                            if ($(".apply-list").hasClass("selecting")) {
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
                    );
                },
                dataFix: function(data) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
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
                        arr.push(item);
                        if (isReimbursement) {
                            idMapUrl[item.id] = item.reimbursementUrl;
                        }
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
    });
});
