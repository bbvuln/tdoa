//分页
(function($){

	$.fn.jpage = function(config){
		init("#"+this.attr("id"),config);
	}
	
	function init(t,config){
		//公有变量
		var totalRecord = config.totalRecord > 0 ? config.totalRecord : 0; //总记录数																
		var perPage = config.perPage;				                               //每页显示记录数
		var ajaxUrl = config.ajaxUrl ;	                                   //数据代理地址
		var ajaxParam = config.ajaxParam;                                  //ajax的请求参数
	    var dataBody = config.dataBody;                                    //数据承载容器
	    var callback = config.callback;   
	    var cookieName = config.cookieName;                                 //ajax成功后回调函数
	    var debug;
	    if(typeof config.debug == "undefined")
	        debug = false;
	    else
	        debug = config.debug==false ? false : true;
	    //alert(config.callback.constructor);
		//私有变量
		var totalPage = Math.ceil(totalRecord/perPage);	                   //总页数
		var currentPage = 1;				                                       //当前页码
		var startRecord;																									 //每页起始记录
		var endRecord;	 																									 //每页结束记录
	
		var toolbar = '';
		var msg1 = '<input type="text" title='+td_lang.inc.msg_48+' class="SmallInput pgPerPage" size="5" value="'+perPage+'">';
		var msg3 = '<input class="SmallInput pgCurrentPage" size="5" type="text" value="'+currentPage+'" title='+td_lang.inc.msg_49+' />';
		toolbar += '<div class="pgPanel">';
		var msg2 = sprintf(td_lang.inc.msg_120,msg1);
		var msg4 = sprintf(td_lang.inc.msg_121,msg3,'<span class="pgTotalPage">'+totalPage+'</span>');
		toolbar += '<div>'+msg2+'</div>';//每页 <input type="text" title='+td_lang.inc.msg_48+'class="SmallInput pgPerPage" size="5" value="' + perPage +'"> 条
		toolbar += '<div class="separator"></div>';
		toolbar += '<div class="pgBtn pgFirst" title='+td_lang.global.first_page+'></div>';
		toolbar += '<div class="pgBtn pgPrev" title='+td_lang.global.before_page+'></div>';
		toolbar += '<div class="separator"></div>';
		toolbar += '<div>'+msg4+'</div>';
		toolbar += '<div class="separator"></div>';
		toolbar += '<div class="pgBtn pgNext" title='+td_lang.global.next_page+'></div>';
		toolbar += '<div class="pgBtn pgLast" title='+td_lang.global.last_page+'></div>';
		toolbar += '<div class="separator"></div>';
		toolbar += '<div class="pgBtn pgRefresh" title='+td_lang.global.refresh_1+'></div>';
		toolbar += '<div class="separator"></div>';
		var msg5 = sprintf(td_lang.inc.msg_122,'&nbsp;'+totalRecord+'&nbsp;','&nbsp;<span class="pgStartRecord">'+startRecord+'</span>&nbsp;','&nbsp;<span class="pgEndRecord">'+endRecord+'</span>&nbsp;');
		toolbar += '<div class="pgSearchInfo">'+msg5+'</div>';
		toolbar += '</div>';
		//alert(toolbar);
	  $(t).html(toolbar);
	
	  var dataContainer =$("#"+dataBody);
	  
		var btnRefresh = $(t+" .pgRefresh");														//刷新按钮
		var btnNext =$(t+" .pgNext");																	 //下一页按钮
		var btnPrev = $(t+" .pgPrev");																	//上一页按钮
		var btnFirst = $(t+" .pgFirst");																//首页按钮
		var btnLast = $(t+" .pgLast");																	//末页按钮
		var btnGo = $(t+" .pgNext,"+t+" .pgLast");
		var btnBack = $(t+" .pgPrev,"+t+" .pgFirst");
		var btn = $(t+" .pgFirst,"+t+" .pgPrev,"+t+" .pgNext,"+t+" .pgLast");
	
		var valCurrentPage = $(t+" .pgCurrentPage");
		var valStartRecord = $(t+" .pgStartRecord");
		var valEndRecord =$(t+" .pgEndRecord");	
		var valPerPage = $(t+" .pgPerPage");
		var valTotalPage = $(t+" .pgTotalPage");
	
		$(t+" .pgPerPage").attr("value",perPage);
		getStartEnd();
		getRemoteData();
	
	
		//刷新按钮监听
		btnRefresh.bind("mousedown",pressHandler).bind("mouseup",unpressHandler).bind("mouseout",unpressHandler);
	
		//刷新工具栏
		refresh();
		
		//按钮监听
		btnNext.click(
			function(){
				if(currentPage < totalPage){
						currentPage += 1;
						getStartEnd();
						getRemoteData();
						refresh();
				}
			}
		);	
		btnPrev.click(
			function(){
				if(currentPage > 1){
						currentPage -= 1;
						getStartEnd();
						getRemoteData();
						refresh();
				}
			}
		);
		btnFirst.click(
			function(){
				if(currentPage > 1){
						currentPage = 1;
						getStartEnd();
						getRemoteData();
						refresh();
					}
			}
		);
		btnLast.click(
			function(){
				if(currentPage < totalPage){
						currentPage = totalPage;
						getStartEnd();
						getRemoteData();
						refresh();
				   }
			  }
		);
		btnRefresh.click(
			function(){
	      perPage = parseInt(valPerPage.val());
	      currentPage = 1;	
				totalPage = Math.ceil(totalRecord/perPage);
				getStartEnd();
				getRemoteData();
				refresh();
			}
		);
		
		//页码输入框监听
		valCurrentPage.keydown(
			function(){
				var targetPage = parseInt($(this).val());
				if(event.keyCode==13 && targetPage>=1 && targetPage<=totalPage){
						currentPage = targetPage;
						getStartEnd();
						getRemoteData();
						refresh();
				}
		  }
		);
		
		valPerPage.keydown(
			function(){
				if(event.keyCode==13)
				{
	  			perPage = parseInt($(this).val());
	  			if(perPage>99)
	  			{
	  				 msg=td_lang.inc.msg_46;//'此操作会导致比较缓慢,确定要执行吗?'
	           if(!window.confirm(msg))
	           	 return;
	        }
	        else if(perPage==0 || perPage%1!=0)
	        {
	        	alert(td_lang.inc.msg_48);//"请输入有效数字!"
	        	return;
	        }
	        //存入cookie
	        var exp = new Date();
	        exp.setTime(exp.getTime() + 24*60*60*1000);
	        document.cookie = cookieName+"="+ perPage + ";expires=" + exp.toGMTString()+";path=/";
	  			currentPage = 1; //设定每页显示数量
	  			totalPage = Math.ceil(totalRecord/perPage);  
	  			getStartEnd();
	  			getRemoteData();
	  			refresh();
			  }		
			}
		);
		
		/*********************************init私有函数***************************************************/
		/**
		   * 置为正在检索状态
		   */
		function startLoad(){
			$(t+" .pgRefresh").addClass("pgLoad");
			$(t+" .pgSearchInfo").html(td_lang.inc.msg_50);//"读取数据中，请稍候..."
		}
		
		/**
		   * 置为结束检索状态
		   */
		function overLoad(){
			var msg5 = sprintf(td_lang.inc.msg_123,'&nbsp;'+totalRecord+'&nbsp;','&nbsp;<span class="pgStartRecord">'+startRecord+'</span>&nbsp;','&nbsp;<span class="pgEndRecord">'+endRecord+'</span>&nbsp;');
			$(t+" .pgRefresh").removeClass("pgLoad");
			$(t+" .pgSearchInfo").html(msg5);
		}
	
		/**
		   * 获得远程数据
		   */
		function getRemoteData(){
			if(ajaxUrl.indexOf("?")>0)
			   ajaxUrl += "&";
			else
			   ajaxUrl += "?";
			$.ajax(
				{
					type: "POST",
					url: ajaxUrl + "startrecord="+startRecord+"&endrecord="+endRecord ,
					data: ajaxParam,
					cache: false,
					timeout: 30000,
					beforeSend: function(){
						startLoad();
					},
					success: function(data,msg){
						//eval(msg);
						//document.write(data);
					    if(debug)
					        alert(data);
					    dataContainer.html(data);
						refresh();
						overLoad();
						if(typeof callback=="function")
						  (callback)();
					},
					error: function(){
						alert(td_lang.inc.msg_51);//"请求失败或超时，请稍后再试！"
						overLoad();
						return;
					}
				}
			);
		}
		
		/**
		   * 获得当前页开始结束记录
		   */
		function getStartEnd(){
				startRecord = (currentPage-1)*perPage+1;
				endRecord = Math.min(currentPage*perPage,totalRecord);
		}
	
		/**
		   * 刷新工具栏状态
		   */
		function refresh(){
			valCurrentPage.val(currentPage);
			valStartRecord.html(startRecord);
			valEndRecord.html(endRecord);
			valTotalPage.html(totalPage);
			
			btn.unbind("mousedown",pressHandler);
			btn.bind("mouseup",unpressHandler);
			btn.bind("mouseout",unpressHandler);
			if(totalPage==1){
				btnNext.addClass("pgNextDisabled");
				btnLast.addClass("pgLastDisabled");
				btnPrev.addClass("pgPrevDisabled");
				btnFirst.addClass("pgFirstDisabled");
			}
			else if(currentPage == totalPage){
				enabled();
				btnBack.bind("mousedown",pressHandler);
				btnNext.addClass("pgNextDisabled");
				btnLast.addClass("pgLastDisabled");
			}else	if(currentPage == 1){
				enabled();
				btnGo.bind("mousedown",pressHandler);
				btnPrev.addClass("pgPrevDisabled");
				btnFirst.addClass("pgFirstDisabled");
			}else{
				enabled();
				btnBack.bind("mousedown",pressHandler);
				btnGo.bind("mousedown",pressHandler);
				btnNext.addClass("pgNext");
				btnPrev.addClass("pgPrev");
				btnFirst.addClass("pgFirst");
				btnLast.addClass("pgLast");
			}
		}
		
		/**
		   * 移除按钮disabled状态样式
		   */
		function enabled(){
				btnNext.removeClass("pgNextDisabled");
				btnPrev.removeClass("pgPrevDisabled");
				btnFirst.removeClass("pgFirstDisabled");
				btnLast.removeClass("pgLastDisabled");
		}
	
		/**
		   * 添加按钮按下状态样式
		   */
		function pressHandler(){
			$(this).addClass("pgPress");
		}
	
		/**
		   * 移除按钮按下状态样式
		   */
		function unpressHandler(){
			$(this).removeClass("pgPress");
		}
	
	}
})(jQuery);