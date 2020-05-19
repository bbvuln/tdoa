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
	change_list();
	
	jQuery('#do_search').click(function(){
        /*
		var searchStr = getSearchStr();
			jQuery("#gridTable").jqGrid('setGridParam',{
				url:"data/getdata.php?"+searchStr,
				page:1
			}).trigger('reloadGrid');  
        */
        var login_user_id = jQuery("#login_user_id").val();
        var tab_type = jQuery("#TAB_TYPE").val();
        if(tab_type == "tab0" && login_user_id != "admin")
        {
            jQuery("#do_all_start").css("display", "none");
            jQuery("#do_all_stop").css("display", "none");
            jQuery("#do_all_delete").css("display", "none");  
        }            
        else if(tab_type != "tab0" && login_user_id != "admin")
        {
            jQuery("#do_all_start").css("display", "");
            jQuery("#do_all_stop").css("display", "");
            jQuery("#do_all_delete").css("display", "");
        }
	});
	//wyt 2014/3/31 修改 添加全部删除 关闭 开启功能
    jQuery('#do_all_delete').click(function(){
        var login_user_id = jQuery("#login_user_id").val();
        var hidden_flow_id = jQuery("#hidden_flow_id").val();
        var hidden_tab_type = jQuery("#hidden_tab_type").val();
        var hidden_user_name = jQuery("#hidden_user_name").val();
        var hidden_was_user_name = jQuery("#hidden_was_user_name").val();
        var hidden_query_user_id = jQuery("#hidden_query_user_id").val();
        var hidden_was_query_user_id = jQuery("#hidden_was_query_user_id").val();
        var TAB_TYPE = jQuery("#TAB_TYPE").val();
    	var msg_del_all = td_lang.general.workflow.msg_278;
    	if(window.confirm(msg_del_all))
    	{
            var url = 'data/deleteall.php';
            jQuery.ajax({		
                url: url,
                type: "POST",
                data: {"login_user_id": login_user_id, "hidden_flow_id":hidden_flow_id, "hidden_tab_type":hidden_tab_type, "hidden_user_name":hidden_user_name, "hidden_was_user_name":hidden_was_user_name, "hidden_query_user_id":hidden_query_user_id, "hidden_was_query_user_id":hidden_was_query_user_id, "TAB_TYPE":TAB_TYPE},
                async: true,
                success: function(data){
                    jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                    jQuery("#do_all_delete").css("display", "");
                    jQuery("#do_all_start").css("display", "");
                    jQuery("#do_all_stop").css("display", "");
                    jQuery("#do_delete").css("display", "none");
                    jQuery("#do_start").css("display", "none");
                    jQuery("#do_stop").css("display", "none");
                },
                error: function(data){
                    alert(data.responseText);
                }
            });
        }
    });
    jQuery('#do_all_start').click(function(){
        var login_user_id = jQuery("#login_user_id").val();
        var hidden_flow_id = jQuery("#hidden_flow_id").val();
        var hidden_tab_type = jQuery("#hidden_tab_type").val();
        var hidden_user_name = jQuery("#hidden_user_name").val();
        var hidden_was_user_name = jQuery("#hidden_was_user_name").val();
        var hidden_query_user_id = jQuery("#hidden_query_user_id").val();
        var hidden_was_query_user_id = jQuery("#hidden_was_query_user_id").val();
        var TAB_TYPE = jQuery("#TAB_TYPE").val();
    	var url = 'data/openall.php';
    	jQuery.ajax({		
    		url: url,
    		type: "POST",
            data: {"login_user_id": login_user_id, "hidden_flow_id":hidden_flow_id, "hidden_tab_type":hidden_tab_type, "hidden_user_name":hidden_user_name, "hidden_was_user_name":hidden_was_user_name, "hidden_query_user_id":hidden_query_user_id, "hidden_was_query_user_id":hidden_was_query_user_id, "TAB_TYPE":TAB_TYPE},
    		async: true,
    		success: function(data){
    			jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                jQuery("#do_all_delete").css("display", "");
                jQuery("#do_all_start").css("display", "");
                jQuery("#do_all_stop").css("display", "");
                jQuery("#do_delete").css("display", "none");
                jQuery("#do_start").css("display", "none");
                jQuery("#do_stop").css("display", "none");
            },
    		error: function(data){
    			alert(data.responseText);
    		}
    	});
    });
    jQuery('#do_all_stop').click(function(){
        var login_user_id = jQuery("#login_user_id").val();
        var hidden_flow_id = jQuery("#hidden_flow_id").val();
        var hidden_tab_type = jQuery("#hidden_tab_type").val();
        var hidden_user_name = jQuery("#hidden_user_name").val();
        var hidden_was_user_name = jQuery("#hidden_was_user_name").val();
        var hidden_query_user_id = jQuery("#hidden_query_user_id").val();
        var hidden_was_query_user_id = jQuery("#hidden_was_query_user_id").val();
        var TAB_TYPE = jQuery("#TAB_TYPE").val();
    	var url = 'data/closeall.php';
    	jQuery.ajax({		
    		url: url,
    		type: "POST",
            data: {"login_user_id": login_user_id, "hidden_flow_id":hidden_flow_id, "hidden_tab_type":hidden_tab_type, "hidden_user_name":hidden_user_name, "hidden_was_user_name":hidden_was_user_name, "hidden_query_user_id":hidden_query_user_id, "hidden_was_query_user_id":hidden_was_query_user_id, "TAB_TYPE":TAB_TYPE},
    		async: true,
    		success: function(data){
    			jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                jQuery("#do_all_delete").css("display", "");
                jQuery("#do_all_start").css("display", "");
                jQuery("#do_all_stop").css("display", "");
                jQuery("#do_delete").css("display", "none");
                jQuery("#do_start").css("display", "none");
                jQuery("#do_stop").css("display", "none");
            },
    		error: function(data){
    			alert(data.responseText);
    		}
    	});
    });
    jQuery("#do_delete").click(function(){
        var rule_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
        var msg_del_selected = td_lang.general.workflow.msg_279;
        if(window.confirm(msg_del_selected))
        {
            var url = 'data/deleteall.php';
            jQuery.ajax({		
                url: url,
                type: "POST",
                data: {"rule_id_str": rule_id_str},
                async: true,
                success: function(data){
                    jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                    jQuery("#do_all_delete").css("display", "");
                    jQuery("#do_all_start").css("display", "");
                    jQuery("#do_all_stop").css("display", "");
                    jQuery("#do_delete").css("display", "none");
                    jQuery("#do_start").css("display", "none");
                    jQuery("#do_stop").css("display", "none");
                },
                error: function(data){
                    alert(data.responseText);
                }
            });
        }
    });
    jQuery("#do_start").click(function(){
        var rule_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
        var url = 'data/openall.php';
        jQuery.ajax({		
            url: url,
            type: "POST",
            data: {"rule_id_str": rule_id_str},
            async: true,
            success: function(data){
                jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                jQuery("#do_all_delete").css("display", "");
                jQuery("#do_all_start").css("display", "");
                jQuery("#do_all_stop").css("display", "");
                jQuery("#do_delete").css("display", "none");
                jQuery("#do_start").css("display", "none");
                jQuery("#do_stop").css("display", "none");
            },
            error: function(data){
                alert(data.responseText);
            }
        });
    });
    jQuery("#do_stop").click(function(){
        var rule_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
        var url = 'data/closeall.php';
        jQuery.ajax({		
            url: url,
            type: "POST",
            data: {"rule_id_str": rule_id_str},
            async: true,
            success: function(data){
                jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                jQuery("#do_all_delete").css("display", "");
                jQuery("#do_all_start").css("display", "");
                jQuery("#do_all_stop").css("display", "");
                jQuery("#do_delete").css("display", "none");
                jQuery("#do_start").css("display", "none");
                jQuery("#do_stop").css("display", "none");
            },
            error: function(data){
                alert(data.responseText);
            }
        });
    });
});
function rule_add()
{
	jQuery('#div_new_edit_body').html("");
	open_bootcss_modal("div_new","800","5");//修改窗口大小
    jQuery('#div_new_body').load("edit.php");
    
}
function rule_edit(RULE_ID,FLOW_ID,FLOW_NAME)
{
	jQuery('#div_new_body').html("");
	open_bootcss_modal("div_new_edit","800","5");//修改窗口大小
    jQuery('#div_new_edit_body').load("edit.php?RULE_ID="+RULE_ID+"&FLOW_NAME="+FLOW_NAME,function(){

    });
}


