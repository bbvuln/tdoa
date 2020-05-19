function  reportstate(s){
   if(verifyTimer)
   {
      window.clearTimeout(verifyTimer);
      verifyTimer = null;
   }
   
   if(s == "ConOk"){
      document.getElementById("verify").style.display = '';
      document.getElementById("installer").style.display = 'none';
      document.getElementById("tips").style.display = '';
      
      var entermeetxml = parent.document.getElementById("conf_xml").value;
      document.location.href= "conf://" + entermeetxml;
      window.setTimeout(parent.close_window, 3000);
   }
   else {
      document.getElementById("verify").style.display = 'none';
      document.getElementById("installer").style.display = '';
      document.getElementById("tips").style.display = 'none';
      
      var update_link = parent.document.getElementById("update_link").value;
      if(update_link)
      {
         document.getElementById("update_tips").style.display = '';
         document.getElementById("update_link").href = update_link;
      }
   }
}

function flash(){
   var requiredMajorVersion = 9;
   var requiredMinorVersion = 0;
   var requiredRevision = 124;

   var hasProductInstall = DetectFlashVer(6, 0, 65);
   var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);
   if( hasProductInstall && !hasRequestedVersion ) {
      var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
      var MMredirectURL = window.location;
      document.title = document.title.slice(0, 47) + " - Flash Player Installation";
      var MMdoctitle = document.title;
   
      AC_FL_RunContent(
         "src", "playerProductInstall",
         "FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
         "width", "0",
         "height", "0",
         "align", "middle",
         "id", "better",
         "quality", "high",
         "bgcolor", "#869ca7",
         "name", "better",
         "allowScriptAccess","sameDomain",
         "type", "application/x-shockwave-flash",
         "pluginspage", "http://www.adobe.com/go/getflashplayer"
      );
   } else if (hasRequestedVersion) {
      AC_FL_RunContent(
            "src", "./static/better",
            "width", "0",
            "height", "0",
            "align", "middle",
            "id", "better",
            "quality", "high",
            "bgcolor", "#869ca7",
            "name", "better",
            "allowScriptAccess","sameDomain",
            "type", "application/x-shockwave-flash",
            "pluginspage", "http://www.adobe.com/go/getflashplayer"
      );
  } else {
    document.write(alternateContent);
  }
}
