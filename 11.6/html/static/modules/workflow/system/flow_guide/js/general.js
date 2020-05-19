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
/*	author:	JinXin
 *	todo:	����Ψһ��callback����
 *	params:
 *		1.func		callback����
 * 		2.root		��ӵ�����
 *		3.prefix	ǰ׺
 *	return:
 *		callback����
 */
function creatCallback(func, root, prefix){
	var root = root || window,
		prefix = prefix || '',
		timer = ( new Date() ).getTime(),
		cbName = prefix + 'callback' + timer;
		root[cbName] = function(){
			typeof func === 'function' && func();	
		};
	return cbName;
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
		var toolbar = (typeof params['toolbar']  == "undefined" || params['toolbar']  == "") ? "no" : params['toolbar'];
		var locationX = (typeof params['location']  == "undefined" || params['location']  == "") ? "no" : params['location'];
		var status = (typeof params['status']  == "undefined" || params['status']  == "") ? "no" : params['status'];
		var directories = (typeof params['directories']  == "undefined" || params['directories']  == "") ? "no" : params['directories'];
		var menubar = (typeof params['menubar']  == "undefined" || params['menubar']  == "") ? "no" : params['menubar'];
		var scrollbars = (typeof params['scrollbars']  == "undefined" || params['scrollbars']  == "") ? "yes" : params['scrollbars'];
		var resizable = (typeof params['resizable']  == "undefined" || params['resizable']  == "") ? "yes" : params['resizable'];

        paramStr = "toolbar="     +  toolbar + ","
                 + "location="    + locationX + ","
                 + "status="      + status + ","
                 + "directories=" + directories + ","
                 + "menubar="     + menubar + ","
                 + "scrollbars="  + scrollbars + ","
                 + "resizable="   + resizable + ","
                 + "left="        + left  + ", "
                 + "top="         + top   + ", "
                 + "width="       + width + ", "
                 + "height="      + height;
    }
	if(typeof target != 'undefined' ){
		target = target.replace(new RegExp("[^0-9a-zA-Z\u4e00-\u9fa5]","gm"),'')
        winObj = window.open(url, target, paramStr);
    }else{
        winObj = window.open(url, "newopen", paramStr);
    }
	
    winObj.focus();
	return winObj;
}

