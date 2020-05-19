//lp 2012/2/26 23:47:59 ���Ϊ���ݼ�������� pull loading

$.extend({
      tiScroll: function (options) 
      {
         var defaults = {
            page_id: '1',
            listType: "listview",
            nomoredata: false,
            noshowPullUp: false,
            url: "/pda/inc/getdata.php",
            PullUpEvt:'',
            PullDownEvt:''
         };
         
			
         var options = $.extend(true, defaults, options);
         var page_id = options.page_id;
         var listType = options.listType;
         var nomoredata = options.nomoredata;
         var noshowPullUp = options.noshowPullUp;
         var PullUpEvt = options.PullUpEvt;
         var PullDownEvt = options.PullDownEvt;
         var url = options.url;
         if(typeof(mobile_dataurl) != "undefined")
				url = mobile_dataurl;
         eval("window.oiScroll = window.oiScroll_"+ page_id +" || null");
         //window.oiScroll = window.oiScroll || null;
         
         function setPageId(tid){
            var page_id = tid;
            $$page_dom =  $("#page_" + page_id);
         }
         function init()
         {
            $$page_dom = $("#page_" + page_id);
            $$wrapper_dom = $("#page_" + page_id +" .wrapper");  
            
            if(oiScroll)
               oiScroll.destroy();
         
            if(listType == "listview")
            {
               if(noshowPullUp){
                  $$page_dom.find('.pullUp').hide();   
               }
               else
               {
            	   $$page_dom.find('.scroller > .loadingComplete').remove();
            	   $$page_dom.find(".pullUp").show();
            	   
               }
               
               var pullDownEl, pullDownOffset,pullUpEl, pullUpOffset;
            	pullDownEl = $$page_dom.find('.pullDown')[0];
            	pullDownOffset = pullDownEl.offsetHeight;
               pullUpEl = $$page_dom.find('.pullUp')[0];
               pullUpOffset = pullUpEl ? pullUpEl.offsetHeight : $$page_dom.find('.loadingComplete')[0].offsetHeight;
               oiScroll = new iScroll($$wrapper_dom[0], {
            		useTransition: true,
            		topOffset: pullDownOffset,
            		onBeforeScrollStart: function (e) {
            		   if(e.target.nodeName.toLowerCase()!="li"){
            		      if($(e.target).parents("li").length > 0){
            		         var target = $(e.target).parents("li")[0];
            		      }else{
            		         return;      
            		      }    
            		   }else{
            		      var target = e.target;   
            		   }
            			clearTimeout(this.hoverTimeout);
            			while (target.nodeType != 1) target = target.parentNode;
            			this.hoverTimeout = setTimeout(function () {
            				if (!hoverClassRegEx.test(target.className)) target.className = target.className ? target.className + ' iScrollHover' : 'iScrollHover';
            			}, 80);
            			this.hoverTarget = target;
            		},
            		onRefresh: function () {
            			if (pullDownEl.className.match('loading')) {
            				pullDownEl.className = 'pullDown';
            				pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_4;
            			} else if (pullUpEl && pullUpEl.className.match('loading')) {
            				pullUpEl.className = 'pullUp';
            				pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_6;
            			}
            		},
            		onScrollMove: function () {
            			if (this.y > 5 && !pullDownEl.className.match('flip')) {
            				pullDownEl.className = 'pullDown flip';
            				pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_5;
            				this.minScrollY = 0;
            			} else if (this.y < 5 && pullDownEl.className.match('flip')) {
            				pullDownEl.className = 'pullDown';
            				pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_7;
            				this.minScrollY = -pullDownOffset;
            			} else if (this.y < (this.maxScrollY - 5) && pullUpEl && !pullUpEl.className.match('flip')) {
            			   if(checkNoMoreData(page_id)) return;
            				pullUpEl.className = 'pullUp flip';
            				pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_7;
            				this.maxScrollY = this.maxScrollY;
            			} else if (this.y > (this.maxScrollY + 5) && pullUpEl && pullUpEl.className.match('flip')) {
            			   if(checkNoMoreData(page_id)) return;
            				pullUpEl.className = 'pullUp';
            				pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_2;
            				this.maxScrollY = pullUpOffset;
            			}
            			removeClass();
            		},
            		onScrollEnd: function () {
            			if (pullDownEl.className.match('flip')) {
            				pullDownEl.className = 'pullDown loading';
            				pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_2;				
            				pullAction('down',$$page_dom);
            			} else if (pullUpEl && pullUpEl.className.match('flip')) {
                        if(checkNoMoreData(page_id)) return;
            				pullUpEl.className = 'pullUp loading';
            				pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_2;
            				if(!noshowPullUp){
            				   pullAction('up',$$page_dom);
            				}
            			}
            		},
            		onBeforeScrollEnd: removeClass
            	});   
            }else if(listType == "attach_show"){
               oiScroll = new iScroll($$wrapper_dom[0],{"zoom":true});
            }else{
               oiScroll = new iScroll($$wrapper_dom[0],{
                  useTransform: false,
                  onBeforeScrollStart: function (e) {
                    var target = e.target;
                    while (target.nodeType != 1) target = target.parentNode;
                    if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'){
                        e.preventDefault();
                        e.stopPropagation();
                    }
                  }
               });   
            }
            eval("window.oiScroll_" + page_id + "= oiScroll");
            window.oiScroll = oiScroll;
            return oiScroll;
         }
         
         function destroy(){
            if(oiScroll)
               oiScroll.destroy();      
         }
         
         function pullAction (pullaction,obj) 
         {
            var oUl = obj.find("ul.comm-list");
            if(pullaction == 'down')
            {
               
               //�Զ���ضϺ���
            	if(PullDownEvt != "" && checkFuncExists(PullDownEvt)){
                    eval(PullDownEvt+"()");
                 }else{
                  var lastedId =  oUl.find("li:first").attr("q_id");
                  $.get(url,{'A':"GetNew", 'STYPE':stype, "P":p, "LASTEDID": lastedId},
                     function(data)
                     {
                        if(data == "NONEWDATA")
                        {
                           showMessage(nonewdata);
                        }else{
                           var size = $("<ul>"+data+"</ul>").find("li").size();
                           var osize = oUl.find("li").size();
                           
                           if(osize == 0)
                              $$page_dom.find(".no_msg").hide();
                                 
                           oUl.prepend(data);
                           showMessage(sprintf(newdata,size));
                        }
                        oiScroll.refresh();
                     }
                  );
               }   
            }else{
            	//�Զ���ضϺ���
                if(PullUpEvt != "" && checkFuncExists(PullUpEvt)){
                   eval(PullUpEvt+"()");
                   
                }
                else
                {
               var currIterms = oUl.find("li").size();
               
               //lp 2012/5/2 0:59:57 ���ӻ�ȡ����ʱ����������
               if(currIterms > 0){
                  lastGetId = oUl.find("li:last").attr("q_id");    
               }
               $.get(url, {'A':"GetMore", 'STYPE':stype, "P":p, "CURRITERMS": currIterms, "LASTGETID": lastGetId},
                  function(data)
                  {
                     if(data == "NOMOREDATA")
                     {
                        $$page_dom.find(".pullUp").remove();
                        
                        nomoredata = true;
                        eval("nomoredata_" + page_id + "= true");
                        
                        noshowPullUp = true;
                        eval("noshowPullUp_" + page_id + "= true");
                        
                        $$page_dom.find(".scroller").append('<div class="loadingComplete">' + td_lang.pda.msg_8 + '</div>');
                     }else{
                        oUl.append(data);
                        oiScroll.refresh();
                     }
                  }
               );   
            }
            }
         }
         
         hoverClassRegEx = new RegExp('(^|\\s)iScrollHover(\\s|$)'),
         
         removeClass = function () {
         	if (this.hoverTarget) {
         		clearTimeout(this.hoverTimeout);
         		this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');
         		this.target = null;
         	}
         };
                  
         return{
            setPageId:setPageId,
            init:init,
            destroy:destroy
         }
      } 
});

