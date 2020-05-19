jQuery(document).on("click", ".next_step", function()
{	
	try{		
		if(typeof(eval(checkEssentialInfo))=='function')					
		{
			var href_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
			var  checked=checkEssentialInfo(href_id);	
		}
	}catch(e)
		{
		}
		if(checked==false){
			return ;
		}	
	var hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
	hrefid = hrefid.substr(1);
	
	jQuery('.active').parent().find("li[class$='active']").next().addClass("active");
	jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");
	var select_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
	select_id = select_id.substr(1);
	
	//jQuery('.active').parent().find("div[class$='active']").next().addClass("active");
	jQuery('.active').parent().find("div[id='"+select_id+"']").addClass("active");
	jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
	showPic();
	showbtn();
	
});
jQuery(document).on("click", '[name="btn_prev"]', function()
{		
	var objitem = jQuery('#nav_left').find('.active').attr('item');
	if(objitem!='first'){
		var hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		hrefid = hrefid.substr(1);
		jQuery('.active').parent().find("li[class$='active']").prev().addClass("active");
		jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");
		var select_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		select_id = select_id.substr(1);
		//jQuery('.active').parent().find("div[class$='active']").prev().addClass("active");
		jQuery('.active').parent().find("div[id='"+select_id+"']").addClass("active");
		jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
	}
	showPic();
	showbtn();
});
function showbtn()
{
	var objitem = jQuery('#nav_left').find('.active').attr('item');
	if(objitem=='first'){
		jQuery('[name="btn_prev"]').find('button').attr('disabled','true');
		jQuery('[name="btn_prev"]').find('button').removeClass('btn-primary');
	}else{
		jQuery('[name="btn_prev"]').find('button').removeAttr("disabled");
		jQuery('[name="btn_prev"]').find('button').addClass('btn-primary');
	}
	if(objitem=='last'){
	  
		jQuery('[name="btn_next"]').find('button').attr('disabled','true');
		jQuery('[name="btn_next"]').find('button').removeClass('btn-primary');
	}else{
		jQuery('[name="btn_next"]').find('button').removeAttr("disabled");
		jQuery('[name="btn_next"]').find('button').addClass('btn-primary');
	}	
}
function showPic()
{
	var thisObj=jQuery('#nav_left').find('.active');
	var thisClassName=thisObj.find('span').attr('class');
	var thisSlibings=thisObj.siblings();
	if(thisClassName!=undefined){
		var isHaveName=thisClassName.indexOf('_hover');
		if(isHaveName==-1){
			var newThisClassName=thisClassName+'_hover';
			thisObj.find('span').attr('class',newThisClassName)
		}
		thisSlibings.each(function(){
			var className=jQuery(this).find('span').attr('class');
			var isHasClassName=className.indexOf('_hover');
			if(isHasClassName!==-1){
				var newClassName=className.replace(/_hover/,'');
				jQuery(this).find('span').attr('class',newClassName);			
			}
		});
	}
}