/*
* name: ��ҳ�ˣ�����sdk���
* dependencies: zepto,gmu,frozen
* author: lijun
* description: Ϊ��ҳ�˺�΢�Ŷ��ṩͳһ�Ĺ���ģ��ӿڣ�����header��������Ⱦ�����˵���
* */

//���������ռ�
tMobileSDK = window.tMobileSDK || {};

//Ĭ�����ò���
tMobileSDK.configs = {
    headerType: 'wx-footer',
    hasBuildFunc: false
};

//��ȡ����ͼ��
tMobileSDK.getFileTypeIcon = function(file_type){
	var prefix = '/static/images/file_type/v2019/form.';
	var suffix = '.icon@3x.png';
	var iconHash = {
		"apk": "apk",
		"audio": "audio",
		"bmp": "bmp",
		"cad": "cad",
		"docx": "word",
		"doc": "word",
		"excel": "excel",
		"file": "file",
		"gz": "zip",
		"gif": "gif",
		"iso": "iso",
		"jpg": "jpg",
		"jpeg": "jpg",
		"log": "log",
		"pdf": "pdf",
		"pptx": "pptx",
		"psd": "psd",
		"sql": "sql",
		"txt": "txt",
		"tgz": "zip",
		"tar": "zip",
		"video": "video",
		"word": "word",
		"xls": "excel",
        "xlsx": "excel",
        "xlt": "excel",
		"zip": "zip",
		"z": "zip",

	}
	if(iconHash[file_type]){
		return prefix + iconHash[file_type] + suffix
	}else{
		return prefix + 'unknow' + suffix
	}
}

tMobileSDK.showUserDetails = function(opts) {}

//helper ����
tMobileSDK.util = {
    eval: function(expression){
        try {
            eval(expression);
        } catch(error) {
            console.error(error.message);
        }
    }
};

tMobileSDK.closeWebview = function() {
    window.history.back()
}

