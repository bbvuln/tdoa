jQuery(document).ready(function(){
	//照熙2013年10月12日15:09:15添加用于控制视图显示按钮显隐↓
	if(pageType=="data_all")
	{
		jQuery("#btn_view_show_normal").css("display","block");
	}
	//照熙2013年10月12日15:09:33添加用于控制视图显示按钮显影↑
    jQuery(document).on("click", '#normalSearchBtn', function(){
		var searchStr = getNormalSearchStr();
		var sizeArr = getGridTableSize();
		//jQuery("#gridTable").GridUnload();
		jQuery.getJSON("data/getcolumns.php?action=get_header&"+searchStr, {
				"date":Date.parse(new Date()),
				"cookieName":cookieName,
				'vWidth':jQuery(document.body).width()-2,
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
					url: "data/getdata.php?action=list_mywork&pageType="+pageType+searchStr,
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
							});
						}
						else
						{
							jQuery("#gridTable").find("tr:even").addClass("alt");
						}
						jQuery('#THE_ID_STR').val('');
						jQuery("#selected_export_form").css("display","none");
						jQuery("#export").css("display","");
						// jQuery("tr[role='rowheader']").find("th:eq(1)").css({"text-align":"left"});
						// jQuery("tr[role='rowheader']").find("th:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
						// jQuery("tr[role='row']").find("td:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
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
    });

    jQuery(document).on("click", '#advSearchBtn', function(){
        var searchStr = getAdvSearchStr();
        var sizeArr = getGridTableSize();
        //jQuery("#gridTable").GridUnload();
        jQuery.getJSON("data/getcolumns.php?action=get_header&"+searchStr, {
			"date":Date.parse(new Date()),
			"cookieName":cookieName,
			'vWidth':jQuery(document.body).width()-2,
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
				url: "data/getdata.php?action=list_mywork&pageType="+pageType+searchStr,
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
                        });
                    }
                    else
                    {
                        jQuery("#gridTable").find("tr:even").addClass("alt");
                    }
                    jQuery('#THE_ID_STR').val('');
                    jQuery("#selected_export_form").css("display","none");
                    jQuery("#export").css("display","");
					// jQuery("tr[role='rowheader']").find("th:eq(1)").css({"text-align":"left"});
					// jQuery("tr[role='rowheader']").find("th:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
					// jQuery("tr[role='row']").find("td:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
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

    });

	jQuery(document).on('click', "#toAdvSearch", function(){
		jQuery('#search_para').val('');
		jQuery('.search_adv').css('display', 'block');
		jQuery('.search_normal').css('display', 'none');
	});
	jQuery(document).on('click', '#toNormalSearch', function(){
		jQuery('.search_normal').css('display', 'block');
		jQuery('.search_adv').css('display', 'none');
	});

});
function getNormalSearchStr(){
	var searchStr = "&searchType=normal";
	searchStr += "&search_para="+encodeURIComponent(jQuery.trim(jQuery('#search_para').val()));
	return 	searchStr;
}
function getAdvSearchStr(){
    var adv_search_field_map = {
        "todo"		: ['flow_id', 'run_name', 'time_out', 'work_level'],
		"pending"	: ['flow_id', 'run_name'],
        "concern"	: ['flow_id', 'run_name'],
        "settles"	: ['flow_id', 'run_name'],
		"view": ['flow_id', 'run_name'],
        "instrust"	: ['flow_id', 'run_name', 'intrust_man'],
        "data_all"  : ['flow_id', 'run_name', 'run_id','prcs_flag']
    };
	var advSearchFieldArr = eval("adv_search_field_map."+pageType);
    var searchStr = "&searchType=adv";
    jQuery.each(advSearchFieldArr, function(i, v){
        searchStr += "&"+v+"=";
        if(v == 'flow_id' && jQuery.trim(jQuery('#flow_name').val()) == ""){
        	jQuery('#'+v).val('');
        }
        if(v == 'run_name'){
            searchStr += encodeURIComponent(jQuery.trim(jQuery('#run_name').val()));
        }else{
            searchStr += jQuery('#'+v).val();
        }
    });
    return searchStr;
}
