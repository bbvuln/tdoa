jQuery(document).ready(function(){
	if(typeof actionType != "undefined"){

		jQuery('.content-foot>div').hide();
		if(actionType == "handle"){
			jQuery('.content-foot>div#handle-btn-block').show();
			jQuery('#workflow-switcher').find('ul').find('li').click(function(){
				jQuery(this).siblings().removeClass('active')
				jQuery(this).addClass('active');
				var marker = jQuery(this).find('a').find('i').attr('class');
				if(marker == 'form'){
					jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop:0},1000);
				}else if(marker == 'attach'){
					var form_attachment = jQuery(window.frames["work_form_data"].document).find('#content-attchment');
					jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop:form_attachment.offset().top},1000);
				}else if(marker == 'remark'){
					var form_remark = jQuery(window.frames["work_form_data"].document).find('#content-remark');
					jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop:form_remark.offset().top},1000);
				}else if(marker == 'relation'){
					var form_remark = jQuery(window.frames["work_form_data"].document).find('#flow-relation');
					jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop:form_remark.offset().top},1000);
				}
			});
			
			jQuery('.op-block-container').on('mouseover', function(){
			    jQuery(this).addClass('op-block-container-hover');
			});
			jQuery('.op-block-container').on('mouseleave', function(){
			    jQuery(this).removeClass('op-block-container-hover');
			});
			jQuery('.op-block-container').on('click', function(){
				jQuery(this).siblings().removeClass('op-block-container-active');
			    jQuery(this).addClass('op-block-container-active');
			});
		
			jQuery('#e-mail-op').click(function(){
			    DoAction('mail_to');
				//var url = '/general/email/new/';
				//openWindow(url, 960, 600);
			});
			jQuery('#notify-op').click(function(){
			    DoAction('notify');
				//var url = '/general/notify/manage/new.php';
				//openWindow(url, 960, 600);
			});

			jQuery(document).on('click', '#back_ok', function(){
				jQuery(this).attr('disabled', 'disabled');
				var allow_back = jQuery('#allow_back').val();
				jQuery('#back_to_prcs').val('');
				if(allow_back == '1'){
					var checked_prcs = jQuery('input[type="checkbox"][name="back_prcs"]:checked');
					if(checked_prcs.length == 0){
						alert(td_lang.general.workflow.msg_255);
						jQuery(this).removeAttr('disabled');
						return false;
					}
					checked_prcs.each(function(i, v){
						jQuery('#back_to_prcs').val(jQuery('#back_to_prcs').val()+jQuery(v).attr('id')+',');
					});
				}else if(allow_back == '2'){
					if(jQuery('input[type="radio"][name="back_prcs"]:checked').length == 0){
						alert(td_lang.general.workflow.msg_255);
						jQuery(this).removeAttr('disabled');
						return false;
					}
					jQuery('#back_to_prcs').val(jQuery('input[type="radio"][name="back_prcs"]:checked').attr('id'));
				}
				var back_data = 'flow_id='+flow_id+'&run_name='+run_name+'&flow_prcs='+flow_prcs+'&prcs_id='+prcs_id+'&prcs_key_id='+prcs_key_id+'&run_id='+run_id+'&back_counter_singn='+jQuery('#back_counter_singn').val()+'&allow_back='+jQuery('#allow_back').val()
							+'&back_to_prcs='+jQuery('#back_to_prcs').val();
				jQuery.ajax({
					type:'POST',
					url: 'data/backhandle.php',
					data:back_data,
					success:function(msg){
						var msg_arr = msg.split('|');
						if(msg === 'SUCCESS|'){
							alert(td_lang.general.workflow.msg_256);
							workFlowBackAction();
						}else if(msg_arr[0] == 'ERROR'){
							alert(msg_arr[1]);
							jQuery('#back_ok').removeAttr('disabled');
							return false;
						}else{
							alert(td_lang.module.msg_49);
							alert(msg);
							jQuery('#back_ok').removeAttr('disabled');
							return false;
						}
					}
				});
			});
		}else if(actionType == "view"){
			jQuery('.content-foot>div#view-btn-block').show();
			jQuery('.title-work-level').find("select").attr("disabled", true);
		}
		
	}
});

function workFlowBackAction(){
	if(window.parent.hideForm){
		window.parent.hideForm()
	}else{
		TJF_window_close();
	}
}
function user_view(USER_ID)
{
    var mytop=(jQuery(document).height()-500)/2-30;
    var myleft=(jQuery(document).width()-780)/2;
    window.open("/general/ipanel/user/user_info.php?WINDOW=1&USER_ID="+USER_ID,"user_view","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=780,height=500,left="+myleft+",top="+mytop+"\"");
}
//此处有多个查看表单工作内容的方法 如view_work 后期可以归为一个
function form_view1(run_id, flow_id ){ 
	var url = "/general/approve_center/list/print/index.php?actionType=view";
	url += "&RUN_ID="+run_id;
	url += "&FLOW_ID="+flow_id;
	window.location = url;
}
function DoAction(action)
{
    switch(action)
    {
        case "notify": notify(); break;
        case "mail_to": mail_to(); break;
        case "SaveFile": SaveFile(); break;
        case "roll": roll();break;
        default:
        if(action!='')
        {
            var URL="/general/approve_center/plugin/operation/"+action+"?RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>";
            window.open(URL,action.substr(0,action.indexOf('.')-1),"status=0,toolbar=no,menubar=no,width=600,height=400,location=no,scrollbars=yes,resizable=yes");
            break;
        }
    }
}

function mail_to()
{
    window.open("../mail.php?RUN_ID="+run_id+"&FLOW_ID="+flow_id,"mail_to","status=0,toolbar=no,menubar=no,width=550,height=220,location=no,scrollbars=yes,resizable=no");
}

function notify()
{
	var url = "../notify.php?RUN_ID="+run_id+"&FLOW_ID="+flow_id;
	window.open(url,"notify","status=0,toolbar=no,menubar=no,width=550,height=220,location=no,scrollbars=yes,resizable=no");
}