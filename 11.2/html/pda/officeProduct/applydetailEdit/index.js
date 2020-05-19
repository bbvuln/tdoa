$(document).ready(function() {
    tMobileSDK.ready(function() {
        var toast = new Toast($("body"));
        var data = {
            l: {
                class: "",
                event: "history.back();",
                title: ""
            },
            c: {
                class: "",
                title: "物品申领编辑"
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
        var trans_flagMap = {
            "1": "领用",
            "2": "借用"
        };
        var stateMap = {
            "1": "已发放",
            "2": "待发放",
            "3": "待审批",
            "4": "被驳回",
            "5": "已归还",
            "6": "已取消"
        };

        var inputVal = function(val) {
            return (
                '<div class="input-val clearfix"><div class="btn_subtraction"><img src="/pda/officeProduct/add/img/btn_subtraction@3x.png"></div><input value="' +
                val +
                '" type="number" placeholder="" autocapitalize="off" id="fact_qty" class="input-num"><div class="btn_addition"><img src="/pda/officeProduct/add/img/btn_addition@3x.png"></div></div>'
            );
        };
        var handleClickNum = function(type) {
            var $input = $("#fact_qty");
            var inputValue = parseFloat($input.val());
            if (inputValue >= 0) {
                var nextValue;
                // 减少数量
                if (type === "decrease") {
                    if (inputValue === 0) {
                        return;
                    }
                    nextValue = inputValue - 1;
                }
                // 添加数量
                if (type === "increase") {
                    nextValue = inputValue + 1;
                }
                $input.val(nextValue);
            }
        };
        var addZero = function(num) {
            var str = "";
            if (num < 10) {
                str = "0" + num;
            } else {
                str = "" + num;
            }
            return str;
        };
        var applycancel = function(id) {
            history.back();
        };
        var proreturn = function(id) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productapply/proreturn",
                data: {
                    id: id
                },
                success: function(res) {
                    if (res && res.status) {
                        fetchApplyDetail(id);
                    }
                }
            });
        };
        var tip = function(str) {
            toast.show(str);
        };
        var max_num;
        var check = function(dataItem, rules) {
            // 正整数正则
            // var reg = /^(0|\+?[1-9][0-9]*)$/;
            var reg = /^[1-9]\d*$/;
            if (!reg.test(dataItem.fact_qty)) {
                tip("请正确输入数量");
                return false;
            }
            if (dataItem.fact_qty > rules.max_num) {
                tip("最多可申领" + rules.max_num);
                return false;
            }

            if (!dataItem.take_date) {
                tip("请输入申领日期");
                return false;
            }
            if (rules.trans_flag === "2") {
                if (!dataItem.return_date) {
                    tip("请输入归还日期");
                    return false;
                }
                if (dataItem.take_date > dataItem.return_date) {
                    tip("请正确输入申领日期和归还日期");
                    return false;
                }
            }
            // 需要审批人
            if (!dataItem.dept_manager.uid) {
                tip("请选择审批人");
                return false;
            }
            return true;
        };
        var save = function(opts) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productapply/updateapply",
                // data: Qs.stringify({ arr: [opts] }),
                data: opts,
                type: "post",
                success: function(res) {
                    var status = res.status;
                    if (status) {
                        tip("保存成功");
                        history.back();
                    } else {
                        if (res.max >= 0) {
                            if (res.max === 0) {
                                tip("库存为0");
                            } else {
                                max_num = res.max;
                                tip(res.msg);
                            }
                        }
                    }
                }
            });
        };
        var dept_manager = {};
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
                            max_num = data.max_num;
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
                            var fact_return_time = data.fact_return_time.split(
                                " "
                            )[0];
                            // 出库时间
                            var checkout_time = data.checkout_time;
                            // 审批人
                            dept_manager = {
                                uid: data.dept_manager_uid,
                                userName: data.dept_manager
                            };
                            // 物品id
                            var pro_id = data.pro_id;
                            // 备注
                            var remark = data.remark;
                            // 是否需要审批  0需要审批 1不需要审批
                            var approve_not = data.approve_not;
                            var dept_managerDom = "";
                            if (approve_not === 0) {
                                dept_managerDom =
                                    '<div class="dept_manager"><span class="dept_manager-text">审批人</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><span class="dept_manager-value">' +
                                    dept_manager.userName +
                                    "</span></div>";
                            }
                            //   if (!remark) remark = "无";
                            var returnDom = "";
                            if (trans_flag !== "1") {
                                var factReturnTime = "";
                                if (state == 5) {
                                    factReturnTime =
                                        '<div class="fact_return_time"><span class="fact_return_time-text">实际归还日期</span><span class="fact_return_time-value">' +
                                        fact_return_time +
                                        '</span></div><div class="fact_return_time"><span class="fact_return_time-text">出库时间</span><span class="fact_return_time-value">' +
                                        checkout_time +
                                        "</span></div>";
                                }
                                // 领用的没有归还日期和实际归还日期
                                returnDom =
                                    '<div class="return_time"><span class="return_time-text">归还日期</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><span class="return_time-value">' +
                                    return_time +
                                    "</span></div>" +
                                    factReturnTime;
                            }
                            // 取消申领按钮
                            var cancelBtnDom = "";
                            var detailDom = "";
                            // 提取归还按钮
                            var proreturnBtnDom = "";
                            if (state == 3) {
                                if (trans_flag !== "1") {
                                    // 领用的没有归还日期和实际归还日期
                                    returnDom =
                                        '<div class="return_time date-wrap"><span class="return_time-text">归还日期</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><input type="text" value="' +
                                        return_time +
                                        '" readonly="" class="input-date-end input-date" ></div>';
                                }
                                var btns =
                                    '<div><div class="cancel clearfix">取消</div><div class="save">保存</div></div>';
                                detailDom =
                                    '<div class="info"><div class="info-title"><span class="info-title-text">物品信息</span></div><div class="pro_name"><span class="pro_name-text">申领物品</span><span class="pro_name-value">' +
                                    pro_name +
                                    '</span></div><div class="pro_desc"><span class="pro_desc-text">规格/型号</span><span class="pro_desc-value">' +
                                    pro_desc +
                                    '</span></div><div class="trans_flag"><span class="trans_flag-text">使用方式</span><span class="trans_flag-value">' +
                                    trans_flagMap[trans_flag] +
                                    '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">申领信息</span><span class="info-title-state">' +
                                    stateMap[state] +
                                    '</span></div><div class="trans_date"><span class="trans_date-text">申领日期</span><span class="trans_date-value">' +
                                    trans_date +
                                    '</span></div><div class="dept_name"><span class="dept_name-text">申领部门</span><span class="dept_name-value">' +
                                    dept_name +
                                    '</span></div><div class="fact_qty"><span class="fact_qty-text">申领数量</span>' +
                                    inputVal(fact_qty) +
                                    '</div><div class="take_time date-wrap"><span class="take_time-text">领用日期</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><input type="text" value="' +
                                    take_time +
                                    '" readonly="" class="input-date-start input-date" ></div>' +
                                    returnDom +
                                    dept_managerDom +
                                    '<div class="remark"><div class="remark-text">备注</div><textarea  type="text" placeholder="" autocapitalize="off" id="remark-value">' +
                                    remark +
                                    "</textarea></div></div>" +
                                    btns;
                            } else {
                                if (state === 2) {
                                    cancelBtnDom =
                                        '<div class="cancel-btn">取消申领</div>';
                                }
                                if (trans_flag === "2" && state === 1) {
                                    var myDate = new Date();
                                    var year = myDate.getFullYear(); //获取当前年
                                    var mon = myDate.getMonth() + 1; //获取当前月
                                    var date = myDate.getDate(); //获取当前日
                                    mon = addZero(mon);
                                    date = addZero(date);
                                    var thisTime =
                                        year + "-" + mon + "-" + date;
                                    if (thisTime < return_time) {
                                        proreturnBtnDom =
                                            '<div class="return-btn">提前归还</div>';
                                    }
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
                                detailDom =
                                    '<div class="info"><div class="info-title"><span class="info-title-text">物品信息</span></div><div class="pro_name"><span class="pro_name-text">申领物品</span><span class="pro_name-value">' +
                                    pro_name +
                                    '</span></div><div class="pro_desc"><span class="pro_desc-text">规格/型号</span><span class="pro_desc-value">' +
                                    pro_desc +
                                    '</span></div><div class="trans_flag"><span class="trans_flag-text">使用方式</span><span class="trans_flag-value">' +
                                    trans_flagMap[trans_flag] +
                                    '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">申领信息</span><span class="info-title-state">' +
                                    stateMap[state] +
                                    '</span></div><div class="trans_date"><span class="trans_date-text">申领日期</span><span class="trans_date-value">' +
                                    trans_date +
                                    '</span></div><div class="dept_name"><span class="dept_name-text">申领部门</span><span class="dept_name-value">' +
                                    dept_name +
                                    '</span></div><div class="fact_qty"><span class="fact_qty-text">申领数量</span><span class="fact_qty-value">' +
                                    fact_qty +
                                    '</span></div><div class="take_time"><span class="take_time-text">领用日期</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><span class="take_time-value">' +
                                    take_time +
                                    "</span></div>" +
                                    returnDom +
                                    dept_managerDom +
                                    '<div class="remark"><div class="remark-text">备注</div><div class="remark-value">' +
                                    remark +
                                    "</div></div></div>" +
                                    cancelBtnDom +
                                    proreturnBtnDom +
                                    rejectDom;
                            }
                        }

                        el.append(detailDom);
                        if (state === 3) {
                            //绑定事件
                            el.find(".date-wrap").each(function(index, item) {
                                var defaultValue = "";
                                var inputDateDom = $(this).find(".input-date");
                                if (inputDateDom.hasClass("input-date-start")) {
                                    defaultValue = take_time;
                                }
                                if (inputDateDom.hasClass("input-date-end")) {
                                    defaultValue = return_time;
                                }
                                $(item)
                                    .mobiscroll()
                                    .date({
                                        theme: "ios7",
                                        display: "bottom",
                                        lang: "zh",
                                        mode: "scroller",
                                        dateFormat: "yy-mm-dd",
                                        endYear: 3000,
                                        onShow: function(
                                            html,
                                            valueText,
                                            inst
                                        ) {
                                            setTimeout(function() {
                                                $(".dwbg").css({
                                                    top: "auto",
                                                    bottom: 0
                                                });
                                            });
                                        },
                                        defaultValue: defaultValue
                                            ? new Date(defaultValue)
                                            : new Date(),
                                        onSelect: function(valueText, inst) {
                                            //选择时事件（点击确定后），valueText 为选择的时间，
                                            inputDateDom.attr(
                                                "value",
                                                valueText
                                            );
                                        }
                                    });
                            });
                            el.find(".dept_manager").on("tap", function() {
                                $.ajax({
                                    url:
                                        "/general/appbuilder/web/officeproduct/productapply/getproapprover",
                                    data: {
                                        id: pro_id
                                    },
                                    success: function(re) {
                                        var arr = [];
                                        $.each(re.data, function(index, item) {
                                            arr.push(item.uid);
                                        });
                                        var usableUids = arr.join(",");
                                        var users = [];
                                        var preUid;
                                        if (dept_manager.uid) {
                                            preUid = dept_manager.uid;
                                            users.push(preUid);
                                        }
                                        tMobileSDK.selectUser({
                                            multiple: false,
                                            checkedAll: false,
                                            usableUids: usableUids,
                                            users: users,
                                            onSuccess: function(result) {
                                                switch (result.length) {
                                                    case 0:
                                                        el.find(
                                                            ".dept_manager-value"
                                                        ).text("");
                                                        dept_manager = {};
                                                        break;
                                                    case 1:
                                                        el.find(
                                                            ".dept_manager-value"
                                                        ).text(
                                                            result[0].userName
                                                        );
                                                        dept_manager =
                                                            result[0];
                                                        break;
                                                    case 2:
                                                        $.each(result, function(
                                                            index,
                                                            item
                                                        ) {
                                                            if (
                                                                item.uid !==
                                                                preUid
                                                            ) {
                                                                el.find(
                                                                    ".dept_manager-value"
                                                                ).text(
                                                                    item.userName
                                                                );
                                                                dept_manager = item;
                                                            }
                                                        });
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                        });
                                    }
                                });
                            });
                            el.find(".cancel").tap(function() {
                                applycancel(id);
                            });

                            el.find(".save").tap(function() {
                                var fact_qty = $("#fact_qty").val();
                                var take_date = $(".input-date-start").val();
                                var return_date = $(".input-date-end").val();
                                var remark = $("#remark-value").val();
                                if (
                                    check(
                                        {
                                            fact_qty: fact_qty,
                                            take_date: take_date,
                                            return_date: return_date,
                                            dept_manager: dept_manager
                                        },
                                        {
                                            max_num: max_num,
                                            trans_flag: trans_flag
                                        }
                                    )
                                ) {
                                    save({
                                        id: id,
                                        pro_id: pro_id,
                                        apply_num: fact_qty,
                                        take_date: take_date,
                                        return_date: return_date,
                                        dept_manager: dept_manager.uid
                                            ? dept_manager.uid
                                            : "",
                                        remark: remark,
                                        trans_flag: trans_flag,
                                        approve_not: approve_not,
                                        isMobile: "1"
                                    });
                                }
                            });

                            el.find(".btn_subtraction").tap(function() {
                                handleClickNum("decrease");
                            });
                            el.find(".btn_addition").tap(function() {
                                handleClickNum("increase");
                            });
                        }
                        if (cancelBtnDom) {
                            el.find(".cancel-btn").tap(function() {
                                applycancel(id);
                            });
                        }
                        if (proreturnBtnDom) {
                            el.find(".return-btn").tap(function() {
                                proreturn(id);
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
// var reg = /^[1-9]\d*$/;
// console.log(reg.test('0'),reg.test('-1'),reg.test('1.2'),reg.test('100'))
