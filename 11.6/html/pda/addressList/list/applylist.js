(function(gmu, $) {
    /**
     * ?��?????????????????????
     *
     * @param {dom | zepto | selector} [el] ?????????????????
     * @param {Object} [options] ???????????????????[Options](#GMU:List:options)
     * @grammar $( el ).list( options ) => zepto
     * @grammar new gmu.List( el, options ) => instance
     */

    var i = 0;
    gmu.define(
        "Alist",
        {
            options: {
                content: null,

                url: "",

                enableExtendOptions: false,

                baseParam: null,

                param: null,

                dataFix: null,

                dataType: "json",

                enablePullUp: true,

                enablePullDown: true
            },

            template: {
                item:
                    ' <div class="item" id=${q_id}>${psn_name}</div>',

                emptyTip:
                    '<div class="empty"><img class="img" src="/pda/officeProduct/applylist/img/todo_nodata_icon@3x.png"/><div class="empty-text">������ϵ��</div></div>',

                wrap:
                    '<div class="ui-refresh"><div class="ui-refresh-up"></div><ul class="data-list ui-list ui-border-tb"></ul></div>'
            },

            _init: function() {
                var me = this;
                i++;
                // ?��ul
                me.on("done.dom", function(e, $root) {
                    me.guid = i;

                    me.$list = $root.find("ul").first();

                    me.refresh = new gmu.Refresh({
                        el: me.getEl().find(".ui-refresh"),
                        load: function() {
                            if(arguments[0]=="down"){
                                return;
                            }
                            me._ajax.apply(me, arguments);
                        },
                        $upElem: $root.find(".ui-refresh-up"),
                        $downElem: $root.find(".ui-refresh-down")
                    });

                    me.getEl()
                        .attr("data-list-guid", i)
                        // .css('height', window.innerHeight - ($('header').height() || 0) - ($('footer').height() || 0))
                        .find(".ui-refresh-wrapper")
                        .css({"height":"100%","overflow":"scroll"});
                });

                me.getEl().on("click", "[data-cmd]", function() {
                    var action = this.getAttribute("data-cmd");
                    switch (action) {
                        case "reload":
                            me.$loading.show();
                            me._ajax("reload");
                            break;
                    }
                });
            },

            _create: function() {
                var me = this,
                    $el = me.getEl(),
                    opts = me._options,
                    content = "",
                    listContent = "",
                    isEmpty = false;

                content += me.tpl2html("wrap");

                if ($.isArray(opts.content)) {
                    listContent += me.tpl2html("item", opts.content);
                } else {
                    content += me.tpl2html("emptyTip");
                    isEmpty = true;
                }
                $el.addClass("ui-list-state-initlizing");
                $el.append(content);

                $el.find("ul")
                    .first()
                    .html(listContent);

                me.trigger(
                    "done.dom",
                    $el.addClass("ui-" + me.widgetName),
                    opts
                );

                me.checkEmpty();

                me.$loading = $("<div></div>").loading({
                    content: td_lang.pda.msg_2 || "??????..."
                });
                me._ajax("reload");
            },

            checkEmpty: function() {
                this.isEmpty = !this.$list.find("li").size();
                this.getEl()[this.isEmpty ? "addClass" : "removeClass"](
                    "ui-list-state-empty"
                );
            },

            refreshIscroll: function() {
                var me = this;
                me.refresh._options.iScroll &&
                    me.refresh._options.iScroll.refresh &&
                    me.refresh._options.iScroll.refresh();
            },

            _ajax: function(dir, type) {
                var me = this,
                    $list = this.$list,
                    opts = me._options,
                    param = null;

                if (!opts.param) {
                    param = this.param;
                } else if ($.isPlainObject(opts.param)) {
                    param = $.extend({}, opts.baseParam, opts.param);
                } else if ($.isFunction(opts.param)) {
                    param = opts.param.call(me, dir, type, this.param, function(
                        _dir
                    ) {
                        dir = _dir;
                    });
                }
                $.ajax({
                    url: opts.url,
                    data: param,
                    type: "POST",
                    dataType: opts.dataType,
                    beforeSend: function(xhr, settings) {},
                    success: function(vdata, status, xhr) {
                        if(vdata.status=="error"){
                            if(vdata.msg=="nofinddata"){
                                me.$loading.remove();
                                return
                            }else{

                            }
                            me.$loading.remove();

                        }else  {
                         function   pySegSort(arr){
                                if(arr.length == 0) return;
                                if (!String.prototype.localeCompare) return null;
                                var letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split("");
                                var zh = "�������Պ���긹��������r���ފr�߅ߒP����ϦѾ��".split("");
                                var segs = []; // �������
                                var res = {};
                                var curr;
                                var re = /[^\u4e00-\u9fa5]/;//��������
                                var pattern = new RegExp("[`\\-~!@#$^&*()=|{}':;',\\[\\].<>����/?~��@#������&*��������|{}��������������'��������12345678990]"); //�������
                  
                                letters.filter((items, i) => {
                                  curr = {
                                      initial: '', //��ĸ
                                      data: [] ,  //����
                                    };
                                  arr.map((v, index) => {
                                    // �����ַ�
                                    if (pattern.test(v.psn_name[0])) {
                                      if ((!zh[i - 1] || zh[i - 1].localeCompare(v.psn_name) <= 0) && v.psn_name.localeCompare(zh[i]) == -1) {
                                        curr.data.push(v);
                                      }
                                    }
                                    // �ж��׸����Ƿ������� 
                                    if (re.test(v.psn_name[0])) {
                                      // Ӣ�� 
                                      if (v.psn_name[0].toUpperCase() == items) {
                                        curr.data.push(v);
                                      }
                                    } else {
                                      // ����
                                      if ((!zh[i - 1] || zh[i - 1].localeCompare(v.psn_name) <= 0) && v.psn_name.localeCompare(zh[i]) == -1) {
                                        curr.data.push(v);
                                      }
                                    }
                  
                                  })
                  
                                    if ( curr.data.length) {
                                      curr.initial = letters[i]
                                      segs.push(curr);
                                      curr.data.sort((a, b) => {
                                        return a.psn_name.localeCompare(b.psn_name);
                                      });             
                                    }
                                })
                                res.segs = Array.from(new Set(segs)) //ȥ��
                                return res;
                              }
                
                            if(vdata){
                                var data=pySegSort(vdata)
                            }
                            //????????????��???success????? ????false????????success???
                            var e = gmu.Event("success", e);
                            me.$loading.remove();
                            if (false === me.trigger(e, data, status, xhr)) {
                                return false;
                            }
                            me.param = param;
                            
                            var count = 0;
                            if (data) {
                                var html = (function(data) {
                                    //???????
                                    var data = data.segs
                                        ? data.segs
                                        : []; //????sns
                                    var liArr = [];
                                    if ($.isPlainObject(data)) {
                                        liArr.push(me.tpl2html("item", data));
                                    } else {
                                        $.each(data, function(index,item) {
                                            var str='<li class="list-item-inserting"><p class="submenu" id='+item.initial+' >'+item.initial+'</p>';
                                            var length=item.data.length;
                                            for(var i=0;i<length;i++){
                                                str+=me.tpl2html("item", item.data[i]);
                                            }
                                            str+='</li>'
                                            liArr.push(str );
                                            count++;
                                        });
                                    }
                                    return liArr.join("");
                                })(data.data ? data.data : data);
                                var act = {
                                    up: "prepend",
                                    down: "append",
                                    reload: "html"
                                };
                                $list[act[dir]](html);

                                if (opts.enableExtendOptions) {
                                    var swiped = Swiped.init({
                                        query:
                                            '[data-list-guid="' +
                                            me.guid +
                                            '"] .data-list>.list-item-inserting',
                                        list: true,
                                        group: 1,
                                        left: 0,
                                        right: 80
                                    });
                                }
                                $list
                                    .find(".list-item-inserting")
                                    .removeClass("list-item-inserting");
                                count > 0 &&
                                    count < 10 &&
                                    me
                                        .getEl()
                                        .find(".ui-refresh-down")
                                        .hide();

                                dir == "reload" && (dir = "up");
                                me.refresh.afterDataLoading(dir);

                                me.checkEmpty();

                                me.refreshIscroll();
                            }
                            opts.itemclick && opts.itemclick();
                        }
                    },
                    error: function(xhr, errorType, error) {
                        //????????????��???error???
                        var e = gmu.Event("error", e);
                        if (false === me.trigger(e, xhr, errorType, error)) {
                            return false;
                        }

                        var msg = xhr.response;
                        //return;
                        if (msg.match(/nomoredata/gi)) {
                            me.refresh.afterDataLoading("down");
                            //me.refresh.disable('down', true);
                            me.getEl()
                                .find(".ui-refresh-down")
                                .hide();
                            me.pulldownDisable = true;
                        } else if (msg.match(/nonewdata/gi)) {
                            me.refresh.afterDataLoading("up");
                            //me.refresh.disable('up', true);
                            //me.refresh.enable('down');
                            try {
                                //me.refresh._options.iScroll.options.topOffset = 0;
                            } catch (e) {}
                        }
                        setTimeout(function() {
                            me.refreshIscroll();
                        }, 1);

                        me.$loading.remove();
                    },
                    complete: function(xhr, status) {
                        var e = gmu.Event("complete", e);
                        if (false === me.trigger(e, me)) {
                            return false;
                        }
                        me.getEl().removeClass("ui-list-state-initlizing");
                    }
                });
            },

            setParam: function(key, value) {
                this._options.baseParam["key"] = value;
            },

            getParam: function(key) {
                return this._options.baseParam["key"];
            },
            
            itemclick: function(e, item) {
                console.log(e, item);
            }

            /**
             * @event ready
             * @param {Event} e gmu.Event????
             * @description ????????????????
             */

            /**
             * @event itemclick
             * @param {Event} e gmu.Event????
             * @param {Element} item ???????????
             * @description ????????????????
             */

            /**
             * @event destroy
             * @param {Event} e gmu.Event????
             * @description ??????????????
             */
        },
        gmu.Base
    );
})(gmu, gmu.$);
