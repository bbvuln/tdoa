/*	
 *	Pad HD by JinXin @ 2012/10/16
 */

(function(win, $) {

	win.tPad = {
		//浏览器访问
		isBrowser: (P_VER != 5 && P_VER != 6),
		//android客户端
		isAndroid: (P_VER == 6 && typeof(window.Android) != 'undefined'), //&& typeof(window.Android.imenable) == 'function'
		//客户端登陆时获取android版本号
		getAndroidVersion: function() {
			try {
				return window.Android.getversion();
			} catch (e) {
				return null;
			}
		},
		//ipad&iphone 某些浏览器会用UA欺骗，增加对vendor的检测
		isIDevice: (/iphone|ipad/gi).test(navigator.appVersion) && (/Apple/gi).test(navigator.vendor), //
		//return false：ipad、iphone、android4.0+  
		clickEvt: (function() {
			try {
				document.createEvent("TouchEvent");
				return 'touchend';
			} catch (e) {
				return 'click';
			}
		})(),
		documentloaded: function() {
			//tPad.log.dir(navigator);
			try {
				if (P_VER == 6) {
					window.Android.documentloaded();
				} else if (P_VER == 5) {
					location = 'documentloaded:';
				}
			} catch (e) {};
		},
		lowEffect: (function() {

			return !( 
					   ( /iphone|ipad/gi.test(navigator.appVersion) && /Apple/gi.test(navigator.vendor) )
					|| (/Win/gi).test(navigator.platform)
					|| ( ('performance' in window) && /android/gi.test(navigator.appVersion) ) 
				   ); //not iphone or ipad or windows or android 4.0+

		})(),

		effectFix: function() {
			$('body').addClass(win.tPad.lowEffect ? 'lowEffect' : '');
		},

		getTime: function() {
			return (new Date).getTime();
		},
		//手持设备没有console，模拟一个调试用
		log: (function() {
			var log = function(s) {
				if (!$('#tPad-log').size()) {
					log.init();
				}
				$('#tPad-log').show().append('<i>' + s + '</i>');
				log.scroller.refresh();
			};
			log.init = function() {
				$('<div id="tPad-log-wrapper" class="wrapper"><div id="tPad-log" class="scroller"></div></div>').prependTo('body');
				log.scroller = new iScroll($('#tPad-log-wrapper')[0]);
				$('#tPad-log-wrapper').bind('dblclick', function() {
					$(this).hide();
				});
			};
			log.destory = function() {
				$('#tPad-log').remove();
			};
			log.clear = function() {
				$('#tPad-log').html('');
			};
			log.wrap = function() {
				log('<br />');
			};
			log.dir = function(o) {
				$.each(o, function(i, n) {
					log(i + ': ' + n);
					log.wrap();
				});
			};
			return log;
		})(),

		SideSelector: '#sideContentArea',
		MainSelector: '#mainContentArea',
		sideDelegate: function(selector, func) {
			$(tPad.SideSelector).delegate(selector, 'click', func);
		},
		mainDelegate: function(selector, func) {
			$(tPad.MainSelector).delegate(selector, 'click', func);
		},
		gesturestart: function(e) {
			win.tPad.gesture = {
				pageX: e.pageX,
				pageY: e.pageY,
				layerX: e.layerX,
				layerY: e.layerY
			};
			if (e.target.nodeType == 1) {
				//return false;
			}
			// console.log(e);
			// window.e = e;
			// for(var i in e){
			// $('body').prepend('<p>'+i+':'+e[i]+'</p>');
			// }
		},
		gesturechange: function(e) {
			if (!'gesture' in win.tPad) {
				return;
			}


			var gesture = win.tPad.gesture,
				d = e.pageX - gesture.pageX;

			if (Math.abs(d) < 100) {
				return;
			}
			if (d > 0) {
				win.tPad.changeLayout('side');
				//$('body').prepend('<p>pageX:'+e['pageX']+'</p>');
				return false;
			} else {
				win.tPad.changeLayout('');
				return false;
			}
		},
		gestureend: function(e) {
			delete win.tPad.gesture;
		},
		refresh: function() {

			if (tPad.isBrowser) {

				location.reload();

			} else if (tPad.isAndroid) {

				window.Android.refresh();

			} else if (tPad.isIDevice) {

				location = 'refresh:';

			}
		},
		relogin: function() {

			if (tPad.isBrowser) {
				if (confirm(td_lang.pad.reloginTip)) {
					location = 'index.php';
				}
			} else if (tPad.isAndroid) {

				window.Android.backtomain();

			} else if (tPad.isIDevice) {

				location = 'relogin:';

			}
		},
		changeBackground: function(url) {

			if (tPad.isBrowser) {
				var img = new Image();
				img.src = url;
				tPad.loadingMessage.show();
				img.onload = function() {
					var bgsize, bgrepeat;
					if (img.width <= 700 && img.height <= 700) {
						bgsize = 'auto';
						bgrepeat = 'repeat';
					} else {
						bgsize = '100% 100%';
						bgrepeat = 'norepeat';
					}

					$('body').css({
						'background-image': 'url(' + url + ')',
						'background-size': bgsize,
						'background-repeat': bgrepeat
					});

					tPad.loadingMessage.hide();
					setCookie('app_bg_index', url.split('/').pop().split('.')[0], {
						path: '/'
					});
					setCookie('app_bg_url', url, {
						path: '/'
					});
					setCookie('app_bg_size', bgsize, {
						path: '/'
					});
					setCookie('app_bg_repeat', bgrepeat, {
						path: '/'
					});
				};

			} else {
				//for client
				var i = url.split('/').pop().split('.')[0];

				if (tPad.isAndroid) {

					window.Android.setbackground(parseInt(i));

				} else if (tPad.isIDevice) {

					document.location = 'background:' + i;

				}

			}
		},

		changeLayout: function(type) {
			var l = this.layout;
			switch (type) {
				case 'none':

					break;
				case 'side':

					$(this.SideSelector).attr('class', 'layout-side');

					$(this.MainSelector).attr('class', (!l || l == 'side') ? 'layout-side' : 'slide-out-r');

					break;

				case 'main':

					$(this.SideSelector).attr('class', (!l || l == 'main') ? '' : 'slide-out-l');

					$(this.MainSelector).attr('class', (!l || l == 'side') ? '' : 'layout-main');

					break;
				case 'both':
				default:

					$(this.SideSelector).attr('class', (!l || l == 'main') ? 'slide-in-r' : 'layout-both');

					$(this.MainSelector).attr('class', (!l || l == 'side') ? 'layout-both' : 'layout-both');

					break;
			}


			this.layout = type || 'both';
		},

		VoiceMessage: {
			recordStart: function() {
				window.Android.VoiceMessageRecordStart();
			},
			recordStop: function(qid, callback) {
				var ret = window.Android.VoiceMessageRecordStop(qid, p.split(';')[1]);
				callback && callback(ret);
			},
			playStart: function(id, name) {
				window.Android.VoiceMessagePlayStart(id, name, p.split(';')[1]);
			},
			playStop: function() {
				window.Android.VoiceMessagePlayStop();
			}
		},

		multi: {
			init: function(id) {
				id = id || 'multi';
				this.lastActiveId = $('#mainheader').find('[id^="mainheader_"]:visible').attr('id').substr(11);
				$('#mainheader_' + this.lastActiveId).hide();
				//$('#mainContentPage_'+this.lastActiveId).hide();
				this.header = $('#mainheader_' + id).show();
				this.content = $('#mainContentPage_' + id).show();
				this.getOverlay().show();
			},
			getOverlay: function() {
				var $overlay = $('.overlay', this.content);
				$overlay = $overlay.size() ? $overlay : $('<div class="overlay"></div>').appendTo(this.content);
				$overlay.css({
					'background': 'rgba(0,0,0,0.5)'
				});
				return $overlay;
			},
			destory: function() {
				this.removeAll();
				this.close();
				$('#mainheader_' + this.lastActiveId).show();
				$('#mainContentPage_' + this.lastActiveId).show();
				$('.preview-box-wrapper', this.content).empty();
				delete this.header;
				delete this.content;
				delete this.lastActiveId;
			},
			open: function() {
				this.header && this.header.show();
				this.content && this.content.show();
			},
			close: function() {
				this.getOverlay().hide();
				this.header && this.header.hide();
				this.content && this.content.hide();
			},
			serializeId: function() {

				$('.slideout', this.content).remove();
				var result = [];
				$('.preview-box', this.content).each(function() {
					var id = this.id && this.id.toString();
					id && result.push(id.substr(17));
				});
				return result;
			},
			add: function(id) {
				var me = this,
					wrapper = $('.preview-box-wrapper', this.content);
				id = id || 'auto' + Math.floor(Math.random() * 1000);
				var d = $('<div><div class="preview-box-mask"></div><div class="preview-box-content"></div></div>')
					.attr({
					'class': 'preview-box',
					'id': 'preview-box-item-' + id
				})
					.css('-webkit-transform', 'rotate(' + ['+', '-'][Math.round(Math.random())] + Math.round(Math.random() * 5) + 'deg)')
					.appendTo(wrapper);

				setTimeout(function() {
					me.set(d, id);
				}, 500);

				$('.slideout', wrapper).remove();
			},
			remove: function(id) {
				var wrapper = $('.preview-box-wrapper', this.content);
				$('#preview-box-item-' + id).addClass('slideout');

			},
			removeAll: function() {
				$('.preview-box', this.content).addClass('slideout');
			},
			//根据实际需要自由改写		arg[0]: 插件容器	arg[1]: id
			set: function(d, email_id) {
				$.get('email/read.php', {
					'EMAIL_ID': email_id
				}, function(msg) {
					$('.preview-box-content', d).html(msg);
				});
			}
		},
		overlay: { //全局遮罩
			show: function() {
				var overlay = $('#g-overlay');
				overlay = overlay.size() ? overlay : $('<div id="g-overlay" class="overlay"></div>').appendTo('body');
				overlay.css('background', 'rgba(0,0,0,0.5)').show();
			},
			hide: function() {
				$('#g-overlay').hide();
			}
		},
		loadingMessage: {
			tmpl: '<div id="g-loading" class="ui-loader loading" style=" "><span class="ui-icon ui-icon-loading"></span><h1></h1></div>',
			show: function(s) {
				var loading = $('#g-loading');
				loading = loading.size() ? loading : $(this.tmpl).appendTo('body');
				s = typeof s == 'undefined' ? td_lang.pad.loading : s;
				loading.find('h1').html(s);
				loading.show();
			},
			hide: function() {
				$('#g-loading').hide();
			}
		},
		PopPanel: (function() {
			var MESSAGE_TEMPLATE = '<div id="message" style="display: none;">' + '<div id="blank" class="transparent_class"></div>' + '<div id="text"></div></div>';


			var PopPanel = function(el) {

				this.el = el instanceof $ ? el : $(el);

				this.init();
			};
			PopPanel.prototype = {
				constructor: PopPanel,
				init: function() {
					//todo init

					return this;
				},
				destory: function() {
					//todo destory

					return this;
				},
				open: function() {
					tPad.overlay.show();
					this.el
						.css({
							'display': 'block',
							'-webkit-transform': 'translate3d(0px, 40px, 0px)'
						})
						.animate({
							'-webkit-transform': 'translate3d(0px, 0px, 0px)'
						}, 300, 'ease-in-out');
					
					return this;
				},
				close: function() {
					var el = this.el;
					el
						.css({
							'-webkit-transform': 'translate3d(0px, 0px, 0px)'
						})
						.animate({
							'-webkit-transform': 'translate3d(0px, 40px, 0px)'
						}, 300, 'ease-in-out', function(){
							el.hide();
							tPad.overlay.hide();
						});
					return this;
				},
				setHeader: function(s) {
					this.getHeader().html(s || '');
					return this;
				},
				getHeader: function() {
					return $('.header', this.el);
				},
				setTitle: function(t) {
					this.getTitle().html(t || '');
					return this;
				},
				getTitle: function() {
					return $('.header .t', this.el);
				},
				setScroller: function(s) {
					this.getScroller().html(s || '');
					return this;
				},
				getScroller: function() {
					return $('.scroller', this.el);
				},
				showMessage: function(t) {
					if (!$('#message', this.el).size()) {
						this.getScroller().append(MESSAGE_TEMPLATE);
					}
					var me = this,
						$message = $("#message", this.el),
						$text = $('#text', $message);
					$text.empty().text(t);
					$message
						.css({
							top: '-35px',
							display: 'block'
						})
						.animate({
							top: '0px'
						}, 300);
					if(this.messageMon) clearTimeout(this.messageMon);
					this.messageMon = setTimeout(function() {
						$message.animate({
							top: '-35px'
						}, 300);
						me.messageMon = null;
					}, 1600);
					
					return this;
				},
				showLoading: function(s) {
					var $loading = $('.ui-loader', this.el);
					if ($loading.size() == 0) {
						$loading = $('<div class="ui-loader loading" ><span class="ui-icon ui-icon-loading"></span><h1></h1></div>');
						$('.wrapper', this.el).append($loading);
					}						
					s = typeof s == 'undefined' ? td_lang.pad.loading : s;
					$loading.find('h1').text(s);
					$loading.show();
					return this;
				},
				hideLoading: function() {
					$('.ui-loader', this.el).hide();
					return this;
				},
				ajax: function(url, data, onSuccess, config) {
					var me = this;

					config = $.extend({
						type: 'get',
						beforeSend: $.noop,
						error: $.noop,
						complete: $.noop
					}, config || {});

					$.ajax({
						url: url,
						data: data,
						type: config.type,
						beforeSend: function() {

							var func = config.beforeSend;

							me.showLoading();

							if (func() === false) {
								return false;
							}
						},
						error: function() {

							me.setScroller('<p class="no_msg">' + td_lang.pad.error + '</p>');
						},
						success: function(msg) {
							var func = typeof onSuccess === 'function' ? onSuccess : $.noop;

							if (func() === false) {
								return false;
							}
							me.setScroller(msg);
						},
						complete: function() {
							var func = config.complete;
							me.hideLoading();
							if (func() === false) {
								return false;
							}
						}
					});
					return this;
				}
			};

			return PopPanel;

		})(),

		attachViewer: (function() {
			var instance, scroller,
			HEADER_TEMPLATE = '<span class="lcbtn"> <span cmd="back">'+td_lang.pad.back+'</span> </span><span class="t">'+td_lang.pad.readattach+'</span>',
				CONTENT_TEMPLATE = '<div id="attchLayer"></div><iframe id="file_iframe" name="file_iframe" class="attach_iframe" src="" ></iframe>';

			var attachViewer = function(url, is_image) {

				var p = instance || (instance = new window.tPad.PopPanel($('#attachArea')));

				p.setHeader(HEADER_TEMPLATE);

				$('.lcbtn [cmd=back]').on(tPad.clickEvt, function() {
					p.close();
				});


				attachViewer[is_image == 1 ? 'setImg' : 'setAttach'](url);
			};

			attachViewer.setImg = function(url) {
				var p = instance,
					img = new Image();
				p.open().showLoading(td_lang.pda.msg_9);
				img.onload = function() {
					p.getScroller().css({
						height: img.height,
						width: img.width
					});
					p.hideLoading();
					scroller && scroller.destory();
					scroller = new iScroll($('.wrapper', p.el)[0]);
				};

				img.src = url;
				p.setScroller(img);
			};

			attachViewer.setAttach = function(url) {
				window.open(url);
				return;
				// 以下为iframe加载在线浏览，体验不好，废弃
				/*
				var p = instance;
				p.setScroller(CONTENT_TEMPLATE);

				var $iframe = $('.attach_iframe', p.el);

				$iframe.load(function(){
					var $this = $(this),
					size = {
						height : $this.contents().find("body")[0].scrollHeight,
						width : $this.contents().find("body")[0].scrollWidth
					};
					$('#attchLayer', $this).css(size);
					p.getScroller().css(size);

					p.hideLoading();

					new iScroll( $('.wrapper', p.el)[0] );
				}).attr('src', url);
				*/
			};

			return attachViewer;

		})()
	};

})(window, jQuery || zepto);


