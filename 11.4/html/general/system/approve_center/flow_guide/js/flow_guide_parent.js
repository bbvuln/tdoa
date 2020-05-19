(function($){
	jQuery('#bottom_info_right').css('height',getMainDivHeight());
})(jQuery);

function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true) - 70;
	return windowsHeight;
}
function flow_trans(){
    window.open("/general/system/approve_center/flow_guide/flow_type/set_trans/?1=1","set_trans","menubar=0,toolbar=0,scrollbars=no,status=0,resizable=1");
}

function set_batch(){
	window.open("/general/system/approve_center/flow_guide/flow_type/set_all/?1=1","set_all","menubar=0,toolbar=0,scrollbars=no,status=0,resizable=1");
}

function ajax_update(url, mes, handler, params){
	var d = $('<div>').css({
		position: 'fixed',
		left: '50%',
		top: '50%',
		marginLeft: '-50px',
		marginTop: '-20px',
		background: 'white',
		lineHeight: '40px',
		color: '#666',
		fontSize: '14px',
		border: '1px solid #ccc',
		borderRadius: '3px',
		padding: '3px 10px',
		width: '100px',
		height: '40px',
		boxShadow: '0 0 5px #555',
		textAlign: 'center',
		zIndex: 100
	}).appendTo('body');
	mes = mes || {
		success: td_lang.general.workflow.msg_104,
		fail: td_lang.general.workflow.msg_105	
	};
	
	var m = $('<div class="pop-panel-overlay"></div>').css({
		width: $(window).width(),
		height: $(window).height()
	}).appendTo('body').show();
	
	d.html('<img src="/static/images/loading_gray_16.gif" align="absMiddle" class="mg5-x"><?=_("正在执行...")?>');
	$.post(url, {}, function(msg){	
		if( msg === 'success' ){
			d.html(mes.success);
		} else {
			d.html(mes.fail);
		}
		setTimeout(function(){
			d.add(m).remove();
		},500);
		if($.isFunction(handler)) { handler.apply(params || {}); }
	});
}
function update_cache(){
	ajax_update('/general/system/approve_center/flow_guide/flow_type/update_cache.php');
}

//获取权限列表
function power_manage(flow_id)
{
	jQuery.ajax
	({		
		url: "/general/system/approve_center/flow_guide/flow_type/set_manage/manage_data.php?FLOW_ID="+flow_id,
		data: "FLOW_ID="+flow_id,
		type: "POST",
		async: true,
		dataType: 'json',
		success: function(data){
			var manage_data = data;
			if(manage_data != 0){
				var Data = {"runData":manage_data}
				var template = jQuery.templates("#intrustDataTmpl");
				var htmlOutput = template.render(Data);
				jQuery("#guide-view-frame").contents().find("#intrustData").html(htmlOutput);
			}else{
						
			}
		},
		error: function(data){
			//alert(data.responseText);
		}
	});
}

