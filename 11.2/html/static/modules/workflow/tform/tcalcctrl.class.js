define('TCalcCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TCalcCtrl = Base.extend({

        initialize: function(config) {
            TCalcCtrl.superclass.initialize.call(this, config);
            this.$input = $('input[name=' + config.id +']').eq(0);  
            this.bindcalc(config);
        },
        //console.log(toFixed);
        bindcalc: function(config) {
            var $input = this.$input;
            var prec=$('[name=' + config.id + ']').attr('prec');
            var func = function(){ 
            	var myvalue=eval(config.calValue);           	      	
		    	var vPrec;
	            if(!prec){
	                vPrec=10000;
	            }else{
	                vPrec=Math.pow(10,prec);
	            }
	            
	            if(!isNaN(myvalue) && myvalue != Infinity) {     
					if(myvalue < 0)//如果这个值小于0
					{
						myvalue = Math.abs(myvalue);//取 myvalue 绝对值
						var result = new Number(parseFloat(Math.round(myvalue*vPrec)/vPrec));// myvalue * vPrec / vPrec 
						result = result.toFixed(prec)
						$input.val(-result);//把负号加上去 
					}else{
						var result = new Number(parseFloat(Math.round(myvalue*vPrec)/vPrec));
						$input.val(result.toFixed(prec));
					}
	            }else if(is_ths(myvalue)){//function is_ths(val){if(isNaN(val) && !isNaN(calc_ths_rev(val))){return true;}return false;}
	                //function calc_ths_rev(val){if(typeof val == "string"){return val.replace(/,/gi,'');}else{return false;}}
					var result = new Number(parseFloat(Math.round(calc_ths_rev(myvalue)*vPrec)/vPrec));
	                var results = calc_ths(result.toFixed(prec));
	                $input.val(results);
	            }else{
	                var vzieo = (isNaN(myvalue) && typeof myvalue == "string") ? myvalue : 0;
	                if(vzieo == 0){
	                    vzieo = vzieo.toFixed(prec);
	                }
	                $input.val(vzieo);
	            }
		       
		       var func = arguments.callee; 
		       setTimeout(func, 500); 
		    };  
		    func();
        }

    });
    exports.TCalcCtrl = window.TCalcCtrl = TCalcCtrl;
});