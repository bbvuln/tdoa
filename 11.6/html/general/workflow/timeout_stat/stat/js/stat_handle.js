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
				page:1
			}).trigger('reloadGrid');  	
	});

	jQuery('#pic_statement').click(function(){
		set_myxml();
	});
    /*
    jQuery('#do_all_delete').click(function(){
        alert("test");
    });
    jQuery('#do_all_export').click(function(){
        alert("test1");
    })
    */
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
    /*
	jQuery('#do_delete').click(function(){
		open_bootcss_modal("div_delete","900","5");//修改窗口大小
        jQuery('#div_delete_body').load();
        var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
        inteligent_id = "del-"+inteligent_id;
        //var myindex = document.form1.FLOW_ID.selectedIndex;
        //document.getElementById("DEL_FLOW_ID").value = document.form1.FLOW_ID.options[myindex].innerText;
        jQuery('#del_run_id').val(jQuery.trim(jQuery('#run_id').val()));
        jQuery('#del_run_name').val(jQuery.trim(jQuery('#run_name').val()));
        jQuery('#DEL_FLOW_ID').val(jQuery.trim(jQuery('#FLOW_ID').val()));
        jQuery('#del_user_name').val(jQuery.trim(jQuery('#user_name').val()));
        jQuery('#del_user_id').val(jQuery.trim(jQuery('#user_id').val()));
        jQuery('#del_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
        jQuery('#del_ip').val(jQuery.trim(jQuery('#ip').val()));
        jQuery('#del_flow_name').val(jQuery.trim(jQuery('#flow_name').val()));
        jQuery('#del_end_time').val(jQuery.trim(jQuery('#end_time').val()));
	});
    */
    jQuery('#do_export').click(function(){
		open_bootcss_modal("div_export","800","5");//修改窗口大小
        jQuery('#div_export_body').load();
        var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
        inteligent_id = "exp-"+inteligent_id;
        var exp_statcs_manner_query = "exp_"+jQuery('#STATCS_MANNER_QUERY').val();
        jQuery('#EXP_RUN_STATUS').val(jQuery.trim(jQuery('#RUN_STATUS').val()));
        jQuery('#EXP_FLOW_ID').val(jQuery.trim(jQuery('#FLOW_ID').val()));
		jQuery('#EXP_FLOW_ID').find('option[value='+jQuery.trim(jQuery('#FLOW_ID').val())+']').attr('selected',true);
		var flow_name = jQuery("#EXP_FLOW_ID").find("option:selected").text();
		jQuery('#EXP_FLOW_ID').parent().find("#flow_name").val(flow_name);
		
        jQuery('#EXP_STATCS_MANNER_QUERY').val(exp_statcs_manner_query);
        jQuery('#exp_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
        jQuery('#exp_end_time').val(jQuery.trim(jQuery('#end_time').val()));
		jQuery('#finish_exp_begin_time').val(jQuery.trim(jQuery('#finish_begin_time').val()));
        jQuery('#finish_exp_end_time').val(jQuery.trim(jQuery('#finish_end_time').val()));
        jQuery('#EXP_USER_NAME').val(jQuery.trim(jQuery('#USER_NAME').val()));
        jQuery('#EXP_TO_NAME').val(jQuery.trim(jQuery('#TO_NAME').val()));
        jQuery('#EXP_PRIV_NAME').val(jQuery.trim(jQuery('#PRIV_NAME').val()));
        jQuery('#EXP_USER_ID').val(jQuery.trim(jQuery('#USER_ID').val()));
        jQuery('#EXP_TO_ID').val(jQuery.trim(jQuery('#TO_ID').val()));
        jQuery('#EXP_PRIV_ID').val(jQuery.trim(jQuery('#PRIV_ID').val()));
        jQuery('#EXP_USER_STATUS').val(jQuery.trim(jQuery('#USER_STATUS').val()));
        jQuery('#EXP_TIME_FIELDER_SELECT').val(jQuery.trim(jQuery('#TIME_FIELDER_SELECT').val()));
        jQuery('#EXP_YEAR_COUNT').val(jQuery.trim(jQuery('#YEAR_COUNT').val()));
        jQuery('#EXP_MONTHS_COUNT').val(jQuery.trim(jQuery('#MONTHS_COUNT').val()));
        jQuery('#EXP_TIME_FIELDER_SELECT').change();
        if(exp_statcs_manner_query == "exp_user")
        {
            document.getElementById("exp_td_user").style.display = "";
            document.getElementById("exp_td_dept").style.display = "none";
            document.getElementById("exp_td_role").style.display = "none";
            
            document.form1.EXP_TO_ID.value = "";
            document.form1.EXP_TO_NAME.value = "";
            document.form1.EXP_PRIV_ID.value = "";
            document.form1.EXP_PRIV_NAME.value = "";
        }else if(exp_statcs_manner_query == "exp_dept")
        {
            document.getElementById("exp_td_user").style.display = "none";
            document.getElementById("exp_td_dept").style.display = "";
            document.getElementById("exp_td_role").style.display = "none";

            document.form1.EXP_USER_ID.value = "";
            document.form1.EXP_USER_NAME.value = "";
            document.form1.EXP_PRIV_ID.value = "";
            document.form1.EXP_PRIV_NAME.value = "";
        }else
        {
            document.getElementById("exp_td_user").style.display = "none";
            document.getElementById("exp_td_dept").style.display = "none";
            document.getElementById("exp_td_role").style.display = "";

            document.form1.EX_TO_ID.value = "";
            document.form1.EXP_TO_NAME.value = "";
            document.form1.EXP_USER_ID.value = "";
            document.form1.EXP_USER_NAME.value = "";
        }
        //'flow_type/set_manage/manage_new.php?FLOW_ID='+flow_id,function(){}
	});
});
/**
 * 统计数据处理
 * 王瑞杰 20140428
 * 数据为空，返回刷新页面
 * 数据不为空，显示报表
 * ms.php 与getdata.php查询一致
 * 点击按钮触发此函数
 */
