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
    return (val>=0) ? Math.floor(val/86400)+"天"+Math.floor((val%86400)/3600)+"小时"+Math.floor((val%3600)/60)+"分":"日期格式无效";//'日期格式无效'
}

function calc_getval(val)
{
    var obj = document.getElementsByName(val);
  
    if(obj.length==0)
        return 0;
    
    if(obj[0].className == 'LIST_VIEW')
    {
        return document.getElementById("LV_"+val.substring(5));
    }
	var vVal = obj[0].value;
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
        var pattern = /DATE\((.*?)\)/gi;
        var cal_rule_arr = pattern.exec(rule);    
        myvalue=eval("calc_date("+cal_rule_arr[1]+")");
    }else if(type == "day"){
        var pattern = /DAY\((.*?)\)/gi;
        var cal_rule_arr = pattern.exec(rule);    
        myvalue=eval("calc_day("+cal_rule_arr[1]+")");
        myvalue=eval(rule.replace(cal_rule_arr[0],myvalue));
    }else if(type == "hour"){
        var pattern = /HOUR\((.*?)\)/gi;
        var cal_rule_arr = pattern.exec(rule);    
        myvalue=eval("calc_hour("+cal_rule_arr[1]+")");
        myvalue=eval(rule.replace(cal_rule_arr[0],myvalue));
        
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
        ret = result.toFixed(prec);
    }else if(is_ths(myvalue)){
        var result = new Number(parseFloat(Math.round(calc_ths_rev(myvalue)*vPrec)/vPrec));
        ret = calc_ths(result.toFixed(prec));
    }else{
        var vzieo = (isNaN(myvalue) && typeof myvalue == "string") ? myvalue : 0;
        if(vzieo == 0){
            vzieo = vzieo.toFixed(prec);
        }
        ret = vzieo;
    }
    return ret;
}

