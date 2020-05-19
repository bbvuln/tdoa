tMobileSDK = window.tMobileSDK || {};

tMobileSDK.ready = function(func){
    td.ready(func)
};

tMobileSDK.showUserDetails = function(opts) {
    td.confirm({
        uid: opts.uid || '',
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.confirm = function(opts) {
    td.confirm({
        title: opts.title || '提示',
        message: opts.message || '',
        buttonLabels: opts.buttonLabels || ['确定','取消'],
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.toast = function(opts) {
    td.toast({
        text: opts.text || '',
        duration: opts.duration || 5,
        delay: opts.delay || 0,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.getLocation = function(opts) {
    td.getLocation({
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.previewImage = function(opts) {

    opts.urls.forEach(function(v, k){
        opts.urls[k] = tMobileSDK.addAuthCode(v);
    });
    opts.current = tMobileSDK.addAuthCode(opts.current);

    td.previewImage({
        urls: opts.urls || [],
        current: opts.current || 0,
		allowDownload: opts.allowDownload,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.launchApp = function(opts) {
    td.launchApp({
        app: opts.app || '',
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.previewFile = function(opts) {
    td.previewFile({
		canEdit: opts.canEdit,
        url: opts.url || '',
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.call = function(opts) {
    td.call({
        phoneNum: opts.phoneNum || '',
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.sendMessage = function(opts) {
    td.sendMessage({
        phoneNums: opts.phoneNums || [''],
        content: opts.content || '',
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.getNetworkType = function(opts) {
    td.getNetworkType({
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.chooseImage = function(opts) {
    td.chooseImage({
        multiple: opts.multiple,
        max: opts.max,
        fromCamera: opts.fromCamera || false,//true只能拍照，false可以拍照和选图
        onSuccess: function(result){
			var attachments = result.map(function(item){
				return {
					id: item.id,
					name: item.name,
					url: item.url
				}
			})
			opts.onSuccess(attachments)
		},
        onFail: opts.onFail
    })
}


tMobileSDK.uploadImage = function(opts) {
    this.chooseImage(opts)
}

tMobileSDK.selectFile = function(opts) {
    td.selectFile({
        multiple: opts.multiple,
        onSuccess: function(result){
			var attachments = result.map(function(item){
				return {
					id: item.id,
					name: item.name,
					url: item.url
				}
			})
			opts.onSuccess(attachments)
		},
        onFail: opts.onFail
    })
}

tMobileSDK.selectUser = function(opts) {
    td.selectUser({
		multiple: opts.multiple,
        users: opts.users,
		usableUids: opts.usableUids,
        checkedAll: opts.checkedAll,
        whiteList: opts.whiteList,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.selectDept = function(opts) {
    td.selectDept({
		multiple: opts.multiple,
        depts: opts.depts,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.setLeft = function(opts) {
    td.setLeft({
		leftIcon: opts.leftIcon,
		closeIcon: opts.closeIcon,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.setTitle = function(opts) {
    td.setTitle({
        title: opts.title,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

//添加头部右侧类型，默认是text，如果传值为icon，则客户端直接生成搜索框，并处理搜索框的点击事件，通过桥调用前端自定义方法返回搜索框输入的值。
tMobileSDK.setRight = function(opts) {
    td.setRight({
        show: opts.show || true,
        control: opts.control || false,
        text: opts.text || '',
		/*
		type: opts.type || 'text',
		iconUrl: opts.iconUrl || '', //type为icon时的搜索结果地址
		onSearchChange: opts.onSearchChange || function(){},//前端自定义方法
		*/
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.actionSheet = function(opts) {
    td.actionSheet({
        title: opts.title || '标题',
        cancelButton: opts.cancelButton || '取消',
        otherButtons: opts.otherButtons || ['btn1','btn2'],
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.buildHeader = function(headerData, options) {
	options = options || {};
    //移除上一次构建的header
	$('.sdk-footer').remove();
	$('body .ui-actionsheet').remove();
	tMobileSDK.configs.hasBuildFunc = false;
    //处理未传入数据和传入数据为空对象的情况
    if(!headerData){
        return false;
    } else {
        var isEmpty = true;
        for(var prop in headerData){
            isEmpty = false;
            break;
        }
        if(isEmpty){
            return false;
        }
    }
    //配置参数
    var opts = {};
    var wxhtml = '';
    opts.container = options.targetEl || 'body';
    //如果headerData.c是数组
    if($.isArray(headerData.c)){
        opts.title = '';
		var documentTitle = '';
        $.each(headerData.c,function(index,item){
            opts.title += '<button class="ui-btn ' + (item.active ? 'active': '') + '" data-op="' + item.event + '">' + item.title + '</button>';
            wxhtml += '<li class="ui-border-r" data-op="' + item.event + '">' + item.title + '</li>';
			if(item.active){
				documentTitle = item.title
			}
        });
		wxhtml = wxhtml ? '<ul class="ui-tiled ui-border-t">'+wxhtml : '';
		var _id = options.id || "J_toolbar", $el;//get the container id
		$el = $('<footer class="sdk-footer ui-footer ui-footer-stable" id="'+ _id +'"></footer>').prependTo(opts.container).toolbar(opts);
		document.title = documentTitle;
    } else {
        opts.title = headerData.c.title || '';
		document.title = opts.title;
    }
    //中间的操作按钮
    $('#'+ _id +' .ui-toolbar-title .ui-btn').on('click',function(e){
        $('#'+ _id +' .ui-toolbar-title .ui-btn').removeClass('active');
        $(this).addClass('active');
        var cb = $(this).attr('data-op');
        if(cb){
            tMobileSDK.util.eval(cb);
			document.title = $(this).text();
        }
    });
	
	
	
	
	
	
	
	

    // var hash = {}
    // var title = []

    // if(headerData.c && headerData.c.push) {
        // headerData.c.forEach(function(item, index) {
            // title.push({
                // title: item.title,
                // active: item.active
            // })
            // hash[index] = item.event
        // })
    // } else if(headerData.c) {
        // title.push(headerData.c.title)
    // }
    // headerData.c && this.setTitle({
        // title: title,
        // onSuccess: function(results) {
            // if(results) {
                // tMobileSDK.util.eval(hash[results])
            // }
        // }
    // })
	//alert(document.title)
	headerData.c && this.setTitle({
        title: document.title,
        onSuccess: function(results) {
            if(results) {
                tMobileSDK.util.eval(hash[results])
            }
        }
    })
    if(headerData.r === null) headerData.r = {}
    headerData.r && this.setRight({
        show: headerData.r.show,
        control: true,
        text: headerData.r.title,
		type: headerData.r.type,
		onSearchChange: headerData.r.onSearchChange,
		iconUrl: headerData.r.iconUrl,
        onSuccess: function(results) {
            if(results === 'clicked') {
                headerData.r.event && tMobileSDK.util.eval(headerData.r.event)
            }
        }
    })
    if(headerData.l === null) headerData.l = {}
	headerData.l && this.setLeft({
		onSuccess: function(results) {
			headerData.l.event && tMobileSDK.util.eval(headerData.l.event)
		}
	})
}

tMobileSDK.buildFunc = function(funcData) {
    var hash = {};
    var otherButtons = [];
    funcData.forEach(function(item, index) {
        hash[index] = item.event;
        otherButtons.push(item.title);
    })
    this.actionSheet({
        title: '选项',
        otherButtons: otherButtons,
        onSuccess: function(results) {
            if(results != -1) {
                tMobileSDK.util.eval(hash[results])
            }
        }
    })
}

tMobileSDK.closeWebview = function() {
    td.closeWebview()
}

tMobileSDK.dingBtn = function() {}

tMobileSDK.checkIn = function(opts) {
    td.checkIn({
        locales: opts.locales || [], // 可考勤地址，数组存地址对象，包含经纬度数据
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.getMacAddress = function(opts) {
    td.getMacAddress({
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.getLocationByMap = function(opts) {
    td.getLocationByMap({
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.getLocationOutside = function(opts) {
    td.getLocationOutside({
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.openUrl = function(opts) {
	td.openUrl({
		url: opts.url,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

/*
 * 增加授权地址
 * @param url 地址
 */

tMobileSDK.addAuthCode = function(url){
    return url;
}

tMobileSDK.sendModuleName = function(opts) {
    td.sendModuleName({
        name: opts.name || '',
        url: opts.url || '',
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })

}

tMobileSDK.sendJumpURL = function(opts) {
    td.sendJumpURL({
        url: opts.url,
		openMode: opts.openMode,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })

}

tMobileSDK.synchroAgendaToMobile = function(opts) {
	td.synchroAgendaToMobile({
		data: opts.data,
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}
tMobileSDK.synchroAgendaToOA = function(opts) {
	td.synchroAgendaToOA({
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.ocrScan = function(opts) {
    td.ocrScan({
        onSuccess: opts.onSuccess,
        onFail: opts.onFail
    })
}

tMobileSDK.scanQRCode = function(options){
	td.richScan({
		onSuccess: function(res) {
			options.onSuccess && options.onSuccess(res);
		},
		onFail: function(res) {
			options.onFail && options.onFail(res);
		}
	});
}
