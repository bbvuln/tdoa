jQuery(document).ready(function(){
	var sizeArr = getLogGridTableSize();
    /*按照选择填选时间
     *
     */
    $.getJSON("/general/approve_center/get_flow_list.inc.php",{"action":2,"root":true},function(jsonData){
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
			var timeArray = getThisYear(true);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="this-quarterly")
		{
			
            var timeArray = getThisQuarterly(true);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-quarterly")
		{
			var timeArray = getPrevQuarterly(true);
            jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-year")
		{
            var timeArray = getPrevYear(true);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="this-month")
		{
            var timeArray = getThisMonth(true);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-month")
		{
            var timeArray = getPrevMonth(true);
			jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="this-week")
        {
            var timeArray = getThisWeek(true);
            jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="prev-week")
        {
            var timeArray = getPrevWeek(true);
            jQuery("#begin_time").val(timeArray[0]);
			jQuery("#end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="all-clear")
		{
			jQuery("#begin_time").val("");
			jQuery("#end_time").val("");
		}
	});
        
        jQuery(document).on("click", "#finish_time_dropdown_menu", function()
	{
		var inteligent_id = jQuery("#finish_btn_time").find('span').attr("data_value");
		var now = new Date();
		var year = now.getFullYear();//年
		if(inteligent_id=="this-year")
		{
			var timeArray = getThisYear(true);
			jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="this-quarterly")
		{
			
            var timeArray = getThisQuarterly(true);
			jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-quarterly")
		{
			var timeArray = getPrevQuarterly(true);
            jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-year")
		{
            var timeArray = getPrevYear(true);
			jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="this-month")
		{
            var timeArray = getThisMonth(true);
			jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="prev-month")
		{
            var timeArray = getPrevMonth(true);
			jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="this-week")
        {
            var timeArray = getThisWeek(true);
            jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="prev-week")
        {
            var timeArray = getPrevWeek(true);
            jQuery("#finish_begin_time").val(timeArray[0]);
			jQuery("#finish_end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="all-clear")
		{
			jQuery("#finish_begin_time").val("");
			jQuery("#finish_end_time").val("");
		}
	});
	
    jQuery(document).on("click", "#del_time_dropdown_menu", function()
	{
		var inteligent_id = jQuery("#del_btn_time").find('span').attr("data_value");
		var now = new Date();
		var year = now.getFullYear();//年
		if(inteligent_id=="del-this-year")
		{
			var timeArray = getThisYear(true);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-this-quarterly")
		{
			
            var timeArray = getThisQuarterly(true);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-prev-quarterly")
		{
			var timeArray = getPrevQuarterly(true);
            jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-prev-year")
		{
            var timeArray = getPrevYear(true);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-this-month")
		{
            var timeArray = getThisMonth(true);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="del-prev-month")
		{
            var timeArray = getPrevMonth(true);
			jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="del-this-week")
        {
            var timeArray = getThisWeek(true);
            jQuery("#del_begin_time").val(timeArray[0]);
			jQuery("#del_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="del-prev-week")
        {
            var timeArray = getPrevWeek(true);
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
			var timeArray = getThisYear(true);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-this-quarterly")
		{
			
            var timeArray = getThisQuarterly(true);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-quarterly")
		{
			var timeArray = getPrevQuarterly(true);
            jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-year")
		{
            var timeArray = getPrevYear(true);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-this-month")
		{
            var timeArray = getThisMonth(true);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-month")
		{
            var timeArray = getPrevMonth(true);
			jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="exp-this-week")
        {
            var timeArray = getThisWeek(true);
            jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-prev-week")
        {
            var timeArray = getPrevWeek(true);
            jQuery("#exp_begin_time").val(timeArray[0]);
			jQuery("#exp_end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="exp-all-clear")
		{
			jQuery("#exp_begin_time").val("");
			jQuery("#exp_end_time").val("");
		}
	});
	
	// 增加办结时间过滤 DJ 14/8/11
	jQuery(document).on("click", "#finish_exp_time_dropdown_menu", function()
	{
		var inteligent_id = jQuery("#finish_exp_btn_time").find('span').attr("data_value");
		if(inteligent_id=="exp-this-year")
		{
			var timeArray = getThisYear(true);
			jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-this-quarterly")
		{
			
            var timeArray = getThisQuarterly(true);
			jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-quarterly")
		{
			var timeArray = getPrevQuarterly(true);
            jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-year")
		{
            var timeArray = getPrevYear(true);
			jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-this-month")
		{
            var timeArray = getThisMonth(true);
			jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
		}
		else if(inteligent_id=="exp-prev-month")
		{
            var timeArray = getPrevMonth(true);
			jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
		}
        else if(inteligent_id=="exp-this-week")
        {
            var timeArray = getThisWeek(true);
            jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-prev-week")
        {
            var timeArray = getPrevWeek(true);
            jQuery("#finish_exp_begin_time").val(timeArray[0]);
			jQuery("#finish_exp_end_time").val(timeArray[1]);
        }
		else if(inteligent_id=="exp-all-clear")
		{
			jQuery("#finish_exp_begin_time").val("");
			jQuery("#finish_exp_end_time").val("");
		}
	});
    jQuery('#TIME_FIELDER_SELECT').change(function(){
        if(this.value == '1')
        {
            jQuery('#DETAILED_TIME_DIV').hide();
            jQuery('#MONTHS_COUNT_DIV').show();
        }
        else
        {
            jQuery('#MONTHS_COUNT_DIV').hide();
            jQuery('#DETAILED_TIME_DIV').show();
            jQuery('#DETAILED_TIME_DIV').css('display','inline-block');
        }
    });
    jQuery('#EXP_TIME_FIELDER_SELECT').change(function(){
        if(this.value == '1')
        {
            jQuery('#EXP_DETAILED_TIME_DIV').hide();
            jQuery('#EXP_MONTHS_COUNT_DIV').show();
        }
        else
        {
            jQuery('#EXP_MONTHS_COUNT_DIV').hide();
            jQuery('#EXP_DETAILED_TIME_DIV').show();
        }
    });
    jQuery('#MONTHS_COUNT').change(function(){
        jQuery('#begin_time').val('');
        jQuery('#end_time').val('');
        jQuery('#finish_begin_time').val('');
        jQuery('#finish_end_time').val('');
        jQuery('#do_search').click();
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
            var myDate = new Date();
			jQuery("#gridTable").jqGrid({
				datatype:"json",
				mtype: 'POST',//注释掉此行可看到传递到后台的参数
				url: "data/getdata.php?pageType="+pageType,
				height: sizeArr.vHeight+3,
				width: sizeArr.vWidth,
				shrinkToFit: false, //用于控制列宽是否按比例进行计算
				colModel:columns.fields,
				sortname:'FLOW_ID',
				sortorder:'DESC',
				viewrecords:true,
				//multiselect: true,
				//multiselectWidth: 30,
				subGridWidth: 30,
				rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10000,
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
					jQuery('#page_html').html(jQuery(this).getGridParam("records"));
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
					$('#page_html').html();
//					loadPager();  //去除页面内容显示 王瑞杰 20140429
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
		//数据为空时提示“没有检索到数据” 王瑞杰 20140506
		if(jQuery("#gridTable").getGridParam("records") == 0)
		{
			jQuery("#gridTable").jqGrid('setGridHeight',0);
		}else{
			jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
			jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
		}
		//jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
		//jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight+3);
	});
});
function showChart(chart_type,xml)
{
	
        document.getElementById('chart').innerHTML = "";
        var divId = "test";
		if(xml == "<chart></chart>")
			return false;
		var oDiv = document.createElement("DIV");
		oDiv.setAttribute("id",divId);
		oDiv.setAttribute("align","center");
		document.getElementById("chart").appendChild(oDiv);
		var swf_file = ' /inc/FusionCharts/'+chart_type+'.swf';
		var width = 1200;
		width = Math.floor(width*0.95)-20;
	  	var myChart = new FusionCharts(swf_file, "myChart", width, 300, 0, 1);	
	  	myChart.setDataXML(xml);
	  	myChart.formatNumber = 0;
	  	myChart.render(divId);
	   
		var oExportDiv = document.createElement("DIV");
		oExportDiv.setAttribute("align","center");
		oExportDiv.setAttribute("id","fcExporterDiv");
		document.getElementById("chart").appendChild(oExportDiv);
	  	var myExportComponent = new FusionChartsExportObject("fcExporter", " /inc/FusionCharts/FCExporter.swf");
	  	myExportComponent.componentAttributes.width = '400';
	  	myExportComponent.componentAttributes.btnWidth = '220';
   		myExportComponent.componentAttributes.btnHeight= '25';
    	myExportComponent.componentAttributes.btnColor = 'E1f5ff';
    	myExportComponent.componentAttributes.btnBorderColor = '0372AB';
	  	myExportComponent.componentAttributes.btnFontColor = '0372AB';
		myExportComponent.componentAttributes.btnFontSize = '14';
	  	myExportComponent.componentAttributes.btnsavetitle = '保存';
		myExportComponent.componentAttributes.btndisabledtitle = '在图表上点击右键导出'; 
        myExportComponent.Render(oExportDiv);
        is_build = true;
}