define('TCalcCtrl', function(require, exports, module){
    var $ = window.$ || window.Zepto;
    var Base = require('base');
    var Math = require('math');
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
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	self.$wrapper.append(html);
        },
		parseHtml: function(cfg){
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
						  	'<em><%=title%>：</em><div class="field"><span rule="<%=rule%>" title="<%=title%>"><%=value%></span><div class="thsTip"></div><div class="rmbTip"></div></div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	 '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>'+
						  '<% } %>';
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
			var pattern = /([^\(\)\+\-\*\/,\^(MAX)(MIN)(ABS)(MOD)(AVG)(RMB)(DAY)(HOUR)(DATE)(LIST)(HTS)]+)/g;
            arr = rule.match(pattern);
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
		},
		calc: function(){
			var self      = this,
                instances = this.$config.fieldmanager.fieldsInstance,
                rule      = this.$config.rule,
                result    = this.$config.title,
                reminder  = this.$config.to_fixed,
                arr       = [];//存放匹配运算符以及括号等之后的数值
            var pattern = /([^\(\)\+\-\*\/,\^(MAX)(MIN)(ABS)(MOD)(AVG)(RMB)(DAY)(HOUR)(DATE)(LIST)(HTS)]+)/g;
                arr = rule.match(pattern);
            arr = $.map(arr, function(item){
                if(instances[item] != undefined){
                    return item;
                }
            });
			//var day_pattern = /^DAY\((.*?)\)$/;
			var day_pattern = /DAY\((.*?)\)/;
            //var date_pattern = /^DATE\((.*?)\)$/;
            var date_pattern = /DATE\((.*?)\)/;
            //var hour_pattern = /^HOUR\((.*?)\)$/;
            var hour_pattern = /HOUR\((.*?)\)/;
            var listview_pattern = /^LIST\((.*?)\)$/;
            
            //修正"(单行+单行加多行)"类似的公式替换错误
            arr.sort();
            arr.reverse();
            //console.log(rule);
            $.each(arr, function(m, n){
			    $.each(instances, function(k, v){
				
					if(v.title == n){
						//var re = new RegExp("\\["+n+"\\]","ig");
						var re = new RegExp(n,"ig");
                        var calv = 0;
                        if(v.$config.secret || v.$config.unCalc){
                            if(listview_pattern.test(rule)){
                    		    return false;
                    	    }else{
                    	        calv = 0;
                    	    }
                    	}else{
                    	    //console.log(rule, day_pattern.test(rule));
                    		if(day_pattern.test(rule) || date_pattern.test(rule) || hour_pattern.test(rule)){
                    		    calv = (v.getTimeStamp()=='' ? 0: v.getTimeStamp());
                            }else if(listview_pattern.test(rule)){
                                return false;
                            }else{
                                calv = (v.getValue()=='' ? 0: v.getValue());
                            }
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
			instances[result].setValue(rule, reminder, result);
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
        setValue: function(rule, reminder, title){
            
            var title = title;//当前字段名
            var self = this;
            //var day_pattern = /^DAY\((.*?)\)$/;
            var day_pattern = /DAY\((.*?)\)/;
            //var date_pattern = /^DATE\((.*?)\)$/;
            var date_pattern = /DATE\((.*?)\)/;
            //var hour_pattern = /^HOUR\((.*?)\)$/;
            var hour_pattern = /HOUR\((.*?)\)/;
            var listview_pattern = /^LIST\((.*?)\)$/;
            var ths_pattern = /^THS\((.*?)\)$/;
            var rmb_pattern = /^RMB\((.*?)\)$/;
            var avg_pattern = /^AVG\((.*?)\)$/;
            
            if(day_pattern.test(rule)){//相差天数
                //console.log(rule);
                var res = calc_DATA(rule,reminder,'day');
                this.getField().text(res);
            }else if(date_pattern.test(rule)){//相差天、小时、分
                var res = calc_DATA(rule,reminder,'date');
                this.getField().text(res);
                
            }else if(hour_pattern.test(rule)){//相差小时数
                var res = calc_DATA(rule,reminder,'hour');
                this.getField().text(res);
            }else if(listview_pattern.test(rule)){//列表控件
                var res = self.calcListView(rule);
                this.getField().text(res);
            }else if(ths_pattern.test(rule)){//货币千分位
                 rule = rule.substring(3,rule.length);
                 rule = rule.toLowerCase();
                 try{
                    var res = math.eval(rule);
                    if(reminder !== ""){
                        if(res!=undefined){
                            res = res.toFixed(reminder);    
                        }
                    }else{
                        if(res!=undefined){
                            res = res.toFixed(4);
                        }
                    }
                    // var $this = this.getField();
                    var thsval = self.transThs(res);
                    this.getField().text(thsval);
                    // $this.parents('.read_detail').find('.thsTip').html('货币千分位：' + thsval);
                }catch(e){
                    alert(title+'公式填写错误！');
                }
            }else if(rmb_pattern.test(rule)){//人民币
                rule = rule.substring(3,rule.length);
                rule = rule.toLowerCase();
                try{
                    var res = math.eval(rule);    
                    if(reminder !== ""){
                        if(res!=undefined){
                            res = res.toFixed(reminder);    
                        }
                    }else{
                        if(res!=undefined){
                            res = res.toFixed(4);
                        }
                    }
                    // var $this = this.getField();
                    var rmbval = self.transRmb(res);
                    this.getField().text(rmbval);
                    // $this.parents('.read_detail').find('.rmbTip').html('大写：' + rmbval);
                }catch(e){
                    alert(title+'公式填写错误！');
                }
                
            //}else if(avg_pattern.test(rule)){
            }else if(rule.indexOf("AVG") != -1){
                rule = rule.replace(/\AVG/g, "MEAN");
                rule = rule.toLowerCase();
                try{
                    var res = math.eval(rule);
                    if(reminder !== ""){
                        if(res!=undefined){
                            res = res.toFixed(reminder);    
                        }
                    }else{
                        if(res!=undefined){
                            res = res.toFixed(4);
                        }
                    }
                    this.getField().text(res);
                }catch(e){
                    alert(title+'公式填写错误！');
                }
            }else{
                rule = rule.toLowerCase();
                //console.log(rule);
                try{
                    var res = math.eval(rule);
                    if(reminder !== ""){
                        if(res!=undefined){
                            res = res.toFixed(reminder);    
                        }
                    }else{
                        if(res!=undefined){
                            res = res.toFixed(4);
                        }
                    }
                    this.getField().text(res);
                }catch(e){
                    alert(title+'公式填写错误！');
                }
            }
        },
        transThs: function(val){
            if(isNaN(val)){return 0;}
        	var re=/\d{1,3}(?=(\d{3})+$)/g;
        	var n = val.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){
        		return s1.replace(re,"$&,")+s2;
        	});
        	return n;
        },
        transRmb: function(val){
            if(val != ""){
                val = parseFloat(val).toFixed(2);
            }
            val = numtoCL.toMoney(val);
            return val;
        },
        calcListView: function(rule){
            var self = this;
            var pattern = /^\w+\((.+)\)$/;
            var rule = pattern.exec(rule)[1];
            var ruleArr =  rule.split(',');
            var listname = ruleArr[0];//指定列表控件
            var listcol = ruleArr[1];//指定列
            var list_instance = self.$config.fieldmanager.fieldsInstance[listname];
            //取指定列表控件指定列的合计值
            if(list_instance.list != undefined){
                var res = list_instance.list.getColSum(listcol);
                return res;    
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
        
        validation: function(s) {
            $("#div_alert_"+this.low_id+"").addClass("div_alert_show");
        }
    });
    exports.TCalcCtrl = window.TCalcCtrl = TCalcCtrl;
});