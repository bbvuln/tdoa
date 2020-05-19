jQuery(document).ready(function(){
	var sizeArr = getGridTableSize();
    var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
    if(MENU_FLOW_ID == ''){
        jQuery.getJSON("data/getcolumns.php", {
                "date":Date.parse(new Date()),
                "cookieName":cookieName,
                'vWidth':jQuery(document.body).width()-2,
                'pageType':pageType
            },
            function(columns){
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
                    url: "data/getdata.php?pageType="+pageType,
                    height: sizeArr.vHeight,
                    width: sizeArr.vWidth,
                    shrinkToFit: false, //用于控制列宽是否按比例进行计算
                    colModel:columns.fields,
                    sortname:'run_id',
                    sortorder:'desc',
                    viewrecords:true,
                    multiselect: true,
                    multiselectWidth: 30,
                    subGridWidth: 30,
                    rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
                    rowList:[10,20,30,40,50,60,70,80,90,100],
                    onSelectRow:function(){
                        var the_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                        jQuery('#THE_ID_STR').val(the_id_str);
                        if(the_id_str != "")
                        {
                            jQuery("#selected_export_form").css("display","inline");
                            jQuery("#export").css("display","none");
                        }
                        else
                        {
                            jQuery("#selected_export_form").css("display","none");
                            jQuery("#export").css("display","");
                        }
                    },
                    onSelectAll:function(){
                        var the_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                        jQuery('#THE_ID_STR').val(the_id_str);
                        if(the_id_str != "")
                        {
                            jQuery("#selected_export_form").css("display","inline");
                            jQuery("#export").css("display","none");
                        }
                        else
                        {
                            jQuery("#selected_export_form").css("display","none");
                            jQuery("#export").css("display","");
                        }
                    },
                    pager:"#pager",
                    loadBeforeSend:function(xhr,settings){
                        var number = jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10;
                        number = parseInt(number)*10;
                        jQuery("#gridTable").setGridParam({rowNum:number});
                    },
                    loadComplete:function(xhr){
                        var number = jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10;
                        jQuery("#gridTable").setGridParam({rowNum:number});
                        if(jQuery(this).find("input[name='TR_ID']").length > 0)
                        {
                            var I = 0;
                            var key ;
                            jQuery("#gridTable").find('tr').each(function(){
                                I++;
                                if( I != 1)
                                {
                                    key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
                                    if(key%2 == 0)
                                    {
                                        jQuery(this).addClass("alt");
                                    }
                                }
                                collapse(I);
                            });
                        }
                        else
                        {
                            jQuery("#gridTable").find("tr:even").addClass("alt");
                        }
                        // jQuery("tr[role='rowheader']").find("th:eq(1)").css({"text-align":"left"});
                        // jQuery("tr[role='rowheader']").find("th:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
                        // jQuery("tr[role='row']").find("td:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
                        // jQuery("#gridTable").find("tr:even").addClass("alt");
                        jQuery('#THE_ID_STR').val('');
                        jQuery("#selected_export_form").css("display","none");
                        jQuery("#export").css("display","");
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
            });
    }

	jQuery.getJSON('/general/workflow/get_flow_list.inc.php', {"FLOW_ID":MENU_FLOW_ID,root:true,action:3}, function(jsonData){
		jQuery("#flow_id").html("");
		jQuery.each(jsonData,function(i,t){
			jQuery("#flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
		});
		jQuery("#flow_id").combobox();
        if(MENU_FLOW_ID != ''){
            jQuery('#search_para').val('');
            jQuery('.search_adv').css('display', 'block');
            jQuery('.search_normal').css('display', 'none');
            jQuery('#advSearchBtn').click();
        }
	});
	jQuery(document).on('keydown', '#search_para', function(e){
		if(e.keyCode == 13){
		   jQuery('#normalSearchBtn').click();
		}	
	});
	jQuery(document).on('keydown', '#flow_name,#run_name', function(e){
		if(e.keyCode == 13){
			if(jQuery(this).id == 'flow_name' && jQuery('#flow_id').val() == ""){
				return false;
			}
		   jQuery('#advSearchBtn').click();
		}	
	});
});
parent.setSelection = function(run_id){
	var tr_id = jQuery("#gridTable").find("td[aria-describedby='gridTable_run_id'][title='"+run_id+"']").parent().attr("id");
	jQuery("#gridTable").jqGrid('setSelection',tr_id);
}
parent.refreshGrid = function(){
	jQuery("#gridTable").trigger("reloadGrid");
}
parent.hideForm = function(){
	jQuery(window.parent.document).find('#workflow-form-frame').css('display', 'none');
	jQuery(window.parent.document).find('#workflow-form-frame').attr("src", '');
	jQuery(window.parent.document).find('.work-nav').show();	
	jQuery("#gridTable").trigger("reloadGrid");
}
function changeFlow(){
	var flow_id = jQuery("#FLOW_ID").val();
	jQuery('#advSearchBtn').click();
	
}
function collapse(flag)
{
    var I = 0;
    var key ;
    var K = 0;
    jQuery("#gridTable").find('tr').each(function(){
        I++;
        if( I != 1)
        {
            key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
            if(key == flag)
            {
                if(K == 0)
                {
                    var tdhtml = jQuery(this).find("td").eq(2).find("a").html();
                    if(typeof(tdhtml)!='undefined' && tdhtml.indexOf('icon-plus') !== -1)
                    {
                        jQuery(this).find("td").eq(2).find("a").html("<i class=\"icon-minus\"></i>").attr('title', '点击收起');
                        collapse_show(flag);
                    }else{
                        jQuery(this).find("td").eq(2).find("a").html("<i class=\"icon-plus\"></i>").attr('title', '点击展开');
                        collapse_hide(flag);
                    }
                }
                K++;
            }
        }
    });
}
function collapse_show(flag)
{
    var I = 0;
    var key ;
    var K = 0;
    jQuery("#gridTable").find('tr').each(function(){
        I++;
        if( I != 1)
        {
            key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
            if(key == flag)
            {
                if(K != 0)
                {
                        jQuery(this).show();    
                }
                K++;
            }
        }
    });
}
function collapse_hide(flag)
{
    var I = 0;
    var key ;
    var K = 0;
    jQuery("#gridTable").find('tr').each(function(){
        I++;
        if( I != 1)
        {
            key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
            if(key == flag)
            {
                if(K != 0)
                {
                        jQuery(this).hide();
                }
                K++;
            }
        }
    });
}

function work_run_restore_single_work(run_id, prcs_key_id){
    var url="/module/workflow/engine/re_pause_work.php?run_id_str="+run_id+"&prcs_key_id_str="+prcs_key_id;
    jQuery.get(url,{},function(data){
        alert(td_lang.general.workflow.msg_314);//工作已恢复
        jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
    });
}