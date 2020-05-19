var stateImgMap = {
    "0": "/general/invoice/img/img_unused_invoice.png",
    "1": "/general/invoice/img/img_Used_invoice.png",
    "2": "/general/invoice/img/img_ongoing_invoice.png"
};
var titleImgMap = {
    "01": "/general/invoice/img/myticketfolder_name_icon@3x.png",
    "04": "/general/invoice/img/myticketfolder_name_icon@3x.png",
    "10": "/general/invoice/img/myticketfolder_name_icon@3x.png",
    "21": "/general/invoice/img/myticketfolder_train_icon@3x.png",
    "22": "/general/invoice/img/myticketfolder_aircraft_icon@3x.png",
    "23": "/general/invoice/img/myticketfolder_taxi_icon@3x.png"
};
var rihgtTopImgMap = {
    "01": "/general/invoice/img/myticketfolder_major_icon@3x.png",
    "04": "/general/invoice/img/myticketfolder_generalvote_icon@3x.png",
    "10": "/general/invoice/img/myticketfolder_e-ticket_icon@3x.png",
    "21": "/general/invoice/img/myticketfolder_traintickets_icon@3x.png",
    "22": "/general/invoice/img/myticketfolder_planeticket_icon@3x.png",
    "23": "/general/invoice/img/myticketfolder_taxiticket_icon@3x.png"
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
var createInvoiceCard = function(opt) {
    var selected = opt.selected;
    var item = opt.item;
    item.trans_id = item.id;
    var selectCls = "";
    if (selected.indexOf(item.id) !== -1) {
        selectCls = "selected";
    }
    var InvoiceType = item.InvoiceType;
    // SellerName 销售方名称
    // item.SellerName = "北京通达科技有限公司";
    item.selectCls = selectCls;
    // 是否显示右上角专票、普票标识
    item.isNormalImgSrc = rihgtTopImgMap[InvoiceType];
    // state   0 未使用  1 已使用  2 使用中  all   全部
    item.isUsed = item.state !== "0";
    item.usedCls = item.isUsed ? "used" : "";
    item.isUsedImgSrc = stateImgMap[item.state];
    var titleText = "";
    var timeDes = "";
    var timeVal = item.InvoiceDate;
    var leftVal = "";
    var leftDes = "";
    var rightVal = "";
    var rightDes = "";
    if (InvoiceType === "01" || InvoiceType === "04" || InvoiceType === "10") {
        // 普通发票 专用发票 电子发票
        titleText = item.SellerName;
        timeDes = "开票日期：";
        leftVal = item.AmountInFiguers;
        leftDes = "金额(元)";
        rightVal = item.TotalTax;
        rightDes = "税额";
    } else if (InvoiceType === "22") {
        // 飞机票
        titleText = "飞机票";
        timeDes = "日期：";
        leftVal = item.startLocation;
        leftDes = "出发";
        rightVal = item.endLocation;
        rightDes = "到达";
    } else if (InvoiceType === "23") {
        // 出租车票
        titleText = "出租车发票";
        timeDes = "日期：";
        leftVal = item.startTime;
        leftDes = "上车时间";
        rightVal = item.endTime;
        rightDes = "下车时间";
    } else {
        // 火车票
        titleText = "动车/高铁/火车票";
        timeDes = "日期：";
        leftVal = item.startLocation;
        leftDes = "出发";
        rightVal = item.endLocation;
        rightDes = "到达";
    }

    // item.time = item.InvoiceDate;
    var leftDom =
        '<div class="money"><div class="value ellipsis" title="' +
        leftVal +
        '">' +
        leftVal +
        '</div><div class="des">' +
        leftDes +
        "</div></div>";
    var rightDom =
        '<div class="tax"><div class="value ellipsis" title="' +
        rightVal +
        '">' +
        rightVal +
        '</div><div class="des">' +
        rightDes +
        "</div></div>";
    var liDom =
        '<li class="' +
        billMap[InvoiceType] +
        " apply-list-item " +
        item.usedCls +
        '" data-trans_id="' +
        item.trans_id +
        '"><div class="overlay"></div><div class="img-wrap"><div class="img-select ' +
        item.selectCls +
        '"><img  class="image" src="/general/invoice/img/select_icon@3x.png"></div></div><div class="isNormal"><img src="' +
        item.isNormalImgSrc +
        '"></div><div class="title title-top"><img src="' +
        titleImgMap[InvoiceType] +
        '"><div class="title-text ellipsis" title="' +
        titleText +
        '">' +
        titleText +
        '</div></div><div class="content-wrap"><div class="content">' +
        leftDom +
        rightDom +
        '</div><img src="' +
        item.isUsedImgSrc +
        '"></div><div class="title top-border"><img src="/general/invoice/img/myticketfolder_time_icon@3x.png"><div class="title-text ellipsis"><span class="time-des">' +
        timeDes +
        '</span><span class="time-value">' +
        timeVal +
        "</span></div></div></li>";
    return liDom;
};
