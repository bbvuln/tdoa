//jQuery.noConflict(true);//兼容不同版本的jquery
jQuery(document).ready(function()
{
    var trs=jQuery('tr[class="alternative_step"]');
    trs.css('cursor','pointer');
})
jQuery(document).on("dblclick", "tr[class^='alternative_step']", function(){
    var itemId = jQuery(this).attr("itemid");    //获取当前双击的name值
    var sortId = jQuery(this).attr("sortId");
    var new_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_NEW_"+itemId+"']");    //new priv object
    var edit_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_EDIT_"+itemId+"']");    //edit priv object
    var delete_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_DELETE_"+itemId+"']");    //delete priv object

    var list_edit_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+sortId+"_1']");    //edit priv object
    var list_add_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+sortId+"_2']");    //add priv object
    var list_delete_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+sortId+"_3']");    //delete priv object

    var new_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_NEW_"+itemId+"']");    //new priv object
    var delete_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_DELETE_"+itemId+"']");    //delete priv object

    var parentId=jQuery(this).parent().attr('id');
    if(parentId==undefined){
        parentId=jQuery(this).parent().parent().attr('id');
    }
    if(parentId=='alternative_tab')
    {
        jQuery('#next_step_tab').append(this);
        if(list_edit_priv.length == 1 && list_add_priv.length == 1 && list_delete_priv.length == 1)
        {
            //加入修改权限
            list_edit_priv.prop("disabled",false);

            //加入添加权限
            list_add_priv.prop("disabled",false);

            //加入删除权限
            list_delete_priv.prop("disabled",false);
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

    }else if(parentId=='next_step_tab')
    {
        jQuery('#alternative_tab').append(this);
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

    }else if(parentId=='alternative_tr')
    {
        jQuery('#next_step_tab').append(this);
    }else if(parentId=='alternative_next')
    {
        jQuery('#alternative_tab').append(this);
    }else if(parentId=='alternative_tab_limit')
	{
		jQuery('#next_step_tab_limit').append(this);
	}else if(parentId=='alternative_tr_limit')
    {
        jQuery('#next_step_tab_limit').append(this);
		   var obj=jQuery('#next_step_tab_limit').find('tr');
	       obj.removeClass('ui-selected');
		
    }else if(parentId=='alternative_next_limit')
    {
        jQuery('#alternative_tab_limit').append(this);
		  var obj=jQuery('#alternative_tab_limit').find('.alternative_step');
	      obj.removeClass('ui-selected');
    }else if(parentId=='next_step_tab_limit')
	{
		  jQuery('#alternative_tab_limit').append(this);
		
	}
	if(parentId!="alternative_next_limit" && parentId!="alternative_tr_limit")
	{
		alternativelimit_array_from_next();
	}
	

});
jQuery(document).on("dblclick", "tr[class='intelligent_alternative_step']", function(){
    var parentId=jQuery(this).parent().attr('id');
    if(parentId==undefined){
        parentId=jQuery(this).parent().parent().attr('id');
    }
    if(parentId=='intelligent_alternative_tab') {
        jQuery('#intelligent_next_step_tab').append(this);
    }else if(parentId=='intelligent_alternative_tr')
    {
        jQuery('#intelligent_next_step_tab').append(this);
    }else if(parentId=='intelligent_next_step_tab')
    {
        jQuery('#intelligent_alternative_tab').append(this);
    }

});
//--------全选与取消全选-------------
function selectAll(type,is_jquery_ui)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    if(type=='left'){
        var objTrLength=jQuery('#next_step_tab').find('tr').length;
        var objSelectLength=jQuery('#next_step_tab').find('.'+selected_class).length;
        var obj=jQuery('#next_step_tab').find('tr');
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
        objTrLength=jQuery('#alternative_tab').find('.alternative_step').length;
        objSelectLength=jQuery('#alternative_tab').find('.'+selected_class).length;
        obj=jQuery('#alternative_tab').find('.alternative_step');
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
	alternativelimit_array_from_next();
}
function intelligentSelectAll(type,is_jquery_ui)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    if(type=='left'){
        var objTrLength=jQuery('#intelligent_next_step_tab').find('tr').length;
        var objSelectLength=jQuery('#intelligent_next_step_tab').find('.'+selected_class).length;
        var obj=jQuery('#intelligent_next_step_tab').find('tr');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#intelligent_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#intelligent_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#intelligent_left_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#intelligent_left_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }else if(type=='right'){
        objTrLength=jQuery('#intelligent_alternative_tab').find('.intelligent_alternative_step').length;
        objSelectLength=jQuery('#intelligent_alternative_tab').find('.'+selected_class).length;
        obj=jQuery('#intelligent_alternative_tab').find('.intelligent_alternative_step');
        if(objTrLength>0&objSelectLength<objTrLength){
            obj.addClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#intelligent_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#intelligent_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }else if(objSelectLength>0){
            obj.removeClass(selected_class);
            if(obj.hasClass(selected_class)){
                jQuery('#intelligent_right_btn').text(td_lang.system.workflow.msg_18);
            }else{
                jQuery('#intelligent_right_btn').text(td_lang.system.workflow.msg_17);
            }
        }
    }
}
//--------全选与取消全选结束-------------------------------------
//自定义插件的处理----
function selectPlug(tabId,tabIdOther,btnId,is_jquery_ui)
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
                    var itemId = selectedTr.attr("sortId");
                    var list_edit_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_1']");    //edit priv object
                    var list_add_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_2']");    //add priv object
                    var list_delete_priv = jQuery("div").find("#list_item").find("input[name='LIST_"+itemId+"_3']");    //delete priv object

                    var new_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_NEW_"+itemId+"']");    //new priv object
                    var edit_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_EDIT_"+itemId+"']");    //edit priv object
                    var delete_file_priv = jQuery("div").find("#head3").find("input[id='FILE_PRIV_DELETE_"+itemId+"']");    //delete priv object

                    var new_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_NEW_"+itemId+"']");    //new priv object
                    var delete_img_priv = jQuery("div").find("#head5").find("input[id='IMG_PRIV_DELETE_"+itemId+"']");    //delete priv object

                    if(s_tabIdOther == 'alternative_tab')
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
                    }
                    else if(s_tabIdOther == 'next_step_tab')
                    {
                        if(list_edit_priv.length == 1 && list_add_priv.length == 1 && list_delete_priv.length == 1)
                        {
                            //加入修改权限
                            list_edit_priv.prop("disabled",false);

                            //加入添加权限
                            list_add_priv.prop("disabled",false);

                            //加入删除权限
                            list_delete_priv.prop("disabled",false);
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
}
//---------插件选中的判断 以及全选以及取消的判断--------------------------
function selectTr(obj,leftTabId,rightTabtId,btnLeftId,btnRightId,is_jquery_ui)
{
    if(is_jquery_ui)
        var selected_class = 'ui-selected';
    else
        var selected_class = 'select'
    var is_fire=getOs();
    var parent=jQuery(obj).parent().attr('id');//对应table的id
    if(parent==undefined){
        parent=jQuery(obj).parent().parent().attr('id');
    }
    var silibings=jQuery(obj).siblings();//当前对象的同辈元素
    var rightSelectLength=jQuery('#'+leftTabId).find('.'+selected_class).length;
    var leftSelectLength=jQuery('#'+rightTabtId).find('.'+selected_class).length;
    var rightTrLength=jQuery('#'+leftTabId).find('tr').length;
    var leftTrLength=jQuery('#'+rightTabtId).find('tr').length;
    if(jQuery(obj).hasClass(selected_class)){
        if(rightSelectLength>1||leftSelectLength>1){//如果是当前是多选情况去掉出当前对象未的所有被选中的同辈元素
            silibings.removeClass(selected_class);
        }else{
            jQuery(obj).removeClass(selected_class);
        }
        if(jQuery('#'+btnLeftId).length!==0){//判断有无全选的按钮
            if(rightSelectLength==rightTrLength||leftSelectLength==leftTrLength){
                jQuery('#'+btnLeftId).text(td_lang.system.workflow.msg_17);
                jQuery('#'+btnRightId).text(td_lang.system.workflow.msg_17);
            }
        }
    }else{

        if(is_fire=='Firefox')
        {
            jQuery(obj).addClass(selected_class);
            silibings.removeClass(selected_class);;
        }
        if(event.ctrlKey) //ctrl键支持多选操作
        {
            jQuery(obj).addClass(selected_class);
            if(jQuery('#'+btnLeftId).length!==0){
                if(rightSelectLength==(rightTrLength-1)&parent!==rightTabtId){//左侧控制左侧
                    jQuery('#'+btnLeftId).text(td_lang.system.workflow.msg_18);
                }else if(leftSelectLength==(leftTrLength-1)&parent!==leftTabId){//右侧控制右侧
                    jQuery('#'+btnRightId).text(td_lang.system.workflow.msg_18);
                }
            }
        }else
        {
            jQuery(obj).addClass(selected_class);
            silibings.removeClass(selected_class);
        }

    }
}
function getOs()
{
    var OsObject = "";
    if(navigator.userAgent.indexOf("MSIE")>0) {
        return "MSIE";
    }
    if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){
        return "Firefox";
    }
    if(isSafari=navigator.userAgent.indexOf("Safari")>0) {
        return "Safari";
    }
    if(isCamino=navigator.userAgent.indexOf("Camino")>0){
        return "Camino";
    }
    if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0){
        return "Gecko";
    }

} 