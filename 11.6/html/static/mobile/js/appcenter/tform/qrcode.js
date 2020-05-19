define('QrcodeCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var QrcodeCtrl = Base.extend({
        initialize: function(config) {
            QrcodeCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
        },
        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        reRender: function(new_config) {
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
			this._config.value = new_config.value;
            // this.bindEvent();
        }
    });
    exports.QrcodeCtrl = window.QrcodeCtrl = QrcodeCtrl;
});
