/**
 * 预订者组
 * @param cfg
 * @returns {___anonymous2548_2821}
 */
function WeekBooker2(cfg) {
  var opts = {
    line: 0,
    //开始时间(单位分钟)
    start: 0 * 60,
    //持续时间
    limit: 24 * 60 + 1,
    distance: 5,
    //width: 9 * 60 / 5 * 10,
    renderTo: '',
    occupied: [],
    //每分钟像素数
    ppm: 2,
    //事件
    update: $.noop,
    day: "2012-04-04",
    //创建新会议的事件
    oncreate: $.noop,
    name: "会议室",
    //一个会议室的天数
    date: [],
    //创建之前的事件,当return false的时候不允许创建会议
    beforecreate: $.noop
  }
  var c = $.extend(true, opts, cfg);
  
  var height = c.date.length * 50;
  var el = $("<div class='week-booker'></div>").height(height);
  var axis = $("<div class='axis-y-date'></div>").height(height);
  var name = $("<div class='axis-y-name'></div>").html("<span>" + c.name || '' + "</span>").height(height);
  var table = $("<table></table>").appendTo(c.renderTo);
  
  table.append($("<tbody></tbody>")
      .append($("<tr></tr>")
          //.append($("<td></td>").append(name))
          //.append($("<td></td>").append(axis))
          .append($("<td></td>").append(el))));
  
  var helper = $("<div class='drag-helper'></div>");
  function doDragHelper() {
    helper.clientX = 0, helper.clientY = 0;
    el.mousedown(function(e) {
      helper.appendTo('body');
      helper.width(0).height(0).show();
      helper.clientX = e.clientX;
      helper.clientY = e.clientY;
      helper.css({
        left: e.clientX + "px",
        top: e.clientY + "px"
      });
    }).bind("mousemove", function(evt) {
      if (helper.clientX > 0 && helper.clientY > 0) {
        helper.css({
          left: Math.min(evt.clientX, helper.clientX) + "px",
          top: Math.min(evt.clientY, helper.clientY) + "px"
        });
        helper.width(Math.abs(evt.clientX - helper.clientX)).height(Math.abs(evt.clientY - helper.clientY));
      }
    }).bind("mouseup mouseleave", function(evt) {
      helper.hide();
      helper.clientX = 0, helper.clientY = 0;
    });
  }
  doDragHelper();
  
  var bookers = [];
  //根据天数生成对应的booker对象
  $.each(c.date, function(i, e) {
    axis.append("<div class='item " + (i % 2 ? "odd" : "even") + "'>" + (e.date || e) + "</div>");
    var booker = new Booker2({
      renderTo: el,
      line: i,
      day: e.date || e,
      status: e.status || 0,
      distance: c.distance,
      oncreate: c.oncreate,
      beforecreate: c.beforecreate,
      update: function(id, start, limit) {
        c.update(id, start, limit);
      },
      start: c.start,
      limit: c.limit
    });
    bookers.push(booker);
  });
  $("<div class='meeting-sp'></div>").appendTo(c.renderTo);
  
  return {
    //获取内部的booker对象
    bookers: bookers,
    //判断会议是否时间冲突,返回boolean
    crowd: function() {
      for (var i in bookers) {
        b = bookers[i];
        if (b && b.crowd && b.crowd()) {
          return true;
        }
      }
      return false;
    }
  }
}

/**
 * 预订者类
 * @param cfg
 * @returns
 */
