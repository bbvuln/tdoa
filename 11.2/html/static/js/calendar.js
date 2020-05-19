function my_affair(AFF_ID)
{
  myleft=(screen.availWidth-250)/2;
  mytop=(screen.availHeight-200)/2;
  window.open("../affair/note.php?AFF_ID="+AFF_ID,"note_win"+AFF_ID,"height=200,width=250,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
}

function my_note(CAL_ID,IS_MAIN)
{
   $('title').innerHTML = td_lang.inc.msg_8;//'查看日程'
   ShowDialog('form_div',10);
   _get("note.php", "CAL_ID="+CAL_ID+"&AJAX=1&IS_MAIN="+IS_MAIN, load_form);
   
}
function my_note_serach(CAL_ID)
{
   $('title').innerHTML = td_lang.inc.msg_8;//'查看日程'
   ShowDialog('form_div',10);
  _get("note.php", "CAL_ID="+CAL_ID+"&FROM=1", load_form);

}
function my_affair_serach(AFF_ID)
{
   $('title').innerHTML = td_lang.inc.msg_9;//'查看事务'
   ShowDialog('form_div',10);
   _get("aff_note.php", "AFF_ID="+AFF_ID+"&FROM=1", load_form);

}
function my_task_serach(TASK_ID)
{
  $('title').innerHTML = td_lang.inc.msg_10;//'查看任务'
  ShowDialog('form_div',10);
  _get("../task/note.php", "TASK_ID="+TASK_ID+"&FROM=1", load_form);

}
function cal_note(CAL_ID,IS_MAIN)
{
  
 myleft=(screen.availWidth-250)/2;
  mytop=(screen.availHeight-200)/2;
  window.open("cal_note.php?CAL_ID="+CAL_ID+"&IS_MAIN="+IS_MAIN,"note_win"+CAL_ID,"height=400,width=550,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
}
function aff_note(AFF_ID,IS_MAIN)
{
  
  myleft=(screen.availWidth-250)/2;
  mytop=(screen.availHeight-200)/2;
  window.open("../info/aff_note_win.php?AFF_ID="+AFF_ID+"&IS_MAIN="+IS_MAIN,"note_win"+AFF_ID,"height=272,width=480,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
}
function task_note(TASK_ID,IS_MAIN)
{
  
  myleft=(screen.availWidth-250)/2;
  mytop=(screen.availHeight-200)/2;
  window.open("../task/note_win.php?TASK_ID="+TASK_ID+"&IS_MAIN="+IS_MAIN,"note_win"+TASK_ID,"height=400,width=550,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
}
function show_work_stat_detail(TYPE_ID,USER_ID,DATE_BEGIN,DATE_END)
{
  myleft=(screen.availWidth-550)/2;
  mytop=(screen.availHeight-500)/2;

  if(TYPE_ID=="diary")
    window.open("../diary/info/user_search_stat.php?FROMTYPE=WORK_STAT&FROM_WORKSTAT=1&TO_ID1="+USER_ID+"&BEGIN_DATE="+DATE_BEGIN+"&END_DATE="+DATE_END,"","height=500,width=650,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
  else if(TYPE_ID.substr(0,8)=="workflow")
  {
    myleft=(screen.availWidth-750)/2;
    mytop=(screen.availHeight-600)/2;
  	
  	var LIST_TYPE="";//工作流列表类型（MAIN_FINISH-主办（完成）；MAIN_ALL－主办（所有）；SIGN_FINISH－会签（完成）；SIGN_ALL－会签（所有））
  	if(TYPE_ID.substr(9)=="op")//工作流主办（完成）
  	  LIST_TYPE="MAIN_FINISH";
  	else if(TYPE_ID.substr(9)=="op1")//工作流主办（所有）
  	  LIST_TYPE="MAIN_ALL";
  	else if(TYPE_ID.substr(9)=="sign")//工作流会签（完成）
  	  LIST_TYPE="SIGN_FINISH";
  	else if(TYPE_ID.substr(9)=="sign1")//工作流会签（所有）
  	  LIST_TYPE="SIGN_ALL";

    var openUrl = "workflow_detail.php?LIST_TYPE=" + LIST_TYPE + "&USER_ID_STAT="+USER_ID+"&BEGIN_DATE_STAT="+DATE_BEGIN+"&END_DATE_STAT="+DATE_END;
    window.open(openUrl, "", "height=500,width=750,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
  }
  else
  	window.open(TYPE_ID+".php?USER_ID="+USER_ID+"&DATE_BEGIN="+DATE_BEGIN+"&DATE_END="+DATE_END,"","height=500,width=550,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
}

function my_aff_note_old(AFF_ID,from)
{
  myleft=(screen.availWidth-250)/2;
  mytop=(screen.availHeight-200)/2;
  window.open("aff_note.php?AFF_ID="+AFF_ID+"&FROM="+from,"note_win"+AFF_ID,"height=200,width=250,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
}
function my_aff_note(AFF_ID,from,IS_MAIN)
{
   $('title').innerHTML = td_lang.inc.msg_9;//'查看事务'
   ShowDialog('form_div',10);
   _get("aff_note.php", "AFF_ID="+AFF_ID+"&IS_MAIN="+IS_MAIN+"&FROM="+from+"&AJAX=1", load_form);
   
}

function my_task_note_old(TASK_ID,from)
{
  myleft=(screen.availWidth-250)/2;
  mytop=(screen.availHeight-200)/2;
  window.open("../task/note.php?TASK_ID="+TASK_ID+"&FROM="+from,"note_win"+TASK_ID,"height=200,width=250,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,top="+mytop+",left="+myleft);
}
function my_task_note(TASK_ID,from,FLAGS,IS_MAIN)
{
	$('title').innerHTML = td_lang.inc.msg_10;//'查看任务'
  ShowDialog('form_div',10);
  _get("../task/note.php", "TASK_ID="+TASK_ID+"&FROM="+from+"&FLAGS="+FLAGS+"&IS_MAIN="+IS_MAIN+"&AJAX=1", load_form);
}
function My_Submit()
{
  document.form1.submit();
}

function set_year(op)
{
  document.form1.BTN_OP.value=op+" year";
  My_Submit();
}

function set_mon(op)
{
  document.form1.BTN_OP.value=op+" month";
  My_Submit();
}

function set_week(op)
{
  document.form1.BTN_OP.value=op+" week";
  My_Submit();
}

function set_day(op)
{
  document.form1.BTN_OP.value=op+" day";
  My_Submit();
}

function set_status_index(status)
{
  document.form1.OVER_STATUS.value=status;
  My_Submit();
}

function set_option(option, id, className)
{
  hideMenu();
  option = typeof(option)=="undefined" ? "" : option;
  $(id.toUpperCase()+"_FIELD").value=option;
  
 // $(id).innerHTML=$(id+'_'+option).innerHTML + $(id).innerHTML.substr($(id).innerHTML.indexOf("<"));   
  $(id).innerHTML=$(id+'_'+option).innerHTML;
  $(id).className=className+option;
}


function display_front(front)
{
   var front=document.getElementById("front");
   if(!front)
      return;
   if(front.style.display=='')
      front.style.display='none';
   else
      front.style.display='';
  
}
function display_front1()
{
   var front1=document.getElementById("front1");
   if(!front1)
      return;
   if(front1.style.display=='')
      front1.style.display='none';
   else
      front1.style.display='';
}
function display_front2()
{
   var front2=document.getElementById("front2");
   if(!front2)
      return;
   if(front2.style.display=='')
      front2.style.display='none';
   else
      front2.style.display='';
}
function display_front3()
{
   var front3=document.getElementById("front3");
   if(!front3)
      return;
   if(front3.style.display=='')
      front3.style.display='none';
   else
      front3.style.display='';
}
function set_view(view, cname)
{
    if(cname=="" || typeof(cname)=='undefined') cname="cal_view";
    var exp = new Date();
    exp.setTime(exp.getTime() + 24*60*60*1000);
    document.cookie = cname+"="+ escape (view) + ";expires=" + exp.toGMTString()+";path=/";
    
    var url=view+'.php?OVER_STATUS='+document.form1.OVER_STATUS.value+'&YEAR='+document.form1.YEAR.value+'&MONTH='+document.form1.MONTH.value+'&DAY='+document.form1.DAY.value;
    if(document.form1.DEPT_ID) url+='&DEPT_ID='+document.form1.DEPT_ID.value;
    if(document.form1.USER_ID) url+='&USER_ID='+document.form1.USER_ID.value;
    location=url;
}

function new_cal(CAL_TIME,TIME_DIFF,DRAG,selectItemId)
{
   $('title').innerHTML = td_lang.inc.msg_11;//'新建日程'
   ShowDialog('form_div',10);
   _get("new/index.php", "CAL_TIME="+CAL_TIME+"&TIME_DIFF="+TIME_DIFF+"&DRAG="+DRAG+"&selectItemId="+selectItemId, load_form);
//   window.open('new/?CAL_TIME='+CAL_TIME+"&TIME_DIFF="+TIME_DIFF,'oa_sub_window','height=350,width=500,status=0,toolbar=no,menubar=no,location=no,left=300,top=200,scrollbars=yes,resizable=yes');
}

function edit_cal(CAL_ID,DRAG,NEW_TIME)
{
   $('title').innerHTML = td_lang.inc.msg_12;//'修改日程'
   ShowDialog('form_div',10);
   _get("modify.php", "CAL_ID="+CAL_ID+"&DRAG="+DRAG+"&NEW_TIME="+NEW_TIME+"&IS_MAIN=1", load_form);
}

function load_form(req)
{
   if(req.status == 200)
      $('form_body').innerHTML = req.responseText;
   else
      $('form_body').innerHTML = td_lang.global.error + req.status;//"错误："
}

function new_diary(CAL_DATE)
{
   if(!CAL_DATE)
      CAL_DATE=document.form1.YEAR.value+document.form1.MONTH.value+document.form1.DAY.value;
   window.open('../../diary/new/?CAL_DATE='+CAL_DATE,'diary_sub_window','height=600,width=650,status=0,toolbar=no,menubar=no,location=no,left=180,top=50,scrollbars=yes,resizable=yes');
}

function del_cal(CAL_ID,from,IS_MAIN)
{
   if(!window.confirm(td_lang.inc.msg_13))//"删除后将不可恢复,确定要删除吗？"
      return;
   _get("delete.php","CAL_ID="+CAL_ID+"&AJAX=1&IS_MAIN="+IS_MAIN);
   
   if($('list_tr_'+CAL_ID))
   {
      $('list_tr_'+CAL_ID).parentNode.removeChild($('list_tr_'+CAL_ID));
   }
   else if($('div_'+CAL_ID))
   {
      $('div_'+CAL_ID).parentNode.removeChild($('div_'+CAL_ID));
   }
   hideMenu();
   if(from==1)
   {
     HideDialog('form_div');
   }
   
}
function del_cal_pi(CAL_ID,from,IS_MAIN)
{   
   var url='delete.php?CAL_ID='+CAL_ID+'&OVER_STATUS='+document.form1.OVER_STATUS.value+'&YEAR='+document.form1.YEAR.value+'&MONTH='+document.form1.MONTH.value+'&DAY='+document.form1.DAY.value+'&IS_MAIN='+IS_MAIN;
   if(document.form1.DEPT_ID) url+='&DEPT_ID='+document.form1.DEPT_ID.value;
   if(document.form1.USER_ID) url+='&USER_ID='+document.form1.USER_ID.value;
   if(window.confirm(td_lang.inc.msg_14))//"删除后将不可恢复,如果是批量安排的日程将会批量删除，确定删除吗？"
      location=url;
   if(from==1)
   {
     HideDialog('form_div');
   }
}
function del_aff_new(AFF_ID,from,IS_MAIN)
{
   var url='../info/delete.php?AFF_ID='+AFF_ID+'&FROM='+from+'&IS_MAIN='+IS_MAIN;
   if(window.confirm(td_lang.inc.msg_15))//"删除后将不可恢复，如果是批s量安排的事务将会批量删除，确定删除吗？"
      location=url;
   if(from==1)
   {
     HideDialog('form_div');
   }
}
function del_aff_new_arr(AFF_ID,from,IS_MAIN)
{
   var url='delete_aff.php?AFF_ID='+AFF_ID+'&FROM='+from+'&IS_MAIN='+IS_MAIN;
   if(window.confirm(td_lang.inc.msg_13))//"删除后将不可恢复，确定删除吗？"
      location=url;
   if(from==1)
   {
     HideDialog('form_div');
   }
}
function del_task_new(TASK_ID,from,FLAG,IS_MAIN)
{ 
   var url='../task/delete.php?TASK_ID='+TASK_ID+'&FROM='+from+'&FLAG='+FLAG+'&IS_MAIN='+IS_MAIN;
   if(FLAG==1)
       message=td_lang.inc.msg_16;  //"删除后将不可恢复，如果是批量安排的任务将会批量删除，确定删除吗？"
    else
       message=td_lang.inc.msg_13;	
   	if(window.confirm(message))
    location=url;
    if(from==1)
   {
     HideDialog('form_div');
   }
}
function del_aff(AFF_ID)
{
   var url='delete.php?AFF_ID='+AFF_ID+'&OVER_STATUS='+document.form1.OVER_STATUS.value+'&YEAR='+document.form1.YEAR.value+'&MONTH='+document.form1.MONTH.value+'&DAY='+document.form1.DAY.value;
   if(document.form1.DEPT_ID) url+='&DEPT_ID='+document.form1.DEPT_ID.value;
   if(document.form1.USER_ID) url+='&USER_ID='+document.form1.USER_ID.value;
   if(window.confirm(td_lang.inc.msg_15))//"删除后将不可恢复，如果是批量安排的事务将会批量删除，确定删除吗？"
      location=url;
}

function del_task(TASK_ID)
{
   var url='../task/delete.php?TASK_ID='+TASK_ID+'&FLAG=info&OVER_STATUS='+document.form1.OVER_STATUS.value+'&YEAR='+document.form1.YEAR.value+'&MONTH='+document.form1.MONTH.value+'&DAY='+document.form1.DAY.value;
   if(document.form1.DEPT_ID) url+='&DEPT_ID='+document.form1.DEPT_ID.value;
   if(document.form1.USER_ID) url+='&USER_ID='+document.form1.USER_ID.value;
   if(window.confirm(td_lang.inc.msg_17))//"删除后将不可恢复，确定删除吗？"
      location=url;
}

function new_arrange(USER_ID, CAL_TIME, TIME_DIFF)
{
   //window.open('new_affair.php?USER_ID='+USER_ID+'&CAL_TIME='+CAL_TIME+'&TIME_DIFF='+TIME_DIFF,'oa_sub_window','height=350,width=500,status=0,toolbar=no,menubar=no,location=no,left=300,top=200,scrollbars=yes,resizable=yes');
   window.open('index_new.php?USER_ID='+USER_ID+'&CAL_TIME='+CAL_TIME+'&TIME_DIFF='+TIME_DIFF,'oa_sub_window','height=520,width=720,status=0,toolbar=no,menubar=no,location=no,left=300,top=100,scrollbars=yes,resizable=yes');
}

function set_status(obj, id)
{
	
   var status = $('cal_' + id).getAttribute('status');
   if(status == "1")
   {
      status = '0';
      $('cal_' + id).style.color = "#0000FF";  
      obj.value = td_lang.inc.msg_18;//"完成"
   }
   else
   {
      status = '1';
      $('cal_' + id).style.color = "#00AA00";
      obj.value = td_lang.inc.msg_19;//"未完成"
   }
   
   $('cal_' + id).setAttribute('status', status);
   _get("status.php", "CAL_ID="+id+"&OVER_STATUS="+status);
}
function set_status1(obj, id)
{
	
   var status = $('cal_' + id).getAttribute('status');
   if(status == "1")
   {
      status = '0';
      $('cal_' + id).style.color = "#0000FF";
      obj.innerText = td_lang.inc.msg_18;//"完成"
      
   }
   else
   {
      status = '1';
      $('cal_' + id).style.color = "#00AA00";
      obj.innerText = td_lang.inc.msg_19;//"未完成"
   }
   
   $('cal_' + id).setAttribute('status', status);
   _get("status.php", "CAL_ID="+id+"&OVER_STATUS="+status);
}
function set_status_note(obj,id,IS_MAIN)
{
   var status = $('cal_' + id).getAttribute('status');
   if(status == "1")
   {
      status = '0';
      $('cal_' + id).style.color = "#0000FF";
      obj.value = td_lang.inc.msg_18;//"完成"
   }
   else
   {
   	  status = '1';
      $('cal_' + id).style.color = "#00AA00";
      obj.value = td_lang.inc.msg_19;//"未完成"
   }
   
   $('cal_' + id).setAttribute('status', status);
   _get("status.php", "CAL_ID="+id+"&OVER_STATUS="+status+"&IS_MAIN="+IS_MAIN,function(req){
   	if(req.responseText == 1){
   		//success
   		_get("note.php", "CAL_ID="+id+"&AJAX=1&IS_MAIN="+IS_MAIN,load_form);
   	}
  	});
   
}

function CheckCalForm()
{
   if(document.new_cal_form.CONTENT.value=="")
   { 
   	alert(td_lang.inc.msg_20);//"事务内容不能为空！"
   	document.new_cal_form.CONTENT.focus();
     return (false);
   }
   return (true);
}

function cal_alert(msg)
{
   alert(msg);
}
function aa(drag,selectItemId)
{
	HideDialog('form_div');
	
		if(drag==1){
			jQuery("#"+selectItemId).remove();	
	}
	else
  { 	
  jQuery("td").css("background-color","");
  } 
}
function close_modify(drag)
{
	HideDialog('form_div');
	if(drag==2){
		var handle = window.lastDrag.handle;
		handle.animate({top: 0,left: 0},500);
	}
}
function cancelevent(event)
{
		event.cancelBubble = true;
   
}

var ActivityHelper = function(config){
	this.renderTo = config.renderTo;//该控件将要添加到的元素的ID
	this.init();
}
ActivityHelper.prototype = {
	init : function(){
		var entity = this;
		if(entity.renderTo==""||entity.renderTo==null){
			alert('请配置renderTo属性!!');
			return;
		}		
		//初始化周视图
		entity.initWeekView();

	},
	stopmouse:function(){
     this.stop=1;
     this.clearPress && this.clearPress();
 	},
 	startmouse:function(){
     this.stop="";
 	},
	//初始化周视图
	initWeekView : function(){
			var entity = this;
		jQuery(".TableBlock").appendTo(jQuery("#"+entity.renderTo));
	    jQuery(".week_view").click(function(){
				entity.initWeekView();
			});
			 jQuery(".day_view").click(function(){
				entity.initWeekView();
		
			});
		
		//为每个时间单元格添加点击事件
		jQuery("td.timeItem").click(function(){
			if(entity.stop==1)
				return;
			//entity.clear();
			var id = parseInt(jQuery(this).parent().attr("id"));
			var td_id=jQuery(this).attr("id").substr(3); //单元格代表的时间戳
			var ds = getLocalTime(td_id);
			var startTime = entity.idToTime(id);
			var endTime = entity.idToTime(id+1);
			//创建一个selectItem
			var selectItemId = entity.selectItem();
			var tdInfo = entity.getTdInfo(jQuery(this));
			if(tdInfo==null){
				alert("获得时间信息失败");
				return;
			}
			//设置位置及大小
			jQuery("#"+selectItemId).css({left:tdInfo.left+'px',top:tdInfo.top-3+'px'});
			jQuery("#"+selectItemId).width(tdInfo.width+6);
			jQuery("#"+selectItemId+" .content").height(tdInfo.height-3-15+10);
			jQuery("#"+selectItemId+" .head").text(startTime.fullTime+"-"+endTime.fullTime);
			//组织要保存的时间信息
			//var today = items[tdInfo.index];
			var timeParam = {};
			timeParam.startDate = ds;
			timeParam.endDate = ds;
			timeParam.startTime = startTime;
			timeParam.endTime = endTime;
			entity.timeParam = timeParam;
		  var stime=timeParam.startDate[0]+"-"+timeParam.startDate[1]+"-"+timeParam.startDate[2]+" "+startTime.fullTime+":00";
		  var etime=timeParam.startDate[0]+"-"+timeParam.startDate[1]+"-"+timeParam.startDate[2]+" "+endTime.fullTime+":00";
			entity.activityAddItem(stime,etime,selectItemId);  //创建打开的窗口要传入开始时间、结束时间
		});
		//添加鼠标划选
		var isPress = false;
		this.clearPress = function(){
			isPress = false; 
		};
		var flag = 0;
		var timeParam = {};
		var selectItemId;
		var startTdInfo = null;
		jQuery("body").mousedown(function(e){
			if(entity.stop==1)
				return;
				//console.log(2);
			if(e.which!=1){
				return false;
			}
			isPress = true;
			flag = 0;
		}).mouseup(function(){
			if(entity.stop==1)
				return;
				//console.log(3);
			isPress = false;
			if(startTdInfo==null){
				return false;
			}

		  var timeTitle1 = timeParam.startDate[0]+"-"+timeParam.startDate[1]+"-"+timeParam.startDate[2]+" "+timeParam.startTime.fullTime+":00";
			var timetitle2 = timeParam.startDate[0]+"-"+timeParam.startDate[1]+"-"+timeParam.startDate[2]+" "+timeParam.endTime.fullTime+":00";
			entity.activityAddItem(timeTitle1,timetitle2,selectItemId);
			timeParam= {};
			startTdInfo = null;
		});
		jQuery("td.timeItem").mousemove(function(){
			if(entity.stop==1)
				return;
			if(isPress){
				if(flag==0){
					//创建一个div
					entity.clear();
					var id = parseInt(jQuery(this).parent().attr("id"));
				  var str_id=jQuery(this).attr("id").substr(3);	  
				  var dd = getLocalTime(str_id);
					var startTime = entity.idToTime(id);		
					var endTime = entity.idToTime(id+1);
					//创建一个selectItem
					selectItemId = entity.selectItem();
					var tdInfo = entity.getTdInfo(jQuery(this));
					startTdInfo = tdInfo;
					if(tdInfo==null){
						alert("获得时间信息失败");
						return;
					}
					startTdInfo.top = tdInfo.top;
					//设置位置及大小
			  	jQuery("#"+selectItemId).css({left:tdInfo.left+'px',top:tdInfo.top-3+'px'});
					jQuery("#"+selectItemId).width(tdInfo.width+6);
					jQuery("#"+selectItemId+" .content").height(tdInfo.height-3-15+10);
					jQuery("#"+selectItemId+" .head").text(startTime.fullTime+"-"+endTime.fullTime);
					//var today = ;
				  timeParam.startDate = dd;
					timeParam.endDate = dd;
					timeParam.startTime = startTime;
					timeParam.endTime = endTime;
					entity.timeParam = timeParam;
				}else if(flag==1){
					var id = parseInt(jQuery(this).parent().attr("id"));
					var endTime = entity.idToTime(id+1);
					var tdInfo = entity.getTdInfo(jQuery(this));
					var height = tdInfo.top-startTdInfo.top+tdInfo.height+1-3-3-15+10;
					jQuery("#"+selectItemId+" .content").height(height);
					timeParam.endTime = endTime;
					entity.timeParam = timeParam;
					//设置显示时间
					var time = entity.timeParam.startTime.fullTime+"-"+entity.timeParam.endTime.fullTime;
					if(entity.timeParam.startTime.fullTime==entity.timeParam.endTime.fullTime){
						time = entity.timeParam.startTime.fullTime;
					}
					
					jQuery("#"+selectItemId+" .head").text(time);
				}
				flag =1;
			}
		});
	},

	
	//创建一个鼠标选择框
	selectItem : function(){
		var entity = this;
		var id = this.random();
		var div = [];
			div.push('<div id="'+id+'" class="selectItem temp">');
			div.push('<table><tr><td class="TL"></td><td class="TC"></td><td class="TR"></td></tr></table>');
			div.push('<div id="head" class="head"></div>');
			div.push('<div id="content" class="content"><table><tr><td></td></tr></table></div>');
			div.push('<table><tr><td class="BL"></td><td class="BC"></td><td class="BR"></td></tr></table>');
			div.push('</div>');
			jQuery(div.join('')).appendTo(jQuery("#"+entity.renderTo));
		return id;	
	},

	//判断字符串是否为空
	isNull : function(data){
		if(data==""||data==null){
			return true;
		}else {
			return false;
		}
	},
	//根据传入的ID，计算离该ID最近的整数时间(整点或半点)
	idToTime : function(id){
		var entity = this;
		if(entity.isNull(id)){
			alert('id错误');
			return;
		}
		var hour = id;
		var second = parseInt(id)%1;
		//将计算结果组织成time对象
		var time = {};
		time.timeId = id;
		time.hour = parseInt(hour);
		if(parseInt(hour)<10)
			hour="0"+parseInt(hour);
		time.second = second;
		if(second==0){
			time.fullTime = hour+":00";
		}else if(second==1){
			time.fullTime = hour+":30";
		}
		return time;
	},
	//根据传入的时间字符串转换为可以用于绘制TD的相关属性
	strToTime : function(time){
		var entity = this;
		if(time==""||time==null){
			alert('时间错误');
			return;
		}
		//格式一般为yyyy-MM-dd HH:mm:ss
		time = time.replace("-0","-");
		var dateStr = time.replace(/[-:\s.]/g,",");//将字符串在中的- ： .字符进行替换，便于分割
		var dateArray = dateStr.split(",");
		var date;
		if(dateArray.length==3){
		date  = new Date(dateArray[0],parseInt(dateArray[1])-1,dateArray[2]);
		}else {
		date  = new Date(dateArray[0],parseInt(dateArray[1])-1,dateArray[2],dateArray[3],dateArray[4]);
		}
		var year = date.getFullYear();
		var month = parseInt(date.getMonth())+1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var dayOfThisWeek = date.getDay();
		var hour_id = parseInt(hour)*2;//根据小时计算出的ID
		var minute_id = parseInt(parseInt(minute)/30);//根据分钟计算出的ID
		var minute_px = parseInt(minute)%30;//根据分钟计算出偏移的像素值如：43计算出的偏移值为13。
		var timeTd = {};
			timeTd.year = year;
			timeTd.month = month;
			timeTd.day = day;
			timeTd.hour = hour;
			timeTd.minute = minute==0?'00':minute;
			timeTd.minutes = minute;
			timeTd.trId = hour_id+minute_id;
			timeTd.px = minute_px;
			timeTd.dayOfThisWeek = dayOfThisWeek;
		return timeTd;
	},
	//根据传入的TD对象，获得该元素的绝对位置以及宽和高等属性
	getTdInfo : function(item){
		var tdInfo = {};
		tdInfo.width = item.width();
		tdInfo.height = item.height();
		tdInfo.left = item.offset().left;
		tdInfo.top = item.offset().top;
		tdInfo.index = item.index()-1;
		return tdInfo;
	},
	//在周视图中，创建一个活动添加窗口
	activityAddItem : function(time,endtime,selectItemId){
		    new_cal(time,endtime,1,selectItemId);
	},

	//清除系统中的临时DIV
	clear:function(){
		//alert("aaaaa");
		jQuery(".temp").remove();
	},

	//用于系统中随机ID的生成
	random : function(){
		//首先产生一个1000以内的随机数
		var r = Math.round(Math.random()*1000);
		//获得当前的日期
		var date = new Date();
		var year = date.getYear();
		var month = date.getMonth();
		var day = date.getDate();
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var seconds = date.getSeconds();
		//根据日期+随机数生成一个随机ID
		return 'id_'+year+month+day+minutes+seconds+r;
	}
}
function getLocalTime(nS) {  
				var d = new Date(parseInt(nS) * 1000);
				var year = d.getFullYear();
				var month = d.getMonth()+1;
				var day = d.getDate();
				var hour = d.getHours();
				var minute = d.getMinutes();
				var second = d.getSeconds();
				if(month<10)
					month="0"+month;
			  if(day<10)
					day="0"+day;
				var arr = new Array();
				arr[0] = year;
				arr[1] = month;
			  arr[2] = day;
				return arr;//+' '+hour+":"+minute+":"+second;
        
    }  
  