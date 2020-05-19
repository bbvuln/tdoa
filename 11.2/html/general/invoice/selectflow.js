var SelectFlow = function(opt) {
    this.init(opt);
    this.flowId = null;
};
SelectFlow.prototype = {
    init: function(opt) {
        var cb = opt.cb;
        this.save = opt.save;
        this.getFlow(cb);
    },
    getFlow: function(cb) {
        var self = this;
        $.ajax({
            url: "/inc/ocr/getInvoiceFlow.php",
            success: function(res) {
                if (res.status) {
                    var data = res.data;
                    if (data.length) {
                        self.data = data;
                        if (data.length === 1) {
                            self.flowId = data[0].flowId;
                        } else {
                            var dom = "";
                            $.each(data, function(i, item) {
                                var liDom =
                                    '<li class="flow-item" flowid="' +
                                    item.flowId +
                                    '"><img src="/general/invoice/img/img_invoice.png"><div class="flow-name ellipsis" title="' +
                                    item.flowName +
                                    '">' +
                                    item.flowName +
                                    "</div></li>";
                                dom += liDom;
                            });
                            $("body").append(
                                '<div class="modal hide fade" id="selectFlow"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>选择流程</h3></div><div class="modal-body"><ul>' +
                                    dom +
                                    '</ul></div><div class="modal-footer"><div class="select-flow m-btn">下一步</div></div></div>'
                            );
                            self.bindEvent();
                        }
                        if (cb) {
                            cb();
                        }
                    }
                }
            }
        });
    },
    bindEvent: function() {
        var self = this;
        $(".flow-item").click(function(e) {
            var curEl = $(e.currentTarget);
            var preFlowId = self.flowId;
            var selectFlowId = curEl.attr("flowid");
            if (preFlowId) {
                $('[flowid="' + preFlowId + '"]').removeClass("select");
            }
            if (preFlowId === selectFlowId) {
                self.flowId = null;
            } else {
                self.flowId = selectFlowId;
                curEl.addClass("select");
            }
        });
        $(".select-flow").click(function(e) {
            var flowId = self.flowId;
            if (flowId) {
                self.save(flowId);
            }
        });
    },
    showModal: function() {
        if (this.data.length > 1) {
            $("#selectFlow").modal();
        } else {
            this.save(this.flowId);
        }
    }
};