function Booker2(cfg) {
  var opts = {
    line: 0,
    start: 0 * 60,
    limit: 24 * 60 + 1,
    distance: 5,
    //width: 9 * 60 / 5 * 10,
    renderTo: '',
    day: "2012-04-04",
    occupied: [],
    ppm: 2,
    update: $.noop,
    status: 0,
    id: "",
    oncreate: $.noop,
    beforecreate: $.noop
  }
  var c = $.extend(true, opts, cfg);
  c.width = c.limit * c.ppm;
  var meetings = [];
  var el = $("<div class='container'>").addClass(c.line % 2 ? "odd" : "even").css({width: c.width});
  el.addClass("status-" + c.status);
  var distance = (c.ppm * c.distance) ^ 0;
  c.renderTo && el.appendTo(c.renderTo);
  
  /**
   * 判断是否有冲突,时间段是否有交叉
   */
  function crowd() {
    var flag = false;
    $.each(meetings, function(k, v) {
      var s = v.getStart();
      var l = v.getLimit();
      $.each(meetings, function(j, o) {
        if (j == k) {
          return;
        }
        var s1 = o.getStart();
        var l1 = o.getLimit()
        if ((s <= s1 && s + l > s1) || (s1 <= s && s1 + l1 > s)) {
          flag = true;
        }
      });
    });
    return flag;
  }
  
  function add(meeting) {
    var me = meeting.el;
    var s = Math.floor(meeting.getStart() - c.start);
    var l = Math.floor(meeting.getLimit() * c.width / c.limit);
    el.append(me);
    meetings.push(meeting);
    meeting.el.bind("_remove", function() {
      meetings = $.grep(meetings, function(e, i) {
        return e != meeting;
      });
    });
    function doCollision() {
      
    }
    me.css({
      position: "absolute",
      left: (c.ppm * s) + "px",
      width: l + "px"
    });
    
    //退拽和充值大小
    meeting.disabled || me.resizable({
      containment: ".week-booker",
      handles: "w,e",
      grid: c.distance * c.ppm,
      //拖拽时更新会议时间
      resize: function() {
        meeting.refreshTimes(c.start);
      },
      minWidth: c.distance * c.ppm,
      //退拽结束的事件
      stop: function(e) {
        meeting.refreshTimes(c.start);
        //提供给外部的事件
        c.update(c.line, meeting.getStart(), meeting.getLimit());
        if (crowd()) {
          alert("会议时间有冲突")
        }
      }
    }).draggable({
      containment: ".container",
      axis: "x",
      grid: [c.distance * c.ppm, 10],
      start: function(e) {
        
      },
      //拖拽时更新会议时间
      drag: function() {
        meeting.refreshTimes(c.start);
      },
      stop: function() {
        meeting.refreshTimes(c.start);
        c.update(c.line, meeting.getStart(), meeting.getLimit());
        if (crowd()) {
          alert("会议时间有冲突")
        }
      }
    }).mousedown(function() {
      return false;
    });
  }
  
  function doMouseEvt() {
    var cancel = false;
    el.dblclick(function() {
      Booker.newMeeting && Booker.newMeeting.remove();
    }).mousedown(function(e) {
      cancel = false;
      e = e || window.event;
      var start = e.offsetX || e.layerX;
      if ((e.srcElement || e.target) != el[0]) {
        return;
      }
      el.one("mouseup", function(evt) {
        evt = evt || window.event;
        if (cancel) {
          return true;
        }
        var end = evt.offsetX || evt.layerX;
        var len = Math.abs(end - start);
        if (c.beforecreate(c.line) === false) {
          return false;
        }
        Booker.newMeeting && Booker.newMeeting.remove();
        var limit;
        var st = c.start + Math.floor(Math.min(start, end) / distance) * c.distance;
        if (Math.floor(Math.min(start, end) / distance) < Math.round(Math.min(start, end) / distance)) {
          limit = (Math.ceil((len + 30)/ distance)) * c.distance
        }
        else {
          limit = (Math.ceil(len / distance)) * c.distance;
        }
        if (limit < 30) {
          limit = 30;
        }
        Booker.newMeeting = new Meeting2({
          content: "待预约",
          start: st,
          limit: limit,
          ppm: 2,
          day: c.day && c.day.replace(/\(\W\W\)/, ""),
          status: 4,
          onclick: function(e, id, s, l) {
          }
        });
        Booker.newMeeting.el.addClass("active");
        add(Booker.newMeeting);
        c.oncreate(c.line, st, limit);
        evt.preventDefault();
      });
      e.preventDefault();
    }).mousemove(function(evt) {
      if ((evt.srcElement || evt.target) != el[0]) {
        cancel = true;
      }
    });
  }
  
  doMouseEvt();
  
  return {
    add: add,
    id: c.id,
    el: el,
    crowd: crowd
  }
}

