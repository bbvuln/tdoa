<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

$ret = array();
//评论  ok
//$marketId = isset($_POST['market_id']) ? $_POST['market_id'] : '';
$marketId = isset($_POST['id']) ? $_POST['id'] : '';

$marketObj  = new modelMarket();
$comments = $marketObj->getModelCommentInfoByMarketId($marketId);
$data = array();
if(is_array($comments) && !empty($comments))
{
    foreach ($comments as $commentsInfo){
        $data[] = array(
            "id"      => $commentsInfo['id'], //评论id
            "content" => $commentsInfo['comment_content'], //评论内容
            "grade"   => $commentsInfo['high_option'], //好评还是差评 0好评 1差评
            "user"    => $commentsInfo['create_username'],  //评论人
            "company" => $commentsInfo['corp_name'], //公司
            "reply_id"=> $commentsInfo['reply_id'],  //自己增加 一个的 回复ID
        );
    }
}
if(is_array($data) && !empty($data))
{
    $ret = array(
        "status" => "ok",
        "message"=> "成功",
        "data"   => $data
    );
}
else
{
    $ret = array(
        "status"  => "error",
        "message" => "失败"
    );
}
return $ret;















?>