define('TCheckboxCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');//iCheck初始化单选、复选框
    var TCheckboxCtrl = Base.extend({
        initialize: function(config){
            TCheckboxCtrl.superclass.initialize.call(this, config);
			this.$config = config;
            this.id = config.id;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
            $('input').iCheck({ 
                checkboxClass: 'icheckbox_square-blue',
                radioClass: 'iradio_square-blue'
            });
        },
        
        onSubmit: function(){
            var obj_val = $("[name='"+this.id+"']").prop("checked"),
                required_val = this.required,
                low_id = this.low_id;
            if((obj_val === false || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    jQuery("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },
        
        validation: function(desc){
            jQuery("#div_alert_"+this.low_id+"").addClass("div_alert_show");
        }
    });
    exports.TCheckboxCtrl = window.TCheckboxCtrl = TCheckboxCtrl;
});