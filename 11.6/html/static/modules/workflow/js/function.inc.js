Date.prototype.format = function(format){ 
var o = { 
"M+" : this.getMonth()+1, //month 
"d+" : this.getDate(), //day 
"h+" : this.getHours(), //hour 
"m+" : this.getMinutes(), //minute 
"s+" : this.getSeconds(), //second 
"q+" : Math.floor((this.getMonth()+3)/3), //quarter 
"S" : this.getMilliseconds() //millisecond 
} 

if(/(y+)/.test(format)) { 
format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
} 

for(var k in o) { 
if(new RegExp("("+ k +")").test(format)) { 
format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
} 
} 
return format; 
} 


/*
2013-9-10
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getTomorrow(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var month = now.getMonth() + 1;
    var day = now.getDate();
	if(time==true)
    {
    	var StartDate = new Date(year, month-1, day+1).format("yyyy-MM-dd hh:mm:ss");
    	var EndDate = new Date(year, month-1, day+1).format("yyyy-MM-dd");
		EndDate = EndDate + " 23:59:59";
    }
    else
    {
    	var StartDate = new Date(year, month-1, day+1).format("yyyy-MM-dd");
    	var EndDate = new Date(year, month-1, day+1).format("yyyy-MM-dd");
    }
	
	begin_time = StartDate; 
    end_time = EndDate;
    var timeArray = new Array();
    timeArray[0] = begin_time;
    timeArray[1] = end_time;
    return timeArray;
}
/*
2013-9-10
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getYesterday(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var month = now.getMonth() + 1;
    var day = now.getDate();
    
	if(time==true)
    {
    	var StartDate = new Date(year, month-1, day-1).format("yyyy-MM-dd hh:mm:ss");
    	var EndDate = new Date(year, month-1, day-1).format("yyyy-MM-dd");
		EndDate = EndDate + " 23:59:59";
    }
    else
    {
    	var StartDate = new Date(year, month-1, day-1).format("yyyy-MM-dd");
    	var EndDate = new Date(year, month-1, day-1).format("yyyy-MM-dd");
    }
	
	begin_time = StartDate; 
    end_time = EndDate;
    var timeArray = new Array();
    timeArray[0] = begin_time;
    timeArray[1] = end_time;
    return timeArray;
}
/*
2013-9-10
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getToday(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var month = now.getMonth() + 1;
    var day = now.getDate();
    if(month < 10)
    {
        month = "0" + month;
    }
    if(day < 10)
    {
        day = "0" + day;
    }
    begin_time = year + "-" + month + "-" + day; 
    end_time = year + "-" + month + "-" + day;
    if(time == true)
    {
        begin_time = begin_time + " 00:00:00";
        end_time   = end_time   + " 23:59:59";
    }    
    var timeArray = new Array();
    timeArray[0] = begin_time;
    timeArray[1] = end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getPrevQuarterly(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var now_month = now.getMonth() + 1;
	if(now_month / 3 <= 1)
	{
		var begin_time = year-1 + '-10-01';
		var end_time = year-1 + '-12-31';
	}
	else if(now_month / 3 <= 2)
	{
        var begin_time =year + '-01-01';;
		var end_time = year + '-03-31';	
	}
	else if(now_month / 3 <= 3)
	{
        var begin_time = year + '-04-01';
		var end_time = year + '-06-30';	
	}
	else if(now_month / 3 <= 4)
	{
        var begin_time = year + '-07-01';
        var end_time = year + '-09-30';	
	}
    if(time == true)
    {
        begin_time = begin_time + " 00:00:00";
        end_time   = end_time   + " 23:59:59";
    }
    var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getThisMonth(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var month = now.getMonth() + 1;//月          
	var get_day = new Date(year,month,0); 
    var day = get_day.getDate();
    if(month < 10){
        month = "0"+month;
    }
    var begin_time = year + "-" + month + "-01";
	var end_time =year + "-" + month + "-" + day;
    
    if(time == true)
    {
        begin_time = begin_time + " 00:00:00";
        end_time   = end_time   + " 23:59:59";
    }
    var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getPrevMonth(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var month = now.getMonth() + 1;//月
    if(month==1)
    {
        month=12;
        year -= 1;
    }
    else
    {
        month -= 1;
    }
    if(month<10)
    {
        month = "0" + month;
    }
    var get_day = new Date(year,month,0); 
    var day = get_day.getDate();
    var begin_time = year + "-" + month + "-0" + 1;
    var end_time = year + "-" + month + "-" +day;
    if(time == true)
    {
        begin_time = begin_time + " 00:00:00";
        end_time   = end_time   + " 23:59:59";
    }
    var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getPrevYear(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    year -= 1;//年
	var begin_time = year + "-01-01";
	var end_time = year + "-12-31";
    if(time == true)
    {
        begin_time = begin_time + " 00:00:00";
        end_time   = end_time   + " 23:59:59";
    }
    var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getThisQuarterly(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var now_month = now.getMonth() + 1;
	if(now_month / 3 <= 1)
	{
		var begin_time = year + '-01-01';;
		var end_time = year + '-03-31';
	}
	else if(now_month / 3 <= 2)
	{
		var begin_time = year + '-04-01';
		var end_time = year + '-06-30';
	}
	else if(now_month / 3 <= 3)
	{
		var begin_time = year + '-07-01';
		var end_time = year + '-09-30';
	}
	else if(now_month / 3 <= 4)
	{
		var begin_time = year + '-10-01';
		var end_time = year + '-12-31';	
	}
    if(time == true)
    {
        begin_time = begin_time + " 00:00:00";
        end_time   = end_time   + " 23:59:59";
    }
    var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getThisYear(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var begin_time = year + "-01-01";              
	var end_time = year + "-12-31";
    if(time == true)
    {
        begin_time = begin_time + " 00:00:00";
        end_time   = end_time   + " 23:59:59";
    }
	var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getThisWeek(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var month = now.getMonth() + 1;
    var this_day=now.getDate();
    var week=(now.getDay() == 0) ? 6 : now.getDay() - 1;
	if(time==true)
    {
    	var weekStartDate = new Date(year, month-1, this_day - week).format("yyyy-MM-dd hh:mm:ss");
    	var weekEndDate = new Date(year, month-1, this_day + (6 - week)).format("yyyy-MM-dd");
		weekEndDate = weekEndDate + " 23:59:59";
    }
    else
    {
    	var weekStartDate = new Date(year, month-1, this_day - week).format("yyyy-MM-dd");
    	var weekEndDate = new Date(year, month-1, this_day + (6 - week)).format("yyyy-MM-dd");
    }
    var begin_time = weekStartDate;
    var end_time = weekEndDate;
    var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}
/*
2013-9-9
booble time : true:gettime(yyyy-mm-dd hh:mm:ss);false:(yyyy-mm-dd)
name:yzx
return:array();array[0]:begin_time;array[1]:end_time;
*/
function getPrevWeek(time)
{
    var now = new Date();
	var year = now.getFullYear();//年
    var month = now.getMonth() + 1;
    var this_day=now.getDate();
    var week=(now.getDay() == 0) ? 6 : now.getDay() - 1;
    if(time==true)
    {
    	var weekStartDate = new Date(year, month-1, this_day - week-7).format("yyyy-MM-dd hh:mm:ss");
    	var weekEndDate = new Date(year, month-1, this_day + (6 - week)-7).format("yyyy-MM-dd");
		weekEndDate = weekEndDate + " 23:59:59";
    }
    else
    {
    	var weekStartDate = new Date(year, month-1, this_day - week-7).format("yyyy-MM-dd");
    	var weekEndDate = new Date(year, month-1, this_day + (6 - week)-7).format("yyyy-MM-dd");
    }
	var begin_time = weekStartDate;
	var end_time = weekEndDate;
    var timeArray = new Array();
    timeArray[0]=begin_time;
    timeArray[1]=end_time;
    return timeArray;
}