jQuery(document).ready(function(){
	jQuery('.dropdown-toggle').dropdown();
	jQuery(document).on("click", ".dropdown>.dropdown-menu>li", function(){
		var checkedParent = jQuery(this).parent().parent().find("button[class$='dropdown-toggle']");
		var currentHtml = jQuery(checkedParent).html();
		var currentText = currentHtml.replace(/<span class=\"caret\"><\/span>/g,"");
		var checkedText = jQuery(this).find("a").html();
		var checkedObj = jQuery(this).clone(true);
		var checkedHtml = jQuery(checkedObj).html();
		var newOptionHtml = checkedHtml.replace(checkedText, currentText);
		var newCheckedHtml = currentHtml.replace(currentText, checkedText);
		jQuery(checkedParent).html(newCheckedHtml);
		jQuery(this).parent().append("<li>"+newOptionHtml+"</li>");
		jQuery(this).remove();
	});
	jQuery(document).resize();
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

});
jQuery(window).resize(function(){
	jQuery(".main_area").height(jQuery(".form_container").height() - jQuery(".main-head").height() 
	- jQuery(".operation_area").height() - 20);	
});	

function form_new(form_id){
	jQuery('#myModal').modal({
		keyboard: false,
		backdrop:"static"
	})
	jQuery('.modal-body').load('new.php');
}

function form_smart(form_id){
	alert('smart form:'+form_id);
}

function form_edit(form_id){
	jQuery('#myModal').modal({
		keyboard: false,
		backdrop:"static"
	})
	jQuery('.modal-body').load('new.php');
}

function form_copy(form_id){
	alert('copy form:'+form_id);
}

function form_import(form_id){
	alert('import form:'+form_id);
}

function form_export(form_id){
	alert('export form:'+form_id);
}

function form_version(form_id){
	alert('version form:'+form_id);
}

function form_delete(form_id){
	alert('delete form:'+form_id);
}

function search_senior(){
	jQuery("#search1").show();
	jQuery("#search2").hide();
}

function search_ordinary(){
	jQuery("#search1").hide();
	jQuery("#search2").show();
}
