//jQuery.noConflict(true);//兼容不同版本的jquery
jQuery(document).ready(function()
{
    var trs=jQuery('tr[class="write_alternative_step"]');
    trs.css('cursor','pointer');
	jQuery('#change_right').click(function(){
		var docName=jQuery('#write_next_step_tab').find('[itemtype="FILEUPLOAD"]');
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
		var docName=jQuery('#write_next_step_tab').find('[itemtype="FILEUPLOAD"]');
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
jQuery(document).on("dblclick", "tr[class^='write_alternative_step']", function(){
    var itemId = jQuery(this).attr("itemid");    //获取当前双击的name值
    var new_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_NEW_"+itemId+"']");    //new priv object
    var edit_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_EDIT_"+itemId+"']");    //edit priv object
    var delete_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_DELETE_"+itemId+"']");    //delete priv object
	
    var list_edit_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_1']");    //edit priv object
    var list_add_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_2']");    //add priv object
    var list_delete_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_3']");    //delete priv object
    var list_item_priv = jQuery("div").find("#list_item").find("button[name='LIST_"+itemId+"_4']");    //item priv object

    var new_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_NEW_"+itemId+"']");    //new priv object
    var delete_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_DELETE_"+itemId+"']");    //delete priv object
    var new_ocr_priv = jQuery("div").find("#head6").find("input[id='OCR_PRIV_NEW_"+itemId+"']");    //delete priv object
    var delete_ocr_priv = jQuery("div").find("#head6").find("input[id='OCR_PRIV_DELETE_"+itemId+"']");    //delete priv object

    var parentId=jQuery(this).parent().attr('id');
    if(parentId==undefined){
        parentId=jQuery(this).parent().parent().attr('id');
    }
    if(parentId=='write_alternative_tab')
    {
        jQuery('#write_next_step_tab').append(this);
        if(list_edit_priv.length == 1 && list_add_priv.length == 1 && list_delete_priv.length == 1)
        {
            //加入修改权限
            list_edit_priv.prop("disabled",false);

            //加入添加权限
            list_add_priv.prop("disabled",false);

            //加入删除权限
            list_delete_priv.prop("disabled",false);
			
			//加入字段设置权限
			list_item_priv.prop("disabled",false);
			
        }
        if(new_file_priv.length == 1 && edit_file_priv.length == 1 && delete_file_priv.length == 1)
        {
            //加入新建权限
            new_file_priv.prop("disabled",false);

            //加入编辑权限
            edit_file_priv.prop("disabled",false);

            //加入删除权限
            delete_file_priv.prop("disabled",false);
        }
        if(new_img_priv.length == 1 && delete_img_priv.length == 1)
        {
            //加入新建权限
            new_img_priv.prop("disabled",false);

            //加入删除权限
            delete_img_priv.prop("disabled",false);
        }

        if(new_ocr_priv.length == 1 && delete_ocr_priv.length == 1)
        {
            //加入新建权限
            new_ocr_priv.prop("disabled",false);

            //加入删除权限
            delete_ocr_priv.prop("disabled",false);
        }

    }else if(parentId=='write_next_step_tab')
    {
        jQuery('#write_alternative_tab').append(this);
        if(list_edit_priv.length == 1 && list_add_priv.length == 1 && list_delete_priv.length == 1)
        {
            //取消修改权限
            list_edit_priv.prop("checked",false);
            list_edit_priv.prop("disabled",true);

            //取消添加权限
            list_add_priv.prop("checked",false);
            list_add_priv.prop("disabled",true);

            //取消删除权限
            list_delete_priv.prop("checked",false);
            list_delete_priv.prop("disabled",true);
			
			//取消字段设置权限
			list_item_priv.prop("disabled",true);
        }
        if(new_file_priv.length == 1 && edit_file_priv.length == 1 && delete_file_priv.length == 1)
        {
            //取消新建权限
            new_file_priv.prop("checked",false);
            new_file_priv.prop("disabled",true);

            //取消编辑权限
            edit_file_priv.prop("checked",false);
            edit_file_priv.prop("disabled",true);

            //取消删除权限
            delete_file_priv.prop("checked",false);
            delete_file_priv.prop("disabled",true);
        }
        if(new_img_priv.length == 1 && delete_img_priv.length == 1)
        {
            //取消新建权限
            new_img_priv.prop("checked",false);
            new_img_priv.prop("disabled",true);

            //取消删除权限
            delete_img_priv.prop("checked",false);
            delete_img_priv.prop("disabled",true);
        }

        if(new_ocr_priv.length == 1 && delete_ocr_priv.length == 1)
        {
            //加入新建权限
            new_ocr_priv.prop("checked",false);
            new_ocr_priv.prop("disabled",true);

            //加入删除权限
            delete_ocr_priv.prop("checked",false);
            delete_ocr_priv.prop("disabled",true);
        }

    }
});
jQuery(document).on("dblclick","tr[class^='macro_alternative_step']", function(){
	var parentId=jQuery(this).parent().attr('id');
	if(typeof(parentId)=='undefined'){
        parentId=jQuery(this).parent().parent().attr('id');
    }
	if(parentId=='macro_alternative_tab')
	{
		jQuery('#macro_next_step_tab').append(this);
	}else if(parentId == 'macro_next_step_tab')
	{
		jQuery('#macro_alternative_tab').append(this);
	}
});
//--------全选与取消全选-------------
function selectWriteAll(type,is_jquery_ui)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    if(type=='left'){
        var objTrLength=jQuery('#write_next_step_tab').find('tr').length;
        var objSelectLength=jQuery('#write_next_step_tab').find('.'+selected_class).length;
        var obj=jQuery('#write_next_step_tab').find('tr');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#write_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#write_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#write_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#write_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }else if(type=='right'){
        objTrLength=jQuery('#write_alternative_tab').find('.write_alternative_step').length;
        objSelectLength=jQuery('#write_alternative_tab').find('.'+selected_class).length;
        obj=jQuery('#write_alternative_tab').find('.write_alternative_step');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#write_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#write_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#write_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#write_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }
}
function selectMacroAll(type,is_jquery_ui)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    if(type=='left'){
        var objTrLength=jQuery('#macro_next_step_tab').find('tr').length;
        var objSelectLength=jQuery('#macro_next_step_tab').find('.'+selected_class).length;
        var obj=jQuery('#macro_next_step_tab').find('tr');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#macro_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#macro_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#macro_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#macro_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }else if(type=='right'){
        objTrLength=jQuery('#macro_alternative_tab').find('.macro_alternative_step').length;
        objSelectLength=jQuery('#macro_alternative_tab').find('.'+selected_class).length;
        obj=jQuery('#macro_alternative_tab').find('.macro_alternative_step');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#macro_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#macro_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#macro_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#macro_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }
}
//--------全选与取消全选结束-------------------------------------
//自定义插件的处理----
function selectPlug(tabId,tabIdOther,btnId,is_jquery_ui,flag)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    var s_tabIdOther = tabIdOther;
    var select=jQuery('.'+selected_class).length;
    if(select==0){
        return false;
    }else{
        var parentTrLength=jQuery('#'+tabId).find('tr').length;
        var parentTr=jQuery('#'+tabId).find('tr');
        if(parentTr.hasClass(selected_class)){
            for(var i=0;i<parentTrLength;i++){
                if(parentTr.eq(i).hasClass(selected_class)==true){
                    var selectedTr=parentTr.eq(i);
                    var itemId = selectedTr.attr("itemid");
                    var list_edit_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_1']");    //edit priv object
                    var list_add_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_2']");    //add priv object
                    var list_delete_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_3']");    //delete priv object
					var list_item_priv = jQuery("div").find("#list_item").find("button[name='LIST_"+itemId+"_4']");    //item priv object
					
					var content_priv = jQuery("div").find("#countersign_item").find("input[id='COUNTER_"+itemId+"_1']");    //内容输入
                    var sign_priv = jQuery("div").find("#countersign_item").find("input[id='COUNTER_"+itemId+"_2']");    //手写盖章
                    var op_user_priv = jQuery("div").find("#countersign_item").find("input[id='OP_USER_"+itemId+"_3']");    //主办人强制必填
					var user_priv = jQuery("div").find("#countersign_item").find("input[id='USER_"+itemId+"_4']");    //经办人强制必填
					
                    var new_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_NEW_"+itemId+"']");    //new priv object
                    var edit_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_EDIT_"+itemId+"']");    //edit priv object
                    var delete_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_DELETE_"+itemId+"']");    //delete priv object

                    var new_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_NEW_"+itemId+"']");    //new priv object
                    var delete_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_DELETE_"+itemId+"']");    //delete priv object

                    var new_ocr_priv = jQuery("div").find("#head6").find("input[id='OCR_PRIV_NEW_"+itemId+"']");    //new priv object
                    var delete_ocr_priv = jQuery("div").find("#head6").find("input[id='OCR_PRIV_DELETE_"+itemId+"']");    //delete priv object


                    if(s_tabIdOther == 'write_alternative_tab')
                    {
                        if(list_edit_priv.length == 1 && list_add_priv.length == 1 && list_delete_priv.length == 1)
                        {
                            //取消修改权限
                            list_edit_priv.prop("checked",false);
                            list_edit_priv.prop("disabled",true);

                            //取消添加权限
                            list_add_priv.prop("checked",false);
                            list_add_priv.prop("disabled",true);

                            //取消删除权限
                            list_delete_priv.prop("checked",false);
                            list_delete_priv.prop("disabled",true);
							
							//取消字段设置权限
							list_item_priv.prop("disabled",true);
                        }
                        if(new_file_priv.length == 1 && edit_file_priv.length == 1 && delete_file_priv.length == 1)
                        {
                            //取消新建权限
                            new_file_priv.prop("checked",false);
                            new_file_priv.prop("disabled",true);

                            //取消编辑权限
                            edit_file_priv.prop("checked",false);
                            edit_file_priv.prop("disabled",true);

                            //取消删除权限
                            delete_file_priv.prop("checked",false);
                            delete_file_priv.prop("disabled",true);
                        }
                        if(new_img_priv.length == 1 && delete_img_priv.length == 1)
                        {
                            //取消新建权限
                            new_img_priv.prop("checked",false);
                            new_img_priv.prop("disabled",true);

                            //取消删除权限
                            delete_img_priv.prop("checked",false);
                            delete_img_priv.prop("disabled",true);
                        }

                        if(new_ocr_priv.length == 1 && delete_ocr_priv.length == 1)
                        {
                            //加入新建权限
                            new_ocr_priv.prop("checked",false);
                            new_ocr_priv.prop("disabled",true);

                            //加入删除权限
                            delete_ocr_priv.prop("checked",false);
                            delete_ocr_priv.prop("disabled",true);
                        }
                    }else if(s_tabIdOther == 'r_alternative_tab')//必填
					{
						if(content_priv.length == 1 && sign_priv.length == 1 && op_user_priv.length == 1)
                        {
                            content_priv.prop("checked",false);
                            content_priv.prop("disabled",true);

                            sign_priv.prop("checked",false);
                            sign_priv.prop("disabled",true);

                            op_user_priv.prop("checked",false);
                            op_user_priv.prop("disabled",true);
							
							user_priv.prop("checked",false);
							user_priv.prop("disabled",true);
                        }
					}else if(s_tabIdOther == 'r_next_step_tab')
					{
						if(content_priv.length == 1 && sign_priv.length == 1 && op_user_priv.length == 1)
                        {
                            content_priv.prop("disabled",false);

                            sign_priv.prop("disabled",false);

                            op_user_priv.prop("disabled",false);
							
							user_priv.prop("disabled",false);
                        }
					}
                    else if(s_tabIdOther == 'write_next_step_tab')
                    {
                        if(list_edit_priv.length == 1 && list_add_priv.length == 1 && list_delete_priv.length == 1)
                        {
                            //加入修改权限
                            list_edit_priv.prop("disabled",false);

                            //加入添加权限
                            list_add_priv.prop("disabled",false);

                            //加入删除权限
                            list_delete_priv.prop("disabled",false);
							
							//加入字段设置权限
							list_item_priv.prop("disabled",false);
                        }
                        if(new_file_priv.length == 1 && edit_file_priv.length == 1 && delete_file_priv.length == 1)
                        {
                            //加入新建权限
                            new_file_priv.prop("disabled",false);

                            //加入编辑权限
                            edit_file_priv.prop("disabled",false);

                            //加入删除权限
                            delete_file_priv.prop("disabled",false);
                        }
                        if(new_img_priv.length == 1 && delete_img_priv.length == 1)
                        {
                            //加入新建权限
                            new_img_priv.prop("disabled",false);

                            //加入删除权限
                            delete_img_priv.prop("disabled",false);
                        }

                        if(new_ocr_priv.length == 1 && delete_ocr_priv.length == 1)
                        {
                            //加入新建权限
                            new_ocr_priv.prop("disabled",false);

                            //加入删除权限
                            delete_ocr_priv.prop("disabled",false);
                        }


                    }
                    var cloneTr=parentTr.eq(i).removeClass(selected_class);
                    if(cloneTr.length>0){
                        var obj=jQuery('#'+tabIdOther).find('tbody');
                        if(obj.length==0){
                            jQuery('#'+tabIdOther).append(cloneTr);
                        }else{
                            jQuery('#'+tabIdOther).find('tbody').append(cloneTr);
                        }
                        if(jQuery('#'+btnId).length!==0){
                            jQuery('#'+btnId).text(td_lang.system.workflow.msg_17);
                        }
                    }
                }
            }
        }else{
            return false;
        }
    }
	
	if(flag =="is_limit")
	{
		alternativelimit_array_from_next();
	}
		
}