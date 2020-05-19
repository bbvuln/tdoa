define('TOrgSelectCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TOrgSelectCtrl = Base.extend({

        initialize: function(config) {
            TOrgSelectCtrl.superclass.initialize.call(this, config);
            this.$config = config;
            this.$input = $('input[name=DATA_' + config.item_id +']').eq(0);
            this.$img = $('img[title="'+config.title+'"]').eq(0);
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            
            this.$img.click(function(){
                if(self.$config.select_type == '1')
                {
                    SelectUser('5', '', "USER_"+self.$config.item_id, "DATA_"+self.$config.item_id);
                }
                else if(self.$config.select_type == '2')
                {
                    SelectDept('', "DEPT_"+self.$config.item_id, "DATA_"+self.$config.item_id);
                }
            });
        }
    });
    exports.TOrgSelectCtrl = window.TOrgSelectCtrl = TOrgSelectCtrl;
});

