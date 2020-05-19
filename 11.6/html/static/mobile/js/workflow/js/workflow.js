/* UDF */
//2012/2/27 11:24:51 lp ��ʾ��Ϣ
function showMessage(t)
{
    showMessage.el = $.tips({
        content: t,
        stayTime: 2000,
        type:"success"
    });
}

function reback(from, to){
    pages && pages.pageTo && pages.pageTo(from, to);
}

function pageTo(f){
    pages && pages.to && pages.to(f);
}

function gohome(){
	if(typeof(mobile_app_home) == "function")
		mobile_app_home();
	else
   	location.href = "/pda/main.php?P="+p;
}

// 2012/3/26 17:42:31 lp loadingЧ��
$.ProLoading = {
    show: function(msg){
        this.el = $.loading({
            content: td_lang.pda.msg_2 || msg,
        })
   },
   hide:function(){
       this.el && this.el.loading("hide");
   }
}

function sprintf()
{
    var arg = arguments,
        str = arg[0] || '',
        i, n;
    for (i = 1, n = arg.length; i < n; i++) {
        str = str.replace(/%s/, arg[i]);
    }
    return str;
}

//2012/6/18 3:01:12 lp �������
function isChineseChar(str){
   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]$/;
   return reg.test(str);
}

//�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
function fixDbClick(e){
   var last_click_timer = this.getAttribute('_last_click_timer_'),
   this_click_timer = (new Date).getTime();

   if(this_click_timer - last_click_timer < 1000){
      e.stopPropagation();
      return false;
   }
   this.setAttribute('_last_click_timer_', this_click_timer);
}

/* workflow.js */
$(document).ready(function(){
    $("body").delegate(".turn_btn", "touchstart mousedown", function(e){
        $(this).addClass('active');
    }).delegate(".turn_btn", "touchend mouseup", function(e){
        $(this).removeClass('active');
    });
});

//�������༭״̬
function editWorkFlow()
{
    $.ajax({
        type: 'GET',
        url: 'prcs_info.php',
        cache: false,
        data: {'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'actionType':q_action_type,'P':p},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            // data = "HAVEDELETE";
            $.ProLoading.hide();
            if(data == "NOEDITPRIV"){
                showMessage(noeditpriv);
                return;
            }else if(data == "HAVEDELETE"){
                showMessage(havedelete);
                return;
            }else if(data == "HAVEEND"){
                showMessage(haveend);
                return;
            }else if(data == "HAVEDESTROY"){
                showMessage(havedestroy);
                return;
            }else if(data == "HAVETURN"){
                showMessage(haveturn);
                return;
            }else if(data == "HAVEREBACK"){
                showMessage(data);
                return;
            }else{
                pageTo("work");
                $("#scroller_work").empty().append(data);
                $("#page_work .container .read_detail").last().addClass("endline");
                $("#page_work .container form .read_detail").last().addClass("endline");
                $("#editSignBox .read_detail").last().addClass("endline");
            }
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage(getfature);
        }
    });
}

//��ȡ����������
function getflowContent(url,actionType)
{
    $.ajax({
        type: 'GET',
        url: url,
        cache: false,
        data: {'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID': q_prcs_key_id,'P':p,'actionType':actionType},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            if(data == "NOREADFLOWPRIV"){
                showMessage(noreadflowpriv);
                return;
            }else{
                pageTo("form");
                $("#scroller_form").empty().append(data);
                $("#page_form .container .read_detail").last().addClass("endline");
            }
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage(getfature);
        }
    });
}

// ת����ת��ѡ����ҳ�棬ͬʱ���ӱ���
function turnWorkFlow(controlSource)
{
    //�޸� ���̰���ת��ʱ��������� ��ǩ������ظ��ύ����� DJ 14/8/28
    fieldManager.saveWorkFlow(controlSource);
    var flow_type = $("input[name='FLOW_TYPE']").val();
    var url = 'turn.php';
    $.ajax({
        type: 'GET',
        url: url,
        cache: false,
        data: {'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'FLOW_TYPE': flow_type},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            if(data == "NOEDITPRIV"){
                showMessage(noeditpriv);
                return;
            }else if(data == "NOSIGNFLOWPRIV"){
                showMessage(nosignflowpriv);
                return;
            }else if(data == "NORIGHTNEXTPRCS"){
                showMessage(norightnextprcs);
                return;
            }else if(data == "NOSETNEWPRCS"){
                showMessage(norightnextprcs);
                return;
            }
            else if(data.indexOf("noMeetCondition") >= 0 && flow_type != 2){
                showMessage(data.substr(16));
                return;
            }
            pageTo('turn');
            $("#scroller_turn").empty().append(data);
            // $(".pages").hide();
            $("#page_turn .container .read_detail").last().addClass("endline");
            $("body").delegate(".setItemClass", "click",function(){
                var setItemId = this.id;
                var setItemIdIndexOf = setItemId.indexOf("_");
                var setItemIdNum = setItemId.substr(setItemIdIndexOf+1);
                var freeItemVal = $("#FREE_ITEM_"+setItemIdNum).val();
                $.ajax({
                    type: 'GET',
                    url: 'set_item.php',
                    cache: false,
                    data: {'RUN_ID': q_run_id, 'FLOW_ID': q_flow_id, 'PRCS_ID': q_prcs_id, 'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID':q_prcs_key_id, 'setItemId':setItemId, 'freeItemVal': freeItemVal},
                    beforeSend: function(){
                        $.ProLoading.show();
                    },
                    success: function(data){
                        pageTo('set_item');
                        $.ProLoading.hide();
                        $("#scroller_set_item").empty().append(data);
                        // $(".pages").hide();
                        $("#page_set_item .container .read_detail").last().addClass("endline");
                    },
                    error: function(data){
                        $.ProLoading.hide();
                        showMessage("��ȡʧ��");
                    }
                });
            });
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage("��ȡʧ��");
        }
    });
}

