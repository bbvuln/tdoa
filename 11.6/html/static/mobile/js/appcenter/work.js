//检测中文
function isChineseChar(str) {
    var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]$/;
    return reg.test(str);
}

// 委托
// function intrustWorkFlow() {
//     var formInfo = store.formInfo;
//     var url = '/pda/approve_center/intrust.php';
//     var flow_type = formInfo.flowType;
//     $.ajax({
//         type: 'GET',
//         url: url,
//         cache: false,
//         data: { 'RUN_ID': formInfo.run_id, 'FLOW_ID': formInfo.flow_id, 'PRCS_ID': formInfo.prcs_id, 'FLOW_PRCS': formInfo.flow_prcs, 'PRCS_KEY_ID': formInfo.prcs_key_id, 'FLOW_TYPE': flow_type },
//         beforeSend: function() {
//             $.ProLoading.show();
//         },
//         success: function(data) {
//             $.ProLoading.hide();
//             pages.to('intrust');
//             $("#scroller_intrust").empty().append(data);
//             $("#page_intrust .container .read_detail").last().addClass("endline");
//         },
//         error: function(data) {
//             $.ProLoading.hide();
//             showMessage("获取失败");
//         }
//     });
// }


//请求流程图内容
function ajaxgetMobileFlowGraph(){
  $.ajax({
      type: "get",
      url: "/pda/appcenter/getMobileFlowGraph.php",
      data: {
        formId: store.formInfo.formId,
        userid: store.formInfo.userid,
        time: store.formInfo.time,
        type: store.formInfo.type,
        did: store.formInfo.did,
        run_id: store.formInfo.run_id,
      },
      success: function (response) {
        $('.read_detail_flow_graph').empty().append(response)
      }
    })
}

//确认委托
function goOnWorkFlowIntrust() {
    var formInfo = store.formInfo;
    var sms_remind = $("input[name='SMS_REMIND']").prop('checked') === true ? 1 : 0;
    var intrusto = $("#INTRUSTO").find("em").attr("userid");
    var username = $("#INTRUSTO").find("em").html();
    var run_name = $("#RUN_NAME").html();
    if (typeof(intrusto) == 'undefined') {
        showMessage(nointrustuser);
        return;
    }
    var plugin_str = '';
    var data = {
        'RUN_ID': formInfo.run_id,
        'FLOW_ID': formInfo.flow_id,
        'PRCS_ID': formInfo.prcs_id,
        'FLOW_PRCS': formInfo.flow_prcs,
        'PRCS_KEY_ID': formInfo.prcs_key_id,
        'SMS_REMIND': sms_remind,
        'INTRUSTO': intrusto,
        'RUN_NAME': run_name
    };
    $.ajax({
        type: 'POST',
        url: '/pda/approve_center/intrust_submit.php',
        cache: false,
        data: data,
        beforeSend: function() {
            $.ProLoading.show();
        },
        success: function(data) {
            $.ProLoading.hide();
            if (data == 'NONORMAL') {
                showMessage(nonormal);
                return;
            } else if (data == 'NOCB2ZB') {
                showMessage(nocb2zb);
                return;
            } else if (data == 'NOCB2CB') {
                showMessage(nocb2cb);
                return;
            } else if (data == 'NOZB2ZB') {
                showMessage(nozb2zb);
                return;
            } else if (data == 'SUCCESS') {
                //处理成功的情况
                showMessage(intrustcomplete);
                setTimeout("back2list('" + intrustcomplete + "')", 1000);
                return;
            } else if (data == "TRIGGER") {
                goOnTriggerPage('INTRUST');
                return;
            }else if(data == 'WORKDESTROY')
            {
                var show_msg = "此工作已经销毁，您不能委托！";
                showMessage(show_msg);
                setTimeout("back2list('" + show_msg + "')", 1000);
                return;
            }else if(data == 'WORKDELETE')
            {
                var show_msg = "此工作已经删除，您不能委托！";
                showMessage(show_msg);
                setTimeout("back2list('" + show_msg + "')", 1000);
                return;
            }else if(data == 'WORKOVER')
            {
                var show_msg = "工作已经结束，您不能委托！";
                showMessage(show_msg);
                setTimeout("back2list('" + show_msg + "')", 1000);
                return;
            }else if(data == 'WORKHANG')
            {
                var show_msg = "工作已经挂起，您不能委托！";
                showMessage(show_msg);
                setTimeout("back2list('" + show_msg + "')", 1000);
                return;
            }else if(data == 'WORKBACK')
            {
                var show_msg = "工作已经收回，您不能委托！";
                showMessage(show_msg);
                setTimeout("back2list('" + show_msg + "')", 1000);
                return;
            }
        },
        error: function(data) {
            showMessage(getfature);
        }
    });
}
//增加会签人、会签意见
function goOnAddUser()
{
    var url = "/general/approve_center/list/input_form/data/addsign.php";
    var signUserIds = $('#countersign').val();
    var signContent = $('#CONTENT_ADD').val();
    console.log(store.formInfo)
    $.ajax({
        type:"GET",
        url:url,
        cache:false,
        data:
            {
                "run_id": store.formInfo.run_id,
                "flow_id": store.formInfo.flow_id,
                "prcs_id": store.formInfo.prcs_id,
                "flow_prcs": store.formInfo.flow_prcs,
                "sign_user_ids":signUserIds,
                "sign_user_cause":signContent,
                "mobile_flag":true,
                "op_flag": store.formInfo.real_op_flag,
				"flow_type": store.formInfo.flowType,
            },
        beforeSend: function() {
            $.ProLoading.show();
        },
        success: function(data) {
            $.ProLoading.hide();
            if(data == 'nosignpriv')
            {
                showMessage("增加会签人失败");
            }else
            {
                var data = JSON.parse(data);
                var opUser = data.op_user;
                if(opUser != '' && typeof opUser != 'undefined')
                {
                    showMessage("["+opUser+"] 是本步骤的主办人,不能添加为会签人");
                }else
                {
                    showMessage("添加成功");
                    ajaxgetMobileFlowGraph()
                }
            }
            history.back();
        },
        error: function(data) {
            $.ProLoading.hide();
            showMessage("获取失败");
        }
    });
}
function reback(from, to) {
    pages && pages.to && pages.to(to);
}
// ----- 以下是帮助函数和对象 ------ //
function headReturn(){
    history.back()
}
function showMessage(content){
    alert(content)
}
$.ProLoading = {
    show: function(msg) {
        this.el = $.loading({
            content: msg,
        })
    },
    hide: function() {
        this.el && this.el.loading("hide");
    }
}
//修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
function fixDbClick(e){
    var last_click_timer = this.getAttribute('_last_click_timer_'),
        this_click_timer = (new Date).getTime();
    if(this_click_timer - last_click_timer < 1000){
        e.stopPropagation(); return false;
    }
    this.setAttribute('_last_click_timer_', this_click_timer);
}

