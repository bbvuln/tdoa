define('GroupCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var GroupCtrl = Base.extend({
        initialize: function(config) {
            GroupCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
            this.bindEvent();
        },
        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        getValue: function() {

        },
        bindEvent: function() {
            // this.$el.on('click', function(){
            //   //
            // })
        }
    })
    exports.GroupCtrl = window.GroupCtrl = GroupCtrl;
});