//lp 2012/2/26 23:47:59 如果为数据加载则加载 pull loading
$.extend({
	tiScroll: function(options) {
		var defaults = {
			page_id: '1',
			page_type: 'main',
			listType: "listview",
			nomoredata: false,
			noshowPullUp: false,
			refreshCallback: $.noop,
			onPullUp: $.noop,
			onPullDown: $.noop
		};
		var oiScroll, $$page_dom, $$wrapper_dom, isVisible;
		var options = $.extend(true, defaults, options);
		var iSettings = tPad.lowEffect ? {
			bounce: (options.listType == 'listview'),
			momentum: false
		} : {
			bounce: true,
			momentum: true
		};
		var page_id = options.page_id;
		var page_type = options.page_type;
		var listType = options.listType;
		var nomoredata = options.nomoredata;
		var noshowPullUp = options.noshowPullUp;
		//  eval("window.oiScroll_" + page_type +" = window.oiScroll_"+ page_type + "_" + page_id +" || null");
		window["window.oiScroll_" + page_type] = window["oiScroll_" + page_type + "_" + page_id] || null;
		var page_prefix = page_type == "main" ? "mainContentPage_" : "sideContentPage_";

		function setPageId(tid) {
			var page_id = tid;
			$$page_dom = $("#" + page_prefix + page_id);
		}

		function init() {
			$$page_dom = $("#" + page_prefix + page_id);
			$$wrapper_dom = $("#" + page_prefix + page_id + " .wrapper");

			isVisible = $$page_dom.is(':visible');
			$$page_dom.show();


			if (("oiScroll_" + page_type) in window) {
				window["oiScroll_" + page_type].destroy();
			}

			if (listType == "listview") {
				if (noshowPullUp) {
					$$page_dom.find('.pullUp').hide();
				}

				var pullDownEl, pullDownOffset, pullUpEl, pullUpOffset;
				pullDownEl = $$page_dom.find('.pullDown')[0];
				pullDownOffset = pullDownEl.offsetHeight;
				pullUpEl = $$page_dom.find('.pullUp')[0];
				pullUpOffset = pullUpEl ? pullUpEl.offsetHeight : $$page_dom.find('.loadingComplete')[0].offsetHeight;
				oiScroll = new iScroll($$wrapper_dom[0], {
					useTransition: false,
					topOffset: pullDownOffset,
					bounce: iSettings.bounce,
					momentum: iSettings.momentum,
					onBeforeScrollStart: function(e) {
						if (e.target.nodeName.toLowerCase() != "li") {
							if ($(e.target).parents("li").length > 0) {
								var target = $(e.target).parents("li")[0];
							} else {
								return;
							}
						} else {
							var target = e.target;
						}
						//clearTimeout(this.hoverTimeout);
						while (target.nodeType != 1) target = target.parentNode;
						/* this.hoverTimeout = setTimeout(function() {
							if (!hoverClassRegEx.test(target.className)) target.className = target.className ? target.className + ' iScrollHover' : 'iScrollHover';
						}, 80); */
						this.hoverTarget = target;
					},
					onRefresh: function() {
						if (pullDownEl.className.match('loading')) {
							pullDownEl.className = 'pullDown';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_4;
						} else if (pullUpEl && pullUpEl.className.match('loading')) {
							pullUpEl.className = 'pullUp';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_6;
						}
						options.refreshCallback.call(this);
					},
					onScrollMove: function() {
						if (this.y > 5 && !pullDownEl.className.match('flip')) {
							pullDownEl.className = 'pullDown flip';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_5;
							this.minScrollY = 0;
						} else if (this.y < 5 && pullDownEl.className.match('flip')) {
							pullDownEl.className = 'pullDown';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_7;
							this.minScrollY = -pullDownOffset;
						} else if (this.y < (this.maxScrollY - 5) && pullUpEl && !pullUpEl.className.match('flip')) {
							if (nomoredata) return;
							pullUpEl.className = 'pullUp flip';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_7;
							this.maxScrollY = this.maxScrollY;
						} else if (this.y > (this.maxScrollY + 5) && pullUpEl && pullUpEl.className.match('flip')) {
							if (nomoredata) return;
							pullUpEl.className = 'pullUp';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_2;
							this.maxScrollY = pullUpOffset;
						}
						removeClass();
					},
					onScrollEnd: function() {
						if (pullDownEl.className.match('flip')) {
							pullDownEl.className = 'pullDown loading';
							pullDownEl.querySelector('.pullDownLabel').innerHTML = td_lang.pda.msg_2;
							pullAction('down', $$page_dom);
						} else if (pullUpEl && pullUpEl.className.match('flip')) {
							if (nomoredata) return;
							pullUpEl.className = 'pullUp loading';
							pullUpEl.querySelector('.pullUpLabel').innerHTML = td_lang.pda.msg_2;
							if (!noshowPullUp) {
								pullAction('up', $$page_dom);
							}
						}
					},
					onBeforeScrollEnd: removeClass
				});
			} else {
				oiScroll = new iScroll($$wrapper_dom[0], {
					useTransition: false,
					bounce: iSettings.bounce,
					momentum: iSettings.momentum,
					onBeforeScrollStart: function(e) {
						var target = e.target;
						while (target.nodeType != 1) target = target.parentNode;
						if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
							e.preventDefault();
							e.stopPropagation();
						}
					}
				});
			}
			$$page_dom[isVisible ? 'show' : 'hide']();
			// eval("window.oiScroll_" + page_type + "_" + page_id + "= oiScroll");
			// eval("window.oiScroll_" + page_type + "= oiScroll");
			window["oiScroll_" + page_type + "_" + page_id] = oiScroll;
			window["oiScroll_" + page_type] = oiScroll;
			return oiScroll;
		}

		function getElement() {
			return $$page_dom;
		}

		function getOIScroll() {
			return window["oiScroll_" + page_type + "_" + page_id];
		}

		function refresh() {
			window["oiScroll_" + page_type + "_" + page_id].refresh();
		}

		function destroy() {
			// if(eval("oiScroll_" + page_type))
			// eval("oiScroll_"+page_type+".destroy()");   
			"oiScroll_" + page_type in window && window["oiScroll_" + page_type].destroy();
		}

		function pullAction(pullaction, obj) {
			var oUl = obj.find("ul.sideBarSubList");

			var func = pullaction != 'down' ? options['onPullUp'] : options['onPullDown'];

			if (func.call(this) === false) {
				//自定义截断函数
				return;
			}

			if (pullaction == 'down') {
				var lastedId = oUl.find("li:first").attr("q_id");
				$.get(
					"inc/getdata.php", {
					'A': "GetNew",
					'STYPE': stype,
					"LASTEDID": undefined === lastedId ? '' : lastedId
				},

				function(data) {
					if (data == "NONEWDATA") {
						showMessage(nonewdata);
					} else {
						var size = $("<ul>" + data + "</ul>").find("li").size();
						var osize = oUl.find("li").size();

						if (osize == 0) $$page_dom.find(".no_msg").hide();

						oUl.prepend(data);
						showMessage(sprintf(newdata, size));
					}
					oiScroll.refresh();
				});

			} else {
				var currIterms = oUl.find("li").size();
				//lp 2012/5/2 0:59:57 增加获取更多时，条件控制
				if (currIterms > 0) {
					var lastGetId = oUl.find("li:last").attr("q_id");
				}
				$.get(
					"inc/getdata.php", {
					'A': "GetMore",
					'STYPE': stype,
					"P": p,
					"CURRITERMS": currIterms,
					"LASTGETID":  undefined === lastGetId ? '' : lastGetId
				},

				function(data) {
					if (data == "NOMOREDATA") {
						$$page_dom.find(".pullUp").remove();

						nomoredata = true;
						//  eval(page_type + "_nomoredata_" + page_id + "= true");
						window[page_type + "_nomoredata_" + page_id] = true;
						noshowPullUp = true;
						// eval(page_type + "_noshowPullUp_" + page_id + "= true");
						window[page_type + "_noshowPullUp_" + page_id] = true;

						$$page_dom.find(".scroller").append('<div class="loadingComplete">' + td_lang.pda.msg_8 + '</div>');
					} else {
						oUl.append(data);
						//eval("oiScroll_" + page_type + ".refresh()");
						getOIScroll().refresh();
					}
				});
			}
		}
		var hoverClassRegEx = new RegExp('(^|\\s)iScrollHover(\\s|$)'),

			removeClass = function() {
				if (this.hoverTarget) {
					clearTimeout(this.hoverTimeout);
					this.hoverTarget.className = this.hoverTarget.className.replace(hoverClassRegEx, '');
					this.target = null;
				}
			},
			// getMainData(url, data, onSuccess, showCallback) or getMainData({ url:url, data:data, type:type, ...  })
			// by JinXin @ 2012/9/4
			getMainData = function(url, data, onSuccess, showCallback) {
				var me = this,
					args = arguments,
					opts,
					defaults = {
						url: '',
						type: 'get',
						cache: true,
						data: {},
						onSuccess: $.noop,
						showCallback: $.noop,
						onBeforeSend: $.noop,
						onError: $.noop
					};

				if ('string' === typeof args[0]) {
					opts = $.extend(true, defaults, {
						url: args[0],
						data: args[1],
						onSuccess: args[2],
						showCallback: args[3]
					});
				} else if ('object' === typeof args[0]) {
					opts = $.extend(true, defaults, args[0]);
				} else {
					return;
				}
				$.ajax({
					url: opts.url,
					data: opts.data,
					type: opts.type,
					cache: opts.cache,
					beforeSend: function() {
						$.ProMainLoading.show();
						opts.onBeforeSend.apply(this, arguments);
					},
					success: function(data) {
						$.ProMainLoading.hide();
						if (false === opts.onSuccess.apply(me, arguments)) {
							return
						}
						$(".scroller", $$page_dom).empty().append(data);
						$$page_dom.show();
						refresh();
						opts.showCallback.apply(me, arguments);
					},
					error: function() {
						$.ProMainLoading.hide();
						opts.onError.apply(this, arguments);
					}
				});
			},
			show = function() {
				var typefix = page_type == 'side' ? 'sider' : 'main';
				$('#' + typefix + 'header_' + page_id).show().siblings().hide();
				$('#' + page_type + 'ContentPage_' + page_id).show().siblings('.' + page_type + 'ContentPage').hide();
				$('#' + typefix + 'footer_' + page_id).show().siblings().hide();
				refresh();
			},
			hide = function() {
				var typefix = page_type == 'side' ? 'sider' : 'main';

				$('#' + typefix + 'header_' + page_id).hide();
				$('#' + page_type + 'ContentPage_' + page_id).hide();
				$('#' + typefix + 'footer_' + page_id).hide();
				refresh();
			},
			getHeader = function() {
				var typefix = page_type == 'side' ? 'sider' : 'main';
				return $('#' + typefix + 'header_' + page_id);
			};


		return page_type == 'main' ? {
			getOIScroll: getOIScroll,
			setPageId: setPageId,
			init: init,
			getMainData: getMainData,
			getElement: getElement,
			refresh: refresh,
			pullAction: pullAction,
			show: show,
			hide: hide,
			getHeader: getHeader,
			destroy: destroy
		} : {
			getOIScroll: getOIScroll,
			setPageId: setPageId,
			init: init,
			getElement: getElement,
			refresh: refresh,
			pullAction: pullAction,
			show: show,
			hide: hide,
			getHeader: getHeader,
			destroy: destroy
		}
	}
});



