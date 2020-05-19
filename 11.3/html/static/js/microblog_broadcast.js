jQuery.noConflict();
(function($){
   
   $(document).ready(function(){
      
      if($("body").attr("scrollHeight") > $("body").attr("clientHeight")){
         $("#xoverlay").height($("body").attr("scrollHeight"));      
      }else{
         $("#xoverlay").height($("body").attr("clientHeight")); 
      }
      
      var wxt = $("#wx_content").val();
      if(wxt!=""){
         o = $("#wx_content")[0];
         $("#xoverlay").height($("body").attr("clientHeight"));
         if (o.setSelectionRange)
         { 
            setTimeout(function(){
               o.setSelectionRange(o.value.length, o.value.length);  
               o.focus()} ,0)
               
         }else if (o.createTextRange) {
             o.focus();
             $(".wx_content_wrap").addClass("wx_content_wrap_ac");
             var textrange=o.createTextRange();
             textrange.moveStart("character",o.value.length);
             textrange.moveEnd("character",0);
             textrange.select();
         }    
      }else{
         $("#wx_content").focus();      
      }
      
   });

   $(window).scroll(function(){
      $("#msg").css("top",0);
      $("#msg").css("marginTop",($("body").scrollTop() + $("body").attr("clientHeight")/2 - $('#msg').height()/2));
   });

   
   $("#body1").click(function(){
      resetUI();
   });
   
   function Len(str)
   {
        var i,sum;
        sum=0;
        for(i=0;i<str.length;i++)
        {
            if ((str.charCodeAt(i)>=0) && (str.charCodeAt(i)<=255))
                sum=sum+1;
            else
                sum=sum+2;
        }
        return sum;
   }
   
   $(".wx_content_wrap").click(function(e){
      e.stopPropagation();
      resetUI('wx_content_wrap');
      var v = $(this).find("#wx_content");
      var s = v.val();
      $(".wx_content_wrap").addClass("wx_content_wrap_ac");
      if(s!=config_no_msg)
         return;
      else
         v.focus();v.val("");
   });
   
   $(".userpic a").live("click",function(){
      var uid = user_id = '';
      var uid = $(this).attr("data_uid");
      var user_id = $(this).attr("data_user_id");
      if(parent)
         parent.openURL("/general/ipanel/user/person.php?I_VER=<?=$I_VER?>&UID="+uid+"&USER_ID="+unescape(user_id));    
   });
   
   $("#insert_topic, #insert_person, #userbox_input, #insert_emotion, #share, #emotionbox img.emotion_icon").click(function(e){
       e.stopPropagation();      
   });
   
   //���뻰��
   $("#insert_topic").click(function(){
      var con = td_lang.inc.msg_56;//"�����������뻰��"

       if($("#emotionbox:visible").length > 0){
         $("#insert_emotion").removeClass("insert_emotion_cur");
         $("#emotionbox").hide();
       }
       
       if(($("#wx_content").val() == config_no_msg) && (!$(".wx_content_wrap").hasClass("wx_content_wrap_ac")))
            $(".wx_content_wrap").click();
         
       $("#wx_content").append("#"+con+"#");
       
       //�޳���Img����
       if($("#wx_content > img"))
         img_size = $("#wx_content > img").length;
       
       //�޳���Img����  
       if($("#wx_content > input"))
         input_size = $("#wx_content > input").length;
         
         var l = $("#wx_content").val().length + img_size + input_size;
       
       //����ѡ������	
       if($("#wx_content")[0].createTextRange){//IE�����
           var range = $("#wx_content")[0].createTextRange();
           range.moveEnd("character",-l)                     
           range.moveEnd("character",l-1);
           range.moveStart("character", l-1-con.length);
           range.select();
       }else{
           $("#wx_content")[0].setSelectionRange(l-1-con.length,l-1);
           $("#wx_content")[0].focus();
       }
   });
   
   //�򿪱���
   $("#insert_emotion").click(function(){
      
      resetUI('insert_emotion');
      
      if($("#emotionbox:visible").length > 0){
         $(this).removeClass("insert_emotion_cur");
         $("#emotionbox").hide();   
      }else{
         $(this).addClass("insert_emotion_cur");
         $("#emotionbox").show();
      }   
   });
   
   $("#emotionbox img.emotion_icon").hover(
      function(){$(this).parent("td").addClass("hover");},
      function(){$(this).parent("td").removeClass("hover");}
   );
   
   //������鶯��
   $("#emotionbox img.emotion_icon").click(function(){
      if($("#wx_content").val() == config_no_msg){
         $(".wx_content_wrap").addClass("wx_content_wrap_ac"); 
         $("#wx_content").val("");      
      }
      o = document.createElement("IMG");
      o.src = $(this).attr("src");
      o.eicon = $(this).attr("eicon");
      $("#wx_content").append(o);
      $("#emotionbox").hide();
      $("#insert_emotion").removeClass("insert_emotion_cur");
      $("#wx_content").focus();
      var Sel = document.selection.createRange();
      Sel.moveStart ('character', $("#wx_content")[0].value.length + $("#wx_content > img, #wx_content > input").length);
      Sel.collapse(true);
      Sel.select();
      letter_stat(); 
   });
   
   //@��Ա
   $("#insert_person").click(function(){
      
      resetUI('insert_person');
      
      if($("#userbox:visible").length > 0){
         $(this).removeClass("insert_person_cur");
         $("#userbox").hide();   
      }else{
         $(this).addClass("insert_person_cur");
         $("#userbox").show();
         $("#userbox_input").select();
      }        
   });
   
   //��Աѡȡ����Ч��
   $("#userbox #userbox_result li").live("mouseover", function(){$(this).addClass("cur");});
   $("#userbox #userbox_result li").live("mouseout", function(){$(this).removeClass("cur");});
   
   $("#userbox #userbox_result li").live("click",function(){
      var uid = $(this).attr("data_uid");
      var user_name = $(this).attr("data_username");
      var strlen = Len(user_name);
      o = $("<input class='obj_person' value='"+user_name+"' data_username='"+user_name+"' data_uid='"+uid+"' disabled='disabled' />");
      o.width((36 + strlen*5)+"px");
      $("#wx_content").click().append(o);
      letter_stat();
   });
   
   //��Ա����
   $("#userbox_input").live("keyup",function(){
      var key = $(this).val();
      if(key == ""){
         $("#userbox #userbox_result").empty().height("0px").hide();
         return;
      }
      $.get("search_user.php",{"KWORD":key},function(data){
         if(data == ""){
            $("#userbox #userbox_result").empty().height("0px").hide();      
         }else{
            $("#userbox #userbox_result").empty().append(data);
            if(data!="" && (data.split('li>').length-1) > 5){
               $("#userbox #userbox_result").height((5 * 20)+'px');
               $("#userbox #userbox_result").css('overflow-y','auto');   
            }else{
               $("#userbox #userbox_result").height('auto');            
            }
            $("#userbox #userbox_result").show();   
         }
      });      
   });
      
   function resetUI(stype){
      
      if(typeof(stype) == "undefined")
         stype = '';
      
      //����������
      if(stype!="insert_emotion"){
         $("#insert_emotion").removeClass("insert_emotion_cur");
         $("#emotionbox").hide();
      }
      
      //�����������ʽ
      if(stype!="wx_content_wrap"){
         s = $("#wx_content").val();
         if(s == config_no_msg || $("#wx_content").html() == ""){
            $(".wx_content_wrap").removeClass("wx_content_wrap_ac");
            $("#wx_content").val(config_no_msg);
         }   
      }
      
      //�ر�ѡ�����
      if(stype!="insert_person"){
         $("#insert_person").removeClass("insert_person_cur");
         $("#userbox").hide();
      }
   
   }
   
   $("#share").click(function(e){
      e.stopPropagation();
      var content = $("#wx_content").html();
      var img = $("#wx_content > img").length; 
      if(content == config_no_msg || content == ""){
         if(img == 0){
            Message(td_lang.inc.msg_55);//"�����ʲô�ٷ����:)"
            return;
         }   
      }
      
      //�����滻
      content = content.replace(/<img.*?eicon=\"(.*?)\".*?>/ig,"[em]"+'$1'+"[/em]");

      //@�滻
      content = content.replace(/<input.*?data_username=\"(.*?)\".*?data_uid=\"(.*?)\".*?>/ig,"[@=$2]"+'$1'+"[/@]");
     
      $.get("save_share.php",{"CONTENT":content,"WXID":broadcast_id},
         function(data){
            Message(td_lang.inc.msg_57);//"����ɹ���"
            setTimeout(function(){close_window();if(opener)window.opener.location.reload();},'1000');
            return;
         }
      );      
   });   
})(jQuery);