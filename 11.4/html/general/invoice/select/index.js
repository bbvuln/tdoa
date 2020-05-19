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
var uid = queryParams.uid ? queryParams.uid : "";
$(".wrap").attr("id", current);
var parentDocument = getOpennerDocument();
var ocrSelect = [];
if (!window.opener.ocrSelect) {
    window.opener.ocrSelect = [];
}
ocrSelect = window.opener.ocrSelect;
function getOpennerDocument() {
    if (parent.dialogArguments) return parent.dialogArguments.document;
    else return parent.opener.document;
}

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
        if (ocrSelect.indexOf(item.id) === -1) {
            dom += createInvoiceCard({
                selected: selected,
                item: item
            });
        }
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
        $.ajax({
            url: "/inc/ocr/billToform.php",
            data: {
                billId: selected.join(","),
                itemID: queryParams.itemId,
                flowId: flowId,
                flowPrcs: flowPrcs,
                uid: uid,
            },
            type: "post",
            success: function(res) {
                window.opener.ocrSelect = window.opener.ocrSelect.concat(
                    selected
                );
                var obj = JSON.parse(res);
                if (obj.general && obj.general.length) {
                    $.each(obj.general, function(i, item) {
                        $(parentDocument.getElementsByName(item.name)).val(
                            item.value
                        );
                    });
                }
                if (obj.list && obj.list.length) {
                    $.each(obj.list, function(i, item) {
                        var delete_op = item.delete_op;
                        var edit_op = item.edit_op === 1 ? 0 : 1;
                        var lv_table_id = item.lv_table_id;
                        var new_width = item.new_width;
                        var arr_value = item.arr_value;
                        var arr = arr_value.split("\r\n");
                        $.each(arr, function(j, jItem) {
                            window.opener.tb_addnew(
                                lv_table_id,
                                edit_op,
                                jItem,
                                delete_op,
                                new_width
                            );
                        });
                    });
                }
                if (obj.file && obj.file.length) {
                    $.each(obj.file, function(i, item) {
                        window.opener.addimages(item, queryParams.itemId);
                    });
                }
                window.close();
            }
        });
    } else {
        alert("请选择发票");
    }
});
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
            runId: runId,
            isPage: false
        },
        success: function(res) {
            if (res.status) {
                total = parseInt(res.total, 10);
                if (total) {
                    createData(res.data);
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
                            var url = "/portal/invoicedetail/";
                            location.href = addQueryStringToUrl(url, tmpObj);
                            // console.log("go-detail");
                        }
                    });
                } else {
                    $(".list-content")
                        .empty()
                        .append(emptyDom);
                }
            }
        }
    });
};

fetchData();
