
function check_condition_formula(inputObj) {
	
	var formula = inputObj.value;
	var tmpLeftArray = formula.split("(");
	var tmpRightArray = formula.split(")");
	
	if (tmpLeftArray.length != tmpRightArray.length) {
	  alert(td_lang.system.workflow.msg_14);//"������ʽ����С���Ÿ�������ȣ�"
	  return;
	}
	
	var tmpLeftArray = formula.split("[");
	var tmpRightArray = formula.split("]");
	
	if (tmpLeftArray.length != tmpRightArray.length) {
	  alert(td_lang.system.workflow.msg_15);//"������ʽ���������Ÿ�������ȣ�"
	  return;
	}

	var tmpLeftArray = formula.split("{");
	var tmpRightArray = formula.split("}");
	
	if (tmpLeftArray.length != tmpRightArray.length) {
	  alert(td_lang.system.workflow.msg_16);//"������ʽ���Ҵ����Ÿ�������ȣ�"
	  return;
	}

}


