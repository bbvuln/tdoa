
var timer_sms_mon = null;
var timer_on_status_list = null;

jQuery.noConflict();

(function ($) {

    function resizeLayout() {
        // 主操作区域高度
        var wWidth = (window.document.documentElement.clientWidth || window.document.body.clientWidth || window.innerHeight);
        var wHeight = (window.document.documentElement.clientHeight || window.document.body.clientHeight || window.innerHeight);
        var nHeight = $('#north').is(':visible') ? $('#north').outerHeight() : 0;
        var cHeight = wHeight - nHeight - $('#south').outerHeight() - $('#hero_bar').outerHeight() - $('#infobar').outerHeight();

        $('#center').height(cHeight);
        $("#center iframe").css({ height: cHeight });

        //修正IE6下窗口大小变化时ipanel及其下层iframe不响应resize事件的问题
        if ($.browser.msie && $.browser.version == '6.0' && typeof (frames['ipanel'].resizeLayoutByParent) == 'function') {
            frames['ipanel'].resizeLayoutByParent();
        }
    };

    function initLogout() {
        //注销
        $('#logout_btn').bind('click', function () {
            logout();
            return false;
        });
    }

    function initHideTopbar() {
        //隐藏topbar事件
        $('#hide_top_btn').bind('click', function () {
            $('#north').slideToggle(300, function () { resizeLayout(); });
            $(this).toggleClass('down');

            var hidden = $(this).attr('class').indexOf('down') >= 0;
            $.cookie('hideTopbar', (hidden ? '1' : null), { expires: 1000, path: '/' });
        });

        if ($.cookie('hideTopbar') == '1')
            $('#hide_top_btn').triggerHandler('click');
    }

    function initHideIpanel() {
        //隐藏topbar事件
        $('#hide_left_btn').bind('click', function () {
            $('#center_left').toggle();
            $('#center').toggleClass('hide_ipanel');
            $(this).toggleClass('right');

            var hidden = $(this).attr('class').indexOf('right') >= 0;
            $.cookie('hideIpanel', (hidden ? '1' : null), { expires: 1000, path: '/' });
        });

        if ($.cookie('hideIpanel') == '1')
            $('#hide_left_btn').triggerHandler('click');
    }

    function initDatetime() {
        $('#date,#mdate').click(function () {
            frames['main'].location = '/module/calendar2/';
        });
        $('#time_area').click(function () {
            frames['main'].location = '/module/world_time/';
        });
    }

    function initOnStatus() {
        $('#on_status_desc').hover(
            function () {
                var offset = $(this).offset();
                $('#on_status_list').css({ left: offset.left, top: (offset.top + $(this).height()) });
                $('#on_status_list').fadeIn();
            },
            function () {
                timer_on_status_list = window.setTimeout(function () { $('#on_status_list').fadeOut(); }, 300);
            }
        );

        $('#on_status_list').hover(
            function () {
                if (timer_on_status_list != null) {
                    window.clearTimeout(timer_on_status_list);
                    timer_on_status_list = null;
                }
            },
            function () {
                $(this).fadeOut();
            }
        );
    }

    function initShortcut() {
        $('#infobar_shortcut').hover(
            function () {
                $('#shortcut_scroll').show();
            },
            function () {
                $('#shortcut_scroll').hide();
            }
        );

        $('#infobar_shortcut').bind('mousewheel', (function () {
            var timer = null;
            return function () {
                timer && clearTimeout(timer);
                timer = setTimeout(scrollShortcut, 100);
            }
        })());
        $('#shortcut_scroll').click(function () { scrollShortcut(); });
    }

    function scrollShortcut() {
        var obj = $('#shortcut_menus');
        var height = obj.height() * obj.children().length;
        var scrollTo = obj.scrollTop() + obj.height();
        scrollTo = scrollTo >= height ? 0 : scrollTo;
        obj.stop().animate({ scrollTop: scrollTo }, 300);
    }

    function initHeroBar() {
        if ($('#tongdainfo').length <= 0)
            return;

        $.get('tongda.php', function (data) {
            if (data.code == '1' && typeof (data.data) == 'object' && data.data.length > 0) {
                $('#tongdainfo a').remove();
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].type == '1') {
                        if (jQuery.cookie('hide_notice_' + data.data[i].id) != '1' && (data.data[i].flag != '1' || cur_login_user_priv == '1')) {
                            jQuery('#notice_tip').show();
                            jQuery('#notice_head').html(data.data[i].text);
                            jQuery('#notice_body').html(data.data[i].content);
                            jQuery('#notice_foot').html('<a onclick="jQuery(\'#notice_tip\').hide();jQuery.cookie(\'hide_notice_' + data.data[i].id + '\', 1, {expires:1000, path:\'/\'});" href="' + data.data[i].href + '" class="btn-white-big" target="_blank">' + td_lang.inc.msg_146 + '</a>&nbsp;<a href="javascript:;" class="btn-white-big" onclick="jQuery(\'#notice_tip\').hide();jQuery.cookie(\'hide_notice_' + data.data[i].id + '\', 1, {expires:1000, path:\'/\'});">' + td_lang.global.close + '</a>');
                        }
                    }
                    else {
                        $('#tongdainfo').append('<a href="' + data.data[i].href + '" class="' + data.data[i].class_name + '" target="' + data.data[i].target + '" style="' + data.data[i].style + '"><span>' + data.data[i].text + '</span></a>');
                    }
                }
            }
        }, 'json');
    }

    $(window).resize(function () { resizeLayout(); });

    $(document).ready(function ($) {
        $('#loading').remove();

        //调整窗口大小
        resizeLayout();

        //快捷菜单栏鼠标滚动事件
        initShortcut();

        //注销事件
        initLogout();

        //隐藏ipanel和topbar事件
        initHideTopbar();
        initHideIpanel();

        //日期时间和天气
        mdate();
        timeview();
        if (bInitWeather) {
            InitProvince(weatherCity);
            if ($('#weather').text() == "")
                $('#weather').html(sprintf('<a href="javascript:GetWeather();">%s</a>', td_lang.inc.msg_141));
        }
        initDatetime();

        //初始化在线状态下拉事件
        initOnStatus();

        //新微讯、在线人员监控和状态栏文字滚动
        timer_sms_mon = window.setTimeout(sms_mon, 3000);
        window.setTimeout(online_mon, monInterval.online * 1000);
        window.setInterval(StatusTextScroll, statusTextScroll * 1000);

        initHeroBar();

        //工作台代码
        function hiddenWorkBench() {
            jQuery('#my_workbench .list-wrap').css('display', 'none')
            jQuery('#overlay_workbench').css('display', 'none')
        }
        //解决ie下window.location.origin的兼容性问题
        if (window["context"] == undefined) {
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname +
                    (window.location.port ? ':' + window.location.port : '');
            }
            window["context"] = location.origin + "/V6.0";
        }
        function skipWorkbench(id) {
            // var url = window.location.origin + '/portal/views/handle/index.php?#/workbench/' + id
            var url = ''
            jQuery.ajax({
                url: '/general/appbuilder/web/portal/workbench/geturl?id=' + id,
                type: 'get',
                success: function (myData) {
                    url = window.location.origin + '/' + myData;
                    openURL(url);
                    hiddenWorkBench()
                }
            })
        }
        // var params = {
        //     action: 'GetWorkbenchList'
        // }
        jQuery('#my_workbench .workbench-set').click(function (e) {
            openURL('../portal/views/workbench/')
            e.stopPropagation();
            hiddenWorkBench()
        })
        jQuery('#overlay_workbench').click(function (e) {
            e.stopPropagation();
            hiddenWorkBench()
        })
        jQuery('#my_workbench').click(function () {
            jQuery.ajax({
                url: '/general/appbuilder/web/portal/workbench/getworklist',
                type: 'get',
                // data: params,
                success: function (myData, textStatus, jqXHR) {
                    var _data = JSON.parse(JSON.stringify(myData))
                    var filterData = _data.data
                    var data = []
                    if (filterData.length) {
                        for (var j = 0; j < filterData.length; j++) {
                            if (filterData[j].state && filterData[j].state === '1') {
                                data.push(filterData[j])
                            }
                        }
                    }
                    var ulStr = ''
                    if (data.length) {
                        for (var i = 0; i < data.length; i++) {
                            (function () {
                                var str = ''
                                var iconStr = ''
                                if (data[i].isIcon) {
                                    iconStr += '<a href="javascript:;"  class="iconfont workbench-maneger">&#xe6ee;</a>'
                                }
                                if (i + 1 === data.length) {
                                    str += '<li id=' + data[i].id + ' class="no-border"><i></i><span title=' + data[i].name + '>' + data[i].name + '</span>' + iconStr + '</li>'
                                } else {
                                    str += '<li id=' + data[i].id + '><i></i><span title=' + data[i].name + '>' + data[i].name + '</span>' + iconStr + '</li>'
                                }

                                ulStr += str
                            })(i)
                        }
                    } else {
                        ulStr += ' <p class="no-data">暂无数据</p>'
                    }
                    jQuery('#my_workbench ul').html(ulStr)
                    var lis = jQuery('#my_workbench ul li')
                    for (var i = 0; i < lis.length; i++) {
                        (function () {
                            lis[i].onclick = function (e) {
                                skipWorkbench(this.id);
                                e.stopPropagation();
                            }
                        })(i)
                    }
                    jQuery('#my_workbench .list-wrap').css('display', 'block')
                    jQuery('#overlay_workbench').css('display', 'block')


                }
            })
        })

    });

})(jQuery);