function goOnWorkFlow(new_prcs_id_next, turn_action){
    if(b_turning) return;
    b_turning = true;
    var formInfo = store.formInfo
    var formId = formInfo.formId,
        userid = formInfo.userid,
        time = formInfo.time,
        type = formInfo.type,
        run_id = formInfo.run_id,
        run_name = formId.run_name,
        begin_user = formId.begin_user,
        flow_id = formInfo.flow_id,
        prcs_key_id = formInfo.prcs_key_id,
        prcs_id = formInfo.prcs_id,
        flow_prcs = formInfo.flow_prcs,
        did = formInfo.did,
        flow_type = formInfo.flowType,
        turn_priv = formInfo.turn_priv;

    if(turn_priv && run_id){
        var b_return = true;
        $.ajax({
            url: '/general/appbuilder/web/appcenter/appdata/checksign?formId=' + formId + '&run_id=' + run_id + '&flow_prcs=' + flow_prcs + '&prcs_id=' + prcs_id + '&prcs_key_id=' + prcs_key_id,
            type: "get",
            dataType: "json",
            success: function (json) {
                if(json.status == 'error'){
                    alert(json.message);
                }else if(json.status == 'ok'){
                     b_return = false
                    // if(json.message != ''){
                    //     if(window.confirm(json.message)){//跟330行代码重复 所以注释  2020-04-28 whf
                    //         b_return = false
                    //     }
                    // }else{
                    //     b_return = false
                    // }
                }
            },
            error: function (request, strError) {
                showMessage("加载失败，请刷新页面重新加载。")
            },
            async: false
        });
        if(b_return){
            return;
        }
    }
    var RX_PRCS = "";
    var SMS_REMIND_NEXT = 0;
    var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH']").val(); //未办理完毕的经办人
    var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //强制转交
    var PRCS_BACK_LEN = $("input[name='prcs_back']").length; //是否返回父流程
    var SYNC_DEAL = $("input[name='SYNC_DEAL']").val();
    if ($(".rx_prcs").length > 0 && $('input[prcs_type="'+PRCS_TYPE+'"]').prop('checked') === true) {
        var RX_PRCS = $(".rx_prcs").val(); //柔性节点步骤名称
        RX_PRCS = $.trim(RX_PRCS);
        var checkedClass = $(".rx_prcs").prev().prev().find('input').prop('checked');
        if (checkedClass === true) {
            if (RX_PRCS == "") {
                showMessage("柔性节点步骤名称不能为空！");
                b_turning = false;
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
        if($("input[name='NEW_PRCS_ID_NEXT']").length > 1){
            var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']")[0].value;
        }else{
            var prcs_id_next = ($("input[name='NEW_PRCS_ID_NEXT1']").val() == "" || typeof($("input[name='NEW_PRCS_ID_NEXT1']").val()) == "undefined") ? $("input[name='NEW_PRCS_ID_NEXT']").val() : $("input[name='NEW_PRCS_ID_NEXT1']").val();
        }
    }else{
        var prcs_id_next = new_prcs_id_next;
    }
    //自由流程添加预设步骤
    if (flow_type == 2) {
        var freeStepVal = $("input[name='FREE_STEP']").val();
    }
    else {
        var freeStepVal = '';
    }
    // if(PRCS_BACK_LEN > 0){
    //     action = "/pda/approve_center/turn_user.php";
    // }else{
    //     action = "/pda/approve_center/turn_submit.php";
    // }

    action = "/pda/approve_center/turn_user.php";
    if(prcs_id_next == 0 || typeof(prcs_id_next) == 'undefined'){
        if(TURN_PRIV != 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
           showMessage("经办人["+NOT_ALL_FINISH+"]尚未办理完毕，不能结束流程！");
            b_turning = false;
           return;
        }
        if(TURN_PRIV == 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
            if(confirm('经办人['+NOT_ALL_FINISH+']尚未办理完毕，确认要结束流程吗？')){
            }else{
                b_turning = false;
                return ;
            }
        }
        action = "/pda/approve_center/turn_submit.php";
    }
    //var flow_type = $("input[name='FLOW_TYPE']").val();
    if (PRCS_BACK_LEN > 0) {
        action = "/pda/approve_center/turn_user.php";
    }
    if((prcs_id_next == '' || typeof(prcs_id_next) == 'undefined') &&  flow_type != 2){
        showMessage(noselectedstep);
        b_turning = false;
        return ;
    }
    $.ajax({
        type: 'GET',
        url: action,//"/pda/approve_center/turn_user.php",//"/pda/approve_center/turn_sumbit.php"
        cache: false,
        data: {'RUN_ID': store.formInfo.run_id,'FLOW_ID': store.formInfo.flow_id,'PRCS_ID': store.formInfo.prcs_id,'FLOW_PRCS': store.formInfo.flow_prcs, 'PRCS_KEY_ID': store.formInfo.prcs_key_id, 'PRCS_ID_NEXT': prcs_id_next, 'SMS_REMIND_NEXT': SMS_REMIND_NEXT, 'RX_PRCS': '', 'FLOW_TYPE': flow_type, 'FREE_STEP': freeStepVal, "RUN_NAME": store.formInfo.run_name, "BEGIN_USER": store.formInfo.begin_user_name},
        success: function(data)
        {
            if(prcs_id_next == 0 && PRCS_BACK_LEN == 0){
                if (data == "WORKCOMPLETE") {
                    $.ajax({
                        type: 'POST',
                        url: '/general/appbuilder/web/appcenter/appdata/submit',
                        data: {
                            formId: formId,
                            userid: userid,
                            time: time,
                            did: did,
                            run_id: run_id,
                            prcs_key_id: prcs_key_id,
                            prcs_id: prcs_id,
                            flow_prcs: flow_prcs,
                            run_key:store.run_key
                        },
                        async: false
                    });
                    showMessage(workcomplete);
                    back2list(workcomplete);
                    b_turning = false;
                    return;
                }else if(data == "WORKOVER"){
                    back2list(workcomplete);
                    b_turning = false;
                    return;
                }
                showMessage(data);
                b_turning = false;
                return;
            }else{
                pages.to('turn_user');
                $("#scroller_turn_user").empty().append(data);
                $("#scroller_turn_user").find(".userlist").last().css('margin-bottom', '60px');
            }
        },
      error: function(data){
         showMessage("获取失败");
      },
        async: false
   });
    b_turning = false;
}
//退回
function goOnSelBackWorkFlow(control_type) {
    if (window.turn_flag == 1) {
        showMessage(nocfcz);
        return;
    }
    // 会签内容
    $("#CONTENT_BACK").blur();
    var CONTENT = $("#CONTENT_BACK").val();
    // 回退步骤
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
    if (CONTENT.trim() === "") {
        showMessage(gobackcontentisnull);
        return;
    }
    var plugin_str = '';
    var data = {
        'RUN_ID': store.formInfo.run_id,
        'FLOW_ID': store.formInfo.flow_id,
        'PRCS_ID': store.formInfo.prcs_id,
        'FLOW_PRCS': store.formInfo.flow_prcs,
        'PRCS_KEY_ID': store.formInfo.prcs_key_id,
        'FLOW_PRCS_LAST': sel_back_prcs,
        'CONTENT': CONTENT
    };
    if (control_type) {
        data['TRIGGER'] = control_type;
        var $form_plugin = $('[name="form_plugin"]');
        $form_plugin.each(function(i, e) {
            var plugin_arr = $(e).serializeArray();
            for (var v in plugin_arr) {
                data[plugin_arr[v]['name']] = plugin_arr[v]['value'];
            }
        });
    }

    $.ajax({
        type: 'GET',
        url: 'go_back.php',
        cache: false,
        data: data,
        beforeSend: function() {
            $.ProLoading.show();
            window.turn_flag = 1;
        },
        success: function(data) {
            $.ProLoading.hide();
            if (data == "WORKHASNOTGOBACK") {
                showMessage(workhasnotgoback);
                window.turn_flag = 0;
                return;
            } else if (data == "WORKHASGOBACK") {
                $.ajax({
                    type: 'POST',
                    url: '/general/appbuilder/web/appcenter/appdata/back',
                    data: {
                        formId: store.formInfo.formId,
                        userid: store.formInfo.userid,
                        time: store.formInfo.time,
                        did: store.formInfo.did,
                        run_id: store.formInfo.run_id,
                        prcs_key_id: store.formInfo.prcs_key_id,
                        prcs_id: store.formInfo.prcs_id,
                        flow_prcs: store.formInfo.flow_prcs,
                        back_flow_prcs: sel_back_prcs,
                        run_key:store.run_key
                    },
                    async: false
                });

                showMessage(workhasgoback);
                back2list(workhasgoback)
                return;
            } else if (data == "TRIGGER") {
                goOnTriggerPage('BACK');
                window.turn_flag = 0;
                return;
            } else if (data.indexOf("|") != -1) {
                var msg_arr = data.split('|');
                showMessage(msg_arr[1]);
            }
        },
        error: function(data) {
            $.ProLoading.hide();
            showMessage(getfature);
            window.turn_flag = 0;
        },
        async: false
    });
}

function sprintf(str){
    var array = str.split("%s");
    if(array.length == 1 || array.length != arguments.length)
    return str;
    str = array[0];
    for(var i = 1; i < array.length; i++){
        str += arguments[i] + array[i];
    }
    return str;
}

var b_turning = false;
function turnUserWorkFlow(control_type) {
    if(b_turning) return;
    b_turning = true;
    //获取表单信息
    var formInfo = store.formInfo
    var formId = formInfo.formId,
        userid = formInfo.userid,
        time = formInfo.time,
        type = formInfo.type,
        run_id = formInfo.run_id,
        run_name = formId.run_name,
        begin_user = formId.begin_user,
        flow_id = formInfo.flow_id,
        prcs_key_id = formInfo.prcs_key_id,
        prcs_id = formInfo.prcs_id,
        flow_prcs = formInfo.flow_prcs,
        did = formInfo.did,
        flow_type = formInfo.flowType;
    var prcs_back = '';
    var rx_prcs = '';
    var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']").val();
    var prcs_id_next1 = $("input[name='NEW_PRCS_ID_NEXT1']").val();
    var free_step = $("input[name='FREE_STEP']").val();
    var preset = $("input[name='PRESET']").val();
    var VIEW_USER_ID = $("input[name='VIEW_USER_ID']").val(); //传阅人
    var prcs_back_len = $("input[name='prcs_back']").length; //是否返回父流程
    //var flow_type = $("input[name='FLOW_TYPE']").val();
    var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH_NEXT']").val(); //未办理完毕的经办人
    var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //强制转交
    var NEXT_PRCS_ID = $("input[name='NEXT_PRCS_ID']").val();
    var RX_PRCS_LEN = $("#rx_prcs").length; //柔性节点步骤名称
    var DING = $("#DING").attr("checked") === true ? 1 : 0;
    var plugin_str = "";
    if (control_type) {
        var $form_plugin = $('[name="form_plugin"]');
        $form_plugin.each(function(i, e) {
            plugin_str += '&' + $(e).serialize();
        });
        plugin_str = (plugin_str != "") ? "&TRIGGER=" + control_type + plugin_str : "&TRIGGER=" + control_type;
    }

    // if (RX_PRCS_LEN > 0) {
    //     rx_prcs = $("#rx_prcs").val();
    // }
    if (prcs_back_len > 0) {
        prcs_back = $("input[name='prcs_back']").val(); //子流程返回父流程步骤
    }
    if (prcs_id_next == "" || typeof(prcs_id_next) == 'undefined') {
        b_turning = false;
        showMessage(error);
        return;
    } else {
        prcs_id_next = decodeURIComponent(prcs_id_next); //添加URL解码，兼容部分浏览器
        if (free_step != "" && typeof(free_step) != 'undefined') {
            free_step = decodeURIComponent(free_step);
        }
    }
    var POST_STR = "RUN_ID=" + run_id + "&FLOW_ID=" + flow_id + "&PRCS_ID=" + prcs_id + "&FLOW_PRCS=" + flow_prcs + "&PRCS_KEY_ID=" + prcs_key_id + "&PRCS_ID_NEXT=" + prcs_id_next + "&FREE_STEP=" + free_step + "&VIEW_USER_ID=" + VIEW_USER_ID + "&PRCS_BACK=" + prcs_back + "&RX_PRCS=" + rx_prcs + "&DING=" + DING + plugin_str + "&NEXT_PRCS_ID=" + NEXT_PRCS_ID + "&RUN_NAME=" + run_name + "&BEGIN_USER=" + begin_user;
    if (free_step != "" && typeof(free_step) != undefined) {
        if (typeof(prcs_id_next1) != 'undefined') {
            var prcs_id_next_str1 = prcs_id_next1 + free_step;
            var prcs_id_next_arr1 = prcs_id_next_str1.split(",");
        }
        var prcs_id_next_str = prcs_id_next + free_step;
        var prcs_id_next_arr = prcs_id_next_str.split(",");

    } else {
        var prcs_id_next_arr = prcs_id_next.split(",");
        if (typeof(prcs_id_next1) != 'undefined') {
            var prcs_id_next_arr1 = prcs_id_next1.split(",");
        }
    }
    var _continue = true;
    var _error_step = 0;
    $.each(prcs_id_next_arr, function(key, val) {
        if (val) {
            var _zbems = $("#USER_ZB_" + val).find("em");
            var _cbems = $("#USER_CB_" + val).find("em");
            var _topdefault = $("#TOP_DEFAULT_" + val);
            var _smsremind = $("#SMS_REMIND_NEXT_" + val);
            var _freeitem = (prcs_id_next1 != "" && typeof(prcs_id_next1) != 'undefined') ? $("#FREE_ITEM_" + prcs_id_next_arr1[key]) : $("#FREE_ITEM_" + val);
            var _freeformitem = (prcs_id_next1 != "" && typeof(prcs_id_next1) != 'undefined') ? $("#FREE_FORM_ITEM_" + prcs_id_next_arr1[key]) : $("#FREE_FORM_ITEM_" + val);
            //判断是否允许主办为空的情况
            if (eval("typeof(allow_zb_isnull_" + val + ") !=\"undefined\"")) {
                if (eval("allow_zb_isnull_" + val + " == '0'")) {
                    if (_zbems.length == 0) {
                        _continue = false;
                        _error_step = val;
                        errorblmsg = errorzbisnotnull ? errorzbisnotnull : '';
                    }
                } else {
                    if (_zbems.length == 0 && _cbems.length == 0) {
                        _continue = false;
                        _error_step = val;
                        errorblmsg = errorblisnotnull ? errorblisnotnull : '';
                    }
                }
            }
            if (_zbems.length > 0) {
                //新版拼接主办人字符串
                POST_STR += "&PRCS_USER_OP_" + val + "=" + $("#USER_ZB_" + val).find("em").attr("userid");
            }
            if (_topdefault.length > 0) {
                POST_STR += "&TOP_DEFAULT_" + val + "=" + $("#TOP_DEFAULT_" + val).val();
            }
            if (_freeitem.length > 0) {
                var free_item_val = (prcs_id_next1 != "") ? $("#FREE_ITEM_" + prcs_id_next_arr1[key]).val() : $("#FREE_ITEM_" + val).val();
                POST_STR += "&FREE_ITEM_" + val + "=" + free_item_val;
            }
            if (_freeformitem.length > 0) {
                var free_item_val = (prcs_id_next1 != "") ? $("#FREE_FORM_ITEM_" + prcs_id_next_arr1[key]).val() : $("#FREE_FORM_ITEM_" + val).val();
                POST_STR += "&FREE_FORM_ITEM_" + val + "=" + free_item_val;
            }
            //新版经办人拼接
            var PRCS_USER_TMP = "";
            if (_cbems.length > 0) {
                $("#USER_CB_" + val).find("em").each(function() {
                    PRCS_USER_TMP += $(this).attr("userid") + ",";
                });
                POST_STR += "&PRCS_USER_" + val + "=" + PRCS_USER_TMP;
            }
            // if(document.getElementById("SMS_REMIND_NEXT"))
//            if (_smsremind.length > 0) {
//                if (document.getElementById("SMS_REMIND_NEXT_" + val).checked) {
//                    POST_STR += "&SMS_REMIND_NEXT_" + val + "=1";
//                } else {
//                    POST_STR += "&SMS_REMIND_NEXT_" + val + "=0";
//                }
//            }
        }
    });
    if (document.getElementById("SMS_REMIND_NEXT_FOR_TURN").checked) {
        POST_STR += "&SMS_REMIND_NEXT=1";
    } else {
        POST_STR += "&SMS_REMIND_NEXT=0";
    }

    if(document.getElementById("MOBILE_REMIND_NEXT").checked){
        POST_STR += "&MOBILE_REMIND_NEXT=1";
    }else{
        POST_STR += "&MOBILE_REMIND_NEXT=0";
    }
    if (!_continue) {
        b_turning = false;
        showMessage(sprintf(errorblmsg, _error_step));
        return;
    }
    if (TURN_PRIV != 1 && (NOT_ALL_FINISH != "" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null) && flow_type == 1) {
        b_turning = false;
        showMessage("经办人[" + NOT_ALL_FINISH + "]尚未办理完毕，不能转交流程！");
        return;
    }
    if ((TURN_PRIV == 1 || flow_type == 2) && (NOT_ALL_FINISH != "" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)) {
        if (confirm('经办人[' + NOT_ALL_FINISH + ']尚未办理完毕，确认要转交下一步骤吗？')) {} else {
            b_turning = false;
            return;
        }
    }
    POST_STR += "&FLOW_TYPE=" + flow_type;
    $.ajax({
        type: 'POST',
        url: '/pda/approve_center/turn_submit.php',
        cache: false,
        data: POST_STR,
        success: function(data) {
            if(data == "" || data == "WORKCOMPLETE" || data == "WORKHASTURNNEXT"){
                $.ajax({
                    type: 'POST',
                    url: '/general/appbuilder/web/appcenter/appdata/submit',
                    data: {
                        formId: formId,
                        userid: userid,
                        time: time,
                        did: did,
                        run_id: run_id,
                        prcs_key_id: prcs_key_id,
                        prcs_id: prcs_id,
                        flow_prcs: flow_prcs,
                        run_key:store.run_key
                    },
                    async: false
                });
            }
            if (data == "NOEDITPRIV") {
                b_turning = false;
                showMessage(noeditpriv);
                return;
            } else if (data == "NOSIGNFLOWPRIV") {
                b_turning = false;
                showMessage(nosignflowpriv);
                return;
            } else if (data == "WORKCOMPLETE") {
                b_turning = false;
                showMessage(workcomplete);
                back2list(workcomplete)
                return;
            } else if (data == "WORKHASTURNNEXT") {
                b_turning = false;
                showMessage(workhasturnnext);
                back2list(workhasturnnext)
            } else if (data.indexOf('ding') != -1 && tMobileSDK.platForm == 'dd') {
                b_turning = false;
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
                    onSuccess: function() {
                        showMessage(show_msg);
                        back2list(show_msg);
                        return;
                    },
                    onFail: function() {
                        showMessage(show_msg);
                        back2list(show_msg);
                        return;
                    }
                });
            } else if (data == "TRIGGER") {
                b_turning = false;
                goOnTriggerPage('TURN');
                return;
            }else if(data == 'WORKDESTROY')
            {
                b_turning = false;
                var show_msg = "此工作已经销毁，您不能办理！";
                showMessage(show_msg);
                return;
            }else if(data == 'WORKDELETE')
            {
                b_turning = false;
                var show_msg = "此工作已经删除，您不能办理！";
                showMessage(show_msg);
                return;
            }else if(data == 'WORKOVER')
            {
                b_turning = false;
                var show_msg = "工作已经结束，您不能办理！";
                showMessage(show_msg);
                return;
            }else if(data == 'WORKHANG')
            {
                b_turning = false;
                var show_msg = "工作已经挂起，您不能办理！";
                showMessage(show_msg);
                return;
            }else if(data == 'WORKBACK')
            {
                b_turning = false;
                var show_msg = "工作已经收回，您不能办理！";
                showMessage(show_msg);
                return;
            }
        },
        error: function(data) {
            b_turning = false;
            showMessage(getfature);
        },
        async: false
    });
    b_turning = false;
}

