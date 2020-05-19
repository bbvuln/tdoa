jQuery.noConflict();
var sync_deal = ''; // 并发
var turn_priv = ''; // 强制转交
var gather_node = ''; // 强制合并
var submit_timer = null;
function cancel_run(tab) 
{
    var msg = jbox_confirm;
    if (window.confirm(msg)) 
    {
        var url = '/general/workflow/list/input_form/cancel.php?AUTO_NEW=' + auto_new + '&MENU_FLAG=' + menu_flag + '&RUN_ID=' + run_id + '&FLOW_ID=' + flow_id + '&TAB=' + tab + '&callback=back2workflowlist';
        document.getElementById('work_form_data').src = url;
        return true;
    } 
    else 
    {
        var child_window = jQuery(window.frames["work_form_data"].window)[0];
        if (child_window) {
            child_window.CheckForm(1);
        }
        return false;
    }
}
function cancel_run_jobx(tab)  //新建工作关闭提示
{
    var submit = function(v, h, f) {
        if (v == 'yes') {
            //jQuery.jBox.tip('是。', 'success');      
            var child_window = jQuery(window.frames["work_form_data"].window)[0];
            if (child_window) {
                child_window.CheckForm(2);
            }
        }
        if (v == 'no') {
            //jQuery.jBox.tip('没保存。');			     
            var url = '/general/workflow/list/input_form/cancel.php?AUTO_NEW=' + auto_new + '&MENU_FLAG=' + menu_flag + '&RUN_ID=' + run_id + '&FLOW_ID=' + flow_id + '&TAB=' + tab + '&callback=back2workflowlist';
            document.getElementById('work_form_data').src = url;
        }
        if (v == 'cancel') {
        //jQuery.jBox.tip('已取消。');
        }
        
        return true;
    };
    // 可根据需求仿上例子定义按钮
    jQuery.jBox.warning(jbox_warning, jbox_prompt, submit, {draggable: false});
}
function cancel_run_jobx2(tab)  //办理中关闭提示
{
    var submit = function(v, h, f) {
        if (v == 'yes') {
            var child_window = jQuery(window.frames["work_form_data"].window)[0];
            var run_name = jQuery("#Symbol").val();
            jQuery(window.frames["work_form_data"].document).find("#Symbol").val(run_name);
            jQuery(window.frames["work_form_data"].document).find("#run_name_old").val(jQuery("#run_name_old").val());
            if (child_window) {
                child_window.CheckForm(2);
            }
        }
        if (v == 'no') {
            back2workflowlist();
        }
        if (v == 'cancel') {
        //jQuery.jBox.tip('已取消。');
        }
        
        return true;
    };
    // 可根据需求仿上例子定义按钮
    jQuery.jBox.warning(jbox_warning, jbox_prompt, submit, {draggable: false});
}
function back2workflowlist() {
    if (window.top == window.self) 
    {
        //			window.TJF_window_close&&window.TJF_window_close();
        window.location = "/general/workflow/list/";
    } else {
        if (window.parent.hideForm) 
        {
            
            if (!window.parent.hideForm) {
                window.location = "/general/workflow/list/";
                return false;
            }
            ;
            window.parent.hideForm();
        } else {
            var urlForm = window.top.location.href;
            if (urlForm.match(/module\/nav/)) 
            {
                //	window.TJF_window_close&&window.TJF_window_close();
                window.location = "/general/workflow/list/";
            } else {
                window.location = "/general/workflow/new/";
            }
        }
    }
}
function showSaveDiv() {
    jQuery('#myModalLabel').html(saveStr);
    jQuery('#myModal').find('.modal-body').html('<center style="height:298px;line-height:298px;"><img src="/static/images/loading_blue.gif" /></center>');
    jQuery('#myModal').find('.modal-footer').css("height","37px");
    open_bootcss_modal('myModal', "960", "1");
    jQuery('#myModal').find("button").hide();
}
function closeSaveDiv() {
    showHideButton();
    jQuery('#myModal button.close').trigger('click');
}
function showHideButton() {
    jQuery('#myModal .modal-footer').find("button").show();
}
function showusbdiv() {
    open_bootcss_modal('myModal_usbkey', "400", "10");
}
function closeusbdiv() {
    jQuery('#myModal_usbkey button.close').trigger('click');
}
function unlockButton() {
    jQuery("#save").attr('disabled', false);
    jQuery("#save_return").attr('disabled', false);
    jQuery("#handle_complete").attr('disabled', false);
    jQuery("#next").attr('disabled', false);
}

function addTimer() {
    window.submit_timer = setTimeout(function() {
        window.location = window.location.href;
    }, 5000);
}

