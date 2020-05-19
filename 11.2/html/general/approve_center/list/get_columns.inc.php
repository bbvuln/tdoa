<?
include_once("inc/auth.inc.php");
include_once("inc/utility_all.php");
include_once("inc/utility_flow.php");
include_once("../plugin/plugin.inc.php");

if(!$WIDTH)
    $WIDTH = 980;
$cookieName = td_iconv($cookieName,"UTF-8", MYOA_CHARSET);
$columns['EXT_FIELDS'] = 0;		//��չ�ֶ�
$columns['FIELDS'] = array(
    array("label" => _("��ˮ��"), "name" => "RUN_ID", "width" => $_COOKIE[$cookieName."_RUN_ID_width"] ? $_COOKIE[$cookieName."_RUN_ID_width"] : 60, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_RUN_ID_hidden"] ? $_COOKIE[$cookieName."_RUN_ID_hidden"] : false),
    array("label" => _("��������"), "name" => "FLOW_ID", "width" => $_COOKIE[$cookieName."_FLOW_ID_width"] ? $_COOKIE[$cookieName."_FLOW_ID_width"] : intval(($WIDTH-450)*0.2), "sortable" => true, "align" => "left","hidden" => $_COOKIE[$cookieName."_FLOW_ID_hidden"] ? $_COOKIE[$cookieName."_FLOW_ID_hidden"] : false),
    array("label" => _("��������/�ĺ�"), "name" => "RUN_NAME", "width" => $_COOKIE[$cookieName."_RUN_NAME_width"] ? $_COOKIE[$cookieName."_RUN_NAME_width"] : intval(($WIDTH-450)*0.4), "sortable" => true, "align" => "left","hidden" => $_COOKIE[$cookieName."_RUN_NAME_hidden"] ? $_COOKIE[$cookieName."_RUN_NAME_hidden"] : false),
    array("label" => _("������"), "name" => "FIRST_USER_NAME", "width" => $_COOKIE[$cookieName."_FIRST_USER_NAME_width"] ? $_COOKIE[$cookieName."_FIRST_USER_NAME_width"] : 80, "sortable" => false, "align" => "center","hidden" => $_COOKIE[$cookieName."_FIRST_USER_NAME_hidden"] ? $_COOKIE[$cookieName."_FIRST_USER_NAME_hidden"] : false), 
    array("label" => _("���輰����ͼ"), "name" => "PRCS_NAME", "width" => $_COOKIE[$cookieName."_PRCS_NAME_width"] ? $_COOKIE[$cookieName."_PRCS_NAME_width"] : intval(($WIDTH-450)*0.2), "sortable" => false, "align" => "left","hidden" => $_COOKIE[$cookieName."_PRCS_NAME_hidden"] ? $_COOKIE[$cookieName."_PRCS_NAME_hidden"] : false) 
);


if($TYPE==1){
	$columns['FIELDS'][] = array("label" => _("����ʱ��"), "name" => "CREATE_TIME", "width" => $_COOKIE[$cookieName."_CREATE_TIME_width"] ? $_COOKIE[$cookieName."_CREATE_TIME_width"] : 150, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_CREATE_TIME_hidden"] ? $_COOKIE[$cookieName."_CREATE_TIME_hidden"] : false);
}else if($TYPE==2 || $TYPE==6){
	$columns['FIELDS'][] = array("label" => _("����ʱ��"), "name" => "PRCS_TIME", "width" => $_COOKIE[$cookieName."_PRCS_TIME_width"] ? $_COOKIE[$cookieName."_PRCS_TIME_width"] : 150, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_PRCS_TIME_hidden"] ? $_COOKIE[$cookieName."_PRCS_TIME_hidden"] : false);
}else if($TYPE=="OVER"){
    $columns['FIELDS'][] = array("label" => _("���ʱ��"), "name" => "DELIVER_TIME", "width" => $_COOKIE[$cookieName."_DELIVER_TIME_width"] ? $_COOKIE[$cookieName."_DELIVER_TIME_width"] : 150, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_DELIVER_TIME_hidden"] ? $_COOKIE[$cookieName."_DELIVER_TIME_hidden"] : false);
    $columns['FIELDS'][] = array("label" => _("����״̬"), "name" => "FLOW_STATUS", "width" => $_COOKIE[$cookieName."_FLOW_STATUS_width"] ? $_COOKIE[$cookieName."_FLOW_STATUS_width"] : 80, "sortable" => false, "align" => "center","hidden" => $_COOKIE[$cookieName."_FLOW_STATUS_hidden"] ? $_COOKIE[$cookieName."_FLOW_STATUS_hidden"] : false);
}else if($TYPE=="ALL"){
    $columns['FIELDS'][] = array("label" => _("����״̬"), "name" => "PRCS_FLAG", "width" => $_COOKIE[$cookieName."_PRCS_FLAG_width"] ? $_COOKIE[$cookieName."_PRCS_FLAG_width"] : 80, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_PRCS_FLAG_hidden"] ? $_COOKIE[$cookieName."_PRCS_FLAG_hidden"] : false);
}

//��ȡ�б���չ�ֶ���Ϣ
if($FLOW_ID && $FLOW_ID != "all")
{
    $EXT_FIELDS = get_ext_fields($FLOW_ID);
    if($EXT_FIELDS)
    {
    	$columns['EXT_FIELDS'] = 1;
        foreach($EXT_FIELDS as $FIELD)
        {
            $columns['FIELDS'][] = array("label" => $FIELD, "name" => $FIELD, "width" => $_COOKIE[$cookieName."_".$FIELD."_width"] ? $_COOKIE[$cookieName."_".$FIELD."_width"] : intval(($WIDTH-400)*0.1), "sortable" => false, "align" => "center","hidden" => $_COOKIE[$cookieName."_".$FIELD."_hidden"] ? $_COOKIE[$cookieName."_".$FIELD."_hidden"] : false);
        }
    }
}
    
$columns['FIELDS'][] = array("label" => _("����"), "name" => "OPRATION", "width" => 180, "sortable" => false, "align" => "left", "checkable" => false, "resizable" => false);

ob_end_clean();
header("Cache-Control: no-cache, must-revalidate" ); 
header("Pragma: no-cache" );
header("Content-type: text/x-json; charset=".MYOA_CHARSET);
echo array_to_json($columns);
?>