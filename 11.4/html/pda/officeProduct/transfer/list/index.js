$(document).ready(function() {
    tMobileSDK.ready(function() {
        var data = {
            l: {
                class: "",
                event: "history.back();",
                title: ""
            },
            c: {
                class: "",
                title: "�������"
            },
            r: {
                show: false
            }
        };
        tMobileSDK.buildHeader(data);
        var createEmpty = function(text) {
            text ? null : (text = "��������");
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
        var is_checkedMap = {
            "1": "δ����",
            "2": "�����"
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
                    "/general/appbuilder/web/officeproduct/productcheckout/gettransferlist",
                baseParam: {
                    pageSize: pageSize,
                    keyword: keyword,
                    pageNo: pageNo,
                    type: "2",
                    isMobile: "1"
                },
                dataFix: function(data) {
                    var arr = [];
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        item.trans_id = item.trans_id;
                        var specs = item.pro_desc;
                        var type_long_name = item.type_long_name;
                        var transfer_num = item.transfer_num;
                        var transfer_date = item.transfer_date;
                        var stateValue = is_checkedMap[item.is_checked];
                        item.stateValue = stateValue;
                        item.specsValue = "���/�ͺţ�" + specs;
                        item.type_long_nameValue =
                            "��������" + type_long_name;
                        item.transfer_numValue = "����������" + transfer_num;
                        item.transfer_dateValue = "����ʱ�䣺" + transfer_date;
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
            location.href =
                "/pda/officeProduct/transfer/detail/?id=" + trans_id;
        });
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
