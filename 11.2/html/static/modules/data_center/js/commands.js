var g_WinDoc            =   window.document;
var g_WinDocAll         =   g_WinDoc.all;

function f_onCbMouseOut()
{
	event.cancelBubble=true;
	if( null != this.sticky )		// If it is sticky
	{
		if( true == this.buttondown )
		{
			return;
		};
	}
	this.className= (true == this.raised) ? "tbButtonRaise" : "tbButton";
	this.onmouseout=null;
}
function f_onCbMouseUp(obj)
{
	event.cancelBubble=true;
	if( null != this.sticky )
	{
		if( true == this.buttondown )
		{
			return;
		};
	}
	this.className= (true == this.raised) ? "tbButtonRaise" : "tbButton";
	this.onmouseup=null;
}
function onCbMouseDown(obj)
{
	obj.className="tbButtonDown";
	obj.onmouseout = f_onCbMouseOut;
	obj.onmouseup = f_onCbMouseUp;
}

function onCbClickEvent(obj, fNoEvent)
{
	if( null != event )
	{
		event.cancelBubble=true;
	}
	// Regular push button
	onCbClick(obj.id, true);
	return(false);
}

function onCbClick(szCommand, fState)
{
	switch(szCommand.toUpperCase())
	{
		case "CMDCRSPRINTSETUP":
			CellWeb1.PageSetup();
			break;
		case "CMDCRSPRINTPREVIEW":
			CellWeb1.PrintPreview();
			break;
		case "CMDCRSPRINT":
			CellWeb1.Print();
			break;
		case "CMDCRSNEW":
			opener.WriteReport();
			break;
		case "CMDCRSEDIT":
    	var href = location.href.replace("openmode=read", "openmode=edit");
    	location.href = href;
			break;
		case "CMDCRSVIEW":
			var r = CellWeb1.DoGetCurrentRow();
			if(organ_user_time_arr && r > 0 && r <= (organ_user_time_arr.length / 3))
			{
				var o = organ_user_time_arr[(r - 1) * 3];
				var u = organ_user_time_arr[(r - 1) * 3 + 1];
				var t = organ_user_time_arr[(r - 1) * 3 + 2];
				window.parent.parent.dept_main.OpenReport(repid, "read", -1, o, u, t);
			}
			break;
		case "CMDCRSEDIT":
			var r = CellWeb1.DoGetCurrentRow();
			if(organ_user_time_arr && r > 0 && r <= (organ_user_time_arr.length / 3))
			{
				var o = organ_user_time_arr[(r - 1) * 3];
				var u = organ_user_time_arr[(r - 1) * 3 + 1];
				var t = organ_user_time_arr[(r - 1) * 3 + 2];
				window.parent.parent.dept_main.OpenReport(repid, "edit", -1, o, u, t);
			}
			break;
		case "CMDCRSDELETE":
			if(window.confirm("要删除指定记录么?"))
			{
				var max_col = CellWeb1.GetContentColCount();
				var cur_row = CellWeb1.DoGetCurrentRow();
				var organid = CellWeb1.GetHiddenText(0, max_col - 4, cur_row);
				var userid = CellWeb1.GetHiddenText(0, max_col - 3, cur_row);
				var wt = CellWeb1.GetHiddenText(0, max_col - 2, cur_row);
				window.thisForm.aorganid.value = organid;
				window.thisForm.auserid.value = userid;
				window.thisForm.awritetime.value = wt;
				window.thisForm.action.value = "delete";
				window.thisForm.submit();
			}
			break;
		case "CMDCRSAUTOFILTER":
		  if(openmode == "viewtable"){
				CellWeb1.AutoFilter(0, 0, 1, CellWeb1.GetContentColCount() - 2, 
					CellWeb1.GetContentRowCount() - 2, '按行向下', 
					document.getElementById("other_para").value);
			}else{
				CellWeb1.AutoFilter(-1, -1, -1, -1, -1, '', '');
			}
			break;
		case "CMDCRSFILTER":
  		style="dialogWidth:36;dialogHeight:30;status:no;help:no";
  		//------------------------------------------------------------------------
  		//------------------------------------------------------------------------
  		//-------------------这儿没改呢-----------------------------------------------
  		//------------------------------------------------------------------------
  		//------------------------------------------------------------------------
  		//------------------------------------------------------------------------
  		res = window.showModalDialog('../workshop/report/search_index.php?repid=' + repid + '&cur_table='
  			+ cur_table, null, style);
  		if(res && res != "")
  		{
  			window.thisForm.filter_expr.value = res;
  			window.thisForm.submit();
  		}
			break;
		case "CMDCRSMERGE":
			if(window.thisForm.do_merge.value == "true")
				window.thisForm.do_merge.value = "false";
			else
				window.thisForm.do_merge.value = "true";
			window.thisForm.submit();
			break;
		case "CMDCRSPROPERTY"://属性
			CellWeb1.CreateReportProperty();
			break;
		case "CMDCRSSINGLEITEM"://单记录数据项
			CellWeb1.CreateDataSchema(true, false);
			break;
		case "CMDCRSMULTIPLEITEM"://多记录数据项
			CellWeb1.CreateDataSchema(false, false);;
			break;
		case "CMDCRSMANAGEITEM":
			//In php, to refer a function without parameters, the parentheses can't be omit.
			CellWeb1.FormatTablesList();
			break;
		case "CMDCRSFORMULAS":
			CellWeb1.FormatFormulasForm();
			break;
		case "CMDCRSFORMATLOGICCHECK":
			CellWeb1.FormatLogicCheck();
			break;
		case "CMDCRSSAVE":
			if(CellWeb1.SaveReport())
			{
				if(!dosave)
					dosave = true;
//				if(openmode == "write" && window.confirm("填写下一张吗?"))
//				{
//					//dosave = false;
//					//writetime = '';//GetCurCalender();
//    			location.reload(true);
//    			//CellWeb1.OpenReport(repid, openmode, organid, userid, writetime, '', location.href);
//				}
			}
			break;
		case "CMDCRSWRITENEXT":
			CellWeb1.SaveReport();
			if(!dosave)
				dosave = true;
			if(window.confirm("填写下一张吗?"))
			{
				dosave = false;
				writetime = '';//GetCurCalender();
    		CellWeb1.OpenReport(repid, openmode, organid, userid, writetime, '', location.href);
			}
			break;
		case "CMDCRSEXPORT":
		    CellWeb1.SaveFile();
			break;
		case "CMDCRSEXPORTFILE":
		    CellWeb1.SaveFile();
			break;
		case "CMDCRSIMPORT":
			CellWeb1.LoadFile();
			break;
		case "CMDCRSIMPORTFILE":
			if(openmode == "write" || openmode == "edit" && window.confirm("导入将全部覆盖当前数据，继续导入?"))
			{
				CellWeb1.ImportReportData();
			}
			break;
		case "CMDCRSBATCHIMPORTFILE":
		  BatchImportFile();
			break;
		case "CMDCRSINSERTPIC":
			CellWeb1.InsertPicture();
			break;
		case "CMDCRSSAVEPIC":
			CellWeb1.SavePicture();
			break;
		case "CMDCHART":
			CellWeb1.DoChartGuide(0, 0, 0, 0);
			break;
		case "CMDCRSAPPENDRECORD":
			CellWeb1.AppendRecord();
			break;
		case "CMDCRSINSERTRECORD":
			CellWeb1.InsertRecord();
			break;
		case "CMDCRSDELETERECORD":
			CellWeb1.DeleteRecord();
			break;
		case "CMDCRSEXEC":
			CellWeb1.ExecuteManuFormulas((document.getElementById("cmdCRSExec").title=="计算")?"":document.getElementById("cmdCRSExec").title);
			break;
		case "CMDCRSCHECK":
			CellWeb1.LogicCheck();
			break;
		case "CMDCRSCHECKONINPUT":
			CellWeb1.SetLogicCheckOnInput();
			break;
		case "CMDCRSFORMAT":
			CellWeb1.FormatCells(0);
			break;
		case "CMDEDITCUT":
		 	CellWeb1.DoCutArea(-1, -1, -1, -1);
			break;
		case "CMDEDITCOPY":
		    CellWeb1.DoCopyArea(-1, -1, -1, -1);
			break;		
		case "CMDEDITPASTE":
		 	CellWeb1.DoPaste(-1, -1, false);
			break;
		case "CMDMERGE":
		  CellWeb1.DoJoinCells(-1, -1, -1, -1);
		  break;
		case "CMDUNMERGE":
		  CellWeb1.DoUnJoinCells(-1, -1, -1, -1);
		  break;
		case "CMDINSERTROW":
		  CellWeb1.DoInsertRow(0, 0);
		  break;
		case "CMDINSERTCOL":
		  CellWeb1.DoInsertCol(0, 0);
		  break;
		case "CMDDELETEROW":
		  CellWeb1.DoDeleteRow(0, 0);
		  break;
		case "CMDDELETECOL":
		  CellWeb1.DoDeleteCol(0, 0);
		  break;
		case "CMDFORMAT":
		    CellWeb1.FormatCells(0);
		    break;
    case "CMDWORDWRAP":
        CellWeb1.SetWordWrap();
        break;
    case "CMDUNDO":
      CellWeb1.DoUnDo();
      break;
    case "CMDREDO":
      CellWeb1.DoReDo();
      break;
    case "CMDEXIT":
    	if(!(openmode == "read" || isquery == "y") && window.confirm("要保存退出吗?"))
      {
      	if(CellWeb1.SaveReport())
      	{
      		dosave = true;
					if(openmode == "write" && rep_type == "单据或卡片" && window.confirm("填写下一张吗?"))
					{
	    			location.reload(true);
	    			break;
					}
      	} else
      	{
      		break;
      	}
      }
      window.close();
      break;
    case "CMDRELOAD":
    	/*var act = window.thisForm.action.value;
    	window.thisForm.action.value = "syndata";
    	window.thisForm.submit();
    	window.thisForm.action.value = act;*/
    	location.reload(true);
    	break;
    case "CMDCRSSTART":
    	var step = document.getElementById("step").value;
    	var repeating = document.getElementById("repeating").checked;
    	if(step == "")
    		step = 500;
    	document.getElementById("btn_stop").style.display = "inline";
    	document.getElementById("btn_start").style.display = "none";
    	CellWeb1.AutoRun(true, step, repeating);
    	break;
    case "CMDCRSSTOP":
    	document.getElementById("btn_stop").style.display = "none";
    	document.getElementById("btn_start").style.display = "inline";
    	CellWeb1.AutoRun(false, 500, false);
    	break;
    case "CMDLOCKWINDOW":
    	document.getElementById("btn_lock_window").style.display = "none";
    	document.getElementById("btn_unlock_window").style.display = "inline";
    	CellWeb1.DoLockSheet(-1, -1, true);
    	break;
    case "CMDUNLOCKWINDOW":
    	document.getElementById("btn_lock_window").style.display = "inline";
    	document.getElementById("btn_unlock_window").style.display = "none";
    	CellWeb1.DoLockSheet(-1, -1, false);
    	break;
    case "CMDCRSNEXT":
    	o = window.thisForm.cur_page.value;
    	window.thisForm.cur_page.value++;
    	if(parseInt(window.thisForm.cur_page.value) * parseInt(window.thisForm.page_size.value) >= 
    		parseInt(window.thisForm.page_count.value))
    	{
    		window.thisForm.cur_page.value = Math.floor(parseInt(window.thisForm.page_count.value) /
    			parseInt(window.thisForm.page_size.value));
    	}
    	if(o != window.thisForm.cur_page.value)
    		window.thisForm.submit();
    	break;
    case "CMDCRSPREV":
    	o = window.thisForm.cur_page.value;
    	window.thisForm.cur_page.value--;
    	if(parseInt(window.thisForm.cur_page.value) < 0)
    		window.thisForm.cur_page.value = 0;
    	if(o != window.thisForm.cur_page.value)
    		window.thisForm.submit();
    	break;
    case "CMDCRSFIRST":
    	o = window.thisForm.cur_page.value;
    	window.thisForm.cur_page.value = 0;
    	if(o != window.thisForm.cur_page.value)
    		window.thisForm.submit();
    	break;
    case "CMDCRSLAST":
    	o = window.thisForm.cur_page.value;
    	window.thisForm.cur_page.value = Math.floor(parseInt(window.thisForm.page_count.value) /
    		parseInt(window.thisForm.page_size.value));
    	if(o != window.thisForm.cur_page.value)
    		window.thisForm.submit();
    	break;
    case "CMDCRSNEXTREP":
			if(itemindex+1 > 10){//下翻一页
				if(window.opener.GoNext() == 0){
					itemindex = 0;
					for(i = 0; i < 1000*50*20;i++);
				}else{
					alert("已经是最后一张！");
					break;
				};
			}
    	if(window.opener.OpenReport(repid, openmode, itemindex+1, "", "", "") == 1){
    		alert("已经是最后一张！");
    	}
    	break;    
    case "CMDCRSPREVREP":
		 	if(itemindex-1 < 1){//上翻一页
				if(window.opener.GoPrev() == 0){
					itemindex = 11;
					for(i = 0; i < 1000*50*20;i++);
				}else{
					alert("已经是第一张！");
					break;
				};
			}
    	if(window.opener.OpenReport(repid, openmode, itemindex-1, "", "", "") == 1){
    		alert("已经是第一张！");
    	}
    	break;
    case "CMDCRSHELP":
    	alert('模板设计简明步骤：\n'+
'    步骤1：设计表格 有两种方法，方法一导入Excel文件；方法二通过系统提供的设计器进行设计。\n'+
'    步骤2：定义数据表 数据表分主表、明细表、交叉表三种类型。\n'+
'    步骤3：设置属性 包括编号、名称、分类、类别、填报权限、查阅权限、业务流程（图）等。\n'+
'    步骤4：添加公式 包括计算公式和验证公式。\n'+
'    其中步骤4可选。\n\n' +
      '系统设计原则：\n' +
      '    根据应用需求，规划相应表格及流程，管理表格按基础表、业务表、分析表三个层次进行设计，\n'+
      '      其中基础表用来预制业务基础数据，\n' +
      '      业务表用来处理日常业务，其所需要的基础数据通过系统自动从基础表中提取，\n' +
      '      分析表用来统计和分析业务情况，通常是通过系统从业务数据中自动分析获得。');
    	break;
    case "CMDBACK":
        //------------------------------------------------------------------------
  		//------------------------------------------------------------------------
  		//-------------------这儿没改呢-----------------------------------------------
  		//------------------------------------------------------------------------
  		//------------------------------------------------------------------------
  		//------------------------------------------------------------------------
    	location.href = "../workshop/report/list_relation.php?id=" + kid;
    	break;
	}
}