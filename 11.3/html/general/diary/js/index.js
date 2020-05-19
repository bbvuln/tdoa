;(function($, win){
    var formatTime = function(c){
        var c = parseInt(c) * 1000;
        var a = G_obj_diaryinfo.serverTimestamp;    //服务器时间
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
    
    var DiaryTypes = {
        all: 0,
        mine: 1,
        others: 2,
        shared: 3,
        permission: 4
    };
    
    var tDiary = {
        Router: {
            GetFeedlist: 'get_diary_list.php',
            DelFeed: 'op_diary.php',
            ShareFeed: 'op_diary.php',
            GetReply: 'get_diary_comment.php',
            GetKeylist: 'get_search_subject.php',
            GetSharelist: 'get_diary_share.php',
            DelReply: 'op_diary_comment.php',
            SubmitComment: 'op_diary_comment.php',
            GetReaders: 'get_diary_readers.php',
			GetTOP: 'get_diary_top.php'
        },
        lastRequestTime: null,
        params: {
            ismain: G_obj_diaryinfo.isMain,
            curpage: 1,
            pagelimit: 10,
            type: DiaryTypes.mine,
            startdate: null,
            enddate: null,
            dept: null,
            role: null,
            user: null,
            db: null,
            keyword: '',
            searchnodiary: 0,
            usernodiary: null
        },
        refreshParams: function(){
            if(this.advSearchMode){
                this.params.curpage = 1;
                this.params.type = DiaryTypes[ $('#diarytype').val() ];
                this.params.startdate = $('#startdate').val();
                this.params.enddate = $('#enddate').val();
                this.params.dept = $('#deptname').val();
                this.params.role = $('#rolename').val();
                this.params.user = $('#username').val();
                this.params.db = $('#diarydb').val();
                this.params.keyword = $('#diary-search-query').val();
                this.params.usernodiary = '1';
                this.params.searchnodiary = 1;
            }else{
                var date = ( this.datetag && this.datetag.serialize.value ) || null;
                this.params.curpage = 1;
                this.params.startdate = date;
                this.params.enddate = date;                
                this.params.type = DiaryTypes[ $('#diary-type-switcher .active').attr('data-diary-type') ];
                this.params.dept = null;
                this.params.role = null;
                this.params.user = null;
                this.params.db = null;
                this.params.keyword = $('#diary-search-query').val();
                this.params.usernodiary = null;
                this.params.searchnodiary = 0;
            }
            this.getFeed();
            
        },
        init: function(c){
            this.initCalendar();
            this.initSearchBox();
            this.bindEvent();
            this.params.searchnodiary = 0;
            this.initTypeSwitcher();
            this.loadParam();
            this.getFeed();
        },
        loadParam: function(){
            if(G_obj_diaryinfo.fromUser!="")
            {
                this.params.user = G_obj_diaryinfo.fromUser;
                this.enableAdvSearchbox();
                this.usertags.add({ value: G_obj_diaryinfo.fromUser, text: G_obj_diaryinfo.fromUserName });
                $('#username').val(G_obj_diaryinfo.fromUser + ',');
                $('#usertext').val(G_obj_diaryinfo.fromUserName + ',');
                this.getFeed();
            }
        },
        bindEvent: function(){  
            var self = this;
            $('#diarylist').on('click.diarycmd', '[data-cmd]', function(){
                var $this = $(this), 
                $panel = $this.parents('[data-diary-id]').first(),
                diaryId = $panel.attr('data-diary-id'),
                cmd = $this.attr('data-cmd');
                switch(cmd){
                    case 'del':
                        self.deleteFeed(diaryId);
                        break;
                    case 'reply':
                        self.toggleReplyPanel(diaryId, $panel);
                        break;
                    case 'replyComment':
                        self.replyComment(diaryId, $this.attr('data-cmt-id'), $this.attr('data-to-id'), $this.attr('data-to-text'), 'sub')
                        break;
                    case 'replySubmit':
                        self.submitReply(diaryId);
                        break;
                    case 'delReply':
                        self.delReply(diaryId, $this.attr('data-cmt-id'), $this.attr('data-cmt-type'));
                        break;
                    case 'share':
                        self.share(diaryId);
                        break;
                    case 'readers':
                        self.toggleReadersPanel(diaryId, $panel);
                        break;
					case 'addtop'://yc
						self.addTop(diaryId);
						break;
					case 'deltop'://yc
						self.delTop(diaryId);
						break;
                    default:
                        break;
                }
            });
            $('.diary-types-box').on('click', '[data-type]', function(){
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
                $('#diary-search-query').val(''); 
                         
                if(!self.advSearchMode){                      
                    $('#diary-type-switcher').find('[data-diary-type="' + this.getAttribute('data-type') + '"]').click();
                }
                else
                {
                    self.disableAdvSearchbox(); 
                    self.params.usernodiary=null; 
                    self.hideUserTip();
                    $('#diary-type-switcher').find('[data-diary-type="' + this.getAttribute('data-type') + '"]').click();     				    
                }    
            });
            $('#diarylist').on('click', 'a[href]', function(){
                var href = $(this).attr("href"),
                text = this.innerText;
                if( href.match(/http:\/\//) ){                    
                    if(top.openURL){
                        top.openURL('diary' + (new Date).getTime(), text, href);
                    }else if( !( href.macth(/javascript\:void\(0\)/) || href.macth(/^#/) ) ){
                        top.open(href, 'diary' + (new Date).getTime());
                    }
                    return false;           
                }                   
            });
            $('#diarylist').delegate('.feed-ext-comment-sms-advcomment','change',function(){ 
                var ischecked = $(this).find("[name='advcomment']").prop('checked');
                if(ischecked){
                    $panel = $(this).parents('[data-diary-id]').first();
                    var $textarea = $panel.find(".feed-submit-cmt-context")[0];

                    $textarea.value = $textarea.value.replace(/\n/ig, '</br>');
                    $textarea.name = $textarea.name.replace("OA_HTML_EDIT", 'TD_HTML_EDIT');

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
            
            $('#diary-adv-search-box').on('click.diarycmd', '.date-quicklink', function(){
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
                var module_id = 'diary', 
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
                //清空公共方法保存数据的数组
                userSaveAndBind.deptname = [];
                userSaveAndBind.depttext = [];
                self.depttags.clear();
            });   
            
            $('#role-plus').click(function(){
                var module_id = 'diary', 
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
                //清空公共方法保存数据的数组
                userSaveAndBind.rolename = [];
                userSaveAndBind.roletext = [];
                self.roletags.clear();
            });
            
            $('#user-plus').click(function(){
                var module_id = 'diary', 
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
                //清空公共方法保存数据的数组
                userSaveAndBind.username = [];
                userSaveAndBind.usertext = [];
                self.usertags.clear();
            });          

            $('#share-plus').click(function(){
                var module_id = 'diary', 
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
                //清空公共方法保存数据的数组
                userSaveAndBind.sharename = [];
                userSaveAndBind.sharetext = [];
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
        createUserTip: function(){
        	var self = this;
        	$(".diary-dept-time").html("");
        	$(".diary-users-toggle").html("");
        	if(self.params.dept=='ALL_DEPT'){
                $('<span class="diary-dept label label-info">全体部门 </span>').appendTo($(".diary-dept-time"));
            };
        	var arr=$("#depttext").val().split(',');
            for(var i=0;i<arr.length-1;i++){
                $('<span class="diary-dept label label-info">'+arr[i]+"</span>").appendTo($(".diary-dept-time"));
            }
            if($("#startdate").val()!="" && $("#enddate").val()!=""){
                $('<span class="diary-month label label-info">'+self.params.startdate +'至'+ self.params.enddate+'</span>').appendTo($(".diary-dept-time"));
            }
            
        },
        showUserTip: function(){
            $("#diary-user-tip").show();
        },
        hideUserTip: function(){
            $("#diary-user-tip").hide();
        },
        getFeed: function(){
            var self = this,
            time = new Date;
            this.lastRequestTime = time;    
            self.showLoading();
            $.get( this.Router.GetFeedlist, this.params, function(c){
                if(time < self.lastRequestTime){
                    return;
                }
                if(c && c.datalist && c.datalist.length){
                    self.hideEmptyTip();
                    self.updateFeed(c.datalist);
                }else{
                    self.showEmptyTip();
                }
                if(self.params.usernodiary!=null && c && (c.nodiary_user!= undefined && c.nodiary_user.count>0)){
            	    self.createUserTip();
                    $("#nodiary_user_id").val(c.nodiary_user.uid);
                    $("#nodiary_user_name").val(c.nodiary_user.user_name);
                    $(".diary-viewpart").html(c.nodiary_user.short_user_name);
                    $(".diary-viewall").html(c.nodiary_user.user_name);
                    $("#count").html(c.nodiary_user.count);
                    if(c.nodiary_user.count > 10){
                        $(".diary-users-toggle").html("展开");
                        $(".diary-viewpart").html(c.nodiary_user.short_user_name +"等");
                        $(".diary-viewpart").show();
                        $(".diary-viewall").hide();
                    }
                    self.showUserTip();
                    self.hideEmptyTip();
            	}
            	else if(self.params.usernodiary!=null && c && (c.nodiary_user !=undefined && c.nodiary_user.count<=0)){
            	    self.hideUserTip();
            	}
                self.setPagination(c.curpage, c.totalpage);
                self.hideLoading();
                self.scrollTop();
				
            }).error(function(){
                self.notify(td_lang.module.msg_6);
                self.showEmptyTip();
                self.setPagination(0, 0);               
                self.hideLoading();
                self.scrollTop();
            });
        },
        scrollTop: function(){
            $('html,body').animate({scrollTop: 0}, 300);
        },
        updateFeed: function(c){
            $('#diarylist').html(this.feedRender(c));    
            fixAttachPosition($('#diarylist'));
        },
        initTypeSwitcher: function(){
            var self = this,
            $buttons = $('#diary-type-switcher button');
            $buttons.click(function(){
                $buttons.removeClass('active btn-primary')
                $(this).addClass('active btn-primary');
                self.params.type = DiaryTypes[ $(this).attr('data-diary-type') ];
                self.params.curpage = 1;
                self.params.searchnodiary = 0;
                self.getFeed();
            });
        },
        initCalendar: function(){
            var self = this;
           
            this.datetag = $('#diary-date-result').tags({
                callbacks: {
                    remove: function(){
                        self.unselectCalender();          
                    }
                }
            }).css('border', 'none').data('tags');
            
            this.calendar = $('#diary-calendar').calendarWidget({
                clickCallback: function(calendar, e){
                    self.calendarClickHandle(calendar, e, this);
                }
            }).data('calendarWidget');  
            
            this.calendar.options.renderCallback = function(){   
                    self.datetag.clear();                 
                    self.datetag.add(this.year + '-' + (parseInt(this.month) + 1))
                    self.params.startdate = this.year + '-' + (parseInt(this.month) + 1) + '-'  + 1;
                    self.params.enddate = this.year + '-' + (parseInt(this.month) + 1) + '-' + getDaysInMonth(this.month, this.year);
                    self.params.searchnodiary = 0;
                    self.getFeed();
            };
            
        },
        calendarClickHandle: function(calendar, e, dom){
            var date = calendar.year + '-' + (parseInt(calendar.month) + 1) + '-' + calendar.getActive();
            this.datetag.clear();
            this.datetag.add(date);          
            this.params.startdate = date;
            this.params.enddate = date;
            this.params.searchnodiary = 0;
            this.getFeed()
        },
        unselectCalender: function(){
            this.calendar.clearActive();            
            this.params.startdate = null;
            this.params.enddate = null;
            this.params.searchnodiary = 0;
            this.getFeed();             
        },
        initSearchBox: function(){
            var self = this;
            //搜索框下拉提示 (高级搜索时关闭)
            self.autocomplate = $('#diary-search-query').typeahead({
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
            $('#diary-search-query').keyup(function(e){
                if(e.keyCode == 13){
                    self.refreshParams();
                }
            });
            //范围选择 [所有的 | 有权限查看的] 时，显示部门、角色、人员选择
            $('#diarytype').change(function(){
                var value = $(this).val(),
                extend = value == 'all' || value == 'permission';
                
                $('#dept-group, #role-group, #user-group')[ extend ? 'show' : 'hide' ]();
            });
        },
        toggleAdvSearchbox: function(){
            this[this.advSearchMode ? 'disableAdvSearchbox' : 'enableAdvSearchbox']();
            !this.advSearchMode && this.refreshParams();
            this.params.usernodiary = null;
            this.hideUserTip();
        },
        enableAdvSearchbox: function(){
            $('.diary-calendar-wrapper').hide();
            $('#diary-type-switcher').hide();
            $('.diary-adv-search-box').addClass('on');
            $('.adv-search-handler i').attr('class', 'icon-chevron-up');
            this.advSearchMode = true;
        },
        disableAdvSearchbox: function(){
            $('.diary-calendar-wrapper').show();
            $('#diary-type-switcher').show();
            $('.diary-adv-search-box').removeClass('on');
            $('.adv-search-handler i').attr('class', 'icon-chevron-down');
            this.advSearchMode = false;        
        },
        setAdvDateRange: function(s, e){
            $('#startdate').val( s.getFullYear() + '-' + ( parseInt( s.getMonth() ) + 1 ) + '-' + s.getDate() );
            $('#enddate').val( e.getFullYear() + '-' + ( parseInt( e.getMonth() ) + 1 ) + '-' + e.getDate() );
        },
        showEmptyTip: function(){
            $('#diary-empty-tip').show();
            $('#diarylist').html('');
        }, 
        hideEmptyTip: function(){
            $('#diary-empty-tip').hide();
        },
        showLoading: function(){
            $('#pageloading').show();
        },
        hideLoading: function(){
            $('#pageloading').hide();        
        },
        initPagination: function(){            
            var self = this,
            $pagi = $('#diary-pagination');
                
            $pagi.bootstrapPaginator({
                totalPages: 10,
                alignment: 'right',
                pageUrl: "javascript:void(0)",
                onPageChanged: function(e, prev, next){
                    self.params.curpage = next;
                    self.params.usernodiary = null;
                    self.params.searchnodiary = 0;
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
            $('#share-tags').attr('data-diary-id', id);
            self.sharetags.clear();
           
            $.get(self.Router.GetSharelist, { diary_id: id }, function(d){ 

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
            data['diary_id'] = $('#share-tags').attr('data-diary-id');
            data['op'] = 'share';
            $.get(self.Router.ShareFeed, data, function(flag){
                if(flag == 'ok'){
                    self.notify(td_lang.inc.msg_173);                    
                }else{
                    self.notify(td_lang.inc.msg_174);
                }
            });
        },//yc
		addTop: function(id){
			var self = this;
			$.get(self.Router.GetTOP, { diary_id: id, op: 'add' }, function(flag){
				if(flag == 'ok'){
					self.notify("置顶成功");
					//parent.location.reload();
					self.getFeed();
				}else{
					self.notify("置顶失败");
				}
			});
			
        },
		delTop: function(id){
			var self = this;
			$.get(self.Router.GetTOP, { diary_id: id, op: 'del' }, function(flag){
				if(flag == 'ok'){
					self.notify("取消置顶成功");
					self.getFeed();
				}else{
					self.notify("取消置顶失败");
				}
			});
			
        },
        deleteFeed: function(id){
            var self = this;
            this.confirm(td_lang.inc.msg_175, function(){
                $.get(self.Router.DelFeed, { diary_id: id, op: 'del' }, function(flag){
                    if(flag == 'ok'){
                        self.notify(td_lang.inc.msg_176);
                        $('#diary-feed-' + id).remove();
                    }else{
                        self.notify(td_lang.inc.msg_177);
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
                $('#diary-feed-' + id).find('.feed-ext-body-readers').removeClass("on");
                $ext.addClass('on');
                $panel.find('.feed-ft').show();
                $panel.find('.feed-ft .ui-poptip-arrow-11').css('left', $reply.position().left + $reply.width()/2);
                this.getReply(id, $('.feed-ext-list', $panel));
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
            	$('#diary-feed-' + id).find('.feed-ext-body').removeClass("on");
                $ext.addClass('on');
                $panel.find('.feed-ft').show();
                $panel.find('.feed-ft .ui-poptip-arrow-11').css('left', $readers.position().left + $readers.width()/2);
                this.getReaders(id);
            }          
        },
        getReaders: function(id){
            var self = this;
            $('#diary-feed-' + id).find('.feed-ext-readers').html("");
            $.get(self.Router.GetReaders, { DIA_ID: id }, function(d){ 
                if(d == ""){
                     $('#diary-feed-' + id).find('.feed-ext-readers').html('<span>暂无人员浏览</span>');
                }
                else{
                	$.each(d, function(){
                		$('#diary-feed-' + id).find('.feed-ext-readers').append("<span>"+this.text+"</span>");
                    });
                	
                }
            });
        },
        replyFeed: function(id){
            var $list = $('#diary-feed-' + id + ' .feed-ext-list');
            this.getReply(id, $list);
        },
        getReply: function(id, $list){
            var self = this;
            $.get(this.Router.GetReply, { DIA_ID: id }, function(d){ 
                $('#diary-feed-' + id).find('.feed-ext-comment-sms-op').html(d.sms_op);
                if(d && typeof d.comment_data == 'object'){
                    $list.html(self.replyRender(d.comment_data)); 
                    fixAttachPosition($list);
                }
            });
        },
        delReply: function(dia_id, cmt_id, type){
            var self = this;
            this.confirm(td_lang.inc.msg_178, function(){
                $.get(self.Router.DelReply, { id: cmt_id, op: 'del', 'comment-type': type }, function(flag){
                    if(flag == 'ok'){
                        var selector = type != 'sub' 
                            ? '.feed-ext-list .feed-cmt-list-item[data-cmt-id="' + cmt_id + '"]' 
                            : '.feed-ext-list .feed-cmt-list-item.sub[data-cmt-id="' + cmt_id + '"]';
                        self.notify(td_lang.inc.msg_176 );
                        
                        $('#diary-feed-' + dia_id).find(selector).hide();
                        if( type != 'sub'){
                            self.setDiaryCounter(dia_id, -1);
                            $('#diary-feed-' + dia_id).find('[data-comment-to-id="' + cmt_id + '"]').hide();
                        }
                    }else{
                        self.notify(td_lang.inc.msg_177);
                    }
                });
            });
        },
        submitReply: function(id){
            var self = this,
                $context = $('#diary-feed-' + id),
                uid = $context.find('.blog-info [td-user-id]').attr('td-user-id'),
                $form = $context.find('form[name="feed-comment-form"]'),
                data = $form.serializeArray(),
                $button = $form.find('.feed-submit-cmt-btn'),
                isHtml = $context.find("[name='advcomment']").prop('checked'),
                context = isHtml 
                            ? getEditorHtml("feed-submit-cmt-context-"+id) 
                            : jQuery.trim($form.find('textarea.feed-submit-cmt-context').val()).replace(/\n/ig, "<br />");
                data.push({
                    name: 'op',
                    value: 'add'
                }); 
                data.push({
                    name: 'au-id',
                    value: uid
                });
                
                
            if( context == ''){
                return;
            }
            data.push({
                name: isHtml?'TD_HTML_EDITOR_feed-submit-cmt-context':'OA_HTML_EDITOR_feed-submit-cmt-context',
                value: context
            });
            $button.button('loading');

            $.post(self.Router.SubmitComment, data, function(ret){
                if(ret && ret.flag == 'ok'){
                    if(data[3].value!='sub')
                    {
                        self.setDiaryCounter(id, 1);
                    }
                    self.replyFeed(id);
                }else{
                    self.notify(td_lang.inc.msg_179);
                }
                $button.button('reset');
                try{
                    isHtml && setHtml("feed-submit-cmt-context-"+id);
                }catch(e){}
                $form.find('textarea.feed-submit-cmt-context').val('');
            });
                
        },
        replyComment: function(diaryId, cmtId, toId, toText, cmtType){
            var $context  = $('#diary-feed-' + diaryId),
                $cmtForm  = $context.find('form[name="feed-comment-form"]'),
                $cmtTo    = $cmtForm.find('.feed-ext-add-comment-to'),
                $inputTo  = $cmtForm.find('input[name="comment-to"]'),
                $cmtId    = $cmtForm.find('input[name="comment-id"]'),
                $cmtType  = $cmtForm.find('input[name="comment-type"]'),
                $diaryId  = $cmtForm.find('input[name="diary-id"]'),
                api       = $cmtTo.data('tags') || $cmtTo.tags().data('tags');
                
            $inputTo.val(toId);    
            $cmtId.val(cmtId);    
            $cmtType.val(cmtType);    
            $diaryId.val(diaryId);    
            
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
        setDiaryCounter: function(dia_id, n){
            var $replyCounter = $('#diary-feed-' + dia_id).find('[data-cmt-count]'),
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
        }        
    };
        
    window.tDiary = tDiary;
    
    $(function(){
        tDiary.init();
    });
    
})(jQuery, window);