var ManualCheck = function(opt) {
    this.onHidden = opt.onHidden;
    this.showAmount = true;
    this.init();
};
var checkKeys = [
    "invoiceCode",
    "invoiceNumber",
    "billingDate",
    "totalAmount",
    "checkCode"
];
var filterArr = function(ary, id) {
    var arr = [];
    for (var i = 0; i < ary.length; i++) {
        var _id = ary[i];
        if (_id !== id) {
            arr.push(_id);
        }
    }
    return arr;
};
// 10λ �����벻��˰��� 12λ�� ����У�����6λ
var checkKeyMapValue = {
    invoiceCode: "��Ʊ����",
    invoiceNumber: "��Ʊ����",
    billingDate: "��Ʊ����",
    totalAmount: "��Ʊ���(����˰)",
    checkCode: "У�����6λ"
};
ManualCheck.prototype = {
    init: function() {
        this.createModal();
        this.bindEvent();
    },
    createModal: function() {
        var liDoms = "";
        $.each(checkKeys, function(i, item) {
            var dateImg = "";
            var dateAttr = "";
            if (item === "billingDate") {
                dateAttr = 'onClick="WdatePicker()"';
            }
            var liDom =
                '<li class="clearfix c-' +
                item +
                '-wrap"><span class="td-iconfont td-icon-asterisk"></span><span>' +
                checkKeyMapValue[item] +
                "��</span>" +
                dateImg +
                '<input autocomplete="off" type="text"  id="c-' +
                item +
                '" ' +
                dateAttr +
                "></li>";
            liDoms += liDom;
        });
        $("body").append(
            '<div class="modal hide fade" id="ManualCheck"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>�ֶ�����</h3></div><div class="modal-body"><ul class="check-list show-amount">' +
                liDoms +
                '</ul><div class="check-tip"><span class="td-iconfont td-icon-asterisk"></span>���������</div></div><div class="modal-footer"><div class="btn reset">����</div><div class="btn submit btn-primary">����</div></div></div>'
        );
    },
    handleReset: function() {
        $.each(checkKeys, function(i, item) {
            $("#c-" + item).val("");
        });
    },
    handleCheck: function() {
        var pass = true;
        var obj = {};
        var tmp;
        if (this.showAmount) {
            tmp = filterArr(checkKeys, "checkCode");
        } else {
            tmp = filterArr(checkKeys, "totalAmount");
        }
        for (var i = 0; i < tmp.length; i++) {
            var item = tmp[i];
            var val = $.trim($("#c-" + item).val());
            if (val) {
                obj[item] = val;
            } else {
                $(".check-tip").addClass("show");
                pass = false;
                break;
            }
        }
        if (pass) {
            this.submit(obj);
        }
    },
    submit: function(params) {
        var url = addQueryStringToUrl(
            "/general/invoice/manualcheckresult/",
            params
        );
        viewMore({
            id: "",
            subject_url: url
        });
    },
    bindEvent: function() {
        var self = this;
        $("#ManualCheck").on("hidden", function() {
            $(".check-tip").removeClass("show");
            self.handleReset();
        });
        $(".reset").on("click", function(e) {
            self.handleReset();
        });
        $("#ManualCheck .submit").on("click", function(e) {
            self.handleCheck();
        });
        $("#c-invoiceCode").on("input", function(e) {
            if ($.trim(e.target.value).length > 10) {
                $(".check-list").removeClass("show-amount");
                self.showAmount = false;
            } else {
                $(".check-list").addClass("show-amount");
                self.showAmount = true;
            }
        });
    },
    showModal: function() {
        $("#ManualCheck").modal();
    },
    hideModal: function() {
        $("#ManualCheck").modal("hide");
    }
};
