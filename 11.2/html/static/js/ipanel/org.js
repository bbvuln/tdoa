//新事务提醒消息
function ispirit_new_msg_remind(uid)
{
//   alert('用户 '+uid+' 有新消息')
}

//取消新微讯的头像闪烁
function ispirit_cancel_msg_remind(uid)
{
//   alert('用户 '+uid+' 已打开新消息')
}

//最近联系人变化接口
function ispirit_recent_changed()
{
    if(jQuery("#module_recent:visible").length > 0)
        LoadRecent();
}

//打开讨论组历史数据 by kw 120928
function open_history(disc_group_id)
{
    url='/ispirit/im_discuss/disc_group_msg_history.php?DISCUSS_MSG_GROUP_ID='+disc_group_id;
    if(typeof(window.external) != 'undefined' && typeof(window.external.OA_SMS) != 'undefined')
        window.external.OA_SMS(url,"600,600","OPEN_URL");
}

function ispirit_refresh(module_id)
{
    if(module_id == 'im_group')
    {
        LoadModule('module_' + module_id);
    }
}

function ispirit_get_client_type(uid, dept_id)
{
    var uid_index = jQuery.inArray(uid, online_uid_array);
    var client = uid_index >= 0 && uid_index < online_client_array.length ? online_client_array[uid_index] : '';
    if(client == '' && orgTree0 && orgTree0.tree)   //非OA精灵缓存
    {
        var node = orgTree0.tree.getNodeByKey('user_' + uid + '_' + dept_id);
        if(node)
        {
            client = node.data.client;
        }
        else
        {
            orgTree0.tree.visit(function(node){
                if(node.data.uid == uid)
                {
                    client = node.data.client;
                    return false;
                }
            });
        }
    }

    return client;
}

function node_click(node)
{
    if(node.isStatusNode() || !node.data.uid || typeof(parent.send_msg) != 'function')
        return ;

    if(node.data.op_sms)/*ispirit == "1" && */
        parent.send_msg(node.data.uid, node.data.title);
    /*else
     parent.openURL(node.data.url);*/
}

//最近联系人
function get_im_recent_user()
{
    if(typeof(window.external) != 'undefined' && typeof(window.external.OA_SMS) != 'undefined'){
//      alert(window.external.OA_SMS("", "", "RECENT_USER"));
//      alert(online_uid_str)
        var RECENT_USER = window.external.OA_SMS("", "", "RECENT_USER");
        return JSON.parse(RECENT_USER);
    }else{
        return [];
    }
}
//批量获取OA精灵缓存用户信息
function get_im_users(uids){
    if(typeof(window.external) == 'undefined' || typeof(window.external.OA_SMS) == 'undefined')
        return null;
    try{
        var xml = window.external.OA_SMS("GET_USERS", uids, "ORG");
        if(!xml)
            return null;
        var ret = [],
            userlist = jQuery(xml).find('u');

        jQuery.each(userlist, function(k, u){
            var a = u.getAttribute("a"),
                h = u.getAttribute("h"),
                b = u.getAttribute("b"),
                d = u.getAttribute("d");
            if(!a || !h || !b || !d){
                return;
            }
            ret.push({ uid: a, user_id: h, user_name: b, sex: d });
        });

        xml = null;
        //console && console.table && console.table(ret);
        return ret;
    }
    catch(ex){
        alert(ex.description);
    }
}

//获取OA精灵缓存用户信息
function get_im_user(uid)
{
    if(typeof(window.external) == 'undefined' || typeof(window.external.OA_SMS) == 'undefined')
        return null;

    try{
        var xml = window.external.OA_SMS("GET_USER", uid, "ORG");
        if(!xml)
            return null;
        var dom = jQuery(xml)[0]; //document.createElement(xml);

        if(!dom.getAttribute("h") || !dom.getAttribute("b") || !dom.getAttribute("d"))
            return null;

        var user = {user_id: dom.getAttribute("h"), user_name: dom.getAttribute("b"), sex: dom.getAttribute("d")};
        xml = dom = null;

        return user;
    }
    catch(ex){
        alert(ex.description);
    }
}

