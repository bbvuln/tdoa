define('TOrgSelectCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TOrgSelectCtrl = Base.extend({

        initialize: function(config) {
            TOrgSelectCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
			this.data_type = config.data_type;
			this.id = config.id;
			this.required = config.required;
        },
		initField: function(config) {
            var self = this;
            var html = self.parseHtml(config);
			this.$config = config;
			this.$wrapper.append(html);
			this.$button = $('button[name="'+config.id+'"]') || '';
			if(this.$button.length != 0)
			{
				this.$button.click(function(){
					var dataType = self.data_type;
					var itemId = self.id;
					var userOrDeptId = $('input[name="user_dept_'+itemId+'"]').val() || '';
					if(dataType == 1)//部门
					{
						var depts = [];
						var deptStr = '';
						var deptIdStr = '';
						if(userOrDeptId != '')
						{
							depts = userOrDeptId.split(',');
						}
						tMobileSDK.selectDept({
							multiple:true,
							depts: depts,
							onSuccess:function(result){
								if(result.length == 0)
								{
									$('textarea[name="'+itemId+'"]').val('');
									$('input[name="user_dept_'+itemId+'"]').val('');
								}else
								{
									for(var i=0;i<result.length;i++)
									{
										if(result[i].deptName == '')
											continue;
										deptStr += result[i].deptName+',';
										deptIdStr += result[i].deptId+',';
									}
									$('textarea[name="'+itemId+'"]').val(deptStr);
									$('input[name="user_dept_'+itemId+'"]').val(deptIdStr);
								}
							}
						});
					}else//人员
					{
						var users = [];
						var userStr = '';
						var uidStr = '';
						if(userOrDeptId != '')
						{
							userOrDeptId.substring(0, userOrDeptId.lastIndexOf(','));  
							users = userOrDeptId.split(',');
						}
						tMobileSDK.selectUser({
							multiple:true,
							users: users,
							onSuccess:function(result){
								if(result.length == 0)
								{
									$('textarea[name="'+itemId+'"]').val('');
									$('input[name="user_dept_'+itemId+'"]').val('');
								}else
								{
									for(var i=0;i<result.length;i++)
									{
										if(result[i].userName == '')
											continue;
										userStr += result[i].userName+',';
										uidStr += result[i].uid+',';
									}
									$('textarea[name="'+itemId+'"]').val(userStr);
									$('input[name="user_dept_'+itemId+'"]').val(uidStr);
								}
							}
						});
					}
				});
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
						  	 '<% if(writable){ %>'+
						  	 '<textarea readonly name="<%=id%>" title="<%=title%>"><%=value%></textarea>'+
							 '<button type="button" class="ui-btn ui-btn-primary" name="<%=id%>">选择</button>'+
							 '<input type="hidden" name="user_dept_<%=id%>" value="<%=user_dept_id%>">'+
						  	 '<% } else{ %>'+
						  	 '<span class="form-textarea-print rich-style" title="<%=title%>"><%=value%></span>'+
						  	 '<% } %>'+
						  	 '</div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	 '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
		},
		getField: function(){
			return $('[name="'+ this.$config.id +'"]').eq(0);
		},
		getValue: function(){
			if(this.$config.writable == true){
				return this.getField().val();
			}else{
				return this.getField().text();
			}
		},
		getData: function(){
			if(this.$config.data_type == 0)//人员选择
			{
				var ret = {
					name: this.$config.id,
					value: {
						itemId:"",
						uid: "",
						userName: ''
					}
				};
				if(!this.$config.secret)
				{
					ret.value = 
					{
						itemId:this.$config.item_id,
						uid:$('input[name="user_dept_'+this.$config.id+'"]').val(),
						userName:this.getValue()
					}
				}
			}else
			{
				var ret = {};
				ret.name = this.$config.id;
				if(!this.$config.secret){
					ret.value = this.getValue();
				}
			}
            return ret;
        },
        onSubmit: function() {
			var low_id = this.id;
			var obj_val = $('textarea[name="'+low_id+'"]').val();
            var required_val = this.required;
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
            $("#div_alert_"+this.id+"").addClass("div_alert_show");
        }
    });
    exports.TOrgSelectCtrl = window.TOrgSelectCtrl = TOrgSelectCtrl;
});
