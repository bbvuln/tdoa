define('TFieldManager', ['TFieldLoader',"base"], function(require, exports, module){    
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var Fields = require('TFieldLoader');
    var Math = require('math');
    var TFieldManager = Base.extend({
        attrs: {
            runId: null,
            flowId: null,
            wrapper: 'body'
        },
        initialize: function(config, store) {
            TFieldManager.superclass.initialize.call(this, config);
            var self = this;
            this.register = store || [];
            this.instances = {};//存储包含组的实例
	        this.fieldsInstance = {};//存储所有控件实例
            this.customJs = config.customJs || '';
            this.initGroups();
            
	        setTimeout(function(){
            	self.calc();//表单解析完毕出发首次计算
            },300);
	    
            this.bindEvent();
        },
        bindEvent: function(){
        },
        regist: function(cfg){
            this.register.push(cfg);
        },
        factory: function(cfg) {            
            var klass = Fields[cfg.type], field;
            cfg.fieldmanager = this;
            if(klass){
                field = new klass(cfg);
//            }else if(cfg.type == "TUserselectCtrl"){
//                field = new TUserselectCtrl(cfg);
//            }else if(cfg.type == "TImgUploadCtrl"){
//                field = new TImgUploadCtrl(cfg);
            }else if(cfg.type == "TMobileWriteSealCtrl"){
                field = new TMobileWriteSealCtrl(cfg);
            }else if(cfg.type == "TCalcCtrl"){
                field = new TCalcCtrl(cfg);
            }else if(cfg.type == "TListViewCtrl"){
                field = new TListViewCtrl(cfg);
            }
            return field;
        },
        //生成组实例
        initGroups: function(){
        	var self = this,
        		register = self.register,
                instances = self.instances,
              	$grouplist = $('#form-groups');
            $grouplist.html('');
			$.each(register, function (i, group) {
				var instance = new TGroup(i, group, $grouplist);
				if(instance && instance.get('name')){
                	instances[instance.get('name')+i] = instance;
                }
            });
            $.each(instances, function (k, v) {
				self.initFields(v);
            });
            $('.formloading').addClass('hide');
            eval(self.customJs);
        },
        //生成控件实例
        initFields: function(group) {
        	var self = this,
        		fields = group.$config.fields,
        		groupid = group.$config.id;
        		instances = this.instances,
        		factory = this.factory;
        	$.each(fields, function (i, field) {
        		field.parentid = groupid;
                var instance = self.factory(field);
                if(instance && instance.get('title')){
                	self.fieldsInstance[instance.get('title')] = instance;
                	group.childs[instance.get('title')] = instance;
                }
            });
        },
        calc: function(){
           	var self = this,
           		instances = self.instances;
           	//生成控件类完毕后绑定计算控件的计算事件
            $.each(instances, function (index, groupObj) {
				$.each(groupObj.childs, function (key, fieldObj) {
					if(fieldObj.$config.type == "TCalcCtrl"){
						fieldObj.initCalc();
					};
	            });
            });
            self.trigger('calc');
        },
        saveWorkFlow: function(a){
		    var self = this, ret = [], ret_status = true;
        	if(fieldManager && fieldManager.fieldsInstance){
        		$.each(fieldManager.fieldsInstance, function(i, field){
        			field.getData && ret.push(field.getData());
        		})
        	};
        	var data = JSON.stringify(ret);
            var flag = saveSignWorkFlow();
            var flag1 = savePublicWorkFlow();
            if(flag === false){return;}
            if(flag1 === false){return;}
            $.ajax({
                type: 'POST',
                url: 'edit_submit.php',
                cache: false,
                async: false,
                data: {
                    'data': data,
                    'P': p,
                    'RUN_ID': q_run_id,
                    'FLOW_ID': q_flow_id,
                    'PRCS_ID': q_prcs_id,
                    'FLOW_PRCS': q_flow_prcs
                },
                beforeSend: function(){
                    //$.ProLoading.show("正在保存");
                    //$.ProLoading.show();       
                },
                success: function(data){
                    $.ProLoading.hide();
                    if(control_type == 'turn_all') turn_all(); 
		            var data_obj = JSON.parse(data);
                    if(data_obj.status == 'error'){
                        if(data_obj.msg == 'NOEDITPRIV'){
                            
                            showMessage(noeditpriv);
                        }else if(data_obj.msg == 'HAVETURNNEXT'){
                            
                            showMessage(workhasturnnext);
                        }else{
                            
                            alert(data_obj.msg);
                        }
                        ret_status = false;
                    }
                    if(a) return;
                    $.ajax({
                        type: 'GET',
                	    url: 'sign.php',
                	    cache: false,
                	    data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag},
                	    success: function(dataSign)
                        {
                		    $("#CONTENT").val("");
                		    $("#editSignBox").empty().append(dataSign);
                		    ret_status && showMessage(formsuccess);
                		    self.renderCode();
                        }
                    });
                    $.ajax({
                        type: 'GET',
                	    url: 'public.php',
                	    cache: false,
                	    data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag},
                	    success: function(data)
                        {
                		    //$("#CONTENT").val("");
                		    $("#public_attachments").empty().append(data);
                		    //ret_status && showMessage(formsuccess);
                		    //self.renderCode();
                        }
                    });
                },
                error: function(data){
                    $.ProLoading.hide();  
                    showMessage(getfature);
                }
            });
            return ret_status;
        },
        renderCode: function(){
            if($('#form-groups .tag-qrcode img').length > 0){
                $('#form-groups .tag-qrcode img').each(function(){
                    var $this = $(this);
                    var src = $this.attr('src');
                    var name = $this.attr('name');
                    src = '/general/workflow/list/input_form/get_qr.php?run_id='+ q_run_id +'&field='+ name;
                    $this.attr('src',src);
                    $this.parent('a.qrcode_link').attr('_href', src);
                });
            }
        },
        //必填字段保存JS处理机制
        onSubmit: function() {
            var self = this, ret = null;
            $.each(self.fieldsInstance, function() {
                var field = this;
                if(typeof field.onSubmit == 'function')
                {
                    var status = field && field.onSubmit && field.onSubmit();  
                    
                    ret = ret === false ? false : status;
                }
            });
            if(ret === false){
            	if($('.div_alert_show').length > 0){
            		window.scrollTo(0,$('.div_alert_show').eq(0).offset().top-100);
            	}
            }
            return ret;
        }
    });
    var TGroup = Base.extend({
    	initialize: function(id, config, $wrapper) {
            TGroup.superclass.initialize.call(this, config);
            this.id = id;
            this.$wrapper = $wrapper;
            this.$config = config;
            this.$config.id = 'fgroup'+id;
            this.initGroups(this.$config);
            this.childs = {};
        },
        initGroups: function(config){
            
        	var self = this;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);
        },
		parseHtml: function(c){
		    var hidestr = "";
		    //若组内所有控件均是hidden,则加allhidden类名
		    if(c.allhidden!=undefined && c.allhidden == true){
		        hidestr+=' allhidden';
		    }
		    if(c.hidden!=undefined && c.hidden == true){
		        hidestr+=' hidden';
		    }
		    if(c.allhidden == true && c.hidden == false){
		        hidestr+=' hidden';
		    }
		    if(c.hidden == true){
		        hidestr+=' hidden';
		    }
		 	var html = $('<div class="group-block '+ hidestr +' '+ c.id +'"><div class="group-title">'+ c.name +'</div><div class="group-fields"></div></div>');
		 	return html;
		}
    });
    var TUserselectCtrl = Base.extend({
        initialize: function(config) {
            TUserselectCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.title = config.title;
            this.$config = config;
            this.$config.unCalc = true;
            this.id = config.id;
            this.required = config.required;
            this.desc = config.desc = '请填写内容！';
            this.initField(config);
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);
        	this.$select = $('#orgselect_add_'+ config.id);
            this.$list = $('#orgselect_list_'+ config.id);
        	this.bindEvent(config);
        },
		parseHtml: function(cfg){
			var tplHTML = '';
			
        	tplHTML = '<% if(secret){ %>'+
					  '<% } else{ %>'+
            			  '<div class="read_detail '+
            			  '<% if(hidden!=undefined && hidden==true){ %>'+
							' hidden '+
						  '<% } %>'+
            			  '<% if(writable){ %>'+
            			  'WriteDiv'+
            			  '<% } %>'+
            			  ' tag-orgselect">'+
            			  	'<% if(required){ %>'+
								'<span class="isrequired">*</span>'+
							'<% } %>'+
            			  '<em><%=title%>：</em><div class="field">'+
            			  	'<button type="button" class="ui-btn" id="orgselect_add_<%=id%>" data-type="user" '+
            			  	'<% if(!writable){ %>'+
            			  	' disabled'+
            			  	'<% } %>'+
            			  	'>选择人员</button>'+
            			  '<div id="orgselect_list_<%=id%>">'+
            			  '<% for(var i=0;i<list.length;i++){ %>'+
				          '<span data-user-uid="<%=list[i].id%>" data-user-id="<%=list[i].id%>" class="selected_user"><%=list[i].name%></span>'+
				          '<% } %>'+
				          '</div><input type="hidden" name="userselect_<%=id%>" id="userselect_<%=id%>" value=""></div></div>'+
				      '<% } %>';
		
			if(cfg.writable && !cfg.secret && cfg.required){
				 tplHTML += '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>';
			}
			return $.tpl(tplHTML,cfg);
		},
		bindEvent: function(cfg){
			var self = this;
		    var usernamestr = '';
		    if(cfg.list != undefined){
		        $.each(cfg.list, function(k, v){
			       usernamestr += v.id+',';
			    });    
		    }
			$('#form-groups').delegate(self.$select,'click',function(){
	    		 var a = self.$list.userselect({
                    wrapperId: "#user-select-"+self.id,
                    input: {'name': 'userselect_'+self.id, 'type': 'id'},
                    onconfirm: function(){
                        self.$list.find('span').addClass('selected_user');   
                    }
                });
	    	});
		},
		getValue: function(){
			var list = [];
			$('#orgselect_list_'+this.$config.id+' span').each(function(){
				var $this = $(this);
				var user = {};
				user.id = $this.attr('data-user-uid');
				user.name = $this.text();
				list.push(user);
			})
			return list;
		},
		getData: function(){
            var ret = {};
            ret.name = this.$config.id;
            if(!this.$config.secret){
            	ret.value = this.getValue();  
            }
            return ret;
        },
        onSubmit: function() {
        	var self = this;
            var obj_val = this.getValue();
            var required_val = this.required;
            var low_id = this.low_id;
        	if((obj_val.length == 0 || obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    $("#div_alert_"+self.$config.id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },
        validation: function(desc){
            $("#div_alert_"+this.id+"").html(desc);
            $("#div_alert_"+this.id+"").addClass("div_alert_show");
        }
    });
    var TImgUploadCtrl = Base.extend({
        initialize: function(config) {
            TImgUploadCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("." + config.parentid).find('.group-fields');
            this.title = config.title;
            this.initField(config);
            this.$config = config;
            this.$config.unCalc = true;
            this.id = config.id;
            this.required = config.required;
            this.desc = config.desc;
            this.paraObj = {'id': config.id};
            this.paraStr = JSON.stringify(this.paraObj);
            this.$android_images = $("#ANDROID_UPLOAD_IMAGES_"+this.id+"");
            this.$ios_images = $("#IOS_UPLOAD_IMAGES_"+this.id+"");
            this.bindEvent();
        },
        initField: function(config) {
            var self = this;
            var html = self.parseHtml(config);
            this.$el = $(html);
            this.$wrapper.append(this.$el);
        },
        parseHtml: function(d) {
            var tplHTML = '<% if(secret){ %>' + 
                        '<% } else{ %>' + 
                        '<div class="read_detail ' + 
                        '<% if(hidden!=undefined && hidden==true){ %>' + 
                        ' hidden ' + 
                        '<% } %>' + 
                        '<% if(writable){ %>' + 
                        'WriteDiv' + 
                        '<% } %>' + 
                        ' tag-imgupload">' + 
                        '<% if(required){ %>' + 
                        '<span class="isrequired">*</span>' + 
                        '<% } %>' + 
                        '<em><%=title%>：</em><div class="field"><button type="button" id="ANDROID_UPLOAD_IMAGES_<%=id%>" class="ui-btn" ' + 
                        '<% if(!writable){ %>' + 
                        'disabled' + 
                        '<% } %>' + 
                        '>ad上传图片</button><button type="button" id="IOS_UPLOAD_IMAGES_<%=id%>" class="ui-btn" ' + 
                        '<% if(!writable){ %>' + 
                        'disabled' + 
                        '<% } %>' + 
                        '>ios上传图片</button><div class="filelist">'+
                            '<% for(var i=0;i<list.length;i++){ %>' + 
                                '<a href="javascript:void(0);" class="pda_attach pda_attach_img" is_image="1" _href="<%=list[i].attach_url%>"><span><%=list[i].attach_name%></span><span class="icon-delete">×</span></a>'+
                            '<% } %>' + 
                        '</div></div>' + 
                        '<% } %>' + 
                        '<% if(writable && required && !secret){ %>' + 
                        '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>' + 
                        '<% } %>';
            return $.tpl(tplHTML, d);
        },
        bindEvent: function() {
            var self = this;
            this.$android_images && this.$android_images.on('click', function(){
                self.uploadImages();
            });
            this.$ios_images && this.$ios_images.on('click', function(){
                self.uploadImages();
            });
        },
        uploadImages: function(){
        }
    });

    var TMobileWriteSealCtrl = Base.extend({
        initialize: function(config) {
            TMobileWriteSealCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            //console.log(config);
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
						  	 
                                '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="showWritePage(\'<%=seal_src%>\',\'<%=density%>\')">'+
                                    '<span>查看</span>'+
                                '</span>'+
                                '<% if(writable){ %>'+
                                    '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="getWritePage(\'<%=flow_id%>\',\'<%=run_id%>\',\'<%=field_str%>\',\'<%=check_field%>\')">'+
                                        '<span>重写</span>'+
                                    '</span>'+
                                '<% } %>'+
        
						  	 '<% } else{ %>'+
						  	 
						  	    '<% if(writable){ %>'+
    						  	    //不保密并且可写
                                    '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="getWritePage(\'<%=flow_id%>\',\'<%=run_id%>\',\'<%=field_str%>\',\'<%=check_field%>\')">'+
                                        '<span>手写</span>'+
                                    '</span>'+
                                '<% }else{ %>'+
                                    '<span></span>'+
						  	    '<% } %>'+
						  	 '<% } %>'+
						  	 
						  	 
						  	 '</div></div>'+
						  '<% } %>';
			return $.tpl(tplHTML,d);
        }
    });
    
    exports.TFieldManager = window.TFieldManager = TFieldManager;
});


