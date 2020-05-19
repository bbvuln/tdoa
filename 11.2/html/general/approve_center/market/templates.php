<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");
//首页 OK  需要传  type 值  1-5
//                 limit_condition  array(0,9);  可传 可不传 ，为了热门截取

//想截取几个截取几个   可传，可不传
$limit_condition  = isset($_POST['limit_condition']) ? $_POST['limit_condition'] : array( );
//$type 1 精品  2 热门  3 新品  4排行    5行业    需要传的参数
$type = isset($_POST['type']) ? $_POST['type'] : 1;
//存在 获取一级分类 值， 不存在获取所有
$one_level = isset($_POST['one-level']) ? $_POST['one-level'] : false;
// 传id  获取 一条    不传 获取所有
$id = isset($_POST['id']) ? $_POST['id'] : '';

$type = 5;
$order_type = '';
$funcType = '';
$recommend_type = '';
switch($type)
{
    case 1:
        $recommend_type = 1;
        $key = "supreme";
        break;
    case 2:
        $recommend_type = 2;
        $key = "hot";
        break;
    case 3:
        $order_type = "create_time";
        $key = "newdata";
        break;
    case 4:
        $order_type = "used_num";
        $key = "rank";
        break;
    case 5:
        $key = "industries";
        break;
    default:
        return  $ret = array(
                    "status"  => "error",
                    "message" => "error type"
                 );
}
$marketObj  = new modelMarket();
$data["banners"] = array(
    "http://www.tongda2000.com/static/images/index/banner_ding.jpg"
);
//获取行业分类
if($type == 5)
{
    $sortInfo = $marketObj->getMarketSortTypeInfo(1 ,$id);

    if(is_array($sortInfo) && !empty($sortInfo))
    {
        foreach ($sortInfo as $sortValue)
        {
            $sortId = $sortValue['id'];
            $functional = $sortValue['functional_types'];
            $is_hot = $sortValue['is_hot'];
            if($one_level == false)
            {
                $marketInfo = $marketObj->getModelInfoByFuncType($sortId, $functional, $is_hot, $limit_condition);

                $funcList = array();

                if(is_array($marketInfo) && !empty($marketInfo))
                {
                    foreach ($marketInfo as $funcVal)
                    {
                        $funcList[] = array(
                            "id"     => $funcVal['id'],
                            "icon"   => $funcVal['attach_url'],
                            "title"  => $funcVal['market_name'],
                            "comment"=> $funcVal['score_num'],
                            "count"  => $funcVal['used_num'],
                            "remark" => $funcVal['market_intro']
                        );
                    }
                }
            }
            $data[$key][] = array(
                "id"   => $sortValue['id'],
                "title"=> $sortValue['sort_name'],
                "data" => $funcList
            );
        }
        return $data;
    }
}

//精品、热门推荐、新品、热门排行
$marketInfo = '';
if($type == 1 || $type == 2 || $type == 3 || $type == 4)
{
    $marketInfo = $marketObj->getModelList('', $recommend_type, $order_type, $limit_condition, $in_corp = false);
}
if(is_array($marketInfo) && !empty($marketInfo))
{
    foreach ($marketInfo as $value1)
    {
        $data[$key][] = array(
            "id"=> $value1['id'],
            "icon"=> $value1['attach_url'],
            "title"=>$value1['market_name'],
            "comment"=> $value1['score_num'],
            "count"=> $value1['used_num'],
            "remark"=> $value1['sort_name']
        );
    }
    $ret = array(
        "status"  => "ok",
        "message" => "成功",
        "data"    => $data
    );
    return $ret;
}
else
{
    $ret = array(
        "status"  => "error",
        "message" => "失败"
    );
    return $ret;
}


?>