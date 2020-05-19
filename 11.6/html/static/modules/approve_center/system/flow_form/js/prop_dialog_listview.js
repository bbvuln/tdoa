function selectType(value)
{

    if (value == 1)
    {
        jQuery("#dataSrc").show();
        jQuery("#extDataSelect").hide();
        jQuery("#extDataSrcName").val("");
        jQuery("#extDataSrcID").val("");
     
    } else
    {
        jQuery("#extDataSelect").show();
        jQuery("#dataSrc").hide();
        jQuery("#dataSrc").val("");
              
    }
    jQuery("select[id^=datafield_]").find("option:gt(0)").remove();
        
}




function delete_row(row_number)
{
    jQuery("#tr_" + row_number).hide();
    jQuery("#row_delete_" + row_number).val(1);
    rebuild_no();
}

function rebuild_no()
{
    var max_row = jQuery("#max_row").val();
    var no_count = 1;
    for(var i = 1; i < max_row ; i++)
    {
        if(jQuery("#row_delete_" + i).val() == "0")
        {
            jQuery("#no_" + i).text(no_count);
            no_count++;
        }
    }
    jQuery("#max_no").val(no_count);
}

function tips()
{

    if (cal_tip.style.display == "none")
    {
        cal_tip.style.display = "";
        
    } else
    {
        cal_tip.style.display = "none";
    }
}

function change_ext_data_source(serverid,db,table_name)
{
	var old_data_source = jQuery("#cur_data_source").val();
	var new_data_source = serverid+","+db+","+table_name;
	if(old_data_source != new_data_source){
		 jQuery.get('get_ext_data.php?serverid='+serverid+"&db="+db+"&table_name="+table_name, '', function(result){
             //如果以前没有数据源情况下，加入列
             if(old_data_source == "")
             {
                 // 加入表头
                 var str_header_html = "<td id=\"header_field_col\" align=\"center\">"
                                     + td_lang_utf8.system.workflow.msg_listview_ctrl_2
                                     + "</td>" + "<td id=\"header_check_col\"  align=\"center\">"
                                     + td_lang_utf8.system.workflow.msg_listview_ctrl_3
                                     + "</td>"; 
               
                 jQuery("#tr_header").append(str_header_html);
                
              
                 
                 // 加入字段选择列
                 var rows_count = jQuery("#max_row").val() - 1;
                 for ( var i = 1; i <= rows_count; i++)
                 {
                     add_field_select(i, result, "");
                     add_query_check(i, 0);

                 }
             }else
             {
                 var rows_count = jQuery("#max_row").val() - 1;
                 for ( var i = 1; i <= rows_count; i++)
                 {

                     change_field_select(i, result);
                     clear_query_check(i);

                 }
             }
         });
	}  
	jQuery("#cur_data_source").val(new_data_source);
}

function change_data_source(data_source)
{
    var old_data_source = jQuery("#cur_data_source").val()
    if(data_source == '')
    {
        if(old_data_source != "")
        {
            remove_field_and_query_col();
        }
        
    }else
    {
        //变换数据源
        if(old_data_source != data_source)
        {  
        	   //alert(inputa);
            jQuery.get('get_data.php?dataSrc=' + data_source, '', function(result){
                
                //如果以前没有数据源情况下，加入列
                if(old_data_source == "")
                {
                    // 加入表头
                    var str_header_html = "<td id=\"header_field_col\" align=\"center\">"
                                        + td_lang_utf8.system.workflow.msg_listview_ctrl_2
                                        + "</td>" + "<td id=\"header_check_col\"  align=\"center\">"
                                        + td_lang_utf8.system.workflow.msg_listview_ctrl_3
                                        + "</td>"; 
                  
                    jQuery("#tr_header").append(str_header_html);
                   
                 
                    
                    // 加入字段选择列
                    var rows_count = jQuery("#max_row").val() - 1;
                    for ( var i = 1; i <= rows_count; i++)
                    {
                        add_field_select(i, result, "");
                        add_query_check(i, 0);

                    }
                }else
                {
                    var rows_count = jQuery("#max_row").val() - 1;
                    for ( var i = 1; i <= rows_count; i++)
                    {

                        change_field_select(i, result);
                        clear_query_check(i);

                    }
                }
            });
        }
        
    }
    //alert(data_source);
    jQuery("#cur_data_source").val(data_source);

}

