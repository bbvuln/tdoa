define('TDataSelectionCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TDataSelectionCtrl = Base.extend({

        initialize: function(config) {
            TDataSelectionCtrl.superclass.initialize.call(this, config);
            
            var button = $('button[name="' + config.id + '"]:first');   //选择按钮jQuery对象
            if(button.length <= 0)
            {
                return;
            }
			if(config.writable)
			{
				var data_type = button.attr('DATA_TYPE');   //查询方式
				var title_str = button.attr('DATA_CONTROL');    //表单字段显示名称(title)
				var map_field_str = button.attr('DATA_FIELD');  //数据源字段名称
				var query_field_str = button.attr('DATA_QUERY');  //查询字段
				if(!title_str || !map_field_str || !query_field_str)
				{
					return;
				}

				var itemStr = config.itemStr;
				var arr_title = title_str.split('`');
				var arr_map_fields = map_field_str.split('`');
				var arr_query_fields = query_field_str.split('`');
				
				//var map_name_str = '';绑定的字段被设置成保密后，页面上不会有该控件的html。这样会导致map_name_str中取不到该控件name属性，导致后面映射数据到绑定控件时数据篡位。所以不再使用该变量
				var arr_map = [];   //表单字段和数据源映射关系
				var arr_map_key = [];   //查询字段映射关系
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
						if(data_type == '0'){
							obj.attr('readonly', true);
						}
						var name = obj.attr('name');
						if(name && (name.substr(0, 5) == 'DATA_' || name.substr(0, 20) == 'TD_HTML_EDITOR_DATA_'))
						{
							//map_name_str += name + ',';
							eval('arr_map[arr_map.length] = {"' + name + '": "' + arr_map_fields[i] + '"};');  //生成映射关系，表单字段name => 数据源字段名称
							if(data_type == '1' && arr_query_fields[i] == '1')
							{
								eval('arr_map_key[arr_map_key.length] = {"' + name + '": "' + arr_map_fields[i] + '"};');
							}
						}
					}
				}
				if(data_type == '1') //根据录入项自动关联
				{
					if(typeof(initAutoComplete) == 'function')
					{
						initAutoComplete($, config.id, arr_map_key, arr_map);
					}
				}
				else    //弹出窗口选取
				{
					button.click(function(){
						if(typeof(data_picker) == 'function')
						{
							data_picker(button.get(0), itemStr);
						}
						return false;
					});
				}
			}else
			{
				button.click(function(){
					alert("您没有此控件的点击权限");
				});
				return false;
			}
            
        }
    });
    exports.TDataSelectionCtrl = window.TDataSelectionCtrl = TDataSelectionCtrl;
});

