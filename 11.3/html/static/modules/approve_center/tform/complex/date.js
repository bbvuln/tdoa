define('CDateField', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var CDateField = Base.extend({
        initialize: function(config) {
            CDateField.superclass.initialize.call(this, config);
            this._config = config;
            this.name = config.name;
			this.id = config.item_id;
            this.parentid = config.parentid;
            this._render();
            this.desc = config.desc;
            this.$el = $('#f-field-' + this._config.parentid +'-'+ this._config.name).find('input');
            this.bindEvent();
        },
        _render: function() {
            var self = this;
            var configs = $.extend( true, {}, self._config );
            var wrapperId = $('#' +  self._config.parentid).find('div[data-box-rows='+self._config.row+'][data-box-cols='+self._config.col+']');
            try {
                jQuery("#f-complex-date-tmpl").tmpl(configs).appendTo(wrapperId);
            } catch (error) {
                console.log(error);
            }
        },
        reRender: function(new_config) {
            //������dom���滻��dom
            var html = $($.parseTpl(this._config.template,new_config)).html();
            this.$el.html(html);
            this.bindEvent();
			this._config.value = new_config.value;
        },
        getValue: function() {
            var self = this;
            if(self._config.writable == true){
				return self.$el.val();
			}else{
				return self.$el.text();
			}
        },
        getData: function(){
            var ret = {};
            ret.name = this._config.id;
            if(!this._config.secret){
            	ret.value = this.getValue();
            }
            return ret;
        },
        bindEvent: function() {
            var me = this;
			if(me._config.writable) {
                this.$el.bind('change', function() {
                    if(me._config.value != $(this).val()){
                        me._config.value = $(this).val();
                        var text = $(this).val();
                        $(this).val(text);
                        $(this).text(text);
                        // me.triggerValidate();
                        // me.triggerCalc();
                    }
                });
            }
        },
        setOffsetTop: function() {
            var objTop = this.$el.offset().top;
            $("body,html").animate({
                scrollTop: objTop - 150
            },50);
            return false;
        },
        validation: function(desc) {
            var obj = this.$el;
            obj.tipsy({
                title: function () {
                    return '<b style="color:#E25C5C;">'+desc+'</b>';
                },
                html: true,
                fade: true,
                gravity: $.fn.tipsy.autoNS,
                opacity: 1,
                trigger: 'manual',
                container: '#content-main',
                fixPos: function(tp){
                    return tp;
                }
            }).tipsy('show');
        },
        onSubmit: function(){
            var self = this;
            var value = '';
            if(self._config.required ){
            	value = self.getValue();
				if(value && value !==''){
					return true
				}else{
                    var obj = self.$el;
                    self.setOffsetTop();
                    self.validation(self.desc);
                    setTimeout(function(){
                        var api = obj.data('tipsy');
                        api && api.hide();
                    }, 5000);
					return false;
				}
            }
			return true;
        },
    });
    exports.CDateField = window.CDateField = CDateField;
});
