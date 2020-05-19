<?php
include_once("inc/conn.php");
include_once("inc/db2.0/_bootstrap.php");
include_once("../header.php");
use app\modules\appdesign\models\AppUtils;

$loginUserId = $_SESSION['LOGIN_USER_ID'];
$loginUserName = $_SESSION['LOGIN_USER_NAME'];

if($sealProtectVal != '')
{
	$sealProtectVal = base64_encode($sealProtectVal);
}
$sealId = intval($sealId);
$query = "select SEAL_DATA from SEAL where ID='$sealId'";
$cursor = exequery(TD::conn(),$query);
if($row=mysql_fetch_array($cursor))
{
	$SEAL_DATA = $row['SEAL_DATA'];
	if($SEAL_DATA)
	{

		$SEAL_DATA = createTDWebSeal($sealCurName."_seal", "SIGN_POS_".$sealCurName,$sealProtectVal,0,0,$loginUserId."[".$loginUserName."]", "STRDATA:".$SEAL_DATA,$passWord,"");
		return json_encode(['res' => AppUtils::toUTF8($SEAL_DATA)]);
//		$query = "update bpm_data_{$FLOW_ID}_child set $sealCurItem='$SEAL_DATA' WHERE RUN_ID='$RUN_ID'";
//		exequery(TD::conn(),$query);
	}
}
?>