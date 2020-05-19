define('tDesktop/tDesktop.Search',function(require,exports,module) {
    var $ = window.jQuery;
    require('backbone');
    require('/static/js/bootstrap/paginator/bootstrap.paginator.min.js');
	
    //定义搜索模块
    var searchModule = {
        $el: $('.search-container'), //取得搜索的外部容器
        paginators: {}, //分页器容器
        templates: []//搜索结果模板容器
    };

    //-------------- 定义搜索模块的初始化函数 -----------------
    searchModule.init = function() {
        //console.log(this,"this is searchModule object.");
        this.initBind(); //初始化基础板块UI及其事件绑定
        this.initTemplates(); //初始化页面模板

        return 'search module has been initialized.';
    };

    //获取并储存页面模板
    searchModule.initTemplates = function() {
        this.templates["user"] = $('#search-template-user').template();
        this.templates["menu"] = $('#search-template-menu').template();
        this.templates["approve_center"] = $('#search-template-approve_center').template();
        this.templates["contacts"] = $('#search-template-contacts').template();
        this.templates["calendar"] = $('#search-template-calendar').template();
    };

    //设置并显示搜索返回结果条数
    searchModule.setItemsNum = function(type,num) {
        var _counter = $('.search-counter-'+type);
        _counter.text("("+num+")");
        _counter.show();
    };

    //初始化页脚(init Pagination)
    searchModule.initPagination = function(keyword,type,curPage,totalPages) {
        $('#pagination-'+type).bootstrapPaginator({
            currentPage: curPage,
            totalPages: totalPages,
            onPageChanged: function(e,oldPage,newPage){
				
                var self = this;//取得页脚的引用
                $(this).hide();//隐藏页脚，1s后再显示
                setTimeout(function() {
                    $(self).show();
                },1000);
				
                $('.search-container').animate({scrollTop: 0},300,function() {
                    $('.search-results-'+type+'>li').remove(); //清空上一页内容
                    search(keyword,type,newPage); //发送分页搜索(send pagination search request)
                });
				
            }
        });
    };


    //定义基础UI部分的事件绑定函数
    searchModule.initBind = function() {
        var self = this;
			
        //搜人关注
        $(".search-container").delegate(".user-body-follow", "click", function(){
            var $this = $(this),
                uid = $this.parents("li").attr("u_id"),
                userid = $this.parents("li").attr("userid");
            $.get("/general/person_info/concern_user/concern_function.php", {load:"concern",concern_content:"COMMUNITY,",group_id:0,user_id:userid}, function(d){
                if(d == "ok"){
                    $this.parents("li").addClass("unconcern");
                }
            });
        });
        //---------搜索框重定位至左上角，并放大搜索输入框--------
        $('#search-input').one('keydown', function(e) {
            $('.search-box').css({
                'margin-top': '15px',
                'margin-left': '0px'
            });
            //$(this).css('width','600px');
        });
		
		if(tDesktop.isTouchDevice()){
			$("#search-results-container").css({"heigth":"100%","overflow":"hidden"});
			tDesktop.EventManager.trigger('iscroller:create','search-results-container');
		}

        //---------提交搜索请求到后台，发送“关键字”和“搜索类型”，搜索类型默认是“user”型-------
        $('#search-btn').click(function(e) {
            //取得关键词和搜索类型，如果未输入关键词则直接返回
            var $value = $('#search-input').val();
            if(!$value || $value.lastIndexOf(' ') == ($value.length-1)) return false;
            var $searchType = $('#search-btn').attr('search-type');

            //重置所有搜索类型下的searched属性为空，当前类型值为searched
            $('.search-results-tabs li').attr('searched','');
            $('.' + $searchType + '-tab').attr('searched','searched');

            $('.search-results-iscroll>ul>li').remove(); //重新提交搜索后，清空上次搜索结果
			// $('.search-results-container>ul>li').remove(); //重新提交搜索后，清空上次搜索结果
            $('.search-counter').hide(); //重新提交搜索后，取消显示tab的条目数

            //重新提交搜索后，清除上次搜索页脚
            if(!$.isEmptyObject(self.paginators)) {
                _.each(self.paginators,function(item) {
                    item.destroy();
                });
                self.paginators = {};
            }

            search($value,$searchType); //提交搜索(invoke search function)
            $('.search-results-wrapper').show(); //显示结果列表
			
			
        });

        //--------------为tab绑定点击事件-------------
        $('.search-results-tabs li').click(function(){
			
            //取得关键词和搜索类型
            var $value = $('#search-input').val();
            var $searchType = $(this).attr('search-type');
            //如果当前tab为激活状态，即刻返回
            if($(this).hasClass('active')) {
                return false;
            }
            //显示相应的搜索结果返回列表（ul)
            var $tabName = $(this)[0].className.split('-')[0];
            //获取当前对应的tab类型，如果非点击“在线帮助”，则进行tab切换；如果是点击“在线帮助”则调用跳页
            if($tabName != 'helper') {
                //重新拼接ul类名，并控制tab显隐
                var $resultsTabclassName = '.search-results-' + $tabName;
                $('.search-results-container ul').hide();
                $($resultsTabclassName).show();
            } else {
                return;
            }
			
            //切换tab菜单
            $('.search-results-tabs li').removeClass('active');
            $(this).addClass('active');
			
            //为返回结果容器ul添加动画
            $('.search-results-container ul').removeClass('animated fadeInLeft');
            $('.search-results-'+$tabName).addClass('animated fadeInLeft');

            //重置“搜索”下的请求类型
            $('#search-btn').attr('search-type',$(this).attr('search-type'));

            //如果当前tab的已搜索(searched)属性为空，则提交搜送
            if($(this).attr('searched') == '' && $value != '') {
                search($value,$searchType);
                $(this).attr('searched','searched');//更改当前tab的searched属性为已搜索(searched)
            }
			// 分页组件的显隐
			if($('#pagination-'+$tabName).html()==" "){
				$('#pagination-'+$tabName+' ul').hide();
			}else{
				$('#pagination-'+$tabName+' ul').show();
			}
			tDesktop.EventManager.trigger('iscroller:refresh','search-results-container');
        });


        //---------------- 自动提交搜索请求(设置setTimeOut来减少请求数） ----------------
        var searchTimer;//搜索请求计时器
        $('#search-input').keyup(function(e) {

            searchTimer && clearTimeout(searchTimer);
            searchTimer = setTimeout(function() {
                $('#search-btn').trigger('click');
            },500);

        });

        //纠正approve_center板块返回的url地址，并赋值给<a>的href属性
        $('.search-results-approve_center').bind('ajaxDataReady',function() {
            $.each($('.search-results-approve_center>li'),function(index,item) {
                var url = $(item).attr('url');
                var newUrl = url.slice(8);//去掉general/
                $(item).find('a').attr({
                    'href': newUrl,
                    'target': '_blank'
                });
            })
        });

        //关闭搜索模态框
        this.$el.find('.search-close-btn').click(function() {
            $('body').removeClass('showSearch');
            $('#searchbar').removeClass('on');
        })

    };

    //定义弹出搜索页函数
    searchModule.open = function() {

    };

    //定义关闭搜索页函数
    searchModule.close = function() {

    };

    //--------------------------------------------------模块内部搜索函数------------------------------------------------
    function search(keyword,searchType,curPage,pageLimit) {
        var self = searchModule; //储存搜索对象的引用
        //如果搜索类型是"菜单(menu)"，则无需向服务器提交请求
        if(searchType == 'menu') {
            var count = 0, //定义搜索返回数
                menus = [];//创建一个存放返回菜单的数组

            for (var menuId in func_array) {
                var func = func_array[menuId],
                    func_id = menuId.substr(1);
                //如果一级菜单、有三级菜单的二级菜单、没有权限的菜单则跳过
                if (menuId.substr(0, 1) != 'f' || func[1].substr(0, 1) == '@'/* || (my_func_id_str.indexOf(func_id + ',') < 0 && my_func_id_str.indexOf(',' + func_id + ',') < 0)*/) {
                    continue;
                }
                //匹配 菜单名称、名称拼音首字母中的任何一个
                var title = func[0] || "",
                    abbr = func[3] || "";
                if (title.toLowerCase().indexOf(keyword) >= 0 || abbr.toLowerCase().indexOf(keyword) >= 0) {
                    count++;
                    var singleMenu = {};
                    singleMenu.menuId = func_id;
                    singleMenu.menuTitle = title;
                    singleMenu.menuUrl = func[1];
                    menus.push(singleMenu);
                }
            }

            //在页面上渲染返回的菜单
            searchRender(searchType,count,menus);

            return;
        }

        //其它类型搜索(user,approve_center,contacts,calendar)，则向服务器提交ajax请求
        //定义当前选中页和每页显示条数，默认为1和10(define the chosen page and the number of items per page, default is 1 and 10.)
        var _curPage = curPage || 1,
            _pageLimit = pageLimit || 10;
        $.ajax({
            type: "GET",
            url: "/general/person_info/search/get_search.func.php",
            data: {
                curPage: _curPage,
                pageLimit: _pageLimit,
                type: searchType,
                keyword: keyword
            },
            dataType: "json",
            success: function(data) {
                //根据返回数据(data.curPage,data.totalpage)初始化分页组件(init pagination based on the return data.)
                if(!self.paginators[searchType]) {
                    if(data.curPage>0 && data.totalpage>1) {
                        searchModule.initPagination(keyword,searchType,data.curPage,data.totalpage);
                        self.paginators[searchType] = $('#pagination-'+searchType).data('bootstrapPaginator'); //储存当前分页器
                        // console.log(self.paginators,"this is the array of paginators.");
                    }
                }
                self.$el.animate({height:'85%'},300);//展开搜索框
				
                searchRender(searchType,data.numCount,data.datalist); //根据返回数据(tata.datalist)来渲染模板
				
                if(searchType == 'approve_center')
                    $('.search-results-approve_center').trigger('ajaxDataReady');//广播ajax返回数据可供操作
            },
            error: function(error) {
                console.error('some error happened:' + error.statusText);
            }
        })
    }

    //渲染返回数据
    function searchRender(type,num,data) { 
        var self = searchModule; //储存搜索对象的引用
        self.setItemsNum(type,num);//显示搜索的返回结果数
		
        $.each(data,function(index,item) {
		//console.log(item);
            var element = $.tmpl(self.templates[type],item);
            element.insertBefore('#pagination-'+type);
        });
		// ipad滚动时添加分页的高度
		var iscrollh = $('.search-results-'+type).height();
		if($('#pagination-'+type).html().length==0){
			$('.search-results-'+type).css({"height":iscrollh});
			tDesktop.EventManager.trigger('iscroller:refresh','search-results-container');
			$('.search-results-'+type).css({"height":"auto"});
		}else{
			var	newiscrollh = iscrollh + 75;
			$('.search-results-'+type).css({"height":newiscrollh});
			tDesktop.EventManager.trigger('iscroller:refresh','search-results-container');
			$('.search-results-'+type).css({"height":"auto"});
		}
	}

    //自定义趣味log函数
    function funLog() {
        console.log("%c  ","font-size:350px; background: url(http://img3.douban.com/lpic/s10299848.jpg) no-repeat");
    }

    //提供模块的外部接口
    module.exports = searchModule;

});