//工作流选人扩展搜索
$.extend($, {
    workFlowIntrustSearch: function(options) {
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
        if (typeof(mobile_contactlisturl) != "undefined") {
            url = mobile_contactlisturl;
        }
        var $$input = $(input);
        var $$list = $(list);
        var orgHtml = $(list).html();
        var $$showbtn = $(showbtn);
        var $$nodate = $(nodate);
        var _tmp_key;
        var searchInterval = null;

        function init() {
            $$input.focus(function(e) {
                //orgHtml = $(list).html();
                e.stopPropagation();
                searchInterval = null;
                searchInterval = window.setInterval(search_name, 1000);
                $(this).addClass("hasNoBackGround");
            });

            $$input.blur(function() {
                if ($(this).val() == '')
                    $(this).removeClass("hasNoBackGround");
                window.clearInterval(searchInterval);
                searchInterval = null;
            });

            //绑定列表点击事件
            $$list.delegate("li", "click", function(e) {
                if (false === fixDbClick.call(e.target, e)) {
                    return false;
                }
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    currentA = $(this).find("a.current");
                    if (currentA.length > 0) {
                        currentA.removeClass("current");
                        remove_user($(this));
                    } else {
                        remove_user($(this));
                    }
                    return;
                } else {
                    $$list.find("li").each(function() {
                        if ($(this).hasClass("active")) {
                            $(this).removeClass("active");
                            remove_user($(this));
                        }
                    });
                    $(this).addClass("active");
                    that = $(this);
                    _uid = that.attr("q_id");
                    var haswt = false;
                    if ($(appendDom_wt).find("em").length > 0) {
                        $(appendDom_wt).find("em").each(function() {
                            if ($(this).attr("uid") == _uid) {
                                that.addClass("active");
                                that.find("a.ui-li-text-a").addClass("current");
                                haswt = true;
                                return false;
                            }
                        });

                        if (!haswt) {
                            add_user($(this));
                        }
                        return;
                    } else {
                        $(this).find("a.ui-li-text-a").addClass("current");
                        add_user($(this));
                        return;
                    }
                }
            });

            //绑定委托人的删除操作
            $(appendDom_wt).delegate("em", "click", function(e) {
                if (false === fixDbClick.call(this, e)) {
                    return false;
                }
                e.stopPropagation();
                if (!$(this).hasClass("active")) {
                    $(appendDom_wt).find("em").removeClass("active");
                    // $(appendDom_wt).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(appendDom_wt).find("em span").css('width', '0');
                    $(appendDom_wt).find("em span").hide();
                    $(this).addClass("active");
                    // $(this).find("span").animate({width: '16'}, {complete: function(){$(this).show();}, duration: 200 });
                    $(this).find("span").css('width', '16px');
                    $(this).find("span").show();
                } else {
                    $(this).removeClass("active");
                    // $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(this).find("span").css('width', '0');
                    $(this).find("span").hide();
                }
            });
            $(appendDom_wt).delegate("em span", "click", function(e) {
                if (false === fixDbClick.call(this, e)) {
                    return false;
                }
                e.stopPropagation();
                var emP = $(this).parent("em");
                emP.remove();

                var uid = emP.attr("uid");
                $$list.find("li").each(function() {
                    if ($(this).attr("q_id") == uid) {
                        $(this).removeClass("active");
                        return false;
                    }
                });
                return;
            });

        }

        function add_user(o) {
            remove_user();
            str = "";
            _oSelect_uid = o.attr("q_id");
            _oSelect_name = o.attr("q_name");
            _oSelect_user_id = o.attr("q_user_id");
            str = "<em uid='" + _oSelect_uid + "' userid='" + _oSelect_user_id + "'>" + _oSelect_name + "<span>—</span></em>";
            $(appendDom_wt).append(str);
        }

        function remove_user(o) {
            $(appendDom_wt).find("em").each(function() {
                $(this).remove();
            });
        }

        function refreshListStatu() {
            var wt_oems = $(appendDom_wt).find("em");
            if (wt_oems.length > 0) {
                $(list).find("li").each(function() {
                    if ($(this).attr("q_id") == wt_oems.attr("uid")) {
                        $(this).addClass("active");
                        return false;
                    }
                });
            }
        }

        function search_name(opt) {
            var reg = "";
            if (opt) {
                var key = opt;
            } else {
                var key = $$input.val();
            }
            if (key != "") {
                if (key != _tmp_key) {

                    $$showbtn.hide();
                    _tmp_key = key;

                    if (/^[A-Za-z0-9]+$/.test(key)) {
                        var _key_len = key.length;
                        if (_key_len > 1) {
                            for (var i = 0; i < key.length; i++) {
                                reg += key.charAt(i) + "(.*)";
                            }
                        } else {
                            reg = key + "(.*)";
                        }
                        eval("reg = /(.*)" + reg + "/");
                        _orgObj = $("<ul>" + orgHtml + "</ul>");
                        _orgObj.find("li").each(function() {
                            q_name_index = $(this).attr("q_name_index");
                            q_user_id = $(this).attr("q_user_id");
                            q_byname = $(this).attr("q_byname");
                            if (reg.test(q_name_index) || reg.test(q_user_id) || reg.test(q_byname)) {
                                return true;
                            } else
                                $(this).remove();
                        });

                    } else if (!isChineseChar(key)) {
                        $.ajax({
                            type: 'GET',
                            url: url,
                            cache: false,
                            data: { "KWORD": key, "ACTION": "getNameIndex", "P": P },
                            beforeSend: function() {
                                $.ProLoading.show();
                            },
                            success: function(data) {
                                $.ProLoading.hide();
                                var nameArr = [];
                                nameArr = data.split("*");
                                eval("reg = /(.*)" + nameArr.join("\\*(.*)") + "/");
                                _orgObj = $("<ul>" + orgHtml + "</ul>");
                                _orgObj.find("li").each(function() {
                                    q_name_index = $(this).attr("q_name_index");
                                    //console.log(q_name_index + " " + reg);
                                    if (reg.test(q_name_index))
                                        return true;
                                    else
                                        $(this).remove();
                                });
                            }
                        });
                    } else {
                        //如果为纯中文，则直接搜索结果列表
                        _orgObj = $("<ul>" + orgHtml + "</ul>");
                        var _key_len = key.length;

                        var partten = '';
                        //如果包括多个汉字
                        if (_key_len > 1) {
                            for (var i = 0; i < key.length; i++) {
                                if (key.charCodeAt(i) > 128) {
                                    var partten = partten + key.charAt(i) + "(.*?)";
                                }
                            }
                        }
                        _orgObj.find("li").each(function() {
                            q_name = $(this).attr("q_name");
                            q_byname = $(this).attr("q_byname");
                            //执行数组循环判断
                            if (_key_len > 1) {
                                if (eval("/" + partten + "/.test(q_name)") || eval("/" + partten + "/.test(q_byname)"))
                                    return true;
                                else
                                    $(this).remove();
                            } else {
                                //单个汉字
                                if (q_name.indexOf(key) > -1 || q_byname.indexOf(key) > -1)
                                    return true;
                                else
                                    $(this).remove();
                            }
                        });
                    }

                    li_len = _orgObj.find("li").size();
                    if (li_len > 0) {
                        $$nodate.hide();
                        $$list.empty().append(_orgObj).find("li").show();
                        if ($(showbtn).length == 0 || li_len == 1) {
                            $$list.find("li").last().css("border-bottom", "none");
                        }
                    } else {
                        $$list.empty();
                        $$nodate.show();
                    }
                }

                refreshListStatu();
                return;
            } else {
                if (_tmp_key == key && key == "")
                    return;

                _tmp_key = key;
                //如果为点击删掉的，则全部显示列表

                $$list.empty().append(orgHtml);
                refreshListStatu();
                if ($(showbtn).length == 0) {
                    $$list.find("li").show();
                    $$list.find("li").last().css("border-bottom", "none");
                }
                $$showbtn.show();
                $$nodate.hide();
                eval(pageScroll + ".refresh()");
            }
        }
        return {
            init: init,
            refresh: refreshListStatu
        }
    },
    workFlowSearch: function(options) {
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
        if (typeof(mobile_contactlisturl) != "undefined") {
            url = mobile_contactlisturl;
        }
        var $$input = $(input);
        var $$list = $(list);
        var orgHtml = $(list).html();
        var $$showbtn = $(showbtn);
        var $$nodate = $(nodate);
        var _tmp_key;
        var searchInterval = null;

        function init() {
            $$input.focus(function(e) {
                //orgHtml = $(list).html();
                e.stopPropagation();
                searchInterval = null;
                searchInterval = window.setInterval(search_name, 1000);
                $(this).addClass("hasNoBackGround");
            });
            $$input.blur(function() {
                if ($(this).val() == '') {
                    $(this).removeClass("hasNoBackGround");
                }
                window.clearInterval(searchInterval);
                searchInterval = null;
            });
            //绑定主办按钮点击事件
            $$list.delegate("a.ui-li-text-a", "click", function(e) {
                var user_lock = $(this).attr('user_lock');
                var auto_type = $(this).attr('auto_type');
                if (user_lock == '0' && auto_type != "" && $('.read_detail_fem ').find('em').length != 0) {
                    alert("您无权更改此步骤默认人员");
                    return false;
                }
                //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
                if (false === fixDbClick.call(this, e)) {
                    return false;
                }
                e.stopPropagation();
                if ($(this).hasClass("current")) {
                    $(this).removeClass("current");
                    $(this).parents("li").removeClass("active");
                    remove_user("zb", $(this).parents("li"));
                    return;
                } else {
                    if ($(appendDom_zb).find("em").length > 0) {
                        var uid = $(appendDom_zb).find("em").attr("uid");
                        remove_user("onlyzb", uid);
                        //$$list.find("a.current").parents("li").removeClass("active");
                        $$list.find("a.current").removeClass("current");
                    }
                    $(this).parents("li").addClass("active");
                    $(this).addClass("current");
                    add_user("zb", $(this).parents("li"));
                    return;
                }
            });
            //绑定列表点击事件
            $$list.delegate("li", "click", function(e) {
                var user_lock = $(this).attr('user_lock');
                var auto_type = $(this).attr('auto_type');
                if (user_lock == '0' && auto_type != "" && $('.read_detail_fem ').find('em').length != 0) {
                    return false;
                }
                //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
                if (false === fixDbClick.call(e.target, e)) {
                    return false;
                }
                if ($(this).hasClass("active")) {
                    $(this).removeClass("active");
                    currentA = $(this).find("a.current");
                    if (currentA.length > 0) {
                        currentA.removeClass("current");
                        remove_user("zb", $(this));
                        return;
                    } else {
                        remove_user("cb", $(this));
                        return;
                    }
                } else {
                    $(this).addClass("active");
                    that = $(this);
                    _uid = that.attr("q_id");
                    var haszb = hascb = false;
                    if ($(appendDom_zb).find("em").length > 0) {
                        $(appendDom_zb).find("em").each(function() {
                            if ($(this).attr("uid") == _uid) {
                                that.addClass("active");
                                that.find("a.ui-li-text-a").addClass("current");
                                haszb = true;
                                return false;
                            }
                        });
                        $(appendDom_cb).find("em").each(function() {
                            if ($(this).attr("uid") == _uid) {
                                that.addClass("active");
                                hascb = true;
                                return false;
                                return;
                            }
                        });
                        //主办和从办都没有选择该人的时候，加入该人
                        if (!hascb && !hascb) {
                            add_user("cb", $(this));
                        }
                        return;
                    } else {
                        $(this).find("a.ui-li-text-a").addClass("current");
                        add_user("zb", $(this));
                        return;
                    }
                }
            });
            //绑定主办人的删除操作
            var appendDom_zb_oems = $(appendDom_zb).find("em");
            var appendDom_zb_ospans = $(appendDom_zb).find("em span");
            $(appendDom_zb).delegate("em", "click", function(e) {
                var user_lock = $(this).attr('user_lock');
                var auto_type = $(this).attr('auto_type');
                if (user_lock == '0' && auto_type != "" && appendDom_zb_oems.length != 0) {
                    return false;
                }
                //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
                if (false === fixDbClick.call(this, e)) {
                    return false;
                }
                e.stopPropagation();
                if (!$(this).hasClass("active")) {
                    $(appendDom_zb).find("em").removeClass("active");
                    // $(appendDom_zb).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(appendDom_zb).find("em span").css('width', '0');
                    $(appendDom_zb).find("em span").hide();
                    $(this).addClass("active");
                    // $(this).find("span").animate({width: '16'},{complete: function(){$(this).show();}, duration: 200 });
                    $(this).find("span").css('width', '16px');
                    $(this).find("span").show();
                } else {
                    $(this).removeClass("active");
                    // $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(this).find("span").css('width', '0');
                    $(this).find("span").hide();
                }
            });
            $(appendDom_zb).delegate("em span", "click", function(e) {
                //修复chrome下单击触发两次的bug
                if (false === fixDbClick.call(this, e)) {
                    return false;
                }
                e.stopPropagation();
                var emP = $(this).parent("em");
                emP.remove();
                //同时删除列表数据中主办对应的颜色
                var uid = emP.attr("uid");
                $$list.find("li").each(function() {
                    if ($(this).attr("q_id") == uid) {
                        $(this).find("a.ui-li-text-a").removeClass("current");
                        return false;
                    }
                });
                return;
            });
            //绑定经办人的删除操作
            var appendDom_cb_oems = $(appendDom_cb).find("em");
            var appendDom_cb_ospans = $(appendDom_cb).find("em").find("span");
            $(appendDom_cb).delegate("em", "click", function(e) {
                var user_lock = $(this).attr('user_lock');
                var auto_type = $(this).attr('auto_type');
                if (user_lock == '0' && auto_type != "" && appendDom_cb_oems.length != 0) {
                    return false;
                }
                //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
                if (false === fixDbClick.call(this, e)) {
                    return false;
                }
                e.stopPropagation();
                if (!$(this).hasClass("active")) {
                    $(appendDom_cb).find("em").removeClass("active");
                    // $(appendDom_cb).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(appendDom_cb).find("em span").css('width', '0');
                    $(appendDom_cb).find("em span").hide();
                    $(this).addClass("active");
                    // $(this).find("span").animate({width: '16'}, {complete: function(){$(this).show();}, duration: 200 });
                    $(this).find("span").css('width', '16px');
                    $(this).find("span").show();
                } else {
                    $(this).removeClass("active");
                    // $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(this).find("span").css('width', '0');
                    $(this).find("span").hide();
                }
            });
            $(appendDom_cb).delegate("em span", "click", function(e) {
                //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
                if (false === fixDbClick.call(this, e)) {
                    return false;
                }
                e.stopPropagation();
                var emP = $(this).parent("em");
                emP.remove();
                var uid = emP.attr("uid");
                $$list.find("li").each(function() {
                    if ($(this).attr("q_id") == uid) {
                        //删除经办的时候同时如果是主办，则删除主办
                        if ($(this).find("a.current").length > 0) {
                            $(this).find("a").removeClass("current");
                            $(appendDom_zb).find("em").each(function() {
                                if ($(this).attr("uid") == uid) {
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

        function add_user(t, o) {
            str = "";
            _oSelect_uid = o.attr("q_id");
            _oSelect_name = o.attr("q_name");
            _oSelect_user_id = o.attr("q_user_id");
            str = "<em uid='" + _oSelect_uid + "' userid='" + _oSelect_user_id + "'>" + _oSelect_name + "<span>—</span></em>";
            if (t == "zb") {
                if ($(appendDom_top).val() == 0 || $(appendDom_top).val() == undefined) {
                    $(appendDom_zb).append(str);
                } else {
                    $$list.find("a.ui-li-text-a").removeClass("current");
                }
                //判断有无从办
                var cb_has = false;
                if ($(appendDom_cb).find("em").length > 0) {
                    $(appendDom_cb).find("em").each(function() {
                        if ($(this).attr("uid") == _oSelect_uid) {
                            cb_has = true;
                            return false;
                        }
                    });
                }
                if (!cb_has) {
                    $(appendDom_cb).append(str);
                }
            } else {
                $(appendDom_cb).append(str);
            }
        }

        function remove_user(t, o) {
            _oSelect_uid = typeof(o) == "object" ? o.attr("q_id") : o;
            if (t == "zb") {
                $(appendDom_zb).find("em").each(function() {
                    if ($(this).attr("uid") == _oSelect_uid) {
                        $(this).remove();
                    } else {
                        return true;
                    }
                });
                $(appendDom_cb).find("em").each(function() {
                    if ($(this).attr("uid") == _oSelect_uid) {
                        $(this).remove();
                    } else {
                        return true;
                    }
                });
            } else if (t == "cb") {
                $(appendDom_cb).find("em").each(function() {
                    if ($(this).attr("uid") == _oSelect_uid) {
                        $(this).remove();
                    } else {
                        return true;
                    }
                });
            } else {
                $(appendDom_zb).find("em").each(function() {
                    if ($(this).attr("uid") == _oSelect_uid) {
                        $(this).remove();
                    } else {
                        return true;
                    }
                });
            }
        }

        function refreshListStatu() {
            var zb_oems = $(appendDom_zb).find("em");
            var cb_oems = $(appendDom_cb).find("em");
            if (zb_oems.length > 0) {
                var zb_cell_id = zb_oems.attr("uid");
                $(list).find("li").each(function() {
                    if ($(this).attr("q_id") == zb_oems.attr("uid")) {
                        $(this).find("a.ui-li-text-a").addClass("current");
                        return false;
                    }
                });
            }
            if (cb_oems.length > 0) {
                cb_oems.each(function() {
                    var cb_ceil_id = $(this).attr("uid");
                    $(list).find("li").each(function() {
                        if ($(this).attr("q_id") == cb_ceil_id) {
                            $(this).addClass("active");
                            return false;
                        }
                    });
                });
            }
        }
        function isChinese(str){
            if(/^[\u3220-\uFA29]+$/.test(str)){
                return true;
            }else{
                return false;
            }
        }
        function search_name(opt) {
            var reg = "";
            if (opt) {
                var key = opt;
            } else {
                var key = $$input.val();
            }
            console.log(key)
            if (key != "") {
                if (key != _tmp_key) {
                    $$showbtn.hide();
                    _tmp_key = key;
                    if (/^[A-Za-z0-9]+$/.test(key)) {
                        var _key_len = key.length;
                        if (_key_len > 1) {
                            for (var i = 0; i < key.length; i++) {
                                reg += key.charAt(i) + "(.*)";
                            }
                        } else {
                            reg = key + "(.*)";
                        }
                        eval("reg = /(.*)" + reg + "/");
                        _orgObj = $("<ul>" + orgHtml + "</ul>");
                        _orgObj.find("li").each(function() {
                            q_name_index = $(this).attr("q_name_index");
                            q_user_id = $(this).attr("q_user_id");
                            q_byname = $(this).attr("q_byname")
                            if (reg.test(q_name_index) || reg.test(q_user_id) || reg.test(q_byname)) {
                                return true;
                            } else {
                                $(this).remove();
                            }
                        });
                    } else if (!isChinese(key)) {
                        $.ajax({
                            type: 'GET',
                            url: url,
                            cache: false,
                            data: { "KWORD": key, "ACTION": "getNameIndex", "P": P},
                            beforeSend: function() {
                                $.ProLoading.show();
                            },
                            success: function(data) {
                                $.ProLoading.hide();
                                var nameArr = [];
                                nameArr = data.split("*");
                                eval("reg = /(.*)" + nameArr.join("\\*(.*)") + "/");
                                _orgObj = $("<ul>" + orgHtml + "</ul>");
                                _orgObj.find("li").each(function() {
                                    q_name_index = $(this).attr("q_name_index");
                                    if (reg.test(q_name_index)) {
                                        return true;
                                    } else {
                                        $(this).remove();
                                    }
                                });
                            }
                        });
                    } else {
                        //如果为纯中文，则直接搜索结果列表
                        _orgObj = $("<ul>" + orgHtml + "</ul>");
                        var _key_len = key.length;
                        var partten = '';
                        //如果包括多个汉字
                        if (_key_len > 1) {
                            for (var i = 0; i < key.length; i++) {
                                if (key.charCodeAt(i) > 128) {
                                    var partten = partten + key.charAt(i) + "(.*?)";
                                }
                            }
                        }
                        _orgObj.find("li").each(function() {
                            q_name = $(this).attr("q_name");
                            q_byname = $(this).attr("q_byname");
                            //执行数组循环判断
                            if (_key_len > 1) {
                                if (eval("/" + partten + "/.test(q_name)") || eval("/" + partten + "/.test(q_byname)")) {
                                    return true;
                                } else {
                                    $(this).remove();
                                }
                            } else {
                                //单个汉字
                                if (q_name.indexOf(key) > -1 || q_byname.indexOf(key) > -1) {
                                    return true;
                                } else {
                                    $(this).remove();
                                }

                            }
                        });
                    }
                    li_len = _orgObj.find("li").size();
                    if (li_len > 0) {
                        $$nodate.hide();
                        $$list.empty().append(_orgObj).find("li").show();
                        if ($(showbtn).length == 0 || li_len == 1) {
                            $$list.find("li").last().css("border-bottom", "none");
                        }
                    } else {
                        $$list.empty();
                        $$nodate.show();
                    }
                }
                refreshListStatu();
                return;
            } else {
                if (_tmp_key == key && key == "") {
                    return;
                }
                _tmp_key = key;
                //如果为点击删掉的，则全部显示列表
                $$list.empty().append(orgHtml);
                refreshListStatu();
                if ($(showbtn).length == 0) {
                    $$list.find("li").show();
                    $$list.find("li").last().css("border-bottom", "none");
                }
                $$showbtn.show();
                $$nodate.hide();
                eval(pageScroll + ".refresh()");
            }
        }
        return {
            init: init,
            refresh: refreshListStatu
        }
    }
});
