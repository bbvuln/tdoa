function ispirit_js(op_str)
{
    if(op_str=='send_msg')
    {
        if(arguments.length > 2 && typeof(frames['ipanel'].send_msg) == 'function')
            frames['ipanel'].send_msg(arguments[1], arguments[2]);
    }
    else if(op_str=="show_sms")
    {
        if(arguments.length > 1)
            show_sms(arguments[1]);
    }
    else if(op_str == "show_module")
    {
        if(arguments.length > 1)
            show_module(arguments[1]);
    }
    else if(op_str=="sms_mon")
    {
        sms_mon();
    }
    else if(op_str=="set_sms_ref")
    {
        bIMLogin = true;
        set_sms_ref();
    }
    else if(op_str=="set_no_sms")
    {
        set_no_sms();
    }
    else if(op_str=="update_org")
    {
        frames['ipanel'].ispirit_update_org();
    }
    else if(op_str=="new_msg_remind")
    {
        var ipanel_org = frames['ipanel'].frames['org'];
        if(arguments.length > 1 && ipanel_org)
        {
            if(typeof(ipanel_org.ispirit_new_msg_remind) == 'function')
            {
                ipanel_org.ispirit_new_msg_remind(arguments[1]);
            }
            else if(ipanel_org.contentWindow && typeof(ipanel_org.contentWindow.ispirit_new_msg_remind) == 'function')
            {
                ipanel_org.contentWindow.ispirit_new_msg_remind(arguments[1]);
            }
        }
    }
    else if(op_str=="cancel_msg_remind")
    {
        var ipanel_org = frames['ipanel'].frames['org'];
        if (arguments.length > 1 && ipanel_org)
        {
            if(typeof(ipanel_org.ispirit_cancel_msg_remind) == 'function')
            {
                ipanel_org.ispirit_cancel_msg_remind(arguments[1]);
            }
            else if(ipanel_org.contentWindow && typeof(ipanel_org.contentWindow.ispirit_cancel_msg_remind) == 'function')
            {
                ipanel_org.contentWindow.ispirit_cancel_msg_remind(arguments[1]);
            }
        }
    }
    else if(op_str=="send_email")
    {
        if(arguments.length >= 3)
            frames['ipanel'].send_email1(arguments[1], arguments[2])
    }
    else if(op_str=="weixun_share")
    {
        if(arguments.length > 2)
            jQuery.get("../general/ipanel/ispirit_api.php", {API:"weixun_share", SHARE_FLAG:arguments[2], CONTENT:arguments[1]});
    }
    else if(op_str=="on_status")
    {
        if(arguments.length > 1)
            jQuery.get("../general/ipanel/ispirit_api.php", {API:"on_status", CONTENT:arguments[1]});
    }
    else if(op_str=="show_im_panel")
    {
        ViewOnlineUser();
    }
    else if(op_str=="get_client_type")
    {
        var ipanel_org = frames['ipanel'].frames['org'];

        if (arguments.length > 1 && ipanel_org && typeof(ipanel_org.ispirit_get_client_type) == 'function')
        {
            return ipanel_org.ispirit_get_client_type(arguments[1], arguments[2]);
        }
        else if (arguments.length > 1 && ipanel_org && ipanel_org.contentWindow && typeof(ipanel_org.contentWindow.ispirit_get_client_type) == 'function')
        {
            return ipanel_org.contentWindow.ispirit_get_client_type(arguments[1], arguments[2]);
        }
        else if(arguments.length > 1)
        {
            return ispirit_get_client_type(arguments[1], arguments[2]);
        }

        return '';
    }
    else if(op_str=="recent_changed")
    {
        var ipanel_org = frames['ipanel'].frames['org'];

        if (ipanel_org)
        {
            if(typeof(ipanel_org.ispirit_recent_changed) == 'function')
            {
                ipanel_org.ispirit_recent_changed();
            }
            else if(ipanel_org.contentWindow && typeof(ipanel_org.contentWindow.ispirit_recent_changed) == 'function'){
                ipanel_org.contentWindow.ispirit_recent_changed();
            }
        }
    }
    else if(op_str=="refresh")
    {
        var ipanel_org = frames['ipanel'].frames['org'];
        if (arguments.length > 1 && ipanel_org)
        {
            if(typeof(ipanel_org.ispirit_refresh) == 'function')
            {
                ipanel_org.ispirit_refresh(arguments[1]);
            }
            else if(ipanel_org.contentWindow && typeof(ipanel_org.contentWindow.ispirit_refresh) == 'function')
            {
                ipanel_org.contentWindow.ispirit_refresh(arguments[1]);
            }
        }
    }
    else if(op_str=='getImCount')
    {
        jQuery.get(
            "./im/count.php",
            {TYPE:"email,sms,taskcenter"},
            function(data)
            {
                window.external.OA_SMS(data, "", "refreshImCounter");
            }
        );
    }
    else if(op_str=='fw_email')
    {
        if(typeof(frames['ipanel'].fw_email) == 'function')
            frames['ipanel'].fw_email();
    }
    else if(op_str=='fw_message')
    {
        if(typeof(frames['ipanel'].fw_message) == 'function')
            frames['ipanel'].fw_message();
    }
    else if(op_str=='fw_diary')
    {
        if(typeof(frames['ipanel'].fw_diary) == 'function')
            frames['ipanel'].fw_diary();
    }
    else if(op_str=='fw_itask')
    {
        if(typeof(frames['ipanel'].fw_itask) == 'function')
            frames['ipanel'].fw_itask();
    }
    else if(op_str=='add_note')
    {
        if(arguments.length > 4 && typeof(frames['ipanel'].add_note) == 'function')
            frames['ipanel'].add_note('ispirit', arguments[1], arguments[2], arguments[3], arguments[4]);
    }
    else if(op_str=='update_note')
    {
        if(arguments.length > 4 && typeof(frames['ipanel'].update_note) == 'function')
            frames['ipanel'].update_note('ispirit', arguments[1], arguments[2], arguments[3], arguments[4]);
    }
    else if(op_str=='update_note_color')
    {
        if(arguments.length > 2 && typeof(frames['ipanel'].update_note_color) == 'function')
            frames['ipanel'].update_note_color( arguments[1], arguments[2]);
    }
    else if(op_str=="url_collection")
    {
        if(arguments.length > 2)
            jQuery.get("../general/ipanel/ispirit_api.php", {API:"url_collection", CURLDES:arguments[1], CURL:arguments[2]});
    }
    else if(op_str=='open_url')
    {
        if(arguments.length > 1)
            window.external.OA_SMS(arguments[1],"","OPEN_URL");
        return "+OK";
    }
    else if(op_str=='wb_set_hidden_value')
    {
        if(arguments.length > 1 && typeof(frames['ipanel'].wb_set_hidden_value) == 'function')
            return frames['ipanel'].wb_set_hidden_value(arguments[1]);
    }
    else if(op_str=='remove_remind')
    {
        if(arguments.length > 1)
        {
            jQuery.get("../general/ipanel/ispirit_api.php", {API:"remove_remind", SMS_ID:arguments[1]});
        }
    }
    else if(op_str=='ispirit_search')
    {
        if(arguments.length > 1)
            return ispirit_search(arguments[1]);
    }
    else if(op_str=='ispirit_search_more')
    {
        if(arguments.length > 2)
            return ispirit_search_more(arguments[1], arguments[2]);
    }
    else if(op_str=="click_menu")
    {
        if(arguments[2] == '0')
        {
            var ipanel_menu = frames['ipanel'].frames['menu'];
            var func = ipanel_menu.document && ipanel_menu.document.getElementById(arguments[1]);
            if(func)
            {
                func.click();
            }
        }
        else if(arguments[2] == '1')
        {
            var ipanel_menu = frames['ipanel'].frames['menu'];
            if(typeof(ipanel_menu.openURL) == 'function')
            {
                ipanel_menu.openURL(arguments[1]);
            }
        }
        else if(arguments[2] == '2')
        {
            var id = arguments[1];
            if(typeof(func_array[id]) != 'object')
                reutrn;

            var func = func_array[id];

            var url = '';
            if(func[1].indexOf('http://') >= 0 || func[1].indexOf('https://') >= 0 || func[1].indexOf('ftp://') >= 0)
            {
                url = func[1];
            }
            else if(func[1].indexOf('file://') >= 0)
            {
                url = "/general/winexe/?PROG=" + func[1] + "&NAME=" + func[0];
            }
            else
            {
                var func_id = id.substr(1);
                if(func_id >= 10000 && func_id <= 14999)
                {
                    url = '/t9apps/' + func[1];
                }
                else if(func_id >= 15000 && func_id <= 15499)
                {
                    url = '/hr/' + func[1];
                }
                else if(func_id >= 650 && func_id <= 1000 || func[1].indexOf('.jsp') > 0)
                {
                    url = '/app/' + func[1];
                }
                else
                {
                    url = '/general/' + func[1];
                }
            }

            frames['ipanel'].openURL(url);
        }
    }
}

