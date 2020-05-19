(function($){

	$.fn.userselect = function(options)
	{
		var settings = $.extend(true, {}, $.fn.userselect.defaults, options);
		return $(this).each(function(){
			var o = new $.userselect($(this), settings);
            o.init(settings);
			$(this).data('userselect', o);
		});
	};

	$.userselect = function(el, settings) {
		var me = this,
            $el = el,
            $tpl = $(settings.tpl.wrapper),
            $selectedList = $tpl.find(".ui-tab-content ul").eq(0),
            $nav = $tpl.find(".ui-tab li"),
            $searchInput = $tpl.find(".ui-tab-content input"),
            $resetSearch = $tpl.find(".ui-searchbar-wrap .ui-icon-close"),
            $searchList = $tpl.find(".ui-tab-content ul").eq(1),
            $sourceList = el,
            $confirmBtn = $tpl.find("button[node-type='confirm']"),
            $cancelBtn = $tpl.find("button[node-type='cancel']"),
            $labelList = $tpl.find(".ui-tab-content .ui-label-list");


        me.init = function (settings){

            // 添加wrapper
            if ($('body').find(settings.wrapperId).length == 0) {
                $('body').append($tpl.attr("id", settings.wrapperId.substr(1)));

                var uids = me.sourceList.get() || [];
                me.store.get(uids, function (data){
                    settings.debug && console.log("plugin init", data);
                    me.userselect.init(data);
                    me.selectedList.init(data);
                    me.selectNav.init();
                    me.input.init();
                });

                settings.initCb();
                me.Event(['selected', 'searchByName', 'resetSearchByName', 'addToSelected', 'confirm', 'cancel']).bind();
            } else {

                me.selectedList.init({});

            }

            $('body').find(settings.wrapperId).show();
            $confirmBtn.on('click', function(){
            	settings.onconfirm && settings.onconfirm();
            });
            $cancelBtn.on('click', function(){
            	settings.oncancel && settings.oncancel();
            });
        };
        var localData = localStorage && localStorage.getItem(settings.storageName) ? localStorage.getItem(settings.storageName) : '{}';
        // localstorage
        me.store = {
            _data: JSON.parse(localData),
            set: function (items) {
                var _data = this._data || {};
                settings.debug && console.log("me.store.set", _data);
                $.extend(_data, items);
                this._data = _data;
                localStorage.setItem(settings.storageName, JSON.stringify(_data));
                settings.debug && console.log("me.store.set", localStorage.getItem(settings.storageName));
            },
            get: function (keyArr, cb){
                var that = this;
                var output = {};
                var unFindKeyArr = [];
                var _keyArr = [];

                if (typeof keyArr != "object") {
                    _keyArr.push(keyArr);
                } else {
                    _keyArr = keyArr;
                }

                if (this._data) {
                    for (var i in _keyArr) {
                        if (that._data[_keyArr[i]]) {
                            output[_keyArr[i]] = that._data[_keyArr[i]];
                        } else {
                            unFindKeyArr.push(_keyArr[i]);
                        }
                    }
                } else {
                    unFindKeyArr = _keyArr;
                }

                settings.debug && console.log("unFindKeyArr", unFindKeyArr);

                // 没找到的情况
                if (unFindKeyArr.length > 0) {
                    var params = {
                        UIDS : unFindKeyArr.join(','),
                        A : 'getByUids'
                    };
                    $.extend(params, settings.searchParams);
                    $.ajax({
                        type: 'GET',
                        url: settings.searchUserUrl,
                        data: params,
                        success: function(data){
                            settings.debug && console.log("ajax success:", data);
                            if(data!="") {
                                var _data = JSON.parse(data);
                                that.set(_data);
                                $.extend(output, _data);
                                settings.debug && console.log("ajax output :", output);
                                cb && cb(output);
                            }
                        },
                        error: function(xhr, type){
                            alert('Ajax error!')
                        }
                    })
                } else {
                    settings.debug && console.log("外层 output :", output);
                    cb && cb(output);
                    return output;
                }
            }
        };

        // 隐藏的输入框
        me.input = {
            init: function (){
                var $form = $el.parents("form");
                var $input = $(settings.tpl.input);
                if($form.length > 0) {
                    //remove the previous hidden input
                    $form.find('input[name='+ settings.input.name +']').remove();

                    if (typeof settings.input.name == 'undefined'){
                        settings.input.name = el.attr("id");
                    }

                    $input.attr("name" , settings.input.name).attr("id" , settings.input.name);
                    $form.append($input);
                    me.$input = $input;
                }else
				{
					$input.attr("name" , settings.input.name).attr("id" , settings.input.name);
					me.$input = $input;
				}
                this.update();
            },
            update: function (){
                var ret = {
                    'uid': [],
                    'id': [],
                    'name': []
                };

                $.each(me.userselect._data, function(index, item){
                    ret['uid'].push(index);
                    ret['id'].push(item.user_id);
                    ret['name'].push(item.user_name);
                });

                var result = ret[settings.input.type];
                result = result ? result.join(',') : '';
                me.$input.val(result);
            }
        };

        // 核心数据
        me.userselect = {
            _data : {},
            init: function(data){
                this._data = data;
            },
            add: function (items) {
                var that = this;
                $.each(items, function(index, item){
                    if (!that._data[index]) {
                        that._data[index] = item;
                    }
                });
            },
            remove: function (key) {
                if (this._data[key])
                    delete this._data[key];
                return true;
            },
            removeAll: function () {
                this._data = {};
            },
            get: function (key) {
                return this._data[key];
            },
            getAll: function (){
                return this._data;
            }
        };

        // 被实例化的选人对象
        me.sourceList = {
            get: function (){
                var keyArr = [];
                var _selectNum = $el.find('span').length;
                if (_selectNum > 0) {

                    $el.find('span').each(function(){
                        keyArr.push($(this).attr("data-user-uid"));
                    });
                    settings.debug && console.log("me.sourceList.init keyArr", keyArr);
                }
                return keyArr;
            },
            add: function (key){
                $sourceList.append(me.View('source').render(key));
            },
            addByData: function (item){
                settings.debug && console.log("me.sourceList.addByData", item);
                $sourceList.append(me.View('source').renderByData(item));
            },
            remove: function (key){
                $sourceList.find("span[data-user-uid='" + key +"']").remove();
            },
            removeAll: function (){
                $sourceList.empty();
                return this;
            }
        };

        // 已选列表
        me.selectedList = {
            init: function (data){
                if ($.isEmptyObject(data)) {
                    $selectedList.empty();
                } else {
                    var keyArr = [];
                    $.each(data, function(index){
                        keyArr.push(index);
                    });
                    settings.debug && console.log("selectedList init", keyArr);
                    this.add(keyArr);
                }
            },
            add: function (item){
                settings.debug && console.log("me.selectedList.add", item);
                $selectedList.append(me.View('select').render(item));
            },
            addByData: function (item){
                settings.debug && console.log("me.selectedList.addByData", item);
                $selectedList.append(me.View('select').renderByData(item));
            },
            select: function (key) {
                var dom = typeof key == "object" ? key : $selectedList.find("li[data-user-uid='" + key +"']");
                dom.removeClass("unselected");
            },
            unselect: function (key) {
                if (typeof key == "object") {
                    key.addClass("unselected");
                } else {
                    $selectedList.find("li[data-user-uid='" + key +"']").addClass("unselected");
                }
            },
            removeAll: function() {
                $selectedList.empty();
                return this;
            }
        };

        me.selectNav =  {
            init: function (){
                var count = 0;
                $.each(me.userselect._data, function(){
                    count++;
                })
                me.selectedNum = count;
                this.render();

                if(me.selectedNum == 0){
                    setTimeout(function(){
                        $nav.eq(1).trigger('mousedown');
                        $nav.eq(1).trigger('mouseup');

                        me.recentSelected.renderLabel();
                    },0);
                }
            },
            set : function (opt){
                switch (opt) {
                    case 'decr':
                        me.selectedNum--;
                        break;
                    case 'incr':
                        me.selectedNum++;
                        break;
                    default:
                        me.selectedNum = parseInt(opt);
                        break;
                }
                this.render();
            },
            render: function(){
                var text = "已选" + (me.selectedNum == 0 ? "" : "（" + me.selectedNum +"）");
                $nav.eq(0).text(text);
            }
        };

        // 搜索列表
        me.searchList = {
            render : function (items) {
                this.clear();
                $searchList.append(me.View('search').renderByData(items));
                $searchList.find("li").each(function(){
                    var key = $(this).attr("data-user-uid");
                    if (me.userselect._data[key]) {
                        $(this).removeClass("unselected")
                    }
                });
            },
            select: function (key) {
                var dom = typeof key == "object" ? key : $searchList.find("li[data-user-uid='" + key +"']");
                dom.removeClass("unselected");
            },
            unselect: function (key) {
                if (typeof key == "object") {
                    $(this).addClass("unselected");
                } else {
                    $searchList.find("li[data-user-uid='" + key +"']").addClass("unselected");
                }
            },
            clear: function (){
                $searchList.empty();
            }
        };

        me.View = function (type){
            var tpl = settings.tpl[type];
            return {
                render : function(keyArr) {
                    settings.debug && console.log("me.View.keyArr", keyArr);
                    settings.debug && console.log("me.View.keyArr", keyArr);
                    var users = me.store.get(keyArr);
                    settings.debug && settings.debug && console.log("me.View.users", users);
                    return this.renderByData(users);
                },
                renderByData : function (items) {
                    settings.debug && console.log("me.View.renderByData", items);
                    var html = '';
                    $.each(items, function (index, item){
                        settings.debug && console.log("me.View.renderByData.item", index, item);
                        var _tpl = tpl;
                        _tpl = _tpl.replace(/{{id}}/g, item.user_id);
                        _tpl = _tpl.replace(/{{uid}}/g, item.user_uid);
                        _tpl = _tpl.replace(/{{name}}/g, item.user_name);
                        _tpl = _tpl.replace(/{{priv}}/g, item.priv_name);
                        _tpl = _tpl.replace(/{{dept}}/g, item.dept_name);
                        html += _tpl;
                    });
                    return html;
                }
            }
        };

        // 事件
        me.Event = function() {
            var evt = arguments[0];
            return {
                fire: function (){
                    var key = arguments[0];
                    switch (evt) {
                        case 'resetSearchList':
                            $searchList.find("li").remove();
                            break;
                        case 'searchByName':
                            var kword = $searchInput.val();
                            if (kword == "") {
                                me.Event('resetSearchList').fire();
                                return;
                            }
                            var opts = {
                                P : settings.p,
                                KWORD : kword
                            };
                            settings.debug && console.log("me.Event.fire.searchByName", opts);
                            $.extend(opts, settings.searchParams);
                            $.getJSON(settings.searchUserUrl, opts, function(data){
                                settings.debug && console.log("Fire searchByName", data);
                                if (data != "")
                                    me.searchList.render(data);
                                else
                                    me.searchList.clear();
                            });
                            return;
                            break;
                        case 'select':
                            // 已选去掉 unselected 类
                            $selectedList.find("li[data-user-uid='" + key + "']").removeClass("unselected");

                            // 搜索去掉 unselected 类
                            $searchList.find("li[data-user-uid='" + key + "']").removeClass("unselected");

                            me.userselect.add(me.store.get([key]));

                            // me.sourceList.add(key);

                            // 已选增加 1
                            me.selectNav.set('incr');

                            break;
                        case 'unselect':

                            // 已选去掉 unselected 类
                            $selectedList.find("li[data-user-uid='" + key + "']").addClass("unselected");

                            // 搜索去掉 unselected 类
                            $searchList.find("li[data-user-uid='" + key + "']").addClass("unselected");

                            me.userselect.remove(key);

                            // 从source中去掉
                            // me.sourceList.remove(key);

                            // 已选删除 1
                            me.selectNav.set('decr');

                            break;

                        case 'new':
                            settings.debug && console.log("Event fire new", key);
                            me.store.set(key);
                            me.userselect.add(key);
                            me.selectedList.addByData(key);
                            break;
                        case 'confirm':
                            var _data = me.userselect._data;
                            me.recentSelected.storeUser(_data);
                            me.sourceList.removeAll().addByData(_data);
                            me.selectedList.removeAll().addByData(_data);
                            me.input.update();
                            me.close();
                            break;
                        case 'cancel':

                            me.close();
                            break;
                    }
                },
                bind : function () {
                    evt.forEach(function(v){
                        switch (v) {
                            case 'selected':
                                $selectedList.on('tap', 'li', function(){
                                    var key = $(this).attr("data-user-uid");
                                    settings.debug && console.log("Evt bind selected：", key);
                                    if ($(this).hasClass("unselected"))
                                        me.Event('select').fire(key);
                                    else
                                        me.Event('unselect').fire(key);
                                    return;
                                });
                                break;
                            case 'addToSelected':
                                $searchList.on('tap', 'li', function(){
                                    var key = $(this).attr("data-user-uid");
                                    settings.debug && console.log("Evt bind addToSelected：", key, "exist", me.userselect._data[key]);
                                    if (me.userselect._data[key] || false) {
                                        me.Event('unselect').fire(key);
                                    } else {

                                        var item = {
                                            user_id: $(this).attr('data-user-id'),
                                            user_uid: key,
                                            user_name: $(this).attr('data-user-name'),
                                            priv_name: $(this).attr('data-priv-name'),
                                            dept_name: $(this).attr('data-dept-name')
                                        };
                                        var _item = {};
                                        _item[key] = item;
                                        me.userselect.add(_item);

                                        if ($selectedList.find("li[data-user-uid='" + key + "']").length == 0) {
                                            me.Event('new').fire(_item);
                                        }

                                        settings.debug && console.log("Evt bind addToSelected", _item);
                                        me.Event('select').fire(key);
                                    }
                                });
                                break;
                            case 'resetSearchByName':
                                $resetSearch.on('touchstart', function(){
                                    $searchInput.val("").focus();
                                    me.Event('resetSearchList').fire();
                                });
                                break;
                            case 'searchByName':
                                $searchInput.on('keyup oninput onpropertychange', function(){
                                    me.wait(1000).done(function(){
                                        me.Event('searchByName').fire();
                                    })
                                });
                                break;
                            case 'confirm':
                                $confirmBtn.on('click', function(){
                                    me.Event('confirm').fire();
                                });
                                break;
                            case 'cancel':
                                $cancelBtn.on('click', function(){
                                    me.Event('cancel').fire();
                                });
                                break;
                        }
                    })
                }
            }
        }

        me.wait = function (time){
            var now = new Date().getTime();
            var lastSearchSt = me.lastSearchSt || 0;
            clearTimeout(me.timer);
            me.timer = null;
            return {
                done : function (cb){
                    clearTimeout(me.timer);
                    me.timer = null;
                    me.timer = setTimeout(function() {
                        me.lastSearchSt = now;
                        if(now > (lastSearchSt + time)) {
                            cb();
                        } else{
                            return;
                        }
                    }, time);
                }
            }
        };

        me.close = function (){
            $('body').find(settings.wrapperId).remove();
            location.hash = '';
        };

        me.recentSelected = (function(){
            try{
                //定义一个数组存下最近搜索并选择过的人
                var recentUser = JSON.parse(localStorage && localStorage["recent_user"] ? localStorage["recent_user"] : null) || [];
                //储存已选择的用户
                var storeUser = function(data){
                    for(var prop in data){
                        //loop through the recentUser array, remove any duplicate item
                        recentUser = recentUser.filter(function(item){
                            if(item.user_uid !== prop){
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if(recentUser.length < 20){//只缓存20个最近选择过的用户
                            recentUser.push(data[prop]);
                        } else {
                            recentUser.shift();
                            recentUser.push(data[prop]);
                        }
                    }
                    localStorage["recent_user"] = JSON.stringify(recentUser);
                }

                //render the label list of recent users
                var renderLabel = function(){
                    var resultHtml = '';
                    var recentUser_copy = recentUser.slice();
                    recentUser_copy.reverse();
                    recentUser_copy.forEach(function(item){
                        var dest = $.tpl(settings.tpl.nameLabel,item);
                        resultHtml += dest;
                    });
                    $labelList.append(resultHtml);
                }

                //events bind

                $labelList.on('click','label',function(e){
                    var key = $(this).attr('data-user-uid');
                    var _item = me.store.get([key]);
                    $(this).remove();
                    me.userselect.add(_item);
                    if ($selectedList.find("li[data-user-uid='" + key + "']").length == 0) {
                        me.Event('new').fire(_item);
                    }
                    // 已选增加 1
                    me.selectNav.set('incr');
                    return false;
                });


                return {
                    storeUser: storeUser,
                    renderLabel: renderLabel
                };

            } catch(e){
                alert(e.message)
            };

        })();

    };

	$.fn.userselect.defaults = {
        debug: false,
        wrapperId : '',
        searchParams : {
            P : P
        },
        storageName : 'userinfo',
        selectedNum : 0,
        input: {'type': 'uid'},
        searchUserUrl: '/mobile/inc/get_contactlist.php',
        tpl : {
            input: '<input type="hidden" />',
            source : '<span data-user-uid="{{uid}}" data-user-id="{{id}}">{{name}}</span>',
            wrapper : '<section class="ui-container userselect-ui-container"><footer class="ui-footer ui-footer-btn"><div class="ui-footer ui-footer-stable ui-btn-group ui-border-t"><button node-type="confirm" class="ui-btn-lg ui-btn-primary">确认</button><button node-type="cancel" class="ui-btn-lg">取消</button> </div></footer><section class="ui-container"><div class="ui-tab"><ul class="ui-tab-nav ui-border-b"><li>已选</li><li>搜索</li></ul><ul class="ui-tab-content" style="width:200%;"><li><ul class="ui-list"></ul></li><li><div class="ui-searchbar-wrap focus"><div class="ui-searchbar ui-border-radius"><i class="ui-icon-search"></i><div class="ui-searchbar-text">用户姓名</div><div class="ui-searchbar-input"><input value="" type="text" placeholder="用户姓名" autocapitalize="off"></div><img src="/static/images/search_close_btn@3x.png" style="width: 11px;height: 11px;margin-right: 14px;" class="ui-icon-close" /></div></div><div class="ui-label-list"></div><ul class="ui-list"></ul></li></ul></div></section></section>',
            select: '<li class="ui-border-t" data-user-uid="{{uid}}" data-user-id="{{id}}"><div class="ui-list-thumb-s"><i class="ui-icon-success"></i></div><div class="ui-list-info"><h4 class="ui-nowrap">{{name}}<span class="date">（{{priv}}）</span></h4><p style="color:#999;font-size:12px;"><span>部门：{{dept}}</span></p></div></li>',
            search: '<li class="ui-border-t unselected" data-user-uid="{{uid}}" data-user-id="{{id}}" data-user-name="{{name}}" data-dept-name="{{dept}}" data-priv-name="{{priv}}"><div class="ui-list-thumb-s"><i class="ui-icon-success"></i></div><div class="ui-list-info"><h4 class="ui-nowrap">{{name}}<span class="date">（{{priv}}）</span></h4><p style="color:#999;font-size:12px;"><span>部门：{{dept}}</span></p></div></li>',
            nameLabel: '<label class="ui-label" data-user-uid="<%=user_uid%>"><%=user_name%></label>'
        },
        initCb: function(){
            var tab = new fz.Scroll('.ui-tab', {
                role: 'tab',
                autoplay: false,
                interval: 3000
            });
        }
	};

})(Zepto);
