
//数据来源变化时，根据URL加载映射关系的HTML代码
function getData(id, url, val)
{
    if(!val)
    {
        jQuery('#' + id).html('');
        return;
    }
    
    jQuery.ajax({
        type: 'GET',
        url: url + val,
        success: function(data){
        	if(data == "nodata")
        	{
				alert("未检索到该表的字段信息");
        		jQuery('#' + id).html("");
			}else{
				jQuery('#' + id).html(data);
			}
            
            InitStyle();
            
            //外部数据选择控件在第一次加载完成后，需要根据控件的属性回填输入框和复选框，只在页面加载完成后执行一次
            if(ctrlClass.toLowerCase() == 'data_ext' && bLoadInit)
            {
                extLoadInit();
                bLoadInit = false;
            }
        },
        error: function(req, errMsg){
            alert(td_lang_utf8.system.workflow.msg_18);
            // alert("Error " + req.status + ": " + errMsg);
        }
    });
}

//添加映射关系
function addRow()
{
    //检查必填项
    var dataField = jQuery('#dataField').val();
    if(dataField == '')
    {
        alert(td_lang_utf8.system.workflow.msg_3);  //请选择数据库字段
        return;
    }

    // var itemTitle = jQuery('#itemTitle').val().trim();
    var itemTitleVal = jQuery('#itemTitle').val();
    var itemTitle = jQuery.trim(itemTitleVal);
    if(itemTitle == '')
    {
        alert(td_lang_utf8.system.workflow.msg_4);  //请填写映射控件名称
        jQuery('itemTitle').focus()
        return;
    }
    
    if(!valid_ctrl_name(itemTitle))
    {
        jQuery('#itemTitle').focus();
        return;
    }
    
    //检查映射关系的数据来源是否唯一
    var mapTable = jQuery('#mapTable');
    if(mapTable.children().length > 0 && mapTable.attr('_dataSrc') != jQuery('#dataSrc').val())
    {
        if(window.confirm(td_lang_utf8.system.workflow.msg_2))   //数据来源只能选择一种，变更数据来源，您之前的映射项将被清除，是否继续？
        {
            mapTable.children().remove();
            mapTable.attr('_dataSrc', '');
            return;
        }
        else
        {
            return;
        }
    }
    
    //检查映射关系是否重复添加
    if(mapTable.find('tr[_itemTitle="' + itemTitle + '"]').length > 0)
    {
        alert(sprintf(td_lang_utf8.system.workflow.msg_5, itemTitle));  //已映射控件名称%s
        return;
    }

    //检查字段是否重复添加
    if(mapTable.find('tr[_datafield="' + dataField + '"]').length > 0)
    {
        alert(td_lang_utf8.system.workflow.msg_15);
        return;
    }

    var dataFieldName = jQuery('#dataField').find("option:selected").text().replace('"', '');
    var isQuery = jQuery('#isQuery').length > 0 ? (jQuery('#isQuery:checked').length > 0 ? '1' : '0') : '';
    mapTable.append(buildRowHTML(dataField, dataFieldName, itemTitle, isQuery));
    jQuery('#isQuery').attr('checked', false);
    jQuery('#itemTitle').val('');
    jQuery('#itemTitle').focus();
    
    //设置映射表的数据来源属性
    mapTable.attr('_dataSrc', jQuery('#dataSrc').val());
}

//删除一个映射关系
function deleteRow(obj)
{
    jQuery(obj).parent().parent().remove();
}

