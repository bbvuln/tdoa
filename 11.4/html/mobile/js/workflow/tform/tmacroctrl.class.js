define('TMacroCtrl',function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TMacroCtrl = Base.extend({

        initialize: function(config) {
            TMacroCtrl.superclass.initialize.call(this, config);
            this.desc = config.desc;
            this.$config = config;
            this.id = config.id;
            this.low_id = config.id.toLowerCase();
            this.$input = $('input[name= "' + config.id +'"]').eq(0);
            this.$select = $('select[name= "' + config.id +'"]').eq(0);
            this.$obj = (this.$input.length <= 0) ? this.$select : this.$input;
            this.$button = $('#ref_' + config.item_id);
            this.required = config.required;
        },

        onSubmit: function() {
            var obj_input = this.$input;
            var obj_select = this.$select;
            if(obj_input.length > 0){
                var obj_val = obj_input.val();
            }else{
                var obj_val = obj_select.val();
            }
            var required_val = this.required;
            var low_id = this.low_id;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    jQuery("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },

        validation: function(s) {
            jQuery("#div_alert_"+this.low_id+"").addClass("div_alert_show");
        }
        
    });
    exports.TMacroCtrl = window.TMacroCtrl = TMacroCtrl;
});