function add_field_select(row_no, str_option_fields, field_value)
{

    // 加入对应数据源字段列
    var str_field_select = "<td>" 
                         + "<select id=\"datafield_" + row_no + "\" class=\"cke_dialog_ui_input_select\">" 
                         + str_option_fields 
                         + "</select>"
                         + "</td>";
    
    jQuery("#tr_" + row_no).append(str_field_select);
    jQuery("#datafield_" + row_no).val(field_value);

}

function change_field_select(row_no, str_select_fields)
{
    jQuery("#datafield_" + row_no).empty();
    jQuery("#datafield_" + row_no).append(str_select_fields);
}


function add_query_check(row_no, query_value)
{
    //初始化查询选择值
    var check = "";
    if (query_value == 1)
    {
        check = "checked";
    } else
    {
        check = "";
    }
    

    // 加入查询列
    var str_query_checkbox  = "<td><input type=\"checkbox\" id=\"query_"
                            + row_no + "\" class=\"cke_dialog_ui_checkbox_input\"" + check + " /></td>";
    jQuery("#tr_" + row_no).append(str_query_checkbox);
}

function clear_query_check(row_no)
{
    jQuery("#query_" + row_no).attr("checked", false);
}

function remove_field_and_query_col()
{
    var rows_count = jQuery("#max_row").val() - 1;
    for(var i = 1; i <= rows_count; i++)
    {
        jQuery("#datafield_" + i).parent().remove();
        jQuery("#query_" + i).parent().remove();

    }
    
    jQuery("#header_field_col").remove();
    jQuery("#header_check_col").remove();
}


