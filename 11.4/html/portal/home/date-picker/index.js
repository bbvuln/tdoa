(function() {
    var DATE = new Date();
    var YEAR = DATE.getFullYear();
    var MONTH = DATE.getMonth() + 1;
    var DAY = DATE.getDate();
    var WEEKTABLE = {
        common: {
            cn: [
                "星期日",
                "星期一",
                "星期二",
                "星期三",
                "星期四",
                "星期五",
                "星期六"
            ],
            cns: ["日", "一", "二", "三", "四", "五", "六"],
            en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        }
    };
    //修正年月
    function fixedYM(year, month) {
        if (+month === 0) {
            year = +year - 1;
            month = 12;
        }

        if (+month === 13) {
            year = +year + 1;
            month = 1;
        }
        return [year, month];
    }
    //获取某年某月有多少天
    function getMonthDays(year, month) {
        var YM = fixedYM(year, month);
        return new Date(YM[0], YM[1], 0).getDate();
    }
    //返回某年某月某日是星期几
    function getWeekday(year, month, day) {
        var YM = fixedYM(year, month);
        return new Date(YM[0], YM[1] - 1, day).getDay();
    }
    //获取某年某月的具体天数的排列顺序
    function getMonthDaysArray(year, month, day, dataMap) {
        dataMap = dataMap || {};
        if (typeof day === "undefined" && year === YEAR && month === MONTH)
            day = DAY;
        var dayArrays = [];
        var days = getMonthDays(year, month),
            preDays = getMonthDays(year, month - 1);
        var thisMonthFirstDayInWeek = getWeekday(year, month, 1),
            thisMonthLastDayInWeek = getWeekday(year, month, days);
        var thisMonthAllDays =
            thisMonthFirstDayInWeek + days + 6 - thisMonthLastDayInWeek;
        //上月在当月日历面板中的排列
        for (var i = 0; i < thisMonthFirstDayInWeek; i++) {
            dayArrays.push({
                dayNum: preDays - thisMonthFirstDayInWeek + i + 1,
                weekDay: WEEKTABLE.common.cn[i]
            });
        }
        //当月日历面板中的排列
        for (var i = 1; i <= days; i++) {
            var weekDayFlag = (thisMonthFirstDayInWeek + i - 1) % 7;
            var monthStr = "";
            if (month < 10) {
                monthStr = "0" + month;
            } else {
                monthStr += month;
            }
            var dayStr = "";
            if (i < 10) {
                dayStr = "0" + i;
            } else {
                dayStr += i;
            }
            var dayday = year + "-" + monthStr + "-" + dayStr;
            var hasShow = false;
            $.each(dataMap, function(key, value) {
                if (!hasShow) {
                    if (
                        dayday >= value.startTimeStamp &&
                        dayday <= value.endTimeStamp
                    ) {
                        hasShow = true;
                    }
                }
            });
            dayArrays.push({
                dayNum: i,
                weekDay: WEEKTABLE.common.cn[weekDayFlag],
                selected: i === +day,
                isThisMonth: true,
                hasShow: hasShow,
                dayday: dayday
            });
        }
        //下月在当月日历面板中的排列
        for (var i = 1; i <= 6 - thisMonthLastDayInWeek; i++) {
            var weekDayFlag = (thisMonthFirstDayInWeek + days + i - 1) % 7;
            dayArrays.push({
                dayNum: i,
                weekDay: WEEKTABLE.common.cn[weekDayFlag]
            });
        }
        var dayNodes = "";
        for (var i = 0; i < dayArrays.length; i++) {
            var item = dayArrays[i];
            var isThisMonth = item.isThisMonth;
            var dayNum = item.dayNum;
            var hasShow = item.hasShow;
            var dayday = item.dayday;
            var showStr = "";
            if (hasShow) {
                showStr += '<div class="show-flag"></div>';
            }
            if (isThisMonth) {
                if (DAY === dayNum && year === YEAR && MONTH === month) {
                    dayNodes +=
                        "<span  val=" +
                        dayday +
                        " hasShow=" +
                        hasShow +
                        ' class="vui-datePicker-selected-day vui-datePicker-this-month">' +
                        dayNum +
                        showStr +
                        "</span>";
                } else {
                    dayNodes +=
                        "<span val=" +
                        dayday +
                        " hasShow=" +
                        hasShow +
                        ' class="vui-datePicker-this-month">' +
                        dayNum +
                        showStr +
                        "</span>";
                }
            } else {
                dayNodes +=
                    '<span class="vui-datePicker-not-this-month">' +
                    dayNum +
                    "</span>";
            }
        }
        return dayNodes;
    }

    var DatePicker = function(el, opts) {
        this.curYear = YEAR;
        this.curMonth = MONTH;
        this.dataMap = {};
        this.init(el);
    };
    DatePicker.prototype = {
        init: function(el) {
            var dayNodes = getMonthDaysArray(this.curYear, this.curMonth);
            var nodes =
                '<div class="vui-datePicker-panel-warp " ><div class="vui-datePicker-change"><p class="vui-datePicker-header"> <label class="vui-datePicker-year">' +
                this.curYear +
                '</label> <span class="vui-datePicker-change-btn pre"><span class="td-iconfont td-icon-schedule_icon_left" ></span></span><label class="vui-datePicker-month">' +
                this.curMonth +
                '月</label> <span class="vui-datePicker-change-btn next"><span class="td-iconfont td-icon-schedule_icon_right" ></span></span></p><div class="other-button"><span class="td-iconfont td-icon-pandianzhujiemian" title="日程安排"></span></div> </div> <div class="vui-datePicker-days"><p class="vui-datePicker-weekday-box"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></p> <div class="vui-datePicker-day-box">' +
                dayNodes +
                "</div></div></div>";
            el.append(nodes);
            this.bindEvnt(el);
            this.getcallist(this.curYear, this.curMonth, el);
            el.find(".td-icon-schedule_icon_return").click(function(e) {
                $(".vui-datePicker-panel-warp").show();
                $(".detail-schedule").hide();
                $(".detail-schedule-content").empty();
            });
        },
        getcallist: function(year, month, el) {
            var me = this;
            var nextYear = year;
            var nextMonth = month + 1;
            if (nextMonth === 13) {
                nextYear = year + 1;
                nextMonth = 1;
            }
            var starttime = new Date(year, month - 1, 1).getTime() / 1000;
            var endtime = new Date(nextYear, nextMonth - 1, 1).getTime() / 1000;
            $.ajax({
                method: "POST",
                url: "/general/appbuilder/web/calendar/calendarlist/getcallist",
                data: {
                    starttime: starttime,
                    endtime: endtime,
                    view: "month",
                    condition: "1"
                },
                success: function(response) {
                    var status = response.status ? response.status : null;
                    if (status) {
                        var data = response.data ? response.data : [];
                        $.each(data, function(key, value) {
                            var start = value.start;
                            var end = value.end;
                            var startArr = start.split(" ");
                            var endArr = end.split(" ");
                            value.startTimeStamp = startArr[0];
                            value.endTimeStamp = endArr[0];
                            value.startHms = startArr[1];
                            value.endHms = endArr[1];
                        });
                        me.dataMap = data;
                        me.update(el);
                    }
                }
            });
        },
        bindEvnt: function(el) {
            var me = this;
            el.find(".pre").click(function() {
                me.changeMonth(el, me.curYear, me.curMonth, -1);
            });
            el.find(".next").click(function() {
                me.changeMonth(el, me.curYear, me.curMonth, 1);
            });
        },
        //切换上一月（val=-1），下一月（val=1）
        changeMonth: function(el, year, month, val) {
            month = month + val;
            if (!month) {
                year = year - 1;
                month = 12;
            }
            if (month === 13) {
                year = year + 1;
                month = 1;
            }
            this.curMonth = month;
            this.curYear = year;
            this.getcallist(this.curYear, this.curMonth, el);
        },
        update: function(el) {
            var dataMap = this.dataMap;
            el.find(".vui-datePicker-year").html(this.curYear);
            el.find(".vui-datePicker-month").html(this.curMonth + "月");
            var dayNodes = getMonthDaysArray(
                this.curYear,
                this.curMonth,
                undefined,
                dataMap
            );
            var dataMap = this.dataMap;
            el.find(".vui-datePicker-day-box").html(dayNodes);
            el.find(".vui-datePicker-this-month").click(function(e) {
                var hasShow = $(this).attr("hasShow");
                if (hasShow === "true") {
                    var val = $(this).attr("val");
                    $(".vui-datePicker-panel-warp").hide();
                    $(".detail-schedule").show();
                    var contentNode = createDetailSchedule(val, dataMap);
                    $(".detail-schedule-content").append(contentNode);
                }
            });
        }
    };
    window.DatePicker = DatePicker;
})();