//发送群组消息
function send_im_group_msg(group_id, group_name)
{
    if(typeof(window.external) != 'undefined' && typeof(window.external.OA_SMS) != 'undefined')
        window.external.OA_SMS(group_id, group_name, "SEND_IM_GROUP_MSG");
}
//发送讨论组消息 by kw 120928
function send_im_discuss_msg(disc_group_id, disc_group_name)
{
    if(typeof(window.external) != 'undefined' && typeof(window.external.OA_SMS) != 'undefined')
        window.external.OA_SMS(disc_group_id, disc_group_name, "SEND_IM_DISCUSS_MSG");
}
//发送部门群组消息 by SXM
function send_im_dept_msg(dept_group_id, dept_group_name)
{
    if(typeof(window.external) != 'undefined' && typeof(window.external.OA_SMS) != 'undefined')
        window.external.OA_SMS(dept_group_id, dept_group_name, "SEND_IM_DEPT_MSG");
}
//父页面点击“组织”面板的回调事件
function onshow()
{
    if(jQuery("#sub_module_org_0:visible").length > 0)
        jQuery("#sub_module_org_0").triggerHandler("_show");
}

function tree_render(node, nodeSpan)
{
    if(!node.data.isFolder)
        jQuery(".dynatree-connector", nodeSpan).hide();
}

var count = 0;
function get_online_user(paras)
{
    online_uid_str = paras[0];
    online_client_str = paras[1];
    on_status_str = paras[2];
    online_uid_array = online_uid_str.substr(0,online_uid_str.length-1).split(",");
    online_client_array = online_client_str.substr(0,online_client_str.length-1).split(",");
    on_status_array = on_status_str.substr(0,on_status_str.length-1).split(",");

    //如果非缓存模式，status_bar回调时不再reload
    if(orgTree0 && useIspiritCache && useIspiritCache0)
        tree0_reload();

    tree1_update();
    group_recent_update();
}

function tree0_reload()
{
    orgTree0.reload();
    online_last_ref = new Date();
}

function tree1_reload()
{
    orgTree1.reload();
}

//根据在线人员的数组更新全部人员中的人员状态
function tree1_update()
{
    if(orgTree1 && orgTree1.tree)
    {
        orgTree1.tree.visit(tree1_update_callback);
    }
}

function tree1_update_callback(node)
{
    if(node.data.uid)
    {
        var uid_index = jQuery.inArray(node.data.uid, online_uid_array);
        if(uid_index >= 0)
        {
            var status = on_status_array[uid_index] ? on_status_array[uid_index] : 1;
            var client = online_client_array[uid_index] ? online_client_array[uid_index] : 1;
            node.data.icon = node.data.icon.substr(0, 2) + status + ".png";
            node.data.client = client;
            node.render();
        }
        else if(node.data.icon.substr(2, 1) != "0")
        {
            node.data.icon = node.data.icon.substr(0, 2) + "0.png";
            node.data.client = -1;
            node.render();
        }
    }
}

//根据在线人员的数组更新分组和最近联系人中的人员状态
function group_recent_update()
{
    jQuery("tr.sub-module-item[type='user'] td").each(group_recent_update_callback);
}

function group_recent_update_callback()
{
    var uid = jQuery(this).parent().attr('uid');
    var className = jQuery(this).attr('class').substr(0, 2);

    var uid_index = jQuery.inArray(uid, online_uid_array);
    if(uid_index >= 0)
    {
        var status = on_status_array[uid_index] ? on_status_array[uid_index] : 1;
        this.className = className + status;
    }
    else
    {
        this.className = className + '0';
    }
}

