define('TCUSTOM_WFPREVIEWCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCUSTOM_WFPREVIEWCtrl = Base.extend({

        initialize: function(config) {
            TCUSTOM_WFPREVIEWCtrl.superclass.initialize.call(this, config);
            this.$input = $('input[title="' + config.value +'"]').eq(0);
            this.$img = $('img[name="'+config.id+'"]').eq(0);
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            this.$img.click(function(){
                var RUN_ID = parseInt(jQuery('input[name="'+$(self.$input).attr('name')+'"]').val());
                if(!RUN_ID){
                    alert("请填写对应的流程流水号");
                    return;
                }
                var tmp_height = jQuery(window.parent.parent) ? jQuery(window.parent.parent.document).height() : jQuery(document).height()
                var configStr = "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width="+(jQuery(document).width()-20)+",height="+tmp_height+",left=-4,top=0";
                window.open('/general/workflow/list/print/?RUN_ID='+RUN_ID, "view_work_"+RUN_ID, configStr);
            });
        }

    });
    exports.TCUSTOM_WFPREVIEWCtrl = window.TCUSTOM_WFPREVIEWCtrl = TCUSTOM_WFPREVIEWCtrl;
});

