jQuery(document).ready(function(){
    jQuery("#do_search").click(function(){
        var searchStr = "engine_name="+jQuery("#workflow_engine").val();
        searchStr += "&flow_id="+jQuery("#FLOW_ID").val();
        jQuery("#gridTable").jqGrid('setGridParam',{
				url:"data/getdata.php?"+searchStr,
				page:1
        }).trigger('reloadGrid'); 
    });
});