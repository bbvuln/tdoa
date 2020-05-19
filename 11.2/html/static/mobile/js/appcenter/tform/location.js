define('LocationCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var LocationCtrl = Base.extend({
        initialize: function(config) {
            LocationCtrl.superclass.initialize.call(this, config);
            this._config = config;
            this._config.lat = config.value.lat === null ? "" : config.value.lat;
            this._config.lng = config.value.lng === null ? "" : config.value.lng;
            this._render();
            this.$el = $('#f-field-'+this._config.pure_id);
            this.bindEvent();
            //this.getMap(this._config.value.lat,this._config.value.lng);
        },

        _render: function() {
            this._config.container.append($.parseTpl(this._config.template, this._config));
        },
        reRender: function(new_config) {
            //������dom���滻��dom
            var html = $($.parseTpl(this._config.template, new_config)).html();
            this.$el.html(html);
			this._config.value = new_config.value;
            this.bindEvent();
        },
        validate: function() {
            var value = this._config.value;
            var name  = this._config.name;
            //��֤����
            var required = this._config.required;
            if(required && $.trim(value.address) == ""){
                alert('�ֶ�'+name+"Ϊ�����ֶ�");
                return false;
            }else{
                return true;
            }
        },

        getValue: function() {
            //alert("��λvalue:"+this._config.value)
            return this._config.value;
        },
        // getMap: function(lat,lng){
        //     tMobileSDK.getLocationByMap({
        //         onSuccess: function(response){
        //             alert(JSON.stringify(response));
        //         }
        //     })
        // },
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
            this.$el.find('button').on('click', function(){
                var $target = $(this).siblings('p');
                var local_lat = $target.attr('data-lat');
                var local_lng = $target.attr('data-lng');
                tMobileSDK.getLocationByMap({
                    onSuccess: function(response){
                        //alert(JSON.stringify(response));
                        if(response instanceof Array){//ios����["39.95163","116.308731","�����к���������Ժ·69��"]
                            $target.text(response[2]).attr('data-lat',response[0]).attr('data-lng',response[1]);
                            self._config.value = {
                                "lat": response[0],
                                "lng": response[1],
                                "address": response[2]
                            }
                        }else{//android����{"nowaddress":"�����к���������Ժ·69��","nowlatitude":"39.95163","nowlontitude":"116.308731"}
                            $target.text(response.nowaddress).attr('data-lat',response.nowlatitude).attr('data-lng',response.nowlontitude);
                            self._config.value = {
                                "lat": response.nowlatitude,
                                "lng": response.nowlontitude,
                                "address": response.nowaddress
                            }
                        }
                        // self.triggerCalc();
                        // self.triggerValidate();
                        var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                        self.triggerCalc(obj_res);
                        self.triggerValidate(obj_res);
                    },
                    onFail: function(err){
                        alert("��ͼ��λʧ��");
                    },
                })
            })
        }
    });
    exports.LocationCtrl = window.LocationCtrl = LocationCtrl;
});
