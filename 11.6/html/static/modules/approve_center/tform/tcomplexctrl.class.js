define('TComplexCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
	var TComplex = require('TComplex');
    var TComplexCtrl = Base.extend({
        initialize: function(config) {
            TComplexCtrl.superclass.initialize.call(this, config);
            this.$obj = $('input[name="COMPLEX_'+config.id+'"]').eq(0);
            this.id = config.id;
            this.dataLayout = config.lay_out;
            this.dataInfo = config.data;
            this.initField();
            this.newComplex(this.dataLayout,this.dataInfo);
            // this.bindCalc();
            // this.bindEvent();
        },
        initField: function() {
            var self = this;
            var html = self.parseHtml(self.id);
            self.$obj.after(html);
        },
        parseHtml: function(id) {
            var tplHTML = '<div><input type="hidden" name='+id+' /><div class="u-complex-wrapper" id='+id+'></div></div>';
            return tplHTML;
        },
        newComplex: function(dataLayout, dataInfo) {
            var self = this;
            // console.log(dataLayout, dataInfo)
            var TComplexManager = TComplex.TComplexManager;
            self.complex = new TComplexManager(self.id, dataLayout, dataInfo);
        },
		//必填字段保存JS处理机制
        onSubmit: function() {
            var self = this;
            var submitFlag = false;
            submitFlag = self.complex.onSubmit();
            if(submitFlag){
                return true;
            }else{
                return false;
            }
        }
    });
    exports.TComplexCtrl = window.TComplexCtrl = TComplexCtrl;
});
