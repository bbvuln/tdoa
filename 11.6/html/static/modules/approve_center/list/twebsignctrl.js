/*
    author 刘昊 2013-12-12
    此js用于显示打印时的签章图片
*/
function GetDataStrPrint(item)
{
    if(typeof item == 'undefined')
	{
		return;
	}

    // item = item.toLowerCase();
    // var sign_check1 = jQuery('#SIGN_CHECK_STR_'+item).val();
    var sign_check1 = document.getElementById('SIGN_CHECK_STR_'+item) ? document.getElementById('SIGN_CHECK_STR_'+item).value : '';
	if(sign_check1 == '')
		return;
	sign_check1 = sign_check1.substr(0, sign_check1.length-1);
    var secret_fields = document.getElementById('SECRET_FIELDS_'+item).value;
	var sign_check_array = new Array();
	sign_check_array = sign_check1.split(':');
	   
	var str="";
	var separator = "::";  // 分隔符
	// eval("var TO_VAL=sign_check."+item+";");
	var TO_VAL = sign_check_array[1];
	
	if(TO_VAL)
	{
		var item_array = TO_VAL.split(",");
        
  	    for (i=0; i < item_array.length; i++)
  	    {
            var MyValue="";
			var obj = document.getElementsByName(item_array[i])[0];
  	    	// var obj = eval("document.getElementsByName('"+item_array[i]+"')");
            
            if(secret_fields.indexOf(obj.name) == -1)   //签章锁定字段保密签章失效
            {
                if(obj.type == "radio")
                {
                    var obj_len = document.getElementsByName(item_array[i]).length;
                    for(rCount=0; rCount<obj_len; rCount++)
                    {
                        if(document.getElementsByName(item_array[i])[rCount].checked)
                        {
                            MyValue = document.getElementsByName(item_array[i])[rCount].value;
                        }   
                    }
                }
                else if(obj.type == "checkbox")
                {
                    if(obj.checked == true)
                    {
                        MyValue = "on";
                    } 
                    else
                    {
                        MyValue = "";
                    } 
                }
                else
                {
                     MyValue = obj.value;
                }
                
                if(MyValue.indexOf("&quot;")>=0)
                {
                    MyValue.replace("/&quot;/g","'");//处理双引号
                }
                if(MyValue.indexOf("&#039;")>=0)
                {
                    MyValue.replace("/&#039;/g","'");//处理单引号
                }
                str += obj.name + "separator" + MyValue + "\n";
            }
  	    }
    }
    return str;
}

function LoadSignData1(id)
{
    var sign_str = id;
    // 判定试用用户和非试用用户
    var oDWebSignSeal=document.getElementById("DWebSignSeal");
    if(!oDWebSignSeal || typeof(oDWebSignSeal.SetStoreData) == "undefined")
    {
        return;
    }
	var auth_websign_code = window.auth_websign_code;
	if(auth_websign_code != '')
	{
		oDWebSignSeal.SetSealComment("SET_ABOUT_TIPS", 0, 0, auth_websign_code);
	}
    // 对签章hidden做一些奇妙的操作
    var sign_arr = sign_str.split(",");
    for(var i=0;i<sign_arr.length;i++)
    {
        if(sign_arr[i]!="")
        {
            if(sign_str!="")
            {   
                var item_value = document.getElementsByName(sign_arr[i])[0].value;
                oDWebSignSeal.SetStoreData(item_value);
            }
        }
    }
    oDWebSignSeal.ShowWebSeals();
	
    var str = "";
    var strObjectName;
    strObjectName = oDWebSignSeal.FindSeal("",0);
	
    while(strObjectName  != "")
    {
        var item_str = "";
        if(strObjectName.indexOf("_hw")>0)
        {
            item_str = strObjectName.substring(0,strObjectName.indexOf("_hw"));
        }
        else if(strObjectName.indexOf("_seal")>0)
        {
            item_str = strObjectName.substring(0,strObjectName.indexOf("_seal"));
        }
        else if(strObjectName.indexOf("SIGN_INFO")<0) //兼容旧数据
        {
            item_str = strObjectName;
        }
		
        if(item_str!="")
        {
            var CoordinateX =oDWebSignSeal.GetSealPosX(strObjectName);
            var CoordinateY =oDWebSignSeal.GetSealPosY(strObjectName);
            
            oDWebSignSeal.MoveSealPosition(strObjectName, CoordinateX, CoordinateY, strObjectName); //从新计算签章位置
			
            str = GetDataStrPrint(item_str);
			
            oDWebSignSeal.SetSealSignData(strObjectName,str);
            oDWebSignSeal.SetMenuItem(strObjectName,4);
        }
        strObjectName = oDWebSignSeal.FindSeal(strObjectName,0);
    }
}
    
function LoadSignData2()
{
    return;
}

function goLoadSignData()
{
    var sign_id = '';
	//var websign_id = '';
    for(var count = 0; count < document.getElementsByName('SIGN_OBJECT').length; count++)
    {
        sign_id += document.getElementsByName('SIGN_OBJECT')[count].value + ',';
		//websign_id += jQuery('input[name="SIGN_OBJECT"]').eq(count).attr('WEBSIGN_ID')+',';
    }
    // sign_id += sign_id;
    if(sign_id != "")
    {
		if(is_ie)
		{
			LoadSignData1(sign_id);
		}else
		{
			// loadWebSignData(sign_id,websign_id);
		}
    }
    else
    {
        LoadSignData2();
    }
}
function loadWebSignData(sign_id,websign_id)
{
	var sign_arr = sign_id.split(",");
	var web_arr = websign_id.split(",");
	for(var i = 0; i < sign_arr.length; i++)
	{
		if(sign_arr[i] == '')
			continue;
		var protectVal = GetDataStrPrint(sign_arr[i]);
		var itemId = web_arr[i];
		jQuery.ajax({
			type: "POST",
			url: "input_form/websignData.php",
			data: "FLOW_ID="+g_flow_id+"&RUN_ID="+g_run_id+"&ITEM_ID="+itemId+"&PROTECT_VAL="+protectVal,
			success:function(data)
			{
				jsonData = JSON.parse(data);
				if(jsonData)
				{
					var imgBase64 = jsonData[0];
					var coordinate = jsonData[1];
					var locationAndpx = jsonData[2].split(',');
					var img_x = locationAndpx[0];
					var img_y = locationAndpx[1];
					var img_w = locationAndpx[2];
					var img_h = locationAndpx[3];
					jQuery("#"+coordinate).append('<div id="'+sign_arr[i]+'_SIGN" style="position: absolute;z-index:2000;"><div id="'+sign_arr[i]+'" style="left:'+img_x+'px; top:'+img_y+'px;position: absolute;z-index:1;"><img style="width:'+img_w+'px;height:'+img_h+'px" src="data:image/png;base64,'+imgBase64+'"></div></div>');
				}
			}
		});
	}
}
if(window.attachEvent)
{
   window.attachEvent("onload", goLoadSignData);
}
else if(window.addEventListener)
{
   window.addEventListener("load", goLoadSignData,false);
}