function clearTimer() {
    clearTimeout(submit_timer);
    window.submit_timer = null;
}
function showInstrustDiv() {
    jQuery('#pending-div-pop').hide();
    jQuery('#view-div-pop').hide();
    jQuery(".operation-pop").hide();
    jQuery('.op-block-container').removeClass('op-block-container-active');
    jQuery('#myModalLabel_intrust').html(td_lang.general.workflow.msg_59);
    open_bootcss_modal('myModal_intrust', 880, '');
    jQuery('#myModal_intrust').find('.modal-body').load('/module/workflow/engine/data/work_run_intrust.php', function() {
        var Symbol = jQuery('#Symbol').val();
        if (Symbol) 
        {
            var run_name = jQuery('#Symbol').val();
        } else {
            var run_name = jQuery('#run_name_old').val();
        }
        var intrust_conten_obj = jQuery('#myModal_intrust').find('#SMS_CONTENT');
        if(intrust_conten_obj.length != 0)
        {
            var new_content = intrust_conten_obj.val().replace('[PRCS_NAME]', run_name);
            intrust_conten_obj.val(new_content);
        } 
        jQuery('.work-remind-message input[type="checkbox"]').hide();
        var selectData = {
            'run_id': run_id,
            'run_name': run_name,
            'prcs_name': jQuery('#prcs_name_block').html().substr(0, 50),
            'prcs_key_id': prcs_key_id,
            'flow_id': flow_id,
            'prcs_id': prcs_id,
            'delegate_type': free_other,
            'flow_prcs': flow_prcs
        };
        var SMS_CONTENT_SIZE = td_lang.general.workflow.msg_258 + run_name;
        jQuery("#SMS_CONTENT").val(SMS_CONTENT_SIZE);
        
        var resultData = selectData;
        var Data = {"runData": resultData};
        var template = jQuery.templates("#intrustDataTmpl");
        var htmlOutput = template.render(Data);
        jQuery("#intrustData").html(htmlOutput);
        jQuery("button[btntype='work_run_intrust']").click(function() { //普通操作
            var attrTrObj = jQuery(this).parent().parent();
            attrTrObj.find("td:eq(3)").find('.result-block').html('');
            jQuery('.result_error').tooltip('hide');
            var delegate_type = attrTrObj.attr('delegate_type');
            if (delegate_type === '2') { //自由委托  btn-primary
                var module_id = '', 
                to_id = attrTrObj.find('input[type="hidden"]').attr('id'), 
                to_name = attrTrObj.find('input[type="text"]').attr('id'), 
                manage_flag = '1', 
                form_name = "form1";
                window.org_select_callbacks = window.org_select_callbacks || {};
                window.org_select_callbacks.add = function(item_id, item_name) {
                };
                window.org_select_callbacks.remove = function(item_id, item_name) {
                };
                window.org_select_callbacks.clear = function() {
                };
                SelectUserSingle('5', module_id, to_id, to_name, manage_flag, form_name);
            } else if (delegate_type === '1') { //仅允许委托当前步骤经办人 btn-info 此类型不存在指操作，因为记录的RUN_ID不同，而经办人权限中用到了RUN_ID故单个处理
                var run_id = jQuery(this).attr('run_id');
                var flow_id = jQuery(this).attr('flow_id');
                var prcs_id = jQuery(this).attr('prcs_id');
                var flow_prcs = jQuery(this).attr('flow_prcs');
                var to_id = attrTrObj.find('input[type="hidden"]').attr('id');
                var to_name = attrTrObj.find('input[type="text"]').attr('id');
                LoadWindow(delegate_type, flow_id, run_id, prcs_id, flow_prcs, to_id, to_name);
            } else if (delegate_type === '3') { //按步骤设置的经办权限委托  btn-warning
                var run_id = jQuery(this).attr('run_id');
                var flow_id = jQuery(this).attr('flow_id');
                var prcs_id = jQuery(this).attr('prcs_id');
                var flow_prcs = jQuery(this).attr('flow_prcs');
                var to_id = attrTrObj.find('input[type="hidden"]').attr('id');
                var to_name = attrTrObj.find('input[type="text"]').attr('id');
                LoadWindow(delegate_type, flow_id, run_id, prcs_id, flow_prcs, to_id, to_name);
            }
        });
    });
}
function LoadUserWindow() 
{
    var URL = "/general/workflow/list/others/user_select_by_prcs/?TO_ID=SIGN_ID&TO_NAME=SIGN_NAME&FLOW_ID=" + flow_id + "&RUN_ID=" + run_id + "&PRCS_ID=" + prcs_id + "&FLOW_PRCS=" + flow_prcs;
    var loc_y = loc_x = 200;
    if (is_ie) 
    {
        loc_x = document.body.scrollLeft + event.clientX - event.offsetX;
        loc_y = document.body.scrollTop + event.clientY - event.offsetY;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 380, 350);
}
jQuery(document).ready(function() {
    var $ = jQuery;
    if (actionType == "view") {
        jQuery(".owner-block").hide();
    }
    $(document).on('click', '.pop-overlay', function() {
        $('.pop-overlay, .operation-pop').hide();
        $('.op-block-container').removeClass('op-block-container-active');
    });
    $('#toolbar-handle').click(function() {
        var $this = $(this);
        if ($this.hasClass('in')) {
            $this.removeClass('in');
            //$('#west').removeClass('in');
            $("#west").stop(true, true).animate({left: "-55px"}, 500);
            $("#center").stop(true, true).animate({left: "0px"}, 500);
        } else {
            $this.addClass('in');
            //$('#west').addClass ('in');
            $("#west").stop(true, true).animate({left: "0px"}, 500);
            $("#center").stop(true, true).animate({left: "50px"}, 500);
        }
    });
    var urlForm = window.top.location.href;
    if (window.top == window.self || urlForm.match(/module\/nav/)) 
    {
        jQuery("#return").val(td_lang.general.workflow.msg_267);
        jQuery("#save_return").val(td_lang.general.workflow.msg_269);
    } else {
        jQuery("#return").val(td_lang.general.workflow.msg_268);
        jQuery("#save_return").val(td_lang.general.workflow.msg_270);
    }
    
    jQuery(document).on('click', '.work-msg-title', function() {
        var img_src = jQuery('#msg-control>img').attr('src');
        var img_src_arr = img_src.split('/');
        var pic_name = img_src_arr[img_src_arr.length - 1];
        if (pic_name == 'unfold.png') {
            jQuery('#msg-control>img').attr('src', img_src.replace('unfold.png', 'fold.png'));
        } else {
            jQuery('#msg-control>img').attr('src', img_src.replace('fold.png', 'unfold.png'));
        }
        jQuery('.work-msg-content').toggle();
    });
    jQuery("#next").click(function() { //转交下一步
        if (top_flag == 2) { //无主办会签的情况
            var child_window = jQuery(window.frames["work_form_data"].window)[0];
            if (child_window) {
                //判断是否已经会签
                if(!child_window.is_finish_feedback()){
                    return;
                }
            }
        }
        jQuery(this).attr('disabled', true);
        var child_window = jQuery(window.frames["work_form_data"].window)[0];
        
        jQuery(window.frames["work_form_data"].document).find("#Symbol").val(run_name);
        jQuery(window.frames["work_form_data"].document).find("#run_name_old").val(jQuery("#run_name_old").val());
        if (child_window) {
            //addTimer();
            if(edit_run_name(jQuery("#run_id_old").val(), 2, 2) == false){
                jQuery(this).attr('disabled', false);
                return;
            }
            child_window.CheckForm('t');
        }
    });
    jQuery('#fallback').click(function() {
        var allow_back = jQuery('#allow_back').val();
        //    	jQuery(this).attr('disabled', true);
        //var windowtest = jQuery(window.frames["work_form_data"].window)[0];
        //var ckeditorval = windowtest.CKEDITOR.instances.TD_HTML_EDITOR_CONTENT.getData();    	
        jQuery.getJSON('data/getflowprcsdata.php', {flow_id: flow_id,allow_back: allow_back,run_id: run_id,flow_prcs: flow_prcs,prcs_id: prcs_id,prcs_key_id:prcs_key_id}, function(jsonData) {
            var back_data = {allow_back: allow_back,allow_data: jsonData};
            var Data = {"backData": back_data};
            var template = jQuery.templates("#backDataTmpl");
            var htmlOutput = template.render(Data);
            jQuery("#back_block").html(htmlOutput);
			if(jQuery("#is_child").length != 0)
			{
				jQuery("#back_ok").hide();
			}
            open_bootcss_modal('myModal_allow_back', "560", "5");
        });
    });
    jQuery("#add_sign_user").click(function() { // 增加会签人
        var data = "sign_type=" + sign_type + "&flow_id=" + flow_id + "&run_id=" + run_id + "&prcs_id=" + prcs_id + "&prcs_key_id=" + prcs_key_id + "&flow_prcs=" + flow_prcs;
        jQuery.ajax({
            url: "data/getsignhtml.php",
            type: "POST",
            data: data,
            success: function(data) {
                jQuery('#add_sign_user_div').html(data);
                open_bootcss_modal('myModal_add_sign_user', "480", "10");
            }
        });
    });
    jQuery("#add_sign_user_ok").click(function() { // 增加会签人 添加
        var sign_user_ids = jQuery.trim(jQuery('#SIGN_ID').val());
        var sign_user_names = jQuery.trim(jQuery('#SIGN_NAME').val());
        if (sign_user_ids == '') {
            alert(td_lang.system.workflow.msg_31);
            return false;
        }
        var data = "sign_user_ids=" + sign_user_ids + "&sign_user_names=" + sign_user_names + "&flow_id=" + flow_id + "&run_id=" + run_id + "&prcs_id=" + prcs_id + "&flow_prcs=" + flow_prcs;
        jQuery.ajax({
            url: "data/addsign.php",
            type: "POST",
            data: data,
            success: function(data) {
                var data_arr = data.split('|');
                if (data_arr.length != 3) {
                    return false;
                }
                var have_user = data_arr[1];
                var have_user_arr = have_user.split('=');
                var add_user = data_arr[2];
                var add_user_arr = add_user.split('=');
                if (data_arr[0] === 'SUCCESS') {
                    var str = td_lang.general.workflow.msg_262;
                    if (have_user_arr[1] != '') {
                        var tmp_str = sprintf(td_lang.general.workflow.msg_264, have_user_arr[1]);
                        str += tmp_str;
                    }
                    if (add_user_arr[1] != '') {
                        var tmp_str = sprintf(td_lang.general.workflow.msg_263, add_user_arr[1]);
                        str += tmp_str;
                    }
                    
                    alert(str);
                    return false;
                } else {
                    alert(td_lang.general.workflow.msg_265);
                    return false;
                }
            }
        });
    
    });
    jQuery("#save").click(function() { // 保存处理
        jQuery(this).attr('disabled', true);
        var child_window = jQuery(window.frames["work_form_data"].window)[0];
        var run_name = jQuery("#Symbol").val();
        if(typeof(run_name) != 'undefined' && jQuery.trim(run_name) == ''){
            alert(td_lang.general.workflow.msg_286);
            jQuery(this).attr('disabled', false);
            return;
        }
        jQuery(window.frames["work_form_data"].document).find("#Symbol").val(run_name);
        jQuery(window.frames["work_form_data"].document).find("#run_name_old").val(jQuery("#run_name_old").val());
        if (child_window) {
            child_window.CheckForm(1);
        }
    });
    jQuery("#close").click(function() { // 关闭
        window.close();
    });
    jQuery("#save_return").click(function() { // 保存处理
        jQuery(this).attr('disabled', true);
        var run_name = jQuery("#Symbol").val();
        jQuery(window.frames["work_form_data"].document).find("#Symbol").val(run_name);
        jQuery(window.frames["work_form_data"].document).find("#run_name_old").val(jQuery("#run_name_old").val());
        var child_window = jQuery(window.frames["work_form_data"].window)[0];
        if (child_window) {
            child_window.CheckForm(2);
        }
    });
    jQuery("#handle_complete_free").click(function() { // 自由流程结束流程
        jQuery(this).attr('disabled', true);
        var child_window = jQuery(window.frames["work_form_data"].window)[0];
        
        if (child_window) {
//            child_window.finish_run(); 
//            child_window.CheckForm(7);
             child_window.stop_run();
            
        }
    });
    jQuery("#handle_complete").click(function() { // 会签
        jQuery(this).attr('disabled', true);
        if (top_flag == 2) { //无主办会签的情况
            jQuery.ajax({
                url: "data/checklastop.php",
                data: "flow_id=" + flow_id + "&run_id=" + run_id + "&flow_prcs=" + flow_prcs + "&prcs_key_id=" + prcs_key_id + "&prcs_id=" + prcs_id,
                type: "get",
                success: function(msg) {
                    if (msg == '') {
                        var child_window = jQuery(window.frames["work_form_data"].window)[0];
                        if (child_window) {
                            child_window.finish_run();
                        }
                    } else if (msg == "1") {
                        var child_window = jQuery(window.frames["work_form_data"].window)[0];
                        if (child_window) {
                            child_window.CheckForm('t');
                        }
                    }
                }
            });
        } else {
            var child_window = jQuery(window.frames["work_form_data"].window)[0];
            if (child_window) {
                child_window.finish_run();
            }
        }
        return false;
    });
    jQuery('#work_run_submit').on('click', function() { // 工作转交下一步的确认操作
    	
        if (typeof turn_submit_flag == 'undefined') {
            jQuery(this).next().trigger('click');
            return false;
        }
        
        if (flow_type == 2) 
        {
            //save_free_prcs.call(this);
            var $nextPrcs = jQuery('#workFreeNextPrcs');
            var chose_obj = jQuery(window.frames["work_form_data"].document).find('#PRCS_CHOOSE');
            var freePrcsData = window.freePrcsSelector.serialize();
            
            if (freePrcsData === false) {
                return false;
            } else {
                var $freeInput = jQuery(window.frames["work_form_data"].document).find('#freePrcsData');
                if (!$freeInput.size()) {
                    $freeInput = jQuery('<input type="hidden">').attr({
                        id: 'freePrcsData',
                        name: 'freePrcsDataName'
                    });
                    $freeInput.appendTo(jQuery(window.frames["work_form_data"].document).find('form[name="form1"]'));
                }
                $freeInput.val(JSON.stringify(freePrcsData));
            }
            
            try {
                var next_prcs = prcs_id + 1;
                var flow_prcs = window['flow_type'];
                if (jQuery('#PRCS_USER' + flow_prcs).val() == '') {
                    throw td_lang.general.workflow.msg_245;
                    return false;
                }
                if (jQuery('#TOP_FLAG' + flow_prcs).val() === '0' && jQuery('#PRCS_OP_USER' + flow_prcs).val() == '') {
                    throw td_lang.general.workflow.msg_244;
                    return false;
                }
                chose_obj.val(next_prcs);
                jQuery(window.frames["work_form_data"].document).find('#next_prcs_num').val(next_prcs);
                var msg = jQuery('#tips_message').html();
                if(typeof(msg) != "undefined" && msg != '' && !confirm(msg)){
                    return false;
                }
            } catch (e) {
                alert(e);
                return false;
            }
        } 
        else 
        {
        
            if (jQuery("li[id^='next_prcs_'][class*='active']").length == 0) {
                alert(td_lang.general.workflow.msg_249);
                return false;
            }

            var PRCS_TYPE = jQuery("#PRCS_TYPE").val();
            var RUN_PRCS_NAME = jQuery("#RUN_PRCS_NAME").val();
          
            var prcs_name_flag = true;
            if(PRCS_TYPE == 3)
            {
                jQuery("li[id^='next_prcs_'][class*='active']").each(function() {
                    
                    var a_prcs_id = jQuery(this).attr('id').split('_');
                    var FLOW_PRCS_TYPE = jQuery("#FLOW_PRCS_TYPE").val();
                    if (a_prcs_id.length == 3) {
                        var s_prcs_ids = a_prcs_id[2];
                        if ((s_prcs_ids == FLOW_PRCS_TYPE) && RUN_PRCS_NAME=="") {
                            alert(td_lang.general.workflow.msg_274);
                            jQuery("#RUN_PRCS_NAME").focus(); 
                            prcs_name_flag = false;
                        } 
                    }
                });
            }
            if(prcs_name_flag == false)
            {
                return false;
            }
            
            if ((jQuery("li[id^='next_prcs_'][class*='active']").length != jQuery("#work-next-prcs-block").find('li').length)) {
                if (jQuery("li[id^='next_prcs_'][class*='active']").length == 1 && jQuery("li[id^='next_prcs_'][class*='active']").attr('id') == 'next_prcs_0') {
                    if (!confirm(td_lang.general.workflow.msg_250)) {
                        return false;
                    }
                } else {
                    alert(td_lang.general.workflow.msg_244);
                    return false;
                }
            }
            if (turn_priv === '0') { // 不允许 强制转交
                var other_show_info = jQuery('#op_user_show_info').find('font[color="red"]').find('div[self_type="other"]');
                if (other_show_info.length > 0) {
                    var show_text = '';
                    jQuery(other_show_info).each(function(i, v) {
                        show_text += jQuery.trim(jQuery(v).html()) + '，';
                    });
                    if (show_text != '') {
                        show_text = show_text.substr(0, (show_text.length - 1));
                    }
                    alert(sprintf(td_lang.general.workflow.msg_243, show_text));
                    return false;
                }
            } else if (turn_priv === '1') {
                var other_show_info = jQuery('#op_user_show_info').find('font[color="red"]').find('div[self_type="other"]');
                if (other_show_info.length > 0) {
                    var show_text = '';
                    jQuery(other_show_info).each(function(i, v) {
                        show_text += jQuery.trim(jQuery(v).html()) + '，';
                    });
                    if (show_text != '') {
                        show_text = show_text.substr(0, (show_text.length - 1));
                    }
                    if (!confirm(sprintf(td_lang.general.workflow.msg_261, show_text))) {
                        return false;
                    }
                }
            }
            var chose_obj = jQuery(window.frames["work_form_data"].document).find('#PRCS_CHOOSE');
            try {
                jQuery("li[id^='next_prcs_'][class*='active']").each(function(i, v) {
                    var obj_choose_prcs = jQuery(v);
                    var flow_prcs = obj_choose_prcs.attr("id").substr(10);
                    if (jQuery('#PRCS_USER' + flow_prcs).val() == '') {
                        throw td_lang.general.workflow.msg_245;
                        return false;
                    }
                    if (jQuery('#TOP_FLAG' + flow_prcs).val() === '0' && jQuery('#PRCS_OP_USER' + flow_prcs).val() == '') {
                        throw td_lang.general.workflow.msg_244;
                        return false;
                    }
                    if (obj_choose_prcs.attr("id") === "next_prcs_0") {
                        chose_obj.val("");
                    } else {
                        chose_obj.val(chose_obj.val() + jQuery("li[id^='next_prcs_']").index(obj_choose_prcs) + ",");
                    }
                    jQuery(window.frames["work_form_data"].document).find('#next_prcs_num').val(obj_choose_prcs.attr("id").substr(10));
                
                });
            } catch (e) {
                alert(e);
                return false;
            }
            jQuery(this).attr("disabled", true);
            var s_prcs_to = "";
            jQuery('#workPrcsData').find("li[id^='next_prcs_']").each(function() {
                var a_prcs_id = jQuery(this).attr('id').split('_');
                if (a_prcs_id.length == 3) {
                    var s_prcs_id = a_prcs_id[2];
                    
                    if (s_prcs_id == "END") {
                        s_prcs_to += "0,";
                    } else {
                        s_prcs_to += s_prcs_id + ",";
                    }
                }
            });
        }
        var info_str = "";
        jQuery('.work-msg-op-title').find('span').each(function() {
            if (jQuery(this).attr('class').indexOf('-bg-static') > 0) {
                info_str += '0,';
            } else {
                info_str += '1,';
            }
        });
        var RUN_PRCS_NAME = jQuery("#RUN_PRCS_NAME").val();
        jQuery(window.frames["work_form_data"].document).find("#info_str").val(info_str);
        jQuery(window.frames["work_form_data"].document).find("#PRCS_TO").val(s_prcs_to);
        jQuery(window.frames["work_form_data"].document).find("#RUN_PRCS_NAME").val(RUN_PRCS_NAME);
        $form1 = jQuery(window.frames["work_form_data"].document).find("form[name='form1']");
        jQuery('.users-select-block').find("input[type='hidden']").clone(true).appendTo($form1);
        if(jQuery('#SMS_CONTENT').length != 0)
        {
            jQuery('#SMS_CONTENT').clone(true).appendTo($form1);
        }
        jQuery('.prcs_settign_block').find("input[id^='TIME_OUT_']").clone(true).appendTo($form1);
        jQuery("#VIEW_USER_ID").clone(true).appendTo($form1);
        jQuery(window.frames["work_form_data"])[0].CheckForm('tok'); // 保存表单并转交 下一步
    
    });
    jQuery(document).on('click', '#all_check', function() {
        var $this = jQuery(this);
        if (this.className.match(/disable/)) {
            return;
        }
        //全选
        if (!this.className.match(/active/)) {
            jQuery("li[id^='next_prcs_']").each(function(i, v) {
                if ((!jQuery(v).hasClass('active')) && jQuery(v).attr('id') != 'next_prcs_0' && sync_deal == 1) {
                    jQuery(v).trigger('click');
                }
            });
            $this.addClass('active');
        //全消
        } else {
            jQuery("li[id^='next_prcs_'][class*='active']").each(function(i, v) {
                if (jQuery(v).attr('id') != 'next_prcs_0' && sync_deal == 1) {
                    jQuery(v).trigger('click');
                }
            });
            $this.removeClass('active');
        }
    });
    $("#workflow-switcher .form_in").click(function() {
        $("#west").css("border-right-color", "#169bf5");
		jQuery("#center iframe")[0].contentWindow.jQuery("#aip_center").css("display", "none");
		jQuery("#center iframe")[0].contentWindow.jQuery("#form_center").css("display", "");
    })
    $("#workflow-switcher .attach_in").click(function() {
        $("#west").css("border-right-color", "#ee9b00");
		jQuery("#center iframe")[0].contentWindow.jQuery("#aip_center").css("display", "none");
		jQuery("#center iframe")[0].contentWindow.jQuery("#form_center").css("display", "");
    })
    $("#workflow-switcher .remark_in").click(function() {
        $("#west").css("border-right-color", "#339a4b");
		jQuery("#center iframe")[0].contentWindow.jQuery("#aip_center").css("display", "none");
		jQuery("#center iframe")[0].contentWindow.jQuery("#form_center").css("display", "");
    });
	$("#workflow-switcher .aip_in").click(function() {
        $("#west").css("border-right-color", "#C345AF");
		jQuery("#center iframe")[0].contentWindow.jQuery("#aip_center").css("display", "");
		jQuery("#center iframe")[0].contentWindow.jQuery("#form_center").css("display", "none");
    });
    var sidebarResize = function() {
        var sidebarheight = $(window).height() - 92;
        if (sidebarheight < 405) 
        {
            $("#west").addClass("smallsidebar");
        } 
        else 
        {
            $("#west").removeClass("smallsidebar");
        }
    };
    sidebarResize();
    $(window).resize((function() {
        var t;
        return function() {
            t && clearTimeout(t);
            t = setTimeout(sidebarResize, 300);
        }
    })());
});
function bindCheckBtnEvent() {
    if (jQuery('#workPrcsData li.workflow-node').size() > 1) {
        jQuery('#all_check').show().on('refreshCheckStatus', function() {
            var status = true; //默认全选active
            jQuery("li.workflow-node[id^='next_prcs_'][condition!='false']").each(function(i, v) {
                if (jQuery(v).attr('id') != 'next_prcs_0' && sync_deal == 1 && !this.className.match(/active/)) {
                    status = false; //有任意步骤未被选择 
                }
            });
            jQuery(this)[status ? 'addClass' : 'removeClass']('active');
        });
    }
}

