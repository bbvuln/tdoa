// ----- 以下是帮助函数和对象 ------ //

//调试输出数据对象
function elert(data){
    alert(JSON.stringify(data));
}

//localStorage wrapper
var storage = {
    get: function(k){
		try {
			return JSON.parse(localStorage.getItem(k));
		} catch(e) {
			return null;
		}
	},
	set: function(k,v){
        if(typeof v === "object") {
            localStorage.setItem(k,JSON.stringify(v));
        } else {
            localStorage.setItem(k,v);
        }
	},
	clear: function(k){
	    localStorage.removeItem(k);
	},
	clearAll: function(){
        for(var prop in localStorage){
            localStorage.removeItem(prop);
        }
    }
};

/*
 * 移动端调试困难，代码执行失败没有任何提示
 * 所有代码通过try-catch来跑，此处对try-catch做一层封装
 * 一旦遇到runtime错误，可以及时抛出
 */
 function tryToExe(func,caller){
     try{
         func && caller && func.call(caller);
     } catch(e){
         alert(e.message);
     }
 }


//解析cookie
function parseCookie(){
    var cookies = document.cookie.replace(" ","").split(";");
    var cookieObj = {};
    $.each(cookies,function(index,item){
        var key = item.split("=")[0];
        var value = item.split("=")[1];
        cookieObj[key] = value;
    });

    return cookieObj;
}

// 解析 loaction.search
function parseSearch() {
    var search = location.search.substr(1)
    if(search === "") return {}
    var portionArray = search.split("&")
    var ret = {}

    portionArray.forEach(function(item, index) {
        var key = item.split("=")[0]
        var val = item.split("=")[1]
        ret[key] = val
    })

    return ret
}


//纪录代码执行时间
var tdTrace  = {
    infos: {},
    start: function(name){
        tdTrace.infos[name] = {};
        tdTrace.infos[name].start = new Date().getTime();
    },
    end: function(name){
        if(tdTrace.infos[name]){
            tdTrace.infos[name].end = new Date().getTime();
            tdTrace.infos[name].cost = tdTrace.infos[name].end - tdTrace.infos[name].start;
        }
    }
}
// ----- 以上是帮助函数和对象 ------ //




 //命名空间
var tdApp = {};

//调试flag
tdApp.debug = false;

tdApp.mockData  = [];

//启动器
tdApp.start = function(appid){
    this.appid = appid;
    tryToExe(tdApp.nav.init,tdApp.nav);
    tryToExe(tdApp.category.init,tdApp.category);
}

/*
 * tdApp对象的各个功能单元以逻辑组件的形式定义在下方。
 * 以@开头的注释均为组件的实现
 * 组件在这里定义，查找实现，可以复制组件对应的注释<Ctrl-F>查找
 * # example:查找category的实现，复制"//@分类目录"，进行查找
 */

tdApp.nav = {};//@四个导航入口，待办、发起、办结、查询
tdApp.category = {};//@分类目录


/*
 * 这里是各个功能组件的实现
 * nav,
 * guide,
 * catogory
 */


//@四个导航入口，待办、发起、办结、查询
tdApp.nav = {
    //初始化
    init: function(){
        this.events();
        tdApp.debug && alert('nav初始化完毕');
    },
    //绑事件
    events: function(){

        // 头部导航
        $('.ui-workflow-nav').delegate('li','click',function(){

            var target = $(this);
            var data_op = target.attr('data-op');

            // tMobileSDK.ut(data_op);//打点
            if(data_op === "") return;
            window.location = '/pda/apps/list.php?kind=' + tdAppId + '&atype=' + data_op + '#index';
        });

        // 获取代办数目
        $.get('/pda/apps/get_undo_count.php', { kind: tdAppId }, function(count) {
            var tdAppUndo = count
            // set undo count
            if( tdAppUndo <= 0 ) {
                //$('.ui-badge-cornernum').hide()
            } else if( tdAppUndo > 99 ) {
                $('.ui-badge-cornernum').text('99+')
                $('.ui-badge-cornernum').show()
            } else {
                $('.ui-badge-cornernum').text(tdAppUndo)
                $('.ui-badge-cornernum').show()
            }
        })

    }
};



//@用户首次进来的引导程序
/* tdApp.guide = {
    init: function(){
        this.show();
        tdApp.debug && alert('guide初始化完毕');
    },
    show: function(){
        if(localStorage){
            var firstLogin = localStorage.getItem('first-login');
            if(firstLogin){
                return false;
            }else{
                $('.intro').addClass('active');
            }
        }
    },
    hide: function(){
        $('.intro').removeClass('active');
        if(localStorage){
            localStorage.setItem('first-login', true);
        }
    }
}; */




