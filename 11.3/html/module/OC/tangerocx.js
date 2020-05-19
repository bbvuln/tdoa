var TANGER_OCX_bDocOpen = false;
var TANGER_OCX_strOp;
var TANGER_OCX_filename;
var TANGER_OCX_attachName;
var WPS_OFFICE_UserName;
var TANGER_OCX_attachURL; //for use with OpenFromURL
var TANGER_OCX_actionURL; //For auto generate form fiields
var TANGER_OCX_OBJ; //The Control
var TANGER_OCX_user; //登录用户


//以下为V1.7新增函数示例

//从本地增加图片到文档指定位置
function AddPictureFromLocal()
{
    if(TANGER_OCX_bDocOpen)
    {
        TANGER_OCX_OBJ.AddPicFromLocal(
            "", //路径
            true,//是否提示选择文件
            true,//是否浮动图片
            100,//如果是浮动图片，相对于左边的Left 单位磅
            100); //如果是浮动图片，相对于当前段落Top
    };
}

//从URL增加图片到文档指定位置
function AddPictureFromURL(URL)
{
    if(TANGER_OCX_bDocOpen)
    {
        TANGER_OCX_OBJ.AddPicFromURL(
            URL,//URL 注意；URL必须返回Word支持的图片类型。
            true,//是否浮动图片
            150,//如果是浮动图片，相对于左边的Left 单位磅
            150);//如果是浮动图片，相对于当前段落Top
    };
}

//从本地增加印章文档指定位置
function AddSignFromLocal(key)
{
   if(TANGER_OCX_bDocOpen)
   {
      if(TANGER_OCX_OBJ.IsNTKOSecSignInstalled())
         TANGER_OCX_OBJ.AddSecSignFromLocal(TANGER_OCX_user, "", true, 0, 0, 1);
      else
         TANGER_OCX_OBJ.AddSignFromLocal(TANGER_OCX_user, "", true, 0, 0, key);
   }
}

//从URL增加印章文档指定位置
function AddSignFromURL(key)
{
    if(document.all("ATTACH_DIR").value=="" && document.all("DISK_ID").value=="")
    {
        alert(td_lang.module.msg_11);//"请从文件柜或网络硬盘选择印章!"
        return;
    }
    var URL,ym,attachment_id,attach_dir;
    attach_dir=document.all("ATTACH_DIR").value;
    if(document.all("DISK_ID").value=="")
    {
        ym=attach_dir.substr(0,attach_dir.indexOf("_"));
        attachment_id=attach_dir.substr(attach_dir.indexOf("_")+1);
    }

    if(document.all("DISK_ID").value=="")
        URL = "/inc/attach.php?MODULE=file_folder&YM="+ym+"&ATTACHMENT_ID="+attachment_id+"&ATTACHMENT_NAME="+document.all("ATTACH_NAME").value;
    else
        URL = "/inc/netdisk.php?DISK_ID="+document.all("DISK_ID").value+"&FILE_NAME="+document.all("ATTACH_DIR").value+"/"+document.all("ATTACH_NAME").value;
    if(TANGER_OCX_bDocOpen)
    {
        if(TANGER_OCX_OBJ.IsNTKOSecSignInstalled())
         TANGER_OCX_OBJ.AddSecSignFromURL(TANGER_OCX_user, URL, 50, 50, 1);
         else
        TANGER_OCX_OBJ.AddSignFromURL(TANGER_OCX_user, URL, 50, 50, key);
    }
}
//从ekey加盖电子章
function AddSecSignFromEkey2()
{
   if(OFFICE_SIGN==0)
   {
       alert(td_lang.module.msg_99);
       exit;
   }else
   {
       if(TANGER_OCX_OBJ.IsNTKOSecSignInstalled())
           TANGER_OCX_OBJ.AddSecSignFromEkey2(TANGER_OCX_user, '', 0, 1);
   }
}
//开始手写签名
function DoHandSign(key)
{
    if(TANGER_OCX_bDocOpen)
    {
        if(TANGER_OCX_OBJ.IsNTKOSecSignInstalled() && OFFICE_SIGN==1)
            TANGER_OCX_OBJ.AddSecHandSign(TANGER_OCX_user, 0, 0, 1);
        else
            TANGER_OCX_OBJ.DoHandSign(TANGER_OCX_user, 0, 0x000000ff, 2, 100, 50, null, key);
    }
}