//����header��������
tMobileSDK.buildHeader = function(headerData,options){
    options = options || {};
    options.type = options.type ? options.type : this.configs.headerType;

    //�Ƴ���һ�ι�����header
    if($('.sdk-' + options.type).length > 0){
        $('.sdk-' + options.type).remove();
        $('body .ui-actionsheet').remove();
        tMobileSDK.configs.hasBuildFunc = false;
    }

    //����δ�������ݺʹ�������Ϊ�ն�������
    if(!headerData){
        return false;
    } else {
        var isEmpty = true;
        for(var prop in headerData){
            isEmpty = false;
            break;
        }
        if(isEmpty){
            return false;
        }
    }

    //���ò���
    var opts = {};
    var wxhtml = '';
    opts.container = options.targetEl || 'body';
    if((headerData.l != undefined) && (headerData.l.event != undefined)) {
        opts.leftBtns = new Array('<i class="ui-icon-return" data-op="' + headerData.l.event + '"></i>');
    }
    //ʵ���������ʱ����˫������ƴ���ַ����������õ����ţ���Ϊ��������data-op�а���˫����
    opts.rightBtns = $.isPlainObject(headerData.r) ? new Array("<button class='ui-btn " + headerData.r.class + "' data-op='" + headerData.r.event + "'>" + headerData.r.title + "</button>") : [];
    //���headerData.c������
    if($.isArray(headerData.c)){
        opts.title = '';
        $.each(headerData.c,function(index,item){
            opts.title += '<button class="ui-btn ' + (item.active ? 'active': '') + '" data-op="' + item.event + '">' + item.title + '</button>';
            wxhtml += '<li class="ui-border-r" data-op="' + item.event + '">' + item.title + '</li>';
        });
    } else {
        opts.title = headerData.c.title || '';
        document.title = opts.title;
    }

    if($.isPlainObject(headerData.r)){
        wxhtml += '<li class="ui-border-r" data-op=\'' + headerData.r.event + '\'>' + headerData.r.title + '</li>';
    }
    wxhtml = wxhtml ? '<ul class="ui-tiled ui-border-t">'+wxhtml : '';

    //ʵ����
    var _id = options.id || "J_toolbar", $el;//get the container id
    if(options.type === "header"){//header
        $el = $('<header class="sdk-header ui-header ui-header-stable" id="'+ _id +'"></header>').prependTo(opts.container).toolbar(opts);
    } else if(options.type === "footer"){//footer
        $el = $('<footer class="sdk-footer ui-footer ui-footer-stable" id="'+ _id +'"></footer>').prependTo(opts.container).toolbar(opts);
    } else if(options.type === 'wx-footer' && wxhtml) {
        $el = $('<footer class="sdk-wx-footer ui-footer ui-footer-btn" id="'+ _id +'"></footer>').prependTo(opts.container).html(wxhtml);
        $el.find('li').last().removeClass('ui-border-r').attr('data-op-dropdown', 1);
    }



    //���д���������
    //�����˰�ť
    $('#'+ _id +' .ui-icon-return').on('click',function(e){
        var cb = $(this).attr('data-op');
        if(cb){
            tMobileSDK.util.eval(cb);
        }
    });
    //�Ҳ������ť
    $('#'+ _id +' .ui-toolbar-right .ui-btn').on('click',function(e){
        var cb = $(this).attr('data-op');
        if(cb){
            tMobileSDK.util.eval(cb);
        }
    });
    //�м�Ĳ�����ť
    $('#'+ _id +' .ui-toolbar-title .ui-btn').on('click',function(e){
        $('#'+ _id +' .ui-toolbar-title .ui-btn').removeClass('active');
        $(this).addClass('active');
        var cb = $(this).attr('data-op');
        if(cb){
            tMobileSDK.util.eval(cb);
            document.title = $(this).text();
        }
    });
    //for wx
    $('#'+ _id +'.sdk-wx-footer [data-op]').on('click',function(e){
        var cb = $(this).attr('data-op');
        if(cb){
            tMobileSDK.util.eval(cb);
            document.title = $(this).text();
        }
    });
};



//��Ⱦ�����˵�
tMobileSDK.buildFunc = function(funcData,opts){//���ݴ�behav�д�������options�������ò���

    if(tMobileSDK.configs.hasBuildFunc){
        return false;
    }

    var type = opts ? opts.type : this.configs.headerType;


    //�������ҳ�˹���
    if(type === "header"){

        var content = [];
        var callbacks = {};
        //�������ݣ���ȡ���õ�content
        for(var i=0,len=funcData.length; i<len; i++){

            content.push(funcData[i].title);
            callbacks[funcData[i].title] = funcData[i].event;//��ȡ�ص�
            //��������һ����������治�ü�divider
            if(i < funcData.length-1){
                content.push('divider');
            }
        }

        //���ò���
        configs = {
            content: content,
            horizontal: false,
            align: 'right',
            placement: 'bottom',
            offset: {top: -5}
        };



        //��Ⱦ�����˵���Ϊע��item����¼�
        $('.sdk-header .ui-toolbar-right').dropmenu(configs).on('itemclick',function(e,li){
            var cb = $(li).text();
            e.preventDefault();
            if(cb){
                tMobileSDK.util.eval(callbacks[cb]);
            }
            $('.sdk-header .ui-toolbar-right').trigger('click');
            $('.op-menu-mask').hide();
        });

        //��������
        $('<div class="op-menu-mask"></div>').insertAfter('.sdk-header .ui-dropmenu').on('click',function(){
            $('.sdk-header .ui-toolbar-right').trigger('click');
            $(this).hide();
        });
        $('.sdk-header .ui-toolbar-right button').on('click',function(){
            $('.op-menu-mask').show();
        })



        tMobileSDK.configs.hasBuildFunc = true;
    }


    //�����΢�Ŷ˹���
    if(type == "footer" || type == 'wx-footer'){

        //����ģ��
        var tmpl = '<div class="ui-actionsheet">' +
                        '<div class="ui-actionsheet-cnt">' +
                            '<% for(var i=0; i<edit_opts.length; i++) { %>' +
                                '<button class="op-btns" data-op="<%= edit_opts[i].event %>"><%= edit_opts[i].title %></button>' +
                            '<% } %>' +
                            '<button class="hide-op-menu">'+td_lang.pda.cancel || 'ȡ��'+'</button>' +
                        '</div>' +
                    '</div>';

        //��ȾDOM
        var dest = $.tpl(tmpl,{edit_opts: funcData});
        $('body').append(dest);
        $('.ui-actionsheet').addClass('show');

        //���¼�
        $('.hide-op-menu').on('click',function(){
            $('.ui-actionsheet').removeClass('show');
        });
        $('.ui-actionsheet').on('click',function(){
            $('.ui-actionsheet').removeClass('show');
        });
        $('.sdk-footer .ui-toolbar-right button,.sdk-wx-footer [data-op-dropdown="1"]').on('click',function(){
            $('.ui-actionsheet').addClass('show');
        })
        $('.ui-actionsheet .op-btns').on('click',function(e){
            var cb = $(this).attr('data-op');
            if(cb){
                tMobileSDK.util.eval(cb);
            }
            $('.ui-actionsheet').removeClass('show');

        })



        tMobileSDK.configs.hasBuildFunc = true;
    }
};