function openDialogWindow(url, dialogWidth, dialogHeight, params, target){
    var dialogLeft = (screen.availWidth  - dialogWidth)/2;
    var dialogTop  = (screen.availHeight - dialogHeight)/2;
    
    
    var paramStr = "";
    if(typeof params == "undefined" || params == null){
        paramStr = "center="		+ "yes;"
                 + "help="			+ "no;"
                 + "resizable="		+ "no;"
                 + "status="		+ "yes;"
                 + "scroll="		+ "yes;"
                 + "dialogHide="	+ "no;"
                 + "edge="			+ "raised;"
				 + "unadorned="		+ "no;"
                 + "dialogLeft="    + dialogLeft  + "px; "
                 + "dialogTop="     + dialogTop   + "px; "
                 + "dialogWidth="   + dialogWidth + "px; "
                 + "dialogHeight="  + dialogHeight + "px;";
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

function SelectSYSCodeMul(TO_ID, CODE_TYPE)
{
  URL="/general/CRM/include/SYSCodeMul?&TO_ID="+TO_ID+"&CODE_TYPE="+CODE_TYPE;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 200, 350);
}

function ClearDiv(div){
	document.getElementById(div).value = "";
}

function getCookie(name){//ȡcookies����        
	var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
	if(arr != null) return unescape(arr[2]); return null;
}


function setCookie(name,value){//����������һ����cookie�����ӣ�һ����ֵ
    var Days = 30; //�� cookie �������� 30 ��
    var expires  = new Date();    //new Date("December 31, 9998");
    expires.setTime(expires.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + expires.toGMTString()+";path=/general";//path=/general general������Ŀ¼����cookie
}

function delCookie(name){//ɾ��cookie
	var expires = new Date();
	expires.setTime(expires.getTime() - 10000);
	var cval=getCookie(name);
	if(cval!=null) document.cookie= name + "="+cval+";expires="+expires.toGMTString();
}

function flow_turn(flowId,obj){
	obj = (obj == null || typeof obj == "undefined") ? window.location : obj;
	var Href = obj.href;
	var oldHref = getCookie("newOriental_prevUrl");
	if(oldHref != null) {
		delCookie("newOriental_prevUrl");	
	}
	setCookie("newOriental_prevUrl",Href);
}

function goBack(flowId){
	var Href = getCookie("newOriental_prevUrl");
	delCookie("newOriental_prevUrl");
	window.location = Href;
}

function goToUrl(url,prevUrl,obj){//��ת��ָ��Url��ַ,����ָ����һUrl��ַ(Ĭ��Ϊwindow.location.href)д��cookie
	obj = (obj == null || typeof obj =="undefined") ?  window : obj;
	prevUrl = (prevUrl == null || typeof prevUrl =="undefined" || prevUrl=="") ? obj.location.href : prevUrl;
	var oldHref = getCookie("tmpPrevUrl");

	if(oldHref != null) {
		delCookie("tmpPrevUrl");	
	}
	setCookie("tmpPrevUrl",prevUrl);
	if(url != null && typeof url !="undefined") {
		obj.location.href = url;
	}
}

function goBackUrl(url,hasParams){//��ת��ָ��Url��ַ,Ĭ��Ϊcookie�м�¼��Url��ַ
	url = (url == null || typeof url =="undefined" || url =="") ? getCookie("tmpPrevUrl") : url;
	hasParams = (hasParams == null || typeof hasParams == "undefined") ? true : hasParams;
	if(hasParams == false) {
		url = (url.indexOf("?") == -1) ? url : url.substring(0,url.indexOf("?"));
	}
	delCookie("tmpPrevUrl");
	window.location = url;
}

function SelectMul(TO_ID, OPTIONSNAME)
{
  URL="/general/CRM/include/MulSelect?&TO_ID="+TO_ID+"&OPTIONSNAME="+OPTIONSNAME;
  loc_y=loc_x=200;
  if(is_ie)
  {
     loc_x=document.body.scrollLeft+event.clientX-100;
     loc_y=document.body.scrollTop+event.clientY+170;
  }
  LoadDialogWindow(URL,window,loc_x, loc_y, 200, 350);
}

function getObj(theObj, theDoc) {//��ȡ����
	var p, i, Obj;
	if(!theDoc) theDoc = document;
	if ( (p = theObj.indexOf("?")) > 0 && parent.frames.length ) {
		theDoc = parent.frames[theObj.substring(p+1)].document;   
		theObj = theObj.substring(0,p); 
	}
	if (!(Obj = theDoc[theObj]) && theDoc.all) {
		Obj = theDoc.all[theObj];
	}
	for (i = 0; !Obj && i < theDoc.forms.length; i++) {
		Obj = theDoc.forms[i][theObj];
	}
	for (i = 0; !Obj && theDoc.layers && i < theDoc.layers.length; i++) {
		Obj = getObj(theObj, theDoc.layers[i].document);
	}
	if (!Obj && document.getElementById) {
		Obj = document.getElementById(theObj);
	}
	return Obj;
}

/*
 *	���ܣ���ʾ�ͻ�����
 *  ����:
 *  1. account_id	�ͻ�ID
 */
function OpenAccountDetail(account_id){
	openWindow("/general/CRM/include/accountDetail.php?account_id="+account_id, 700, 350);
}

/*
 *	���ܣ���ʾ��ͬ����
 *  ����:
 *  1. contract_id	��ͬID
 */
function OpenContractDetail(contract_id){
	openWindow("/general/CRM/include/contractDetail.php?account_id="+contract_id, 700, 350);
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

function removeUrlQueryString(url, name){
	 var  reg   =   new   RegExp("(^|&)" + name + "=([^&]*)(&|$)");   
 	 return url.substr(1).replace(reg, '');
}

function replaceUrlQueryString(url, name, value){
	 var  reg   =   new   RegExp("(^|&)" + name + "=([^&]*)(&|$)");   
	 var  r     =   url.substr(1).match(reg);   
	  if(r!=null){
		 url = url.substr(1).replace(name+"="+r[2]+r[3], name+"=" + value + r[3]);
	  }else{
		if(url.length > 1){
			url = url.substr(1) + "&" + name + "=" + value;
		}else{
			url = name + "=" + value;
		}
	  }
 	 return url;
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

function find_id(ids, id){   
	if(id == "" || id == "," || ids == "" || ids == "," )
		return false;
	if(!id.indexOf(",") && ids == id )
		return true;
	if(ids.substr(ids.length-1, ids.length) != "," )
		ids += ",";
	if(ids.indexOf(","+id+",") > 0 )
		return true;
	if(ids.indexOf(id+",") === 0 )
		return true;
	return false;
}

function clear_id(ids, id){
	if(ids.substr(ids.length-1, ids.length) != "," )
		ids += ",";
	if(ids.indexOf(","+id+",") > 0 )
		return ids.replace(","+id+",", ",");
	if(ids.indexOf(id+",") === 0 )
		return ids.replace(id+",", "");
	return ids;
}

/*
LIST��ɫ��ʾJS.��ѡ��ѡ + shift/ctrl ��/�Ҽ� .
param: id(��¼ID), obj(�ж���), Vevent(�������¼�)
1.������� ѡ�б���,����ɫΪѡ��(���ö�ѡ�͵�ѡ������Ϊ����ID, ��ԭ��������ѡ����ɫ��)
2.�����Ҽ� 
	2.1 ����1�����ϼ�¼��ѡ��ʱ,���ı��ѡ��ֵ,�ı䵥ѡ��ֵΪ�������,�����Ҽ��˵�;
	2.2 ֻ��һ����û��ѡ����ʱ,ִ�е�������¼�,�����Ҽ��˵�
3.CTRL + �������
	3.1 �������ѡ����:��ԭ��ɫ,��ȥ����ѡ��������¼��ID,���õ�ѡ������Ϊ����ID;
	3.2 �������δѡ����:����ɫΪѡ��,�ڶ�ѡ���м��뱾��ID,���õ�ѡ������Ϊ����ID;
4.CTRL + �����Ҽ� : ִ���Ҽ�
5.SHIFT + ������� (������ѡ�в��ǵ�ǰ��)
    ѡ����ѡ�м��䵽��ǰ�е�������;
6.SHIFT + �����Ҽ� : ִ���Ҽ�
*/
function choosedata(id, obj, Vevent){
	var idsObj = document.getElementById("MSelectIds");
	var cursel = getObj("selectIds");
	var IdsArr = idsObj.value.split(",");

	if(Vevent.button == 1 && Vevent.ctrlKey ){ //3
		if(obj.className == 'TableSelect'){ //3.1
			obj.className = CLASSARR[id];
			idsObj.value = clear_id(idsObj.value, id);
		}else{ //3.2
			obj.className = 'TableSelect'; 
			if(!find_id(idsObj.value, id)){
				idsObj.value += id + ",";
			}
		}
	}else if(Vevent.button == 1 && Vevent.shiftKey && cursel.value != "" && id != cursel.value && typeof MIDS != "undefined"){ //5
		//�������ѡ���� START
		if(idsObj.value != ""){
			for(var j = 0; j < IdsArr.length; j++){
				if(IdsArr[j] == "" || typeof IdsArr[j] == "undefined") continue;
				getObj("tr_"+IdsArr[j]).className = CLASSARR[id];
			}
		}
		//�������ѡ���� END

		var Nstart = MIDS.indexOf("," + cursel.value + ","); //ȡ��ʼλ��
		var Nend = MIDS.indexOf("," + id + ","); //ȡ����λ��

		//ȡ����Ӧ��ѡ����;
		if(Nstart > Nend){
			var selIds = MIDS.substring(Nend, Nstart);
			selIds += "," + cursel.value;
		}else{
			var selIds = MIDS.substring(Nstart, Nend);
			selIds += "," + id;
		}
		var SELARR = selIds.split(",");
		for(var i = 1; i < SELARR.length; i++){ //��ɫ
			if(SELARR[i] == "") continue;
			getObj("tr_"+SELARR[i]).className = "TableSelect";
		}
		idsObj.value = selIds.substring(1, selIds.length) + ",";
		//getObj("selectIds").value = id;
		//alert(idsObj.value);
		return;
	}else if(Vevent.button == 2 && Vevent.ctrlKey){ //4
		return;
	}else if(Vevent.button == 2 && Vevent.shiftKey){ //6
		return;
	}else if(Vevent.button == 2){ //2;
//		if( IdsArr.length > 2 ){ //2.1
//			return;
//		}else{ //2.2

//		}
		if(obj.className== "TableSelect"){
			return;
		}else{
			for(var i = 0; i < IdsArr.length-1; i++){
				getObj("tr_"+IdsArr[i]).className = CLASSARR[IdsArr[i]];
			}
			obj.className= "TableSelect"; 
			idsObj.value = id + ",";
		}
	}else{ //4
		if(idsObj.value == ""){
			obj.className= "TableSelect"; 
			idsObj.value = id + ",";
		}else{
			for(var i = 0; i < IdsArr.length - 1; i++){
				getObj("tr_"+IdsArr[i]).className = CLASSARR[IdsArr[i]];
			}
			obj.className= "TableSelect"; 
			idsObj.value = id + ",";
		}
	}
	getObj("selectIds").value = id;
}

/*
��ø�tagName�Ķ���
*/
function GetParentEl(el, tagName) 
{ 
	el=el.parentElement ? el.parentElement : el.parentNode; 
	if(!el) 
		return null; 

	if(el.tagName.toLowerCase()==tagName) 
		return el; 
	else 
		return GetParentEl(el, tagName); 
}

String.prototype.replaceAll = function(s1,s2) { 

    return this.replace(new RegExp(s1,"gm"),s2); 

}


function view_user(USER_ID)
{
	var width = 800;
	var height = 500;
	var loc_x=(document.body.screenWidth-width)/2;
	var loc_y=(document.body.screenHeight-height)/2;

	var URL = "/general/ipanel/user/user_info.php?USER_ID="+USER_ID+"&WINDOW=1";
	openWindow(URL, width, height, "", "view_user");
}

/* AJAX�� 
 * function : AjaxRequest()
 * params   : method    ����ʽ
 * 			  url       ���ձ�URL��ַ
 * 			  async     �Ƿ��첽
 * 			  content   ��ҪPOST��ֵ����ÿ��������ͨ��&������
 * 			  callback  �ص�����
 * 			  send      ��������
 */
function AjaxRequest() { 
	var xmlObj = false; 
	var CBfunc,ObjSelf; 
	ObjSelf=this; 
	try { xmlObj=new XMLHttpRequest; } 
	catch(e) { 
		try { xmlObj=new ActiveXObject("MSXML2.XMLHTTP"); } 
		catch(e2) { 
			try { xmlObj=new ActiveXObject("Microsoft.XMLHTTP"); } 
			catch(e3) { xmlObj=false; } 
		} 
	} 
	if (!xmlObj) {
		alert("�޷����� XMLHttpRequest ����");
		return false;
	} 
	this.method="POST"; 
	this.url; 
	this.async=true; 
	this.content=""; 
	this.callback=function(cbobj) {return;} 
	this.send=function() { 
		if(!this.method||!this.url||!this.async) return false; 
		xmlObj.open (this.method, this.url, this.async); 
		if(this.method=="POST") xmlObj.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
		xmlObj.onreadystatechange=function() { 
			if(xmlObj.readyState==4) { 
				if(xmlObj.status==200) { 
					ObjSelf.callback(xmlObj); 
				} 
			} 
		} 
		if(this.method=="POST") xmlObj.send(this.content); 
		else xmlObj.send(null); 
	} 
}

//��ȡ�ֶ�ֵ
function ajaxGetStatus(queryString,CallBack){
	var ajaxobj=new AjaxRequest; // ����AJAX����
	ajaxobj.method="POST"; // ��������ʽΪPOST 	
	ajaxobj.url=CRM_CONTEXT_PATH+"/utils/status.php";//���ý��ձ�URL��ַ 
	ajaxobj.content=encodeURI(queryString);//��ҪPOST��ֵ����ÿ��������ͨ��&������
	ajaxobj.callback=function(xmlobj) {//���ûص�����
		CallBack.call(ajaxobj.callback,xmlobj.responseText);
	}
	ajaxobj.send();//��������
}

//��ȡ�ֶ�ֵ
function ajaxCheckRunDeal(flow_id, flow_prcs, entity_name, run_field_name, MSG){
	var selectId = getObj("selectIds").value;
	if(MSG == "" || typeof MSG == "undefined"){
		MSG = "�㲻�ܲ�����ǰ���裡";
	}
	var ajaxobj=new AjaxRequest; // ����AJAX����
	ajaxobj.method="POST"; // ��������ʽΪPOST 	
	ajaxobj.url=CRM_CONTEXT_PATH+"/utils/flowrunprcs.php";//���ý��ձ�URL��ַ 
	var queryString = "id="+selectId+"&tbName="+entity_name+"&flow_prcs="+flow_prcs+"&run_field_name="+run_field_name+"&flow_id="+flow_id;
	ajaxobj.content=encodeURI(queryString);//��ҪPOST��ֵ����ÿ��������ͨ��&������
	ajaxobj.callback=function(xmlobj) {//���ûص�����
		var responseText = xmlobj.responseText;
		if(responseText == "false"){
			alert(MSG);
			return;
		}
		goToUrl('/general/CRM/utils/work_flow/onload_frame/index.php?'+responseText);
	}
	ajaxobj.send();//��������
}

function trim(str){ //ɾ���������˵Ŀո�
	return str.replace(/(^\s*)|(\s*$)/g, "");
}
���� 
function ltrim(str){ //ɾ����ߵĿո�
	return str.replace(/(^\s*)/g,"");
}
���� 
function rtrim(str){ //ɾ���ұߵĿո�
	return str.replace(/(\s*$)/g,"");
}

//�������ӷ�����   
function FloatAdd(arg1,arg2){   
	var r1,r2,m;   
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}   
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}   
	m=Math.pow(10,Math.max(r1,r2))   
	return (arg1*m+arg2*m)/m   
}   
//��������������   
function FloatSub(arg1,arg2){   
	var r1,r2,m,n;   
	try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}   
	try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}   
	m=Math.pow(10,Math.max(r1,r2));   
	//��̬���ƾ��ȳ���   
	n=(r1>=r2)?r1:r2;   
	return ((arg1*m-arg2*m)/m).toFixed(n);   
}   
  
