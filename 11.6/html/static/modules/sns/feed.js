;(function($, win){
    var formatTime = function(c){
        var c = parseInt(c) * 1000;
        var a = G_obj_feedinfo.serverTimestamp;    //服务器时间
        var g = new Date(c);
        var b = new Date(a);
        var f = a - c;
        var e = "";

        function d(h){
            return h < 10 ? ("0" + h) : h
        }
        if(f < 0){
            e = ""           
        }else{
            if(f < (60 * 1000)){
                e = parseInt(f / 1000) + td_lang.inc.msg_169
            }else{
                if(f < (60 * 60 * 1000)){
                    e = parseInt(f / 60 / 1000) + td_lang.inc.msg_170
                }else{
                    if(f < (24 * 60 * 60 * 1000)){
                        if(g.getDate() == b.getDate()){
                            e = td_lang.inc.msg_182 + d(g.getHours()) + ":" + d(g.getMinutes())
                        }else{
                            e = (g.getMonth() + 1) + td_lang.inc.msg_171 + g.getDate() + td_lang.inc.msg_172 + d(g.getHours()) + ":" + d(g.getMinutes())
                        }
                    }else{
                        if(f < (365 * 24 * 60 * 60 * 1000)){
                            if(g.getFullYear() == b.getFullYear()){
                                e = (g.getMonth() + 1) + td_lang.inc.msg_171  + g.getDate() + td_lang.inc.msg_172 + d(g.getHours()) + ":" + d(g.getMinutes())
                            }else{
                                e = g.getFullYear() + "-" + (g.getMonth() + 1) + "-" + g.getDate() + " " + d(g.getHours()) + ":" + d(g.getMinutes())
                            }
                        }else{
                            e = g.getFullYear() + "-" + (g.getMonth() + 1) + "-" + g.getDate() + " " + d(g.getHours()) + ":" + d(g.getMinutes())
                        }
                    }
                }
            }
        }
        return e
    };
    window.formatTime = formatTime;
    
    var getDaysInMonth = function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if ((month == 1) && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
            return 29;
        } else {
            return daysInMonth[month];
        }
    };    
       
    var now = new Date();

    var fixAttachPosition = function(context){
        context = context || document.getElementsByTagName("body")[0];
       
        $('span[id^=attach][onmouseover]', context).each(function(){        
            this.onmouseover = null;
            var $this = $(this),
            $menu = $('#' + this.id + '_menu');
            
            $this           
            .mouseover(function(){
                var $this = $(this),
                pos = $this.position();
                pos.top += 20;
                $menu.css({
                    top: pos.top,
                    left: pos.left,
                    display: 'block'
                });
            }).mouseleave(function(){
                var timer = setTimeout(function(){
                    $menu.hide();
                },200);
                
                $menu.data('menuTimer', timer);
            });
            $menu.mouseleave(function(){
                this.style.display = 'none';
            }).mouseenter(function(){
                var timer = $(this).data('menuTimer');
                timer && clearTimeout(timer);
            });
        });
    };
    
    ;(function($, win){
        $.fn.attachmenu = function(){
            this.each(function(){        
                this.onmouseover = null;
                this.removeAttribute('onmouseover');
                var $this = $(this),
                $menu = $('#' + this.id + '_menu');
                $menu.css({ 
                    display: 'block',
                    visiblity: 'hidden'
                });            
                var menuHeihgt = $menu.height();
                $menu.css({ 
                    display: 'none',
                    visiblity: 'visible'
                });
                
                $this           
                .mouseover(function(e){
                    var $this = $(this),
                    pos = $this.position(),
                    winHeight = $(window).height();
                    
                    if(menuHeihgt + e.clientY <= winHeight){      
                        pos.top += 20;   
                    }else{                
                        pos.top -= menuHeihgt;             
                    }
                    $menu.css({
                        display: 'block'
                    });
                }).mouseleave(function(){
                    var timer = setTimeout(function(){
                        $menu.hide();
                    },200);
                    $menu.data('attachMenuTimer', timer);
                });
                $menu.mouseleave(function(){
                    this.style.display = 'none';
                }).mouseenter(function(){
                    var timer = $(this).data('attachMenuTimer');
                    timer && clearTimeout(timer);
                });
            });
        };
        
        $.attachmenu = function(){
            $('span[id^=attach][onmouseover]').attachmenu();
        };
        
        $(function(){
            $.attachmenu();
        });
        
    })(jQuery, window);
    var FeedTypes = {
        all: 0,
        mine: 1,
        others: 2,
        shared: 3,
        permission: 4
    };
    
    var TFeed = function(){
        this.init.apply(this, arguments);
    }
    TFeed.prototype = {
        Router: {
            GetFeedlist: 'api/data.php',
            DelFeed: 'api/delete.php',
            ShareFeed: 'api/op.php',
            GetReply: 'api/get_comment.php',
            GetKeylist: 'api/get_search_subject.php',
            GetSharelist: 'api/get_feed_share.php',
            DelReply: 'api/op_comment.php',
            SubmitComment: 'api/op_comment.php',
            GetReaders: 'api/get_readers.php',
            Upvote: 'api/upvote.php',
            Favorite: 'api/op.php'
        },
        lastRequestTime: null,
        params: {
            ismain: 1,
            curpage: 1,
            pagelimit: 10,
            type: FeedTypes.mine,
            startdate: null,
            enddate: null,
            dept: null,
            role: null,
            user: null,
            db: null,
            keyword: ''
        },
        refreshParams: function(){
            this.params.curpage = 1;               
            this.params.type = FeedTypes[ $('#feed-type-switcher .active').attr('data-feed-type') ];
            this.params.dept = $('[data-filter="dept"].on').attr('data-id');
            this.params.group = $('[data-filter="group"].on').attr('data-id');
            this.params.global = $('[data-filter="global"].on').size();
            this.params.user = null;
            this.params.favorite = $('[data-filter="favorite"].on').size();
            this.params.keyword = $('#feed-search-query').val();
            this.getFeed();
            
        },
        init: function(c){
            this.bindEvent();   
            this.loadParam();
            this.getFeed();
        },
        loadParam: function(){
            if(G_obj_feedinfo.fromUser!="")
            {
                this.params.user = G_obj_feedinfo.fromUser;
                this.enableAdvSearchbox();
                this.usertags.add({ value: G_obj_feedinfo.fromUser, text: G_obj_feedinfo.fromUserName });
                $('#username').val(G_obj_feedinfo.fromUser + ',');
                $('#usertext').val(G_obj_feedinfo.fromUserName + ',');
                this.getFeed();
            }
        },
        bindEvent: function(){  
            var self = this;
            $('#feedlist').on('click.feedcmd', '[data-cmd]', function(){
                var $this = $(this), 
                $panel = $this.parents('[data-id]').first(),
                feedId = $panel.attr('data-id'),
                cmd = $this.attr('data-cmd');
                switch(cmd){
                    case 'del':
                        self.deleteFeed(feedId);
                        break;
                    case 'reply':
                        self.toggleReplyPanel(feedId, $panel);
                        break;
                    case 'replyComment':
                        self.replyComment(feedId, $this.attr('data-cmt-id'), $this.attr('data-to-id'), $this.attr('data-to-text'), 'reply')
                        break;
                    case 'replySubmit':
                        self.submitReply(feedId);
                        break;
                    case 'delReply':
                        self.delReply(feedId, $this.attr('data-cmt-id'), $this.attr('data-cmt-type'));
                        break;
                    case 'share':
                        self.share(feedId);
                        break;
                    case 'readers':
                        self.toggleReadersPanel(feedId, $panel);
                        break;
                    case 'upvote':
                        self.upvote(feedId, $this);
                        break;
                    case 'cancelUpvote':
                        self.cancelUpvote(feedId, $this);
                        break;
                    case 'favorite':
                        self.favorite(feedId, $this);
                        break;
                    case 'cancelFavorite':
                        self.cancelFavorite(feedId, $this);
                        break;
                    case 'repost':
                        self.repost(feedId);
                        break;
                    case 'attach-image':
                        self.imgview(feedId,$this,$this.parent());
                    default:
                        break;
                }
            });
            $('.feed-types-box').on('click', '[data-type]', function(){
                var date = null;
                self.datetag.clear();
                self.params.curpage = 1;
                self.params.startdate = date;
                self.params.enddate = date;  
                self.params.keyword = '';
                self.params.role = ''; 
                self.params.dept = '';
                self.params.user = '';
                self.params.db = '';
                $('#feed-search-query').val(''); 
                         
                if(!self.advSearchMode){                      
                    $('#feed-type-switcher').find('[data-feed-type="' + this.getAttribute('data-type') + '"]').click();
                }
                else
                {
                    self.disableAdvSearchbox(); 
                    self.params.usernofeed=null; 
                    self.hideUserTip();
                    $('#feed-type-switcher').find('[data-feed-type="' + this.getAttribute('data-type') + '"]').click();                         
                }    
            });
            $('#feedlist').on('click', 'a[href]', function(){
                var href = $(this).attr("href"),
                text = this.innerText;
                if( href.match(/http:\/\//) && href.indexOf("general")!='-1')
                {
                    if(top.openURL)
                    {
                        top.openURL('sns' + (new Date).getTime(), text, href);
                    }
                    else if( !( href.macth(/javascript\:void\(0\)/) || href.macth(/^#/) ) )
                    {
                        top.open(href, 'sns' + (new Date).getTime());
                    }
                    return false;
                }
            });
            
            $('#feedlist').delegate('.feed-ext-comment-sms-advcomment','change',function(){ 
                var ischecked = $(this).find("[name='advcomment']").prop('checked');
                if(ischecked){
                    $panel = $(this).parents('[data-id]').first();
                    var $textarea = $panel.find(".feed-submit-cmt-context")[0];
                    $textarea.value = $textarea.value.replace(/\n/ig, '</br>');
                    replaceEditor($textarea,{
                        width:565,
                        height:85,
                        toolbar:'Feedback',
                        allowedContent:true
                    });
                    $(this).hide();
                }
            });
            $('#shareSubmit').click($.proxy(this.shareSubmit, this));
            
            $('.adv-search-handler').click($.proxy(this.toggleAdvSearchbox, this));
            
            $('#feed-adv-search-box').on('click.feedcmd', '.date-quicklink', function(){
                var startdate, 
                    enddate,
                    year = now.getFullYear(),
                    month = now.getMonth(),
                    day = now.getDate(),
                    cmd = $(this).attr('data-cmd');
                    
                switch(cmd){
                    case 'recent3day':
                    startdate = new Date( year, month, day - 3 );
                    enddate = new Date( year, month, day + 3 );
                    break;
                    case 'recent1week':
                    startdate = new Date( year, month, day - now.getDay() + 1 );
                    enddate = new Date( year, month, day - now.getDay() + 7 );
                    break;
                    case 'recent1month':
                    startdate = new Date( year, month, 1 );
                    enddate = new Date( year, month, getDaysInMonth( month, year ) );
                    break;
                }
                
                self.setAdvDateRange(startdate, enddate);
            });
            
            $('#dept-plus').click(function(){
                var module_id = 'feed', 
                to_id = "deptname", 
                to_name = "depttext", 
                manage_flag, 
                form_name = "searchForm";
            
                window.org_select_callbacks = window.org_select_callbacks || {};
                
                window.org_select_callbacks.add = function(item_id, item_name){
                    self.depttags.add({ value: item_id, text: item_name });                    
                };
                window.org_select_callbacks.remove = function(item_id, item_name){
                    self.depttags.remove(item_id);                    
                };                
                window.org_select_callbacks.clear = function(){                    
                    self.depttags.clear();             
                };
                
                SelectDept(module_id, to_id, to_name, manage_flag, form_name);
                return false;
            }); 
            $('#dept-trash').click(function(){
                self.depttags.clear();
            });   
            
            $('#role-plus').click(function(){
                var module_id = 'feed', 
                to_id = "rolename", 
                to_name = "roletext", 
                manage_flag, 
                form_name = "searchForm";
            
                window.org_select_callbacks = window.org_select_callbacks || {};
                
                window.org_select_callbacks.add = function(item_id, item_name){
                    self.roletags.add({ value: item_id, text: item_name });                    
                };
                window.org_select_callbacks.remove = function(item_id, item_name){
                    self.roletags.remove(item_id);                    
                };
                window.org_select_callbacks.clear = function(){

                };
                
                SelectPriv(module_id, to_id, to_name, manage_flag, form_name);
                return false;
            }); 
            $('#role-trash').click(function(){
                self.roletags.clear();
            });
            
            $('#user-plus').click(function(){
                var module_id = 'feed', 
                to_id = "username", 
                to_name = "usertext", 
                manage_flag, 
                form_name = "searchForm";
            
                window.org_select_callbacks = window.org_select_callbacks || {};
                
                window.org_select_callbacks.add = function(item_id, item_name){
                    self.usertags.add({ value: item_id, text: item_name });                    
                };
                window.org_select_callbacks.remove = function(item_id, item_name){
                    self.usertags.remove(item_id);                    
                };                
                window.org_select_callbacks.clear = function(){                    
                                  
                };
                
                SelectUser('9', module_id, to_id, to_name, manage_flag, form_name);
                return false;
            }); 
            $('#user-trash').click(function(){
                self.usertags.clear();
            });          

            $('#share-plus').click(function(){
                var module_id = 'feed', 
                to_id = "sharename", 
                to_name = "sharetext", 
                manage_flag, 
                form_name = "shareform";
            
                window.org_select_callbacks = window.org_select_callbacks || {};
                
                window.org_select_callbacks.add = function(item_id, item_name){
                    self.sharetags.add({ value: item_id, text: item_name });                    
                };
                window.org_select_callbacks.remove = function(item_id, item_name){
                    self.sharetags.remove(item_id);                    
                };                
                window.org_select_callbacks.clear = function(){                    
                                  
                };
                
                SelectUser('9', module_id, to_id, to_name, manage_flag, form_name);
                return false;
            });
                   
            $('#share-trash').click(function(){
                self.sharetags.clear();               
                $("#sharename").val('');
                $("#sharetext").val('');
            });
        },
        getTmpl: function(c){
            switch(c){
                case 'feed':
                    return $('#feedTmpl');
                    break;
                case 'reply':
                    return $('#cmtTmpl');
                    break;
                default:
                    return '';
                    break;
            }
        },
        getFeed: function(){
            var self = this,
            time = new Date;
            this.lastRequestTime = time;    
            self.showLoading();
            $.ajax({
                url: this.Router.GetFeedlist, 
                data: this.params,
                type: 'get',
                dataType: 'json',
                success: function(r){
                    if(time < self.lastRequestTime){
                        //return;
                    }
                    if(r && r.status){
                        var c = r.data;
                    }else{
                        return;
                    }
                    if(c && c.datalist && c.datalist.length){
                        self.hideEmptyTip();
                        self.updateFeed(c.datalist);
                    }else{
                        self.showEmptyTip();
                    }
                    
                    self.setPagination(c.curpage, c.totalpage);
                    self.hideLoading();
                    self.scrollTop();
                    //attachmenu
                    $('span[id^=attach]').attachmenu();
                },
                error: function(){
                    self.notify(td_lang.module.msg_6);
                    self.showEmptyTip();
                    self.setPagination(0, 0);               
                    self.hideLoading();
                    self.scrollTop();
                }
            });
        },
        scrollTop: function(){
            $('html,body').animate({scrollTop: 0}, 300);
        },
        updateFeed: function(c){
            $('#feedlist').html(this.feedRender(c));    
            fixAttachPosition($('#feedlist'));
        },
        initTypeSwitcher: function(){
            var self = this,
            $buttons = $('#feed-type-switcher button');
            $buttons.click(function(){
                $buttons.removeClass('active btn-primary')
                $(this).addClass('active btn-primary');
                self.params.type = FeedTypes[ $(this).attr('data-feed-type') ];
                self.params.curpage = 1;
                self.params.searchnofeed = 0;
                self.getFeed();
            });
        },
        initCalendar: function(){
            var self = this;
           
            this.datetag = $('#feed-date-result').tags({
                callbacks: {
                    remove: function(){
                        self.unselectCalender();          
                    }
                }
            }).css('border', 'none').data('tags');
            
            this.calendar = $('#feed-calendar').calendarWidget({
                clickCallback: function(calendar, e){
                    self.calendarClickHandle(calendar, e, this);
                }
            }).data('calendarWidget');  
            
            this.calendar.options.renderCallback = function(){   
                self.datetag.clear();                 
                self.datetag.add(this.year + '-' + (parseInt(this.month) + 1))
                self.params.startdate = this.year + '-' + (parseInt(this.month) + 1) + '-'  + 1;
                self.params.enddate = this.year + '-' + (parseInt(this.month) + 1) + '-' + getDaysInMonth(this.month, this.year);
                self.params.searchnofeed = 0;
                self.getFeed();
            };
            
        },
        calendarClickHandle: function(calendar, e, dom){
            var date = calendar.year + '-' + (parseInt(calendar.month) + 1) + '-' + calendar.getActive();
            this.datetag.clear();
            this.datetag.add(date);          
            this.params.startdate = date;
            this.params.enddate = date;
            this.params.searchnofeed = 0;
            this.getFeed()
        },
        unselectCalender: function(){
            this.calendar.clearActive();            
            this.params.startdate = null;
            this.params.enddate = null;
            this.params.searchnofeed = 0;
            this.getFeed();             
        },
        initSearchBox: function(){
            var self = this;
            //搜索框下拉提示 (高级搜索时关闭)
            self.autocomplate = $('#feed-search-query').typeahead({
                source: function(key, func){
                    if(self.advSearchMode){
                        return false
                    }
                    $.ajax({
                        url: self.Router.GetKeylist,
                        data: { 
                            keyword: key, 
                            startdate: self.params.startdate,
                            enddate: self.params.enddate,
                            type: self.params.type
                        },
                        async: true,
                        type: 'get',
                        success: function(d){
                            func(d);
                        }
                    });
                },
                updater: function(key){
                    self.refreshParams();
                    return key;
                },
                items: 10
                
            });
            //部门tag初始化
            self.depttags = $('#dept-tags').tags({
                callbacks: {
                    remove: function(){
                        var c = self.depttags.serialize();
                        $('#deptname').val(c.value ? c.value + ',' : c.value);
                        $('#depttext').val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        $('#deptname').val('');
                        $('#depttext').val('');
                    }
                }
            }).data('tags');
            //角色tag初始化
            self.roletags = $('#role-tags').tags({
                callbacks: {
                    remove: function(){
                        var c = self.roletags.serialize();
                        $('#rolename').val(c.value ? c.value + ',' : c.value);
                        $('#roletext').val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        $('#rolename').val('');
                        $('#roletext').val('');
                    }
                }
            }).data('tags');
            //人员tag初始化
            self.usertags = $('#user-tags').tags({
                callbacks: {
                    remove: function(){
                        var c = self.usertags.serialize();
                        $('#username').val(c.value ? c.value + ',' : c.value);
                        $('#usertext').val(c.text ? c.text + ',' : c.text);
                    },
                    clear: function(){
                        $('#username').val('');
                        $('#usertext').val('');
                    }
                }
            }).data('tags');
            
            $('#adv-search-btn').click( $.proxy(this.refreshParams, this) );
            //回车查询
            $('#feed-search-query').keyup(function(e){
                if(e.keyCode == 13){
                    self.refreshParams();
                }
            });
            //范围选择 [所有的 | 有权限查看的] 时，显示部门、角色、人员选择
            $('#feedtype').change(function(){
                var value = $(this).val(),
                extend = value == 'all' || value == 'permission';
                
                $('#dept-group, #role-group, #user-group')[ extend ? 'show' : 'hide' ]();
            });
        },
        toggleAdvSearchbox: function(){
            this[this.advSearchMode ? 'disableAdvSearchbox' : 'enableAdvSearchbox']();
            !this.advSearchMode && this.refreshParams();
            this.params.usernofeed = null;
            this.hideUserTip();
        },
        enableAdvSearchbox: function(){
            $('.feed-calendar-wrapper').hide();
            $('#feed-type-switcher').hide();
            $('.feed-adv-search-box').addClass('on');
            $('.adv-search-handler i').attr('class', 'icon-chevron-up');
            this.advSearchMode = true;
        },
        disableAdvSearchbox: function(){
            $('.feed-calendar-wrapper').show();
            $('#feed-type-switcher').show();
            $('.feed-adv-search-box').removeClass('on');
            $('.adv-search-handler i').attr('class', 'icon-chevron-down');
            this.advSearchMode = false;        
        },
        setAdvDateRange: function(s, e){
            $('#startdate').val( s.getFullYear() + '-' + ( parseInt( s.getMonth() ) + 1 ) + '-' + s.getDate() );
            $('#enddate').val( e.getFullYear() + '-' + ( parseInt( e.getMonth() ) + 1 ) + '-' + e.getDate() );
        },
        showEmptyTip: function(){
            $('#feed-empty-tip').show();
            $('#feedlist').html('');
        }, 
        hideEmptyTip: function(){
            $('#feed-empty-tip').hide();
        },
        showLoading: function(){
            $('#pageloading').show();
        },
        hideLoading: function(){
            $('#pageloading').hide();        
        },
        initPagination: function(){            
            var self = this,
            $pagi = $('#feed-pagination');
                
            $pagi.bootstrapPaginator({
                totalPages: 10,
                alignment: 'right',
                pageUrl: "javascript:void(0)",
                onPageChanged: function(e, prev, next){
                    self.params.curpage = next;
                    self.params.usernofeed = null;
                    self.params.searchnofeed = 0;
                    self.getFeed();
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
            //console.log(totalpage);
            if(totalpage <= 1){                
                this.pagination.$element.hide();
            }else{
                this.pagination.$element.show();
                this.pagination.currentPage = curpage;
                this.pagination.totalPages = totalpage;
                this.pagination.render();
            }
        
        
        },
        share: function(id){
            $('#shareModal').modal('show');
            var self = this;
            self.sharetags = $('#share-tags').data('tags') || $('#share-tags').tags().data('tags');
            $('#share-tags').attr('data-id', id);
            self.sharetags.clear();
           
            $.get(self.Router.GetSharelist, { feed_id: id }, function(d){ 

                d = d || [];

                var username="", usertext="";
                $.each(d, function(){
                    
                    self.sharetags.add(this);
                    username += this.value + ',';
                    usertext += this.text + ',';
                });
                                
                $('#sharename').val(username);

                $('#sharetext').val(usertext);
            });            
        },
        shareSubmit: function(){
            var self = this, 
            data = $('#share-tags').data('tags').serialize();
            data['feed_id'] = $('#share-tags').attr('data-id');
            data['op'] = 'share';
            $.get(self.Router.ShareFeed, data, function(flag){
                if(flag == 'ok'){
                    self.notify(td_lang.inc.msg_173);                    
                }else{
                    self.notify(td_lang.inc.msg_174);
                }
            });
        },
        cancelUpvote: function(id, $target){
            var self = this;
            var img = '<i class="iconfont">&#xe600;</i>';
            $.post(self.Router.Upvote, { fid: id, action: 'cancelUpvote' }, function(data){
                if(data.status == '1'){
                    $target.attr('data-cmd', 'upvote');
                    $target.html(img + '('+data.data.counter+')');
                    $target.removeClass('upvoted');
                    self.getFeed();
                }else{
                    
                }
            });
            
        },
        upvote: function(id, $target){
            var self = this;
            var img = '<i class="iconfont">&#xe600;</i>';
            $.post(self.Router.Upvote, { fid: id, action: 'upvote' }, function(data){
                if(data.status == '1'){
                    $target.attr('data-cmd', 'cancelUpvote');
                    $target.html(img + '('+data.data.counter+')');
                    $target.addClass('upvoted');
                    self.getFeed();
                }else{
                    
                }
            });
            
        },
        cancelFavorite: function(id, $target){
            var self = this;
            var img = '<i class="iconfont unFavorite">&#xe602;</i>';
            $.post(self.Router.Favorite, { fid: id, action: 'cancelFavorite' }, function(data){
                if(data.status == '1'){
                    $target.attr('data-cmd', 'favorite');
                    $target.html(img);
                }else{
                    
                }
            });
            
        },
        favorite: function(id, $target){
            var self = this;
            var img = '<i class="iconfont favorited">&#xe604;</i>';
            $.post(self.Router.Favorite, { fid: id, action: 'favorite' }, function(data){
                if(data.status == '1'){
                    $target.attr('data-cmd', 'cancelFavorite');
                    $target.html(img);
                    
                }else{
                    
                }
            });
            
        },
        deleteFeed: function(id){
            var self = this;
            this.confirm(td_lang.inc.msg_17, function(){
                $.get(self.Router.DelFeed, { fid: id }, function(data){
                    if(data && data.status == '1'){
                        self.notify(data.msg || td_lang.inc.msg_176);
                        $('#feed-item-' + id).remove();
                    }else{
                        self.notify(data ? data.msg : td_lang.inc.msg_177);
                    }
                });
            });
        },
        toggleReplyPanel: function(id, $panel){
            var $reply = $panel.find('[data-cmd="reply"]'),
                $ext = $('.feed-ext-body', $panel),
                isOn = $ext.hasClass('on');
            if(isOn){
                $panel.find('.feed-ft').hide();
                $ext.removeClass('on');
            }else{
                $('#feed-item-' + id).find('.feed-ext-body-readers').removeClass("on");
                $ext.addClass('on');
                $panel.find('.feed-ft').show();
                $panel.find('.feed-ft .ui-poptip-arrow-11').css('left', $reply.position().left + $reply.width()/2);
                this.getReply(id, $('.feed-ext-list', $panel));
                //this.initCommentBox(id);
            }            
        },
        toggleReadersPanel: function(id, $panel){
            var $readers = $panel.find('[data-cmd="readers"]'),
                $ext = $('.feed-ext-body-readers', $panel),
                isOn = $ext.hasClass('on');
            if(isOn){
                $panel.find('.feed-ft').hide();
                $ext.removeClass('on');
            }else{
                $('#feed-item-' + id).find('.feed-ext-body').removeClass("on");
                $ext.addClass('on');
                $panel.find('.feed-ft').show();
                $panel.find('.feed-ft .ui-poptip-arrow-11').css('left', $readers.position().left + $readers.width()/2);
                this.getReaders(id);
            }          
        },
        getReaders: function(id){
            var self = this;
            $('#feed-item-' + id).find('.feed-ext-readers').html("");
            $.get(self.Router.GetReaders, { DIA_ID: id }, function(d){ 
                if(d == ""){
                     $('#feed-item-' + id).find('.feed-ext-readers').html('<span>ÔÝÎÞÈËÔ±ä¯ÀÀ</span>');
                }
                else{
                    $.each(d, function(){
                        $('#feed-item-' + id).find('.feed-ext-readers').append("<span>"+this.text+"</span>");
                    });
                    
                }
            });
        },
        initCommentBox: function(id){
            var sharebox = $('#feed-item-' + id + ' [data-type="sharebox"]').sharebox({
                  "lang": td_lang.general.weixunshare,
                  "btn": {
                      'voice' : false,
                      'image' : false      
                  },
                  "atTag" : true,
                  "maxletter" : 200,
                  "custStyle": "inIspirit",
                  "emotionSkins" : {"qq":"QQ\u8868\u60c5","sina":"\u65b0\u6d6a\u5fae\u535a"},
                  "defaultEmotionSkin": "qq",
                  "resourceUrl" : "/static/images/face/",
                  "getEmotionUrl" : "/inc/emotions.php",
                  "searchUserUrl" : "/inc/chineseSpellUtils/search_user_by_pinyin.php",
                  "ajaxData" : {
                      saveUrl: 'wbaction.php',
                      action: "orgpost"
                  }
              }).data('sharebox');
              sharebox.textarea.addClass('feed-submit-cmt-context');
        },
        replyFeed: function(id){
            var $list = $('#feed-item-' + id + ' .feed-ext-list');
            this.getReply(id, $list);
        },
        getReply: function(id, $list){
            var self = this;
            $.get(this.Router.GetReply, { fid: id }, function(d){ 
                if(d && d.status == "1" && typeof d.data.datalist == 'object'){
                    $list.html(self.replyRender(d.data.datalist)); 
                }else{
                    self.notify(d.msg);
                }
            });
        },
        delReply: function(dia_id, cmt_id, type){
            var self = this;
            this.confirm(td_lang.inc.msg_178, function(){
                $.post(self.Router.DelReply, { id: cmt_id, action: 'delete', 'comment-type': type }, function(data){
                    if(data && data.status == '1'){
                        var selector = type != 'reply' 
                            ? '.feed-ext-list .feed-cmt-list-item[data-cmt-id="' + cmt_id + '"]' 
                            : '.feed-ext-list .feed-cmt-list-item.reply[data-cmt-id="' + cmt_id + '"]';
                        self.notify(td_lang.inc.msg_176 );
                        
                        $('#feed-item-' + dia_id).find(selector).hide();
                        if( type != 'reply'){
                            self.setFeedCounter(dia_id, -1);
                            $('#feed-item-' + dia_id).find('[data-comment-to-id="' + cmt_id + '"]').hide();
                        }
                    }else{
                        self.notify(td_lang.inc.msg_177);
                    }
                });
            });
        },
        submitReply: function(id){
            var self = this,
                $context = $('#feed-item-' + id),
                feed_uid = $context.find('.blog-info [data-uid]').attr('data-uid'),
                $form = $context.find('form[name="feed-comment-form"]'),
                data = $form.serializeArray(),
                $button = $form.find('.feed-submit-cmt-btn'),
                context = jQuery.trim($form.find('textarea.feed-submit-cmt-context').val()).replace(/\n/ig, " ");
                data.push({
                    name: 'action',
                    value: $form.find('input[name="comment-type"]').val() || 'comment'
                }); 
                data.push({
                    name: 'feed_uid',
                    value: feed_uid
                });
                
                
            if( context == ''){
                return;
            }
            data.push({
                name: 'text', 
                value: context
            });
            
            $button.button('loading');

            $.post(self.Router.SubmitComment, data, function(ret){
                if(ret && ret.status == '1'){
                    if(data[3].value!='reply')
                    {
                        self.setFeedCounter(id, 1);
                    }
                    self.replyFeed(id);
                }else{
                    self.notify(td_lang.inc.msg_179);
                }
                $button.button('reset');
                $form.find('textarea.feed-submit-cmt-context').val('');
            });
                
        },
        repost: function(feedId){
            window.open('/general/ipanel/smsbox/broadcast.php?ISPIRIT=&I_VER=&wxid='+feedId);
        },
        replyComment: function(feedId, cmtId, toId, toText, cmtType){
            var $context  = $('#feed-item-' + feedId),
                $cmtForm  = $context.find('form[name="feed-comment-form"]'),
                $cmtTo    = $cmtForm.find('.feed-ext-add-comment-to'),
                $inputTo  = $cmtForm.find('input[name="comment-to-uid"]'),
                $cmtId    = $cmtForm.find('input[name="comment-id"]'),
                $cmtType  = $cmtForm.find('input[name="comment-type"]'),
                $fid      = $cmtForm.find('input[name="fid"]'),
                api       = $cmtTo.data('tags') || $cmtTo.tags().data('tags');
                
            $inputTo.val(toId);    
            $cmtId.val(cmtId);    
            $cmtType.val(cmtType);    
            $fid.val(feedId);    
            
            api.clear();
            api.options.callbacks.remove = function(){
                $inputTo.val('');
                $cmtId.val('');
                $cmtType.val('');    
            };
            api.add({
                value: toId,
                text: td_lang.inc.msg_180 + toText
            });
        },
        setFeedCounter: function(dia_id, n){
            var $replyCounter = $('#feed-item-' + dia_id).find('[data-cmt-count]'),
            counter = parseInt( $replyCounter.attr('data-cmt-count') ) + n;                            
            $replyCounter.attr('data-cmt-count', counter);
            $replyCounter.html(td_lang.inc.msg_181 + '(' + counter + ')');
        },
        opRender: function(c){
            var tmpl = this.getTmpl('op');
            return tmpl.tmpl(c);
        },
        feedRender: function(c){
            var tmpl = this.getTmpl('feed');
            return tmpl.tmpl(c);        
        },
        replyRender: function(c){
            var tmpl = this.getTmpl('reply');
            return tmpl.tmpl(c);        
        },
        notify: function(c){
            alert(c);
        },
        confirm: function(txt, func){
            confirm(txt) && $.isFunction(func) && func();
        },
        imgview: function(id, self, parent){
            // if(id && aid && aname){
            //     window.open('/inc/image_view.php?ATTACHMENT_ID='+aid+'&ATTACHMENT_NAME='+aname+'&MODULE=weixunshare');
            // }
            var currSrc = self[0].src.slice(0,self[0].src.lastIndexOf('&'));
            var imgContainer = parent;
            var imgs = parent.find('img.attach');
            var srcs = [];
            var srcStr;
            var currId = 0;
            $.each(imgs,function(index,item) {
                srcs.push(encodeURIComponent(item.src.slice(0,item.src.lastIndexOf('&'))));
            });
            $.each(srcs,function(index,item) {
                if(item === encodeURIComponent(currSrc)) {
                    currId = index;
                }
            })
            srcStr = srcs.join('@~@');
            window.open('/inc/image_view.php?VIEW_MODE=gallery&CURRID=' +currId+'&MEDIA_URL=' + srcStr);

        }        
    };
        
    window.TFeed = TFeed;
    
    
})(jQuery, window);