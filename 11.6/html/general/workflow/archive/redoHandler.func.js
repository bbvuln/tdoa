;(function($){
	var processBarWidth = 0;
	var processCount = 0;	
	var processWidth = 0;
	var logPath = "";
	var iframe = $('<iframe width=0 height=0 frameborder=0 scrolling="no" name="HiddenIframe"></iframe>').appendTo("body");
	var btnClose = $('<button class="btn">关闭</button>')
		.click(function(){
			overLay.hide();
			delLay.hide();
			$("#btnConfirm").attr("disabled",false);
		});
	var btnLog = $('<button class="btn-green">导出日志</button>')
		.click(function(){
			exportLog();
		});
	
	var btnRetry = $('<button class="btn-blue">重试</button>')
		.click(function(){
			reArchiveWorkflow();
		});
	var btnErrorLog = $('<button class="btn-red">导出错误日志</button>')
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
			processLoading.html('<img src="/static/images/loading_gray_16.gif" align="absMiddle">&nbsp;正在归档，请耐心等候......');
			logPath = "";
			addMsg('<b class="fontBlue">开始数据归档，请您耐心等待</b><br>');
			addProcess(0);
			redoGetTableStruc(archiveId);
		}catch(e){
			addMsg(e.message);
			addBtn("failed");
		}
	};
	redoGetTableStruc = function(archiveId){
        var archiveDesc = $("#ARCHIVE_DESC").val();
		addMsg("正在获取表结构......");
		$.ajax({
			url: "redoGetTableStruc.php",
			data: "archiveId="+archiveId,
			type: "POST",
			async: true,
			success: function(result){
				logPath = result.logPath;
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(1);
					try{
						processCount = result.tableMap.length*3-14;
						processWidth = 98/processCount;
						addMsg('<b class="fontBlue">开始验证归档数据表结构完整性</b><br>');
						redoCreateArchiveTable(0,result,archiveId);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
		addMsg("正在验证"+destTable+"表结构......");
		$.ajax({
			url: "redoCreateArchiveTable.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							redoCreateArchiveTable(arrIndex,tableStrucJsonArr,archiveId);
						}else {
							addMsg('<b class="fontBlue">验证归档数据表结构完整性结束<br></b>');
							try{
								addMsg('<b class="fontBlue">开始验证归档数据表数据完整性<br></b>');
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
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
		addMsg("正在验证"+destTable+"表数据......");
		$.ajax({
			url: "redoInsertArchiveData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&tablePostfix="+tablePostfix,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							redoInsertArchiveData(arrIndex,tableStrucJsonArr,archiveId);
						}else {
							addMsg('<b class="fontBlue">验证归档数据表数据完整性结束<br></b>');
							try{
								addMsg('<b class="fontBlue">开始删除归档数据<br></b>');
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
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
				addMsg('<b class="fontBlue">删除归档数据结束<br></b>');
				try{
					addMsg('<b class="fontBlue">开始保存本次归档信息<br></b>');
					// saveArchiveInfo(tableStrucJsonArr,archiveId);
				}catch(e){
					addMsg(e.message);
					addBtn("failed");
				}
			}
			return;
		}
		addMsg("正在删除"+srcTable+"表的归档数据......");
		$.ajax({
			url: "redoDeleteSourceData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&tablePostfix="+tablePostfix,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							redoDeleteSourceData(arrIndex,tableStrucJsonArr,archiveId);
						}else {
							addMsg('<b class="fontBlue">删除归档数据结束<br></b>');
							try{
								addMsg('<b class="fontBlue">开始保存本次归档信息<br></b>');
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
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
		addMsg("正在保存本次归档信息......");
		$.ajax({
			url: "redoSaveArchiveInfo.php",
			data: "srcDB="+srcDB+"&destDB="+destDB+"&tableStr="+tableStr.substring(0,tableStr.length-1)+"&archiveId="+archiveId,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(1);
					try{
						addMsg('<b class="fontBlue">保存本次归档信息结束<br></b>');
						addMsg('<b class="fontGreen">数据归档成功，祝您工作愉快！<br></b>');
						processLoading.html('<b class="fontGreen">数据归档成功，祝您工作愉快！</b>');
						addBtn(result.flag);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};			
})(jQuery);	