//开始全屏手写签名
function DoHandSign2(key)
{
    if(TANGER_OCX_bDocOpen)
    {
        if(TANGER_OCX_OBJ.IsNTKOSecSignInstalled())
            TANGER_OCX_OBJ.AddSecHandSign(TANGER_OCX_user, 0, 0, 1);
        else
            TANGER_OCX_OBJ.DoHandSign2(TANGER_OCX_user, key, 0, 0, 0, 100);
    }
}

//开始手工绘图，可用于手工批示
function DoHandDraw()
{
    if(TANGER_OCX_bDocOpen)
    {
        TANGER_OCX_OBJ.DoHandDraw(
            0,//笔型0－实线 0－4 //可选参数
            0x00ff0000,//颜色 0x00RRGGBB//可选参数
            3,//笔宽//可选参数
            200,//left//可选参数
            50//top//可选参数
        );
    }
}

//开始全屏手工绘图，可用于手工批示
function DoHandDraw2()
{
    if(TANGER_OCX_bDocOpen)
    {
        TANGER_OCX_OBJ.DoHandDraw2();
    }
}

//检查签名结果
function DoCheckSign(key)
{
    if(TANGER_OCX_bDocOpen)
    {
        var ret = TANGER_OCX_OBJ.DoCheckSign(false,key);

        //可选参数 IsSilent 缺省为FAlSE，表示弹出验证对话框,否则，只是返回验证结果到返回值
    }
}
//以下为以前版本的函数和实用函数
//此函数用来加入一个自定义的文件头部
function TANGER_OCX_AddDocHeader(DOC_ID,DOC_TYPE)
{
    try{
        //选择对象当前文档的所有内容
        var curSel = TANGER_OCX_OBJ.ActiveDocument.Application.Selection;
        TANGER_OCX_SetMarkModify(false);
        curSel.WholeStory();
        curSel.Cut();
        //TANGER_OCX_bDocOpen = false;
        //插入模板
        URL="/module/word_model/view/get.php?DOC_ID="+DOC_ID;
        if(DOC_TYPE == 2){
            TANGER_OCX_OBJ.BeginOpenFromURL(URL,true,false);
        }else{
            TANGER_OCX_OBJ.AddTemplateFromURL(URL);
        }
        //TANGER_OCX_SetReadOnly(false);
        TANGER_OCX_AddDocHeaderExec();
    }
    catch(err)
    {
        alert(td_lang.global.error + err.number + ":" + err.description);
    }
}

function TANGER_OCX_AddDocHeaderExec()
{
    try{
        if(!TANGER_OCX_bDocOpen)
        {
            window.setTimeout(TANGER_OCX_AddDocHeaderExec,200);
            return;
        }

        var BookMarkName = "zhengwen";
        if(!TANGER_OCX_OBJ.ActiveDocument.BookMarks.Exists(BookMarkName))
        {
            var msg1 = sprintf(td_lang.inc.msg_119,BookMarkName);
            alert(msg1+"\n"+td_lang.module.msg_12);
            return;
        }
        var bkmkObj = TANGER_OCX_OBJ.ActiveDocument.BookMarks(BookMarkName);
        var saverange = bkmkObj.Range
        saverange.Paste();
        TANGER_OCX_OBJ.ActiveDocument.Bookmarks.Add(BookMarkName,saverange);
        //工作流套用表单数据
        if(window.opener)
        {
            var parentUrl = window.opener.location.toString();
            if(parentUrl.indexOf("workflow/list/input_form") >0 || parentUrl.indexOf("approve_center/list/input_form") > 0 || parentUrl.indexOf("workflow/query/list/input_form") > 0 || parentUrl.indexOf("approve_center/query/list/input_form") > 0)
            {
                addFlowData();
            }
        }

        TANGER_OCX_SetMarkModify(true);
    }
    catch(err)
    {
        alert( td_lang.global.error+ err.number + ":" + err.description);
    }
}

