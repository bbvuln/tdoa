/*
    author ��� 2013-12-12
    ��js������ʾ��ӡʱ��ǩ��ͼƬ
*/

function GetDataStrPrint(item)
{
    if(typeof item == 'undefined')
	{
		return;
	}

    // var sign_check1 = jQuery('#SIGN_CHECK_STR_'+item).val();  
    var sign_check1 = document.getElementById('SIGN_CHECK_STR_'+item).value;
	sign_check1 = sign_check1.substr(0, sign_check1.length-1);
    var secret_fields = document.getElementById('SECRET_FIELDS_'+item).value;
	var sign_check_array = new Array();
	sign_check_array = sign_check1.split(':');
	   
	var str="";
	var separator = "::";  // �ָ���
	// eval("var TO_VAL=sign_check."+item+";");
	var TO_VAL = sign_check_array[1];

	if(TO_VAL)
	{
		var item_array = TO_VAL.split(",");
        
  	    for (i=0; i < item_array.length; i++)
  	    {
            var MyValue="";
			var obj = document.getElementsByName(item_array[i])[0];
            if(typeof obj.name == 'undefined') {
                var obj = document.getElementsByName(item_array[i])[1];
            }
  	    	// var obj = eval("document.getElementsByName('"+item_array[i]+"')");
            
            if(secret_fields.indexOf(obj.name) == -1)   //ǩ�������ֶα���ǩ��ʧЧ
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
                    MyValue.replace("/&quot;/g","'");//����˫����
                }
                if(MyValue.indexOf("&#039;")>=0)
                {
                    MyValue.replace("/&#039;/g","'");//��������
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
    // �ж������û��ͷ������û�
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
    // ��ǩ��hidden��һЩ����Ĳ���
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
        else if(strObjectName.indexOf("SIGN_INFO")<0) //���ݾ�����
        {
            item_str = strObjectName;
        }
        if(item_str!="")
        {
            var CoordinateX =oDWebSignSeal.GetSealPosX(strObjectName);
            var CoordinateY =oDWebSignSeal.GetSealPosY(strObjectName);
            
            oDWebSignSeal.MoveSealPosition(strObjectName, CoordinateX, CoordinateY, strObjectName); //���¼���ǩ��λ��
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
    
    for(var count = 0; count < document.getElementsByName('SIGN_OBJECT').length; count++)
    {
        sign_id += document.getElementsByName('SIGN_OBJECT')[count].value + ',';
    }
    
    // sign_id += sign_id;//Ī������
    
    if(sign_id != "")
    {
        LoadSignData1(sign_id);
    }
    else
    {
        LoadSignData2();
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


