function getNewMailLocation(pos){
    var $active = emaillist.getActive(),
        email_id = $active.attr("data-email-id"),
        is_webmail = $active.attr("data-is-webmail");

    if(pos == 1)
       return "/general/email/new/?REPLAY=0&BTN_CLOSE=1&EMAIL_ID="+email_id+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail;
    else if(pos == 3)
        return "/general/email/new/?FW=1&BTN_CLOSE=1&EMAIL_ID="+email_id+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail;
    else if(pos == 6)
        return "/general/email/new/?FW=1&EMAIL_ID="+email_id+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail;
    else if(pos == 2)
       return "/general/email/new/?BTN_CLOSE=1&REPLAY=1&EMAIL_ID="+email_id+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail;
    else
 	 return "/general/email/new/?BTN_CLOSE=1&REPLAY=0&EMAIL_ID="+email_id+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail; 
}

function ResendMailLocation(){
    var email_id = emaillist.getActive().attr("data-email-id");
    return "resend.php?EMAIL_ID="+email_id;
}
function FwsendMailLocation(){
    var email_id = emaillist.getActive().attr("data-email-id");
    return "sent_fw.php?EMAIL_ID="+email_id;
}
function EditMailLocation(){
    var edit_url = emaillist.getActive().attr("data-edit-url");
    return edit_url;
}

function GetFrameContext(){
    var detailFrame = $('detailFrame'), 
        context = detailFrame && detailFrame.contentWindow;
    return context; 
}
function SetFontSize(size){
    var context = GetFrameContext();
    context && context.doZoom && context.doZoom(size);
}
function PrintMail(){
    var context = GetFrameContext();
    if(context && context.print_email)
    {
        context.print_email.call(context);
    }
    else
    {
        context && context.print.call(context);
    }
}
function OpenMailNewWindow(){    
    var context = GetFrameContext();
    window.open(context.location.href+'&BTN_CLOSE=1');
}
function initDocument(){
	if(jQuery && jQuery.fn.tooltip)
    {    
        jQuery('[data-toggle="tooltip"]').tooltip({
            container: 'body'
        });
    }
    
    jQuery("table.mail_list").on("click", "tr",function(){
        if(jQuery(this).attr("class").indexOf('active') >= 0)
            return;

        jQuery("table.mail_list tr").removeClass('active');
        jQuery(this).addClass("active");
        jQuery("#detailFrame").attr("src", jQuery(this).attr("url"));   
        if(jQuery('td.unread', this).length > 0)
        { 
            var count = parseInt(parent.jQuery('#new_count').text());
            count = isNaN(count) ? 0 : count;
            parent.showEmailNew(count-1>0);

            if(count>0&&count!=1)
            {
                parent.jQuery('#new_count').text(count-1);
            }
            else if(count==1)
            {
                parent.jQuery('#new_count').text("");
            }
            else
            {
                parent.jQuery('#new_count').text();
            }
            jQuery('td.unread', this).removeClass("unread");
            jQuery('td.state', this).addClass("read");

        }
        
      
      //控制编辑和再次发送
      var group_count = jQuery(this).attr("group_count");
      var read_flag = jQuery(this).attr("read_flag");
	   var is_webmail = jQuery(this).attr("is_webmail");
	   var no_reply = jQuery(this).attr("no_reply");
	   var read_flag_all=jQuery(this).attr("read_flag_all");

		jQuery("#btn_reply_all").css("display","inline-block");
 
      if(group_count == "1") {
         if(read_flag == "0") {
            jQuery("#btn_edit").css("display","inline-block");
         }else{
            jQuery("#btn_edit").css("display","none");
         }
      } 
      else
      {
      		  if(read_flag_all == "0") {
            jQuery("#btn_edit").css("display","inline-block");
           }else{
            jQuery("#btn_edit").css("display","none");
           }
      		
      }   
      if(no_reply == "1")
         jQuery("#btn_reply").css("display","none");
      else
         jQuery("#btn_reply").css("display","inline-block");
   });
   
   //双击单行
   jQuery("table.mail_list tr").on("dblclick", "tr", function(){
      jQuery("table.mail_list tr").removeClass('active');
      jQuery(this).addClass("active");
      window.open(jQuery(this).attr("url")+"&BTN_CLOSE=1");
   });
   
   jQuery("table.mail_list tr").each(function(){
      var obj = this;
      jQuery('a.open', obj).click(function(){
         window.open(jQuery(obj).attr("url")+"&BTN_CLOSE=1");
      });
   });
   
   //jQuery("table.mail_list tr:last > td").addClass("no-bottom-border");
   if(typeof(bReadLastOne) != 'undefined' && bReadLastOne == "1")
      jQuery("table.mail_list tr:last").trigger("click");
   else
      jQuery("table.mail_list tr:first").trigger("click");
   
   //2010-7-5 LP next email
   jQuery("#btn_next").click(function(){
      //返回选中列的索引
      var now_count = jQuery("table.mail_list tr.active").index();
      if(now_count< jQuery("table.mail_list tr").length-1) {
         jQuery("table.mail_list tr").eq((now_count+1)).trigger("click");
      }else{
         var url = jQuery("#pageNext").attr("href");
         url = url.replace("&READ_LAST=0", "");
         url = url.replace("&READ_LAST=1", "");
         if(url.indexOf('email') >= 0)
            url += "&READ_LAST=0";
         var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
         if(is_ie)
            window.event.returnValue = false;
         location = url;
      }
   });
   
   //2010-7-5 LP prev email
   jQuery("#btn_prev").click(function(){
      //返回选中列的索引
      var now_count = jQuery("table.mail_list tr.active").index();
      if(0 < now_count) {
         jQuery("table.mail_list tr").eq((now_count-1)).trigger("click");
      }else{
         var url = jQuery("#pagePrevious").attr("href");
         url = url.replace("&READ_LAST=0", "");
         url = url.replace("&READ_LAST=1", "");
         if(url.indexOf('email') >= 0)
            url += "&READ_LAST=1";
         var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);
         if(is_ie)
            window.event.returnValue = false;
         location = url;
      }
   });
   
   //2010-7-6 LP print mail
