jQuery(document).ready(function(){
	rd_btn_smtp_pass_click();
	rd_btn_use_sys_email_click();
	
});
function isInt(str)
{
	var reg = /^(-|\+)?\d+$/;
	return reg.test(str);
}
function rd_btn_use_sys_email_click(){
	var rd_btn_USE_SYS_EMAIL = jQuery('input[name="USER_SYS_EMAIL"]:checked').val();
	if(rd_btn_USE_SYS_EMAIL=="1")
	{
		jQuery("#SYS_EMAIL").removeAttr("disabled");
		jQuery('input[name="SMTP_SSL"]').removeAttr("disabled");
		jQuery("#SMTP_SERVER").removeAttr("disabled");
		jQuery("#SMTP_PORT").removeAttr("disabled");
		jQuery('input[name="SMTP_PASS"]').removeAttr("disabled");
		rd_btn_smtp_pass_click();
	}
	else
	{
		jQuery("#SYS_EMAIL").attr("disabled","disabled");
		jQuery('input[name="SMTP_SSL"]').attr("disabled","disabled");
		jQuery("#SMTP_SERVER").attr("disabled","disabled");
		jQuery("#SMTP_PORT").attr("disabled","disabled");
		jQuery('input[name="SMTP_PASS"]').attr("disabled","disabled");
		jQuery("#EMAIL_USER").attr("disabled","disabled");
		jQuery("#EMAIL_PASS").attr("disabled","disabled");
	}
}
function rd_btn_smtp_pass_click(){
	var rd_btn_smtp_pass = jQuery('input[name="SMTP_PASS"]:checked').val();
	if(rd_btn_smtp_pass=="0")
	{
		jQuery("#EMAIL_USER").attr("disabled","disabled");
		jQuery("#EMAIL_PASS").attr("disabled","disabled");
	}
	else
	{
		jQuery("#EMAIL_USER").removeAttr("disabled");
		jQuery("#EMAIL_PASS").removeAttr("disabled");
	}
}



function check_form_config(){
	var SMTP_PORT = jQuery('#SMTP_PORT').val();
	var FLOW_REMIND_BEFORE_TIME = jQuery('#FLOW_REMIND_BEFORE_TIME').val();
	var FLOW_REMIND_AFTER_TIME = jQuery('#FLOW_REMIND_AFTER_TIME').val();
	var EMAIL_TEXT = jQuery('#SYS_EMAIL').val();
	var rd_btn_USE_SYS_EMAIL = jQuery('input[name="USER_SYS_EMAIL"]:checked').val();
	if(SMTP_PORT=='')
	{
		SMTP_PORT=0;
	}
	
	if(isInt(FLOW_REMIND_BEFORE_TIME)==false)
	{
		alert(td_lang.general.workflow.msg_177);
		jQuery('#FLOW_REMIND_BEFORE_TIME').focus();
		return false;
	}
	if(isInt(FLOW_REMIND_AFTER_TIME)==false)
	{
		alert(td_lang.general.workflow.msg_178);
		jQuery('#FLOW_REMIND_AFTER_TIME').focus();
		return false;
	}
	if(rd_btn_USE_SYS_EMAIL=="1")
	{
		// if(IsEmail(EMAIL_TEXT)==false)
		// {
		// 	alert(td_lang.general.workflow.msg_205);
		// 	jQuery('#SYS_EMAIL').focus();
		// 	return false;
		// }
		// if(isInt(SMTP_PORT)==false||SMTP_PORT>10000||SMTP_PORT==10000)
		// {
		// 	alert(td_lang.general.workflow.msg_176);
		// 	jQuery('#SMTP_PORT').focus();
		// 	return false;
		// }
	}
	document.form1.submit();
	return true;
}
function IsEmail(email){
    var result= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return(result.test(email));
}