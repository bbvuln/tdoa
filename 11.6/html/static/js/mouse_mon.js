var $ = function(id) {return document.getElementById(id);};
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var ua_match = /(trident)(?:.*rv:([\w.]+))?/.exec(userAgent) || /(msie) ([\w.]+)/.exec(userAgent);
var is_ie = ua_match && (ua_match[1] == 'trident' || ua_match[1] == 'msie') ? true : false;

var mouse_is_out = true;

function moue_over()
{
   mouse_is_out=false;
}
function moue_out()
{
   mouse_is_out=true;
}
function attachBody()
{
   if(window.attachEvent)
   {
      document.body.attachEvent("onmouseover", moue_over);
      document.body.attachEvent("onmouseout", moue_out);
   }
   else
   {
      document.body.addEventListener("mouseover", moue_over, false);
      document.body.addEventListener("mouseout", moue_out, false);
   }
}

if(window.attachEvent)
   window.attachEvent("onload", attachBody);
else
   window.addEventListener("load", attachBody, false);