//   jQuery("#btn_print").click(function(){
//      var EMAIL_ID = jQuery("table.mail_list tr.active").attr("email_id");
//      window.open('../print.php?EMAIL_ID='+EMAIL_ID,'','menubar=1,toolbar=1,status=1,resizable=1');   
//   });
   
   //2010-7-6 LP replay mail
   jQuery("#btn_reply").click(function(){return;
      var EMAIL_ID = jQuery("table.mail_list tr.active").attr("email_id");      
	    var is_webmail = jQuery("table.mail_list tr.active").attr("is_webmail");
	    URL="../new/?REPLAY=0&EMAIL_ID="+EMAIL_ID+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail;	    
	    window.location=URL;  
	    //window.open(URL);
      
   });
   
   jQuery("#btn_reply_new").click(function(){
   	  var EMAIL_ID = jQuery("table.mail_list tr.active").attr("email_id");      
	    var is_webmail = jQuery("table.mail_list tr.active").attr("is_webmail");
	    URL="../new/?REPLAY=0&EMAIL_ID="+EMAIL_ID+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail;
      window.location=URL;      
   });
   //20010-11-4 fw_mail 点击转发
      jQuery("#btn_fw").click(function(){
   	  var EMAIL_ID = jQuery("table.mail_list tr.active").attr("email_id");      
	    var is_webmail = jQuery("table.mail_list tr.active").attr("is_webmail");
	    URL="../new/?FW=1&EMAIL_ID="+EMAIL_ID+"&BOX_ID=0&FIELD=&ASC_DESC=&IS_WEBMAIL="+is_webmail;
      window.location=URL;      
   });
        
   /*
   //点击发送按钮
   jQuery("#btn_resend").live("click",function(){
      var email_id = jQuery("table.mail_list tr.active").attr("email_id");
     // window.location = 'resend.php?EMAIL_ID='+email_id;   
   });
    //点击转发按钮
   jQuery("#btn_fw").live("click",function(){
      var email_id = jQuery("table.mail_list tr.active").attr("email_id");
     // window.location = 'resend.php?EMAIL_ID='+email_id;   
   });
   
   
   //点击编辑按钮
   jQuery("#btn_edit").live("click",function(){
      var edit_url = jQuery("table.mail_list tr.active").attr("edit_url");
	  if(!edit_url){alert(td_lang.inc.msg_21);return;}//"页面tr未绑定数据edit_url"
      //window.location = edit_url;   
   });

    //2010-7-15 del mail
    jQuery("#btn_del").click(function(){
	  delete_mail_noconfirm();
   });
   */
   jQuery(document).delegate('[data-radio-type]', 'click', function(){
       var $siblings = jQuery(this).siblings('[data-radio-type="' + this.getAttribute('data-radio-type') + '"]');
       $siblings.find('i.icon-dropdown-checkbox').removeClass('icon-dropdown-checkbox-checked');
       jQuery(this).find('i.icon-dropdown-checkbox').addClass('icon-dropdown-checkbox-checked');       
   });
    //邮件分类     
    jQuery("div.tagdiv a[data-tag-id]").bind('click', function(e)
    {    
        var $this = jQuery(this),
        	tag= this.getAttribute('data-tag-id');
        jQuery("div.tagdiv a").removeClass("active");
        if($this.parents('#moretag_menu').size()){
            jQuery('#moretag span').text( $this.text() );
            jQuery('#moretag').addClass('tagactive');
        }else{
            jQuery('#moretag span').text( '更多' );
            jQuery('#moretag').removeClass('active');
            jQuery(this).addClass("active");
        }
        emaillist.setParam('tag', tag);
    });
}

