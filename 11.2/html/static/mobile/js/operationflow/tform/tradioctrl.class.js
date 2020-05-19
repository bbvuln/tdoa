define('TRadioCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TRadioCtrl = Base.extend({

        initialize: function(config) {
            TRadioCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);
        	this.$config = config;
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
						  	 ' tag-radio">'+
						  	  	'<% if(required){ %>'+
						  	 		'<span class="isrequired">*</span>'+
						  	 	'<% } %>'+
						  	 	'<em><%=title%>£º</em><div class="field radioWrapper">'+
						  	 	'<% for(var i=0;i<options.length;i++){ %>'+
							  	 	'<div class="ui-form-item ui-form-item-radio">'+
				                        '<label class="ui-radio" for="tradio_<%=lower_name%>_<%=i%>">'+
				                            '<input id="tradio_<%=lower_name%>_<%=i%>" type="radio" '+
					                            '<% if(!writable){ %>'+
									  	 		'disabled '+
									  	 		'<% } %>'+
										  	 	'<% if(options[i] == value){ %>'+
										  	 	'checked '+
										  	 	'<% } %>'+
				                            ' title="<%=title%>" name="<%=id%>" value="<%=options[i]%>">'+
				                            '<p class="'+
				                            	'<% if(options[i] == value){ %>'+
										  	 	'textchecked '+
										  	 	'<% } %>'+
				                            '"><%=options[i]%></p>'+
				                        '</label>'+
				                    '</div>'+
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
                $field.find('.ui-radio').each(function(){
                    var $this = $(this);
                    $this.on('tap click _calced', function(event){
                        setTimeout(function(){
                        	var flag = self.validate_num();
                            flag && self.$config.fieldmanager.trigger('calc');
                        },100);
                    });
                });  
            }else{
                $field.on('_calced', function(event){
                	var flag = self.validate_num();
                    flag && self.$config.fieldmanager.trigger('calc');
                });
            }
        },
        getField: function(){ 
        	return $('[title="'+ this.$config.title +'"]').parents('.radioWrapper').eq(0);
        },
        getValue: function(){
        	return $("input[name='"+this.id+"']:checked").next('p').text();
        },
        getData: function(){
            var ret = {};
            ret.name = this.$config.id;
            if(!this.$config.secret){
            	ret.value = this.getValue();  
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
        onSubmit: function() {
            var obj_val = $("input[name='"+this.id+"']:checked").val();
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
            $("#div_alert_" + this.low_id + "").addClass("div_alert_show");
        }
    });
    exports.TRadioCtrl = window.TRadioCtrl = TRadioCtrl;
});

