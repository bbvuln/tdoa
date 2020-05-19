// @2012/8/29 by JinXin
;(function(exports, $, undefined){

	var HistoryNav = function(el, options){
		
		var $el = el instanceof $ ? el[0] : el;
		
		if($el.nodeType == 1){
			this.init($el, options);
		}
	};
	HistoryNav.DefaultOptions = {
		HistoryNavTmpl: [	
						'<div class="historyBtns fl">',
							'<button class="btnNav back inline-block" cmd="back" title="ºóÍË" hidefocus=""></button>',
							'<button class="btnNav prev inline-block" cmd="forward" title="Ç°½ø" hidefocus=""></button>',
						'</div>',
						'<div class="historyTrack fl"></div>'
						].join(''),
		HistoryTrackItemTmpl: '<a href="javascript:void(0);" class="" cmd="go" index="${index}" title="${text}"  hidefocus="">${text}</a>',
		HistoryTrackSplitTmpl: '<b class="split"></b>',		
		historyTrack: true
	};
	HistoryNav.prototype = {

		constructor: HistoryNav,
		
		init: function(el, options){
			this.$el = el;
			this.options = this.fixOptions(options);
			this.$container = this.options.container;
			this.buttons = this.options.buttons || {};
			this.initHistory();
			this.render();
			this.initEvent();
		},
		initEvent: function(){
			var back = $.proxy(this.back, this),
			 forward = $.proxy(this.forward, this);
			this.buttons.back.click( back );
			this.buttons.forward.click( forward );
		},
		destory: function(){
			this.$el.innerHTML = '';
		},
		render: function(){
			var $el = $(this.$el);
			$el.addClass('historyNav clearfix');
			$el.html(this.options.HistoryNavTmpl);
			this.buttons = {
				back: $el.find('[cmd="back"]'),
				forward: $el.find('[cmd="forward"]')
			};
		},
		renderTrack: function(){
			if(!this.options.historyTrack){
				return false;
			}
		
			var me = this,
			historyTrackSplitTmpl = this.options.HistoryTrackSplitTmpl,
			historyTrackItemTmpl = this.options.HistoryTrackItemTmpl,	
			$historyTrack = $('.historyTrack', this.$el);

			$historyTrack.html('');
			$.each(this.states,function(i,n){
				if(i > me.cursor){
					return false;
				}					
				if(i > 0){
					$historyTrack.append( historyTrackSplitTmpl );
				}
				var $i = $(historyTrackItemTmpl).attr({ index: i, title: n.text }).html(n.text);
				$historyTrack.append( $i );
			});
			
			$('.historyTrack>[index]', this.el).bind('click', function(){
				me.go(this.getAttribute('index'));
				return false;
			});
		},
		reflushButtonState: function(){
			if(this.cursor <= 0){
				this.buttons.back.attr( 'disabled', true );
				this.buttons.back.removeClass("btnNav");
				this.buttons.back.addClass("btnNavDisabled");
			}else {
				this.buttons.back.attr( 'disabled', false );
				this.buttons.back.removeClass("btnNavDisabled");
				this.buttons.back.addClass("btnNav");
			}
			if(this.cursor >= this.states.length-1){
				this.buttons.forward.attr( 'disabled', true);
				this.buttons.forward.removeClass("btnNav");
				this.buttons.forward.addClass("btnNavDisabled");
			}else {
				this.buttons.forward.attr( 'disabled', false);
				this.buttons.forward.removeClass("btnNavDisabled");
				this.buttons.forward.addClass("btnNav");
			}
		},
		fixOptions: function(opts){
			var options = $.extend({}, HistoryNav.DefaultOptions, opts);
			return options;
		},
		getElement: function(){
			return this.$el;
		},
		getContainer: function(){
			return this.$container;
		},
		initHistory: function(){
			this.states = [];
			this.cursor = -1;
		},
		getCurState: function(){
			return this.states[this.cursor];
		},
		back: function(){
			if(this.cursor <= 0){
				return false;
			}
			--this.cursor;
			this.onChange();
			return this.states[this.cursor];
		},
		forward: function(){
		
			if(this.cursor >= this.states.length - 1){
				return false;
			}
			++this.cursor;
			this.onChange();
		},
		go: function(cursor){
			this.states[this.cursor = (cursor || this.cursor)];
			this.onChange();
		},
		pushState: function(state){
			if(this.cursor <= this.states.length - 1){
				this.states.length = this.cursor + 1;
			}
			this.states.push(state);
			this.forward();
			return this.states.length;
		},
		popState: function(){
			return this.states.pop();
		},
		replaceState: function(index, state){
			this.states[index] = state;
		},
		onChange: function(){
			this.options.onChange && this.options.onChange.call(this, arguments);
			this.renderTrack();
			this.reflushButtonState();
		}
	};
	exports.HistoryNav = HistoryNav;
	
})(this, jQuery);