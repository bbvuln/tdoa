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
            '<div class="modal hide fade" id="billUploader"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h3>���ϴ�Ʊ��ͼƬ��pdf���ӷ�Ʊ</h3></div><div class="modal-body"><div class="btn-primary btn select-file" id="select-file">ѡ���ļ�</div><div class="empty show">��ѡ���ļ�</div><ul class="bill-list"></ul></div><div class="modal-footer"><div class="btn-primary btn upload-file">ȷ��</div><div class="btn close-bill">�ر�</div></div></div>'
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
                '" title="ɾ��">��</span></li>';
            dom += liDom;
        });
        $(".bill-list").append(dom);
    },
    //uploader������
    makeUploader: function(pick) {
        var self = this;
        // ��ʼ��Web Uploader
        var uploader = WebUploader.create({
            // ѡ���ļ����Ƿ��Զ��ϴ���
            auto: false,
            // swf�ļ�·��
            swf: "/static/js/webuploader/Uploader.swf",
            // �ļ����շ���ˡ�
            // server: "/test",
            server: "/general/appbuilder/web/invoice/invoice/upload",
            // ѡ���ļ��İ�ť��
            // �ڲ����ݵ�ǰ���д�����������inputԪ�أ�Ҳ������flash.
            pick: "#" + pick,
            // ֻ����ѡ��ͼƬ�ļ���
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

        //�ϴ��ļ����������ʾ
        uploader.on("error", function(type) {
            if (type === "Q_EXCEED_NUM_LIMIT") {
                alert("����ϴ�9���ļ�");
            }
            if (type === "F_DUPLICATE") {
                alert("���ļ������");
            }
            if (type === "Q_TYPE_DENIED") {
                alert("��ѡ����ȷͼƬ�����ļ�");
            }
            // if (type == "Q_TYPE_DENIED") {
            //     // message.error("��ѡ����ȷͼƬ�����ļ�");
            // } else {
            //     // message.error("���ϴ�С��1M��ͼƬ");
            // }
        });
        //�ļ���ӵ�����֮��
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
