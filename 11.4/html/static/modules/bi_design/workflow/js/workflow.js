jQuery(document).ready(function()
{
    var init_id = jQuery("#ID").val();
    var init_flow_id = jQuery("#edit_flow_id").val();
    var init_flow_name = jQuery("#edit_flow_name").val();
	jQuery.getJSON('/general/workflow/get_flow_list.inc.php', {root:true,action:0}, function(jsonData){
		jQuery("#flow_id").html("");
		jQuery.each(jsonData,function(i,t){
            //jQuery("#flow_id").append('<option value=""></option>');
			jQuery("#flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
		});
		//上半部分为为页面的SELECT动态加载OPTIONS内容
		jQuery("#flow_id").combobox();//此页面表示将SELECT控件进行标准处理
        if(init_id)
        {   
            jQuery("input[id='flow_name']").attr("disabled",true);
            jQuery(".dropdown-toggle").attr("disabled",true);
        }
        jQuery("#flow_name").val(init_flow_name);
        jQuery("#flow_id").find('option[value='+init_flow_id+']').attr("selected",true);
	});
	jQuery(window).resize(function(){
		jQuery('#nav-right-container').css('height',getMainDivHeight());
	});
	jQuery(window).trigger('resize');
	//toggleSelectDisabled(1);
	//toggleSelectDisabled(2);
    /*
    jQuery("a[data-toggle='tab']").parent().click(function(){
		return checkEssentialInfo();
	});
    */
    /*
    jQuery("span").mouseover(function(){
        
    });
    */
    jQuery("#closeBtn").click(function(){
        window.close();
    });
	jQuery('#nav_left').find('a').click(function(event){
        event.preventDefault();
		jQuery(this).attr('data-toggle','');
	});
});

jQuery(window).load(function(){
    /*
    if(jQuery("#group_order_type").val() == "DESC")
    {
        jQuery("select[name='basic_sequence']").find("option[value='DESC']").attr("selected",true);
    }elses
    {
        jQuery("select[name='basic_sequence']").find("option[value='ASC']").attr("selected",true);
    }
    */
    //jQuery("#addBasicField").trigger("click");
    //jQuery("#basic_field_div").eq(-1).remove();
});
function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var bottomHeight=jQuery('.work_bottom').outerHeight(true);
	var MainDivHeight=windowsHeight-(25+bottomHeight+20);
	return MainDivHeight;
}
function changeFlow(obj){
	jQuery('#advSearchBtn').click();
	
	var flow_id = jQuery('#flow_id').val();
	jQuery("#FLOW_ID").val(flow_id);
	jQuery("#ITEM_NAME1").load("get_field.php?FLOW_ID="+flow_id);
	jQuery("#ITEM_NAME2").load("get_field.php?FLOW_ID="+flow_id);
    
    jQuery('[name="field_content_child"]').each(function(i,element){
        jQuery("#basic_field_div").remove();
    });
    jQuery('[name="field_form_content_child"]').each(function(i,element){
        jQuery("#collect_field_div").remove();
    });
    jQuery('[name="new_field_content_child"]').each(function(i,element){
        jQuery("#new_field_div").remove();
    });
    jQuery('[name="detail_content_child"]').each(function(i,element){
        jQuery("#detail_field_div").remove();
    });
    jQuery("#F_PRCS_ID").val("");
    jQuery("#addBasicField").trigger("click");
    jQuery("#addStaField").trigger("click");
    jQuery("#addFormField").trigger("click");
    jQuery("#addDetailField").trigger("click");
    //jQuery(obj).parent().parent().parent().find("span[name='icon-remove']").trigger("click");
}
//function change_type(flag)
//{
//	if((document.getElementById("CHECK_TYPE"+flag).checked))
//	{
//		jQuery("#div_type"+flag).css('display', 'block');
//		jQuery("#div_value"+flag).css('display', 'none');
//	}
//	else
//	{
//		jQuery("#div_type"+flag).css('display', 'none');
//		jQuery("#div_value"+flag).css('display', 'block');
//	}
//}
//function change_condition(flag)
//{
//		var condition_id = jQuery("#CONDITION"+flag).val();
//		if((condition_id == "=") || (condition_id == "<>"))
//		{
//			jQuery("#div_check_estimate"+flag).css('display', 'inline');
//		}else{
//			jQuery("#div_check_estimate"+flag).css('display', 'none');
//			jQuery("#div_type"+flag).css('display', 'none');
//			jQuery("#div_value"+flag).css('display', 'inline');
//		}
//};
function addField(flag,tbody_id)
{
	var flow_id = jQuery('#flow_id').val();
	if(flag == 1)
	{
		var url = "/general/bi_design/workflow/workflow_engine/newfield.php?FLOW_ID="+flow_id;
	}else if(flag == 2){
		var url = "/general/bi_design/workflow/workflow_engine/collectfield.php?FLOW_ID="+flow_id;
	}else if(flag == 3){
		var url = "/general/bi_design/workflow/workflow_engine/basic_field.php?FLOW_ID="+flow_id;
	}else if(flag == 4){
        var url = "/general/bi_design/workflow/workflow_engine/detail_field.php?FLOW_ID="+flow_id;
    }
	jQuery.ajax({
	    type:"post",
	    url:url,
	    data:{"id":''},
	    success:function(html){
	    	var nub = jQuery("#"+tbody_id+" tr").eq(-1).find(".appnubs").text();
	    	if(nub == "")
	    	{
	    		nub = 0;
	    	}
	        nub = (parseInt(nub) + 1);
	        jQuery("#"+tbody_id).append(html);
	        jQuery("#"+tbody_id).find("td").css('border','0px');
	        jQuery("#"+tbody_id).find("td").css('padding','0px');
	        if(!jQuery("#"+tbody_id).find("td"))
	        {
	        	jQuery("#"+tbody_id).Remove();
	        }
	        
	        jQuery("#"+tbody_id+" tr").eq(-1).find(".appnubs").text("");
			jQuery("#"+tbody_id+" tr").eq(-1).find(".appnubs").text(nub);
	    },
	});
}
function bi_delete(edit,tbody_id,type)
{
    var I = 0;
    //alert(I);
    var type = type;
    var basic_add_obj = jQuery('[name="basic_add"]').length;
    var collect_add_obj = jQuery('[name="collect_add"]').length;
    var new_add_obj = jQuery('[name="new_add"]').length;
    var detail_add_obj = jQuery('[name="detail_add"]').length;
    //var model_add_obj = jQuery(edit).parent().length;
	jQuery('#'+tbody_id+' tr').each(function(){
		I++;
		jQuery(this).find(".appnubs").text("");
		jQuery(this).find(".appnubs").text(I);
	});
   // alert(I);
    if(type == 1 && basic_add_obj == 1)
    {
        alert("请至少保留一条分组设置！");
        return false;
    }
    else if(type == 2 && collect_add_obj == 1)
    {
        alert("请至少保留一条汇总方式！");
        return false;
    }
    else if(type == 3 && new_add_obj == 1)
    {
        alert("请至少保留一条过滤条件！");
        return false;
    }else if(type == 4 && detail_add_obj == 1)
    {
        alert("请至少保留一条明细字段！");
        return false;
    }
    else
    {
        jQuery(edit).parent().parent().parent().parent().remove();
	}
    var I = 0;
	jQuery('#'+tbody_id+' tr').each(function(){
		I++;
		jQuery(this).find(".appnubs").text("");
		jQuery(this).find(".appnubs").text(I);
	});	
}
//function change_data(Summary)
//{
//	if(jQuery(Summary).is(":checked"))
//	{
//		jQuery(Summary).parent().parent().parent().find('.bi_select').css('display', 'block');
//		jQuery(Summary).parent().parent().parent().find('.bi_text').css('display', 'none');
//	}
//	else
//	{
//		jQuery(Summary).parent().parent().parent().find('.bi_select').css('display', 'none');
//		jQuery(Summary).parent().parent().parent().find('.bi_text').css('display', 'block');
//	}
//}

