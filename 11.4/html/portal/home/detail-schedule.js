var colorBlocks = {
    "#005E4b": "#d9e7e4",
    "#1b648e": "#dde8ee",
    "#56423c": "#e6e3e2",
    "#7c3dff": "#ebe4ff",
    "#028992": "#d9edef",
    "#3c4db1": "#e2e5f3",
    "#ff5e3a": "#ffe7e2",
    "#f89200": "#feefd9",
    "#4680ff": "#e3ecff",
    "#6fa71c": "#eaf2dd",
    "#fc6180": "#ffe7ec",
    "#a20000": "#f1d9d9"
};
var stateMap = {
    "1": {
        color: "#2077ff",
        text: "进行中",
        icon: "schedule_icon_ongoing"
    },
    "3": {
        color: "#009944",
        text: "已结束",
        icon: "schedule_icon_complete"
    },
    // "3": "已超时",
    // "0": "未开始",
    "0": {
        color: "#9b9b9b",
        text: "未开始",
        icon: "schedule_icon_pending"
    }
};
var importantIcon =
    '<span class="td-important" title="重要">重要</span>';
var urgentIcon =
    '<span class="td-urgent" title="紧急">紧急</span>';
var cal_levelMap = {
    // 1-紧急重要
    "1": importantIcon + urgentIcon,
    // 2-重要/不紧急
    "2": importantIcon,
    // 3-不重要/紧急
    "3": urgentIcon,
    // 2-重要/不紧急
    "4": ""
};
var createDetailSchedule = function(dayday, dataMap) {
    var arr = [];
    $.each(dataMap, function(key, item) {
        var startTimeStamp = item.startTimeStamp;
        var startHms = item.startHms;
        var endTimeStamp = item.endTimeStamp;
        if (dayday >= startTimeStamp && dayday <= endTimeStamp) {
            item.timeStamp = format(startTimeStamp, startHms);
            // if (arr.length < 3) {
            arr.push(item);
            // }
        }
    });
    var result = arr.sort(compareNumbers);
    var nodes = "";
    $.each(result, function(key, item) {
        nodes += toNodeStr(item);
    });
    return nodes;
};
var toNodeStr = function(item) {
    var colorstr = item.color ? item.color : "color_3c4db1";
    var color = colorstr.split("_")[1];
    var state_type = item.state_type;
    var iconWrap = "";
    if (stateMap[state_type]) {
        var state = stateMap[state_type];
        iconWrap =
            '<div class="icon-wrap"><span style="color:' +
            state.color +
            '" class="td-iconfont td-icon-' +
            state.icon +
            '"></span><div class="content-item-text">' +
            state.text +
            "</div></div>";
    }
    var start = item.start;
    var end = item.end;
    var title = item.title;
    var fontColor = "#" + color;
    var bgColor = colorBlocks[fontColor];
    var cal_level = item.cal_level;
    var tmp = "";
    if (cal_level) {
        tmp = cal_levelMap[cal_level];
        if (!tmp) {
            tmp = "";
        }
    }

    var liNode =
        '<li class="content-item"><div class="content-item-time"><span class="td-iconfont td-icon-schedule_icon_time" ></span><span class="start-time">' +
        start +
        '</span>至<span class="end-time">' +
        end +
        '</span></div><div class="content-item-info"><div class="content-item-title ellipsis" style="background:' +
        bgColor +
        '"><i style="background:' +
        fontColor +
        '"></i><div class="content-item-text-wrap"> ' +
        tmp +
        '<div class="content-item-title-text ellipsis" style="color:' +
        fontColor +
        '" title="' +
        title +
        '">' +
        title +
        "</div></div></div>" +
        iconWrap +
        "</div></li>";

    return liNode;
};
var compareNumbers = function(a, b) {
    return a.timeStamp - b.timeStamp;
};

var format = function(ymd, hms) {
    // 格式化yyyy-mm-dd hh:mm:ss
    var ymdArr = parseIntNumberInArr(ymd.split("-"));
    var hmsArr = parseIntNumberInArr(hms.split(":"));
    var num = new Date(
        ymdArr[0],
        ymdArr[1] - 1,
        ymdArr[2],
        hmsArr[0],
        hmsArr[1],
        hmsArr[2]
    ).getTime();
    return num;
};
var parseIntNumberInArr = function(array) {
    var tmpArr = [];
    $.each(array, function(index, item) {
        tmpArr.push(parseInt(item, 10));
    });
    return tmpArr;
};

window.createDetailSchedule = createDetailSchedule;
