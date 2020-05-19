function check(){
	var price_arr=$("input[name^='price']");
	var qty_arr=$("input[name^='qty']").not($("input[name^='qty_']"));
	var len=price_arr.length;
	for(var i=0; i < len ; i++){
		var product_id="product_id"+(i+1);
		var product_del="deleted"+(i+1)
		if($("#"+product_id).val()!="" && $("#"+product_del).val()!="1"){
			if($(qty_arr[i]).val()==""){
			alert(td_lang.crm.inc.msg_51);
			$(qty_arr[i]).focus();
			return false;
			}else{
				var re=/^(\+|-)?\d+$/;
				if(!re.test($(qty_arr[i]).val())){
					alert(td_lang.crm.inc.msg_52);
					$(qty_arr[i]).val("")
					$(qty_arr[i]).focus();
					return false;
				}
			}
			if($(price_arr[i]).val()==""){
				alert(td_lang.crm.inc.msg_53);
				$(price_arr[i]).focus();
				return false;
			}else{
				var re=/^([0-9]+|[0-9]{1,3}(,[0-9]{3})*)(.[0-9]{1,2})?$/;
				if(!re.test($(price_arr[i]).val())){
					alert(td_lang.crm.inc.msg_54);
					$(price_arr[i]).val("")
					$(price_arr[i]).focus();
					return false;
				}
			}
		}
	}
	return true;
}