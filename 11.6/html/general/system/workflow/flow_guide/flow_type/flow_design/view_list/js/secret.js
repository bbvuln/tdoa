jQuery(document).ready(function()
{
	var FLOW_ID = jQuery('#flow_id').val();//流程的id
	var id=jQuery('#ID').val();//id
});
jQuery(document).on("dblclick", "tr[class^='h_alternative_step']", function(){
    var parentId=jQuery(this).parent().attr('id');
    if(parentId==undefined){
        parentId=jQuery(this).parent().parent().attr('id');
    }
    if(parentId=='h_alternative_tab')
    {
        jQuery('#h_next_step_tab').append(this);

    }else if(parentId=='h_next_step_tab')
    {
        jQuery('#h_alternative_tab').append(this);
    }
});
function selectHiddenAll(type,is_jquery_ui)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    if(type=='left'){
        var objTrLength=jQuery('#h_next_step_tab').find('tr').length;
        var objSelectLength=jQuery('#h_next_step_tab').find('.'+selected_class).length;
        var obj=jQuery('#h_next_step_tab').find('tr');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#left_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#left_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }else if(type=='right'){
        objTrLength=jQuery('#h_alternative_tab').find('.h_alternative_step').length;
        objSelectLength=jQuery('#h_alternative_tab').find('.'+selected_class).length;
        obj=jQuery('#h_alternative_tab').find('.h_alternative_step');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#right_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#right_btn').text(td_lang.system.workflow.msg_17);
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