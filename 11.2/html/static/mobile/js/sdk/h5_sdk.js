tMobileSDK = window.tMobileSDK || {};

tMobileSDK.ready = function(func){
	func();

};

//隐藏右上角按钮
tMobileSDK.hideOptionMenu = function() {
    wx.hideOptionMenu();
};

//显示右上角按钮
tMobileSDK.showOptionMenu = function() {
    wx.showOptionMenu();
};


tMobileSDK.previewImage = function() {

};

/*
 * 选择图片上传
 * @param obj 对应的参数
 */
tMobileSDK.chooseImage = function(options) {
	alert("请使用客户端进行操作。");
};

tMobileSDK.uploadImage = function(options) {
	alert("请使用客户端进行操作。");
};

tMobileSDK.saveToServer = function(options){
	alert("请使用客户端进行操作。");
};

tMobileSDK.selectFile = function(options) {
	alert("请使用客户端进行操作。");
};

tMobileSDK.openUrl = function(opts) {
	window.open(opts.url)
}
tMobileSDK.synchroAgendaToMobile = function(opts) {
	alert("请使用客户端进行操作。");
}
tMobileSDK.synchroAgendaToOA = function(opts) {
	alert("请使用客户端进行操作。");
}
/*
 * 增加授权地址
 * @param url 地址
 */

tMobileSDK.addAuthCode = function(url){

}

tMobileSDK.scanQRCode = function(options){
	alert("请使用客户端进行操作。");
}
