/* Demo Note:  This demo uses a FileProgress class that handles the UI for displaying the file name and percent complete.
The FileProgress class is not part of SWFUpload.
*/


/* **********************
   Event Handlers
   These are my custom event handlers to make my
   web application behave the way I went when SWFUpload
   completes different tasks.  These aren't part of the SWFUpload
   package.  They are part of my application.  Without these none
   of the actions SWFUpload makes will show up in my application.
   ********************** */
function fileQueued(file) {
	try {
	   //检查文件是否已添加
	   for(var i=0;i<file.index;i++)
	   {
	      var file_i = this.getFile(i);//alert(file_i.modificationdate==file.modificationdate)
	      if(file_i.filestatus !=SWFUpload.FILE_STATUS.CANCELLED && file_i.name==file.name && file_i.size==file.size && file_i.creationdate.getTime()==file.creationdate.getTime() && file_i.modificationdate.getTime()==file.modificationdate.getTime())
	      {
	      	 var msg1 = sprintf(td_lang.inc.msg_114,file.name);
	         alert(msg1);
	         this.cancelUpload(file.id);
	         return;
	      }
	      
	   }
	   
	   //如果OA设置不允许上传某些类型文件的时候，进行检查
	   var fileType = file.type.toLowerCase().substr(1);
	   if(oa_upload_limit == 1 && (oa_limit_type.indexOf(fileType+",")==0 || oa_limit_type.indexOf(","+fileType+",")>0))
	   {
	   	  var msg2 = sprintf(td_lang.inc.msg_115,fileType);
	      alert(msg2);
	      this.cancelUpload(file.id);
	      return;
	   }
	   
		var progress = new FileProgress(file, this.customSettings.progressTarget);
//		progress.setStatus("等待上传...");//pending...
		progress.toggleCancel(true, this);
	} catch (ex) {
		this.debug(ex);
	}

}

function fileQueueError(file, errorCode, message) {
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			var msg3 = sprintf(td_lang.inc.msg_116,message);
			alert(td_lang.module.msg_35+"\n" + (message === 0 ? "" : msg3));
			return;
		}

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			var msg4 = sprintf(td_lang.inc.msg_117,Math.ceil(file.size/1024/1024),this.settings['file_size_limit']);
			progress.setStatus(msg4);
			this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			progress.setStatus(td_lang.module.msg_47);//"不能上传0字节文件"
			this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			progress.setStatus(td_lang.module.msg_48);//"无效的文件类型"
			this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		default:
			if (file !== null) {
				progress.setStatus(td_lang.module.msg_49 + message);//"未知错误："
			}
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		if (numFilesSelected > 0) {
		    this.startUpload();
		}
		//window.scrollTo(0,document.getElementById(this.customSettings.uploadArea).offsetHeight)
		
		/* I want auto start the upload and I can do that here */
		//this.startUpload();
	} catch (ex)  {
        this.debug(ex);
	}
}

function uploadStart(file) {
	try {
		/* I don't want to do any file validation or anything,  I'll just update the UI and
		return true to indicate that the upload should start.
		It's important to update the UI here because in Linux no uploadProgress events are called. The best
		we can do is say we are uploading.
		 */
		document.getElementById(this.customSettings.startButtonId).disabled = true;
		var progress = new FileProgress(file, this.customSettings.progressTarget);
//		progress.setStatus("正在上传...");
		progress.toggleCancel(true, this);
	}
	catch (ex) {
	   this.debug(ex);
	}
	
	return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setProgress(percent);
//		progress.setStatus("正在上传... "+percent+"%");
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget); 
		//progress.toggleCancel(false);
		if(serverData.substr(0,5)=="-ERR " && serverData.indexOf("?")<=0)
		{
		    alert(td_lang.module.msg_50+ serverData.substr(5));
		   /*progress.setError();
		   progress.setStatus( td_lang.module.msg_50+ serverData.substr(5));//"上传失败："
		   var stats=this.getStats();
		   stats.successful_uploads--;
		   stats.upload_errors++;
		   this.setStats(stats);*/
		   
		}
		else
		{
		   //progress.setStatus("上传成功");		   
		   addImage(serverData.substr(5));
		   progress.setComplete();
		}

	} catch (ex) {
		this.debug(ex);
	}
}

