define('TTextCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TTextCtrl = Base.extend({
        initialize: function(config) {
            
            TTextCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
            this.bindEvent();
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);
        	
        	//this.$obj = $('input[name="'+config.id+'"]').eq(0) || $('span[name="'+config.id+'"]').eq(0);
        	this.$obj = $('[name="'+config.id+'"]').eq(0);
        	
            this.$config = config;
            this.id = config.id;
            this.title = config.title;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
        },
		parseHtml: function(d){
		  var tplHTML = '<% if(secret){ %>'+
			  			'<% }else{ %>'+
				  			'<% if(ishidden){ %>'+
							'<input value="<%=value%>" type="hidden" name="<%=id%>" align="left" hidden="1" title="<%=title%>" validation="<%=validation%>">'+
							'<% }else{ %>'+
								'<div class="read_detail '+	
								'<% if(hidden!=undefined && hidden==true){ %>'+
								' hidden '+
								'<% } %>'+
								'<% if(writable){ %>'+
								'WriteDiv'+
								'<% } %>'+
								' tag-input">'+
								'<% if(required){ %>'+
								'<span class="isrequired">*</span>'+
								'<% } %>'+
								'<em><%=title%>：</em><div class="field">'+
								'<% if(writable){ %>'+
								'<input value="<%=value%>" type="text" name="<%=id%>" align="left" title="<%=title%>" validation="<%=validation%>" placeholder="<%=placeholder%>" maxlength="<%=maxlength%>">'+
								'<% }else{ %>'+
								'<span title="<%=title%>" class="lowcase" name="<%=id%>" validation="<%=validation%>" ><%=value%></span>'+
								'<% } %>'+
								'<div class="typeTip"></div></div></div>'+
							'<% } %>'+
						'<% } %>'+
                        '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>';
        	return $.tpl(tplHTML,d);
		},
		bindEvent: function(){
		    var self = this;
		    //不保密且是人民币类型且已勾选大写
		    if(!this.$config.secret && this.isRmb()==true && this.$config.show_upcase==true){
		        self.showUpcase();
		        this.$obj.on('keyup change blur',function(){
		            self.showUpcase();
		        });
		    }
		    if(!this.$config.secret && this.$config.show_upcase==true){
		        
		        self.showUpcase();
		    }
		    //不保密且是货币类型且已勾选货币
		    if(!this.$config.secret && this.isThs()==true && this.$config.show_ths==true){
		        self.showThs();
		        this.$obj.on('keyup change blur',function(){
		            self.showThs();
		        });
		    }
		},
		isThs: function(){
		    //var obj_val = this.$obj.val();
		    var obj_val = typeof this.$obj.val() != 'undefined' ?  this.$obj.val() : this.$obj.text();
            var validation = this.$obj.attr('validation');
            if(validation)
            {
                var arr = validation.split(";");
                if(arr.length == 2)
                {
                    if(arr[1] == "" || arr[1] == undefined)
                    {
                        var type_arr = arr[0].split(":");
                        var type = type_arr[1];
                    }
                    else
                    {
                        var type_arr = arr[0].split(":");
                        var type = type_arr[1];
                    }
                }
                if(type == "ths"){
                    return true;
                }
            }
		},
		showThs: function(){
		    //var val = this.$obj.val();
		    var val = typeof this.$obj.val() != 'undefined' ?  this.$obj.val() : this.$obj.text();
		    if(isNaN(val)){return 0;}
        	var re=/\d{1,3}(?=(\d{3})+$)/g;
        	var n=val.toString().replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){
        		return s1.replace(re,"$&,")+s2;
        	});
		    this.$obj.parents('.read_detail').find('.typeTip').html('货币千分位：' + n);
		},
		showUpcase: function(){
            var val = typeof this.$obj.val() != 'undefined' ?  this.$obj.val() : this.$obj.text();
            if(val != ""){
                val = parseFloat(val).toFixed(2);
            }
            val = numtoCL.toMoney(val);
            this.$obj.parents('.read_detail').find('.typeTip').html('大写：' + val);
		},
		getField: function(){
			return $('[title="'+ this.$config.title +'"]').eq(0);
		},
		getValue: function(){ 
			if(this.$config.writable == true){
				return this.getField().val();
			}else{
				return this.getField().text();
			}
		},
		getData: function(){
            var ret = {};
            ret.name = this.$config.id; 
            if(!this.$config.secret){
            	ret.value = this.getValue();  
            }
            return ret;
        },
		bindCalc: function(){
			var $input = this.getField(),
                self   = this;
            $input.bind("keyup paste _calced", function(){
                var flag = self.validate_num();
				flag && self.$config.fieldmanager.trigger('calc');
            });
		},
		
		validate_num: function(){
			var str = this.getValue();
			if(str.length == 1 && str == "-"){
				return true;
			};
			if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(\.)?(?:\d+)?%?$/.test(str) && str.length!=0) {
				alert(numverTips); 
				return false;
			}else{
				return true;
			}
       	},
		
        onSubmit: function() {
            //var obj_val = this.$obj.val();
            var obj_val = typeof this.$obj.val() != 'undefined' ? this.$obj.val() : this.$obj.text();
            var required_val = this.required;
            var low_id = this.low_id;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    $("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
            else
            {
                var ret = this.checkType();
                return ret;
            }
        },
        isRmb: function(){
            var obj_val = typeof this.$obj.val() != 'undefined' ? this.$obj.val() : this.$obj.text();
            var validation = this.$obj.attr('validation');
            if(validation)
            {
                var arr = validation.split(";");
                if(arr.length == 2)
                {
                    if(arr[1] == "" || arr[1] == undefined)
                    {
                        var type_arr = arr[0].split(":");
                        var type = type_arr[1];
                    }
                    else
                    {
                        var type_arr = arr[0].split(":");
                        var type = type_arr[1];
                    }
                }
                if(type == "rmb"){
                    return true;
                }
            }
        },
        checkType: function() {
            //var obj_val = this.$obj.val();
            var obj_val = typeof this.$obj.val() != 'undefined' ?  this.$obj.val() : this.$obj.text();
            var check_flag = true;
            var err_msg = '';
            var validation = this.$obj.attr('validation');
            var low_id = this.low_id;
            if(validation)
            {
                var arr = validation.split(";");
                if(arr.length == 1) //只设置了最小长度
                {
                    // var type_arr = arr[0].split(":");
                    var len_arr = arr[0].split(":");
                    // var type = type_arr[1];
                    var len = len_arr[1]; 
                }
                else if(arr.length == 2)
                {
                    if(arr[1] == "" || arr[1] == undefined) //只设置了类型
                    {
                        var type_arr = arr[0].split(":");
                        var type = type_arr[1];
                    }
                    else    //设置了最小长度和类型
                    {
                        var type_arr = arr[0].split(":");
                        var len_arr = arr[1].split(":");
                        var type = type_arr[1];
                        var len = len_arr[1];
                    }
                }
                
                //判断数据类型
                switch(type)
                {
                    case "email":
                        var emailExp = new RegExp("[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\\.[a-zA-Z]{2,4}");
                        if(!obj_val.match(emailExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,形如example@126.com ";//" 格式不符,形如example@126.com"
                        }
                        break;
                    case "int":
                        var intExp = new RegExp("^[0-9]+$");
                        if(!obj_val.match(intExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,应为整数 ";//" 格式不符,应为整数"
                        }
                        break; 
                    case "date":
                        var dateExp = new RegExp("^\\d{4}[\\/-]\\d{1,2}[\\/-]\\d{1,2}$");
                        if(!obj_val.match(dateExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,应为日期类型 ";//" 格式不符,应为日期类型"
                        }
                        break;
                    case "float":
                        var floatExp = new RegExp("^(-?\\d+)(\\.\\d+)?$");   
                        if(!obj_val.match(floatExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,应为浮点数如123.45 ";//" 格式不符,应为浮点数如123.45"
                        }
                        break;               
                    default:
                        break;
                }
                
                //判断数据长度
                if(len!="" && obj_val.length < len)
                {
                    check_flag = false;
                    var msg1 = sprintf("内容长度不应小于%s", len);
                    err_msg += msg1;
                }
            }
            
            if(check_flag === false)
            {
                this.validation(err_msg);
                setTimeout(function(){
                    $("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
            }
            return check_flag;
        },

        validation: function(desc){
            $("#div_alert_"+this.low_id+"").html(desc);
            $("#div_alert_"+this.low_id+"").addClass("div_alert_show");
        }
    });
    exports.TTextCtrl = window.TTextCtrl = TTextCtrl;
});