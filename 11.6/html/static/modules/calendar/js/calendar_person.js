(function($){
    
    $.fn.calendarPopover = function(opts)
    {
        return this.each(function(){
            $(this).data('calendarPopover', new CalendarPopover( $(this), opts ));
        });
    }
    $.fn.calendarPopover.defaults = {
        title: '',
        container: window,
        content: ''
    };
    var CalendarPopover = function()
    {
        this.init.apply(this, arguments);
    }

    CalendarPopover.prototype.init = function(el, cfg)
    {
        this.$el = el;
        var opts = this.options = $.extend(true, {}, $.fn.calendarPopover.defaults, cfg);
        this.$container = $(opts.container);
        this.$content = this.$el.find('.popover-content');
        opts.content && this.setContent(opts.content)
        this.bindEvent();
    };    
    CalendarPopover.prototype.bindEvent = function()
    {
        var self = this,
            $el = this.$el,
            opts = this.options;
        $el.on('click', '[data-cmd]', function()
        {
            var act = this.getAttribute('data-cmd'),
                cb = opts.callbacks || {};
            if( act && cb[act] && cb[act]() == false )
            {
                return false;
            };
            self.hide();
        });        
    };
    CalendarPopover.prototype.setCallbacks = function(callbacks)
    {
        this.options.callbacks = callbacks;
    }
    CalendarPopover.prototype.show = function($target)
    {
        var $pop = this.$el,
            $container = this.$container,
            cWidth = $container.width(),
            cHeight = $container.height(),
            tWidth = $target.width(),
            pWidth = $pop.width(),
            pos = $target.offset(),
            arr = ['top','bottom','left','right'],
            dirc = 'left';
 /*
        console && console.dir({
            target: $target[0],
            'pos.left': pos.left,
            tWidth: tWidth,
            pWidth: pWidth,
            cWidth: cWidth,
            left: pos.left + tWidth + pWidth > cWidth - 100,
            right: pos.left + tWidth + pWidth < cWidth - 100,
            h : $pop.height(),
            top: pos.top
        })*/
        if(pos.left + tWidth + pWidth < cWidth)
        {
            $pop.css({
                top: pos.top + ( $target.height() - $pop.height() )/2,
                left: pos.left + tWidth + 5
            })
            dirc = 'right';
        }
        else if((pos.left + tWidth + pWidth > cWidth) && (pos.left > pWidth) )
        {
            $pop.css({
                top:  pos.top + ( $target.height() - $pop.height() )/2 - 5,
                left: pos.left - pWidth - 5
            })
            dirc = 'left';
        }
		else if(pos.top < $pop.height())
		{
			$pop.css({
                top:  pos.top + $target.height(),
                left: pos.left + ( tWidth - pWidth )/2
            })
            dirc = 'bottom';
        }
		else
		{
			$pop.css({
                top:  pos.top - $target.height(),
                left: pos.left + ( tWidth - pWidth )/2
            })
            dirc = 'top';
        }
        
        $pop.removeClass(arr.join(' ')).addClass(dirc + ' in show');
    };
    CalendarPopover.prototype.setContent = function(c)
    {
        this.$content.html(c);
    };
    CalendarPopover.prototype.hide = function()
    {
        this.$el.removeClass('in show');
    };
})(jQuery);     
	$(document).ready(function() {
	    
    	    
	
        var quickCreat = $('#calendar-quick-setup').calendarPopover().data('calendarPopover');
        var quickDetail = $('#calendar-quick-detail').calendarPopover().data('calendarPopover');
        //var calendarSetup = $('#calendar-setup').modal().data('modal');
        //calendarSetup.hide();
        
        var clearView = function()
        {
            quickCreat.hide();
            quickDetail.hide();
        };
		var date = new Date();
		var d = date.getDate();
		var m = date.getMonth();
		var y = date.getFullYear();
		//var log = function(){ console && console.log(arguments) };
		var to_time = function(d){
            if(!d){
                return null;
            }
            var vYear = d.getFullYear();
            var vMon = d.getMonth() + 1;
            var vDay = d.getDate();
            var h = d.getHours(); 
            var m = d.getMinutes(); 
            //var se = d.getSeconds(); 
            datetime=vYear+"-"+(vMon<10 ? "0" + vMon : vMon)+"-"+(vDay<10 ? "0"+ vDay : vDay)+" "+(h<10 ? "0"+ h : h)+":"+(m<10 ? "0" + m : m);
            return datetime;
        };
        var to_time_seconds = function(d){
            if(!d){
                return null;
            }
            var vYear = d.getFullYear();
            var vMon = d.getMonth() + 1;
            var vDay = d.getDate();
            var h = d.getHours(); 
            var m = d.getMinutes(); 
            var se = d.getSeconds(); 
            datetime=vYear+"-"+(vMon<10 ? "0" + vMon : vMon)+"-"+(vDay<10 ? "0"+ vDay : vDay)+" "+(h<10 ? "0"+ h : h)+":"+(m<10 ? "0" + m : m)+":"+(se<10 ? "0"+se : se);
            return datetime;
        };
        var drag_edit = function(cal_id, type, start_time, end_time)
        {
            start_time = start_time.getTime()/1000;
            end_time = end_time ? end_time.getTime()/1000 : 0;
            $.ajax({
               type: 'POST',
               url:'drag_save.php',
               data:{
                    cal_id:cal_id,
                    type:type,
                    start_time:start_time,
                    end_time:end_time
                    },
               async: true,
               success:function(d){
                   var data = d;
                   if(data.status=="success")
                   {
                       calendar.removeEvents(cal_id);
                            $.each(data.events, function(){
                                calendar.renderEvent(this ,true);
                            }); 
                   }
                }
            });
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

           // returnTime=returnTime.toString();
           // returnTime =  returnTime.replace(/-/g,"/");
            return returnTime;
        };
		var dateLangConfigs = {
			monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
            monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
            dayNamesShort: ['日','一','二','三','四','五','六']
		};
        var calendar_form_reset = function(){
            var cur_time = new Date();
            var curdate = cur_time.getFullYear() + '-' + (cur_time.getMonth()+1) + '-' + cur_time.getDate()
            var cur_hours = cur_time.getHours();
            var cur_minutes = cur_time.getMinutes();
            if(cur_minutes > 30)
            {
                cur_minutes = 0;
                cur_hours = cur_hours +1;
            }
            else
            {
                cur_minutes = 30;
            }
            cur_hours = (cur_hours >= 10) ? cur_hours : '0'+cur_hours;
            cur_minutes = (cur_minutes > 10) ? cur_minutes : '0'+cur_minutes;
            
            var cal_begin_time = cur_hours + ':' + cur_minutes;
            var cur_end_minutes = (cur_minutes == 30) ? parseInt(cur_minutes + 29) : parseInt(cur_minutes + 30);
            var cal_end_time = cur_hours + ':' + cur_end_minutes;
            
            $("#CAL_CONTENT").focus();
            $("#color").show();
            $('#CAL_CONTENT').val("");
            $('#CAL_TYPE').val("1");
            $('#START_DATE').val(curdate);
            $('#START_TIME').val(FormatTime(cal_begin_time));
            $('#EDN_DATE').val(curdate);
            $('#END_TIME').val(FormatTime(cal_end_time));
            $("#allDayCheckbox1").prop('checked',false);
            $("#repeatCheckbox1").prop('checked',false);
            $("#endCheckbox1").prop('checked',true);
            $('#endtimeArea1').show();
            $('#OWNER1').show();
            $('#remindTime').show();
            $('#repeatType1').hide();
            $('#repeat3').hide();
            $('#TAKER').val("");
            $('#TAKER_NAME').val("");
            $("#OWNER").val("");
            $("#OWNER_NAME").val("");
            $("#color").css({"background-color":"rgb(58, 135, 173)"});
            $("#myModal h3").text("新建日程");
            $("#CAL_ID").val("");
        };
		$.fn.datepicker.dates = {
			days: dateLangConfigs['dayNames'],
			daysShort: dateLangConfigs['dayNamesShort'],
			daysMin: dateLangConfigs['dayNamesShort'],
			months: dateLangConfigs['monthNames'],
			monthsShort:  dateLangConfigs['monthNamesShort']
		};

		window.calendar = $('#calendar').fullCalendar(
        {
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
            monthNames: dateLangConfigs['monthNames'],
            monthNamesShort: dateLangConfigs['monthNamesShort'],
            dayNames: dateLangConfigs['dayNames'],
            dayNamesShort: dateLangConfigs['dayNamesShort'],
            buttonText: {
                prev: "<span class='fc-text-arrow'>&lsaquo;</span>",
                next: "<span class='fc-text-arrow'>&rsaquo;</span>",
                prevYear: "<span class='fc-text-arrow'>&laquo;</span>",
                nextYear: "<span class='fc-text-arrow'>&raquo;</span>",
                today: '今天',
                month: '月',
                week: '周',
                day: '日'
            },
            firstDay: 1,
            allDayText: '跨天',
            defaultView: 'agendaWeek',
            titleFormat: {
                month: 'yyyy年MMM月',
                week: "yyyy年MMM月d日{ '&#8212;' [ yyyy年][MMM月]d日}",
                day: 'yyyy年MMM月d日, dddd'
            },
            timeFormat: {
                agenda: 'H:mm{ – H:mm}',
                month: 'H:mm'
            },
            columnFormat: {
                month: 'ddd',
                week: 'M.d dddd',
                day: 'M/d dddd'
            },
            axisFormat: 'H',
			editable: true,
            selectable: true,
			selectHelper: true,
			minTime: $("#cal_starttime").val(),
			maxTime: $("#cal_endtime").val(),
            unselectCancel: '.popover, .modal, .datepicker, .timepicker',
			select: function(start, end, allDay, jsEvent, view) 
            {
                
                quickDetail.hide();
       
				var title = '',
                    $target;
                            
                if($(jsEvent.target).is('.fc-select-helper'))
                {
                    $target = $(jsEvent.target);
                }
                else if($(this.element).find('.fc-select-helper').first().size())
                {
                    $target = $(this.element).find('.fc-select-helper').first();
                } 
                else
                {
                    $target = $(jsEvent.target);
                }
                quickCreat.show($target);
                $('#quick-calendar-title').val('');   
                $('#quick-calendar-title').focus();
                //$('#quick-calendar-title').val(title);
                //$('#quick-calendar-title').val(originalTitle);
                var start_new = to_time(start).split(" ");
                var end_new = to_time(end).split(" ");
                var show_date_type = arguments[2] ? '1' : '0';
                
                if(arguments[2] == true)
                {
                    $('#quick-begin-time').html(start_new[0]);
                    if(to_time(start) == to_time(end))
                    {
                        $('#quick-finish-time').html("");
                        $('#quick-name').html("");
                    }
                    else
                    {
                        $('#quick-name').html("至");
                        $('#quick-finish-time').html(end_new[0]);
                    }
                }
                else
                {
                    $('#quick-begin-time').html(to_time(start));
                    $('#quick-name').html("至");
                    $('#quick-finish-time').html(to_time(end));
                }
                
                quickCreat.setCallbacks({
                    ok: function()
                    {
                        var newTitle = $('#quick-calendar-title').val();
                        var sms_remind = $("#SMS_REMIND_QUICK").prop('checked')==true ? 1 : 0;
                        if(newTitle=="")
                        {
                            alert("事务内容不能为空");
                            return false;
                        }
                        else
                        { 
                            $.ajax({
                               type: 'get',
                                url:'add_cal.php',
                                data: {
                                    content:newTitle,
                                    starttime:start.getTime()/1000,
                                    endtime:end.getTime()/1000,
                                    op:'add',
                                    repeat:0,
                                    alldayflag:allDay ? 1 : 0,
                                    smsremind:sms_remind,             //快速新建的添加提醒 --yzx
                                    calcolor:'0'                              
                                },
                                async: true,
                                success:function(d){
                                    if(d.status == 'success')
                                    {    
                                        $.each(d.events, function(){
                                            calendar.renderEvent(this ,true);
                                            calendar.render();
                                        });                        
                                    }
                                    else
                                    {
                                        alert( d.msg || "新建失败");
                                    }  
                                }
                            });
                        }
                    },
                    cancel: function()
                    {
                        calendar.unselect();                     
                    },
                    editmore: function()
                    {
                        calendar_form_reset();
                        if(show_date_type == '1')
                        {
                            $("#START_DATE").val(start_new[0]);
                            $("#EDN_DATE").val(end_new[0]);
                            $("#allDayCheckbox1").prop('checked',true);
                            $("#endCheckbox1").prop('checked',true);
                            
                            $("#endtimeArea1").show();
                            $("#startInput1").hide();
                            $("#endInput1").hide();
                        }
                        else
                        {
                            $("#START_DATE").val(start_new[0]);
                            $("#EDN_DATE").val(end_new[0]);
                            $("#endCheckbox1").prop('checked',true);
                            $("#allDayCheckbox1").prop('checked',false);
                            $("#endtimeArea1").show();
                            $("#startInput1").show();
                            $("#endInput1").show();
                            $("#START_TIME").val(FormatTime(start_new[1]));
                            $("#END_TIME").val(FormatTime(end_new[1]));
                        }
                        $("#CAL_CONTENT").val($('#quick-calendar-title').val());
                        
                        $("#myModal").modal('show');
                    }
                });
			},
            unselect: function()
            {
                clearView();
            },
            viewRender :function()
            {
                clearView();
                $(".weekdropdown").removeClass("weekdropdown-open");
                var viewname=$('#calendar').fullCalendar('getView').name;
                if(viewname=="month"){
                    $("#weekbtn,#setup").hide();
                    $(".fc-header-title").removeClass("in");
                    $(".fc-header-title .calendar-enddate").css("width","125px");
                }
                else if(viewname=="agendaWeek"){
                    $("#weekbtn,#setup").show();
                    $(".fc-header-title").addClass("in");
                    var tt=$('#calendar').fullCalendar('getDate');
                    var time,week,checkDate = new Date(tt);
                    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
                    time = checkDate.getTime();
                    checkDate.setMonth(0);
                    checkDate.setDate(1);
                    week=Math.floor(Math.round((time-checkDate)/86400000)/7)+1;
                    $(".weekcurrent").html("第"+week+"周");
                    $("#dropdownwrapper a").removeClass("currentblock");
                    $("#week"+week).addClass("currentblock");
                    $("#weekhidden").val(week);
                    $("#dropdownwrapper div").css("display","none");
                    $(".currentblock").parent().css("display","block");
                    var newyear=tt.getFullYear();
                    var newmonth = tt.getMonth() + 1;
                    if(week==1 && newmonth==12)
                    {
                        newyear+=1;
                    }                  
                    $("#years option:selected").removeAttr("selected");
                    $("#years option[value="+newyear+"]").prop("selected", 'selected');
                }
                else if(viewname=="agendaDay"){
                    $("#weekbtn").hide();
                    $("#setup").show();
                    $(".fc-header-title").removeClass("in");
                    $(".fc-header-title .calendar-enddate").css("width","245px");
                }
            },
            events: function(start, end, callback){
                $.ajax({
                    url:'get_cal_list.php',
                    data:{
                        starttime: start.getTime()/1000,
                        endtime: end.getTime()/1000,
                        view:$('#calendar').fullCalendar('getView').name
                    },
                    async: true,
                    type: 'get',
                    success:function(d){
                        callback(d);
                    }
                })
            },
            eventClick: function(calEvent, jsEvent, view)
            {
                var begin_date = calEvent['start'];
                var end_date = calEvent['end'];
                var cal_id = calEvent['id'];
                var views = calEvent['type'];
                var begin_date1 = to_time(begin_date);
                var end_date1 = to_time(end_date);
                $(".cal_control").html("");
                if(calEvent['creator'] && calEvent['creator']!=="")
                {
                    var creator = calEvent['creator'];
                	$(".cal_control").append('<a class="creatorwrapper">由<span class="creator">'+creator+'</span>创建</a>');
                	if(calEvent['owner'] && calEvent['owner']!==""){
                	    var owner = calEvent['owner'];
                        if(owner !== ""){
                            $(".cal_control").append('<a class="ownerwrapper">由<span class="owner" title="'+owner+'">'+owner+'</span>管理</a>');
                        }
                	}
                }
                $("#calendar-quick-detail h5").text(calEvent['originalTitle']);                
                $("#BEGIN_TIME").text(begin_date1);
                if(end_date1){
                    $('#TO_SPAN').show();
                    $("#FINISH_TIME").show().text(end_date1); 
                }else{
                    $('#TO_SPAN').hide();                    
                    $("#FINISH_TIME").hide().text(end_date1); 
                }
                if(end_date1=="4009-11-30 00:00"){
                    $('#TO_SPAN').hide();
                    $("#FINISH_TIME").hide().text(end_date1); 
                };
                calEvent.urls=="" ? $("#detail").hide() : $("#detail").show();
                if(calEvent['type']=="calendar") 
                {
                    $("#statuslist").show();
                    $("#edit-id").val(cal_id);                    
                    if(calEvent['overstatus']=="0")
                    {   //sxm 2014-12-16 状态添加颜色
                        $("#status").text("未完成");  
                        if(calEvent['state']=="已超时"){
                            $("#state").css("color","#ff0000");
                        }else if (calEvent['state']=="进行中"){
                            $("#state").css("color","#06a509");
                        }else{
                            $("#state").css("color","#999999");
                        }

                        $("#state").text(calEvent['state']);
                        $("#no-finished > i").addClass("icon-dropdown-checkbox icon-dropdown-checkbox-checked");
                        $("#finished > i").removeClass();
                    }
                    else
                    {
                        $("#status").text("已完成");
                        $("#finished > i").addClass("icon-dropdown-checkbox icon-dropdown-checkbox-checked");
                        $("#no-finished > i").removeClass();
                    }  
                }
                else
                {
                    $("#statuslist").hide();
                }
                if(calEvent.edit==1)
                {
                    $("#edit").show();
                }
                else
                {
                    $("#edit").hide();
                }
                if(calEvent.dele==1)
                {
                    $("#delete").show();
                }
                else
                {
                    $("#delete").hide();
                }                            
                var $event = $(this);    
                quickDetail.show($event);    
                quickDetail.setCallbacks({
                    edit: function()
                    { 
                        if(calEvent.type != 'task')
                        {
                            $.ajax({
                                url:'get_cal_detail.php',
                                data:{
                                    id:cal_id,
                                    view:views
                                    },
                                async: true,
                                type: 'get', 
                                success:function(d){
                                    calendar_form_reset();
                                    var data = d;
                                    var all_day = "";
                                    var repeat = views=="affair" ? true : false;
                                    $("#endtimeArea1").show();
                                    if(data.allday==1)
                                    {
                                        all_day = true;
                                        $("#startInput1").hide();
                                        $("#endInput1").hide();
                                        if(data.end_date != '')
                                        {
                                            $("#EDN_DATE").val(data.end_date); 
                                        }                                                                                                                
                                    }
                                    else
                                    {
                                        all_day = false;
                                        $("#START_TIME").show();
                                        if(data.end_date == '')
                                        {
                                            $("#endtimeArea1").hide(); 
                                            $("#endCheckbox1").prop('checked',false);
                                        }
                                        else
                                        {
                                            $("#endtimeArea1").show();
                                            $("#END_TIME").show();
                                            $("#endCheckbox1").prop('checked',true);
                                            $("#END_TIME").val(data.end_time);
                                            $("#EDN_DATE").val(data.end_date);
                                        }
                                        $("#START_TIME").val(data.cal_time);
                                    }
                                    $("#myModal h3").text("编辑日程");
                                    $("#START_DATE").val(data.cal_date);
                                    $("#CAL_CONTENT").val(data.content);
                                    $("#BEFORE_DAY").val(data.before_day);
                                    $("#BEFORE_HOUR").val(data.before_hour);
                                    $("#BEFORE_MIN").val(data.before_min);
                                    $("#TAKER").val(data.taker);
                                    $("#TAKER_NAME").val(data.taker_name);
                                    $("#OWNER").val(data.owner);
                                    $("#OWNER_NAME").val(data.owner_name);
                                    $("#CAL_TYPE").val(data.cal_type || 1);
                                    $("#allDayCheckbox1").prop('checked',all_day);
                                    $("#repeatCheckbox1").prop('checked',repeat);
                                    $("#COLOR_FIELD").val(data.cal_level);
                                    $("#CAL_ID").val(data.cal_id);
                                    $("#TYPE_ID").val(views);
                                    $("#CALSTATUS").val(data.over_status);
									$("#GET_REPEAT").val(repeat);
									
                                	if(data.cal_level != '0' && data.cal_level != '')
                                	{
                                	    $("#color").css({"background-color":$('.color'+data.cal_level).css('background-color')});
                                	}
                                	else
                                	{
                                	    $("#color").css({"background-color":$('.color').css('background-color')});
                                	}
                                    
                                    if(views=="affair")
                                    {
                                        $("#color").hide();
                                        $("div[id^=repeat]").hide();
                                        $("#remindTime").hide();
                                        $("#OWNER1").hide();
                                        $("#repeatType1").show();
                                        $("#TYPE").val(data.type);
                                        $("#repeat"+data.type).show();
                                        $("#REMIND_DATE"+data.type).val(data.remind_date);
                                        $("#REMIND_TIME"+data.type).val(data.remind_time);
                                        if(data.type==5)
                                        {
                                            var remind = data.remind_date.split("-");
                                            $("#REMIND_DATE5_MON").val(remind[0]);
                                            $("#REMIND_DATE5_DAY").val(remind[1]);
                                        }
                                        
                                         var aff_type="repeat"+data.type;
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
                                   
                                }
                            });
                            $("#myModal").modal('show');
                        }
                        else
                        {
                            window.open("../info/task_edit.php?TASK_ID="+calEvent.id+'&FROM=2',"oa_sub_window","height=500,width=850,status=0,toolbar=no,menubar=no,location=no,left=150,top=40,scrollbars=yes,resizable=yes");   
                            
                        }
                    },
                    cancel: function()
                    {   
                        clearView();                     
                    },
                    'delete': function()
                    {
                        if( confirm('删除后无法恢复，确认删除？'))
                        {
                            $.get("op_calendar.php",{id:cal_id,type:views,op:'del'},function(d){
                                var data = d;
                               if(data.status=="success")
                               {
                                    //alert("删除成功");
                                    calendar.removeEvents(cal_id);
                               }
                               else
                                {
                                    alert("删除失败");
                                } 
                            });
                        }
                    },
                    'detail': function()
                    {
                        var URL = calEvent.urls;
                        window.open(URL);
                    }
                    
                });
                //$("#statuslist").mouseover($("#status_menu").show()).mouseout($("#status_menu").hide());
                $("#statuslist").bind("mouseover",function(){$("#status_menu").show()});
                $("#statuslist").bind("mouseout",function(){$("#status_menu").hide()});
                 
                
                jsEvent.stopPropagation();
            },
            eventDragStart: function(event, jsEvent, ui, view)
            {
                clearView();
            },
            eventDragStop: function(event)
            {
                clearView();
            },
            eventDrop: function(event)
            {
                clearView();
				drag_edit(event.id, event.type, event.start, event.end);
            },
            eventResizeStart: function(event)
            {
                //log('rs', this, arguments);
            },
            eventResize: function()
            {
				drag_edit(arguments[0]['id'], arguments[0]['type'], arguments[0]['start'], arguments[0]['end']);
            }
		}).data('fullCalendar');
        
		$('.calendar-startdate, .calendar-enddate').datepicker({
		   format: "yyyy-m-d"
		}); 
		$('.calendar-starttime, .calendar-endtime').timepicker({ 
		   minuteStep: 5
		});
		$("#allDayCheckbox").change(function (){
          var ischecked = $(this).prop('checked');
          if (ischecked) 
		  {
             $("#startInput").hide();
			 $("#endInput").hide();
          } 
		  else 
		  {
             $("#startInput").show();
			 $("#endInput").show();
          }
        })

		$("#endCheckbox").change(function (){
          var ischecked = $(this).prop('checked');
          if (ischecked) 
		  {
             $("#endtimeArea").show();
          } 
		  else 
		  {
             $("#endtimeArea").hide();
          }
        })
		$("#repeatCheckbox").change(function (){
          var ischecked = $(this).prop('checked');
          if (ischecked) 
		  {
             $("#repeatType").show();
          } 
		  else 
		  {
             $("#repeatType").hide();
          }
        })

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
        })

		$("#endCheckbox1").change(function (){
          var ischecked = $(this).prop('checked');
          if (ischecked) 
		  {
             $("#endtimeArea1").show();
          } 
		  else 
		  {
             $("#endtimeArea1").hide();
          }
        })
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
        })

		$("#allDayCheckbox2").change(function (){
          var ischecked = $(this).prop('checked');
          if (ischecked) 
		  {
             $("#startInput2").hide();
			 $("#endInput2").hide();
          } 
		  else 
		  {
             $("#startInput2").show();
			 $("#endInput2").show();
          }
        })

		$("#endCheckbox2").change(function (){
          var ischecked = $(this).prop('checked');
          if (ischecked) 
		  {
             $("#endtimeArea2").show();
          } 
		  else 
		  {
             $("#endtimeArea2").hide();
          }
        })
		$("#repeatCheckbox2").change(function (){
          var ischecked = $(this).prop('checked');
          if (ischecked) 
		  {
             $("#repeatType2").show();             
          } 
		  else 
		  {
             $("#repeatType2").hide();
          }
        })
		$("#color").click(function(){
          $("#color_menu").slideToggle();
        });
        $("a[id^=calcolor]").each(function(i){
    	    $(this).click(function(){
    	        $("#color").css({"background-color":$(this).css('background-color')});
    	        $("#COLOR_FIELD").val($(this).attr('index'));
                $("#color_menu").hide();
    	    })
    	});
		$("#newAffair").click(function(){
          calendar_form_reset();
        });

        $("#save").click(function(){
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
			var get_repeat = $("#GET_REPEAT").val();
            var startime = "";
            var endtime = "";
            if(cal_id!="")
            {
                if(allday)
                {
                    if(end)
                    {
                        starttime = start_d + ' 00:00:00';
                        endtime = end_d + " 23:59:59";
                    }
                    else
                    {
                        starttime = start_d + ' 00:00:00';
                        endtime = start_d + " 23:59:59";
                    }
                }
                else
                {
                    if(end)
                    {
                        starttime = start_d + " " + start_t;
                        endtime = end_d + " " + end_t;
                    }
                    else
                    {
                        starttime = start_d + " " + start_t;
                        endtime = "";
                    }
                }
                
                op = "edit";
            }
            else
            {
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
                    alert("结束时间不能晚于开始时间！");
                    return;
                }
            }

            if(cal_content=="")
            {
                alert("事务内容不能为空");
            }
            else
            {
                function getdate(time) {
                    time = new Date(time * 1000);
                    var y = time.getFullYear(),
                        m = time.getMonth() + 1,
                        d = time.getDate();
                    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
                }
                var crossDayFlag = 0;
                getdate(start_time).substr(5) != getdate(end_time).substr(5)?crossDayFlag = 1:crossDayFlag = 0;
                $.ajax({
                    url:'add_cal.php',
                    data: {
                        cal_id:cal_id,
                        content:cal_content,
                        starttime:start_time,
                        endtime:end_time,
                        caltype:cal_type,
                        alldayflag:allday,
                        crossDay:crossDayFlag,
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
                        calendar_starttime:calendar.getView().visStart.getTime()/1000,
                        calendar_endtime:calendar.getView().visEnd.getTime()/1000,
			            view: calendar.getView().name,
			            overstatus:overstatus,
						get_repeat:get_repeat
                    },
                    async: true,
                    type: 'get',
                    success:function(d){
                        if(d.status == 'success')
                        {
                            if(op = "edit" && cal_id)
                            {
                                calendar.removeEvents(cal_id);
                            }
                            var dataInfo = $.extend({},d.events);  
                            $.each(dataInfo, function(){
                                this.allDay = this.crossDay;
                                calendar.renderEvent(this ,true);
                            });
                        
                            $("#myModal").modal('hide');
                        }
                        else
                        {
                            alert( d.msg || "新建失败");
                        }    
                    }                    
                });
            }    
            
        });
        $("#finished").bind("click",function(){
            var cal_id = $("#edit-id").val();
            var starttime = $("#BEGIN_TIME").text();
            var endtime = $("#FINISH_TIME").text();
                    $.get("op_calendar.php",{id:cal_id,over_status:1,op:'change'},function(d){
                        if(d.status=="success")
                        {
                            $("#status").text("已完成");
                            $("#state").text(""); //sxm 2014-12-16
                            $("#finished > i").addClass("icon-dropdown-checkbox icon-dropdown-checkbox-checked");
                            $("#no-finished > i").removeClass(); 
                            calendar.removeEvents(cal_id);
                            $.each(d.events, function(){
                                calendar.renderEvent(this ,true);
                            });                           
                        }
                        else
                        {
                            alert("修改失败");
                        }    
                    })
                });
                $("#no-finished").bind("click",function(){
                    var cal_id = $("#edit-id").val();
                    var starttime = $("#BEGIN_TIME").text();
                    var endtime = $("#FINISH_TIME").text();
                    $.get("op_calendar.php",{id:cal_id,over_status:0,op:'change'},function(d){
                        if(d.status=="success")
                        {
                            var cal_status = "";
                            var curtime = to_time(new Date());
                            //  sxm 2014-12-16 选择未完成状态的显示
                            if(curtime > endtime)
                            {   
                                cal_status = "已超时"; 
                                $("#state").css("color","#ff0000")  
                            }
                            else if(curtime < starttime)
                            {
                                cal_status = "未开始";
                                $("#state").css("color","#999999")                                  
                            } 
                            else
                            {
                                cal_status = "进行中";
                                $("#state").css("color","#06a509")  
                            }                               
                            $("#state").text(cal_status);
                            
                            $("#no-finished > i").addClass("icon-dropdown-checkbox icon-dropdown-checkbox-checked");
                            $("#finished > i").removeClass(); 
                            calendar.removeEvents(cal_id);
                            $.each(d.events, function(){
                                calendar.renderEvent(this ,true);
                            });                         
                        }
                        else
                        {
                            alert("修改失败");
                        }    
                    })
                });
        var weekid = $("#cur_week").val();
        var curmonth = $("#cur_month").val();
        var curday = $("#cur_day").val();
        var block = $("#cur_block").val();
        var curyear = $("#cur_year").val()        
        var $week=$('<div id=\"weekbtn\"><div class=\"weekcurrent\">第'+weekid+'周</div><div class=\"weekdropdown\"><span class="poparrow"></span><select class=\"span2\" id=\"years\"></select><div id=\"dropdownwrapper\"></div><span id=\"icon-chevron-left\" class=\"prebtn icon-chevron-left\"></span><span id=\"icon-chevron-right\" class=\"nextbtn icon-chevron-right\"></span></div></div>');
        $week.insertAfter(".fc-header-title");
        
        for(var $i=2000;$i<2030;$i++){
            var op = "";
            if($i==$("#cur_year").val())
            {
                 op = "selected";
            }
            $("#years").append("<option value='"+$i+"' "+op+">"+$i+"</option>");
        }
        var $newbutton=$("<button type=\"button\" class=\"btn\" data-toggle=\"modal\" data-target=\"#myModal\" id=\"newAffair\">新建</button><button type=\"button\" class=\"btn btn-primary\" id=\"searchButton\" onclick=\"location='query.php'\">查询</button>");
        $newbutton.insertBefore($(".fc-button-month"));
        $(document).click(function(){
            $(".weekdropdown").css("display","none");
            $("#weekbtn").css("background","none");
        });
        $("#weekbtn").hover(function(){
            $(this).css("background","#EBEBEB");
        }).click(function(event){
            $(this).css("background","#EBEBEB");
            event.stopPropagation();
            $(".weekdropdown").show();
        });
        $("#weekhidden").val(weekid);
        (function(){
            for(var i=0;i<4;i++){
                var $blocks=$("<div style=\"display:none\"></div>");
                $blocks.attr("id","blocks"+i);
                $("#dropdownwrapper").append($blocks);
                for(var j=0;j<16;j++){
                    var $block=$("<a href=\"javascript:;\"></a>");
                    $blocks.append($block);
                }
            }
            for(var k=0;k<$("#dropdownwrapper a").length-11;k++){
                m=k+1;
                $("#dropdownwrapper a")[k].id="week"+m;
                $("#dropdownwrapper a")[k].setAttribute("index",m);
                $("#dropdownwrapper a")[k].innerHTML="第"+m+"周";
                $("#dropdownwrapper a")[k].className="weekblock";
                if(weekid == m)
                {
                    $("#week"+m).addClass("currentblock"); 
                }  
            }
        })();
        $("#blocks"+block).css("display","block");
        $("#icon-chevron-left").click(function(){
            for(var n=1;n<$("#dropdownwrapper div").length;n++){
                if($("#dropdownwrapper div")[n].style.display=="block"){
                    $("#dropdownwrapper div")[n].style.display="none";
                    $("#dropdownwrapper div")[n-1].style.display="block";
                }
            }
        });
        $("#icon-chevron-right").click(function(){
            for(var w=0;w<$("#dropdownwrapper div").length-1;w++){
                if($("#dropdownwrapper div")[w].style.display=="block"){
                    $("#dropdownwrapper div")[w].style.display="none";
                    $("#dropdownwrapper div")[w+1].style.display="block";
                    return;
                }
            }
        });
        $("#dropdownwrapper a").bind("click",function(){
            var index = $(this).attr("index");
            var indexActive = $("#dropdownwrapper .currentblock").attr("index");
            
            var years = $("#years").val();
            var date=new Date(years,"0","1");
            var time=date.getTime();
            time+=(index-1)*7*24*3600000;
            date.setTime(time);
            var day=date.getDay();
            var time=date.getTime();
            time+=(1-day)*24*3600000;
            date.setTime(time);
            $("#calendar").fullCalendar("gotoDate",date.getFullYear(),date.getMonth(),date.getDate());
                
            var block = Math.floor(index/16);
            $("#dropdownwrapper a").removeClass("currentblock");
            $("#week"+index).addClass("currentblock");
            $(".weekcurrent").html("第"+index+"周");
            $("#weekhidden").val(index);
        });
        $(".fc-header-title").append('<input class="calendar-enddate valtype" type="button" style="width:125px;" value="time" data-valtype="placeholder" hidefocus="true"/>');
        $('.calendar-enddate').datepicker({
            format: "yyyy-m-dd"
        }); 
        var returndate = $('.fc-header-title .calendar-enddate').on('changeDate', function(ev){
            var newDate = new Date(ev.date);
            $("#calendar").fullCalendar("gotoDate",newDate);
        });
        $(document).click(function(){
            $('.fc-header-title h2').css("background","none");
        });
        
        $("#newAffair").click(function(){calendar_form_reset();})
        $('.fc-header-title input').hover(function(){
            $('.fc-header-title h2').css("background","#EBEBEB");
        }).click(function(event){
            $('.fc-header-title h2').css("background","#EBEBEB");
            event.stopPropagation();
        });
        function setNewtime(){
            var curdate=$('#calendar').fullCalendar('getDate');
            var yearopt=curdate.getFullYear();
            var monthopt=curdate.getMonth()+1;
            var datopt=curdate.getDate();
            $('.calendar-enddate').datepicker('setValue',yearopt+'-'+monthopt+'-'+datopt);
        }
        $(".fc-button-prev").click(function(){
            var weekpre=Number($("#weekhidden").val());
            if(weekpre==0){
                weekpre=52;
                var preopt=$("#years option:selected").prev();
                $("#years option:selected").removeAttr("selected");
                preopt.prop("selected", 'selected');
            }
            $(".weekcurrent").html("第"+weekpre+"周");
            $("#dropdownwrapper a").removeClass("currentblock");
            $("#week"+weekpre).addClass("currentblock");
            $("#weekhidden").val(weekpre);
            $("#dropdownwrapper div").css("display","none");
            $(".currentblock").parent().css("display","block");
            setNewtime();
        });
        $(".fc-button-next").click(function(){
            var weeknext=Number($("#weekhidden").val());
            if(weeknext==53){
                weeknext=1;
                var nextopt=$("#years option:selected").next();
                $("#years option:selected").removeAttr("selected");
                nextopt.prop("selected", 'selected');
            }
            $(".weekcurrent").html("第"+weeknext+"周");
            $("#dropdownwrapper a").removeClass("currentblock");
            $("#week"+weeknext).addClass("currentblock");
            $("#weekhidden").val(weeknext);
            $("#dropdownwrapper div").css("display","none");
            $(".currentblock").parent().css("display","block");
            setNewtime();
        });
        $("#week53").click(function(){
            var opt=$("#years option:selected");
            $("#years option:selected").removeAttr("selected");
            opt.prop("selected", 'selected');
            $("#dropdownwrapper div").css("display","none");
            $("#blocks0").css("display","block");
            $("#dropdownwrapper a").removeClass("currentblock");
            $("#week1").addClass("currentblock");
            $(".weekcurrent").html("第1周");
            $("#weekhidden").val(1);
        });
        $(".fc-button-today").click(function(){
            $("#years option:selected").removeAttr("selected");
            $("#years option[value='"+curyear+"']").prop("selected", 'selected');
            $(".weekcurrent").html("第"+weekid+"周");
            $("#dropdownwrapper a").removeClass("currentblock");
            $("#week"+weekid).addClass("currentblock");
            $("#dropdownwrapper div").css("display","none");
            $(".currentblock").parent().css("display","block");
            $("#weekhidden").val(weekid);
            $('.calendar-enddate').datepicker('setValue',curyear+'-'+curmonth+'-'+curday);
        });
        $(".fc-header-left").append('<a class="btn" id="setup" href="#setup_panel" data-toggle="modal">设置</a>');
        $("#setup").click(function(){
            var startTime = $("#cal_starttime").val();
            var endTime = $("#cal_endtime").val();
            $("#timebegin").text(startTime+":00");
            $("#timeend").text(endTime+":00");
            $("#slider-range").slider({
                range: true,
                min: 0,
                max: 24,
                values: [startTime,endTime], 
                slide: function(event,ui)
                {
                    $("#timebegin").text(ui.values[0]+":00");
                    $("#timeend").text(ui.values[1]+":00");
                }
            });
        });
        $('.calendar-enddate').click(function(){
            var settt=$('#calendar').fullCalendar('getDate');
            var sety=settt.getFullYear();
            var setm=settt.getMonth() + 1;
            var setd=settt.getDate();
            $('.calendar-enddate').datepicker('setValue',sety+'-'+setm+'-'+setd);
        });                
                
	});