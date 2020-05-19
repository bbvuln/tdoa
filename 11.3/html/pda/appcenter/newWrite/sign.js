//self.moveTo(0,0);
//self.resizeTo(screen.availWidth,screen.availHeight);
var onm=0;//鼠标按键状态 0是无按键，1是鼠标右键
var x=0;
var y=0;
var pagewrite="";//签名内容
var ones=1;//起笔状态
var ispad=0;//0为pc机，1为pad
// var lineWidth=3;
var beforePage=-1;
var beforePageName="page";
$(function(){
	$("#baocun").click(function(){
		var b=document.getElementById("page1");
		var img=b.toDataURL("image/png");
		var imgstr = img.split(',');
		var imgbase64=imgstr[1];
		var flow_id = $('#WEB_FLOW_ID').val();
		var run_id = $('#WEB_RUN_ID').val();
		var protectVal = $('#WEB_PROTECT_VAL').val();
		var itemId = $('#WEB_ITEM_ID').val();
		var curName = $('#WEB_CUR_NAME').val();
		var action = "/general/appbuilder/web/appcenter/appdata/mobilewebsignsubmit";
		$.ajax({
			type: 'POST',
			url: action,
			cache: false,
			data: {"PROTECT_VAL":protectVal,"ITEM_ID":itemId,"CUR_NAME":curName,"imageInfo":imgbase64},
			beforeSend: function() {
				$.ProLoading.show();
			},
			success: function(data) {
				$.ProLoading.hide();
				if(data == 0)
				{
					parent.showMessage("盖章失败！");
				}else
				{
					var id = itemId.replace("_hw_","");
					if(list_flag=='0'){
						$("#f-field-"+id+ " .web_Seal").val(data.res+',')
						pages.to("handle");
					}else{
						sealCurItem = itemId.split('_hw_')[0]
					$("#f-list-"+sealCurItem+ " .web_list_Seal").val(data.res+',')
                    pages.to("list_detail");
					}
				}
			},
			error: function(data) {
				 $.ProLoading.hide();
				showMessage("盖章失败！");
			}
		});
	});
});

/***********************************************
******************获取http对象*******************
************************************************/
function gethttps(){
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
}

/***********************************************
******************获取url变量*******************
************************************************/
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = location.search.substr(1).match(reg);
	if (r !== null) {
		return unescape(r[2]);
	}
	return null;
}

/***********************************************
*******************笔迹坐标获取******************
************************************************/
function mouseCoords(ev,page)
{
	if(ev.offsetX || ev.offsetY){ 
		return {x:ev.offsetX, y:ev.offsetY}; 
	}
	return {
		x:ev.layerX-document.getElementById("page"+page).offsetLeft, 
		y:ev.layerY-document.getElementById("page"+page).offsetTop
	};
}

/***********************************************
************判断浏览器是否支持html5*************
************************************************/

function checkobj(){
	try{
		var b=document.getElementById("page");
		var cxtb=b.getContext("2d");
	}catch(e){
		document.getElementById("div_book").innerHTML="您的浏览器还不支持html5，请更换浏览器再试";
		return false;
	}
}

/***********************************************
********************初始化对象*****************
************************************************/

function init(filename,pagenum)
{
	var filename="pg";//getUrlParam("FileName");
	var pagenum=1;//getUrlParam("PageNum");
	var htmlcaons="";
	for(var i=1;i<=pagenum;i++){
		htmlcaons+="<canvas id='page"+i+"' width='400' height='480' class='div_cans' onmouseout='onm=0;' onmousedown='onm=1;' onmouseup='mup()' onmousemove='sign(event,"+i+")'></canvas>";
	}
	document.getElementById("div_book").innerHTML=htmlcaons;
	for(var i=1;i<=pagenum;i++){
		var cname="page"+i;
		var asd = new CanvasDrawr({id:cname, size: 2 });
		showtxt(i);
		showbook(filename,i);
	}
}

/***********************************************
***************设置预设显示内容*****************
************************************************/

function showtxt(page){
	// var b=document.getElementById("page"+page);
	// var cxtb=b.getContext("2d");
	// cxtb.font="60px impact";
	// cxtb.fillStyle="#CCCCCC";
	// cxtb.textAlign="center";
	// cxtb.fillText('努力加载中。。。',450,500,400);
	// cxtb.restore();
	// cxtb.closePath();
}

/***********************************************
***************设置显示文档内容*****************
************************************************/

function showbook(filename,page){
	/*var book=new Image();
	book.src="./img/"+filename+"_"+page+".png";
	book.onload=function(){
		var b=document.getElementById("page"+page);
		var cxtb=b.getContext("2d");
		// cxtb.lineWidth=lineWidth;
		cxtb.drawImage(book,0,0,400,480);
	}*/
}

/***********************************************
*******************手写笔迹******************
************************************************/

function sign(ev,page){
	ev= ev || window.event; 
	var mousePos = mouseCoords(ev,page);
	if(onm==1){
		var b=document.getElementById("page"+page);
		var cxtb=b.getContext("2d");
		cxtb.strokeStyle="#FF0000";
		// cxtb.lineWidth=lineWidth;
		cxtb.miterLimit=0;
		x=Math.round(mousePos.x);
		y=Math.round(mousePos.y);
		if(ones==1){
			cxtb.moveTo(x,y);
			if(beforePage==page){
				pagewrite+="("+x+","+y+","+cxtb.lineWidth+";";
			}else{
				if(pagewrite==""){
					pagewrite+="<"+page+","+document.getElementById("page"+page).width+","+document.getElementById("page"+page).height+","+cxtb.strokeStyle+"("+x+","+y+","+cxtb.lineWidth+";";
				}else{
					pagewrite+="><"+page+","+document.getElementById("page"+page).width+","+document.getElementById("page"+page).height+","+cxtb.strokeStyle+"("+x+","+y+","+cxtb.lineWidth+";";
				}
			}
		}else{
			pagewrite+=x+","+y+","+cxtb.lineWidth+";";
		}
		if(ispad==0){
			cxtb.lineTo(x,y);
			cxtb.stroke();
			ones=0;
		}
		beforePage=page;
	}else{
		x=0;
		y=0;
	}
}

/***********************************************
*******************落笔结束********************
************************************************/

function mup(){
	onm=0;
	ones=1;
	pagewrite+=")";
}

/***********************************************
*******************保存笔迹******************
************************************************/

function Save(){
	pagewrite=pagewrite+")>";
	pagewrite=pagewrite.replace("))",")");
	pagewrite=pagewrite.replace("()","");
	alert(pagewrite);
	/*document.getElementById("biji").value=pagewrite;
	var postStr = "SIGN="+pagewrite+"&tmp="+Math.random();
	var oHttp=new ActiveXObject("Microsoft.XMLHTTP");
	oHttp.open("POST","sign.php",false);
	oHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	oHttp.send(postStr);*/
	//location="./end.html";

}