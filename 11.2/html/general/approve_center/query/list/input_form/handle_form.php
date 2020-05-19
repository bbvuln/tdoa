<?php
include_once("inc/auth.inc.php");
include_once("inc/utility_flow.php");
include_once("inc/utility_file.php");
include_once("inc/utility_calendar.php");
// include_once("form.inc.php");

$EDIT_MODE	= 1;
$FLOW_ID = $flow_id;
$RUN_ID = $run_id;
$actionType = "handle";
$FLOW_INFO = \engine\TFlowEngine::getFlowInfo($FLOW_ID);
$FLOW_DOC = $FLOW_INFO["FLOW_DOC"];
$FLOW_TYPE = $FLOW_INFO["FLOW_TYPE"];

$SEAL_FROM = get_sys_para("BPM_SEAL_FROM");

$USER_PRIV_NAME = rtrim(GetPrivNameById($_SESSION["LOGIN_USER_PRIV"]), ",");
$role_str = \engine\TFlowEngine::getWorkRunPrivStr($RUN_ID, $FLOW_PRCS, $PRCS_ID, null, $archive_time);
$condition = "";
if(find_id($role_str, 1) || find_id($role_str, 3) || find_id($role_str, 5) || find_id($role_str, 9) || find_id($role_str, 10) || find_id($role_str, 11))
{
    //系统管理员、查询、管理、监控、点评、编辑权限人可以查看所有手写呈批单
    $condition = " OR 1=1 ";
}
else if(find_id($role_str, 8))
{
    //兼容传阅人能够模仿最后一步的主办人或模仿最后一步的无主办会签经办人查看表单信息
    $temp_count = 0;
    $condition_op1 = '';
    $condition_op0 = '';
    $temp_sql = "SELECT *  FROM bpm_run_prcs WHERE RUN_ID='$RUN_ID' AND PRCS_ID=(select max(PRCS_ID) as MAX_PRCS_ID from bpm_run_prcs where RUN_ID='$RUN_ID') ORDER BY PRCS_ID DESC, DELIVER_TIME DESC";
    $temp_cursor = exequery(TD::conn(), $temp_sql);
    while($temp_row = mysql_fetch_assoc($temp_cursor))
    {
        if($temp_count === 0)
        {
            $temp_prcs_id = $temp_row['PRCS_ID'];
        }
        if($temp_prcs_id != $temp_row['PRCS_ID'])
        {
            break;
        }
        if($temp_row['OP_FLAG'] == '1')
        {
            $condition_op1 = " OR ID='".$temp_row['ID']."' ";
            break;
        }
        if($temp_row['OP_FLAG'] == '0' && $temp_count === 0)
        {
            $condition_op0 = " OR ID='".$temp_row['ID']."' ";
        }
        $temp_count++;
    }
    $condition = $condition_op1 != '' ? $condition_op1 : $condition_op0;
}
$table_flow_run_prcs = $use_databases."bpm_run_prcs".$archive_time;
$query =  "select id from ".$table_flow_run_prcs." where run_id = '".$RUN_ID."'
                   AND (user_id = '".$_SESSION["LOGIN_USER_ID"]."'
                   or FIND_IN_SET('".$_SESSION["LOGIN_USER_ID"]."',OTHER_USER) ".$condition.")";