//��ȡѡ�˽���
function goOnWorkFlow(new_prcs_id_next, turn_action){
    var RX_PRCS = "";
    var SMS_REMIND_NEXT = 0;
    var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH']").val(); //δ������ϵľ�����
    var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //ǿ��ת��
    var PRCS_BACK_LEN = $("input[name='prcs_back']").length; //�Ƿ񷵻ظ�����
    var SYNC_DEAL = $("input[name='SYNC_DEAL']").val();
    if($(".rx_prcs").length > 0){
        var RX_PRCS = $(".rx_prcs").val();   //���Խڵ㲽������
        RX_PRCS = $.trim(RX_PRCS);
        var checkedClass = $(".rx_prcs").prev().prev().attr("class");
        if(checkedClass.indexOf("checked") > 0){
            if(RX_PRCS == ""){
                showMessage("���Խڵ㲽�����Ʋ���Ϊ�գ�");
                return;
            }
        }
    }
    if($("#SMS_REMIND_NEXT").length > 0){
        if(document.getElementById("SMS_REMIND_NEXT").checked){
            SMS_REMIND_NEXT = 1;
        }else{
            SMS_REMIND_NEXT = 0;
        }
    }
    if(turn_action == "" || typeof(turn_action) == 'undefined'){
        var action = $("input[name='TURN_ACTION']").val();
    }else{
        var action = turn_action;
    }
    if(new_prcs_id_next == "" || typeof(prcs_id_next) == 'undefined'){
        var prcs_id_next = ($("input[name='NEW_PRCS_ID_NEXT1']").val() == "" || typeof($("input[name='NEW_PRCS_ID_NEXT1']").val()) == "undefined") ? $("input[name='NEW_PRCS_ID_NEXT']").val() : $("input[name='NEW_PRCS_ID_NEXT1']").val();
    }else{
        var prcs_id_next = new_prcs_id_next;
    }
    if(prcs_id_next == 0 || typeof(prcs_id_next) == 'undefined'){
        if(TURN_PRIV != 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
           showMessage("������["+NOT_ALL_FINISH+"]��δ������ϣ����ܽ������̣�");
           return;
        }
        if(TURN_PRIV == 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
            if(confirm('������['+NOT_ALL_FINISH+']��δ������ϣ�ȷ��Ҫ����������')){
            }else{
                return ;
            }
        }
    }
    var flow_type = $("input[name='FLOW_TYPE']").val();
    if(PRCS_BACK_LEN > 0){
        action = "turn_user.php";
    }
    if((prcs_id_next == '' || typeof(prcs_id_next) == 'undefined') &&  flow_type != 2){
        showMessage(noselectedstep);
        return ;
    }
    //�����������Ԥ�貽��
    if(flow_type == 2){
        var freeStepVal = $("input[name='FREE_STEP']").val();
    }
	// var next_prcs_id = "";
	// if(jQuery(".turnnext").attr('is_next_flag') == 1)
	// {
		// jQuery(".ui-checkbox input[checked*='true']").each(function(i,v){
			// if(jQuery(v).attr("notcheckprcs") == 0 && (jQuery(v).attr("the_before_step") !=1 || jQuery(v).attr("check_is_myself") ==1))
			// {
				// next_prcs_id += jQuery(v).attr("id").substr(5)+",";
			// }
		// });
	// }
    $.ajax({
        type: 'GET',
        url: action,
        cache: false,
        data: {'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'PRCS_ID_NEXT': prcs_id_next, 'SMS_REMIND_NEXT': SMS_REMIND_NEXT, 'RX_PRCS': RX_PRCS, 'FLOW_TYPE': flow_type, 'FREE_STEP': freeStepVal},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            if(data == "NONEXTPRCS"){
                showMessage(nonextprcs);
                return;
            }else if(data == "NOEDITPRIV"){
                showMessage(noeditpriv);
                return;
            }else if(data == "NOSIGNFLOWPRIV"){
                showMessage(nosignflowpriv);
                return;
            }else if(data == "WORKCOMPLETE"){
                showMessage(workcomplete);
                setTimeout("back2list('"+workcomplete+"')", 1000);
                return;
            }/*else if(data.indexOf("no_msg*") >= 0)
            {
                var no_msg = data.substring(data.indexOf("*")+1);
                return
            }*/
            if(prcs_id_next == 0 && PRCS_BACK_LEN == 0){
                showMessage(data);
                return;
            }else{
                pageTo('turn_user');
                $("#scroller_turn_user").empty().append(data);
                $("#scroller_turn_user").find(".userlist").last().css('margin-bottom', '60px');
                // $(".pages").hide();
            }
        },
      error: function(data){
         $.ProLoading.hide();
         showMessage("��ȡʧ��");
      }
   });
}

//ѡ�˽����ύ����
function turnUserWorkFlow(control_type){
    var prcs_back = '';
    var rx_prcs = '';
    var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']").val();
    var prcs_id_next1 = $("input[name='NEW_PRCS_ID_NEXT1']").val();
    var free_step = $("input[name='FREE_STEP']").val();
    var preset = $("input[name='PRESET']").val();
    var VIEW_USER_ID = $("input[name='VIEW_USER_ID']").val();    //������
    var prcs_back_len = $("input[name='prcs_back']").length; //�Ƿ񷵻ظ�����
    var flow_type = $("input[name='FLOW_TYPE']").val();
    // var prcs_op_uid = $("input[name='prcs_op_uid']").val();  //�����̷��ظ�����Ĭ��������
    // var prcs_uid = $("input[name='prcs_uid']").val();    //�����̷��ظ�����Ĭ�Ͼ�����
    var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH_NEXT']").val(); //δ������ϵľ�����
    var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //ǿ��ת��
    var NEXT_PRCS_ID = $("input[name='NEXT_PRCS_ID']").val();
    var RX_PRCS_LEN = $("#rx_prcs").length;  //���Խڵ㲽������
    var DING = $("#DING").attr("checked") === true ? 1: 0;
    var plugin_str = "";
    if(control_type){
        var $form_plugin = $('[name="form_plugin"]');
        $form_plugin.each(function(i, e){
            plugin_str += '&'+$(e).serialize();
        });
        plugin_str = (plugin_str != "") ? "&TRIGGER="+control_type+plugin_str : "&TRIGGER="+control_type;
    }

    if(RX_PRCS_LEN > 0){
        rx_prcs = $("#rx_prcs").val();
    }
    if(prcs_back_len > 0){
        prcs_back = $("input[name='prcs_back']").val();  //�����̷��ظ����̲���
    }
    if(prcs_id_next == "" || typeof(prcs_id_next) == 'undefined'){
        showMessage(error);
        return;
    }else{
        prcs_id_next = decodeURIComponent(prcs_id_next);//���URL���룬���ݲ��������
        if(free_step != "" && typeof(free_step) != 'undefined'){
            free_step = decodeURIComponent(free_step);
        }
    }
    var POST_STR = "RUN_ID="+q_run_id+"&FLOW_ID="+q_flow_id+"&PRCS_ID="+q_prcs_id+"&FLOW_PRCS="+q_flow_prcs+"&PRCS_KEY_ID="+q_prcs_key_id+"&PRCS_ID_NEXT="+prcs_id_next+"&FREE_STEP="+free_step+"&VIEW_USER_ID="+VIEW_USER_ID+"&PRCS_BACK="+prcs_back+"&RX_PRCS="+rx_prcs+"&DING="+DING+plugin_str+"&NEXT_PRCS_ID="+NEXT_PRCS_ID;
    if(free_step != "" && typeof(free_step) != undefined){
        if(typeof(prcs_id_next1) !='undefined'){
            var prcs_id_next_str1 = prcs_id_next1 + free_step;
            var prcs_id_next_arr1 = prcs_id_next_str1.split(",");
        }
        var prcs_id_next_str = prcs_id_next + free_step;
        var prcs_id_next_arr = prcs_id_next_str.split(",");

    }else{
        var prcs_id_next_arr = prcs_id_next.split(",");
        if(typeof(prcs_id_next1) !='undefined'){
            var prcs_id_next_arr1 = prcs_id_next1.split(",");
        }
    }
    var _continue = true;
    var _error_step = 0;
	var prcsStr = '';
	$.each(prcs_id_next_arr, function(key, val){
        if(val){
			var opUserStr = '';
			var prcsUserStr = '';
            var _zbems = $("#USER_ZB_" + val).find("em");
            var _cbems = $("#USER_CB_" + val).find("em");
            var _topdefault = $("#TOP_DEFAULT_" + val);
            var _smsremind = $("#SMS_REMIND_NEXT_" + val);
            var _mobileremind = $("#MOBILE_REMIND_NEXT_" + val);
            var _freeitem = (prcs_id_next1 != "" && typeof(prcs_id_next1) !='undefined') ? $("#FREE_ITEM_" + prcs_id_next_arr1[key]) : $("#FREE_ITEM_" + val);
            //�ж��Ƿ���������Ϊ�յ����
            if(eval("typeof(allow_zb_isnull_"+val+") !=\"undefined\"")){
                if(eval("allow_zb_isnull_"+val+" == '0'")){
                    if(_zbems.length == 0){
                        _continue = false;
                        _error_step = val;
                        errorblmsg = errorzbisnotnull;
                    }
                }else{
                    if(_zbems.length == 0 && _cbems.length == 0){
                        _continue = false;
                        _error_step = val;
                        errorblmsg = errorblisnotnull;
                    }
                }
            }
            if(_zbems.length > 0){
                //�°�ƴ���������ַ���
				if($("#USER_ZB_" + val).find("em").attr("userid") != '')
				{
					opUserStr += $("#USER_ZB_" + val).find("em").attr("userid")+',';
				}
                POST_STR += "&PRCS_USER_OP_" + val + "=" + $("#USER_ZB_" + val).find("em").attr("userid");
            }
            if(_topdefault.length > 0){
                POST_STR += "&TOP_DEFAULT_" + val + "=" + $("#TOP_DEFAULT_" + val).val();
            }
            if(_freeitem.length > 0){
                var free_item_val = (prcs_id_next1 != "") ? $("#FREE_ITEM_" + prcs_id_next_arr1[key]).val() : $("#FREE_ITEM_" + val).val();
                POST_STR += "&FREE_ITEM_" + val + "=" + free_item_val;
            }
			//�°澭����ƴ��
			var PRCS_USER_TMP = "";
            if(_cbems.length > 0){
                $("#USER_CB_" + val).find("em").each(function(){
					if($(this).attr("userid") != '')
					{
						prcsUserStr += $(this).attr("userid")+',';
					}
                    PRCS_USER_TMP += $(this).attr("userid") + ",";
                });
                POST_STR += "&PRCS_USER_" + val + "=" + PRCS_USER_TMP;
            }
            // if(document.getElementById("SMS_REMIND_NEXT"))
            // {
                // if(document.getElementById("SMS_REMIND_NEXT").checked){
                    // POST_STR += "&SMS_REMIND_NEXT=1,";
                // }else{
                    // POST_STR += "&SMS_REMIND_NEXT=2,";
                // }
            // }
            if(_smsremind.length > 0){
                if(document.getElementById("SMS_REMIND_NEXT_" + val).checked){
                    POST_STR += "&SMS_REMIND_NEXT_" + val + "=1";
                }else{
                    POST_STR += "&SMS_REMIND_NEXT_" + val + "=0";
                }
            }
			if(_mobileremind.length > 0){
                if(document.getElementById("MOBILE_REMIND_NEXT_" + val).checked){
                    POST_STR += "&MOBILE_REMIND_NEXT_" + val + "=1";
                }else{
                    POST_STR += "&MOBILE_REMIND_NEXT_" + val + "=0";
                }
            }
			if(opUserStr == '' && prcsUserStr == '')
			{
				prcsStr += val+',';
			}
		}
	});
	if(prcsStr != '')
	{
		showMessage("��ѡ���"+[prcsStr]+"���������");
		return;
	}
	if(!_continue){
	   showMessage(sprintf(errorblmsg,_error_step));
	   return;
	}
	if(TURN_PRIV != 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null) && flow_type == 1){
		showMessage("������["+NOT_ALL_FINISH+"]��δ������ϣ�����ת�����̣�");
		return;
	}
	if((TURN_PRIV == 1 || flow_type == 2) && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
		if(confirm('������['+NOT_ALL_FINISH+']��δ������ϣ�ȷ��Ҫת����һ������')){
        }else{
            return ;
        }
    }
    POST_STR += "&FLOW_TYPE="+flow_type;
    $.ajax({
        type: 'POST',
        url: 'turn_submit.php',
        cache: false,
        data: POST_STR,
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            //���˷��ʾ�̬ҳ�����html��ǩ�����
            if(data.indexOf('</script>') != -1)
            {
                data = data.substr(data.indexOf('</script>')+9);
            }
            if(data == "NOEDITPRIV"){
                showMessage(noeditpriv);
                return;
            }else if(data == "NOSIGNFLOWPRIV"){
                showMessage(nosignflowpriv);
                return;
            }else if(data == "WORKCOMPLETE"){
                showMessage(workcomplete);
                setTimeout("back2list('"+workcomplete+"')", 1000);
                return;
            }else if(data == "WORKHASTURNNEXT"){
                showMessage(workhasturnnext);
                setTimeout("back2list('"+workhasturnnext+"')", 1000);
                return;
            }else if(data.indexOf('ding') != -1 && tMobileSDK.platForm == 'dd'){
                var data = JSON.parse(data);
                var url = data.url;
                var title = data.title;
                var text = data.text;
                var dinguser = data.dinguser;
                var show_msg = data.message;
                var title_desc = data.title_desc;
                tMobileSDK.ding({
                    users: dinguser,
                    text: text,
                    type: 2,
                    attachment: {
                        title: title,
                        url: url,
                        image: tMobileSDK.module2icon('workflow'),
                        //'http://dev.myoa888.com/static/images/mobile_app/workflow.png',
                        text: title_desc
                    },
                    onSuccess: function(){
                        showMessage(show_msg);
                        setTimeout("back2list('"+show_msg+"')", 1000);
                        return;
                    },
                    onFail : function(){
                        showMessage(show_msg);
                        setTimeout("back2list('"+show_msg+"')", 1000);
                        return;
                    }
                });
            }else if(data == "TRIGGER"){
                goOnTriggerPage('TURN');
                return;
            }
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage(getfature);
        }
   });
}

