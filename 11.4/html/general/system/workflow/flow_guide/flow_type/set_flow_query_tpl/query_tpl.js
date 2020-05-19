
function check_condition_formula(inputObj) {
	
	var formula = inputObj.value;
	var tmpLeftArray = formula.split("(");
	var tmpRightArray = formula.split(")");
	
	if (tmpLeftArray.length != tmpRightArray.length) {
	  alert(td_lang.system.workflow.msg_14);//"条件公式左右小括号个数不相等！"
	  return;
	}
	
	var tmpLeftArray = formula.split("[");
	var tmpRightArray = formula.split("]");
	
	if (tmpLeftArray.length != tmpRightArray.length) {
	  alert(td_lang.system.workflow.msg_15);//"条件公式左右中括号个数不相等！"
	  return;
	}

	var tmpLeftArray = formula.split("{");
	var tmpRightArray = formula.split("}");
	
	if (tmpLeftArray.length != tmpRightArray.length) {
	  alert(td_lang.system.workflow.msg_16);//"条件公式左右大括号个数不相等！"
	  return;
	}

}