//infomation collection function
tMobileSDK.collectInfo = function(url){
    if(!url){
        return;
    }
    var params = {};

    if(navigator.userAgent){
        params.ua = navigator.userAgent;
    };
    if(window.screen){
        params.sw = window.screen.width;
        params.sh = window.screen.height;
    };
    if(window.location){
        params.host = window.location.host;
        params.url = window.location.href;
    }
    params.platform = this.platForm || '';


    try{
        var timing = performance.timing.toJSON();
        var result = {};
        for(var key in timing){
            if(timing[key]){
                result[key] = timing[key];
            }
        }
        params.timing = JSON.stringify(result);
    }catch(e){}


    var args = '';
    for(var i in params) {
        if(args != '') {
            args += '&';
        }
        args += i + '=' + encodeURIComponent(params[i]);
    }

    var img = new Image(1,1);
    img.src = url + '?' + args;
};

/*
ѡ�� opts { users:[], onSuccess: function(){} }
*/
tMobileSDK.selectUser = function(opts) {
    if(window.userselect != undefined || window.userselect != null){
        userselect = null;
    }
    window.userselect = {
        params: {
            searchUserUrl: '/mobile/inc/get_contactlist.php',
            $el: null,
            tpl: {
                'container': '<section class="ui-container userselect-ui-container deptselect-ui-container" style="z-index:10001"> <footer class="ui-footer ui-footer-btn"> <div class="ui-footer ui-footer-stable ui-btn-group ui-border-t"> <button node-type="confirm" class="ui-btn-lg ui-btn-primary">ȷ��</button> <button node-type="cancel" class="ui-btn-lg">ȡ��</button> </div> </footer> <section class="ui-container"> <div class="ui-searchbar-wrap ui-border-b focus"> <div class="ui-searchbar ui-border-radius"> <i class="ui-icon-search"></i> <div class="ui-searchbar-text">����</div> <div class="ui-searchbar-input"> <input value="" type="text" placeholder="����" autocapitalize="off"> </div></div> <button type="button" class="ui-btn ui-btn-s search-confirm">����</button><button type="button" class="ui-btn ui-btn-s search-close">ȡ��</button></div><ul id="ul-userslist" class="ui-list ui-border-tb" style="position:fixed;top:45px;bottom:0px;overflow:auto;touch-action:pan-y;"></ul><ul id="ul-searchlist" class="ui-list ui-border-tb" style="display:none;z-index:999;position: fixed;top: 45px;background: #fff;bottom: 0;overflow:auto;touch-action:pan-y;"></ul> </section></section>',
                'user': '<li class="ui-border-t" data-uid="<%=uid%>" data-user-name="<%user_name%>"><label class="ui-checkbox"><input type="checkbox"><p><%=user_name%></p></label></li>'
            },
            allusers: []
        },
        init: function(options){
            var self = this;
            this.config = {
                users: [],
                wrapper: 'body',//��װ����
                confirmCallback: function(){},
                cancelCallback: function(){}
            };
            this.config = $.extend(true,{}, this.config, options);
            this.initDom();
            this.initUsers();
            this.bindEvent();
        },
        initDom: function(){
            $(this.config.wrapper).append(gmu.$.tpl(this.params.tpl.container,{}));
            this.$el = $('.userselect-ui-container');
        },
        initUsers: function(){
            var self = this;
            var opts = {
                A:'get_ALLUSER',
                KWORD : '',
                P:P
            };
			var el = $.loading({
				content: '������...',
			});
            $.getJSON(this.params.searchUserUrl, opts, function(data){
				el.loading("hide");
				/*
                var allusers = []
				$.each(data, function(k, user){
					allusers.push({
						uid: user.uid,
						user_name: user.user_name
					})
				})
				self.params.allusers = allusers
				self.render();
				*/

				/*
				var _data = []
				var arr = ["��","��","��"];
				for(var i = 0; i < 20000; i++){
					var name = arr[Math.floor((Math.random()*arr.length))];
					_data.push({
						uid: i,
						user_name: name+i
					})
				}
				self.params.allusers = _data
				self.render();
				*/

				self.params.allusers = data;
				self.render();
           });
        },
        render: function(){
            var self = this;
            var allusers = this.params.allusers;
            var users = this.config.users;
            var html = '';
            $.each(allusers, function(k, user){
                html += '<li class="ui-border-t userselect-item" data-uid="'+user.uid+'" data-user-name="'+user.user_name+'"><label class="ui-checkbox"><input type="checkbox"><p>'+user.user_name+'</p></label></li>';
            })
            $('#ul-userslist').html(html);
            //ѡ����ѡ
            this.config.users.forEach(function(uid){
                $('[data-uid="'+ uid +'"]').find('input').prop('checked',true);
            });
        },
        renderSearch: function(keyword){
			$('#ul-searchlist').show();
			var self = this;
            var opts = {
                A:'get_SearchUser',
                KWORD : keyword,
                P:P
            };
            $.getJSON(this.params.searchUserUrl, opts, function(data){
				/*
				var data = [
					{
						uid: "0",
						user_name: '��1'
					},
					{
						uid: "1",
						user_name: '��1'
					},
					{
						uid: "2",
						user_name: '��1'
					},
					{
						uid: "3",
						user_name: '��2'
					},
					{
						uid: "4",
						user_name: '��2'
					},
					{
						uid: "5",
						user_name: '��2'
					}
				];
				*/
				var html = '';
				$.each(data, function(k, user){
					html += '<li class="ui-border-t userselect-item" data-uid="'+user.uid+'" data-user-name="'+user.user_name+'"><label class="ui-checkbox"><input type="checkbox"><p>'+user.user_name+'</p></label></li>';
				})
				$('#ul-searchlist').html(html);
				self.config.users.forEach(function(uid){
					$('[data-uid="'+ uid +'"]').find('input').prop('checked',true);
				});
			})
			/*
            this.$el.find('li').removeClass('hide');
            var hides = $.map(this.params.allusers,function(user){
                if(user.user_name.indexOf(keyword) == -1){
                    return user.uid;
                }
            });
            $.each(hides, function(k, uid){
                $('[data-uid="'+uid+'"]').addClass('hide');
            })
			*/
        },
		cancelSearch: function(){
			$('#ul-searchlist').hide().html('');
			this.config.users.forEach(function(uid){
                $('[data-uid="'+ uid +'"]').find('input').prop('checked',true);
            });
		},
        bindEvent: function(){
            var self = this;
            this.$el.delegate('li.userselect-item','tap', function(){
                var uid = $(this).attr('data-uid');
                var index = self.config.users.indexOf(uid)
                if(index != -1){
                    self.config.users.splice($.inArray(uid,self.config.users),1);
                }else{
                    self.config.users.push(uid);
                }
            })
            this.$el.delegate('[node-type="confirm"]','touchstart', function(){
                var ret = [];
                // console.log(self.params.allusers,self.config.users)
				$.each(self.config.users, function(i, user1){
					$.each(self.params.allusers, function(k, user){
                        if(user.uid == user1){
                            ret.push(
                                {
                                    'uid': user.uid,
                                    'userName': user.user_name
                                }
                            );
                        }
                    })
                })
                self.$el.remove()
                typeof self.config.confirmCallback == 'function' && self.config.confirmCallback(ret);
                return false
            })
            this.$el.delegate('[node-type="cancel"]','touchstart', function(){
                self.$el.remove();
                typeof self.config.cancelCallback == 'function' && self.config.cancelCallback();
                return false
            })
            this.$el.delegate('.search-confirm','touchstart', function(){
                var keyword = self.$el.find('.ui-searchbar-input input').val();
                self.renderSearch(keyword);
            })
            this.$el.delegate('.search-close','touchstart', function(){
                self.$el.find('.ui-searchbar-input input').val('');
                self.cancelSearch();
            })
        }
    }
    userselect.init({
        users: opts.users,
        confirmCallback: function(result){
            typeof opts.onSuccess == "function" && opts.onSuccess(result);
        }
    });
}

