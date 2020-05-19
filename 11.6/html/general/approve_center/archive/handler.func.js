;(function(win,$){
	var processBarWidth = 0;
	var processCount = 0;	
	var processWidth = 0;
	var logPath = "";
	var iframe = $('<iframe width=0 height=0 frameborder=0 scrolling="no" name="HiddenIframe"></iframe>').appendTo("body");
	var btnClose = $('<button class="btn">关闭</button>')
		.click(function(){
			win.msgLay.hide();
			win.overLay.hide();
			$("#btnConfirm").attr("disabled",false);
		});
	var btnLog = $('<button class="btn-green">导出日志</button>')
		.click(function(){
			exportLog();
		});
	
	var btnRetry = $('<button class="btn-blue">重试</button>')
		.click(function(){
			archiveWorkflow();
		});
	var btnErrorLog = $('<button class="btn-red">导出错误日志</button>')
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
			win.processLoading.html('<img src="/static/images/loading_gray_16.gif" align="absMiddle">&nbsp;正在归档，请耐心等候......');
			logPath = "";
			addMsg('<b class="fontBlue">开始数据归档，请您耐心等待</b><br>');
			addProcess(0);
			getTableStruc();
		}catch(e){
			addMsg(e.message);
			addBtn("failed");
		}
	};
	getTableStruc = function(){
        var archiveDesc = $("#ARCHIVE_DESC").val();
		addMsg("正在获取表结构......");
		$.ajax({
			url: "getTableStruc.php",
			data: "BEGIN_DATE="+$("#BEGIN_DATE").val()+"&archiveDesc="+encodeURIComponent(archiveDesc),
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
						addMsg('<b class="fontBlue">开始创建归档数据表</b><br>');
						createArchiveTable(0,result);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
		addMsg("正在创建"+destTable+"表......");
		$.ajax({
			url: "createArchiveTable.php",
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
							createArchiveTable(arrIndex,tableStrucJsonArr);
						}else {
							addMsg('<b class="fontBlue">创建归档数据表结束<br></b>');
							try{
								addMsg('<b class="fontBlue">开始复制归档数据<br></b>');
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
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
		addMsg("正在复制"+srcTable+"表的归档数据到"+destTable+"表......");
		$.ajax({
			url: "insertArchiveData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&archiveDate="+archiveDate,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							insertArchiveData(arrIndex,tableStrucJsonArr);
						}else {
							addMsg('<b class="fontBlue">复制归档数据结束<br></b>');
							try{
								addMsg('<b class="fontBlue">开始删除归档数据<br></b>');
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
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
				addMsg('<b class="fontBlue">删除归档数据结束<br></b>');
				try{
					addMsg('<b class="fontBlue">开始保存本次归档信息<br></b>');
					saveArchiveInfo(tableStrucJsonArr);
				}catch(e){
					addMsg(e.message);
					addBtn("failed");
				}
			}
			return;
		}
		addMsg("正在删除"+srcTable+"表的归档数据......");
		$.ajax({
			url: "deleteSourceData.php",
			data: "srcTable="+srcTable+"&destTable="+destTable+"&srcDB="+srcDB+"&destDB="+destDB+"&archiveDate="+archiveDate,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(processWidth);
					try{
						arrIndex++;
						if(arrIndex < tableStrucJsonArr.tableMap.length){
							deleteSourceData(arrIndex,tableStrucJsonArr);
						}else {
							addMsg('<b class="fontBlue">删除归档数据结束<br></b>');
							try{
								addMsg('<b class="fontBlue">开始保存本次归档信息<br></b>');
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
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
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
		addMsg("正在保存本次归档信息......");
		$.ajax({
			url: "saveArchiveInfo.php",
			data: "srcDB="+srcDB+"&destDB="+destDB+"&archiveDate="+archiveDate+"&archiveDesc="+encodeURIComponent(archiveDesc)+"&tableStr="+tableStr.substring(0,tableStr.length-1)+"&archiveId="+archiveId,
			type: "POST",
			async: true,
			success: function(result){
				if(result.flag === "success"){
					addMsg('<b class="fontGreen">成功！<br></b>');
					addProcess(1);
					try{
						addMsg('<b class="fontBlue">保存本次归档信息结束<br></b>');
						addMsg('<b class="fontGreen">数据归档成功，祝您工作愉快！<br></b>');
						win.processLoading.html('<b class="fontGreen">数据归档成功，祝您工作愉快！</b>');
						addBtn(result.flag);
					}catch(e){
						addMsg(e.message);
						addBtn("failed");
					}
				}else {
					addMsg('<b class="fontRed">失败！<br></b>');
					addMsg('<b class="fontRed">'+result.msg+'</b>');
					win.processLoading.html('<b class="fontRed">数据归档失败，请您导出错误日志！</b>');
					addBtn(result.flag);
				}
			},
			error: function(result){
				addMsg(result.responseText);
			}
		});			
	};			
})(window,jQuery);	