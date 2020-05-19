$(document).ready(function() {
    tMobileSDK.ready(function() {
        var data = {
            l: {
                class: "",
                event: "back();",
                title: ""
            },
            c: {
                class: "",
                title: "申领记录"
            },
            r: {
                show: false
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
        // var loadingStr = createEmpty("loading");
        var back = function() {
            // history.back();
            location.href = "/pda/officeProduct/";
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
            receive: {
                type: "1",
                text: "领用",
                value: "receive"
            },
            borrow: {
                type: "2",
                text: "借用",
                value: "borrow"
            },
            all: {
                type: "3",
                text: "全部",
                value: "all"
            }
        };
        var trans_flagMap = {
            "1": "领用",
            "2": "借用"
        };
        var stateMap = {
            "1": "已发放",
            "2": "待发放",
            "3": "待审批",
            "4": "被驳回",
            "5": "已归还",
            "6": "已取消"
        };
        var current = "all";

        var keyword = "";
        var pageNo = 1;
        var pageSize = 10;
        var arr = ["all", "borrow", "receive"];
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
                keyword = "";
                pageNo = 1;
                $searchIput.val("");
                fetchApplylist();
            }
        });

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
                url:
                    "/general/appbuilder/web/officeproduct/productapply/applylist",
                baseParam: {
                    type: dataMapType[current].type,
                    pageSize: pageSize,
                    keyword: keyword,
                    pageNo: pageNo
                },
                itemclick: function() {
                    $(".office-product-list .ui-list").on(
                        "tap",
                        ".apply-list-item",
                        function(e) {
                            // console.log(
                            //     $(e.currentTarget).attr("data-trans_id"),
                            //     current
                            // );
                            var trans_id = $(e.currentTarget).attr(
                                "data-trans_id"
                            );
                            location.href =
                                "/pda/officeProduct/applydetail/?id=" +
                                trans_id;
                        }
                    );
                },
                dataFix: function(data) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var trans_flag = item.trans_flag;
                        var state = item.state;
                        var is_red = item.is_red;
                        item.trans_flagValue = trans_flagMap[trans_flag];
                        item.stateValue = stateMap[state];
                        item.redClassName = is_red ? "red" : "";
                        arr.push(item);
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
