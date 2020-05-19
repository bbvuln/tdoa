define('CheckboxCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var CheckboxCtrl = Base.extend({
        initialize: function(config) {
            CheckboxCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
            this.bindEvent();
        },

        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
		
        reRender: function(new_config) {
            //生成新dom，替换旧dom
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
			this._config.value = new_config.value;
            this.bindEvent();
        },

        validate: function() {
            var value = this._config.value;
            var name  = this._config.name;
            //验证必填
            var required = this._config.required;
            if(required && value.length <= 0){
                alert('字段'+name+"为必填字段");
                return false;
            }else{
                return true;
            }
        },

        getValue: function() {
            return (this._config.value && this._config.value.length) ? this._config.value : [];
        },
        triggerCalc: function(obj_res) {
            if(this._config.effect){
                this._config.fieldManager.calc(this._config.field_id, obj_res);
            }
        },
        triggerValidate: function(obj_res) {
            if(this._config.trigger || obj_res.trigger){
                this._config.fieldManager.triggerTrig(obj_res.triggerFields);
            }
        },
        bindEvent: function() {
            var self = this;
            this.$el.find('input').on('change', function(){
                var chk_value =[];
                $('#f-field-'+ self._config.pure_id + ' input[type="checkbox"]:checked').each(function(){
                     chk_value.push($(this).val());
                })
                self._config.value = chk_value;
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
            })
        }
    });
    exports.CheckboxCtrl = window.CheckboxCtrl = CheckboxCtrl;
});
