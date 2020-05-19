$(document).ready(function() {
    tMobileSDK.ready(function() {
        var loading = false;
        var scan = function() {
            if (!loading) {
                try {
                    tMobileSDK.ocrScan({
                        fromCamera: true,
                        onSuccess: function(res) {
                            postImage(res);
                        }
                    });
                } catch (error) {
                    // alert(JSON.stringify(error));
                }
            }
        };
        // var postImage = function(res) {
        //     $(".loading").addClass("show");
        //     loading = true;
        //     $.ajax({
        //         url: "/general/appbuilder/web/invoice/invoice/ocr",
        //         // url:"http://192.168.1.62:3000/",
        //         data: Qs.stringify(res),
        //         type: "post",
        //         success: function(response) {
        //             $(".loading").removeClass("show");
        //             loading = false;
        //             if (response.isinvoice === "1") {
        //                 var obj = {};
        //                 obj.imgId = res.id;
        //                 obj.imgName = res.name;
        //                 var url = addQueryStringToUrl(
        //                     "/pda/invoice/invoicedetail/",
        //                     obj
        //                 );
        //                 location.href = url;
        //             } else {
        //                 tip("�����㷢Ʊ");
        //             }
        //         }
        //     });
        // };

        var data = {
            l: {
                class: "",
                event: "history.back();",
                title: ""
            },
            c: {
                class: "",
                title: "��Ʊ��Ϣ"
            },
            r: {
                show: false
            }
        };
        tMobileSDK.buildHeader(data);
        function getQueryParams() {
            var qs =
                    location.search.length > 0 ? location.search.substr(1) : "",
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
        var toast = new Toast($("body"));
        var tip = function(str) {
            toast.show(str);
        };
        var borderBottomDom = '<div class="border-bottom"></div>';
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
        var sellerKeys = [
            {
                id: "SellerName",
                value: "���۷�"
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
        var createDom = function(arr) {
            var sellerKeysDom = "";
            $.each(arr, function(i, item) {
                var liDom = "";
                var spanDom = "";
                var itemValue = item.value;
                for (var j = 0; j < itemValue.length; j++) {
                    var letter = itemValue.substr(j, 1);
                    spanDom += '<span class="span-text">' + letter + "</span>";
                }
                liDom =
                    '<li class="line-content-item"><div class="key">' +
                    spanDom +
                    '</div><span class="pull-left">��</span><div class="value" id="' +
                    item.id +
                    '">--</div></li>';
                sellerKeysDom += liDom;
            });
            sellerKeysDom += borderBottomDom;
            return sellerKeysDom;
        };
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
                        '<div class="commodity-item clearfix"><div class="commodity-key">' +
                        value +
                        '��</div><div class="commodity-value">' +
                        val +
                        "</div></div>";
                    commodityItem += str;
                });
                var itemDom =
                    '<li class="line-content-item"><div class="title"><div class="dot"></div>' +
                    CommodityName +
                    "</div>" +
                    commodityItem +
                    "</li>";
                dom += itemDom;
            });
            $(".commodity-list").append(dom);
        };
        var getScanResult = function() {
            var obj = {};
            obj.id = qsParams.imgId;
            obj.name = qsParams.imgName;
            $.ajax({
                url: "/general/appbuilder/web/invoice/invoice/vatinvoice",
                data: Qs.stringify([obj]),
                type: "post",
                success: function(res) {
                    createRes(res);
                }
            });
        };
        var state;
        var isReimbursement = false;
        var saveByFlowId = function(flowId) {
            var tmpObj = {
                flowId: flowId,
                billId: qsParams.id,
                isMobile: "1"
            };
            $.ajax({
                url: "/inc/ocr/billToApproveCenter.php",
                type: "post",
                data: Qs.stringify(tmpObj),
                success: function(res) {
                    location.href = res;
                }
            });
        };
        var ins = new SelectFlow({
            cb: function() {
                isReimbursement = true;
                handleState(state);
            },
            save: saveByFlowId
        });

        var handleState = function(state) {
            if (state) {
                $(".btns")
                    .unbind()
                    .empty();
                $(".btns").remove();
                $(".invoice-detail").append(
                    '<div class="btns  clearfix"></div>'
                );
                var btnDom = "";
                var btnCls = "";
                switch (state) {
                    case "0":
                        btnDom =
                            '<div class="del-btn"><span>ɾ��</span></div><div class="sign-btn"><span>�����ʹ��</span></div>';
                        if (isReimbursement) {
                            btnDom += reimbursementDtn;
                            btnCls = "three";
                        } else {
                            btnCls = "two";
                        }
                        break;
                    case "1":
                        btnDom =
                            '<div class="del-btn"><span>ɾ��</span></div><div class="sign-btn"><span>���δʹ��</span></div>';
                        btnCls = "two";
                        break;
                    case "2":
                        btnDom =
                            '<div class="save-btn"><span>����</span></div>';
                        if (isReimbursement) {
                            btnDom += reimbursementDtn;
                            btnCls = "two";
                        } else {
                            btnCls = "one";
                        }
                        break;
                    default:
                        btnDom =
                            '<div class="reScan-btn"><span>����</span></div>';
                        btnCls = "one";
                        break;
                }

                $(".btns")
                    .append(btnDom)
                    .addClass("show " + btnCls + "-btn")
                    .unbind();
                $(".reScan-btn").tap(function() {
                    scan();
                });
                $(".del-btn").tap(function() {
                    $.ajax({
                        url:
                            "/general/appbuilder/web/invoice/invoice/delinvoice",
                        data: {
                            id: qsParams.id
                        },
                        success: function(res) {
                            if (res.status) {
                                history.back();
                            }
                        }
                    });
                });

                $(".sign-btn").tap(function() {
                    // ���
                    $.ajax({
                        url:
                            "/general/appbuilder/web/invoice/invoice/updatestate",
                        data: {
                            id: qsParams.id
                        },
                        success: function(res) {
                            if (res.status) {
                                location.href = location.href;
                            }
                        }
                    });
                });
                $(".save-btn").tap(function() {
                    var tmpArr = [];
                    tmpArr.push({
                        id: qsParams.imgId,
                        name: qsParams.imgName
                    });
                    $.ajax({
                        url:
                            "/general/appbuilder/web/invoice/invoice/saveinvoice",
                        data: Qs.stringify(tmpArr),
                        type: "post",
                        success: function(res) {
                            if (res.status) {
                                history.back();
                            }
                        }
                    });
                });
                $(".reimbursement-btn").tap(function() {
                    ins.showDrawer();
                });
            }
        };
        var stateImgMap = {
            // δʹ��
            // "0": "myticketfolder_notused_icon3x.png",
            "0": "myticketfolder_pass_icon@.png?77777",
            // ��ʹ��
            // "1": "myticketfolder_used_icon@3x.png",
            "1": "myticketfolder_pass_icon@.png?77777",
            // ��ͨ��
            "2": "myticketfolder_pass_icon@.png?77777",
            // δͨ��
            "3": "myticketfolder_notpass_icon@3x.png"
        };
        var reimbursementDtn =
            '<div class="reimbursement-btn"><span>����</span></div>';
        var createRes = function(res) {
            if (res.status) {
                var words_result = res.data.words_result;
                var stateImgDom = "";
                if (qsParams.id) {
                    state = res.data.state;
                } else {
                    res.data.ispass === "1" ? (state = "2") : (state = "3");
                }
                var imgCls = "";
                stateImgDom = '<img src="./img/' + stateImgMap[state] + '">';
                $(".state-img")
                    .empty()
                    .append(stateImgDom);
                // var state = res.data.state;
                var InvoiceTypeOrg = words_result.InvoiceTypeOrg;

                $(".invoice-info-title-value").text(InvoiceTypeOrg);

                var allArr = sellerKeys.concat(purchaserKeys).concat(mainkeys);
                $.each(allArr, function(index, item) {
                    var id = item.id;
                    var value = words_result[id];
                    if (value) {
                        $("#" + id).text(value);
                    }
                });
                var Commodity = res.data.Commodity;
                createCommodity(Commodity);
                var url = res.data.url;
                if (url) {
                    var attach =
                        '<img  src="' + url + '" class="' + imgCls + '">';
                    $(".attachment-img")
                        .empty()
                        .append(attach);
                }
                $(".attachment-img img").tap(function(e) {
                    tMobileSDK.previewImage({
                        urls: [e.target.src],
                        allowDownload: false,
                        onSuccess: function() {}
                    });
                });
                $(".invoice-info").addClass("show");
                handleState(state);
            }
        };
        var fetchApplyDetail = function(id) {
            $.ajax({
                url: "/general/appbuilder/web/invoice/invoice/invoiceone",
                data: {
                    id: id
                },
                success: function(res) {
                    createRes(res);
                },
                error: function(err) {
                    console.log(err);
                }
            });
        };
        var qsParams = getQueryParams();

        if (qsParams.id) {
            fetchApplyDetail(qsParams.id);
        } else {
            getScanResult();
        }
    });
});
