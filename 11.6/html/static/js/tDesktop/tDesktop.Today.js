define('tDesktop/tDesktop.Today',function(require, exports, module){
    var $ = window.jQuery;
    require('backbone');
    var Deskdate = Backbone.View.extend({
        el: $('.dateArea'), 
        events: {
            'click div#date': 'openCal',
            'click div#mdate': 'openCal',
            'click div#time_area': 'openTime'
        },
        initialize: function(){
            _.bindAll(this, 'openCal', 'openTime'); 
            var solarTerm=sTerm(OA_TIME.getFullYear(), OA_TIME.getMonth(), OA_TIME.getDate());
            if(solarTerm != "")
                $('#mdate').text(solarTerm);  
        },
        openCal: function(){
            $().addTab('dt_date', td_lang.inc.msg_25, "/module/calendar2/", true);//"万年历"
        },
        openTime: function(){
            $().addTab('dt_time_area', td_lang.inc.msg_26, "/module/world_time/", true);//"世界时间"
        }
    });
    var Weather = Backbone.View.extend({
        el: $('#weatherarea'),
        events: {            
            'click #changecity': 'change',
            'click #saveWeather': 'render',
            'click #closeWeather': 'close'
        },
        initialize: function(){
            _.bindAll(this, 'change', 'render', 'close');
            var self = this;
            self.init();
            $('#weather').delegate('#showWeather', 'click', function(){
                self.render();
            });
        },
        init: function(){
            var self = this;
            if(bInitWeather)
            {
                InitProvince(weatherCity);
                if($('#weather').text() == ""){
                    $('#weather').html(sprintf('<a id="showWeather" href="javascript:;">%s</a>', td_lang.inc.msg_141));
                }
                else{
                    self.render(1,weatherCity);
                }
            }
            else{
                $(".city").hide();
                $('#weather').html("<span style='width: 100%;text-align: center;color: #999;display: block;'>" + weathertip + "</span>");
            }
        },
        change: function(){
            $('#area_select').show();
            $('#weather,#city').hide();
        },
        render: function(beUpdate,WEATHER_CITY){
            $("#city").text("");
            beUpdate = '1';
            var WEATHER_CITY = $("#w_county option:selected").val();
            if(WEATHER_CITY.length != 6)
            {
                alert(td_lang.inc.msg_29);
                return;
            }
            var w_province = $("#w_province option:selected").text();
            var w_city = $("#w_city option:selected").text();
            var w_county = $("#w_county option:selected").text();
            var WEATHER_CITY = [w_province, w_city, w_county].join("_");
            $.ajax({
                type: 'GET',
                url: '/inc/weather.php',
                data: {'WEATHER_CITY':WEATHER_CITY, 'UPDATE':beUpdate,'VIEW': 'e'},
                dataType: 'json',
                success: function(data)
                {
                    $("#city").text(w_county);
                    $.each(data,function(k, v){
                        if(k == 0){
                            v.img1 = v.img1 < 10 ? "0"+v.img1 : v.img1;
                            v.img2 = v.img2 < 10 ? "0"+v.img2 : v.img2;
                            $('#weather').html($("#weather-templ").tmpl(v));
                        }
                    });
                },
                error: function (request, textStatus, errorThrown)
                {
                    $('#weather').html(td_lang.inc.msg_31 + request.status + " <a href=\"javascript:;\" id=\"saveWeather\" >"+td_lang.inc.msg_32+"</a> <a href=\"#\" id=\"closeWeather\" >"+td_lang.inc.msg_33+"</a>");
                }
            }); 
            $('#area_select').hide();
            $('#weather,#city').show();
        },
        close: function(){
            $('#area_select').hide();
            $('#weather').show();
        }
    });
    var Calendar = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
            var now = new Date(); 
            $.ajax({
                url:'/general/appbuilder/web/calendar/calendarlist/getcallist',
                data:{
                    starttime: now.setHours(0, 0, 0, 0)/1000,
                    endtime: now.setHours(23, 59, 0, 0)/1000,
                    view: "agendaDay",
					condition:1
                },
                async: true,
                type: 'post',
                success:function(d){
                    if(d.status ==1){
                        for(var a in d.data){
                            d.data[a].shortstart=d.data[a].start.split(" ")[1]
                            $("#calendar-template").tmpl(d.data[a]).appendTo('#cal_list');                      

                        }
                          
                    }
                    else{
                        $("#caltip").show();
                    }
                    
                }
            });     
        }
    });
    var Reminder = Backbone.View.extend({
        initialize: function(){
            this.render();
        },
        render: function(){
            $.ajax({
                url:'/general/task_center/getReminder.php',
                data: "",
                async: true,
                type: 'get',
                success:function(d){
                    if(d.length > 0){
                        $.each(d,function(k, v){
                            $("#reminder-template").tmpl(v).appendTo('#remind_list');
                        });  
                    }
                    else{
                        $("#remindtip").show();
                    }
                    
                }
            });     
        }
    }); 
    exports.Today = {
        Deskdate: Deskdate,
        Weather: Weather,
        Calendar: Calendar,
        Reminder: Reminder
    };
});