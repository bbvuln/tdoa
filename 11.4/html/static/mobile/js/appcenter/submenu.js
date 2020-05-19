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
		try{
			if(typeof v === "object") {
				localStorage.setItem(k,JSON.stringify(v));
			} else {
				localStorage.setItem(k,v);
			}
		} catch(e) {
			return null;
		}
	},
	clear: function(k){
		try{
			localStorage.removeItem(k);
		} catch(e) {
			return null;
		}
	},
	clearAll: function(){
        for(var prop in localStorage){
			try{
				localStorage.removeItem(prop);
				} catch(e) {
				return null;
			}
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
            window.location = '/pda/apps/list.php?appId=' + tdAppId + '&atype=' + data_op + '#index';
        });

        // // ��ȡ������Ŀ
        // $.get('/pda/apps/get_undo_count.php', { kind: tdAppId }, function(count) {
        //     var tdAppUndo = count
        //     // set undo count
        //     if( tdAppUndo <= 0 ) {
        //         //$('.ui-badge-cornernum').hide()
        //     } else if( tdAppUndo > 99 ) {
        //         $('.ui-badge-cornernum').text('99+')
        //         $('.ui-badge-cornernum').show()
        //     } else {
        //         $('.ui-badge-cornernum').text(tdAppUndo)
        //         $('.ui-badge-cornernum').show()
        //     }
        // })

    }
};