//新建管理权限
function flow_manage_new(flow_id)
{
	jQuery("#flow_edit_div").html("");
	jQuery('#flow_timer_edit_div').html("");
	jQuery('#flow_timer_new_div').html("");
	jQuery('#flow_print_new_div').html("");

	open_bootcss_modal("myModal","800","5");//修改窗口大小
	jQuery('#flow_new_div').load('flow_type/set_manage/manage_new.php?FLOW_ID='+flow_id,function()
	{
		explain(1);
	});
}
//新建、修改权限
function manage_checkForm(TYPE){
	
	var priv_scope  =	jQuery("#manage_new_priv_scope").val();
	var user  		=	jQuery("#manage_new_user").val();
	var priv_type  	=	jQuery("#manage_new_priv_type").val();
	var dept  		=	jQuery("#manage_new_dept").val();
	var role  		=	jQuery("#manage_new_role").val();
	var scope_dept  =	jQuery("#manage_new_scope_dept").val();
	var flow_id 	=	jQuery("input[name='FLOW_ID']").val();
	var priv_id 	=	jQuery("input[name='PRIV_ID']").val();

	if(priv_type.replace(/(^\s+)|(\s+$)/g,"") == ""){
		alert(td_lang.general.workflow.msg_110);
		return false;
	}
	if(user.replace(/(^\s+)|(\s+$)/g,"") == "" && dept.replace(/(^\s+)|(\s+$)/g,"") == "" && role.replace(/(^\s+)|(\s+$)/g,"") == ""){
		alert(td_lang.general.workflow.msg_111);
		return false;
	}
	if(priv_scope.replace(/(^\s+)|(\s+$)/g,"") == "" ){
		alert(td_lang.general.workflow.msg_112);
		return false;
	}else if(priv_scope == "CUSTOM"){
		if(scope_dept.replace(/(^\s+)|(\s+$)/g,"") == ""){
			alert(td_lang.general.workflow.msg_112);
			return false;
		}
	}
	
	if(TYPE == 1)
	{	
		var url = "/general/system/approve_center/flow_guide/flow_type/set_manage/add.php";
	}
	else
	{
		var url = "/general/system/approve_center/flow_guide/flow_type/set_manage/update.php";
	}
	jQuery.ajax
	({		
		url: url,
		data: {'priv_scope':priv_scope,'user':user,'priv_type':priv_type,'dept':dept,'role':role,'scope_dept':scope_dept,'flow_id':flow_id,'priv_id':priv_id},
		type: "POST",
		async: true,
		success: function(data){	
			if(data)
			{
				power_manage(flow_id);	
				jQuery('.close').click();
			}			
		},
		error: function(data){
			alert(data.responseText);
		}
	});
}

//修改管理权限
function editCallback(flow_id,priv_id)
{
	jQuery("#flow_new_div").html("");
	jQuery('#flow_timer_edit_div').html("");
	jQuery('#flow_timer_new_div').html("");
	jQuery('#flow_print_new_div').html("");
	open_bootcss_modal("myModal_edit","800","5");
	jQuery('#flow_edit_div').load('flow_type/set_manage/manage_new.php?FLOW_ID='+flow_id+'&PRIV_ID='+priv_id,function()
	{

	});
}

//获取定时任务列表
function set_timer(flow_id)
{
	jQuery.ajax
	({		
		url: "/general/system/approve_center/flow_guide/flow_type/set_timer/timer_data.php?FLOW_ID="+flow_id,
		data: "FLOW_ID="+flow_id,
		type: "POST",
		async: true,
		dataType: 'json',
		success: function(data){
			var timer_data = data;
			if(timer_data != 0){
				var Data = {"runData":timer_data}
				var template = jQuery.templates("#set_timerTmpl");
				var htmlOutput = template.render(Data);
				jQuery("#guide-view-frame").contents().find("#set_timer").html(htmlOutput);
			}else{
						
			}
		},
		error: function(data){
			//alert(data.responseText);
		}
	});
}

//新建定时任务
function flow_timer_new(flow_id)
{
	jQuery("#flow_new_div").html("");
	jQuery("#flow_edit_div").html("");
	jQuery('#flow_timer_edit_div').html("");
	jQuery('#flow_print_new_div').html("");
	var url = "flow_type/set_timer/new_timer.php?FLOW_ID="+flow_id;
	open_bootcss_modal("myModal_timer_new","800","5");
	jQuery('#flow_timer_new_div').load(url,function()
	{

	});
}

//修改定时任务
function flow_timer_edit(flow_id,t_id)
{
	jQuery("#flow_new_div").html("");
	jQuery("#flow_edit_div").html("");
	jQuery('#flow_timer_new_div').html("");
	jQuery('#flow_print_new_div').html("");
	var url = "flow_type/set_timer/new_timer.php?FLOW_ID="+flow_id+"&T_ID="+t_id;
	open_bootcss_modal("myModal_timer_edit","800","5");
	jQuery('#flow_timer_edit_div').load(url,function()
	{
		sel_change();
	});
}

