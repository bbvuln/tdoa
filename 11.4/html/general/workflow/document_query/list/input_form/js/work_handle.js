jQuery(document).ready(function(){
	//初始化日期控件的点击事件
	jQuery("img.DATE").bind("click",function(){
		var date_format = jQuery(this).attr("date_format");
		if(!date_format){
			date_format = "yyyy-MM-dd";
		}
		var des_obj = jQuery(this).attr("des");
		WdatePicker({dateFmt:date_format, el:jQuery('input[name="'+des_obj+'"]').get(0)});
	});
    initSelect();
	SignLoadFlag = true;//页面加载完成标志测试页面使用
});

function handWrite(item){
    try {
	    if(DWebSignSeal.FindSeal(item+"_hw",2)!=""){
	    	alert(td_lang.general.workflow.msg_188);
	    	return;
	    }
	    var str=SetStore(item);
	    DWebSignSeal.SetPosition(0,0,"SIGN_POS_"+item);
	    DWebSignSeal.HandWrite(0,-1,item+"_hw");
        DWebSignSeal.SetSealSignData(item+"_hw",str);
	    DWebSignSeal.SetMenuItem(item+"_hw",261);
	}catch(e){}
}

function addSeal(item,seal_id)
{
    try {
	    if(DWebSignSeal.FindSeal(item+"_seal",2)!="")
	    {
	    	alert(td_lang.general.workflow.msg_188);
	    	return;
	    }
	    var str=SetStore(item);
	    DWebSignSeal.SetPosition(0,0,"SIGN_POS_"+item);
	    if(SEAL_FROM == 1){
	    	DWebSignSeal.addSeal("", item+"_seal");
	    }else{
	    	if(typeof seal_id=="undefined"){
	    		show_seal(item,"addSeal");
	    	}else{
	    		var URL = sealGetURL+"?ID="+seal_id;
	    		DWebSignSeal.AddSeal(URL, item+"_seal");
	    	}
	    }
        DWebSignSeal.SetSealSignData(item+"_seal",str);
	    DWebSignSeal.SetMenuItem(item+"_seal",261);
    }catch(e){}
}
function GetDataStr(item){
	if(typeof item == 'undefined'){
		return;
	}
	var str="";
	var separator = "::"; 
	eval("var TO_VAL=sign_check."+item+";");
	if(TO_VAL){
		var item_array = TO_VAL.split(",");
  	    for (i=0; i < item_array.length; i++){
  		    var MyValue="";
  		    var obj = eval("document.form1."+item_array[i]);
  		    if(obj.type=="checkbox"){
  			    if(obj.checked==true){
  			    	 MyValue="on";
  			    }else{
  			    	MyValue="";
  			    } 
  		    }else{
  		    	MyValue=obj.value;
  		    }
  		    str += obj.name + "separator" + MyValue + "\n";
  	    }
    }
    return str;
}
function SetStore(item)
{
    try {
        var str= GetDataStr(item);
        DWebSignSeal.SetSignData("-");
	    DWebSignSeal.SetSignData("+DATA:" + str);
	}
	catch(e) {}
	return str;
}