/*
ѡ���� opts { depts:[], onSuccess: function(){} }
*/
tMobileSDK.selectDept = function(opts) {
    if(window.deptselect != undefined || window.deptselect != null){
        deptselect = null;
    }
    window.deptselect = {
        params: {
            searchDeptUrl: '/mobile/inc/get_contactlist.php',
            $el: null,
            tpl: {
                'container': '<section class="ui-container userselect-ui-container deptselect-ui-container"> <footer class="ui-footer ui-footer-btn"> <div class="ui-footer ui-footer-stable ui-btn-group ui-border-t"> <button node-type="confirm" class="ui-btn-lg ui-btn-primary">ȷ��</button> <button node-type="cancel" class="ui-btn-lg">ȡ��</button> </div> </footer> <section class="ui-container"> <div class="ui-searchbar-wrap ui-border-b focus"> <div class="ui-searchbar ui-border-radius"> <i class="ui-icon-search"></i> <div class="ui-searchbar-text">��������</div> <div class="ui-searchbar-input"> <input value="" type="text" placeholder="��������" autocapitalize="off"> </div></div> <button type="button" class="ui-btn ui-btn-s search-confirm">����</button><button type="button" class="ui-btn ui-btn-s search-close">ȡ��</button></div><ul class="ui-list ui-border-tb"></ul> </section></section>',
                'dept': '<li class="ui-border-t" data-dept-id="<%=dept_id%>" data-dept-name="<%=dept_name%>"><label class="ui-checkbox"><input type="checkbox"><p><%=dept_name%></p></label></li>'
            },
            alldepts: []
        },
        init: function(options){
            var self = this;
            this.config = {
                depts: [],
                wrapper: 'body',//��װ����
                confirmCallback: function(){},
                cancelCallback: function(){}
            };
            this.config = $.extend(true,{}, this.config, options);
            this.initDom();
            this.initDepts();
            this.bindEvent();
        },
        initDom: function(){
            $(this.config.wrapper).append(gmu.$.tpl(this.params.tpl.container,{}));
            this.$el = $('.deptselect-ui-container');
        },
        initDepts: function(){
            var self = this;
            var opts = {
                A:'get_Dept',
                P : P,
                KWORD : ''
            };
            $.getJSON(this.params.searchDeptUrl, opts, function(data){
                self.params.alldepts = data;
                self.render();
            });
        },
        render: function(){
            //�������в���
            var self = this;
            var alldepts = this.params.alldepts;
            var depts = this.config.depts;
            var html = '';
            $.each(alldepts, function(k, dept){
                var dest = gmu.$.tpl(self.params.tpl.dept,dept);
                html += dest;
            })
            this.$el.find('.ui-list').html(html);
            //ѡ����ѡ
            this.config.depts.forEach(function(dept_id){
                $('[data-dept-id="'+ dept_id +'"]').find('input').prop('checked',true);
            });
        },
        renderSearch: function(keyword){
            this.$el.find('li').removeClass('hide');
            var hides = $.map(this.params.alldepts,function(dept){
                if(dept.dept_name.indexOf(keyword) == -1){
                    return dept.dept_id;
                }
            });
            $.each(hides, function(k, dept_id){
                $('[data-dept-id="'+dept_id+'"]').addClass('hide');
            })
        },
        bindEvent: function(){
            var self = this;
            this.$el.delegate('input[type="checkbox"]','change', function(){
                var dept_id = $(this).parents('li').attr('data-dept-id');
                if($(this).prop('checked')){
                    self.config.depts.push(dept_id);
                }else{
                    self.config.depts.splice($.inArray(dept_id,self.config.depts),1);
                }
            })
            this.$el.delegate('[node-type="confirm"]','tap', function(e){
                if(e && e.stopPropagation){
                    //W3Cȡ��ð���¼�
                    e.stopPropagation();
                }else{
                    //IEȡ��ð���¼�
                    window.event.cancelBubble = true;
                }
                var ret = [];
				$.each(self.config.depts, function(i, dept1){
					$.each(self.params.alldepts, function(k, dept){
                        if(dept.dept_id == dept1){
                            ret.push(
                                {
                                    'deptId': dept.dept_id,
                                    'deptName': dept.dept_name
                                }
                            );
                        }
                    })
                })
                self.$el.remove()
                typeof self.config.confirmCallback == 'function' && self.config.confirmCallback(ret);

            })
            this.$el.delegate('[node-type="cancel"]','tap', function(e){
                if(e && e.stopPropagation){
                    //W3Cȡ��ð���¼�
                    e.stopPropagation();
                    }else{
                    //IEȡ��ð���¼�
                    window.event.cancelBubble = true;
                    }
                self.$el.remove();
                typeof self.config.cancelCallback == 'function' && self.config.cancelCallback();
            })
            this.$el.delegate('.search-confirm','tap', function(e){
                if(e && e.stopPropagation){
                    //W3Cȡ��ð���¼�
                    e.stopPropagation();
                    }else{
                    //IEȡ��ð���¼�
                    window.event.cancelBubble = true;
                    }
                var keyword = self.$el.find('.ui-searchbar-input input').val();
                self.renderSearch(keyword);
            })
            this.$el.delegate('.search-close','tap', function(){
                self.$el.find('.ui-searchbar-input input').val('');
                var keyword = '';
                self.renderSearch(keyword);
            })

        }
    }
    deptselect.init({
        depts: opts.depts,
        confirmCallback: function(result){
            typeof opts.onSuccess == "function" && opts.onSuccess(result);
        }
    });
}

tMobileSDK.module2icon = function(module){
    var host = location.origin;
    var url = host + "/static/images/mobile_app/{module}.png".replace(/{module}/i, module);
    return url;
}

tMobileSDK.ding = function(){};
tMobileSDK.openUrl = function(opts) {}
tMobileSDK.dingBtn = function(){};
tMobileSDK.setLeft = function(){};
