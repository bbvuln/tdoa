define('ListCtrl', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var ListView = require('ListView');
    var ListCtrl = Base.extend({
        initialize: function (config) {
            ListCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._config.required = false;
            //this._config.hidden = false;
            this._render();
            this.pageSize = 10;
            //this.all_page = {};
            this.$el = $('#f-field-' + this._config.pure_id);
            this.$listcontent = $('#f-field-list-' + this._config.pure_id);
            this.$listpage = this.$el.find('.list-page');
            this.old_value = {}//当前编辑项的原数据
            this.renderPage()
            this.renderherData()
            //self.listViewManager = null;
            this.newListView();
        },
        _render: function () {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        pageCount: function (totalnum, limit) {//一共有多少页
            return totalnum > 0 ? ((totalnum < limit) ? 1 : ((totalnum % limit) ? (parseInt(totalnum / limit) + 1) : (totalnum / limit))) : 0;
        },
        renderherData:function(){
          var str = '<div class="list-content"><div class="list-gatherData-title">汇总</div><div class="list-gatherData-content">'
          var self = this;
          if(self._config.hasGather){
            self._config.subFields.map((item,index) => {
                  var value = self._config.gatherData[item.field_id]
                                      if(value){
                                        if(item.type=='currency'){
                                          str += '<label>'+item.name+':'+item.sign+' '+value+'</label>';
                                        }else{
                                          str += '<label>'+item.name+':'+value+'</label>';
                                        }
                                      }
                             })
                             str+= '</div></div>'
                             self.$el.find('.list-gatherData').html(str)
                             if (this._config.value.length == 0) {
                               var html =''
                               self.$el.find('.list-gatherData').html(html);
                             }
          }

        },
        setherdata:function(){
          var hasGather = this._config.hasGather;
          var value = this._config.value;
          var subFields = this._config.subFields;
          var gatherData = this._config.gatherData;
          var self = this;
          for(var i in subFields){
            var subFieldId = subFields[i].field_id;
            if(hasGather && gatherData[subFieldId]){
                  var gather_val = parseFloat(gatherData[subFieldId]);
                  var subFieldValue = self._config.value.filter(subfield => subfield['index'] === self.old_value.index);
                  let subfield = subFields.filter(subfield => subfield['field_id'] === subFieldId);
                  var totalCount = self._config.totalCount
                  var old_value = self.old_value.data.filter(old_field => old_field['field_id'] === subFieldId );
                  subFieldValue =  subFieldValue[0].data.filter(subfield => subfield['field_id'] === subFieldId);
                  subfield = subfield[0];
                  old_value = parseFloat(old_value[0].value||0);
                  subFieldValue = parseFloat(subFieldValue[0].value||0);
                  switch(subfield['gatherType']){
                        case 'sum':
                            gather_val = gather_val - old_value  + subFieldValue;
                            break;
                        case 'avg':
                            gather_val = (gather_val * totalCount - old_value + subFieldValue) / totalCount;
                            gather_val = gather_val.toFixed(subfield.fixTo);
                            break;
                        case 'max':
                            if(gather_val < subFieldValue){
                              gather_val = subFieldValue;
                            }
                            break;
                        case 'min':
                          if(gather_val > subFieldValue){
                              gather_val = subFieldValue;
                            }
                            break;
                  }
                  gatherData[subFieldId] = gather_val;
                  self._config.gatherData = gatherData;
                }
          }
          self.renderherData()
        },
        synchListValue: function (item) {
            var value = this._config.value;
            var self = this;
            if (item.cfg.flag == 'new') {
                this._config.value[value.length - 1].data = item.cfg.data;
                self.newListView()
            } else if (item.cfg.flag == 'delete') {
                self.delRow(item.cfg.index)
                self.renderherData()
            }else{
              for (var i in this._config.value) {
                    if (this._config.value[i].index == item.cfg.index) {
                        this._config.value[i].data = item.cfg.data;
                    }
                }
              self.setherdata()
            }
            //已经在删除接口里处理过了，你这不再执行触发器 lhs 190809
            //尝试在删除列表控件行或修改列表控件值的时候执行触发器，代码实在太乱了，这样写不保证没有问题 tianlin 20180305
            // if (item.cfg.flag == 'delete' && this._config.add_edit_delete_trigger) {
            //     this._config.fieldManager && this._config.fieldManager.triggerTrig(this._config);
            // }
        },
        getDataFromStore: function () {
            var fieldsMap = store.fieldsMap
            var data = []
            for (var i in fieldsMap) {
                var type = fieldsMap[i].type
                if (type == 'list') {
                    var value = fieldsMap[i].value
                    for (var j in value) {
                        if (value[j].data instanceof Array === true) {
                            var hash = {};
                            value[j].data.forEach(function (item) {
                                var item_data = {};
                                item_data.field_id = item.field_id;
                                item_data.value = item.value;
                                hash[item.field_id] = item_data;
                            })
                            value[j].data = hash;
                        }
                        delete value[j].num;
                        delete value[j].flag;
                        delete value[j].index;
                        delete value[j].edit_op;
                        delete value[j].delete_op;
                        delete value[j].name;
                    }
                    data.push({
                        field_id: fieldsMap[i].field_id,
                        value: value
                    })
                } else {
                    data.push({
                        field_id: fieldsMap[i].field_id,
                        value: value
                    })
                }
            }
            return data
        },
        renderPage: function () { //渲染分页
            var self = this;
              var totalPage = this.pageCount(this._config.totalCount, this.pageSize);
            var html = '';
            if (this._config.value.length == 0) {
                self.$listpage.html(html);
            } else {
              self.$listpage.paging({
                nowPage: parseInt(self._config.page), // 当前页码,默认为1
                pageNum: totalPage, // 总页码
                buttonNum: 5, //要展示的页码数量，默认为7，若小于5则为5
                callback: function(num) { //回调函数,num为当前页码
                  self._config.page = num
                  store.all_page[self._config.field_id] = {page: num, pageSize: self.pageSize};
                  self.nextpagedata()
                }
              });
            }
        },
        validate: function () {
            var instance = this._config
            var isRequiredEmpty = false;
            var requiredSubFields = [];
            var checkKindSubFields = [];
            for (var j in instance.subFields) {
                if (typeof instance.subFields[j] === "function") continue
                var instance2 = instance.subFields[j]
                if (instance2.required) {
                    requiredSubFields.push(instance2);
                }
                if (instance2.type == 'text' && (instance2.kind == 'phone' || instance2.kind == 'tele' || instance2.kind == 'postcode' || instance2.kind == 'email' || instance2.kind == 'idnumber')) {
                    checkKindSubFields.push(instance2)
                }
            }
            if (instance.value && (requiredSubFields || checkKindSubFields)) {
                for (var k in instance.value) {
                    if (typeof instance.value[k] === "function") continue
                    if (requiredSubFields) {
                        for (var j in requiredSubFields) {
                            if (typeof requiredSubFields[j] === "function") continue
                            var instance2 = requiredSubFields[j]
                            for (var h in instance.value[k]['data']) {
                                if (instance.value[k]['data'][h].field_id == instance2.field_id) {
                                    instance2.value = instance.value[k]['data'][h].value
                                }
                            }
                            // instance2.value = instance.value[k]['data'][instance2.field_id]['value']
                            if (instance2.value === '' || instance2.value == null || instance2.value.length <= 0) {
                                isRequiredEmpty = true
                            }
                            if (instance2.type == "address") {
                                if (instance2.value.prov.id == '' || instance2.value.prov.id == null) {
                                    isRequiredEmpty = true
                                }
                            }
                            if (instance2.type == "location") {
                                if (instance2.value.lat == '' || instance2.value.lat == null) {
                                    isRequiredEmpty = true
                                }
                            }
                            //一旦有必填字段为空，退出不保存
                            if (isRequiredEmpty === true) {
                                alert('字段“' + instance.name + '.' + instance2.name + '”为必填字段')
                                return false
                            }
                        }
                    }
                    if (checkKindSubFields) {
                        for (var j in checkKindSubFields) {
                            if (typeof checkKindSubFields[j] === "function") continue
                            var instance2 = checkKindSubFields[j]
                            instance2.value = instance.value[k]['data'][instance2.field_id]['value']
                            if (instance2.type == 'text' && instance2.value) {
                                var phone = /^1[3578]\d{9}$/;
                                var tele = /(\(\d{3,4}\)|\d{3,4}-|\s)?(\d{3,10}(-\d{1,4}){0,1})/;
                                var postcode = /[1-9]\d{5}(?!\d)/;
                                var email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
                                var idnumber = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                                if (instance2.kind == 'phone') {
                                    if (!phone.test(instance2.value)) {
                                        alert('字段“' + instance.name + '.' + instance2.name + '”不是标准的手机号码格式')
                                        return false
                                    }
                                } else if (instance2.kind == 'tele') {
                                    if (!tele.test(instance2.value)) {
                                        alert('字段“' + instance.name + '.' + instance2.name + '”不是标准的电话号码格式')
                                        return false
                                    }
                                } else if (instance2.kind == 'postcode') {
                                    if (!postcode.test(instance2.value)) {
                                        alert('字段“' + instance.name + '.' + instance2.name + '”不是标准的邮政编码格式')
                                        return false
                                    }
                                } else if (instance2.kind == 'email') {
                                    if (!email.test(instance2.value)) {
                                        alert('字段“' + instance.name + '.' + instance2.name + '”不是标准的电子邮箱格式')
                                        return false
                                    }
                                } else if (instance2.kind == 'idnumber') {
                                    if (!idnumber.test(instance2.value)) {
                                        alert('字段“' + instance.name + '.' + instance2.name + '”不是标准的身份证格式')
                                        return false
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return true
        },
        reRender: function (data) {
            var self = this;
            var ListViewManager = ListView.ListViewManager;
            if (window.listHandleIndex) {
                self.listViewManager.triggerRerender(data);
            } /*else*/ {
                self._config = data;
                //给_config初始化fieldManager，lhs 18.08.28
                self._config["fieldManager"] = self._config.fieldManager != null ? self._config.fieldManager : self.listViewManager.fieldManager;
                self.listViewManager = new ListViewManager({
                    wrapper: self.$listcontent,
                    fieldManager: self._config.fieldManager
                }, {detail: [self._config]});
            }
            self.renderherData()
            self.renderPage()
            return;
            //var self = this;
            //var ListViewManager = ListView.ListViewManager;
            //self.listViewManager.triggerRerender(data)
        },
        getValue: function () {
            //以下语句写法有误，会导致this._config.value结构与value一同被修改，lhs 18.08.28
            //var value = $.extend([],this._config.value,true);
            var value = [];
            var value = $.extend(true, value, this._config.value);
            for (var i in value) {
                if (value[i].data instanceof Array === true) {
                    var hash = {};
                    value[i].data.forEach(function (item) {
                        var item_data = {};
                        item_data.field_id = item.field_id;
                        item_data.value = item.value;
                        hash[item.field_id] = item_data;
                        if (value[i].flag == 'delete') {
                            value[i].flag = ''
                        }
                    })
                    value[i].data = hash;
                }
                delete value[i].num;
                delete value[i].edit_op;
                delete value[i].delete_op;
                delete value[i].name;
            }
            return value;
        },

        addlistvalue: function () {
            delete window.listHandleIndex; //新建之前先删除上次新建行的index  listHandleIndex用于列表触发器回填
            var self = this;
            var formId = store.formInfo.formId,
                userid = store.formInfo.userid,
                time = store.formInfo.time,
                type = store.formInfo.type,
                flow_prcs = store.formInfo.flow_prcs,
                did = store.formInfo.did,
                run_id = store.formInfo.run_id,
                prcs_id = store.formInfo.prcs_id
            var pagedata = $.extend(true, {}, this._config);
            pagedata['activeRowKeys'] = [0]
            delete pagedata.container
            delete pagedata.fieldsMap
            delete pagedata.fieldManager
            delete pagedata.template
            delete pagedata.schema
            delete pagedata.attrs
            delete pagedata.pure_id
            pagedata.value = self.getValue()
            $.ajax({
                type: "post",
                url: "/general/appbuilder/web/appcenter/appdata/addrecord",
                data: {
                    formId: formId,
                    did: did,
                    field_id: self._config.field_id,
                    arr_field: JSON.stringify(pagedata),
                    page: self._config.page,
                    pageSize: self.pageSize,
                    run_key: store.run_key,
                    userid: userid,
                    time: time,
                    flow_prcs: flow_prcs,
                    type: type,
                    data: JSON.stringify(self._config.fieldManager.getData()),//self.getDataFromStore()),
                    all_page: store.all_page,
                    run_id: run_id,
                    prcs_id: prcs_id
                },
                async: false,
                success: function (response) {
                    var data = response.data
                    self._config.value = data[self._config.field_id].value
                    var value = data[self._config.field_id].value
                    window.listHandleIndex = value[value.length - 1].index;
                    self._config.totalCount = data[self._config.field_id].totalCount
                    self._config.page = data[self._config.field_id].page
                    self.renderPage()
                    var new_fieldsMap = data
                    var fieldManager = self._config.fieldManager;
                    for(var i in new_fieldsMap){
                        if(fieldManager.instances[i].reRender){
                            fieldManager.instances[i]._config.value = new_fieldsMap[i].value;
                            fieldManager.instances[i]._config.tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
                            fieldManager.instances[i]._config.color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
                            fieldManager.instances[i]._config.options = new_fieldsMap[i].options ? new_fieldsMap[i].options : [];
                            fieldManager.instances[i].reRender(fieldManager.instances[i]._config)
                        }
                    }
                },
                error: function () {
                    alert('添加记录失败')
                }
            })
        },
        newListView: function () {
            var self = this;
            var ListViewManager = ListView.ListViewManager;
            self.listViewManager = new ListViewManager({
                wrapper: self.$listcontent,
                fieldManager: self._config.fieldManager
            }, {detail: [self._config]}); //self._config.value[0].data只有field_id和value两个字段
        },
        nextpagedata: function () {
            var self = this;
            var formId = store.formInfo.formId,
                userid = store.formInfo.userid,
                time = store.formInfo.time,
                type = store.formInfo.type,
                flow_prcs = store.formInfo.flow_prcs,
                did = store.formInfo.did,
                run_id = store.formInfo.run_id,
                prcs_id = store.formInfo.prcs_id,
                key = store.formInfo.key,
                prcs_key_id = store.formInfo.prcs_key_id
            var _array = key.split('_')
            var _did = _array[2]
            if (_did) {
                did = _did
            }
            var pagedata = $.extend(true, {}, this._config);
            delete pagedata.container
            delete pagedata.fieldManager
            delete pagedata.template
            delete pagedata.schema
            delete pagedata.pure_id
            pagedata.value = self.getValue()
            var obj = {
                formId: formId,
                userid: userid,
                time: time,
                type: type,
                run_id: run_id,
                prcs_key_id: prcs_key_id,
                prcs_id: prcs_id,
                flow_prcs: flow_prcs,
                key: key,
                did: did,
                field_id: self._config.field_id,
                arr_field: JSON.stringify(pagedata),
                page: self._config.page,
                all_page: store.all_page,
                pageSize: self.pageSize,
                run_key: store.run_key
            }

            $.ajax({
                type: "post",
                url: "/general/appbuilder/web/appcenter/appdata/nextpagedata",
                data: obj,
                async: true,
                success: function (response) {
                    if (response.status != "ok") {
                        alert('获取下一页数据失败')
                        return false
                    } else {
                        self._config.value = response.data
                        self._config.page = response.page
                        self.newListView()
                        self.renderPage()
                    }
                },
                error: function () {
                    alert('获取下一页数据失败')
                }
            })
        },
        delRow: function (index) {
            var self = this;
            var formId = store.formInfo.formId,
                userid = store.formInfo.userid,
                time = store.formInfo.time,
                type = store.formInfo.type,
                flow_prcs = store.formInfo.flow_prcs,
                did = store.formInfo.did,
                run_id = store.formInfo.run_id,
                prcs_id = store.formInfo.prcs_id
            var pagedata = $.extend(true, {}, this._config);
            pagedata['activeRowKeys'] = [0]
            delete pagedata.container
            delete pagedata.fieldManager
            delete pagedata.template
            delete pagedata.schema
            delete pagedata.pure_id
            pagedata.value = self.getValue()
            var obj = {
                formId: formId,
                did: did,
                field_id: self._config.field_id,
                index: index,
                arr_field: JSON.stringify(pagedata),
                page: self._config.page,
                pageSize: self.pageSize,
                run_key: store.run_key,
                userid: userid,
                time: time,
                flow_prcs: flow_prcs,
                type: type,
                data: JSON.stringify(self._config.fieldManager.getData()),//self.getDataFromStore()),
                all_page: store.all_page,
                run_id: run_id,
                prcs_id: prcs_id
            }
            $.ajax({
                type: "post",
                url: "/general/appbuilder/web/appcenter/appdata/deleterecord",
                data: obj,
                async: false,
                success: function (response) {
                    if (response.status != "ok") {
                        alert('删除记录失败')
                        return false
                    } else {
                        var new_fieldsMap = response.data
                        var fieldManager = self._config.fieldManager;
                        for(var i in new_fieldsMap){
                            if(fieldManager.instances[i].reRender){
                                fieldManager.instances[i]._config.value = new_fieldsMap[i].value;
                                fieldManager.instances[i]._config.tip = new_fieldsMap[i].tip ? new_fieldsMap[i].tip : '';
                                fieldManager.instances[i]._config.color = new_fieldsMap[i].color ? new_fieldsMap[i].color : '';
                                fieldManager.instances[i]._config.options = new_fieldsMap[i].options ? new_fieldsMap[i].options : [];
                                fieldManager.instances[i].reRender(fieldManager.instances[i]._config)
                            }
                        }
                        self._config.value = new_fieldsMap[self._config.field_id].value
                        self._config.totalCount = new_fieldsMap[self._config.field_id].totalCount
                        self._config.page = new_fieldsMap[self._config.field_id].page
                        self._config.gatherData =  new_fieldsMap[self._config.field_id].gatherData
                        self.renderPage()
                    }
                },
                error: function () {
                    alert('删除记录失败')
                }
            })
        }
    });
    exports.ListCtrl = window.ListCtrl = ListCtrl;
});
