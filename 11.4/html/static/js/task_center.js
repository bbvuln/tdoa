jQuery.noConflict();
(function($){

    Raphael.fn.ball = function (x, y, r, hue) {
        hue = hue || 0;
        if(!_fillType)
            _fillType = "#68B4D3";
        return this.set(
            //"rhsb(" + hue + ", .3, .25)-hsb(" + hue + ", .2, .25)"   "r(.5,.2)hsb(" + hue + ", .3, .75)-hsb(" + hue + ", .3, .25)"   "r(.5,.3)#ccc-#ccc"
            //this.ellipse(x, y + r - r / 5, r, r / 2).attr({fill: _fillType, stroke: "none", opacity: 0}),
            this.ellipse(x, y, r, r).attr({fill: _fillType, stroke: "none"})
            //this.ellipse(x, y, r - r / 5, r - r / 20).attr({stroke: "none", fill: _fillType, opacity: 0})
        );
    };
    //时间轴插件 by jx @ 2014/7/20
    var Timeline = function(){
        this.init.apply(this, arguments);    
    };
    Timeline.defaults = {
        hWidth: 60,
        timeRange: [0, 24],
        padding: 15,
        canvasHeight: 40,
        tipContainer: 'body',
        cursor: undefined
    };
    Timeline.prototype = {
        constructor: Timeline,
        init: function(wrapper, config){
            this.$wrapper = $(wrapper || '#timeline-canvas');
            this.timeIntervalMajors = []; 
            this.timeIntervalLabels = []; 
            this.timeDataPointors = [];
            this.timeDataLabels = [];
            this.tipInstances = [];
            this.$tipContainer = null;
            this.showingTips = false;
            this.cursor = $('<div id="timeLineCursor"></div>').appendTo('#timeline-canvas');//lijun add this in 12/19
            this.options = $.extend(true, {}, Timeline.defaults, config);

            this.initCanvas();
            this.buildMask();
            this.buildGraduation();
            this.buildEvent();
            this.bindEvent();
        },
        initCanvas: function(){    
            var opts = this.options, 
                hWidth = opts.hWidth, 
                timeRange = opts.timeRange, 
                padding = opts.padding, 
                canvasHeight = opts.canvasHeight,   
                canvasWidth = padding * 2 + hWidth * (timeRange[1] - timeRange[0]);

            this.canvas = Raphael("timeline-canvas", canvasWidth, canvasHeight);
        },
        bindEvent: function() {
            var self = this;
            this.$wrapper.bind('mousewheel', function(e)
            {
                var delta = 0,
                    orgEvent = e.originalEvent;
                if(orgEvent.wheelDelta)
                {
                    delta = orgEvent.wheelDelta;
                }
                if(orgEvent.detail)
                {
                    delta = orgEvent.detail * -1;
                }
                self[ delta > 0 ? 'timeLineNext' : 'timeLinePrev' ]();
                return false;
            });
        },
        buildGraduation: function(){
            var opts = this.options,
                timeRange = opts.timeRange, 
                hWidth = opts.hWidth, 
                padding = opts.padding,
                timeIntervalLabels = this.timeIntervalLabels,
                timeIntervalMajors = this.timeIntervalMajors,
                paper = this.canvas;
                
            for (var i = timeRange[1] - timeRange[0], j = 0; j <= 23; j++) {
                var index = j - timeRange[0],
                time = j,
                x = index * hWidth + padding,
                color = (time >= 6 && time < 19) ? '#444' : '#999';
                /* timeIntervalMajors.push(paper.circle(x, 40, 3).attr({"stroke": "#3D81B6","fill": "#3D81B6"}));*/
                timeIntervalLabels.push(paper.text(x, 30, time + ':00').attr("fill", color));
                timeIntervalMajors.push(paper.path("M" + x + " 10 L" + x + " 20").attr("stroke", color));
                if (timeRange[0] <= j || j < timeRange[1]) {
                    var n = 1;
                    while (n < 6) {
                        var x = index * hWidth + n * 10 + padding;
                        paper.path("M" + x + " 15 L" + x + " 20").attr("stroke", color);
                        n++;
                    }
                }
            }
        },
        buildEvent: function(){
            var self = this,
                opts = self.options,
                timeIntervalLabels = this.timeIntervalLabels,
                timeIntervalMajors = this.timeIntervalMajors,
                paper = this.canvas,
//              $tipContainer = $(this.options.tipContainer);
                $tipContainer = $(this.options.tipContainer);
            $.each(opts.timeDatas, function(i, n){
                var d = this;
                var _tipInstances = new TimelineTip({timeline: self, data: d,$tipContainer: $tipContainer});
                self.tipInstances.push(_tipInstances);
                self.$tipContainer = $tipContainer;
            });
        },
        buildMask: function(){            
            var opts = this.options,
                hWidth = opts.hWidth, 
                padding = opts.padding,
                canvasHeight = opts.canvasHeight,  
                paper = this.canvas;
            
            paper.rect(0, 5, hWidth * 6 + padding, canvasHeight, 2).attr({
                stroke: "none",
                fill: "#f1f1f1"
            });    
            paper.rect(padding + hWidth * 6, 5, hWidth * (19-6), canvasHeight, 2).attr({
                stroke: "none",
                fill: "#fff"
            });    
            paper.rect(padding + hWidth * 19, 5, hWidth * (24-19) + padding, canvasHeight, 2).attr({
                stroke: "none",
                fill: "#f1f1f1"
            });
        },
        getXbyTime: function(c){
            var opts = this.options,
                hWidth = opts.hWidth, 
                padding = opts.padding,
                timeRange = opts.timeRange,
                times = c.split(':');
            return (parseInt(times[0], 10) - timeRange[0]) * hWidth + parseInt(times[1], 10) + padding;
        },
        getOffset: function(){
            return this.$wrapper.offset();
        },
        getHeight: function(){
            return this.options.canvasHeight
        },
        timeLineNext: function() {
            var _marginLeft = parseInt(this.$wrapper.css('marginLeft'));
            if(_marginLeft < -120) {
                this.$wrapper.finish().animate({
                    'marginLeft' : parseInt(this.$wrapper.css('marginLeft')) + 2*this.options.hWidth
                }, {
                    //queue: false
                });
            } else if(_marginLeft >= -120 && _marginLeft <= 0) {
                this.$wrapper.finish().animate({
                    'marginLeft' : 0
                });
            }
        },
        timeLinePrev: function() {
            var deltaWidth = window.innerWidth - 1735;
            var _marginLeft = parseInt(this.$wrapper.css('marginLeft'));
            if(_marginLeft > deltaWidth + 2*this.options.hWidth) {
                this.$wrapper.finish().animate({
                    'marginLeft' : parseInt(this.$wrapper.css('marginLeft')) - 2*this.options.hWidth
                }, {
                    //queue: false
                });
            } else if(_marginLeft <= deltaWidth + 2*this.options.hWidth && _marginLeft >= deltaWidth) {
                this.$wrapper.finish().animate({
                    'marginLeft' : parseInt(deltaWidth)
                });
            }
        },

        timeLineCursorMove: function(e) {//lijun modified in 12/15
            var x = e.clientX;
            var y = e.clientY;
            $('#timeLineCursor').css({
                left: x-4
            });
        }
    };

    var FormatTime = function(time){
        var m = 'AM';
        var times = time.split(':');
        var hour = parseInt(times[0], 10);
        var mins = times[1];
        if (hour > 12) {
            hour = hour - 12;
            m = 'PM';
        } else if (this.hour < 1) {
            hour = 12;
            m = 'AM';
        }
        hour = (hour >= 10) ? hour : '0'+hour;
        return hour + ':' + mins + ' ' + m;
        
    };
    var FormatTimeAll = function(time){
        var AllArray = time.split(" ");
        var DateArray = AllArray[0].split("-");
        var TimeArray = AllArray[1].split(":");
        var AllMonth = (DateArray[1].length == 1) ? '0'+DateArray[1] : DateArray[1];
        var AllDay = (DateArray[2].length == 1) ? '0'+DateArray[2] : DateArray[2];
        var AllHour = TimeArray[0];
        var AllMinute = TimeArray[1];
        if(AllArray[2] == 'PM' && AllHour!=12)
        {
            AllHour = Number(AllHour)+12;
        }
        AllHour = (AllHour.length == 1) ? '0'+AllHour : AllHour;
        AllMinute = (AllMinute.length == 1) ? '0'+AllMinute : AllMinute;
        var returnTime = DateArray[0]+"-"+AllMonth+"-"+AllDay+" "+AllHour+":"+AllMinute+":00";
        return returnTime;
    };
        
    var TimelineTip = function(){
        this.init.apply(this, arguments);
    };
    TimelineTip.prototype = {
        constructor: TimelineTip,
        init: function(config){
            var self = this,
                $tipContainer = config.$tipContainer ? config.$tipContainer : $('<div id="tipContainer">'),
//              var $tipContainer = config.$tipContainer,
                timeline = config.timeline, 
                d = config.data,
                bottom = timeline.getHeight() + 10;
                x = d.start.split(":")[0]*60 + parseInt(d.start.split(":")[1]) + 15;
            this.timeline = timeline;
            this.data = d;
            this.el = $('<div>')
                .addClass('timeline-item')
                .addClass('tooltip top')
                .attr({
                    id: 'timeline-item-' + d.id,
                    title: d.text
                })
                .css({
                    left: x-48,
                    bottom: bottom + 'px'
                })
                .html('<div class="tooltip-arrow"></div><div class="tooltip-inner"><div class="timeline-item-time">' + this.getTimeText(d.start, d.end) + '</div><div class="timeline-item-text">' + d.text + '</div></div>');
            $tipContainer.append(this.el);
            $('#timeline-canvas').append($tipContainer);
            $($tipContainer).children().hide();
            //paper.path("M" + x + " " + (i%2 ? 85 : 35) + " L" + x + " 25").attr("stroke", "#dedede");
            //在时间轴上显示单个日程提醒
//          var _fillType;
            if(d.type == 'calendar') {
                _fillType = '#68B4D3';
            } else if(d.type == 'meeting') {
                _fillType = '#f89406';
            } else if(d.type == 'affair') {
                _fillType = '#3a87ad';
            }
            timeline.canvas.ball(x, 15, 5, Math.random()).attr('fill', _fillType).attr('tid', d.id).mouseover(function(){
                if(!self.timeline.showingTips) {
                    $(self.el).show();
                }
            }).mouseout(function() {
                if(!self.timeline.showingTips) {
                    $(self.el).hide();
                }
            });
        },
        getTimeText: function(start, end){
            if(end)
            {
                return '<b>'+start+'</b>-<b>'+end+'</b>';
            }
            else
            {
                return '<b>'+start+'</b>';
            }
        },
        getXbyTime: function(x){
            return this.timeline.getOffset().left + this.timeline.getXbyTime(x)
        }
    };


    //----------------- lijun add this in 12/19 ------------------
    var CalendarPanel = function() {
        this.init.apply(this,arguments);
    };

    CalendarPanel.prototype = {

        container: undefined,//定义Panel的容器
        tipTimer: undefined,//用于弹出“点击创建日程”的计时器
        lastRequestTime: null,
        //初始化方法
        init: function() {
            this.container = arguments.container || $('#calendar-creation-section');
            this.timeline = arguments.timeline || $('#timeline-canvas');
            this.timelineMouseMoveHandler = arguments[0].timelineMouseMoveHandler;
            this.tl = arguments[0].tl;
            this.events();
        },

        events: function() {
            var self = this;
            this.timeline.mouseover(function(e) {//注册鼠标移入时间轴事件，Panel显示
                self.showPanel();
                if(e.toElement.tagName == 'ellipse') {
                    self.hidePanel();
                }
            });
            this.timeline.mouseout(function(e) {//注册鼠标移出时间轴事件，Panel消失
                if(!e.toElement || e.toElement.id == 'timeLineCursor' || e.toElement.tagName == 'path' || e.toElement.tagName == 'rect' || e.toElement.tagName == 'tspan' || e.toElement.tagName == 'text') {
                    return;
                }
                self.hidePanel();
            });
            // setTimeout(,2000)
            //鼠标移入光标和时间tip本身，path rect tspan元素显示针形光标和时间tip
            $('#timeLineCursor, #calendar-creation-section, path, rect, tspan, text').mouseenter(function () {
                self.container.css('display', 'block');
            });
            //侦听“取消”按钮
            $('.calendar-op-cancel').click(function() {
                self.cancel();
            });
            //"完成"按钮
            $('.calendar-op-create').click(function() {
                self.create();
            });
            //"完整编辑"按钮
            $('.calendar-op-edit').click(function() {         
                self.fullEdit();
                self.cancel();
                self.hidePanel();
            });
            //打开颜色条
            $("#color").click(function(){
                $("#color_menu").slideToggle();
            });
            //选色
            $("a[id^=calcolor]").each(function(i){
        	    $(this).click(function(){
        	        $("#color").css({"background-color":$(this).css('background-color')});
        	        $("#COLOR_FIELD").val($(this).attr('index'));
                    $("#color_menu").hide();
        	    })
        	});
        	//全天
        	$("#allDayCheckbox1").change(function (){
                var ischecked = $(this).prop('checked');
                if (ischecked) 
		        {
                    $("#startInput1").hide();
			        $("#endInput1").hide();
                } 
		        else 
		        {
                    $("#startInput1").show();
			        $("#endInput1").show();
                }
            });
            //结束时间
            $("#endCheckbox1").change(function (){
                var ischecked = $(this).prop('checked');
                if (ischecked) 
                {
                    $("#endtimeArea1").show();
                    $("#startarea").css("margin-bottom","20px");
                } 
                else 
                {
                    $("#endtimeArea1").hide();
                    $("#startarea").css("margin-bottom","0px");
                }
            });
            //是否重复
            $("#repeatCheckbox1").change(function (){
                var ischecked = $(this).prop('checked');
                if (ischecked) 
		        {
                    $("#color").hide();
                    $("#repeatType1").show();
                    $("#remindTime").hide();
                    $("#OWNER1").hide();
                    var aff_type="repeat2";
                    if($("#TYPE option:selected").val() == 2){
                        var cur_time = new Date();
                        var cur_hours = cur_time.getHours();
                        var cur_minutes = cur_time.getMinutes();
                        if(cur_minutes > 30){
                            cur_minutes = 0;
                            cur_hours = cur_hours +1;
                        }else{
                            cur_minutes = 30;
                        }
                    
                        cur_minutes = (cur_minutes > 10) ? cur_minutes : '0'+cur_minutes;
                    
                        var show_remind_time;
                        if(cur_hours==0 || cur_hours==24){
                            show_remind_time = "12:"+cur_minutes+" AM";
                        }else if(cur_hours>0 && cur_hours<12){
                            cur_hours = (cur_hours >= 10) ? cur_hours : '0'+cur_hours;
                    
                            show_remind_time = cur_hours+":"+cur_minutes+" AM";
                        }else if(cur_hours==12){
                            show_remind_time = "12:"+cur_minutes+" PM";
                        }else if(cur_hours>12 && cur_hours<24){
                            cur_hours = (cur_hours >= 22) ? (cur_hours-12) : '0'+(cur_hours-12);
                    
                            show_remind_time = cur_hours+":"+cur_minutes+" PM";
                        }
                    
                        $("#REMIND_TIME2").val(show_remind_time);
                    }
                    //按什么重复切换
                    $("#TYPE").change(function(){
                        if(aff_type!="")
                        {
                            $("#"+aff_type).hide();
                        }
                        var isselected = $("#TYPE option:selected").val();
                        aff_type = "repeat" + isselected;
                        $("#"+aff_type).show();
                    });
                } 
                else 
                {
                    $("#color").show();
                    $("#repeatType1").hide();
                    $("#remindTime").show();
                    $("#OWNER1").show();
                }
            });
            //完整编辑点击保存
            $("#savecal").click(function(){
                self.saveCal(self);
            });
            //关闭完整编辑弹框
            $(".closecal").click(function(){
                $("#caledar-modal-layout").removeClass("show");
            });
        },
        //edit by tl at 20141227
        saveCal: function(self){
            var obj = this;
            var time = new Date;
            obj.lastRequestTime = time;  
            var selfPanel = self;
            var start_t = $("#START_TIME").val();
            var start_d = $("#START_DATE").val();
            var end_t = $("#END_TIME").val();
            var end_d = $("#EDN_DATE").val(); 
            var cal_content = $("#CAL_CONTENT").val();
            var cal_type = $("#CAL_TYPE option:selected").val();
            var before_day = $("#BEFORE_DAY").val();
            var before_hour = $("#BEFORE_HOUR").val();
            var before_min = $("#BEFORE_MIN").val()=="" ? 10 : $("#BEFORE_MIN").val();
            var remin_type = $("#TYPE option:selected").val();
            var owner = $("#OWNER").val();
            var taker = $("#TAKER").val();
            var remind_date = $("#REMIND_DATE"+remin_type).val();
            var remind_time = $("#REMIND_TIME"+remin_type).val();
            var cal_color = $("#COLOR_FIELD").val();
            var overstatus = $("#CALSTATUS").val();
            var op = '';
            if(remin_type=="5")
            {
                remind_date = $("#REMIND_DATE5_MON").val() + "-" + $("#REMIND_DATE5_DAY").val();
            }         
            var allday = $("#allDayCheckbox1").prop('checked')==true ? 1 : 0;
            var end = $("#endCheckbox1").prop('checked')==true ? 1 : 0;
            var repeat = $("#repeatCheckbox1").prop('checked')==true ? 1 : 0;
            var sms_remind = $("#SMS_REMIND").prop('checked')==true ? 1 : 0;
            var sms2_remind = $("#SMS2_REMIND").prop('checked')==true ? 1 : 0;
            var cal_id = $("#CAL_ID").val();
            var startime = "";
            var endtime = "";
            if(allday==1)
            {
                if(end==0)
                {
                    starttime = start_d + " 00:00:00";
                    endtime = start_d + " 23:59:59";                   
                }
                else if(end==1)
                {
                    starttime = start_d + " 00:00:00";
                    endtime = end_d + " 23:59:59"; 
                }
            }
            else
            {
                if(end==0)
                {
                    starttime = start_d + " " + start_t;
                    endtime = "";                     
                }
                else if(end==1)
                {
                    starttime = start_d + " " + start_t;
                    endtime = end_d + " " + end_t;                     
                }
            }
            op = "add";
            if(cal_content=="")
            {
                alert("事务内容不能为空");
                return;
            }
            var allBeginArr = FormatTimeAll(starttime).split(" ");
            var dateBeginArr = allBeginArr[0].split("-");
            var timeBeginArr = allBeginArr[1].split(":");
            var start_time = new Date(dateBeginArr[0],dateBeginArr[1]-1,dateBeginArr[2],timeBeginArr[0],timeBeginArr[1],timeBeginArr[2]).getTime()/1000;
            if(endtime!="")
            {
                var allEndArr = FormatTimeAll(endtime).split(" ");
                var dateEndArr = allEndArr[0].split("-");
                var timeEndArr = allEndArr[1].split(":");                
                var end_time = new Date(dateEndArr[0],dateEndArr[1]-1,dateEndArr[2],timeEndArr[0],timeEndArr[1],timeEndArr[2]).getTime()/1000;
                if(start_time > end_time)
                {
                    alert("结束时间不能早于开始时间！");
                    return;
                }
            }
            $.ajax({
                url:'add_cal.php',
                data: {
                    cal_id:cal_id,
                    content:cal_content,
                    starttime:start_time,
                    endtime:end_time,
                    caltype:cal_type,
                    alldayflag:allday,
                    repeat:repeat,
                    beforeday:before_day,
                    beforehour:before_hour,
                    beforemin:before_min,
                    smsremind:sms_remind,
                    sms2remind:sms2_remind,
                    owner:owner,
                    taker:taker,
                    remintype:remin_type,
                    reminddate:remind_date,
                    remindtime:remind_time,
                    calcolor:cal_color,
                    op:op,
		            overstatus:overstatus
                },
                type: 'get',
                success:function(d){
                    if(time < obj.lastRequestTime){
                        return;
                    }
                    var startTimeInfo = starttime.split(' ');
                    var endTimeInfo = end_t.split(' ');
                    var start_time,end_time;
                    if(startTimeInfo[2] == "AM") {
                        start_time = startTimeInfo[1];
                    } else {
                        start_time = (12 + parseInt(startTimeInfo[1].split(":")[0])) + ":" + startTimeInfo[1].split(":")[1];
                    }
                    if(endTimeInfo[1] == "AM") {
                        end_time = endTimeInfo[0];
                    } else {
                        end_time = (12 + parseInt(endTimeInfo[0].split(":")[0])) + ":" + endTimeInfo[0].split(":")[1];
                    }
                    $("#calendar-modal").modal('hide');
                    $("#caledar-modal-layout").removeClass("show");
                    $("#inbox").trigger("click");
                    selfPanel.cancel();
                    selfPanel.container.hide();

                    //时间轴上即时打点
                    selfPanel.tl.options.timeDatas.push({id: "", start: start_time, end: end_time, text: cal_content, type: "calendar"});
                    selfPanel.tl.tipInstances = [];
                    selfPanel.tl.$tipContainer && selfPanel.tl.$tipContainer.empty();
                    selfPanel.timeline.find('ellipse').remove();
                    selfPanel.tl.buildEvent();
                }                    
            });  
        },
        move: function(e,chosenH,chosenM) {
            //如果计时器存在则清除，清除后重新赋值
            this.tipTimer && clearTimeout(this.tipTimer);

            var x = e.clientX;
            var y = e.clientY;
            var bodyW = $('body').width();

            if(x > bodyW/1.4) {//判断浏览器窗口缩放或其他原因导致外部容器变窄时，放置tip位置的比例系数
                this.container.css({
                    bottom: 60,
                    left: x-94,
                    width:80,
                    height:25
                });
                this.tipTimer = setTimeout(function () {
                    $('#calendar-creation-section').animate({
                        height: 135,
                        width: 260,
                        left: x-276,
                        bottom:10
                    }, {
                        duration: 200
                    })
                },2000);
            } else {
                this.container.css({
                    bottom: 60,
                    left: x+10,
                    width:80,
                    height:25
                });
                this.tipTimer = setTimeout(function () {
                    $('#calendar-creation-section').animate({
                        height: 135,
                        width: 260,
                        bottom:10
                    }, {
                        duration: 200
                    })
                },2000);
            }

            //如果传入的时间是NaN,则不予显示
            if(chosenH != chosenH || chosenM != chosenM)
                return;
            //更新显示时间
            if(chosenM == 0)
                chosenM = '00';
            $('.calendar-tip-panel .myTime').text(chosenH + ':' + chosenM);


        },

        edit: function(e,chosenH,chosenM) {
            if(e.toElement && e.toElement.tagName == 'ellipse') {
                return false;
            }
            $('.calendar-creating-tip').hide();

            var x = e.clientX;
            var y = e.clientY;
            var bodyW = $('.container-fluid').width();
            if(x > bodyW/1.4) {//经计算，1.4是适用任意宽度窗口的比例系数，以外部body宽除以比例系数，可判断tip显示在光标的左或右
                this.container.css('left',x-276);
                $('#calendar-creation-section').animate({
                    height: 135,
                    width: 260,
                    left: x-276,
                    bottom:10
                }, {
                    duration: 200
                })
            } else {
                this.container.css('left',x+10);
                $('#calendar-creation-section').animate({
                    height: 135,
                    width: 260,
                    bottom:10
                }, {
                    duration: 200
                })
            }

            var startH = chosenH;
            var startM = parseInt(chosenM);
            var endH,endM;
            if(chosenM+30 >= 60) {
                endH = startH+1;
                endM = chosenM-30;
            } else {
                endH = startH;
                endM = startM+30;
            }
            if(startM == 0) {
                startM = '00';
            }
            if(startM == 30) {
                endM = '00';
            }
            if(window.userAgent.indexOf("msie") == -1)
                $('.calendar-creation-input textarea').focus();

            $('.time-range .start-time').text(startH + ':' + startM);//设置开始时间
            $('.time-range .end-time').text(endH + ':' + endM);//设置结束时间
            this.timeline.unbind('mousemove');
            this.container.addClass('flipped');
        },
        //点击完整编辑填充弹框
        fullEdit: function() {
            $("#TAKER_NAME,#TAKER,#OWNER_NAME,#OWNER").val("");
            //$("#repeatCheckbox1").attr("checked",false);
            //$("#TYPE option:selected").removeAttr("selected");
            //$("#repeatType1").hide();
            $("#OWNER1,#remindTime").show();
            //edit by tl at 20141227
            var starttime = $('.start-time').text();
            var endtime = $('.end-time').text();
            var content = $('#calendar-creation-content').val();
            var date = new Date();
    		var d = date.getDate();
    		var m = date.getMonth()+1;
    		var y = date.getFullYear();
    		//填充弹框内容
    		$("#CAL_CONTENT").val(content);
            //clear the origin content
            $('#calendar-creation-content').val("");
    		//填充弹框开始结束日期
            $("#START_DATE").val(y+"-"+(m<10 ? "0" + m : m)+"-"+(d<10 ? "0"+ d : d));
            $("#EDN_DATE").val(y+"-"+(m<10 ? "0" + m : m)+"-"+(d<10 ? "0"+ d : d)); 
            //填充弹框开始结束时间
            $("#START_TIME").val(FormatTime(starttime));
            $("#END_TIME").val(FormatTime(endtime));
            //处理时间戳
    		starttime = y+"-"+(m<10 ? "0" + m : m)+"-"+(d<10 ? "0"+ d : d) +" " + starttime+":00";
    		endtime = y+"-"+(m<10 ? "0" + m : m)+"-"+(d<10 ? "0"+ d : d) + " " +endtime+":00";
    		//开始时间转化时间戳
    		var new_str = starttime.replace(/:/g,'-');
            new_str = new_str.replace(/ /g,'-');
            var arr = new_str.split("-");
            var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
            starttime = datum.getTime()/1000;
            //结束时间转化时间戳
            var new_str1 = endtime.replace(/:/g,'-');
            new_str1 = new_str1.replace(/ /g,'-');
            var arr1 = new_str1.split("-");
            var datum1 = new Date(Date.UTC(arr1[0],arr1[1]-1,arr1[2],arr1[3]-8,arr1[4],arr1[5]));
            endtime = datum1.getTime()/1000;
            $('#calendar-modal').modal('show');
            $('#caledar-modal-layout').addClass('show');
        },
        create: function() {
            var self = this;
            var initStarttime = $('.start-time').text();
            var initEndtime = $('.end-time').text();
            var theContent = $('#calendar-creation-content').val();
            var endtime = $('.end-time').text();
            var newTitle = $('#calendar-creation-content').val();
            if(newTitle=="")
            {
                alert("日程内容不能为空！");
                return false;
            }
            else
            { //edit by tl at 20141227
                $('.calendar-creating-tip').show();

                var date = new Date();
        		var d = date.getDate();
        		var m = date.getMonth()+1;
        		var y = date.getFullYear();
        		starttime = y+"-"+(m<10 ? "0" + m : m)+"-"+(d<10 ? "0"+ d : d) +" " + initStarttime+":00";
        		endtime = y+"-"+(m<10 ? "0" + m : m)+"-"+(d<10 ? "0"+ d : d) + " " +endtime+":00";
        		//开始时间转化时间戳
        		var new_str = starttime.replace(/:/g,'-');
                new_str = new_str.replace(/ /g,'-');
                var arr = new_str.split("-");
                var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
                starttime = datum.getTime()/1000;
                //结束时间转化时间戳
                var new_str1 = endtime.replace(/:/g,'-');
                new_str1 = new_str1.replace(/ /g,'-');
                var arr1 = new_str1.split("-");
                var datum1 = new Date(Date.UTC(arr1[0],arr1[1]-1,arr1[2],arr1[3]-8,arr1[4],arr1[5]));
                endtime = datum1.getTime()/1000;
                $.ajax({
                   type: 'get',
                    url:'add_cal.php',
                    data: {
                        content:newTitle,
                        starttime:starttime,
                        endtime:endtime,
                        op:'add',
                        repeat:0,
                        alldayflag:0,
                        smsremind:1,
                        calcolor:'0'                              
                    },
                    success:function(d){
                        //d = d.JSON.parse(d);
                        $("#calendar-creation-content").val("");
                        $("#inbox").trigger("click");
                        self.cancel();
                        //时间轴上即时打点
                        self.tl.options.timeDatas.push({id: "", start: initStarttime, end: initEndtime, text: theContent, type: "calendar"});
                        self.tl.tipInstances = [];
                        self.tl.$tipContainer && self.tl.$tipContainer.empty();
                        self.timeline.find('ellipse').remove();
                        self.tl.buildEvent();
                        /*
                        ajaxUrl: "cal_note.php?TCID=55&CAL_ID=158" 
                        icon: "task-item-info-icon-schedule" 
                        id: "55" 
                        ops: [{dataId:158, btnType:btn-finish, actionType:cal_ok_quick, btnText:完成},…] 
                        range: "12月17日 14:00至12月17日 14:30" 
                        rateInfo: "已超时8天" 
                        ratePercent: "100%" 
                        rateTitle: "已超时" 
                        summary: "当时奋不顾身伸出我的手" 
                        taskState: "state-expired" 
                        title: "日程安排" 
                        type: "calendar"
                        */
                        //$('#panel-inbox .taskblock').prepend($('#taskItemTemp').tmpl(d));
                    }
                });
            }
        },

        cancel: function() {
            var self = this;
            this.container.removeClass('flipped');
            this.timeline.mousemove(function(e) {
                self.timelineMouseMoveHandler(e);
            });
            this.timeline.trigger('mousemove');
        },

        hidePanel: function() {
            this.container.css('display', 'none');
            this.tl.cursor.css('display', 'none');
        },

        showPanel: function() {
            this.container.css('display', 'block');
            this.tl.cursor.css('display', 'block');
        }
    };


    window.Timeline = Timeline;
    window.CalendarPanel = CalendarPanel;

})(jQuery);

