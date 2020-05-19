define('TCalendarCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TCalendarCtrl = Base.extend({
        initialize: function(config) {
            TCalendarCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
            this.$config = config;
            //this.$config.unCalc = true;
            this.title = config.title;
            this.id = config.id;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
        },
        initField: function(config){
        	var self = this;
        	self.datatype = config.dataformat;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);
        	this.$input = $('input[name="' + config.id +'"]').eq(0);
            this.bindEvent();
        },
        parseHtml: function(d){
        	var self = this;
        	if(d.secret) return;
        	var tplHTML = '';
        	if(d.ishidden){
        		tplHTML = '<input value="<%=value%>" type="hidden" name="<%=id%>" align="left" hidden="1" title="<%=title%>">';
        	}else{
        		if(self.datatype == "date"){
        			tplHTML = '<div class="read_detail '+
        			            '<% if(hidden){ %>'+
								    ' hidden '+
								'<% } %>'+
        					   '<% if(writable){ %>'+
        					   'WriteDiv'+
        					   '<% } %>'+
        					  ' tag-calendar">'+
        					   '<% if(required){ %>'+
							   '<span class="isrequired">*</span>'+
							   '<% } %>'+
        					  '<em><%=title%>：</em>'+
        					  		'<% if(writable){ %>'+
        					 	 		'<input type="text" name="<%=id%>" title="<%=title%>" data-method="biz.util.datepicker" data-param="{\'format\': \'yyyy-MM-dd\', \'value\': \'<%=value%>\'}" data-action="alert" value="<%=value%>" id="date_<%=id%>" />'+
        					  		'<% }else{ %>'+
										'<span title="<%=title%>"><%=value%></span>'+
									'<% } %>'+
        					  '</div>';
	        	}else if(self.datatype == "datetime"){
	        		tplHTML = '<div class="read_detail '+
	        		            '<% if(hidden){ %>'+
								    'hide'+
								'<% } %>'+
	        				   '<% if(writable){ %>'+
        					   'WriteDiv'+
        					   '<% } %>'+
	        				  ' tag-calendar">'+
	        				  '<% if(required){ %>'+
							   '<span class="isrequired">*</span>'+
							   '<% } %>'+
							   '<em><%=title%>：</em>'+
	        				  		'<% if(writable){ %>'+
	        				  			'<input type="text" name="<%=id%>" title="<%=title%>" data-method="biz.util.datetimepicker" data-param="{\'format\': \'yyyy-MM-dd HH:mm\', \'value\': \'<%=value%>\'}" data-action="alert" value="<%=value%>" id="datetime_<%=id%>" />'+
	        				  		'<% }else{ %>'+
										'<span title="<%=title%>"><%=value%></span>'+
									'<% } %>'+
	        				  '</div>';
	        	}else if(self.datatype == "time"){
	        		tplHTML = '<div class="read_detail '+
	        		            '<% if(hidden!=undefined && hidden==true){ %>'+
								    'hide'+
								'<% } %>'+
	        				   '<% if(writable){ %>'+
        					   'WriteDiv'+
        					   '<% } %>'+
	        				   ' tag-calendar">'+
	        				   '<% if(required){ %>'+
							   '<span class="isrequired">*</span>'+
							   '<% } %>'+
							   '<em><%=title%>：</em>'+
	        				 	 	'<% if(writable){ %>'+
	        				 			'<input type="text" name="<%=id%>" title="<%=title%>" data-method="biz.util.timepicker" data-param="{\'format\': \'HH:mm\', \'value\': \'<%=value%>\'}" data-action="alert" value="<%=value%>" id="time_<%=id%>" />'+
	        						'<% }else{ %>'+
										'<span title="<%=title%>"><%=value%></span>'+
									'<% } %>'+
	        				  '</div>';
	        	}else{
	        	    tplHTML = '<div class="read_detail '+
	        		            '<% if(hidden!=undefined && hidden==true){ %>'+
								    'hide'+
								'<% } %>'+
	        				   '<% if(writable){ %>'+
        					   'WriteDiv'+
        					   '<% } %>'+
	        				   ' tag-calendar">'+
	        				   '<% if(required){ %>'+
							   '<span class="isrequired">*</span>'+
							   '<% } %>'+
							   '<em><%=title%>：</em>'+
	        				 	 	'<% if(writable){ %>'+
	        				 			'<input type="text" name="<%=id%>" title="<%=title%>" value="<%=value%>" id="time_<%=id%>" />'+
	        						'<% }else{ %>'+
										'<span title="<%=title%>"><%=value%></span>'+
									'<% } %>'+
	        				  '</div>';
	        	}
        	}
        	if(d.required){
				tplHTML += '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>';
			};
        	return $.tpl(tplHTML,d);
        },
        bindEvent: function(){
            var self  = this;
			var now = new Date();
            var a = !1;
			this.$input.attr({"data-type":this.datatype});
			if(this.datatype != ""){
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
                            timeFormat: 'HH:ii:ss',
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
        },
        bindCalc: function(){
            var $input = this.getField(),
                self   = this;
            $input.bind("keyup _calced change", function(){
				self.$config.fieldmanager.trigger('calc');
            });
		},
       	getField: function(){
			return $('[title="'+ this.$config.title +'"]').eq(0);
		},
		getValue: function(){ 
			var str = '';
			if(this.$config.writable || this.$config.ishidden){
				str = this.getField().val();
			}else{
				str = this.getField().text();
			}
			return str;
		},
		getTimeStamp: function(type){
		   var val = this.getValue();
		   //修复ios下日期字符串不能转换成日期对象的bug
		   var arr = val.split(/[- :]/);
		   var timestamp = null;
		   if(arr.length >= 5){//2016-01-27 15:30
		       timestamp = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4]);
		       timestamp = timestamp.getTime()/1000;
    		   timestamp = timestamp.toString();
    		   return timestamp;
		   }else if(arr.length == 3){//2016-01-27
		       timestamp = new Date(arr[0], arr[1]-1, arr[2]);
		       timestamp = timestamp.getTime()/1000;
    		   timestamp = timestamp.toString();
    		   return timestamp;
		   }else
		   {
			   return 0;
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
        onSubmit: function(){
            var obj_val = this.getValue();
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
        },
        validation: function(s) {
            $("#div_alert_"+this.low_id+"").addClass("div_alert_show");
        }
    });
    exports.TCalendarCtrl = window.TCalendarCtrl = TCalendarCtrl;
});