function reback(from, to) {
	$("#header_" + from).hide();
	$("#header_" + to).show();
	$("#page_" + from).hide();
	$(".pages").hide();
	$("#page_" + to).show();
	//pageInit(to);
	eval("window.oiScroll = window.oiScroll_" + to);
	pageTo(to);
}

function pageTo(f) {
	tiScroll = new $.tiScroll();
	tiScroll.setPageId(f);
}

function sidereback(from, to) {
	$("#siderheader_" + from).hide();
	$("#siderheader_" + to).show();
	$("#sideContentPage_" + from).hide();
	$(".sideContentPage").hide();
	$("#sideContentPage_" + to).show();
	pageInit("side", to);
	eval("window.oiScroll_side = window.oiScroll_side_" + to);
}

function fixZoomPageAttachSize(page) {
	var sw = window.screen.width;
	var titlew = $(".read_attach a span:first").width();
	if ((titlew + 86 + 20) > sw) {
		if ($("#page_" + page + " .read_content").width() <= sw) {
			$("#page_" + page + " .scroller").css("width", sw + "px");
		}
		$(".read_attach").css("max-width", (sw - 20) + "px");
	}
}

//2012/7/24 23:24:30 lp                 edit by JinXin @ 2012/9/7

function showMessage(t, context) {
	context = context || window.document;
	var $message = $("#message", context),
		$text = $('#text', $message),
		messageMon = $message.data('messageMon');
	$text.empty().text(t);
	$message
	.css({
		display: 'block',
		top: '12px'
	})
	.animate({
		top: '43px'
	}, 300);
	
	messageMon && clearTimeout(messageMon);
	messageMon = setTimeout(function() {
		$message.animate({
			top: '12px'
		}, 300);
		$message.data('messageMon', '');
	}, 1600);
	$message.data('messageMon', messageMon);
}

