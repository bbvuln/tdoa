define('SignatureCtrl', function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var SignatureCtrl = Base.extend({
        initialize: function(config) {
            this.lPenColor = config.lPenColor;
            SignatureCtrl.superclass.initialize.call(this, config);
            this._config = config;
            // console.log(JSON.stringify(this._config.signLockValue))
            this._config.signLockValue = JSON.stringify(this._config.signLockValue)
            //this._config.required = false;
            this._render();
            this.$el = $('#f-field-' + this._config.pure_id);
            this.id = config.pure_id;
            this.name = config.pure_id+new Date().getTime()
            this.bindEvent();
            this.goToShowWebSeal(this.id);
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
            var value = this.$el.find('.web_Seal').attr('value');
            var name  = this._config.name;
            var required = this._config.required;
			//验证必填
            if(required && $.trim(value) == ""){
                alert('字段'+name+"为必填字段");
                return false;
            }
        },
        getValue: function() {
            return this.$el.find('.web_Seal').attr('value');
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
        resizeCanvas: function(){
          var canvas = document.querySelector("canvas");
          canvas.style.height = (document.documentElement.clientHeight-100) + 'px';
          canvas.style.width = document.documentElement.clientWidth-2 + 'px';
          var ratio =  Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);
        },
        binding:function(cur_item){//绑定签章信息
            var str =''
            var item_check = JSON.parse($('#f-field-'+cur_item+' .signLockValue').val())
            var fieldlist = store.fieldsMap;
          var fieldsMap = []
        for (var i in fieldlist) {
          fieldsMap.push(fieldlist[i]); //属性
        }
               if(item_check.length!=0)
               {
                  for (var i = 0; i < item_check.length; i++) {
                    var label =  item_check[i].label;
                  if(item_check[i].is_list=='1'){
                      for (var j = 0; j < fieldsMap.length; j++) {
                              if(item_check[i].list_field == fieldsMap[j].field_id){
                                var value = getsigninfo(JSON.stringify(fieldsMap[j]),this.props.rowKey,item_check[i].label)
                                      str += label + '_separator' + value
                              }
                      }
                  }else{
              for (var h = 0; h < fieldsMap.length; h++) {
                      if(label == fieldsMap[h].field_id){
                        var value =''
                        if(fieldsMap[h].type=='number'||fieldsMap[h].type=='currency'){
                          if(fieldsMap[h].value!=''){
    													value += parseFloat(fieldsMap[h].value)
    											}else{
    												value += ''
    											}
                        }else if(fieldsMap[h].type=='multi-text'){
                          	value += fieldsMap[h].value.replace(/\n/g,"")
                        }else if(fieldsMap[h].type=='user-select'||fieldsMap[h].type=='dept-select'){
                            for(var i=0;i<fieldsMap[h].value.length;i++){
                                if(fieldsMap[h].type=='dept-select'){
                                    value += fieldsMap[h].value[i].dept_id + fieldsMap[h].value[i].dept_name
                                }else{
                                    value += fieldsMap[h].value[i].uid + fieldsMap[h].value[i].username
                                }
                            }
                        }else if(fieldsMap[h].type=='progressBar'){
    											if(fieldsMap[h].value==''){
    												value+='0'
    											}else{
                            value+= fieldsMap[h].value
                          }
    										}else if(fieldsMap[h].type=='address'){
                            value = fieldsMap[h].value.prov.name+fieldsMap[h].value.city.name+fieldsMap[h].value.country.name
                        }else{
                            value =fieldsMap[h].value
                        }
                          str += label + '_separator' + value
                      }
              }
              }
               }
              }
              return str
        },
        getWebWritePage: function(item){//手写
            var self = this;
            var str =  self.binding(item);
            $.ajax({
                type: 'POST',
                url: 'newWrite2/mobileWrite.php',
                cache: false,
                data: {'item':item+'_hw_','cur_name':item+'_hw_','protectVal':str,"list_flag":'0',lPenColor:this.lPenColor},
                beforeSend: function(){
                    $.ProLoading.show();
                },
                success: function(data)
                {
                    pages.to("new_write")
                    $("#scroller_new_write").html(data);
                    self.resizeCanvas();
                    $.ProLoading.hide();
                },
                error: function(data){
                     $.ProLoading.hide();
                }
            });
        },
        goToShowWebSeal: function(cur_item)//查看
        {
            var self = this;
            var mobile_auth_websign_code = window.mobile_auth_websign_code;
          var str =  self.binding(cur_item);
            $("#f-field-"+cur_item+" #signbox").empty();
            var data = $("#f-field-"+cur_item+" .web_Seal").val()
            if(data==''){
                return false
            }else{
                var el = $.loading({
                    content: '加载中...',
                });
                $.ajax({
                    type: 'POST',
                    url: 'webSignShow.php',
                    cache: false,
                    async:false,
                    data: {'seal': data,'DATA_CHECK': str,mobileAuthWebsignCode:mobile_auth_websign_code},
                    beforeSend: function()
                    {
                    },
                    success: function(data)
                    {
                        el.loading("hide");
                        var img = '';
                        var signInfo = eval(data);
                        for(var i=0;i<signInfo.length;i++)
                        {
                            img += '<img width="200px" height="200px" src="data:image/png;base64,'+signInfo[i]+'">';
                        }
                        $("#f-field-"+cur_item+" #signbox").append(img);
                    },
                    error: function(data)
                    {
                        el.loading("hide");
                    }
                });
            }

        },
        goToWebSeal: function(cur_item)//盖章
    {
        var self = this;
        var str =  self.binding(cur_item);
        $.ajax({
            type: 'POST',
            url: 'webSignSelect.php',
            cache: false,
            data: {'protectVal':str,'cur_item':cur_item+'_SIGN_INFO_','cur_name':cur_item+'_SIGN_INFO_','list_flag':'0'},
            beforeSend: function(){
                $.ProLoading.show();
            },
            success: function(data)
            {
                pages.to('web_seal');
				$("#scroller_web_seal").html(data);
                $.ProLoading.hide();
            },
            error: function(data){
				$.ProLoading.hide();
                showMessage(getfature);
            }
        });
    },
    deleteShowWebSeal: function(cur_item){
        if($("#f-field-"+cur_item+" .web_Seal").val()==''){
        showMessage("暂无签章或手写");
           return false;
       }else{
        var DWebSignSeal = document.getElementById("DWebSignSeal");
        $("#f-field-"+cur_item+" .web_Seal").val("")
        $("#f-field-"+cur_item+" #signbox").empty();
       }
    },
        bindEvent: function() {
            var self = this;
            var mobile_auth_websign = window.mobile_auth_websign;
            var mobile_auth_websign_code = window.mobile_auth_websign_code;

            self.$el.find('.handwrite').on('click', function() {//手写
                if(mobile_auth_websign == false || mobile_auth_websign_code == ''){
                    showMessage("移动签章授权失败，请联系OA厂商进行咨询。");
                    return
                }else{
                    self.getWebWritePage(self.id)
                }
            });
            self.$el.find('.webseal').on('click', function() {//签章
                if(mobile_auth_websign == false || mobile_auth_websign_code == ''){
                    showMessage("移动签章授权失败，请联系OA厂商进行咨询。");
                    return
                }else{
                    self.goToWebSeal(self.id)
                }
            });

            self.$el.find('.checkseal').on('click', function() {//查看
				self.goToShowWebSeal(self.id)
            });
            self.$el.find('.delseal').on('click', function() {//删除
                if(mobile_auth_websign == false || mobile_auth_websign_code == ''){
                    showMessage("移动签章授权失败，请联系OA厂商进行咨询。");
                    return
                }else{
                    self.deleteShowWebSeal(self.id)
                }
            });
        }
    });
    exports.SignatureCtrl = window.SignatureCtrl = SignatureCtrl;
});
