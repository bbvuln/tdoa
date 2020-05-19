
/*
 *  ѡ�����е���
 */
function select_all(state){ 
	var objs = document.getElementsByTagName("input");
	for(var i=0; i<objs.length; i++){
		if(objs[i].type.toLowerCase() == "checkbox" 
				&& objs[i].name.toLowerCase() == "selected_id"){
			objs[i].checked = state;
		}
	}
}

/*
 *  �ж��������Ƿ��Ѿ�ȫ��ѡ��
 */
function is_all_select() {  //�ж��Ƿ�ȫѡ
	var objs = document.getElementsByTagName("input");
	for(var i=0; i<objs.length; i++) {
		if(objs[i].type.toLowerCase() == "checkbox" 
			&& objs[i].name.toLowerCase() == "selected_id"
			&& objs[i].checked == false){
			return false;
		}
	}
	return true;
}

function check_rcd_object(obj){
	if(obj.checked){
		if(is_all_select()){
			document.all.selectall.checked = true;
		}
	}else{
		document.all.selectall.checked = false;
	}
}

function get_select_id(){
	var objs = document.getElementsByTagName("input");
	var selectIdsObj = document.getElementById("selectIds")
	selectIdsObj.value = "";
	
	var count = 0;
	for(var i=0; i<objs.length; i++) {
		if(objs[i].type.toLowerCase() == "checkbox" 
			&& objs[i].name.toLowerCase() == "selected_id"
			&& objs[i].checked == true){
			count++;
			selectIdsObj.value += objs[i].value + ",";
		}
	}
	return count;
}

function col_select(){
	get_select_id();
	var selectIdsObj = getObj("selectIds");
	var id = selectIdsObj.value ;
	id = id.substr(0, id.length-1); //ȥ��ids�������","�� 
	selectIdsObj.value = id;
}

function use_selected(){
	var count = get_select_id();

	if(count == 0){
		alert(td_lang.crm.inc.msg_7);
		return false;
	}
	if(count > 1){
		alert(td_lang.crm.inc.msg_32);
		return false;
	}
	
	var selectIdsObj = getObj("selectIds");
	var id = selectIdsObj.value ;
	id = id.substr(0, id.length-1); //ȥ��ids�������","�� 
	selectIdsObj.value = id;
	return true;
}

function FinanceReceive(){
	var tid;
	if(use_selected()){
//		alert("./ajax_check/validate_contract.php?contract_id="+getObj('selectIds').value);
		ajax_check("./ajax_check/validate_contract.php?contract_id="+getObj('selectIds').value, "selectVal");
		for (var i=100; i<200; i++)
		{
			if (getObj('selectVal').value == '')
			{
				var tid = setTimeout("IfSend()", 100);
				i = i+101;
			}else{
				IfSend();
			}
		}
	}
}

function IfSend(){
		if (getObj('selectVal').value == 'true')
		{
			window.location='../FinanceReceive/Editview.php?contract_id='+getObj('selectIds').value;
		}else{
			getObj('selectVal').value = "";
			alert(td_lang.crm.inc.msg_33);
		}
}

/*
����ѡ�еļ�¼ ��Ҫ��֤.�����ǲ���Ҫ��֤��
��������,
	��һ����AJAX����Ӧҳ��,����ֵΪtrue��MSG:����ִ����ȥ��ԭ��.,
	�ڶ����Ƿ���ֵΪtrueʱ��Ҫ��ת����ҳ��
	��������true��false,true�������Ҽ����;
getObj('selectIds').value�������ֵ����ѡ������ݼ�¼��ID
eg1.
Selected_deal(
					 './ajax_check/validate_contract.php?remit_id='+getObj('selectIds').value, 
					 '../FinanceReceive/Editview.php?remit_id='+getObj('selectIds').value,
					 false
					 )
*/
//���������ڷ��Ҽ�ʹ��ʱ,����ִ�� col_select();
function Selected_deal(ajax_url, to_url, is_right_mouse){
	if(!is_right_mouse){
		if(use_selected()){
			ajax_check_result(ajax_url, to_url);
		}
	}else{
		ajax_check_result(ajax_url, to_url);
	}
}

function show_modeldio(is_right_mouse){
	if(!is_right_mouse){
		if(use_selected()){
			window.showModalDialog("choose_paytype.php",window,"dialogWidth=250px;dialogHeight=150px");
		}
	}
}


function Selected_no_deal(to_url, is_right_mouse){
	if(!is_right_mouse){
		if(use_selected()){
			window.location= to_url;
		}
	}else{
		window.location= to_url;
	}
}


function edit_selected(right){
	if(right == "" || typeof right == "undefined") right = false;
	if(right == false){
		if(use_selected()){
			window.location='./Editview.php?id='+getObj('selectIds').value+'&action=edit';
		}
	}else{
		window.location='./Editview.php?id='+getObj('selectIds').value+'&action=edit';
	}
}



function Detail_selected(){
	if(use_selected()){
		window.location='./menu/?id='+getObj('selectIds').value;
	}
}


function batch_edit_ids(right){//�����޸� 2010-5-4 10:14:05
	if(right == "" || typeof right == "undefined") right = false;
	if(right == false){
		col_select();
		if(getObj('selectIds').value == ""){
			alert(td_lang.crm.inc.msg_34);
		}else{
			window.location = 'EditBatch.php?id_str='+getObj('selectIds').value;
		}
	}else{
		window.location = 'EditBatch.php?id_str='+getObj('selectIds').value;
	}
}

function delete_ids(right){
	if(right == "" || typeof right == "undefined") right = false;
	if(right == false){
		col_select();
		if(getObj('selectIds').value == ""){
			alert(td_lang.crm.inc.msg_34);
		}else{
			var msg = td_lang.crm.inc.msg_35;
			if(confirm(msg)){
				window.location = './Delete.php?ids='+getObj('selectIds').value;
			}
		}
	}else{
		var msg = td_lang.crm.inc.msg_35;
		if(confirm(msg)){
			window.location = './Delete.php?ids='+getObj('selectIds').value;
		}
	}
}

		

function delete_selected(right){
	if(right || use_selected()){
		ajax_check("./ajax_check/check_modify.php?contract_id="+getObj('selectIds').value, "selectVal");
		for (var i=100; i<200; i++)
		{
			if (getObj('selectVal').value == '')
			{
				var tid = setTimeout("IfModify()", 100);
				i = i+101;
			}else{
				IfModify();
			}
		}
	}
}

function IfModify(){
		if (getObj('selectVal').value == 'true')
		{
			if(confirm(td_lang.crm.inc.msg_35)){
			window.location='./delete.php?id='+getObj('selectIds').value;
			}
		}else{
			getObj('selectVal').value = "";
			alert(td_lang.crm.inc.msg_36);
		}
}