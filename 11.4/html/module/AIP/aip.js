function AIP(container,option)
{
    this.aip = null;
    var def = {
        id : "aip",
        prefix : "AIP_",
        width : "100%",
        height : "100%",
        fileBae64 : "",
        fileURL : "",
        convert : 0,
        loginUser : "HWSEALDEMO",
        loginType : 4,
        loginAccess : 65535,
        loginPass : "DEMO",
        debug : false
    };
    var p = extend(def,option,true);
    
    this.id = p.id;
    this.prefix = p.prefix;
    this.width = p.width;
    this.height = p.height;
    this.fileBae64 = p.fileBae64;
    this.fileURL = p.fileURL;
    this.convert = p.convert;
    this.loginUser = p.loginUser;
    this.loginType = p.loginType;
    this.loginAccess = p.loginAccess;
    this.loginPass = p.loginPass;
    this.debug = p.debug;
    
    this.Load(container);
}

AIP.prototype.Load = function(container)
{
    var s = "";
    s += '<object id="' + this.prefix + this.id + '" style="width:' + this.width + ';height:' + this.height + ';" codebase="/module/AIP/HWPostil_trial.cab#version=3,1,2,0" classid="clsid:FF3FE7A0-0578-4FEE-A54E-FB21B277D567">';
    s += '<param name="_Version" value="65536">';
    s += '<param name="_ExtentX" value="17410">';
    s += '<param name="_ExtentY" value="10874">';
    s += '<param name="_StockProps" value="0">';
    s += '</object>';
    s += '<input type="hidden" name="'+this.prefix+'DATA' + this.id + '" value="' + this.fileBae64 + '">';
    
    document.getElementById(container).innerHTML = s;
    this.aip = document.getElementById(this.prefix + this.id);
}

/**
 * ����ǩ��������İ�ʽ�ؼ� 091013
 * readOnlyFlag��1-�ð�ʽ����Ϊֻ����0��ʾ��д
 * moduleName��������Դ����sign-ǩ�����棻print-�����ӡ����
 */
AIP.prototype.OnCtrlReady = function(readOnlyFlag, moduleName)
{
    this.aip.ShowDefMenu = 0 ;							        // ���ز˵��� 0Ϊ����; 1Ϊ��ʾ
    this.aip.ShowScrollBarButton = 1;						    // ����ˮƽ�������ԵĹ�����
    this.aip.ShowToolBar = 0;								    // ���ع����� 0Ϊ����; 1Ϊ��ʾ
    
    if(this.fileBae64 != "")
    {
       var ErrCode = this.aip.LoadFileBase64(this.fileBae64);
       if(ErrCode != 0 && this.debug == true)
          alert(this.GetErrDesc(ErrCode));
    }
    else if(this.fileURL != "")
    {
       var ErrCode = this.aip.LoadFile(this.fileURL);
       if(ErrCode != 0 && this.debug == true)
          alert(this.GetErrDesc(ErrCode));
    }
}

/**
 * ������д������İ�ʽ�ؼ� 091013
 * 
 */
AIP.prototype.OnCtrlReadySign = function(userType)
{
    this.aip.ShowDefMenu = 1 ;					    // ���ز˵��� 0Ϊ����; 1Ϊ��ʾ
    this.aip.ShowScrollBarButton = 0;				// ����ˮƽ�������ԵĹ�����
    this.aip.ShowToolBar = 1;						// ���ع����� 0Ϊ����; 1Ϊ��ʾ
}
/**
 * ���ڴ�ӡ�İ�ʽ�ؼ� 110111
 * 
 */
AIP.prototype.OnCtrlReadyPrint = function(userType)
{
    this.aip.ShowDefMenu = 1 ;					    // ���ز˵��� 0Ϊ����; 1Ϊ��ʾ
    this.aip.ShowScrollBarButton = 0;				// ����ˮƽ�������ԵĹ�����
    this.aip.ShowToolBar = 1;						// ���ع����� 0Ϊ����; 1Ϊ��ʾ
}

AIP.prototype.Login = function()
{
    var ErrCode = this.aip.Login(this.loginUser, this.loginType, this.loginAccess, this.loginPass, "");
    if(ErrCode != 0)
        alert(this.GetErrDesc(ErrCode));
}

