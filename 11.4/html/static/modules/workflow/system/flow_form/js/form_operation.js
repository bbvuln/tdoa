jQuery(document).ready(function()
{
	var cookieIcon = jQuery.cookie("cookieName")? jQuery.cookie("cookieName") : "/static/modules/workflow/system/flow_form/css/images/form_sort_list.png";
	if(cookieIcon == "/static/modules/workflow/system/flow_form/css/images/form_sort_list.png"){
		changeImage("/static/modules/workflow/system/flow_form/css/images/form_sort_list.png");
	}else{
		changeImage("/static/modules/workflow/system/flow_form/css/images/form_sort_view.png");
	}
	h = document.documentElement.clientHeight || document.body.clientHeight;
	jQuery('#form_list').html(td_lang.general.workflow.msg_169);
	jQuery(".btn-info").attr({"disabled":"disabled"});
	jQuery(".btn-danger").attr({"disabled":"disabled"});
	jQuery(".show_hide_info").removeClass("btn-info");
	jQuery(".show_hide_danger").removeClass("btn-danger");
	jQuery(".check_submit").removeAttr("disabled");
	//初始化页面信息
	var sort_id = jQuery('#sort_id_hidden').val();
	var sort_name = jQuery('#sort_name_hidden').val();
	form_sort_parent(sort_id,sort_name);
	
	jQuery('#form_list').removeClass("loading");
	jQuery('.dropdown-toggle').dropdown();
	jQuery(document).on("click", ".dropdown>.dropdown-menu>li", function()
	{ //排序
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
	
	jQuery(".button_area>button").click(function()
	{ //循环按钮事件
		var fun = "form_"+jQuery(this).attr("action");
		var form_id = jQuery('.form_content_hover').attr("form_id");
		var form_name = jQuery('.form_content_hover').attr("title");
		var sort_id = jQuery('.form_content_hover').attr("sort_id");
		
		if(typeof window[fun])
		{
			window[fun](form_id,form_name,sort_id);
		}
	});
});
jQuery(window).resize(function()
{
	jQuery(".main_area").height(jQuery(".form_container").height() - jQuery(".main-head").height() - jQuery(".operation_area").height() - 20);	
});	

//新建表单
function form_new(form_id)
{
	jQuery("#myModal").get(0).offsetHeight;
	jQuery('#form_edit_div').html("");
	jQuery('#form_import_div').html("");
	open_bootcss_modal("myModal","600","2");
	var sort_id = jQuery('#sort_id_hidden').val();
	jQuery('#form_new_div').load('new.php?sort_id='+sort_id,function()
	{

	});
}

//新建、修改表单提交方法
function check_form(TYPE)
{
	var value=jQuery('input[type="file"]').val();
	if(value){
		var length=value.length;
		var typeName=value.substring((length-4),(length));
		typeName=typeName.replace('.','');
		typeName = typeName.toLowerCase();
		if(typeName!='text' && typeName!='htm'&&typeName!='html')
		{
			alert(tip);
			return false;
		}
	}
	if(jQuery('input[name="form_name"]').val() == "")
	{
		alert(td_lang.general.workflow.msg_91);
		return false;
	}
	if(jQuery("#PRCS_ERPEAT_PROMPT").length > 0)
	{
		alert(sprintf(td_lang.system.workflow.msg_37));
		return false;
	}
	if(TYPE == 1)
	{
		document.getElementById("form_news").action = "/general/system/workflow/flow_form/insert.php";
	}
	else
	{
		document.getElementById("form_news").action = "/general/system/workflow/flow_form/update.php?type="+TYPE;
	}
			
	document.getElementById("form_news").submit();
	jQuery('.close').click();

}

//表单设计器
function form_smart(form_id)
{	

	window.open("cool_form/ue.php?FORM_ID="+form_id,"cool_form","menubar=0,toolbar=0,scrollbars=no,status=0,resizable=1");
	
}
//移动表单设计器
function form_mobile_smart(form_id)
{
	window.open("pda/index.php?FORM_ID="+form_id);
}
//表单预览
function form_preview(form_id)
{	

	window.open("/general/workflow/form_view.php?FORM_ID="+form_id,"form_view_"+form_id,"menubar=0,toolbar=0,status=0,resizable=1,left=0,top=0,scrollbars=1,width="+(screen.availWidth-10)+",height="+(screen.availHeight-50)+"\"");

}

//修改表单
function form_edit(form_id)
{
	jQuery('#form_new_div').html("");
	jQuery('#form_import_div').html("");
	
	open_bootcss_modal("myModal_edit","600","2");
	jQuery(".check_submit").removeAttr("disabled");				
	jQuery('#form_edit_div').load('new.php?form_id='+form_id,function()
	{

	});
}

//表单复制
function form_copy(form_id)
{
	open_bootcss_modal("myModal_duplicate","600","6");
	jQuery('#form_duplicate_div').load('duplicate.php?form_id='+form_id,function()
	{

	});
}

//导入
function form_import(form_id)
{
	jQuery('#form_edit_div').html("");
	jQuery('#form_new_div').html("");
	open_bootcss_modal("myModal_import","600","10");
	jQuery('#form_import_div').load('import.php?form_id='+form_id,function()
	{

	});
}
//提交导入的表单
function check_import()
{
	
	if(jQuery('input[type="file"]').val() == "")
	{
		alert(td_lang.general.workflow.msg_90);
		return false;
	}
	var value=jQuery('input[type="file"]').val();
	if(value){
		var length=value.length;
		var typeName=value.substring((length-4),(length));
		typeName=typeName.replace('.','');
		typeName = typeName.toLowerCase();
		if(typeName!='text' && typeName!='htm'&&typeName!='html')
		{
			alert(tip);
			return false;
		}
	}
	document.getElementById("form_import").submit();
	jQuery('.close').click();
}

//导出
function form_export(form_id)
{
	var msg1=td_lang.general.workflow.msg_170;
	if(window.confirm(msg1))
	{
		window.location.href="export.php?FORM_ID="+form_id;
	}
}

//历史版本
function form_version(form_id,form_name)
{
	open_bootcss_modal("myModal_version","600","4");
	jQuery('#form_version_div').load('version.php?FORM_ID='+form_id+'&FORM_NAME='+form_name,function()
	{
		version_render();
	});
}
//表单预览
function form_version_preview(vid)
{	
	window.location="/general/system/workflow/flow_form/vsn_form_view.php?FORM_ID="+form_id+"&ID="+vid;
	
	//window.open("/general/system/workflow/flow_form/vsn_form_view.php?FORM_ID="+form_id+"&ID="+vid,			 "menubar=0,toolbar=0,status=0,resizable=1,left=0,top=0,scrollbars=1,width="+(screen.availWidth-10)+",height="+(screen.availHeight-50)+"\"");
}
//恢复版本
function set_main_vsn(vid)
{
		msg=td_lang.general.workflow.msg_92;
		msg1=td_lang.general.workflow.msg_93;
		msg2=td_lang.general.workflow.msg_94;
	if(window.confirm(msg))
	{
		jQuery.ajax({		
			url: "vsn_set_main.php?FORM_ID="+form_id+"&ID="+vid,
			data: "ID="+vid,
			type: "POST",
			async: true,
			success: function(data){
				if(data == "NOT_PRIV")
				{
					alert(td_lang.general.workflow.msg_229);
				}else if(data != 0){
					alert(msg1+data+msg2);
				}else{
							
				}
			},
			error: function(data){
				alert(data.responseText);
			}
		});
	}
}
//删除版本
function delete_vsn(vid ,SORT_ID)
{
	msg=td_lang.general.workflow.msg_95;
	if(window.confirm(msg))
	{
		jQuery.ajax
		({		
			url: "vsn_delete.php?FORM_ID="+form_id+"&ID="+vid,
			data: "ID="+vid,
			type: "POST",
			async: true,
			success: function(data){
				if(data == "NOT_PRIV")
				{
					alert(td_lang.general.workflow.msg_229);
				}else if(data == 1)
				{
					jQuery("tr[version_id='"+vid+"']").remove();
				}else{
		
				}					
			},
			error: function(data){
				alert(data.responseText);
			}
		});
	}
}
//删除表单窗口
function form_delete(form_id,form_name)
{
	open_bootcss_modal("myModal_delete_open","600","25");
    //load方法使用post方式发送数据，不能使用get方式（url中出现这种 值=‘XXX+空格+XXX’ 时会出现只保留空格前字符串的情况）
	jQuery('#delete_open_div').load('delete_open.php',{'form_id':form_id,'form_name':form_name},function()
	{
		var flow_name = jQuery("#delete_open_flow_name").val();
		if(flow_name != ""){
			jQuery("#btn_delete").attr({"disabled":"disabled"});
			jQuery("#btn_delete").removeClass("btn-danger");
		}else{
			jQuery("#btn_delete").removeAttr("disabled");
			jQuery("#btn_delete").addClass("btn-danger");
		}
	});
}
//删除表单
function form_delete_true()
{
	var form_id = jQuery('#delete_open_id').val();
	var form_name = jQuery('#delete_open_name').val();
	//if(window.confirm(td_lang.general.workflow.msg_165))
	//{
	jQuery.ajax
	({		
		url: "delete.php?FORM_ID="+form_id+"&FORM_NAME="+form_name,
		data: "FORM_ID="+form_id,
		type: "POST",
		async: true,
		success: function(data){
			if(data == 1)
			{
				jQuery("tr[form_id='"+form_id+"']").remove();
				jQuery("div[form_id='"+form_id+"']").remove();
				jQuery('.close').click();
				alert(td_lang.general.workflow.msg_166);
				
			}else{
				jQuery('.close').click();
				alert(data);
			}					
		},
		error: function(data){
			alert(data.responseText);
		}
	});	
	//}
}

/**
 *
 *	  获取分类、表单数据
 *
 *	  @author	   杨慧松<yhs@tongda2000.com>
 *	  sort_id		分类id
 *	  sort_name		分类名称
 *	  compositor_id	排序方式
 *	  select_value	搜索
 *	  @copyright	 2002-2013 tongda
 */
function form_sort_parent(sort_id,sort_name,compositor_id,select_value,search_area)
{
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
	jQuery('#form_list').html(td_lang.general.workflow.msg_169);
	jQuery('#form_list').addClass("loading");
	jQuery.ajax
	({		
		url: "form_data.php?sort_id="+sort_id+"&compositor_id="+compositor_id+"&select_value="+select_value,
		data: "sort_id="+sort_id,
		type: "POST",
		async: true,
		dataType: 'json',
		success: function(data){
			var jsonData = data;
			jQuery('#form_list').html("");
			jQuery('#form_list1').find('table').find('tbody').html("");
			var i=0;
			var K=0;
			var J=0;
			
			for (var one in jsonData)
			{			
				for(var key in jsonData[one])
				{
					if(model_icon == 2) //列表视图
					{
						if(i==0)
						{
							jQuery('#form_list1').find('table').append('<tr><td><a href="javascript:;"><span class="icon16-pencil-folder" title="'+jsonData[one][key].sort_name+'" sort_parent="'+jsonData[one][key].sort_parent+'" sort_id="'+jsonData[one][key].sort_id+'" onclick="form_sort_parent('+jsonData[one][key].sort_id+',\''+jsonData[one][key].sort_name+'\')">'+jsonData[one][key].sort_name+'</span></a></td><td><a class="form_ahref" href="javascript:form_sort_parent('+jsonData[one][key].sort_id+',\''+jsonData[one][key].sort_name+'\')">'+td_lang.general.workflow.msg_63+'</a></td></tr>');
							K++;
						}else if(i==1){
							var msg_mobile = "移动表单设计器";
							var formid = "key_"+jsonData[one][key].form_id;
							//var j_name = 'jsonData.key_3.'+formid;
							var del_flag = "";
//							if(!eval(j_name)){
//								
								del_flag = '<a class="form_ahref" href="javascript:form_delete('+jsonData[one][key].form_id+',\''+jsonData[one][key].form_name+'\')">'+td_lang.general.workflow.msg_70+'</a>';
//							}
							jQuery('#form_list1').find('table').append('<tr form_id='+jsonData[one][key].form_id+'><td><span class="icon16-pencil-content">'+jsonData[one][key].form_name+'</span></td><td><a class="form_ahref" href="javascript:form_edit('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_64+'</a><a class="form_ahref" href="javascript:form_smart('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_65+'</a><a class="form_ahref" href="javascript:form_mobile_smart('+jsonData[one][key].form_id+')">'+msg_mobile+'</a><a class="form_ahref" href="javascript:form_preview('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_66+'</a><a class="form_ahref" href="javascript:form_import('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_67+'</a><a class="form_ahref" href="javascript:form_export('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_68+'</a><a class="form_ahref" href="javascript:form_version('+jsonData[one][key].form_id+')">'+td_lang.general.workflow.msg_69+'</a>'+del_flag+'</td></tr>');		  
							J++;
						}
					}
					else //图形视图
					{
						 if(i==0)
						{
							//onDblClick
							jQuery('#form_list').append('<div class="form_main form_folder" data-toggle="context" title="'+jsonData[one][key].sort_name+'" sort_parent="'+jsonData[one][key].sort_parent+'" sort_id="'+jsonData[one][key].sort_id+'" onclick="form_sort_parent('+jsonData[one][key].sort_id+',\''+jsonData[one][key].sort_name+'\')"><div class="form_mark">'+jsonData[one][key].sort_name_str+'</div></div>');	   
							K++;
						}else if(i==1){
							var formid = "key_"+jsonData[one][key].form_id;
							//var j_name = 'jsonData.key_3.'+formid;
							var del_flag = "true";
							//alert(jsonData)
//							if(eval(j_name)){
//								del_flag = "false";
//							}
							
							jQuery('#form_list').append('<div class="form_main form_content" ondblclick="form_smart('+jsonData[one][key].form_id+')" data-toggle="context"  del_flag="'+del_flag+'" form_id="'+jsonData[one][key].form_id+'" sort_id="'+jsonData[one][key].form_sort+'" data-target="#context-menu"  title="'+jsonData[one][key].form_name+'"><div class="form_mark">'+jsonData[one][key].form_name_str+'</div></div>'); 
							J++;  
						}
					}
				}
				i++;
			}	
			counter = eval(K + J);
			var form_id = jQuery('.form_content_hover').attr("form_id");			
			if(typeof(form_id)=="undefined" || form_id == "")
			{
				jQuery(".btn-info").attr({"disabled":"disabled"});
				jQuery(".btn-danger").attr({"disabled":"disabled"});
				jQuery(".show_hide_info").removeClass("btn-info");
				jQuery(".show_hide_danger").removeClass("btn-danger");
			}
			if(counter == 0)
			{
				if(typeof(search_area)=="undefined" || search_area=="")
				{
					var prompt_empty = td_lang.general.workflow.msg_167;
				}else{
					var prompt_empty = td_lang.general.workflow.msg_173;
				}
				
				if(model_icon == 2)
				{
					jQuery('#form_list1').find('table').append('<tr><td colSpan="2" id="form_prompt">'+prompt_empty+'<a href="javascript:form_new()" style="text-decoration:underline">'+td_lang.general.workflow.msg_168+'</a></td></tr>');
				}else{
					jQuery('#form_list').append('<div class="form_prompt_graph">'+prompt_empty+'<a href="javascript:form_new()" style="text-decoration:underline">'+td_lang.general.workflow.msg_168+'</a></div>');	   
				}				
			}
			jQuery('.form_content').mousedown(function(e)
			{
				 
				 //选中表单，解除禁止按钮状态
				jQuery(".form_main").removeClass('form_folder_hover');
				jQuery(".form_main").removeClass('form_content_hover');
				var currentNameStr = jQuery(this).attr('class');		
				var tmpNameStr = currentNameStr.replace('form_main ', '');
				jQuery(this).addClass(tmpNameStr+'_hover');
				//var form_id = jQuery('.form_content_hover').attr("form_id");
				jQuery('#form_id_hidden').val(form_id);
				jQuery(".show_hide_info").removeAttr("disabled");				
				jQuery(".show_hide_info").addClass("btn-info");
				
				
				//判断删除按钮显隐
				var del_flag = jQuery('.form_content_hover').attr("del_flag");
				//if(del_flag == "false"){
					//jQuery(".show_hide_danger").attr({"disabled":"disabled"});
					//jQuery(".show_hide_danger").removeClass("btn-danger");					
				//}else{
					jQuery(".show_hide_danger").removeAttr("disabled");
					jQuery(".show_hide_danger").addClass("btn-danger");
				//}
				
				if(3 == e.which){ //右击菜单
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
				 
				}
			});			
		},
		error: function(data)
		{
			alert(data.responseText);
		}
	});
	jQuery('#form_list').removeClass("loading");
	
	//连接头目录控制
	var obj = jQuery('.nav_link>ul').find("li[sort_id=" + sort_id + "]");
	var sort_id = jQuery('#sort_id_hidden').val();
	if(sort_id != "")
	{
		if(obj.length > 0)
		{	
			obj.nextAll().remove();
		}
		else
		{
			jQuery('.nav_link>ul').append('<li sort_id="'+sort_id+'"><span class="divider" style="color:#666666;font-size:12px;">>></span><a href="#" onclick="form_sort_parent('+sort_id+')">'+sort_name+'</a></li>');
		}	
	}else{
		obj.nextAll().remove();
		jQuery(".nav_link>ul").html("");
		jQuery(".nav_link>ul").append('<li sort_id="0" style="color:#666666;" id="title_all"><a href="#" onclick="form_sort_parent(0)">'+td_lang.general.workflow.msg_171+'</a></li>');
	}
	
	
}

//搜索
function form_select()
{
	var select_value = jQuery("input[name=form_select]").val();
	form_sort_parent("","","",select_value,"search_area");
}

//列表视图、缩略图切换
function changeImage(cookieIcon)
{
	if(cookieIcon)
	{
		var currSrc=cookieIcon;
	}else{
		var currSrc=jQuery('#img_icon').attr('src');
	}
	jQuery.cookie("cookieName",currSrc,{expires:30});
	if(currSrc=='/static/modules/workflow/system/flow_form/css/images/form_sort_list.png')
	{		
		jQuery('#img_icon').attr('src','/static/modules/workflow/system/flow_form/css/images/form_sort_view.png');
		jQuery('#icon_info').attr('title',td_lang.general.workflow.msg_71);
		jQuery('#icon_info').attr('model_icon','1');
		jQuery('#form_list1').show();	
		jQuery('#form_list').hide();
		jQuery(".show_hide_info").hide();
		jQuery(".show_hide_danger").hide();
		jQuery('#model_icon_hidden').val(2);
	}else if(currSrc=='/static/modules/workflow/system/flow_form/css/images/form_sort_view.png'){
		jQuery('#img_icon').attr('src','/static/modules/workflow/system/flow_form/css/images/form_sort_list.png');
		jQuery('#icon_info').attr('title',td_lang.general.workflow.msg_72);
		jQuery('#icon_info').attr('model_icon','2');
		jQuery('#form_list').show();	
		jQuery('#form_list1').hide();
		jQuery(".show_hide_info").show();
		jQuery(".show_hide_danger").show();
		jQuery('#model_icon_hidden').val(1);
	}
	var sort_id = jQuery('#sort_id_hidden').val();
	if(sort_id == "" || sort_id == "undefined")
	{
		sort_id = "0";
	}
	form_sort_parent(sort_id);
}
function reloadnew(sort_id)
{
	//window.location = window.location;	
	//window.location.reload("/general/system/workflow/flow_form/index.php" + window.location.search) ;
	window.location.reload("/general/system/workflow/flow_form/index.php?sort_id=" + sort_id) ;
}

function check_duplicate_form()
{
	if(jQuery('input[name="form_duplicate_name"]').val() == "")
	{
		alert(td_lang.general.workflow.msg_91);
		return false;
	}
	document.getElementById("duplicate_news").submit();
	jQuery('.close').click();
}

//验证表单名称重复
function check_form_name(form_id)
{
	var form_name= jQuery('input[name="form_name"]').val();
	if(form_id)
	{
		var formData = {"FORM_ID":form_id,"FORM_NAME":form_name};
	}else{
		var formData = {"FORM_NAME":form_name};
	}
	jQuery.ajax({
		type: "POST",
		url: "check_form_name.php",
		cache: false,
		async: false,
		data: formData,
		error: function(msg){
			alert(msg);
		},
		success: function(data){
			if(data == "-ERR")
			{	
				jQuery("#PRCS_ERPEAT").html("");		
				jQuery("#PRCS_ERPEAT").append('<div class="f_field_explain_label" id="PRCS_ERPEAT_PROMPT"><span class="f_field_explain_title_red">'+td_lang.system.workflow.msg_37+'</span></div>');
				jQuery('#F_PRCS_ID').focus();
				
			}else{
				jQuery("#PRCS_ERPEAT").html("");
			}
		}
	});
}