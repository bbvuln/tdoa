define('tDesktop19/tDesktop.Info',function(require, exports, module){
    var $ = window.jQuery;
    var Info = {
        init: function(){
            var self = this;
            self.bindEvent();
			if(bInitWeather)
            {
                InitProvince(weatherCity);
                if($('#weather').text() == ""){
                    $('#weather').html(sprintf('<a id="showWeather" href="javascript:;">%s</a>', td_lang.inc.msg_141));
                }
                else{
                    self.renderWeather(1,weatherCity);
                }
            }
            else{
                $(".city").hide();
                $('#weather').html("<span style='width: 100%;text-align: center;color: #999;display: block;'>" + weathertip + "</span>");
            }
        },
        bindEvent: function(){
            var self = this;
			//change online status
			$('#on_status').delegate(".user-status-item","click",function(){
                var status = $(this).attr('status');
                if(status < "1" || status > "4") return;
                $.get("ipanel/ispirit_api.php", {API:"on_status",CONTENT: status});
				$("#online_flag").attr("class","user-status tip-" + status);
			});
        },
		//get weather
        renderWeather:function(beUpdate,WEATHER_CITY){
            beUpdate = '1';
            var WEATHER_CITY = $("#w_county option:selected").val();
            if(WEATHER_CITY.length != 6){
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
                success: function(data){
                    $.each(data,function(k, v){
                        if(k == 0){
                            v.img1 = v.img1 < 10 ? "0"+v.img1 : v.img1;
                            v.img2 = v.img2 < 10 ? "0"+v.img2 : v.img2;
                            $('#weather').html($("#weather-templ").tmpl(v));
                        }
                    });
                    $("#info_avater #city").text(w_county);
                },
                error: function (request, textStatus, errorThrown){
                    $('#weather').html(td_lang.inc.msg_31 + request.status + " <a href=\"javascript:;\" id=\"saveWeather\" >"+td_lang.inc.msg_32+"</a> <a href=\"#\" id=\"closeWeather\" >"+td_lang.inc.msg_33+"</a>");
                }
            }); 
        }
		
    };
    exports.Info = Info;
});