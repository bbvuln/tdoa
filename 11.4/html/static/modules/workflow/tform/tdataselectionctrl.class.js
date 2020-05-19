define('TDataSelectionCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TDataSelectionCtrl = Base.extend({

        initialize: function(config) {
            TDataSelectionCtrl.superclass.initialize.call(this, config);
            
            var button = $('button[name="' + config.id + '"]:first');   //ѡ��ťjQuery����
            if(button.length <= 0)
            {
                return;
            }
			if(config.writable)
			{
				var data_type = button.attr('DATA_TYPE');   //��ѯ��ʽ
				var title_str = button.attr('DATA_CONTROL');    //���ֶ���ʾ����(title)
				var map_field_str = button.attr('DATA_FIELD');  //����Դ�ֶ�����
				var query_field_str = button.attr('DATA_QUERY');  //��ѯ�ֶ�
				if(!title_str || !map_field_str || !query_field_str)
				{
					return;
				}

				var itemStr = config.itemStr;
				var arr_title = title_str.split('`');
				var arr_map_fields = map_field_str.split('`');
				var arr_query_fields = query_field_str.split('`');
				
				//var map_name_str = '';�󶨵��ֶα����óɱ��ܺ�ҳ���ϲ����иÿؼ���html�������ᵼ��map_name_str��ȡ�����ÿؼ�name���ԣ����º���ӳ�����ݵ��󶨿ؼ�ʱ���ݴ�λ�����Բ���ʹ�øñ���
				var arr_map = [];   //���ֶκ�����Դӳ���ϵ
				var arr_map_key = [];   //��ѯ�ֶ�ӳ���ϵ
				for(var i=0; i<arr_title.length; i++)   //ѭ������ӳ��󶨵ı��ֶ�title
				{
					var title = arr_title[i];
					if(!title)
					{
						continue;
					}
					
					var obj = $('[title="' + title + '"]:first');   //����title��Ӧ��Ԫ��
					if(obj.length > 0)
					{
						if(data_type == '0'){
							obj.attr('readonly', true);
						}
						var name = obj.attr('name');
						if(name && (name.substr(0, 5) == 'DATA_' || name.substr(0, 20) == 'TD_HTML_EDITOR_DATA_'))
						{
							//map_name_str += name + ',';
							eval('arr_map[arr_map.length] = {"' + name + '": "' + arr_map_fields[i] + '"};');  //����ӳ���ϵ�����ֶ�name => ����Դ�ֶ�����
							if(data_type == '1' && arr_query_fields[i] == '1')
							{
								eval('arr_map_key[arr_map_key.length] = {"' + name + '": "' + arr_map_fields[i] + '"};');
							}
						}
					}
				}
				if(data_type == '1') //����¼�����Զ�����
				{
					if(typeof(initAutoComplete) == 'function')
					{
						initAutoComplete($, config.id, arr_map_key, arr_map);
					}
				}
				else    //��������ѡȡ
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
					alert("��û�д˿ؼ��ĵ��Ȩ��");
				});
				return false;
			}
            
        }
    });
    exports.TDataSelectionCtrl = window.TDataSelectionCtrl = TDataSelectionCtrl;
});

