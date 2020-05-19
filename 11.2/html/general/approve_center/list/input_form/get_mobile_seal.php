<?
include_once ('inc/auth.inc.php');
include_once("inc/conn.php");
include_once("inc/header.inc.php");
include_once("inc/utility_file.php");
include_once("inc/mobile_seal/seal_data.php");
include_once("inc/flow_engine2.0/inc/engine/TFlowEngine.php");

ob_clean();
$FLOW_ID = intval($FLOW_ID);
$tbl_name = "bpm_data_".$FLOW_ID;

$FIELD_STR = strtolower($FIELD);
// $CHECK_FIELD = strtolower(trim($CHECK_FIELD, ","));
$RUN_DATA = \engine\TFlowEngine::getRunData($FLOW_ID, $RUN_ID);
// if($CHECK_FIELD)
    // $FIELD_STR .= "," . $CHECK_FIELD;
// if($archive_time != '')
// {
    // $destDB = TD::$_arr_db_master['db_archive'];
    // $tbl_name = "$destDB.".$tbl_name.$archive_time;
// }
// $query = "select $FIELD_STR from $tbl_name WHERE RUN_ID='$RUN_ID'";
// $cursor= exequery(TD::conn(),$query);
// if($ROW=mysql_fetch_array($cursor))
if(is_array($RUN_DATA) && !empty($RUN_DATA))
{
    $SEAL_DATA=$RUN_DATA[$FIELD_STR];

    if($SEAL_DATA)
    {
        $SEAL_DATA = base64_decode($SEAL_DATA);
        $sd = new TDSealData($SEAL_DATA);
        $sealPic = $sd->get_pic();
    }
}

//组织验证字段数组
$check_array = array();
$CHECK_FIELD = strtolower(trim($CHECK_FIELD,","));
if($CHECK_FIELD != "")
{
    $TMP_CHECK_ARR = explode(",", $CHECK_FIELD);
    foreach ($TMP_CHECK_ARR as $key=>$val) {
        $check_array[strtolower($val)] = is_null($RUN_DATA[strtolower($val)]) ? '' : $RUN_DATA[strtolower($val)];
    }
}
if(!is_null($sd))
{
	$valid = $sd->check_data($check_array);
	$sd->flush_pic($valid);
}

/*
else 
{
 	switch($sealPic[0])
	{
    	case 2: $content_type = "image/jpg";break;
    	case 3: $content_type = "image/png";break;
    	case 6: $content_type = "image/bmp";break;
	}

	header("Content-Type: $content_type");
	echo $sealPic[1];
}
*/
?>