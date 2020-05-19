jQuery(document).ready(function(){
	jQuery("#run_name").width("110px");
	jQuery(".button-operation").find("button").bind("click", function(){
		var funName = "work_run_"+jQuery(this).attr("action");
		if(typeof window.parent[funName] === "function"){
			window.parent[funName](funName);
		}
	});
});
//JS延迟算宽高
function setTimeoutgetGridTableSize()
{	
	var sizeArr = getGridTableSize();
	if(jQuery("#gridTable").getGridParam("records") == 0)
	{
		jQuery("#gridTable").jqGrid('setGridHeight',0);
		jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
	}else{
		jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
		jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
	}
}

function getGridTableSize(){
	var size = {};
	size.vHeight = jQuery(window).height()-jQuery(window.parent.document).find('#myTab').outerHeight(true)-jQuery('#search_normal_div').outerHeight(true)-jQuery('.data-operation').outerHeight(true) - 10; 
	size.vWidth = jQuery("body").width()-20;
	return size;
}

jQuery('.btn-group').find("input[type='hidden']:first").each(function(i, v){
	if(jQuery(v).val() != "all"){
		var parentSpan = jQuery(this).parent().find('span[data_value="'+jQuery(v).val()+'"]');
		jQuery(this).parent().find("button:first").find('span:first').appendTo(jQuery(parentSpan).parent());
		jQuery(parentSpan).appendTo(jQuery(this).parent().find("button:first"));
	}
});
function handle_work(menu_flag, run_id, prcs_key_id, flow_id, prcs_id, flow_prcs){ //办理工作
	var url = "/general/workflow/list/input_form/?actionType=handle";
	url += "&MENU_FLAG="+menu_flag;
	url += "&RUN_ID="+run_id;
	url += "&PRCS_KEY_ID="+prcs_key_id;
	url += "&FLOW_ID="+flow_id;
	url += "&PRCS_ID="+prcs_id;
	url += "&FLOW_PRCS="+flow_prcs;
	jQuery(window.parent.document).find("div.work-nav").hide();
	jQuery(window.parent.document).find('#workflow-form-frame').css('display', 'block');
	jQuery(window.parent.document).find('#workflow-form-frame').attr("src", url);
	
}
function flow_view(run_id, flow_id){
	var myleft=(jQuery(document).width()-1218)/2;
	var url = "/general/approve_center/list/flow_view/?";
	url += "RUN_ID="+run_id;
	url += "&FLOW_ID="+flow_id;
	var configStr = "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=1200,height=600,left="+myleft+",top=30";
	window.open(url, run_id, configStr);
}
//查看工作
function view_work(menu_flag, run_id, prcs_key_id, flow_id, prcs_id, flow_prcs){
	//var url = "/general/workflow/list/input_form/?actionType=view";
	var url = "/general/approve_center/list/print/?";
	url += "RUN_ID="+run_id;
	url += "&MENU_FLAG="+menu_flag;
	url += "&PRCS_KEY_ID="+prcs_key_id;
	url += "&FLOW_ID="+flow_id;
	if(prcs_id)
	{
		url += "&PRCS_ID="+prcs_id;
	}
	if(flow_prcs)
	{
		url += "&FLOW_PRCS="+flow_prcs;
	}
	var tmp_height = jQuery(window.parent.parent) ? jQuery(window.parent.parent.document).height() : jQuery(document).height()
	var configStr = "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width="+(jQuery(document).width()-20)+",height="+tmp_height+",left=-4,top=0";
	window.open(url, "view_work_"+run_id, configStr);
}
function withdraw_work(RUN_ID,flow_id, begin_dept){ //收回工作
	var msg=td_lang.general.workflow.msg_204;//"确认要将此工作收回吗？"
    if(window.confirm(msg))
    {
        var url="/module/workflow/engine/restore_work.php?RUN_ID="+RUN_ID+"&FLOW_ID="+flow_id+"&BEGIN_DEPT="+begin_dept;
        jQuery.get(url,{},function(data){
            jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
        });
    }
}

