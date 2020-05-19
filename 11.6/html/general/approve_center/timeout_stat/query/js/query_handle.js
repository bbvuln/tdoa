jQuery(document).ready(function(){ 
	jQuery(document).each(function(){
		this.onkeyup = function(){
			var keycode = window.event.keyCode;
			if(keycode == 13){
                var searchStr = getSearchStr();
                jQuery("#gridTable").jqGrid('setGridParam',{
                    url:"data/getdata.php?"+searchStr,
                    page:1
                }).trigger('reloadGrid');  
			}
		}
	});
	jQuery('#do_search').click(function(){
		var searchStr = getSearchStr();
			jQuery("#gridTable").jqGrid('setGridParam',{
				url:"data/getdata.php?"+searchStr,
				page:1,
			}).trigger('reloadGrid');  	
	});
    jQuery("#USER_TYPE").click(function(){
        var type = jQuery("#USER_TYPE").val();
        if(type == "all"){           
            jQuery("#user_name").hide();
            jQuery("#orgAdd").hide();
            jQuery("#orgClear").hide();
            jQuery("#exp_user_name").hide();
            jQuery("#expOrgAdd").hide();
            jQuery("#expOrgClear").hide();
        }else{
            jQuery("#user_name").show();
            jQuery("#orgAdd").show();
            jQuery("#orgClear").show();
            jQuery("#exp_user_name").show();
            jQuery("#expOrgAdd").show();
            jQuery("#expOrgClear").show();
        }
    });
    jQuery("#EXP_USER_TYPE").change(function(){
        var exp = jQuery("#EXP_USER_TYPE").val();
        if(exp != "all"){
            jQuery("#exp_user_name").show();
            jQuery("#expOrgAdd").show();
            jQuery("#expOrgClear").show();
        }else{
            jQuery("#exp_user_name").hide();
            jQuery("#expOrgAdd").hide();
            jQuery("#expOrgClear").hide(); 
        }
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
    jQuery('#do_export').click(function(){
		open_bootcss_modal("div_export","900","5");//修改窗口大小
        jQuery('#div_export_body').load();
        var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
        inteligent_id = "exp-"+inteligent_id;
        jQuery('#EXP_FLOW_STATUS').val(jQuery.trim(jQuery('#FLOW_STATUS').val()));
        jQuery('#exp_run_id').val(jQuery.trim(jQuery('#run_id').val()));
        jQuery('#EXP_FLOW_ID').val(jQuery.trim(jQuery('#FLOW_ID').val()));
		jQuery('#EXP_FLOW_ID').find('option[value='+jQuery.trim(jQuery('#FLOW_ID').val())+']').attr('selected',true);
		var flow_name = jQuery("#EXP_FLOW_ID").find("option:selected").text();
		jQuery('#EXP_FLOW_ID').parent().find("#flow_name").val(flow_name);
        jQuery('#exp_user_name').val(jQuery.trim(jQuery('#user_name').val()));
        jQuery('#EXP_USER_ID').val(jQuery.trim(jQuery('#USER_ID').val()));
        jQuery('#exp_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
		jQuery('#finish_exp_begin_time').val(jQuery.trim(jQuery('#finish_begin_time').val()));
        jQuery('#EXP_PRCS_DEPT').val(jQuery.trim(jQuery('#PRCS_DEPT').val()));
        jQuery('#exp_dept_name').val(jQuery.trim(jQuery('#dept_name').val()));
        jQuery('#exp_run_name').val(jQuery.trim(jQuery('#run_name').val()));
        jQuery('#exp_end_time').val(jQuery.trim(jQuery('#end_time').val()));
        jQuery('#finish_exp_end_time').val(jQuery.trim(jQuery('#finish_end_time').val()));
        jQuery('#EXP_RUN_STATUS').val(jQuery.trim(jQuery('#RUN_STATUS').val()));
        jQuery('#EXP_USER_TYPE').val(jQuery.trim(jQuery('#USER_TYPE').val()));
        //'flow_type/set_manage/manage_new.php?FLOW_ID='+flow_id,function(){}
	});
    jQuery('#check_out').click(function(){
    	document.form1.action = "check_out.php";
        document.form1.submit();
        document.form1.action = "";
    });
});

function doExportBatch(){
    var url = "/general/approve_center/timeout_stat/query/data/doexport.php";
    document.form1.action = url;
    document.form1.submit();
}

function getSearchStr(){
	var searchStr = "FLOW_ID="+jQuery.trim(jQuery('#FLOW_ID').val());
	searchStr += "&FLOW_STATUS="+jQuery.trim(jQuery('#FLOW_STATUS').val());
	searchStr += "&USER_ID="+jQuery.trim(jQuery('#USER_ID').val());
	searchStr += "&PRCS_DEPT="+jQuery.trim(jQuery('#PRCS_DEPT').val());
    searchStr += "&RUN_STATUS="+jQuery.trim(jQuery('#RUN_STATUS').val());
	searchStr += "&RUN_ID="+jQuery.trim(jQuery('#run_id').val());
    searchStr += "&RUN_NAME="+jQuery.trim(jQuery('#run_name').val());
    searchStr += "&BEGIN_TIME="+jQuery.trim(jQuery('#begin_time').val());
	searchStr += "&END_TIME="+jQuery.trim(jQuery('#end_time').val());
    searchStr += "&FINISH_BEGIN_TIME="+jQuery.trim(jQuery('#finish_begin_time').val());
	searchStr += "&FINISH_END_TIME="+jQuery.trim(jQuery('#finish_end_time').val());
    searchStr += "&USER_TYPE="+jQuery.trim(jQuery('#USER_TYPE').val());
	return 	searchStr;
}
function getExportStr(){
	var exportStr = jQuery.trim(jQuery('#flow_id').val());
	exportStr += jQuery.trim(jQuery('#flow_name').val());
	exportStr += jQuery.trim(jQuery('#run_id').val());
	exportStr += jQuery.trim(jQuery('#run_name').val());
	exportStr += jQuery.trim(jQuery('#ip').val());
	exportStr += jQuery.trim(jQuery('#user_name').val());
	exportStr += jQuery.trim(jQuery('#user_id').val());
	exportStr += jQuery.trim(jQuery('#PRCS_DEPT').val());
	exportStr += jQuery.trim(jQuery('#begin_time').val());
	exportStr += jQuery.trim(jQuery('#end_time').val());
	exportStr += jQuery.trim(jQuery('#log_type').val());
	return 	exportStr;
}
