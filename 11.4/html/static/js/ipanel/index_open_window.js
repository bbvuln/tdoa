function openURL(URL,open_window,is_menu)
{
   var mytop=(screen.availHeight-500)/2-30;
   var myleft=(screen.availWidth-780)/2;
   var d = new Date();
//   if(is_menu!=1 || open_window)
      window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+escape(URL),d.getTime(),"height=548,width=780,status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+mytop+",left="+myleft+",resizable=yes");
//   else
//      window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+escape('nav.php?URL='+encodeURIComponent(URL)),d.getTime(),"height=548,width=780,status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+mytop+",left="+myleft+",resizable=yes");
}
function send_sms(TO_UID,TO_NAME)
{
   var mytop=(screen.availHeight-350)/2;
   var myleft=(screen.availWidth-430)/2;
   var d = new Date();
   var URL="/general/status_bar/sms_back.php@I_VER=" + i_ver + "*TO_UID="+TO_UID+"*TO_NAME="+escape(TO_NAME);
   window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+URL,d.getTime(),"height=310,width=450,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function group_send_sms(TO_UID,TO_NAME)
{
   var mytop=(screen.availHeight-350)/2;
   var myleft=(screen.availWidth-430)/2;
   var d = new Date();
   var URL="/general/status_bar/sms_back.php@I_VER=" + i_ver + "*TO_UID="+TO_UID+"*TO_NAME="+escape(TO_NAME)+"&C=Web";
   window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+URL,d.getTime(),"height=310,width=450,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function send_sms1(MSG_ID)
{

   var mytop=(screen.availHeight-350)/2;
   var myleft=(screen.availWidth-430)/2;
   var d = new Date();
   var URL="/general/status_bar/sms_back.php@I_VER=" + i_ver + "*MSG_ID="+MSG_ID+"*MSG_FW=1";
   window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+URL,d.getTime(),"height=310,width=450,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function send_email(TO_ID,TO_NAME)
{
   var mytop=(screen.availHeight-500)/2-30;
   var myleft=(screen.availWidth-780)/2;
   var URL="/general/email/new@TO_ID="+TO_ID+"*TO_NAME="+TO_NAME;
   openURL(URL);
}
function send_email1(TO_UID,TO_NAME)
{
   var mytop=(screen.availHeight-500)/2-30;
   var myleft=(screen.availWidth-780)/2;
   var URL="/general/email/new@ISPIRIT=1&TO_UID="+TO_UID+"*TO_NAME="+TO_NAME;
   openURL(URL);
}

function history_sms(MSG_ID)
{
   mytop=(screen.availHeight-310)/2-85;
   myleft=(screen.availWidth-350)/2;
   URL="/general/sms/msg_center/history_sms.php@I_VER=" + i_ver + "*MSG_ID="+MSG_ID;
   window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+URL,MSG_ID,"height=310,width=370,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}

function check_personinfo(UID,USER_ID)
{
   mytop=(screen.availHeight-600)/2-85;
   myleft=(screen.availWidth-700)/2;
   URL="/general/ipanel/user/person.php@I_VER=" + i_ver + "*UID="+UID+"*USER_ID="+escape(USER_ID);
   window.open("/ispirit/go.php?CUR_UID=" + cur_uid + "&SID=" + cur_sid + "&URL="+URL,UID,USER_ID,"height=600,width=700,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}