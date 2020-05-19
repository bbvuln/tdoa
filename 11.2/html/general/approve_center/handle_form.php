<?php
// use \dao\run\WorkRunDAO;
use \engine\TFlowEngine;
use \tform\handle\TWorkHandle;
include_once("inc/auth.inc.php");
include_once("inc/utility_flow.php");
include_once("inc/utility_calendar.php");
// include_once("form.inc.php");
// include_once 'inc/flow_engine2.0/workrun/dao/WorkRunDAO.php';
include_once 'inc/flow_engine2.0/inc/engine/TFlowEngine.php';
include_once 'inc/flow_engine2.0/inc/tform/TWorkHandle.class.php';

// $db = \engine\TFlowEngine::getDB();
$FLOW_PRCS = !empty($_GET['FLOW_PRCS']) ? $_GET['FLOW_PRCS'] : 0;
$FLOW_ID = !empty($_GET['FLOW_ID']) ? $_GET['FLOW_ID'] : 0;
$FORM_ID = !empty($_GET['FORM_ID']) ? $_GET['FORM_ID'] : 0;
if($FORM_ID == 0 && $FLOW_ID != 0 && $FLOW_PRCS != 0)
{
    // $formInfo = $db->select(array('UI_FORM_ID'), array('AND' => array('FLOW_ID' => $FLOW_ID, 'PRCS_ID' => $FLOW_PRCS)), null, 'bpm_process');
    $flowPrcsInfo = \engine\TFlowEngine::getFlowPrcsInfo($FLOW_ID, $FLOW_PRCS);
    if(is_array($flowPrcsInfo) && !empty($flowPrcsInfo))
    {
        $FORM_ID = $flowPrcsInfo['UI_FORM_ID'];
    }
    else
    {
        return '';
    }
}
$pagestarttime = microtime();
$SEAL_FROM = get_sys_para("BPM_SEAL_FROM");

