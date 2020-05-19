<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

//���� ��ȡһ������ ֵ�� �����ڻ�ȡ����
$one_level = isset($_POST['one-level']) ? $_POST['one-level'] : false;
// ��id  ��ȡ һ��    ���� ��ȡ����
$id = isset($_POST['id']) ? $_POST['id'] : '';
//$id = 1;
$limit_condition = isset($_POST['limit_condition']) ? $_POST['limit_condition'] : array( );
$order_type = isset($_POST['sortType'] ) ? $_POST['sortType'] : "";
if($order_type == "comment")
{
    $order_type = "score_num";
}
if($order_type == "publishtime")
{
    $order_type = "create_time";
}
$data = array();
$marketObj  = new modelMarket();
$sortInfo = $marketObj->getMarketSortTypeInfo(0, $id);

if(is_array($sortInfo) && !empty($sortInfo)) {
    $data = array();
    foreach ($sortInfo as $sortValue) {
        $sortId = $sortValue['id'];
        $sortName = $sortValue['sort_name'];
        $is_hot = $sortValue['is_hot'];
        if($one_level == false)
        {
            //ȡ  2������
            $marketObjList = $marketObj->getModelInfoByFuncType($sortId, $functional = '', $is_hot, $limit_condition, $order_type, $grade_type = 1);

            $func = array();
            if (is_array($marketObjList) && !empty($marketObjList)) {
                $functionalArr = array();
                foreach ($marketObjList as $marketInfo){

                    //ȡͬһ����ģ��
                    $functional = $marketInfo['functional_types'];
                    $ModelObj = $marketObj->getModelInfoByFuncType($sortId, $functional, $is_hot, $limit_condition, $order_type, $grade_type = 1);
                    $modelData = array();
                    if(is_array($ModelObj) && !empty($ModelObj))
                    {
                        foreach ($ModelObj as $ModelObjList)
                        {
                            $modelData[] = array(
                                "id"     => $ModelObjList['id'],
                                "icon"   => $ModelObjList['attach_url'],
                                "title"  => $ModelObjList['market_name'],
                                "comment"=> $ModelObjList['score_num'],
                                "count"  => $ModelObjList['used_num'],
                                "remark" => $ModelObjList['market_intro']
                            );
                        }
                    }

                    if(!in_array($marketInfo['functional_types'],$functionalArr))
                    {
                        $func[] = array(
                            "id" => $marketInfo['sort_id2'],
                            "title" => $marketInfo['sort_name2'],
                            "count" => count($modelData),
                            "data" => $modelData
                        );
                    }
                    $functionalArr[] = $marketInfo['functional_types'];
                }
            }
        }
        $data[] = array(
            "id" => $sortId,
            "title" => $sortName,
            "funcs" => $func
        );
    }
}

if(is_array($data) && !empty($data))
{
    $ret = array(
        "status"  => "ok",
        "message" => "�ɹ�",
        "data"    => $data
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





