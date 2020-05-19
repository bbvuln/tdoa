/*
  formbuildercfg
  by tianlin 20171219
  tl@tongda2000.com
  note: url like 'index.php?formId=1&module=test'
*/

//global
function getSearchParam(name){
  var searchStr = location.search
  if(typeof searchStr !== 'string') {
      throw new TypeError('Don\'t fool me with the wrong location.search.')
    }
    if(searchStr === '' || searchStr === '?') {
      throw new Error('No formId was found in current url.')
    }
    var search = searchStr[0] === '?' ? searchStr.slice(1) : searchStr
    var searchPairs = search.split('&')
    var searchHash = {}
    for(var i = 0;i<searchPairs.length;i++){
      var key = searchPairs[i].split('=')[0]
      var val =  searchPairs[i].split('=')[1]
      searchHash[key] = val
    }
  return searchHash[name]
}
function getFormId(){
  return getSearchParam('formId')
}
var formId = getFormId(location.search)
var flowId = getSearchParam('flowId')

//base
function BaseConfig () {
  this.link = [//����
    { title: '�����', url: '', active: true, show: false },
    { title: 'Ԥ��', url: "/general/appbuilder/web/appdesign/appdata/view?formId="+formId+"&userid=&time=&type=preview", active: false, show: false },
  ]
  this.loadFormUrl = ''//���ر�url string
  this.saveFormUrl = ''//����url string
  this.showIsStop = false//�Ƿ�ͣ�������Ƿ���ʾ bool
  this.config =  {//�Ҳ�ؼ���������Ȩ�޿��� object
    showOutlink: false,// Ĭ��ֵ�Ƿ���ʾ��������ȡ��
  }
}
BaseConfig.prototype.getLink = function() {
  return this.link
};
BaseConfig.prototype.getShowIsStop = function() {
  return this.showIsStop
};
BaseConfig.prototype.getLoadFormUrl = function() {
  return this.loadFormUrl
};
BaseConfig.prototype.getSaveFormUrl = function() {
  return this.saveFormUrl
};
BaseConfig.prototype.getConfig = function() {
  return this.config
};

//test module
function TestConfig(){
  BaseConfig.call(this);
  this.link = [
    { title: '�����', url: '', active: true, show: false },
    { title: '���Ե���11', url: 'https://www.baidu.com/', active: false, show: false },
    { title: '����22', url: "http://www.jianshu.com/", active: false, show: false },
	{ title: 'Ԥ��', url: "/general/appbuilder/web/appcenter/appdata/view?formId="+formId+"&userid=&time=&type=preview", active: false, show: false }
  ]
}
TestConfig.prototype = new BaseConfig();
TestConfig.prototype.constructor = TestConfig;

//appcenter
function AppCenterConfig(){
  BaseConfig.call(this);
  this.link = [
    { title: '�����', url: '', active: true, show: false },
    { title: '��������', url: "/general/system/approve_center/flow_guide/flow_type/flow_design/index.php?FLOW_ID="+flowId, active: false, show: false },
    { title: '������', url: "/general/appbuilder/web/appdesign/appformulas?formId="+formId, active: false, show: false },
    { title: 'Ȩ��', url: "/general/appbuilder/web/appdesign/apppriv?formId="+formId, active: false, show: false },
    { title: '��ӡģ��', url: "/general/appbuilder/web/appdesign/appprint?formId="+formId+"&printId=", active: false, show: false },
    // { title: '�Զ������', url: "/general/appbuilder/web/appdesign/appcustom?formId="+formId, active: false, show: false },
    { title: '��ʱ����', url: "/general/appbuilder/web/appdesign/apptimer?formId="+formId, active: false, show: false },
    { title: '�ӱ�', url: "/general/appbuilder/web/appdesign/appsubform?formId="+formId, active: false, show: false },
	{ title: 'Ԥ��', url: "/general/appbuilder/web/appcenter/appdata/view?formId="+formId+"&userid=&time=&type=preview", active: false, show: false }
  ]
  this.loadFormUrl = '/general/appbuilder/web/appdesign/appform/fetch'
  this.saveFormUrl = '/general/appbuilder/web/appdesign/appform/save'
  this.showIsStop = true
  this.config =  {
    showOutlink: true,
  }
}
AppCenterConfig.prototype = new BaseConfig();
AppCenterConfig.prototype.constructor = AppCenterConfig;

function createBuilderConfig(){
  var _module = getSearchParam('module')
  function _getModuleInsatnce(_module){
    switch(_module){
      case 'appcenter':
        return new AppCenterConfig()
      case 'test':
        return new TestConfig()
      default:
        return new BaseConfig()
    }
  }
  var instance = _getModuleInsatnce(_module)
  return {
    link: instance.getLink(),
    showIsStop: instance.getShowIsStop(),
    loadFormUrl: instance.getLoadFormUrl(),
    config: instance.getConfig(),
    saveFormUrl: instance.getSaveFormUrl()
  }
}

window.builderConfig = createBuilderConfig()