//function bi_condition(flag)
//{
//		var condition_id = jQuery(flag).val();
//		if((condition_id == "=") || (condition_id == "<>"))
//		{
//			jQuery(flag).parent().parent().find('.circulation_sponsor_checkbox').css('display', 'inline');
//		}else{
//			jQuery(flag).parent().parent().find('.circulation_sponsor_checkbox').css('display', 'none');
//			jQuery(flag).parent().parent().find('.bi_select').css('display', 'none');
//			jQuery(flag).parent().parent().find('.bi_text').css('display', 'inline');
//		}
//};
function toggleSelectDisabled(flag)
{
	//alert(jQuery(flag).val());
	//alert(jQuery(flag).find("option:selected").attr('types'));
	if(jQuery(flag).find("option:selected").attr('types') == "SYS_DATE_CN" || jQuery(flag).find("option:selected").attr('types') == "SYS_DATE")
	{
        jQuery(flag).parent().parent().find("select[name='basic_sequence']").removeAttr("disabled");
        jQuery(flag).parent().parent().find("input[name='condition_item_value']").removeAttr("disabled");
        jQuery(flag).parent().parent().find("select[name='basic_time']").removeAttr("disabled");
    }else if(jQuery(flag).find("option:selected").attr('types') == undefined)
    {
        jQuery(flag).parent().parent().find("select[name='basic_sequence']").attr({"disabled":"disabled"});
        jQuery(flag).parent().parent().find("input[name='condition_item_value']").attr({"disabled":"disabled"});
        jQuery(flag).parent().parent().find("select[name='basic_time']").attr({"disabled":"disabled"});
        jQuery(flag).parent().parent().find("input[name='condition_item_value']").val("");
    }
    else
    {
        jQuery(flag).parent().parent().find("select[name='basic_sequence']").removeAttr("disabled");
        jQuery(flag).parent().parent().find("input[name='condition_item_value']").removeAttr("disabled");
        jQuery(flag).parent().parent().find("select[name='basic_time']").attr({"disabled":"disabled"});
	}
//	var item_name = jQuery("#ITEM_NAME"+flag).find('option:selected').text();
//	var item_name_prev = jQuery("#item_name_prev"+flag).val();	
//	var hide_name = jQuery("#condition_item_value"+flag).val();
//	if(hide_name == "" || hide_name == item_name_prev)
//	{
//		jQuery("#condition_item_value"+flag).val(item_name);
//	}
//	jQuery("#item_name_prev"+flag).val(item_name);	
}
function field_hide_name(edit,tbody_id)
{
    if(jQuery(edit).find("option:selected").attr('types') == undefined)
    {
        jQuery(edit).parent().parent().find("select[name='collect_content']").attr({"disabled":"disabled"});
        jQuery(edit).parent().parent().find("input[name='hide_name']").attr({"disabled":"disabled"});
        jQuery(edit).parent().parent().find("input[name='hide_name']").val("");
    }
    else
    {
        jQuery(edit).parent().parent().find("select[name='collect_content']").removeAttr("disabled");
        jQuery(edit).parent().parent().find("input[name='hide_name']").removeAttr("disabled");
	}
}
function new_field_hide_name(field,tbody_id)
{
    if(jQuery(field).find("option:selected").attr('types') == undefined)
    {
        jQuery(field).parent().parent().find("select[name='collect_content']").attr({"disabled":"disabled"});
        jQuery(field).parent().parent().find("input[name='field_size']").attr({"disabled":"disabled"});
        jQuery(field).parent().parent().find("input[name='field_size']").val("");
    }
    else
    {
        jQuery(field).parent().parent().find("select[name='collect_content']").removeAttr("disabled");
        jQuery(field).parent().parent().find("input[name='field_size']").removeAttr("disabled");
	}
}
function detail_hide_name(field)
{
    if(jQuery(field).find("option:selected").attr("types") == undefined)
    {
        jQuery(field).parent().parent().find("input[name='detail_item_value']").attr({"disabled":"disabled"});
        jQuery(field).parent().parent().find("input[name='detail_item_value']").val("");
    }
    else
    {
        jQuery(field).parent().parent().find("input[name='detail_item_value']").removeAttr("disabled");
    }
}
function my_submit()
{
    var collect_list = "";
	var addarea_list = "";
	var col_list="";
	var basic_list = "";
	var basic_col_list = "";
    var detail_list = "";
    var errorMsg = "";
    var alertFlag = false;
    var tempArr = new Array();
    var tempCollectArr = new Array();
    var count = 0;//循环变量
    var CollectCount = 0;//循环变量
    if(jQuery.trim(jQuery("#model_intro").find("input[id='step_val']").val()) == "")
    {
        alert("工作流BI数据源必填！");
        return false;
    }else if(jQuery.trim(jQuery("#model_intro").find("select[id='flow_id']").val()) == "all" || jQuery.trim(jQuery("#model_intro").find("select[id='flow_id']").val()) == "" || jQuery.trim(jQuery("#model_intro").find("input[id='flow_name']").val()) == "")
    {
        alert("所属流程必填！");
        return false;
    }
    /*
	jQuery('#bacic_id').find('.condition_sponsor_content').each(function(){
		var bacic_field_hide_size_val = jQuery(this).find("select[name='ITEM_NAME']").find('option:selected').val(); 
		var bacic_field_hide_size_data = jQuery(this).find("select[name='ITEM_NAME']").find('option:selected').text();
		var bacic_field_hide_size_type = jQuery(this).find("select[name='ITEM_NAME']").find('option:selected').attr('types');
		var basic_sequence = jQuery(this).find("select[name='basic_sequence']").find('option:selected').val(); 
		var bacic_size = jQuery(this).find("input[name='condition_item_value']").val(); 
		var basic_time = jQuery(this).find("select[name='basic_time']").find('option:selected').val(); 
		
		if(bacic_field_hide_size_type == "SYS_DATE_CN")
		{
			if(basic_time == "YEAR")
			{
				basic_list += "Y_" + bacic_field_hide_size_val + ":" + bacic_size + ";";
			}else if(basic_time == "MONTH"){
				basic_list += "Y_" + bacic_field_hide_size_val + ":" + bacic_size + ";";
			}else{
				basic_list += "D_" + bacic_field_hide_size_val + ":" + bacic_size + ";";
			}
			basic_col_list += bacic_field_hide_size_val + ":" + bacic_field_hide_size_data + ":" + basic_sequence + ":" + bacic_size  + ":" + basic_time + "\n";
		}else{
			basic_list += bacic_field_hide_size_val + ":" + bacic_size + ";";
			basic_col_list += bacic_field_hide_size_val + ":" + bacic_field_hide_size_data + ":" + basic_sequence + ":" + bacic_size  + ":\n";
		}
	});	
    */
    //分组设置验证
    jQuery('[name="field_content_child"]').each(function(i,element)
    {
        if(jQuery(element).parent().parent().find("input[name='condition_item_value']").attr("disabled") == "disabled")
        {
            emptyMsg = "请至少选择一个分组依据！";
            isAlert = true;
            result = false;
            return true;
        }
        else
        {
            isAlert = false;
            return false;
        }   
    });
    if(isAlert)
    {
        alert(emptyMsg);
        return result;
    }
    jQuery('[name="field_content_child"]').each(function(i,element)
    {
        if(jQuery(element).parent().parent().find("input[name='condition_item_value']").attr("disabled") != "disabled")
        {
            var font_show_name = jQuery(element).parent().parent().find("input[name='condition_item_value']").val();
            var index = (i+1);
            if(font_show_name == '')
            {   
                alert('第'+index+'组分组依据字段显示名称不能为空！');
                jQuery(element).parent().parent().find("input[name='condition_item_value']").focus();
                isAlert = true;
                result = false;
                return false;
            }else
            {
                isAlert = false;
            }
        }   
    });
    if(isAlert)
    {
        return result;
    }
    jQuery('[name="field_content_child"]').each(function(i,element)
    {   
        if(jQuery(element).parent().parent().find("input[name='condition_item_value']").attr("disabled") != "disabled")
        {
            if(tempArr == "")
            {
                tempArr[count] = jQuery(element).parent().parent().find("select[name='ITEM_NAME']").find("option:selected").val();
                count++;
            }else
            {
                var originalVal = jQuery(element).parent().parent().find("select[name='ITEM_NAME']").find("option:selected").val();
                if(in_array(originalVal, tempArr) == true)
                {
                    alert("分组依据字段不能重复！");
                    isAlert = true;
                    result = false;
                    return false;
                }
                tempArr[count] = originalVal;
                count++;
            }
        }else
        {
            isAlert = false;
        }
    });
    if(isAlert)
    {
        return result;
    }
    //汇总方式验证
    jQuery('[name="field_form_content_child"]').each(function(i,element)
    {
        if(jQuery(element).parent().parent().find("input[name='hide_name']").attr("disabled") == "disabled")
        {
            emptyMsg = "请至少选择一个汇总依据！";
            isAlert = true;
            result = false;
            return true;
        }
        else
        {
            isAlert = false;
            return false;
        }   
    });
    if(isAlert)
    {
        alert(emptyMsg);
        return result;
    }
    jQuery('[name="field_form_content_child"]').each(function(i,element)
    {
        if(jQuery(element).parent().parent().find("input[name='hide_name']").attr("disabled") != "disabled")
        {
            var font_show_name = jQuery(element).parent().parent().find("input[name='hide_name']").val();
            var index = (i+1);
            if(font_show_name == '')
            {   
                alert('序号为'+index+'的汇总依据字段显示名称不能为空！');
                jQuery(element).parent().parent().find("input[name='hide_name']").focus();
                isAlert = true;
                result = false;
                return false;
            }else
            {
                isAlert = false;
            }
        }   
    });
    if(isAlert)
    {
        return result;
    }
    jQuery('[name="field_form_content_child"]').each(function(i,element)
    {   
        if(jQuery(element).parent().parent().find("input[name='hide_name']").attr("disabled") != "disabled")
        {
            if(tempCollectArr == "")
            {
                var compareVal = jQuery(element).parent().parent().find("select[name='field_hide_size']").find("option:selected").val();
                compareVal += jQuery(element).parent().parent().find("select[name='collect_content']").find("option:selected").val();
                tempCollectArr[CollectCount] = compareVal;
                CollectCount++;
            }else
            {
                var originalVal = jQuery(element).parent().parent().find("select[name='field_hide_size']").find("option:selected").val();
                originalVal += jQuery(element).parent().parent().find("select[name='collect_content']").find("option:selected").val();
                if(in_array(originalVal, tempCollectArr) == true)
                {
                    alert("汇总依据字段不能重复！");
                    isAlert = true;
                    result = false;
                    return false;
                }
                tempCollectArr[CollectCount] = originalVal;
                CollectCount++;
            }
        }else
        {
            isAlert = false;
        }
    });
    if(isAlert)
    {
        return result;
    }
    //明细字段验证
    jQuery('[name="detail_content_child"]').each(function(i,element)
    {
        
        if(jQuery(element).parent().parent().find("input[name='detail_item_value']").attr("disabled") != "disabled")
        {
            var font_show_name = jQuery(element).parent().parent().find("input[name='detail_item_value']").val();
            var index = (i+1);
            if(font_show_name == '')
            {   
                alert('序号为'+index+'的明细字段显示名称不能为空！');
                jQuery(element).parent().parent().find("input[name='detail_item_value']").focus();
                isAlert = true;
                result = false;
                return false;
            }else
            {
                isAlert = false;
            }
        }  
    });
    if(isAlert)
    {
        return result;
    }
    jQuery('[name="detail_content_child"]').each(function(i,element)
    {
        
        if(jQuery(element).parent().parent().find("input[name='detail_item_value']").attr("disabled") != "disabled")
        {
            var font_show_name = jQuery(element).parent().parent().find("input[name='detail_item_value']").val();
            var index = (i+1);
            if(font_show_name.indexOf("|") != -1)
            {   
                alert('序号为'+index+'的明细字段显示名称不能含有特殊字符！');
                jQuery(element).parent().parent().find("input[name='detail_item_value']").focus();
                isAlert = true;
                result = false;
                return false;
            }else
            {
                isAlert = false;
            }
        }  
    });
    if(isAlert)
    {
        return result;
    }
    jQuery('[name="detail_content_child"]').each(function(i,element)
    {
    
        var originalVal = jQuery(element).parent().parent().find("select[name='detail_name']").val();
        if(in_array(originalVal, tempArr) == true)
        {
            emptyMsg = "明细字段与分组依据字段不能重复！";
            isAlert = true;
            result = false;
            return false;
        }else
        {
            isAlert = false;
        }
   });
    if(isAlert)
    {
        alert(emptyMsg);
        return result;
    }
    //分组设置
    jQuery("#addbacic").find('.condition_sponsor_content').each(function(){
        if(jQuery(this).find("select[name='ITEM_NAME']").find('option:selected').val() != "")
        {
            var bacic_field_hide_size_val = jQuery(this).find("select[name='ITEM_NAME']").find('option:selected').val(); 
            var bacic_field_hide_size_data = jQuery(this).find("select[name='ITEM_NAME']").find('option:selected').text();
            var bacic_field_hide_size_type = jQuery(this).find("select[name='ITEM_NAME']").find('option:selected').attr('types');
            var basic_sequence = jQuery(this).find("select[name='basic_sequence']").find('option:selected').val(); 
            var bacic_size = jQuery(this).find("input[name='condition_item_value']").val(); 
            var basic_time = jQuery(this).find("select[name='basic_time']").find('option:selected').val(); 
            if(bacic_field_hide_size_type == "SYS_DATE_CN" ||  bacic_field_hide_size_type == "SYS_DATE")
            {
                if(basic_time == "YEAR")
                {
                    basic_list += "Y_" + bacic_field_hide_size_val + ":" + bacic_size + ";";
                }else if(basic_time == "MONTH"){
                    basic_list += "M_" + bacic_field_hide_size_val + ":" + bacic_size + ";";
                }else{
                    basic_list += "D_" + bacic_field_hide_size_val + ":" + bacic_size + ";";
                }
                basic_col_list += bacic_field_hide_size_val + ":" + bacic_field_hide_size_data + ":" + basic_sequence + ":" + bacic_size  + ":" + basic_time + "\n";
            }else{
                basic_list += bacic_field_hide_size_val + ":" + bacic_size + ";";
                basic_col_list += bacic_field_hide_size_val + ":" + bacic_field_hide_size_data + ":" + basic_sequence + ":" + bacic_size  + ":\n";
            }
        }
    });
	jQuery("#basic_list").val(basic_list);
	jQuery("#basic_col_list").val(basic_col_list);
	//汇总方式
	jQuery('#collect').find('.condition_sponsor_content').each(function(){
        if(jQuery(this).find("select[name='field_hide_size']").find('option:selected').val() != "")
        {
            var col_field_hide_size_val = jQuery(this).find("select[name='field_hide_size']").find('option:selected').val(); 
            var col_field_hide_size_data = jQuery(this).find("select[name='field_hide_size']").find('option:selected').text();
            var col_collect_content = jQuery(this).find("select[name='collect_content']").find('option:selected').val(); 
            var col_hide_name = jQuery(this).find("input[name='hide_name']").val(); 
            collect_list += col_field_hide_size_val + ":" + col_field_hide_size_data + ":" + col_collect_content + ":" + col_hide_name + "\n" ;
            col_list += col_collect_content + "_" + col_field_hide_size_val + ":" + col_hide_name + ";" ;
        }
	});	
	jQuery("#COLLECT_LIST").val(collect_list);
	jQuery("#COL_LIST").val(col_list);
	//过滤条件
	jQuery('#addarea').find('.condition_sponsor_content').each(function(){
        if(jQuery(this).find("select[name='field_hide_size']").find('option:selected').val() != "")
        {
            var add_field_hide_size_val = jQuery(this).find("select[name='field_hide_size']").find('option:selected').val(); 
            var add_field_hide_size_data = jQuery(this).find("select[name='field_hide_size']").find('option:selected').text();
            var add_collect_content = jQuery(this).find("select[name='collect_content']").find('option:selected').val(); 
            var add_field_size = jQuery(this).find("input[name='field_size']").val(); 
            addarea_list += add_field_hide_size_val + ":" + add_field_hide_size_data + ":" + add_collect_content + ":" + add_field_size + "\n" ;
        }
	});	
	jQuery("#ADDAREA_LIST").val(addarea_list);
    //明细字段
    jQuery('#detail').find('.condition_sponsor_content').each(function(){
        if(jQuery(this).find("select[name='detail_name']").find('option:selected').val() != "")
        {
            var add_field_hide_size_val = jQuery(this).find("select[name='detail_name']").find('option:selected').val();
            var add_field_size = jQuery(this).find("input[name='detail_item_value']").val();
            detail_list += add_field_hide_size_val + ":" + add_field_size + "|";
        }
    });
    jQuery("#detailList").val(detail_list);
    if(jQuery("#ID").val() == "")
    {
        document.getElementById("form_work_engine").action = "add.php";
        document.getElementById("form_work_engine").submit();
    }else
    {
        var id = jQuery("#ID").val();
        var engine_name = jQuery("#model_intro").find("input[id='step_val']").val()
        var flow_id = jQuery("#model_intro").find("select[id='flow_id']").val()
        var condition_expr = jQuery("#statistical_reports").find("input[id='F_PRCS_ID']").val();
        var url = "update.php";
        jQuery.ajax(
            {
                type: "POST",
                url: url,
                data: {"ID": id, "engine_name": engine_name, "flow_id": flow_id, "basic_col_list": basic_col_list, "summary_fields": collect_list, "ADDAREA_LIST": addarea_list, "col_list": col_list, "basic_list": basic_list, "condition_expr": condition_expr, "detail_list": detail_list},
                success: function()
                {
                    alert("保存成功！");
                    if(parent.opener)
                    {
                        parent.opener.refrashThetable();
                    }
                    window.opener=null;
                    window.open('','_self');
                    window.close();
                }
            }
        );
    }
    //window.close();
}
/*
function refreshPage(obj)
{
    
}
*/
function checkEssentialInfo()
{
    var step_val = jQuery.trim(jQuery("#step_val").val());
    var flow_id = jQuery.trim(jQuery("#flow_id").val());
    var flow_name = jQuery.trim(jQuery("#flow_name").val());
    var result = false;
    var emptyMsg = "";
    var isAlert = false;
    var tempArr = new Array();
    var tempCollectArr = new Array();
    var count = 0;//循环变量
    var CollectCount = 0;//循环变量
    if(step_val == "")
    {
        alert("工作流BI数据源必填！");
        return result;
    }else if(step_val != ""){
        if(flow_id == "all" || flow_id == "" || flow_name == "")
        {
            alert("所属流程必填！");
            return result;
        }else
        {   
            //分组设置验证
            if(jQuery("#basic").attr("class") == "tab-pane active")
            {
                jQuery('[name="field_content_child"]').each(function(i,element)
                {
                    if(jQuery(element).parent().parent().find("input[name='condition_item_value']").attr("disabled") == "disabled")
                    {
                        emptyMsg = "请至少选择一个分组依据！";
                        isAlert = true;
                        result = false;
                        return true;
                    }
                    else
                    {
                        isAlert = false;
                        return false;
                    }   
                });
                if(isAlert)
                {
                    alert(emptyMsg);
                    return result;
                }
                jQuery('[name="field_content_child"]').each(function(i,element)
                {
                    if(jQuery(element).parent().parent().find("input[name='condition_item_value']").attr("disabled") != "disabled")
                    {
                        var font_show_name = jQuery(element).parent().parent().find("input[name='condition_item_value']").val();
                        var index = (i+1);
                        if(font_show_name == '')
                        {   
                            alert('第'+index+'组分组依据字段显示名称不能为空！');
                            jQuery(element).parent().parent().find("input[name='condition_item_value']").focus();
                            isAlert = true;
                            result = false;
                            return false;
                        }else
                        {
                            isAlert = false;
                        }
                    }   
                });
                if(isAlert)
                {
                    return result;
                }
                jQuery('[name="field_content_child"]').each(function(i,element)
                {   
                    if(jQuery(element).parent().parent().find("input[name='condition_item_value']").attr("disabled") != "disabled")
                    {
                        if(tempArr == "")
                        {
                            tempArr[count] = jQuery(element).parent().parent().find("select[name='ITEM_NAME']").find("option:selected").val();
                            count++;
                        }else
                        {
                            var originalVal = jQuery(element).parent().parent().find("select[name='ITEM_NAME']").find("option:selected").val();
                            if(in_array(originalVal, tempArr) == true)
                            {
                                alert("分组依据字段不能重复！");
                                isAlert = true;
                                result = false;
                                return false;
                            }
                            tempArr[count] = originalVal;
                            count++;
                        }
                    }else
                    {
                        isAlert = false;
                    }
                });
                if(isAlert)
                {
                    return result;
                }
            }
            //汇总方式验证
            else if(jQuery("#form_data").attr("class") == "tab-pane active")
            {
                jQuery('[name="field_form_content_child"]').each(function(i,element)
                {
                    if(jQuery(element).parent().parent().find("input[name='hide_name']").attr("disabled") == "disabled")
                    {
                        emptyMsg = "请至少选择一个汇总依据！";
                        isAlert = true;
                        result = false;
                        return true;
                    }
                    else
                    {
                        isAlert = false;
                        return false;
                    }   
                });
                if(isAlert)
                {
                    alert(emptyMsg);
                    return result;
                }
                jQuery('[name="field_form_content_child"]').each(function(i,element)
                {
                    if(jQuery(element).parent().parent().find("input[name='hide_name']").attr("disabled") != "disabled")
                    {
                        var font_show_name = jQuery(element).parent().parent().find("input[name='hide_name']").val();
                        var index = (i+1);
                        if(font_show_name == '')
                        {   
                            alert('序号为'+index+'的汇总依据字段显示名称不能为空！');
                            jQuery(element).parent().parent().find("input[name='hide_name']").focus();
                            isAlert = true;
                            result = false;
                            return false;
                        }else
                        {
                            isAlert = false;
                        }
                    }   
                });
                if(isAlert)
                {
                    return result;
                }
                jQuery('[name="field_form_content_child"]').each(function(i,element)
                {   
                    if(jQuery(element).parent().parent().find("input[name='hide_name']").attr("disabled") != "disabled")
                    {
                        if(tempCollectArr == "")
                        {
                            var compareVal = jQuery(element).parent().parent().find("select[name='field_hide_size']").find("option:selected").val();
                            compareVal += jQuery(element).parent().parent().find("select[name='collect_content']").find("option:selected").val();
                            tempCollectArr[CollectCount] = compareVal;
                            CollectCount++;
                        }else
                        {
                            var originalVal = jQuery(element).parent().parent().find("select[name='field_hide_size']").find("option:selected").val();
                            originalVal += jQuery(element).parent().parent().find("select[name='collect_content']").find("option:selected").val();
                            if(in_array(originalVal, tempCollectArr) == true)
                            {
                                alert("汇总依据字段不能重复！");
                                isAlert = true;
                                result = false;
                                return false;
                            }
                            tempCollectArr[CollectCount] = originalVal;
                            CollectCount++;
                        }
                    }else
                    {
                        isAlert = false;
                    }
                });
                if(isAlert)
                {
                    return result;
                }
            }
            //过滤条件验证
        }
    }
}
function delItem(id)
{
    var id = id;
    var url = "data/dodelete.php";
    if(confirm("确定要删除这条工作流BI数据源吗？")){
        jQuery.ajax(
            {
                type: "POST",
                url: url,
                data: {"ID": id},
                success: function(){
                    jQuery("#gridTable").trigger("reloadGrid");
                },
            }
        );
    }
}
function in_array(needle, haystack) 
{
	if(typeof needle == 'string' || typeof needle == 'number') 
    {
		for(var i in haystack) 
        {
			if(haystack[i] == needle) 
            {
				return true;
			}
		}
	}
	return false;
}
function refrashThetable(){
	jQuery("#gridTable").trigger("reloadGrid");
}
/*
function editItem(id)
{
    var id = id;
    var url = "";
    jQuery.ajax(
        {
            type: "POST",
            url: url,
            data: ["ID": id],
            success: function(){
                alert(1);
            };
        }
    );
}
*/