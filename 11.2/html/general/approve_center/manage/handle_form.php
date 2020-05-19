<?php
include_once("inc/auth.inc.php");
include_once("inc/utility_flow.php");
include_once("inc/utility_calendar.php");
include_once("form.inc.php");
$connstatus = isset($_GET['connstatus']) ? $_GET['connstatus'] : $_GET['CONNSTATUS'];
$EDIT_MODE	= isset($_GET['edit_mode']) ? $_GET['edit_mode'] : $_GET['EDIT_MODE'];
$PRCS_KEY_ID	= isset($_GET['prcs_key_id']) ? $_GET['prcs_key_id'] : $_GET['PRCS_KEY_ID'];
if($PRCS_KEY_ID && $flow_run_prcs = getFlowRunPrcsById(intval($PRCS_KEY_ID), false)){
    $RUN_ID = $flow_run_prcs['RUN_ID'];
    $PRCS_ID = $flow_run_prcs['PRCS_ID'];
    $FLOW_PRCS = $flow_run_prcs['FLOW_PRCS'];
}else{
    $RUN_ID		= isset($_GET['run_id']) ? $_GET['run_id'] : $_GET['RUN_ID'];
    $PRCS_ID	= isset($_GET['prcs_id']) ? $_GET['prcs_id'] : $_GET['PRCS_ID'];
    $FLOW_PRCS	= isset($_GET['flow_prcs']) ? $_GET['flow_prcs'] : $_GET['FLOW_PRCS'];
    $PRCS_KEY_ID = '';
}
$FLOW_ID	= isset($_GET['flow_id']) ? $_GET['flow_id'] : $_GET['FLOW_ID'];
$actionType 	= $_GET['actionType'] == "" ? "handle" : $_GET['actionType'];
$a_flow_data = getFlowInfo($FLOW_ID);
$TYPE = $a_flow_data["FLOW_TYPE"];

//���ӷ�������ѯ�ж�
if($connstatus == 1){
	$connstatus = true;
}else{
	$connstatus = "";
}
$pagestarttime=microtime();
$SEAL_FROM=get_sys_para("SEAL_FROM");

$USER_PRIV_NAME = rtrim(GetPrivNameById($_SESSION["LOGIN_USER_PRIV"]), ",");

/***START OF ȡ�ĺ�,������Ϣ**/
//----- ȡ�ĺ�,������Ϣ --------
$query = "SELECT * from BPM_RUN WHERE RUN_ID='$RUN_ID'";
$cursor= exequery(TD::conn(),$query,tuer);
if($ROW=mysql_fetch_array($cursor))
{
	$RUN_NAME=$ROW["RUN_NAME"];
	$ATTACHMENT_ID=$ROW["ATTACHMENT_ID"];
	$ATTACHMENT_NAME=$ROW["ATTACHMENT_NAME"];
	$FOCUS_USER=$ROW["FOCUS_USER"];
	$BEGIN_USER=$ROW["BEGIN_USER"];
	$PARENT_RUN=$ROW["PARENT_RUN"];
	$BEGIN_USER_NAME = rtrim(GetUserNameById($BEGIN_USER), ",");
	$BEGIN_TIME=$ROW["BEGIN_TIME"];
	$PARENT_RUN=$ROW["PARENT_RUN"];
	$AIP_FILES = $ROW["AIP_FILES"];
	$work_level = $ROW["WORK_LEVEL"];

	if($AIP_FILES!="")
	{
		$AIP_FILES_ARRAY = array();
		$MY_ARRAY = explode("\n",$AIP_FILES);
		foreach($MY_ARRAY as $V)
		{
			$TMP = explode(":",$V);
			$AIP_FILES_ARRAY[$TMP[0]] = $TMP[1];
		}
	}

	if($PARENT_RUN!=0)
	{
		$query = "SELECT FLOW_ID from BPM_RUN WHERE RUN_ID='$PARENT_RUN'";
		$cursor1= exequery(TD::conn(),$query,$connstatus);
		if($ROW=mysql_fetch_array($cursor1))
			$PARENT_FLOW_ID=$ROW["FLOW_ID"];
	}
}
/***END OF ȡ�ĺ�,������Ϣ**/


/***START OF ��⹤�� ״̬��������ʾ��Ϣ**/
if(!$EDIT_MODE)
{
    $condition = $PRCS_KEY_ID ? " AND ID='$PRCS_KEY_ID'" : '';
	$str = "";
    $query = "SELECT 1 from BPM_RUN_PRCS WHERE RUN_ID='$RUN_ID'".$condition." AND PRCS_ID='$PRCS_ID' AND FLOW_PRCS='$FLOW_PRCS' and USER_ID='".$_SESSION["LOGIN_USER_ID"]."' and PRCS_FLAG in(1,2) limit 1";
   
    $cursor= exequery(TD::conn(),$query,$connstatus);
    if(!mysql_fetch_array($cursor))
    {
    	$query1 = "select 1 from BPM_RUN where RUN_ID='$RUN_ID' and END_TIME is not NULL";
    	$cursor1 = exequery(TD::conn(), $query1,$connstatus);
    	if(mysql_fetch_array($cursor1))
    	{
    		$str = _('����');
    	}
    	else
    	{
    		$query2 = "SELECT 1 from BPM_RUN_PRCS WHERE RUN_ID='$RUN_ID'".$condition." AND PRCS_ID='$PRCS_ID' AND FLOW_PRCS='$FLOW_PRCS' and USER_ID='".$_SESSION["LOGIN_USER_ID"]."' and PRCS_FLAG in(3,4) limit 1";
    		$cursor2 = exequery(TD::conn(), $query2,$connstatus);
    		if(!mysql_fetch_array($cursor2))
    		{
    			$str = _('�ջ�');
    		}
    		else
    		{
    			$str = _('ת������һ��');
    		}
    	}
    	    	
        Message("", sprintf(_("��ˮ�ţ�%s �ĺţ�%s �Ĺ����Ѿ�%s�������ܰ���"), $RUN_ID, $RUN_NAME, $str));
        echo '<div align="center">
    		  <input type="button" value="'._("�鿴��").'" class="BigButton" title="'._("�鿴��").'" onclick="window.parent.form_view1('.$RUN_ID.','.$FLOW_ID.')">
    		  <input type="button" id="back_btn" class="BigButton" value='._("����").' onclick="window.parent.wgotobackAction();">
    		  <input type="button" id="close_btn" class="BigButton" value='._("�ر�").' onclick="TJF_window_close();window.parent.close();"></div>
    		  <script>
    		          
                function goBackIndex(){
                    if(typeof window.parent.parent.hideForm == "function"){
                        window.parent.parent.hideForm();
                    }else{
                        window.parent.location.href=\'/general/approve_center/list/\';
                    }
                }
    		  window.onload = function() {
    			  var close_btn = document.getElementById("close_btn");
    			  var back_btn = document.getElementById("back_btn");
    			  if(top.document.getElementById("tabs_container"))
    			  {
    			     close_btn.style.display = "none";
                  }
    			  else
    			  {
    			     back_btn.style.display = "none";
                  }
              }
    		  </script>
    		  ';
        exit;
    }
}
/***END OF ��⹤�� ״̬��������ʾ��Ϣ**/

