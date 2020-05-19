define('TTextareaCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TTextareaCtrl = Base.extend({

        initialize: function(config) {
            TTextareaCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
            this.bindEvent();
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
            this.$obj = config.rich == 1 ? $('span[name="' + config.id + '"]').eq(0) : $('textarea[name="' + config.id + '"]').eq(0);
            this.$config = config;
            this.id = config.id;
            this.title = config.title;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
			this.rich = config.rich;
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
        setValue: function( title, currValue){
            var title = title;//当前字段名
            var self = this;
            try{
                var res = currValue;
                this.getField().text(res);
            }catch(e){
                try{
                    var res = currValue;
                    this.getField().text(res);
                }
                catch(e){
                    console.log('数据选择控件回填失败！');
                }
            }
        },
		parseHtml: function(d){
			var tplHTML = '<% if(secret){ %>'+
						  '<% } else{ %>'+
						  	 '<div class="read_detail '+
						  	 '<% if(writable){ %>'+
						  	 'WriteDiv'+
						  	 '<% } %>'+
						  	 ' tag-textarea">'+
						  	 '<% if(required){ %>'+
						  	 '<span class="isrequired">*</span>'+
						  	 '<% } %>'+
						  	 '<em><%=title%>：</em><div class="field">'+
						  	 '<% if(writable && rich == 0){ %>'+
						  	 '<textarea name="<%=id%>" title="<%=title%>" placeholder="<%=placeholder%>"><%=value%></textarea>'+
                             '<% } else if(writable && rich == 1){ %>'+
                             '<span class="span-editable rich-style" contenteditable="true" name="<%=id%>" title="<%=title%>"><%=value%></span>'+
						  	 '<% } else{ %>'+
						  	 '<span class="form-textarea-print rich-style" title="<%=title%>" name="<%=id%>"><%=value%></span>'+
						  	 '<% } %>'+
						  	 '</div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	 '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
		},
        bindEvent: function() {
            if(this.$config.dataselect){
                this.$obj.on('focus',function(){
                   // $("#searchDataSelectList").html('');
                   // var term = $('#dataSelectInput').val('');
                   // $("#data_select").animate({ left:0, }, 500, 'ease-out');
                   // currMobileDataSelectedMenu = self.id;
                   // currMobileDataSelectedMenu = self.$config.dataselect;
                    $("#searchDataSelectList").html('');
                    var term = $('#dataSelectInput').val('');
                    $("#dataselectListByMenuInput").val('');
                    pageTo("dataselectListByMenu");
                    currMobileDataSelectedMenu = self.id;
                    goDataSelectionListPanel(currMobileDataSelectedMenu);
		        });
            }
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
                	self.$config.fieldmanager.trigger('calc');
                });
            }else{
                $input.bind("_calced", function(){
                	self.$config.fieldmanager.trigger('calc');
                });
            }
		},
        onSubmit: function() {
            var obj = this.$obj;
            var objEx = this.$obj;
            var rich = this.rich;
            var obj_val = rich == 1 ? obj.text() : obj.val();
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
        },

        setOcrValue:function(data)
        {
          //  if(this.writable)
          //  {
                this.getField().val(data);
           // }

        }

    });
    exports.TTextareaCtrl = window.TTextareaCtrl = TTextareaCtrl;
});