//@����Ŀ¼
tdApp.category = {
    appid: '',
    allworkkey: 'td_app_list_of_all_data',//ȫ��������localStorage�еļ���
    commonworkkey: 'td_app_list_of_common_data',//���ù�������
    category_info: {},//��̨���Ĺ���������Ϣ
    td_app_list_of_all_data:[],//ȫ������
    td_app_list_of_common_data:[],//���ù���
    lastestMenu:'',
    submenuId:'',
    init: function(){
        this.appid = tdApp.appid;
        this.submenuId = this.getQueryVariable('submenuId')||'all'
        this.fetchAllDataAndRender(tdApp.appid);
        this.fetchCategoryInfo(tdApp.appid);
        this.renderWorklistBeforeSendRequest();
        if(!this.checkStickySupported()){
            this.simulateSticky();
        }
        if(this.submenuId!='all'){
          this.Historyrender(tdApp.appid)//��ʷ��¼��Ⱦ  by whf 2019-08-15
        }
        this.events();
        tdApp.debug && alert('category��ʼ�����');
    },
    Historyrender:function(appid){
      var self = this;
      $.get('/general/appbuilder/web/appcenter/appdata/form', {appId: appid,submenuId:this.submenuId}, function(response) {
          if(response.status == 'ok'){
            self.renderWorklist(response.data);
              if(self.submenuId){
                if(self.submenuId){
                  self.category_info.forEach(function(item, index) {
                    if(item.id === self.submenuId) {
                      self.setCategoryName(item.name);
                    }
                  })
                }
              }
              loadingTip.loading("hide")
          }else{
              alert(response.message)
              loadingTip.loading("hide")
          }
      },"json")
    },
    initKey: function(token){
        this.allworkkey = 'td_app_list_of_all_data_' + (token ? token : '');
        this.commonworkkey = 'td_app_list_of_common_data_' + (token ? token : '');
    },
    getQueryVariable:function(variable)
    {
           var query = window.location.search.substring(1);
           var vars = query.split("&");
           for (var i=0;i<vars.length;i++) {
                   var pair = vars[i].split("=");
                   if(pair[0] == variable){return pair[1];}
           }
           return(false);
    },
    getAllWork: function(){//ȡȫ������
        return this.td_app_list_of_all_data || tdApp.mockData;
    },

    getCommonWork: function(){
        var counter = this.td_app_list_of_common_data || {};
        var _ids = Object.keys(counter);
        var allwork_data = this.td_app_list_of_all_data;
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
        $.get('/general/appbuilder/web/appcenter/appdata/form', {appId: appid,submenuId:'all'}, function(response) {
            if(response.status == 'ok'){
                // storage.set(self.allworkkey, response.data)
                self.td_app_list_of_all_data = response.data
                if(self.submenuId=='all'){
                    self.renderWorklistAfterSendRequest()
                }
            }else{
                alert(response.message)
            }
        },"json")
    },

    // ��ȡ������Ϣ
    fetchCategoryInfo: function(appid) {
        var self = this
        $.get('/general/appbuilder/web/appcenter/appdata/submenu', {appId: appid}, function(response) {
            if(response.status == 'ok'){
                self.category_info = response.data
                loadingTip.loading("hide")
            }else{
                alert(response.message)
                loadingTip.loading("hide")
            }
        },"json")
    },

    // ��localStorage��Ⱦ����
    renderWorklistBeforeSendRequest: function(){
        //��ȡ��һ��ѡ��ķ���Ŀ¼��
        var lastestMenu = this.lastestMenu || 'all';
        if(lastestMenu === 'all'){
            this.renderWorklist(this.getAllWork());
            this.setCategoryName("ȫ����");
        } else if(lastestMenu === 'common'){
            this.setCategoryName("����ҵ��");
            this.renderWorklist(this.getCommonWork());
        }
    },

    //
    renderWorklistAfterSendRequest: function(){
        //��ȡ��һ��ѡ��ķ���Ŀ¼��
        var lastestMenu = this.lastestMenu || 'all';
        if(lastestMenu === 'all'){
            this.renderWorklist(this.getAllWork());
            this.setCategoryName("ȫ����");
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
        var self = this;
        var data = category_info.slice();
        data[1].count = Object.keys(self.td_app_list_of_common_data || []).length;

        //��Ⱦ�û��Զ������
        var _data = { list: data };
        var tmpl = $('#first-menu-tmpl').html();
        var _content = $.tpl(tmpl,_data);
        $('.allflow-menu-left ul').html(_content);

    },

//    renderRightMenu: function(category_id){
//        var data = this.category_info[category_id].list_of_subcategory;
//        //��Ⱦ
//        var _data = { list: data };
//        var tmpl = $('#second-menu-tmpl').html();
//        var content = $.tpl(tmpl,_data);
//        $('.allflow-menu-right ul').html(content);
//    },

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
        var counter = this.td_app_list_of_common_data || {};
        //����
        if(!counter[id]){//��������
            counter[id] = 0;
        }
        counter[id]++;
        //�洢
        this.td_app_list_of_common_data = counter
        // storage.set(this.commonworkkey,counter);
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
            self.submenuId = id
            if(id === 'all'){
                self.hide();
                var all_data = self.getAllWork();
                try{
                    self.renderWorklist(all_data);
                } catch(e){
                    alert(e.message);
                }
                //�������鿴�Ĳ˵���
                self.lastestMenu = 'all'
                // storage.set('lastestMenu','all');
                self.setCategoryName($target.find('h4 span').text());
                //��ԭ�Ҳ����
                //self.recoverRightMenu();
            } else if(id === 'common'){
                self.hide();
                var common_data = self.getCommonWork();
                try{
                    self.renderWorklist(common_data);
                } catch(e){
                    alert(e.message);
                }
                //�������鿴�Ĳ˵���
                self.lastestMenu = 'common'
                // storage.set('lastestMenu','common');
                self.setCategoryName($target.find('h4 span').text());
                //��ԭ�Ҳ����
                //self.recoverRightMenu();
            } else {
                //ֻҪ���ǳ��ã�������Ϊȫ��
                // storage.set('lastestMenu','all');
                self.lastestMenu = 'all'
                // since category_info is an array, so we need to reference the rightMenu with the index
                var idIndex = 0;
                self.category_info.forEach(function(item, index) {
                  if(item.id === id) {
                    idIndex = index
                  }
                })
                //self.renderRightMenu(idIndex);
                $.get('/general/appbuilder/web/appcenter/appdata/form',{appId:self.appid,submenuId:id},function(response){
                    var response = JSON.parse(response);
                    if(response.status == 'ok'){
                        if(response.data.length > 0){
                            self.hide();
                            self.setCategoryName($.trim($target.find('h4').text().replace(/^ȫ��/,"")));
                            self.renderWorklist(response.data);
                        }else{
                            tMobileSDK.alert("��Ŀ¼��û��ҵ��");
                            return false;
                        }
                    } else {
                        tMobileSDK.alert(response.message);
                    }
                })
            }


        });

        //�����˵�����¼�
//        $('.allflow-menu-right').delegate('li','click',function(){
//            var $target = $(this);
//            var id = $target.attr('data-id');
//            $.get('/pda/apps/get_rep.php',{kind:id},function(data){
//                var data = JSON.parse(data);
//                if(data !== null){
//                    self.hide();
//                    self.setCategoryName($target.find('h4').text().replace(/^ȫ��/,""));
//                    self.renderWorklist(data);
//                } else {
//                    tMobileSDK.alert("��Ŀ¼��û��ҵ��");
//                    return false;
//                }
//            })
//        });

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
            var href_index=link.lastIndexOf("\#");
            var _href = link.substring(0,href_index);
            var _hash = link.substring(href_index+1,link.length);
            window.location = _href+'&isview=1&submenuId='+self.submenuId+'#'+_hash;

        });

        $('.disableScroll').on('touchmove',function(){
            return false;
        });
    }
};
