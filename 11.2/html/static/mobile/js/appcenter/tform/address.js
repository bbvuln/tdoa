define('AddressCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var AddressCtrl = Base.extend({
        initialize: function(config) {
            AddressCtrl.superclass.initialize.call(this, config);
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
            if(required && value.prov.id == ""){
                alert('字段' + name + "为必选字段")
                return false
            }else{
                return true
            }
        },

        getValue: function() {
            return this._config.value;
        },

        setProv: function(prov_id,prov_name,city_id,city_name,country_id,country_name) {
            this._config.value = {
                "prov": {
                    "id": prov_id,
                    "name": prov_name
                },
                "city": {
                    "id": city_id,
                    "name": city_name
                },
                "country": {
                    "id": country_id,
                    "name": country_name
                },
                "street": this._config.value.street
            }
        },
        setCity: function(city_id, city_name, country_id, country_name) {
            this._config.value = {
                "prov": {
                    "id": this._config.value.prov.id,
                    "name": this._config.value.prov.name
                },
                "city": {
                    "id": city_id,
                    "name": city_name
                },
                "country": {
                    "id": country_id,
                    "name": country_name
                },
                "street": this._config.value.street
            }
        },
        setCountry: function(country_id, country_name) {
            this._config.value = {
                "prov": {
                    "id": this._config.value.prov.id,
                    "name": this._config.value.prov.name
                },
                "city": {
                    "id":  this._config.value.city.id,
                    "name": this._config.value.city.name
                },
                "country": {
                    "id": country_id,
                    "name": country_name
                },
                "street": this._config.value.street
            }
        },
        setStreet: function(street) {
            this._config.value.street = street
        },
        triggerCalc: function(obj_res) {
            if(this._config.effect){
                this._config.fieldManager.calc(this._config.field_id, obj_res)
            }
        },
        triggerValidate: function(obj_res) {
            if(this._config.trigger || obj_res.trigger){
                this._config.fieldManager.triggerTrig(obj_res.triggerFields)
            }
        },
        bindEvent: function() {
            var self = this;
            this.$el.find('select.address_prov').on('change', function(){
                var prov_id = $(this).val();
                var prov_name = areaData.provinces[prov_id].name;
                $(this).parents('.ui-select-group').find('select.address_city').empty();
                $(this).parents('.ui-select-group').find('select.address_country').empty();
                var citys = areaData.provinces[prov_id].citys;
                for(var city in citys){
                    var city_opts = '<option value="'+ city +'">'+citys[city].name +'</option>'
                    $(this).parents('.ui-select-group').find('select.address_city').append(city_opts);
                }
                var city_id = $(this).parents('.ui-select-group').find('select.address_city').val();
                var city_name = citys[city_id].name;
                var countrys = areaData.provinces[prov_id].citys[city_id].countrys;
                $(this).parents('.ui-select-group').find('select.address_country').empty();
                for(var country in countrys){
                    var country_html = '<option value="'+ country+'" >'+countrys[country].name +'</option>'
                    $(this).parents('.ui-select-group').find('select.address_country').append(country_html);
                }
                var country_id = $(this).parents('.ui-select-group').find('select.address_country').val();
                var country_name = countrys[country_id].name;
                self.setProv(prov_id,prov_name,city_id,city_name,country_id,country_name);
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
            })

            this.$el.find('select.address_city').on('change', function(){
                var city_id = $(this).val();
                var prov_id = self._config.value.prov.id;
                var city_name = areaData.provinces[prov_id].citys[city_id].name;

                $(this).parents('.ui-select-group').find('select.address_country').empty();
                var countrys = areaData.provinces[self._config.value.prov.id].citys[city_id].countrys;
                
                for(var country in countrys){
                    var country_html = '<option value="'+ country +'" >'+countrys[country].name +'</option>'
                    $(this).parents('.ui-select-group').find('select.address_country').append(country_html);
                }
                var country_id = $(this).parents('.ui-select-group').find('select.address_country').val();
                var country_name = countrys[country_id].name;
                self.setCity(city_id,city_name,country_id, country_name)
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
            })

            this.$el.find('select.address_country').on('change', function(){
                var country_id= $(this).val();
                var prov_id = self._config.value.prov.id;
                var city_id = self._config.value.city.id;
                var country_name = areaData.provinces[prov_id].citys[city_id].countrys[country_id].name;
                self.setCountry(country_id,country_name)
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
            })

            this.$el.find('input').on('keyup', function(){
                var street = $(this).val();
                self.setStreet(street);
                // self.triggerCalc();
                // self.triggerValidate();
                var obj_res = {trigger: false, triggerFields: self._config.trigger ? [{field_id: self._config.field_id, index: 1}] : []};
                self.triggerCalc(obj_res);
                self.triggerValidate(obj_res);
            })
        }

    });
    exports.AddressCtrl = window.AddressCtrl = AddressCtrl;
});
