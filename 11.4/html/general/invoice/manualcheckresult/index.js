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

// 防止返回null false
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
        // 合计金额
        var TotalAmount = transformValue(item.data.words_result.TotalAmount);
        // 合计税额
        var TotalTax = transformValue(item.data.words_result.TotalTax);
        // 价税合计(小写)
        var AmountInFiguers = transformValue(
            item.data.words_result.AmountInFiguers
        );
        // 价税合计(大写)
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
            '<table style="width:100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr height="30"><td class="align_left">发票代码：<span class="content_td_blue InvoiceCode" id="fpdm_dzfp">' +
            InvoiceCode +
            '</span></td><td>&nbsp;</td><td class="align_left">发票号码：<span class="content_td_blue InvoiceNum" id="fphm_dzfp">' +
            InvoiceNum +
            '</span></td><td>&nbsp;</td><td class="align_left">开票日期：<span class="content_td_blue InvoiceDate" id="kprq_dzfp">' +
            InvoiceDate +
            '</span></td><td>&nbsp;</td><td class="align_left">校验码：<span class="content_td_blue CheckCode" id="jym_dzfp">' +
            CheckCode +
            '</span></td><td>&nbsp;</td><td class="align_left">机器编号：<span class="content_td_blue machineCode" id="sbbh_dzfp">' +
            machineCode +
            "</span></td><td>&nbsp;</td></tr></tbody></table>";
        var PurchaserDom =
            '<tr><td width="20" class="align_center" rowspan="4"><p>购</p><p>买</p><p>方</p></td><td width="105" class="align_left borderNo">名称：</td><td class="align_left borderNo bgcolorWhite" nowrap=""><span class="content_td_blue PurchaserName" id="gfmc_dzfp">' +
            PurchaserName +
            '</span></td><td width="20" class="align_center" rowspan="4"> <p>密</p><p>码</p><p>区</p></td><td width="350" class="align_left " id="password_dzfp" nowrap="" rowspan="4">&nbsp;</td></tr>' +
            '<tr><td class="align_left borderNo">纳税人识别号：</td><td class="align_left borderNo" nowrap=""><span class="content_td_blue PurchaserRegisterNum" id="gfsbh_dzfp">' +
            PurchaserRegisterNum +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo" valign="top">地址、电话：</td><td class="align_left borderNo" valign="top"><span class="content_td_blue PurchaserAddress" id="gfdzdh_dzfp">' +
            PurchaserAddress +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo" valign="top">开户行及账号：</td><td class="align_left borderNo" valign="top"><span class="content_td_blue PurchaserBank" id="gfyhzh_dzfp">' +
            PurchaserBank +
            "</span></td></tr>";
        var SellerDom =
            '<tr><td class="align_center" rowspan="4"><p>销</p><p>售</p><p>方</p></td><td class="align_left borderNo">名称：</td><td class="align_left borderNo"><span class="content_td_blue SellerName" id="xfmc_dzfp">' +
            SellerName +
            '</span></td><td width="20" class="align_center" rowspan="4"><p>备</p><p>注</p></td><td width="350" class="align_left content_td_blue" id="bz_dzfp" valign="top" rowspan="4"><p class="warp remark">' +
            Remarks +
            "</p></td></tr>" +
            '<tr><td class="align_left borderNo">纳税人识别号：</td><td class="align_left borderNo"><span class="content_td_blue SellerRegisterNum" id="xfsbh_dzfp">' +
            SellerRegisterNum +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo">地址、电话：</td><td class="align_left borderNo"><span class="content_td_blue SellerAddress" id="xfdzdh_dzfp">' +
            SellerAddress +
            "</span></td></tr>" +
            '<tr><td class="align_left borderNo">开户行及账号：</td><td class="align_left borderNo"><span class="content_td_blue SellerBank" id="xfyhzh_dzfp">' +
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
            // flag为"1" 查验成功
            if (res.flag === "1") {
                // 查验成功
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
                    $(".check-date").text("查验时间：" + checkDate);
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
