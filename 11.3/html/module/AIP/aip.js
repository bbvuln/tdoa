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
 * 用于签批界面里的版式控件 091013
 * readOnlyFlag：1-该版式区域为只读；0表示可写
 * moduleName（调用来源）：sign-签批界面；print-浏览打印界面
 */
AIP.prototype.OnCtrlReady = function(readOnlyFlag, moduleName)
{
    this.aip.ShowDefMenu = 0 ;							        // 隐藏菜单栏 0为隐藏; 1为显示
    this.aip.ShowScrollBarButton = 1;						    // 隐藏水平滚动条旁的工具条
    this.aip.ShowToolBar = 0;								    // 隐藏工具栏 0为隐藏; 1为显示
    
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
 * 用于手写窗口里的版式控件 091013
 * 
 */
AIP.prototype.OnCtrlReadySign = function(userType)
{
    this.aip.ShowDefMenu = 1 ;					    // 隐藏菜单栏 0为隐藏; 1为显示
    this.aip.ShowScrollBarButton = 0;				// 隐藏水平滚动条旁的工具条
    this.aip.ShowToolBar = 1;						// 隐藏工具栏 0为隐藏; 1为显示
}
/**
 * 用于打印的版式控件 110111
 * 
 */
AIP.prototype.OnCtrlReadyPrint = function(userType)
{
    this.aip.ShowDefMenu = 1 ;					    // 隐藏菜单栏 0为隐藏; 1为显示
    this.aip.ShowScrollBarButton = 0;				// 隐藏水平滚动条旁的工具条
    this.aip.ShowToolBar = 1;						// 隐藏工具栏 0为隐藏; 1为显示
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
        case 0: return td_lang.global.right;//"正确"
        case -1: return td_lang.module.msg_1;//"AIP服务器正忙，请稍候再试"
        case -2: return td_lang.module.msg_2;//"服务器无效，请检查其是否已启动"
        case -3: return td_lang.module.msg_3;//"出现未知的连接错误"
        case -5: return td_lang.module.msg_4;//"无效的命令，可能系统不支持本操作"
        case -6: return td_lang.module.msg_5;//"系统不支持本操作"
        case -7: return td_lang.module.msg_6;//"错误的数据包格式，可能数据传输不正确"
        case -8: return td_lang.module.msg_7;//"本机与服务器时间不符，被拒绝登录，请保证本机时间和服务器时间误差在十五分钟之内"
        
        case -11: return td_lang.module.msg_8;//"指定证书已经被作废，无法使用"
        case -12: return td_lang.module.msg_9;//"指定证书已经过期，无法使用"
        case -13: return td_lang.module.msg_10;//"服务器数据库中未发现本用户对应的证书"
        
        case -20: return td_lang.module.msg_36;//"权限错误，本用户无权使用指定的印章"
        case -21: return td_lang.module.msg_37;//"指定印章已经被作废，无法使用"
        case -22: return td_lang.module.msg_38;//"指定印章已经过期，无法使用"
        case -23: return td_lang.module.msg_39;//"指定印章不存在"
        
        case -30: return td_lang.module.msg_40;//"权限错误，你无权操作本文档"
        case -31: return td_lang.module.msg_41;//"文档已经被锁定，你无权操作"
        case -33: return td_lang.module.msg_42;//"指定文档不存在"
        case -35: return td_lang.module.msg_43;//"权限错误，你无权打印本文档"
        case -36: return td_lang.module.msg_44;//"文档打印份数已用完，你无权打印本文档"
        
        case -40: return td_lang.module.msg_45;//"打开服务器数据库失败"
        case -41: return td_lang.module.msg_46;//"更新服务器数据库失败"
        case -42: return td_lang.module.msg_59;//"读取服务器数据库失败"
        case -43: return td_lang.module.msg_60;//"操作服务器数据库失败"
        
        case -50: return td_lang.module.msg_61;//"本用户还没有登录服务器，无法进行本操作"
        case -51: return td_lang.module.msg_62;//"用户登录密码错误"
        case -52: return td_lang.module.msg_63;//"本用户已被服务器作废"
        case -53: return td_lang.module.msg_64;//"指定用户不存在"
        case -54: return td_lang.module.msg_65;//"用户密码不符合格式，请联系管理员"
        case -55: return td_lang.module.msg_66;//"未发现当前用户的证书信息"
        
        case -70: return td_lang.module.msg_67;//"服务器未注册，请联系管理员"
        case -71: return td_lang.module.msg_68;//"服务器上用户数多于授权数量，请联系管理员"
        case -72: return td_lang.module.msg_69;//"本用户不属于本域服务器，请联系管理员"
        case -73: return td_lang.module.msg_70;//"域服务器不支持此种登录方式"
        case -74: return td_lang.module.msg_71;//"服务器端处理超时"
        case -75: return td_lang.module.msg_72;//"服务器端发生未知错误，请联系管理员"
        
        case -100: return td_lang.module.msg_73;//"域服务器地址无效，请保证其类似于IP:Port(直连)，或HTTP URL(如http://www.xx.com:8080/aipserver.jsp)"
        case -101: return td_lang.module.msg_74;//"连接超时"
        case -102: return td_lang.module.msg_75;//"用户取消"
        case -103: return td_lang.module.msg_76;//"测试用户ID应该以'HWSEALDEMO'开始"
        case -104: return td_lang.module.msg_77;//"未发现用户列表"
        
        case -110: return td_lang.module.msg_78;//"有新用户登录"
        case -111: return td_lang.module.msg_79;//"出现错误，操作被终止"
        
        case -120: return td_lang.module.msg_80;//"无效的对象"
        case -121: return td_lang.module.msg_81;//"无效数据错误"
        case -122: return td_lang.module.msg_82;//"无效的窗口"
        case -123: return td_lang.module.msg_83;//"无效的密码"
        
        case -130: return td_lang.module.msg_84;//"身份校验出错"
        case -131: return td_lang.module.msg_85;//"内存无法分配"
        
        case -140: return td_lang.module.msg_86;//"错误的授权"
        case -141: return td_lang.module.msg_87;//"错误的类型"
        case -142: return td_lang.module.msg_88;//"未知错误"
        
        case -200: return td_lang.module.msg_89;//"没有插入智能卡"
        case -201: return td_lang.module.msg_90;//"错误的智能卡登录PIN码"
        case -202: return td_lang.module.msg_91;//"系统未发现有效的私钥"
        case -203: return td_lang.module.msg_92;//"系统未发现有效的证书"
        case -204: return td_lang.module.msg_93;//"本机不存在CSP服务"
        case -205: return td_lang.module.msg_94;//"本机存在多个智能卡"
        case -206: return td_lang.module.msg_95;//"CSP驱动未安装,请确认已经安装了正确的智能卡驱动"
        case -209: return td_lang.module.msg_96;//"操作智能卡过程中出现未知错误"
        
        case -210: return td_lang.module.msg_97;//"身份验证未通过"
        case -211: return td_lang.module.msg_98;//"智能卡中不存在印章"
        
        default : return td_lang.module.msg_88;//"未知错误"
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