//һ��ת��
function turn_all(){
    fieldManager.saveWorkFlow();
	var turnall_flag = $("input[name='turnall_flag']").val();
	var next_prcs = $("input[name='next_prcs']").val();
	var top_default = $("input[name='top_default']").val();
	var next_user = $("input[name='next_user']").val();
	var is_disposable = $("input[name='is_disposable']").val();
	var next_user_name = $("input[name='next_user_name_dispos']").val();
	var next_prcs_name = $("input[name='next_prcs_name_dispos']").val();
    var flow_type = $("input[name='FLOW_TYPE']").val();
    var turn_priv = $("input[name='turn_priv']").val();
	var prcs_back = $("input[name='one_key_prcs_back']").val();
	var NOT_ALL_FINISH = $("input[name='not_finish_user']").val();

    if(turn_priv != 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null) && flow_type == 1){
		showMessage("������["+NOT_ALL_FINISH+"]��δ������ϣ�����ת�����̣�");
		return;
	}
	if((turn_priv == 1 || flow_type == 2) && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
		if(confirm('������['+NOT_ALL_FINISH+']��δ������ϣ�ȷ��Ҫת����һ������')){
        }else{
            return ;
        }
    }

	$.ajax({
		type: 'POST',
		url: 'turn_submit.php',
		cache: false,
		data : {
			'RUN_ID' : q_run_id,
			'FLOW_ID' : q_flow_id,
			'PRCS_ID' : q_prcs_id,
			'FLOW_PRCS' : q_flow_prcs,
            'PRCS_KEY_ID' : q_prcs_key_id,
			'TURNALL_FLAG' : turnall_flag,
			'NEXT_PRCS_STR' : next_prcs,
			'TOP_DEFAULT_STR' : top_default,
			'NEXT_USER_STR' : next_user,
            'PRCS_BACK' : prcs_back,
			'IS_DISPOSABLE' : is_disposable
		},
		success: function(data)
		{
			if(data == "NOEDITPRIV"){
				showMessage(noeditpriv);
				return;
			}else if(data == "NOSIGNFLOWPRIV"){
				showMessage(nosignflowpriv);
				return;
			}else if(data == "WORKCOMPLETE"){
                showMessage(workcomplete);
				setTimeout("back2list('"+workcomplete+"')", 1000);
				return;
			}else if(data == "WORKHASTURNNEXT"){
                showMessage("������ת����"+next_user_name+"("+next_prcs_name+")");
				setTimeout("back2list('������ת����"+next_user_name+"("+next_prcs_name+")')", 1000);
				return;
			}else if(data == "NOTURNALLCONDITION" || data == "NOTURNCONDITION"){
                turnWorkFlow();
                return;
            }else if(data.indexOf("NOTALLFINISH") == -1){
                showMessage(data);
				return;
            }
      	},
      	error: function(data){
         	showMessage(getfature);
      	}
    });
}

// ί��
function intrustWorkFlow()
{
    var url = 'intrust.php';
    var flow_type = $("input[name='FLOW_TYPE']").val();
    $.ajax({
        type: 'GET',
        url: url,
        cache: false,
        data: {'RUN_ID': q_run_id, 'FLOW_ID': q_flow_id, 'PRCS_ID': q_prcs_id, 'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID':q_prcs_key_id, 'FLOW_TYPE': flow_type},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            pageTo('intrust');
            $("#scroller_intrust").empty().append(data);
            $("#page_intrust .container .read_detail").last().addClass("endline");
      },
      error: function(data){
         $.ProLoading.hide();
         showMessage("��ȡʧ��");
      }
   });
}

//��ȡ��ǩ��������
function signWorkFlow(){
    $.ajax({
        type: 'GET',
        url: 'sign.php',
        cache: false,
        data: {'RUN_ID': q_run_id, 'FLOW_ID': q_flow_id, 'PRCS_ID': q_prcs_id, 'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'OP_FLAG': q_op_flag},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data){
            $.ProLoading.hide();
            $("#scroller_sign").empty().append(data);
            $("#page_sign .container .read_detail").last().addClass("endline");
            //���Ӱ�����Ϲ���
            if(q_op_flag == 0){}
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage("��ȡʧ��");
        }
    });
}

