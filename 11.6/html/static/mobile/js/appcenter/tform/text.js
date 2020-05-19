define('TextCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TextCtrl = Base.extend({
        initialize: function(config) {
            TextCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-' + this._config.pure_id);
            this.bindEvent();
        },
        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        reRender: function(new_config) {
            //������dom���滻��dom
            var html = $($.parseTpl(this._config.template,new_config)).html();
            this.$el.html(html);
            this.bindEvent();
			this._config.value = new_config.value;
        },
        getValue: function() {
            return this.$el.find('input').length > 0 ? this.$el.find('input').val() : this._config.value;
        },
        validate: function() {
            var value = this._config.value;
            var name  = this._config.name;
            //��֤����
            var required = this._config.required;
            if(required && $.trim(value) == ""){
                alert('�ֶ�'+name+"Ϊ�����ֶ�");
                return false;
            }


            //��֤����len
            var len = this._config.len;
            if(len && value.length>len){
                alert('�ֶ�'+name+"���Ȳ��ܳ���"+len+"���ַ�");
                return false;
            }
            //��֤kind��ʽ
            var isOk = true;
            var kind = this._config.kind;
            var required = this._config.required;
            if(!required && $.trim(value) == ""){
                return isOk;
            }else{
                switch (kind) {
                    case 'email':
                        var email_test = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
                        if (!email_test.test(value)) {
                            alert('�ֶ�'+name+'��ʽ����ȷ��ӦΪ�����ʽ�����޸ģ�');
                            isOk = false
                        }
                        break;
                    case 'postcode':
                        var postcode_test = /[1-9]\d{5}(?!\d)/;
                        if (!postcode_test.test(value)) {
                            alert('�ֶ�'+name+'��ʽ����ȷ��ӦΪ���������ʽ�����޸ģ�');
                            isOk = false
                        }
                        break;
                    case 'phone':
                        var phone_test = /^1[3578]\d{9}$/;
                        if (!phone_test.test(value)) {
                            alert('�ֶ�'+name+'��ʽ����ȷ��ӦΪ�ֻ������ʽ�����޸ģ�');
                            isOk = false
                        }
                        break;
                    case 'idnumber':
                        var idnumber_test = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                        if (!idnumber_test.test(value)) {
                            alert('�ֶ�'+name+'��ʽ����ȷ��ӦΪ���֤�����ʽ�����޸ģ�');
                            isOk = false
                        }
                        break;
                    case 'tele':
                        var tele_test = /\d{3}-\d{8}|\d{4}-\d{7}/;
                        if (!tele_test.test(value)) {
                            alert('�ֶ�'+name+'��ʽ����ȷ��ӦΪ�绰�����ʽ�����޸ģ�');
                            isOk = false
                        }
                        break;
                    default:
                        break;
                }
            }

            return isOk;
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
            //������������keyup��Ϊblur
			this.$el.find('input').on('blur', function() {
				if(me._config.value != $(this).val()){
					me._config.value = $(this).val();
					// me.triggerValidate();
					// me.triggerCalc();
                    var obj_res = {trigger: false, triggerFields: me._config.trigger ? [{field_id: me._config.field_id, index: 1}] : []};
                    me.triggerCalc(obj_res);
                    me.triggerValidate(obj_res);
				}

            });
            this.$el.find("button[role='selectData']").bind("click", function() {
                if(me._config.value != $(this).val()){
                    me._config.value = $(this).val();
                }
                me.dataList();
            });
        },
        dataList: function() {
        		this._config.fieldManager.defaults.pageNo = 1;
            this._config.fieldManager.dataList(this._config);
        }
    });
    exports.TextCtrl = window.TextCtrl = TextCtrl;
});
