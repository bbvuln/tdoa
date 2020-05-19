// ----- �����ǰ��������Ͷ��� ------ //

//����������ݶ���
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
 * �ƶ��˵������ѣ�����ִ��ʧ��û���κ���ʾ
 * ���д���ͨ��try-catch���ܣ��˴���try-catch��һ���װ
 * һ������runtime���󣬿��Լ�ʱ�׳�
 */
 function tryToExe(func,caller){
     try{
         func && caller && func.call(caller);
     } catch(e){
         alert(e.message);
     }
 }


//����cookie
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

// ���� loaction.search
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


//��¼����ִ��ʱ��
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
// ----- �����ǰ��������Ͷ��� ------ //




 //�����ռ�
var tdApp = {};

//����flag
tdApp.debug = false;

tdApp.mockData  = [];

//������
tdApp.start = function(appid){
    this.appid = appid;
    tryToExe(tdApp.nav.init,tdApp.nav);
    tryToExe(tdApp.category.init,tdApp.category);
}

/*
 * tdApp����ĸ������ܵ�Ԫ���߼��������ʽ�������·���
 * ��@��ͷ��ע�;�Ϊ�����ʵ��
 * ��������ﶨ�壬����ʵ�֣����Ը��������Ӧ��ע��<Ctrl-F>����
 * # example:����category��ʵ�֣�����"//@����Ŀ¼"�����в���
 */

tdApp.nav = {};//@�ĸ�������ڣ����졢���𡢰�ᡢ��ѯ
tdApp.category = {};//@����Ŀ¼


/*
 * �����Ǹ������������ʵ��
 * nav,
 * guide,
 * catogory
 */