function reMakeMessage(str) {
	return "<div class='no_msg'>" + str + "</div>";
}
$.ProSideLoading = $.ProMainLoading = tPad.loadingMessage;
$.mutiMenu = {
	init: function(menu) {
		var $$mitiMenu = $(".mutiMenuLayer");
		var $$opts = $$mitiMenu.find(".opts");
		$$opts.empty().append(menu);
	},
	show: function() {
		$("#overlay").addClass("overlayGray").show();
		$(".mutiMenuLayer").show();
	},
	hide: function() {
		$("#overlay").removeClass("overlayGray").hide();
		$(".mutiMenuLayer").hide();
	}
}

$("#overlay").on("click", function(e) {
	e.stopPropagation();
	if ($(this).hasClass("overlayGray")) {
		$.mutiMenu.hide();
	}
});

$.fn.imgpreload = (function() {
	var imgload = function(options) {
		this.each(function() {
			var opts = $.extend({}, $.fn.imgpreload.defaults, options),
				$wrap = $(opts.wrapper),
				cb = $.proxy(opts.callback, this),
				url = this.src;
			$(this).wrap($wrap);

			var img = new Image();
			var loadcb = function() {
				$wrap.html(img);
				setTimeout(cb, 100);
			};
			try {
				img.src = url;
			} catch (ex) {
				cb();
			}

			$wrap.html(td_lang.pad.imgloading);

			// 如果图片已经存在于浏览器缓存，直接调用回调函数
			if (img.complete) {
				loadcb();
				return; //直接返回，不用再处理onload事件
			}
			img.onload = loadcb;
			img.onerror = function() {
				$wrap.html(td_lang.pad.imgerror);
				setTimeout(cb, 100);
			};
		});
		return this;
	};

	imgload.defaults = {
		callback: $.noop,
		wrapper: "<div class='img_wrap'></div>",
		selector: '.img_wrap'
	};

	return imgload;
})();


