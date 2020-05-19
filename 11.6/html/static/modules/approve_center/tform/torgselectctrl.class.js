define('TOrgSelectCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TOrgSelectCtrl = Base.extend({

        initialize: function(config) {
            TOrgSelectCtrl.superclass.initialize.call(this, config);
            this.$config = config;
            this.$input = $('textarea[name=' + config.id +']').eq(0);
			this.$input = this.$input.length == 0 ? $('input[name=' + config.id +']').eq(0) : this.$input;
			this.$obj = this.$input;
            this.$img = $('img[title="'+config.title+'"]').eq(0);
			this.required = config.required;
            this.desc = config.desc;
			this.is_up = config.is_up;
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
			var totalId = self.is_up == true ? 'DATA_'+self.$config.item_id : self.$config.id;
            this.$img.click(function(){
                if(self.$config.select_type == '1')
                {
                    SelectUser('5', '', "USER_"+self.$config.item_id,totalId);
                }
                else if(self.$config.select_type == '2')
                {
                    SelectDept('', "DEPT_"+self.$config.item_id,totalId);
                }
            });
        },
		onSubmit: function() {
            var obj_val = this.$input.val(),
                $field = this.$input;
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    var api = $field.data('tipsy');
                    api && api.hide();
                }, 5000);
                return false;
            }
        },
		validation: function(s) {
            this.$input.tipsy({
                title: function () {
                    this.title = this.getAttribute('original-title');
                    this.removeAttribute('original-title');
                    return '<b style="color:#E25C5C;">' + s + '</b>';
                },
                html: true,
                fade: true,
                gravity: $.fn.tipsy.autoWE,
                opacity: 1,
                trigger: 'manual',
                container: '#content-main',
                fixPos: function(tp){ 
                //tp.left -= 50;  
                    return tp; 
                }
            }).tipsy('show');
        }
    });
    exports.TOrgSelectCtrl = window.TOrgSelectCtrl = TOrgSelectCtrl;
});

