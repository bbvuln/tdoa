<script language=javascript for=HWPostil1 event=NotifyCtrlReady>
oAIP = $("HWPostil1");
// �ؼ�"HWPostil1"��NotifyCtrlReady�¼���һ��������¼�����ɳ�ʼ���Ķ���
oAIP.ShowDefMenu = false;/*<?=$_SESSION["LOGIN_USER_PRIV"]==1? "true":"false"?>;*/
oAIP.ShowToolBar = false; //���ع�����
oAIP.TextSmooth = 1 //����ƽ�� 
oAIP.ShowScrollBarButton = 1;
oAIP.JSEnv = 1;  //ȡ��������
oAIP.SetPageMode(1,100);

//������ɫ
userPenColor = getCookie("userPenColor");
if(userPenColor==null)
{
    userPenColor = 0;
}
oAIP.CurrPenColor = userPenColor;

//$("tdColor").innerHTML = LoadColorTable("AIP_SetColor");

//���ʿ�
userPenWidth = getCookie("userPenWidth");
if(userPenWidth==null)
{
    userPenWidth = 4;
}
oAIP.CurrPenWidth = userPenWidth;

window.setTimeout(AIP_LoadFile,1);
</script>
<table class="TableBlock" style="border-width:0px;" width=100% height=100%>
  <tr>
    <td width="100" valign="top">
        <table class="TableBlock" align="center">
            <tr class="TableHeader">
                <td nowrap align="center" width=100 colspan=2><?=_("��ز���")?></td>
            </tr>
            
            <tr class="TableData" onclick="AIP_Read()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" style="border-right:0px;" onclick="AIP_Zoom(true);"><img src="<?=MYOA_STATIC_SERVER?>/static/images/zoom_in.png" title="<?=_("�Ŵ�")?>" ></td>
                <td nowrap align="center" onclick="AIP_Zoom(false);"><img src="<?=MYOA_STATIC_SERVER?>/static/images/zoom_out.png" title="<?=_("��С")?>" ></td>
            </tr>
            
            <tr class="TableData" onclick="AIP_Read()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("�ļ����")?></td>
            </tr>
                       
            <tr class="TableData" onclick="AIP_HandWrite()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("��дǩ��")?></td>
            </tr>
            <tr class="TableData" onclick="AIP_Erase()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("��Ƥ��")?></td>
            </tr>
        
            <tr class="TableData" onclick="AIP_AddSeal()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("�Ӹ�ӡ��")?></td>
            </tr>          
                   
            <tr class="TableData" onclick="AIP_Print()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("��ӡ")?></td>
            </tr>
          
            <tr class="TableHeader">
                <td nowrap align="center" colspan=2><?=_("��������")?></td>
            </tr>  
            
            <tr class="TableData" onclick="AIP_SetPenWidth()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("���ñʿ�")?></td>
            </tr>
            
            <tr class="TableData" onclick="AIP_SetPenColor()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("���ñ���ɫ")?></td>
            </tr>                     
                        
            <tr class="TableHeader">
                <td nowrap align="center" colspan=2><span class="Big3" color="red"><?=_("ҳ��")?><span id="page"></span><span id="total"></span></span></td>
            </tr>
  	    </table>
    </td>
  	<td valign="top" style="position:absolute;width:92%;height:98%;">
<?
$AIP_WIDTH ="100%";
$AIP_HEIGHT = "100%";
include_once("inc/auth.inc.php");
include_once("module/AIP/loadaip_trial.php");
echo $aip_object_html;

if($AIP_FILES_ARRAY[$DISP_AIP])
{
    $ATTACH_AIP = explode("*", $AIP_FILES_ARRAY[$DISP_AIP]);
    if(!$ATTACH_AIP[1])
    {
        $ATTACH_AIP[1] = ".aip";
    }
    $AIP_URL = attach_url($ATTACH_AIP[0], $ATTACH_AIP[1]);
    $AIP_URL = ((isset($_SERVER['HTTPS'])&&$_SERVER['HTTPS']=='on')?'https':'http').'://'.$_SERVER['HTTP_HOST'].$AIP_URL["down"]."&DIRECT_VIEW=1";
}
?>
  	</td>
  </tr>
</table>
<script language=javascript for=HWPostil1 event=NotifyChangePage>
curPage = oAIP.CurrPage+1 ;
$("page").innerHTML = curPage;
</script> 

<SCRIPT LANGUAGE=javascript FOR=HWPostil1 EVENT=NotifyDocOpened>
totalPage = oAIP.PageCount;
$("page").innerHTML = "1";
$("total").innerHTML = "/"+totalPage;
</SCRIPT>

