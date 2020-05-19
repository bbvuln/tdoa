jQuery(document).ready(function(){
	var sizeArr = getLogGridTableSize();
	var FLOW_NAME_EDIT = jQuery("#FLOW_NAME_EDIT").val();
	var FLOW_ID_EDIT = jQuery("#FLOW_ID_EDIT").val();
    /*按照选择填选时间
     *
     */
    $.getJSON("/general/approve_center/get_flow_list.inc.php",{"action":6,"root":true},function(jsonData){
        $("#NEW_FLOW_ID").html("");
        $.each(jsonData,function(i,t){
            $("#NEW_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
        });
        $("#NEW_FLOW_ID").combobox();
        if(FLOW_ID_EDIT != "")
        {
            $("#NEW_FLOW_ID").val(FLOW_ID_EDIT);
            $("#NEW_FLOW_ID").next().find("#flow_name").val(FLOW_NAME_EDIT);
        }
        // $("#NEW_FLOW_ID option[value="+FLOW_ID_EDIT+"]").attr("selected",true);
        // $("#flow_name").val(FLOW_NAME_EDIT);
        // $(".ui-autocomplete-input").val(FLOW_NAME_EDIT);
    });
    rule_type(1);


	jQuery(window).resize(function(){
		var sizeArr = getLogGridTableSize();
		jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
		jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
	});
    
    jQuery(".sms-check").click(function(){
        var sms_class = jQuery(".sms-check").attr("class");
        
        if(sms_class.indexOf("sms-bg-static") >= 0)
        {
            jQuery(".sms-check").removeClass("sms-bg-static");
            jQuery("#intrust_sms").prop("checked", true);
        }
        else
        {
            jQuery(".sms-check").addClass("sms-bg-static");
            jQuery("#intrust_sms").prop("checked", false);
        }
    });
    
    jQuery(".mobile-check").click(function(){
        var mobile_class = jQuery(".mobile-check").attr("class");
        var mobile_value = jQuery("#intrust_mobile").val();
        
        if(mobile_class.indexOf("mobile-bg-static") >= 0)
        {
            jQuery(".mobile-check").removeClass("mobile-bg-static");
            jQuery("#intrust_mobile").prop("checked", true);
        }
        else
        {
            jQuery(".mobile-check").addClass("mobile-bg-static");
            jQuery("#intrust_mobile").prop("checked", false);
        }
    });
});

function rule_type(flag)
{

	if(document.getElementById("ALWAYS_ON").checked)
	{
		jQuery("#time_hide").css('display', 'none');
	}
	else
	{
		jQuery("#time_hide").css('display', 'block');
	}

}