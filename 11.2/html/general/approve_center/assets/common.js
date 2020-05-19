//弹出浮动层向上移动
function viewMenu(id,num)
{
	var menuObj = document.getElementById(id+"_menu");
	var MenuTop = menuObj.style.top;
	MenuTop = MenuTop.substr(0, MenuTop.length - 2);
	menuObj.style.top = MenuTop - 25;
	if(is_ie && is_ie < 7) {
		if(jsmenu['iframe'][0]){
			jsmenu['iframe'][0].style.top = menuObj.style.top;
		}
	}
}
//查看流程设计图
function view_graph(FLOW_ID, archive_id)
{
    if(archive_id == "" || typeof(archive_id)=="undefined")
    {
        var myleft=(screen.availWidth-800)/2;
        window.open("/general/approve_center/flow_view.php?FLOW_ID="+FLOW_ID,"","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=500,left="+myleft+",top=50");
    }
    else
    {
        var myleft=(screen.availWidth-800)/2;
        window.open("/general/approve_center/flow_view.php?FLOW_ID="+FLOW_ID+"&ARCHIVE_ID="+archive_id,"","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=500,left="+myleft+",top=50");
    }
}
//归档数据查看流程设计图
function archive_view_graph(FLOW_ID,archive_id,MODULE_TYPE)
{
    var myleft=(screen.availWidth-800)/2;
	var url = MODULE_TYPE == 'workflow' ? "/general/workflow/query/data/archive_flow_view.php?FLOW_ID="+FLOW_ID+"&ARCHIVE_ID="+archive_id : "/general/approve_center/query/data/archive_flow_view.php?FLOW_ID="+FLOW_ID+"&ARCHIVE_ID="+archive_id;
    window.open(url,"","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=500,left="+myleft+",top=50");
}

//查看表单
function form_view(RUN_ID,FLOW_ID,PRCS_ID,archive_time)
{
	if(archive_time == "" || typeof(archive_time)=="undefined"){
		window.open("/general/approve_center/list/print/?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&PRCS_ID="+PRCS_ID,"","status=0,toolbar=no,menubar=no,width="+(screen.availWidth-12)+",height="+(screen.availHeight-38)+",location=no,scrollbars=yes,resizable=yes,left=0,top=0");
	}else{
		window.open("/general/approve_center/list/print/?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&PRCS_ID="+PRCS_ID+"&archive_time="+archive_time,"","status=0,toolbar=no,menubar=no,width="+(screen.availWidth-12)+",height="+(screen.availHeight-38)+",location=no,scrollbars=yes,resizable=yes,left=0,top=0");
	}
    
}

