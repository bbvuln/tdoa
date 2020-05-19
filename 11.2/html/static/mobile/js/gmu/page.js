(function( gmu, $ ) {

    /**
     * 整页转场组件，支持router, history.hash
     *
     * @class Pages
     * @constructor Html部分
     * ```html
     * <section id="pages" class="ui-pages">
     *   <section id="inbox"  class="ui-page ui-page-active"><div class="ui-datalist"></div></section>
     *   <section id="outbox"  class="ui-page">outbox</section>
     *   <section id="write"  class="ui-page">write</section>
     * </section>
     * ```
     *
     * javascript部分
     * ```javascript
     * $('#pages').pages({
     *   router: {
     *       'inbox': callback,
     *       'outbox': callback,
     *       'write': callback
     *   },
     *
     *   header: {
     *       'inbox': {
     *           l: {event: "headReturn()"},
     *           c: {title: "收件箱"},
     *           r: null
     *       },
     *       'outbox': {
     *           l: {event: "headReturn()"},
     *           c: {title: "发件箱"},
     *           r: null
     *       },
     *       'write': {
     *           l: {event: "headReturn()"},
     *           c: {title: "写邮件"},
     *           r: null
     *       }
     *   }
     * })
     * ```
     * @param {dom | zepto | selector} [el] 用来初始化组件的元素
     * @param {Object} [options] 组件配置项。具体参数请查看[Options](#GMU:Pages:options)
     * @grammar $( el ).pages( options ) => zepto
     * @grammar new gmu.Pages( el, options ) => instance
     */

    var i = 0;
    var log = function(){
        console.log.apply(console, arguments);
    };
    gmu.define( 'Pages', {
        options: {

            router: null,

            header: null,

            activeClass: 'ui-page-active'

        },

        _init: function() {
            var me = this,
                opts = me._options;

            function hashView(){
                var hash = location.hash;
                var firstSlashIndex = hash.indexOf('/');
                var hashId;
                if(firstSlashIndex !== -1){
                    hashId =  hash.slice(firstSlashIndex + 1);
                } else {
                    hashId = '';
                }

                if(!me.inited && opts.active){
                    me.setActivePage($(opts.active));
                }else if(hash && hash.match(/#/) && $(hash.replace(/\/.*/g,'')).size()){
                    me.$active =  me.setActivePage( $(hash.replace(/\/.*/g,'')) );
                }else{
                    me.$active = me.getActivePage() || me.setActivePage(me.getEl().children().first());
                }

                me.to(me.$active.attr('id'),hashId);
            }

            window.addEventListener('hashchange', hashView, false);

            $('html').addClass('ui-fullscreen');

            me.initHeader(opts.header);
            me.initRouter(opts.router);
            hashView();
            me.inited = true;
        },

        initHeader: function(headers){
            if($.isPlainObject(headers)){
                this.headers = headers;
            }
        },

        initRouter: function(router){
            if($.isPlainObject(router) && window.routie){
                this.router = routie(router);
                log(this.router);
            }
        },
        getActivePage: function(){
            var me = this;
            var $active = me.getEl().find('.' + me._options.activeClass);
            return $active.size() ? $active : null;
        },
        setActivePage: function(el){
            var me = this, classname = me._options.activeClass;
            me.getEl().find('.' + classname).removeClass(classname);
            me.$active = $(el).addClass(classname);
            me.curpage = me.$active.attr('id');
            return me.$active;
        },
        renderHeader: function(header){

            tMobileSDK.buildHeader(header);
            //log(header);
        },

        while: function(){
            var $el = this.getEl(),
                classname = this._options.activeClass;
            this.to( this.$active.next().size() ? this.$active.next().attr('id') : $el.find('.ui-page').first().attr('id')  );
        },

        to: function(to,hashId){
            this.pageTo(this.curPage, to, hashId);
        },

        pageTo: function(from, to, hashId){
            var headers = this.headers;
            if(headers[to]){
                this.curPage = to;
                this.renderHeader(headers[to]);
                this.setActivePage('#'+to);
                if(hashId){
                    location.hash = to + '/' + hashId;
                } else {
                    var url = location.href.split('#')[0]
                    var newState = url + '#' + to
                    //alert('page. ', location.hash)
                    //location.hash === '' && history.replaceState(null,'',newState)
                    var problemHash = ['work','search_edit','form']
                    if(location.hash === '' && problemHash.indexOf(to) !== -1) {
                        history.replaceState(null,'',newState)
                    }
                    location.hash = to;
                }

            }else{
                log('undefined headers[to] - '+to);
            }
        },

        back: function(){
            history.back();
        }


        /**
         * @event ready
         * @param {Event} e gmu.Event对象
         * @description 当组件初始化完后触发。
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event对象
         * @description 组件在销毁的时候触发
         */
    }, gmu.Base );

})( gmu, gmu.$ );
