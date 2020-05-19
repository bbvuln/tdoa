jQuery(document).ready(function()
{
	var FLOW_ID = jQuery('#flow_id').val();//流程的id
	var id=jQuery('#ID').val();//id
})
//------关于加载页面的 php处理 方法
function loadTableList(id,type)
{
	var FLOW_ID = jQuery('#flow_id').val();//流程的id
	var id_type=jQuery('#prc_id').val();//id
	if(type=='left')
	 {
		 
		jQuery('#'+id).find('tbody').load('auto/leftTable.php?FLOW_ID='+FLOW_ID+'&id='+id_type,function(){}); 
	 }
	 if(type=='right')
	 {
		 jQuery('#'+id).find('tbody').load('auto/rightTable.php?FLOW_ID='+FLOW_ID+'&id='+id_type,function(){}); 
	 }
}
//页面不保存的操作
function check_flow_type()
{
	var td=jQuery('#next_step_tab').find('td');
	if(typeof(td)!==undefined)
	{
		var tdLength=td.length;
		var LIST_FLDS_STR= new Array();//列表扩展字段串查询页面仅查询该流程时生效
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(td[i]).text();
			LIST_FLDS_STR.push(option);
		}
		LIST_FLDS_STR=LIST_FLDS_STR.join(',')+',';
		jQuery('#LIST_FLDS_STR').val(LIST_FLDS_STR);//隐藏域赋值提交
	 }	
	jQuery('#form1').submit();
}