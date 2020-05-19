tMobileSDK = window.tMobileSDK || {};

tMobileSDK.ready = function(func){
    wx.ready(func);

};

//�������Ͻǰ�ť
tMobileSDK.hideOptionMenu = function() {
    wx.hideOptionMenu();
};

//��ʾ���Ͻǰ�ť
tMobileSDK.showOptionMenu = function() {
    wx.showOptionMenu();
};

/**
* ����΢����ͼƬԤ��scrollview
* @param array urls ͼƬurl����
* @param string current ��ǰͼƬurl
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
		url: url || '', // ��ҪԤ���ļ��ĵ�ַ(�������ʹ�����·��)
		name: opts.name || '', // ��ҪԤ���ļ����ļ���(����Ļ�ȡurl����󲿷�)
		size: opts.size // ��ҪԤ���ļ����ֽڴ�С(����)
	});
}

/*
 * ѡ��ͼƬ�ϴ�
 * @param obj ��Ӧ�Ĳ���
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
                    //����΢���ϴ���ץȡ��oa�������Ĺ���
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
 * �ϴ�����
 * @param obj ��Ӧ�Ĳ���
 */
tMobileSDK.selectFile = function(options) {
    tMobileSDK.uploadImage(options);
}
tMobileSDK.synchroAgendaToMobile = function(opts) {
}
tMobileSDK.synchroAgendaToOA = function(opts) {
}
/*
 * ������Ȩ��ַ
 * @param url ��ַ
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
		needResult: 1, // Ĭ��Ϊ0��ɨ������΢�Ŵ���1��ֱ�ӷ���ɨ������
		scanType: ["qrCode", "barCode"], // ����ָ��ɨ��ά�뻹�������루һά�룩��Ĭ�϶��߶���
		success: function(res) {
			options.onSuccess && options.onSuccess(res);
		},
		error: function(res) {
			options.onFail && options.onFail(res);
		}
	});
}