var ctroltime = null;

jQuery.noConflict();

(function($){
    function resizeLayout()
    {
        var wHeight = $(window).height();
        var bHeight = $('#status_bar').outerHeight();
        $('#ipanel_container').height(wHeight - bHeight);
    };

    $(window).resize(function(){resizeLayout();});

    $(document).ready(function($){
        //调整iframe大小
        resizeLayout();

        window.setTimeout("online_mon()", 1000);
        ctroltime = window.setTimeout("sms_mon()", 7000);

        if(i_ver != '')
        {
            window.external.OA_SMS("SESSION_ID", sessionId, "INIT");
            window.external.OA_SMS(cur_username, cur_uid, "NAME");
            window.external.OA_SMS("MYOA_VER", myoa_ver, "INIT");
            window.external.OA_SMS("UPLOAD_MAX_FILESIZE", upload_max_filesize, "INIT");
            window.external.OA_SMS("MY_STATUS", my_status, "INIT");
            window.external.OA_SMS("ON_STATUS", on_status, "INIT");
            window.external.OA_SMS("IS_UN", is_un, "INIT");
            window.external.OA_SMS("IS_GROUP", is_group, "INIT");
            window.external.OA_SMS("GROUP_NO_SHOW_DEPT", group_no_show_dept, "INIT");
            window.external.OA_SMS("GROUP_NO_OP_DEPT", group_no_op_dept, "INIT");
            window.external.OA_SMS("PRIV_ID_STR", priv_id_str, "INIT");
            window.external.OA_SMS("WINDOW_CAPTION", window_caption, "INIT");
            window.external.OA_SMS("GBT_NEW", gbt_new, "INIT");
            window.external.OA_SMS("CURRENT_TIME",cur_time,"INIT");
            window.external.OA_SMS("SNS_NAME", sns_name, "INIT");
            window.external.OA_SMS("LOGO_ATTACH_ID", logo_attach_id, "INIT");
            window.external.OA_SMS("FILE_LIMIT_TRANSFER", file_limit_transfer, "INIT");
            window.external.OA_SMS("GROUP_NEW_PRIVILEGE", privilege, "INIT");
            window.external.OA_SMS("IS_COMMUNITY", is_community, "INIT");
            window.external.OA_SMS("WATERMARK_JSON", watermark_json, "INIT");
        }
        else
        {
            window.setTimeout("email_mon()", 11000);
        }
    });

})(jQuery);