function set_myxml(){
	var searchStr = getSearchStr();
    jQuery.ajax({
        url: "data/ms.php",
        type: "GET",
        data: searchStr,
        success: function(data) {
        	if(data == '0'){
        		alert("统计数据为空，请重新统计。");
        		window.location.reload();
        	}else{
        		open_bootcss_modal("div_pic_statement","1150","5");
                jQuery('#div_pic_statement_body').load();
            	chart_type = $("#showChart").val();
            	showChart(chart_type,data);
        	}
        },
	    error:function(data){
	    	alert('运行错误');
	    }
    });
}
/*
function doDeleteBatch(){
    var url = "/general/workflow/logs/data/dodelete.php";
    var del_flow_id = document.form1.DEL_FLOW_ID.value;
    var del_run_id = document.form1.del_run_id.value;
    var del_run_name = document.form1.DEL_RUN_NAME.value;
    var del_user_id = document.form1.DEL_USER_ID.value;
    var del_begin_time = document.form1.DEL_BEGIN_TIME.value;
    var del_end_time = document.form1.DEL_END_TIME.value;
    var del_log_type = document.form1.del_log_type.value;
    var del_ip = document.form1.DEL_IP.value;
    var del_flags = 1;
    msg_single = td_lang.general.workflow.msg_128;
    msg_batch = td_lang.general.workflow.msg_181;
    msg_confirm = td_lang.general.workflow.msg_180;
    if((del_flow_id=="all"||del_flow_id=="")&&del_run_id==""&&del_user_id==""&&del_run_name==""&&del_begin_time==""&&del_end_time==del_end_time&&del_log_type==""&&del_ip=="")
    {
    	var msg = msg_batch + "\n" + msg_confirm;
     	if(window.prompt(msg,"") == "OK")
        {
            jQuery.ajax
            ({		   
                url: url,
                data: {'del_flow_id':del_flow_id,'del_run_name':del_run_name,'del_run_id':del_run_id,'del_user_id':del_user_id,'del_begin_time':del_begin_time,'del_end_time':del_end_time,'del_log_type':del_log_type},
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
    }else if(window.confirm(msg_single))
    {
        jQuery.ajax
        ({		   
            url: url,
            data: {'del_flow_id':del_flow_id,'del_run_name':del_run_name,'del_run_id':del_run_id,'del_user_id':del_user_id,'del_begin_time':del_begin_time,'del_end_time':del_end_time,'del_log_type':del_log_type},
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
*/
function doExportBatch(){
    var url = "/general/workflow/timeout_stat/stat/data/doexport.php";
    document.form1.action = url;
    document.form1.submit();
}
/*
function delItemData($i_log_id){
    msg = td_lang.general.workflow.msg_128;
    if(window.confirm(msg)){
        var log_id = $i_log_id
        jQuery.ajax
        ({
            type:"post",
            url:"delete.php",
            async: true,
            data:{"log_id":log_id},
            success: function(data){
                jQuery("#gridTable").trigger("reloadGrid");
            },
        });
    }
}
*/
function getSearchStr(){
	var searchStr = "flow_id="+jQuery.trim(jQuery('#FLOW_ID').val());
	searchStr += "&RUN_STATUS="+jQuery.trim(jQuery('#RUN_STATUS').val());
	searchStr += "&run_name="+jQuery.trim(jQuery('#run_name').val());
	searchStr += "&statcs_manner_query="+jQuery.trim(jQuery('#STATCS_MANNER_QUERY').val());
    searchStr += "&user_id="+jQuery.trim(jQuery('#USER_ID').val());
	searchStr += "&begin_time="+jQuery.trim(jQuery('#begin_time').val());
	searchStr += "&end_time="+jQuery.trim(jQuery('#end_time').val());
	searchStr += "&to_id="+jQuery.trim(jQuery('#TO_ID').val());
	searchStr += "&priv_id="+jQuery.trim(jQuery('#PRIV_ID').val());
    if(jQuery.trim(jQuery('#TIME_FIELDER_SELECT').val()) == '1'){
        searchStr += "&YEAR_COUNT="+jQuery.trim(jQuery('#YEAR_COUNT').val());
        searchStr += "&MONTHS_COUNT="+jQuery.trim(jQuery('#MONTHS_COUNT').val());
    } else if(jQuery.trim(jQuery('#TIME_FIELDER_SELECT').val()) == '2') {
        searchStr += "&FINISH_BEGIN_TIME="+jQuery.trim(jQuery('#finish_begin_time').val());
        searchStr += "&FINISH_END_TIME="+jQuery.trim(jQuery('#finish_end_time').val());
    }

    searchStr += "&USER_STATUS="+jQuery.trim(jQuery('#USER_STATUS').val());
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
	exportStr += jQuery.trim(jQuery('#begin_time').val());
	exportStr += jQuery.trim(jQuery('#end_time').val());
	exportStr += jQuery.trim(jQuery('#log_type').val());
	return 	exportStr;
}

