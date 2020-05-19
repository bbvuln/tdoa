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
			this.writable = config.writable;
        },
        initField: function(config){
			var self = this;
			self.id = config.id;
			this.writable = config.writable;
			self.datatype = config.dataStyle;
			self.format = config.dataformat.replace(/y/g,'Y');
			if(config.dataformat.indexOf("MMMM")  == -1 )
			{
				self.format = self.format.replace(/MMM/g,'MMMM');
			}
      var html = self.parseHtml(config);
      this.$wrapper.append(html);
			this.$input = $('input[name="' + config.id +'"]').eq(0);
			this.$input.attr({"data-type":this.datatype});
			this.$input.attr({"data-format":this.format});
      this.bindEvent();
		},
        parseHtml: function(d){
        	var self = this;
        	if(d.secret) return;
        	var tplHTML = '';
        	if(d.ishidden){
        		tplHTML = '<input value="<%=value%>" type="hidden" name="<%=id%>" align="left" hidden="1" title="<%=title%>">';
        	}else{
	        	    tplHTML = '<div class="read_detail '+
	        				   '<% if(writable){ %>'+
        					   'WriteDiv'+
        					   '<% } %>'+
	        				   ' tag-calendar">'+
	        				   '<% if(required){ %>'+
							   '<span class="isrequired">*</span>'+
							   '<% } %>'+
							   '<em><%=title%>：</em>'+
	        				 	 	'<% if(writable){ %>'+
                                       '<input type="text"  name="<%=id%>" title="<%=title%>" value="<%=value%>" id="time_<%=id%>" />'+
                                    '<% }else{ %>'+
										'<span title="<%=title%>" name="<%=id%>"><%=value%></span>'+
									'<% } %>'+
	        				  '</div>';
	        	// }
        	}
        	if(d.required){
				tplHTML += '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>';
			};
        	return $.tpl(tplHTML,d);
        },
        bindEvent: function(){
			var calendar = new datePicker();
            var self  = this;
			var now = new Date();
			this.$input.attr("readonly","true");
			var inputId = 'time_'+this.id;
			var format = this.$input.attr('data-format');
			var timetype = this.datatype;
			if(this.writable){
				calendar.init({
					'trigger': '#'+ inputId, /*按钮选择器，用于触发弹出插件*/
					'type': timetype,/*模式：date日期；datetime日期时间；time时间；ym年月；yyyy年;*/
					'minDate':'1900-1-1',/*最小日期*/
					'maxDate':'2100-12-31',/*最大日期*/
					'format':format,
					'onSubmit':function(){
						self.bindCalc()
					},
					'onClose':function(){
					}
				});
			}
			
        },
        bindCalc: function(){
            var $input = this.getField(),
                self   = this;
            // $input.bind("keyup _calced change", function(){
				self.$config.fieldmanager.trigger('calc');
            // });
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
		   if(arr.length >= 5){//2016-01-27 15:30：09
		       timestamp = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4],arr[5]);
		       timestamp = timestamp.getTime()/1000;
    		   timestamp = timestamp.toString();
    		   return timestamp;
		   }else if(arr.length == 3){
			   if(arr[0].length>2){//2016-01-27
					timestamp = new Date(arr[0], arr[1]-1, arr[2]);
		       		timestamp = timestamp.getTime()/1000;
    		   		timestamp = timestamp.toString();
			   }else{//16：01：27
					var date = new Date();
					timestamp = new Date(date.getFullYear(), date.getMonth(), date.getDate(), arr[0], arr[1],arr[2]);
		       		timestamp = timestamp.getTime()/1000;
    		   		timestamp = timestamp.toString();
			   }
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
