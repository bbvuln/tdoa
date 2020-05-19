jQuery(document).ready(function(){
    jQuery(window).resize(function(){
        jQuery('.modal-body').css('max-height', jQuery(window).height()-150);
    });
    //跳转分页，回车实现
    if(jQuery('#gopage').length > 0){
        jQuery('#gopage').bind('keydown', function(e){
            if(e.keyCode == 13){
                jQuery('#gopager-img').click();
            }
        });
    }
});

//跳转分页实现方法
function gopager(){
    var gopage_val = parseInt(jQuery('#gopage').val());
    if(isNaN(gopage_val) || gopage_val <=0 || parseInt(jQuery('#sp_1_pager').html()) < gopage_val){
        alert(sprintf(td_lang.general.workflow.msg_89, parseInt(jQuery('#sp_1_pager').html())));
        jQuery('#gopage').val('');
        return false;
    }
    jQuery('.ui-pg-input').val(gopage_val);
    jQuery("#gridTable").jqGrid('setGridParam',{url:jQuery('#gopage_url').val(),page:gopage_val}).trigger('reloadGrid');
}

//弹出窗口样式接口 modal_id - 窗口id，tops - 上边距，widths - 窗口宽度 yhs - 2013.8.30
function open_bootcss_modal(modal_id,widths,tops)
{
	jQuery('#'+modal_id).modal
	({ 
		keyboard: false,
		backdrop:"static"
	}) 
	if(typeof(widths) == "undefined" || widths == "")
	{
		widths = 560;
	}
	 	if(typeof(tops) == "undefined" || tops == "")
	{
		tops = 10;
	}
 
	jQuery('#'+modal_id).css('width',widths+'px');
    jQuery('#'+modal_id).css('margin-left',-(widths/2)+'px');
	jQuery('#'+modal_id).css('top','15px');
    jQuery('.modal-body').css('max-height', jQuery(window).height()-150);
    jQuery('.modal-footer').css('padding', '8px 15px 8px');
}
jQuery(document).on('click', ".btn-group>.dropdown-menu>li", function(){
	jQuery(this).find("a").attr("href", "javascript:;");
	var buttonObj =jQuery(this).parent().parent().find("button[class*='btn']").first();
	jQuery(this).parent().parent().find("input:first").val(jQuery(this).find('span:first').attr('data_value'));
	var buttonHtml = buttonObj.html();
	var buttonText = buttonHtml.replace('<span class="caret"></span>','');
	var selectedText = jQuery(this).find("a").html();
	buttonObj.html(buttonHtml.replace(buttonText, selectedText));
	var cloneObj = jQuery(this).clone(true);
	jQuery(cloneObj).html(cloneObj.html().replace(selectedText, buttonText));
	jQuery(this).parent().append(jQuery(cloneObj));
	jQuery(this).remove();
	if(buttonObj.attr("id") == 'pager-selbox'){
		var selectObj = jQuery("select[class='ui-pg-selbox']");
		if(selectObj && selectObj.length == 1){
			selectObj.val(selectedText.replace(td_lang.general.workflow.msg_190,''));	
			selectObj.change();
		}
	}
});

function getLogGridTableSize(){
	var size = {};
	size.vHeight = jQuery(window).height()-jQuery('.search_area').outerHeight(true)-jQuery('.data-operation').outerHeight(true) - 50;
	size.vWidth = jQuery("body").width()-20;
	return size;
}
//-----------灯泡弹出div提示开始-----------------
function showIntro(obj,objIntro,topHeight,leftHeight)
{
	var offset=obj.offset();
	var left=offset.left;
	var top=offset.top;
	objIntro.css('position','absolute').css('top',top+topHeight).css('left',left+leftHeight).css('border','1px solid #a5a28a');	
}
function showTitle(tipId,introId,topHeight,leftHeight)
{
	var obj=jQuery('#'+tipId);
	var objIntro=jQuery('#'+introId);
	showIntro(obj,objIntro,topHeight,leftHeight);
	objIntro.toggle();
}
//----------灯泡弹出div提示结束
function closeTip(tipId)
{
	var obj=jQuery('#'+tipId);
	obj.hide();
}
//-------------上一步  下一步  切换 对应选项的 图片 以及 butoon 的显示开始---------

	jQuery(document).on("click", ".next_step", function()
			{			
				var hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
				hrefid = hrefid.substr(1);
				jQuery('.active').parent().find("li[class$='active']").next().addClass("active");
				jQuery('.active').parent().find("div[class$='active']").next().addClass("active");
				jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");
				jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
				showPic();
				showbtn();
			}
		);
		jQuery(document).on("click", '[name="btn_prev"]', function()
				{			
					hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
					hrefid = hrefid.substr(1);
					jQuery('.active').parent().find("li[class$='active']").prev().addClass("active");
					jQuery('.active').parent().find("div[class$='active']").prev().addClass("active");
					jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");
					jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
					showPic();
					showbtn();
				}
		);
		var objli=jQuery('#nav_left').find('li');
		jQuery(document).on("click", objli, function(){
			showPic();
			showbtn();
		});	
