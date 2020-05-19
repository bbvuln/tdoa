define('ProgressbarCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var ProgressbarCtrl = Base.extend({
        initialize: function(config) {
            ProgressbarCtrl.superclass.initialize.call(this, config);
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
        },
        validate: function() {
			var value = this._config.value;
            var name  = this._config.name;
            //验证必填
            var required = this._config.required;
            if(required && $.trim(value) == ""){
                alert('字段'+name+"为必填字段");
                return false;
            }else{
                return true;
            }
        },
        getValue: function() {
            return this._config.value
        },
        triggerCalc: function(obj_res) {
			if(this._config.effect){
                this._config.fieldManager.calc(this._config.field_id);
            }
        },
        triggerValidate: function(obj_res) {
			if(this._config.trigger || obj_res.trigger){
                this._config.fieldManager.triggerTrig(obj_res.triggerFields);
            }
        },
        bindEvent: function() {
			var me = this
			var _strokeWidth = me._config.strokeWidth
			_strokeWidth = typeof _strokeWidth == "number" ? _strokeWidth : parseInt(_strokeWidth)
			this.$el.delegate('.progress-minus', 'tap', function(){
				var _value = me._config.value
				_value = _value ? _value : 0
				var newValue = parseInt(_value) - parseInt(_strokeWidth);
				if(newValue < 0){
					newValue = 0
				}
				me._config.value = newValue
				me.reRender(me._config)

                var obj_res = {trigger: false, triggerFields: me._config.trigger ? [{field_id: me._config.field_id, index: 1}] : []};
                me.triggerCalc(obj_res);
                me.triggerValidate(obj_res);
			})
			this.$el.delegate('.progress-plus', 'tap', function(){
				var _value = me._config.value
				_value = _value ? _value : 0
				var newValue = parseInt(_value) + parseInt(_strokeWidth);
				if(newValue > 100){
					newValue = 100
				}
				me._config.value = newValue
				me.reRender(me._config)

                var obj_res = {trigger: false, triggerFields: me._config.trigger ? [{field_id: me._config.field_id, index: 1}] : []};
                me.triggerCalc(obj_res);
                me.triggerValidate(obj_res);
			})
        }
    });
    exports.ProgressbarCtrl = window.ProgressbarCtrl = ProgressbarCtrl;
});