//生成映射关系表的行HTML代码
function buildRowHTML(dataField, dataFieldName, itemTitle, isQuery)
{
    var html = '';
    html += '<tr class="TableData" _dataField="' + dataField + '" _dataFieldName="' + dataFieldName + '" _itemTitle="' + itemTitle + '"' + (isQuery != '' ? (' _isQuery="' + isQuery + '"') : '') + ' style="text-align:center;">';
    html += '    <td>' + dataField + '</td>';
    html += '    <td>' + dataFieldName + '</td>';
    html += '    <td>' + itemTitle + '</td>';
    
    if(typeof(isQuery) != 'undefined' && isQuery != '')
    {
        html += '    <td>' + (isQuery == '1' ? td_lang_utf8.global.yes : td_lang_utf8.global.no) + '</td>';
    }
    
    html += '   <td><a href="javascript:;" onclick="deleteRow(this);">' + td_lang_utf8.global.del + '</a></td>';
    html += '</tr>';
    
    return html;
}

//将映射关系表的内容形成格式化数据
function getMapTable()
{
    var mapTable = {
        dataField: '',
        dataFieldName: '',
        itemTitle: '',
        isQuery: ''
    };
    
    jQuery('#mapTable').children().each(function(){
        mapTable.dataField += (typeof(jQuery(this).attr('_dataField')) != 'undefined' ? jQuery(this).attr('_dataField') : '') + '`';
        mapTable.dataFieldName += (typeof(jQuery(this).attr('_dataFieldName')) != 'undefined' ? jQuery(this).attr('_dataFieldName') : '') + '`';
        mapTable.itemTitle += (typeof(jQuery(this).attr('_itemTitle')) != 'undefined' ? jQuery(this).attr('_itemTitle') : '') + '`';
        mapTable.isQuery += (typeof(jQuery(this).attr('_isQuery')) != 'undefined' ? jQuery(this).attr('_isQuery') : '') + '`';
    });
    return mapTable;
}

//检查控件的基本属性是否完整和有效
function _checkCtrlProp()
{
    if(jQuery.trim(jQuery('#txtName').val()) == '')
    {
        alert(td_lang_utf8.system.workflow.msg_6);    //控件名称不能为空！
        jQuery('#txtName').focus();
        return false;
    }
	if(jQuery("#DATASELECTTYPE").val() == "")
	{
	    alert("请选择数据选择类型！");
	    return false;
	}
    if(!valid_ctrl_name(jQuery('#txtName').val()))
    {
        return false;
    }
    
    if(jQuery('input[name="dataType"]').length > 0 && jQuery('input[name="dataType"]:checked').length <= 0)
    {
        alert(td_lang_utf8.system.workflow.msg_7);    //请选择数据选取方式！
        return false;
    }
    
    if(jQuery('#dataSrc').val() == '')
    {
        alert(td_lang_utf8.system.workflow.msg_8);    //请选择数据来源！
        return false;
    }
    
    if(jQuery('#mapTable').children().length <= 0)
    {
        alert(td_lang_utf8.system.workflow.msg_9);    //请添加映射关系！
        return false;
    }
    
    if(jQuery('input[name="dataType"]').length > 0 && jQuery('#dataType1:checked').length > 0 && jQuery('#mapTable tr[_isQuery="1"]').length <= 0)
    {
        alert(td_lang_utf8.system.workflow.msg_10);    //请设置查询主键！
        return false;
    }
    
    return true;
}

