jQuery(document).ready(function(){
	var sizeArr = getLogGridTableSize();
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
		      	//mtype: 'POST',//注释掉此行可看到传递到后台的参数
				url: "data/getdata.php?pageType="+pageType,
				height: sizeArr.vHeight,
				width: sizeArr.vWidth,
				shrinkToFit: false, //用于控制列宽是否按比例进行计算
				colModel:columns.fields,
				sortname:'',
				sortorder:'asc',
				viewrecords:true,
				subGridWidth: 30,
				rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
				rowList:[10,20,30,40,50,60,70,80,90,100],
				pager:"#pager",
				loadComplete:function(xhr){
					jQuery("tr[role=row]").each(function (){
						 jQuery(this).removeClass("ui-state-highlight");
					
					});
					jQuery("td[aria-describedby=gridTable_OPERATION]").removeAttr("title");  
					jQuery("#gridTable").find("tr:even").addClass("alt");
					jQuery('#current_page').html(jQuery(this).getGridParam("page"));
                    jQuery('#gopage_url').val(jQuery(this).getGridParam("url"));
                    jQuery('#gopage').val(jQuery(this).getGridParam("page"));
					jQuery('#total_page').html(jQuery('#sp_1_pager').html());
					jQuery('#total_records').html(jQuery(this).getGridParam("records"));
					jQuery("select.ui-pg-selbox").change(function(){
						jQuery.cookie(cookieName+"_perpage",jQuery(this).val(),{expires:30});
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
		          	loadPager();
				},
				resizeStop:function(newWidth, index){				
					var colName = jQuery("#gridTable").getGridParam('colModel')[index].name;
					jQuery.cookie(cookieName+"_"+colName+"_width",newWidth,{expires:30});
				}
			});
	
		});
		
	jQuery(window).resize(function(){
		var sizeArr = getLogGridTableSize();
		jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
		jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);

	});
	
});