//�������˷�����   
function FloatMul(arg1,arg2){    
	var m=0,s1=arg1.toString(),s2=arg2.toString();    
	try{m+=s1.split(".")[1].length}catch(e){}    
	try{m+=s2.split(".")[1].length}catch(e){}    
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)    
}     
//��������������   
function FloatDiv(arg1,arg2){    
	var t1=0,t2=0,r1,r2;    
	try{t1=arg1.toString().split(".")[1].length}catch(e){}    
	try{t2=arg2.toString().split(".")[1].length}catch(e){}    
	with(Math){    
		r1=Number(arg1.toString().replace(".",""))    
		r2=Number(arg2.toString().replace(".",""))    
		return (r1/r2)*pow(10,t2-t1);    
	}
}

/*add by ��ˬ 2011-2-23*/ //EDIT BY LW 2011/3/24 ����OLDFILED����
function delete_attach(ATTACHMENT_ID,ATTACHMENT_NAME,ENTITY_NAME,FIELD_NAME,OBJ_ID,KEY_NAME,KEY_VALUE,OLDFILED_NAME){
	if(typeof ATTACHMENT_ID == "undefined" || ATTACHMENT_ID == "" || typeof ATTACHMENT_NAME == "undefined" || ATTACHMENT_NAME == "" 
	|| typeof ENTITY_NAME == "undefined" || ENTITY_NAME == "" || typeof FIELD_NAME == "undefined" || FIELD_NAME == ""){
		return;
	}
	KEY_NAME = (typeof KEY_NAME == "undefined" || KEY_NAME == "") ? "id" : KEY_NAME;
	KEY_VALUE = (typeof KEY_VALUE == "undefined") ? "" : KEY_VALUE;
	OBJ_ID = (typeof OBJ_ID == "undefined") ? "" : OBJ_ID;
	OLDFILED_NAME = (typeof OLDFILED_NAME == "undefined") ? "" : OLDFILED_NAME;
	
	msg="ȷ��Ҫɾ���ļ� '"+ ATTACHMENT_NAME +"' ��?";
	if(window.confirm(msg)){
		var ajaxobj=new AjaxRequest; // ����AJAX����
		ajaxobj.method = "POST"; // ��������ʽΪPOST 	
		ajaxobj.url = CRM_CONTEXT_PATH+"/inc/delete_attach.php";//���ý��ձ�URL��ַ 
		var queryString = "ATTACHMENT_ID="+ATTACHMENT_ID+"&ATTACHMENT_NAME="+encodeURI(ATTACHMENT_NAME)+"&ENTITY_NAME="+ENTITY_NAME+"&FIELD_NAME="+FIELD_NAME+"&KEY_NAME="+KEY_NAME+"&KEY_VALUE="+KEY_VALUE+"&OBJ_ID="+OBJ_ID+"&OLDFILED_NAME="+OLDFILED_NAME;
		ajaxobj.content = encodeURI(queryString);//��ҪPOST��ֵ����ÿ��������ͨ��&������
		ajaxobj.callback = function(xmlobj) {//���ûص�����
			var responseText = xmlobj.responseText;
			if(responseText != "false"){
				eval(responseText);
			}else {
				alert("ɾ��ʧ�ܣ�δ�ҵ�������");
				return false;
			}
		}
		ajaxobj.send();//��������
	}	
}
/***********************/
  
