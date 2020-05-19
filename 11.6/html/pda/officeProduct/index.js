var closeWebview = function() {
    tMobileSDK.closeWebview();
};

var goList = function() {
    location.href = "/pda/officeProduct/applylist";
};
$(document).ready(function() {
    tMobileSDK.ready(function() {
        var toast = new Toast($(".ui-container"));

        // 路由信息
        var tHeadData = {
            index: {
                l: {
                    class: "",
                    event: "closeWebview();",
                    title: ""
                },
                c: {
                    class: "",
                    title: "办公用品申领"
                },
                r: {
                    class: "",
                    title: "申领记录",
                    event: "window.goList()"
                }
            },
            add: {
                l: {
                    class: "",
                    event: "history.back();",
                    title: ""
                },
                c: {
                    class: "",
                    title: "添加物品"
                },
                r: null
            }
        };

        // index路由页
        var mountIndex = function() {
            updateSelect();
            closeDialog();
        };

        function throttle(fn, delay) {
            var timer = null;
            return function() {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        }
        var addZero = function(num) {
            var str = "";
            if (num < 10) {
                str = "0" + num;
            } else {
                str = "" + num;
            }
            return str;
        };
        var getTime = function() {
            var myDate = new Date();
            var year = myDate.getFullYear(); //获取当前年
            var mon = myDate.getMonth() + 1; //获取当前月
            var date = myDate.getDate(); //获取当前日
            mon = addZero(mon);
            date = addZero(date);
            return year + "-" + mon + "-" + date;
        };
        var office_product_typeMap = {
            "1": "领用",
            "2": "借用"
        };
        var minPanX = 0;
        var panX = 0;
        var getuserinfo = function() {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productapply/getuserinfo",
                success: function(res) {
                    if (res) {
                        var dept_name = res.dept_name;
                        var user_name = res.user_name;
                        $(".header-item-date").text(getTime());
                        $(".header-item-dept_name").text(dept_name);
                        $(".header-item-user_name").text(user_name);
                    }
                }
            });
        };
        getuserinfo();
        $(".add-btn").tap(function() {
            pages.to("add");
            // location.href = "/pda/officeProduct/static/";
        });

        var select = [];
        var filterSelect = function(id) {
            var arr = [];
            for (var i = 0; i < select.length; i++) {
                var _id = select[i];
                if (_id !== id) {
                    arr.push(_id);
                }
            }
            select = arr;
        };
        var dataMap = {};
        var max_numMap = {};
        var approve_notMap = {};
        var product_typeMap = {};
        var pro_nameMap = {};

        $(".submit-btn").tap(function() {
            if (select.length) {
                var arr = [];
                for (var i = 0; i < select.length; i++) {
                    var pro_id = select[i];
                    var item = dataMap[pro_id];
                    var num = item.num;
                    var startTime = item.startTime;
                    var endTime = item.endTime;
                    var deptArr = item.dept_manager;
                    var dept_manager = "";
                    if (deptArr) {
                        dept_manager = deptArr.uid;
                    }
                    var trans_flag = product_typeMap[pro_id];
                    var approve_not = approve_notMap[pro_id];
                    var remark = item.remark ? item.remark : "";
                    arr.push({
                        pro_id: pro_id,
                        apply_num: num,
                        take_date: startTime,
                        return_date: endTime ? endTime : "0000-00-00",
                        dept_manager: dept_manager,
                        remark: remark,
                        trans_flag: trans_flag,
                        approve_not: approve_not,
                        isMobile: 1
                    });
                }
                $.ajax({
                    url:
                        "/general/appbuilder/web/officeproduct/productapply/applypro",
                    // data: Qs.stringify({ arr: arr }),
                    data: Qs.stringify({ arr: arr }),
                    type: "post",
                    success: function(res) {
                        var status = res.status;
                        if (status) {
                            goList();
                        } else {
                            var msg = res.msg;
                            tip(msg);
                        }
                    }
                });
            }
        });
        var updateSelect = function() {
            var el = $(".product-wrap");
            el.unbind().empty();
            if (select.length) {
                var ulDom = "";
                for (var i = 0; i < select.length; i++) {
                    var pro_id = select[i];
                    var item = dataMap[pro_id];
                    var num = item.num;
                    var remark = item.remark ? item.remark : "无";
                    var office_product_type = product_typeMap[pro_id];
                    var startTime = item.startTime;
                    var endTime = item.endTime;
                    var startTimeDom =
                        '<div class="take_time"><span class="take_time-text">领用日期</span><span class="take_time-value">' +
                        startTime +
                        "</span></div>";
                    var endTimeDom = "";
                    if (office_product_type === "2") {
                        endTimeDom =
                            '<div class="take_time"><span class="take_time-text">归还日期</span><span class="take_time-value">' +
                            endTime +
                            "</span></div>";
                    }
                    var approve_not = approve_notMap[pro_id];
                    var dept_managerDom = "";
                    // 是否选择审批人
                    if (approve_not == 0) {
                        var userName = item.dept_manager.userName;
                        dept_managerDom =
                            '<div class="dept_manager"><span class="dept_manager-text">审批人</span><span class="dept_manager-value">' +
                            userName +
                            "</span></div>";
                    }
                    var str =
                        '<li data-pro_id="' +
                        pro_id +
                        '"><div class="product-title"><span class="trans_flag-value">' +
                        office_product_typeMap[office_product_type] +
                        '</span><span class="pro_name-value">' +
                        pro_nameMap[pro_id] +
                        '</span><img src="/pda/officeProduct/img/btn_delete@3x.png" class="delete"> </div><div class="fact_qty"><span class="fact_qty-text">申领数量</span><span class="fact_qty-value">' +
                        num +
                        "</span></div>" +
                        startTimeDom +
                        endTimeDom +
                        dept_managerDom +
                        '<div class="remark"><div class="remark-text">备注</div><div class="remark-value">' +
                        remark +
                        "</div></div></li>";
                    ulDom += str;
                }
                el.append(ulDom);
                el.on("tap", "li", function(e) {
                    var $liItem = $(e.currentTarget);
                    var pro_id = $liItem.attr("data-pro_id");
                    if (e.target.className === "delete") {
                        filterSelect(pro_id);
                        var obj = {};
                        for (var key in dataMap) {
                            if (pro_id != key) {
                                obj[key] = dataMap[key];
                            }
                        }
                        dataMap = obj;
                        updateSelect();
                    }
                });
            }
        };

        // add路由页

        // 去除首尾空格
        var trim = function(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        };

        var setData = function(pro_id, key, value) {
            if (!dataMap[pro_id]) {
                dataMap[pro_id] = {};
            }
            dataMap[pro_id][key] = value;
        };
        var handleClickNum = function($liItem, type) {
            var pro_id = $liItem.attr("data-pro_id");
            var $input = $liItem.find(".input-num");
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
                setData(pro_id, "num", nextValue);
            }
        };
        var tip = function(str) {
            toast.show(str);
            // showDialog(str);
        };
        var showDialog = function(str) {
            var dom = $("#tip");
            dom.find(".text").text(str);
            dom.addClass("show");
        };
        var closeDialog = function() {
            var dom = $("#tip");
            dom.find(".text").text("");
            dom.removeClass("show");
        };
        $("#tip")
            .find(".confirm")
            .on("tap", function() {
                closeDialog();
            });
        var check = function(pro_id) {
            var dataItem = dataMap[pro_id];
            if (dataItem.num) {
                // 正整数正则
                var reg = /^(0|\+?[1-9][0-9]*)$/;
                if (!reg.test(dataItem.num)) {
                    tip("请正确输入数量");
                    return false;
                }
                if (dataItem.num > max_numMap[pro_id]) {
                    tip("最多可申领" + max_numMap[pro_id]);
                    return false;
                }
            } else {
                tip("请输入物品数量");
                return false;
            }
            if (!dataItem.startTime) {
                tip("请输入申领日期");
                return false;
            }
            if (product_typeMap[pro_id] === "2") {
                if (!dataItem.endTime) {
                    tip("请输入归还日期");
                    return false;
                }
                if (dataItem.startTime > dataItem.endTime) {
                    tip("请正确输入申领日期和归还日期");
                    return false;
                }
            }
            // 需要审批人
            if (approve_notMap[pro_id] === 0) {
                if (!dataItem.dept_manager) {
                    tip("请选择审批人");
                    return false;
                }
            }
            return true;
        };
        var handleSelect = function($liItem, dom, pro_id) {
            if (check(pro_id)) {
                if (select.length === 0) {
                    $(".tip-text").removeClass("show");
                }
                // 在底部添加元素 在select数据中添加id 改变右上角的dom 显示遮罩层
                var name = $liItem.find(".pro_name-value").text();
                var showName = trim(name).slice(0, 3);
                var liStr =
                    '<li data-pro_id="' + pro_id + '">' + showName + "</li>";
                $(".select-list").append(liStr);
                $(dom).addClass("selected");
                select.push(pro_id);
                $liItem.addClass("checked");
                minPanX = calcMinPanx();
                if (minPanX <= 0) {
                    setTransform(minPanX);
                    panX = minPanX;
                }
            }
        };
        var cancleSelect = function($liItem, dom, pro_id) {
            $(".select-list")
                .find('[data-pro_id="' + pro_id + '"]')
                .remove();
            $(dom).removeClass("selected");
            filterSelect(pro_id);
            $liItem.removeClass("checked");
            if (select.length === 0) {
                $(".tip-text").addClass("show");
            }
            minPanX = calcMinPanx();
            setTransform(0);
            panX = 0;
        };
        var getmyapplypro = function(keyword) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productapply/getmyapplypro",
                data: {
                    keyword: keyword
                },
                success: function(res) {
                    var status = res;
                    if (status) {
                        var data = res.data;
                        var el = $(".product-list");
                        el.unbind().empty();
                        if (data && data.length) {
                            var ulDom = "";
                            for (var i = 0; i < data.length; i++) {
                                var item = data[i];
                                // 物品id
                                var pro_id = item.pro_id;
                                // 物品名称
                                var pro_name = item.pro_long_name;
                                pro_nameMap[pro_id] = pro_name;
                                // 领用还是借用 '1'领用 '2'借用
                                var office_product_type =
                                    item.office_product_type;
                                product_typeMap[pro_id] = office_product_type;
                                // 规格型号
                                var pro_desc = item.pro_desc;
                                // 当前库存
                                var pro_stock = item.pro_stock;
                                // 申领周期 '3' 代表可以申请无限
                                // var period = item.period;
                                // 最大数量
                                var max_num = item.max_num;
                                max_numMap[pro_id] = max_num;
                                // 是否需要审批 0 - 是  1 - 否
                                var approve_not = item.approve_not;
                                approve_notMap[pro_id] = approve_not;
                                var dept_managerDom = "";
                                var num = 0;
                                var startTime = "";
                                var endTime = "";
                                var dept_managerName = "";
                                var dataItem = dataMap[pro_id];
                                var remark = "";
                                // 用户已经输入过
                                if (dataItem) {
                                    if (dataItem.num) {
                                        num = dataItem.num;
                                    }
                                    if (dataItem.startTime) {
                                        startTime = dataItem.startTime;
                                    }
                                    if (dataItem.endTime) {
                                        endTime = dataItem.endTime;
                                    }
                                    if (dataItem.dept_manager) {
                                        dept_managerName =
                                            dataItem.dept_manager.userName;
                                    }
                                    if (dataItem.remark) {
                                        remark = dataItem.remark;
                                    }
                                }
                                // 是否选择审批人
                                if (approve_not == 0) {
                                    dept_managerDom =
                                        '<div class="line no-border dept_manager-wrap"><div class="line-overlay"></div><span class="dept_manager-text">审批人</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="user-btn_arrow"><span class="dept_manager-value">' +
                                        dept_managerName +
                                        "</span></div>";
                                }
                                var trans_flagDom = "";
                                // 已经选中
                                var checkedClass = "";
                                if (select.indexOf(pro_id) > -1) {
                                    checkedClass = "checked";
                                    trans_flagDom =
                                        '<span class="trans_flag-value selected">' +
                                        office_product_typeMap[
                                            office_product_type
                                        ] +
                                        "</span>";
                                } else {
                                    trans_flagDom =
                                        '<span class="trans_flag-value">' +
                                        office_product_typeMap[
                                            office_product_type
                                        ] +
                                        "</span>";
                                }
                                var startTimeDom =
                                    '<div class="line"><div class="line-overlay"></div><div class="date-wrap"><span class="time-text">申领日期</span><input type="text" value="' +
                                    startTime +
                                    '" readonly class="input-date-start input-date" data-pro_id="' +
                                    pro_id +
                                    '"/><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"></div></div>';
                                var endTimeDom = "";
                                if (office_product_type === "2") {
                                    endTimeDom =
                                        '<div class="line"><div class="line-overlay"></div><div class="date-wrap"><span class="time-text">归还日期</span><input type="text" value="' +
                                        endTime +
                                        '" readonly class="input-date-end input-date" data-pro_id="' +
                                        pro_id +
                                        '"/><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"></div></div>';
                                }

                                var liDom =
                                    '<li class="product-list-item ' +
                                    checkedClass +
                                    '" data-pro_id="' +
                                    pro_id +
                                    '"><div class="line product-title"><img src="/pda/officeProduct/add/img/icon_printer@3x.png"><span class="pro_name-value">' +
                                    pro_name +
                                    "</span>" +
                                    trans_flagDom +
                                    '</div><div class="pro_desc-value">' +
                                    pro_desc +
                                    '</div><div class="line"><div class="line-overlay"></div><span class="pro_stock-text">当前库存</span><span class="pro_stock-value">' +
                                    pro_stock +
                                    '</span><div class="input-val clearfix" ><div class="btn_subtraction"><img src="/pda/officeProduct/add/img/btn_subtraction@3x.png" ></div><input value="' +
                                    num +
                                    '" type="number" placeholder="" autocapitalize="off"   data-pro_id="' +
                                    pro_id +
                                    '" class="input-num"><div class="btn_addition"><img src="/pda/officeProduct/add/img/btn_addition@3x.png" ></div></div></div>' +
                                    startTimeDom +
                                    endTimeDom +
                                    dept_managerDom +
                                    '<div class="remark line"><div class="line-overlay"></div><div class="remark-text">备注</div><textarea  type="text" placeholder="" autocapitalize="off" id="remark-value" data-pro_id="' +
                                    pro_id +
                                    '">' +
                                    remark +
                                    "</textarea></div></li>";
                                ulDom += liDom;
                            }
                            el.append(ulDom);
                            el.on("tap", ".product-list-item", function(e) {
                                var $liItem = $(e.currentTarget);
                                var pro_id = $liItem.attr("data-pro_id");
                                var targetParent = $(e.target).parent();
                                if (
                                    e.target.className === "btn_subtraction" ||
                                    targetParent.hasClass("btn_subtraction")
                                ) {
                                    handleClickNum($liItem, "decrease");
                                }
                                if (
                                    e.target.className === "btn_addition" ||
                                    targetParent.hasClass("btn_addition")
                                ) {
                                    handleClickNum($liItem, "increase");
                                }
                                if (
                                    e.target.className === "user-btn_arrow" ||
                                    e.target.className ===
                                        "dept_manager-value" ||
                                    e.target.className ===
                                        "dept_manager-text" ||
                                    e.target.className.indexOf(
                                        "dept_manager-wrap"
                                    ) > -1
                                ) {
                                    $.ajax({
                                        url:
                                            "/general/appbuilder/web/officeproduct/productapply/getproapprover",
                                        data: {
                                            id: pro_id
                                        },
                                        success: function(re) {
                                            var arr = [];
                                            $.each(re.data, function(
                                                index,
                                                item
                                            ) {
                                                arr.push(item.uid);
                                            });
                                            var usableUids = arr.join(",");
                                            var users = [];
                                            var preUid;
                                            if (dataMap[pro_id]) {
                                                var dept_manager =
                                                    dataMap[pro_id]
                                                        .dept_manager;
                                                if (dept_manager) {
                                                    preUid = dept_manager.uid;
                                                    users.push(preUid);
                                                }
                                            }
                                            tMobileSDK.selectUser({
                                                multiple: false,
                                                checkedAll: false,
                                                usableUids: usableUids,
                                                users: users,
                                                onSuccess: function(result) {
                                                    switch (result.length) {
                                                        case 0:
                                                            setData(
                                                                pro_id,
                                                                "dept_manager",
                                                                undefined
                                                            );
                                                            $liItem
                                                                .find(
                                                                    ".dept_manager-value"
                                                                )
                                                                .text("");
                                                            break;
                                                        case 1:
                                                            setData(
                                                                pro_id,
                                                                "dept_manager",
                                                                result[0]
                                                            );
                                                            $liItem
                                                                .find(
                                                                    ".dept_manager-value"
                                                                )
                                                                .text(
                                                                    result[0]
                                                                        .userName
                                                                );
                                                            break;
                                                        case 2:
                                                            $.each(
                                                                result,
                                                                function(
                                                                    index,
                                                                    item
                                                                ) {
                                                                    if (
                                                                        item.uid !==
                                                                        preUid
                                                                    ) {
                                                                        setData(
                                                                            pro_id,
                                                                            "dept_manager",
                                                                            item
                                                                        );
                                                                        $liItem
                                                                            .find(
                                                                                ".dept_manager-value"
                                                                            )
                                                                            .text(
                                                                                item.userName
                                                                            );
                                                                    }
                                                                }
                                                            );
                                                            break;
                                                        default:
                                                            break;
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                if (
                                    e.target.className.indexOf("line-overlay") >
                                    -1
                                ) {
                                    tip("修改请取消选中");
                                }
                                if (
                                    e.target.className.indexOf(
                                        "trans_flag-value"
                                    ) > -1
                                ) {
                                    if (dataMap[pro_id]) {
                                        if (select.indexOf(pro_id) > -1) {
                                            cancleSelect(
                                                $liItem,
                                                e.target,
                                                pro_id
                                            );
                                        } else {
                                            handleSelect(
                                                $liItem,
                                                e.target,
                                                pro_id
                                            );
                                        }
                                    } else {
                                        tip(
                                            "请填写" +
                                                $liItem
                                                    .find(".pro_name-value")
                                                    .text() +
                                                "信息"
                                        );
                                    }
                                }
                            });
                            el.find(".date-wrap").each(function(index, item) {
                                var defaultValue = "";
                                var inputDateDom = $(this).find(".input-date");
                                var dateType = "";
                                if (inputDateDom.hasClass("input-date-start")) {
                                    dateType = "startTime";
                                    defaultValue = startTime;
                                }
                                if (inputDateDom.hasClass("input-date-end")) {
                                    dateType = "endTime";
                                    defaultValue = endTime;
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
                                            setData(
                                                inputDateDom.attr(
                                                    "data-pro_id"
                                                ),
                                                dateType,
                                                valueText
                                            );
                                        }
                                    });
                            });
                            el.find("input").on("input", function(e) {
                                var pro_id = $(e.currentTarget).attr(
                                    "data-pro_id"
                                );
                                var inputValue = parseFloat(
                                    $(e.currentTarget).val()
                                );
                                setData(pro_id, "num", inputValue);
                            });
                            el.find("#remark-value").on("input", function(e) {
                                var pro_id = $(e.currentTarget).attr(
                                    "data-pro_id"
                                );
                                var inputValue = $(e.currentTarget).val();
                                setData(pro_id, "remark", inputValue);
                            });
                        } else {
                            el.append(
                                '<div class="empty"><img class="img" src="/pda/officeProduct/applylist/img/todo_nodata_icon@3x.png"/><div class="empty-text">暂无数据</div></div>'
                            );
                        }
                    }
                }
            });
        };
        var throttleGet = throttle(getmyapplypro, 300);
        var $searchIput = $("#apply-product-search");
        $searchIput.on("input", function(e) {
            var inputVal = $searchIput.val();
            throttleGet(trim(inputVal));
        });
        $(".submit").tap(function() {
            var flag = true;
            for (var key in dataMap) {
                if (select.indexOf(key) === -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                pages.to("index");
            } else {
                tip("请选择使用方式");
            }
        });
        var updateSelectBar = function() {
            var el = $(".select-list");
            el.empty();
            var str = "";
            for (var i = 0; i < select.length; i++) {
                var pro_id = select[i];
                var name = pro_nameMap[pro_id];
                var showName = trim(name).slice(0, 3);
                var liStr =
                    '<li data-pro_id="' + pro_id + '">' + showName + "</li>";
                str += liStr;
            }
            if (select.length === 0) {
                $(".tip-text").addClass("show");
            }
            el.append(str);
        };
        var calcMinPanx = function() {
            return $(".select-box").width() - $(".select-list").width();
        };
        var setTransform = function(num) {
            $(".select-list").css({
                transform: "translate3d(" + num + "px, 0px, 0px)"
            });
        };
        var mountAdd = function() {
            $searchIput.val("");
            getmyapplypro("");
            updateSelectBar();
            setTransform(0);
            var myElement = document.querySelector(".select-list");
            var hammertime = new Hammer(myElement);
            minPanX = calcMinPanx();
            hammertime.on("panmove", function(ev) {
                if (minPanX <= 0) {
                    var deltaX = ev.deltaX;
                    var tmp = panX + deltaX;
                    if (minPanX <= tmp && tmp <= 0) {
                        setTransform(tmp);
                    } else {
                        if (tmp < minPanX) {
                            panX = minPanX;
                        }
                        if (tmp > 0) {
                            panX = 0;
                        }
                        setTransform(panX);
                    }
                }
            });
            hammertime.on("panend", function(ev) {
                if (minPanX <= 0) {
                    var deltaX = ev.deltaX;
                    var tmp = panX + deltaX;
                    if (minPanX <= tmp && tmp <= 0) {
                        panX = tmp;
                    }
                }
            });
        };

        //头部切换翻页功能
        window.pages = new gmu.Pages({
            el: $("#pages"),
            router: {
                index: mountIndex,
                add: mountAdd
            },
            header: tHeadData,
            active: "#index"
        });
    });
});
