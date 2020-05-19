jQuery(document).ready(function(){ 
	jQuery('#do_search').click(function(){
	//alert('do_search');
        var searchStr = getSearchStr();
        jQuery("#gridTable").jqGrid('setGridParam',{
            url:"data/getdata.php?"+searchStr,
            page:1
        }).trigger('reloadGrid');  
	});
	jQuery('#do_delete').click(function(){
        var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
        inteligent_id = "del-"+inteligent_id;
        jQuery('#del_flow_id').val(document.form1.FLOW_ID.value);
        jQuery('#del_user_name').val(jQuery.trim(jQuery('#user_name').val()));
        jQuery('#del_user_id').val(jQuery.trim(jQuery('#user_id').val()));
        jQuery('#del_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
        jQuery('#del_ip').val(jQuery.trim(jQuery('#ip').val()));
        jQuery('#del_flow_name').val(jQuery.trim(jQuery('#flow_name').val()));
        jQuery('#del_end_time').val(jQuery.trim(jQuery('#end_time').val()));
        jQuery('#del_log_type').val(jQuery.trim(jQuery('#log_type').val()));
        open_bootcss_modal("div_delete","780","5");//修改窗口大小
        jQuery('#div_delete_body').load();
	});
    jQuery('#do_export').click(function(){
        var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
        inteligent_id = "exp-"+inteligent_id;
        var FLOW_IDS = jQuery('#FLOW_ID').val();
        jQuery('#exp_flow_id').val(FLOW_IDS);
        jQuery('#exp_user_name').val(jQuery.trim(jQuery('#user_name').val()));
        jQuery('#exp_user_id').val(jQuery.trim(jQuery('#user_id').val()));
        jQuery('#exp_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
        jQuery('#exp_ip').val(jQuery.trim(jQuery('#ip').val()));
        jQuery('#exp_flow_name').val(jQuery.trim(jQuery('#flow_name').val()));
        jQuery('#exp_end_time').val(jQuery.trim(jQuery('#end_time').val()));
        jQuery('#exp_log_type').val(jQuery.trim(jQuery('#log_type').val()));
        jQuery('#exp_work_level').val(jQuery.trim(jQuery('#work_level').val()));
        open_bootcss_modal("div_export","780","5");//修改窗口大小
        var flow_name = jQuery(".ui-autocomplete-input").val();
        jQuery('#div_export_body').load();
        var flow_id = jQuery("#FLOW_ID").val();
        if(flow_id != "")//流水号
        {
        	jQuery("#EXP_FLOW_ID").val(flow_id);
        	jQuery(".ui-autocomplete-input").val(flow_name);
        }
        var run_id = jQuery("input[name='RUN_ID']").val();
        if(run_id != "")//流水号
        {
        	jQuery("#exp_run_id").val(run_id);
        }
        var run_name = jQuery("#run_name").val();
        if(run_name != "")//工作名称/文号
        {
        	jQuery("#exp_run_name").val(run_name);
        }
        var user_type = jQuery("select[name='USER_TYPE']").val();
        if(user_type != "")
        {
        	jQuery("select[name='EXP_USER_TYPE']").val(user_type);
        }
        var to_name = jQuery("#to_name").val();
        if(to_name != "")
        {
        	jQuery("#exp_to_name").val(to_name);
        }
        var to_id = jQuery("input[name='TO_ID']").val();
        if(to_id != "")
        {
        	jQuery("input[name='EXP_TO_ID']").val(to_id);
        }
	});
	jQuery(document).on('click', 'i[class="close"]', function(){
		var gather_node_have_flag = jQuery(this).attr('gather_node_have_flag');
		if(gather_node_have_flag === '1'){
			alert(td_lang.general.approve_center.msg_247);
			return false;
		}
		var tags_obj = jQuery(this).parent();
		var op_block_div = tags_obj.parent();
		var op_user_val_btn = op_block_div.find('input[data_type="op_user_btn"]');
		var user_id = tags_obj.attr('user_id');
		var flow_prcs = op_block_div.attr('id').substring(17);
		if(op_block_div.attr('id').substring(0, 4) == 'prcs' && jQuery('#PRCS_OP_USER'+flow_prcs).val() == user_id){
			jQuery('#host_op_block_div'+flow_prcs).find('i[class="close"]').trigger('click');
		}
		if(op_user_val_btn.val().indexOf(user_id + ',') == 0){
			op_user_val_btn.val(op_user_val_btn.val().replace(user_id + ',', ''));
		}else if(op_user_val_btn.val().indexOf(',' + user_id + ',') > 0){
			op_user_val_btn.val(op_user_val_btn.val().replace(',' + user_id + ',', ','));
		}else if(op_user_val_btn.val() == user_id){ // 主办情况
			op_user_val_btn.val('');
		}
		tags_obj.remove();		
	});
	jQuery(document).on('click', '.users-clear', function(){
		var prcs_next = jQuery(this).attr('prcs_next');
		var gather_node_have_flag = jQuery(this).attr('gather_node_have_flag');
		if(gather_node_have_flag == '1'){
			alert(td_lang.general.approve_center.msg_247);
			return false;
		}
		if(prcs_next){
			jQuery("[prcs_id_next='"+prcs_next+"']").find('.user-tags').remove();
			jQuery("[prcs_id_next='"+prcs_next+"']").find('input[type="hidden"]').val('');
		}
	});
});
function delItemData($i_id){
    msg = td_lang.general.approve_center.msg_128;
    if(window.confirm(msg)){
        var id = $i_id;
        jQuery.ajax({
            type:"post",
            url:"delete.php",
            data:{"id":id},
            success:function(data){
                jQuery("#gridTable").trigger("reloadGrid");
            },
        });
    }
}
function getSearchStr(){
    var searchStr = "action=monitor_work";
	searchStr += "&flow_id="+jQuery.trim(jQuery('#FLOW_ID').val());
	searchStr += "&flow_name="+jQuery.trim(jQuery('#flow_name').val());
	//searchStr += "&run_id="+jQuery.trim(jQuery('#run_id').val());
	searchStr += "&ip="+jQuery.trim(jQuery('#ip').val());
	//searchStr += jQuery.trim(jQuery('#user_name').val());
	searchStr += "&user_id="+jQuery.trim(jQuery('#user_id').val());
	searchStr += "&begin_time="+jQuery.trim(jQuery('#begin_time').val());
	searchStr += "&end_time="+jQuery.trim(jQuery('#end_time').val());
	searchStr += "&type="+jQuery.trim(jQuery('#log_type').val());
    searchStr += "&work_level="+ jQuery.trim(jQuery('#work_level').val());
	return 	searchStr;
}
function getExportStr(){
	var exportStr = jQuery.trim(jQuery('#FLOW_ID').val());
	exportStr += jQuery.trim(jQuery('#flow_name').val());
	exportStr += jQuery.trim(jQuery('#run_id').val());
	exportStr += jQuery.trim(jQuery('#ip').val());
	exportStr += jQuery.trim(jQuery('#user_name').val());
	exportStr += jQuery.trim(jQuery('#user_id').val());
	exportStr += jQuery.trim(jQuery('#begin_time').val());
	exportStr += jQuery.trim(jQuery('#end_time').val());
	exportStr += jQuery.trim(jQuery('#log_type').val());
	return 	exportStr;
}
function isNum(){
	var regular_run_id = "^[0-9]+$";
	var reg_run_id = new RegExp(regular_run_id);
	var confirm_run_id = jQuery.trim(jQuery('#run_id').val());
	if(confirm_run_id == "")
	{
		return true;
	}
	if(confirm_run_id.search(reg_run_id) != -1)
	{
		return true;
	}else
	{
		return false;
	}
}
function isIP()
{
	var regular_ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g ;//匹配IP地址的正则表达式
	var confirm_ip = jQuery.trim(jQuery('#ip').val());
	if(confirm_ip == "")
	{
		return true;
	}
	if(regular_ip.test(confirm_ip))
	{
		if(RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<256)
		{
			return true;
		}else
		{
		return false;
		}
	}
}
function doExportBatch()
{
    var url = "/general/approve_center/manage/data/doexport.php";
    jQuery("#manage_search").attr("action", url);
    jQuery("#manage_search").submit();
}
function doDeleteBatch(){
    var url = "/general/system/approve_center/flow_log/data/dodelete.php";
    var del_flow_id = document.form1.del_flow_id.value;
    var del_user_id = document.form1.DEL_USER_ID.value;
    var del_begin_time = document.form1.DEL_BEGIN_TIME.value;
    var del_end_time = document.form1.DEL_END_TIME.value;
    var del_log_type = document.form1.del_log_type.value;
    var del_ip =document.form1.DEL_IP.value;
    var del_flags = 1;
    //alert(del_flow_id+"del_flow_name:"+del_flow_name+"del_user_id:"+del_user_id+"del_begin_time:"+del_begin_time+"del_end_time:"+del_end_time+"del_log_type:"+del_log_type+"del_ip:"+del_ip);
    if(del_flow_id=="all"||del_flow_id==""&&del_user_id==""&&del_begin_time==""&&del_log_type==""&&del_ip=="")
    {
    	var msga='<?=_("确认要删除所有流程日志吗？")?>\n<?=_("删除后将不可恢复，确认删除请输入大写字母“OK”")?>';
     	if(window.prompt(msga,"") == "OK"){
     		jQuery.ajax
	        ({		   
	            url: url,
	            data: {'del_flow_id':del_flow_id,'del_user_id':del_user_id,'del_begin_time':del_begin_time,'del_end_time':del_end_time,'del_log_type':del_log_type,'del_ip':del_ip,'del_flags':del_flags},
	            type: "POST",
	            async: true,
	            success: function(data){
	                jQuery('#hide_window_close').click();
	                jQuery("#gridTable").trigger("reloadGrid");
	            },
	            error: function(data){
	                alert(data.responseText);
	            }
	        });
     	}
    	else
    	{
    		return;	
    	}
    	
    	
    }
    else{
	    msg = td_lang.general.approve_center.msg_128;
	    if(window.confirm(msg))
	    {
	        jQuery.ajax
	        ({		   
	            url: url,
	            data: {'del_flow_id':del_flow_id,'del_user_id':del_user_id,'del_begin_time':del_begin_time,'del_end_time':del_end_time,'del_log_type':del_log_type,'del_ip':del_ip,'del_flags':del_flags},
	            type: "POST",
	            async: true,
	            success: function(data){
	                jQuery('#hide_window_close').click();
	                jQuery("#gridTable").trigger("reloadGrid");
	            },
	            error: function(data){
	                alert(data.responseText);
	            }
	        });
	    }
    }
}