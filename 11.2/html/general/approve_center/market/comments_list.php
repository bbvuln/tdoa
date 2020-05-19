<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

$ret = array();
//����  ok
//$marketId = isset($_POST['market_id']) ? $_POST['market_id'] : '';
$marketId = isset($_POST['id']) ? $_POST['id'] : '';

$marketObj  = new modelMarket();
$comments = $marketObj->getModelCommentInfoByMarketId($marketId);
$data = array();
if(is_array($comments) && !empty($comments))
{
    foreach ($comments as $commentsInfo){
        $data[] = array(
            "id"      => $commentsInfo['id'], //����id
            "content" => $commentsInfo['comment_content'], //��������
            "grade"   => $commentsInfo['high_option'], //�������ǲ��� 0���� 1����
            "user"    => $commentsInfo['create_username'],  //������
            "company" => $commentsInfo['corp_name'], //��˾
            "reply_id"=> $commentsInfo['reply_id'],  //�Լ����� һ���� �ظ�ID
        );
    }
}
if(is_array($data) && !empty($data))
{
    $ret = array(
        "status" => "ok",
        "message"=> "�ɹ�",
        "data"   => $data
    );
}
else
{
    $ret = array(
        "status"  => "error",
        "message" => "ʧ��"
    );
}
return $ret;















?>