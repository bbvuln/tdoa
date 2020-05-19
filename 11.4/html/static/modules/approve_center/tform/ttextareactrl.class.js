define('TTextareaCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TTextareaCtrl = Base.extend({

        initialize: function(config) {
            TTextareaCtrl.superclass.initialize.call(this, config);
            this.$obj = $('textarea[name="'+config.id+'"]').eq(0);
            this.id = config.id;
            this.rich = config.rich;
            this.bindEvent();
        },
        
        bindEvent: function() {
            if(this.rich == 0)
            {
                this.$obj.bind('focus', function(){
                    var api = $(this).data('tipsy');
                    api && api.hide();
                })
            }
        },
        
        setOffsetTop: function() {
            if(this.rich == 0)
            {
                var obj = this.$obj;
                var objEx = this.$obj;
            }
            else
            {
                var obj = $('textarea[name="TD_HTML_EDITOR_'+this.id+'"]');
                var objEx = $('#TD_HTML_EDITOR_'+this.id+'').find('iframe');
            }
            var obj_val = obj.val(),
                $field = objEx;
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
            if(this.rich == 0)
            {
                var obj = this.$obj;
                var objEx = this.$obj;
            }
            else
            {
                var obj = $('textarea[name="TD_HTML_EDITOR_'+this.id+'"]');
                var objEx = $('#TD_HTML_EDITOR_'+this.id+'').find('iframe');
            }
            var obj_val = obj.val(),
                $field = objEx;
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
            if(this.rich == 0)
            {
                var obj = this.$obj;
            }
            else
            {
                var obj = $('#TD_HTML_EDITOR_'+this.id+'').find('iframe');
            }
            obj.tipsy({
                title: function () {
                    this.title = this.getAttribute('original-title');
                    this.removeAttribute('original-title');
                    return '<b style="color:#E25C5C;">' + s + '</b>';
                },
                html: true,
                fade: true,
                gravity: $.fn.tipsy.autoNS,
                opacity: 1,
                trigger: 'manual',
                container: '#content-main',
                fixPos: function(tp){ 
                // tp.left -= 50;  
                    return tp; 
                }
            }).tipsy('show');
        }
        
    });
    exports.TTextareaCtrl = window.TTextareaCtrl = TTextareaCtrl;
});

