(function($){
   var scrollIncrement = 100;
   var scrollDuration = 400;
   var tabsContainer = null;
   var tabsLeftScroll = null;
   var tabsRightScroll = null;
   var panelsContainer = null;
   var secondTabsContainer = null;
   var callbacks = {};
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
        tabsContainer = this;
        scrollIncrement = options.scrollIncrement || scrollIncrement;
        scrollDuration = options.scrollDuration || scrollDuration;
        tabsLeftScroll = $('#'+options.tabsLeftScroll) || tabsLeftScroll;
        tabsRightScroll = $('#'+options.tabsRightScroll) || tabsRightScroll;
        panelsContainer = $('#'+options.panelsContainer) || panelsContainer;
        secondTabsContainer = $('#'+options.secondTabsContainer) || panelsContainer;
        callbacks = options.callbacks || {};
		
        tabsContainer.bind('_resize', function(){
            if(tabsContainer.outerWidth() < tabsContainer[0].scrollWidth)
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
      tabsContainer.delegate('div > a.tab','click',function(){
         selectTab($(this).attr('index'));
      });
      tabsContainer.delegate('div > a.tab','mousedown',function(event){
         if(!window.addEventListener && event.button == 4 || window.addEventListener && event.button == 1){
            if($(this).attr('closable') == "true"){
                closeTab($(this).attr('index'));
            }
         }
            
      });
      tabsContainer.delegate('div > a.tab','dblclick',function(){
         if($(this).attr('closable') == "true")
            closeTab($(this).attr('index'));
      });
      tabsContainer.delegate('div > a.close','click',function(){
         closeTab($(this).attr('index'));
      });
    };
    function addTab(param){
       $("#tosbg").length >0 && $("#tosbg").hide(); 
       if(!param.id) return;
       if(exists(param.id))
       {
          selectTab(param.id);
          return;
       }
       param.callback();//启动激光加载进度条
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
       $('#tabs_'+id+'_iframe').remove();
       $('#tabs_'+id, tabsContainer).remove();
       $('#tabs_'+id+'_panel', panelsContainer).remove();
       $('#second_tabs_'+id, secondTabsContainer).remove();
       
       if(!nextTab.is('div'))
          nextTab = $('div', tabsContainer).last();
       var nextId = nextTab.attr('id');
       
       tabsContainer.triggerHandler('_resize');
       tabsContainer.triggerHandler('_close');
       
       if($("#center .tabs-panel").length<=0){
           $("#tosbg").length >0 && $("#tosbg").show(); 
       }
       else{
           $("#tosbg").length >0 && $("#tosbg").hide(); 
       }
        
       if(nextId)
       {
          selectTab(nextId.substr(5));
       }
       
       if(navigator.userAgent.indexOf('MSIE') >= 0)
         CollectGarbage();
       
    }
   
    function selectTab(id){
        $("#tosbg").length >0 && $("#tosbg").hide(); 
        $('body').removeClass('showSearch').removeClass('right-mini');
        $('#eastbar,#searchbar').removeClass('on');
        if(!exists(id)) return;
        $('div', tabsContainer).removeClass('selected');
        var $selected = $('.tabs-panel.selected', panelsContainer)
            .removeClass('selected fadeInDown');
        $('#tabs_'+id, tabsContainer).addClass('selected');
        $('#tabs_'+id+'_panel', panelsContainer).addClass('selected').addClass("animated");
		callbacks && callbacks.selected && callbacks.selected({id:id});
		
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
