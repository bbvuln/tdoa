jQuery(document).ready(function() {
    if (window.top.bTabStyle) {
        jQuery("#return").click(function() {
            cancel_run_jobx2('0');
        });
        jQuery("#cancel").click(function() {
            cancel_run_jobx('0');
        });
        var tabId = 'tabs_' + window.top.jQuery.fn.getSelected() + '_iframe';
        window.top.document.getElementById(tabId).contentWindow.onclose = function() {
            //return checkCloseTab();
            return true;
        }
    } else {
        jQuery("#return").click(function() {
            back2workflowlist(1);
        });
        jQuery("#cancel").click(function() {
            cancel_run('0');
        });
    }
    if (typeof actionType != "undefined") {
        
        jQuery('.content-foot>div').hide();
        if (actionType == "handle") {
            jQuery('.content-foot>div#handle-btn-block').show();
            jQuery('#workflow-switcher').find('ul').find('li').click(function() {
                jQuery(this).siblings().removeClass('active')
                jQuery(this).addClass('active');
                var marker = jQuery(this).find('a').find('i').attr('class');
                if (marker == 'form') {
                    jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop: 0}, 1000);
                } else if (marker == 'attach') {
                    var form_attachment = jQuery(window.frames["work_form_data"].document).find('#content-attchment');
                    jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop: form_attachment.offset().top}, 1000);
                } else if (marker == 'remark') {
                    var form_remark = jQuery(window.frames["work_form_data"].document).find('#content-remark');
                    jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop: form_remark.offset().top}, 1000);
                } else if (marker == 'relation') {
                    var form_remark = jQuery(window.frames["work_form_data"].document).find('#flow-relation');
                    jQuery(window.frames["work_form_data"].document).find('html,body').animate({scrollTop: form_remark.offset().top}, 1000);
                } 
            });
            
            jQuery('#work-level').on('click', 'li', function(e) {
                var caret = '<span class="caret"></span>';
                jQuery('#work-level button')
                .html(jQuery(this).find('a').html() + caret)
                .attr('class', 'btn ' + this.className)
                .dropdown('toggle');
                jQuery('#work-level').trigger('refresh-menu');
                jQuery('input[name="work_level"]').val(this.getAttribute('data-value'));
                jQuery('input[name="work_level"]', window.frames["work_form_data"].document).val(this.getAttribute('data-value'));
                e.stopPropagation();
                return false;
            }).on('refresh-menu', function(){
                var $this = jQuery(this),
                    isnormal = $this.find('.btn').hasClass('normal-level');
                    clsName = isnormal ? 'normal-level' : 'urgency-level';
                $this.find('.dropdown-menu li').show();
                $this.find('.dropdown-menu li.' + clsName).hide();
            }).trigger('refresh-menu');;
            jQuery('.op-block-container').on('mouseover', function() {
                jQuery(this).addClass('op-block-container-hover');
            });
            jQuery('.op-block-container').on('mouseleave', function() {
                jQuery(this).removeClass('op-block-container-hover');
            });
            jQuery('.op-block-container').on('click', function() {
                jQuery(this).siblings().removeClass('op-block-container-active');
                jQuery(this).addClass('op-block-container-active');
            });
            
            jQuery('.communication-op-block').click(function() { //通迅交流
                // jQuery('.operation-pop').hide();
				jQuery('#pending-div-pop').hide();
				jQuery('#view-div-pop').hide();
                jQuery('.pop-overlay').show();
                var op_top = pop_top = jQuery(this).offset().top;
                var height = jQuery('#communication-div-pop').height();
                if (op_top + height > jQuery(window).height())
                    pop_top = jQuery(window).height() - height - 5;
                
				jQuery('#communication-div-pop').css({top: (jQuery('#operation-div-pop').offset().top + 10),left: (jQuery(this).offset().left + jQuery(this).width() + 10)});
                jQuery('#communication-div-pop').toggle();
            });
            jQuery('.operation-op-block').click(function() { //更多操作
                jQuery('.operation-pop').hide();
                jQuery('.pop-overlay').show();
                var op_top = pop_top = jQuery(this).offset().top;
                var height = jQuery('#operation-div-pop').height();
                if (op_top + height > jQuery(window).height())
                    pop_top = jQuery(window).height() - height - 5;
                
                jQuery('#operation-div-pop').css('top', pop_top);
                jQuery('#operation-div-pop .ui-poptip-arrow').css('top', (op_top - pop_top + 10) + 'px');
                jQuery('#operation-div-pop').show();
                hideHWPostil1();
            });
            jQuery('#pending_op').click(function() { //挂起区域
                jQuery('#view-div-pop').hide();
                jQuery('#communication-div-pop').hide();
				// 修改挂起区域无法对齐按钮 DJ 14/9/24
                jQuery('#pending-div-pop').css({top: (jQuery(this).offset().top),left: (jQuery(this).offset().left + jQuery(this).width() + 10)});
                jQuery('#pending-div-pop').toggle();
            });
            jQuery('#view_focus').click(function() { //查看关注
                jQuery('#pending-div-pop').hide();
				jQuery('#communication-div-pop').hide();
                jQuery.ajax({
                    type: "POST",
                    url: "data/focuswork.php",
                    data: "actionType=show&run_id=" + run_id + "&flow_id=" + flow_id,
                    success: function(msg) {
                        var info = msg.split("|");
                        if (info.length == 2) {
                            if (info[0] === 'Success') {
                                jQuery('#focus-warp').html(info[1]);
                            }
                        }
                    }
                });
                jQuery('#view-div-pop').css({top: (jQuery('#operation-div-pop').offset().top + 10),left: (jQuery(this).offset().left + jQuery(this).width() + 10)});
                jQuery('#view-div-pop').toggle();
            });
            jQuery('#focus-op').click(function() { //关注
                jQuery('.operation-pop').hide();
                showHWPostil1();
                if (!window.confirm(td_lang.general.workflow.msg_50)) {
                    return false;
                }
                jQuery.ajax({
                    type: "POST",
                    url: "data/focuswork.php",
                    data: "actionType=focus&run_id=" + run_id + "&flow_id=" + flow_id,
                    success: function(msg) {
                        if (msg === 'Success') {
                            alert(td_lang.general.workflow.msg_211);
                        } else if (msg === "Have") {
                            alert(td_lang.general.workflow.msg_212);
                        } else {
                            alert("Data Saved: " + msg);
                        }
                    }
                });
            });
            
            jQuery('#pending_ok').click(function() { //挂起
                jQuery.ajax({
                    type: "POST",
                    url: "data/workpendinghandle.php",
                    data: "run_id=" + run_id + "&key_prcs_id=" + prcs_key_id + '&active_time=' + jQuery('#pending_ipt').val(),
                    success: function(msg) {
                        if (msg === 'Success|') {
                            alert(td_lang.general.workflow.msg_217);
                            jQuery(".operation-pop").hide();
                            //showHWPostil1();
                            var child_window = jQuery(window.frames["work_form_data"].window)[0];
                            if(child_window)
                            {
                                child_window.CheckForm(2);
                            }
                            //jQuery.jBox.warning(jbox_warning, jbox_prompt, submit,{draggable: true});
                            //jQuery('#return').click();
                        }else{
                            var msg_arr = msg.split('|');
                            var error = msg_arr[1];
                            switch (error) {
                                case 'W-EG-PAUSE-001':
                                    alert(td_lang.general.workflow.msg_230);
                                    break;
                                case 'W-EG-PAUSE-002':
                                    alert(td_lang.general.workflow.msg_231);
                                    break;
                                case 'W-EG-PAUSE-002':
                                    alert(td_lang.general.workflow.msg_232);
                                    break;
                                case 'W-EG-PAUSE-002':
                                    alert(td_lang.general.workflow.msg_233);
                                    break;
                                case 'W-EG-PAUSE-002':
                                    alert(td_lang.general.workflow.msg_234);
                                    break;
                                default:
                                    alert(td_lang.general.workflow.msg_235);
                                    break;
                            }
                        }
                    }
                });
            });
            jQuery('#view_op').click(function() {
                jQuery('.operation-pop').hide();
                showHWPostil1();
                jQuery('.op-block-container').removeClass('op-block-container-active');
                var URL = "/general/approve_center/list/flow_view/index.php?RUN_ID=" + run_id + "&FLOW_ID=" + flow_id;
                loc_x = screen.availWidth / 2 - 400;
                loc_y = screen.availHeight / 2 - 260;
                window.open(URL, 'view', "height=400,width=1000,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" + loc_y + ",left=" + loc_x + ",resizable=yes");
            });
            jQuery('#to_print').click(function() { //打印
                var URL = "../print/?RUN_ID=" + run_id + "&FLOW_ID=" + flow_id + "&PRCS_ID=" + prcs_id + "&FLOW_PRCS=" + flow_prcs;
                //alert(URL);
                window.open(URL, 'print', "height=400,width=800,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
            });
            jQuery('#roll_op').click(function() { //归档
                jQuery('.operation-pop').hide();
                showHWPostil1();
                jQuery('.op-block-container').removeClass('op-block-container-active');
                var msg = td_lang.general.workflow.msg_219;
                if (window.confirm(msg)) 
                {
                    var URL = "../roll.php?RUN_ID=" + run_id + "&PRCS_ID=" + prcs_id+"&FLOW_PRCS=" + flow_prcs+ "&FLOW_ID=" + flow_id;
                    window.open(URL, 'roll', "height=400,width=800,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes");
                }
            });
            jQuery('#export_html_op').click(function() { //导出html
                jQuery('.operation-pop').hide();
                showHWPostil1();
                jQuery('.op-block-container').removeClass('op-block-container-active');
                window.open("/general/approve_center/query/export_zip.php?RUN_ID_STR=" + run_id +"&FLOW_PRCS=" + flow_prcs+ "&FLOW_ID=" + flow_id, "", "");
            });
            jQuery('#dump_file').click(function() { //转存
                jQuery('.operation-pop').hide();
                showHWPostil1();
                jQuery('.op-block-container').removeClass('op-block-container-active');
                var msg = td_lang.general.workflow.msg_218;
                if (window.confirm(msg)) 
                {
                    var URL = "/module/save_file/?ATTACHMENT_ID=approve_center,RUN_ID:" + run_id + "&ATTACHMENT_NAME=" + en_run_name;
                    loc_x = screen.availWidth / 2 - 200;
                    loc_y = screen.availHeight / 2 - 90;
                    window.open(URL, 'dump', "height=180,width=400,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" + loc_y + ",left=" + loc_x + ",resizable=yes");
                }
            });
            jQuery('#ok').on('click', function() { //委托确认
                //用户自定义js脚本执行程序
                var beforeCustomScript = jQuery("#intrustBeforeCustomScript").val();
                if(typeof beforeCustomScript !== 'undefined')
                {
                    var customScriptArr = beforeCustomScript.split(",");
                    for(var customScriptCount = 0; customScriptCount < customScriptArr.length; customScriptCount++)
                    {
                        if (typeof window[customScriptArr[customScriptCount]] == 'function')
                        {
                            var ret = window[customScriptArr[customScriptCount]]();
                            if(typeof ret !== 'undefined')
                            {
                                return;
                            } 
                        } 
                    }
                }
            
                var $sms_check_obj = jQuery('#myModal_intrust span.sms-check');
                var $sms_check_val = $sms_check_obj.hasClass('sms-bg-static') ? '' : 'checked';
                var $mobile_check_obj = jQuery('#myModal_intrust span.mobile-check');
                var $mobile_check_val = $mobile_check_obj.hasClass('mobile-bg-static') ? '' : 'checked';
                var serializeVal = jQuery('#instrust_plugin').serialize();
                if(serializeVal != "")
                {
                    serializeVal = "&" + serializeVal;
                }
                jQuery(this).attr('disabled', 'disabled');
                var dataTrObj = jQuery('.work-run-data');
                try {
                    jQuery('input[name^="intrust_run_"]').each(function(i, v) {
                        if (jQuery(v).val() == '') {
                            throw td_lang.general.workflow.msg_216;
                            return false;
                        }
                    });
                } catch (e) {
                    alert(e);
                    jQuery(this).attr('disabled', false);
                    return false;
                }
                var to_user = jQuery('input[name^="intrust_run_"][type="hidden"]').val();
                jQuery.ajax({
                    type: "POST",
                    url: "/module/approve_center/engine/data/work_to_intrust.php",
                    cache: false,
                    async: false,
                    data: "actionType=handle&msg_check=" + $sms_check_val + "&mobile_check=" + $mobile_check_val + "&op_flag=" + op_flag + "&run_name=" + jQuery('#run_name_block').attr('title') + "&action=submit&run_id=" + run_id + "&flow_id=" + flow_id + "&prcs_key_id=" + prcs_key_id + "&prcs_id=" + prcs_id + "&flow_prcs=" + flow_prcs + "&to_user=" + to_user + '&message_user='+jQuery('#myModal_intrust').find('#F_COPY_TO_ID').val() +  '&sms_content=' + jQuery('#myModal_intrust').find('#SMS_CONTENT').val() + serializeVal,
                    error: function(msg) {
                        jQuery(this).attr('disabled', false);
                        alert(msg);
                    },
                    success: function(msg) {
                        if (msg == "") {
                            var error_html = "<a href='javascript:;' data-toggle='tooltip' data-placement='top' title='' class='result_ok'></a>";
                            dataTrObj.find("td:eq(3)").find('.result-block').html(error_html);
                            setTimeout(function() {
                                wgotobackAction();
                            }, 1000);
                            //用户自定义js脚本执行程序
                            var afterCustomScript = jQuery("#intrustAfterCustomScript").val();
                            if(typeof afterCustomScript !== 'undefined')
                            {
                                var customScriptArr = afterCustomScript.split(",");
                                for(var customScriptCount = 0; customScriptCount < customScriptArr.length; customScriptCount++)
                                {
                                    if (typeof window[customScriptArr[customScriptCount]] == 'function')
                                    {
                                        var ret = window[customScriptArr[customScriptCount]]();
                                        if(typeof ret !== 'undefined')
                                        {
                                            return;
                                        } 
                                    } 
                                }
                            }
                        } else if (msg.substring(0, 5) == "ERROR") {
                            var msg_arr = msg.split("|");
                            var msg_info = msg_arr[1];
                            var error_html = "<a href='javascript:;' data-toggle='tooltip' data-placement='top' title='" + msg_info + "' class='result_error'></a>";
                            dataTrObj.find("td:eq(3)").find('.result-block').html(error_html);
                            jQuery('.result_error').tooltip('show');
                            jQuery('#ok').attr('disabled', false);
                        } else {
                            alert(msg);
                            jQuery('#ok').attr('disabled', false);
                        }
                    }
                });
            });
            jQuery('#ok_cancel').click(function(){
                showHWPostil1();
            });
            jQuery('#west').delegate('.intrust_lock_flag #single_intrust',"click",function(){
				var child_window = jQuery(window.frames["work_form_data"].window)[0];
                if (child_window) {
					child_window.CheckForm('intrust');
					// 办理界面点击委托按钮无反应 JD 14/9/24
					showInstrustDiv();
                }
                hideHWPostil1();
			});
            jQuery('#micro-msg-op').click(function() { //微迅
                jQuery(".operation-pop").hide();
                showHWPostil1();
                jQuery('.op-block-container').removeClass('op-block-container-active');
                var run_name_old = jQuery("#run_name_old").val();
                var url = '/general/status_bar/sms_back.php?FLOW_ID=' + flow_id + '&RUN_ID=' + run_id + '&FLOW_PRCS=' + flow_prcs + '&PRCS_ID=' + prcs_id + '&RUN_NAME=' + run_name_old + '&MODULE=approve_center';
                
                openWindow(url, 460, 330);
            });
            jQuery('#e-mail-op').click(function() {
                jQuery(".operation-pop").hide();
                showHWPostil1();
                jQuery('.op-block-container').removeClass('op-block-container-active');
                DoAction('mail_to');
            //var url = '/general/email/new/';
            //openWindow(url, 960, 600);
            });
            jQuery('#notify-op').click(function() {
                jQuery(".operation-pop").hide();
                showHWPostil1();
                jQuery('.op-block-container').removeClass('op-block-container-active');
                DoAction('notify');
            //var url = '/general/notify/manage/new.php';
            //openWindow(url, 960, 600);
            });


            jQuery(document).on('click', '#back_ok', function() {
                //用户自定义js脚本执行程序
                var beforeCustomScript = jQuery("#backBeforeCustomScript").val();
                if(typeof beforeCustomScript !== 'undefined')
                {
                    var customScriptArr = beforeCustomScript.split(",");
                    for(var customScriptCount = 0; customScriptCount < customScriptArr.length; customScriptCount++)
                    {
                        if (typeof window[customScriptArr[customScriptCount]] == 'function')
                        {
                            var ret = window[customScriptArr[customScriptCount]]();
                            if(typeof ret !== 'undefined')
                            {
                                return;
                            }
                        }
                    }
                }

                //# 会签不能为空
                if (jQuery('#back_counter_singn').val().trim() === '') {
                    alert(td_lang.general.workflow.msg_285);
                    return false;
                }
                /*//# 第二次会签时候保存第一次会签内容 王瑞杰 20140611
                 var child_window = jQuery(window.frames["work_form_data"].window)[0];
                 if (child_window) {
                 child_window.CheckForm('tt');
                 }*/
                var serializeVal = jQuery('#back_plugin').serialize();
                if(serializeVal != "")
                {
                    serializeVal = "&" + serializeVal;
                }
                jQuery(this).attr('disabled', 'disabled');
                var allow_back = jQuery('#allow_back').val();
                jQuery('#back_to_prcs').val('');
                if (allow_back == '1') {
                    var checked_prcs = jQuery('input[type="radio"][name="back_prcs"]:checked');
                    if (checked_prcs.length == 0) {
                        alert(td_lang.general.workflow.msg_255);
                        jQuery(this).removeAttr('disabled');
                        return false;
                    }
                    checked_prcs.each(function(i, v) {
                        jQuery('#back_to_prcs').val(jQuery('#back_to_prcs').val() + jQuery(v).attr('id') + ',');
                    });
                    var sms_check_obj=jQuery('#back-sms span.sms-check');
                    var sms_check_val=sms_check_obj.hasClass('sms-bg-static')?'':'checked';
                    var mobile_check_obj=jQuery('#back-mobile span.mobile-check');
                    var mobile_check_val=mobile_check_obj.hasClass('mobile-bg-static')?'':'checked';
                    var email_check_obj=jQuery('#back-email span.email-check');
                    var email_check_val=email_check_obj.hasClass('email-bg-static')?'':'checked';
                } else if (allow_back == '2') {
                    if (jQuery('input[type="radio"][name="back_prcs"]:checked').length == 0) {
                        alert(td_lang.general.workflow.msg_255);
                        jQuery(this).removeAttr('disabled');
                        return false;
                    }
                    jQuery('#back_to_prcs').val(jQuery('input[type="radio"][name="back_prcs"]:checked').attr('id'));
                    var sms_check_obj=jQuery('#back-sms span.sms-check');
                    var sms_check_val=sms_check_obj.hasClass('sms-bg-static')?'':'checked';
                    var mobile_check_obj=jQuery('#back-mobile span.mobile-check');
                    var mobile_check_val=mobile_check_obj.hasClass('mobile-bg-static')?'':'checked';
                    var email_check_obj=jQuery('#back-email span.email-check');
                    var email_check_val=email_check_obj.hasClass('email-bg-static')?'':'checked';
                }
				var backContent = jQuery('#back_counter_singn').val();
                var back_data = 'email_check='+email_check_val+'&mobile_check='+mobile_check_val+'&msg_check='+sms_check_val+'&flow_id=' + flow_id + '&run_name=' + run_name + '&flow_prcs=' + flow_prcs + '&prcs_id=' + prcs_id + '&prcs_key_id=' + prcs_key_id + '&run_id=' + run_id + '&back_counter_singn='+encodeURIComponent(backContent)+'&allow_back=' + jQuery('#allow_back').val()
                    + '&back_to_prcs=' + jQuery('#back_to_prcs').val() + serializeVal;
                jQuery.ajax({
                    type: 'POST',
                    url: 'data/backhandle.php',
                    data: back_data,
                    success: function(msg) {
                        var msg_arr = msg.split('|');
                        if (msg === 'SUCCESS|') {
                            alert(td_lang.general.workflow.msg_256);
                            setTimeout(function() {
                                workFlowBackAction();
                            }, 1000);

                            //用户自定义js脚本执行程序
                            var afterCustomScript = jQuery("#backAfterCustomScript").val();
                            if(typeof afterCustomScript !== 'undefined')
                            {
                                var customScriptArr = afterCustomScript.split(",");
                                for(var customScriptCount = 0; customScriptCount < customScriptArr.length; customScriptCount++)
                                {
                                    if (typeof window[customScriptArr[customScriptCount]] == 'function')
                                    {
                                        var ret = window[customScriptArr[customScriptCount]]();
                                        if(typeof ret !== 'undefined')
                                        {
                                            return;
                                        }
                                    }
                                }
                            }
                        } else if (msg_arr[0] == 'ERROR') {
                            alert(msg_arr[1]);
                            jQuery('#back_ok').removeAttr('disabled');
                            return false;
                        } else {
                            alert(td_lang.module.msg_49);
                            alert(msg);
                            jQuery('#back_ok').removeAttr('disabled');
                            return false;
                        }
                    }
                });
            });
            jQuery(document).on('click', '#back_cancel', function() {
                showHWPostil1();
            });
        } else if (actionType == "view") {
            jQuery('.content-foot>div#view-btn-block').show();
            jQuery('.title-work-level').find("button").addClass("disabled");
        }
    
    }
	lockButton();
});

