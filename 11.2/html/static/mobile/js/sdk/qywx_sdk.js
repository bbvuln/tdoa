tMobileSDK = window.tMobileSDK || {};

tMobileSDK.ready = function(func){
    wx.ready(func);

};

//隐藏右上角按钮
tMobileSDK.hideOptionMenu = function() {
    wx.hideOptionMenu();
};

//显示右上角按钮
tMobileSDK.showOptionMenu = function() {
    wx.showOptionMenu();
};

/**
* 调出微信内图片预览scrollview
* @param array urls 图片url数组
* @param string current 当前图片url
*/
tMobileSDK.previewImage = function(opts) {
    opts.urls.forEach(function(v, k){
        opts.urls[k] = tMobileSDK.addAuthCode(v);
    });
    opts.current = tMobileSDK.addAuthCode(opts.current);

    wx.previewImage({
        current: opts.current || 0,
        urls: opts.urls || []
    });
};

tMobileSDK.previewFile = function(opts) {
	var url = location.origin+opts.url
	wx.previewFile({
		url: url || '', // 需要预览文件的地址(必填，可以使用相对路径)
		name: opts.name || '', // 需要预览文件的文件名(不填的话取url的最后部分)
		size: opts.size // 需要预览文件的字节大小(必填)
	});
}

/*
 * 选择图片上传
 * @param obj 对应的参数
 */
tMobileSDK.chooseImage = function(options) {
    var sdk = this;
    var defaultOpts = {
        multiple: true,
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
			sdk.uploadServerSuccess = false;
			sdk.imgLocalIds = [];
			var localIds = res.localIds;
			sdk.imgLocalIds = localIds;
			sdk.imgServerId = [];
			this.chooseCb && this.chooseCb();
        },
        chooseCb : function(){
			var that = this;
            tMobileSDK.saveToServer({
                qyappName : that.qyappName || 'department',
                onFail : that.onFail,
                onSuccess : that.onSuccess
            })
        }
    };
    var opts = $.extend(true, {}, defaultOpts, options);
    wx.chooseImage(opts);
};

tMobileSDK.uploadImage = function(options) {
    var defaultOpts = {
        multiple: true,
        chooseCb : function (){
            var that = this;
            tMobileSDK.saveToServer({
                qyappName : that.qyappName,
                onFail : that.onFail,
                onSuccess : that.onSuccess
            })
        },
        onFail : function (){},
        onSuccess : function (){}
    };
    var opts = $.extend(true, {}, defaultOpts, options);
    this.chooseImage(opts);
};

tMobileSDK.saveToServer = function(options){
    var sdk = this;
    var count = 0;
    function upload() {
        wx.uploadImage({
            localId: sdk.imgLocalIds[count],
            isShowProgressTips: 1,
            success: function(res){
                if (res.errMsg != 'uploadImage:ok') {
                    sdk.uploadServerSuccess = false;
                    options.onFail && options.onFail();
                    return false;
                }
                sdk.imgServerId.push(res.serverId);
                count++;
                if(count < sdk.imgLocalIds.length) {
                    upload();
                }
                if(count == sdk.imgLocalIds.length) {
                    sdk.uploadServerSuccess = true;
                    //处理微信上传后抓取到oa服务器的过程
                    var imgServerId = sdk.imgServerId.join(',');
                    $.ajax({
                        type: 'GET',
                	    url: '/pda/workflow/img_download.php',
                	    cache: false,
                	    data: {
        					'ATTACHMENTS': imgServerId,
        					"PLATFORM": "qywx",
                            'appName': options.qyappName 
        				},
                	    success: function(ret)
                        {
                            ret = JSON.parse(ret);
                            var result = [];
                            $.each(ret, function(k, image){
                                result.push({
                                    id: image['attach_id'],
                                    name: image['attach_name'],
                                    url: image['attach_url']
                                });
                            })
                            options.onSuccess && options.onSuccess(result);
                            return;
                        }
                    });
                }
            }
        });
    }
    upload();
};

/*
 * 上传附件
 * @param obj 对应的参数
 */
tMobileSDK.selectFile = function(options) {
    tMobileSDK.uploadImage(options);
}
tMobileSDK.synchroAgendaToMobile = function(opts) {
}
tMobileSDK.synchroAgendaToOA = function(opts) {
}
/*
 * 增加授权地址
 * @param url 地址
 */
tMobileSDK.addAuthCode = function(url){
    var state = WXS.WXState;
    var baseUrl = WXS.URI;
    if(url.match(/^\/inc\/attach.php/)){
        url = url + "&PHPSESSID="+WXS.P.split(';')[1];
    }
    if(url.match(/^\//)){
        url = window.location.protocol + "//" + window.location.host + url;
    }
    return url;
}

tMobileSDK.scanQRCode = function(options){
	wx.scanQRCode({
		desc: '',
		needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
		scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
		success: function(res) {
			options.onSuccess && options.onSuccess(res);
		},
		error: function(res) {
			options.onFail && options.onFail(res);
		}
	});
}