(function($){
    var MYOA_STATIC_SERVER = window.MYOA_STATIC_SERVER || '';
    if(!$)
    {
        return;
    }
    var EmailList = function()
    {
        this.init.apply(this, arguments);
    };
    $.fn.disableSelect = function(){
        this.attr("unselectable", "on")
            .bind("selectstart", function()
                {
                    return false;
                })
            .css({"-moz-user-select": "none"});
    };
    
    EmailList.prototype = {
        TEMPLATE: {
            searchBar: '<div class="email-list-searchbar"><i class="icon-search"></i><input type="text" name="email-list-search-input" autocomplete="off" value="" hidefocus="true"><button class="btn btn-small" type="button">'+td_lang.general.email.cancel+'</button></div>',
            content: '<div class="email-content"></div><div class="email-empty-tip">'+td_lang.general.email.empty+'</div><div class="email-readmore"><strong>'+td_lang.general.email.readmore+'</strong></div>',
            group: '<dl class="email-list ${className}" data-email-group="${key}"><dt> {{html text}}</dt></dl>',
            item: [
                '<dd class=\'{{if $data.isread=="0"}} unread {{/if}}\' data-editable="${editable}" data-reply="${reply}" data-email-id="${eid}" data-body-id="${bid}" data-is-webmail="${is_webmail}" data-webmail-flag="${webmail_flag}" url="${url}">',
                    '<div class="mail-list-multi-handle"></div>',
                    '<div class="mail-list-time">${time}</div>',
                    '<h3 class="mail-list-user" title="${dept}">{{html user}}</h3>',
                    '{{if hasAttach}} <div class="mail-list-attach"></div> {{/if}}',
                    '{{if hasAttach}} <p class="mail-list-title onattch">{{html hasrf}}{{html title}}</p> {{else}} <p class="mail-list-title">{{html hasrf}}{{html title}}</p> {{/if}}',
                    '<div class="mail-list-flag">{{html flag}}</div>',
                    '{{if sign}} <div class="mail-list-sign" >{{html sign}}</div> {{/if}}',
                '</dd>'                            
            ].join(''),
            tips: '<div class="email-list-tips"></div>',
            signMenu: [
                '<div class="email-sign-menu attach_div">',               
                    '<table><tr>',
                        '<td data-cmd="sign" data-sign-id="4"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/redstar.png"></td>',
                    	'<td data-cmd="sign" data-sign-id="3"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/yellowstar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="2"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/greenstar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="1"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/greystar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="0"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/whitestar.png"></td>',
                    '</tr></table>',
                '</div>'
            ].join(''),
            splitter:'<div class="splitter-overlay"></div><div class="splitter-bar-scroll" id="splitter-bar-scroll"><div class="splitter-bar-bgd"></div><div class="splitter-bar-vertical" id="splitter-bar"></div><div class="splitter-bar-vertical" id="splitter-bar-vertical"></div></div>'
        },
        init: function(id, opts)
        {
            this.id = id;
            this.callbacks = opts && opts.callbacks || {};
            this.params = $.extend(this.params, opts.params);
            this.url = opts.url;
            this.key = opts.key || 'data-email-id';
            this.$wrapper = $('#' + id);
            this.$content = this.$wrapper.html( this.TEMPLATE.content ).children(":eq(0)");
            this.$searchBar = $( this.TEMPLATE.searchBar ).insertBefore( this.$wrapper );
            this.$wrapper.scroll( $.proxy(this.scrollMonitor, this) );
            this.$readmore = this.$wrapper.find('.email-readmore').click( $.proxy(this.getMore, this) );
            this.$toolbar = $(opts.toolbar);
            this.$signMenu = $(this.TEMPLATE.signMenu).appendTo('body');
            this.$tips = $(this.TEMPLATE.tips).insertAfter(this.$wrapper);
            this.$emaillistpanel=$(".email-list-panel");
            this.$splitterbar=$(this.TEMPLATE.splitter).insertBefore(this.$emaillistpanel);
            opts.resizable && this.dragSplitter();
            this.bindEvent();
            this.getMore();
        },
        searchMode: false,
        multiMode: false,
        params:{
            timestamp: '',
            curnum: 0,
            pagelimit: 20,
            total: '',
            boxid: '',
            orderby: 'SEND_TIME',
            asc: 0,
            keyword: '',
            emailtype: 'ALLMAIL'
        },
        bindEvent: function()
        {
            var self = this,
                searchtimer = null;
                
            $(window).resize( $.proxy(this.autoHeight, this) );
            
            self.$wrapper.disableSelect();
            self.$signMenu.disableSelect();
            
            this.$content.delegate('dd', 'click', function(e)
            {
                var $this = $(this),
                    cbs = self.callbacks,
                    id = this.getAttribute(self.key),
                    isActive = $this.hasClass('active'),
                    $item = self.$content.find('dd'),
                    $active = self.$content.find('.active');
                //按ctrl点击进入复选模式    
                if(e.metaKey)
                {
                    self.multiply();
                }                            
                if(e.shiftKey && !self.multiMode)
                {
                    self.multiply();                    
                    if($active.size())
                    {
                        var min = Math.min($item.index($active), $item.index($this)),
                            max = Math.max($item.index($active), $item.index($this));
                        $item.each(function(i, n)
                        {
                            if(i > min && i < max)
                            {     
                                $(n).addClass('active');
                                cbs.multiSelected && cbs.multiSelected($(n), true);
                            }                        
                        });    
                    }
                }
                if(!self.multiMode)
                {
                    self.$content.find('dd').removeClass('active');
                    $this.addClass('active');
                    cbs.singleSelected && cbs.singleSelected($this);
                }
                else
                {
                    $this[ isActive ? 'removeClass' : 'addClass' ]('active');                                    
                    cbs.multiSelected && cbs.multiSelected($this, !isActive);
                }
            });
            
            this.$content.delegate('dt', 'click', function(e)
            {
                var $this = $(this),
                    cbs = self.callbacks,
                    isActive = $this.data('emailActive');
                
                if(self.multiMode)
                {
                    $this.siblings('dd').each(function()
                    {
                        var $dd = $(this)[ isActive ? 'removeClass' : 'addClass' ]('active');
                        cbs.multiSelected && cbs.multiSelected($dd, !isActive);
                    });  
                    $this.data('emailActive', !isActive)    
                }
            });
            
            
            
            this.$content.delegate('dd', 'dblclick', function(e)
            {
                window.open(jQuery(this).attr("url")+"&BTN_CLOSE=1");
            });
            
            this.$content.delegate('dd .mail-list-sign', 'mouseenter', function(e)
            {
                var eid = $(this).parent('dd').attr(self.key);
                            
                    var pos = $(this).offset();
                    self.$signMenu.css({
                        top: pos.top-6,
                        left: pos.left+20,
                        display: 'block'
                    }).data('emailid', eid);                    
               
            }); 
            
            this.$content.delegate('dd .mail-list-sign', 'mouseleave', function(e)
            {
                var eid = $(this).parent('dd').attr(self.key);
            
                    self.$signMenu.data('menutimer', setTimeout(function()
                    {
                        self.$signMenu.hide().removeData('emailid');
                    }, 200))
              
            });
            
            this.$signMenu.mouseleave(function()
            {
                this.style.display = 'none';
                $.removeData(this, 'emailid');
            }).mouseenter(function()
            {
                var timer = $(this).data('menutimer');
                timer && clearTimeout(timer);
            });
            
            this.$signMenu.delegate('[data-cmd="sign"]', 'click', function(e)
            {
                var eid = self.$signMenu.data('emailid'),
                    sid = this.getAttribute('data-sign-id'); 
                self.signmail(eid, sid);                    
            });
            
            this.$searchBar.find('[name="email-list-search-input"]').keyup(function()
            {
                var value = this.value;
                searchtimer && clearTimeout(searchtimer);
                searchtimer = setTimeout(function ()
                {
                    self.params.keyword = value;
                    self.refresh();
                },1000)
            });
            
            this.$searchBar.parents('form').submit(function(e){  
                self.refresh();      
                e.preventDefault();
            });
            this.$searchBar.find('button').click(function()
            {
                self.$toolbar.find('[data-cmd="search"]').click();
            });                        
            
            this.$toolbar.delegate('[data-cmd]', 'click', function()
            {
                var $this = $(this),
                    cmd = this.getAttribute('data-cmd'),
                    isActive = $this.hasClass('active');
                if(cmd == 'search')
                {
                    self[ isActive ? 'hideSearchBar' : 'showSearchBar']();
                    $this[ isActive ? 'removeClass' : 'addClass' ]('btn-info active');
                    $this.find('i')[ isActive ? 'removeClass' : 'addClass' ]('icon-white');
                }
                else if(cmd == 'multi')
                {
                    self[ isActive ? 'demultiply' : 'multiply']();
                }
                else if(cmd == 'refresh')
                {
                    self.refresh();
                }
            });
        },
        scrollMonitor: function()
        {
            if(this._scrollMonitorDisabled){
                return;
            }
            var self = this,
                $wrapper = this.$wrapper,
                $content = this.$content,
                wrapperHeight = $wrapper.height(),
                contentHeight = $content.height();
            if($wrapper.scrollTop() + wrapperHeight + 0 > contentHeight)
            {
                this.getMore();
            }
        },
        enableScrollMonitor: function()
        {
            this._scrollMonitorDisabled = false;
        },
        disableScorllMonitor: function()
        {
            this._scrollMonitorDisabled = true;
        },
        setParam: function(key, value)
        {
            if( key && (key in this.params) ){
                this.params[key] = value;
                this.refresh();
            }
        },
        refresh: function()
        {
            this.$content[0].innerHTML = '';                        
            this.params.timestamp = '';
            this.params.curnum = 0;
            this.getMore();
        },
        setOrderType: function(s)
        {
            this.params.orderby = s;
            this.refresh();
        },
        setSort: function(s)
        {
            if(s == 'asc')
            {
                this.params.asc = 1;
            }
            else if(s == 'desc')
            {
                this.params.asc = 0;
            }
            this.refresh();
        },
        showSearchBar: function()
        {
            this.searchMode = true;
            this.$searchBar.show();
            this.$searchBar.find('input').focus();
            this.autoHeight();
        },
        hideSearchBar: function()
        {
            this.searchMode = false;
            this.$searchBar.hide();
            this.$searchBar.find('input').val('');
            this.autoHeight();               
            
            this.params.keyword = '';
            this.refresh();
        },
        multiply: function()
        {
            this.multiMode = true;
            this.$wrapper.addClass('multi');
            this.callbacks.multiply && this.callbacks.multiply.call(this);
        },
        demultiply: function()
        {                    
            this.multiMode = false;
            this.$wrapper.removeClass('multi');
            this.$content.find('dd.active').first().click();
            this.callbacks.demultiply && this.callbacks.demultiply.call(this);
        },
        next: function()
        {
            var $store = this.$content.find('dd'),
                $active = this.getActive(),
                index = $store.index($active);
            
            this.scrollToActive();    
                
            if(index + 1 == $store.size())
            {
                $store.eq(index).click();
            }
            else
            {
                $store.eq(index+1).click();                
            }
        },
        prev: function()
        {    
            var $store = this.$content.find('dd'),
                $active = this.getActive(),
                index = $store.index($active);                
            
            if(index == 0)
            {
                $store.eq(index).click();
            }
            else
            {
                $store.eq(index-1).click();                
            }
            this.scrollToActive();  
        }, 
        'delete': function(id, closestActive)
        {
            var $dd = this.$content.find('dd'),
                size = $dd.size(),
                $target = this.$content.find('dd[' + this.key + '="' + id + '"]'),
                index = $dd.index($target),
                $group = $target.parent('dl');
            this.disableScorllMonitor();    
            
            if(size == 1)
            {
                this.callbacks.empty && this.callbacks.empty.call(this);
            }   
            else if(index == size - 1)
            {
                $dd.eq(index - 1).click();
            }
            else
            {
                $dd.eq(index + 1).click();
            }            
            
            $target.remove();    
            if($group.find('dd').size() <= 0)
            {
                $group.remove();
            }            
            this.enableScrollMonitor();
        },
        multiDelete: function(id)
        {
            var key = this.key,
                $content = this.$content,
                store = $.trim(id).split(',');
            this.disableScorllMonitor();    
            $.each(store, function()
            {
                if(this == '')
                {
                    return;
                }
                $content.find('dd[' + key + '="' + this + '"]').remove();
            });
            
            $content.find('dl').not(':has(dd)').remove();
            this.enableScrollMonitor();
            
            if($content.find('dd').size() == 0)
            {            
                this.callbacks.empty && this.callbacks.empty.call(this);                
            }
            
            this.multiMode && this.callbacks.multiply && this.callbacks.multiply.call(this);
        },
        deleteByStrs: function(strs)
        {
            var single = !strs.match(/,/g);
            this[ (!single || this.multiMode) ? 'multiDelete' : 'delete' ](strs);           
        },
        countNum: function()
        {
            this.params.curnum = this.$content.find('dd').size();
        },
        getActive: function()
        {
            return this.$content.find('dd.active');
        },
        getActiveId: function()
        {
            var key = this.key,
                s = [],
                $active = this.getActive();
            $active.each(function()
            {
                s.push(this.getAttribute(key));
            });
            return s.join(',');
        },
        getActiveCount: function()
        {
            return this.$content.find('dd.active').size();
        },
        scrollToActive: function()
        {
            var top = this.getActive().position().top;
            this.$wrapper.scrollTop(this.$wrapper.scrollTop() + top);
        },
        signmail: function(emailid, signid)
        {
            var $target = this.$content.find('dd[' + this.key + '="' + emailid + '"]');
            $.get('/general/email/sign_email.php', {
                'DELETE_STR': emailid,
                'SIGN': signid
            }, function(ret)
            {
                var signmap = ['whitestar', 'greystar', 'greenstar', 'yellowstar', 'redstar'];
                ret=parseInt(ret);
                var img = "<img src='"+MYOA_STATIC_SERVER+"/static/images/email/" + (signmap[ret] || 'whitestar') + ".png' width='16' height='16' align='absmiddle'/>"
                $target.find('.mail-list-sign').html(img);
            })
        },
        autoHeight: function()
        {
            var top = 0,
                h = this.$wrapper.parent().height();
            if(this.searchMode)
            {
                top = this.$searchBar.height();
                h = h - top;
            }
            this.$wrapper.height( h ).animate({ 'top': top }, 300);
            
        },
        showLoading: function()
        {
            this.loading = true;
            this.showTips(td_lang.global.loading);
            //加载中..
        },
        hideLoading: function()
        {
            this.loading = false;
            this.hideTips();
        },        
        showTips: function(text)
        {
            this.$tips.html(text).show();
        }, 
        hideTips: function(text)
        {
            this.$tips.hide();
        },
        refreshListClass: function()
        {
            var cls = ['email-list-1', 'email-list-2', 'email-list-3', 'email-list-4'],
                l = cls.length;
            this.$content.find('dl').each(function(i, n){
                if( i > l )
                {
                    return false;
                }
                $(this).removeClass( cls.join(' ') ).addClass( cls[i] );
            });
        },
        getMore: function()
        {
            var self = this,
                cb = this.callbacks,
                firstload = this.params.timestamp == '',
                act = firstload ? 'loadfirst' : 'loadmore';
            if(!this.loading)
            {
                this.showLoading();
                this.countNum();
                $.get(self.url, this.params, function(ret)
                {
                    if(typeof ret == 'object')
                    {
                        self.params.timestamp = ret.timestamp;
                        self.params.curnum = ret.curnum;
                        
                        self.render(ret.data);
                        
                        cb[act] && cb[act].call(self);
                    }
                    self.hideLoading();
                });                    
            }
        },
        render: function(data)
        {
            var self = this;
            if(data && data.length)
            {
                this.$wrapper.find('.email-empty-tip').hide();
                this.$wrapper.find('.email-readmore').show();
                $.each(data, function()
                {
                    var $group = self.$content.find('[data-email-group="' + this.key + '"]');
                    $group = $group.size()
                            ? $group 
                            : $.tmpl(self.TEMPLATE.group, this).appendTo( self.$content );
                    
                    $group.append(  $.tmpl(self.TEMPLATE.item, this.item) );                            
                });                
            } 
            else 
            {                        
                this.$wrapper.find('.email-empty-tip')[ self.params.curnum <= 0 ? 'show' : 'hide' ]();
                this.$wrapper.find('.email-readmore').hide();
            }
        },
        dragSplitter: function()
        {
            var self=this;
            var splitterwidth=$("#splitter-bar-vertical").width();
            $( "#splitter-bar-vertical" ).draggable({
                containment: "#splitter-bar-scroll", 
                axis: "x",
                start: function(){
                    $(".splitter-bar-scroll").addClass("splitter-bar-scroll-on");
                    $(".splitter-overlay").show();
                },
                drag: function(){
                    $(".splitter-bar-scroll").addClass("splitter-bar-scroll-on");
                },
                stop: function()
                {
                    $(".splitter-overlay").hide();
                    $(".splitter-bar-scroll").removeClass("splitter-bar-scroll-on");
                    var verticalleft=$( "#splitter-bar-vertical" ).offset().left;
                    $("#email-toolbar").css("width",verticalleft-10);
                    $(".email-list-panel").css("width",verticalleft);
                    $( ".email-detail-panel" ).css("left",verticalleft+splitterwidth);
                    $( ".email-list-searchbar input" ).css("width",verticalleft-87);
                    $("#splitter-bar").css("left",$("#splitter-bar-vertical").position().left);
                    self.callbacks.setdragcookie($("#splitter-bar-vertical").position().left) && this.callbacks.setdragcookie.call(this);
                }
            });
        }
    };
    var EmailTableList = function(){
        this.init.apply(this, arguments);    
    };
    EmailTableList.prototype = $.extend(true, {}, EmailList.prototype, {
        constructor: EmailTableList,
        TEMPLATELIST: {
            tabletoolBar: '<div class="email-tabletoolBar clearfix"></div>',
            pageArea: '<div class="pagination" id="email-pagination"></div>',
            searchBar: '<div class="email-tablelist-search"><i class="icon-search"></i><input type="text" name="email-list-search-input" autocomplete="off" value="" hidefocus="true"><span class="icon-remove"></span></div>',
            toggleView: '<div class="email-toggleview"><a class="veiw-item-block" href="#" onclick="to_tablelist()" title="列表视图"></a><a class="veiw-item-list" href="#" onclick="to_preview()" title="预览视图"></a></div>',
            content: '<table class="table email-list-table"><colgroup><col width=45><col width=45><col width=45><col width=120><col width=auto><col width=120><col width=60></colgroup><thead><tr><th colspan="1" class="email-list-multi-handle selectall"></th><th colspan="1" data-sort="READ_FLAG" class="readflag"><img src="/static/images/email/2013/readed.png" width="16" height="16" align="absmiddle"><div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SIGN" class="sign"><img src="/static/images/email/whitestar.png" width="16" height="16" alt="无" title="无" align="absmiddle"><div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="FROM_ID" class="fromid">发件人<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SUBJECT">主题<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SEND_TIME" class="sort">日期<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SIZE">附件<div class="email-sort"><span class="desc"></span></div></th></tr></thead></table>',
            group: '<tbody class="email-list-group email-list ${className}" data-email-group="${key}"><tr><td colspan="7" class="email-group-title">{{html text}}</td></tr></tbody>',
            item: [
                '<tr class=\'mail-items {{if $data.isread=="0"}} unread {{/if}}\' data-editable="${editable}" data-email-group="${key}" data-reply="${reply}" data-email-id="${eid}" data-body-id="${bid}" data-is-webmail="${is_webmail}" data-webmail-flag="${webmail_flag}" url="${url}">',
                    '<td colspan="1" class="email-list-multi-handle"></td>',
                    '<td colspan="1" class="email-list-flag">{{html flag}}</td>',
                    '<td colspan="1" class="email-list-sign">{{html sign}}</td>',
                    '<td title="${dept}" colspan="1"><div class="email-list-user">{{html user}}</div></td>',
                    '<td colspan="1" class="email-list-title" style="padding-right:60px"><div class="email-list-titletxt">{{html hasrf}}{{html title}}</div><div class="email-del-icon"></div></td>',
                    '<td colspan="1" class="mail-list-time">${time}</td>',
                    '<td colspan="1">{{if hasAttach}} <div class="email-list-attach" title="${attachnum}个附件，${size}"></div> {{/if}}</td>',
                '</tr>'
            ].join(''),
            emptytip :'<div class="email-empty-tip email-table-empty">'+td_lang.general.email.empty+'</div>',
            signMenu: [
                '<div class="email-sign-menu attach_div">',               
                    '<table><tr>',
                        '<td data-cmd="sign" data-sign-id="4"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/redstar.png"></td>',
                    	'<td data-cmd="sign" data-sign-id="3"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/yellowstar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="2"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/greenstar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="1"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/greystar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="0"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/whitestar.png"></td>',
                    '</tr></table>',
                '</div>'
            ].join('')  
        },
        init: function(id, opts){
            this.id = id;
            this.callbacks = opts && opts.callbacks || {};
            this.params = $.extend(this.params, opts.params);
            this.url = opts.url;
            this.key = opts.key || 'data-email-id';
            this.hidetoolBar();
            this.$wrapper = $('#' + id);
            this.$wrapper.parent().addClass("email-tablelist-panel");
            this.$tabletoolBar = $( this.TEMPLATELIST.tabletoolBar ).insertBefore(this.$wrapper);
            this.$pageArea = $( this.TEMPLATELIST.pageArea ).appendTo( this.$tabletoolBar);
            this.$toggleView = $( this.TEMPLATELIST.toggleView ).appendTo( this.$tabletoolBar );
            this.$searchBar = $( this.TEMPLATELIST.searchBar ).appendTo( this.$tabletoolBar );
            this.$content = $( this.TEMPLATELIST.content ).appendTo( this.$wrapper );
            this.$emptytip = $( this.TEMPLATELIST.emptytip ).appendTo( this.$wrapper );
            this.$signMenu = $( this.TEMPLATELIST.signMenu ).appendTo('body');
            this.bindEvent();
            this.getMore();
        },
        multiMode: false,
        lastRequestTime: null,
        params:{
            timestamp: '',
            curnum: 0,
            curpage: 1,
            pagelimit: 20,
            total: '',
            boxid: '',
            orderby: 'SEND_TIME',
            asc: 0,
            keyword: '',
            emailtype: 'ALLMAIL'
        },
        bindEvent: function(){
            var self = this,
                searchtimer = null;
            self.$wrapper.disableSelect();
            self.$signMenu.disableSelect();
            this.$content.delegate('.mail-items', 'click', function(e)
            {
				parent.refreshMailCounter();
				$(this).find('.email-list-flag img').attr('src', '/static/images/email/2013/readed.png')
                window.open(jQuery(this).attr("url")+"&BTN_CLOSE=1");
                return false;
            });
            this.$content.delegate('.mail-items .email-list-multi-handle', 'click', function(e)
            {
                var $this = $(this).parent(),
                    cbs = self.callbacks,
                    id = this.getAttribute(self.key),
                    isActive = $this.hasClass('active'),
                    $item = self.$content.find('.mail-items'),
                    $active = self.$content.find('.active');  
                $this[ isActive ? 'removeClass' : 'addClass' ]('active');
                return false;
            });
            
            $(".email-list-table th[data-sort]").click(function(){
                var datasort = $(this).attr("data-sort");
                self.params.asc= 0;
                if($(this).hasClass("sort")){
                    var curclass = $(this).children().find("span").attr("class");
                    if(curclass == "asc"){
                        $(this).children().find("span").removeClass("asc").addClass("desc");
                        self.setSort('desc');
                    }
                    else{
                        $(this).children().find("span").removeClass("desc").addClass("asc");
                        self.setSort('asc');
                    }
                }
                $(this).siblings().removeClass("sort");
                $(this).addClass("sort");
                switch(datasort){
                    case "READ_FLAG": 
                      self.setOrderType('READ_FLAG'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "SIGN": 
                      self.setOrderType('SIGN'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "FROM_ID": 
                      self.setOrderType('FROM_ID'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "SUBJECT": 
                      self.setOrderType('SUBJECT'); 
                      $(".email-list-table").addClass("subject");
                      break;
                    case "SEND_TIME": 
                      self.setOrderType('SEND_TIME'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "SIZE": 
                      self.setOrderType('SIZE'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                }
            });
            this.$content.delegate('.selectall', 'click', function(e)
            {

                var isAllChecked = $(this).hasClass('allchecked');
                $(this)[ isAllChecked ? 'removeClass' : 'addClass' ]('allchecked');
                if(isAllChecked){
                  self.$content.find('.mail-items').removeClass('active');
                }
                else{
                  self.$content.find('.mail-items').addClass('active');
                }
                /*
                if(self.$content.find('.mail-items').hasClass('active')){
                    self.$content.find('.mail-items').removeClass('active');
                }
                else{
                    self.$content.find('.mail-items').addClass('active');
                }*/
            }); 
            this.$content.delegate('.mail-items .email-del-icon', 'click', function(e)
            {
            	var $this = $(this);
                $panel = $this.parents('[data-email-id]').first();
                emailId = $panel.attr('data-email-id');
                delete_mail_single(emailId);
                return false;
            });
            this.$content.delegate('.mail-items .email-list-sign,.mail-items .email-list-flag', 'click', function(e)
            {
                return false;
            }); 
            this.$content.delegate('.mail-items .email-list-sign', 'mouseenter', function(e)
            {
                var eid = $(this).parent('.mail-items').attr(self.key);
                            
                    var pos = $(this).offset();
                    self.$signMenu.css({
                        top: pos.top+5,
                        left: pos.left+28,
                        display: 'block'
                    }).data('emailid', eid);                    
               
            }); 
            
            this.$content.delegate('.mail-items .email-list-sign', 'mouseleave', function(e)
            {
                var eid = $(this).parent('.mail-items').attr(self.key);
            
                    self.$signMenu.data('menutimer', setTimeout(function()
                    {
                        self.$signMenu.hide().removeData('emailid');
                    }, 200))
              
            });
            
            this.$signMenu.mouseleave(function()
            {
                this.style.display = 'none';
                $.removeData(this, 'emailid');
            }).mouseenter(function()
            {
                var timer = $(this).data('menutimer');
                timer && clearTimeout(timer);
            });
            
            this.$signMenu.delegate('[data-cmd="sign"]', 'click', function(e)
            {
                var eid = self.$signMenu.data('emailid'),
                    sid = this.getAttribute('data-sign-id'); 
                self.signmail(eid, sid);                    
            });
            this.$searchBar.find('[name="email-list-search-input"]').keyup(function()
            {
                var value = this.value;
                searchtimer && clearTimeout(searchtimer);
                searchtimer = setTimeout(function ()
                {
                    self.params.keyword = value;
                    self.refresh();
                },1000)
            });
            this.$searchBar.parents('form').submit(function(e){      
                e.preventDefault();
            });
            $(".icon-remove").click(function(){
                self.$searchBar.find('[name="email-list-search-input"]').val("");
                self.params.keyword = "";
                self.refresh();
            });
        },
        setParam: function(key, value)
        {
            if( key && (key in this.params) ){
                this.params[key] = value;
                this.refresh();
            }
        },
        refresh: function()
        {
            this.$content.find('.email-list-group').remove();                             
            this.params.timestamp = '';
            this.params.curnum = 0;
            this.params.curpage = 1;
            this.getMore();
        },
        setOrderType: function(s)
        {
            this.params.orderby = s;
            this.refresh();
        },
        setSort: function(s)
        {
            if(s == 'asc')
            {
                this.params.asc = 1;
            }
            else if(s == 'desc')
            {
                this.params.asc = 0;
            }
            this.refresh();
        },
        multiply: function()
        {
            this.multiMode = true;
            this.$wrapper.addClass('multi');
        },
        multiDelete: function(id)
        {
            var key = this.key,
                $content = this.$content,
                store = $.trim(id).split(',');    
            $.each(store, function()
            {
                if(this == '')
                {
                    return;
                }
                $content.find('.mail-items[' + key + '="' + this + '"]').remove();
            });
            
            $content.find('.email-list-group').not(':has(.mail-items)').remove();
            
            if($content.find('.mail-items').size() == 0)
            {            
                this.callbacks.empty && this.callbacks.empty.call(this);                
            }
            this.callbacks.multiply && this.callbacks.multiply.call(this);
        },
        deleteByStrs: function(strs)
        {
            var pagebeforedel=this.params.curpage;
            this.multiDelete(strs);  
            this.$content.find('.email-list-group').remove();                             
            this.params.timestamp = '';
            this.params.curnum = 0;
            this.params.curpage = pagebeforedel;
            this.getMore();
        },
        countNum: function()
        {
            this.params.curnum = this.$content.find('tbody.email-list-group tr.mail-items').size();
        },
        getActive: function()
        {
            return this.$content.find('.mail-items.active');
        },
        getActiveId: function()
        {
            var key = this.key,
                s = [],
                $active = this.getActive();
            $active.each(function()
            {
                s.push(this.getAttribute(key));
            });
            return s.join(',');
        },
        getActiveCount: function()
        {
            return this.$content.find('.mail-items.active').size();
        },
        signmail: function(emailid, signid)
        {
            var $target = this.$content.find('.mail-items[' + this.key + '="' + emailid + '"]');
            $.get('/general/email/sign_email.php', {
                'DELETE_STR': emailid,
                'SIGN': signid
            }, function(ret)
            {
                var signmap = ['whitestar', 'greystar', 'greenstar', 'yellowstar', 'redstar'];
                ret=parseInt(ret);
                var img = "<img src='"+MYOA_STATIC_SERVER+"/static/images/email/" + (signmap[ret] || 'whitestar') + ".png' width='16' height='16' align='absmiddle'/>"
                $target.find('.email-list-sign').html(img);
            })
        },
        refreshListClass: function()
        {
            var cls = ['email-list-1', 'email-list-2', 'email-list-3', 'email-list-4'],
                l = cls.length;
            this.$content.find('.email-list-group').each(function(i, n){
                if( i > l )
                {
                    return false;
                }
                $(this).removeClass( cls.join(' ') ).addClass( cls[i] );
            });
        },
        getMore: function()
        {
            var self = this,
                cb = this.callbacks,
                firstload = this.params.timestamp == '',
                act = firstload ? 'loadfirst' : 'loadmore',
                time = new Date;
            this.lastRequestTime = time; 
            self.params.curnum=(self.params.curpage-1)*self.params.pagelimit;
            
        	$.get(self.url, this.params, function(ret)
            {
                if(time < self.lastRequestTime){
                    return;
                }
                if(typeof ret == 'object')
                {
                    self.params.timestamp = ret.timestamp;
                    if(ret.pagenum>1){
                        self.setPagination(self.params.curpage,ret.pagenum);
                        
                    }
                    else{
                        self.$pageArea.hide();
                    }
                    if(ret.data.length>0){
                        self.multiply();
                    }
                    else{
                        self.multiMode=false;
                        self.callbacks.empty && self.callbacks.empty.call(this); 
                    }
                    self.render(ret.data);
                    $(".email-list-table th").removeClass("allchecked");
                    self.countNum();
                    cb[act] && cb[act].call(self);
                }
            }); 
        },
        render: function(data)
        {
        	
            var self = this;
            if(data && data.length)
            {
                this.$wrapper.find('.email-empty-tip').hide();
                $(".email-list-group").remove();
                $(".email-list-table").show();
                $.each(data, function()
                {
                    var $group = self.$content.find('[data-email-group="' + this.key + '"]');
                    $group = $group.size()
                            ? $group 
                            : $.tmpl(self.TEMPLATELIST.group, this).appendTo( self.$content);
                    $group.append(  $.tmpl(self.TEMPLATELIST.item, this.item) );                     
                });                 
            }
            else 
            {       
                this.$pageArea.hide();
                this.$content.hide();
                this.$wrapper.find('.email-empty-tip')[ self.params.curnum <= 0 ? 'show' : 'hide' ]();
            }
        },
        hidetoolBar:function(opts)
        {
            $("#email-toolbar").hide();
            $(".email-detail-panel").hide();
            $(".email-list-panel").removeClass("email-list-panel");
        },
        initPagination: function(){            
            var self = this,
            $pagi = $('#email-pagination');
                
            $pagi.bootstrapPaginator({
                totalPages: 10,
                alignment: 'right',
                pageUrl: "javascript:void(0)",
                onPageChanged: function(e, prev, next){
                    self.params.curpage = next;
                    self.getMore();
                }
            });
            this.pagination = $pagi.data('bootstrapPaginator');
        },
        setPagination: function(curpage, totalpage){
            curpage = parseInt(curpage, 10);
            totalpage = parseInt(totalpage, 10) || 0;
            if(!this.pagination){
                this.initPagination();
            }
            if(totalpage <= 1){                
                this.pagination.$element.hide();
            }else{
                this.pagination.$element.show();
                this.pagination.currentPage = curpage;
                this.pagination.totalPages = totalpage;
                this.pagination.render();
            }
        }
    });
    var SentBoxList = function(){
        this.init.apply(this, arguments);    
    };
    SentBoxList.prototype = $.extend(true, {}, EmailTableList.prototype, {
        constructor: SentBoxList,
        TEMPLATELIST: {
            tabletoolBar: '<div class="email-tabletoolBar clearfix"></div>',
            pageArea: '<div class="pagination" id="email-pagination"></div>',
            searchBar: '<div class="email-tablelist-search"><i class="icon-search"></i><input type="text" name="email-list-search-input" autocomplete="off" value="" hidefocus="true"><span class="icon-remove"></span></div>',
            toggleView: '<div class="email-toggleview"><a class="veiw-item-block" href="#" onclick="to_tablelist()" title="列表视图"></a><a class="veiw-item-list" href="#" onclick="to_preview()" title="预览视图"></a></div>',
            content: '<table class="table email-list-table"><colgroup><col width=45><col width=45><col width=200><col width=auto><col width=120><col width=60></colgroup><thead><tr><th colspan="1" class="email-list-multi-handle selectall"></th><th colspan="1" class="readflag"><img src="/static/images/email/2013/readed.png" width="16" height="16" align="absmiddle"><div class="email-sort"><span class="desc"></span></div></th><th colspan="1" class="fromid">收件人<div class="email-sort"><span class="desc"></span></div></th><th colspan="1">主题<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SEND_TIME" class="sort">日期<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SIZE">附件<div class="email-sort"><span class="desc"></span></div></th></tr></thead></table>',
            group: '<tbody class="email-list-group email-list ${className}" data-email-group="${key}"><tr><td colspan="6" class="email-group-title">{{html text}}</td></tr></tbody>',
            emptytip :'<div class="email-empty-tip email-table-empty">'+td_lang.general.email.empty+'</div>',
            item: [
                '<tr class=\'mail-items {{if $data.isread=="0"}} unread {{/if}}\' data-editable="${editable}" data-email-group="${key}" data-reply="${reply}" data-email-id="${eid}" data-body-id="${bid}" data-is-webmail="${is_webmail}" data-webmail-flag="${webmail_flag}" url="${url}">',
                    '<td colspan="1" class="email-list-multi-handle"></td>',
                    '<td colspan="1" class="email-list-flag">{{html flag}}</td>',
                    '<td title="${dept}" colspan="1"><div class="email-list-user">{{html user}}</div></td>',
                    '<td colspan="1" class="email-list-title" style="padding-right:60px"><div class="email-list-titletxt">{{html hasrf}}{{html title}}</div><div class="email-del-icon"></div></td>',
                    '<td colspan="1" class="mail-list-time">${time}</td>',
                    '<td colspan="1">{{if hasAttach}} <div class="email-list-attach" title="${attachnum}个附件，${size}"></div> {{/if}}</td>',
                '</tr>'
            ].join('')
        },
        bindEvent: function(){
            var self = this,
                searchtimer = null;
            self.$wrapper.disableSelect();
            this.$content.delegate('.mail-items', 'click', function(e)
            {
                window.open(jQuery(this).attr("url")+"&BTN_CLOSE=1");
                return false;
            });
            this.$content.delegate('.mail-items .email-list-multi-handle', 'click', function(e)
            {
                var $this = $(this).parent(),
                    cbs = self.callbacks,
                    id = this.getAttribute(self.key),
                    isActive = $this.hasClass('active'),
                    $item = self.$content.find('.mail-items'),
                    $active = self.$content.find('.active');  
                $this[ isActive ? 'removeClass' : 'addClass' ]('active');
                cbs.singleSelected && cbs.singleSelected($this);
                return false;
            });
            $(".email-list-table th[data-sort]").click(function(){
                var datasort = $(this).attr("data-sort");
                self.params.asc= 0;
                if($(this).hasClass("sort")){
                    var curclass = $(this).children().find("span").attr("class");
                    if(curclass == "asc"){
                        $(this).children().find("span").removeClass("asc").addClass("desc");
                        self.setSort('desc');
                    }
                    else{
                        $(this).children().find("span").removeClass("desc").addClass("asc");
                        self.setSort('asc');
                    }
                }
                $(this).siblings().removeClass("sort");
                $(this).addClass("sort");
                switch(datasort){
                    case "SEND_TIME": 
                      self.setOrderType('SEND_TIME'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "SIZE": 
                      self.setOrderType('ATTACHMENT_ID'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                }
            });
            this.$content.delegate('.selectall', 'click', function(e)
            {
                var isAllChecked = $(this).hasClass('allchecked');
                
                if(isAllChecked){
                    self.$content.find('.mail-items').removeClass('active');
                }
                else{
                    self.$content.find('.mail-items').addClass('active');
                }
                $(this)[ isAllChecked ? 'removeClass' : 'addClass' ]('allchecked');
            }); 
            this.$content.delegate('.mail-items .email-del-icon', 'click', function(e)
            {
            	var $this = $(this);
                $panel = $this.parents('[data-email-id]').first();
                emailId = $panel.attr('data-email-id');
                delete_mail_single(emailId);
                return false;
            });
            this.$searchBar.find('[name="email-list-search-input"]').keyup(function()
            {
                var value = this.value;
                searchtimer && clearTimeout(searchtimer);
                searchtimer = setTimeout(function ()
                {
                    self.params.keyword = value;
                    self.refresh();
                },1000)
            });
            this.$searchBar.parents('form').submit(function(e){      
                e.preventDefault();
            });
            $(".icon-remove").click(function(){
                self.$searchBar.find('[name="email-list-search-input"]').val("");
                self.params.keyword = "";
                self.refresh();
            });
        },
        setOrderType: function(s)
        {
            this.params.orderby = s;
            this.refresh();
        }
    });
    var DelBoxList = function(){
        this.init.apply(this, arguments);    
    };
    DelBoxList.prototype = $.extend(true, {}, EmailTableList.prototype, {
        constructor: DelBoxList,
        TEMPLATELIST: {
            tabletoolBar: '<div class="email-tabletoolBar clearfix"></div>',
            pageArea: '<div class="pagination" id="email-pagination"></div>',
            searchBar: '<div class="email-tablelist-search"><i class="icon-search"></i><input type="text" name="email-list-search-input" autocomplete="off" value="" hidefocus="true"><span class="icon-remove"></span></div>',
            toggleView: '<div class="email-toggleview"><a class="veiw-item-block" href="#" onclick="to_tablelist()" title="列表视图"></a><a class="veiw-item-list" href="#" onclick="to_preview()" title="预览视图"></a></div>',
            content: '<table class="table email-list-table"><colgroup><col width=45><col width=45><col width=45><col width=120><col width=auto><col width=120><col width=60></colgroup><thead><tr><th colspan="1" class="email-list-multi-handle selectall"></th><th colspan="1" data-sort="READ_FLAG" class="readflag"><img src="/static/images/email/2013/readed.png" width="16" height="16" align="absmiddle"><div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SIGN" class="sign"><img src="/static/images/email/whitestar.png" width="16" height="16" alt="无" title="无" align="absmiddle"><div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="FROM_ID" class="fromid">发件人<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SUBJECT">主题<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SEND_TIME" class="sort">日期<div class="email-sort"><span class="desc"></span></div></th><th colspan="1" data-sort="SIZE">附件<div class="email-sort"><span class="desc"></span></div></th></tr></thead></table>',
            group: '<tbody class="email-list-group email-list ${className}" data-email-group="${key}"><tr><td colspan="7" class="email-group-title">{{html text}}</td></tr></tbody>',
            emptytip :'<div class="email-empty-tip email-table-empty">'+td_lang.general.email.empty+'</div>',
            item: [
                '<tr class=\'mail-items {{if $data.isread=="0"}} unread {{/if}}\' data-editable="${editable}" data-email-group="${key}" data-reply="${reply}" data-email-id="${eid}" data-body-id="${bid}" data-is-webmail="${is_webmail}" data-webmail-flag="${webmail_flag}" url="${url}">',
                    '<td colspan="1" class="email-list-multi-handle"></td>',
                    '<td colspan="1" class="email-list-flag">{{html flag}}</td>',
                    '<td colspan="1" class="email-list-sign">{{html sign}}</td>',
                    '<td title="${dept}" colspan="1"><div class="email-list-user">{{html user}}</div></td>',
                    '<td colspan="1" class="email-list-title" style="padding-right:60px"><div class="email-list-titletxt">{{html hasrf}}{{html title}}</div><div class="email-del-icon"></div></td>',
                    '<td colspan="1" class="mail-list-time">${time}</td>',
                    '<td colspan="1">{{if hasAttach}} <div class="email-list-attach" title="${attachnum}个附件，${size}"></div> {{/if}}</td>',
                '</tr>'
            ].join(''),
            signMenu: [
                '<div class="email-sign-menu attach_div">',               
                    '<table><tr>',
                        '<td data-cmd="sign" data-sign-id="4"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/redstar.png"></td>',
                    	'<td data-cmd="sign" data-sign-id="3"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/yellowstar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="2"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/greenstar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="1"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/greystar.png"></td>',
                        '<td data-cmd="sign" data-sign-id="0"><img src="'+MYOA_STATIC_SERVER+'/static/images/email/whitestar.png"></td>',
                    '</tr></table>',
                '</div>'
            ].join('')  
        },
        bindEvent: function(){
            var self = this,
                searchtimer = null;
            self.$wrapper.disableSelect();
            self.$signMenu.disableSelect();
            this.$content.delegate('.mail-items', 'click', function(e)
            {
                window.open(jQuery(this).attr("url")+"&BTN_CLOSE=1");
                return false;
            });
            this.$content.delegate('.mail-items .email-list-multi-handle', 'click', function(e)
            {
                var $this = $(this).parent(),
                    cbs = self.callbacks,
                    id = this.getAttribute(self.key),
                    isActive = $this.hasClass('active'),
                    $item = self.$content.find('.mail-items'),
                    $active = self.$content.find('.active');  
                $this[ isActive ? 'removeClass' : 'addClass' ]('active');
                return false;
            });
            
            $(".email-list-table th[data-sort]").click(function(){
                var datasort = $(this).attr("data-sort");
                self.params.asc= 0;
                if($(this).hasClass("sort")){
                    var curclass = $(this).children().find("span").attr("class");
                    if(curclass == "asc"){
                        $(this).children().find("span").removeClass("asc").addClass("desc");
                        self.setSort('desc');
                    }
                    else{
                        $(this).children().find("span").removeClass("desc").addClass("asc");
                        self.setSort('asc');
                    }
                }
                $(this).siblings().removeClass("sort");
                $(this).addClass("sort");
                switch(datasort){
                    case "READ_FLAG": 
                      self.setOrderType('READ_FLAG'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "SIGN": 
                      self.setOrderType('SIGN'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "FROM_ID": 
                      self.setOrderType('FROM_ID'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "SUBJECT": 
                      self.setOrderType('SUBJECT'); 
                      $(".email-list-table").addClass("subject");
                      break;
                    case "SEND_TIME": 
                      self.setOrderType('SEND_TIME'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                    case "SIZE": 
                      self.setOrderType('SIZE'); 
                      $(".email-list-table").removeClass("subject");
                      break;
                }
            });
            this.$content.delegate('.selectall', 'click', function(e)
            {
                var isAllChecked = $(this).hasClass('allchecked');
                if(isAllChecked){
                    self.$content.find('.mail-items').removeClass('active');
                }
                else{
                    self.$content.find('.mail-items').addClass('active');
                }
                $(this)[ isAllChecked ? 'removeClass' : 'addClass' ]('allchecked');
            }); 
            this.$content.delegate('.mail-items .email-del-icon', 'click', function(e)
            {
            	var $this = $(this);
                $panel = $this.parents('[data-email-id]').first();
                emailId = $panel.attr('data-email-id');
                delete_mail_single(emailId);
                return false;
            });
            this.$content.delegate('.mail-items .email-list-sign,.mail-items .email-list-flag', 'click', function(e)
            {
                return false;
            }); 
            this.$content.delegate('.mail-items .email-list-sign', 'mouseenter', function(e)
            {
                var eid = $(this).parent('.mail-items').attr(self.key);
                            
                    var pos = $(this).offset();
                    self.$signMenu.css({
                        top: pos.top+5,
                        left: pos.left+28,
                        display: 'block'
                    }).data('emailid', eid);                    
               
            }); 
            
            this.$content.delegate('.mail-items .email-list-sign', 'mouseleave', function(e)
            {
                var eid = $(this).parent('.mail-items').attr(self.key);
            
                    self.$signMenu.data('menutimer', setTimeout(function()
                    {
                        self.$signMenu.hide().removeData('emailid');
                    }, 200))
              
            });
            
            this.$signMenu.mouseleave(function()
            {
                this.style.display = 'none';
                $.removeData(this, 'emailid');
            }).mouseenter(function()
            {
                var timer = $(this).data('menutimer');
                timer && clearTimeout(timer);
            });
            
            this.$signMenu.delegate('[data-cmd="sign"]', 'click', function(e)
            {
                var eid = self.$signMenu.data('emailid'),
                    sid = this.getAttribute('data-sign-id');
                self.signmail(eid, sid);                    
            });
            this.$searchBar.find('[name="email-list-search-input"]').keyup(function()
            {
                var value = this.value;
                searchtimer && clearTimeout(searchtimer);
                searchtimer = setTimeout(function ()
                {
                    self.params.keyword = value;
                    self.refresh();
                },1000)
            });
            this.$searchBar.parents('form').submit(function(e){      
                e.preventDefault();
            });
            $(".icon-remove").click(function(){
                self.$searchBar.find('[name="email-list-search-input"]').val("");
                self.params.keyword = "";
                self.refresh();
            });
        }
    });
    window.SentBoxList = SentBoxList;
    window.DelBoxList = DelBoxList;
    window.EmailTableList = EmailTableList;
    window.EmailList = EmailList;
})(window.jQuery);
