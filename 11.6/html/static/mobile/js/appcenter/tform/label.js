define('LabelCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var LabelCtrl = Base.extend({
        initialize: function(config) {
            LabelCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
            this.bindEvent();
        },
        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        bindEvent: function() {

        }
    })
    exports.LabelCtrl = window.LabelCtrl = LabelCtrl;
});
