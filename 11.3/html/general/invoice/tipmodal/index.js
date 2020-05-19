var TipModal = function(opt) {
    this.text = opt.text ? opt.text : "";
    this.id = opt.id;
    this.init();
};
TipModal.prototype = {
    init: function() {
        this.createDom();
    },
    createDom: function() {
        var self = this;
        $("body").append(
            '<div class="modal hide fade in" id="' +
                self.id +
                '" aria-hidden="false"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">°¡</button><h3>Ã· æ</h3></div><div class="modal-body"><p class="tip-text">' +
                self.text +
                '</p></div><div class="modal-footer"><a class="btn" data-dismiss="modal" aria-hidden="true">πÿ±’</a></div></div>'
        );
    },
    showModal: function() {
        var self = this;
        $("#" + self.id).modal();
    },
    changeText: function(text) {
        var self = this;
        $("#" + self.id)
            .find(".tip-text")
            .text(text);
    }
};
