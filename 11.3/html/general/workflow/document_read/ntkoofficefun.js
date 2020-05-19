//设置只读
function TANGER_OCX_SetReadOnly(boolvalue)
{
	var i;
	try
	{
		if (boolvalue) TANGER_OCX_OBJ.IsShowToolMenu = false;
		with(TANGER_OCX_OBJ.ActiveDocument)
		{
			if (TANGER_OCX_OBJ.DocType == 1) //word
			{
				if ( (ProtectionType != -1) &&  !boolvalue)
				{
					Unprotect();
				}
				if ( (ProtectionType == -1) &&  boolvalue)
				{
					Protect(2,true,"");
				}
			}
			else if(TANGER_OCX_OBJ.DocType == 2)//excel
			{
				for(i=1;i<=Application.Sheets.Count;i++)
				{
					if(boolvalue)
					{
						Application.Sheets(i).Protect("",true,true,true);
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
		}
	}
	catch(err){
		//alert("错误：" + err.number + ":" + err.description);
	}
	finally{}
}
//保留痕迹
function TANGER_OCX_SetMarkModify(boolvalue)
{
	TANGER_OCX_SetReviewMode(boolvalue);
	TANGER_OCX_EnableReviewBar(!boolvalue);
}

function TANGER_OCX_SetReviewMode(boolvalue)
{
	TANGER_OCX_OBJ.ActiveDocument.TrackRevisions = boolvalue;
}

function TANGER_OCX_EnableReviewBar(boolvalue)
{
	TANGER_OCX_OBJ.ActiveDocument.CommandBars("Reviewing").Enabled = boolvalue;
	TANGER_OCX_OBJ.ActiveDocument.CommandBars("Track Changes").Enabled = boolvalue;
	TANGER_OCX_OBJ.IsShowToolMenu = boolvalue;	//关闭或打开工具菜单
}


//设置用户名
function TANGER_OCX_SetDocUser(cuser)
{
	with(TANGER_OCX_OBJ.ActiveDocument.Application)
	{
		UserName = cuser;
	}	
}
//显示痕迹
function TANGER_OCX_ShowRevisions(boolvalue)
{
	TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = boolvalue;
}

//接受修订（删除修订）
function TANGER_OCX_AcceptAllRevisions()
{
	TANGER_OCX_OBJ.ActiveDocument.AcceptAllRevisions();
}

//用于设置页面布局：
function TANGER_OCX_ChgLayout()
{
 	try
	{
		TANGER_OCX_OBJ.showdialog(5); //设置页面布局
	}
	catch(err){
//		alert("错误：" + err.number + ":" + err.description);
	}
	finally{
	}
}

//打印
function TANGER_OCX_PrintDoc()
{
	var oldOption;	
	try
	{
		var objOptions =  TANGER_OCX_OBJ.ActiveDocument.Application.Options;
		oldOption = objOptions.PrintBackground;
		objOptions.PrintBackground = true;
	}
	catch(err){};
	TANGER_OCX_OBJ.printout(true);
	try
	{
		var objOptions =  TANGER_OCX_OBJ.ActiveDocument.Application.Options;
		objOptions.PrintBackground = oldOption;
	}
	catch(err){};	
}
//选择套红模板
function selectword(FLOW_DOT_TPL)
{
   if(typeof(FLOW_DOT_TPL)== 'undefined' || FLOW_DOT_TPL == ''){
      URL="./word_model/view/index.php"
   }else{
   	  URL="./word_model/view/index.php?FLOW_DOT_TPL="+FLOW_DOT_TPL;
   }
   myleft=(screen.availWidth-650)/2;
   window.open(URL,"formul_edit","height=350,width=400,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top=150,left="+myleft+",resizable=yes");
}
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
		    if(parentUrl.indexOf("workflow/document_list/input_form")>0)
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
            if(bookmark_value == 'undefined') continue;
            TANGER_OCX_OBJ.ActiveDocument.Bookmarks(i).range.text = bookmark_value;
        }
    }
}

//从本地增加印章文档指定位置
function AddSignFromLocal(userName, key)
{
	var TANGER_OCX_user;
	
   if(TANGER_OCX_bDocOpen)
   {
      if(TANGER_OCX_OBJ.IsNTKOSecSignInstalled()){
      	TANGER_OCX_OBJ.AddSecSignFromLocal(TANGER_OCX_user, "", true, 0, 0, 1);
      }
      else{
      	TANGER_OCX_OBJ.AddSignFromLocal(TANGER_OCX_user, "", true, 0, 0, key);
      }
         
   }

}
