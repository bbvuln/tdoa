define('TQRCodeCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TQRCodeCtrl = Base.extend({

        initialize: function(config) {
            TQRCodeCtrl.superclass.initialize.call(this, config);
			this.$config = config;
			this.$img = $('#' + config.selector);
        },
        
        setValue: function(value) {
            this.$img.attr('src', '').attr('src', value);
        }

    });
    exports.TQRCodeCtrl = window.TQRCodeCtrl = TQRCodeCtrl;
});

