//����ֻ��
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
		//alert("����" + err.number + ":" + err.description);
	}
	finally{}
}
//�����ۼ�
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
	TANGER_OCX_OBJ.IsShowToolMenu = boolvalue;	//�رջ�򿪹��߲˵�
}


//�����û���
function TANGER_OCX_SetDocUser(cuser)
{
	with(TANGER_OCX_OBJ.ActiveDocument.Application)
	{
		UserName = cuser;
	}	
}
//��ʾ�ۼ�
function TANGER_OCX_ShowRevisions(boolvalue)
{
	TANGER_OCX_OBJ.ActiveDocument.ShowRevisions = boolvalue;
}

//�����޶���ɾ���޶���
function TANGER_OCX_AcceptAllRevisions()
{
	TANGER_OCX_OBJ.ActiveDocument.AcceptAllRevisions();
}

//��������ҳ�沼�֣�
function TANGER_OCX_ChgLayout()
{
 	try
	{
		TANGER_OCX_OBJ.showdialog(5); //����ҳ�沼��
	}
	catch(err){
//		alert("����" + err.number + ":" + err.description);
	}
	finally{
	}
}

//��ӡ
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
//ѡ���׺�ģ��
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
//�˺�����������һ���Զ�����ļ�ͷ��
function TANGER_OCX_AddDocHeader(DOC_ID,DOC_TYPE)
{
	try{
		//ѡ�����ǰ�ĵ�����������
		var curSel = TANGER_OCX_OBJ.ActiveDocument.Application.Selection;
		TANGER_OCX_SetMarkModify(false);
		curSel.WholeStory();
		curSel.Cut();
		//TANGER_OCX_bDocOpen = false;
		//����ģ��
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
		
		//���������ñ�����
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

//�ӱ�������ӡ���ĵ�ָ��λ��
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
