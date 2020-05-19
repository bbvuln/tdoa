jQuery(document).ready(function(){
	jQuery("#query_excel").hide();
	jQuery("#query_zip").hide();
	
	var sizeArr = getLogGridTableSize();
	var flow_id_exp = jQuery("#FLOW_ID").val();
	var form_name = jQuery("#flow_name").val();
    var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
    jQuery.getJSON("/general/workflow/get_flow_list.inc.php",{"FLOW_ID":MENU_FLOW_ID,"action":4,"root":true},function(jsonData){
        jQuery("#FLOW_ID").html("");
        jQuery("#exp_flow_id").html("");
        jQuery.each(jsonData,function(i,t){
            jQuery("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
        	jQuery("#exp_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');

        });

		jQuery.getJSON("archive_time.php","",function(jsonData){
			jQuery("#archive_data").html("");
			jQuery.each(jsonData,function(i,t){
				jQuery("#archive_data").append('<option value="'+t.value+'">'+t.txt+'</option>');
			});
			check_form();
		});	  
		
		jQuery.getJSON("archive_time.php","",function(jsonData){
			jQuery("#exp_archive_data").html("");
			jQuery.each(jsonData,function(i,t){
				jQuery("#exp_archive_data").append('<option value="'+t.value+'">'+t.txt+'</option>');
			});
			var archive_id = jQuery("#archive_data").val();
			jQuery("#exp_archive_data").val(archive_id);
		});	  		

        jQuery("#FLOW_ID").combobox();
        jQuery("#exp_flow_id").combobox();
	    jQuery('#exp_flow_id').find('option[value='+flow_id_exp+']').attr('selected',true);
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
	
	jQuery(document).on("click", "#exp_time_dropdown_menu", function()
	{
		var inteligent_id = jQuery("#exp_btn_time").find('span').attr("data_value");
		var now = new Date();
		var year = now.getFullYear();//年
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
	
	jQuery(document).on('click', "#query_export", function(){
		jQuery('#exp_flow_id').val(document.form1.FLOW_ID.value);
        jQuery('#EXP_RUN_ID').val(jQuery.trim(jQuery('#RUN_ID').val()));
        jQuery('#EXP_RUN_NAME').val(jQuery.trim(jQuery('#run_name').val()));
        jQuery('#exp_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
        jQuery('#query_export_area').val(jQuery.trim(jQuery('#FLOW_QUERY_TYPE').val()));
        jQuery('#exp_flow_name').val(jQuery.trim(jQuery('#flow_name').val()));
        jQuery('#exp_end_time').val(jQuery.trim(jQuery('#end_time').val()));
        jQuery('#exp_user').val(jQuery.trim(jQuery('#TO_NAME').val()));
        jQuery('#exp_user_id').val(jQuery.trim(jQuery('#TO_ID').val()));
        set_user();
        open_bootcss_modal("div_export","780","5");//修改窗口大小    
		var flow_id=document.form1.FLOW_ID.value;
		var flow_name=jQuery.trim(jQuery('#flow_name').val());
		jQuery('#exp_flow_id').find('option[value='+flow_id+']').attr('selected',true);
		jQuery('input[class=ui-autocomplete-input]').val(flow_name);
		jQuery('#flow_name').css("margin-bottom","0px");
		jQuery('#div_export_body').load();
	});
	jQuery(window).resize(function(){
		var sizeArr = getLogGridTableSize();
		jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
		jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
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

		}else{
			jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
			jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
		}
	});
});


function set_user()
{
    var SET_USER = document.getElementById("SET_USER");
    var query_export_area= jQuery("#query_export_area").val();
    if(document.form1.FLOW_QUERY_TYPE.value==6 || document.form1.FLOW_QUERY_TYPE.value==8){
    	SET_USER.style.display="inline";
    }else{
    	SET_USER.style.display="none";
	}
	if(query_export_area == 6 || query_export_area == 8)
	{
		jQuery("#div_exp_user_called").css("display","inline");
	}else{
		jQuery("#div_exp_user_called").css("display","none");
	}
}
//管理员强制删除

//导出excel
function export_run_sel()
{
	var runId=jQuery("#gridTable").jqGrid('getGridParam','selarrrow');
	if(runId == "" || runId == "undefined")
	{
		alert(td_lang.general.workflow.msg_56);
		return false;
	}

    window.location="archive_excel_data.php?FLOW_ID="+jQuery("#FLOW_ID").val()+"&RUN_ID_STR="+runId+"&archive_data="+jQuery("#archive_data").val();
    
}
//导出ZIP
function zip_run_sel()
{
	var runId=jQuery("#gridTable").jqGrid('getGridParam','selarrrow');
	if(runId == "" || runId == "undefined")
	{
		alert(td_lang.general.workflow.msg_56);
		return false
	}
    window.location="archive_export_zip.php?RUN_ID_STR="+runId+"&archive_data="+jQuery("#archive_data").val();

}