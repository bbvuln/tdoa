/*
 *  TListViewManager
 *  by tl @2015-05-05
 *
 */
define('TListView', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var Fields = require('ReportFieldLoder');
    var getFieldClass = function (c) {
        return Fields[c];
    };
    var page = 1;
    window.dataselectListByTableListBack = function (doNotBack) {
        page = 1;
        $("#tableListDataselectListByTableList").html('');
        if (doNotBack != 1) {
            history.back();
        }
    }
    var TListViewManager = Base.extend({
        attrs: {
            wrapper: ''
        },
        initialize: function (config, store) {
            TListViewManager.superclass.initialize.call(this, config);
            this.$wrapper = $(this.get('wrapper'));
            this.$sum = this.$wrapper.parent('.list-wrapper').find('.list-sum');
            this.$wrapper.html("");
            this.$sum.html("");

            this.fieldmanager = config.fieldmanager;
            this.register = store || [];
            this.instances = {};
            this.lists = [];
            this.initMainBlocks(store.main);
            this.initDetailBlocks(store.detail);
        },
        getColSum: function(col){//返回指定列的合计值
            var res = this.lists[0].calcColSum(col);
            //console.log(res+"res");
            return res;
        },
        regist: function (cfg) {
            this.register.push(cfg);
        },
        factory: function (cfg, $wrapper) {
            var self = this;
            var klass = getFieldClass(cfg.fieldtype),
                field;
            if (klass) {
                cfg.listManager = this;//对每一条记录过滤每一种类型的控件过程中传入这一条记录对象
                field = new klass(cfg, $wrapper, self.fieldmanager);
            }
            return field;
        },
        initMainBlocks: function (blocks){
            var self = this;
            $.each(blocks, function (i, block) {
                var $block = self.parseBlock(block);
                self.initFields(block.item, $block);
            });
            if(self.register.flag == 0){
                self.get('wrapper').trigger('calc');
            }
            //$('.list-wrapper .read_detail').last().addClass("last");
        },
        initDetailBlocks: function (blocks){
            if(!blocks){
                return;
            }
            var self = this;
            $.each(blocks, function (i, block) {
                self.initListManager(block, self.$wrapper);
            });
        },
        initListManager: function(cfg, $wrapper){
            var self = this;
            if(!cfg){
                return;
            }
            this.lists.push(
                new ReportListFieldManager({
                    wrapper: $wrapper,
                    fieldmanager: self.fieldmanager
                }, cfg)
            );
        },
        initFields: function (fields, $block) {
            var self = this,
                register = this.register,
                instances = this.instances;
            $.each(fields, function (i, cfg) {
                try {
                    var instance = self.factory(this, $block);
                    if (instance && instance.get('id')) {
                        instances[instance.get('id')] = instance;
                    }
                } catch (error) {
                    console.log(error);
                }

            });
        },
        bindEvent: function () {
            var self = this,
                runId = this.get('runId'),
                flowId = this.get('flowId');
        },
        parseBlock: function(d){
            var tmpl = '\
<div class="reportBlock report-block-header tform clearfix">\
  <h3><%=title%></h3>\
</div>\
';
            var $block = $($.parseTpl(tmpl, d));
            this.$wrapper.append( $block );

            return $block;
        },
        createId: (function (i) {
            return function () {
                return i++;
            }
        })(0),
        save: function () {
            return this.$el.serializeArray();
        },
        appendFieldElement: function (el) {
            this.$wrapper.append(el);
        },
        destroy: function(){
            this.$el.remove();
        },
        updateFields: function(){

        },
        updateDataFromFields: function(){
            $.each(this.instances, function(i, field){
                field.updateDataFromField && field.updateDataFromField();
            });
        },
        serializeArray: function(){
            var self = this, ret = [], list = {};
            $.each(this.instances, function(i, field){
                field.getData && ret.push(field.getData());
            });
            $.each(this.lists || [], function(i, l){
                list['DATA_'+l.getId()] = (l.serializeArray());
            });
            return list;
        },
//        serializeArray: function(){
//            var self = this, ret = [], list = [];
//            //lists => [list];
//            $.each(this.lists || [], function(i, l){
//                list = l.serializeArray();
//                //list['DATA_'+l.getId()] = (l.serializeArray());
//            });
//            return list;
//        },
        serializeSumArray: function(){
            var ret = null;
            $.each(this.lists || [], function(i, l){
                if(this.sumobj){
                    ret = this.sumobj.getData();
                }
            });
            return ret;
        },
		onSubmit: function(){
			var self = this, ret = null;
            $.each(self.instances, function() {
                var field = this;
                if(typeof field.onSubmit == 'function')
                {
                    var status = field && field.onSubmit && field.onSubmit();

                    ret = ret === false ? false : status;
                }
            });
            if(ret === false){
            	if($('.div_alert_show').length > 0){
            		window.scrollTo(0,$('.div_alert_show').eq(0).offset().top-100);
            	}
            }
            return ret;
		},
        setOcrValue: function(data)
        {
			
            //RListField.parseTpl(this.cfg);

        }
    });
    var ReportListFieldManager = TListViewManager.extend({
        attrs: {
            wrapper: '',
            sumArea: '',
            savebtn: ''
        },
        initialize: function (config, store) {
            TListViewManager.superclass.initialize.call(this, config);
            this.$wrapper = $(this.get('wrapper'));
            this.$sumArea = this.$wrapper.parent('.list-wrapper').find('.list-sum');
            this.$save = $(this.get('savebtn'));
            this.register = store || [];
            this.instances = {};
            this.searchTimeout = null;
            this.$el = this.parseBlock(store);
            this.initFields(store.item, this.$el);
            //(store.op == 'do') && this.buildCreateHelper();
            this.fieldmanager = config.fieldmanager;
            //console.log("2",this.fieldmanager);
            this.bindEvent();
            this.sumobj = null;
            //store.sumArr && this.createSum();
            store.sumArr && this.createSum();
            store.sumArr && this.$el.trigger('_calcSum');
        },
        calcColSum: function(col){
            var self = this;
            var sum = 0;
            $.each(self.instances, function(k, v){
            	if(v.cfg != undefined){
            	    var cur_index = parseInt(col)-1;
            	    var instance = v.cfg.item[cur_index];
            	    if(instance.colvalue === ""){instance.colvalue = "";}
            	    if(self.validate_num(instance.colvalue)){
                        sum += parseFloat(instance.colvalue);
                    }
            	}
            });
            return sum;
        },
        getId: function(){
            return this.register.id;
        },
        bindEvent: function(){
            var self = this;
            this.$wrapper.parents('.tag-listview').on('tap', '.report-list-icon-create', function(){
                self.createItem();
            });
            this.$wrapper.parents('.tag-listview').on('tap', '.u-table-list-icon-dataset', function(){
                self.createDataSetBtn();
            });
            this.$el.bind('_calcSum', function(){
                self.calcSum();
                self.fieldmanager.trigger('calc');
            });
            if(this.register.delete_op == 1){
               var _id = self.$wrapper.parent('.list-wrapper').attr('id');
            	Swiped.init({
			        query: ('#'+_id+' .list-item'),
			        list: true,
			        right: 100
			    });
            };

            //点击数据选中状态
            $('#tableListDataselectListByTableList').on('tap','.u-list-wrapper-right',function(event) {
                var selfs =  $(this).prev('.u-list-wrapper-left').find('input').eq(0);
                selfs.prop('checked','checked')
                selfs.attr('checked','checked')
                event.stopPropagation();
                event.preventDefault();
            })

            //备选项展开、收起
            $('#tableListDataselectListByTableList').on('tap','.u-list-arrow-down',function(event) {
                var $this = $(this);
                var val =  $this.closest('.u-list-content-wrapper');
                val.css("background-color","#fff");
                val.css("height","auto");
                $this.hide();
                $this.siblings('.u-list-arrow-up').show();
                event.stopPropagation();
                event.preventDefault();
            })
            //备选项展开、收起
            $('#tableListDataselectListByTableList').on('tap','.u-list-arrow-up',function(event) {
                var $this = $(this);
                var val =  $this.closest('.u-list-content-wrapper');
                val.css("background-color","#fff");
                val.css("height","68px");
                $this.hide();
                $this.siblings('.u-list-arrow-down').show();
                event.stopPropagation();
                event.preventDefault();
            })

            //目录方式确定
            $('#dataselectListByTableList').on('tap','#dataSelectBtnOkByTableList',function(e){
                e.stopPropagation();
                e.preventDefault();
                var val =  [];
                var btnId = $(this).data('sourceId');
                var sourceId = (self && self.register && self.register.id) || null;
                if(sourceId && btnId && (sourceId == btnId)) {
                    $("#tableListDataselectListByTableList input[name='dataSelectedRadio']:checked").map(function(item){
                        var itemVal =  $(this).data("value");
                        itemVal = JSON.parse(itemVal.replace(/'/g,"\""));
                        val.push(itemVal);
                    });
                    if(val.length){
                        val.map(function(elem) {
                            self.createDataSetItem(elem);
                        })
                    }else{
                        showMessage("请选择其中一项！");
                    }
                }
            })
            //目录方式关键字 监控搜索框的变化
            $('#dataselectListByTableList').on('keyup','#dataselectListByTableListInput',function(){
                var btnId = $(this).data('sourceId');
                var sourceId = (self && self.register && self.register.id) || null;
                if(sourceId && btnId && (sourceId == btnId)) {
                    clearTimeout(self.searchTimeout);
                    self.searchTimeout = setTimeout(function() {
                         self.getDatasByTableListSearch(1)
                    }, 800);
                }
            });
        },
        calcSum: function(){//合计计算
            var self = this;
            $.each(self.register.sumArr, function(i, obj){
                if(obj.sumflag == true){
                    var reminder = 4;
                    var rule = obj.code_select_value;
                    if(rule.indexOf('|') != -1){
                        reminder  = rule.substr(rule.indexOf('|')+1,1);//余数
                    }

                    var sum = 0;
                    var flag = true;
                    $.each(self.instances, function(k, v){
                    	if(v.cfg != undefined){
                    	    var isright = true;
	                        $.each(v.cfg.item, function(k1, v1){
	                            if(v1.id == obj.id){
	                                if(v1.colvalue == ""){v1.colvalue = 0;}
	                                if(self.validate_num(v1.colvalue)){
	                                    sum += parseFloat(v1.colvalue);
	                                }else{
	                                    isright = false;
	                                    return false;
	                                }
	                            };
	                        });
	                        if(isright == false){
	                            flag = false;
	                            return false;
	                        }
                    	}
                    });
                    if(flag == true){
                        //obj.colvalue = sum.toFixed(reminder);
						obj.colvalue = math.round(sum,parseInt(reminder));
                    }
                }
            });

            self.sumobj.cfg.item = self.register.sumArr;
            self.sumobj.render();
        },

        validate_num: function(val){
			if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(\.)?(?:\d+)?%?$/.test(val) && val.length!=0) {
				return false;
			}else{
                if(val === '') {
                    return false;
                }
				return true;
			}
       	},

        createSum: function(){//生成合计区域
            var self = this;
            var id = (new Date).getTime();
            var sumArr = {
                id: id,
                index: 'sum',
                title: ( this.register.title ?  this.register.title + ' - ' : this.register.title ) + sumTitle,
                item: []
            };
            sumArr.item = $.extend(true, [], this.register.sumArr);
            var $el = self.$sumArea;
            $.each([sumArr], function (i, cfg) {
                var instance = self.sumfactory(this, $el);
                self.sumobj = instance;
            });
        },
        sumfactory: function (cfg, $block) {
            var klass = getFieldClass('RListField'),
                field;
            if (klass) {
                field = new klass(cfg, $block);
            }
            return field;
        },
        initFields: function (fields, $block) {
            var self = this,
                register = this.register,
                instances = this.instances;
            //列表无数据时，显示空提示，隐藏合计区域
            if(fields.length == 0){
                this.$sumArea.hide();
                return;
            }
            this.$sumArea.show();
            //有删除权限，显示删除叉号
            if(register.delete_op == 1){
            	self.$el.addClass('deletePriv');
           	}
            $.each(fields, function (i, cfg) {
                var instance = self.factory(this, $block);
                if (instance && instance.get('id')) {
                    instances[instance.get('id')] = instance;
                }
                instance.on('tap', $.proxy(self.itemClickHandle, self) );
                instance.on('delete', $.proxy(self.itemDeleteHandle, self) );
            });
        },
        factory: function (cfg, $block) {
            var self = this;
            var klass = getFieldClass('RListField'),
                field;
            if (klass) {
            	cfg.delete_op = this.register.delete_op;
                field = new klass(cfg, $block, self.fieldmanager);
            }
            return field;
        },
        parseBlock: function(d){
            /*
            var tmpl = '\
<div class="reportBlock report-block-header clearfix">\
  <div class="report-block-header-op">'
    +((d.op == '1' && d.add_op == 1) ? '<a class="report-list-icon-create" href="javascript:void(0);"></a>' : '')+
'\
</div></div>\
';
*/
            var tmpl = '\
<div class="reportBlock report-block-header clearfix">\
</div></div>\
';
            var $block = $($.parseTpl(tmpl, d));
            this.$wrapper.append( $block );

            if(d.op == '1' && d.add_op == 1){
                this.$wrapper.parents('.tag-listview').find('.report-list-icon-create').addClass('active');
            }
            return $block;
        },
        buildCreateHelper: function(){
            this.$el.append('<div class="read_detail clearfix report-create-helper"><em>'+createItemBtn+'</em></div>');
        },
        createItem: function(){
            var self = this,
                id   = (new Date).getTime();
            var schema = {
                id: id,
                index: 'new',
                title: ( this.register.title ?  this.register.title + ' - ' : this.register.title ) + createBtn,
                item: []
            };
            schema.item = $.extend(true, [], this.register.schema);
            this.initFields([schema], this.$el);
            this.itemClickHandle(this.instances[id], {
                close: function(){
                    this.$el.remove();
                    this.destroy();
                },
                save: function(){
                    this.state = 'add';
                    self.register.sumArr && self.$el.trigger('_calcSum');
                }
            });
        },
        createDataSetItem: function(val){
            pageTo('work');
            var self = this,
                id   = (new Date).getTime();
            var schema = {
                id: id,
                index: 'new',
                title: ( this.register.title ?  this.register.title + ' - ' : this.register.title ) + createBtn,
                item: []
            };

            schema.item = $.extend(true, [], this.register.schema);
            schema.item.forEach(function(elem,index,arr){
                if(val.hasOwnProperty(elem.colname)) {
                    elem.colvalue = val[elem.colname]
                }
            })

            this.initFields([schema], this.$el);
            dataselectListByTableListBack(1)
            // this.itemClickHandle(this.instances[id], {
            //     close: function(){
            //         this.$el.remove();
            //         this.destroy();
            //     },
            //     save: function(){
            //         this.state = 'add';
            //         self.register.sumArr && self.$el.trigger('_calcSum');
            //     }
            // });
        },
        createDataSetBtn: function(){
            var self = this,
                id   = (new Date).getTime();
            var schema = {
                id: id,
                index: 'new',
                title: ( this.register.title ?  this.register.title + ' - ' : this.register.title ) + createBtn,
                item: []
            };
            schema.item = $.extend(true, [], this.register.schema);
            $("#tableListDataselectListByTableList").html('');

            //数据源选择界面下滑滚动时，自动加载下一页数据
            self.extDataPullDown();

            pageTo("dataselectListByTableList");
            $("#dataselectListByTableListInput").val('');
            var _dataSet = this.register.dataSet;
            self.checkSearch(_dataSet);
            self.getDataSetByTableList(_dataSet, 1);
        },
        checkSearch:function (param) {
            var self = this;
            var searchFlag = param.dataQuery;
            if(searchFlag) {
                $('#dataselectListByTableList').removeClass('dataset-noquery-active')
            } else {
                $('#dataselectListByTableList').addClass('dataset-noquery-active')
            }

        },
        //数据源选择界面下滑滚动时，自动加载下一页数据
        extDataPullDown:function () {
            var self = this;
            $("#tableListDataselectListByTableList").unbind('scroll').scroll(
                function(){
                    var _dataSet = self.register.dataSet;
                    var nScrollHight = 0; //滚动距离总长(注意不是滚动条的长度)
                    var nScrollTop = 0;   //滚动到的当前位置
                    var nDivHight = $("#tableListDataselectListByTableList").height();
                    nScrollHight = $(this)[0].scrollHeight;
                    nScrollTop = $(this)[0].scrollTop;
                    if(nScrollHight != 0 && (nScrollTop + nDivHight >= nScrollHight)){
                        page++;
                        //每次触发滑动事件后就解除滑动事件的绑定，防止ios端多次连续触发滑动事件
                        $("#tableListDataselectListByTableList").unbind('scroll');
                        self.getDataSetByTableList(_dataSet, page);
                    }
                }
            );
        },
        getDataSetByTableList:function(param, page) {
            var self = this;
            var _dataField = param.dataField || '';
            var _dataFieldName = param.dataFieldName || '';
            var _dataQuery = param.dataQuery || '';
            var _dataRelation = param.dataRelation || '';
            var _dataSrc = param.dataSrc || '';
            var _dataControl = param.data_control || '';
            var _dataRelation = param.dataRelation || {};

            $.ajax({
                type: 'GET',
                url: '/general/approve_center/list/input_form/getdata.php',
                cache: false,
                data: {
                    "dataField": _dataField,
                    "dataFieldName": _dataFieldName,
                    "dataQuery": _dataQuery,
                    "dataSrc": _dataSrc,
                    "data_control": '',
                    "type": null,
                    "dataSrcName": null,
                    "datadbid": null,
                    "LIST_VIEW":'LIST_VIEW',
                    "PRO_NAME":null,
                    "PRO_DESC":null,
                    "PRO_CODE":null,
                    "readonly": null,
                    "ifMobile":true,
                    "page":page,
                },
                beforeSend:function(xhr, settings) {
                    //$.ProLoading.show('加载中...');
                },
                success: function(ret) {
                    //$("#tableListDataselectListByTableList").html('');
                    //如果没数据了就解除下滑滚动事件
                    if (!ret) {
                        $("#tableListDataselectListByTableList").unbind('scroll');
                    }
                    $.ProLoading.hide();
                    var data = JSON.parse(ret);
                    var rows = data.rows;
                    if(rows.length) {
                        var titleArr = [];
                        var nameArr = [];
                        var lowertitleArr = [];
                        var dataArr = [];
                        var nameTmpArr = [];
                        titleArr = _dataFieldName.split(',');
                        nameArr = _dataControl.split(',');
                        lowertitleArr = _dataField.split(',');
                        // titleArr.pop();
                        // nameArr.pop();
                        // lowertitleArr.pop();
                        $.each(rows,function(i, elem){
                            var tmpObj = {};
                            var titleObj = {};
                            $.each(titleArr,function(n, item ) {
                                tmpObj[item] = elem.cell[n];
                                titleObj[_dataRelation[item]] = elem.cell[n];
                            })
                            dataArr.push(tmpObj)
                            var str = JSON.stringify(titleObj).replace(/"/g,"'");
                            nameTmpArr.push(str)
                        })
                        var datas = {};
                        datas.data = dataArr;
                        datas.name = nameTmpArr;
                        //$("#tableListDataselectListByTableList").html('').html(self.setModalHtml(datas));
                        $("#tableListDataselectListByTableList").append(self.setModalHtml(datas));
                        $('#dataSelectBtnOkByTableList').removeClass('disabled');
                        var sourceId = (self && self.register && self.register.id) || null;
                        $('#dataSelectBtnOkByTableList').data('sourceId',sourceId);
                        $('#dataselectListByTableListInput').data('sourceId',sourceId);
                    } else if (!rows.length && page == 1) {
                        $("#tableListDataselectListByTableList").html('').html('<li class="ui-border-t"><div class="ui-list-info ui-border-t fixed-h no_list_info">暂无数据</div></li>');
                        $('#dataSelectBtnOkByTableList').addClass('disabled');
                        $('#dataSelectBtnOkByTableList').data('sourceId', null);
                        $('#dataselectListByTableListInput').data('sourceId',null);
                    }
                    //数据源选择界面下滑滚动时，自动加载下一页数据
                    self.extDataPullDown();
                },
                error: function(res) {
                    $.ProLoading.hide();
                    console.log('error')
                }
            });
        },
        getDatasByTableListSearch:function(page) {
            var self = this;
            var param = $.extend(true, {}, self.register.dataSet);
            var _dataField = param.dataField || '';
            var _dataFieldName = param.dataFieldName || '';
            var _dataQuery = param.dataQuery || '';
            var _dataRelation = param.dataRelation || '';
            var _dataSrc = param.dataSrc || '';
            var _dataControl = param.data_control || '';
            var _dataRelation = param.dataRelation || {};
            var term = $('#dataselectListByTableListInput').val();

            $.ajax({
                type: 'GET',
                url: '/general/approve_center/list/input_form/getdata.php',
                cache: false,
                timeout:10000,
                data: {
                    "dataField": _dataField,
                    "dataFieldName": _dataFieldName,
                    "dataQuery": _dataQuery,
                    "dataSrc": _dataSrc,
                    "data_control": '',
                    "type": null,
                    "dataSrcName": null,
                    "datadbid": null,
                    "LIST_VIEW":'LIST_VIEW',
                    "PRO_NAME":null,
                    "PRO_DESC":null,
                    "PRO_CODE":null,
                    "readonly": null,
                    "ifMobile":true,
                    "mobileQuery":term
                },
                beforeSend:function(xhr, settings) {
                    $.ProLoading.show('加载中...');
                },
                success: function(ret) {
                    $("#tableListDataselectListByTableList").html('');
                    var data = JSON.parse(ret);
                    var rows = data.rows;
                    if(rows.length) {
                        var titleArr = [];
                        var nameArr = [];
                        var lowertitleArr = [];
                        var dataArr = [];
                        var nameTmpArr = [];
                        titleArr = _dataFieldName.split(',');
                        nameArr = _dataControl.split(',');
                        lowertitleArr = _dataField.split(',');
                        // titleArr.pop();
                        // nameArr.pop();
                        // lowertitleArr.pop();
                        $.each(rows,function(i, elem){
                            var tmpObj = {};
                            var titleObj = {};
                            $.each(titleArr,function(n, item ) {
                                tmpObj[item] = elem.cell[n];
                                titleObj[_dataRelation[item]] = elem.cell[n];
                            })
                            dataArr.push(tmpObj)
                            var str = JSON.stringify(titleObj).replace(/"/g,"'");
                            nameTmpArr.push(str)
                        })
                        var datas = {};
                        datas.data = dataArr;
                        datas.name = nameTmpArr;
                        $("#tableListDataselectListByTableList").html('').html(self.setModalHtml(datas));
                        $('#dataSelectBtnOkByTableList').removeClass('disabled');
                        var sourceId = (self && self.register && self.register.id) || null;
                        $('#dataSelectBtnOkByTableList').data('sourceId',sourceId);
                        $('#dataselectListByTableListInput').data('sourceId',sourceId);
                    }else{
                        $("#tableListDataselectListByTableList").html('').html('<li class="ui-border-t"><div class="ui-list-info ui-border-t fixed-h no_list_info">暂无数据</div></li>');
                        $('#dataSelectBtnOkByTableList').addClass('disabled');
                        $('#dataSelectBtnOkByTableList').data('sourceId', null);
                        $('#dataselectListByTableListInput').data('sourceId',null);
                    }
                    $.ProLoading.hide();
                },
                error: function(res) {
                    $.ProLoading.hide();
                    console.log('error')
                }
            });
        },
        setModalHtml: function(d){
            var tplHTML =
                        '<% for(var m=0;m<data.length;m++){ %>'+
                            '<div class="u-list-content-wrapper">'+
                                '<div class="u-list-contents-lists">'+
                                        '<div class="u-list-wrapper-left ui-checkbox"><input type="checkbox" name="dataSelectedRadio" data-value=<%=JSON.stringify(name[m])%> /></div>'+
                                        '<div class="u-list-wrapper-right">'+
                                            '<% for(var index in data[m]){ %>'+
                                                '<div>'+
                                                    '<span  class="u-list-wrapper-item-left"><%=index%></span>:'+
                                                    '<span  class="u-list-wrapper-item-right"> <%=data[m][index]%></span>'+
                                                '</div>'+
                                            '<% } %>'+
                                        '</div>'+
                                    '<div class="u-parents-clear"></div>'+
                                '</div>'+
                                '<% if (Object.keys(data[m]).length > 2) {%>'+
                                    '<div  class="u-list-arrow-down"><img style="width:12px;height:12px;" src="/static/mobile/style/frozen/img/arr-down.png"  alt="展开" /></div>'+
                                    '<div style="display:none;" class="u-list-arrow-up"><img style="width:12px;height:12px;" src="/static/mobile/style/frozen/img/arr-up.png"  alt="收起" /></div>'+
                                '<% } %>'+
                            '</div>'+
                        '<% } %>';
            return $.tpl(tplHTML,d);
        },
        itemDeleteHandle: function(item, callbacks){
            var self = this;
            if(this.instances[item.cfg.id]){
                delete this.instances[item.cfg.id];
            }
            item.$el.remove();
            self.fieldmanager && self.fieldmanager.trigger('calc');
            self.register.sumArr && self.$el.trigger('_calcSum');
        },
        itemClickHandle: function(item, callbacks){
        	var self = this;
        	//无编辑权限有新建权限，不能编辑已有的数据和新建保存的数据，只能在新建时修改对应数据
        	if(item.get('index') == 'new' || this.register.edit_op==1){
	            var flag = 0;
	            if(item.get('index') == 'new' || item.get('index') == 'sum'){
	                flag = 1;
	            };
                var $panel = $('#scroller_list_detail');
                $panel.empty();
                pageTo('list_detail');
	            var $inner = $('<div>').appendTo($panel);
	            var $btnwrapper = $("<div style='text-align: center;margin-top:15px;'>").appendTo($panel);
	            var $save = $('<button>').text(saveItemBtn).addClass("reportbtn").appendTo($btnwrapper);//保存
	            var $close = $('<button>').text(closeItemBtn).addClass("reportclose").appendTo($btnwrapper);
	            $panel.append('<div class="holder-40"></div>');
	            $close.click(function(){
                    $panel.empty();
                    history.back();
	                callbacks && callbacks.close && callbacks.close.call(item);
	                if(self.$wrapper.find('.tag-RListField').length == 0){
            			self.$sumArea.hide();
	                }
	            });
	            $save.click(function(){
					var onSubmitFlag = l.onSubmit();
					if(!onSubmitFlag) return;
	                l.updateDataFromFields();
	                item.render();
	                self.fieldmanager.trigger('calc');
	                self.register.sumArr && self.$el.trigger('_calcSum');
	                $panel.empty();
					// var itemocr = item.cfg;
					// var nameo = 'DATA_'+itemocr.item[0].id.substr(11,1);
                    // var arro = JSON.parse(fieldManager.listocrdata[nameo]);
					// for(var i= 0;i<=itemocr.item.length-1;i++)
					// {
					// 	delete(itemocr.item[i]['listManager']);
					// }
					// var maxid  = "";
					// for(var i= 0; i<=arro.detail[0]['item'].length-1; i++)
					// {
					// 	if(itemocr['id'] == arro.detail[0]['item'][i]['id'])
					// 	{
					// 		arro.detail[0]['item'][i] = itemocr;
					// 	}
					//    maxid = arro.detail[0]['item'][i]['id'];
					// }
					// if(itemocr['index'] == 'new')
					// {
					// 	itemocr['id'] = maxid+1;
					// 	itemocr['order'] = maxid+1;
					// 	itemocr['index'] = maxid+1;
					// 	//取最大的长度
					// 	arro.detail[0]['item'][arro.detail[0]['item'].length] = itemocr;
					//
					// }
					// fieldManager.listocrdata[nameo] = JSON.stringify(arro);
					//
	                // self.fieldmanager.trigger('calc');
	                // self.register.sumArr && self.$el.trigger('_calcSum');
	                // $panel.empty();
                    history.back();
                    saveFlag = 0;
	                callbacks && callbacks.save && callbacks.save.call(item);
	            });
	            //console.log('3',self.fieldmanager);
	            //点击条目打开编辑详情
	            l = new TListViewManager({
	                wrapper: $inner,
	                fieldmanager: self.fieldmanager
	            }, {
	                main: [item.cfg],
	                id: this.getId(),
	                flag: flag
	            });
	            setTimeout(function(){
	                $panel.show();
	            }, 1)
        	}else{
        		return false;
        	}
        },
        serializeArray: function(){
    	    var str = "";
            $.each(this.instances, function(i, field){
            	var data = field.getData()
                //data && ret.push(data);
		        data && (str+=field.getData());
            });
             return str;
        }
    });
    exports.TListViewManager = window.TListViewManager = TListViewManager;
});
define('ReportFieldLoder', ["RTextField", "RDateField", "RCheckBoxField", "RRadioField", "RCalcCtrlField", "RRawField", "RTextAreaField", "RSelectField", "RListField"], function (require, exports, module) {
    var depends = module.dependencies;
    for (var i in depends) {
        var mod = require(depends[i]);
        exports[depends[i]] = mod ? mod[depends[i]] : null;
    }
});

define('RTextField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var RTextField = Base.extend({
        attrs: {
            id: null
        },
        initialize: function (cfg, $wrapper) {
            RTextField.superclass.initialize.call(this, cfg);
            this.cfg = cfg;
            this.$el = $(this.parseTpl(cfg));
            this.$field = this.getField();
            this.$wrapper = $wrapper;
            if(!cfg.secret){
            	this.appendFieldElement(this.$el);
            }
            this.bindEvent();
            this.initialized();
        },
        parseTpl: function (cfg) {
			cfg.desc = cfg.desc ? cfg.desc : '请填写内容';
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">'+ (cfg.required ? '<span class="isrequired">*</span>' : '') +
  '<em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<input value="<%=colvalue%>" name="<%=id%>" type="text" style="font-size:15px; width:65%;"/>'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>'+ (cfg.required ? '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>' : '') +
'</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        appendFieldElement: function(el){
            this.$wrapper.append(el);
        },
        getField: function(){
            return this.$el.find('input')
        },
        getValue: function(){ return this.getField().val() },
        updateDataFromField: function(){
            var oldvalue = this.cfg.colvalue;
            this.cfg.colvalue = this.getValue();
            this.cfg.isChanged = !(oldvalue == this.cfg.colvalue);
        },
        getData: function(){
            var ret = {};
            if(this.cfg.editable){
                ret.name = this.cfg.id;
                ret.value = this.getValue();
                ret.displaystyle = this.cfg.displaystyle;
            }
            return ret;
        },
		onSubmit: function(){
			var self = this;
			var obj_val = typeof this.getField().val() != 'undefined' ? this.getField().val() : this.getField().text();
            var required_val = this.cfg.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc || '请填写内容');
                setTimeout(function(){
                    $("#div_alert_"+self.cfg.id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }else{
				return true
			}
		},
		validation: function(){
			$("#div_alert_"+this.cfg.id+"").addClass("div_alert_show");
		},
        initialized: function(){
            this.cfg.editable == "1" && this.$el.addClass('field-editable');
        },
        validate_num: function(){
			var str = this.getValue();
			if(str.length == 1 && str == "-"){
				return true;
			};
			if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(\.)?(?:\d+)?%?$/.test(str) && str.length!=0) {
				alert(numverTips);
				return false;
			}else{
				return true;
			}
       	},
        bindEvent: function(){
        },
        bindCalc: function(instances, rule, result, reminder){
            var $input = this.getField(),
                self   = this;
            $input.bind("keyup paste _calced", function(){
                var ret = [];
                ret.push(instances);
                ret.push(rule);
                ret.push(result);
                ret.push(reminder);
                var flag = self.validate_num();
				flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
            });
        }
    });
    exports.RTextField = window.RTextField = RTextField;
});
define('RDateField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RDateField = RTextField.extend({
        parseTpl: function (cfg) {
			cfg.desc = cfg.desc ? cfg.desc : '请选择日期';
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">'+ (cfg.required ? '<span class="isrequired">*</span>' : '') +
  '<em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<input value="<%=colvalue%>" name="<%=id%>" type="text" />'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>'+ (cfg.required ? '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>' : '') +
'</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        initialized: function(){
        	var self = this;
            if(this.cfg.editable){
                var $input = this.getField();
                $input.attr("readonly","true");
                if(this.cfg.displaystyle == "yyyy-MM-dd"){
                    $input.attr({"data-type":"date"});
                }else{
                    $input.attr({"data-type":"datetime"});
                }
                $input.focus(function(){
                    if($input.attr("data-type") == "date"){
                        $('[data-type="date"]').mobiscroll().date({
                            theme: 'ios7',
                            lang: 'zh',
                            dateFormat: 'yy-mm-dd',
                            display: 'bottom',
                            dateOrder: 'ddMMyy',
                            mode: 'scroller',
							minDate:new Date('1900-01-01'),
							maxDate:new Date('2100-12-31')
                        });
                    }
                    else if($input.attr("data-type") == "datetime"){
                        $('[data-type="datetime"]').mobiscroll().datetime({
                            theme: 'ios7',
                            lang: 'zh',
                            dateFormat: 'yy-mm-dd',
                            timeFormat: 'HH:ii:ss',
							timeWheels:'HHiiss',
                            display: 'bottom',
                            mode: 'scroller',
							minDate:new Date('1900-01-01'),
							maxDate:new Date('2100-12-31')
                        });
                    }
                    else if($input.attr("data-type") == "time"){
                        $('[data-type="time"]').mobiscroll().time({
                            theme: 'ios7',
                            lang: 'zh',
                            display: 'bottom',
                            timeFormat: 'HH:ii:ss',
							timeWheels:'HHiiss',
                            mode: 'scroller'
                        });
                    }
                });
                this.cfg.editable == "1" && this.$el.addClass('field-editable');
            }
        }

    });
    exports.RDateField = window.RDateField = RDateField;
});
define('RCalcCtrlField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var Math = require('math');
    var RCalcCtrlField = RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field"><span><%=colvalue%></span><input value="" name="<%=id%>" type="hidden" /></div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        getField: function(){
            return this.$el.find('span')
        },
        setValue: function(str, reminder){
            var res = math.eval(str);
            if(reminder !== ""){
            	//res = res.toFixed(reminder);
				//res = math.round(res,parseInt(reminder));
				res = parseFloat(res).toFixed(parseFloat(reminder))
            }else{
                if(res!=undefined){
                    //res = res.toFixed(2);
					res = math.round(res,parseInt(2));
                }
            }
            this.$el.find('span').text(res);
        },
        updateDataFromField: function(){
            var oldvalue = this.cfg.colvalue;
            this.cfg.colvalue = this.getValue();
            this.cfg.isChanged = !(oldvalue == this.cfg.colvalue);
        },
        getValue: function(){ return this.getField().text() },
        initialized: function(){
            //在每条记录中过滤每个计算控件的cfg里新增对应的上级记录对象listManager，调用这个在listManager中实现获取对应的dom对象，并对dom绑事件
            //this.cfg.listManager && this.cfg.listManager.initCalc(this.cfg);
            var self = this;
			setTimeout(function(){
				self.cfg.listManager && self.initCalc(self.cfg);
			},1000);
        },
        initCalc: function(cfg){
            var self = this,
                instances = this.cfg.listManager.instances,
                rule      = this.cfg.code_select_value,
                reminder  = 4;
            if(rule.indexOf('|')!=-1){
                reminder  = rule.substr(rule.indexOf('|')+1,1);//余数
                rule = rule.substr(0,rule.indexOf('|'));//提纯公式
            }
            // var arr = rule.match(/(\d+)/g);
            var arr = rule.match(/\[(\d+)\]/g);
            arr = arr === null ? [] : arr;
            var list_id = this.cfg.listManager.register.id;
            $.each(arr, function(k, v){
                var v_reg =/\[(\/?\d*)\]/;
                v = v.replace(v_reg,"$1");
                var obj = instances['list_'+list_id+'_col_'+v];
                obj.bindCalc(instances, cfg.code_select_value, cfg.id, reminder);
            });
            self.cfg.listManager.get('wrapper').bind('calc', function(){
                self.calc(arguments[1],arguments[2],arguments[3],arguments[4]);
            });
        },
        calc: function(instances, rule, result, reminder){
            var self      = this,
                instances = instances? instances: this.cfg.listManager.instances,
                rule      = rule? rule: this.cfg.code_select_value,
                result    = result? result: this.cfg.id,
                reminder  = reminder? reminder: 4;
            if(rule.indexOf('|')!=-1){
                reminder  = rule.substr(rule.indexOf('|')+1,1);//余数
                rule = rule.substr(0,rule.indexOf('|'));//提纯公式
            }
            var arr  = rule.match(/(\d+)/g);
            arr = arr === null ? [] : arr;
            //var list_id = this.cfg.listManager.register.main[0].id;
            var list_id = this.cfg.listManager.register.id;
            $.each(instances, function(k, v){
                $.each(arr, function(m, n){
                    if(v.cfg.id == ('list_'+list_id+'_col_'+n)){
                        var re = new RegExp("\\["+n+"\\]","ig");
                        var calv = 0;
                        calv = (v.getValue()=='' ? 0: v.getValue());
                        //对小数点最后一位进行处理
                        if(calv && calv.indexOf(".") != -1 && calv.indexOf(".") == calv.length-1)
                        {
                            calv = calv.replace(".", "");
                        }
                        //对百分号的处理
                        if(calv && calv.indexOf("%") != -1)
                        {
                            calv.replace("%", "");
                            calv = parseFloat(calv)/100;
                        }
                        rule = rule.replace(re,calv);
                    }
                });
            });
            instances[result].setValue(rule, reminder);
            instances[result].getField().trigger('_calced');
        },
        bindCalc: function(instances, rule, result, reminder){
            var self   = this,
                $input = this.getField();
            $input.bind("_calced", function(){
                self.cfg.listManager.get('wrapper').trigger('calc', [instances, rule, result, reminder]);
            });
        }
    });
    exports.RCalcCtrlField = window.RCalcCtrlField = RCalcCtrlField;
});
define('RSelectField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RSelectField = RTextField.extend({
        parseTpl: function (cfg) {
			cfg.desc = cfg.desc ? cfg.desc : '请选择内容';
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">'+ (cfg.required ? '<span class="isrequired">*</span>' : '') +
  '<em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field">\
  ' + (cfg.editable == 1 ?
      '<select value="<%=colvalue%>" name="<%=id%>" title="<%=colname%>"></select>'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>'+ (cfg.required ? '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>' : '') +
'</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        renderOption: function (cfg) {
            var code_select_value = cfg.code_select_value,
                opData = code_select_value ? code_select_value.split('|') : [],
                html = [];
            $.each(opData, function () {
                if (this == '') {
                    return
                }
                var selected = this == cfg.colvalue ? ' selected ' : '';
                html.push('<option value="' + this + '" ' + selected + '>' + this + '</option>');
            });
            this.$field.append(html.join(''));
        },
        getField: function(){
            if(this.cfg.editable == "1"){
                return this.$el.find('select')
            }else{
                return this.$el.find('input')
            }
        },
        getValue: function(){
            if(this.cfg.editable == "1"){
                var this_obj = this.getField().find('option');
                for(var this_count = 0; this_count < this_obj.length; this_count++)
                {
                    if($(this_obj[this_count]).prop("selected") === true){
                        return $(this_obj[this_count]).val();
                    }
                }
                // return this.getField().find('option:selected').val()
            }else{
                return this.getField().val()
            }
        },
		onSubmit: function(){
			var self = this;
			var obj_val = this.getValue();
            var required_val = this.cfg.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc || '请选择内容');
                setTimeout(function(){
                    $("#div_alert_"+self.cfg.id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }else{
				return true
			}
		},
		validation: function(){
			$("#div_alert_"+this.cfg.id+"").addClass("div_alert_show");
		},
        initialized: function(){
            if(this.cfg.editable && this.cfg.editable == "1"){
                this.renderOption(this.cfg);
                this.$el.addClass('field-editable');
            }
        },
        bindCalc: function(instances, rule, result, reminder){
            var self    = this,
                $select = self.getField(),
                ret     = [];
            ret.push(instances);
            ret.push(rule);
            ret.push(result);
            ret.push(reminder);
            if(self.cfg.editable == "1"){
                $select.bind("change _calced", function(){
                	var flag = self.validate_num();
                    flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                });
            }
            else{
                $select.bind("_calced", function(){
                	var flag = self.validate_num();
                    flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                });
            }
        }
    });
    exports.RSelectField = window.RSelectField = RSelectField;
});
define('RListField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RListField = RTextField.extend({
        attrs: {
            id: null
        },
        initialize: function (cfg, $wrapper) {
            RTextField.superclass.initialize.call(this, cfg);
            var self = this;
            this.cfg = cfg;
            this.$el = $(this.parseTpl(cfg));
            this.$wrapper = $wrapper;
            this.appendFieldElement(this.$el);
            this.bindEvent();
			this.render();
            this.$el.on('tap', function(){
                if(!window.stopDelete){
                    self.trigger('tap', self);
                }
                window.stopDelete = false;
            });
        },
        bindEvent: function(){
            var self = this;
            this.$el.delegate('.read_detail_delete', 'tap', function(e){
                e.stopPropagation();
                var delflag=confirm(confirmDelete);
                if (delflag == true){
                    self.trigger('delete', self);
                   // var nameo = 'DATA_'+self.cfg.item[0].id.substr(11,1);
                   // var arro = JSON.parse(fieldManager.listocrdata[nameo]);
                   // for(var i=0;i<=arro.detail[0]['item'].length-1;i++)
                   // {
                   //     if(arro.detail[0]['item'][i]['id'] == self.cfg.id)
                   //     {
                   //         arro.detail[0]['item'].splice(i,1)
                   //         break;
                   //     }
                   // }
                   //  fieldManager.listocrdata[nameo] = JSON.stringify(arro);

                    saveFlag = 0;
                    window.stopDelete = true;
                    // if($('#scroller_list_edit').find('.read_detail').length == 0){
                    //     $('#scroller_list_edit').find('#emptyTips').css('display', 'block');
                    // }
                    // return true;
                }
                else{
                    window.stopDelete = true;
                    return false;
                }
            });
        },
        parseTpl: function (cfg) {
//console.log(cfg,cfg.index)
            var id = this.get('id');
            var tmpl = (function(){
                var fields = [];

                var title = "";
                if(cfg.index == "sum"){
                    title = sum_text;
                }else if(cfg.index == "new"){
                    title = add_text;
                }else{
                    title = cfg.index;
                }

                $.each(cfg.item, function(i, v){
                    //console.log(v);
                    if(v.secret){
                        if(i == 0){
                            fields.push('<b class="no">'+title+'</b>');
                        }
                    }else{
                        if(i == 0){
                            fields.push('<b class="no">'+title+'</b><em>' + v.colname + ': ' + emptyHelper(v.colvalue) + '</em>');
                            /*fields.push('<b class="no">'+(cfg.index)+'</b><em>' + v.colname + ': ' + emptyHelper(v.colvalue) + '</em>');*/
                        }else{
                            fields.push('<em>' + v.colname + ': ' + emptyHelper(v.colvalue,v) + '</em>');
                        }
                    }
                });
                var newClass = (cfg.index == 'new')? 'list-item-new':'';
                var html = '';
                var deletehtml = '';
                if(cfg.index == 'new'){
                    deletehtml = '<div class="read_detail_delete"><span>'+ read_detail_delete +'</span></div>';
                }
                if(cfg.delete_op !=undefined && cfg.delete_op != 0){
                    deletehtml = '<div class="read_detail_delete"><span>'+ read_detail_delete +'</span></div>';
                }

                html = '<div class="read_detail clearfix tag-RListField"><div class="clearfix list-item '+ newClass +'">'+ fields.join('\n\r') +'</div>'+deletehtml+'</div>';
                return html;
            })();
            return $.parseTpl(tmpl, cfg)
        },
        render: function(){
            this.$el.html( $(this.parseTpl(this.cfg)).html() );
            if(this.cfg.delete_op == 1){
            	Swiped.init({
			        query: '.list-content .list-item',
			        list: true,
			        right: 100
			    });
			}else{
				if(this.cfg.index == 'new'){
					$('body').addClass('deletePriv');
					Swiped.init({
				        query: '.list-content .list-item-new',
				        list: true,
				        right: 100
				    });
				}
			}
        },
        appendFieldElement: function(el){
            this.$wrapper.append(el);
        },
        getData: function(){
        	if(this.cfg == undefined){
        		return ;
        	}
            //var ret = [];
            var data_str = "";
            $.each(this.cfg.item, function(){
                if(this.fieldtype == "RRadioField" || this.fieldtype == "RCheckBoxField")
                {
                    var the_value = this.colvalue;
                    the_value = the_value.replace(/\r\n/g, "&lt;br&gt;");
                    data_str += this.colvalue + "`";
                }
                else if(this.fieldtype == "RTextAreaField")
                {
                    var the_value = this.colvalue;
                    the_value = the_value.toString();
		    the_value = the_value.replace(/`/g, '[0x60]');
                    var textarea_html = the_value + "`";
                    textarea_html = textarea_html.replace(/\r\n/g, "&lt;br&gt;");
                    textarea_html = textarea_html.replace(/\n/g, "&lt;br&gt;");
                     data_str += textarea_html;
                }
                else
                {
                    var the_value = this.colvalue || '';
                    the_value = the_value.toString();
                    the_value = the_value.replace(/`/g, '[0x60]');
            		data_str += the_value + "`";
                }
            });
            data_str = data_str.replace(/\r\n/g, "&lt;br&gt;");
            data_str += "\n";
            return data_str;
        }
    });
    function emptyHelper(c,v){
    	if(v && v.fieldtype == "RCalcCtrlField"){
			if(v.code_select_value.indexOf('|') != '-1'){
				var reminder = v.code_select_value.split('|')[1]
				if(reminder){
                    c = c===''? 0 : c ;
					c =  parseFloat(c).toFixed(parseFloat(reminder))
				}
			}
    		return c == '' ? 0 : c;
    	}
    	else{
        	return (c == '' || c == null) ? ' - ' : c;
    	}
    }
    exports.RListField = window.RListField = RListField;
});

