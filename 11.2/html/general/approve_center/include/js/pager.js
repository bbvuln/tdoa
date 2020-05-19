function loadPager(){
	var selectObj = jQuery("select[class='ui-pg-selbox']");

	var totals = jQuery('#total_records').html();

	if(parseInt(totals) === 0) {
		 jQuery('.pager_operation').css('visibility', 'hidden');
	}else{
		jQuery('.pager_operation').css('visibility', 'visible');
	}
	if(selectObj && selectObj.length == 1){
		var buttonHtml = selectObj.val()+td_lang.general.workflow.msg_190+'<span class="caret"></span>';
		jQuery('#pager-selbox').html(buttonHtml);
		jQuery(".pager-selbox-menu").html('');
		selectObj.find("option").each(function(i){
			if(jQuery(this).text() == selectObj.val()){
				return true;
			}
			var liHtml = '<li><a href="javascript:;">';
			liHtml += jQuery(this).text()+td_lang.general.workflow.msg_190;
			liHtml += '</a></li>';
			jQuery(".pager-selbox-menu").append(liHtml);
		});
	}
	var currentPage = Math.min(parseInt(jQuery("#gridTable").getGridParam("page")), parseInt(jQuery("#total_page").html()));
	var options = {
        currentPage: currentPage,
        totalPages: jQuery("#total_page").html(),
        onPageClicked: function(e,originalEvent,type,page){
        	jQuery('.ui-pg-input').val(page);
			var event_e = jQuery.Event("keydown");
			event_e.keyCode = 13;
			jQuery('.ui-pg-input').trigger(event_e);
        }
    };
	jQuery('#work-pager-block').bootstrapPaginator(options);

}
