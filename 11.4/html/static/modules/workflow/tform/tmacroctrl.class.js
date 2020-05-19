define('TMacroCtrl',function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TMacroCtrl = Base.extend({

        initialize: function(config) {
            TMacroCtrl.superclass.initialize.call(this, config);
            this.desc = config.desc;
            this.$config = config;
            this.$input = $('input[name= "' + config.id +'"]').eq(0);
            this.$select = $('select[name= "' + config.id +'"]').eq(0);
            this.$textarea = $('textarea[name= "' + config.id +'"]').eq(0);
            this.$obj = (this.$input.length <= 0) ? ((this.$select.length <= 0) ? this.$textarea : this.$select) : this.$input;
            this.$button = $('#ref_' + config.item_id);
            this.$required = config.required;
            this.bindEvent();
        },
        
        setValue: function(value) {
            this.$input.attr('value', value).val(value);
        },
        
        setDefaultValue: function(defaultValue){
            this.$config.auto_value = defaultValue;
        },

        bindEvent: function() {
            var self = this;
            if(self.$config.writable && (self.$config.tag == 'input' || self.$config.tag == 'textarea'))
            {
                var click_obj = this.$input.length == 0 ? this.$textarea : this.$input;
                click_obj.click(function(){
                    if($('#ref_'+self.$config.item_id).is(":hidden"))
                    {
                        $('#ref_'+self.$config.item_id).show();
                    }
                    else
                    {
                        $('#ref_'+self.$config.item_id).hide();
                    }
                });
                
                this.$button.click(function(){
                	var datafld_id = typeof $("input[name='DATA_"+self.$config.item_id+"']").attr("datafld") == 'undefined' ? $("textarea[name='DATA_"+self.$config.item_id+"']").attr("datafld") : $("input[name='DATA_"+self.$config.item_id+"']").attr("datafld");
                    var myDate = new Date();
                    var Month = ("0" + (myDate.getMonth() + 1)).slice(-2);
                    var DateTime = myDate.getFullYear()+"-"+Month+"-"+("0" + myDate.getDate()).slice(-2)+" "+myDate.toLocaleTimeString("en-US", {hour12: false});
                    if(datafld_id == "SYS_USERNAME_DATETIME")// 当前用户名+日期+时间
                    {
                        var return_val = self.$config.login_user_name+" "+DateTime;
                        $("input[name='"+self.$config.id+"']").length == 0 ? $("textarea[name='"+self.$config.id+"']").text(return_val) : $("input[name='"+self.$config.id+"']").attr("value",return_val);		
                    }
                    else if(datafld_id == "SYS_TIME")// 当前时间
                    {
                        $("input[name='"+self.$config.id+"']").length == 0 ? $("textarea[name='"+self.$config.id+"']").text(myDate.toLocaleTimeString("en-US", {hour12: false})) : $("input[name='"+self.$config.id+"']").attr("value",myDate.toLocaleTimeString("en-US", {hour12: false}));
                    }
                    else if(datafld_id == "SYS_DATETIME")//当前日期和时间
                    {
                        $("input[name='"+self.$config.id+"']").length == 0 ? $("textarea[name='"+self.$config.id+"']").text(DateTime) : $("input[name='"+self.$config.id+"']").attr("value",DateTime);
                    }
                    else
                    {
                        $("input[name='"+self.$config.id+"']").length == 0 ? $("textarea[name='"+self.$config.id+"']").text(self.$config.auto_value) : $("input[name='"+self.$config.id+"']").attr("value",self.$config.auto_value);
                    }
                    var api = $(this).prev().data('tipsy');
                    api && api.hide();
                });
            }
            
            this.$obj.bind('focus', function(){
                var api = $(this).data('tipsy');
                api && api.hide();
            })
        }
        
    });
    exports.TMacroCtrl = window.TMacroCtrl = TMacroCtrl;
});