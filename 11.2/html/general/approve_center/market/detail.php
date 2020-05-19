<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

//详情  ok
$id = isset($_POST['id']) ? $_POST['id'] : '';

$marketObj  = new modelMarket();
$marketInfo = $marketObj->getDetails($id);
if(is_array($marketInfo) && !empty($marketInfo))
{
    if($_SESSION['LOGIN_SYS_ADMIN'] == 1)
    {
        $admin = true;
    }else
    {
        $admin = false;
    }
    //首页-》更多-》行业通用表单
    $ret = array(
        "status" => 'ok',
        "message"=> '成功',
        "data"   => array(
            "id"     => $marketInfo['id'],
            "icon"   => $marketInfo['attach_url'],
            "title"  => $marketInfo['market_name'],
            "count"  => $marketInfo['used_num'],
            "comment"=> $marketInfo['score_num'],
            "remark" => $marketInfo['market_desc'], //应用 描述
            "status" => $marketInfo['market_status'], //应用时未启用还是已启用 //0未启用 1已启用
            "intro"  => $marketInfo['market_intro'], //应用描述 ???待沟通      模板介绍
            //"func"   => "巴拉巴拉", //应用功能描述 ？？？待沟通       不知道是啥是 的
            "admin"  => $admin,//当前是否是管理员 bool      $_SESSION['']中有个字段能判断 是不是管理员
            "corp_name" => $marketInfo['corp_name']
        )
    );
}
else
{
    $ret = array(
        "status" => 'error',
        "message" => '失败'
    );
}
return $ret;














?>