var online_count = 1;
var online_uid_str = "";
var online_client_str = "";
var on_status_str = "";
var $ = function(id) {return document.getElementById(id);};

function online_mon()
{
    jQuery.ajax({
        async:true,
        url: "../general/ipanel/user/user_count.php",
        data: {CHECK_SMS: check_sms, CLIENT: 2},
        dataType: 'script',
        timeout: 30000,
        success: function(data){
            online_count = online_array[0];
            online_uid_str = online_array[1];
            online_client_str = online_array[2];
            on_status_str = online_array[3];
            set_online_user();

            $("user_count").innerHTML = online_count;

            var title = online_title.replace("%s", online_count);
            $("user_count").title = title;
            $("online_link").title = title;
        },
        error: function (request, textStatus, errorThrown){
            if(i_ver != "")
            {
                if(request.status >= 500)
                    window.external.OA_SMS("", "", "OFFLINE");
            }
        }
    });

    setTimeout("online_mon()", online_mon_ref);
}

var setOnlineTimer = null;
function set_online_user()
{
    if(setOnlineTimer)
        window.clearTimeout(setOnlineTimer);

    var org = parent.frames['ipanel'].frames['org'];
    if(org && typeof(org.get_online_user) == "function")
    {
        org.get_online_user([online_uid_str, online_client_str, on_status_str]);
    }
    else
    {
        setOnlineTimer = window.setTimeout("set_online_user()", 1000);
    }
}

