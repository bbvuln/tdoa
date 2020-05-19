jQuery(document).ready(function(){
	var flow_id=jQuery("#hideId").val();
	var sizeArr = getLogGridTableSize();
    jQuery.getJSON("/general/workflow/get_flow_list.inc.php",{"action":0,"root":true},function(jsonData){
        $("#FLOW_ID").html("");
        $.each(jsonData,function(i,t){
            $("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
        });
        $("#FLOW_ID").combobox();
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
			jQuery("#gridTable").jqGrid({
				datatype:"json",
				mtype: 'POST',//注释掉此行可看到传递到后台的参数
				url: "data/getdata.php?pageType="+pageType+"&flow_id="+flow_id,
				height: sizeArr.vHeight,
				width: sizeArr.vWidth,
				shrinkToFit: false, //用于控制列宽是否按比例进行计算
				colModel:columns.fields,//基本参数设置
				sortname:'rid',
				sortorder:'desc',
				viewrecords:true,
				//multiselect: true,     //复选框
				//multiselectWidth: 30,	 //复选框所占宽度
				subGridWidth: 30,		 
				rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
				rowList:[10,20,30,40,50,60,70,80,90,100],
				pager:"#pager",
				loadComplete:function(xhr){
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
					jQuery("td[aria-describedby='gridTable_OPERATION']").removeAttr("title");
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
						jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
						jQuery("#sorry").css('display', 'none');
					}
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
					loadPager();
				},
				resizeStop:function(newWidth, index){
					var colName = jQuery("#gridTable").getGridParam('colModel')[index].name;
					jQuery.cookie(cookieName+"_"+colName+"_width",newWidth,{expires:30});
				}
			});
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
		jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
		jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
	});
	jQuery('#do_search').click(function(){
	    var searchStr = getSearchStr();
	    jQuery("#gridTable").jqGrid('setGridParam',{
	        url:"data/getdata.php?"+searchStr,
	        page:1
	    }).trigger('reloadGrid');  
	});
});

function newReport(){
    window.location.href="edit.php?FLOW_ID=";
}

function getSearchStr(){
	var searchStrflow = jQuery.trim(jQuery('#FLOW_ID').val());
	if(searchStrflow =="all")
	{
		searchStrflow = "";
	}
	var searchStr = "flow_id="+searchStrflow;
	searchStr += "&r_name="+jQuery.trim(jQuery('#r_name').val());
	return 	searchStr;
}
function deletetodo(i_rid)
{
	var rid=i_rid;
	msg = td_lang.general.workflow.msg_128;
	if(window.confirm(msg)){
		jQuery.ajax({
		    type:"post",
		    url:"/general/system/workflow/flow_report/data/dodelete.php",
		    data:{"rid":rid},
		    success:function(){
		    	jQuery("#gridTable").trigger("reloadGrid");
		    },
		});
	}
}
function refrashThetable(){
	jQuery("#gridTable").trigger("reloadGrid");
}