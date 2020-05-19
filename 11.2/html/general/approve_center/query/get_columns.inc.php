<?
include_once("inc/auth.inc.php");
include_once("inc/utility_all.php");
include_once("inc/utility_flow.php");
include_once("../plugin/plugin.inc.php");

if(!$WIDTH)
    $WIDTH = 980;

$columns['EXT_FIELDS'] = 0;		//��չ�ֶ�
$cookieName = td_iconv($cookieName,"UTF-8", MYOA_CHARSET);
if($archive != 1){
	$columns['FIELDS'] = array(
	    array("label" => _("��ˮ��"), "name" => "RUN_ID", "width" => $_COOKIE[$cookieName."_RUN_ID_width"] ? $_COOKIE[$cookieName."_RUN_ID_width"] : 60, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_RUN_ID_hidden"] ? $_COOKIE[$cookieName."_RUN_ID_hidden"] : false),
	    array("label" => _("��������"), "name" => "FLOW_ID", "width" => $_COOKIE[$cookieName."_FLOW_ID_width"] ? $_COOKIE[$cookieName."_FLOW_ID_width"] : intval(($WIDTH-400)*0.2), "sortable" => true, "align" => "left","hidden" => $_COOKIE[$cookieName."_FLOW_ID_hidden"] ? $_COOKIE[$cookieName."_FLOW_ID_hidden"] : false),
	    array("label" => _("��������/�ĺ�"), "name" => "RUN_NAME", "width" => $_COOKIE[$cookieName."_RUN_NAME_width"] ? $_COOKIE[$cookieName."_RUN_NAME_width"] : intval(($WIDTH-400)*0.3), "sortable" => true, "align" => "left","hidden" => $_COOKIE[$cookieName."_RUN_NAME_hidden"] ? $_COOKIE[$cookieName."_RUN_NAME_hidden"] : false),
	    array("label" => _("��ʼʱ��"), "name" => "BEGIN_TIME", "width" => $_COOKIE[$cookieName."_BEGIN_TIME_width"] ? $_COOKIE[$cookieName."_BEGIN_TIME_width"] : 150, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_BEGIN_TIME_hidden"] ? $_COOKIE[$cookieName."_BEGIN_TIME_hidden"] : false),
	    array("label" => _("��������"), "name" => "ATTACH", "width" => $_COOKIE[$cookieName."_ATTACH_width"] ? $_COOKIE[$cookieName."_ATTACH_width"] : intval(($WIDTH-400)*0.15), "sortable" => false, "align" => "left","hidden" => $_COOKIE[$cookieName."_ATTACH_hidden"] ? $_COOKIE[$cookieName."_ATTACH_hidden"] : false),
	    array("label" => _("״̬"), "name" => "STATUS", "width" => $_COOKIE[$cookieName."_STATUS_width"] ? $_COOKIE[$cookieName."_STATUS_width"] : 80, "sortable" => false, "align" => "center","hidden" => $_COOKIE[$cookieName."_STATUS_hidden"] ? $_COOKIE[$cookieName."_STATUS_hidden"] : false)
	);
}else{
	$columns['FIELDS'] = array(
	    array("label" => _("��ˮ��"), "name" => "RUN_ID", "width" => $_COOKIE[$cookieName."_RUN_ID_width"] ? $_COOKIE[$cookieName."_RUN_ID_width"] : 60, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_RUN_ID_hidden"] ? $_COOKIE[$cookieName."_RUN_ID_hidden"] : false),
	    array("label" => _("��������"), "name" => "FLOW_ID", "width" => $_COOKIE[$cookieName."_FLOW_ID_width"] ? $_COOKIE[$cookieName."_FLOW_ID_width"] : intval(($WIDTH-400)*0.2), "sortable" => true, "align" => "left","hidden" => $_COOKIE[$cookieName."_FLOW_ID_hidden"] ? $_COOKIE[$cookieName."_FLOW_ID_hidden"] : false),
	    array("label" => _("��������/�ĺ�"), "name" => "RUN_NAME", "width" => $_COOKIE[$cookieName."_RUN_NAME_width"] ? $_COOKIE[$cookieName."_RUN_NAME_width"] : intval(($WIDTH-400)*0.3), "sortable" => true, "align" => "left","hidden" => $_COOKIE[$cookieName."_RUN_NAME_hidden"] ? $_COOKIE[$cookieName."_RUN_NAME_hidden"] : false),
	    array("label" => _("��ʼʱ��"), "name" => "BEGIN_TIME", "width" => $_COOKIE[$cookieName."_BEGIN_TIME_width"] ? $_COOKIE[$cookieName."_BEGIN_TIME_width"] : 150, "sortable" => true, "align" => "center","hidden" => $_COOKIE[$cookieName."_BEGIN_TIME_hidden"] ? $_COOKIE[$cookieName."_BEGIN_TIME_hidden"] : false),
	    array("label" => _("��������"), "name" => "ATTACH", "width" => $_COOKIE[$cookieName."_ATTACH_width"] ? $_COOKIE[$cookieName."_ATTACH_width"] : intval(($WIDTH-400)*0.15), "sortable" => false, "align" => "left","hidden" => $_COOKIE[$cookieName."_ATTACH_hidden"] ? $_COOKIE[$cookieName."_ATTACH_hidden"] : false)
	);
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
            $columns['FIELDS'][] = array("label" => $FIELD, "name" => $FIELD, "width" => $_COOKIE[$cookieName."_".$FIELD."_width"] ? $_COOKIE[$cookieName."_".$FIELD."_width"] : intval(($WIDTH-400)*0.1), "sortable" => true, "align" => "left","hidden" => $_COOKIE[$cookieName."_".$FIELD."_hidden"] ? $_COOKIE[$cookieName."_".$FIELD."_hidden"] : false);
        }
    }
}
$columns['FIELDS'][] = array("label" => _("����"), "name" => "OPRATION", "width" => 120, "sortable" => false, "align" => "left", "checkable" => false, "resizable" => false);
ob_end_clean();
header("Cache-Control: no-cache, must-revalidate" ); 
header("Pragma: no-cache" );
header("Content-type: text/x-json; charset=".MYOA_CHARSET);
echo array_to_json($columns);
?>