function addFlowData()
{
    var bookmarks = TANGER_OCX_OBJ.ActiveDocument.Bookmarks;
    for(var i=1;i<=bookmarks.Count;i++)
    {
        var bookmark_name = bookmarks(i).Name;
        if(bookmark_name != "zhengwen")
        {
            var bookmark_value = window.opener.getElementValueByTitle(bookmark_name);
            var is_list = window.opener.CheckDoomIsList(bookmark_name);
            if(typeof bookmark_value == 'undefined' && !is_list) continue;
			if(is_list)
			{
				var listData = window.opener.TaoHongListData(bookmark_name);
				var row = listData['row_max'] || '';
				var col = listData['col_max'] || '';
				var data = listData['data'];
				AddTable(bookmark_name,data,row,col);
			}else
			{
				var textareaEditor = window.opener.CheckDoomIsEditor(bookmark_name);//多行富文本
				if(textareaEditor)
				{
					var RichVal = window.opener.getRichTextareaVal(bookmark_name);
					TANGER_OCX_OBJ.ActiveDocument.Bookmarks(i).range.text = RichVal;
				}else
				{
					TANGER_OCX_OBJ.ActiveDocument.Bookmarks(i).range.text = bookmark_value;
				}
			}
        }
    }
}
//将查询数据库的2维数组插入到word的表格中，如果插入的数据和上面的数据相等
function AddTable(bookmark_name,data_arr,row,col)
{
	var mydoc=TANGER_OCX_OBJ.ActiveDocument;
	var app=mydoc.activewindow;
	var sel=app.selection;
	sel.GoTo(-1,0,0,bookmark_name);//控制光标位置到书签
	var table = mydoc.Tables.Add(sel.Range,row,col,1,0);
	var countrow=table.Rows.count;
	var countcol=table.Columns.count;
	for(var i=0;i<countrow;i++)
	{
		for(var j=0;j<countcol;j++)
		{
			table.cell(1+i,j+1).range.text=data_arr[i][j];
		}
	}
}
//如果原先的表单定义了OnSubmit事件，保存文档时首先会调用原先的事件。
function TANGER_OCX_doFormOnSubmit()
{
    var form = document.forms[0];
    if (form.onsubmit)
    {
        var retVal = form.onsubmit();
        if (typeof retVal == "boolean" && retVal == false)
            return false;
    }
    return true;
}

/*此函数在较低版本的IE浏览器中，用来代替
 //Javascript的escape函数。
 function TANGER_OCX_encodeObjValue(value)
 {
 var t;
 t = value.replace(/%/g,"%25");
 return(t.replace(/&/g,"%26"));
 }
 */
//此函数用来产生自动将表单数据创建成为
//控件的SaveToURL函数所需要的参数。返回
//一个paraObj对象。paraObj.FFN包含表单的
//最后一个<input type=file name=XXX>的name
//paraObj.PARA包含了表单的其它数据，比如：
//f1=v1&f2=v2&f3=v3.其中,v1.v2.v3是经过
//Javascript的escape函数编码的数据。如果IE
//的版本较低，可以使用上面注释掉的TANGER_OCX_encodeObjValue
//函数代替下面的escape函数。
function TANGER_OCX_genDominoPara(paraObj)
{
    var fmElements = document.forms[0].elements;
    var i,j,elObj,optionItem;
    for (i=0;i< fmElements.length;i++ )
    {
        elObj = fmElements[i];
        switch(elObj.type)
        {
            case "file":
                paraObj.FFN = elObj.name;
                break;
            case "reset":
                break;
            case "radio":
            case "checkbox":
                if (elObj.checked)
                {
                    paraObj.PARA += ( elObj.name+"="+escape(elObj.value)+"&");
                }
                break;
            case "select-multiple":
                for(j=0;j<elObj.options.length;j++)
                {
                    optionItem = elObj.options[j];
                    if (optionItem.selected)
                    {
                        paraObj.PARA += ( elObj.name+"="+escape(optionItem.value)+"&");
                    }
                }
                break;
            default: // text,Areatext,selecte-one,password,submit,etc.
                if(elObj.name)
                {
                    paraObj.PARA += ( elObj.name+"="+escape(elObj.value)+"&");
                }
                break;
        }
    }
}

//设置文档为只读
function TANGER_OCX_SetReadOnly(boolvalue)
{
    var appName,i;
    try
    {
        if (boolvalue) TANGER_OCX_OBJ.IsShowToolMenu = false;

        if(!TANGER_OCX_bDocOpen)
            return;

        with(TANGER_OCX_OBJ.ActiveDocument)
        {
            appName = new String(Application.Name);
            if( (appName.toUpperCase()).indexOf("WORD") > -1 ) //Word
            {
                if (ProtectionType != -1 &&  !boolvalue)
                {
                    Unprotect();
                }
                if (ProtectionType == -1 &&  boolvalue)
                {
                    Protect(3,true,"");
                }
            }
            else if ( (appName.toUpperCase()).indexOf("EXCEL") > -1 ) //EXCEL
            {
                for(i=1;i<=Application.Sheets.Count;i++)
                {
                    if(boolvalue)
                    {
                        //Application.Sheets(i).Protect("",true,true,true);
                    }
                    else
                    {
                        Application.Sheets(i).Unprotect("");
                    }
                }
                if(boolvalue)
                {
                    Application.ActiveWorkbook.Protect("",true);
                }
                else
                {
                    Application.ActiveWorkbook.Unprotect("");
                }
            }
            else
            {
            }
        }
    }
    catch(err){
        //alert("错误：" + err.number + ":" + err.description);
    }
    finally{
    }
}