function index_list_refresh() {
    jQuery(window.parent)[0].hideForm();
}
jQuery(document).on('click', '.users-add', function() {
    var prcs_next = jQuery(this).attr('prcs_next');
    var gather_node_have_flag = jQuery(this).attr('gather_node_have_flag');
    var free_prcs = jQuery(this).attr('prcs_type') == 'free';
    var prcs_back = jQuery(this).attr('prcs_back'); //子流程返回父流程步骤
	
    if (gather_node_have_flag === '1') {
        alert(td_lang.general.workflow.msg_247);
        return false;
    }
    if (prcs_next) {
        var prcs_next_id = free_prcs ? '' : prcs_next;
        urlStr = "../turn/user_select/?FLOW_ID=" + flow_id + "&RUN_ID=" + run_id + "&PRCS_ID=" + prcs_id + "&PRCS_ID_NEXT=" + prcs_next_id + "&LINE_COUNT=" + prcs_next + "&PRCS_BACK=" + prcs_back;
        loc_x = 220;
        loc_y = 200;
        if (is_ie) {
            loc_x = document.body.scrollLeft + event.clientX - event.offsetX - 220;
            loc_y = document.body.scrollTop + event.clientY - event.offsetY;
        }
        LoadDialogWindow(urlStr, self, loc_x, loc_y, 380, 350);
    }
});

