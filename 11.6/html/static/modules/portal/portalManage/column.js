
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
                //�����Ż�����
                backPortalManage:function(){
                    window.location.href = 'index.php';
                },
                //��ȡ��ַ������
                GetQueryString:function(name){
                    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if(r!=null){
                        return unescape(r[2]);
                    }else{
                        return null;
                    }
                },
                //�㼶����
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
                    //level ��1��ʼ 
                    return level;
                },
                //�����Ż���ȾУ��
                typeRenderList:function(){
                    var _this = this;
                    if(_this.GetQueryString('is_new')==1){
                        _this.columnList();
                    }else{
						$('.column_explain').removeClass('hide');
                        _this.oldColumnList();
                    }
                },
                //���Ż��б�����
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
                                    //���
                                    var columnListInfo = $.extend(true,[],res[0].data_info);
                                    for(var i = 0;i<columnListInfo.length;i++){
                                        columnListInfo[i].nav_flag==1?columnListInfo[i].nav_flag = '��':columnListInfo[i].nav_flag = '/';
                                        switch(columnListInfo[i].link_target){
                                            case '1':
                                                columnListInfo[i].link_target = '��ǰ����';
                                            break;
                                            case '2':
                                                columnListInfo[i].link_target = '�´���';
                                            break;
                                            case '3':
                                                columnListInfo[i].link_target = '��������';
                                            break;
                                            default:
                                                columnListInfo[i].link_target = '������';
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
                            
                            alert('��ȡ��Ŀ�б�ʧ��');
                        }

                    })
                },
                //���Ż���Ŀ�б���Ⱦ
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
                                    //���
                                    var columnListInfo = $.extend(true,[],res[0].data_info);
                                    for(var i = 0;i<columnListInfo.length;i++){
                                        columnListInfo[i].nav_flag==1?columnListInfo[i].nav_flag = '��':columnListInfo[i].nav_flag = '/';
                                        switch(columnListInfo[i].link_target){
                                            case '1':
                                                columnListInfo[i].link_target = '��ǰ����';
                                            break;
                                            case '2':
                                                columnListInfo[i].link_target = '�´���';
                                            break;
                                            case '3':
                                                columnListInfo[i].link_target = '��������';
                                            break;
                                            default:
                                                columnListInfo[i].link_target = '������';
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
                            
                            alert('��ȡ��Ŀ�б�ʧ��');
                        }

                    })
                },
                //��Ⱦģ��
                templateShow:function(data){

                    $('#columnSortable').html($("#column_tpl").tmpl(data));

                },
                //�޸�����״̬
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
                                alert('�޸���Ŀ����״̬ʧ��');
                            }
                        },
                        error:function(){
                            alert('�޸���Ŀ����״̬ʧ��');
                        }
                    })
                },
                //��ʾ�ر���Ŀ�༭��̬��
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
                //��Ⱦ�༭ģ��
                editTpl:function(data){
                    $('#edit_box').html($('#column_edit').tmpl(data));
                },
                //��ȡ��Ŀ�༭����
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
                                    'types': {                         //�������ͼƬ����ʾ��ʽ
                                        // "default": {
                                        //     "icon": "fa fa-folder tree-item-icon-color icon-lg"
                                        // },
                                        "file": {
                                            "icon": "fa fa-file tree-item-icon-color icon-lg"
                                        }
                                    },
                                    'plugins': [                       //����������ǲ���Ĺ���
                                        'types',                      //����������ͼ�꣬�������һ��
                                        // 'contextmenu',                //�ı��˵�
                                        'wholerow',                   //
                                        // 'unique'                      //����----��ֹ�ظ���(����ӵ�)
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
                                alert('��ȡ��Ŀ�༭����ʧ��');
                            }
                        },
                        error:function(){
                            alert('��ȡ��Ŀ�༭����ʧ��');
                        }
                    })
                },
                //���Ż���ȡ��Ŀ�༭����
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
                                    'types': {                         //�������ͼƬ����ʾ��ʽ
                                        // "default": {
                                        //     "icon": "fa fa-folder tree-item-icon-color icon-lg"
                                        // },
                                        "file": {
                                            "icon": "fa fa-file tree-item-icon-color icon-lg"
                                        }
                                    },
                                    'plugins': [                       //����������ǲ���Ĺ���
                                        'types',                      //����������ͼ�꣬�������һ��
                                        // 'contextmenu',                //�ı��˵�
                                        'wholerow',                   //
                                        // 'unique'                      //����----��ֹ�ظ���(����ӵ�)
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
                                alert('��ȡ��Ŀ�༭����ʧ��');
                            }
                        },
                        error:function(){
                            alert('��ȡ��Ŀ�༭����ʧ��');
                        }
                    })
                },
                //��ѡ�޸�
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
                //��ѡ��Ⱦ
                renderRadio:function(obj){
                    obj.nav_flag==1?$("input[name='nav_flag']").eq(0).attr('checked',true):$("input[name='nav_flag']").eq(1).attr('checked',true);
                    
                    $("input[name='content']").eq(obj.column_type).attr('checked',true);
                
                    $("input[name='open']").eq(obj.link_target-1).attr('checked',true);
                    
                    obj.use_flag==1?$("input[name='status']").eq(0).attr('checked',true):$("input[name='status']").eq(1).attr('checked',true);
                },
                //����ɸѡ
                filterTreeData:function(pageId, data){
                    var getMaxDepthByKey = function(key, treeData){
                        // console.log(key,treeData);
                        //����treeData�� ��ǰ��������� 
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
                    //����һ��ȥ���Լ������������   --�����������Ҫ�����ٴι��� 
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
                        //level ��1��ʼ 
                        return level;
                    }
                    return filterTreeDataByMaxDepth(getMaxDepthByKey(pageId, data), filterDataByKey(data, pageId))
                },
                //����������ʾ����
                parentTree:function(){
                    if(!parentTreeSign){
                        $('#parentTree').addClass('hide');
                    }else{
                        $('#parentTree').removeClass('hide');
                    }
                },
                //����ⲿ������
                handleLogic:function(){
                    var _this = this;
                },
                //�����ַ�����
                strLen:function(str){
                    var len = 0;  
                    for (var i=0; i<str.length; i++) {   
                        var c = str.charCodeAt(i);   
                        //���ֽڼ�1   
                        if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {   
                            len++;   
                        }   
                        else {   
                            len+=2;   
                        }   
                    }   
                    return len;
                },
                //�ύ�༭
                submitEdit:function(){
                    var _this = this;
                    editParams.column_name = $('#column_name').val();
                    editParams.is_new = _this.GetQueryString('is_new');
                    if($.trim(editParams.column_name) === ''){
                        alert('��Ŀ���Ʋ���Ϊ��');
                        return;
                    }
                    
                    if(editParams.column_name.length>20){
                        alert('��Ŀ���Ʋ�����20���ַ�');
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
                                alert('��Ŀ�༭����ʧ��');
                            }
                        },
                        error:function(){
                            alert('��Ŀ�༭����ʧ��');
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