function checkNoMoreData(page_id)
{
	var _tmp;
	eval("_tmp = nomoredata_" + page_id);
	return _tmp;
}

//2012/2/27 11:24:51 lp ��ʾ��Ϣ
function showMessage(t)
{
   $("#message #text").empty().text(t);
   $("#message").show().css({"top":13}).animate({top: '+=30'}, 1000, function(){
      setTimeout(function(){$("#message").animate({top: '-=30'},800,function(){$("#message").css({"top":13}).hide();})},800);
   });   
}

$(".read_detail").click(function(){
    $(this).find("input").focus();   
});

//lp ��չ����
$.extend({
   tSearch2: function (options) 
   {
      var url = '/pda/inc/get_contactlist.php';              
      var input = options.input;
      var list = options.list;
      var page_id = options.page_id;
      
      var $$input = $(input);
      var $$list = $(list);
      
      var _tmp_key;
      var searchInterval = null;
      
      function init()
      {
         $$input.focus(function(e){
            e.stopPropagation(); 
            searchInterval = null;
            searchInterval = window.setInterval(search_name,1000);
            $(this).addClass("hasNoBackGround");
         });
         
         $$input.blur(function(){
            if($(this).val() == '')
               $(this).removeClass("hasNoBackGround");
            window.clearInterval(searchInterval);
            searchInterval = null;
         });
         
      }
      
      function search_name()
      {
         var key = $$input.val();
         
         if(key!="")
         {
            if(key!=_tmp_key)
            {
               _tmp_key = key;
               $.ajax({
                  type: 'GET',
                  url: url,
                  cache: false,
                  data: {"KWORD":key,"P":p},
                  beforeSend: function(){
                     $.ProLoading.show();   
                  },
                  success: function(data){
                     $.ProLoading.hide();
                     if(data==""){
                        $$list.empty();   
                     }else{
                        $$list.empty().append(data);
                     }
                     //�����ѯ���ݣ������ϵ��
                     oli = $$list.find("li");
                     oli.live("click",function()
                     {
                        var _oSelect_name = $(this).attr("q_name");
                        var _oSelect_uid = $(this).attr("q_id");
                        var _oSelect_user_id = $(this).attr("q_user_id");
                        return;
                     });
                     pageInit(page_id);
                  }
               });
            }
            return;
         }else{
            _tmp_key = key;
            $$list.empty();   
         }   
      }
      return{
         init: init    
      }
   }
});
   
