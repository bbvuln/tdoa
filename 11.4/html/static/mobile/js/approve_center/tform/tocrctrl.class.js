define("TOcrCtrl", function(require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require("base");
    var TListView = require("TListView");

    var throttle = function(fn, delay) {
        var timer = null;
        return function() {
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(context, args);
            }, delay);
        };
    };
    window.allSelect = [];
    var getQueryParams = function() {
        var qs = location.search.length > 0 ? location.search.substr(1) : "",
            args = {},
            items = qs.length > 0 ? qs.split("&") : [],
            item = null,
            name = null,
            value = null,
            i = 0,
            len = items.length;
        for (i = 0; i < len; i++) {
            item = items[i].split("=");
            name = decodeURIComponent(item[0]);
            value = decodeURIComponent(item[1]);

            if (name.length) {
                args[name] = value;
            }
        }
        return args;
    };
    var queryParams = getQueryParams();
    var keyword = "";
    var pageNo = 1;
    var pageSize = 10;
    var fieldId = null;
    var selected = [];
    var filterSelect = function(id) {
        var arr = [];
        for (var i = 0; i < selected.length; i++) {
            var _id = selected[i];
            if (_id !== id) {
                arr.push(_id);
            }
        }
        selected = arr;
    };
    var $searchIput = $("#apply-product-search");
    var createInvoiceCard = window.createInvoiceCard;

    function fetchApplylist(itemId, uid) {
        //给选择发票页面确定按钮添加itemid属性
        $(".reimbursement-btn").attr("itemid", itemId);
        $(".reimbursement-btn").attr("uid", uid);
        var list = $(".apply-list");
        list.empty();
        new gmu.Alist({
            el: list,
            template: {
                item: $("#works-list-tmpl").html()
            },
            enablePullUp: false,
            enablePullDown: false,
            url: "/general/appbuilder/web/invoice/invoice/invoicelist",
            baseParam: {
                state: "0",
                pageSize: pageSize,
                keyword: keyword,
                pageNo: pageNo,
                flowId: queryParams.FLOW_ID,
                prcsId: queryParams.PRCS_ID,
                flowPrcs: queryParams.FLOW_PRCS,
                runId: queryParams.RUN_ID
            },
            itemclick: function() {
                $(".office-product-list .ui-list").unbind();
                $(".office-product-list .ui-list").on(
                    "tap",
                    ".apply-list-item",
                    function(e) {
                        var trans_id = $(e.currentTarget).attr("data-trans_id");
                        // if (
                        //     $(e.target).hasClass("img-wrap") ||
                        //     $(e.target).hasClass("img-select") ||
                        //     $(e.target).hasClass("image")
                        // ) {
                            if (selected.indexOf(trans_id) === -1) {
                                selected.push(trans_id);
                                $(e.currentTarget)
                                    .find(".img-select")
                                    .addClass("selected");
                            } else {
                                filterSelect(trans_id);
                                $(e.currentTarget)
                                    .find(".img-select")
                                    .removeClass("selected");
                            }
                        // }
                    }
                );
            },
            dataFix: function(data) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (allSelect.indexOf(item.id) === -1){
                        arr.push(
                            createInvoiceCard({
                                selected: selected,
                                item:item
                            })
                        );
                    }
                }
                return arr;
            },
            param: function(dir, type, oldParam, changeDir) {
                var data = {};
                switch (dir) {
                    case "up":
                        pageNo = 1;
                        data.pageNo = pageNo;
                        changeDir("reload");
                        break;
                    case "down":
                        pageNo = pageNo + 1;
                        data.pageNo = pageNo;
                        break;
                    case "reload":
                        break;
                }
                return $.extend({}, this._options.baseParam, data);
            }
        });
    }

    var throttleFetchApplylist = throttle(fetchApplylist, 300);

    $searchIput.on("input", function(e) {
        var inputVal = $searchIput.val();
        var preKeyword = keyword;
        if (preKeyword !== inputVal) {
            pageNo = 1;
            keyword = $.trim(inputVal);
        }
        throttleFetchApplylist();
    });

    //选择发票页面确定按钮绑定函数
    $(".reimbursement-btn").tap(function() {
        if (selected.length) {
            allSelect = allSelect.concat(selected);
            // console.log(fieldId, selected);
            fillData();
        }
        selectInvoiceBack();
    });

    window.selectInvoiceData = [];
    window.selectInvoiceBack = function() {
        keyword = "";
        $searchIput.val("");
        pageNo = 1;
        fieldId = null;
        history.back();
        selected = [];
    };

    //向表单中填充数据
    var fillData = function() {
        //通过确定按钮属性获取itemId
        var itemId = $(".reimbursement-btn").attr("itemid");
        var uid = $(".reimbursement-btn").attr("uid");
        $.ajax({
            type: "post",
            url: "/inc/ocr/pdaBillToform.php",
            data: {
                flowId: q_flow_id,
                isMobile: 1,
                itemID: itemId,
                billId: selected.join(","),
                flowPrcs: q_flow_prcs,
                uid:uid,
            },
            cache: false,

            success: function(ret) {
                var ocrData = JSON.parse(ret);
                $.each(fieldManager.fieldsInstance, function(k, v) {
                    $.each(ocrData, function(retk, retv) {
                        if (retk == k) {
                            if (v["$config"]["data_type"] == "ListView") {
                                var id = v["$config"]["id"];
                                handleListdata(id, retv);
                            } else if (v["$config"]["type"] == "TOcrCtrl") {
                                $.each(retv, function(n, file) {
                                    v.addimages(file, itemId);
                                    v.invoiceCtrlShow(itemId);
                                });
                            } else {
                                v.setOcrValue(retv);
                            }
                        }
                    });
                });
            }
        });
    };

    var handleListdata = function(id, data) {
        $.ajax({
            url: "/inc/ocr/ocrlistdata.php",
            type: "post",
            data: {
                id: id,
                data: JSON.stringify(data),
                listdata: ocrConfig.fieldmanager.listocrdata[id]
            },
            cache: false,
            async: false,
            success: function(d) {
                fieldManager.listocrdata[id] = d;
                d = JSON.parse(d);
                var ListViewFieldManager = TListView.TListViewManager;
                ocrConfig.fieldmanager.ocrlist[id] = new ListViewFieldManager(
                    {
                        wrapper: $("#list-wrapper" + id).find(".list-content"),
                        fieldmanager: ocrConfig.fieldmanager
                    },
                    d
                );
            },
            error: function() {
                alert("listerror");
            }
        });
    };

    var TOcrCtrl = Base.extend({
        initialize: function(config) {
            TOcrCtrl.superclass.initialize.call(this, config);
            this.$wrapper = $("." + config.parentid).find(".group-fields");
            this.title = config.title;
            this.initField(config);
            this.$config = config;
            this.$config.unCalc = true;
            this.id = config.id;
            this.mapTitle = config.mapTitle;
            this.mapType = config.mapType;
            this.mapValue = config.mapValue;
            this.mapValuelist = config.mapValuelist;
            this.modelType = config.modelType;
            this.lower_name = config.lower_name;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
            this.paraObj = { id: config.id };
            this.paraStr = JSON.stringify(this.paraObj);
            this.$android_images = $("#ANDROID_UPLOAD_OCR_" + this.id + "");
            this.$ios_images = $("#IOS_UPLOAD_OCR_" + this.id + "");
            this.$bill = $("#selectBill_" + config.field_id);
            this.$test = $("#test");
            this.$field_id = config.field_id;
            this.$list = $("#filelist_" + this.$field_id).eq(0);
            window.ocrConfig = config;
            this.writeStr = "";
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
            d["platform"] = platform; //增加ios对钉钉、微信附件按钮隐藏的兼容
            var tplHTML =
                "<% if(secret){ %>" +
                "<% } else { %>" +
                '<div class="read_detail ' +
                "<% if(hidden!=undefined && hidden==true){ %>" +
                " hidden " +
                "<% } %>" +
                "<% if(delete_priv !=undefined && delete_priv == false){ %>" +
                " no_delete " +
                "<% } %>" +
                "<% if(writable){ %>" +
                " WriteDiv" +
                "<% } %>" +
                ' tag-fileupload">' +
                "<% if(required){ %>" +
                '<span class="isrequired">*</span>' +
                "<% } %>" +
                '<em><%=title%>：</em><div class="field">' +
                '<br><button style="display:none" type="button" id="ANDROID_UPLOAD_OCR_<%=id%>" class="ui-btn ANDROID_UPLOAD_IMAGES" ' +
                "<% if(!writable){ %>" +
                "disabled" +
                "<% } %>" +
                ">扫描图片</button>" +
                '<% if(platform == "client"){ %>' +
                "<% } %>" +
                '<button style="display:none" type="button" id="IOS_UPLOAD_OCR_<%=id%>" class="ui-btn IOS_UPLOAD_IMAGES" ' +
                "<% if(!writable){ %>" +
                "disabled" +
                "<% } %>" +
                ">扫描图片</button>" +
                '<button type="button" id="selectBill_<%=field_id%>" class="ui-btn" ' +
                "<% if(!writable){ %>" +
                "disabled" +
                "<% } %>" +
                "><%=title%></button>" +
                '<button style="display:none" type="button" id="test" class="ui-btn" ' +
                ">测试按钮（别点）</button>" +
                '<button style="display:none" type="button" id="bill" class="ui-btn" ' +
                "<% if(!true){ %>" +
                "disabled" +
                "<% } %>" +
                ">查验结果</button>" +
                '<div class="filelist ui-attachment-wrap" id="filelist_<%=field_id%>">' +
                "<div id='delOcrImg' style='display: none;' delimg=''>用来存储被删除的图片id</div>"+
                "<% if(list.length>0){%>" +
                "<% for(var i=0;i<list.length;i++){ %>" +
                "<%if (list[i].attach_type == 'file') {%>" +
                '<a href="javascript:void(0);" allowDownload="<%=list[i].download_priv%>" edit_priv="0"  data-attach_id="<%=list[i].attach_id%>" data-attach_name="<%=list[i].attach_name%>" ocr_info="<%=list[i].ocr_info%>" del_ocr_str="<%=list[i].del_ocr_str%>" class="pda_attach" is_image="0" _href="<%=list[i].attach_url%>" style="background-image:url(\'/static/images/file_type/v2019/form.pdf.icon@3x.png\')"><span><%=list[i].attach_name%></span><div class="ui-icon-rarrow"></div><span class="fileupload-item icon-delete">×</span></a>' +
                "<%} else {%>" +
                '<a href="javascript:void(0);" allowDownload="<%=list[i].download_priv%>"  data-attach_id="<%=list[i].attach_id%>" data-attach_name="<%=list[i].attach_name%>" ocr_info="<%=list[i].ocr_info%>" del_ocr_str="<%=list[i].del_ocr_str%>" class="pda_attach pda_attach_img" is_image="1" _href="<%=list[i].attach_url%>"><img src="<%=list[i].attach_url%>" /><span class="fileupload-item icon-delete">×</span></a>'+
                "<%}%>" +
                "<% }} %>" +
                '<ul class="ocrPlaceHolder" style="display: none">' +
                "<li>" +
                '<img src="/static/modules/approve_center/images/image_holder.png" alt="" />' +
                "</li>" +
                "</ul>" +
                "<% }%>" +
                "<% if(required){ %>" +
                '<div class="div_alert div_alert_hidden" id="div_alert_<%=lower_name%>"><%=desc%></div>' +
                "<% } %>" +
                "</div>";
            return $.tpl(tplHTML, d);
        },

        bindEvent: function() {
            var self = this;
            var itemId = this.$field_id;
            self.invoiceCtrlShow(itemId);
            //给图片右上角叉号绑定删除图片方法
            this.$list.delegate("span.fileupload-item", "tap", function(event) {
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                var $this = $(this);
                var id = $this.parent(".pda_attach").attr("data-attach_id");
                var name = $this.parent(".pda_attach").attr("data-attach_name");
                var delOcrStr = $this.parent(".pda_attach").attr("del_ocr_str");
                // self.ocrImgDel(id, name);
                //在div中存储被删除的图片id
                var list = $("#filelist_" + itemId).eq(0);
                var delOcr = list.children("#delOcrImg");
                var delImgStr = delOcr.attr('delimg');
                if (delImgStr == '') {
                    delOcr.attr('delimg', delOcrStr);
                } else {
                    delOcr.attr('delimg', delImgStr + ',' + delOcrStr);
                }

                $this.parent(".pda_attach").remove();
                self.invoiceCtrlShow(itemId);
            });
            //安卓点击ocr扫描按钮
            this.$android_images &&
            this.$android_images.on("click", function() {
                tMobileSDK.ocrScan({
                    onSuccess: function(result) {
                        //添加图片
                        self.addimages(result);
                        self.getOcr();
                    },
                    onFail: function(result) {
                        alert("图片获取失败");
                    }
                });
            });
            //ios点击ocr扫描按钮
            this.$ios_images &&
            this.$ios_images.on("click", function() {
                tMobileSDK.ocrScan({
                    onSuccess: function(result) {
                        //添加图片
                        self.addimages(result);
                        self.getOcr();
                    },
                    onFail: function(result) {
                        alert("图片获取失败");
                    }
                });
            });

            //绑定事件：点击选择发票按钮，跳转发票夹
            this.$bill &&
            this.$bill.on("click", function() {
                pageTo("selectInvoice");
                fetchApplylist(self.$field_id, self.$config.uid);
            });

            this.setAllSelect();
        },

        //请求ocr接口
        getOcr: function() {
            var self = this;
            var image = this.getData();

            var maptitle = this.mapTitle;
            var maptype = this.mapType;
            var mapvalue = this.mapValue;
            var mapvaluelist = this.mapValuelist;
            var mapmodeltype = this.modelType;

            $.ajax({
                type: "post",
                url: "/inc/ocr/ocrIndex.php",
                data: {
                    name: image.value.attach_name,
                    id: image.value.attach_id,
                    mapTitle: maptitle,
                    mapType: maptype,
                    mapValue: mapvalue,
                    mapValuelist: mapvaluelist,
                    modelType: mapmodeltype
                },
                cache: false,
                beforeSend: function() {
                    $.ProLoading.show("图像识别中，请耐心等待...");
                },
                success: function(ret) {
                    $.ProLoading.hide();
                    ret = JSON.parse(ret);

                    $.each(fieldManager.fieldsInstance, function(k, v) {
                        $.each(ret, function(retk, retv) {
                            if (retk == k) {
                                if (v["$config"]["data_type"] == "ListView") {
                                    var id = v["$config"]["id"];
                                    self.handleListdata(id, retv);
                                } else {
                                    v.setOcrValue(retv);
                                }
                            }
                        });
                    });
                }
            });
        },

        //添加图片
        addimages: function(file, itemId) {
            var $ = jQuery;
            var list = $("#filelist_" + itemId).eq(0);
            var attachName = file.name;
            var attachId = file.id;
            var attachUrl = file.url;
            var ocrInfo = file.ocrInfo;
            var isImage = file.is_image;
            var ocrDelId = file.ocrDelId;
            if (isImage) {
                var html = '<a href="javascript:void(0);" ' +
                    'data-attach_id="' +
                    attachId +
                    '" data-attach_name="' +
                    attachName +
                    '" ocr_info="' +
                    ocrInfo +
                    '" del_ocr_str="' +
                    ocrDelId +
                    '" class="pda_attach pda_attach_img" is_image="1" _href="' +
                    attachUrl +
                    '"><img src="' +
                    attachUrl +
                    '" /><span class="fileupload-item icon-delete">×</span></a>';
            } else {
                var html = '<a href="javascript:void(0);" edit_priv="0" style="background-image:url(\'/static/images/file_type/v2019/form.pdf.icon@3x.png\')" ' +
                    'data-attach_id="' +
                    attachId +
                    '" data-attach_name="' +
                    attachName +
                    '" ocr_info="' +
                    ocrInfo +
                    '" del_ocr_str="' +
                    ocrDelId +
                    '" class="pda_attach" is_image="0" _href="' +
                    attachUrl +
                    '"><span>'+attachName + '</span><div class="ui-icon-rarrow"></div><span class="fileupload-item icon-delete">×</span></a>';
            }

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
                list.append(
                    html
                );
            } else {
                var update = list.children('[data-attach_id="' + attachId + '"]');
                var attrStr= update.attr('ocr_info');
                var ocrAttrStr = update.attr('del_ocr_str');
                attrStr = attrStr + ',' + ocrInfo;
                update.attr('ocr_info', attrStr);

                ocrAttrStr = ocrAttrStr + ',' + ocrDelId;
                update.attr('del_ocr_str', ocrAttrStr);
            }

        },

        //删除图片
        // ocrImgDel: function(id, name) {
        //     var self = this;
        //     var flag = false;
        //     var data_id =
        //         self.$config.form_flag == true
        //             ? self.$config.field_id
        //             : self.$config.id;
        //     $.ajax({
        //         type: "GET",
        //         url: "/pda/approve_center/delete_data_attach.php",
        //         cache: false,
        //         async: false,
        //         data: {
        //             RUN_ID: q_run_id,
        //             FLOW_ID: q_flow_id,
        //             ATTACHMENT_ID: id,
        //             ATTACHMENT_NAME: name,
        //             DATA_ID: data_id
        //         },
        //         success: function(d) {
        //             //alert("附件删除成功");
        //             flag = true;
        //         },
        //         error: function(e) {
        //             //alert("附件删除失败");
        //             flag = false;
        //         }
        //     });
        //     return flag;
        // },

        //获取图片信息(保存图片用)
        getData: function() {
            var self = this;
            var required_val = this.required;
            var low_id = this.low_id;
            var ret = {
                name: self.$config.id,
                value: {
                    attach_id: "",
                    attach_name: "",
                    ocr_info:""
                }
            };
            if (self.$list.children("a.pda_attach").length > 0) {
                self.$list.children("a.pda_attach").each(function() {
                    var $this = $(this);
                    var attach_id = $this.attr("data-attach_id");
                    var attach_name = $this.attr("data-attach_name");
                    var ocr_info = $this.attr("ocr_info");

                    var ocrInfoArr = ocr_info.split(',');
                    $.each(ocrInfoArr, function(k, v) {
                        if (v != '') {
                            ret.value.attach_id += attach_id.replace(/,/g, "") + ",";
                            ret.value.attach_name += attach_name.replace(/\*/g, "") + "*";
                        }
                    });
                    ret.value.ocr_info += ocr_info + ",";
                });
            }
            ret.value = {
                attach_id: ret.value.attach_id.substring(
                    0,
                    ret.value.attach_id.length - 1
                ),
                attach_name: ret.value.attach_name.substring(
                    0,
                    ret.value.attach_name.length - 1
                ),
                ocr_info: ret.value.ocr_info.substring(
                    0,
                    ret.value.ocr_info.length - 1
                ),
            };
            //被删除的图片id
            var list = $("#filelist_" + self.$field_id).eq(0);
            var delOcr = list.children("#delOcrImg");
            var delImgStr = delOcr.attr('delimg');
            delOcr.attr('delimg', '');
            ret.value[''+self.$field_id + '_del_ocrImg'+''] = delImgStr;
            return ret;
        },

        //提交
        onSubmit: function() {
            var self = this;
            var required_val = this.required;
            var low_id = this.low_id;
            var ret = this.getData();
            if (
                required_val &&
                ret.value.attach_id.length == 0 &&
                ret.value.attach_name.length == 0
            ) {
                this.validation(this.desc);
                setTimeout(function() {
                    $("#div_alert_" + self.lower_name + "").removeClass(
                        "div_alert_show"
                    );
                }, 5000);
                return false;
            }
        },

        validation: function(s) {
            $("#div_alert_" + this.lower_name + "").addClass("div_alert_show");
        },

        //增值税发票控件的显示控制
        invoiceCtrlShow: function(itemId) {
            var list = $("#filelist_" + itemId).eq(0);
            //ocr图片
            var a = list.children("a.pda_attach");
            //占位图
            var palceHolder = list.children("ul.ocrPlaceHolder").eq(0);
            //查验结果按钮
            var check = $("#check_" + itemId);
            if (a.length == 0) {
                palceHolder.show();
                check.hide();
            } else {
                palceHolder.hide();
                check.show();
            }
        },

        //用来告诉选择发票界面，表单中已经存在哪些发票了
        setAllSelect: function() {
            var list = this.$config.list;
            var attachId = "";
            for (var i = 0; i < list.length; i++) {
                attachId = attachId + list[i].attach_id + ",";
            }
            $.ajax({
                type: "post",
                url: "/inc/ocr/interface/invoiceLib.php",
                data: {
                    fn: "getInvoiceId",
                    attachId: attachId
                },
                cache: false,

                success: function(ret) {
                    $.ProLoading.hide();
                    var id = JSON.parse(ret);
                    allSelect = allSelect.concat(id);
                }
            });
        }
    });
    exports.TOcrCtrl = window.TOcrCtrl = TOcrCtrl;
});
