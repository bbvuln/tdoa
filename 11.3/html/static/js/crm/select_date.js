var now = new Date();                    //��ǰ����      
var nowDayOfWeek = now.getDay();         //���챾�ܵĵڼ���      
var nowDay = now.getDate();              //��ǰ��      
var nowMonth = now.getMonth();           //��ǰ��      
var nowYear = now.getYear();             //��ǰ��      
nowYear += (nowYear < 2000) ? 1900 : 0;  //    

//��һ�꿪ʼ����
function getPrevYearStart(){
	return nowYear-1+'-01-01';
}
//��һ���������
function getPrevYearEnd(){
	return nowYear-1+'-12-31';
}
//��ǰ�꿪ʼ����
function getCurYearStart(){
	return nowYear+'-01-01';
}
//��ǰ���������
function getCurYearEnd(){
	return nowYear+'-12-31';
}
//��һ�꿪ʼ����
function getNextYearStart(){
	return nowYear+1+'-01-01';
}
//��һ���������
function getNextYearEnd(){
	return nowYear+1+'-12-31';
}
//��ʽ�����ڣ�yyyy-MM-dd      
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
     
//���ĳ�µ�����      
function getMonthDays(myMonth){      
    var monthStartDate = new Date(nowYear, myMonth, 1);       
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);       
    var   days   =   (monthEndDate   -   monthStartDate)/(1000   *   60   *   60   *   24);       
    return   days;       
}      
     
//��ñ����ȵĿ�ʼ�·�      
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
  //�����������
function getPrevDay(){
	var date = new Date(nowYear, nowMonth, nowDay-1);       
    return formatDate(date); 
}
  //��ý�������
function getCurDay(){
	var date = new Date(nowYear, nowMonth, nowDay);       
    return formatDate(date); 
}
  //�����������
function getNextDay(){
	var date = new Date(nowYear, nowMonth, nowDay+1);       
    return formatDate(date); 
}
//������ܵĿ�ʼ����      
function getPrevWeekStartDate() {       
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek-7);       
    return formatDate(weekStartDate);      
}
//������ܵĽ�������      
function getPrevWeekEndDate() {       
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)-7);       
    return formatDate(weekEndDate);      
}       
  
//��ñ��ܵĿ�ʼ����      
function getCurWeekStartDate() {       
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);       
    return formatDate(weekStartDate);      
}       
     
//��ñ��ܵĽ�������      
function getCurWeekEndDate() {       
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));       
    return formatDate(weekEndDate);      
}       
//������ܵĿ�ʼ����      
function getNextWeekStartDate() {       
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+7);       
    return formatDate(weekStartDate);      
}
//������ܵĽ�������      
function getNextWeekEndDate() {       
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)+7);       
    return formatDate(weekEndDate);      
}       
    
//������µĿ�ʼ����      
function getPrevMonthStartDate(){      
    var monthStartDate = new Date(nowYear, nowMonth-1, 1);       
    return formatDate(monthStartDate);      
}  
//������µĽ�������      
function getPrevMonthEndDate(){      
    var monthEndDate = new Date(nowYear, nowMonth-1, getMonthDays(nowMonth));       
    return formatDate(monthEndDate);      
} 
//��ñ��µĿ�ʼ����      
function getCurMonthStartDate(){      
    var monthStartDate = new Date(nowYear, nowMonth, 1);       
    return formatDate(monthStartDate);      
}      
     
//��ñ��µĽ�������      
function getCurMonthEndDate(){      
    var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));       
    return formatDate(monthEndDate);      
} 
//������µĿ�ʼ����      
function getNextMonthStartDate(){      
    var monthStartDate = new Date(nowYear, nowMonth+1, 1);       
    return formatDate(monthStartDate);      
} 
//������µĽ�������      
function getNextMonthEndDate(){      
    var monthEndDate = new Date(nowYear, nowMonth+1, getMonthDays(nowMonth));       
    return formatDate(monthEndDate);      
}  
  //����ϼ��ȵĿ�ʼ����      
function getPrevQuarterStartDate(){      
          
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth()-3, 1); 
    return formatDate(quarterStartDate);      
} 

//����ϼ��ȵĽ�������      
function getPrevQuarterEndDate(){      
    var quarterEndMonth = getQuarterStartMonth() + 2;      
    var quarterStartDate = new Date(nowYear, quarterEndMonth-3, getMonthDays(quarterEndMonth-3));       
    return formatDate(quarterStartDate);      
}  

//��ñ����ȵĿ�ʼ����      
function getCurQuarterStartDate(){   
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);       
    return formatDate(quarterStartDate);      
}      
     
//��ı����ȵĽ�������      
function getCurQuarterEndDate(){      
    var quarterEndMonth = getQuarterStartMonth() + 2;      
    var quarterStartDate = new Date(nowYear, quarterEndMonth, getMonthDays(quarterEndMonth));       
    return formatDate(quarterStartDate);      
}      
   
//����¼��ȵĿ�ʼ����      
function getNextQuarterStartDate(){  
    var quarterStartDate = new Date(nowYear, getQuarterStartMonth()+3, 1);       
    return formatDate(quarterStartDate);      
} 

//����¼��ȵĽ�������      
function getNextQuarterEndDate(){      
    var quarterEndMonth = getQuarterStartMonth() + 2;      
    var quarterStartDate = new Date(nowYear, quarterEndMonth+3, getMonthDays(quarterEndMonth+3));       
    return formatDate(quarterStartDate);      
} 