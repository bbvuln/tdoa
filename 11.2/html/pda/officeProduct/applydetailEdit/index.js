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
                title: "��Ʒ����༭"
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
            "1": "����",
            "2": "����"
        };
        var stateMap = {
            "1": "�ѷ���",
            "2": "������",
            "3": "������",
            "4": "������",
            "5": "�ѹ黹",
            "6": "��ȡ��"
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
                // ��������
                if (type === "decrease") {
                    if (inputValue === 0) {
                        return;
                    }
                    nextValue = inputValue - 1;
                }
                // �������
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
            // ����������
            // var reg = /^(0|\+?[1-9][0-9]*)$/;
            var reg = /^[1-9]\d*$/;
            if (!reg.test(dataItem.fact_qty)) {
                tip("����ȷ��������");
                return false;
            }
            if (dataItem.fact_qty > rules.max_num) {
                tip("��������" + rules.max_num);
                return false;
            }

            if (!dataItem.take_date) {
                tip("��������������");
                return false;
            }
            if (rules.trans_flag === "2") {
                if (!dataItem.return_date) {
                    tip("������黹����");
                    return false;
                }
                if (dataItem.take_date > dataItem.return_date) {
                    tip("����ȷ�����������ں͹黹����");
                    return false;
                }
            }
            // ��Ҫ������
            if (!dataItem.dept_manager.uid) {
                tip("��ѡ��������");
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
                        tip("����ɹ�");
                        history.back();
                    } else {
                        if (res.max >= 0) {
                            if (res.max === 0) {
                                tip("���Ϊ0");
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
                            // ʹ�÷�ʽ1-���ã�2-����
                            var trans_flag = data.trans_flag;
                            // ״̬
                            var state = data.state;
                            // ��Ʒ����
                            var pro_name = data.pro_name;
                            // ��������
                            var fact_qty = data.fact_qty;
                            // ��ȡ����
                            var take_time = data.take_time.split(" ")[0];
                            // �黹����
                            var return_time = data.return_time;
                            // ����ͺ�
                            var pro_desc = data.pro_desc;
                            // ��������
                            var trans_date = data.trans_date;
                            // ���첿��
                            var dept_name = data.dept_name;
                            // ʵ�ʹ黹����
                            var fact_return_time = data.fact_return_time.split(
                                " "
                            )[0];
                            // ����ʱ��
                            var checkout_time = data.checkout_time;
                            // ������
                            dept_manager = {
                                uid: data.dept_manager_uid,
                                userName: data.dept_manager
                            };
                            // ��Ʒid
                            var pro_id = data.pro_id;
                            // ��ע
                            var remark = data.remark;
                            // �Ƿ���Ҫ����  0��Ҫ���� 1����Ҫ����
                            var approve_not = data.approve_not;
                            var dept_managerDom = "";
                            if (approve_not === 0) {
                                dept_managerDom =
                                    '<div class="dept_manager"><span class="dept_manager-text">������</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><span class="dept_manager-value">' +
                                    dept_manager.userName +
                                    "</span></div>";
                            }
                            //   if (!remark) remark = "��";
                            var returnDom = "";
                            if (trans_flag !== "1") {
                                var factReturnTime = "";
                                if (state == 5) {
                                    factReturnTime =
                                        '<div class="fact_return_time"><span class="fact_return_time-text">ʵ�ʹ黹����</span><span class="fact_return_time-value">' +
                                        fact_return_time +
                                        '</span></div><div class="fact_return_time"><span class="fact_return_time-text">����ʱ��</span><span class="fact_return_time-value">' +
                                        checkout_time +
                                        "</span></div>";
                                }
                                // ���õ�û�й黹���ں�ʵ�ʹ黹����
                                returnDom =
                                    '<div class="return_time"><span class="return_time-text">�黹����</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><span class="return_time-value">' +
                                    return_time +
                                    "</span></div>" +
                                    factReturnTime;
                            }
                            // ȡ�����찴ť
                            var cancelBtnDom = "";
                            var detailDom = "";
                            // ��ȡ�黹��ť
                            var proreturnBtnDom = "";
                            if (state == 3) {
                                if (trans_flag !== "1") {
                                    // ���õ�û�й黹���ں�ʵ�ʹ黹����
                                    returnDom =
                                        '<div class="return_time date-wrap"><span class="return_time-text">�黹����</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><input type="text" value="' +
                                        return_time +
                                        '" readonly="" class="input-date-end input-date" ></div>';
                                }
                                var btns =
                                    '<div><div class="cancel clearfix">ȡ��</div><div class="save">����</div></div>';
                                detailDom =
                                    '<div class="info"><div class="info-title"><span class="info-title-text">��Ʒ��Ϣ</span></div><div class="pro_name"><span class="pro_name-text">������Ʒ</span><span class="pro_name-value">' +
                                    pro_name +
                                    '</span></div><div class="pro_desc"><span class="pro_desc-text">���/�ͺ�</span><span class="pro_desc-value">' +
                                    pro_desc +
                                    '</span></div><div class="trans_flag"><span class="trans_flag-text">ʹ�÷�ʽ</span><span class="trans_flag-value">' +
                                    trans_flagMap[trans_flag] +
                                    '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">������Ϣ</span><span class="info-title-state">' +
                                    stateMap[state] +
                                    '</span></div><div class="trans_date"><span class="trans_date-text">��������</span><span class="trans_date-value">' +
                                    trans_date +
                                    '</span></div><div class="dept_name"><span class="dept_name-text">���첿��</span><span class="dept_name-value">' +
                                    dept_name +
                                    '</span></div><div class="fact_qty"><span class="fact_qty-text">��������</span>' +
                                    inputVal(fact_qty) +
                                    '</div><div class="take_time date-wrap"><span class="take_time-text">��������</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><input type="text" value="' +
                                    take_time +
                                    '" readonly="" class="input-date-start input-date" ></div>' +
                                    returnDom +
                                    dept_managerDom +
                                    '<div class="remark"><div class="remark-text">��ע</div><textarea  type="text" placeholder="" autocapitalize="off" id="remark-value">' +
                                    remark +
                                    "</textarea></div></div>" +
                                    btns;
                            } else {
                                if (state === 2) {
                                    cancelBtnDom =
                                        '<div class="cancel-btn">ȡ������</div>';
                                }
                                if (trans_flag === "2" && state === 1) {
                                    var myDate = new Date();
                                    var year = myDate.getFullYear(); //��ȡ��ǰ��
                                    var mon = myDate.getMonth() + 1; //��ȡ��ǰ��
                                    var date = myDate.getDate(); //��ȡ��ǰ��
                                    mon = addZero(mon);
                                    date = addZero(date);
                                    var thisTime =
                                        year + "-" + mon + "-" + date;
                                    if (thisTime < return_time) {
                                        proreturnBtnDom =
                                            '<div class="return-btn">��ǰ�黹</div>';
                                    }
                                }
                                // ����˵��
                                var rejectDom = "";
                                if (state === 4) {
                                    var reason = data.reason;
                                    if (reason) {
                                        rejectDom =
                                            '<div class="reject-info"><div class="reject-text">����˵��</div><div class="reject-value">' +
                                            reason +
                                            "</div></div>";
                                    }
                                }
                                detailDom =
                                    '<div class="info"><div class="info-title"><span class="info-title-text">��Ʒ��Ϣ</span></div><div class="pro_name"><span class="pro_name-text">������Ʒ</span><span class="pro_name-value">' +
                                    pro_name +
                                    '</span></div><div class="pro_desc"><span class="pro_desc-text">���/�ͺ�</span><span class="pro_desc-value">' +
                                    pro_desc +
                                    '</span></div><div class="trans_flag"><span class="trans_flag-text">ʹ�÷�ʽ</span><span class="trans_flag-value">' +
                                    trans_flagMap[trans_flag] +
                                    '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">������Ϣ</span><span class="info-title-state">' +
                                    stateMap[state] +
                                    '</span></div><div class="trans_date"><span class="trans_date-text">��������</span><span class="trans_date-value">' +
                                    trans_date +
                                    '</span></div><div class="dept_name"><span class="dept_name-text">���첿��</span><span class="dept_name-value">' +
                                    dept_name +
                                    '</span></div><div class="fact_qty"><span class="fact_qty-text">��������</span><span class="fact_qty-value">' +
                                    fact_qty +
                                    '</span></div><div class="take_time"><span class="take_time-text">��������</span><img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow"><span class="take_time-value">' +
                                    take_time +
                                    "</span></div>" +
                                    returnDom +
                                    dept_managerDom +
                                    '<div class="remark"><div class="remark-text">��ע</div><div class="remark-value">' +
                                    remark +
                                    "</div></div></div>" +
                                    cancelBtnDom +
                                    proreturnBtnDom +
                                    rejectDom;
                            }
                        }

                        el.append(detailDom);
                        if (state === 3) {
                            //���¼�
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
                                            //ѡ��ʱ�¼������ȷ���󣩣�valueText Ϊѡ���ʱ�䣬
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
