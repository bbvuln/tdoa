
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
                //列表请求
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
                                alert('获取门户列表失败');
                            }

                        },
                        error:function(error){
                            
                            // alert('获取门户列表失败');
                        }

                    })
                },
                //前端搜索
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
                                $('#dra_btn').text('调整排序');
                                $('#portal_seach_box').css('marginRight',0);
                            }else{
                                $('#dra_btn').removeClass('hide');
                                $('#dra_btn').text('调整排序');
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
                    //         $('#dra_btn').text('调整排序');
                    //         $('#portal_seach_box').css('marginRight',0);
                    //     }else{
                    //         $('#dra_btn').removeClass('hide');
                    //         $('#dra_btn').text('调整排序');
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
                            $('#dra_btn').text('调整排序');
                            $('#portal_seach_box').css('marginRight',0);
                        }else{
                            $('#dra_btn').removeClass('hide');
                            $('#dra_btn').text('调整排序');
                            $('#portal_seach_box').css('marginRight',25+'px');
                        }
                        _this.filterListInfo(_this.searchListInfo.data_info,keyword);
                    });
                },
                //列表数据过滤
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
                //渲染列表模板
                templateShow:function(data){
                    $('#sortable').html($("#portal_tpl").tmpl(data));
                },
                //渲染编辑模板
                editTpl:function(data){
                    $('#edit_box').html($('#portal_edit').tmpl(data));
                },
                //栏目管理跳转
                columnJump:function(id,is_new,t_id){
                    window.location.href = './column.html?portal_id='+ id +'&is_new='+ is_new + '&t_id=' + t_id;
                },
                //修改启用状态
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
                                alert('修改门户启用状态失败');
                            }
                        },
                        error:function(){
                            alert('修改门户启用状态失败');
                        }
                    })
                },
                //删除
                delPortal:function(id){
                    var _this = this;
                    var params = {
                        portal_id:id
                    }
                    var r=confirm("是否确认删除该门户?")
                    if (r==true){
                        $.ajax({
                            type:'GET',
                            url:'/general/appbuilder/web/portal/portalmanagement/delportal',
                            data:params,
                            success:function(res){
                                if(res[0].status==1){
                                    alert('删除成功');
                                    _this.portalList();
                                }else if(res[0].status==2){
                                    alert(res[0].msg);
                                    _this.portalList();
                                }else{
                                    alert('删除门户失败');
                                }
                            },
                            error:function(error){
                                alert('删除失败');
                            }
                        })
                    }else{
                        return ;
                    }
                    
                },
                //拖拽请求
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
                                alert('拖拽排序失败')
                            }
                        },
                        error:function(error){
                            alert('拖拽排序失败')
                        }
                    })
                },
                //拖拽
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
                        $('#dra_btn').text('保存排序');
                        $('.maskTd').removeClass('hide');
                        $('.portal_tr').addClass('move');
                    } else {
                        jQuery("#sortable").sortable('destroy');
                        $('#dra_btn').text('调整排序');
                        $('.maskTd').addClass('hide');
                        $('.portal_tr').removeClass('move');
                    }
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
                //显示关闭门户编辑拟态框
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
                //显示克隆模态框
                cloneModalShow:function(id,is_new){
                    $('#cloneModal').modal('show');
                    var _this = this;
                    $('input[name=portal_id]').val(id);
                    $('input[name=is_new]').val(is_new);
                },
                cloneModalHide:function(){
                    $('#cloneModal').modal('hide');
                },
                //克隆提交
                cloneSubmit:function(){
                    var _this = this;
                    var cloneParams = {};
                    cloneParams.clone_name = $('input[name=cloneName]').val();
                    if($.trim(cloneParams.clone_name) === ''){
                        alert('模板名称不能为空');
                        return;
                    }

                    if(cloneParams.clone_name.length>20){
                        alert('门户名称不超过20个字符');
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
                                alert('获取门户编辑数据失败');
                            }
                        },
                        error:function(){
                            alert('获取门户编辑数据失败');
                        }
                    });
                },
                //显示关闭图标拟态框
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
                //生成数据串
                buildStr:function(arr,key){
                    var str = '';
                    $.each(arr,function(index,value){

                        str +=value[key]+',';
        
                    })
                    return str;
                },
                //获取门户编辑数据
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
                                alert('获取门户编辑数据失败');
                            }
                        },
                        error:function(){
                            alert('获取门户编辑数据失败');
                        }
                    })
                },
                //生成权限数据
                buildPowerArr:function(ids,names,idStr,nameStr){
                    
                    var arrInfo = [];
                    
                    if(ids=='ALL_DEPT'&&names=='全体部门'){
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
                //提交编辑数据
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
                        alert('门户名称不能为空');
                        return;
                    }

                    if(editParams.portal_name.length>20){
                        alert('门户名称不超过20个字符');
                        return;
                    }
                    
                    if(editParams.access_priv_dept.length==0&&editParams.access_priv_priv.length==0&&editParams.access_priv_user.length==0&&editParams.access_flag==2){
                        alert('当前指定访问权限不能为空');
                        return;
                    }
                    if(editParams.log_keep_time>99||editParams.log_keep_time<0||editParams.log_keep_time===''){
                        alert('请设置正确的日志保存时间');
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
                            alert('编辑门户数据失败');
                        }
                    })
                },
                //系统图标选择
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
                //上传图片
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

                    //定义后台数据
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
                    //为.filePicker生成uploader
                    (function () {
                        var pickBtns = $('.filePicker');
                        pickBtns.each(function (index, item) {
                            makeUploader(item.id);
                        });
                        
                    })();

                    //uploader生成器
                    function makeUploader(pick) {
                        // 初始化Web Uploader
                        var uploader = WebUploader.create({
                            // 选完文件后，是否自动上传。
                            auto: true,
                            // swf文件路径
                            swf: '/static/js/webuploader/Uploader.swf',
                            // 文件接收服务端。
                            // server: '/module/upload/upload.php',
                            server: '/general/appbuilder/web/portal/gateway/uploadfile',
                            // 选择文件的按钮。
                            // 内部根据当前运行创建，可能是input元素，也可能是flash.
                            pick: '#' + pick,
                            // 只允许选择图片文件。
                            // accept: 'image/jpg,image/jpeg,image/png,image/gif',
                            accept: {
                                title: 'Images',
                                extensions: 'jpg,jpeg,png',
                                // mimeTypes: 'image/*'
                            },
                            //压缩图片上传
                            compress: {
                                width: 420,
                                height: 420,
                                // 图片质量，只有type为`image/jpeg`的时候才有效。
                                quality: 90,
                                // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
                                allowMagnify: false,
                                // 是否允许裁剪。
                                crop: false,
                                // 是否保留头部meta信息。
                                preserveHeaders: true,
                                // 如果发现压缩后文件大小比原来还大，则使用原来图片
                                // 此属性可能会影响图片自动纠正功能
                                noCompressIfLarger: false,
                                // 单位字节，如果图片大小小于此值，不会采用压缩。
                                compressSize: 0
                            },
                            fileSingleSizeLimit: 1048576
                        });
                        //文件添加到队列之前
                        uploader.on('beforeFileQueued', function (file, data) {

                        });

                        //上传文件出错给出提示
                        uploader.on('error', function (type) {
                            if (type == 'Q_TYPE_DENIED') {
                                alert('请选择正确图片类型文件')
                            } else {
                                alert('请上传小于1M的图片')
                            }
                        });

                        // 文件上传成功，给item添加成功class, 用样式标记上传成功。
                        uploader.on('uploadSuccess', function (file, data) {
                            //获取图片的id和name
                            cropData.id = data.id;
                            cropData.name = data.name;

                            //按比例缩放上传图片
                            var _img = new Image();
                            //缩放后宽度
                            var shrunkW;
                            //缩放后高度
                            var shrunkH;
                            _img.src = data.url;
                            _img.id = "theImg";
                            _img.onload = function () {
                                //获取上传图片的原始尺寸
                                cropData.originW = _img.width;
                                cropData.originH = _img.height;

                            //非jpg图片上传前不压缩，此处判断长宽，并重设大小
                            if (_img.width > 420 || _img.height > 420) {
                                if (_img.width > _img.height) {//宽图
                                    shrunkW = 420;
                                    shrunkH = parseInt(420 * _img.height / _img.width);
                                } else {//长图
                                    shrunkH = 420;
                                    shrunkW = parseInt(420 * _img.width / _img.height);
                                }
                            } else {
                                shrunkW = _img.width;
                                shrunkH = _img.height;
                            }
                            cropData.compressW = shrunkW;//压缩后宽


                            //设置图片显示时的宽高
                            this.width = shrunkW;
                            this.height = shrunkH;
                            $(this).width(shrunkW);
                            $(this).height(shrunkH);

                            //设置返回图像的url
                            $('.avatar-small-wrapper img').attr('src', data.url);
                            $('.portrait-content').empty()
                            $(this).appendTo('.portrait-content');

                            $('.cropper-content').hide();//隐藏tbody
                            $('#new-portrait-wrapper').show(function () {//显示裁剪面板
                                initCrop(data.url, shrunkW, shrunkH);//初始化裁剪工具
                            });

                            uploader.removeFile(file, true);//从队列中删除文件
                            }
                        });

                        // 文件上传失败，显示上传出错。
                        uploader.on('uploadError', function (file) {
                            // console.info('上传失败');
                        });
                    }
                    //头像裁剪对象本身
                    var myCropper;
                    //初始化裁剪工具
                    function initCrop(url, imgW, imgH) {
                        if (myCropper) {
                            myCropper.setImage(url, function () { });
                        }
                    //选定的坐标
                    var coords;
                    //生成头像控件
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
                //提交图片
                submitIcon:function(){
                    var _this = this;
                    //判断是不是裁剪页面
                    if (document.getElementById('new-portrait-wrapper').style['display'] === 'block') {
                        $.ajax({
                            type: "GET",
                            url: "/general/appbuilder/web/portal/gateway/uploadportalfile",
                            data: cropData,
                            dataType: "text",
                            success: function (data) {
                                var myData = JSON.parse(data)
                                if (myData.status !== 1) {
                                    alert('图片裁剪失败')
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
                        //上传界面
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

                //权限选择
                changeOutPower:function(value){
                    
                    if(value==2){
                        $('.powerList').removeClass('hide');
                    }else{
                        $('.powerList').addClass('hide');
                    }
                },
                //log操作
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
                //保存时间判断
                keepTimeFilter:function(value){
                    if(value<1||value>99){
                        alert('可保存时间为1~99个月');
                    }
                    if(value===''){
                        editParams.log_keep_time = value
                    }else{
                        editParams.log_keep_time = parseInt(value);
                    }
                },
                //设计跳转
                jump:function(id){
                    if (window["context"] == undefined) { 
                        if (!window.location.origin) { 
                            window.location.origin = window.location.protocol + "//" + window.location.hostname + 
                                (window.location.port ? ':' + window.location.port : ''); 
                        } 
                        window["context"] = location.origin + "/V6.0"; 
                    } 
                    var url = window.location.origin + '/portal/views/workbench/#/portalBuilder/' + id + '?action=edit' //空白门户 id传0 模板传模板id

                    if (window.parent && typeof window.parent.createTab == 'function') { 
                        window.parent.createTab('portal-builder-'+id,'编辑门户', url, '') 
                    }else{
                        window.location.href = url;
                    }
                },
                //新建跳转
                buildNew:function(){
                    if (window["context"] == undefined) {
                        if (!window.location.origin) { 
                            window.location.origin = window.location.protocol + "//" + window.location.hostname + 
                                (window.location.port ? ':' + window.location.port : ''); 
                        } 
                        window["context"] = location.origin + "/V6.0"; 
                    } 
                    var url = window.location.origin + '/portal/views/workbench/#/portalBuilder/' + 0 + '?action=add' //空白门户 id传0 模板传模板id

                    if (window.parent && typeof window.parent.createTab == 'function') { 
                        window.parent.createTab('portal-builder-'+ 0,'编辑门户', url, '')
                    }else{
                        window.location.href = url;
                    }
                }
            }
            portalManage.init();
            window.portalManage = portalManage;
        });
    })(jQuery);