function check_list_view_ctrl()
{
	var max_row = jQuery("#max_row").val();
	
	var textValue = jQuery("#ctrl_name").val();
	var default_cols = jQuery("#ctrl_default_cols").val();
	var itemValue = jQuery("#item_1").val();
	var reg  =  /[^\u4E00-\u9FA5]/g;
	if(reg.test(textValue))
	{
		if(itemValue.indexOf(textValue)==0)
		{
			alert(td_lang_utf8.system.workflow.msg_16);
			return false;
		}
	}
	//数据不能重复
	// for(var l = 1;l < max_row - 1; l++) 
	// {
		// var thisValue = jQuery("#field_" + l).val();
		// for(var i = l + 1; i < max_row; i++ )
		// {
			// var value = jQuery("#field_" + i).val();
			// if(thisValue == value && thisValue!="" && value!="")
			// {
				// alert(td_lang_utf8.system.workflow.msg_15);
				// jQuery("#field_" + i).val("");
				// return false;
			// }
		// }
	// }
	//数据不能为空
	// for(var i = 1, l = max_row; i < l; i++) 
	// {
		// if(jQuery("#item_" + i).val()!=""&&jQuery("#field_" + i).val()==""&&jQuery('#ctrl_name').val()!=""&&jQuery('#slectFT').val()!=2)
		// {
			// alert(td_lang_utf8.system.workflow.msg_14);
			// return false;
		// }
	// }
    if(jQuery.trim(jQuery('#ctrl_name').val()) == '')
    {
        alert(td_lang_utf8.system.workflow.msg_11);
        jQuery('#ctrl_name').focus();
        return false;
    }
    
    if(!valid_ctrl_name(jQuery('#ctrl_name').val()))
    {
        return false;
    }

    if(ctrl_id == '')
    {
        get_ctrl_id();
        if(ctrl_id == '')
        {
            alert(td_lang_utf8.system.workflow.msg_12);
            return false;
        }
    }
    
    var last_count = 0;
    var row_count = jQuery("#max_row").val();
    for(var i = 1;i < row_count; i++)
    {
        if(jQuery("#row_delete_" + i).val() == "1")
        {
            continue;
        }
        
        if(jQuery.trim(jQuery("#item_" + i).val()) != "")
        {
            last_count = i;
        }
        
    }
    
    if(last_count == 0)
    {
        
        alert(td_lang_utf8.system.workflow.msg_listview_ctrl_error_3);
        return false;
        
    }
    
    var count = 0;
    var data_field_count = 0;
    for(var i = 1; i <= last_count; i++)
    {
        if(!valid_ctrl_name(jQuery("#item_" + i).val()) || !valid_ctrl_name(jQuery("#size_" + i).val()) || !valid_ctrl_name(jQuery("#cal_" + i).val()) || !valid_ctrl_name(jQuery("#colvalue_" + i).val()))
        {
            return false;
        }
        
        if(jQuery("#row_delete_" + i).val() == "1")
        {
            continue;
        }
        count++;
        if(jQuery.trim(jQuery("#item_" + i).val()) == "")
        {
            alert(sprintf(td_lang_utf8.system.workflow.msg_listview_ctrl_error_4, count));
            jQuery("#item_" + i).focus();
            return false;
        }
        
        var size    = jQuery.trim(jQuery("#size_" + i).val());
        if(size != "" && size.search("^-?\\d+$") != 0)
        {
            jQuery("#size_" + i).focus();
            alert(sprintf(td_lang_utf8.system.workflow.msg_listview_ctrl_error_5, count));
            return false;
        }

        if(jQuery("#datafield_" + i))
        {
            if(typeof jQuery("#datafield_" + i).val() != "undefined" && jQuery("#datafield_" + i).val() != "")
            {
                data_field_count++;
            }
        }
        
    }

    if(jQuery("#dataType").val() == 1)
    {
        if(jQuery("#dataSrc").val() != ""){
            
            if(data_field_count == 0){
                
                alert(td_lang_utf8.system.workflow.msg_listview_ctrl_error_1);
                return false;
            
            }
            
        }
   

    }else if(jQuery("#dataType").val() == 2)
    {
        
        if(jQuery("#extDataSrcName").val() == ""){
            
            alert(td_lang_utf8.system.workflow.msg_listview_ctrl_error_2);
            return false;
            
        }
        
        if(data_field_count == 0){
        
            alert(td_lang_utf8.system.workflow.msg_listview_ctrl_error_1);
            return false;
        
        }
        
        
        
    }
    
    if(jQuery("#dataSrc").val() != "" || jQuery("#extDataSrcName").val() != ""){
        
        var tmp_str = "";
        for(var i = 1; i <= last_count; i++)
        {
            if(jQuery("#row_delete_" + i).val() == "1")
            {
                continue;
            }
            
            var data_field = jQuery("#datafield_"+i).val();
            if(data_field == "")
            {
                continue;
            }

            if(tmp_str.indexOf(data_field +",") == -1)
            {
                tmp_str += data_field +",";
            }
            else
            {
                alert(td_lang_utf8.system.workflow.msg_listview_ctrl_error_6);
                return false;
            }
        }
    }
    return true;
}
function add_row(arr_data,valueid)
{
    var max_row = jQuery("#max_row").val();
    var max_no = jQuery("#max_no").val();
    var a= "自动创建变量";
    //当选择框选择 是 的时候执行的增加方法
    if(jQuery("#slectFT").val()==1)
    {
    	var tr_html = "<tr id=\"tr_"
            + max_row
            + "\" >"
            + "<td><a title=\"" + td_lang_utf8.system.workflow.msg_listview_ctrl_4 + "\" "
            + "href=\"javascript:delete_row(" + max_row + ")\"><img src=\"" + MYOA_STATIC_SERVER + "/static/images/form/delete.png\" /></a>"
            + "<input type=\"hidden\" id=\"row_delete_" + max_row + "\" value=\"0\""
            + "</td>"
            + "<td nowrap align=\"center\">"
            + "<span id=\"no_" + max_row + "\">" + max_no + "</span>"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"item_"
            + max_row
            + "\" type=\"text\" size=\"18\" style=\"width:90%\" class=\"cke_dialog_ui_input_text\">"
            + "</td>"
            + "<td nowrap id=\"tdId_"
            + max_row
            + "\" align=\"center\"  title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"field_"
            + max_row
            //添加禁止输入中文空格的方法
            + "\" type=\"text\" size=\"5\" style=\"width:70%\"  class=\"cke_dialog_ui_input_text\" onkeyup=\"value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')\" onpaste=\"value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')\" oncontextmenu = \"value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"size_"
            + max_row
            + "\" type=\"text\" size=\"5\" style=\"width:70%\" class=\"cke_dialog_ui_input_text\"> px"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<select id=\"coltype_"
            + max_row
            + "\" class=\"cke_dialog_ui_input_select\">"
            + "<option value=\"text\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_text
            + "</option>"
            + "<option value=\"textarea\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_textarea
            + "</option>"
            + "<option value=\"select\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_select
            + "</option>"
            + "<option value=\"radio\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_radio
            + "</option>"
            + "<option value=\"checkbox\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_checkbox
            + "</option>"
            + "<option value=\"datetime\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_date
            + "</option>"
			+ "<option value=\"dateAndTime\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_datetime
            + "</option>"
            + "</select>"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\" >"
            + "<input id=\"sum_"
            + max_row
            + "\" type=\"checkbox\" class=\"cke_dialog_ui_checkbox_input\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"cal_"
            + max_row
            + "\" type=\"text\" size=\"15\" style=\"width:90%\" class=\"cke_dialog_ui_input_text\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"colvalue_"
            + max_row
            + "\" type=\"text\" size=\"15\" style=\"width:90%\" class=\"cke_dialog_ui_input_text\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<select class=\"cke_dialog_ui_input_select\" name=\"variable_select\" onchange=\"parseVariableOptions(this);\"> <option  dataType=\"\" dataCodes=\"\">"+a+"</option></select></td>"+ "</tr>";
    }
  //当选择框选择 否 的时候执行的增加方法

	else
    {
    	var tr_html = "<tr id=\"tr_"
            + max_row
            + "\" >"
            + "<td><a title=\"" + td_lang_utf8.system.workflow.msg_listview_ctrl_4 + "\" "
            + "href=\"javascript:delete_row(" + max_row + ")\"><img src=\"" + MYOA_STATIC_SERVER + "/static/images/form/delete.png\" /></a>"
            + "<input type=\"hidden\" id=\"row_delete_" + max_row + "\" value=\"0\""
            + "</td>"
            + "<td nowrap align=\"center\">"
            + "<span id=\"no_" + max_row + "\">" + max_no + "</span>"
            + "</td>"
            + "<td nowrap align=\"center\"  title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"item_"
            + max_row
            + "\" type=\"text\" size=\"18\" style=\"width:90%\" class=\"cke_dialog_ui_input_text\">"
            + "</td>"
            + "<td nowrap id=\"tdId_"
            + max_row
            + "\" align=\"center\" style=\"display:none;\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"field_"
            + max_row
            //添加禁止输入中文空格的方法
            + "\" type=\"text\" size=\"5\" style=\"width:70%\"  class=\"cke_dialog_ui_input_text\" onkeyup=\"value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')\" onpaste=\"value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')\" oncontextmenu = \"value=value.replace(/[^\a-\z\A-\Z0-9]/g,'')\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"size_"
            + max_row
            + "\" type=\"text\" size=\"5\" style=\"width:70%\" class=\"cke_dialog_ui_input_text\"> px"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<select id=\"coltype_"
            + max_row
            + "\" class=\"cke_dialog_ui_input_select\">"
            + "<option value=\"text\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_text
            + "</option>"
            + "<option value=\"textarea\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_textarea
            + "</option>"
            + "<option value=\"select\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_select
            + "</option>"
            + "<option value=\"radio\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_radio
            + "</option>"
            + "<option value=\"checkbox\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_checkbox
            + "</option>"
            + "<option value=\"datetime\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_date
			+ "<option value=\"dateAndTime\">"
            + td_lang_utf8.system.workflow.msg_listview_ctrl_type_datetime
            + "</option>"
            + "</option>"
            + "</select>"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\" >"
            + "<input id=\"sum_"
            + max_row
            + "\" type=\"checkbox\" class=\"cke_dialog_ui_checkbox_input\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"cal_"
            + max_row
            + "\" type=\"text\" size=\"15\" style=\"width:90%\" class=\"cke_dialog_ui_input_text\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<input id=\"colvalue_"
            + max_row
            + "\" type=\"text\" size=\"15\" style=\"width:90%\" class=\"cke_dialog_ui_input_text\">"
            + "</td>"
            + "<td nowrap align=\"center\" title=\""
            + td_lang_utf8.system.workflow.msg_13
            + "\">"
            + "<select class=\"cke_dialog_ui_input_select\" name=\"variable_select\" onchange=\"parseVariableOptions(this);\"> <option  dataType=\"\" dataCodes=\"\">"+a+"</option></select></td>"+ "</tr>";
	}
    jQuery("#col_def_table").append(tr_html);
    
    if(typeof arr_data != "undefined")
    {
        jQuery("#item_" + max_row).val( arr_data['title'] );
        jQuery("#field_" + max_row).val( arr_data['field'] );
        // 旧的列表控件列宽和新的列表控件列宽换算
        if(new_width === false)
        {
            arr_data['size'] = parseInt((arr_data['size'])*7.2);
        }
        jQuery("#size_" + max_row).val( arr_data['size'] );
        jQuery("#cal_" + max_row).val( arr_data['cal'] );
        jQuery("#colvalue_" + max_row).val( arr_data['colvalue'] );
        jQuery("#coltype_" + max_row).val( arr_data['coltype'] );

   	
        if(arr_data['sum'] == "1")
        {
           jQuery("#sum_" + max_row).prop("checked", true);
        }
        
    }
    var data_source = jQuery("#cur_data_source").val();
    if(data_source != "")
    {    
    	if(jQuery("#dataType").val() == 2){//外部数据源处理
    		var t_data_source = data_source.split(',');
    		if(t_data_source.length == 3){
    			var serverid = t_data_source[0];
    			var db = t_data_source[1];
    			var table_name = t_data_source[2];
    			jQuery.get('get_ext_data.php?serverid='+serverid+"&db="+db+"&table_name="+table_name, '', function(result){
    				add_field_select(max_row, result, "");
                    add_query_check(max_row, 0);
                    
                    if(typeof arr_data != "undefined")
                    {
                        if(typeof arr_data['data_field'] != "undefined" && arr_data['data_field'] != "")
                        {
                            jQuery("#datafield_" + max_row).val(arr_data['data_field'])
                        }
                        if(typeof arr_data['data_query'] != "undefined" && arr_data['data_query'] == "1")
                        {
                            jQuery("#query_" + max_row).prop("checked", true);
                        }
                    }
        	    });
    		}
    	}else{

            jQuery.get('get_data.php?dataSrc=' + data_source, '', function(result)
            {
                add_field_select(max_row, result, "");
                add_query_check(max_row, 0);
                
                if(typeof arr_data != "undefined")
                {
                    if(typeof arr_data['data_field'] != "undefined" && arr_data['data_field'] != "")
                    {
                        jQuery("#datafield_" + max_row).val(arr_data['data_field'])
                    }
                    if(typeof arr_data['data_query'] != "undefined" && arr_data['data_query'] == "1")
                    {
                        jQuery("#query_" + max_row).prop("checked", true);
                    }
                }
            });
    	}
 
    }
    
    jQuery("#max_row").val(parseInt(max_row)+1);
    jQuery("#max_no").val(parseInt(max_no)+1);
    
    var variableVal = jQuery('#txtVariable').find('option:selected').attr('sortid') || '';
    if(variableVal != '')
    {
        jQuery('#col_def_table').find('tr').eq(max_row).find('td').last().remove();
        var $tr = jQuery('#col_def_table').find('tr').last();
        $tr.append(htmlArr[variableVal]);
		if(typeof(arr_data) != 'undefined' && uidArr[variableVal].indexOf(arr_data['variable']) == -1)
		{
			arr_data['variable'] = '';
		}
		if(typeof(arr_data) != 'undefined')
		{
			jQuery('[name="variable_select"]').eq(max_row-1).val( arr_data['variable'] );
		}
        parseVariableOptions(jQuery('[name="variable_select"]').eq(max_row-1));
    }
}

