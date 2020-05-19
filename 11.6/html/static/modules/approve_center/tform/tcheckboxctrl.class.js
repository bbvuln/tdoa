define('TCheckboxCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TCheckboxCtrl = Base.extend({
        initialize: function(config) {
            TCheckboxCtrl.superclass.initialize.call(this, config);
            this.$obj = $('input[name="'+config.id+'"]').eq(0);
			this.$option = $('input[name="'+config.id+'"]');
			this.$hidden = $('input[id="'+config.id+'"]');
            this.$id = config.id;
            this.required = config.required;
            this.desc = config.desc;
			this.checked = $('input[name="'+config.id+'"]:checked');
			var join = '';
			this.checked.each(function(i,v){
				var value = $(v).val();
				join += value+',';
			});
            join = join.substr(0, join.length - 1);//删除最后一个逗号，najie要求的
			this.$hidden.val(join);
            this.bindEvent();
        },
        
        bindEvent: function() {
            // this.$obj.bind('focus', function(){
                // var api = $(this).data('tipsy');
                // api && api.hide();
            // });
			var self = this;
			this.$option.change(function(){
				self.$check = $('input[name="'+self.$id+'"]:checked');
				self.$hidden.val(self.$check.map(function(){return this.value}).get().join(','));
			});
        },
        
        setOffsetTop: function() {
            var obj_val = $("input[name='"+this.$id+"']:checked").val(),
                $field = this.$obj;
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                var objTop = $field.offset().top;
                $("body,html").animate({ 
                    scrollTop: objTop - 150
                },50); 
                return false;
            }            
        },
        
        onSubmit: function() {
            var obj_val = $("input[name='"+this.$id+"']:checked").val(),
                $field = this.$obj;
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
            this.$obj.tipsy({
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
    exports.TCheckboxCtrl = window.TCheckboxCtrl = TCheckboxCtrl;
});

