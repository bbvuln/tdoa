jQuery(document).ready(function()
{
	jQuery("a[data-toggle='tab']").parent().click(function(){
		var href_id = jQuery('.active').parent().find("li[class$='active']").find("a").attr("href");
		return checkEssentialInfo();
	});
	jQuery("#FORM_ID").combobox();//��������ѡ����пؼ��Ĵ���
		jQuery("#flow_name").val(FORM_NAME); //���ؼ������ı�input ��ֵ
	jQuery("#flow_name").css('width',170);
	loadTableList('next_step_tab','left');//������չ�ֶ����
	loadTableList('alternative_tab','right');//������չ�ֶ��Ҳ�
	getStepName('new','step_val','flow_name','hidId');	//ҳ���������Ƶ���ʾ
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
		jQuery('#FORM_ID').attr('disabled',true);//�����������й�����ʱ�� ����ѡ���ֶ� diabled
		jQuery('#FLOW_TYPE').attr('disabled',true);//�����������й�����ʱ�� �������͵�ѡ���ֶ�Ϊ diabled
		jQuery('.ui-combobox').attr('disabled',true);
		jQuery("#flow_name").attr('disabled',true);
		jQuery("#flow_name").css('background-color','#eeeeee');
		jQuery(".dropdown-toggle").attr('disabled',true);
	}
	if(jQuery('#MODIFY_TYPE').val() == "COPY")
	{
		jQuery('#FLOW_TYPE').attr('disabled',false);
		
		jQuery('#FORM_ID').attr('disabled',true);//�����������й�����ʱ�� ����ѡ���ֶ� diabled
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
		
//------�����ർ�����Ƶ���ʾ������------	
	var objli=jQuery('#nav_left').find('li');
	jQuery(document).on("click", objli, function(){
		showPic();
		showbtn();
	});
//-------�������Ϳ��Ƶ���ʾ������---
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
//---------�����˵���ʾ������------	
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
	//---�ⲿ��ת���������Ա�����š���ɫ---
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
		alert('��ӳɹ�');
	});
});
//---------------doucument�µķ���ִ�����--------------


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
//----------���ݵ���div��ʾ����

function closeTip(tipId)
{
	var obj=jQuery('#'+tipId);
	obj.hide();
}
//-------���ݱ��������� ��ʾ��������
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
                newContent = newContent.substring(0, 20) + '��';
            }
			jQuery('.'+contentId).html( newContent);
		});
	}	
}
//------------ѡ������ж�---
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
//------���ݱ���id���----��ö�Ӧ��ѡ���ֶ�

function getFormField(){
	var old_form_id=jQuery("#old_form_id").val();//������������ǰ�ı�id
	var FORM_ID = jQuery("#FORM_ID").val();//��ǰ��õı���id
	if(old_form_id!==FORM_ID){//�����������ʱ����ajax
		var func="selectTr(this,'next_step_tab','alternative_tab','left_btn','right_btn');";//ƴ��click����
		/*jQuery.ajax({
				url: "getFormFieldJson.php",
				data: "FORM_ID="+FORM_ID,
				type: "POST",
				async: true,
				success: function(data){
					var jsonData =jQuery.parseJSON(data);
					jQuery("#alternative_tab").find('tbody').html("");
					jQuery("#next_step_tab").find('tbody').html("");//���ԭ�е��ֶ�
					jQuery.each(jsonData,function(i,t){
						var html='<tr class="alternative_step" ><td class="step" style="padding-left: 20px;"  name='+t+'>'+t+'</td></tr>';
						jQuery("#alternative_tab").append(html);
					});
				},
				error: function(data){
					alert(data.responseText);
				}
		});*/
	}else{//���������� ˢ�µ�ǰҳ�� ��������ԭ����������ʾ
		loadTableList('next_step_tab','left');
		loadTableList('alternative_tab','right');
	}
};
//-----���ظ���
function InsertImage(src)
{
   AddImage2Editor('CONTENT', src);
}
//--------ɾ������
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
//--------�༭ʱ��ѡ��Ĭ�ϵ�������-----
function checkIsChecked(id,value,type)
{
	if(type=='select')//������select��ѡ��
	{
		var obj=jQuery('#'+id+' option[value='+value+']');
		obj.attr('selected',true);
	}else if(type=='radio')
	{
		 obj=jQuery('[name='+id+'][value='+value+']');
		 obj.attr('checked','checked');
	}
	
}

//���̱༭ �½� �ж� �Լ�����-----------
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
		var LIST_FLDS_STR= new Array();//�б���չ�ֶδ���ѯҳ�����ѯ������ʱ��Ч
		for (i = 0; i < tdLength; i++)
		{
			option = jQuery(td[i]).text();
			LIST_FLDS_STR.push(option);
		}
		LIST_FLDS_STR=LIST_FLDS_STR.join(',')+',';
		jQuery('#LIST_FLDS_STR').val(LIST_FLDS_STR);//������ֵ�ύ
	 }	
	 jQuery('#form').submit();
}
//------ҳ��رհ�ť�Ĵ���----------
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
//-----�ж������ǲ�������--------------
function isInt(str)
{
	var reg = /^(-|\+)?\d+$/;
	return reg.test(str);
}

//------���ڼ���ҳ��� php���� ����
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


//-----�����ֶεļ���ж�------
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
//��Ӿ�����������
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
 * ���ݱ����͸ı����ʾ��������
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