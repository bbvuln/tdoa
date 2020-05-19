jQuery(document).ready(function(){
	var sizeArr = getLogGridTableSize();
    /*按照选择填选时间
     *
     */
    $.getJSON("/general/workflow/get_flow_list.inc.php",{"action":5,"root":true},function(jsonData){
        $("#FLOW_ID").html("");
        $.each(jsonData,function(i,t){
            $("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
            $("#DEL_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
            $("#EXP_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
        });
        $("#FLOW_ID").combobox();
        $("#DEL_FLOW_ID").combobox();
        $("#EXP_FLOW_ID").combobox();
    });

	jQuery(document).on("click", "#time_dropdown_menu", function()
	{
		var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
		var now = new Date();
		var year = now.getFullYear();//年
		if(inteligent_id=="this-year")
		{
			var timeArray = getThisYear(false);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="this-quarterly")
		{
			
            var timeArray = getThisQuarterly(false);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-quarterly")
		{
			var timeArray = getPrevQuarterly(false);
            jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-year")
		{
            var timeArray = getPrevYear(false);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="this-month")
		{
            var timeArray = getThisMonth(false);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-month")
		{
            var timeArray = getPrevMonth(false);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="this-week")
        {
            var timeArray = getThisWeek(false);
            jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="prev-week")
        {
            var timeArray = getPrevWeek(false);
            jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="all-clear")
		{
			jQuery("#begin_time").val("");
			jQuery("#end_time").val("");
		}
	});
	
    jQuery(document).on("click", "#del_time_dropdown_menu", function()
	{
		var inteligent_id = jQuery("#del_btn_time").find('span').attr("data_value");
		var now = new Date();
		var year = now.getFullYear();//年
		if(inteligent_id=="del-this-year")
		{
			var timeArray = getThisYear(false);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-this-quarterly")
		{
			
            var timeArray = getThisQuarterly(false);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-prev-quarterly")
		{
			var timeArray = getPrevQuarterly(false);
            jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-prev-year")
		{
            var timeArray = getPrevYear(false);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-this-month")
		{
            var timeArray = getThisMonth(false);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-prev-month")
		{
            var timeArray = getPrevMonth(false);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="del-this-week")
        {
            var timeArray = getThisWeek(false);
            jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="del-prev-week")
        {
            var timeArray = getPrevWeek(false);
            jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="del-all-clear")
		{
			jQuery("#del_begin_time").val("");
			jQuery("#del_end_time").val("");
		}
	});
    jQuery(document).on("click", "#exp_time_dropdown_menu", function()
	{
		var inteligent_id = jQuery("#exp_btn_time").find('span').attr("data_value");
		if(inteligent_id=="exp-this-year")
		{
			var timeArray = getThisYear(false);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-this-quarterly")
		{
			
            var timeArray = getThisQuarterly(false);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-quarterly")
		{
			var timeArray = getPrevQuarterly(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-year")
		{
            var timeArray = getPrevYear(false);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-this-month")
		{
            var timeArray = getThisMonth(false);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-month")
		{
            var timeArray = getPrevMonth(false);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="exp-this-week")
        {
            var timeArray = getThisWeek(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-prev-week")
        {
            var timeArray = getPrevWeek(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="exp-all-clear")
		{
			jQuery("#exp_begin_time").val("");
			jQuery("#exp_end_time").val("");
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
			jQuery("#gridTable").jqGrid({
				datatype:"json",
				mtype: 'POST',//注释掉此行可看到传递到后台的参数
				url: "data/getdata.php?pageType="+pageType,
				height: sizeArr.vHeight,
				width: sizeArr.vWidth,
				shrinkToFit: false, //用于控制列宽是否按比例进行计算
				colModel:columns.fields,
				sortname:'TIME',
				sortorder:'DESC',
				viewrecords:true,
				//multiselect: true,
				//multiselectWidth: 30,
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
						jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
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
		jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
		jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
	});
});