/***START OF ����Ƿ�ɾ������������ʾ��Ϣ**/
$query="SELECT DEL_FLAG FROM BPM_RUN WHERE RUN_ID='$RUN_ID'";
$cursor= exequery(TD::conn(),$query,$connstatus);
if($ROW=mysql_fetch_array($cursor))
    $DEL_FLAG=$ROW["DEL_FLAG"];

if($DEL_FLAG==1)
{
    Message("",_("�˹����Ѿ�ɾ���������ܰ���"));
    if($FROM=="TASKCENTER")
	echo '<div align="center"><input type="button" class="BigButton" value='._("����").' onclick="history.go(-1);"></div>';
	else
    echo '<div align="center"><input type="button" class="BigButton" value='._("����").' onclick="location=\'../index.php\'"></div>';
    exit;
}
/***END OF ����Ƿ�ɾ������������ʾ��Ϣ**/

/***START OF �����ϵͳUKEY���ؼ��û���UKEY��Ϣ**/
$PARA_ARRAY = get_sys_para("LOGIN_KEY");
while(list($PARA_NAME, $PARA_VALUE) = each($PARA_ARRAY))
   $$PARA_NAME = $PARA_VALUE;

$query = "SELECT USEING_KEY,KEY_SN from USER where UID='".$_SESSION["LOGIN_UID"]."'";
$cursor= exequery(TD::conn(),$query);
if($ROW=mysql_fetch_array($cursor))
{
    $USEING_KEY=$ROW["USEING_KEY"];
    $KEY_SN=$ROW["KEY_SN"];
}
/***END OF �����ϵͳUKEY���ؼ��û���UKEY��Ϣ**/

/***START OF ��ȡ������Ϣ�����̵��Զ� �����Ϣ**/
$FLOW_ID = intval($FLOW_ID);
$query = "SELECT * from BPM_TYPE WHERE FLOW_ID='$FLOW_ID'";
$cursor1= exequery(TD::conn(),$query);
if($ROW=mysql_fetch_array($cursor1))
{
    $FLOW_NAME=$ROW["FLOW_NAME"];
    $FORM_ID=$ROW["FORM_ID"];
    $FLOW_TYPE=$ROW["FLOW_TYPE"];
    $FLOW_DOC=$ROW["FLOW_DOC"];
    $AUTO_NUM = $ROW["AUTO_NUM"];
    $AUTO_LEN = $ROW["AUTO_LEN"];
    $MODEL_ID = $ROW["MODEL_ID"];
    $MODEL_NAME = $ROW["MODEL_NAME"];
    $LEN=strlen($AUTO_NUM);
    for($I=0;$I<$AUTO_LEN-$LEN;$I++)
        $AUTO_NUM="0".$AUTO_NUM;
}
$table_name = "BPM_DATA_".$FLOW_ID;
if(field_exists($table_name, 'flow_auto_num')){
	$query = "SELECT FLOW_AUTO_NUM FROM `".$table_name."` WHERE RUN_ID = '".$RUN_ID."'";
	$cursor = exequery(TD::conn(),$query,$connstatus);
	if($row = mysql_fetch_array($cursor)){
		$FLOW_AUTO_NUM = $row["FLOW_AUTO_NUM"];
	}
}
if(!empty($FLOW_AUTO_NUM)){
	$AUTO_NUM = $FLOW_AUTO_NUM;
}
/***END OF ��ȡ������Ϣ�����̵��Զ� �����Ϣ*/

/***START OF ������ ��״̬ �»�ȡ���̲���İ�����Ϣ**/
if(!$EDIT_MODE)  //��������ģʽ
{
    $query = "SELECT * from BPM_RUN_PRCS WHERE RUN_ID='$RUN_ID'".$condition." AND PRCS_ID='$PRCS_ID' AND USER_ID='".$_SESSION["LOGIN_USER_ID"]."' AND FLOW_PRCS='$FLOW_PRCS' ORDER BY PRCS_FLAG LIMIT 1";
    $cursor= exequery(TD::conn(),$query,$connstatus);
    if($ROW=mysql_fetch_array($cursor))
    {
        $OP_FLAG=$ROW["OP_FLAG"];
        $PRCS_FLAG=$ROW["PRCS_FLAG"];
        $TOP_FLAG=$ROW["TOP_FLAG"];
        $PARENT=$ROW["PARENT"];
        $PRCS_TIME=$ROW["PRCS_TIME"];
        $FREE_ITEM=$ROW["FREE_ITEM"];
    }
}
else
    $OP_FLAG=1;
    
/***END OF ������ ��״̬ �»�ȡ���̲���İ�����Ϣ*/
    
/***START OF ����������Ϣ��ȡ���̲���������Ϣ**/
if($EDIT_MODE==1) //�˱�����ڹ�����ѯ��ģ����������
    $FLOW_TYPE=2;

