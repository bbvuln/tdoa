
//-- 标签 --
(function($){
   var scrollIncrement = 100;
   var scrollDuration = 400;
   var tabsContainer = null;
   var tabsLeftScroll = null;
   var tabsRightScroll = null;
   var panelsContainer = null;
   var secondTabsContainer = null;
   
    $.fn.tabs = function(options, param){
        if (typeof options == 'string') {
            switch(options) {
               case 'add':
                    return addTab(param);
                case 'close':
                    return closeTab(param);
                case 'select':
                    return selectTab(param);
                case 'exists':
                    return exists(param);
                case 'selected':
                    return selected();
               default:
                  return;
            }
        }
        
        scrollIncrement = options.scrollIncrement || scrollIncrement;
        scrollDuration = options.scrollDuration || scrollDuration;
        tabsContainer = this;
        tabsLeftScroll = $('#'+options.tabsLeftScroll) || tabsLeftScroll;
        tabsRightScroll = $('#'+options.tabsRightScroll) || tabsRightScroll;
        panelsContainer = $('#'+options.panelsContainer) || panelsContainer;
        secondTabsContainer = $('#'+options.secondTabsContainer) || panelsContainer;
        
        //标签栏宽度变化
      tabsContainer.bind('_resize', function(){
         if(tabsContainer.outerWidth() < tabsContainer.attr('scrollWidth'))
         {
            tabsLeftScroll.show();
            tabsRightScroll.show();
         }
         else
         {
            tabsLeftScroll.hide();
            tabsRightScroll.hide();
         }
      });
      
      //标签左右滚动事件
      tabsLeftScroll.hover(
         function(){$(this).addClass('active');},
         function(){$(this).removeClass('active');}
      );
      tabsRightScroll.hover(
         function(){$(this).addClass('active');},
         function(){$(this).removeClass('active');}
      );
      tabsLeftScroll.bind('click', function(){
         var scrollTo = tabsContainer.scrollLeft() - scrollIncrement;
         if(scrollTo < scrollIncrement)//如果不够一个tab宽度，则滚动到头部
            scrollTo = 0;
         tabsContainer.animate({scrollLeft: scrollTo}, scrollDuration);
      });
      tabsRightScroll.bind('click', function(){
         var scrollTo = tabsContainer.scrollLeft() + scrollIncrement;
         if(scrollTo + scrollIncrement > tabsContainer.attr('scrollWidth'))
            scrollTo = tabsContainer.attr('scrollWidth');
         tabsContainer.animate({scrollLeft: scrollTo}, scrollDuration);
      });
      
      //标签事件
      $('div > a.tab', tabsContainer).live('click', function(){
         selectTab($(this).attr('index'));
      });
      $('div > a.tab', tabsContainer).live('mousedown', function(event){
         if($.browser.msie && event.button == 4 || !$.browser.msie && event.button == 1)
            if($(this).attr('closable') == "true")
               closeTab($(this).attr('index'));
      });
      $('div > a.tab', tabsContainer).live('dblclick', function(){
         if($(this).attr('closable') == "true")
            closeTab($(this).attr('index'));
      });
      $('div > a.close', tabsContainer).live('click', function(){
        closeTab($(this).attr('index'));
      });
    };
    
    function addTab(param){
       if(!param.id) return;
       if(exists(param.id))
       {
          selectTab(param.id);
          return;
       }
       
       var html = '<div id="tabs_' + param.id + '"><a href="javascript:;" id="tabs_link_' + param.id + '" class="tab" index="' + param.id + '" closable="' + param.closable + '" hidefocus="hidefocus">' + param.title + '</a>';
       if(param.closable)
          html += '<a href="javascript:;" class="close" index="' + param.id + '" hidefocus="hidefocus"></a>';
       html += '</div>';
       $(html).appendTo(tabsContainer);
       $('<div id="tabs_' + param.id + '_panel" class="tabs-panel" style="' + param.style + '">' + param.content + '</div>').appendTo(panelsContainer);
       
       tabsContainer.triggerHandler('_resize');
       if(param.selected)
          selectTab(param.id);
   }
   
    function closeTab(id){
       var iframe = window.frames['tabs_'+id+'_iframe'];
       try{
          if(iframe && typeof(iframe.onclose) == 'function')
          {
             if(!iframe.onclose())
                return;
          }
       } catch(e){}
       
       var nextTab = $('#tabs_'+id, tabsContainer).next();
       $('tabs_'+id+'_iframe').remove();
       $('#tabs_'+id, tabsContainer).remove();
       $('#tabs_'+id+'_panel', panelsContainer).remove();
       $('#second_tabs_'+id, secondTabsContainer).remove();
       
       if(!nextTab.is('div'))
          nextTab = $('div', tabsContainer).last();
       var nextId = nextTab.attr('id');
       
       tabsContainer.triggerHandler('_resize');
       tabsContainer.triggerHandler('_close');
       
       if(nextId)
       {
          selectTab(nextId.substr(5));
       }
       
       if($.browser.msie)
         CollectGarbage();
   }
   
    function selectTab(id){
        if(!exists(id)) return;
        $('div', tabsContainer).removeClass('selected');
        $('.tabs-panel', panelsContainer).removeClass('selected');
        $('#tabs_'+id, tabsContainer).addClass('selected');
        $('#tabs_'+id+'_panel', panelsContainer).addClass('selected');
        
        if(!$('#tabs_'+id+'_iframe').attr('src') && $('#tabs_'+id+'_iframe').attr('_src'))
        {
            $('#tabs_'+id+'_iframe').attr('src', $('#tabs_'+id+'_iframe').attr('_src'));
        }
        else
        {
            var iframe = window.frames['tabs_'+id+'_iframe'];
            if(iframe && typeof(iframe.onactive) == 'function')
                iframe.onactive();
        }
        
        if(typeof(SetWin8Style) == 'function')
            SetWin8Style($('#tabs_'+id+'_iframe').attr('src'));
        
        scrollTabVisible(id);
    }
   
    function exists(id){
       return $('#tabs_'+id, tabsContainer).length > 0;
   }
    
    function selected(){
       return $('div.selected:first', tabsContainer).attr('id').substring(5);
   }
    
    function scrollTabVisible(id){
       var tabsOffsetLeft = $('#tabs_'+id, tabsContainer).offset().left;
       var tabsWidth = $('#tabs_'+id, tabsContainer).outerWidth();
       var containerOffsetLeft = tabsContainer.offset().left;
       var containerWidth = tabsContainer.outerWidth();
       var containerScrollLeft  = tabsContainer.scrollLeft();
       if(tabsOffsetLeft > containerOffsetLeft && tabsOffsetLeft + tabsWidth > containerOffsetLeft + containerWidth) //要选中的标签的左侧可见，右侧不可见
       {
          var scrollTo = (tabsOffsetLeft + tabsWidth) - (containerOffsetLeft + containerWidth) + containerScrollLeft;
          tabsContainer.animate({scrollLeft:scrollTo}, scrollDuration);
       }
       else if(tabsOffsetLeft < containerOffsetLeft) //要选中的标签的右侧可见，左侧不可见
       {
          var scrollTo = containerScrollLeft - (containerOffsetLeft - tabsOffsetLeft);
          tabsContainer.animate({scrollLeft:scrollTo}, scrollDuration);
       }
       
       $('div.second-tabs-container:visible', secondTabsContainer).hide();
       $('#second_tabs_' + id).show();
       
      var wWidth = (window.innerWidth || (window.document.documentElement.clientWidth || window.document.body.clientWidth));
       var maxWidth = wWidth - secondTabsContainer.next().outerWidth();
       var secondTabs = $('#second_tabs_' + id);
       var secondTabsWidth = secondTabs.outerWidth();
       var left = tabsOffsetLeft + Math.floor(tabsWidth/2) - Math.floor(secondTabsWidth/2);
       left = Math.min(left, maxWidth-secondTabsWidth);
       left = Math.max(0, left);
       secondTabs.animate({left:left}, scrollDuration);
   }
})(jQuery);

