//2013/9/8 18:35:33 新微博程序
var WB = {}
WB.css = 
{
    getMoreBtnActiveClass: 'load',
    getMoreBtnDisableClass: 'end'
};
WB.lang = 
{
    nomoredata: td_lang.general.weixunshare.tips_nomoredata
};
WB.dom = 
{
    getMoreBtn: '[node-type="getMoreBtn"]',
    append: '[node-type="listWrap"]'
};
WB.layer = 
{
    tmp : '<div class="WB_overLayer" node-type="wbOverLayer"></div>',
    inited: false,
    init: function()
    {
        if(this.inited) return;
        this.overlay = jQuery(this.tmp);
        jQuery('body').append(this.overlay);
        this.inited = true;  
    },
    show: function()
    {
        this.init();
        if(!/*@cc_on!@*/0)
        {
            this.overlay.fadeIn();
        }
        else
        {
            this.overlay.show();
        }
    },
    hide: function()
    {
        if(!/*@cc_on!@*/0)
        {
            this.overlay.fadeOut();
        }
        else
        {
            this.overlay.hide();
        }    
    }
};

WB.msg = 
{
    wrapper: '<div class="WB_msg T_layer" node-type="wbMsgBox"></div>',
    inited: false,
    type: 'center',
    container: 'body',
    init: function(msg, callback, type)
    {
        if(typeof type != 'undefined')
            this.type = type;
        
        if(this.type == 'center')
            WB.layer.show();
        
        if(!this.inited)
        {
            this.msgBox = jQuery(this.wrapper);
            jQuery(this.container).append(this.msgBox);
            this.inited = true;         
        }
        var that = this;
        this.msgBox.empty().append(msg)

        if(!jQuery.isEmptyObject(callback))
        {
            jQuery.each(callback, function(k, v)
            {
                that.msgBox.find("[node-type='wbMsgOpts'][node-data='"+ k +"']").click(function(){
                    callback[k]();       
                });    
            });
        }
        return this;
    },
    show: function(handle)
    {
        var that = this;
        if(this.type == 'targetSlide')
        {
            var pos = handle.offset();
            var noticeboxh = that.msgBox.outerHeight(true);
            var scrollDom = jQuery("[node-type='scrollDom']");
            var top = pos.top + scrollDom.data().jsp.getContentPositionY() - scrollDom.offset().top;

            if((pos.top - scrollDom.offset().top) < noticeboxh)
            {
                top = noticeboxh + 10;
            }
            that.msgBox.css({
                right: 10+"px", 
                top: top > 0 ? top + "px" : 0,
                height: 0,
                display: "block"
            }).animate({
              top: '-='+(noticeboxh + 5),
              height: noticeboxh
            }, 300);
        }else{
            this.msgBox.addClass("center").show();  
        }
        
    },
    hide: function()
    {
        this.msgBox.hide();
        if(this.type == 'center')
          WB.layer.hide();
    }
};

//获取更多
WB.getMore = function()
{
    var that = this;
    this.getMore.params = WB.params;
    this.getMore.params.action = 'getMore';

    jQuery.ajax({
        type: "GET",
        url: "get_more.php",
        data: this.getMore.params,
        beforeSend: function(){
            jQuery(that.dom.getMoreBtn).addClass(that.css.getMoreBtnActiveClass);
        },
        success: function(msg)
        {
            if(msg == "NOMOREDATA")
            {
                jQuery(that.dom.getMoreBtn)
                  .removeClass(that.css.getMoreBtnActiveClass)
                  .addClass(that.css.getMoreBtnDisableClass)
                  .find("a").remove();
                //WB.message(that.lang.nomoredata);
                return;
            }
            jQuery(that.dom.append).append(msg);
            jQuery(that.dom.getMoreBtn).removeClass(that.css.getMoreBtnActiveClass);
            if(that.getCompleteCallBack)
            {
                that.getCompleteCallBack();   
            }
            that.params.END_ID = jQuery(that.dom.append).find("[node-type='listItem']:last").attr("node-data-id");
        }
   });     
};

