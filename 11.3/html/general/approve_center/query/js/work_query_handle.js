jQuery(document).ready(function(){ 
	jQuery('#do_search').click(function(){
    var searchStr = getSearchStr();
    var sizeArr = getLogGridTableSize();
    jQuery.getJSON("data/getcolumns.php?"+searchStr, {
			"date":Date.parse(new Date()), 
			"cookie_name":cookieName,
            'width':jQuery(document.body).width()-2,
            'pageType':pageType,
            'action':'get_header'
		}, 
		function(columns){
			jQuery("#gridTable").GridUnload();
			jQuery.each(columns.fields, function(i,t){
				if(t.sortable == ""){
					columns.fields[i].sortable = false;
				}else if(t.checkable == ""){
					columns.fields[i].checkable = false;
				}else if(t.resizable == ""){
					columns.fields[i].resizable = false;
				}
				columns.fields[i].hidden = (t.hidden === 'true' ? true : false);
			});
			
			jQuery("#gridTable").jqGrid({
				datatype:"json",
				mtype: 'POST',//注释掉此行可看到传递到后台的参数
				url: 'data/getdata.php?'+searchStr,
				height: sizeArr.vHeight,
				width: sizeArr.vWidth,
				shrinkToFit: false, //用于控制列宽是否按比例进行计算
				colModel:columns.fields,
				//sortname:'run_id',
				sortorder:'desc',
				viewrecords:true,
				multiselect: true,
				multiselectWidth: 30,
				subGridWidth: 30,
				rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
				rowList:[10,20,30,40,50,60,70,80,90,100],
                onSelectRow:function(){
                    var run_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                    jQuery('#RUN_ID_STR').val(run_id_str);
                    if(run_id_str != "")
                    {
                        jQuery("#selected_query_export_form").css("display","inline");
                        jQuery("#query_export").css("display","none");
                    }
                    else
                    {
                        jQuery("#selected_query_export_form").css("display","none");
                        jQuery("#query_export").css("display","");
                    }
                },
                onSelectAll:function(){
                    var run_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                    jQuery('#RUN_ID_STR').val(run_id_str);
                    if(run_id_str != "")
                    {
                        jQuery("#selected_query_export_form").css("display","inline");
                        jQuery("#query_export").css("display","none");
                    }
                    else
                    {
                        jQuery("#selected_query_export_form").css("display","none");
                        jQuery("#query_export").css("display","");
                    }
                },
				pager:"#pager",
				loadComplete:function(xhr){
					jQuery("tr[role='rowheader']").find("th:eq(1)").css({"text-align":"left"});
					jQuery("tr[role='rowheader']").find("th:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
					jQuery("tr[role='row']").find("td:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
                    jQuery('#RUN_ID_STR').val('');
                    jQuery('#THE_FLOW_ID').val(jQuery.trim(jQuery('#FLOW_ID').val()));
                    jQuery("#selected_query_export_form").css("display","none");
                    jQuery("#query_export").css("display","");
					jQuery("#gridTable").find("tr:even").addClass("alt");
					jQuery('#current_page').html(jQuery(this).getGridParam("page"));
                    jQuery('#gopage_url').val(jQuery(this).getGridParam("url"));
                    jQuery('#gopage').val(jQuery(this).getGridParam("page"));
					jQuery('#total_page').html(jQuery('#sp_1_pager').html());
					jQuery('#total_records').html(jQuery(this).getGridParam("records"));
					if(jQuery(this).getGridParam("records") == 0)
					{
						jQuery("#sorry").attr({style: "margin-top:55px; display:block;" });
						jQuery("#gridTable").jqGrid('setGridHeight',0);
		
					}else{
						sizeArr = getLogGridTableSize();
						sizeArr.vHeight = sizeArr.vHeight - 45;
						jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
						jQuery("#sorry").css('display', 'none');
					}
					
					jQuery("select.ui-pg-selbox").change(function(){
						jQuery.cookie(cookieName+"_perpage",jQuery(this).val(),{expires:30});
					});
					jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').css({
						"display":"inline-block",
						"margin-left": "4px",
						"cursor":"pointer"
					});
					jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').click(function(){
						var detail_block = jQuery(this).parent().find('.detail-block');
						if(detail_block.css('display') == "block"){
							detail_block.css('display', 'none');
							jQuery(this).removeClass("ui-icon-minus");
							jQuery(this).addClass("ui-icon-plus");
						}else{
							detail_block.css('display','block');	
							jQuery(this).removeClass("ui-icon-plus");
							jQuery(this).addClass("ui-icon-minus");
						}
						return false;	
					});
					jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.text_expand_icon').click(function(){
						var detail_block = jQuery(this).parent().find('.detail-block');
						if(detail_block.css('display') == "block"){
							detail_block.css('display', 'none');
							jQuery(this).parent().find('.ui-icon').removeClass("ui-icon-minus");
							jQuery(this).parent().find('.ui-icon').addClass("ui-icon-plus");
						}else{
							detail_block.css('display','block');	
							jQuery(this).parent().find('.ui-icon').removeClass("ui-icon-plus");
							jQuery(this).parent().find('.ui-icon').addClass("ui-icon-minus");
						}
						return false;	
					});
					jQuery('.comment').tooltip('hide');
					loadPager();
				},
				resizeStop:function(newWidth, index){
					var colName = jQuery("#gridTable").getGridParam('colModel')[index].name;
					jQuery.cookie(cookieName+"_"+colName+"_width",newWidth,{expires:30});
				}
			});		
			//修复pc精灵打开工作查询等模块，精灵窗口大小会改变一次，但表格宽度计算有误的情况，强制resize计算。
			$('body').resize()
		});
//	    jQuery("#gridTable").jqGrid('setGridParam',{
//	        url:"data/getdata.php?"+searchStr,
//	        page:1
//	    }).trigger('reloadGrid');  
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
	var selectVal = jQuery.trim(jQuery('#FLOW_QUERY_TYPE').val());
    var searchStr = "action=list_allwork";
	searchStr +="&flow_id="+jQuery.trim(jQuery('#FLOW_ID').val());
	searchStr +="&run_id="+ jQuery.trim(jQuery('#RUN_ID').val());
	searchStr +="&run_name="+ encodeURIComponent(jQuery.trim(jQuery('#run_name').val()));
	searchStr +="&flow_query_type="+ selectVal;
	searchStr +="&to_id="+ jQuery.trim(jQuery('#TO_ID').val());
	searchStr +="&flow_status="+ jQuery.trim(jQuery('#FLOW_STATUS').val());
	searchStr +="&end_time="+ jQuery.trim(jQuery('#end_time').val());
	searchStr +="&begin_time="+ jQuery.trim(jQuery('#begin_time').val());
	searchStr +="&work_level="+ jQuery.trim(jQuery('#work_level').val());
	if(selectVal == 10)//离职人员
	{
		searchStr +="&leave_user_id="+ jQuery('#LEAVE_QUERY_TYPE').find('option:selected').val();
	}else if(selectVal == 11)
	{
		searchStr +="&search_begin_dept="+ jQuery('#BEGIN_DEPT_NAME').find('option:selected').val();//发起人的部门
	}
	return 	searchStr;
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

function doExportBatch()
{
    var url = "/general/approve_center/query/data/doexport.php";
    document.form_export.action = url;
    document.form_export.submit();
}