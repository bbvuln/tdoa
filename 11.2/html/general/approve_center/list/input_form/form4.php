<script language=javascript for=HWPostil1 event=NotifyCtrlReady>
oAIP = $("HWPostil1");
// 控件"HWPostil1"的NotifyCtrlReady事件，一般在这个事件中完成初始化的动作
oAIP.ShowDefMenu = false;/*<?=$_SESSION["LOGIN_USER_PRIV"]==1? "true":"false"?>;*/
oAIP.ShowToolBar = false; //隐藏工具条
oAIP.TextSmooth = 1 //字体平滑 
oAIP.ShowScrollBarButton = 1;
oAIP.JSEnv = 1;  //取消进度条
oAIP.SetPageMode(1,100);

//画笔颜色
userPenColor = getCookie("userPenColor");
if(userPenColor==null)
{
    userPenColor = 0;
}
oAIP.CurrPenColor = userPenColor;

//$("tdColor").innerHTML = LoadColorTable("AIP_SetColor");

//画笔宽
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
                <td nowrap align="center" width=100 colspan=2><?=_("相关操作")?></td>
            </tr>
            
            <tr class="TableData" onclick="AIP_Read()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" style="border-right:0px;" onclick="AIP_Zoom(true);"><img src="<?=MYOA_STATIC_SERVER?>/static/images/zoom_in.png" title="<?=_("放大")?>" ></td>
                <td nowrap align="center" onclick="AIP_Zoom(false);"><img src="<?=MYOA_STATIC_SERVER?>/static/images/zoom_out.png" title="<?=_("缩小")?>" ></td>
            </tr>
            
            <tr class="TableData" onclick="AIP_Read()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("文件浏览")?></td>
            </tr>
                       
            <tr class="TableData" onclick="AIP_HandWrite()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("手写签批")?></td>
            </tr>
            <tr class="TableData" onclick="AIP_Erase()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("橡皮擦")?></td>
            </tr>
        
            <tr class="TableData" onclick="AIP_AddSeal()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("加盖印章")?></td>
            </tr>          
                   
            <tr class="TableData" onclick="AIP_Print()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("打印")?></td>
            </tr>
          
            <tr class="TableHeader">
                <td nowrap align="center" colspan=2><?=_("其他设置")?></td>
            </tr>  
            
            <tr class="TableData" onclick="AIP_SetPenWidth()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("设置笔宽")?></td>
            </tr>
            
            <tr class="TableData" onclick="AIP_SetPenColor()" style="cursor:pointer;line-height:20px;">
                <td nowrap align="center" colspan=2><?=_("设置笔颜色")?></td>
            </tr>                     
                        
            <tr class="TableHeader">
                <td nowrap align="center" colspan=2><span class="Big3" color="red"><?=_("页数")?><span id="page"></span><span id="total"></span></span></td>
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
	//开始加载文件
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
	            alert("<?=_("文档装载失败，请检查网络是否正常！")?>");
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
	        alert("<?=_("文档装载失败，请检查网络是否正常！")?>");
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
        oAIP.HttpInit(); //初始化HTTP引擎。
        oAIP.HttpAddPostCurrFile("AIP_FILE");
        oAIP.HttpAddPostString("FLOW_ID","<?=$FLOW_ID?>");
        oAIP.HttpAddPostString("RUN_ID","<?=$RUN_ID?>");
        oAIP.HttpAddPostString("T_ID","<?=$DISP_AIP?>");
        oAIP.HttpAddPostString("ATTACHMENT_FULL_NAME","<?=$AIP_FILES_ARRAY[$DISP_AIP]?>");
        oAIP.HttpAddPostString("LOGIN_USER_ID","<?php echo $_SESSION["LOGIN_USER_ID"];?>");
        oAIP.HttpAddPostString("SESSION_ID","<?php echo session_id();?>");
    
        URL = "<?=((isset($_SERVER['HTTPS'])&&$_SERVER['HTTPS']=='on')?'https':'http').'://'.$_SERVER['HTTP_HOST']?>/module/AIP/upload_center.php";
        var ret = oAIP.HttpPost(URL);//上传数据。
        if(ret!="ok")
        {
            alert("版式文件保存错误！"+ret);
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
        //var dtrer = oAIP.Login("HWSEALDEMO**", 4, 65535, "DEMO", "");//暂用测试用户登录
        var dtrer=oAIP.Login("<?=$_SESSION["LOGIN_USER_NAME"]?>",1,65535,"","");
        if(dtrer==-200){
	        alert("<?=_("未发现智能卡（UKey）,您无法使用手写签批功能！")?>");
        }
        else if(0!=dtrer)
        {
	        alert("<?=_("登录失败！")?>");  	
        }
        else
        {
            var auth_aip = window.auth_aip;
            if(auth_aip == false)
            {
                alert('<?=_("版式文件授权失败，请联系OA厂商进行咨询。")?>');
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
    oAIP.SetValue("<?=_('会签意见-')?>"+dept,content);
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
    //设置表单字段
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
                    oValue = "<?=_("未选择")?>";
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
    //处理附件区域
    if($("macro_attach"))
    {
        var attach_content = $("macro_attach").innerHTML;
        var re = /<BR>/g;
        attach_content = attach_content.replace(re,"\r\n");
        oAIP.SetValue("<?=_("附件")?>","");
        oAIP.SetValue("<?=_("附件")?>",attach_content);
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
        oAIP.InsertNote(NoteNameNew,0,3,beginX,beginY,TimeWidth,TimeHeight);　
		oAIP.SetValue(NoteNameNew,":PROP::LABEL:0");
    	oAIP.SetValue(NoteNameNew,":PROP:BORDER:0");
    	oAIP.SetValue(NoteNameNew,":PROP:HALIGN:0");
    	oAIP.SetValue(NoteNameNew,":PROP:VALIGN:0");
    	oAIP.SetValue(NoteNameNew,":PROP:FONTSIZE:9");
    	oAIP.SetValue(NoteNameNew,":PROP:FACENAME:<?=_("华文行楷")?>");
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
        case 0: //左侧
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