define('TListViewCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TListView = require('TListView');
    var TListViewCtrl = Base.extend({
        initialize: function(config) {

            TListViewCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("." + config.parentid).find('.group-fields');
            this.$config = config;
            this.$config.unCalc = true; //不参与计算控件的标识
            this.title = config.title;
            this.id = config.id;
            this.d_id = config.d_id;
            this.schema = [];
            this.required = config.required;
            this.desc = config.desc = '请填写内容！';
            this.initField(config);
            this.$editobj = $('#listviewediticon' + this.id);
            this.$listcontent = $('#list-wrapper' + this.id).find('.list-content');
            this.newlistview(this.d_id, this.id);
        },
        initField: function(config) {
            var self = this;
            var html = self.parseHtml(config);
            this.$wrapper.append(html);
        },
        parseHtml: function(d) {
            d.d_id = d.id.substr(5, d.id.length);
            var tplHTML = '<% if(secret){ %>' +
                '<% } else{ %>' +
                '<div class="read_detail ' +
                '<% if(hidden!=undefined && hidden==true){ %>' +
                ' hidden ' +
                '<% } %>' +
                '<% if(writable){ %>' +
                'WriteDiv' +
                '<% } %>' +
                ' tag-listview">' +
                '<% if(required){ %>' +
                '<span class="isrequired">*</span>' +
                '<% } %>' +
                '<em><%=title%>：</em>' +
                '<input type="hidden" name="<%=id%>" value="<%=value%>" class="LIST_VIEW" />' +
                '<% if(dataSrc!=undefined && dataSrc==true && writable){ %>' +
                    '<div class="field">' +
                    '<a class="u-table-list-icon-dataset" href="javascript:void(0);"></a>' +
                    '</div>' +
                '<% } %>' +
                '<div class="field">' +
                '<a class="report-list-icon-create" href="javascript:void(0);"></a>' +
                '</div>' +
                '<div id="list-wrapper<%=id%>" class="list-wrapper" data-title="<%=title%>">' +
                '<div class="list-content"></div>' +
                '<div class="list-sum"></div>' +
                '</div>' +
                '</div>' +
                '<% } %>' +

                '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>';
            return $.tpl(tplHTML, d);
        },
        newlistview: function(listitem, listname) {
            var self = this;
            self.$config.fieldmanager.listocrdata = self.$config.fieldmanager.listocrdata || {};
            self.$config.fieldmanager.ocrlist = self.$config.fieldmanager.ocrlist || {};
            $.ajax({
                url: 'getListDataJson.php',
                type: 'POST',
                data: {
                    'RUN_ID': q_run_id,
                    'FLOW_ID': q_flow_id,
                    'PRCS_ID': q_prcs_id,
                    'FLOW_PRCS': q_flow_prcs,
                    'PRCS_KEY_ID': q_prcs_key_id,
                    'LIST_NAME': self.id,
                    'actionType': q_action_type
                },
                cache: false,
                async: false,
                success: function(d) {
                    self.$config.fieldmanager.listocrdata[self.id] = d;
                    d = JSON.parse(d);
                    self.schema = d.detail[0].schema;
                    var ListViewFieldManager = TListView.TListViewManager;
                    self.$config.fieldmanager.ocrlist[self.id]= self.list = new ListViewFieldManager({
                        wrapper: self.$listcontent,
                        fieldmanager: self.$config.fieldmanager
                    }, d);
                    // self.list = new ListViewFieldManager({
                    //     wrapper: self.$listcontent,
                    //     fieldmanager: self.$config.fieldmanager
                    // }, d);


                    saveFlag = 0;
                },
                error: function() {}
            });


        },
        bindCalc: function() {},
        getValue: function() {
            var self = this;
            this.list = self.$config.fieldmanager.ocrlist[this.id];
            return (this.list && this.list.serializeArray());
        },
        getData: function() {
            var ret = {};
            var self = this;
            this.list = self.$config.fieldmanager.ocrlist[this.id];
            ret.name = this.$config.id;
            ret.value = this.getValue();
            ret.sum = this.list.serializeSumArray();
            return ret;
        },
        onSubmit: function() {
            var self = this;
            var d_id = self.$config.d_id;
            var obj_val = self.getValue();
            var temp_name = 'DATA_data_m' + d_id;
            var temp_val = obj_val[temp_name];
            var temp_arr = temp_val.split('\n');
            var check_flag = true;
            var required_val = self.required;
            var low_id = self.low_id;
            if(temp_arr != ''){
                for(var i=0;i<temp_arr.length-1;i++){
                    temp_val_txt = temp_arr[i].split('`');
                    for(var j = 0; j <  self.schema.length; j++) {
                        var require =  self.schema[j].require;
                        if(temp_val_txt[j] == "" && require == 1) {
                                        check_flag = true;
                                        break;
                                    }else{
                                        check_flag = false;
                                    }
                        }

                }
            }else if(temp_arr == ''){
                for(var j = 0; j <  self.schema.length; j++) {
                    var require =  self.schema[j].require;
                    if(require == 1) {
                        check_flag = true;
                        break;
                    }else{
                        if(required_val){
                            check_flag = true;

                        }else{
                            check_flag = false;
                        }
                    }
                }

        }
           if( check_flag == true){
                self.validation(self.desc);
                setTimeout(function() {
                    $("#div_alert_" + self.$config.id + "").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
        },
        validation: function(s) {
            $("#div_alert_" + this.id + "").addClass("div_alert_show");
        },

        setOcrValue:function(data)
        {
           //   this.list.setOcrValue(data);
        }
    });
    exports.TListViewCtrl = window.TListViewCtrl = TListViewCtrl
})
