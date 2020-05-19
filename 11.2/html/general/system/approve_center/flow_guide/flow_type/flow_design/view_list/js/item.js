jQuery(document).ready(function()
{
	var FLOW_ID = jQuery('#flow_id').val();//���̵�id
	var id=jQuery('#ID').val();//id
	jQuery('#change_right').click(function(){
		var docName=jQuery('#next_step_tab').find('[itemtype="FILEUPLOAD"]');
		if(docName.length==0){
			var checkboxObj=jQuery('#active_item').find('input');
			checkboxObj.each(function(){
				var val=jQuery(this).val();
				if(val=='1'||val=='2'||val=='3')
				{
					jQuery(this).attr('disabled',true);
				}
			});
		}	
	});
	jQuery('#change_left').click(function(){
		var docName=jQuery('#next_step_tab').find('[itemtype="FILEUPLOAD"]');
		if(docName.length==1){
			var checkboxObj=jQuery('#active_item').find('input');
			checkboxObj.each(function(){
				var val=jQuery(this).val();
				if(val=='1'||val=='2'||val=='3')
				{
					jQuery(this).attr('disabled',false);
				}
			});
		}	
	});
});
//------���ڼ���ҳ��� php���� ����
function loadTableList(id,type)
{
	var FLOW_ID = jQuery('#flow_id').val();//���̵�id
	var id_type=jQuery('#prc_id').val();//id
	if(type=='left')
	 {
		 
		jQuery('#'+id).find('tbody').load('item/leftTable.php?FLOW_ID='+FLOW_ID+'&id='+id_type,function(){}); 
	 }
	 if(type=='right')
	 {
		 jQuery('#'+id).find('tbody').load('item/rightTable.php?FLOW_ID='+FLOW_ID+'&id='+id_type,function(){}); 
	 }
}

//ҳ�汣����֤�Ĳ���
function check_flow_type()
{
	
	//--------------- ������ͼƬ�ؼ����б�ؼ���������Ĵ���   ----------
	
	var docControls=jQuery('[itemtype="FILEUPLOAD"]');
	var docControlsArr=new Array();
	var length=docControls.length;
	for (i = 0; i < length; i++)
	{
		option = jQuery(docControls[i]).attr('itemid');
		docControlsArr.push(option);
	}
	docControlsArr=docControlsArr.join(',')+',';//�����ؼ������������
	jQuery('#docControls').val(docControlsArr);//������ֵ�ύ
    var imgControls=jQuery('[itemtype="IMGUPLOAD"]');
    var imgControlsArr=new Array();
    var length=imgControls.length;
    for (i = 0; i < length; i++)
    {
        option = jQuery(imgControls[i]).attr('itemid');
        imgControlsArr.push(option);
    }
    imgControlsArr=imgControlsArr.join(',')+',';//ͼƬ�ϴ��ؼ������������
    jQuery('#imgControls').val(imgControlsArr);//������ֵ�ύ
	//OCR�ؼ����ύ
    var ocrControls=jQuery('[itemtype="OCR"]');
    var ocrControlsArr=new Array();
    var length=ocrControls.length;
    for (i = 0; i < length; i++)
    {
        option = jQuery(ocrControls[i]).attr('itemid');
        ocrControlsArr.push(option);
    }
    ocrControlsArr=ocrControlsArr.join(',')+',';//ͼƬ�ϴ��ؼ������������
    jQuery('#ocrControls').val(ocrControlsArr);//������ֵ�ύ
	var listControls=jQuery('[itemtype="LIST_VIEW"]');
	var listControlsArr=new Array();
	var listLength=listControls.length;
	for (i = 0; i < listLength; i++)
	{
		option = jQuery(listControls[i]).attr('itemid');
		
		listControlsArr.push(option);
	}
	listControlsArr=listControlsArr.join(',')+',';//�б�ؼ������������
	jQuery('#listControls').val(listControlsArr);//������ֵ�ύ
	
	//------------------������ͼƬ�ؼ����б�ؼ���������Ĵ������---------------------------------
	
	var td=jQuery('#next_step_tab').find('td');
	if(typeof(td)!==undefined)
	{
		var tdLength=td.length;
		var LIST_FLDS_STR= new Array();//�б���չ�ֶδ���ѯҳ�����ѯ������ʱ��Ч
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(td[i]).text();
			if(option==flow_doc)
			{
				option='[A@]';
			}else if(option==work_name){
				option='[B@]';
			}
				
			LIST_FLDS_STR.push(option);
		}
		LIST_FLDS_STR=LIST_FLDS_STR.join(',')+',';
		
		
		jQuery('#LIST_FLDS_STR').val(LIST_FLDS_STR);//������ֵ�ύ
	 }
	//�б�ؼ� ÿһ�е�������������ֵ�ύ
    jQuery('input[list_column_id][mode_type=readOnly]').each(function(index,element){
        var list_column_id = jQuery(element).attr('list_column_id');
        var hidden_obj = jQuery('input[list_column_id='+list_column_id+'][mode_type=hidden]');
        var readOnly = 0;
        var hidden = 0;
        if(element.checked)
        {
            readOnly = element.value;
        }
        else if(element.type == 'hidden')
        {
            readOnly = element.value;
        }
        if(hidden_obj[0].checked)
        {
            hidden = hidden_obj[0].value;
        }

        jQuery('#'+list_column_id).val(readOnly | hidden);
    });

	jQuery('#form2').submit();
}
//�رյĲ���
function close_flow()
{
		window.close();
}