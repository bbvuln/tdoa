function createStep(){
	// alert(1);
	var navMenuobj = document.getElementById("navMenu");
	var a_obj = navMenuobj.getElementsByTagName('A');
	var menu_arr = {"0":"graph", "1":"f_design"};
	var actionFrom = "";
	if(a_obj){
		var len = a_obj.length;
		for(var i = 0 ; i < len; i++){
			if(a_obj[i].className == "active"){
				actionFrom = "&actionFrom="+menu_arr[i];
			}
		}
	}
	var fixTabName = ( top.jQuery && top.jQuery.fn.getSelected ) ? '&targetTab=' + top.jQuery.fn.getSelected() : '';
	parent.openNewProtal("/general/system/workflow/flow_guide/flow_type/flow_design/view_list/index.php?parent_targetTab=<?=$targetTab?>&FLOW_ID=<?=$FLOW_ID?>&reloadFlag=<?=$reloadFlag?>"+fixTabName+actionFrom, '<?=_("新建流程步骤")?>', 'create-process');
	
	
	//parent.openNewProtal("/general/system/workflow/flow_guide/flow_type/flow_design/view_list/index.php?parent_targetTab=<?=$targetTab?>&FLOW_ID=<?=$FLOW_ID?>&type=1&reloadFlag=<?=$reloadFlag?>", '<?=_("新建流程步骤")?>', 'create-process');
}
function Edit_Process(Process_ID)
{
	var fixTabName = ( top.jQuery && top.jQuery.fn.getSelected ) ? '&targetTab=' + top.jQuery.fn.getSelected() : '';
	var parent_targetTab = (document.getElementById("parent_targetTab") && document.getElementById("parent_targetTab").value) ? '&parent_targetTab='+document.getElementById("parent_targetTab").value : '';
	var reloadFlag = (document.getElementById("reloadFlag") && document.getElementById("reloadFlag").value) ? '&reloadFlag='+document.getElementById("reloadFlag").value : '';
	
	openNewProtal("/general/system/workflow/flow_guide/flow_type/flow_design/view_list/index.php?actionFrom=f_design&FLOW_ID=<?=$FLOW_ID?>&ID="+Process_ID+fixTabName+parent_targetTab+reloadFlag, <?=_("'编辑流程步骤'")?>, 'edit-process_'+Process_ID);
}
	
function delete_item(flow_id,ID)
{
	msg='<?=_("确认要删除该步骤吗？")?>';
	if(window.confirm(msg))
	{
		var fixTabName = ( top.jQuery && top.jQuery.fn.getSelected ) ? '&targetTab=' + top.jQuery.fn.getSelected() : '';
		var parent_targetTab = (document.getElementById("parent_targetTab") && document.getElementById("parent_targetTab").value) ? '&parent_targetTab='+document.getElementById("parent_targetTab").value : '';
		var reloadFlag = (document.getElementById("reloadFlag") && document.getElementById("reloadFlag").value) ? '&reloadFlag='+document.getElementById("reloadFlag").value : '';
		var url="delete.php?actionFrom=f_design&FLOW_ID=<?=$FLOW_ID?>&ID="+ID+fixTabName+parent_targetTab+reloadFlag;
		window.location=url;
	}
}
function clone_item(flow_id,ID)
{
	msg='<?=_("确认要克隆该步骤吗？")?>';
	if(window.confirm(msg))
	{
		URL="clone.php?FLOW_ID="+flow_id+"&ID="+ID;
		window.location=URL;
	}
}
if(typeof parent.set_control.document.readyState=='complete')
{
  parent.set_control.document.getElementById('saveLayout').style.display="none";
}