window.onload = function()
{	
	jQuery("a[data-toggle='tab']").parent().click(function(){
		return checkEssentialInfo();
	});
	jQuery(window).resize(function(){
		jQuery('#nav-right-container').css('height',getMainDivHeight());
	});
	jQuery(window).trigger('resize');
	document.getElementById("remind_fld").disabled= document.getElementById("REMIND_ORNOT").checked? false : true;
	jQuery("#form1").find("input[type='radio']").click(function(){
		var now_checked = jQuery(this).attr('checked');
		jQuery("#form1").find("input[type='radio'][name="+this.name+"][value!="+this.value+"]").attr('checked',false);
		if(now_checked == 'checked')
		{
			jQuery(this).attr('checked',false);
		}
		else
		{
			jQuery(this).attr('checked','checked');
		}
	});
    var objli=jQuery('#nav_left').find('li');
    jQuery(document).on("click", objli, function(){
        showPic();
        showbtn();
    });
};

//流转设置会签意见显示控制
function signChange(obj,unable)
{
	var is_checked = !(jQuery(obj).attr('checked') == 'checked');
	if(is_checked && unable != 1)
	{
		jQuery("#signlook").css('display', 'inline');
	}
	else
	{
		jQuery("#signlook").find("input[type='radio'][name='SIGNLOOK']").attr('checked',false);
		jQuery("#signlook").css('display', 'none');
	}
	var is_checked = !(jQuery(obj).attr('checked') == 'checked');
	if(is_checked && unable != 1)
	{
		jQuery("#feedback").css('display', 'inline');
	}
	else
	{
		jQuery("#feedback").find("input[type='radio'][name='FEEDBACK']").attr('checked',false);
		jQuery("#feedback").css('display', 'none');
	}
    var is_checked = !(jQuery(obj).attr('checked') == 'checked');
    if(is_checked && unable == 2)
    {
        jQuery("#signselect").css('display', 'inline');
    }else
    {
        jQuery("#signselect").css('display', 'none');
    }
}

function prcs_checkForm()
{	
	if(jQuery("#set_all_id").val()=="")
	{
		alert(td_lang.general.workflow.msg_179);
		return false;
	}
    if((jQuery('#F_REMOVE_COPY:checked').val() == 1 && jQuery.trim(jQuery('#F_COPY_TO_ID').val())=='')
        || (jQuery('#F_REMOVE_OPERATOR:checked').val() == 1 && jQuery.trim(jQuery('#F_OPERATOR_TO_ID').val())=='')
        || (jQuery('#F_REMOVE_OPERATOR:checked').val() == 1 && jQuery.trim(jQuery('#F_PRIV_ID').val())=='')){
        if(!confirm(td_lang.general.workflow.msg_289)){
            return false;
        }
    }
	document.getElementById("form1").submit();
}
function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var bottomHeight=jQuery('.work_bottom').outerHeight(true);
	var MainDivHeight=windowsHeight-(25+bottomHeight+20);
	return MainDivHeight;
}
function checkEssentialInfo()
{
	var flow_name= jQuery('#textarea_id').val();
	if( flow_name=='')
	{
		alert(td_lang.system.workflow.msg_29);
		jQuery('#textarea_id').focus();
		return false;
	}
}
function close_flow()
{
	window.close();
}


//流转设置退回是否重新走流程显示控制
function backChange(obj)
{
    if(obj != 0)
    {
        jQuery("#backflow").css('display', 'inline');
        if(obj == 2)
        {
            jQuery("#backway").css('display', 'inline');
		}else
		{
            jQuery("#backway").css('display', 'none');
		}
	}
	else
	{
        jQuery("#backflow").css('display', 'none');
        jQuery("#backway").css('display', 'none');
	}


}

//强制合并
function gather_set(value)
{
	if(value == 1)
    {
        jQuery('#gather_set').show();
    }
    else
    {
        jQuery('#gather_set').hide(); //强制合并选项隐藏
    }
}