//根据选中的统计分类方式，显示不同的选择框（人员、部门、角色）
function change_statcs_manner(obj) {
	if (obj.value == "user") {//人员
		document.getElementById("td_user").style.display = "inline-block";
		document.getElementById("td_dept").style.display = "none";
		document.getElementById("td_role").style.display = "none";
		
		document.form1.TO_ID.value = "";
		document.form1.TO_NAME.value = "";
		document.form1.PRIV_ID.value = "";
		document.form1.PRIV_NAME.value = "";
	} else if (obj.value == "dept") {//部门
		document.getElementById("td_user").style.display = "none";
		document.getElementById("td_dept").style.display = "inline-block";
		document.getElementById("td_role").style.display = "none";

		document.form1.USER_ID.value = "";
		document.form1.USER_NAME.value = "";
		document.form1.PRIV_ID.value = "";
		document.form1.PRIV_NAME.value = "";
	} else {//角色
		document.getElementById("td_user").style.display = "none";
		document.getElementById("td_dept").style.display = "none";
		document.getElementById("td_role").style.display = "inline-block";

		document.form1.TO_ID.value = "";
		document.form1.TO_NAME.value = "";
		document.form1.USER_ID.value = "";
		document.form1.USER_NAME.value = "";
	}  
}
//批量导出，根据选中的统计分类方式，显示不同的选择框（人员、部门、角色）
function change_statcs_exp_manner(obj) {
	if (obj.value == "exp_user") {//人员
		document.getElementById("exp_td_user").style.display = "";
		document.getElementById("exp_td_dept").style.display = "none";
		document.getElementById("exp_td_role").style.display = "none";
		
		document.form1.EXP_TO_ID.value = "";
		document.form1.EXP_TO_NAME.value = "";
		document.form1.EXP_PRIV_ID.value = "";
		document.form1.EXP_PRIV_NAME.value = "";
	} else if (obj.value == "exp_dept") {//部门
		document.getElementById("exp_td_user").style.display = "none";
		document.getElementById("exp_td_dept").style.display = "";
		document.getElementById("exp_td_role").style.display = "none";

		document.form1.EXP_USER_ID.value = "";
		document.form1.EXP_USER_NAME.value = "";
		document.form1.EXP_PRIV_ID.value = "";
		document.form1.EXP_PRIV_NAME.value = "";
	} else {//角色
		document.getElementById("exp_td_user").style.display = "none";
		document.getElementById("exp_td_dept").style.display = "none";
		document.getElementById("exp_td_role").style.display = "";

		document.form1.EX_TO_ID.value = "";
		document.form1.EXP_TO_NAME.value = "";
		document.form1.EXP_USER_ID.value = "";
		document.form1.EXP_USER_NAME.value = "";
	}  
}

//导出成EXCEL格式的文件
function export_excel() {
   if (check_form())
   {  
      document.form1.action = "export.php";
      document.form1.submit();
      document.form1.action = "";
   }
}

function empty_date()
{
   document.getElementById("PRCS_DATE1_QUERY").value = "";
   document.getElementById("PRCS_DATE2_QUERY").value = "";
}

function ShowLayers(n,m)
{
    for(i=1;i<=m;i++)
    {
        eval("content" + i).style.display="none";
        eval("title"+i+".className='';");
    }
    eval("title"+n+".className='active';");
    eval("content" + n).style.display="";
}

function order_by(field,asc_desc){
	document.getElementById("ORDER_FIELD").value = field;
	document.getElementById("ASC_DESC").value = asc_desc;
	document.form1.action = "index.php";
    document.form1.submit();
    document.form1.action = "";	
}
/*
//验证部分
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
*/