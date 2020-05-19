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
			/******************���Կ�ʼ*****************/
			/*
			var fields_event_config = [{
				"name": "\u7ec4\u5bb9\u5668",
				"type": "group",
				"id": "0",
				"fields": [
					{
						"groupSort": 1,
						"uid": "288FA3080F1075A80F9AF564C97CF4CC",
						"parentid": 0,
						"title": "\u5217\u8868\u63a7\u4ef6\u6d4b\u8bd5",
						"id": "DATA_1",
						"type": "TListViewCtrl",
						"data_type": "ListView",
						"value": "",
						"hidden": false,
						"writable": true,
						"secret": false,
						"required": true,
						"desc": "\u8bf7\u586b\u5199\u5185\u5bb9"
					},
					{
						"uid": "294FE6A473B254714D2A40F250846B8C",
						"parentid": 0,
						"lower_name": "data_2",
						"key_type": "varchar",
						"title": "\u5355\u884c",
						"id": "DATA_2",
						"maxlength": "",
						"type": "TTextCtrl",
						"validation": "text:type:text;len:",
						"ishidden": false,
						"writable": true,
						"secret": false,
						"placeholder": "",
						"print": false,
						"value": "",
						"desc": "\u8bf7\u586b\u5199\u5185\u5bb9",
						"required": true,
						"hidden": false
					},
					{
						"uid": "34FFE7866627BEDB63154299F380BBB1",
						"id": "DATA_3",
						"lower_name": "data_3",
						"value": "",
						"type": "TTextareaCtrl",
						"required": true,
						"desc": "\u8bf7\u586b\u5199\u5185\u5bb9",
						"rich": "0",
						"title": "\u591a\u884c",
						"parentid": 0,
						"writable": true,
						"secret": false,
						"placeholder": "",
						"ishidden": false
					},
					{
						"uid": "34FFE7866627BEDB63154299F380BBB1",
						"id": "DATA_4",
						"lower_name": "data_4",
						"value": "",
						"type": "TDataSelectionCtrl",
						"required": true,
						"desc": "\u8bf7\u586b\u5199\u5185\u5bb9",
						"title": "����ѡ��ؼ�",
						"parentid": 0,
						"writable": true,
						"secret": false,
						"ishidden": false
					}
				]
			}];
            store = fields_event_config;
			*/
			/******************���Խ���*****************/
            var _selfStore = $.extend(true,[],store);
            var dataSelectArr = this.findDatasSelect(_selfStore);
            var _selfStores  = this.setDataByfindDatasSelect(_selfStore,dataSelectArr);
			TFieldManager.superclass.initialize.call(this, config);
            var self = this;
            this.register = _selfStores || [];
            this.instances = {};//�洢�������ʵ��
	        this.fieldsInstance = {};//�洢���пؼ�ʵ��
            this.initGroups();
	        setTimeout(function(){
            	self.calc();//��������ϳ����״μ���
            },300);
            this.bindEvent();
        },
        findDatasSelect: function(store) {
            var dataSelectArr = [];
            store.map(function(item,index) {
                item.fields.map(function (elem,n) {
                    if(elem.type==="TDataSelectionCtrl" && elem.data_type==="1") {
                        dataSelectArr.push(elem);
                    }
                })
            })
            return dataSelectArr;
        },
        setDataByfindDatasSelect: function(store,arr) {
            arr.map(function(items,indexs){
                for (var i in items.keyItemStr){
                    store.map(function(item,index) {
                        item.fields.map(function (elem,n) {
                            if(elem.id===i) {
                                elem.dataselect = items
                            }
                        })
                    })
                }
            })
            return store;
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
           }else if(cfg.type == "TOrgSelectCtrl"){
               // field = cfg.CODES == "dept" ? new TDeptSelectCtrl(cfg): new TUserselectCtrl(cfg);
            }else if(cfg.type == "TMobileWriteSealCtrl"){
                field = new TMobileWriteSealCtrl(cfg);
            }else if(cfg.type == "TCalcCtrl"){
                field = new TCalcCtrl(cfg);
            }else if(cfg.type == "TListViewCtrl"){
                field = new TListViewCtrl(cfg);
            }else if(cfg.type == "TDataSelectionCtrl"){
				field = new TDataSelectionCtrl(cfg);
			}else if(cfg.type == "TExtDataSelectionCtrl") {
                field = new TExtDataSelectionCtrl(cfg);
			}else if(cfg.type == "TOcrCtrl"){
                field = new TOcrCtrl(cfg);
            }else if(cfg.type == "TCounterSignCtrl"){
				field = new TCounterSignCtrl(cfg);
			}
            return field;
        },
        //������ʵ��
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
        },
        //���ɿؼ�ʵ��
        initFields: function(group) {
            var self = this,
        		fields = group.$config.fields,
        		groupid = group.$config.id;
        		instances = this.instances,
        		factory = this.factory;
                $.each(fields, function (i, field) {
                    try {
                        field.parentid = groupid;
                        var instance = self.factory(field);
                        if(instance && instance.get('title')){
                    	    self.fieldsInstance[instance.get('title')] = instance;
                    	    group.childs[instance.get('title')] = instance;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });

        },
        calc: function(){
           	var self = this,
           		instances = self.instances;
           	//���ɿؼ�����Ϻ�󶨼���ؼ��ļ����¼�
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
                    try {
        			    field.getData && ret.push(field.getData());
                    } catch (error) {
                        console.log(error);
                    }
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
                    'FLOW_PRCS': q_flow_prcs,
                    'PRCS_KEY_ID': q_prcs_key_id,
					'saveFlag':a
                },
                beforeSend: function(){
                    //$.ProLoading.show("���ڱ���");
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
                    if(a && a != 't') return;
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
                    src = '/general/approve_center/list/input_form/get_qr.php?run_id='+ q_run_id +'&field='+ name;
                    $this.attr('src',src);
                    $this.parent('a.qrcode_link').attr('_href', src);
                });
            }
        },
        //�����ֶα���JS�������
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
		    //���������пؼ�����hidden,���allhidden����
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
            this.desc = config.desc = '����д���ݣ�';
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
            			  '<em><%=title%>:</em><div class="field">'+
            			  	'<button type="button" class="ui-btn" id="orgselect_add_<%=id%>" data-type="user" '+
            			  	'<% if(!writable){ %>'+
            			  	' disabled'+
            			  	'<% } %>'+
            			  	'>ѡ����Ա</button>'+
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
                        '<em><%=title%>:</em><div class="field"><button type="button" id="ANDROID_UPLOAD_IMAGES_<%=id%>" class="ui-btn" ' +
                        '<% if(!writable){ %>' +
                        'disabled' +
                        '<% } %>' +
                        '>ad�ϴ�ͼƬ</button><button type="button" id="IOS_UPLOAD_IMAGES_<%=id%>" class="ui-btn" ' +
                        '<% if(!writable){ %>' +
                        'disabled' +
                        '<% } %>' +
                        '>ios�ϴ�ͼƬ</button><div class="filelist">'+
                            '<% for(var i=0;i<list.length;i++){ %>' +
                                '<a href="javascript:void(0);" class="pda_attach pda_attach_img" is_image="1" _href="<%=list[i].attach_url%>"><span><%=list[i].attach_name%></span><span class="icon-delete">��</span></a>'+
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
            this.title = config.title;
            this.id = config.id;
            this.$config = config;
            this.required = config.required;
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
						  	 '<em><%=title%>:</em><div class="field">'+

						  	 '<% if(isSign){ %>'+

                                '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="showWritePage(\'<%=seal_src%>\',\'<%=density%>\')">'+
                                    '<span>�鿴</span>'+
                                '</span>'+
                                '<% if(writable){ %>'+
                                    '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_END" onclick="getWritePage(\'<%=flow_id%>\',\'<%=run_id%>\',\'<%=field_str%>\',\'<%=check_field%>\')">'+
                                        '<span>��д</span>'+
                                    '</span>'+
                                '<% } %>'+
								'<input id="write_<%=id%>" name="write_<%=id%>" type="hidden" value=1>'+
						  	 '<% } else{ %>'+

						  	    '<% if(writable){ %>'+
    						  	    //�����ܲ��ҿ�д
                                    '<span class="ui-btn ui-btn-primary ui-btn-s" data_field="<%=datafld%>" name="<%=id%>_START" onclick="getWritePage(\'<%=flow_id%>\',\'<%=run_id%>\',\'<%=field_str%>\',\'<%=check_field%>\')">'+
                                        '<span>��д</span>'+
                                    '</span>'+
                                '<% }else{ %>'+
                                    '<span></span>'+
						  	    '<% } %>'+
								'<input id="write_<%=id%>" name="write_<%=id%>" type="hidden" value=0>'+
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
			var signFlag = jQuery('input[name="write_'+low_id+'"]').val();
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

    exports.TFieldManager = window.TFieldManager = TFieldManager;
});
