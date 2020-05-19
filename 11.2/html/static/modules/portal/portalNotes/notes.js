
    (function($){
        $(document).ready(function(){
        
            
            
            var delArr = [];
            
            var listParams = {};
            
            var delParams = {};

            var logManage = {
                init:function(){
                    this.getTreeInfo()

                },
                //获取树的数据
                getTreeInfo:function(){
                    var _this = this;
                    $('#portalTree').jstree({
                        'core': {
                            'data': 
                            {   //后台请求到的渲染数据
                                'url':'/general/appbuilder/web/portal/portalcontents/getcolumns', //请求数据地址
                                'dataType': "json", //请求数据的类型
                                'data': function (node) { //请求参数
                                    if(node.id=='#'){
                                        return {'portal_id':0,'is_new':'','portal_name':'','priv_manage':'0'};
                                    }else{
                                        return {'portal_id':node.original.portal_id,'is_new':node.original.is_new,'portal_name':node.text,'priv_manage':'0'};
                                    }
                                }
                            }
                        },
                        'types': {                         //这里就是图片的显示格式
                            // "default": {
                            //     "icon": "fa fa-folder tree-item-icon-color icon-lg"
                            // },
                            "file": {
                                "icon": "fa fa-file tree-item-icon-color icon-lg"
                            }
                        },
                        'plugins': [                       //插件，下面是插件的功能
                            'types',                      //可以设置其图标，在上面的一样
                            // 'contextmenu',                //文本菜单
                            'wholerow',                   //
                            // 'unique'                      //独特----防止重复。(新添加的)
                        ]
                    });
                    $('#portalTree').bind("activate_node.jstree", function (obj, e) {
                        $('#welcome').addClass('hide');
                        $('.logs_table_box').removeClass('hide');
                        if(e.node.parents[0]!='#'){
                            listParams.portal_id = e.node.original.portal_id;
                            delParams.portal_id = e.node.original.portal_id;
                            listParams.column_id = e.node.original.column_id;
                            delParams.column_id = e.node.original.column_id;
                        }else{
                            listParams.portal_id = e.node.original.portal_id;
                            delParams.portal_id = e.node.original.portal_id;
                            listParams.column_id = 0;
                            delParams.column_id = 0;
                        }                           
                        $('#beginTime').val('');
                        $('#endTime').val('');
                        $('#searchInp').val('');
                        listParams.type = e.node.original.type;
                        delParams.type = e.node.original.type;
                        listParams.beginTime = '';
                        listParams.endTime = '';
                        listParams.keyWord = '';
                        listParams.pageNo = 1;
                        delParams.pageNo = 1;
                        listParams.pageSize = 10;
                        delParams.pageSize = 10;
                        
                        _this.getListInfo(listParams);
                    });
                    
                },
                //获取列表数据
                getListInfo:function(params){
                    var _this = this;
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portallog/searchportallog',
                        data:params,
                        success:function(res){
                            if(res[0].status == 1){
                                if(res[0].log_keep_time==0){
                                    $('.del_btn').addClass('hide');
                                }else{
                                    $('.del_btn').removeClass('hide');
                                }
                                _this.listRender(res[0]);
                                if(res[0].log_info.length!=0){
                                    $('#checkList').prop('checked',false);
                                    _this.page('page',res[0].pageNo,res[0].pageSize,res[0].total);
                                }else{
                                    _this.page('page',1,1,1);
                                }
                                
                            }else{
                                alert('获取数据失败');
                            }
                            
                        },
                        error:function(){
                            alert('获取数据失败');
                        }
                    })
                },
                //模板渲染
                listRender:function(data){
                    $('#log_tbody').html($("#log_tpl").tmpl(data));
                },
                page:function(id,pageNo,pageSize,total){
                    var _this = this;
                    $("#" + id).bootstrapPaginator({
                        bootstrapMajorVersion: 2,　　// 指定Bootstrap的版本，默认是Boostrap2，如果你用的是Boostrap3，则必须指定该值。
                        currentPage: pageNo,　　// 当前页码
                        totalPages: Math.ceil(total/pageSize),　　// 总页数
                        numberOfPages: 5,　　// 显示页的数量
                        useBootstrapTooltip: true　,　// 使用Bootstrap提示样式
                        itemContainerClass: function (type, page, current) {　　// 应用鼠标的手型光标
                            
                            return (page === current) ? "active" : "pointer-cursor";
                            
                        },
                        onPageChanged: function(event, oldPage, newPage){　　// 页面改变时事件
                            listParams.pageNo = newPage;
                            delParams.pageNo = newPage;
                            
                            _this.getListInfo(listParams);
                        }
                    });
                },
                //单个删除
                delLog:function(id){
                    var _this = this;
                    delParams.beginTime = $('#beginTime').val();
                    delParams.endTime = $('#endTime').val();
                    delParams.keyWord = $('#searchInp').val();
                    delParams.log_id = id.toString();
                    var r=confirm("是否确认删除日志内容")
                    if (r==true){
                        _this.delInterFace(delParams);
                    }else{
                        return ;
                    }
                    
                },
                //批量删除
                delQuery:function(){
                    var _this = this;
                    $("input:checkbox[name=dels]:checked").each(function(index,value){

                        delArr.push($("input:checkbox[name=dels]:checked").eq(index).attr('data-id'))
                    })
                    if(delArr.length==0){
                        alert('请选择要删除的内容');
                        return ;
                    }
                    delParams.beginTime = $('#beginTime').val();
                    delParams.endTime = $('#endTime').val();
                    delParams.keyWord = $('#searchInp').val();
                    delParams.log_id = delArr.toString();
                    var r=confirm("是否确认删除日志内容")
                    if (r==true){
                        _this.delInterFace(delParams);
                    }else{
                        return ;
                    }
                    $('#checkList').attr('checked',false);
                },
                //删除接口
                delInterFace:function(params){
                    var _this = this;
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portallog/dellog',
                        data:params,
                        success:function(res){
                            if(res[0].status == 1){
                                _this.listRender(res[0]);
                                if(res[0].log_info.length!=0){
                                    _this.page('page',res[0].pageNo,res[0].pageSize,res[0].total);
                                }else{
                                    _this.page('page',1,1,1);
                                }
                                
                            }else{
                                alert('获取数据失败');
                            }
                            $('#checkList').attr('checked',false);
                        },
                        error:function(){
                            alert('获取数据失败');
                        }
                    })
                },
                //查询
                searchInfo:function(){
                    var _this = this;
                    listParams.beginTime = $('#beginTime').val();
                    listParams.endTime = $('#endTime').val();
                    listParams.keyWord = $('#searchInp').val();
                    listParams.pageNo = 1;
                    listParams.pageSize = 10;

                    var reg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                    var regExp = new RegExp(reg);
                    
                    if(!regExp.test(listParams.beginTime)&& listParams.beginTime != ''){
                        alert("日期格式不正确，正确格式为：2018-01-01");	
                        return ;
                    }

                    if(!regExp.test(listParams.endTime)&& listParams.endTime != ''){
                        alert("日期格式不正确，正确格式为：2018-01-01");	
                        return ;
                    }
                    

                    _this.getListInfo(listParams);
                },
                checkAll:function(ele,event){
                    var checkboxs = document.getElementsByName('dels');

                    if(ele.prop('checked')){
                        $("input:checkbox[name=dels]").prop('checked',true);
                    }else{
                        $("input:checkbox[name=dels]").prop('checked',false);
                    }

                    delArr = [];
                },
                allDel:function(){
                    if($("input:checkbox[name=dels]:checked").length == $("input:checkbox[name=dels]").length){

                        $('#checkList').prop('checked',true);
                    }else{

                        $('#checkList').prop('checked',false);
                    }

                    delArr = [];
                    
                }
            }
            logManage.init();
            window.logManage = logManage;
        });
    })(jQuery);
