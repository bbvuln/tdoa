jQuery(document).ready(function(){
	var sizeArr = getLogGridTableSize();
    /*按照选择填选时间
     *
     */
    $.getJSON("/general/approve_center/get_flow_list.inc.php",{"action":6,"root":true},function(jsonData){
        $("#FLOW_ID").html("");
        $.each(jsonData,function(i,t){
            $("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
        });
        $("#FLOW_ID").combobox();
    });

	jQuery(document).on("click", ".dropdown-menu", function()
	{

		var inteligent_id = jQuery("#new_btn_time").find('span').attr("data_value");
		var now = new Date();
		var year = now.getFullYear();//年
		if(inteligent_id=="new-this-year")
		{
			var timeArray = getThisYear(true);
			jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="new-this-quarterly")
		{

            var timeArray = getThisQuarterly(true);
			jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="new-prev-quarterly")
		{
			var timeArray = getPrevQuarterly(true);
            jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="new-prev-year")
		{
            var timeArray = getPrevYear(true);
			jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="new-this-month")
		{
            var timeArray = getThisMonth(true);
			jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="new-prev-month")
		{
            var timeArray = getPrevMonth(true);
			jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="new-this-week")
        {
            var timeArray = getThisWeek(true);
            jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="new-prev-week")
        {
            var timeArray = getPrevWeek(true);
            jQuery("#new_begin_time").val(timeArray[0]);
			jQuery("#new_end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="new-all-clear")
		{
			jQuery("#new_begin_time").val("");
			jQuery("#new_end_time").val("");
		}
	});

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
			var FLOW_ID = jQuery("#FLOW_ID").val();
		    var TAB_TYPE = jQuery("#TAB_TYPE").val();
		    var USER_NAME = jQuery("#user_name").val()==''?'':jQuery("#user_name").val();
		    var WAS_USER_NAME = jQuery("#was_user_name").val()==''?'':jQuery("#was_user_name").val();
		    var QUERY_USER_ID = jQuery("input[name='QUERY_USER_ID']").val()==''?'':jQuery("input[name='QUERY_USER_ID']").val();
		    var WAS_QUERY_USER_ID = jQuery("input[name='WAS_QUERY_USER_ID']").val()==''?'':jQuery("input[name='WAS_QUERY_USER_ID']").val();

			var url = 'data/getdata.php?FLOW_ID='+FLOW_ID+'&TAB_TYPE='+TAB_TYPE+'&USER_NAME='+USER_NAME+'&WAS_USER_NAME='+WAS_USER_NAME+'&QUERY_USER_ID='+QUERY_USER_ID+'&WAS_QUERY_USER_ID='+WAS_QUERY_USER_ID+'&pageType='+pageType;
			jQuery("#gridTable").jqGrid({
				datatype:"json",
				mtype: 'POST',//注释掉此行可看到传递到后台的参数
				url: url,
				height: sizeArr.vHeight - 40,
				width: sizeArr.vWidth,
				shrinkToFit: false, //用于控制列宽是否按比例进行计算
				colModel:columns.fields,
				sortname:'TIME',
				sortorder:'DESC',
				viewrecords:true,
				multiselect: true,
				multiselectWidth: 30,
				subGridWidth: 30,
				rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
				rowList:[10,20,30,40,50,60,70,80,90,100],
				pager:"#pager",
				loadComplete:function(xhr){
					jQuery("td[aria-describedby=gridTable_OPERATION]").removeAttr("title");
					//jQuery("tr[role='rowheader']").find("th:eq(1)").css({"text-align":"left"});
					//jQuery("tr[role='rowheader']").find("th:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
					//jQuery("tr[role='row']").find("td:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
					jQuery("#gridTable").find("tr:even").addClass("alt");
                    jQuery("#gridTable").addClass("word_wrap");
					jQuery('#current_page').html(jQuery(this).getGridParam("page"));
                    jQuery('#gopage_url').val(jQuery(this).getGridParam("url"));
                    jQuery('#gopage').val(jQuery(this).getGridParam("page"));
					jQuery('#total_page').html(jQuery('#sp_1_pager').html());
					jQuery('#total_records').html(jQuery(this).getGridParam("records"));
					jQuery("select.ui-pg-selbox").change(function(){
						jQuery.cookie(cookieName+"_perpage",jQuery(this).val(),{expires:30});
					});
					jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').css({
						"display":"inline-block",
						"margin-left": "4px",
						"cursor":"pointer"
					});
                    if(jQuery(this).getGridParam("records") == 0)
					{
						jQuery("#sorry").attr({style: "margin-top:55px;display:block" });
						jQuery("#gridTable").jqGrid('setGridHeight',0);
					}
					else
					{
						sizeArr = getLogGridTableSize();
						jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight - 40);
						jQuery("#sorry").css('display', 'none');
					}
					jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').click(function(){
						var detail_block = jQuery(this).parent().find('.detail-block');
						if(detail_block.css('display') == "block"){
							detail_block.css('display', 'none');
							jQuery(this).removeClass("ui-icon-minus");
							jQuery(this).addClass("ledui-icon-plus");
						}else{
							detail_block.css('display','block');
							jQuery(this).removeClass("ui-icon-plus");
							jQuery(this).addClass("ui-icon-minus");
						}
						return false;
					});
					loadPager();

                    jQuery("#do_all_delete").css("display", "");
                    jQuery("#do_all_start").css("display", "");
                    jQuery("#do_all_stop").css("display", "");
                    jQuery("#do_delete").css("display", "none");
                    jQuery("#do_start").css("display", "none");
                    jQuery("#do_stop").css("display", "none");
				},
                onSelectRow:function(){
                    var rule_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                    if(rule_id_str != "")
                    {
                        jQuery("#do_all_delete").css("display", "none");
                        jQuery("#do_all_start").css("display", "none");
                        jQuery("#do_all_stop").css("display", "none");
                        jQuery("#do_delete").css("display", "");
                        jQuery("#do_start").css("display", "");
                        jQuery("#do_stop").css("display", "");
                    }
                    else
                    {
                        jQuery("#do_all_delete").css("display", "");
                        jQuery("#do_all_start").css("display", "");
                        jQuery("#do_all_stop").css("display", "");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }
                },
                onSelectAll:function(){
                    var rule_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                    if(rule_id_str != "")
                    {
                        jQuery("#do_all_delete").css("display", "none");
                        jQuery("#do_all_start").css("display", "none");
                        jQuery("#do_all_stop").css("display", "none");
                        jQuery("#do_delete").css("display", "");
                        jQuery("#do_start").css("display", "");
                        jQuery("#do_stop").css("display", "");
                    }
                    else
                    {
                        jQuery("#do_all_delete").css("display", "");
                        jQuery("#do_all_start").css("display", "");
                        jQuery("#do_all_stop").css("display", "");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }
                },
				resizeStop:function(newWidth, index){
					var colName = jQuery("#gridTable").getGridParam('colModel')[index].name;
					jQuery.cookie(cookieName+"_"+colName+"_width",newWidth,{expires:30});
				}
			});
		});
	jQuery('#flow_name').typeahead({
	    source: function (query, process) {
	        return jQuery.get('/general/workflow/list/data/getflow.php', { query: query }, function (data) {
	        	if(data.options.length == 0){
	        		jQuery('#flow_id').attr('value', "-1");
	        	}
	        	var resultList = jQuery(data.options).map(function (item) {
                    var aItem = { id: data.options[item].flow_id, name: data.options[item].flow_name, sort_name: data.options[item].flow_sort_name};
                    return JSON.stringify(aItem);
                });
                return process(resultList);
	        });
	    },
	    minLength : 1,
	    items:10000000,
	    highlighter: function (obj) {
	        var item = JSON.parse(obj);
	        var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
	        return item.sort_name+"<span class='flow-name-span'>&nbsp;</span>"+item.name.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
	            return '<strong>' + match + '</strong>'
	        })
	    },
	    updater: function (obj) {
	        var item = JSON.parse(obj);
	        jQuery('#flow_id').attr('value', item.id);
	        return item.name;
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
	jQuery(window).resize(function(){
		var sizeArr = getLogGridTableSize();
        if(jQuery("#gridTable").getGridParam("records") == 0)
		{
			jQuery("#gridTable").jqGrid('setGridHeight',0);
		}
        else
        {
            jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
            jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight - 40);
        }
	});
});

