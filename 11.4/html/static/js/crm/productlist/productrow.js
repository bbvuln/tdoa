function productRow(parentObjName, rowObj, row_count){
    this.parentObjName =  parentObjName;
	this.rowObj        =  rowObj;				
	this.count         =  row_count;	
} 

productRow.prototype.addToolCell = function(){
    var cellObj = this.rowObj.insertCell(-1);
	var str = '';
    
	cellObj.className = 'crm_product_row ';
	cellObj.vAlign = 'top';

	if(this.count == 1){
		str = '&nbsp;';
	}else{
	    delfStr = "pList.delRow('" + this.count + "');";
		str ='<img src="' + CRM_CONTEXT_IMG_PATH + '/delete.gif" border=0 ' + 'onclick=\"' + delfStr + '\" title=\"'+td_lang.global.delete_1+'\">';
	}
	str += '<input id="deleted'    + this.count + '" ' + 'name="deleted'   + this.count + '" ' + 'type="hidden" value="0">';
	str += '<input id="main_id'    + this.count + '" ' + 'name="main_id'   + this.count + '" ' + 'type="hidden" value="">'; 
	str += '<input id="detail_id'  + this.count + '" ' + 'name="detail_id' + this.count + '" ' + 'type="hidden" value="">'; 

	cellObj.innerHTML = str;
}

productRow.prototype.addProductCell = function(field){
    var cellObj = this.rowObj.insertCell(-1);
	var str = '';
    
	var onClickStr = 'getObj(\'selectedRow\').value=' + this.count + '; '
				   + 'openWindow(\'/module/crm2010/product/select/index.php\',900, 550,\'select_product\')';

	cellObj.className = 'crm_product_row crm_small10 ';
	cellObj.vAlign = 'top';
	str = '<table border="0" cellpadding="1" cellspacing="0" width="100%">'
	    + '<tr><td class="small">'
		+ '<input id="' + field + this.count + '" '
		+ 'name="' + field + this.count + '" '
		+ 'class="crm_small10 efViewReadonlyBox efCtrlWidth75" value="" '
		+ 'readonly="readonly" type="text" style="width:80%">'
		+ '<input id="product_id' + this.count + '" '
		+ ' name="product_id' + this.count + '" ' 
		+ 'value="" type="hidden"><img src="' + CRM_CONTEXT_IMG_PATH + '/search.gif" '
		+ 'style="cursor: pointer;" onclick="' + onClickStr + '" '
		+ 'align="absmiddle">'
		+ '</td></tr>'
	str	+= '</table>';	
	cellObj.innerHTML = str;			  
}


productRow.prototype.addAmountCell = function(){
	var cellObj = this.rowObj.insertCell(-1);
	var calcTotalStr = 'calcTotal(' + this.hasDiscount + ',' + this.hasTax + ')';
	var setDiscountStr = 'setDiscount()';
	var calcEvenStr  = 'this.className=\'crm_small10 efViewTextBox efCtrlWidth70\';' + calcTotalStr + ';';
	//var calcEvenStr = 'this.className=\'crm_small10 efViewTextBox efCtrlWidth70\' ';
	
	cellObj.vAlign = 'top';
	cellObj.className = 'crm_product_row crm_small10 ';
	cellObj.innerHTML = '<table cellSpacing="0" cellpadding="1" width="100%">'
					  + '<tr><td class="small">'
					  +	'<input type="text" class="efViewTextBox efCtrlWidth70 crm_small10" id="qty' + this.count +'" '
					 // + 'onblur="' + calcEvenStr + '" '
					  + 'onchange="' + calcEvenStr + '" '
					  + 'onfocus="this.className=\'crm_small10 efViewTextBoxOn efCtrlWidth70\'" '
					  + 'name=qty' + this.count + ' range="3" dataType="float" title="数量" style="width:80%" >'
					  + '<img '
					  //+ '<img onclick="open_amount_book(' + eval(this.count) + ')" '
					  + 'src="' + CRM_CONTEXT_IMG_PATH + '/pricebook.gif">'
					  + '<input type="hidden" id="qty_min' + this.count + '" '
					  + 'name=qty_min' + this.count + '> '
					  + '<input type="hidden" id="qty_max' + this.count + '" '
					  + 'name=qty_max' + this.count + '> '
					  +'</td></tr>'
					  + '</table>';
}

productRow.prototype.addPriceCell = function(){
    var cellObj       = this.rowObj.insertCell(-1);
	cellObj.vAlign    = 'top';
	cellObj.className = 'crm_product_row crm_small10';
	var str = "";
	var calcTotalStr = 'this.className=\'efViewTextBox efCtrlWidth70 crm_small10\';'
	                 + 'calcTotal()';
	var setDiscountStr = 'setDiscount(this, ' + eval(this.count) + ')';
	var calcEvenStr  = calcTotalStr + ';' ;
	//var calcEvenStr  = 'this.className=\'efViewTextBox efCtrlWidth70 crm_small10\';';

	
	str = '<table cellSpacing=0 cellpadding=0 width="100%">'
		+ '<tr><td class="small"><input class="efViewTextBox efCtrlWidth70 crm_small10" id=price' + this.count + ' '
		//+ ' onblur="' + calcEvenStr + '" '
		+ ' onchange="' + calcEvenStr + '" '
		+ ' onfocus="this.className=\'efViewTextBoxOn efCtrlWidth70 crm_small10\';" '
		+ ' name=price' + this.count + ' range="3" dataType="float" title="单价" style="width:80%">&nbsp;'
		+ '<img '
		//+ ' <img onclick="open_price_book('+ eval(this.count) + ')"  '
		+ ' src="' + CRM_CONTEXT_IMG_PATH + '/pricebook.gif"></td></tr>';
 	str += 	'</table>'	;
	cellObj.innerHTML = str;

}

productRow.prototype.addTotalCell = function(hasDiscount, hasTax){
	var cellObj = this.rowObj.insertCell(-1);
	cellObj.className = 'crm_product_row crm_small10';
	var str = '';
	str += '<table cellspacing=0 cellpadding=5 width="100%" class=small>'
		 + '<tr><td id=productTotal' + this.count + ' align=right>&nbsp;</td></tr>';
	
	if(hasDiscount == true){
		str += '<tr><td id=discountTotal' + this.count + ' align=right>0.00</td></tr>';
		str += '<tr><td id=totalAfterDiscount' + this.count + ' align=right>&nbsp;</td></tr>';
	}
	
	if(hasTax == true){
		str += '<tr><td id=taxTotal' + this.count + ' align=right>0.00</td></tr>';
	}
	
	str += '</table>';
 	cellObj.innerHTML = str;
}

productRow.prototype.addReadOnlyCell = function(name){
    var cellObj = this.rowObj.insertCell(-1);
	var str = '';
	var ctlName = name + this.count;
	
	cellObj.className = 'crm_product_row crm_small10 ';
	cellObj.vAlign = 'top';
	str += '<table cellSpacing=0 cellpadding=0 width="100%" class="small">';
	str += '<tr><td align=left>';
	str += '<input id=' + ctlName + ' name=' + ctlName + ' class=\"crm_small10 efViewReadonlyBox efCtrlWidth90\" readonly> ';
	str += '</td>';
	str += '</tr></table>';
	cellObj.innerHTML = str; 
}
