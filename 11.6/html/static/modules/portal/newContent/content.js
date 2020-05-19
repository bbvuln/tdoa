
    (function($){
        $(document).ready(function(){
            
            window.UEDITOR_CONFIG.zIndex = 1100;
            window.UEDITOR_CONFIG.autoHeightEnabled = false;
            $('#right_box').css('min-height',document.documentElement.clientHeight-62);

            setInterval(function(){
                $('#portalTree').css('height',$('#right_box').height()+20);
            },100)

            


            //�б��������
            var listParams = {};
            var delListParams = {};
            //�б�ɾ������
            var listDelArr = [];
            
            //���ͱ�ʶ
            var addInfoType = '';
            //����ʶ
            var is_category_type = '';
            //ժҪ��ʶ
            var is_summary_type = '';
            var imgLiShow = '0';
            //��Ŀ����ʾ��ʶ
            var portalTreeSign = false;
            var editPortalTreeSign = false;
            //link������
            var content_text_box_edit = $('#content_text_box_edit');
            var column_tree_edit = $('#column_tree_edit');
            var link_box_edit = $('#link_box_edit');
            var attachment_box_edit = $('#attachment_box_edit');
            var userName = '';
            //�༭��������
            var editType = '';

            var contentManage = {
                init:function(){
                
                    this.getTreeInfo();
                    this.getPowerShowInfo();
                },
                is_five:false,
                //�ж��Ƿ�Ϊ����Ŀ¼
                is_class_catalogue:false,
                //��ȡȨ����ʾ����
                getPowerShowInfo:function(){
                    var _this = this;
                    
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalcontents/isportalpriv',
                        success:function(res){
                            if(res.status===0){
                                $('#powerBtn').hide();
                            }else{
                                $('#powerBtn').show();
                            }
                        },
                        error:function(){

                        }
                    })
                },
                //��ȡ��������
                getTreeInfo:function(){
                    var _this = this;
                    $('#portalTree').jstree({
                        'core': {
                            'data': 
                            {   //��̨���󵽵���Ⱦ����
                                'url':'/general/appbuilder/web/portal/portalcontents/getcolumns', //�������ݵ�ַ
                                'dataType': "json", //�������ݵ�����
                                'data': function (node) { //�������
                                    if(node.id=='#'){
                                        return {'portal_id':0,'is_new':'','portal_name':'','priv_manage':'0'};
                                    }else{
                                        return {'portal_id':node.original.portal_id,'is_new':node.original.is_new,'portal_name':node.text,'template_id':node.original.template_id,'priv_manage':'0'};
                                    }
                                }
                            }
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
                        ]
                    });
                    $('#portalTree').bind("activate_node.jstree", function (obj, e) {
                        $('#welcome').addClass('hide');
                        if(e.node.original.is_classifycatalog!=undefined&&e.node.original.is_classifycatalog==1){
                            _this.is_class_catalogue = true;
                            $('#open_way_this').addClass('miss');
                            $('#open_way_this_edit').addClass('miss');
                            $('#open_way_new_radio').attr('checked',true);
                        }else{
                            _this.is_class_catalogue = false;
                            $('#open_way_this').removeClass('miss');
                            $('#open_way_this_edit').removeClass('miss');
                            $('#open_way_new_radio').attr('checked',false);
                            $('#open_way_this_radio').attr('checked',true);
                        }
                        if(e.node.parents[0]!='#'){
                            if(e.node.original.is_new=='1'){
                                $('#iframe_box').addClass('hide');
                                $('#right_box').removeClass('hide');
                                if(e.node.original.priv=='1'){
                                    $('#file_table_box').addClass('hide');
                                    $('#noPower').addClass('hide');
                                    $('#portalHandle').addClass('hide');
                                    $('#portalCue').addClass('hide');
                                    $('#searchInp').val('');
                                    if(e.node.original.source=='0'){
                                        $('#content_defined_box').addClass('hide');
                                        $('#content_table_box').removeClass('hide');
                                        if(e.node.original.is_page_push=='0'){
                                            $('#addPush').addClass('hide');
                                            $('#editPush').addClass('hide');
                                        }else{
                                            $('#addPush').removeClass('hide');
                                            $('#editPush').removeClass('hide');
                                        }
                                        
                                        delListParams.column_id = e.node.original.column_id;
                                        delListParams.portal_id = e.node.original.portal_id;
                                        delListParams.type = e.node.original.type;
                                        delListParams.pageNo = 1;
                                        listParams.column_id = e.node.original.column_id;
                                        listParams.portal_id = e.node.original.portal_id;
                                        listParams.keyword = $('#searchInp').val();
                                        listParams.type = e.node.original.type;
                                        listParams.pageNo = 1;
                                        listParams.pageSize = 10;
                                        listParams.portal_name = e.node.original.portal_name;
                                        listParams.is_new = e.node.original.is_new;
                                        listParams.catalogtype = e.node.original.catalogtype;
                                        _this.getContentListInfo(listParams);
                                        $('input[name=portal_id]').val(e.node.original.portal_id);
                                        $('input[name=column_id]').val(e.node.original.column_id);
                                        $('input[name=type]').val(e.node.original.type);
                                        $('input[name=edit_portal_id]').val(e.node.original.portal_id);
                                        $('input[name=edit_column_id]').val(e.node.original.column_id);
                                        
                                        addInfoType = e.node.original.content_type;
                                        is_category_type = e.node.original.is_category;
                                        is_summary_type = e.node.original.is_summary;
                                        imgLiShow = e.node.original.link_picture;
                                        
                                    }else if(e.node.original.source=='1'){
                                        $('#content_table_box').addClass('hide');
                                        $('#editPage').addClass('hide');
                                        $('#buildPage').addClass('hide');
                                        $('#content_defined_box').removeClass('hide');
                                        $('#noPower').addClass('hide');
                                        $('#portalHandle').addClass('hide');
                                        $('#portalCue').addClass('hide');
                                        var res = {content_info:[]};
                                        _this.contentListRender(res);
                                        var defParams = {};
                                        defParams.portal_id = e.node.original.portal_id;
                                        defParams.column_id = e.node.original.column_id;
                                        defParams.type = e.node.original.type;
                                        $('input[name=defined_column_id]').val(e.node.original.column_id);
                                        $('input[name=defined_portal_id]').val(e.node.original.portal_id);
                                        $('input[name=defined_type]').val(e.node.original.type);
                                        _this.getDefInfo(defParams);
                                        
                                    }else{
                                        $('#content_table_box').addClass('hide');
                                        $('#content_defined_box').addClass('hide');
                                        $('#portalHandle').removeClass('hide');
                                    }
                                }else{
                                    if(e.node.original.source=='0' || e.node.original.source=='1'){
                                        $('#content_table_box').addClass('hide');
                                        $('#content_defined_box').addClass('hide');
                                        $('#portalHandle').addClass('hide');
                                        $('#noPower').removeClass('hide');
                                    }else{
                                        $('#content_table_box').addClass('hide');
                                        $('#content_defined_box').addClass('hide');
                                        $('#portalHandle').removeClass('hide');
                                        $('#noPower').addClass('hide');
                                    }
                                }
                            }else{
                                $('#portalCue').addClass('hide');
                                $('#right_box').addClass('hide');
                                $('#iframe_box').removeClass('hide');
                                $('#portalHandle').addClass('hide');
                                $('#is_new_old').attr('src',e.node.original.url);
                                
                            }
                        }else{
                            $('#portalHandle').addClass('hide');
                            $('#portalCue').removeClass('hide');
                            $('#file_table_box').addClass('hide');
                            $('#content_defined_box').addClass('hide');
                            $('#content_table_box').addClass('hide');
                        }

                    });
                    
                },
                //�����ת
                newJump:function(portal_id,column_id){
                    window.location.href = 'newContent.html';
                },
                //����ɾ��
                delSingle:function(id){
                    var _this = this;
                    listDelArr.push(id);
                    // _this.delListInfo()
                    var r=confirm("�Ƿ�ȷ��ɾ���б�����")
                    if (r==true){
                        _this.delListInfo();
                    }else{
                        return ;
                    }
                },
                //����ɾ��
                delQuery:function(){
                    var _this = this;
                    $("input:checkbox[name=dels]:checked").each(function(index,value){

                        listDelArr.push($("input:checkbox[name=dels]:checked").eq(index).attr('data-id'))
                    })
                    if(listDelArr.length==0){
                        alert('��ѡ��Ҫɾ��������');
                        return ;
                    }
                    var r=confirm("�Ƿ�ȷ��ɾ���б�����")
                    if (r==true){
                        _this.delListInfo();
                    }else{
                        return ;
                    }
                    
                },
                //ɾ���ӿ�
                delListInfo:function(){
                    var _this = this;
                    delListParams.content_id = listDelArr.toString();
                    
                    delListParams.pageSize = 10;
                    
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalcontents/delcontent',
                        data:delListParams,
                        success:function(res){
                            if(res.status == '1'){
                                _this.contentListRender(res);
                                if(res.content_info.length!=0){
                                    _this.pageRender('page',res.pageNo,res.pageSize,res.total);
                                }else{
                                    _this.pageRender('page',1,1,1);
                                }
                                if(_this.is_five||res.content_info.length<5){
                                    $('#newBtn').removeClass('hide');
                                }
                            }else{
                                alert('ɾ��ʧ��');
                            }
                            $('#checkList').attr('checked',false);
                        },
                        error:function(){
                            alert('ɾ��ʧ��');
                        }
                    })

                    listDelArr = [];

                    
                },
                //��ȡ�Զ���ҳ������
                getDefInfo:function(params){
                    var _this = this;
                    $.ajax({
                        type:'POST',
                        url:'/general/appbuilder/web/portal/portalcontents/showcolumnpages',
                        data:params,
                        success:function(res){
                            if(res.status == '1'){
                                if(res.data.page_id!=''){
                                    $('#definded_info_box').removeClass('hide');
                                    $('#delDefinded').removeClass('hide');
                                    $('#noContent').addClass('hide');
                                }else{
                                    $('#definded_info_box').addClass('hide');
                                    $('#delDefinded').addClass('hide');
                                    $('#noContent').removeClass('hide');
                                }
                                $('#preview').html(res.data.content);
                                $('input[name=page_id]').val(res.data.page_id);                                
                            }else{
                                alert('��ȡ����ʧ��');
                            }
                            
                        },
                        error:function(){
                            alert('��ȡ����ʧ��');
                        }
                    })
                },
                //�б���Ⱦ
                contentListRender:function(data){
                    $('#content_tbody').html($("#content_tpl").tmpl(data));
                },
                //�б����ݻ�ȡ
                getContentListInfo:function(params){
                    var _this = this;
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalcontents/getcontentlist',
                        data:params,
                        success:function(res){
                            if(res.status == '1'){
                                $('#buildPage').addClass('hide');   
                                $('#editPage').addClass('hide');   
                                $('#file_table_box').addClass('hide');
                                userName = res.login_username;

                                res.del_priv==0?$('#delBtn').addClass('hide'):$('#delBtn').removeClass('hide');
                                
                                if(res.edit_priv==0){
                                    $('#newBtn').addClass('hide');
                                    $('#delBtn').css('marginLeft',0+"px");
                                    _this.is_five = false;
                                }else{
                                    if(res.is_video==1){
                                        if(res.component_total>=1){
                                            $('#newBtn').addClass('hide');
                                            $('#delBtn').css('marginLeft',0+"px");
                                        }else{
                                            $('#newBtn').removeClass('hide');
                                            $('#delBtn').css('marginLeft',20+"px");
                                        }
                                        _this.is_five = false;
                                    }else{
                                        _this.is_five = true;
                                        if(res.component_total>=5){
                                            $('#newBtn').addClass('hide');
                                            $('#delBtn').css('marginLeft',0+"px");
                                        }else{
                                            $('#newBtn').removeClass('hide');
                                            $('#delBtn').css('marginLeft',20+"px");
                                        }
                                    }
                                    
                                }

                                $('#checkList').prop('checked',false);
                                _this.contentListRender(res);
                                _this.columnTree(res.column_tree);
                                _this.editColumnTree(res.column_tree);
                                if(res.content_info.length!=0){
                                    _this.pageRender('page',res.pageNo,res.pageSize,res.total);
                                    
                                }else{
                                    _this.pageRender('page',1,1,1);
                                }
                                
                            }else{
                                alert('��ȡ����ʧ��');
                            }
                            
                        },
                        error:function(){
                            alert('��ȡ�Ż�����ʧ��');
                        }
                    })
                    
                },
                //�б��ҳ
                pageRender:function(id,pageNo,pageSize,total){
                    var _this = this;
                    $("#" + id).bootstrapPaginator({
                        bootstrapMajorVersion: 2,����// ָ��Bootstrap�İ汾��Ĭ����Boostrap2��������õ���Boostrap3�������ָ����ֵ��
                        currentPage: pageNo,����// ��ǰҳ��
                        totalPages: Math.ceil(total/pageSize),����// ��ҳ��
                        numberOfPages: 5,����// ��ʾҳ������
                        useBootstrapTooltip: true��,��// ʹ��Bootstrap��ʾ��ʽ
                        itemContainerClass: function (type, page, current) {����// Ӧ���������͹��
                            
                            return (page === current) ? "active" : "pointer-cursor";
                            
                        },
                        onPageChanged: function(event, oldPage, newPage){����// ҳ��ı�ʱ�¼�
                            listParams.keyword = $('#searchInp').val();
                            listParams.pageNo = newPage;
                            delListParams.pageNo = newPage;
                            
                            _this.getContentListInfo(listParams);
                        }
                    });
                },
                //�б�����
                search:function(){
                    var _this = this;
                    listParams.keyword = $('#searchInp').val();
                    
                    _this.getContentListInfo(listParams);
                },
                CurentTime:function(){
                    var now = new Date();
        
                    var year = now.getFullYear();       //��
                    var month = now.getMonth() + 1;     //��
                    var day = now.getDate();            //��
                    
                    var hh = now.getHours();            //ʱ
                    var mm = now.getMinutes();          //��
                    var ss = now.getSeconds();           //��
                    
                    var clock = year + "-";
                    
                    if(month < 10)
                        clock += "0";
                    
                    clock += month + "-";
                    
                    if(day < 10)
                        clock += "0";
                        
                    clock += day + " ";
                    
                    if(hh < 10)
                        clock += "0";
                        
                    clock += hh + ":";
                    if (mm < 10) clock += '0'; 
                    clock += mm + ":"; 
                    
                    if (ss < 10) clock += '0'; 
                    clock += ss; 
                    return(clock);
                },
                //��ʾ�ر��б��½�������̬��
                buildModalShow:function(){             
                    // $('#buildModal').modal('show');   
                    $('#buildPage').removeClass('hide');   
                    $('#content_table_box').addClass('hide');   
                    var _this = this;
                    _this.modalHidden($('#ATTACHMENT_div'),$('#SelFileDiv'),$('#build_form'));
                    _this.contentRender(addInfoType);
                    _this.attachInfoRender(is_category_type,is_summary_type);
                    _this.imgLink(imgLiShow,$('#imgLi'));
                    $('#parentText').text('');
                    // setTimeout(function(){
                    $('#buildPage').scrollTop(0);
                    $('#inputCreateTime').val(_this.CurentTime());
                    // }, 200);
                    $('#sourceBuild').val(userName);
                    _this.buildAddUE();
                    
                },
                buildModalHide:function(){
                    $('#buildPage').addClass('hide');   
                    $('#content_table_box').removeClass('hide');   
                    setTimeout(function(){
                        $('body').scrollTop(0);
                    }, 1);
                },
                //ģ̬��ر�
                modalHidden:function(atta,selFile,formName){
                    var _this = this;
                    atta.html('');
                    selFile.html('');
                    _this.clearModalInfo(formName);
                },
                checkAll:function(ele,event){

                    if(ele.prop('checked')){

                        $("input:checkbox[name=dels]").prop('checked',true);
                    }else{

                        $("input:checkbox[name=dels]").prop('checked',false);
                    }
                },
                allDel:function(){

                    if($("input:checkbox[name=dels]:checked").length == $("input:checkbox[name=dels]").length){

                        $('#checkList').prop('checked',true)

                    }else{

                        $('#checkList').prop('checked',false)
                    }

                },
                //����ͼƬչʾ
                imgLink:function(type,imgLi){
                    switch(type){
                        case '1':
                            imgLi.removeClass('hide');
                        break;
                        default:
                            imgLi.addClass('hide');
                        break;
                    }
                },
                //���ժҪ�߼�
                attachInfoRender:function(is_category,is_summary){
                    var is_category_build = $('#is_category_build');
                    var is_category_edit = $('#is_category_edit');
                    var is_summary_build = $('#is_summary_build');
                    var is_summary_edit = $('#is_summary_edit');
                    
                    switch(is_category){
                        case '1':   
                            is_category_build.removeClass('hide');is_category_edit.removeClass('hide');
                        break;
                        case '0':
                            is_category_build.addClass('hide');is_category_edit.addClass('hide');
                        break;
                        default:
                        return;
                    }

                    switch(is_summary){
                        case '1':   
                            is_summary_build.removeClass('hide');is_summary_edit.removeClass('hide');
                        break;
                        case '0':
                            is_summary_build.addClass('hide');is_summary_edit.addClass('hide');
                        break;
                        default:
                        return;
                    }
                },
                //�����߼�
                contentRender:function(type){
                    
                    var type_article_int = $('#type_article input');
                    var content_text_box = $('#content_text_box');
                    var attachment_box = $('#attachment_box');
                    var link_box = $('#link_box');
                    var type_article = $('#type_article');
                    var type_link_column = $('#type_link_column');
                    var type_link_out = $('#type_link_out');
                    var type_imgs = $('#type_imgs');
                    var type_video = $('#type_video');
                    var column_tree = $('#column_tree');
                    var open_way = $('#open_way');
                    switch(type){
                        case '1':
                            type_article_int.attr('checked',true);content_text_box.removeClass('hide');column_tree.addClass('hide');attachment_box.removeClass('hide');link_box.addClass('hide');type_article.removeClass('hide');type_link_column.removeClass('hide');type_link_out.removeClass('hide');type_imgs.removeClass('hide');type_video.removeClass('hide');open_way.removeClass('hide');
                        break;
                        case '3':
                            type_article_int.attr('checked',true);content_text_box.addClass('hide');attachment_box.removeClass('hide');link_box.addClass('hide');type_article.addClass('hide');type_link_column.addClass('hide');type_link_out.addClass('hide');type_imgs.addClass('hide');type_video.removeClass('hide');$('#only_video').prop('checked',true);open_way.removeClass('hide');
                        break;
                        default:
                            type_article_int.attr('checked',true);content_text_box.removeClass('hide');column_tree.addClass('hide');attachment_box.removeClass('hide');link_box.addClass('hide');$('#column_tree').addClass('hide');
                        break;
                    }
                    
                },
                //�����л��߼�
                contentChange:function(value){
                    var _this = this;
                    var contentBox = $('#content_text_box');
                    var attachment_box = $('#attachment_box');
                    var linkBox = $('#link_box');
                    var column_tree = $('#column_tree');
                    var open_way = $('#open_way');
                    switch(value){
                        case '0':
                            contentBox.removeClass('hide');attachment_box.removeClass('hide');linkBox.addClass('hide');column_tree.addClass('hide');open_way.removeClass('hide');
                        break;
                        case '4':
                            _this.columnTreeHandle(false);
                            contentBox.addClass('hide');attachment_box.addClass('hide');linkBox.addClass('hide');column_tree.removeClass('hide');open_way.removeClass('hide');
                        break;
                        case '1':
                            contentBox.addClass('hide');attachment_box.addClass('hide');linkBox.removeClass('hide');column_tree.addClass('hide');open_way.removeClass('hide');
                        break;
                        case '2':
                            contentBox.addClass('hide');attachment_box.removeClass('hide');linkBox.addClass('hide');column_tree.addClass('hide');open_way.removeClass('hide');
                        break;
                        case '3':
                            contentBox.addClass('hide');attachment_box.removeClass('hide');linkBox.addClass('hide');column_tree.addClass('hide');open_way.removeClass('hide');
                        break;
                        default:
                            return ;
                    }
                },
                //�����½����ݱ༭��
                buildAddUE:function(){
                    
                    UE.getEditor( 'editorBuild', {
                        toolbars: [
                            [ "bold","italic","underline","strikethrough","removeformat",
                            "forecolor","backcolor",
                            "autotypeset","paragraph","fontfamily","fontsize","lineheight",
                            "insertorderedlist","insertunorderedlist","|","justifyleft","justifycenter","justifyright",//,"JustifyBlock"
                            "link","unlink",
                            "undo","redo" ,
                            "insertimage","inserttable","emotion",
                            "preview","template","source" ]
                        ],
                        autoHeightEnabled: false,
                    
                        autoFloatEnabled: false,
                    
                        initialFrameWidth: 500,
                    
                        initialFrameHeight: 275,

                        "attachmentId":"ATTACHMENT_ID_OLD",
                        
                        "attachmentName":"ATTACHMENT_NAME_OLD"
                    });
                    UE.getEditor( 'editorBuild').ready(function() {
                        UE.getEditor( 'editorBuild').setContent('', false);
                    });
                    
                },
                //��ձ�
                clearModalInfo:function(dom){

                    dom[0].reset();
                    
                },
                //չ����
                columnHandle:function(){
                    portalTreeSign = !portalTreeSign;
                    this.columnTreeHandle(portalTreeSign);
                },
                //��Ŀ��
                columnTree:function(data){ 
                    $('#parentTree').jstree("destroy");
                    var _this = this;
                    $('#parentTree').jstree({ 'core' : {  
                        'data' : data 
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

                        $('#parentText').text(e.node.text);
                        $('#add_link_column_id').val(e.node.original.column_id);
                        portalTreeSign = false;
                        _this.columnTreeHandle(false);
                    }); 
                },
                //��Ŀ������ʾ����
                columnTreeHandle:function(bool){
                    if(!bool){
                        $('#parentTree').addClass('hide');
                    }else{
                        $('#parentTree').removeClass('hide');
                    }
                },
                //У���ļ��ϴ�����
                getFileType:function(filePath){
                    
                    var startIndex = filePath.lastIndexOf('.');  
                    if(startIndex != -1)  
                        return filePath.substring(startIndex+1, filePath.length).toLowerCase();  
                    else return "";
                },
                //�½����
                addListInfo:function(){
                    var _this = this;
                    var filePath = $("#add_img_file").val();  
                    var content_type = $('input[name=content_type]:checked').val();
                    var ATTACHMENT_div_children = $('#ATTACHMENT_div').children('span').length;

                    var videoPath = $($('#ATTACHMENT_div').children('span').get(0)).attr('title');
                    
                    
                    if($.trim($('#inputSubject').val()) === ''){
                        alert('���ⲻ��Ϊ��');
                        return;
                    }
                    if($.trim($('#categoryBuild').val()).length>7){
                        alert('������Ϊ6���ַ�');
                        return;
                    }

                    if(content_type=='0'){
                        if(UE.getEditor( 'editorBuild').getContent()==''){
                            alert('���ݲ���Ϊ��');
                            return;
                        }
                    }

                    if(content_type=='1'){
                        if($.trim($('#inputLink').val()) === ''){
                            alert('���ӵ�ַ����Ϊ��');
                            return;
                        }
                    }

                    if(content_type=='4'){
                        if($('#add_link_column_id').val() === ''){
                            alert('��ѡ��Ҫ���ӵ���Ŀ');
                            return;
                        }
                    }


                    if($('#inputCreateTime').val() == ''){
                        alert('����ʱ�䲻��Ϊ��');
                        return;
                    }
                    
                    if(content_type==2 && ATTACHMENT_div_children <1){
                        alert('���ϴ�����');
                        return;
                    }

                    if(content_type==3 && ATTACHMENT_div_children !=1){
                        alert('���ϴ�һ����Ƶ����');
                        return;
                    }

                    if(imgLiShow==='1'){
                        if($('#add_img_file').val()==''){
                            alert("���ϴ�����ͼƬ");
                            return;
                        }
                    }
                    
                    if("" != filePath){ 
                        var fileType = _this.getFileType(filePath);  
                        //�ж��ϴ��ĸ����Ƿ�ΪͼƬ  
                        if("jpg"!=fileType && "jpeg"!=fileType  && "png"!=fileType && "gif"!=fileType){  
                            $("#file").val("");  
                            alert("���ϴ�JPG,JPEG,PNG,GIF��ʽ��ͼƬ");  
                            return ;
                        }  
                        // else{  
                        //     //��ȡ������С����λ��KB��  
                        //     var fileSize = document.getElementById("file").files[0].size / 1024;  
                        //     if(fileSize > 2048){  
                        //         alert("ͼƬ��С���ܳ���2MB");  
                        //     }  
                        // }  
                    }

                    if(content_type == 2){
                        if("" != videoPath){
                            var videoPath = _this.getFileType(videoPath);  
                            console.log(videoPath);
                            //�ж��ϴ��ĸ����Ƿ�Ϊ��Ƶ  
                            if("jpg"!=videoPath && "jpeg"!=videoPath  && "png"!=videoPath && "gif"!=videoPath){  
                                // $("#file").val("");  
                                alert("���ϴ�JPG,JPEG,PNG,GIF��ʽ��ͼƬ");  
                                return ;
                            }  
                            // else{  
                            //     //��ȡ������С����λ��KB��  
                            //     var fileSize = document.getElementById("file").files[0].size / 1024;  
                            //     if(fileSize > 2048){  
                            //         alert("ͼƬ��С���ܳ���2MB");  
                            //     }  
                            // }  
                        }
                    }


                    if(content_type == 3){
                        if("" != videoPath){  
                            var videoPath = _this.getFileType(videoPath);
                            
                            //�ж��ϴ��ĸ����Ƿ�Ϊ��Ƶ  
                            if("avi"!=videoPath && "wma"!=videoPath  && "rmvb"!=videoPath && "rm"!=videoPath && "flash"!=videoPath && "mp4"!=videoPath && "mid"!=videoPath && "3gp"!=videoPath){  
                                // $("#file").val("");  
                                alert("���ϴ�avi,wma,rmvb,rm,flash,mp4,mid,3gp��ʽ����Ƶ");  
                                return ;
                            }  
                            // else{  
                            //     //��ȡ������С����λ��KB��  
                            //     var fileSize = document.getElementById("file").files[0].size / 1024;  
                            //     if(fileSize > 2048){  
                            //         alert("ͼƬ��С���ܳ���2MB");  
                            //     }  
                            // }  
                        }
                    }

                    document.form1.submit();
                    _this.buildModalHide();
                    $('#build_iframe').load(function(){
                        var back_info = $(this)[0].contentDocument.body.textContent;
                        // ���ݺ�̨����ֵ������
                        var res=$.parseJSON(back_info);
                        
                        if(res.status == 1) {
                            _this.getContentListInfo(listParams);
                        }else{
                            alert('�½�ʧ��');
                        }

                    });

                    
                },
                //�����༭���ݱ༭��
                editAddUE:function(){
                    
                    UE.getEditor( 'editorEdit', {
                        toolbars: [
                            [ "bold","italic","underline","strikethrough","removeformat",
                            "forecolor","backcolor",
                            "autotypeset","paragraph","fontfamily","fontsize","lineheight",
                            "insertorderedlist","insertunorderedlist","|","justifyleft","justifycenter","justifyright",//,"JustifyBlock"
                            "link","unlink",
                            "undo","redo" ,
                            "insertimage","inserttable","emotion",
                            "preview","template","source" ]
                        ],
                        autoHeightEnabled: false,
                    
                        autoFloatEnabled: false,
                    
                        initialFrameWidth: 500,
                    
                        initialFrameHeight: 275,

                        "attachmentId":"ATTACHMENT_ID_OLD_EDIT",
                        
                        "attachmentName":"ATTACHMENT_NAME_OLD_EDIT"
                    });
                    UE.getEditor( 'editorEdit').ready(function() {
                        UE.getEditor( 'editorEdit').setContent('', false);
                    });
                    
                },
                //�༭��Ƶѡ����ʾ
                // videoRadio:function(type){
                //     var videoShow = $('#edit_open_way');
                //     switch(type){
                //         case '3':
                //             videoShow.addClass('hide');
                //         break;
                //         default:
                //             videoShow.removeClass('hide');
                //         break;
                //     }
                // },
                //���ݱ༭��ʾ����
                editModalShow:function(id){        
                    var _this = this;
                    $('#editImage').prop('str','');
                    $('#content_table_box').addClass('hide');  
                    $('#editPage').removeClass('hide');   
                    content_text_box_edit.addClass('hide');column_tree_edit.addClass('hide');link_box_edit.addClass('hide');attachment_box_edit.addClass('hide');
                    _this.modalHidden($('#ATTACHMENTEdit_div'),$('#SelFileDivEdit'),$('#edit_form'));
                    $('input[name=edit_content_id]').val(id);
                    _this.attachInfoRender(is_category_type,is_summary_type);
                    _this.getEditInfo(id);
                    $('#file_box').html('');
                    _this.imgLink(imgLiShow,$('#edit_imgLi'));
                    setTimeout(function(){
                        $('#edit_box').scrollTop(0);
                    }, 200);
                    _this.editAddUE();
                    
                },
                editModalHide:function(){
                    var _this = this;
                    $('input[name=edit_img_del]').val('');
                    $('#editPage').addClass('hide');
                    $('#content_table_box').removeClass('hide');  
                    setTimeout(function(){
                        $('body').scrollTop(0);
                    }, 1);
                },
                //�༭�߼�
                editTypeHandle:function(type){
                    
                    switch(type){
                        case '0':
                            content_text_box_edit.removeClass('hide');attachment_box_edit.removeClass('hide');
                        break;
                        case '4':
                            column_tree_edit.removeClass('hide');
                        break; 
                        case '1':
                            link_box_edit.removeClass('hide');
                        break;
                        case '2':
                            attachment_box_edit.removeClass('hide');
                        break; 
                        case '3':
                            attachment_box_edit.removeClass('hide');
                        break;
                        default:
                            return;
                        break;
                    }
                },
                //ɾ����ѡ����ͼƬ
                delImg:function(){
                    $('#show_image').addClass('hide');
                    $('#file_image').removeClass('hide');
                    $('input[name=edit_img_del]').val('1');
                },
                //չ����
                editColumnHandle:function(e){
                    editPortalTreeSign = !editPortalTreeSign;
                    this.editColumnTreeHandle(editPortalTreeSign);
                },
                //�༭��Ŀ������ʾ����
                editColumnTreeHandle:function(bool){
                    if(!bool){
                        $('#parentTreeEdit').addClass('hide');
                    }else{
                        $('#parentTreeEdit').removeClass('hide');
                    }
                },
                //�༭ - ��Ŀ��
                editColumnTree:function(data){ 
                    $('#parentTreeEdit').jstree("destroy");
                    var _this = this;
                    $('#parentTreeEdit').jstree({ 'core' : {  
                        'data' : data 
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
                    $('#parentTreeEdit').bind("activate_node.jstree", function (obj, e) {

                        $('#parentTextEdit').text(e.node.text);
                        $(":input[name='edit_link_column_id']").val(e.node.original.column_id);
                        editPortalTreeSign = false;
                        _this.editColumnTreeHandle(false);
                    }); 
                },
                //��ȡ�༭����
                getEditInfo:function(id){

                    var _this = this;
                    var param = {
                        content_id:id
                    };
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalcontents/editcontent',
                        data:param,
                        success:function(res){
                            if(res.status == '1'){
                                _this.editTypeHandle(res.data.content_type);
                                editType = res.data.content_type;
                                $('#inputSubjectEdit').val(res.data.subject);
                                
                                setTimeout(function(){
                                    UE.getEditor( 'editorEdit').setContent(res.data.content_text,false);
                                }, 500);
                                
                                $('#categoryEdit').val(res.data.category);
                                $('#sourceEdit').val(res.data.source);
                                $('#summaryEdit').val(res.data.summary);
                                $('#inputLinkEdit').val(res.data.content_link);
                                $('#inputCreateTimeEdit').val(res.data.publish_time);
                                $('#editImage').attr('src',res.data.img_view);
                                // _this.videoRadio(res.data.content_type);
                                if(res.data.img_view!=""){
                                    $('#file_image').addClass('hide');
                                    $('#show_image').removeClass('hide');
                                }else{
                                    $('#show_image').addClass('hide');
                                    $('#file_image').removeClass('hide');
                                }
                                
                                $(":radio[name='edit_link_target'][value='" + res.data.link_target + "']").prop("checked", "checked");
                                $(":radio[name='edit_home_page_push'][value='" + res.data.home_page_push + "']").prop("checked", "checked");
                                $('#file_box').html(res.data.attach_link);
                                var strArr = res.data.keyword.split(',');
                                $(":input[name='edit_keyword1']").val(strArr[0]);
                                $(":input[name='edit_keyword2']").val(strArr[1]);
                                $(":input[name='edit_keyword3']").val(strArr[2]);
                                $(":input[name='edit_keyword4']").val(strArr[3]);
                                $(":input[name='edit_keyword5']").val(strArr[4]);
                                $('#parentTextEdit').text(res.data.column_name);
                                $(":input[name='edit_link_column_id']").val(res.data.link_column_id);
                                $(":input[name='edit_content_type']").val(res.data.content_type);
                                $(":input[name='edit_column_type']").val($(":input[name='type']").val());
                            }else{
                                alert('��ȡ����ʧ��');
                            }
                            
                        },
                        error:function(){
                            alert('��ȡ����ʧ��');
                        }
                    })
                },
                //�༭�ύ
                editListInfo:function(){
                    var _this = this;
                    var filePath = $("#edit_img_file").val();  
                    var file_box_children = $('#file_box').children('span').length;
                    var ATTACHMENTEdit_div_children = $('#ATTACHMENTEdit_div').children('span').length;
                    var allNum = file_box_children + ATTACHMENTEdit_div_children;
                    var videoPath = $($('#ATTACHMENTEdit_div').children("span").get(0)).attr('title');
                    // var imgPath = $('#ATTACHMENTEdit_div').children("span")
                    if($.trim($('#inputSubjectEdit').val()) === ''){
                        alert('���ⲻ��Ϊ��');
                        return;
                    }

                    if($.trim($('#categoryEdit').val()).length>7){
                        alert('������Ϊ6���ַ�');
                        return;
                    }

                    if($(":input[name='edit_content_type']").val() =='0'){
                        if(UE.getEditor( 'editorEdit').getContent()==''){
                            alert('���ݲ���Ϊ��');
                            return;
                        }
                    }

                    if($(":input[name='edit_content_type']").val() =='1'){
                        if($.trim($('#inputLinkEdit').val()) === ''){
                            alert('���ӵ�ַ����Ϊ��');
                            return;
                        }
                    }

                    if($(":input[name='edit_content_type']").val() =='2'&& $('#file_box').find('span').length==0){
                        alert('���ϴ�ͼƬ����');
                        return;
                    }

                    if($('#inputCreateTimeEdit').val() == ''){
                        alert('����ʱ�䲻��Ϊ��');
                        return;
                    }

                    if($(":input[name='edit_content_type']").val()==3 && allNum!=1){
                        alert('���ܴ���һ���ϴ�����Ƶ����');
                        return;
                    }

                    if($('#show_image').attr('class').indexOf('hide') != -1){
                        if(imgLiShow==='1'){
                            if($('#edit_img_file').val()==''){
                                alert("���ϴ�����ͼƬ");
                                return;
                            }
                        }
                    }
                    

                    if("" != filePath){  
                        var fileType = _this.getFileType(filePath);  
                        //�ж��ϴ��ĸ����Ƿ�ΪͼƬ  
                        if("jpg"!=fileType && "jpeg"!=fileType  && "png"!=fileType && "gif"!=fileType){  
                            $("#file").val("");  
                            alert("���ϴ�JPG,JPEG,PNG,GIF��ʽ��ͼƬ");  
                            return ;
                        }  
                        // else{  
                        //     //��ȡ������С����λ��KB��  
                        //     var fileSize = document.getElementById("file").files[0].size / 1024;  
                        //     if(fileSize > 2048){  
                        //         alert("ͼƬ��С���ܳ���2MB");  
                        //     }  
                        // }  
                    }

                    if(editType == 2){
                        for(var i=0;i<$('#ATTACHMENTEdit_div').children("span").length;i++){
                            if("" != $($('#ATTACHMENTEdit_div').children("span").get(i)).attr('title')){
                                var videoPath = _this.getFileType($($('#ATTACHMENTEdit_div').children("span").get(i)).attr('title'));  
                                //�ж��ϴ��ĸ����Ƿ�Ϊ��Ƶ
                                if("jpg"!=videoPath && "jpeg"!=videoPath  && "png"!=videoPath && "gif"!=videoPath){  
                                    $("#file").val("");  
                                    alert("���ϴ�JPG,JPEG,PNG,GIF��ʽ��ͼƬ");  
                                    return ;
                                }  
                                // else{  
                                //     //��ȡ������С����λ��KB��  
                                //     var fileSize = document.getElementById("file").files[0].size / 1024;  
                                //     if(fileSize > 2048){  
                                //         alert("ͼƬ��С���ܳ���2MB");  
                                //     }  
                                // }  
                            }
                        }
                    }

                    if(editType == 3){
                        if($('#file_box').find('span').length==0){
                            if("" != videoPath){
                                var videoPath = _this.getFileType(videoPath);  
                                //�ж��ϴ��ĸ����Ƿ�Ϊ��Ƶ
                                if("avi"!=videoPath && "wma"!=videoPath  && "rmvb"!=videoPath && "rm"!=videoPath && "flash"!=videoPath && "mp4"!=videoPath && "mid"!=videoPath && "3gp"!=videoPath){  
                                    $("#file").val("");  
                                    alert("���ϴ�avi,wma,rmvb,rm,flash,mp4,mid,3gp��ʽ����Ƶ");  
                                    return ;
                                }  
                                // else{  
                                //     //��ȡ������С����λ��KB��  
                                //     var fileSize = document.getElementById("file").files[0].size / 1024;  
                                //     if(fileSize > 2048){  
                                //         alert("ͼƬ��С���ܳ���2MB");  
                                //     }  
                                // }  
                            }
                        }
                        
                    }

                    document.form2.submit();
                    _this.editModalHide();
                    $('#edit_iframe').load(function(){
                        var back_info = $(this)[0].contentDocument.body.textContent;
                        // ���ݺ�̨����ֵ������
                        var res=$.parseJSON(back_info);
                        
                        if(res.status == 1) {
                            _this.getContentListInfo(listParams);
                        }else{
                            alert('�༭ʧ��');
                        }
                    });
                    
                    
                    
                    
                },
                //�����Զ������ݱ༭��
                defAddUE:function(){
                    
                    UE.getEditor( 'editorDef', {
                        toolbars: [
                            [ "bold","italic","underline","strikethrough","removeformat",
                            "forecolor","backcolor",
                            "autotypeset","paragraph","fontfamily","fontsize","lineheight",
                            "insertorderedlist","insertunorderedlist","|","justifyleft","justifycenter","justifyright",//,"JustifyBlock"
                            "link","unlink",
                            "undo","redo" ,
                            "insertimage","inserttable","emotion",
                            "preview","template","source" ]
                        ],
                        autoHeightEnabled: false,
                    
                        autoFloatEnabled: false,
                    
                        initialFrameWidth: 550,
                    
                        initialFrameHeight: 250,

                        "attachmentId":"ATTACHMENT_ID_OLD_DEF",
                        
                        "attachmentName":"ATTACHMENT_NAME_OLD_DEF"
                    });
                    UE.getEditor( 'editorDef').ready(function() {
                        UE.getEditor( 'editorDef').setContent('', false);
                    })
                    
                },
                //�Զ���༭��ʾ����
                defModalShow:function(){        
                    var _this = this;
                    
                    $('#defModal').modal('show'); 
                    _this.modalHidden($('#ATTACHMENTDefined_div'),$('#SelFileDivDefined'),$('#def_form'));
                    _this.getDefinedHandle();
                    setTimeout(function(){
                        $('#def_box').scrollTop(0);
                    }, 200);
                    _this.defAddUE();
                    
                    
                    
                    
                },
                defModalHide:function(){
                    var _this = this;
                    $('#defModal').modal('hide');  
                    var defParams = {};
                    defParams.portal_id = $('input[name=defined_portal_id]').val();
                    defParams.column_id = $('input[name=defined_column_id]').val();
                    defParams.type = $('input[name=defined_type]').val();
                    setTimeout(function(){
                        _this.getDefInfo(defParams);
                    },500);
                    
                },
                //�����Զ�������
                getDefinedHandle:function(){
                    var _this = this;
                    var getDefindParams = {};
                    getDefindParams.portal_id = $('input[name=defined_portal_id]').val();
                    getDefindParams.column_id = $('input[name=defined_column_id]').val();
                    getDefindParams.type = $('input[name=defined_type]').val();
                    getDefindParams.page_id = $('input[name=page_id]').val();
                    _this.getDefinedEditInfo(getDefindParams);
                },
                //��ȡ�༭����
                getDefinedEditInfo:function(params){
                    var _this = this;
                    $.ajax({
                        type:'POST',
                        url:'/general/appbuilder/web/portal/portalcontents/editcolumnpages',
                        data:params,
                        success:function(res){
                            if(res.status == '1'){
                                
                                setTimeout(function(){
                                    UE.getEditor( 'editorDef').setContent(res.data.content);
                                }, 500);
                                        
                            }else{
                                alert('��ȡ����ʧ��');
                            }
                            
                        },
                        error:function(){
                            alert('��ȡ����ʧ��');
                        }
                    })
                },
                //�����Զ���༭
                submitDefinedInfo:function(){
                    var _this = this;
                    document.formDef.submit();

                    _this.defModalHide();
                },
                //ɾ���Զ���ҳ��
                delDefined:function(){
                    var _this = this;
                    var delParams = {};
                    var defParams = {}; 
                    delParams.portal_id = $('input[name=defined_portal_id]').val();
                    delParams.column_id = $('input[name=defined_column_id]').val();
                    delParams.page_id = $('input[name=page_id]').val();
                    delParams.type = $('input[name=defined_type]').val();
                    defParams.portal_id = $('input[name=defined_portal_id]').val();
                    defParams.column_id = $('input[name=defined_column_id]').val();
                    
                        
                    var r=confirm("�Ƿ�ȷ��ɾ�����Զ���ҳ������")
                    if (r==true){
                        $.ajax({
                            type:'GET',
                            url:'/general/appbuilder/web/portal/portalcontents/deletecolumnpages',
                            data:delParams,
                            success:function(res){
                                if(res.status == '1'){
                                    $('#definded_info_box').addClass('hide');
                                    $('#delDefinded').addClass('hide');
                                    $('#noContent').removeClass('hide');
                                    // _this.getDefInfo(defParams);
                                }else{
                                    alert('ɾ��ʧ��');
                                }
                                
                            },
                            error:function(){
                                alert('ɾ��ʧ��');
                            }
                        })
                    }else{
                        return ;
                    }
                },
                //�ļ�������
                backContentList:function(){
                    $('#content_table_box').removeClass('hide');
                    $('#file_table_box').addClass('hide');
                },
                //�ļ�����ť
                fileManage:function(id){
                    $('#file_tbody').html('');
                    
                    var _this = this;
                    var fileParams = {};
                    fileParams.portal_id = $('input[name=portal_id]').val();
                    fileParams.column_id = $('input[name=column_id]').val();
                    fileParams.content_id = id;
                    _this.getFileManageList(fileParams);
                    setTimeout(function(){
                        $('#content_table_box').addClass('hide');
                        $('#file_table_box').removeClass('hide');
                    },150);
                    
                    $('input[name=content_id]').val(id);
                    
                    
                },
                //�ļ���������ʾ
                editFileShow:function(id){
                    
                    var _this = this;
                    $('#fileModal').modal('show');
                    _this.editFileManage(id);
                },
                editFileHidden:function(){
                    var _this = this;
                    
                    $('#fileModal').modal('hide');
                },
                //��ȡ�ļ������б�����
                getFileManageList:function(params){
                    var _this = this;
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalcontents/filelist',
                        data:params,
                        success:function(res){
                            if(res.status == '1'){
                                var str = ''; 
                                if(res.data.length!=0){
                                    for(var i = 0;i<res.data.length;i++){
                                        str +=  "<tr name='file_list'><td class='span1'>"+res.data[i].attach_link+"</td>"+
                                                "<td class='span5'>"+res.data[i].description+"</td>"+
                                                "<td class='span2'><span class='content_del' onClick='contentManage.editFileShow(\""+res.data[i].file_id+"\")'>�༭</span>&nbsp;<span class='content_del' onClick='contentManage.delFileManage(\""+res.data[i].attach_id+"\",\""+res.data[i].attach_name+"\")'>ɾ��</span></td></tr>"
                                                
                                    }
                                }else{
                                    str = "<tr><td style='text-align:center;' colspan='3' >��������</td></tr>"
                                }
                                    
                                

                                $('#file_tbody').html(str);

                            }else{
                                alert('��ȡ����ʧ��');
                            }
                            
                        },
                        error:function(){
                            alert('��ȡ����ʧ��');
                        }
                    })
                },
                //�ļ�����ɾ��
                delFileManage:function(attach_id,attach_name){
                    var params = {};
                    params.content_id = $('input[name=content_id]').val();
                    params.attach_id = attach_id;
                    params.attach_name = attach_name;
                    var _this = this;
                    var r=confirm("�Ƿ�ȷ��ɾ���б�����")
                    if (r==true){
                        $.ajax({
                            type:'GET',
                            url:'/general/appbuilder/web/portal/portalcontents/deletefile',
                            data:params,
                            success:function(res){
                                if(res.status == '1'){
                                    _this.fileManage($('input[name=content_id]').val());
                                }else{
                                    alert('ɾ��ʧ��');
                                }
                                
                            },
                            error:function(){
                                alert('ɾ��ʧ��');
                            }
                        })
                    }else{
                        return ;
                    }
                    
                },
                // �ļ�����༭
                editFileManage:function(id){
                    var _this = this;
                    $('input[name=file_id]').val(id);
                    var params = {};
                    params.file_id = id;
                    params.content_id = $("input[name=content_id]").val();
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalcontents/editfile',
                        data:params,
                        success:function(res){
                            if(res.status == '1'){
                                $('#fileName').text(res.data.attach_name);
                                $('input[name=file_no]').val(res.data.file_no);
                                $('#description').val(res.data.description);
                                res.data.download == '0'?$('input[name=download]').prop('checked',false):$('input[name=download]').prop('checked',true);
                            }else{
                                alert('��ȡ�༭����ʧ��');
                            }
                            
                        },
                        error:function(){
                            alert('��ȡ�༭����ʧ��');
                        }
                    })
                },
                //�ļ�������
                editFileSubmit:function(){
                    var _this = this;
                    var params = {};
                    params.file_id = $('input[name=file_id]').val();
                    params.content_id = $('input[name=content_id]').val();
                    params.file_no = $('input[name=file_no]').val();
                    params.description = $('#description').val();
                    params.download = $('input[name=download]').prop('checked')?'1':'0';

                    $.ajax({
                        type:'POST',
                        url:'/general/appbuilder/web/portal/portalcontents/updatefile',
                        data:params,
                        success:function(res){
                            if(res.status == '1'){
                                    _this.editFileHidden();
                                    var fileParams = {};
                                    fileParams.portal_id = $('input[name=portal_id]').val();
                                    fileParams.column_id = $('input[name=column_id]').val();
                                    fileParams.content_id = $('input[name=content_id]').val();
                                    _this.getFileManageList(fileParams);
                            }else{
                                alert('����ʧ��');
                            }
                            
                        },
                        error:function(){
                            alert('����ʧ��');
                        }
                    })

                },
            };
            contentManage.init();
            window.contentManage = contentManage;
        })
    })(jQuery);