function user_view(USER_ID)
{
    var mytop=(jQuery(document).height()-500)/2-30;
    var myleft=(jQuery(document).width()-780)/2;
    window.open("/general/ipanel/user/user_info.php?WINDOW=1&USER_ID="+USER_ID,"user_view","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=780,height=500,left="+myleft+",top="+mytop+"\"");
}
//照熙2013年10月11日21:06:23查看流程设计图
function view_graph(FLOW_ID)
{
    var myleft=(screen.availWidth-800)/2;
    window.open("/general/approve_center/flow_view.php?FLOW_ID="+FLOW_ID,"","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=500,left="+myleft+",top=50");
}
//收回
function call_back(RUN_ID,PRCS_ID,FLOW_PRCS)
{
    var msg=td_lang.general.workflow.msg_11;//"下一步骤尚未接收时可收回至本步骤重新办理，确认要收回吗？"
    if(window.confirm(msg))
    {
        var url="/general/workflow/list/call_back.php?RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS;
        jQuery.get(url,{},function(data){
            if(data==1)
        	    alert(td_lang.general.workflow.msg_12);//您没有权限！
        	else if(data==2)
        	    alert(td_lang.general.workflow.msg_13);//对方已接收，不能收回
            else
            {
        	    alert(td_lang.general.workflow.msg_14);//工作已回收
        	    //window.refreshGrid();
        	    jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
            }
        });
    }
}
//工作催办
function reminders(run_id,flow_id,run_name,n,prcs_id,prcs_flag,type)
{
	if(!jQuery(".mobile-check").hasClass("mobile-bg-static"))
	{
		jQuery(".mobile-check").addClass("mobile-bg-static");
	}
	jQuery('#reminder_run_id').val(run_id);
	jQuery('#reminder_flow_id').val(flow_id);
	jQuery('#reminder_run_name').val(run_name);
	jQuery('#reminder_prcs_id').val(prcs_id);
	jQuery('#reminder_prcs_flag').val(prcs_flag);
	jQuery('#reminder_type').val(type);
	console.log(n);
	n != '1' ? jQuery('#reminder_content').val("催办事务提醒：请您尽快办理此工作") : jQuery('#reminder_content').val(sprintf(td_lang.general.workflow.msg_292, run_id, run_name));
	open_bootcss_modal('reminderModal', '500');
}

//一键催办
function onekey_reminders(mark)
{
    var rowData = jQuery('#gridTable').jqGrid('getGridParam','selarrrow');
    if(rowData.length)
    {
        var key_prcs_id = "";
        var run_id = "";
        var flow_id = "";
        for(var i=0;i<rowData.length;i++)
        {
            var OPERATION_S = jQuery('#gridTable').jqGrid('getCell',rowData[i],'OPERATION');
            var OPERATION_STR = OPERATION_S.substring(OPERATION_S.indexOf('('),OPERATION_S.indexOf(')'));
            var operation_str = OPERATION_STR.split(",");
			if(typeof(mark) != 'undefined' && mark=='query')
			{
				if(OPERATION_S.indexOf("催办") == -1)//过滤无催办权限
					continue;
				run_id += operation_str[0].replace(/[^0-9]/ig,"")+",";
				flow_id += operation_str[1].replace(/[^0-9]/ig,"")+",";
			}else
			{
				run_id += operation_str[0].replace(/[^0-9]/ig,"")+",";
				key_prcs_id +=operation_str[1].replace(/[^0-9]/ig,"")+",";
				flow_id += operation_str[2].replace(/[^0-9]/ig,"")+",";
			}
        }
        reminders(run_id,flow_id,"","",key_prcs_id,1);
    }else
    {
        alert("请至少选择一条记录");
    }
}

//催办
function reminders_do(type)
{
	var run_id = jQuery('#reminder_run_id').val();
	var flow_id = jQuery('#reminder_flow_id').val();
	var content = jQuery('#reminder_content').val();
	var prcs_id = jQuery('#reminder_prcs_id').val();
	var prcs_flag = jQuery('#reminder_prcs_flag').val();
	if(typeof(type) =='undefined' || type == "")
		var type = jQuery('#reminder_type').val();
	var mobile_check_obj = jQuery(".mobile-check");
	var mobile_check = mobile_check_obj.hasClass('mobile-bg-static')?'':'checked';
	if(jQuery.trim(content) == ''){
		alert(td_lang.general.workflow.msg_291);
		return;
	}
	jQuery.get("/module/approve_center/engine/flow_reminders.php",{"RUN_ID":run_id,"FLOW_ID":flow_id,"PRCS_ID":prcs_id,"CONTENT":content,"mobile_check":mobile_check,"prcs_flag":prcs_flag,"type":type},function(data)
	{
		jQuery('#reminderModal').modal('hide');
		alert(td_lang.general.workflow.msg_246);
	});
}
//工作删除
function delete_run(RUN_ID,FLOW_ID,BEGIN_DEPT)
{
    var msg=td_lang.general.workflow.msg_6;//"确认要删除所选工作吗？"
    if(window.confirm(msg))
    {
        jQuery.get("/module/workflow/engine/delete_work.php",{"RUN_ID_STR":RUN_ID,"FLOW_ID":FLOW_ID,"BEGIN_DEPT":BEGIN_DEPT},function(data)
        {
            	jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
        });
    }
}