function email_mon()
{
    jQuery.get("../general/status_bar/email_mon.php", {}, function(data){
        if(data == "1")
            $("new_letter").innerHTML="<a href='#' onclick='javascript:show_email();' title='" + new_email_title + "'><img src='" + static_server + "/static/images/email_close.png' border='0' width='16' height='16' align='absMiddle'></a>&nbsp;";
        else
            $("new_letter").innerHTML="";
    });
    setTimeout("email_mon()", online_mon_ref*10);
}

function sms_mon()
{
    clearTimeout(ctroltime);
    jQuery.get("../inc/new_sms.php", {now: new Date().getTime()}, function(data){
        sms_mon_flag = data;
        if(sms_mon_flag.indexOf("1") >= 0)
        {
            if(i_ver != "")
            {
                if(sms_mon_flag.substr(0, 1) == "1")
                {
                    jQuery.ajax({
                        type: 'post',
                        url: '../general/status_bar/get_noc.php',
                        data:{'IM_FLAG': 1},
                        dataType: "json",
                        cache: false,
                        success: function(data){
                            if(data)
                            {
                                $("new_sms").innerHTML = new_sms_html;
                                $("new_sms_sound").innerHTML= new_sms_sound_html ;

                                window.external.OA_SMS("","1","OPEN");
                                jQuery.each(data,function(key, item)
                                {
                                    window.external.OA_SMS(item.sms_id+"^"+item.type_id+"^"+item.uid+"^"+decodeURIComponent(item.send_time_new)+"^"+decodeURIComponent(item.content),item.url,"OPEN_DETAIL");
                                })
                            }
                        }
                    });
                }
                if(sms_mon_flag.substr(1, 1) == "1")
                {
                    jQuery.ajax({
                        type: 'post',
                        url: '../general/status_bar/get_unread.php',
                        dataType: "json",
                        cache: false,
                        success: function(data){
                            if(data>0)
                            {
                                window.external.OA_SMS("","2","OPEN");
                            }
                        }
                    });
                }
                    
            }
            else if(sms_on == '1')
            {
                show_sms();
            }
        }
        else
        {
            set_no_sms()
        }
    });
    ctroltime=setTimeout("sms_mon()",sms_mon_ref);
}

function set_sms_ref()
{
    if(!set_sms_ref.sms_mon_ref)
    {
        set_sms_ref.sms_mon_ref = sms_mon_ref;
    }
    sms_mon_ref = set_sms_ref.sms_mon_ref*10;
}
function set_no_sms()
{
    $("new_sms").innerHTML="";
    $("new_sms_sound").innerHTML="";
}
var get_msg = (function(){
    var timer = null;
    return function(){
        timer && clearTimeout(timer);
        timer = setTimeout(function(){
            jQuery.getJSON("../general/status_bar/get_msg.php?"+jQuery.now(), {IM_FLAG: '1'}, function(json){
                for(var i=0; i<json.length; i++)
                {
                    if(typeof(window.external.OA_MSG) != 'undefined')
                    {
                        window.external.OA_MSG("RECEIVE_MSG", json[i].from_uid, json[i].time, json[i].type, json[i].content, json[i].from_name,json[i].msg_id,json[i].msgType);
                    }
                }
            });
        }, 500);
    }

})();

function show_sms(flag)
{
    set_no_sms();
    if(flag == "1")
    {
        //get_msg();
    }
    else if(flag == "2")
    {
        if(sms_mon_flag.substr(0, 1) == "1")
            window.external.OA_SMS("","","OPEN_NOC"); //打开事务提醒
        if(sms_mon_flag.substr(1, 1) == "1")
            window.external.OA_SMS("","","OPEN_MSG"); //打开微讯
    }
    else
    {
        mytop=(screen.availHeight-410)/2;
        myleft=(screen.availWidth-425)/2;
        URL="../general/status_bar/sms_show.php@ISPIRIT=1*I_VER=" + i_ver + "*CALL_SOUND=" + call_sound;
        window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+URL, ("sms_show_" + cur_uid),"height=422,width=480,top="+mytop+",left="+myleft+",status=0,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=yes");
    }
}