//允许或禁止用户从控件拷贝数据
function TANGER_OCX_SetNoCopy(boolvalue)
{
    TANGER_OCX_OBJ.IsNoCopy = boolvalue;
}

//允许或禁止文件－>新建菜单
function TANGER_OCX_EnableFileNewMenu(boolvalue)
{
    TANGER_OCX_OBJ.EnableFileCommand(0) = boolvalue;
}
//允许或禁止文件－>打开菜单
function TANGER_OCX_EnableFileOpenMenu(boolvalue)
{
    TANGER_OCX_OBJ.EnableFileCommand(1) = boolvalue;
}
//允许或禁止文件－>保存菜单
function TANGER_OCX_EnableFileSaveMenu(boolvalue)
{
    TANGER_OCX_OBJ.EnableFileCommand(3) = boolvalue;
}
//允许或禁止文件－>另存为菜单
function TANGER_OCX_EnableFileSaveAsMenu(boolvalue)
{
    TANGER_OCX_OBJ.EnableFileCommand(4) = boolvalue;
}
//允许或禁止文件－>打印菜单
function TANGER_OCX_EnableFilePrintMenu(boolvalue)
{
    TANGER_OCX_OBJ.EnableFileCommand(5) = boolvalue;
}
//允许或禁止文件－>打印预览菜单
function TANGER_OCX_EnableFilePrintPreviewMenu(boolvalue)
{
    TANGER_OCX_OBJ.EnableFileCommand(6) = boolvalue;
}
//允许或禁止工具栏－>打印
function TANGER_OCX_EnableFilePrintToolbar(boolvalue)
{
    try{
        TANGER_OCX_OBJ.ActiveDocument.CommandBars("Standard").Controls(td_lang.global.print+"(&P)").Enabled = boolvalue;//打印
        TANGER_OCX_OBJ.ActiveDocument.CommandBars("Standard").Controls(td_lang.global.print_preview+"(&V)").Enabled = boolvalue;//打印预览
        TANGER_OCX_OBJ.FilePrint = boolvalue;
        TANGER_OCX_OBJ.FilePrintPreview = boolvalue;
    }
    catch(ex)
    {}
}
//允许或禁止工具栏－>打印预览
function TANGER_OCX_EnableFilePrintPreviewToolbar(boolvalue)
{
}

//允许或禁止显示修订工具栏和工具菜单（保护修订）
function TANGER_OCX_EnableReviewBar(boolvalue)
{

    if(!TANGER_OCX_bDocOpen)
        return;
    TANGER_OCX_OBJ.ActiveDocument.CommandBars("Reviewing").Enabled = boolvalue;
    TANGER_OCX_OBJ.ActiveDocument.CommandBars("Track Changes").Enabled = boolvalue;
    TANGER_OCX_OBJ.IsShowToolMenu = boolvalue;	//关闭或打开工具菜单
}

//打开或者关闭修订模式
function TANGER_OCX_SetReviewMode(boolvalue)
{
    if(!TANGER_OCX_bDocOpen)
        return;
    try{
        TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = boolvalue;
    }
    catch(ex)
    {}
}

//进入或退出痕迹保留状态，调用上面的两个函数
function TANGER_OCX_SetMarkModify(boolvalue)
{
    TANGER_OCX_SetReviewMode(boolvalue);
}

//显示/不显示修订文字
function TANGER_OCX_ShowRevisions(boolvalue)
{
    if(!TANGER_OCX_bDocOpen)
        return;
    try{
        TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = boolvalue;
    }
    catch(ex)
    {}
}

//打印/不打印修订文字
function TANGER_OCX_PrintRevisions(boolvalue)
{
    if(!TANGER_OCX_bDocOpen)
        return;
    TANGER_OCX_OBJ.ActiveDocument.PrintRevisions = boolvalue;
}

//设置用户名
function TANGER_OCX_SetDocUser(cuser)
{
    if(!TANGER_OCX_bDocOpen)
        return;
    with(TANGER_OCX_OBJ.ActiveDocument.Application)
    {
        UserName = cuser;
    }
}

//设置页面布局
function TANGER_OCX_ChgLayout()
{
    ShowDoc();
    try
    {
        if (TANGER_OCX_OBJ.ActiveDocument != null)
            TANGER_OCX_OBJ.ShowDialog(5); //设置页面布局
    }
    catch(err){
        if(err.number!=-2147467260)
            alert(td_lang.global.error + err.number + ":" + err.description);
    }
    finally{
    }
}