function getElementPos(el){   
	var ua = navigator.userAgent.toLowerCase();   
	var isOpera = (ua.indexOf('opera') != -1);   
	var isIE = (ua.indexOf('msie') != -1 && !isOpera); // not opera spoof   
	var el = (typeof el == "string") ? document.getElementById(el) : el;   
	if (el.parentNode === null || el.style.display == 'none') {   
		return false;   
	}   
	var parent = null;   
	var pos = [];   
	var box;   
	if (el.getBoundingClientRect) {//IE   
		box = el.getBoundingClientRect();   
		var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);   
		var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);   
		return {   
			x: box.left + scrollLeft,   
			y: box.top + scrollTop   
		};   
	} else if (document.getBoxObjectFor) {// gecko      
		box = document.getBoxObjectFor(el);   
		var borderLeft = (el.style.borderLeftWidth) ? parseFloat(el.style.borderLeftWidth) : 0;   
		var borderTop = (el.style.borderTopWidth) ? parseFloat(el.style.borderTopWidth) : 0;   
		pos = [box.x - borderLeft, box.y - borderTop];   
	} else {// safari & opera   
		pos = [el.offsetLeft, el.offsetTop];   
		parent = el.offsetParent;   
		if (parent != el) {   
			while (parent) {   
				pos[0] += parent.offsetLeft;   
				pos[1] += parent.offsetTop;   
				parent = parent.offsetParent;   
			}   
		}   
		if (ua.indexOf('opera') != -1 || (ua.indexOf('safari') != -1 && el.style.position == 'absolute')) {   
			pos[0] -= document.body.offsetLeft;   
			pos[1] -= document.body.offsetTop;   
		}   
	}   
	if (el.parentNode) {   
		parent = el.parentNode;   
	} else {   
		parent = null;   
	}   
	while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML') { // account for any scrolled ancestors   
		pos[0] -= parent.scrollLeft;   
		pos[1] -= parent.scrollTop;   
		if (parent.parentNode) {   
			parent = parent.parentNode;   
		} else {   
			parent = null;   
		}   
	}   
	return {   
		x: pos[0],   
		y: pos[1]   
	};   
}

