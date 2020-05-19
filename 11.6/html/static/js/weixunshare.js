jQuery.noConflict();
(function($){
   
   var mutiTalkBox = ($("#wx_content").length > 0);
   
   $(document).ready(function(){
      focusMsgBox();   
   });
   
   function focusMsgBox(){
      var wxt = $("#wx_content").val();
      if(!mutiTalkBox) return;
      if(wxt!="" && wxt.indexOf("#")!="-1"){
         o = $("#wx_content")[0];
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
      }    
   }
   
   function letter_stat(){
      if(!mutiTalkBox) return;
      var d = $("#wx_content");
      var n = $("#wx_letter");
      var sHTML = d.html();
      var sv = d.val();
      if(sv == config_no_msg && sv == sHTML)
         return;
      var sl = sv.length;
      var simgl = d.find("img").length;
      var speol = d.find("input").length;
      var all_l = sl + simgl + speol;
      var max_l = config_max_letter;
      if(all_l > max_l) {
         alert(config_max_msg);
         d.html(d.val().substr(0, max_l));
      }
      n.html(max_l - all_l);
   }
   
   function letter_stat_mon(){
      setInterval(letter_stat,100);   
   }
   
   document.onkeydown = function (e) {
      if(!e) var e = window.event;
      
      if(e.ctrlKey && e.keyCode == 13){
         if($("#share_iframe").length > 0){
            $("#share_iframe").click();   
         }else{
            $("#share").click();   
         }
         return false;
      }
   }
   
   $(function(){
      letter_stat_mon();      
   })
   
   $("body").click(function(){
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
      var s = v.html();
      $(".wx_content_wrap").addClass("wx_content_wrap_ac");
      if(s!=config_no_msg)
         return;
      else
         v.focus();v.html("");
   });
   
   $(".userpic a").live("click",function(){
      var uid = user_id = '';
      var uid = $(this).attr("data_uid");
      var user_id = $(this).attr("data_user_id");
      if(parent)
         parent.openURL("/general/ipanel/user/person.php?I_VER="+i_ver+"&UID="+uid+"&USER_ID="+unescape(user_id));    
   });
   
   $(".time_broadcast a").live("click",function(){
      var wxid = $(this).attr("data_wxid");
      if(ispirit!=""){
         parent.openURL("/general/ipanel/smsbox/broadcast.php?I_VER="+i_ver+"&wxid="+wxid);
      }else{
         mytop=(screen.availHeight-405)/2;
         myleft=(screen.availWidth-400)/2;
         window.open ("/general/ipanel/smsbox/broadcast.php?I_VER="+i_ver+"&wxid="+wxid, "newwindow2", "height=405, width=400, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no");
      }    
   });
   
   $("#insert_topic, #insert_person, #userbox_input, #insert_emotion, #share, #emotionbox img.emotion_icon").click(function(e){
       e.stopPropagation();      
   });
   
   //插入话题
   $("#insert_topic").click(function(){
      var con = td_lang.inc.msg_56;

       if($("#emotionbox:visible").length > 0){
         $("#insert_emotion").removeClass("insert_emotion_cur");
         $("#emotionbox").hide();
       }
       
       if(($("#wx_content").val() == config_no_msg) && (!$(".wx_content_wrap").hasClass("wx_content_wrap_ac")))
            $(".wx_content_wrap").click();
         
       $("#wx_content").append("#"+con+"#");
       
       //剔除掉Img对象
       if($("#wx_content > img"))
         img_size = $("#wx_content > img").length;
       
       //剔除掉Img对象  
       if($("#wx_content > input"))
         input_size = $("#wx_content > input").length;
         
         var l = $("#wx_content").val().length + img_size + input_size;
       
       //创建选择区域	
       if($("#wx_content")[0].createTextRange){//IE浏览器
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
   
   //打开表情
   $("#insert_emotion").click(function(){
      
      resetUI('insert_emotion');
      
      if($("#emotionbox:visible").length > 0){
         $(this).removeClass("insert_emotion_cur");
         $("#emotionbox").hide();   
      }else{
         $(this).addClass("insert_emotion_cur");
         //$("#emotionbox").css("top","144px");
         $("#emotionbox").css("left","50px");
         $("#emotionbox").show();
      }   
   });
   
   $("#emotionbox img.emotion_icon").hover(
      function(){$(this).parent("td").addClass("hover");},
      function(){$(this).parent("td").removeClass("hover");}
   );
   
   //插入表情动作
   $("#emotionbox img.emotion_icon").click(function(){
      if($("#wx_content").html() == config_no_msg){
         $(".wx_content_wrap").addClass("wx_content_wrap_ac"); 
         $("#wx_content").val("");      
      }
      o = document.createElement("IMG");
      o.src = $(this).attr("src");
      o.style.height = "20px";
      o.style.width = "20px";
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
   
   //@人员
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
   
   //人员选取滑动效果
   $("#userbox #userbox_result li").live("mouseover", function(){$(this).addClass("cur");});
   $("#userbox #userbox_result li").live("mouseout", function(){$(this).removeClass("cur");});
   
   $("#userbox #userbox_result li").live("click",function(){
      var flag = false;  
      var uid = $(this).attr("data_uid");
      var objPers = $("#wx_content > input.obj_person");
      objPers.each(function(){
         if($(this).attr("data_uid") == uid){
            flag = true;
            alert(td_lang.inc.msg_weixunshare_107);
            return false;
         }   
      });
      
      if(flag){
         $("#wx_content").focus();
         var Sel = document.selection.createRange();
         Sel.moveStart ('character', $("#wx_content")[0].value.length + $("#wx_content > img, #wx_content > input").length);
         Sel.collapse(true);
         Sel.select();
         return;   
      }
      
      var user_name = $(this).attr("data_username");
      var strlen = Len(user_name);
      o = $("<input class='obj_person' value='"+user_name+"' data_username='"+user_name+"' data_uid='"+uid+"' disabled='disabled' />");
      o.width((36 + strlen*5)+"px");
      $("#wx_content").click().append(o);
      letter_stat();
   });
   
   //人员搜索
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
      
      if(!mutiTalkBox) return;
      
      if(typeof(stype) == "undefined")
         stype = '';
      
      //清理表情面板
      if(stype!="insert_emotion"){
         $("#insert_emotion").removeClass("insert_emotion_cur");
         $("#emotionbox").hide();
      }
      
      //清理输入框样式
      if(stype!="wx_content_wrap"){
         s = $("#wx_content").html();
         if(s == config_no_msg || $("#wx_content").html() == ""){
            $(".wx_content_wrap").removeClass("wx_content_wrap_ac");
            $("#wx_content").val(config_no_msg);
         }   
      }
      
      //关闭选人面板
      if(stype!="insert_person"){
         $("#insert_person").removeClass("insert_person_cur");
         $("#userbox").hide();
      }
   
   }
   
   //分享
   $("#share").click(function(e){
      e.stopPropagation();
      var content = $("#wx_content").html();
      var img = $("#wx_content > img").length; 
      if(content == config_no_msg || content == ""){
         if(img == 0){
            alert(td_lang.inc.msg_55);//"输入点什么再分享吧:"
            $("#wx_content").focus().click();
            return;
         }   
      }
      
      //表情、@替换
      content = content.replace(/<img.*?eicon=\"(.*?)\".*?>/ig,"[em]"+'$1'+"[/em]");
      content = content.replace(/<input.*?data_username=\"(.*?)\".*?data_uid=\"(.*?)\".*?>/ig,"[@=$2]"+'$1'+"[/@]");
      content = content.replace(/<input.*?data_uid=\"(.*?)\".*?data_username=\"(.*?)\".*?>/ig,"[@=$1]"+'$2'+"[/@]");
     
      var lastId = '';
      if($("#talkList > li:first").length > 0){
         lastId = parseInt($("#talkList > li:first").attr("id"));   
      }else{
         lastId = 0;   
      }
      $.post(
         "save_share.php",
         {"CONTENT":content,"LASTID":lastId},
         function(data){
            var _t = $(data);
            _t.hide();
            $("#talkList").prepend(_t);   
            _t.animate({opacity: 'show'}, {duration: 2000});
            $("#wx_content").empty().click();
         }
      );
            
   });
   
   //转播
   $("#share_iframe").click(function(e){
      e.stopPropagation();
      var stype = window.parent.stype ? window.parent.stype : "onknown";
      var content = $("#wx_content").html();
      var img = $("#wx_content > img").length; 
      if(content == config_no_msg || content == ""){
         if(img == 0){
            alert(td_lang.inc.msg_55);//"输入点什么再分享吧:"
            $("#wx_content").focus().click();
            return;
         }   
      }
      
      //表情、@替换
      content = content.replace(/<img.*?eicon=\"(.*?)\".*?>/ig,"[em]"+'$1'+"[/em]");
      content = content.replace(/<input.*?data_username=\"(.*?)\".*?data_uid=\"(.*?)\".*?>/ig,"[@=$2]"+'$1'+"[/@]");
      content = content.replace(/<input.*?data_uid=\"(.*?)\".*?data_username=\"(.*?)\".*?>/ig,"[@=$1]"+'$2'+"[/@]");
     
      var lastId = '';
      lastId = parseInt($("#talkList > li:first",window.parent.document).attr("id"));      

      $.post(
         "save_share.php",
         {"CONTENT":content,"LASTID":lastId,"WXID":broadcast_id},
         function(data)
         {
            resultMsg("success",td_lang.inc.msg_weixunshare_109);
            if(stype!="atme"){
               var _t = $(data);
               _t.hide();      
               $("#talkList",window.parent.document).prepend(_t);      
               _t.animate({opacity: 'show'}, {duration: 2000});
            }
            setTimeout(function(){hideResultMsg();hide_msg_iframe("#BroadCastBlock");},1000);
         }
      );
            
   });
   
   //获取更多对话数据
   $("#moreList").click(function(e){
      e.stopPropagation();
      var cursorId = '';
      cursorId = parseInt($("#talkList > li:last").attr("id"));
      $("#moreList > a").addClass("loading");
      $.post(
         "get_more.php",
         {"CURSORID":cursorId,"STYPE":stype,"SEARCHKEY":searchkey},
         function(data)
         {
            $("#moreList > a").removeClass("loading");
            if(data!="")
            {
               var _t = $(data);
               _t.hide();
               $("#talkList").append(_t);
               _t.animate({opacity: 'show'},{duration: 1000});   
            }else{
               alert(td_lang.inc.msg_54);
            }
            return;   
         }
      );
   });
   
   //删除微讯
   $(".funBox .comt").live("click",function(e){
      e.stopPropagation();
      var wxid = '';
      wxid = $(this).attr("wxid");
      if(!confirm(td_lang.inc.msg_weixunshare_110)) return;
      $.post(
         "del.php",
         {"WXID":wxid},
         function(data)
         {
            if(data == "OK")
            {
               $("li#" + wxid).hide(500,function(){$(this).remove()});
            }      
         }
      );
   });
   
   function show_msg(msgBlock)
   {
      $("#overlay").show();
      $(msgBlock).show();
      var bb = (document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;
      $("#overlay").css({"width":bb.scrollWidth+"px","height":bb.scrollHeight+"px"});
      var msgBlockLeft = ((bb.offsetWidth - $(msgBlock)[0].offsetWidth)/2)+"px";
      var msgBlockTop  = (60 + bb.scrollTop)+"px";
      $(msgBlock).css({"left":msgBlockLeft,"top":msgBlockTop});
   }
   
   function hide_msg(msgBlock)
   {
      $("#overlay").hide();
      $(msgBlock).hide();
   }
   
   function hide_msg_iframe(msgBlock)
   {
      $("#overlay",window.parent.document).hide();
      $(msgBlock,window.parent.document).hide();   
   }
   
   $(".relay").live("click",function(){
      var wxid = $(this).attr("wxid");
      if(!wxid){
         alert(td_lang.inc.msg_weixunshare_108);
         return;
      }
      $("#wxiframe").attr("src","broadcast.php?wxid="+wxid);
      show_msg("#BroadCastBlock");
   });
   
   $(".option").click(function(){
      hide_msg("#BroadCastBlock");      
   });
   
   //显示操作提醒
   function resultMsg(stype,msg)
   {
      $("#msg").empty();
      $("#xoverlay").show();
      $("#msg").addClass(stype).html(msg).show();      
   }
   
   //关闭操作提醒
   function hideResultMsg()
   {
      $("#msg").empty().hide();
      $("#xoverlay").hide();      
   }
      
})(jQuery);