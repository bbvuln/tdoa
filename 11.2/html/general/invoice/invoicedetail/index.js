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
var goBack = function() {
    var obj = {
        type: qsParams.type ? qsParams.type : "all",
        prcsId: qsParams.prcsId,
        flowPrcs: qsParams.flowPrcs,
        runId: qsParams.runId
    };
    location.href = addQueryStringToUrl("/general/invoice/", obj);
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
$(".my-invoice").on("click", function() {
    goBack();
});
// 购买方
var purchaserKeys = [
    {
        id: "PurchaserName",
        value: "名称"
    },
    {
        id: "PurchaserRegisterNum",
        value: "纳税人识别号"
    },
    {
        id: "PurchaserAddress",
        value: "地址及电话"
    },
    {
        id: "PurchaserBank",
        value: "开户行及账号"
    }
];
// 销售方
var sellerKeys = [
    {
        id: "SellerName",
        value: "名称"
    },
    {
        id: "SellerRegisterNum",
        value: "纳税人识别号"
    },
    {
        id: "SellerAddress",
        value: "地址及电话"
    },
    {
        id: "SellerBank",
        value: "开户行及账号"
    }
];
//
var mainkeys = [
    {
        id: "InvoiceDate",
        value: "开票日期"
    },
    {
        id: "AmountInFiguers",
        value: "价税合计"
    },
    // {
    //     id: "SellerAddress",
    //     value: "不含税金额"
    // },
    {
        id: "TotalTax",
        value: "税额"
    },
    {
        id: "InvoiceCode",
        value: "发票代码"
    },
    {
        id: "InvoiceNum",
        value: "发票号码"
    },
    {
        id: "CheckCode",
        value: "校验码"
    }
    // {
    //     id: "Payee",
    //     value: "收款人"
    // },
    // {
    //     id: "Checker",
    //     value: "复核"
    // },
    // {
    //     id: "NoteDrawer",
    //     value: "开票人"
    // }
];
var clsArr = [
    {
        className: "seller",
        arr: sellerKeys
    },
    {
        className: "purchaser",
        arr: purchaserKeys
    },
    {
        className: "main",
        arr: mainkeys
    }
];
var createDom = function(arr) {
    var dom = "";
    $.each(arr, function(index, item) {
        var liDom =
            '<li class="line-content-item"><div class="key">' +
            item.value +
            '</div><div class="value ' +
            item.id +
            '"">--</div></li>';
        dom += liDom;
    });
    return dom;
};
$.each(clsArr, function(i, item) {
    var className = item.className;
    var arr = item.arr;
    $("." + className).append(createDom(arr));
});
var commodityKeys = [
    {
        id: "CommodityUnit",
        value: "单位"
    },
    {
        id: "CommodityNum",
        value: "数量"
    },
    {
        id: "CommodityAmount",
        value: "金额"
    },
    {
        id: "CommodityTaxRate",
        value: "税率"
    },
    {
        id: "CommodityTax",
        value: "税额"
    }
];
var createCommodity = function(Commodity) {
    var dom = "";
    $.each(Commodity, function(i, item) {
        var commodityItem = "";
        var CommodityName = item.CommodityName;
        $.each(commodityKeys, function(j, jItem) {
            var id = jItem.id;
            var value = jItem.value;
            var val = item[id] ? item[id] : "--";
            var str =
                '<li class="line-content-item"><div class="key">' +
                value +
                '：</div><div class="value">' +
                val +
                "</div></li>";
            commodityItem += str;
        });
        var itemDom =
            '<li ><div class="title"><div class="dot"></div>' +
            CommodityName +
            "</div>" +
            commodityItem +
            "</li>";
        dom += itemDom;
    });
    $(".commodity-list").append(dom);
};
$(".type-text").text(dataMapType[qsParams.type].text);
var stateImgMap = {
    // 未使用
    "0": "img_notused.png",
    // 已使用
    "1": "img_used.png"
};
var createCommodityTable = function(opts) {
    var Commodity = opts.Commodity;
    var TotalAmount = opts.TotalAmount;
    var TotalTax = opts.TotalTax;
    var AmountInFiguers = opts.AmountInFiguers;
    var AmountInWords = opts.AmountInWords;
    var tHeaderDom =
        '<tr id="tab_head_dzfp"><td width="30%" class="align_center borderRight">货物或应税劳务、服务名称</td><td width="10%" class="align_center borderRight">规格型号</td><td width="5%" class="align_center borderRight">单位</td><td width="10%" class="align_center borderRight">数量</td><td width="10%" class="align_center borderRight">单价</td><td width="15%" class="align_center borderRight">金额</td><td width="5%" class="align_center borderRight">税率</td><td width="15%" class="align_center">税额</td></tr>';
    var tFooterDom =
        '<tr><td class="align_center borderRight">合计</td><td class="align_center borderRight">&nbsp;</td><td class="align_center borderRight">&nbsp;</td><td class="align_center borderRight">&nbsp;</td><td class="align_center borderRight">&nbsp;</td><td class="align_right borderRight"><span class="content_td_blue" id="je_dzfp">￥' +
        TotalAmount +
        '</span></td><td class="align_center borderRight">&nbsp;</td><td class="align_right"><span class="content_td_blue" id="se_dzfp">￥<span class="TotalTax">' +
        TotalTax +
        "</span></span></td></tr>";
    var tFooterBottomDom =
        '<tr><td class="align_center borderRight borderTop">价税合计（大写）</td><td class="align_left borderTop" colspan="4"><span class="align_left"><span class="content_td_blue" id="jshjdx_dzfp">' +
        decodeURIComponent("%E2%8A%97") +
        AmountInWords +
        '</span></span></td><td class="align_left borderTop" colspan="3"><span style="padding:0 20px;">（小写）</span><span class="content_td_blue" id="jshjxx_dzfp">￥<span class="TotalAmount">' +
        AmountInFiguers +
        "</span></span></td></tr>";
    var tBodyDom = "";
    $.each(Commodity, function(i, item) {
        // 名称
        var CommodityName = item.CommodityName ? item.CommodityName : "";
        // 规格型号
        var CommodityType = item.CommodityType ? item.CommodityType : "";
        // 单位
        var CommodityUnit = item.CommodityUnit ? item.CommodityUnit : "";
        // 数量
        var CommodityNum = item.CommodityNum ? item.CommodityNum : "";
        // 单价
        var CommodityPrice = item.CommodityPrice ? item.CommodityPrice : "";
        // 金额
        var CommodityAmount = item.CommodityAmount ? item.CommodityAmount : "";
        // 税率
        var CommodityTaxRate = item.CommodityTaxRate
            ? item.CommodityTaxRate
            : "";
        // 税额
        var CommodityTax = item.CommodityTax ? item.CommodityTax : "";
        var itemDom =
            '<tr><td class="align_left borderRight"><span class="content_td_blue">' +
            CommodityName +
            '</span></td><td class="align_left borderRight"><span class="content_td_blue">' +
            CommodityType +
            '</span></td><td class="align_left borderRight"><span class="content_td_blue">' +
            CommodityUnit +
            '</span></td><td class="align_right borderRight"><span class="content_td_blue">' +
            CommodityNum +
            '</span></td><td class="align_right borderRight"><span class="content_td_blue">' +
            CommodityPrice +
            '</span></td><td class="align_right borderRight"><span class="content_td_blue">' +
            CommodityAmount +
            '</span></td><td class="align_right borderRight"><span class="content_td_blue">' +
            CommodityTaxRate +
            '</span></td><td class="align_right"><span class="content_td_blue">' +
            CommodityTax +
            "</span></td></tr>";
        tBodyDom += itemDom;
    });
    $(".commodity-table").append(
        tHeaderDom + tBodyDom + tFooterDom + tFooterBottomDom
    );
};
var isReimbursement = false;
var reimbursementDtn = '<div class="reimbursement-btn"><span>报销</span></div>';
var state;
var fetchApplyDetail = function(id) {
    $.ajax({
        url: "/general/appbuilder/web/invoice/invoice/invoiceone",
        data: {
            id: id
        },
        success: function(res) {
            if (res.status) {
                state = res.data.state;
                var words_result = res.data.words_result;
                var InvoiceTypeOrg = words_result.InvoiceTypeOrg;
                var Remarks = words_result.Remarks;
                // 合计金额
                var TotalAmount = words_result.TotalAmount;
                // 合计税额
                var TotalTax = words_result.TotalTax;
                // 价税合计(小写)
                var AmountInFiguers = words_result.AmountInFiguers;
                // 价税合计(大写)
                var AmountInWords = words_result.AmountInWords;
                var machineCode = words_result.machineCode;
                $(".machineCode").text(machineCode);
                $(".info-title-text").text(InvoiceTypeOrg);
                $(".remark").text(Remarks);
                var allArr = sellerKeys.concat(purchaserKeys).concat(mainkeys);
                $.each(allArr, function(index, item) {
                    var id = item.id;
                    var value = words_result[id];
                    if (value) {
                        $("." + id).text(value);
                    }
                });
                var Commodity = res.data.Commodity;
                createCommodity(Commodity);
                createCommodityTable({
                    Commodity: Commodity,
                    TotalAmount: TotalAmount,
                    TotalTax: TotalTax,
                    AmountInFiguers: AmountInFiguers,
                    AmountInWords: AmountInWords
                });
                var imgUrl = res.data.url;
                var imgDom = '<img  src="' + imgUrl + '">';
                $(".img-wrap")
                    .empty()
                    .append(imgDom);
                var stateImgDom = "";
                stateImgDom = '<img src="./img/' + stateImgMap[state] + '">';
                $(".state-img")
                    .empty()
                    .append(stateImgDom);
                handleBtn();
                $("#printfp").click(function() {
                    $(".wrap").addClass("hide");
                    $("#myModal").addClass("print");
                    try {
                        document.execCommand("print", false, null);
                    } catch (e) {
                        // print.portrait = true;
                        print();
                    }
                    setTimeout(function() {
                        $(".wrap").removeClass("hide");
                        $("#myModal").removeClass("print");
                    });
                });
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
};
var handleBtn = function() {
    if (state) {
        $(".btns")
            .unbind()
            .empty();
        var btnDom = "";
        if (state === "0") {
            btnDom =
                '<div class="del-btn"><span>删除</span></div><div class="sign-btn"><span>标记已使用</span></div>';
            if (isReimbursement) {
                btnDom += reimbursementDtn;
            }
        } else {
            btnDom =
                '<div class="del-btn"><span>删除</span></div><div class="sign-btn"><span>标记未使用</span></div>';
        }
        $(".btns").append(btnDom);
        $(".del-btn").click(function() {
            $.ajax({
                url: "/general/appbuilder/web/invoice/invoice/delinvoice",
                data: {
                    id: qsParams.id
                },
                success: function(res) {
                    if (res.status) {
                        goBack();
                    }
                }
            });
        });

        $(".sign-btn").click(function() {
            // 标记
            $.ajax({
                url: "/general/appbuilder/web/invoice/invoice/updatestate",
                data: {
                    id: qsParams.id
                },
                success: function(res) {
                    if (res.status) {
                        goBack();
                    }
                }
            });
        });
        $(".reimbursement-btn").click(function() {
            handle();
        });
    }
};
if (qsParams.id) {
    fetchApplyDetail(qsParams.id);
}
var saveByFlowId = function(flowId) {
    var tmpObj = {
        billId: qsParams.id,
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
var ins = new SelectFlow({
    cb: function() {
        isReimbursement = true;
        handleBtn();
    },
    save: saveByFlowId
});
var handle = function() {
    ins.showModal();
};