function change_list(){
    var TAB_TYPE = jQuery("#TAB_TYPE").val();
    if(TAB_TYPE=="tab0"){
    	jQuery("#was_commissioned").css("display","none");
    	jQuery("#commissioned").css("display","inline");
    }else if(TAB_TYPE=="tab1"){
    	jQuery("#was_commissioned").css("display","inline");
    	jQuery("#commissioned").css("display","none");
	}else{
		jQuery("#was_commissioned").css("display","inline");
    	jQuery("#commissioned").css("display","inline");
	}
    jQuery("#user_name").val("");
    jQuery("#was_user_name").val("");
    jQuery("input[name='QUERY_USER_ID']").val("");
    jQuery("input[name='WAS_QUERY_USER_ID']").val("");
}
//新建
function do_add(el, flag)
{
    jQuery(el).attr('disabled', true);
    if(!check_rule_form()){
        jQuery(el).attr('disabled', false);
        return;
    }

	var FLOW_ID = jQuery("#NEW_FLOW_ID").val();
    var QUERY_USER_ID = jQuery("#new_user_id").val();
    var WAS_QUERY_USER_ID = jQuery("#new_to_id").val();
    var ALWAYS_ON = jQuery("#ALWAYS_ON:checked").length <= 0 ? 0 : 1;
    var NEW_BEGIN_TIME  = jQuery("#new_begin_time").val();
    var NEW_END_TIME = jQuery("#new_end_time").val();
    var INTRUST_SMS = jQuery("#intrust_sms").prop("checked");
    var INTRUST_MOBILE = jQuery("#intrust_mobile").prop("checked");
    
	if(flag == "edit")
	{
		var RULE_ID = jQuery("#RULE_ID").val();
		var url = 'data/update.php';
		jQuery.ajax({		
			url: url,
			data: {"RULE_ID":RULE_ID,"FLOW_ID":FLOW_ID,"QUERY_USER_ID":QUERY_USER_ID,"WAS_QUERY_USER_ID":WAS_QUERY_USER_ID,"ALWAYS_ON":ALWAYS_ON,"NEW_BEGIN_TIME":NEW_BEGIN_TIME,"NEW_END_TIME":NEW_END_TIME,"INTRUST_SMS":INTRUST_SMS,"INTRUST_MOBILE":INTRUST_MOBILE},
			type: "POST",
			async: true,
			success: function(data){
				jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                jQuery(el).attr('disabled', false);
                jQuery('.close').click();
                jQuery("#do_all_delete").css("display", "");
                jQuery("#do_all_start").css("display", "");
                jQuery("#do_all_stop").css("display", "");
                jQuery("#do_delete").css("display", "none");
                jQuery("#do_start").css("display", "none");
                jQuery("#do_stop").css("display", "none");
			},
			error: function(data){
				alert(data.responseText);
			}
		});
	}else{
		
		var url = 'data/add.php';
		jQuery.ajax({		
			url: url,
			data: {"FLOW_ID":FLOW_ID,"QUERY_USER_ID":QUERY_USER_ID,"WAS_QUERY_USER_ID":WAS_QUERY_USER_ID,"ALWAYS_ON":ALWAYS_ON,"NEW_BEGIN_TIME":NEW_BEGIN_TIME,"NEW_END_TIME":NEW_END_TIME,"INTRUST_SMS":INTRUST_SMS,"INTRUST_MOBILE":INTRUST_MOBILE},
			type: "POST",
			async: true,
			success: function(data){
				jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
                jQuery(el).attr('disabled', false);
                jQuery('.close').click();
                jQuery("#do_all_delete").css("display", "");
                jQuery("#do_all_start").css("display", "");
                jQuery("#do_all_stop").css("display", "");
                jQuery("#do_delete").css("display", "none");
                jQuery("#do_start").css("display", "none");
                jQuery("#do_stop").css("display", "none");
			},
			error: function(data){
				alert(data.responseText);
			}
		});
	}
}