jQuery.noConflict();
(function($){

    $(document).ready(function(){
        if(ispirit != "")
            $("#bottom").height(0);
        $(window).trigger('resize');

        //回收内存
        if($.browser.msie)
            window.setInterval("CollectGarbage();", 3000);

        //手动刷新
        $("#org_refresh").click(function(){
            var block = $('div.module-block:visible');
            if(block.length <= 0)
                return;

            var id = block.attr('id');
            if(id == "sub_module_org_0")
            {
                if(orgTree0 && orgTree0.tree)
                    tree0_reload();
            }
            else if(id == "sub_module_org_1")
            {
                if(orgTree1 && orgTree1.tree)
                    tree1_reload();
            }
            else if(id == "module_recent")
            {
                LoadRecent();
            }
            else
            {
                LoadModule(id);
            }
        });

        //人员、分组、最近、群 的点击事件
        $("#sub_tabs_ul > li > a").click(function(){
            if($(this).attr('className').indexOf('active') >= 0)
                return;

            $("#sub_tabs_ul > li > a").removeClass('active');
            $(this).addClass('active');

            var module = $(this).attr('module');
            var options = {MODULE: module};
            $("#modules > div.container").hide();
            $("#module_" + module).show();

            var index = $(this).attr('index');
            $.cookie('ONLINE_UI', index, {expires:1000});
            if(module == "org")
            {
                if($("#sub_menu_org > a.active[index='0']").length > 0)
                {
                    $("#sub_menu_org > a[index='0']").triggerHandler('click');
                }
                else
                {
                    $("#sub_menu_org > a[index='1']").triggerHandler('click');
                }

                return;
            }
            else if(module == "user_group")
            {
                if($("#sub_menu_user_group > a.active[index='0']").length > 0)
                {
                    options.INDEX = "0";
                    $("#sub_menu_user_group > a[index='0']").triggerHandler('click');
                }
                else
                {
                    options.INDEX = "1";
                    $("#sub_menu_user_group > a[index='1']").triggerHandler('click');
                }
            }
            else if(module == 'recent')
            {
                LoadRecent();
                return;
            }

            if($("#module_" + module).text() != "")
                return;

            $.get("module.php", options, function(data){
                $("#module_" + module).html(data);
            });
        });

        //人员 的下拉事件
        var menuTimerOrg = null;
        $("#sub_tabs_ul > li > a[module='org'] > span > span.dropdown").click(
            function(){
                $("#sub_menu_org").show(100);

                var offset = $(this).offset();
                $("#sub_menu_org").css({top:offset.top + $(this).height() - 1, left:offset.left});
            }
        );
        $("#sub_tabs_ul > li > a[module='org'] > span > span.dropdown").hover(
            function(){
            },
            function(){
                menuTimerOrg = window.setTimeout(function(){$("#sub_menu_org").hide(100);}, 300);
            }
        );

        //人员子菜单 的鼠标滑过事件
        $("#sub_menu_org").hover(
            function(){
                if(menuTimerOrg)
                    window.clearTimeout(menuTimerOrg);
            },
            function(){
                $(this).hide(100);
            }
        );

        //人员子菜单 的点击事件
        $("#sub_menu_org > a").click(function(){
            var index = $(this).attr('index');
            if($('#sub_module_org_' + index).text() != "" && $('#sub_module_org_' + index + ':visible').length > 0)
            {
                $("#sub_menu_org").hide();
                return;
            }

            if(index == 0)
            {
                $('#label_org').html(td_lang.inc.msg_128);
                $('#sub_module_org_1').hide();
                $('#sub_module_org_0').show();
                $.cookie('ONLINE_UI_1', '0', {expires:1000});
                if(orgTree0 == null)
                {
                    orgTree0 = new Tree('sub_module_org_0', jsonURL0, '/static/images/org/', false, 3, {"persist":false, "minExpandLevel":2, "LazyReadAPI":LoadNodes, "paras":{"node":jsonURL0, "flag": "0"}});
                    orgTree0.BuildTree();

                    online_last_ref = new Date();
                    $("#sub_module_org_0").triggerHandler("_show");
                }
                else if(orgTree0.tree)
                {
                    $("#sub_module_org_0").triggerHandler("_show");
                }
            }
            else
            {
                $('#label_org').html(td_lang.inc.msg_129);
                $('#sub_module_org_0').hide();
                $('#sub_module_org_1').show();
                $.cookie('ONLINE_UI_1', '1', {expires:1000});
                if(orgTree1 == null)
                {
                    orgTree1 = new Tree('sub_module_org_1', jsonURL1, '/static/images/org/', false, 3, {"minExpandLevel":2, "LazyReadAPI":LoadNodes, "paras":{"node":jsonURL1, "flag": "1"}});
                    orgTree1.BuildTree();
                }
            }

            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            $("#sub_menu_org").hide();
        });

        //在线人员模块显示事件
        $("#sub_module_org_0").bind("_show", function(){
            var now = (new Date()).getTime();
            if(orgTree0 && orgTree0.tree && Math.floor((now - online_last_ref)/1000) >= online_ref_sec)
            {
                tree0_reload();
            }
        });

        //分组 的下拉事件
        var menuTimerUserGroup = null;
        $("#sub_tabs_ul > li > a[module='user_group'] > span > span.dropdown").click(
            function(){
                $("#sub_menu_user_group").show(100);

                var offset = $(this).offset();
                $("#sub_menu_user_group").css({top:offset.top + $(this).height() - 1, left:offset.left - 35});
            }
        );
        $("#sub_tabs_ul > li > a[module='user_group'] > span > span.dropdown").hover(
            function(){
            },
            function(){
                menuTimerUserGroup = window.setTimeout(function(){$("#sub_menu_user_group").hide(100);}, 300);
            }
        );

        //分组子菜单 的鼠标滑过事件
        $("#sub_menu_user_group").hover(
            function(){
                if(menuTimerUserGroup)
                    window.clearTimeout(menuTimerUserGroup);
            },
            function(){
                $(this).hide(100);
            }
        );

        //分组子菜单 的点击事件
        $("#sub_menu_user_group > a").click(function(){
            var index = $(this).attr('index');
            if(index == "0")
            {
                $("#sub_module_user_group_1").hide();
                $("#sub_module_user_group_0").show();
                $.cookie('ONLINE_UI_2', '0', {expires:1000});
            }
            else
            {
                $("#sub_module_user_group_0").hide();
                $("#sub_module_user_group_1").show();
                $.cookie('ONLINE_UI_2', '1', {expires:1000});
            }

            $(this).siblings().removeClass('active');
            $(this).addClass('active');
            $("#sub_menu_user_group").hide();
        });

        //分组表头双击向该分组所有人群发
        $("#modules tr.sub-module-head").live('click', function(){
            var span = $(".group-name", this);
            if(span.length <= 0)
                return;

            span.toggleClass("group-name-collapsed");

            var tbody = $("#" + this.id + "_tbody");
            if(tbody)
                tbody.toggle();
        });

        //分组群发事件
        var groupOpMenuTimer = null;
        $("#module_user_group_op_menu").hover(
            function(){
                if(groupOpMenuTimer)
                {
                    window.clearTimeout(groupOpMenuTimer);
                    groupOpMenuTimer = null;
                }
            },
            function(){
                $("#module_user_group_op_menu").hide();
            }
        );

        $("#module_user_group_op_menu a").click(function(){
            var uid_str = $(this).parent().attr('uid_str');
            var user_name_str = $(this).parent().attr('user_name_str');
            if(!uid_str || !user_name_str)
                return;

            var op = $(this).attr('op');
            if(bSmsPriv && op == "msg")
                parent.group_send_sms(uid_str, user_name_str);
            else if(bEmailPriv && op == "email")
                parent.send_email1(uid_str, user_name_str);
            else
                alert(td_lang.inc.msg_130);
        });

        $("#modules tr.sub-module-head .user-group-op a").live("mouseleave", function(){
            groupOpMenuTimer = window.setTimeout(function(){$("#module_user_group_op_menu").hide();}, 300);
        });

        $("#modules tr.sub-module-head .user-group-op a").live('click', function(){
            $("#module_user_group_op_menu").show();
            var offset = $(this).offset();
            $("#module_user_group_op_menu").css({ top: offset.top+($.browser.msie ? -10 : 15), left: offset.left-50 });
            $("#module_user_group_op_menu").attr({ uid_str: $(this).attr('uid_str'), user_name_str: $(this).attr('user_name_str') });
            return false;
        });

        $("#modules tr.sub-module-head .im-group-op a[discuss_group='0']").live('click', function(){
            parent.openURL('/general/sms/?MAIN_URL=im_group');
            return false;
        });

        $("#modules tr.sub-module-head .im-group-op a[discuss_group='1']").live('click', function(){
            parent.openURL('/general/sms/?MAIN_URL=ls_group');
            return false;
        });

        //子模块项目的鼠标滑过、单击、双击事件
        $("#modules tr.sub-module-item").live('mouseenter', mouseenter_sub_module_item_callback);
        $("#modules tr.sub-module-item").live('mouseleave', mouseleave_sub_module_item_callback);
        $("#modules tr.sub-module-item").live('click', click_sub_module_item_callback);
        $("#modules tr.sub-module-item .del-recent-user").live('click', delete_recent_user_callback);

        $("#sub_module_org_0 span.dynatree-node").live('mouseenter', mouseenter_org0_node_callback);
        $("#sub_module_org_0 span.dynatree-node").live('mouseleave', mouseleave_org0_node_callback);
        $("#sub_module_org_0 li span[op]").live('mouseleave', mouseleave_org0_node_op_callback);

        $("#sub_module_org_1 span.dynatree-node").live('mouseenter', mouseenter_org0_node_callback);
        $("#sub_module_org_1 span.dynatree-node").live('mouseleave', mouseleave_org0_node_callback);
        $("#sub_module_org_1 li span[op]").live('mouseleave', mouseleave_org0_node_op_callback);

        //第一次进入页面，根据online_ui确定加载的面板
        if(online_ui == "1" || online_ui == "")
            $("#sub_tabs_ul > li > a[index='1']").triggerHandler('click');
        else if(online_ui == "2")
            $("#sub_tabs_ul > li > a[index='2']").triggerHandler('click');
        else if(online_ui == "3")
            $("#sub_tabs_ul > li > a[index='3']").triggerHandler('click');
        else if(online_ui == "4")
            $("#sub_tabs_ul > li > a[index='4']").triggerHandler('click');
    });

})(jQuery);

