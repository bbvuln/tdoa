function addEntity(url, dialogWidth, dialogHeight, target, params){
    //window.location.href = "./edit.php";
	openWindow(url, dialogWidth, dialogHeight, target, params);
}

function editEntity(id, url, dialogWidth, dialogHeight, target, params){
    if(typeof id == 'undefined' || id == ''){
        var count = get_select_id();
       	if(count == 0){
    		alert(td_lang.crm.inc.msg_3);
    		return;
    	}
    	if(count > 1){
    		alert(td_lang.crm.inc.msg_4);
    		return;
    	}
        openWindow("./"+url+"?id=" + document.getElementById('selectIds').value, dialogWidth, dialogHeight, target, params);
        //window.location.href = "./edit.php?id=" + document.getElementById('selectIds').value;
    }else{
        //window.location.href = "./edit.php?id=" + id;
		var re=/\//;
		if(re.test(url)){
			openWindow(url+"?id=" + id, dialogWidth, dialogHeight, target, params);
		}else{
			openWindow("./"+url+"?id=" + id, dialogWidth, dialogHeight, target, params);
		}
    }
}

function deleteEntity(id){
    if(typeof id == 'undefined' || id == ''){
        var count = get_select_id();
       	if(count == 0){
    		alert(td_lang.crm.inc.msg_6);
    		return;
    	}
        if(confirm(td_lang.crm.inc.msg_35)){
            var ajaxObj = createAjaxObject();
            ajaxObj.onreadystatechange = function(){
                if(ajaxObj.readyState == 4){
                    window.location.href = window.location.href; ;
                }
            }
            var URL = "./delete.php?ids=" + document.getElementById("selectIds").value;
            ajaxObj.open("GET", URL, true);
            ajaxObj.send("");	
        }
    }else{
        if(confirm(td_lang.crm.inc.msg_35)){
            var ajaxObj = createAjaxObject();
            ajaxObj.onreadystatechange = function(){
                if(ajaxObj.readyState == 4){
                    window.location.href = window.location.href;
                }
            }
            var URL = "./delete.php?ids=" + id + ","
            ajaxObj.open("GET", URL, true);
            ajaxObj.send("");	
        }
    }

}

function createEntity(para,id, url, dialogWidth, dialogHeight, target, params){
    if(typeof id == 'undefined' || id == ''){
        var count = get_select_id();
       	if(count == 0){
    		alert(td_lang.crm.inc.msg_5);
    		return;
    	}
    	if(count > 1){
    		alert(td_lang.crm.inc.msg_5);
    		return;
    	}
        openWindow(url+"?"+para+"=" + document.getElementById('selectIds').value, dialogWidth, dialogHeight, target, params);
        //window.location.href = "./edit.php?id=" + document.getElementById('selectIds').value;
    }else{
        //window.location.href = "./edit.php?id=" + id;
		openWindow(url+"?"+para+"=" + id, dialogWidth, dialogHeight, target, params);
    }
}

function deleteAllEntity(){
    
}
function importEntity(){
    
}

function exportEntity(){
    
}

function submitData(){
	window.document.form1.submit();
}

function comeBack(){
	window.history.back();
}

function showDetailProduct(productId){
	var url = "/general/crm/modules/ProductDepository/Product/product/detail.php?id="+productId;
	openWindow(url, "650", "500", "new", "params");
	return false;
}