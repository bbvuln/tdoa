function changeDataType(el)
{
	var id = jQuery(el).find('option:selected').attr('dataId');
	var data_table = '';
	var data_fld_name = '';
	var data_control = '';
	var data_field = '';
	jQuery.ajax({
		url: "get_data_variable.php",
		data: "id="+id,
		type: "POST",
		success: function(data){
			var dataArr = JSON.parse(data);
			if(dataArr)
			{
				data_table = dataArr.DATA_TABLE;
				data_fld_name = dataArr.DATA_FLD_NAME;
				data_control = dataArr.DATA_CONTROL;
				data_field = dataArr.DATA_FIELD;
				if(data_table != '')
				{
					jQuery('#mapTable').find('tr').remove();//删除映射关系
					getData('dataMap','get_data.php?dataSrc=',data_table);
					jQuery('#dataSrc').val(data_table);
					if(data_field != '')
					{
						var data_fld_name_arr = data_fld_name.split('`');
						var data_control_arr = data_control.split('`');
						var data_field_arr = data_field.split('`');
						for(var i=0;i<data_field_arr.length;i++)//新增映射关系
						{
							if(data_field_arr[i] == '')
								continue;
							jQuery('#mapTable').append(buildRowHTML(data_field_arr[i],data_fld_name_arr[i],data_control_arr[i],''));
						}
					}
				}
			}
		}
	});
}