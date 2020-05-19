function calcTotal(noCheck){
	var max_row_count = document.getElementById('prod_tb').rows.length;
	max_row_count = eval(max_row_count) - 2;	//Because the table has two header rows. so we will reduce two from row length

	var netprice = 0.00;				
	for(var i = 1; i <= max_row_count; i++){
		rowId = i;
		
		//Row be delelted could't be calulate.
		if(document.getElementById('deleted'+rowId).value == "0"){
			if(!noCheck){
				if( getObj("qty"+rowId).value !="" && !checkFloatData(getObj("qty"+rowId),getObj("qty"+rowId).value)){
					getObj("qty"+rowId).value = "";
					return false;
				}
				if( getObj("price"+rowId).value != "" && !checkFloatData(getObj("price"+rowId),getObj("price"+rowId).value)){
					getObj("price"+rowId).value = "";
					return false;
				}
			}
			var total = eval(getObj("qty"+rowId).value*getObj("price"+rowId).value);
			//var netprice = 0.0;
			if(document.getElementById('product_id'+rowId).value!=""){
				getObj("productTotal"+rowId).innerHTML=roundValue(total.toString());
			}
//			if(hasDiscount == true){
//				getObj("productTotal"+rowId).innerHTML=roundValue(total.toString())
//				var totalAfterDiscount = eval(total-document.getElementById("discountTotal"+rowId).innerHTML);
//				getObj("totalAfterDiscount"+rowId).innerHTML=roundValue(totalAfterDiscount.toString())
//				netprice = totalAfterDiscount;
//				getObj("netPrice"+rowId).innerHTML=roundValue(netprice.toString())
//			}else{
//				netprice = total;
//				getObj("netPrice"+rowId).innerHTML=roundValue(netprice.toString())
//			}
		}	
	}
	
	calcGrandTotal();
}
function calcGrandTotal(){
	var netTotal = 0.0, grandTotal = 0.0;
	var adjustment = 0.0, sh_amount = 0.0;
	
	var max_row_count = document.getElementById('prod_tb').rows.length;
	max_row_count = eval(max_row_count) - 2;	//Because the table has two header rows. so we will reduce two from row length
	
	
	//calculate net total
	for(var i = 1; i <= max_row_count; i++){
		rowId = i;
		//Row be delelted could't be calulate.
		if(document.getElementById('deleted'+rowId).value == "0"){
			if (document.getElementById("productTotal"+i).innerHTML==""){ 
				document.getElementById("productTotal"+i).innerHTML = 0.0;
			}
			if(!isNaN(document.getElementById("productTotal"+i).innerHTML)){
				netTotal += parseFloat(document.getElementById("productTotal"+i).innerHTML);
			}
		}
	}
	
	
	
	document.getElementById("grandTotal").innerHTML = roundValue(netTotal.toString());
	if(document.getElementById('order_amount')){
		document.getElementById('order_amount').readOnly = true;
		document.getElementById('order_amount').value = document.getElementById("grandTotal").innerHTML;
	}
	if(document.getElementById('quotation_amount')){
		document.getElementById('quotation_amount').readOnly = true;
		document.getElementById('quotation_amount').value = document.getElementById("grandTotal").innerHTML;
	}
	if(document.getElementById('purchase_amount')){
		document.getElementById('purchase_amount').readOnly = true;
		document.getElementById('purchase_amount').value = document.getElementById("grandTotal").innerHTML;
	}
	  
}
