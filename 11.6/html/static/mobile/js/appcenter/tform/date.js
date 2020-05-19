define('DateCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var DateCtrl = Base.extend({
        initialize: function(config) {
            DateCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
            this.bindEvent();
            this.initMobiscroll(this._config.format);
        },

        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },

        reRender: function(new_config) {
            //生成新dom，替换旧dom
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
			this._config.value = new_config.value;
			this.initMobiscroll(this._config.format);
			this.bindEvent();
        },

        getValue: function() {
            return this._config.value ? this._config.value : ''
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

        initMobiscroll: function(format){
            var self = this;
            var now = new Date();
            var $target = this.$el.find('input');
            // 格式为 HH:mm
            if(format.lastIndexOf(":") === 2 ){
                $target.mobiscroll().time({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller'
                })
                return false
            }
			// 格式为 HH:mm:ss
			if( format.lastIndexOf(":") === 5){
                $target.mobiscroll().time({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
					timeFormat: 'HH:ii:ss',
					timeWheels:'HHiiss'
                })
                return false
            }

            // 格式为 yyyy-MM-dd HH:mm:ss
            if(format.length > 10){
                $target.mobiscroll().datetime({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
                    dateFormat: 'yy-mm-dd',//yy-mm-dd
					timeFormat: 'HH:ii:ss',
					timeWheels:'HHiiss',
                })
                return false
            }

            // 格式为 yyyy-MM-dd
            if(format.indexOf("-") > 0 && format.length === 10){
                $target.mobiscroll().date({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
                    dateFormat: 'yy-mm-dd',

                })
                return false
            }

            // 格式为 yyyy/MM/dd
            if(format.indexOf("/") > 0 && format.length === 10){
                $target.mobiscroll().date({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
                    dateFormat: 'yy-mm-dd',//yy/mm/dd

                })
                return false
            }

            // 格式为 yyyyMMdd
            if(format.length === 8){
                $target.mobiscroll().date({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
                    dateFormat: 'yy-mm-dd',//yyyymmdd

                })
                return false
            }
            // 格式为 yyyy
            if(format.length === 4){
                $target.mobiscroll().date({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
                    dateFormat: 'yyyy',//yyyymmdd

                })
                return false
            }
            // 格式为 yyyy-mm
            if(format.length <=7&&format.length != 4){
                $target.mobiscroll().date({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
                    dateFormat: 'yyyy-mm',//yyyymmdd

                })
                return false
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
            var format = self._config.format;
            this.$el.find('input').on('change', function(){
                var date_value = $(this).val();
                self._config.value = date_value;
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
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
    exports.DateCtrl = window.DateCtrl = DateCtrl;
});