(function($){
	var modal;
	function ShowDialog()
	{
		modal.show();   
	}   
	function HideDialog()
	{
		modal.hide();   
	}
	$(document).ready(function(){   
    modal = $('#task-modal').modal({ show: false }).data('modal');
	var focuscount=0;
	var focusmenu;
	var activePanel;
    
    
    if(typeof window.external != 'undefined' && typeof(window.external.OA_SMS) != 'undefined')
    {
        external.OA_SMS(1200, 600, 'SET_SIZE');
	}
        
    $.fn.fadeRemove = function(){
        var $list = this;
		$list.addClass('animated bounceOutRight');
        setTimeout(function(){
            $list.remove();// });
        }, 800);
    };    
        
	//关闭按钮点击事件
	$('div.caption a.close').click(function(){
		if(typeof(top.closeTaskCenter) == 'function')
			top.closeTaskCenter();
		else if(typeof window.external != 'undefined' && typeof(window.external.OA_SMS) != 'undefined')
			window.external.OA_SMS("", "", "CLOSE_WINDOW")
		else
			window.close();
	});
	//点击收件箱
	$('#inbox').click(function(){  
	    $('body,html').animate({scrollTop:0},0);
        $('#taskbox .right').removeClass('count-active');
		$('#panel-inbox').html(loading);
		focusmenu=$('span', this);
		var newtitle=$(this).attr('title');    
		var index = $(this).attr('index');
		$.ajax({
			type: 'GET',
			url: 'getData.php',
			data: {'LEFTMENU': $(this).attr('index')},
			cache: false,
			success: function(data){   
			var taskcount=0;
			//var reqtext = data.split('|~|');	 
			var taskcount =	data.count;
			focuscount=taskcount;
            $('#panel-inbox').html($('<ul>').attr('class', 'taskblock').html($('#taskItemTemp').tmpl(data.data)));
            if(taskcount>0){
                $('#inbox em').text(""+taskcount+"");
                $('#inbox').addClass('active');
            } else {
                $('#inbox em').text(" ");
                $('#panel-inbox .taskblock').append($('<dt>' + data.msg + '</dt>'));
                }
			},
			error: function(request, textStatus, errorThrown){
			    $('#panel-inbox').html(load_error);
			}
        });
	});
	//近期
	$('#next').click(function(){ 
	    $('body,html').animate({scrollTop:0},0);
		$('#taskbox .right').removeClass('count-active');  	
		$('#panel-next').html(loading);
		focusmenu=$('span', this);
		var newtitle=$(this).attr('title');    
		var index = $(this).attr('index');
		$.ajax({
			type: 'GET',
			url: 'getData.php',
			data: {'LEFTMENU': $(this).attr('index')},
			cache: false,
			success: function(data){    
			var taskcount=0;
            var taskcount = data.count;
			focuscount=taskcount;
			$('#panel-next').html($('<ul>').attr('class', 'taskblock').html($('#taskItemTemp').tmpl(data.data)));
			if(taskcount>0) {
                $('#next em').text(""+taskcount+"");
            } else {
                $('#next em').text(" ");
                $('#panel-next .taskblock').append($('<dt>' + data.msg + '</dt>'));
            }
			},
			error: function(request, textStatus, errorThrown){
				$('#panel-next').html(load_error);
			}
		});
	});
	//已推迟
	$('#delaytime').click(function(){ 
	    $('body,html').animate({scrollTop:0},0);
		$('#taskbox .right').removeClass('count-active');  	
		$('#panel-delaytime').html(loading);
		focusmenu=$('span', this);
		$.ajax({
			type: 'GET',
			url: 'delaytime.php',
			data: {'LEFTMENU': $(this).attr('index')},
			cache: false,
			success: function(data){   
			var taskcount=0;
            var taskcount = data.count;
			focuscount=taskcount;
			$('#panel-delaytime').html($('<ul>').attr('class', 'taskblock').html($('#taskItemTemp').tmpl(data.data)));
			if(taskcount>0) {
                $('#delaytime em').text(""+taskcount+"");
            } else {
                $('#delaytime em').text(" ");
                $('#panel-delaytime .taskblock').append($('<dt>' + data.msg + '</dt>'));
            }
			},
			error: function(request, textStatus, errorThrown){
				$('#panel-delaytime').html(load_error);
			}
		});
	});
	//已忽略
	$('#ignored').click(function(){   	
	    $('body,html').animate({scrollTop:0},0);
        $('#taskbox .right').removeClass('count-active');
		$('#panel-ignored').html(loading);
		focusmenu=$('span', this);
		$.ajax({
		type: 'GET',
		url: 'ignored.php',
		data: {'LEFTMENU': $(this).attr('index')},
		cache: false,
		success: function(data){   
    		var taskcount=0;
            var taskcount = data.count;
    		focuscount=taskcount;
    		$('#panel-ignored').html($('<ul>').attr('class', 'taskblock').html($('#taskItemTemp').tmpl(data.data)));
    		if(taskcount>0) {
                $('#ignored em').text(""+taskcount+"");
            } else {
                $('#ignored em').text(" ");
                $('#panel-ignored .taskblock').append($('<dt>' + data.msg + '</dt>'));
            }
		},
		error: function(request, textStatus, errorThrown){
		    $('#panel-ignored').html(load_error);
		}
		});
	});

    //提醒事项 by tl 2014-07-31
    $('#reminder').click(function() {
        $('body,html').animate({scrollTop:0},0);
        $('#taskbox .right').addClass('count-active');
        $('#panel-reminder').html(loading);
		focusmenu=$('span', this);
        $('#count-title').html("提醒事项"+"<div id='count_op'><a class='add_count' id='add_reminder' href='javascript:;' title='"+td_lang.inc.msg_143+"'>"+td_lang.inc.msg_159+"</a></div>");
        $.ajax({
    		type: 'GET',
    		url: 'reminder.php',
    		data: {'LEFTMENU': $(this).attr('index')},
    		cache: false,
    		success: function(data){
    		    var remindcount=0;
                var remindcount = data.count;
        		$('#panel-reminder').html($('<ul>').attr('class', 'taskblock').html($('#remindItemTemp').tmpl(data.data)));
        		if(remindcount>0) {
                    $('#reminder em').text(""+remindcount+"");
                } else {
                    $('#reminder em').text(" ");
                    $('#panel-reminder .taskblock').append($('<dt>' + data.msg + '</dt>'));
                }
    		},
    		error: function(request, textStatus, errorThrown){
    		    $('#panel-reminder').html(load_error);
    		}
		});
    });

	//倒计时
	$('#count').click(function(){
        $('#taskbox .right').addClass('count-active');
		$('#count-content').html(loading);
		var newtitle=$(this).attr('title');
		$.ajax({
			type: 'GET',
			url: 'count.php',
			cache: false,
			success: function(data){
				try
				{
				   var CATAGORY_ARRAY=eval('('+data+')');//json格式字符串转为json对象
				}
				catch(ex)
				{
					$('#count-content').html(CreateNoTaskHTML());
	        		$('#count-title').html(newtitle+"<div id='count_op'><a class='add_count' id='add_count1' href='javascript:;' title='"+td_lang.inc.msg_143+"'>"+td_lang.inc.msg_159+"</a><a class='flush' id='flush' href='javascript:;' title='"+td_lang.inc.msg_166+td_lang.inc.msg_158+"'>"+td_lang.inc.msg_166+"</a></div>");
					$('#count em').text(" ");
					return;
				}
				$('#count-title').html(newtitle+"<div id='count_op'><a class='add_count' id='add_count1' href='javascript:;' title='"+td_lang.inc.msg_143+"'>"+td_lang.inc.msg_159+"</a><a class='flush' id='flush' href='javascript:;' title='"+td_lang.inc.msg_166+td_lang.inc.msg_158+"'>"+td_lang.inc.msg_166+"</a></div>");
				var MODULE_BODY="";
				var taskcount=0;
	            var INDEX;
				for(var CATAGORY in CATAGORY_ARRAY)
				{
					if(CATAGORY == "public")
						INDEX = "1";
					else if(CATAGORY == "private")
						INDEX = "2";
					else
						INDEX='6';
               		TASKS=CATAGORY_ARRAY[CATAGORY];
              		for(i=0;i<TASKS.length;i++)
					{
						MODULE_BODY+='<div class="item itemred_'+INDEX+'">';
						MODULE_BODY+='<div class="subject1"><div class="text">'+TASKS[i]+'</div></div></div>';
						taskcount++;
					}
					
				}
            	focuscount=taskcount;
         		$('#count-content').html("<center class='count_body clearfix'>"+MODULE_BODY+"</center>");
         		
				if(taskcount>0)
					$('#count em').text(""+taskcount+"");
				else
					$('#count em').text(" ");
				
				$("#content-title").attr("title",td_lang.inc.msg_158);							
				$.ajax({ 
					type: 'GET',
					url: 'count_img.php',
					cache: false,
					success: function(data){
                        if(data==1)
                        {
                            
                            $('#count').removeClass('count-7days').addClass('count-3days');
                            //有3日内的事件右侧加上图标
                            $('#count-title').html(newtitle + "<div id='rock_display'><i class='icon-countdown iconfont icon-countdown-three'>&#xe65f;</i><span id='count_img' class='count_img' title="+td_lang.inc.msg_167+"></span><span id='font_display'>"+td_lang.inc.msg_167+"</span></div><div id='count_op'><a class='add_count' id='add_count' href='javascript:;' title='"+td_lang.inc.msg_143+"'>"+td_lang.inc.msg_159+"</a><a class='flush' id='flush' href='javascript:;' title='"+td_lang.inc.msg_166+td_lang.inc.msg_158+"'>"+td_lang.inc.msg_166+"</a></div>");
                        }
                        else if(data==2)
                        {						
                            $('#count').removeClass('count-3days').addClass('count-7days');
                            //有7日内的事件右侧加上图标
                            $('#count-title').html(newtitle + "<div id='rock_display'><i class='icon-countdown iconfont icon-countdown-seven'>&#xe65f;</i><span id='count_img1' class='count_img1' title="+td_lang.inc.msg_168+"></span><span id='font_display'>"+td_lang.inc.msg_168+"</span></div><div id='count_op'><a class='add_count' id='add_count' href='javascript:;' title='"+td_lang.inc.msg_143+"'>"+td_lang.inc.msg_159+"</a><a class='flush' id='flush' href='javascript:;' title='"+td_lang.inc.msg_166+td_lang.inc.msg_158+"'>"+td_lang.inc.msg_166+"</a></div>");
                           
                        }
                    }
                });	
            },
            error:function(request, textStatus, errorThrown){
              $('#count-content').html(load_error);
            }
         });
	});
    $('#taskbox a[index="important"]').click(function(){   	
        $('#taskbox .right').removeClass('count-active');        
    });
    //
    $('#count-title').on('click','#add_reminder',function(){
        //创建ul容器
        if($("#panel-reminder ul.taskblock").length<=0){
            $('#panel-reminder .notask').hide();
            var _reminderTaskblock = $('<ul class="taskblock"></ul>');
            _reminderTaskblock.appendTo($('#panel-reminder'));
        }
        //新建提醒事项条目
        $('#panel-reminder .taskblock').prepend('<li class="task-item clearfix"><div class="task-item-info-icon-reminder pull-left" id="icon-reminder"></div><input class="pull-left" id="reminder-title-input" type="text" placeholder="请输入提醒事项标题..."></li>');
        //取消事件绑定，避免重复绑定事件
        $('.task-item').off('focusout');
        $('.task-item').off('keyup');
        $('#reminder-title-input').focus();
        $('.task-item').on('blur','#reminder-title-input',function(e) {
            if($(e.target).val() !== "") {
                _reminderTitle = $('#reminder-title-input').val();
                $.get('setReminder.php',{"reminderTitle":_reminderTitle,"action":"add"},function(data) {
                    $("#reminder").trigger('click');
                });
                //成功创建提醒事项后，去除编辑条目
                $(e.target).parent().remove();
            } else {
                if(window.confirm("未输入标题，取消创建？")) {
                    $(e.target).parent().remove();
                } else {
                    $('#reminder-title-input').focus();
                }
            }
            return false;
        });
        //取消#reminder-title-input点击事件冒泡
        $('#reminder-title-input').click(function() {
            return false;
        });
        $('.task-item').on('keyup','#reminder-title-input',function(e) {
            if($(e.target).val() !== "") {
                if (e.keyCode === 13) {
                    _reminderTitle = $('#reminder-title-input').val();
                    $.get('setReminder.php',{"reminderTitle":_reminderTitle,"action":"add"},function(data) {
                        //$('#panel-reminder .taskbox').append(data);
                        $("#reminder").trigger('click');
                    });
                    //成功创建提醒事项后，去除编辑条目
                    $(e.target).parent().remove();
                }
            }
        });
    });
	//'刷新倒计时牌'		
	$('#count-title').on('click','#flush', function(){
		$('#count').trigger("click");
	});
	//'新建倒计时'
	$('#count-title').on('click', '#add_count',function(){
		$('#task-modal .modal-header h3').html(td_lang.inc.msg_143);
		ShowDialog('dialog',10);
		$.get("new_count.php",{TC_ID:1}, function(data){
		$('#dialog_body').html(data);
		$('#CONTENT').focus();
		});
	});
	$('#count-title').on('click','#add_count1',function(){
		$('#task-modal .modal-header h3').html(td_lang.inc.msg_143);
		ShowDialog('dialog',10);
		$.get("new_count.php",{IS_NEW:1}, function(data){
		$('#dialog_body').html(data);
		$('#CONTENT').focus();
		});
	});  
	//新建保存倒计时
	$('#task-modal').on('click',"#set_count", function(){
		if($('#CONTENT').val()=="")
		{
			alert(td_lang.inc.msg_150);
			return false;
		}
		if($('#END_TIME_D').val()=="")
		{ 			
			alert(td_lang.inc.msg_151);
			return (false);
		}
		var cur_date=$("#CUR_DATE_N").val();
		var end_date=$("#END_TIME_D").val();
		var ROW_ID=$('#ROW_ID').val();
		var YEAR = $("#YEAR").prop('checked');
		if(YEAR)
		{
		    ANNUAL = 1;
		}
		else
		{
		    ANNUAL = 0;
		}
		$.get("new_add.php", {
			ORDER_NO:$('#ORDER_NO').val(),
			CONTENT:$('#CONTENT').val(),
			STYLES:$('#STYLE').val(),
			END_TIME_D:$('#END_TIME_D').val(),
			ROW_ID:$('#ROW_ID').val(),
			IS_NEW:$('#IS_NEW').val(),
			ANNUAL:ANNUAL
		}, 
		function(data){
			if(data == "1" )
			{  
				$('#count').trigger("click");
			}
			else 
				alert(data);
		});  
		HideDialog();  
	});

	//编辑倒计时
	$("#taskbox").on('click',".edit_count", function(){
		$('#task-modal .modal-header h3').html(td_lang.inc.msg_144);//'编辑倒计时牌'
		ShowDialog('dialog',10);
		$.get("new_count.php",{ROW_ID:$(this).attr('edit_id')}, function(data){
			$('#dialog_body').html(data);		
		});
	});
	//删除倒计时。。。。。。。。。。。。。。。。。。。。。。
	$("#taskbox").on('click',".del_count", function(){
		if(!window.confirm(td_lang.inc.msg_13))//"删除后将不可恢复,确定要删除吗？"
			return;
		$.get("new_add.php",{ROW_ID:$(this).attr('del_id'),IS_DEL:1}, function(data){
			if(data==1)	
			{
				$('#count').trigger("click");
			}
		});
	});	
	//右侧项目标题的点击事件
	$('#taskbox').on('click', '.taskblock li', function(){
		activePanel = $(this).parents('.tab-pane');
		$('#task-modal .modal-header h3').html(td_lang.inc.msg_146);//查看详情
		if($(this).attr('_ajax'))
		{
			ShowDialog('dialog', 10);
			$.get($(this).attr('_ajax'), function(data){
			$('#dialog_body').html(data);
		});
		}
		else if($(this).attr('_url'))//工作流
		{
			var $list = $(this),
                url = this.getAttribute('_url'),
                id = 'workflow-'+$list.attr('data-run-id')+'-'+$list.attr('data-flow-id')+'-'+$list.attr('data-prcs-id'),
                text = $list.find('.task-item-info p').text();

			if(top.bTabStyle)//时尚主题完整版界面下打开
            {
                url += '&target=top&callback=flowCallback';
                top.flowCallback = function(ret){
                    flowCallback(ret);
                };
				top.openURL(id, text, url);
			}
            else
            {
                url += '&target=opener&callback=flowCallback';
				window.open(url);
			}
        }
        else {
            var _btnFinish = $(this).find('.btn-finish');
            //console.log(_btnFinish);
            $('#dialog_body').html("");
            ShowDialog('dialog', 10);
            $.post("edit_remind.php", {TC_ID: _btnFinish.attr('item_id'), remind_id: _btnFinish.attr('remind_id')}, function (data) {
                $('#dialog_body').html(data);
                $('#CONTENT').focus();
                getCount();
            });
        }
	});
	//日程点击“完成”
	$('#task-modal').on('click','#cal_ok,#task_ok',function(){
		var item=$("#list_"+$(this).attr('item_id')); 
        var p_id=activePanel.attr('id');
		$.get("setData.php", {ACTION:$(this).attr('action'), TC_ID:$(this).attr('item_id') ,SOURCE_ID:$(this).attr('data-cal-name')}, function(data){
		if(data == "1")
		{   
			//console.log(p_id);
			if(p_id=="panel-inbox")
			{
				$('#inbox').trigger("click");
			}
			if(p_id=="panel-next")
			{
				$('#next').trigger("click");
			}
			if(p_id=="panel-delaytime")
			{
				$('#delaytime').trigger("click");
			}
			if(p_id=="panel-ignored")
			{
				$('#ignored').trigger("click");
			}			
		}
		else
			alert(data);
		});
		activePanel ="";
        HideDialog();
	});
    //工作流办理事件
	$('#taskbox .tab-pane').on('click', '[action="show_workflow"]', function(){
		$('#task-modal .modal-header h3').html(td_lang.inc.msg_146);
        var $list = $(this).parents('li:first'),
            url = $list.attr('_url'),
            id = 'workflow-'+$list.attr('data-run-id')+'-'+$list.attr('data-flow-id')+'-'+$list.attr('data-prcs-id'),
            text = $list.find('.task-item-info p').text();
		if(url)//工作流
		{			     
			if(top.bTabStyle)//时尚主题完整版界面下打开
            {
                url += '&target=top&callback=flowCallback';   
                top.flowCallback = function(ret){
                    flowCallback(ret);
                };
				top.openURL(id, text, url); 
			}
            else
            {
                url += '&target=opener&callback=flowCallback';  
				window.open(url);
			}
		}
        return false;
	});
	//急件箱、近期、已推迟、已忽略日程快速点击“完成”
	$('#taskbox .tab-pane').on('click','[action="cal_ok_quick"],[action="task_ok_quick"]',function(){
		var item=$("#list_"+$(this).attr('item_id')),
            $list = $(this).parents('.task-item:first'); 
		    activePanel = $(this).parents('.tab-pane');
        var p_id=activePanel.attr('id');
//        $list.css('background-color', '#39e');
		$.get("setData.php", {ACTION:$(this).attr('action'), TC_ID:$(this).attr('item_id') ,SOURCE_ID:$(this).attr('data-cal-name')}, function(data){
		if(data == "1")
		{   
			$list.fadeRemove();
            getCount();
            return;
			if(p_id=="panel-inbox")
			{
				$('#inbox').trigger("click");
			}
			if(p_id=="panel-next")
			{
				$('#next').trigger("click");
			}
			if(p_id=="panel-delaytime")
			{
				$('#delaytime').trigger("click");
			}
			if(p_id=="panel-ignored")
			{
				$('#ignored').trigger("click");
			}			
		}
		else
			alert(data);
		});
		activePanel ="";
        return false;
	});
	
	//右侧项目的完成点击事件 create tl 2014-08-07
	$('#taskbox .tab-pane').on('click','[action="remind_ok_quick"]',function(){
	    var self = $(this);
//        if($('.task-item.finish').length > 0) {
//            self.parents('li.task-item').insertBefore($('.task-item.finish'));
//        } else {
//            console.log(self.parents('li.task-item'));
//            console.log(self.parents('ul.taskblock'));
//            self.parents('li.task-item').appendTo(self.parents('ul.taskblock'));
//        }
	    activePanel = $(this).parents('.tab-pane');
        var p_id=activePanel.attr('id');
		$.get("setData.php", {ACTION:$(this).attr('action'), TC_ID:$(this).attr('item_id') ,remind_id:$(this).attr('remind_id')}, function(data){
		if(data == "1")
		{  
		    getCount(); 
		    //其他panel完成移除，事项panel保留条目
		    if(p_id != "panel-reminder"){
		        self.parents('.task-item').remove();
		    }
		    else{
		        $('#reminder').trigger("click");
		    }
		}
		else
			alert(data);
		});
		activePanel ="";
        return false;
	});
	
	//提醒事项点击未完成 tl 2014-09-01
	$('#taskbox .tab-pane').on('click','[action="remind_recover"]',function(){
	    var self = $(this);
	    activePanel = $(this).parents('.tab-pane');
        var p_id=activePanel.attr('id');
		$.get("setData.php", {ACTION:$(this).attr('action'), TC_ID:$(this).attr('item_id') ,remind_id:$(this).attr('remind_id')}, function(data){
    		if(data == "1")
    		{  
    		    getCount(); 
    		    //其他panel完成移除，事项panel保留条目
    		    if(p_id != "panel-reminder"){
    		        self.parents('.task-item').remove();
    		    }
    		    else{
    		        $('#reminder').trigger("click");
    		    }
    		}
    		else{
    		    alert(data);
    		}
		});
		activePanel ="";
        return false;
	});
	

	$('#taskbox .tab-pane').on('click', '[action="delay"]', function(){
		activePanel = $(this).parents('.tab-pane');
        $('#task-modal .modal-header h3').html(td_lang.inc.msg_145);
		ShowDialog('dialog',10);
		$.get("delay_time.php",{TC_ID:$(this).attr('item_id')}, function(data){
			$('#dialog_body').html(data);			
		});
        return false;
	});
	$('#task-modal').on('click', '#radiotime_2', function(){
		var delayday=$("#delayday").val();
		var now_date=$("#CUR_DATE").val();
		var radio=$(':input:radio:checked').val();
		if(delayday!="")
		{	  
			var delay_time_str=js_strto_time(now_date) + delayday*24*3600; 	     
			var delay_time_daystr=js_date_time(delay_time_str);
			var content=td_lang.inc.msg_160+" "+now_date+" "+td_lang.inc.msg_161+" "+delay_time_daystr;
			$("#showDelayTime").html(content);
		}
	});	
	$('#task-modal').on('blur', '#delayday', function(){
		var delayday=$("#delayday").val();
		var now_date=$("#CUR_DATE").val();
		var radio=$(':input:radio:checked').val();
		if(radio==2 && delayday!="")
		{	  
			var delay_time_str=js_strto_time(now_date) + delayday*24*3600;
			var delay_time_daystr=js_date_time(delay_time_str);
			var content=td_lang.inc.msg_160+" "+now_date+" "+td_lang.inc.msg_161+" "+delay_time_daystr;
			$("#showDelayTime").html(content);    	 
		}
	});   
	$('#task-modal').on('click', '#radiotime_1', function(){
		var delayhour=$("#delayhour").val();
		var now_date=$("#CUR_DATE").val();
		if(delayhour!="")
		{	  
			var delay_time_str=js_strto_time(now_date) + delayhour*3600;
			var delay_time_daystr=js_date_time(delay_time_str);
			var content=td_lang.inc.msg_160+" "+now_date+" "+td_lang.inc.msg_161+" "+delay_time_daystr;
			$("#showDelayTime").html(content);
		}
	});
	$('#task-modal').on('blur', '#delayhour', function(){      
		var delayhour=$("#delayhour").val();
		var now_date=$("#CUR_DATE").val();
		var radio=$(':input:radio:checked').val();
		if(radio==1 && delayhour!="")
		{
			var delay_time_str=js_strto_time(now_date) + delayhour*3600;
			var delay_time_daystr=js_date_time(delay_time_str);
			var content=td_lang.inc.msg_160+" "+now_date+" "+td_lang.inc.msg_161+" "+delay_time_daystr;
			$("#showDelayTime").html(content);  
		}	  
	});
	$('#task-modal').on('click', '#radiotime_3', function(){     
		var delaydate=$("#delaydate").val();
		var now_date=$("#CUR_DATE").val(); 
		if(delaydate!="")
		{
			var content=td_lang.inc.msg_160+" "+now_date+" "+td_lang.inc.msg_161+" "+delaydate;
			$("#showDelayTime").html(content);	
		}
		else
			$("#showDelayTime").html("");
	});
	$('#task-modal').on('blur', '#delaydate', function(){   
		var delaydate=$("#delaydate").val();
		var now_date=$("#CUR_DATE").val(); 
		var radio=$(':input:radio:checked').val();
		if(radio==3 && delaydate!="")
		{
			var content=td_lang.inc.msg_160+" "+now_date+" "+td_lang.inc.msg_161+" "+delaydate;
			$("#showDelayTime").html(content);
		}	
		else 
			$("#showDelayTime").html("");
	});   
	//推迟时间确定事件
	$('#task-modal').on('click', '#set_time', function(){    
		var delayday=$("#delayday").val();  	  
		var delayhour=$("#delayhour").val();
		var delaydate=$("#delaydate").val();
		var now_date=$("#CUR_DATE").val();
		var radio=$(':input:radio:checked').val();
		var delay_time_str='';
		var delay_time_daystr='';  
		if(radio==2 && delayday=="" || radio==1 && delayhour=="" || radio==3 && delaydate=="")
		{
			alert(td_lang.inc.msg_147);
			return false;
		}
		if(radio==2 && delayday!="" && !IsNumber(delayday) || radio==1 &&delayhour!="" && !IsNumber(delayhour))
		{
			alert(td_lang.inc.msg_148);
			return false;
		}
		if(delaydate!="" && radio==3)
		{   	  
			var nowdate=now_date.split(" ");    	     	      	  
			var v_date=nowdate[0].split("-");
			var v_time=nowdate[1].split(":");   
			var delay_time=delaydate.split(" ");
			var de_date=delay_time[0].split("-");
			var de_time=delay_time[1].split(":");
			var v_now=new Date(v_date[0],v_date[1],v_date[2],v_time[0],v_time[1],v_time[2]);
			var v_delay=new Date(de_date[0],de_date[1],de_date[2],de_time[0],de_time[1],de_time[2]);
			if(v_delay!="" && v_delay<v_now )
			{
				alert(td_lang.inc.msg_149);
				return false;
			}	 
		} 
		var item=$("#list_"+$(this).attr('tc_id')); 
		$.get("setData.php", {
			ACTION:$(this).attr('action'),
			TC_ID:$(this).attr('tc_id'),
			selectradio:$(':input:radio:checked').val(),
			delayhour:$('#delayhour').val(),
			delayday:$('#delayday').val(),
			delaydate:$('#delaydate').val(),
			curdaydate:$("#CUR_DATE").val()
			}, function(data){
			if(data == "1")
			{   
			    getCount();
				var p_id=activePanel.attr('id');
				if(p_id=="panel-inbox")
				{
					$('#delaytime').trigger("click");
					$('#next').trigger("click");
					$('#inbox').trigger("click");
				}
				if(p_id=="panel-next")
				{
					$('#delaytime').trigger("click");   
					$('#next').trigger("click");
				}
				if(p_id=="panel-delaytime")
				{
					$('#delaytime').trigger("click");
				}			
			
			}
		});
		HideDialog();
	});
	//右侧已推迟项目的推迟点击事件ljc
	$('#taskbox').on('click', '[action="delay_set"]', function(){    
		activePanel = $(this).parents('.tab-pane'); 
		$('#task-modal .modal-header h3').html(td_lang.inc.msg_145);
		ShowDialog('dialog',10);
		$.get("delay_time.php",{TC_ID:$(this).attr('item_id'),IS_DELAY:1}, function(data){
			$('#dialog_body').html(data);			
		});
		return false;
	});
	//右侧已推迟时间确定事件ljc
	$('#task-modal').on('click', '#set_time_delay', function(){   
	var delayday=$("#delayday").val();
	var delayhour=$("#delayhour").val();
	var delaydate=$("#delaydate").val();
	var now_date=$("#CUR_DATE").val();
	var radio=$(':input:radio:checked').val();
	if(radio==2 && delayday=="" || radio==1 && delayhour=="" || radio==3 && delaydate=="")
	{
		alert(td_lang.inc.msg_147);
		return false;
	}
	if(radio==2 && delayday!="" && !IsNumber(delayday) || radio==1 &&delayhour!="" && !IsNumber(delayhour))
	{
		alert(td_lang.inc.msg_148);
		return false;
	}
	if(delaydate!="" && radio==3)
	{   	  
		var nowdate=now_date.split(" ");    	     	      	  
		var v_date=nowdate[0].split("-");
		var v_time=nowdate[1].split(":");   
		var delay_time=delaydate.split(" ");
		var de_date=delay_time[0].split("-");
		var de_time=delay_time[1].split(":");
		var v_now=new Date(v_date[0],v_date[1],v_date[2],v_time[0],v_time[1],v_time[2]);
		var v_delay=new Date(de_date[0],de_date[1],de_date[2],de_time[0],de_time[1],de_time[2]);
		if(v_delay!="" && v_delay<v_now )
		{
			alert(td_lang.inc.msg_149);
			return false;
		}	 
	}     	 
	var item=$("#list_"+$(this).attr('tc_id')); 
	$.get("setData.php", {
        ACTION:$(this).attr('action'),
        TC_ID:$(this).attr('tc_id'),
        selectradio:$(':input:radio:checked').val(),
        delayhour:$('#delayhour').val(),
        delayday:$('#delayday').val(),
        delaydate:$('#delaydate').val()
	}, function(data){
		var p_id=activePanel.attr('id');
		if(data == "1")
		{   
		    getCount();
			if(p_id=="panel-delaytime")
			{
				$('#delaytime').trigger("click");
			}
		}			         
	});
	HideDialog();
});
	//右侧项目的忽略、恢复和删除点击事件
	$("#taskbox").on('click'," .btns-settings:not('[action='delay'],[action='delay_set'],[action='remind_delete'],[action='edit']')",  function(e){ 
		var item = $(this).parent().parent();
		var action =$(this).attr('action');	
		activePanel = $(this).parents('.tab-pane');	
		var p_id=activePanel.attr('id'); 
		if(action=="ignore")
		{
			if(!window.confirm(td_lang.inc.msg_164))
			return false;
		}
		else if(action=="deleted")
		{
			if(!window.confirm(td_lang.inc.msg_163))
			return false;
		}
		else if(action=="delay_reborn" || action=="reborn") 
		{
			if(!window.confirm(td_lang.inc.msg_165))
			return false;
		}		 
		$.get("setData.php", {ACTION:action, TC_ID:$(this).attr('item_id')}, function(data){
		if(data == "1")
		{
            $(item).fadeRemove();//lijun modified in 12/15
            getCount();
//			if(action=="deleted")
//			{
//				$('#ignored').trigger("click");
//			}
//			if(p_id=="panel-inbox")
//			{
//                $(item).fadeRemove();
//                getCount();
//			}
//			if(p_id=="panel-next")
//			{
//				$('#ignored').trigger("click");
//				$('#next').trigger("click");
//			}
//			if(p_id=="panel-delaytime")
//			{
////				$('#inbox').trigger("click");
////				$('#next').trigger("click");
////				$('#delaytime').trigger("click");
//
//                $(item).fadeRemove();
//                getCount();
//			}
//			if(p_id=="panel-ignored" && action=="reborn")
//			{
////				$('#inbox').trigger("click");
////				$('#next').trigger("click");
////				$('#ignored').trigger("click");
//
//                $(item).fadeRemove();
//                getCount();
//			}
			
		}
		else
			alert(data);
		});
		return false;
		
	});



    //提醒事项编辑和删除按钮注册点击事件处理函数
    $('#taskbox .tab-pane').on('click', '[action="edit"]', function(){
        $('#dialog_body').html("");
        $('#task-modal .modal-header h3').html(readdetail);//'编辑提醒事项标题
        ShowDialog('dialog',10);
        $.post("edit_remind.php",{TC_ID:$(this).attr('item_id'),remind_id:$(this).attr('remind_id')}, function(data){
            $('#dialog_body').html(data);
            $('#CONTENT').focus();
            getCount();
        });
        return false;
	});

    $('#taskbox .tab-pane').on('click', '[action="remind_delete"]', function(){
        var self = $(this);
        activePanel = $(this).parents('.tab-pane');
        var p_id=activePanel.attr('id');
        $.get("setReminder.php",{action:"del",TC_ID:$(this).attr('item_id'),remind_id:$(this).attr('remind_id')}, function(data){
            if(!window.confirm(td_lang.inc.msg_163))
                return false;
            self.parents('.task-item').fadeRemove();
            getCount();
        });
        return false;
	});    
   });

   
})(jQuery);

