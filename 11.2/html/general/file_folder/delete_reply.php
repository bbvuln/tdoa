<?
include_once("inc/auth.inc.php");
include_once("inc/utility_all.php");
if($_GET['COMMENT_ID']!="")
{
	$sql = "DELETE FROM file_comment WHERE COMMENT_ID = '{$_GET['COMMENT_ID']}'";
	exequery(TD::conn(),$sql);
}
echo "ok";
?>