function workFlowBackAction() {
	if(typeof(moduleType) != 'undefined' && moduleType == 'portal')
	{
		window.location = "/general/approve_center/list/";//工作台退回指定退回到待办
		return;
	}
    if (window.parent.hideForm) {
        window.parent.hideForm()
    } else {
        TJF_window_close();
    }
}
function user_view(USER_ID) 
{
    var mytop = (jQuery(document).height() - 500) / 2 - 30;
    var myleft = (jQuery(document).width() - 780) / 2;
    window.open("/general/ipanel/user/user_info.php?WINDOW=1&USER_ID=" + USER_ID, "user_view", "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=780,height=500,left=" + myleft + ",top=" + mytop + "\"");
}
//此处有多个查看表单工作内容的方法 如view_work 后期可以归为一个
function form_view1(run_id, flow_id) {
    var url = "/general/workflow/list/print/index.php?actionType=view";
    url += "&RUN_ID=" + run_id;
    url += "&FLOW_ID=" + flow_id;
    window.location = url;
}
function form_view(RUN_ID, FLOW_ID, PRCS_ID, archive_time)
{
    if (archive_time == "" || typeof(archive_time) == "undefined")
    {
        window.open("/general/approve_center/list/print/?RUN_ID=" + RUN_ID + "&FLOW_ID=" + FLOW_ID + "&PRCS_ID=" + PRCS_ID, "", "status=0,toolbar=no,menubar=no,width=" + (screen.availWidth - 12) + ",height=" + (screen.availHeight - 38) + ",location=no,scrollbars=yes,resizable=yes,left=0,top=0");
    } else
    {
        window.open("/general/approve_center/list/print/?RUN_ID=" + RUN_ID + "&FLOW_ID=" + FLOW_ID + "&PRCS_ID=" + PRCS_ID + "&archive_time=" + archive_time, "", "status=0,toolbar=no,menubar=no,width=" + (screen.availWidth - 12) + ",height=" + (screen.availHeight - 38) + ",location=no,scrollbars=yes,resizable=yes,left=0,top=0");
    }
}
function DoAction(action) 
{
    switch (action) 
    {
        case "notify":
            notify();
            break;
        case "mail_to":
            mail_to();
            break;
        case "SaveFile":
            SaveFile();
            break;
        case "roll":
            roll();
            break;
        default:
            if (action != '') 
            {
                var URL = "/general/workflow/plugin/operation/" + action + "?RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>";
                window.open(URL, action.substr(0, action.indexOf('.') - 1), "status=0,toolbar=no,menubar=no,width=600,height=400,location=no,scrollbars=yes,resizable=yes");
                break;
            }
    }
}

function mail_to() 
{
    window.open("../mail.php?RUN_ID=" + run_id + "&FLOW_ID=" + flow_id + "&PRCS_ID=" + prcs_id, "mail_to", "status=0,toolbar=no,menubar=no,width=550,height=220,location=no,scrollbars=yes,resizable=no");
}

function notify() 
{
    var url = "../notify.php?RUN_ID=" + run_id + "&FLOW_ID=" + flow_id + "&PRCS_ID=" + prcs_id + "&PRCS_KEY_ID=" + prcs_key_id;
    window.open(url, "notify", "status=0,toolbar=no,menubar=no,width=550,height=220,location=no,scrollbars=yes,resizable=no");
}