function show_module(module_id){
    var windowtype = '', height, width;
    if(module_id == "email"){
        windowtype = 'MAX';
        URL ="/general/email/";
    }else if(module_id == "person_info"){
        URL ="/general/person_info/?MAIN_URL=avatar";
    }else if(module_id == "smsbox"){
        windowtype = '460,430';
        URL ="/ispirit/im/smsbox.php";
    }else if(module_id == "msgbox"){
        windowtype = '460,540';
        URL ="/general/status_bar/sms_show.php?ISPIRIT=1&I_VER=&CALL_SOUND=1";
    }else if(module_id == "index"){
        windowtype = 'MAX';
        URL ="/general/?ISPIRIT=1";
    }else if(module_id == "group_msg"){
        windowtype = '460,340';
        URL ="/general/status_bar/sms_back.php?I_VER=" + i_ver + "&C=Web";
    }else if(module_id == "gbt_conf_new"){
        windowtype = '620,500';
        URL ="/general/gbtmeet/new.php?I_VER=" + i_ver + "&FROM_ISPIRIT=1";
    }else if(module_id == "cc"){
        URL ="/general/person_info/regcc/go.php?FROM_ISPIRIT=1";
    }else if(module_id == "taskcenter"){
        windowtype = '1200,600';
        URL ="/general/task_center/?FROM_ISPIRIT=1";
    }else if(module_id == "portal"){
        windowtype = '990,500';
        URL ="/portal/?FROM_ISPIRIT=1";
    }else if(module_id == "help"){
        windowtype = 'MAX';
        URL ="/module/help/?FROM_ISPIRIT=1";
    }

    if(i_ver != "" && myoa_use_os_browser != 1)
    {
        window.external.OA_SMS(URL,windowtype,"OPEN_URL");
    }
    else
    {
        var d = new Date();
        if(windowtype == 'MAX'){
            width = screen.availWidth - 20;
            height = screen.availHeight - 60;
        }else if(windowtype != ''){
            width = parseInt(windowtype.split(',')[0]) + 40;
            height = parseInt(windowtype.split(',')[1]) + 40;
        }else{
            width = 780;
            height = 548;
        }
        mytop = (screen.availHeight - height)/2 - 30;
        myleft = (screen.availWidth - width)/2 - 10;
        window.open("go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+escape(URL),d.getTime(),"height="+height+",width="+width+",status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+mytop+",left="+myleft+",resizable=yes");
    }
}

function show_email()
{
    $("new_letter").innerHTML="";
    mytop=(screen.availHeight-500)/2-30;
    myleft=(screen.availWidth-780)/2;

    URL="/general/email/";
    window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+URL,"oa_sub_window","height=500,width=780,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+mytop+",left="+myleft+",resizable=yes");
}

function ViewOnlineUser()
{
    if(typeof(frames['ipanel'].view_menu) == 'function')
        frames['ipanel'].view_menu(2);
}

function ispirit_get_client_type(uid, dept_id)
{
    var online_uid_array = online_uid_str.substr(0,online_uid_str.length-1).split(",");
    var online_client_array = online_client_str.substr(0,online_client_str.length-1).split(",");
    var uid_index = jQuery.inArray(uid, online_uid_array);

    return uid_index >= 0 && uid_index < online_client_array.length ? online_client_array[uid_index] : '';
}
//func_array["f130"]=["新建工作","workflow/new","workflow","xjgz,xjzz"];
/*
 if($FUNC_ID>=10000&&$FUNC_ID<=14999)
 $CLICK_STR="d('$FUNC_CODE','$FUNC_ID',$OPEN_WINDOW)";
 else if($FUNC_ID>=15000&&$FUNC_ID<=15499)
 $CLICK_STR="e('$FUNC_CODE','$FUNC_ID',$OPEN_WINDOW)";
 else if($FUNC_ID>=650&&$FUNC_ID<=1000 || strtolower(substr($FUNC_CODE,-4))==".jsp")
 $CLICK_STR="b('$FUNC_CODE','$FUNC_ID',$OPEN_WINDOW)";
 else
 $CLICK_STR="a('$FUNC_CODE','$FUNC_ID',$OPEN_WINDOW)";
 */

