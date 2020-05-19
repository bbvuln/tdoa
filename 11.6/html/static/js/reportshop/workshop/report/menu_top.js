window.onload=function()
{
   var menu_id=0,menu=document.getElementById("navMenu");
   if(!menu) return;
   
   for(var i=0; i<menu.childNodes.length;i++)
   {
      if(menu.childNodes[i].tagName!="A")
         continue;
      if(menu_id==0)
         menu.childNodes[i].className="active";
      
      menu.childNodes[i].onclick=function(){
         var menu=document.getElementById("navMenu");
         for(var i=0; i<menu.childNodes.length;i++)
         {
            if(menu.childNodes[i].tagName!="A")
               continue;
            menu.childNodes[i].className="";
         }
         this.className="active";
      }
      menu_id++;
   }
   
   var navScroll = document.getElementById("navScroll");
   if(navScroll)
   {
      navScroll.onclick = function()
      {
         if(menu.scrollTop + menu.clientHeight >= menu.scrollHeight || menu.scrollTop + menu.clientHeight*2 > menu.scrollHeight)
            menu.scrollTop = 0;
         else
            menu.scrollTop += menu.clientHeight;
      }
      
      var panel = document.getElementById("navPanel");
      panel.onmouseover = function()
      {
         if(menu.scrollHeight >= menu.clientHeight*2)
            navScroll.style.display = '';
      }
      panel.onmouseout  = function()
      {
         navScroll.style.display = 'none';
      }
   }
   
   onresize();
};

window.onresize = function()
{
   var navScroll = document.getElementById("navScroll");
   if(navScroll)
   {
      var panel = document.getElementById("navPanel");
      var menu=document.getElementById("navMenu");
      panel.style.width = "100%";
      if(menu.clientWidth >= panel.clientWidth)
         menu.style.width = panel.clientWidth - navScroll.clientWidth - 70 + "px";
   }
}