jQuery(document).on('click', '.users-clear', function() {
    var prcs_next = jQuery(this).attr('prcs_next');
    var gather_node_have_flag = jQuery(this).attr('gather_node_have_flag');
    if (gather_node_have_flag == '1') {
        alert(td_lang.general.workflow.msg_247);
        return false;
    }
    if (prcs_next) {
        jQuery("[prcs_id_next='" + prcs_next + "']").find('.user-tags').remove();
        jQuery("[prcs_id_next='" + prcs_next + "']").find('input[type="hidden"]').val('');
    }
});
jQuery(document).on('click', '.sms-check', function() {
    jQuery(this).toggleClass('sms-bg-static');
});
jQuery(document).on('click', '.email-check', function() {
    jQuery(this).toggleClass('email-bg-static');
});
jQuery(document).on('click', '.mobile-check', function() {
    jQuery(this).toggleClass('mobile-bg-static');
});
jQuery(document).on('click', 'i[class="close"]', function() {
    var gather_node_have_flag = jQuery(this).attr('gather_node_have_flag');
    if (gather_node_have_flag === '1') {
        alert(td_lang.general.workflow.msg_247);
        return false;
    }
    var tags_obj = jQuery(this).parent();
    var op_block_div = tags_obj.parent();
    var op_user_val_btn = op_block_div.find('input[data_type="op_user_btn"]');
    var user_id = tags_obj.attr('user_id');
    var flow_prcs = op_block_div.attr('id').substring(17);
    if (op_block_div.attr('id').substring(0, 4) == 'prcs' && jQuery('#PRCS_OP_USER' + flow_prcs).val() == user_id) {
        jQuery('#host_op_block_div' + flow_prcs).find('i[class="close"]').trigger('click');
    }
    if (op_user_val_btn.val().indexOf(user_id + ',') == 0) {
        op_user_val_btn.val(op_user_val_btn.val().replace(user_id + ',', ''));
    } else if (op_user_val_btn.val().indexOf(',' + user_id + ',') > 0) {
        op_user_val_btn.val(op_user_val_btn.val().replace(',' + user_id + ',', ','));
    } else if (op_user_val_btn.val() == user_id) { // 主办情况
        op_user_val_btn.val('');
    }
    tags_obj.remove();
});