function init()
{
    getCount();
	//加载页面后打开第一个菜单
	jQuery('#count').trigger("click");
	jQuery('#inbox').trigger("click");
	
    jQuery('#panel-important').on('click', 'ul li', function(){
        var $a = jQuery(this).find('a:first');
        open($a.attr('href'));
        return false;
    });	
}
function getCount(){
    jQuery.ajax({
		type: 'GET',
		url: 'getCount.php',
		data: '',
		cache: false,
		success: function(data){   
		    if(data.inbox>0)
    			jQuery('#inbox em').text(""+data.inbox+"");
    		else
    			jQuery('#inbox em').text(" ");
    			
    	    if(data.next>0)
    			jQuery('#next em').text(""+data.next+"");
    		else
    			jQuery('#next em').text(" ");
    			
    	    if(data.delaytime>0)
    			jQuery('#delaytime em').text(""+data.delaytime+"");
    		else
    			jQuery('#delaytime em').text(" ");
    			
    	    if(data.ignored>0)
    			jQuery('#ignored em').text(""+data.ignored+"");
    		else
    			jQuery('#ignored em').text(" ");
    		
    		if(data.reminder>0)
    			jQuery('#reminder em').text(""+data.reminder+"");
    		else
    			jQuery('#reminder em').text(" ");
		}
    });
}
function newTaskWindow(TASK_INDEX,URL)
{
	window.open(URL+"?FROM_TASK_CENTER=1");	
}

