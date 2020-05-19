//--- 图形化设计 ---
var dragapproved = false;
var eventsource,x,y;
var popeventsource = "";
var temp1 = 0;
var temp2 = 0;


//-- 初始化移动参数 --
function nodrags()
{
   dragapproved = false;
}

function move()
{
	if (event.button == 1 && dragapproved)
	{
		var newleft = temp1 + event.clientX - x;
		var newtop = temp2 + event.clientY - y;
		eventsource.style.pixelLeft = newleft;
		eventsource.style.pixelTop = newtop;

		drawLine();

		return false;
	}
}

function drags()
{
  if (event.button != 1)
     return;

	var objRect = event.srcElement;
	if (event.srcElement.tagName.toLowerCase() == 'textbox') objRect = event.srcElement.parentElement;

	if ((objRect.tagName == 'roundrect') && (!event.ctrlKey))
	{
		dragapproved = true;
		eventsource = objRect;
		temp1 = eventsource.style.pixelLeft;
		temp2 = eventsource.style.pixelTop;
		x = event.clientX;
		y = event.clientY;
		document.onmousemove = move;
	}
}

//-- 画线 --
function drawLine()
{
  var source;
  var object;
  var sourceObj;
  var objectObj;
  var x0,y0,x1,y1;
  var p0,p1;
  var a = document.getElementsByTagName('line');
  for (var i = 0; i < a.length; i++)
  {
     source = a[i].getAttribute('source');
     object = a[i].getAttribute('object');
     if ((source != null) && (object != null))
     {
        sourceObj = document.getElementById(source);
        objectObj = document.getElementById(object);
        //alert(sourceObj);

        if ((sourceObj == null) || (objectObj == null)) continue;

        if (sourceObj.style.pixelLeft > objectObj.style.pixelLeft)
        {
           if ((sourceObj.style.pixelLeft - objectObj.style.pixelLeft) <= objectObj.style.pixelWidth)
           {
	  x0 = sourceObj.style.pixelLeft + sourceObj.style.pixelWidth / 2;
	  x1 = objectObj.style.pixelLeft + objectObj.style.pixelWidth / 2;
               if (sourceObj.style.pixelTop >  objectObj.style.pixelTop)
               {
  	  		y0 = sourceObj.style.pixelTop;
  	  		y1 = objectObj.style.pixelTop  + objectObj.style.pixelHeight;
               }
               else
               {
  	  		y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight;
  	  		y1 = objectObj.style.pixelTop;
  	  }
           }
           else
           {
               x0 = sourceObj.style.pixelLeft;
               x1 = objectObj.style.pixelLeft + objectObj.style.pixelWidth;
  	  y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight / 2;
  	  y1 = objectObj.style.pixelTop + objectObj.style.pixelHeight / 2;
           }
        }
        else
        {
           if ((objectObj.style.pixelLeft - sourceObj.style.pixelLeft) <= objectObj.style.pixelWidth)
           {
	  x0 = sourceObj.style.pixelLeft + sourceObj.style.pixelWidth / 2;
	  x1 = objectObj.style.pixelLeft + objectObj.style.pixelWidth / 2;
               if (sourceObj.style.pixelTop >  objectObj.style.pixelTop)
               {
  	  		y0 = sourceObj.style.pixelTop;
  	  		y1 = objectObj.style.pixelTop  + objectObj.style.pixelHeight;
               }
               else
               {
  	  		y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight;
  	  		y1 = objectObj.style.pixelTop;
  	  }
           }
           else
           {
		x0 = sourceObj.style.pixelLeft + sourceObj.style.pixelWidth;
		x1 = objectObj.style.pixelLeft;
		y0 = sourceObj.style.pixelTop + sourceObj.style.pixelHeight / 2;
		y1 = objectObj.style.pixelTop + objectObj.style.pixelHeight / 2;
             }
        }

        a[i].from = String(x0) + ',' + String(y0);
        a[i].to = String(x1) + ',' + String(y1);

        a[i].style.pixelLeft = x0 + 'px';
        a[i].style.pixelTop = y0 + 'px';

        //条件
        strIF = a[i].getAttribute('title');
        if ((strIF != null) && (strIF != ''))
        {
	var id = 'if_' + source + '_' + object;
	var obj = document.getElementById(id);

	var left = (x0 + (x1 - x0) / 2 - 30);
	var top = (y0 + (y1 - y0) / 2 - 15);

	if (obj != null)
	{
		obj.style.pixelLeft = left + 'px';
		obj.style.pixelTop = top + 'px';

		obj.style.left = left + 'px';
		obj.style.top = top + 'px';

		obj.style.display = '';
	}
        }

        a[i].style.display = '';
     }
  }
}

//表单加载完成
function document.onreadystatechange()
{
   if (document.readyState=='complete')
   {
      drawLine();
      document.onmousedown = drags;  //开始移动
      document.onmouseup = nodrags;  //结束移动
   }
}


//-- 选择步骤 --
function SetSel()
{
   var flowType = '';
   var flowID = 0;
   var passCount = 0;
   var flowColor = '';
   var color1="#00EE00";
   var color2="#F4A8BD";
   var color3="#EEEEEE";
   var color4="#EEEEEE";
   var color5="#EEEEEE";
   var colorOut="#EEEEEE";
   var strSelect ="#8E83F5";

   var vml = document.getElementsByTagName('roundrect');
   for (var i = 0; i < vml.length; i++)
   {
      flowType = vml[i].getAttribute('flowType');
      vml[i].fillcolor = eval("color"+flowType);
      if(flowType == 'timeout')
         vml[i].fillcolor = colorOut;
   }

   var objRect = event.srcElement;
   if(event.srcElement.tagName.toLowerCase() == 'textbox')
      objRect = event.srcElement.parentElement;

   //步骤类型
   //flowType = objRect.getAttribute('flowType');
   try { if (objRect.tagName == 'roundrect') objRect.fillcolor = strSelect; } catch(e){}
}


//-- 刷新 --
function Refresh()
{
   location.href = location.href;
}

function LoadWindow(URL)
{
  loc_x=(screen.availWidth-600)/2;
  loc_y=(screen.availHeight-500)/2;
  URL+="&GRAPH=1";
  window.open(URL,"set_process","height=500,width=600,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes");
}
