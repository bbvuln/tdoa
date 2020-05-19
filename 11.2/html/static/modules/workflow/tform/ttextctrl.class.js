define('TTextCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TTextCtrl = Base.extend({

        initialize: function(config) {
            TTextCtrl.superclass.initialize.call(this, config);
            this.$obj = $('input[name="'+config.id+'"]').eq(0);
            this.bindEvent();
        },
        
        bindEvent: function() {
            this.$obj.bind('focus', function(){
                var api = $(this).data('tipsy');
                api && api.hide();
            })
        }
        
    });
    exports.TTextCtrl = window.TTextCtrl = TTextCtrl;
});