//lp ��չ����
$.extend({
   tSearch: function (options) 
   {
      var url = '/pda/inc/get_contactlist.php';              
      var input = options.input;
      var list = options.list;
      var appendDom = options.appendDom;
      
      var $$input = $(input);
      var $$appendDom = $(appendDom);
      var $$list = $(list);
      
      var _tmp_key;
      var searchInterval = null;
      var searchHtml = '';
      searchHtml  = '<div id="wrapper_plist" class="wrapper wrapper_contact hasshadow" style="display:none;">';
      searchHtml +=    '<div id="scroller_plist" class="scroller">';
      searchHtml +=       '<ul class="comm-list contact-list"></ul>';
      searchHtml +=    '</div>';
      searchHtml += '</div>';
      
      function init()
      {
         $$input.focus(function(e){
            e.stopPropagation(); 
            searchInterval = null;
            searchInterval = setInterval(search_name,1000);
            $(this).addClass("autoInputWidth");
         });
         
         $$input.blur(function(){
            $(this).removeClass("autoInputWidth");   
         });
         
         $$input.keydown(function(event){
            var keyCode = event.which;
            if(keyCode == 8)
            {
               if($(this).val() == "")
               {
                  var oem = $$appendDom.find("em");
                  if(oem.length >= 0)
                  {
                     var lastem = $$appendDom.find("em:last");
                     if(!lastem.hasClass("active"))
                        lastem.addClass("active");
                     else
                        lastem.remove();   
                  }         
               }   
            }
         });
      }
      
      function search_name()
      {
         var key = $$input.val();
         var is_mail_m = $$input.parent(".read_detail");
         
         if(key!="")
         {
            if(key!=_tmp_key)
            {
               _tmp_key = key;

               $.get(url,{"KWORD":key,"P":p},function(data){
                  if(data=="") return;
                  $$list.html(searchHtml).find("ul.contact-list").empty().append(data);
                  
                  //�����ѯ���ݣ������ϵ��
                  oli = $$list.find(".contact-list li");
                  oli.live("click",function()
                  {
                     var _oSelect_name = $(this).attr("q_name");
                     var _oSelect_uid = $(this).attr("q_id");
                     var _oSelect_user_id = $(this).attr("q_user_id");
                     var _selected = false;
                     
                     if($$appendDom.html()!="")
                     {
                        $$appendDom.find("em").each(function()
                        {
                           var uid = $(this).attr("uid");
                           if(_oSelect_uid == uid){
                              _selected = true;
                              return false;
                           } 
                        });      
                     }
                     
                     if(!_selected)
                     {
                        $$appendDom.append("<em uid='"+_oSelect_uid+"' userid='"+_oSelect_user_id+"'>" + _oSelect_name +"</em>");
                     }
                     $$input.val("");
                     clearInterval(searchInterval);
                     searchInterval = null;
                     is_mail_m.removeClass("hasnoborder");
                     $$input.blur();
                     $$list.empty();
                     return;
                  });
                
                  if(is_mail_m.length > 0)
                     is_mail_m.addClass("hasnoborder");
                     
                  var offset = $$input.offset();
                  $$list.find("#wrapper_plist").css("top",offset.top - 10).show();
                  var Scroll_plist = new iScroll($$list.find("#wrapper_plist").get(0));
               });
            } 
         }else{
            _tmp_key = key;
            
            if(Scroll_plist)
               Scroll_plist.destroy();
            $$list.find("#wrapper_plist").hide();
            is_mail_m.removeClass("hasnoborder"); 
            $$list.empty();   
         }   
      }
      return{
         init: init    
      }
   }
});
   
