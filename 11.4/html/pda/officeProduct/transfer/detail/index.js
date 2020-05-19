$(document).ready(function() {
    tMobileSDK.ready(function() {
        var data = {
            l: {
                class: "",
                event: "history.back();",
                title: ""
            },
            c: {
                class: "",
                title: "调拨入库详情"
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

        var is_checkedMap = {
            "1": "未确认",
            "2": "已出库"
        };
        var transfer_typeMap = {
            "1": "调出",
            "2": "调入"
        };

        var fetchApplyDetail = function(id) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productlibrarymanage/transferinfo",
                data: {
                    id: id
                },
                success: function(res) {
                    var status = res.status;
                    if (status) {
                        var el = $(".office-product-detail");
                        var data = res.data;
                        // 调拨物品
                        var pro_long_name = data.pro_long_name;
                        // 规格型号
                        var pro_desc = data.pro_desc;
                        // 库存
                        var pro_stock = data.pro_stock;
                        // 出入库状态
                        var is_checked = data.is_checked;
                        var state = is_checkedMap[is_checked];
                        // 调拨类型
                        var transfer_type = data.transfer_type;
                        var transfer_typeValue =
                            transfer_typeMap[transfer_type];
                        // 调拨对象
                        var type_long_name = data.type_long_name;
                        // 调拨数量
                        var transfer_num = data.transfer_num;
                        // 操作员
                        var operator = data.operator;
                        // 调拨时间
                        var transfer_date = data.transfer_date;
                        // 备注
                        var remark = data.remark;
                        if (!remark) remark = "无";
                        // 物品id
                        var pro_id = data.pro_id;
                        // 单价
                        var price = data.price;
                        var batch_num = data.batch_num;
                        var dom =
                            '<div class="info"><div class="info-title"><span class="info-title-text">物品信息</span></div><div class="pro_name"><span class="pro_name-text">调拨物品</span><span class="pro_name-value">' +
                            pro_long_name +
                            '</span></div><div class="pro_desc"><span class="pro_desc-text">规格/型号</span><span class="pro_desc-value">' +
                            pro_desc +
                            '</span></div><div class="trans_flag"><span class="trans_flag-text">当前库存</span><span class="trans_flag-value">' +
                            pro_stock +
                            '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">调拨信息</span><span class="info-title-state">' +
                            state +
                            '</span></div><div class="trans_date"><span class="trans_date-text">调拨类型</span><span class="trans_date-value">' +
                            transfer_typeValue +
                            '</span></div><div class="dept_name"><span class="dept_name-text">调拨对象</span><span class="dept_name-value">' +
                            type_long_name +
                            '</span></div><div class="fact_qty"><span class="fact_qty-text">调拨数量</span><span class="fact_qty-value">' +
                            transfer_num +
                            '</span></div><div class="take_time"><span class="take_time-text">操作员</span><span class="take_time-value">' +
                            operator +
                            '</span></div><div class="return_time"><span class="return_time-text">调拨时间</span><span class="return_time-value">' +
                            transfer_date +
                            '</span></div><div class="remark"><div class="remark-text">备注</div><div class="remark-value">' +
                            remark +
                            "</div></div></div>";
                        var buttonDom = "";
                        if (is_checked === 1) {
                            buttonDom = '<div class="cancel-btn">入库</div>';
                        }
                        dom += buttonDom;
                        el.append(dom);
                        if (buttonDom) {
                            el.find(".cancel-btn").tap(function() {
                                $.ajax({
                                    url:
                                        "/general/appbuilder/web/officeproduct/productinlibrary/createinlibrary",
                                    type: "post",
                                    data: Qs.stringify({
                                        arr: [
                                            {
                                                pro_id: pro_id,
                                                number: transfer_num,
                                                pro_price: price,
                                                transfer_id: id,
                                                is_allot: "1",
                                                batch_num: batch_num
                                            }
                                        ]
                                    }),
                                    success: function(res) {
                                        if (res && res.status) {
                                            location.href =
                                                "/pda/officeProduct/transfer/list/";
                                        }
                                    }
                                });
                            });
                        }
                    }
                }
            });
        };

        var qsParams = getQueryParams();
        fetchApplyDetail(qsParams.id);
    });
});
