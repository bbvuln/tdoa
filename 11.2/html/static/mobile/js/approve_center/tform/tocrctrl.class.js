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

    function fetchApplylist() {
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
                        if (
                            $(e.target).hasClass("img-wrap") ||
                            $(e.target).hasClass("img-select") ||
                            $(e.target).hasClass("image")
                        ) {
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
                        }
                    }
                );
            },
            dataFix: function(data) {
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (allSelect.indexOf(item.id) === -1) {
                        item.trans_id = item.id;
                        var selectCls = "";
                        if (selected.indexOf(item.id) !== -1) {
                            selectCls = "selected";
                        }
                        // SellerName 销售方名称
                        // item.SellerName = "北京通达科技有限公司";
                        item.selectCls = selectCls;
                        // 专用发票 是 1
                        item.isNormal = item.InvoiceType !== 1 ? true : false;
                        item.isNormalImgSrc = item.isNormal
                            ? "/pda/invoice/invoicelist/img/myticketfolder_ordinary_icon@3x.png"
                            : "/pda/invoice/invoicelist/img/myticketfolder_major_icon@3x.png";
                        // state   0   未使用   1   已使用   all   全部
                        item.isUsed = item.state === "1" ? true : false;
                        item.usedCls = item.isUsed ? "used" : "";
                        item.isUsedImgSrc = item.isUsed
                            ? "/pda/invoice/invoicelist/img/myticketfolder_used_icon@3x.png"
                            : "/pda/invoice/invoicelist/img/myticketfolder_notused_icon2@3x.png";
                        item.money = item.TotalAmount;
                        item.tax = item.TotalTax;
                        item.time = item.InvoiceDate;
                        arr.push(item);
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
    $(".reimbursement-btn").tap(function() {
        if (selected.length) {
            allSelect = allSelect.concat(selected);
            // console.log(fieldId, selected);
            $.ajax({
                type: "post",
                url: "/inc/ocr/pdaBillToform.php",
                data: {
                    flowId:q_flow_id,
                    isMobile:1,
                    itemID:itemId,
                    billId:selected.join(','),
                },
                cache: false,

                success: function(ret) {
                    selectInvoiceData = JSON.parse(ret);
                    var list = selectInvoiceData.list;
                    $.each(fieldManager.fieldsInstance, function(k, v) {
                        $.each(list, function(retk, retv) {
                            if (retk == k) {
                                if (v["$config"]["data_type"] == "ListView") {
                                    var id = v["$config"]["id"];
                                    handleListdata(id, retv);
                                } else if (v["$config"]["type"] == 'TOcrCtrl'){
                                    $.each(retv, function(n, file){
                                        v.addimages(file);
                                    });
                                } else {
                                    v.setOcrValue(retv);
                                }
                            }
                        });
                    });
                }
            });
        }
        selectInvoiceBack();
    });


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
                        wrapper: $("#list-wrapper" + id).find(
                            ".list-content"
                        ),
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
    window.selectInvoiceData = [];
    window.selectInvoiceBack = function() {
        keyword = "";
        $searchIput.val("");
        pageNo = 1;
        fieldId = null;
        history.back();
        selected = [];
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
            this.$list = $("#filelist_" + this.id).eq(0);
            this.$field_id = config.field_id;
            window.itemId = config.field_id;
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
                "<% if(!true){ %>" +
                "disabled" +
                "<% } %>" +
                ">选择发票</button>" +
                '<button style="display:none" type="button" id="test" class="ui-btn" ' +
                ">测试按钮（别点）</button>" +
                '<button style="display:none" type="button" id="bill" class="ui-btn" ' +
                "<% if(!true){ %>" +
                "disabled" +
                "<% } %>" +
                ">查验结果</button>" +
                '<div class="filelist ui-attachment-wrap" id="filelist_<%=id%>">' +
                "<% if(list.length>0){%>" +
                "<% for(var i=0;i<list.length;i++){ %>" +
                '<a href="javascript:void(0);" allowDownload="<%=list[i].download_priv%>"  data-attach_id="<%=list[i].attach_id%>" data-attach_name="<%=list[i].attach_name%>" class="pda_attach pda_attach_img" is_image="1" _href="<%=list[i].attach_url%>"><img src="<%=list[i].attach_url%>" /><span class="fileupload-item icon-delete">×</span></a>' +
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
            self.pageShow();
            //给图片右上角叉号绑定删除图片方法
            this.$list.delegate("span.fileupload-item", "tap", function(event) {
                event.stopPropagation();
                event.preventDefault();
                event.stopImmediatePropagation();
                var $this = $(this);
                var id = $this.parent(".pda_attach").attr("data-attach_id");
                var name = $this.parent(".pda_attach").attr("data-attach_name");
                var delete_flag = self.delete_attach(id, name);
                if (delete_flag === true) {
                    $this.parent(".pda_attach").remove();
                }
                self.pageShow();
                return false;
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
            list = self.$config.list;
            for (var i = 0; i > list.length; i++) {

            }
            //绑定事件：点击选择发票按钮，跳转发票夹
            this.$bill &&
                this.$bill.on("click", function() {
                    fieldId = self.$field_id;
                    // var url = '/pda/invoice/invoicelist/?flowId='+q_flow_id+'&prcsId='+q_prcs_id+'&flowPrcs='+q_flow_prcs+'&runId='+q_run_id;
                    // confirmDialog('页面跳转，是否保存此工作', url);
                    pageTo("selectInvoice");
                    fetchApplylist();
                });
            this.setAllSelect();

            this.$test && this.$test.click(function () {
                self.test();
            });
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
                url: "/inc/ocr/OcrIndex.php",
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
                    if (ret == "nomodel") {
                        alert("此模板暂不支持");
                    } else if (ret == "216630") {
                        alert("未识别，请重现扫描");
                    } else if (ret == "nodata") {
                        alert("数据获取失败，请重新扫描");
                    } else if (ret == "servererror") {
                        alert("服务连接失败，请与管理员联系");
                    } else {
                        ret = JSON.parse(ret);

                        $.each(fieldManager.fieldsInstance, function(k, v) {
                            $.each(ret, function(retk, retv) {
                                if (retk == k) {
                                    if (
                                        v["$config"]["data_type"] == "ListView"
                                    ) {
                                        var id = v["$config"]["id"];
                                        self.handleListdata(id, retv);
                                    } else {
                                        v.setOcrValue(retv);
                                    }
                                }
                            });
                        });
                    }
                }
            });
        },

        //渲染圖片
        addimages: function(file) {
            //图片类型可多选
            var self = this;
            var name = file.name;
            name = name.substring(0, name.length - 1);
            self.$list.append(
                '<a href="javascript:void(0);" data-attach_id="' +
                    file.id +
                    '" data-attach_name="' +
                    name +
                    '" class="pda_attach pda_attach_img" is_image="1" _href="' +
                    file.url +
                    '"><img src="' +
                    file.url +
                    '" /><span class="fileupload-item icon-delete">×</span></a>'
            );
            self.pageShow();
        },

        delete_attach: function(id, name) {
            var self = this;
            var delete_flag = false;
            var data_id =
                self.$config.form_flag == true
                    ? self.$config.field_id
                    : self.$config.id;
            $.ajax({
                type: "GET",
                url: "/pda/approve_center/delete_data_attach.php",
                cache: false,
                async: false,
                data: {
                    RUN_ID: q_run_id,
                    FLOW_ID: q_flow_id,
                    ATTACHMENT_ID: id,
                    ATTACHMENT_NAME: name,
                    DATA_ID: data_id
                },
                success: function(d) {
                    if (d == "1") {
                        //alert("附件删除成功");
                        delete_flag = true;
                    }
                },
                error: function(e) {
                    //alert("附件删除失败");
                    delete_flag = false;
                }
            });
            return delete_flag;
        },

        handleListdata: function(id, data) {
            var self = this;
            $.ajax({
                url: "/inc/ocr/ocrlistdata.php",
                type: "post",
                data: {
                    id: id,
                    data: JSON.stringify(data),
                    listdata: self.$config.fieldmanager.listocrdata[id]
                },
                cache: false,
                async: false,
                success: function(d) {
                    fieldManager.listocrdata[id] = d;
                    d = JSON.parse(d);
                    var ListViewFieldManager = TListView.TListViewManager;
                    self.$config.fieldmanager.ocrlist[
                        id
                    ] = new ListViewFieldManager(
                        {
                            wrapper: $("#list-wrapper" + id).find(
                                ".list-content"
                            ),
                            fieldmanager: self.$config.fieldmanager
                        },
                        d
                    );
                },
                error: function() {
                    alert("listerror");
                }
            });
        },

        //得到表单中已保存的发票id
        setAllSelect:function() {
            var list = this.$config.list;
            var attachId = '';
            for (var i = 0; i < list.length; i++) {
                attachId = attachId + list[i].attach_id + ',';
            }
            $.ajax({
                type: "post",
                url: "/inc/ocr/interface/invoiceLib.php",
                data: {
                    fn:'getInvoiceId',
                    attachId:attachId,
                },
                cache: false,

                success: function(ret) {
                    $.ProLoading.hide();
                    var id = JSON.parse(ret);
                    allSelect = allSelect.concat(id);
                }
            });
        },

        selectInvoice: function() {
            var detail = selectInvoiceData.list;
        },

        //获取图片信息
        getData: function() {
            var self = this;
            var required_val = this.required;
            var low_id = this.low_id;
            var ret = {
                name: self.$config.id,
                value: {
                    attach_id: "",
                    attach_name: ""
                }
            };
            if (self.$list.find("a.pda_attach").length > 0) {
                self.$list.find("a.pda_attach").each(function() {
                    var $this = $(this);
                    var attach_id = $this.attr("data-attach_id");
                    var attach_name = $this.attr("data-attach_name");
                    ret.value.attach_id += attach_id.replace(/,/g, "") + ",";
                    ret.value.attach_name +=
                        attach_name.replace(/\*/g, "") + "*";
                });
            }
            if (self.$list.find("div.pda_attach").length > 0) {
                self.$list.find("div.pda_attach").each(function() {
                    var $this = $(this);
                    var attach_id = $this.attr("data-attach_id");
                    var attach_name = $this.attr("data-attach_name");
                    ret.value.attach_id += attach_id.replace(/,/g, "") + ",";
                    ret.value.attach_name +=
                        attach_name.replace(/\*/g, "") + "*";
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
                )
            };
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
        //根据是否有图片来控制按钮和占位图的显示或隐藏
        pageShow: function() {
            //如果ocr控件下存在附件图片就不显示占位图

            if (this.$list.find(".pda_attach").length != 0) {
                $(".ocrPlaceHolder").hide();
            } else {
                $(".ocrPlaceHolder").show();
            }
        },
        test: function() {
            var self = this;
            var maptitle = this.mapTitle;
            var maptype = this.mapType;
            var mapvalue = this.mapValue;
            var mapvaluelist = this.mapValuelist;
            var mapmodeltype = this.modelType;

            $.ajax({
                type: "post",
                url: "/inc/ocr/OcrIndex.php",
                data: {
                    name: "pic.jpg",
                    id: "154@1908_1118348354",
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
                                    var id = v["$config"]["id"];//DATA_2
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

    });
    exports.TOcrCtrl = window.TOcrCtrl = TOcrCtrl;
});
