tMobileSDK = window.tMobileSDK || {};

tMobileSDK.ready = function(func){
	func();

};

//�������Ͻǰ�ť
tMobileSDK.hideOptionMenu = function() {
    wx.hideOptionMenu();
};

//��ʾ���Ͻǰ�ť
tMobileSDK.showOptionMenu = function() {
    wx.showOptionMenu();
};


tMobileSDK.previewImage = function() {

};

/*
 * ѡ��ͼƬ�ϴ�
 * @param obj ��Ӧ�Ĳ���
 */
tMobileSDK.chooseImage = function(options) {
	alert("��ʹ�ÿͻ��˽��в�����");
};

tMobileSDK.uploadImage = function(options) {
	alert("��ʹ�ÿͻ��˽��в�����");
};

tMobileSDK.saveToServer = function(options){
	alert("��ʹ�ÿͻ��˽��в�����");
};

tMobileSDK.selectFile = function(options) {
	alert("��ʹ�ÿͻ��˽��в�����");
};

tMobileSDK.openUrl = function(opts) {
	window.open(opts.url)
}
tMobileSDK.synchroAgendaToMobile = function(opts) {
	alert("��ʹ�ÿͻ��˽��в�����");
}
tMobileSDK.synchroAgendaToOA = function(opts) {
	alert("��ʹ�ÿͻ��˽��в�����");
}
/*
 * ������Ȩ��ַ
 * @param url ��ַ
 */

tMobileSDK.addAuthCode = function(url){

}

tMobileSDK.scanQRCode = function(options){
	alert("��ʹ�ÿͻ��˽��в�����");
}
