<?
include_once ('inc/auth.inc.php');
include_once("inc/conn.php");
include_once("inc/header.inc.php");
include_once("inc/utility_file.php");
include_once("inc/mobile_seal/seal_write_data.php");
include_once("inc/flow_engine2.0/inc/engine/TFlowEngine.php");

ob_clean();

$FLOW_ID = intval($FLOW_ID);
$CHECK_FIELD_ARR = array();
$RUN_DATA = \engine\TFlowEngine::getRunData($FLOW_ID, $RUN_ID);
$ITEM = strtolower($ITEM);
$FIELD_STR = strtolower($FIELD);

if(is_array($RUN_DATA) && !empty($RUN_DATA))
{
   	 $SEAL_DATA = is_null($RUN_DATA[$FIELD_STR]) ? '' : $RUN_DATA[$FIELD_STR];
   
	 if($SEAL_DATA)
	 {  
		$sd = new TdWriteSeal($FLOW_ID,$RUN_ID,$ITEM,$SEAL_DATA);
		$sealPic = $sd->getpic();
	 }
}

//组织验证字段数组
$check_array = array();
$CHECK_FIELD = trim(strtolower($CHECK_FIELD), ",");
$CHECK_FIELD_ARR = explode(",", $CHECK_FIELD);
if(is_array($CHECK_FIELD_ARR) && !empty($CHECK_FIELD_ARR))
{
    foreach($CHECK_FIELD_ARR as $value)
    {
        $check_array[strtolower($value)] = is_null($RUN_DATA[strtolower($value)]) ? '' : $RUN_DATA[strtolower($value)];
    }
}

$valid = $sd->check_data_write($check_array);
$sd->flush_pic_t($valid);
?>