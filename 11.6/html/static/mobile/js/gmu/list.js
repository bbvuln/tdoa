(function( gmu, $ ) {

    /**
     * 列表组件，支持上拉下拉操作
     *
     * @param {dom | zepto | selector} [el] 用来初始化组件的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:List:options)
     * @grammar $( el ).list( options ) => zepto
     * @grammar new gmu.List( el, options ) => instance
     */
    
    
    var i = 0;
    gmu.define( 'List', {
        options: {
            
            content: null,
            
            url: '',
            
            enableExtendOptions: false,
            
            baseParam: null,
            
            param: null,
			
            dataFix: null,
            
			dataType: 'json',
            
            enablePullUp: true,
            
            enablePullDown: true
            
        },

        template: {

            item: '<li class="ui-border-t list-item-inserting" data-id="<%=id%>"><%=text></li>',
            
            emptyTip: '<section class="ui-notice"><i></i><p>'+td_lang.pda.no_cnt +'</p><button data-cmd="reload" class="ui-btn ui-btn-primary ui-margin-top">'+ td_lang.pda.reload || '重新加载'+'</button></section>',

            wrap: '<div class="ui-refresh"><div class="ui-refresh-up"></div><ul class="data-list ui-list ui-border-tb"></ul><div class="ui-refresh-down"></div></div>'
        },

        _init: function() {
            var me = this;
            i++;
            // 存储ul
            me.on( 'done.dom', function( e, $root ) {
                me.guid = i;
                
                me.$list = $root.find( 'ul' ).first();
                
                me.refresh = new gmu.Refresh({
                    el: me.getEl().find('.ui-refresh'),
                    load: function(){
                        me._ajax.apply(me, arguments);
                    },
                    $upElem: $root.find('.ui-refresh-up'),
                    $downElem: $root.find('.ui-refresh-down')
                });
                
                me.getEl()
                    .attr('data-list-guid', i)
                    .css('height', window.innerHeight - ($('header').height() || 0) - ($('footer').height() || 0))
                    .find('.ui-refresh-wrapper').css('height', '100%');
            } );
            
            me.getEl().on('click', '[data-cmd]', function(){
                var action = this.getAttribute('data-cmd');
                switch(action){
                    case "reload":
                        me.$loading.show();
                        me._ajax('reload');
                        break;
                }
            });
        },

        _create: function() {
            var me = this,
                $el = me.getEl(),
                opts = me._options,
                content = '',
                listContent = '',
                isEmpty = false;

            content += me.tpl2html( 'wrap' );
            
            if( $.isArray(opts.content) ){
                listContent += me.tpl2html( 'item', opts.content );
            } else {
                content += me.tpl2html( 'emptyTip' );
                isEmpty = true;
            }
            $el.addClass('ui-list-state-initlizing');
            $el.append(content);
            
            $el.find('ul').first().html(listContent);
            
            me.trigger( 'done.dom', $el.addClass( 'ui-' + me.widgetName ),
            opts );
            
            me.checkEmpty();
            
            me.$loading = $('<div></div>').loading({ content: td_lang.pda.msg_2 || '加载中...' });
            me._ajax('reload');
        },
        
        checkEmpty: function(){
            this.isEmpty = !this.$list.find('li').size();
            this.getEl()[ this.isEmpty ? 'addClass' : 'removeClass' ]('ui-list-state-empty');
        },
        
        refreshIscroll: function(){
            var me = this;
            me.refresh._options.iScroll  && me.refresh._options.iScroll.refresh && me.refresh._options.iScroll.refresh();
        },
        
        _ajax: function(dir, type){

            var me = this,
                $list = this.$list,
                opts = me._options,
                param = null;
            
            if(!opts.param){
                param = this.param;
            }else if($.isPlainObject(opts.param)){
                param = $.extend({}, opts.baseParam, opts.param);
            }else if($.isFunction(opts.param)){
                param = opts.param.call(me, dir, type, this.param, function(_dir){ dir = _dir });
            }

            if(dir == 'down' && me.pulldownDisable){
                //return;
            }
            $.ajax({
                url: opts.url,
                data: param,
				type: 'get',
                dataType: opts.dataType,
                beforeSend: function(xhr, settings){
                    
                },
                success: function(data, status, xhr){
                    //允许插件外部自行处理success事件， 返回false则取消插件success事件
                    var e = gmu.Event( 'success', e );
                    me.$loading.hide();
                    if(false === me.trigger(e, data, status, xhr)){
                        return false;
                    }
                    me.param = param;
                    
                    $.isFunction(opts.dataFix) && (data = opts.dataFix(data)); 
                    
                    var count = 0;

                    if(data){
                        var html = (function (data) {      //数据渲染

                            var data = data.datalist ? data.datalist : data;//兼容sns
                            
                            var liArr = [];
							if($.isPlainObject(data)){
                                liArr.push( me.tpl2html( 'item', data ) );
							}else{									
								$.each(data, function () {
									liArr.push( me.tpl2html( 'item', this ) );
                                    count ++;
								});
							}
                            return liArr.join('');
                        })(data.data ? data.data : data);

                        var act = {
                            up: 'prepend',
                            down: 'append',
                            reload: 'html'
                        };

                        $list[act[dir]](html);
                    
                        if(opts.enableExtendOptions){
                            var swiped = Swiped.init({
                                query: '[data-list-guid="'+me.guid+'"] .data-list>.list-item-inserting',
                                list: true,
                                group: 1,
                                left: 0,
                                right: 80
                            });
                        }
                    
                        $list.find('.list-item-inserting').removeClass('list-item-inserting');

                        count > 0 && count < 10 && me.getEl().find('.ui-refresh-down').hide();
            
                        dir == 'reload' && (dir = 'up');
                        me.refresh.afterDataLoading(dir);
                    
                        me.checkEmpty();
                        
                        me.refreshIscroll();
                    }
                },
                error: function(xhr, errorType, error){
                    //允许插件外部自行处理error事件
                    var e = gmu.Event( 'error', e );
                    if(false === me.trigger(e, xhr, errorType, error)){
                        return false;
                    }
                    
                    var msg = xhr.response;
                    //return;
                    if(msg.match(/nomoredata/ig)){
                        me.refresh.afterDataLoading('down');
                        //me.refresh.disable('down', true);
                        me.getEl().find('.ui-refresh-down').hide();
                        me.pulldownDisable = true;
                    }else if(msg.match(/nonewdata/ig)){
                        me.refresh.afterDataLoading('up');
                        //me.refresh.disable('up', true);
                        //me.refresh.enable('down');
                        try{
                            //me.refresh._options.iScroll.options.topOffset = 0;
                        }catch(e){}
                    }
                    setTimeout(function(){
                        me.refreshIscroll();
                    }, 1);
                    
                    me.$loading.hide();
                    
                },
                complete: function(xhr, status){
                    var e = gmu.Event( 'complete', e );
                    if(false === me.trigger(e, me)){
                        return false;
                    }
                    me.getEl().removeClass('ui-list-state-initlizing')
                    
                }
                
                
            });
            
        },
        
        setParam: function(key, value){
            this._options.baseParam['key'] = value;
        },
        
        getParam: function(key){
            return this._options.baseParam['key'];
        },
        
        bindEvent: function(){
            
        }
        
        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event itemclick
         * @param {Event} e gmu.Event对象
         * @param {Element} item 当前点击的条目
         * @description 某个条目被点击时触发
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    }, gmu.Base );

})( gmu, gmu.$ );