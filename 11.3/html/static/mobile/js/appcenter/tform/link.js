define('LinkCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var LinkCtrl = Base.extend({
        initialize: function(config) {
            LinkCtrl.superclass.initialize.call(this, config);
            this._config = config;
            //this._config.required = false;
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
            return true;
        },
        getValue: function() {
            return '';
        },
        triggerCalc: function() {
            if(this._config.effect){
                this._config.fieldManager.calc(this._config.field_id);
            }
        },
        triggerValidate: function() {
            if(this._config.trigger){
                this._config.fieldManager.triggerTrig(this._config);
            }
        },
        bindEvent: function() {
            var self = this;
            self.$el.on('tap', function() {
                var data =  $.isFunction(self._config.fieldManager.getData) && self._config.fieldManager.getData();
				//console.log(JSON.stringify(data))
				data = JSON.stringify(data)
                $.ajax({
                    type: "POST",
                    url: "/general/appbuilder/web/appcenter/appdata/link",
                    data: {
                        formId: store.formInfo.formId, //表单id
                        data: data, //所有数据 数组
                        field_id: self._config.field_id, //点击的链接字段id
                        index: 1, //可选 列表子字段需要传行号，主表传1
						            from: 'mobile',
                        run_key: store.run_key
                    },
                    success: function(response) {
                        if (response.status == 'ok') {
                            // var data = response.data;
                            // var formId = data.formId;
                            // var userid = data.userid;
                            // var time = data.time;
							// var did = data.did;
							var did = data.did;
                            var $link = self.$el.find('a');
                            //$link.attr('href','/pda/appcenter/handle.php?type=read&formId='+formId+'&userid='+userid+'&time='+time+'&did='+ did +'#handle');
                            if(response.url.indexOf("#") == -1){
                                response.url += "#handle";
                            }
                            $link.attr('href',response.url)
                            window.location.href= response.url
              //               // console.log(response.url)
							// $link.trigger('click')
                            // self.triggerCalc();
                            // self.triggerValidate();
                        }
                    }
                })
            })
        }
    });
    exports.LinkCtrl = window.LinkCtrl = LinkCtrl;
});
