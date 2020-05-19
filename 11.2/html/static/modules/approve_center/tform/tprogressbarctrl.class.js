define('TProgressBarCtrl', function(require, exports, module){

    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TProgressBarCtrl = Base.extend({

        initialize: function(config) {
            TProgressBarCtrl.superclass.initialize.call(this, config);
			this.$config = config;
            this.$obj = $('input[name=' + config.id +']').eq(0);
			this.$add_img = $('#img_add_' + config.id);
			this.$less_img = $('#img_less_' + config.id);
            this.required = config.required;
            this.desc = config.desc;
			this.bindEvent();
        },
        
        setOffsetTop: function() {
            var obj_val = this.$obj.val(),
                $field = this.$less_img;
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined' || obj_val == 0) && required_val)
            {
                var objTop = $field.offset().top;
                $("body,html").animate({ 
                    scrollTop: objTop - 150
                },50); 
                return false;
            }            
        },
        
        onSubmit: function() {
            var obj_val = this.$obj.val(),
                $field = this.$less_img;
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined' || obj_val == 0) && required_val)
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
            this.$less_img.tipsy({
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
        },
        
        bindEvent: function()
        {
        	var self = this,
            item_id = this.$config.item_id,
        	data_name = this.$config.id,
        	sign_type = this.$config.sign_type;
        	
        	this.$add_img.click(function(){
        		
        		if(sign_type == "")
				{
					sign_type = 1;
				}
				
				//取出进度并得出新的进度
				var pro_val = Math.round(jQuery("#"+data_name).attr('value'));
				
				pro_val = parseInt(pro_val)+parseInt(sign_type);
				
				if(pro_val > 100)
				{
					pro_val = 100;
				}
				if(pro_val < 0)
				{
					pro_val = 0;
				}
				
				jQuery("#"+data_name).attr("value",parseInt(pro_val));
				jQuery("#numpro_"+item_id).html(""+pro_val+"%");
				
				var progress_style = Math.round(145 - 145 * pro_val/100);
				
				var pro_obj = jQuery("#bar_"+item_id);
				pro_obj.css("backgroundPositionX", "-"+progress_style+'px');
            });
            
            this.$less_img.click(function(){
        		if(sign_type == "")
				{
					sign_type = 1;
				}
				//取出进度并得出新的进度
				var pro_val_old = jQuery("#"+data_name).attr('value');
				var pro_val = Math.round(jQuery("#"+data_name).attr('value'));
				pro_val = parseInt(pro_val)-parseInt(sign_type);
				
				if(pro_val > 100)
				{
					pro_val = 100;
				}
				if(pro_val < 0)
				{
					pro_val = 0;
				}
				
				jQuery("#"+data_name).attr("value",parseInt(pro_val));
				jQuery("#numpro_"+item_id).html(""+pro_val+"%");
				
				var progress_style = Math.round(145 - 145 * pro_val/100);
				
				var pro_obj = jQuery("#bar_"+item_id);
				pro_obj.css("backgroundPositionX", "-"+progress_style+'px');
            });
            
            this.$add_img.bind('click', function(){
                var api = $(this).next().data('tipsy');
                api && api.hide();
            });
            
            this.$less_img.bind('click', function(){
                var api = $(this).data('tipsy');
                api && api.hide();
            });
        }
        
    });
    exports.TProgressBarCtrl = window.TProgressBarCtrl = TProgressBarCtrl;
});

