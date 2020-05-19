//��ҳ
(function($){

	$.fn.jpage = function(config){
		init("#"+this.attr("id"),config);
	}
	
	function init(t,config){
		//���б���
		var totalRecord = config.totalRecord > 0 ? config.totalRecord : 0; //�ܼ�¼��																
		var perPage = config.perPage;				                               //ÿҳ��ʾ��¼��
		var ajaxUrl = config.ajaxUrl ;	                                   //���ݴ����ַ
		var ajaxParam = config.ajaxParam;                                  //ajax���������
	    var dataBody = config.dataBody;                                    //���ݳ�������
	    var callback = config.callback;   
	    var cookieName = config.cookieName;                                 //ajax�ɹ���ص�����
	    var debug;
	    if(typeof config.debug == "undefined")
	        debug = false;
	    else
	        debug = config.debug==false ? false : true;
	    //alert(config.callback.constructor);
		//˽�б���
		var totalPage = Math.ceil(totalRecord/perPage);	                   //��ҳ��
		var currentPage = 1;				                                       //��ǰҳ��
		var startRecord;																									 //ÿҳ��ʼ��¼
		var endRecord;	 																									 //ÿҳ������¼
	
		var toolbar = '';
		var msg1 = '<input type="text" title='+td_lang.inc.msg_48+' class="SmallInput pgPerPage" size="5" value="'+perPage+'">';
		var msg3 = '<input class="SmallInput pgCurrentPage" size="5" type="text" value="'+currentPage+'" title='+td_lang.inc.msg_49+' />';
		toolbar += '<div class="pgPanel">';
		var msg2 = sprintf(td_lang.inc.msg_120,msg1);
		var msg4 = sprintf(td_lang.inc.msg_121,msg3,'<span class="pgTotalPage">'+totalPage+'</span>');
		toolbar += '<div>'+msg2+'</div>';//ÿҳ <input type="text" title='+td_lang.inc.msg_48+'class="SmallInput pgPerPage" size="5" value="' + perPage +'"> ��
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
	  
		var btnRefresh = $(t+" .pgRefresh");														//ˢ�°�ť
		var btnNext =$(t+" .pgNext");																	 //��һҳ��ť
		var btnPrev = $(t+" .pgPrev");																	//��һҳ��ť
		var btnFirst = $(t+" .pgFirst");																//��ҳ��ť
		var btnLast = $(t+" .pgLast");																	//ĩҳ��ť
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
	
	
		//ˢ�°�ť����
		btnRefresh.bind("mousedown",pressHandler).bind("mouseup",unpressHandler).bind("mouseout",unpressHandler);
	
		//ˢ�¹�����
		refresh();
		
		//��ť����
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
		
		//ҳ����������
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
	  				 msg=td_lang.inc.msg_46;//'�˲����ᵼ�±Ƚϻ���,ȷ��Ҫִ����?'
	           if(!window.confirm(msg))
	           	 return;
	        }
	        else if(perPage==0 || perPage%1!=0)
	        {
	        	alert(td_lang.inc.msg_48);//"��������Ч����!"
	        	return;
	        }
	        //����cookie
	        var exp = new Date();
	        exp.setTime(exp.getTime() + 24*60*60*1000);
	        document.cookie = cookieName+"="+ perPage + ";expires=" + exp.toGMTString()+";path=/";
	  			currentPage = 1; //�趨ÿҳ��ʾ����
	  			totalPage = Math.ceil(totalRecord/perPage);  
	  			getStartEnd();
	  			getRemoteData();
	  			refresh();
			  }		
			}
		);
		
		/*********************************init˽�к���***************************************************/
		/**
		   * ��Ϊ���ڼ���״̬
		   */
		function startLoad(){
			$(t+" .pgRefresh").addClass("pgLoad");
			$(t+" .pgSearchInfo").html(td_lang.inc.msg_50);//"��ȡ�����У����Ժ�..."
		}
		
		/**
		   * ��Ϊ��������״̬
		   */
		function overLoad(){
			var msg5 = sprintf(td_lang.inc.msg_123,'&nbsp;'+totalRecord+'&nbsp;','&nbsp;<span class="pgStartRecord">'+startRecord+'</span>&nbsp;','&nbsp;<span class="pgEndRecord">'+endRecord+'</span>&nbsp;');
			$(t+" .pgRefresh").removeClass("pgLoad");
			$(t+" .pgSearchInfo").html(msg5);
		}
	
		/**
		   * ���Զ������
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
						alert(td_lang.inc.msg_51);//"����ʧ�ܻ�ʱ�����Ժ����ԣ�"
						overLoad();
						return;
					}
				}
			);
		}
		
		/**
		   * ��õ�ǰҳ��ʼ������¼
		   */
		function getStartEnd(){
				startRecord = (currentPage-1)*perPage+1;
				endRecord = Math.min(currentPage*perPage,totalRecord);
		}
	
		/**
		   * ˢ�¹�����״̬
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
		   * �Ƴ���ťdisabled״̬��ʽ
		   */
		function enabled(){
				btnNext.removeClass("pgNextDisabled");
				btnPrev.removeClass("pgPrevDisabled");
				btnFirst.removeClass("pgFirstDisabled");
				btnLast.removeClass("pgLastDisabled");
		}
	
		/**
		   * ��Ӱ�ť����״̬��ʽ
		   */
		function pressHandler(){
			$(this).addClass("pgPress");
		}
	
		/**
		   * �Ƴ���ť����״̬��ʽ
		   */
		function unpressHandler(){
			$(this).removeClass("pgPress");
		}
	
	}
})(jQuery);