define('TCalendarCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCalendarCtrl = Base.extend({

        initialize: function(config) {
            TCalendarCtrl.superclass.initialize.call(this, config);
            this.$input = $('input[name="' + config.id +'"]').eq(0); //日历控件和单行输入框的绑定是依靠控件名称也就是text的title来绑定的.
            this.$img = $('img[name="' + config.id + '"]').eq(0);//日历控件的value和单行的title绑定来实现回填--yzx
			this.$img = this.$img.length == 0 ? $('img[name="' + config.other_id + '"]').eq(0) : this.$img;
			this.required = config.required;
			this.$obj = $('input[name= "' + config.id +'"]').eq(0) || '';
            this.desc = config.desc;
			this.id = config.id;
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this,
            date_format = this.$img.attr("date_format") || "yyyy-MM-dd";
            this.$img.click(function(){
                WdatePicker({ dateFmt:date_format, el: self.$input.get(0) });
            });
        },
		setOffsetTop: function() {
            var obj_val = $("input[name='"+this.id+"']").val();
                $field = this.$obj;
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val && this.$obj != '')
            {
                var objTop = $field.offset().top;
                $("body,html").animate({ 
                    scrollTop: objTop - 150
                },50); 
                return false;
            }            
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
    exports.TCalendarCtrl = window.TCalendarCtrl = TCalendarCtrl;
});

