define('tDesktop',function(require, exports, module){

    //require
    var $ = window.jQuery;
    var JSON = window.JSON;

    //require Plugin
    var TabObj = require('tDesktop/tDesktop.Tabs');
    var tab = TabObj.Tabs;
    var LayoutObj = require('tDesktop/tDesktop.Layout');
    var MenuObj = require('tDesktop/tDesktop.Menu');
    var ThemeObj = require('tDesktop/tDesktop.Theme');
    var theme = ThemeObj.Theme;
    var TodayObj = require('tDesktop/tDesktop.Today');
    var IMObj = require('tDesktop/tDesktop.IM');
    var NocboxObj = require('tDesktop/tDesktop.Nocbox');
    var nocbox = NocboxObj.Nocbox;
    var Search = require('tDesktop/tDesktop.Search');
    var Notification = require('tDesktop/tDesktop.Notification');

    //define search init variaty
    var hasSearchModuleBeenInit;

    window.winexe = function(NAME, PROG) {
        var URL = "/general/winexe/?PROG=" + PROG + "&NAME=" + NAME;
        window.open(URL, "winexe", "height=100,width=350,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top=0,left=0,resizable=no");
    }

    window.createTab = function(id, name, code, open_window){
        tab.createTab(id, name, code, open_window);
        $('body').removeClass('showSearch').removeClass('right-mini');
		$('#eastbar,#searchbar').removeClass('on');
		if(tDesktop.isTouchDevice()){
			$('#east').addClass('mobile-east').hide();
			$('#first_menu li div').removeClass('first-menu-item-hover');
			$('#menu-panel,#mask').hide();
		}
    };
    window.selectTab = function(id){
        tab.selectTab(id);
    };
    window.closeTab = function(id){
        id = (typeof(id) != 'string') ? tab.getSelected() : id;
            tab.closeTab(id);
    };
    window.IframeLoaded = function(id){
        tab.IframeLoaded(id);
    };

    //click org avatar open the chat dialog by tl
    window.send_msg = function(uid, title){
        IMObj.IM.Org.nodeclick(uid, title);
    }
    window.fixAvatar = function(uid){
        IMObj.IM.RecentList.fixAvatar(uid);
    }

    var nextTabId = 10000;
    window.openURL = function(id, name, url, open_window, width, height, left, top){
       id = !id ? ('w' + (nextTabId++)) : id;
       if(open_window != "1")
       {
          window.setTimeout(function(){jQuery().addTab(id, name, url, true)}, 1);
       }
       else
       {
          width = typeof(width) == "undefined" ? 780 : width;
          height = typeof(height) == "undefined" ? 550 : height;
          left = typeof(left) == "undefined" ? (screen.availWidth-width)/2 : left;
          top = typeof(top) == "undefined" ? (screen.availHeight-height)/2-30 : top;
          window.open(url, id, "height="+height+",width="+width+",status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+top+",left="+left+",resizable=yes");
       }
       jQuery(document).trigger('click');
    }
    $.fn.addTab = function(id, title, url, closable, selected){
        tab.addTab(id, title, url, closable, selected);
        $('body').removeClass('showSearch').removeClass('right-mini');
        $('#eastbar,#searchbar').removeClass('on');
		if(tDesktop.isTouchDevice()){
			$('#east').addClass('mobile-east').hide();
		}
    };
    $.fn.selectTab = function(id){
        tab.selectTab(id);
    };
    $.fn.closeTab = function(id){
        id = (typeof(id) != 'string') ? tab.getSelected() : id;
        tab.closeTab(id);
    };
    $.fn.getSelected = function(){
        return $('#tabs_container').tabs('selected');
    };
	var Iscroll;
    var TDesktop = Backbone.View.extend({
        el: $('body'),
		iscroller: {},
        events: {
            'click a#person_info': 'initPersonInfo',
            'click a#logout': 'initLogout',
            'click a#searchbar': 'initSearch',
            'click a#totaskbar': 'initTaskCenter',
            'click a#tosns': 'initSns',
            'click a#cloudMark': 'initCloudMark',
            'click a#eastbar': 'initEast',
			'click ul#first_menu':'touchDevicePanel'
        },
        initialize: function(){
            if(TDesktop._instance){
                return TDesktop._instance;
            }
            _.bindAll(this, 'initPersonInfo', 'initLogout', 'initSearch','initEast', 'initTaskCenter','initSns','initCloudMark');
            var self = this;

            self.EventManager = {};
            _.extend(self.EventManager, Backbone.Events);

			self.initIscrollEvent();
			self.initIscrollRefresh();
            self.initLayout();
            self.initMenu();
            self.initTabs();
            self.initPortal();
            self.initTheme();
            self.initTip();
            self.initToday();
            self.initOnline();
            self.initNotify();
            self.initNocbox();
            self.initIM();
            self.initNotification();
            self.initHeroBar();

            TDesktop._instance = this;

			//for iPad touch
            if(self.isTouchDevice())
            {
                Iscroll = require('/static/js/iscroll.js');
                $('#east').hide();
                $('body').addClass('mobile-body');
                $('#center').addClass('mobile-center');
				$('#west').prepend('<div id="menu-panel"><div id="menu-panel-scroller"></div></div>');
				self.EventManager.trigger('iscroller:create','menu-panel');


				$('#new_noc_list_wrapper').css({"overflow":"hidden"});
				self.EventManager.trigger('iscroller:create',"new_noc_list_wrapper");
				$(window).resize(function(){
					var iscrollh = $('#west').height();
					$('#west-body-wrapper').css({"height":iscrollh,"overflow":"hidden"});
					self.EventManager.trigger('iscroller:refresh','west-body-wrapper');
				});

				$("body").delegate('.first-menu li','click',function(){
					$('#first_menu li div').removeClass('first-menu-item-hover');
					$(this).children('div').addClass('first-menu-item-hover');
					var id = $(this).attr('data-submenu-id');
					if($('#first_menu li div').hasClass('first-menu-item-hover')){
						$('#menu-panel').show();
						var menu_content = $('#'+ id).html();
						$('#menu-panel-scroller').html( "<div>" + menu_content + "<div>");
						self.EventManager.trigger('iscroller:refresh','menu-panel');
						$('#mask').show();
					}else{
						$('#menu-panel,#mask').hide();
					}
				});

				$('body').delegate('#mask','touchend',function(){
					$('#first_menu li div').removeClass('first-menu-item-hover');
					$('#menu-panel,#mask').hide();
				});

                document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
            }
        },
		initIscrollEvent: function(){
			var self = this;
			self.EventManager.on('iscroller:create',function(id){
				var myScroll = new IScroll('#' + id, {
					scrollbars: false,
					mouseWheel: true,
					interactiveScrollbars: true,
					shrinkScrollbars: 'scale',
					preventDefault: false,
					fadeScrollbars: true
				});
				self.iscroller[id] = myScroll;
			});
		},
		initIscrollRefresh: function(){
			var self = this;
			self.EventManager.on('iscroller:refresh',function(id){
				var myScroll = self.iscroller[id];
				myScroll && myScroll.refresh();

			});
		},
        initTip: function(){
			var self = this;
			if(self.isTouchDevice()){
				return;
			}else{
				if(jQuery && jQuery.fn.tooltip){
					jQuery('[data-toggle="tooltip"]').tooltip({
						container: 'body'
					});
				}
			}
        },
        isTouchDevice: function(){
          try{
            document.createEvent('touchEvent');
            if (userAgent.indexOf("mobile") >= 0 || userAgent.indexOf("maxthon") > 0){
                return true
            }else{
                return false
            }
          }
          catch(err){}
        },
        initLayout: function(){
            var layout = new LayoutObj.Layout({ tDesktop: this });

        },
        initMenu: function(){
			var self = this;
			if (self.isTouchDevice()){
				$('.menu-scroll').remove();
				var menu = new MenuObj.Menu.MenuInit({ tDesktop: this });

				var iscrollh = $('#west').height() -40;
				$('#west-body-wrapper').css({"height":iscrollh,"overflow":"hidden"});
				self.EventManager.trigger('iscroller:create','west-body-wrapper');
				this.menu = menu;
				this.EventManager.on('createTab', function(){
					menu.hideActiveMenu();
				});
				$("#first_menu").resize();
			}else{
				var menu = new MenuObj.Menu.MenuInit({ tDesktop: this });
				var menuscroll = new MenuObj.Menu.MenuScroll({ tDesktop: this });
				menu.menuHover();
				this.menu = menu;
				this.EventManager.on('createTab', function(){
					menu.hideActiveMenu();
				});
				$("#first_menu").resize();
			}

        },
        initTabs: function(){
            var self = this;
            tab.init();
            tab._createTab = tab.createTab;
            tab.createTab = function(){
                tab._createTab.apply(tab, arguments);
                self.EventManager.trigger('createTab');
            }
        },
        initPortal: function(){
            for(var i=0; i < portalLoadArray.length; i++)
            {
                tab.addTab('portal_'+portalLoadArray[i].id, portalLoadArray[i].title, portalLoadArray[i].url, portalLoadArray[i].closable, (i==0));
            }
        },
        initTheme: function(){
            theme.init();
        },
        initSearch: function(){
            //---------- lijun ----------
            if(!hasSearchModuleBeenInit) {
                hasSearchModuleBeenInit = Search.init();
            }
            $("#eastbar").removeClass('on');
			var self = this
			if(self.isTouchDevice()){
				$('#east').addClass('mobile-east').hide();
			}
            $("#searchbar").toggleClass('on');
            $('body').removeClass('right-mini').toggleClass('showSearch');

        },
        initToday: function(){
            var deskdate = new TodayObj.Today.Deskdate({ tDesktop: this });
            var weather = new TodayObj.Today.Weather({ tDesktop: this });
            var calendar = new TodayObj.Today.Calendar({ tDesktop: this });
            var reminder = new TodayObj.Today.Reminder({ tDesktop: this });
        },
        initOnline: function(){
            $('#online_flag').click(function(){
                if($('#on_status:visible').length>0){
                    $('#on_status').hide();
                }
                else{
                    $('#on_status').show();
                }
            });
            $('#on_status > a').click(function(){
                var status = $(this).attr('status');
                if(status < "1" || status > "4") return;
                $.get("ipanel/ispirit_api.php", {API:"on_status",CONTENT: status});
                var target = $(this).find('i').text();
                var targetClass = $(this).find('i').attr('class');
                $('#online_flag').text(target).attr('class', targetClass);
                $('#on_status').fadeOut(300);
            });
        },
        initPersonInfo: function(){
            window.createTab('11', func_array["f11"][0], func_array["f11"][1], func_array["f11"][4]);
        },
        initLogout: function(){
            var relogin = 0;
            var msg = sprintf(td_lang.inc.msg_109, loginUser.user_name) + "\n" + sprintf(td_lang.inc.msg_110, logoutText + "\n\n");
            if(window.confirm(msg))
            {
                relogin=1;
                window.location="/general/relogin.php";
            }
        },
        initTaskCenter: function(){
            $('body').addClass('left-mini');
            window.createTab('taskcenter', td_lang.general.project.msg_3, 'task_center', false);
        },
        initSns: function(){
            window.createTab(73,func_array["f73"][0],'sns','');
        },
        initCloudMark: function(){
            window.createTab(328,func_array["f328"][0],func_array["f328"][1],'');
        },
        initEast: function(){
			var self = this;
			$("#searchbar").removeClass('on');
			$("#eastbar").toggleClass('on');
			$('body').removeClass('showSearch');
			if (self.isTouchDevice()){
				$('#east').css('right','0');
				if($("#eastbar").hasClass('on')){
					$('#east').addClass('mobile-east').show();
					// $('body').addClass('right-mini');
				}else{
					$('#east').addClass('mobile-east').hide();
					// $('body').removeClass('right-mini');
				}
			}else{
				$('body').toggleClass('right-mini');
			}

        },
        initNocbox: function(){
				nocbox.init({ tDesktop: this });
        },
        formatTime: function(c){
            var c = parseInt(c) * 1000;
            var a = new Date();
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
            return e;
        },
        initIM: function(){
            var im = IMObj.IM;
            im.init({ tDesktop: this });
        },
        initNotify: function(){
            if($('#notify_panel').length > 0)
            {
                $('#overlay').show();
                $('#notify_panel').show();
                $('#notify_panel .btn-ok').click(function(){
                    var cookie_name = $(this).attr("cookie_name");
                    var cookie_value = $(this).attr("cookie_value");
                    document.cookie = cookie_name + "=" + cookie_value; path="/"; expires=1000;
                    $('#notify_panel .btn-close').click();
                });
                $('#notify_panel .btn-close').click(function(){
                    $('#overlay').hide();
                    $('#notify_panel').hide();
                });
                $('#notify_panel .head-close').click(function(){
                    $('#notify_panel .btn-close').click();
                });
            }

        },
        initNotification: function() {
            Notification.init(this);
        },
        initHeroBar: function(){
        	if($('#tongdainfo').length <= 0)
         		return;
			$.get('tongda.php', function(data){
				if(data.code == '1' && typeof(data.data) == 'object' && data.data.length > 0)
				{
					$('#tongdainfo a').remove();
					for(var i=0; i<data.data.length; i++)
					{
						if(data.data[i].type == '1')
						{
							if(jQuery.cookie('hide_notice_' + data.data[i].id) != '1' && ( data.data[i].flag != '1' || cur_login_user_priv == '1'))
							{
								jQuery('#notice_tip').show();
								jQuery('#notice_head').html(data.data[i].text);
								jQuery('#notice_body').html(data.data[i].content);
								jQuery('#notice_foot').html('<a onclick="jQuery(\'#notice_tip\').hide();jQuery.cookie(\'hide_notice_' + data.data[i].id + '\', 1, {expires:1000, path:\'/\'});" href="' + data.data[i].href + '" class="btn btn-small btn-primary" target="_blank">' + td_lang.inc.msg_146 + '</a>&nbsp;<a href="javascript:;" class="btn btn-small" onclick="jQuery(\'#notice_tip\').hide();jQuery.cookie(\'hide_notice_' + data.data[i].id + '\', 1, {expires:1000, path:\'/\'});">' + td_lang.global.close + '</a>');
							}
						}
						else
						{
							$('#tongdainfo').append('<a href="' + data.data[i].href + '" class="' + data.data[i].class_name + '" target="' + data.data[i].target + '" style="' + data.data[i].style + '"><span>' + data.data[i].text + '</span></a>');
						}
					}
				}
			}, 'json');
        }
    });

    TDesktop.getInstance = function(){
        return TDesktop._instance;
    };
    exports.TDesktop = TDesktop;
    window.TDesktop = TDesktop;
});
