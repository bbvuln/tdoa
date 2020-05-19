define('SelectCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var SelectCtrl = Base.extend({
        initialize: function(config) {
            SelectCtrl.superclass.initialize.call(this, config);
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
            this.bindEvent();
			      this._config.value = new_config.value;
        },
        render_option:function(val){
          var html = "";
          var options = $.extend(true, [], this._config.options);
          var value = this._config.value;
          var multi  = this._config.multi;
          if(val){
            options.push({code:val,name:val})
          }
          for(var i in options){
              var check = value.indexOf(options[i].code)!=-1?'menu-item-selected':'';
              console.log(options[i].name);
              html += "<li name="+ options[i].name +" value="+ options[i].code +" class="+ check +"><span>"+ options[i].name +"</span></li>"
          }
          this.$el.find('.autoComplete-select ul').html(html);
        },
        validate: function() {
            var value = this._config.value;
            var name  = this._config.name;
            var multi  = this._config.multi;
            //验证必填
            var required = this._config.required;
            if(required){
                if(multi){
                    if(value.length <= 0){
                        alert('字段'+name+"为必填字段");
                        return false;
                    }
                }else{
                    if($.trim(value) == ""){
                        alert('字段'+name+"为必选字段");
                        return false;
                    }
                }
            }else{
                return true;
            }
        },
        getValue: function() {
            var self = this;
            if (this._config.multi) {
                return (self._config.value && self._config.value.length) ? self._config.value : [];
            } else {
                return self._config.value ? self._config.value : '';
            }
        },
        triggerCalc: function(obj_res) {
            if(this._config.effect){
                this._config.fieldManager.calc(this._config.field_id, obj_res);
            }
        },
        removeByValue: function(val) {
          var self = this;
          var value = $.extend(true, [], self._config.value);
          for(var i in value){
            if(value[i] == val) {
			           value.splice(i, 1);
			           break;
		        }
          }
          self._config.value = value
        },
        triggerValidate: function(obj_res) {
            if(this._config.trigger || obj_res.trigger){
                this._config.fieldManager.triggerTrig(obj_res.triggerFields);
            }
        },
        bindEvent: function() {
            var self = this;
            this.$el.find('select').on('change', function() {
                self._config.value = $(this).val();
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
            })

            // this.$el.find('.autoComplete-iniput').bind("input propertychange", function() {
            //   self.$el.find('.autoComplete-select').show()
            //    var val =  $(this).attr('value')
            //   self.render_option(val)
            // })
            //
            // this.$el.find('.autoComplete-iniput').on('focus', function() {
            //   self.$el.find('.autoComplete-select').show()
            //   self.render_option()
            // })
            //
            // this.$el.find('.autoComplete-iniput').on('blur', function() {
            //   self.$el.find('.autoComplete-select').hide()
            // })
            //
            // this.$el.find('.autoComplete-select').on("mousedown","li", function(event) {
            //     event.preventDefault();
            //     var multi  = self._config.multi;
            //     var val =  $(this).attr('value');
            //       if(multi){
            //         if(self._config.value.indexOf(val)!=-1){
            //             self.removeByValue(val)
            //         }else{
            //           if(val!=0){
            //             self._config.value.push(val);
            //           }
            //         }
            //       }else{
            //         self._config.value = val
            //       }
            //       var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
            //       self.triggerCalc(obj_res);
            //       self.triggerValidate(obj_res);
            //       self.reRender(self._config)
            //       self.$el.find('.autoComplete-iniput').attr('value',$(this).attr('name'))
            //       self.$el.find('.autoComplete-select').hide()
            // })
        }
    });
    exports.SelectCtrl = window.SelectCtrl = SelectCtrl;
});
