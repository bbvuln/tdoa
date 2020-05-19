define('TImageUploadCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TImageUploadCtrl = Base.extend({
        
        initialize: function(config) {
            
            TImageUploadCtrl.superclass.initialize.call(this, config);
            this.$obj0 = $('input[name="IMGNAME_'+config.item_id+'"]').eq(0);
            // this.$obj1 = $('input[name="'+config.id+'"]').eq(1);
            this.$imgObj = $('div[name="IMGUPLOAD_'+config.id+'"]').eq(0);
			this.photoCheckObj = $('input[name="'+config.id+'"]'); 
            this.required = config.required;
            this.desc = config.desc;
            this.id = config.id;
            this.check_false = config.check_false;
            this.check_ok = config.check_ok;
            this.bindEvent();
        },
        
        bindEvent: function() {
            var self = this;
            this.$imgObj.bind('click', function(){
                var api = $(this).data('tipsy');
                api && api.hide();
            });
			//图片格式验证
			this.photoCheckObj.change(function(){
				var imagesVal = jQuery('#'+this.id).val() || '';
				if(imagesVal != '')
				{
					var check_flag = self.check_false;
					var lowerVal = imagesVal.toLowerCase();
					if(/.(gif|jpg|jpeg|png|iff|bmp|jp2|jpx|jb2|jpc|xbm|wbmp)$/.test(lowerVal))
					{
						check_flag = self.check_ok;
					}else
					{
						jQuery('#'+self.id).val("");
					}
					self.validation(check_flag);
					setTimeout(function(){
						var api = self.$imgObj.data('tipsy');
						api && api.hide();
					}, 5000);
				}
			});
        },
        
        setOffsetTop: function() {
            var obj_val0 = this.$obj0.val(),
                // obj_val1 = this.$obj1.val(),
                $field = this.$imgObj;
            var required_val = this.required;
            if((obj_val0 == '' || typeof obj_val0 == 'undefined') && required_val)
            {
				var domentHtml = document.getElementById(this.id);
				if(domentHtml.value == '')
				{
					var objTop = $field.offset().top;
					$("body,html").animate({ 
						scrollTop: objTop - 150
					},50); 
					return false;
				}
            }            
        },
        
        onSubmit: function() {
            var obj_val0 = this.$obj0.val(),
                // obj_val1 = this.$obj1.val(),
                $field = this.$imgObj;
            var required_val = this.required;
            if((obj_val0 == '' || typeof obj_val0 == 'undefined') && required_val)
            {
				var domentHtml = document.getElementById(this.id);
				if(domentHtml.value == '')
				{
					this.validation(this.desc);
					setTimeout(function(){
						var api = $field.data('tipsy');
						api && api.hide();
					}, 5000);
					return false;
				}
            }
        },
        
        validation: function(s) {
			self.s = s;
            this.$imgObj.tipsy({
                title: function () {
                    this.title = this.getAttribute('original-title');
                    this.removeAttribute('original-title');
                    return '<b style="color:#E25C5C;">' + self.s + '</b>';
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
    exports.TImageUploadCtrl = window.TImageUploadCtrl = TImageUploadCtrl;
});