function showPic()
{
	var thisObj=jQuery('#nav_left').find('.active');
	if(thisObj.length>0){
		var thisClassName=thisObj.find('span').attr('class');
		var thisSlibings=thisObj.siblings();
		if(thisClassName!==undefined){
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
}
function showbtn()
{
	var objitem = jQuery('#nav_left').find('.active').attr('item');
	if(objitem=='first'){
		jQuery('[name="btn_prev"]').hide();
	}else{
		jQuery('[name="btn_prev"]').show();
	}
	if(objitem=='last'){
		jQuery('[name="btn_next"]').hide();
	}else{
		jQuery('[name="btn_next"]').show();
	}	
}
//-------------上一步  下一步  切换 对应选项的 图片 以及 butoon 的显示结束---------


function openWindow(url, width, height, params, target){
    var left = (screen.availWidth  - width)/2;
    var top  = (screen.availHeight - height)/2;

    var paramStr = "";
    if(typeof params == "undefined" || params == null){
        paramStr = "toolbar="     + "no,"
                 + "location="    + "no,"
                 + "status="      + "no,"
                 + "directories=" + "no,"
                 + "menubar="     + "no,"
                 + "scrollbars="  + "yes,"
                 + "resizable="   + "yes,"
                 + "left="        + left  + ", "
                 + "top="         + top   + ", "
                 + "width="       + width + ", "
                 + "height="      + height;
    }else{
		var toolbar = (typeof params['toolbar']  == "undefined" || params['toolbar']  == "") ? "no" : params['toolbar'];
		var locationX = (typeof params['location']  == "undefined" || params['location']  == "") ? "no" : params['location'];
		var status = (typeof params['status']  == "undefined" || params['status']  == "") ? "no" : params['status'];
		var directories = (typeof params['directories']  == "undefined" || params['directories']  == "") ? "no" : params['directories'];
		var menubar = (typeof params['menubar']  == "undefined" || params['menubar']  == "") ? "no" : params['menubar'];
		var scrollbars = (typeof params['scrollbars']  == "undefined" || params['scrollbars']  == "") ? "yes" : params['scrollbars'];
		var resizable = (typeof params['resizable']  == "undefined" || params['resizable']  == "") ? "yes" : params['resizable'];

        paramStr = "toolbar="     +  toolbar + ","
                 + "location="    + locationX + ","
                 + "status="      + status + ","
                 + "directories=" + directories + ","
                 + "menubar="     + menubar + ","
                 + "scrollbars="  + scrollbars + ","
                 + "resizable="   + resizable + ","
                 + "left="        + left  + ", "
                 + "top="         + top   + ", "
                 + "width="       + width + ", "
                 + "height="      + height;
    }
	if(typeof target != 'undefined' ){
		target = target.replace(new RegExp("[^0-9a-zA-Z\u4e00-\u9fa5]","gm"),'')
        winObj = window.open(url, target, paramStr);
    }else{
        winObj = window.open(url, "newopen", paramStr);
    }
	
    winObj.focus();
	return winObj;
}
function LoadWindow(FREE_OTHER,FLOW_ID, RUN_ID, PRCS_ID, FLOW_PRCS, TO_ID, TO_NAME)
{
	if(FREE_OTHER==1)
	{
		var URL="/general/workflow/list/others/user_select_prcs/?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
		var w=250;
		var h=300;
	}
	else if(FREE_OTHER==3)
	{
		var URL="/general/workflow/list/others/user_select_all/?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
		var w=400;
		var h=350;
	}
	var loc_y=loc_x=200;
	if(is_ie)
	{
		loc_x=document.body.scrollLeft+event.clientX-event.offsetX;
		loc_y=document.body.scrollTop+event.clientY-event.offsetY+210;
	}
	LoadDialogWindow(URL,self,loc_x, loc_y, w, h);
}
