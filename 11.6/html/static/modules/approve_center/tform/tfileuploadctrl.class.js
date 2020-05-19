define('TFileUploadCtrl',function(require, exports, module){
    var $ = jQuery;
    var Base = require('TBaseCtrl').TBaseCtrl;
    var TFileUploadCtrl = Base.extend({

        initialize: function(config)
        {
            TFileUploadCtrl.superclass.initialize.call(this, config);
            this.$obj = $('input[name="'+config.id+'"]').eq(0);
			this.dataname = config.id;
            this.$a = $('span[id="ATTACHMENT'+this.dataname+'_div"]');
            this.$s = $('div[id="SelFileDiv'+this.dataname+'"]');
            this.$divObj = $('#DIV_FILEUPLOAD_'+config.id+'');
            this.item_id = config.item_id;
            this.spanButtonUpload = "spanButtonUpload"+this.item_id;
            this.fsUploadArea = "fsUploadArea"+this.item_id;
            this.fsUploadProgress = "fsUploadProgress"+this.item_id;
            this.btnStart = "btnStart"+this.item_id;
            this.btnCancel = "btnCancel"+this.item_id;
            this.required = config.required;
            this.desc = config.desc;
            this.id = config.id;
            this.form_flag = config.form_flag;
            this.field_id = config.field_id;
            this.bindEvent();
            this.batch_upload(swfupload);
        },
        batch_upload:function(swfupload){
            var settings = {
                file_upload_limit : 0,
                file_queue_limit : 0,
                file_item_id : this.item_id,
                custom_settings : {
                    uploadArea : this.fsUploadArea,
                    progressTarget : this.fsUploadProgress ,
                    startButtonId : this.btnStart,
                    cancelButtonId : this.btnCancel
                },
                debug: false,

                // Button Settings
                button_text : "<span class='textUpload'>批量上传</span>",
                button_text_top_padding : 1,
                button_text_left_padding : 18,
                button_placeholder_id : this.spanButtonUpload,
                button_width: 70,
                button_height: 18,
                button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                button_cursor: SWFUpload.CURSOR.HAND,

                // The event handler functions are defined in handlers.js
                file_queued_handler : fileQueued,
                file_queue_error_handler : fileQueueError,
                file_dialog_complete_handler : fileDialogComplete,
                upload_start_handler : uploadStart,
                upload_progress_handler : uploadProgress,
                upload_error_handler : uploadError,
                upload_success_handler : uploadSuccess,
                //upload_complete_handler : uploadComplete,
                queue_complete_handler : queueCompleteEventHandler  // Queue plugin event
            };
            var temp_id = this.form_flag == true ? this.field_id : this.item_id;
            var append_item_id = "&ITEM_ID="+temp_id;//往window.upload_cfg1.upload_url追加ITEM_ID
            var upload_url = window.upload_cfg1.upload_url+append_item_id;
            window.upload_cfg1.upload_url = upload_url;

            if(typeof(window.swfupload_1) == "undefined")
            {
                // var swfupload = new Object();
                window.swfupload_1 = new Object();
            }
            window.swfupload_1[this.item_id] = swfupload_1[this.item_id] = new SWFUpload(jQuery.extend(true, {}, settings, window.upload_cfg1));
        },

        bindEvent: function() {
            var self = this;
            this.$divObj.find('a').bind('click', function(){
                var api = self.$divObj.find('a').last().data('tipsy');
                api && api.hide();
            })
        },

        setOffsetTop: function() {
            var obj_val = this.$obj.val(),
                $field = this.$divObj,
                $a = this.$a,
                $s = this.$s;
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && $a.find('span').length == 0 && $s.find('img').length == 0 && required_val)
            {
                if($field.find('a').last().length == 1)
                {
                    var objTop = $field.find('a').last().offset().top;
                    $("body,html").animate({
                        scrollTop: objTop - 150
                    },50);
                    return false;
                }
            }
        },

        onSubmit: function() {
            var obj_val = this.$obj.val(),
                $field = this.$divObj,
                $a = this.$a,
                $s = this.$s;
            var required_val = this.required;
            if((obj_val == '' || typeof obj_val == 'undefined') && $a.find('span').length == 0 && $s.find('img').length == 0 && required_val)
            {
                if($field.find('a').last().length == 1)
                {
                    this.validation(this.desc);
                    setTimeout(function(){
                        var api = $field.find('a').last().data('tipsy');
                        api && api.hide();
                    }, 5000);
                    return false;
                }
            }
        },

        validation: function(s) {
            this.$divObj.find('a').last().tipsy({
                title: function () {
                    this.title = this.getAttribute('original-title');
                    this.removeAttribute('original-title');
                    return '<b style="color:#E25C5C;">' + s + '</b>';
                },
                html: true,
                fade: true,
                gravity: $.fn.tipsy.autoWE,
                opacity: 1,
                trigger: 'manual',
                container: '#content-main',
                fixPos: function(tp){
                    //tp.left -= 50;
                    return tp;
                }
            }).tipsy('show');
        }

    });
    exports.TFileUploadCtrl = window.TFileUploadCtrl = TFileUploadCtrl;
});

