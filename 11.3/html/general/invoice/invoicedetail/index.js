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
    if (window.opener && window.opener.refresh) {
        window.opener.refresh(addQueryStringToUrl("/general/invoice/", obj));
    } else {
        location.reload();
    }
    window.close();
};
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
// $(".my-invoice").on("click", function() {
//     goBack();
// });
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
var trainKeys = [
    {
        id: "startTime",
        value: "开始时间"
    },
    {
        id: "endTime",
        value: "结束时间"
    },
    {
        id: "startLocation",
        value: "开始地点"
    },
    {
        id: "endLocation",
        value: "结束地点"
    },
    {
        id: "name",
        value: "使用人"
    },
    {
        id: "amount",
        value: "票据金额"
    },
    {
        id: "seatClass",
        value: "座位等级"
    },
    {
        id: "idCard",
        value: "身份证号"
    },
    // {
    //     id: "trainCode",
    //     value: "发票号码"
    // },
    {
        id: "trainNumber",
        value: "车次"
    }
];
var planeKeys = [
    {
        id: "name",
        value: "票面姓名"
    },
    {
        id: "endLocation",
        value: "到达地点"
    },
    {
        id: "serialNumber",
        value: "客票序列号"
    },
    {
        id: "planeCode",
        value: "客票代码"
    },
    {
        id: "flightNumber",
        value: "航班号"
    },
    {
        id: "insurance",
        value: "保险费"
    },
    {
        id: "fuelSurcharge",
        value: "燃油附加费"
    },
    {
        id: "amountExcludeTax",
        value: "票价金额"
    },
    {
        id: "carrier",
        value: "承运人"
    },
    {
        id: "startLocation",
        value: "起飞地点"
    },
    {
        id: "startTime",
        value: "起飞时间"
    },
    {
        id: "tax",
        value: "其他税费"
    },
    {
        id: "endTime",
        value: "到达时间"
    },
    {
        id: "issueDate",
        value: "客票填开日期"
    },
    {
        id: "amount",
        value: "合计金额"
    },
    {
        id: "caacDevelopmentFund",
        value: "民航发展基金"
    },
    {
        id: "seatClass",
        value: "座位等级"
    },
    {
        id: "hasStamp",
        value: "是否有章"
    },
    {
        id: "subType",
        value: "票据类型"
    }
];
var taxiKeys = [
    {
        id: "invoiceCode",
        value: "发票代码"
    },
    {
        id: "invoiceNumber",
        value: "发票号码"
    },
    {
        id: "amount",
        value: "金额"
    },
    {
        id: "billingDate",
        value: "日期 "
    },
    {
        id: "startTime",
        value: "上车时间"
    },
    {
        id: "endTime",
        value: "下车时间"
    },
    {
        id: "startLocation",
        value: "上车地点"
    },
    {
        id: "endLocation",
        value: "下车地点"
    },
    {
        id: "hasStamp",
        value: "是否有章"
    }
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
    },
    {
        className: "train",
        arr: trainKeys
    },
    {
        className: "plane",
        arr: planeKeys
    },
    {
        className: "taxi",
        arr: taxiKeys
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
// $(".type-text").text(dataMapType[qsParams.type].text);
var stateImgMap = {
    // 未使用
    "0": "img_used_details.png",
    // 已使用
    "1": "img_unused_details.png",
    // 审批中
    "2": "img_ongoing_details.png"
};
var billMap = {
    // 发票
    "01": "invoice",
    "04": "invoice",
    "10": "invoice",
    // 火车票
    "21": "trainTicket",
    // 飞机票
    "22": "planeTicket",
    // 出租车票
    "23": "taxiTicket"
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
var reimbursementDtn =
    '<div class="reimbursement-btn btn btn-primary"><span>报销</span></div>';
var state;
var fetchApplyDetail = function(id) {
    $.ajax({
        url: "/general/appbuilder/web/invoice/invoice/invoiceone",
        data: {
            id: id
        },
        success: function(res) {
            if (res.status) {
                if (res.flag) {
                    state = res.data.state;
                    var words_result = res.data.words_result;
                    var allArr;
                    var InvoiceType = res.data.InvoiceType;
                    $(".list-content").addClass(billMap[InvoiceType]);
                    if (
                        InvoiceType === "01" ||
                        InvoiceType === "04" ||
                        InvoiceType === "10"
                    ) {
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
                        allArr = sellerKeys
                            .concat(purchaserKeys)
                            .concat(mainkeys);

                        var Commodity = res.data.Commodity;
                        createCommodity(Commodity);
                        createCommodityTable({
                            Commodity: Commodity,
                            TotalAmount: TotalAmount,
                            TotalTax: TotalTax,
                            AmountInFiguers: AmountInFiguers,
                            AmountInWords: AmountInWords
                        });
                    } else if (InvoiceType === "22") {
                        allArr = planeKeys;
                    } else if (InvoiceType === "23") {
                        allArr = taxiKeys;
                    } else {
                        allArr = trainKeys;
                    }
                    $.each(allArr, function(index, item) {
                        var id = item.id;
                        var value = words_result[id];
                        if (value) {
                            $("." + id).text(value);
                        }
                    });
                    var imgUrl = res.data.url;
                    var imgDom = "";
                    if (res.data.is_pdf === "1") {
                        imgDom =
                            '<iframe src="' +
                            imgUrl +
                            '"  style="width: 100%;height: 100%"></iframe>';
                    } else {
                        imgDom = '<img  src="' + imgUrl + '">';
                    }

                    $(".img-wrap")
                        .empty()
                        .append(imgDom);
                    var stateImgDom = "";
                    stateImgDom =
                        '<img src="./img/' + stateImgMap[state] + '">';
                    $(".state-img")
                        .empty()
                        .append(stateImgDom);
                    handleBtn();
                    $("#printfp").click(function() {
                        $("#print_area").printArea();
                    });
                    $(".contanier").addClass("show");
                } else {
                    new TDMessage({
                        text: res.message
                    });
                }
            }
        },
        error: function(err) {
            console.log(err);
        }
    });
};
var handleBtn = function() {
    if (state) {
        if (state === "0" || state === "1") {
            $(".btns")
                .unbind()
                .empty();
            var btnDom = "";
            if (state === "0") {
                btnDom =
                    '<div class="sign-btn btn"><span>标记已使用</span></div><div class="del-btn btn"><span>删除</span></div>';
                if (isReimbursement) {
                    // btnDom += reimbursementDtn;
                    $(reimbursementDtn).insertBefore(".result-btn");
                }
            } else {
                btnDom =
                    '<div class="sign-btn btn"><span>标记未使用</span></div><div class="del-btn btn"><span>删除</span></div>';
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
    }
};
if (qsParams.id) {
    fetchApplyDetail(qsParams.id);
}
var saveByFlowId = function(flowId) {
    var tmpObj = {
        billId: qsParams.id,
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