//��ǩ�ı���
function saveSignWorkFlow(){
    var CONTENT = $("#CONTENT").val();
    var hasAttach = false;
    if($("#UPLOAD_AREA_SIGN .pda_attach").length > 0){
        hasAttach = true;
    }
    if((CONTENT == "" || typeof CONTENT == "undefined") && hasAttach==false){
        return;
    }
    var sign_attach = {
        attach_id: '',
        attach_name: ''
    };
    $("#UPLOAD_AREA_SIGN .pda_attach").each(function(){
        var $this = $(this);
        var attach_id = $this.attr('data-attach_id');
        var attach_name = $this.attr('data-attach_name');
        sign_attach.attach_id += attach_id;
        sign_attach.attach_name += attach_name+"*";
        //sign_attach.push(file);
    });
    sign_attach = JSON.stringify(sign_attach);
    var ret = false;
    $.ajax({
        type: 'GET',
        url: 'sign_submit.php',
        cache: false,
        async: false,
        data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id, 'PRCS_ID': q_prcs_id, 'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'CONTENT': CONTENT,'SIGN_ATTACH':sign_attach},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data){
            $("#UPLOAD_AREA_SIGN").empty();
			$("#CONTENT").val("");
            ret = true;
            $.ProLoading.hide();
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage("��ȡʧ��");
        }
    });
    return ret;
}

function savePublicWorkFlow(){
    if($("#UPLOAD_AREA_PUBLIC .pda_attach").length == 0){
        return;
    }
    var public_attach = {
        attach_id: '',
        attach_name: ''
    };
    $("#UPLOAD_AREA_PUBLIC .pda_attach").each(function(){
        var $this = $(this);
        var attach_id = $this.attr('data-attach_id');
        var attach_name = $this.attr('data-attach_name');
        public_attach.attach_id += attach_id.replace(/,/g,"")+',';
        public_attach.attach_name += attach_name.replace(/\*/g,"")+'*';
    });
    public_attach = JSON.stringify(public_attach);
    //ret�ǹ��������������Ƿ񱣴�ɹ��ı�ʶ�������ڱ����ǰ��֤�Ƿ񱣴�ɹ�
    var ret = false;
    $.ajax({
        type: 'POST',
        url: 'public_submit.php',
        cache: false,
        async: false,
        data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'PUBLIC_ATTACH':public_attach},
        success: function(data){
            ret = true;
            $("#UPLOAD_AREA_PUBLIC").empty();
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage("����ʧ��");
        }
    });
    return ret;
}

//��ǩ�������
function stopWorkFlow(type){
    fieldManager.saveWorkFlow();
    var top_flag = $("#top_flag").val();
    // var top_flag = 2;
    var stopType = type;
    var feedback_content = $("#CONTENT").val();
	if(typeof(feedback_content) != 'undefined')
		feedback_content = $.trim(feedback_content);
	else
		feedback_content = "";
    $.ajax({
        type: 'GET',
        url: 'stop.php',
        cache: false,
        data: {'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'top_flag': top_flag,'feedback_content': feedback_content,'stop_type': stopType},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data){
            $.ProLoading.hide();
            if(data == "NOSUBEDITPRIV"){
                showMessage(nosubeditpriv);
                return;
            }else if(data == "WORKDONECOMPLETE"){
                showMessage(workdonecomplete);
                setTimeout("back2list('"+workdonecomplete+"')", 1000);
                return;
            }else if(data == "SIGNISNOTEMPTY"){
                showMessage(signisnotempty);
                return;
            }else if(data == "TURNNEXT"){
                turnWorkFlow('stop');
                return;
            }else if (data == "TURNALL") {
                turn_all();
                return;
            }
        },
        error: function(data){
            $.ProLoading.hide();
            showMessage("��ȡʧ��");
        }
    });
}

// ��ȡ����ҳ��
function selWorkFlow() {
    //���������ǩ
    fieldManager.saveWorkFlow();
	$.ajax({
		type : "GET",
		url : "sel_back.php",
		cache : false,
		data : {
			"RUN_ID" : q_run_id,
			"FLOW_ID" : q_flow_id,
			"PRCS_ID" : q_prcs_id,
			"FLOW_PRCS" : q_flow_prcs,
            "PRCS_KEY_ID" : q_prcs_key_id
		},
		beforeSend : function() {
			$.ProLoading.show();
		},
		success : function(data) {
			$.ProLoading.hide();
			pageTo('back_work');
			$("#scroller_back_work").empty().append(data);
            $("#page_back_work .container .tform .read_detail").last().addClass("endline");
		},
		error : function(data) {
			$.ProLoading.hide();
			showMessage("��ȡʧ��");
		}
	});
}

//ִ�л��˲���
function goOnSelBackWorkFlow(control_type)
{
    if(window.turn_flag == 1)
    {
        showMessage(nocfcz);
        return;
    }
	// ��ǩ����
    $("#CONTENT_BACK").blur();
	var CONTENT = $("#CONTENT_BACK").val();
	// ���˲���
	var sel_back_prcs = "";
	$("input[name='PRCS']").each(function(i) {
		if (this.checked == true) {
			sel_back_prcs = this.value;
		}
	});
	if (sel_back_prcs == "") {
		showMessage(notselectedstep);
		return;
	}
    if(CONTENT.trim() === "") {
        showMessage(gobackcontentisnull);
        return;
    }
    var plugin_str = '';
    var data = {
        'RUN_ID' : q_run_id,
        'FLOW_ID' : q_flow_id,
        'PRCS_ID' : q_prcs_id,
        'FLOW_PRCS' : q_flow_prcs,
        'PRCS_KEY_ID' : q_prcs_key_id,
        'FLOW_PRCS_LAST' : sel_back_prcs,
        'CONTENT' : CONTENT
    };
    if(control_type){
        data['TRIGGER'] = control_type;
        var $form_plugin = $('[name="form_plugin"]');
        $form_plugin.each(function(i, e){
            var plugin_arr = $(e).serializeArray();
            for(var v in plugin_arr){
                data[plugin_arr[v]['name']] = plugin_arr[v]['value'];
            }
        });
    }

	$.ajax({
		type : 'GET',
		url : 'go_back.php',
		cache : false,
		data : data,
		beforeSend : function() {
			$.ProLoading.show();
            window.turn_flag = 1;
		},
		success : function(data) {
			$.ProLoading.hide();
			if (data == "WORKHASNOTGOBACK") {
				showMessage(workhasnotgoback);
                window.turn_flag = 0;
				return;
			} else if (data == "WORKHASGOBACK") {
                showMessage(workhasgoback);
                setTimeout("back2list('"+workhasgoback+"')", 1000);
				return;
			}else if (data == "TRIGGER") {
                goOnTriggerPage('BACK');
                window.turn_flag = 0;
                return;
            }else if(data.indexOf("|") != -1)
			{
				var msg_arr = data.split('|');
                showMessage(msg_arr[1]);
			}
		},
		error : function(data) {
			$.ProLoading.hide();
			showMessage(getfature);
            window.turn_flag = 0;
		}
	});
}

// ɾ������
function cancel_flow()
{
    $.ajax({
        type: 'GET',
        url: 'delete_work.php',
        cache: false,
        data: {'RUN_ID_STR': q_run_id, 'FLOW_ID': q_flow_id, 'BEGIN_DEPT': q_flow_id, 'PRCS_ID': q_prcs_id,'FLOW_PRCS':q_flow_prcs},
        success: function(data)
        {
            if(data == "ALL"){
                showMessage('���̺�Ϊ��'+q_run_id+'����������ɾ��');
                setTimeout("back2list('���̺�Ϊ��"+q_run_id+"����������ɾ��')", 1000);
                return;
            }else{
                showMessage(data);
                return;
            }
        },
        error: function(data){
            showMessage('����δɾ��');
            return;
        }
    });
}

