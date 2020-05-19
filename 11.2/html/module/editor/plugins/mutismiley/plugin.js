CKEDITOR.plugins.add("mutismiley", {
    requires: "dialog",
    init: function(a) {
        var pluginName = 'mutismiley';
        a.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName, {
            allowedContent: "img[alt,height,!src,title,width]",
            requiredContent: "img"
        }));
        a.ui.addButton && a.ui.addButton(pluginName, {
            label: a.lang.mutismiley.toolbar,
            command: pluginName,
            toolbar: "insert,50",
            icon: this.path + 'images/emoticon_smile.png'
        });
        CKEDITOR.dialog.add(pluginName, this.path + "dialogs/mutismiley.js")
    }
});