AIP.prototype.SetSize = function(width, height)
{
    this.width = width;
    this.height = height;
}

AIP.prototype.SetCurrAction = function(action)
{
    this.aip.CurrAction = action;
}

AIP.prototype.SetFileBase64 = function(data)
{
    this.fileBae64 = data;
}

AIP.prototype.SetFileURL = function(url)
{
    this.fileURL = url;
}

AIP.prototype.SetLoginUser = function(name, type, access, pass)
{
    this.loginUser = name;
    this.loginType = type;
    this.loginAccess = access;
    this.loginPass = pass;
}

AIP.prototype.GetValue = function(name)
{
    return this.aip.GetValue(name);
}

AIP.prototype.GetCurrFileBase64 = function()
{
    return this.aip.GetCurrFileBase64();
}

AIP.prototype.DoReset = function()
{
    this.aip.UndoAll();
}

AIP.prototype.InsertNote = function(data, type, field, posX)
{
    var NoteInfo;
    var NoteCount = 0;
    var docHeight = 0;
    while(NoteInfo = this.aip.GetNextNote("HWSEALDEMOADMIN", 0, NoteInfo))
    {
       NoteCount++;
    }
    
    var NoteName = this.aip.InsertNote(field + NoteCount, this.aip.CurrPage, type, posX, docHeight, 1, 1);
    if(NoteName)
    {
       this.aip.SetValue(NoteName, data);
       this.aip.SetValue(NoteName, ":PROP:BORDER:0");
       this.aip.SetValue(NoteName, ":PROP::LABEL:1");
    }
    
    return NoteName;
}

AIP.prototype.LoadFileBase64 = function(data)
{
    var ErrCode = this.aip.LoadFileBase64(data);
    if(ErrCode != 0 && this.debug == true)
        alert(this.GetErrDesc(ErrCode));
}

