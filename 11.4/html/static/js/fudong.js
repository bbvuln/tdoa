//随着鼠标浮动导航
$(function(){
	var floatHeader = document.createElement("div");
	floatHeader.id = "floatHeader";
	floatHeader.style.position = "absolute";
	floatHeader.style.display = "none";
	//创建浮动窗体
	window.targetHead;
	var tableHeaders = document.getElementsByTagName("tr");
	for(var i=0;i<tableHeaders.length;i++){
		if(tableHeaders[i].className=="TableHeader"){
			tableHeaders[i].srcTop = tableHeaders[i].getBoundingClientRect().top;
			window.targetHead = tableHeaders[i];
			break;
		}
	}
	floatHeader.innerHTML = "<table class='TableList' width='"+window.targetHead.parentNode.parentNode.style.width+"' align='center'>"+window.targetHead.outerHTML+"</table>";
	document.body.appendChild(floatHeader);
});

window.onscroll = function(){
	var div = document.getElementById("floatHeader");
	div.style.top = document.body.scrollTop;
	div.style.left = 0;
	div.style.width = document.body.clientWidth;
	var td1s = div.getElementsByTagName("td");
	var td2s = window.targetHead.getElementsByTagName("td");
	for(var i=0;i<td2s.length;i++){
		td1s[i].style.width = td2s[i].clientWidth;
	}
	if(window.targetHead.srcTop <= document.body.scrollTop){
		div.style.display="block";
	}else{
		div.style.display="none";
	}
}

window.onresize = function(){
	window.onscroll();
}