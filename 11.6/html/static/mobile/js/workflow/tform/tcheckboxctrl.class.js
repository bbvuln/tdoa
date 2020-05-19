define('TCheckboxCtrl', function(require, exports, module){
   	var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TCheckboxCtrl = Base.extend({
        initialize: function(config){
            TCheckboxCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);
        	this.$config = config;
        	this.$config.unCalc = true;//不参与计算控件的标识
            this.id = config.id;
            this.title = config.title;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
        },
		parseHtml: function(d){
			var tplHTML = '<% if(secret){ %>'+
						  '<% } else{ %>'+
						  '<div class="read_detail '+
						    '<% if(hidden!=undefined && hidden==true){ %>'+
								' hidden '+
							'<% } %>'+
						  	'<% if(writable){ %>'+
						  		'WriteDiv'+
						  	'<% } else{ %>'+
						  	 	'unWriteDiv'+
						  	'<% } %>'+
						  ' tag-checkbox">'+
						  	 	'<% if(required){ %>'+
						  	 		'<span class="isrequired">*</span>'+
						  	 	'<% } %>'+
						  '<em><%=title%>:</em><div class="field checkWrapper">'+
						  		'<% for(var i=0;i<options.length;i++){ %>'+
									'<div class=" ui-form-item ui-form-item-checkbox '+
									
									'<% for(var k=0;k<value.length;k++){ %>'+
								  	 			'<% if(value[k] == options[i]){ %>'+
									  	 		'textchecked '+
									  	 		'<% } %>'+
								  	 		'<% } %>'+
								  	 		
									'"><label class="ui-checkbox-s" for="tcbx_<%=lower_name%>_<%=i%>">'+
		                            	'<input id="tcbx_<%=lower_name%>_<%=i%>" type="checkbox" title="<%=title%>" name="<%=id%>" value="<%=options[i]%>" '+
				                            '<% if(!writable){ %>'+
								  	 		'disabled '+
								  	 		'<% } %>'+
								  	 		'<% for(var j=0;j<value.length;j++){ %>'+
								  	 			'<% if(value[j] == options[i]){ %>'+
									  	 		'checked '+
									  	 		'<% } %>'+
								  	 		'<% } %>'+
			                            ' />'+
		                       	 	'</label>'+
		                        	'<p><%=options[i]%></p></div>'+
							  	'<% } %>'+
						  '</div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	  '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
		},
		bindCalc: function(){
            var self   = this,
                $field = self.getField();
            if(self.$config.writable == true){
                $field.find('.ui-checkbox-s').each(function(){
                    var $this = $(this);
                    $this.on('tap click _calced', function(event){
                        setTimeout(function(){ 
                        	self.$config.fieldmanager.trigger('calc');
                        },100);
                    });
                }); 
            }else{
                $field.on('_calced', function(event){ 
                	 self.$config.fieldmanager.trigger('calc');
                });
            } 
        },
        getField: function(){ 
            return $('[title="'+ this.$config.title +'"]').parents('.checkWrapper').eq(0);
        },
        getValue: function(){
            var cvalue = 0;
            this.getField().find('input[type="checkbox"]:checked').each(function(){
            	var $this = $(this);
                var val = $this.parent('label').next('p').text();
                cvalue += parseFloat(val);
            });
            cvalue = cvalue.toString();
            return cvalue;
        },
        getValueString: function(){
            var cvalue = "";
//            this.getField().find('input[type="checkbox"]:checked').each(function(){
//            	var $this = $(this);
//                var val = $this.parent('label').next('p').text();
//                cvalue += val+',';
//            });
            cvalue = this.getField().find('input[type="checkbox"]').attr("checked");
            if(cvalue){
                return "on";
            }else{
                return "";
            }
        },
        getData: function(){
            var ret = {};
            ret.name = this.$config.id;
            if(!this.$config.secret){
            	ret.value = this.getValueString();  
            }
            return ret;
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
        onSubmit: function(){
            var obj_val = this.getValueString(),
                required_val = this.required,
                low_id = this.low_id;
            if((obj_val === "" || obj_val == 0 || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    $("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },
        
        validation: function(desc){
            $("#div_alert_"+this.low_id+"").addClass("div_alert_show");
        }
    });
    exports.TCheckboxCtrl = window.TCheckboxCtrl = TCheckboxCtrl;
});