<script language=javascript for=HWPostil1 event=NotifyChangePenColor>
setCookie("userPenColor",oAIP.CurrPenColor);
</script> 

<script language=javascript for=HWPostil1 event=NotifyChangePenWidth>
setCookie("userPenWidth",oAIP.CurrPenWidth);
</script> 

<script language=javascript for=HWPostil1 event=JSNotifyBeforeAction(lActionType,lType,strName,strValue)>
if(lActionType == 5)
{
    //genPostilTime(strValue);
}
</script> 
<script>
var oAIP;
var userPenColor = 0;
var userPenWidth = 4;

var userZoomPersent = 0;
var userZoomDefault = 100;
var userZoomStep = 15;


function AIP_LoadFile()
{
	//��ʼ�����ļ�
	var vRet = false;
	var fileExisted = <?=$AIP_FILES_ARRAY[$DISP_AIP] ? "true" : "false"?>;
	if(!fileExisted)
	{
	   
	    jQuery.get("get_tpl.php?T_ID=<?=$DISP_AIP?>&FLOW_ID="+g_flow_id,"",function(data){
	        vRet = oAIP.LoadFileBase64(data);
	        if(vRet == 0)
	        {
	            AIP_SetFields();
	        }
	        else
	            alert("<?=_("�ĵ�װ��ʧ�ܣ����������Ƿ�������")?>");
	    })
	}
	else
	{
	    var URL = "<?=$AIP_URL?>";
	    vRet = oAIP.LoadFile(URL);
	    if(vRet == 1)
	    {
	        AIP_SetFields();
	    }
	    else
	        alert("<?=_("�ĵ�װ��ʧ�ܣ����������Ƿ�������")?>");
	}
}

function aip_upload()
{
	/*	    
	if(oAIP.IsSaved())
	{
	    return;
	}
	*/
    try{	
        oAIP.HttpInit(); //��ʼ��HTTP���档
        oAIP.HttpAddPostCurrFile("AIP_FILE");
        oAIP.HttpAddPostString("FLOW_ID","<?=$FLOW_ID?>");
        oAIP.HttpAddPostString("RUN_ID","<?=$RUN_ID?>");
        oAIP.HttpAddPostString("T_ID","<?=$DISP_AIP?>");
        oAIP.HttpAddPostString("ATTACHMENT_FULL_NAME","<?=$AIP_FILES_ARRAY[$DISP_AIP]?>");
        oAIP.HttpAddPostString("LOGIN_USER_ID","<?php echo $_SESSION["LOGIN_USER_ID"];?>");
        oAIP.HttpAddPostString("SESSION_ID","<?php echo session_id();?>");
    
        URL = "<?=((isset($_SERVER['HTTPS'])&&$_SERVER['HTTPS']=='on')?'https':'http').'://'.$_SERVER['HTTP_HOST']?>/module/AIP/upload_center.php";
        var ret = oAIP.HttpPost(URL);//�ϴ����ݡ�
        if(ret!="ok")
        {
            alert("��ʽ�ļ��������"+ret);
        }
    }catch(err) {
  	    return;
    } 
}

function AIP_Zoom(flag)
{
    if(userZoomPersent == 0)
    {
        userZoomPersent = userZoomDefault;
    }
    if(flag)
    {
        userZoomPersent += userZoomStep;
    }
    else
    {
        userZoomPersent -= userZoomStep;
    }
    oAIP.SetPageMode(1,userZoomPersent);
}

function AIP_Print()
{
    oAIP.PrintDoc(1,1);	
}

function AIP_HandWrite()
{
	AIP_Login();
    oAIP.CurrAction = 264;
}
function AIP_Erase()
{
	AIP_Login();
    oAIP.CurrAction = 16;
}

function AIP_AddSeal()
{
	AIP_Login();
    oAIP.CurrAction = 2568;
}

function AIP_Login()
{
    if(!oAIP.IsLogin() || oAIP.GetCurrUserId=="sys_admin")
    {
        //var dtrer = oAIP.Login("HWSEALDEMO**", 4, 65535, "DEMO", "");//���ò����û���¼
        var dtrer=oAIP.Login("<?=$_SESSION["LOGIN_USER_NAME"]?>",1,65535,"","");
        if(dtrer==-200){
	        alert("<?=_("δ�������ܿ���UKey��,���޷�ʹ����дǩ�����ܣ�")?>");
        }
        else if(0!=dtrer)
        {
	        alert("<?=_("��¼ʧ�ܣ�")?>");  	
        }
        else
        {
            var auth_aip = window.auth_aip;
            if(auth_aip == false)
            {
                alert('<?=_("��ʽ�ļ���Ȩʧ�ܣ�����ϵOA���̽�����ѯ��")?>');
            }
        }
    }
}

