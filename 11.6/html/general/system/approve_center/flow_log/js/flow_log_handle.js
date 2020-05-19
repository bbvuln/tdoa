jQuery(document).ready(function(){ 
	jQuery('#div_export, #div_delete').find("button[data-dismiss='modal']").click(function(){
		if(jQuery("ul[role='listbox']").is( ":visible" )){
			jQuery("ul[role='listbox']").hide();
		}
	});
	jQuery('#do_search').click(function(){
    var searchStr = getSearchStr();
    jQuery("#gridTable").jqGrid('setGridParam',{
        url:"data/getdata.php?"+searchStr,
        page:1
    }).trigger('reloadGrid');  
	});
    jQuery('#do_search_more').click(function(){
        jQuery('#form-search-bottom').css('display','block');
        jQuery('#do_search_more').css('display','none');
        jQuery('#do_search_less').css('display','inline');
        jQuery(window).resize();
        //设置“更多”状态
        if(jQuery.cookie(searchMoreCookieName)==null || jQuery.cookie(searchMoreCookieName)==0){
            jQuery.cookie(searchMoreCookieName, searchMoreMark, {expires:searchMoreCookieExpire, path:'/'});
        }else if((jQuery.cookie(searchMoreCookieName) & searchMoreMark) == 0){
            jQuery.cookie(searchMoreCookieName, parseInt(jQuery.cookie(searchMoreCookieName)) + searchMoreMark, {expires:searchMoreCookieExpire, path:'/'});
        }
    });
    jQuery('#do_search_less').click(function(){
        jQuery('#form-search-bottom').css('display','none');
        jQuery('#do_search_more').css('display','inline');
        jQuery('#do_search_less').css('display','none');
        jQuery(window).resize();
        if(jQuery.cookie(searchMoreCookieName)!=null){
            searchMoreMark = jQuery.cookie(searchMoreCookieName) & (~searchMoreMark);
            if(!searchMoreMark){
                searchMoreCookieExpire = -1;
            }
            jQuery.cookie(searchMoreCookieName, searchMoreMark, {expires:searchMoreCookieExpire, path:'/'});
        }
    });
    if(jQuery.cookie(searchMoreCookieName)!=null && (jQuery.cookie(searchMoreCookieName) & searchMoreMark) != 0){
        jQuery('#do_search_more').click();
    }
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
        jQuery(".ui-autocomplete-input").val(jQuery('#flow_name').val());
        open_bootcss_modal("div_delete","780","5");//修改窗口大小
        jQuery('#div_delete_body').load();
	});
    jQuery('#do_export').click(function(){
        var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
        inteligent_id = "exp-"+inteligent_id;
        jQuery('#exp_flow_id').val(document.form1.FLOW_ID.value);
        jQuery('#exp_user_name').val(jQuery.trim(jQuery('#user_name').val()));
        jQuery('#exp_user_id').val(jQuery.trim(jQuery('#user_id').val()));
        jQuery('#exp_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
        jQuery('#exp_ip').val(jQuery.trim(jQuery('#ip').val()));
        jQuery('#exp_flow_name').val(jQuery.trim(jQuery('#flow_name').val()));
        jQuery('#exp_end_time').val(jQuery.trim(jQuery('#end_time').val()));
        jQuery('#exp_log_type').val(jQuery.trim(jQuery('#log_type').val()));
        jQuery(".ui-autocomplete-input").val(jQuery('#flow_name').val());
        open_bootcss_modal("div_export","780","5");//修改窗口大小
        jQuery('#div_export_body').load();
	});
});
function delItemData($i_id){
    msg = td_lang.general.workflow.msg_128;
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
	var searchStr = "flow_id="+jQuery.trim(jQuery('#FLOW_ID').val());
	searchStr += "&flow_name="+jQuery.trim(jQuery('#flow_name').val());
	//searchStr += "&run_id="+jQuery.trim(jQuery('#run_id').val());
	searchStr += "&ip="+jQuery.trim(jQuery('#ip').val());
	//searchStr += jQuery.trim(jQuery('#user_name').val());
	searchStr += "&user_id="+jQuery.trim(jQuery('#user_id').val());
	searchStr += "&begin_time="+jQuery.trim(jQuery('#begin_time').val());
	searchStr += "&end_time="+jQuery.trim(jQuery('#end_time').val());
	searchStr += "&type="+jQuery.trim(jQuery('#log_type').val());
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
    var url = "/general/system/approve_center/flow_log/data/doexport.php";
    document.form1.action = url;
    document.form1.submit();
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
    msg_batch = td_lang.general.workflow.msg_182;
    msg_confirm = td_lang.general.workflow.msg_180;
    //alert(del_flow_id+"del_flow_name:"+del_flow_name+"del_user_id:"+del_user_id+"del_begin_time:"+del_begin_time+"del_end_time:"+del_end_time+"del_log_type:"+del_log_type+"del_ip:"+del_ip);
    if((del_flow_id=="all"||del_flow_id=="")&&del_user_id==""&&del_begin_time==""&&del_end_time==del_end_time&&del_log_type==""&&del_ip=="")
    {
    	var msga = msg_batch + "\n" + msg_confirm;
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
	    msg = td_lang.general.workflow.msg_128;
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