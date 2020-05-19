define('TCalendarCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCalendarCtrl = Base.extend({//手机端日历控件 by tl
        initialize: function(config) {
            TCalendarCtrl.superclass.initialize.call(this, config);
            this.$input = $('input[title="' + config.value +'"]').eq(0);         
            this.datatype = config.dataformat;
            this.bindEvent();
        },
        bindEvent: function(){
            var self  = this;
			var now = new Date();
            var a = !1;
			this.$input.attr({"data-type":this.datatype});
			this.$input.attr("readonly","true");
            self.$input.focus(function(){
                if(self.$input.attr("data-type") == "date"){
                    $('[data-type="date"]').mobiscroll().date({
                        //minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                        theme: !a ? 'ios7' : 'android-ics light',
                        lang: 'zh',
                        dateFormat: 'yy-mm-dd',
                        display: 'bottom',
                        mode: 'scroller',
                        endYear:2020
                    });
                }
                else if(self.$input.attr("data-type") == "datetime"){
                    $('[data-type="datetime"]').mobiscroll().datetime({
                        //minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                        theme: a ? 'ios7' : 'android-ics light',
                        lang: 'zh',
                        dateFormat: 'yy-mm-dd',
                        display: 'bottom',
                        mode: 'scroller',
                        endYear:2020
                    });
                }
                else if(self.$input.attr("data-type") == "time"){
                    $('[data-type="time"]').mobiscroll().time({
                        theme: a ? 'ios7' : 'android-ics light',
                        lang: 'zh',
                        display: 'bottom',
                        dateFormat: 'hh:mm',
                        mode: 'scroller'
                    });
                }
            });
        }

    });
    exports.TCalendarCtrl = window.TCalendarCtrl = TCalendarCtrl;
});