function LoadNodes(paras)
{
    var node = paras.node;
    var url = "";
    if(typeof(node) == "object" && typeof(node.data) == "object")
        url = node.data.json;
    else if(typeof(node) == "string")
        url = node;

    var nodes = null;
    if(paras.flag == "0")
    {
        nodes = useIspiritCache && useIspiritCache0 ? LoadNodesFromIspirit((typeof(node) == "object" ? node : null), paras.flag, true) : (url == "" ? null : LoadNodesFromURL(url, paras.flag));
    }
    else
    {
        nodes = useIspiritCache && useIspiritCache1 ? LoadNodesFromIspirit((typeof(node) == "object" ? node : null), paras.flag, false) : (url == "" ? null : LoadNodesFromURL(url, paras.flag));
    }

    return nodes;
}

function LoadNodesFromURL(url, para)
{
    var nodes = null;
    jQuery.ajax({
        async:false,
        url: url,
        dataType: 'json',
        success: function(data){
            nodes = data;
            data = null;
        },
        error: function (request, textStatus, errorThrown){}
    });

    return nodes;
}

function LoadNodesFromIspirit(node, flag, recursive)
{
//   if(node == null)
//      get_online_uid_str();

    var node_id = (node && node.data && node.data.key) ? node.data.key.substr(5) : "0";
    var xmlString = '';
    if(flag == "0")
        xmlString = window.external.OA_SMS("GET_ONLINE_TREE", online_uid_str, "ORG");
    else
        xmlString = window.external.OA_SMS("GET_ORG_TREE", node_id, "ORG");
    //xmlString = flag == "1" ? TestAPI0(node_id) : TestAPI2();
    var xml = new XML();
    xml.loadFromString(xmlString);
    var org = xml.getRoot();

    recursive = typeof(recursive) == "undefined" ? (jQuery('#sub_module_org_0:visible').length > 0 ? true : false) : recursive;
    var nodes = [];
    if(node_id == "0")
    {
        nodes = [{
            "title": org.getAttribute("c") ? org.getAttribute("c") : org.getAttribute("b"),
            "isFolder": true,
            "isLazy": false,
            "expand": true,
            "key": "dept_0",
            "dept_id": "0",
            "icon": "root.png",
            "tooltip": org.getAttribute("b"),
            "children": xmlDom2TreeNodes(org.childNodes, recursive, flag)
        }];
    }
    else
    {
        nodes = xmlDom2TreeNodes(org.childNodes, recursive, flag);
    }

    node = org = xml = xmlString = null;
    return nodes;
}