$cursor = exequery(TD::conn(), $query);
$id_str = '0';
while($row = mysql_fetch_array($cursor)){
    $id_str .= ','.$row['id'];
}
$query =  "select id, prcs_id,flow_prcs,child_run,parent,parent_prcs_id from ".$table_flow_run_prcs." where id in (".$id_str.") ORDER BY flow_prcs";
$cursor = exequery(TD::conn(), $query);
$first_flag = false;
while($row = mysql_fetch_array($cursor))
{
    if($first_flag || empty($FLOW_PRCS)){
        $PRCS_ID = $row['prcs_id'];
        $FLOW_PRCS = $row['flow_prcs'];
		$PRCS_KEY_ID = $row['id'];
        $CHILD_RUN = $row['child_run'];
        $PARENT = $row['parent'];
        $PARENT_PRCS_ID = $row['parent_prcs_id'];
        $first_flag = true;
    }elseif($row['flow_prcs'] == $FLOW_PRCS){
        $PRCS_ID = $row['prcs_id'];
        $FLOW_PRCS = $row['flow_prcs'];
        $CHILD_RUN = $row['child_run'];
		$PRCS_KEY_ID = $row['id'];
        $PARENT = $row['parent'];
        $PARENT_PRCS_ID = $row['parent_prcs_id'];
        continue;
    }
}
/***START OF 取文号,附件信息**/
//----- 取文号,附件信息 --------
$WORK_RUN_INFO = \engine\TFlowEngine::getWorkRunInfo($RUN_ID);
if(is_array($WORK_RUN_INFO) && !empty($WORK_RUN_INFO))
{
	$RUN_NAME = $WORK_RUN_INFO["RUN_NAME"];
	$ATTACHMENT_ID = $WORK_RUN_INFO["ATTACHMENT_ID"];
	$ATTACHMENT_NAME = $WORK_RUN_INFO["ATTACHMENT_NAME"];
	$FOCUS_USER = $WORK_RUN_INFO["FOCUS_USER"];
	$BEGIN_USER = $WORK_RUN_INFO["BEGIN_USER"];
	$BEGIN_USER_NAME = rtrim(GetUserNameById($BEGIN_USER), ",");
	$BEGIN_TIME = $WORK_RUN_INFO["BEGIN_TIME"];
	$WORK_LEVEL = $WORK_RUN_INFO["WORK_LEVEL"];
}

/***START OF 检测是系统UKEY开关及用户的UKEY信息**/
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
/***END OF 检测是系统UKEY开关及用户的UKEY信息**/

