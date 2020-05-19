define('TFormDataSelectionCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TFormDataSelectionCtrl = Base.extend({

        initialize: function(config) {
            TFormDataSelectionCtrl.superclass.initialize.call(this, config);
            
            var el = $('button[name="' + config.id + '"]:first');   //选择按钮jQuery对象
            if(el.length <= 0)
            {
                return;
            }
            
            var title_str = el.attr('DATA_CONTROL');    //表单字段显示名称(title)
            if(!title_str)
            {
                return;
            }
            
            var arr_title = title_str.split('`');
            
            var map_name_str = '';
            for(var i=0; i<arr_title.length; i++)   //循环所有映射绑定的表单字段title
            {
                var title = arr_title[i];
                if(!title)
                {
                    continue;
                }
                
                var obj = $('[title="' + title + '"]:first');   //查找title对应的元素
                if(obj.length > 0)
                {
                    // obj.attr('readonly', true);
                    var name = obj.attr('name');
                    if(name && name.substr(0, 5) == 'DATA_')
                    {
                        map_name_str += name + ',';
                    }
                }else{
                    map_name_str += ',';
                }
            }
            
            //流水号输入框点击事件
            $('#QUERY_KEY_' + config.id).click(function(){
                this.value = '';
            });
            
            //数据选择按钮点击事件
            el.click(function(){
                if(typeof(data_fetch) == 'function')
                {
                    data_fetch(el.get(0), $('#QUERY_KEY_' + config.id).val(), map_name_str,config.form_id);
                }
                return false;
            });
        }
    });
    exports.TFormDataSelectionCtrl = window.TFormDataSelectionCtrl = TFormDataSelectionCtrl;
});

