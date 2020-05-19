jQuery(document).ready(function(){
	loadFormTable();
	jQuery(window).resize(function(){
		jQuery('#nav-right-container').css('height',getMainDivHeight());
	});
	jQuery(window).trigger('resize');
});
function loadFormTable()
{
	jQuery('#table_form').load('form/index.php',function(){});
	jQuery('#process_form').hide();	
	jQuery('#table_form').show();
}
function loadFlowTable()
{
	jQuery('#process_form').load('flow/index.php',function(){});
	jQuery('#table_form').hide();
	jQuery('#process_form').show();	
}
function edit_form_sort(id)
{
	if(id==0){
		jQuery('#do_type').text(td_lang.general.workflow.msg_73);
	}else{
		jQuery('#do_type').text(td_lang.general.workflow.msg_74);
	}	
	open_bootcss_modal('myModal','','0');//弹出窗口的设定
	jQuery('.modal-body').load('form/new_form.php?id='+id,function(){
		jQuery('#form_button_new').show();
		jQuery('#flow_button_new').hide();
	});	
}
function edit_flow_sort(id)
{
	if(id==0){
		jQuery('#do_type').text(td_lang.general.workflow.msg_75);
	}else{
		jQuery('#do_type').text(td_lang.general.workflow.msg_76);
	}	
	open_bootcss_modal('myModal','','0');//弹出窗口的设定
	jQuery('.modal-body').load('flow/new_flow.php?id='+id,function(){
		jQuery('#form_button_new').hide();
		jQuery('#flow_button_new').show();
	});		
}
function check_form()
{
		var sort_name=jQuery('#sort_name').val();
		var sort_no=jQuery('#sort_no').val();
		var sort_parent=jQuery('#sort_parent').val();
		var sort_old_parent=jQuery('#form_parent').val();
		var form_dept_id_old=jQuery('#FORM_DEPT_ID_OLD').val();
		var dept_id=jQuery('#dept_id').val();
		var have_child=jQuery('#form_child').val();
		var sort_id=jQuery('#form_id').val();
		var old_name=jQuery('#form_old_sort_name').val();
		if(sort_name==undefinedSort){
			alert(td_lang.general.workflow.msg_175);
			jQuery('#sort_name').val('');
			jQuery('#sort_name').focus();
			return false;
		}		
		if(sort_no==''){
			alert(td_lang.general.workflow.msg_77);
			jQuery('#sort_no').focus();
			return false;
		}
		if(sort_no.length>6)
		{
			alert(td_lang.general.workflow.msg_185);
			jQuery('#sort_no').val('');
			jQuery('#sort_no').focus();
			return false;
		}
		if(isInt(sort_no)==false){
			alert(td_lang.general.workflow.msg_78);
			jQuery('#sort_no').val('');
			jQuery('#sort_no').focus();
			return false;
		}
		if(sort_name==''){
			alert(td_lang.general.workflow.msg_79);
			jQuery('#sort_name').val('');
			jQuery('#sort_name').focus();
			return false;
		}
		if(sort_id=='0'){
			jQuery.post('form/check_name.php',{'sort_name':sort_name,'sort_parent':sort_parent},function(data){
				if(data=='1'){
					alert(td_lang.general.workflow.msg_84);
					jQuery('#sort_name').val('');
					jQuery('#sort_name').focus();
					return false;
				}else{
					jQuery.post('form/insert.php',{'sort_parent':sort_parent,'sort_no':sort_no,'sort_name':sort_name,'dept_id':dept_id,'form_dept_id_old':form_dept_id_old},function(data){
						if(data!=='0'){					
							jQuery('#table_form').load('form/index.php',function(){});
							//alert(td_lang.general.workflow.msg_85); //取消新建表单分类的提示
							jQuery('.close').click();	
						}
					});		
				}
			});	
		}else{
			if(old_name!==sort_name){
				jQuery.post('form/check_name.php',{'sort_name':sort_name,'sort_parent':sort_parent},function(data){
					if(data=='1'){
						alert(td_lang.general.workflow.msg_84);
						jQuery('#sort_name').val('');
						jQuery('#sort_name').focus();
						return false;
					}else{
						jQuery.post('form/update.php',{'sort_parent':sort_parent,'sort_no':sort_no,'sort_name':sort_name,'dept_id':dept_id,'sort_id':sort_id,'have_child':have_child,'form_parent':sort_old_parent,'form_dept_id_old':form_dept_id_old},function(data){
							jQuery('#table_form').load('form/index.php',function(){});
							//alert(td_lang.general.workflow.msg_86);//取消编辑表单分类的提示
							jQuery('.close').click();					
						});	
					}
				});
			}else{
				jQuery.post('form/update.php',{'sort_parent':sort_parent,'sort_no':sort_no,'sort_name':sort_name,'dept_id':dept_id,'sort_id':sort_id,'have_child':have_child,'form_parent':sort_old_parent,'form_dept_id_old':form_dept_id_old},function(data){
					if(data=='1'){
						alert(td_lang.general.workflow.msg_84);
						jQuery('#sort_name').val('');
						jQuery('#sort_name').focus();
					}else{
						jQuery('#table_form').load('form/index.php',function(){});
					//alert(td_lang.general.workflow.msg_86);
						jQuery('.close').click();
					}
				});	
			}
		}			
}
function check_flow()
{
	var sort_id=jQuery('#sort_id').val();
	var sort_parent=jQuery('#parent').val();
	var sort_old_parent=jQuery('#flow_parent').val();
	var sort_no=jQuery('#num').val();
	var flow_dept_id_old=jQuery('#FLOW_DEPT_ID_OLD').val();
	var sort_name=jQuery('#name').val();
	var dept_id=jQuery('#dept').val();
	var have_child=jQuery('#child').val();
	var old_name=jQuery('#flow_old_sort_name').val();
	if(sort_name==undefinedSort){
		alert(td_lang.general.workflow.msg_175);
		jQuery('#name').val('');
		jQuery('#name').focus();
		return false;
	}	
	if(sort_no==''){
		alert(td_lang.general.workflow.msg_80);
		jQuery('#num').focus();
		return false;
	}
	if(isInt(sort_no)==false){
		alert(td_lang.general.workflow.msg_81);
		jQuery('#num').val('');
		jQuery('#num').focus();
		return false;
	}
	if(sort_no.length>6){
		alert(td_lang.general.workflow.msg_186);
		jQuery('#num').val('');
		jQuery('#num').focus();
		return false;
	}
	if(sort_name==''){
		alert(td_lang.general.workflow.msg_82);
		jQuery('#name').val('');
		jQuery('#name').focus();
		return false;
	}
	if(sort_id=='0'){
		jQuery.post('flow/check_name.php',{'sort_name':sort_name,'sort_parent':sort_parent},function(data){
			if(data=='1'){		
				alert(td_lang.general.workflow.msg_84);
				jQuery('#name').val('');
				jQuery('#name').focus();
				return false;
			}else{
				jQuery.post('flow/insert.php',{'sort_parent':sort_parent,'sort_no':sort_no,'sort_name':sort_name,'dept_id':dept_id,'flow_dept_id_old':flow_dept_id_old},function(data){
					if(data!=='0'){					
						jQuery('#process_form').load('flow/index.php',function(){});
						//alert(td_lang.general.workflow.msg_87);//取消新建流程分类
						jQuery('.close').click();	
					}
				});			
			}			
		});		
	}else{
		if(old_name!==sort_name){
			jQuery.post('flow/check_name.php',{'sort_name':sort_name,'sort_parent':sort_parent},function(data){
				if(data=='1'){		
					alert(td_lang.general.workflow.msg_84);
					jQuery('#name').val('');
					jQuery('#name').focus();
					return false;
				}else{
					jQuery.post('flow/update.php',{'sort_parent':sort_parent,'sort_no':sort_no,'sort_name':sort_name,'dept_id':dept_id,'sort_id':sort_id,'have_child':have_child,'flow_parent':sort_old_parent,'flow_dept_id_old':flow_dept_id_old},function(data){
						jQuery('#process_form').load('flow/index.php',function(){});
						//alert(td_lang.general.workflow.msg_88);//取消编辑流程分类的提示
						jQuery('.close').click();						
					});	
				}			
			});
		}else{
			jQuery.post('flow/update.php',{'sort_parent':sort_parent,'sort_no':sort_no,'sort_name':sort_name,'dept_id':dept_id,'sort_id':sort_id,'have_child':have_child,'flow_parent':sort_old_parent,'flow_dept_id_old':flow_dept_id_old},function(data){
				if(data=='has'){
					alert(td_lang.general.workflow.msg_84);
					jQuery('#name').val('');
					jQuery('#name').focus();
					return false;
				}else{
					jQuery('#process_form').load('flow/index.php',function(){});
					//alert(td_lang.general.workflow.msg_88);//取消编辑流程分类的提示
					jQuery('.close').click();	
				}				
			});
		}
	}
}
function delete_form_sort(id,num,have,sort_parent)
{
	if(num!==0){
		jQuery('#table_form').load('form/index.php',function(){});
		alert(td_lang.general.workflow.msg_174);
		return false;
	}
	if(have=='1')
	{
		jQuery('#table_form').load('form/index.php',function(){});
		alert(td_lang.general.workflow.msg_183);
		return false;
	}
	if(confirm(td_lang.general.workflow.msg_57)){
		jQuery.post('form/delete.php',{'id':id,'sort_parent':sort_parent},function(data){
			if(data=='reload'){
				jQuery('#table_form').load('form/index.php',function(){});
			}
		});
	}	
}
function delete_flow_sort(id,num,have,sort_parent)
{
	if(num!==0){
		jQuery('#process_form').load('flow/index.php',function(){});
		alert(td_lang.general.workflow.msg_184);
		return false;
	}
	if(have=='1')
	{
		jQuery('#process_form').load('flow/index.php',function(){});
		alert(td_lang.general.workflow.msg_183);
		return false;
	}
	if(confirm(td_lang.general.workflow.msg_57)){
		jQuery.post('flow/delete.php',{'id':id,'sort_parent':sort_parent},function(){						
			//jQuery('#delete_flow_'+id+'').parent().parent().remove(); 
			jQuery('#process_form').load('flow/index.php',function(){});
		});
	}	
}
function isInt(str)
{
	var reg = /^(-|\+)?\d+$/;
	return reg.test(str);
}
function getMainDivHeight()
{
	var windowsHeight=jQuery(window).outerHeight(true);
	var MainDivHeight=windowsHeight-(20);
	return MainDivHeight;
}