//新建板式文件
function flow_print_new(flow_id)
{
	jQuery("#flow_new_div").html("");
	jQuery("#flow_edit_div").html("");
	jQuery('#flow_timer_edit_div').html("");
	jQuery('#flow_timer_new_div').html("");
	open_bootcss_modal("myModal_print_new","560","5");
	jQuery('#flow_print_new_div').load("flow_type/set_print/index.php?FLOW_ID="+flow_id,function()
	{

	});
}

//新建定时任务——新建按钮
function timer_checkForm(flag)
{
	if(document.timer_new.PRIV_USER.value=="" && document.timer_new.PRIV_DEPT.value=="" && document.timer_new.PRIV_PRIV.value=="")
	{
		alert(td_lang.general.workflow.msg_287);
		return(false);
	}
	
	var type = document.timer_new.TYPE.value;
	if(document.getElementsByName("REMIND_TIME"+type)[0].value == "")
	{
		alert(td_lang.general.workflow.msg_109);
		return(false);
	}	
	document.getElementById("timer_new").action = "/general/system/approve_center/flow_guide/flow_type/set_timer/save_schema.php?typetimer="+flag;
	
	document.getElementById("timer_new").submit();
	jQuery('.close').click();
}

//获取查询模板列表
function set_query_templet(flow_id)
{
	jQuery.ajax
	({		
		url: "/general/system/approve_center/flow_guide/flow_type/set_query_templet/index.php?FLOW_ID="+flow_id,
		data: "FLOW_ID="+flow_id,
		type: "POST",
		async: true,
		dataType: 'json',
		success: function(data){
			var timer_data = data;
			if(timer_data != 0){
				var Data = {"runData":timer_data}
				var template = jQuery.templates("#set_query_templetTmpl");
				var htmlOutput = template.render(Data);
				jQuery("#guide-view-frame").contents().find("#set_query_templet").html(htmlOutput);
			}else{
						
			}
		},
		error: function(data){
			//alert(data.responseText);
		}
	});
}

//获取板式文件列表
function set_print_templet(flow_id)
{
	jQuery.ajax
	({		
		url: "/general/system/approve_center/flow_guide/flow_type/set_print/print_data.php?FLOW_ID="+flow_id,
		data: "FLOW_ID="+flow_id,
		type: "POST",
		async: true,
		dataType: 'json',
		success: function(data){
			var timer_data = data;
			if(timer_data != 0){
				var Data = {"runData":timer_data}
				var template = jQuery.templates("#set_printTmpl");
				var htmlOutput = template.render(Data);
				jQuery("#guide-view-frame").contents().find("#set_print").html(htmlOutput);
			}else{
						
			}
		},
		error: function(data){
			//alert(data.responseText);
		}
	});
}
//新建、编辑查询模板
function add_query_tpl(flow_id,seq_id)
{
	if(seq_id)
	{
		var URL = "/module/bpm_query_tpl/new_search_modle.php?FLOW_ID="  + flow_id + "&SEQ_ID=" + seq_id;
	}else{
		var URL = "/module/bpm_query_tpl/new_search_modle.php?FLOW_ID="  + flow_id;
	}
	width=(window.screen.availWidth-10);//设置打开的窗口的宽度
	height=(window.screen.availHeight-30);//设置打开的窗口的高度
	window.open (URL, 'bpm_query_tpl', 'height='+height+', width='+width+', top=0, left=0, toolbar=no, menubar=no, scrollbars=yes, resizable=yes,location=no, status=no') ;
}

