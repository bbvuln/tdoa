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
                title: "入库详情"
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
        // function trim(str) {
        //     return str.replace(/(^\s*)|(\s*$)/g, "");
        // }

        var fetchApplyDetail = function(id) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productinlibrary/inlibraryinfo",
                data: {
                    pro_id: id
                },
                success: function(res) {
                    var status = res.status;
                    if (status) {
                        var el = $(".office-product-detail");
                        el.unbind().empty();
                        var data = res.data;
                        var logDom = "";
                        if (data && data.length) {
                            var log = "";
                            $.each(data, function(index, item) {
                                var time = item.time;
                                var inlibrary_data = item.inlibrary_data;
                                var infoDoms = "";
                                $.each(inlibrary_data, function(
                                    inIndex,
                                    inItem
                                ) {
                                    var batch = inItem.batch;
                                    var creator = inItem.creator;
                                    var number = inItem.number;
                                    var pro_price = inItem.pro_price;
                                    var remarks = inItem.remarks;
                                    var className = "";
                                    if (inIndex === inlibrary_data.length - 1) {
                                        className = "no-border";
                                    }
                                    var infoDom =
                                        '<div class="log-info ' +
                                        className +
                                        '"><div class="batch"><div class="key">产品批次：</div><div class="value">' +
                                        batch +
                                        '</div></div><div class="number"><div class="key">入库数量：</div><div class="value">' +
                                        number +
                                        '</div></div><div class="pro_price"><div class="key">单价：</div><div class="value">' +
                                        pro_price +
                                        '</div></div><div class="creator"><div class="key">入库员：</div><div class="value">' +
                                        creator +
                                        '</div></div><div class="remarks"><span class="key">备注：</span><span class="value">' +
                                        remarks +
                                        '</span></div><div class="line"></div></div>';
                                    infoDoms += infoDom;
                                });
                                var timeStr =
                                    '<div class="item-wrap"><div class="time-title"><img src="/pda/officeProduct/img/icon_process@3x.png" ><div class="time">' +
                                    time +
                                    "</div></div>" +
                                    infoDoms +
                                    "</div>";
                                log += timeStr;
                                // console.log(item);
                            });
                            logDom =
                                '<div class="apply-info"><div class="info-title"><span class="info-title-text">入库记录</span></div>' +
                                log +
                                "</div>";
                        }

                        // 所属分类
                        var type_name = res.type_name;
                        // 物品名称
                        var pro_name = res.pro_name;
                        // 规格型号
                        var pro_desc = res.pro_desc;
                        // 库存
                        var pro_stock = res.pro_stock;
                        // 入库总量
                        var pro_total = res.pro_total;

                        var detailDom =
                            '<div class="info"><div class="info-title"><span class="info-title-text">物品信息</span></div><div class="pro_name"><span class="pro_name-text">入库物品</span><span class="pro_name-value">' +
                            pro_name +
                            '</span></div><div class="pro_desc"><span class="pro_desc-text">规格/型号</span><span class="pro_desc-value">' +
                            pro_desc +
                            '</span></div><div class="trans_flag"><span class="trans_flag-text">所属分类</span><span class="trans_flag-value">' +
                            type_name +
                            '</span></div><div class="trans_flag"><span class="trans_flag-text">当前库存</span><span class="trans_flag-value">' +
                            pro_stock +
                            '</span></div><div class="trans_flag"><span class="trans_flag-text">入库总量</span><span class="trans_flag-value">' +
                            pro_total +
                            "</span></div></div>";

                        el.append(detailDom + logDom);
                    }
                }
            });
        };
        var qsParams = getQueryParams();
        var pro_id = qsParams.id;
        fetchApplyDetail(pro_id);
    });
});
