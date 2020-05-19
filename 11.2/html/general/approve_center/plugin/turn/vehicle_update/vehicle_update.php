<?
include_once ('inc/auth.inc.php');
include_once("inc/td.class.php");
include_once("inc/conn.php");
include_once("inc/flow_engine/engine/TFlowEngine.php");

$arr_para = TFlowEngine::get_para_data($RUN_ID);
$arr_data = TFlowEngine::get_data($RUN_ID);

$vu_id              = $arr_para["VU_ID"];
$vu_sms_remind      = $arr_data["vehicle_group.vu_sms_remind"]==_("是") ? 1 : 0;
$vu_proposer        = $arr_data["vehicle_group.vu_proposer"] ? $arr_data["vehicle_group.vu_proposer"] : "";
$vu_dept_app        = $arr_data["vehicle_group.vu_dept_app"]==_("同意") ? 1 : ($arr_data["vehicle_group.vu_dept_app"]==_("不同意") ? 2 : 0);
$vu_dept_reason     = $arr_data["vehicle_group.vu_dept_reason"] ? $arr_data["vehicle_group.vu_dept_reason"] : "";
$vu_operator_app    = $arr_data["vehicle_group.vu_operator_app"]==_("同意") ? 1 : 0;
$vu_operator_reason = $arr_data["vehicle_group.vu_operator_reason"] ? $arr_data["vehicle_group.vu_operator_reason"] : "";

if($FLOW_PRCS == "2") //部门审批处理
{
    $show_flag = ($vu_dept_app == 1) ? 1 : 0;
    
    $query = "update VEHICLE_USAGE set DMER_STATUS='$vu_dept_app',SHOW_FLAG='$show_flag',DEPT_REASON='$vu_dept_reason' where VU_ID='$vu_id'";
    exequery(TD::conn(), $query);
    
    if($vu_dept_app!=1 && $vu_sms_remind)
    {
        include_once("inc/utility_sms1.php");
        $sms_content = _("您的车辆申请未被批准!");
        $remind_url = "vehicle/query.php?VU_STATUS=3&DMER_STATUS=3";
        send_sms("", $_SESSION["LOGIN_USER_ID"], $vu_proposer, 9, $sms_content, $remind_url);
    }
}
else if($FLOW_PRCS == "3") //调度人审批处理
{
    if($vu_operator_app == 1)
    {
        $query = "update VEHICLE_USAGE set VU_STATUS='1' where VU_ID='$vu_id'";
        exequery(TD::conn(), $query);
        
        $sms_content = _("您的车辆申请已被批准!");
        $remind_url = "vehicle/query.php?VU_STATUS=1";
    }
    else if($vu_operator_app == 0)
    {
        $query = "update VEHICLE_USAGE set VU_STATUS='3',OPERATOR_REASON='$vu_operator_reason' where VU_ID='$vu_id'";
        exequery(TD::conn(), $query);
        
        $sms_content = _("您的车辆申请未被批准!");
        $remind_url = "vehicle/query.php?VU_STATUS=3&DMER_STATUS=3";
    }
    
    if($vu_sms_remind)
    {
        include_once("inc/utility_sms1.php");
        send_sms("", $_SESSION["LOGIN_USER_ID"], $vu_proposer, 9, $sms_content, $remind_url);
    }
}
?>