//@分类目录
tdApp.category = {

    allworkkey: 'td_app_list_of_all_data',//全部工作在localStorage中的键名
    commonworkkey: 'td_app_list_of_common_data',//常用工作键名
    category_info: {},//后台给的工作分类信息


    init: function(){

        this.fetchAllDataAndRender(tdApp.appid);
        this.fetchCategoryInfo(tdApp.appid);
        this.renderWorklistBeforeSendRequest();

        if(!this.checkStickySupported()){
            this.simulateSticky();
        }
        this.events();
        tdApp.debug && alert('category初始化完毕');
    },

    initKey: function(token){
        this.allworkkey = 'td_app_list_of_all_data_' + (token ? token : '');
        this.commonworkkey = 'td_app_list_of_common_data_' + (token ? token : '');
    },

    getAllWork: function(){//取全量数据
        return storage.get(this.allworkkey) || tdApp.mockData;
    },

    getCommonWork: function(){
        var counter = storage.get(this.commonworkkey) || {};
        var _ids = Object.keys(counter);

        var allwork_data = storage.get(this.allworkkey);
        var commonwork_data = allwork_data.filter(function(item){
            return $.inArray(item.id.toString(),_ids) !== -1;
        });


        //排序规则，最常用的业务排在最前面
        commonwork_data.forEach(function(item){
            item.count = counter[item.id]
        });

        commonwork_data.sort(function(a,b){
            return b.count - a.count;
        });

        return commonwork_data;
    },

    // 获取数据并渲染
    fetchAllDataAndRender: function(appid) {

        var self = this;
        $.get('/pda/apps/get_rep.php', {kind: appid}, function(allwork) {
            storage.set(self.allworkkey, allwork)
            self.renderWorklistAfterSendRequest()
        })
    },

    // 获取分类信息
    fetchCategoryInfo: function(appid) {

        var self = this
        $.get('/pda/apps/get_kind.php', {kind: appid}, function(category_info) {
            self.category_info = JSON.parse(category_info)
            loadingTip.loading("hide")
        })
    },

    // 从localStorage渲染首屏
    renderWorklistBeforeSendRequest: function(){
        //获取上一次选择的分类目录项
        var lastestMenu = storage.get('lastestMenu') || 'all';
        if(lastestMenu === 'all'){
            this.renderWorklist(this.getAllWork());
            this.setCategoryName("全部业务");
        } else if(lastestMenu === 'common'){
            this.setCategoryName("常用业务");
            this.renderWorklist(this.getCommonWork());
        }
    },

    //
    renderWorklistAfterSendRequest: function(){
        //获取上一次选择的分类目录项
        var lastestMenu = storage.get('lastestMenu') || 'all';
        if(lastestMenu === 'all'){
            this.renderWorklist(this.getAllWork());
            this.setCategoryName("全部业务");
        } else if(lastestMenu === 'common'){
            // do nothing
        }
    },

    //渲染首页的工作列表
    renderWorklist: function(data){
        var data = { list: data };
        var tmpl = $('#workflow-list-tmpl').html();
        var content = $.tpl(tmpl,data);
        $('.ui-workflow-list ul').html(content);
    },

    renderLeftMenu: function(category_info){
        // if(Object.keys(category_info).length === 0 ) {
          //  return false;
        // }
        var self = this;
        var data = category_info.slice();
        data[1].count = Object.keys(storage.get(this.commonworkkey) || []).length;

        //渲染用户自定义分类
        var _data = { list: data };
        var tmpl = $('#first-menu-tmpl').html();
        var _content = $.tpl(tmpl,_data);
        $('.allflow-menu-left ul').html(_content);

    },

    renderRightMenu: function(category_id){
        var data = this.category_info[category_id].list_of_subcategory;
        //渲染
        var _data = { list: data };
        var tmpl = $('#second-menu-tmpl').html();
        var content = $.tpl(tmpl,_data);
        $('.allflow-menu-right ul').html(content);
    },

    // 设置菜单面板宽高（WnH is short for Width and Height）
    setupPanelWnH: function(){
        var windowh = $(window).height();
        var windoww = $(window).width();
        var panelh = parseInt(windowh * 0.9);
        var menuh = panelh - 74;
        var logoh = menuh/2 - 20;
        var menuw = parseInt(windoww * 0.45);
        $('#menuPanel').height(panelh);
        $('.allflow-menu-body').height(menuh);
        $('.allflow-menu-left').width(menuw);
        $('.iconlogo-img').css("margin-top",logoh);
        $('.allflow-menu-right').css('margin-left',menuw);
    },

    show: function(){
        $('#masklayer,#menuPanel').show();
        $('#masklayer').addClass('active');
    },

    hide: function(){
        $('#masklayer,#menuPanel').hide();
        $('#masklayer').removeClass('active');
    },

    commonWorkCounter: function(id){
        var counter = storage.get(this.commonworkkey) || {};
        //计数
        if(!counter[id]){//新增工作
            counter[id] = 0;
        }
        counter[id]++;
        //存储
        storage.set(this.commonworkkey,counter);
    },

    //设置分类菜单入口名称
    setCategoryName: function(name){
        name = name.substr(0,9);
        $('.allflow-btn span').text(name);
    },

    //还原右侧菜单的初始状态
    recoverRightMenu: function(){
        $('.allflow-menu-right ul').empty().append('<div class="ui-icon-logo iconlogo-img"></div>');
    },

    //检测是否支持position:sticky属性，因为在移动端剔除了ie的检测
    checkStickySupported: function(){
        var doc = document,
            container = doc.body,
            isSupported,
            stickyPrefix = ['-webkit-','-o-','-moz-',''],
            el = doc.createElement('div'),
            getStyle = function(st){
                if(window.getComputedStyle){
                    return window.getComputedStyle(el).getPropertyValue(st);
                }
            };

        if(doc.createElement && container && container.appendChild && container.removeChild){

            container.appendChild(el);

            for(var i=0; i<stickyPrefix.length; i++){
                el.style.cssText = 'position:' + stickyPrefix[i] + 'sticky;visibility:hidden;';
                if(isSupported = getStyle('position').indexOf('sticky') !== -1){
                    break;
                }
            }
            el.parentNode.removeChild(el);
            return isSupported;
        }
    },

    simulateSticky: function(){
        var $target = $('#menulist_header'),
            target = $target[0],
            demensions = $target.offset(),
            placeholder = null,
            hasPlaceholder = false;

        //initlialization
        $target.css({
            boxSizing: 'border-box',
            width: demensions.width,
            height: demensions.height
        });

        function addPlaceholder(){
            placeholder = $('<div style="visibility:hidden;margin:0;padding:0;"></div>');
            placeholder.width($target.width())
                .height($target.height())
                .css("float", $target.css("float")).insertAfter($target);
        }

        function removePlaceholder(){
            placeholder && placeholder.remove();
        }

        $(window).on('scroll.sticky',function(){
            //加5是为了修复，界面上的流程刚好接近一屏时，状态在fixed与static之间跳动而引起的界面不稳定
            if($(window).scrollTop() >= demensions.top+5){
                $target.css({
                    position: 'fixed',
                    background: '#fff',
                    zIndex: 9,
                    top: 0
                })

                if(!hasPlaceholder){
                    addPlaceholder();
                    hasPlaceholder = true;
                }

            } else {
                $target.css({
                    position: 'static'
                })

                if(hasPlaceholder){
                    removePlaceholder();
                    hasPlaceholder = false;
                }
            }
        });
    },

    events: function(){
        var self = this;

        //进入“全部业务”按钮点击事件
        $('.ui-workflow-title').delegate('.allflow-btn','click',function(){
            if($('#masklayer').hasClass('active')){
                self.hide();
                return false;
            }else{
                //渲染一级菜单
                try{
                    self.renderLeftMenu(self.category_info);
                } catch(e){
                    alert(e.message);
                }
                self.show()
                self.setupPanelWnH();
                var scroll = new fz.Scroll('.allflow-menu-right', {
                    scrollY: true
                });
                var scroll = new fz.Scroll('.allflow-menu-left', {
                    scrollY: true
                });
            }
        });

        //一级菜单点击事件
        $('.allflow-menu-left').delegate('li','click',function(){
            var $target = $(this);
            var id = $target.attr('data-id');
            $('.allflow-menu-left li').removeClass('on');
            $target.addClass('on');

            if(id === 'all'){
                self.hide();
                var all_data = self.getAllWork();
                try{
                    self.renderWorklist(all_data);
                } catch(e){
                    alert(e.message);
                }
                //设置最后查看的菜单项
                storage.set('lastestMenu','all');
                self.setCategoryName($target.find('h4 span').text());
                //还原右侧面板
                self.recoverRightMenu();
            } else if(id === 'common'){
                self.hide();
                var common_data = self.getCommonWork();
                try{
                    self.renderWorklist(common_data);
                } catch(e){
                    alert(e.message);
                }
                //设置最后查看的菜单项
                storage.set('lastestMenu','common');
                self.setCategoryName($target.find('h4 span').text());
                //还原右侧面板
                self.recoverRightMenu();
            } else {
                //只要不是常用，就设置为全部
                storage.set('lastestMenu','all');
                // since category_info is an array, so we need to reference the rightMenu with the index
                var idIndex = 0;
                self.category_info.forEach(function(item, index) {
                  if(item.category_id === id) {
                    idIndex = index
                  }
                })
                self.renderRightMenu(idIndex);
            }

        });

        //二级菜单点击事件
        $('.allflow-menu-right').delegate('li','click',function(){
            var $target = $(this);
            var id = $target.attr('data-id');
            $.get('/pda/apps/get_rep.php',{kind:id},function(data){
                var data = JSON.parse(data);
                if(data !== null){
                    self.hide();
                    self.setCategoryName($target.find('h4').text().replace(/^全部/,""));
                    self.renderWorklist(data);
                } else {
                    tMobileSDK.alert("该目录下没有业务");
                    return false;
                }
            })
        });

        //蒙层事件
        $('.ui-workflow-wrap').delegate('#masklayer','click',function(){
            self.hide();
        });

        //菜单底部点击事件
        $('#menuPanel').delegate('.allflow-menu-footer','click',function(){
            self.hide();
        });

        //业务列表
        $('.ui-workflow-list').delegate('ul li','click',function(){

            var target = $(this);
            var link = target.attr('data-link') ;
            var id = target.attr('data-id') ;

            //业务计数
            self.commonWorkCounter(id);

            window.location = link + '#index';

        });

        $('.disableScroll').on('touchmove',function(){
            return false;
        });
    }
};
