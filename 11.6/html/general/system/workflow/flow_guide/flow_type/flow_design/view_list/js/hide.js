jQuery(document).ready(function()
{
	var FLOW_ID = jQuery('#flow_id').val();//流程的id
	var id=jQuery('#ID').val();//id
});
jQuery(document).on("dblclick", "tr[class^='r_alternative_step']", function(){
    var parentId=jQuery(this).parent().attr('id');
    if(parentId==undefined){
        parentId=jQuery(this).parent().parent().attr('id');
    }
    if(parentId=='r_alternative_tab')
    {
        jQuery('#r_next_step_tab').append(this);

    }else if(parentId=='r_next_step_tab')
    {
        jQuery('#r_alternative_tab').append(this);
    }
});
function selectRequiredAll(type,is_jquery_ui)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    if(type=='left'){
        var objTrLength=jQuery('#r_next_step_tab').find('tr').length;
        var objSelectLength=jQuery('#r_next_step_tab').find('.'+selected_class).length;
        var obj=jQuery('#r_next_step_tab').find('tr');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#r_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#r_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#r_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#r_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }else if(type=='right'){
        objTrLength=jQuery('#r_alternative_tab').find('.r_alternative_step').length;
        objSelectLength=jQuery('#r_alternative_tab').find('.'+selected_class).length;
        obj=jQuery('#r_alternative_tab').find('.r_alternative_step');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#r_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#r_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#r_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#r_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }
}
//------关于加载页面的 php处理 方法
function loadTableList(id,type)
{
	var FLOW_ID = jQuery('#flow_id').val();//流程的id
	var id_type=jQuery('#prc_id').val();//id
	if(type=='left')
	 {
		 
		jQuery('#'+id).find('tbody').load('hide/leftTable.php?FLOW_ID='+FLOW_ID+'&id='+id_type,function(){}); 
	 }
	 if(type=='right')
	 {
		 jQuery('#'+id).find('tbody').load('hide/rightTable.php?FLOW_ID='+FLOW_ID+'&id='+id_type,function(){}); 
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
//关闭的操作
function close_flow()
{
		window.close();
}