function getTFieldArr(){
	var tFields = ["is_null", "is_not_null", "date_is_null", "date_is_not_null", "datetime_is_null", "datetime_is_not_null", "time_is_null", "time_is_not_null", "select_is_null", "select_is_not_null", "yesterday", "today", "tomorrow", "lastweek", "thisweek", "nextweek", "lastmonth", "thismonth", "nextmonth", "last7days", "last30days", "last60days", "last90days", "next7days", "next30days", "next60days", "next90days"];
	return tFields;
}
function getTDFieldArr(){
	var tFields = ['is','isn','lst','grt','lsteq','grteq'];
	return tFields;
}

function createTip(){
	$(document.body).append("<div class=\"textTip\" id=\"textTip\" align=\"left\"></div>");
}

function showTip(obj,width,pos){
	var tip = $(obj).attr("tip");
	if(typeof tip == "undefined" || tip == ""){
		return false;
	}
	var pos = (typeof pos == "undefined" || pos == "") ? "right" : pos; 
	var width = (typeof width == "undefined" || width == "") ? Math.ceil(tip.length*12+22) : width;
	width = (width > 300) ? 300 : width;
	if($("#textTip").length === 0){
		createTip();
	}
	var $tipObj = $("#textTip");
	var objPos = getElementPos(obj);
	$tipObj.html(tip);
	switch(pos){
		case "left":
			var leftPos = objPos.x-width-4;
			var topPos = objPos.y-5;
			break;
		case "right":
			var leftPos = objPos.x+20;
			var topPos = objPos.y-5; 
			break;
		case "top":
			var leftPos = objPos.x;
			var topPos = objPos.y-32; 
			break;
		case "bottom":
			var leftPos = objPos.x;
			var topPos = objPos.y+20; 
			break;		
	}
	$tipObj.css("position","absolute");
	$tipObj.css("left",leftPos);
	$tipObj.css("top",topPos);
	$tipObj.css("width",width);
	$tipObj.show();
	$(document).click(function(){hideTip()});
}

