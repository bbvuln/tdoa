jQuery(document).ready(function()
{
	var FLOW_ID = jQuery('#flow_id').val();//���̵�id
	var id=jQuery('#ID').val();//id
});
jQuery(document).on("dblclick", "tr[class^='r_alternative_step']", function(){
    var parentId=jQuery(this).parent().attr('id');
    if(parentId==undefined){
        parentId=jQuery(this).parent().parent().attr('id');
    }
	var uid_ = $(this).find('td').attr('uid');
	var countersign_1 = $('#countersign_item').find('input[id="COUNTER_'+uid_+'_1"]');//��ǩ������
	var countersign_2 = $('#countersign_item').find('input[id="COUNTER_'+uid_+'_2"]');//��ǩ����
	var countersign_3 = $('#countersign_item').find('input[id="OP_USER_'+uid_+'_3"]');//�������
	var countersign_4 = $('#countersign_item').find('input[id="USER_'+uid_+'_4"]');//�������
    if(parentId=='r_alternative_tab')
    {
        jQuery('#r_next_step_tab').append(this);
		if(countersign_1.length == 1 && countersign_2.length == 1  && countersign_3.length == 1 && countersign_4.length == 1)
		{
			countersign_1.prop("disabled",false);
			countersign_2.prop("disabled",false);
			countersign_3.prop("disabled",false);
			countersign_4.prop("disabled",false);
		}
    }else if(parentId=='r_next_step_tab')
    {
        jQuery('#r_alternative_tab').append(this);
		if(countersign_1.length == 1 && countersign_2.length == 1 && countersign_3.length == 1 && countersign_4.length == 1)
		{
			countersign_1.prop("checked",false);
            countersign_1.prop("disabled",true);
			
			countersign_2.prop("checked",false);
            countersign_2.prop("disabled",true);
			
			countersign_3.prop("checked",false);
            countersign_3.prop("disabled",true);
			
			countersign_4.prop("checked",false);
            countersign_4.prop("disabled",true);
		}
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
//------���ڼ���ҳ��� php���� ����
function loadTableList(id,type)
{
	var FLOW_ID = jQuery('#flow_id').val();//���̵�id
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
//ҳ�治����Ĳ���
function check_flow_type()
{
	var td=jQuery('#next_step_tab').find('td');
	if(typeof(td)!==undefined)
	{
		var tdLength=td.length;
		var LIST_FLDS_STR= new Array();//�б���չ�ֶδ���ѯҳ�����ѯ������ʱ��Ч
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(td[i]).text();
			LIST_FLDS_STR.push(option);
		}
		LIST_FLDS_STR=LIST_FLDS_STR.join(',')+',';
		jQuery('#LIST_FLDS_STR').val(LIST_FLDS_STR);//������ֵ�ύ
	 }	
	jQuery('#form1').submit();
}
//�رյĲ���
function close_flow()
{
		window.close();
}