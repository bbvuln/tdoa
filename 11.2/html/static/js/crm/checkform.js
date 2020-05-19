
function emptyCheck(fldName,fldLabel, fldType) {
	var currObj=getObj(fldName)
	
	if (fldType=="text") {
		if (currObj.value.replace(/^\s+/g, '').replace(/\s+$/g, '').length==0) {
    		alert(fldLabel+td_lang.crm.inc.msg_1)
			currObj.focus()
           	return false
		}
       	else{
			return true
		}
	} else {
		if (trim(currObj.value) == '') {
              alert(fldLabel+td_lang.crm.inc.msg_1)
   	          return false
        } else{
         	return true
        }
	}
}

function intValidate(fldName,fldLabel) {
	var val=getObj(fldName).value.replace(/^\s+/g, '').replace(/\s+$/g, '');
	if (isNaN(val) || val.indexOf(".")!=-1) 
	{
		alert(td_lang.crm.inc.msg_2+fldLabel);
		getObj(fldName).focus();
		return false;
	}else{
		return true;
	}
}

function textValidate(fldName,fldLabel,format){
	var val=getObj(fldName).value.replace(/^\s+/g, '').replace(/\s+$/g, '');

	if(format!="any"){
		if(val.length > format){
			alert(td_lang.crm.inc.msg_2+fldLabel)
	        getObj(fldName).focus()
           	return false
		}
	}
	return true;
}

function numValidate(fldName,fldLabel,format,neg) {
	 var val=getObj(fldName).value.replace(/^\s+/g, '').replace(/\s+$/g, '');
	 if (format!="any") {
	 	if (isNaN(val)) {
        	var invalid=true;
       	}else{
       		var format=format.split(",");
           	var splitval=val.split(".");
           	if (neg==true) {
               if (splitval[0].indexOf("-")>=0) {
                   if (splitval[0].length-1>format[0])
                       invalid=true
               } else {
                   if (splitval[0].length>format[0])
                       invalid=true
               }
           	}else{
           		if (val<0){
                   	invalid=true;
                }else if(format[0]==2 && splitval[0]==100 && (!splitval[1] || splitval[1]==0)){
                	invalid=false;
                }else if (splitval[0].length>format[0]){
                	invalid=true
                }
                if (splitval[1]){
	               if (splitval[1].length>format[1]){
	                   invalid=true
	               }
	            }
           	}
        }
	 }else{//没有处理每定义长度和精度的浮点数
	  	//var splitval=val.split(".")
	   	//var arr_len = splitval.length;
	   if (isNaN(val)) {
           var invalid=true;
       }else{
       	   var invalid=false;
       }
	 }
	 
	 if (invalid==true){
       	alert(td_lang.crm.inc.msg_2+fldLabel)
	    getObj(fldName).focus()
       	return false
     } else {
     	return true;
     }
}

function dateValidate(fldName,fldLabel,type){
	if(patternValidate(fldName,fldLabel,"DATE")==false){
		return false;
	}
	dateval=getObj(fldName).value.replace(/^\s+/g, '').replace(/\s+$/g, '');
	
	var dateelements=splitDateVal(dateval);
	dd=parseInt(dateelements[0],10);
	mm=parseInt(dateelements[1],10);
	yyyy=parseInt(dateelements[2],10);
	
	if (dd<1 || dd>31 || mm<1 || mm>12 || yyyy<1 || yyyy<1000) {
		alert(td_lang.crm.inc.msg_2+fldLabel)
		getObj(fldName).focus()
		return false
	}
	
	if ((mm==2) && (dd>29)) {//checking of no. of days in february month
		alert(td_lang.crm.inc.msg_2+fldLabel)
		getObj(fldName).focus()
		return false
	}
	
	if ((mm==2) && (dd>28) && ((yyyy%4)!=0)) {//leap year checking
		alert(td_lang.crm.inc.msg_2+fldLabel)
		getObj(fldName).focus()
		return false
	}

	switch (parseInt(mm)) {
		case 2 : 
		case 4 : 
		case 6 : 
		case 9 : 
		case 11 :	if (dd>30) {
						alert(td_lang.crm.inc.msg_2+fldLabel)
						getObj(fldName).focus()
						return false
					}	
	}
	 
	return true;
}

function formValidate(fieldname, fielddatatype, fieldlabel){
    for (var i=0; i<fieldname.length; i++){
		if(getObj(fieldname[i]) != null){
			var type=fielddatatype[i].split("~");
			if (type[1]=="M") {
				if (!emptyCheck(fieldname[i],fieldlabel[i],getObj(fieldname[i]).type))
					return false
			}
			
			switch (type[0]) {
			case "V"  :
				if (getObj(fieldname[i]) != null 
					&& getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0){	
					if (getObj(fieldname[i]).value.length!=0){
						if (typeof(type[3])=="undefined") {
							var numformat="any";
						}
						else {
							var numformat=type[3];
						}
						if (!textValidate(fieldname[i],fieldlabel[i],numformat))
							return false;
					}
				}
				break;
			case "I"  :
				if (getObj(fieldname[i]) != null 
					&& getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0){	
					if (getObj(fieldname[i]).value.length!=0){
						if (!intValidate(fieldname[i],fieldlabel[i])){
								return false
						}
					}
				}
				break;
			case "N"  :
			case "NN" :
				if (getObj(fieldname[i]) != null 
					&& getObj(fieldname[i]).value.replace(/^\s+/g, '').replace(/\s+$/g, '').length!=0){
					if (getObj(fieldname[i]).value.length!=0){
						if (typeof(type[2])=="undefined") {
							var numformat="any";
						}else {
							var numformat=type[2];
						}
						if(type[0]=="NN"){
							if (!numValidate(fieldname[i],fieldlabel[i],numformat,true)){
								return false;
							}
						}else {
							if (!numValidate(fieldname[i],fieldlabel[i],numformat)){
								return false;
							}
						}
						
					}
				}
				break;
			}
		}
	}
	return true;
}

