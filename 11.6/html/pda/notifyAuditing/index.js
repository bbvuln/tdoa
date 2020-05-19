$(document).ready(function() {
    tMobileSDK.ready(function() {
        window.backOpen = function(){
            tMobileSDK.closeWebview();
        }
        var data = {
            l: {
                class: "",
                event: "backOpen();",
                title: ""
            },
            c: {
                class: "",
                title: "公告通知审批"
            },
            r: {
                show: false
            }
        };
        tMobileSDK.buildHeader(data);
        var createEmpty = function(text) {
            text ? null : (text = "暂无数据");
            return (
                '<div class="empty"><img class="img" src="/pda/officeProduct/applylist/img/todo_nodata_icon@3x.png"/><div class="empty-text">' +
                text +
                "</div></div>"
            );
        };
        // var loadingStr = createEmpty("loading");
        var back = function() {
            history.back();
        };
        window.back = back;
        var emptyStr = createEmpty();
        (function() {
            var HomeTabs = function(el, opts) {
                this.init(el, opts);
            };
            HomeTabs.prototype = {
                init: function(el, opts) {
                    // var defaultIndex = 0;
                    var data = opts.data ? opts.data : [];
                    var values = [];
                    var tabsNodes = "";
                    for (var i = 0; i < data.length; i++) {
                        var value = data[i].value;
                        var text =
                            '<div class="text">' + data[i].text + "</div>";
                        var liNode = "";
                        if (i === defaultIndex) {
                            liNode = '<li class="tab active">' + text + "</li>";
                        } else {
                            liNode = '<li class="tab">' + text + "</li>";
                        }
                        values.push(value);
                        tabsNodes += liNode;
                    }
                    tabsNodes = '<ul class="home-tabs">' + tabsNodes + "</ul>";
                    el.append(tabsNodes);
                    this.bindEvent(el, opts, values);
                },
                bindEvent: function(el, opts, values) {
                    var clickTab = opts.clickTab
                        ? opts.clickTab
                        : function() {};
                    el.children(".home-tabs").tap(function(e) {
                        var target = e.target;
                        if (e.target.className === "text") {
                            target = $(target).parent();
                        }
                        if (target.className !== "home-tabs") {
                            $(target)
                                .addClass("active")
                                .siblings()
                                .removeClass("active");
                            var index = $(target).index();
                            clickTab(values[index]);
                        }
                    });
                }
            };
            window.HomeTabs = HomeTabs;
        })();
        function throttle(fn, delay) {
            var timer = null;
            return function() {
                var context = this,
                    args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        }
        function trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        var dataMapType = {
            unapproval: {
                type: "0",
                text: "待审批",
                value: "unapproval"
            },
            approval: {
                type: "1",
                text: "已审批",
                value: "approval"
            }
        };
        var getQueryString = function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
			var r = window.location.search.substr(1).match(reg); 
			if (r != null) return decodeURI(decodeURI(r[2])); return null;
		};
        var current = "unapproval";
        var defaultIndex = 0;
        if(getQueryString('type')=='approval'){
            current = 'approval';
            defaultIndex = 1;
        }

        var keyword = "";
        var pageNo = 1;
        var pageSize = 10;
        var arr = ["unapproval", "approval"];
        var data = [];
        for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            data.push(dataMapType[item]);
        }
        var el = $(".tabs-wrap");

        new HomeTabs(el, {
            data: data,
            clickTab: function(value) {
                current = value;
                pageNo = 1;
                fetchApplylist();
            }
        });

        function fetchApplylist() {
            var list = $(".apply-list");
            list.empty();
            new gmu.Alist({
                el: list,
                template: {
                    item: $("#works-list-tmpl").html()
                },
                enablePullUp: false,
                enablePullDown: false,
                url:
                    "/pda/notifyAuditing/data.php",
                baseParam: {
                    type: dataMapType[current].type,
                    pageSize: pageSize,
                    pageNo: pageNo,
					ATYPE:'refreshList'
                },
                itemclick: function() {
                    $(".notify-auditing-list .ui-list").on(
                        "tap",
                        ".apply-list-item",
                        function(e) {
                            var notify_id = $(e.currentTarget).attr(
                                "data-notify_id"
                            );
							var res = $(e.currentTarget).attr(
                                "data-isapply"
                            );
							var url = res!=''?'/pda/notifyAuditing/details/index.php?id=':'/pda/notifyAuditing/applyDetails/index.php?id='
                            location.href =
                                url+
                                notify_id;
                        }
                    );
                },
                dataFix: function(data) {
                    var arr = [];
					
                    for (var i = 0; i < data.length; i++) {
                        var item = data[i];
						// if(item.subject.length>12){
						// 	var slength = item.subject.substring(0,12);
						// 	item.subject = slength + '...'
						// }
                        arr.push(item);
                    }
                    return arr;
                },
                param: function(dir, type, oldParam, changeDir) {
                    var data = {};
                    switch (dir) {
                        case "up":
                            pageNo = 1;
                            data.pageNo = pageNo;
                            changeDir("reload");
                            break;
                        case "down":
                            pageNo = pageNo + 1;
                            data.pageNo = pageNo;
                            break;
                        case "reload":
                            break;
                    }
                    return $.extend({}, this._options.baseParam, data);
                }
            });
        }
        fetchApplylist();
        var throttleFetchApplylist = throttle(fetchApplylist, 300);
    });
});
