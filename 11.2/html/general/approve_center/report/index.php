<?
include_once("inc/auth.inc.php");
function MBunserialize($serial_str)
{
    // $serial_str= preg_replace('!s:(\d+):"(.*?)";!se', "'s:'.strlen('$2').':\"$2\";'", $serial_str );
    $serial_str = preg_replace_callback('!s:(\d+):"(.*?)";!s', function($match){return 's:'.strlen($match['2']).':"'.$match['2'] . '";';}, $serial_str);
    $serial_str= str_replace("\r", "", $serial_str);
    return unserialize($serial_str);
}
if($_GET['link_type'] == 'rep')
{
    $rep_data = $_GET;
    $rep_data = serialize($rep_data);
    $rep_data = td_iconv($rep_data,'GB2312','UTF-8');
    $rep_data = MBunserialize($rep_data);
    $rep_data = json_encode($rep_data);
} else if(!empty($_GET))
{
    $rep_data = json_encode($_GET);
} else {
    $rep_data = json_encode(array());
}
?>
<!DOCTYPE html>
<html>
    <head>
        <title>我的报表</title>
        <meta http-equiv="Content-Type" content="text/html; charset=gbk" />
        <meta name="renderer" content="ie-stand">
        <meta http-equiv="X-UA-Compatible" content="IE=10,chrome=1" />
    	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
	    <script src="/static/js/jquery-1.10.2/jquery.min.js"></script>
		<script src="/static/js/module.js"></script>
        <link href="/static/js/antd/2.12.8/antd.css?20190313" rel="stylesheet">
        <link href="/static/js/antd/2.12.8/antd.ie9.css?20190313" rel="stylesheet">
        <link href="/static/js/antd/2.10.0/td.react.2.0.css" rel="stylesheet">
		<script src="/static/js/jquery-1.10.2/jquery-ui/js/jquery-ui-1.10.3.custom.min.js"></script>
		<link href="/static/modules/appbuilder/report/detail/handsontable.css" rel="stylesheet">
        <link href="/static/modules/appbuilder/report/myrep/tdcomponents.css?180117" rel="stylesheet">
        <script>
            var repGetDatas =  <? echo $rep_data?>;
        </script>
    </head>

    <body>
        <div id="root"></div>
    <!--[if lt IE 10]>
		<script src="/static/js/es5-shim.js"></script>
	<![endif]-->
	<script src="/static/js/babel-polyfill/polyfill.js"></script>
    <script type="text/javascript" src="./js/vendor.gbk.js?2221eb5854f0003094961ec"></script>
    <script type="text/javascript" src="./js/bundle.gbk.js?2221eb5854f0003094961ec"></script>
    </body>
</html>
