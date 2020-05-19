var MS = {};
var ST = {};
var S = {};
var APP = {};
var ICON = {};
APP = {
    d: null,
    tpl: {
        app : '<li><span class="list-item-title"></span></li>'
    },
    newapp: function(){
        this.app_id = null;
        this.action = "new";
        $("#manageModal").modal();
        //this.uploadInit();

        $("#app_wrapper img").attr("src", BASE["defaultIcon"]);
        $("#appName").val("");
        $("#appModule").val("");
        $("#appUrl").val("");
        $("#appDesc").val("");
        $("#appIcon").val("");
        $("#appId").val("");
        $("#appType").val("");

        $("#TO_ID").val("ALL_DEPT");
        $("#TO_NAME").val("全体部门");
        $("#PRIV_ID").val("");
        $("#PRIV_NAME").val("");
        $("#COPY_TO_ID").val("");
        $("#COPY_TO_NAME").val("");

        $("#app_wrapper_result").empty();
    },
    add: function(t){
        var currentScreen = $("#app-list-wrapper-slider .app-list-items:eq(" + BASE["currentScreen"] +")");
        if(currentScreen.find("li").length == 16){
            alert("当前屏幕已经有16个应用!");
            return;
        }
        //新增时判断VIP组件
        var array = ["17"];
        for(var i=0;i<array.length;i++)
        {
            if(array[i]<=t)
            {
                var is = 1;
                if($("#is_buy").val()==0 && $("#app_type").val()==0)
                {
                    $.ajax({
                        url:'check.php',
                        data: {
                            id: t,
                        },
                        async: false,
                        type: 'get',
                        success:function(d){
                            if(d == 'error')
                            {
                                is = 0;
                            }
                        }
                    });
                    if(is == 0)
                    {
                        $("#not_buy_app").modal();
                        return false;
                    }
                }
            }
        }
        // console.log(currentScreen.find("li[data-id='"+ t +"']").length);
        if(currentScreen.find("li[data-id='"+ t +"']").length > 0) return;
        var tpl = $(this.tpl.app);
        var appDom = $(".app-list-items li[data-id='"+ t +"']");
        var icon = appDom.attr("data-app-icon");
        var name = appDom.attr("data-app-name");
        tpl.attr("data-id", t);
        tpl.prepend("<img src='" + icon +"' title='" + name + "'>");
        tpl.find("span").text(name);
        currentScreen.append(tpl);
        var appDom = $(".app-list-items li[data-id='"+ t +"'] .list-item-btn");
        appDom.find("button[node-type='delete']").show();
        appDom.find("button[node-type='add']").hide();

        this.update();
    },
    remove: function(t){
        var screenDom = $("#app-list-wrapper-slider li[data-id='" + t + "']");
        var appDom = $(".app-list-items li[data-id='"+ t +"'] .list-item-btn");
        appDom.find("button[node-type='delete']").hide();
        appDom.find("button[node-type='add']").show();
        screenDom.remove();

        this.update();
    },
    manage: function(t){
        this.app_id = null;
        this.action = "new";
        if(t)
        {
            this.app_id = t;
            this.action = "edit";
            this.get(t, $.proxy(function(d){this.render(d)}, this));
        }
        $("#manageModal").modal();
    },
    get: function(t, callback){
        this.d = null;
        var d = {};
        var that = this;
        $.ajax({
            url: 'app.php',
            type: 'get',
            data: {t: t},
            sync: true,
            dataType: 'json',
            success: function (data) {
                callback(data);
            }
        });
        return that;
    },
    render: function(d){
        //console.log(d);
        if(!d) return;
        if(d.APP_ICON == "")
            $("#app_wrapper img").attr("src", BASE["defaultIcon"]);
        else
            $("#app_wrapper img").attr("src", d.APP_ICON_URL);
        $("#appName").val(d.APP_NAME);
        $("#appModule").val(d.APP_MODULE);
        $("#appUrl").val(d.APP_URL);
        $("#appDesc").val(d.APP_DESC);
        $("#appIcon").val(d.APP_ICON);
        $("#appId").val(d.APP_ID);
        $("#appType").val(d.APP_TYPE);

        $("#TO_ID").val(d.APP_PRIV_SHOW.PRIV_DEPT);
        $("#TO_NAME").val(d.APP_PRIV_SHOW.PRIV_DEPT_NAME);
        $("#PRIV_ID").val(d.APP_PRIV_SHOW.PRIV_ROLE);
        $("#PRIV_NAME").val(d.APP_PRIV_SHOW.PRIV_ROLE_NAME);
        $("#COPY_TO_ID").val(d.APP_PRIV_SHOW.PRIV_USER);
        $("#COPY_TO_NAME").val(d.APP_PRIV_SHOW.PRIV_USER_NAME);
    },
    uploadInit: function(){
        $("#manageModal .nav li").eq(0).click();
        if(this.uploader) return;
        this.uploader = new WebUploader.Uploader({
            auto: true,
            swf: BASE["MYOA_JS_SERVER"] + '/static/js/webuploader/Uploader.swf',
            fileVal: 'ICON',
            pick: {
                id: "#upload_cover",
                label: "点击上传图片",
                multiple: false
            },
            accept: {
                title: 'Images',
                extensions: 'gif,jpg,jpeg,bmp,png',
                mimeTypes: 'image/*'
            },
            server: 'upload.php',
        });

        this.uploader.on("uploadSuccess", function(file, response){
            if(response.result == "error")
            {
                $("#app_wrapper_result").attr("class", "text-error").text(response.tips);
            }
            else if(response.result == "success")
            {
                $("#app_wrapper img").attr("src", response.url);
                $("#app_wrapper_result").attr("class", "text-success").text(response.tips);
                $("#appIcon").val(response.name);
            }
            return;
        });
    },
    getStr: function(){
        var str = "";
        $("#app-list-wrapper-slider ul").each(function(){
            $(this).find("li").each(function(){
                str+= $(this).attr("data-id") + ",";
            });
            str = str.substr(0, str.length-1);
            str += "|";
        });
        str = str.substr(0, str.length-1);
        return str;
    },
    update: function(){
        var appStr = this.getStr();
        $.ajax({
            url: 'save.php',
            type: 'post',
            data: {'ajaxAction': 'update', 'appStr' : appStr},
            success: function (data) {
                if(data == "ok"){
                    alert("更新应用成功");
                }
            }
        });
    },
    show_buy: function(){
        $("#not_buy_app").modal();
    }
};

