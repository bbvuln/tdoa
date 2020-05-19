define('TDataSelectionCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TDataSelectionCtrl = Base.extend({
        initialize: function(config) {
            TDataSelectionCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("."+config.parentid).find('.group-fields');
            this.initField(config);
            this.bindEvent();
        },
		initField: function(config) {
            var self = this;
            var html = self.parseHtml(config);
            this.$wrapper.append(html);
            this.$obj = $('[name="'+config.id+'"]').eq(0);
            this.$config = config;
            this.id = config.id;
            this.title = config.title;
            this.low_id = config.id.toLowerCase();
            this.desc = config.desc;
            this.searchTimeout = null;
            this.page = 1;
            this.totalPage = 1;
            this.searchFlag = false;
            this.searchParams = {};
        },
		parseHtml: function(d){
            var tplHTML = '<% if(data_type != 1){ %>'+
                                '<div class="read_detail '+
                                   'WriteDiv'+
                                   ' tag-input">'+
                                   '<em><%=title%>��</em><div class="field">'+
                                   '<button class="ui-btn ui-btn-primary"   type="button"  name="<%=id%>" align="left" title="<%=title%>" data-id="<%=id%>">ѡ��</button>'+
                                   '<div class="typeTip"></div></div></div>'+
                                 '<% }%>';
			return $.tpl(tplHTML,d);
		},
        refresh:function(fn1,fn2){
            var self = this;
            if(currMobileDataSelectedSelf && currMobileDataSelectedSelf.low_id === self.low_id) {
                $('#dataselectList').off('touchend');
                $('#dataselectList').on('touchend',function () {
                    var scrollTop = $('#wrapper_data_select').scrollTop();    //���������붥���ĸ߶�
                    var scrollHeight = $('#searchDataSelectList').height();   //��ǰҳ����ܸ߶�
                    var clientHeight = $('#wrapper_data_select').height();    //��ǰ���ӵ�ҳ��߶�
                    if(scrollTop + clientHeight >= scrollHeight  && clientHeight <= scrollHeight){
                        if(currMobileDataSelectedSelf && currMobileDataSelectedSelf.getDatasByPage){
                            if(self.page < self.totalPage){
                                currMobileDataSelectedSelf.getDatasByPage(self.page+1);
                            }
                        }
                    }else if(scrollTop === 0  && clientHeight <= scrollHeight){
                    //���������붥���ĸ߶�С�ڵ���0
                        if(currMobileDataSelectedSelf && currMobileDataSelectedSelf.getDatasByPage){
                            if(self.page == 1 && self.totalPage == 1) {

                            }else{
                                currMobileDataSelectedSelf.getDatasByPage(1);
                            }
                        }
                    }
                });
            }
        },
        // refreshByMenu:function(){
        //     var self = this;
        //     if(currMobileDataSelectedSelf && currMobileDataSelectedSelf.low_id === self.low_id) {
        //         $('#dataselectListByMenu').off('touchend');
        //         $('#dataselectListByMenu').on('touchend',function () {
        //             var scrollTop = $('#dataselectListByMenu').scrollTop();    //���������붥���ĸ߶�
        //             var scrollHeight = $('#dataselectListByMenuList').height();   //��ǰҳ����ܸ߶�
        //             var clientHeight = $('#dataselectListByMenu').height();    //��ǰ���ӵ�ҳ��߶�
        //             console.log(scrollTop,clientHeight,scrollHeight);
        //             // if(scrollTop + clientHeight >= scrollHeight  && clientHeight <= scrollHeight){
        //             //     if(currMobileDataSelectedSelf && currMobileDataSelectedSelf.getDatasByPage){
        //             //         if(self.page < self.totalPage){
        //             //             currMobileDataSelectedSelf.getDatasByPage(self.page+1);
        //             //         }
        //             //     }
        //             // }else if(scrollTop === 0  && clientHeight <= scrollHeight){
        //             // //���������붥���ĸ߶�С�ڵ���0
        //             //     if(currMobileDataSelectedSelf && currMobileDataSelectedSelf.getDatasByPage){
        //             //         if(self.page == 1 && self.totalPage == 1) {
        //             //
        //             //         }else{
        //             //             currMobileDataSelectedSelf.getDatasByPage(1);
        //             //         }
        //             //     }
        //             // }
        //         });
        //     }
        // },
		bindEvent: function(){
			var self = this;
			var params = {
				data_table: this.$config.data_table,
				data_type:this.$config.data_type,
				data_field:this.$config.data_field,
				data_fld_name:this.$config.data_fld_name,
				data_control:this.$config.data_control,
				data_query:this.$config.data_query,
				uid:this.$config.uid
			}

			$("[data-id='"+ this.id +"']").tap(function(){
                currMobileDataSelectedSelf = self;
                self.searchParams = {};
                currMobileDataSelectedSelf.checkSearch();
                currMobileDataSelectedSelf.getDatasByPage(1);
                self.refresh();
			})

			$('body').delegate('.data_select_add', 'click', function(){
				var $this = $(this)
				var index = $this.attr('data-index')
				return false
			})

            //�������ѡ��״̬
            $('#dataselection_container,#dataselectList,#dataselectListByMenu').on('tap','.u-list-wrapper-right',function() {
                var selfs =  $(this).prev('.u-list-wrapper-left').find('input').eq(0);
                selfs.prop('checked','checked')
                selfs.attr('checked','checked')
                event.stopPropagation();
                event.preventDefault();
            })

            //��ѡ��չ��������
            $('#dataselection_container,#dataselectList,#dataselectListByMenu').on('tap','.u-list-arrow-down',function() {
                var val =  $(this).closest('.u-list-content-wrapper');
                val.css("background-color","#fff");
                val.css("height","auto");
                $(this).hide();
                $(this).siblings('.u-list-arrow-up').show();
                event.stopPropagation();
                event.preventDefault();
            })
            //��ѡ��չ��������
            $('#dataselection_container,#dataselectList,#dataselectListByMenu').on('tap','.u-list-arrow-up',function() {
                var val =  $(this).closest('.u-list-content-wrapper');
                val.css("background-color","#fff");
                val.css("height","68px");
                $(this).hide();
                $(this).siblings('.u-list-arrow-down').show();
                event.stopPropagation();
                event.preventDefault();
            })
            //��ť��ʽȷ��
            $('#dataselectList').on('tap','#dataSelectBtnOk',function(){
                var val =  $("#dataselectList input[name='dataSelectedRadio']:checked").data("value");
                if(val){
                    val = JSON.parse(val.replace(/'/g,"\""));
                    self.callInput(val);
                    currMobileDataSelectedSelf.low_id === self.low_id?history.back():null;
                }else{
                    showMessage("��ѡ������һ�");
                }
            })
            //��ť��ʽȡ��
            $('#dataselectList').on('tap','#dataSelectBtnCancel',function(){
               currMobileDataSelectedSelf.low_id === self.low_id?history.back():null;
            })


            //Ŀ¼��ʽȷ��
            $('#dataselectListByMenu').on('tap','#dataSelectBtnOkByMenu',function(){
                var val =  $("#dataselectListByMenuList input[name='dataSelectedRadio']:checked").data("value");
                if(val){
                    val = JSON.parse(val.replace(/'/g,"\""));
                    self.callInput(val);
                    currMobileDataSelectedSelf.low_id === self.low_id?history.back():null;
                }else{
                    showMessage("��ѡ������һ�");
                }
            })
            //Ŀ¼��ʽ�ؼ��� ���������ı仯
            $('#dataselectListByMenu').on('keyup','#dataselectListByMenuInput',function(){
                clearTimeout(self.searchTimeout);
                if(currMobileDataSelectedSelf.low_id === self.low_id){
                    self.searchTimeout = setTimeout(function() {
                         // self.refreshByMenu();
                         self.getDatasByMenuPage(1)
                    }, 800);
                }
            })

            //���ȷ��������ť
            $('.ui-data-select-search-panel-wrapper').on('tap','#newDataSelectBtnOk',function(){
                if (currMobileDataSelectedSelf.low_id === self.low_id) {
                    var val =  $('#dataSelectSearchList input');
                    var valObj = {};
                    $.each(val, function(key, value){
                        var name = $(this).attr('name').toUpperCase();
                        var value = $(this).val();
                        valObj[name]=value;
                    });
                    self.postSearchData(valObj);
                }
            })
            //���ȡ��������ť
            $('.ui-data-select-search-panel-wrapper').on('tap','#newDataSelectBtnCancel',function(){
				currMobileDataSelectedSelf.low_id === self.low_id?goOutToDataSelectionSearchPanel():null;
            })

		},
        getDatasByMenuPage:function(page) {
            var self = this;
            var key = self.$config.keyItemStr[currMobileDataSelectedMenu];
            var tbl = self.$config.data_table;
            var item_str = self.$config.data_field;
            var term = $('#dataselectListByMenuInput').val();
            $.ajax({
                type: 'GET',
                url:'/general/approve_center/list/input_form/get_auto_data.php',
                cache: false,
                timeout:10000,
                data: {
                    'key': key,
                    'tbl': tbl,
                    'item_str': item_str,
                    'i':1,
                    'term':term
                },
            beforeSend:function(xhr, settings) {
               $.ProLoading.show('������...');
            },
            success: function(ret) {
                if(ret){
                   var data = JSON.parse(ret);
                   if(data.length){
                       var rows = data.rows;
                       var titleArr = [];
                       var nameArr = [];
                       var lowertitleArr = [];
                       var dataArr = [];
                       var nameTmpArr = [];
                       titleArr = self.$config.data_field_name.split('`');
                       nameArr = self.$config.data_control.split('`');
                       lowertitleArr = self.$config.data_field.split('`');
                       titleArr.pop();
                       nameArr.pop();
                       lowertitleArr.pop();

                       $.each(data,function(i, elem){
                           var tmpObj = {};
                           var titleObj = {};
                           $.each(titleArr,function(n, item ) {
                               tmpObj[item] = elem.value_str.split('`')[n];
                               titleObj[nameArr[n]] = elem.value_str.split('`')[n];
                           })
                           dataArr.push(tmpObj)
                           var str = JSON.stringify(titleObj).replace(/"/g,"'");
                           nameTmpArr.push(str)
                       })
                       var datas = {};
                       datas.data = dataArr;
                       datas.name = nameTmpArr;
                       $("#dataselectListByMenuList").html('').html(self.setModalHtml(datas));
                       $('#dataSelectBtnOkByMenu').removeClass('disabled');
                   }else{
                       $("#dataselectListByMenuList").html('').html('<li class="ui-border-t"><div class="ui-list-info ui-border-t fixed-h no_list_info">��������</div></li>');
                       $('#dataSelectBtnOkByMenu').addClass('disabled');
                   }
                   $.ProLoading.hide();
               }else{
                   $("#dataselectListByMenuList").html('').html('<li class="ui-border-t"><div class="ui-list-info ui-border-t fixed-h no_list_info">��������</div></li>');
                   $('#dataSelectBtnOkByMenu').addClass('disabled');
                   console.log(ret);
                   $.ProLoading.hide();
               }
            },
            error: function(data) {
               console.log('error',data)
               $.ProLoading.hide();
            }
            });
        },
        checkSearch:function () {
            var self = this;
            var searchFlag = self.$config.data_query;
            if(searchFlag) {
                $('#dataselectList').removeClass('dataset-noquery-active')
            } else {
                $('#dataselectList').addClass('dataset-noquery-active')
            }

        },
        getDatasByPage:function(page) {
            var self = this;
            var searchdata = self.searchParams;
            var datas = {
                "dataSrc": self.$config.data_src,
                "dataSrcName": null,
                "data_control": self.$config.data_control,
                "datadbid": null,
                "dataField": self.$config.data_field,
                "dataFieldName": self.$config.data_field_name,
                "type": self.$config.data_type,
                "dataQuery": self.$config.data_query,
                "LIST_VIEW":null,
                "_search": false,
                "nd": null,
                "rows": null,
                "page": page,
                "sidx":null,
                "sord": "asc"
            };
            var newObj = $.extend(true, {}, datas ,searchdata);
            $.ajax({
                type: 'GET',
                url: '/general/approve_center/list/input_form/getdata.php',
                cache: false,
                data: newObj,
                beforeSend:function(xhr, settings) {
                    $.ProLoading.show('������...');
                },
                success: function(ret) {
                    // $("#searchDataSelectList").html('');
                    $("#dataselectListByMenuInput").val('');
                    pageTo("dataselectList");
                    var data = JSON.parse(ret);
                    var rows = data.rows;
                    self.page = parseInt(data.page);
                    self.totalPage = parseInt(data.total);
                    var titleArr = [];
                    var nameArr = [];
                    var lowertitleArr = [];
                    var dataArr = [];
                    var nameTmpArr = [];
                    titleArr = self.$config.data_field_name.split('`');
                    nameArr = self.$config.data_control.split('`');
                    lowertitleArr = self.$config.data_field.split('`');
                    titleArr.pop();
                    nameArr.pop();
                    lowertitleArr.pop();

                    $.each(rows,function(i, elem){
                        var tmpObj = {};
                        var titleObj = {};
                        $.each(titleArr,function(n, item ) {
                            tmpObj[item] = elem.cell[n];
                            titleObj[nameArr[n]] = elem.cell[n];
                        })
                        dataArr.push(tmpObj)
                        var str = JSON.stringify(titleObj).replace(/"/g,"'");
                        nameTmpArr.push(str)
                    })
                    var datas = {};
                    datas.data = dataArr;
                    datas.name = nameTmpArr;
                    if(self.page === 1) {
                        if (rows.length > 0 ) {
                            $("#searchDataSelectList").html('').html(self.setModalHtml(datas));
                            $('#wrapper_data_select').scrollTop(2);
                        }else{
                            $("#searchDataSelectList").html('').html('<li class="ui-border-t"><div class="ui-list-info ui-border-t fixed-h no_list_info">��������</div></li>');
                        }
                    } else {
                        $("#searchDataSelectList").append(self.setModalHtml(datas));
                    }
                    $.ProLoading.hide();
                },
                error: function(res) {
                    console.log('error')
                    $.ProLoading.hide();
                }
            });
        },
		setModalHtml: function(d){
			var tplHTML =
                        '<% for(var m=0;m<data.length;m++){ %>'+
                            '<div class="u-list-content-wrapper">'+
                                '<div class="u-list-contents-lists">'+
                                        '<div class="u-list-wrapper-left ui-checkbox"><input type="radio" name="dataSelectedRadio" data-value=<%=JSON.stringify(name[m])%> /></div>'+
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
                                '<div  class="u-list-arrow-down"><img style="width:12px;height:12px;" src="/static/mobile/style/frozen/img/arr-down.png"  alt="չ��" /></div>'+
                                '<div style="display:none;" class="u-list-arrow-up"><img style="width:12px;height:12px;" src="/static/mobile/style/frozen/img/arr-up.png"  alt="����" /></div>'+
                            '</div>'+
                        '<% } %>';
			return $.tpl(tplHTML,d);
		},
        setSearchData: function() {
            var self = this;
            var queryField = self.$config.query_field;
            var queryFldName = self.$config.query_fld_name;
            var titleArr = [];
            var nameArr = [];
            titleArr = queryField.split('`');
            nameArr = queryFldName.split('`');
            var datas = {};
            datas.title = titleArr;
            datas.name = nameArr;
            $("#dataSelectSearchList").html('').html(self.setSearchHtml(datas));
        },
        postSearchData: function(data) {
            var self = this;
            self.searchParams = data;
            self.getDatasByPage(1);
            goOutToDataSelectionSearchPanel();
        },
        getMenuTypeOfMenuData:function() {
            var self = this;
            $.ajax({
                type: 'GET',
                url: '/general/approve_center/list/input_form/getdata.php',
                cache: false,
                data: {
                    "dataSrc": self.$config.data_src,
                    "dataSrcName": null,
                    "data_control": self.$config.data_control,
                    "datadbid": null,
                    "dataField": self.$config.data_field,
                    "dataFieldName": self.$config.data_field_name,
                    "type": self.$config.data_type,
                    "dataQuery": self.$config.data_query,
                    "LIST_VIEW":null,
                    "NAME":null,
                    "_search": false,
                    "nd": null,
                    "rows": null,
                    "page": 1,
                    "sidx":null,
                    "sord": "asc"
                },
                beforeSend:function(xhr, settings) {
                    $.ProLoading.show('������...');
                },
                success: function(ret) {
                    $("#dataselectListByMenuList").html('');
                    // pageTo("dataselectList");
                    var data = JSON.parse(ret);
                    var rows = data.rows;
                    if(rows.length) {
                        var titleArr = [];
                        var nameArr = [];
                        var lowertitleArr = [];
                        var dataArr = [];
                        var nameTmpArr = [];
                        titleArr = self.$config.data_field_name.split('`');
                        nameArr = self.$config.data_control.split('`');
                        lowertitleArr = self.$config.data_field.split('`');
                        titleArr.pop();
                        nameArr.pop();
                        lowertitleArr.pop();
                        $.each(rows,function(i, elem){
                            var tmpObj = {};
                            var titleObj = {};
                            $.each(titleArr,function(n, item ) {
                                tmpObj[item] = elem.cell[n];
                                titleObj[nameArr[n]] = elem.cell[n];
                            })
                            dataArr.push(tmpObj)
                            var str = JSON.stringify(titleObj).replace(/"/g,"'");
                            nameTmpArr.push(str)
                        })
                        var datas = {};
                        datas.data = dataArr;
                        datas.name = nameTmpArr;
                        $("#dataselectListByMenuList").html('').html(self.setModalHtml(datas));
                        $('#dataSelectBtnOkByMenu').removeClass('disabled');
                    }else{
                        $("#dataselectListByMenuList").html('').html('<li class="ui-border-t"><div class="ui-list-info ui-border-t fixed-h no_list_info">��������</div></li>');
                        $('#dataSelectBtnOkByMenu').addClass('disabled');
                    }
                    $.ProLoading.hide();
                },
                error: function(res) {
                    $.ProLoading.hide();
                    console.log('error')
                }
            });
        },
        setSearchHtml:function(d) {
            var tplHTML ='<div>'+
                '<% for(var m=0;m<name.length;m++){ %>'+
                    '<div class="ui-searchbar-wrap focus">'+
                        '<div class="ui-searchbar ui-border-radius">'+
                            '<div class="ui-searchbar-text"></div>'+
                            '<div class="ui-searchbar-input"><input  type="text" placeholder=<%=name[m]%> name=<%=title[m]%> autocapitalize="off"></div>'+
                        '</div>'+
                    '</div>'+
                '<% } %>'+
              '</div>';
            return $.tpl(tplHTML,d);
        },
        callInput: function(data){
            var self = this,
                instances = this.$config.fieldmanager.fieldsInstance;
                try{
                    for(var index in data){
                        if (instances[index]) {
                            instances[index].setValue( index, data[index]);
                        }
                    }
                }catch(e){
                    console.log(e);
                }
        },
		getValue: function(){
			if(this.$config.writable == true){
				return this.getField().val();
			}else{
				return this.getField().text();
			}
		},
        bindCalc: function(){
            var self   = this,
                $input = this.getField();
            $input.bind("_calced", function(){
                self.$config.fieldmanager.trigger('calc');
            });
        },
        getField: function(){
            return $('[title="'+ this.$config.title +'"]').eq(0);
        },
        getData: function(){
            var ret = {};
            ret.name = this.$config.id;
            if(!this.$config.secret){
            	ret.value = this.getValue();
            }
            return ret;
        },
        setValue: function( title, currValue){
            var title = title;//��ǰ�ֶ���
            var self = this;
			try{
				var res = currValue;
				this.getField().text(res);
			}catch(e){
				try{
					var res = currValue;
					this.getField().text(res);
				}
				catch(e){
					console.log('����ѡ��ؼ�����ʧ�ܣ�');
				}
			}
        },
        cancelAlert: function(s){
            var self = this;
            var low_id = this.low_id;
            var str = s;
            self.validation(str);
            setTimeout(function(){
                $("#div_alert_"+low_id+"").removeClass("div_alert_show");
            }, 1000);
        },
        validation: function(s) {
            $("#div_alert_"+this.low_id+"").addClass("div_alert_show");
            $("#div_alert_"+this.low_id+"").html(s);
        }
    });
    exports.TDataSelectionCtrl = window.TDataSelectionCtrl = TDataSelectionCtrl;
});