function reback(from,to){
   $("#header_"+from).hide();
   $("#header_"+to).show();
   $("#page_"+from).hide();
   $(".pages").hide();
   $("#page_"+to).show();
   //pageInit(to);
   eval("window.oiScroll = window.oiScroll_" + to);
   pageTo(to);
}

function pageTo(f){
   tiScroll = new $.tiScroll();
   tiScroll.setPageId(f);
}
   
function gohome(){
	if(typeof(mobile_app_home) == "function")
		mobile_app_home();
	else
   	location.href = "/pda/main.php?P="+p;   
}

// 2012/3/26 17:42:31 lp loadingЧ��
$.ProLoading = {
   show:function(msg){
      var $$msg = $(".ui-loader h1");
      org_msg = $$msg.text();
      if(msg != "")
         $$msg.text(msg);
      $("#overlay").show();
      $(".ui-loader").show();       
   },
   hide:function(){
      $(".ui-loader h1").empty().text(td_lang.pda.msg_2);
      $("#overlay").hide();
      $(".ui-loader").hide();   
   }   
}

$.mutiMenu = {
   init:function(menu){
      var $$mitiMenu = $(".mutiMenuLayer");
      var $$opts = $$mitiMenu.find(".opts");
      $$opts.empty().append(menu);      
   },
   show:function(){
      $("#overlay").addClass("overlayGray").fadeIn("fast");
      $(".mutiMenuLayer").show();
   },
   hide:function(){
      $("#overlay").removeClass("overlayGray").hide();
      $(".mutiMenuLayer").hide();  
   }
}

$("#overlay").live("click",function(e){
   e.stopPropagation();
   if($(this).hasClass("overlayGray"))
   {
      $.mutiMenu.hide();      
   }  
})

//2012/4/10 16:04:40 lp 0409 IOS�ͻ��˴򿪸���
function readAttach(obj,from_page)
{
   //Ĭ�ϻ�ȡ��ǰ���ӵĶ���pages
   if(!from_page){
      var oPid = obj.parents(".pages").attr("id");
      if(oPid!="")
         from_page = oPid.substr(5);
   }
   
   //���ݸ����ڲ�ͬģ��Ӳ�ͬҳ�淵�ص�Page_id��¼
   if(typeof(g_pre_page) != "undefined")
      g_pre_page = from_page;  
   
   //IOS�ͻ��˴�
   if(P_VER == 5)
   {    
      var is_image = obj.attr("is_image");
      var url="message:" + is_image + ":" +obj.attr("_href");
      document.location = url;   
      return false;      
   }else{
      //IOS������д�
      if(isIDevice){
         $.ProLoading.show(td_lang.pda.msg_9);
         browserView(obj);
         $("#header_"+from_page).hide();
         $("#header_attach_read").show();         
      }
   }
}

