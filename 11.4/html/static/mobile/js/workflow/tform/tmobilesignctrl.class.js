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
						  	 '<em><%=title%>ё╨</em><div class="field">'+
						  	 
						  	 
						  	 '<% if(isSign){ %>'+

						  	 '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END">'+
                                '<span>ря╦губ</span>'+
                             '</span>'+
                             '<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="goToSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                '<span>╦губ</span>'+
                             '</span>'+
						  	 
						  	 '<% } else{ %>'+
						  	 
						  	    '<% if(writable){ %>'+
						  	    
    						  	 '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="goToSeal(\'<%=check_field%>\', \'<%=id%>\')">'+
                                    '<span>╦губ</span>'+
                                 '</span>'+
                                 '<span style="display:none;" class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END">'+
                                    '<span>ря╦губ</span>'+
                                 '</span>'+
                             
                                '<% } %>'+
						  	 
						  	 '<% } %>'+
						  	 
						  	 
						  	 '</div></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
        }
    });
    exports.TMobileSignCtrl = window.TMobileSignCtrl = TMobileSignCtrl;
});