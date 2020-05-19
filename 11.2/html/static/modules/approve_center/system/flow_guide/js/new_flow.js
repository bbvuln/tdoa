jQuery(document).ready(function()
{
	jQuery("a[data-toggle='tab']").parent().click(function(){
		var href_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		return checkEssentialInfo();
	});
	jQuery("#FORM_ID").combobox();//给表单下拉选项进行控件的处理
		jQuery("#flow_name").val(FORM_NAME); //给控件处理后的表单input 赋值
	jQuery("#flow_name").css('width',170);
	loadTableList('next_step_tab','left');//加载扩展字段左侧
	loadTableList('alternative_tab','right');//加载扩展字段右侧
	getStepName('new','step_val','flow_name','hidId');	//页面流程名称的提示
	checkIsChecked('FLOW_SORT',FLOW_SORT,'select');
	checkIsChecked('FORM_ID',FORM_ID,'select');
	checkIsChecked('FREE_OTHER',FREE_OTHER,'select');
	checkIsChecked('FLOW_TYPE',FLOW_TYPE,'select');
	checkIsChecked('DEPT_ID',DEPT_ID,'select');
	checkIsChecked('AUTO_EDIT',AUTO_EDIT,'select');	
	checkIsChecked('FREE_PRESET',FREE_PRESET,'radio');
	checkIsChecked('FLOW_DOC',FLOW_DOC,'radio');
	checkIsChecked('IS_VERSION',IS_VERSION,'radio');
	checkIsChecked('IS_FORM_VERSION',IS_FORM_VERSION,'radio');
	checkIsChecked('IS_MOBILE_PROCESS',IS_MOBILE_PROCESS,'radio');
	checkIsChecked('FREE_BACK',FREE_BACK,'radio');
	if(FLOW_READ_ONLY==1){
		jQuery('#FORM_ID').attr('disabled',true);//当该流程下有工作的时候 表单的选择字段 diabled
		jQuery('#FLOW_TYPE').attr('disabled',true);//当该流程下有工作的时候 流程类型的选择字段为 diabled
		jQuery('.ui-combobox').attr('disabled',true);
		jQuery("#flow_name").attr('disabled',true);
		jQuery("#flow_name").css('background-color','#eeeeee');
		jQuery(".dropdown-toggle").attr('disabled',true);
	}
	if(jQuery('#MODIFY_TYPE').val() == "COPY")
	{
		jQuery('#FLOW_TYPE').attr('disabled',false);
		
		jQuery('#FORM_ID').attr('disabled',true);//当该流程下有工作的时候 表单的选择字段 diabled
		jQuery('.ui-combobox').attr('disabled',true);
		jQuery("#flow_name").attr('disabled',true);
		jQuery("#flow_name").css('background-color','#eeeeee');
		jQuery(".dropdown-toggle").attr('disabled',true);
	}
	if(VIEW_PRIV=='1')
	{
        jQuery('#view_user').show();
        jQuery('#view_dept').show();
        jQuery('#view_role').show();
        jQuery('#view_check').show();
        jQuery('#view_content').show();
	}
	var FLOW_EXTERNAL = jQuery('input[name="FLOW_EXTERNAL"]:checked').val();
	if(FLOW_EXTERNAL == 1)
	{
		jQuery('#ext_user').show();
	}
	if(jQuery('#FLOW_TYPE').val()=='2')
	{
		jQuery('#FREE_SET').show();
		jQuery('#FREE_BACK').show();
	}
	if(parseInt(jQuery('#AUTO_EDIT').val())>1)
	{
		jQuery('#force').show();
	}   
	jQuery(window).resize(function(){
		jQuery('#nav-right-container').css('height',getMainDivHeight());
	});
	jQuery(window).trigger('resize');
		
//------点击左侧导航控制的显示与隐藏------	
	var objli=jQuery('#nav_left').find('li');
	jQuery(document).on("click", objli, function(){
		showPic();
		showbtn();
	});
//-------流程类型控制的显示与隐藏---
	jQuery('#FLOW_TYPE').change(function(){
		var thisValue=jQuery(this).val();
		if(thisValue=='2'){
			jQuery('#FREE_SET').show();
			jQuery('#FREE_BACK').show();
		}else{
			jQuery('#FREE_SET').hide();
			jQuery('#FREE_BACK').hide();
		}
	});
//---------传阅人的显示与隐藏------	
	jQuery('[name="VIEW_PRIV"]').click(function(){
		var val=jQuery(this).val();
		if(val=='1')
		{
			jQuery('#view_user').show();
			jQuery('#view_dept').show();
			jQuery('#view_role').show();
			jQuery('#view_check').show();
			jQuery('#view_content').show();
		}else
		{
			jQuery('#view_user').hide();
			jQuery('#view_dept').hide();
			jQuery('#view_role').hide();
			jQuery('#view_check').hide();
			jQuery('#view_content').hide();
		}
	});
	//---外部流转允许接收人员、部门、角色---
	jQuery('[name="FLOW_EXTERNAL"]').click(function(){
		var val=jQuery(this).val();
		if(val=='1')
		{
			jQuery('#ext_user').show();
		}else
		{
			jQuery('#ext_user').hide();
		}
	});
    changeFormSelectDivDisplay();
	jQuery('.add_field').click(function(){
		var autoName = jQuery('input[name="AUTO_NAME"]').val();
		var addSelect = jQuery('#FORM_FIELD').find('option:selected').text();
		if(addSelect != '')
		{
			autoName += '{F'+addSelect+'R}';
			jQuery('input[name="AUTO_NAME"]').val(autoName);
		}
		jQuery('input[name="AUTO_NAME"]').focus();
		alert('添加成功');
	});
});
//---------------doucument下的方法执行完毕--------------