function getListViewHtml(outType)
{

    var str_lv_title = "";
    var str_lv_field = "";
    var str_lv_size  = "";
    var str_lv_sum   = "";
    var str_lv_cal   = "";
    var str_lv_coltype = "";
    var str_lv_colvalue = "";
    var str_variable = "";
    var json_variable = [];
    var str_uid = "";
	var variableSortUid = '';
    
    var data_table = "";     
    var data_table_name = "";
    var str_data_field="";
    var str_data_field_name = "";
    var str_query_field = "";
     
    var data_type = jQuery("#dataType").val();
    var dataSrc = jQuery("#dataSrc").val();
    var extDataSrcID = jQuery('#extDataSrcID').val();
    var extDataSrcName = jQuery('#extDataSrcName').val();
    
    var txtVariable = jQuery('#txtVariable').find('option:selected').val();
    var variable_sort_id = jQuery('#txtVariable').find('option:selected').attr('sortid');
	variable_sort_id = typeof(variable_sort_id) == 'undefined' ? '' : variable_sort_id;
    var row_count = jQuery("#max_row").val();
    $.ajax({
        url: 'get_uid.php',
        data: {'rows': row_count},
        async: false,
        cache: false,
        success: function(ret){
            json_variable = ret;
        }
    });
    for(var i = 1;i < row_count; i++)
    {
        if(jQuery("#row_delete_" + i).val() == "1")
        {
            continue;
        }
        
        var str_select_value= jQuery("#valueId").val();
        
        var item    = jQuery("#item_" + i).val();
       // var field   = jQuery("#field_" + i).val();
        var size    = jQuery("#size_" + i).val();
        var sum     = jQuery("#sum_"  + i);
        var cal     = jQuery("#cal_"  + i).val();
        var coltype = jQuery("#coltype_" + i).val();
        var colvalue= jQuery("#colvalue_" + i).val();
        
        if(jQuery.trim(item) == "")
        {
            continue;
        }
        
        str_lv_title += item + "`";
        //str_lv_field += field + "`";
        if(jQuery.trim(size) != "")
        {
            str_lv_size += size + "`";
        }else
        {
            str_lv_size += "72`";
        }
        if(sum.prop("checked") == true)
        {
            str_lv_sum += "1`";
        }else
        {
            str_lv_sum += "0`";
        }
        
        str_lv_cal   += cal  + "`";
        str_lv_coltype += coltype + "`";
        
        if(colvalue.substring(colvalue.length-1) == ",")
        {
            str_lv_colvalue += colvalue.substring(0, colvalue.length - 1) + "`";
            
        }else
        {
            str_lv_colvalue += colvalue + "`";
        }
        if(txtVariable == '')
        {
			variableSortUid = json_variable[0];
            str_variable += json_variable[i] + "`";
        }
        else
        {
			variableSortUid = txtVariable;
            str_uid = jQuery('[name="variable_select"]').eq(i-1).find('option:selected').val();
            if(str_uid == '')
            {
                str_variable += json_variable[i] + "`";
            }
            else
            {
                str_variable += str_uid + "`";
            }
        }

        if(dataSrc != "" || (extDataSrcID != "" && extDataSrcID != "null") )
        {
            if(!jQuery("#datafield_" + i))
            {
                continue;
            }

            var data_field = jQuery("#datafield_" + i).val();
            str_data_field += data_field + "`";

            if(data_field != "")
            {
                str_data_field_name += jQuery("#datafield_" + i).find("option:selected").text()  + "`";
            }

            if(data_field != "")
            {
                if(jQuery("#query_" + i).prop("checked") == true)
                {
                    str_query_field += "1`";
                }else
                {
                    str_query_field += "0`";
                }
            }else{
                str_query_field += "0`";
            }

        }
    }
    jQuery("#data_name").val(ctrl_id);
  //  firstfun(str_lv_field);
    if(data_type == 1)
    {
        data_table = dataSrc;
        data_table_name = "";
    }else if(data_type == 2)
    {
        data_table = extDataSrcID;
        data_table_name = extDataSrcName;
    }
    
    if(outType == '1')
    {
        var out = "<img "
                     + "title=\"" + jQuery("#ctrl_name").val().replace("\"", "&quot;") + "\" "
                     + "default_cols=\"" + jQuery("#ctrl_default_cols").val() + "\" "
                     + "border=\"0\" "
                     + "name=\"DATA_" + ctrl_id + "\" "
                     + "alt=\"\" align=\"absMiddle\" "
                     + "lv_title=\"" + str_lv_title + "\" "
                     + "lv_sum=\"" + str_lv_sum + "\" "
                     // + "lv_field=\""+ str_lv_field + "\" "
                     + "lv_size=\"" + str_lv_size + "\" "
                     + "lv_colvalue=\"" + str_lv_colvalue + "\" "
                     + "lv_coltype=\"" + str_lv_coltype + "\" "
                     + "lv_cal=\"" + str_lv_cal + "\" "
                     + "datatype=\"" + data_type + "\" "
                     + "lv_value=\"" + str_select_value + "\""
                     + "variable_sort_id=\"" + variable_sort_id + "\""
                     + "variable_sort_uid=\"" + variableSortUid + "\""
                     + "variable_id=\"" + str_variable + "\""
                     + "new_width=\"" + true + "\"";
    
        if(jQuery.trim(data_table) != "")
        {
            out = out + "data_field=\"" + str_data_field + "\" "
                      + "data_table=\"" + data_table + "\" "
                      + "data_table_name=\"" + data_table_name + "\" "
                      + "data_fld_name=\"" + str_data_field_name + "\" "
                      + "data_query=\"" + str_query_field + "\" ";
        }
    
        out  = out + " class=\"LIST_VIEW\" style=\"cursor: hand\" "
                  + "src=\"" + MYOA_STATIC_SERVER + "/static/images/form/listview.png\" />";
        
        return out;

    }else{
        if(jQuery.trim(data_table) != "")
        {
           return {
             "title"        : jQuery("#ctrl_name").val().replace("\"", "&quot;"),
             "default_cols" : jQuery("#ctrl_default_cols").val(),
             "lv_title"     : str_lv_title,
             "lv_sum"       : str_lv_sum,
             "lv_value"     : str_select_value,
             // "lv_field"     : str_lv_field,
             "lv_size"      : str_lv_size,
             "lv_colvalue"  : str_lv_colvalue,
             "lv_coltype"   : str_lv_coltype,
             "lv_cal"       : str_lv_cal,
			 "variable_sort_id" : variable_sort_id,
             "variable_sort_uid" : variableSortUid,
             "variable_id" : str_variable,
             "datatype"     : data_type,
             "data_field"     : str_data_field,
             "data_table"     : data_table,
             "data_table_name": data_table_name,
             "data_fld_name"  : str_data_field_name,
             "data_query"     : str_query_field,
             "new_width"      : true
           };
        }else
        {
            return {
                "title"        : jQuery("#ctrl_name").val().replace("\"", "&quot;"),
                "default_cols" : jQuery("#ctrl_default_cols").val(),
                "lv_title"     : str_lv_title,
                "lv_sum"       : str_lv_sum,
                "lv_value"     : str_select_value,
                // "lv_field"     : str_lv_field,
                "lv_size"      : str_lv_size,
                "lv_colvalue"  : str_lv_colvalue,
                "lv_coltype"   : str_lv_coltype,
                "lv_cal"       : str_lv_cal,
				"variable_sort_id" : variable_sort_id,
				"variable_sort_uid" : variableSortUid,
                "variable_id" : str_variable ,
                "datatype"     : data_type,
                "data_field"     : "",
                "data_table"     : "",
                "data_table_name": "",
                "data_fld_name"  : "",
                "data_query"     : "",
                "new_width"      : true
              }; 
        }

    }
    
}

