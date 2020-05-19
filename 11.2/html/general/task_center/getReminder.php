<?
include_once("inc/auth.inc.php");
include_once("inc/session.php");
include_once("inc/utility_all.php");

session_start();
ob_start();

ob_end_clean();

$CUR_TIME=date("Y-m-d H:i:s",time());
$CUR_DATE=date("Y-m-d",time());
$OUT_HTML="";
$RETURN_STR="";
$REMIND_ARRAY = array();
//提醒事项 edit tl 2014-08-08
$query="SELECT * FROM reminders WHERE STATUS=0 AND USER_ID = '".$_SESSION["LOGIN_USER_ID"]."' ORDER BY ID DESC";
$cursor= exequery(TD::conn(),$query);
$count=mysql_num_rows($cursor);
while($ROW=mysql_fetch_array($cursor))
{
	$ID           = $ROW['ID'];
	$APPOINT_TIME = $ROW['APPOINT_TIME'];
	$TYPE         = $ROW['TYPE'];
	$REMIND_DATE  = $ROW['REMIND_DATE'];
	$REMIND_TIME  = $ROW['REMIND_TIME'];
	$TITLE        = $ROW['TITLE'];
	$CONTENT      = $ROW['CONTENT'];
	$ADD_TIME     = $ROW['ADD_TIME'];
	$CLASSIFY     = $ROW['CLASSIFY'];
	
	if(strlen($TITLE) > 74)
	{
		$TITLE = csubstr($TITLE, 0, 74)."...";
	}
	//判断今天是否提醒
    if (($TYPE=="2"&& strtotime(date("Y-m-d",$APPOINT_TIME))<=strtotime($CUR_DATE))
        ||($TYPE=="3" && $REMIND_DATE==date("w",time()))
        ||($TYPE=="4" && $REMIND_DATE==date("d",time()))
        ||($TYPE=="5" && $REMIND_DATE==date("m-d",time()))
        ||($TYPE=="6" && strtotime(date("Y-m-d",$APPOINT_TIME))<=strtotime($CUR_DATE) && date("w")!=6 && date("w")!=0)
        ||($TYPE=="" && strtotime(date("Y-m-d",$APPOINT_TIME))==strtotime($CUR_DATE))){


        //file_put_contents("a.txt",$APPOINT_TIME);
        $REMIND_ARRAY[] = array(
            'id' => $ID,
            'appoint_time' => date("H:i",$APPOINT_TIME),
            'type' => $TYPE,
            'remind_date' => $REMIND_DATE,
            'remind_time' => $REMIND_TIME,
            'title' => $TITLE,
            'content' => $CONTENT,
            'add_time' => $ADD_TIME,
            'classify' => $CLASSIFY     
        );
    }
}

retJson($REMIND_ARRAY);
?>
