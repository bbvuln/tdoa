function calc_rmb(currencyDigits)
{
  // Constants:
  var MAXIMUM_NUMBER = 99999999999.99;
  // Predefine the radix characters and currency symbols for output:
  var CN_ZERO = "零";
  var CN_ONE = "壹";
  var CN_TWO = "贰";
  var CN_THREE = "叁";
  var CN_FOUR = "肆";
  var CN_FIVE = "伍";
  var CN_SIX = "陆";
  var CN_SEVEN = "柒";
  var CN_EIGHT = "捌";
  var CN_NINE = "玖";
  var CN_TEN = "拾";
  var CN_HUNDRED = "佰";
  var CN_THOUSAND = "仟";
  var CN_TEN_THOUSAND = "万";
  var CN_HUNDRED_MILLION = "亿";
  var CN_DOLLAR = "元";
  var CN_TEN_CENT = "角";
  var CN_CENT = "分";
  var CN_INTEGER = "整";
   // if(currencyDigits < 0){
	// 	return "";
   // }

  // Variables:
  var integral; // Represent integral part of digit number.
  var decimal; // Represent decimal part of digit number.
  var outputCharacters; // The output result.
  var parts;
  var digits, radices, bigRadices, decimals;
  var zeroCount;
  var i, p, d;
  var quotient, modulus;

  // Validate input string:
  currencyDigits = currencyDigits.toString();
  if (currencyDigits == "") {
     return "";
  }
  if (currencyDigits.match(/[^,-.\d]/) != null) {
     return "";
  }
  if ((currencyDigits).match(/^[+-]?((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
     return "";
  }

  // Normalize the format of input digits:
  currencyDigits = currencyDigits.replace(/,/g, ""); // Remove comma delimiters.
  currencyDigits = currencyDigits.replace(/^0+/, ""); // Trim zeros at the beginning.
  // Assert the number is not greater than the maximum number.
  if (Number(currencyDigits) > MAXIMUM_NUMBER) {
     return "";
  }

  // Process the coversion from currency digits to characters:
  // Separate integral and decimal parts before processing coversion:
  parts = currencyDigits.split(".");
  if (parts.length > 1) {
     integral = parts[0];
     decimal = parts[1];
     // Cut down redundant decimal digits that are after the second.
    if(decimal.length > 2)
	{
		var RoundingNum = decimal.substr(2,1);
		decimal = decimal.substr(0, 2);
		if(RoundingNum > 4)
		{
			decimal = parseInt(decimal) + 1;
			decimal = decimal.toString();
		}
	}else
	{
		decimal = decimal.substr(0, 2);
	}
  }
  else {
     integral = parts[0];
     decimal = "";
  }
  // Prepare the characters corresponding to the digits:
  digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
  radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
  bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
  decimals = new Array(CN_TEN_CENT, CN_CENT);
  // Start processing:
  outputCharacters = "";
  // Process integral part if it is larger than 0:
  if (Number(integral) > 0) {
     zeroCount = 0;
     for (i = 0; i < integral.length; i++) {
         p = integral.length - i - 1;
         d = integral.substr(i, 1);
         quotient = p / 4;
         modulus = p % 4;
         if (d == "0") {
            zeroCount++;
         }
         else
         {
            if (zeroCount > 0)
            {
               outputCharacters += digits[0];
            }
            zeroCount = 0;
            outputCharacters += digits[Number(d)] + radices[modulus];
         }
         if (modulus == 0 && zeroCount < 4) {
            outputCharacters += bigRadices[quotient];
         }
     }
     outputCharacters += CN_DOLLAR;
  }else if (Number(integral) < 0) {
      var _integral=integral.split('-');
      integral = _integral[1];
      zeroCount = 0;
      for (i = 0; i < integral.length; i++) {
          p = integral.length - i - 1;
          d = integral.substr(i, 1);
          quotient = p / 4;
          modulus = p % 4;
          if (d == "0") {
             zeroCount++;
          }
          else
          {
             if (zeroCount > 0)
             {
                outputCharacters += digits[0];
             }
             zeroCount = 0;
             outputCharacters += digits[Number(d)] + radices[modulus];
          }
          if (modulus == 0 && zeroCount < 4) {
             outputCharacters += bigRadices[quotient];
          }
      }
      outputCharacters += CN_DOLLAR;
      outputCharacters = '负'+ outputCharacters;
   }
	// Process decimal part if there is:
	if (decimal != "" && decimal.match(/^0{2}$/) == null) {
		 for (i = 0; i < decimal.length; i++) {
			  d = decimal.substr(i, 1);
			  //d_next = decimal.substr(i+1,1);
			  // if (d != "0") {
			if (d != "0" && d != undefined) {
			 //if (d_next != "0" && d_next != undefined) {
				if (d != "0") {
					outputCharacters += digits[Number(d)] + decimals[i];
				} else {
					outputCharacters += digits[Number(d)];
				}
			}
		 }
	}
  // Confirm and return the final output string:
  if (outputCharacters == "") {
      outputCharacters = CN_ZERO + CN_DOLLAR;
  }
  if (decimal == "") {
      outputCharacters += CN_INTEGER;
  }
  //outputCharacters = CN_SYMBOL + outputCharacters;
  return outputCharacters;
}
function calc_max()
{
	if(arguments.length==0)
	  return;
	var max_num=arguments[0];
	for(var i=0;i<arguments.length;i++){
		max_num=Math.max(max_num,arguments[i]);
	}
	return parseFloat(max_num);
}
function calc_min()
{
	if(arguments.length==0)
	  return;
	var min_num=arguments[0];
	for(var i=0;i<arguments.length;i++){
		min_num=Math.min(min_num,arguments[i]);
	}
	return parseFloat(min_num);
}
function calc_mod()
{
	if(arguments.length==0)
		return;
	var first_num=arguments[0];
	var second_num=arguments[1];
	var result = first_num % second_num;
	result = isNaN(result)?"":parseFloat(result);
	return result;
}
function calc_abs(val)
{
  return Math.abs(parseFloat(val));
}
function calc_avg()
{
    if(arguments.length==0)
	    return;
	var sum = 0;
	for(var i = 0; i < arguments.length; i++){
	    sum+=parseFloat(arguments[i]);
	}
	return parseFloat(sum/arguments.length);
}
function calc_day(val)
{
	return val==0?0:Math.floor(val/86400);
}

function calc_hour(val)
{
	return val==0?0:Math.floor(val/3600);
}

function calc_date(val)
{
    return (val>=0) ? Math.floor(val/86400)+"天"+Math.floor((val%86400)/3600)+"小时"+Math.floor((val%3600)/60)+"分"+Math.floor(val%60)+"秒":"日期格式无效";//'日期格式无效'
}

function calc_getval(val)
{
    var obj = document.getElementsByName(val);

    if(obj.length==0)
        return 0;

    if(obj[0].className == 'LIST_VIEW')
    {
        return document.getElementById("list-wrapper"+val);
    }
	var vVal = obj[0].value || obj[0].innerHTML;
    if($.trim(vVal) != ''){
        var dateFormat = $(obj[0]).siblings("img[value='"+obj[0].title+"']").attr('date_format');
        var is_dateCtrl = $(obj[0]).siblings("is_dateCtrl[value='"+obj[0].title+"']")[0];
        if(typeof(dateFormat) != "undefined")
        {
            // 将时间格式化为统一格式 DJ 14/10/8
            vVal = F_Date_format(vVal, dateFormat);
        }
        else if(typeof(is_dateCtrl) != "undefined")
        {
            var dateFormat = $(obj[0]).siblings("is_dateCtrl[value='"+obj[0].title+"']").attr('date_format');
            // 将时间格式化为统一格式 DJ 14/10/8
            vVal = F_Date_format(vVal, dateFormat);
        }
    }
    //判断是否为时间
	if(vVal.indexOf("-")>0)
	{

	  //eval("date_flag_"+flag+"=1");
	  vVal=vVal.replace(/\-/g,"/");
	  var d=new Date(vVal);
	  return d.getTime()/1000;
	}else if (/^[0-9]{2}:[0-9]{2}:[0-9]{2}$/.test(vVal)) {
        var currYearMD = (new Date()).toLocaleDateString();
        var currHour = currYearMD+" "+vVal;
        var hd=new Date(currHour);
        return hd.getTime()/1000;
    }else if(vVal.indexOf("%")>0){ //处理%
		 vVal = parseFloat(vVal)/100;
	}else if(vVal.indexOf(" ")>=0){
		obj[0].value = obj[0].value.replace(/\s+/g,"");
		vVal = obj[0].value;
	}else if(is_ths(vVal)){
		vVal = calc_ths_rev(vVal);
	}else if(vVal.indexOf("|")>0){
		vVal = vVal.split("|")[0];
	}else if(vVal=="" || isNaN(vVal)){
        vVal=0;
	}
    return parseFloat(vVal);
}


function is_ths(val){
	if(isNaN(val) && !isNaN(calc_ths_rev(val))){
		return true;
	}
	return false;
}

function calc_ths_rev(val){
	if(typeof val == "string"){
		return val.replace(/,/gi,'');
	}else{
		return false;
	}
}

function calc_ths(val){
	if(isNaN(val)){return 0;}
	var re=/\d{1,3}(?=(\d{3})+$)/g;
	var n=val.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){
		return s1.replace(re,"$&,")+s2;
	});
	return n;
}

function calc_DATA(rule, reminder, type){
    //var pattern = /^\w+\((.+)\)$/;
    //var cal_rule = pattern.exec(rule)[1];

    var myvalue= "";
    //修复计算时间公式中有其它加减乘除，例如"100+DAY(日期1-日期2)"
    if(type == "date"){
        try {
            var pattern = /DATE\((.*?)\)/gi;
            var cal_rule_arr = pattern.exec(rule);
            myvalue=eval("calc_date("+cal_rule_arr[1]+")");
        } catch (error) {
            console.log(error);
        }

    }else if(type == "day"){
        try {
            var pattern = /DAY\((.*?)\)/gi;
            var cal_rule_arr = pattern.exec(rule);
            myvalue=eval("calc_day("+cal_rule_arr[1]+")");
            myvalue=eval(rule.replace(cal_rule_arr[0],myvalue));
        } catch (error) {
            console.log(error);
        }

    }else if(type == "hour"){
        try {
             var pattern = /HOUR\((.*?)\)/gi;
            var cal_rule_arr = pattern.exec(rule);
            var temp ;
            temp =  math.eval(cal_rule_arr[1]);
            myvalue=eval("calc_hour("+temp+")");
            myvalue=eval(rule.replace(cal_rule_arr[0],myvalue));
            // var pattern = /HOUR\((.*?)\)/gi;
            // var cal_rule_arr = pattern.exec(rule);
            // myvalue=eval("calc_hour("+cal_rule_arr[1]+")");
            // myvalue=eval(rule.replace(cal_rule_arr[0],myvalue));

        } catch (error) {
            console.log(error);
        }

    }
    //myvalue=eval(rule.replace(pattern.exec(rule)[0],myvalue));
    var prec = reminder === '' ? 4 : reminder;
    var vPrec;
    if(!prec){
        vPrec=10000;
    }else{
        vPrec=Math.pow(10,prec);
    }
    var ret = "";
    if(!isNaN(myvalue) && myvalue != Infinity) {
        var result = new Number(parseFloat(Math.round(myvalue*vPrec)/vPrec));
        //ret = result.toFixed(prec);
		ret = math.round(result,parseInt(prec));
    }else if(is_ths(myvalue)){
        var result = new Number(parseFloat(Math.round(calc_ths_rev(myvalue)*vPrec)/vPrec));
        //ret = calc_ths(result.toFixed(prec));
		ret = calc_ths(math.round(result,parseInt(prec)));
    }else{
        var vzieo = (isNaN(myvalue) && typeof myvalue == "string") ? myvalue : 0;
        if(vzieo == 0){
            //vzieo = vzieo.toFixed(prec);
			vzieo = math.round(vzieo,parseInt(prec))
        }
        ret = vzieo;
    }
    return ret;
}


function calc_list(olist,col)
{
	if(!olist)
      return 0;
    if(!col)
      return 0;
	//console.log(olist, col)
	var listname = olist.getAttribute('data-title');//指定列表控件
	var listcol = col;//指定列
	var list_instance = fieldManager.fieldsInstance[listname];
	//取指定列表控件指定列的合计值
	if(list_instance.list != undefined){
		var res = list_instance.list.getColSum(listcol);
		return res;
	}
}

function match_Rule(regStr) {
    var c;
    var specialArr = ['THS(','LIST(','DATE(','HOUR(','DAY(','RMB('];
    for(var l = 0 ;l<specialArr.length;l++){
		if(regStr.indexOf(specialArr[l]) != -1 ){
            replaceStr = specialArr[l];
			regStr = regStr.replace(replaceStr,'');
            c = match_allArr(regStr);
            if(!c){return false}
        }
	}
    return true;
}

function match_allArr(regStr1){
    var allArr = ['MAX(','MIN(','ABS(','MOD(','AVG(','THS(','LIST(','DATE(','HOUR(','DAY(','RMB('];
    for(var k = 0 ;k<allArr.length;k++){
        if(regStr1.indexOf(allArr[k]) != -1){
            return false;
        }
    }
    return true;
}

define('TCalcCtrl', function(require, exports, module){
    var $ = window.$ || window.Zepto;
    var Base = require('base');
    var Math = require('math');
	//fix math.round NaN抛异常
    math.__round = math.round;
    math.round = function(a, b){
        try{
            return math.__round(a, b);
        }catch(e){
            return isNaN(a) ? 0 : a;
        }
    };
    var TCalcCtrl = Base.extend({
        initialize: function(config) {
            TCalcCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.title = config.title;
            this.$config = config;
            this.id = config.id;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            //this.desc = config.desc;
            this.desc = config.desc = '请填写内容！';
            this.initField(config);
            //this.initCalc();
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	self.$wrapper.append(html);
        },
		parseHtml: function(cfg){
            low_id = this.low_id;
			var tplHTML = '<% if(secret){ %>'+
						  '<% }else{ %>'+
						  	'<div class="read_detail '+
						  	    '<% if(hidden!=undefined && hidden==true){ %>'+
								' hidden '+
								'<% } %>'+
						  	    ' tag-calc">'+
						  		'<% if(required){ %>'+
									'<span class="isrequired">*</span>'+
								'<% } %>'+
						  	'<em><%=title%>：</em><div class="field"><span rule="<%=rule%>" title="<%=title%>" name="<%=id%>"><%=value%></span><div class="thsTip"></div><div class="rmbTip"></div></div></div>'+
						  '<% } %>'+'<div class="div_alert div_alert_hidden" id="div_alert_<%=low_id%>"></div>';
			return $.tpl(tplHTML,cfg);
		},
		initCalc: function(){
			//计算公式类似“(单行+多行)*下拉”，且可包含特定计算函数，类似 MAX(单行,多行)+下拉
			var self = this,
				cfg  = self.$config,
				rule = cfg.rule,
				reminder  = 4,
				instances = self.$config.fieldmanager.fieldsInstance;
			reminder = cfg.to_fixed;
			var arr = [];
			//var pattern = /([^\(\)\+\-\*\/,\^(MAX)(MIN)(ABS)(MOD)(AVG)(RMB)(DAY)(HOUR)(DATE)(LIST)(HTS)]+)/g;
            var pattern = /\[([^\]]+)\]/g;
            if(rule==""){

            }else{
                //arr = rule.match(pattern);
                rule.replace(pattern,function(){
			 	arr.push(arguments[1]);//扫描公式，提取待计算项的title
			});
                arr = $.map(arr, function(item){
                    if(instances[item] != undefined){
                        return item;
                    }
                });
                //扫描待计算项，找到对应控件实例并给其绑计算事件
                $.each(arr, function(k, v){
                    var obj = instances[v];
                    if(obj.$config.secret || obj.$config.ishidden || obj.$config.unCalc){
                        //保密、隐藏以及不参与计算的的字段（即unCalc值为true的控件）除外
                    }else{
                        obj.bindCalc();
                    }
                });
                cfg.fieldmanager.on('calc', function(){
                    self.calc();
                });
            }

		},
		calc: function(){
			var self      = this,
				calValue  = this.$config.calValue,
                instances = this.$config.fieldmanager.fieldsInstance,
                rule      = this.$config.rule,
                result    = this.$config.title,
                reminder  = this.$config.to_fixed,
                arr       = [];//存放匹配运算符以及括号等之后的数值
            var pattern = /\[([^\]]+)\]/g;
            if(rule){
               rule.replace(pattern,function(){
			 	    arr.push(arguments[1]);//扫描公式，提取待计算项的title
			    });
                arr = $.map(arr, function(item){
                    if(instances[item] != undefined){
                        return item;
                    }
                });
                arr.sort();
                arr.reverse();
                $.each(arr, function(m, n){
                    $.each(instances, function(k, v){
                        if(v.title == n){
                            var re = new RegExp("\\["+n+"\\]","ig");
                            var calv = 0;
                            if(v.$config.secret || v.$config.unCalc){
								calv = 0;
                            }else{
                                calv = (v.getValue()=='' ? 0: v.getValue());
                            }
                            //对小数点最后一位进行处理
                            if(calv && calv.indexOf(".") != -1 && calv.indexOf(".") == calv.length-1)
                            {
                                calv = calv.replace(".", "");
                            }
                            //对百分号的处理
                            if(calv && calv.indexOf("%") != -1)
                            {
                                calv.replace("%", "");
                                calv = parseFloat(calv)/100;
                            }
                            rule = rule.replace(re,calv);
                        }
                    })
                })
                instances[result].setValue(rule, reminder, result, calValue);
            }
		},
		bindCalc: function(){
            var self   = this,
                $input = this.getField();
            $input.bind("_calced", function(){
                self.$config.fieldmanager.trigger('calc');
            });
        },
        getField: function(){
            return $('[title="'+ this.$config.title +'"]').eq(0);
        },
        getValue: function(){ return this.getField().text() },
        getData: function(){
            var ret = {};
            ret.name = this.$config.id;
            if(!this.$config.secret){
            	ret.value = this.getValue();
            }
            return ret;
        },
        setValue: function(rule, reminder, title, calValue){
            var title = title;//当前字段名
            var self = this;
			rule = rule.toLowerCase();
			try{
				var res = math.eval(rule);
				var reminder = reminder ? reminder : 4;
				if(res.toString() == "" || res.toString() === "NaN"){
					this.getField().text(parseFloat(0).toFixed(parseFloat(reminder)));
				}else{
					res = isNaN(res) ? res : parseFloat(res).toFixed(parseFloat(reminder));
					this.getField().text(res);
				}
			}catch(e){
				try{
					var res = eval(calValue);
					var reminder = reminder ? reminder : 4;
					if(res.toString() == "" || res.toString() === "NaN"){
						this.getField().text(parseFloat(0).toFixed(parseFloat(reminder)));
					}else{
						res = isNaN(res) ? res : parseFloat(res).toFixed(parseFloat(reminder));
						this.getField().text(res);
					}
				}
				catch(e){
					if(this.$config.writable){
						this.cancelAlert('公式填写错误！');
					}
				}
			}
        },
        onSubmit: function() {
            var obj_val = this.getValue();
            var required_val = this.required;
            var low_id = this.low_id;
            if((obj_val == '' || obj_val == null || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    $("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },
        cancelAlert: function(s){
            var self = this;
            var low_id = this.low_id;
            var str = s;
            self.validation(str);
            setTimeout(function(){
                $("#div_alert_"+low_id+"").removeClass("div_alert_show");
            }, 1000);
        },
        validation: function(s) {
            $("#div_alert_"+this.low_id+"").addClass("div_alert_show");
            $("#div_alert_"+this.low_id+"").html(s);
        }
    });
    exports.TCalcCtrl = window.TCalcCtrl = TCalcCtrl;
});