function xmlDom2TreeNodes(dom, recursive, flag)
{
    if(!dom.length)
        return null;

    var nodes = [];
    var node, node_name, node_id, node_title, is_org, user_id, dept_id, sex, url, uid_index, client, director, icon, uid_count;
    for(var i=0; i<dom.length; i++)
    {
        node = dom[i];
        node_name = node.nodeName;
        node_id = node.getAttribute("a");
        node_title = node.getAttribute("b");
        uid_count = node.getAttribute("d");

        if(node_name == "d")
        {
            is_org = node.getAttribute("c") == "1";
            nodes[nodes.length] = {
                "title": node_title,
                "isFolder": true,
                "isLazy": recursive ? false : true,
                "expand": (flag == "0" ? true : false),
                "key": "dept_" + node_id,
                "dept_id": node_id,
                "icon": is_org ? "org.png" : false,
                "tooltip": node_title,
                "url": "",
                "uid_count": uid_count,
                "target": para_target,
                "children": (recursive ? xmlDom2TreeNodes(node.childNodes, recursive, flag) : null)
            };
        }
        else
        {
            user_id = node.getAttribute("h");
            dept_id = node.getAttribute("i");
            sex = node.getAttribute("d");
            director = node.getAttribute("q");
            url = para_url2 + "?UID=" + node_id + "&USER_ID=" + user_id + "&DEPT_ID=" + dept_id;

            uid_index = jQuery.inArray(node_id, online_uid_array);
            client = uid_index >= 0 ? online_client_array[uid_index] : -1;
            if(director==1)
            {
                icon = "Z" + sex + (uid_index >= 0 ? on_status_array[uid_index] : "0") + ".png";
            }
            else
            {
                icon = "U" + sex + (uid_index >= 0 ? on_status_array[uid_index] : "0") + ".png";
            }
            nodes[nodes.length] = {
                "title": node_title,
                "isFolder": false,
                "isLazy": false,
                "key": "user_" + node_id + "_" + dept_id,
                "uid": node_id,
                "user_id": user_id,
                "icon": icon,
//          "tooltip": title,
                "op_sms": (op_sms && !find_id(exclude_uid_str, node_id)),
                "client": client,
                "url": url,
                "target": para_target
            };
        }
    }

    dom = node = node_name = node_id = node_title = is_org = user_id = dept_id = sex = url = uid_index = client = null;
    return nodes;
}

