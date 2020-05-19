(function(){
	var $ = function(id){return document.getElementById(id);};

	window.ShowDialog = function (id,vTopOffset)
	{ 
	   if(typeof arguments[1] == "undefined")
		 vTopOffset = 90;

	   var bb=(document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;

	   $("overlay").style.width = Math.max(parseInt(bb.scrollWidth),parseInt(bb.offsetWidth))+"px";
	   $("overlay").style.height = Math.max(parseInt(bb.scrollHeight),parseInt(bb.offsetHeight))+"px";


	   $("overlay").style.display = 'block';
	   $(id).style.display = 'block';

	   $(id).style.left = ((bb.offsetWidth - $(id).offsetWidth)/2)+"px";
	   $(id).style.top  = (vTopOffset + bb.scrollTop)+"px";//(vTopOffset + bb.scrollTop)+
	}
	window.HideDialog = function (id)
	{
	   $("overlay").style.display = 'none';
	   $(id).style.display = 'none';
	}
	window.ShowOutPage = function (id)//yzx   弹出打印窗口的签章显示
	{
		$(id).style.display = 'block';
	}
	window.HideOutPage = function (id)//yzx   弹出打印窗口的签章页面隐藏
	{
		$(id).style.display = 'none';
	}
})();
