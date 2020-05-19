define('TCounterSignCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TCounterSignCtrl = Base.extend({
        initialize: function(config) {
			TCounterSignCtrl.superclass.initialize.call(this, config);
			this.$obj = $('textarea[name="'+config.id+'"]').eq(0) || '';
			this.id = config.id;
			this.priv = config.priv;
			this.required = config.required;
			this.writable = config.writable;
			this.text_desc = config.text_desc;
			this.desc = config.desc;
        },
        
        bindEvent: function() {
           
        },
        
        setOffsetTop: function() {
            var self = this;
			var priv = self.priv;
			var signFlag = true;
			var r_obj = $('textarea[name="'+self.id+'"]').eq(0);
			var require = (g_op_flag == 1 && priv.op || g_op_flag != 1 && priv.user) ? true : false;
			if(self.required && require)
			{
				if(priv.text)//会签输入区控制
				{
					var textVal = $('textarea[name="'+self.id+'"]').val();
					if(textVal == '')
					{
						signFlag = false;
					}
				}
				if(priv.sign)//盖章区必填
				{
					var r_uid = $('div[id="'+self.id+'"]').find('span[class="countersign_button"]').attr('id');
					if(r_uid)
					{
						var s_name = r_uid.substring(9);
						var have_val = false;
						if(typeof(is_ie) !== 'undefined' && is_ie == false)
						{
							var flag = $('div[id="'+s_name+'_SIGN"]').eq(0).find('img').length;
							if(flag > 0)
							{
								have_val = true;
							}
						}else
						{
							have_val = isHaveAddedSeal(s_name);
						}
						if(have_val == false)
						{
							r_obj = $('div[id="'+self.id+'"]').find('input[type="button"]').length > 0 ? $('div[id="'+self.id+'"]').find('input[type="button"]').last() : $('div[id="'+self.id+'"]').eq(0);
							signFlag = false;
						}
					}
				}
			}
			if(signFlag == false)
			{
				var objTop = r_obj.offset().top;
                $("body,html").animate({ 
                    scrollTop: objTop - 150
                },50);
				return false;
			}
        },
        
        onSubmit: function() {
			var self = this;
			var priv = self.priv;
			var signFlag = true;
			var require = (g_op_flag == 1 && priv.op || g_op_flag != 1 && priv.user) ? true : false;
			if(self.required && require)
			{
				if(priv.text)//会签输入区控制
				{
					var textVal = $('textarea[name="'+self.id+'"]').val();
					if(textVal == '')
					{
						self.validation(self.$obj,self.text_desc);
						setTimeout(function(){
							var api = self.$obj.data('tipsy');
							api && api.hide();
						}, 5000);
						signFlag = false;
					}
				}
				if(priv.sign)//盖章区必填
				{
					var r_uid = $('div[id="'+self.id+'"]').find('span[class="countersign_button"]').attr('id');
					if(r_uid)
					{
						var s_name = r_uid.substring(9);
						var have_val = false;
						if(typeof(is_ie) !== 'undefined' && is_ie == false)
						{
							var flag = $('div[id="'+s_name+'_SIGN"]').eq(0).find('img').length;
							if(flag > 0)
							{
								have_val = true;
							}
						}else
						{
							have_val = isHaveAddedSeal(s_name);
						}
						if(have_val == false)
						{
							var r_obj = $('div[id="'+self.id+'"]').find('input[type="button"]').length > 0 ? $('div[id="'+self.id+'"]').find('input[type="button"]').last() : $('div[id="'+self.id+'"]').eq(0);
							self.validation(r_obj,self.desc);
							setTimeout(function(){
								var api = r_obj.data('tipsy');
								api && api.hide();
							}, 5000);
							signFlag = false;
						}
					}
				}
			}
			if(signFlag == false)
			{
				return false;
			}
        },
        
        validation: function(obj,s) {
            obj.tipsy({
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
    exports.TCounterSignCtrl = window.TCounterSignCtrl = TCounterSignCtrl;
});