//查看实际流程图
function flow_view(RUN_ID,FLOW_ID,archive_time)
{
    if(archive_time == "" || typeof(archive_time)=="undefined")
    {
        var myleft=(screen.availWidth-800)/2;
        window.open("/general/approve_center/list/flow_view/?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID,RUN_ID,"status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=400,left="+myleft+",top=100");
    }
    else
    {
        var myleft=(screen.availWidth-800)/2;
        window.open("/general/approve_center/list/flow_view/?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&ARCHIVE_ID="+archive_time,RUN_ID,"status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=400,left="+myleft+",top=100"); 
    }
}

//归档数据查看实际流程图
function archive_flow_view(RUN_ID,FLOW_ID,ARCHIVE_ID,MODULE_TYPE)
{
    var myleft=(screen.availWidth-800)/2;
	var url = MODULE_TYPE == 'workflow' ? "/general/workflow/list/flow_view/?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&ARCHIVE_ID="+ARCHIVE_ID : "/general/approve_center/list/flow_view/?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&ARCHIVE_ID="+ARCHIVE_ID;
   window.open(url,RUN_ID,"status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=400,left="+myleft+",top=100");
}


//归档数据查看工作
function archive_view_work(menu_flag, run_id, prcs_key_id, flow_id ,archive_time,module_type)
{ 
	if(module_type == 'workflow')
	{
		var url = "/general/workflow/list/print/index.php?actionType=view";
	}else
	{
		var url = "/general/approve_center/list/print/index.php?actionType=view";
	}
	url += "&MENU_FLAG="+menu_flag;
	url += "&RUN_ID="+run_id;
	url += "&PRCS_KEY_ID="+prcs_key_id;
	url += "&FLOW_ID="+flow_id;
	//url += "&PRCS_ID="+prcs_id;
	//url += "&FLOW_PRCS="+flow_prcs;
	url += "&ARCHIVE_TIME="+archive_time;
	var tmp_height = jQuery(window.parent.parent) ? jQuery(window.parent.parent.document).height() : jQuery(document).height()
	var configStr = "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width="+(jQuery(document).width()-20)+",height="+tmp_height+",left=-4,top=0";
	window.open(url, "view_work_"+run_id, configStr);
}

function edit_run(RUN_ID,FLOW_ID,MODULE_TYPE)
{
    //var myleft=(screen.availWidth-900)/2;
    var url = MODULE_TYPE == 'workflow' ? "/general/workflow/query/list/input_form/?RUN_ID="+RUN_ID+"&MENU_FLAG=1&EDIT_MODE=1&FLOW_ID="+FLOW_ID : "/general/approve_center/query/list/input_form/?RUN_ID="+RUN_ID+"&MENU_FLAG=1&EDIT_MODE=1&FLOW_ID="+FLOW_ID;   
    width=(window.screen.availWidth-10);//设置打开的窗口的宽度
	height=(window.screen.availHeight-30);//设置打开的窗口的高度
	window.open (url, '', 'height='+height+', width='+width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no') ;
}

//function others(FLOW_ID,RUN_ID,PRCS_ID,FLOW_PRCS,FLOW_TYPE)
//{
//    var page;
//    if(FLOW_TYPE==1)
//        page="others";
//    else
//        page="others_free";
//    var myleft=(screen.availWidth-700)/2;
//    var mytop=(screen.availHeight-450)/2;
//    window.open("/general/approve_center/list/others/"+page+".php?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS,"others","status=0,toolbar=no,menubar=no,width=700,height=450,location=no,scrollbars=yes,resizable=no,left="+myleft+",top="+mytop);
//}
function others(FLOW_ID,RUN_ID,PRCS_ID,FLOW_PRCS,FLOW_TYPE,FLOW_ENTRUST)
{
    var page;
    if(FLOW_TYPE==1)
        page="others";
    else
        page="others_free";
    var myleft=(screen.availWidth-700)/2;
    var mytop=(screen.availHeight-450)/2;
		if(FLOW_ENTRUST=="conceal"){ //我的工作
    	window.open("/general/approve_center/list/others/"+page+".php?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&FLOW_ENTRUST="+FLOW_ENTRUST,"others","status=0,toolbar=no,menubar=no,width=700,height=450,location=no,scrollbars=yes,resizable=no,left="+myleft+",top="+mytop);
    }else{
    	window.open("/general/approve_center/list/others/"+page+".php?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS,"others","status=0,toolbar=no,menubar=no,width=700,height=450,location=no,scrollbars=yes,resizable=no,left="+myleft+",top="+mytop);
    }
}


function user_view(USER_ID)
{
    var mytop=(jQuery(document).height()-500)/2-30;
    var myleft=(jQuery(document).width()-780)/2;
    window.open("/general/ipanel/user/user_info.php?WINDOW=1&USER_ID="+USER_ID,"user_view","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=780,height=500,left="+myleft+",top="+mytop+"\"");
}

function delete_run(RUN_ID)
{
    var msg=td_lang.general.workflow.msg_6;//"确认要删除所选工作吗？"
    if(window.confirm(msg))
    {
        jQuery.get("/general/approve_center/list/delete.php",{"RUN_ID_STR":RUN_ID},function(data)
        {
            if(data==RUN_ID)
            {
            	jQuery.showTip(td_lang.general.workflow.msg_7);//该工作已删除
            	jQuery("#list").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
            }
            else
            {
            	jQuery.showTip(td_lang.general.workflow.msg_8);//该工作未能删除，请联系系统管理员！
            }
                
        });
    }
}

function stop_run(RUN_ID,FLOW_ID,PRCS_ID,FLOW_PRCS,FLOW_TYPE,OP_FLAG)
{
    var msg=td_lang.general.workflow.msg_9;//"确认要结束该工作流程吗？"
    if(typeof OP_FLAG == 'undefined')
        OP_FLAG = "";
    if(window.confirm(msg))
    {
        jQuery.get("/general/approve_center/list/stop.php",{OP_FLAG:OP_FLAG,FLOW_ID:FLOW_ID,RUN_ID:RUN_ID,PRCS_ID:PRCS_ID,FLOW_PRCS:FLOW_PRCS,FLOW_TYPE:FLOW_TYPE,FLAG:1},function(data)
        {
            if(data=="")
            {
                jQuery.showTip(td_lang.general.workflow.msg_10);//操作已成功
                jQuery("#list").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
            }
            else{
                jQuery.showTip(data);
            }    
            //jQuery("#flow_list").gridReload({colModel:""});
        });
    }
}

function call_back(RUN_ID,PRCS_ID,FLOW_PRCS)
{
    var msg=td_lang.general.workflow.msg_11;//"下一步骤尚未接收时可收回至本步骤重新办理，确认要收回吗？"
    if(window.confirm(msg))
    {
        var url="/general/approve_center/list/call_back.php?RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS;
        jQuery.get(url,{},function(data){
            if(data==1)
        	    jQuery.showTip(td_lang.general.workflow.msg_12);//您没有权限！
        	else if(data==2)
        	    jQuery.showTip(td_lang.general.workflow.msg_13);//对方已接收，不能收回
            else
            {
        	    jQuery.showTip(td_lang.general.workflow.msg_14);//工作已回收
        	    jQuery("#list").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
            }
        });
    }
}

function call_back_other(RUN_ID,PRCS_ID,FLOW_PRCS,NEXT_USER)
{
    var msg=td_lang.general.workflow.msg_15;//"被委托人尚未接收时可收回重新办理，确认要收回吗？"
    if(window.confirm(msg))
    {
        var url="/general/approve_center/list/call_back_other.php?RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&NEXT_USER="+NEXT_USER;
        jQuery.get(url,{},function(data){
            if(data==1)
            {
                alert(td_lang.general.workflow.msg_12);//您没有权限！
            }
        	else if(data==2)
        	{
        	    alert(td_lang.general.workflow.msg_13);//对方已接收，不能收回
        	}
            else
            {
                jQuery("#gridTable").trigger('reloadGrid');
            }
        });
    }
}

function check_one(el)
{
	if(!el.checked) {
		jQuery("#allbox_for").attr("checked", false); 
	}
}

function get_run_str()
{
    var run_str="";
    jQuery("input[name='run_select']").each(function(){
  	    if(jQuery(this).attr("checked")==true) {
  	        run_str+=jQuery(this).val()+",";
  	    }
  	});
    run_str=run_str.substr(0,run_str.length-1);
    return run_str;
}

function showMenuWorkflow(objId){
	hideMenu();
	var obj = jQuery("#"+objId);
	var objOffset = obj.offset();
	var menuObj = jQuery("#"+objId+"_menu");
	var vLeft	= ((jQuery(document).width()-objOffset.left) > (menuObj.outerWidth(true)+25)) ? (objOffset.left+obj.parents("div.ui-jqgrid-bdiv:last").scrollLeft()-6)
				: ((objOffset.left+obj.parents("div.ui-jqgrid-bdiv:last").scrollLeft())-(menuObj.outerWidth(true)-obj.width()-4));
	if(obj.parents("td.subgrid-data:first").prev("td.subgrid-cell:first").length > 0){
		vLeft -= obj.parents("td.subgrid-data:first").prev("td.subgrid-cell:first").outerWidth(true);
	}
	var vTop	= ((obj.parents("div.ui-jqgrid-bdiv:last").height()+obj.parents("div.ui-jqgrid-bdiv:last").offset().top) - (objOffset.top+obj.parent().height())) > menuObj.height() ? ''
				: -(menuObj.height()+obj.height());
	menuObj.css({
		left:vLeft,
		marginTop:vTop
	});
	initCtrl(obj[0], false, 2, 200, 0);
	ctrlobjclassName = obj[0].className;
	obj[0].className += ' hover';
	initMenu(objId, menuObj[0], 2, 200, 0, false);
	menuObj.show();
	//jsmenu['active'][0] = menuObj[0];
	if(menuObj[0]){
		jsmenu['active'][0] = menuObj[0];
	}
}

function cancel(targetId){
	if(top.jQuery && top.jQuery.fn.closeTab){
		var id = top.jQuery.fn.getSelected();
		if(typeof targetId != "undefined" && targetId != ""){
			top.setTimeout(top.jQuery.fn.selectTab, 1,targetId);
		}		
		top.closeTab(id);
	}else{
		window.close();
	}
}

function goBackUrl(url,targetId){
	if(top.jQuery && top.jQuery.fn.closeTab){
		var id = top.jQuery.fn.getSelected();
		if(typeof targetId != "undefined" && targetId != ""){
			if(typeof url != "undefined" && url != ""){
				top.jQuery("#tabs_"+targetId+"_iframe").attr("src",url);
			}
			top.setTimeout(top.jQuery.fn.selectTab, 1,targetId);
		}		
		top.closeTab(id);
	}else{
		if(window.opener && (typeof window.opener.location != 'unknown') && typeof url != "undefined") {
			window.opener.location.href = url;
		}	
		window.close();
	}
}

function openNewProtal(Purl,Pname,Pid){
	if(top.jQuery && top.jQuery.fn.closeTab){
		jumpProtal(Pid,Pname,Purl);
	}	else	{
		openWindow(Purl,screen.availWidth*0.8,screen.availHeight*0.8,null,Pname);
	}			
}
function jumpProtal(protal_id, protal_title, protal_url){
	if(window.parent.openURL ){
		var parent_str = window.parent.location.toString();
		var parent_flag = parent_str.indexOf("nav.php");
		if(parent_flag < 0){
			window.parent.openURL(protal_id, protal_title, protal_url);
		}else{
			window.location.href = protal_url;
		}
	}else if(window.parent.parent.openURL){
		var parents_str = window.parent.parent.location.toString();
		var parents_flag = parents_str.indexOf("nav.php");
		if(parents_flag < 0){
			window.parent.parent.openURL(protal_id, protal_title, protal_url);
		}else{
			window.parent.location.href = protal_url;
		}		
	}else{
		window.location.href = protal_url;
	}
}

function openWindow(url, width, height, params, target){
    var left = (screen.availWidth  - width)/2;
    var top  = (screen.availHeight - height)/2;

    var paramStr = "";
    if(typeof params == "undefined" || params == null){
        paramStr = "toolbar="     + "no,"
                 + "location="    + "no,"
                 + "status="      + "no,"
                 + "directories=" + "no,"
                 + "menubar="     + "no,"
                 + "scrollbars="  + "yes,"
                 + "resizable="   + "yes,"
                 + "left="        + left  + ", "
                 + "top="         + top   + ", "
                 + "width="       + width + ", "
                 + "height="      + height;
    }else{
		var toolbar = (typeof params['toolbar']  == "undefined" || params['toolbar']  == "") ? "no" : params['toolbar'];
		var locationX = (typeof params['location']  == "undefined" || params['location']  == "") ? "no" : params['location'];
		var status = (typeof params['status']  == "undefined" || params['status']  == "") ? "no" : params['status'];
		var directories = (typeof params['directories']  == "undefined" || params['directories']  == "") ? "no" : params['directories'];
		var menubar = (typeof params['menubar']  == "undefined" || params['menubar']  == "") ? "no" : params['menubar'];
		var scrollbars = (typeof params['scrollbars']  == "undefined" || params['scrollbars']  == "") ? "no" : params['scrollbars'];
		var resizable = (typeof params['resizable']  == "undefined" || params['resizable']  == "") ? "no" : params['resizable'];

        paramStr = "toolbar="     +  toolbar + ","
                 + "location="    + locationX + ","
                 + "status="      + status + ","
                 + "directories=" + directories + ","
                 + "menubar="     + menubar + ","
                 + "scrollbars="  + scrollbars + ","
                 + "resizable="   + resizable + ","
                 + "left="        + left  + ", "
                 + "top="         + top   + ", "
                 + "width="       + width + ", "
                 + "height="      + height;
    }
	
	if(typeof target != 'undefined'){
        winObj = window.open(url, target, paramStr);
    }else{
        winObj = window.open(url, "newopen", paramStr);
    }
    winObj.focus();
	return winObj;
}

function openDialogWindow(url, dialogWidth, dialogHeight, params, target){
    var dialogLeft = (screen.availWidth  - dialogWidth)/2;
    var dialogTop  = (screen.availHeight - dialogHeight)/2;
    
    
    var paramStr = "";
    if(typeof params == "undefined" || params == null){
        paramStr = "center="		+ "yes;"
                 + "help="			+ "no;"
                 + "resizable="		+ "no;"
                 + "status="		+ "yes;"
                 + "scroll="		+ "yes;"
                 + "dialogHide="	+ "no;"
                 + "edge="			+ "raised;"
				 + "unadorned="		+ "no;"
                 + "dialogLeft="    + dialogLeft  + "px; "
                 + "dialogTop="     + dialogTop   + "px; "
                 + "dialogWidth="   + dialogWidth + "px; "
                 + "dialogHeight="  + dialogHeight + "px;";
    }else{
		
        paramStr = "center="		+ ((typeof params['center']		== "undefined" || params['center']		== "") ? "no"	: params['center'])		+ ";"
                 + "help="			+ ((typeof params['help']		== "undefined" || params['help']		== "") ? "no"	: params['help'])		+ ";"
                 + "resizable="		+ ((typeof params['resizable']  == "undefined" || params['resizable']   == "") ? "no"	: params['resizable'])  + ";"
                 + "status="		+ ((typeof params['status']		== "undefined" || params['status']		== "") ? "yes"	: params['status'])		+ ";"
                 + "scroll="		+ ((typeof params['scroll']		== "undefined" || params['scroll']		== "") ? "yes"	: params['scroll'])		+ ";"
                 + "dialogHide="	+ ((typeof params['dialogHide']	== "undefined" || params['dialogHide']	== "") ? "no"	: params['dialogHide'])	+ ";"
                 + "edge="			+ ((typeof params['edge']		== "undefined" || params['edge']		== "") ? "raised"	: params['edge'])	+ ";"
				 + "unadorned="		+ ((typeof params['unadorned']	== "undefined" || params['unadorned']	== "") ? "no"	: params['unadorned'])	+ ";"
                 + "dialogLeft="	+ dialogLeft  + "; "
                 + "dialogTop="		+ dialogTop   + "; "
                 + "dialogWidth="	+ dialogWidth + "; "
                 + "dialogHeight="	+ dialogHeight;
				 
    }
	
    if(typeof target != 'undefined'){
        window.showModalDialog(url, target, paramStr);
    }else{
        window.showModalDialog(url, "", paramStr);
    }
}

function focus_run_search(RUN_ID,OP)
{   
	var OP_DESC=OP==1?td_lang.general.workflow.msg_4:td_lang.general.workflow.msg_5;//"关注":"取消关注"
    var msg2 = sprintf(td_lang.inc.msg_126,OP_DESC);
    var msg=msg2;
    if(window.confirm(msg))
    {
        jQuery.get("../list/focus.php",{"RUN_ID":RUN_ID,"OP":OP},function(data)
        {
    	    jQuery.showTip(data);
    	    jQuery("#list").trigger("reloadGrid");
        });
    }
}

function restore_run_search(RUN_ID)
{
    var msg=td_lang.general.workflow.msg_1;//"确认要将此工作恢复到执行中吗？"
    if(window.confirm(msg))
    {
        var url="restore.php?RUN_ID="+RUN_ID;
        jQuery.get(url,{},function(data){
            jQuery.showTip(data);
            jQuery("#list").trigger("reloadGrid");
        });
    }
}

function add_handle(MENU_FLAG,RUN_ID,PRCS_KEY_ID,FLOW_ID,PRCS_ID,FLOW_PRCS)
{
	//var URL = "view_list/index.php?LIST_TYPE=list&FLOW_ID="  + FLOW_ID + "&ID=" + ID + "&ADDRESS_ID=" + operator;
	var URL = "../list/input_form/?menu_flag="+MENU_FLAG+"&RUN_ID="+RUN_ID+"&PRCS_KEY_ID="+PRCS_KEY_ID+"&FLOW_ID="+FLOW_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&GETDATA_SEARCH=1";
	width=(window.screen.availWidth-10);//设置打开的窗口的宽度
	height=(window.screen.availHeight-30);//设置打开的窗口的高度
	window.open (URL, '', 'height='+height+', width='+width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no') ;
}

function archive_end_run(run_id_one) // 高级查询
{
    var msg=td_lang.general.workflow.msg_2;//"确认要强制结束所选工作吗？"
    if(window.confirm(msg))
    {
    	if(typeof run_id_one == "undefined")
	    	var run_str=get_run_str();
	    else
	    	var run_str=run_id_one;

	    if(run_str=="")
	    {
            alert(td_lang.general.workflow.msg_3);//"要结束工作，请至少选择其中一项。"
            return;
        }
        var url="end.php?RUN_ID_STR="+run_str;
        jQuery.get(url,{},function(data)
        {
      	    jQuery.showTip(data);
      	  jQuery("#list").trigger("reloadGrid");
      	});
    }
}


