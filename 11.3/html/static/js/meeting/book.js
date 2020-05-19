/**
 * Ԥ������
 * @param cfg
 * @returns {___anonymous2548_2821}
 */
function WeekBooker(cfg) {
  var opts = {
    line: 0,
    //��ʼʱ��(��λ����)
    start: 0 * 60,
    //����ʱ��
    limit: 24 * 60 + 1,
    distance: 5,
    //width: 9 * 60 / 5 * 10,
    renderTo: '',
    occupied: [],
    //ÿ����������
    ppm: 2,
    //�¼�
    update: $.noop,
    day: "2012-04-04",
    //�����»�����¼�
    oncreate: $.noop,
    name: "������",
    //һ�������ҵ�����
    date: [],
    //����֮ǰ���¼�,��return false��ʱ������������
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
  //�����������ɶ�Ӧ��booker����
  $.each(c.date, function(i, e) {
    axis.append("<div class='item " + (i % 2 ? "odd" : "even") + "'>" + (e.date || e) + "</div>");
    var booker = new Booker({
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
  $("<div class='meeting-sp' style='width:2042px;'></div>").appendTo(c.renderTo);
  
  return {
    //��ȡ�ڲ���booker����
    bookers: bookers,
    //�жϻ����Ƿ�ʱ���ͻ,����boolean
    crowd: function() {
      for (var i in bookers) {
        b = bookers[i];
        if (b && b.crowd && b.crowd()) {
          return true;
        }
      }
      return false;
    },
    getStart: function() {
      return c.start;
    },
    getLimit: function() {
      return c.limit;
    },
    setStart: function(s) {
      c.start = s;
      this.each(function(item){ 
        this.setStart(s);  
      });
    },
    setLimit: function(s) {
      c.limit = s;
      this.each(function(item){ 
        this.setLimit(s);  
      });
    },
    each: function(func){
      $.each(bookers, func);   
    }
  }
}

/**
 * Ԥ������
 * @param cfg
 * @returns
 */
function Booker(cfg) {
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
  var meetings = [];window.meetings = window.meetings || []; window.meetings.push(meetings);
  var el = $("<div class='container'>").addClass(c.line % 2 ? "odd" : "even").css({width: c.width});
  el.addClass("status-" + c.status);
  var distance = (c.ppm * c.distance) ^ 0;
  c.renderTo && el.appendTo(c.renderTo);
  
  /**
   * �ж��Ƿ��г�ͻ,ʱ����Ƿ��н���
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
    
    //��ק�ͳ�ֵ��С
    meeting.disabled || me.resizable({
      containment: ".week-booker .container",
      handles: "w,e",
      grid: c.distance * c.ppm,
      //��קʱ���»���ʱ��
      resize: function() {
        meeting.refreshTimes(c.start);
      },
      minWidth: c.distance * c.ppm,
      //��ק�������¼�
      stop: function(e) {
        meeting.refreshTimes(c.start);
        //�ṩ���ⲿ���¼�
        c.update(c.line, meeting.getStart(), meeting.getLimit());
        if (crowd()) {
          alert("����ʱ���г�ͻ");
        }
      }
    }).draggable({
      containment: ".container",
      axis: "x",
      grid: [c.distance * c.ppm, 10],
      start: function(e) {
        
      },
      //��קʱ���»���ʱ��
      drag: function() {
        meeting.refreshTimes(c.start);
      },
      stop: function() {
        meeting.refreshTimes(c.start);
        c.update(c.line, meeting.getStart(), meeting.getLimit());
        if (crowd()) {
          alert("����ʱ���г�ͻ");
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
        Booker.newMeeting = new Meeting({
          content: "��ԤԼ",
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
    crowd: crowd,
    getMeetings: function(){ return meetings; },
    getStart: function() {
      return c.start;
    },
    getLimit: function() {
      return c.limit;
    },
    setStart: function(s) {
      var start = c.start;
      c.start = s;
      var l = (start - s)*c.ppm;
      this.each(function(item){ 
        this.move(l);  
      });
      this.refreshWidth();
    },
    setLimit: function(s) {
      c.limit = s;
      this.each(function(item){ 
        this.setLimit(s);  
      });
      this.refreshWidth();
    },
    refreshWidth: function(){
      this.el.width( c.limit * c.ppm );
    },
    each: function(func){
      $.each(this.getMeetings(), func);   
    }
  }
}

/**
 * ��������
 * @param cfg
 * @returns
 */
function Meeting(cfg) {
  var opts = {
    data: "",
    //��ʼʱ��(��λ����)
    start: 10 * 60,
    //����ʱ��(��λ����)
    limit: 11 * 60,
    //��������
    content: "",
    //ÿ���ӵ�������
    ppm: 2,
    status: 0,
    day: "2012-04-04",
    onclick: $.noop,
    id: "new",
    statusInfo: [{
      text: "����׼",
      cls: "status0"
    }, {
      text: "����׼",
      cls: "status1"
    }, {
      text: "������",
      cls: "status2"
    }, {
      text: "�ѽ���",
      cls: "status3"
    }, {
      text: "��ԤԼ",
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
  var m_proposer = $("<p class='content'></p>").text(c.m_proposer);
  var status = c.statusInfo.length > c.status ? c.statusInfo[c.status] : {};
  var time = null;
  el.removeAttr("title");
  if(typeof(c.m_proposer) == 'undefined')
  {
    el.attr("title",c.content+"\n"+mins2Time(c.start)+"-"+mins2Time(c.start+c.limit)+ "(" + ((c.limit / 6) ^ 0) / 10 + "H)");
  }
  else
  {
    el.attr("title",c.m_proposer+"����"+"\n"+c.content+"\n"+mins2Time(c.start)+"-"+mins2Time(c.start+c.limit)+ "(" + ((c.limit / 6) ^ 0) / 10 + "H)");
  }
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
  
  //��ʼ��ʱ����ʾ
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
  
  //����ת��Ϊʱ��ķ���
  function mins2Time(i) {
    var h = (i / 60 ) ^ 0;
    var m = (i % 60) ^ 0;
    m = m < 10 ? "0" + m : m;
    return h + ":" + m;
  }
  
  doTimes();
  
  //����ʱ����ʾ
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
  
  function refreshView(){
      
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
    setStart: function(s) {
      var l = (c.start - s)*c.ppm;
      this.move(l);
    },
    move: function(l){
      var left = parseInt(this.el.css('left'));
      this.el.css('left', parseInt(left + l, 10));    
    },
    setLimit: function(s) {
      //c.limit = s;
      //console.log('meeting'+this.getId(), s);
    },
    refreshTimes: refreshTimes,
    getId: function() {
      return c.id;
    },
    disabled: disabled,
    //�������
    remove: function() {
      el.trigger("_remove");
      el.remove();
    },
    refreshView: function() {
      
    },
    destroy: function(){}
  }
}