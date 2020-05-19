/**
  *	 function 判断字符串是否是日期格式
  *  支持格式 YYYY-MM-DD 
  *  @params  dateStr  字符串
  *	 @return  true	是正确的日期格式
  *           false 不是正确的日期格式
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
  *	 function 判断字符串是否是时间格式
  *  支持格式 YYYY-MM-DD  HH:mm:SS
  *  @params  timeStr  字符串
  *	 @return  true	是正确的时间格式
  *           false 不是正确的时间格式
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
  *	 function 字符串转换成日期类型
  *  支持格式 YYYY-MM-DD 
  *           YYYY-MM-DD HH:mm:ss
  *  @params   dateStr  字符串
  *	 @return   Date对象
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
  *	 function 根据字符串创建Date对象
  *  @params   dateStr  日期字符串YYYY-MM-DD
  *			   timeStr  时间字符串HH:mm:SS
  *	 @return   Date对象
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
  *	 function  比较两个时间的大小(比较到秒)
  *  @params   first  参与比较的第一个时间
  *			   second 参与比较的第二个时间
  *	 @return   如果返回值大于0,first早于second
  *			   如果返回值小于0,first迟于second
  *			   如果返回值等于0,first等于second
  */
Date.compare = function(first, second){
	var temp1 = (typeof first  == 'string') ? Date.parseString(first,	"YYYY-MM-DD HH:mm:ss") : first;
	var temp2 = (typeof second == 'string') ? Date.parseString(second,	"YYYY-MM-DD HH:mm:ss") : second; 

	return temp1.diff('s', temp2);
}

 /*
  *	 function  判断两个时间驱动是否重叠
  *  @params   firstStart   firstEnd		第一个时间区段
  *            secondStart  secondEnd		第二个时间区段
  *	 @return   false 不重叠
  *			   true  重叠			   
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
  *	 function  判断时间是否在某个区间内
  *  @params   firstStart   firstEnd		第一个时间区段
  *            secondStart  secondEnd		第二个时间区段
  *	 @return   false 不重叠
  *			   true  重叠			   
  *	
  */
Date.prototype.isInRange = function(startTime, endTime){
	if(this.compare(startTime) > 0 || this.compare(endTime) < 0){
		return false;
	}
	return true;
}

/**
  *	 function  比较时间的大小(比较到秒)
  *  @params   compareDate  参与比较的时间
  *	 @return   如果返回值大于0,早于compareDate
  *			   如果返回值小于0,迟于compareDate
  *			   如果返回值等于0,等于compareDate
  */
Date.prototype.compare = function(compareDate){
	var temp = (typeof compareDate  == 'string') ? Date.parseString(compareDate,	"YYYY-MM-DD HH:mm:ss") : compareDate;
	return this.diff('s', temp);
}



/**
  *	 function  格式化输出日期对象(y|Y -- 年 M -- 月 d|D -- 日 h|H -- 小时 m -- 分 s|S 秒)
  *  @params   formatStr  输出的日期格式
  *	 @return   格式化的日期字符串
  */

Date.prototype.format = function(formatStr) {
	var str = formatStr;
	var week = ['日','一','二','三','四','五','六'];

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
  *	 function	添加一个的时间间隔
  *  @params	interval  间隔(s|S 秒 m 分 h|H 小时 d|D 日期 w|W 星期 M 月 q|Q 季度 y|Y 年
  *				number    间隔数
  *	 @return	添加一个时间间隔后的日期对象
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
  *	 function	减少一个的时间间隔
  *  @params	interval  间隔(s|S 秒 m 分 h|H 小时 d|D 日期 w|W 星期 M 月 q|Q 季度 y|Y 年
  *				number    间隔数
  *	 @return	减少一个时间间隔后的日期对象
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
  *	 function	计算两个日期差
  *  @params	interval  间隔(s|S 秒 m 分 h|H 小时 d|D 日期 w|W 星期 M 月 q|Q 季度 y|Y 年
  *	 @return	返回两个日期之间的间隔差
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