//@�ĸ�������ڣ����졢���𡢰�ᡢ��ѯ
tdApp.nav = {
    //��ʼ��
    init: function(){
        this.events();
        tdApp.debug && alert('nav��ʼ�����');
    },
    //���¼�
    events: function(){

        // ͷ������
        $('.ui-workflow-nav').delegate('li','click',function(){

            var target = $(this);
            var data_op = target.attr('data-op');

            // tMobileSDK.ut(data_op);//���
            if(data_op === "") return;
            window.location = '/pda/apps/list.php?kind=' + tdAppId + '&atype=' + data_op + '#index';
        });

        // ��ȡ������Ŀ
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



//@�û��״ν�������������
/* tdApp.guide = {
    init: function(){
        this.show();
        tdApp.debug && alert('guide��ʼ�����');
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




//@����Ŀ¼
tdApp.category = {

    allworkkey: 'td_app_list_of_all_data',//ȫ��������localStorage�еļ���
    commonworkkey: 'td_app_list_of_common_data',//���ù�������
    category_info: {},//��̨���Ĺ���������Ϣ


    init: function(){

        this.fetchAllDataAndRender(tdApp.appid);
        this.fetchCategoryInfo(tdApp.appid);
        this.renderWorklistBeforeSendRequest();

        if(!this.checkStickySupported()){
            this.simulateSticky();
        }
        this.events();
        tdApp.debug && alert('category��ʼ�����');
    },

    initKey: function(token){
        this.allworkkey = 'td_app_list_of_all_data_' + (token ? token : '');
        this.commonworkkey = 'td_app_list_of_common_data_' + (token ? token : '');
    },

    getAllWork: function(){//ȡȫ������
        return storage.get(this.allworkkey) || tdApp.mockData;
    },

    getCommonWork: function(){
        var counter = storage.get(this.commonworkkey) || {};
        var _ids = Object.keys(counter);

        var allwork_data = storage.get(this.allworkkey);
        var commonwork_data = allwork_data.filter(function(item){
            return $.inArray(item.id.toString(),_ids) !== -1;
        });


        //���������õ�ҵ��������ǰ��
        commonwork_data.forEach(function(item){
            item.count = counter[item.id]
        });

        commonwork_data.sort(function(a,b){
            return b.count - a.count;
        });

        return commonwork_data;
    },

    // ��ȡ���ݲ���Ⱦ
    fetchAllDataAndRender: function(appid) {

        var self = this;
        $.get('/pda/apps/get_rep.php', {kind: appid}, function(allwork) {
            storage.set(self.allworkkey, allwork)
            self.renderWorklistAfterSendRequest()
        })
    },

    // ��ȡ������Ϣ
    fetchCategoryInfo: function(appid) {

        var self = this
        $.get('/pda/apps/get_kind.php', {kind: appid}, function(category_info) {
            self.category_info = JSON.parse(category_info)
            loadingTip.loading("hide")
        })
    },

    // ��localStorage��Ⱦ����
    renderWorklistBeforeSendRequest: function(){
        //��ȡ��һ��ѡ��ķ���Ŀ¼��
        var lastestMenu = storage.get('lastestMenu') || 'all';
        if(lastestMenu === 'all'){
            this.renderWorklist(this.getAllWork());
            this.setCategoryName("ȫ��ҵ��");
        } else if(lastestMenu === 'common'){
            this.setCategoryName("����ҵ��");
            this.renderWorklist(this.getCommonWork());
        }
    },

    //
    renderWorklistAfterSendRequest: function(){
        //��ȡ��һ��ѡ��ķ���Ŀ¼��
        var lastestMenu = storage.get('lastestMenu') || 'all';
        if(lastestMenu === 'all'){
            this.renderWorklist(this.getAllWork());
            this.setCategoryName("ȫ��ҵ��");
        } else if(lastestMenu === 'common'){
            // do nothing
        }
    },

    //��Ⱦ��ҳ�Ĺ����б�
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

        //��Ⱦ�û��Զ������
        var _data = { list: data };
        var tmpl = $('#first-menu-tmpl').html();
        var _content = $.tpl(tmpl,_data);
        $('.allflow-menu-left ul').html(_content);

    },

    renderRightMenu: function(category_id){
        var data = this.category_info[category_id].list_of_subcategory;
        //��Ⱦ
        var _data = { list: data };
        var tmpl = $('#second-menu-tmpl').html();
        var content = $.tpl(tmpl,_data);
        $('.allflow-menu-right ul').html(content);
    },

    // ���ò˵�����ߣ�WnH is short for Width and Height��
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
        //����
        if(!counter[id]){//��������
            counter[id] = 0;
        }
        counter[id]++;
        //�洢
        storage.set(this.commonworkkey,counter);
    },

    //���÷���˵��������
    setCategoryName: function(name){
        name = name.substr(0,9);
        $('.allflow-btn span').text(name);
    },

    //��ԭ�Ҳ�˵��ĳ�ʼ״̬
    recoverRightMenu: function(){
        $('.allflow-menu-right ul').empty().append('<div class="ui-icon-logo iconlogo-img"></div>');
    },

    //����Ƿ�֧��position:sticky���ԣ���Ϊ���ƶ����޳���ie�ļ��
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
            //��5��Ϊ���޸��������ϵ����̸պýӽ�һ��ʱ��״̬��fixed��static֮������������Ľ��治�ȶ�
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

        //���롰ȫ��ҵ�񡱰�ť����¼�
        $('.ui-workflow-title').delegate('.allflow-btn','click',function(){
            if($('#masklayer').hasClass('active')){
                self.hide();
                return false;
            }else{
                //��Ⱦһ���˵�
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

        //һ���˵�����¼�
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
                //�������鿴�Ĳ˵���
                storage.set('lastestMenu','all');
                self.setCategoryName($target.find('h4 span').text());
                //��ԭ�Ҳ����
                self.recoverRightMenu();
            } else if(id === 'common'){
                self.hide();
                var common_data = self.getCommonWork();
                try{
                    self.renderWorklist(common_data);
                } catch(e){
                    alert(e.message);
                }
                //�������鿴�Ĳ˵���
                storage.set('lastestMenu','common');
                self.setCategoryName($target.find('h4 span').text());
                //��ԭ�Ҳ����
                self.recoverRightMenu();
            } else {
                //ֻҪ���ǳ��ã�������Ϊȫ��
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

        //�����˵�����¼�
        $('.allflow-menu-right').delegate('li','click',function(){
            var $target = $(this);
            var id = $target.attr('data-id');
            $.get('/pda/apps/get_rep.php',{kind:id},function(data){
                var data = JSON.parse(data);
                if(data !== null){
                    self.hide();
                    self.setCategoryName($target.find('h4').text().replace(/^ȫ��/,""));
                    self.renderWorklist(data);
                } else {
                    tMobileSDK.alert("��Ŀ¼��û��ҵ��");
                    return false;
                }
            })
        });

        //�ɲ��¼�
        $('.ui-workflow-wrap').delegate('#masklayer','click',function(){
            self.hide();
        });

        //�˵��ײ�����¼�
        $('#menuPanel').delegate('.allflow-menu-footer','click',function(){
            self.hide();
        });

        //ҵ���б�
        $('.ui-workflow-list').delegate('ul li','click',function(){

            var target = $(this);
            var link = target.attr('data-link') ;
            var id = target.attr('data-id') ;

            //ҵ�����
            self.commonWorkCounter(id);

            window.location = link + '#index';

        });

        $('.disableScroll').on('touchmove',function(){
            return false;
        });
    }
};