define('RCheckBoxField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RCheckBoxField = RTextField.extend({
        parseTpl: function (cfg) {
			cfg.desc = cfg.desc ? cfg.desc : '请选择内容';
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">'+ (cfg.required ? '<span class="isrequired">*</span>' : '') +
  '<em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<div class="checkWrapper"></div>'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>'+ (cfg.required ? '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>' : '') +
'</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        getField: function(){
            if(this.cfg.editable == "1"){
                return this.$el.find('.checkWrapper')
            }else{
                return this.$el.find('input')
            }
        },
        getValue: function(){
            var cvalue = 0;
            this.getField().find('input[type="checkbox"]:checked').each(function(){
            	var $this = $(this);
                var val = $this.parent('label').find('p').text();
                cvalue += parseFloat(val);
            });
            cvalue = cvalue.toString();
            return cvalue;
        },
		onSubmit: function(){
			var self = this;
			var obj_val = this.getValue();
            var required_val = this.cfg.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc || '请选择内容');
                setTimeout(function(){
                    $("#div_alert_"+self.cfg.id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }else{
				return true
			}
		},
		validation: function(){
			$("#div_alert_"+this.cfg.id+"").addClass("div_alert_show");
		},
        getValueString: function(){
            if(this.cfg.editable == "1"){
                var str = "";
                this.getField().find('input[type="checkbox"]:checked').each(function(){
                	var $this = $(this);
                    var val = $this.parent('label').find('p').text();
                    str += val + ',';
                });
                str = str.substr(0, str.length-1);
                return str;
            }
            else{
                return this.getField().val()
            }
        },
        updateDataFromField: function(){
            var oldvalue = this.cfg.colvalue;
            this.cfg.colvalue = this.getValueString();
            this.cfg.isChanged = !(oldvalue == this.cfg.colvalue);
        },
        renderItem: function(cfg){
            this.$field = this.getField();
            var code_select_value = cfg.code_select_value,
                opData = code_select_value ? code_select_value.split('|') : [],
                default_items = cfg.colvalue,
                defaultData = default_items ? default_items.split(',') : [],
                html = [];
            $.each(opData, function (k, v) {
                if (this == '') {
                    return;
                }
                var checked = $.inArray(v, defaultData)==-1 ? '' : 'checked';
                html.push('<div class="ui-form-item ui-form-item-checkbox"><label for="'+ cfg.id+'_'+k +'" class="ui-checkbox"><input type="checkbox" name="'+cfg.id+'" id="'+ cfg.id+'_'+k +'" ' + checked + ' /><p>'+ this +'</p></label></div>');
            });
            this.$field.append(html.join(''));
        },
        initialized: function(){
            if(this.cfg.editable && this.cfg.editable == "1"){
                this.renderItem(this.cfg);
                this.$el.addClass('field-editable');

            }
        },
        bindCalc: function(instances, rule, result, reminder){
            var self   = this,
                $field = self.getField(),
                ret = [];
            ret.push(instances);
            ret.push(rule);
            ret.push(result);
            ret.push(reminder);
            if(self.cfg.editable == "1"){
                $field.find('input').each(function(){
                    var $this = $(this);
                    $this.on('tap _calced', function(event){
                        setTimeout(function(){
                        	var flag = self.validate_num();
                            flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                        },1000);
                    });
                });
            }else{
                $field.on('_calced', function(event){
                	 var flag = self.validate_num();
                     flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                });
            }
        }
    });
    exports.RCheckBoxField = window.RCheckBoxField = RCheckBoxField;
});
define('RRadioField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RRadioField = RTextField.extend({
        parseTpl: function (cfg) {
			cfg.desc = cfg.desc ? cfg.desc : '请选择内容';
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">'+ (cfg.required ? '<span class="isrequired">*</span>' : '') +
  '<em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<div class="radioWrapper"></div>'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>'+ (cfg.required ? '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>' : '') +
'</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        getField: function(){
            if(this.cfg.editable == "1"){
                return this.$el.find('.radioWrapper')
            }else{
                return this.$el.find('input')
            }
        },
        getValue: function(){
            if(this.cfg.editable == "1"){
            	var str = '';
            	if($("input[name='"+this.cfg.id+"']:checked").length > 0){
            		str = $("input[name='"+this.cfg.id+"']:checked").parent('label').find('p').text();
            	}
                return str;
            }else{
                return this.getField().val();
            }
        },
		onSubmit: function(){
			var self = this;
			var obj_val = this.getValue();
            var required_val = this.cfg.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc || '请选择内容');
                setTimeout(function(){
                    $("#div_alert_"+self.cfg.id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }else{
				return true
			}
		},
		validation: function(){
			$("#div_alert_"+this.cfg.id+"").addClass("div_alert_show");
		},
        updateDataFromField: function(){
            var oldvalue = this.cfg.colvalue;
            this.cfg.colvalue = this.getValue();
            this.cfg.isChanged = !(oldvalue == this.cfg.colvalue);
        },
        renderItem: function(cfg){
            var code_select_value = cfg.code_select_value,
                opData = code_select_value ? code_select_value.split('|') : [],
                html = [];
            this.$field = this.getField();
            $.each(opData, function (k, v) {
                if (this == '') {
                    return
                }
                var checked = this == cfg.colvalue ? ' checked ' : '';
                html.push('<div class="ui-form-item ui-form-item-radio"><label for="'+ cfg.id+'_'+k +'" class="ui-radio"><input type="radio" name="'+cfg.id+'" id="'+ cfg.id+'_'+k +'" ' + checked + ' /><p>'+ this +'</p></label></div>');
            });
            this.$field.append(html.join(''));
        },
        initialized: function(){
            if(this.cfg.editable && this.cfg.editable == "1"){
                this.renderItem(this.cfg);
                this.$el.addClass('field-editable');
            }
        },
        bindCalc: function(instances, rule, result, reminder){
            var self   = this,
                $field = self.getField(),
                ret = [];
            ret.push(instances);
            ret.push(rule);
            ret.push(result);
            ret.push(reminder);
            if(self.cfg.editable == "1"){
                $field.find('input').each(function(){
                    var $this = $(this);
                    $this.on('tap _calced', function(event){
                        setTimeout(function(){
                        	var flag = self.validate_num();
                            flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                        },1000);
                    });
                });
            }else{
                $field.on('_calced', function(event){
                	var flag = self.validate_num();
                    flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                });
            }
        }
    });
    exports.RRadioField = window.RRadioField = RRadioField;
});
define('RTextAreaField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RTextAreaField = RTextField.extend({
        parseTpl: function (cfg) {
            if(cfg.editable == 1){
                cfg.colvalue = this.lfDecode(cfg.colvalue);
            }else{
                cfg.colvalue = cfg.colvalue.replace(/&lt;br&gt;/g, "<br>");
            }

			cfg.desc = cfg.desc ? cfg.desc : '请选择内容';
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">'+ (cfg.required ? '<span class="isrequired">*</span>' : '') +
  '<em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<textarea name="<%=id%>" value="<%=colvalue%>" style="font-size:15px; width:100%; height:200px; line-height:20px;"><%=colvalue%></textarea>'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>'+ (cfg.required ? '<div class="div_alert div_alert_hidden" id="div_alert_<%=id%>"><%=desc%></div>' : '') +
'</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        initialized: function(){
            if(this.cfg.editable){
                this.cfg.editable == "1" && this.$el.addClass('field-editable');
            }
        },
        lfEncode: function(s){
            s = s.replace(/\r\n/g, '<br>');
            s = s.replace(/\n/g, '<br>');
            return s;
        },
        lfDecode: function(s){
            s = s.replace(/&lt;br&gt;/ig, "\r\n");
            s = s.replace(/<br>/ig, "\r\n");
            return s;
        },
        getField: function(){
            if(this.cfg.editable == "1"){
                return this.$el.find('textarea')
            }else{
                return this.$el.find('input')
            }
        },
        getValue: function(){
            if(this.cfg.editable == "1"){
                return this.lfEncode(this.getField().val());
            }else{
                return this.$el.find('input').val();
            }
        },
        bindCalc: function(instances, rule, result, reminder){
            var self   = this,
                $input = this.getField(),
                ret = [];
            ret.push(instances);
            ret.push(rule);
            ret.push(result);
            ret.push(reminder);
            if(self.cfg.editable == "1"){
                $input.bind("keyup paste _calced", function(){
                	var flag = self.validate_num();
                    flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                });
            }else{
                $input.bind("_calced", function(){
                	var flag = self.validate_num();
                    flag && self.cfg.listManager.get('wrapper').trigger('calc', ret);
                });
            }
        }
    });
    exports.RTextAreaField = window.RTextAreaField = RTextAreaField;
});
define('RRawField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RRawField = RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em style="font-size:16px;"><%=colname%>:</em>\
  <div class="field">\
    <input value="<%=colvalue%>" name="<%=id%>" type="hidden" />\
  </div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        initialized: function(){
        }
    });
    exports.RRawField = window.RRawField = RRawField;
});