(function($) {
    //自由流程选择 by jx
    function FreePrcsSelector() {
        this.init.apply(this, arguments);
    }
    var opts = {
        id: 'workFreePrcs', //容器
        index: 3, //默认最小从第三步开始设计自由流程
        data: null //已保存的自由流程数据
    };
    FreePrcsSelector.prototype = {
        constructor: FreePrcsSelector,
        init: function(opts) {
            this.$el = $('#' + opts.id);
            this._index = this.index = parseInt(opts.index || 3, 10);
            this.data = opts.data || {};
            this.readonly = opts.readonly || false;
            this.free_preset = opts.free_preset; //流程是否允许预设步骤 --YZX    
            
            this.data.length && this.load(this.data);
            if (this.free_preset != 0) {
                !this.readonly && this.renderCtrl();
            }
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            this.$el.delegate('[data-cmd="del"]', 'click', function() {
                var id = $(this).parents('.work-free-prcs-block').first().attr('data-id');
                self.remove(id);
            });
            this.$el.delegate('[data-cmd="setEditableField"]', 'click', function() {
                var id = $(this).parents('.work-free-prcs-block').first().attr('data-id');
                self.setField(id);
            });
        },
        render: function(data) {
            var template = $.templates("#workFreePrcsBlockTmpl");
            return template.render(data);
        },
        renderCtrl: function() {
            var $btns = $('<div></div>').insertAfter(this.$el).css('margin-bottom', 10);
            this.$add = $('<button class="btn btn-small btn-info">增加自由步骤</button>').appendTo($btns);
            this.$clear = $('<button class="btn btn-small btn-danger">重置自由步骤</button>').appendTo($btns).css('margin-left', 10);
            this.$add.click($.proxy(this.add, this));
            this.$clear.click($.proxy(this.clear, this));
        },
        add: function() {
            var $el = this.$el, 
            data = {id: this.guid(),index: this.index++}, 
            $html = $(this.render(data));
            
            $el.append($html);
            
            var prcs_data = {
                prcs_num: data.id,
                next_prcs_name: '预设步骤',
                top_flag: 0,
                prcs_type: 'free'
            };
            
            this.renderItem(prcs_data);
        },
        remove: function(id) {
            $('#work-free-prcs-block-' + id).remove();
            this.index--;
            this.resetIndex();
        },
        load: function(data) {
            if (!data) {
                return;
            }
            var self = this;
            $.each(data, function(i, n) {
                self.renderItem(n.prcsData[0]);
            });
        },
        renderItem: function(data) {
            if (!data) {
                return;
            }
            var prcs_data = data;
            var $html = $('#work-free-prcs-block-' + data.prcs_num);
            var nodeHtml = $.templates("#workPrcsTmpl").render({prcsData: prcs_data});
            var resultHtml = $.templates("#workNextPrcsUserTmpl").render(prcs_data);
            //console.log("容器", $html);
            //console.log("数据", data);
            $html.find('.workflow-procs-nodes').html(nodeHtml);
            $html.find('.workflow-procs-nodes-result').html(resultHtml);
            $html.find('.workflow-node').addClass('active');
            jQuery("#TOP_FLAG_SHOW" + prcs_data.prcs_num).attachmenu();
        },
        clear: function() {
            this.index = this._index;
            this.$el.find('.default-free').remove();
        },
        guid: function() {
            var i = 8, store = [];
            while (i) {
                store.push(Math.floor(Math.random() * 16.0).toString(16));
                i--;
            }
            return store.join('');
        },
        resetIndex: function() {
            var index = parseInt(this._index, 10);
            //console.log(index);
            this.$el.find('.work-free-prcs-block').each(function(i, n) {
                n.setAttribute('data-index', index + i);
                $(n).find('.work-prcs-title-text b').text(index + i);
            });
        },
        setField: function(i) {
            setEditableField('freePrcsEditableField' + i);
        },
        /* 
         * 获取自由流程选择结果 return [object | false]
        */
        serialize: function() {
            var check_flag = true, json = [];
            /*
             *    .work-free-prcs-block-next    下一步骤 php生成
             *    .work-free-prcs-block         预设步骤 js生成
             */
            this.$el.find('.work-free-prcs-block-next,.work-free-prcs-block').each(function(i, n) {
                var index = n.getAttribute('data-index');
                var flow_prcs = n.getAttribute('data-id');
                if (jQuery('#PRCS_USER' + flow_prcs).val() == '') {
                    alert(td_lang.general.workflow.msg_245);
                    check_flag = false;
                    return false;
                }
                if (jQuery('#TOP_FLAG' + flow_prcs).val() === '0' && jQuery('#PRCS_OP_USER' + flow_prcs).val() == '') {
                    alert(td_lang.general.workflow.msg_244);
                    check_flag = false;
                    return false;
                }
                json.push({
                    index: index,
                    top_flag: jQuery('#TOP_FLAG' + flow_prcs).val(),
                    prcs_op_user: jQuery('#PRCS_OP_USER' + flow_prcs).val(),
                    prcs_user: jQuery('#PRCS_USER' + flow_prcs).val(),
                    editable_field: jQuery('#freePrcsEditableField' + flow_prcs).val()
                });
            });
            //  console.log(jQuery('#freePrcsEditableField8').val());
            return check_flag && json;
        }
    };
    
    window.FreePrcsSelector = FreePrcsSelector;
})(jQuery);
function setEditableField(bid) {
    
    var prcsid = bid.replace("freePrcsEditableField", "");
    var urlStr = "set_item.php?FLOW_ID=" + window.flow_id + "&RUN_ID=" + window.run_id + "&PRCS_ID=" + prcsid + "&PRCS_ID_NEXT=" + window.prcs_next_id + "&LINE_COUNT=" + window.prcs_next;
    loc_x = 220;
    loc_y = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - event.offsetX - 220;
        loc_y = document.body.scrollTop + event.clientY - event.offsetY;
    }
    LoadDialogWindow(urlStr, self, loc_x, loc_y, 973, 460);
}
function addPrcsJsonDatas(data) {
    
    var Data = {"prcsData": data.prcsData};
    //console.log(Data);
    var template = jQuery.templates("#workPrcsTmpl");
    var htmlOutput = template.render(Data);
    //alert(htmlOutput);
    jQuery("#workPrcsData").html(htmlOutput);
    
    jQuery(data.prcsData).each(function(i, v) {
        var prcs_name_obj = jQuery("#next_prcs_" + v.prcs_num).find('a:first');
        var prcs_back = v.prcs_back;
        if (prcs_name_obj.attr('title') === '0') {
            prcs_name_obj.attr('title', '<strong>' + td_lang.general.workflow.msg_241 + '</strong>');
        } else {
            prcs_name_obj.attr('title', prcs_name_obj.attr('title') + "：" + prcs_name_obj.text());
        }
        var prcs_obj_li = jQuery("#next_prcs_" + v.prcs_num);
        if (prcs_back != undefined) 
        {
            prcs_obj_li.attr("prcs_back", prcs_back); //是否子流程返回父流程
        }
        if (typeof v.prcs_in_condition != 'undefined' && v.prcs_in_condition != '') {
            var condition_desc = '';
            var condition_desc_title = '';
            var prcs
            if (v.prcs_in_condition.substring(0, 5) == 'SETOK') {
                condition_desc = td_lang.general.workflow.msg_236;
                condition_desc_title = td_lang.general.workflow.msg_238;
                prcs_obj_li.attr('condition', 'true');
            } else {
                condition_desc = td_lang.general.workflow.msg_237;
                condition_desc_title = td_lang.general.workflow.msg_239;
                prcs_obj_li.attr('condition', 'false');
            }
            var a = jQuery('<a>' + condition_desc + '</a>').attr('title', '<strong>' + condition_desc_title + '：<br />' + v.prcs_in_condition.replace('SETOK', '') + '</strong>');
            prcs_obj_li.find('ol').append(a);
        }
    });
    
    jQuery(".workflow-node").find('a').tooltip();
    sync_deal = data.sync_deal; //并发
    turn_priv = data.turn_priv; // 强制转交
    gather_node = data.gather_node; // 强制合并
    if (sync_deal == 2) {
        jQuery('#prcs_title').append('&nbsp;&nbsp;&nbsp;&nbsp;<font color="red">' + td_lang.general.workflow.msg_242 + '</font>');
    }
    var sms_content = jQuery('#myModal').find('#SMS_CONTENT').val();
    
    jQuery(".workflow-node").click(function() {
        var prcs_type = jQuery("#PRCS_TYPE").val();
        var next_prcs_id =jQuery("#NEXT_PRCS_TYPE").val();
        var prcs_info_arr = jQuery(this).attr('id').split('_');
        if (prcs_info_arr.length != 3) {
            return false;
        }
        var prcs_num = prcs_info_arr[2];
        
        var $this = jQuery(this);
        if ($this.attr('condition') == 'false') {
            return false;
        }
        // 禁止并发
        if (sync_deal == 0) {
            if(prcs_type != 3)
            {
                $this.siblings().removeClass('active');
                $this.addClass('active');
            }else //柔性转交
            {
                //$this.siblings().removeClass('active');
                if(flow_prcs == prcs_num)
                {
                    jQuery(".workflow-node[id='next_prcs_"+prcs_num+"']").addClass('active');
                    jQuery(".workflow-node[id='next_prcs_"+next_prcs_id+"']").removeClass('active');
                    return false;
                   
                }else
                {
                    jQuery(".workflow-node[id='next_prcs_"+prcs_num+"']").addClass('active');
                    jQuery(".workflow-node[id='next_prcs_"+flow_prcs+"']").removeClass('active');
                }
            }
            
            if (prcs_info_arr[2] === "0" && $this.attr("prcs_back") == undefined) {
                jQuery("#work-next-prcs-block").html('');
                jQuery('div[data_type="next"]').hide();
                if(jQuery('#myModal').find('#SMS_CONTENT').length != 0)
                {
                    jQuery('#myModal').find('#SMS_CONTENT').val(sms_content.replace(td_lang.general.workflow.msg_259, td_lang.general.workflow.msg_260));
                }
                return false;
            }
            jQuery('#myModal').find('#SMS_CONTENT').val(sms_content);
            
            jQuery('div[data_type="next"]').show();
            var prcsBlockData = new Array();
            var prcs_uname = new Array();
            var prcs_uname_arr = $this.attr('prcs_uname').split(',');
            if(prcs_type == 3) //柔性转交
            {
                if(flow_prcs == prcs_num) //柔性步骤
                {
                    var prcs_uname_str = jQuery("#PRCS_USER"+flow_prcs).val();
                    var prcs_uid_arr = prcs_uname_str.split(',');
                }else
                {
                    var prcs_uid_arr = $this.attr('prcs_uid').split(',');
                }

            }else
            {
                var prcs_uid_arr = $this.attr('prcs_uid').split(',');
            }
            
            jQuery(prcs_uname_arr).each(function(i, v) {
                if (v != "") {
                    prcs_uname.push({"user_id": prcs_uid_arr[i],"uname": v,'gather_node_have_flag': $this.attr('gather_node_have_flag')});
                }
            });
            var prcsBlockData = [{
                    'prcs_num': prcs_num,
                    'prcs_back': $this.attr('prcs_back'),
                    'top_flag': $this.attr('top_flag'),
                    'prcs_op_uid': $this.attr('prcs_op_uid'),
                    'prcs_op_uname': $this.attr('prcs_op_uname'),
                    'prcs_uid': $this.attr('prcs_uid'),
                    'time_out': $this.attr('time_out'),
                    'time_out_modify': $this.attr('time_out_modify'),
                    'prcs_uname': prcs_uname,
                    'gather_node_have_flag': $this.attr('gather_node_have_flag'),
                    'next_prcs_name': $this.attr('next_prcs_name')
                }];
            var template = jQuery.templates("#workNextPrcsUserTmpl");
            var htmlOutput = template.render(prcsBlockData);
            jQuery("#work-next-prcs-block").html(htmlOutput);
            jQuery('.workflow-node-title-text[title]').tooltip();
            if ($this.attr('user_lock') !== '0') {
                jQuery("#TOP_FLAG_SHOW" + prcs_num).attachmenu();
            } else {
                if($this.attr('auto_type')!==""&&jQuery(".user-tags").length!==0)
                {
                    jQuery('#chose_user' + prcs_num).click(function() {//yzx不允许修改默认人员
                        alert(td_lang.general.workflow.msg_247);
                        return false;
                    });
                    jQuery('.close').hide();//yzx 隐藏人员删除
                }
                jQuery('#TOP_FLAG_SHOW' + prcs_num).click(function() {
                    alert(td_lang.general.workflow.msg_248);
                    return false;
                });
            }
        
        } 
        else if (sync_deal == 1) { // 允许并发
            bindCheckBtnEvent();
            if ($this.hasClass('active')) {
                $this.removeClass('active');
                jQuery("#work-next-prcs-block [prcs_id_next=" + prcs_num + ']').remove();
                jQuery('#all_check').removeClass('active');
            } else {
                $this.addClass('active');
                jQuery('#all_check').trigger('refreshCheckStatus');
                if (prcs_info_arr[2] === "0") {
                    jQuery("#work-next-prcs-block").html('');
                    jQuery(".workflow-node[id!='next_prcs_0']").removeClass('active');
                    jQuery('#all_check').removeClass('active');
                    if(jQuery('#myModal').find('#SMS_CONTENT').length != 0)
                    {
                        jQuery('#myModal').find('#SMS_CONTENT').val(sms_content.replace(td_lang.general.workflow.msg_259, td_lang.general.workflow.msg_260));
                    }
                    jQuery('div[data_type="next"]').hide();
                    return false;
                }
                jQuery('#myModal').find('#SMS_CONTENT').val(sms_content);
                jQuery(".workflow-node[id='next_prcs_0']").removeClass('active');
                jQuery('div[data_type="next"]').show();
                var prcsBlockData = new Array();
                var prcs_uname = new Array();
                var prcs_uname_arr = $this.attr('prcs_uname').split(',');
                var prcs_uid_arr = $this.attr('prcs_uid').split(',');
                jQuery(prcs_uname_arr).each(function(i, v) {
                    if (v != "") {
                        prcs_uname.push({"user_id": prcs_uid_arr[i],"uname": v,'gather_node_have_flag': $this.attr('gather_node_have_flag')});
                    }
                });
                var prcsBlockData = [{
                        'prcs_num': prcs_num,
                        'top_flag': $this.attr('top_flag'),
                        'prcs_op_uid': $this.attr('prcs_op_uid'),
                        'prcs_op_uname': $this.attr('prcs_op_uname'),
                        'prcs_uid': $this.attr('prcs_uid'),
                        'time_out': $this.attr('time_out'),
                        'time_out_modify': $this.attr('time_out_modify'),
                        'prcs_uname': prcs_uname,
                        'gather_node_have_flag': $this.attr('gather_node_have_flag'),
                        'next_prcs_name': $this.attr('next_prcs_name')
                    }];
                var template = jQuery.templates("#workNextPrcsUserTmpl");
                var htmlOutput = template.render(prcsBlockData);
                var current_index = jQuery("li[id^='next_prcs_'][class*='active']").index($this);
                var before_insert_id = '';
                jQuery("li[id^='next_prcs_'][class*='active']").each(function(i, v) {
                    var unit_index = jQuery("li[id^='next_prcs_'][class*='active']").index(jQuery(v));
                    if (unit_index > current_index) {
                        before_insert_id = jQuery(v).attr('id');
                        return false;
                    }
                })
                if (before_insert_id != '') {
                    var prcs_num_arr = before_insert_id.split('_');
                    if (prcs_num_arr.length == 3) {
                        var search_num = prcs_num_arr[2];
                        jQuery('li[prcs_id_next="' + search_num + '"]').before(jQuery(htmlOutput));
                    }
                } else {
                    jQuery("#work-next-prcs-block").append(htmlOutput);
                }
                jQuery('.workflow-node-title-text[title]').tooltip();
                if ($this.attr('user_lock') !== '0') {
                    jQuery("#TOP_FLAG_SHOW" + prcs_num).attachmenu();
                } else {
                    if($this.attr('auto_type')!==""&&jQuery(".user-tags").length!==0)
                    {
                        jQuery('#chose_user' + prcs_num).click(function() {//yzx不允许修改默认人员
                            alert(td_lang.general.workflow.msg_247);
                            return false;
                        });
                        jQuery('.close').hide();//yzx 隐藏人员删除
                    }
                    jQuery('#TOP_FLAG_SHOW' + prcs_num).click(function() {
                        
                        alert(td_lang.general.workflow.msg_248);
                        return false;
                    });
                }
            }
        } 
        else if (sync_deal == 2) { //强制并发
            if (prcs_info_arr[2] === "0") { //结束
                if ($this.hasClass('active')) {
                
                } else {
                    $this.addClass('active');
                    jQuery(".workflow-node[id!='next_prcs_0']").removeClass('active');
                    jQuery('div[data_type="next"]').hide();
                }
                if(jQuery('#myModal').find('#SMS_CONTENT').length != 0)
                {
                    jQuery('#myModal').find('#SMS_CONTENT').val(sms_content.replace(td_lang.general.workflow.msg_259, td_lang.general.workflow.msg_260));
                }
                jQuery("#work-next-prcs-block").html('');
                return false;
            } else { //非结束
                jQuery('#myModal').find('#SMS_CONTENT').val(sms_content);
                jQuery('#all_check').hide().addClass('disable');
                if ($this.hasClass('active')) { //取消
                
                } else { //选中
                    jQuery(".workflow-node[id!='next_prcs_0'][condition!='false']").addClass('active');
                    jQuery(".workflow-node[id='next_prcs_0']").removeClass('active');
                    jQuery('div[data_type="next"]').show();
                    jQuery(".workflow-node[id!='next_prcs_0'][condition!='false']").each(function(i, v) {
                        $v = jQuery(v);
                        var prcsBlockData = new Array();
                        var prcs_uname = new Array();
                        var prcs_uname_arr = $v.attr('prcs_uname').split(',');
                        var prcs_uid_arr = $v.attr('prcs_uid').split(',');
                        jQuery(prcs_uname_arr).each(function(i, v) {
                            if (v != "") {
                                prcs_uname.push({"user_id": prcs_uid_arr[i],"uname": v,'gather_node_have_flag': $v.attr('gather_node_have_flag')});
                            }
                        });
                        var prcs_num_arr = $v.attr('id').split('_');
                        var prcs_num = prcs_num_arr[2];
                        var prcsBlockData = [{
                                'prcs_num': prcs_num,
                                'top_flag': $v.attr('top_flag'),
                                'prcs_op_uid': $v.attr('prcs_op_uid'),
                                'prcs_op_uname': $v.attr('prcs_op_uname'),
                                'prcs_uid': $v.attr('prcs_uid'),
                                'time_out': $v.attr('time_out'),
                                'time_out_modify': $v.attr('time_out_modify'),
                                'prcs_uname': prcs_uname,
                                'gather_node_have_flag': $v.attr('gather_node_have_flag'),
                                'next_prcs_name': $v.attr('next_prcs_name')
                            }];
                        var template = jQuery.templates("#workNextPrcsUserTmpl");
                        var htmlOutput = template.render(prcsBlockData)
                        jQuery("#work-next-prcs-block").append(htmlOutput);
                        jQuery('.workflow-node-title-text[title]').tooltip();
                        if ($v.attr('user_lock') !== '0') {
                            jQuery("#TOP_FLAG_SHOW" + prcs_num).attachmenu();
                        } 
                        else 
                        {
                            if($v.attr('auto_type')!==""&&jQuery(".user-tags").length!==0)
                            {
                                jQuery('#chose_user' + prcs_num).click(function() {//yzx不允许修改默认人员
                                    alert(td_lang.general.workflow.msg_247);
                                    return false;
                                });
                                jQuery('.close').hide();//yzx 隐藏人员删除
                            }
                            jQuery('#TOP_FLAG_SHOW' + prcs_num).click(function() {
                                
                                alert(td_lang.general.workflow.msg_248);
                                return false;
                            });
                        }
                    });
                }
            }
        }
        jQuery('.modal-body').trigger('scroll');
    });
    if (sync_deal == 1 || sync_deal == 2) {
        jQuery('[id^="next_prcs_"]').trigger('click');
    } else if (data.defaultNextPrcs) {
        jQuery('#next_prcs_' + data.defaultNextPrcs).click();
    }
}
function loadWorkHandleNext() { // 流程办理时转交下一步处理函数
	// 重新获取当前修改的 工作名称/文号		DJ 14/8/6
	var new_run_name = encodeURIComponent(jQuery('#Symbol').val());
	if (new_run_name == 'undefined')
	{
		new_run_name = run_name;
	}

    jQuery('#myModal').find('.modal-body').load('work_next.php?flow_type=' + flow_type + '&flow_id=' + flow_id + '&run_id=' + run_id + '&run_name=' + new_run_name + '&prcs_id=' + prcs_id + '&prcs_name=' + encodeURIComponent(jQuery('#prcs_name_block').html()) + '&flow_prcs=' + flow_prcs + '&remind_info=' + remind_info, function(msg) {
        var show_run_id = jQuery('#run_id_block').html();
        var Symbol = jQuery('#Symbol').val();
        
        if (Symbol) 
        {
            var show_run_name = jQuery('#Symbol').val();
        } else {
            var show_run_name = jQuery('#run_name_block').html();
        }
        jQuery('#myModalLabel').html('NO. ' + show_run_id + ' ' + show_run_name);
        showHideButton();
        return false;
    
    });
}
function set_top(flag, line_count) {
    $("TOP_FLAG" + line_count).value = flag;
    if (flag == 0)
        $('TOP_FLAG_SHOW' + line_count).innerHTML = td_lang.general.workflow.msg_251; //"主办人："
    else if (flag == "1")
        $('TOP_FLAG_SHOW' + line_count).innerHTML = td_lang.general.workflow.msg_252; //"先接收者主办：";
    else
        $('TOP_FLAG_SHOW' + line_count).innerHTML = td_lang.general.workflow.msg_253; //"无主办人会签：";
    
    if (flag != "0") 
    {
        jQuery("#PRCS_OP_USER" + line_count).val("");
        jQuery("#host_op_block_div" + line_count).find(".user-tags").remove();
    }
    
    $("TOP_FLAG_SHOW" + line_count + '_menu').style.display = 'none';
}