function is_force()
{
	var val=jQuery('#AUTO_EDIT').val();
	if(parseInt(val)>1){
		jQuery('[name="force"]').show();
	}else{
		jQuery('[name="force"]').hide();
	}
}
function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var bottomHeight=jQuery('.work_bottom').outerHeight(true);
	var MainDivHeight=windowsHeight-(25+bottomHeight+20);
	return MainDivHeight;
}
function showIntro(obj,objIntro,topHeight,leftHeight)
{
	var offset=obj.offset();
	var left=offset.left;
	var top=offset.top;
	objIntro.css('position','absolute').css('top',top+topHeight).css('left',left+leftHeight).css('border','1px solid #a5a28a');	
}

function showTitle(tipId,introId,topHeight,leftHeight)
{
	var obj=jQuery('#'+tipId);
	var objIntro=jQuery('#'+introId);
	showIntro(obj,objIntro,topHeight,leftHeight);
	objIntro.toggle();
}
//----------灯泡弹出div提示结束

function closeTip(tipId)
{
	var obj=jQuery('#'+tipId);
	obj.hide();
}
//-------根据表单流程名称 显示流程名称
function getStepName(type,id,contentId,hidId)
{
	if(type=='new'){
		jQuery('#'+id).blur(function(){
			var hidVal=jQuery('#'+hidId).val();
			var inputVal=jQuery(this).val();
			if( inputVal!==''){
				var newContent=inputVal;
			}else{
				newContent='';
			}
            if(newContent.length > 20){
                newContent = newContent.substring(0, 20) + '…';
            }
			jQuery('.'+contentId).html( newContent);
		});
	}	
}
//------------选择表单的判断---
function formView()
{
	var FORM_ID = jQuery("#FORM_ID").val();
	var form_name=jQuery("#flow_name").val();
	
	if(form_name ==''){
		alert(td_lang.system.workflow.msg_20);
		return false;
	}
	var url = "/general/approve_center/form_view.php?FORM_ID="+FORM_ID;
	window.open(url,"_blank");
}	
//------根据表单的id获得----获得对应备选的字段

