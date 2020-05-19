
    (function($){
        $(document).ready(function(){

            var treeData = '';

            var parentTreeSign = false;
            
            var columnEditInfo = [];
            
            var editParams = {};
            
            var columnManage = {
                init:function(){
                    this.typeRenderList();
                    this.handleLogic();
                },
                //返回门户管理
                backPortalManage:function(){
                    window.location.href = 'index.php';
                },
                //获取地址栏数据
                GetQueryString:function(name){
                    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if(r!=null){
                        return unescape(r[2]);
                    }else{
                        return null;
                    }
                },
                //层级计算
                findLevelByKey:function(key, treeData){

                    var traverseBF = function(treeData, callback){
                        var myData = JSON.parse(JSON.stringify(treeData));
                        for(var i=0;i<myData.length;i++){
                            myData[i].level = 1;
                        }
                        var queue = myData;
                        var currentNode = queue.shift();
                        while (currentNode) {
                            if (currentNode.children) {
                                for(var i=0;i<currentNode.children.length;i++){
                                    currentNode.children[i].level = currentNode.level + 1;
                                    queue.push(currentNode.children[i]);
                                }
                            }
                            callback(currentNode);
                            currentNode = queue.shift();
                        }
                    }
                    var level;
                    traverseBF(treeData, function(currentNode){
                        if (key === currentNode.key) {
                            level = currentNode.level;
                        }
                    })
                    //level 从1开始 
                    return level;
                },
                //新老门户渲染校验
                typeRenderList:function(){
                    var _this = this;
                    if(_this.GetQueryString('is_new')==1){
                        _this.columnList();
                    }else{
						$('.column_explain').removeClass('hide');
                        _this.oldColumnList();
                    }
                },
                //新门户列表请求
                columnList:function(){
                    
                    var _this = this;
                    var params = {
                        portal_id:_this.GetQueryString('portal_id')
                    }
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/columnmanagement',
                        data:params,
                        success:function(res){
                            if(res[0].status==1){
                                var treeData = $.extend(true,[],res[0].tree);
                                if(res[0].data_info!=null){
                                    //深拷贝
                                    var columnListInfo = $.extend(true,[],res[0].data_info);
                                    for(var i = 0;i<columnListInfo.length;i++){
                                        columnListInfo[i].nav_flag==1?columnListInfo[i].nav_flag = '是':columnListInfo[i].nav_flag = '/';
                                        switch(columnListInfo[i].link_target){
                                            case '1':
                                                columnListInfo[i].link_target = '当前窗口';
                                            break;
                                            case '2':
                                                columnListInfo[i].link_target = '新窗口';
                                            break;
                                            case '3':
                                                columnListInfo[i].link_target = '弹出窗口';
                                            break;
                                            default:
                                                columnListInfo[i].link_target = '父窗口';
                                            break; 
                                        }

                                        columnListInfo[i].level = _this.findLevelByKey(columnListInfo[i].page_id,treeData);
                                        columnListInfo[i].is_old = 0;
                                    }
                                    // console.log(columnListInfo);
                                    _this.templateShow({columnListInfo:columnListInfo});
                                }else{
                                    _this.templateShow({columnListInfo:[]});
                                }
                                
                            }

                        },
                        error:function(error){
                            
                            alert('获取栏目列表失败');
                        }

                    })
                },
                //老门户栏目列表渲染
                oldColumnList:function(){
                    var _this = this;
                    var params = {
                        portal_id:_this.GetQueryString('portal_id'),
                        template_id:_this.GetQueryString('t_id')
                    }
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/columnmanagementold',
                        data:params,
                        success:function(res){
                            // return;
                            if(res[0].status==1){
                                var treeData = $.extend(true,[],res[0].tree);
                                if(res[0].data_info!=null){
                                    //深拷贝
                                    var columnListInfo = $.extend(true,[],res[0].data_info);
                                    for(var i = 0;i<columnListInfo.length;i++){
                                        columnListInfo[i].nav_flag==1?columnListInfo[i].nav_flag = '是':columnListInfo[i].nav_flag = '/';
                                        switch(columnListInfo[i].link_target){
                                            case '1':
                                                columnListInfo[i].link_target = '当前窗口';
                                            break;
                                            case '2':
                                                columnListInfo[i].link_target = '新窗口';
                                            break;
                                            case '3':
                                                columnListInfo[i].link_target = '弹出窗口';
                                            break;
                                            default:
                                                columnListInfo[i].link_target = '父窗口';
                                            break; 
                                        }

                                        columnListInfo[i].level = _this.findLevelByKey(columnListInfo[i].page_id,treeData);
                                        columnListInfo[i].is_old = 1;
                                    }
                                    // console.log(columnListInfo);
                                    _this.templateShow({columnListInfo:columnListInfo});
                                }else{
                                    _this.templateShow({columnListInfo:[]});
                                }
                                
                            }

                        },
                        error:function(error){
                            
                            alert('获取栏目列表失败');
                        }

                    })
                },
                //渲染模板
                templateShow:function(data){

                    $('#columnSortable').html($("#column_tpl").tmpl(data));

                },
                //修改启用状态
                changeStatus:function(id){
                    var _this = this;
                    
                    var params = {
                        portal_id:_this.GetQueryString('portal_id'),
                        column_id:id,
						template_id:_this.GetQueryString('t_id')
                    }

					
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/setcolumnuseflag',
                        data:params,
                        success:function(res){
                            if(res[0].status==1){
								if(_this.GetQueryString('is_new')==1){
									_this.columnList();
								}else{
									_this.oldColumnList();
								}
                            }else{
                                alert('修改栏目启用状态失败');
                            }
                        },
                        error:function(){
                            alert('修改栏目启用状态失败');
                        }
                    })
                },
                //显示关闭栏目编辑拟态框
                editModalShow:function(id){
                    $('#editModal').modal('show')
                    parentTreeSign = false;
                    var _this = this;
                    if(_this.GetQueryString('is_new')==1){
                        _this.getColumnEditInfo(id)
                    }else{
                        _this.getOldColumnEditInfo(id);
                    }
                    
                },
                editModalHide:function(){
                    $('#editModal').modal('hide')
                },
                //渲染编辑模板
                editTpl:function(data){
                    $('#edit_box').html($('#column_edit').tmpl(data));
                },
                //获取栏目编辑数据
                getColumnEditInfo:function(id){
                    var _this = this; 
                    var params = {
                        portal_id:_this.GetQueryString('portal_id'),
                        column_id:id
                    }
                    
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/columnedit',
                        data:params,
                        success:function(res){
                            if(res[0].status==1){
                                var treeData = $.extend(true,[],res[0].data_info[0].tree);
                                var firstObj = {
                                    isUsed:true,
                                    label:"",
                                    key:"",
                                    state:"opened:true",
                                    value:"",
                                    id:"1"
                                };

                                columnEditInfo = $.extend(true,[],res[0].data_info);
                                columnEditInfo[0].level = _this.findLevelByKey(columnEditInfo[0].page_id,treeData);
                                _this.editTpl(columnEditInfo);
                                _this.renderRadio(res[0].data_info[0]);
                                var treeData = _this.filterTreeData(columnEditInfo[0].page_id,columnEditInfo[0].tree);
                                treeData= JSON.parse(JSON.stringify(treeData).replace(/key/g,"id").replace(/label/g,'text'));
                                treeData.unshift(firstObj);
                                editParams = $.extend(true,{},res[0].data_info[0]);
                                editParams.portal_id = _this.GetQueryString('portal_id');
                                if(editParams.page_id === '0'){
                                    $('input[name=status]').attr('disabled',true);
                                    $('#parentInp').addClass('parentMask');
                                    $('#parentIcon').addClass('parentMask');
                                    $("#parentInp").removeAttr("onclick");
                                    $('#open_li').addClass('hide');
                                    $('#status_li').addClass('hide');
                                }
                                delete editParams.tree;
                                $('#parentTree').jstree({ 'core' : {  
                                    'data' : treeData
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
                                    ] }
                                );
                                $('#parentTree').bind("activate_node.jstree", function (obj, e) {
                                    
                                    editParams.p_column_name = e.node.text;
                                    editParams.p_column_no = e.node.id;
                                    $('#parentText').text(e.node.text);
                                    parentTreeSign = false;
                                    _this.parentTree();
                                }); 
                            }else{
                                alert('获取栏目编辑数据失败');
                            }
                        },
                        error:function(){
                            alert('获取栏目编辑数据失败');
                        }
                    })
                },
                //老门户获取栏目编辑数据
                getOldColumnEditInfo:function(id){
                    var _this = this; 
                    var params = {
                        portal_id:_this.GetQueryString('portal_id'),
                        template_id:_this.GetQueryString('t_id'),
                        column_id:id
                    }

                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/columneditold',
                        data:params,
                        success:function(res){
                            if(res[0].status==1){
                                var tree = $.extend(true,[],res[0].data_info[0].tree);
                                var firstObj = {
                                    isUsed:true,
                                    label:"",
                                    key:"",
                                    state:"opened:true",
                                    value:"",
                                    id:"1"
                                };
                                columnEditInfo = $.extend(true,[],res[0].data_info);
                                columnEditInfo[0].level = _this.findLevelByKey(columnEditInfo[0].page_id,tree);
                                _this.editTpl(columnEditInfo);
								if(columnEditInfo[0].msg!=''){
									$('#relation_run').removeClass('hide');
								}
								
                                _this.renderRadio(res[0].data_info[0]);
                                var treeData = _this.filterTreeData(columnEditInfo[0].page_id,columnEditInfo[0].tree);
                                treeData= JSON.parse(JSON.stringify(treeData).replace(/key/g,"id").replace(/label/g,'text'));
                                treeData.unshift(firstObj);
                                editParams = $.extend(true,{},res[0].data_info[0]);
                                editParams.portal_id = _this.GetQueryString('portal_id');
                                if(editParams.page_id === '0'){
                                    $('input[name=status]').attr('disabled',true);
                                    $('#parentInp').addClass('parentMask');
                                    $('#parentIcon').addClass('parentMask');
                                    $("#parentInp").removeAttr("onclick");
                                    $('#open_li').css('dispaly','none');
                                    $('#status_li').css('dispaly','none');
                                }
                                delete editParams.tree;
                                $('#parentTree').jstree({ 'core' : {  
                                    'data' : treeData
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
                                    ] }
                                );
                                $('#parentTree').bind("activate_node.jstree", function (obj, e) {
                                    editParams.p_column_name = e.node.text;
                                    editParams.p_column_no = e.node.original.column_no;

                                    $('#parentText').text(e.node.text);
                                    parentTreeSign = false;
                                    _this.parentTree();
                                }); 
                            }else{
                                alert('获取栏目编辑数据失败');
                            }
                        },
                        error:function(){
                            alert('获取栏目编辑数据失败');
                        }
                    })
                },
                //单选修改
                radioChange:function(value,key){
                    switch(key){
                        case 'nav_flag':
                            editParams.nav_flag = value;
                            break;
                        case 'column_type':
                            editParams.column_type = value;
                            break;
                        case 'link_target':
                            editParams.link_target = value;
                            break;
                        case 'use_flag':
                            editParams.use_flag = value;
                            break;
                        default:
                            return;
                    }
                },
                //单选渲染
                renderRadio:function(obj){
                    obj.nav_flag==1?$("input[name='nav_flag']").eq(0).attr('checked',true):$("input[name='nav_flag']").eq(1).attr('checked',true);
                    
                    $("input[name='content']").eq(obj.column_type).attr('checked',true);
                
                    $("input[name='open']").eq(obj.link_target-1).attr('checked',true);
                    
                    obj.use_flag==1?$("input[name='status']").eq(0).attr('checked',true):$("input[name='status']").eq(1).attr('checked',true);
                },
                //父级筛选
                filterTreeData:function(pageId, data){
                    var getMaxDepthByKey = function(key, treeData){
                        // console.log(key,treeData);
                        //返回treeData中 当前项的最大深度 
                        var ans = {};
                        function collectDepth(treeData) {

                            for(var i = 0;i<treeData.length;i++){
                                getDepth(treeData[i]);
                            }
                            function getDepth(obj) {
                                // if (obj.hasOwnProperty('children')) {
                                if (obj.children) {
                                    ans[obj.key] = 0;
                                    for (var i=0;i<obj.children.length;i++){
                                        ans[obj.key] = Math.max(ans[obj.key], getDepth(obj.children[i]) + 1);
                                    }
                                    return ans[obj.key];
                                }else{
                                    ans[obj.key] = 0;
                                    return 0;
                                }
                            };
                        };
                        collectDepth(treeData);
                        return ans[key];
                    };
                    //返回一个去掉自己及子项的数组   --更改需求后需要对其再次过滤 
                    var filterDataByKey = function(dataSource, filterKey){
                        // var myData = JSON.parse(JSON.stringify(dataSource));
                        var myData = $.extend(true,[],dataSource);
                        var loop = function(data, key, callback){

                            for(var i=0;i<data.length;i++){
                                if(data[i].key === key) {
                                    callback(data[i], i, data);
                                    continue;
                                }
                                if(data[i].children) {
                                    loop(data[i].children, key, callback);
                                    continue;
                                }

                            }
                        };
                        loop(myData, filterKey, function(item, index, arr){
                            arr.splice(index, 1);
                            
                        });
                        return myData;
                    };
                    var filterTreeDataByMaxDepth = function(maxDepth, data){
                        var deleteChildrenLevel = 2 - maxDepth;
                        if (deleteChildrenLevel === 0) {
                            return [];
                        }
                        var _data = JSON.parse(JSON.stringify(data))
                        var _loop = function(data, callback){
                            for(var i=0;i<data.length;i++){
                                callback(data[i], i, data);
                                if (data[i].children) {
                                    _loop(data[i].children, callback);
                                }
                            }
                        };
                        _loop(_data, (function(item, index, arr){
                            if (findLevelByKey(item.key, _data) === deleteChildrenLevel) {
                                item.children ? delete item.children : null;
                            }
                        }))
                        return _data;
                    }
                    var findLevelByKey = function(key, treeData){
                        var traverseBF = function(treeData, callback){
                            var myData = JSON.parse(JSON.stringify(treeData));
                            for(var i=0;i<myData.length;i++){
                                myData[i].level = 1;
                            }
                            var queue = myData;
                            var currentNode = queue.shift();
                            while (currentNode) {
                                if (currentNode.children) {
                                    for(var i=0;i<currentNode.children.length;i++){
                                        currentNode.children[i].level = currentNode.level + 1;
                                        queue.push(currentNode.children[i]);
                                    }
                                }
                                callback(currentNode);
                                currentNode = queue.shift();
                            }
                        }
                        var level;
                        traverseBF(treeData, function(currentNode){
                            if (key === currentNode.key) {
                                level = currentNode.level;
                            }
                        })
                        //level 从1开始 
                        return level;
                    }
                    return filterTreeDataByMaxDepth(getMaxDepthByKey(pageId, data), filterDataByKey(data, pageId))
                },
                //父级树的显示隐藏
                parentTree:function(){
                    if(!parentTreeSign){
                        $('#parentTree').addClass('hide');
                    }else{
                        $('#parentTree').removeClass('hide');
                    }
                },
                //点击外部隐藏树
                handleLogic:function(){
                    var _this = this;
                },
                //计算字符长度
                strLen:function(str){
                    var len = 0;  
                    for (var i=0; i<str.length; i++) {   
                        var c = str.charCodeAt(i);   
                        //单字节加1   
                        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
                            len++;   
                        }   
                        else {   
                            len+=2;   
                        }   
                    }   
                    return len;
                },
                //提交编辑
                submitEdit:function(){
                    var _this = this;
                    editParams.column_name = $('#column_name').val();
                    editParams.is_new = _this.GetQueryString('is_new');
                    if($.trim(editParams.column_name) === ''){
                        alert('栏目名称不能为空');
                        return;
                    }
                    
                    if(editParams.column_name.length>20){
                        alert('栏目名称不超过20个字符');
                        return;
                    }

                    
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/columnupdate',
                        data:editParams,
                        success:function(res){
                            if(res[0].status==1){
                                if(_this.GetQueryString('is_new')==1){
                                    _this.columnList();
                                }else{
                                    _this.oldColumnList();
                                }
                            }else{
                                alert('栏目编辑数据失败');
                            }
                        },
                        error:function(){
                            alert('栏目编辑数据失败');
                        }
                    })
                    _this.editModalHide();
                },
                parentNameHandle:function(event){
                    var _this = this;
                    parentTreeSign = !parentTreeSign;
                    _this.parentTree();
                    event.stopPropagation();
                }

            }

            
            columnManage.init();
            window.columnManage = columnManage;
        });
    })(jQuery);