<?
include_once("inc/auth.inc.php");
include_once("inc/interface/message.init.funcs.php");
$Message = new InitMessage();
$Message->init_strtolower();
echo "+OK";
?>