function edit_run_name(RUN_ID, FLAG, TYPE) 
{
    if(TYPE == 1)
    {
        var child_window = jQuery(window.frames["work_form_data"].window)[0];
        if(child_window)
        {
            child_window.CheckForm("N");
        }
    }
    else
    {
        var RUN_NAME = jQuery("#Symbol").val();
        if(typeof(RUN_NAME) != 'undefined' && jQuery.trim(RUN_NAME) == ''){
            alert(td_lang.general.workflow.msg_286);
            return false;
        }
        
        jQuery.ajax({
            type: "POST",
            url: "run_name_submit.php",
            cache: false,
            async: false,
            data: {"RUN_NAME": RUN_NAME,"RUN_ID": RUN_ID},
            error: function(msg) {
                alert(msg);
            },
            success: function(data) {
                if (data == 2) 
                {
                    jQuery('#run_name_old').val(jQuery('#Symbol').val());
                    if (FLAG != 2) 
                    {
                        alert(td_lang.general.workflow.msg_271);
                        document.location.reload();
                    }
                }
            }
        });
    }
}

function select_run_name(FLOW_ID, RUN_ID) 
{
    var loc_x = (screen.availWidth - 300) / 2;
    var loc_y = event.clientY - 100;
    window.open("select_run_name.php?FLOW_ID=" + FLOW_ID + "&RUN_ID=" + RUN_ID, "select_run_name", "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=300,height=400,left=" + loc_x + ",top=" + loc_y);
}

function run_prcs_name_verification() // 鼠标离开焦点修改柔性节点步骤名称
{
    var RUN_PRCS_NAME = jQuery("#RUN_PRCS_NAME").val();
    jQuery("#RUN_PRCS_NAME_OPERATING").text("");
    jQuery("#RUN_PRCS_NAME_OPERATING").text(RUN_PRCS_NAME);
}

function set_verification() //创建动态节点
{
    var FLOW_PRCS_TYPE = jQuery("#FLOW_PRCS_TYPE").val();
    jQuery("#work-free-prcs-block-"+FLOW_PRCS_TYPE).show();
    jQuery("#RUN_PRCS_NAME").focus();
}

function delete_verification() //删除动态节点
{
    var FLOW_PRCS_TYPE = jQuery("#FLOW_PRCS_TYPE").val();
    jQuery("#work-free-prcs-block-"+FLOW_PRCS_TYPE).hide();
}