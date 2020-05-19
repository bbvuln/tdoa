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

    $.fn.serializeChecked = function(key){
        var ret = {};
        this.each(function(){
            ret[this.name] = ret[this.name] || [];
            ret[this.name].push(this.value);
        });
        return ret[key] ? ret[key].join(',') : '';
    };
    
    var FeedTypes = {
        all: 0,
        mine: 1,
        others: 2,
        shared: 3,
        permission: 4
    };
    
    var TFeed = function(){
        this.init.apply(this, arguments);
    };
    TFeed.prototype = {
        constructor: TFeed,
        Router: {
        	//获取右侧承办部门表
            GetTaskContent:'/general/portal/personal/doc_count.php?OUTPUT=1',
            //获取反馈意见
            GetAllFeed: '/general/workflow/list/feeddata.php'
        },
        lastRequestTime: null,
        params: {
            curpage: 1,
            pagelimit: 10,
            type: 'all',
            subtype: null,
            startdate: null,
            enddate: null,
            status: 'all',
        },
        init: function(c){
            var self = this;
            this.$el = $(c.el);
            this.bindEvent();
            this.initStatusSwitcher();
        },
        on: function(key, name){
            $.fn.on.apply(this.$el, arguments);
        },
        off: function(){
            $.fn.off.apply(this.$el, arguments);
        },
        trigger: function(key){
            this.$el.trigger(key, this);
        },
        loadParam: function(){
            if(G_obj_feedinfo.fromUser!="")
            {
                this.params.user = G_obj_feedinfo.fromUser;
                this.enableAdvSearchbox();
                this.usertags.add({ value: G_obj_feedinfo.fromUser, text: G_obj_feedinfo.fromUserName });
                $('#username').val(G_obj_feedinfo.fromUser + ',');
                $('#usertext').val(G_obj_feedinfo.fromUserName + ',');
                //this.getFeed();
            }
        },
        bindEvent: function(){  
            var self = this; 
            this.$el.on('click.feedcmd', '[data-cmd]', function(e){
                var $this = jQuery(this), 
                $panel = $this.parents('[data-feed-id]').first(),
                feedId = $panel.attr('data-feed-id'),
                cmd = $this.attr('data-cmd');
                switch(cmd){
                    case 'task-item':
                        self.showTask(feedId);
                        e.preventDefault();
                        break;
                    case 'feed-num':
                        self.getAllFeed(feedId,$panel);
                        e.preventDefault();
                        break;
                    default:
                        break;
                }
            });
            
            jQuery('[data-status]').click(function(){
                var $this = jQuery(this);
                $this.parent('li').siblings().removeClass('active');
                $this.parent('li').addClass('active');
            });    
            $('.basic-search-handler').click($.proxy(this.disableAdvSearchbox, this));
   
        },
        //点击任务进展
        showTask: function(id){
        	var self = this,
            time = new Date;
            this.lastRequestTime = time;    
            $.get( this.Router.GetTaskContent, { task_id: id },function(data){
                if(time < self.lastRequestTime){
                    return;
                }
                data.serverTime && (self.serverTimestamp = data.serverTime);
                if(data && data.length){
                    self.hideEmptyTip();
                  	//$('.sidebar').html();

                }else{
                	return ;
                }
               
            }).error(function(){
                self.notify(td_lang.module.msg_6);
            });
        	
        },
        //点击反馈
        getAllFeed: function(id,$panel){
        	var self = this,
            time = new Date;
            this.lastRequestTime = time;    
            $.get( this.Router.GetAllFeed, { task_id: id},function(data){
                if(time < self.lastRequestTime){
                    return;
                }
                data.serverTime && (self.serverTimestamp = data.serverTime);
                if(data && data.length){
                	data.appendTo($panel.find(".pop-content"));
                }else{
                	return ;
                }
            }).error(function(){
                self.notify(td_lang.module.msg_6);
            });
        },
        initStatusSwitcher: function(){
            var self = this,
            $buttons = $('#statusbasic [data-status]');
            $buttons.click(function(){
                $('#statusbasic li.active').removeClass('active')
                $(this).addClass('active');
                self.params.type = $(this).attr('data-status');
                self.params.curpage = 1;
            });
        },
        /*
        initPagination: function(){            
            var self = this,
            $pagi = $('#feed-pagination');
                
            $pagi.bootstrapPaginator({
                totalPages: 10,
                alignment: 'right',
                pageUrl: "javascript:void(0)",
                onPageChanged: function(e, prev, next){
                    self.params.curpage = next;
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
        */
        toggleReadedPanel: function(id, $panel){
            var $reply = $panel.find('[data-cmd="readed"]'),
                $ext = $('.feed-ext-body', $panel),
                isOn = $ext.hasClass('on') && $ext.hasClass('readed');
            if(isOn){
                $panel.find('.feed-ft').hide();
                $ext.removeClass('on reply readed');
            }else{
                $ext.removeClass('reply').addClass('on readed');
                $panel.find('.feed-ft').show();
                $panel.find('.feed-ft .ui-poptip-arrow-11').css('left', $reply.position().left + $reply.width()/2);
                this.getReaded(id, $('.feed-ext-list', $panel));
            }            
        },
       
        setFeedCounter: function(feed_id, n){
            var $replyCounter = $('#feed-feed-' + feed_id).find('[data-cmt-count]'),
            counter = parseInt( $replyCounter.attr('data-cmt-count') ) + n;                            
            $replyCounter.attr('data-cmt-count', counter);
            $replyCounter.html(td_lang.inc.msg_181 + '(' + counter + ')');
        }    
    };
    window.TFeed = TFeed;    
})(jQuery, window);