//չ����Ϣ��ʾҳ
function showPageMessage(str){
    pageTo('show_page_message');
    var content = '<section class="ui-notice" style="margin-top: 90px;"><i></i>'+
                    '<p>'+haveend+'</p>'+
                    '<div class="ui-notice-btn">'+
                        '<button class="ui-btn-primary ui-btn-lg" onclick="back2list();">����</button>'+
                    '</div></section>';
    $("#scroller_show_page_message").html(content);
}

function goOnTriggerPage(type){
    g_tirgger_type = type;
    var data = {"flow_id": q_flow_id, "run_id": q_run_id, "flow_prcs": q_flow_prcs, "prcs_id": q_prcs_id, "prcs_key_id": q_prcs_key_id, "type": g_tirgger_type};
    $.ajax({
        type: 'POST',
        url: 'trigger.php',
        cache: false,
        data: data,
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            pageTo('plugin');
            $("#scroller_plugin").empty().append(data);

            $('#PLUGIN_'+g_tirgger_type+'_BEFORE_POSITION').html($.templates('#PLUGIN_'+g_tirgger_type+'_BEFORE_POSITION_Tmpl').render({end_script:'</script>'}));
            $('#PLUGIN_'+g_tirgger_type+'_AFTER_POSITION').html($.templates('#PLUGIN_'+g_tirgger_type+'_AFTER_POSITION_Tmpl').render({end_script:'</script>'}));
         },
        error: function(data){
            $.ProLoading.hide();
            showMessage(triggerloadfile);
        }
    });
}

function turnTrigger()
{
    var trigger_type = g_tirgger_type.toLowerCase();
    //�û��Զ���js�ű�ִ�г���
    var beforeCustomScript = $("#"+trigger_type+"BeforeCustomScript").val();
    if(typeof beforeCustomScript !== 'undefined')
    {
        var customScriptArr = beforeCustomScript.split(",");
        for(var customScriptCount = 0; customScriptCount < customScriptArr.length; customScriptCount++)
        {
            if (typeof window[customScriptArr[customScriptCount]] == 'function')
            {
                var ret = window[customScriptArr[customScriptCount]]();
                // console.log(ret);
                if(typeof ret !== 'undefined')
                {
                    return;
                }
            }
        }
    }

    if(g_tirgger_type == 'TURN'){
        turnUserWorkFlow('TURN');
    }else if(g_tirgger_type == 'INTRUST'){
        goOnWorkFlowIntrust('INTRUST')
    }else if(g_tirgger_type == 'BACK'){
        goOnSelBackWorkFlow('BACK')
    }

    //�û��Զ���js�ű�ִ�г���
    var afterCustomScript = $("#"+trigger_type+"AfterCustomScript").val();
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
}

