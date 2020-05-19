jQuery.noConflict();
(function($){
   
   $(document).ready(function(){

      //事务提醒的下拉事件
      var menuTimerOrg = null;
      $("#sub_tabs_ul > li > a[module='smsbox'] > span > span.dropdown").click(
         function(){
            $("#sub_menu_smsbox").show(100);
            
            var offset = $(this).offset();
            $("#sub_menu_smsbox").css({top:offset.top + $(this).height() - 1, left:offset.left});
         }
      );
      $("#sub_tabs_ul > li > a[module='smsbox'] > span > span.dropdown").hover(
         function(){
         },
         function(){
            menuTimerOrg = window.setTimeout(function(){$("#sub_menu_smsbox").hide(100);}, 300);
         }
      );
      
      //事务提醒的鼠标滑过事件
      $("#sub_menu_smsbox").hover(
         function(){
            if(menuTimerOrg)
               window.clearTimeout(menuTimerOrg);
         },
         function(){
            $(this).hide(100);
         }
      );
   
   
   });
   
})(jQuery);