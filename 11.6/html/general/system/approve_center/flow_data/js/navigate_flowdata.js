jQuery(document).ready(function()
{
	jQuery(window).resize(function(){
		jQuery('#nav-right-container').css('height',getMainDivHeight());
	});
	jQuery(window).trigger('resize');
	jQuery('#nav_left').find('a').click(function(event){ 
       event.preventDefault(); 
      jQuery(this).attr('data-toggle',''); 
   })
});
var flag_=0;
jQuery(document).on("click", ".next_step", function()
{	
	try{	
		if(typeof(eval(checkEssentialInfo))=='function')					
		{
			var  checked=checkEssentialInfo();
		}
	}catch(e)
		{
		}
		if(checked==false){
			return ;
		}	
	var hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
	hrefid = hrefid.substr(1);
 	   
    if(jQuery('.active').parent().find("div[class$='active']").next().attr('name')=='prev')
    {   
		var regex = /[^A-Za-z0-9]/i; 
		if(/.*[\u4e00-\u9fa5]+.*$/.test(jQuery.trim(document.form1.d_name.value)))
		{
			alert(td_lang.general.workflow.msg_127);
			jQuery('#d_name').focus();
			return (false);
		}
		if(jQuery.trim(document.form1.d_name.value).indexOf(" ")>-1)
		{
			alert(td_lang.general.workflow.msg_160);
			jQuery('#d_name').focus();
			return (false);
		}
		if(jQuery.trim(document.form1.d_name.value)=="")
		{
			alert(td_lang.general.workflow.msg_125);
			jQuery('#d_name').focus();
			return (false);
		}
		if(document.form1.d_name.value.length > 40){
			alert(td_lang.general.workflow.msg_275);
			jQuery('#d_name').focus();
			return (false);
		}
		if(regex.test(jQuery.trim(document.form1.d_name.value)))
		{
			alert(td_lang.general.workflow.msg_191);
			jQuery('#d_name').focus();
			return (false);
		}
		var flag_file=true;
		if(jQuery("li[name=basic_attr]").attr('item')!='first'){
			jQuery.ajax
			({		   
				url:"datasource_exists.php?d_name="+jQuery.trim(document.form1.d_name.value),
				async: false,
				success: function(data){
					if(jQuery.trim(data)!=''){
						flag_file=false;
						alert(data);
						jQuery("input[name=d_name]").focus();
						return false;
					}
				},
				error: function(data){		
					alert(data.responseText);
				}
			});
		}
		if(!flag_file){          
			return false;
		} 
		if(jQuery.trim(document.form1.d_desc.value)=="")
		{
			alert(td_lang.general.workflow.msg_126);
			jQuery('#d_desc').focus();
			return (false);
		}
        jQuery('.active').parent().find("div[class$='active']").next().next().addClass("active");
        jQuery('.active').parent().find("li[class$='active']").next().next().addClass("active");  
    }
    else
    {   
		if(jQuery('.active').parent().find("div[class$='active']").next().attr('id')=='defi_field')
		{	
			var regex = /[^A-Za-z0-9]/i; 
			if(/.*[\u4e00-\u9fa5]+.*$/.test(jQuery.trim(document.form1.d_name.value)))
			{
				alert(td_lang.general.workflow.msg_127);
				jQuery('#d_name').focus();
				return (false);
			}
			if(jQuery.trim(document.form1.d_name.value).indexOf(" ")>-1)
			{
				alert(td_lang.general.workflow.msg_160);
				jQuery('#d_name').focus();
				return (false);
			}
			if(jQuery.trim(document.form1.d_name.value)=="")
			{
				alert(td_lang.general.workflow.msg_125);
				jQuery('#d_name').focus();
				return (false);
			}
			if(document.form1.d_name.value.length > 40){
				alert(td_lang.general.workflow.msg_275);
				jQuery('#d_name').focus();
				return (false);
			}
			if(regex.test(jQuery.trim(document.form1.d_name.value)))
			{
				alert(td_lang.general.workflow.msg_191);
				jQuery('#d_name').focus();
				return (false);
			}
			var flag=true;
			if(jQuery("li[name=basic_attr]").attr('item')!='first'){
				jQuery.ajax
				({		   
					url:"datasource_exists.php?d_name="+jQuery.trim(document.form1.d_name.value),
					async: false,
					success: function(data){
						if(jQuery.trim(data)!=''){
							flag=false;
							alert(data);
							jQuery("input[name=d_name]").focus();
						}
					},
					error: function(data){		
						alert(data.responseText);
					}
				});
			}
			if(!flag){  		
				return false;
			} 
			if(jQuery.trim(document.form1.d_desc.value)=="")
			{
				alert(td_lang.general.workflow.msg_126);
				jQuery('#d_desc').focus();
				return (false);
			}
		}
        jQuery('.active').parent().find("li[class$='active']").next().addClass("active"); 
    	jQuery('.active').parent().find("div[class$='active']").next().addClass("active");
    }
   	jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");
	jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
	showPic();
	showbtn();
	
});
jQuery(document).on("click", '[name="btn_prev"]', function()
{		
	var objitem = jQuery('#nav_left').find('.active').attr('item');
	if(objitem!='first'){
		hrefid = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		hrefid = hrefid.substr(1);
        if(jQuery('.active').parent().find("div[class$='active']").prev().attr('name')=='prev')
        {   
  	        hrefid='import_file';
            jQuery('.active').parent().find("li[class$='active']").prev().prev().addClass("active");
            jQuery('.active').parent().find("div[class$='active']").prev().prev().addClass("active");
        }
        else
        {	
            jQuery('.active').parent().find("li[class$='active']").prev().addClass("active");
            jQuery('.active').parent().find("div[class$='active']").prev().addClass("tab-pane active");
        }
		
	}
    jQuery('.active').parent().find("li[class$='active']").find("a[href='#"+hrefid+"']").parent().removeClass("active");    
	jQuery('.active').parent().find("div[id='"+hrefid+"']").removeClass("active");
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
        jQuery('#save_edit').removeAttr("disabled");
        jQuery('#save_edit').addClass('btn-primary');
		jQuery('[name="btn_next"]').find('button').attr('disabled','true');
		jQuery('[name="btn_next"]').find('button').removeClass('btn-primary');
	}else{
	    jQuery('#save_edit').attr('disabled','true');
        jQuery('#save_edit').removeClass('btn-primary');
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
function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var bottomHeight=jQuery('.work_bottom').outerHeight(true);
	var MainDivHeight=windowsHeight-(25+bottomHeight+20);
	return MainDivHeight;
}