//OA精灵搜索调用主接口
function ispirit_search(keyword)
{
    if(typeof(keyword) != 'string' || keyword == '')
    {
        return;
    }

    keyword = keyword.toLowerCase().replace("'", ""); //变小写

    //菜单
    var html = search_menu(keyword);

    //工作流，如果是数字，搜索流水号，否则提示搜索文号
    var re = /[^0-9]/;
    if(keyword.search(re) >= 0)
    {
        html += '<div id="area_workflow">';
        html += '    <div class="nav" id="nav_workflow">';
        html += '        <a href="javascript:;"><i></i><span class="text">' + td_lang.ispirit.label_workflow + '</span><span class="count">0</span></a>';
        html += '   </div>';
        html += '   <div id="container_workflow" class="container">';
        html += '       <a class="search" href="javascript:search_more(\'' + keyword + '\', \'workflow\');">' + td_lang.ispirit.label_search_workflow + '</a>';
        html += '   </div>';
        html += '</div>';
        //增加流程中心
        html += '<div id="area_approve_center">';
        html += '    <div class="nav" id="nav_workflow">';
        html += '        <a href="javascript:;"><i></i><span class="text">' + td_lang.ispirit.label_approve_center + '</span><span class="count">0</span></a>';
        html += '   </div>';
        html += '   <div id="container_workflow" class="container">';
        html += '       <a class="search" style="width: 100px;" href="javascript:search_more(\'' + keyword + '\', \'approve_center\');">' + td_lang.ispirit.label_search_approve_center + '</a>';
        html += '   </div>';
        html += '</div>';
    }
    else
    {
        html += '<div id="area_workflow">';
        html += search_workflow(keyword, '0');
        html += '</div>';
        //增加流程中心
        html += '<div id="area_approve_center">';
        html += search_approve_center(keyword, '0');
        html += '</div>';
    }

    //日程安排
    html += '<div id="area_calendar">';
    html += '   <div class="nav" id="nav_calendar">';
    html += '       <a href="javascript:;"><i></i><span class="text">' + td_lang.ispirit.label_calendar + '</span><span class="count">0</span></a>';
    html += '   </div>';
    html += '   <div id="container_calendar" class="container">';
    html += '       <a class="search" href="javascript:search_more(\'' + keyword + '\', \'calendar\');">' + td_lang.ispirit.label_search_calendar + '</a>';
    html += '   </div>';
    html += '</div>';

    //在线帮助
    html += '<div class="search-help">';
    html += '    <a class="search-btn" id="search_btn" href="javascript:search_more(\'' + keyword + '\', \'help\');"><span>' + td_lang.ispirit.label_search_help + '</span></a>';
    html += '</div>';

    return html;
}

//OA精灵初次搜索结果中点击“搜索工作流文号”或“搜索日程安排”等回调接口
function ispirit_search_more(keyword, module)
{
    if(typeof(keyword) != 'string' || keyword == '')
    {
        return;
    }

    keyword = keyword.toLowerCase(); //变小写

    if(module == 'workflow')
    {
        return search_workflow(keyword, '1');
    }
    else if(module == 'approve_center')
    {
        return search_approve_center(keyword, '1');
    }
    else if(module == 'calendar')
    {
        return search_calendar(keyword);
    }
    else if(module == 'help')
    {
        window.external.OA_SMS(('/module/help/?keyword=' + keyword), 'MAX', 'OPEN_URL');
    }
}

