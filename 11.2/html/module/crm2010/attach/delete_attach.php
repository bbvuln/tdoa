<?
include_once("general/crm/inc/header.php");
include_once("general/crm/inc/utility_file.php");
ob_start();

include_once("inc/header.inc.php");
?>

<body class="bodycolor">

<?
$contract_id = intval(strip_tags(addslashes($contract_id)));
if($contract_id != ""){
    $table = "crm_contract";
    $field_id = "contract_file";
    $field_name = "contract_file_name";
    $id = $contract_id;
    $module_name = "contract";
}
else if(!preg_match('/^[_0-9a-zA-Z]+$/', $table) || !preg_match('/^[_0-9a-zA-Z]+$/', $field_id) || !preg_match('/^[_0-9a-zA-Z]+$/', $field_name))
{
    exit;
}

$id = intval($id);
$query = "SELECT ".$field_id." AS ATTACHMENT_ID,".$field_name." AS ATTACHMENT_NAME FROM ".$table." WHERE id = '$id'";
$cursor=exequery(TD::conn(),$query);

$ATTACHMENT_NAME_OLD="";
if($ROW=mysql_fetch_array($cursor))
{
    $ATTACHMENT_ID_OLD=$ROW["ATTACHMENT_ID"];
    $ATTACHMENT_NAME_OLD=$ROW["ATTACHMENT_NAME"];
}

if($ATTACHMENT_NAME!="")
{
    crm_delete_attach($ATTACHMENT_ID,$ATTACHMENT_NAME,$module_name);

    $ATTACHMENT_ID_ARRAY=explode(",",$ATTACHMENT_ID_OLD);
    $ATTACHMENT_NAME_ARRAY=explode("*",$ATTACHMENT_NAME_OLD);

    $ARRAY_COUNT=sizeof($ATTACHMENT_ID_ARRAY);
    for($I=0;$I<$ARRAY_COUNT;$I++)
    {
        if($ATTACHMENT_ID_ARRAY[$I]==$ATTACHMENT_ID||$ATTACHMENT_ID_ARRAY[$I]=="")
            continue;
        $ATTACHMENT_ID1.=$ATTACHMENT_ID_ARRAY[$I].",";
        $ATTACHMENT_NAME1.=$ATTACHMENT_NAME_ARRAY[$I]."*";
    }
    $ATTACHMENT_ID=$ATTACHMENT_ID1;
    $ATTACHMENT_NAME=$ATTACHMENT_NAME1;

    $query="update ".$table." set ".$field_id."='$ATTACHMENT_ID',".$field_name."='$ATTACHMENT_NAME' where id='$id'";
    exequery(TD::conn(),$query);
}
?>

</body>
</html>