//查询
function check_form()
{
	var FLOW_ID = jQuery("#FLOW_ID").val();
    var TAB_TYPE = jQuery("#TAB_TYPE").val();
    var USER_NAME = jQuery("#user_name").val()==''?'':jQuery("#user_name").val();
    var WAS_USER_NAME = jQuery("#was_user_name").val()==''?'':jQuery("#was_user_name").val();
    var QUERY_USER_ID = jQuery("input[name='QUERY_USER_ID']").val()==''?'':jQuery("input[name='QUERY_USER_ID']").val();
    var WAS_QUERY_USER_ID = jQuery("input[name='WAS_QUERY_USER_ID']").val()==''?'':jQuery("input[name='WAS_QUERY_USER_ID']").val();
    var sizeArr = getLogGridTableSize();
    var login_user_id = jQuery("#login_user_id").val();
    var tab_type = jQuery("#TAB_TYPE").val();
    var is_admin = jQuery("#isAdmin").val();

    jQuery.getJSON("data/getcolumns.php", {
			"date":Date.parse(new Date()),
			"cookieName":cookieName,
			'vWidth':jQuery(document.body).width()-2,
			'pageType':pageType,
            'login_user_id':login_user_id,
            'tab':tab_type
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

			var url = 'data/getdata.php?FLOW_ID='+FLOW_ID+'&TAB_TYPE='+TAB_TYPE+'&USER_NAME='+USER_NAME+'&WAS_USER_NAME='+WAS_USER_NAME+'&QUERY_USER_ID='+QUERY_USER_ID+'&WAS_QUERY_USER_ID='+WAS_QUERY_USER_ID+'&pageType='+pageType;
			jQuery("#gridTable").jqGrid({
				datatype:"json",
				mtype: 'POST',//注释掉此行可看到传递到后台的参数
				url: url,
				height: sizeArr.vHeight - 40,
				width: sizeArr.vWidth,
				shrinkToFit: false, //用于控制列宽是否按比例进行计算
				colModel:columns.fields,
				sortname:'TIME',
				sortorder:'DESC',
				viewrecords:true,
				multiselect: true,
				multiselectWidth: 30,
				subGridWidth: 30,
				rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
				rowList:[10,20,30,40,50,60,70,80,90,100],
				pager:"#pager",
				loadComplete:function(xhr){
					jQuery("td[aria-describedby=gridTable_OPERATION]").removeAttr("title");
					//jQuery("tr[role='rowheader']").find("th:eq(1)").css({"text-align":"left"});
					//jQuery("tr[role='rowheader']").find("th:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
					//jQuery("tr[role='row']").find("td:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
					jQuery("#gridTable").find("tr:even").addClass("alt");
                    jQuery("#gridTable").addClass("word_wrap");
					jQuery('#current_page').html(jQuery(this).getGridParam("page"));
                    jQuery('#gopage_url').val(jQuery(this).getGridParam("url"));
                    jQuery('#gopage').val(jQuery(this).getGridParam("page"));
					jQuery('#total_page').html(jQuery('#sp_1_pager').html());
					jQuery('#total_records').html(jQuery(this).getGridParam("records"));
					jQuery("select.ui-pg-selbox").change(function(){
						jQuery.cookie(cookieName+"_perpage",jQuery(this).val(),{expires:30});
					});
					jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').css({
						"display":"inline-block",
						"margin-left": "4px",
						"cursor":"pointer"
					});
                    if(jQuery(this).getGridParam("records") == 0)
					{
						jQuery("#sorry").attr({style: "margin-top:55px;display:block" });
						jQuery("#gridTable").jqGrid('setGridHeight',0);
					}
					else
					{
						sizeArr = getLogGridTableSize();
						jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight - 40);
						jQuery("#sorry").css('display', 'none');
					}
					jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').click(function(){
						var detail_block = jQuery(this).parent().find('.detail-block');
						if(detail_block.css('display') == "block"){
							detail_block.css('display', 'none');
							jQuery(this).removeClass("ui-icon-minus");
							jQuery(this).addClass("ledui-icon-plus");
						}else{
							detail_block.css('display','block');
							jQuery(this).removeClass("ui-icon-plus");
							jQuery(this).addClass("ui-icon-minus");
						}
						return false;
					});
					loadPager();

                    if(is_admin == "isAdmin")
                    {
                        jQuery("#do_all_delete").css("display", "");
                        jQuery("#do_all_start").css("display", "");
                        jQuery("#do_all_stop").css("display", "");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }
                    else if(is_admin == "noAdmin" && tab_type == "tab0")
                    {
                        jQuery("#do_all_delete").css("display", "none");
                        jQuery("#do_all_start").css("display", "none");
                        jQuery("#do_all_stop").css("display", "none");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }
				},
                onSelectRow:function(){
                    var rule_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                    if(rule_id_str != "")
                    {
                        jQuery("#do_all_delete").css("display", "none");
                        jQuery("#do_all_start").css("display", "none");
                        jQuery("#do_all_stop").css("display", "none");
                        jQuery("#do_delete").css("display", "");
                        jQuery("#do_start").css("display", "");
                        jQuery("#do_stop").css("display", "");
                    }
                    else
                    {
                        jQuery("#do_all_delete").css("display", "");
                        jQuery("#do_all_start").css("display", "");
                        jQuery("#do_all_stop").css("display", "");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }

                    if(is_admin == "noAdmin" && tab_type == "tab0")
                    {
                        jQuery("#do_all_delete").css("display", "none");
                        jQuery("#do_all_start").css("display", "none");
                        jQuery("#do_all_stop").css("display", "none");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }
                },
                onSelectAll:function(){
                    var rule_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                    if(rule_id_str != "")
                    {
                        jQuery("#do_all_delete").css("display", "none");
                        jQuery("#do_all_start").css("display", "none");
                        jQuery("#do_all_stop").css("display", "none");
                        jQuery("#do_delete").css("display", "");
                        jQuery("#do_start").css("display", "");
                        jQuery("#do_stop").css("display", "");
                    }
                    else
                    {
                        jQuery("#do_all_delete").css("display", "");
                        jQuery("#do_all_start").css("display", "");
                        jQuery("#do_all_stop").css("display", "");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }

                    if(is_admin == "noAdmin" && tab_type == "tab0")
                    {
                        jQuery("#do_all_delete").css("display", "none");
                        jQuery("#do_all_start").css("display", "none");
                        jQuery("#do_all_stop").css("display", "none");
                        jQuery("#do_delete").css("display", "none");
                        jQuery("#do_start").css("display", "none");
                        jQuery("#do_stop").css("display", "none");
                    }
                },
				resizeStop:function(newWidth, index){
					var colName = jQuery("#gridTable").getGridParam('colModel')[index].name;
					jQuery.cookie(cookieName+"_"+colName+"_width",newWidth,{expires:30});
				}
			});
		});
	// var url = 'data/getdata.php?FLOW_ID='+FLOW_ID+'&TAB_TYPE='+TAB_TYPE+'&USER_NAME='+USER_NAME+'&WAS_USER_NAME='+WAS_USER_NAME+'&QUERY_USER_ID='+QUERY_USER_ID+'&WAS_QUERY_USER_ID='+WAS_QUERY_USER_ID+'&pageType='+pageType;
    // jQuery("#gridTable").jqGrid('setGridParam',{
        // url:url,
        // page:1
    // }).trigger('reloadGrid');

    jQuery("#hidden_flow_id").val(FLOW_ID);
    jQuery("#hidden_tab_type").val(TAB_TYPE);
    jQuery("#hidden_user_name").val(USER_NAME);
    jQuery("#hidden_was_user_name").val(WAS_USER_NAME);
    jQuery("#hidden_query_user_id").val(QUERY_USER_ID);
    jQuery("#hidden_was_query_user_id").val(WAS_QUERY_USER_ID);
}


//关闭
function operating_close(rule_id)
{
	var url = 'data/close.php';
	jQuery.ajax({
		url: url,
		data: {"rule_id":rule_id},
		type: "POST",
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

//开启
function operating_open(rule_id)
{
	var url = 'data/open.php';
	jQuery.ajax({
		url: url,
		data: {"rule_id":rule_id},
		type: "POST",
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
//删除
function operating_delete(rule_id)
{
    if(!delete_confirm())
        return;

	var url = 'data/delete.php';
	jQuery.ajax({
		url: url,
		data: {"rule_id":rule_id},
		type: "POST",
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
