$(document).ready(function() {
    tMobileSDK.ready(function() {
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
        var toast = new Toast($("body"));
        var data = {
            l: {
                class: "",
                event: "history.back();",
                title: ""
            },
            c: {
                class: "",
                title: "��Ʒ���"
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
        var addZero = function(num) {
            var str = "";
            if (num < 10) {
                str = "0" + num;
            } else {
                str = "" + num;
            }
            return str;
        };
        var myDate = new Date();
        var year = myDate.getFullYear(); //��ȡ��ǰ��
        var mon = myDate.getMonth() + 1; //��ȡ��ǰ��
        var date = myDate.getDate(); //��ȡ��ǰ��
        mon = addZero(mon);
        date = addZero(date);
        var fetchApplyDetail = function(id) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productmanage/productinfo",
                data: {
                    id: id
                },
                success: function(res) {
                    var status = res.status;
                    if (status) {
                        var el = $(".office-product-detail");
                        el.unbind().empty();
                        var data = res.data;
                        if (data) {
                            // ʹ�÷�ʽ1-���ã�2-����
                            var type_name = data.type_name;
                            // ��Ʒ����
                            var pro_name = data.pro_name;
                            // ����ͺ�
                            var specs = data.specs;
                            // ���
                            var pro_stock = data.pro_stock;
                            // �������
                            var pro_total = data.pro_total;
                            // ��ǰ��¼��uid
                            var login_uid = data.login_uid;
                            // ��ǰ��¼������
                            var login_user_name = data.login_user_name;
                            var warehousing_time =
                                year + "-" + mon + "-" + date;
                            var detailDom =
                                '<div class="info"><div class="info-title"><span class="info-title-text">��Ʒ��Ϣ</span></div><div class="pro_name"><span class="pro_name-text">�����Ʒ</span><span class="pro_name-value">' +
                                pro_name +
                                '</span></div><div class="pro_desc"><span class="pro_desc-text">���/�ͺ�</span><span class="pro_desc-value">' +
                                specs +
                                '</span></div><div class="pro_desc"><span class="pro_desc-text">��������</span><span class="pro_desc-value">' +
                                type_name +
                                '</span></div><div class="pro_desc"><span class="pro_desc-text">��ǰ���</span><span class="pro_desc-value">' +
                                pro_stock +
                                '</span></div><div class="trans_flag"><span class="trans_flag-text">�������</span><span class="trans_flag-value">' +
                                pro_total +
                                '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">�����Ϣ</span></div><label class="trans_date focus" for="batch"><span class="trans_date-text">��Ʒ����</span><input value="' +
                                year +
                                mon +
                                date +
                                '" type="text" placeholder="" autocapitalize="off"  class="input-num" id="batch"></label><label class="trans_date focus" for="number"><span class="trans_date-text">�������</span><input value="" type="text" placeholder="" autocapitalize="off"  class="input-num" id="number"></label><label class="dept_name focus" for="pro_price"><span class="dept_name-text">����</span><input value="" type="text" placeholder="" autocapitalize="off"  class="input-num" id="pro_price"></label><div class="fact_qty"><span class="fact_qty-text">���Ա</span><span class="fact_qty-value">' +
                                login_user_name +
                                '</span></div><div class="take_time input-date-wrap"><span class="take_time-text">���ʱ��</span><input type="text" value="' +
                                warehousing_time +
                                '" readonly="" class="input-date-start input-date" ></div><div class="remark"><div class="remark-text">��ע</div><textarea value="" type="text" placeholder="" autocapitalize="off" id="reject-value"></textarea></div></div><div class="btn-submit">ȷ��</div>';
                        }

                        el.append(detailDom);

                        el.find(".input-date-wrap")
                            .mobiscroll()
                            .date({
                                theme: "ios7",
                                display: "bottom",
                                lang: "zh",
                                mode: "scroller",
                                dateFormat: "yy-mm-dd",
                                endYear: 3000,
                                onShow: function(html, valueText, inst) {
                                    setTimeout(function() {
                                        $(".dwbg").css({
                                            top: "auto",
                                            bottom: 0
                                        });
                                    });
                                },
                                defaultValue: new Date(warehousing_time),
                                onSelect: function(valueText, inst) {
                                    //ѡ��ʱ�¼������ȷ���󣩣�valueText Ϊѡ���ʱ�䣬
                                    var inputDateDom = $(this).find(
                                        ".input-date"
                                    );
                                    inputDateDom.attr("value", valueText);
                                    warehousing_time = valueText;
                                }
                            });
                        el.find(".btn-submit").tap(function() {
                            var batch = $("#batch").val();
                            var number = $("#number").val();
                            var pro_price = $("#pro_price").val();
                            var remarks = $("#reject-value").val();
                            if (
                                check({
                                    batch: batch,
                                    number: number,
                                    pro_price: pro_price,
                                    login_uid: login_uid,
                                    warehousing_time: warehousing_time
                                })
                            ) {
                                throttleCreate({
                                    pro_id: id,
                                    batch: batch,
                                    number: number,
                                    pro_price: pro_price,
                                    warehousing_time: warehousing_time,
                                    creator: login_uid,
                                    remarks: remarks,
                                    is_mobile: "1"
                                });
                            }
                        });
                        el.find(".fact_qty").tap(function() {
                            tMobileSDK.selectUser({
                                multiple: false,
                                checkedAll: true,
                                users: [login_uid],
                                onSuccess: function(result) {
                                    var preUid = login_uid;
                                    switch (result.length) {
                                        case 0:
                                            login_uid = "";
                                            el.find(".fact_qty-value").text("");
                                            break;
                                        case 1:
                                            login_uid = result[0].uid;
                                            el.find(".fact_qty-value").text(
                                                result[0].userName
                                            );
                                            break;
                                        case 2:
                                            $.each(result, function(
                                                index,
                                                item
                                            ) {
                                                if (item.uid !== preUid) {
                                                    login_uid = item.uid;
                                                    el.find(
                                                        ".fact_qty-value"
                                                    ).text(item.userName);
                                                }
                                            });
                                            break;
                                        default:
                                            break;
                                    }
                                }
                            });
                        });
                    }
                }
            });
        };
        var check = function(obj) {
            var batch = obj.batch,
                number = obj.number,
                pro_price = obj.pro_price,
                login_uid = obj.login_uid,
                warehousing_time = obj.warehousing_time;
            if (!batch) {
                tip("�������Ʒ����");
                return false;
            }
            var reg = /^[1-9]\d*$/;
            if (!reg.test(number)) {
                tip("����ȷ�����������");
                return false;
            }
            var priceReg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
            if (pro_price !== "") {
                if (!priceReg.test(pro_price)) {
                    tip("����ȷ���뵥��");
                    return false;
                }
            } else {
                tip("�����뵥��");
                return false;
            }

            if (!login_uid) {
                tip("��ѡ�����Ա");
                return false;
            }
            if (!warehousing_time) {
                tip("��ѡ�����ʱ��");
                return false;
            }
            return true;
        };
        var tip = function(str) {
            toast.show(str);
        };
        var qsParams = getQueryParams();
        var pro_id = qsParams.id;
        fetchApplyDetail(pro_id);
        var createinlibrary = function(opts) {
            $.ajax({
                url:
                    "/general/appbuilder/web/officeproduct/productinlibrary/createinlibrary",
                data: Qs.stringify({ arr: [opts] }),
                type: "post",
                success: function(res) {
                    if (res && res.status) {
                        location.href = "/pda/officeProduct/product_inlibrary";
                    }
                }
            });
        };
        var throttleCreate = throttle(createinlibrary, 300);
    });
});

// console.log(
//     reggg.test(0),
//     reggg.test("0"),
//     reggg.test("0."),
//     reggg.test("0.1"),
//     reggg.test("-1"),
//     reggg.test("04"),
//     reggg.test("40"),
//     reggg.test("17880"),
//     reggg.test("-17880"),
//     reggg.test("-1.7")
// );
