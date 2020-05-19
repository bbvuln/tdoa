define('TWebSignCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TWebSignCtrl = Base.extend({

        initialize: function(config) {
            TWebSignCtrl.superclass.initialize.call(this, config);
            this.$obj = $('input[name="'+config.id+'"]').eq(0);
            this.$websignObj = $('[name="WEBSIGN_'+config.id+'"]');
            this.id = config.id;
            this.required = config.required;
            this.desc = config.desc;
            this.title = config.title;
            this.bindEvent();
        },
        
        bindEvent: function() {
            var self = this;
            this.$websignObj.each(function(){
                $(this).bind("click", function(){
                    var api = self.$websignObj.last().data('tipsy');
                    api && api.hide();
                });
            });
        },
        
        setOffsetTop: function() {
            var required_val = this.required;
            var obj_val = required_val && isHaveAddedSeal(this.id),
                $field = this.$obj,
                self = this;
            if(obj_val === false && required_val)
            {
                var objTop = self.$websignObj.last().offset().top;
                $("body,html").animate({ 
                    scrollTop: objTop - 150
                },50); 
                return false;
            }             
        },
        
        onSubmit: function() {
            var required_val = this.required;
            var obj_val = required_val && isHaveAddedSeal(this.id),
                $field = this.$obj,
                self = this;
            if(obj_val === false && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    var api = self.$websignObj.last().data('tipsy');
                    api && api.hide();
                }, 5000);
                return false;
            }
        },
        
        validation: function(s) {
            this.$websignObj.last().tipsy({
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
    exports.TWebSignCtrl = window.TWebSignCtrl = TWebSignCtrl;
});

