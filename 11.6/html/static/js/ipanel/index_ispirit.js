function openURL(URL,open_window,is_menu)
{
//   if(is_menu!=1 || open_window)
    window.external.OA_SMS(URL,"","OPEN_URL");
//   else
//      window.external.OA_SMS("/ispirit/nav.php?URL="+encodeURIComponent(URL),"","OPEN_URL");
}

function send_sms(TO_UID,TO_NAME)
{
    var URL="/general/status_bar/sms_back.php?I_VER=" + i_ver + "&TO_UID="+TO_UID+"&TO_NAME="+escape(TO_NAME);
    window.external.OA_SMS(URL,"","OPEN_URL");
}
function group_send_sms(TO_UID,TO_NAME)
{
    var URL="/general/status_bar/sms_back.php?I_VER=" + i_ver + "&TO_UID="+TO_UID+"&TO_NAME="+escape(TO_NAME)+"&C=Web";
    window.external.OA_SMS(URL,"","OPEN_URL");
}
function send_sms1(MSG_ID)
{
    var URL="/general/status_bar/sms_back.php?I_VER=" + i_ver + "&MSG_ID="+MSG_ID+"&MSG_FW=1";
    window.external.OA_SMS(URL,"","OPEN_URL");
}
function send_email(TO_ID,TO_NAME)
{
    var URL="/general/email/new/?ISPIRIT=1&TO_ID="+TO_ID+"&TO_NAME="+escape(TO_NAME);
    openURL(URL);
}
function send_email1(TO_UID,TO_NAME)
{
    var URL="/general/email/new/?ISPIRIT=1&TO_UID="+TO_UID+"&TO_NAME="+escape(TO_NAME);
    openURL(URL);
}
//查看名片
function check_card(TO_UID,TO_NAME){
    var URL="/general/ipanel/user/user_info.php?UID="+TO_UID+"&USER_ID="+TO_NAME;
    openURL(URL,1);
}

function group_chat(type_str,dept_id)
{
    if(type_str=="dept")
    {
        window.external.OA_SMS("dept",dept_id,"START_GROUP");
    }
    else if(type_str=="new")
    {
        window.external.OA_SMS("new",dept_id,"START_GROUP");
    }
    else
    {
        window.external.OA_SMS("open",type_str,"START_GROUP");
    }
}

function history_sms(MSG_ID)
{
    var URL="/general/sms/msg_center/history_sms.php?I_VER=" + i_ver + "&MSG_ID="+MSG_ID;
    window.external.OA_SMS(URL,"","OPEN_URL");
}

function check_personinfo(UID,USER_ID)
{
    var URL="/general/ipanel/user/person.php?I_VER=" + i_ver + "&UID="+UID+"&USER_ID="+escape(USER_ID);
    window.external.OA_SMS(URL,"","OPEN_URL");
}
function fw_email()
{
    var URL="/general/email/new/?ISPIRIT=1&FW_FLAG=1";
    openURL(URL);
}
function fw_message()
{
    var URL="/general/status_bar/sms_back.php?FW_FLAG=1";
    openURL(URL);
}
function fw_diary()
{
    var URL="/general/diary/new?ISPIRIT=1&FW_FLAG=1";
    openURL(URL);
}
function fw_itask()
{
    var URL="/general/itask/index.php?s_action_from=pagefrom&FW_FLAG=1";
    openURL(URL);
}
function note_to_share(NOTE_ID)
{
    var URL="/general/status_bar/sms_back.php?I_VER=" + i_ver + "&NOTE_ID="+NOTE_ID;
    window.external.OA_SMS(URL,"","OPEN_URL");
}
function note_to_email(NOTE_ID)
{
    var URL="/general/email/new?I_VER=" + i_ver + "&NOTE_ID="+NOTE_ID;
    window.external.OA_SMS(URL,"","OPEN_URL");
}