function CreateNoTaskHTML()
{
	return '<div class="notask">'+td_lang.general.taskcenter.notask+'</div>';
}

function CreateItemHTML(INDEX, TASK, OP)
{
   var html = '';
   html+='<div id="list_'+TASK['TCID']+'" class="item item_'+INDEX+'">';       
   html+='   <div class="subject" item_id="'+TASK['TCID']+'" '+TASK['ATTR_NAME']+'="'+TASK['URL']+'"><div class="text">'+TASK['CONTENT']+'</div></div>';
   html+='   <div class="option">';
   if(OP == "0")
   {
      html+='      <a href="javascript:;" hidefocus="hidefocus" item_id="'+TASK['TCID']+'" class="delay" action="delay">'+td_lang.general.taskcenter.delay+'</a>';
      html+='      <a href="javascript:;" hidefocus="hidefocus" item_id="'+TASK['TCID']+'" class="ignore" action="ignore">'+td_lang.general.taskcenter.ignore+'</a>';
   }
   else if(OP=="2")
   {
   	 html+='      <a href="javascript:;" hidefocus="hidefocus" item_id="'+TASK['TCID']+'" class="delay_reborn" action="delay_reborn">'+td_lang.general.taskcenter.reborn+'</a>';
       html+='      <a href="javascript:;" hidefocus="hidefocus" item_id="'+TASK['TCID']+'" class="delay_set" action="delay_set">'+td_lang.general.taskcenter.delay+'</a>';
   }
   else
   {
      html+='      <a href="javascript:;" hidefocus="hidefocus" item_id="'+TASK['TCID']+'" class="reborn" action="reborn">'+td_lang.general.taskcenter.reborn+'</a>';
      html+='      <a href="javascript:;" hidefocus="hidefocus" item_id="'+TASK['TCID']+'" class="deleted" action="deleted">'+td_lang.general.taskcenter.deleted+'</a>';
   }
   html+='   </a></div>';
   html+='</div>';
   return html;
}
jQuery(document).on('click', "a.PickColor", function()
{
      document.form1.STYLE.value = jQuery(this).attr("index");
      jQuery(this).siblings().removeClass("PickColorActive");
      jQuery(this).addClass("PickColorActive");
});
function IsNumber(str)
{
   return str.match(/^[0-9]*$/)!=null;
} 
function js_strto_time(str_time){
    var new_str = str_time.replace(/:/g,'-');
    new_str = new_str.replace(/ /g,'-');
    var arr = new_str.split("-");
    var datum = new Date(Date.UTC(arr[0],arr[1]-1,arr[2],arr[3]-8,arr[4],arr[5]));
     strtotime = datum.getTime()/1000;
   return strtotime;
}

