<?
include_once ('inc/auth.inc.php');
include_once("inc/td.class.php");
include_once("inc/conn.php");
include_once("inc/utility_all.php");
include_once("inc/utility_org.php");
include_once("inc/flow_engine/engine/TFlowEngine.php");

$arr_para = TFlowEngine::get_para_data($RUN_ID);
$arr_data = TFlowEngine::get_data($RUN_ID);

$notify_id              = intval($arr_para["NOTIFY_ID"]);
$notify_leader_app      = $arr_data["notify_group.notify_auditer_app"]==_("同意") ? 1 : ($arr_data["notify_group.notify_leader_app"]==_("不同意") ? 2 : 0);
$notify_leader_reason   = $arr_data["notify_group.notify_auditer_reason"];

$cur_date = date("Y-m-d", time());
if($notify_id)
{
    if($notify_leader_app == 1)
    {
        $query = "update NOTIFY set PUBLISH='1',AUDITER='".$_SESSION["LOGIN_USER_ID"]."',AUDIT_DATE='$cur_date' where NOTIFY_ID='$notify_id'";
        exequery(TD::conn(), $query);
    }
    else if($notify_leader_app == 2)
    {
        $query = "update NOTIFY set PUBLISH='3',AUDITER='".$_SESSION["LOGIN_USER_ID"]."',AUDIT_DATE='$cur_date',REASON='$notify_leader_reason' where NOTIFY_ID='$notify_id'";
        exequery(TD::conn(), $query);
    }
    
    $para_array   = get_sys_para("SMS_REMIND");
    $para_value   = $para_array["SMS_REMIND"];
    $remind_array = explode("|", $para_value);
    $sms_remind   = $remind_array[0];
    $sms2_remind  = $remind_array[1];
    $sms3_remind  = $remind_array[2];
    if(find_id($sms_remind, 1))
    {
        include_once("inc/utility_sms1.php");
        $user_id_str = "";
        $query = "select * from notify where NOTIFY_ID='$notify_id'";
        $cursor = exequery(TD::conn(), $query);
        if($row = mysql_fetch_array($cursor))
        {
            $to_id          = $row['TO_ID'];
            $from_id        = $row["FROM_ID"];
            $subject        = $row["SUBJECT"];
            $summary        = $row["SUMMARY"];
            $begin_date     = $row["BEGIN_DATE"];
            $end_date       = $row["END_DATE"];
            $priv_id        = $row["PRIV_ID"];
            $send_time      = $row["SEND_TIME"];
            $to_user_id     = $row["USER_ID"];
            
            //审批结果事务提醒
            if($notify_leader_app == 1)
            {
                $sms_content0 = sprintf(_("您提交的公告通知，标题：%s审批已通过。"), csubstr($subject, 0, 100));
                $remind_url0 = "1:notify/manage/index.php";
                send_sms($send_time, $_SESSION["LOGIN_USER_ID"], $from_id, 1, $sms_content0, $remind_url0);
                
                //发布通过的事务提醒
                $sms_content = _("请查看公告通知！")."\n"._("标题：").csubstr($subject, 0, 100);
                if($summary)
                    $sms_content .= "\n"._("内容简介：") . $summary;
                
                if($to_id == "ALL_DEPT")
                {
                    $query2 = "select USER_ID from USER where (NOT_LOGIN = 0 or NOT_MOBILE_LOGIN = 0)";
                }
                else
                {
                    $query2="select USER_ID from USER where (NOT_LOGIN = 0 or NOT_MOBILE_LOGIN = 0) and (find_in_set(DEPT_ID,'$to_id') or find_in_set(USER_PRIV,'$priv_id') or find_in_set(USER_ID,'$to_user_id'))";
                }
                $cursor2 = exequery(TD::conn(), $query2);
                while($row2=mysql_fetch_array($cursor2))
                {
                    $user_id_str .= $row2["USER_ID"].",";
                }
                
                $my_array = explode(",", $priv_id);
                $array_count = sizeof($my_array);
                for($I=0;$I<$array_count;$I++)
                {
                    if($my_array[$I]=="")
                        continue;
                    $query3 = "select USER_ID from USER where (NOT_LOGIN = 0 or NOT_MOBILE_LOGIN = 0) and find_in_set('$my_array[$I]',USER_PRIV_OTHER)";
                    $cursor3 = exequery(TD::conn(), $query3);
                    while($row3 = mysql_fetch_array($cursor3))
                    {
                        if(!find_id($user_id_str, $row3["USER_ID"]))
                            $user_id_str .= $row3["USER_ID"].",";     	
                    }
                }
                
                //排除没有公告通知菜单权限的人 
                $user_id_str_array = explode(",", $user_id_str);
                $user_id_str_array_count = sizeof($user_id_str_array);
                for($I=0;$I<$user_id_str_array_count;$I++)
                {
                    if($user_id_str_array[$I]=="")
                        continue;
                    
                    $func_id_str = GetfunmenuByuserID($user_id_str_array[$I]);
                    if(!find_id($func_id_str, 4))
                        $user_id_str = str_replace($user_id_str_array[$I], '', $user_id_str);  	 	
                }
                
                if(td_trim($user_id_str))
                {
                    $remind_url = "1:notify/show/read_notify.php?NOTIFY_ID=".$notify_id;
                    send_sms("", $_SESSION["LOGIN_USER_ID"], $user_id_str, 1, $sms_content, $remind_url,$notify_id);
                }
            }
            else if($notify_leader_app == 2)
            {
                $sms_content0 = sprintf(_("您提交的公告通知，标题：%s审批未通过，原因是：%s"), csubstr($subject, 0, 100), $notify_leader_reason);
                $remind_url0 = "1:notify/manage/index.php";
                send_sms($send_time, $_SESSION["LOGIN_USER_ID"], $from_id, 1, $sms_content0, $remind_url0);
            }
        }
    }
}
?>