jQuery(document).ready(function()
{
	var FLOW_ID = jQuery('#flow_id').val();//流程的id
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
//------关于加载页面的 php处理 方法
function loadTableList(id,type)
{
	var FLOW_ID = jQuery('#flow_id').val();//流程的id
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

//页面保存验证的操作
function check_flow_type()
{
	
	//--------------- 附件、图片控件和列表控件的隐藏域的处理   ----------
	
	var docControls=jQuery('[itemtype="FILEUPLOAD"]');
	var docControlsArr=new Array();
	var length=docControls.length;
	for (i = 0; i < length; i++)
	{
		option = jQuery(docControls[i]).attr('itemid');
		docControlsArr.push(option);
	}
	docControlsArr=docControlsArr.join(',')+',';//附件控件的隐藏域结束
	jQuery('#docControls').val(docControlsArr);//隐藏域赋值提交
    var imgControls=jQuery('[itemtype="IMGUPLOAD"]');
    var imgControlsArr=new Array();
    var length=imgControls.length;
    for (i = 0; i < length; i++)
    {
        option = jQuery(imgControls[i]).attr('itemid');
        imgControlsArr.push(option);
    }
    imgControlsArr=imgControlsArr.join(',')+',';//图片上传控件的隐藏域结束
    jQuery('#imgControls').val(imgControlsArr);//隐藏域赋值提交
	//OCR控件的提交
    var ocrControls=jQuery('[itemtype="OCR"]');
    var ocrControlsArr=new Array();
    var length=ocrControls.length;
    for (i = 0; i < length; i++)
    {
        option = jQuery(ocrControls[i]).attr('itemid');
        ocrControlsArr.push(option);
    }
    ocrControlsArr=ocrControlsArr.join(',')+',';//图片上传控件的隐藏域结束
    jQuery('#ocrControls').val(ocrControlsArr);//隐藏域赋值提交
	var listControls=jQuery('[itemtype="LIST_VIEW"]');
	var listControlsArr=new Array();
	var listLength=listControls.length;
	for (i = 0; i < listLength; i++)
	{
		option = jQuery(listControls[i]).attr('itemid');
		
		listControlsArr.push(option);
	}
	listControlsArr=listControlsArr.join(',')+',';//列表控件的隐藏域结束
	jQuery('#listControls').val(listControlsArr);//隐藏域赋值提交
	
	//------------------附件、图片控件和列表控件的隐藏域的处理结束---------------------------------
	
	var td=jQuery('#next_step_tab').find('td');
	if(typeof(td)!==undefined)
	{
		var tdLength=td.length;
		var LIST_FLDS_STR= new Array();//列表扩展字段串查询页面仅查询该流程时生效
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
		
		
		jQuery('#LIST_FLDS_STR').val(LIST_FLDS_STR);//隐藏域赋值提交
	 }
	//列表控件 每一列单独设置隐藏域赋值提交
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
//关闭的操作
function close_flow()
{
		window.close();
}