//修复setTimeout bug，使用window.setTimeout调用
if (!+'\v1') {
    (function (f) {
        window.setTimeout = f(window.setTimeout);
        window.setInterval = f(window.setInterval);
    })(function (f) {
        return function (c, t) {
            var a = [].slice.call(arguments, 2);
            return f(function () {
                c.apply(this, a)
            }, t)
        }
    });
}

var $ = function (id) { return document.getElementById(id); };

function getEvent() //同时兼容ie和ff的写法
{
    if (document.all) return window.event;
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
}

//顶部logo栏
function mdate() {
    var solarTerm = sTerm(OA_TIME.getFullYear(), OA_TIME.getMonth(), OA_TIME.getDate());
    if (solarTerm != "")
        $('mdate').innerHTML = solarTerm;
}
function timeview() {
    $('time_area').innerHTML = OA_TIME.toTimeString().substr(0, 5);
    OA_TIME.setSeconds(OA_TIME.getSeconds() + 1);
    window.setTimeout(timeview, 1000);
}

function GetWeather(beUpdate) {
    var WEATHER_CITY = $('w_county').options[$('w_county').selectedIndex].value;
    if (WEATHER_CITY.length != 6) {
        alert(td_lang.inc.msg_29);//"请选择城市"
        return;
    }

    var w_province = $('w_province').options[$('w_province').selectedIndex].text;
    var w_city = $('w_city').options[$('w_city').selectedIndex].text;
    var w_county = $('w_county').options[$('w_county').selectedIndex].text;
    var WEATHER_CITY = [w_province, w_city, w_county].join("_");

    $('weather').innerHTML = '<div class="loading_blue_16">' + td_lang.inc.msg_30 + '</div>';//正在加载，请稍候……
    jQuery.ajax({
        type: 'GET',
        url: '/inc/weather.php',
        data: { 'WEATHER_CITY': WEATHER_CITY, 'UPDATE': beUpdate },
        dataType: 'text',
        success: function (data) {
            if (data.substr(0, 6) == "error:")
                $('weather').innerHTML = data.substr(6) + " <a href=\"javascript:GetWeather();\">" + td_lang.global.refresh_1 + "</a> <a href=\"#\" onclick=\"$('area_select').style.display='inline-block';$('weather').style.display='none';\">" + td_lang.inc.msg_33 + "</a>";
            else
                $('weather').innerHTML = data;
        },
        error: function (request, textStatus, errorThrown) {
            $('weather').innerHTML = td_lang.inc.msg_31 + request.status + " <a href=\"javascript:GetWeather();\">" + td_lang.inc.msg_32 + "</a> <a href=\"#\" onclick=\"$('area_select').style.display='nline-block';$('weather').style.display='none';\">" + td_lang.inc.msg_33 + "</a>";
        }
    });

    $('area_select').style.display = 'none';
    $('weather').style.display = 'inline-block';
}

