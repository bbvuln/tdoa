var QueryContent = function(opt) {
    this.bindEvent();
};
QueryContent.prototype = {
    bindEvent: function() {
        var self = this;
        $(".query-img").tap(function(e) {
            self.showDrawer();
        });

        $(".query-drawer-mask").tap(function() {
            self.hideDrawer();
        });
        $(".query-drawer-content").tap(function(e) {
            e.stopPropagation();
        });
    },
    showDrawer: function() {
        $(".query-drawer-mask").addClass("show");
        setTimeout(function() {
            $(".query-drawer-content").addClass("show");
        }, 30);
    },
    hideDrawer: function() {
        $(".query-drawer-content").removeClass("show");
        setTimeout(function() {
            $(".query-drawer-mask").removeClass("show");
        }, 300);
    }
};
