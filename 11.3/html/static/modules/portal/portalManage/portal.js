
    (function($){
        $(document).ready(function(){

            var draggable = false;

            var editParams = {};
            
            var editData = '';

            var logo_img_id = '';
            var logo_img_name = '';
            
            var cropData = {
                x: undefined,
                y: undefined,
                w: 0,
                h: 0,
                originW: 0,
                originH: 0,
                compressW: 0,
                id: null,
                name: '',
                geneAvatar: true,
                isGif: false
            };

            var cropperVisible = false;
            var previewSrc = '';
            var selected = null;

            var portalManage = {
                init:function(){
                    this.portalList();
                    this.searchHandle();
                },
                searchListInfo:{
                    data_info:[]
                },
                //�б�����
                portalList:function(){
                    
                    var _this = this;

                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/getportallist',
                        success:function(res){

                            if(res[0].status==1){
                                _this.templateShow(res[0]);
                                _this.searchListInfo.data_info = $.extend([],res[0].data_info);
                            }else{
                                alert('��ȡ�Ż��б�ʧ��');
                            }

                        },
                        error:function(error){
                            
                            // alert('��ȡ�Ż��б�ʧ��');
                        }

                    })
                },
                //ǰ������
                searchHandle:function(){
                    var _this = this;
                    $("#portal_search_int").on('keydown',function (event) {
                        if (event.which == 13) {
                            if(draggable){
                                jQuery("#sortable").sortable('destroy');
                            }
                            draggable = false;
                            var keyword = $('#portal_search_int').val();
                            if(keyword!=''){
                                $('#dra_btn').addClass('hide');
                                $('#dra_btn').text('��������');
                                $('#portal_seach_box').css('marginRight',0);
                            }else{
                                $('#dra_btn').removeClass('hide');
                                $('#dra_btn').text('��������');
                                $('#portal_seach_box').css('marginRight',25+'px');
                            }
                            _this.filterListInfo(_this.searchListInfo.data_info,keyword);
                        }
                    });
                    // $('#portal_search_int').bind('input propertychange',function(){
                    //     if(draggable){
                    //         jQuery("#sortable").sortable('destroy');
                    //     }
                    //     draggable = false;
                    //     var keyword = $('#portal_search_int').val();
                    //     if(keyword!=''){
                    //         $('#dra_btn').addClass('hide');
                    //         $('#dra_btn').text('��������');
                    //         $('#portal_seach_box').css('marginRight',0);
                    //     }else{
                    //         $('#dra_btn').removeClass('hide');
                    //         $('#dra_btn').text('��������');
                    //         $('#portal_seach_box').css('marginRight',25+'px');
                    //     }
                    //     _this.filterListInfo(_this.searchListInfo.data_info,keyword);
                    // });
                    $('.search_icon_box').on('click',function(){
                        if(draggable){
                            jQuery("#sortable").sortable('destroy');
                        }
                        draggable = false;
                        var keyword = $('#portal_search_int').val();
                        if(keyword!=''){
                            $('#dra_btn').addClass('hide');
                            $('#dra_btn').text('��������');
                            $('#portal_seach_box').css('marginRight',0);
                        }else{
                            $('#dra_btn').removeClass('hide');
                            $('#dra_btn').text('��������');
                            $('#portal_seach_box').css('marginRight',25+'px');
                        }
                        _this.filterListInfo(_this.searchListInfo.data_info,keyword);
                    });
                },
                //�б����ݹ���
                filterListInfo:function(arr,keyword){
                    var _this = this;
                    var filterObj = {
                        data_info:[]
                    };
                    $.each(arr,function(index,value){
                        if(value.portal_name.indexOf(keyword)!= -1){
                            filterObj.data_info.push(value);
                        }
                    })

                    _this.templateShow(filterObj);
                },
                //��Ⱦ�б�ģ��
                templateShow:function(data){
                    $('#sortable').html($("#portal_tpl").tmpl(data));
                },
                //��Ⱦ�༭ģ��
                editTpl:function(data){
                    $('#edit_box').html($('#portal_edit').tmpl(data));
                },
                //��Ŀ������ת
                columnJump:function(id,is_new,t_id){
                    window.location.href = './column.html?portal_id='+ id +'&is_new='+ is_new + '&t_id=' + t_id;
                },
                //�޸�����״̬
                changeStatus:function(id){
                    var _this = this;
                    
                    var params = {
                        portal_id:id
                    }
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/setportaluse',
                        data:params,
                        success:function(res){
                            if(res[0].status==1){
                                _this.portalList();
                            }else{
                                alert('�޸��Ż�����״̬ʧ��');
                            }
                        },
                        error:function(){
                            alert('�޸��Ż�����״̬ʧ��');
                        }
                    })
                },
                //ɾ��
                delPortal:function(id){
                    var _this = this;
                    var params = {
                        portal_id:id
                    }
                    var r=confirm("�Ƿ�ȷ��ɾ�����Ż�?")
                    if (r==true){
                        $.ajax({
                            type:'GET',
                            url:'/general/appbuilder/web/portal/portalmanagement/delportal',
                            data:params,
                            success:function(res){
                                if(res[0].status==1){
                                    alert('ɾ���ɹ�');
                                    _this.portalList();
                                }else if(res[0].status==2){
                                    alert(res[0].msg);
                                    _this.portalList();
                                }else{
                                    alert('ɾ���Ż�ʧ��');
                                }
                            },
                            error:function(error){
                                alert('ɾ��ʧ��');
                            }
                        })
                    }else{
                        return ;
                    }
                    
                },
                //��ק����
                draggableList:function(str){
                    var params = {
                        portal_ids:str
                    }

                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/portaldraging',
                        data:params,
                        success:function(res){
                            if(res[0].status!=1){
                                alert('��ק����ʧ��')
                            }
                        },
                        error:function(error){
                            alert('��ק����ʧ��')
                        }
                    })
                },
                //��ק
                draggableHandle:function(){

                    var _this = this;
                    draggable = !draggable;

                    if (draggable) {
                        jQuery(function () {
                            jQuery("#sortable").sortable({
                                update: function (event, ui) {
                                    var sortedIDs = $("#sortable").sortable("toArray");

                                    var str = sortedIDs.join(',') + ',';

                                    _this.draggableList(str);

                                },
                                cursor: "move",
                                placeholder: "ui-state-highlight"
                            });
                            jQuery("#sortable").disableSelection();
                        });
                        $('#dra_btn').text('��������');
                        $('.maskTd').removeClass('hide');
                        $('.portal_tr').addClass('move');
                    } else {
                        jQuery("#sortable").sortable('destroy');
                        $('#dra_btn').text('��������');
                        $('.maskTd').addClass('hide');
                        $('.portal_tr').removeClass('move');
                    }
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
                //��ʾ�ر��Ż��༭��̬��
                editModalShow:function(id){
                    $('#editModal').modal('show')
                    var _this = this;
                    
                    _this.getEditInfo(id);
                    setTimeout(function(){
                        $('#edit_box').scrollTop(0);
                    }, 200);
                },
                editModalHide:function(){
                    $('#editModal').modal('hide');
                    logo_img_id = '';
                    logo_img_name = '';
                },
                //��ʾ��¡ģ̬��
                cloneModalShow:function(id,is_new){
                    $('#cloneModal').modal('show');
                    var _this = this;
                    $('input[name=portal_id]').val(id);
                    $('input[name=is_new]').val(is_new);
                },
                cloneModalHide:function(){
                    $('#cloneModal').modal('hide');
                },
                //��¡�ύ
                cloneSubmit:function(){
                    var _this = this;
                    var cloneParams = {};
                    cloneParams.clone_name = $('input[name=cloneName]').val();
                    if($.trim(cloneParams.clone_name) === ''){
                        alert('ģ�����Ʋ���Ϊ��');
                        return;
                    }

                    if(cloneParams.clone_name.length>20){
                        alert('�Ż����Ʋ�����20���ַ�');
                        return;
                    }
                    cloneParams.portal_id = $('input[name=portal_id]').val();
                    cloneParams.is_new = $('input[name=is_new]').val();
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/cloneportal',
                        data:cloneParams,
                        success:function(res){
                            if(res.status==1){
                                _this.cloneModalHide();
                                _this.portalList();
                                $('input[name=cloneName]').val('');
                            }else{
                                alert('��ȡ�Ż��༭����ʧ��');
                            }
                        },
                        error:function(){
                            alert('��ȡ�Ż��༭����ʧ��');
                        }
                    });
                },
                //��ʾ�ر�ͼ����̬��
                iconModalShow:function(id){
                    $('#iconModal').modal('show');
                    var _this = this;
                    _this.uploadIcon();
                    
                    var icon = $('#portal_icon').attr('src');
                    var reg = /\/static\/portal\/index\/icons\/png8\/([0-6])\.png/;
                    if (reg.test(icon)) {
                        var result = reg.exec(icon)
                        var index = parseInt(result[1])
                        
                        selected = index
                        $('#otherImg').hide();
                        _this.getSystemIcon(index);
                    } else {
                        $('#otherImg').show();
                        selected = 7;
                        previewSrc = icon;
                        $('#otherImg').attr('src',icon);
                        $('#otherImg').addClass('selected');
                    }
                },
                iconModalHide:function(){
                    $('#iconModal').modal('hide')
                    $('.cropper-content').show();
                    $('#new-portrait-wrapper').hide();
                },
                //�������ݴ�
                buildStr:function(arr,key){
                    var str = '';
                    $.each(arr,function(index,value){

                        str +=value[key]+',';
        
                    })
                    return str;
                },
                //��ȡ�Ż��༭����
                getEditInfo:function(id){
                    var _this = this; 
                    var params = {
                        portal_id:id
                    };
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalmanagement/editportal',
                        data:params,
                        success:function(res){
                            if(res[0].status==1){
                                
                                editData = res[0].data_info[0];
                                editParams.log_keep_time = res[0].data_info[0].log_keep_time;
                                _this.changeLogKeep(editParams.log_keep_time);
                                
                                var managePrivUser = $.extend(true,[],res[0].data_info);

                                managePrivUser[0].manageIds = _this.buildStr(managePrivUser[0].manage_priv_user,'uid');
                                managePrivUser[0].manageNames =_this.buildStr(managePrivUser[0].manage_priv_user,'username');

                                managePrivUser[0].deptIds = _this.buildStr(managePrivUser[0].access_priv_dept,'dept_id');
                                managePrivUser[0].deptNames =_this.buildStr(managePrivUser[0].access_priv_dept,'dept_name');

                                managePrivUser[0].privIds = _this.buildStr(managePrivUser[0].access_priv_priv,'priv_id');
                                managePrivUser[0].privNames =_this.buildStr(managePrivUser[0].access_priv_priv,'priv_name');

                                managePrivUser[0].userIds = _this.buildStr(managePrivUser[0].access_priv_user,'uid');
                                managePrivUser[0].userNames =_this.buildStr(managePrivUser[0].access_priv_user,'username');
                                
                                _this.editTpl(managePrivUser);

                                res[0].data_info[0].manage_auth!='0'?$('#powerFilter').removeClass('hide'):$('#powerFilter').addClass('hide');

                                if(managePrivUser[0].access_flag == 2){
                                    $('.powerList').removeClass('hide')
                                }

                                
                            }else{
                                alert('��ȡ�Ż��༭����ʧ��');
                            }
                        },
                        error:function(){
                            alert('��ȡ�Ż��༭����ʧ��');
                        }
                    })
                },
                //����Ȩ������
                buildPowerArr:function(ids,names,idStr,nameStr){
                    
                    var arrInfo = [];
                    
                    if(ids=='ALL_DEPT'&&names=='ȫ�岿��'){
                        arrInfo = [{dept_id:ids,dept_name:names}];
                        return arrInfo;
                    }

                    var idsArr = ids.split(",");
                    var namesArr = names.split(",");
                    idsArr.splice(idsArr.length-1,1);
                    namesArr.splice(namesArr.length-1,1);
                    $.each(idsArr,function(index,value){
                        var obj = {};
                        obj[idStr] = value;
                        arrInfo.push(obj);
                    });

                    $.each(namesArr,function(index,value){
                        arrInfo[index][nameStr] = value;
                    });
                    return arrInfo;
                },
                //�ύ�༭����
                setEditInfo:function(){
                    var _this = this;
                    
                    editParams.portal_id = $('#portal_id').val();
                    editParams.access_priv_dept = _this.buildPowerArr($('#DEPT_IDS').val(),$('#DEPT_NAMES').val(),'dept_id','dept_name');
                    editParams.access_priv_priv = _this.buildPowerArr($('#PRIV_IDS').val(),$('#PRIV_NAMES').val(),'priv_id','priv_name');
                    editParams.access_priv_user = _this.buildPowerArr($('#USER_IDS').val(),$('#USER_NAMES').val(),'uid','username');
                    editParams.manage_priv_user = _this.buildPowerArr($('#POWER_USER_IDS').val(),$('#POWER_USER_NAMES').val(),'uid','username');
                    editParams.portal_name = $('#portal_name').val();
                    editParams.portal_icon_url = $('#portal_icon').attr('src');
                    editParams.access_flag = $("input:radio[name=power]:checked").val();
                    editParams.use_flag = $("input:radio[name=status]:checked").val();
                    editParams.logo_img_id = logo_img_id;
                    editParams.logo_img_name = logo_img_name;

                    if($.trim(editParams.portal_name) === ''){
                        alert('�Ż����Ʋ���Ϊ��');
                        return;
                    }

                    if(editParams.portal_name.length>20){
                        alert('�Ż����Ʋ�����20���ַ�');
                        return;
                    }
                    
                    if(editParams.access_priv_dept.length==0&&editParams.access_priv_priv.length==0&&editParams.access_priv_user.length==0&&editParams.access_flag==2){
                        alert('��ǰָ������Ȩ�޲���Ϊ��');
                        return;
                    }
                    if(editParams.log_keep_time>99||editParams.log_keep_time<0||editParams.log_keep_time===''){
                        alert('��������ȷ����־����ʱ��');
                        return;
                    }
                    
                    $.ajax({
                        type:'POST',
                        url:'/general/appbuilder/web/portal/portalmanagement/updateportal',
                        data:editParams,
                        success:function(res){
                            if(res[0].status==1){
                                _this.editModalHide();
                                _this.portalList();
                            }
                        },
                        error:function(){
                            alert('�༭�Ż�����ʧ��');
                        }
                    })
                },
                //ϵͳͼ��ѡ��
                getSystemIcon:function(index){
                    if(index!=7){
                        $('#icon-list').find('li').removeClass('selected');
                        $('#icon-list').find('li').eq(index).addClass('selected');
                        $('#otherImg').removeClass('selected');
                    }else{
                        $('#otherImg').addClass('selected');
                        $('#icon-list').find('li').removeClass('selected');
                    }
                    
                    selected = index;
                },
                //�ϴ�ͼƬ
                uploadIcon:function(){
                    var _this = this;
                    
                    $('#new-portrait-wrapper').hide();
                    var icon = editData.portal_icon_url;
                    var reg = /\/static\/portal\/index\/icons\/png8\/([0-6])\.png/;
                    if (reg.test(icon)) {
                        var result = reg.exec(icon)
                        var index = parseInt(result[1])
                        
                        selected = index
                        _this.getSystemIcon(index);
                    } else {
                            selected = 7;
                            previewSrc = icon;
                    }

                    //�����̨����
                    cropData = {
                        x: undefined,
                        y: undefined,
                        w: 0,
                        h: 0,
                        originW: 0,
                        originH: 0,
                        compressW: 0,
                        id: null,
                        name: '',
                        geneAvatar: true,
                        isGif: false
                    };
                    //Ϊ.filePicker����uploader
                    (function () {
                        var pickBtns = $('.filePicker');
                        pickBtns.each(function (index, item) {
                            makeUploader(item.id);
                        });
                        
                    })();

                    //uploader������
                    function makeUploader(pick) {
                        // ��ʼ��Web Uploader
                        var uploader = WebUploader.create({
                            // ѡ���ļ����Ƿ��Զ��ϴ���
                            auto: true,
                            // swf�ļ�·��
                            swf: '/static/js/webuploader/Uploader.swf',
                            // �ļ����շ���ˡ�
                            // server: '/module/upload/upload.php',
                            server: '/general/appbuilder/web/portal/gateway/uploadfile',
                            // ѡ���ļ��İ�ť��
                            // �ڲ����ݵ�ǰ���д�����������inputԪ�أ�Ҳ������flash.
                            pick: '#' + pick,
                            // ֻ����ѡ��ͼƬ�ļ���
                            // accept: 'image/jpg,image/jpeg,image/png,image/gif',
                            accept: {
                                title: 'Images',
                                extensions: 'jpg,jpeg,png',
                                // mimeTypes: 'image/*'
                            },
                            //ѹ��ͼƬ�ϴ�
                            compress: {
                                width: 420,
                                height: 420,
                                // ͼƬ������ֻ��typeΪ`image/jpeg`��ʱ�����Ч��
                                quality: 90,
                                // �Ƿ�����Ŵ������Ҫ����Сͼ��ʱ��ʧ�棬��ѡ��Ӧ������Ϊfalse.
                                allowMagnify: false,
                                // �Ƿ�����ü���
                                crop: false,
                                // �Ƿ���ͷ��meta��Ϣ��
                                preserveHeaders: true,
                                // �������ѹ�����ļ���С��ԭ��������ʹ��ԭ��ͼƬ
                                // �����Կ��ܻ�Ӱ��ͼƬ�Զ���������
                                noCompressIfLarger: false,
                                // ��λ�ֽڣ����ͼƬ��СС�ڴ�ֵ���������ѹ����
                                compressSize: 0
                            },
                            fileSingleSizeLimit: 1048576
                        });
                        //�ļ���ӵ�����֮ǰ
                        uploader.on('beforeFileQueued', function (file, data) {

                        });

                        //�ϴ��ļ����������ʾ
                        uploader.on('error', function (type) {
                            if (type == 'Q_TYPE_DENIED') {
                                alert('��ѡ����ȷͼƬ�����ļ�')
                            } else {
                                alert('���ϴ�С��1M��ͼƬ')
                            }
                        });

                        // �ļ��ϴ��ɹ�����item��ӳɹ�class, ����ʽ����ϴ��ɹ���
                        uploader.on('uploadSuccess', function (file, data) {
                            //��ȡͼƬ��id��name
                            cropData.id = data.id;
                            cropData.name = data.name;

                            //�����������ϴ�ͼƬ
                            var _img = new Image();
                            //���ź���
                            var shrunkW;
                            //���ź�߶�
                            var shrunkH;
                            _img.src = data.url;
                            _img.id = "theImg";
                            _img.onload = function () {
                                //��ȡ�ϴ�ͼƬ��ԭʼ�ߴ�
                                cropData.originW = _img.width;
                                cropData.originH = _img.height;

                            //��jpgͼƬ�ϴ�ǰ��ѹ�����˴��жϳ����������С
                            if (_img.width > 420 || _img.height > 420) {
                                if (_img.width > _img.height) {//��ͼ
                                    shrunkW = 420;
                                    shrunkH = parseInt(420 * _img.height / _img.width);
                                } else {//��ͼ
                                    shrunkH = 420;
                                    shrunkW = parseInt(420 * _img.width / _img.height);
                                }
                            } else {
                                shrunkW = _img.width;
                                shrunkH = _img.height;
                            }
                            cropData.compressW = shrunkW;//ѹ�����


                            //����ͼƬ��ʾʱ�Ŀ��
                            this.width = shrunkW;
                            this.height = shrunkH;
                            $(this).width(shrunkW);
                            $(this).height(shrunkH);

                            //���÷���ͼ���url
                            $('.avatar-small-wrapper img').attr('src', data.url);
                            $('.portrait-content').empty()
                            $(this).appendTo('.portrait-content');

                            $('.cropper-content').hide();//����tbody
                            $('#new-portrait-wrapper').show(function () {//��ʾ�ü����
                                initCrop(data.url, shrunkW, shrunkH);//��ʼ���ü�����
                            });

                            uploader.removeFile(file, true);//�Ӷ�����ɾ���ļ�
                            }
                        });

                        // �ļ��ϴ�ʧ�ܣ���ʾ�ϴ�����
                        uploader.on('uploadError', function (file) {
                            // console.info('�ϴ�ʧ��');
                        });
                    }
                    //ͷ��ü�������
                    var myCropper;
                    //��ʼ���ü�����
                    function initCrop(url, imgW, imgH) {
                        if (myCropper) {
                            myCropper.setImage(url, function () { });
                        }
                    //ѡ��������
                    var coords;
                    //����ͷ��ؼ�
                    $('#theImg').Jcrop({
                        onSelect: showCoords,
                        onChange: showPreview,
                        bgColor: 'black',
                        bgOpacity: .5,
                        addClass: 'jcrop-normal',
                        aspectRatio: 1,
                        minSize: [0, 0],
                        setSelect: [0, 0, 100, 100]
                    }, function () {
                        myCropper = this;
                        myCropper.setOptions({ bgFade: true });
                        myCropper.ui.selection.addClass('jcrop-selection');
                    });

                    function showCoords(c) {
                        cropData.x = c.x;
                        cropData.y = c.y;
                        cropData.w = c.w;
                        cropData.h = c.h;
                    }
                    function showPreview(coords) {
                        var rx1 = 180 / coords.w;
                        var ry1 = 180 / coords.h;
                        var rx2 = 90 / coords.w;
                        var ry2 = 90 / coords.h;
                        $('.avatar-small').css({
                            width: Math.round(rx2 * imgW) + 'px',
                            height: Math.round(ry2 * imgH) + 'px',
                            marginLeft: '-' + Math.round(rx2 * coords.x) + 'px',
                            marginTop: '-' + Math.round(ry2 * coords.y) + 'px'
                        });
                    }
                    }
                },
                //�ύͼƬ
                submitIcon:function(){
                    var _this = this;
                    //�ж��ǲ��ǲü�ҳ��
                    if (document.getElementById('new-portrait-wrapper').style['display'] === 'block') {
                        $.ajax({
                            type: "GET",
                            url: "/general/appbuilder/web/portal/gateway/uploadportalfile",
                            data: cropData,
                            dataType: "text",
                            success: function (data) {
                                var myData = JSON.parse(data)
                                if (myData.status !== 1) {
                                    alert('ͼƬ�ü�ʧ��')
                                } else {
                                    previewSrc = myData.data;
                                    logo_img_id = myData.logo_img_id;
                                    logo_img_name = myData.logo_img_name;
                                    $('#otherImg').attr('src',previewSrc);
                                    $('#otherImg').show();
                                    $('#otherImg').addClass('selected');
                                    selected = 7;
                                    _this.getSystemIcon(selected);
                                    $('.cropper-content').show();
                                    $('#new-portrait-wrapper').hide();
                                }
                            },
                            error: function (e) {
                            }
                        });
                    } else {
                        //�ϴ�����
                        if (selected === 7) {
                            $('#portal_icon').attr('src',previewSrc);
                            if($('#portal_icon').prop("className").indexOf('up_img')==-1){
                                $('#portal_icon').addClass('up_img');
                            }
                        } else {
                            // console.log($('#portal_icon').prop("className"));
                            if($('#portal_icon').prop("className").indexOf('up_img')!=-1){
                                $('#portal_icon').removeClass('up_img');
                            }
                            $('#portal_icon').attr('src','/static/portal/index/icons/png8/'+selected+'.png');
                        }
                        _this.iconModalHide();
                    }
                },

                //Ȩ��ѡ��
                changeOutPower:function(value){
                    
                    if(value==2){
                        $('.powerList').removeClass('hide');
                    }else{
                        $('.powerList').addClass('hide');
                    }
                },
                //log����
                changeLogKeep:function(value){  
                    if(value==3 || value==0){
                        $('#keep_power').attr("disabled",true);
                        $('#keep_power').val('1');
                        value==3?editParams.log_keep_time = 3:editParams.log_keep_time = 0;
                        
                    }else{
                        $('#keep_power').attr("disabled",false);
                        if($('#keep_power').val()==''){
                            editParams.log_keep_time = '';
                        }
                        editParams.log_keep_time = parseInt($('#keep_power').val());
                    }
                },
                //����ʱ���ж�
                keepTimeFilter:function(value){
                    if(value<1||value>99){
                        alert('�ɱ���ʱ��Ϊ1~99����');
                    }
                    if(value===''){
                        editParams.log_keep_time = value
                    }else{
                        editParams.log_keep_time = parseInt(value);
                    }
                },
                //�����ת
                jump:function(id){
                    if (window["context"] == undefined) { 
                        if (!window.location.origin) { 
                            window.location.origin = window.location.protocol + "//" + window.location.hostname + 
                                (window.location.port ? ':' + window.location.port : ''); 
                        } 
                        window["context"] = location.origin + "/V6.0"; 
                    } 
                    var url = window.location.origin + '/portal/views/workbench/#/portalBuilder/' + id + '?action=edit' //�հ��Ż� id��0 ģ�崫ģ��id

                    if (window.parent && typeof window.parent.createTab == 'function') { 
                        window.parent.createTab('portal-builder-'+id,'�༭�Ż�', url, '') 
                    }else{
                        window.location.href = url;
                    }
                },
                //�½���ת
                buildNew:function(){
                    if (window["context"] == undefined) {
                        if (!window.location.origin) { 
                            window.location.origin = window.location.protocol + "//" + window.location.hostname + 
                                (window.location.port ? ':' + window.location.port : ''); 
                        } 
                        window["context"] = location.origin + "/V6.0"; 
                    } 
                    var url = window.location.origin + '/portal/views/workbench/#/portalBuilder/' + 0 + '?action=add' //�հ��Ż� id��0 ģ�崫ģ��id

                    if (window.parent && typeof window.parent.createTab == 'function') { 
                        window.parent.createTab('portal-builder-'+ 0,'�༭�Ż�', url, '')
                    }else{
                        window.location.href = url;
                    }
                }
            }
            portalManage.init();
            window.portalManage = portalManage;
        });
    })(jQuery);
