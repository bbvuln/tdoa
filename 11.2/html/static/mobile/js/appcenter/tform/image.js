define('ImageCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var ImageCtrl = Base.extend({
        initialize: function(config) {
            ImageCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
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
            var multi = self._config.multi;
            var hidden = self._config.writable&&self._config.is_delete ? "" : "hide";
            this.$el.find('button').on('click', function(){
                tMobileSDK.chooseImage({
                    multiple: multi ? true : false,
                    max: 9,
                    fromCamera: false,
                    onSuccess: function(result){
                        if(multi){
                            for(var i=0;i<result.length; i++ ){
                                var img_html ='<a class="ui-attach-img-wrap pda_attach" data-id="'+ result[i].id +'" is_image="1" href="'+ result[i].url +'" _href="'+ result[i].url +'"><i class="ui-icon-close-progress icon-delete '+hidden+'"></i><img class="ui-attach-img" src="'+result[i].url +'" /><p class="ui-attch-img-name" data-url="'+ result[i].href +'data-id="' + result[i].id + '">'+ result[i].name.replace("*","")+'</p></a>';
                                self.$el.find('.ui-images-list').append(img_html);
                                self._config.value = self._config.value.concat([{
                                    "attach_id": result[i].id,
                                    "attach_name": result[i].name.replace("*",""),
                                    /* "attach_url": {
                                        "down": result[i].url,
                                        "view": result[i].url,
                                        "office_read": result[i].url
                                    } */
                                }])
                            }
                        }else{
                            var img_html ='<a class="ui-attach-img-wrap pda_attach" data-id="'+ result[0].id +'" is_image="1" href="'+ result[0].url +'" _href="'+ result[0].url +'"><i class="ui-icon-close-progress icon-delete  '+hidden+'"></i><img class="ui-attach-img" src="'+result[0].url +'" /><p class="ui-attch-img-name" data-url="'+ result[0].href +'data-id="' + result[0].id + '">'+ result[0].name.replace("*","")+'</p></a>';
                            self.$el.find('.ui-images-list').html(img_html);
                            self._config.value = [{
                                "attach_id": result[0].id,
                                "attach_name": result[0].name.replace("*",""),
  /*                               "attach_url": {
                                    "down": result[i].url,
                                    "view": result[i].url,
                                    "office_read": result[i].url
                                } */
                            }]
                        }
                        // self.triggerCalc()
                        var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                        self.triggerCalc(obj_res);
                        self.triggerValidate(obj_res);
                    },
                    onFail: function(result){
                        alert("上传图片失败：" + result);
                    }
                });
            })

            this.$el.delegate('i.ui-icon-close-progress', 'tap', function(e) {
                var attach_id = $(this).parent('.ui-attach-img-wrap').attr('data-id');
                $(this).parent('.ui-attach-img-wrap').remove();
                self._config.value = self._config.value.filter(function(item){
                    if(item.attach_id != attach_id){
                        return item
                    }
                })
                //alert(JSON.stringify(self._config.value))
                e.stopPropagation();
				return false;
            })
        }
    });
    exports.ImageCtrl = window.ImageCtrl = ImageCtrl;
});
