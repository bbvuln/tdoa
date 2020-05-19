define("TOcrCtrl", function(require, exports, module) {
    var $ = jQuery;
    var Base = require("TBaseCtrl").TBaseCtrl;
    window.ocrSelect = [];
    var TOcrCtrl = Base.extend({
        initialize: function(config) {
            TOcrCtrl.superclass.initialize.call(this, config);
            this.itemId = config.itemId;
            this.$config = config;
            this.$list = $("#filelist_"+this.itemId).eq(0);
            this.attachId = $(".pda_attach").attr("data-attach_id");
            this.attachName = $(".pda_attach").attr("data-attach_name");
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            //查验结果按钮绑定方法，checkResult是李化歧写的在form.js里
            var handler=function(){
                checkResult({
                    itemId:self.itemId
                })
            }
            $('#check_'+self.itemId).click(handler);

            //给选择发票按钮绑定处理方法
            $('#selectBill_'+self.itemId).click(function(){
                    self.openModal(self.itemId)
                }
            );
            self.pageShow();

            //给图片右上角叉号绑定删除图片方法
            this.$list.delegate('span.icon-delete', 'click', function(event){
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
                self.pageShow();
                return false;
            })
            //如果发票已经在表单中，那就把发票id赋值给变量，选择发票界面通过这个变量来判断发票是否显示
            self.setOcrSelect();
        },
        //点×删除图片
        delete_attach: function(id, name){
            var self = this;
            var delete_flag = false;
            var data_id = self.$config.itemId;
            var msg = sprintf("确定要删除图片 '%s' 吗 '%s' 删除前建议先保存表单！", name, "？\n");
            if (window.confirm(msg)){
                $.ajax({
                    type: 'GET',
                    url: '/pda/approve_center/delete_data_attach.php',
                    cache: false,
                    async: false,
                    data: {
                        'RUN_ID':window.parent.run_id,
                        'FLOW_ID':window.parent.flow_id,
                        'PRCS_ID':window.parent.prcs_id,
                        'FLOW_PRCS':window.parent.flow_prcs,
                        'ATTACHMENT_ID': id,
                        'ATTACHMENT_NAME': name,
                        'DATA_ID': data_id
                    },
                    success: function(data){
                        if(data == '1'){
                            delete_flag = true;
                        }
                    },
                    error: function(e){
                        alert("附件删除失败");
                        delete_flag = false;
                    }
                });
            }
            return delete_flag;
        },
        //显示或者隐藏占位图和按钮
        pageShow: function(){
            if (this.$list.find('.pda_attach').length == 0) {
                //显示占位图
                $('.ocrPlaceHolder').show();
                //隐藏查验结果按钮
                $('#check_'+this.itemId).hide();
            } else {
                //不显示占位图
                $('.ocrPlaceHolder').hide();
                //隐藏查验结果按钮
                $('#check_'+this.itemId).show();
            }
        },
        //获取图片信息
        getData: function() {
            var self = this;
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

        //pc端点击选择发票按钮 弹出发票窗口
        openModal:function(itemId){
        var   mywidth   =   780;
        var   myheight   =   700;
        var   myleft   =   (screen.availWidth   -   mywidth)   /   2;
        var   mytop   =   100;
        window.open(
            "/general/invoice/select/?type=unused&flowId="+g_flow_id+"&itemId="+itemId,
            "",
            "height="   +
            myheight   +
            ",width="   +
            mywidth   +
            ",status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top="   +
            mytop   +
            ",left="   +
            myleft   +
            ",resizable=yes"
        );
    },


    setOcrSelect:function(){
        var attachId = '';
        var arr = $('[ocrgroup="' + this.itemId + '"]');
        $.each(arr, function(i, item) {
            var id = $(item).attr("data-attach_id");
            //var name = $(item).attr("data-attach_name");
            attachId = attachId + id + ',';
        });
        $.ajax({
            type: "post",
            url: "/inc/ocr/interface/invoiceLib.php",
            data: {
                fn:'getInvoiceId',
                attachId:attachId,
            },
            cache: false,
            async: false,

            success: function(ret) {
                var id = JSON.parse(ret);
                ocrSelect = ocrSelect.concat(id);
            },

        });
    }
    });
    exports.TOcrCtrl = window.TOcrCtrl = TOcrCtrl;
});
