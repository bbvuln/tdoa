var http_request=false;
var reobj=null;
var thwmlist={all:false,ked:false,wil:false};
var $ = function(id) {return document.getElementById(id);};

function send_request(url){//��ʼ����ָ������������������ĺ���
    createXMLHttpRequest();
    http_request.onreadystatechange=processrequest;
    http_request.open("GET",url,true);
    http_request.send(null);
}


//��������Ϣ�ĺ���
function processrequest(){
    if(http_request.readyState==4){//�ж϶���״̬
         if(http_request.status==200){//��Ϣ�ѳɹ����أ���ʼ������Ϣ
         	   var arr = http_request.responseText.split("~~");
         	   $("tabs").value=unescape(arr[0]);
             $(reobj).innerHTML=arr[1];
         }
         else{//ҳ�治����
             alert(td_lang.general.msg_17);//"���������ҳ�治������"
       }
    }
}

function dopage(obj,url){
   $(obj).innerHTML=td_lang.general.msg_18;//"���ڶ�ȡ����..."
   reobj=obj;
   send_request(url);
}

function createXMLHttpRequest() {
  http_request=false;
//��ʼ��ʼ��XMLHttpRequest����
  if(window.XMLHttpRequest){//Mozilla�����
     http_request=new XMLHttpRequest();
     if(http_request.overrideMimeType){//����MIME���
        http_request.overrideMimeType("text/xml");
     }
   }else if(window.ActiveXObject){//IE�����
      try{
         http_request=new ActiveXObject("Msxml2.XMLHttp");
      }catch(e){
          try{
                http_request=new ActiveXobject("Microsoft.XMLHttp");
          }catch(e){}
      }
    }
    if(!http_request){//�쳣����������ʵ��ʧ��
       window.alert(td_lang.general.msg_19);//"����XMLHttp����ʧ�ܣ�"
       return false;
    }
}

function thwm(divid,url,tip){
	div=$(divid);
	if(!thwmlist[divid]){
		div.innerHTML = tip;
		createXMLHttpRequest();
		http_request.open("GET",url,true);
		http_request.onreadystatechange =function(){
			if (http_request.readyState == 4) {
				if (http_request.status == 200) {
					div.innerHTML= http_request.responseText;
					showdiv(divid);
					thwmlist[divid]=true;
				}
			}
		}
		http_request.send(null);
	}else{
	  showdiv(divid);
	}
}

function thwmpage(divid,url,tip){
	div=$(divid);
	div.innerHTML = tip;
	createXMLHttpRequest();
	http_request.open("GET",url,true);
	http_request.onreadystatechange =function(){
		if (http_request.readyState == 4) {
			if (http_request.status == 200) {
				div.innerHTML= http_request.responseText;
				showdiv(divid);
			}
		}
	}
	http_request.send(null);
}

function showdiv(divid){
  div=$("allctrl");
  div1=$("all");
  div1.style.display="none";
	div.className="top top_off";

  div=$("kedctrl");
  div1=$("ked");
  div1.style.display="none";
	div.className="top top_off";

  div=$("wilctrl");
  div1=$("wil");
  div1.style.display="none";
	div.className="top top_off";

  div=$(divid);
  divctrl=$(divid+"ctrl");
  divctrl.className="top top_on";
  if(div.style.display=="block"){
  	div.style.display="none";
  }else{
  	div.style.display="block";
  }
}

function subcmt(){
  var COMMENT = $('COMMENT').value;
  var ASK_ID = $('ASK_ID').value;
  if(COMMENT == "")
  {alert(td_lang.general.msg_20);return false;}//"�������ݲ���Ϊ��"
  var httpReq=getXMLHttpObj();
  httpReq.open("GET","comment.php?COMMENT="+escape(COMMENT)+"&ASK_ID="+ASK_ID,true);
  httpReq.onreadystatechange=function(){
     if(httpReq.readyState==4){
        if(httpReq.responseText=="ok"){
           alert(td_lang.general.msg_21);//"�����ύ�ɹ�"
        	 window.location.reload();           
           dialogclose();
        }
     }
  };
  httpReq.send(null);
}

