function getMore(){
   page++;
   var obtn = $("#GetMoreBtn");
   obtn.addClass(".ui-disabled");
   var ov = obtn.text();
   var oCont = obtn.find(".ui-btn-text");
   
   if(typeof(qdata1)=="undefined")
      qdata1 = '';
   if(typeof(qdata2)=="undefined")
      qdata2 = '';
   if(typeof(qdata3)=="undefined")
      qdata3 = '';
               
   $.ajax({
      type: 'GET',
      url: '/pda/inc/get_more.php',
      data: {'STYPE':stype,'PAGE':page,"P":p, "QDATA1":qdata1, "QDATA2":qdata2, "QDATA3":qdata3},
      beforeSend: function(){
         $.mobile.loadingMessage = td_lang.pda.msg_2;
         $.mobile.showPageLoadingMsg();
         oCont.text(td_lang.pda.msg_2);   
      },
      success: function(data){
         if(data!="")
         {
            $("ul.ui-listview").append(data);
            $("ul.ui-listview").listview('refresh');
            if($("div[data-role=page]").attr("id") == "workflow-list-page"){
               $("div[data-role=page]").page("destroy").page();
            }
            oCont.text(ov);
            setTimeout(function(){$.mobile.hidePageLoadingMsg();},500);
            obtn.removeClass(".ui-disabled");
         }else{
            $.mobile.loadingMessage = td_lang.pda.msg_1;
            $.mobile.showPageLoadingMsg();
            oCont.text(ov);
            setTimeout(function(){$.mobile.hidePageLoadingMsg();},500);
            obtn.removeClass(".ui-disabled").hide();   
         }
   	}
   });   
}

$(document).bind("mobileinit", function(){
	$.mobile.ajaxLinksEnabled = false;
	//$.mobile.ajaxEnabled = false;
  	$.mobile.loadingMessage = td_lang.pda.msg_2;//"加载中"
  	$.mobile.pageLoadErrorMessage = td_lang.pda.msg_3;//"页面加载错误"
});

function fiximage(){
   imgs = $("div[data-role='content'] img");
   var cwidth = $(document.body).outerWidth(true);
   imgs.each(function(){
      w = $(this).width();
      if(w > cwidth)
      $(this).css("width",cwidth*0.9);
   });
}
