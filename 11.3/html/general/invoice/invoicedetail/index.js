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
        text: "δʹ��",
        value: "unused"
    },
    used: {
        type: "1",
        text: "��ʹ��",
        value: "used"
    },
    all: {
        type: "all",
        text: "ȫ��",
        value: "all"
    }
};
// $(".my-invoice").on("click", function() {
//     goBack();
// });
// ����
var purchaserKeys = [
    {
        id: "PurchaserName",
        value: "����"
    },
    {
        id: "PurchaserRegisterNum",
        value: "��˰��ʶ���"
    },
    {
        id: "PurchaserAddress",
        value: "��ַ���绰"
    },
    {
        id: "PurchaserBank",
        value: "�����м��˺�"
    }
];
// ���۷�
var sellerKeys = [
    {
        id: "SellerName",
        value: "����"
    },
    {
        id: "SellerRegisterNum",
        value: "��˰��ʶ���"
    },
    {
        id: "SellerAddress",
        value: "��ַ���绰"
    },
    {
        id: "SellerBank",
        value: "�����м��˺�"
    }
];
//
var mainkeys = [
    {
        id: "InvoiceDate",
        value: "��Ʊ����"
    },
    {
        id: "AmountInFiguers",
        value: "��˰�ϼ�"
    },
    // {
    //     id: "SellerAddress",
    //     value: "����˰���"
    // },
    {
        id: "TotalTax",
        value: "˰��"
    },
    {
        id: "InvoiceCode",
        value: "��Ʊ����"
    },
    {
        id: "InvoiceNum",
        value: "��Ʊ����"
    },
    {
        id: "CheckCode",
        value: "У����"
    }
    // {
    //     id: "Payee",
    //     value: "�տ���"
    // },
    // {
    //     id: "Checker",
    //     value: "����"
    // },
    // {
    //     id: "NoteDrawer",
    //     value: "��Ʊ��"
    // }
];
var trainKeys = [
    {
        id: "startTime",
        value: "��ʼʱ��"
    },
    {
        id: "endTime",
        value: "����ʱ��"
    },
    {
        id: "startLocation",
        value: "��ʼ�ص�"
    },
    {
        id: "endLocation",
        value: "�����ص�"
    },
    {
        id: "name",
        value: "ʹ����"
    },
    {
        id: "amount",
        value: "Ʊ�ݽ��"
    },
    {
        id: "seatClass",
        value: "��λ�ȼ�"
    },
    {
        id: "idCard",
        value: "���֤��"
    },
    // {
    //     id: "trainCode",
    //     value: "��Ʊ����"
    // },
    {
        id: "trainNumber",
        value: "����"
    }
];
var planeKeys = [
    {
        id: "name",
        value: "Ʊ������"
    },
    {
        id: "endLocation",
        value: "����ص�"
    },
    {
        id: "serialNumber",
        value: "��Ʊ���к�"
    },
    {
        id: "planeCode",
        value: "��Ʊ����"
    },
    {
        id: "flightNumber",
        value: "�����"
    },
    {
        id: "insurance",
        value: "���շ�"
    },
    {
        id: "fuelSurcharge",
        value: "ȼ�͸��ӷ�"
    },
    {
        id: "amountExcludeTax",
        value: "Ʊ�۽��"
    },
    {
        id: "carrier",
        value: "������"
    },
    {
        id: "startLocation",
        value: "��ɵص�"
    },
    {
        id: "startTime",
        value: "���ʱ��"
    },
    {
        id: "tax",
        value: "����˰��"
    },
    {
        id: "endTime",
        value: "����ʱ��"
    },
    {
        id: "issueDate",
        value: "��Ʊ�����"
    },
    {
        id: "amount",
        value: "�ϼƽ��"
    },
    {
        id: "caacDevelopmentFund",
        value: "�񺽷�չ����"
    },
    {
        id: "seatClass",
        value: "��λ�ȼ�"
    },
    {
        id: "hasStamp",
        value: "�Ƿ�����"
    },
    {
        id: "subType",
        value: "Ʊ������"
    }
];
var taxiKeys = [
    {
        id: "invoiceCode",
        value: "��Ʊ����"
    },
    {
        id: "invoiceNumber",
        value: "��Ʊ����"
    },
    {
        id: "amount",
        value: "���"
    },
    {
        id: "billingDate",
        value: "���� "
    },
    {
        id: "startTime",
        value: "�ϳ�ʱ��"
    },
    {
        id: "endTime",
        value: "�³�ʱ��"
    },
    {
        id: "startLocation",
        value: "�ϳ��ص�"
    },
    {
        id: "endLocation",
        value: "�³��ص�"
    },
    {
        id: "hasStamp",
        value: "�Ƿ�����"
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
        value: "��λ"
    },
    {
        id: "CommodityNum",
        value: "����"
    },
    {
        id: "CommodityAmount",
        value: "���"
    },
    {
        id: "CommodityTaxRate",
        value: "˰��"
    },
    {
        id: "CommodityTax",
        value: "˰��"
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
                '��</div><div class="value">' +
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
    // δʹ��
    "0": "img_used_details.png",
    // ��ʹ��
    "1": "img_unused_details.png",
    // ������
    "2": "img_ongoing_details.png"
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
var createCommodityTable = function(opts) {
    var Commodity = opts.Commodity;
    var TotalAmount = opts.TotalAmount;
    var TotalTax = opts.TotalTax;
    var AmountInFiguers = opts.AmountInFiguers;
    var AmountInWords = opts.AmountInWords;
    var tHeaderDom =
        '<tr id="tab_head_dzfp"><td width="30%" class="align_center borderRight">�����Ӧ˰���񡢷�������</td><td width="10%" class="align_center borderRight">����ͺ�</td><td width="5%" class="align_center borderRight">��λ</td><td width="10%" class="align_center borderRight">����</td><td width="10%" class="align_center borderRight">����</td><td width="15%" class="align_center borderRight">���</td><td width="5%" class="align_center borderRight">˰��</td><td width="15%" class="align_center">˰��</td></tr>';
    var tFooterDom =
        '<tr><td class="align_center borderRight">�ϼ�</td><td class="align_center borderRight">&nbsp;</td><td class="align_center borderRight">&nbsp;</td><td class="align_center borderRight">&nbsp;</td><td class="align_center borderRight">&nbsp;</td><td class="align_right borderRight"><span class="content_td_blue" id="je_dzfp">��' +
        TotalAmount +
        '</span></td><td class="align_center borderRight">&nbsp;</td><td class="align_right"><span class="content_td_blue" id="se_dzfp">��<span class="TotalTax">' +
        TotalTax +
        "</span></span></td></tr>";
    var tFooterBottomDom =
        '<tr><td class="align_center borderRight borderTop">��˰�ϼƣ���д��</td><td class="align_left borderTop" colspan="4"><span class="align_left"><span class="content_td_blue" id="jshjdx_dzfp">' +
        decodeURIComponent("%E2%8A%97") +
        AmountInWords +
        '</span></span></td><td class="align_left borderTop" colspan="3"><span style="padding:0 20px;">��Сд��</span><span class="content_td_blue" id="jshjxx_dzfp">��<span class="TotalAmount">' +
        AmountInFiguers +
        "</span></span></td></tr>";
    var tBodyDom = "";
    $.each(Commodity, function(i, item) {
        // ����
        var CommodityName = item.CommodityName ? item.CommodityName : "";
        // ����ͺ�
        var CommodityType = item.CommodityType ? item.CommodityType : "";
        // ��λ
        var CommodityUnit = item.CommodityUnit ? item.CommodityUnit : "";
        // ����
        var CommodityNum = item.CommodityNum ? item.CommodityNum : "";
        // ����
        var CommodityPrice = item.CommodityPrice ? item.CommodityPrice : "";
        // ���
        var CommodityAmount = item.CommodityAmount ? item.CommodityAmount : "";
        // ˰��
        var CommodityTaxRate = item.CommodityTaxRate
            ? item.CommodityTaxRate
            : "";
        // ˰��
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
    '<div class="reimbursement-btn btn btn-primary"><span>����</span></div>';
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
                        // �ϼƽ��
                        var TotalAmount = words_result.TotalAmount;
                        // �ϼ�˰��
                        var TotalTax = words_result.TotalTax;
                        // ��˰�ϼ�(Сд)
                        var AmountInFiguers = words_result.AmountInFiguers;
                        // ��˰�ϼ�(��д)
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
                    '<div class="sign-btn btn"><span>�����ʹ��</span></div><div class="del-btn btn"><span>ɾ��</span></div>';
                if (isReimbursement) {
                    // btnDom += reimbursementDtn;
                    $(reimbursementDtn).insertBefore(".result-btn");
                }
            } else {
                btnDom =
                    '<div class="sign-btn btn"><span>���δʹ��</span></div><div class="del-btn btn"><span>ɾ��</span></div>';
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
                // ���
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
