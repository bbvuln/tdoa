/* Gmu v2.1.0 - core/gmu.js, core/event.js, extend/parseTpl.js, core/widget.js, extend/throttle.js, extend/event.scrollStop.js, extend/matchMedia.js, extend/event.ortchange.js, extend/fix.js, widget/add2desktop/add2desktop.js, extend/highlight.js, widget/button/button.js, widget/button/$input.js, extend/touch.js, widget/calendar/calendar.js, widget/calendar/$picker.js, widget/dialog/dialog.js, extend/offset.js, extend/position.js, widget/dialog/$position.js, widget/popover/popover.js, widget/dropmenu/dropmenu.js, widget/dropmenu/horizontal.js, widget/dropmenu/placement.js, widget/gotop/gotop.js, widget/historylist/historylist.js, widget/navigator/navigator.js, extend/iscroll.js, widget/navigator/$scrollable.js, widget/navigator/evenness.js, widget/navigator/scrolltonext.js, widget/panel/panel.js, widget/popover/arrow.js, widget/popover/collision.js, widget/popover/dismissible.js, widget/popover/placement.js, widget/progressbar/progressbar.js, widget/refresh/refresh.js, widget/slider/slider.js, widget/slider/$autoplay.js, widget/slider/$lazyloadimg.js, widget/slider/$touch.js, widget/slider/arrow.js, widget/slider/dots.js, widget/slider/imgzoom.js, widget/suggestion/suggestion.js, widget/suggestion/$iscroll.js, widget/suggestion/$posadapt.js, widget/suggestion/$quickdelete.js, widget/suggestion/compatdata.js, widget/suggestion/renderlist.js, widget/suggestion/sendrequest.js, widget/tabs/tabs.js, widget/tabs/$ajax.js, widget/tabs/$swipe.js, widget/toolbar/toolbar.js, widget/toolbar/$position.js, widget/refresh/$iOS5.js */
// Copyright (c) 2013, Baidu Inc. All rights reserved.
//
// Licensed under the BSD License
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://gmu.baidu.com/license.html
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @file ����gmu�����ռ�
 * @namespace gmu
 * @import zepto.js
*/

/**
 * GMU�ǻ���zepto��������mobile UI����⣬����jquery uiʹ�ù淶���ṩwebapp��pad�˼����õ�UI�����Ϊ�˼�С��������������ܣ�����ٲ����������iOS3+ / android2.1+��֧�ֹ��������ƶ������������safari, chrome, UC, qq�ȡ�
 * GMU�ɰٶ�GMUС�鿪�������ڿ�ԴBSDЭ�飬֧����ҵ�ͷ���ҵ�û������ʹ�ú������޸ģ�������ͨ��[get started](http://gmu.baidu.com/getstarted)�����˽⡣
 *
 * ###Quick Start###
 * + **������**http://gmu.baidu.com/
 * + **API��**http://gmu.baidu.com/doc
 *
 * ###��ʷ�汾###
 *
 * ### 2.0.5 ###
 * + **DEMO: ** http://gmu.baidu.com/demo/2.0.5
 * + **API��** http://gmu.baidu.com/doc/2.0.5
 * + **���أ�** http://gmu.baidu.com/download/2.0.5
 *
 * @module GMU
 * @title GMU API �ĵ�
 */
var gmu = gmu || {
    version: '@version',
    $: window.Zepto,

    /**
     * ���ô˷��������Լ�С�ظ�ʵ����Zepto�Ŀ���������ͨ���˷������õģ���������һ��Zeptoʵ����
     * ��������Zeptoʵ�������Ŀ��������ô˷�����
     * @method staticCall
     * @grammar gmu.staticCall( dom, fnName, args... )
     * @param  {DOM} elem Dom����
     * @param  {String} fn Zepto��������
     * @param {*} * zepto�ж�Ӧ�ķ���������
     * @example
     * // ����dom��className��dom2, ���õ���zepto�ķ���������ֻ��ʵ����һ��Zepto�ࡣ
     * var dom = document.getElementById( '#test' );
     *
     * var className = gmu.staticCall( dom, 'attr', 'class' );
     * console.log( className );
     *
     * var dom2 = document.getElementById( '#test2' );
     * gmu.staticCall( dom, 'addClass', className );
     */
    staticCall: (function( $ ) {
        var proto = $.fn,
            slice = [].slice,

            // ���ô�zeptoʵ��
            instance = $();

        instance.length = 1;

        return function( item, fn ) {
            instance[ 0 ] = item;
            return proto[ fn ].apply( instance, slice.call( arguments, 2 ) );
        };
    })( Zepto )
};
/**
 * @file Event���, ��widget�ṩ�¼���Ϊ��Ҳ���Ը����������ṩ�¼���Ϊ��
 * @import core/gmu.js
 * @module GMU
 */
(function( gmu, $ ) {
    var slice = [].slice,
        separator = /\s+/,

        returnFalse = function() {
            return false;
        },

        returnTrue = function() {
            return true;
        };

    function eachEvent( events, callback, iterator ) {

        // ��֧�ֶ���ֻ֧�ֶ��event�ÿո����
        (events || '').split( separator ).forEach(function( type ) {
            iterator( type, callback );
        });
    }

    // ����ƥ��namespace����
    function matcherFor( ns ) {
        return new RegExp( '(?:^| )' + ns.replace( ' ', ' .* ?' ) + '(?: |$)' );
    }

    // ����event name��event namespace
    function parse( name ) {
        var parts = ('' + name).split( '.' );

        return {
            e: parts[ 0 ],
            ns: parts.slice( 1 ).sort().join( ' ' )
        };
    }

    function findHandlers( arr, name, callback, context ) {
        var matcher,
            obj;

        obj = parse( name );
        obj.ns && (matcher = matcherFor( obj.ns ));
        return arr.filter(function( handler ) {
            return handler &&
                    (!obj.e || handler.e === obj.e) &&
                    (!obj.ns || matcher.test( handler.ns )) &&
                    (!callback || handler.cb === callback ||
                    handler.cb._cb === callback) &&
                    (!context || handler.ctx === context);
        });
    }

    /**
     * Event�࣬���gmu.eventһ��ʹ��, ����ʹ�κζ�������¼���Ϊ����������`preventDefault()`, `stopPropagation()`������
     * ���ǵ����¼�û��Domð�ݸ������û��`stopImmediatePropagation()`��������`stopProgapation()`�����þ���
     * ��֮���handler����ִ�С�
     *
     * @class Event
     * @constructor
     * ```javascript
     * var obj = {};
     *
     * $.extend( obj, gmu.event );
     *
     * var etv = gmu.Event( 'beforeshow' );
     * obj.trigger( etv );
     *
     * if ( etv.isDefaultPrevented() ) {
     *     console.log( 'before show has been prevented!' );
     * }
     * ```
     * @grammar new gmu.Event( name[, props]) => instance
     * @param {String} type �¼�����
     * @param {Object} [props] ���Զ��󣬽������ƽ�event����
     */
    function Event( type, props ) {
        if ( !(this instanceof Event) ) {
            return new Event( type, props );
        }

        props && $.extend( this, props );
        this.type = type;

        return this;
    }

    Event.prototype = {

        /**
         * @method isDefaultPrevented
         * @grammar e.isDefaultPrevented() => Boolean
         * @desc �жϴ��¼��Ƿ���ֹ
         */
        isDefaultPrevented: returnFalse,

        /**
         * @method isPropagationStopped
         * @grammar e.isPropagationStopped() => Boolean
         * @desc �жϴ��¼��Ƿ�ֹͣ����
         */
        isPropagationStopped: returnFalse,

        /**
         * @method preventDefault
         * @grammar e.preventDefault() => undefined
         * @desc ��ֹ�¼�Ĭ����Ϊ
         */
        preventDefault: function() {
            this.isDefaultPrevented = returnTrue;
        },

        /**
         * @method stopPropagation
         * @grammar e.stopPropagation() => undefined
         * @desc ��ֹ�¼�����
         */
        stopPropagation: function() {
            this.isPropagationStopped = returnTrue;
        }
    };

    /**
     * @class event
     * @static
     * @description event���󣬰���һ��event�������������Խ��˶������ŵ���������������¼���Ϊ��
     *
     * ```javascript
     * var myobj = {};
     *
     * $.extend( myobj, gmu.event );
     *
     * myobj.on( 'eventname', function( e, var1, var2, var3 ) {
     *     console.log( 'event handler' );
     *     console.log( var1, var2, var3 );    // =>1 2 3
     * } );
     *
     * myobj.trigger( 'eventname', 1, 2, 3 );
     * ```
     */
    gmu.event = {

        /**
         * ���¼���
         * @method on
         * @grammar on( name, fn[, context] ) => self
         * @param  {String}   name     �¼���
         * @param  {Function} callback �¼�������
         * @param  {Object}   context  �¼��������������ġ�
         * @return {self} ��������������ʽ
         * @chainable
         */
        on: function( name, callback, context ) {
            var me = this,
                set;

            if ( !callback ) {
                return this;
            }

            set = this._events || (this._events = []);

            eachEvent( name, callback, function( name, callback ) {
                var handler = parse( name );

                handler.cb = callback;
                handler.ctx = context;
                handler.ctx2 = context || me;
                handler.id = set.length;
                set.push( handler );
            } );

            return this;
        },

        /**
         * ���¼����ҵ�handlerִ������Զ�����󶨡�
         * @method one
         * @grammar one( name, fn[, context] ) => self
         * @param  {String}   name     �¼���
         * @param  {Function} callback �¼�������
         * @param  {Object}   context  �¼��������������ġ�
         * @return {self} ��������������ʽ
         * @chainable
         */
        one: function( name, callback, context ) {
            var me = this;

            if ( !callback ) {
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                var once = function() {
                        me.off( name, once );
                        return callback.apply( context || me, arguments );
                    };

                once._cb = callback;
                me.on( name, once, context );
            } );

            return this;
        },

        /**
         * ����¼���
         * @method off
         * @grammar off( name[, fn[, context] ] ) => self
         * @param  {String}   name     �¼���
         * @param  {Function} callback �¼�������
         * @param  {Object}   context  �¼��������������ġ�
         * @return {self} ��������������ʽ
         * @chainable
         */
        off: function( name, callback, context ) {
            var events = this._events;

            if ( !events ) {
                return this;
            }

            if ( !name && !callback && !context ) {
                this._events = [];
                return this;
            }

            eachEvent( name, callback, function( name, callback ) {
                findHandlers( events, name, callback, context )
                        .forEach(function( handler ) {
                            delete events[ handler.id ];
                        });
            } );

            return this;
        },

        /**
         * �����¼�
         * @method trigger
         * @grammar trigger( name[, ...] ) => self
         * @param  {String | Event }   evt     �¼�����gmu.Event����ʵ��
         * @param  {*} * �������
         * @return {self} ��������������ʽ
         * @chainable
         */
        trigger: function( evt ) {
            var i = -1,
                args,
                events,
                stoped,
                len,
                ev;

            if ( !this._events || !evt ) {
                return this;
            }

            typeof evt === 'string' && (evt = new Event( evt ));

            args = slice.call( arguments, 1 );
            evt.args = args;    // handler�п���ֱ��ͨ��e.args��ȡtrigger����
            args.unshift( evt );

            events = findHandlers( this._events, evt.type );

            if ( events ) {
                len = events.length;

                while ( ++i < len ) {
                    if ( (stoped = evt.isPropagationStopped()) ||  false ===
                            (ev = events[ i ]).cb.apply( ev.ctx2, args )
                            ) {

                        // ���return false���൱��stopPropagation()��preventDefault();
                        stoped || (evt.stopPropagation(), evt.preventDefault());
                        break;
                    }
                }
            }

            return this;
        }
    };

    // expose
    gmu.Event = Event;
})( gmu, gmu.$ );
/**
 * @file ģ�����
 * @import zepto.js
 * @module GMU
 */
(function( $, undefined ) {
    
    /**
     * ����ģ��tpl����dataδ����ʱ���ر�������������ĳ��template��Ҫ��ν���ʱ�����鱣�������������Ȼ����ô˺������õ������
     * 
     * @method $.parseTpl
     * @grammar $.parseTpl(str, data)  ?6?0 string
     * @grammar $.parseTpl(str)  ?6?0 Function
     * @param {String} str ģ��
     * @param {Object} data ����
     * @example var str = "<p><%=name%></p>",
     * obj = {name: 'ajean'};
     * console.log($.parseTpl(str, data)); // => <p>ajean</p>
     */
    $.parseTpl = function( str, data ) {
        var tmpl = 'var __p=[];' + 'with(obj||{}){__p.push(\'' +
                str.replace( /\\/g, '\\\\' )
                .replace( /'/g, '\\\'' )
                .replace( /<%=([\s\S]+?)%>/g, function( match, code ) {
                    return '\',' + code.replace( /\\'/, '\'' ) + ',\'';
                } )
                .replace( /<%([\s\S]+?)%>/g, function( match, code ) {
                    return '\');' + code.replace( /\\'/, '\'' )
                            .replace( /[\r\n\t]/g, ' ' ) + '__p.push(\'';
                } )
                .replace( /\r/g, '\\r' )
                .replace( /\n/g, '\\n' )
                .replace( /\t/g, '\\t' ) +
                '\');}return __p.join("");',

            /* jsbint evil:true */
            func = new Function( 'obj', tmpl );
        
        return data ? func( data ) : func;
    };
})( Zepto );
/**
 * @file gmu�ײ㣬�����˴���gmu����ķ���
 * @import core/gmu.js, core/event.js, extend/parseTpl.js
 * @module GMU
 */

(function( gmu, $, undefined ) {
    var slice = [].slice,
        toString = Object.prototype.toString,
        blankFn = function() {},

        // �ҵ�������ϵ����ԡ�����
        staticlist = [ 'options', 'template', 'tpl2html' ],

        // �洢�Ͷ�ȡ���ݵ�ָ�������κζ������dom����
        // ע�⣺���ݲ�ֱ�Ӵ洢��object�ϣ����Ǵ����ڲ��հ��У�ͨ��_gid����
        // record( object, key ) ��ȡobject��Ӧ��keyֵ
        // record( object, key, value ) ����object��Ӧ��keyֵ
        // record( object, key, null ) ɾ������
        record = (function() {
            var data = {},
                id = 0,
                ikey = '_gid';    // internal key.

            return function( obj, key, val ) {
                var dkey = obj[ ikey ] || (obj[ ikey ] = ++id),
                    store = data[ dkey ] || (data[ dkey ] = {});

                val !== undefined && (store[ key ] = val);
                val === null && delete store[ key ];

                return store[ key ];
            };
        })(),

        event = gmu.event;

    function isPlainObject( obj ) {
        return toString.call( obj ) === '[object Object]';
    }

    // ��������
    function eachObject( obj, iterator ) {
        obj && Object.keys( obj ).forEach(function( key ) {
            iterator( key, obj[ key ] );
        });
    }

    // ��ĳ��Ԫ���϶�ȡĳ�����ԡ�
    function parseData( data ) {
        try {    // JSON.parse���ܱ���

            // ��data===null��ʾ��û�д�����
            data = data === 'true' ? true :
                    data === 'false' ? false : data === 'null' ? null :

                    // ������������ͣ����ַ�������ת����������
                    +data + '' === data ? +data :
                    /(?:\{[\s\S]*\}|\[[\s\S]*\])$/.test( data ) ?
                    JSON.parse( data ) : data;
        } catch ( ex ) {
            data = undefined;
        }

        return data;
    }

    // ��DOM�ڵ��ϻ�ȡ������
    function getDomOptions( el ) {
        var ret = {},
            attrs = el && el.attributes,
            len = attrs && attrs.length,
            key,
            data;

        while ( len-- ) {
            data = attrs[ len ];
            key = data.name;

            if ( key.substring(0, 5) !== 'data-' ) {
                continue;
            }

            key = key.substring( 5 );
            data = parseData( data.value );

            data === undefined || (ret[ key ] = data);
        }

        return ret;
    }

    // ��$.fn�ϹҶ�Ӧ�����������
    // $('#btn').button( options );ʵ�������
    // $('#btn').button( 'select' ); ����ʵ������
    // $('#btn').button( 'this' ); ȡ���ʵ��
    // �˷�����ѭget first set allԭ��
    function zeptolize( name ) {
        var key = name.substring( 0, 1 ).toLowerCase() + name.substring( 1 ),
            old = $.fn[ key ];

        $.fn[ key ] = function( opts ) {
            var args = slice.call( arguments, 1 ),
                method = typeof opts === 'string' && opts,
                ret,
                obj;

            $.each( this, function( i, el ) {

                // �ӻ�����ȡ��û���򴴽�һ��
                obj = record( el, name ) || new gmu[ name ]( el,
                        isPlainObject( opts ) ? opts : undefined );

                // ȡʵ��
                if ( method === 'this' ) {
                    ret = obj;
                    return false;    // �Ͽ�eachѭ��
                } else if ( method ) {

                    // ��ȡ�ķ���������ʱ���׳�������Ϣ
                    if ( !$.isFunction( obj[ method ] ) ) {
                        throw new Error( '���û�д˷�����' + method );
                    }

                    ret = obj[ method ].apply( obj, args );

                    // �϶�����getter���ʵķ�����������Ҫ�Ͽ�eachѭ�����ѽ������
                    if ( ret !== undefined && ret !== obj ) {
                        return false;
                    }

                    // retΪobjʱΪ��Чֵ��Ϊ�˲�Ӱ�����ķ���
                    ret = undefined;
                }
            } );

            return ret !== undefined ? ret : this;
        };

        /*
         * NO CONFLICT
         * var gmuPanel = $.fn.panel.noConflict();
         * gmuPanel.call(test, 'fnname');
         */
        $.fn[ key ].noConflict = function() {
            $.fn[ key ] = old;
            return this;
        };
    }

    // ����ע���option
    function loadOption( klass, opts ) {
        var me = this;

        // �ȼ��ظ�����
        if ( klass.superClass ) {
            loadOption.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'options' ), function( key, option ) {
            option.forEach(function( item ) {
                var condition = item[ 0 ],
                    fn = item[ 1 ];

                if ( condition === '*' ||
                        ($.isFunction( condition ) &&
                        condition.call( me, opts[ key ] )) ||
                        condition === opts[ key ] ) {

                    fn.call( me );
                }
            });
        } );
    }

    // ����ע��Ĳ��
    function loadPlugins( klass, opts ) {
        var me = this;

        // �ȼ��ظ�����
        if ( klass.superClass ) {
            loadPlugins.call( me, klass.superClass, opts );
        }

        eachObject( record( klass, 'plugins' ), function( opt, plugin ) {

            // ���������ر��ˣ������ô˲��
            if ( opts[ opt ] === false ) {
                return;
            }

            eachObject( plugin, function( key, val ) {
                var oringFn;

                if ( $.isFunction( val ) && (oringFn = me[ key ]) ) {
                    me[ key ] = function() {
                        var origin = me.origin,
                            ret;

                        me.origin = oringFn;
                        ret = val.apply( me, arguments );
                        origin === undefined ? delete me.origin :
                                (me.origin = origin);

                        return ret;
                    };
                } else {
                    me[ key ] = val;
                }
            } );

            plugin._init.call( me );
        } );
    }

    // �ϲ�����
    function mergeObj() {
        var args = slice.call( arguments ),
            i = args.length,
            last;

        while ( i-- ) {
            last = last || args[ i ];
            isPlainObject( args[ i ] ) || args.splice( i, 1 );
        }

        return args.length ?
                $.extend.apply( null, [ true, {} ].concat( args ) ) : last; // �����options��ĳ��Ϊobjectʱ�������в�����==�ж�
    }

    // ��ʼ��widget. ���ؾ���ϸ�ڣ���Ϊ������ڹ������еĻ����ǿ��Կ������������ݵ�
    // ͬʱ�˷������Թ��á�
    function bootstrap( name, klass, uid, el, options ) {
        var me = this,
            opts;

        if ( isPlainObject( el ) ) {
            options = el;
            el = undefined;
        }

        // options�д���elʱ������el
        options && options.el && (el = $( options.el ));
        el && (me.$el = $( el ), el = me.$el[ 0 ]);

        opts = me._options = mergeObj( klass.options,
                getDomOptions( el ), options );

        me.template = mergeObj( klass.template, opts.template );

        me.tpl2html = mergeObj( klass.tpl2html, opts.tpl2html );

        // ����eventNs widgetName
        me.widgetName = name.toLowerCase();
        me.eventNs = '.' + me.widgetName + uid;

        me._init( opts );

        // ����setup������ֻ�д����$el��DOM�У�����Ϊ��setupģʽ
        me._options.setup = (me.$el && me.$el.parent()[ 0 ]) ? true: false;

        loadOption.call( me, klass, opts );
        loadPlugins.call( me, klass, opts );

        // ���д���DOM�Ȳ���
        me._create();
        me.trigger( 'ready' );

        el && record( el, name, me ) && me.on( 'destroy', function() {
            record( el, name, null );
        } );

        return me;
    }

    /**
     * @desc ����һ���࣬���캯��Ĭ��Ϊinit����, superClassĬ��ΪBase
     * @name createClass
     * @grammar createClass(object[, superClass]) => fn
     */
    function createClass( name, object, superClass ) {
        if ( typeof superClass !== 'function' ) {
            superClass = gmu.Base;
        }

        var uuid = 1,
            suid = 1;

        function klass( el, options ) {
            if ( name === 'Base' ) {
                throw new Error( 'Base�಻��ֱ��ʵ����' );
            }

            if ( !(this instanceof klass) ) {
                return new klass( el, options );
            }

            return bootstrap.call( this, name, klass, uuid++, el, options );
        }

        $.extend( klass, {

            /**
             * @name register
             * @grammar klass.register({})
             * @desc ע����
             */
            register: function( name, obj ) {
                var plugins = record( klass, 'plugins' ) ||
                        record( klass, 'plugins', {} );

                obj._init = obj._init || blankFn;

                plugins[ name ] = obj;
                return klass;
            },

            /**
             * @name option
             * @grammar klass.option(option, value, method)
             * @desc ���������������
             */
            option: function( option, value, method ) {
                var options = record( klass, 'options' ) ||
                        record( klass, 'options', {} );

                options[ option ] || (options[ option ] = []);
                options[ option ].push([ value, method ]);

                return klass;
            },

            /**
             * @name inherits
             * @grammar klass.inherits({})
             * @desc �Ӹ���̳г�һ�����࣬���ᱻ�ҵ�gmu�����ռ�
             */
            inherits: function( obj ) {

                // ���� Sub class
                return createClass( name + 'Sub' + suid++, obj, klass );
            },

            /**
             * @name extend
             * @grammar klass.extend({})
             * @desc �����������
             */
            extend: function( obj ) {
                var proto = klass.prototype,
                    superProto = superClass.prototype;

                staticlist.forEach(function( item ) {
                    obj[ item ] = mergeObj( superClass[ item ], obj[ item ] );
                    obj[ item ] && (klass[ item ] = obj[ item ]);
                    delete obj[ item ];
                });

                // todo ��plugin��origin�߼�������һ��
                eachObject( obj, function( key, val ) {
                    if ( typeof val === 'function' && superProto[ key ] ) {
                        proto[ key ] = function() {
                            var $super = this.$super,
                                ret;

                            // todo ֱ����this.$super = superProto[ key ];
                            this.$super = function() {
                                var args = slice.call( arguments, 1 );
                                return superProto[ key ].apply( this, args );
                            };

                            ret = val.apply( this, arguments );

                            $super === undefined ? (delete this.$super) :
                                    (this.$super = $super);
                            return ret;
                        };
                    } else {
                        proto[ key ] = val;
                    }
                } );
            }
        } );

        klass.superClass = superClass;
        klass.prototype = Object.create( superClass.prototype );


        /*// �����ڷ�����ͨ��this.$super(name)�������ø����������磺this.$super('enable');
        object.$super = function( name ) {
            var fn = superClass.prototype[ name ];
            return $.isFunction( fn ) && fn.apply( this,
                    slice.call( arguments, 1 ) );
        };*/

        klass.extend( object );

        return klass;
    }

    /**
     * @method define
     * @grammar gmu.define( name, object[, superClass] )
     * @class
     * @param {String} name ������ֱ�ʶ����
     * @param {Object} object
     * @desc ����һ��gmu���
     * @example
     * ####�������
     * ```javascript
     * gmu.define( 'Button', {
     *     _create: function() {
     *         var $el = this.getEl();
     *
     *         $el.addClass( 'ui-btn' );
     *     },
     *
     *     show: function() {
     *         console.log( 'show' );
     *     }
     * } );
     * ```
     *
     * ####���ʹ��
     * html����
     * ```html
     * <a id='btn'>��ť</a>
     * ```
     *
     * javascript����
     * ```javascript
     * var btn = $('#btn').button();
     *
     * btn.show();    // => show
     * ```
     *
     */
    gmu.define = function( name, object, superClass ) {
        gmu[ name ] = createClass( name, object, superClass );
        zeptolize( name );
    };

    /**
     * @desc �ж�object�ǲ��� widgetʵ��, klass����ʱ��Ĭ��ΪBase����
     * @method isWidget
     * @grammar gmu.isWidget( anything[, klass] ) => Boolean
     * @param {*} anything ��Ҫ�жϵĶ���
     * @param {String|Class} klass �ַ��������ࡣ
     * @example
     * var a = new gmu.Button();
     *
     * console.log( gmu.isWidget( a ) );    // => true
     * console.log( gmu.isWidget( a, 'Dropmenu' ) );    // => false
     */
    gmu.isWidget = function( obj, klass ) {

        // �����ַ�����case
        klass = typeof klass === 'string' ? gmu[ klass ] || blankFn : klass;
        klass = klass || gmu.Base;
        return obj instanceof klass;
    };

    /**
     * @class Base
     * @description widget���ࡣ����ֱ��ʹ�á�
     */
    gmu.Base = createClass( 'Base', {

        /**
         * @method _init
         * @grammar instance._init() => instance
         * @desc ����ĳ�ʼ��������������Ҫ��д�÷���
         */
        _init: blankFn,

        /**
         * @override
         * @method _create
         * @grammar instance._create() => instance
         * @desc �������DOM�ķ�����������Ҫ��д�÷���
         */
        _create: blankFn,


        /**
         * @method getEl
         * @grammar instance.getEl() => $el
         * @desc ���������$el
         */
        getEl: function() {
            return this.$el;
        },

        /**
         * @method on
         * @grammar instance.on(name, callback, context) => self
         * @desc �����¼�
         */
        on: event.on,

        /**
         * @method one
         * @grammar instance.one(name, callback, context) => self
         * @desc �����¼���ִֻ��һ�Σ�
         */
        one: event.one,

        /**
         * @method off
         * @grammar instance.off(name, callback, context) => self
         * @desc ��������¼�
         */
        off: event.off,

        /**
         * @method trigger
         * @grammar instance.trigger( name ) => self
         * @desc �ɷ��¼�, ��trigger�����Ȱ�options�ϵ��¼��ص�������ִ��
         * options�ϻص���������ͨ������event.stopPropagation()����ֹ�¼�ϵͳ�����ɷ�,
         * ���ߵ���event.preventDefault()��ֹ�����¼�ִ��
         */
        trigger: function( name ) {
            var evt = typeof name === 'string' ? new gmu.Event( name ) : name,
                args = [ evt ].concat( slice.call( arguments, 1 ) ),
                opEvent = this._options[ evt.type ],

                // �ȴ�����������������ʹ�õ�ʱ�򣬿����Ѿ���destory��ɾ���ˡ�
                $el = this.getEl();

            if ( opEvent && $.isFunction( opEvent ) ) {

                // �������ֵ��false,�൱��ִ��stopPropagation()��preventDefault();
                false === opEvent.apply( this, args ) &&
                        (evt.stopPropagation(), evt.preventDefault());
            }

            event.trigger.apply( this, args );

            // triggerHandler��ð��
            $el && $el.triggerHandler( evt, (args.shift(), args) );

            return this;
        },

        /**
         * @method tpl2html
         * @grammar instance.tpl2html() => String
         * @grammar instance.tpl2html( data ) => String
         * @grammar instance.tpl2html( subpart, data ) => String
         * @desc ��template�����html�ַ����������� data ʱ��html��ͨ��$.parseTpl��Ⱦ��
         * template֧��ָ��subpart, ����subpartʱ��template����Ϊģ�壬����subpartʱ��
         * template[subpart]����Ϊģ�������
         */
        tpl2html: function( subpart, data ) {
            var tpl = this.template;

            tpl =  typeof subpart === 'string' ? tpl[ subpart ] :
                    ((data = subpart), tpl);

            return data || ~tpl.indexOf( '<%' ) ? $.parseTpl( tpl, data ) : tpl;
        },

        /**
         * @method destroy
         * @grammar instance.destroy()
         * @desc ע�����
         */
        destroy: function() {

            // ���element�ϵ��¼�
            this.$el && this.$el.off( this.eventNs );

            this.trigger( 'destroy' );
            // ��������Զ����¼�
            this.off();


            this.destroyed = true;
        }

    }, Object );

    // ���¼���
    $.ui = gmu;
})( gmu, gmu.$ );
/**
 * @file ���ٶԷ������¼���ִ��Ƶ�ʣ���ε��ã���ָ����ʱ����ֻ��ִ��һ��
 * @import zepto.js
 * @module GMU
 */

(function ($) {
    /**
     * ����ִ��Ƶ��, ��ε��ã���ָ����ʱ���ڣ�ֻ��ִ��һ�Ρ�
     * ```
     * ||||||||||||||||||||||||| (����) |||||||||||||||||||||||||
     * X    X    X    X    X    X      X    X    X    X    X    X
     * ```
     * 
     * @method $.throttle
     * @grammar $.throttle(delay, fn) ?6?0 function
     * @param {Number} [delay=250] ��ʱʱ��
     * @param {Function} fn ��ϡ�͵ķ���
     * @param {Boolean} [debounce_mode=false] �Ƿ�������ģʽ, true:start, false:end
     * @example var touchmoveHander = function(){
     *     //....
     * }
     * //���¼�
     * $(document).bind('touchmove', $.throttle(250, touchmoveHander));//Ƶ��������ÿ250ms��ִ��һ��touchmoveHandler
     *
     * //����¼�
     * $(document).unbind('touchmove', touchmoveHander);//ע��������unbind����touchmoveHander,������$.throttle���ص�function, ��Ȼunbind�Ǹ�Ҳ��һ����Ч��
     *
     */
    $.extend($, {
        throttle: function(delay, fn, debounce_mode) {
            var last = 0,
                timeId;

            if (typeof fn !== 'function') {
                debounce_mode = fn;
                fn = delay;
                delay = 250;
            }

            function wrapper() {
                var that = this,
                    period = Date.now() - last,
                    args = arguments;

                function exec() {
                    last = Date.now();
                    fn.apply(that, args);
                };

                function clear() {
                    timeId = undefined;
                };

                if (debounce_mode && !timeId) {
                    // debounceģʽ && ��һ�ε���
                    exec();
                }

                timeId && clearTimeout(timeId);
                if (debounce_mode === undefined && period > delay) {
                    // throttle, ִ�е���delayʱ��
                    exec();
                } else {
                    // debounce, �����start��clearTimeout
                    timeId = setTimeout(debounce_mode ? clear : exec, debounce_mode === undefined ? delay - period : delay);
                }
            };
            // for event bind | unbind
            wrapper._zid = fn._zid = fn._zid || $.proxy(fn)._zid;
            return wrapper;
        },

        /**
         * @desc ����ִ��Ƶ��, ��ָ����ʱ����, ��ε��ã�ֻ��ִ��һ�Ρ�
         * **options:**
         * - ***delay***: ��ʱʱ��
         * - ***fn***: ��ϡ�͵ķ���
         * - ***t***: ָ�����ڿ�ʼ��ִ�У����ǽ�����ִ��, true:start, false:end
         *
         * ��at_beginģʽ
         * <code type="text">||||||||||||||||||||||||| (����) |||||||||||||||||||||||||
         *                         X                                X</code>
         * at_beginģʽ
         * <code type="text">||||||||||||||||||||||||| (����) |||||||||||||||||||||||||
         * X                                X                        </code>
         *
         * @grammar $.debounce(delay, fn[, at_begin]) ?6?0 function
         * @name $.debounce
         * @example var touchmoveHander = function(){
         *     //....
         * }
         * //���¼�
         * $(document).bind('touchmove', $.debounce(250, touchmoveHander));//Ƶ��������ֻҪ���ʱ�䲻����250ms, ��һϵ���ƶ���ֻ��ִ��һ��
         *
         * //����¼�
         * $(document).unbind('touchmove', touchmoveHander);//ע��������unbind����touchmoveHander,������$.debounce���ص�function, ��Ȼunbind�Ǹ�Ҳ��һ����Ч��
         */
        debounce: function(delay, fn, t) {
            return fn === undefined ? $.throttle(250, delay, false) : $.throttle(delay, fn, t === undefined ? false : t !== false);
        }
    });
})(Zepto);
/**
 * @file ����ֹͣ�¼�
 * @name scrollStop
 * @short scrollStop
 * @desc ����ֹͣ�¼�
 * @import zepto.js, extend/throttle.js
 */
(function ($, win) {
    /**
     * @name scrollStop
     * @desc ��չ���¼�������ֹͣ�¼�
     * - ***scrollStop*** : ��document��������scrollStop�¼��ϣ�scrollͣ����ʱ����, ����ǰ�����ߺ��˺�scroll�¼������������
     * @example $(document).on('scrollStop', function () {        //scrollͣ����ʱ��ʾscrollStop
     *     console.log('scrollStop');
     * });
     */

    function registerScrollStop() {
        $(win).on('scroll', $.debounce(80, function () {
            $(win).trigger('scrollStop');
        }, false));
    }

    function backEventOffHandler() {
        //���뿪ҳ�棬ǰ������˻ص�ҳ������°�scroll, ��Ҫoff�����е�scroll������scrollʱ�䲻����
        $(win).off('scroll');
        registerScrollStop();
    }
    registerScrollStop();

    //todo ��ͳһ��������¼���������
    $(win).on('pageshow', function (e) {
        //����Ǵ�bfcache�м���ҳ�棬Ϊ�˷�ֹ���ע�ᣬ��Ҫ��off��
        e.persisted && $(win).off('touchstart', backEventOffHandler).one('touchstart', backEventOffHandler);
    });

})(Zepto, window);
/**
 * @file ý���ѯ
 * @import zepto.js
 * @module GMU
 */

(function ($) {

    /**
     * ��ԭ����window.matchMedia������polyfill�����ڲ�֧��matchMedia�ķ���ϵͳ�������������[w3c window.matchMedia](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia)�Ľӿ�
     * ���壬��matchMedia���������˷�װ��ԭ������css media query��transitionEnd�¼�����ɵġ���ҳ���в���media query��ʽ��Ԫ�أ���query��������ʱ�ı��Ԫ����ʽ��ͬʱ�����ʽ��transition���õ����ԣ�
     * ���������󼴻ᴥ��transitionEnd���ɴ˴���MediaQueryList���¼�����������transition��duration timeΪ0.001ms������ֱ��ʹ��MediaQueryList�����matchesȥ�жϵ�ǰ�Ƿ���queryƥ�䣬���в����ӳ٣�
     * ����ע��addListener�ķ�ʽȥ����query�ĸı䡣$.matchMedia����ϸʵ��ԭ�����ø÷���ʵ�ֵ�ת��ͳһ����������
     * [GMU Pages: ת���������($.matchMedia)](https://github.com/gmuteam/GMU/wiki/%E8%BD%AC%E5%B1%8F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88$.matchMedia)
     *
     * ����ֵMediaQueryList�������������<br />
     * - ***matches*** �Ƿ�����query<br />
     * - ***query*** ��ѯ��css query������\'screen and (orientation: portrait)\'<br />
     * - ***addListener*** ���MediaQueryList��������������ջص��������ص�����ΪMediaQueryList����<br />
     * - ***removeListener*** �Ƴ�MediaQueryList���������<br />
     *
     *
     * @method $.matchMedia
     * @grammar $.matchMedia(query)  ?6?0 MediaQueryList
     * @param {String} query ��ѯ��css query������\'screen and (orientation: portrait)\'
     * @return {Object} MediaQueryList
     * @example
     * $.matchMedia('screen and (orientation: portrait)').addListener(fn);
     */
    $.matchMedia = (function() {
        var mediaId = 0,
            cls = 'gmu-media-detect',
            transitionEnd = $.fx.transitionEnd,
            cssPrefix = $.fx.cssPrefix,
            $style = $('<style></style>').append('.' + cls + '{' + cssPrefix + 'transition: width 0.001ms; width: 0; position: absolute; clip: rect(1px, 1px, 1px, 1px);}\n').appendTo('head');

        return function (query) {
            var id = cls + mediaId++,
                $mediaElem,
                listeners = [],
                ret;

            $style.append('@media ' + query + ' { #' + id + ' { width: 1px; } }\n') ;   //ԭ��matchMediaҲ��Ҫ��Ӷ�Ӧ��@media������Ч

            // ͳһ��ģ��ģ�ʱ�����á�
            // if ('matchMedia' in window) {
            //     return window.matchMedia(query);
            // }

            $mediaElem = $('<div class="' + cls + '" id="' + id + '"></div>')
                .appendTo('body')
                .on(transitionEnd, function() {
                    ret.matches = $mediaElem.width() === 1;
                    $.each(listeners, function (i,fn) {
                        $.isFunction(fn) && fn.call(ret, ret);
                    });
                });

            ret = {
                matches: $mediaElem.width() === 1 ,
                media: query,
                addListener: function (callback) {
                    listeners.push(callback);
                    return this;
                },
                removeListener: function (callback) {
                    var index = listeners.indexOf(callback);
                    ~index && listeners.splice(index, 1);
                    return this;
                }
            };

            return ret;
        };
    }());
})(Zepto);

