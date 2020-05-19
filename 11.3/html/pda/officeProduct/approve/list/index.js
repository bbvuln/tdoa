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
                title: "办公用品审批"
            },
            r: null
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
        var emptyStr = createEmpty();

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

        var trans_flagMap = {
            "1": "领用",
            "2": "借用"
        };
        var stateMap = {
            "0": "未审批",
            "1": "已通过",
            "2": "被驳回"
        };

        var keyword = "";
        var pageNo = 1;
        var pageSize = 10;

        var $searchIput = $("#apply-product-search");
        $searchIput.val("");
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
                    "/general/appbuilder/web/officeproduct/productapproval/approvallist",
                baseParam: {
                    trans_state: "",
                    pageSize: pageSize,
                    keyword: keyword,
                    pageNo: pageNo
                },
                itemclick: function() {
                    $(".office-product-list .ui-list").on(
                        "tap",
                        ".apply-list-item",
                        function(e) {
                            var trans_id = $(e.currentTarget).attr(
                                "data-trans_id"
                            );
                            location.href =
                                "/pda/officeProduct/approve/detail/?id=" +
                                trans_id;
                        }
                    );
                },
                dataFix: function(data) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        var trans_flag = item.trans_flag;
                        var state = item.trans_state;
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
