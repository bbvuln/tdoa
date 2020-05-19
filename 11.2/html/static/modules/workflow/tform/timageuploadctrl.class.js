define('TImageUploadCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TImageUploadCtrl = Base.extend({
        
        initialize: function(config) {
            
            TImageUploadCtrl.superclass.initialize.call(this, config);
            this.$obj0 = $('input[name="'+config.id+'"]').eq(0);
            this.$obj1 = $('input[name="'+config.id+'"]').eq(1);
            this.$imgObj = $('div[name="IMGUPLOAD_'+config.id+'"]').eq(0);
            this.required = config.required;
            this.desc = config.desc;
            this.id = config.id;
            this.bindEvent();
        },
        
        bindEvent: function() {
            var self = this;
            this.$imgObj.bind('click', function(){
                var api = $(this).data('tipsy');
                api && api.hide();
            })
        },
        
        setOffsetTop: function() {
            var obj_val0 = this.$obj0.val(),
                obj_val1 = this.$obj1.val(),
                $field = this.$imgObj;
            var required_val = this.required;
            if((obj_val0 == '' || typeof obj_val0 == 'undefined') && (obj_val1 == '' || typeof obj_val1 == 'undefined') && required_val)
            {
                var objTop = $field.offset().top;
                $("body,html").animate({ 
                    scrollTop: objTop - 150
                },50); 
                return false;
            }            
        },
        
        onSubmit: function() {
            var obj_val0 = this.$obj0.val(),
                obj_val1 = this.$obj1.val(),
                $field = this.$imgObj;
            var required_val = this.required;
            if((obj_val0 == '' || typeof obj_val0 == 'undefined') && (obj_val1 == '' || typeof obj_val1 == 'undefined') && required_val)
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
            this.$imgObj.tipsy({
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
    exports.TImageUploadCtrl = window.TImageUploadCtrl = TImageUploadCtrl;
});

