define("TOcrCtrl", function(require, exports, module) {
    var $ = jQuery;
    var Base = require("TBaseCtrl").TBaseCtrl;
    window.ocrSelect = [];


    //增加ocr图片
    window.addimages = function(file,itemId){
        var $ = jQuery;
        var list = $("#filelist_"+itemId).eq(0);

        var attachName = file.name;
        var attachId = file.id;
        var attachUrl = file.url;
        var ocrInfo = file.ocrInfo;
        var menuHtml = file.menuHtml;
        var id = file.imgId;
        var delOcrId = file.delOcrId;
        //判断添加的图片是否已经存在于表单
        var isAdd = true;
        var aID = '';
        var listAttachIdArr = list.children('a');
        $.each(listAttachIdArr,function (i,item) {
            aID = $(item).attr("data-attach_id");
            if (aID == attachId) {
                isAdd = false;
            }
        });
        if (isAdd) {
            list.append('<a href="javascript:void(0);" id="'+id+'" onmouseover="showMenu(this.id);" ocrGroup="'+itemId+'" data-attach_id="'+attachId+'" data-attach_name="'+attachName+'" ocr_info="'+ocrInfo+'" class="pda_attach pda_attach_img" is_image="1" _href="'+attachUrl+'"><img src="'+attachUrl+'" /></a>');
            menuHtml = menuHtml.replace("ocrImgDel('", "ocrImgDel('"+delOcrId);
            list.append(menuHtml);
        } else {
            var update = list.children('[data-attach_id="' + attachId + '"]');
            var attrStr= update.attr('ocr_info');
            attrStr = attrStr + ',' + ocrInfo;
            update.attr('ocr_info', attrStr);
            //处理menu列表删除操作
            var menuObj = list.children("div[title='"+attachName+"']").eq(0);
            var menu = menuObj.html();
            menu = menu.replace("ocrImgDel('", "ocrImgDel('"+delOcrId+",");
            menuObj.html(menu);
        }
        invoiceCtrlShow(itemId);
        postData(itemId);
    }


    //删除ocr图片
    window.ocrImgDel = function(delOcrId,imgDivId,itemId,attachId,attachName)
    {
        var img = $('#'+imgDivId);
        var imgMenu = $('#'+imgDivId+'_menu');
        img.remove();
        imgMenu.remove();
        invoiceCtrlShow(itemId);
        postData(itemId, delOcrId);
    };


    //增值税发票控件的显示控制
    window.invoiceCtrlShow = function(itemId){
        var $ = jQuery;
        //ocr图片
        var a = $("a[ocrGroup="+itemId+"]");
        //占位图
        var palceHolder = $('#filelist_'+itemId+' .ocrPlaceHolder');
        //查验结果按钮
        var check = $('#check_'+itemId);
        var isShowCheck = 0;
        var ocrInfo = '';
        $.each(a,function () {
            ocrInfo = $(this).attr('ocr_info');
            if (ocrInfo.indexOf('addTaxModel') != -1) {
                isShowCheck = 1;
            }
        });

        if (a.length == 0) {
            palceHolder.show();
            check.hide();
        } else if (isShowCheck == 0 && a.length != 0) {
            palceHolder.hide();
            check.hide();
        } else {
            palceHolder.hide();
            check.show();
        }
    };


    window.postData = function(itemId, delOcrId){
        var $ = jQuery;
        var list = $("#filelist_"+itemId).eq(0);
        //查找ocr隐藏域attachId,attachName，用来post保存表单
        var idStr = '';
        var nameStr = '';
        var ocrInfoStr = '';
        var arr = list.children('a');//找到所有ocr控件下的图片
        $.each(arr,function (i,item) {
            var attachId = '';
            var attachName = '';
            var ocrInfo = '';
            var ocrArr = [];
            attachId = $(item).attr('data-attach_id');
            attachName = $(item).attr('data-attach_name');
            ocrInfo = $(item).attr('ocr_info');
            ocrArr  = ocrInfo.split(',');
            $.each(ocrArr, function (s, stem) {
                idStr += attachId+',';
                nameStr += attachName+'*';
            });
            // attachId = attachId.replace(',','');
            // attachName = attachName.replace('*','');
            ocrInfoStr += ocrInfo+',';
        });
        $("input[name='"+itemId+"']").val(nameStr);
        $("input[name='"+itemId+"_key']").val(idStr);
        $("input[name='"+itemId+"_ocr_info']").val(ocrInfoStr);
        //记录办理页面删除的发票，保存工作操作会对这些发票状态进行更改
        if (delOcrId != '' && typeof delOcrId != 'undefined') {
            var delImg = $("input[name='"+itemId+"_del_ocrImg']");
            var delImgStr = delImg.val();
            if (delImgStr == '') {
                delImg.val(delOcrId);
            } else {
                delImg.val(''+delImgStr+','+delOcrId+'');
            }
        }
    };


    var TOcrCtrl = Base.extend({
        initialize: function(config) {
            TOcrCtrl.superclass.initialize.call(this, config);
            this.itemId = config.itemId;
            this.required = config.required;
            this.$config = config;
            this.id = config.id;
            this.desc = config.desc;
            this.$list = $("#filelist_"+this.itemId).eq(0);
            this.attachId = $(".pda_attach").attr("data-attach_id");
            this.attachName = $(".pda_attach").attr("data-attach_name");
            this.bindEvent();
        },


        bindEvent: function() {
            var self = this;
            //查验结果按钮绑定方法，checkResult是李化歧写的在form.js里
            $('#check_'+self.itemId).click(function(){
                checkResult({
                    itemId:self.itemId
                })
            });

            //给选择发票按钮绑定处理方法
            $('#selectBill_'+self.itemId).click(function(){
                    self.openModal(self.itemId)
                }
            );
            invoiceCtrlShow(self.itemId);

            //如果发票已经在表单中，那就把发票id赋值给变量，选择发票界面通过这个变量来判断发票是否显示
            self.setOcrSelect();
        },


        //pc端点击选择发票按钮 弹出发票窗口
        openModal:function(itemId){
            var   mywidth   =   780;
            var   myheight   =   700;
            var   myleft   =   (screen.availWidth   -   mywidth)   /   2;
            var   mytop   =   100;
            window.open(
                "/general/invoice/select/?type=unused&flowId="+g_flow_id+"&itemId="+itemId+"&flowPrcs="+g_flow_prcs+"&uid="+this.$config.uid,
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


        //用来告诉选择发票界面，表单中已经存在哪些发票了
        setOcrSelect:function(){
            var attachId = '';
            var arr = $('[ocrgroup="' + this.itemId + '"]');
            $.each(arr, function(i, item) {
                var id = $(item).attr("data-attach_id");
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
        },

        setOffsetTop: function() {
            var imgName = $("input[name='"+this.itemId+"']").val(),
                // obj_val1 = this.$obj1.val(),
                $field = $('#selectBill_'+this.itemId);
            var imgId = $("input[name='"+this.itemId+"_key']").val();
            var required_val = this.required;
            if((imgName == '' || typeof imgName == 'undefined') && imgId == '' && required_val)
            {
                var objTop = $field.offset().top;
                $("body,html").animate({
                    scrollTop: objTop - 150
                },50);
                return false;
            }
        },
        onSubmit: function() {
            var imgName = $("input[name='"+this.itemId+"']").val();
            var imgId = $("input[name='"+this.itemId+"_key']").val();
            var $field = $('#selectBill_'+this.itemId);
            var required_val = this.required;
            if ((imgName == '' || typeof imgName == 'undefined') && imgId == '' && required_val) {
                this.validation(this.desc);
                setTimeout(function(){
                    var api = $field.data('tipsy');
                    api && api.hide();
                }, 5000);
                return false;
            }
        },
        validation: function(s) {
            self.s = s;
            $('#selectBill_'+this.itemId).tipsy({
                title: function () {
                    this.title = this.getAttribute('original-title');
                    this.removeAttribute('original-title');
                    return '<b style="color:#E25C5C;">' + self.s + '</b>';
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
    exports.TOcrCtrl = window.TOcrCtrl = TOcrCtrl;
});
