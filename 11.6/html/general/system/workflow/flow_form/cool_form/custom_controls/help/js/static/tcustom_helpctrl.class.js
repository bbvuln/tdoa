define('TCUSTOM_HELPCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCUSTOM_HELPCtrl = Base.extend({

        initialize: function(config) {
            TCUSTOM_HELPCtrl.superclass.initialize.call(this, config);
            this.$obj = $('img[name="'+config.id+'"]').eq(0);
            this.$content = $('#'+config.content_id);
            this.bindEvent(config);
        },
        bindEvent: function(config) {
            var self = this;
            this.$obj.mouseenter(function(){
                self.$content.css("display","block");
            });
            
            this.$obj.mouseleave(function(){
                self.$content.css("display","none");
            });
        }

    });
    exports.TCUSTOM_HELPCtrl = window.TCUSTOM_HELPCtrl = TCUSTOM_HELPCtrl;
});

