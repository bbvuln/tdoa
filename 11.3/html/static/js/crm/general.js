/*
 *	���ܣ����ĵ���������¼�����
 *  ����:
 *  1. target		������¼��������ĵ�����
 *  2. eventName	����¼���
 *  3. handler      �¼�������
 *  4. argsObject	�¼��������Ĳ���
 */
 function AttachEvent(target, eventName, handler, argsObject){
	var eventHandler = handler;
	if(argsObject){
		eventHandler = function(e){
			handler.apply(e, argsObject);
		}
	}else{
		eventHandler = handler;
	}
	if(window.attachEvent){
		target.attachEvent("on" + eventName, eventHandler );
	}else{
		target.addEventListener(eventName, eventHandler, false);
	}
}

function createAjaxObject(){
    var xmlHttp;
    try{
        xmlHttp=new XMLHttpRequest();
    }catch(e){
        try{
            xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
        }catch(e){
            try{
                xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");   
            }catch(e){
                 alert(td_lang.crm.inc.msg_31);
                 return false;
            }
        }
    }
    return xmlHttp;
}

 
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

/*
 *	���ܣ���õ�ǰ�ĵ���ѯ����ĳ��������ֵ
 *  ����:
 *  1. name		��������
 */
function  getQueryString(name) {   
     var  reg   =   new   RegExp("(^|&)" + name + "=([^&]*)(&|$)");   
     var  r     =   window.location.search.substr(1).match(reg);   
     if   (r!=null)   {
     	return    r[2];   
     }
     return   null;   
}   

/*
 *	���ܣ���õ�ǰ�ĵ���ѯ����ĳ��������ֵ
 *  ����:
 *  1. url      ��ѯ��
 *  2. name		��������
 */
function getUrlQueryString(url, name){
	 var  reg   =   new   RegExp("(^|&)" + name + "=([^&]*)(&|$)");   
     var  r     =   url.substr(1).match(reg);   
     if   (r!=null)   {
     	return    r[2];   
     }
     return   null;   
}

/*
 *	���ܣ����ò���ֵ
 *  ����:
 *  1. field        ��������
 *  2. value	    ����ֵ
 *  3. splitChar    �ָ����(?�Ż���&��)
 */
function setQueryString(field, value, splitChar){
	return splitChar + field + "=" + value;
}

/*
 *	���ܣ����ݱ���ԭ������ֵ���䣬������Ӧ�Ĳ�����
 *  ����:
 *  1. field        ��������
 *  2. splitChar    �ָ����(?�Ż���&��)
 */
function keepQueryString(field, splitChar){
	var value = getQueryString(field);
	return ((value == null) ? "" : (splitChar + field + "="  + value))
}


function getTextObj(obj){
	if(obj.nodeType == 3){
		return obj;
	}
	if(obj.childNodes.length == 0){
		return false;
	}
	
	return getTextObj(obj.childNodes[0]);
}

function getScrollTop(container) {
  return container.scrollTop;
}

function openWindow(url, width, height, params, target){

    var left = (screen.availWidth  - width)/2;
    var top  = (screen.availHeight - height)/2;
    
    
    var paramStr = "";
    if(typeof params == "undefined" || params == null){
        paramStr = "toolbar="     + "no,"
                 + "location="    + "no,"
                 + "status="      + "no,"
                 + "directories=" + "no,"
                 + "menubar="     + "no,"
                 + "scrollbars="  + "yes,"
                 + "resizable="   + "yes,"
                 + "left="        + left  + ", "
                 + "top="         + top   + ", "
                 + "width="       + width + ", "
                 + "height="      + height;
    }else{
        paramStr = "toolbar="     + ((typeof params['toolbar']  == "undefined" || params['toolbar']  == "") ? "no" : params['toolbar'])  + ","
                 + "location="    + ((typeof params['location'] == "undefined" || params['location'] == "") ? "no" : params['location']) + ","
                 + "status="      + ((typeof params['status']   == "undefined" || params['status']   == "") ? "no" : params['status'])   + ","
                 + "directories=" + ((typeof params['directories'] == "undefined" || params['directories'] == "") ? "no" : params['directories']) + ","
                 + "menubar="     + ((typeof params['menubar'] == "undefined"  || params['menubar'] == "") ? "no" : params['menubar']) + ","
                 + "scrollbars="  + ((typeof params['scrollbars'] == "undefined" || params['scrollbars'] == "") ? "yes" : params['scrollbars']) + ","
                 + "resizable="   + ((typeof params['resizable'] == "undefined"  || params['resizable'] == "") ? "yes" : params['resizable']) + ","
                 + "left="        + left  + ", "
                 + "top="         + top   + ", "
                 + "width="       + width + ", "
                 + "height="      + height;
    }

    if(typeof target != 'undefined'){
        winObj = window.open(url, target, paramStr);
    }else{
        winObj = window.open(url, "", paramStr);
    }
    winObj.focus();
	return winObj;
}

