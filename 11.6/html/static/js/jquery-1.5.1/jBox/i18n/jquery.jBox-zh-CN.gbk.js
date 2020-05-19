
/* jBox ȫ������ */
var jBoxConfig = {};

jBoxConfig.defaults = {
    id: null, /* ��ҳ���е�Ψһid�����Ϊnull���Զ��������id,һ��idֻ����ʾһ��jBox */
    top: '15%', /* �����붥���ľ���,�����ǰٷֱȻ�����(�� '100px') */
    border: 5, /* ���ڵ���߿����ش�С,������0���ϵ����� */
    opacity: 0.1, /* ���ڸ�����͸����,�������Ϊ0,����ʾ����� */
    timeout: 0, /* ������ʾ���ٺ�����Զ��ر�,�������Ϊ0,���Զ��ر� */
    showType: 'fade', /* ������ʾ������,��ѡֵ��:show��fade��slide */
    showSpeed: 'fast', /* ������ʾ���ٶ�,��ѡֵ��:'slow'��'fast'����ʾ��������� */
    showIcon: true, /* �Ƿ���ʾ���ڱ����ͼ�꣬true��ʾ��false����ʾ�����Զ����CSS��ʽ��������Ϊͼ��Ϊ������ */
    showClose: true, /* �Ƿ���ʾ�������ϽǵĹرհ�ť */
    draggable: true, /* �Ƿ�����϶����� */
    dragLimit: true, /* �ڿ����϶����ڵ�����£��Ƿ������ڿ��ӷ�Χ */
    dragClone: false, /* �ڿ����϶����ڵ�����£���갴��ʱ�����Ƿ��¡���� */
    persistent: true, /* ����ʾ����������£���������ʱ���Ƿ��ִ��ڲ��ر� */
    showScrolling: true, /* �Ƿ���ʾ����Ĺ����� */
    ajaxData: {},  /* �ڴ�������ʹ��get:��post:ǰ׺��ʶ������£�ajax post�����ݣ����磺{ id: 1 } �� "id=1" */
    iframeScrolling: 'auto', /* �ڴ�������ʹ��iframe:ǰ׺��ʶ������£�iframe��scrolling����ֵ����ѡֵ�У�'auto'��'yes'��'no' */

    title: 'jBox', /* ���ڵı��� */
    width: 350, /* ���ڵĿ�ȣ�ֵΪ'auto'���ʾ���ص����� */
    height: 'auto', /* ���ڵĸ߶ȣ�ֵΪ'auto'���ʾ���ص����� */
    bottomText: '', /* ���ڵİ�ť��ߵ����ݣ���û�а�ťʱ��������Ч */
    buttons: { 'ȷ��': 'ok' }, /* ���ڵİ�ť */
    buttonsFocus: 0, /* ��ʾ�ڼ�����ťΪĬ�ϰ�ť��������0��ʼ */
    loaded: function (h) { }, /* ���ڼ�����ɺ�ִ�еĺ�������Ҫע����ǣ������ajax��iframeҲ��Ҫ�ȼ�����http������㴰�ڼ�����ɣ�����h��ʾ�������ݵ�jQuery���� */
    submit: function (v, h, f) { return true; }, /* ������ڰ�ť��Ļص�����������trueʱ��ʾ�رմ��ڣ�������������v��ʾ����İ�ť�ķ���ֵ��h��ʾ�������ݵ�jQuery����f��ʾ�����������form����ֵ */
    closed: function () { } /* ���ڹرպ�ִ�еĺ��� */
};

jBoxConfig.stateDefaults = {
    content: '', /* ״̬�����ݣ���֧��ǰ׺��ʶ */
    buttons: { 'ȷ��': 'ok' }, /* ״̬�İ�ť */
    buttonsFocus: 0, /* ��ʾ�ڼ�����ťΪĬ�ϰ�ť��������0��ʼ */
    submit: function (v, h, f) { return true; } /* ���״̬��ť��Ļص�����������trueʱ��ʾ�رմ��ڣ�������������v��ʾ����İ�ť�ķ���ֵ��h��ʾ�������ݵ�jQuery����f��ʾ�����������form����ֵ */
};