function LoadRecent(flag)
{
    var recent_array = get_im_recent_user();//例如返回数组[{'id': '1','name': 'tl','sex':'1','type': '1'}] sex 1女 0男 type 1是个人 2是群组 3讨论组 4部门群组
    if(!flag && recent_array.length <= 0)
    {
        window.setTimeout("LoadRecent(1)", 1000);
        return;
    }
    var html_tr = '';
    for(var i=0; i < recent_array.length; i++)
    {
        var item = recent_array[i];
        if(!item)
            continue;
        if(item.type == 1){
            var user = item;
            var uid = user.id;
            uid = uid.toString();
            var uid_index = jQuery.inArray(uid, online_uid_array);
            var on_status = uid_index >= 0 ? on_status_array[uid_index] : "0";
            html_tr = html_tr +'<tr class="TableData sub-module-item" type="user" uid="' + uid + '" user_name="' + user.name + '"><td class="U' + user.sex + on_status + '">' + user.name + '<img src="/static/images/cha.png" class="del-recent-user" title="从最近联系人列表移除"/></td></tr>';
        }else if(item.type == 2){
            var group = item;
            var group_id = group.id;
            var uid = item.id;
            uid = uid.toString();
            html_tr = html_tr +'<tr class="TableData sub-module-item" type="group" uid="' + uid + '" group_id="' + group_id + '" group_name="' + group.name + '"><td class="im-group">' + group.name + '<img src="/static/images/cha.png" class="del-recent-user" title="从最近联系人列表移除"/></td></tr>';
        }else if(item.type == 3){
            var disc_group = item;
            var disc_group_id = disc_group.id;
            var uid = disc_group.id;
            uid = uid.toString();
            html_tr = html_tr +'<tr class="TableData sub-module-item" type="disc_group" uid="' + uid + '" disc_group_id="' + disc_group_id + '" disc_group_name="' + disc_group.name + '"><td class="im-group">' + disc_group.name + '<img src="/static/images/cha.png" class="del-recent-user" title="从最近联系人列表移除"/></td></tr>';
        }else if(item.type == 4){
            var dept_group = item;
            var dept_group_id = dept_group.id;
            var uid = dept_group.id;
            uid = uid.toString();
            html_tr = html_tr +'<tr class="TableData sub-module-item" type="dept_group" uid="' + uid + '" dept_group_id="' + dept_group_id + '" dept_group_name="' + dept_group.name + '"><td class="im-group">' + dept_group.name + '<img src="/static/images/cha.png" class="del-recent-user" title="从最近联系人列表移除"/></td></tr>';
        }

    }
    var html = '<table class="TableList" width="100%" align="center">';
    if(html_tr == ""){
        html += '<tr class="TableData"><td align="center"><br>' + td_lang.inc.msg_136 + '<br><br></td></tr>';
    }
    else{
        html += html_tr;
    }
    html += '</table>';

    jQuery("#module_recent").html(html);
    jQuery("#body").scrollTop(0);
    html = html_tr = recent_array = recent_uid = null;
}

