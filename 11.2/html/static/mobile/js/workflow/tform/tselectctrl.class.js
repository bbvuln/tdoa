define('TSelectCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TSelectCtrl = Base.extend({
        initialize: function(config) {
            TSelectCtrl.superclass.initialize.call(this, config);

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
			this.$selobj = $('[name^="DATA_"][title="' + config.title +'"]').eq(0);
			this.$selobj_nodeName = this.$selobj[0].nodeName;
			this.$options_arr = new Array();
            this.$child = (config.child != "") ? $('[name^="DATA_"][title="' + config.child +'"]').eq(0) : null;
	        this.$child_title = config.child;
			if(this.$child && this.$child.length != 0){
				this.$child_nodeName =  this.$child[0].nodeName;
				this.$child_options_arr = this.$child.find("option");
			}
            this.bindEvent();
        },
		parseHtml: function(d){
			var $childhtml = '';
			var tplHTML = '<% if(secret){ %>'+
							  '<input type="hidden" name="<%=id%>" value="<%=value%>" title="<%=title%>" child="<%=child%>">'+
						  '<% } else{ %>'+
							  '<div class="read_detail '+
							  '<% if(hidden!=undefined && hidden==true){ %>'+
								' hidden '+
							  '<% } %>'+
							  '<% if(writable){ %>'+
							  	  'WriteDiv'+
							  '<% } %>'+
							  ' tag-select">'+
							  '<% if(writable && required && !secret){ %>'+
							  	  '<span class="isrequired">*</span>'+
							  '<% } %>'+
							  '<em><%=title%>��</em><div class="field">'+
							  '<select class="'+
							  
							  '<% if(!writable){ %>'+
							  	  ' BigStatic1 '+
							  '<% } %>'+
							  
							  '" '+
							  '<% if(!writable){ %>'+
							  	  'disabled="disabled" '+
							  '<% } %>'+
							  'title="<%=title%>" name="<%=id%>">'+
							  '<% for(var i=0;i<options.length;i++){ %>'+
							  	 '<option value="<%=options[i]%>" '+
						  	 			'<% if(value == options[i]){ %>'+
						  	 			'selected'+
						  	 			'<% } %>'+
							  	 '><%=options[i].split("|")[0]%></option>'+
							  '<% } %>'+
							  '</select></div></div>'+
						  '<% } %>'+
						  '<% if(required){ %>'+
						  	  '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>'+
						  '<% } %>';
			if(d.child != ""){
				$childhtml ='<script>'+
		            	       'if(typeof select_arr == "undefined"){'+
		                            'var select_arr = new Array();'+
		            	            'select_arr.push("'+d.child+'");'+
		                        '}else{'+
		                            'select_arr.push("'+d.child+'");'+
		                        '}'+
		        	        '</script>';
			}
			return $.tpl(tplHTML,d)+$childhtml;
		},
		getField: function(){ 
			return $('[title="'+ this.$config.title +'"]').eq(0);
        },
        getValue: function(){
        	if(this.$config.secret ){
        		return;
        	}else{
	            var this_obj = this.getField().find('option');
	            for(var this_count = 0; this_count < this_obj.length; this_count++)
	            {
	                if($(this_obj[this_count]).prop("selected") === true){
	                    return $(this_obj[this_count]).val();
	                }
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
            var self    = this,
                $select = self.getField();
            if(self.$config.writable == true){
                $select.bind("change _calced", function(){
                	self.$config.fieldmanager.trigger('calc');
                });
            }
            else{
                $select.bind("_calced", function(){
                	self.$config.fieldmanager.trigger('calc');
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
        bindEvent: function() {
			var self = this;
            var select_arr = window.select_arr || [];
			if($.inArray(self.$config.child, select_arr) != -1){ //������Ԫ���ж��ǹ�����SELECT�ؼ�
				if(self.$selobj_nodeName.toUpperCase() == "SELECT"){//�����ܵ����
					if(self.$selobj.hasClass('BigStatic1')){ //����д�����
						if(self.$config.value != ''){//��ֵ��������������Ĭ��ֵ�����
							if($("[title='"+self.$child_title+"']").length > 0){
								if(self.$selobj.val() == "")
                                {
                                	$("[title='"+self.$child_title+"']").find('option').remove();
                                }
                                else
                                {
                                	var parent_val = '|'+self.$selobj.val();
                                    $("[title='"+self.$child_title+"']").find('option').remove();
                                    
                                    var child_title_arr = self.$config.fieldmanager.fieldsInstance[self.$child_title].$config.options_full;
                                    if(child_title_arr.length > 0){
                                        $.each(child_title_arr, function(i,n){
                                        	if(n.indexOf(parent_val) != -1){
                                        		var val_arr = n.split('|');
                                        		$("[title='"+self.$child_title+"']").append("<option value='"+n+"'>"+val_arr[0]+"</option>");
                                        	}
                                        });
                                	}
                                }
								$("[title='"+self.$child_title+"']").trigger('change');
							}
						}else{//��ֵ��������½���ûĬ��ֵ�����
							self.$selobj.find('option').remove();
							if($("[title='"+self.$child_title+"']").length != 0){//�������Ӳ˵�����
								$("[title='"+self.$child_title+"']").find('option').remove();
								var child_title_arr = self.$config.fieldmanager.fieldsInstance[self.$child_title].$config.options_full;
                                if(child_title_arr.length > 0){
                                    $.each(child_title_arr, function(i,n){
                                    	if(n.indexOf(parent_val) != -1){
                                    		var val_arr = n.split('|');
                                    		$("[title='"+self.$child_title+"']").append("<option value='"+n+"'>"+val_arr[0]+"</option>");
                                    	}
                                    });
                            	}
								$("[title='"+self.$child_title+"']").trigger('change');
							}
						}
					}else{//��д���
						self.$selobj.change(function(){
							if($("[title='"+self.$child_title+"']").length > 0)
							{
                                if(self.$selobj.val() == "")
                                {
                                	$("[title='"+self.$child_title+"']").find('option').remove();
                                }
                                else
                                {
                                    var parent_val = '|'+self.$selobj.val();
                                    $("[title='"+self.$child_title+"']").find('option').remove();
                                    var child_title_arr = self.$config.fieldmanager.fieldsInstance[self.$child_title].$config.options_full;
                                    if(child_title_arr.length > 0){
                                        $.each(child_title_arr, function(i,n){
                                        	if(n.indexOf(parent_val) != -1){
                                        		var val_arr = n.split('|');
                                        		$("[title='"+self.$child_title+"']").append("<option value='"+n+"'>"+val_arr[0]+"</option>");
                                        	}
                                        });
                                	}
                                }
								$("[title='"+self.$child_title+"']").trigger('change');
							}
						});
						if(this.$config.value != ''){
							this.$selobj.val(this.$config.value);
						}
						self.$selobj.trigger('change');
					}
				}else if(self.$selobj_nodeName.toUpperCase() == "INPUT"){//���ܵ����
					if($("[title='"+self.$child_title+"']").length > 0)
					{
                        if(self.$selobj.val() == "")
                        {
                        	$("[title='"+self.$child_title+"']").find('option').remove();
                        }
                        else
                        {
                            var parent_val = '|'+self.$selobj.val();
                            $("[title='"+self.$child_title+"']").find('option').remove();
                            var child_title_arr = self.$config.fieldmanager.fieldsInstance[self.$child_title].$config.options_full;
                            if(child_title_arr.length > 0){
                                $.each(child_title_arr, function(i,n){
                                	if(n.indexOf(parent_val) != -1){
                                		var val_arr = n.split('|');
                                		$("[title='"+self.$child_title+"']").append("<option value='"+n+"'>"+val_arr[0]+"</option>");
                                	}
                                });
                        	}
                        }
						$("[title='"+self.$child_title+"']").trigger('change');
					}
					self.$selobj.trigger('change');
				}
			}else{//��ͨ��SELECT�ؼ�
				if(self.$selobj.hasClass('BigStatic1')){ //����д�����
					/*
					if(self.$config.value != ''){
						self.$selobj.find('option[value!="'+self.$config.value+'"]').remove();
					}else{
						self.$selobj.find('option').remove();
					}
					*/
				}else{//��д���
					/*
					if(self.$config.value != ''){
						self.$selobj.val(self.$config.value);
					}
					*/
				}
			}
			if(!self.$selobj.hasClass('BigStatic1')){
				if(self.$selobj_nodeName.toUpperCase() == "SELECT"){//�ؼ���˫���¼��ᵯ����ʷѡ����Ϣ
					self.$selobj.dblclick(function(){
						quick_load(this, self.$config.run_id, self.$config.flow_id);
					});
				}
			}
        },

        onSubmit: function(){
            var obj_val = this.$selobj.val(),
                required_val = this.required,
                low_id = this.low_id;
            if((obj_val === '' || obj_val === false || typeof obj_val == 'undefined') && required_val)
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
    exports.TSelectCtrl = window.TSelectCtrl = TSelectCtrl;
});