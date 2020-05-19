define('TCalendarCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCalendarCtrl = Base.extend({

        initialize: function(config) {
            TCalendarCtrl.superclass.initialize.call(this, config);
            this.$input = $('input[title="' + config.value +'"]').eq(0); //�����ؼ��͵��������İ��������ؼ�����Ҳ����text��title���󶨵�.
            this.$img = $('img[value="' + config.value + '"]').eq(0);//�����ؼ���value�͵��е�title����ʵ�ֻ���--yzx
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

