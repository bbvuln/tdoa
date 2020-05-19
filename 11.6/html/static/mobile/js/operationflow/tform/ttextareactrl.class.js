define('TTextareaCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TTextareaCtrl = Base.extend({

        initialize: function(config) {
            TTextareaCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config); 
        },
		initField: function(config) {
            var self = this;
            if(config.writable){
                config.value = this.lfDecode(config.value);
            }else{
                config.value = config.value.replace(/&lt;br&gt;/g, "<br>");
            }
            var html = self.parseHtml(config);
            this.$wrapper.append(html);
            this.$obj = $('textarea[name="' + config.id + '"]').eq(0);
            this.$config = config;
            this.id = config.id;
            this.title = config.title;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
        },
        lfEncode: function(s){
            s = s.replace(/\r\n/g, '<br>');
            s = s.replace(/\n/g, '<br>');
            return s;
        },
        lfDecode: function(s){
            s = s.replace(/&lt;br&gt;/ig, "\r\n");
            s = s.replace(/<br>/ig, "\r\n");
            return s;
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
						  	 '<% } %>'+
						  	 ' tag-textarea">'+
						  	 '<% if(required){ %>'+
						  	 '<span class="isrequired">*</span>'+
						  	 '<% } %>'+
						  	 '<em><%=title%>£º</em><div class="field">'+
						  	 '<% if(writable && rich == 0){ %>'+
						  	 '<textarea name="<%=id%>" title="<%=title%>" placeholder="<%=placeholder%>"><%=value%></textarea>'+
                             '<% } else if(writable && rich == 1){ %>'+
                             '<span class="span-editable rich-style" contenteditable="true" name="<%=id%>" title="<%=title%>"><%=value%></span>'+
						  	 '<% } else{ %>'+
						  	 '<span class="form-textarea-print rich-style" title="<%=title%>"><%=value%></span>'+
						  	 '<% } %>'+
						  	 '</div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	 '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
		},
		getField: function(){ 
			return $('[title="'+ this.$config.title +'"]').eq(0);
        },
        getValue: function(){ 
        	if(this.$config.writable == true && this.$config.rich == 0){
                return this.lfEncode(this.getField().val());
			}else if(this.$config.rich == 1){
                return this.getField().html();
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
		bindCalc: function(){
			var self   = this,
                $input = this.getField(),
                cfg = this.$config;
            if(cfg.writable == true){
                $input.bind("keyup paste _calced", function(){
                	var flag = self.validate_num();
                    flag && self.$config.fieldmanager.trigger('calc');
                });
            }else{
                $input.bind("_calced", function(){
                	var flag = self.validate_num();
                    flag && self.$config.fieldmanager.trigger('calc');
                });
            }
		},
        onSubmit: function() {
            var obj = this.$obj;
            var objEx = this.$obj;
            var obj_val = obj.val();
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
    exports.TTextareaCtrl = window.TTextareaCtrl = TTextareaCtrl;
});

