tMobileSDK = window.tMobileSDK || {};

tdReact = window.tdReact || {}

tMobileSDK.platForm = 'h5';

tMobileSDK.configs = {
    headerType: 'header'
}

tMobileSDK.util = {
    eval: function(expression){
        try {
            eval(expression);
        } catch(error) {
            console.error(error.message);
        }
    }
};

tMobileSDK.collectInfo = function(url){
    if(!url){
        return;
    }
    var params = {};

    if(navigator.userAgent){
        params.ua = navigator.userAgent;
    };
    if(window.screen){
        params.sw = window.screen.width;
        params.sh = window.screen.height;
    };
    if(window.location){
        params.host = window.location.host;
        params.url = window.location.href;
    }
    params.platform = this.platForm || '';


    try{
        var timing = performance.timing.toJSON();
        var result = {};
        for(var key in timing){
            if(timing[key]){
                result[key] = timing[key];
            }
        }
        params.timing = JSON.stringify(result);
    }catch(e){}


    var args = '';
    for(var i in params) {
        if(args != '') {
            args += '&';
        }
        args += i + '=' + encodeURIComponent(params[i]);
    }

    var img = new Image(1,1);
    img.src = url + '?' + args;
};


tMobileSDK.module2icon = function(module){
    var host = location.origin;
    var url = host + "/static/images/mobile_app/{module}.png".replace(/{module}/i, module);
    return url;
}

tMobileSDK.ding = function(){};

tMobileSDK.dingBtn = function(){};

tMobileSDK.setLeft = function(){};

tMobileSDK.ready = function(func){
    func();
};

tMobileSDK.confirm = function(opts){
    tdReact.confirm(opts)
}

tMobileSDK.toast = function(opts){
    tdReact.toast(opts)
}

tMobileSDK.buildHeader = function(opts){
    tdReact.buildHeader(opts)
};

tMobileSDK.buildFunc = function(opts){
    tdReact.buildFunc(opts)
};

tMobileSDK.selectUser = function(opts){
    tdReact.selectUser(opts)
};

tMobileSDK.selectDept = function(opts){
    tdReact.selectDept(opts)
};
//隐藏右上角按钮
tMobileSDK.hideOptionMenu = function() {};
//显示右上角按钮
tMobileSDK.showOptionMenu = function() {};

tMobileSDK.previewImage = function() {};

tMobileSDK.chooseImage = function(options) {};

tMobileSDK.uploadImage = function(options) {};

tMobileSDK.saveToServer = function(options){};

tMobileSDK.selectFile = function(options) {};

tMobileSDK.openUrl = function(opts) {
    window.open(opts.url)
}
//增加授权地址
tMobileSDK.addAuthCode = function(url){
    return url;
}
tMobileSDK.synchroAgendaToMobile = function(opts) {
    alert("请使用客户端进行操作。");
}
tMobileSDK.synchroAgendaToOA = function(opts) {
    alert("请使用客户端进行操作。");
}
