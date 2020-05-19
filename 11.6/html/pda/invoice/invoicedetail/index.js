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
        //                 tip("请拍摄发票");
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
                title: "发票信息"
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
                value: "购买方"
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
        var sellerKeys = [
            {
                id: "SellerName",
                value: "销售方"
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
            {
                id: "trainCode",
                value: "发票号码"
            },
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
                value: "日期"
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
                    '</div><span class="pull-left">：</span><div class="value ' +
                    item.id +
                    '" >--</div></li>';
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
                        '<div class="commodity-item clearfix"><div class="commodity-key">' +
                        value +
                        '：</div><div class="commodity-value">' +
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
                isMobile: "1",
                flowPrcs: 1
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
        var handleDel = function() {
            $.ajax({
                url: "/general/appbuilder/web/invoice/invoice/delinvoice",
                data: {
                    id: qsParams.id
                },
                success: function(res) {
                    if (res.status) {
                        history.back();
                    }
                }
            });
        };

        var handleState = function(state) {
            if (state) {
                if (state === "0" || state === "1") {
                    $(".btns")
                        .unbind()
                        .empty();
                    $(".btns").remove();
                    $(".height-wrap").append(
                        '<div class="btns  clearfix"></div>'
                    );
                    var btnDom = "";
                    var btnCls = "";
                    switch (state) {
                        case "0":
                            btnDom =
                                '<div class="del-btn"><span>删除</span></div><div class="sign-btn"><span>标记已使用</span></div>';
                            if (isReimbursement) {
                                btnDom += reimbursementDtn;
                                btnCls = "three";
                            } else {
                                btnCls = "two";
                            }
                            break;
                        case "1":
                            btnDom =
                                '<div class="del-btn"><span>删除</span></div><div class="sign-btn"><span>标记未使用</span></div>';
                            btnCls = "two";
                            break;
                        // case "2":
                        //     btnDom =
                        //         '<div class="save-btn"><span>保存</span></div>';
                        //     if (isReimbursement) {
                        //         btnDom += reimbursementDtn;
                        //         btnCls = "two";
                        //     } else {
                        //         btnCls = "one";
                        //     }
                        //     break;
                        // default:
                        //     btnDom =
                        //         '<div class="reScan-btn"><span>重拍</span></div>';
                        //     btnCls = "one";
                        //     break;
                        default:
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
                        $(".del-dialog").addClass("show");
                    });
                    $(".btn-cancle").tap(function() {
                        $(".del-dialog").removeClass("show");
                    });
                    $(".btn-submit-del").tap(function() {
                        handleDel();
                    });
                    $(".sign-btn").tap(function() {
                        // 标记
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
            }
        };
        var stateImgMap = {
            // 未使用
            // "0": "myticketfolder_notused_icon3x.png",
            "0": "myticketfolder_notused_icon2@3x.png?77777",
            // 已使用
            // "1": "myticketfolder_used_icon@3x.png",
            "1": "myticketfolder_used_icon@3x.png?77777",
            "2": "myticketfolder_approval_icon@3x.png"
            // // 已通过
            // "2": "myticketfolder_pass_icon@.png?77777",
            // // 未通过
            // "3": "myticketfolder_notpass_icon@3x.png"
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
        var centerTopImgMap = {
            "01": "./img/invoice.png@3x.png",
            "04": "./img/invoice.png@3x.png",
            "10": "./img/invoice.png@3x.png",
            "21": "./img/train_icon@3x.png",
            "22": "./img/aircraft_icon@3x.png",
            "23": "./img/taxi_icon@3x.png"
        };
        var reimbursementDtn =
            '<div class="reimbursement-btn"><span>报销</span></div>';
        var createRes = function(res) {
            if (res.status) {
                var allArr;
                var InvoiceType = res.data.InvoiceType;
                $(".invoice-info").addClass(billMap[InvoiceType]);
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
                var centerTopImg =
                    '<img src="' + centerTopImgMap[InvoiceType] + '">';
                $(".top-img-center")
                    .empty()
                    .append(centerTopImg);
                // var state = res.data.state;
                var InvoiceTypeOrg = words_result.InvoiceTypeOrg;

                $(".invoice-info-title-value").text(InvoiceTypeOrg);
                if (
                    InvoiceType === "01" ||
                    InvoiceType === "04" ||
                    InvoiceType === "10"
                ) {
                    allArr = sellerKeys.concat(purchaserKeys).concat(mainkeys);
                    var Commodity = res.data.Commodity;
                    createCommodity(Commodity);
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

                var url = res.data.url;
                if (url) {
                    if (res.data.is_pdf === "1") {
                        $(".attachment-img")
                            .empty()
                            .append(url);
                        // $(".attachment-img").tap(function(e) {
                        //     var href = $(this)
                        //         .find(".pda_attach")
                        //         .attr("_href");
                        //     tMobileSDK.previewFile({
                        //         canEdit: false,
                        //         url: href,
                        //         onSuccess: function() {}
                        //     });
                        // });
                    } else {
                        imgCls = "img-wrap";
                        var attach =
                            '<img  src="' + url + '" class="' + imgCls + '">';
                        $(".attachment-img")
                            .empty()
                            .append(attach);
                        $(".attachment-img img").tap(function(e) {
                            tMobileSDK.previewImage({
                                urls: [e.target.src],
                                allowDownload: false,
                                onSuccess: function() {}
                            });
                        });
                    }
                }

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
