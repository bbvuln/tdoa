define('SelectCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var SelectCtrl = Base.extend({
        initialize: function(config) {
            SelectCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-' + this._config.pure_id);
            this.bindEvent();
        },
        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        reRender: function(new_config) {
            //生成新dom，替换旧dom
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
            this.bindEvent();
			      this._config.value = new_config.value;
        },
        validate: function() {
            var value = this._config.value;
            var name  = this._config.name;
            var multi  = this._config.multi;
            //验证必填
            var required = this._config.required;
            if(required){
                if(multi){
                    if(value.length <= 0){
                        alert('字段'+name+"为必填字段");
                        return false;
                    }
                }else{
                    if($.trim(value) == ""){
                        alert('字段'+name+"为必选字段");
                        return false;
                    }
                }
            }else{
                return true;
            }
        },
        getValue: function() {
            var self = this;
            if (this._config.multi) {
                return (self._config.value && self._config.value.length) ? self._config.value : [];
            } else {
                return self._config.value ? self._config.value : '';
            }
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
            this.$el.find('select').on('change', function() {
                self._config.value = $(this).val();
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
            })
        }
    });
    exports.SelectCtrl = window.SelectCtrl = SelectCtrl;
});
