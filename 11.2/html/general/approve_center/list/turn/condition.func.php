<?

include_once("inc/utility_all.php");
include_once("general/approve_center/list/export_flow.php");


if(!function_exists('send_webmail')) {
    function send_webmail($USER_STR, $SMS_CONTENT, $RUN_ID)
    {
        //内容
        $CONTENT = exportFlow($RUN_ID);
        $CONTENT = str_replace("\r\n", "", $CONTENT);
        $CONTENT = str_replace("\n", "", $CONTENT);

        $CONTENT = htmlspecialchars_decode($CONTENT);
        $CONTENT_STRIP = addslashes(strip_tags($CONTENT));

        //接收用户 $TO_WEBMAIL
        /*$query = "select USER_ID,EMAIL from USER WHERE find_in_set(USER_ID,'$USER_STR')";
        $cursor = exequery(TD::conn(), $query);
        while ($ROW = mysql_fetch_array($cursor)) {
            $USER_ID = $ROW ["USER_ID"];
            if ($USER_ID == $_SESSION["LOGIN_USER_ID"])
                continue;
            $TO_EMAIL = $ROW ["EMAIL"];
            if ($TO_EMAIL == "") {
                $query1 = "select EMAIL from WEBMAIL WHERE USER_ID='$USER_ID' limit 1";
                $cursor1 = exequery(TD::conn(), $query1);
                if ($ROW1 = mysql_fetch_array($cursor))
                    $TO_EMAIL = $ROW ["EMAIL"];
            }
            $TO_WEBMAIL .= $TO_EMAIL . ",";
        }*/
		//系统邮箱判断
		$arr_para = get_sys_para ( "BPM_SYS_EMAIL" );
		while ( list ( $para_name, $para_value ) = each ( $arr_para ) )
		{
			$$para_name = $para_value;
		}
		$arr_sys_email = unserialize (base64_decode($BPM_SYS_EMAIL ));
		$USE_SYS_EMAIL = $arr_sys_email['USE_SYS_EMAIL'];//0-内部邮箱，1-系统邮箱
		if($USE_SYS_EMAIL == 1)//系统邮箱发送
		{
			$SIZE=0;
			$ATTACHMENT_ID = '';
			$ATTACHMENT_NAME = '';
			// if($ATTACHMENT_ID!="" && $ATTACHMENT_NAME!="")
            // {
                // $ATTACHMENT_ID=copy_attach($ATTACHMENT_ID,$ATTACHMENT_NAME,"","email",true);
                // if($ATTACHMENT_ID!="")
                // {
                    // $ATTACHMENT_ID.=",";
                // }
                // $ATTACHMENT_ID_ARRAY=explode(",",$ATTACHMENT_ID);
                // $ATTACHMENT_NAME_ARRAY=explode("*",$ATTACHMENT_NAME);
                // for($I=0;$I<sizeof($ATTACHMENT_ID_ARRAY)-1;$I++)
                // {
                    // $SIZE+=attach_size($ATTACHMENT_ID_ARRAY[$I],$ATTACHMENT_NAME_ARRAY[$I]);
                // }
            // }
			$TO_WEBMAIL = '';
			$SEND_TIME = time();
			$COMPRESS_CONTENT = bin2hex(gzcompress($CONTENT));
            $query = "SELECT * from WEBMAIL where TYPE_FLAG = 1";
            $cursor = exequery(TD::conn(), $query);
            if ($ROW = mysql_fetch_array($cursor)) 
			{
                $EMAIL = $ROW ["EMAIL"];
                $FROM_WEBMAIL_ID = $ROW ["MAIL_ID"];
            }
			if($USER_STR != '')
			{
				$userArr = explode(",",$USER_STR);
				foreach($userArr as $user)
				{
					if($user == '')
						continue;
					$EMAIL1=GetUserInfoByUID(UserId2Uid($user),"EMAIL");
					if($EMAIL1!="")
					{
						$EMAIL_STR.=$EMAIL1.",";
					}
				}
				$TO_WEBMAIL = rtrim($EMAIL_STR,",");
			}
            if($EMAIL && $TO_WEBMAIL != '') 
			{
                $query = "INSERT INTO EMAIL_BODY(FROM_ID,TO_ID2,COPY_TO_ID,SECRET_TO_ID,SUBJECT,CONTENT,SEND_TIME,ATTACHMENT_ID,ATTACHMENT_NAME,SEND_FLAG,SMS_REMIND,IMPORTANT,SIZE,FROM_WEBMAIL_ID,FROM_WEBMAIL,TO_WEBMAIL,COMPRESS_CONTENT,WEBMAIL_CONTENT,IS_WEBMAIL,IS_WF) values ('" . $_SESSION["LOGIN_USER_ID"] . "','".$USER_STR."','','','$SMS_CONTENT','$CONTENT_STRIP','$SEND_TIME','".$ATTACHMENT_ID."','".$ATTACHMENT_NAME."','1','1','','0','$FROM_WEBMAIL_ID','$EMAIL','$TO_WEBMAIL',0x$COMPRESS_CONTENT,compress('" . addslashes($CONTENT) . "'),'1','0')";
                exequery(TD::conn(), $query);
                $BODY_ID_FW = mysql_insert_id();
                proxy_mail("1", $BODY_ID_FW, '');
                $queryw = "insert into EMAIL(TO_ID,READ_FLAG,DELETE_FLAG,BODY_ID,RECEIPT) values ('__WEBMAIL__$BODY_ID_FW','0','0','$BODY_ID_FW','0')";
                exequery(TD::conn(), $queryw);
            }
		}else//内部邮箱发送
		{
			$SIZE = 0;
			$ATTACHMENT_ID = '';
			$ATTACHMENT_NAME = '';
			// if($ATTACHMENT_ID!="" && $ATTACHMENT_NAME!="")
            // {
                // $ATTACHMENT_ID=copy_attach($ATTACHMENT_ID,$ATTACHMENT_NAME,"","email",true);
                // if($ATTACHMENT_ID!="")
                // {
                    // $ATTACHMENT_ID.=",";
                // }
                // $ATTACHMENT_ID_ARRAY=explode(",",$ATTACHMENT_ID);
                // $ATTACHMENT_NAME_ARRAY=explode("*",$ATTACHMENT_NAME);
                // for($I=0;$I<sizeof($ATTACHMENT_ID_ARRAY)-1;$I++)
                // {
                    // $SIZE+=attach_size($ATTACHMENT_ID_ARRAY[$I],$ATTACHMENT_NAME_ARRAY[$I]);
                // }
            // }
			$COMPRESS_CONTENT = bin2hex(gzcompress($CONTENT));
			$SEND_TIME = time();
			$query = "INSERT INTO EMAIL_BODY(FROM_ID,TO_ID2,COPY_TO_ID,SECRET_TO_ID,SUBJECT,CONTENT,SEND_TIME,ATTACHMENT_ID,ATTACHMENT_NAME,SEND_FLAG,SMS_REMIND,IMPORTANT,SIZE,FROM_WEBMAIL_ID,FROM_WEBMAIL,TO_WEBMAIL,COMPRESS_CONTENT,WEBMAIL_CONTENT,IS_WEBMAIL,IS_WF) values ('" . $_SESSION["LOGIN_USER_ID"] . "','".$USER_STR."','','','$SMS_CONTENT','$CONTENT_STRIP','$SEND_TIME','".$ATTACHMENT_ID."','".$ATTACHMENT_NAME."','1','1','','".$SIZE."','','','',0x$COMPRESS_CONTENT,compress('" . addslashes($CONTENT) . "'),'0','0')";
			exequery(TD::conn(), $query);
			$BODY_ID_FW = mysql_insert_id();
			proxy_mail("1", $BODY_ID_FW, '');
			$userArr = explode(',',rtrim($USER_STR,','));
			if(!empty($userArr))
			{
				foreach($userArr as $emailUser)
				{
					$queryw = "insert into EMAIL(TO_ID,READ_FLAG,DELETE_FLAG,BODY_ID,RECEIPT) values ('$emailUser','0','0','$BODY_ID_FW','0')";
					exequery(TD::conn(), $queryw);
				}
			}
		}
    }
}
?>