/**
 * @file ��չת���¼�
 * @name ortchange
 * @short ortchange
 * @desc ��չת���¼�orientation�����ԭ��ת���¼��ļ���������
 * @import zepto.js, extend/matchMedia.js
 */

$(function () {
    /**
     * @name ortchange
     * @desc ��չת���¼�orientation�����ԭ��ת���¼��ļ���������
     * - ***ortchange*** : ��ת����ʱ�򴥷�������uc��������֧��orientationchange���豸������css media queryʵ�֣������ת����ʱ��orientation�¼��ļ���������
     * $(window).on('ortchange', function () {        //��ת����ʱ�򴥷�
     *     console.log('ortchange');
     * });
     */
    //��չ����media query
    $.mediaQuery = {
        ortchange: 'screen and (width: ' + window.innerWidth + 'px)'
    };
    //ͨ��matchMedia����ת���¼�
    $.matchMedia($.mediaQuery.ortchange).addListener(function () {
        $(window).trigger('ortchange');
    });
});
/**
 * @file ʵ����ͨ��fix������
 * @name Fix
 * @import zepto.js, extend/event.scrollStop.js, extend/event.ortchange.js
 */

/**
 * @name fix
 * @grammar fix(options) => self
 * @desc �̶�fix�������Բ�֧��position:fixed���豸�Ͻ�Ԫ��position��Ϊabsolute��
 * ��ÿ��scrollstopʱ����opts�������õ�ǰ��ʾ��λ�ã�����fixЧ����
 *
 * Options:
 * - ''top'' {Number}: ���붥����pxֵ
 * - ''left'' {Number}: ��������pxֵ
 * - ''bottom'' {Number}: ����ײ���pxֵ
 * - ''right'' {Number}: �����Ҳ��pxֵ
 * @example
 * var div = $('div');
 * div.fix({top:0, left:0}); //��div�̶������Ͻ�
 * div.fix({top:0, right:0}); //��div�̶������Ͻ�
 * div.fix({bottom:0, left:0}); //��div�̶������½�
 * div.fix({bottom:0, right:0}); //��div�̶������½�
 *
 */

(function ($, undefined) {
    $.extend($.fn, {
        fix: function(opts) {
            var me = this;                      //���һ�������еĵ�һԪ����fix������Ϊ������ϵ�����Ԫ����fix��
            if(me.attr('isFixed')) return me;   //�����ڲ���ʱ�Ϳ�����Լ��Ͻ��в��������ص������¼�ȥ����
            me.css(opts).css('position', 'fixed').attr('isFixed', true);
            var buff = $('<div style="position:fixed;top:10px;"></div>').appendTo('body'),
                top = buff[0].getBoundingClientRect().top,
                checkFixed = function() {
                    if(window.pageYOffset > 0) {
                        if(buff[0].getBoundingClientRect().top !== top) {
                            me.css('position', 'absolute');
                            doFixed();
                            $(window).on('scrollStop', doFixed);
                            $(window).on('ortchange', doFixed);
                        }
                        $(window).off('scrollStop', checkFixed);
                        buff.remove();
                    }
                },
                doFixed = function() {
                    me.css({
                        top: window.pageYOffset + (opts.bottom !== undefined ? window.innerHeight - me.height() - opts.bottom : (opts.top ||0)),
                        left: opts.right !== undefined ? document.body.offsetWidth - me.width() - opts.right : (opts.left || 0)
                    });
                    opts.width == '100%' && me.css('width', document.body.offsetWidth);
                };

            $(window).on('scrollStop', checkFixed);

            return me;
        }
    });
}(Zepto));
/**
 * @file ��iOS�н�ҳ�����Ϊ����ͼ��(��֧��Androidϵͳ)
 * @import core/widget.js, extend/fix.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    /**
     * ��iOS�н�ҳ�����Ϊ����ͼ��(��֧��Androidϵͳ)
     * @class Add2desktop
     * @constructor Html����
     *
     * javascript����
     * ```javascript
     * gmu.Add2desktop({icon:'../../../examples/assets/icon.png'});
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ����������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Toolbar:options)
     * @grammar  gmu.Add2desktop([el [,options]]) =>instance
     * @grammar  $(el).add2desktop(options) => zepto
     */
    gmu.define('Add2desktop', {
        options: {
            /**
             * @property {String} icon ��Ʒ��ICON��URL
             * @namespace options
             */
            icon: '',
            /**
             * @property {selector} [container=document.body] �������
             * @namespace options
             */
            container:  '',
            /**
             * @property {String} [key='_gmu_adddesktop_key'] LocalStorage��keyֵ
             * @namespace options
             */
            key:'_gmu_adddesktop_key',
            /**
             * @property {Boolean} [useFix=true] �Ƿ�ʹ��fix�̶�Ч��
             * @namespace options
             */
            useFix: true,
            /**
             * @property {Object} [position={bottom:12,left:50%}] �̶�ʱʹ�õ�λ�ò���
             * @namespace options
             */
            position: {
                bottom: 12,
                left: '50%'
            },
            /**
             * @property {Function} [beforeshow=fn}] ��ʾǰ�������¼�������e.preventDefault()������ֹ��ʾ
             * @namespace options
             */
            beforeshow : function(e){
                this.key() && e.preventDefault()
            },
            /**
             * @property {Function} [afterhide=fn}] ���غ󴥷����¼�������������дLocalStorage��ֵ
             * @namespace options
             */
            afterhide : function(){
                this.key(1)
            },
            _isShow:false
        },

        _init: function() {
            var me = this;

            me.on( 'ready', function(){
                me.$el.find('.ui-add2desktop-close').on('click',function () {
                    me.hide();
                });
                me._options['useFix'] && me.$el.fix(me._options['position']);

                me.show();
            } );

            me.on( 'destroy', function(){
                me.$el.remove();
            } );
        },

        _create: function() {
            var me = this,
                $el,
                version = ($.os.version && $.os.version.substr(0, 3) > 4.1 ? 'new' :'old');

            if($.os.version && $.os.version.substr(0, 3) >= 7.0) {
                version = 'iOS7';
            }

            if( me._options.setup ) {
                var src = me.$el.children('img').attr('src');
                src && (me._options['icon'] = src);
            }
            $el = me.$el || (me.$el = $('<div></div>'));
            $el.addClass('ui-add2desktop').appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body)),

            $el.html('<img src="' + me._options['icon'] + '"/><p>�ȵ��<span class="ui-add2desktop-icon-' + version +'"></span>��<br />��"��ӵ�����Ļ"</p><span class="ui-add2desktop-close"><b></b></span><div class="ui-add2desktop-arrow"><b></b></div>');
        },

        /**
         * �洢/��ȡLocalStorage�ļ�ֵ
         * @method key
         * @param {String} [value] LocalStorage�ļ�ֵ��������ʾȡֵ
         * @return {self} LocalStorage��ֵ
         */
        key : function(value){
            var ls = window.localStorage;
            return value !== undefined ? ls.setItem(this._options['key'], value) : ls.getItem(this._options['key']);
        },

        /**
         * ��ʾadd2desktop
         * @method show
         * @return {self} ���ر���
         */

        /**
         * @event beforeshow
         * @param {Event} e gmu.Event����
         * @description add2desktop��ʾǰ����
         */
        show: function() {
            var me = this;

            if( !me._options['_isShow'] ) {
                if(!$.os.ios || $.browser.uc || $.browser.qq || $.browser.chrome) return me; //todo ���iOSԭ����������ж�
                var event = new gmu.Event('beforeshow');
                me.trigger(event);
                if(event.isDefaultPrevented()) return me;
                me.$el.css('display', 'block');
                me._options['_isShow'] = true;
            }

            return me;
        },

        /**
         * ����add2desktop
         * @method hide
         * @return {self} ���ر���
         */

        /**
         * @event afterhide
         * @param {Event} e gmu.Event����
         * @description add2desktop��ʾ�󴥷�
         */
        hide: function() {
            var me = this;

            if(me._options['_isShow']) {
                me.$el.css('display', 'none');
                me._options['_isShow'] = false;
                me.trigger('afterhide');
            }

            return me;
        }
        
        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    });

})( gmu, gmu.$ );

/**
 *  @file ʵ����ͨ��highlight������
 *  @name Highlight
 *  @desc �������Ч��
 *  @import zepto.js
 */
(function( $ ) {
    var $doc = $( document ),
        $el,    // ��ǰ���µ�Ԫ��
        timer;    // ���ǵ���������ʱ���ܸ����������õ���100ms��ʱ

    // �����Ƴ�className.
    function dismiss() {
        var cls = $el.attr( 'hl-cls' );

        clearTimeout( timer );
        $el.removeClass( cls ).removeAttr( 'hl-cls' );
        $el = null;
        $doc.off( 'touchend touchmove touchcancel', dismiss );
    }

    /**
     * @name highlight
     * @desc ���õ�ϵͳ�ĸ���������ָ�ƶ���Ԫ����ʱ���ָ��class����ָ�ƿ�ʱ���Ƴ���class.
     * ��������className�ǣ��˲���������¼��󶨡�
     * 
     * �˷���֧�ִ���selector, �˷�ʽ���õ��¼���������dom����ء�
     * @grammar  highlight(className, selector )   ?6?0 self
     * @grammar  highlight(className )   ?6?0 self
     * @grammar  highlight()   ?6?0 self
     * @example var div = $('div');
     * div.highlight('div-hover');
     *
     * $('a').highlight();// ������a���Դ��ĸ���Ч��ȥ����
     */
    $.fn.highlight = function( className, selector ) {
        return this;
        return this.each(function() {
            var $this = $( this );

            $this.css( '-webkit-tap-highlight-color', 'rgba(255,255,255,0)' )
                    .off( 'touchstart.hl' );

            className && $this.on( 'touchstart.hl', function( e ) {
                var match;

                $el = selector ? (match = $( e.target ).closest( selector,
                        this )) && match.length && match : $this;

                // selctor�����Ҳ���Ԫ�ء�
                if ( $el && $el.addClass ) {
                    $el.attr( 'hl-cls', className );
                    timer = setTimeout( function() {
                        $el && $el.addClass && $el.addClass( className );
                    }, 100 );
                    $doc.on( 'touchend touchmove touchcancel', dismiss );
                }
            } );
        });
    };
})( Zepto );

/**
 * @file Button�����
 * @module GMU
 * @import core/widget.js, extend/highlight.js
 * @importCss icons.css
 */
(function( gmu, $, undefined ) {

    /**
     * Button�����֧��icon, iconλ�����á�
     *
     * [![Live Demo](qrcode:http://gmu.baidu.com/demo/widget/button/button.html)](http://gmu.baidu.com/demo/widget/button/button.html "Live Demo")
     *
     * @class Button
     * @constructor
     * html����, ��������������domʵ����button
     * ```html
     * <a class="btn">��ť</a>
     * <span class="btn">��ť</span>
     * <button class="btn">��ť</button>
     * <input class="btn" type="button" value="��ť" />
     * <input class="btn" type="reset" value="��ť" />
     * <input class="btn" type="button" value="��ť" />
     * ```
     *
     * Javascript����
     * ```javascript
     * $( '.btn' ).button();
     * ```
     *
     * ���ϣ��֧��checkbox radio��ť����鿴[input���](#GMU:Button.input)��
     * @grammar new gmu.Button( el[, options]) => instance
     * @grammar $( el ).button([ options ]) => zepto
     */
    gmu.define( 'Button', {
        options: {

            /**
             * @property {String} [label] ��ť���֡�
             * @namespace options
             */

            /**
             * @property {String} [icon] ͼ�����ơ�ϵͳ�ṩ����ͼ�ꡣhome, delete, plus, arrow-u, arrow-d, check, gear, grid, star, arrow-r, arrow-l, minus, refresh, forward, back, alert, info, search,
             * @namespace options
             */

            /**
             * @property {String} [iconpos] ͼƬλ�á�֧�֣�left, right, top, bottom, notext.
             * @namespace options
             */
            iconpos: 'left'

            /**
             * @property {String} [state]
             * @description ���ó�ʼ״̬�����״ֵ̬Ϊ`disbaled`����ť�����ɵ����
             * @namespace options
             */

            /**
             * @property {String} [{$state}Text]
             * @description ���ö�Ӧ״̬���֣���button�����״̬ʱ����ť����ʾ��Ӧ�����֡�
             * @namespace options
             */
        },

        template: {
            icon: '<span class="ui-icon ui-icon-<%= name %>"></span>',
            text: '<span class="ui-btn-text"><%= text %></span>'
        },

        _getWrap: function( $el ) {
            return $el;
        },

        _init: function(){
            var me = this;

            me.$el = me.$el === undefined ? $('<span/>').appendTo( document.body ) : me.$el;
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $wrap = me.$wrap = me._getWrap( me.getEl() ),
                input = $wrap.is( 'input' ),
                $label = $wrap.find( '.ui-btn-text' ),
                $icon = $wrap.find( '.ui-icon' );

            // ����label
            // ����ǿ��ַ��������ʾdom��д��data-label=""
            opts.label = opts.label === undefined ? $wrap[ input ? 'val' : 'text' ]() : opts.label;
            input || opts.label === undefined || !$label.length && ($label = $( me.tpl2html( 'text', {
                text: opts.label
            } ) )).appendTo( $wrap.empty() );
            me.$label = $label.length && $label;
            opts.resetText = opts.resetText || opts.label;

            // ���������icon��dom��û�У��򴴽�
            input || opts.icon && !$icon.length && ($icon = $( me.tpl2html( 'icon', {
                name: opts.icon
            } ) )).appendTo( $wrap );
            me.$icon = $icon.length && $icon;

            $wrap.addClass( 'ui-btn ' + (opts.label && opts.icon ?
                    'ui-btn-icon-' + opts.iconpos : opts.label ?
                    'ui-btn-text-only' : 'ui-btn-icon-only') );

            opts.state && setTimeout( function(){
                me.state( opts.state );
            }, 0 );
        },

        /**
         * ���û��߻�ȡ��ť״ֵ̬��
         *
         * ��������stateΪ"disabled", �˰�ť����ɲ��ɵ��״̬��
         *
         * ```javascript
         * // ��ʼ����ʱ����Ը�diabled״̬����Text
         * var btn = $( '#btn' ).button({
         *     disabledText: '���ɵ�'
         * });
         *
         * // ��ť����ɲ��ɵ��״̬��ͬʱ����Ҳ����ˡ����ɵ㡰
         * btn.button( 'state', 'disabled' );
         *
         * // ��ԭ��ť״̬
         * // ����Ҳ��ԭ��
         * btn.button( 'state', 'reset' );
         *
         * ```
         * @method state
         * @grammar state( value ) => self
         * @grammar state() => String
         * @param  {String} [state] ״ֵ̬��
         * @return {String} ��û�д���stateֵʱ���˷�����ΪΪgetter, ���ص�ǰstateֵ��
         * @return {self} ��������stateֵʱ���˷�����ΪΪsetter, ����ʵ������������ʽ���á�
         */
        state: function( state ) {

            // getter
            if ( state === undefined ) {
                return this._state;
            }

            // setter
            var me = this,
                $wrap = me.$wrap,
                input = $wrap.is( 'input' ),
                text = me._options[ state + 'Text' ];

            me.$wrap.removeClass( 'ui-state-' + me._state )
                    .addClass( 'ui-state-' + state );

            text === undefined || (input ? $wrap : me.$label)[ input ?
                    'val' : 'text' ]( text );

            me._state !== state && me.trigger( 'statechange', state, me._state );
            me._state = state;
            return me;
        },

        /**
         * �л���ťѡ��״̬
         * @method toggle
         * @grammar toggle() => self
         * @example
         * var btn = $( '#btn' );
         *
         * btn.on( 'click', function() {
         *     btn.button( 'toggle' );
         * } );
         */
        toggle: function() {
            this.state( this._state === 'active' ? 'reset' : 'active' );
            return this;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event statechange
         * @param {Event} e gmu.Event����
         * @param {String} state ��ǰstateֵ
         * @param {String} preState ǰһ��state��ֵ
         * @description �����״̬�仯ʱ������
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ����������ٵ�ʱ�򴥷���
         */
    } );

    // dom ready
    $(function() {

        // ����̬��
        $( document.body ).highlight( 'ui-state-hover', '.ui-btn:not(.ui-state-disabled)' );
    });
})( gmu, gmu.$ );
/**
 * @file Button input���
 * @module GMU
 * @import widget/button/button.js
 */
(function( gmu, $ ) {
    var uid = 0;

    /**
     * Button input�������button֧��checkbox��radio��ʵ������
     *
     * ��:
     * ```html
     * <input type="checkbox" data-label="��ť" />
     * <input type="radio" data-label="��ť" />
     * ```
     *
     * �Ҵ��ఴť�������ʱ����Զ��л�active״̬����Ӧ��input��checkedֵҲ��仯��
     *
     * @class input
     * @namespace Button
     * @pluginfor Button
     */
    gmu.Button.register( 'input', {
        _getWrap: function( $el ) {
            var id, el, $wrap;

            // ����Ǳ�Ԫ�ء�
            if ( $el.is( 'input[type="checkbox"], input[type="radio"]' ) ) {
                el = $el.addClass( 'ui-hidden' )[ 0 ];
                (id = el.id) || (el.id = id = 'input_btn_' + uid++);
                $wrap = $( 'label[for=' + id + ']', el.form || el.ownerDocument || undefined );
                $wrap.length || ($wrap = $( '<label for="' + id + '"></label>' ).insertBefore( $el ));

                $el.prop( 'checked' ) && (this._options.state = 'active');
                return $wrap;
            }

            return $el;
        },

        toggle: function() {
            var $el = this.$el;

            if ( $el.is( 'input[type="radio"]' ) ) {
                $radios = $( "[name='" + $el.attr('name') + "']", $el[ 0 ].form
                        || $el[ 0 ].ownerDocument || undefined );

                $radios.button( 'state', 'reset' );
            }
            return this.origin.apply( this, arguments );
        },

        state: function( state ) {
            var $el = this.$el;

            // ����disabled״̬
            if ( $el.is( 'input[type="checkbox"], input[type="radio"]' ) ) {
                $el.prop( 'disabled', state === 'disabled' );
            }

            return this.origin.apply( this, arguments );
        }
    } );


    // dom ready
    $(function() {
        $( document.body ).on( 'click.button',
                'label.ui-btn:not(.ui-state-disabled)', function() {

            $( '#' + this.getAttribute( 'for' ) ).button( 'toggle' );
        });
    });
})( gmu, gmu.$ );
/**
 * @file ����zepto/touch.js, zepto��1.0���Ѳ�Ĭ�ϴ�����ļ���
 * @import zepto.js
 */
//     Zepto.js
//     (c) 2010-2012 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var touch = {},
    touchTimeout, tapTimeout, swipeTimeout,
    longTapDelay = 750, longTapTimeout

  function parentIfText(node) {
    return 'tagName' in node ? node : node.parentNode
  }

  function swipeDirection(x1, x2, y1, y2) {
    var xDelta = Math.abs(x1 - x2), yDelta = Math.abs(y1 - y2)
    return xDelta >= yDelta ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
  }

  function longTap() {
    longTapTimeout = null
    if (touch.last) {
      touch.el.trigger('longTap')
      touch = {}
    }
  }

  function cancelLongTap() {
    if (longTapTimeout) clearTimeout(longTapTimeout)
    longTapTimeout = null
  }

  function cancelAll() {
    if (touchTimeout) clearTimeout(touchTimeout)
    if (tapTimeout) clearTimeout(tapTimeout)
    if (swipeTimeout) clearTimeout(swipeTimeout)
    if (longTapTimeout) clearTimeout(longTapTimeout)
    touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
    touch = {}
  }

  $(document).ready(function(){
    var now, delta

    $(document.body)
      .bind('touchstart', function(e){
        now = Date.now()
        delta = now - (touch.last || now)
        touch.el = $(parentIfText(e.touches[0].target))
        touchTimeout && clearTimeout(touchTimeout)
        touch.x1 = e.touches[0].pageX
        touch.y1 = e.touches[0].pageY
        if (delta > 0 && delta <= 250) touch.isDoubleTap = true
        touch.last = now
        longTapTimeout = setTimeout(longTap, longTapDelay)
      })
      .bind('touchmove', function(e){
        cancelLongTap()
        touch.x2 = e.touches[0].pageX
        touch.y2 = e.touches[0].pageY
        if (Math.abs(touch.x1 - touch.x2) > 10)
          e.preventDefault()
      })
      .bind('touchend', function(e){
         cancelLongTap()

        // swipe
        if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
            (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

          swipeTimeout = setTimeout(function() {
            touch.el.trigger('swipe')
            touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
            touch = {}
          }, 0)

        // normal tap
        else if ('last' in touch)

          // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
          // ('tap' fires before 'scroll')
          tapTimeout = setTimeout(function() {

            // trigger universal 'tap' with the option to cancelTouch()
            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
            var event = $.Event('tap')
            event.cancelTouch = cancelAll
            touch.el.trigger(event)

            // trigger double tap immediately
            if (touch.isDoubleTap) {
              touch.el.trigger('doubleTap')
              touch = {}
            }

            // trigger single tap after 250ms of inactivity
            else {
              touchTimeout = setTimeout(function(){
                touchTimeout = null
                touch.el.trigger('singleTap')
                touch = {}
              }, 250)
            }

          }, 0)

      })
      .bind('touchcancel', cancelAll)

    $(window).bind('scroll', cancelAll)
  })

  ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(m){
    $.fn[m] = function(callback){ return this.bind(m, callback) }
  })
})(Zepto);

/**
 * @file �������
 * @import extend/touch.js, core/widget.js, extend/highlight.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    var monthNames = ["01��", "02��", "03��", "04��", "05��", "06��",
        "07��", "08��", "09��", "10��", "11��", "12��"],

        dayNames = ["��", "һ", "��", "��", "��", "��", "��"],
        offsetRE = /^(\+|\-)?(\d+)(M|Y)$/i,

        //��ȡ�·ݵ�����
        getDaysInMonth = function(year, month) {
            return 32 - new Date(year, month, 32).getDate();
        },

        //��ȡ�·��еĵ�һ�����������ڵĵڼ���
        getFirstDayOfMonth = function(year, month) {
            return new Date(year, month, 1).getDay();
        },

        //��ʽ�����֣����㲹��.
        formatNumber = function(val, len) {
            var num = "" + val;
            while (num.length < len) {
                num = "0" + num;
            }
            return num;
        },

        getVal = function(elem) {
            return elem.is('select, input') ? elem.val() : elem.attr('data-value');
        },

        prototype;

    /**
     * �������
     *
     * @class Calendar
     * @constructor Html����
     * ```html
     * <div id="calendar"></div>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#calendar').calendar({
     *    swipeable: true
     * });
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ��������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Calendar:options)
     * @grammar $( el ).calendar( options ) => zepto
     * @grammar new gmu.Calendar( el, options ) => instance
     */
    gmu.define( 'Calendar', {
        options: {
            /**
             * @property {Date|String} [date=null] ��ʼ�����ڣ�Ĭ�Ͻ���
             * @namespace options
             */
            date: null,
            /**
             * @property {Number} [firstDay=1] �����µ�һ�ܴ����ڼ���ʼ����������0��ʾ, ����һ��1��ʾ, �Դ�����.
             * @namespace options
             */
            firstDay: 1,
            /**
             * @property {Date|String} [maxDate=null] ���ÿ���ѡ����������
             * @namespace options
             */
            maxDate: null,
            /**
             * @property {Date|String} [minDate=null] ���ÿ���ѡ�����С����
             * @namespace options
             */
            minDate: null,
            /**
             * @property {Boolean} [swipeable=false] �����Ƿ����ͨ�����һ����������л�����
             * @namespace options
             */
            swipeable: false,
            /**
             * @property {Boolean} [monthChangeable=false] �����Ƿ����·ݿ�ѡ��
             * @namespace options
             */
            monthChangeable: false,
            /**
             * @property {Boolean} [yearChangeable=false] �����Ƿ�����ݿ�ѡ��
             * @namespace options
             */
            yearChangeable: false
        },

        _init: function() {
            this.on('ready', function(){
                var opts = this._options,
                    el = this._container || this.$el,
                    eventHandler = $.proxy(this._eventHandler, this);

                this.minDate(opts.minDate)
                    .maxDate(opts.maxDate)
                    .date(opts.date || new Date())
                    .refresh();

                el.addClass('ui-calendar')
                    .on('click', eventHandler)
                    .highlight();

                opts.swipeable && el.on('swipeLeft swipeRight', eventHandler);
            });
        },

        _create: function() {
            var $el = this.$el;

            //���û��ָ��el, �򴴽�һ����div
            if( !$el ) {
                $el = this.$el = $('<div>');
            }
            $el.appendTo(this._options['container'] || ($el.parent().length ? '' : document.body));
        },

        _eventHandler: function(e) {
            var opts = this._options,
                root = (this._container || this.$el).get(0),
                match,
                target,
                cell,
                date,
                elems;

            switch (e.type) {
                case 'swipeLeft':
                case 'swipeRight':
                    return this.switchMonthTo((e.type == 'swipeRight' ? '-' : '+') + '1M');

                case 'change':
                    elems = $('.ui-calendar-header .ui-calendar-year, ' +
                        '.ui-calendar-header .ui-calendar-month', this._el);

                    return this.switchMonthTo(getVal(elems.eq(1)), getVal(elems.eq(0)));

                default:
                    //click

                    target = e.target;

                    if ((match = $(target).closest('.ui-calendar-calendar tbody a', root)) && match.length) {

                        e.preventDefault();
                        cell = match.parent();

                        this._option('selectedDate',
                        date = new Date(cell.attr('data-year'), cell.attr('data-month'), match.text()));

                        this.trigger('select', date, $.calendar.formatDate(date), this);
                        this.refresh();
                    } else if ((match = $(target).closest('.ui-calendar-prev, .ui-calendar-next', root)) && match.length) {

                        e.preventDefault();
                        this.switchMonthTo((match.is('.ui-calendar-prev') ? '-' : '+') + '1M');
                    }
            }
        },

        /**
         * @ignore
         * @name option
         * @grammar option(key[, value]) ?6?0 instance
         * @desc ���û��ȡOption�������ҪOption��Ч��Ҫ����[Refresh](#calendar_refresh)������
         */
        _option: function(key, val) {
            var opts = this._options,
                date, minDate, maxDate;

            //�����setter
            if (val !== undefined) {

                switch (key) {
                    case 'minDate':
                    case 'maxDate':
                        opts[key] = val ? $.calendar.parseDate(val) : null;
                        break;

                    case 'selectedDate':
                        minDate = opts.minDate;
                        maxDate = opts.maxDate;
                        val = $.calendar.parseDate(val);
                        val = minDate && minDate > val ? minDate : maxDate && maxDate < val ? maxDate : val;
                        opts._selectedYear = opts._drawYear = val.getFullYear();
                        opts._selectedMonth = opts._drawMonth = val.getMonth();
                        opts._selectedDay = val.getDate();
                        break;

                    case 'date':
                        this._option('selectedDate', val);
                        opts[key] = this._option('selectedDate');
                        break;

                    default:
                        opts[key] = val;
                }

                //���Ϊtrue, ���ʾ�´�refresh��ʱ��Ҫ�ػ��������ݡ�
                opts._invalid = true;

                //�����setter��Ҫ����instance
                return this;
            }

            return key == 'selectedDate' ? new Date(opts._selectedYear, opts._selectedMonth, opts._selectedDay) : opts[key];
        },

        /**
         * �л������������·�
         * @method switchToToday
         */
        switchToToday: function() {
            var today = new Date();
            return this.switchMonthTo(today.getMonth(), today.getFullYear());
        },


        /**
         * �л��·�
         * @method switchMonthTo
         * @param {String|Number} month Ŀ���·ݣ�ֵ����Ϊ+1M, +4M, -5Y, +1Y�ȵȡ�+1M��ʾ����ʾ���µĻ�������ʾ��һ���£�+4m��ʾ��4���£�-5Y��ʾ5��ǰ
         * @param {String|Number} year Ŀ�����
         * @return {self} ���ر���
         */
        switchMonthTo: function(month, year) {
            var opts = this._options,
                minDate = this.minDate(),
                maxDate = this.maxDate(),
                offset,
                period,
                tmpDate;

            if (Object.prototype.toString.call(month) === '[object String]' && offsetRE.test(month)) {
                offset = RegExp.$1 == '-' ? -parseInt(RegExp.$2, 10) : parseInt(RegExp.$2, 10);
                period = RegExp.$3.toLowerCase();
                month = opts._drawMonth + (period == 'm' ? offset : 0);
                year = opts._drawYear + (period == 'y' ? offset : 0);
            } else {
                month = parseInt(month, 10);
                year = parseInt(year, 10);
            }

            //Date��һ�����ݴ��������������2012��13�£�������2013��1��
            tmpDate = new Date(year, month, 1);

            //������������ѡ���·�
            tmpDate = minDate && minDate > tmpDate ? minDate : maxDate && maxDate < tmpDate ? maxDate : tmpDate;

            month = tmpDate.getMonth();
            year = tmpDate.getFullYear();

            if (month != opts._drawMonth || year != opts._drawYear) {
                this.trigger('monthchange', opts._drawMonth = month, opts._drawYear = year, this);

                opts._invalid = true;
                this.refresh();
            }

            return this;
        },

        /**
         * ˢ�����������޸�option����Ҫ���ô˷���
         * @method refresh
         * @return {self} ���ر���
         */
        refresh: function() {
            var opts = this._options,
                el = this._container || this.$el,
                eventHandler = $.proxy(this._eventHandler, this);

            //�������û�б仯�޲��ػ���
            if (!opts._invalid) {
                return;
            }

            $('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a', el).highlight();
            $('.ui-calendar-header select', el).off('change', eventHandler);
            el.empty().append(this._generateHTML());
            $('.ui-calendar-calendar td:not(.ui-state-disabled), .ui-calendar-header a', el).highlight('ui-state-hover');
            $('.ui-calendar-header select', el).on('change', eventHandler);
            opts._invalid = false;
            return this;
        },

        /**
         * �������
         * @method destroy
         */
        destroy: function() {
            var el = this._container || this.$el,
                eventHandler = this._eventHandler;

            $('.ui-calendar-calendar td:not(.ui-state-disabled)', el).highlight();
            $('.ui-calendar-header select', el).off('change', eventHandler);
            el.remove();
            return this.$super('destroy');
        },

        /**
         * �ػ���
         */
        _generateHTML: function() {
            var opts = this._options,
                drawYear = opts._drawYear,
                drawMonth = opts._drawMonth,
                tempDate = new Date(),
                today = new Date(tempDate.getFullYear(), tempDate.getMonth(),
                tempDate.getDate()),

                minDate = this.minDate(),
                maxDate = this.maxDate(),
                selectedDate = this.selectedDate(),
                html = '',
                i,
                j,
                firstDay,
                day,
                leadDays,
                daysInMonth,
                rows,
                printDate;

            firstDay = (isNaN(firstDay = parseInt(opts.firstDay, 10)) ? 0 : firstDay);

            html += this._renderHead(opts, drawYear, drawMonth, minDate, maxDate) +
                '<table  class="ui-calendar-calendar"><thead><tr>';

            for (i = 0; i < 7; i++) {
                day = (i + firstDay) % 7;

                html += '<th' + ((i + firstDay + 6) % 7 >= 5 ?

                //�������ĩ�����ui-calendar-week-end��class��th
                ' class="ui-calendar-week-end"' : '') + '>' +
                    '<span>' + dayNames[day] + '</span></th>';
            }

            //���һ����϶����ʽ����
            html += '</thead></tr><tbody><tr class="ui-calendar-gap">' +
                '<td colspan="7">&#xa0;</td></tr>';

            daysInMonth = getDaysInMonth(drawYear, drawMonth);
            leadDays = (getFirstDayOfMonth(drawYear, drawMonth) - firstDay + 7) % 7;
            rows = Math.ceil((leadDays + daysInMonth) / 7);
            printDate = new Date(drawYear, drawMonth, 1 - leadDays);

            for (i = 0; i < rows; i++) {
                html += '<tr>';

                for (j = 0; j < 7; j++) {
                    html += this._renderDay(j, printDate, firstDay, drawMonth, selectedDate, today, minDate, maxDate);
                    printDate.setDate(printDate.getDate() + 1);
                }
                html += '</tr>';
            }
            html += '</tbody></table>';
            return html;
        },

        _renderHead: function(data, drawYear, drawMonth, minDate, maxDate) {
            var html = '<div class="ui-calendar-header">',

                //��һ���µ����һ��
                lpd = new Date(drawYear, drawMonth, -1),

                //��һ���µĵ�һ��
                fnd = new Date(drawYear, drawMonth + 1, 1),
                i,
                max;

            html += '<a class="ui-calendar-prev' + (minDate && minDate > lpd ?
                ' ui-state-disable' : '') + '" href="#">&lt;&lt;</a><div class="ui-calendar-title">';

            if (data.yearChangeable) {
                html += '<select class="ui-calendar-year">';

                for (i = Math.max(1970, drawYear - 10), max = i + 20; i < max; i++) {
                    html += '<option value="' + i + '" ' + (i == drawYear ?
                        'selected="selected"' : '') + '>' + i + '��</option>';
                }
                html += '</select>';
            } else {
                html += '<span class="ui-calendar-year" data-value="' + drawYear + '">' + drawYear + '��' + '</span>';
            }

            if (data.monthChangeable) {
                html += '<select class="ui-calendar-month">';

                for (i = 0; i < 12; i++) {
                    html += '<option value="' + i + '" ' + (i == drawMonth ?
                        'selected="selected"' : '') + '>' + monthNames[i] + '</option>';
                }
                html += '</select>';
            } else {
                html += '<span class="ui-calendar-month" data-value="' + drawMonth + '">' + monthNames[drawMonth] + '</span>';
            }

            html += '</div><a class="ui-calendar-next' + (maxDate && maxDate < fnd ?
                ' ui-state-disable' : '') + '" href="#">&gt;&gt;</a></div>';
            return html;
        },

        _renderDay: function(j, printDate, firstDay, drawMonth, selectedDate, today, minDate, maxDate) {

            var otherMonth = (printDate.getMonth() !== drawMonth),
                unSelectable;

            unSelectable = otherMonth || (minDate && printDate < minDate) || (maxDate && printDate > maxDate);

            return "<td class='" + ((j + firstDay + 6) % 7 >= 5 ? "ui-calendar-week-end" : "") + // �����ĩ

            (unSelectable ? " ui-calendar-unSelectable ui-state-disabled" : "") + //��ǲ��ɵ����

            (otherMonth || unSelectable ? '' : (printDate.getTime() === selectedDate.getTime() ? " ui-calendar-current-day" : "") + //��ǵ�ǰѡ��
            (printDate.getTime() === today.getTime() ? " ui-calendar-today" : "") //��ǽ���
            ) + "'" +

            (unSelectable ? "" : " data-month='" + printDate.getMonth() + "' data-year='" + printDate.getFullYear() + "'") + ">" +

            (otherMonth ? "&#xa0;" : (unSelectable ? "<span class='ui-state-default'>" + printDate.getDate() + "</span>" :
                "<a class='ui-state-default" + (printDate.getTime() === today.getTime() ? " ui-state-highlight" : "") + (printDate.getTime() === selectedDate.getTime() ? " ui-state-active" : "") +
                "' href='#'>" + printDate.getDate() + "</a>")) + "</td>";
        }
    });

    prototype = gmu.Calendar.prototype;

    //��Ӹ�ֱ�ӵ�option�޸Ľӿ�
    $.each(['maxDate', 'minDate', 'date', 'selectedDate'], function(i, name) {
        prototype[name] = function(val) {
            return this._option(name, val);
        }
    });

    //����ע��

    /**
     * ���û��ȡmaxDate�������ҪOption��Ч��Ҫ����[Refresh](#calendar_refresh)����
     * @method maxDate
     * @param {String|Date} value ������ڵ�ֵ
     * @return {self} ���ر���
     */

    /**
     * ���û��ȡminDate�������ҪOption��Ч��Ҫ����[Refresh](#calendar_refresh)����
     * @method minDate
     * @param {String|Date} value ��С���ڵ�ֵ
     * @return {self} ���ر���
     */

    /**
     * ���û��ȡ��ǰ���ڣ������ҪOption��Ч��Ҫ����[Refresh](#calendar_refresh)����
     * @method date
     * @param {String|Date} value ��ǰ����
     * @return {self} ���ر���
     */

    /**
     * ���û��ȡ��ǰѡ�е����ڣ������ҪOption��Ч��Ҫ����[Refresh](#calendar_refresh)����
     * @method selectedDate
     * @param {String|Date} value ��ǰ����
     * @return {self} ���ر���
     */


    //todo ֧�ָ��ָ�ʽ
    //���Žӿڣ�������и�ʽ�������������ⲿ����ͨ����дһ����������
    $.calendar = {

        /**
         * �����ַ��������ڸ�ʽ����Ŀǰ֧��yyyy-mm-dd��ʽ��yyyy/mm/dd��ʽ��
         * @name $.calendar.parseDate
         * @grammar $.calendar.parseDate( str ) ?6?0 Date
         */
        parseDate: function(obj) {
            var dateRE = /^(\d{4})(?:\-|\/)(\d{1,2})(?:\-|\/)(\d{1,2})$/;
            return Object.prototype.toString.call(obj) === '[object Date]' ? obj : dateRE.test(obj) ? new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10)) : null;
        },

        /**
         * ��ʽ�����ڶ���Ϊ�ַ���, �����ʽΪyyy-mm-dd
         * @name $.calendar.formatDate
         * @grammar $.calendar.formatDate( date ) ?6?0 String
         */
        formatDate: function(date) {
            return date.getFullYear() + '-' + formatNumber(date.getMonth() + 1, 2) + '-' + formatNumber(date.getDate(), 2);
        }
    }

    /**
     * @event ready
     * @param {Event} e gmu.Event����
     * @description �������ʼ����󴥷���
     */

    /**
     * @event select
     * @param {Event} e gmu.Event����
     * @param {Date} date ��ǰѡ�е�����
     * @param {String} dateStr ��ǰѡ�����ڵĸ�ʽ���ַ���
     * @param {Instance} instance ��ǰ������ʵ��
     * @description ѡ�����ڵ�ʱ�򴥷�
     */
    
    /**
     * @event monthchange
     * @param {Event} e gmu.Event����
     * @param {Date} month ��ǰ�·�
     * @param {String} year ��ǰ���
     * @param {Instance} instance ��ǰ������ʵ��
     * @description ǰ��ʵ�·ݷ����仯ʱ����
     */
    
    /**
     * @event destroy
     * @param {Event} e gmu.Event����
     * @description ��������ٵ�ʱ�򴥷�
     */
})( gmu, gmu.$ );