function openDialogWindow(url, dialogWidth, dialogHeight, params, target){
    var dialogLeft = (screen.availWidth  - dialogWidth)/2;
    var dialogTop  = (screen.availHeight - dialogHeight)/2;
    
    
    var paramStr = "";
    if(typeof params == "undefined"){
        paramStr = "center="		+ "yes;"
                 + "help="			+ "no;"
                 + "resizable="		+ "no;"
                 + "status="		+ "yes;"
                 + "scroll="		+ "yes;"
                 + "dialogHide="	+ "no;"
                 + "edge="			+ "raised;"
				 + "unadorned="		+ "no;"
                 + "dialogLeft="    + dialogLeft  + "; "
                 + "dialogTop="     + dialogTop   + "; "
                 + "dialogWidth="   + dialogWidth + "; "
                 + "dialogHeight="  + dialogHeight;
    }else{
		
        paramStr = "center="		+ ((typeof params['center']		== "undefined" || params['center']		== "") ? "no"	: params['center'])		+ ";"
                 + "help="			+ ((typeof params['help']		== "undefined" || params['help']		== "") ? "no"	: params['help'])		+ ";"
                 + "resizable="		+ ((typeof params['resizable']  == "undefined" || params['resizable']   == "") ? "no"	: params['resizable'])  + ";"
                 + "status="		+ ((typeof params['status']		== "undefined" || params['status']		== "") ? "yes"	: params['status'])		+ ";"
                 + "scroll="		+ ((typeof params['scroll']		== "undefined" || params['scroll']		== "") ? "yes"	: params['scroll'])		+ ";"
                 + "dialogHide="	+ ((typeof params['dialogHide']	== "undefined" || params['dialogHide']	== "") ? "no"	: params['dialogHide'])	+ ";"
                 + "edge="			+ ((typeof params['edge']		== "undefined" || params['edge']		== "") ? "raised"	: params['edge'])	+ ";"
				 + "unadorned="		+ ((typeof params['unadorned']	== "undefined" || params['unadorned']	== "") ? "no"	: params['unadorned'])	+ ";"
                 + "dialogLeft="	+ dialogLeft  + "; "
                 + "dialogTop="		+ dialogTop   + "; "
                 + "dialogWidth="	+ dialogWidth + "; "
                 + "dialogHeight="	+ dialogHeight;
				 
    }
	
    if(typeof target != 'undefined'){
        window.showModalDialog(url, target, paramStr);
    }else{
        window.showModalDialog(url, "", paramStr);
    }

}
//��������
function roundValue(val) { 
val = parseFloat(val); 
val = Math.round(val*100)/100; 
val = val.toString(); 

if (val.indexOf(".")<0) { 
val+=".00" 
} else { 
var dec=val.substring(val.indexOf(".")+1,val.length) 
if (dec.length>2) 
val=val.substring(0,val.indexOf("."))+"."+dec.substring(0,2) 
else if (dec.length==1) 
val=val+"0" 
} 

return val; 
}