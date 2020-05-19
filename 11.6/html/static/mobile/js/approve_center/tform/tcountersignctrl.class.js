define('TCounterSignCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TCounterSignCtrl = Base.extend({
        initialize: function(config) {
            TCounterSignCtrl.superclass.initialize.call(this, config);
            this.$wrapper =  $("."+config.parentid).find('.group-fields');
            this.initField(config);

            this.bindEvent();
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseWrapperHtml(config);
        	this.$wrapper.append(html);
            self.renderInputWrapper(config);
            self.renderShowWrapper(config);
        	// this.$obj = $('input[name="'+config.id+'"]').eq(0) || $('span[name="'+config.id+'"]').eq(0);
        	this.$obj = $('[name="'+config.id+'"]').eq(0);
            this.$config = config;
            this.id = config.id;
            this.cur_sign = config.cur_sign;
            this.lower_name = config.lower_name;
            this.title = config.title;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
            this.text_desc = config.text_desc;
			this.priv = config.priv;
			this.writable = config.writable;
			isHasCounterSign = true;
        },
        renderInputWrapper: function(config) {
            var self = this;
            if(config.writable) {
                var inputConfig = config.columns;
                var inputHtml = self.parseInputHtml(inputConfig);
                this.$inputWrapper =  $(".sign_"+config.id).find('.ui-sign-handle-wrapper');
                this.$inputWrapper.append(inputHtml);
            }
        },
        renderShowWrapper: function(config) {
            var self = this;
            var showConfig = config.dataList;
            self.$showWrapper =  $(".sign_"+config.id).find('.ui-sign-show-wrapper');
            $.each(showConfig, function(index, item){
                var showHtml = self.parseShowHtml(item);
                self.$showWrapper.append(showHtml);
            })
        },
        reRenderShowWrapper: function(data) {
            var self = this;
            self.$config.dataList = data;
            var showConfig = self.$config.dataList;
            self.$showWrapper =  $(".sign_"+self.$config.id).find('.ui-sign-show-wrapper');
            self.$showWrapper.empty();
            $.each(showConfig, function(index, item){
                var showHtml = self.parseShowHtml(item);
                self.$showWrapper.append(showHtml);
            })
            $.ProLoading.hide();
        },
        //获取格式化的时间
        formatDate: function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + date.getHours() + seperator2 + date.getMinutes()
                + seperator2 + date.getSeconds();

            return currentdate;
        },
		parseWrapperHtml: function(config){
            var self = this;
            var template = $('#f-sign-tmpl').html();
            var html = $.parseTpl(template, config)
            return html;
		},
        parseInputHtml: function(config){
            var self = this;
			var info = this.attrs;
            // var template = $('#f-sign-handle-tmpl').html();
            // var html = $.parseTpl(template, config);
            var tplHtml = '';
            tplHtml += '<div class="read_detail  ui-sign-input-wrapper  tag-sign">';
                if(config.signcontent != undefined) {
                    tplHtml += '<textarea class="ui-sign-item-content">' + config.signcontent + '</textarea>';
                }
				if(info.required.value)
				{
					tplHtml += '<div class="div_alert div_alert_hidden" id="div_alert_'+info.id.value+'"></div>';
				}
                tplHtml += '<div class="ui-sign-item-bottom">';
                    tplHtml += '<div class="ui-sign-item-dept">';
                         if(config.signorg != undefined) {
                            tplHtml += '<span class="ui-sign-item-org">' + config.signorg + '</span>';
                         }
                         if(config.signrole != undefined) {
                            tplHtml += '<span class="ui-sign-item-role">' + config.signrole + '</span>';
                         }
                         if(config.signuser != undefined) {
                            tplHtml += '<span class="ui-sign-item-user">' + config.signuser + '</span>';
                         }
                    tplHtml += '</div>';
                     if(config.signtime != undefined) {
                        tplHtml += '<div class="ui-sign-item-date" >' + config.signtime + '</div>';
                     }
                    tplHtml += '<div style="clear: both;"></div>';
                tplHtml += '</div>';
        	tplHtml += '</div>';
            return tplHtml;
		},
        parseShowHtml: function(config){
            var self = this;
            var tplHtml = '';
            if(config.hidden) {

            } else {
                tplHtml +=    '<div class="read_detail ui-sign-show-item tag-sign">';
                    if(config.signcontent != undefined) {
                        tplHtml += '<p>'+config.signcontent+'</p>';
                    }
                    if(config.websign != undefined) {
                        for(var idx = 0; idx < config.websign.length; idx++) {
                            tplHtml += '<div class="ui-sign-item-img"><img width="'+config.websign[idx].width+'px;" height="'+config.websign[idx].height+'px;" src="data:image/png;base64,'+config.websign[idx].data+'" /></div>';
                        }
                    }
                    tplHtml += '<div class="ui-sign-item-bottom">';
                        tplHtml += '<div class="ui-sign-item-dept">';
                            if(config.signorg != undefined) {
                                tplHtml += '<span class="ui-sign-item-org">'+config.signorg+'</span>';
                            }
                            if(config.signrole != undefined) {
                                tplHtml += '<span class="ui-sign-item-role">'+config.signrole+'</span>';
                            }
                            if(config.signuser != undefined) {
                                tplHtml += '<span class="ui-sign-item-user">'+config.signuser+'</span>';
                            }
                        tplHtml += '</div>';
                        if(config.signtime != undefined) {
                            tplHtml += '<div class="ui-sign-item-date" >'+config.signtime+'</div>';
                        }
                        tplHtml += '<div style="clear: both;"></div>';
                    tplHtml += '</div>';
                tplHtml += '</div>';
            }
            return tplHtml;
		},
		bindEvent: function(){
		    var self = this;
			var randomUid = this.$config.columns.random_uid || '';
			var itemIdName = this.$config.columns.item_id || '';
			var signOrder = this.$config.columns.sign_order || '';
			var signx = this.$config.columns.sign_x || 0;
			var signy = this.$config.columns.sign_y || 0;
			var curItemId = this.id;
            $('body').on('tap','.f-sign-write',function(){
                // $(this).parents().find('.tag-sign').attr('id');
                var id = $(this).parent().parent().attr('id') || '';
                if(id == self.$config.id) {
                    getWebWritePage(itemIdName,'',randomUid,'','200','200',signx,signy,2,signOrder,curItemId)
                    // $.ProLoading.show();
                    // self.reRenderShowWrapper();
                }

            })

            $('body').on('tap','.f-sign-seal',function(){
                // $(this).parents().find('.tag-sign').attr('id');
                var id = $(this).parent().parent().attr('id') || '';
                if(id == self.$config.id) {
                    goToWebSeal('',itemIdName,randomUid,signx,signy,2,signOrder,curItemId)
                    // $.ProLoading.show();
                    // self.reRenderShowWrapper();
                }

            })


		},
		getField: function(){
			return $('#'+ this.$config.id );
		},
		getValue: function(){
            var  data = {};
            var signcontent = this.getField().find('.ui-sign-handle-wrapper .ui-sign-item-content').val();
            var signuser = this.getField().find('.ui-sign-handle-wrapper .ui-sign-item-user').text();
            var signorg = this.getField().find('.ui-sign-handle-wrapper .ui-sign-item-org').text();
            var signrole = this.getField().find('.ui-sign-handle-wrapper .ui-sign-item-role').text();
            var signtime = this.getField().find('.ui-sign-handle-wrapper .ui-sign-item-date').text();
			if(signcontent)
			{
				signcontent = signcontent.replace(/\\/g, "\\\\");
				signcontent = signcontent.replace(/\"/g, "\\\"");
			}
            data["signcontent"] = signcontent;
            data["signuser"] = signuser;
            data["signorg"] = signorg;
            data["signrole"] = signrole;
            data["signtime"] = signtime;

			return data;

		},
		getData: function(){
            var ret = {};
            ret.name = this.$config.id+'_counter';
            if(!this.$config.secret){
            	ret.value = this.getValue();
            }
            return ret;
        },
        bindCalc: function(){
			// var $input = this.getField(),
            //     self   = this;
            // $input.bind("keyup paste _calced", function(){
            //     self.$config.fieldmanager.trigger('calc');
            // });
		},
        onSubmit: function() {
            var low_id = this.id;
			var priv = this.priv;
            var required_val = this.required;
			var require = (g_op_flag == 1 && priv.op || g_op_flag != 1 && priv.user) ? true : false;
			if(required_val && require)
			{
				var obj = $("#div_alert_"+this.id);
				if(priv.text)//多行文本验证
				{
					var textVal = jQuery('#'+low_id).find('textarea').val();
					if(typeof textVal != 'undefined' && textVal == '')
					{
						obj.text(this.text_desc);
						this.validation(obj);
						setTimeout(function(){
							obj.removeClass("div_alert_show");
						}, 5000);
						return false;
					}
				}
				if(priv.sign)
				{
					var isSign = jQuery('#countersign_'+this.id).val();
					if(isSign == 0 && (this.$config.handWrite || this.$config.handSign))
					{
						obj.text(this.desc);
						this.validation(obj);
						setTimeout(function(){
							obj.removeClass("div_alert_show");
						}, 5000);
						return false;
					}
				}
			}
        },
        validation: function(obj) {
            obj.addClass("div_alert_show");
        }
    });
    exports.TCounterSignCtrl = window.TCounterSignCtrl = TCounterSignCtrl;
});