function js_date_time(unixtime) {
    var timestr = new Date(parseInt(unixtime) * 1000); 
    var years=timestr.getFullYear();
    var months=timestr.getMonth()+1>9?timestr.getMonth()+1:"0"+(timestr.getMonth()+1);
    var days=timestr.getDate()>9?timestr.getDate():"0"+timestr.getDate();
    var hours=timestr.getHours()>9?timestr.getHours():"0"+timestr.getHours();
    var minuts=timestr.getMinutes()>9?timestr.getMinutes():"0"+timestr.getMinutes();
    var seconds=timestr.getSeconds()>9?timestr.getSeconds():"0"+timestr.getSeconds();
    var datetime=years+"-"+months+"-"+days+" "+hours+":"+minuts+":"+seconds;
    return datetime;
}  
function onlades() {
	document.form1.CONTENT.focus();
}  
//工作流转交后的callback   {  status: 'success', flowId: '35', prcsId: '1', runId: '1', prcsName: '',msg: '转交成功'  }
function flowCallback(ret){
    if(ret && ( ret.status == 'success' || ret.status == 'turned' )){
        var $target = jQuery('.task-item[data-run-id='+ret.runId+'][data-flow-id='+ret.flowId+'][data-prcs-id='+ret.prcsId+']');
        var size = $target.size(),
        $em = jQuery('.nav .active a').find('em');
        $target.remove();
        var num = parseInt($em.html() || 0, 10);
        $em.html( num-size <= 0 ? '' : (num-size) ); 
    }
}