function addImage(src) {
	var img_strs = new Array();
	var img_str = new Array();
	img_strs = src.split("=");
	img_str = img_strs[2].split("&");

    if(src.indexOf("avatar")>0)
    {
        var avatar = document.getElementById("AVATAR1");
        avatar.setAttribute("src",src);
        document.getElementById("AVATAR2").value = img_str[0];
        avatar.className="img-class-1";
        //avatar.style.opacity=1;
        //alert("dd");
        //avatar.style.filter=alpha(opacity=100);
        //avatar.style.filter['alpha']['opacity']=100;
         //document.getElementById("AVATAR2").appendChild(newImg);
    }else
    {
        var photo = document.getElementById("PHOTO1");
        photo.setAttribute("src",src);
        document.getElementById("PHOTO2").value = img_str[0];
        //photo.style.opacity=1;
        //photo.style.filter=alpha(opacity=100);
        //photo.style.filter['alpha']['opacity']=100;
        photo.className="img-class-1";
         //document.getElementById("PHOTO2").appendChild(newImg);
    }     
	//newImg.src = src;
}

function fadeIn(element, opacity) {
	var reduceOpacityBy = 5;
	var rate = 30;	// 15 fps


	if (opacity < 100) {
		opacity += reduceOpacityBy;
		if (opacity > 100) {
			opacity = 100;
		}

		if (element.filters) {
			try {
				element.filters.item("DXImageTransform.Microsoft.Alpha").opacity = opacity;
			} catch (e) {
				// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
				element.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + opacity + ')';
			}
		} else {
			element.style.opacity = opacity / 100;
		}
	}

	if (opacity < 100) {
		setTimeout(function () {
			fadeIn(element, opacity);
		}, rate);
	}
}



function uploadError(file, errorCode, message) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			progress.setStatus( td_lang.module.msg_51+ message);//"HTTP错误："
			this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			progress.setStatus( td_lang.module.msg_52+ message);//"上传失败："
			this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			progress.setStatus( td_lang.module.msg_53+ message);//"服务器(IO)错误："
			this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			progress.setStatus( td_lang.module.msg_54+ message);//"安全错误："
			this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			progress.setStatus( td_lang.module.msg_55+ message);//"达到上传限制："
			this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			progress.setStatus( td_lang.module.msg_56+ message);//"无法验证，跳过上传："
			this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			// If there aren't any files left (they were all cancelled) disable the cancel button
			if (this.getStats().files_queued === 0) {
				document.getElementById(this.customSettings.startButtonId).disabled = true;
				document.getElementById(this.customSettings.cancelButtonId).disabled = true;
			}
			progress.setStatus(td_lang.module.msg_57);//"已取消"
			progress.setCancelled();
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			progress.setStatus(td_lang.module.msg_58);//"已停止"
			break;
		default:
			progress.setStatus( td_lang.module.msg_49+ errorCode);//"未知错误："
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
}

function uploadComplete(file) {
	if (this.getStats().files_queued === 0) {
		//document.getElementById(this.customSettings.startButtonId).disabled = true;
		//document.getElementById(this.customSettings.cancelButtonId).disabled = true;
	}
}

// This event comes from the Queue Plugin
function queueComplete(numFilesUploaded) {
	/*var status = document.getElementById("totalStatics");
	var stats = this.getStats();

	
	var msg5 = sprintf(td_lang.inc.msg_118,stats.successful_uploads,stats.upload_errors,stats.upload_cancelled);
	status.innerHTML = msg5;*/
}
