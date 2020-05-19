<?
include_once("inc/auth.inc.php");
include_once("inc/utility_all.php");
include_once('mobile/inc/funcs.php');

$type = 0;
$op_str = "<option vaule='0'></option>";
$return_arr = array();
$dept = intval($_POST['dept']);
if($dept)
{
    $query = "SELECT USER_ID,USER_NAME FROM user,user_priv WHERE user.USER_PRIV=user_priv.USER_PRIV AND (user.NOT_LOGIN='0' OR user.NOT_MOBILE_LOGIN='0') AND DEPT_ID = '$dept' ORDER BY PRIV_NO,USER_NO,USER_NAME";
    $cursor = exequery(TD::conn(),$query,$QUERY_MASTER);
    while($row = mysql_fetch_array($cursor))
    {
        $user_id       = $row["USER_ID"];
        $user_name     = $row["USER_NAME"];
        
        $op_str = $user_id ? $op_str."<option value=".$user_id.">".$user_name."</option>" : $op_str;
        $type = 1;
    }
}

$return_arr = array(
   "type" => $type,
   "op_str" => $op_str
);

echo json_encode(data2utf8($return_arr));
?>
       