//lp 扩展搜索
$.extend({
	tSearch: function(options) {
		var url = '/pda/inc/get_contactlist.php';
		var input = options.input;
		var list = options.list;
		var appendDom = options.appendDom;

		var $$input = $(input);
		var $$appendDom = $(appendDom);
		var $$list = $(list);
		var posFix = options.posFix || function(o) {
				o.top -= 10;
				return o;
			};
		var _tmp_key;
		var searchInterval = null;
		var searchHtml = '';
		searchHtml = '<div id="wrapper_plist" class="wrapper wrapper_contact hasshadow" style="display:none;">';
		searchHtml += '<div id="scroller_plist" class="scroller">';
		searchHtml += '<ul class="comm-list contact-list"></ul>';
		searchHtml += '</div>';
		searchHtml += '</div>';

		function init() {
			$$input.focus(function(e) {
				e.stopPropagation();
				searchInterval = null;
				searchInterval = setInterval(search_name, 1000);
				$(this).addClass("autoInputWidth");
			});

			$$input.blur(function() {
				$(this).removeClass("autoInputWidth");
			});

			$$input.keydown(function(event) {
				var keyCode = event.which;
				if (keyCode == 8) {
					if ($(this).val() == "") {
						var oem = $$appendDom.find("em");
						if (oem.length >= 0) {
							var lastem = $$appendDom.find("em:last");
							if (!lastem.hasClass("active")) lastem.addClass("active");
							else lastem.remove();
						}
					}
				}
			});
			
			$$appendDom
				.undelegate('.tsearch')
				.delegate('em', 'click.tsearch', function(e){
				   var $this = $(this),
					   $ems = $this.siblings('em');
					   $ems.find('span').css('backgroundColor','black');
				   if(!$this.hasClass("active"))
				   {
					  $ems.removeClass("active");
					  $ems.find('span').animate({width: '0', padding: '0', marginLeft: '0'},200);
					  $this.addClass("active");
					  $this.find("span").animate({width: '13px', padding: '4px', marginLeft: '10px'},200);
				   }else{
					  $this.removeClass("active");
					  $this.find("span").animate({width: '0', padding: '0', marginLeft: '0'},100);
				   }
				})
				.delegate('em span', 'click.tsearch', function(e){
				    e.stopPropagation();
                    $(this).parent("em").remove();
				})
			
		}

		function search_name() {
			var key = $$input.val();
			var is_mail_m = $$input.parent(".read_detail");

			if (key != "") {
				if (key != _tmp_key) {
					_tmp_key = key;

					$.get(url, {
						"KWORD": key,
						"P": p
					}, function(data) {
						if (data == "") return;
						$$list.html(searchHtml).find("ul.contact-list").empty().append(data);

						//点击查询数据，添加联系人
						oli = $$list.find(".contact-list li");
						$$list.delegate(".contact-list li", tPad.clickEvt, function() {
							var _oSelect_name = $(this).attr("q_name");
							var _oSelect_uid = $(this).attr("q_id");
							var _oSelect_user_id = $(this).attr("q_user_id");
							var _selected = false;

							if ($$appendDom.html() != "") {
								$$appendDom.find("em").each(function() {
									var uid = $(this).attr("uid");
									if (_oSelect_uid == uid) {
										_selected = true;
										return false;
									}
								});
							}

							if (!_selected) {
								$$appendDom.append("<em uid='" + _oSelect_uid + "' userid='" + _oSelect_user_id + "'>" + _oSelect_name + "<span></span></em>");
							}
							$$input.val("");
							clearInterval(searchInterval);
							searchInterval = null;
							is_mail_m.removeClass("hasnoborder");
							$$input.blur();
							$$list.empty();
							return;
						});

						if (is_mail_m.length > 0) is_mail_m.addClass("hasnoborder");

						var offset = $$input.offset();

						$$list.find("#wrapper_plist").css("top", posFix(offset).top).show();
						var Scroll_plist = new iScroll($$list.find("#wrapper_plist").get(0));
					});
				}
			} else {
				_tmp_key = key;

				if (Scroll_plist) Scroll_plist.destroy();
				$$list.find("#wrapper_plist").hide();
				is_mail_m.removeClass("hasnoborder");
				$$list.empty();
			}
		}
		return {
			init: init
		}
	}
});