//打印文档
function TANGER_OCX_PrintDoc()
{
    ShowDoc();
    try
    {
        if (TANGER_OCX_OBJ.ActiveDocument != null)
            TANGER_OCX_OBJ.printout(true);
    }
    catch(err){
        if(err.number!=-2147467260)
            alert(td_lang.global.error + err.number + ":" + err.description);
    }
    finally{
    }
}
//此函数在网页装载时被调用。用来获取控件对象并保存到TANGER_OCX_OBJ
//同时，可以设置初始的菜单状况，打开初始文档等等。
function TANGER_OCX_SetInfo()
{
    var info;
    TANGER_OCX_OBJ = document.getElementById("TANGER_OCX");
    var useUTF8 = (document.charset == "utf-8");
    TANGER_OCX_OBJ.IsUseUTF8Data = useUTF8;
    TANGER_OCX_OBJ.FileNew = false;
    TANGER_OCX_OBJ.FileClose = false;
    TANGER_OCX_EnableFileNewMenu(false);
    TANGER_OCX_EnableFileOpenMenu(false);
    TANGER_OCX_EnableFileSaveMenu(false);
    //TANGER_OCX_EnableFileSaveAsMenu(false);
    try
    {
        TANGER_OCX_actionURL = document.forms[0].action;
        TANGER_OCX_strOp = document.getElementById("TANGER_OCX_op").innerHTML;
        TANGER_OCX_filename = document.getElementById("TANGER_OCX_filename").innerHTML;
        TANGER_OCX_attachName = document.getElementById("TANGER_OCX_attachName").innerHTML;
        TANGER_OCX_attachURL = document.getElementById("TANGER_OCX_attachURL").innerHTML;
        TANGER_OCX_user = document.getElementById("TANGER_OCX_user").innerHTML;

        var fileExtName = TANGER_OCX_filename.substr(TANGER_OCX_filename.lastIndexOf(".")).toLowerCase();
        if(fileExtName == ".pdf" || fileExtName == ".tif" || fileExtName == ".tiff")
        {
            if(browser=="IE" && window.navigator.platform=="Win64")
            {
                TANGER_OCX_OBJ.AddDocTypePlugin(".pdf","PDF.NtkoDocument","4.0.1.0","./ntkooledocallx64.cab",51,true);
                TANGER_OCX_OBJ.AddDocTypePlugin(".tif","TIF.NtkoDocument","4.0.0.9","./ntkooledocallx64.cab",52);
                TANGER_OCX_OBJ.AddDocTypePlugin(".tiff","TIF.NtkoDocument","4.0.0.9","/ntkooledocallx64.cab",52);
            }
            else
            {
                TANGER_OCX_OBJ.AddDocTypePlugin(".pdf","PDF.NtkoDocument","4.0.1.0","./ntkooledocall.cab",51,true);
                TANGER_OCX_OBJ.AddDocTypePlugin(".tif","TIF.NtkoDocument","4.0.0.9","./ntkooledocall.cab",52);
                TANGER_OCX_OBJ.AddDocTypePlugin(".tiff","TIF.NtkoDocument","4.0.0.9","/ntkooledocall.cab",52);
            }
        }


        re=/&amp;/g;
        TANGER_OCX_attachURL=TANGER_OCX_attachURL.replace(re,"&");

        if (TANGER_OCX_OBJ.IsHiddenOpenURL)
        {
            TANGER_OCX_attachURL = TANGER_OCX_HiddenURL(TANGER_OCX_attachURL);
        }

        switch(TANGER_OCX_strOp)
        {
            case "1":
                info = td_lang.module.msg_13;//"新Word文档"
                TANGER_OCX_OBJ.CreateNew("Word.Document");
                break;
            case "2":
                info = td_lang.module.msg_14;//"新Excel工作表"
                TANGER_OCX_OBJ.CreateNew("Excel.Sheet");
                break;
            case "3":
                info = td_lang.module.msg_15;//"新PowserPoint幻灯片"
                TANGER_OCX_OBJ.CreateNew("PowerPoint.Show");
                break;
            case "4":
                info = td_lang.module.msg_16;//"编辑文档"
                if(TANGER_OCX_attachURL)
                {
                    TANGER_OCX_OBJ.BeginOpenFromURL(TANGER_OCX_attachURL,true,false);
                }
                else
                {
                    TANGER_OCX_OBJ.CreateNew("Word.Document");
                }
                if(TANGER_OCX_OBJ.IsNTKOSecSignInstalled() && document.getElementById("tr_ekey"))
                {
                    document.getElementById("tr_ekey").style.display="";
                }

                break;
            case "5":
            case "6":
            case "7":
                info = td_lang.module.msg_17;//"阅读文档"
                if(TANGER_OCX_attachURL)
                {
                    TANGER_OCX_OBJ.BeginOpenFromURL(TANGER_OCX_attachURL,true,false);
                }
                break;
            default:
                info = td_lang.module.msg_18;//"未知操作"
        }

    }
    catch(err){
        //alert("错误：" + err.number + ":" + err.description);
        msg=td_lang.module.msg_19+'\n\n'+td_lang.module.msg_20;//'不能使用微软Office软件打开文档！\n\n是否尝试使用金山WPS文字处理软件打开文档？'
        if(window.confirm(msg))
        {
            if(TANGER_OCX_strOp==4)
                TANGER_OCX_OBJ.BeginOpenFromURL(TANGER_OCX_attachURL,true,false,"WPS.Document");
            else
                TANGER_OCX_OBJ.BeginOpenFromURL(TANGER_OCX_attachURL,true,true,"WPS.Document");
        }
    }
    finally{
    }
}
//此函数在文档关闭时被调用。
function TANGER_OCX_OnDocumentClosed()
{
    TANGER_OCX_bDocOpen = false;
}
//此函数用来保存当前文档。主要使用了控件的SaveToURL函数。
//有关此函数的详细用法，请参阅编程手册。
function TANGER_OCX_SaveDoc(op_flag)
{
    if(TANGER_OCX_OBJ.ActiveDocument.Saved)
    {
        return;
    }
    var retStr=new String;
    var newwin,newdoc;
    var paraObj = new Object();
    paraObj.PARA="";
    paraObj.FFN ="";
    try
    {
        if(!TANGER_OCX_doFormOnSubmit())return;
        document.forms[0].DOC_SIZE.value = TANGER_OCX_OBJ.DocSize;
        TANGER_OCX_genDominoPara(paraObj);

        if(!paraObj.FFN)
        {
            alert(td_lang.module.msg_21);//"参数错误：控件的第二个参数没有指定。"
            return;
        }
        if(!TANGER_OCX_bDocOpen)
        {
            alert(td_lang.module.msg_22);//"没有打开的文档。"
            return;
        }
        switch(TANGER_OCX_strOp)
        {
            case "1":
                retStr = TANGER_OCX_OBJ.SaveToURL(TANGER_OCX_actionURL,paraObj.FFN,"",TANGER_OCX_filename,0);
                document.all("ATTACHMENT_ID").value=retStr;
                if(op_flag==1)
                {
                    TANGER_OCX_bDocOpen = false;
                    window.close();
                }
                break;
            case "2":
                retStr = TANGER_OCX_OBJ.SaveToURL(TANGER_OCX_actionURL,paraObj.FFN,"",TANGER_OCX_filename,0);
                document.all("ATTACHMENT_ID").value=retStr;
                if(op_flag==1)
                {
                    TANGER_OCX_bDocOpen = false;
                    window.close();
                }
                break;
            case "3":
                retStr = TANGER_OCX_OBJ.SaveToURL(TANGER_OCX_actionURL,paraObj.FFN,"",TANGER_OCX_filename,0);
                document.all("ATTACHMENT_ID").value=retStr;
                if(op_flag==1)
                {
                    TANGER_OCX_bDocOpen = false;
                    window.close();
                }
                break;
            case "4":
                lock_ref();
                //解决单元格出于激活状态时保存不了数据的问题 modified by lx 20100914
                var appName = new String(TANGER_OCX_OBJ.ActiveDocument.Application.Name);
                if ( (appName.toUpperCase()).indexOf("EXCEL") > -1 || appName.indexOf(td_lang.module.msg_23) > -1) //EXCEL
                {
                    TANGER_OCX_OBJ.Activedocument.ActiveSheet.select();
                }
                retStr = TANGER_OCX_OBJ.SaveToURL(TANGER_OCX_actionURL,paraObj.FFN,"",TANGER_OCX_filename,0);
                if(op_flag != 5){//保存不提示成功
                    window.alert(retStr);
                }
                if(op_flag == 1)
                {
                    TANGER_OCX_bDocOpen = false;
                    window.close();
                }
                break;
            case "5":
            case "6":
            case "7":
                if(OFFICE_PDF)
                {
                    retStr = TANGER_OCX_OBJ.SaveToURL(TANGER_OCX_actionURL,paraObj.FFN,"",TANGER_OCX_filename,0);
                    window.alert(retStr);
                }
                else
                {
                    alert(td_lang.module.msg_24);//"文档处于阅读状态，您不能保存到服务器。"
                }
                break;
            default:
                break;
        }
    }
    catch(err){
        alert( td_lang.module.msg_25 + err.number + ":" + err.description);//"不能保存到URL："
    }
    finally{
    }
    TANGER_OCX_OBJ.ActiveDocument.Saved = true;
}

