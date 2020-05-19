/*																							
 *										
 *		弹出式面板 by JinXin @ 2012/7/3
 *
 *		用法：一、普通青年用法
 *
 *				1. 实例化 				
 *			
 *				html :		<div id="popPanel"></div> 
 *				 
 *					jQuery('#popPanel').popPanel(options);
 *
 *				2. 取得实例化对象
 *
 *					var popPanel = jQuery('#popPanel').data('popPanel');
 *
 *			  二、文艺青年用法
 *
 *					var popPanel = jQuery('<div id="popPanel"></div>').appendTo('body').popPanel(options).data('popPanel');
 *
 *			  三、怀旧的同学可以这么用	
 *
 *				html :		<div id="popPanel"></div> 
 *				 
 *					var dom = document.getElementById('popPanel');
 *
 *					var popPanel = new PopPanel(dom, options);
 *
 *																							
 */


;(function(win, $){
	var PopPanel = function(el, opts){
		this.init(el, opts);
	};
	
	PopPanel.prototype = {
 
		init: function(el, opts){
			
			var me = this, 
			
			$el = $(el),
			
			tmpl = this.getTemplate();
								
			$el.attr('class', 'pop-panel-wrapper').html(tmpl);
			
			this.$element = $el;
			
			this.options = opts;
			
			this.$container = $el.find('.pop-panel-container');
			
			this.$content = $el.find('.pop-panel-container > .content');
			
			this.$content.height(opts.height);
			
			if(opts.height === 'auto'){

				this.$content[0].style.overflow = 'hidden';
			
			} else {

				this.$content[0].style.overflow = 'auto';
			
			}			
			
			this.$element.css('position', opts.position);
			
			this.$element.children('.pop-panel').width(opts.width);
			
			if( opts.title ){
				this.renderTitle();
			}
			if( opts.sider ){
				this.renderSider();
			}
			if( $.isArray(opts.controllBar) ){
				this.renderCtrlBar(opts.controllBar);
			}
			
			this.$element.find('.pop-panel-close').bind('click', $.proxy(this.close, me));
			
			opts.overlay && this.renderOverlay();
			
			opts.inited.call(this);

			return this;
				
		},
		
		destory: function(){
		
			this.$element.removeClass('pop-panel-wrapper').empty();

			this.$element.removeData('popPanel');
			
			this.$element.unbind('click');
			
			this.$overlay && this.$overlay.remove();
			
			return this;
			
		},
	 
		getTemplate: function(type){
			
			if(type == 'sider'){
			
				return "<div class='pop-panel-sider'><div class='content' style='height:auto;'></div></div>";
				
			} else if(type == 'btn') {
			
				return "<button class='${className}'>${text}</button>";	

			} else if(type == 'msg'){
			
				return "<div class='pop-panel-msg-box'></div>";
				
			} else if(type == 'overlay'){
			
				return "<div class='pop-panel-overlay'></div>";
				
			} else {
			
				return "<div class='pop-panel'><a href='javascript:void(0);'class='pop-panel-close'></a><div class='pop-panel-inner'><div class='pop-panel-container'><div class='content'></div><div class='controllbar-holder'></div></div></div></div>";			
			}
		
		},
		
		renderTitle: function(){
		
			var h = $('<h2 class="pop-panel-title"></h2>').html(this.options.title);
		
			this.$element.find('.pop-panel').prepend(h);
		
		},
		
		renderOverlay: function(){
		
			var $overlay = $(this.getTemplate('overlay'));
			
			this.$element.after($overlay);
			
			this.$overlay = $overlay;
			
			var resizeHandle = $.proxy(this.resizeOverlay, this);
			
			$(window).resize(resizeHandle).resize();
			
			return this;
		
		},
		
		resizeOverlay:function(){
		
			var c = {
				width: $(document).width(),
				height: $(document).height()
			},			
			thisWidth = this.$element.children('.pop-panel').width(),
			
			w = document.body.clientWidth || document.documentElement.clientWidth;
			 				
			$('body').css('overflow-x', thisWidth < w ? 'hidden' : 'auto');

			this.$overlay.css(c);

				
		},
		
		renderTips: function(){
		
			var	$tips = $('<div class="pop-panel-tips"></div>');
			
			if(this.$tips){
				
				this.$tips.remove();
			
			}
			
			$tips.insertAfter(this.$content);
						
			this.$tips = $tips;

			return this;
		
		},
		
		setTips: function(o){
		
			this.renderTips();
		
			this.$tips.html(o);
			
			return this;
		
		},

		renderSider: function(){
			
			var $sider = this.$element.find('.pop-panel-sider > .content'),
			tmpl = this.getTemplate('sider');
			
			if( $sider.size() ){
			
				$sider.remove();
			
			} 
			
			this.$element.find('.pop-panel-inner').prepend(tmpl);
			
			this.$sider = this.$element.find('.pop-panel-inner > .pop-panel-sider > .content');
			
			this.$sider.parent().width(this.options.siderWidth);
			
			this.$content.parent().css('marginLeft',this.options.siderWidth);

			return this;
						
		},
		
		removeSider: function(){
					
			this.$sider.parent().width(0);
			
			this.$sider.empty();
			
			this.$content.parent().css('marginLeft',0);
			
			return this;
		},

		appendSider: function( o ){
								
			this.$sider.append( o );
			
			this.$sider.parent().width(this.options.siderWidth);
			
			this.$content.parent().css('marginLeft',this.options.siderWidth);
			
			return this;
		},
		
		setContent: function(html){

			this.$content.html(html);
			
			return this;
		
		},
		
		setSider: function(html){
			if(!this.$sider || !this.$sider.size()){
			
				this.renderSider();
			
			} 
			this.$sider.html(html);
			
			return this;
		},
		
		renderCtrlBar: function(btns){
			
			var	btnTmpl = this.getTemplate('btn'),
			
			$controllBar = $('<div class="controll-bar"></div>');
			
			if(this.$controllBar){
				
				this.$controllBar.remove();
			
			}
			
			$.each( btns, function(i, btn){
				var $btn = $( $.tmpl(btnTmpl, btn) ).click(btn.func);
			
				$controllBar.append($btn);
			
			});	
		
			$controllBar.insertAfter(this.$content);
			
		//	this.$content.css('marginBottom', $controllBar.outerHeight() + 10);
			$('.controllbar-holder', this.$element).css('height', $controllBar.outerHeight() );
			this.$controllBar = $controllBar;

			return this;
		
		},
		
		close: function(){
		
			var opts = this.options,
			
			me = this,
			
			clscb = function(){
			
				if(me.$overlay){
				
					me.$overlay.hide();
				
					delete $('body')[0].style.overflowX;
			
				}
				opts.closeCallback.call(me);
		
			};
			
			opts.onClose.call(this);
			

			
			//if(opts.animate && !($.browser.msie && parseInt($.browser.version)<=7)){

				if(opts.animate == 'scroll'){
			
					var pos = ('-' + ( this.$element.outerHeight() + 100 ));
					
					var endPos = { marginTop : pos};
				
					this.$element.animate(endPos,opts.animateSpeed, clscb);
					
				}else{

					this.$element.hide( opts.animateSpeed, clscb );
					
				}
				
			//}else{ 
			
				//this.$element.hide();
				//clscb();
			//}
			
			return this;
		
		},
		
		open: function(){
		
			var opts = this.options;
			
			if(this.$overlay){
			
				this.$overlay.show();
			
			}
		
			//if(opts.animate && !($.browser.msie && parseInt($.browser.version)<=7)){

				if(opts.animate == 'scroll'){
			
					var endPos = { marginTop : '0px' };
				
					this.$element
					
								.css({ 'display': 'block', marginTop: '-999px' })
								
								.animate(endPos,opts.animateSpeed);
					
				}else{

					this.$element.show( opts.animateSpeed );
					
				}
				
			//}else{ 
			
				//this.$element.show();
			
			//}
		
			opts.showCallback.call(this);	

			return this;
		},
		
		message: function(msg, opts){
		
			var msg = msg || '',
			
			delay = opts&&opts.delay || '5000',
			
			$tmpl = this.$element.find('.pop-panel-inner > .pop-panel-msg-box');
			
			if($tmpl.size()){
			
				this.msgTimer && clearTimeout(this.msgTimer);
		
			} else {
			
				$tmpl = $( this.getTemplate('msg') ).hide();
		
				this.$element.find('.pop-panel-inner').append($tmpl);
	
			}
			
			$tmpl.html(msg).fadeIn(600);
			
			this.msgTimer = setTimeout(function(){
			
				$tmpl.fadeOut(600, function(){ $tmpl.remove(); });
			
			}, delay);
		
		}
	};
	
	win.PopPanel = PopPanel;
	
	$.fn.popPanel = function(option){
		
		return this.each(function(){
			var $this = $(this), 
			data = $this.data('popPanel'), 
			options = $.extend({}, $.fn.popPanel.defaults, $this.data(), typeof option == 'object' && option);
			
			if (!data){ 
				$this.data('popPanel', (data = new PopPanel(this, options)));
			}
			if (typeof option == 'string'){ 
				data[option]();
			} else if (options.show){
				data.open();
			}
		});
	
	};
	
	$.fn.popPanel.defaults = {
	
		show: false,
		sider: false,
		controllBar: false,
		animate: 'scroll',
		animateSpeed: 300,
		width: 800,
		overlay: true,
		title: false,
		height: 'auto',
		position: 'fixed',
		siderWidth: 150,
		onClose: $.noop,
		closeCallback: function(){	this.destory() },
		inited: $.noop,
		showCallback: $.noop
	};
	
})(window, jQuery);