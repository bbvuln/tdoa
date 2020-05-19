<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

//评论 保存  ok
$marketId  = isset($_POST['id']) ? $_POST['id'] : '';
$content   = isset($_POST['content']) ? $_POST['content'] : '';
$grade     = isset($_POST['grade']) ? $_POST['grade'] : '';
//需要传的  值
$is_system = isset($_POST['is_system']) ? $_POST['is_system'] : 0; //官方 占时没有这个  1是  0否
$reply_id  = isset($_POST['reply_id']) ? $_POST['reply_id'] : ''; //是否是回复的   1 是  0 否
$corp_name = isset($_POST['corp_name']) ? $_POST['corp_name'] : ''; //公司名称

//$marketId = 3;
//$content  = "我是一颗小小的石头";
//$grade    =  1;

$marketObj  = new modelMarket();
$postData = array(
    "comment_content" => $content,
    "reply_id"  => $reply_id,
    "corp_name" =>  $corp_name
);
$comments = $marketObj->setComment($marketId, $grade, $postData = array(), $is_system);
if($comments > 0)
{
    $ret = array(
        "status" => "ok",
        "message" => "成功",
        "data" => $comments
    );
}
else
{
    $ret = array(
        "status" => "error",
        "message" => "失败"
    );
}
return $ret;






?>