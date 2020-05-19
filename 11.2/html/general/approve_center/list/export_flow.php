<?
use \engine\TFlowEngine;
use \tform\view\TWorkView;
use \common\Common;

include_once("inc/flow_engine2.0/inc/engine/TFlowEngine.php");
include_once("inc/flow_engine2.0/inc/common/Common.php");
include_once("inc/flow_engine2.0/inc/tform/TWorkView.class.php");

function exportFlow($RUN_ID,$FLOW_VIEW="123",$archive_time="")
{
  if($archive_time){
		$use_databases = "td_oa_archive.";
	}else{
		$use_databases = "";
	}

  $query = "SELECT * from ".$use_databases."BPM_RUN".$archive_time." WHERE RUN_ID='$RUN_ID'";
  $cursor= exequery(TD::conn(),$query);
  if($ROW=mysql_fetch_array($cursor))
  {
     $FLOW_ID=$ROW["FLOW_ID"];
     $RUN_NAME=$ROW["RUN_NAME"];
     $ATTACHMENT_ID=$ROW["ATTACHMENT_ID"];
     $ATTACHMENT_NAME=$ROW["ATTACHMENT_NAME"];
  }

  $query = "SELECT * from ".$use_databases."BPM_TYPE".$archive_time." WHERE FLOW_ID='$FLOW_ID'";
  $cursor1= exequery(TD::conn(),$query);
  if($ROW=mysql_fetch_array($cursor1))
  {
     $FLOW_NAME=$ROW["FLOW_NAME"];
     $FLOW_TYPE=$ROW["FLOW_TYPE"];
     $FORM_ID=$ROW["FORM_ID"];
     $FORM_TYPE=$ROW["FORM_TYPE"];
     $FLOW_DOC=$ROW["FLOW_DOC"];
     $AUTO_NUM = $ROW["AUTO_NUM"];
  }

    $query = "SELECT * from ".$use_databases."BPM_FORM_TYPE".$archive_time." WHERE FORM_ID='$FORM_ID'";
    $cursor1= exequery(TD::conn(),$query);
    if($ROW=mysql_fetch_array($cursor1))
    {
        $FORM_NAME=$ROW["FORM_NAME"];
        $PRINT_MODEL=$ROW["PRINT_MODEL_SHORT"];

        $SCRIPT = $ROW["SCRIPT"];
        $CSS = $ROW["CSS"];
    }
    $flag_hidden_type = 1;
    $role_str = TFlowEngine::getWorkRunPrivStr($RUN_ID);
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
    if(find_id($role_str, 1) || find_id($role_str, 3) || find_id($role_str, 5)
        || find_id($role_str, 9) || find_id($role_str, 10) || find_id($role_str, 11))
    {
        //系统管理员、查询、管理、监控、点评、编辑权限人可以看所有字段
        $file_priv = 1;
        $list_priv = 1;
        $flag_hidden_type = 0;

    }else if(find_id($role_str, 2) || find_id($role_str, 4) || find_id($role_str, 6))
    {
        //主办、经办、原始委托人可以查看其办理的最后一步流程步骤的所有字段
        $flag_hidden_type = 1;

    }else if(find_id($role_str, 8) || find_id($role_str, 7))
    {
        //传阅人或者父、子流程权限所有人，所有步骤的保密字段
        $flag_hidden_type = 2;
        $query = "SELECT END_TIME from ".$use_databases."BPM_RUN".$archive_time." WHERE RUN_ID='$RUN_ID'";
        $cursor= exequery(TD::conn(), $query);
        if($ROW=mysql_fetch_array($cursor))
        {
            $END_TIME = $ROW['END_TIME'];
        }
        if(find_id($role_str, 8) && $END_TIME != ''){
            $file_priv = 1;
        }else{
            $file_priv = 0;
        }
    }

    //获取保密字段
    if($flag_hidden_type == 0)
    {
        $secret_fields = "";

    }else if($flag_hidden_type == 1)
    {
        //获得设计步骤号
        if($FLOW_PRCS == '')
        {
            $query = "select FLOW_PRCS from  bpm_run_prcs where RUN_ID = '".$RUN_ID."' and PRCS_ID = '".$PRCS_ID."' and user_id = '".$_SESSION['LOGIN_USER_ID']."' limit 1";
            $cursor = exequery(TD::conn(),$query);
            if($row = mysql_fetch_array($cursor))
            {
                $FLOW_PRCS = $row['FLOW_PRCS'];
            }
        }
        $prcsInfo = TFlowEngine::getFlowPrcsInfo($FLOW_ID,$FLOW_PRCS);
        $secret_fields = $prcsInfo["HIDDEN_ITEM"];
        $LIST_PRIV_ARR[] = $prcsInfo["LIST_COLUMN_PRIV"];

    }else if($flag_hidden_type == 2)
    {
        //获得流程所有步骤的保密字段
        $table_flow_prcocess = $use_databases."bpm_process".$archive_time;
        $secret_fields = "";
        $query = "select HIDDEN_ITEM,LIST_COLUMN_PRIV from ".$table_flow_prcocess." where FLOW_ID = '".$FLOW_ID."' ";
        $cursor = exequery(TD::conn(),$query);
        while($row = mysql_fetch_array($cursor))
        {
            $secret_fields .= $row['HIDDEN_ITEM'].",";
            if($row["LIST_COLUMN_PRIV"] != "" || $row["LIST_COLUMN_PRIV"] != NULL)
            {
                $LIST_COLUMN_PRIV = unserialize($row["LIST_COLUMN_PRIV"]);
                if(empty($LIST_COLUMN_PRIV))
                    continue;
                $LIST_PRIV_ARR[] = $LIST_COLUMN_PRIV;
            }
        }

        //去掉重复的
        $secret_fields = td_trim($secret_fields);
        $secret_fields = Common::strRemoveDup($secret_fields);
    }

    $config = Array(
        'db' => $use_databases,
        'archive_time' => $archive_time,
        'secret_fields' => $secret_fields,
        'file_priv' => $file_priv,
        'list_priv' => $list_priv,
        'list_priv_arr' => $LIST_PRIV_ARR
    );


    if(!empty($FLOW_AUTO_NUM)){
		$AUTO_NUM = $FLOW_AUTO_NUM;
	}

	//-----表单-----
    if(strstr($FLOW_VIEW,"1"))
    {
		$config['emailShare'] = 1;
        $output = "";
        //输出表单
        $obj_work_view =  new TWorkView($FLOW_ID, $RUN_ID, intval($FLOW_PRCS), intval($PRCS_ID), intval($PRCS_KEY_ID), $config);
        $html = $obj_work_view->getViewHtml(null,$secret_fields,null);
        $output .= $html."<br/>";

    }


    //----- 会签 -----
    if(strstr($FLOW_VIEW,"3"))
    {
		$config['emailShare'] = 0;
        echo "<br>";
        if($obj_work_view == NULL || gettype($obj_work_view) != "object" || get_class($obj_work_view) != "TWorkView")
        {
            $obj_work_view =  new TWorkView($FLOW_ID, $RUN_ID,intval($FLOW_PRCS), intval($PRCS_ID), intval($PRCS_KEY_ID), $config);
        }
        $html = $obj_work_view->getSignHtml($_SESSION["LOGIN_USER_ID"],$PRCS_ID,$FLOW_PRCS);
        $output .= $html."<br/>";

    }


    return '<form name="form1" method="post" action="">'.$output.'</form>';
}


?>