$.extend({
	tSearch2: function(options) {
		var url = 'inc/get_contactlist.php';
		var input = options.input;
		var list = options.list;
		var page_id = options.page_id;
		var onSuccess = options.onSuccess || function() {
				pageInit(page_id);
			};


		var $$input = $(input);
		var $$list = $(list);

		var _tmp_key;
		var searchInterval = null;

		function init() {
			$$input.focus(function(e) {
				e.stopPropagation();
				searchInterval = null;
				searchInterval = window.setInterval(search_name, 1000);
				$(this).addClass("hasNoBackGround");
			});

			$$input.blur(function() {
				if ($(this).val() == '') $(this).removeClass("hasNoBackGround");
				window.clearInterval(searchInterval);
				searchInterval = null;
			});
		}

		function search_name() {
			var key = $$input.val();

			if (key != "") {
				if (key != _tmp_key) {
					_tmp_key = key;
					$.ajax({
						type: 'GET',
						url: url,
						cache: false,
						data: {
							"KWORD": key,
							"P": p
						},
						beforeSend: function() {
							//  $.ProLoading.show();   
						},
						success: function(data) {
							//$.ProLoading.hide();
							if (data == "") {
								$$list.empty();
							} else {
								$$list.empty().append(data);
							}
							//点击查询数据，添加联系人
							oli = $$list.find("li");
							$$list.delegate("li", tPad.clickEvt, function() {
								var _oSelect_name = $(this).attr("q_name");
								var _oSelect_uid = $(this).attr("q_id");
								var _oSelect_user_id = $(this).attr("q_user_id");
								return;
							});
							onSuccess.apply(this, arguments);

						}
					});
				}
				return;
			} else {
				_tmp_key = key;
				$$list.empty();
			}
		}
		return {
			init: init
		}
	}
});

