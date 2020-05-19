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
    // ��Ʊ
    "01": "invoice",
    "04": "invoice",
    "10": "invoice",
    // ��Ʊ
    "21": "trainTicket",
    // �ɻ�Ʊ
    "22": "planeTicket",
    // ���⳵Ʊ
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
    // SellerName ���۷�����
    // item.SellerName = "����ͨ��Ƽ����޹�˾";
    item.selectCls = selectCls;
    // �Ƿ���ʾ���Ͻ�רƱ����Ʊ��ʶ
    item.isNormalImgSrc = rihgtTopImgMap[InvoiceType];
    // state   0 δʹ��  1 ��ʹ��  2 ʹ����  all   ȫ��
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
        // ��ͨ��Ʊ ר�÷�Ʊ ���ӷ�Ʊ
        titleText = item.SellerName;
        timeDes = "��Ʊ���ڣ�";
        leftVal = item.AmountInFiguers;
        leftDes = "���(Ԫ)";
        rightVal = item.TotalTax;
        rightDes = "˰��";
    } else if (InvoiceType === "22") {
        // �ɻ�Ʊ
        titleText = "�ɻ�Ʊ";
        timeDes = "���ڣ�";
        leftVal = item.startLocation;
        leftDes = "����";
        rightVal = item.endLocation;
        rightDes = "����";
    } else if (InvoiceType === "23") {
        // ���⳵Ʊ
        titleText = "���⳵��Ʊ";
        timeDes = "���ڣ�";
        leftVal = item.startTime;
        leftDes = "�ϳ�ʱ��";
        rightVal = item.endTime;
        rightDes = "�³�ʱ��";
    } else {
        // ��Ʊ
        titleText = "����/����/��Ʊ";
        timeDes = "���ڣ�";
        leftVal = item.startLocation;
        leftDes = "����";
        rightVal = item.endLocation;
        rightDes = "����";
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