//加载编辑器中被选中的控件信息，并初始化到当前页面
function _initCtrlProp(el)
{
    if(!el || jQuery(el).attr('class') && jQuery(el).attr('class').toLowerCase() != ctrlClass.toLowerCase())
    {
        return;
    }
    
    var title = jQuery(el).attr('title');   //控件名称
    var datahigth = typeof(jQuery(el).attr('datahigth')) != 'undefined' ? jQuery(el).attr('datahigth') : '';//高度
    var datawidth = typeof(jQuery(el).attr('datawidth')) != 'undefined' ? jQuery(el).attr('datawidth') : '';//宽度
    var DB_ID = typeof(jQuery(el).attr('data_db_id')) != 'undefined' ? jQuery(el).attr('data_db_id') : '';//数据库名
    var dataType = typeof(jQuery(el).attr('data_type')) != 'undefined' ? jQuery(el).attr('data_type') : '';   //数据选取方式
    var dataSrc = typeof(jQuery(el).attr('data_table')) != 'undefined' ? jQuery(el).attr('data_table') : '';   //数据源id
    var dataSrcName = typeof(jQuery(el).attr('data_table_name')) != 'undefined' ? jQuery(el).attr('data_table_name') : '';   //数据库表名
    var dataField = typeof(jQuery(el).attr('data_field')) != 'undefined' ? jQuery(el).attr('data_field') : '';   //数据库字段
    var dataFieldName = typeof(jQuery(el).attr('data_fld_name')) != 'undefined' ? jQuery(el).attr('data_fld_name') : '';   //字段描述
    var itemTitle = typeof(jQuery(el).attr('data_control')) != 'undefined' ? jQuery(el).attr('data_control') : '';   //映射控件名称
    var isQuery = typeof(jQuery(el).attr('data_query')) != 'undefined' ? jQuery(el).attr('data_query') : '';   //是否做为查询字段
    jQuery('#txtName').val(title);
    selectDataType(dataType);
    jQuery('#datahigth').val(datahigth);
    jQuery('#datawidth').val(datawidth);
    jQuery('#dataSrc').val(dataSrc);
    jQuery('#dataSrcName').val(dataSrcName);
    jQuery('#DB_ID').val(DB_ID);
    jQuery('#dataSrc').trigger('change');
    jQuery('#mapTable').attr('_dataSrc', dataSrc);
    
    //外部数据选择控件，需根据dataSrc加载映射关系，加载完成后再回填映射关系输入框和复选框
    if(ctrlClass.toLowerCase() != 'data_ext')
    {
        var dataFieldArray = dataField.split('`');
        var dataFieldNameArray = dataFieldName.split('`');
        var itemTitleArray = itemTitle.split('`');
        var isQueryArray = isQuery.split('`');
    
        for(var i=0; i<dataFieldArray.length; i++)
        {
            if(!dataFieldArray[i] || !dataFieldNameArray[i] || !itemTitleArray[i])
            {
                continue;
            }
            
            jQuery('#mapTable').append(buildRowHTML(dataFieldArray[i], dataFieldNameArray[i], itemTitleArray[i], isQueryArray[i]));
        }
    }
    else    //将控件的默认属性信息设置给mapTable，在extLoadInit时用到
    {
        jQuery('#mapTable').attr({_dataField: dataField, _dataFieldName: dataFieldName, _itemTitle: itemTitle, _isQuery: isQuery});
    }
}

//外部数据选择控件在第一次加载完成后，需要根据控件的属性回填输入框和复选框，只在页面加载完成后执行一次
function extLoadInit()
{
    var dataField = jQuery('#mapTable').attr('_dataField');   //数据库字段
    var dataFieldName = jQuery('#mapTable').attr('_dataFieldName');   //数据库字段名称
    var itemTitle = jQuery('#mapTable').attr('_itemTitle');   //映射控件名称
    var isQuery = jQuery('#mapTable').attr('_isQuery');   //是否做为查询字段
    
    var dataFieldArray = dataField.split('`');
    var dataFieldNameArray = dataFieldName.split('`');
    var itemTitleArray = itemTitle.split('`');
    var isQueryArray = isQuery.split('`');
    
    for(var i=0; i<dataFieldArray.length; i++)
    {
        if(!dataFieldArray[i])
        {
            continue;
        }
        
        var tr = jQuery('#mapTable tr[_dataField="' + dataFieldArray[i] + '"]:first');
        if(tr.length > 0)
        {
            var thisQuery = isQueryArray[i] == '1' ? 1 : 0;
            tr.attr('_itemTitle', itemTitleArray[i]);
            tr.attr('_isQuery', thisQuery);
            jQuery('input[type="text"]:first', tr).val(dataFieldNameArray[i]);
            jQuery('input[type="text"]:eq(1)', tr).val(itemTitleArray[i]);
            jQuery('input[type="checkbox"]:first', tr).attr('checked', (thisQuery == 1));
        }
    }
}