MS = {
    options: function(p, c, d){
        if(!this.p) this.p = p;
        this.c = this.p.find(c);
        this.c.w = this.c.width();
        this.c.h = this.c.outerHeight(true);
        this.p.t = this.p.offset().top;
        this.d = d;
        return this;
    },
    go: function(t){
        if(this.d == "h"){
            this.p.animate({left: -(t*this.c.w)}, 500);
            BASE["currentScreen"] = t;
        }else{
            this.p.animate({top: - t * this.c.h + parseInt(this.p.css("top"))}, 600);
        }
    },
    jumpTo: function(s){
        this.p.animate({top: - s * BASE["perScreenThumb"] * this.c.h}, 600);
    }
};

ST = {
    tpl: '<li><div></div><span></span></li>',
    add: function(){
        var len = $("#mobile-screen-thumb li").length;
        var ld = $(this.tpl);
        ld.find("span").text(len);
        $("#mobile-screen-thumb li.mobile-screen-add").before(ld);
        $("#mobile-screen-thumb li").removeClass("active");
        ld.addClass("active");
    }
};

S = {
    tpl: {
        navdot: '\r\n<a href="javascript:;"></a>',
        screen: '<ul class="app-list-items clearfix"></ul>'
    },
    add: function(){
        $("#mobile-nav-screen").append(this.tpl.navdot);
        $("#mobile-nav-screen a").removeClass("active");
        $("#app-list-wrapper-slider").append(this.tpl.screen);
    }
};

function inherit(p){
    if(p == null)
        throw TypeError();
    if(Object.create)
        return Object.create(p);
    var t = typeof p;
    if(t !== "object" && t !== "function") throw TypeError();
    function f(){}
    f.prototype = p;
    return new f();
}