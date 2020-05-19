jQuery(document).ready(function(){ 
	jQuery('.search_area').each(function(){
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
	jQuery('#do_all_destroy').click(function(){
        doDestroyBatch();
	});
    jQuery('#do_all_restoration').click(function(){
        doRestorationBatch();
	});
    jQuery('#do_destroy').click(function(){
        var url = "/general/workflow/destroy/data/dodestroy.php";
        var run_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
        var msg_batch = td_lang.general.workflow.msg_277;
        var msg_confirm = td_lang.general.workflow.msg_180;
        var msg = msg_batch + "\n" + msg_confirm;
        if(window.prompt(msg,"") == "OK")
        {
			var d = $('<div>').css({
				position: 'fixed',
				left: '50%',
				top: '50%',
				marginLeft: '-50px',
				marginTop: '-20px',
				background: 'white',
				lineHeight: '40px',
				color: '#666',
				fontSize: '14px',
				border: '1px solid #ccc',
				borderRadius: '3px',
				padding: '3px 10px',
				width: '100px',
				height: '40px',
				boxShadow: '0 0 5px #555',
				textAlign: 'center',
				zIndex: 100
			}).appendTo('body');
			var m = $('<div class="pop-panel-overlay"></div>').css({
				width: $(window).width(),
				height: $(window).height()
			}).appendTo('body').show();
			d.html('<img src="/static/images/loading_gray_16.gif" align="absMiddle" class="mg5-x"><?=_("正在执行...")?>');
            jQuery.ajax
            ({		   
                url: url,
                data: {"run_id_str":run_id_str},
                type: "POST",
                async: true,
                success: function(data){
					d.add(m).remove();
                    jQuery("#gridTable").trigger("reloadGrid");
                    jQuery("#do_destroy").css("display","none");
                    jQuery("#do_restoration").css("display","none");
                    jQuery("#do_all_destroy").css("display","");
                    jQuery("#do_all_restoration").css("display","");
                },
                error: function(data){
					d.add(m).remove();
                    alert(data.responseText);
                }
            });
        }
    });
    jQuery('#do_restoration').click(function(){
        var url = "/general/workflow/destroy/data/dorestoration.php";
        var run_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
        var msg_batch = td_lang.general.workflow.msg_280;
        var msg_confirm = td_lang.general.workflow.msg_283;
        var msg = msg_batch + "\n" + msg_confirm;
        if(window.prompt(msg,"") == "OK")
        {
            jQuery.ajax
            ({		   
                url: url,
                data: {"run_id_str":run_id_str},
                type: "POST",
                async: true,
                success: function(data){
                    jQuery("#gridTable").trigger("reloadGrid");
                    jQuery("#do_destroy").css("display","none");
                    jQuery("#do_restoration").css("display","none");
                    jQuery("#do_all_destroy").css("display","");
                    jQuery("#do_all_restoration").css("display","");
                },
                error: function(data){
                    alert(data.responseText);
                }
            });
        }
    });
});
function doDestroyBatch(){
	
	var url = "/general/workflow/destroy/data/dodestroy.php";
    var DES_FLOW_ID = jQuery("#hidden_flow_id").val();
    var DES_RUN_ID = jQuery("#hidden_run_id").val();
    var DES_RUN_NAME = jQuery("#hidden_run_name").val();
    var DES_TO_ID = jQuery("#hidden_to_id").val();
    var des_begin_time = jQuery("#hidden_begin_time").val();
    var des_end_time = jQuery("#hidden_end_time").val();
    var datastr = {'des_flow_id':DES_FLOW_ID,'des_run_name':DES_RUN_NAME,'des_run_id':DES_RUN_ID,'des_user_id':DES_TO_ID,'des_begin_time':des_begin_time,'des_end_time':des_end_time};

    var msg_batch = td_lang.general.workflow.msg_272;
    var msg_confirm = td_lang.general.workflow.msg_180;
    var msg = msg_batch + "\n" + msg_confirm;
    if(window.prompt(msg,"") == "OK")
    {
		var d = $('<div>').css({
			position: 'fixed',
			left: '50%',
			top: '50%',
			marginLeft: '-50px',
			marginTop: '-20px',
			background: 'white',
			lineHeight: '40px',
			color: '#666',
			fontSize: '14px',
			border: '1px solid #ccc',
			borderRadius: '3px',
			padding: '3px 10px',
			width: '100px',
			height: '40px',
			boxShadow: '0 0 5px #555',
			textAlign: 'center',
			zIndex: 100
		}).appendTo('body');
		var m = $('<div class="pop-panel-overlay"></div>').css({
			width: $(window).width(),
			height: $(window).height()
		}).appendTo('body').show();
		
		d.html('<img src="/static/images/loading_gray_16.gif" align="absMiddle" class="mg5-x"><?=_("正在执行...")?>');
        jQuery.ajax
        ({		   
            url: url,
            data: datastr,
            type: "POST",
            async: true,
            success: function(data){
				d.add(m).remove();
                jQuery("#gridTable").trigger("reloadGrid");
                jQuery("#do_destroy").css("display","none");
                jQuery("#do_restoration").css("display","none");
                jQuery("#do_all_destroy").css("display","");
                jQuery("#do_all_restoration").css("display","");
            },
            error: function(data){
				d.add(m).remove();
                alert(data.responseText);
            }
        });
    }
}
function doRestorationBatch(){
    var url = "/general/workflow/destroy/data/dorestoration.php";
    
    var RES_FLOW_ID = jQuery("#hidden_flow_id").val();
    var RES_RUN_ID = jQuery("#hidden_run_id").val();
    var RES_RUN_NAME = jQuery("#hidden_run_name").val();
    var RES_TO_ID = jQuery("#hidden_to_id").val();
    var res_begin_time = jQuery("#hidden_begin_time").val();
    var res_end_time = jQuery("#hidden_end_time").val();
    
    var msg_batch = td_lang.general.workflow.msg_280;
    var msg_confirm = td_lang.general.workflow.msg_283;
    var msg = msg_batch + "\n" + msg_confirm;
    if(window.prompt(msg,"") == "OK")
    {
        jQuery.ajax
        ({		   
            url: url,
            data: {'res_flow_id':RES_FLOW_ID,'res_run_name':RES_RUN_NAME,'res_run_id':RES_RUN_ID,'res_user_id':RES_TO_ID,'res_begin_time':res_begin_time,'res_end_time':res_end_time},
            type: "POST",
            async: true,
            success: function(data){
                jQuery("#gridTable").trigger("reloadGrid");
                jQuery("#do_destroy").css("display","none");
                jQuery("#do_restoration").css("display","none");
                jQuery("#do_all_destroy").css("display","");
                jQuery("#do_all_restoration").css("display","");
            },
            error: function(data){
                alert(data.responseText);
            }
        });
    }
}
function doDestroyBatch_one(RUN_ID){
    var url = "/general/workflow/destroy/data/dodestroy.php";
    var msg_single = td_lang.general.workflow.msg_128;
    if(window.confirm(msg_single))
    {
        jQuery.ajax
        ({		   
            url: url,
            data: {"run_id_str":RUN_ID},
            type: "POST",
            async: true,
            success: function(data){
                jQuery("#gridTable").trigger("reloadGrid");
                jQuery("#do_destroy").css("display","none");
                jQuery("#do_restoration").css("display","none");
                jQuery("#do_all_destroy").css("display","");
                jQuery("#do_all_restoration").css("display","");
            },
            error: function(data){
                alert(data.responseText);
            }
        });
    }
}
function doRestorationBatch_one(RUN_ID){
    var url = "/general/workflow/destroy/data/dorestoration.php";
    var msg_single = td_lang.general.workflow.msg_282;
    if(window.confirm(msg_single))
    {
        jQuery.ajax
        ({		   
            url: url,
            data: {"run_id_str":RUN_ID},
            type: "POST",
            async: true,
            success: function(data){
                jQuery("#gridTable").trigger("reloadGrid");
                jQuery("#do_destroy").css("display","none");
                jQuery("#do_restoration").css("display","none");
                jQuery("#do_all_destroy").css("display","");
                jQuery("#do_all_restoration").css("display","");
            },
            error: function(data){
                alert(data.responseText);
            }
        });
    }
}
// function delItemData($i_log_id){
    // msg = td_lang.general.workflow.msg_128;
    // if(window.confirm(msg)){
        // var log_id = $i_log_id
        // jQuery.ajax
        // ({
            // type:"post",
            // url:"delete.php",
            // async: true,
            // data:{"log_id":log_id},
            // success: function(data){
                // jQuery("#gridTable").trigger("reloadGrid");
            // },
        // });
    // }
// }
function getSearchStr(){
    var hidden_flow_id = jQuery.trim(jQuery('#FLOW_ID').val());
    var hidden_run_id = jQuery.trim(jQuery('#run_id').val());
    var hidden_run_name = jQuery.trim(jQuery('#run_name').val());
    var hidden_to_id = jQuery.trim(jQuery('#TO_ID').val());
    var hidden_begin_time = jQuery.trim(jQuery('#begin_time').val());
    var hidden_end_time = jQuery.trim(jQuery('#end_time').val());
    
	var searchStr = "flow_id="+jQuery.trim(jQuery('#FLOW_ID').val());
	searchStr += "&run_id="+jQuery.trim(jQuery('#run_id').val());
	searchStr += "&run_name="+jQuery.trim(jQuery('#run_name').val());
    searchStr += "&user_id="+jQuery.trim(jQuery('#TO_ID').val());
	searchStr += "&begin_time="+jQuery.trim(jQuery('#begin_time').val());
	searchStr += "&end_time="+jQuery.trim(jQuery('#end_time').val());
    
    jQuery("#hidden_flow_id").val(hidden_flow_id);
    jQuery("#hidden_run_id").val(hidden_run_id);
    jQuery("#hidden_run_name").val(hidden_run_name);
    jQuery("#hidden_to_id").val(hidden_to_id);
    jQuery("#hidden_begin_time").val(hidden_begin_time);
    jQuery("#hidden_end_time").val(hidden_end_time);
    
    jQuery("#do_destroy").css("display","none");
    jQuery("#do_restoration").css("display","none");
    jQuery("#do_all_destroy").css("display","");
    jQuery("#do_all_restoration").css("display","");
    
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
//查看流程设计图
function view_graph(FLOW_ID)
{
    var myleft=(screen.availWidth-1000)/2;
    window.open("/general/workflow/flow_view.php?FLOW_ID="+FLOW_ID,"","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=1000,height=550,left="+myleft+",top=50");
}
