function new_form_sort(){
	jQuery('#do_type').text('�½�������');
	jQuery('#do_type').attr('cate','form');
	jQuery('#myModal').modal({
		keyboard: false,
		backdrop:"static"
	});
	jQuery('.modal-body').load('form/new_form.php',function(){
		//jQuery('#forn_button_new').show();
	});	
}
function edit_form_sort(id){
	jQuery('#do_type').text('�༭������');
	jQuery('#do_type').attr('cate','form');
	jQuery('#myModal').modal({
		keyboard: false,
		backdrop:"static"
	});
	jQuery('.modal-body').load('form/new_form.php?id='+id,function(){
		//jQuery('#forn_button_new').show();
	});	
}
function new_flow_sort(){
	jQuery('#do_type').text('�½����̷���');
	jQuery('#do_type').attr('cate','flow');
	jQuery('#myModal').modal({
		keyboard: false,
		backdrop:"static"
	});
	jQuery('.modal-body').load('flow/new_flow.php',function(){
		//jQuery('#forn_button_new').show();
	});	
}
function edit_flow_sort(id){
	jQuery('#do_type').text('�༭���̷���');
	jQuery('#do_type').attr('cate','flow');
	jQuery('#myModal').modal({
		keyboard: false,
		backdrop:"static"
	});
	jQuery('.modal-body').load('flow/new_flow.php?id='+id,function(){
		//jQuery('#forn_button_new').show();
	});		
}
function check_form(){
		var category=jQuery('#do_type').attr('cate');
		if(category=='form'){
			var form=jQuery('.form_name').find('input').val();
			var form_num=jQuery('.form_order_num').find('input').val();
			if(form_num==''){
				alert('��������� ����Ϊ�գ�');
				return false;
			}
			if(isNaN(form_num)){
				alert('��������ű���Ϊ���֣�');
				return false;
			}
			if(form==''){
				alert('���������Ʋ���Ϊ�գ�');
				return false;
			}	
			$('#form').submit();
		}else if(category=='flow'){
			var flow=jQuery('.form_name').find('input').val();
			var flow_num=jQuery('.form_order_num').find('input').val();
			if(flow_num==''){
				alert('���̷������ ����Ϊ�գ�');
				return false;
			}
			if(isNaN(flow_num)){
				alert('���̷�����ű���Ϊ���֣�');
				return false;
			}
			if(flow==''){
				alert('���̷������Ʋ���Ϊ�գ�');
				return false;
			}	
			$('#flow').submit();
		}
}



