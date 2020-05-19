define('TImageUploadCtrl', function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var TImageUploadCtrl = Base.extend({

        initialize: function(config) {
            TImageUploadCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("." + config.parentid).find('.group-fields');
            this.title = config.title;
            this.initField(config);
            this.$config = config;
            this.$config.unCalc = true;
            this.id = config.id;
            this.lower_name = config.lower_name;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
            this.paraObj = {'id': config.id};
            this.paraStr = JSON.stringify(this.paraObj);
            this.$android_images = $("#ANDROID_UPLOAD_IMAGES_"+this.id+"");
            this.$ios_images = $("#IOS_UPLOAD_IMAGES_"+this.id+"");
            this.$list = $("#filelist_"+this.id).eq(0);
            this.bindEvent();
        },
        initField: function(config) {
            var self = this;
            /*
			config.list = [
				{attach_id: 'id1', attach_name: 'name1', attach_url: 'inc/attach/test1.png'}
			];
			*/
            var html = self.parseHtml(config);
            this.$el = $(html);
            this.$wrapper.append(this.$el);
        },
        parseHtml: function(d) {
            d['platform'] = platform; //增加ios对钉钉、微信附件按钮隐藏的兼容
            var tplHTML = '<% if(secret){ %>' +
                '<% } else{ %>' +
                '<div class="read_detail '+
                '<% if(hidden!=undefined && hidden==true){ %>' +
                ' hidden ' +
                '<% } %>' +
                '<% if(delete_priv !=undefined && delete_priv == false){ %>' +
                ' no_delete ' +
                '<% } %>' +
                '<% if(writable){ %>' +
                ' WriteDiv' +
                '<% } %>' +
                ' tag-fileupload">' +
                '<% if(required){ %>' +
                '<span class="isrequired">*</span>' +
                '<% } %>' +
                '<em><%=title%>：</em><div class="field">' +
				'<button type="button" id="ANDROID_UPLOAD_IMAGES_<%=id%>" class="ui-btn ANDROID_UPLOAD_IMAGES" ' +
                '<% if(!writable){ %>' +
                'disabled' +
                '<% } %>' +
                '>上传图片</button>' +
                '<% if(platform == "client"){ %>' +
                '<% } %>' +
                '<button type="button" id="IOS_UPLOAD_IMAGES_<%=id%>" class="ui-btn IOS_UPLOAD_IMAGES" ' +
                '<% if(!writable){ %>' +
                'disabled' +
                '<% } %>' +
                '>上传图片</button><div class="filelist ui-attachment-wrap" id="filelist_<%=id%>">'+
                '<% for(var i=0;i<list.length;i++){ %>' +
                '<a href="javascript:void(0);" allowDownload="<%=list[i].download_priv%>"  data-attach_id="<%=list[i].attach_id%>" data-attach_name="<%=list[i].attach_name%>" class="pda_attach pda_attach_img" is_image="1" _href="<%=list[i].attach_url%>"><img src="<%=list[i].attach_url%>" /><span class="fileupload-item icon-delete">×</span></a>'+
                '<% } %>' +
                '</div></div>' +
                '<% } %>' +
                '<% if(required){ %>' +
                '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>' +
                '<% } %>';
            return $.tpl(tplHTML, d);
        },
        bindEvent: function() {
            var self = this;
            this.$list.delegate('span.fileupload-item', 'tap', function(event){
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                var $this = $(this);
                var id = $this.parent(".pda_attach").attr("data-attach_id");
                var name = $this.parent(".pda_attach").attr("data-attach_name");
                var delete_flag = self.delete_attach(id, name);
                if(delete_flag === true){
                    $this.parent(".pda_attach").remove();
                }
                return false;
            });
            this.$android_images && this.$android_images.on('click', function(){
                self.uploadImages();
            });
            this.$ios_images && this.$ios_images.on('click', function(){
                self.uploadImages();
            });
        },
        delete_attach: function(id, name){
            var self = this;
            var delete_flag = false;
            var data_id = self.$config.form_flag == true ? self.$config.field_id : self.$config.id;
            $.ajax({
                type: 'GET',
                url: '/pda/approve_center/delete_data_attach.php',
                cache: false,
                async: false,
                data: {
                    'RUN_ID':q_run_id,
                    'FLOW_ID':q_flow_id,
                    'ATTACHMENT_ID': id,
                    'ATTACHMENT_NAME': name,
                    'DATA_ID': data_id
                },
                success: function(d){
                    if(d == '1'){
                        //alert("附件删除成功");
                        delete_flag = true;
                    }
                },
                error: function(e){
                    //alert("附件删除失败");
                    delete_flag = false;
                }
            });
            return delete_flag;
        },
        uploadImages: function() {
            var self = this;
			tMobileSDK.chooseImage({
				multiple: false,
				sizeType: ['compress'],
				qyappName:platform=="qywx" ? 'work':'',
				onFail : function (){},
				onSuccess: function (ret){
					var d = ret;
					try{$.each(d, function(k, img){
						var attach_id = img.id;
						var attach_name = img.name;
						var attach_url = img.url;
						self.$list.empty();
						self.$list.append('<a href="javascript:void(0);" data-attach_id="'+attach_id+'" data-attach_name="'+attach_name+'" class="pda_attach pda_attach_img" is_image="1" _href="'+attach_url+'"><img src="'+ attach_url +'" /><span class="fileupload-item icon-delete">×</span></a>');
					});} catch(ex) {alert(ex.message)}
				}
			});
        },
        getData: function() {
            var self = this;
            var required_val = this.required;
            var low_id = this.low_id;
            var ret = {
                name: self.$config.id,
                value: {
                    attach_id: "",
                    attach_name: ''
                }
            };
            if(self.$list.find('a.pda_attach').length > 0){
                self.$list.find('a.pda_attach').each(function(){
                    var $this = $(this);
                    var attach_id = $this.attr("data-attach_id");
                    var attach_name = $this.attr("data-attach_name");
                    ret.value.attach_id += attach_id.replace(/,/g,"")+',';
                    ret.value.attach_name += attach_name.replace(/\*/g,"")+'*';
                });
            }
            if(self.$list.find('div.pda_attach').length > 0){
                self.$list.find('div.pda_attach').each(function(){
                    var $this = $(this);
                    var attach_id = $this.attr("data-attach_id");
                    var attach_name = $this.attr("data-attach_name");
                    ret.value.attach_id += attach_id.replace(/,/g,"")+',';
                    ret.value.attach_name += attach_name.replace(/\*/g,"")+'*';
                });
            }
            ret.value = {
                attach_id: ret.value.attach_id.substring(0,ret.value.attach_id.length-1),
                attach_name: ret.value.attach_name.substring(0,ret.value.attach_name.length-1)
            };
            return ret;
        },
        onSubmit: function(){
            var self = this;
            var required_val = this.required;
            var low_id = this.low_id;
            var ret = this.getData();
            if (required_val && ret.value.attach_id.length==0 && ret.value.attach_name.length==0) {
                this.validation(this.desc);
                setTimeout(function() {
                    $("#div_alert_" + self.lower_name + "").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
            // if(this.getData() === false)
            // {
            //     return this.getData();
            // }
        },
        validation: function(s) {
            $("#div_alert_"+this.lower_name+"").addClass("div_alert_show");
        }

    });
    exports.TImageUploadCtrl = window.TImageUploadCtrl = TImageUploadCtrl;
});
