define('AutonumberCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var AutonumberCtrl = Base.extend({
        initialize: function(config) {
            AutonumberCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
            this.bindEvent();
        },
        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        reRender: function(new_config) {
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
			this._config.value = new_config.value;
            this.bindEvent();
        },
        validate: function() {
			return true
        },
        getValue: function() {
			return this._config.value
        },
        triggerCalc: function() {
        },
        triggerValidate: function() {
        },
        bindEvent: function() {
        }
    });
    exports.AutonumberCtrl = window.AutonumberCtrl = AutonumberCtrl;
});