function getFormField(){
	var old_form_id=jQuery("#old_form_id").val();//隐藏域存的是以前的表单id
	var FORM_ID = jQuery("#FORM_ID").val();//当前获得的表单的id
	if(old_form_id!==FORM_ID){//两个表单不相等时加载ajax
		var func="selectTr(this,'next_step_tab','alternative_tab','left_btn','right_btn');";//拼接click方法
		/*jQuery.ajax({
				url: "getFormFieldJson.php",
				data: "FORM_ID="+FORM_ID,
				type: "POST",
				async: true,
				success: function(data){
					var jsonData =jQuery.parseJSON(data);
					jQuery("#alternative_tab").find('tbody').html("");
					jQuery("#next_step_tab").find('tbody').html("");//清空原有的字段
					jQuery.each(jsonData,function(i,t){
						var html='<tr class="alternative_step" ><td class="step" style="padding-left: 20px;"  name='+t+'>'+t+'</td></tr>';
						jQuery("#alternative_tab").append(html);
					});
				},
				error: function(data){
					alert(data.responseText);
				}
		});*/
	}else{//如果两者相等 刷新当前页面 用来保存原来的数据显示
		loadTableList('next_step_tab','left');
		loadTableList('alternative_tab','right');
	}
};
//-----下载附件
function InsertImage(src)
{
   AddImage2Editor('CONTENT', src);
}
//--------删除附件
function delete_attach(ele,ATTACHMENT_ID,ATTACHMENT_NAME)
{
	var FLOW_ID = jQuery('#FLOW_ID').val();
	var SORT_ID = jQuery('#SORT_ID').val();
	var msg = sprintf(msg_tip, ATTACHMENT_NAME);
	if(window.confirm(msg))
	{
	  URL="delete_attach.php?ATTACHMENT_ID="+ATTACHMENT_ID+"&ATTACHMENT_NAME="+URLSpecialChars(ATTACHMENT_NAME)+"&FLOW_ID="+FLOW_ID+"&SORT_ID="+SORT_ID;
	  jQuery.get(URL,'',function(data){
		  if(data=='true')
		  {
              var id_arr = jQuery('#ATTACHMENT_ID_OLD').val().split(',');
              var name_arr = jQuery('#ATTACHMENT_NAME_OLD').val().split('*');
              for(var i in id_arr){
                  if(id_arr[i] == ATTACHMENT_ID){
                      id_arr.splice(i, 1);
                      name_arr.splice(i, 1);
                  }
              }
              jQuery('#ATTACHMENT_ID_OLD').val(id_arr.join(','));
              jQuery('#ATTACHMENT_NAME_OLD').val(name_arr.join('*'));
              jQuery(ele).parent().prev().remove();
              jQuery(ele).parent().remove();
		  }
	  });
	  
	}
}
//--------编辑时候选中默认的下拉框-----
function checkIsChecked(id,value,type)
{
	if(type=='select')//代表处理select的选中
	{
		var obj=jQuery('#'+id+' option[value='+value+']');
		obj.attr('selected',true);
	}else if(type=='radio')
	{
		 obj=jQuery('[name='+id+'][value='+value+']');
		 obj.attr('checked','checked');
	}
	
}

//流程编辑 新建 判断 以及处理-----------
function check_flow_type()
{
	var flow_name= jQuery('#step_val').val().trim();
	if( flow_name=='')
	{
		alert(td_lang.system.workflow.msg_19);
		jQuery('#step_val').focus();
		return false;
	}
	
	var flow_sort=jQuery('#FLOW_SORT').val();
	if( flow_sort == '' )
	{
		alert(td_lang.system.workflow.msg_21);
		jQuery('#FLOW_SORT').focus();
		return false;
	}
	if( flow_sort == null )
	{
		alert(td_lang.general.workflow.msg_77);
		jQuery('#FLOW_SORT').focus();
		return false;
	}

    var form_type = jQuery('[name="FORM_TYPE"]:checked').val();
	var form=jQuery("#flow_name").val();
	if( form_type == 2 && form=='')
	{
		alert(td_lang.system.workflow.msg_20);
		jQuery('#FORM_ID').focus();
		return false;
	}
	var flow_type=jQuery('#FLOW_TYPE').val();
	if( flow_type=='')
	{
		alert(td_lang.system.workflow.msg_22);
		jQuery('#FLOW_TYPE').focus();
		return false;
	}
	var flow_no=jQuery('#FLOW_NO').val();
	if(flow_no=='')
	{
		flow_no=0;
	}
	if(isInt(flow_no)==false){
		alert(td_lang.system.workflow.msg_23);
		jQuery('#FLOW_NO').focus();
		return false;
	}
	var AUTO_NUM=jQuery('#AUTO_NUM').val();
	if(AUTO_NUM=='')
	{
		AUTO_NUM=0;
	}
	if(isInt(AUTO_NUM)==false){
		alert(td_lang.system.workflow.msg_24);
		jQuery('#AUTO_NUM').focus();
		return false;
	}
	var AUTO_LEN=jQuery('#AUTO_LEN').val();
	if( AUTO_LEN=='')
	{
		AUTO_LEN=0;
	}
	if(isInt(AUTO_LEN)==false){
		alert(td_lang.system.workflow.msg_25);
		jQuery('#AUTO_LEN').focus();
		return false;
	}
	var td=jQuery('#next_step_tab').find('td');
	if(typeof(td)!==undefined)
	{
		var tdLength=td.length;
		var LIST_FLDS_STR= new Array();//列表扩展字段串查询页面仅查询该流程时生效
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(td[i]).text();
			LIST_FLDS_STR.push(option);
		}
		LIST_FLDS_STR=LIST_FLDS_STR.join(',')+',';
		jQuery('#LIST_FLDS_STR').val(LIST_FLDS_STR);//隐藏域赋值提交
	 }	
	 jQuery('#form').submit();
}
//------页面关闭按钮的处理----------
function close_flow()
{
	var url=jQuery('#close_url').val();
	var flow_name= jQuery('#step_val').val();
	var form=jQuery('#FORM_ID').val();
	window.location.href=url;
//	if(flow_name!=''&form!=''){
//		if(confirm(td_lang.general.workflow.msg_187)){
//			jQuery('#form').submit();
//		}else{
//			window.location.href=url;
//		}
//	}else{
//		
//	}
}
//-----判断类型是不是整形--------------
function isInt(str)
{
	var reg = /^(-|\+)?\d+$/;
	return reg.test(str);
}