function getXMLHttpObj()
{
	var v=null;
	if(window.ActiveXObject)
	{
		v=new ActiveXObject("Msxml2.XMLHTTP");
		if(!v)
		{
			v=new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
	else if(window.XMLHttpRequest)
	{
		v=new XMLHttpRequest();
	}
	return v;
}

function comment(){
	alert;
	$("commentBlock").style.left = (parseInt(document.body.clientWidth) - parseInt($("commentBlock").style.width))/2;
  $("commentBlock").style.top  = 150;
  $("overlay").style.width  =  document.body.clientWidth;
  if(parseInt(document.body.scrollHeight) < parseInt(document.body.clientHeight) )
     $("overlay").style.height  =  document.body.clientHeight;
  else
     $("overlay").style.height  =  document.body.scrollHeight;
  $("overlay").style.display = 'block';
	$("commentBlock").style.display = 'block';
	window.scroll(0,0);
}

function dialogclose()
{
  $("overlay").style.display = 'none';
	$("commentBlock").style.display = 'none';
}

function answer(){
	$("answerBlock").style.left = (parseInt(document.body.clientWidth) - parseInt($("answerBlock").style.width))/2;
  $("answerBlock").style.top  = 140;
  $("overlay").style.width  =  document.body.clientWidth;
  if(parseInt(document.body.scrollHeight) < parseInt(document.body.clientHeight) )
     $("overlay").style.height  =  document.body.clientHeight;
  else
     $("overlay").style.height  =  document.body.scrollHeight;
  $("overlay").style.display = 'block';
	$("answerBlock").style.display = 'block';
	window.scroll(0,0);
}

function asrclose()
{
  $("overlay").style.display = 'none';
	$("answerBlock").style.display = 'none';
}

function adsubasr(){
  var ANSWER_CONTENT = $('ANSWER_CONTENT').value;
  var ASK_ID = $('ASK_ID').value;
  if(ANSWER_CONTENT == "")
  {alert(td_lang.general.msg_22);return false;}//"�ش����ݲ���Ϊ��"
  var postStr = "ANSWER_CONTENT="+escape(ANSWER_CONTENT);
  var httpReq=getXMLHttpObj();
  httpReq.open("POST","answer.php?ASK_ID="+ASK_ID,true);
  httpReq.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
  httpReq.onreadystatechange=function(){
     if(httpReq.readyState==4){
        if(httpReq.responseText=="ok"){
           alert(td_lang.general.msg_23);//"���ύ�ɹ�"
           window.location.reload();
           asrclose();
        }
     }
  };
  httpReq.send(postStr);
}

var login_str =
'<div style="text-align: center;"'+
  '<div class="logintopBar">'+
		'<table class="topBarTable" cellspacing="0" cellpadding="0" border="0">'+
			'<tr>'+
				'<td style="color:#fff; font-size: 14px; font-weight: bold;">'+td_lang.general.msg_27+'</td>'+
			  '<td align="right">'+
					'<a class="dialogclosecss" onclick="loginclose()" style="width:16px;height:16px;" border="0" align="absmiddle" title='+td_lang.global.close+' /></a>'+
			  '</td>'+
			'</tr>'+
		'</table>'+
  '</div>'+
  '<div>'+
    '<br />'+
    '<div style="text-align: center;"><b style="font-size:15px;">'+td_lang.general.msg_28+'</b></div><br />'+
    '<div style="text-align: center;color:red;display:none;" id="login_error">dd</div>'+
    '<div style="padding-left:80px;">'+
  		'<table border="0" width="250">'+
  			'<tr>'+
  				'<td align="right" style="font-size:12px;">'+td_lang.general.msg_29+'</td>'+
  			  '<td>'+
              '<input type="text" name="MEMBER" id="IDMEMBER" class="upcss" tabindex="1">&nbsp;&nbsp;<a href="register.php" style="font-size:12px;">'+td_lang.global.regist+'</a>'+
  			  '</td>'+
  			'</tr>'+
  			'<tr>'+
  				'<td align="right" style="font-size:12px;">'+td_lang.general.msg_30+'</td>'+
  			  '<td>'+
             '<input type="Password" name="LOGIN_PWORD" id="IDPWORD" class="upcss" tabindex="2"  onkeydown="javascript:if(event.keyCode==13) sublogin();">'+
  			  '</td>'+
  			'</tr>'+
  		'</table><br />'+
  	'</div>'+
    '<div style="text-align: center;">'+
      '<input type="button" onclick="sublogin();" value='+td_lang.general.msg_27+' class="subbcss" tabindex="3">'+
    '</div>'+
   '</div>'+
'</div>';

function userLogin(preUrl,regUrl){
  if(preUrl!="")
     $('REMINDACT').value = preUrl;

	$("p").style.left = (parseInt(document.body.clientWidth) - parseInt($("p").style.width))/2;
  $("p").style.top  = 140;
  $("overlay").style.width  =  document.body.clientWidth;
  if(parseInt(document.body.scrollHeight) < parseInt(document.body.clientHeight) )
     $("overlay").style.height  =  document.body.clientHeight;
  else
     $("overlay").style.height  =  document.body.scrollHeight;
  $("overlay").style.display = 'block';
	$("p").style.display = 'block';
	if(regUrl!='')
	   login_str = login_str.replace('register.php',regUrl);
	//alert(login_str);
	$("p").innerHTML=login_str;
	$('IDMEMBER').focus();
	window.scroll(0,0);
}

function loginclose()
{
  $("overlay").style.display = 'none';
	$("p").style.display = 'none';
}

function sublogin(){
  var IDMEMBER = $('IDMEMBER').value;
  var IDPWORD = $('IDPWORD').value;
  if(IDMEMBER == "")
  {alert(td_lang.general.msg_31);return false;}//"�û�������Ϊ�գ�"
  if(IDPWORD == "")
  {alert(td_lang.general.msg_32);return false;}//"���벻��Ϊ�գ�"
  var httpReq=getXMLHttpObj();
  httpReq.open("GET","login.php?MEMBER="+IDMEMBER+"&LOGIN_PWORD="+IDPWORD,true);
  httpReq.onreadystatechange=function(){
     if(httpReq.readyState==4){
        if(httpReq.responseText=="ok"){
        	 var REMINDACT = $('REMINDACT').value;
        	 if(REMINDACT!="")
        	 {
        	 	  loginclose();
        	 	  var pos = REMINDACT.lastIndexOf("()");
        	 	  if(parseInt(pos) > 1)
        	    {
        	    	 if(parseInt(REMINDACT.lastIndexOf("wer")) > 0)
        	    	 {
        	    	    answer();
        	    	 }
        	    	 if(parseInt(REMINDACT.lastIndexOf("ment")) > 0)
        	    	 {
        	    	    comment();
        	    	 }
        	    }
        	 	  else
        	       window.location.href = REMINDACT;
        	 }
        	 else
        	 {
        	 	  window.location.reload();
        	 		loginclose();
        	 }
        }
        if(httpReq.responseText=="error"){
        	$("login_error").style.display = 'block';
        	$('login_error').innerHTML = td_lang.general.msg_33;//"�û��������벻�ԣ������µ�¼!"
        	$('IDPWORD').value = "";
        	$('IDPWORD').focus();
        }
     }
  };
  httpReq.send(null);
}

function goHome(goUrl){
		window.location=goUrl;
}

function trim(s){
 return s.replace(/(^\s*)|(\s*$)/g, "");
}