AIP.prototype.GetErrDesc = function(ErrCode)
{
    switch(ErrCode)
    {
        case 0: return td_lang.global.right;//"��ȷ"
        case -1: return td_lang.module.msg_1;//"AIP��������æ�����Ժ�����"
        case -2: return td_lang.module.msg_2;//"��������Ч���������Ƿ�������"
        case -3: return td_lang.module.msg_3;//"����δ֪�����Ӵ���"
        case -5: return td_lang.module.msg_4;//"��Ч���������ϵͳ��֧�ֱ�����"
        case -6: return td_lang.module.msg_5;//"ϵͳ��֧�ֱ�����"
        case -7: return td_lang.module.msg_6;//"��������ݰ���ʽ���������ݴ��䲻��ȷ"
        case -8: return td_lang.module.msg_7;//"�����������ʱ�䲻�������ܾ���¼���뱣֤����ʱ��ͷ�����ʱ�������ʮ�����֮��"
        
        case -11: return td_lang.module.msg_8;//"ָ��֤���Ѿ������ϣ��޷�ʹ��"
        case -12: return td_lang.module.msg_9;//"ָ��֤���Ѿ����ڣ��޷�ʹ��"
        case -13: return td_lang.module.msg_10;//"���������ݿ���δ���ֱ��û���Ӧ��֤��"
        
        case -20: return td_lang.module.msg_36;//"Ȩ�޴��󣬱��û���Ȩʹ��ָ����ӡ��"
        case -21: return td_lang.module.msg_37;//"ָ��ӡ���Ѿ������ϣ��޷�ʹ��"
        case -22: return td_lang.module.msg_38;//"ָ��ӡ���Ѿ����ڣ��޷�ʹ��"
        case -23: return td_lang.module.msg_39;//"ָ��ӡ�²�����"
        
        case -30: return td_lang.module.msg_40;//"Ȩ�޴�������Ȩ�������ĵ�"
        case -31: return td_lang.module.msg_41;//"�ĵ��Ѿ�������������Ȩ����"
        case -33: return td_lang.module.msg_42;//"ָ���ĵ�������"
        case -35: return td_lang.module.msg_43;//"Ȩ�޴�������Ȩ��ӡ���ĵ�"
        case -36: return td_lang.module.msg_44;//"�ĵ���ӡ���������꣬����Ȩ��ӡ���ĵ�"
        
        case -40: return td_lang.module.msg_45;//"�򿪷��������ݿ�ʧ��"
        case -41: return td_lang.module.msg_46;//"���·��������ݿ�ʧ��"
        case -42: return td_lang.module.msg_59;//"��ȡ���������ݿ�ʧ��"
        case -43: return td_lang.module.msg_60;//"�������������ݿ�ʧ��"
        
        case -50: return td_lang.module.msg_61;//"���û���û�е�¼���������޷����б�����"
        case -51: return td_lang.module.msg_62;//"�û���¼�������"
        case -52: return td_lang.module.msg_63;//"���û��ѱ�����������"
        case -53: return td_lang.module.msg_64;//"ָ���û�������"
        case -54: return td_lang.module.msg_65;//"�û����벻���ϸ�ʽ������ϵ����Ա"
        case -55: return td_lang.module.msg_66;//"δ���ֵ�ǰ�û���֤����Ϣ"
        
        case -70: return td_lang.module.msg_67;//"������δע�ᣬ����ϵ����Ա"
        case -71: return td_lang.module.msg_68;//"���������û���������Ȩ����������ϵ����Ա"
        case -72: return td_lang.module.msg_69;//"���û������ڱ��������������ϵ����Ա"
        case -73: return td_lang.module.msg_70;//"���������֧�ִ��ֵ�¼��ʽ"
        case -74: return td_lang.module.msg_71;//"�������˴���ʱ"
        case -75: return td_lang.module.msg_72;//"�������˷���δ֪��������ϵ����Ա"
        
        case -100: return td_lang.module.msg_73;//"���������ַ��Ч���뱣֤��������IP:Port(ֱ��)����HTTP URL(��http://www.xx.com:8080/aipserver.jsp)"
        case -101: return td_lang.module.msg_74;//"���ӳ�ʱ"
        case -102: return td_lang.module.msg_75;//"�û�ȡ��"
        case -103: return td_lang.module.msg_76;//"�����û�IDӦ����'HWSEALDEMO'��ʼ"
        case -104: return td_lang.module.msg_77;//"δ�����û��б�"
        
        case -110: return td_lang.module.msg_78;//"�����û���¼"
        case -111: return td_lang.module.msg_79;//"���ִ��󣬲�������ֹ"
        
        case -120: return td_lang.module.msg_80;//"��Ч�Ķ���"
        case -121: return td_lang.module.msg_81;//"��Ч���ݴ���"
        case -122: return td_lang.module.msg_82;//"��Ч�Ĵ���"
        case -123: return td_lang.module.msg_83;//"��Ч������"
        
        case -130: return td_lang.module.msg_84;//"���У�����"
        case -131: return td_lang.module.msg_85;//"�ڴ��޷�����"
        
        case -140: return td_lang.module.msg_86;//"�������Ȩ"
        case -141: return td_lang.module.msg_87;//"���������"
        case -142: return td_lang.module.msg_88;//"δ֪����"
        
        case -200: return td_lang.module.msg_89;//"û�в������ܿ�"
        case -201: return td_lang.module.msg_90;//"��������ܿ���¼PIN��"
        case -202: return td_lang.module.msg_91;//"ϵͳδ������Ч��˽Կ"
        case -203: return td_lang.module.msg_92;//"ϵͳδ������Ч��֤��"
        case -204: return td_lang.module.msg_93;//"����������CSP����"
        case -205: return td_lang.module.msg_94;//"�������ڶ�����ܿ�"
        case -206: return td_lang.module.msg_95;//"CSP����δ��װ,��ȷ���Ѿ���װ����ȷ�����ܿ�����"
        case -209: return td_lang.module.msg_96;//"�������ܿ������г���δ֪����"
        
        case -210: return td_lang.module.msg_97;//"�����֤δͨ��"
        case -211: return td_lang.module.msg_98;//"���ܿ��в�����ӡ��"
        
        default : return td_lang.module.msg_88;//"δ֪����"
    }
}

function extend(des, src, override){
    if(src instanceof Array){
        for(var i = 0, len = src.length; i < len; i++)
             extend(des, src[i], override);
    }
    for( var i in src){
        if(override || !(i in des)){
            des[i] = src[i];
        }
    } 
    return des;
}