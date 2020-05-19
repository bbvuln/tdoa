jQuery(document).ready(function()
{
	jQuery(window).resize(function(){
		jQuery('.new_edit_left').css('height',setMainDivHeight());
		jQuery('.new_edit_right').css('height',setMainDivHeight());
	});
	jQuery(window).trigger('resize');
})
function setMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var MainDivHeight=windowsHeight-(3);
	return MainDivHeight;
}