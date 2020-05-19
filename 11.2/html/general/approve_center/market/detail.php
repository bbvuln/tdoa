<?php
use market\modelMarket;
include_once("inc/auth.inc.php");
include_once("inc/market/modelMarket.class.php");

//����  ok
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
    //��ҳ-������-����ҵͨ�ñ�
    $ret = array(
        "status" => 'ok',
        "message"=> '�ɹ�',
        "data"   => array(
            "id"     => $marketInfo['id'],
            "icon"   => $marketInfo['attach_url'],
            "title"  => $marketInfo['market_name'],
            "count"  => $marketInfo['used_num'],
            "comment"=> $marketInfo['score_num'],
            "remark" => $marketInfo['market_desc'], //Ӧ�� ����
            "status" => $marketInfo['market_status'], //Ӧ��ʱδ���û��������� //0δ���� 1������
            "intro"  => $marketInfo['market_intro'], //Ӧ������ ???����ͨ      ģ�����
            //"func"   => "��������", //Ӧ�ù������� ����������ͨ       ��֪����ɶ�� ��
            "admin"  => $admin,//��ǰ�Ƿ��ǹ���Ա bool      $_SESSION['']���и��ֶ����ж� �ǲ��ǹ���Ա
            "corp_name" => $marketInfo['corp_name']
        )
    );
}
else
{
    $ret = array(
        "status" => 'error',
        "message" => 'ʧ��'
    );
}
return $ret;














?>