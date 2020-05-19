<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

$mark_name  = isset($_POST['mark_name']) ? $_POST['mark_name'] : '';
$marketObj  = new modelMarket();
$marketInfo = array();
if(!empty($mark_name))
{
    $marketInfo = $marketObj->getModelInfoByFuncType($sort_id = '', $functional = '', $is_hot = '',  $limit_condition = array(), $order_type = '', $grade_type = '', $mark_name);
}
if(is_array($marketInfo) && !empty($marketInfo))
{
    $ret = array(
        "status"  => "ok",
        "message" => "³É¹¦",
        "data"    => $marketInfo
    );
}
else
{
    $ret = array(
        "status" => "error",
        "message"=> "Ê§°Ü"
    );
}
return $ret;








?>