//新建板式文件按钮
function convert()
{
	var flow_id = document.set_print.FLOW_ID.value;
	var obj = document.getElementById("HWPostil1");
	if(document.set_print.T_NAME.value.replace(/(^\s+)|(\s+$)/g,"") == "")
	{
		alert(td_lang.general.workflow.msg_113);
		return;
	}
	
	if(document.set_print.T_TYPE.value.replace(/(^\s+)|(\s+$)/g,"") == "")
	{
		alert(td_lang.general.workflow.msg_114);
		return;
	}
	if(!isLoad)
	{
		alert(td_lang.general.workflow.msg_115);
		return;
	}

	jQuery("#add_tpl").disabled = true;
	var content = obj.GetCurrFileBase64();

	_post("/general/system/approve_center/flow_guide/flow_type/set_print/file_upload.php?FLOW_ID="+flow_id,"FLOW_ID="+flow_id+"&T_TYPE="+document.set_print.T_TYPE.value+"&T_NAME="+document.set_print.T_NAME.value+"&CONTENT="+content.replace(/\+/g, '%2B'),function(req){
		var t_id = req.responseText;
		var url = '/general/system/approve_center/flow_guide/flow_type/set_print/new_tpl.php?T_ID='+t_id;
		var targetTab = "<?=$targetTab?>";
		if(targetTab != ""){
			url += "&targetTab="+targetTab;
		}
		//window.location=;
	},false);	 
	set_print_templet(flow_id);
	jQuery('.close').click();
}

//管理范围显隐控制
function select_scope(obj)
{
	if(obj.value == "CUSTOM")
	{
		jQuery("#CUSTOM_DEPT").css('display', '');
		jQuery("#SCOPE_DEPT_NAME").val("");	
		jQuery("#manage_new_scope_dept").val("");	
		
	}
	else
	{
		jQuery("#CUSTOM_DEPT").css('display', 'none');
	}
}
//授权类型文字显隐
function explain(obj)
{	
	var explain_obj = document.getElementById("explain");
	var arr_str = new Array();
	arr_str[0]=td_lang.general.bpm.msg_manage_priv_type_0;
	arr_str[1]=td_lang.general.bpm.msg_manage_priv_type_1;
	arr_str[2]=td_lang.general.bpm.msg_manage_priv_type_2;
	arr_str[3]=td_lang.general.bpm.msg_manage_priv_type_3;
	arr_str[4]=td_lang.general.bpm.msg_manage_priv_type_4;
	arr_str[5]=td_lang.general.bpm.msg_manage_priv_type_5;
	if(obj == 1)
	{
		explain_obj.innerHTML = arr_str[0];
	}else{
		explain_obj.innerHTML = arr_str[obj.value];
	}
}

//window.onload = function(){
//
//}

//定时任务发起频率显隐控制
function sel_change()
{
	var aff_type_val = jQuery("#timer_type").val();
	document.getElementById("once").style.display="none";
	if(typeof(aff_type)!="undefined" && aff_type != '')
	{
		document.getElementById(aff_type).style.display="none";
	}
	var myDate = new Date();
	var timer = myDate.getFullYear() + "-" + eval(myDate.getMonth() + 1) + "-" + myDate.getDate() + " " +myDate.toLocaleTimeString();
	if(aff_type_val=="1")
	{
		aff_type="once";
		// jQuery("#REMIND_TIME1").val(timer);
	}	
	if(aff_type_val=="2")
	{
		aff_type="day";
	}	
	if(aff_type_val=="3")
	{
		aff_type="week";
	}
	if(aff_type_val=="4")
	{
		aff_type="mon";
	}
	if(aff_type_val=="5")
	{
		aff_type="year";
	}
	document.getElementById(aff_type).style.display="";
}	
function view_list_openURL()
{
	var flow_id = jQuery(window.frames["guideFrame"].document).find("#guide_flow_id").val(); 
	G.openURL('',td_lang.system.workflow.msg_30,'/general/system/approve_center/flow_guide/flow_type/flow_design/index.php?FLOW_ID='+flow_id+'&reloadFlag=1')
}

function remind_data5_mon_change(month_obj, id)
{
    var month = month_obj.options[month_obj.selectedIndex].value;
    var day_obj = document.getElementById(id);
    
    var days = 31;
    if(month == '04' || month == '06' || month == '09' || month == '11')
    {
        days = 30;
    }
    else if(month == '02')
    {
        days = 29;
    }
    
    day_obj.options.length = 0;
    for(var i=1; i<=days; i++)
    {
        day_obj.add(new Option(i, i));
    }
}