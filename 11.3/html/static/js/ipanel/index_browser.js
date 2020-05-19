function openURL(URL,open_window,is_menu)
{
   if(!open_window)
   {
       parent.main.location=URL;
   }
   else
   {
      var mytop=(screen.availHeight-500)/2-30;
      var myleft=(screen.availWidth-780)/2;
      var now = new Date().getTime();
      window.open(URL,now,"height=548,width=780,status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+mytop+",left="+myleft+",resizable=yes");
   }
}

function send_sms(TO_UID,TO_NAME)
{
   var mytop=screen.availHeight-350;
   var myleft=0;
   window.open("/general/status_bar/sms_back.php?TO_UID="+TO_UID+"&TO_NAME="+escape(TO_NAME),"","height=390,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function group_send_sms(TO_UID,TO_NAME)
{
   var mytop=screen.availHeight-350;
   var myleft=0;
   window.open("/general/status_bar/sms_back.php?TO_UID="+TO_UID+"&TO_NAME="+escape(TO_NAME)+"&C=Web","","height=390,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function send_sms1(MSG_ID)
{
   var mytop=screen.availHeight-350;
   var myleft=0;
   window.open("/general/status_bar/sms_back.php?MSG_ID="+MSG_ID+"&MSG_FW=1","","height=390,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function send_email(TO_ID,TO_NAME)
{
   var URL="/general/email/new/?TO_ID="+TO_ID+"&TO_NAME="+escape(TO_NAME);
   openURL(URL,1);
}
function send_email1(TO_UID,TO_NAME)
{
   var URL="/general/email/new/?TO_UID="+TO_UID+"&TO_NAME="+escape(TO_NAME);
   openURL(URL,1);
}
//查看名片
function check_card(TO_UID,TO_NAME){
    var URL="/general/ipanel/user/user_info.php?UID="+TO_UID+"&USER_ID="+TO_NAME;
    openURL(URL,0);
}
function history_sms(MSG_ID)
{
   var mytop=screen.availHeight-360;
   var myleft=0;
   window.open("/general/sms/msg_center/history_sms.php?MSG_ID="+MSG_ID,MSG_ID,"height=390,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}

function check_personinfo(UID,USER_ID)
{
   var mytop=screen.availHeight-660;
   var myleft=0;
   window.open("/general/ipanel/user/person.php?UID="+UID+"&USER_ID="+escape(USER_ID),"height=600,width=700,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function send_weixun(note_id)
{
    var mytop=screen.availHeight-350;
    var myleft=0;
    window.open("/general/status_bar/sms_back.php?NOTE_ID="+note_id,"","height=390,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+mytop+",left="+myleft+",resizable=yes");
}
function send_note_email(note_id)
{
    var URL="/general/email/new/?NOTE_ID="+note_id;
    var mytop=(screen.availHeight-500)/2-10;
    var myleft=(screen.availWidth-780)/2;
    window.open(URL,"","height=665,width=845,status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+mytop+",left="+myleft+",resizable=yes");
    //openURL(URL,1);
}