//此函数在文档打开时被调用。
function TANGER_OCX_OnDocumentOpened(str, obj)
{
    try
    {
        WPS_OFFICE_UserName=TANGER_OCX_OBJ.ActiveDocument.Application.UserName;
    }
    catch(ex)
    {
    }

    var s, s2;
    try
    {
        TANGER_OCX_bDocOpen = true;
        if( 0==str.length)
        {
            str = TANGER_OCX_filename;
        }
        TANGER_OCX_OBJ.Caption = TANGER_OCX_filename;
        //TANGER_OCX_OBJ.IsResetToolbarsOnOpen = true; //重置工具栏为默认项

        if(TANGER_OCX_filename.indexOf(".ppt")<0 && TANGER_OCX_filename.indexOf(".PPT")<0 )
            TANGER_OCX_SetDocUser(TANGER_OCX_user);
        s = td_lang.module.msg_26;//"未知应用程序"
        if(obj)
        {
            if(typeof(ShowRevisions) == "boolean")
                TANGER_OCX_ShowRevisions(ShowRevisions);
            switch(TANGER_OCX_strOp)
            {
                case "1":
                case "2":
                case "3":
                case "4":
                    TANGER_OCX_SetReadOnly(false);
                    break;
                case "5":
                case "6":
                case "7":
                    //TANGER_OCX_OBJ.IsStrictNoCopy=-1;
                    //TANGER_OCX_OBJ.ActiveDocument.Protect(1,true,"");
                    TANGER_OCX_SetReadOnly(TANGER_OCX_strOp=="7"?false:true);//TANGER_OCX_strOp=="6"?false:true

                    //针对WPS，禁止工具栏的输出为PDF格式和发送邮件
                    if(TANGER_OCX_strOp!="7")
                    {
                        var cmdbar = TANGER_OCX_OBJ.ActiveDocument.Application.CommandBars("Standard");
                        try
                        {
                            if(cmdbar.Controls(td_lang.module.msg_27+"(&F)..."))//输出为PDF格式
                                cmdbar.Controls(td_lang.module.msg_27+"(&F)...").Enabled = false;
                            if(cmdbar.Controls(td_lang.module.msg_33+"(&F)..."))//输出为 PDF 格式
                                cmdbar.Controls(td_lang.module.msg_33+"(&F)...").Enabled = false;
                            if(cmdbar.Controls(td_lang.module.msg_28+"(&D)..."))//发送邮件
                                cmdbar.Controls(td_lang.module.msg_28+"(&D)...").Enabled = false;
                        }
                        catch(err){}
                    }

                    if(TANGER_OCX_filename.toLowerCase().indexOf(".xls")>0)
                    {
                        var sheets = TANGER_OCX_OBJ.ActiveDocument.Sheets;
                        var sc = sheets.Count;
                        for(var i=1;i<=sc;i++)
                        {
                            sheets(i).EnableSelection = 1;
                        }
                    }

                    break;
                default:
                    break;
            }
            s = obj.Application.Name;
        }
    }
    catch(err){
        window.status = td_lang.module.msg_29 + err.number + ":" + err.description;//"OnDocumentOpened事件的Script产生错误。"
    }
    finally{
    }
}

