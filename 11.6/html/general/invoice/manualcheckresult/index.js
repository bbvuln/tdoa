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

// ��ֹ����null false
var transformValue = function(val) {
    return val ? val : "";
};
var createDom = function(data) {
    var dom = "";
    $.each(data, function(i, item) {
        var InvoiceTypeOrg = transformValue(
            item.data.words_result.InvoiceTypeOrg
        );
        var InvoiceCode = transformValue(item.data.words_result.InvoiceCode);
        var InvoiceNum = transformValue(item.data.words_result.InvoiceNum);
        var InvoiceDate = transformValue(item.data.words_result.InvoiceDate);
        var CheckCode = transformValue(item.data.words_result.CheckCode);
        var machineCode = transformValue(item.data.words_result.machineCode);
        var PurchaserName = transformValue(
            item.data.words_result.PurchaserName
        );
        var PurchaserRegisterNum = transformValue(
            item.data.words_result.PurchaserRegisterNum
        );
        var PurchaserAddress = transformValue(
            item.data.words_result.PurchaserAddress
        );
        var PurchaserBank = transformValue(
            item.data.words_result.PurchaserBank
        );
        var SellerName = transformValue(item.data.words_result.SellerName);
        var SellerRegisterNum = transformValue(
            item.data.words_result.SellerRegisterNum
        );
        var SellerAddress = transformValue(
            item.data.words_result.SellerAddress
        );
        var SellerBank = transformValue(item.data.words_result.SellerBank);
        var Remarks = transformValue(item.data.words_result.Remarks);
        var Commodity = transformValue(item.data.Commodity);
        // �ϼƽ��
        var TotalAmount = transformValue(item.data.words_result.TotalAmount);
        // �ϼ�˰��
        var TotalTax = transformValue(item.data.words_result.TotalTax);
        // ��˰�ϼ�(Сд)
        var AmountInFiguers = transformValue(
            item.data.words_result.AmountInFiguers
        );
        // ��˰�ϼ�(��д)
        var AmountInWords = transformValue(
            item.data.words_result.AmountInWords
        );
        var CommodityTableDom = createCommodityTable({
            Commodity: Commodity,
            TotalAmount: TotalAmount,
            TotalTax: TotalTax,
            AmountInFiguers: AmountInFiguers,
            AmountInWords: AmountInWords
        });
        var invoiceTitle =
            '<h1 id="fpcc_dzfp" style="color:#015293;padding:5px 0px 5px 0px; text-align:center; position:relative" class="info-title-text">' +
            InvoiceTypeOrg +
            "</h1>";

        var invoiceInfo =
            '<table style="width:100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr height="30"><td class="align_left">��Ʊ���룺<span class="content_td_blue InvoiceCode" id="fpdm_dzfp">' +
            InvoiceCode +
            '</span></td><td>&nbsp;</td><td class="align_left">��Ʊ���룺<span class="content_td_blue InvoiceNum" id="fphm_dzfp">' +
            InvoiceNum +
            '</span></td><td>&nbsp;</td><td class="align_left">��Ʊ���ڣ�<span class="content_td_blue InvoiceDate" id="kprq_dzfp">' +
            InvoiceDate +
            '</span></td><td>&nbsp;</td><td class="align_left">У���룺<span class="content_td_blue CheckCode" id="jym_dzfp">' +
            CheckCode +
            '</span></td><td>&nbsp;</td><td class="align_left">������ţ�<span class="content_td_blue machineCode" id="sbbh_dzfp">' +
            machineCode +
            "</span></td><td>&nbsp;</td></tr></tbody></table>";
        var PurchaserDom =
            '<tr><td width="20" class="align_center" rowspan="4"><p>��</p><p>��</p><p>��</p></td><td width="105" class="align_left borderNo">���ƣ�</td><td class="align_left borderNo bgcolorWhite" nowrap=""><span class="content_td_blue PurchaserName" id="gfmc_dzfp">' +
            PurchaserName +
            '</span></td><td width="20" class="align_center" rowspan="4"> <p>��</p><p>��</p><p>��</p></td><td width="350" class="align_left " id="password_dzfp" nowrap="" rowspan="4">&nbsp;</td></tr>' +
            '<tr><td class="align_left borderNo">��˰��ʶ��ţ�</td><td class="align_left borderNo" nowrap=""><span class="content_td_blue PurchaserRegisterNum" id="gfsbh_dzfp">' +
            PurchaserRegisterNum +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo" valign="top">��ַ���绰��</td><td class="align_left borderNo" valign="top"><span class="content_td_blue PurchaserAddress" id="gfdzdh_dzfp">' +
            PurchaserAddress +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo" valign="top">�����м��˺ţ�</td><td class="align_left borderNo" valign="top"><span class="content_td_blue PurchaserBank" id="gfyhzh_dzfp">' +
            PurchaserBank +
            "</span></td></tr>";
        var SellerDom =
            '<tr><td class="align_center" rowspan="4"><p>��</p><p>��</p><p>��</p></td><td class="align_left borderNo">���ƣ�</td><td class="align_left borderNo"><span class="content_td_blue SellerName" id="xfmc_dzfp">' +
            SellerName +
            '</span></td><td width="20" class="align_center" rowspan="4"><p>��</p><p>ע</p></td><td width="350" class="align_left content_td_blue" id="bz_dzfp" valign="top" rowspan="4"><p class="warp remark">' +
            Remarks +
            "</p></td></tr>" +
            '<tr><td class="align_left borderNo">��˰��ʶ��ţ�</td><td class="align_left borderNo"><span class="content_td_blue SellerRegisterNum" id="xfsbh_dzfp">' +
            SellerRegisterNum +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo">��ַ���绰��</td><td class="align_left borderNo"><span class="content_td_blue SellerAddress" id="xfdzdh_dzfp">' +
            SellerAddress +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo">�����м��˺ţ�</td><td class="align_left borderNo"><span class="content_td_blue SellerBank" id="xfyhzh_dzfp">' +
            SellerBank +
            "</span></td></tr>";
        var tableDom =
            '<table class="fppy_table" style="width:100%" border="0" cellspacing="0" cellpadding="0"><tbody>' +
            PurchaserDom +
            CommodityTableDom +
            SellerDom +
            "</tbody></table>";
        var itemDom =
            '<div id="tabPage2" class="swiper-slide"><div id="tabPage-dzfp">' +
            invoiceTitle +
            invoiceInfo +
            tableDom +
            "</div></div>";
        dom += itemDom;
    });

    $(".swiper-wrapper").append(dom);
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
    var str =
        '<tr><td colspan="5"><table class="fppy_table_box" style="width:100%;" cellspacing="0" cellpadding="0"><tbody class="commodity-table"><tr id="tab_head_dzfp">' +
        tHeaderDom +
        tBodyDom +
        tFooterDom +
        tFooterBottomDom +
        "</tbody></table></td></tr> ";
    return str;
};

$.ajax({
    url: "/general/appbuilder/web/invoice/invoice/checkinvoice",
    data: qsParams,
    success: function(res) {
        if (res.status === 1) {
            $("#myModal").addClass("show");
            // flagΪ"1" ����ɹ�
            if (res.flag === "1") {
                // ����ɹ�
                $("#myModal").addClass("pass");
                createDom([{ data: res.result }]);
            } else {
                var data = res.data;
                for (key in qsParams) {
                    var value = data[key];
                    $(".c-" + key).addClass("c-show");
                    $(".c-" + key + " .value").text(value);
                }
                // var InvoiceTypeOrg = transformValue(data.InvoiceTypeOrg);
                // $(".c-InvoiceTypeOrg").text(InvoiceTypeOrg);
                var resultText = transformValue(res.message);
                $(".result-text").text(resultText);
                var checkDate = transformValue(res.checkTime);
                if (checkDate) {
                    $(".check-date").text("����ʱ�䣺" + checkDate);
                }
            }
        }
    }
});

$("#printfp-not-pass").click(function() {
    $("#print-not-pass_area").printArea();
});
$(".closebt").click(function() {
    window.close();
});
$("#printfp").click(function() {
    $(".swiper-wrapper").printArea();
});
