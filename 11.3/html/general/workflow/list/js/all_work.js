jQuery(document).ready(function()
{
	jQuery(window).resize(function(){
		jQuery('.work_all').css('height',getMainDivHeight());
	});
	jQuery(window).trigger('resize');
	
	jQuery('.main_list').mouseover(function(){
		jQuery(this).css('background','#bfe3fc');
	}).mouseout(function(){
		jQuery(this).css('background','white');
	});
	
//	jQuery('.public_top').click(function(){
//		jQuery(this).nextAll().toggle();
//	});	
	jQuery('[name="type_sort"]').each(function(){
		if(jQuery(this).text()==''){
			jQuery(this).parent().hide();
		}
	}) 		
	
});
function showList(flow_id,type)
{
	jQuery('#list_table').show();
	jQuery('#pic_list').hide();
}
function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var bottomHeight=jQuery("#myTab",parent.document).outerHeight(true);
	var MainDivHeight=windowsHeight-(10+bottomHeight);
	return MainDivHeight;
}
function changeView(obj,type)
{
	var flow_id=jQuery(obj).parent().attr('flow_id');
	var href='';
	var afterJump='';
	var currActiveli=jQuery("#myTab",parent.document).find('li[class="active"]');
	if(type=='not_accepted'){
		href='todo.php?FLOW_ID='+flow_id;
		afterJump=jQuery("#myTab",parent.document).find('a[href="#todo"]').parent().addClass('active');
		currActiveli.removeClass('active');
	}
	if(type=='Check_in'){
		href='todo.php?FLOW_ID='+flow_id;
		afterJump=jQuery("#myTab",parent.document).find('a[href="#todo"]').parent().addClass('active');
		currActiveli.removeClass('active');
	}
	if(type=='settles_in'){
		href='settles.php?pageType=settles&FLOW_ID='+flow_id;
		afterJump=jQuery("#myTab",parent.document).find('a[href="#settles"]').parent().addClass('active');
		currActiveli.removeClass('active');
	}
	if(type=='hang_in'){
		href='pending.php?pageType=pending&FLOW_ID='+flow_id;
		afterJump=jQuery("#myTab",parent.document).find('a[href="#pending"]').parent().addClass('active');
		currActiveli.removeClass('active');
	}
	jQuery(obj).attr('href',href);
} 		