function LoadModule(id)
{
    var module = id.substr(7);
    var options = {MODULE: module};
    if(module == 'user_group')
    {
        var sub_block = jQuery("div.sub-module:visible", jQuery('#' + id));
        if(sub_block.length == 1)
            options.INDEX = sub_block.attr("index");
    }

    jQuery.get("module.php", options, function(data){
        jQuery("#" + id).html(data);
        if(jQuery("#" + id + ":visible").length > 0)
            jQuery("#body").scrollTop(0);
    });
}

////////////////// 事件回调函数 //////////////
function mouseenter_tree_li_callback()
{
    var node = jQuery(this).attr("dtnode");
    if(!node.data.tooltip && typeof(show_ip) != "undefined" && show_ip)
    {
        jQuery.get('/general/ipanel/user/user_ip.php', {SHOW_IP:(show_ip ? '1' : ''), UID: node.data.uid}, function(data){
            node.data.tooltip = data;
            node.render();
        });
    }
}

function mouseenter_sub_module_item_callback()
{
    jQuery(this).addClass('TableRowHover');
}

function mouseleave_sub_module_item_callback()
{
    jQuery(this).removeClass('TableRowHover');
}

function delete_recent_user_callback(e){
    e.stopPropagation();
    var self = this;
    var type = jQuery(this).parents('tr').attr('type');
    var id = jQuery(this).parents('tr').attr('uid');    //被删除人uid
    var uid = window.LOGIN_UID;    		 				//当前登录人uid
    if(type ==="user"){ 				 				//type,1个人，2公共群组，3讨论组，4部门群聊
        type = 1;
    }else if(type ==="group"){
        type = 2;
    }
    else if(type ==="disc_group"){
        type = 3;
    }
    else if(type ==="dept_group"){
        type = 4;
    }
    var result = confirm("是否要删除该最近联系人？")
    if( result ){
        jQuery.ajax({
            type: "POST",
            async:false,
            url: "/ispirit/im/message.php",
            data: {
                uid : uid,
                type: type,
                id : id,
                action: "del_recent",
            },
            success: function(data){
                var data = JSON.parse(data);
                if(data.status){
                    //console.log("data.status")
                    jQuery(self).parents('tr').remove();
                    if( !jQuery('#module_recent table tr').size()){
                        jQuery('#module_recent table tbody').append('<tr class="TableData"><td align="center"><br>暂无最近联系人<br><br></td></tr>')
                    }
                }else{
                    alert(data.msg)
                }
            }
        });
    }
}