function show_sign()
{
  URL="../sign_select.php?FLOW_ID=<?=$FLOW_ID?>&RUN_ID=<?=$RUN_ID?>&PRCS_ID=<?=$PRCS_ID?>";
  loc_x=400;
  loc_y=200;
  if(is_ie)
  {
    loc_x=document.body.scrollLeft+event.clientX-event.offsetX+400;
    loc_y=document.body.scrollTop+event.clientY-event.offsetY;
  }
  LoadDialogWindow(URL,self,loc_x, loc_y, 380, 350);
}

function AIP_Read()
{
    oAIP.CurrAction = 1;    
}

function AIP_InsertText(user,dept,time,str)
{
    var content = str+"  ("+user+" "+time+")\r\n";
    oAIP.SetValue("<?=_('��ǩ���-')?>"+dept,content);
}

function AIP_SetPenColor()
{
    oAIP.CurrPenColor = -1;
}

function AIP_SetPenWidth()
{
    oAIP.CurrPenWidth = -1;
}

function AIP_SetFields()
{
    //���ñ��ֶ�
    var el = document.form1.elements;
    var oValue;
    var oName;
    window.radio_str = "";
    for(var i=0;i<el.length;i++)
    {
        oName = el[i].getAttribute("name");
        if(oName && oName.indexOf("DATA_")==0)
        {
            if(el[i].type=="radio")
            {
                if(el[i].checked===true)
                {
                    window.radio_str += oName+",";
                    oValue=el[i].value;
                }
                else if(window.radio_str.indexOf(oName) < 0)
                {
                    oValue = "<?=_("δѡ��")?>";
                }
            }
            else
                oValue=el[i].value;

            for(var page_count = 1; page_count <= oAIP.PageCount; page_count++)
            {
                oAIP.SetValue("Page"+page_count+"."+el[i].title,"");
                oAIP.SetValue("Page"+page_count+"."+el[i].title,oValue);
            }
        }
    }
    //����������
    if($("macro_attach"))
    {
        var attach_content = $("macro_attach").innerHTML;
        var re = /<BR>/g;
        attach_content = attach_content.replace(re,"\r\n");
        oAIP.SetValue("<?=_("����")?>","");
        oAIP.SetValue("<?=_("����")?>",attach_content);
    } 
}


function genPostilTime(userId)
{
    var NoteName;
    var CurrNoteName;
    while(NoteName=oAIP.GetNextNote(userId,0,NoteName)){
        CurrNoteName = NoteName;
    }
    if(CurrNoteName)
    {
        var sealNodeX = oAIP.GetNotePosX(CurrNoteName);
        var sealNodeY = oAIP.GetNotePosY(CurrNoteName);
        var sealNoteWidth = oAIP.GetNoteWidth(CurrNoteName);
        var sealNoteHeight = oAIP.GetNoteHeight(CurrNoteName);
        
        sealNoteWidth = 2500;
        sealNoteHeight = 1200;
        var TimeWidth = 2000;
        var TimeHeight = 1500;
        var beginX = sealNodeX+sealNoteWidth-200;
        var beginY = sealNodeY+sealNoteHeight-TimeHeight;
        
        var d = new Date();
        var dStr = (d.getMonth()+1)+"-"+d.getDate()+"\r\n"+str_pad(d.getHours().toString(),2,"0",0)+":"+str_pad(d.getMinutes().toString(),2,"0",0);    
        var NoteNameNew = CurrNoteName+"_Time";
        oAIP.InsertNote(NoteNameNew,0,3,beginX,beginY,TimeWidth,TimeHeight);��
		oAIP.SetValue(NoteNameNew,":PROP::LABEL:0");
    	oAIP.SetValue(NoteNameNew,":PROP:BORDER:0");
    	oAIP.SetValue(NoteNameNew,":PROP:HALIGN:0");
    	oAIP.SetValue(NoteNameNew,":PROP:VALIGN:0");
    	oAIP.SetValue(NoteNameNew,":PROP:FONTSIZE:9");
    	oAIP.SetValue(NoteNameNew,":PROP:FACENAME:<?=_("�����п�")?>");
    	oAIP.SetValue(NoteNameNew,dStr);
    }

}

function str_pad(str,length,pad,padType)
{
    if(length <= str.length)
    {
        return str;
    }
    switch(padType)
    {
        case 0: //���
        var leftLength = length-str.length;
        for(var i=0;i<leftLength;i++);
        {
            str = pad+str;
        }
        break;
    }
    return str;
}
</script>