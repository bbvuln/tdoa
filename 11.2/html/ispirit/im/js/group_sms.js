function sendGroupSMS(msgGroupID,content)
{
   document.getElementById("MSG_GROUP_ID").value = msgGroupID;
   document.getElementById("MSG_CONTENT").value = content;
   //document.form1.MSG_GROUP_ID.value= msgGroupID;
   //document.form1.MSG_CONTENT.value= content;
   document.form1.submit();
   appendMsg(userName, new Date().toLocaleTimeString(), content);
}

function sendFile(file_path)
{
   document.form1.submit();
}

function imgErr(theVar)
{

}
function imgClick(imgObj) {
        var src = imgObj.getAttribute("temp");
        // alert(src);
        external.OpenPicture(src);
        imgObj.src = src;
        imgObj.style.width = "";
        imgObj.style.height = "";
    }
    function ImgFocusIn(imgObj) {
        imgObj.style.border = "2px solid #cccccc";
        imgObj.style.cursor = "pointer";
        imgObj.title = "Ë«»÷²é¿´Ô­Í¼";
    }

    function ImgFocusOut(imgObj) {
        imgObj.style.border = "2px solid #E6F3FB";
        imgObj.style.cursor = "default";
    }