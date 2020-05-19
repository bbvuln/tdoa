jQuery(document).ready(function(){
	jQuery('#form_list').html('loading...');
	jQuery(".btn-info").attr({"disabled":"disabled"});
	jQuery(".btn-danger").attr({"disabled":"disabled"});

	jQuery.ajax({
		url: "form_data.php",
		data: "form_id="+0,
		type: "POST",
		async: true,
		success: function(data){
			var jsonData = jQuery.parseJSON(data);
			//alert(data);
			jQuery('#form_list').html("");
			var i=0;
			for (var one in jsonData)
			{
			    for(var key in jsonData[one])
			    {			    	
			        if(i==0)
					{
						jQuery('#form_list').append('<div class="form_main form_folder" title="'+jsonData[one][key].sort_name+'" data-toggle="context" sort_parent="'+jsonData[one][key].sort_parent+'" sort_id="'+jsonData[one][key].sort_id+'" onDblClick="form_sort_parent('+jsonData[one][key].sort_id+',\''+jsonData[one][key].sort_name+'\')"><div class="form_mark">'+jsonData[one][key].sort_name+'</div></div>');   	

					}else{
						jQuery('#form_list').append('<div class="form_main form_content" data-toggle="context" form_id="'+jsonData[one][key].form_id+'" data-target="#context-menu"  title="'+jsonData[one][key].form_name+'"><div class="form_mark">'+jsonData[one][key].form_name+'</div></div>');   	
					}
			    }
			    i++;
			}		
			jQuery('.form_content').contextmenu({ 
				target:'#context-menu',
				onItem: function(e, item){
					var fun = "form_"+jQuery(item).attr("tabindex");
					var form_id = jQuery('.form_content_hover').attr("form_id");
					if(typeof window[fun] === "function"){
						window[fun](form_id);
					}
				}
			});	
		},
		error: function(data){
			alert(data.responseText);
		}
	});
	jQuery('#form_list').removeClass("loading");
	jQuery('.dropdown-toggle').dropdown();
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
		jQuery(this).remove();		
		var sort_id = jQuery('.nav_link').find('ul').find('li').last().attr('sort_id');
		var sort_name = jQuery('.nav_link').find('ul').find('li').last().find('a').html();
		var compositor_id = jQuery('#compositor_id').find('span').attr('compositor_id');
		form_sort_parent(sort_id,sort_name,compositor_id);
	});
	jQuery(document).resize();

	jQuery('#context-menu').find('li').find('a').css('line-height', '25px');
	jQuery('.dropdown-menu').css('min-width','0px');
	jQuery('#context-menu>ul').find('a:last').css('border', '0px');
	jQuery('#context-menu>ul').find('a:last').css('color', 'red');
	
	
	//选中表单，解除禁止按钮状态
	jQuery(document).on("click", ".form_content", function(){
		
		jQuery(".form_main").removeClass('form_folder_hover');
		jQuery(".form_main").removeClass('form_content_hover');
		var currentNameStr = jQuery(this).attr('class');		
		var tmpNameStr = currentNameStr.replace('form_main ', '');
		jQuery(this).addClass(tmpNameStr+'_hover');
		var form_id = jQuery('.form_content_hover').attr("form_id");
		jQuery('#form_id_hidden').val(form_id);
		jQuery(".btn-info").removeAttr("disabled");
		jQuery(".btn-danger").removeAttr("disabled");

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

//新建表单
function form_new(form_id){
	jQuery('#myModal').modal({
		keyboard: false,
		backdrop:"static"
	})
	jQuery('#form_new_div').load('new.php',function(){
		//jQuery('#form_file').show();	
		//alert(jQuery('form[name="form_news"]').length);
	});
}

//表单设计器
function form_smart(form_id){	
	
	window.open("cool_form/ue.php?FORM_ID="+form_id,"cool_form","menubar=0,toolbar=0,scrollbars=no,status=0,resizable=1");
	
}
//表单预览
function form_preview(form_id){	

	window.open("/general/workflow/form_view.php?FORM_ID="+form_id,"form_view_"+form_id,"menubar=0,toolbar=0,status=0,resizable=1,left=0,top=0,scrollbars=1,width="+(screen.availWidth-10)+",height="+(screen.availHeight-50)+"\"");

}
//修改表单
function form_edit(form_id){
	jQuery('#myModal_edit').modal({
		keyboard: false,
		backdrop:"static"
	})
	jQuery('#form_edit_div').load('new.php?form_id='+form_id,function(){

	});
}

//表单复制
function form_copy(form_id){
	alert('copy form:'+form_id);
}

//导入
function form_import(form_id){
	jQuery('#myModal_import').modal({
		keyboard: false,
		backdrop:"static"
	})
	jQuery('#form_import_div').load('import.php?form_id='+form_id,function(){

	});
}

//导出
function form_export(form_id){
	
	window.location.href="export.php?FORM_ID="+form_id;
	
}

//历史版本
function form_version(form_id){
	jQuery('#myModal_version').modal({
		keyboard: false,
		backdrop:"static"
	})
	jQuery('#form_version_div').load('version.php',function(){
		
	});
}

function form_delete(form_id){
	alert('delete form:'+form_id);
}

/**
 *
 *      获取分类、表单数据
 *
 *      @author   	杨慧松<yhs@tongda2000.com>
 *      sort_id			分类id
 *      sort_name		分类名称
 *      compositor_id	排序方式
 *      select_value	搜索
 *      @copyright 	2002-2013 tongda
 */
function form_sort_parent(sort_id,sort_name,compositor_id,select_value){
	var model_icon = jQuery('#model_icon_hidden').val();
		jQuery('#sort_id_hidden').val(sort_id);
	if(compositor_id=="" || compositor_id == "undefined")
	{
		compositor_id = "0";
	}
	if(select_value=="" || select_value == "undefined")
	{
		select_value = "";
	}
	jQuery('#form_list').html('loading...');
	jQuery('#form_list').addClass("loading");
	jQuery.ajax({		
		url: "form_data.php?sort_id="+sort_id+"&compositor_id="+compositor_id+"&select_value="+select_value,
		data: "sort_id="+sort_id,
		type: "POST",
		async: true,
		success: function(data){
			var jsonData = jQuery.parseJSON(data);
			jQuery('#form_list').html("");
			jQuery('#form_list1').find('table').find('tbody').html("");
			var i=0;
			for (var one in jsonData)
			{				
			    for(var key in jsonData[one])
			    {
			    	if(model_icon == 2)
			    	{
			    		if(i==0)
						{
							jQuery('#form_list1').find('table').append('<tr><td><span class="icon16-pencil-folder" sort_parent="'+jsonData[one][key].sort_parent+'" sort_id="'+jsonData[one][key].sort_id+'" onDblClick="form_sort_parent('+jsonData[one][key].sort_id+',\''+jsonData[one][key].sort_name+'\')">'+jsonData[one][key].sort_name+'</span></td><td><a href="javascript:form_sort_parent('+jsonData[one][key].sort_id+',\''+jsonData[one][key].sort_name+'\')">'+td_lang.general.workflow.msg_63+'</a></td></tr>');

						}else{
							
							jQuery('#form_list1').find('table').append('<tr><td><span class="icon16-pencil-content">'+jsonData[one][key].form_name+'</span></td><td><a href="javascript:form_edit('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_64+'&nbsp;&nbsp;</a><a href="javascript:form_smart('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_65+'&nbsp;&nbsp;</a><a href="javascript:form_preview('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_66+'&nbsp;&nbsp;</a><a href="javascript:form_import('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_67+'&nbsp;&nbsp;</a><a href="javascript:form_export('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_68+'&nbsp;&nbsp;</a><a href="javascript:form_version('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_69+'&nbsp;&nbsp;</a><a href="javascript:form_delete('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_70+'&nbsp;&nbsp;</a></td></tr>');	  	
						}
			    	}
			    	else
			    	{
			    		 if(i==0)
						{
	
							jQuery('#form_list').append('<div class="form_main form_folder" data-toggle="context" title="'+jsonData[one][key].sort_name+'" sort_parent="'+jsonData[one][key].sort_parent+'" sort_id="'+jsonData[one][key].sort_id+'" onDblClick="form_sort_parent('+jsonData[one][key].sort_id+',\''+jsonData[one][key].sort_name+'\')"><div class="form_mark">'+jsonData[one][key].sort_name+'</div></div>');   	
	
						}else{
							
							jQuery('#form_list').append('<div class="form_main form_content" data-toggle="context" form_id="'+jsonData[one][key].form_id+'" data-target="#context-menu"  title="'+jsonData[one][key].form_name+'"><div class="form_mark">'+jsonData[one][key].form_name+'</div></div>'); 
							  	
						}
			    	}
			       
			    }
			    i++;
			}	
					
		},
		error: function(data){
			alert(data.responseText);
		}
	});
	jQuery('#form_list').removeClass("loading");

	var obj = jQuery('.nav_link>ul').find("li[sort_id=" + sort_id + "]");
	if(obj.length > 0){
			
		obj.nextAll().remove();
	
	}else{
						
		jQuery('.nav_link>ul').append('<li sort_id="'+sort_id+'"><span class="divider" style="color:#666666;font-size:12px;">>></span><a href="javascript:;" onclick="form_sort_parent('+sort_id+')">'+sort_name+'</a></li>');

	}	
}

//搜索
function form_select(){
	var select_value = jQuery("input[name=form_select]").val();
	form_sort_parent("","","",select_value);
}

//列表视图、缩略图切换
function changeImage(){
	var currSrc=jQuery('#img_icon').attr('src');
	if(currSrc=='css/images/form_sort_list.png'){
		jQuery('#img_icon').attr('src','css/images/form_sort_view.png');
		jQuery('#icon_info').attr('title',td_lang.general.workflow.msg_71);
		jQuery('#icon_info').attr('model_icon','1');
		jQuery('#form_list1').show();	
		jQuery('#form_list').hide();
		jQuery(".btn-info").hide();
		jQuery(".btn-danger").hide();
		jQuery('#model_icon_hidden').val(2);
	}else if(currSrc=='css/images/form_sort_view.png'){
		jQuery('#img_icon').attr('src','css/images/form_sort_list.png');
		jQuery('#icon_info').attr('title',td_lang.general.workflow.msg_72);
		jQuery('#icon_info').attr('model_icon','2');
		jQuery('#form_list').show();	
		jQuery('#form_list1').hide();
		jQuery(".btn-info").show();
		jQuery(".btn-danger").show();
		jQuery('#model_icon_hidden').val(1);
	}
	var sort_id = jQuery('#sort_id_hidden').val();
	if(sort_id == "" || sort_id == "undefined"){
		sort_id = "0";
	}
	form_sort_parent(sort_id);
}