function TANGER_OCX_OnSignSelect(issign,signinfo)
{
    if(!issign)
        return;

    if(signinfo.indexOf(td_lang.module.msg_30+TANGER_OCX_user) == -1)//"用户:"
    {
        TANGER_OCX_SetReadOnly(true);
        TANGER_OCX_SetReadOnly(false);
    }
}

//保存文档为PDF到本地
function SaveAsPDFFile(IsPermitPrint, IsPermitCopy)
{
    try{
        TANGER_OCX_OBJ.SaveAsPDFFile(
            '',
            true,
            '',
            true,
            false,
            '',
            IsPermitPrint,
            IsPermitCopy
        );
    }
    catch(err){
        if(err.number == -2147467259)
            alert(td_lang.module.msg_31+"\n"+td_lang.module.msg_32)+"http://www.go2oa.com/oa/PDFCreator-0_9_5_setup.exe";//"该功能需要软件PDFCreator支持\n请下载安装 http://www.go2oa.com/oa/PDFCreator-0_9_5_setup.exe"
    }
}

//保存文档为PDF文件
function TANGER_OCX_SavePDFToServer()
{
    if(!TANGER_OCX_bDocOpen)
    {
        alert(td_lang.module.msg_22);//"没有打开的文档。"
        return;
    }
    try
    {
        TANGER_OCX_OBJ.PublishAsPDFToURL(
            "uploadpdf.php",
            TANGER_OCX_filename.substr(0,TANGER_OCX_filename.lastIndexOf("."))+".pdf",
            "form1",
            null, //sheetname,保存excel的哪个表格
            false, //IsShowUI,是否显示保存界面
            false, // IsShowMsg,是否显示保存成功信息
            false, // IsUseSecurity,是否使用安全特性
            null, // OwnerPass,安全密码.可直接传值
            false,//IsPermitPrint,是否允许打印
            true //IsPermitCopy,是否允许拷贝
        );
    }
    catch(err){
        alert( td_lang.module.msg_34+ err.number + ":" + err.description);//"不能保存PDF到URL："
    }
    finally{
    }
}

