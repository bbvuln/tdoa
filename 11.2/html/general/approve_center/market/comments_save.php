<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

//���� ����  ok
$marketId  = isset($_POST['id']) ? $_POST['id'] : '';
$content   = isset($_POST['content']) ? $_POST['content'] : '';
$grade     = isset($_POST['grade']) ? $_POST['grade'] : '';
//��Ҫ����  ֵ
$is_system = isset($_POST['is_system']) ? $_POST['is_system'] : 0; //�ٷ� ռʱû�����  1��  0��
$reply_id  = isset($_POST['reply_id']) ? $_POST['reply_id'] : ''; //�Ƿ��ǻظ���   1 ��  0 ��
$corp_name = isset($_POST['corp_name']) ? $_POST['corp_name'] : ''; //��˾����

//$marketId = 3;
//$content  = "����һ��СС��ʯͷ";
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
        "message" => "�ɹ�",
        "data" => $comments
    );
}
else
{
    $ret = array(
        "status" => "error",
        "message" => "ʧ��"
    );
}
return $ret;






?>