/**
 * @file Calendar Picker���
 * @desc Ĭ�ϵ�Calendar�����ֻ����ָ�������������������ܣ����Ԫ�صĽ��������ڴ˲��������.
 * selector���ᱻ��Ϊ�ǿɸ�ֵ���󣬵�ȷ�ϰ�ť�������ѡ�����ڻḳֵ��selector��
 * @module GMU
 * @import widget/calendar/calendar.js, extend/event.ortchange.js
 */
(function( gmu, $ ) {
    function SlideUp(div, cb) {
        var
            //������¼div��ԭʼλ�õ�
            holder = $('<span class="ui-holder"></span>'),

            //dom
            root = $('<div class="ui-slideup-wrap">' +
                '   <div class="ui-slideup">' +
                '       <div class="header">' +
                '           <span class="ok-btn">ȷ��</span>' +
                '           <span class="no-btn">ȡ��</span>' +
                '       </div>' +
                '       <div class="frame"></div>' +
                '   </div>' +
                '</div>'),
            sDiv = $('.ui-slideup', root),
            frame = $('.frame', sDiv),

            //����ֻ����refresh��close����
            obj = {

                /**
                 * ˢ��������ʾ������Ļ��ת��ʱ��ʱ����Ҫ�ⲿ����
                 */
                refresh: function( callback ){
                    root.css({
                        top: window.pageYOffset + 'px',
                        height: window.innerHeight + 'px'
                    });

                    sDiv.animate({
                        translateY: '-' + sDiv.height() + 'px',
                        translateZ: '0'
                    }, 400, 'ease-out', function () {
                        callback && callback.call(obj);
                    });

                },

                /**
                 * �ر�����
                 */
                close: function( callback ){
                    var count = SlideUp.count = SlideUp.count - 1;

                    root.off('click.slideup' + id);

                    sDiv
                        .animate({
                            translateY: '0',
                            translateZ: '0'
                        }, 200, 'ease-out', function () {
                            callback && callback();

                            //��ԭdiv��λ��
                            holder.replaceWith(div);

                            //����
                            root.remove();
                            count === 0 && $(document).off('touchmove.slideup');
                        })
                        .find('.ok-btn, .no-btn')
                        .highlight();

                    return obj;
                }
            },

            //Ϊ�˽���¼��õ�
            id = SlideUp.id = ( SlideUp.id >>> 0 ) + 1,

            //��¼��ǰ�����˶��ٴ�
            count;

        frame.append( div.replaceWith( holder ) );

        count = SlideUp.count = ( SlideUp.count >>> 0 ) + 1;

        //�������ʱ��ֻ��ע��һ��
        count === 1 && $(document).on('touchmove.slideup', function (e) {

            //����ϵͳ����
            e.preventDefault();
        });

        root
            .on('click.slideup' + id, '.ok-btn, .no-btn', function () {
                cb.call(obj, $(this).is('.ok-btn')) !== false && obj.close();
            })
            .appendTo(document.body)
            .find('.ok-btn, .no-btn')
            .highlight('ui-state-hover');

        obj.refresh();

        return obj;
    }

    /**
     * Calendar Picker���
     *
     * Ĭ�ϵ�Calendar�����ֻ����ָ�������������������ܣ����Ԫ�صĽ��������ڴ˲��������.
     * selector���ᱻ��Ϊ�ǿɸ�ֵ���󣬵�ȷ�ϰ�ť�������ѡ�����ڻḳֵ��selector��
     *
     * @class picker
     * @namespace Calendar
     * @pluginfor Calendar
     */
    gmu.Calendar.register( 'picker', {

        _create: function () {
            var el = this.$el;

            if( !el ) {
                throw new Error("��ָ������ѡ�����ĸ�ֵ����");
            }
        },

        _init: function(){
            var el = this.$el,
                opts = this._options;

            this._container = $('<div></div>');

            //����г�ʼֵ����Ѵ�ֵ��ֵ��calendar
            opts.date || (opts.date = el[el.is('select, input')?'val':'text']());

            $(window).on('ortchange', $.proxy(this._eventHandler, this));
            this.on('commit', function(e, date){
                var str = $.calendar.formatDate(date);

                el[el.is('select, input')?'val':'text'](str);
            });

            this.on('destroy', function(){
                //���ortchange�¼�
                $(window).off('ortchange', this._eventHandler);
                this._frame && this._frame.close();
            });
        },

        _eventHandler: function(e){
            if(e.type === 'ortchange') {
                this._frame && this._frame.refresh();
            }else {
                this.origin( e );
            }
        },

        /**
         * ��ʾ���
         * @method show
         * @grammar show() ?6?0 instance
         * @param {Function} [callback] ˢ��֮��Ļص�����
         * @for Calendar
         * @uses Calendar.picker
         */
        show: function(){
            var me = this,
                el;

            if( this._visible ) {
                return this;
            }

            el = this._container;

            this._visible = true;
            this.refresh();
            this._frame = SlideUp(el, function( confirm ){
                var date;
                if( confirm) {
                    date = me._option('selectedDate');
                    me.trigger('commit', date, $.calendar.formatDate(date), me);
                    me._option('date', date);
                } else {
                    me._option('selectedDate', me._option('date'));
                }
                me.hide();
                return false;
            });
            return this.trigger('show', this);
        },

        /**
         * �������
         * @method hide
         * @grammar hide() ?6?0 instance
         * @param {Function} [callback] ˢ��֮��Ļص�����
         * @for Calendar
         * @uses Calendar.picker
         */
        hide: function(){
            var me = this,
                event;

            if (!this._visible) {
                return this;
            }

            event = new gmu.Event('beforehide');
            this.trigger(event, this);

            //����ⲿ��ֹ�˴��¼�����ֹͣ����ִ��
            if(event.isDefaultPrevented()){
                return this;
            }

            this._visible = false;

            this._frame.close(function(){
                me.trigger && me.trigger('hide');
            });

            this._frame = null;

            return this;
        }

        /**
         * @event show
         * @param {Event} e gmu.Event����
         * @param {Calendar} ui widgetʵ��
         * @description �������ʾ�󴥷�
         * @for Calendar
         * @uses Calendar.picker
         */

        /**
         * @event hide
         * @param {Event} e gmu.Event����
         * @param {Calendar} ui widgetʵ��
         * @description ��������غ󴥷�
         * @for Calendar
         * @uses Calendar.picker
         */

        /**
         * @event beforehide
         * @param {Event} e gmu.Event����
         * @param {Calendar} ui widgetʵ��
         * @description �������֮ǰ����������ͨ��e.preventDefault()����ֹ
         * @for Calendar
         * @uses Calendar.picker
         */

        /**
         * @event commit
         * @param {Event} e gmu.Event����
         * @param {Date} date ѡ�е�����
         * @param {String} dateStr ѡ�е������ַ���ʽ
         * @param {Calendar} ui widgetʵ��
         * @description ��ȷ��ѡ��ĳ�����ڵ�ʱ�򴥷�
         * @for Calendar
         * @uses Calendar.picker
         */
    } );

})( gmu, gmu.$ );

