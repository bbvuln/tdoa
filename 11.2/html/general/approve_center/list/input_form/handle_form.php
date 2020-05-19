<?php
// use \dao\run\WorkRunDAO;
use \engine\TFlowEngine;
use \tform\handle\TWorkHandle;
include_once("inc/auth.inc.php");
include_once("inc/utility_flow.php");
include_once("inc/utility_calendar.php");
include_once("form.inc.php");
// include_once 'inc/flow_engine2.0/workrun/dao/WorkRunDAO.php';
include_once 'inc/flow_engine2.0/inc/engine/TFlowEngine.php';
include_once 'inc/flow_engine2.0/inc/tform/TWorkHandle.class.php';
$connstatus = isset($_GET['connstatus']) ? $_GET['connstatus'] : $_GET['CONNSTATUS'];
$EDIT_MODE = isset($_GET['edit_mode']) ? $_GET['edit_mode'] : $_GET['EDIT_MODE'];
$PRCS_KEY_ID = isset($_GET['prcs_key_id']) ? $_GET['prcs_key_id'] : $_GET['PRCS_KEY_ID'];
$RUN_ID = isset($_GET['run_id']) ? $_GET['run_id'] : $_GET['RUN_ID'];
$PRCS_ID = isset($_GET['prcs_id']) ? $_GET['prcs_id'] : $_GET['PRCS_ID'];
$FLOW_PRCS = isset($_GET['flow_prcs']) ? $_GET['flow_prcs'] : $_GET['FLOW_PRCS'];
$FLOW_ID = isset($_GET['flow_id']) ? $_GET['flow_id'] : $_GET['FLOW_ID'];
$actionType = $_GET['actionType'] == "" ? "handle" : $_GET['actionType'];
//主从服务器查询判断
if ($connstatus == 1)
{
    $connstatus = true;
} else
{
    $connstatus = "";
}
$pagestarttime = microtime();
$SEAL_FROM = get_sys_para("BPM_SEAL_FROM");

$USER_PRIV_NAME = rtrim(GetPrivNameById($_SESSION["LOGIN_USER_PRIV"]), ",");

/***START OF 取文号,附件信息**/
//----- 取文号,附件信息 --------
$obj_run = $obj_run_dao->getWorkRunInfo($RUN_ID);

//if($ROW=mysql_fetch_array($cursor))
if ($obj_run)
{
    $RUN_NAME = $obj_run["RUN_NAME"];//$ROW["RUN_NAME"];
    $ATTACHMENT_ID = $obj_run["ATTACHMENT_ID"];//$ROW["ATTACHMENT_ID"];
    $ATTACHMENT_NAME = $obj_run["ATTACHMENT_NAME"];//$ROW["ATTACHMENT_NAME"];
    $FOCUS_USER = $obj_run["FOCUS_USER"];//$ROW["FOCUS_USER"];
    $BEGIN_USER = $obj_run["BEGIN_USER"];//$ROW["BEGIN_USER"];
    $PARENT_RUN = $obj_run["PARENT_RUN"];//$ROW["PARENT_RUN"];
    $BEGIN_USER_NAME = rtrim(GetUserNameById($BEGIN_USER), ",");
    $BEGIN_TIME = $obj_run["BEGIN_TIME"];//$ROW["BEGIN_TIME"];
    //$PARENT_RUN = $obj_run["PARENT_RUN"];//$ROW["PARENT_RUN"];
    $AIP_FILES = $obj_run["AIP_FILES"];//$ROW["AIP_FILES"];
    $work_level = $obj_run["WORK_LEVEL"];//$ROW["work_level"];

    if ($AIP_FILES != "")
    {
        $AIP_FILES_ARRAY = array();
        $MY_ARRAY = explode("\n", $AIP_FILES);
        foreach ($MY_ARRAY as $V)
        {
            $TMP = explode(":", $V);
            $AIP_FILES_ARRAY[$TMP[0]] = $TMP[1];
        }
    }

    if ($PARENT_RUN != 0)
    {
		$sql = "SELECT FLOW_ID FROM BPM_RUN WHERE RUN_ID='$PARENT_RUN'";
		$cursor = exequery(TD::conn(), $sql);
		if($row=mysql_fetch_array($cursor))
		{
			$PARENT_FLOW_ID = $row['FLOW_ID'];
		}
    }
}
/***END OF 取文号,附件信息**/

/***START OF 检测是否被删除掉并给出提示信息**/
$s_node_state = TFlowEngine::getRunNodeStatus($RUN_ID, $PRCS_ID, $FLOW_PRCS, $PRCS_KEY_ID);

if ($s_node_state == "deleted")
{
    Message("", _("此工作已经删除，您不能办理！"));
    if ($page_from == "TASKCENTER")
    {
        echo '<div align="center">
						<input type="button" id="close_btn" class="btn" value=' . _("关闭") . ' onclick="TJF_window_close();">
                    </div>';
    } else
    {
        echo '<div align="center">
						<input type="button" id="close_btn" class="btn" value=' . _("关闭") . ' onclick="TJF_window_close();">
					</div>';
    }
    exit;
}
/***END OF 检测是否被删除掉并给出提示信息**/