/***START OF 办理工作 的状态 下获取流程步骤的办理信息**/
$OP_FLAG=1;
/***END OF 办理工作 的状态 下获取流程步骤的办理信息*/
?>
<style>
.color1 {color:#FFBC18;}
.color2 {color:#50C625;}
.color3 {color:#F4A8BD;}
.color4 {color:#FF0000;}
</style>
<?php
//判断可写字段和只读字段
$writable_fields = '_ALL_FIELDS_WRITABLE_';
$secret_fields = '';
$required_fields = '';


// include_once("inc/workflow/tform/twork_handle.class.php");
// $obj_work_handle = new TWorkHandle($FLOW_ID, $RUN_ID, $PRCS_ID, $FLOW_PRCS, $PRCS_KEY_ID, array('secret_fields' => $secret_fields, 'writable_fields' => $writable_fields, 'type'=>'edit'));
// $PRINT_MODEL = $obj_work_handle->get_form_html();
$runInfo = \engine\TFlowEngine::getVersionIdByRunId($run_id);
if($runInfo['VERSION_LOG'] == 1)
{
    if( !isset($PRCS_ID) ||  empty($PRCS_ID)  )
    {
        $sql =  "select max(prcs_id) as prcsId from bpm_run_prcs where run_id = $run_id";
        $cursor = exequery(TD::conn(), $sql);
        if($row = mysql_fetch_array($cursor))
        {
            $PRCS_ID = $row['prcsId'];
        }
    }
    $formVersionId = \engine\TFlowEngine::getVersionIdByBpmRunPrcs($RUN_ID,$PRCS_ID);
    $config['form_version_id'] = $formVersionId;
}
$config['type_mode'] = "edit";
include_once("inc/flow_engine2.0/inc/tform/TWorkHandle.class.php");
$obj_work_handle = new tform\handle\TWorkHandle($flow_id, $run_id,intval($FLOW_PRCS),intval($PRCS_ID),intval($PARENT_PRCS_ID),$config);
$PRINT_MODEL = $obj_work_handle->getFormHtml($writable_fields, $secret_fields, $required_fields);
// $READ_ONLY_STR = $obj_work_handle->get_readonly_item_ids();
// $HIDDEN_STR = $obj_work_handle->get_secret_item_ids();
// $SIGN_OBJECT = $obj_work_handle->get_sign_item_ids();
$SIGN_OBJECT = $obj_work_handle->getSignItemIds();
/***END OF 将表单中的宏标记信息替换成所需要的信息*/

if($LOGIN_KEY && $USEING_KEY)
{
?>
  <object id="tdPass" name="tdPass" CLASSID="clsid:0272DA76-96FB-449E-8298-178876E0EA89"	CODEBASE="/inc/tdPass_<?=(stristr($_SERVER['HTTP_USER_AGENT'], 'x64') ? 'x64' : 'x86')?>.cab#version=1,2,12,1023" BORDER="0" VSPACE="0" HSPACE="0" ALIGN="TOP" HEIGHT="0" WIDTH="0"></object>
<?
}
?>
<input type="hidden"  name="SAVE_FLAG" value="1">
<input type="hidden"  name="FLOW_TYPE" value="<?=$FLOW_TYPE?>">
<input type="hidden"  name="EDIT_MODE" value="<?=$EDIT_MODE?>">
<input type="hidden"  name="RUN_ID" value="<?=$RUN_ID?>">
<input type="hidden"  name="RUN_NAME" value="<?=$RUN_NAME?>">
<input type="hidden"  name="FLOW_ID" value="<?=$FLOW_ID?>">
<input type="hidden"  name="PRCS_ID" value="">
<input type="hidden"  name="FLOW_PRCS" value="">
<input type="hidden"  name="ITEM_ID_MAX" value="">
<input type="hidden"  name="MENU_FLAG" value="<?=$MENU_FLAG?>">
<input type="hidden"  name="HIDDEN_STR" value="">
<input type="hidden"  name="READ_ONLY_STR" value="">
<input type="hidden"  name="TOP_FLAG_OLD" value="">
<input type="hidden"  name="BACK_CONTENT" id="BACK_CONTENT">
<input type="hidden"  name="FLOW_PRCS_LAST" id="FLOW_PRCS_LAST">
<input type="hidden"  name="PRCS_KEY_ID" value="">
<input type="hidden"  name="WORK_LEVEL" value="<?=$WORK_LEVEL?>">
<input type="hidden"  name="WORK_LEVEL_OLD" value="<?=$WORK_LEVEL?>">
<script src="<?=MYOA_JS_SERVER?>/static/js/seajs/2.1.1/sea.js"></script>
<script language="javascript" src="<?= MYOA_JS_SERVER ?>/static/js/jquery-1.10.2/template/jquery.tmpl.min.js"></script>
<script>
seajs.config({
   base: '/static/js/',
   alias: {
       "jquery": "/static/js/jquery-1.10.2/jquery.min.js",
       "bootstrap": "/static/js/bootstrap/js/bootstrap.min.js",
       "base": "/static/js/arale/base/1.1.1/base",
       "TFieldLoader": "/inc/flow_engine2.0/inc/tform/combo.php?loader.js",
       "TFieldManager": "/static/modules/approve_center/tform/tfieldmanager.class.js",
	   	"TComplex": "/static/modules/approve_center/tform/tcomplex.class.js",
		"ComplexFieldLoder": "/static/modules/approve_center/tform/complex/fieldloader.js",
		"CTextField": "/static/modules/approve_center/tform/complex/text.js",
		"CTextAreaField": "/static/modules/approve_center/tform/complex/textarea.js",
		"CDateField": "/static/modules/approve_center/tform/complex/date.js",
   }
});
jQuery.noConflict();
var SignLoadFlag = false;
var upload_limit=oa_upload_limit=<?=MYOA_UPLOAD_LIMIT?>,limit_type=oa_limit_type="<?=strtolower(MYOA_UPLOAD_LIMIT_TYPE)?>";
var sign_info_object="";
//定义全局变量
var g_run_id = "<?=$RUN_ID?>";       //流水号
var g_flow_id = "<?=$FLOW_ID?>";     //流程ID
var g_prcs_id = "<?=$PRCS_ID?>";     //实际流程步骤序号
var g_flow_prcs = "<?=$FLOW_PRCS?>"; //流程设计步骤号
var g_r_item = "<?=$PRCS_ITEM?>";    //可写字段
var g_form_view = 1;                 //办理表单
var g_login_user_priv 		= "<?=$_SESSION["LOGIN_USER_PRIV"]?>"; 		//登录用户角色ID
var g_login_user_priv_name	= "<?=$USER_PRIV_NAME?>";	//登录用户角色名
var g_login_user_id	= "<?=$_SESSION["LOGIN_USER_ID"]?>";	//登录用户ID
var g_login_user_name	= "<?=$_SESSION["LOGIN_USER_NAME"]?>";	//登录用户名
var http_user_agent	= "<?=$_SERVER["HTTP_USER_AGENT"]?>";	//浏览器类型

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

//批量上传
function upload_init() {

	var linkColor = document.linkColor;
   for(var i=0; i< document.styleSheets.length; i++)
   {
      var stylesheet = document.styleSheets[i];
      var rules=stylesheet.rules ? stylesheet.rules : stylesheet.cssRules;
      if(!rules) return;

      for(var j=0;j<rules.length;j++)
      {
        if(rules[j].selectorText) {
            if(rules[j].selectorText.toLowerCase()=="a:link")
            {
                linkColor = rules[j].style.color;
                break;
            }
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
		file_types_description : "<?=MYOA_UPLOAD_LIMIT!=2 ? _("所有") : trim(trim(MYOA_UPLOAD_LIMIT_TYPE),",")?> <?=_("文件")?>",
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
		button_text : "<span class=\"textUpload\"><?=_("批量上传")?></span>",
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
		//upload_complete_handler : uploadComplete,
		queue_complete_handler : queueCompleteEventHandler	// Queue plugin event
	};


	swfupload = new SWFUpload(settings);
}

function queueCompleteEventHandler(){
	jQuery('#btnCancel').attr('disabled', true);
}

jQuery(document).ready(function($){
    //加载表单控件初始化和事件处理代码
    seajs.use("TFieldManager", function(exports){
       var TFieldManager = exports.TFieldManager;
       fieldManager = new TFieldManager({
           runId: '<?=$RUN_ID?>',
           flowId: '<?=$FLOW_ID?>',
           wrapper: '#content-main',
           dblclickHandle: <?= $DEBUG_MODE ? '$.noop' : $EDIT_MODE ? 'version_load' : 'quick_load' ?>
       }, fields_event_config);
   });
    myload();
	if('<?=$_GET['next']?>' == 'true'){
		window.parent.loadWorkHandleNext();
		window.parent.closeSaveDiv();
		window.parent.open_bootcss_modal('myModal', "960", "5");
	}
    if (jQuery("div[id^='main_tab_']").length > 0)
    {
        jQuery("div[id^='main_tab_']").tabs();
    }
    if (jQuery("#detail_tabs").length > 0)
    {
        jQuery("#detail_tabs").tabs();
    }
    jQuery('#bpm_iframe_url_container').iframeSizer();
});

function checkClose()
{
    if(mouse_is_out)
    {
        return "<?=_("确定离开此页面吗？建议您先保存表单")?>";
    }
}
function checkCloseTab()
{
    <? if($AUTO_NEW): ?>
       return cancel_run_jobx('0');
    <? else:?>
	     return cancel_run_jobx2('0');//办理中工作；
    <? endif; ?>
}


function check_usb_key()
{
	var iframe_location = parent.location.href;
	if(window.external && typeof window.external.OA_SMS != 'undefined' && http_user_agent.indexOf('MSIE') == -1)
	{
		window.external.OA_SMS('1',iframe_location,'IS_WEBKIT');
		return;
	}
    var theDevice=document.getElementById("tdPass");
    if(!theDevice)
    {
        alert("<?=_("请先安装控件！")?>");
        parent.showusbdiv();
        return (false);
    }

    var check_val=CHECK_USER("<?=$KEY_SN?>",theDevice);
    var msg;
    if(check_val<0)
    {
        msg="<?=_("没有检测到用户Key！")?>\n\n<?=_("请插入用户Key，点击确定重新进行检测。")?>";
        if(window.confirm(msg))
           check_usb_key();
        else
        {
        	parent.showusbdiv();
        	 return (false);
        }
    }
    else if(check_val==0)
    {
        msg="<?=_("用户Key不正确！")?>\n\n<?=_("请插入正确的用户Key，点击确定重新进行检测。")?>";
        if(window.confirm(msg))
           check_usb_key();
        else
        {
        	parent.showusbdiv();
        	 return (false);
        }
    }
    else
    {
        parent.closeusbdiv();
        return (true);
    }
}

function CheckForm(flag)
{
	if(document.getElementById("btnStart") != null && document.getElementById("btnStart").disabled == false)
	{
		alert("<?=_("您有附件尚未上传，请上传后提交！")?>");
		parent.unlockButton();
		parent.clearTimer();
		return;
	}
    if(typeof SignLoadFlag == "undefined" || SignLoadFlag == false)
	{
	    alert("<?=_("表单尚未加载完毕，请等待后提交！")?>");
	    parent.unlockButton();
		parent.clearTimer();
	    return;
	}

	//表单输入项验证
	if(!form_validate()){
		parent.unlockButton();
		parent.clearTimer();
	    return false;
	}

	//主动执行计算
//	jQuery(".CALC").each(function(){
//		var funcName = eval("calc_"+jQuery(this).attr("name"));
//		if(jQuery.isFunction(funcName)){
//			funcName.call();
//		}
//	});
    //document.form1.SAVE_FLAG.value=flag;

    //工作紧急程度
    var WORK_LEVEL = parent.document.getElementById('WORK_LEVEL') ? parent.document.getElementById('WORK_LEVEL').value : 0;
    jQuery("input[name='WORK_LEVEL']").val(WORK_LEVEL);

    jQuery("input[name='SAVE_FLAG']").val(flag);
    LV_Submit();

    if(is_ie)
    {
        WebSign_Submit();
    }

    mouse_is_out=false;

    if(flag != 'tok'){ //非转交下一步的情况 弹出保存遮罩层
        parent.showSaveDiv();
    }
    document.form1.submit();
}

function new_attach()
{
    if(document.form1.NEW_TYPE.value=="")
    {
        alert("<?=_("请选择文件类型！")?>");
        return (false);
    }
    if(document.form1.NEW_NAME.value=="")
    {
        alert("<?=_("附件名不能为空！")?>");
        return (false);
    }
    CheckForm('S');
    return false;
}

function delete_attach(ATTACHMENT_ID,ATTACHMENT_NAME)
{
    var msg = sprintf("<?=_("确定要删除文件 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME,"？\n");
    if(window.confirm(msg))
    {
    	mouse_is_out=false;
        URL="delete_public_attach.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&EDIT_MODE=<?=$EDIT_MODE?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&ATTACHMENT_ID="+ATTACHMENT_ID+"&ATTACHMENT_NAME="+URLSpecialChars(ATTACHMENT_NAME)+"&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>";
        window.location=URL;
    }
}

function delete_attach_sign(FEED_ID,ATTACHMENT_ID,ATTACHMENT_NAME)
{

    var msg = sprintf("<?=_("确定要删除文件 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME,"？\n");
    if(window.confirm(msg))
    {
    	mouse_is_out=false;
        URL="delete_personal_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME="+URLSpecialChars(ATTACHMENT_NAME)+"&ATTACHMENT_ID="+ATTACHMENT_ID+"&FEED_ID="+FEED_ID;
        window.location=URL;
    }
}

function delete_attach_data(DATA_ID,ATTACHMENT_ID,ATTACHMENT_NAME)
{
    var msg = sprintf("<?=_("确定要删除文件 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME,"？\n");
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

function delete_attach_img(DATA_ID,ATTACHMENT_ID,ATTACHMENT_NAME)
{
    var msg = sprintf("<?=_("确定要删除图片 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME,"？\n");
    if(window.confirm(msg))
    {
        mouse_is_out=false;
        URL="delete_img_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME="+URLSpecialChars(ATTACHMENT_NAME)+"&ATTACHMENT_ID="+ATTACHMENT_ID+"&DATA_ID="+DATA_ID;
        window.location=URL;
    }
}

function myload()
{
    DWebSignSeal = document.getElementById("DWebSignSeal") || '';
	var auth_websign_code = window.auth_websign_code;
	if(auth_websign_code != '' && DWebSignSeal != '' && typeof(DWebSignSeal.SetSealComment) != 'undefined')
	{
		DWebSignSeal.SetSealComment("SET_ABOUT_TIPS", 0, 0, auth_websign_code);
	}
    <?=$JS_ONLOAD?>
    window.onresize=setBody;
    setBody();
    LoadSignData();
    parent.unlockButton();
<?
	if($_GET['intrust'] == 1){
		echo "parent.showInstrustDiv();";
	}
    if($LOGIN_KEY && $USEING_KEY)
        echo 'check_usb_key();';

    if($SAVE_FLAG==1)
    {
        echo 'show_msg("notice","'._("表单已成功保存").'",3);'; //保存标记
    }
    elseif($SAVE_FLAG=='N')
    {
        echo 'show_msg("notice","'._("文号已成功修改").'",3);'; //保存文号标记
    }
    else
    {
        if($FOCUS_USER!="")
            echo 'show_msg("focus","",3);';
        if($TIME_OUT!="" && $TIME_USED>$TIME_OUT*3600)
            echo 'delay_remind(3);';
    }
    if($FLOW_DOC!="0"){
    	echo 'upload_init();';
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
        window.onbeforeunload = function(){return checkClose();};
    }
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
          AddFav('<?=str_replace(array("\\","'","\r","\n"),array("\\\\","\'","",""),$RUN_NAME);?>','/general/workflow/list/print/?RUN_ID=<?=$RUN_ID?>',1);
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
		alert("<?=_("请选择经办人员！")?>");
		return;
	}
	else
	{
	    jQuery.get("../flow_view/add_user.php?FLOW_ID=<?=$FLOW_ID?>&RUN_ID=<?=$RUN_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>",{"TO_ID":to_id},function(data){
	  	    if(data==0)
	  	        jQuery("#add_msg").html("<?=_("您没有此权限！")?>");
	  	    else if(data==1)
	  		    jQuery("#add_msg").html("<?=_("此用户已经为本步骤经办人！")?>");
	        else if(data==2)
	        {
	    	    jQuery("#add_msg").html("<?=_("操作已成功")?>");
	    	    ClearUser('TO_ID', 'TO_NAME');
	        }
	  	});
	 }
}
</script>
<?
//--加载手写签章控件脚本--
if($SIGN_OBJECT!="" || $SIGN_OBJECT_OTHER > 0)
{
   //判断印章加盖来源
?>

<script>
var DWebSignSeal = null;
var sign_check = null;
var sign_str="<?=$SIGN_OBJECT?>";
var sign_arr=sign_str.split(",");
// var sign_check={<?=substr($SIGN_CHECK_STR,0,-1)?>};

function getCheckStr()
{
    var sign_check = '';
    var sign_length = jQuery('div[class="websign"]').length;
    for(count = 0; count < sign_length; count++)
    {
        sign_check += jQuery('div[class="websign"]:eq('+count+')').attr("sign_check");
    }
    return sign_check;
}

function addSeal(item,seal_id,x,y)
{
    var auth_websign = window.auth_websign;
    if(auth_websign == false)
    {
        alert('<?=_("签章授权失败，请联系OA厂商进行咨询。")?>');
    }
    try {
	    if(DWebSignSeal.FindSeal(item+"_seal",2)!="")
	    {
	    	alert("<?=_("您已经签章，请先删除已有签章！")?>");
	    	return;
	    }
	    var str=SetStore(item);
		var x = typeof(x) == 'undefined' ? 0 : parseInt(x);
		var y = typeof(y) == 'undefined' ? 0 : parseInt(y);
	    DWebSignSeal.SetPosition(x,y,"SIGN_POS_"+item);
<?
if($SEAL_FROM["BPM_SEAL_FROM"]==1)
    echo 'DWebSignSeal.addSeal("", item+"_seal");';
else
{
?>
        if(typeof seal_id=="undefined" || seal_id == 'undefined')
          show_seal(item,"addSeal",x,y);
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
        alert('<?=_("签章授权失败，请联系OA厂商进行咨询。")?>');
    }
    try {
	    if(DWebSignSeal.FindSeal(item+"_hw",2)!="")
	    {
	    	alert("<?=_("您已经签章，请先删除已有签章！")?>");
	    	return;
	    }
	    var str=SetStore(item);
	    DWebSignSeal.SetPosition(0,0,"SIGN_POS_"+item);
	    DWebSignSeal.HandWrite(0,-1,item+"_hw");

        DWebSignSeal.SetSealSignData(item+"_hw",str);
	    DWebSignSeal.SetMenuItem(item+"_hw",261);
	}catch(e){}
}


function GetDataStr(item)
{
    var sign_check = getCheckStr();

	if(typeof item == 'undefined')
    {
        return;
    }

	var str="";
	var separator = "::";  // 分隔符
	// eval("var TO_VAL=sign_check."+item+";");

    sign_check = sign_check.substr(0,sign_check.length-1);

    var check_array = new Array();
    var check_array1 = new Array();

    check_array = sign_check.split(",");

    for(cCount=0; cCount<check_array.length; cCount++)
    {
        check_array1[cCount] = check_array[cCount].split(":");
        if(item.indexOf(check_array1[cCount][0]) != -1)
        {
            TO_VAL = check_array1[cCount][1];
            break;
        }
    }

	if(TO_VAL)
	{
		var item_array = TO_VAL.split(",");
  	    for (i=0; i < item_array.length; i++)
  	    {
  		    var MyValue="";
  		    var obj = eval("document.form1."+item_array[i]);
            if(obj != undefined)
            {
                if(obj.type == undefined)
                {
                    if(obj[0].type == "radio")
                    {
                        var obj_len = obj.length;
                        for(rCount=0; rCount<obj_len; rCount++)
                        {
                            if(obj[rCount].checked)
                            {
                                MyValue = obj[rCount].value;
                            }
                        }
                    }
                }
                else if(obj.type == "checkbox")
                {

                    if(obj.checked == true)
                        MyValue = "on";
                    else
                        MyValue = "";
                }
                else
                {
                    MyValue=obj.value;
                }

                if(obj.type == undefined)
                {
                    if(obj[0].type == "radio")
                    {
                        str += obj[0].name + "separator" + MyValue + "\n";
                    }
                }
                else
                {
                    str += obj.name + "separator" + MyValue + "\n";
                }
            }
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
function LoadSignData()
{
    try {
	    for(var i=0;i<sign_arr.length;i++)
	    {
	    	if(sign_arr[i]!="")
	    	{
                DWebSignSeal.SetStoreData(eval("document.form1."+sign_arr[i]+".value"));
	        }
	    }
	    DWebSignSeal.ShowWebSeals();

        var str= "";
        var strObjectName ;
	    strObjectName = DWebSignSeal.FindSeal("",0);
	    while(strObjectName  != "")
	    {
	        var item_str = "";
            if(strObjectName.indexOf("_hw")>0)
                item_str = strObjectName.substring(0,strObjectName.indexOf("_hw"));
            else if(strObjectName.indexOf("_seal")>0)
                item_str = strObjectName.substring(0,strObjectName.indexOf("_seal"));
            else if(strObjectName.indexOf("SIGN_INFO")<0) //兼容旧数据
            {
                item_str = strObjectName;
            }
	        if(item_str!="")
            {
	            var item_obj = eval("document.form1."+item_str);
  	    	    str = GetDataStr(item_str);
  	    	    DWebSignSeal.SetSealSignData(strObjectName,str);
  	    	    if(item_obj.readonly)
  	    	    {
  	    	    	DWebSignSeal.SetMenuItem(strObjectName,4);
  	  	    	}
  	    	    else
  	    	    {
  	    	    	DWebSignSeal.SetMenuItem(strObjectName,<?if($OP_FLAG)echo "261";else echo "4";?>);
  	  	    	}

	        }
	    	strObjectName = DWebSignSeal.FindSeal(strObjectName,0);
	    }
        DWebSignSeal.SetCurrUser("<?=$_SESSION["LOGIN_USER_ID"]?>[<?=$_SESSION["LOGIN_USER_NAME"]?>]");
    }
    catch(e) {
        alert("<?=_("手写签章加载失败，请检查控件是否正确安装！")?>");
    }
    //加载完成标识
    SignLoadFlag = true;
}

function WebSign_Submit()
{
    try {
	    var sign_val;
	    for(var i=0;i<sign_arr.length;i++)
	    {
            if(sign_arr[i]!="")
            {
        	    var oldstr="";
        	    var objName_hw = DWebSignSeal.FindSeal(sign_arr[i]+"_hw",2);
	    	    var objName_seal = DWebSignSeal.FindSeal(sign_arr[i]+"_seal",2);
                //保存兼容老数据，老数据存在本次可写的第一个字段里。
                if(i==0)
                {
                    var strObjectName = DWebSignSeal.FindSeal("",0);
                	while(strObjectName !="")
                	{
                		if(strObjectName.indexOf("_hw")<0 && strObjectName.indexOf("_seal")<0 && strObjectName.indexOf("SIGN_INFO")<0)
                        oldstr += strObjectName+";";
                		strObjectName = DWebSignSeal.FindSeal(strObjectName,0);
                	}

	    	        if(objName_hw=="" && objName_seal=="" && oldstr=="")
	    	            sign_val="";
	    	        else
        	            sign_val=DWebSignSeal.GetStoreDataEx(oldstr+sign_arr[i]+"_hw"+";"+sign_arr[i]+"_seal");
        	    }
        	    else
        	    {
        	    	if(objName_hw=="" && objName_seal=="")
	    	            sign_val="";
	    	        else
        	    	    sign_val=DWebSignSeal.GetStoreDataEx(sign_arr[i]+"_hw"+";"+sign_arr[i]+"_seal");
        	    }
                eval("document.form1."+sign_arr[i]+".value=sign_val") ;
            }
        }
   }catch(e) {}
}
</script>
<?
}
else
{
?>

<script>
function LoadSignData()
{
  //加载完成标识
  SignLoadFlag = true;
  return;
}

function WebSign_Submit()
{
  return;
}
</script>
<?
}
?>
<!-- 复合控件父模板 -->
<script id="f-complex-wrapper-tmpl" type="x-tmpl">
{{each(i,row) config}}
    <div  class="row-wrapper"  >
        <div class="row-fluid u-single-row-box"  data-rows=${i+1}>
            {{each row}}
                <div class="span${$value.spanLength}   u-single-col-box  "  data-box-rows="${i+1}" data-box-cols="${$index+1}">

                    {{if $value.type === 'label' }}
                        <div class="u-tag-wrapper">
                            <div class="ui-form-item ui-border-b f-text" style="text-align: right;">
                                <div >
                                    <span class="u-default-show-span"  style="padding-right: 10px;">
                                        {{= $value.title}}
                                    </span>
                                </div>
                            </div>
                        </div>
                    {{/if}}

                </div>
            {{/each}}
        </div>
    </div>
{{/each}}
</script>

<!-- 复合控件下——————单行模板 -->
<script id="f-complex-input-tmpl" type="x-tmpl">
    <div class="u-tag-wrapper">
        {{if !secret }}
            <div class="ui-form-item ui-border-b f-text"  id="f-field-{{= parentid }}-{{= name }}" >
                    {{if required }}
                        <span class="ui-complex-badge-dot">*</span>
                    {{/if}}
                <div class="ui-complex-control">
                    {{if writable }}
                        <input name={{= item_id}} type="text"  value={{= value}}>
                    {{else}}
                        <span class="u-default-show-span">
                            {{= value}}
                        </span>
                    {{/if}}
                </div>
            </div>
        {{/if}}
    </div>
</script>
<!-- 复合控件下——————多行模板 -->
<script id="f-complex-textarea-tmpl" type="x-tmpl">
    <div class="u-tag-wrapper">
        {{if !secret }}
            <div class="ui-form-item ui-border-b f-text"  id="f-field-{{= parentid }}-{{= name }}">
                    {{if required }}
                        <span class="ui-complex-badge-dot">*</span>
                    {{/if}}
                <div class="ui-complex-control">
                    {{if writable }}
                        <textarea  name={{= item_id}} >{{= value}}</textarea>
                    {{else}}
                        <span class="u-default-show-span">
                            {{= value}}
                        </span>
                    {{/if}}

                </div>
            </div>
        {{/if}}
    </div>
</script>
<!-- 复合控件下——————日期模板 -->
<script id="f-complex-date-tmpl" type="x-tmpl">
    <div class="u-tag-wrapper">
        {{if !secret }}
            <div class="ui-form-item ui-border-b f-date"  id="f-field-{{= parentid }}-{{= name }}" >
                    {{if required }}
                        <span class="ui-complex-badge-dot">*</span>
                    {{/if}}
                <div class="ui-complex-control">
                    {{if writable }}
                        {{if dateFormat == 'datetime' }}
                            <input type="text"  name={{= item_id}} size="20" maxlength="20" value='{{= value}}'  onClick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'})" autocomplete="off" />
                        {{else dateFormat == 'time' }}
                            <input type="text"  name={{= item_id}} size="20" maxlength="20" value='{{= value}}'  onClick="WdatePicker({dateFmt:'HH:mm:ss'})" autocomplete="off" />
                        {{else dateFormat == 'date'}}
                            <input type="text"  name={{= item_id}} size="20" maxlength="20" value='{{= value}}'  onClick="WdatePicker({dateFmt:'yyyy-MM-dd'})" autocomplete="off" />
                        {{else}}
                            <input type="text"  name={{= item_id}} size="20" maxlength="20" value='{{= value}}'  onClick="WdatePicker({dateFmt:'yyyy-MM-dd'})" autocomplete="off" />
                        {{/if}}
                    {{else}}
                        <span class="u-default-show-span">
                            {{= value}}
                        </span>
                    {{/if}}

                </div>
            </div>
        {{/if}}
    </div>
</script>