function ShowOperationBar()
{
    if(!$('td_menu') || !$('td_control')) return;
    if($('td_menu').style.display == "none")
    {
        $('td_menu').style.display = "";
        $('td_control').style.display = "none";
    }
    else
    {
        $('td_menu').style.display = "none";
        $('td_control').style.display = "";
    }
}

function MY_SetMarkModify(flag)
{
    if(flag)
    {
        mflag1.className="TableControl";
        mflag2.className="TableData";
    }
    else
    {
        mflag1.className="TableData";
        mflag2.className="TableControl";
    }
    TANGER_OCX_SetMarkModify(flag);
}

function MY_ShowRevisions(flag)
{
    if(flag)
    {
        sflag1.className="TableControl";
        sflag2.className="TableData";
    }
    else
    {
        sflag1.className="TableData";
        sflag2.className="TableControl";
    }
    TANGER_OCX_ShowRevisions(flag);
}

function SelSign()
{
    var SelSign=document.getElementById("SelSign");
    if(SelSign.style.display=="")
        SelSign.style.display="none";
    else
        SelSign.style.display="";
}

function selectword(SEC_OC_MARK,DOT_TPL_STR)
{
    if(typeof(DOT_TPL_STR)== 'undefined' || DOT_TPL_STR == ''){
        URL="../word_model/view/index.php?SEC_OC_MARK="+SEC_OC_MARK;
    }else{
        URL="../word_model/view/index.php?SEC_OC_MARK="+SEC_OC_MARK+"&DOT_TPL_STR="+DOT_TPL_STR;
    }
    myleft=(screen.availWidth-650)/2;
    window.open(URL,"formul_edit","height=350,width=400,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top=150,left="+myleft+",resizable=yes");
}

function SelSignFromURL(attchment_id,div_id,dir_field,name_field,disk_id)
{
    URL="/module/sel_file/?EXT_FILTER=esp&DIV_ID=" + div_id + "&DIR_FIELD=" + dir_field + "&NAME_FIELD=" + name_field + "&TYPE_FIELD=" + disk_id + "&DIR_ID=DIR_ID";
    loc_x=event.clientX+100;
    loc_y=event.clientY-100;
    window.open(URL,attchment_id,"height=300,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top="+loc_y+",left="+loc_x+",resizable=yes");
}

function ShowDoc()
{
    $('OC_LOG').style.display = "none";
    $('TANGER_OCX').style.display = "block";
    $('OC_HISTORY').style.display = "none";
}
function ShowLog()
{
    if($('OC_LOG').style.display == "none")
    {
        $('OC_LOG').style.display = "block";
        $('TANGER_OCX').style.display = "none";
        $('OC_HISTORY').style.display = "none";
        if($('OC_LOG').innerText == "")
            GetLog();
    }
    else
    {
        $('OC_LOG').style.display = "none";
        $('TANGER_OCX').style.display = "block";
        $('OC_HISTORY').style.display = "none";
    }
}

function ShowHistory()
{
    if($('OC_HISTORY').style.display == "none")
    {
        $('OC_LOG').style.display = "none";
        $('TANGER_OCX').style.display = "none";
        $('OC_HISTORY').style.display = "block";
        if($('OC_HISTORY').innerText == "")
            GetHistory();
    }
    else
    {
        $('OC_LOG').style.display = "none";
        $('OC_HISTORY').style.display = "none";
        $('TANGER_OCX').style.display = "block";
    }
}
