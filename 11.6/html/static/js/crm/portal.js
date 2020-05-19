function init(){
   var menu_id=0,menu=document.getElementById("navMenu");
   if(!menu) return;
   
   for(var i=0; i<menu.childNodes.length;i++)
   {
      if(menu.childNodes[i].tagName!="A")
         continue;
      if(menu_id==0)
         menu.childNodes[i].className="active";
      menu.childNodes[i].onclick=function(){
         var menu=document.getElementById("navMenu");
         for(var i=0; i<menu.childNodes.length;i++)
         {
            if(menu.childNodes[i].tagName!="A")
               continue;
            menu.childNodes[i].className="";
			var obj=document.getElementById("content"+menu.childNodes[i].name);
			if(this.name!=menu.childNodes[i].name){
				if(obj){
					obj.style.display="none";
				}
			}else{
				obj.style.display="";
			}
         }
         this.className="active";
      }
      menu_id++;
   }
}
function outSetImg(type){
	typeData = $('#data_type').attr('value');
	if(typeData == type){
		$('#' + type).attr('src','/static/theme/1/crm/images/' + type + 'hover.png');
	}else{
		$('#' + type).attr('src','/static/theme/1/crm/images/' + type + '.png');
	}
}
function getInfo(type,module){
	$('#data_type').val(type);
	var imgObj = $('.data_div img');
	for(var i = 1; i <= imgObj.length; i++){
		if(i == 1){
			$('#day').attr('src','/static/theme/1/crm/images/day.png');
		}else if(i == 2){
			$('#week').attr('src','/static/theme/1/crm/images/week.png');
		}else if(i == 3){
			$('#month').attr('src','/static/theme/1/crm/images/month.png');
		}
	}
	$('#' + type).attr('src','/static/theme/1/crm/images/' + type + 'hover.png');
	if(module==undefined || module==""){
		module="all";
	}
	switch(type){
		case "day":
			start=formatDate(new Date(nowYear, nowMonth, nowDay-2));
			end=formatDate(new Date(nowYear, nowMonth, nowDay));
			break;
		case "week":
			start=formatDate(new Date(nowYear, nowMonth, nowDay-6));
			end=formatDate(new Date(nowYear, nowMonth, nowDay));
			break;
		case "month":
			start=formatDate(new Date(nowYear, nowMonth-1, nowDay));
			end=formatDate(new Date(nowYear, nowMonth, nowDay));
			break;
	}
	$.ajax({
		method:'post',
		data:"start="+start+"&end="+end+"&module="+module,
		url:"getData.php",
		success:function(responseText){
			$("#info_div").html(responseText);
		}
	});
}
function jumpProtal(protal_id, protal_title, protal_url){
	if(window.parent.openURL ){
		var parent_str = window.parent.location.toString();
		var parent_flag = parent_str.indexOf("nav.php");
		if(parent_flag < 0){
			window.parent.openURL(protal_id, protal_title, protal_url);
		}else{
			window.location.href = protal_url;
		}
	}else if(window.parent.parent.openURL){
		var parents_str = window.parent.parent.location.toString();
		var parents_flag = parents_str.indexOf("nav.php");
		if(parents_flag < 0){
			window.parent.parent.openURL(protal_id, protal_title, protal_url);
		}else{
			window.parent.location.href = protal_url;
		}		
	}else{
		window.location.href = protal_url;
	}
}
