//����ģ̬����Ĭ�ϵĴ�С  �Լ�λ�õĵ���
function open_bootcss_modal(modal_id,widths,tops)
{
	jQuery('#'+modal_id).modal
	({ 
		keyboard: false,
		backdrop:"static"
	}) 
	if(typeof(widths) == "undefined" || widths == "")
	{
		widths = 560;//����Ĭ�ϵĿ��
	}
	if(typeof(tops) == "undefined" || tops == "")
	{
		tops = 10;//���þ��������Ĭ�ϰٷֱ�
	}
	jQuery('#'+modal_id).css('width',widths+'px');//�����������ڵĿ��
    jQuery('#'+modal_id).css('margin-left',-(widths/2)+'px');//���þ���ߵľ���
	jQuery('#'+modal_id).css('top',tops+'%'); //���þ��ϲ��ľ���
}

//����ģ̬���ڵĴ���-----
function edit_office_type(id)
{
	if(id=='')
	{
		jQuery('#do_type').text(td_lang.office_product.msg1);
	}else
	{
		jQuery('#do_type').text(td_lang.office_product.msg2);
	}
	open_bootcss_modal('myModal','900','0');//�������ڵ��趨
	jQuery('.modal-body').load('new_office.php?id='+id,function(){});
}
//�칫��Ʒ��������� ����ģ̬���ڵĴ���-----
function edit_office_type2(type,id)
{
	if(type=='')
	{
		jQuery('#do_type').text('�½��칫��Ʒ�����');
	}else
	{
		jQuery('#do_type').text('�༭�칫��Ʒ�����');
	}
	open_bootcss_modal('myModal','560','0');//�������ڵ��趨
	jQuery('.modal-body').load('type_form.php?type='+type+'&id='+id,function(){});
}
//-----�������Ӻͱ༭ �Լ������ֶε���֤-----
function check_office_type()
{
	var DEPOSITORY_NAME=jQuery('#DEPOSITORY_NAME').val();
	if(DEPOSITORY_NAME=='')
	{
		alert(td_lang.office_product.msg4);
		jQuery('#DEPOSITORY_NAME').focus();
		return false;
	}
	var DEPT_NAME=jQuery('#DEPT_NAME').val();
	if(DEPT_NAME=='')
	{
		alert(td_lang.office_product.msg5);
		return false;
	}
	var MANAGER_NAME=jQuery('#MANAGER_NAME').val();
	if(MANAGER_NAME=='')
	{
		alert(td_lang.office_product.msg6);
		return false;
	}
	var PRO_KEEPER_NAME=jQuery('#PRO_KEEPER_NAME').val();
	if(PRO_KEEPER_NAME=='')
	{
		alert(td_lang.office_product.msg7);
		return false;
	}
	
	var id=jQuery('#id').val();
	if(id==''){
		jQuery.ajax({
			type: 'POST',
			url: '/inc/utility_office.php',
			cache: false,
			data: {'DEPOSITORY_NAME':DEPOSITORY_NAME,'action':'DEPOSITORY_NAME'},
			success: function(data)
			{
				if(data==1){
					alert('�칫��Ʒ�������Ѵ���');
					return false;
				}else{
					jQuery('#form1').submit();
				}
			}
		});
	}else{
		jQuery.ajax({
			type: 'POST',
			url: '/inc/utility_office.php',
			cache: false,
			data: {'DEPOSITORY_NAME':DEPOSITORY_NAME,'action':'DEPOSITORY_NAME','id':id},
			success: function(data)
			{
				if(data==1){
					alert('�칫��Ʒ�������Ѵ���');
					return false;
				}else{
					jQuery('#form1').submit();
				}
			}
		});
	}
	
}
//�칫����Ʒ��������֤���ύ
function check_type_form()
{
	var TYPE_NAME=jQuery('#TYPE_NAME').val();
	if(TYPE_NAME=='')
	{
		alert('�칫��Ʒ��Ʒ�������Ʋ���Ϊ�գ�');
		return false;
	}
	var TYPE_ORDER=jQuery('#TYPE_ORDER').val();
	if(checknum(TYPE_ORDER) =="0")
	{
		alert('�����Ӧ��Ϊ�������ͣ�');
		jQuery('#TYPE_ORDER').val('').focus();
		return false;
	}
	var id=jQuery('#id').val();
	if(id==''){
		jQuery.ajax({
			type: 'POST',
			url: '/inc/utility_office.php',
			cache: false,
			data: {'TYPE_NAME':TYPE_NAME,'action':'TYPE_NAME'},
			success: function(data)
			{
				if(data==1){
					alert('�칫��Ʒ�������Ѵ���');
					return false;
				}else{
					jQuery('#form2').submit();
				}
			}
		});
	}else{
		jQuery.ajax({
			type: 'POST',
			url: '/inc/utility_office.php',
			cache: false,
			data: {'TYPE_NAME':TYPE_NAME,'action':'TYPE_NAME','id':id},
			success: function(data)
			{
				if(data==1){
					alert('�칫��Ʒ�������Ѵ���');
					return false;
				}else{
					jQuery('#form2').submit();
				}
			}
		});
	}
}