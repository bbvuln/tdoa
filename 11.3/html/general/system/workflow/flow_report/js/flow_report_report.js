jQuery(document).ready(function(){
    windowsHeight = jQuery(window).outerHeight(true);
    windowsWidth = jQuery(window).outerWidth(true);
    topHeight = jQuery(".top_info").outerHeight(true);
    jQuery('#bottom_info_right').css('height',getRightHeight());
});
/*
jQuery(window).resize(function(){
    var resizeWidth = jQuery(window).outerWidth(true);
    var leftWidth = jQuery('#bottom_info_left').outerWidth(true);
    alert("resize:"+resizeWidth);
    alert("leftWidth:"+leftWidth)
    var newWidth = resizeWidth - leftWidth;
    jQuery('#bottom_info_right').css('width',newWidth);
    jQuery('#bottom_info_right').css('height',getRightHeight());
});
*/
function getRightHeight()
{
    var rightHeight = windowsHeight - topHeight - 20;
    return rightHeight;
}