if($FLOW_TYPE=="1")
{
    $query = "SELECT * from BPM_PROCESS WHERE FLOW_ID='$FLOW_ID' AND PRCS_ID='$FLOW_PRCS'";
    $cursor1= exequery(TD::conn(),$query);
    if($ROW=mysql_fetch_array($cursor1))
    {
    	$PRCS_NAME              = $ROW["PRCS_NAME"];
        $PRCS_ITEM              = $ROW["PRCS_ITEM"];
        $PRCS_ITEM_AUTO         = $ROW["PRCS_ITEM_AUTO"];
        $FEEDBACK               = $ROW["FEEDBACK"];
        $SIGNLOOK               = $ROW["SIGNLOOK"];
        $HIDDEN_ITEM            = $ROW["HIDDEN_ITEM"];
        $TIME_OUT               = $ROW["TIME_OUT"];
        $TIME_OUT_MODIFY        = $ROW["TIME_OUT_MODIFY"];
        $ATTACH_PRIV            = $ROW["ATTACH_PRIV"];
        $ALLOW_BACK             = $ROW["ALLOW_BACK"];
        $DISP_AIP               = $ROW["DISP_AIP"];
        $GATHER_NODE            = $ROW["GATHER_NODE"];
        $USER_ATTACH_EDIT_PRIV  = $ROW["ATTACH_EDIT_PRIV"];
        $ATTACH_MACRO_MARK 		= $ROW["ATTACH_MACRO_MARK"];
         
        if($ALLOW_BACK)
        {
            $BACK_FLAG=1;
            $query = "SELECT 1 FROM BPM_RUN_PRCS WHERE RUN_ID='$RUN_ID' AND PRCS_ID='$PRCS_ID' AND OP_FLAG='1' AND FLOW_PRCS<>'$FLOW_PRCS' AND PARENT='$PARENT'";
            $cursor = exequery(TD::conn(),$query,$connstatus);
            if(mysql_fetch_array($cursor))
                $BACK_FLAG=0;
        }
    }    
}   
/***END OF ����������Ϣ��ȡ���̲���������Ϣ*/


/***START OF ���ݱ���ȡ���������Ϣ**/
$FORM_ID = intval($FORM_ID);
$query = "SELECT * from BPM_FORM_TYPE WHERE FORM_ID='$FORM_ID'";
$cursor1= exequery(TD::conn(),$query);
if($ROW=mysql_fetch_array($cursor1))
{
    $FORM_NAME=$ROW["FORM_NAME"];
    $PRINT_MODEL=$ROW["PRINT_MODEL_SHORT"];
    $SCRIPT = $ROW["SCRIPT"];
    $CSS = $ROW["CSS"];
}
//----- ��ǩ��Ϣ --------
if(!$EDIT_MODE)
{
	$PRCS_ID = intval($PRCS_ID);
    $query = "SELECT * from BPM_RUN_FEEDBACK where RUN_ID='$RUN_ID' AND PRCS_ID='$PRCS_ID' AND USER_ID='".$_SESSION["LOGIN_USER_ID"]."'";
    $cursor= exequery(TD::conn(),$query,$connstatus);
    if($ROW=mysql_fetch_array($cursor))
       $FEEDBACK_SIGNED=1;
}
?>
<style>
/*�û��Զ�����ʽ��*/
<?=$CSS?>

