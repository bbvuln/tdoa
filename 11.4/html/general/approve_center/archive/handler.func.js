;(function(win,$){
	var processBarWidth = 0;
	var processCount = 0;	
	var processWidth = 0;
	var logPath = "";
	var iframe = $('<iframe width=0 height=0 frameborder=0 scrolling="no" name="HiddenIframe"></iframe>').appendTo("body");
	var btnClose = $('<button class="btn">�ر�</button>')
		.click(function(){
			win.msgLay.hide();
			win.overLay.hide();
			$("#btnConfirm").attr("disabled",false);
		});
	var btnLog = $('<button class="btn-green">������־</button>')
		.click(function(){
			exportLog();
		});
	
	var btnRetry = $('<button class="btn-blue">����</button>')
		.click(function(){
			archiveWorkflow();
		});
	var btnErrorLog = $('<button class="btn-red">����������־</button>')
		.click(function(){
			exportLog();
		});
	addMsg = function(msg){
		try{
			win.processMsgContainer.append(msg);
			win.processMsgContainer.scrollTop(win.processMsgContainer.scrollTop()+win.processMsgContainer.innerHeight());
		}catch(e){
			alert(e.message);
			addBtn("failed");
		}
	};
	addProcess = function(pWidth){
		try{
			if(pWidth == 0){
				processBarWidth = 0;
			}else {
				processBarWidth += pWidth;
			}
			win.processBar.width(Math.min(processBarWidth,100)+"%");
			win.processPercent.html(Math.min(Math.round(processBarWidth),100)+"%");
		}catch(e){
			alert(e.message);
			addBtn("failed");
		}
	};
	exportLog = function(){
		try{
			iframe.attr("src","exportLog.php?filePath="+logPath);
		}catch(e){
			alert(e.message);
		}
	};
	addBtn = function(flag){
		try{
			win.btnBar.html("");
			if(flag === "success"){				
				btnLog.clone().click(function(){btnLog.click();}).appendTo(win.btnBar);
				btnClose.clone().click(function(){win.location.href = "./index.php";}).appendTo(win.btnBar);
			}else if(flag === "failed"){
				btnRetry.clone().click(function(){btnRetry.click();}).appendTo(win.btnBar);
				btnErrorLog.clone().click(function(){btnErrorLog.click();}).appendTo(win.btnBar);
				btnClose.clone().click(function(){btnClose.click();}).appendTo(win.btnBar);	
			}
		}catch(e){
			alert(e.message);
		}
	};
	archiveWorkflow = function(){
		try{
			win.btnBar.html("");
			win.processLoading.html('<img src="/static/images/loading_gray_16.gif" align="absMiddle">&nbsp;���ڹ鵵�������ĵȺ�......');
			logPath = "";
			addMsg('<b class="fontBlue">��ʼ���ݹ鵵���������ĵȴ�</b><br>');
			addProcess(0);
			getTableStruc();
		}catch(e){
			addMsg(e.message);
			addBtn("failed");
		}
	};
	getTableStruc = function(){
        var archiveDesc = $("#ARCHIVE_DESC").val();
		addMsg("���ڻ�ȡ��ṹ......");
		$.ajax({
			url: "getTableStruc.php",
			data: "BEGIN_DATE="+$("#BEGIN_DATE").val()+"&archiveDesc="+encodeURIComponent(archiveDesc),
			type: "POST",
			async: true,
			success: function(result){
				logPath = result.logPath;
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(1);
					try{
						processCount = result.tableMap.length*3-14;
						processWidth = 98/processCount;
						addMsg('<b class="fontBlue">��ʼ�����鵵���ݱ�</b><br>');
						createArchiveTable(0,result);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});
	};
	createArchiveTable = function(arrIndex,tableStrucJsonArr){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
		var archiveDate = tableStrucJsonArr.archiveDate;
		var srcTable = tableStrucJsonArr.tableMap[arrIndex].srcTable;
		var destTable = tableStrucJsonArr.tableMap[arrIndex].destTable;
		addMsg("���ڴ���"+destTable+"��......");
		$.ajax({
			url: "createArchiveTable.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							createArchiveTable(arrIndex,tableStrucJsonArr);
						}else {
							addMsg('<b class="fontBlue">�����鵵���ݱ����<br></b>');
							try{
								addMsg('<b class="fontBlue">��ʼ���ƹ鵵����<br></b>');
								insertArchiveData(0,tableStrucJsonArr);
							}catch(e){
								addMsg(e.message);
								addBtn("failed");
							}
						}
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};
	insertArchiveData = function(arrIndex,tableStrucJsonArr){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
		var archiveDate = tableStrucJsonArr.archiveDate;
		var srcTable = tableStrucJsonArr.tableMap[arrIndex].srcTable;
		var destTable = tableStrucJsonArr.tableMap[arrIndex].destTable;
		addMsg("���ڸ���"+srcTable+"��Ĺ鵵���ݵ�"+destTable+"��......");
		$.ajax({
			url: "insertArchiveData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&archiveDate="+archiveDate,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							insertArchiveData(arrIndex,tableStrucJsonArr);
						}else {
							addMsg('<b class="fontBlue">���ƹ鵵���ݽ���<br></b>');
							try{
								addMsg('<b class="fontBlue">��ʼɾ���鵵����<br></b>');
								deleteSourceData(0,tableStrucJsonArr);
							}catch(e){
								addMsg(e.message);
								addBtn("failed");
							}
						}
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};
	deleteSourceData = function(arrIndex,tableStrucJsonArr){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
		var archiveDate = tableStrucJsonArr.archiveDate;
		var srcTable = tableStrucJsonArr.tableMap[arrIndex].srcTable;
		var destTable = tableStrucJsonArr.tableMap[arrIndex].destTable;
		if(srcTable.indexOf("BPM_RUN") == -1 && srcTable.indexOf("BPM_VERSION") == -1 && srcTable.indexOf("BPM_DATA_") == -1){
			arrIndex++;
			if(arrIndex < tableStrucJsonArr.tableMap.length){
				deleteSourceData(arrIndex,tableStrucJsonArr);
			}else {
				addMsg('<b class="fontBlue">ɾ���鵵���ݽ���<br></b>');
				try{
					addMsg('<b class="fontBlue">��ʼ���汾�ι鵵��Ϣ<br></b>');
					saveArchiveInfo(tableStrucJsonArr);
				}catch(e){
					addMsg(e.message);
					addBtn("failed");
				}
			}
			return;
		}
		addMsg("����ɾ��"+srcTable+"��Ĺ鵵����......");
		$.ajax({
			url: "deleteSourceData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&archiveDate="+archiveDate,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							deleteSourceData(arrIndex,tableStrucJsonArr);
						}else {
							addMsg('<b class="fontBlue">ɾ���鵵���ݽ���<br></b>');
							try{
								addMsg('<b class="fontBlue">��ʼ���汾�ι鵵��Ϣ<br></b>');
								saveArchiveInfo(tableStrucJsonArr);
							}catch(e){
								addMsg(e.message);
								addBtn("failed");
							}
						}
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);	
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};
	saveArchiveInfo = function(tableStrucJsonArr){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
		var archiveDate = tableStrucJsonArr.archiveDate;
        var archiveId = tableStrucJsonArr.archiveId;
		var archiveDesc = $("#ARCHIVE_DESC").val();
		var tableStr = "";
		$.each(tableStrucJsonArr.tableMap,function(){
			tableStr += this.srcTable+",";
		});
		addMsg("���ڱ��汾�ι鵵��Ϣ......");
		$.ajax({
			url: "saveArchiveInfo.php",
			data: "srcDB="+srcDB+"&destDB="+destDB+"&archiveDate="+archiveDate+"&archiveDesc="+encodeURIComponent(archiveDesc)+"&tableStr="+tableStr.substring(0,tableStr.length-1)+"&archiveId="+archiveId,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(1);
					try{
						addMsg('<b class="fontBlue">���汾�ι鵵��Ϣ����<br></b>');
						addMsg('<b class="fontGreen">���ݹ鵵�ɹ���ף��������죡<br></b>');
						win.processLoading.html('<b class="fontGreen">���ݹ鵵�ɹ���ף��������죡</b>');
						addBtn(result.flag);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};			
})(window,jQuery);	