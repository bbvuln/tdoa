/**
 *  @uploader �����ϴ�Ԥ�����
 *  @author ��� <jx@tongda2000.com>
 *  @date 2013-10-8
 *  @requires jQuery SWFUpload
 */

(function($, win){
    var doc = document,
        log = function()
        {
            if(window.console)
            {
              //  window.console.log(arguments);
            }
        },
        uploader,
        configs = {
            type: "flash",
            module: 'upload_temp',
            imageType: "gif,jpg,jpeg,png,bmp",
            prefix: "ATTACHMENT",
            action: "/module/upload/upload.php",
            fieldId: 'ATTACHMENT_ID_OLD',
            fieldName: 'ATTACHMENT_NAME_OLD',
            sortable: false,
            limitType: '',
            flash: {
                flash_url: '/module/swfupload/swfupload.swf',
                upload_url: '/module/upload/upload.php',
                file_upload_limit: 0,
                file_queue_limit: 0,
                button_width:  100,
                button_height:  100,
                debug: false,
                button_placeholder_id: 'flash_upload',
                button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                post_params: {"PHPSESSID" : ""}

            }
        };

    function format(result, args)
    {
        if (arguments.length > 1) {
            if (arguments.length == 2 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
        }
        return result;
    }

    function convertByteSize(bytes)
    {
        var i = -1;
        do {
            bytes = bytes / 1024;
            i++;
        } while (bytes > 99);
        return Math.max(bytes, 0.1).toFixed(1) + ['kB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];
    }

    var Uploader = function()
    {
        this.init.apply(this, arguments);
    };
    Uploader.configs = configs;
    Uploader.prototype = {
        constructor: Uploader,
        TEMPLATE:
        {
            mask: '<div class="uploader-mask"></div>',
            el: '<div class="uploader-wrapper">' +
                    '<div class="uploader-container"> ' +
                        '<div class="uploader-header"> ' +
                            '<a id="uploader-close" href="javascript:void(0);" class="uploader-close">��</a>'+
                            '<span class="upload-title">ͼƬ�����ϴ�</span>' +
                        '</div>' +
                        '<a id="flash_upload_btn" class="flash-upload-btn flash-upload-btn-pos-1 btn btn-primary">'+
                            '<span>����ϴ��ļ�</span>'+
                            '<i id="flash_upload"></i>'+
                        '</a>'+
                        '<div id="flash-content" class="fu-flash-content">'+
                            '<span class="fu-flash-ctrl">��סCtrl�ɶ�ѡ�ļ�</span>' +
                        '</div>' +
                        '<div id="upload-queue" class="fu-flash-queue">'+
                        '</div>' +
                        '<div class="uploader-footer"> ' +
                            '<button class="insert-all-btn btn btn-info">��������ͼƬ</button>'+

                            '<button class="finish-upload-btn btn">���</button>'+
                        '</div>' +
                    '</div>' +
                '</div>'
        },
        init: function(cfg)
        {
           // var $tmpl = $(this.TEMPLATE).appendTo('body');
            this.$mask = $(this.TEMPLATE.mask).appendTo('body');
            this.$el = $(this.TEMPLATE.el).appendTo('body');
            this.$el.data('uploader', this);
            this.options = $.extend(true, {}, configs, cfg);
            this.bindEvent();
            // this.initSWFUpload();
            this.newInitSWFUpload();
            this.initUploadPreview();
            this.initAttachField();
            this.$flashBtn = this.$el.find('.flash-upload-btn');
            this.checkQueue();
        },
        initSWFUpload: function()
        {
            var flashOpts = this.options.flash;

            flashOpts.custom_settings = flashOpts.customSettings || {};
            flashOpts.custom_settings.uploader = this;
            flashOpts.post_params.module = this.options.module;
            flashOpts.file_queued_handler = this.fileQueued;
            flashOpts.file_queue_error_handler = this.fileQueueError;
            flashOpts.file_dialog_complete_handler = this.fileDialogComplete;
            flashOpts.upload_start_handler = this.uploadStart;
            flashOpts.upload_progress_handler = this.uploadProgress;
            flashOpts.upload_error_handler = this.uploadError;
            flashOpts.upload_success_handler = this.uploadSuccess;
            flashOpts.upload_complete_handler = this.uploadComplete;
            flashOpts.queue_complete_handler = this.queueComplete;
            
            this.SWFUpload = new SWFUpload( flashOpts );
        },
        newInitSWFUpload:function(){
            var _this = this;

            var uploader = WebUploader.create({
                // ѡ���ļ����Ƿ��Զ��ϴ���
                auto: true,
                // swf�ļ�·��
                swf: '/static/js/webuploader/Uploader.swf',
                // �ļ����շ���ˡ�
                // server: '/module/upload/upload.php',
                server: "/module/upload/upload.php",
                // ѡ���ļ��İ�ť��
                // �ڲ����ݵ�ǰ���д�����������inputԪ�أ�Ҳ������flash.
                pick:{
                        id:"#flash_upload",
                        multiple:true
                },
                // accept: 'image/jpg,image/jpeg,image/png,image/gif',
                accept: {
                    title: 'Images',
                    extensions: 'gif,jpg,jpeg,png,bmp',
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
                fileVal:'Filedata',
                // fileSingleSizeLimit: 1048576
            });

            uploader.on('beforeFileQueued', function (file, data) {
                
            });

            uploader.on('filesQueued',function(files){
                
            })

            uploader.on('startUpload',function(){
                
            })

            uploader.on('uploadSuccess', function (file, serverData) {
                var filePreviewItem = new UploaderPreviewItem(_this.preview, file, _this.preview.store.length)
                _this.preview.store.push(filePreviewItem)
                var data = eval(serverData);
                    if(data.state == 'SUCCESS'){
                        filePreviewItem.setData(data);
                        filePreviewItem.setImgSrc(data.url);
                        filePreviewItem.setComplete();
                        filePreviewItem.setStatus("�ϴ���ɡ�");
                    }
                    else{
                        filePreviewItem.setError();
                        filePreviewItem.setStatus( td_lang.module.msg_50+ data.state);//"�ϴ�ʧ�ܣ�"
                        var stats=this.getStats();
                        stats.successful_uploads--;
                        stats.upload_errors++;
                        /* _this.setStats(stats); */
                    }
                    _this.checkQueue();
                return;

            });

            uploader.on('error', function (type) {

                switch(type){
                    case 'Q_EXCEED_SIZE_LIMIT':
                        alert('��ӵ��ļ��ܴ�С�����趨��ֵ');
                        break;
                    case 'Q_TYPE_DENIED':
                        alert('�ļ����Ͳ�����');
                        break;
                    case 'F_DUPLICATE':
                        alert('���ļ��Ѿ����');
                        break;
                }
            });

            this.uploader = uploader;
            
        },
        initUploadPreview: function()
        {
            this.preview = new UploaderPreview( this, this.$el.find('.fu-flash-queue') );
        },
        initAttachField: function()
        {
            this.$fieldId = $('[name='+this.options.fieldId+']');
            this.$fieldName = $('[name='+this.options.fieldName+']');
            this.originalFieldId = this.$fieldId.val();
            this.originalFieldName = this.$fieldName.val();
        },
        setAttachField: function()
        {
            var idStore = [], nameStore = [], uploader = this;
            $.each(uploader.preview.store, function(){
                if(this.status == 'complete')
                {
                    var attachInfo = this.getData();
                    idStore.push(attachInfo.id);
                    nameStore.push(attachInfo.name);
                }
            });

            this.$fieldId.val( this.originalFieldId + idStore.join('') );
            this.$fieldName.val( this.originalFieldName + nameStore.join('') );
        },
        bindEvent: function()
        {
            var self;
            this.$el.delegate('.uploader-close', 'click', $.proxy(this.closeHandler, this));
            this.$el.delegate('.finish-upload-btn', 'click', $.proxy(this.completeHandler, this));
            this.$el.delegate('.insert-all-btn', 'click', $.proxy(this.insertAllHandler, this));
            $(this.options.target).click($.proxy(this.open, this));
            /*
            this._win_unload = window.onbeforeunload;
            window.onbeforeunload = function(){
                return '������δ����ĸ�����ȷ�Ϲر�?';
            };
            */
        },
        insertAllHandler: function()
        {
            $.each(this.preview.store, function(){
                this.insert();
            });
        },
        completeHandler: function()
        {
            this.close();
        },
        closeHandler: function()    
        {
            this.close();
            if(jQuery('.queue-file-list li').length != ''){
                alert("�ļ����ϴ�,�粻��Ҫ��ЩͼƬ,���ֶ�ɾ���ļ�")
            }else{
                return false;
            }
        },
        open: function()
        {
            this.$el.show();
            this.$mask.show();
        },
        close: function()
        {
            this.setAttachField();
            this.$el.hide();
            this.$mask.hide();
        },
        add: function(file)
        {
            var index = this.preview.search(file);
            if(index == -1)
            {
                this.preview.add(file);
                index = this.preview.store.length - 1;
            }
            this.checkQueue();
            return this.preview.store[index];
        },
        getProgress: function(file)
        {
            var index = this.preview.search(file);
            return this.preview.store[index];
        },
        checkQueue: function()
        {
            if(this.preview.store.length)
            {
                this.$el.find('.fu-flash-content').hide();
                this.$el.find('.uploader-footer').show();
                this.$el.find('.fu-flash-queue').show();
                this.$flashBtn.removeClass('flash-upload-btn-pos-1').addClass('flash-upload-btn-pos-2');
            }
            else
            {
                this.$el.find('.fu-flash-content').show();
                this.$el.find('.uploader-footer').hide();
                this.$el.find('.fu-flash-queue').hide();
                this.$flashBtn.removeClass('flash-upload-btn-pos-2').addClass('flash-upload-btn-pos-1');
            }
        },
        fileQueued: function(file)
        {
            var oa_limit_type = this.customSettings.uploader.options.limitType;
            try {
                /*
                //����ļ��Ƿ������
                for(var i=0;i<file.index;i++)
                {
                    var file_i = this.getFile(i);
                    if(file_i.filestatus !=SWFUpload.FILE_STATUS.CANCELLED && file_i.name==file.name && file_i.size==file.size && file_i.creationdate.getTime()==file.creationdate.getTime() && file_i.modificationdate.getTime()==file.modificationdate.getTime())
                    {
                        var msg1 = sprintf(td_lang.inc.msg_114,file.name);
                        alert(msg1);
                        this.cancelUpload(file.id);
                        return;
                    }

                }
                */
                //���OA���ò������ϴ�ĳЩ�����ļ���ʱ�򣬽��м��
                var fileType = file.type.toLowerCase().substr(1);
                if(oa_upload_limit == 1 && (oa_limit_type.indexOf(fileType+",")==0 || oa_limit_type.indexOf(","+fileType+",")>0))
                {
                    var msg2 = sprintf(td_lang.inc.msg_115,fileType);
                    alert(msg2);
                    this.cancelUpload(file.id);
                    return;
                }
                this.customSettings.uploader.add(file);
            } catch (ex) {
                this.debug(ex);
            }
        },
        fileQueueError: function(file, errorCode, message)
        {
            try {
                if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                    var msg3 = sprintf(td_lang.inc.msg_116,message);
                    alert(td_lang.module.msg_35+"\n" + (message === 0 ? "" : msg3));
                    return;
                }

                var progress = this.customSettings.uploader.getProgress(file);
                progress.setError();
                progress.toggleCancel(false);

                switch (errorCode) {
                case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
                    var msg4 = sprintf(td_lang.inc.msg_117,Math.ceil(file.size/1024/1024),this.settings['file_size_limit']);
                    progress.setStatus(msg4);
                    this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
                    progress.setStatus(td_lang.module.msg_47);//"�����ϴ�0�ֽ��ļ�"
                    this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
                    progress.setStatus(td_lang.module.msg_48);//"��Ч���ļ�����"
                    this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                default:
                    if (file !== null) {
                        progress.setStatus(td_lang.module.msg_49 + message);//"δ֪����"
                    }
                    this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                }
            } catch (ex) {
                this.debug(ex);
            }
        },
        fileDialogComplete: function(numFilesSelected, numFilesQueued)
        {
            try {
                if (numFilesSelected > 0) {
                }

                /* I want auto start the upload and I can do that here */
                this.startUpload();
            } catch (ex)  {
                this.debug(ex);
            }
        },
        uploadStart: function(file)
        {
            try {
                /* I don't want to do any file validation or anything,  I'll just update the UI and
                return true to indicate that the upload should start.
                It's important to update the UI here because in Linux no uploadProgress events are called. The best
                we can do is say we are uploading.
                 */

                var progress = this.customSettings.uploader.getProgress(file);
                progress.startUpload();
            }
            catch (ex) {
               this.debug(ex);
            }
            return true;
        },
        uploadProgress: function(file, bytesLoaded, bytesTotal)
        {
            try {
                var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);
                var progress = this.customSettings.uploader.getProgress(file);
                progress.setProgress(percent);
            } catch (ex) {
                this.debug(ex);
            }
        },
        uploadSuccess: function(file, serverData)
        {
            try {
                var progress = this.customSettings.uploader.getProgress(file);
                var data = eval('(' + serverData + ')');
                if(data.state == 'SUCCESS'){
                    progress.setData(data);
                    progress.setImgSrc(data.url);
                    progress.setComplete();
                    progress.setStatus("�ϴ���ɡ�");
                }
                else{
                    progress.setError();
                    progress.setStatus( td_lang.module.msg_50+ data.state);//"�ϴ�ʧ�ܣ�"
                    var stats=this.getStats();
                    stats.successful_uploads--;
                    stats.upload_errors++;
                    /* this.setStats(stats); */
                }
                /*if(serverData.substr(0,5)=="-ERR ")
                {
                   progress.setError();
                   progress.setStatus( td_lang.module.msg_50+ serverData.substr(5));//"�ϴ�ʧ�ܣ�"

                   var stats=this.getStats();
                   stats.successful_uploads--;
                   stats.upload_errors++;
                   this.setStats(stats);
                }
                else
                {
                   var data = eval('(' + serverData + ')');
                   progress.setData(data);
                   progress.setImgSrc(data.url);
                   progress.setComplete();
        		   progress.setStatus("�ϴ���ɡ�");
                }*/

            } catch (ex) {
                this.debug(ex);
            }
        },
        uploadError: function(file, errorCode, message)
        {
            try {
                var progress = this.customSettings.uploader.getProgress(file);
                progress.setError();

                switch (errorCode) {
                case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                    progress.setStatus( td_lang.module.msg_51+ message);//"HTTP����"
                    this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                    progress.setStatus( td_lang.module.msg_52+ message);//"�ϴ�ʧ�ܣ�"
                    this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                    progress.setStatus( td_lang.module.msg_53+ message);//"������(IO)����"
                    this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                    progress.setStatus( td_lang.module.msg_54+ message);//"��ȫ����"
                    this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                    progress.setStatus( td_lang.module.msg_55+ message);//"�ﵽ�ϴ����ƣ�"
                    this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                    progress.setStatus( td_lang.module.msg_56+ message);//"�޷���֤�������ϴ���"
                    this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                    // If there aren't any files left (they were all cancelled) disable the cancel button
                    if (this.getStats().files_queued === 0) {
                    }
                    progress.setStatus(td_lang.module.msg_57);//"��ȡ��"
                    break;
                case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                    progress.setStatus(td_lang.module.msg_58);//"��ֹͣ"
                    break;
                default:
                    progress.setStatus( td_lang.module.msg_49+ errorCode);//"δ֪����"
                    this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
                    break;
                }
            } catch (ex) {
                this.debug(ex);
            }
        },
        uploadComplete: function(file)
        {
            if (this.getStats().files_queued === 0) {

            }
            //var progress = this.customSettings.uploader.getProgress(file);
            //var attachData = progress.getData();
        },
        // This event comes from the Queue Plugin
        queueComplete: function(numFilesUploaded)
        {
        }

    };

    var UploaderPreview =  function()
    {
        this.init.apply(this, arguments);
    };

    UploaderPreview.prototype = {
        constructor: UploaderPreview,
        TEMPLATE: '<ul class="queue-file-list clearfix"></ul>',
        init: function(uploader, container)
        {
            if(!uploader)
            {
                return;
            }
            this.uploader = uploader;
            this.$el = $(this.TEMPLATE);
            container.html(this.$el);
            this.$el.data('uploaderPreivew', this);
            this.store = [];
        },
        add: function(file)
        {
            this.store.push( new UploaderPreviewItem(this, file, this.store.length) );
            this.uploader.checkQueue();
        },
        remove: function(index)
        {
            var item = this.store.splice(index, 1)[0];
            item && item.remove();
            this.uploader.checkQueue();
        },
        removeByData: function(data)
        {
            var index = this.search(data);

            if(index >= 0)
            {
                this.remove(index);
            }
        },
        clear: function()
        {
            $.each(this.store, function(){
                this.remove();
            });

            this.store = [];
            this.uploader.checkQueue();
        },
        search: function(data)
        {
            var index = -1;
            $.each(this.store, function(i, v){
                if(v.match(data))
                {
                    index = i;
                    return false;
                }
            });
            return index;
        }
    };

    var UploaderPreviewItem =  function()
    {
        this.init.apply(this, arguments);
    };

    UploaderPreviewItem.prototype = {
        constructor: UploaderPreviewItem,
        TEMPLATE:
            '<li id="queue-file-{id}" class="queue-file" data-name="{name}">' +
                '<div class="pic">' +
                    '<a href="javascript:void(0);"><img class="J_Pic_{id} preview-img" src="" /></a>' +
                '</div>' +
                '<div class=" J_Mask_{id} pic-mask"></div>' +
                '<div class="status-wrapper">' +
                    '<div class="status waiting-status"><p>�ȴ��ϴ������Ժ�</p></div>' +
                    '<div class="status start-status progress-status success-status">' +
                        '<div class="J_ProgressBar_{id} queue-progress-bar" role="progressbar">'+
                            '<div class="queue-progress-bar-value"></div>'+
                        '</div>'+
                    '</div>' +
                    '<div class="status error-status">' +
                        '<p class="J_ErrorMsg_{id}">���������ϣ����Ժ����ԣ�</p></div>' +
                '</div>' +
                '<div class="queue-file-btn-group clearfix">' +
                    '<button class="insert-pic btn btn-info" >��������</button>' +
                    '<button class="del-pic btn btn-danger" >ɾ��</button>' +
                '</div>' +
            '</li>',
        init: function(preview, data, index)
        {
            if(!preview)
            {
                return;
            }
            this.preview = preview;
            this.uploader = preview.uploader;
            this.$el = $( format(this.TEMPLATE, data) );
            this.$el.data('uploaderPreivewItem', this);
            this.data = data;
            this.index = index;
            preview.$el.append(this.$el);
            this.bindEvent();
        },
        bindEvent: function()
        {
            this.$el.delegate('.del-pic', 'click', $.proxy(this.removeHandler, this));
            this.$el.delegate('.insert-pic', 'click', $.proxy(this.insertHandler, this));
        },
        match: function(v)
        {
            var data = this.data;
            return v.id == data.id && v.name == data.name && v.size == data.size;
        },
        insert: function()
        {
            if(this.src && this.status == 'complete' && $.isFunction(InsertImage))
            {
                InsertImage(this.src);
            }
        },
        insertHandler: function()
        {
            this.insert();
        },
        removeHandler: function()
        {
            this.preview.removeByData(this.data);
        },
        remove: function(fileid)
        {
            this.$el.remove();
            // this.uploader.SWFUpload.cancelUpload(this.data.id);
            this.uploader.uploader.removeFile(this.data.id);

        },
        setData: function(d)
        {
            this.extData = d;
        },
        getData: function()
        {
            return this.extData;
        },
        startUpload: function()
        {
            this.status = 'uploading';
            this.setProgress(0);
        },
        setProgress: function(v)
        {
            if (v > 100) v = 100;
            if (v < 0) v = 0;
            this.$el.find('.status-wrapper').children().hide();
            this.$el.find('.progress-status').show().find('.queue-progress-bar-value').width( v / 100 + '%' );
        },
        setError: function()
        {
            this.status = 'error';
            this.$el.find('.status-wrapper').children().hide();
            this.$el.find('.error-status').show();
        },
        setComplete: function()
        {
            this.status = 'complete';
            this.$el.find('.status-wrapper').children().hide();
        },
        setStatus: function()
        {

        },
        setImgSrc: function(src)
        {
            this.src = src;
            this.$el.find('img.preview-img').attr('src', src);
        }
    };

    window.Uploader = Uploader;

    $(document).ready(function(){
        $('.add_image_multi').each(function(){
            $.data(this, 'uploader', new Uploader({
                target: this,
                sortable: ('sortable' in $.fn),
                flash: {
                    file_types: "*.gif;*.jpg;*.jpeg;*.png;*.bmp",
                    file_types_description: "*.gif;*.jpg;*.jpeg;*.png;*.bmp"
                }
            }))
        });
    });

})(jQuery, window);
