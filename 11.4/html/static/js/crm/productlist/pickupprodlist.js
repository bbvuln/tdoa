function setRowPointerRtnMutli(rowObj, action){
	if(window.parent.opener != null){
		var opener = window.parent.opener;
	}else{
		var opener = window.parent;
	}
	var entity_type = opener.location.pathname.indexOf("Sale") == '-1' ? (opener.location.pathname.indexOf("Purchase") == '-1' ? '' : 'Purchase') : 'sale'  ;
	//sale ����
	//Purchase �ɹ�
	//��ĳ�е�����ѡ�񴰿�
	var selectedRowIndex = opener.document.getElementById("selectedRow").value;
	var selectedIdsObj 		= 	opener.document.getElementById("selectedIds");
	var selectedRowIdsObj 	=  	opener.document.getElementById("selectedRowIds");
	var selectedIds 	= selectedIdsObj.value.split(",");
	var selectedRowIds 	= selectedRowIdsObj.value.split(","); 

	var rtFld			= opener.prodRtFld;
	var rtFldLabel		= opener.prodRtFldLabel;
	var prodReltFlds	= opener.prodRtFlds.split(",");
		//prodReltFlds.push('price');
	
	
	if(typeof selectedIdsObj == 'undefined'){
		return;
	}

	
	var rowIndex	= parseInt(rowObj.id.substr(3)); 	  	//��ǰ����ѡ���������
	var productID 	= rowObj.getAttribute('value');
	
	if(action == 'over'){
		rowObj.className = "CRM_TableLine_hover";
	}else if(action == 'out'){
		if(rowIndex % 2 != 0){
			rowObj.className = "CRM_TableLine1";
		}else{
	    	rowObj.className = "CRM_TableLine2";		
		}

		if(findSelectId(selectedIds, productID) >= 0){
	  		rowObj.className = "CRM_TableLine_selected";
	  	}
	}else if(action == 'click'){
		var selectRowIndex = findSelectId(selectedIds, productID);
		if(selectRowIndex >= 0){	//����ѡ��,ȥ��ѡ�����
			var selectRow = selectedRowIds[selectRowIndex];

			if(rowIndex % 2 != 0){
				rowObj.className = "CRM_TableLine1";
			}else{
	    		rowObj.className = "CRM_TableLine2";		
			}
			
			//�����������ǵ�ǰѡ���������,����ɾ����
			if(selectRow == selectedRowIndex){
				opener.document.getElementById(rtFld + selectRow).value = "";
				opener.document.getElementById(rtFld + selectRow).name
				for(var i = 0; i < prodReltFlds.length; i++){
					opener.document.getElementById(prodReltFlds[i] + selectRow).value = "";
				}
			}else{
				var listObj = eval("opener." + opener.document.getElementById("prodList").value);
				listObj.delRow(selectRow);
			}
			
			selectedIdsObj.value	= removeId(selectedIds, productID);
			selectedRowIdsObj.value = removeId(selectedRowIds, selectRow);

		}else{
			//���ѡ��ĵ�ǰ��Ϊ������䣬��������в����
			rowObj.className = "CRM_TableLine_selected";
			var listObj = opener[opener.document.getElementById("prodList").value];
	
			if(opener.document.getElementById(rtFld + selectedRowIndex).value == ""){	
				opener.document.getElementById(rtFld + selectedRowIndex).value = productID;
				for(var i = 0; i < prodReltFlds.length; i++){
					var sFldObj = document.getElementById(prodReltFlds[i] + productID);
					var textObj = getTextObj(sFldObj);						
					if(typeof textObj.nodeValue != 'undefined'){
						if(prodReltFlds[i] == 'price' && (entity_type == 'sale' || entity_type == 'Purchase'))
						{	var nodeValue = 0;
							nodeValue = sFldObj.childNodes[1].value.split(",");
							nodeValue = entity_type == 'sale' ? nodeValue[0] : nodeValue[1];
							opener.document.getElementById(prodReltFlds[i] + selectedRowIndex).value = nodeValue;
						}else{						
							opener.document.getElementById(prodReltFlds[i] + selectedRowIndex).value = textObj.nodeValue;}
						}
				}
				selectedIdsObj.value 	+= productID + ",";
				selectedRowIdsObj.value += selectedRowIndex + ",";
			}else if((emptyRow = listObj.findFirstEmptyRow()) > 0){
				opener.document.getElementById(rtFld + emptyRow).value = productID;
				for(var i = 0; i < prodReltFlds.length; i++){
					var sFldObj = document.getElementById(prodReltFlds[i] + productID);
					var textObj = getTextObj(sFldObj);

					if(typeof textObj.nodeValue != 'undefined'){
						if(prodReltFlds[i] == 'price' && (entity_type == 'sale' || entity_type == 'Purchase'))
						{	var nodeValue = 0;
							nodeValue = sFldObj.childNodes[1].value.split(",");
							nodeValue = entity_type == 'sale' ? nodeValue[0] : nodeValue[1];
							opener.document.getElementById(prodReltFlds[i] + emptyRow).value = nodeValue;
						}else{							
							opener.document.getElementById(prodReltFlds[i] + emptyRow).value = textObj.nodeValue;
						}	
					}
				}
				selectedIdsObj.value 	+= productID + ",";
				selectedRowIdsObj.value += emptyRow + ",";

			}else{
			
				var proRow  = listObj.addRow();
				opener.document.getElementById(rtFld + proRow.count).value = productID;
				for(var i = 0; i < prodReltFlds.length; i++){
					var sFldObj = document.getElementById(prodReltFlds[i] + productID);
					//alert(prodReltFlds[i] + productID);
					var textObj = getTextObj(sFldObj);

					if(typeof textObj.nodeValue != 'undefined'){
												if(prodReltFlds[i] == 'price' && (entity_type == 'sale' || entity_type == 'Purchase'))
						{	var nodeValue = 0;
							nodeValue = sFldObj.childNodes[1].value.split(",");
							nodeValue = entity_type == 'sale' ? nodeValue[0] : nodeValue[1];
							opener.document.getElementById(prodReltFlds[i] + proRow.count).value = nodeValue;
						}else{	
							opener.document.getElementById(prodReltFlds[i] + proRow.count).value = textObj.nodeValue;
						}	
					}
				}
				selectedIdsObj.value 	+= productID + ",";
				selectedRowIdsObj.value += proRow.count + ",";
			}
			//alert(prodReltFlds);

		}

	}
}

//�ж�ĳ��Ʒ�Ƿ�ѡ�У������ѡ�з��ؾ����λ�ã����򷵻�-1
function findSelectId(ids, id){
	for(var i =0 ; i < ids.length-1; i++){
		if(ids[i] == id){
			return i;
		}
	}
	return -1;
}

function removeId(ids, id){
	var str = "";
	for(var i =0 ; i < ids.length-1; i++){
		if(ids[i] != id){
			str += ids[i] + ",";
		}
	}
	return str;
}

