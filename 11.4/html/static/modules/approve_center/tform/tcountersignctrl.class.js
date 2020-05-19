define('TCounterSignCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TCounterSignCtrl = Base.extend({
        initialize: function(config) {
			this.$obj = $('textarea[name="'+config.id+'"]').eq(0) || '';
			this.id = config.id;
			this.required = config.required;
			this.writable = config.writable;
			this.desc = config.desc;
        },
        
        bindEvent: function() {
           
        },
        
        setOffsetTop: function() {
            
        },
        
        onSubmit: function() {
            $("#"+this.id).find('textarea,span').each(function() {
                var signValue = $(this).get(0).tagName.toLowerCase() == 'textarea' ? $(this).val() : $(this).text();
                // if ($(this).attr('name') == 'signcontent') {
                    // if (signValue) {
                        // signValue = signValue.replace(/\\/g, "\\\\");
                        // signValue = signValue.replace(/\"/g, "\\\"");
                    // }
                    // defaultValue += '"signcontent":' + '"' + signValue + '",';
                // }
                // if ($(this).attr('name') == 'signuser') {
                    // defaultValue += '"signuser":' + '"' + signValue + '",';
                // }
                // if ($(this).attr('name') == 'signorg') {
                    // defaultValue += '"signorg":' + '"' + signValue + '",';
                // }
                // if ($(this).attr('name') == 'signtime') {
                    // defaultValue += '"signtime":' + '"' + signValue + '",';
                // }
                // if ($(this).attr('name') == 'signrole') {
                    // defaultValue += '"signrole":' + '"' + signValue + '",';
                // }
            });
        },
        
        validation: function(s) {
           
        }

    });
    exports.TCounterSignCtrl = window.TCounterSignCtrl = TCounterSignCtrl;
});