//点击人的照片
WB.openPic = function(handle)
{
    var that = this;
    var uid = handle.attr('node-data');
    if(that.params.ISPIRIT=="1")
    {
        if(parent && parent.openURL)
        {
            parent.openURL("/general/ipanel/user/person.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+ that.params.I_VER +"&UID="+uid);
            return;
        }

        window.open("/general/ipanel/user/person.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&UID="+uid);
        return;
    }

    mytop=(screen.availHeight-600)/2;
    myleft=(screen.availWidth-950)/2;
    window.open("/general/ipanel/user/person.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&UID="+uid, "Person Panel", "height=600, width=950, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}

//点击人的名字
WB.viewUser = function(handle)
{
    var that = this;
    var uid = handle.attr('node-data');
    if(that.params.ISPIRIT=="1")
    {
        if(parent && parent.openURL)
        {
            parent.openURL("/general/ipanel/smsbox/user.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&UID="+uid);
            return;
        }

        window.open("/general/ipanel/smsbox/user.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&UID="+uid);
        return;
    }

    mytop=(screen.availHeight-528)/2;
    myleft=(screen.availWidth-355)/2;
    window.open("/general/ipanel/smsbox/user.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&UID="+uid, "user", "height=528, width=355, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
}

//转播
WB.repost = function(handle)
{
    var that = this;
    var wxid = handle.parents('[node-type="listItem"]').attr('node-data-id');
    if(that.params.ISPIRIT=="1")
    {
        if(parent && parent.openURL)
        {
            parent.openURL("/general/ipanel/smsbox/broadcast.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&wxid="+wxid);
            return;
        }

        window.open("/general/ipanel/smsbox/broadcast.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&wxid="+wxid);
        return;
    }

    mytop=(screen.availHeight-528)/2;
    myleft=(screen.availWidth-355)/2;
    window.open("/general/ipanel/smsbox/broadcast.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&wxid="+wxid, "repost", "height=528, width=355, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");   
};

//私信
WB.privateMsg = function(handle)
{
    var that = this;
    var uid = handle.attr("action-data-id");
    var name = handle.attr("action-data-name");
    if(that.params.ISPIRIT=="1")
    {
        if(parent && parent.openURL)
        {
            parent.openURL("/general/status_bar/sms_back.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&TO_UID="+uid+"&TO_NAME="+escape(name));
            return;
        }
    }
    mytop=(screen.availHeight-405)/2;
    myleft=(screen.availWidth-400)/2;
    window.open ("/general/status_bar/sms_back.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&TO_UID="+uid+"&TO_NAME="+escape(name), "privateMsg", "height=355, width=455, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no");
};

//删除
WB.del = function(handle)
{
    var p = handle.parents('[node-type="listItem"]');
    var callback = {
        "ok": function(){
            jQuery.post(WB.del.request_url, {'action' : 'delete', 'id' : p.attr('node-data-id')}, function(msgback){
                var data = JSON.parse(msgback);
                if(data.code == 'ok')
                {
                    p.animate({height: 0}, 300, function(){
                        p.remove();  
                    });
                    WB.msg.hide();

                    if(jQuery.isFunction(WB.callback.del))
                    {
                        WB.callback.del();
                    }
                }
            });
        },
        "cancel" : function(){
            WB.msg.hide();
        }
    }
    WB.msg.container = '[node-type="listWrap"]';
    WB.msg.init(WB.del.tmpl, callback, 'targetSlide').show(handle);
};

//取消关注
WB.unfollow =  function(handle)
{
    var uid = handle.attr('action-data');
    var callback = {
        "ok": function(){
            jQuery.post(WB.unfollow.request_url, {'action' : 'unfollow', 'uid' : uid}, function(msgback){
                var data = JSON.parse(msgback);
                if(data.code == 'ok')
                {
                    var fansCountDom = jQuery("[node-type='fansCount']");
                    fansCountDom.text(parseInt(fansCountDom.text()) - 1);
                    jQuery("[node-type='unfollowBtn']").hide();
                    jQuery("[node-type='followBtn']").show();
                    WB.msg.hide();
                }
            });
        },
        "cancel" : function(){
            WB.msg.hide();
        }
    };
    WB.msg.init(WB.unfollow.tmpl, callback).show(handle);
}

WB.follow =  function(handle)
{
    var uid = handle.attr('action-data');
    jQuery.post(WB.follow.request_url, {'action' : 'follow', 'uid' : uid}, function(msgback){
        var data = JSON.parse(msgback);
        if(data.code == 'ok')
        {
            var fansCountDom = jQuery("[node-type='fansCount']");
            fansCountDom.text(parseInt(fansCountDom.text()) + 1);
            jQuery("[node-type='followBtn']").hide();
            jQuery("[node-type='unfollowBtn']").show();
        }
    });
};

WB.getNew = function()
{
    this.getNew.params = WB.params;
    var uid = 0;
    uid = jQuery("[node-type='listWrap']").find("[node-type='listItem']:first").attr('node-data-id');

    this.getNew.params.action = 'getNew';
    this.getNew.params.START_ID = uid;
    jQuery.get(WB.getNew.request_url, WB.getNew.params, 
        function(html)
        {
            if(jQuery(".MessageBox").length > 0)
                jQuery(".MessageBox").hide();
            
            var _html = jQuery(html).hide();
            jQuery("[node-type='listWrap']").prepend(_html.fadeIn('slow'));

            WB.sharebox.hdset('');

            if(WB.callback && WB.callback.getNew  && jQuery.isFunction(WB.callback.getNew))
            {
                WB.callback.getNew(jQuery('<div>' + html +'</div>').find("[node-type='listItem']").length);
            }
        }
    );
}

WB.sharebox = {
    init: function(){
        if(!this.sharebox)
            this.sharebox = jQuery("[node-type='weibox']").data().sharebox;    
    },
    hdset: function(str){
        this.init();
        this.sharebox.hd.set(str);
    },
    hdget: function(){
        this.init();
        return this.sharebox.hd.get();
    },
    getcontent: function(){
        this.init();
        return this.sharebox.content.getcontent();
    },
    setcontent: function(str){
        this.init();
        this.sharebox.textarea.insertText(str);
    }
};

WB.imageShow = function(wxid)
{
    if(this.params.ISPIRIT=="1")
    {
        if(parent && parent.openURL)
        {
            parent.openURL("/general/ipanel/smsbox/file.php?ISPIRIT="+ this.params.ISPIRIT +"&I_VER="+this.params.I_VER+"&WXID="+wxid);
            return;
        }
    }
    mytop=(screen.availHeight-510)/2;
    myleft=(screen.availWidth-660)/2;
    window.open ("/general/ipanel/smsbox/file.php?ISPIRIT="+ this.params.ISPIRIT +"&I_VER="+this.params.I_VER+"&WXID="+wxid, "imageShow", "height=510, width=660, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no");
};

//参与话题
WB.topic = function(handle)
{
    var that = this;
    var topic = handle.attr('node-data-topic');
    if(that.params.ISPIRIT=="1")
    {
        if(parent && parent.openURL)
        {
            parent.openURL("/general/ipanel/smsbox/jointopic.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&t="+topic);
            return;
        }

        window.open("/general/ipanel/smsbox/jointopic.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&t="+topic);
        return;
    }

    mytop=(screen.availHeight-395)/2;
    myleft=(screen.availWidth-305)/2;
    window.open("/general/ipanel/smsbox/jointopic.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&t="+topic, "repost", "height=395, width=305, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");   
};

//查看详情
WB.detail = function(handle){
    var that = this;
    var wxid = handle.attr('node-data-id');
    if(that.params.ISPIRIT=="1")
    {
        if(parent && parent.openURL)
        {
            parent.openURL("/general/ipanel/smsbox/detail.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&wxid="+wxid);
            return;
        }
    }

    mytop=(screen.availHeight-420)/2;
    myleft=(screen.availWidth-350)/2;
    window.open("/general/ipanel/smsbox/detail.php?ISPIRIT="+ that.params.ISPIRIT +"&I_VER="+that.params.I_VER+"&wxid="+wxid, "WeiboDetail", "height=420, width=350, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
};

WB.fixIspiritArgs = function(){
    if(typeof(window.external.OA_SMS) == 'undefined'){
        //
    }
    else
    {
        if(WB.params.ISPIRIT != 1)
        {
            window.location.href = window.location.href + "&ISPIRIT=1&I_VER=2";
        }   
    }
}

//页面更新机制
WB.update = function(){
    
    if(jQuery.isFunction(WB.updateFuncs))
        WB.updateFuncs();
    else
        WB.getNew();
}