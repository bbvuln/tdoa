jQuery(document).ready(function()
{
	var FLOW_ID = jQuery('#flow_id').val();//���̵�id
	var id=jQuery('#ID').val();//id
})
//------���ڼ���ҳ��� php���� ����
function loadTableList(id,type)
{
	var FLOW_ID = jQuery('#flow_id').val();//���̵�id
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