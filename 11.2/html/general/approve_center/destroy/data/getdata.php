<?
//销毁工作
include_once("inc/auth.inc.php");
include_once("inc/utility_file.php");
include_once("inc/flow_engine2.0/inc/data/GetDestroy.class.php");
$destroy = new GetDestroy();

//分页 处理
$rows=isset($_POST['rows']) ? $_POST['rows'] : 10;;
$page=isset($_POST['page']) ? $_POST['page'] : 1;
$sidx=isset($_POST['sidx']) ? $_POST['sidx'] : "RUN_ID";
$sord=isset($_POST['sord']) ? $_POST['sord'] : "desc";
$destroy->_set("flow_id", $_GET["flow_id"]);
$destroy->_set("run_id", $_GET["run_id"]);
$destroy->_set("run_name", $_GET["run_name"]);
$destroy->_set("user_id", $_GET["user_id"]);
$destroy->_set("begin_time_from", $_GET["begin_time"]);
$destroy->_set("begin_time_to", $_GET["end_time"]);
$destroy->_set("order_field", $sidx);
$destroy->_set("order_directory", $sord);
$destroy->_set("start_pos", ($page-1)*$rows);
$destroy->_set("row_count", $rows);
$obj_list = $destroy->getList();
$total_number = $destroy->getCount();
if ($page >1)
{
    if (empty($obj_list) && $total_number != 0)
    {
        $page = ceil($total_number/$rows);
        $destroy->_set("start_pos", ($page-1)*$rows);
        $obj_list = $destroy->getList();
        $total_number = $destroy->getCount();
    }
}
foreach($obj_list as $key => $des_obj)
{
    $run_id=$des_obj["RUN_ID"];
    $flow_id = $des_obj["FLOW_ID"];
    $q_run_name = cstr_replace("\\","\\\\",replace_tab2blank($des_obj["RUN_NAME"]));
    $run_name = "<a href=javascript:view_work(\"\",\"$run_id\",\"\",\"$flow_id\",1,1); title=\"$q_run_name\">$q_run_name</a>";
    $begin_users = $des_obj["BEGIN_USER"];
    $begin_time = $des_obj["BEGIN_TIME"];
    $del_time = $des_obj["DEL_TIME"];
    $accachment_id = $des_obj["ATTACHMENT_ID"];
    $accachment_name = $des_obj["ATTACHMENT_NAME"];
    if($accachment_id==""){
        $attach= "";
    }else {
        //检查office文档下载打印权限
        $DOWN_PRIV_OFFICE=1;/*考虑利用缓存后重新编写，且原判断不正确，暂时去掉附件下载权限判断 edit by ts 2012-7-2*/
        $attach = attach_link($accachment_id,$accachment_name,0,1,$DOWN_PRIV_OFFICE,0,0,1,1,0,"");
        $attach = str_replace('onmouseover="showMenu(this.id);"', 'onmouseover="showMenuWorkflow(this.id,1);"', $attach);
        $attach = str_replace('<span', '<span style="display:block;"', $attach);
    }
    //操作
    $begin_user_name = GetUserInfoByUID(UserId2Uid($begin_users),"USER_NAME");
    $s_operation = _("<a href="."\""."#"."\""."onclick="."view_graph($flow_id)".">"."流程图"."</a>&nbsp;");
    $s_operation .= "<a href="."\""."#"."\""."onclick="."doDestroyBatch_one($run_id)".">"."销毁"."</a>&nbsp;";
    $s_operation .= _("<a href="."\""."#"."\""."onclick="."doRestorationBatch_one($run_id)".">"."还原"."</a>&nbsp;");
    $LogsItem = array(
        $run_id,
        $run_name,
        $del_time,
        $attach,
        $s_operation
    );
    $result["rows"][] = array("id" => $run_id ,"cell" => $LogsItem);
}
//分页
$result['records'] = $total_number; //总记录数
$result['page'] = $page; //当前页
$result['total'] = (integer)(($result['records']-1)/$rows)+1; //总页数
ob_end_clean();
header("Cache-Control: no-cache, must-revalidate" );
header("Pragma: no-cache" );
header("Content-type: text/x-json; charset=$MYOA_CHARSET");
echo array_to_json($result);

?>