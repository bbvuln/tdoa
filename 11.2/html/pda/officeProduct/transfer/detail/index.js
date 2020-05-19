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
                title: "�����������"
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
            "1": "δȷ��",
            "2": "�ѳ���"
        };
        var transfer_typeMap = {
            "1": "����",
            "2": "����"
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
                        // ������Ʒ
                        var pro_long_name = data.pro_long_name;
                        // ����ͺ�
                        var pro_desc = data.pro_desc;
                        // ���
                        var pro_stock = data.pro_stock;
                        // �����״̬
                        var is_checked = data.is_checked;
                        var state = is_checkedMap[is_checked];
                        // ��������
                        var transfer_type = data.transfer_type;
                        var transfer_typeValue =
                            transfer_typeMap[transfer_type];
                        // ��������
                        var type_long_name = data.type_long_name;
                        // ��������
                        var transfer_num = data.transfer_num;
                        // ����Ա
                        var operator = data.operator;
                        // ����ʱ��
                        var transfer_date = data.transfer_date;
                        // ��ע
                        var remark = data.remark;
                        if (!remark) remark = "��";
                        // ��Ʒid
                        var pro_id = data.pro_id;
                        // ����
                        var price = data.price;
                        var batch_num = data.batch_num;
                        var dom =
                            '<div class="info"><div class="info-title"><span class="info-title-text">��Ʒ��Ϣ</span></div><div class="pro_name"><span class="pro_name-text">������Ʒ</span><span class="pro_name-value">' +
                            pro_long_name +
                            '</span></div><div class="pro_desc"><span class="pro_desc-text">���/�ͺ�</span><span class="pro_desc-value">' +
                            pro_desc +
                            '</span></div><div class="trans_flag"><span class="trans_flag-text">��ǰ���</span><span class="trans_flag-value">' +
                            pro_stock +
                            '</span></div></div><div class="apply-info"><div class="info-title"><span class="info-title-text">������Ϣ</span><span class="info-title-state">' +
                            state +
                            '</span></div><div class="trans_date"><span class="trans_date-text">��������</span><span class="trans_date-value">' +
                            transfer_typeValue +
                            '</span></div><div class="dept_name"><span class="dept_name-text">��������</span><span class="dept_name-value">' +
                            type_long_name +
                            '</span></div><div class="fact_qty"><span class="fact_qty-text">��������</span><span class="fact_qty-value">' +
                            transfer_num +
                            '</span></div><div class="take_time"><span class="take_time-text">����Ա</span><span class="take_time-value">' +
                            operator +
                            '</span></div><div class="return_time"><span class="return_time-text">����ʱ��</span><span class="return_time-value">' +
                            transfer_date +
                            '</span></div><div class="remark"><div class="remark-text">��ע</div><div class="remark-value">' +
                            remark +
                            "</div></div></div>";
                        var buttonDom = "";
                        if (is_checked === 1) {
                            buttonDom = '<div class="cancel-btn">���</div>';
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
