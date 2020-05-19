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
                title: "物品审批详情"
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
        function trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        var trans_flagMap = {
            "1": "领用",
            "2": "借用"
        };
        // 和申领列表不同
        var stateMap = {
            "1": "已通过",
            "2": "已通过",
            "3": "待审批",
            "4": "被驳回",
            "5": "已通过"
        };
        var approvalhandle = function(options) {
            var id = options.trans_id;
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productapproval/approvalhandle",
                data: options,
                type: "post",
                success: function(res) {
                    if (res && res.status) {
                        fetchApplyDetail(id);
                    }
                }
            });
        };

        var fetchApplyDetail = function(id) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productcheckout/gettransinfo",
                data: {
                    id: id
                },
                success: function(res) {
                    var status = res.status;
                    if (status) {
                        var el = $(".office-product-detail");
                        el.empty();
                        var data = res.data;
                        if (data) {
                            // 使用方式1-领用，2-借用
                            var trans_flag = data.trans_flag;
                            // 状态
                            var state = data.state;
                            // 物品名称
                            var pro_name = data.pro_name;
                            // 申请数量
                            var fact_qty = data.fact_qty;
                            // 领取日期
                            var take_time = data.take_time.split(" ")[0];
                            // 归还日期
                            var return_time = data.return_time;
                            // 规格型号
                            var pro_desc = data.pro_desc;
                            // 申领日期
                            var trans_date = data.trans_date;
                            // 申领部门
                            var dept_name = data.dept_name;
                            // 实际归还日期
                            // var fact_return_time = data.fact_return_time.split(" ")[0];
                            // 库存
                            var pro_stock = data.pro_stock;
                            // 申领人
                            var borrower = data.borrower;
                            // 备注
                            var remark = data.remark;
                            if (!remark) remark = "无";
                            var returnDom = "";
                            if (trans_flag !== "1") {
                                // 领用的没有归还日期和实际归还日期
                                returnDom =
                                    '<div class="return_time"><span class="return_time-text">归还日期</span><span class="return_time-value">' +
                                    return_time +
                                    "</span></div>";
                            }

                            // 驳回说明
                            var rejectDom = "";
                            if (state === 4) {
                                var reason = data.reason;
                                if (reason) {
                                    rejectDom =
                                        '<div class="reject-info"><div class="reject-text">驳回说明</div><div class="reject-value">' +
                                        reason +
                                        "</div></div>";
                                }
                            }
                            var buttons = "";
                            if (state === 3) {
                                buttons =
                                    '<div><div class="reject">驳回</div><div class="pass clearfix">通过</div></div>';
                            }
                            var detailDom =
                                '<div class="info"><div class="info-title"><span class="info-title-text">物品信息</span></div><div class="pro_name"><span class="pro_name-text">申领物品</span><span class="pro_name-value">' +
                                pro_name +
                                '</span></div><div class="pro_desc"><span class="pro_desc-text">规格/型号</span><span class="pro_desc-value">' +
                                pro_desc +
                                '</span></div><div class="pro_desc"><span class="pro_desc-text">使用方式</span><span class="pro_desc-value">' +
                                trans_flagMap[trans_flag] +
                                '</span></div><div class="trans_flag"><span class="trans_flag-text">当前库存</span><span class="trans_flag-value">' +
                                pro_stock +
                                '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">申领信息</span><span class="info-title-state">' +
                                stateMap[state] +
                                '</span></div><div class="trans_date"><span class="trans_date-text">申领日期</span><span class="trans_date-value">' +
                                trans_date +
                                '</span></div><div class="dept_manager"><span class="dept_manager-text">申领人</span><span class="dept_manager-value">' +
                                borrower +
                                '</span></div><div class="dept_name"><span class="dept_name-text">申领部门</span><span class="dept_name-value">' +
                                dept_name +
                                '</span></div><div class="fact_qty"><span class="fact_qty-text">申领数量</span><span class="fact_qty-value">' +
                                fact_qty +
                                '</span></div><div class="take_time"><span class="take_time-text">领用日期</span><span class="take_time-value">' +
                                take_time +
                                "</span></div>" +
                                returnDom +
                                '<div class="remark"><div class="remark-text">备注</div><div class="remark-value">' +
                                remark +
                                "</div></div></div>" +
                                rejectDom +
                                buttons;
                        }
                        if (buttons) {
                            detailDom +=
                                '<div class="ui-dialog"><div class="ui-dialog-cnt"><div class="ui-dialog-bd"><h3>办公用品驳回声明</h3><textarea value="" type="text" placeholder="" autocapitalize="off" id="reject-value"></textarea></div><div class="ui-dialog-ft"><button type="button" data-role="button" class="btn-cancle">取消</button><button type="button" data-role="button" class="btn-submit">确定</button></div></div></div>';
                        }
                        el.append(detailDom);
                        if (buttons) {
                            el.find(".pass").tap(function() {
                                approvalhandle({
                                    trans_id: id,
                                    state: 1,
                                    apply_num: fact_qty,
                                    reason: ""
                                });
                            });
                            el.find(".reject").tap(function() {
                                el.find(".ui-dialog").addClass("show");
                            });
                            el.find(".btn-cancle").tap(function() {
                                el.find("#reject-value").val("");
                                el.find(".ui-dialog").removeClass("show");
                            });
                            el.find(".btn-submit").tap(function() {
                                var value = el.find("#reject-value").val();
                                approvalhandle({
                                    trans_id: id,
                                    state: 2,
                                    apply_num: fact_qty,
                                    reason: trim(value)
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
