jQuery(document).ready(function(){
	if(typeof(FLOW_ID_CHECKED) != 'undefined' && FLOW_ID_CHECKED != '')
	{
		getData(FLOW_ID_CHECKED);
	}
	var mapTable = jQuery('#FormMapTable');
	if(data_fld_name && data_control && data_field)
	{
		var data_field_arr = data_field.split('`');
		var data_fld_name_arr = data_fld_name.split('`');
		var data_control_arr = data_control.split('`');
		for(var i=0;i<data_field_arr.length-1;i++)
		{
			var html = buildFormRowHTML(data_field_arr[i],data_fld_name_arr[i],data_control_arr[i]);
			mapTable.append(html);
		}
	}
});
function getData(value)
{
	var url = "get_data.php?FLOW_ID="+value;
	//清空已经选择的数据映射
	jQuery('#FormMapTable').find('tr').remove();
	jQuery.ajax({
		type: 'GET',
		url:url,
		success:function(data){
			jQuery('#dataMap').html(data);
		}
	});
}
function addFormRow()
{
	var dataField = jQuery('#dataField').val();
	if(dataField == '')
	{
		alert("请选择数据库字段");
		return;
	}
	var itemTitleVal = jQuery('#itemTitle').val();
	var itemTitle = jQuery.trim(itemTitleVal);
	if(itemTitle == '')
	{
		alert("请填写映射控件名称");
		jQuery('itemTitle').focus()
		return;
	}
	var mapTable = jQuery('#FormMapTable');
	//检查映射关系是否重复添加
	if(mapTable.find('tr[_itemTitle="' + itemTitle + '"]').length > 0)
	{
		alert("已映射控数据库字段:"+itemTitle);
		return;
	}
	//检查字段是否重复添加
	var datafldclass = jQuery('#dataField').find('option:selected').attr('class');
	if(mapTable.find('tr[_datafield="' + dataField + '"]').length > 0 && datafldclass != 'detail')
	{
		alert("已映射控件名称:"+dataField);
		return;
	}
	var dataFieldName = jQuery('#dataField').find("option:selected").text().replace('"', '');
	if(datafldclass == 'detail')
	{
		dataFieldName = dataFieldName+"["+jQuery('#dataFieldList').val()+"]";
	}
	mapTable.append(buildFormRowHTML(dataField, dataFieldName, itemTitle));
}
//生成映射关系表的行HTML代码
function buildFormRowHTML(dataField, dataFieldName, itemTitle)
{
	var html = '';
	html += '<tr class="TableData" _dataField="' + dataField + '" _dataFieldName="' + dataFieldName + '" _itemTitle="' + itemTitle + '"' + ' style="text-align:center;">';
	html += '    <td>' + dataField + '</td>';
	html += '    <td>' + dataFieldName + '</td>';
	html += '    <td>' + itemTitle + '</td>';
	html += '   <td><a href="javascript:;" onclick="deleteRow(this);">删除</a></td>';
	html += '</tr>';
	
	return html;
}
//删除一个映射关系
function deleteRow(obj)
{
	jQuery(obj).parent().parent().remove();
}
//验证表单数据选择数据
function checkFormSelection()
{
	var display_type = jQuery('#display_style').find('option:selected').val();
	if(display_type != 'fetch')
		return true;
	var mapDataLength = jQuery('#FormMapTable').find('tr').length;
	var dataSrc = jQuery('#formDataSrc').find('option:selected').val();
	if(mapDataLength == 0 || dataSrc == 0)
	{
		alert("请选择数据来源");
		return false;
	}
	var data_fld_name = '';
	var data_control = '';
	var data_field = '';
	jQuery('#FormMapTable').find('tr').each(function(i,v){
		data_field += jQuery(v).find('td').eq(0).text()+'`';
		data_fld_name += jQuery(v).find('td').eq(1).text()+'`';
		data_control += jQuery(v).find('td').eq(2).text()+'`';
	});
	jQuery('#data_table').val(dataSrc);
	jQuery('#data_field').val(data_field);
	jQuery('#data_fld_name').val(data_fld_name);
	jQuery('#data_control').val(data_control);
	return true;
}