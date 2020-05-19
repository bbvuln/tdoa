define('TCalendarCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCalendarCtrl = Base.extend({

        initialize: function(config) {
            TCalendarCtrl.superclass.initialize.call(this, config);
            this.$input = $('input[title="' + config.value +'"]').eq(0); //日历控件和单行输入框的绑定是依靠控件名称也就是text的title来绑定的.
            this.$img = $('img[value="' + config.value + '"]').eq(0);//日历控件的value和单行的title绑定来实现回填--yzx
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this,
            date_format = this.$img.attr("date_format") || "yyyy-MM-dd";
            this.$img.click(function(){
                WdatePicker({ dateFmt:date_format, el: self.$input.get(0) });
            });
        }

    });
    exports.TCalendarCtrl = window.TCalendarCtrl = TCalendarCtrl;
});

