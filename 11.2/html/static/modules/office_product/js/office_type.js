//定义模态窗口默认的大小  以及位置的调整
function open_bootcss_modal(modal_id,widths,tops)
{
	jQuery('#'+modal_id).modal
	({ 
		keyboard: false,
		backdrop:"static"
	}) 
	if(typeof(widths) == "undefined" || widths == "")
	{
		widths = 560;//设置默认的宽度
	}
	if(typeof(tops) == "undefined" || tops == "")
	{
		tops = 10;//设置距离上面的默认百分比
	}
	jQuery('#'+modal_id).css('width',widths+'px');//调整弹出窗口的宽度
    jQuery('#'+modal_id).css('margin-left',-(widths/2)+'px');//设置距左边的距离
	jQuery('#'+modal_id).css('top',tops+'%'); //设置距上部的距离
}

//加载模态窗口的处理-----
function edit_office_type(id)
{
	if(id=='')
	{
		jQuery('#do_type').text(td_lang.office_product.msg1);
	}else
	{
		jQuery('#do_type').text(td_lang.office_product.msg2);
	}
	open_bootcss_modal('myModal','900','0');//弹出窗口的设定
	jQuery('.modal-body').load('new_office.php?id='+id,function(){});
}
//办公用品库分类设置 加载模态窗口的处理-----
function edit_office_type2(type,id)
{
	if(type=='')
	{
		jQuery('#do_type').text('新建办公用品库分类');
	}else
	{
		jQuery('#do_type').text('编辑办公用品库分类');
	}
	open_bootcss_modal('myModal','560','0');//弹出窗口的设定
	jQuery('.modal-body').load('type_form.php?type='+type+'&id='+id,function(){});
}
//-----操作增加和编辑 以及必填字段的验证-----
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
					alert('办公用品库名称已存在');
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
					alert('办公用品库名称已存在');
					return false;
				}else{
					jQuery('#form1').submit();
				}
			}
		});
	}
	
}
//办公室用品库分类表单验证及提交
function check_type_form()
{
	var TYPE_NAME=jQuery('#TYPE_NAME').val();
	if(TYPE_NAME=='')
	{
		alert('办公用品物品分类名称不能为空！');
		return false;
	}
	var TYPE_ORDER=jQuery('#TYPE_ORDER').val();
	if(checknum(TYPE_ORDER) =="0")
	{
		alert('排序号应该为数字类型！');
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
					alert('办公用品库名称已存在');
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
					alert('办公用品库名称已存在');
					return false;
				}else{
					jQuery('#form2').submit();
				}
			}
		});
	}
}