jQuery(document).ready(function(){
	jQuery('.dropdown-toggle').dropdown();
	jQuery('.bs-docs-tooltip-examples').popover('options');
	jQuery(document).on("click", ".dropdown>.dropdown-menu>li", function(){
		var checkedParent = jQuery(this).parent().parent().find("button[class$='dropdown-toggle']");
		var currentHtml = jQuery(checkedParent).html();
		var currentText =currentHtml.replace('<span class="caret" id="caret"></span>','');
		var checkedText = jQuery(this).find("a").html();
		var checkedObj = jQuery(this).clone(true);
		var checkedHtml = jQuery(checkedObj).html();
		var newOptionHtml = checkedHtml.replace(checkedText, currentText);
		var newCheckedHtml = currentHtml.replace(currentText, checkedText);
		jQuery(checkedParent).html(newCheckedHtml);
		jQuery(this).parent().append("<li>"+newOptionHtml+"</li>");
		jQuery(this).parent().find('li').css('font-size','14px');
		jQuery(this).remove();
		
	});
	jQuery(document).resize();
	
	jQuery('#context-menu').find('li').find('a').css('line-height', '25px');
	jQuery('.dropdown-menu').find('li').css('font-size','14px');
	
	jQuery('.dropdown-menu').css('min-width','100px');
	jQuery('#context-menu>ul').find('a:last').css('border', '0px');
	jQuery('#context-menu>ul').find('a:last').css('color', 'red');
	jQuery('.form_content').contextmenu({
		target:'#context-menu',
		onItem: function(e, item){
			var fun = "form_"+jQuery(item).attr("tabindex");
			var form_id = jQuery('.form_content_hover').attr("form_id");
			if(typeof window[fun]){
				window[fun](form_id);
			}
		}
	});
	jQuery(document).on("click", ".form_content", function(){
		jQuery(".form_main").removeClass('form_folder_hover');
		jQuery(".form_main").removeClass('form_content_hover');
		var currentNameStr = jQuery(this).attr('class');
		
		var tmpNameStr = currentNameStr.replace('form_main ', '');
		jQuery(this).addClass(tmpNameStr+'_hover');
	})
	jQuery(".form_content,.form_folder").mousedown(function(e){
		if(3 == e.which){
			jQuery(this).click();
		}
	});
	jQuery(".button_area>button").click(function(){
		var fun = "form_"+jQuery(this).attr("action");
		var form_id = jQuery('.form_content_hover').attr("form_id");
		if(typeof window[fun]){
			window[fun](form_id);
		}
	});	
	jQuery(document).on("click", ".next_step", function(){
		
		var hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		hrefid = hrefid.substr(1);
		jQuery('.active').parent().find("li[class$='active']").next().addClass("active");
		jQuery('.active').parent().find("div[class$='active']").next().addClass("active");
		jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");
		jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
	});
	//jQuery(document).on("click", ".condition_button", function(){
		//alert(jQuery(this).html());
		return false;
		/*alert(jQuery('#condition_button').text());
		if(jQuery('#condition_button').text()=="等于" || jQuery('#condition_button').text()=="不等于")
		{
			jQuery('div_check').style.display="inline";
		} 
		else
		{
			jQuery('div_check').style.display="none";
		}
		change_type();*/
	//});
});
jQuery(window).resize(function(){
	jQuery(".main_area").height(jQuery(".form_container").height() - jQuery(".main-head").height() 
	- jQuery(".operation_area").height() - 20);	
});	