$USER_PRIV_NAME = rtrim(GetPrivNameById($_SESSION["LOGIN_USER_PRIV"]), ",");

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
     style="position:absolute;left:0px;top:0px;margin-top:0px;width:100%;padding:15px 5px;color:white;text-align:center;vertical-align:middle;display:none;z-index:1000; background-color:#DE7293;"></div>
    <?php
    $secret_fields = '';
    $writable_fields = '_ALL_FIELDS_WRITABLE_';
    $required_fields = '';

    $config = array();
    $config = array(
        'form_id' => $FORM_ID
    );
    if(isset($FORM_VERSION_ID))
    {
        $config['form_version_id'] = intval($FORM_VERSION_ID);
        $sql = "select form_id from bpm_form_version where ID = '$FORM_VERSION_ID'";
        $resc = exequery(TD::conn(),$sql);
        if($row = mysql_fetch_array($resc))
        {
          $FORM_ID = $row['form_id'];
        }
        $config['form_id']  = $FORM_ID;
    }

    include_once("inc/flow_engine2.0/inc/tform/TWorkHandle.class.php");
    if(isset($type_mode) && $type_mode = 'edit')
    {
        $config['type_mode'] = 'edit';
    }
    $obj_work_handle = new TWorkHandle($FLOW_ID, 0, $FLOW_PRCS, 0, 0, $config);
	$obj_work_handle->_set('loginUid', $_SESSION['LOGIN_UID']);
	$obj_work_handle->_set('loginUserId',$_SESSION['LOGIN_USER_ID']);
	$obj_work_handle->_set('loginUserName',$_SESSION['LOGIN_USER_NAME']);
	$obj_work_handle->_set('loginDeptId', $_SESSION['LOGIN_DEPT_ID']);
	$obj_work_handle->_set('loginDeptIdOther', $_SESSION['LOGIN_DEPT_ID_OTHER']);
	$obj_work_handle->_set('loginUserPriv', $_SESSION['LOGIN_USER_PRIV']);
	$obj_work_handle->_set('loginUserPrivOther', $_SESSION['LOGIN_USER_PRIV_OTHER']);
    if($FLOW_ID != 0 && $FORM_ID == 0)
    {
        $PRINT_MODEL = $obj_work_handle->getFormHtml($writable_fields,$secret_fields,$required_fields,array('formType' =>'formView'));
    }else if($FORM_ID != 0)
    {
        $PRINT_MODEL = $obj_work_handle->getFormHtmlByFormId($writable_fields,$secret_fields,$required_fields,array('formType' =>'formView'));
    }

    // $READ_ONLY_STR = $obj_work_handle->get_readonly_item_ids();
    // $HIDDEN_STR = $obj_work_handle->get_secret_item_ids();
    $SIGN_OBJECT = $obj_work_handle->getSignItemIds();
	$counterSignStr = $obj_work_handle->getCounterSignStr();
    //$REQUIRED_STR = $obj_work_handle->get_required_item_ids();

    /***END OF �����еĺ�����Ϣ�滻������Ҫ����Ϣ*/

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
        var upload_limit = oa_upload_limit =<?=MYOA_UPLOAD_LIMIT?>, limit_type = oa_limit_type = "<?=strtolower(MYOA_UPLOAD_LIMIT_TYPE)?>";
        var sign_info_object = "";
        //����ȫ�ֱ���
        var g_run_id = "<?=$RUN_ID?>";       //��ˮ��
        var g_flow_id = "<?=$FLOW_ID?>";     //����ID
        var g_prcs_id = "<?=$PRCS_ID?>";     //ʵ�����̲������
        var g_flow_prcs = "<?=$FLOW_PRCS?>"; //������Ʋ����
        var g_r_item = "<?=$PRCS_ITEM?>";    //��д�ֶ�
        var g_form_view = 1;                 //�����
        var g_login_user_priv = "<?=$_SESSION["LOGIN_USER_PRIV"]?>"; 		//��¼�û���ɫID
        var g_login_user_priv_name = "<?=$USER_PRIV_NAME?>";	//��¼�û���ɫ��
        var g_login_user_id = "<?=$_SESSION["LOGIN_USER_ID"]?>";	//��¼�û�ID
        var g_login_user_name = "<?=$_SESSION["LOGIN_USER_NAME"]?>";	//��¼�û���
        // var g_required_str = "<?=$REQUIRED_STR?>";
        var flow_type = "<?$TYPE?>";  //��������
        var upload_cfg = {
            flash_url : "<?=MYOA_JS_SERVER?>/module/swfupload/swfupload.swf",
            upload_url: "upload_attach_batch.php?RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>",
            post_params: {"PIC_ID": "<?=$PIC_ID?>","SUB_DIR":"<?=urlencode($SUB_DIR)?>","PHPSESSID": "<?=session_id();?>"},
            file_size_limit : "<?=intval(ini_get('upload_max_filesize'))?> MB",
            file_types : "<?=MYOA_UPLOAD_LIMIT!=2 ? "*.*" : "*.".str_replace(",",";*.",trim(trim(MYOA_UPLOAD_LIMIT_TYPE),","))?>",
            file_types_description : "<?=MYOA_UPLOAD_LIMIT!=2 ? _("����") : trim(trim(MYOA_UPLOAD_LIMIT_TYPE),",")?> <?=_("�ļ�")?>",
        };
		var upload_cfg1 = { 
    flash_url : "<?=MYOA_JS_SERVER?>/module/swfupload/swfupload.swf",
    upload_url: "batch_upload_attach.php?RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FLOW_NAME=<?=$FLOW_NAME?>&ITEM_ID=<?=$ITEM_ID?>",
    post_params: {"PIC_ID": "<?=$PIC_ID?>","SUB_DIR":"<?=urlencode($SUB_DIR)?>","PHPSESSID": "<?=session_id();?>"},
    file_size_limit : "<?=intval(ini_get('upload_max_filesize'))?> MB",
    file_types : "<?=MYOA_UPLOAD_LIMIT!=2 ? "*.*" : "*.".str_replace(",",";*.",trim(trim(MYOA_UPLOAD_LIMIT_TYPE),","))?>",
    file_types_description : "<?=MYOA_UPLOAD_LIMIT!=2 ? _("����") : trim(trim(MYOA_UPLOAD_LIMIT_TYPE),",")?> <?=_("�ļ�")?>",
};

        function checkCloseTab()
        {
            <? if($AUTO_NEW): ?>
            return parent.cancel_run_jobx('0');
            <? else:?>
            return parent.cancel_run_jobx2('0');//�����й�����
            <? endif; ?>
        }

        function check_usb_key()
        {
            var theDevice = document.getElementById("tdPass");
            if (!theDevice)
            {
                alert("���Ȱ�װ�ؼ���");
                parent.showusbdiv();
                return (false);
            }

            var check_val = CHECK_USER("<?=$KEY_SN?>", theDevice);
            var msg;
            if (check_val < 0)
            {
                msg = "û�м�⵽�û�Key��\n\n������û�Key�����ȷ�����½��м�⡣";
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
                msg = "�û�Key����ȷ��\n\n�������ȷ���û�Key�����ȷ�����½��м�⡣";
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
         * @param flag flag=t:�ύ;flag=1:���棻flag=2:���沢���أ�flag=N�������ĺţ�flag=intrust:ί��
         * @returns {boolean}
         * @constructor
         */
        function CheckForm(flag)
        {
            if (document.getElementById("btnStart") != null && document.getElementById("btnStart").disabled == false)
            {
                alert("<?=_("���и�����δ�ϴ������ϴ����ύ��")?>");
                parent.unlockButton();
                parent.clearTimer();
                jQuery('#onekey_next_flag').val(0);
                return;
            }
            if (typeof SignLoadFlag == "undefined" || SignLoadFlag == false)
            {
                alert("<?=_("����δ������ϣ���ȴ����ύ��")?>");
                parent.unlockButton();
                parent.clearTimer();
                jQuery('#onekey_next_flag').val(0);
                return;
            }

            //����������֤
            if (!form_validate())
            {
                parent.unlockButton();
                parent.clearTimer();
                jQuery('#onekey_next_flag').val(0);
                return false;
            }

            //���������̶�
            var work_level = parent.document.getElementById('work_level') ? parent.document.getElementById('work_level').value : 0;
            jQuery("input[name='work_level']").val(work_level);

            //��������/�ĺ�
            var Symbol = parent.document.getElementById('Symbol') ? parent.document.getElementById('Symbol').value : 0;
            jQuery("input[name='Symbol']").val(Symbol);

            jQuery("input[name='SAVE_FLAG']").val(flag);
            LV_Submit();

            mouse_is_out = false;

            if (flag == 't' || flag == 1 || flag == 2)
            {
                //��չ�ؼ�����JS�������
                if (typeof fieldManager != "undefined" && typeof fieldManager.onSubmit == 'function')
                {
                    var ret = fieldManager.onSubmit();
                    if (ret === false)
                    {
                        parent.unlockButton();
                        jQuery('#onekey_next_flag').val(0);
                        return false;
                    }
                    else
                    {
                        <?
                        //--- ��������� ---
                        if($DISP_AIP)
                        {
                        ?>
                        if (is_ie)
                        {
                            aip_upload();
                            jQuery('#HWPostil1').css('display', 'none');    //������ڳ�����������ʱ����
                        }
                        <?
                        }
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
                        if (is_ie)
                        {
                            WebSign_Submit();
                        }
                    }
                }
            }
            if (flag != 'tok' && flag != 'tt')
            { //��ת����һ������� �����������ֲ�
                parent.showSaveDiv();
                if (flag == 'intrust')
                {
                    // parent.closeSaveDiv();
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
            //���ر��ؼ���ʼ�����¼��������
            if (typeof fields_event_config != "undefined")
            {
                seajs.use("TFieldManager", function (exports)
                {
                    var TFieldManager = exports.TFieldManager;
                    fieldManager = new TFieldManager({
                        runId: '<?=$RUN_ID?>',
                        flowId: '<?=$FLOW_ID?>',
                        wrapper: '#content-main'
                    }, fields_event_config);
                    if (window.location.href.indexOf('&sign_check_flag') != -1)
                    {
                        setTimeout(go_end, 200);
                    }
                });
            }
            myload();
            if ('<?=$_GET['next']?>' == 'true')
            {//ת����һ�������
                window.parent.loadWorkHandleNext();
            } else
            {//��ת����һ�������
                // parent.closeSaveDiv();
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
            var msg = sprintf("<?=_("ȷ��Ҫɾ���ļ� '%s' �� '%s' ɾ��ǰ�����ȱ������")?>", ATTACHMENT_NAME, "��\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_public_attach.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&EDIT_MODE=<?=$EDIT_MODE?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&ATTACHMENT_ID=" + ATTACHMENT_ID + "&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&PRCS_KEY_ID=<?=$PRCS_KEY_ID?>";
                window.location = URL;
            }
        }

        function delete_attach_sign(FEED_ID, ATTACHMENT_ID, ATTACHMENT_NAME)
        {

            var msg = sprintf("<?=_("ȷ��Ҫɾ���ļ� '%s' �� '%s' ɾ��ǰ�����ȱ������")?>", ATTACHMENT_NAME, "��\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_personal_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&ATTACHMENT_ID=" + ATTACHMENT_ID + "&FEED_ID=" + FEED_ID;
                parent.window.location = URL;
            }
        }

        function delete_attach_data(DATA_ID, ATTACHMENT_ID, ATTACHMENT_NAME)
        {
            var msg = sprintf("<?=_("ȷ��Ҫɾ���ļ� '%s' �� '%s' ɾ��ǰ�����ȱ������")?>", ATTACHMENT_NAME, "��\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_data_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&ATTACHMENT_ID=" + ATTACHMENT_ID + "&DATA_ID=" + DATA_ID;
                window.location = URL;
            }
        }

        function delete_attach_img(DATA_ID, ATTACHMENT_ID, ATTACHMENT_NAME)
        {
            var msg = sprintf("<?=_("ȷ��Ҫɾ��ͼƬ '%s' �� '%s' ɾ��ǰ�����ȱ������")?>", ATTACHMENT_NAME, "��\n");
            if (window.confirm(msg))
            {
                mouse_is_out = false;
                URL = "delete_img_attach.php?MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&ATTACHMENT_NAME=" + URLSpecialChars(ATTACHMENT_NAME) + "&ATTACHMENT_ID=" + ATTACHMENT_ID + "&DATA_ID=" + DATA_ID;
                window.location = URL;
            }
        }

        //ɾ����ǩ
        function delete_sign(FEED_ID)
        {
            var msg = "<?=_("ȷ��Ҫɾ���û�ǩ�����")?>\n<?=_("ɾ��ǰ�����ȱ������")?>";
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

        //�༭��ǩ
        function edit_sign(FEED_ID)
        {
            loc_x = (screen.availWidth - 600) / 2;
            loc_y = event.clientY;
            window.open("personal_edit.php?actionType=<?=$actionType?>&MENU_FLAG=<?=$MENU_FLAG?>&RUN_ID=<?=$RUN_ID?>&FLOW_ID=<?=$FLOW_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>&FLOW_DOC=<?=$FLOW_DOC?>&FEED_ID=" + FEED_ID, "FEED_EDIT", "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=550,height=300,left=" + loc_x + ",top=" + loc_y);
        }

        //�ظ���ǩ
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
            LoadSignData();
            // parent.unlockButton();
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
                echo 'show_msg("notice","' . _("���ѳɹ�����") . '",3);'; //������
            } elseif ($SAVE_FLAG == 'N')
            {
                echo 'show_msg("notice","' . _("�ĺ��ѳɹ��޸�") . '",3);'; //�����ĺű��
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

        function finish_run()
        {
            var ret = true;
            <?
            if($FEEDBACK == 2)//�����˲���ǿ�ƻ�ǩ����
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
                        if (getEditorText('CONTENT') == "" && jQuery('#ATTACHMENT1_div').children().length == 0)
                        {
                            alert("<?=_("������Ϊǿ�ƻ�ǩ������д��ǩ���")?>");
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
            var msg = "<?=_("ȷ�ϸù����Ѿ����������")?>";
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
                CheckForm(5);//������� �����λ��
            } else
            {
                parent.unlockButton();
            }
        }

        function is_finish_feedback()
        {
            var ret = true;
            <?
            if($FEEDBACK == 2)//�����˲���ǿ�ƻ�ǩ����
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
                        if (getEditorText('CONTENT') == "" && jQuery('#ATTACHMENT1_div').children().length == 0)
                        {
                            alert("<?=_("������Ϊǿ�ƻ�ǩ������д��ǩ���")?>");
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
                //�����ϲ��㷨���ݹ���FLOW_RUN_PRCS����Ѱ�Ҿ���һ�������ڵ�·����δ�ܵ������в�������ڵ� ���ܽ���ת��
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
                        echo 'alert("' . _("�˲���Ϊǿ�ƺϲ��ڵ㣬���в���δת�����˲��裬�������˻أ�") . '");';
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
    //--������дǩ�¿ؼ��ű�--
    if ($SIGN_OBJECT != "" || $SIGN_OBJECT_OTHER > 0  || $counterSignStr != '')
    {
        //�ж�ӡ�¼Ӹ���Դ
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
                    alert('<?=_("ǩ����Ȩʧ�ܣ�����ϵOA���̽�����ѯ��")?>');
                }
                try
                {
                    if (DWebSignSeal.FindSeal(item + "_seal", 2) != "")
                    {
                        alert("<?=_("���Ѿ�ǩ�£�����ɾ������ǩ�£�")?>");
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
                    alert('<?=_("ǩ����Ȩʧ�ܣ�����ϵOA���̽�����ѯ��")?>');
                }
                try
                {
                    if (DWebSignSeal.FindSeal(item + "_hw", 2) != "")
                    {
                        alert("<?=_("���Ѿ�ǩ�£�����ɾ������ǩ�£�")?>");
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
                var separator = "::";  // �ָ���
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

            function LoadSignData()
            {
                try
                {
                    for (var i = 0; i < sign_arr.length; i++)
                    {
                        if (sign_arr[i] != "")
                        {
                            DWebSignSeal.SetStoreData(eval("document.form1." + sign_arr[i] + ".value"));
                        }
                    }
                    DWebSignSeal.ShowWebSeals();

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
                        else if (strObjectName.indexOf("SIGN_INFO") < 0) //���ݾ�����
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
                                DWebSignSeal.SetMenuItem(strObjectName, <?if ($OP_FLAG) echo "261"; else echo "4";?>);
                            }

                        }
                        strObjectName = DWebSignSeal.FindSeal(strObjectName, 0);
                    }
                    DWebSignSeal.SetCurrUser("<?=$_SESSION["LOGIN_USER_ID"]?>[<?=$_SESSION["LOGIN_USER_NAME"]?>]");
                }
                catch (e)
                {
                    // alert("<?=_("��дǩ�¼���ʧ�ܣ�����ؼ��Ƿ���ȷ��װ��")?>");
                }
                //������ɱ�ʶ
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
                            //������������ݣ������ݴ��ڱ��ο�д�ĵ�һ���ֶ��
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
                //������ɱ�ʶ
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
<!-- ���Ͽؼ���ģ�� -->
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

<!-- ���Ͽؼ��¡���������������ģ�� -->
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
<!-- ���Ͽؼ��¡���������������ģ�� -->
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
<!-- ���Ͽؼ��¡���������������ģ�� -->
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