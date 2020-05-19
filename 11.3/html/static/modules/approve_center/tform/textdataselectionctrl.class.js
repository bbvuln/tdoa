define('TExtDataSelectionCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TExtDataSelectionCtrl = Base.extend({

        initialize: function(config) {
        	TExtDataSelectionCtrl.superclass.initialize.call(this, config);

            var el = $('img[name="' + config.id + '"]:first');   //选择按钮jQuery对象
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

            var item_str = config.itemStr;
            //var map_name_str = '';绑定的字段被设置成保密后，页面上不会有该控件的html。这样会导致map_name_str中取不到该控件name属性，导致后面映射数据到绑定控件时数据篡位。所以不再使用该变量
            for(var i=0; i<arr_title.length; i++)   //循环所有映射绑定的表单字段title
            {
                var title = arr_title[i];
                if(!title)
                {
                    //map_name_str += ',';
                    continue;
                }

                var obj = $('[title="' + title + '"]:first');   //查找title对应的元素
                if(obj.length > 0)
                {
                    obj.attr('readonly', true);
                    var name = obj.attr('name');
                    if(name && (name.substr(0,5) == 'DATA_' || name.substr(0,6) == 'data_m'))
                    {
                        //map_name_str += name + ',';
                    }
                }
            }
            // var item_str = config.itemStr;
            // var arr_item  = item_str.split(',');
            // for(var i= 0; i<arr_item.length; i++)
            // {
            //     var item_name =  arr_item[i];
            //     if(!item_name)
            //     {
            //         continue;
            //     }
            //
            //     var obj = $('[name="' + item_name + '"]:first');
            //     if(obj.length > 0)
            //     {
            //         obj.attr('readonly', true);
            //     }
            // }


            el.click(function(){
                	var datadbid=el.get(0).getAttribute("DATA_DB_ID");
                	var datawidth=el.get(0).getAttribute("DATAWIDTH");
                	var datahigth=el.get(0).getAttribute("DATAHIGTH");
                	var dataSrc=el.get(0).getAttribute("DATA_TABLE");
                	var dataSrcName=el.get(0).getAttribute("DATA_TABLE_NAME");
                	var dataField=el.get(0).getAttribute("DATA_FIELD");
                	var dataFieldName=el.get(0).getAttribute("DATA_FLD_NAME");
                	var dataQuery=el.get(0).getAttribute("DATA_QUERY");
                	var data_control=el.get(0).getAttribute("DATA_CONTROL");
                	var URL="/general/approve_center/list/input_form/data_picker_link.php?dataSrc="+dataSrc+"&data_control="+data_control+"&dataSrcName="+dataSrcName+"&datadbid="+datadbid+"&datawidth="+datawidth+"&datahigth="+datahigth+"&dataField="+dataField+"&dataFieldName="+dataFieldName+"&item_str="+item_str+"&type=ext_data&objName="+el.get(0).name+"&dataQuery="+dataQuery;
                	var openWidth = 800;
                    var openHeight = 450;
                    var loc_x = (screen.availWidth - openWidth) / 2;
                    var loc_y = (screen.availHeight - openHeight) / 2;
                    LoadDialogWindow(URL,self,loc_x, loc_y, openWidth, openHeight);
                return false;
            });
        }
    });
    exports.TExtDataSelectionCtrl = window.TExtDataSelectionCtrl = TExtDataSelectionCtrl;
});


