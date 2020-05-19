function openImage(file_name){
	var url = "/module/crm2010/imageOperation/openImage.php?FILE_NAME="+file_name;
	openWindow(url, "800", "600");
}

function deleteImage(attachId,attachName,module,dbName){
	var Id = document.getElementById("id").value; 
	var url = "/module/crm2010/imageOperation/deleteImage.php?ATTACHMENT_ID="+attachId+"&ATTACHMENT_NAME="+attachName+"&MODULE="+module+"&DB_NAME="+dbName+"&id="+Id;	
	openWindow(url, "0", "0", "FORMSUBMIT");
}

function downImage(attachId,attachName,module){
	var url = "/module/crm2010/imageOperation/downImage.php?ATTACHMENT_ID="+attachId+"&ATTACHMENT_NAME="+attachName+"&MODULE="+module;	
	openWindow(url, "0", "0", "FORMSUBMIT");
}