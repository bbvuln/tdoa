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
                title: "��Ʒ��������"
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
            "1": "����",
            "2": "����"
        };
        // �������б�ͬ
        var stateMap = {
            "1": "��ͨ��",
            "2": "��ͨ��",
            "3": "������",
            "4": "������",
            "5": "��ͨ��"
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
                            // var fact_return_time = data.fact_return_time.split(" ")[0];
                            // ���
                            var pro_stock = data.pro_stock;
                            // ������
                            var borrower = data.borrower;
                            // ��ע
                            var remark = data.remark;
                            if (!remark) remark = "��";
                            var returnDom = "";
                            if (trans_flag !== "1") {
                                // ���õ�û�й黹���ں�ʵ�ʹ黹����
                                returnDom =
                                    '<div class="return_time"><span class="return_time-text">�黹����</span><span class="return_time-value">' +
                                    return_time +
                                    "</span></div>";
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
                            var buttons = "";
                            if (state === 3) {
                                buttons =
                                    '<div><div class="reject">����</div><div class="pass clearfix">ͨ��</div></div>';
                            }
                            var detailDom =
                                '<div class="info"><div class="info-title"><span class="info-title-text">��Ʒ��Ϣ</span></div><div class="pro_name"><span class="pro_name-text">������Ʒ</span><span class="pro_name-value">' +
                                pro_name +
                                '</span></div><div class="pro_desc"><span class="pro_desc-text">���/�ͺ�</span><span class="pro_desc-value">' +
                                pro_desc +
                                '</span></div><div class="pro_desc"><span class="pro_desc-text">ʹ�÷�ʽ</span><span class="pro_desc-value">' +
                                trans_flagMap[trans_flag] +
                                '</span></div><div class="trans_flag"><span class="trans_flag-text">��ǰ���</span><span class="trans_flag-value">' +
                                pro_stock +
                                '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">������Ϣ</span><span class="info-title-state">' +
                                stateMap[state] +
                                '</span></div><div class="trans_date"><span class="trans_date-text">��������</span><span class="trans_date-value">' +
                                trans_date +
                                '</span></div><div class="dept_manager"><span class="dept_manager-text">������</span><span class="dept_manager-value">' +
                                borrower +
                                '</span></div><div class="dept_name"><span class="dept_name-text">���첿��</span><span class="dept_name-value">' +
                                dept_name +
                                '</span></div><div class="fact_qty"><span class="fact_qty-text">��������</span><span class="fact_qty-value">' +
                                fact_qty +
                                '</span></div><div class="take_time"><span class="take_time-text">��������</span><span class="take_time-value">' +
                                take_time +
                                "</span></div>" +
                                returnDom +
                                '<div class="remark"><div class="remark-text">��ע</div><div class="remark-value">' +
                                remark +
                                "</div></div></div>" +
                                rejectDom +
                                buttons;
                        }
                        if (buttons) {
                            detailDom +=
                                '<div class="ui-dialog"><div class="ui-dialog-cnt"><div class="ui-dialog-bd"><h3>�칫��Ʒ��������</h3><textarea value="" type="text" placeholder="" autocapitalize="off" id="reject-value"></textarea></div><div class="ui-dialog-ft"><button type="button" data-role="button" class="btn-cancle">ȡ��</button><button type="button" data-role="button" class="btn-submit">ȷ��</button></div></div></div>';
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
