(function ($) {
    window.Module = {
        'default': {
            page_per_num: 3,
            page_start: 1
        },
        dom: {
            page: '<div class="mod_bd_nav" data-type-wrapper="_pagenav"><div class="pagenav"><a class="change-pre unavailable" href="javascript:;" hidefocus=""><em class="uparrow"></em>上一页</a><em class="unavailable">|</em><a class="change-nxt" href="javascript:;" hidefocus="">下一页<em class="downarrow"></em></a></div></div>'
        },
        load: function (u, m, t, p, fn) {
            var self = this;
            if (p) {
                //设置每页多少条
                if (!p.page_per_num)
                    p.page_per_num = self['default'].page_per_num;

                //设置开始页数
                if (!p.page_current)
                    p.page_current = 1;
            }

            var isp = p && p.page;
            var md = $("div.mod[data-module='" + m + "']");
            var pd = {};

            //设置发送数据
            pd.module = m;
            pd.type = t;

            if (isp) pd.page = p.page_current;

            $.ajax({
                type: "POST",
                url: u,
                data: pd,
                dataType: isp ? "json" : "html",
                beforeSend: function () {
                    md.find(".mod_bd_inner").hide();
                    if (md.find(".T_loading").length > 0)
                        md.find(".T_loading").show();
                    else
                        md.find(".mod_bd").append("<div class='T_loading'></div>");

                    if (!isp)
                        md.find('.mod_bd_nav').remove();

                },
                success: function (data) {
                    var target = md.find(".mod_bd_inner[data-type-wrapper='" + t + "']");

                    if (isp) {
                        target.html(data.html);
                        //console.log(data.total, p.page_per_num);
                        if (parseInt(data.total) > parseInt(p.page_per_num)) {
                            var nav_p = md.find('.mod_bd_nav');

                            if (nav_p.length == 0) {
                                md.find('.mod_bd').append(self.dom.page);
                            }
                            md.find('.mod_bd_nav').attr({
                                "data-type-wrapper": t,
                                "data-page-current": p.page_current
                            }).show();

                            if (!data || data.num < p.page_per_num)
                                md.find('.mod_bd_nav').find("a.change-nxt").addClass("unavailable");

                        } else {
                            md.find('.mod_bd_nav').hide();
                        }
                    }
                    else {
                        target.html(data);
                    }

                    md.find(".T_loading").hide();
                    target.show();

                    //console.log(fn, typeof fn);

                    if (fn && typeof fn == 'string') {
                        $.isFunction(window[fn]) && window[fn].apply(this, [target]);
                    }
                }
            });
        },
        init: function (u) {

            $(".mod_hd_tabs").each(function () {
                $(this).find("li:first").addClass("mod_hd_tab_first");
            });

            var self = this;
            $(".mod_hd_tabs li").click(function () {
                var olis = $(this).siblings();
                olis.removeClass("active");
                $(this).addClass("active");

                var module = $(this).parents(".mod").attr("data-module");
                var type = $(this).find("a").attr("data-type");

                if (!$(this).find("a").attr("data-request-url"))
                    $(this).find("a").attr("data-request-url", u);


                //设置当前页数
                var page = $(this).find("a").attr("data-page-open")
                var page_current = $(this).find("a").attr("data-page-current");
                var per_num = $(this).find("a").attr("data-page-per-num");
                var url = $(this).find("a").attr("data-request-url");

                if (!callback) {
                    var callback = $(this).find("a").attr("data-callback");
                }

                if (!callback) {
                    callback = $(this).parents(".mod").attr("data-callback");
                }

                var page_config = {
                    'page': page,
                    'page_current': page_current,
                    'page_per_num': per_num
                };

                if (module)
                    self.load(url, module, type, page_config, callback);
            });

            $(".mod").each(function () {
                var module = $(this).attr("data-module");
                var autoload = $(this).attr("data-autoload");
                var callback = $(this).attr("data-callback");

                if (typeof autoload == "undefined")
                    autoload = true;
                else
                    return true;

                if ($(this).find("ul").length > 0) {
                    $(this).find("ul li:first").click();
                    return;
                    //type = $(this).find("li.active a").attr("data-type");
                } else {
                    type = module;
                }

                if (module && autoload)
                    self.load(u, module, type, null, callback);
            });

            $(".mod").delegate("a.change-nxt, a.change-pre", "click", function () {
                var np = 0, callback;
                var p = $(this).parents(".mod_bd_nav");
                var pnum = p.attr("data-page-current");

                var mod = $(this).parents(".mod");
                var curr_type = $(this).parents(".mod").find(".mod_hd_tabs li.active a");
                var callback_p = mod.attr("data-callback");
                var callback_item = curr_type.attr("data-callback");

                if ($(this).hasClass("change-pre")) {
                    if ($(this).hasClass("unavailable"))
                        return false;

                    np = parseInt(pnum) - 1;
                    p.attr("data-page-current", np)
                    if (parseInt(pnum) == 2)
                        $(this).addClass("unavailable");

                    $(this).siblings(".change-nxt").removeClass("unavailable");
                }

                if ($(this).hasClass("change-nxt")) {
                    if ($(this).hasClass("unavailable"))
                        return;

                    np = parseInt(pnum) + 1;
                    p.attr("data-page-current", np);
                    if (np > 1)
                        $(this).siblings(".change-pre").removeClass("unavailable");
                }

                //兼容
                if (callback_p && callback_item)
                    callback = callback_item;
                else if (callback_p)
                    callback = callback_p;
                else
                    callback = callback_item;

                self.load(curr_type.attr("data-request-url"), mod.attr("data-module"), curr_type.attr("data-type"), {
                    'page': true,
                    'page_current': np,
                    'page_per_num': curr_type.attr("data-page-per-num")
                }, callback);
            });

        }
    };

    window.HtmlTitle = {
        base: {
            blinkTitleInterval: null,
            type: '',
            documentTitle: document.title
        },
        blink: function () {
            var t = this.base.type;
            var l = '';
            if (t == "sms")
                l = "您有新的短信提醒！";
            else if (t == "noc")
                l = "您有新的事务提醒！";
            else if (t == "sms&noc")
                l = "您有新的短消息和事务提醒！";
            document.title = document.title == "　　　　　　　　" ? l : "　　　　　　　　";
        },
        reset: function () {
            var self = this;
            window.clearInterval(self.base.blinkTitleInterval);
            document.title = self.base.documentTitle;
        }
    };

    window.Notify = {
        base: {
            'timer_sms_mon': null,
            'duration': 30
        },
        init: function () {
            var self = this;
            $(".notify_item_num").click($.proxy(function () {
                this.pull();
            }, this));

            $("#notify_panel").click(function (e) {
                e.stopPropagation();
            });

            //点击查看提醒
            $('#new_noc_list').delegate('div.noc_iterm ul.noc_iterm_data li', 'click', function () {
                var url = $(this).attr('data-url');
                var sms_id = $(this).attr('data-id');
                self.remove_noc($(this), sms_id);
                if (url != "") {
                    openURL('', '', url, '1');
                }
                self.restat_num();
            });

            //分类已阅、分类详情
            $('#new_noc_list').delegate('div.noc_iterm .noc_iterm_title a', 'click', function () {
                var module = $(this).parents(".noc_iterm").attr("module-id");
                if ($(this).hasClass("noc_iterm_cancel"))
                    self.cancel(module);
                else if ($(this).hasClass("noc_iterm_read"))
                    self.read(module);
            });

            $('#new_noc_list div.noc_iterm ul.noc_iterm_data li a').click(function (e) {
                e.stopPropagation();
            })

            //全部已阅、全部详情、历史记录
            $('#new_noc_title .noc_iterm_func a').click(function () {
                var type = $(this).attr("node-type");
                switch (type) {
                    case 'cancel':
                        self.cancel();
                        break;
                    case 'readall':
                        self.read();
                        break;
                    case 'history':
                        openURL('', '事务提醒历史记录', "/general/sms/remind_center", '1');
                        break;
                }
            });
            this.hasnew();
            this.check();
        },
        check: function () {
            var self = this;
            this.base.timer_sms_mon && clearTimeout(this.base.timer_sms_mon);
            this.base.timer_sms_mon = setTimeout(function () {
                self.check();
                self.hasnew();
            }, this.base.duration * 1000);
        },
        hasnew: function () {
            var self = this;
            $.ajax({
                type: 'GET',
                url: '/inc/new_sms.php',
                data: {'now': new Date().getTime(),
                },
                success: function (data) {
                    if (data.indexOf("1") >= 0) {
                        //$('new_sms_sound').innerHTML = newSmsSoundHtml;
                        if (self.base.timer_sms_mon) {
                            window.clearTimeout(self.base.timer_sms_mon);
                            self.base.timer_sms_mon = null;
                        }

                        if (data.substr(0, 1) == "1") {
                            self.check();
                            //HtmlTitle.base.type = 'noc';
                            self.get_unread_num(function (num) {
                                $(".notify_item_num .badge").show().html(num);
                            });
                        }
                        //HtmlTitle.base.blinkTitleInterval = window.setInterval($.proxy(HtmlTitle.blink, HtmlTitle), 1000);
                    }
                }
            });
        },
        get_unread_num: function (fn) {
            $.get('/general/status_bar/get_noc.php', {'QUERY_TYPE': 'count'}, function (data) {
                if (!isNaN(data)) {
                    if (typeof fn == "function")
                        fn(parseInt(data));
                }
            });
        },
        pull: function () {
            var self = this;
            $('#nocbox_tips').show();
            $('#new_noc_list').hide();
            flag = typeof(flag) == "undefined" ? "1" : "0";
            $.ajax({
                type: 'GET',
                url: '/general/status_bar/get_noc.php',
                data: {
                    'FLAG': flag
                },
                dataType: "json",
                cache: false,
                success: function (data) {
                    $('#nocbox_tips').hide();
                    if (data) {
                        self.format(data);
                    }
                    else {
                        //无新提醒
                        $('#new_noc_list').show().html("<p class='tips'>暂无消息</p>");
                        $("#new_noc_title .noc_iterm_num span").html(0);
                        $(".notify_item_num .badge").hide();
                    }
                }
            });
        },
        format: function (data) {
            var html = totalnum = '';
            $('#new_noc_list').empty();
            $.each(data, function (key, item) {
                if (item.type_id == "") return false;
                var content = decodeURIComponent(item.content);
                var pos = content.indexOf('<br />');
                if (pos >= 0) {
                    var pos2 = content.indexOf('<br />', pos + 6);
                    if (pos2 >= 0)
                        content = content.substr(0, pos2);
                }

                var node = $('#new_noc_list').find("div.noc_iterm[module-id='" + item.type_id + "']");
                if (node.size() != 0) {
                    html = '<li data-id="' + item.sms_id + '" data-url="' + item.url + '">';
                    html += '<p class="noc_iterm_info"><span class="noc_iterm_time">' + decodeURIComponent(item.send_time) + '</span>' + decodeURIComponent(item.from_name) + '</p>';
                    html += '<p class="noc_iterm_content">' + content + '</p>';
                    html += '</li>';
                    node.find("ul").append(html);
                }
                else {
                    html = '<div class="noc_iterm" module-id="' + item.type_id + '">';
                    html += '<div class="noc_iterm_title"><a class="noc_iterm_read" href="javascript:;" title="查看分类详情"></a><a class="noc_iterm_cancel" href="javascript:;" title="分类全部已阅"></a>' + decodeURIComponent(item.type_name) + '</div>';
                    html += '<ul class="noc_iterm_data">';
                    html += '<li data-id="' + item.sms_id + '" data-url="' + item.url + '">';
                    html += '<p class="noc_iterm_info"><span class="noc_iterm_time">' + decodeURIComponent(item.send_time) + '</span>' + decodeURIComponent(item.from_name) + '</p>';
                    html += '<p class="noc_iterm_content">' + content + '</p>';
                    html += '</li>';
                    html += '</ul>';
                    html += '</div>';
                    $('#new_noc_list').append(html);
                }
            });
            $('#new_noc_list').show();
            var num = $('#new_noc_list .noc_iterm li').length;
            $("#new_noc_title .noc_iterm_num span").html(num);
        },
        get_noc_idstr: function (m) {
            var idstr = separator = '';
            if (m) {
                var idsobj = $("#new_noc_list .noc_iterm[module-id='" + m + "'] .noc_iterm_data li");
            } else {
                var idsobj = $("#new_noc_list .noc_iterm .noc_iterm_data li");
            }
            $.each(idsobj, function () {
                idstr += separator + $(this).attr("data-id");
                separator = ",";
            });
            return idstr;
        },
        read: function (t) {
            if ($("#new_noc_list .noc_iterm").length == 0)
                return;

            //全部详情
            var idstr = firsturl = separator = "";
            if (t) {
                var idobj = $('#new_noc_list .noc_iterm[module-id="' + t + '"] .noc_iterm_data li');
                var readobj = $('#new_noc_list .noc_iterm_func a[node-type="cancel"]');
            } else {
                var idobj = $("#new_noc_list .noc_iterm .noc_iterm_data li");
                var readobj = $('#new_noc_list .noc_iterm[module-id="' + t + '"] .noc_iterm_read');
            }

            idobj.each(function () {
                url = $(this).attr("data-url");
                sms_id = $(this).attr("data-id");
                if (url != "" && firsturl == "") {
                    firsturl = url;
                }
                if (url != "") {
                    idstr += separator + $(this).attr("data-id");
                    separator = ",";
                }
            });

            openURL('RemindDetail', '事务提醒详情', '/module/nav/?SMS_ID_STR=' + idstr + '&NAV_MAIN_URL=' + encodeURIComponent(firsturl), '1');
            //window.open();
            //RemoveNoc(readobj, idstr_all, 0);
        },
        cancel: function (t) {
            if ($("#new_noc_list .noc_iterm").length == 0)
                return;

            //全部已阅
            var self = this;
            var idstr = this.get_noc_idstr(t);
            $.ajax({
                type: 'POST',
                url: '/general/status_bar/sms_submit.php',
                data: {
                    'SMS_ID': idstr
                },
                cache: false,
                success: function () {
                    if (t) {
                        var cancelobj = $('#new_noc_list div.noc_iterm[module-id="' + t + '"] .noc_iterm_title .noc_iterm_cancel');
                        cancelobj.parents(".noc_iterm").remove();
                        self.restat_num();
                    } else {
                        self.clear_num();
                    }
                }
            });
        },
        remove_noc: function (obj, recvIdStr) {
            if (!recvIdStr) return;
            $.ajax({
                type: 'POST',
                url: '/general/status_bar/sms_submit.php',
                data: {
                    'SMS_ID': recvIdStr
                },
                success: function (data) {
                    var lis = obj.parents(".noc_iterm").find("ul").find("li").size();
                    if (recvIdStr.indexOf(",") != '-1') {
                        obj.parents(".noc_iterm").remove()
                    }
                    var num = $("#new_noc_list > .noc_iterm > li").length;
                    $("#new_noc_panel > #new_noc_title > .noc_iterm_num > span").html(num);
                }
            });
        },
        clear_num: function () {
            $('#new_noc_list').empty().html("<p class='tips'>暂无消息</p>");
            $("#new_noc_title > .noc_iterm_num > span").html(0);
            $(".notify_item_num .badge").empty().hide();
        },
        restat_num: function () {
            var num = $("#new_noc_list .noc_iterm li").length;
            $("#new_noc_title .noc_iterm_num span").html(num);
            if (num == 0) {
                $(".notify_item_num .badge").hide();
                $('#new_noc_list').empty().html("<p class='tips'>暂无消息</p>");
            } else {
                $(".notify_item_num .badge").html(num);
            }
        }
    };

})(jQuery);
function openURL(id, name, url, open_window, width, height, left, top) {
    width = typeof(width) == "undefined" ? 960 : width;
    height = typeof(height) == "undefined" ? 600 : height;
    left = typeof(left) == "undefined" ? (screen.availWidth - width) / 2 : left;
    top = typeof(top) == "undefined" ? (screen.availHeight - height) / 2 - 30 : top;
    window.open(url, id, "height=" + height + ",width=" + width + ",status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top=" + top + ",left=" + left + ",resizable=yes");
    $(document).trigger('click');
}