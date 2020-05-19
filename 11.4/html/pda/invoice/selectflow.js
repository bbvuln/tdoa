var SelectFlow = function(opt) {
    this.init(opt);
    this.flowId = null;
    this.pending = false;
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
                            var str = "";
                            $.each(data, function(i, item) {
                                var liDom =
                                    '<li><div class="ellipsis flow-item" flowId="' +
                                    item.flowId +
                                    '">' +
                                    item.flowName +
                                    "</div></li>";
                                str += liDom;
                            });
                            var dom =
                                '<div class="drawer-mask"><div class="drawer-content"><div class="select-title">选择流程</div><ul class="flow-list">' +
                                str +
                                '</ul><div class="next-btn">下一步</div></div></div>';
                            $("body").append(dom);
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
        $(".flow-item").tap(function(e) {
            var curEl = $(e.target);
            var preFlowId = self.flowId;
            var selectFlowId = curEl.attr("flowId");
            if (preFlowId) {
                $('[flowId="' + preFlowId + '"]').removeClass("select");
            }
            if (preFlowId === selectFlowId) {
                self.flowId = null;
            } else {
                self.flowId = selectFlowId;
                curEl.addClass("select");
            }
        });
        $(".drawer-mask").tap(function() {
            self.hideDrawer();
        });
        $(".drawer-content").tap(function(e) {
            e.stopPropagation();
        });
        $(".next-btn").tap(function(e) {
            var flowId = self.flowId;
            if (flowId) {
                self.handleSave();
            }
        });
    },
    handleSave: function() {
        if (!this.pending) {
            this.save(this.flowId);
            this.pending = true;
        }
    },
    showDrawer: function() {
        if (this.data.length > 1) {
            $(".drawer-mask").addClass("show");
            setTimeout(function() {
                $(".drawer-content").addClass("show");
            }, 30);
        } else {
            this.handleSave();
        }
    },
    hideDrawer: function() {
        $(".drawer-content").removeClass("show");
        setTimeout(function() {
            $(".drawer-mask").removeClass("show");
        }, 300);
    }
};
