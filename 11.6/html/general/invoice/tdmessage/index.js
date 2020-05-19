var TDMessage = function(opt) {
    this.text = opt.text;
    this.init();
};
TDMessage.prototype = {
    init: function() {
        var text = this.text;
        $("body").append(
            '<div class="MessageBox" style="width:237px"><img class="MessageBoxIcon" src="/static/images/messageBox/info.png"><div class="center info "><div class="msg-content">' +
                text +
                "</div></div></div>"
        );
    }
};