//顶部用户信息、快捷组栏
function set_status(status) {
    //on_status++;
    if (status > 3)
        status = 1;
    on_status = status;

    var obj = $("on_status_desc");
    obj.innerHTML = $("on_status_" + on_status).innerHTML;
    obj.className = "on_status_" + on_status;

    jQuery.ajax({
        type: 'GET',
        url: './ipanel/ispirit_api.php',
        data: { 'API': 'on_status', 'CONTENT': on_status },
        dataType: 'text',
        error: function (request, textStatus, errorThrown) {
        }
    });
}

function show_my_status() {
    $('my_info').style.display = 'none';
    $('my_status').style.display = '';
    $('my_status').focus();
    $('my_status').select();
}
function update_my_status() {
    $('my_status').style.display = 'none';
    $('my_info').style.display = '';

    var my_status = $('my_status').value.replace(/(^[\s\t　]+)|([　\s\t]+$)/g, "");//trim
    if (my_status == "" || my_cur_status == my_status)
        return;
    my_cur_status = my_status;

    var title = $('on_status').title;
    $('on_status').title = title.substr(0, title.indexOf("\n\n") + 2) + my_cur_status;

    jQuery.ajax({
        type: 'GET',
        url: './ipanel/ispirit_api.php',
        data: { 'API': 'weixun_share', 'CONTENT': my_status },
        dataType: 'text',
        error: function (request, textStatus, errorThrown) {
        }
    });
}
function input_my_status() {
    if (event.keyCode == 13)
        update_my_status();
}

