define('TMobileSignCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TMobileSignCtrl = Base.extend({
        initialize: function(config) {
            TMobileSignCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.title = config.title;
            this.id = config.id;
            this.$config = config;
            this.$config.unCalc = true;
			this.required = config.required;
            this.initField(config);
        },
        initField: function(config){
            var self = this;
            var html = self.parseHtml(config);
            this.$el = $(html);
            //console.log($el);
            this.$wrapper.append(this.$el);
        },
        parseHtml: function(d) {
            var tplHTML = '<% if(secret){ %>'+
						  '<% } else{ %>'+
						  	 '<div class="read_detail '+
						  	 '<% if(hidden!=undefined && hidden==true){ %>'+
								' hidden '+
							 '<% } %>'+
						  	 '<% if(writable){ %>'+
						  	 'WriteDiv'+
						  	 '<% } %>'+
						  	 ' tag-img">'+
						  	 '<% if(required){ %>'+
						  	 '<span class="isrequired">*</span>'+
						  	 '<% } %>'+
						  	 '<em><%=title%>：</em><div class="field">'+


						  	 '<% if(isSign){ %>'+

						  	 '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToShowSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                '<span>查看</span>'+
                             '</span>'+
                             '<% if(writable){ %>'+
                                '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                    '<span>重盖</span>'+
                                '</span>'+
                            '<% } %>'+
                             '<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="goToSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                '<span>盖章</span>'+
                             '</span>'+
							 '<input id="sign_<%=id%>" name="sign_<%=id%>" type="hidden" value=1>'+
						  	 '<% } else{ %>'+

						  	    '<% if(writable){ %>'+

    						  	 '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="goToSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                    '<span>盖章</span>'+
                                 '</span>'+
                                 '<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToShowSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                    '<span>查看</span>'+
                                 '</span>'+
                                 '<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="goToSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                    '<span>重盖</span>'+
                                 '</span>'+

                                '<% } %>'+
								'<input id="sign_<%=id%>" name="sign_<%=id%>" type="hidden" value=0>'+
						  	 '<% } %>'+


						  	 '</div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	 '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
        },
		onSubmit: function() {
			var low_id = this.id;
			var signFlag = jQuery('input[name="sign_'+low_id+'"]').val();
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
    exports.TMobileSignCtrl = window.TMobileSignCtrl = TMobileSignCtrl;
});