/***START OF 检测工作 状态并给出提示信息**/
if (!$EDIT_MODE)
{
    //$s_node_state = $obj_run_dao->get_run_node_status($FLOW_ID, $RUN_ID, $PRCS_ID, $FLOW_PRCS, $PRCS_KEY_ID, $_SESSION["LOGIN_USER_ID"]);
    switch ($s_node_state)
    {
        case 1:
        case 2:
            break;
        case 3:
        case 4:
        case "end":
            if ($s_node_state != "end")
            {
                $str = _('转交至下一步');
            } else
            {
                $str = _('结束');
            }
            Message("", sprintf(_("流水号：%s 文号：%s 的工作已经%s，您不能办理！"), $RUN_ID, $RUN_NAME, $str));
            echo '<div align="center">
    		  <input type="button" value="' . _("查看表单") . '" class="BigButton" title="' . _("查看表单") . '" onclick="window.parent.form_view1(' . $RUN_ID . ',' . $FLOW_ID . ')">
    		  <input type="button" id="back_btn" class="BigButton" value=' . _("返回") . ' onclick="window.parent.wgotobackAction();">
    		  <input type="button" id="close_btn" class="BigButton" value=' . _("关闭") . ' onclick="TJF_window_close();window.parent.close();"></div>
    		  <script>

                function goBackIndex(){
                    if(typeof window.parent.parent.hideForm == "function"){
                        window.parent.parent.hideForm();
                    }else{
                        window.parent.location.href=\'/general/aprove_center/list/\';
                    }
                }
    		  window.onload = function() {
    			  var close_btn = document.getElementById("close_btn");
    			  var back_btn = document.getElementById("back_btn");
    			  var id = top.document.getElementById("tabs_container");
    		          var href = window.parent.location.href;
    		          var tt = href.indexOf("actionType");
    			  if(tt>0)
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
/***END OF 检测工作 状态并给出提示信息**/

/***START OF 检测是系统UKEY开关及用户的UKEY信息**/
$PARA_ARRAY = get_sys_para("LOGIN_KEY");
while (list($PARA_NAME, $PARA_VALUE) = each($PARA_ARRAY))
    $$PARA_NAME = $PARA_VALUE;

$query = "SELECT USEING_KEY,KEY_SN from USER where UID='" . $_SESSION["LOGIN_UID"] . "'";
$cursor = exequery(TD::conn(), $query);
if ($ROW = mysql_fetch_array($cursor))
{
    $USEING_KEY = $ROW["USEING_KEY"];
    $KEY_SN = $ROW["KEY_SN"];
}
/***END OF 检测是系统UKEY开关及用户的UKEY信息**/

/***START OF 获取流程信息及流程的自动 编号信息**/
$FLOW_ID = intval($FLOW_ID);
$obj_flow = TFlowEngine::getFlowInfo($FLOW_ID);
if ($obj_flow)
{
    $TYPE = $obj_flow["FLOW_TYPE"];
    $FLOW_NAME = $obj_flow["FLOW_NAME"];//$ROW["FLOW_NAME"];
    //$FORM_ID=$ROW["FORM_ID"];
    $FLOW_TYPE = $TYPE;//$ROW["FLOW_TYPE"];
    $FLOW_DOC = $obj_flow["FLOW_DOC"];//$ROW["FLOW_DOC"];
    $AUTO_NUM = $obj_flow["AUTO_NUM"];//$ROW["AUTO_NUM"];
    $AUTO_LEN = $obj_flow["AUTO_LEN"];//$ROW["AUTO_LEN"];
    $MODEL_ID = $obj_flow["MODEL_ID"];//$ROW["MODEL_ID"];
    $MODEL_NAME = $obj_flow["MODEL_NAME"];//$ROW["MODEL_NAME"];
    $LEN = strlen($AUTO_NUM);
    for ($I = 0; $I < $AUTO_LEN - $LEN; $I++)
        $AUTO_NUM = "0" . $AUTO_NUM;
}

$rows = $obj_run_dao->initWorkRunVariableDataDAO()->select("FLOW_AUTO_NUM", array("RUN_ID"=>$RUN_ID));
foreach($rows as $row)
{
    $FLOW_AUTO_NUM = $row["FLOW_AUTO_NUM"];
}
//2016-03-03 以下不用了
//$table_name = "BPM_DATA_" . $FLOW_ID;
//if (field_exists($table_name, 'flow_auto_num'))
//{
////	$query = "SELECT FLOW_AUTO_NUM FROM `".$table_name."` WHERE RUN_ID = '".$RUN_ID."'";
////	$cursor = exequery(TD::conn(),$query,$connstatus);
////	if($row = mysql_fetch_array($cursor)){
////		$FLOW_AUTO_NUM = $row["FLOW_AUTO_NUM"];
////	}
//    $rows = $obj_run_dao->select("FLOW_AUTO_NUM", array("RUN_ID" => $RUN_ID), $table_name);
//    foreach ($rows as $row)
//    {
//        $FLOW_AUTO_NUM = $row["FLOW_AUTO_NUM"];
//    }
//}
if (!empty($FLOW_AUTO_NUM))
{
    $AUTO_NUM = $FLOW_AUTO_NUM;
}
/***END OF 获取流程信息及流程的自动 编号信息*/

/***START OF 办理工作 的状态 下获取流程步骤的办理信息**/
if (!$EDIT_MODE)  //正常办理模式
{
    $obj_run_node = TFlowEngine::getWorkRunPrcsInfoById($PRCS_KEY_ID);
    if ($obj_run_node)
    {
        $OP_FLAG = $obj_run_node[0]["OP_FLAG"];//$ROW["OP_FLAG"];
        $PRCS_FLAG = $obj_run_node[0]["PRCS_FLAG"];//$ROW["PRCS_FLAG"];
        $TOP_FLAG = $obj_run_node[0]["TOP_FLAG"];//$ROW["TOP_FLAG"];
        $PARENT = $obj_run_node[0]["PARENT"];//$ROW["PARENT"];
        $PRCS_TIME = $obj_run_node[0]["PRCS_TIME"];//$ROW["PRCS_TIME"];
        $FREE_ITEM = $obj_run_node[0]["FREE_ITEM"];//$ROW["FREE_ITEM"];

    }
} else
    $OP_FLAG = 1;

/***END OF 办理工作 的状态 下获取流程步骤的办理信息*/

/***START OF 根据流程信息获取流程步骤的相关信息**/
if ($EDIT_MODE == 1) //此标记用于工作查询，模拟自由流程
    $FLOW_TYPE = 2;

$obj_node = TFlowEngine::getFlowPrcsInfo($FLOW_ID, $FLOW_PRCS);

if ($FLOW_TYPE == "1")
{
    if ($obj_node)
    {
        $PRCS_NAME = $obj_node["PRCS_NAME"];//$ROW["PRCS_NAME"];
        $PRCS_ITEM = $obj_node["PRCS_ITEM"];//$ROW["PRCS_ITEM"];
        $PRCS_ITEM_AUTO = $obj_node["PRCS_ITEM_AUTO"];//$ROW["PRCS_ITEM_AUTO"];
        $FEEDBACK = $obj_node["FEEDBACK"];//$ROW["FEEDBACK"];
        $SIGNLOOK = $obj_node["SIGNLOOK"];//$ROW["SIGNLOOK"];
        $HIDDEN_ITEM = $obj_node["HIDDEN_ITEM"];//$ROW["HIDDEN_ITEM"];
        $TIME_OUT = $obj_node["TIME_OUT"];//$ROW["TIME_OUT"];
        $TIME_OUT_MODIFY = $obj_node["TIME_OUT_MODIFY"];//$ROW["TIME_OUT_MODIFY"];
        $ATTACH_PRIV = $obj_node["ATTACH_PRIV"];//$ROW["ATTACH_PRIV"];
        $ALLOW_BACK = $obj_node["ALLOW_BACK"];//$ROW["ALLOW_BACK"];
        $DISP_AIP = $obj_node["DISP_AIP"];//$ROW["DISP_AIP"];
        $GATHER_NODE = $obj_node["GATHER_NODE"];//$ROW["GATHER_NODE"];
        $USER_ATTACH_EDIT_PRIV = $obj_node["ATTACH_EDIT_PRIV"];//$ROW["ATTACH_EDIT_PRIV"];
        $ATTACH_MACRO_MARK = $obj_node["ATTACH_MACRO_MARK"];//$ROW["ATTACH_MACRO_MARK"];
        $REQUIRED_ITEM = $obj_node["REQUIRED_ITEM"];//$ROW["REQUIRED_ITEM"];
        $UI_TYPE = $obj_node["UI_TYPE"];
        if ($ALLOW_BACK)
        {
            $BACK_FLAG = TFlowEngine::prepareBackWork($FLOW_ID, $RUN_ID, $FLOW_PRCS,$PRCS_ID);
        }
    }
}
/***END OF 根据流程信息获取流程步骤的相关信息*/


/***START OF 根据表单获取表单的相关信息**/
$FORM_ID = intval($FORM_ID);
?>
<style>
    .color1 {
        color: #FFBC18;
    }

    .color2 {
        color: #50C625;
    }

    .color3 {
        color: #F4A8BD;
    }

    .color4 {
        color: #FF0000;
    }
</style>
<div id="focus_div"
     style="position:absolute;left:0px;top:0px;margin-top:0px;width:100%;padding:15px 5px;color:white;text-align:center;vertical-align:middle;display:none;z-index:1000; background-color:#DE7293;">
    <?php
    // 添加关注人提示效果  王瑞杰 20140623
    $USER_NAME_STR = "";
    $FOCUS_ARRAY = explode(",", $FOCUS_USER);
    for ($I = 0; $I < sizeof($FOCUS_ARRAY); $I++)
    {
        if ($FOCUS_ARRAY[$I] == "")
            continue;
        $query = "select USER_NAME FROM USER where USER_ID='$FOCUS_ARRAY[$I]'";
        $cursor = exequery(TD::conn(), $query);
        if ($ROW = mysql_fetch_array($cursor))
        {
            $USER_NAME_STR .= "[" . $ROW["USER_NAME"] . "],";
        }
    }

    if ($USER_NAME_STR != "")
    {
        $USER_NAME_STR = substr($USER_NAME_STR, 0, -1);
        echo _("此工作已被下列人员关注：") . "<b>" . $USER_NAME_STR . "</b>";
    } else
        echo _("目前没有人关注此工作！");
    echo '</div>';
    
/***END OF 根据表单获取表单的相关信息*/
    $CUR_TIME1 = date("H:i:s", time());
    $CUR_DATE = date("Y-m-d");
    $CUR_TIME = $CUR_DATE . " " . $CUR_TIME1;
    /***START OF 接收办理后变更办理状态由未接收变更为办理中*/
    if (!$EDIT_MODE)
    {
        if ($PRCS_FLAG == 1)
        {
            if ($PRCS_ID == 1)
            {
				$obj_run_dao->update(
					array(
						"BEGIN_USER"=>$_SESSION["LOGIN_USER_ID"],
						"BEGIN_TIME"=>$CUR_TIME
					),
					array(
						"RUN_ID"=>$RUN_ID
					)
				);
            }
            update_taskcenter_bpm($RUN_ID, $PRCS_ID, 2, $TIME_OUT_FLAG, $FLOW_PRCS);
        } elseif ($PRCS_FLAG == 3 || $PRCS_FLAG == 4)
        {
            Message("", _("流程已被主办人转交，不能再进行办理"));
            Button_Back();
            exit;
        }

        delete_taskcenter_bpm($RUN_ID, $PRCS_ID, $FLOW_PRCS);
    }//!EDIT_MODE
    /***END OF 接收办理后变更办理状态由未接收变更为办理中*/


    /***START OF 将表单中的宏标记信息替换成所需要的信息**/
    $PRCS_DATE = strtok($BEGIN_TIME, " ");

    $JS_ONLOAD = "";
    //$PRINT_MODEL= parse_form($PRINT_MODEL);

    //判断可写字段、只读字段和必填字段
    $secret_fields = $writable_fields = $required_fields = '';
    $DEBUG_MODE = 0;
    if ($DEBUG_MODE || $EDIT_MODE || $FLOW_TYPE == '2' && $PRCS_ID == 1)   //debug、编辑模式下、自由流程第一个步骤所有字段全部可写，无保密字段
    {
        $secret_fields = '';
        $writable_fields = '_ALL_FIELDS_WRITABLE_';
        $required_fields = '';
    } else
    {
        $secret_fields = $HIDDEN_ITEM;
        $required_fields = $REQUIRED_ITEM;
        if (!$OP_FLAG)   //经办人所有字段不可写
        {
            $writable_fields = '';
        } else
        {
            $writable_fields = $FLOW_TYPE == '2' ? $FREE_ITEM : $PRCS_ITEM; //自由流程可写字段取FLOW_RUN_PRCS表的FREE_ITEM字段，固定流程取FLOW_PROCESS表的PRCS_ITEM字段
        }
    }

    $runInfo = TFlowEngine::getVersionIdByRunId($RUN_ID);
    if($runInfo['VERSION_LOG'] == 1)
    {
        $formVersionId = TFlowEngine::getVersionIdByBpmRunPrcs($RUN_ID,$PRCS_ID);
        $config['form_version_id'] = $formVersionId;
    }

    include_once("inc/flow_engine2.0/inc/tform/TWorkHandle.class.php");
    $obj_work_handle = new TWorkHandle($FLOW_ID, $RUN_ID, $FLOW_PRCS,$PRCS_ID, $PRCS_KEY_ID,$config);
	//传入当前登陆人的信息
	$obj_work_handle->_set('loginUid', $_SESSION['LOGIN_UID']);
	$obj_work_handle->_set('loginUserId',$_SESSION['LOGIN_USER_ID']);
	$obj_work_handle->_set('loginUserName',$_SESSION['LOGIN_USER_NAME']);
	$obj_work_handle->_set('loginDeptId', $_SESSION['LOGIN_DEPT_ID']);
	$obj_work_handle->_set('loginDeptIdOther', $_SESSION['LOGIN_DEPT_ID_OTHER']);
	$obj_work_handle->_set('loginUserPriv', $_SESSION['LOGIN_USER_PRIV']);
	$obj_work_handle->_set('loginUserPrivOther', $_SESSION['LOGIN_USER_PRIV_OTHER']);
    $PRINT_MODEL = $obj_work_handle->getFormHtml($writable_fields,$secret_fields,$required_fields);
	
    // $READ_ONLY_STR = $obj_work_handle->get_readonly_item_ids();
    // $HIDDEN_STR = $obj_work_handle->get_secret_item_ids();
    $SIGN_OBJECT = $obj_work_handle->getSignItemIds();
	$lastListName = $obj_work_handle->getLastListName();
	$counterSignStr = $obj_work_handle->getCounterSignStr();
	setcookie('counterSignStr',$counterSignStr);
    //$REQUIRED_STR = $obj_work_handle->get_required_item_ids();

    /***END OF 将表单中的宏标记信息替换成所需要的信息*/

    if ($LOGIN_KEY && $USEING_KEY)
    {
        ?>
        <object id="tdPass" name="tdPass" CLASSID="clsid:0272DA76-96FB-449E-8298-178876E0EA89"
                CODEBASE="/inc/tdPass_<?= (stristr($_SERVER['HTTP_USER_AGENT'], 'x64') ? 'x64' : 'x86') ?>.cab#version=1,2,12,1023"
                BORDER="0" VSPACE="0" HSPACE="0" ALIGN="TOP" HEIGHT="0" WIDTH="0"></object>
        <?
    }
    ?>
    <input type="hidden" name="SAVE_FLAG" value="1">
    <input type="hidden" name="FLOW_TYPE" value="<?= $TYPE ?>">
    <input type="hidden" name="EDIT_MODE" value="<?= $EDIT_MODE ?>">
    <input type="hidden" name="RUN_ID" value="<?= $RUN_ID ?>">
    <input type="hidden" name="RUN_NAME" value="<?= $RUN_NAME ?>">
    <input type="hidden" name="FLOW_ID" value="<?= $FLOW_ID ?>">
    <input type="hidden" name="PRCS_ID" value="<?= $PRCS_ID ?>">
    <input type="hidden" name="FLOW_PRCS" value="<?= $FLOW_PRCS ?>">
    <input type="hidden" name="ITEM_ID_MAX" value="<?= $ITEM_ID ?>">
    <input type="hidden" name="MENU_FLAG" value="<?= $MENU_FLAG ?>">
    <input type="hidden" name="HIDDEN_STR" value="<?= $HIDDEN_STR ?>">
    <input type="hidden" name="READ_ONLY_STR" value="<?= $READ_ONLY_STR ?>">
    <input type="hidden" name="TOP_FLAG_OLD" value="<?= $TOP_FLAG ?>">
    <input type="hidden" name="BACK_CONTENT" id="BACK_CONTENT">
    <input type="hidden" name="FLOW_PRCS_LAST" id="FLOW_PRCS_LAST">
    <input type="hidden" name="PRCS_KEY_ID" value="<?= $PRCS_KEY_ID ?>">
    <input type="hidden" name="work_level" value="<?= $work_level ?>">
    <input type="hidden" name="work_level_old" value="<?= $work_level ?>">
    <input type="hidden" name="getdata_search" id="getdata_search" value="<?= $getdata_search ?>"/>
    <input type="hidden" name="sign_object" id="sign_object" value="0">
    <input type="hidden" name="onekey_next_flag" id="onekey_next_flag" value="0">
    <input type="hidden" name="ui_type" id="ui_type" value="<? $b_is_form ? "form" : "auto" ?>">
    <script>
        jQuery.noConflict();
        var SignLoadFlag = false;
		var listLoadFlag = false;
		var lastListName = '<?=$lastListName?>';
		var counterSignStr = '<?=$counterSignStr?>';
		listLoadFlag = lastListName == '' ? true : listLoadFlag;
        var upload_limit = oa_upload_limit =<?=MYOA_UPLOAD_LIMIT?>, limit_type = oa_limit_type = "<?=strtolower(MYOA_UPLOAD_LIMIT_TYPE)?>";
        var sign_info_object = "";
        //定义全局变量
        var g_run_id = "<?=$RUN_ID?>";       //流水号
        var g_flow_id = "<?=$FLOW_ID?>";     //流程ID
        var g_prcs_id = "<?=$PRCS_ID?>";     //实际流程步骤序号
        var g_flow_prcs = "<?=$FLOW_PRCS?>"; //流程设计步骤号
        var g_r_item = "<?=$PRCS_ITEM?>";    //可写字段
        var g_form_view = 1;                 //办理表单
        var g_login_user_priv = "<?=$_SESSION["LOGIN_USER_PRIV"]?>"; 		//登录用户角色ID
        var g_login_user_priv_name = "<?=$USER_PRIV_NAME?>";	//登录用户角色名
        var g_login_user_id = "<?=$_SESSION["LOGIN_USER_ID"]?>";	//登录用户ID
        var g_login_user_name = "<?=$_SESSION["LOGIN_USER_NAME"]?>";	//登录用户名
        // var g_required_str = "<?=$REQUIRED_STR?>";
        var flow_type = "<?$TYPE?>";  //流程类型
        var upload_cfg = {
            flash_url : "<?=MYOA_JS_SERVER?>/module/swfupload/swfupload.swf",
            upload_url: "upload_attach_batch.php?RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>",
            post_params: {"PIC_ID": "<?=$PIC_ID?>","SUB_DIR":"<?=urlencode($SUB_DIR)?>","PHPSESSID": "<?=session_id();?>"},
            file_size_limit : "<?=intval(ini_get('upload_max_filesize'))?> MB",
            file_types : "<?=MYOA_UPLOAD_LIMIT!=2 ? "*.*" : "*.".str_replace(",",";*.",trim(trim(MYOA_UPLOAD_LIMIT_TYPE),","))?>",
            file_types_description : "<?=MYOA_UPLOAD_LIMIT!=2 ? _("所有") : trim(trim(MYOA_UPLOAD_LIMIT_TYPE),",")?> <?=_("文件")?>",
        };
		var upload_cfg1 = { 
    flash_url : "<?=MYOA_JS_SERVER?>/module/swfupload/swfupload.swf",
    upload_url: "batch_upload_attach.php?RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FLOW_NAME=<?=$FLOW_NAME?>&ITEM_ID=<?=$ITEM_ID?>",
    post_params: {"PIC_ID": "<?=$PIC_ID?>","SUB_DIR":"<?=urlencode($SUB_DIR)?>","PHPSESSID": "<?=session_id();?>"},
    file_size_limit : "<?=intval(ini_get('upload_max_filesize'))?> MB",
    file_types : "<?=MYOA_UPLOAD_LIMIT!=2 ? "*.*" : "*.".str_replace(",",";*.",trim(trim(MYOA_UPLOAD_LIMIT_TYPE),","))?>",
    file_types_description : "<?=MYOA_UPLOAD_LIMIT!=2 ? _("所有") : trim(trim(MYOA_UPLOAD_LIMIT_TYPE),",")?> <?=_("文件")?>",
};

        function checkCloseTab()
        {
            <? if($AUTO_NEW): ?>
            return parent.cancel_run_jobx('0');
            <? else:?>
            return parent.cancel_run_jobx2('0');//办理中工作；
            <? endif; ?>
        }

        function check_usb_key()
        {
            var theDevice = document.getElementById("tdPass");
            if (!theDevice)
            {
                alert("请先安装控件！");
                parent.showusbdiv();
                return (false);
            }

            var check_val = CHECK_USER("<?=$KEY_SN?>", theDevice);
            var msg;
            if (check_val < 0)
            {
                msg = "没有检测到用户Key！\n\n请插入用户Key，点击确定重新进行检测。";
                if (window.confirm(msg))
                    check_usb_key();
                else
                {
                    parent.showusbdiv();
                    return (false);
                }
            }
            else if (check_val == 0)
            {
                msg = "用户Key不正确！\n\n请插入正确的用户Key，点击确定重新进行检测。";
                if (window.confirm(msg))
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

        /**
         *
         * @param flag flag=t:提交;flag=1:保存；flag=2:保存并返回；flag=N：保存文号；flag=intrust:委托
         * @returns {boolean}
         * @constructor
         */
        function CheckForm(flag)
        {
            if (document.getElementById("btnStart") != null && document.getElementById("btnStart").disabled == false)
            {
                alert("<?=_("您有附件尚未上传，请上传后提交！")?>");
                parent.unlockButton();
                parent.clearTimer();
                jQuery('#onekey_next_flag').val(0);
                return;
            }
            if (typeof SignLoadFlag == "undefined" || SignLoadFlag == false)
            {
                alert("<?=_("表单尚未加载完毕，请等待后提交！")?>");
                parent.unlockButton();
                parent.clearTimer();
                jQuery('#onekey_next_flag').val(0);
                return;
            }

            //表单输入项验证
            if (!form_validate())
            {
                parent.unlockButton();
                parent.clearTimer();
                jQuery('#onekey_next_flag').val(0);
                return false;
            }

            //工作紧急程度
            var work_level = parent.document.getElementById('work_level') ? parent.document.getElementById('work_level').value : 0;
            jQuery("input[name='work_level']").val(work_level);

            //工作名称/文号
            var Symbol = parent.document.getElementById('Symbol') ? parent.document.getElementById('Symbol').value : 0;
            jQuery("input[name='Symbol']").val(Symbol);

            jQuery("input[name='SAVE_FLAG']").val(flag);
            LV_Submit();
			if(counterSignStr != '')
			{
				counterSign_submit(counterSignStr);
			}
            mouse_is_out = false;

            if (flag == 't' || flag == 1 || flag == 2)
            {
                //扩展控件保存JS处理机制
                if (typeof fieldManager != "undefined" && typeof fieldManager.onSubmit == 'function')
                {
                    if(flag == 't')
                    {
                        var ret = fieldManager.onSubmit();
                        if( ret === false )
                        {
                            parent.unlockButton();
                            jQuery('#onekey_next_flag').val(0);
                            return false;
                        }
                    }
                    <?
                    //--- 保存呈批单 ---
                    if($DISP_AIP)
                    {
                    ?>
                        if(is_ie)
                        {
                            aip_upload();
                            jQuery('#HWPostil1').css('display', 'none');    //如果存在呈批单，保存时隐藏
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
                }
            }
            if (flag != 'tok' && flag != 'tt')
            { //非转交下一步的情况 弹出保存遮罩层
				parent.showSaveDiv();
                if (flag == 'intrust')
                {
                    parent.closeSaveDiv();
                }
                if (flag == 1 || flag == 2)
                {
                    jQuery('#HWPostil1').css('display', '');
                }
            }
            document.form1.submit();
        }
        jQuery(document).ready(function ($)
        {
            //加载表单控件初始化和事件处理代码
            if (typeof fields_event_config != "undefined")
            {
                seajs.use("TFieldManager", function (exports)
                {
                    var TFieldManager = exports.TFieldManager;
                    fieldManager = new TFieldManager({
                        runId: '<?=$RUN_ID?>',
                        flowId: '<?=$FLOW_ID?>',
                        wrapper: '#content-main',
                        dblclickHandle: <?= $DEBUG_MODE ? '$.noop' : $EDIT_MODE ? 'version_load' : 'quick_load' ?>
                    }, fields_event_config);
                    if (window.location.href.indexOf('&sign_check_flag') != -1)
                    {
                        setTimeout(go_end, 200);
                    }
                });
            }
            myload();
            if ('<?=$_GET['next']?>' == 'true')
            {//转交下一步的情况
                window.parent.loadWorkHandleNext();
            } else
            {//非转交下一步的情况
                parent.closeSaveDiv();
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

        function delete_attach(ATTACHMENT_ID, ATTACHMENT_NAME)
        {
            var msg = sprintf("<?=_("确定要删除文件 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME, "？\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_public_attach.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&EDIT_MODE=<?=$EDIT_MODE?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&ATTACHMENT_ID=" + ATTACHMENT_ID + "&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&PRCS_KEY_ID=<?=$PRCS_KEY_ID?>";
                window.location = URL;
            }
        }

        function delete_attach_sign(FEED_ID, ATTACHMENT_ID, ATTACHMENT_NAME)
        {

            var msg = sprintf("<?=_("确定要删除文件 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME, "？\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_personal_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&ATTACHMENT_ID=" + ATTACHMENT_ID + "&FEED_ID=" + FEED_ID;
                parent.window.location = URL;
            }
        }

        function delete_attach_data(DATA_ID, ATTACHMENT_ID, ATTACHMENT_NAME)
        {
            var msg = sprintf("<?=_("确定要删除文件 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME, "？\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_data_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&ATTACHMENT_ID=" + ATTACHMENT_ID + "&DATA_ID=" + DATA_ID;
                window.location = URL;
            }
        }

        function delete_attach_img(DATA_ID, ATTACHMENT_ID, ATTACHMENT_NAME)
        {
            var msg = sprintf("<?=_("确定要删除图片 '%s' 吗 '%s' 删除前建议先保存表单！")?>", ATTACHMENT_NAME, "？\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_img_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&ATTACHMENT_ID=" + ATTACHMENT_ID + "&DATA_ID=" + DATA_ID;
                window.location = URL;
            }
        }

        //删除会签
        function delete_sign(FEED_ID)
        {
            var msg = "<?=_("确定要删除该会签意见吗？")?>\n<?=_("删除前建议先保存表单！")?>";
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                var URL = "delete_personal.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FEED_ID=" + FEED_ID;
                // window.location=URL;
                jQuery.get(URL, function (data)
                {
                    if (data == "success")
                    {
                        CheckForm(1);
                    }
                });

            }
        }

        //编辑会签
        function edit_sign(FEED_ID)
        {
            loc_x = (screen.availWidth - 600) / 2;
            loc_y = event.clientY;
            window.open("personal_edit.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FLOW_DOC=<?=$FLOW_DOC?>&FEED_ID=" + FEED_ID, "FEED_EDIT", "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=550,height=300,left=" + loc_x + ",top=" + loc_y);
        }

        //回复会签
        function reply_sign(FEED_ID)
        {
            loc_x = (screen.availWidth - 600) / 2;
            loc_y = event.clientY;
            window.open("personal_reply.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FLOW_DOC=<?=$FLOW_DOC?>&FEED_ID=" + FEED_ID, "FEED_EDIT", "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=550,height=300,left=" + loc_x + ",top=" + loc_y);
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
			showWebSignImg();
            LoadSignData();
            //parent.unlockButton();
            <?
            if ($_GET['intrust'] == 1)
            {
                echo "parent.showInstrustDiv();";
            }
            if ($LOGIN_KEY && $USEING_KEY)
                echo 'check_usb_key();';

            if ($DISP_AIP)
                echo 'disp_form("4");';


            if ($SAVE_FLAG == 1)
            {
                echo 'show_msg("notice","' . _("表单已成功保存") . '",3);'; //保存标记
            } elseif ($SAVE_FLAG == 'N')
            {
                echo 'show_msg("notice","' . _("文号已成功修改") . '",3);'; //保存文号标记
            } else
            {
                if ($FOCUS_USER != "")
                    echo 'show_msg("focus","",3);';
                if ($TIME_OUT != "" && $TIME_USED > $TIME_OUT * 3600)
                    echo 'delay_remind(3);';
            }
            if ($FLOW_TYPE == 2)
            {
                if ((find_id($FREE_ITEM, "[A@]") || $PRCS_ID == 1) && $OP_FLAG && $FLOW_DOC == 1)
                {
                    echo 'upload_init();';
                }
            } else
            {
                if (find_id($PRCS_ITEM, "[A@]") && find_id($ATTACH_PRIV, 1) && $OP_FLAG && $FLOW_DOC == 1)
                {
                    echo 'upload_init();';
                }
            }
            ?>

            if (window.top.bTabStyle)
            {
                var tabId = 'tabs_' + window.top.jQuery.fn.getSelected() + '_iframe';
                window.top.document.getElementById(tabId).contentWindow.onclose = function ()
                {
                    return checkCloseTab();
                    return true;
                }
            }
            else
            {
                // window.onbeforeunload = function(){return checkClose();};
            }
        }

        function next_finish_run()
        {
            var ret = true;
            <?
            if($FEEDBACK == 2)//主办人不受强制会签限制
            {
            ?>
            jQuery.ajax({
                type: "POST",
                url: "check_feedback_signed.php",
                async: false,
                data: {
                    "run_id": g_run_id,
                    "flow_id": g_flow_id,
                    "prcs_id": g_prcs_id,
                    "flow_prcs": g_flow_prcs,
                    "flow_type": flow_type,
                    "edit_mode": "<?=$EDIT_MODE?>",
                    "connstatus": "<?=$connstatus?>"
                },
                success: function (data)
                {
                    if (data == "SIGNISNOTEMPTY")
                    {
                        if (getEditorText('CONTENT').match(/^[ ]*$/) && jQuery('#ATTACHMENT1_div').children().length == 0)
                        {
                            alert("<?=_("本步骤为强制会签，请填写会签意见")?>");
                            ret = false;
                        }
                    }
                }
            });
            return ret;

            <?
            }
            ?>

        }
        function finish_run()
        {
            var ret = true;
            <?
            if($FEEDBACK == 2)//主办人不受强制会签限制
            {
            ?>
            jQuery.ajax({
                type: "POST",
                url: "check_feedback_signed.php",
                async: false,
                data: {
                    "run_id": g_run_id,
                    "flow_id": g_flow_id,
                    "prcs_id": g_prcs_id,
                    "flow_prcs": g_flow_prcs,
                    "flow_type": flow_type,
                    "edit_mode": "<?=$EDIT_MODE?>",
                    "connstatus": "<?=$connstatus?>"
                },
                success: function (data)
                {
                    if (data == "SIGNISNOTEMPTY")
                    {
                        if (getEditorText('CONTENT').match(/^[ ]*$/) && jQuery('#ATTACHMENT1_div').children().length == 0)
                        {
                            alert("<?=_("本步骤为强制会签，请填写会签意见")?>");
                            go_sign();
                            parent.unlockButton();
                            ret = false;
                            return;
                        }
                    }
                }
            });
            if (!ret)
            {
                return ret;
            }
            <?
            }
            ?>
            var msg = "<?=_("确认该工作已经办理完毕吗？")?>";
            if (window.confirm(msg))
            {
                <?
                if(!$EDIT_MODE && $FEEDBACK != 1)
                {
                ?>
                if (is_ie)
                {
                    sign_submit();
                }
                <?
                }
                ?>
                CheckForm(5);//办理完毕 进这个位置
            } else
            {
                parent.unlockButton();
            }
        }

        function is_finish_feedback()
        {
            var ret = true;
            <?
            if($FEEDBACK == 2)//主办人不受强制会签限制
            {
            ?>
            jQuery.ajax({
                type: "POST",
                url: "check_feedback_signed.php",
                async: false,
                data: {
                    "run_id": g_run_id,
                    "flow_id": g_flow_id,
                    "prcs_id": g_prcs_id,
                    "flow_prcs": g_flow_prcs,
                    "flow_type": flow_type,
                    "edit_mode": "<?=$EDIT_MODE?>",
                    "connstatus": "<?=$connstatus?>"
                },
                success: function (data)
                {
                    if (data == "SIGNISNOTEMPTY")
                    {
                        if (getEditorText('CONTENT').match(/^[ ]*$/) && jQuery('#ATTACHMENT1_div').children().length == 0)
                        {
                            alert("<?=_("本步骤为强制会签，请填写会签意见")?>");
                            go_sign();
                            parent.unlockButton();
                            ret = false;
                            return;
                        }
                    }
                }
            });
            <?
            }
            ?>
            return ret;
        }
        function goBack()
        {
            <?
            if ($GATHER_NODE == 1)
            {
                $PRE_PRCS_ID = $PRCS_ID - 1;
                //并发合并算法：递归在FLOW_RUN_PRCS表中寻找距上一个并发节点路径，未能到达所有并发步骤节点 则不能进行转交
                $rows = $obj_run_dao->initWorkFlowNodeDAO()->select(array("PRCS_ID"), array("AND" => array("FLOW_ID" => $FLOW_ID, "OR" => array("PRCS_TO[~]#1" => "$FLOW_PRCS,%", "PRCS_TO[~]#2" => ",$FLOW_PRCS,"))));
                foreach ($rows as $ROW)
                {
                    $rows2 = $obj_run_dao->initWorkRunNodeDAO()->select(array("PRCS_FLAG"), array("AND"=>array("RUN_ID"=>$RUN_ID, "FLOW_PRCS"=>$ROW["PRCS_ID"], "OP_FLAG"=>1)));
                    if(count($rows2) > 0){
                        foreach($rows2 as $ROW1)
                        {
                            $PRCS_FLAG1 = $ROW1["PRCS_FLAG"];
                            if ($PRCS_FLAG1 <= 2)
                                $CANNOT_TURN = true;
                        }
                    } else
                        $CANNOT_TURN = false;

                    if (!find_id($PARENT_STR, $ROW["PRCS_ID"]) && $CANNOT_TURN)
                    {
                        echo 'alert("' . _("此步骤为强制合并节点，尚有步骤未转交至此步骤，您不能退回！") . '");';
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
                case "0" :
                    show_msg("focus", "", <?if ($FOCUS_USER == "") echo 2; else echo 5?>);
                    break;
                case "1" :
                    focus_run(<?=$RUN_ID?>);
                    break;
                case "2" :
                    form_view("<?=$PARENT_RUN?>", "<?=$PARENT_FLOW_ID?>")
                default :
                    break;
            }
            obj.selectedIndex = obj.options.length - 1;
        }

        function set_view(flag)
        {
            switch (flag)
            {
                case "0":
                    form_view("<?=$RUN_ID?>", "<?=$FLOW_ID?>", "<?=$PRCS_ID?>");
                    break;
                case "1":
                    flow_view("<?=$RUN_ID?>", "<?=$FLOW_ID?>");
                    break;
                case "2":
                    view_graph("<?=$FLOW_ID?>");
                    break;
                case "3":
                    show_msg("focus", "", "<?if ($FOCUS_USER == "") echo 2; else echo 5?>");
                    break;
                case "4":
                    focus_run('<?=$RUN_ID?>');
                    break;
                case "5":
                    AddFav('<?=str_replace(array("\\", "'", "\r", "\n"), array("\\\\", "\'", "", ""), $RUN_NAME);?>', '/general/approve_center/list/print/?RUN_ID=<?=$RUN_ID?>', 1);
                    break;
                case "6":
                    AddUserShow();
                    break;
            }
            hideMenu();
        }

    </script>
    <?
    //--加载手写签章控件脚本--
    if ($SIGN_OBJECT != "" || $SIGN_OBJECT_OTHER > 0 || $counterSignStr != '')
    {
        //判断印章加盖来源
        ?>

        <script>
            var DWebSignSeal = null;
            var sign_check = null;
            var sign_str = "<?=$SIGN_OBJECT?>";
            var sign_arr = sign_str.split(",");
            // var sign_check={<?=substr($SIGN_CHECK_STR, 0, -1)?>};

            function getCheckStr(item)
            {
                var sign_check = '';
                var sign_length = jQuery('div[class="websign"]').length;
                for (count = 0; count < sign_length; count++)
                {
                    if (jQuery('div[class="websign"]:eq(' + count + ')').attr("sign_check"))
                    {
                        if (jQuery('div[class="websign"]:eq(' + count + ')').attr("sign_check").indexOf(item + ":") != -1)
                        {
                            sign_check += jQuery('div[class="websign"]:eq(' + count + ')').attr("sign_check");
                        }
                    }
                }
                return sign_check;
            }

            function addSeal(item, seal_id,x,y)
            {
                var auth_websign = window.auth_websign;
                if(auth_websign == false)
                {
                    alert('<?=_("签章授权失败，请联系OA厂商进行咨询。")?>');
                }
                try
                {
                    if (DWebSignSeal.FindSeal(item + "_seal", 2) != "")
                    {
                        alert("<?=_("您已经签章，请先删除已有签章！")?>");
                        return;
                    }
                    var str = SetStore(item);
					var x = typeof(x) == 'undefined' ? 0 : parseInt(x);
					var y = typeof(y) == 'undefined' ? 0 : parseInt(y);
                    DWebSignSeal.SetPosition(x, y, "SIGN_POS_" + item);
                    <?
                    if($SEAL_FROM["BPM_SEAL_FROM"] == 1)
                    {
                    ?>
                    var obj_name = DWebSignSeal.addSeal("", item + "_seal");
                    var ajax_url = "/module/sel_seal/seal_log.php";
                    if (obj_name != "")
                    {
                        jQuery.ajax({
                            type: "POST",
                            data: "TYPE=file",
                            url: ajax_url
                        });
                    }
                    <?
                    }
                    else
                    {
                    ?>
                    if (typeof seal_id == "undefined" || seal_id == 'undefined')
                        show_seal(item, "addSeal",x,y);
                    else
                    {
                        var URL = "<?=(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on') ? 'https' : 'http'?>://<?=$_SERVER['HTTP_HOST']?>/module/sel_seal/get.php?ID=" + seal_id;
                        var obj_name = DWebSignSeal.AddSeal(URL, item + "_seal");
                        var ajax_url = "/module/sel_seal/seal_log.php";
                        if (obj_name != "")
                        {
                            jQuery.ajax({
                                type: "POST",
                                data: "TYPE=database&ID=" + seal_id,
                                url: ajax_url
                            });
                        }
                    }
                    <?
                    }
                    ?>
                    DWebSignSeal.SetSealSignData(item + "_seal", str);
                    DWebSignSeal.SetMenuItem(item + "_seal", 261);
                } catch (e)
                {
                }
            }

            function handWrite(item)
            {
                var auth_websign = window.auth_websign;
                if(auth_websign == false)
                {
                    alert('<?=_("签章授权失败，请联系OA厂商进行咨询。")?>');
                }
                try
                {
                    if (DWebSignSeal.FindSeal(item + "_hw", 2) != "")
                    {
                        alert("<?=_("您已经签章，请先删除已有签章！")?>");
                        return;
                    }
                    var str = SetStore(item);
                    DWebSignSeal.SetPosition(0, 0, "SIGN_POS_" + item);
                    var obj_name = DWebSignSeal.HandWrite(0, -1, item + "_hw");
                    var ajax_url = "/module/sel_seal/seal_log.php";
                    if (obj_name != "")
                    {
                        jQuery.ajax({
                            type: "POST",
                            data: "TYPE=handwrite",
                            url: ajax_url
                        });
                    }

                    DWebSignSeal.SetSealSignData(item + "_hw", str);
                    DWebSignSeal.SetMenuItem(item + "_hw", 261);
                } catch (e)
                {
                }
            }

            function isHaveAddedSeal(item)
            {
                try
                {
                    if (DWebSignSeal.FindSeal(item + "_hw", 2) == "" && DWebSignSeal.FindSeal(item + "_seal", 2) == "")
                    {
                        return false;
                    }
                    else
                    {
                        return true;
                    }
                } catch (e)
                {
                }
            }

            function GetDataStr(item)
            {
                var sign_check = getCheckStr(item);

                if (typeof item == 'undefined')
                {
                    return;
                }

                var str = "";
                var separator = "::";  // 分隔符
                // eval("var TO_VAL=sign_check."+item+";");

                sign_check = sign_check.substr(0, sign_check.length - 1);

                var check_array = new Array();
                var check_array1 = new Array();

                check_array = sign_check.split(",");

                for (cCount = 0; cCount < check_array.length; cCount++)
                {
                    check_array1[cCount] = check_array[cCount].split(":");

                    if (item.indexOf(check_array1[cCount][0]) != -1)
                    {
                        TO_VAL = check_array1[cCount][1];
                    }
                    else if (item.indexOf(check_array1[cCount][0]) == -1)
                    {
                        TO_VAL = TO_VAL + "," + check_array[cCount]
                    }
                }

                if (TO_VAL)
                {
                    var item_array = TO_VAL.split(",");
                    for (i = 0; i < item_array.length; i++)
                    {
                        var MyValue = "";
                        var obj = eval("document.form1." + item_array[i]);
                        if (obj != undefined)
                        {
                            if (obj.type == undefined)
                            {
                                if (obj[0].type == "radio")
                                {
                                    var obj_len = obj.length;
                                    for (rCount = 0; rCount < obj_len; rCount++)
                                    {
                                        if (obj[rCount].checked)
                                        {
                                            MyValue = obj[rCount].value;
                                        }
                                    }
                                }
                            }
                            else if (obj.type == "checkbox")
                            {

                                if (obj.checked == true)
                                    MyValue = "on";
                                else
                                    MyValue = "";
                            }
                            else
                            {
                                MyValue = obj.value;
                            }

                            if (obj.type == undefined)
                            {
                                if (obj[0].type == "radio")
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
                try
                {
                    var str = GetDataStr(item);
                    DWebSignSeal.SetSignData("-");
                    DWebSignSeal.SetSignData("+DATA:" + str);
                }
                catch (e)
                {
                }
                return str;
            }
			function showWebSignImg()
			{
				try{
					if(sign_arr.length == 0)
					{
						return;
					}
					for(var i=0;i<sign_arr.length;i++)
					{
						if(sign_arr[i]!="")
						{
							DWebSignSeal.SetStoreData(eval("document.form1."+sign_arr[i]+".value"));
						}
					}
					DWebSignSeal.ShowWebSeals();
				}catch(e) {};
			}
            function LoadSignData()
            {
                try
                {
                    /*for (var i = 0; i < sign_arr.length; i++)
                    {
                        if (sign_arr[i] != "")
                        {
                            DWebSignSeal.SetStoreData(eval("document.form1." + sign_arr[i] + ".value"));
                        }
                    }
                    DWebSignSeal.ShowWebSeals();*/

                    var str = "";
                    var strObjectName;
                    strObjectName = DWebSignSeal.FindSeal("", 0);
                    while (strObjectName != "")
                    {
                        var item_str = "";
                        if (strObjectName.indexOf("_hw") > 0)
                            item_str = strObjectName.substring(0, strObjectName.indexOf("_hw"));
                        else if (strObjectName.indexOf("_seal") > 0)
                            item_str = strObjectName.substring(0, strObjectName.indexOf("_seal"));
                        else if (strObjectName.indexOf("SIGN_INFO") < 0) //兼容旧数据
                        {
                            item_str = strObjectName;
                        }
                        if (item_str != "")
                        {
                            var item_obj = eval("document.form1." + item_str);
                            str = GetDataStr(item_str);
                            DWebSignSeal.SetSealSignData(strObjectName, str);
                            if (item_obj.readonly)
                            {
                                DWebSignSeal.SetMenuItem(strObjectName, 4);
                            }
                            else
                            {
								var counterFlag = typeof jQuery(item_obj).attr('writable_flag') != 'undefined' && jQuery(item_obj).attr('writable_flag') == true ? true : false;//会签控件可写区判断
								if(counterFlag)
								{
									DWebSignSeal.SetMenuItem(strObjectName,261);
								}else
								{
									DWebSignSeal.SetMenuItem(strObjectName, <?if ($OP_FLAG) echo "261"; else echo "4";?>);
								}
                            }

                        }
                        strObjectName = DWebSignSeal.FindSeal(strObjectName, 0);
                    }
                    DWebSignSeal.SetCurrUser("<?=$_SESSION["LOGIN_USER_ID"]?>[<?=$_SESSION["LOGIN_USER_NAME"]?>]");
                }
                catch (e)
                {
                    // alert("<?=_("手写签章加载失败，请检查控件是否正确安装！")?>");
                }
                //加载完成标识
                SignLoadFlag = true;
            }

            function WebSign_Submit()
            {
                try
                {
                    var sign_val;
                    for (var i = 0; i < sign_arr.length; i++)
                    {
                        if (sign_arr[i] != "")
                        {
                            var oldstr = "";
                            var objName_hw = DWebSignSeal.FindSeal(sign_arr[i] + "_hw", 2);
                            var objName_seal = DWebSignSeal.FindSeal(sign_arr[i] + "_seal", 2);
                            //保存兼容老数据，老数据存在本次可写的第一个字段里。
                            if (i == 0)
                            {
                                var strObjectName = DWebSignSeal.FindSeal("", 0);
                                while (strObjectName != "")
                                {
                                    if (strObjectName.indexOf("_hw") < 0 && strObjectName.indexOf("_seal") < 0 && strObjectName.indexOf("SIGN_INFO") < 0)
                                        oldstr += strObjectName + ";";
                                    strObjectName = DWebSignSeal.FindSeal(strObjectName, 0);
                                }

                                if (objName_hw == "" && objName_seal == "" && oldstr == "")
                                    sign_val = "";
                                else
                                    sign_val = DWebSignSeal.GetStoreDataEx(oldstr + sign_arr[i] + "_hw" + ";" + sign_arr[i] + "_seal");
                            }
                            else
                            {
                                if (objName_hw == "" && objName_seal == "")
                                    sign_val = "";
                                else
                                    sign_val = DWebSignSeal.GetStoreDataEx(sign_arr[i] + "_hw" + ";" + sign_arr[i] + "_seal");
                            }
                            eval("document.form1." + sign_arr[i] + ".value=sign_val");
                        }
                    }
                } catch (e)
                {
                }
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
			function showWebSignImg()
			{
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
