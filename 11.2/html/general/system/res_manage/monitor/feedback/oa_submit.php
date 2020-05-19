<?
include_once("inc/auth.inc.php");
include_once("inc/session.php");

session_start();
ob_start();
include_once("inc/utility.php");

while(list($KEY, $VALUE) = each($_POST))
   $$KEY = $VALUE;

echo '<body bgcolor="#919BA3">';

if($_SESSION["SESS_VALID_CODE"]=="" || crypt($_POST["VALID_CODE"],$_SESSION["SESS_VALID_CODE"])!=$_SESSION["SESS_VALID_CODE"])
{
   Message(_("错误"), _("验证码错误"));
   Button_Back();
   exit;
}
unset($_SESSION["SESS_VALID_CODE"]);
session_write_close();

include_once("inc/conn.php");
include_once("inc/config.inc.php");
include_once("inc/utility_file.php");

if(count($_FILES)>1)
{
   $ATTACHMENTS=upload_new("oa_feedback");
   $CONTENT=ReplaceImageSrc($CONTENT, $ATTACHMENTS,"oa_feedback");

   $ATTACH_ID=$ATTACHMENTS["ID"];
   $ATTACH_NAME=$ATTACHMENTS["NAME"];
}

$sql = "insert into FEEDBACK.OA_FEEDBACK (LINKMAN,EMAIL,MOBILE,TEL,QQ,MSN,TYPE,VERSION,REG_NO,UNIT_NAME,ATTACH_ID,ATTACH_NAME,CONTENT,SUBMIT_TIME)
        values ('$LINKMAN','$EMAIL','$MOBILE','$TEL','$QQ','$MSN','$TYPE','$VERSION','$REG_NO','$UNIT_NAME','$ATTACH_ID','$ATTACH_NAME','$CONTENT','".date("Y-m-d H:i:s")."')";
exequery(TD::conn(), $sql);

Message(_("提示"), _("问题提交成功，我们会尽快与您联系。"));
Button_Back();
?>