jBoxConfig.tipDefaults = {
    content: '', /* ��ʾ�����ݣ���֧��ǰ׺��ʶ */
    icon: 'info', /* ��ʾ��ͼ�꣬��ѡֵ��'info'��'success'��'warning'��'error'��'loading'��Ĭ��ֵΪ'info'����Ϊ'loading'ʱ��timeoutֵ�ᱻ����Ϊ0����ʾ�����Զ��رա� */
    top: '40%', /* ��ʾ�붥���ľ���,�����ǰٷֱȻ�����(�� '100px') */
    width: 'auto', /* ��ʾ�ĸ߶ȣ�ֵΪ'auto'���ʾ���ص����� */
    height: 'auto', /* ��ʾ�ĸ߶ȣ�ֵΪ'auto'���ʾ���ص����� */
    opacity: 0, /* ���ڸ�����͸����,�������Ϊ0,����ʾ����� */
    timeout: 3000, /* ��ʾ��ʾ���ٺ�����Զ��ر�,�����Ǵ���0������ */
    closed: function () { } /* ��ʾ�رպ�ִ�еĺ��� */
};

jBoxConfig.messagerDefaults = {
    content: '', /* ��Ϣ�����ݣ���֧��ǰ׺��ʶ */
    title: 'jBox', /* ��Ϣ�ı��� */
    icon: 'none', /* ��Ϣͼ�ֵ꣬Ϊ'none'ʱΪ����ʾͼ�꣬��ѡֵ��'none'��'info'��'question'��'success'��'warning'��'error' */
    width: 350, /* ��Ϣ�ĸ߶ȣ�ֵΪ'auto'���ʾ���ص����� */
    height: 'auto', /* ��Ϣ�ĸ߶ȣ�ֵΪ'auto'���ʾ���ص����� */
    timeout: 3000, /* ��Ϣ��ʾ���ٺ�����Զ��ر�,�������Ϊ0,���Զ��ر� */
    showType: 'slide', /* ��Ϣ��ʾ������,��ѡֵ��:show��fade��slide */
    showSpeed: 600, /* ��Ϣ��ʾ���ٶ�,��ѡֵ��:'slow'��'fast'����ʾ��������� */
    border: 0, /* ��Ϣ����߿����ش�С,������0���ϵ����� */
    buttons: {}, /* ��Ϣ�İ�ť */
    buttonsFocus: 0, /* ��ʾ�ڼ�����ťΪĬ�ϰ�ť��������0��ʼ */
    loaded: function (h) { }, /* ���ڼ�����ɺ�ִ�еĺ���������h��ʾ�������ݵ�jQuery���� */
    submit: function (v, h, f) { return true; }, /* �����Ϣ��ť��Ļص�����������trueʱ��ʾ�رմ��ڣ�������������v��ʾ����İ�ť�ķ���ֵ��h��ʾ�������ݵ�jQuery����f��ʾ�����������form����ֵ */
    closed: function () { } /* ��Ϣ�رպ�ִ�еĺ��� */
};

jBoxConfig.languageDefaults = {
    close: '�ر�', /* �������Ͻǹرհ�ť��ʾ */
    ok: 'ȷ��', /* $.jBox.prompt() ϵ�з����ġ�ȷ������ť���� */
    yes: '��', /* $.jBox.warning() �����ġ��ǡ���ť���� */
    no: '��', /* $.jBox.warning() �����ġ��񡱰�ť���� */
    cancel: 'ȡ��' /* $.jBox.confirm() �� $.jBox.warning() �����ġ�ȡ������ť���� */
};
jQuery.jBox.setDefaults(jBoxConfig);
