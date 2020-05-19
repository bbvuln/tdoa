var $ = function(id) {return document.getElementById(id);};
function show_ws(id)
{
   var tables=document.getElementsByTagName("table");
   for(var i=0;i<tables.length;i++)
   {
      if(tables[i].id.substr(0,3)=="ws_")
      {
         tables[i].style.display="none";
         $('ws_menu_'+tables[i].id.substr(3)).className="";
      }
   }
   $('ws_'+id).style.display="";
   $('ws_menu_'+id).className="active";
}
window.onload=function()
{
   if(reanonly == 1)
   {
      document.body.oncontextmenu=function(){return false};
      document.body.onselectstart=function(){return false};
      document.body.ondragstart=function(){return false};
      document.body.oncopy=function(){return false};
      document.body.onmousedown=function(){return false};
   }
   
   if(typeof window.external == 'undefined' || typeof(window.external.OA_SMS) == 'undefined')
   {
      self.moveTo(0,0);
      self.resizeTo(window.screen.availWidth, window.screen.availHeight);
      self.focus();
   }
   else
   {
      window.external.OA_SMS("", "", "SET_MAX");
   }
   
   $('ws').style.height=(document.body.clientHeight-30)+"px";
};
window.onresize=function()
{
   $('ws').style.height=(document.body.clientHeight-30)+"px";
};