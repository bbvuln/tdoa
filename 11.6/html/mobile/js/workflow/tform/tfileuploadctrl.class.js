define('TFileUploadCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TFileUploadCtrl = Base.extend({

        initialize: function(config) {
            TFileUploadCtrl.superclass.initialize.call(this, config);
            this.$config = config;
            this.id = config.id;
            this.low_id = config.id.toLowerCase();
            this.type = config.type;
            this.required = config.required;
            this.desc = config.desc;
            this.paraObj = {'id': config.id};
            this.paraStr = JSON.stringify(this.paraObj);
            this.$android_files = jQuery("#ANDROID_UPLOAD_FILES_"+this.id+"");
            this.$android_images = jQuery("#ANDROID_UPLOAD_IMAGES_"+this.id+"");
            this.$ios_images = jQuery("#IOS_UPLOAD_IMAGES_"+this.id+"");
            this.bindEvent();
        },
        
        bindEvent: function() {
            var self = this;
            this.$android_files && this.$android_files.on('click', function(){
                self.AndroidUploadFiles();
            });
            
            this.$android_images && this.$android_images.on('click', function(){
                self.AndroiduploadImages();
            });
            
            this.$ios_images && this.$ios_images.on('click', function(){
                self.IOSUploadImages();
            });
        },
        
        AndroidUploadFiles: function() {
            // alert(this.id);
            window.Android.uploadFiles(this.paraStr);
        },
        
        AndroiduploadImages: function() {
            // alert(this.id);
            window.Android.uploadImages(this.paraStr);
        },
        
        IOSUploadImages: function() {
            // alert(this.id);
            location = "uploadImages:" + this.id;
        }
        
    });
    exports.TFileUploadCtrl = window.TFileUploadCtrl = TFileUploadCtrl;
});

