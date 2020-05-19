define('TMacroCtrl',function(require, exports, module){
   var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TMacroCtrl = Base.extend({

        initialize: function(config) {
            TMacroCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
        },
		initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);

        	this.desc = config.desc;
            this.$config = config;
            this.$config.unCalc = true;//不参与计算控件的标识
            this.id = config.id;
	        this.title = config.title;
            this.$input = $('input[name= "' + config.id +'"]').eq(0);
            this.$textarea = $('textarea[name= "' + config.id +'"]').eq(0);
			this.$buttonUser = $('button[name="user_'+config.id+'"]').eq(0) || '';
			this.$buttonDept = $('button[name="dept_'+config.id+'"]').eq(0) || '';
			// this.user_list = config.user_list;
            this.$select = $('select[name= "' + config.id +'"]').eq(0);
            //this.$obj = (this.$input.length <= 0) ? this.$select : this.$input;
            this.$obj = $('[name= "' + config.id +'"]').eq(0);
            this.$button = $('#ref_' + config.item_id);
            this.required = config.required;
			this.bindEvent();
        },
        parseHtml: function(d){
        	var tplHTML ='<% if(secret){ %>'+
			  			'<% }else{ %>'+
	        				'<div class="read_detail '+
	        				    '<% if(hidden!=undefined && hidden==true){ %>'+
								    ' hidden '+
								'<% } %>'+
	        					'<% if(writable){ %>'+
									'WriteDiv'+
								'<% } %>'+
	        				' tag-macro">'+
							'<% if(required){ %>'+
							'<span class="isrequired">*</span>'+
							'<% } %>'+
							'<em><%=title%>：</em>'+
                            '<div class="field"><%=content%></div></div>'+
						'<% } %>'+
						'<% if(required){ %>'+
							'<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>'+
						'<% } %>';
        	return $.tpl(tplHTML,d);
        },
        getField: function(){
			if(this.$config.data_type == "input"){
                if(this.$config.tag == 'input'){
                    return this.$input;
                }else if(this.$config.tag == 'textarea'){
                    return this.$textarea;
                }
			}else if(this.$config.data_type == "select"){
			    return this.$select;
			}
			//return $('[title="'+ this.$config.title +'"]').eq(0);
		},
		getValue: function(){

			if(this.$config.writable == true){
				if(this.$config.data_type == "input"){
                    if(this.$config.tag == 'input'){
                        return this.getField().val();
                    }else if(this.$config.tag == 'textarea'){
                        return this.getField().text();
                    }
				}else if(this.$config.data_type == "select"){
					var this_obj = this.getField().find('option');
		            for(var this_count = 0; this_count < this_obj.length; this_count++)
		            {
		                if($(this_obj[this_count]).prop("selected") === true){
		                    return $(this_obj[this_count]).val();
		                }
		            }
				}
			}else{
				return this.$obj.text();
			}
		},
        setValue: function( title, currValue){
            var title = title;//当前字段名
            var self = this;
            try{
                var res = currValue;
                this.getField().val(res);
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
		getData: function(){
            var ret = {};
            ret.name = this.$config.id;
            if(!this.$config.secret){
            	ret.value = this.getValue();
            }
            return ret;
        },
        bindCalc: function(){
			var $field = this.getField(),
                self   = this;
            if(this.$config.data_type == "input"){
            	$field.bind("keyup paste _calced", function(){
					self.$config.fieldmanager.trigger('calc');
	            });
            }else if(this.$config.data_type == "select"){
            	$field.bind("change _calced", function(){
                    self.$config.fieldmanager.trigger('calc');
                });
            }
		},
		bindEvent: function(){
			var self = this;
			if(this.$buttonUser.length != 0)
			{
				this.$buttonUser.click(function(){
					var ids = $('input[name="user_dept_'+self.id+'"]').val();
					ids = ids.split(',');
					tMobileSDK.selectUser({
						multiple:false,
						users: ids,
						onSuccess:function(result){
							$('input[name="'+self.id+'"]').val(result[0].userName);
							$('input[name="user_dept_'+self.id+'"]').val(result[0].uid);
						}
					});
				});
			}
            if(this.$config.dataselect){
                this.$obj.on('focus',function(){
                   $("#searchDataSelectList").html('');
                   var term = $('#dataSelectInput').val('');
                   $("#data_select").animate({ left:0, }, 500, 'ease-out');
                   currMobileDataSelectedMenu = self.id;
                   // currMobileDataSelectedMenu = self.$config.dataselect;
		        });
            }
			if(this.$buttonDept.length != 0)
			{
				this.$buttonDept.click(function(){
					var depts = $('input[name="user_dept_'+self.id+'"]').val();
					depts = depts.split(',');
					tMobileSDK.selectDept({
						multiple:false,
						depts: depts,
						onSuccess:function(result){
							$('input[name="user_dept_'+self.id+'"]').val(result[0].deptId);
							$('input[name="'+self.id+'"]').val(result[0].deptName);
						}
					});
				});
			}
			if(self.$config.writable && self.$config.tag == 'input')
			{
				this.$input.click(function(){
                    if(document.getElementById("ref_"+self.$config.item_id).style.display == 'none')
                    {
                        $('#ref_'+self.$config.item_id).show();
                    }
                    else
                    {
                        $('#ref_'+self.$config.item_id).hide();
                    }
                });
				this.$button.click(function(){
					var datafld_id = self.$config.datafld;
					var myDate = new Date();
                    var Month = ("0" + (myDate.getMonth() + 1)).slice(-2);
                    var DateTime = myDate.getFullYear()+"-"+Month+"-"+("0" + myDate.getDate()).slice(-2)+" "+myDate.toLocaleTimeString("en-US", {hour12: false});
					if(datafld_id == "SYS_USERNAME_DATETIME")// 当前用户名+日期+时间
                    {
                        var return_val = self.$config.login_user_name+" "+DateTime;
                        $("input[name='"+self.$config.data_name+"']").attr("value",return_val);
                        $("input[name='"+self.$config.data_name+"']").val(return_val);
                    }else if(datafld_id == "SYS_TIME")// 当前时间
                    {
                        $("input[name='"+self.$config.data_name+"']").attr("value",myDate.toLocaleTimeString("en-US", {hour12: false}));
                        $("input[name='"+self.$config.data_name+"']").val(myDate.toLocaleTimeString("en-US", {hour12: false}));
                    }
                    else if(datafld_id == "SYS_DATETIME" || datafld_id == 'SYS_DATE_HMS1')//当前日期和时间
                    {
                        $("input[name='"+self.$config.data_name+"']").attr("value",DateTime);
                        $("input[name='"+self.$config.data_name+"']").val(DateTime);
                    }
                    else
                    {
                        $("input[name='"+self.$config.data_name+"']").attr("value",self.$config.auto_value);
                        $("input[name='"+self.$config.data_name+"']").val(self.$config.auto_value);
                    }
				});
			}
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
        	var self = this;
            var obj_input = this.$input;
            var obj_textarea = this.$textarea;
            var obj_select = this.$select;
            if(obj_input.length > 0){
                var obj_val = obj_input.val();
            }else if(obj_textarea.length > 0){
                var obj_val = obj_textarea.text();
            }else{
                var obj_val = obj_select.val();
            }
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    $("#div_alert_"+self.$config.id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },

        validation: function(s) {
            $("#div_alert_"+this.id+"").addClass("div_alert_show");
        }

    });
    exports.TMacroCtrl = window.TMacroCtrl = TMacroCtrl;
});
