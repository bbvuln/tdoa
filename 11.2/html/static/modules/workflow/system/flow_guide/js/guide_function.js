jQuery(document).ready(function()
{
	var flow_id = jQuery("#guide_flow_id").val();
	if(typeof(flow_id) == "undefined" || flow_id == ""){
		jQuery('#flow_smart', parent.document).attr({"disabled":"disabled"});
		jQuery('#flow_smart', parent.document).removeClass("btn-primary");	
	}else{
		jQuery('#flow_smart', parent.document).removeAttr("disabled");				
		jQuery('#flow_smart', parent.document).addClass("btn-primary");
	}
});



//向导页面复选框全选
function check_all(all_name, item_name)
{
	var el=document.getElementsByName(item_name);
	var all_checked = document.getElementById(all_name).checked;
	for (i=0;i<el.length;i++)
	{
		el.item(i).checked=all_checked;
	}

}


//删除管理权限、定时任务、查询模板、版式文件
function delete_list(model_id,flow_id,t_id)
{
	var delete_str="";
	if(typeof(t_id) == "undefined" || t_id == "")
	{
		jQuery("input[type=checkbox][name='"+model_id+"_checkbox']:checked").each(function(){
			var val=jQuery(this).attr('value');
			delete_str+=val + ",";	
		});	
	}else{
		delete_str = t_id;
	}
	if(delete_str=="")
	{
		alert(td_lang.general.workflow.msg_106);
		return;
	}
	if(model_id == "timer") //定时任务
	{
		var url = "/general/system/workflow/flow_guide/flow_type/set_timer/del_schema.php?DELETE_STR="+ delete_str + "&FLOW_ID="+flow_id;
	}else if(model_id == "manage"){ //管理权限
		var url = "/general/system/workflow/flow_guide/flow_type/set_manage/delete.php?DELETE_STR="+ delete_str + "&FLOW_ID="+flow_id;
	}else if(model_id == "query"){ //查询模板
		var url = "/module/flow_query_tpl/delete_ajax.php?DELETE_STR="+ delete_str + "&FLOW_ID="+flow_id;
	}else if(model_id == "print"){ //版式文件
		var url = "/general/system/workflow/flow_guide/flow_type/set_print/delete.php?DELETE_STR="+ delete_str + "&FLOW_ID="+flow_id;
	}
	msg = td_lang.general.workflow.msg_107;
	if(window.confirm(msg))
	{
		jQuery.ajax
		({		   
			url: url,
			data: "DELETE_STR="+delete_str,
			type: "POST",
			async: true,
			success: function(data){
				if(data == 1)
				{
					if(typeof(t_id) == "undefined" || t_id == "")
					{
						delete_str.split(",");
						delete_str = delete_str.split(",");
						var nums = [ ];
						for (var i=0 ; i< delete_str.length ; i++)
						{    
							nums.push(parseInt(delete_str[i]));
							jQuery("tr["+model_id+"_id='"+nums[i]+"']").remove();
						}
					}else{
						jQuery("tr["+model_id+"_id='"+t_id+"']").remove();
					}
				}else{
		
				}					
			},
			error: function(data){
				alert(data.responseText);
			}
		});
  	}
}
function flow_design(FLOW_ID)
{
	window.open("flow_type/flow_design/?FLOW_ID="+FLOW_ID,"flow_design","height=600,width=800,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=10,left=10,resizable=yes");
	window.event.cancelBubble = true;
	event.returnValue = false;
}