//2012/4/10 16:04:40 lp 0409 IOS客户端打开附件
function readAttach(obj,from_page)
{
   //IOS客户端打开
   if(P_VER == 5)
   {
      //如果为新版本的 0409
    
         var is_image = obj.attr("is_image");
         var url="message:" + is_image + ":" +obj.attr("_href");
         document.location = url;   
         return false;
     
   }else if(P_VER == 6 && obj.attr('is_image') == 1){
        window.Android.ShowPic(obj.attr("href"), '');
        return false;
   }else{
      //IOS浏览器中打开
      if(isIDevice){
        tPad.attachViewer(obj.attr('_href'), obj.attr('is_image'));  
        return false;
      }
   }
}
//修复chrome下单击触发两次的bug by JinXin @ 2012/10/15

function fixDbClick(e) {
	var last_click_timer = this.getAttribute('_last_click_timer_'),
		this_click_timer = tPad.getTime();

	if (this_click_timer - last_click_timer < 1000) {
		e.stopPropagation();
		return false;
	}
	this.setAttribute('_last_click_timer_', this_click_timer);
}

function browserView(obj) {
	var attach_container = $("#page_attach_read #scroller_attach_read");
	var is_image = obj.attr("is_image");
	if (is_image == 1) {
		var im = new Image();
		im.src = obj.attr("_href");

		$(im).load(function() {
			$(im).attr('src', obj.attr("_href"));
			oIwidth = im.width;
			oIheight = im.height;
			$("#scroller_attach_read").css({
				"height": oIheight,
				"width": oIwidth
			});
			$("#page_attach_read").show('fast', function() {
				pageInit("attach_read");
				$.ProLoading.hide();
			});
		});

		$$_tmp_dom = attach_container.html();

		attach_container.html($(im));
		return false;
	} else {

		if (typeof($$_tmp_dom) != "undefined") attach_container.empty().html($$_tmp_dom);

		attach_container.find("iframe").attr("src", obj.attr("_href"));
		$("#wrapper_attach_read").css({
			"overflow": "scroll"
		});
		$("#file_iframe").load(function() {
			var thisheight = $(this).contents().find("body")[0].scrollHeight;
			var thiswidth = $(this).contents().find("body")[0].scrollWidth;
			$(this).height(thisheight).width(thiswidth);
			$("#layer").height(thisheight).width(thiswidth);
			$("#scroller_attach_read").css({
				"height": thisheight,
				"width": thiswidth
			});
			$("#page_attach_read").show('fast', function() {
				pageInit("attach_read");
				$.ProLoading.hide();
			});
		});
	}
}

