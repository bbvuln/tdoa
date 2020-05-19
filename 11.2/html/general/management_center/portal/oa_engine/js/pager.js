jQuery(document).ready(function(){
    /*
    var selectObj = jQuery("select[class='ui-pg-selbox']");
	if(selectObj && selectObj.length == 1){
		var buttonHtml = selectObj.val()+'<span class="caret"></span>';
		jQuery('#pager-selbox').html(buttonHtml);
		jQuery(".pager-selbox-menu").html('');
		selectObj.find("option").each(function(i){
			if(jQuery(this).text() == selectObj.val()){
				return true;
			}
			var liHtml = '<li><a href="javascript:;">';
			liHtml += jQuery(this).text();
			liHtml += '</a></li>';
			jQuery(".pager-selbox-menu").append(liHtml);
		});
	}
    */
	var options = {
        currentPage: 1,
        totalPages: 20,
        onPageClicked: function(){
            alert("pageClick");
    /*
        jQuery('.ui-pg-input').val(page);
        var event_e = jQuery.Event("keydown");
        event_e.keyCode = 13;
        jQuery('.ui-pg-input').trigger(event_e);
    */
    }

    };
	jQuery('#work-pager-block').bootstrapPaginator(options);

})