var createEmpty = function(text) {
    text ? null : (text = "��������");
    return '<div class="empty"><div>' + text + "</div></div>";
};
var loadingStr = createEmpty("loading");
var emptyStr = createEmpty();
// ������İ�ť
var otherButtonStr =
    '<div class="other-button"><span class="td-iconfont td-icon-pandianzhujiemian" ></span></div>';
// �����ļ���������ͼ��
var createFolderIcon = (function() {
    var word = ["doc", "docx"];
    var excel = ["xlsx", "xls"];
    var video = [
        "avi",
        "rmvb",
        "rm",
        "asf",
        "divx",
        "mpg",
        "mpeg",
        "mpe",
        "wmv",
        "mp4",
        "mkv",
        "vob"
    ];
    var audio = ["mp3", "wma", "rm", "wav", "midi", "ape", "flac"];
    var map = {
        defaultKey: {
            value: "tongyongunkuown",
            color: "#8199af",
            unicode: "&#xe774;"
        },
        jpg: {
            value: "jpg",
            color: "#f99f00",
            unicode: "&#xe774;"
        },
        psd: {
            value: "psd",
            color: "#0c77c6",
            unicode: "&#xe774;"
        },
        zip: {
            value: "zip",
            color: "#8199af",
            unicode: "&#xe774;"
        },
        sql: {
            value: "sql",
            color: "#3aa046",
            unicode: "&#xe774;"
        },
        txt: {
            value: "txt",
            color: "#f9ca06",
            unicode: "&#xe774;"
        },
        ppt: {
            value: "ppt",
            color: "#e34221",
            unicode: "&#xe774;"
        },
        log: {
            value: "log",
            color: "#d82b2b",
            unicode: "&#xe774;"
        },
        iso: {
            value: "iso",
            color: "#00aa61",
            unicode: "&#xe774;"
        },
        gif: {
            value: "gif",
            color: "#00bca5",
            unicode: "&#xe774;"
        },
        apk: {
            value: "apk",
            color: "#7e2bd6",
            unicode: "&#xe774;"
        },
        bt: {
            value: "bt",
            color: "#db7a2a",
            unicode: "&#xe774;"
        },
        bmp: {
            value: "bmp",
            color: "#f7df00",
            unicode: "&#xe774;"
        },
        cad: {
            value: "cad",
            color: "#3eb6ff",
            unicode: "&#xe774;"
        },
        pdf: {
            value: "pdf",
            color: "#0c77c6",
            unicode: "&#xe774;"
        }
    };
    var supplement = function(arr, obj) {
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            map[item] = obj;
        }
    };
    supplement(word, {
        value: "word",
        color: "#14a9da",
        unicode: "&#xe774;"
    });
    supplement(excel, {
        value: "excel",
        color: "#45b058",
        unicode: "&#xe774;"
    });
    supplement(audio, {
        value: "audio",
        color: "#379fd3",
        unicode: "&#xe774;"
    });
    supplement(video, {
        value: "video",
        color: "#8e4c9e",
        unicode: "&#xe774;"
    });
    return function(type) {
        if (!type) {
            type = "defaultKey";
        }
        var item = map[type] ? map[type] : map["defaultKey"];
        var value = item.value;
        var color = item.color;
        var unicode = item.unicode;
        return (
            '<span class="td-iconfont td-icon-' +
            value +
            '" style="color:' +
            color +
            '"></span>'
        );
    };
})();
var createTab = top.createTab;
var openURL = top.openURL;
var bindListItemEvent = function(el, obj, cb) {
    el.find("li").click(function(e) {
        var item = obj[$(this).attr("val")];
        var text = item.text;
        var url = item.url;
        var value = item.value;
        var fn =
            cb ||
            function() {
                if (url) {
                    if (item.isApply) {
                        openURL(value, text, url);
                    } else {
                        createTab(value, text, url, "");
                    }
                }
            };
        fn(e, item);
    });
};
(function() {
    var List = function(el, opts, type) {
        this.init(el, opts, type);
    };
    function viewMore(item) {
        var myleft = (screen.availWidth - 780) / 2;
        var mytop = 100;
        var mywidth = 780;
        var myheight = 500;
        window.open(
            item.subject_url,
            "read_notify" + item.id,
            "height=" +
                myheight +
                ",width=" +
                mywidth +
                ",status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" +
                mytop +
                ",left=" +
                myleft +
                ",resizable=yes"
        );
    }
    List.prototype = {
        init: function(el, opts, type) {
            var data = opts.data;
            var nodes = "";
            var map = {};
            if (data.length) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    var click_count = item.click_count;
                    var comment_count = item.comment_count;
                    var time = item.time;
                    var text = item.subject;
                    var value = i;
                    item.type = type;
                    map[value] = item;
                    // 0 �Ѷ� 1 δ��
                    var readers = item.readers;
                    var readersStr = "";
                    if (readers) {
                        readersStr = '<div class="new-text">��</div>';
                    }
                    var clickCountNode = "";
                    var iconTitle = "�Ķ���";
                    if (click_count) {
                        // ����֪ͨû�е���� �������������������
                        clickCountNode =
                            '<div><div class="click_count-icon"><span class="td-iconfont td-icon-news_icon_check" title="�����"></span></div><div class="click_count-count" title="�����">' +
                            click_count;
                        iconTitle = "������";
                    }
                    var tmpDom =
                        '<div class="comment_count-icon"><span class="td-iconfont td-icon-news_icon_check" title="' +
                        iconTitle +
                        '"></span></div><div class="comment_count-count" title="' +
                        iconTitle +
                        '">' +
                        comment_count +
                        "</div>";
                    if (click_count) {
                        var tmpDom =
                            '<div class="comment_count-icon"><span class="td-iconfont td-icon-news_icon_comments" title="' +
                            iconTitle +
                            '"></span></div><div class="comment_count-count" title="' +
                            iconTitle +
                            '">' +
                            comment_count +
                            "</div>";
                    }
                    var liNode =
                        "<li val=" +
                        value +
                        ' class="clearfix"><div class="list-text ellipsis">' +
                        readersStr +
                        text +
                        clickCountNode +
                        "</div>" +
                        tmpDom +
                        '<div class="time">' +
                        time +
                        "</div></li>";
                    nodes += liNode;
                }
                nodes = '<ul class="clearfix list">' + nodes + "</ul>";
                el.append(nodes);
                bindListItemEvent(el, map, function(e, item) {
                    var className = e.target.className;
                    if (
                        className.indexOf("list-text") > -1 ||
                        className.indexOf("iconnews_icon_comments") > -1 ||
                        className.indexOf("comment_count-count") > -1
                    ) {
                        viewMore(item);
                    }
                });
            } else {
                el.append('<ul class="clearfix list">' + emptyStr + "</ul>");
            }
        }
    };
    window.List = List;
})();
(function() {
    var HomeTitle = function(el, opts) {
        this.init(el, opts);
    };
    HomeTitle.prototype = {
        init: function(el, opts) {
            var title = opts.title;
            var hasButton = opts.hasButton || false;
            var clickButton = opts.clickButton || function() {};
            var node;
            if (hasButton) {
                node =
                    '<div class="title">' +
                    otherButtonStr +
                    '<div class="title-text-wrap"><div class="text ellipsis">' +
                    title +
                    "</div></div></div>";
            } else {
                node =
                    '<div class="title"><div class="title-text-wrap"><div class="text ellipsis">' +
                    title +
                    "</div></div></div>";
            }
            el.append(node);
            if (hasButton) {
                this.bindEvent(el, clickButton, title);
            }
        },
        bindEvent: function(el, fn, title) {
            var otherButton = el.children(".title").children(".other-button");
            otherButton.attr("title", title);
            otherButton.click(function() {
                fn();
            });
        }
    };
    window.HomeTitle = HomeTitle;
})();
(function() {
    var HomeTabs = function(el, opts) {
        this.init(el, opts);
    };
    HomeTabs.prototype = {
        init: function(el, opts) {
            // var emptyValue = createEmpty();
            var defaultIndex = 0;
            var data = opts.data ? opts.data : [];
            var values = [];
            // var valueMap = {};
            var tabsNodes = "";
            var tabsContentNodes = "";
            for (var i = 0; i < data.length; i++) {
                var value = data[i].value;
                var text = data[i].text;
                var liNode = "";
                var liContentNode = "";
                if (i === defaultIndex) {
                    liNode = '<li class="tab active">' + text + "</li>";
                    liContentNode =
                        '<li class="tab-content active ' +
                        value +
                        '">' +
                        createEmpty(text) +
                        " </li>";
                } else {
                    liNode = '<li class="tab">' + text + "</li>";
                    liContentNode =
                        '<li class="tab-content ' +
                        value +
                        '">' +
                        createEmpty(text) +
                        " </li>";
                }
                values.push(value);
                // valueMap[value] = text;
                tabsNodes += liNode;
                tabsContentNodes += liContentNode;
            }
            tabsNodes = '<ul class="home-tabs">' + tabsNodes + "</ul>";
            tabsContentNodes =
                '<ul class="home-tabs-content">' + tabsContentNodes + "</ul>";
            el.append(tabsNodes + tabsContentNodes);
            this.bindEvent(el, opts, values);
        },
        bindEvent: function(el, opts, values) {
            var clickTab = opts.clickTab ? opts.clickTab : function() {};
            el.children(".home-tabs").click(function(e) {
                var target = e.target;
                if (target.className !== "home-tabs") {
                    $(target)
                        .addClass("active")
                        .siblings()
                        .removeClass("active");
                    var index = $(target).index();
                    $(target)
                        .parent()
                        .siblings()
                        .children()
                        .eq(index)
                        .addClass("active")
                        .siblings()
                        .removeClass("active");
                    clickTab(values[index]);
                }
            });
        }
    };
    window.HomeTabs = HomeTabs;
})();
// ����
(function() {
    var el = $("#apply");
    $.ajax({
        url: "/general/system/interface/homepage/data.php",
        data: {
            type: "getList"
        },
        success: function(res) {
            var response = JSON.parse(res);
            var title = response.homepage_name;
            var applyData = [];
            $.each(response.data, function(i, item) {
                var value = "apply-" + item.module_id;
                var text = item.module_name;
                var imgUrl = "";
                if (item.is_sys === "0") {
                    imgUrl = item.module_icon;
                } else {
                    imgUrl =
                        "./images/" + item.module_icon + "?" + Math.random();
                }
                var url = item.module_url;
                applyData.push({
                    value: value,
                    text: text,
                    imgUrl: imgUrl,
                    url: url,
                    isApply: true
                });
            });
            new HomeTitle(el, {
                title: title
            });
            var nodes = "";
            var map = {};
            for (var i = 0; i < applyData.length; i++) {
                var item = applyData[i];
                var text = item.text;
                var value = item.value;
                var imgUrl = item.imgUrl;
                map[value] = item;
                var liNode =
                    "<li val=" +
                    value +
                    '><div class="apply-img"><img src="' +
                    imgUrl +
                    '" alt="00"></div><div class="apply-text">' +
                    text +
                    "</div></li>";
                nodes += liNode;
            }
            nodes = "<ul>" + nodes + "</ul>";

            el.append(nodes);
            bindListItemEvent(el, map);
        }
    });

    // var applyData = [
    //     {
    //         value: "stationery",
    //         text: "�칫��Ʒ",
    //         icon: "stationery",
    //         url: "officeProduct/product_apply"
    //     },
    //     {
    //         value: "room",
    //         text: "��������",
    //         icon: "room",
    //         url: "meeting/myapply"
    //     },
    //     {
    //         value: "overtime",
    //         text: "�Ӱ�����",
    //         icon: "overtime",
    //         url: "/attendance/personal/overtime/new/"
    //     },
    //     {
    //         value: "leave",
    //         text: "�������",
    //         icon: "leave",
    //         url: "/attendance/personal/out/new/"
    //     },
    //     {
    //         value: "evection",
    //         text: "��������",
    //         icon: "evection",
    //         url: "/attendance/personal/evection/new/"
    //     },
    //     {
    //         value: "vacate",
    //         text: "�������",
    //         icon: "vacate",
    //         url: "/attendance/personal/leave/new/"
    //     }
    // ];
})();
// �����ʼ�
(function() {
    var emailData = [
        {
            value: "inbox",
            text: "�ռ���"
        },
        {
            value: "sentbox",
            text: "������"
        },
        {
            value: "outbox",
            text: "�ݸ���"
        }
    ];
    var el = $("#email");
    new HomeTabs(el.find(".card"), {
        data: emailData,
        clickTab: function(value) {
            fetchEmailData(value);
        }
    });
    el.find(".td-icon-mail_icon_email").click(function(e) {
        createTab("td-icon-mail_icon_email", "д�ʼ�", "email/new/", "");
    });
    el.find(".td-icon-pandianzhujiemian").click(function(e) {
        createTab("td-icon-pandianzhujiemian", "�����ʼ�", "email", "");
    });
    // �鿴�ʼ�����
    function checkDetail(activeTab, item) {
        var bodyid = item.bodyid;
        var emailid = item.emailid;
        // ɾ��δ����
        if (activeTab === "inbox") {
            var key = activeTab + bodyid;
            $('[val="' + key + '"]')
                .find(".read-flag")
                .removeClass("circle")
                .removeAttr("title");
        }
        if (activeTab != "outbox") {
            window.open(
                "/general/email/" +
                    activeTab +
                    "/read_email/read_email.php?BODY_ID=" +
                    bodyid +
                    "&EMAIL_ID=" +
                    emailid
            );
        } else {
            window.open(
                "/general/email/new/index.php?BODY_ID=" +
                    bodyid +
                    "&ASC_DESC=0&FROM=outbox"
            );
        }
    }
    // ת��
    function forwardOption(item) {
        var emailid = item.emailid;
        window.open("/general/email/new/?FW=1&BTN_CLOSE=1&EMAIL_ID=" + emailid);
    }
    //�ظ�
    function replyOption(item) {
        var emailid = item.emailid;
        window.open(
            "/general/email/new/?REPLAY=0&EMAIL_ID=" + emailid + "&BTN_CLOSE=1"
        );
    }
    //�ظ�ȫ��
    function replyallOption(item) {
        var emailid = item.emailid;
        window.open(
            "/general/email/new/?BTN_CLOSE=1&REPLAY=1&EMAIL_ID=" + emailid
        );
    }
    // �ٴη���
    function sendagainOption(item) {
        var emailid = item.emailid;
        window.open("/general/email/sentbox/resend.php?EMAIL_ID=" + emailid);
    }
    // �༭
    function editOption(item) {
        var bodyid = item.bodyid;
        window.open(
            "/general/email/new/index.php?BODY_ID=" +
                bodyid +
                "&ASC_DESC=0&FROM=outbox"
        );
    }
    var fetchEmailData = (function() {
        var loading = false;
        return function(type) {
            var el = $(".tab-content." + type);
            el.empty();
            if (loading) {
                el.html(loadingStr);
            } else {
                loading = true;
                $.ajax({
                    url: "/general/appbuilder/web/portal/homepage/getemail",
                    data: {
                        activeTab: type,
                        pagelimit: 7
                    },
                    success: function(response) {
                        loading = false;
                        var status = response.status ? response.status : null;
                        if (status) {
                            var data = response.data ? response.data : [];
                            if (data.length) {
                                var nodes = "";
                                var map = {};
                                for (var i = 0; i < data.length; i++) {
                                    var item = data[i];
                                    var user = item.user;
                                    var time = item.time;
                                    var title = item.title;
                                    var bodyid = item.bodyid;
                                    var iconNode = "";
                                    var key = type + bodyid;
                                    // �Ƿ��Ѷ� 1   ���Ѷ�     0   ��δ��
                                    var isRead = item.read_flag;
                                    map[key] = item;
                                    var readDom =
                                        '<div class="read-flag "><div class="radius"></div></div>';
                                    switch (type) {
                                        // �ռ���
                                        case "inbox":
                                            if (isRead === "0") {
                                                readDom =
                                                    '<div class="read-flag circle" title="δ��"><div class="radius"></div></div>';
                                            }
                                            iconNode =
                                                '<div class="container"><div class="icon1"><span class="td-iconfont td-icon-mail_icon_reply" title="�ظ�"></span></div><div class="icon2"><span class="td-iconfont td-icon-mail_icon_forwarding" title="ת��"></span></div></div>';
                                            break;
                                        // ������
                                        case "sentbox":
                                            iconNode =
                                                '<div class="container"><div class="icon1"><span class="td-iconfont td-icon-mail_icon_send" title="�ٴη���"></span></div><div class="icon2"><span class="td-iconfont td-icon-mail_icon_forwarding" title="ת��"></span></div></div>';
                                            break;
                                        // �ݸ���
                                        case "outbox":
                                            iconNode =
                                                '<div class="container"><div class="icon1"><span class="td-iconfont td-icon-mail_icon_compile" title="�༭"></span></div></div>';
                                            break;
                                        default:
                                            break;
                                    }

                                    var liNode =
                                        "<li val=" +
                                        key +
                                        ' class="content-list-item"><div class="left">' +
                                        readDom +
                                        '<div class="user">' +
                                        user +
                                        '</div></div><div class="right"><div class="time">' +
                                        time +
                                        "</div>" +
                                        iconNode +
                                        '</div><div class="center ellipsis">' +
                                        title +
                                        "</div></li>";
                                    nodes += liNode;
                                }
                                nodes =
                                    '<ul class="content-list">' +
                                    nodes +
                                    "</ul>";
                                el.html(nodes);
                                bindListItemEvent(el, map, function(e, item) {
                                    var targetClass = e.target.className;
                                    switch (type) {
                                        case "inbox":
                                            if (
                                                targetClass.indexOf("reply") >
                                                -1
                                            ) {
                                                replyOption(item);
                                                return;
                                            }
                                            if (
                                                targetClass.indexOf(
                                                    "forwarding"
                                                ) > -1
                                            ) {
                                                forwardOption(item);
                                                return;
                                            }

                                        case "sentbox":
                                            if (
                                                targetClass.indexOf("send") > -1
                                            ) {
                                                sendagainOption(item);
                                                return;
                                            }
                                            if (
                                                targetClass.indexOf(
                                                    "forwarding"
                                                ) > -1
                                            ) {
                                                forwardOption(item);
                                                return;
                                            }

                                        case "outbox":
                                            if (
                                                targetClass.indexOf("compile") >
                                                -1
                                            ) {
                                                editOption(item);
                                                return;
                                            }
                                        default:
                                            break;
                                    }
                                    checkDetail(type, item);
                                });
                            } else {
                                el.html(emptyStr);
                            }
                        }
                    },
                    error: function(response) {
                        loading = false;
                        el.html(emptyStr);
                    }
                });
            }
        };
    })();
    fetchEmailData(emailData[0].value);
})();
// ����
(function() {
    function GetDateStr(AddDayCount) {
        var dd = new Date();
        return dd.setDate(dd.getDate() + AddDayCount);
    }
    var mydate = new Date();
    var today = mydate.getDay(); //��ȡ�洢��ǰ����
    var weekday = [
        "������",
        "����һ",
        "���ڶ�",
        "������",
        "������",
        "������",
        "������"
    ];
    var tomorrow = new Date(GetDateStr(1)).getDay();
    var afterTomorrow = new Date(GetDateStr(2)).getDay();
    var hours = mydate.getHours();
    var minutes = mydate.getMinutes();
    var years = mydate.getFullYear();
    function getLocation(weatherCity) {
        var arr = weatherCity.split("_");
        var len = arr.length;
        return arr[len - 1];
    }
    function addZero(number) {
        if (number < 10) {
            number = "0" + number;
        }
        return number;
    }
    minutes = addZero(minutes);
    var location = getLocation(weatherCity);
    $.ajax({
        url: "/inc/weather.php",
        data: {
            WEATHER_CITY: weatherCity,
            UPDATE: 1,
            VIEW: "e"
        },
        success: function(response) {
            try {
                var data = JSON.parse(response);
                if (data && data.length) {
                    var nodeStr =
                        '<div class="today-time"><div class="top">' +
                        hours +
                        ":" +
                        minutes +
                        '</div><div class="bottom clearfix"><div class="day">' +
                        years +
                        "��" +
                        data[0].date +
                        '</div><div class="week">' +
                        weekday[today] +
                        '</div></div></div><div class="today-weather-wrap"><div class="today-weather"><div class="location clearfix"><div class="location-icon"><span class="td-iconfont td-icon-process_icon_location" ></span></div><div class="location-text">' +
                        location +
                        '</div></div><div class="weather-img"><img src="/static/images/weather/png/day/' +
                        addZero(parseInt(data[0].img1)) +
                        '.png" alt="00"></div><div class="temperature">' +
                        data[0].temperature +
                        '</div><div class="weather-text">' +
                        data[0].weather +
                        '</div></div></div><ul class="after-today-weather"><li><span>' +
                        weekday[tomorrow] +
                        '</span><span class="text-center">' +
                        data[1].temperature +
                        '</span><div class="after-today-weather-img"><img src="/static/images/weather/png/day/' +
                        addZero(parseInt(data[1].img1)) +
                        '.png" alt="00"></div></li><li><span>' +
                        weekday[afterTomorrow] +
                        '</span><span class="text-center">' +
                        data[2].temperature +
                        '</span><div class="after-today-weather-img"><img src="/static/images/weather/png/day/' +
                        addZero(parseInt(data[2].img1)) +
                        '.png" alt="00"></div></li></ul>';
                    $("#weather").append(nodeStr);
                    setInterval(timeView, 1000);
                }
            } catch (err) {}
        }
    });
    var timeView = function() {
        var curDate = new Date();
        var curHours = curDate.getHours();
        var curMinutes = addZero(curDate.getMinutes());
        $(".today-time .top").text(curHours + ":" + curMinutes);
    };
})();
// ������
(function() {
    var workflowData = [
        {
            value: "todo",
            text: "���칤��"
        },
        {
            value: "settles",
            text: "��Ṥ��"
        },
        {
            value: "data_all",
            text: "ȫ������"
        }
    ];
    var HomeTabs = window.HomeTabs;

    new HomeTabs($("#workflow .card"), {
        data: workflowData,
        clickTab: function(value) {
            fetchWorkflowData(value);
        }
    });
    var iconMap = {
        // �˻�
        isBack: {
            icon: "process_icon_refund",
            color: "7276b7",
            title: "�˻�"
        },
        // ����
        isUrgent: {
            icon: "process_icon_urgency",
            color: "e72a17",
            title: "����"
        },
        // ί��
        isDepute: {
            icon: "depute",
            color: "719b72",
            title: "ί��"
        }
    };
    var prcsFlagMap = {
        "1": {
            text: "δ����",
            color: "ff5e3a"
        },
        "2": {
            text: "������",
            color: "4680ff"
        },
        // "3": {
        //     text: "�Ѱ��",
        //     color: "e72a17"
        // },
        "4": {
            text: "�Ѱ��",
            color: "6fa71c"
        },
        // "5": {
        //     text: "δ����",
        //     color: "e72a17"
        // },
        "6": {
            text: "�ѹ���",
            color: "a20000"
        },
        "7": {
            text: "������",
            color: "f89200"
        },
        "8": {
            text: "�ѽ���",
            color: "56423c"
        }
    };

    $("#workflow .other-button span").click(function(e) {
        createTab(301, "�ҵĹ���", "approve_center/list", "");
    });
    var fetchWorkflowData = function(type) {
        var el = $(".tab-content." + type);
        el.empty();
        $.ajax({
            url: "/general/appbuilder/web/portal/workflow/getdata",
            data: {
                activeTab: type,
                curNum: 1,
                pageLimit: 4
            },
            success: function(response) {
                var data = response.data ? response.data : [];
                if (data.length) {
                    var nodes = "";
                    var map = {};
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
                        // ��ˮ��
                        var runId = item.runId;
                        // ������
                        var runName = item.runName;
                        // ������Ա
                        var userName = item.userName;
                        // ����ʱ��
                        var prcsTime = item.prcsTime;
                        // ��ǰ����
                        var prcsId = item.prcsId;
                        // ����״̬
                        var prcsFlag = item.prcsFlag;
                        // ͷ���ַ
                        var avatarPath = item.avatarPath;
                        // ��������
                        var prcsName = item.prcsName;
                        var prcsNameVal = "��" + prcsId + "��:" + prcsName;
                        // �˻ر�ʶ
                        // var isBack = item.isBack;
                        // ������ʶ
                        // var isUrgent = item.isUrgent;
                        // ί�б�ʶ
                        // var isDepute = item.isDepute;
                        // �߰��ʶ
                        // var isRemind = item.isRemind;

                        var obj = prcsFlagMap[prcsFlag];
                        var prcsNode = "";
                        if (obj) {
                            prcsNode =
                                '<div class="deal deal1" style="background-color:#' +
                                obj.color +
                                '">' +
                                obj.text +
                                "</div>";
                        }
                        item.text = runName;
                        var key = type + i;
                        item.value = key;
                        map[key] = item;
                        var iconWrap = "";
                        var arr = ["isUrgent", "isDepute", "isBack"];
                        for (var j = 0; j < arr.length; j++) {
                            var jItem = arr[j];
                            if (item[jItem]) {
                                iconWrap +=
                                    '<span style="color:#' +
                                    iconMap[jItem].color +
                                    '" class="td-iconfont td-icon-' +
                                    iconMap[jItem].icon +
                                    '" title="' +
                                    iconMap[jItem].title +
                                    '"></span>';
                            }
                        }
                        if (iconWrap) {
                            iconWrap =
                                '<div class="icon-wrap">' + iconWrap + "</div>";
                        }
                        var timeDom = "";
                        if (prcsFlag !== "1") {
                            timeDom =
                                '<div class="time">' + prcsTime + "</div>";
                        }
                        var liNode =
                            '<li class="content-list-item" val=' +
                            key +
                            '><div class="img-wrap"><img src="' +
                            avatarPath +
                            '" alt="00"></div><div class="right-content clearfix"><div class="title ellipsis"><div class="flow-number">' +
                            runId +
                            '</div><div class="flow-title ellipsis"> <span class="flow-title-text ellipsis" title="' +
                            runName +
                            '">' +
                            runName +
                            "</span>" +
                            iconWrap +
                            '</div></div><div class="text ellipsis"><div class="name">' +
                            userName +
                            "</div>" +
                            timeDom +
                            '<div class="step  ellipsis" title="' +
                            prcsNameVal +
                            '">' +
                            prcsNameVal +
                            "</div>" +
                            prcsNode +
                            "</div></div></li>";
                        nodes += liNode;
                    }
                    nodes = '<ul class="content-list">' + nodes + "</ul>";
                    el.html(nodes);
                    bindListItemEvent(el, map);
                } else {
                    el.html(emptyStr);
                }
            },
            error: function(response) {
                el.html(emptyStr);
            }
        });
    };
    fetchWorkflowData(workflowData[0].value);
})();
// ���˿���
(function() {})();
// �����ļ���
(function() {
    var el = $("#filefolder .card");
    new HomeTitle(el, {
        title: "�����ļ���",
        hasButton: true,
        clickButton: function() {
            createTab("filefolder", "�����ļ���", "knowledge_management", "");
        }
    });
    var fetchFilefolder = function() {
        $.ajax({
            url: "/general/appbuilder/web/portal/homepage/getfilefolder",
            data: {
                pagelimit: 100
            },
            success: function(response) {
                var status = response.status ? response.status : null;
                if (status) {
                    var data = response.data ? response.data : [];
                    var nodes = "";
                    if (data.length) {
                        var map = {};
                        for (var i = 0; i < data.length; i++) {
                            var item = data[i];
                            var type = item.type;
                            var text = item.subject;
                            var value = item.id;
                            item.value = value;
                            item.url = item.subject_url;
                            map[value] = item;
                            item.text = text;
                            var liNode =
                                "<li val=" +
                                value +
                                ">" +
                                createFolderIcon(type) +
                                '<div class="filefolder-text ellipsis" title="' +
                                text +
                                '">' +
                                text +
                                "</div></li>";
                            nodes += liNode;
                        }
                        nodes = '<ul class="clearfix">' + nodes + "</ul>";
                        el.append(nodes);
                        bindListItemEvent(el, map);
                    } else {
                        nodes = '<ul class="clearfix">' + emptyStr + "</ul>";
                        el.append(nodes);
                    }
                }
            }
        });
    };
    fetchFilefolder();
})();
// ����
(function() {
    var el = $("#common");
    new HomeTitle(el, {
        title: "����"
    });
    var common = [
        {
            text: "������ѯ",
            value: "querywork",
            url: "/approve_center/query/"
        },
        {
            text: "������־",
            value: "worklog",
            url: "/diary/"
        },
        {
            text: "�ճ̰���",
            value: "schedule",
            url: "/calendarArrange"
        },
        {
            text: "ͶƱ",
            value: "vote",
            url: "/vote/show/current.php"
        },
        {
            text: "�����ļ���",
            value: "filefolder",
            url: "/knowledge_management"
        }
    ];
    var nodes = "";
    var map = {};
    for (var i = 0; i < common.length; i++) {
        var item = common[i];
        var text = item.text;
        var value = item.value;
        var url = item.url;
        map[value] = item;
        var liNode =
            "<li val=" +
            value +
            '><div class="img-wrap ie8"><i class="radius"></i> <div class="img ie8-img"><img src="./images/' +
            value +
            '.png" alt="00"></div></div><div class="common-text ellipsis">' +
            text +
            "</div></li>";
        nodes += liNode;
    }
    nodes = '<ul class="clearfix">' + nodes + "</ul>";
    el.append(nodes);
    bindListItemEvent(el, map);
    // el.find("li").click(function() {
    //     var item = map[$(this).attr("val")];
    //     var text = item.text;
    //     var url = item.url;
    //     createTab(1, text, url, "");
    // });
})();
// ����
(function() {
    var el = $("#news .card");
    new HomeTitle(el, {
        title: "����",
        hasButton: true,
        clickButton: function() {
            createTab("news", "����", "news/show/news.php", "");
        }
    });
    var type = "news";
    var fetchNews = function() {
        $.ajax({
            url: "/general/appbuilder/web/portal/homepage/getnews",
            data: {
                pagelimit: 4
            },
            success: function(response) {
                var status = response.status ? response.status : null;
                if (status) {
                    var data = response.data ? response.data : [];
                    new List(
                        el,
                        {
                            data: data
                        },
                        type
                    );
                }
            }
        });
    };
    fetchNews();
})();
// ����֪ͨ
(function() {
    var el = $("#notify");
    new HomeTitle(el, {
        title: "����֪ͨ",
        hasButton: true,
        clickButton: function() {
            createTab("notify", "����֪ͨ", "notify/show/new.php", "");
        }
    });
    var type = "notify";
    var fetchNotify = function() {
        $.ajax({
            url: "/general/appbuilder/web/portal/homepage/getnotify",
            data: {
                pagelimit: 4
            },
            success: function(response) {
                var status = response.status ? response.status : null;
                if (status) {
                    var data = response.data ? response.data : [];
                    new List(
                        el,
                        {
                            data: data
                        },
                        type
                    );
                }
            }
        });
    };
    fetchNotify();
})();
(function() {
    var el = $("#schedule");
    new DatePicker(el);
    el.find(".other-button").click(function(e) {
        createTab("schedule", "�ճ̰���", "calendarArrange", "");
    });
})();
var changeTheme = function(theme) {
    // ����theme-ǰ׺��ֹ��style.css�е� .red ����ʽ��ͻ
    var nextTheme = "theme-" + theme;
    var rootEl = $(".home-contanier");
    var prevClassName = rootEl[0].className;
    var preTheme = prevClassName.split(" ")[1];
    if (preTheme !== nextTheme) {
        rootEl.removeClass(preTheme).addClass(nextTheme);
    }
};
window.CHANGETHEME = changeTheme;
$(document).ready(function() {
    if (window && window.external && window.external.OA_SMS) {
        window.external.OA_SMS("", "", "SET_MAX");
    }
});
