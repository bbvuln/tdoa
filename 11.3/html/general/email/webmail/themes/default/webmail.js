<!--
	function mOvr(src,clrOver) {
		if (!src.contains(event.fromElement)) {
			src.style.cursor = 'hand';
			src.bgColor = clrOver;
		}
	}
	function mOut(src,clrIn) {
		if (!src.contains(event.toElement)) {
			src.style.cursor = 'default';
			src.bgColor = clrIn;
		}
	}
	function mClk(src) {
		if(event.srcElement.tagName=='TD'){
			src.children.tags('A')[0].click();
		}
	}
// -->	
function SetHeight()
{
   var obj = document.frames['body'];
   if(!obj) return;
   var bb = (obj.document.compatMode && obj.document.compatMode!="BackCompat") ? obj.document.documentElement : obj.document.body;
   document.getElementById('body').style.height = bb.scrollHeight + 4 + "px";
}