function showTipArea(el,tips){
	var tip = tips;
	if(typeof tip == "undefined" || tip == ""){
		return false;
	}
	var pos = (typeof pos == "undefined" || pos == "") ? "right" : pos; 
	var width = (typeof width == "undefined" || width == "") ? Math.ceil(tip.length*12+22) : width;
	width = (width > 300) ? 300 : width;
	
	var $tipObj = $("#define-tip");	
	var objPos = getElementPos(el);
	$tipObj.find('.feed_inner').html(tip);
//	$tipObj.find('.feed_inner')[0].innerHTML = tip;
	var topPos = objPos.y-5; 	
	var leftPos = objPos.x;
	$tipObj.css("position","absolute");
	$tipObj.css("top",topPos);
	$tipObj.css("width",170);
	$tipObj.show();
}
function hideTip(){
	var srcObj = event.srcElement ? event.srcElement : event.target;
	if(srcObj.id == "textTip"){
		return false;
	}
	var $tipObj = $("#textTip");
	$tipObj.hide();
}

function openNewProtal(Purl,Pname,Pid){
	if(typeof Pname != 'undefined' ){
		Pname = Pname.replace(new RegExp("[^0-9a-zA-Z\u4e00-\u9fa5]","gm"),''); //Ϊ�˼��ݣ����øú���ʱ���ܴ����ַ������
    }else{
    	Pname = "newopen";
    }
	if(window.top.bTabStyle){
		window.top.openURL(Pid,Pname,Purl);
	}	else{
		openWindow(Purl,screen.availWidth*0.8,screen.availHeight*0.8,null,Pname);
	}			
}