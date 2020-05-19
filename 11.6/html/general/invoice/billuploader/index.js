var BillUploader = function(opt) {
    this.onHidden = opt.onHidden;
    this.loading = false;
    this.init();
};

BillUploader.prototype = {
    init: function() {
        this.createModal();
        this.bindEvent();
    },
    createModal: function() {
        $("body").append(
            '<div class="modal hide fade" id="billUploader"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>请上传票据图片或pdf电子发票</h3></div><div class="modal-body"><div class="btn-primary btn select-file" id="select-file">选择文件</div><div class="empty show">请选择文件</div><ul class="bill-list"></ul></div><div class="modal-footer"><div class="btn-primary btn upload-file">确定</div><div class="btn close-bill">关闭</div></div></div>'
        );
    },
    bindEvent: function() {
        var self = this;
        this.uploader = this.makeUploader("select-file");
        $("#billUploader").on("hidden", function() {
            if (!self.loading) {
                self.uploader.reset();
            }
            $(".bill-list").empty();
            $(".empty").addClass("show");
        });
        $(".close-bill").click(function(e) {
            self.hideModal();
        });
        $(".bill-list").delegate("li", "mouseenter", function(e) {
            var el = $(e.currentTarget);
            el.addClass("hover");
        });
        $(".bill-list").delegate("li", "mouseleave", function(e) {
            var el = $(e.currentTarget);
            el.removeClass("hover");
        });
        $(".bill-list").delegate(".remove", "click", function(e) {
            var el = $(e.currentTarget);
            var id = el.attr("val");
            self.uploader.removeFile(id);
            $("#" + id).remove();
            if (!$(".bill-list-item ").size()) {
                $("#billUploader .empty").addClass("show");
            }
        });
    },
    showModal: function() {
        $("#billUploader").modal();
    },
    hideModal: function() {
        $("#billUploader").modal("hide");
    },
    appendData: function(data) {
        var dom = "";
        $.each(data, function(i, item) {
            var liDom =
                '<li class="bill-list-item" id="' +
                item.id +
                '"><span class="td-iconfont td-icon-tongyongunkuown" style="color:#8199af"></span><div class="file-name ellipsis" title="' +
                item.name +
                '">' +
                item.name +
                '</div><span class="remove" val="' +
                item.id +
                '" title="删除">×</span></li>';
            dom += liDom;
        });
        $(".bill-list").append(dom);
    },
    //uploader生成器
    makeUploader: function(pick) {
        var self = this;
        // 初始化Web Uploader
        var uploader = WebUploader.create({
            // 选完文件后，是否自动上传。
            auto: false,
            // swf文件路径
            swf: "/static/js/webuploader/Uploader.swf",
            // 文件接收服务端。
            // server: "/test",
            server: "/general/appbuilder/web/invoice/invoice/upload",
            // 选择文件的按钮。
            // 内部根据当前运行创建，可能是input元素，也可能是flash.
            pick: "#" + pick,
            // 只允许选择图片文件。
            // accept: 'image/jpg,image/jpeg,image/png,image/gif',
            accept: {
                // title: "Images",
                extensions: "jpg,jpeg,png,pdf"
                // mimeTypes: 'image/*'
            },
            duplicate: false,
            multiple: true,
            fileNumLimit: 9
            // fileSingleSizeLimit: 1048576
        });

        //上传文件出错给出提示
        uploader.on("error", function(type) {
            if (type === "Q_EXCEED_NUM_LIMIT") {
                alert("最多上传9个文件");
            }
            if (type === "F_DUPLICATE") {
                alert("该文件已添加");
            }
            if (type === "Q_TYPE_DENIED") {
                alert("请选择正确图片类型文件");
            }
            // if (type == "Q_TYPE_DENIED") {
            //     // message.error("请选择正确图片类型文件");
            // } else {
            //     // message.error("请上传小于1M的图片");
            // }
        });
        //文件添加到队列之后
        uploader.on("filesQueued", function(files, data) {
            if (files.length) {
                self.appendData(files);
                var $empty = $("#billUploader .empty");
                if ($empty.hasClass("show")) {
                    $empty.removeClass("show");
                }
            }
        });
        $(".upload-file").click(function(e) {
            uploader.upload();
            if ($(".bill-list-item ").size()) {
                // setTimeout(function() {
                    self.onHidden();
                // }, 1000);
            }
            self.hideModal();
        });
        uploader.on("startUpload", function() {
            self.loading = true;
        });
        uploader.on("uploadFinished", function() {
            self.loading = false;
            self.uploader.reset();
        });
        return uploader;
    }
};
