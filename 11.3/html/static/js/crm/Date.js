/**
  *	 function �ж��ַ����Ƿ������ڸ�ʽ
  *  ֧�ָ�ʽ YYYY-MM-DD 
  *  @params  dateStr  �ַ���
  *	 @return  true	����ȷ�����ڸ�ʽ
  *           false ������ȷ�����ڸ�ʽ
  *
  */

Date.isDateString = function(dateStr){
	var temp	  = dateStr.replace(/(\s+$)|(^\s+)/g,"");	
	var reg		  = new RegExp("^\\d{4}\\-\\d{1,2}\\-\\d{1,2}$","g");
    var monthDays = [0,31,28,31,30,31,30,31,31,30,31,30,31];
	
	if(!reg.test(temp)){
		return false;
	}

	var dates = temp.split("-");
	var year  = parseFloat(dates[0]);
	var month = parseFloat(dates[1]);
	var day	  = parseFloat(dates[2]);
	
	if(((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)){
		monthDays[2] = 29;
	}

	if(month < 1 || month > 12){
		return false;
	}

	if(day < 1 || day > monthDays[month]){
		return false;
	}

	return true;
}

/**
  *	 function �ж��ַ����Ƿ���ʱ���ʽ
  *  ֧�ָ�ʽ YYYY-MM-DD  HH:mm:SS
  *  @params  timeStr  �ַ���
  *	 @return  true	����ȷ��ʱ���ʽ
  *           false ������ȷ��ʱ���ʽ
  *
  */
Date.isTimeString = function(timeStr){
	var temp = timeStr.replace(/(\s+$)|(^\s+)/g,"");
	temp	 = temp.replace(/\s+/g," ");
	var reg	 = new RegExp("^\\d{4}\\-\\d{1,2}\\-\\d{1,2}(\\s)+\\d{2}:\\d{2}:\\d{2}$","g");
	
	if(!reg.test(timeStr)){
		return false;
	}
	var times = temp.split(" ");
	if(!Date.isDateString(times[0])){
		return false;
	}else{
		var times	= times[1].split(":");
		var hour	= parseFloat(times[0]);
		var minute  = parseFloat(times[1]);
		var second  = parseFloat(times[2]);

		if(hour < 0 || hour > 23){
			return false;
		}
		if(minute < 0 || minute > 59){
			return false;
		}
		if(second < 0 || second > 59){
			return false;
		}
	}

	return true;
}
/**
  *	 function �ַ���ת������������
  *  ֧�ָ�ʽ YYYY-MM-DD 
  *           YYYY-MM-DD HH:mm:ss
  *  @params   dateStr  �ַ���
  *	 @return   Date����
  *
  */
Date.parseString  = function(dateStr, formatter){
    var temp = dateStr.replace(/(\s+$)|(^\s+)/g,"");
	temp	 = temp.replace(/\s+/g," ");

	if(formatter == null || formatter == "YYYY-MM-DD"){
		var dates = temp.split("-");
		var year  = parseFloat(dates[0]);
		var month = parseFloat(dates[1])-1;
		var day	  = parseFloat(dates[2]);

		return new Date(year, month, day);

	}
    
    if(formatter == "YYYY-MM-DD HH:mm:ss"){
      	var temp	= temp.split(" ");
		var dates	= temp[0].split("-");
		var year	= parseFloat(dates[0]);
		var month	= parseFloat(dates[1])-1;
		var day		= parseFloat(dates[2]);
		      
		var hour	= "0";
		var minute  = "0";
		var second  = "0";
        
		if(temp[1] != null){
			var times	= temp[1].split(":")
			var hour	= (times[0] != null) ? parseFloat(times[0]) : "00";
			var minute  = (times[1] != null) ? parseFloat(times[1]) : "00";
			var second  = (times[2] != null) ? parseFloat(times[2]) : "00";
		}

		return new Date(year, month, day, hour, minute, second);
	}
}

/**
  *	 function �����ַ�������Date����
  *  @params   dateStr  �����ַ���YYYY-MM-DD
  *			   timeStr  ʱ���ַ���HH:mm:SS
  *	 @return   Date����
  *
  */
Date.create = function(dateStr, timeStr){
    if(timeStr == null){
        return Date.parseString(dateStr, "YYYY-MM-DD");
	}else{
        return Date.parseString(dateStr + " " + timeStr, "YYYY-MM-DD HH:mm:ss");
	}
}



/**
  *	 function  �Ƚ�����ʱ��Ĵ�С(�Ƚϵ���)
  *  @params   first  ����Ƚϵĵ�һ��ʱ��
  *			   second ����Ƚϵĵڶ���ʱ��
  *	 @return   �������ֵ����0,first����second
  *			   �������ֵС��0,first����second
  *			   �������ֵ����0,first����second
  */
Date.compare = function(first, second){
	var temp1 = (typeof first  == 'string') ? Date.parseString(first,	"YYYY-MM-DD HH:mm:ss") : first;
	var temp2 = (typeof second == 'string') ? Date.parseString(second,	"YYYY-MM-DD HH:mm:ss") : second; 

	return temp1.diff('s', temp2);
}

 /*
  *	 function  �ж�����ʱ�������Ƿ��ص�
  *  @params   firstStart   firstEnd		��һ��ʱ������
  *            secondStart  secondEnd		�ڶ���ʱ������
  *	 @return   false ���ص�
  *			   true  �ص�			   
  *	
  */
Date.isOverLap = function(firstStart, firstEnd, secondStart, secondEnd){
	if(Date.compare(firstStart, firstEnd) == 0 || Date.compare(secondStart, secondEnd) == 0){
		return false;
	}
	
	if(Date.compare(firstEnd, secondStart) >= 0 || Date.compare(secondEnd, firstStart) >= 0){
		return false;
	}
	return true;
}



 /*
  *	 function  �ж�ʱ���Ƿ���ĳ��������
  *  @params   firstStart   firstEnd		��һ��ʱ������
  *            secondStart  secondEnd		�ڶ���ʱ������
  *	 @return   false ���ص�
  *			   true  �ص�			   
  *	
  */
Date.prototype.isInRange = function(startTime, endTime){
	if(this.compare(startTime) > 0 || this.compare(endTime) < 0){
		return false;
	}
	return true;
}

/**
  *	 function  �Ƚ�ʱ��Ĵ�С(�Ƚϵ���)
  *  @params   compareDate  ����Ƚϵ�ʱ��
  *	 @return   �������ֵ����0,����compareDate
  *			   �������ֵС��0,����compareDate
  *			   �������ֵ����0,����compareDate
  */
Date.prototype.compare = function(compareDate){
	var temp = (typeof compareDate  == 'string') ? Date.parseString(compareDate,	"YYYY-MM-DD HH:mm:ss") : compareDate;
	return this.diff('s', temp);
}



/**
  *	 function  ��ʽ��������ڶ���(y|Y -- �� M -- �� d|D -- �� h|H -- Сʱ m -- �� s|S ��)
  *  @params   formatStr  ��������ڸ�ʽ
  *	 @return   ��ʽ���������ַ���
  */

Date.prototype.format = function(formatStr) {
	var str = formatStr;
	var week = ['��','һ','��','��','��','��','��'];

	str = str.replace(/yyyy|YYYY/, 	this.getFullYear());
	str = str.replace(/yy|YY/g,		(this.getYear() % 100 > 9) ?  ((this.getYear() % 100).toString()) : ('0' + this.getYear() % 100));

	str = str.replace(/MM/,			((this.getMonth()+1) > 9) ? ((this.getMonth()+1).toString()) : ('0' + (this.getMonth()+1)));
	str = str.replace(/M/g,       	this.getMonth()+1);

	str = str.replace(/w|W/g,		week[this.getDay()]);
	
	str = str.replace(/dd|DD/,		(this.getDate() > 9) ? (this.getDate().toString()) : ('0' + this.getDate()));
	str = str.replace(/d|D/g,      	this.getDate());

	str = str.replace(/hh|HH/,		(this.getHours() > 9) ? (this.getHours().toString()) : ('0' + this.getHours()));
	str = str.replace(/h|H/g,      	this.getHours());

	str = str.replace(/mm/,			(this.getMinutes() > 9) ? (this.getMinutes().toString()) : ('0' + this.getMinutes()));
	str = str.replace(/m/g,		 	this.getMinutes());

	str = str.replace(/ss|SS/,		(this.getSeconds() > 9) ? (this.getSeconds().toString()) : ('0' + this.getSeconds()));
	str = str.replace(/s/g,		 	this.getSeconds());

	return str;
}

/**
  *	 function	���һ����ʱ����
  *  @params	interval  ���(s|S �� m �� h|H Сʱ d|D ���� w|W ���� M �� q|Q ���� y|Y ��
  *				number    �����
  *	 @return	���һ��ʱ����������ڶ���
  */
Date.prototype.add = function(interval, number){
	var temp = this;

	switch(interval){
	case 's'	: 
	case 'S'	:
		return new Date(Date.parse(temp) + (1000 * number));
	case 'm'	:
		return new Date(Date.parse(temp) + (1000 * 60 * number));
	case 'h'	: 
	case 'H'	:
		return new Date(Date.parse(temp) + (1000 * 60 * 60 * number));
	case 'd'	:
	case 'D'	:
		return new Date(Date.parse(temp) + (1000 * 60 * 60 * 24 * number));
	case 'w'	: 
	case 'W'	:
		return new Date(Date.parse(temp) + (1000 * 60 * 60 * 24 * 7 * number));
	case 'M'	:
		return new Date(temp.getFullYear(), (temp.getMonth()) + number, temp.getDate(), 
									temp.getHours(), temp.getMinutes(), temp.getSeconds());
	case 'q'	:
	case 'Q'	: 
		return new Date(temp.getFullYear(), (temp.getMonth()) + number * 3, temp.getDate(), 
									temp.getHours(), temp.getMinutes(), temp.getSeconds());
	case 'y'	:
	case 'Y'	:
		return new Date(temp.getFullYear() + number, temp.getMonth(), temp.getDate(), temp.getHours(), temp.getMinutes(), temp.getSeconds());
	}

}

/**
  *	 function	����һ����ʱ����
  *  @params	interval  ���(s|S �� m �� h|H Сʱ d|D ���� w|W ���� M �� q|Q ���� y|Y ��
  *				number    �����
  *	 @return	����һ��ʱ����������ڶ���
  */
Date.prototype.minus = function(interval, number){
	var temp = this;

	switch(interval){
	case 's'	: 
	case 'S'	:
		return new Date(Date.parse(temp) - (1000 * number));
	case 'm'	:
		return new Date(Date.parse(temp) - (1000 * 60 * number));
	case 'h'	: 
	case 'H'	:
		return new Date(Date.parse(temp) - (1000 * 60 * 60 * number));
	case 'd'	:
	case 'D'	:
		return new Date(Date.parse(temp) - (1000 * 60 * 60 * 24 * number));
	case 'w'	: 
	case 'W'	:
		return new Date(Date.parse(temp) - (1000 * 60 * 60 * 24 * 7 * number));
	case 'M'	:
		return new Date(temp.getFullYear(), (temp.getMonth()) - number, temp.getDate(), 
									temp.getHours(), temp.getMinutes(), temp.getSeconds());
	case 'q'	:
	case 'Q'	: 
		return new Date(temp.getFullYear(), (temp.getMonth()) - number * 3, temp.getDate(), 
									temp.getHours(), temp.getMinutes(), temp.getSeconds());
	case 'y'	:
	case 'Y'	:
		return new Date(temp.getFullYear() - number, temp.getMonth(), temp.getDate(), temp.getHours(), temp.getMinutes(), temp.getSeconds());
	}
}

/**
  *	 function	�����������ڲ�
  *  @params	interval  ���(s|S �� m �� h|H Сʱ d|D ���� w|W ���� M �� q|Q ���� y|Y ��
  *	 @return	������������֮��ļ����
  */
Date.prototype.diff = function(interval, otherDate){
	var temp = this;

	switch(interval){
	case 's'	: 
	case 'S'	:
		return parseInt((otherDate - temp)/1000);
	case 'm'	:
		return parseInt((otherDate - temp)/(1000 * 60));
	case 'h'	: 
	case 'H'	:
		return parseInt((otherDate - temp)/(1000 * 60 * 60));
	case 'd'	:
	case 'D'	:
		return parseInt((otherDate - temp)/(1000 * 60 * 60 * 24));
	case 'w'	: 
	case 'W'	:
		return parseInt((otherDate - temp)/(1000 * 60 * 60 * 24 * 7));
	case 'M'	:
		return (otherDate.getFullYear() - temp.getFullYear()) * 12 + (otherDate.getMonth() - temp.getMonth());
	case 'y'	:
	case 'Y'	:
		return otherDate.getFullYear() - temp.getFullYear();

	}
}