/**
 * 会议室类
 * @param cfg
 * @returns
 */
function Meeting2(cfg) {
  var opts = {
    data: "",
    //开始时间(单位分钟)
    start: 10 * 60,
    //持续时间(单位分钟)
    limit: 11 * 60,
    //会议内容
    content: "",
    //每分钟的像素数
    ppm: 2,
    status: 0,
    day: "2012-04-04",
    onclick: $.noop,
    id: "new",
    statusInfo: [{
      text: "待批准",
      cls: "status0"
    }, {
      text: "已批准",
      cls: "status1"
    }, {
      text: "进行中",
      cls: "status2"
    }, {
      text: "已结束",
      cls: "status3"
    }, {
      text: "待预约",
      cls: ""
    }]
  }
  
  var c = $.extend(true, opts, cfg);
  var el = $("<div class='meeting' style='overflow:hidden'></div>");
  var table = $("<table></table>");
  var tbody = $("<tbody></tbody>");
  var tr = $("<tr></tr>");
  var tdl = $("<td class='start-time'></td>");
  var tdc = $("<td></td>");
  var tdr = $("<td class='end-time'></td>");
  var disabled = c.disabled;
  disabled && el.addClass("disabled");
  var times = $("<p class='time-info'></p>");
  var content = $("<p class='content'></p>").text(c.content);
  var status = c.statusInfo.length > c.status ? c.statusInfo[c.status] : {};
  
  el.removeAttr("title");
  el.attr("title",c.content+"\n"+mins2Time(c.start)+"-"+mins2Time(c.start+c.limit)+ "(" + ((c.limit / 6) ^ 0) / 10 + "H)");
  el.addClass(status.cls)
  .append(table
      .append(tbody
          .append(tr
              .append(tdl)
              .append(tdc)
              .append(tdr))));
  tdc.append(content).append(times);
  if (c.limit >= 120) {
    el.addClass("long");
  }
  
  //初始化时间显示
  function doTimes() {
    tdl.html("<p class='date'>" + c.day + "</p><p class='time'>" + mins2Time(c.start) + "</p>");
    tdr.html("<p class='date'>" + c.day + "</p><p class='time'>" + mins2Time(c.start + c.limit) + "</p>");
    if (c.status >= 4) {
      times.text(((c.limit / 6) ^ 0) / 10 + "H");
    }
    else {
      times.text(mins2Time(c.start) + "-" + mins2Time(c.start + c.limit) + "(" + ((c.limit / 6) ^ 0) / 10 + "H)");
    }
    //times.text(((c.limit / 6) ^ 0) / 10 + "H");
  }
  
  //分钟转化为时间的方法
  function mins2Time(i) {
    var h = (i / 60 ) ^ 0;
    var m = (i % 60) ^ 0;
    m = m < 10 ? "0" + m : m;
    return h + ":" + m;
  }
  
  doTimes();
  
  //更新时间显示
  function refreshTimes(start) {
    c.start = ((start || 0) + el.position().left / c.ppm) ^ 0;
    c.limit = (parseInt(el.css("width")) / c.ppm) ^ 0;
    el.attr("title",c.content+"\n"+mins2Time(c.start)+"-"+mins2Time(c.start+c.limit)+ "(" + ((c.limit / 6) ^ 0) / 10 + "H)");
    if (c.limit >= 120) {
      el.addClass("long");
    }
    else {
      el.removeClass("long");
    }
    doTimes();
  }
  
  el.click(function(e) {
    c.onclick(e, c.id, c.start, c.limit);
  });
  
  return {
    el: el,
    getStart: function() {
      return c.start;
    },
    getLimit: function() {
      return c.limit;
    },
    refreshTimes: refreshTimes,
    getId: function() {
      return c.id;
    },
    disabled: disabled,
    //清除本身
    remove: function() {
      el.trigger("_remove");
      el.remove();
    },
    refreshView: function() {
      
    }
  }
}