function browserView(obj)
{
   var attach_container = $("#page_attach_read #scroller_attach_read");
   var is_image = obj.attr("is_image");
   if(is_image == 1)
   {
      var im = new Image();
      im.src = obj.attr("_href");

      $(im).load(function(){
         $(im).attr('src',obj.attr("_href"));
         oIwidth = im.width;
         oIheight = im.height;
         $("#scroller_attach_read").css({"height":oIheight,"width":oIwidth});
         $("#page_attach_read").show('fast',function(){
            pageInit("attach_read");$.ProLoading.hide();
         });
      });
      
      $$_tmp_dom = attach_container.html();
      
      attach_container.empty().append($(im));
      return false;
   }else{
      
      if(typeof($$_tmp_dom)!= "undefined")
         attach_container.empty().html($$_tmp_dom);
            
      attach_container.find("iframe").attr("src",obj.attr("_href"));
      $("#wrapper_attach_read").css({"overflow":"scroll"});
      $("#file_iframe").load(function(){
         var thisheight = $(this).contents().find("body")[0].scrollHeight; 
         var thiswidth = $(this).contents().find("body")[0].scrollWidth; 
         $(this).height(thisheight).width(thiswidth);
         $("#layer").height(thisheight).width(thiswidth);
         $("#scroller_attach_read").css({"height":thisheight,"width":thiswidth});
         $("#page_attach_read").show('fast',function(){
            pageInit("attach_read");$.ProLoading.hide();
         });
      });
   } 
}


function sprintf()
{
    var arg = arguments,
        str = arg[0] || '',
        i, n;
    for (i = 1, n = arg.length; i < n; i++) {
        str = str.replace(/%s/, arg[i]);
    }
    return str;
}

function reMakeMessage(str){
   return "<div class='no_msg'>"+str+"</div>";   
}

function isEmail(str){
   res = /^[0-9a-zA-Z_\-\.]+@[0-9a-zA-Z_\-]+(\.[0-9a-zA-Z_\-]+)*$/;
   var re = new RegExp(res);
   return !(str.match(re) == null);
}

function checkFuncExists(func_name){
   try{
      if(typeof(eval(func_name)) == "function")
      {
         return true;   
      }  
   }catch(e){
      return false;
   }   
} 
function getCookie(name)
{
	 var arr = document.cookie.split("; ");
	 for(i=0;i<arr.length;i++)
		 if (arr[i].split("=")[0] == name)
			return unescape(arr[i].split("=")[1]);
	 return null;
}
function setCookie(name,value, paras) {
   var today = new Date();
   var expires = new Date();
   expires.setTime(today.getTime() + 1000*60*60*24*2000);
   
   var path = null;
   if(typeof(paras) == "object")
   {
      if(typeof(paras.expires) != "undefined")
         expires = paras.expires;
      if(typeof(paras.path) != "undefined")
         path = paras.path;
   }
   value === '' && expires.setTime(today.getTime() -10000); //����ֵɾ��cookie
   document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() + (path ? '; path=' + path : '');

}
function echoCookie(){
   var c = unescape(getCookie("city_cookie"));
   c = (c != '' && c != 'null' )? c :"��";
   if(c != ''){
      return c;
   }
}

function fixZoomPageAttachSize(page)
{
   var sw = window.screen.width;
   var titlew = $(".read_attach a span:first").width();
   if((titlew + 86 + 20) > sw)
   {
      if($("#page_" +page + " .read_content").width() <= sw )
      {
         $("#page_" +page + " .scroller").css("width",sw + "px");
      }
      $(".read_attach").css("max-width", (sw - 20) + "px");     
   }
}

//2012/6/8 16:43:04 lp ��������
function initMobiScrollDate(preset,obj)
{      
   var opts = {
      'date': {
         preset: preset,
         theme: 'sense-ui',
         display: 'modal',
         mode: 'scroller',
         dateOrder: 'ymmdd',
         dateFormat: 'yy-mm-dd',
         dayNamesShort: ['����', '��һ', '�ܶ�', '����', '����', '����', '����'],
         monthText: '�·�',
         dayText: '��',
         yearText: '��',
         beforeShow: function(inst) {
            inst.setDate($.scroller.parseDate('yy-mm-dd', input.value));
         }
      }
   };
   return obj.scroller($.extend(opts[preset],{}));  
}

//2012/6/18 3:01:12 lp �������
function isChineseChar(str){     
   var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]$/;  
   return reg.test(str);  
}

//�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
function fixDbClick(e){
   var last_click_timer = this.getAttribute('_last_click_timer_'),
   this_click_timer = (new Date).getTime();

   if(this_click_timer - last_click_timer < 1000){       
      e.stopPropagation();
      return false;
   }
   this.setAttribute('_last_click_timer_', this_click_timer);
}
