window.onload = function(){
   setTimeout("online_mon()", 1000);
   if(p_ver == "6" && typeof(window.Android) != 'undefined' && typeof(window.Android.imenable) == 'function')
      window.Android.imenable();
};

function online_mon(req)
{
   if(isUndefined(req))
   {
      _get("../general/ipanel/user/user_count.php", "CLIENT=" + p_client, online_mon);
      setTimeout("online_mon()", online_ref_sec*1000);
   }
   else
   {
      var count = 1;
      if(req.status == 200)
         count = isNaN(parseInt(req.responseText)) ? 1 : parseInt(req.responseText);
      
      if(!frames['foot'])
         return;
      
      var user_count = frames['foot'].document.getElementById("user_count");
      if(!frames['foot'])
         return;
      
      user_count.value = count;
      user_count.size = (user_count.value.length < 3 ? 3 : user_count.value.length);
   }
}

function ResizeFrame(id)
{
   if(id == 1)
   {
      $('frame1').rows = '*,0,40';
   }
   else if(id == 2)
   {
      $('frame1').rows = '0,*,40';
      if(!frames['message'].location || frames['message'].location == 'about:blank')
         frames['message'].location = "message?P=" + p;
         
   }
}