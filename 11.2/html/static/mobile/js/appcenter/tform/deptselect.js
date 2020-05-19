define('DeptselectCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var DeptselectCtrl = Base.extend({
        initialize: function(config) {
            DeptselectCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-' + this._config.pure_id);
            this.bindEvent();
        },

        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
		
        reRender: function(new_config) {
            //生成新dom，替换旧dom
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
			this._config.value = new_config.value;
            this.bindEvent();
        },

        validate: function() {
            var value = this._config.value;
            var name  = this._config.name;
            //验证必填
            var required = this._config.required;
            if(required && value.length <= 0){
                alert('字段'+name+"为必填字段");
                return false;
            }else{
                return true;
            }
        },

        getValue: function() {
            return this._config.value;
        },
        triggerCalc: function(obj_res) {
            if(this._config.effect){
                this._config.fieldManager.calc(this._config.field_id, obj_res);
            }
        },
        triggerValidate: function(obj_res) {
            if(this._config.trigger || obj_res.trigger){
                this._config.fieldManager.triggerTrig(obj_res.triggerFields);
            }
        },
        bindEvent: function() {
            var self = this;
            var multi = self._config.multi;
            this.$el.find('button').on('click', function() {
                var depts = [];
                self._config.value.forEach(function(dept){
                    depts.push(dept.dept_id);
                })
                tMobileSDK.selectDept({
                    multiple: multi ? true : false,
                    depts: depts,
                    onSuccess: function(result) {
                        //alert(JSON.stringify(result))
                        if(multi){
                            self.$el.find('.ui-deptselect-list').empty();
                            self._config.value = [];
                            if (result.length === 0 ){
                                return false;
                            }else{
                                for (var i = 0; i < result.length; i++) {
                                    var dept_html = '<a href="javascript:;" class="ui-form-tag" data-deptid="' + result[i].deptId + '">' + result[i].deptName + '</a>';
                                    self.$el.find('.ui-deptselect-list').append(dept_html);
                                    self._config.value = self._config.value.concat([{
                                        "dept_id": result[i].deptId,
                                        "dept_name": result[i].deptName
                                    }])
                                }
                            }
                            
                        }else{
                            var dept_html = '<a href="javascript:;" class="ui-form-tag" data-deptid="' + result[0].deptId + '">' + result[0].deptName + '</a>';
                            self.$el.find('.ui-deptselect-list').html(dept_html);
                            self._config.value = [{
                                "dept_id": result[0].deptId,
                                "dept_name": result[0].deptName
                            }]
                        }
                        // self.triggerCalc();
                        // self.triggerValidate();
                        var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                        self.triggerCalc(obj_res);
                        self.triggerValidate(obj_res);
                    },
                    onFail: function(data) {
                        alert("选择部门失败：" + data);
                    }
                });
            })
        }
    });
    exports.DeptselectCtrl = window.DeptselectCtrl = DeptselectCtrl;
});