function click_sub_module_item_callback()
{
    jQuery(this).siblings("tr.sub-module-item").removeClass('TableRowActive');
    jQuery(this).addClass('TableRowActive');

    var type = jQuery(this).attr('type');
    if(type == 'user')
    {
        var uid = jQuery(this).attr('uid');
        var user_name = jQuery(this).attr('user_name');
        parent.send_msg(uid, user_name);
    }
    else if(type == 'group')
    {
        var group_id = jQuery(this).attr('group_id');
        var group_name = jQuery(this).attr('group_name');

        send_im_group_msg(group_id, group_name);
    }
    else if(type == 'disc_group') //by kw 120928
    {
        var disc_group_id = jQuery(this).attr('disc_group_id');
        var disc_group_name = jQuery(this).attr('disc_group_name');
        send_im_discuss_msg(disc_group_id, disc_group_name);
    }
    else if(type == 'dept_group') //by sxm 170615
    {
        var dept_group_id = jQuery(this).attr('dept_group_id');
        var dept_group_name = jQuery(this).attr('dept_group_name');
        send_im_dept_msg(dept_group_id, dept_group_name);
    }
}

window.group_chat_init_state = {};
function groupChat(type, id)
{
    if(type =="new")
    {
        if(window.group_chat_init_state[id] != id)
        {
            window.group_chat_init_state[id] = id;
            parent.group_chat(type, id);
        }
    }
    else
    {
        parent.group_chat(type, id);
    }
}

function mouseenter_org0_node_callback(event)
{
    event.stopPropagation();
    var $el = this;
    var node = jQuery(this).parent('li').attr("dtnode");
    if(node.data.dept_id != undefined && node.data.dept_id != 0)
    {
        if(node.data.uid_count > 0 && node.data.uid_count != undefined && (node.data.group_chat_inited !== true || jQuery("span[data-group-chat]", this).size() == 0))
        {
            var types = null;
            jQuery.ajax({
                type: "POST",
                async:false,
                url: "/general/ipanel/user/user_type.php",
                data: "DEPT_ID=" + node.data.dept_id,
                success: function(data){
                    types = data;
                    if(types !== 'new')
                    {
                        node.data.group_chat_inited = true;
                        jQuery("span[data-group-chat='new']", $el).remove();
                    }
                }
            });
            // if(types != null && types != "not")
            // {
            //     var html = '<span id="' + node.data.key + '_op" data-group-chat="' + types + '"  op="' + node.data.op_sms + '" style="display:none;">';
            //     html += ' <img src="/static/images/chat.png" title="发起群聊" onclick="groupChat(\''+types+'\',\''+ node.data.dept_id +'\')" style="cursor:pointer;" />';
            //     html += '</span>';
            //     jQuery(this).append(html);
            //     jQuery("span[op]", this).bind('click', click_org0_node_op_callback);
            //     html = null;
            // }
        }
        // jQuery("#" + node.data.key + '_op').show();
        node = null;
    }
    else
    {
        if(node.data.op_sms || typeof(node.data.client) != 'undefined' && node.data.client != '-1' && node.data.client != '2')
        {
            if(jQuery("#" + node.data.key + '_op').length <= 0)
            {
                var html = '<span id="' + node.data.key + '_op" op="' + node.data.op_sms + '" style="display:none;">';
                if(node.data.op_sms)
                {
                    html += '&nbsp;<img src="/static/images/email.png" title="'+td_lang.inc.msg_134+'" onclick="parent.send_email1(\''+node.data.uid+'\',\''+ node.data.title +'\')" style="cursor:pointer;" />';
                    html += ' <img src="/static/images/0-1.gif" title="查看名片" onclick="parent.check_card(\''+node.data.uid+'\',\''+ node.data.title +'\')" style="cursor:pointer;" />';
                }

                if(typeof(node.data.client) != 'undefined' && node.data.client != '-1' && node.data.client != '2')
                {
                    html += ' <img src="/static/images/client_type_' + node.data.client + '.png" title="' + sprintf(td_lang.inc.msg_131, get_client_type(node.data.client)) + '">';
                }

                html += '</span>';

                jQuery(this).append(html);
                jQuery("span[op]", this).bind('click', click_org0_node_op_callback);
                html = null;
            }
            jQuery("#" + node.data.key + '_op').show();
        }
        node = null;
    }
}

function click_org0_node_op_callback(event)
{
    event.stopPropagation();
}

function mouseleave_org0_node_callback()
{
    var node = jQuery(this).parent('li').attr("dtnode");
    jQuery("#" + node.data.key + '_op').hide();
    node = null;
}

function mouseleave_org0_node_op_callback()
{
    jQuery(this).hide();
}
//////////////////////////////////////////////
