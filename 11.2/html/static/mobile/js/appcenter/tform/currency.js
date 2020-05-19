define('CurrencyCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var CurrencyCtrl = Base.extend({
        initialize: function(config) {
            CurrencyCtrl.superclass.initialize.call(this, config);
            this._config = config;
            if(this._config.value){
                this._config.value = parseFloat(this._config.value).toFixed(this._config.fixTo || 0);
            }
            if (this._config.kind === 'upCase') {
                this._config.value_upcase = numtoCL.toBMoney(this._config.value);
            } else {
                this._config.value_upcase = numtoCL.toSMoney(this._config.value);
            }
            this._config.sign_text = ''
            if (this._config.sign == '￥') {
                this._config.sign_text = '人民币'
            } else if(this._config.sign == 'O') {
                this._config.sign_text = '欧元'
            } else if(this._config.sign == '＄') {
                this._config.sign_text = '美元'
            }
            this._config.unval = ''
            this._config.unval =  this._config.value.replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');//千分位
            this._render();
            this.$el = $('#f-field-' + this._config.pure_id);
            this.bindEvent();
        },
        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config))
        },
        reRender: function(new_config) {
            //生成新dom，替换旧dom
			new_config.sign_text = this._config.sign_text;
			new_config.value_upcase = this._config.value_upcase
      new_config.unval =  ('' + this._config.value).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');//千分位
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
			this._config.value = new_config.value;
			this.synchKind();
            this.bindEvent();
        },
        getValue: function() {
            return this._config.value ? this._config.value : ''
        },
        validate: function() {
            var value = this._config.value;
            var name  = this._config.name;
            var required = this._config.required;
			//验证必填
            if(required && $.trim(value) == ""){
                alert('字段'+name+"为必填字段");
                return false;
            }
			/* if($.trim(value) != "" && !/^(-?\d+)(\.\d+)?$/.test(value)){
				alert('字段'+name+"请输入数字");
				return false;
			}  */
        },
        synchKind: function() {
            var $upcase_kind = this.$el.find('.upcase_kind')
            if (this._config.kind === 'upCase') {
                $upcase_kind.text(numtoCL.toBMoney(this._config.value));
            } else {
                $upcase_kind.text(numtoCL.toSMoney(this._config.value));
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
            var me = this;
            //触发触发器由keyup改为blur
            this.$el.find('input').on('blur', function() {//keyup
                var value =  $(this).val();
                if(value.length === 0){
                    value = 0;
                }
                me._config.value = parseFloat(value).toFixed(me._config.fixTo || 0);
                me.synchKind();
                // me.triggerCalc() ;
                // me.triggerValidate();
                var obj_res = {trigger: false, triggerFields: me._config.trigger ? [{field_id: me._config.field_id, index: 1}] : []};
                me.triggerCalc(obj_res);
                me.triggerValidate(obj_res);
            });
            this.$el.find("button[role='selectData']").bind("click", function() {
                if(me._config.value != $(this).val()){
                    me._config.value = $(this).val();
                }
                me.dataList();
            });
        },
        dataList: function() {
            this._config.fieldManager.dataList(this._config);
        }
    });
    exports.CurrencyCtrl = window.CurrencyCtrl = CurrencyCtrl;
});
