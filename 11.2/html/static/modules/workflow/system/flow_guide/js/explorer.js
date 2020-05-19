
;(function( win, $, undefined ){

	// 工厂方法

	var Explorer = function( el, items, options ){
	
		var view = options.view;
	
		if( ExplorerView[ view ] ){
		
			return new ExplorerView[ view ]( el, items, options );
		
		} else {
		
			return new ExplorerView[ 'icon48' ]( el, items, options );
				
		}
		
	
	},
	
	ExplorerView = {};
	
	window.ExplorerView = ExplorerView;
	
	
	
	

	ExplorerView[ 'icon48' ] = function( el, items, opts ){
	
		this.type = 'icon48';
		
		this.init(el, items, opts);
				
	};
	
	ExplorerView[ 'icon48' ].prototype = {
	
		constructor: ExplorerView[ 'icon48' ],
		
		init: function(el, items, opts){
		
			this.$element = el;
			
			this.options = opts;
			
			this.items = items;
			
			this.render();
			
			opts.inited.call(this);
			
		},
		
		render: function(){
					
			if(!this.items){
			
				return false;
			}
		
			var tmpl = this.getTmpl(),
			
			t = $.tmpl(tmpl, this.items);
			
			this.$element.html(t);
			
			t.addClass(this.getType());
			
			this.initEvent();
			
			this.options.group&&this.fixGroupTitle();
			
			this.options.noDataMsg&&this.fixNoData();
		
		},
		
		getSelected: function(){
		
			return this.$element.find('ul.ico-list > li.icon-selected');
		
		},
		
		destory: function(){
		
			this.$element.find('ul.ico-list > li').die();
			
			this.$element.find('h2 > a').die();
			
			this.$element.removeData('explorer');			

			this.$element.html('');					
		
		},
		
		setOption: function(k, v){
		
			this.options[k] = v;
		
		},
		
		getOption: function(k){
		
			if(k in this.options){
			
				return this.options[k];
			}
		
		},
		
		getOptions: function(){
		
			return this.options;
		
		},
		
		getType: function(){
		
			return this.type;
		
		},
		
		getTmpl: function(type){
			
			if(type == 'groupTitle'){
							
				return '<a class="list-show-arrow" href="javascript:;" hidefocus></a>${groupText}(${num})';
				
			} else if(type == 'msg') {
			
				return '<p class="no-data-msg">${msg}</p>';
			
			} else {
			
				return '<div class="explorer-list-group"><h2></h2><hr/><ul class="ico-list clearfix">{{each items}}	<li id="${$value.id}" isFolder="${$value.isFolder}" class=""><div class="icoContainer"><div class="selectContainer" title="${$value.title || $value.text}"><div class="ico ${$value.className}"></div><a>${$value.text}</a></div></div></li>	{{/each}}</ul></div>';
		
			}
		},	
		
		fixGroupTitle: function(){
		
			var tmpl = this.getTmpl('groupTitle'),
			
			groupText = this.options.groupText,
			
			items = this.items;

			this.$element.children('.explorer-list-group').each(function(i, n){
			
				var $this = $(this),
				
				datas = {
				
					num: $this.find('ul.ico-list > li').size(),
					
					groupText: items[i].text || ''
				},
				
				t = $.tmpl( tmpl, datas);

				$this.children('h2').html(t);
			
			});
		
		},
		
		fixNoData: function(){
		
			var msg, msgBox,

			msgTmpl = this.getTmpl('msg'),
			
			optMsg = this.options.noDataMsg;
			
			if(optMsg === true){
				
				msg = '无内容';
			
			} else {
			
				msg = optMsg;
			
			}
			
			this.$element.find('ul.ico-list:empty').each(function(){
				$(this).replaceWith($.tmpl( msgTmpl, { msg: msg} ));
			})
		},		
		
		initEvent: function(){

			var $lis = this.$element.find('ul.ico-list > li'),
			
			$ul = this.$element.find('ul.ico-list'),
			
			$arrow = this.$element.find('h2 > a'),
			
			opts = this.options,
			
			me = this;
			
			//$lis.live('mouseover',function(){
			this.$element
				.on('mouseover',"ul.ico-list > li",function(){		
					if(this.className != 'icon-selected'){
						this.className = 'icon-hover';
				
				}})
				.on('mouseout',"ul.ico-list > li",function(){
					
					if(this.className != 'icon-selected'){
						this.className = '';
				
				}})
				.on('click',"ul.ico-list > li",function(){		
					me.$element.find('ul.ico-list > li').removeClass();
					this.className =  'icon-selected' ;
					opts.onClick && opts.onClick.call(this, arguments);
					return false;		
				})
				.on('dblclick',"ul.ico-list > li",function(){
					opts.onDbclick && opts.onDbclick.call(this, arguments);
					return false;		
				});
				
			this.$element.on('click',"h2 > a", function(){

				var $this = $(this),
				
				$thisUl = $this.parent().siblings('ul.ico-list');
	
				isHidden = $this.attr('className') === 'list-hide-arrow';
				
				className = isHidden ? 'list-show-arrow' : 'list-hide-arrow';
				
				$this.attr('className', className);
				
				$thisUl[ isHidden ? 'show' : 'hide' ](opts.animateSpeed);
	
			});				

			if( opts.sortable && $.fn.sortable ){	
				
				this.sortable();
			}
			
			this.$element.disableSelection();
		},
		
		sortable: function(){
			
			var $lis = this.$element.find('ul.ico-list > li'),
			
			$ul = this.$element.find('ul.ico-list'),
			
			opts = this.options,
			
			me = this;
			
			opts.sortable = !0;
			
			$ul.sortable({
				distance: 50,
				items: 'li',
				revert: true  ,
				tolerance: 'pointer' ,
				start: function(e,o){
					me.$element.find('ul.ico-list > li').removeClass();
					o.className =  'icon-selected' ;	
				},
				stop: function(e,o){
					opts.sortableCallback(e,o);
				}					
					
			});
		
		},
		
		makeArray: function(){
		
			var result = [];
		
			this.$element.find('ul.ico-list').each(function(){
		
				var lis = [];
		
				$(this).children('li').each(function(){
				
					lis.push($(this).attr('id'));
				
				});

		
				result.push(lis);
			
			});
			
			return result;
		
		}
	};
	
	
	
	
	ExplorerView['icon64'] = function(el, items, opts){
	
		this.type = 'icon64';
		
		this.init(el, items, opts);
	};
	
	ExplorerView['icon64'].prototype = $.extend({}, ExplorerView['icon48'].prototype, {
	
		constructor: ExplorerView['icon64']
	});
	
	
	
	
	
	ExplorerView['list'] = function(el, items, opts){
	
		this.type = 'list';
		
		this.init(el, items, opts);
		
	};
	
	ExplorerView['list'].prototype = $.extend({}, ExplorerView['icon48'].prototype, {
	
		constructor: ExplorerView['list']
	
	});
	
	ExplorerView['detail'] = function(el, items, opts){
	
		this.type = 'detail';
		
		this.init(el, items, opts);
	};
	
	ExplorerView['detail'].prototype = $.extend({}, ExplorerView['icon48'].prototype, {
	
		constructor: ExplorerView['detail']
		
	
	});
	
	
	
	
	
	
	
	 $.fn.explorer = function(items, option) {
	 
        return this.each(function() {
		
            var $this = $(this),
                data = $this.data('explorer'),
                options = $.extend({}, $.fn.explorer.defaults, typeof option == 'object' && option);
				
            if(!data){
			
				$this.data('explorer', (data = new Explorer($this, items, options)));
            }
			if(typeof option == 'string'){
				
				data[option]();
			}
        })
    };

    $.fn.explorer.Constructor = Explorer;

    $.fn.explorer.defaults = {
        view: 'icon48',
        height: 'auto',
		width: 'auto',
		onClick: $.noop,
        onDbclick: $.noop,
        group: 1,
		inited: $.noop,
		sortable: false,
		sortableCallback: $.noop,
		groupText: 'items',
		animateSpeed: 500,
		noDataMsg: true
	};
	
	
	
	
	win.Explorer = Explorer;
	
})(window, jQuery);