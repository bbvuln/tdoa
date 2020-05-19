define('AttachmentCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var AttachmentCtrl = Base.extend({
        initialize: function(config) {
            AttachmentCtrl.superclass.initialize.call(this, config);
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
            //后台无法解析attach_url,先置空
            var values =  this._config.value;
            for (var i=0; i<values.length;i++){
                values[i].attach_url ={};
            }
            return values;
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
            var hidden = self._config.writable&&self._config.is_delete ? "" : "hide";
            var multi = self._config.multi;
            self.$el.find('button').on('click', function() {
                // var loader = $.loading({ content:'加载中...',});
                tMobileSDK.selectFile({
                    multiple: multi ? true : false,
                    onSuccess: function(data) {
						             if(multi){
                            for (var i = 0; i < data.length; i++) {
                                var attach_html = '<a class="ui-attch-file-wrap pda_attach" href="javascript:;" _href="'+ data[i].url +'" data-url="' + data[i].url + '" data-id="' + data[i].id + '"><span>' + data[i].name.replace("*", "") + '</span><i class="ui-icon-close-progress icon-delete '+hidden+'"></i></a>';
                                self.$el.find('.ui-attach-file').append(attach_html);
                                self._config.value = self._config.value.concat([{
                                    "attach_id": data[i].id,
                                    "attach_name": data[i].name.replace("*",""),
                                }])
                            }
                        }else {
                            var attach_html = '<a class="ui-attch-file-wrap pda_attach" href="javascript:;" _href="'+ data[0].url +'" data-url="' + data[0].url + '" data-id="' + data[0].id + '"><span>' + data[0].name.replace("*", "") + '</span><i class="ui-icon-close-progress icon-delete '+hidden+'"></i></a>';
                            self.$el.find('.ui-attach-file').html(attach_html);
                            self._config.value = [{
                                "attach_id": data[0].id,
                                "attach_name": data[0].name.replace("*",""),
                            }]
                        }
						/*
						if(multi){
                            for (var i = 0; i < data.length; i++) {
                                var attach_html = '<a class="ui-attch-file-wrap pda_attach" href="'+ data[i].url +'" _href="'+ data[i].url +'"><a href="javascript:;" class="ui-attch-file-name" data-url="' + data[i].url + '" data-id="' + data[i].id + '">' + data[i].name.replace("*", "") + '</a><i class="ui-icon-close-progress"></i></a>';
                                self.$el.find('.ui-attach-file').append(attach_html);
                                self._config.value = self._config.value.concat([{
                                    "attach_id": data[i].id,
                                    "attach_name": data[i].name.replace("*",""),
                                }])
                            }
                        }else {
                            var attach_html = '<a class="ui-attch-file-wrap pda_attach" href="'+ data[0].url +'" _href="'+ data[0].url +'"><a href="javascript:;"  class="ui-attch-file-name" data-url="' + data[0].url + '" data-id="' + data[0].id + '">' + data[0].name.replace("*", "") + '</a><i class="ui-icon-close-progress"></i></a>';
                            self.$el.find('.ui-attach-file').html(attach_html);
                            self._config.value = [{
                                "attach_id": data[0].id,
                                "attach_name": data[0].name.replace("*",""),
                            }]
                        }
						*/
                        // self.triggerCalc();
                        // self.triggerValidate();
                        var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                        self.triggerCalc(obj_res);
                        self.triggerValidate(obj_res);
                        // loader.loading("hide");
                    },
                    onFail: function(data) {
                        alert("上传文件失败：" + data);
                        //loader.loading("hide");
                    }
                });

            })

            this.$el.delegate('i.ui-icon-close-progress', 'tap', function(e) {
				e.stopPropagation();
                var attach_id = $(this).parent('.ui-attch-file-wrap').attr('data-id');
                $(this).parent('a.ui-attch-file-wrap').remove();
                self._config.value = self._config.value.filter(function(item){
                    if(item.attach_id != attach_id){
                        return item;
                    }
                })
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
				return false
            })
        }
    });
    exports.AttachmentCtrl = window.AttachmentCtrl = AttachmentCtrl;
});
