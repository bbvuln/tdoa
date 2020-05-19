function getObj(theObj, theDoc) {//��ȡ����
	var p, i, getObj;
	if(!theDoc) theDoc = document;
	if ( (p = theObj.indexOf("?")) > 0 && parent.frames.length ) { 
		theDoc = parent.frames[theObj.substring(p+1)].document;   
		theObj = theObj.substring(0,p); 
	} 
	if (!(getObj = theDoc[theObj]) && theDoc.all) {
		getObj = theDoc.all[theObj];
	} 
	for (i = 0; !getObj && i < theDoc.forms.length; i++) {
		getObj = theDoc.forms[i][theObj];
	} 
	for (i = 0; !getObj && theDoc.layers && i < theDoc.layers.length; i++) {
		getObj = findObj(theObj, theDoc.layers[i].document);
	}  
	if (!getObj && document.getElementById) {
		getObj = document.getElementById(theObj);
	}   
	return getObj;
}

function isNotNull(fldName,fldLabel) {//�жϸ�ʽ�Ƿ�Ϊ��

	var obj    = getObj(fldName);
	var reg    = /(^\s*)|(\s*$)/g;
	var result = obj.value.replace(reg, "");
	if (obj == null || result == "") {
		alert(fldLabel + td_lang.crm.apps.msg_37);
		//obj.focus();
		return false;
	}
	return true;
}

function isNum(fldName,fldLabel) {//�ж��Ƿ�Ϊ����

	var obj = getObj(fldName);
	if (obj.value.length != 0) {
		var reg    = /^\d+(\.\d+)?$|^0(\.\d+)?$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_11);
			//obj.focus();
			return false;
		}
	}
	return true;
}

function isInt(fldName,fldLabel) {//�ж��Ƿ�Ϊ����

	var obj = getObj(fldName);
	if (obj.value.length != 0) {
		var reg    = /^(-|\+)?\d+$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_12);
			//obj.focus();
			return false;
		}
	}
	return true;
}

function isFloat(fldName,fldLabel) {//�ж��Ƿ�Ϊ������

	var obj = getObj(fldName);
	if (obj.value.length != 0) {
		var reg    = /^[1-9]\d*\.\d+?$|^0\.\d+?$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_13);
			//obj.focus();
			return false;
		}
	}
	return true;
}

function isMoney (fldName,fldLabel) {//�ж��Ƿ�Ϊ���

	var obj = getObj(fldName);
	if (obj.value.length != 0) {
		var reg    = /^((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_14);
			//obj.focus();
			return false;
		}
	}
	return true;
}


function isDate(fldName,fldLabel){//�ж��Ƿ�Ϊ����
     
	var obj = getObj(fldName);
    if(obj.value.length!=0){
		var reg    = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		var result = obj.value.match(reg);        
        if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_15);
			return false;
		}	    
	}
	return true;	    
}   

function isTime(fldName,fldLabel){//�ж��Ƿ�Ϊʱ��
     
	var obj = getObj(fldName);
    if(obj.value.length!=0){
		var reg    = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/;		
		var result = obj.value.match(reg);        
        if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_16);
			return false;
		}	    
	}
	return true;    
}

function isDatetime(fldName,fldLabel){//�ж��Ƿ�Ϊ����ʱ��
     
	var obj = getObj(fldName);
    if (obj.value.length != 0) {
		var reg    = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_17);
			return false;
		}
	}
	return true;	    
}

function isIdentify(fldName,fldLabel){//�ж��Ƿ�Ϊ��Ч���֤��
  
	var obj = getObj(fldName);
    if (obj.value.length != 0) {
		var reg    = /^\d{15}(\d{2}[A-Za-z0-9])?$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_18);
			return false;
		}
	}
	return true;	    
}

function isEmail(fldName,fldLabel){//�ж��Ƿ�Ϊ��Ч�����ַ

	var obj = getObj(fldName);
    if (obj.value.length != 0) {
		var reg    = /^(([0-9a-zA-Z]+)|([0-9a-zA-Z]+[_.0-9a-zA-Z-]*[0-9a-zA-Z-]+))@([a-zA-Z0-9-]+[.])+([a-zA-Z]{2,3}|net|NET|asia|ASIA|com|COM|gov|GOV|mil|MIL|org|ORG|edu|EDU|int|INT|cn|CN|cc|CC|tw|TW|hk|HK)$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_19);
			return false;
		}
	}
	return true;	    
}

function isUrl(fldName,fldLabel){//�ж��Ƿ�Ϊ��Ч�����ַ

	var obj = getObj(fldName);
    if (obj.value.length != 0) {
		var reg    = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_20);
			return false;
		}
	}
	return true;	    
}

function isZip(fldName,fldLabel){//�ж��Ƿ�Ϊ��Ч��������

	var obj = getObj(fldName);
    if (obj.value.length != 0) {
		var reg    = /^[1-9]\d{5}$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_21);
			return false;
		}
	}
	return true;	    
}

function isPhone(fldName,fldLabel){//�ж��Ƿ�Ϊ��Ч�绰����

	var obj = getObj(fldName);
    if (obj.value.length != 0) {
		var reg    =  /^\d{3,4}-\d{7,8}(-\d{3,4})?$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_22);
			return false;
		}
	}
	return true;	    
}

