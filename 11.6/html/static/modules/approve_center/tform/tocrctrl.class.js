define("TOcrCtrl", function(require, exports, module) {
    var $ = jQuery;
    var Base = require("TBaseCtrl").TBaseCtrl;
    window.ocrSelect = [];


    //����ocrͼƬ
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
        //�ж���ӵ�ͼƬ�Ƿ��Ѿ������ڱ�
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
            //����menu�б�ɾ������
            var menuObj = list.children("div[title='"+attachName+"']").eq(0);
            var menu = menuObj.html();
            menu = menu.replace("ocrImgDel('", "ocrImgDel('"+delOcrId+",");
            menuObj.html(menu);
        }
        invoiceCtrlShow(itemId);
        postData(itemId);
    }


    //ɾ��ocrͼƬ
    window.ocrImgDel = function(delOcrId,imgDivId,itemId,attachId,attachName)
    {
        var img = $('#'+imgDivId);
        var imgMenu = $('#'+imgDivId+'_menu');
        img.remove();
        imgMenu.remove();
        invoiceCtrlShow(itemId);
        postData(itemId, delOcrId);
    };


    //��ֵ˰��Ʊ�ؼ�����ʾ����
    window.invoiceCtrlShow = function(itemId){
        var $ = jQuery;
        //ocrͼƬ
        var a = $("a[ocrGroup="+itemId+"]");
        //ռλͼ
        var palceHolder = $('#filelist_'+itemId+' .ocrPlaceHolder');
        //��������ť
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
        //����ocr������attachId,attachName������post�����
        var idStr = '';
        var nameStr = '';
        var ocrInfoStr = '';
        var arr = list.children('a');//�ҵ�����ocr�ؼ��µ�ͼƬ
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
        //��¼����ҳ��ɾ���ķ�Ʊ�����湤�����������Щ��Ʊ״̬���и���
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
            //��������ť�󶨷�����checkResult�����д����form.js��
            $('#check_'+self.itemId).click(function(){
                checkResult({
                    itemId:self.itemId
                })
            });

            //��ѡ��Ʊ��ť�󶨴�����
            $('#selectBill_'+self.itemId).click(function(){
                    self.openModal(self.itemId)
                }
            );
            invoiceCtrlShow(self.itemId);

            //�����Ʊ�Ѿ��ڱ��У��ǾͰѷ�Ʊid��ֵ��������ѡ��Ʊ����ͨ������������жϷ�Ʊ�Ƿ���ʾ
            self.setOcrSelect();
        },


        //pc�˵��ѡ��Ʊ��ť ������Ʊ����
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


        //��������ѡ��Ʊ���棬�����Ѿ�������Щ��Ʊ��
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
