var now = new Date();                    //当前日期      
var nowDayOfWeek = now.getDay();         //今天本周的第几天      
var nowDay = now.getDate();              //当前日      
var nowMonth = now.getMonth();           //当前月      
var nowYear = now.getYear();             //当前年      
nowYear += (nowYear < 2000) ? 1900 : 0;  //    

//上一年开始日期
function getPrevYearStart(){
	return nowYear-1+'-01-01';
}
//上一年结束日期
function getPrevYearEnd(){
	return nowYear-1+'-12-31';
}
//当前年开始日期
function getCurYearStart(){
	return nowYear+'-01-01';
}
//当前年结束日期
function getCurYearEnd(){
	return nowYear+'-12-31';
}
//下一年开始日期
function getNextYearStart(){
	return nowYear+1+'-01-01';
}
//下一年结束日期
function getNextYearEnd(){
	return nowYear+1+'-12-31';
}
//格式化日期：yyyy-MM-dd      
function formatDate(date) {  
    var myyear = date.getFullYear();      
    var mymonth = date.getMonth()+1;      
    var myweekday = date.getDate();       
          
    if(mymonth < 10){      
        mymonth = "0" + mymonth;      
    }       
    if(myweekday < 10){      
        myweekday = "0" + myweekday;      
    }      
    return (myyear+"-"+mymonth + "-" + myweekday);       
}       
     
//获得某月的天数      
function getMonthDays(myMonth){      
    var monthStartDate = new Date(nowYear, myMonth, 1);       
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);       
    var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);       
    return   days;       
}      
     
//获得本季度的开始月份      
function getQuarterStartMonth(){      
    var quarterStartMonth = 0;      
    if(nowMonth<3){      
       quarterStartMonth = 0;      
    }      
    if(2<nowMonth && nowMonth<6){      
       quarterStartMonth = 3;      
    }      
    if(5<nowMonth && nowMonth<9){      
       quarterStartMonth = 6;      
    }      
    if(nowMonth>8){      
       quarterStartMonth = 9;      
    }      
    return quarterStartMonth;      
}
  //获得昨天日期
function getPrevDay(){
	var date = new Date(nowYear, nowMonth, nowDay-1);       
    return formatDate(date); 
}
  //获得今天日期
function getCurDay(){
	var date = new Date(nowYear, nowMonth, nowDay);       
    return formatDate(date); 
}
  //获得明天日期
function getNextDay(){
	var date = new Date(nowYear, nowMonth, nowDay+1);       
    return formatDate(date); 
}
//获得上周的开始日期      
function getPrevWeekStartDate() {       
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek-7);       
    return formatDate(weekStartDate);      
}
//获得上周的结束日期      
function getPrevWeekEndDate() {       
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)-7);       
    return formatDate(weekEndDate);      
}       
  
//获得本周的开始日期      
function getCurWeekStartDate() {       
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);       
    return formatDate(weekStartDate);      
}       
     
//获得本周的结束日期      
function getCurWeekEndDate() {       
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));       
    return formatDate(weekEndDate);      
}       
//获得下周的开始日期      
function getNextWeekStartDate() {       
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+7);       
    return formatDate(weekStartDate);      
}
//获得下周的结束日期      
function getNextWeekEndDate() {       
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)+7);       
    return formatDate(weekEndDate);      
}       
    
//获得上月的开始日期      
function getPrevMonthStartDate(){      
    var monthStartDate = new Date(nowYear, nowMonth-1, 1);       
    return formatDate(monthStartDate);      
}  
//获得上月的结束日期      
function getPrevMonthEndDate(){      
    var monthEndDate = new Date(nowYear, nowMonth-1, getMonthDays(nowMonth));       
    return formatDate(monthEndDate);      
} 
//获得本月的开始日期      
function getCurMonthStartDate(){      
    var monthStartDate = new Date(nowYear, nowMonth, 1);       
    return formatDate(monthStartDate);      
}      
     
//获得本月的结束日期      
function getCurMonthEndDate(){      
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));       
    return formatDate(monthEndDate);      
} 
//获得下月的开始日期      
function getNextMonthStartDate(){      
    var monthStartDate = new Date(nowYear, nowMonth+1, 1);       
    return formatDate(monthStartDate);      
} 
//获得下月的结束日期      
function getNextMonthEndDate(){      
    var monthEndDate = new Date(nowYear, nowMonth+1, getMonthDays(nowMonth));       
    return formatDate(monthEndDate);      
}  
  //获得上季度的开始日期      
function getPrevQuarterStartDate(){      
          
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth()-3, 1); 
    return formatDate(quarterStartDate);      
} 

//或的上季度的结束日期      
function getPrevQuarterEndDate(){      
    var quarterEndMonth = getQuarterStartMonth() + 2;      
    var quarterStartDate = new Date(nowYear, quarterEndMonth-3, getMonthDays(quarterEndMonth-3));       
    return formatDate(quarterStartDate);      
}  

//获得本季度的开始日期      
function getCurQuarterStartDate(){   
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);       
    return formatDate(quarterStartDate);      
}      
     
//或的本季度的结束日期      
function getCurQuarterEndDate(){      
    var quarterEndMonth = getQuarterStartMonth() + 2;      
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));       
    return formatDate(quarterStartDate);      
}      
   
//获得下季度的开始日期      
function getNextQuarterStartDate(){  
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth()+3, 1);       
    return formatDate(quarterStartDate);      
} 

//或的下季度的结束日期      
function getNextQuarterEndDate(){      
    var quarterEndMonth = getQuarterStartMonth() + 2;      
    var quarterStartDate = new Date(nowYear, quarterEndMonth+3, getMonthDays(quarterEndMonth+3));       
    return formatDate(quarterStartDate);      
} 