define('TListViewCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TListView = require('TListView');
    var TListViewCtrl = Base.extend({
        initialize: function(config) {
            TListViewCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.$config = config;
            this.$config.unCalc = true;//不参与计算控件的标识
            this.title = config.title;
            this.id = config.id;
            this.d_id = config.d_id;
            this.required = config.required;
            this.desc = config.desc = '请填写内容！';
            this.initField(config);
            this.$editobj = $('#listviewediticon'+this.id);
            this.$listcontent = $('#list-wrapper'+this.id).find('.list-content');
            this.newlistview(this.d_id,this.id);
        },
        initField: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
        	this.$wrapper.append(html);
        },
		parseHtml: function(d){
			d.d_id = d.id.substr(5,d.id.length);
			var tplHTML = '<% if(secret){ %>'+
						  '<% } else{ %>'+
							'<div class="read_detail '+
							'<% if(hidden!=undefined && hidden==true){ %>'+
								' hidden '+
							'<% } %>'+
							'<% if(writable){ %>'+
								'WriteDiv'+
							'<% } %>'+
							' tag-listview">'+
							'<% if(required){ %>'+
								'<span class="isrequired">*</span>'+
							'<% } %>'+
							'<em><%=title%>：</em>'+
						  	'<input type="hidden" name="<%=id%>" value="<%=value%>" class="LIST_VIEW" />'+
						  		
						  			'<div class="field">'+
						  			    '<a class="report-list-icon-create" href="javascript:void(0);"></a>'+
						  			'</div>'+
						  			'<div id="list-wrapper<%=id%>" class="list-wrapper" data-title="<%=title%>">'+
						  			    '<div class="list-content"></div>'+
						  			    '<div class="list-sum"></div>'+
						  			'</div>'+
						  		
						  	'</div>'+
						   '<% } %>'+
						   '<% if(required){ %>'+
							'<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>'+
						   '<% } %>';
			return $.tpl(tplHTML,d);
		},
		newlistview: function(listitem, listname){
			var self = this;
    		$.ajax({
	            url: 'getListDataJson.php',
	            type: 'POST',
	            data: {'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'LIST_NAME':listname,'actionType':q_action_type},
	            cache: false,
	            async: false,
	            success: function(d){
	                d = JSON.parse(d);
	                var ListViewFieldManager = TListView.TListViewManager;
	                
	                self.list = new ListViewFieldManager({
	                    wrapper: self.$listcontent,
	                    fieldmanager: self.$config.fieldmanager
	                }, d);
	                saveFlag = 0;
	            },
	            error: function(){ 
	            }
	        });  
            
            //测试数据
//            var d = {
//                "main": [],
//                "detail": [{
//                    "label": "\u5217\u8868\u63a7\u4ef6",
//                    "id": "4",
//                    "title": "\u5217\u8868\u63a7\u4ef6",
//                    "op": "1",
//                    "url": "listview('4','D4')",
//                    "add_op": 1,
//                    "edit_op": 1,
//                    "delete_op": 1,
//                    "schema": [{
//                        "colname": "\u5355\u884c",
//                        "colvalue": "",
//                        "id": "list_4_col_1",
//                        "displaystyle": "",
//                        "fieldtype": "RTextField",
//                        "editable": 1,
//                        "secret": false,
//                        "code_select_value": ""
//                    },
//                    {
//                        "colname": "\u591a\u884c",
//                        "colvalue": "",
//                        "id": "list_4_col_2",
//                        "displaystyle": "",
//                        "fieldtype": "RTextAreaField",
//                        "editable": 1,
//                        "secret": false,
//                        "code_select_value": ""
//                    },
//                    {
//                        "colname": "\u4e0b\u62c9",
//                        "colvalue": "20",
//                        "id": "list_4_col_3",
//                        "displaystyle": "",
//                        "fieldtype": "RSelectField",
//                        "editable": 1,
//                        "secret": false,
//                        "code_select_value": "10|20|30"
//                    },
//                    {
//                        "colname": "\u5355\u9009",
//                        "colvalue": "20",
//                        "id": "list_4_col_4",
//                        "displaystyle": "",
//                        "fieldtype": "RRadioField",
//                        "editable": 1,
//                        "secret": false,
//                        "code_select_value": "10|20|30"
//                    },
//                    {
//                        "colname": "\u590d\u9009",
//                        "colvalue": "10,20",
//                        "id": "list_4_col_5",
//                        "displaystyle": "",
//                        "fieldtype": "RCheckBoxField",
//                        "editable": 1,
//                        "secret": false,
//                        "code_select_value": "10|20|30"
//                    },
//                    {
//                        "colname": "\u65e5\u671f",
//                        "colvalue": "",
//                        "id": "list_4_col_6",
//                        "displaystyle": "yyyy-MM-dd",
//                        "fieldtype": "RDateField",
//                        "editable": 1,
//                        "secret": false,
//                        "code_select_value": ""
//                    },
//                    {
//                        "colname": "\u65e5\u671f\u65f6\u95f4",
//                        "colvalue": "",
//                        "id": "list_4_col_7",
//                        "displaystyle": "",
//                        "fieldtype": "RDateField",
//                        "editable": 1,
//                        "secret": false,
//                        "code_select_value": ""
//                    },
//                    {
//                        "colname": "\u8ba1\u7b97",
//                        "colvalue": "",
//                        "id": "list_4_col_8",
//                        "displaystyle": "",
//                        "fieldtype": "RCalcCtrlField",
//                        "editable": 0,
//                        "secret": false,
//                        "code_select_value": "[1]+[5]|3"
//                    }],
//                    "item": [{
//                        "id": 1,
//                        "index": 1,
//                        "order": 1,
//                        "title": "\u5217\u8868\u63a7\u4ef6 - \u7f16\u8f91",
//                        "item": [{
//                            "colname": "\u5355\u884c",
//                            "colvalue": "10",
//                            "id": "list_4_col_1",
//                            "displaystyle": "",
//                            "fieldtype": "RTextField",
//                            "editable": 1,
//                            "secret": false,
//                            "code_select_value": "",
//                            "src": "",
//                            "filename": ""
//                        },
//                        {
//                            "colname": "\u591a\u884c",
//                            "colvalue": "20",
//                            "id": "list_4_col_2",
//                            "displaystyle": "",
//                            "fieldtype": "RTextAreaField",
//                            "editable": 1,
//                            "secret": false,
//                            "code_select_value": "",
//                            "src": "",
//                            "filename": ""
//                        },
//                        {
//                            "colname": "\u4e0b\u62c9",
//                            "colvalue": "20",
//                            "id": "list_4_col_3",
//                            "displaystyle": "",
//                            "fieldtype": "RSelectField",
//                            "editable": 1,
//                            "secret": false,
//                            "code_select_value": "10|20|30",
//                            "src": "",
//                            "filename": ""
//                        },
//                        {
//                            "colname": "\u5355\u9009",
//                            "colvalue": "20",
//                            "id": "list_4_col_4",
//                            "displaystyle": "",
//                            "fieldtype": "RRadioField",
//                            "editable": 1,
//                            "secret": false,
//                            "code_select_value": "10|20|30",
//                            "src": "",
//                            "filename": ""
//                        },
//                        {
//                            "colname": "\u590d\u9009",
//                            "colvalue": "10,20",
//                            "id": "list_4_col_5",
//                            "displaystyle": "",
//                            "fieldtype": "RCheckBoxField",
//                            "editable": 1,
//                            "secret": false,
//                            "code_select_value": "10|20|30",
//                            "src": "",
//                            "filename": ""
//                        },
//                        {
//                            "colname": "\u65e5\u671f",
//                            "colvalue": "2016-04-27",
//                            "id": "list_4_col_6",
//                            "displaystyle": "yyyy-MM-dd",
//                            "fieldtype": "RDateField",
//                            "editable": 1,
//                            "secret": false,
//                            "code_select_value": "",
//                            "src": "",
//                            "filename": ""
//                        },
//                        {
//                            "colname": "\u65e5\u671f\u65f6\u95f4",
//                            "colvalue": "2016-04-29 14:38",
//                            "id": "list_4_col_7",
//                            "displaystyle": "yyyy-MM-dd HH:mm:ss",
//                            "fieldtype": "RDateField",
//                            "editable": 1,
//                            "secret": false,
//                            "code_select_value": "",
//                            "src": "",
//                            "filename": ""
//                        },
//                        {
//                            "colname": "\u8ba1\u7b97",
//                            "colvalue": "40.000",
//                            "id": "list_4_col_8",
//                            "displaystyle": "",
//                            "fieldtype": "RCalcCtrlField",
//                            "editable": 0,
//                            "secret": false,
//                            "code_select_value": "[1]+[5]|3",
//                            "src": "",
//                            "filename": ""
//                        }]
//                    }],
//                    "sumArr": [{
//                        "colname": "\u5355\u884c",
//                        "colvalue": "",
//                        "id": "list_4_col_1",
//                        "displaystyle": "",
//                        "fieldtype": "RTextField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "",
//                        "sumflag": true
//                    },
//                    {
//                        "colname": "\u591a\u884c",
//                        "colvalue": "",
//                        "id": "list_4_col_2",
//                        "displaystyle": "",
//                        "fieldtype": "RTextAreaField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "",
//                        "sumflag": true
//                    },
//                    {
//                        "colname": "\u4e0b\u62c9",
//                        "colvalue": "",
//                        "id": "list_4_col_3",
//                        "displaystyle": "",
//                        "fieldtype": "RSelectField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "10|20|30",
//                        "sumflag": true
//                    },
//                    {
//                        "colname": "\u5355\u9009",
//                        "colvalue": "",
//                        "id": "list_4_col_4",
//                        "displaystyle": "",
//                        "fieldtype": "RRadioField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "10|20|30",
//                        "sumflag": true
//                    },
//                    {
//                        "colname": "\u590d\u9009",
//                        "colvalue": "",
//                        "id": "list_4_col_5",
//                        "displaystyle": "",
//                        "fieldtype": "RCheckBoxField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "10|20|30",
//                        "sumflag": true
//                    },
//                    {
//                        "colname": "\u65e5\u671f",
//                        "colvalue": "",
//                        "id": "list_4_col_6",
//                        "displaystyle": "yyyy-MM-dd",
//                        "fieldtype": "RDateField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "",
//                        "sumflag": false
//                    },
//                    {
//                        "colname": "\u65e5\u671f\u65f6\u95f4",
//                        "colvalue": "",
//                        "id": "list_4_col_7",
//                        "displaystyle": "",
//                        "fieldtype": "RDateField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "",
//                        "sumflag": false
//                    },
//                    {
//                        "colname": "\u8ba1\u7b97",
//                        "colvalue": "",
//                        "id": "list_4_col_8",
//                        "displaystyle": "",
//                        "fieldtype": "RCalcCtrlField",
//                        "secret": false,
//                        "editable": 0,
//                        "hidden": 0,
//                        "code_select_value": "[1]+[5]|3",
//                        "sumflag": true
//                    }]
//                }],
//                "basic": []
//            };
//            var ListViewFieldManager = TListView.TListViewManager;
//            self.list = new ListViewFieldManager({
//                wrapper: self.$listcontent,
//                fieldmanager: self.$config.fieldmanager
//            }, d);
//            saveFlag = 0;

		},
		bindCalc: function(){
		},
		getValue: function(){
		   return (this.list && this.list.serializeArray());
		},
		getData: function(){
            var ret = {};
            ret.name = this.$config.id; 
            ret.value = this.getValue();
            ret.sum = this.list.serializeSumArray();
            return ret;
        },
        onSubmit: function() {
        	var self = this;
            var obj_val = self.getValue();
            obj_val = obj_val[this.id];
			obj_val = obj_val && obj_val.replace(/(\n|\`)/g, "");
            var required_val = this.required;
            var low_id = this.low_id;
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
    exports.TListViewCtrl = window.TListViewCtrl = TListViewCtrl
});