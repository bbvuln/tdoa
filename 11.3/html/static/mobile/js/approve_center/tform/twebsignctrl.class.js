define('TWebSignCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TWebSignCtrl = Base.extend({
        initialize: function(config) {
            TWebSignCtrl.superclass.initialize.call(this, config);
			this.$wrapper = $("."+config.parentid).find('.group-fields');
			this.$config = config;
			this.$config.unCalc = true;
			this.id = config.id;
			this.required = config.required;
            this.initField(config);
			this.mobile_auth_websign = window.mobile_auth_websign || false;
			this.mobile_auth_websign_code = window.mobile_auth_websign_code || '';
        },
        initField: function(config){
            var self = this;
            var html = self.parseHtml(config);
            this.$el = $(html);
            this.$wrapper.append(this.$el);
        },
        parseHtml: function(d) {
            var tplHTML = '<% if(secret){ %>'+
						  '<% } else{ %>'+
						  	 '<div class="read_detail '+
						  	 '<% if(writable){ %>'+
						  	 'WebDiv'+
						  	 '<% } %>'+
						  	 ' tag-img">'+
						  	 '<% if(required){ %>'+
						  	 '<span class="isrequired">*</span>'+
						  	 '<% } %>'+
						  	 '<em><%=title%>：</em><div class="field">'+
						  	 '<% if(isSign){ %>'+
						  	 /*'<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToShowWebSeal(\'<%=id%>\',\'<%=datafld%>\')">'+
                                '<span>查看</span>'+
                             '</span>'+*/
                             '<% if(writable){ %>'+
								'<%if(sealType == 1 && mobile_auth_websign_code != "" && mobile_auth_websign != false){%>'+
                                '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToWebSeal(\'<%=datafld%>\',\'<%=id%>\',\'<%=name%>\',\'<%=x_level%>\',\'<%=y_vertical%>\')">'+
                                    '<span>重盖</span>'+
                                '</span>'+
								'<%}if(writeType == 1 && mobile_auth_websign_code != "" && mobile_auth_websign != false){%>'+
								'<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_WRITE_END" onclick="getWebWritePage(\'<%=id%>\',\'<%=datafld%>\',\'<%=name%>\',\'<%=lineColor%>\',\'<%=signWidth%>\',\'<%=signHeight%>\',\'<%=x_level%>\',\'<%=y_vertical%>\')">'+
                                    '<span>重写</span>'+
                                '</span>'+
								'<%}%>'+
                            '<% } %>'+
							 '<input id="web_sign_<%=id%>" name="web_sign_<%=id%>" type="hidden" value=1>'+
						  	 '<% } else{ %>'+
						  	    '<% if(writable){ %>'+
								 '<%if(sealType == 1 && mobile_auth_websign_code != "" && mobile_auth_websign != false){%>'+
    						  	 '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="goToWebSeal(\'<%=datafld%>\',\'<%=id%>\',\'<%=name%>\',\'<%=x_level%>\',\'<%=y_vertical%>\')">'+
                                    '<span>盖章</span>'+
                                 '</span>'+
								 '<%}if(writeType == 1 && mobile_auth_websign_code != "" && mobile_auth_websign != false){%>'+
								 '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="getWebWritePage(\'<%=id%>\',\'<%=datafld%>\',\'<%=name%>\',\'<%=lineColor%>\',\'<%=signWidth%>\',\'<%=signHeight%>\',\'<%=x_level%>\',\'<%=y_vertical%>\')">'+
                                    '<span>手写</span>'+
                                 '</span>'+
								 '<%}%>'+
                                 /*'<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToShowWebSeal(\'<%=id%>\',\'<%=datafld%>\')">'+
                                    '<span>查看</span>'+
                                 '</span>'+*/
								 '<%if(sealType == 1 && mobile_auth_websign_code != "" && mobile_auth_websign != false){%>'+
                                 '<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToWebSeal(\'<%=datafld%>\',\'<%=id%>\',\'<%=name%>\',\'<%=x_level%>\',\'<%=y_vertical%>\')">'+
                                    '<span>重盖</span>'+
                                 '</span>'+
								 '<%}if(writeType == 1 && mobile_auth_websign_code != "" && mobile_auth_websign != false){%>'+
								'<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_WRITE_END" onclick="getWebWritePage(\'<%=id%>\',\'<%=datafld%>\',\'<%=name%>\',\'<%=lineColor%>\',\'<%=signWidth%>\',\'<%=signHeight%>\',\'<%=x_level%>\',\'<%=y_vertical%>\')">'+
                                    '<span>重写</span>'+
                                 '</span>'+
								 
								 '<%}} %>'+
								'<input id="web_sign_<%=id%>" name="web_sign_<%=id%>" type="hidden" value=0>'+
						  	 '<% } %>'+
								'<div class="websignlist" id="web_img_<%=id%>" style="text-align:center;">'+
									'<% for(var i=0;i<imgbase64.length;i++){ %>' +
										'<img width="<%=imgbase64[i]["width"]%>px;" height="<%=imgbase64[i]["height"]%>px;" src="data:image/png;base64,<%=imgbase64[i]["data"]%>">'+
									'<%}%>'+
								'</div>'+
						  	 '</div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	 '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
        },
		onSubmit: function() {
			var low_id = this.id;
			var signFlag = jQuery('input[name="web_sign_'+low_id+'"]').val();
			var required_val = this.required;
            if(signFlag == 0 && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    $("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },
        validation: function(s) {
			$("#div_alert_"+this.id+"").addClass("div_alert_show");
        }
    });
    exports.TWebSignCtrl = window.TWebSignCtrl = TWebSignCtrl;
});