//������ѡ����չ����
$.extend($, {
    workFlowSearch: function (options)
    {
        var defaults = { url: "/pda/inc/get_contactlist.php" };
        var options = $.extend(true, defaults, options);
        var input = options.input;
        var list = options.list;
        var appendDom_top = options.appendDom_top;
        var appendDom_zb = options.appendDom_zb;
        var appendDom_cb = options.appendDom_cb;
        var showbtn = options.showbtn;
        var nodate = options.nodate;
        var pageScroll = options.pageScroll;
        var url = options.url;
        if(typeof(mobile_contactlisturl) != "undefined"){
            url = mobile_contactlisturl;
        }
        var $$input = $(input);
        var $$list = $(list);
        var orgHtml = $(list).html();
        var $$showbtn = $(showbtn);
        var $$nodate = $(nodate);
        var _tmp_key;
        var searchInterval = null;
        function init()
        {
            $$input.focus(function(e){
                //orgHtml = $(list).html();
                e.stopPropagation();
                searchInterval = null;
                searchInterval = window.setInterval(search_name,1000);
                $(this).addClass("hasNoBackGround");
            });
            $$input.blur(function(){
                if($(this).val() == ''){
                    $(this).removeClass("hasNoBackGround");
                }
                window.clearInterval(searchInterval);
                searchInterval = null;
            });
			var prcs_num = $$input.attr('prcs_num');
			var user_str = '';
			if(prcs_num != null)
			{
				user_str = $('#HANDLE_USER_'+prcs_num).val();
			}
            //�����찴ť����¼�
            $$list.delegate("a.ui-li-text-a","click",function(e){
				var user_lock = $(this).attr('user_lock');
				var auto_type = $(this).attr('auto_type');
				
				if (user_lock == '0' && auto_type !="" && user_str != '' )
				{
					alert("����Ȩ���Ĵ˲���Ĭ����Ա");
					return false;
				}
                //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                if($(this).hasClass("current")){
                    $(this).removeClass("current");
                    $(this).parents("li").removeClass("active");
                    remove_user("zb",$(this).parents("li"));
                    return;
                }else{
                    if($(appendDom_zb).find("em").length > 0){
                        var uid = $(appendDom_zb).find("em").attr("uid");
                        remove_user("onlyzb",uid);
                        //$$list.find("a.current").parents("li").removeClass("active");
                        $$list.find("a.current").removeClass("current");
                    }
                    $(this).parents("li").addClass("active");
                    $(this).addClass("current");
                    add_user("zb",$(this).parents("li"));
                    return;
                }
            });
            /*
            $$list.find("a.ui-li-text-a").die("click").live("click",function(e)
            {
                //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                if($(this).hasClass("current")){
                    $(this).removeClass("current");
                    $(this).parents("li").removeClass("active");
                    remove_user("zb",$(this).parents("li"));
                    return;
                }else{
                    if($(appendDom_zb).find("em").length > 0){
                        var uid = $(appendDom_zb).find("em").attr("uid");
                        remove_user("onlyzb",uid);
                        //$$list.find("a.current").parents("li").removeClass("active");
                        $$list.find("a.current").removeClass("current");
                    }
                    $(this).parents("li").addClass("active");
                    $(this).addClass("current");
                    add_user("zb",$(this).parents("li"));
                    return;
                }
            });
            */
            //���б����¼�
            $$list.delegate("li","click",function(e){
				var user_lock = $(this).attr('user_lock');
				var auto_type = $(this).attr('auto_type');
				if (user_lock == '0' && auto_type !="" && user_str != '')
				{
					alert("����Ȩ���Ĵ˲���Ĭ����Ա");
					return false;
				}
                //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
                if(false === fixDbClick.call(e.target, e)){
                    return false;
                }
                if($(this).hasClass("active")){
                    $(this).removeClass("active");
                    currentA = $(this).find("a.current");
                    if(currentA.length > 0){
                        currentA.removeClass("current");
                        remove_user("zb", $(this));
                        return;
                    }else{
                        remove_user("cb", $(this));
                        return;
                    }
                }else{
                    $(this).addClass("active");
                    that = $(this);
                    _uid = that.attr("q_id");
                    var haszb = hascb = false;
                    if($(appendDom_zb).find("em").length > 0){
                        $(appendDom_zb).find("em").each(function(){
                            if($(this).attr("uid") == _uid){
                                that.addClass("active");
                                that.find("a.ui-li-text-a").addClass("current");
                                haszb = true;
                                return false;
                            }
                        });
                        $(appendDom_cb).find("em").each(function(){
                            if($(this).attr("uid") == _uid){
                                that.addClass("active");
                                hascb = true;
                                return false;
                                return;
                            }
                        });
                        //����ʹӰ춼û��ѡ����˵�ʱ�򣬼������
                        if(!hascb && !hascb)
                        {
                            add_user("cb", $(this));
                        }
                        return;
                    }else{
                        $(this).find("a.ui-li-text-a").addClass("current");
                        add_user("zb", $(this));
                        return;
                    }
                }
            });
            /*
            $$list.find("li").die("click").live("click",function(e)
            {
                //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
                if(false === fixDbClick.call(e.target, e)){
                    return false;
                }
                if($(this).hasClass("active")){
                    $(this).removeClass("active");
                    currentA = $(this).find("a.current");
                    if(currentA.length > 0){
                        currentA.removeClass("current");
                        remove_user("zb", $(this));
                        return;
                    }else{
                        remove_user("cb", $(this));
                        return;
                    }
                }else{
                    $(this).addClass("active");
                    that = $(this);
                    _uid = that.attr("q_id");
                    var haszb = hascb = false;
                    if($(appendDom_zb).find("em").length > 0){
                            $(appendDom_zb).find("em").each(function(){
                                if($(this).attr("uid") == _uid){
                                that.addClass("active");
                                that.find("a.ui-li-text-a").addClass("current");
                                haszb = true;
                                return false;
                            }
                        });
                        $(appendDom_cb).find("em").each(function(){
                            if($(this).attr("uid") == _uid){
                                that.addClass("active");
                                hascb = true;
                                return false;
                                return;
                            }
                        });
                        //����ʹӰ춼û��ѡ����˵�ʱ�򣬼������
                        if(!hascb && !hascb)
                        {
                            add_user("cb", $(this));
                        }
                        return;
                    }else{
                        $(this).find("a.ui-li-text-a").addClass("current");
                        add_user("zb", $(this));
                        return;
                    }
                }
            });
            */
            //�������˵�ɾ������
            var appendDom_zb_oems = $(appendDom_zb).find("em");
            var appendDom_zb_ospans = $(appendDom_zb).find("em span");
            $(appendDom_zb).delegate("em","click",function(e){
				var user_lock = $(this).attr('user_lock');
				var auto_type = $(this).attr('auto_type');
				if (user_lock == '0' && auto_type !="" && appendDom_zb_oems.length != 0)
				{
					return false;
				}
                //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                if(!$(this).hasClass("active")){
                    $(appendDom_zb).find("em").removeClass("active");
                    // $(appendDom_zb).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(appendDom_zb).find("em span").css('width', '0');
                    $(appendDom_zb).find("em span").hide();
                    $(this).addClass("active");
                    // $(this).find("span").animate({width: '16'},{complete: function(){$(this).show();}, duration: 200 });
                    $(this).find("span").css('width', '16px');
                    $(this).find("span").show();
                }else{
                    $(this).removeClass("active");
                    // $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(this).find("span").css('width', '0');
                    $(this).find("span").hide();
                }
            });
            $(appendDom_zb).delegate("em span","click",function(e){
                //�޸�chrome�µ����������ε�bug
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                var emP = $(this).parent("em");
                emP.remove();
                //ͬʱɾ���б������������Ӧ����ɫ
                var uid = emP.attr("uid");
                $$list.find("li").each(function()
                {
                if($(this).attr("q_id") == uid){
                    $(this).find("a.ui-li-text-a").removeClass("current");
                    return false;
                }
                });
                return;
            });
            //�󶨾����˵�ɾ������
            var appendDom_cb_oems = $(appendDom_cb).find("em");
            var appendDom_cb_ospans = $(appendDom_cb).find("em").find("span");
            $(appendDom_cb).delegate("em","click",function(e){
				var user_lock = $(this).attr('user_lock');
				var auto_type = $(this).attr('auto_type');
				if (user_lock == '0' && auto_type !="" && appendDom_cb_oems.length != 0)
				{
					return false;
				}
                //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                if(!$(this).hasClass("active")){
                    $(appendDom_cb).find("em").removeClass("active");
                    // $(appendDom_cb).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(appendDom_cb).find("em span").css('width', '0');
                    $(appendDom_cb).find("em span").hide();
                    $(this).addClass("active");
                    // $(this).find("span").animate({width: '16'}, {complete: function(){$(this).show();}, duration: 200 });
                    $(this).find("span").css('width', '16px');
                    $(this).find("span").show();
                }else{
                    $(this).removeClass("active");
                    // $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(this).find("span").css('width', '0');
                    $(this).find("span").hide();
                }
            });
            $(appendDom_cb).delegate("em span","click",function(e){
                //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                var emP = $(this).parent("em");
                emP.remove();
                var uid = emP.attr("uid");
                $$list.find("li").each(function(){
                    if($(this).attr("q_id") == uid){
                        //ɾ�������ʱ��ͬʱ��������죬��ɾ������
                        if($(this).find("a.current").length > 0){
                            $(this).find("a").removeClass("current");
                            $(appendDom_zb).find("em").each(function(){
                                if($(this).attr("uid") == uid){
                                    $(this).remove();
                                    return false;
                                }
                            });
                        }
                        $(this).removeClass("active");
                        return false;
                    }
                });
                return;
            });
        }
        function add_user(t, o)
        {
            str = "";
            _oSelect_uid = o.attr("q_id");
            _oSelect_name = o.attr("q_name");
            _oSelect_user_id = o.attr("q_user_id");
            str = "<em uid='"+_oSelect_uid+"' userid='"+_oSelect_user_id+"'>" + _oSelect_name +"<span>��</span></em>";
            if(t == "zb"){
                if($(appendDom_top).val() == 0 || $(appendDom_top).val() == undefined){
                    $(appendDom_zb).append(str);
                }else{
                    $$list.find("a.ui-li-text-a").removeClass("current");
                }
                //�ж����޴Ӱ�
                var cb_has = false;
                if($(appendDom_cb).find("em").length > 0){
                    $(appendDom_cb).find("em").each(function(){
                        if($(this).attr("uid") == _oSelect_uid){
                            cb_has = true;
                            return false;
                        }
                    });
                }
                if(!cb_has){
                    $(appendDom_cb).append(str);
                }
            }else{
                $(appendDom_cb).append(str);
            }
        }
        function remove_user(t, o)
        {
            _oSelect_uid = typeof(o) == "object" ? o.attr("q_id") : o;
            if(t == "zb"){
                $(appendDom_zb).find("em").each(function(){
                    if($(this).attr("uid") == _oSelect_uid){
                        $(this).remove();
                    }else{
                        return true;
                    }
                });
                $(appendDom_cb).find("em").each(function(){
                    if($(this).attr("uid") == _oSelect_uid)
                    {
                        $(this).remove();
                    }else{
                        return true;
                    }
                });
            }else if(t == "cb"){
                $(appendDom_cb).find("em").each(function(){
                    if($(this).attr("uid") == _oSelect_uid){
                        $(this).remove();
                    }else{
                        return true;
                    }
                });
            }else{
                $(appendDom_zb).find("em").each(function(){
                    if($(this).attr("uid") == _oSelect_uid){
                        $(this).remove();
                    }else{
                        return true;
                    }
                });
            }
        }
        function refreshListStatu()
        {
            var zb_oems = $(appendDom_zb).find("em");
            var cb_oems = $(appendDom_cb).find("em");
            if(zb_oems.length > 0){
                var zb_cell_id = zb_oems.attr("uid");
                $(list).find("li").each(function(){
                if($(this).attr("q_id") == zb_oems.attr("uid")){
                    $(this).find("a.ui-li-text-a").addClass("current");
                    return false;
                }
                });
            }
            if(cb_oems.length > 0){
                cb_oems.each(function(){
                    var cb_ceil_id = $(this).attr("uid");
                    $(list).find("li").each(function(){
                        if($(this).attr("q_id") == cb_ceil_id){
                            $(this).addClass("active");
                            return false;
                        }
                    });
                });
            }
        }
        function search_name(opt)
        {
            var reg = "";
            if(opt){
                var key = opt;
            }else{
                var key = $$input.val();
            }
            if(key!=""){
                if(key!=_tmp_key){
                    $$showbtn.hide();
                    _tmp_key = key;
                    if(/^[A-Za-z0-9]+$/.test(key)){
                        var _key_len = key.length;
                        if(_key_len > 1){
                            for(var i = 0;i < key.length;i++){
                                reg += key.charAt(i) + "(.*)";
                            }
                        }else{
                            reg = key + "(.*)";
                        }
                        eval("reg = /(.*)" + reg + "/");
                        _orgObj = $("<ul>"+orgHtml+"</ul>");
                        _orgObj.find("li").each(function(){
                            q_name_index = $(this).attr("q_name_index");
                            q_user_id = $(this).attr("q_user_id");
                            q_byname = $(this).attr("q_byname")
                            if(reg.test(q_name_index) || reg.test(q_user_id) || reg.test(q_byname)){
                                return true;
                            }else{
                                $(this).remove();
                            }
                        });
                    }else if(!isChineseChar(key)){
                        $.ajax({
                            type: 'GET',
                            url: url,
                            cache: false,
                            data: {"KWORD":key, "ACTION": "getNameIndex", "P":P},
                            beforeSend: function(){
                                $.ProLoading.show();
                            },
                            success: function(data)
                            {
                                $.ProLoading.hide();
                                var nameArr = [];
                                nameArr = data.split("*");
                                eval("reg = /(.*)" + nameArr.join("\\*(.*)") + "/");
                                _orgObj = $("<ul>"+orgHtml+"</ul>");
                                _orgObj.find("li").each(function(){
                                    q_name_index = $(this).attr("q_name_index");
                                    //console.log(q_name_index + " " + reg);
                                    if(reg.test(q_name_index)){
                                        return true;
                                    }else{
                                        $(this).remove();
                                    }
                                });
                            }
                        });
                    }else{
                        //���Ϊ�����ģ���ֱ����������б�
                        _orgObj = $("<ul>"+orgHtml+"</ul>");
                        var _key_len = key.length;
                        var partten = '';
                        //��������������
                        if(_key_len > 1){
                            for(var i = 0;i < key.length;i++){
                                if(key.charCodeAt(i) > 128){
                                    var partten = partten + key.charAt(i) + "(.*?)";
                                }
                            }
                        }
                        _orgObj.find("li").each(function(){
                            q_name = $(this).attr("q_name");
                            q_byname = $(this).attr("q_byname");
                            //ִ������ѭ���ж�
                            if(_key_len > 1){
                                if(eval("/" + partten + "/.test(q_name)") || eval("/" + partten + "/.test(q_byname)")){
                                    return true;
                                }else{
                                    $(this).remove();
                                }
                            }else{
                                //��������
                                if(q_name.indexOf(key) > -1 || q_byname.indexOf(key) > -1 ){
                                    return true;
                                }else{
                                    $(this).remove();
                                }

                            }
                        });
                    }
                    li_len = _orgObj.find("li").size();
                    if(li_len > 0 ){
                        $$nodate.hide();
                        $$list.empty().append(_orgObj).find("li").show();
                        if($(showbtn).length == 0 || li_len == 1){
                            $$list.find("li").last().css("border-bottom","none");
                        }
                    }else{
                        $$list.empty();$$nodate.show();
                    }
                }
                refreshListStatu();
                return;
            }else{
                if(_tmp_key == key && key == ""){
                    return;
                }
                _tmp_key = key;
                //���Ϊ���ɾ���ģ���ȫ����ʾ�б�
                $$list.empty().append(orgHtml);
                refreshListStatu();
                if($(showbtn).length == 0){
                    $$list.find("li").show();
                    $$list.find("li").last().css("border-bottom","none");
                }
                $$showbtn.show();
                $$nodate.hide();
                eval(pageScroll+".refresh()");
            }
        }
        return{
            init: init,
            refresh: refreshListStatu
        }
    }
});

