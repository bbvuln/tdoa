function productList(listName, hasTool, fieldName, fieldLabel, fieldWidth, fieldType,prodReltFlds){
    this.listName          = listName;
    this.hasTool           = hasTool;
    this.fieldName         = fieldName;
	this.fieldLabel        = fieldLabel;		
	this.fieldWidth        = fieldWidth;		
	this.fieldType         = fieldType;
	this.prodReltFlds      = prodReltFlds;
    this.hasDiscount       = false;
    this.hasTax            = false;
	this.deleted           = [];
    
}

productList.prototype.addRow = function(){
    var tableObj = getObj(this.listName+"_tb");
	var prev = tableObj.rows.length; 
	var count = eval(prev)-1;  
	var proRow = new productRow(this.listName, tableObj.insertRow(prev), count);	
	this.deleted[this.deleted.length] = true;
	proRow.rowObj.id = "row" + count;
   	proRow.rowObj.className = "detailedRowCell"
    
    if(this.hasTool == true){
   	    proRow.addToolCell();
    }
    
   	for(var i = 0; i < this.fieldName.length; i++){
   	    
		if(this.fieldType[i].split("~")[0] == "PT"){				//product describe
			proRow.addProductCell(this.prodReltFlds[0].split(":")[0]);
			for(var j = 1; j < this.prodReltFlds.length; j++){
				var reltFldInfo = this.prodReltFlds[j].split(":");
				proRow.addReadOnlyCell(reltFldInfo[0]);
			}
        }else if(this.fieldType[i].split("~")[0] == "AMT"){
            proRow.addAmountCell();
        }else if(this.fieldType[i].split("~")[0] == "PC"){
            proRow.addPriceCell();
        }else if(this.fieldType[i].split("~")[0] == "TL"){
            proRow.addTotalCell(this.hasDiscount, this.hasTax);
        }else{
            //proRow.addReadOnlyCell('d')
        }
    }


	return proRow;
}

productList.prototype.delRow = function(rowCnt){
	var rowObj = getObj("row" + rowCnt);
	rowObj.style.display = 'none';
	getObj("deleted" + rowCnt).value = "1";
	this.deleted[eval(rowCnt) - 1] = false;
	calcTotal(true);
}

productList.prototype.deleteAll = function(){
	var tableObj = getObj(this.listName+"_tb");
	var count = tableObj.rows.length; 
	for(i = 2; i < count; i++){
		tableObj.deleteRow(tableObj.rows.length - 1);
	}
	this.deleted = [];
}

productList.prototype.findFirstEmptyRow = function(){
	var tableObj = getObj(this.listName+"_tb");
	var count = tableObj.rows.length; 
	count = eval(count) - 2

	var i = 1;
	for(; i <= count; i++){
		if(getObj("deleted" + i).value == 0  && getObj("product_id" + i).value == ""){
			break;
		}
	}

	if(i > count){
		return 0; //没有发现空行
	}else{
		return i;
	}
}

productList.prototype.fillDatas = function(rowCnt, values){
	for(var key in values){
		var obj = document.getElementById(key + rowCnt);
		if(typeof obj != 'undefined'){
			obj.value = values[key];
		}
	}
	
}

