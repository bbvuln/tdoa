<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");
//��ҳ OK  ��Ҫ��  type ֵ  1-5
//                 limit_condition  array(0,9);  �ɴ� �ɲ��� ��Ϊ�����Ž�ȡ

//���ȡ������ȡ����   �ɴ����ɲ���
$limit_condition  = isset($_POST['limit_condition']) ? $_POST['limit_condition'] : array( );
//$type 1 ��Ʒ  2 ����  3 ��Ʒ  4����    5��ҵ    ��Ҫ���Ĳ���
$type = isset($_POST['type']) ? $_POST['type'] : 1;
//���� ��ȡһ������ ֵ�� �����ڻ�ȡ����
$one_level = isset($_POST['one-level']) ? $_POST['one-level'] : false;
// ��id  ��ȡ һ��    ���� ��ȡ����
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
//��ȡ��ҵ����
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

//��Ʒ�������Ƽ�����Ʒ����������
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
        "message" => "�ɹ�",
        "data"    => $data
    );
    return $ret;
}
else
{
    $ret = array(
        "status"  => "error",
        "message" => "ʧ��"
    );
    return $ret;
}


?>