//搜索菜单
function search_menu(keyword)
{
    var count = 0;
    var container_html = '';
    for(var id in func_array)
    {
        var func = func_array[id];
        var func_id = id.substr(1);
        //如果一级菜单、有三级菜单的二级菜单、没有权限的菜单 则跳过
        if(id.substr(0, 1) != 'f' || func[1].substr(0, 1) == '@' || (my_func_id_str.indexOf(func_id + ',') < 0 && my_func_id_str.indexOf(',' + func_id + ',') < 0))
        {
            continue;
        }

        //匹配 菜单名称、路径、名称拼音首字母 中的任何一个
        if(func[0].toLowerCase().indexOf(keyword) >= 0 || func[3].toLowerCase().indexOf(keyword) >= 0)
        {
            count++;
            container_html += '<a class="item" href="javascript:window.external.OA_SMS(\'' + id + '\', \'2\', \'click_menu\');"><i class="dot_menu"></i><span class="subject">' + func[0] + '</span></a>';
        }
    }

    var html = '';
    if(count > 0)
    {
        html += '<div id="area_menu">';
        html += '   <div class="nav" id="nav_menu">';
        html += '       <a href="javascript:;"><i></i><span class="text">' + td_lang.ispirit.label_menu + '</span><span class="count" style="display:block;">' + count + '</span></a>';
        html += '   </div>';
        html += '   <div id="container_menu" class="container">';
        html +=          container_html;
        html += '   </div>';
        html += '</div>';
    }

    return html;
}