var extResult = '';
function _InitCtrlProp(el)
{
    var name = jQuery(el).attr('name'); //控件ID
    
    var default_cols = jQuery(el).attr('default_cols');
    if(typeof(default_cols) == 'undefined'){
        default_cols = 0;
    }
    var title = jQuery(el).attr('title');   
    var lv_title = jQuery(el).attr('lv_title');
    var lv_field = jQuery(el).attr('lv_field'); 
    var lv_valueId=jQuery(el).attr("lv_value");
    var lv_sum = jQuery(el).attr('lv_sum');   
    var lv_size = jQuery(el).attr('lv_size');   
    var lv_colvalue = jQuery(el).attr('lv_colvalue');   
    var lv_coltype = jQuery(el).attr('lv_coltype');   
    var lv_cal = jQuery(el).attr('lv_cal');   
    var lv_variable_id = jQuery(el).attr('variable_id');   
    var variable_sort_id = jQuery(el).attr('variable_sort_id');
	var variable_sort_uid = jQuery(el).attr('variable_sort_uid');

    //html中没有UID时，就取缓存中的UID（工作流数据升级到流程中心时、工作流表单导入到流程中心时会出现这种形况）
    if(variable_sort_uid === '' || variable_sort_uid === null || variable_sort_uid === 0 || variable_sort_uid === false || variable_sort_uid === undefined)
    {
        if(lv_variable_id === '' || lv_variable_id === null || lv_variable_id === 0 || lv_variable_id === false || lv_variable_id === undefined)
        {
            var cacheUids = new Array();
            jQuery.ajax({
                type: 'POST',
                async: false,
                url: '../inc/variable_cache.php',
                data: {
                    FORM_ID: window.form_id || 0
                },
                success: function(data){
                    cacheUids = data;
                }
            });
            cacheUids = JSON.parse(cacheUids);
            variable_sort_uid = cacheUids[name];
            lv_variable_id = cacheUids['VARIABLE_ID'][name];
        }
    }
    var datatype = jQuery(el).attr('datatype');
    var data_table = jQuery(el).attr('data_table');
    var data_table_name = jQuery(el).attr('data_table_name');
    var data_fld_name = jQuery(el).attr('data_fld_name');
    var data_field = jQuery(el).attr('data_field');
    var data_query = jQuery(el).attr('data_query');
    
    // ctrl_id = name.substr(5);
    jQuery('#ctrl_name').val(title);
    jQuery('#ctrl_default_cols').val(default_cols);
	var listObj = jQuery('#txtVariable').find('option[value="'+variable_sort_uid+'"]');
	if(listObj.length > 0)
	{
		jQuery('#txtVariable').val(variable_sort_id);
		listObj.prop('selected', true);
	}
	
    parseOptions(jQuery('#txtVariable'));
    jQuery('#dataType').val(datatype);
    jQuery('#cur_data_source').val(data_table);
    
    if(datatype == "1")
    {
        jQuery('#dataSrc').show();
        jQuery("#extDataSelect").hide();
        jQuery('#dataSrc').val(data_table);
        
    }else
    {
        jQuery("#extDataSelect").show();
        jQuery("#dataSrc").hide();
        jQuery('#extDataSrcName').val(data_table_name);
        jQuery('#extDataSrcID').val(data_table);
    }
    
    var array_lv_title = lv_title.split("`");
    var array_lv_sum = lv_sum.split("`");
    if(lv_field != null)
    {
    	var array_lv_field = lv_field.split("`");
    }
    var array_lv_size = lv_size.split("`");
    var array_lv_colvalue = lv_colvalue.split("`");
    var array_lv_coltype = lv_coltype.split("`");
    var array_lv_cal = lv_cal.split("`");
    var array_variable_id = lv_variable_id.split("`");

    //alert(data_table)
    if(typeof data_table != "undefined" && data_table != "")
    {
        // 加入表头
        var str_header_html = "<td id=\"header_field_col\" align=\"center\">"
                            + td_lang_utf8.system.workflow.msg_listview_ctrl_2
                            + "</td>" + "<td id=\"header_check_col\"  align=\"center\">"
                            + td_lang_utf8.system.workflow.msg_listview_ctrl_3
                            + "</td>" ;  
        jQuery("#tr_header").append(str_header_html);
        var array_data_field = data_field.split("`");
        var array_data_query = data_query.split("`");
    }
   
    var col_count = array_lv_title.length - 1;
    for(var i = 0; i < col_count; i++)
    {
        var arr_data = new Array();
        arr_data['title'] = array_lv_title[i];
        arr_data['sum'] = array_lv_sum[i];
        if(array_lv_field!=null)
        {
        	arr_data['field'] = array_lv_field[i];
        }
        arr_data['value']=lv_valueId;
        arr_data['size'] = array_lv_size[i];
        arr_data['colvalue'] = array_lv_colvalue[i];
        arr_data['coltype'] = array_lv_coltype[i];
        arr_data['cal'] = array_lv_cal[i];
        arr_data['variable'] = array_variable_id[i];
        if(typeof data_table != "undefined"  && data_table != "")
        {
            arr_data['data_field'] = array_data_field[i];
            arr_data['data_query'] = array_data_query[i];

        }
        
        add_row(arr_data,lv_valueId);  
    }
    // jQuery("#data_name").val(ctrl_id);
   	// jQuery("#slectFT").val( arr_data['value'] );
   	// if(arr_data['value']!="" &&arr_data['value']!=null)
   	// {
   		// selectTF(arr_data['value']);
   		// jQuery("#slectFT").val(arr_data['value']);
   	// }
   	// else
   	// {
   		// selectTF(2);
   		// jQuery("#slectFT").val(2);
   	// }
    jQuery("#new_data").val(arr_data['value']);
    // lastfun();
    
}
function SelectDataSrc(ID, NAME)
{
    var URL = "ext_tree?ID="+ID+"&NAME="+NAME;
    var width = 300;
    var height = 400;
    var loc_x = (jQuery(window.top).width() - width)/2;
    var loc_y = (jQuery(window.top).height() - height)/2;
    
    if(typeof(window.showModalDialog) != 'undefined')//window.open(URL);
       window.showModalDialog(URL,window,"edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:"+width+"px;dialogHeight:"+height+"px;dialogTop:"+loc_y+"px;dialogLeft:"+loc_x+"px",true);
    else
       window.open(URL, "SelectDataSrcListView", ("height="+height+",width="+width+",status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes,modal=yes,dependent=yes,dialog=yes,minimizable=no"), true);
}

function ClearDataSrc(ID, NAME)
{
    jQuery('#' + ID).val('');
    jQuery('#' + NAME).val('');
    jQuery("select[id^=datafield_]").find("option:gt(0)").remove();
}