var relogin = 0;
function logout() {
    var msg = sprintf(td_lang.inc.msg_109, loginUser.user_name) + "\n" + sprintf(td_lang.inc.msg_110, logoutText + "\n\n");
    if (window.confirm(msg)) {
        relogin = 1;
        window.location = "relogin.php";
    }
}

function exit() {
    var msg = sprintf(td_lang.inc.msg_109, loginUser.user_name) + "\n" + sprintf(td_lang.inc.msg_111, logoutText + "\n\n");
    if (window.confirm(msg)) {
        var event = getEvent();
        if (ispirit != "1" || jQuery(document.body).width() - event.clientX < 50 || event.altKey || event.ctrlKey) {
            if (jQuery.browser.msie)
                jQuery.get('relogin.php');
            else
                window.location = "relogin.php";
        }
        window.close();
    }
}

//底部状态栏
//短信提醒
var documentTitle = document.title;
var blinkTitleInterval = null;
var blinkTitleType = '';
function sms_mon() {
    if (timer_sms_mon) {
        window.clearTimeout(timer_sms_mon);
        timer_sms_mon = null;
    }
    timer_sms_mon = window.setTimeout(sms_mon, monInterval.sms * 1000);

    jQuery.ajax({
        type: 'GET',
        url: '../inc/new_sms.php',
        data: { 'now': new Date().getTime() },
        success: function (data) {
            if (data.indexOf("1") >= 0) {
                $('new_sms').innerHTML = newSmsHtml;
                $('new_sms_sound').innerHTML = newSmsSoundHtml;
                if (sms_on == '1') {
                    show_sms();
                }
                else {
                    if (timer_sms_mon) {
                        window.clearTimeout(timer_sms_mon);
                        timer_sms_mon = null;
                    }

                    if (data.substr(0, 1) == "1") {
                        blinkTitleType = 'noc';
                    }
                    else if (data.substr(1, 1) == "1") {
                        blinkTitleType = 'sms';
                    }

                    if (data.substr(0, 2) == "11")
                        blinkTitleType = 'sms&noc';

                    blinkTitleInterval = window.setInterval(BlinkTitle, 1000);
                }
            }
            else {
                set_no_sms();
            }
        }
    });
}

function set_no_sms() {
    ResetTitle();
    $("new_sms").innerHTML = "";
    $("new_sms_sound").innerHTML = "";
}
function show_sms() {
    set_no_sms();
    if (timer_sms_mon) {
        window.clearTimeout(timer_sms_mon);
        timer_sms_mon = null;
    }
    timer_sms_mon = window.setTimeout(sms_mon, monInterval.sms * 1000);

    var mytop = screen.availHeight - 200;
    window.open("./status_bar/sms_show.php", "show_sms_" + loginUser.uid, "height=160,width=390,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top=" + mytop + ",left=0,resizable=yes");
}

//-- 在线人员 --
function online_mon() {
    jQuery.ajax({
        async: true,
        url: 'ipanel/user/user_count.php',
        dataType: 'text',
        success: function (data) {
            try {
                eval(data);
            }
            catch (ex) {
            }

            online_count = typeof (online_array) == 'object' ? online_array[0] : 0;
            $("user_count").innerHTML = online_count;

            var online_title = sprintf(td_lang.general.msg_34, user_total_count, online_count);
            $('user_count').title = online_title;
            $('online_link').title = online_title;
        },
        error: function (request, textStatus, errorThrown) { }
    });

    window.setTimeout(online_mon, monInterval.online * 1000);
}

function ViewOnlineUser() {
    if (typeof (frames['ipanel'].view_menu) == 'function') {
        frames['ipanel'].view_menu(2);
    }
}

//-- 状态栏文字 --
function StatusTextScroll() {
    var obj = jQuery('#status_text');
    var scrollTo = obj.scrollTop() + obj.height();
    if (scrollTo >= obj.attr('scrollHeight'))
        scrollTo = 0;
    obj.animate({ scrollTop: scrollTo }, 300);
}

function BlinkTitle() {
    var t = blinkTitleType;
    var l = '';
    if (t == "sms")
        l = td_lang.inc.msg_37;//"您有新的短信提醒！"
    else if (t == "noc")
        l = td_lang.inc.msg_132;//"您有新的事务提醒！"
    else if (t == "sms&noc")
        l = td_lang.inc.msg_133;//"您有新的短消息和事务提醒！"

    document.title = document.title == "　　　　　　　　" ? l : "　　　　　　　　";
}

function ResetTitle() {
    window.clearInterval(blinkTitleInterval);
    document.title = documentTitle;
}

function show_feedback() {
    window.open("http://club.tongda2000.com/demand/");
}