//-- 滚动条 --
(function($){
$.fn.extend({
   mousewheel:function(Func){
      return this.each(function(){
         var _self = this;
          _self.D = 0;//滚动方向
         if($.browser.msie||$.browser.safari){
            _self.onmousewheel=function(){_self.D = event.wheelDelta;event.returnValue = false;Func && Func.call(_self);};
         }else{
            _self.addEventListener("DOMMouseScroll",function(e){
               _self.D = e.detail>0?-120:120;
               e.preventDefault();
               Func && Func.call(_self);
            },false); 
         }
      });
   }
});
$.fn.extend({
   jscroll:function(j){
      return this.each(function(){
         var jun = {
            W:"15px",
            BarPos:"up",
            Btn:true,
            AutoHide:true,
            Fn:function(){}
         };
         j = j || {};
         j.W = j.W||jun.W;
         j.BarPos = j.BarPos||jun.BarPos;
         j.Btn = j.Btn||jun.Btn;
         j.AutoHide = j.AutoHide||jun.AutoHide;
         j.Fn = j.Fn||jun.Fn;
         var _self = this;
         var Stime,Sp=0,Isup=0;
         $(_self).css({overflow:"hidden",position:"relative",padding:"0px",margin:"0px"});
         var dw = $(_self).width(), dh = $(_self).height();//dh = $(_self).height()-1;
         var sw = j.W ? parseInt(j.W) : 21;
         var sl = dw - sw
         var bw = j.Btn==true ? sw : 0;
         if($(_self).children(".jscroll-c").height()==null){//存在性检测
         $(_self).wrapInner("<div class='jscroll-c' style='top:0px;z-index:9999;zoom:1;position:relative'></div>");
         //$(_self).children(".jscroll-c").prepend("<div style='height:0px;overflow:hidden'></div>");
         $(_self).append("<div class='jscroll-e' unselectable='on' style=' height:100%;top:0px;right:0;-moz-user-select:none;position:absolute;overflow:hidden;z-index:10000;'><div class='jscroll-u' style='position:absolute;top:0px;width:100%;left:0;overflow:hidden'></div><div class='jscroll-h'  unselectable='on' style='position:absolute;left:0;-moz-user-select:none;'><div class='jscroll-hu'></div><div class='jscroll-hc'></div><div class='jscroll-hd'></div></div><div class='jscroll-d' style='position:absolute;bottom:0px;width:100%;left:0;overflow:hidden'></div></div>");
         }
         var jscrollc = $(_self).children(".jscroll-c");
         var jscrolle = $(_self).children(".jscroll-e");
         var jscrollh = jscrolle.children(".jscroll-h");
         var jscrollhu = jscrollh.children(".jscroll-hu");
         var jscrollhc = jscrollh.children(".jscroll-hc");
         var jscrollhd = jscrollh.children(".jscroll-hd");
         var jscrollu = jscrolle.children(".jscroll-u");
         var jscrolld = jscrolle.children(".jscroll-d");
         if($.browser.msie){document.execCommand("BackgroundImageCache", false, true);}
         jscrollc.css({"padding-right":sw});
         jscrolle.css({width:sw});
         jscrollh.css({top:bw,width:sw});
         jscrollu.css({height:bw});
         jscrolld.css({height:bw});
         jscrolle.addClass('jscroll-e-out');
         jscrollhu.addClass('jscroll-hu-out');
         jscrollhc.addClass('jscroll-hc-out');
         jscrollhd.addClass('jscroll-hd-out');
         jscrollu.addClass('jscroll-u-out');
         jscrolld.addClass('jscroll-d-out');
         jscrollh.hover(
            function(){
               if(Isup==0){
                  jscrollhu.addClass('jscroll-hu-hover');
                  jscrollhc.addClass('jscroll-hc-hover');
                  jscrollhd.addClass('jscroll-hd-hover');
               }
            },
            function(){
               if(Isup==0){
                  jscrollhu.removeClass('jscroll-hu-hover');
                  jscrollhc.removeClass('jscroll-hc-hover');
                  jscrollhd.removeClass('jscroll-hd-hover');
               }
            }
         );
         //jscrollh.hover(function(){alert('a');},function(){alert('b');})
         jscrollu.hover(function(){if(Isup==0)$(this).addClass('jscroll-u-hover')},function(){if(Isup==0)$(this).removeClass('jscroll-u-hover')})
         jscrolld.hover(function(){if(Isup==0)$(this).addClass('jscroll-d-hover')},function(){if(Isup==0)$(this).removeClass('jscroll-d-hover')})
         var sch = jscrollc.height();
         //var sh = Math.pow(dh,2) / sch ;//Math.pow(x,y)x的y次方
         var sh = (dh-2*bw)*dh / sch;
         if(sh<10){sh=10}
         var wh = sh/6//滚动时候跳动幅度
      //   sh = parseInt(sh);
         var curT = 0,allowS=false;
         jscrollh.height(sh);
         jscrollhc.height(sh-jscrollhu.height()-jscrollhd.height());
         if(sch<=dh)
         {
            jscrollc.css({padding:0});
            jscrolle.css({display:"none"});
            if(j.AutoHide)
            {
               $(_self).unbind('mouseenter');
               $(_self).unbind('mouseleave');
            }
         }
         else
         {
            jscrolle.css({display:""})
            allowS=true;
            if(j.AutoHide)
            {
               $(_self).bind('mouseenter', function(){$('.jscroll-e', $(this)).show();});
               $(_self).bind('mouseleave', function(){$('.jscroll-e', $(this)).hide();});
            }
         }
         if(j.BarPos!="up"){
         curT=dh-sh-bw;
         setT();
         }
         jscrollh.bind("mousedown",function(e){
            j['Fn'] && j['Fn'].call(_self);
            Isup=1;
            jscrollhu.addClass('jscroll-hu-focus');
            jscrollhc.addClass('jscroll-hc-focus');
            jscrollhd.addClass('jscroll-hd-focus');
            var pageY = e.pageY ,t = parseInt($(this).css("top"));
            $(document).mousemove(function(e2){
                curT =t+ e2.pageY - pageY;//pageY浏览器可视区域鼠标位置，screenY屏幕可视区域鼠标位置
                  setT();
            });
            $(document).mouseup(function(){
               Isup=0;
               jscrollhu.removeClass('jscroll-hu-focus');
               jscrollhc.removeClass('jscroll-hc-focus');
               jscrollhd.removeClass('jscroll-hd-focus');
               $(document).unbind('mousedown mousemove mouseup');
            });
            return false;
         });
         jscrollu.bind("mousedown",function(e){
         j['Fn'] && j['Fn'].call(_self);
            Isup=1;
            jscrollu.addClass('jscroll-u-focus');
            _self.timeSetT("u");
            $(document).mouseup(function(){
               Isup=0;
               jscrollu.removeClass('jscroll-u-focus');
               $(document).unbind('mousedown mousemove mouseup');
               clearTimeout(Stime);
               Sp=0;
            });
            return false;
         });
         jscrolld.bind("mousedown",function(e){
         j['Fn'] && j['Fn'].call(_self);
            Isup=1;
            jscrolld.addClass('jscroll-d-focus');
            _self.timeSetT("d");
            $(document).mouseup(function(){
               Isup=0;
               jscrolld.removeClass('jscroll-d-focus');
               $(document).unbind('mousedown mousemove mouseup');
               clearTimeout(Stime);
               Sp=0;
            });
            return false;
         });
         _self.timeSetT = function(d){
            var self=this;
            if(d=="u"){curT-=wh;}else{curT+=wh;}
            setT();
            Sp+=2;
            var t =500 - Sp*50;
            if(t<=0){t=0};
            Stime = setTimeout(function(){self.timeSetT(d);},t);
         }
         jscrolle.bind("mousedown",function(e){
               j['Fn'] && j['Fn'].call(_self);
                     curT = curT + e.pageY - jscrollh.offset().top - sh/2;
                     asetT();
                     return false;
         });
         function asetT(){            
                  if(curT<bw){curT=bw;}
                  if(curT>dh-sh-bw){curT=dh-sh-bw;}
                  jscrollh.stop().animate({top:curT},100);
                  var scT = -((curT-bw)*sch/(dh-2*bw));
                  jscrollc.stop().animate({top:scT},1000);
         };
         function setT(){            
                  if(curT<bw){curT=bw;}
                  if(curT>dh-sh-bw){curT=dh-sh-bw;}
                  jscrollh.css({top:curT});
                  var scT = -((curT-bw)*sch/(dh-2*bw));
                  jscrollc.css({top:scT});
         };
         $(_self).mousewheel(function(){
               if(allowS!=true) return;
               j['Fn'] && j['Fn'].call(_self);
                  if(this.D>0){curT-=wh;}else{curT+=wh;};
                  setT();
         })
      });
   }
});
})(jQuery);