//------关于加载页面的 php处理 方法
function loadTableList(id,type)
{
	var FLOW_ID = jQuery('#FLOW_ID').val();
	if(type=='left')
	 {
		 jQuery('#'+id).find('tbody').load('new_flow/leftTable.php?FLOW_ID='+FLOW_ID,function(){}); 
	 }
	 if(type=='right')
	 {
		 jQuery('#'+id).find('tbody').load('new_flow/rightTable.php?FLOW_ID='+FLOW_ID,function(){}); 
	 }
}


//-----必需字段的检查判断------
function checkEssentialInfo()
{
	var flow_name= jQuery('#step_val').val().trim();
	if( flow_name=='')
	{
		alert(td_lang.system.workflow.msg_19);
		jQuery('#step_val').focus();
		return false;
	}
	//var form=jQuery("#flow_name").val();;
	//if( form=='')
	//{
	//	alert(td_lang.system.workflow.msg_20);
	//	jQuery('#FORM_ID').focus();
	//	return false;
	//}
	var flow_sort=jQuery('#FLOW_SORT').val();
	if( flow_sort == '' )
	{
		alert(td_lang.system.workflow.msg_21);
		jQuery('#FLOW_SORT').focus();
		return false;
	}
	if( flow_sort == null )
	{
		alert(td_lang.general.workflow.msg_77);
		jQuery('#FLOW_SORT').focus();
		return false;
	}
	var flow_type=jQuery('#FLOW_TYPE').val();
	if( flow_type=='')
	{
		alert(td_lang.system.workflow.msg_22);
		jQuery('#FLOW_TYPE').focus();
		return false;
	}
	var flow_no=jQuery('#FLOW_NO').val();
	if(flow_no=='')
	{
		flow_no=0;
	}
	if(isInt(flow_no)==false){
		alert(td_lang.system.workflow.msg_23);
		jQuery('#FLOW_NO').focus();
		return false;
	}
	var AUTO_NUM=jQuery('#AUTO_NUM').val();
	if(AUTO_NUM=='')
	{
		AUTO_NUM=0;
	}
	if(isInt(AUTO_NUM)==false){
		alert(td_lang.system.workflow.msg_24);
		jQuery('#AUTO_NUM').focus();
		return false;
	}
	var AUTO_LEN=jQuery('#AUTO_LEN').val();
	if( AUTO_LEN=='')
	{
		AUTO_LEN=0;
	}
	if(isInt(AUTO_LEN)==false){
		alert(td_lang.system.workflow.msg_25);
		jQuery('#AUTO_LEN').focus();
		return false;
	}
}
function extUserSelect()
{
	var flowExternalVal = jQuery('input[name="FLOW_EXTERNAL"]:checked').val();
	if(flowExternalVal == 1)
	{
		jQuery('#main_and_exp_1').show();
	}else
	{
		jQuery('#main_and_exp_1').hide();
	}
}
//添加经办人主办人
function LoadWindowBasis()
{
	// var URL="/module/user_select/?FUNC_ID=5&MODULE_ID=&TO_ID=COPY_TO_ID&TO_NAME=COPY_TO_NAME&MANAGE_FLAG=&FORM_NAME=flow_step_define&USE_UID=undefined&NOTLOGIN_FLAG=undefined";
	var URL="/general/system/workflow/flow_guide/flow_type/flow_design/view_list/user_select/?&TO_ID_OP=CHILD_AUTO_USER_OP&TO_NAME_OP=CHILD_AUTO_USER_OP_NAME&TO_ID=CHILD_AUTO_USER&TO_NAME=CHILD_AUTO_USER_NAME";
    loc_y=loc_x=200;
    if(is_ie)
    {
        loc_x=document.body.scrollLeft+event.clientX-event.offsetX;
        loc_y=document.body.scrollTop+event.clientY-event.offsetY;
    }
     window.open(URL,"user_select","height=400,width=400,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top="+200+",left="+800+",resizable=yes");
}

/**
 * 根据表单类型改变表单显示还是隐藏
 * @return {[type]} [description]
 */
function changeFormSelectDivDisplay()
{
    var form_type_val = jQuery('[name="FORM_TYPE"]:checked').val();
    if(form_type_val == 0 || form_type_val == 1)
    {
        jQuery('#form_select_div').hide();
    }
    else
    {
        jQuery('#form_select_div').show();
    }
}