//ȷ��ί��
function goOnWorkFlowIntrust(control_type){
    var sms_remind = $("input[name='SMS_REMIND']").val();
    var intrusto = $("#INTRUSTO").find("em").attr("userid");
    var username = $("#INTRUSTO").find("em").html();
    if(typeof(intrusto) == 'undefined'){
        showMessage(nointrustuser);
        return;
    }
    var plugin_str = '';
    var data = {
        'RUN_ID' : q_run_id,
        'FLOW_ID' : q_flow_id,
        'PRCS_ID' : q_prcs_id,
        'FLOW_PRCS' : q_flow_prcs,
        'PRCS_KEY_ID' : q_prcs_key_id,
        'SMS_REMIND' : sms_remind,
        'INTRUSTO' : intrusto
    };
    if(control_type){
        data['TRIGGER'] = control_type;
        var $form_plugin = $('[name="form_plugin"]');
        $form_plugin.each(function(i, e){
            var plugin_arr = $(e).serializeArray();
            for(var v in plugin_arr){
                data[plugin_arr[v]['name']] = plugin_arr[v]['value'];
            }
        });
    }
    $.ajax({
        type: 'POST',
        url: 'intrust_submit.php',
        cache: false,
        data : data,
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            if(data == 'NONORMAL'){
                showMessage(nonormal);
                return;
            }else if(data == 'NOCB2ZB'){
                showMessage(nocb2zb);
                return;
            }else if(data == 'NOCB2CB'){
                showMessage(nocb2cb);
                return;
            }else if(data == 'NOZB2ZB'){
                showMessage(nozb2zb);
                return;
            }else if(data == 'SUCCESS'){
                //����ɹ������
                showMessage(intrustcomplete);
                setTimeout("back2list('"+intrustcomplete+"')", 1000);
                return;
            }else if(data == "TRIGGER"){
                goOnTriggerPage('INTRUST');
                return;
            }
        },
        error: function(data){
            showMessage(getfature);
        }
    });
}

