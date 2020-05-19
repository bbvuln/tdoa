var scan = function() {
    tMobileSDK.scanQRCode({
        onSuccess: function(res) {
            // console.log(res);
            location.href = res;
        }
    });
    // console.log(99)
};
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
                title: "入库管理"
            },
            r: {
                class: "",
                title: "扫码入库",
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
                    "/general/appbuilder/web/officeproduct/productmanage/productlist",
                baseParam: {
                    pageSize: pageSize,
                    keyword: keyword,
                    pageNo: pageNo
                },
                dataFix: function(data) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        item.trans_id = item.pro_id;
                        var specs = item.specs;
                        var type_name = item.type_name;
                        var redcls = "";
                        var is_red = item.is_red;
                        if (is_red == 1) {
                            redcls = "is_red";
                        }
                        item.redcls = redcls;
                        item.specsValue = "规格/型号：" + specs;
                        item.typeNameValue = "所属分类：" + type_name;
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
        $(".apply-list").on("tap", ".product-list-item", function(e) {
            var trans_id = $(e.currentTarget).attr("data-trans_id");
            if (e.target.className === "btn-manual") {
                location.href =
                    "/pda/officeProduct/product_inlibrary/create/?id=" +
                    trans_id;
            } else {
                location.href =
                    "/pda/officeProduct/product_inlibrary/detail/?id=" +
                    trans_id;
            }
        });
        var allocationVisible = false;
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

        $(".allocation").tap(function(e) {
            location.href = "/pda/officeProduct/transfer/list/";
        });
        $.ajax({
            url:
                "/general/appbuilder/web/officeproduct/productcheckout/gettransferlist",
            type: "post",
            data: {
                pageSize: 5,
                keyword: "",
                pageNo: 1,
                type: "2",
                isMobile: "1"
            },
            success: function(res) {
                var status = res.status;
                if (status) {
                    var total = parseInt(res.total);
                    if (total) {
                        $(".allocation").addClass("show");
                    }
                }
            }
        });
    });
});