//搜索工作流
function search_workflow(keyword, flag)
{
    var html = '';

    jQuery.ajax({
        async:false,
        url: "/general/ipanel/ispirit_search.php",
        data: {module: 'workflow', keyword: keyword, flag: flag},
        dataType: 'json',
        timeout: 30000,
        success: function(rows){
            html += '<div class="nav" id="nav_workflow">';
            html += '    <a href="javascript:;"><i></i><span class="text">' + td_lang.ispirit.label_workflow + '</span><span class="count" style="display:block;">' + rows.length + '</span></a>';
            html += '</div>';
            html += '<div id="container_workflow" class="container">';
            if(rows.length > 0)
            {
                for(var i=0; i<rows.length; i++)
                {
                    var url = '';
                    if(rows[i].prcs_flag == '1' || rows[i].prcs_flag == '2')
                    {
                        var url = "/general/workflow/list/input_form/?actionType=handle";
                        url += "&MENU_FLAG=";
                        url += "&RUN_ID="+rows[i].run_id;
                        url += "&PRCS_KEY_ID="+rows[i].prcs_key_id;
                        url += "&FLOW_ID="+rows[i].flow_id;
                        url += "&PRCS_ID="+rows[i].prcs_id;
                        url += "&FLOW_PRCS="+rows[i].flow_prcs;
                    }
                    else if(rows[i].prcs_flag == '3' || rows[i].prcs_flag == '4')
                    {
                        var url = "/general/workflow/list/print/?";
                        url += "&MENU_FLAG=";
                        url += "&RUN_ID="+rows[i].run_id;
                        url += "&PRCS_KEY_ID="+rows[i].prcs_key_id;
                        url += "&FLOW_ID="+rows[i].flow_id;
                        url += "&PRCS_ID="+rows[i].prcs_id;
                        url += "&FLOW_PRCS="+rows[i].flow_prcs;
                    }

                    html += '    <a class="item" href="javascript:window.external.OA_SMS(\'' + url + '\', \'\', \'OPEN_URL\');"><i class="dot_workflow"></i><span class="subject">' + rows[i].run_id + ': ' + rows[i].run_name + '(' + sprintf(td_lang.ispirit.label_prcs_no, rows[i].flow_prcs) + ')</span></a>';
                }
            }
            else
            {
                html += '    <div class="no-data">' + td_lang.ispirit.label_no_data + '</div>';
            }

            if(flag == '0')
            {
                html += '    <a class="search" href="javascript:search_more(\'' + keyword + '\', \'workflow\');">' + td_lang.ispirit.label_search_workflow + '</a>';
            }

            html += '</div>';
        },
        error: function (request, textStatus, errorThrown){
            html += textStatus;
        }
    });

    return html;
}
//搜索流程中心
function search_approve_center(keyword, flag)
{
    var html = '';

    jQuery.ajax({
        async:false,
        url: "/general/ipanel/ispirit_search.php",
        data: {module: 'approve_center', keyword: keyword, flag: flag},
        dataType: 'json',
        timeout: 30000,
        success: function(rows){
            html += '<div class="nav" id="nav_approve_center">';
            html += '    <a href="javascript:;"><i></i><span class="text">' + td_lang.ispirit.label_approve_center + '</span><span class="count" style="display:block;">' + rows.length + '</span></a>';
            html += '</div>';
            html += '<div id="container_approve_center" class="container">';
            if(rows.length > 0)
            {
                for(var i=0; i<rows.length; i++)
                {
                    var url = '';
                    if(rows[i].prcs_flag == '1' || rows[i].prcs_flag == '2')
                    {
                        var url = "/general/approve_center/list/input_form/?actionType=handle";
                        url += "&MENU_FLAG=";
                        url += "&RUN_ID="+rows[i].run_id;
                        url += "&PRCS_KEY_ID="+rows[i].prcs_key_id;
                        url += "&FLOW_ID="+rows[i].flow_id;
                        url += "&PRCS_ID="+rows[i].prcs_id;
                        url += "&FLOW_PRCS="+rows[i].flow_prcs;
                    }
                    else if(rows[i].prcs_flag == '3' || rows[i].prcs_flag == '4')
                    {
                        var url = "/general/approve_center/list/print/?";
                        url += "&MENU_FLAG=";
                        url += "&RUN_ID="+rows[i].run_id;
                        url += "&PRCS_KEY_ID="+rows[i].prcs_key_id;
                        url += "&FLOW_ID="+rows[i].flow_id;
                        url += "&PRCS_ID="+rows[i].prcs_id;
                        url += "&FLOW_PRCS="+rows[i].flow_prcs;
                    }

                    html += '    <a class="item" href="javascript:window.external.OA_SMS(\'' + url + '\', \'\', \'OPEN_URL\');"><i class="dot_workflow"></i><span class="subject">' + rows[i].run_id + ': ' + rows[i].run_name + '(' + sprintf(td_lang.ispirit.label_prcs_no, rows[i].flow_prcs) + ')</span></a>';
                }
            }
            else
            {
                html += '    <div class="no-data">' + td_lang.ispirit.label_no_data + '</div>';
            }

            if(flag == '0')
            {
                html += '    <a class="search" href="javascript:search_more(\'' + keyword + '\', \'approve_center\');">' + td_lang.ispirit.label_search_approve_center + '</a>';
            }

            html += '</div>';
        },
        error: function (request, textStatus, errorThrown){
            html += textStatus;
        }
    });

    return html;
}
//搜索日程安排
function search_calendar(keyword)
{
    var html = '';

    jQuery.ajax({
        async:false,
        url: "/general/ipanel/ispirit_search.php",
        data: {module: 'calendar', keyword: keyword},
        dataType: 'json',
        timeout: 30000,
        success: function(rows){
            html += '<div class="nav" id="nav_calendar">';
            html += '    <a href="javascript:;"><i></i><span class="text">' + td_lang.ispirit.label_calendar + '</span><span class="count" style="display:block;">' + rows.length + '</span></a>';
            html += '</div>';
            html += '<div id="container_calendar" class="container">';
            if(rows.length > 0)
            {
                for(var i=0; i<rows.length; i++)
                {
                    var url = '';
                    if(rows[i].type == '0')
                    {

                        url = 'calendarArrange/calendarArrange.php?id=' + rows[i].cal_id + '&remintype=0';
                    }
                    else if(rows[i].type == '1')
                    {
                        url = 'calendarArrange/calendarArrange.php?id=' + rows[i].cal_id + '&remintype=0';
                    }
                    else if(rows[i].type == '2')
                    {
                        url = '/general/calendarArrange/task/note.php?TASK_ID=' + rows[i].cal_id;
                    }

                    html += '    <a class="item" href="javascript:window.external.OA_SMS(\'' + url + '\', \'\', \'OPEN_URL\');"><i class="dot_calendar"></i><span><span class="subject">' + rows[i].content + '</span><span class="remark">' + rows[i].time + '</span></span></a>';
                }
            }
            else
            {
                html += '    <div class="no-data">' + td_lang.ispirit.label_no_data + '</div>';
            }

            html += '</div>';
        },
        error: function (request, textStatus, errorThrown){
            html += textStatus;
        }
    });

    return html;
}