//������ί��ѡ����չ����
$.extend($, {
    workFlowIntrustSearch: function (options)
    {
        var defaults = {
            url: "/pda/inc/get_contactlist.php"
        };
        var options = $.extend(true, defaults, options);
        var input = options.input;
        var list = options.list;
        var appendDom_wt = options.appendDom_wt;
        var showbtn = options.showbtn;
        var nodate = options.nodate;
        var pageScroll = options.pageScroll;
        var url = options.url;
        if(typeof(mobile_contactlisturl) != "undefined"){
            url = mobile_contactlisturl;
        }
        var $$input = $(input);
        var $$list = $(list);
        var orgHtml = $(list).html();
        var $$showbtn = $(showbtn);
        var $$nodate = $(nodate);
        var _tmp_key;
        var searchInterval = null;

        function init()
        {
            $$input.focus(function(e){
                //orgHtml = $(list).html();
                e.stopPropagation();
                searchInterval = null;
                searchInterval = window.setInterval(search_name,1000);
                $(this).addClass("hasNoBackGround");
            });

            $$input.blur(function(){
                if($(this).val() == '')
                    $(this).removeClass("hasNoBackGround");
                window.clearInterval(searchInterval);
                searchInterval = null;
            });

            //���б����¼�
            $$list.delegate("li","click",function(e){
                if(false === fixDbClick.call(e.target, e)){
                    return false;
                }
                if($(this).hasClass("active"))
                {
                    $(this).removeClass("active");
                    currentA = $(this).find("a.current");
                    if(currentA.length > 0)
                    {
                        currentA.removeClass("current");
                        remove_user($(this));
                    }else{
                        remove_user($(this));
                    }
                    return;
                }else{
                    $$list.find("li").each(function()
                    {
                        if($(this).hasClass("active")){
                            $(this).removeClass("active");
                            remove_user($(this));
                        }
                    });
                    $(this).addClass("active");
                    that = $(this);
                    _uid = that.attr("q_id");
                    var haswt = false;
                    if($(appendDom_wt).find("em").length > 0)
                    {
                        $(appendDom_wt).find("em").each(function(){
                            if($(this).attr("uid") == _uid)
                            {
                                that.addClass("active");
                                that.find("a.ui-li-text-a").addClass("current");
                                haswt = true;
                                return false;
                            }
                        });

                        if(!haswt)
                        {
                            add_user($(this));
                        }
                        return;
                    }else{
                        $(this).find("a.ui-li-text-a").addClass("current");
                        add_user($(this));
                        return;
                    }
                }
            });

            //��ί���˵�ɾ������
            $(appendDom_wt).delegate("em","click",function(e){
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                if(!$(this).hasClass("active"))
                {
                    $(appendDom_wt).find("em").removeClass("active");
                    // $(appendDom_wt).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(appendDom_wt).find("em span").css('width', '0');
                    $(appendDom_wt).find("em span").hide();
                    $(this).addClass("active");
                    // $(this).find("span").animate({width: '16'}, {complete: function(){$(this).show();}, duration: 200 });
                    $(this).find("span").css('width', '16px');
                    $(this).find("span").show();
                }else{
                    $(this).removeClass("active");
                    // $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(this).find("span").css('width', '0');
                    $(this).find("span").hide();
                }
            });
            $(appendDom_wt).delegate("em span","click",function(e){
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                var emP = $(this).parent("em");
                emP.remove();

                var uid = emP.attr("uid");
                $$list.find("li").each(function()
                {
                    if($(this).attr("q_id") == uid)
                    {
                        $(this).removeClass("active");
                        return false;
                    }
                });
                return;
            });

        }

        function add_user(o)
        {
            remove_user();
            str = "";
            _oSelect_uid = o.attr("q_id");
            _oSelect_name = o.attr("q_name");
            _oSelect_user_id = o.attr("q_user_id");
            str = "<em uid='"+_oSelect_uid+"' userid='"+_oSelect_user_id+"'>" + _oSelect_name +"<span>��</span></em>";
            $(appendDom_wt).append(str);
        }

        function remove_user(o)
        {
            $(appendDom_wt).find("em").each(function(){
                $(this).remove();
            });
        }

        function refreshListStatu()
        {
            var wt_oems = $(appendDom_wt).find("em");
            if(wt_oems.length > 0)
            {
                $(list).find("li").each(function(){
                    if($(this).attr("q_id") == wt_oems.attr("uid"))
                    {
                        $(this).addClass("active");
                        return false;
                    }
                });
            }
        }

        function search_name(opt)
        {
            var reg = "";
            if(opt){
                var key = opt;
            }
            else{
                var key = $$input.val();
            }
            if(key!="")
            {
                if(key!=_tmp_key)
                {

                    $$showbtn.hide();
                    _tmp_key = key;

                    if(/^[A-Za-z0-9]+$/.test(key))
                    {
                        var _key_len = key.length;
                        if(_key_len > 1)
                        {
                            for(var i = 0;i < key.length;i++)
                            {
                                reg += key.charAt(i) + "(.*)";
                            }
                        }else{
                            reg = key + "(.*)";
                        }
                        eval("reg = /(.*)" + reg + "/");
                        _orgObj = $("<ul>"+orgHtml+"</ul>");
                        _orgObj.find("li").each(function(){
                            q_name_index = $(this).attr("q_name_index");
                            q_user_id = $(this).attr("q_user_id");
                            q_byname = $(this).attr("q_byname");
                            if(reg.test(q_name_index) || reg.test(q_user_id) || reg.test(q_byname)){
                                return true;
                            }
                            else
                                $(this).remove();
                        });

                    }else if(!isChineseChar(key))
                    {
                        $.ajax({
                            type: 'GET',
                            url: url,
                            cache: false,
                            data: {"KWORD":key, "ACTION": "getNameIndex", "P":P},
                            beforeSend: function(){
                                $.ProLoading.show();
                            },
                            success: function(data)
                            {
                                $.ProLoading.hide();
                                var nameArr = [];
                                nameArr = data.split("*");
                                eval("reg = /(.*)" + nameArr.join("\\*(.*)") + "/");
                                _orgObj = $("<ul>"+orgHtml+"</ul>");
                                _orgObj.find("li").each(function(){
                                    q_name_index = $(this).attr("q_name_index");
                                    //console.log(q_name_index + " " + reg);
                                    if(reg.test(q_name_index))
                                        return true;
                                    else
                                        $(this).remove();
                                });
                            }
                        });
                    }else{
                        //���Ϊ�����ģ���ֱ����������б�
                        _orgObj = $("<ul>"+orgHtml+"</ul>");
                        var _key_len = key.length;

                        var partten = '';
                        //��������������
                        if(_key_len > 1)
                        {
                            for(var i = 0;i < key.length;i++)
                            {
                                if(key.charCodeAt(i) > 128)
                                {
                                    var partten = partten + key.charAt(i) + "(.*?)";
                                }
                            }
                        }
                        _orgObj.find("li").each(function(){
                            q_name = $(this).attr("q_name");
                            q_byname = $(this).attr("q_byname");
                            //ִ������ѭ���ж�
                            if(_key_len > 1)
                            {
                                if(eval("/" + partten + "/.test(q_name)") || eval("/" + partten + "/.test(q_byname)"))
                                    return true;
                                else
                                    $(this).remove();
                            }else{
                                //��������
                                if(q_name.indexOf(key) > -1 || q_byname.indexOf(key) > -1)
                                    return true;
                                else
                                    $(this).remove();
                            }
                        });
                    }

                    li_len = _orgObj.find("li").size();
                    if(li_len > 0 )
                    {
                        $$nodate.hide();
                        $$list.empty().append(_orgObj).find("li").show();
                        if($(showbtn).length == 0 || li_len == 1){
                            $$list.find("li").last().css("border-bottom","none");
                        }
                    }else{
                        $$list.empty();$$nodate.show();
                    }
                }

                refreshListStatu();
                return;
            }else{
                if(_tmp_key == key && key == "")
                    return;

                _tmp_key = key;
                //���Ϊ���ɾ���ģ���ȫ����ʾ�б�

                $$list.empty().append(orgHtml);
                refreshListStatu();
                if($(showbtn).length == 0){
                    $$list.find("li").show();
                    $$list.find("li").last().css("border-bottom","none");
                }
                $$showbtn.show();
                $$nodate.hide();
                eval(pageScroll+".refresh()");
            }
        }
        return{
            init: init,
            refresh: refreshListStatu
        }
    }
});

// ��дС���������뷽��
// ת��http://rockyee.iteye.com/blog/891538 ����rockyee
/**
 * �ַ�������
 * @param nSize ����λ��
 * @param ch �����ַ�
 * @returns {string}
 */
String.prototype.padLeft = function (nSize, ch) {
    var len = 0;
    var s = this ? this : '';
    ch = ch ? ch : '0';

    len = s.length;
    while(len < nSize)
    {
        s = ch + s;
        len++;
    }
    return s;
}

/**
 * �ַ����Ҳ���
 * @param nSize ����λ��
 * @param ch �����ַ�
 * @returns {string}
 */
String.prototype.padRight = function (nSize, ch) {
    var len = 0;
    var s = this ? this : '';
    ch = ch ? ch : '0';

    len = s.length;
    while(len < nSize)
    {
        s = s + ch;
        len++;
    }
    return s;
}

/**
 * �����ƶ�С����
 * @param scale ƫ�ƿ̶�
 * @returns {*}
 */
String.prototype.movePointLeft = function (scale) {
    var s, s1, s2, ch, ps, sign;
    ch = '.';
    sign = '';
    s = this ? this : '';

    if(scale <= 0)
    {
        return s;
    }
    ps = s.split('.');
    s1 = ps[0] ? ps[0] : '';
    s2 = ps[1] ? ps[1] : '';
    if(s1.slice(0, 1) == '-')
    {
        s1 = s1.slice(1);
        sign = '-';
    }
    if(s1.length <= scale)
    {
        ch = '0.';
        s1 = s1.padLeft(scale);
    }
    return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
}

/**
 * �����ƶ�С����
 * @param scale ƫ�ƿ̶�
 * @returns {*}
 */
String.prototype.movePointRight = function (scale) {
    var s, s1, s2, ch, ps;
    ch = '.';
    s = this ? this : '';

    if(scale <= 0)
    {
        return s;
    }
    ps = s.split('.');
    s1 = ps[0] ? ps[0] : '';
    s2 = ps[1] ? ps[1] : '';
    if(s2.length <= scale)
    {
        ch = '';
        s2 = s2.padRight(scale);
    }
    return s1 + s2.slice(0, scale) + ch + s2.slice(scale, s2.length);
}

/**
 * �ƶ�С����
 * @param scale ƫ�ƿ̶�
 * @returns {*}
 */
String.prototype.movePoint = function (scale) {
    if(scale >= 0)
    {
        return this.movePointRight(scale)
    }
    else
    {
        return this.movePointLeft(-scale)
    }
}

Number.prototype.newToFixed = function (scale) {
    var s, s1, s2, start;

    s1 = this + '';
    start = s1.indexOf('.');
    s = s1.movePoint(scale);

    if(start >= 0)
    {
        s2 = Number(s1.substr(start + scale + 1, 1));
        if(s2 >= 5 && this >= 0 || s2 < 5 && this < 0)
        {
            s = Math.ceil(s);
        }
        else
        {
            s = Math.floor(s);
        }
    }

    return s.toString().movePoint(-scale);
}