.color1 {color:#FFBC18;}
.color2 {color:#50C625;}
.color3 {color:#F4A8BD;}
.color4 {color:#FF0000;}
</style>
<?php
/***END OF ���ݱ���ȡ���������Ϣ*/

$CUR_TIME1=date("H:i:s",time());
$CUR_DATE=date("Y-m-d");
$CUR_TIME=$CUR_DATE." ".$CUR_TIME1;
/***START OF ���հ����������״̬��δ���ձ��Ϊ������*/
if(!$EDIT_MODE)
{
   
    if($PRCS_FLAG==1)
   {
       /*
     $query = "update BPM_RUN_PRCS set PRCS_FLAG='2',PRCS_TIME='$CUR_TIME' WHERE USER_ID='".$_SESSION["LOGIN_USER_ID"]."' AND RUN_ID='$RUN_ID' AND PRCS_ID='$PRCS_ID' AND FLOW_PRCS='$FLOW_PRCS' AND PRCS_FLAG='$PRCS_FLAG'";
     exequery(TD::conn(),$query);
    
     if($TOP_FLAG==1 && $OP_FLAG==1)
     {
     	 //������߸���Ϊ�Ӱ���
        $query = "update BPM_RUN_PRCS set OP_FLAG=0 WHERE USER_ID<>'".$_SESSION["LOGIN_USER_ID"]."' AND RUN_ID='$RUN_ID' AND PRCS_ID='$PRCS_ID' AND FLOW_PRCS='$FLOW_PRCS'";
        exequery(TD::conn(),$query);
     }
    */
     if($PRCS_ID==1)
     {
        $query = "update BPM_RUN set BEGIN_USER='".$_SESSION["LOGIN_USER_ID"]."',BEGIN_TIME='$CUR_TIME' where RUN_ID='$RUN_ID'";
        exequery(TD::conn(),$query);
        
        /*
        if($PARENT_RUN!=0)
        {
           $query = "update BPM_RUN_PRCS set PRCS_TIME='$CUR_TIME',PRCS_FLAG=2 where RUN_ID='$PARENT_RUN' and USER_ID='".$_SESSION["LOGIN_USER_ID"]."' and CHILD_RUN='$RUN_ID'";
           exequery(TD::conn(),$query);
        }
        */
     }
          delete_taskcenter_bpm($RUN_ID,$PRCS_ID,2,$TIME_OUT_FLAG,$FLOW_PRCS);
   }
   elseif($PRCS_FLAG==3||$PRCS_FLAG==4)
   {
    	 Message("",_("�����ѱ�������ת���������ٽ��а���"));
    	 Button_Back();
    	 exit;
    }

   //---------- �޸���һ����״̬Ϊ�Ѿ�������� ----------
   /*
   $PRCS_ID1=$PRCS_ID-1;
   $query = "update BPM_RUN_PRCS set PRCS_FLAG='4' WHERE RUN_ID='$RUN_ID' AND PRCS_ID='$PRCS_ID1'";
   if($PARENT!="0" && $PARENT!="")
      $query.=" AND FLOW_PRCS IN ($PARENT)";
   exequery(TD::conn(),$query);
   */
   delete_taskcenter_bpm($RUN_ID,$PRCS_ID,$FLOW_PRCS);
 }//!EDIT_MODE
/***END OF ���հ����������״̬��δ���ձ��Ϊ������*/
 
 
 /***START OF �����еĺ�����Ϣ�滻������Ҫ����Ϣ**/
 $PRCS_DATE=strtok($BEGIN_TIME," ");
$PRINT_MODEL=str_replace("#[MACRO_FORM]","<b>$FORM_NAME</b>",$PRINT_MODEL);
$PRINT_MODEL=str_replace("#[MACRO_RUN_NAME]",$RUN_NAME,$PRINT_MODEL);
$PRINT_MODEL=str_replace("#[MACRO_TIME]",_("���ڣ�").format_date($PRCS_DATE),$PRINT_MODEL);
$PRINT_MODEL=str_replace("#[MACRO_RUN_ID]",$RUN_ID,$PRINT_MODEL);
$PRINT_MODEL=str_replace("#[MACRO_COUNTER]",$AUTO_NUM,$PRINT_MODEL);
$PRINT_MODEL .= '<input type="hidden" name="FLOW_AUTO_NUM" value="'.$AUTO_NUM.'"/>';

//---------�������Ӻ���------------------

if($FLOW_DOC!=0 && strstr($PRINT_MODEL,"#[MACRO_ATTACH"))
{
   $PRINT_MODEL=getAttach($RUN_ID,$ATTACHMENT_ID,$ATTACHMENT_NAME,$PRINT_MODEL,$ATTACH_MACRO_MARK);
}


if(strstr($PRINT_MODEL,"#[MACRO_TIMEOUT"))
{
	$PRINT_MODEL=getTimeout($RUN_ID,$PRINT_MODEL);
}

$SIGN_OBJECT_OTHER = 0; //��ǩ��������е�����дǩ�µĴ���
if(strstr($PRINT_MODEL,"#[MACRO_SIGN"))
{
   $ARR_PRINT_MODEL=getSignInfo($RUN_ID,$FLOW_ID,$PRINT_MODEL,$SIGN_OBJECT_OTHER);
   $PRINT_MODEL = $ARR_PRINT_MODEL["PRINT_MODEL"];
}

$JS_ONLOAD = "";

    $DEBUG_MODE = true;
    $GLOBALS["FORM_ID"] = isset($FORM_ID) ? $FORM_ID : "";
    $GLOBALS["FLOW_ID"] = isset($FLOW_ID) ? $FLOW_ID : "";
    $GLOBALS["RUN_ID"] = isset($RUN_ID) ? $RUN_ID : "";
    $GLOBALS["PRCS_ID"] = isset($PRCS_ID) ? $PRCS_ID : "";
    $GLOBALS["FLOW_PRCS"] = isset($FLOW_PRCS) ? $FLOW_PRCS : "";
    $GLOBALS["OP_FLAG"] = isset($OP_FLAG) ? $OP_FLAG : "";
    $GLOBALS["FLOW_TYPE"] = isset($FLOW_TYPE) ? $FLOW_TYPE : "";
    $GLOBALS["FREE_ITEM"] = isset($FREE_ITEM) ? $FREE_ITEM : "";
    $GLOBALS["PRCS_ITEM"] = isset($PRCS_ITEM) ? $PRCS_ITEM : "";
    $GLOBALS["FORM_NAME"] = isset($FORM_NAME) ? $FORM_NAME : "";
    $GLOBALS["RUN_NAME"] = isset($RUN_NAME) ? $RUN_NAME : "";
    $GLOBALS["PRCS_DATE"] = isset($PRCS_DATE) ? $PRCS_DATE : "";
    $GLOBALS["BEGIN_TIME"] = isset($BEGIN_TIME) ? $BEGIN_TIME : "";
    $GLOBALS["AUTO_NUM"] = isset($AUTO_NUM) ? $AUTO_NUM : "";
    $GLOBALS["SIGN_OBJECT"] = isset($SIGN_OBJECT) ? $SIGN_OBJECT : "";
    $GLOBALS["SIGN_CHECK_STR"] = isset($SIGN_CHECK_STR) ? $SIGN_CHECK_STR : "";
    $GLOBALS["READ_ONLY_STR"] = isset($READ_ONLY_STR) ? $READ_ONLY_STR : "";
    $GLOBALS["HIDDEN_ITEM"] = isset($HIDDEN_ITEM) ? $HIDDEN_ITEM : "";
    $GLOBALS["PRCS_ITEM_AUTO"] = isset($PRCS_ITEM_AUTO) ? $PRCS_ITEM_AUTO : "";
    $GLOBALS["HIDDEN_STR"] = isset($HIDDEN_STR) ? $HIDDEN_STR : "";
    $GLOBALS["JS_ONLOAD"] = isset($JS_ONLOAD) ? $JS_ONLOAD : "";
    $GLOBALS["EDIT_MODE"] = isset($EDIT_MODE) ? $EDIT_MODE : "";
    $GLOBALS["AUTO_NEW"] = isset($AUTO_NEW) ? $AUTO_NEW : "";

$PRINT_MODEL= parse_form($PRINT_MODEL, $DEBUG_MODE);
/***END OF �����еĺ�����Ϣ�滻������Ҫ����Ϣ*/

include_once("module/websign/ver_trial.php");
echo $websign_object_html;
?>
<input type="hidden"  name="SAVE_FLAG" value="1">
<input type="hidden"  name="FLOW_TYPE" value="<?=$TYPE?>">
<input type="hidden"  name="EDIT_MODE" value="<?=$EDIT_MODE?>">
<input type="hidden"  name="RUN_ID" value="<?=$RUN_ID?>">
<input type="hidden"  name="RUN_NAME" value="<?=$RUN_NAME?>">
<input type="hidden"  name="FLOW_ID" value="<?=$FLOW_ID?>">
<input type="hidden"  name="PRCS_ID" value="<?=$PRCS_ID?>">
<input type="hidden"  name="FLOW_PRCS" value="<?=$FLOW_PRCS?>">
<input type="hidden"  name="ITEM_ID_MAX" value="<?=$ITEM_ID?>">
<input type="hidden"  name="MENU_FLAG" value="<?=$MENU_FLAG?>">
<input type="hidden"  name="HIDDEN_STR" value="<?=$HIDDEN_STR?>">
<input type="hidden"  name="READ_ONLY_STR" value="<?=$READ_ONLY_STR?>">
<input type="hidden"  name="TOP_FLAG_OLD" value="<?=$TOP_FLAG?>">
<input type="hidden"  name="BACK_CONTENT" id="BACK_CONTENT">
<input type="hidden"  name="FLOW_PRCS_LAST" id="FLOW_PRCS_LAST">
<input type="hidden"  name="PRCS_KEY_ID" value="<?=$PRCS_KEY_ID?>">
<input type="hidden"  name="work_level" value="<?=$work_level?>">
<script>
jQuery.noConflict();
var SignLoadFlag = false;
var upload_limit=oa_upload_limit=<?=MYOA_UPLOAD_LIMIT?>,limit_type=oa_limit_type="<?=strtolower(MYOA_UPLOAD_LIMIT_TYPE)?>";
var sign_info_object="";
//����ȫ�ֱ���
var g_run_id = "<?=$RUN_ID?>";       //��ˮ��
var g_flow_id = "<?=$FLOW_ID?>";     //����ID
var g_prcs_id = "<?=$PRCS_ID?>";     //ʵ�����̲������
var g_flow_prcs = "<?=$FLOW_PRCS?>"; //������Ʋ����
var g_r_item = "<?=$PRCS_ITEM?>";    //��д�ֶ�
var g_form_view = 1;                 //�����
var g_login_user_priv 		= "<?=$_SESSION["LOGIN_USER_PRIV"]?>"; 		//��¼�û���ɫID
var g_login_user_priv_name	= "<?=$USER_PRIV_NAME?>";	//��¼�û���ɫ��
var g_login_user_id	= "<?=$_SESSION["LOGIN_USER_ID"]?>";	//��¼�û�ID
var g_login_user_name	= "<?=$_SESSION["LOGIN_USER_NAME"]?>";	//��¼�û���

function ShowBackDialog(id,vTopOffset)
{
   if(typeof arguments[1] == "undefined")
     vTopOffset = 90;
     
   var bb=(document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;
   $("overlay").style.width = Math.max(parseInt(bb.scrollWidth),parseInt(bb.offsetWidth))+"px";
   $("overlay").style.height = Math.max(parseInt(bb.scrollHeight),parseInt(bb.offsetHeight))+"px";;
   $("overlay").style.display = 'block';  
   $(id).style.display = 'block';	 
   $(id).style.left = ((bb.offsetWidth - $(id).offsetWidth)/2)+"px";
   if(document.body.clientHeight > (document.getElementById("sel_prcs").offsetHeight + vTopOffset)){
   	$(id).style.top  = ((document.body.clientHeight -document.getElementById("sel_prcs").offsetHeight)/2 - 15)+"px";
   }else{
   	$(id).style.top = "0px";
   }
   
}

//�����ϴ�
function upload_init() {

	var linkColor = document.linkColor;
   for(var i=0; i< document.styleSheets.length; i++)
   {
      var stylesheet = document.styleSheets[i];
      var rules=stylesheet.rules ? stylesheet.rules : stylesheet.cssRules;
      if(!rules) return;

      for(var j=0;j<rules.length;j++)
      {
      	if(rules[j].selectorText.toLowerCase()=="a:link")
      	{
      		linkColor = rules[j].style.color;
      		break;
      	}
      }

      if(linkColor != document.linkColor)
         break;
   }

	var settings = {
		flash_url : "<?=MYOA_JS_SERVER?>/module/swfupload/swfupload.swf",
		upload_url: "upload_attach_batch.php?RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>",
		post_params: {"PIC_ID": "<?=$PIC_ID?>","SUB_DIR":"<?=urlencode($SUB_DIR)?>","PHPSESSID": "<?=session_id();?>"},
		file_size_limit : "<?=intval(ini_get('upload_max_filesize'))?> MB",
		file_types : "<?=MYOA_UPLOAD_LIMIT!=2 ? "*.*" : "*.".str_replace(",",";*.",trim(trim(MYOA_UPLOAD_LIMIT_TYPE),","))?>",
		file_types_description : "<?=MYOA_UPLOAD_LIMIT!=2 ? _("����") : trim(trim(MYOA_UPLOAD_LIMIT_TYPE),",")?> <?=_("�ļ�")?>",
		file_upload_limit : 0,
		file_queue_limit : 0,
		custom_settings : {
			uploadArea : "fsUploadArea",
			progressTarget : "fsUploadProgress",
			startButtonId : "btnStart",
			cancelButtonId : "btnCancel"
		},
		debug: false,

		// Button Settings
		button_image_url : "<?=MYOA_STATIC_SERVER?>/images/uploadx4.gif",	// Relative to the SWF file
		button_text : "<span class=\"textUpload\"><?=_("�����ϴ�")?></span>",
		button_text_style : ".textUpload{color:"+linkColor+";}",
		button_text_top_padding : 1,
		button_text_left_padding : 18,
		button_placeholder_id : "spanButtonUpload",
		button_width: 70,
		button_height: 18,
		button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
		button_cursor: SWFUpload.CURSOR.HAND,

		// The event handler functions are defined in handlers.js
		file_queued_handler : fileQueued,
		file_queue_error_handler : fileQueueError,
		file_dialog_complete_handler : fileDialogComplete,
		upload_start_handler : uploadStart,
		upload_progress_handler : uploadProgress,
		upload_error_handler : uploadError,
		upload_success_handler : uploadSuccess,
		upload_complete_handler : uploadComplete,
		queue_complete_handler : queueComplete	// Queue plugin event
	};

	swfupload = new SWFUpload(settings);
}


//�û��Զ���js�ű�
<?=$SCRIPT?>

jQuery(document).ready(myload);




function checkCloseTab()
{
		<? if($AUTO_NEW): ?>
		   return cancel_run_jobx('0');
		<? else:?>
	     return cancel_run_jobx2('0');//�����й�����
    <? endif; ?>
}


function check_usb_key()
{
    var theDevice=document.getElementById("tdPass");
    if(!theDevice)
    {
        alert("<?=_("���Ȱ�װ�ؼ���")?>");
        ShowDialog("check_key");
        return (false);
    }
    
    var check_val=CHECK_USER("<?=$KEY_SN?>",theDevice);
    var msg;
    if(check_val<0)
    {
        msg="<?=_("û�м�⵽�û�Key��")?>\n\n<?=_("������û�Key�����ȷ�����½��м�⡣")?>";
        if(window.confirm(msg))
           check_usb_key();
        else
        {
        	 ShowDialog("check_key");
        	 return (false);
        }
    }
    else if(check_val==0)
    {
        msg="<?=_("�û�Key����ȷ��")?>\n\n<?=_("�������ȷ���û�Key�����ȷ�����½��м�⡣")?>";
        if(window.confirm(msg))
           check_usb_key();
        else
        {
        	 ShowDialog("check_key");
        	 return (false);
        }
    }
    else
    {
        HideDialog("check_key");
        return (true);
    }
}

function CheckForm(flag)
{
	if(document.getElementById("btnStart") != null && document.getElementById("btnStart").disabled == false)
	{
		alert("<?=_("���и�����δ�ϴ������ϴ����ύ��")?>");
		parent.unlockButton();
		return;
	}
    if(typeof SignLoadFlag == "undefined" || SignLoadFlag == false)
	{
	    alert("<?=_("����δ������ϣ���ȴ����ύ��")?>");
	    parent.unlockButton();
	    return;
	}
	
	//����������֤
	if(!form_validate()){
		parent.unlockButton();
	    return false;
	}
	    
	//����ִ�м���
	jQuery(".CALC").each(function(){
		var funcName = eval("calc_"+jQuery(this).attr("name"));
		if(jQuery.isFunction(funcName)){
			funcName.call();
		}
	});
    //document.form1.SAVE_FLAG.value=flag;
    
    //���������̶�
    var work_level = parent.document.getElementById('work_level') ? parent.document.getElementById('work_level').value : 0;
    jQuery("input[name='work_level']").val(work_level);
    
    jQuery("input[name='SAVE_FLAG']").val(flag);
    LV_Submit();
<?
//--- ��������� ---
if($DISP_AIP)
{
?>
    if(is_ie)
    {
        //aip_upload();
    }
<?
} 
if(!$EDIT_MODE&&$FEEDBACK!=1)
{
?>
    if(is_ie)
    {
        sign_submit();
    }
<?
}
?>
    if(is_ie)
    {
        WebSign_Submit();
    }
    
    mouse_is_out=false;

    document.form1.submit();
}
function new_attach()
{
    if(document.form1.NEW_TYPE.value=="")
    { 
        alert("<?=_("��ѡ���ļ����ͣ�")?>");
        return (false);
    }
    if(document.form1.NEW_NAME.value=="")
    { 
        alert("<?=_("����������Ϊ�գ�")?>");
        return (false);
    }
    CheckForm('S');
    return false;
}
function delete_attach(ATTACHMENT_ID,ATTACHMENT_NAME)
{
    var msg = sprintf("<?=_("ȷ��Ҫɾ���ļ� '%s' �� '%s' ɾ��ǰ�����ȱ������")?>", ATTACHMENT_NAME,"��\n");
    if(window.confirm(msg))
    {
    	mouse_is_out=false;
        URL="delete_public_attach.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&EDIT_MODE=<?=$EDIT_MODE?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&ATTACHMENT_ID="+ATTACHMENT_ID+"&ATTACHMENT_NAME="+URLSpecialChars(ATTACHMENT_NAME)+"&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>";
        window.location=URL;
    }
}

function delete_attach_sign(FEED_ID,ATTACHMENT_ID,ATTACHMENT_NAME)
{
    
    var msg = sprintf("<?=_("ȷ��Ҫɾ���ļ� '%s' �� '%s' ɾ��ǰ�����ȱ������")?>", ATTACHMENT_NAME,"��\n");
    if(window.confirm(msg))
    {
    	mouse_is_out=false;
        URL="delete_personal_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME="+URLSpecialChars(ATTACHMENT_NAME)+"&ATTACHMENT_ID="+ATTACHMENT_ID+"&FEED_ID="+FEED_ID;
        window.location=URL;
    }
}

function delete_attach_data(DATA_ID,ATTACHMENT_ID,ATTACHMENT_NAME)
{
    var msg = sprintf("<?=_("ȷ��Ҫɾ���ļ� '%s' �� '%s' ɾ��ǰ�����ȱ������")?>", ATTACHMENT_NAME,"��\n");
    if(window.confirm(msg))
    {
        mouse_is_out=false;
        URL="delete_data_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME="+URLSpecialChars(ATTACHMENT_NAME)+"&ATTACHMENT_ID="+ATTACHMENT_ID+"&DATA_ID="+DATA_ID;
        window.location=URL;
    }
}

function go_sign()
{
    return;
}

//ɾ����ǩ
function delete_sign(FEED_ID)
{
    var msg="<?=_("ȷ��Ҫɾ���û�ǩ�����")?>\n<?=_("ɾ��ǰ�����ȱ������")?>";
    if(window.confirm(msg))
    {
    	mouse_is_out=false;
        var URL="delete_personal.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FEED_ID="+FEED_ID;
        window.location=URL;
    }
}

//�༭��ǩ
function edit_sign(FEED_ID)
{
    CheckForm(1);
    loc_x=(screen.availWidth-600)/2;
    loc_y=event.clientY;
    window.open("personal_edit.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FLOW_DOC=<?=$FLOW_DOC?>&FEED_ID="+FEED_ID,"FEED_EDIT","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=550,height=300,left="+loc_x+",top="+loc_y);
}

//�ظ���ǩ
function reply_sign(FEED_ID)
{
    CheckForm(1);
    loc_x=(screen.availWidth-600)/2;
    loc_y=event.clientY;
    window.open("personal_reply.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FLOW_DOC=<?=$FLOW_DOC?>&FEED_ID="+FEED_ID,"FEED_EDIT","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=550,height=300,left="+loc_x+",top="+loc_y);
}


function myload()
{	
    <?=$JS_ONLOAD?>
    window.onresize=setBody;
    setBody();
    LoadSignData();
    parent.unlockButton();
<?

    if($LOGIN_KEY && $USEING_KEY)
        echo 'check_usb_key();';

    if($DISP_AIP)
        echo 'disp_form("4");';
    
    
    if($SAVE_FLAG==1)
    {
        echo 'show_msg("notice","'._("���ѳɹ�����").'",3);'; //������
    }
    elseif($SAVE_FLAG=='N')
    {
        echo 'show_msg("notice","'._("�ĺ��ѳɹ��޸�").'",3);'; //�����ĺű��
    }
    else 
    {
        if($FOCUS_USER!="")
            echo 'show_msg("focus","",3);';
        if($TIME_OUT!="" && $TIME_USED>$TIME_OUT*3600)
            echo 'delay_remind(3);';
    }
?>

    if(window.top.bTabStyle) 
    { 
        var tabId = 'tabs_' + window.top.jQuery.fn.getSelected() + '_iframe';
        window.top.document.getElementById(tabId).contentWindow.onclose = function(){ 	
            //return checkCloseTab();
            return true;
        } 
    } 
    else 
    { 
    	 // window.onbeforeunload = function(){return checkClose();}; 
    }
}

function finish_run()
{
<?
if($FEEDBACK==2 && !$FEEDBACK_SIGNED)//�����˲���ǿ�ƻ�ǩ����
{
?>
    if(getEditorText('CONTENT') == "")
    {
        alert("<?=_("������Ϊǿ�ƻ�ǩ������д��ǩ���")?>");
        go_sign();
        parent.unlockButton();
        return;
    }
<?
}
?>
    var msg="<?=_("ȷ�ϸù����Ѿ����������")?>";
    if(window.confirm(msg))
    {
        CheckForm(5);
    }else{
    	parent.unlockButton();
    }
}

function stop_run()
{
    var msg="<?=_("������Ϊ�������̣�������ʱ������ȷ��Ҫ�����ù���������")?>";
    if(window.confirm(msg))
    {
        CheckForm("7");   //��־λ5Ϊ�������� add by lx 20090728
    }
}


function goBack()
{
<?
if($GATHER_NODE==1)
{
    $PRE_PRCS_ID = $PRCS_ID-1;
	//�����ϲ��㷨���ݹ���FLOW_RUN_PRCS����Ѱ�Ҿ���һ�������ڵ�·����δ�ܵ������в�������ڵ� ���ܽ���ת��
	$query = "select PRCS_ID FROM BPM_PROCESS WHERE FLOW_ID='$FLOW_ID' AND FIND_IN_SET('$FLOW_PRCS',PRCS_TO)";
	$cursor= exequery(TD::conn(),$query);
    while($ROW=mysql_fetch_array($cursor))
    {
   	    $query1 = "select PRCS_FLAG from BPM_RUN_PRCS WHERE RUN_ID='$RUN_ID' AND FLOW_PRCS='$ROW[PRCS_ID]' and OP_FLAG=1";
   	    $cursor1= exequery(TD::conn(),$query1,$connstatus);
   	    if($ROW1=mysql_fetch_array($cursor1))
	    {
	        $PRCS_FLAG1=$ROW1["PRCS_FLAG"];
	        if($PRCS_FLAG1<=2)
		        $CANNOT_TURN=true;
   	    }
	    else
	        $CANNOT_TURN=false;
        
        if(!find_id($PARENT_STR,$ROW["PRCS_ID"]) && $CANNOT_TURN)
        {
            echo 'alert("'._("�˲���Ϊǿ�ƺϲ��ڵ㣬���в���δת�����˲��裬�������˻أ�").'");';
            echo 'return;';
            break;
        }
   }//end while
}//end if
?>
    ShowBackDialog("sel_prcs");
}
function doAction(obj)
{
	switch (obj.value)
	{
		case "0" : show_msg("focus","",<?if($FOCUS_USER=="") echo 2;else echo 5?>);break;
		case "1" : focus_run(<?=$RUN_ID?>);break;
		case "2" : form_view("<?=$PARENT_RUN?>","<?=$PARENT_FLOW_ID?>")
		default : break;
	}
	obj.selectedIndex=obj.options.length-1;
}

function clear_check()
{
	mouse_is_out=false;
}

function edit_run_name()
{
	CheckForm("N");
}

function select_run_name()
{
    var loc_x=(screen.availWidth-300)/2;
    var loc_y=event.clientY-100;
    window.open("select_run_name.php?FLOW_ID=<?=$FLOW_ID?>&RUN_ID=<?=$RUN_ID?>","select_run_name","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=300,height=400,left="+loc_x+",top="+loc_y);
}

function clear_run_name()
{
    RUN_NAME.value="";
}

function setBody()
{  
	/*
  //  fix height for ipad by JinXin @ 201314
  	var tophight = 0;//jQuery('#form_body').offset().top;
    if(navigator.userAgent.match(/ipad/ig)){   		
        jQuery('#form_body').hide();
        //var height = jQuery(window).height() - jQuery('#form_body').offset().top - jQuery('#form_control').outerHeight() - 28;
        var height = jQuery(window).height() - tophight - jQuery('#form_control').outerHeight() - 28;
        jQuery('#form_body').height(height).show();
    }else{
    		jQuery('#form_body').hide();
        var height = jQuery(window).height() - tophight - jQuery('#form_control').outerHeight();
        jQuery('#form_body').height(height).show();;
    }
    var width = jQuery(window).width() - jQuery('#form_body').offset().left*2;
    jQuery('#form_body').width(width);
    jQuery('#form_control').width(width);
    jQuery(document.body).scrollTop(0);
    */
}

function disp_form(id)
{       
    var cur_tab = "tab_"+id;
    jQuery(".navTab li").each(function(){
        var tab = jQuery(this);
        if(tab.attr("id") == cur_tab)
        {
            tab.addClass("navTab_On");
        }
        else
        {
            tab.removeClass("navTab_On");
            if(tab.attr("id") > cur_tab)
                tab.removeClass("left").addClass("right");
            else
                tab.removeClass("right").addClass("left");
        }
    });
    
    var cur_body = "body"+id;
    jQuery("div[id^='body']").each(function(){
        var body = jQuery(this);
        if(body.attr("id") == cur_body)
            body.slideDown();
        else
        {
        	body.hide();
        }
    });
    if(id==1)
    {
        jQuery("#body2,#body3").show();
    }
    setBody();
}

function set_view(flag)
{
    switch(flag)
    {
   	    case "0":
          form_view("<?=$RUN_ID?>","<?=$FLOW_ID?>","<?=$PRCS_ID?>");
          break;
        case "1":
          flow_view("<?=$RUN_ID?>","<?=$FLOW_ID?>");
          break;
        case "2":
          view_graph("<?=$FLOW_ID?>");
          break;
        case "3":
   	      show_msg("focus","","<?if($FOCUS_USER=="") echo 2;else echo 5?>");
          break;
        case "4":
   	      focus_run('<?=$RUN_ID?>');
          break;
        case "5":
          AddFav('<?=str_replace(array("\\","'","\r","\n"),array("\\\\","\'","",""),$RUN_NAME);?>','/general/approve_center/list/print/?RUN_ID=<?=$RUN_ID?>',1);
          break;
        case "6":
          AddUserShow();
          break;
    } 
    hideMenu();
}

function AddUserShow()
{
    ClearUser('TO_ID', 'TO_NAME');
    $("add_msg").innerHTML="";
    ShowDialog("add_user");
}
function add_user()
{
	var to_id = document.form1.TO_ID.value;
	if(to_id=="")
	{
		alert("<?=_("��ѡ�񾭰���Ա��")?>");
		return;
	}
	else
	{
	    jQuery.get("../flow_view/add_user.php?FLOW_ID=<?=$FLOW_ID?>&RUN_ID=<?=$RUN_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>",{"TO_ID":to_id},function(data){
	  	    if(data==0)
	  	        jQuery("#add_msg").html("<?=_("��û�д�Ȩ�ޣ�")?>");
	  	    else if(data==1)
	  		    jQuery("#add_msg").html("<?=_("���û��Ѿ�Ϊ�����辭���ˣ�")?>");
	        else if(data==2)
	        {
	    	    jQuery("#add_msg").html("<?=_("�����ѳɹ�")?>");
	    	    ClearUser('TO_ID', 'TO_NAME');   	
	        }	
	  	});
	 }
}
function addSeal(item,seal_id)
{
    var auth_websign = window.auth_websign;
    if(auth_websign == false)
    {
        alert('<?=_("ǩ����Ȩʧ�ܣ�����ϵOA���̽�����ѯ��")?>');
    }
    try {
	    if(DWebSignSeal.FindSeal(item+"_seal",2)!="")
	    {
	    	alert("<?=_("���Ѿ�ǩ�£�����ɾ������ǩ�£�")?>");
	    	return;
	    }
	    var str=SetStore(item);
	    DWebSignSeal.SetPosition(0,0,"SIGN_POS_"+item);
<?
if($SEAL_FROM["SEAL_FROM"]==1)
    echo 'DWebSignSeal.addSeal("", item+"_seal");';
else
{
?>
        if(typeof seal_id=="undefined")
          show_seal(item,"addSeal");
        else
        {
        	var URL = "<?=(isset($_SERVER['HTTPS'])&&$_SERVER['HTTPS']=='on')?'https':'http'?>://<?=$_SERVER['HTTP_HOST']?>/module/sel_seal/get.php?ID="+seal_id;
        	DWebSignSeal.AddSeal(URL, item+"_seal");
        }
<?
}
?>
        DWebSignSeal.SetSealSignData(item+"_seal",str);
	    DWebSignSeal.SetMenuItem(item+"_seal",261);
    }catch(e){}
}

function handWrite(item)
{
    var auth_websign = window.auth_websign;
    if(auth_websign == false)
    {
        alert('<?=_("ǩ����Ȩʧ�ܣ�����ϵOA���̽�����ѯ��")?>');
    }
	var DWebSignSeal=document.getElementById("DWebSignSeal") || '';
	var auth_websign_code = window.auth_websign_code;
	if(auth_websign_code != '' && DWebSignSeal != '' && typeof(DWebSignSeal.SetSealComment) != 'undefined')
	{
		DWebSignSeal.SetSealComment("SET_ABOUT_TIPS", 0, 0, auth_websign_code);
	}
    try {
	    if(DWebSignSeal.FindSeal(item+"_hw",2)!="")
	    {
	    	alert("<?=_("���Ѿ�ǩ�£�����ɾ������ǩ�£�")?>");
	    	return;
	    }
	    var str=SetStore(item);
	    DWebSignSeal.SetPosition(0,0,"SIGN_POS_"+item);
	    DWebSignSeal.HandWrite(0,-1,item+"_hw");
        
        DWebSignSeal.SetSealSignData(item+"_hw",str);
	    DWebSignSeal.SetMenuItem(item+"_hw",261);
	}catch(e){}
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

function GetDataStr(item)
{
	if(typeof item == 'undefined')
	   return; 
	var str="";
	var separator = "::";  // �ָ���
	eval("var TO_VAL=sign_check."+item+";");

	if(TO_VAL)
	{
		var item_array = TO_VAL.split(",");
  	    for (i=0; i < item_array.length; i++)
  	    {
  		    var MyValue="";
  		    var obj = eval("document.form1."+item_array[i]);
  		    if(obj.type=="checkbox")
  		    {
  			    if(obj.checked==true)
  			       MyValue="on";
  			    else
  			    	 MyValue="";
  		    }
  		    else
  		        MyValue=obj.value;
  		    str += obj.name + "separator" + MyValue + "\n";
  	    }
    }
    return str;
}
</script>