/**
 * @file ���������
 * @import core/widget.js, extend/highlight.js, extend/parseTpl.js, extend/event.ortchange.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    var tpl = {
        close: '<a class="ui-dialog-close" title="�ر�"><span class="ui-icon ui-icon-delete"></span></a>',
        mask: '<div class="ui-mask"></div>',
        title: '<div class="ui-dialog-title">'+
                    '<h3><%=title%></h3>'+
                '</div>',
        wrap: '<div class="ui-dialog">'+
            '<div class="ui-dialog-content"></div>'+
            '<% if(btns){ %>'+
            '<div class="ui-dialog-btns">'+
            '<% for(var i=0, length=btns.length; i<length; i++){var item = btns[i]; %>'+
            '<a class="ui-btn ui-btn-<%=item.index%>" data-key="<%=item.key%>"><%=item.text%></a>'+
            '<% } %>'+
            '</div>'+
            '<% } %>' +
            '</div> '
    };

    /**
     * ���������
     *
     * @class Dialog
     * @constructor Html����
     * ```html
     * <div id="dialog1" title="��½��ʾ">
     *     <p>��ʹ�ðٶ��˺ŵ�¼��, ��ø�����Ի���ɫ����</p>
     * </div>
     * ```
     *
     * javascript����
     * ```javascript
     *  $('#dialog1').dialog({
     *      autoOpen: false,
     *      closeBtn: false,
     *      buttons: {
     *          'ȡ��': function(){
     *              this.close();
     *          },
     *          'ȷ��': function(){
     *              this.close();
     *              $('#dialog2').dialog('open');
     *          }
     *      }
     *  });
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ���Ի����Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Dialog:options)
     * @grammar $( el ).dialog( options ) => zepto
     * @grammar new gmu.Dialog( el, options ) => instance
     */
    gmu.define( 'Dialog', {
        options: {
            /**
             * @property {Boolean} [autoOpen=true] ��ʼ�����Ƿ��Զ�����
             * @namespace options
             */
            autoOpen: true,
            /**
             * @property {Array} [buttons=null] �������ϵİ�ť
             * @namespace options
             */
            buttons: null,
            /**
             * @property {Boolean} [closeBtn=true] �Ƿ���ʾ�رհ�ť
             * @namespace options
             */
            closeBtn: true,
            /**
             * @property {Boolean} [mask=true] �Ƿ������ֲ�
             * @namespace options
             */
            mask: true,
            /**
             * @property {Number} [width=300] ��������
             * @namespace options
             */
            width: 300,
            /**
             * @property {Number|String} [height='auto'] ������߶�
             * @namespace options
             */
            height: 'auto',
            /**
             * @property {String} [title=null] ���������
             * @namespace options
             */
            title: null,
            /**
             * @property {String} [content=null] ����������
             * @namespace options
             */
            content: null,
            /**
             * @property {Boolean} [scrollMove=true] �Ƿ���õ�scroll���ڵ�����ʱ��
             * @namespace options
             */
            scrollMove: true,
            /**
             * @property {Element} [container=null] ����������
             * @namespace options
             */
            container: null,
            /**
             * @property {Function} [maskClick=null] �������ϵ��ʱ�������¼�
             * @namespace options
             */
            maskClick: null,
            position: null //��Ҫdialog.position���������
        },

        /**
         * ��ȡ�����Ľڵ�
         * @method getWrap
         * @return {Element} �����Ľڵ�
         */
        getWrap: function(){
            return this._options._wrap;
        },

        _init: function(){
            var me = this, opts = me._options, btns,
                i= 0, eventHanlder = $.proxy(me._eventHandler, me), vars = {};

            me.on( 'ready', function() {
                opts._container = $(opts.container || document.body);
                (opts._cIsBody = opts._container.is('body')) || opts._container.addClass('ui-dialog-container');
                vars.btns = btns= [];
                opts.buttons && $.each(opts.buttons, function(key){
                    btns.push({
                        index: ++i,
                        text: key,
                        key: key
                    });
                });
                opts._mask = opts.mask ? $(tpl.mask).appendTo(opts._container) : null;
                opts._wrap = $($.parseTpl(tpl.wrap, vars)).appendTo(opts._container);
                opts._content = $('.ui-dialog-content', opts._wrap);

                opts._title = $(tpl.title);
                opts._close = opts.closeBtn && $(tpl.close).highlight('ui-dialog-close-hover');
                me.$el = me.$el || opts._content;//�������Ҫ֧��renderģʽ���˾�Ҫɾ��

                me.title(opts.title);
                me.content(opts.content);

                btns.length && $('.ui-dialog-btns .ui-btn', opts._wrap).highlight('ui-state-hover');
                opts._wrap.css({
                    width: opts.width,
                    height: opts.height
                });

                //bind events���¼�
                $(window).on('ortchange', eventHanlder);
                opts._wrap.on('click', eventHanlder);
                opts._mask && opts._mask.on('click', eventHanlder);
                opts.autoOpen && me.open();
            } );
        },

        _create: function(){
            var opts = this._options;

            if( this._options.setup ){
                opts.content = opts.content || this.$el.show();
                opts.title = opts.title || this.$el.attr('title');
            }
        },

        _eventHandler: function(e){
            var me = this, match, wrap, opts = me._options, fn;
            switch(e.type){
                case 'ortchange':
                    this.refresh();
                    break;
                case 'touchmove':
                    opts.scrollMove && e.preventDefault();
                    break;
                case 'click':
                    if(opts._mask && ($.contains(opts._mask[0], e.target) || opts._mask[0] === e.target )){
                        return me.trigger('maskClick');
                    }
                    wrap = opts._wrap.get(0);
                    if( (match = $(e.target).closest('.ui-dialog-close', wrap)) && match.length ){
                        me.close();
                    } else if( (match = $(e.target).closest('.ui-dialog-btns .ui-btn', wrap)) && match.length ) {
                        fn = opts.buttons[match.attr('data-key')];
                        fn && fn.apply(me, arguments);
                    }
            }
        },

        _calculate: function(){
            var me = this, opts = me._options, size, $win, root = document.body,
                ret = {}, isBody = opts._cIsBody, round = Math.round;

            opts.mask && (ret.mask = isBody ? {
                width:  '100%',
                height: Math.max(root.scrollHeight, root.clientHeight)-1//����1�Ļ�uc���������ת��ʱ�򲻴���resize.���⣡
            }:{
                width: '100%',
                height: '100%'
            });

            size = opts._wrap.offset();
            $win = $(window);
            ret.wrap = {
                left: '50%',
                marginLeft: -round(size.width/2) +'px',
                top: isBody?round($win.height() / 2) + window.pageYOffset:'50%',
                marginTop: -round(size.height/2) +'px'
            }
            return ret;
        },

        /**
         * �������µ�����λ�ú�mask��С���縸������С�����仯ʱ�����ܵ�����λ�ò��ԣ������ⲿ����refresh��������
         * @method refresh
         * @return {self} ���ر���
         */
        refresh: function(){
            var me = this, opts = me._options, ret, action;
            if(opts._isOpen) {

                action = function(){
                    ret = me._calculate();
                    ret.mask && opts._mask.css(ret.mask);
                    opts._wrap.css(ret.wrap);
                }

                //����м����ڣ���Ҫ�����ʱ
                if( $.os.ios &&
                    document.activeElement &&
                    /input|textarea|select/i.test(document.activeElement.tagName)){

                    document.body.scrollLeft = 0;
                    setTimeout(action, 200);//do it later in 200ms.

                } else {
                    action();//do it now
                }
            }
            return me;
        },

        /**
         * �������������������λ�ã��ڲ�����ֵת��[position](widget/dialog.js#position)������
         * @method open
         * @param {String|Number} [x] X��λ��
         * @param {String|Number} [y] Y��λ��
         * @return {self} ���ر���
         */
        open: function(x, y){
            var opts = this._options;
            opts._isOpen = true;

            opts._wrap.css('display', 'block');
            opts._mask && opts._mask.css('display', 'block');

            x !== undefined && this.position ? this.position(x, y) : this.refresh();

            $(document).on('touchmove', $.proxy(this._eventHandler, this));
            return this.trigger('open');
        },

        /**
         * �رյ�����
         * @method close
         * @return {self} ���ر���
         */
        close: function(){
            var eventData, opts = this._options;

            eventData = $.Event('beforeClose');
            this.trigger(eventData);
            if(eventData.defaultPrevented)return this;

            opts._isOpen = false;
            opts._wrap.css('display', 'none');
            opts._mask && opts._mask.css('display', 'none');

            $(document).off('touchmove', this._eventHandler);
            return this.trigger('close');
        },

        /**
         * ���û��߻�ȡ��������⡣value���ܴ�html��ǩ�ַ���
         * @method title
         * @param {String} [value] ���������
         * @return {self} ���ر���
         */
        title: function(value) {
            var opts = this._options, setter = value !== undefined;
            if(setter){
                value = (opts.title = value) ? '<h3>'+value+'</h3>' : value;
                opts._title.html(value)[value?'prependTo':'remove'](opts._wrap);
                opts._close && opts._close.prependTo(opts.title? opts._title : opts._wrap);
            }
            return setter ? this : opts.title;
        },

        /**
         * ���û��߻�ȡ���������ݡ�value���ܴ�html��ǩ�ַ�����zepto����
         * @method content
         * @param {String|Element} [val] ����������
         * @return {self} ���ر���
         */
        content: function(val) {
            var opts = this._options, setter = val!==undefined;
            setter && opts._content.empty().append(opts.content = val);
            return setter ? this: opts.content;
        },

        /**
         * @desc ���������
         * @name destroy
         */
        destroy: function(){
            var opts = this._options, _eventHander = this._eventHandler;
            $(window).off('ortchange', _eventHander);
            $(document).off('touchmove', _eventHander);
            opts._wrap.off('click', _eventHander).remove();
            opts._mask && opts._mask.off('click', _eventHander).remove();
            opts._close && opts._close.highlight();
            return this.$super('destroy');
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event open
         * @param {Event} e gmu.Event����
         * @description �������򵯳��󴥷�
         */

        /**
         * @event beforeClose
         * @param {Event} e gmu.Event����
         * @description �ڵ�����ر�֮ǰ����������ͨ��e.preventDefault()����ֹ
         */

        /**
         * @event close
         * @param {Event} e gmu.Event����
         * @description �ڵ�����ر�֮�󴥷�
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    });
})( gmu, gmu.$ );

/**
 * @file �޸�Zepto��offset setter bug
 * ���� ����λԪ��������������ʱ���ᶨλ����ȷ
 * 1. ����λԪ�ز��ǵ�һ���ڵ㣬��prev�ֵܽڵ����з�absolute����fixed��λ��Ԫ��
 * 2. ����λԪ��Ϊ��absolute����fixed��λ��
 * issue: https://github.com/gmuteam/GMU/issues/101
 * @import zepto.js
 * @module GMU
 */

(function( $ ) {
    var _offset = $.fn.offset,
        round = Math.round;

    // zepto��offset bug����Ҫ�����ǵ�position:relative��ʱ��û�п���Ԫ�صĳ�ʼֵ��
    // ��ʼֵ����ָpositon:relative; top: 0; left: 0; bottom:0; right:0; ��ʱ��
    // ��Ԫ�ص�λ�ã�zepto�е�offset�Ǽٶ������ֵ����{left:0, top: 0}; ʵ����ǰ�����ֵ�
    // �ڵ��Ҳ�Ϊpostion: absolute|fixed ��λʱʱ����Ԫ�صĳ�ʼλ�ò�����{left:0, top: 0}
    // �����ǰ���ֵܽڵ�����ݴ�С����һ����
    function setter( coord ) {
        return this.each(function( idx ) {
            var $el = $( this ),
                coords = $.isFunction( coord ) ? coord.call( this, idx,
                    $el.offset() ) : coord,

                position = $el.css( 'position' ),

                // positionΪabsolute����fixed��λ��Ԫ�أ���Ԫ�صĳ�ʼλ��û�й�ϵ
                // ���Բ���Ҫȡ��ʼλ��
                pos = position === 'absolute' || position === 'fixed' ||
                    $el.position();

            // �����positionΪrelative, �Ҵ��� top, right, bottom, leftֵ
            // positionֵ�����ܴ����ʼֵ����Ҫ��ԭһ��
            // ���� top: 1px, ��Ҫ��positionȡ�õ�ֵ��ȥ1px���Ǹ�Ԫ�صĳ�ʼλ��
            // ���������top:auto, bottom: 1px; ����Ҫ��1px, ��������Ĵ���Ҫ���Ը�-1
            if ( position === 'relative' ) {
                pos.top -= parseFloat( $el.css( 'top' ) ) ||
                        parseFloat( $el.css( 'bottom' ) ) * -1 || 0;
                pos.left -= parseFloat( $el.css( 'left' ) ) ||
                        parseFloat( $el.css( 'right' ) ) * -1 || 0;
            }

            parentOffset = $el.offsetParent().offset(),

            // ����������chrome�����offset���õ�top,left�������ͣ��ᵼ��popOver��arrow��ʽ�����⡣
            props = {
              top:  round( coords.top - (pos.top || 0)  - parentOffset.top ),
              left: round( coords.left - (pos.left || 0) - parentOffset.left )
            }

            if ( position == 'static' ){
                props['position'] = 'relative';
            }

            // ���Կ��Ǹ���animate������
            if ( coords.using ) {
                coords.using.call( this, props, idx );
            } else {
                $el.css( props );
            }
        });
    }

    $.fn.offset = function( corrd ) {
        return corrd ? setter.call( this, corrd ): _offset.call( this );
    }
})( Zepto );
/**
 * @file ����Zepto��λ�����û�ȡ���
 * @import zepto.js, extend/offset.js
 * @module GMU
 */

(function ($, undefined) {
    var _position = $.fn.position,
        round = Math.round,
        rhorizontal = /^(left|center|right)([\+\-]\d+%?)?$/,
        rvertical = /^(top|center|bottom)([\+\-]\d+%?)?$/,
        rpercent = /%$/;

    function str2int( persent, totol ) {
        return (parseInt( persent, 10 ) || 0) * (rpercent.test( persent ) ?
                totol / 100 : 1);
    }

    function getOffsets( pos, offset, width, height ) {
        return [
            pos[ 0 ] === 'right' ? width : pos[ 0 ] === 'center' ?
                    width / 2 : 0,

            pos[ 1 ] === 'bottom' ? height : pos[ 1 ] === 'center' ?
                    height / 2 : 0,

            str2int( offset[ 0 ], width ),

            str2int( offset[ 1 ], height )
        ];
    }

    function getDimensions( elem ) {
        var raw = elem[ 0 ],
            isEvent = raw.preventDefault;

        raw = raw.touches && raw.touches[ 0 ] || raw;

        // ���⴦��document, window��event����
        if ( raw.nodeType === 9 || raw === window || isEvent ) {
            return {
                width: isEvent ? 0 : elem.width(),
                height: isEvent ? 0 : elem.height(),
                top: raw.pageYOffset || raw.pageY ||  0,
                left: raw.pageXOffset || raw.pageX || 0
            };
        }

        return elem.offset();
    }

    function getWithinInfo( el ) {
        var $el = $( el = (el || window) ),
            dim = getDimensions( $el );

        el = $el[ 0 ];

        return {
            $el: $el,
            width: dim.width,
            height: dim.height,
            scrollLeft: el.pageXOffset || el.scrollLeft,
            scrollTop: el.pageYOffset || el.scrollTop
        };
    }

    // ����������
    function filterOpts( opts, offsets ) {
        [ 'my', 'at' ].forEach(function( key ) {
            var pos = ( opts[ key ] || '' ).split( ' ' ),
                opt = opts[ key ] = [ 'center', 'center' ],
                offset = offsets[ key ] = [ 0, 0 ];

            pos.length === 1 && pos[ rvertical.test( pos[ 0 ] ) ? 'unshift' :
                    'push' ]( 'center' );

            rhorizontal.test( pos[ 0 ] ) && (opt[ 0 ] = RegExp.$1) &&
                    (offset[ 0 ] = RegExp.$2);

            rvertical.test( pos[ 1 ] ) && (opt[ 1 ] = RegExp.$1) &&
                    (offset[ 1 ] = RegExp.$2);
        });
    }

    /**
     * ��ȡԪ���������Ը���Ԫ�أ��������ΪpositionΪrelative��abosolute��fixed��Ԫ�أ�������λ�á�
     * @method $.fn.position
     * @grammar position()  ?6?0 array
     * @grammar position(opts)  ?6?0 self
     * @param {String} [my=center] �������ĵ㡣����Ϊ'left top', 'center bottom', 'right center'...ͬʱ����������ƫ�������� 'left+5 center-20%'
     * @param {String} [at=center] ���ö�λ��Ŀ��Ԫ�ص�ʲôλ�á�������ʽͬmy����һ��
     * @param {Object} [of=null] ����Ŀ��Ԫ��
     * @param {Function} [collision=null] ��ײ���ص�����
     * @param {Object} [within=window] ��ײ������
     * @example
     * var position = $('#target').position();
     * $('#target').position({
     *                          my: 'center',
     *                          at: 'center',
     *                          of: document.body
     *                      });
     */
    $.fn.position = function ( opts ) {
        if ( !opts || !opts.of ) {
            return _position.call( this );
        }

        opts = $.extend( {}, opts );

        var target = $( opts.of ),
            collision = opts.collision,
            within = collision && getWithinInfo( opts.within ),
            ofses = {},
            dim = getDimensions( target ),
            bPos = {
                left: dim.left,
                top: dim.top
            },
            atOfs;

        target[ 0 ].preventDefault && (opts.at = 'left top');
        filterOpts( opts, ofses );    // ����������

        atOfs = getOffsets( opts.at, ofses.at, dim.width, dim.height );
        bPos.left += atOfs[ 0 ] + atOfs[ 2 ];
        bPos.top += atOfs[ 1 ] + atOfs[ 3 ];

        return this.each(function() {
            var $el = $( this ),
                ofs = $el.offset(),
                pos = $.extend( {}, bPos ),
                myOfs = getOffsets( opts.my, ofses.my, ofs.width, ofs.height );

            pos.left = round( pos.left + myOfs[ 2 ] - myOfs[ 0 ] );
            pos.top = round( pos.top + myOfs[ 3 ] - myOfs[ 1 ] );

            collision && collision.call( this, pos, {
                of: dim,
                offset: ofs,
                my: opts.my,
                at: opts.at,
                within: within,
                $el : $el
            } );

            pos.using = opts.using;
            $el.offset( pos );
        });
    }
})( Zepto );
/**
 * @file Dialog �� ���������
 * @module GMU
 * @import widget/dialog/dialog.js, extend/position.js
 */
(function( gmu, $, undefined ) {
    /**
     * @name dialog.position
     * @desc ��zepto.position����λdialog
     */
    /**
     * ��zepto.position����λdialog
     *
     * @class position
     * @namespace Dialog
     * @pluginfor Dialog
     */
    gmu.Dialog.register( 'position', {

        _init: function(){
            var opts = this._options;

            opts.position = opts.position || {of: opts.container || window, at: 'center', my: 'center'};
        },

        /**
         * �������õ������λ�ã�������������ã����Ĭ��Ϊ�������Ҿ��ж��롣λ�ò������ܣ���ֵ���ٷֱȣ�����λ����ֵ������'center'��
         * ��: 100�� 100px, 100em, 10%, center;��ʱ��֧�� left, right, top, bottom.
         * @method position
         * @param {String|Number} [x] X��λ��
         * @param {String|Number} [y] Y��λ��
         * @for Dialog
         * @uses Dialog.position
         * @return {self} ���ر���
         */
        position: function(x, y){
            var opts = this._options;
            if(!$.isPlainObject(x)){//�����ϸ�ʽ��
                opts.position.at = 'left'+(x>0?'+'+x: x)+' top'+(y>0?'+'+y: y);
            } else $.extend(opts.position, x);
            return this.refresh();
        },

        _calculate:function () {
            var me = this,
                opts = me._options,
                position = opts.position,
                ret = me.origin();

            opts._wrap.position($.extend(position, {
                using: function(position){
                    ret.wrap = position;
                }
            }));

            return ret;
        }
    } );
})( gmu, gmu.$);

/**
 * @file ���������, �����汾��
 * @import core/widget.js
 * @module GMU
 */
(function( gmu, $, undefined ) {

    /**
     * ��������������е����ť����Χ������Ľ���Ч�������ڵ��������ݣ�����ͨ��`content`ֱ���������ݣ�
     * Ҳ����ͨ��`container`���������ڵ㡣��ť�͵�����֮��û��λ��������
     *
     * �����汾ֻ�м򵥵ĵ����ʾ���ٵ�����ع��ܡ����ø���Ĺ�����ο�[�������](#GMU:Popover:plugins)����.
     *
     * @class Popover
     * @constructor Html����
     * ```html
     * <a id="btn">��ť<a/>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#btn').popover({
     *     content: 'Hello world'
     * });
     * ```
     * @param {dom | zepto | selector} [el] ��ť�ڵ�
     * @param {Object} [options] �����������������鿴[Options](#GMU:Popover:options)
     * @grammar $( el ).popover( options ) => zepto
     * @grammar new gmu.Popover( el, options ) => instance
     */
    gmu.define( 'Popover', {

        // Ĭ�������
        options: {

            /**
             * @property {Zepto | Selector} [container] ָ����������������룬�������el�ĺ����Զ�����һ����
             * @namespace options
             */
            container: null,

            /**
             * @property {String | Zepto | Selector } [content] ����������ݡ�
             * @namespace options
             */
            content: null,

            /**
             * @property {String} [event="click"] �����¼���, ����������ó�tap��
             * @namespace options
             */
            event: 'click'
        },

        template: {
            frame: '<div>'
        },

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        // ����dom�Ĵ�����
        _create: function() {
            var me = this,
                opts = me._options,
                $el = opts.target && $( opts.target ) || me.getEl(),
                $root = opts.container && $( opts.container );

            // û�� ���� ���㴫����ѡ����������û���ҵ��ڵ㣬���ǵô���һ����
            $root && $root.length || ($root = $( me.tpl2html( 'frame' ) )
                    .addClass( 'ui-mark-temp' ));
            me.$root = $root;

            // ���������content, ����Ϊ���ݲ��뵽container��
            opts.content && me.setContent( opts.content );
            me.trigger( 'done.dom', $root.addClass( 'ui-' + me.widgetName ),
                    opts );

            // ����ڵ��Ƕ�̬�����ģ������ĵ����У��Ͱѽڵ���뵽$el���档
            $root.parent().length || $el.after( $root );

            me.target( $el );
        },

        // ɾ�����Ϊ�����ʱ��dom
        _checkTemp: function( $el ) {
            $el.is( '.ui-mark-temp' ) && $el.off( this.eventNs ) &&
                    $el.remove();
        },

        /**
         * @event beforeshow
         * @param {Event} e gmu.Event����
         * @description �������������ʾʱ����������ͨ��`e.preventDefault()`����ֹ��
         */


        /**
         * @event show
         * @param {Event} e gmu.Event����
         * @description ����������ʾ�󴥷���
         */


        /**
         * ��ʾ�����㡣
         * @method show
         * @chainable
         * @return {self} ���ر���
         */
        show: function() {
            var me = this,
                evt = gmu.Event( 'beforeshow' );

            me.trigger( evt );

            // ����ⲿ��ֹ�˹رգ���ʲôҲ������
            if ( evt.isDefaultPrevented() ) {
                return;
            }

            me.trigger( 'placement', me.$root.addClass( 'ui-in' ), me.$target );
            me._visible = true;
            return me.trigger( 'show' );
        },

        /**
         * @event beforehide
         * @param {Event} e gmu.Event����
         * @description ���������������ʱ����������ͨ��`e.preventDefault()`����ֹ��
         */


        /**
         * @event hide
         * @param {Event} e gmu.Event����
         * @description �����������غ󴥷���
         */

        /**
         * ���ص����㡣
         * @method hide
         * @chainable
         * @return {self} ���ر���
         */
        hide: function() {
            var me = this,
                evt = new gmu.Event( 'beforehide' );

            me.trigger( evt );

            // ����ⲿ��ֹ�˹رգ���ʲôҲ������
            if ( evt.isDefaultPrevented() ) {
                return;
            }

            me.$root.removeClass( 'ui-in' );
            me._visible = false;
            return me.trigger( 'hide' );
        },

        /**
         * �л����������ʾ�����ء�
         * @method toggle
         * @chainable
         * @return {self} ���ر���
         */
        toggle: function() {
            var me = this;
            return me[ me._visible ? 'hide' : 'show' ].apply( me, arguments );
        },

        /**
         * ���û��߻�ȡ��ǰ`��ť`(������Ķ���)��
         * @method target
         * @param {dom | selector | zepto} [el] target��ֵ��
         * @chainable
         * @return {self} ��������elʱ���˷���Ϊsetter, ����ֵΪself.
         * @return {dom} ��û�д���elʱ��Ϊgetter, ���ص�ǰtargetֵ��
         */
        target: function( el ) {

            // getter
            if ( el === undefined ) {
                return this.$target;
            }

            // setter
            var me = this,
                $el = $( el ),
                orig = me.$target,
                click = me._options.event + me.eventNs;

            orig && orig.off( click );

            // ���¼�
            me.$target = $el.on( click, function( e ) {
                e.preventDefault();
                me.toggle();
            } );

            return me;
        },

        /**
         * ���õ�ǰ�������ݡ�
         * @method setContent
         * @param {dom | selector | zepto} [value] ��������
         * @chainable
         * @return {self} �������
         */
        setContent: function( val ) {
            var container = this.$root;
            container.empty().append( val );
            return this;
        },

        /**
         * ��������������¼����ٺ�ɾ���Զ�������dom.
         * @method destroy
         * @chainable
         * @return {self} �������
         */
        destroy: function() {
            var me = this;

            me.$target.off( me.eventNs );
            me._checkTemp( me.$root );
            return me.$super( 'destroy' );
        }
    } );
})( gmu, gmu.$ );
/**
 * @file �����������
 * @import core/widget.js, widget/popover/popover.js, extend/highlight.js
 * @module GMU
 */
(function( gmu, $ ) {

    /**
     * �����������
     *
     * @class Dropmenu
     * @constructor Html����
     * ```html
     * <a id="btn1" class="btn">Dropmenu</a>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#btn1').dropmenu({
     *  content: [
     *      
     *      'Action',
     *  
     *      'Another Action',
     *  
     *      'Someone else here',
     *  
     *      'divider',
     *  
     *      {
     *          text: 'Open Baidu',
     *          icon: 'grid',
     *          href: 'http://www.baidu.com'
     *      },
     *  ]
     * })
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ�������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Dropmenu:options)
     * @grammar $( el ).dropmenu( options ) => zepto
     * @grammar new gmu.Dropmenu( el, options ) => instance
     */
    gmu.define( 'Dropmenu', {
        options: {

            // ע��: ��ǰ�ǽ�items, Ϊ�����������ͳһ�����Ը�����content
            /**
             * @property {Array} [content=null] ���������ݣ�ÿ����¼Ϊһ��Object�������� {text:'', icon: '', href:'' }
             * @namespace options
             */
            content: null
        },

        template: {

            item: '<li><a <% if ( href ) { %>href="<%= href %>"<% } %>>' +
                    '<% if ( icon ) { %><span class="ui-icon ui-icon-' +
                    '<%= icon %>"></span><% } %><%= text %></a></li>',

            divider: '<li class="divider"></li>',

            wrap: '<ul>'
        },

        _init: function() {
            var me = this;

            // �洢ul
            me.on( 'done.dom', function( e, $root ) {
                me.$list = $root.find( 'ul' ).first()
                        .addClass( 'ui-dropmenu-items' )
                        .highlight( 'ui-state-hover',
                                '.ui-dropmenu-items>li:not(.divider)' );
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options,
                content = '';

            // ����opts.content����ul>li
            if ( $.type( opts.content ) === 'array' ) {
                
                opts.content.forEach(function( item ) {
                    
                    item = $.extend( {
                        href: '',
                        icon: '',
                        text: ''
                    }, typeof item === 'string' ? {
                        text: item
                    } : item );

                    content += me.tpl2html( item.text === 'divider' ?
                            'divider' : 'item', item );
                });
                opts.content = $( me.tpl2html( 'wrap' ) ).append( content );
            }

            me.$super( '_create' );
            me.$list.on( 'click' + me.eventNs, '.ui-dropmenu-items>li:not(' +
                    '.ui-state-disable):not(.divider)', function( e ) {

                var evt = gmu.Event( 'itemclick', e );
                me.trigger( evt, this );

                if ( evt.isDefaultPrevented() ) {
                    return;
                }
                
                me.hide();
            } );
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event itemclick
         * @param {Event} e gmu.Event����
         * @param {Element} item ��ǰ�������Ŀ
         * @description ĳ����Ŀ�����ʱ����
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    }, gmu.Popover );

})( gmu, gmu.$ );
/**
 * @file Dropmenu ֧��ˮƽ���в��
 * @module GMU
 * @import widget/dropmenu/dropmenu.js
 */
(function( gmu ) {

    gmu.Dropmenu.options.horizontal = true;

    /**
     * Dropmenu ֧��ˮƽ���в��
     *
     * @class horizontal
     * @namespace Dropmenu
     * @pluginfor Dropmenu
     */
    gmu.Dropmenu.option( 'horizontal', true, function() {
        var me = this;

        me.on( 'done.dom', function( e, $root ) {
            $root.addClass( 'ui-horizontal' );
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file Dropmenu �򵥰涨λ
 * @module GMU
 * @import widget/dropmenu/dropmenu.js, extend/offset.js
 */
(function( gmu, $ ) {

    // ����Ĭ��Options
    $.extend( gmu.Dropmenu.options, {
        /**
         * @property {String} [placement='bottom'] Ĭ���������·���ʾ
         * @namespace options
         * @for Dropmenu
         * @uses Dropmenu.placement
         */
        placement: 'bottom',

        /**
         * @property {String} [align='center'] Ĭ�Ͼ��ж���
         * @namespace options
         * @for Dropmenu
         * @uses Dropmenu.placement
         */
        align: 'center',

        /**
         * @property {Object} [offset=null] ƫ����
         * @namespace options
         * @for Dropmenu
         * @uses Dropmenu.placement
         */
        offset: null
    } );

    /**
     * Dropmenu �򵥰涨λ
     *
     * @class placement
     * @namespace Dropmenu
     * @pluginfor Dropmenu
     */
    gmu.Dropmenu.option( 'placement', function( val ) {
        return ~[ 'top', 'bottom' ].indexOf( val );
    }, function() {
        var config = {
                'top_center': 'center top center bottom',
                'top_left': 'left top left bottom',
                'top_right': 'right top right bottom',
                'bottom_center': 'center bottom center top',
                'bottom_right': 'right bottom right top',
                'bottom_left': 'left bottom left top'
            },
            presets = {},    // ֧�ֵĶ�λ��ʽ��

            info;

        $.each( config, function( preset, args ) {
            args = args.split( /\s/g );
            args.unshift( preset );
            presets[ preset ] = function() {
                return placement.apply( null, args );
            };
        } );

        function getPos( pos, len ) {
            return pos === 'right' || pos === 'bottom' ? len :
                        pos === 'center' ? len / 2 : 0;
        }

        // ��ʱ�ü򵥵ķ�ʽʵ�֣��Ժ��ǲ���position.js
        function placement( preset, atH, atV, myH, myV ) {
            var of = info.of,
                coord = info.coord,
                offset = info.offset,
                top = of.top,
                left = of.left;

            left += getPos( atH, of.width ) - getPos( myH, coord.width );
            top += getPos( atV, of.height ) - getPos( myV, coord.height );

            // offset������fn
            offset = typeof offset === 'function' ? offset.call( null, {
                left: left,
                top: top
            }, preset ) : offset || {};

            return {
                left: left + (offset.left || 0),
                top: top + (offset.top || 0)
            };
        }

        this.on( 'placement', function( e, $el, $of ) {
            var me = this,
                opts = me._options,
                placement = opts.placement,
                align = opts.align,
                coord;

            info = {
                coord: $el.offset(),
                of: $of.offset(),
                placement: placement,
                align: align,
                $el: $el,
                $of: $of,
                offset: opts.offset
            };

            // ���ó�ʼֵ
            coord = presets[ placement + '_' + align ]();

            // �ṩ����������֮ǰ�޸�λ��
            me.trigger( 'before.placement', coord, info, presets );
            
            if ( /^(\w+)_(\w+)$/.test( info.preset ) ) {
                info.placement = RegExp.$1;
                info.align = RegExp.$2;
            }

            $el.offset( coord );

            // �ṩ��arrowλ�ö�λ��
            me.trigger( 'after.placement', coord, info );
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file ���ض������
 * @import core/widget.js, extend/fix.js, extend/throttle.js, extend/event.scrollStop.js, extend/event.ortchange.js
 * @module GMU
 */
(function( gmu, $, undefined ) {

    /**
     * ���ض������
     *
     * @class Gotop
     * @constructor Html����
     * ```html
     * <div id="gotop"></div>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#gotop').gotop();
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ�������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Gotop:options)
     * @grammar $( el ).gotop( options ) => zepto
     * @grammar new gmu.Gotop( el, options ) => instance
     */
    gmu.define( 'Gotop', {
        options: {
            /**
             * @property {selector} [container=document.body] �������
             * @namespace options
             */
            container:          '',
            /**
             * @property {Boolean} [useFix=true] �Ƿ�ʹ�ù̶�Ч��
             * @namespace options
             */
            useFix:             true,
            /**
             * @property {Boolean} [useHide=true] �Ƿ���touchmove��ʱ������gotopͼ��
             * @namespace options
             */
            useHide:            true,
            /**
             * @property {Boolean} [useAnimation=false] ���ض���ʱ�Ƿ�ʹ�ö���,��ʹ��iScrollʱ,���ض����Ķ�����iScrollʵ��ִ��,�˲�����Ч
             * @namespace options
             */
            useAnimation:       false,
            /**
             * @property {Object} [position={bottom:10,right:10}] ʹ��fixЧ��ʱ��Ҫ�õ�λ�ò���
             * @namespace options
             */
            position:           {bottom: 10, right: 10},
            /**
             * @property {Function} [afterScroll=null] ���ض�����ִ�еĻص�����
             * @namespace options
             */
        	afterScroll:        null
        },

        _init: function() {
            var me = this,
                $el,
                _opts = me._options,
                _eventHandler;

            if($.os.version && $.os.version.substr(0, 3) >= 7.0) {
                _opts.position.bottom = 40;
            }

            me.on( 'ready', function(){
                $el = me.$el;
                _eventHandler = $.proxy(me._eventHandler, me);

                _opts['useHide'] && $(document).on('touchmove', _eventHandler);
                $(window).on('touchend touchcancel scrollStop', _eventHandler);
                $(window).on('scroll ortchange', _eventHandler);
                $el.on('click', _eventHandler);
                me.on('destroy', function() {
                    $(window).off('touchend touchcancel scrollStop', _eventHandler);
                    $(document).off('touchmove', _eventHandler);
                    $(window).off('scroll ortchange', _eventHandler);
                });
                _opts['useFix'] && $el.fix(_opts['position']);
                _opts['root'] = $el[0];
            } );

            // ����������ģʽ�����ģ�destroyʱ����Ԫ���Ƴ�
            me.on( 'destroy', function() {
                me.$el.remove();
            } );
        },

        _create: function() {
            var me = this;

            if( !me.$el ) {
                me.$el = $('<div></div>');
            }
            me.$el.addClass('ui-gotop').append('<div></div>').appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body));

            return me;
        },

        /**
         * �¼���������
         */
        _eventHandler: function(e) {
            var me = this;

            switch (e.type) {
                case 'touchmove':
                    me.hide();
                    break;
                case 'scroll':
                    clearTimeout(me._options['_TID']);
                    break;
                case 'touchend':
                case 'touchcancel':
                    clearTimeout(me._options['_TID']);
                    me._options['_TID'] = setTimeout(function(){
                        me._check.call(me);
                    }, 300);
                    break;
                case 'scrollStop':
                    me._check();
                    break;
                case 'ortchange':
                    me._check.call(me);
                    break;
                case 'click':
                    me._scrollTo();
                    break;
            }
        },

        /**
         * �ж��Ƿ���ʾgotop
         */
        _check: function(position) {
            var me = this;

            (position !== undefined ? position : window.pageYOffset) > document.documentElement.clientHeight ? me.show() : me.hide();
            
            return  me;
        },

		/**
         * ������������ָ���ڵ�λ��
         */
		_scrollTo: function() {
            var me = this,
                from = window.pageYOffset;

            me.hide();
            clearTimeout(me._options['_TID']);
            if (!me._options['useAnimation']) {
                window.scrollTo(0, 1);
                me.trigger('afterScroll');
            } else {
                me._options['moveToTop'] = setInterval(function() {
                    if (from > 1) {
                        window.scrollBy(0, -Math.min(150,from - 1));
                        from -= 150;
                    } else {
                        clearInterval(me._options['moveToTop']);
                        me.trigger('afterScroll');
                    }
                }, 25, true);
            }
            return me;
		},

        /**
         * ��ʾgotop
         * @method show
         * @return {self} ���ر���
         */
        show: function() {
            this._options.root.style.display = 'block';

            return this;
        },

        /**
         * ����gotop
         * @method hide
         * @chainable
         * @return {self} ���ر���
         */
        hide: function() {
            this._options.root.style.display = 'none';
            
            return this;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷�
         */

        /**
         * @event afterScroll
         * @param {Event} e gmu.Event����
         * @description ���ض����󴥷����¼�
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    });
})( gmu, gmu.$ );

/**
 * @file ��ʷ��¼���
 * @import core/widget.js, extend/touch.js, widget/dialog.js
 * @module GMU
 */

 // TODO �б�����֧��iScroll
(function( gmu, $ ) {
    
    /**
     * ��ʷ��¼���
     *
     * @class Historylist
     * @constructor Html����
     * ```html
     * <div>
     *     <p><input type="text" class="input-text" id="J_input" /><input type="button" value="ȡ��" class="input-button" /></p>
     *     <div id="J_historyWrap"></div>
     * </div>
     * ```
     *
     * javascript����
     * ```javascript
     * var instance = new gmu.Historylist({
     *     container: $('#J_historyWrap'), // ҳ������Ҫ��һ���Ѿ����ڵ�������������
     *     items: [
     *             {'value': 'global', 'context': '<b>global</b> adj. ȫ��ģ��ۺϵ�'},
     *             'google',
     *             {'value': 'visual', 'context': '<b>visual</b> adj. �Ӿ���'},
     *             'alibaba',
     *             'taobao'
     *            ],   // ��ʷ��¼���б�
     *     itemTouch: function(e, data) {  // ĳ����¼����������Ӧ�¼�
     *         console.log( 'item touched: ' + data.item );   // data.item��ĳ����¼������
     *         $('#J_input').val(data.item);
     *     },
     *     itemDelete: function(e, data) { // ĳ����¼��ɾ�������Ӧ�¼�
     *         console.log( 'item delete:' + data.item );   // data.item��ĳ����¼������
     *     },
     *     clear: function() {  // �û�ȷ�����������ʷ�����Ӧ�¼�
     *         // ������ɾ��localstorage��������ʷ����
     *         console.log( 'clear triggered' );
     *     }
     * });
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ�������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Historylist:options)
     * @grammar $( el ).historylist( options ) => zepto
     * @grammar new gmu.Historylist( el, options ) => instance
     */
    gmu.define( 'Historylist', {

        options: {

            /**
             * @property {Zepto | Selector | Element} [container=document.body] ������Ĭ��Ϊ document.body 
             * @namespace options
             */
            container: document.body,

            /**
             * @property {Boolean} [deleteSupport=true] �Ƿ�֧�ֻ���ɾ����¼��Ĭ��֧��
             * @namespace options
             */
            deleteSupport: true,

            /**
             * @property {Array} [items=Array()] ��ʷ��¼������
             * @namespace options
             */
            items: []
        },

        template: {
            wrap: '<ul class="ui-historylist">',
            item: '<li data-id="<%=id%>"><p class="ui-historylist-itemwrap"><span class="ui-historylist-item"><%=context%></span></p></li>',
            clear: '<p class="ui-historylist-clear">���������ʷ</p>'
        },

        _init: function() {
            var me = this,
                opts = me._options;

            // js��һ������ҳ��β����������init��Ҫ���¸�ֵ
            me.$el = opts.container = opts.container || document.body;

            me.items = [];

            me.on( 'ready', function() {
                me._bindUI();
            } );

            me.on( 'itemDelete', function() {
                // ��ʷ��¼Ϊ��ʱ������
                if( me.items.length === 0 ) {
                    me.hide();
                }
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options;

            me.$el.hide();
            me.$wrap = $( me.tpl2html( 'wrap' ) ).appendTo( opts.container );

            me.$clear = $( me.tpl2html( 'clear' ) ).appendTo( opts.container );
            !me._options.deleteSupport && me.$clear.hide();

            me.addItems( opts.items );

            me.show();
        },

        _filterItemsById: function( id, callback ) {
            var me = this;

            me.items.forEach( function( _item, index ) {
                if ( _item.id === id ) {
                    callback.call( me, _item, index );

                    return;
                }
            } );
        },

        _bindUI: function() {
            var me = this,
                touch,
                $target,
                itemId,
                startTimestamp,
                endTimestamp,
                wantDelete = false,
                timeout,
                touchstartX,
                currentX,
                touchstartY,
                currentY,
                velocity,
                movedPercentage,
                moved,
                movedDistance;

            me.$clear.on( 'tap' + me.eventNs, function( ev ) {
                // ��ֹ��͸
                setTimeout( function() {
                    gmu.Dialog({
                        closeBtn: false,
                        buttons: {
                            '���': function(){
                                me.clear();
                                this.destroy();
                            },
                            'ȡ��': function(){
                                this.destroy();
                            }
                        },
                        title: '�����ʷ',
                        content: '<p>�Ƿ����������ʷ��</p>',
                        open: function(){
                            this._options._wrap.addClass( 'ui-historylist-dialog' );
                        }
                    });
                }, 10 );

                ev.preventDefault();
                ev.stopPropagation();
            } );

            me.$wrap.on( 'tap' + me.eventNs, function(ev) {
                if( me._options.deleteSupport ) {
                    return;
                }

                $target = $( ev.target );

                if( !$target.hasClass( 'ui-historylist-itemwrap' ) && 
                    !($target = $target.parents( '.ui-historylist-itemwrap' )).length ) {
                    $target = null;
                    return;
                }

                itemId = $target.parent().attr( 'data-id' );
                me._filterItemsById( itemId, function( _item ) {
                    me.trigger( 'itemTouch', {'item': _item.value} );
                });

            } );

            me.$wrap.on( 'touchstart' + me.eventNs, function(ev) {

                if( !me._options.deleteSupport ) {
                    return;
                }
                touch = ev.touches[0];
                $target = $( touch.target );
                startTimestamp = ev.timeStamp;
                currentX = touchstartX = parseInt( touch.pageX );
                currentY = touchstartY = parseInt( touch.pageY );
                moved = false;
                wantDelete = false;

                if( !$target.hasClass( 'ui-historylist-itemwrap' ) && 
                    !($target = $target.parents( '.ui-historylist-itemwrap' )).length ) {
                    $target = null;
                    return;
                }

                $target.addClass( 'ui-historylist-ontap' );

                // TODO ����-webkit-box���Ͳ���Ҫȥ��̬����width��
                $target.css( 'width',  $target.width() - parseInt( $target.css( 'border-left-width' ) ) - parseInt( $target.css( 'border-right-width' ) ));
            } );

            me.$wrap.on( 'touchmove' + me.eventNs, function(ev) {
                if( !$target ) {
                    return;
                }

                currentX = ev.touches[0].pageX;
                currentY = ev.touches[0].pageY;
                timeout === undefined && (timeout = setTimeout( function() {
                    // �����ƶ��ľ�����ں����ƶ������һ��ʱ����Ϊ�û�����ͼ������������ɾ��
                    if( Math.abs( currentY - touchstartY ) > Math.abs (currentX - touchstartX )/2 ){
                        wantDelete = false;
                    }else{
                        wantDelete = true;
                    }

                }, 10 ));
                
                moved = moved || ((currentX - touchstartX >= 3 || currentY - touchstartY >= 3) ? true : false);
                if( !wantDelete ) {
                    setTimeout( function() {
                        $target && $target.removeClass( 'ui-historylist-ontap' );
                    }, 150 );   // ��ʱ��һ�㣬����������Ϊclass�ı�̫�죬������
                    return;
                }

                movedPercentage = (currentX - touchstartX)/me.$wrap.width();

                // TODO ��Щ�豸���е㿨����Ҫ�Ż�
                $target.addClass( 'ui-historylist-itemmoving' );
                $target.removeClass( 'ui-historylist-ontap' );
                $target.css( '-webkit-transform', 'translate3d(' + (currentX - touchstartX) + 'px, 0, 0)' );
                $target.css( 'opacity', 1 - movedPercentage );
                
                ev.preventDefault();
                ev.stopPropagation();
            } );

            me.$wrap.on( 'touchend' + me.eventNs + ' touchcancel' + me.eventNs, function(ev) {
                if( !$target) {
                    return;
                }

                clearTimeout(timeout);
                timeout = undefined;

                itemId = $target.parent().attr( 'data-id' );
                endTimestamp = ev.timeStamp;
                velocity = (currentX - touchstartX) / (endTimestamp - startTimestamp);
                movedDistance = Math.abs( currentX - touchstartX );

                $target.removeClass( 'ui-historylist-ontap' );
                $target.removeClass( 'ui-historylist-itemmoving' );

                // ���ƶ��ľ���С�� 1/3 ʱ���ٶȿ���ɾ�����ٶ�����ԭ
                if( ((movedDistance < me.$wrap.width()/3 && Math.abs( velocity ) > 0.1) && wantDelete) ||
                     (movedDistance >= me.$wrap.width()/3 && wantDelete) ) {
                        me.removeItem( itemId, $target );
                } else {
                    $target.css( 'width', 'auto' );
                    $target.css( '-webkit-transform', 'translate3d(0, 0, 0)' );
                    $target.css( 'opacity', 1 );

                    // �ƶ�С��3������ʱ������Ϊ�ǵ�����ɷ� itemTouch �¼�
                    // ����Ƴ�3�����⣬���Ƶ�3�����ڣ���Ϊ���ǵ��
                    !moved && movedDistance < 3 && me._filterItemsById( itemId, function( _item ) {
                        me.trigger( 'itemTouch', {'item': _item.value} );
                    });
                }

                $target = null;
            } );
        },

        /**
         * ��ʾHistorylist
         * @method show
         * @return {self} ���ر���
         */
        show: function() {
            var me = this;

            // û����ʷ��¼ʱ������ʾ
            if( me.items.length === 0 ) {
                return;
            }

            if( me.sync === false ) {
                me.$wrap.html( '' );
                me.addItems( me.syncitems );
                me.sync = true;
            }
            me.$el.show();
            me.isShow = true;

            return me;
        },

        /**
         * ����Historylist
         * @method hide
         * @return {self} ���ر���
         */
        hide: function() {
            var me = this;

            me.$el.hide();
            me.isShow = false;

            return me;
        },

        _getItemId: function() {
            var me = this;

            me._itemId === undefined ? (me._itemId = 1) : ++me._itemId;

            return '__dd__' + me._itemId;
        },

        _getFormatItem: function( item ) {
            var me = this;

            if( Object.prototype.toString.call( item ) === '[object String]' ) {
                return {
                    'context': item,
                    'value': item,
                    'id': me._getItemId()
                }
            } else {
                return {
                    'context': item.context || item.value,
                    'value': item.value || item.context,
                    'id': me._getItemId()
                }
            }
        },

        /**
         * ���һ����ʷ��¼
         * @method addBtns
         * @param {String|Object} item ��ʷ��¼���������ַ�����Ҳ�����Ǳ�׼��ʽ�Ķ��󣨰���context��value��
         * @return {self} ���ر���
         */
        addItem: function( item ) {
            var me = this,
                item = me._getFormatItem( item );

            // ���me.items���Ƿ��Ѵ��ڸ���
            me.items.forEach( function( _item, index ) {
                if ( _item.value === item.value ) {
                    me.items.splice( index, 1);
                    $( me.$wrap.children()[index] ).remove();

                    return;
                }
            } );

            me.$wrap.children().length === 0 ? 
                me.$wrap.append( me.tpl2html( 'item', item ) ) : 
                $( me.tpl2html( 'item', item ) ).insertBefore( me.$wrap.children()[0] );
            
            me.items.unshift( item );

            return me;
        },

        /**
         * ��Ӷ�����ʷ��¼
         * @method addBtns
         * @param {Array} item ��ʷ��¼
         * @return {self} ���ر���
         */
        addItems: function( items ) {
            var me = this;

            items.forEach( function( item ) {
                me.addItem( item );
            } );

            return me;
        },

        /**
         * �������ݣ�������Ⱦ�б�
         * @method update
         * @param {Array} item �µ���ʷ��¼
         * @return {self} ���ر���
         */
        update: function( items ) {
            var me = this;


            if( me.isShow ) {
                me.$wrap.html( '' );
                me.addItems( items );
                me.sync = true;
            } else {
                me.syncitems = items;
                me.sync = false;
            }

            return me;
        },

        removeItem: function( itemId, $itemTarget ) {
            var me = this,
                distance,
                transform,
                x;

            // ���ݵ�ǰλ�Ƶ��������ж��Ǵ��һ������Ǵ��󻬳�
            transform = $itemTarget.css( '-webkit-transform');
            x = /translate3d\((.*?),.*/.test(transform) ? RegExp.$1: 0;
            distance = parseInt( x, 10) >= 0 ? $itemTarget.width() : -$itemTarget.width();
            $itemTarget.css( '-webkit-transform', 'translate3d(' + distance + 'px, 0, 0)' );

            // TODO ����λ�Ƹı�͸���ȣ��о���������û��Ҫ��

            $itemTarget.on( 'transitionEnd' + me.eventNs +  ' webkitTransitionEnd' + me.eventNs, function() {
                $itemTarget.parent().remove();

                me._filterItemsById( itemId, function( _item, index ) {
                    me.items.splice( index, 1);
                    me.trigger( 'itemDelete', {'item': _item.value} );
                });
            } );

        },

        /**
         * �����ʷ��¼
         * @method clear
         * @return {self} ���ر���
         */
        clear: function() {
            var me = this;

            me.$wrap.html( '' );
            me.items = [];
            me.sync = true;
            me.hide();
            me.trigger( 'clear' );

            return me;
        },

        /**
         * ����ɾ������
         * @method disableDelete
         * @return {self} ���ر���
         */
        disableDelete: function() {
            var me = this;

            me._options.deleteSupport = false;
            me.$clear.hide();

            return me;
        },

        /**
         * ����ɾ������
         * @method enableDelete
         * @return {self} ���ر���
         */
        enableDelete: function() {
            var me = this;

            me._options.deleteSupport = true;
            me.$clear.show();

            return me;
        },

        /**
         * �������
         * @method destroy
         */
        destroy: function() {
            var me = this;

            me.$wrap.off( me.eventNs );
            me.$clear.off( me.eventNs );

            me.$wrap.remove();
            me.$clear.remove();

            return me.$super( 'destroy' );
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event itemTouch
         * @param {Event} e gmu.Event����
         * @param {String} item ������ļ�¼��value
         * @description ���ĳ����ʷ��¼ʱ����
         */

        /**
         * @event itemDelete
         * @param {Event} e gmu.Event����
         * @param {String} item ��ɾ���ļ�¼��value
         * @description ɾ��ĳ����ʷ��¼ʱ����
         */

        /**
         * @event clear
         * @param {Event} e gmu.Event����
         * @description �����ʷ��¼ʱ����
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    } );
})( gmu, gmu.$ );


/**
 * @file ���������
 * @import core/widget.js, extend/highlight.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    
    /**
     * ���������
     *
     * @class Navigator
     * @constructor Html����
     * ```html
     * 
     * ```
     *
     * javascript����
     * ```javascript
     * 
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ����������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Navigator:options)
     * @grammar $( el ).navigator( options ) => zepto
     * @grammar new gmu.Navigator( el, options ) => instance
     */
    gmu.define( 'Navigator', {
        options: {

            /**
             * @property {Array} [content=null] �˵�����
             * @namespace options
             */
            content: null,

            /**
             * @property {String} [event='click'] �����¼���
             * @namespace options
             */
            event: 'click'
        },

        template: {
            list: '<ul>',
            item: '<li><a<% if( href ) { %> href="<%= href %>"<% } %>>' +
                    '<%= text %></a></li>'
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $el = me.getEl(),
                $list = $el.find( 'ul' ).first(),
                name = 'ui-' + me.widgetName,
                renderer,
                html;

            // ���û�а���ul�ڵ㣬��˵��ͨ��ָ��content��create
            // �����createģʽ�����ȥ���ܶ�ʱ������д����dom���ˡ�
            if ( !$list.length && opts.content ) {
                $list = $( me.tpl2html( 'list' ) );
                renderer = me.tpl2html( 'item' );

                html = '';
                opts.content.forEach(function( item ) {

                    // ������ṩĬ��ֵ��Ȼ��ͬʱĳЩkeyû�д�ֵ��parseTpl�ᱨ��
                    item = $.extend( {
                        href: '',
                        text: ''
                    }, typeof item === 'string' ? {
                        text: item
                    } : item );

                    html += renderer( item );
                });

                $list.append( html ).appendTo( $el );
            } else {
                
                // ����ֱ��ͨ��ul��ʼ�������
                if ( $el.is( 'ul, ol' ) ) {
                    $list = $el.wrap( '<div>' );
                    $el = $el.parent();
                }

                if ( opts.index === undefined ) {

                    // ���opts��û��ָ��index, ���Դ�dom�в鿴�Ƿ��бȽ�Ϊui-state-active��
                    opts.index = $list.find( '.ui-state-active' ).index();
                    
                    // û�ҵ����Ǹ�ֵΪ0
                    ~opts.index || (opts.index = 0);
                }
            }

            me.$list = $list.addClass( name + '-list' );
            me.trigger( 'done.dom', $el.addClass( name ), opts );

            // bind Events
            $list.highlight( 'ui-state-hover', 'li' );
            $list.on( opts.event + me.eventNs,
                    'li:not(.ui-state-disable)>a', function( e ) {
                me._switchTo( $( this ).parent().index(), e );
            } );

            me.index = -1;
            me.switchTo( opts.index );
        },

        _switchTo: function( to, e ) {
            if ( to === this.index ) {
                return;
            }

            var me = this,
                list = me.$list.children(),
                evt = gmu.Event( 'beforeselect', e ),
                cur;
                
            me.trigger( evt, list.get( to ) );
            
            if ( evt.isDefaultPrevented() ) {
                return;
            }

            cur = list.removeClass( 'ui-state-active' )
                    .eq( to )
                    .addClass( 'ui-state-active' );

            me.index = to;
            return me.trigger( 'select', to, cur[ 0 ] );
        },

        /**
         * �л�����������ĳһ��
         * @param {Number} to ���
         * @method switchTo
         */
        switchTo: function( to ) {
            return this._switchTo( ~~to );
        },

        /**
         * ȡ��ѡ��
         * @method unselect
         */
        unselect: function() {
            this.index = -1;
            this.$list.children().removeClass( 'ui-state-active' );
        },

        /**
         * ��ȡ��ǰѡ�е����
         * @method getIndex
         */
        getIndex: function() {
            return this.index;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event beforeselect
         * @param {Event} e gmu.Event����
         * @param {Element} Ŀ��Ԫ��
         * @description ��ѡ�����ŷ����л�ǰ����
         */
        
        /**
         * @event select
         * @param {Event} e gmu.Event����
         * @param {Event} ��ǰѡ������
         * @param {Element} ��һ��ѡ���Ԫ��
         * @description ��ѡ�����ŷ����л��󴥷�
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    } );
})( gmu, gmu.$ );
/*!
 * iScroll v4.2.2 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
    var m = Math,_bindArr = [],
        dummyStyle = doc.createElement('div').style,
        vendor = (function () {
            var vendors = 'webkitT,MozT,msT,OT,t'.split(','),
                t,
                i = 0,
                l = vendors.length;

            for ( ; i < l; i++ ) {
                t = vendors[i] + 'ransform';
                if ( t in dummyStyle ) {
                    return vendors[i].substr(0, vendors[i].length - 1);
                }
            }

            return false;
        })(),
        cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',


    // Style properties
        transform = prefixStyle('transform'),
        transitionProperty = prefixStyle('transitionProperty'),
        transitionDuration = prefixStyle('transitionDuration'),
        transformOrigin = prefixStyle('transformOrigin'),
        transitionTimingFunction = prefixStyle('transitionTimingFunction'),
        transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
        isAndroid = (/android/gi).test(navigator.appVersion),
        isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

        has3d = prefixStyle('perspective') in dummyStyle,
        hasTouch = 'ontouchstart' in window && !isTouchPad,
        hasTransform = !!vendor,
        hasTransitionEnd = prefixStyle('transition') in dummyStyle,

        RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
        START_EV = hasTouch ? 'touchstart' : 'mousedown',
        MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
        END_EV = hasTouch ? 'touchend' : 'mouseup',
        CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
        TRNEND_EV = (function () {
            if ( vendor === false ) return false;

            var transitionEnd = {
                ''			: 'transitionend',
                'webkit'	: 'webkitTransitionEnd',
                'Moz'		: 'transitionend',
                'O'			: 'otransitionend',
                'ms'		: 'MSTransitionEnd'
            };

            return transitionEnd[vendor];
        })(),

        nextFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) { return setTimeout(callback, 1); };
        })(),
        cancelFrame = (function () {
            return window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout;
        })(),

    // Helpers
        translateZ = has3d ? ' translateZ(0)' : '',

    // Constructor
        iScroll = function (el, options) {
            var that = this,
                i;

            that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
            that.wrapper.style.overflow = 'hidden';
            that.scroller = that.wrapper.children[0];

            that.translateZ = translateZ;
            // Default options
            that.options = {
                hScroll: true,
                vScroll: true,
                x: 0,
                y: 0,
                bounce: true,
                bounceLock: false,
                momentum: true,
                lockDirection: true,
                useTransform: true,
                useTransition: false,
                topOffset: 0,
                checkDOMChanges: false,		// Experimental
                handleClick: true,


                // Events
                onRefresh: null,
                onBeforeScrollStart: function (e) { e.preventDefault(); },
                onScrollStart: null,
                onBeforeScrollMove: null,
                onScrollMove: null,
                onBeforeScrollEnd: null,
                onScrollEnd: null,
                onTouchEnd: null,
                onDestroy: null

            };

            // User defined options
            for (i in options) that.options[i] = options[i];

            // Set starting position
            that.x = that.options.x;
            that.y = that.options.y;

            // Normalize options
            that.options.useTransform = hasTransform && that.options.useTransform;

            that.options.useTransition = hasTransitionEnd && that.options.useTransition;



            // Set some default styles
            that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
            that.scroller.style[transitionDuration] = '0';
            that.scroller.style[transformOrigin] = '0 0';
            if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';

            if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
            else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';



            that.refresh();

            that._bind(RESIZE_EV, window);
            that._bind(START_EV);


            if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
                that._checkDOMChanges();
            }, 500);
        };

// Prototype
    iScroll.prototype = {
        enabled: true,
        x: 0,
        y: 0,
        steps: [],
        scale: 1,
        currPageX: 0, currPageY: 0,
        pagesX: [], pagesY: [],
        aniTime: null,
        isStopScrollAction:false,

        handleEvent: function (e) {
            var that = this;
            switch(e.type) {
                case START_EV:
                    if (!hasTouch && e.button !== 0) return;
                    that._start(e);
                    break;
                case MOVE_EV: that._move(e); break;
                case END_EV:
                case CANCEL_EV: that._end(e); break;
                case RESIZE_EV: that._resize(); break;
                case TRNEND_EV: that._transitionEnd(e); break;
            }
        },

        _checkDOMChanges: function () {
            if (this.moved ||  this.animating ||
                (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

            this.refresh();
        },

        _resize: function () {
            var that = this;
            setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
        },

        _pos: function (x, y) {
            x = this.hScroll ? x : 0;
            y = this.vScroll ? y : 0;

            if (this.options.useTransform) {
                this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
            } else {
                x = m.round(x);
                y = m.round(y);
                this.scroller.style.left = x + 'px';
                this.scroller.style.top = y + 'px';
            }

            this.x = x;
            this.y = y;

        },



        _start: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                matrix, x, y,
                c1, c2;

            if (!that.enabled) return;

            if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

            if (that.options.useTransition ) that._transitionTime(0);

            that.moved = false;
            that.animating = false;

            that.distX = 0;
            that.distY = 0;
            that.absDistX = 0;
            that.absDistY = 0;
            that.dirX = 0;
            that.dirY = 0;
            that.isStopScrollAction = false;

            if (that.options.momentum) {
                if (that.options.useTransform) {
                    // Very lame general purpose alternative to CSSMatrix
                    matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                    x = +matrix[4];
                    y = +matrix[5];
                } else {
                    x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                    y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
                }

                if (m.round(x) != m.round(that.x) || m.round(y) != m.round(that.y)) {
                    that.isStopScrollAction = true;
                    if (that.options.useTransition) that._unbind(TRNEND_EV);
                    else cancelFrame(that.aniTime);
                    that.steps = [];
                    that._pos(x, y);
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
                }
            }



            that.startX = that.x;
            that.startY = that.y;
            that.pointX = point.pageX;
            that.pointY = point.pageY;

            that.startTime = e.timeStamp || Date.now();

            if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

            that._bind(MOVE_EV, window);
            that._bind(END_EV, window);
            that._bind(CANCEL_EV, window);
        },

        _move: function (e) {
            var that = this,
                point = hasTouch ? e.touches[0] : e,
                deltaX = point.pageX - that.pointX,
                deltaY = point.pageY - that.pointY,
                newX = that.x + deltaX,
                newY = that.y + deltaY,

                timestamp = e.timeStamp || Date.now();

            if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

            that.pointX = point.pageX;
            that.pointY = point.pageY;

            // Slow down if outside of the boundaries
            if (newX > 0 || newX < that.maxScrollX) {
                newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
            }
            if (newY > that.minScrollY || newY < that.maxScrollY) {
                newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
            }

            that.distX += deltaX;
            that.distY += deltaY;
            that.absDistX = m.abs(that.distX);
            that.absDistY = m.abs(that.distY);

            if (that.absDistX < 6 && that.absDistY < 6) {
                return;
            }

            // Lock direction
            if (that.options.lockDirection) {
                if (that.absDistX > that.absDistY + 5) {
                    newY = that.y;
                    deltaY = 0;
                } else if (that.absDistY > that.absDistX + 5) {
                    newX = that.x;
                    deltaX = 0;
                }
            }

            that.moved = true;

            // internal for header scroll

            that._beforePos ? that._beforePos(newY, deltaY) && that._pos(newX, newY) : that._pos(newX, newY);

            that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
            that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

            if (timestamp - that.startTime > 300) {
                that.startTime = timestamp;
                that.startX = that.x;
                that.startY = that.y;
            }

            if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
        },

        _end: function (e) {
            if (hasTouch && e.touches.length !== 0) return;

            var that = this,
                point = hasTouch ? e.changedTouches[0] : e,
                target, ev,
                momentumX = { dist:0, time:0 },
                momentumY = { dist:0, time:0 },
                duration = (e.timeStamp || Date.now()) - that.startTime,
                newPosX = that.x,
                newPosY = that.y,
                newDuration;


            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);

            if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);


            if (!that.moved) {

                if (hasTouch && this.options.handleClick && !that.isStopScrollAction) {
                    that.doubleTapTimer = setTimeout(function () {
                        that.doubleTapTimer = null;

                        // Find the last touched element
                        target = point.target;
                        while (target.nodeType != 1) target = target.parentNode;

                        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                            ev = doc.createEvent('MouseEvents');
                            ev.initMouseEvent('click', true, true, e.view, 1,
                                point.screenX, point.screenY, point.clientX, point.clientY,
                                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                0, null);
                            ev._fake = true;
                            target.dispatchEvent(ev);
                        }
                    },  0);
                }


                that._resetPos(400);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }

            if (duration < 300 && that.options.momentum) {
                momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
                momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

                newPosX = that.x + momentumX.dist;
                newPosY = that.y + momentumY.dist;

                if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
                if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
            }

            if (momentumX.dist || momentumY.dist) {
                newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);



                that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

                if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
                return;
            }



            that._resetPos(200);
            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
        },

        _resetPos: function (time) {
            var that = this,
                resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
                resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

            if (resetX == that.x && resetY == that.y) {
                if (that.moved) {
                    that.moved = false;
                    if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);		// Execute custom code on scroll end
                    if (that._afterPos) that._afterPos();
                }

                return;
            }

            that.scrollTo(resetX, resetY, time || 0);
        },



        _transitionEnd: function (e) {
            var that = this;

            if (e.target != that.scroller) return;

            that._unbind(TRNEND_EV);

            that._startAni();
        },


        /**
         *
         * Utilities
         *
         */
        _startAni: function () {
            var that = this,
                startX = that.x, startY = that.y,
                startTime = Date.now(),
                step, easeOut,
                animate;

            if (that.animating) return;

            if (!that.steps.length) {
                that._resetPos(400);
                return;
            }

            step = that.steps.shift();

            if (step.x == startX && step.y == startY) step.time = 0;

            that.animating = true;
            that.moved = true;

            if (that.options.useTransition) {
                that._transitionTime(step.time);
                that._pos(step.x, step.y);
                that.animating = false;
                if (step.time) that._bind(TRNEND_EV);
                else that._resetPos(0);
                return;
            }

            animate = function () {
                var now = Date.now(),
                    newX, newY;

                if (now >= startTime + step.time) {
                    that._pos(step.x, step.y);
                    that.animating = false;
                    if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);			// Execute custom code on animation end
                    that._startAni();
                    return;
                }

                now = (now - startTime) / step.time - 1;
                easeOut = m.sqrt(1 - now * now);
                newX = (step.x - startX) * easeOut + startX;
                newY = (step.y - startY) * easeOut + startY;
                that._pos(newX, newY);
                if (that.animating) that.aniTime = nextFrame(animate);
            };

            animate();
        },

        _transitionTime: function (time) {
            time += 'ms';
            this.scroller.style[transitionDuration] = time;

        },

        _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
            var deceleration = 0.0006,
                speed = m.abs(dist) * (this.options.speedScale||1) / time,
                newDist = (speed * speed) / (2 * deceleration),
                newTime = 0, outsideDist = 0;

            // Proportinally reduce speed if we are outside of the boundaries
            if (dist > 0 && newDist > maxDistUpper) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistUpper = maxDistUpper + outsideDist;
                speed = speed * maxDistUpper / newDist;
                newDist = maxDistUpper;
            } else if (dist < 0 && newDist > maxDistLower) {
                outsideDist = size / (6 / (newDist / speed * deceleration));
                maxDistLower = maxDistLower + outsideDist;
                speed = speed * maxDistLower / newDist;
                newDist = maxDistLower;
            }

            newDist = newDist * (dist < 0 ? -1 : 1);
            newTime = speed / deceleration;

            return { dist: newDist, time: m.round(newTime) };
        },

        _offset: function (el) {
            var left = -el.offsetLeft,
                top = -el.offsetTop;

            while (el = el.offsetParent) {
                left -= el.offsetLeft;
                top -= el.offsetTop;
            }

            if (el != this.wrapper) {
                left *= this.scale;
                top *= this.scale;
            }

            return { left: left, top: top };
        },



        _bind: function (type, el, bubble) {
            _bindArr.concat([el || this.scroller, type, this]);
            (el || this.scroller).addEventListener(type, this, !!bubble);
        },

        _unbind: function (type, el, bubble) {
            (el || this.scroller).removeEventListener(type, this, !!bubble);
        },


        /**
         *
         * Public methods
         *
         */
        destroy: function () {
            var that = this;

            that.scroller.style[transform] = '';



            // Remove the event listeners
            that._unbind(RESIZE_EV, window);
            that._unbind(START_EV);
            that._unbind(MOVE_EV, window);
            that._unbind(END_EV, window);
            that._unbind(CANCEL_EV, window);



            if (that.options.useTransition) that._unbind(TRNEND_EV);

            if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);

            if (that.options.onDestroy) that.options.onDestroy.call(that);

            //������а󶨵��¼�
            for (var i = 0, l = _bindArr.length; i < l;) {
                _bindArr[i].removeEventListener(_bindArr[i + 1], _bindArr[i + 2]);
                _bindArr[i] = null;
                i = i + 3
            }
            _bindArr = [];

            //�ɵ���ߵ���������
            /*var div = doc.createElement('div');
            div.appendChild(this.wrapper);
            div.innerHTML = '';
            that.wrapper = that.scroller = div = null;*/
        },

        refresh: function () {
            var that = this,
                offset;



            that.wrapperW = that.wrapper.clientWidth || 1;
            that.wrapperH = that.wrapper.clientHeight || 1;

            that.minScrollY = -that.options.topOffset || 0;
            that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
            that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
            that.maxScrollX = that.wrapperW - that.scrollerW;
            that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
            that.dirX = 0;
            that.dirY = 0;

            if (that.options.onRefresh) that.options.onRefresh.call(that);

            that.hScroll = that.options.hScroll && that.maxScrollX < 0;
            that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);


            offset = that._offset(that.wrapper);
            that.wrapperOffsetLeft = -offset.left;
            that.wrapperOffsetTop = -offset.top;


            that.scroller.style[transitionDuration] = '0';
            that._resetPos(400);
        },

        scrollTo: function (x, y, time, relative) {
            var that = this,
                step = x,
                i, l;

            that.stop();

            if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];

            for (i=0, l=step.length; i<l; i++) {
                if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
                that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
            }

            that._startAni();
        },

        scrollToElement: function (el, time) {
            var that = this, pos;
            el = el.nodeType ? el : that.scroller.querySelector(el);
            if (!el) return;

            pos = that._offset(el);
            pos.left += that.wrapperOffsetLeft;
            pos.top += that.wrapperOffsetTop;

            pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
            pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
            time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

            that.scrollTo(pos.left, pos.top, time);
        },

        scrollToPage: function (pageX, pageY, time) {
            var that = this, x, y;

            time = time === undefined ? 400 : time;

            if (that.options.onScrollStart) that.options.onScrollStart.call(that);


            x = -that.wrapperW * pageX;
            y = -that.wrapperH * pageY;
            if (x < that.maxScrollX) x = that.maxScrollX;
            if (y < that.maxScrollY) y = that.maxScrollY;


            that.scrollTo(x, y, time);
        },

        disable: function () {
            this.stop();
            this._resetPos(0);
            this.enabled = false;

            // If disabled after touchstart we make sure that there are no left over events
            this._unbind(MOVE_EV, window);
            this._unbind(END_EV, window);
            this._unbind(CANCEL_EV, window);
        },

        enable: function () {
            this.enabled = true;
        },

        stop: function () {
            if (this.options.useTransition) this._unbind(TRNEND_EV);
            else cancelFrame(this.aniTime);
            this.steps = [];
            this.moved = false;
            this.animating = false;
        },

        isReady: function () {
            return !this.moved &&  !this.animating;
        }
    };

    function prefixStyle (style) {
        if ( vendor === '' ) return style;

        style = style.charAt(0).toUpperCase() + style.substr(1);
        return vendor + style;
    }

    dummyStyle = null;	// for the sake of it

    if (typeof exports !== 'undefined') exports.iScroll = iScroll;
    else window.iScroll = iScroll;

    // ��$.fn�Ϲ�iScroll����
    (function( $, ns, undefined ){
        if(!$)return;

        var _iScroll = ns.iScroll,

            slice = [].slice,
            
            record = (function() {
                var data = {},
                    id = 0,
                    ikey = '_sid';    // internal key.

                return function( obj, val ) {
                    var key = obj[ ikey ] || (obj[ ikey ] = ++id);

                    val !== undefined && (data[ key ] = val);
                    val === null && delete data[ key ];

                    return data[ key ];
                };
            })(),

            iScroll;

        ns.iScroll = iScroll = function( el, options ){
            var args = [].slice.call( arguments, 0 ),
                ins = new _iScroll( el, options );

            record( el, ins );
            return ins;
        };
        iScroll.prototype = _iScroll.prototype;


        $.fn.iScroll = function( opts ) {
            var args = slice.call( arguments, 1 ),
                method = typeof opts === 'string' && opts,
                ret,
                obj;

            $.each( this, function( i, el ) {

                // �ӻ�����ȡ��û���򴴽�һ��
                obj = record( el ) || iScroll( el, $.isPlainObject( opts ) ?
                        opts : undefined );

                // ȡʵ��
                if ( method === 'this' ) {
                    ret = obj;
                    return false;    // �Ͽ�eachѭ��
                } else if ( method ) {

                    // ��ȡ�ķ���������ʱ���׳�������Ϣ
                    if ( !$.isFunction( obj[ method ] ) ) {
                        throw new Error( 'iScrollû�д˷�����' + method );
                    }

                    ret = obj[ method ].apply( obj, args );

                    // �϶�����getter���ʵķ�����������Ҫ�Ͽ�eachѭ�����ѽ������
                    if ( ret !== undefined && ret !== obj ) {
                        return false;
                    }

                    // retΪobjʱΪ��Чֵ��Ϊ�˲�Ӱ�����ķ���
                    ret = undefined;
                }
            } );

            return ret !== undefined ? ret : this;
        };

    })( window.Zepto || null, window );
})(window, document);
/**
 * Change list
 * �޸ļ�¼
 *
 * 1. 2012-08-14 ��������а�סֹͣ�������ɿ��󱻵�Ԫ�ش�������¼���
 *
 * �����޸�:
 * a. 202�� ���isStopScrollAction: false ��iScroll��ԭ������ӱ���
 * b. 365�� _start�����������that.isStopScrollAction = false; Ĭ�������ֵΪfalse
 * c. 390�� if (x != that.x || y != that.y)����������� �����  that.isStopScrollAction = true; ��Ŀ��ֵ��ʵ��ֵ��һ�£�˵�����ڹ���������
 * d. 554�� that.isStopScrollAction || (that.doubleTapTimer = setTimeout(function () {
 *          ......
 *          ......
 *          }, that.options.zoom ? 250 : 0));
 *   ���isStopScrollActionΪtrue�Ͳ�����click�¼�
 *
 *
 * 2. 2012-08-14 ��options�������speedScale���ԣ��ṩ�ⲿ���Ƴ��������ٶ�
 *
 * �����޸�
 * a. 108�� ���speedScale: 1, ��options�������speedScale���ԣ�Ĭ��Ϊ1
 * b. 798�� speed = m.abs(dist) * this.options.speedScale / time, ��ԭ���ٶȵĻ�����*speedScale���ı��ٶ�
 *
 * 3. 2012-08-21 �޸Ĳ��ִ��룬��iscroll_pluginǽ�õ�
 *
 * �����޸�
 * a. 517��  ��_pos֮ǰ������_beforePos,������治����true,  ���������_pos
 *  // internal for header scroll
 *  if (that._beforePos)
 *      that._beforePos(newY, deltaY) && that._pos(newX, newY);
 *  else
 *      that._pos(newX, newY);
 *
 * b. 680�� �ڹ������������ _afterPos.
 * // internal for header scroll
 * if (that._afterPos) that._afterPos();
 *
 * c. 106�й���������������´���
 * // add var to this for header scroll
 * that.translateZ = translateZ;
 *
 * Ϊ�������
 * _bind ����
 * destroy ����
 * �ͷ�� _bindArr = []
 *
 */
/**
 * @file GMU���ư�iscroll������[iScroll 4.2.2](http://cubiq.org/iscroll-4), ȥ��zoom, pc���ݣ�snap, scrollbar�ȹ��ܡ�ͬʱ��iscroll��չ����Zepto��ԭ���С�
 * @name iScroll
 * @import zepto.js
 * @desc GMU���ư�iscroll������{@link[http://cubiq.org/iscroll-4] iScroll 4.2.2}, ȥ��zoom, pc���ݣ�snap, scrollbar�ȹ��ܡ�ͬʱ��iscroll��չ����***Zepto***��ԭ���С�
 */

/**
 * @name iScroll
 * @grammar new iScroll(el,[options])  ?6?0 self
 * @grammar $('selecotr').iScroll([options])  ?6?0 zeptoʵ��
 * @desc ��iScroll���뵽��***$.fn***�У�������Zepto�ķ�ʽ����iScroll��
 * **el**
 * - ***el {String/ElementNode}*** iscroll�����ڵ�
 *
 * **Options**
 * - ***hScroll*** {Boolean}: (��ѡ, Ĭ��: true)�����Ƿ���Թ���
 * - ***vScroll*** {Boolean}: (��ѡ, Ĭ��: true)�����Ƿ���Թ���
 * - ***momentum*** {Boolean}: (��ѡ, Ĭ��: true)�Ƿ���й���Ч��
 * - ***checkDOMChanges*** {Boolean, Ĭ��: false}: (��ѡ)ÿ��500�����ж�һ�¹�������������Ƿ�����׷�ӵ����ݣ�����о͵���refresh������Ⱦһ��
 * - ***useTransition*** {Boolean, Ĭ��: false}: (��ѡ)�Ƿ�ʹ��css3����ʵ�ֶ�����Ĭ����false,���鿪��
 * - ***topOffset*** {Number}: (��ѡ, Ĭ��: 0)�ɹ�������ͷ���������ٸ߶ȣ�Ĭ����0�� ***��Ҫ����ͷ���������ظ���ʱ������ͷ������ʾ��ť***
 * @example
 * $('div').iscroll().find('selector').atrr({'name':'aaa'}) //������ʽ����
 * $('div').iScroll('refresh');//����iScroll�ķ���
 * $('div').iScroll('scrollTo', 0, 0, 200);//����iScroll�ķ���, 200ms�ڹ���������
 */


/**
 * @name destroy
 * @desc ����iScrollʵ������ԭiScroll��destroy�Ļ����϶Դ�����domԪ�ؽ���������
 * @grammar destroy()  ?6?0 undefined
 */

/**
 * @name refresh
 * @desc ����iScrollʵ�����ڹ�������������ʱ�����߿ɹ����������仯ʱ��Ҫ����***refresh***������������
 * @grammar refresh()  ?6?0 undefined
 */

/**
 * @name scrollTo
 * @desc ʹiScrollʵ������ָ��ʱ���ڹ�����ָ����λ�ã� ���relativeΪtrue, ˵��x, y��ֵ������뵱ǰλ�õġ�
 * @grammar scrollTo(x, y, time, relative)  ?6?0 undefined
 */
/**
 * @name scrollToElement
 * @desc ������ָ���ڲ�Ԫ��
 * @grammar scrollToElement(element, time)  ?6?0 undefined
 * @grammar scrollToElement(selector, time)  ?6?0 undefined
 */
/**
 * @name scrollToPage
 * @desc ��scrollTo�������ﴫ����ǰٷֱȡ�
 * @grammar scrollToPage(pageX, pageY, time)  ?6?0 undefined
 */
/**
 * @name disable
 * @desc ����iScroll
 * @grammar disable()  ?6?0 undefined
 */
/**
 * @name enable
 * @desc ����iScroll
 * @grammar enable()  ?6?0 undefined
 */
/**
 * @name stop
 * @desc ����iscroll����
 * @grammar stop()  ?6?0 undefined
 */


/**
 * @file Navigator�Ŀɹ������ ����iScroll��ʵ�֡�
 * @module GMU
 * @import widget/navigator/navigator.js, extend/iscroll.js, extend/event.ortchange.js
 */
(function( gmu, $, undefined ) {

    /**
     * @property {Object} [iScroll={}] iScroll����
     * @namespace options
     * @for Navigator
     * @uses Navigator.scrollable
     */
    gmu.Navigator.options.iScroll = {
        hScroll: true,
        vScroll: false,
        hScrollbar: false,
        vScrollbar: false
    };

    /**
     * Navigator�Ŀɹ������ ����iScroll��ʵ�֡�
     *
     * @class scrollable
     * @namespace Navigator
     * @pluginfor Navigator
     */
    gmu.Navigator.register( 'scrollable', {

        _init: function() {
            var me = this,
                opts = me._options;

            me.on( 'done.dom', function() {
                me.$list.wrap( '<div class="ui-scroller"></div>' );

                me.trigger( 'init.iScroll' );
                me.$el.iScroll( $.extend( {}, opts.iScroll ) );
            } );

            $( window ).on( 'ortchange' + me.eventNs,
                    $.proxy( me.refresh, me ) );

            me.on('destroy', function(){
                me.$el.iScroll( 'destroy' );
                $( window ).off( 'ortchange' + me.eventNs );
            } );
        },

        /**
         * ˢ��iscroll
         * @method refresh
         * @for Navigator
         * @uses Navigator.scrollable
         */
        refresh: function() {
            this.trigger( 'refresh.iScroll' ).$el.iScroll( 'refresh' );
        }

        /**
         * @event refresh.iScroll
         * @param {Event} e gmu.Event����
         * @description iscrollˢ��ǰ����
         */
    } );
})( gmu, gmu.$ );
/**
 * @file ƽ�����䰴ť�����ݴ����visibleCount, ��ƽ��������, �˲����Ҫ������ǿ
 * scrollable, ������ݲ��ɹ����ô���ʽ����ʵ����顣
 * @import widget/navigator/navigator.js, widget/navigator/$scrollable.js
 */
(function( gmu, $, undefined ) {
    gmu.Navigator.options.visibleCount = 4;

    /**
     * ƽ�����䰴ť�����ݴ����visibleCount, ��ƽ��������, �˲����Ҫ������ǿ
     * scrollable, ������ݲ��ɹ����ô���ʽ����ʵ����顣
     * @class visibleCount
     * @namespace Navigator
     * @pluginfor Navigator
     */
    gmu.Navigator.option( 'visibleCount', '*', function() {
        var me = this,
            opts = me._options,
            counts = $.type( opts.visibleCount ) === 'number' ? {
                portrait: opts.visibleCount,
                landscape: Math.floor( opts.visibleCount * 3 / 2 )
            } : opts.visibleCount;

        me.on( 'init.iScroll refresh.iScroll', arrage );

        function arrage( e ) {
            
            // todo ����һ�ָ���׼�ķ�������ȡ������
            var ort = window.innerWidth > window.innerHeight ?
                    'landscape' : 'portrait',
                count = counts[ ort ],
                $el = me.$el;
            
            //TODO �������л�ʱ�������Զ��������
            me.$list.children().width( $el.width() / count );
            me.$list.width($el.width() / count * me.$list.children().length);
        }
    } );
})( gmu, gmu.$ );
/**
 * @file ����������Ե��ʱ���Զ�����һ��������
 * @import widget/navigator/navigator.js, widget/navigator/$scrollable.js
 */
(function( gmu, $, undefined ) {
    gmu.Navigator.options.isScrollToNext = true;

    /**
     * ����������Ե��ʱ���Զ�����һ��������
     * @class isScrollToNext
     * @namespace Navigator
     * @pluginfor Navigator
     */
    gmu.Navigator.option( 'isScrollToNext', true, function() {
        var me = this,
            prevIndex;

        me.on( 'select', function( e, to, el ) {
            
            // ��һ���õ�ʱ��û��prevIndex, �̸���this.index�����Ʒ���
            if ( prevIndex === undefined ) {
                prevIndex = me.index ? 0 : 1;
            }

            var dir = to > prevIndex,

                // �������������prev������next
                target = $( el )[ dir ? 'next' : 'prev' ](),

                // ���û�����ڵģ��Լ���λ��Ҳ��Ҫ��⡣�����������
                // ������İ�ť��ֻ��ʾ��һ��
                offset = target.offset() || $( el ).offset(),
                within = me.$el.offset(),
                listOffset;

            if ( dir ? offset.left + offset.width > within.left +
                    within.width : offset.left < within.left ) {
                listOffset = me.$list.offset();

                me.$el.iScroll( 'scrollTo', dir ? within.width -
                        offset.left + listOffset.left - offset.width :
                        listOffset.left - offset.left, 0, 400 );
            }

            prevIndex = to;
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file panel���
 * @import extend/touch.js, core/widget.js, extend/throttle.js, extend/event.scrollStop.js, extend/event.ortchange.js
 * @module GMU
 */
(function( gmu, $, undefined ) {

    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd;
    /**
     * panel���
     *
     * @class Panel
     * @constructor Html����
     * ```html
     * <div id="page">
     *     <div class="cont">panel����</div>
     * </div>
     * ```
     *
     * javascript����
     * ```javascript
     * $('.panel').panel({
     *     contentWrap: $('.cont')
     * });
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ��Panel��Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Panel:options)
     * @grammar $( el ).panel( options ) => zepto
     * @grammar new gmu.Panel( el, options ) => instance
     */
    
    gmu.define( 'Panel', {
        options: {

            /**
             * @property {Dom | Zepto | selector} [contentWrap=''] ��������dom������������Ĭ��Ϊpanel��next�ڵ�
             * @namespace options
             */
            contentWrap: '',

            /**
             * @property {String} [scrollMode='follow'] Panel������ʽ��follow��ʾ����ҳ�滬����hide��ʾҳ�滬��ʱpanel��ʧ, fix��ʾpanel�̶���ҳ����
             * @namespace options
             */
            scrollMode: 'follow',

            /**
             * @property {String} [display='push'] ��ѡֵ��('overlay' | 'reveal' | 'push') Panel����ģʽ��overlay��ʾ����reveal��ʾ��content�±�չʾ��push��ʾpanel��content�Ƴ�
             * @namespace options
             */
            display: 'push',

            /**
             * @property {String} [position='right'] ��ѡֵ��('left' | 'right'�� ���ұ߻����
             * @namespace options
             */
            position: 'right',

            /**
             * @property {Boolean} [dismissible=true] (renderģʽ�±���)�Ƿ���������������panel��ʧ
             * @namespace options
             */
            dismissible: true,

            /**
             * @property {Boolean} [swipeClose=true] ��panel�ϻ�����panel�Ƿ�ر�
             * @namespace options
             */
            swipeClose: true
        },

        _init: function () {
            var me = this,
                opts = me._options;

            me.on( 'ready', function(){
                me.displayFn = me._setDisplay();
                me.$contentWrap.addClass('ui-panel-animate');
                me.$el.on(transitionEnd, $.proxy(me._eventHandler, me)).hide();  //��ʼ״̬����panel
                opts.dismissible && me.$panelMask.hide().on('click', $.proxy(me._eventHandler, me));    //��mask�ϵĹر��¼�
                opts.scrollMode !== 'follow' && $(window).on('scrollStop', $.proxy(me._eventHandler, me));
                $(window).on('ortchange', $.proxy(me._eventHandler, me));
            } );
        },

        _create: function () {
            if(this._options.setup){
                var me = this,
                    opts = me._options,
                    $el = me.$el.addClass('ui-panel ui-panel-'+ opts.position);

                me.panelWidth = $el.width() || 0;
                me.$contentWrap = $(opts.contentWrap || $el.next());
                opts.dismissible && ( me.$panelMask = $('<div class="ui-panel-dismiss"></div>').width(document.body.clientWidth - $el.width()).appendTo('body') || null);
            }else{
                throw new Error('panel�����֧��createģʽ����ʹ��setupģʽ');
            }
        },
        
        /**
         * ����displayģʽ����
         * */
        _setDisplay: function () {
            var me = this,
                $panel = me.$el,
                $contentWrap = me.$contentWrap,
                transform = cssPrefix + 'transform',
                posData = me._transDisplayToPos(),
                obj = {}, panelPos, contPos;

            $.each(['push', 'overlay', 'reveal'], function (i,display) {
                obj[display] = function (isOpen, pos, isClear) {   //isOpen:�Ǵ򿪻��ǹرղ�����pos:���һ����򿪹رգ�isClear:�Ƿ��ǳ�ʼ������
                    panelPos = posData[display].panel, contPos = posData[display].cont;
                    $panel.css(transform, 'translate3d(' + me._transDirectionToPos(pos, panelPos[isOpen]) + 'px,0,0)');
                    if (!isClear) {
                        $contentWrap.css(transform, 'translate3d(' + me._transDirectionToPos(pos, contPos[isOpen]) + 'px,0,0)');
                        me.maskTimer = setTimeout(function () {      //��ֹ���ע��tap��͸���������ӳ�
                            me.$panelMask && me.$panelMask.css(pos, $panel.width()).toggle(isOpen);
                        }, 400);    //�ı�mask left/rightֵ
                    }
                    return me;
                }
            });
            return obj;
        },
        /**
         * ��ʼ��panelλ�ã�ÿ�δ�֮ǰ����λ�ÿ��ܲ�ͬ�����Ծ�������
         * */
        _initPanelPos: function (dis, pos) {
            this.displayFn[dis](0, pos, true);
            this.$el.get(0).clientLeft;    //����ҳ��reflow��ʹ��ui-panel-animate��ʽ����Ч
            return this;
        },
        /**
         * ��λ�ã�����ң�ת��Ϊ��ֵ
         * */
        _transDirectionToPos: function (pos, val) {
            return pos === 'left' ? val : -val;
        },
        /**
         * ����ģʽ��push,overlay,reveal��ת��Ϊ��ֵ
         * */
        _transDisplayToPos: function () {
            var me = this,
                panelWidth = me.panelWidth;
            return {
                push: {
                    panel: [-panelWidth, 0],    //[from, to] for panel
                    cont: [0, panelWidth]       //[from, to] for contentWrap
                },
                overlay: {
                    panel: [-panelWidth, 0],
                    cont: [0, 0]
                },
                reveal: {
                    panel: [0, 0],
                    cont: [0, panelWidth]
                }
            }
        },
        /**
         * ������ʾ��رգ��ر�ʱ�Ĳ���������ģʽ�������������ʱ��ͬ
         * */
        _setShow: function (isOpen, dis, pos) {
            var me = this,
                opts = me._options,
                eventName = isOpen ? 'open' : 'close',
                beforeEvent = $.Event('before' + eventName),
                changed = isOpen !== me.state(),
                _eventBinder = isOpen ? 'on' : 'off',
                _eventHandler = isOpen ? $.proxy(me._eventHandler, me) : me._eventHandler,
                _dis = dis || opts.display,
                _pos = pos || opts.position;

            me.trigger(beforeEvent, [dis, pos]);
            if (beforeEvent.isDefaultPrevented()) return me;
            if (changed) {
                me._dealState(isOpen, _dis, _pos);    //�رջ���ʾʱ������״̬
                me.displayFn[_dis](me.isOpen = Number(isOpen), _pos);   //����ģʽ�ʹ򿪷��򣬲���panel
                opts.swipeClose && me.$el[_eventBinder]($.camelCase('swipe-' + _pos), _eventHandler);     //����panel�ر�
                opts.display = _dis, opts.position = _pos;
            }
            return me;
        },
        /**
         * �򿪻�ر�ǰ��״̬���ò�����������ʽ��λ�õ�
         * */
        _dealState: function (isOpen, dis, pos) {
            var me = this,
                opts = me._options,
                $panel = me.$el,
                $contentWrap = me.$contentWrap,
                addCls = 'ui-panel-' + dis + ' ui-panel-' + pos,
                removeCls = 'ui-panel-' + opts.display + ' ui-panel-' + opts.position + ' ui-panel-animate';

            if (isOpen) {
                $panel.removeClass(removeCls).addClass(addCls).show();
                opts.scrollMode === 'fix' && $panel.css('top', $(window).scrollTop());    //fixģʽ��
                me._initPanelPos(dis, pos);      //panel��contentWrapλ�ó�ʼ��
                if (dis === 'reveal') {
                    $contentWrap.addClass('ui-panel-contentWrap').on(transitionEnd, $.proxy(me._eventHandler, me));    //revealģʽ��panel������transitionEnd;
                } else {
                    $contentWrap.removeClass('ui-panel-contentWrap').off(transitionEnd, $.proxy(me._eventHandler, me));
                    $panel.addClass('ui-panel-animate');
                }
                me.$panelMask && me.$panelMask.css({     //panel mask״̬��ʼ��
                    'left': 'auto',
                    'right': 'auto',
                    'height': document.body.clientHeight
                });
            }
            return me;
        },

        _eventHandler: function (e) {
            var me = this,
                opts = me._options,
                scrollMode = opts.scrollMode,
                eventName = me.state() ? 'open' : 'close';

            switch (e.type) {
                case 'click':
                case 'swipeLeft':
                case 'swipeRight':
                    me.close();
                    break;
                case 'scrollStop':
                    scrollMode === 'fix' ? me.$el.css('top', $(window).scrollTop()) : me.close();
                    break;
                case transitionEnd:
                    me.trigger(eventName, [opts.display, opts.position]);
                    break;
                case 'ortchange':   //����ת��ʱ��mask�Ĵ���
                    me.$panelMask && me.$panelMask.css('height', document.body.clientHeight);
                    scrollMode === 'fix' && me.$el.css('top', $(window).scrollTop());     //ת������topֵ
                    break;
            }
        },
        
        /**
         * ��panel
         * @method open
         * @param {String} [display] ��ѡֵ��('overlay' | 'reveal' | 'push')��Ĭ��Ϊ��ʼ��ʱ���õ�ֵ��Panel����ģʽ��overlay��ʾ����reveal��ʾ��content�±�չʾ��push��ʾpanel��content�Ƴ�
         * @param {String} position ��ѡֵ��('left' | 'right'����Ĭ��Ϊ��ʼ��ʱ���õ�ֵ�����ұ߻����
         * @chainable
         * @return {self} ���ر���
         */
        open: function (display, position) {
            return this._setShow(true, display, position);
        },
        
        /**
         * �ر�panel
         * @method close
         * @chainable
         * @return {self} ���ر���
         */
        close: function () {
            return this._setShow(false);
        },
        
        /**
         * �л�panel�Ĵ򿪻�ر�״̬
         * @method toggle
         * @param {String} [display] ��ѡֵ��('overlay' | 'reveal' | 'push')��Ĭ��Ϊ��ʼ��ʱ���õ�ֵ��Panel����ģʽ��overlay��ʾ����reveal��ʾ��content�±�չʾ��push��ʾpanel��content�Ƴ�
         * @param {String} position ��ѡֵ��('left' | 'right'����Ĭ��Ϊ��ʼ��ʱ���õ�ֵ�����ұ߻����
         * @chainable
         * @return {self} ���ر���
         */
        toggle: function (display, position) {
            return this[this.isOpen ? 'close' : 'open'](display, position);
        },
        
        /**
         * ��ȡ��ǰpanel״̬����Ϊtrue,�ر�Ϊfalse
         * @method state
         * @chainable
         * @return {self} ���ر���
         */
        state: function () {
            return !!this.isOpen;
        },
        
        /**
         * �������
         * @method destroy
         */
        destroy:function () {
            this.$panelMask && this.$panelMask.off().remove();
            this.maskTimer && clearTimeout(this.maskTimer);
            this.$contentWrap.removeClass('ui-panel-animate');
            $(window).off('scrollStop', this._eventHandler);
            $(window).off('ortchange', this._eventHandler);
            return this.$super('destroy');
        }
        
        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */
        
        /**
         * @event beforeopen
         * @param {Event} e gmu.Event����
         * @description panel��ǰ����������ͨ��e.preventDefault()����ֹ
         */
        
        /**
         * @event open
         * @param {Event} e gmu.Event����
         * @description panel�򿪺󴥷�
         */
        
        /**
         * @event beforeclose
         * @param {Event} e gmu.Event����
         * @description panel�ر�ǰ����������ͨ��e.preventDefault()����ֹ
         */
        
        /**
         * @event close
         * @param {Event} e gmu.Event����
         * @description panel�رպ󴥷�
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    });

})( gmu, gmu.$ );

/**
 * @file �Ƿ���ʵ��ͷ
 * @import widget/popover/popover.js
 */
(function( gmu ) {
    var Popover = gmu.Popover;

    Popover.template.arrow = '<span class="ui-arrow"></span>';

    /**
     * @property {Boolean} [arrow=true] �Ƿ���ʾ��ͷ
     * @namespace options
     * @for Popover
     * @uses Popover.arrow
     */
    Popover.options.arrow = true;    // Ĭ�Ͽ���arrow

    /**
     * ��չPopover��ʾ��ͷ���ܡ������ļ������Popoverʵ�����Զ�������ʾ��ͷ��
     * ��ͷ��λ�û���ݲ�ͬ��placement��ʾ�ڲ�ͬ��λ�á�
     * @class arrow
     * @namespace Popover
     * @pluginfor Popover
     */
    Popover.option( 'arrow', true, function() {
        var me = this,
            opts = me._options;

        // ��û�д���offset��ʱ��Ĭ����arrow�ͻ��10pxƫ��
        opts.offset = opts.offset || function( coord, placement ) {
            placement = placement.split( '_' )[ 0 ];
            return {
                left: (placement === 'left' ? -1 :
                        placement === 'right' ? 1 : 0) * 15,
                top: (placement === 'top' ? -1 :
                        placement === 'bottom' ? 1 : 0) * 15
            };
        };

        me.on( 'done.dom', function( e, $root ) {
            $root.append( me.tpl2html( 'arrow' ) ).addClass( 'ui-pos-default' );
        } );

        me.on( 'after.placement', function( e, coord, info ) {
            var root = this.$root[ 0 ],
                cls = root.className,
                placement = info.placement,
                align = info.align || '';

            root.className = cls.replace( /(?:\s|^)ui-pos-[^\s$]+/g, '' ) +
                ' ui-pos-' + placement + (align ? '-' + align : '');
        } );
    } );
})( gmu );
/**
 * @file ��ײ��⣬����ָ����������������λ����ʾ
 * @import widget/popover/popover.js
 */
(function( gmu, $ ) {

    /**
     * @property {Boolean} [collision=true] ������ײ��⡣
     * @namespace options
     * @uses Popover.collision
     * @for Popover
     */
    gmu.Popover.options.collision = true;

    /**
     * ��ײ��⣬������placement����������Ƿ�����ȫ��ʾ���ݵĲ��ԣ���ѡ����ʵ�placement.
     * @class collision
     * @namespace Popover
     * @pluginfor Popover
     */
    gmu.Popover.option( 'collision', true, function() {
        var me = this,
            opts = me._options;

        // ��ȡwithin������Ϣ
        // ������window, document����element.
        // withinΪ��ײ����������
        function getWithinInfo( raw ) {
            var $el = $( raw );

            raw = $el[ 0 ];

            if ( raw !== window && raw.nodeType !== 9 ) {
                return $el.offset();
            }

            return {
                width: $el.width(),
                height: $el.height(),
                top: raw.pageYOffset || raw.scrollTop || 0,
                left: raw.pageXOffset || raw.scrollLeft || 0
            };
        }

        // �ж��Ƿ�û����ס
        function isInside( coord, width, height, within ) {
            return coord.left >= within.left &&
                    coord.left + width <= within.left + within.width &&
                    coord.top >= within.top &&
                    coord.top + height <= within.top + within.height;
        }

        // ���¼���Դ��placement.js, ��Ҫ�����޸Ķ�λ����ֵ��
        me.on( 'before.placement', function( e, coord, info, presets ) {
            var within = getWithinInfo( opts.within || window ),
                now = info.placement,
                orig = info.coord,
                aviable = Object.keys( presets ),
                idx = aviable.indexOf( now ) + 1,
                swap = aviable.splice( idx, aviable.length - idx );

            // �ӵ�ǰplacement����һ����ʼ����ೢ��һȦ��
            // �������ȫû�б���ס��λ�ã�������ѭ��
            // �������һȦ��û�к��ʵ�λ�ã�������ԭ���ĳ�ʼλ�ö�λ
            aviable = swap.concat( aviable );

            while ( aviable.length && !isInside( coord, orig.width,
                    orig.height, within ) ) {
                now = aviable.shift();
                $.extend( coord, presets[ now ]() );
            }
            info.preset = now;
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file �Ƿ����������򣬹ر��Լ�
 * @import widget/popover/popover.js
 */
(function( gmu, $ ) {
    var Popover = gmu.Popover;

    /**
     * @property {Boolean} [dismissible=true] �Ƿ����������򣬹ر��Լ�.
     * @namespace options
     * @uses Popover.dismissible
     * @for Popover
     */
    Popover.options.dismissible = true;

    /**
     * ����ʵ���Զ��رչ��ܣ��ڵ�����򿪵������£��������λ�ã����Զ��رմ˵����㡣
     * �˹��ܰ������ʵ����Ļ��⹦�ܡ�
     * @class dismissible
     * @namespace Popover
     * @pluginfor Popover
     */
    Popover.option( 'dismissible', true, function() {
        var me = this,
            $doc = $( document ),
            click = 'click' + me.eventNs;

        function isFromSelf( target ) {
            var doms = me.$target.add( me.$root ).get(),
                i = doms.length;

            while ( i-- ) {
                if ( doms[ i ] === target ||
                        $.contains( doms[ i ], target ) ) {
                    return true;
                }
            }
            return false;
        }

        me.on( 'show', function() {
            $doc.off( click ).on( click, function( e ) {
                isFromSelf( e.target ) || me.hide();
            } );
        } );

        me.on( 'hide', function() {
            $doc.off( click );
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file �򵥰涨λ
 * @import widget/popover/popover.js, extend/offset.js
 */
(function( gmu, $ ) {

    /**
     * @property {String} [placement="bottom"] ���ö�λλ�á�
     * @namespace options
     * @uses Popover.placement
     * @for Popover
     */

    /**
     * @property {Object|Function} [offset=null] ����ƫ������
     * @namespace options
     * @for Popover
     * @uses Popover.placement
     */
    $.extend( gmu.Popover.options, {
        placement: 'bottom',    // Ĭ���������·���ʾ
        offset: null
    } );

    /**
     * ֧�ֵ���������ڰ�ť�������Ҷ�λ��
     * @class placement
     * @namespace Popover
     * @pluginfor Popover
     */
    gmu.Popover.option( 'placement', function( val ) {
        return ~[ 'top', 'bottom', 'left', 'right' ].indexOf( val );
    }, function() {

        var me = this,

            // ��һ��ֵ�������Ŀ��λ�õ�ˮƽλ��
            // �ڶ���ֵ�������Ŀ��λ�õĴ�ֱλ��
            // ������ֵ�����ĵ��ˮƽλ��
            // ���ĸ�ֵ�����ĵ�Ĵ�ֱλ��
            config = {
                'top': 'center top center bottom',
                'right': 'right center left center',
                'bottom': 'center bottom center top',
                'left': 'left center right center'
            },
            presets = {},    // ֧�ֵĶ�λ��ʽ��

            info;

        // �������������ɷ�����
        $.each( config, function( preset, args ) {
            args = args.split( /\s/g );
            args.unshift( preset );
            presets[ preset ] = function() {
                return placement.apply( null, args );
            };
        } );

        function getPos( pos, len ) {
            return pos === 'right' || pos === 'bottom' ? len :
                        pos === 'center' ? len / 2 : 0;
        }

        // ��ʱ�ü򵥵ķ�ʽʵ�֣��Ժ��ǲ���position.js
        function placement( preset, atH, atV, myH, myV ) {
            var of = info.of,
                coord = info.coord,
                offset = info.offset,
                top = of.top,
                left = of.left;

            left += getPos( atH, of.width ) - getPos( myH, coord.width );
            top += getPos( atV, of.height ) - getPos( myV, coord.height );

            // offset������fn
            offset = typeof offset === 'function' ? offset.call( null, {
                left: left,
                top: top
            }, preset ) : offset || {};

            return {
                left: left + (offset.left || 0),
                top: top + (offset.top || 0)
            };
        }

        // ���¼���
        this.on( 'placement', function( e, $el, $of ) {
            var me = this,
                opts = me._options,
                placement = opts.placement,
                coord;

            info = {
                coord: $el.offset(),
                of: $of.offset(),
                placement: placement,
                $el: $el,
                $of: $of,
                offset: opts.offset
            };

            // ���ó�ʼֵ
            coord = presets[ placement ]();

            // �ṩ����������֮ǰ�޸�λ��
            me.trigger( 'before.placement', coord, info, presets );
            info.preset && (info.placement = info.preset);
            $el.offset( coord );

            // �ṩ��arrowλ�ö�λ��
            me.trigger( 'after.placement', coord, info );
        } );

        // ����Ļ��ת��ʱ����Ҫ��Ҫ���¼��㡣
        $( window ).on( 'ortchange', function() {
            me._visible && me.trigger( 'placement', me.$target, me.$root );
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file ���������
 * @import extend/touch.js, core/widget.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    
    /**
     * ���������
     *
     * @class Progressbar
     * @constructor Html����
     * ```html
     * <div id="progressbar"></div>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#progressbar').progressbar();
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ����������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Progressbar:options)
     * @grammar $( el ).progressbar( options ) => zepto
     * @grammar new gmu.Progressbar( el, options ) => instance
     */
    gmu.define('Progressbar', {

        options: {

            /**
             * @property {Nubmer} [initValue=0] ��ʼʱ���ȵİٷֱȣ���Ҫ�ٷֺ�
             * @namespace options
             */
            initValue:          0,

            /**
             * @property {Boolean} [horizontal=true] ����Ƿ�Ϊ����(����Ϊfalse,��Ϊ����)
             * @namespace options
             */
            horizontal:         true,

            /**
             * @property {Number} [transitionDuration=300] ��ť����ʱ����Ч��������ʱ��,��λΪms,��Ϊ0���޶���
             * @namespace options
             */
            transitionDuration: 300,
            _isShow:            true,
            _current:           0,
            _percent:           0
        },

        _init: function() {
            var me = this,
                $el,
                _eventHandler,
                _button,
                _background,
                _offset;

            me.on( 'ready', function(){
                $el = me.$el,
                _eventHandler = $.proxy(me._eventHandler, me),
                _button = $el.find('.ui-progressbar-button'),
                _background = $el.find('.ui-progressbar-bg'),
                _offset = $el.offset();

                _button.on('touchstart touchmove touchend touchcancel', _eventHandler);
                _background.on('touchstart', _eventHandler);
                $.extend( me._options, {
                    _button:        _button[0],
                    $_background:    _background,
                    _filled:        $el.find('.ui-progressbar-filled')[0],
                    _width:         _offset.width,
                    _height:        _offset.height
                });
                me._options['horizontal'] && _offset.width && $el.width(_offset.width);
                me._options['initValue'] > 0 && me.value( me._options['initValue']);
            } );

            me.on( 'destroy', function() {
                if ( !me._options.setup ) {
                    me.$el.remove();
                }
            } );
        },

        _create: function() {
            var me = this,
                direction = me._options['horizontal'] ? 'h' : 'v';

            if ( !me.$el ) {
                me.$el = $('<div></div>');
            }
            me.$el.addClass('ui-progressbar-' + direction).appendTo(me._options['container'] || (me.$el.parent().length ? '' : document.body)).html(
                ('<div class="ui-progressbar-bg"><div class="ui-progressbar-filled"></div><div class="ui-progressbar-button"><div><b></b></div></div></div>'));
        },

        _eventHandler: function(e) {
            var me = this;

            switch (e.type) {
                case 'touchmove':
                    me._touchMove(e);
                    break;
                case 'touchstart':
                    $(e.target).hasClass('ui-progressbar-bg') ? me._click(e) : me._touchStart(e);
                    break;
                case 'touchcancel':
                case 'touchend':
                    me._touchEnd();
                    break;
                case 'tap':
                    me._click(e);
                    break;
            }
        },

        _touchStart: function(e) {
            var me = this,
                opts = me._options;

            $.extend( me._options, {
                pageX:      e.touches[0].pageX,
                pageY:      e.touches[0].pageY,
                S:          false,      //isScrolling
                T:          false,      //isTested
                X:          0,          //horizontal moved
                Y:          0           //vertical moved
            });

            opts._button.style.webkitTransitionDuration = '0ms';
            opts._filled.style.webkitTransitionDuration = '0ms';
            $(opts._button).addClass('ui-progressbar-button-pressed');
            me.trigger('dragStart');
        },

        _touchMove: function(e) {
            var me = this,
                opts = me._options,
                touch = e.touches[0],
                X = touch.pageX - opts.pageX,
                Y = touch.pageY - opts.pageY,
                _percent;

            if(!opts.T) {
                var S = Math.abs(X) < Math.abs(touch.pageY - opts.pageY);
                opts.T = true;
                opts.S = S;
            }
            if(opts.horizontal) {
                if(!opts.S) {
                    e.stopPropagation();
                    e.preventDefault();
                    _percent =  (X + opts._current) / opts._width * 100;
                    if(_percent <= 100 && _percent >= 0) {
                        opts._percent = _percent;
                        opts.X = X;
                        opts._button.style.webkitTransform = 'translate3d(' + (opts.X + opts._current) + 'px,0,0)';
                        opts._filled.style.width = _percent + '%';
                        me.trigger('valueChange');
                    }
                    me.trigger('dragMove');
                }
            } else {
                if(opts.S) {
                    e.stopPropagation();
                    e.preventDefault();
                    _percent = -(opts._current + Y) / opts._height * 100;
                    if(_percent <= 100 && _percent >= 0) {
                        opts._percent = _percent;
                        opts.Y = Y;
                        opts._button.style.webkitTransform = 'translate3d(0,' + (Y + opts._current) + 'px,0)';
                        opts._filled.style.cssText += 'height:' + _percent + '%;top:' + (opts._height + Y + opts._current) + 'px';
                        me.trigger('valueChange');
                    }
                    me.trigger('dragMove');
                }
            }
        },

        _touchEnd: function() {
            var me = this,
                opts = me._options;

            opts._current += opts.horizontal ? opts.X : opts.Y;
            $(opts._button).removeClass('ui-progressbar-button-pressed');
            me.trigger('dragEnd');
        },

        _click: function(e) {
            var me = this,
                opts = me._options,
                rect = opts.$_background.offset(),
                touch = e.touches[0];

            opts.horizontal ?
                me.value((touch.pageX - rect.left) / opts._width * 100) :
                me.value((opts._height - touch.pageY + rect.top) / opts._height * 100);
        },

        /**
         * ��ȡ/����progressbar��ֵ
         * @method value
         * @param {Number} [opts] Ҫ���õ�ֵ��������ʾȡֵ
         * @chainable
         * @return {self} ���ر���
         */
        value: function(value) {
            var me = this,
                opts = me._options,
                _current, duration;

            if(value === undefined) {
                return opts._percent;
            } else {
                value = parseFloat(value);
                if(isNaN(value)) return me;
                value = value > 100 ? 100 : value < 0 ? 0 : value;
                opts._percent = value;
                duration = ';-webkit-transition-duration:' + opts.transitionDuration + 'ms';
                if(opts.horizontal) {
                    _current = opts._current = opts._width * value / 100;
                    opts._button.style.cssText += '-webkit-transform:translate3d(' + _current + 'px,0,0)' + duration;
                    opts._filled.style.cssText += 'width:'+ value + '%' + duration;
                } else {
                    _current = opts._current = opts._height * value / -100;
                    opts._button.style.cssText += '-webkit-transform:translate3d(0,' + _current + 'px,0)' + duration;
                    opts._filled.style.cssText += 'height:' + value + '%;top:' + (opts._height + _current) + 'px' + duration;
                }
                me.trigger('valueChange');
                return me;
            }
        },

        /**
         * ��ʾprogressbar
         * @method show
         * @chainable
         * @return {self} ���ر���
         */
        show: function() {
            var me = this;

            if(!me._options['_isShow']){
                me.$el.css('display', 'block');
                me._options['_isShow'] = true;
            }

            return me;
        },

        /**
         * ����progressbar
         * @method hide
         * @chainable
         * @return {self} ���ر���
         */
        hide: function() {
            var me = this;

            if(me._options['_isShow']) {
                me.$el.css('display', 'none');
                me._options['_isShow'] = false;
            }

            return me;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */
        
        /**
         * @event dragStart
         * @param {Event} e gmu.Event����
         * @description �϶���������ʼʱ�������¼�
         */
        
        /**
         * @event dragMove
         * @param {Event} e gmu.Event����
         * @description �϶������������д������¼�
         */
        
        /**
         * @event dragEnd
         * @param {Event} e gmu.Event����
         * @description �϶�����������ʱ�������¼�
         */
        
        /**
         * @event valueChange
         * @param {Event} e gmu.Event����
         * @description progressbar��ֵ�б仯ʱ�������϶�progressbarʱ��ֵ��һ����仯��
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    });
})( gmu, gmu.$ );

/**
 * @file ���ظ������
 * @import core/widget.js
 * @importCSS loading.css
 * @module GMU
 */

(function( gmu, $, undefined ) {
    
    /**
     * ���ظ������
     *
     * @class Refresh
     * @constructor Html����
     * ```html
     * <div class="ui-refresh">
     *    <ul class="data-list">...</ul>
     *    <div class="ui-refresh-down"></div><!--setup��ʽ����classΪui-refresh-down��ui-refresh-up��Ԫ�ر�����ϣ����ڷ�refresh��ť-->
     * </div>

     * ```
     *
     * javascript����
     * ```javascript
     * $('.ui-refresh').refresh({
     *      load: function (dir, type) {
     *          var me = this;
     *          $.getJSON('../../data/refresh.php', function (data) {
     *              var $list = $('.data-list'),
     *                      html = (function (data) {      //������Ⱦ
     *                          var liArr = [];
     *                          $.each(data, function () {
     *                              liArr.push(this.html);
     *                          });
     *                          return liArr.join('');
     *                      })(data);
     *              $list[dir == 'up' ? 'prepend' : 'append'](html);
     *              me.afterDataLoading();    //���ݼ�����ɺ�ı�״̬
     *          });
     *      }
     *  });
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ��Refresh��Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Refresh:options)
     * @grammar $( el ).refresh( options ) => zepto
     * @grammar new gmu.Refresh( el, options ) => instance
     */
    gmu.define( 'Refresh', {
        options: {

            /**
             * @property {Function} load �������ť�����߻����ﵽ�ɼ�����������ʱ���˷����ᱻ���á���Ҫ�ڴ˷����������ajax�������󣬲���������󣬵���afterDataLoading()��֪ͨrefresh������ı�״̬��
             * @namespace options
             */
            load: null,

            /**
             * @property {Function} [statechange=null] ��ʽ�ı�ʱ���������¼����Ա���ֹ����ֹ������Զ��������ʽ���ص�������event(�¼�����), elem(refresh��ťԪ��), state(״̬), dir(����)
             * @namespace options
             */
            statechange: null
        },

        _init: function() {
            var me = this,
                opts = me._options;

            me.on( 'ready', function(){
                $.each(['up', 'down'], function (i, dir) {
                    var $elem = opts['$' + dir + 'Elem'],
                        elem = $elem.get(0);

                    if ($elem.length) {
                        me._status(dir, true);    //��ʼ���ü���״̬Ϊ����
                        if (!elem.childNodes.length || ($elem.find('.ui-refresh-icon').length && $elem.find('.ui-refresh-label').length)) {    //������Ϊ���򴴽�����������icon��label��Ҫ����������
                            !elem.childNodes.length && me._createBtn(dir);
                            opts.refreshInfo || (opts.refreshInfo = {});
                            opts.refreshInfo[dir] = {
                                $icon: $elem.find('.ui-refresh-icon'),
                                $label: $elem.find('.ui-refresh-label'),
                                text: $elem.find('.ui-refresh-label').html()
                            }
                        }
                        $elem.on('click', function () {
                            if (!me._status(dir) || opts._actDir) return;         //����Ƿ��ڿ���״̬��ͬһ�����ϵ����ڼ����У����߲�ͬ����Ļ�δ������� traceID:FEBASE-569
                            me._setStyle(dir, 'loading');
                            me._loadingAction(dir, 'click');
                        });
                    }
                });
            } );

            me.on( 'destroy', function(){
                me.$el.remove();
            } );
        },

        _create: function(){
            var me = this,
                opts = me._options,
                $el = me.$el;

            if( me._options.setup ) {
                // ֵ֧��setupģʽ������ֱ�Ӵ�DOM��ȡԪ��
                opts.$upElem = $el.find('.ui-refresh-up');
                opts.$downElem = $el.find('.ui-refresh-down');
                $el.addClass('ui-refresh');
            }
        },

        _createBtn: function (dir) {
            if(dir == 'up'){
                this._options['$' + dir + 'Elem'].html('<span class="ui-refresh-icon"></span><span class="ui-refresh-label">'+td_lang.pda.msg_4 || "����ˢ��"+'</span>');
            }else{
                this._options['$' + dir + 'Elem'].html('<span class="ui-refresh-icon"></span><span class="ui-refresh-label">'+td_lang.pda.msg_6 || "���ظ���"+'</span>');
            }
            

            return this;
        },

        _setStyle: function (dir, state) {
            var me = this,
                stateChange = $.Event('statechange');

            me.trigger(stateChange, me._options['$' + dir + 'Elem'], state, dir);
            if ( stateChange.defaultPrevented ) {
                return me;
            }

            return me._changeStyle(dir, state);
        },

        _changeStyle: function (dir, state) {
            var opts = this._options,
                refreshInfo = opts.refreshInfo[dir];

            switch (state) {
                case 'loaded':
                    refreshInfo['$label'].html(refreshInfo['text']);
                    refreshInfo['$icon'].removeClass();
                    opts._actDir = '';
                    break;
                case 'loading':
                    refreshInfo['$label'].html(td_lang.pda.msg_2 || '������...');
                    refreshInfo['$icon'].addClass('ui-loading');
                    opts._actDir = dir;
                    break;
                case 'disable':
                    refreshInfo['$label'].html(td_lang.pda.msg_1 || 'û�и���������');
                    break;
            }

            return this;
        },

        _loadingAction: function (dir, type) {
            var me = this,
                opts = me._options,
                loadFn = opts.load;

            $.isFunction(loadFn) && loadFn.call(me, dir, type);
            me._status(dir, false);

            return me;
        },

        /**
         * ���������load����load��ͨ��ajax�������ݻ�������Ҫ���ô˷��������ı�refresh״̬��
         * @method afterDataLoading
         * @param {String} dir ���صķ���'up' | 'down'��
         * @chainable
         * @return {self} ���ر���
         */
        afterDataLoading: function (dir) {
            var me = this,
                dir = dir || me._options._actDir;

            me._setStyle(dir, 'loaded');
            me._status(dir, true);

            return me;
        },

        /**
         * �������ü����Ƿ���ã��ַ���ġ�
         * @param {String} dir ���صķ���'up' | 'down'��
         * @param {String} status ״̬��true | false��
         */
        _status: function(dir, status) {
            var opts = this._options;

            return status === undefined ? opts['_' + dir + 'Open'] : opts['_' + dir + 'Open'] = !!status;
        },

        _setable: function (able, dir, hide) {
            var me = this,
                opts = me._options,
                dirArr = dir ? [dir] : ['up', 'down'];

            $.each(dirArr, function (i, dir) {
                var $elem = opts['$' + dir + 'Elem'];
                if (!$elem.length) return;
                //����enable������ֱ����ʾ��disable�����text�Ƿ���true��ȷ���Ƿ�����
                able ? $elem.show() : (hide ?  $elem.hide() : me._setStyle(dir, 'disable'));
                me._status(dir, able);
            });

            return me;
        },

        /**
         * ����������ݿɼ���ʱ�����Ե��ô˷�����������Refresh��
         * @method disable
         * @param {String} dir ���صķ���'up' | 'down'��
         * @param {Boolean} hide �Ƿ����ذ�ť�����������Ϊfalse����ֻ�����ֱ仯��
         * @chainable
         * @return {self} ���ر���
         */
        disable: function (dir, hide) {
            return this._setable(false, dir, hide);
        },

        /**
         * �������
         * @method enable
         * @param {String} dir ���صķ���'up' | 'down'��
         * @chainable
         * @return {self} ���ر���
         */
        enable: function (dir) {
            return this._setable(true, dir);
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */
        
        /**
         * @event statechange
         * @param {Event} e gmu.Event����
         * @param {Zepto} elem ��ťԪ��
         * @param {String} state ��ǰ�����״̬('loaded'��Ĭ��״̬��'loading'��������״̬��'disabled'������״̬����ʾ�����ݼ����ˣ�'beforeload'������û���ɿ�ǰ������ص�����״̬�� ��Ҫ���������д�״̬��lite��iscroll������iOS5)
         * @param {String} dir ���صķ���'up' | 'down'��
         * @description �������״̬�仯ʱ�ᴥ��
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */

    } );
})( gmu, gmu.$ );

/**
 * @file ͼƬ�ֲ����
 * @import extend/touch.js, extend/event.ortchange.js, core/widget.js
 * @module GMU
 */
(function( gmu, $, undefined ) {
    var cssPrefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd,

        // todo ���3d�Ƿ�֧�֡�
        translateZ = ' translateZ(0)';
    
    /**
     * ͼƬ�ֲ����
     *
     * @class Slider
     * @constructor Html����
     * ```html
     * <div id="slider">
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image1.png"></a>
     *       <p>1,��Coron��̫�����Լ�ɹ�ڡ�С��</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image2.png"></a>
     *       <p>2,��Coron��̫�����Լ�ɹ�ڡ�С��</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image3.png"></a>
     *       <p>3,��Coron��̫�����Լ�ɹ�ڡ�С��</p>
     *   </div>
     *   <div>
     *       <a href="http://www.baidu.com/"><img lazyload="image4.png"></a>
     *       <p>4,��Coron��̫�����Լ�ɹ�ڡ�С��</p>
     *   </div>
     * </div>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#slider').slider();
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ��Slider��Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Slider:options)
     * @grammar $( el ).slider( options ) => zepto
     * @grammar new gmu.Slider( el, options ) => instance
     */
    gmu.define( 'Slider', {

        options: {

            /**
             * @property {Boolean} [loop=false] �Ƿ���������
             * @namespace options
             */
            loop: false,
            
            /**
             * @property {Number} [speed=400] ����ִ���ٶ�
             * @namespace options
             */
            speed: 400,

            /**
             * @property {Number} [index=0] ��ʼλ��
             * @namespace options
             */
            index: 0,

            /**
             * @property {Object} [selector={container:'.ui-slider-group'}] �ڲ��ṹѡ��������
             * @namespace options
             */
            selector: {
                container: '.ui-slider-group'    // ������ѡ����
            }
        },

        template: {
            item: '<div class="ui-slider-item"><a href="<%= href %>">' +
                    '<img src="<%= pic %>" alt="" /></a>' +
                    '<% if( title ) { %><p><%= title %></p><% } %>' +
                    '</div>'
        },

        _create: function() {
            var me = this,
                $el = me.getEl(),
                opts = me._options;

            me.index = opts.index;

            // ��ʼdom�ṹ
            me._initDom( $el, opts );

            // ����width
            me._initWidth( $el, me.index );
            me._container.on( transitionEnd + me.eventNs,
                    $.proxy( me._tansitionEnd, me ) );

            // ת���¼����
            $( window ).on( 'ortchange' + me.eventNs, function() {
                me._initWidth( $el, me.index );
            } );
        },

        _initDom: function( $el, opts ) {
            var selector = opts.selector,
                viewNum = opts.viewNum || 1,
                items,
                container;

            // ��������ڵ��Ƿ�ָ��
            container = $el.find( selector.container );

            // û��ָ�������򴴽�����
            if ( !container.length ) {
                container = $( '<div></div>' );

                // ���û�д���content, ��root�ĺ�����Ϊ�ɹ���item
                if ( !opts.content ) {

                    // ���⴦��ֱ����ul��ʼ��slider��case
                    if ( $el.is( 'ul' ) ) {
                        this.$el = container.insertAfter( $el );
                        container = $el;
                        $el = this.$el;
                    } else {
                        container.append( $el.children() );
                    }
                } else {
                    this._createItems( container, opts.content );
                }

                container.appendTo( $el );
            }

            // ����Ƿ񹹳�ѭ������
            if ( (items = container.children()).length < viewNum + 1 ) {
                opts.loop = false;
            }

            // ����ڵ����ˣ���Ҫ���Ƽ���
            while ( opts.loop && container.children().length < 3 * viewNum ) {
                container.append( items.clone() );
            }

            this.length = container.children().length;

            this._items = (this._container = container)
                    .addClass( 'ui-slider-group' )
                    .children()
                    .addClass( 'ui-slider-item' )
                    .toArray();

            this.trigger( 'done.dom', $el.addClass( 'ui-slider' ), opts );
        },

        // ����items��������ݰ���render���뵽container��
        _createItems: function( container, items ) {
            var i = 0,
                len = items.length;

            for ( ; i < len; i++ ) {
                container.append( this.tpl2html( 'item', items[ i ] ) );
            }
        },

        _initWidth: function( $el, index, force ) {
            var me = this,
                width;

            // widthû�б仯����Ҫ����
            if ( !force && (width = $el.width()) === me.width ) {
                return;
            }

            me.width = width;
            me._arrange( width, index );
            me.height = $el.height();
            me.trigger( 'width.change' );
        },

        // ����items
        _arrange: function( width, index ) {
            var items = this._items,
                i = 0,
                item,
                len;

            this._slidePos = new Array( items.length );

            for ( len = items.length; i < len; i++ ) {
                item = items[ i ];
                
                item.style.cssText += 'width:' + width + 'px;' +
                        'left:' + (i * -width) + 'px;';
                item.setAttribute( 'data-index', i );

                this._move( i, i < index ? -width : i > index ? width : 0, 0 );
            }

            this._container.css( 'width', width * len );
        },

        _move: function( index, dist, speed, immediate ) {
            var slidePos = this._slidePos,
                items = this._items;

            if ( slidePos[ index ] === dist || !items[ index ] ) {
                return;
            }

            this._translate( index, dist, speed );
            slidePos[ index ] = dist;    // ��¼Ŀ��λ��

            // ǿ��һ��reflow
            immediate && items[ index ].clientLeft;
        },

        _translate: function( index, dist, speed ) {
            var slide = this._items[ index ],
                style = slide && slide.style;

            if ( !style ) {
                return false;
            }

            style.cssText += cssPrefix + 'transition-duration:' + speed + 
                    'ms;' + cssPrefix + 'transform: translate(' + 
                    dist + 'px, 0)' + translateZ + ';';
        },

        _circle: function( index, arr ) {
            var len;

            arr = arr || this._items;
            len = arr.length;

            return (index % len + len) % arr.length;
        },

        _tansitionEnd: function( e ) {

            // ~~��������ת�����ȼ���parseInt( str, 10 );
            if ( ~~e.target.getAttribute( 'data-index' ) !== this.index ) {
                return;
            }
            
            this.trigger( 'slideend', this.index );
        },

        _slide: function( from, diff, dir, width, speed, opts ) {
            var me = this,
                to;

            to = me._circle( from - dir * diff );

            // �������loopģʽ����ʵ��λ�õķ���Ϊ׼
            if ( !opts.loop ) {
                dir = Math.abs( from - to ) / (from - to);
            }
            
            // ������ʼλ�ã�����Ѿ���λ���ϲ����ظ�����
            this._move( to, -dir * width, 0, true );

            this._move( from, width * dir, speed );
            this._move( to, 0, speed );

            this.index = to;
            return this.trigger( 'slide', to, from );
        },

        /**
         * �л����ڼ���slide
         * @method slideTo
         * @chainable
         * @param {Number} to Ŀ��slide�����
         * @param {Number} [speed] �л����ٶ�
         * @return {self} ���ر���
         */
        slideTo: function( to, speed ) {
            if ( this.index === to || this.index === this._circle( to ) ) {
                return this;
            }

            var opts = this._options,
                index = this.index,
                diff = Math.abs( index - to ),
                
                // 1����-1����
                dir = diff / (index - to),
                width = this.width;

            speed = speed || opts.speed;

            return this._slide( index, diff, dir, width, speed, opts );
        },

        /**
         * �л�����һ��slide
         * @method prev
         * @chainable
         * @return {self} ���ر���
         */
        prev: function() {
            
            if ( this._options.loop || this.index > 0 ) {
                this.slideTo( this.index - 1 );
            }

            return this;
        },

        /**
         * �л�����һ��slide
         * @method next
         * @chainable
         * @return {self} ���ر���
         */
        next: function() {
            
            if ( this._options.loop || this.index + 1 < this.length ) {
                this.slideTo( this.index + 1 );
            }

            return this;
        },

        /**
         * ���ص�ǰ��ʾ�ĵڼ���slide
         * @method getIndex
         * @chainable
         * @return {Number} ��ǰ��silde���
         */
        getIndex: function() {
            return this.index;
        },

        /**
         * �������
         * @method destroy
         */
        destroy: function() {
            this._container.off( this.eventNs );
            $( window ).off( 'ortchange' + this.eventNs );
            return this.$super( 'destroy' );
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event done.dom
         * @param {Event} e gmu.Event����
         * @param {Zepto} $el sliderԪ��
         * @param {Object} opts �����ʼ��ʱ��������
         * @description DOM������ɺ󴥷�
         */
        
        /**
         * @event width.change
         * @param {Event} e gmu.Event����
         * @description slider������ȷ����仯ʱ����
         */
        
        /**
         * @event slideend
         * @param {Event} e gmu.Event����
         * @param {Number} index ��ǰslide�����
         * @description slide�л���ɺ󴥷�
         */
        
        /**
         * @event slide
         * @param {Event} e gmu.Event����
         * @param {Number} to Ŀ��slide�����
         * @param {Number} from ��ǰslide�����
         * @description slide�л�ʱ����������л�ʱ�ж��������¼�����ʱ��slide��һ���Ѿ�����л���
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    } );

})( gmu, gmu.$ );
/**
 * @file �Զ����Ų��
 * @import widget/slider/slider.js
 */
(function( gmu, $ ) {
    $.extend( true, gmu.Slider, {
        options: {
            /**
             * @property {Boolean} [autoPlay=true] �Ƿ����Զ�����
             * @namespace options
             * @for Slider
             * @uses Slider.autoplay
             */
            autoPlay: true,
            /**
             * @property {Number} [interval=4000] �Զ����ŵļ��ʱ�䣨���룩
             * @namespace options
             * @for Slider
             * @uses Slider.autoplay
             */
            interval: 4000
        }
    } );

    /**
     * �Զ����Ų��
     * @class autoplay
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'autoplay', {
        _init: function() {
            var me = this;
            me.on( 'slideend ready', me.resume )

                    // ���timer
                    .on( 'destory', me.stop );

            // ���⻬��ʱ���Զ��л�
            me.getEl()
                    .on( 'touchstart' + me.eventNs, $.proxy( me.stop, me ) )
                    .on( 'touchend' + me.eventNs, $.proxy( me.resume, me ) );
        },

        /**
         * �ָ��Զ����š�
         * @method resume
         * @chainable
         * @return {self} ���ر���
         * @for Slider
         * @uses Slider.autoplay
         */
        resume: function() {
            var me = this,
                opts = me._options;

            if ( opts.autoPlay && !me._timer ) {
                me._timer = setTimeout( function() {
                    me.slideTo( me.index + 1 );
                    me._timer = null;
                }, opts.interval );
            }
            return me;
        },

        /**
         * ֹͣ�Զ�����
         * @method stop
         * @chainable
         * @return {self} ���ر���
         * @for Slider
         * @uses Slider.autoplay
         */
        stop: function() {
            var me = this;

            if ( me._timer ) {
                clearTimeout( me._timer );
                me._timer = null;
            }
            return me;
        }
    } );
})( gmu, gmu.$ );
/**
 * @file ͼƬ�����ز��
 * @import widget/slider/slider.js
 */
(function( gmu ) {

    gmu.Slider.template.item = '<div class="ui-slider-item">' +
            '<a href="<%= href %>">' +
            '<img lazyload="<%= pic %>" alt="" /></a>' +
            '<% if( title ) { %><p><%= title %></p><% } %>' +
            '</div>';

    /**
     * ͼƬ�����ز��
     * @class lazyloadimg
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'lazyloadimg', {
        _init: function() {
            this.on( 'ready slide', this._loadItems );
        },

        _loadItems: function() {
            var opts = this._options,
                loop = opts.loop,
                viewNum = opts.viewNum || 1,
                index = this.index,
                i,
                len;

            for ( i = index - viewNum, len = index + 2 * viewNum; i < len;
                    i++ ) {

                this.loadImage( loop ? this._circle( i ) : i );
            }
        },

        /**
         * ����ָ��item�е�ͼƬ
         * @method loadImage
         * @param {Number} index Ҫ���ص�ͼƬ�����
         * @for Slider
         * @uses Slider.lazyloadimg
         */
        loadImage: function( index ) {
            var item = this._items[ index ],
                images;

            if ( !item || !(images = gmu.staticCall( item, 'find',
                    'img[lazyload]' ), images.length) ) {

                return this;
            }

            images.each(function() {
                this.src = this.getAttribute( 'lazyload' );
                this.removeAttribute( 'lazyload' );
            });
        }
    } );
})( gmu );
/**
 * @file ͼƬ�ֲ���ָ������
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    
    var map = {
            touchstart: '_onStart',
            touchmove: '_onMove',
            touchend: '_onEnd',
            touchcancel: '_onEnd',
            click: '_onClick'
        },

        isScrolling,
        start,
        delta,
        moved;

    // �ṩĬ��options
    $.extend( gmu.Slider.options, {

        /**
         * @property {Boolean} [stopPropagation=false] �Ƿ���ֹ�¼�ð��
         * @namespace options
         * @for Slider
         * @uses Slider.touch
         */
        stopPropagation: false,

        /**
         * @property {Boolean} [disableScroll=false] �Ƿ���ֹ����
         * @namespace options
         * @for Slider
         * @uses Slider.touch
         */
        disableScroll: false
    } );

    /**
     * ͼƬ�ֲ���ָ������
     * @class touch
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.register( 'touch', {
        _init: function() {
            var me = this,
                $el = me.getEl();

            me._handler = function( e ) {
                me._options.stopPropagation && e.stopPropagation();
                return map[ e.type ] && me[ map[ e.type ] ].call( me, e );
            };

            me.on( 'ready', function() {

                // ������
                $el.on( 'touchstart' + me.eventNs, me._handler );
                
                // ��ֹ����, ��ԥtouchmove��preventDefault�ˣ����³���Ҳ�ᴥ��click
                me._container.on( 'click' + me.eventNs, me._handler );
            } );
        },

        _onClick: function() {
            return !moved;
        },

        _onStart: function( e ) {
                
            // �������ָ
            if ( e.touches.length > 1 ) {
                return false;
            }

            var me = this,
                touche = e.touches[ 0 ],
                opts = me._options,
                eventNs = me.eventNs,
                num;

            start = {
                x: touche.pageX,
                y: touche.pageY,
                time: +new Date()
            };

            delta = {};
            moved = false;
            isScrolling = undefined;

            num = opts.viewNum || 1;
            me._move( opts.loop ? me._circle( me.index - num ) :
                    me.index - num, -me.width, 0, true );
            me._move( opts.loop ? me._circle( me.index + num ) :
                    me.index + num, me.width, 0, true );

            me.$el.on( 'touchmove' + eventNs + ' touchend' + eventNs +
                    ' touchcancel' + eventNs, me._handler );
        },

        _onMove: function( e ) {

            // ��ָ�����Ų�����
            if ( e.touches.length > 1 || e.scale &&
                    e.scale !== 1 ) {
                return false;
            }

            var opts = this._options,
                viewNum = opts.viewNum || 1,
                touche = e.touches[ 0 ],
                index = this.index,
                i,
                len,
                pos,
                slidePos;

            opts.disableScroll && e.preventDefault();

            delta.x = touche.pageX - start.x;
            delta.y = touche.pageY - start.y;

            if ( typeof isScrolling === 'undefined' ) {
                isScrolling = Math.abs( delta.x ) <
                        Math.abs( delta.y );
            }

            if ( !isScrolling ) {
                e.preventDefault();

                if ( !opts.loop ) {

                    // �������Ѿ���ͷ
                    delta.x /= (!index && delta.x > 0 ||

                            // ����ұߵ�ͷ
                            index === this._items.length - 1 && 
                            delta.x < 0) ?

                            // ����һ���ļ���
                            (Math.abs( delta.x ) / this.width + 1) : 1;
                }

                slidePos = this._slidePos;

                for ( i = index - viewNum, len = index + 2 * viewNum;
                        i < len; i++ ) {

                    pos = opts.loop ? this._circle( i ) : i;
                    this._translate( pos, delta.x + slidePos[ pos ], 0 );
                }

                moved = true;
            }
        },

        _onEnd: function() {

            // ����¼�
            this.$el.off( 'touchmove' + this.eventNs + ' touchend' +
                    this.eventNs + ' touchcancel' + this.eventNs,
                    this._handler );

            if ( !moved ) {
                return;
            }

            var me = this,
                opts = me._options,
                viewNum = opts.viewNum || 1,
                index = me.index,
                slidePos = me._slidePos,
                duration = +new Date() - start.time,
                absDeltaX = Math.abs( delta.x ),

                // �Ƿ񻬳��߽�
                isPastBounds = !opts.loop && (!index && delta.x > 0 ||
                    index === slidePos.length - viewNum && delta.x < 0),

                // -1 ���� 1 ����
                dir = delta.x > 0 ? 1 : -1,
                speed,
                diff,
                i,
                len,
                pos;

            if ( duration < 250 ) {

                // ��������ٶȱȽϿ죬ƫ�����������ٶ�����
                speed = absDeltaX / duration;
                diff = Math.min( Math.round( speed * viewNum * 1.2 ),
                        viewNum );
            } else {
                diff = Math.round( absDeltaX / (me.perWidth || me.width) );
            }
            
            if ( diff && !isPastBounds ) {
                me._slide( index, diff, dir, me.width, opts.speed,
                        opts, true );
                
                // �������������Ҫ���ƶ�һ��
                if ( viewNum > 1 && duration >= 250 &&
                        Math.ceil( absDeltaX / me.perWidth ) !== diff ) {

                    me.index < index ? me._move( me.index - 1, -me.perWidth,
                            opts.speed ) : me._move( me.index + viewNum,
                            me.width, opts.speed );
                }
            } else {
                
                // ����ȥ
                for ( i = index - viewNum, len = index + 2 * viewNum;
                    i < len; i++ ) {

                    pos = opts.loop ? me._circle( i ) : i;
                    me._translate( pos, slidePos[ pos ], 
                            opts.speed );
                }
            }
        }
    } );
})( gmu, gmu.$ );
/**
 * @file ͼƬ�ֲ���ͷ��ť
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    $.extend( true, gmu.Slider, {

        template: {
            prev: '<span class="ui-slider-pre"></span>',
            next: '<span class="ui-slider-next"></span>'
        },

        options: {
            /**
             * @property {Boolean} [arrow=true] �Ƿ���ʾ��
             * @namespace options
             * @for Slider
             * @uses Slider.arrow
             */
            arrow: true,

            /**
             * @property {Object} [select={prev:'.ui-slider-pre',next:'.ui-slider-next'}] ��һ�ź���һ�Ű�ť��ѡ����
             * @namespace options
             * @for Slider
             * @uses Slider.arrow
             */
            select: {
                prev: '.ui-slider-pre',    // ��һ�Ű�ťѡ����
                next: '.ui-slider-next'    // ��һ�Ű�ťѡ����
            }
        }
    } );

    /**
     * ͼƬ�ֲ���ͷ��ť
     * @class arrow
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.option( 'arrow', true, function() {
        var me = this,
            arr = [ 'prev', 'next' ];

        this.on( 'done.dom', function( e, $el, opts ) {
            var selector = opts.selector;

            arr.forEach(function( name ) {
                var item = $el.find( selector[ name ] );
                item.length || $el.append( item = $( me.tpl2html( name ) ) );
                me[ '_' + name ] = item;
            });
        } );

        this.on( 'ready', function() {
            arr.forEach(function( name ) {
                me[ '_' + name ].on( 'tap' + me.eventNs, function() {
                    me[ name ].call( me );
                } );
            });
        } );

        this.on( 'destroy', function() {
            me._prev.off( me.eventNs );
            me._next.off( me.eventNs );
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file ͼƬ�ֲ���ʾ�㹦��
 * @import widget/slider/slider.js
 */
(function( gmu, $, undefined ) {
    $.extend( true, gmu.Slider, {

        template: {
            dots: '<p class="ui-slider-dots"><%= new Array( len + 1 )' +
                    '.join("<b></b>") %></p>'
        },

        options: {

            /**
             * @property {Boolean} [dots=true] �Ƿ���ʾ��
             * @namespace options
             * @for Slider
             * @uses Slider.dots
             */
            dots: true,

            /**
             * @property {Object} [selector={dots:'.ui-slider-dots'}] ���е㸸����ѡ����
             * @namespace options
             * @for Slider
             * @uses Slider.dots
             */
            selector: {
                dots: '.ui-slider-dots'
            }
        }
    } );

    /**
     * ͼƬ�ֲ���ʾ�㹦��
     * @class dots
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.option( 'dots', true, function() {
        
        var updateDots = function( to, from ) {
            var dots = this._dots;

            typeof from === 'undefined' || gmu.staticCall( dots[
                from % this.length ], 'removeClass', 'ui-state-active' );
            
            gmu.staticCall( dots[ to % this.length ], 'addClass',
                    'ui-state-active' );
        };

        this.on( 'done.dom', function( e, $el, opts ) {
            var dots = $el.find( opts.selector.dots );

            if ( !dots.length ) {
                dots = this.tpl2html( 'dots', {
                    len: this.length
                } );
                
                dots = $( dots ).appendTo( $el );
            }

            this._dots = dots.children().toArray();
        } );

        this.on( 'slide', function( e, to, from ) {
            updateDots.call( this, to, from );
        } );

        this.on( 'ready', function() {
            updateDots.call( this, this.index );
        } );
    } );
})( gmu, gmu.$ );
/**
 * @file ͼƬ�Զ���Ӧ����
 * @import widget/slider/slider.js
 */
(function( gmu ) {

    /**
     * @property {Boolean} [imgZoom=true] �Ƿ���ͼƬ����Ӧ
     * @namespace options
     * @for Slider
     * @uses Slider.dots
     */
    gmu.Slider.options.imgZoom = true;

    /**
     * ͼƬ�Զ���Ӧ����
     * @class imgZoom
     * @namespace Slider
     * @pluginfor Slider
     */
    gmu.Slider.option( 'imgZoom', function() {
        return !!this._options.imgZoom;
    }, function() {
        var me = this,
            selector = me._options.imgZoom,
            watches;

        selector = typeof selector === 'string' ? selector : 'img';

        function unWatch() {
            watches && watches.off( 'load' + me.eventNs, imgZoom );
        }

        function watch() {
            unWatch();
            watches = me._container.find( selector )
                    .on( 'load' + me.eventNs, imgZoom );
        }

        function imgZoom( e ) {
            var img = e.target || this,

                // ֻ���ţ�������
                scale = Math.min( 1, me.width / img.naturalWidth,
                    me.height / img.naturalHeight );
            
            img.style.width = scale * img.naturalWidth + 'px';
        }

        me.on( 'ready dom.change', watch );
        me.on( 'width.change', function() {
            watches && watches.each( imgZoom );
        } );
        me.on( 'destroy', unWatch );
    } );
})( gmu );
/**
 * @file �����������
 * @import core/widget.js, extend/touch.js, extend/highlight.js
 */
(function( $, win ) {

     /**
     * �����������
     *
     * @class Suggestion
     * @constructor Html����
     * ```html
     * <form action="http://www.baidu.com/s" method="get">
     *     <div class="search">
     *         <div class="search-input"><input type="text" id="input" name="wd"></div>
     *         <div class="search-button"><input type="submit" value="�ٶ�һ��"></div>
     *     </div>
     * </form>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#input').suggestion({
     *      source: "../../data/suggestion.php"
     *  });
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ��Suggestion��Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Suggestion:options)
     * @grammar $( el ).suggestion( options ) => zepto
     * @grammar new gmu.Suggestion( el, options ) => instance
     */
    
    var guid = 0;

    gmu.define( 'Suggestion', {

        // Ĭ��options
        options: {

            /**
             * @property {Element | Zepto | Selector} container ��Ԫ�أ���Ϊrenderģʽ����Ϊ��ѡ
             * @namespace options
             */
            
            /**
             * @property {String} source �������ݵ�url�������Զ���sendRequest����Ϊ��ѡ
             * @namespace options
             */
            
            /**
             * @property {String} [param=''] url���Ӳ���
             * @namespace options
             */
            
            /**
             * @property {String | Element} [form] �ύ�����ı���Ĭ��Ϊ����input��ĵ�һ������form
             * @namespace options
             */
            
            /**
             * @property {Boolean | String} [historyShare=true] ���sug֮���Ƿ�����ʷ��¼���ɴ���ָ����keyֵ������Ĭ�ϴ�true����ʹ��Ĭ��key��'SUG-Sharing-History'������false������ʾ������history������string����Ϊ��ֵ+'-SUG-Sharing-History'��Ϊkeyֵ
             * @namespace options
             */
            historyShare: true,

            /**
             * @property {Boolean} [confirmClearHistory=true] ɾ����ʷ��¼ʱ�Ƿ�ȷ��
             * @namespace options
             */
            confirmClearHistory: true,

            /**
             * @property {Boolean} [autoClose=true] ���input֮���Զ��ر�
             * @namespace options
             */
            autoClose: false
        },

        template: {

            // ui-suggestion��class������
            // ontent, button, clear, close�⼸��div�����У������Ŀ��Ը���
            wrapper: '<div class="ui-suggestion">' +
                '<div class="ui-suggestion-content"></div>' +
                '<div class="ui-suggestion-button">' +
                '<span class="ui-suggestion-clear">�����ʷ��¼</span>' +
                '<span class="ui-suggestion-close">�ر�</span>' +
                '</div></div>'
        },

        _initDom: function() {
            var me = this,
                $input = me.getEl().attr( 'autocomplete', 'off'),
                $parent = $input.parent('.ui-suggestion-mask');

            $parent.length ? me.$mask = $parent :
                    $input.wrap( me.$mask =
                    $( '<div class="ui-suggestion-mask"></div>' ) );

            // ������template��wrapper����Ⱦ�б�
            me.$mask.append( me.tpl2html( 'wrapper' ) );

            me.$wrapper = me.$mask.find( '.ui-suggestion' )
                    .prop('id', 'ui-suggestion-' + (guid++));
            me.$content = me.$wrapper
                    .css( 'top', $input.height() + (me.wrapperTop =
                    parseInt( me.$wrapper.css( 'top' ), 10 ) || 0) )
                    .find( '.ui-suggestion-content' );

            me.$btn = me.$wrapper.find( '.ui-suggestion-button' );
            me.$clearBtn = me.$btn.find( '.ui-suggestion-clear' );
            me.$closeBtn = me.$btn.find( '.ui-suggestion-close' );

            return me.trigger('initdom');
        },

        _bindEvent: function() {
            var me = this,
                $el = me.getEl(),
                ns = me.eventNs;

            me._options.autoClose && $( document ).on( 'tap' + ns, function( e ) {

                // ������ǵ�sug�����ر�sug
                !$.contains( me.$mask.get( 0 ), e.target ) && me.hide();
            } );

            $el.on( 'focus' + ns, function() {

                // ��sug�Ѿ�������ʾ״̬ʱ������Ҫ��showlist
                !me.isShow && me._showList().trigger( 'open' );
            } );

            $el.on( 'input' + ns, function() {

                // ���ǵ����ֻ�������Ƚ�������δ����ϡ�ʹ���
                me._showList();
            } );

            me.$clearBtn.on( 'click' + ns, function() {

                //�����ʷ��¼
                me.history( null );
            } ).highlight( 'ui-suggestion-highlight' );

            me.$closeBtn.on( 'click' + ns, function() {

                // ����sug
                me.getEl().blur();
                me.hide().trigger( 'close' );
            } ).highlight( 'ui-suggestion-highlight' );

            return me;
        },

        _create: function() {
            var me = this,
                opts = me._options,
                hs = opts.historyShare;

            opts.container && (me.$el = $(opts.container));

            // ����Ĭ�ϴ�true����ʹ��Ĭ��key��'SUG-Sharing-History'
            // ����false������ʾ������history���Ը�sug��id��Ϊkeyֵ
            // ����string�����ڴ˻����ϼ���'SUG-Sharing-History'
            me.key = hs ?
                    (($.type( hs ) === 'boolean' ? '' : hs + '-') +
                    'SUG-Sharing-History') :
                    me.getEl().attr( 'id' ) || ('ui-suggestion-' + (guid++));

            // localStorage�����ݷָ���
            me.separator = encodeURIComponent( ',' );

            // ����dom�����¼�
            me._initDom()._bindEvent();

            return me;
        },

        /**
         * չʾsuglist����Ϊquery���ںͲ�����
         * @private
         */
        _showList: function() {
            var me = this,
                query = me.value(),
                data;

            if ( query ) {

                // ��query��Ϊ�գ���input��focusʱ,input��ֵ
                // �û��Լ����������ֱ�ӱ������ݴ���������sendrequest�д���
                me.trigger( 'sendrequest', query, $.proxy( me._render, me ),
                        $.proxy( me._cacheData, me ));

            } else {

                // queryΪ�գ����տ�ʼfocusʱ����ȡlocalstorage�е�������Ⱦ
                (data = me._localStorage()) ?
                        me._render( query, data.split( me.separator ) ) :
                        me.hide();
            }

            return me;
        },

        _render: function( query, data ) {

            this.trigger( 'renderlist', data, query, $.proxy( this._fillWrapper, this ) );
        },

        /**
         * �����������sug wrapper
         * @listHtml ����sugƬ�Σ�Ĭ��Ϊ'<ul><li>...</li>...</ul>'
         * @private
         */
        _fillWrapper: function( listHtml ) {

            // ���ݲ���������ʷ��¼ʱ���������ʷ��¼��ť
            this.$clearBtn[ this.value() ? 'hide' : 'show' ]();
            listHtml ? (this.$content.html( listHtml ), this.show()) :
                    this.hide();

            return this;
        },

        _localStorage: function( value ) {
            var me = this,
                key = me.key,
                separator = me.separator,
                localStorage,
                data;

            try {

                localStorage = win.localStorage;

                if ( value === undefined ) {    // geter
                    return localStorage[ key ];

                } else if ( value === null ) {    // setter clear
                    localStorage[ key ] = '';

                } else if ( value ) {    // setter
                    data = localStorage[ key ] ?
                            localStorage[ key ].split( separator ) : [];

                    // ����ȥ�ش���
                    // todo ���ڼ����ϸ�ʽ����������һ������\u001e����δ���ж�
                    if ( !~$.inArray( value, data ) ) {
                        data.unshift( value );
                        localStorage[ key ] = data.join( separator );
                    }
                }

            } catch ( ex ) {
                console.log( ex.message );
            }

            return me;
        },

        _cacheData: function( key, value ) {
            this.cacheData || (this.cacheData = {});

            return value !== undefined ?
                this.cacheData[ key ] = value : this.cacheData[ key ];
        },

        /**
         * ��ȡinputֵ
         * @method value
         * @return {String} input�е�ֵ
         */
        value: function() {
            return this.getEl().val();
        },

        /**
         * ����|��ȡ|�����ʷ��¼
         * @method history
         * @param {String} [value] ����value��ʾ���sug��ʷ��¼����value��ʾ��ֵ
         */
        history: function( value ) {
            var me = this,
                clearHistory = value !== null || function() {
                    return me._localStorage( null).hide();
                };

            return value === null ? (me._options.confirmClearHistory ?
                win.confirm( '���ȫ����ѯ��ʷ��¼��' ) && clearHistory() :
                clearHistory()) : me._localStorage( value )
        },

        /**
         * ��ʾsug
         * @method show
         */
        show: function() {

            if ( !this.isShow ) {
                this.$wrapper.show();
                this.isShow = true;
                return this.trigger( 'show' );
            }else{
                return this;
            }

        },

        /**
         * ����sug
         * @method hide
         */
        hide: function() {

            if ( this.isShow ) {
                this.$wrapper.hide();
                this.isShow = false;
                return this.trigger( 'hide' );
            }else{
                return this;
            }

        },

        /**
         * �������
         * @method destroy
         */
        destroy: function() {
            var me = this,
                $el = me.getEl(),
                ns = me.ns;

            // ��ִ�и���destroy����֤�����option�е�destroy��ִ��
            me.trigger( 'destroy' );

            $el.off( ns );
            me.$mask.replaceWith( $el );
            me.$clearBtn.off( ns );
            me.$closeBtn.off( ns );
            me.$wrapper.children().off().remove();
            me.$wrapper.remove();
            me._options.autoClose && $( document ).off( ns );

            this.destroyed = true;

            return me;
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event initdom
         * @param {Event} e gmu.Event����
         * @param {Zepto} $el sliderԪ��
         * @description DOM������ɺ󴥷�
         */
        
        /**
         * @event show
         * @param {Event} e gmu.Event����
         * @description ��ʾsugʱ����
         */
        
        /**
         * @event hide
         * @param {Event} e gmu.Event����
         * @param {Number} index ��ǰslide�����
         * @description ����sugʱ����
         */
        
        /**
         * @event sendrequest
         * @param {Event} e gmu.Event����
         * @param {String} query �û������ѯ��
         * @param {Function} render ����������ɺ����Ⱦ�ص������������Ϊquery,data
         * @param {Function} cacheData ����query�Ļص������������Ϊquery, data
         * @description ��������ʱ����
         */
        
        /**
         * @event renderlist
         * @param {Event} e gmu.Event����
         * @param {Array} data ��Ⱦ������
         * @param {String} query �û�����Ĳ�ѯ��
         * @param {Function} fillWrapper �б���Ⱦ��ɺ�Ļص�����������ΪlistHtmlƬ��
         * @description ��Ⱦsug listʱ����
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    } );
})( gmu.$, window );

/**
 * @file iScroll�����sug�б�ʹ��iScrollչʾ
 * @import widget/suggestion/suggestion.js, extend/iscroll.js
 */
(function( gmu, $ ) {

    /**
     * iScroll�����sug�б�ʹ��iScrollչʾ
     * @class iscroll
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.register( 'iscroll', {

        _init: function() {
            var me = this;

            me.on( 'ready', function() {

                // ����һ��scroller�ṹ
                me.$scroller =
                        $( '<div class="ui-suggestion-scroller"></div>' );

                // ��ʼ��iScroll������Ҫ����wrapper�߶ȣ�������ʽ����max-height
                me.$content
                        .wrapInner( me.$scroller )
                        .iScroll({

                            hScroll: false,

                            onRefresh: function() {

                                // ����iScrollʱ���ض���
                                this.y && this.scrollTo( 0, 0 );
                            }
                        });

                // ����iscroll��destroy
                me.on( 'destroy', function() {
                    me.$content.iScroll('destroy');
                } );
            } );

            return me;
        },

        /**
         * ��д_fillWrapper���������ݼ���ť����˳��
         * */
        _fillWrapper: function( listHtml ) {

            // ���ݲ���������ʷ��¼ʱ���������ʷ��¼��ť
            this.$clearBtn[ this.value() ? 'hide' : 'show' ]();

            if ( listHtml ) {
                this.show().$scroller.html( listHtml );
                this.$content.iScroll( 'refresh' );

            } else {
                this.hide();
            }

            return this;
        }
    } );

})( gmu, gmu.$ );
/**
 * @file λ������Ӧ���
 * @import widget/suggestion/suggestion.js, extend/event.ortchange.js
 */
(function( $, win ) {
    var reverse = Array.prototype.reverse;

    // ָ��sug list��item��selector������item��ķ�ת
    // ����list������$contentԪ�ؽ��в��ҵ�
    gmu.Suggestion.options.listSelector = 'li';

    /**
     * λ������Ӧ�������Ҫ�������ڵ�sug����ҳ��ײ�ʱ���轫sug��ת����������ʾ
     * @class posadapt
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.register( 'posadapt', {

        _init: function() {
            var me = this,
                $list;

            me.on( 'show ortchange', function() {

                if ( me._checkPos() ) {

                    me.$wrapper.css( 'top', - me.$wrapper.height()- me.wrapperTop );

                    // sug list��ת
                    reverse.call( $list =
                        me.$content.find( me._options.listSelector ) );
                    $list.appendTo( $list.parent() );

                    // ������ťλ��
                    me.$btn.prependTo( me.$wrapper );
                }

            } );
        },

        _checkPos: function() {
            var sugH = this._options.height || 66,
                upDis = this.getEl().offset().top - win.pageYOffset;

            // ���±ߵĸ߶�С��sug�ĸ߶Ȳ����ϱߵĸ߶ȴ���sug�ĸ߶�
            return $( win ).height() - upDis < sugH && upDis >= sugH;
        }

    } );
})( gmu.$, window );
/**
 * @file quickdelete���
 * @import widget/suggestion/suggestion.js
 */
(function( gmu, $ ) {

    /**
     * quickdelete���
     * @class quickdelete
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.register( 'quickdelete', {

        _init: function() {
            var me = this,
                $input,
                ns;

            me.on( 'ready', function() {
                $input = me.getEl();
                ns = me.eventNs;

                me.$mask.append( me.$quickDel =
                    $( '<div class="ui-suggestion-quickdel"></div>' ) );

                $input.on('focus' + ns + ' input' + ns, function() {
                    me[ '_quickDel' +
                        ($.trim( $input.val() ) ? 'Show' : 'Hide') ]();
                });

                $input.on( 'blur' + ns, function() {
                    me._quickDelHide();
                });

                // ��tap�¼���touchend��ʧ���㣬�������𣬹ʰ�touchstart����ֹĬ����Ϊ
                me.$quickDel.on( 'touchstart' + ns, function( e ) {
                    e.preventDefault();    // ��ֹĬ���¼�������ᴥ��blur����������
                    e.formDelete = true;    // suggestion���ɾ������
                    $input.val('');
                    me.trigger('delete').trigger('input')._quickDelHide();

                    // ��������ʱ��focusʧЧ trace:FEBASE-779
                    $input.blur().focus();
                } );

                me.on( 'destroy', function() {
                    me.$quickDel.off().remove();
                } );
            } );
        },

        _quickDelShow: function() {

            if ( !this.quickDelShow ) {

                gmu.staticCall( this.$quickDel.get(0),
                        'css', 'visibility', 'visible' );

                this.quickDelShow = true
            }
        },

        _quickDelHide: function() {

            if ( this.quickDelShow ) {

                gmu.staticCall( this.$quickDel.get(0),
                    'css', 'visibility', 'hidden' );

                this.quickDelShow = false
            }
        }
    } );

})( gmu, gmu.$ );
/**
 * @file compatData
 * @import widget/suggestion/suggestion.js
 */
(function( $, win ) {

    // �Ƿ����1.x�汾�е���ʷ����
    gmu.Suggestion.options.compatdata = true;


    /**
     * compatdata����������û���ʷlocalstorge��gmu 1.x�汾�û�������ʷͨ��','�ָ����ݣ�Ϊ�˽��','���ܱ���������⣬���ڲ���encodeURIComponent(',')���������ݣ�����Ҫ�����ϵ���ʷ���ݡ���������Ϊtrue���������ݼ��ݴ���
     * @class compatdata
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.option( 'compatdata', true, function() {

        this.on( 'ready', function() {
            var key = this.key,
                flagKey = 'SUG-History-DATATRANS',
                localdata,
                dataArr;

            try {
                localdata = win.localStorage[ key ];

                // ���������ݣ���ǰ�ԡ�,���ָ�localstorage�е����ݣ����ڸ�ΪencodeURIComponent(',')�ָ�
                if ( localdata && !win.localStorage[ flagKey ] ) {

                    // �洢�Ƿ�ת������ʷ���ݵı��
                    win.localStorage[ flagKey ] = '\u001e';

                    dataArr = localdata.split( ',' );
                    win.localStorage[ key ] = dataArr.join( this.separator );
                }

            }catch ( e ) {
                console.log( e.message );
            }
        } )
    } );
})( gmu.$, window );
/**
 * @file renderList
 * @import widget/suggestion/suggestion.js, extend/highlight.js
 */
(function( $ ) {

    $.extend( gmu.Suggestion.options, {

        /**
         * @property {Boolean} [isHistory=true] �Ƿ���localstorage�д洢�û���ѯ��¼���൱��2.0.5��ǰ�汾�е�isStorage
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        isHistory: true,

        /**
         * @property {Boolean} [usePlus=false] �Ƿ�ʹ��+��ʹsug item����input��
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        usePlus: false,

        /**
         * @property {Number} [listCount=5] sug�б�����
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        listCount: 5,

        /**
         * @property {Function} [renderlist=null] �Զ�����Ⱦ�б��������Ը���Ĭ����Ⱦ�б�ķ���
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.renderlist
         */
        renderlist: null
    } );

    /**
     * renderList���ṩĬ���б���Ⱦ������Ҫ�Լ���Ⱦsug�б���renderListΪFunction���ͣ�����Ҫʹ�ô˲��<br />
     * Ĭ����jsonp�������󣬵��û���option��������renderListʱ����Ҫ������e.preventDefault����Ĭ���������ݷ���
     * @class renderlist
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.option( 'renderlist', function() {

        // ��renderList����Function����ʱ����option������Ч
        return $.type( this._options.renderlist ) !== 'function';

    }, function() {

        var me = this,
            $xssElem = $( '<div></div>'),
            _xssFilter = function( str ) {
                return $xssElem.text( str ).html();
            },

            // ��Ⱦsug list�б�����list array
            _createList = function( query, sugs ) {
                var opts = me._options,
                    html = [],
                    str = '',
                    sug,
                    len,
                    i;

                if ( !sugs || !sugs.length ) {
                    me.hide();
                    return html;
                }

                sugs = sugs.slice( 0, opts.listCount );

                // ��ֹxssע�룬ͨ��text()����ת��һ��
                query = _xssFilter( query || '' );

                // sug�б���Ⱦ�Ƚ�Ƶ�����ʲ�����ģ��������
                for ( i = 0, len = sugs.length; i < len; i++ ) {
                    str = _xssFilter( sug = sugs[ i ] );

                    // ����queryΪ������Ҫ�����滻
                    query && (str = $.trim( sug )
                        .replace( query, '<span>' + query + '</span>' ));

                    opts.usePlus &&
                            (str += '<div class="ui-suggestion-plus" ' +
                                'data-item="' + sug + '"></div>');

                    html.push( '<li>' + str + '</li>' );
                }

                return html;
            };

        me.on( 'ready', function() {
            var me = this,
                ns = me.eventNs,
                $form = $( me._options.form || me.getEl().closest( 'form' ));

            // ��form��submit�¼�
            $form.size() && (me.$form = $form .on( 'submit' + ns,
                    function( e ) {
                        var submitEvent = gmu.Event('submit');

                        me._options.isHistory &&
                        me._localStorage( me.value() );

                        me.trigger( submitEvent );

                        // ��ֹ��Ĭ���ύ�¼�
                        submitEvent.isDefaultPrevented() && e.preventDefault();
                    }));

            // todo ����֤������ҳ�治���и�bug�����Ų�ԭ���������벻��ת��bug
            me.$content.on( 'touchstart' + ns, function(e) {
                e.preventDefault();
            });

            // ע��tap�¼������������뷨ʱ��touch�¼�����submit
            me.$content.on( 'tap' + ns, function(e) {
                var $input = me.getEl(),
                    $elem = $( e.target );

                // ����Ӻţ�inputֵ�Ͽ�
                if ( $elem.hasClass( 'ui-suggestion-plus' ) ) {
                    $input.val( $elem.attr( 'data-item' ) );
                } else if ( $.contains( me.$content.get( 0 ),
                    $elem.get( 0 ) ) ) {

                    // ���sug item, ��ֹʹ��tap��ɴ�͸
                    setTimeout( function() {
                        $input.val( $elem.text() );
                        me.trigger( 'select', $elem )
                            .hide().$form.submit();
                    }, 400 );
                }
            }).highlight( 'ui-suggestion-highlight' );

            me.on( 'destroy', function() {
                $form.size() && $form.off( ns );
                me.$content.off();
            } );
        } );

        me.on( 'renderlist', function( e, data, query, callback ) {
            var ret = _createList( query, data );

            // �ص���Ⱦsuglist
            return callback( ret.length ?
                        '<ul>' + ret.join( ' ' ) + '</ul>' : '' );
        } );
    } );

})( gmu.$ );
/**
 * @file sendRequest
 * @import widget/suggestion/suggestion.js
 */

(function( $, win ) {

    $.extend( gmu.Suggestion.options, {

        /**
         * @property {Boolean} [isCache=true] �������󷵻����ݺ��Ƿ񻺴�query������
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        isCache: true,

        /**
         * @property {String} [queryKey='wd'] ��������ʱquery��keyֵ
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        
        queryKey: 'wd',

        /**
         * @property {String} [cbKey='cb'] ��������ʱcallback��name
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        cbKey: 'cb',

        /**
         * @property {Function} [sendrequest=null] �Զ��巢�������������Ը���Ĭ�Ϸ�������ķ���
         * @namespace options
         * @for Suggestion
         * @uses Suggestion.sendrequest
         */
        sendrequest: null
    } );

    /**
     * sendRequest��Ĭ��sendRequestΪjsonp��ʽȡ���ݣ����û��Լ����������sug������optionΪFunction���ͣ�����Ҫʹ�ô˲��<br />
     * Ĭ����jsonp�������󣬵��û���option��������sendRequestʱ����Ҫ������e.preventDefault����Ĭ���������ݷ���
     * @class sendrequest
     * @namespace Suggestion
     * @pluginfor Suggestion
     */
    gmu.Suggestion.option( 'sendrequest', function() {

        // ��sendRequest����Function����ʱ����option������Ч
        return $.type( this._options.sendrequest ) !== 'function';

    }, function() {
        var me = this,
            opts = me._options,
            queryKey = opts.queryKey,
            cbKey = opts.cbKey,
            param = opts.param,
            isCache = opts.isCache,
            cdata;

        this.on( 'sendrequest', function( e, query, callback, cacheData ) {

            var url = opts.source,

            // ��date��Ϊ��׺��Ӧ�ò����ظ����ʲ���origin
                cb = 'suggestion_' + (+new Date());

            // �������д��������query���ݣ��򲻷�������
            if ( isCache && (cdata = cacheData( query )) ) {
                callback( query, cdata );
                return me;

            }

            // �滻url���һ�����������ӷ�?&��&Ϊ?
            url = (url + '&' + queryKey + '=' + encodeURIComponent( query ))
                    .replace( /[&?]{1,2}/, '?' );

            !~url.indexOf( '&' + cbKey ) &&  (url += '&' + cbKey + '=' + cb);

            param && (url += '&' + param);

            win[ cb ] = function( data ) {

                /*
                 * ��Ⱦ���ݲ�������������
                 * ���ص����ݸ�ʽ���£�
                 * {
                 *     q: "a",
                 *     p: false,
                 *     s: ["angelababy", "akb48", "after school",
                 *     "android", "angel beats!", "a pink", "app"]
                 * }
                 */
                callback( query, data.s );

                // ���������query
                isCache && cacheData( query, data.s );

                delete win[ cb ];
            };

            // ��jsonp��ʽ��������
            $.ajax({
                url: url,
                dataType: 'jsonp'
            });

            return me;
        } );

    } );
})( gmu.$, window );
/**
 * @file ѡ����
 * @import extend/touch.js, core/widget.js, extend/highlight.js, extend/event.ortchange.js
 * @importCSS transitions.css, loading.css
 * @module GMU
 */

(function( gmu, $, undefined ) {
    var _uid = 1,
        uid = function(){
            return _uid++;
        },
        idRE = /^#(.+)$/;

    /**
     * ѡ����
     *
     * @class Tabs
     * @constructor Html����
     * ```html
     * <div id="tabs">
     *      <ul>
     *         <li><a href="#conten1">Tab1</a></li>
     *         <li><a href="#conten2">Tab2</a></li>
     *         <li><a href="#conten3">Tab3</a></li>
     *     </ul>
     *     <div id="conten1">content1</div>
     *     <div id="conten2"><input type="checkbox" id="input1" /><label for="input1">ѡ���Һ�tabs�����л�</label></div>
     *     <div id="conten3">content3</div>
     * </div>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#tabs').tabs();
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ��Tab��Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Tabs:options)
     * @grammar $( el ).tabs( options ) => zepto
     * @grammar new gmu.Tabs( el, options ) => instance
     */
    gmu.define( 'Tabs', {
        options: {

            /**
             * @property {Number} [active=0] ��ʼʱ�ĸ�Ϊѡ��״̬�����ʱsetupģʽ�������2��li�ϼ���ui-state-active��ʽʱ��activeֵΪ1
             * @namespace options
             */
            active: 0,

            /**
             * @property {Array} [items=null] ��renderģʽ����Ҫ�������� ��ʽΪ\[{title:\'\', content:\'\', href:\'\'}\], href���Բ��裬������������ajax����
             * @namespace options
             */
            items:null,

            /**
             * @property {String} [transition='slide'] �����л�������Ŀǰֻ֧��slide���������޶���
             * @namespace options
             */
            transition: 'slide'
        },

        template: {
            nav:'<ul class="ui-tabs-nav">'+
                '<% var item; for(var i=0, length=items.length; i<length; i++) { item=items[i]; %>'+
                    '<li<% if(i==active){ %> class="ui-state-active"<% } %>><a href="javascript:;"><%=item.title%></a></li>'+
                '<% } %></ul>',
            content:'<div class="ui-viewport ui-tabs-content">' +
                '<% var item; for(var i=0, length=items.length; i<length; i++) { item=items[i]; %>'+
                    '<div<% if(item.id){ %> id="<%=item.id%>"<% } %> class="ui-tabs-panel <%=transition%><% if(i==active){ %> ui-state-active<% } %>"><%=item.content%></div>'+
                '<% } %></div>'
        },

        _init:function () {
            var me = this, _opts = me._options, $el, eventHandler = $.proxy(me._eventHandler, me);

            me.on( 'ready', function(){
                $el = me.$el;
                $el.addClass('ui-tabs');
                _opts._nav.on('tap', eventHandler).children().highlight('ui-state-hover');
            } );

            $(window).on('ortchange', eventHandler);
        },

        _create:function () {
            var me = this, _opts = me._options;

            if( me._options.setup && me.$el.children().length > 0 ) {
                me._prepareDom('setup', _opts);
            } else {
                _opts.setup = false;
                me.$el = me.$el || $('<div></div>');
                me._prepareDom('create', _opts);
            }
        },

        _prepareDom:function (mode, _opts) {
            var me = this, content, $el = me.$el, items, nav, contents, id;
            switch (mode) {
                case 'setup':
                    _opts._nav =  me._findElement('ul').first();
                    if(_opts._nav) {
                        _opts._content = me._findElement('div.ui-tabs-content');
                        _opts._content = ((_opts._content && _opts._content.first()) || $('<div></div>').appendTo($el)).addClass('ui-viewport ui-tabs-content');
                        items = [];
                        _opts._nav.addClass('ui-tabs-nav').children().each(function(){
                            var $a = me._findElement('a', this), href = $a?$a.attr('href'):$(this).attr('data-url'), id, $content;
                            id = idRE.test(href)? RegExp.$1: 'tabs_'+uid();
                            ($content = me._findElement('#'+id) || $('<div id="'+id+'"></div>'))
                                .addClass('ui-tabs-panel'+(_opts.transition?' '+_opts.transition:''))
                                .appendTo(_opts._content);
                            items.push({
                                id: id,
                                href: href,
                                title: $a?$a.attr('href', 'javascript:;').text():$(this).text(),//���href��ɾ���Ļ�����ַ������֣�Ȼ��һ������ʧ��
                                content: $content
                            });
                        });
                        _opts.items = items;
                        _opts.active = Math.max(0, Math.min(items.length-1, _opts.active || $('.ui-state-active', _opts._nav).index()||0));
                        me._getPanel().add(_opts._nav.children().eq(_opts.active)).addClass('ui-state-active');
                        break;
                    } //if cannot find the ul, switch this to create mode. Doing this by remove the break centence.
                default:
                    items = _opts.items = _opts.items || [];
                    nav = [];
                    contents = [];
                    _opts.active = Math.max(0, Math.min(items.length-1, _opts.active));
                    $.each(items, function(key, val){
                        id = 'tabs_'+uid();
                        nav.push({
                            href: val.href || '#'+id,
                            title: val.title
                        });
                        contents.push({
                            content: val.content || '',
                            id: id
                        });
                        items[key].id = id;
                    });
                    _opts._nav = $( this.tpl2html( 'nav', {items: nav, active: _opts.active} ) ).prependTo($el);
                    _opts._content = $( this.tpl2html( 'content', {items: contents, active: _opts.active, transition: _opts.transition} ) ).appendTo($el);
                    _opts.container = _opts.container || ($el.parent().length ? null : 'body');
            }
            _opts.container && $el.appendTo(_opts.container);
            me._fitToContent(me._getPanel());
        },

        _getPanel: function(index){
            var _opts = this._options;
            return $('#' + _opts.items[index === undefined ? _opts.active : index].id);
        },

        _findElement:function (selector, el) {
            var ret = $(el || this.$el).find(selector);
            return ret.length ? ret : null;
        },

        _eventHandler:function (e) {
            var match, _opts = this._options;
            switch(e.type) {
                case 'ortchange':
                    this.refresh();
                    break;
                default:
                    if((match = $(e.target).closest('li', _opts._nav.get(0))) && match.length) {
                        e.preventDefault();
                        this.switchTo(match.index());
                    }
            }
        },

        _fitToContent: function(div) {
            var _opts = this._options, $content = _opts._content;
            _opts._plus === undefined && (_opts._plus = parseFloat($content.css('border-top-width'))+parseFloat($content.css('border-bottom-width')))
            $content.height( div.height() + _opts._plus);
            return this;
        },

        /**
         * �л���ĳ��Tab
         * @method switchTo
         * @param {Number} index Tab���
         * @chainable
         * @return {self} ���ر���
         */
        switchTo: function(index) {
            var me = this, _opts = me._options, items = _opts.items, eventData, to, from, reverse, endEvent;
            if(!_opts._buzy && _opts.active != (index = Math.max(0, Math.min(items.length-1, index)))) {
                to = $.extend({}, items[index]);//copy it.
                to.div = me._getPanel(index);
                to.index = index;

                from = $.extend({}, items[_opts.active]);//copy it.
                from.div = me._getPanel();
                from.index = _opts.active;

                eventData = gmu.Event('beforeActivate');
                me.trigger(eventData, to, from);
                if(eventData.isDefaultPrevented()) return me;

                _opts._content.children().removeClass('ui-state-active');
                to.div.addClass('ui-state-active');
                _opts._nav.children().removeClass('ui-state-active').eq(to.index).addClass('ui-state-active');
                if(_opts.transition) { //use transition
                    _opts._buzy = true;
                    endEvent = $.fx.animationEnd + '.tabs';
                    reverse = index>_opts.active?'':' reverse';
                    _opts._content.addClass('ui-viewport-transitioning');
                    from.div.addClass('out'+reverse);
                    to.div.addClass('in'+reverse).on(endEvent, function(e){
                        if (e.target != e.currentTarget) return //�����ð�������ģ��򲻲���
                        to.div.off(endEvent, arguments.callee);//�����
                        _opts._buzy = false;
                        from.div.removeClass('out reverse');
                        to.div.removeClass('in reverse');
                        _opts._content.removeClass('ui-viewport-transitioning');
                        me.trigger('animateComplete', to, from);
                        me._fitToContent(to.div);
                    });
                }
                _opts.active = index;
                me.trigger('activate', to, from);
                _opts.transition ||  me._fitToContent(to.div);
            }
            return me;
        },

        /**
         * ���ⲿ�޸�tabs���ݺã���Ҫ����refresh��tabs�Զ����¸߶�
         * @method refresh
         * @chainable
         * @return {self} ���ر���
         */
        refresh: function(){
            return this._fitToContent(this._getPanel());
        },

        /**
         * �������
         * @method destroy
         */
        destroy:function () {
            var _opts = this._options, eventHandler = this._eventHandler;
            _opts._nav.off('tap', eventHandler).children().highlight();
            _opts.swipe && _opts._content.off('swipeLeft swipeRight', eventHandler);

            if( !_opts.setup ) {
                this.$el.remove();
            }
            return this.$super('destroy');
        }

        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */

        /**
         * @event beforeActivate
         * @param {Event} e gmu.Event����
         * @param {Object} to �����������ԣ�div(����div), index(λ��), title(����), content(����), href(����)
         * @param {Object} from �����������ԣ�div(����div), index(λ��), title(����), content(����), href(����)
         * @description �����л�֮ǰ����������ͨ��e.preventDefault()����ֹ
         */

        /**
         * @event activate
         * @param {Event} e gmu.Event����
         * @param {Object} to �����������ԣ�div(����div), index(λ��), title(����), content(����), href(����)
         * @param {Object} from �����������ԣ�div(����div), index(λ��), title(����), content(����), href(����)
         * @description �����л�֮�󴥷�
         */

        /**
         * @event animateComplete
         * @param {Event} e gmu.Event����
         * @param {Object} to �����������ԣ�div(����div), index(λ��), title(����), content(����), href(����)
         * @param {Object} from �����������ԣ�div(����div), index(λ��), title(����), content(����), href(����)
         * @description ������ɺ�ִ�У����û�����ö�������ʱ�䲻�ᴥ��
         */

        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    });
})( gmu, gmu.$ );
/**
 * @file ajax���
 * @import widget/tabs/tabs.js
 */
(function ($, undefined) {
    var idRE = /^#.+$/,
        loaded = {},
        tpl = {
            loading: '<div class="ui-loading">Loading</div>',
            error: '<p class="ui-load-error">���ݼ���ʧ��!</p>'
        };

    /**
     * ��a����href���õ��ǵ�ַ��������id���������Ϊ���Ϊajax���͵ġ���options�ϴ���ajax�����������[ajaxѡ��](#$.ajax)
     * @class ajax
     * @namespace Tabs
     * @pluginfor Tabs
     */
    gmu.Tabs.register( 'ajax', {
        _init:function () {
            var _opts = this._options, items, i, length;

            this.on( 'ready', function(){
                items = _opts.items;
                for (i = 0, length = items.length; i < length; i++) {
                    items[i].href && !idRE.test(items[i].href) && (items[i].isAjax = true);
                }
                this.on('activate', this._onActivate);
                items[_opts.active].isAjax && this.load(_opts.active);//�����ǰ��ajax
            } );
        },

        destroy:function () {
            this.off('activate', this._onActivate);
            this.xhr && this.xhr.abort();
            return this.origin();
        },

        _fitToContent: function(div) {
            var _opts = this._options;

            if(!_opts._fitLock)return this.origin(div);
        },

        _onActivate:function (e, to) {
            to.isAjax && this.load(to.index);
        },

        /**
         * �������ݣ�ָ����tab������ajax���͡����ص����ݻỺ�����������Ҫǿ���ٴμ��أ��ڶ�����������true
         * @method load
         * @param {Number} index Tab���
         * @param {Boolean} [force=false] �Ƿ�ǿ�����¼���
         * @for Tabs
         * @uses Tabs.ajax
         * @return {self} ���ر���
         */
        load:function (index, force) {
            var me = this, _opts = me._options, items = _opts.items, item, $panel, prevXHR;

            if (index < 0 ||
                index > items.length - 1 ||
                !(item = items[index]) || //�����Χ����
                !item.isAjax || //�������ajax���͵�
                ( ( $panel = me._getPanel(index)).text() && !force && loaded[index] ) //���û�м��ع�������tab����Ϊ��
                )return this;

            (prevXHR = me.xhr) && setTimeout(function(){//���г�ȥû�м������xhr abort��
                prevXHR.abort();
            }, 400);

            _opts._loadingTimer = setTimeout(function () {//���������50ms������ˣ���û��Ҫ��ȥ��ʾ loading��
                $panel.html(tpl.loading);
            }, 50);

            _opts._fitLock = true;

            me.xhr = $.ajax($.extend(_opts.ajax || {}, {
                url:item.href,
                context:me.$el.get(0),
                beforeSend:function (xhr, settings) {
                    var eventData = gmu.Event('beforeLoad');
                    me.trigger(eventData, xhr, settings);
                    if (eventData.isDefaultPrevented())return false;
                },
                success:function (response, xhr) {
                    var eventData = gmu.Event('beforeRender');
                    clearTimeout(_opts._loadingTimer);//�����ʾloading�ļ�ʱ��
                    me.trigger(eventData, response, $panel, index, xhr)//�ⲿ�����޸�data������ֱ�Ӱ�pannel�޸���
                    if (!eventData.isDefaultPrevented()) {
                        $panel.html(response);
                    }
                    _opts._fitLock = false;
                    loaded[index] = true;
                    me.trigger('load', $panel);
                    delete me.xhr;
                    me._fitToContent($panel);
                },
                error:function () {
                    var eventData = gmu.Event('loadError');
                    clearTimeout(_opts._loadingTimer);//�����ʾloading�ļ�ʱ��
                    loaded[index] = false;
                    me.trigger(eventData, $panel);
                    if(!eventData.isDefaultPrevented()){
                        $panel.html(tpl.error);
                    }
                    delete me.xhr;
                }
            }));
        }
        
        /**
         * @event beforeLoad
         * @param {Event} e gmu.Event����
         * @param {Object} xhr xhr����
         * @param {Object} settings ajax����Ĳ���
         * @description ������ǰ����������ͨ��e.preventDefault()��ȡ���˴�ajax����
         * @for Tabs
         * @uses Tabs.ajax
         */
        
        /**
         * @event beforeRender
         * @param {Event} e gmu.Event����
         * @param {Object} response ����ֵ
         * @param {Object} panel ��Ӧ��Tab���ݵ�����
         * @param {Number} index Tab�����
         * @param {Object} xhr xhr����
         * @description ajax����������ݣ���render��div��֮ǰ����������json���ݣ�����ͨ���˷�������дrender��Ȼ��ͨ��e.preventDefault()����ֹ����response�����div��
         * @for Tabs
         * @uses Tabs.ajax
         */
        
        /**
         * @event load
         * @param {Event} e gmu.Event����
         * @param {Zepto} panel ��Ӧ��Tab���ݵ�����
         * @description ��ajax���󵽵����ݹ�����ƽ�Ѿ�Render��div���˺󴥷�
         * @for Tabs
         * @uses Tabs.ajax
         */
        
        /**
         * @event loadError
         * @param {Event} e gmu.Event����
         * @param {Zepto} panel ��Ӧ��Tab���ݵ�����
         * @description ��ajax��������ʧ��ʱ������������¼���preventDefault�ˣ��򲻻���Դ��Ĵ�����ϢRender��div��
         * @for Tabs
         * @uses Tabs.ajax
         */
    } );
})(Zepto);

/**
 * @file ���һ������Ʋ��
 * @import widget/tabs/tabs.js
 */

(function ($, undefined) {
    var durationThreshold = 1000, // ʱ�����1s�Ͳ��㡣
        horizontalDistanceThreshold = 30, // x����������30
        verticalDistanceThreshold = 70, // y������ֻҪ����70�Ͳ���
        scrollSupressionThreshold = 30, //���x�����ƶ��������ֱ�ͽ�������
        tabs = [],
        eventBinded = false,
        isFromTabs = function (target) {
            for (var i = tabs.length; i--;) {
                if ($.contains(tabs[i], target)) return true;
            }
            return false;
        }

    function tabsSwipeEvents() {
        $(document).on('touchstart.tabs', function (e) {
            var point = e.touches ? e.touches[0] : e, start, stop;

            start = {
                x:point.clientX,
                y:point.clientY,
                time:Date.now(),
                el:$(e.target)
            }

            $(document).on('touchmove.tabs',function (e) {
                var point = e.touches ? e.touches[0] : e, xDelta;
                if (!start)return;
                stop = {
                    x:point.clientX,
                    y:point.clientY,
                    time:Date.now()
                }
                if ((xDelta = Math.abs(start.x - stop.x)) > scrollSupressionThreshold ||
                    xDelta > Math.abs(start.y - stop.y)) {
                    isFromTabs(e.target) && e.preventDefault();
                } else {//���ϵͳ������ʼ�ˣ��Ͳ�����swipe�¼�
                    $(document).off('touchmove.tabs touchend.tabs');
                }
            }).one('touchend.tabs', function () {
                    $(document).off('touchmove.tabs');
                    if (start && stop) {
                        if (stop.time - start.time < durationThreshold &&
                            Math.abs(start.x - stop.x) > horizontalDistanceThreshold &&
                            Math.abs(start.y - stop.y) < verticalDistanceThreshold) {
                            start.el.trigger(start.x > stop.x ? "tabsSwipeLeft" : "tabsSwipeRight");
                        }
                    }
                    start = stop = undefined;
                });
        });
    }
    
    /**
     * ��� swipe���ܣ�zepto��swipeLeft, swipeRight��̫׼��������������ʵ����һ�ס�
     * @class swipe
     * @namespace Tabs
     * @pluginfor Tabs
     */
    gmu.Tabs.register( 'swipe', {
        _init:function () {
            var _opts = this._options;

            this.on( 'ready', function(){
                tabs.push(_opts._content.get(0));
                eventBinded =  eventBinded || (tabsSwipeEvents(), true);
                this.$el.on('tabsSwipeLeft tabsSwipeRight', $.proxy(this._eventHandler, this));
            } );
        },
        _eventHandler:function (e) {
            var _opts = this._options, items, index;
            switch (e.type) {
                case 'tabsSwipeLeft':
                case 'tabsSwipeRight':
                    items = _opts.items;
                    if (e.type == 'tabsSwipeLeft' && _opts.active < items.length - 1) {
                        index = _opts.active + 1;
                    } else if (e.type == 'tabsSwipeRight' && _opts.active > 0) {
                        index = _opts.active - 1;
                    }
                    index !== undefined && (e.stopPropagation(), this.switchTo(index));
                    break;
                default://tap
                    return this.origin(e);
            }
        },
        destroy: function(){
            var _opts = this._options, idx;
            ~(idx = $.inArray(_opts._content.get(0), tabs)) && tabs.splice(idx, 1);
            this.$el.off('tabsSwipeLeft tabsSwipeRight', this._eventHandler);
            tabs.length || ($(document).off('touchstart.tabs'), eventBinded = false);
            return this.origin();
        }
    } );
})(Zepto);
/**
 * @file ���������
 * @import core/widget.js
 * @module GMU
 */
(function( gmu, $ ) {
    /**
     * ���������
     *
     * @class Toolbar
     * @constructor Html����
     * ```html
     * <div id="J_toolbar">
     *      <a href="../">����</a>
     *      <h2>������</h2>
     *     <span class="btn_1"><span>�ٿ�</span></span>
     *     <span class="btn_1">֪��</span>
     * </div>
     * ```
     *
     * javascript����
     * ```javascript
     * $('#J_toolbar').toolbar({});
     * ```
     * @param {dom | zepto | selector} [el] ������ʼ����������Ԫ��
     * @param {Object} [options] �����������������鿴[Options](#GMU:Toolbar:options)
     * @grammar $( el ).toolbar( options ) => zepto
     * @grammar new gmu.Toolbar( el, options ) => instance
     */
    gmu.define( 'Toolbar', {

        options: {

            /**
             * @property {Zepto | Selector | Element} [container=document.body] toolbar�������Ԫ��
             * @namespace options
             */
            container: document.body,

            /**
             * @property {String} [title='����'] toolbar�ı���
             * @namespace options
             */
            title: '����',

            /**
             * @property {Array} [leftBtns] �������İ�ť�飬֧��html��gmu buttonʵ��
             * @namespace options
             */
            leftBtns: [],

            /**
             * @property {Array} [rightBtns] �����Ҳ�İ�ť�飬֧��html��gmu buttonʵ��
             * @namespace options
             */
            rightBtns: [],

            /**
             * @property {Boolean} [fixed=false] toolbar�Ƿ�̶�λ��
             * @namespace options
             */
            fixed: false
        },

        _init: function() {
            var me = this,
                opts = me._options,
                $el;

            // ����container��Ĭ��ֵ
            if( !opts.container ) {
                opts.container = document.body;
            }

            me.on( 'ready', function() {
                $el = me.$el;

                if( opts.fixed ) {
                    // TODO Ԫ��id�Ĵ���
                    var placeholder = $( '<div class="ui-toolbar-placeholder"></div>' ).height( $el.offset().height ).
                        insertBefore( $el ).append( $el ).append( $el.clone().css({'z-index': 1, position: 'absolute',top: 0}) ),
                        top = $el.offset().top,
                        check = function() {
                            document.body.scrollTop > top ? $el.css({position:'fixed', top: 0}) : $el.css('position', 'absolute');
                        },
                        offHandle;

                    $(window).on( 'touchmove touchend touchcancel scroll scrollStop', check );
                    $(document).on( 'touchend touchcancel', offHandle = function() {
                        setTimeout( function() {
                            check();
                        }, 200 );
                    } );
                    me.on( 'destroy', function() {
                        $(window).off('touchmove touchend touchcancel scroll scrollStop', check);
                        $(document).off('touchend touchcancel', offHandle);
                        
                        // ɾ��placeholder������ԭ����Toolbar�ڵ�
                        $el.insertBefore(placeholder);
                        placeholder.remove();
                        me._removeDom();
                    } );

                    check();
                }
            } );

            me.on( 'destroy', function() {
                me._removeDom();
            } );
        },

        _create: function() {
            var me = this,
                opts = me._options,
                $el = me.getEl(),
                container = $( opts.container ),
                children = [],
                btnGroups = me.btnGroups = {
                    left: [],
                    right: []
                },
                currentGroup = btnGroups['left'];

            // render��ʽ����Ҫ�ȴ���Toolbar�ڵ�
            if( !opts.setup ) {
                ($el && $el.length > 0) ?
                    $el.appendTo(container) :   // ���el��һ��HTMLƬ�Σ��������container��
                    ($el = me.$el = $('<div>').appendTo( container ));  // ���򣬴���һ����div���������container��
            }

            // ��DOM��ȡ����ť��
            children = $el.children();
            $toolbarWrap = $el.find('.ui-toolbar-wrap');
            if( $toolbarWrap.length === 0 ){
                $toolbarWrap = $('<div class="ui-toolbar-wrap"></div>').appendTo($el);
            }else{
                children = $toolbarWrap.children();
            }

            children.forEach( function( child ) {
                $toolbarWrap.append(child);

                /^[hH]/.test( child.tagName ) ? 
                    (currentGroup = btnGroups['right'], me.title = child) :
                    currentGroup.push( child );
            } );

            // ������ఴť�������
            var leftBtnContainer = $toolbarWrap.find('.ui-toolbar-left');
            var rightBtnContainer = $toolbarWrap.find('.ui-toolbar-right');
            if( leftBtnContainer.length === 0 ) {
                leftBtnContainer = children.length ? $('<div class="ui-toolbar-left">').insertBefore(children[0]) : $('<div class="ui-toolbar-left">').appendTo($toolbarWrap);
                btnGroups['left'].forEach( function( btn ) {
                    $(btn).addClass('ui-toolbar-button');
                    leftBtnContainer.append( btn );
                } );
                
                // û���������������ΪҲû���Ҳ�����������Ҫ���ж��Ƿ�����Ҳ�����
                rightBtnContainer = $('<div class="ui-toolbar-right">').appendTo($toolbarWrap);
                btnGroups['right'].forEach( function( btn ) {
                    $(btn).addClass('ui-toolbar-button');
                    rightBtnContainer.append( btn );
                } );
            }

            $el.addClass( 'ui-toolbar' );
            $(me.title).length ? $(me.title).addClass( 'ui-toolbar-title' ) : $('<h1 class="ui-toolbar-title">' + opts.title + '</h1>').insertAfter(leftBtnContainer);;

            me.btnContainer = {
                'left': leftBtnContainer,
                'right': rightBtnContainer
            };

            me.addBtns( 'left', opts.leftBtns );
            me.addBtns( 'right', opts.rightBtns );
        },

        _addBtn: function( container, btn ) {
            var me = this;

            $( btn ).appendTo( container ).addClass('ui-toolbar-button');
        },

        /**
         * ��Ӱ�ť��
         * @method addBtns
         * @param {String} [position=right] ��ť��ӵ�λ�ã�left����right
         * @param {Array} btns Ҫ��ӵİ�ť�飬ÿ����ť������һ��gmu Buttonʵ��������Ԫ�أ�����HTMLƬ��
         * @return {self} ���ر���
         */
        addBtns: function( position, btns ) {
            var me = this,
                btnContainer = me.btnContainer[position],
                toString = Object.prototype.toString;

            // ���¼��ݣ����û�д�position����Ϊ���Ҳ���Ӱ�ť
            if( toString.call(position) != '[object String]' ) {
                btns = position;
                btnContainer = me.btnContainer['right'];
            }

            btns.forEach( function( btn, index ) {
                // �����gmu���ʵ����ȡʵ����$el
                if( btn instanceof gmu.Base ) {
                    btn = btn.getEl();
                }
                me._addBtn( btnContainer, btn );
            });

            return me;
        },

        /**
         * ��ʾToolbar
         * @method show
         * @return {self} ���ر���
         */
        
        /**
         * @event show
         * @param {Event} e gmu.Event����
         * @description Toolbar��ʾʱ����
         */
        show: function() {
            var me = this;

            me.$el.show();
            me.trigger( 'show' );
            me.isShowing = true;

            return me;
        },

        /**
         * ����Toolbar
         * @method hide
         * @return {self} ���ر���
         */
        
        /**
         * @event hide
         * @param {Event} e gmu.Event����
         * @description Toolbar����ʱ����
         */
        hide: function() {
            var me = this;

            me.$el.hide();
            me.trigger( 'hide' );
            me.isShowing = false;

            return me;
        },

        /**
         * ����Toolbar����ʾ/���أ�״̬
         * @method toggle
         * @return {self} ���ر���
         */
        toggle: function() {
            var me = this;

            me.isShowing === false ? 
                me.show() : me.hide();

            return me;
        },

        _removeDom: function(){
            var me = this,
                $el = me.$el;

            if( me._options.setup === false ) {   // �����ͨ��renderģʽ�������Ƴ��ڵ�
                $el.remove();
            } else {    // �����ͨ��setupģʽ�����������ڵ�
                $el.css('position', 'static').css('top', 'auto');
            }
        }


        /**
         * @event ready
         * @param {Event} e gmu.Event����
         * @description �������ʼ����󴥷���
         */
        
        /**
         * @event destroy
         * @param {Event} e gmu.Event����
         * @description ��������ٵ�ʱ�򴥷�
         */
    } );
})( gmu, gmu.$ );

/**
 * @file Toolbar fix���
 * @module GMU
 * @import widget/toolbar/toolbar.js, extend/fix.js
 */
(function( gmu, $ ) {
    /**
     * Toolbar position���������position�������Խ�Toolbar�̶���ĳ��λ�á�
     *
     * @class position
     * @namespace Toolbar
     * @pluginfor Toolbar
     */
    gmu.Toolbar.register( 'position', {
        /**
         * ��λToolbar
         * @method position
         * @param {Object} opts ��λ��������ʽ��$.fn.fix������ʽ��ͬ
         * @for Toolbar
         * @uses Toolbar.position
         * @return {self} ���ر���
         */
        position: function( opts ) {
            this.$el.fix( opts );

            return this;
        }
    } );
})( gmu, gmu.$ );
/**
 * @file iOS5�����������iOS5������
 * @import widget/refresh/refresh.js,extend/throttle.js
 */
(function( gmu, $, undefined ) {
    
    /**
     * iOS5�����֧��iOS5�������豸��ʹ��ϵͳ�Դ����ڹ�����
     * @class iOS5
     * @namespace Refresh
     * @pluginfor Refresh
     */
    /**
     * @property {Number} [threshold=5] ���صķ�ֵ��Ĭ�����ϻ������������볬��5px�����ɴ���������������ֵֻ��Ϊ��ֵ������ֵ��10������Ҫ�����������15px�ſɴ������ز���
     * @namespace options
     * @for Refresh
     * @uses Refresh.iOS5
     */
    /**
     * @property {Number} [topOffset=0] �ϱ������ľ��룬Ĭ��Ϊrefresh��ť�ĸ߶ȣ����鲻Ҫ�޸�
     * @namespace options
     * @for Refresh
     * @uses Refresh.iOS5
     */
    gmu.Refresh.register( 'iOS5', {
        _init: function () {
            var me = this,
                opts = me._options,
                $el = me.$el;

            $el.css({
                'overflow': 'scroll',
                '-webkit-overflow-scrolling': 'touch'
            });
            opts.topOffset = opts['$upElem'] ? opts['$upElem'].height() : 0;
            opts.iScroll = me._getiScroll();
            $el.get(0).scrollTop = opts.topOffset;
            $el.on('touchstart touchmove touchend', $.proxy(me._eventHandler, me));
        },
        _changeStyle: function (dir, state) {
            var me = this,
                opts = me._options,
                refreshInfo = opts.refreshInfo[dir];

            me.origin(dir, state);
            switch (state) {
                case 'loaded':
                    refreshInfo['$icon'].addClass('ui-refresh-icon');
                    opts._actDir = '';
                    break;
                case 'beforeload':
                    if(dir == 'up'){
                        refreshInfo['$label'].html(td_lang.pda.msg_5 || '�ɿ���������');
                    }else{
                        refreshInfo['$label'].html(td_lang.pda.msg_7 || '�ɿ���������');
                    }
                    
                    refreshInfo['$icon'].addClass('ui-refresh-flip');
                    break;
                case 'loading':
                    refreshInfo['$icon'].removeClass().addClass('ui-loading');
                    break;
            }
            return me;
        },

        _scrollStart: function (e) {
            var me = this,
                opts = me._options,
                topOffset = opts.topOffset,
                $upElem = opts.$upElem,
                wrapper = me.$el.get(0),
                _scrollFn = function () {
                    clearTimeout(opts.topOffsetTimer);
                    if ($upElem && $upElem.length && wrapper.scrollTop <= topOffset && !opts['_upRefreshed']) {

                        wrapper.scrollTop = topOffset;
                    }
                };

            me.trigger('scrollstart', e);
            me._enableScroll()._bindScrollStop(wrapper, _scrollFn);      //��֤wrapper���Ử����ײ��������ʹ�䴦�ڿɻ���״̬
            opts.maxScrollY = wrapper.offsetHeight - wrapper.scrollHeight;
            opts._scrollFn = _scrollFn;

            return me;
        },

        _scrollMove: function () {
            var me = this,
                opts = me._options,
                up = opts.$upElem && opts.$upElem.length ,
                down = opts.$downElem && opts.$downElem.length,
                wrapper = me.$el.get(0),
                threshold = opts.threshold || 5;

            me._scrollMove = function (e) {
                var maxScrollY = opts.maxScrollY,
                    scrollY = wrapper.scrollTop,
                    lastMoveY = opts.lastMoveY || scrollY,
                    upRefreshed = opts['_upRefreshed'],
                    downRefreshed = opts['_downRefreshed'],
                    upStatus = me._status('up'),
                    downStatus = me._status('down');

                if (up && !upStatus || down && !downStatus) return;    //�����������ڼ����У����ϴμ��ػ�δ��ɣ�ֱ�ӷ���, �������°�ť��ͬʱ���ش��� traceID:FEBASE-569, trace:FEBASE-775
                opts.iScroll.deltaY = scrollY - lastMoveY;    //ÿ����touchmoveʱ����ƫ������ֵ
                if (downStatus && down && !downRefreshed && -scrollY < (maxScrollY - threshold)) {      //�±߰�ť����������
                    me._setMoveState('down', 'beforeload', 'pull');
                } else if (downStatus && down && downRefreshed && -scrollY > (maxScrollY - threshold) && -scrollY !== maxScrollY) {   //�±߰�ť�������ָ�  -scrollY !== maxScrollY for trace784
                    me._setMoveState('down', 'loaded', 'restore');
                } else if (upStatus && up && !upRefreshed && -scrollY > threshold ) {      //�ϱ߰�ť����������
                    me._setMoveState('up', 'beforeload', 'pull');
                } else if (upStatus && up && upRefreshed && -scrollY < threshold && scrollY) {       //�ϱ߰�ť�������ָ���scrollY !== 0  for trace784
                    me._setMoveState('up', 'loaded', 'restore');
                }

                opts.lastMoveY = scrollY;
                opts._moved = true;
                return me.trigger('scrollmove', e, scrollY, scrollY - lastMoveY);
            };
            me._scrollMove.apply(me, arguments);
        },

        _scrollEnd: function (e) {
            var me = this,
                opts = me._options,
                wrapper = me.$el.get(0),
                topOffset = opts.topOffset,
                actDir = opts._actDir,
                restoreDir = opts._restoreDir;

            /*�ϱߵ��ť���أ��������������¼���
             1.�ϱ߰�ť��ԭ����: restoreDir == 'up'���ӳ�200ms
             2.�ϱ߰�ť��������С���룬δ��������: scrollTop <= topOffset���ӳ�800ms
             3.�ϱ߰�ť��������С���룬δ�������أ����Իص���scrollTop <= topOffset���ӳ�800ms
             4.�ϱ߰�ť������������룬�ٻ������������Իص�scrollTop <= topOffset����������touchstartʱ�İ󶨵�scroll�¼�
             5.�ϱ߰�ť���������������أ���action�еĻص�
             */
            if ((restoreDir == 'up' || wrapper.scrollTop <= topOffset) && !actDir && opts._moved) {
                me._options['topOffsetTimer'] = setTimeout( function () {
                    $(wrapper).off('scroll', opts._scrollFn);     //scroll�¼�����Ҫ�ٴ���
                    wrapper.scrollTop = topOffset;
                }, 800);
            }

            if (actDir && me._status(actDir)) {
                me._setStyle(actDir, 'loading');
                me._loadingAction(actDir, 'pull');
            }

            opts._moved = false;
            return me.trigger('scrollend', e);
        },

        _enableScroll: function () {
            var me = this,
                wrapper = me.$el.get(0),
                scrollY = wrapper.scrollTop;

            scrollY <= 0 && (wrapper.scrollTop = 1);       //���������Ϸ�
            if (scrollY + wrapper.offsetHeight >= wrapper.scrollHeight) {    //���������·�
                wrapper.scrollTop = wrapper.scrollHeight - wrapper.offsetHeight - 1;
            }

            return me;
        },

        _bindScrollStop: function (elem, fn) {
            var me = this,
                $elem = $(elem);

            $elem.off('scroll', me._options._scrollFn).on('scroll', $.debounce(100, function(){
                $elem.off('scroll', arguments.callee).one('scroll', fn);
            }, false));

            return me;
        },

        _getiScroll: function () {
            var me = this,
                $wrapper = me.$el,
                wrapper = $wrapper[0];
            return {
                el: wrapper,
                deltaY: 0,
                scrollTo: function (y, time, relative) {
                    if (relative) {
                        y = wrapper.scrollTop + y;
                    }
                    $wrapper.css({
                        '-webkit-transition-property':'scrollTop',
                        '-webkit-transition-duration':y + 'ms'
                    });
                    wrapper.scrollTop = y;
                },

                disable: function (destroy) {
                    destroy && me.destroy();
                    $wrapper.css('overflow', 'hidden');
                },

                enable:function () {
                    $wrapper.css('overflow', 'scroll');
                }
            }
        },

        _setMoveState: function (dir, state, actType) {
            var me = this,
                opts = me._options;

            me._setStyle(dir, state);
            opts['_' + dir + 'Refreshed'] = actType == 'pull';
            opts['_actDir'] = actType == 'pull' ? dir : '';
            opts['_restoreDir'] = dir == 'up' && actType == 'restore' ? dir : ''
            return me;
        },

        _eventHandler: function (e) {
            var me = this;
            switch(e.type) {
                case 'touchstart':
                    me._scrollStart(e);
                    break;
                case 'touchmove':
                    me._scrollMove(e);
                    break;
                case 'touchend':
                    me._scrollEnd(e);
                    break;
            }
        },
        afterDataLoading: function (dir) {
            var me = this,
                opts = me._options,
                dir = dir || opts._actDir;

            opts['_' + dir + 'Refreshed'] = false;
            dir == 'up' && (me.$el.get(0).scrollTop = opts.topOffset);
            return me.origin(dir);
        }
    } );
})( gmu, gmu.$ );
/**
 * @file iScroll���
 * @import extend/iscroll.js, widget/refresh/refresh.js
 */
(function( gmu, $, undefined ) {
    
    /**
     * iscroll�����֧���������أ��ڹ�����iscroll��ʽ�������������native��
     * @class iscroll
     * @namespace Refresh
     * @pluginfor Refresh
     */
    /**
     * @property {Number} [threshold=5] ���صķ�ֵ��Ĭ�����ϻ������������볬��5px�����ɴ���������������ֵֻ��Ϊ��ֵ������ֵ��10������Ҫ�����������15px�ſɴ������ز���
     * @namespace options
     * @for Refresh
     * @uses Refresh.iscroll
     */
    /**
     * @property {Object} [iScrollOpts={}] iScroll��������
     * @namespace options
     * @for Refresh
     * @uses Refresh.iscroll
     */
    gmu.Refresh.register( 'iscroll', {
        _init: function () {
            var me = this,
                opts = me._options,
                $el = me.$el,
                wrapperH = $el.height();

            $.extend(opts, {
                useTransition: true,
                speedScale: 1,
                topOffset: opts['$upElem'] ? opts['$upElem'].height() : 0
            });
            opts.threshold = opts.threshold || 5;

            $el.wrapAll($('<div class="ui-refresh-wrapper"></div>').height(wrapperH)).css({
                'height': 'auto',
                'overflow': 'hidden'
            });

            me.on( 'ready', function(){
                me._loadIscroll();
            } );
        },
        _changeStyle: function (dir, state) {
            var me = this,
                opts = me._options,
                refreshInfo = opts.refreshInfo[dir];

            me.origin(dir, state);
            switch (state) {
                case 'loaded':
                    refreshInfo['$icon'].addClass('ui-refresh-icon');
                    break;
                case 'beforeload':
                    if(dir == 'up'){
                        refreshInfo['$label'].html(td_lang.pda.msg_5 || '�ɿ���������');
                    }else{
                        refreshInfo['$label'].html(td_lang.pda.msg_7 || '�ɿ���������');
                    }
                    refreshInfo['$icon'].addClass('ui-refresh-flip');
                    break;
                case 'loading':
                    refreshInfo['$icon'].removeClass().addClass('ui-loading');
                    break;
            }
            return me;
        },
        _loadIscroll: function () {
            var me = this,
                opts = me._options,
                threshold = opts.threshold;

            opts.iScroll = new iScroll(me.$el.parent().get(0), opts.iScrollOpts = $.extend({
                useTransition: opts.useTransition,
                speedScale: opts.speedScale,
                topOffset: opts.topOffset
            }, opts.iScrollOpts, {
                onScrollStart: function (e) {
                    me.trigger('scrollstart', e);
                },
                onScrollMove: (function () {
                    var up = opts.$upElem && opts.$upElem.length,
                        down = opts.$downElem && opts.$downElem.length;

                    return function (e) {
                        var upRefreshed = opts['_upRefreshed'],
                            downRefreshed = opts['_downRefreshed'],
                            upStatus = me._status('up'),
                            downStatus = me._status('down');

                        if (up && !upStatus || down && !downStatus || this.maxScrollY >= 0) return;    //���²���ͬʱ���� trace:FEBASE-775����wrapper > scrollerʱ�������м��� trace:FEBASE-774
                        if (downStatus && down && !downRefreshed && this.y < (this.maxScrollY - threshold)) {    //�±߰�ť����������
                            me._setMoveState('down', 'beforeload', 'pull');
                        } else if (upStatus && up && !upRefreshed && this.y > threshold) {     //�ϱ߰�ť����������
                            me._setMoveState('up', 'beforeload', 'pull');
                            this.minScrollY = 0;
                        } else if (downStatus && downRefreshed && this.y > (this.maxScrollY + threshold)) {      //�±߰�ť�������ָ�
                            me._setMoveState('down', 'loaded', 'restore');
                        } else if (upStatus && upRefreshed && this.y < threshold) {      //�ϱ߰�ť�������ָ�
                            me._setMoveState('up', 'loaded', 'restore');
                            this.minScrollY = -opts.topOffset;
                        }
                        me.trigger('scrollmove', e);
                    };
                })(),
                onScrollEnd: function (e) {
                    var actDir = opts._actDir;
                    if (actDir && me._status(actDir)) {   //trace FEBASE-716
                        me._setStyle(actDir, 'loading');
                        me._loadingAction(actDir, 'pull');
                    }
                    me.trigger('scrollend', e);
                }
            }));
        },
        _setMoveState: function (dir, state, actType) {
            var me = this,
                opts = me._options;

            me._setStyle(dir, state);
            opts['_' + dir + 'Refreshed'] = actType == 'pull';
            opts['_actDir'] = actType == 'pull' ? dir : '';

            return me;
        },
        afterDataLoading: function (dir) {
            var me = this,
                opts = me._options,
                dir = dir || opts._actDir;

            opts.iScroll.refresh();
            opts['_' + dir + 'Refreshed'] = false;
            return me.origin(dir);
        }
    } );
})( gmu, gmu.$ );