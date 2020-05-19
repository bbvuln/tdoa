var FF = {};

FF.inputSuccessTips = {
    show: function(d, t){
        FF.inputErrTips.remove(d);
        this.remove(d);
        d.append("<img src='/static/images/correct.gif' class='okImg' align='absMiddle'>");
    },
    remove: function(d){
        d.find("img.okImg").remove();
    }
};

FF.inputErrTips = {
    show: function(d, t){
        FF.inputSuccessTips.remove(d);
        this.remove(d);
        d.append('<span class="help-inline error">' + t + '</span>');
    },
    remove: function(d){
        d.find("span.error").remove();
    }
};

FF.folderExists = function(data, cb){
    var that = this;
    $.get(FF.url.api, data,function(msg){
        var b = JSON.parse(msg);
        if(b.code == "failed"){
            cb(true, b.tips);
        }else{
            cb(false, b.tips);
        }
    });
};

FF.folderNew = function(data, cb){
    var that = this;
    $.post(FF.url.api, data,function(msg){
        var b = JSON.parse(msg);
        if(b.code == "ok"){
            cb(true, b);
        }else{
            cb(false, b);
        }
    });
};

FF.fileSign = function(data, cb){
    var that = this;
    $.post(FF.url.api, data,function(msg){
        var b = JSON.parse(msg);
        if(b.code == "ok"){
            cb(true, b);
        }else{
            cb(false, b);
        }
    });
};

FF.fileDelete = function(data, cb){
    var that = this;
    $.post(FF.url.api, data,function(msg){
        var b = JSON.parse(msg);
        if(b.code == "ok"){
            cb(true, b);
        }else{
            cb(false, b);
        }
    });
};

FF.folderEdit = function(data, cb){
    var that = this;
    $.post(FF.url.api, data,function(msg){
        var b = JSON.parse(msg);
        if(b.code == "ok"){
            cb(true, b);
        }else{
            cb(false, b);
        }
    });
};