productList.prototype.toString = function(){
    var str= "<div>\n";
    
    if(document.getElementById){
  		str += "<table id='" + this.listName + "_tb' class=\"App_TableBlock\" cellSpacing=0 cellPadding=0 width='95%' ";
        str += "align=center border=0 class='crm_table crm_small12_bold'>";
		str += "<tr><td class='TableHeader' colspan='" + (this.fieldLabel.length + this.prodReltFlds.length + 1) + "'"
			+ ">&nbsp;"+ td_lang.crm.inc.msg_55 +"</td></tr>";
 		str += "<tr height=25>";
		str += "<td width='5%' class='TableData' align=center><span class='TableContent'>"+ td_lang.crm.inc.msg_56 +"</span></td>"
		for(var i = 0; i < this.fieldLabel.length; i++){				

			if(this.fieldType[i].split("~")[1] == "M"){
                str += "<td width='15%' class='TableData Red' align=center><span class='TableContent'>" 
				     + this.fieldLabel[i] + "</span>";
			}else{
                str += "<td width='" + this.fieldWidth[i] + "' class='TableData' align=center><span class='TableContent'>" 
				     + this.fieldLabel[i] + "</span>";
			}
            
			str += "</td>";
			if(this.fieldType[i].split("~")[0] == "PT"){
				for(var j = 1; j < this.prodReltFlds.length; j++){
					var reltFldInfo = this.prodReltFlds[j].split(":");
					str += "<td width='" + reltFldInfo[2] + "' class='TableData' align=center><span class='TableContent'>" 
						 + reltFldInfo[1] + "</span>";
					str += "</td>";
				}
			}
		}
    	str += "</tr>";
		str += "</table>";
		str += "<table class=erpTable cellSpacing=0 cellPadding=5 width=\"90%\" " 
+ "align=center border=0><tr><td align='left'>" 
+ "<input class=\"btn-blue\" " 
+ "onclick=\"pList.addRow()\" " 
+ "type=button value=\""+ td_lang.crm.inc.msg_57 +"\" name=Button id='addProduct'></td>";
		str += "<td class=\"erpTableRow big lineOnTop\" " 
+ "style=\"BORDER-RIGHT-WIDTH: 1px; BORDER-RIGHT-COLOR: #dadada\">&nbsp;</td>" 
+ "<td  class=\"erpTableRow big lineOnTop\" align=right><B>"+ td_lang.crm.inc.msg_58 +"</B></td>" 
+ "<td width=" + this.fieldWidth[this.fieldWidth.length-1] + "' class=\"erpTableRow big lineOnTop\" id=grandTotal align=right " 
+ "name=\"grandTotal\">&nbsp;</td></tr>";
		str += "</table>";
	}else{
		str += td_lang.crm.inc.msg_59;
	}
   	
    str += '</div>';
    return str;
}
/*productList.prototype.toString = function(){
	var str = "<div>\n";

	if(document.getElementById){
		str += "<table id='proTab' cellSpacing=0 cellPadding=0 width='98%' ";
		str += "align=center border=0 class='erpTable small'>";
		str += "<tr><td class='dvInnerHeader' colspan='" + (this.fieldLabel.length + this.prodReltFlds.length + 1) + "'"
			+ ">&nbsp;产品明细</td></tr>";
		str += "<tr height=25>";
		str += "<td width='5%' class=lvtCol align=center>操作</td>"
		for(var i = 0; i < this.fieldLabel.length; i++){				//表体label
			str += "<td width='" + this.fieldWidth[i] + "' class=lvtCol align=center><B>" 
				+ this.fieldLabel[i] + "</B>";
			if(this.fieldType[i].split("~")[1] == "M"){
				str += "&nbsp;<font color=red size=3>*</font>";
			}	
			str += "</td>";
			if(this.fieldType[i].split("~")[0] == "PT"){
				for(var j = 0; j < this.prodReltFlds.length; j++){
					var reltFldInfo = this.prodReltFlds[j].split(":");
					str += "<td width='" + reltFldInfo[2] + "' class=lvtCol align=center><B>" 
						 + reltFldInfo[1] + "</B>";
					str += "</td>";
				}
			}
		}
		str += "</tr>";
		str += "</table>";
	}else{
		str += "浏览器不支持.";
	}
	//str += '<table><tr><td></td></tr>'
	    //+= '<tr> '
	    //+= 'onclick="pdetail.addRow(detailFieldName, detailFieldType, \'\', true, true);" '
	    //+= 'type=button value="Add Product" name=Button></td></tr>'
	    //+= '</table>';
	//add product button
	str += "<table class=erpTable cellSpacing=0 cellPadding=5  width=\"98%\" "
	     + "align=center border=0><tr id='row_op'><td colSpan=3>"
	     + "<input class=\"button small save\" "
	     + "onclick=\"pList.addRow(detailFieldName, detailFieldType, detailProdReltFlds, hasDiscount, hasTax, events)\" "
	     + "type=button value=\"添加商品\" name=Button id='addProduct'></td></tr>"
	
	//net total

	if(hasShippingCharge == true || hasAdjustment == true){
		str += "<tr vAlign=top><td class=\"erpTableRow small lineOnTop\" "
		     + "align=right width=\"88%\" colSpan=2><B>合计</B></td>"
		     + "<td class=\"erpTableRow small lineOnTop\" id=netTotal align=right "
		     + "width=\"12%\">0.00</td></tr>";
	}
    
	//Shipping & Handling Charges 
	
	if(hasShippingCharge == true){
		str += "<tr vAlign=top><td class=\"erpTableRow small\" "
		     + "style=\"BORDER-RIGHT-WIDTH: 1px; BORDER-RIGHT-COLOR: #dadada\" width=\"60%\">&nbsp;</td>"
		     + "<td class=\"erpTableRow small\" align=right width=\"28%\">(+)&nbsp;<B>运费</B></td>"
		     + "<td class=\"erpTableRow small\" align=right width=\"12%\">"
		     + "<input class=small id=shipping_handling_charge  onblur=calcGrandTotal(); "
		     + "style=\"WIDTH: 40px\"  align=right value=0.00  name=shipping_handling_charge>"
		     + "</td></tr>"  
	}
	//adjustment
	if(hasAdjustment == true){
		str += "<tr vAlign=top><td class=\"erpTableRow small\" "
		     + "style=\"BORDER-RIGHT-WIDTH: 1px; BORDER-RIGHT-COLOR: #dadada\">&nbsp;</td>"
		     + "<td class=\"erpTableRow small\" align=right>调节"
		     + "<select class=small id=adjustmentType onchange=calcGrandTotal(); name=adjustmentType>"
		     + "<option value=\"+\" selected>增加</option>"
		     + "<option value=\"-\">减少</option></select></td>"
		     + "<td class=\"erpTableRow small\" align=right>"
		     + "<input class=small id=adjustment onblur=calcGrandTotal(); "
		     + "style=\"WIDTH: 40px\" align=right value=0.00  name=adjustment></td></tr>"
	}
                               
	//grand total 
	if(hasTotal == true){
		str += "<tr vAlign=top class=small><td class=\"erpTableRow big lineOnTop\" "
		     + "style=\"BORDER-RIGHT-WIDTH: 1px; BORDER-RIGHT-COLOR: #dadada\">&nbsp;</td>"
		     + "<td class=\"erpTableRow big lineOnTop\" align=right><B>总计</B></td>"
		     + "<td class=\"erpTableRow big lineOnTop\" id=grandTotal align=right " 
		     + "name=\"grandTotal\">&nbsp;</td></tr>"
	}
	     
	str +=  "</table>";
	
	//hidden field for submit
	
	str += "<input id=subtotal type=hidden name=subtotal> "
	     + "<input id=total    type=hidden name=total> " 
	str += '</div>';

	return str;
}*/