function isMobile(fldName,fldLabel){//�ж��Ƿ�Ϊ��Ч�ֻ�����

	var obj = getObj(fldName);
    if (obj.value.length != 0) {
		var reg    =  /^((\(\d{2,3}\))|(\d{3}\-))?\d{11}$/;
		var result = obj.value.match(reg);
		if (result == null) {
			alert(fldLabel + td_lang.crm.inc.msg_23);
			return false;
		}
	}
	return true;	    
}
/*
function inputMoney(fldName, n){//��ֻ֤���������֣�С���㣬��С����ֻ����һ��
		var num;		//����С��λ��
		if (n != null || typeof n != "undefined"){
			num = n > 0 && n <= 20 ? n : 2;
		}else{
			num = 2;
		}
		var obj = getObj(fldName);
		var reg    = /^((\d{1,3}(,\d{3})*)|(\d+))(\.\d{2})?$/;
		var result = obj.value.match(reg);
		if(result == null){
			//�Ȱѷ����ֵĶ��滻�����������ֺ�.   
			obj.value = obj.value.replace(/[^\d.]/g,"");
			//���뱣֤��һ��Ϊ���ֶ�����.   
			obj.value = obj.value.replace(/^\./g,"");
			//��֤.ֻ����һ�Σ������ܳ�����������   
			obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
			var valueTmp = (obj.value).split(".");
			if((typeof valueTmp[1]) != "undefined"){
				obj.value = valueTmp[0] + "." + valueTmp[1].substring(0, 2);
			}
		}
	    
}
*/

function checkKeyWithCalculation(val, e) {
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key);
    if (keychar == '+' || keychar == '-' || keychar == '*' || keychar == '/' || keychar == '%' || keychar == '.' ){
		if(val.indexOf(".") != -1 && keychar == "."){
			return false;
		}
        return true;
    }
    if (key == 8){ // �����I
        return true;
    }
    if (key == 0){ // TAB �I
        return true;
    }
    if (key == 37 || key == 39){
        return true;
    }
    if (key < 48 || key > 57){ // �������зǔ����I

        return false;
    }
    else {
        return true;
    }
}


function formatMoney(val,fldId){
	if(val != ""){
		val = parseFloat((val + "").replace(/[^\d\.-]/g, "")) + "";
		var l = val.split(".")[0].split("").reverse();
		if(typeof val.split(".")[1] != "undefined"){
			r = val.split(".")[1];
			if(r.length > 2) {
				alert(td_lang.crm.inc.msg_24);
			}else if(r.length == 1){
				r = val.split(".")[1] + "0";
			}
		} else {
			r = "00";	
		}
		t = "";
		for(i = 0; i < l.length; i ++ )
		{
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
		}
		val = t.split("").reverse().join("") + "." + r;
	}
	if(fldId != null||typeof fldId != "undefined") {
		var obj = getObj(fldId);
		obj.value = val;
	}
	return val;
}

function reFormatMoney(val,fldId)
{	
	if(val != ""){
		val = parseFloat(val.replace(/[^\d\.-]/g, ""));
	}
	if(fldId != null||typeof fldId != "undefined") {
		var obj = getObj(fldId);
		obj.value = val;
	}
	return val;
} 

function checkKeyInt(val, e) {//�޶�ֻ������int����
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key);
    if (keychar == '+' || keychar == '-'){
		if(val.indexOf("+") != -1 && keychar == '+'){
			return false;
		}
		if(val.indexOf("-") != -1 && keychar == '-'){
			return false;
		}
        return true;
    }
    if (key == 8){ // �����I
        return true;
    }
    if (key == 0){ // TAB �I
        return true;
    }
    if (key == 37 || key == 39){
        return true;
    }
    if (key < 48 || key > 57){ // �������зǔ����I
        return false;
    }
    else {
        return true;
    }
}

function checkKeyFloat(val, e) {//�޶�ֻ������float����
    var key = window.event ? e.keyCode : e.which;
    var keychar = String.fromCharCode(key);
    if (keychar == '+' || keychar == '-' || keychar == '.' ){
		if(val.indexOf(".") != -1 && keychar == '.'){
			return false;
		}
		if(val.indexOf("+") != -1 && keychar == '+'){
			return false;
		}
		if(val.indexOf("-") != -1 && keychar == '-'){
			return false;
		}
        return true;
    }
    if (key == 8){ // �����I
        return true;
    }
    if (key == 0){ // TAB �I
        return true;
    }
    if (key == 37 || key == 39){
        return true;
    }
    if (key < 48 || key > 57){ // �������зǔ����I
        return false;
    }
    else {
        return true;
    }
}

function formatFloat(val,fldId){//��ʽ��Float
	if(val != ""){
		val = parseFloat((val + "").replace(/[^\d\.-]/g, "")) + "";
	}
	if(fldId != null||typeof fldId != "undefined") {
		var obj = getObj(fldId);
		obj.value = val;
	}
	return val;
}
function checkKeyIdentify(val) {//�ж����֤��ʽ
	if(val.length != 15 && val.length != 18){
		alert(td_lang.crm.inc.msg_25);
	}
}