;(function($){
	var processBarWidth = 0;
	var processCount = 0;	
	var processWidth = 0;
	var logPath = "";
	var iframe = $('<iframe width=0 height=0 frameborder=0 scrolling="no" name="HiddenIframe"></iframe>').appendTo("body");
	var btnClose = $('<button class="btn">�ر�</button>')
		.click(function(){
			overLay.hide();
			delLay.hide();
			$("#btnConfirm").attr("disabled",false);
		});
	var btnLog = $('<button class="btn-green">������־</button>')
		.click(function(){
			exportLog();
		});
	
	var btnRetry = $('<button class="btn-blue">����</button>')
		.click(function(){
			reArchiveWorkflow();
		});
	var btnErrorLog = $('<button class="btn-red">����������־</button>')
		.click(function(){
			exportLog();
		});
	addMsg = function(msg){
		try{
			processMsgContainer.append(msg);
			processMsgContainer.scrollTop(processMsgContainer.scrollTop()+processMsgContainer.innerHeight());
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
			processBar.width(Math.min(processBarWidth,100)+"%");
			processPercent.html(Math.min(Math.round(processBarWidth),100)+"%");
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
			btnBar.html("");
			if(flag === "success"){				
				btnLog.clone().click(function(){btnLog.click();}).appendTo(btnBar);
				btnClose.clone().click(function(){location.href = "./index.php";}).appendTo(btnBar);
			}else if(flag === "failed"){
				btnRetry.clone().click(function(){btnRetry.click();}).appendTo(btnBar);
				btnErrorLog.clone().click(function(){btnErrorLog.click();}).appendTo(btnBar);
				btnClose.clone().click(function(){btnClose.click();}).appendTo(btnBar);	
			}
		}catch(e){
			alert(e.message);
		}
	};
	redoArchiveWorkflow = function(archiveId){
		try{
			btnBar.html("");
			processLoading.html('<img src="/static/images/loading_gray_16.gif" align="absMiddle">&nbsp;���ڹ鵵�������ĵȺ�......');
			logPath = "";
			addMsg('<b class="fontBlue">��ʼ���ݹ鵵���������ĵȴ�</b><br>');
			addProcess(0);
			redoGetTableStruc(archiveId);
		}catch(e){
			addMsg(e.message);
			addBtn("failed");
		}
	};
	redoGetTableStruc = function(archiveId){
        var archiveDesc = $("#ARCHIVE_DESC").val();
		addMsg("���ڻ�ȡ��ṹ......");
		$.ajax({
			url: "redoGetTableStruc.php",
			data: "archiveId="+archiveId,
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
						addMsg('<b class="fontBlue">��ʼ��֤�鵵���ݱ�ṹ������</b><br>');
						redoCreateArchiveTable(0,result,archiveId);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});
	};
	redoCreateArchiveTable = function(arrIndex,tableStrucJsonArr,archiveId){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
		var srcTable = tableStrucJsonArr.tableMap[arrIndex].srcTable;
		var destTable = tableStrucJsonArr.tableMap[arrIndex].destTable;
		addMsg("������֤"+destTable+"��ṹ......");
		$.ajax({
			url: "redoCreateArchiveTable.php",
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
							redoCreateArchiveTable(arrIndex,tableStrucJsonArr,archiveId);
						}else {
							addMsg('<b class="fontBlue">��֤�鵵���ݱ�ṹ�����Խ���<br></b>');
							try{
								addMsg('<b class="fontBlue">��ʼ��֤�鵵���ݱ�����������<br></b>');
								redoInsertArchiveData(0,tableStrucJsonArr,archiveId);
							}catch(e){
								addMsg(e.message);
								addBtn("failed");
							}
						}
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else{
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};
	redoInsertArchiveData = function(arrIndex,tableStrucJsonArr,archiveId){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
        var tablePostfix = tableStrucJsonArr.tablePostfix;
		var srcTable = tableStrucJsonArr.tableMap[arrIndex].srcTable;
		var destTable = tableStrucJsonArr.tableMap[arrIndex].destTable;
		addMsg("������֤"+destTable+"������......");
		$.ajax({
			url: "redoInsertArchiveData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&tablePostfix="+tablePostfix,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							redoInsertArchiveData(arrIndex,tableStrucJsonArr,archiveId);
						}else {
							addMsg('<b class="fontBlue">��֤�鵵���ݱ����������Խ���<br></b>');
							try{
								addMsg('<b class="fontBlue">��ʼɾ���鵵����<br></b>');
								redoDeleteSourceData(0,tableStrucJsonArr,archiveId);
							}catch(e){
								addMsg(e.message);
								addBtn("failed");
							}
						}
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else{
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};
	redoDeleteSourceData = function(arrIndex,tableStrucJsonArr,archiveId){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
        var tablePostfix = tableStrucJsonArr.tablePostfix;
		var srcTable = tableStrucJsonArr.tableMap[arrIndex].srcTable;
		var destTable = tableStrucJsonArr.tableMap[arrIndex].destTable;
		if(srcTable.indexOf("FLOW_RUN") == -1 && srcTable.indexOf("FLOW_VERSION") == -1 && srcTable.indexOf("FLOW_DATA_") == -1){
			arrIndex++;
			if(arrIndex < tableStrucJsonArr.tableMap.length){
				redoDeleteSourceData(arrIndex,tableStrucJsonArr,archiveId);
			}else {
				addMsg('<b class="fontBlue">ɾ���鵵���ݽ���<br></b>');
				try{
					addMsg('<b class="fontBlue">��ʼ���汾�ι鵵��Ϣ<br></b>');
					// saveArchiveInfo(tableStrucJsonArr,archiveId);
				}catch(e){
					addMsg(e.message);
					addBtn("failed");
				}
			}
			return;
		}
		addMsg("����ɾ��"+srcTable+"��Ĺ鵵����......");
		$.ajax({
			url: "redoDeleteSourceData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&tablePostfix="+tablePostfix,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							redoDeleteSourceData(arrIndex,tableStrucJsonArr,archiveId);
						}else {
							addMsg('<b class="fontBlue">ɾ���鵵���ݽ���<br></b>');
							try{
								addMsg('<b class="fontBlue">��ʼ���汾�ι鵵��Ϣ<br></b>');
								redoSaveArchiveInfo(tableStrucJsonArr,archiveId);
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
					processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);	
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};
	redoSaveArchiveInfo = function(tableStrucJsonArr,archiveId){
		var srcDB = tableStrucJsonArr.srcDB;
		var destDB = tableStrucJsonArr.destDB;
        var archiveId = archiveId;
		var archiveDesc = $("#ARCHIVE_DESC").val();
		var tableStr = "";
		$.each(tableStrucJsonArr.tableMap,function(){
			tableStr += this.srcTable+",";
		});
		addMsg("���ڱ��汾�ι鵵��Ϣ......");
		$.ajax({
			url: "redoSaveArchiveInfo.php",
			data: "srcDB="+srcDB+"&destDB="+destDB+"&tableStr="+tableStr.substring(0,tableStr.length-1)+"&archiveId="+archiveId,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">�ɹ���<br></b>');
					addProcess(1);
					try{
						addMsg('<b class="fontBlue">���汾�ι鵵��Ϣ����<br></b>');
						addMsg('<b class="fontGreen">���ݹ鵵�ɹ���ף��������죡<br></b>');
						processLoading.html('<b class="fontGreen">���ݹ鵵�ɹ���ף��������죡</b>');
						addBtn(result.flag);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">ʧ�ܣ�<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">���ݹ鵵ʧ�ܣ���������������־��</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};			
})(jQuery);	