function sprintf() {
	var arg = arguments,
		str = arg[0] || '',
		i, n;
	for (i = 1, n = arg.length; i < n; i++) {
		str = str.replace(/%s/, arg[i]);
	}
	return str;
}

function getCookie(name) {
	var arr = document.cookie.split("; ");
	for (i = 0; i < arr.length; i++)
	if (arr[i].split("=")[0] == name) return unescape(arr[i].split("=")[1]);
	return null;
}
/**   写入cookie
 *    @param <string> name
 *    @param <string> value   (value = '' 删除cookie)
 *    @param <object> { expires: expires, path: path}
 *    by JinXin @ 2012/10/11
 */

function setCookie(name, value, paras) {
	var today = new Date();
	var expires = new Date();
	expires.setTime(today.getTime() + 1000 * 60 * 60 * 24 * 2000);

	var path = null;
	if (typeof(paras) == "object") {
		if (typeof(paras.expires) != "undefined") expires = paras.expires;
		if (typeof(paras.path) != "undefined") path = paras.path;
	}
	value === '' && expires.setTime(today.getTime() - 10000); //传空值删除cookie
	document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() + (path ? '; path=' + path : '');

}

function echoCookie() {
	var c = unescape(getCookie("city_cookie"));
	c = (c != '' && c != 'null') ? c : "　";
	if (c != '') {
		return c;
	}
}

function isEmail(str) {
	res = /^[0-9a-zA-Z_\-\.]+@[0-9a-zA-Z_\-]+(\.[0-9a-zA-Z_\-]+)*$/;
	var re = new RegExp(res);
	return !(str.match(re) == null);
}

function checkFuncExists(func_name) {
	try {
		if (typeof(eval(func_name)) == "function") {
			return true;
		}
	} catch (e) {
		return false;
	}
}
//2012/6/18 3:01:12 lp 检测中文

function isChineseChar(str) {
	var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]$/;
	return reg.test(str);
}
//2012/6/8 16:43:04 lp 增加日期

function initMobiScrollDate(preset, obj, config) {
	var opts = {
		'date': {
			preset: preset,
			theme: 'sense-ui',
			display: 'modal',
			mode: 'scroller',
			dateOrder: 'ymmdd',
			dateFormat: 'yy-mm-dd',
			dayNamesShort: td_lang.pad.dayNamesShort,
			monthText: td_lang.pad.monthText,
			dayText: td_lang.pad.dayText,
			yearText: td_lang.pad.yearText,
			setText: td_lang.pad.setText,
			cancelText: td_lang.pad.cancelText
		},
		'time': {
			preset: preset,
			theme: 'sense-ui',
			display: 'modal',
			mode: 'scroller',
			timeFormat: 'HH:ii',
			hourText: td_lang.pad.hourText,
			minuteText: td_lang.pad.minuteText,
			setText: td_lang.pad.setText,
			cancelText: td_lang.pad.cancelText
		},
		'datetime': {
			preset: preset,
			theme: 'sense-ui',
			display: 'modal',
			mode: 'scroller',
			dateOrder: 'ymmdd',
			dateFormat: 'yy-mm-dd',
			timeFormat: 'HH:ii',
			dayNamesShort: td_lang.pad.dayNamesShort,
			monthText: td_lang.pad.monthText,
			dayText: td_lang.pad.dayText,
			yearText: td_lang.pad.yearText,
			hourText: td_lang.pad.hourText,
			minuteText: td_lang.pad.minuteText,
			setText: td_lang.pad.setText,
			cancelText: td_lang.pad.cancelText
		}
	};
	return obj.scroller($.extend(opts[preset], config || {}));
}