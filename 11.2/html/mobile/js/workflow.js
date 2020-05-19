$(document).ready(function(){
   pageInit(1);   
});

//点击列表主办该工作
$("#workflow_list li").live("click", function(){
   $$a = $(this);
   //全局变量
   q_run_id      = $$a.attr("q_run_id");
   q_flow_id     = $$a.attr("q_flow_id");
   q_prcs_id     = $$a.attr("q_prcs_id");
   q_flow_prcs   = $$a.attr("q_flow_prcs");
   q_prcs_key_id = $$a.attr("q_prcs_key_id");
   q_op_flag     = $$a.attr("q_op_flag");
   
   editWorkFlow();
   /*
   if($$a.attr("q_op_flag") == 1)
   {
   	editWorkFlow();
	}
	else
	{
		pre_page = 1;
		signWorkFlow();
	}
	*/     
});

//主办工作
function editWorkFlow()
{
   
   $.ajax({
      type: 'GET',
      url: 'edit.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID': q_prcs_key_id},
      beforeSend: function(){
         $.ProLoading.show();
      },
      success: function(data)
      {
      	//alert(data);
         fileReadPage = 2;
         pre_page = 2;
         $.ProLoading.hide();
         if(data == "NOEDITPRIV"){
            //showMessage(noeditpriv);
            //return;
            showPageMessage(noeditpriv);
            delete_flow();
            return;
         }else{
            $("#page_2 > #wrapper_2 > #scroller_2").empty().append(data);
            $("#page_2").show('fast',function(){
               pageInit(2);
               $("#page_2 .container .read_detail:last").addClass("endline");
            });
            $("#header div[id^='header_']").hide();
            $("#header_2").show();
         }
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });
}

//获取表单界面内容
function getflowContent()
{
   $.ajax({
      type: 'GET',
      url: 'form.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data)
      {
         pre_page = 3;
         fileReadPage = 3;
         $.ProLoading.hide();
         if(data == "NOREADFLOWPRIV"){
            //showMessage(noreadflowpriv);
            //return;
            showPageMessage(noreadflowpriv);
            delete_flow();
            return;        
         }else{
            $("#page_3 > #wrapper_3 > #scroller_3").empty().append(data);
            $("#page_3").show('fast',function(){
               pageInit(3);
               $("#page_3 .container .read_detail:last").addClass("endline");
            });
            $("#header_2").hide();
            $("#header_3").show();
         }
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });
}

//获取原始表单内容
function showOriginalForm()
{
	$.ajax({
		type: 'GET',
		url: 'original_form.php',
		cache: false,
		data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'OP_FLAG': q_op_flag},
		beforeSend: function(){
			$.ProLoading.show();       
		},
		success: function(data){
			pre_page = 9;
			fileReadPage = 9;
			$.ProLoading.hide();
			if(data == "NOREADFLOWPRIV"){
				//showMessage(noreadflowpriv);
	            //return;
				showPageMessage(noreadflowpriv);
				delete_flow();
				return;        
			}else{
				$("#page_9 > #wrapper_9 > #scroller_9").empty().append(data);
				$("#page_9").show('fast',function(){
					pageInit(9);
					//$("#page_9 .container .read_detail:last").addClass("endline");
				});
				$("#header_2").hide();
				$("#header_9").show();
			}
		},
		error: function(data){
			$.ProLoading.hide();  
			showMessage(getfature);
		}
	});
}

function turnWorkFlow()
{
   //lp 2012/4/23 15:14:40 转交时增加保存
   saveWorkFlow('ISFORMTURN'); 
   
   TOP_FLAG = $("input[name='TOP_FLAG']").val(); 
   $.ajax({
      type: 'GET',
      url: 'turn.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'TOP_FLAG': TOP_FLAG},
      beforeSend: function(){
         $.ProLoading.show();      
      },
      success: function(data)
      {
         $.ProLoading.hide();
         
         if(data == "NOEDITPRIV"){
            showPageMessage(noeditpriv);
            delete_flow();
            return;  
         }else if(data == "NOSIGNFLOWPRIV"){
            showPageMessage(nosignflowpriv);
            delete_flow();
            return;   
         }else if(data == "NORIGHTNEXTPRCS"){
            showPageMessage(norightnextprcs);
            return;   
         }else if(data == "NOSETNEWPRCS"){
            showPageMessage(norightnextprcs);
            return; 
         }
         
         $("#page_5 > #wrapper_5 > #scroller_5").empty().append(data);
         $(".pages").hide();
         $("#page_5").show('fast',function(){
            pageInit(5);
            $("#page_5 .container .read_detail:last").addClass("endline");
         });
         $("#header div[id^='header_']").hide();
         $("#header_5").show();
      },
      error: function(data){
         $.ProLoading.hide(); 
         showMessage("获取失败");
      }
   });
}
/**
 * 获取会签界面内容
 */
function signWorkFlow(){
   $.ajax({
      type: 'GET',
      url: 'sign.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id, 'OP_FLAG': q_op_flag},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data){
         $.ProLoading.hide();
         $("#page_4 > #wrapper_4 > #scroller_4").empty().append(data);
         $("#page_4").show('fast',function(){
            pageInit(4);
            $("#page_4 .container .read_detail:last").addClass("endline");
         });
         
         //lp 2012/4/17 16:14:03 增加办理完毕功能
         if(q_op_flag == 0){
         			
         }
         
         $("#header div[id^='header_']").hide();
         $("#header_4").show();
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage("获取失败");
      }
   });
}

//会签的保存
function saveSignWorkFlow(){
   $$CONTENT = $("#CONTENT");
   var CONTENT = $$CONTENT.val();
   if(CONTENT == ""){
      return;
   }
   $.ajax({
      type: 'GET',
      url: 'sign_submit.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'CONTENT':CONTENT},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data){
         $.ProLoading.hide();
         /*
         if(data == "NOSIGNFLOWPRIV"){
            showPageMessage(norightnextprcs);
            delete_flow();
            return;   
         }
         */
         /*
         else if(data == "SIGNISNOTEMPTY"){
            $$CONTENT.focus();
            return;
         }
         */
         /*
         else{
            //showMessage(signsuccess);
            //signWorkFlow();
            return;   
         }
         */
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage("获取失败");
      }
   });   
}

//会签办理完毕
function stopWorkFlow(){
   $.ajax({
      type: 'GET',
      url: 'stop.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data){
         $.ProLoading.hide();
         if(data == "NOSUBEDITPRIV"){
            showPageMessage(nosubeditpriv);
            delete_flow();
            return;   
         }else if(data == "WORKDONECOMPLETE"){
         	showPageMessage(workdonecomplete);
            delete_flow();
            return;
         }else if(data == "TURNNEXT"){
            showMessage(workdonecomplete);
            setTimeout(function(){turnWorkFlow();},2000);
            return;   
         }
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage("获取失败");
      }
   });
}

// 获取回退页面
function selWorkFlow() {
	$.ajax({
		type : 'GET',
		url : 'sel_back.php',
		cache : false,
		data : {
			'P': p,
			'RUN_ID' : q_run_id,
			'FLOW_ID' : q_flow_id,
			'PRCS_ID' : q_prcs_id,
			'FLOW_PRCS' : q_flow_prcs
		},
		beforeSend : function() {
			$.ProLoading.show();
		},
		success : function(data) {
			$.ProLoading.hide();
			$("#page_10 > #wrapper_10 > #scroller_10").empty().append(data);
			$("#page_10").show('fast', function() {
				pageInit(10);
			});
			$("#header div[id^='header_']").hide();
			$("#header_10").show();

		},
		error : function(data) {
			$.ProLoading.hide();
			showMessage("获取失败");
		}
	});
}

//执行回退操作
function goOnSelBackWorkFlow()
{
	// 会签内容
	var CONTENT = $("#CONTENT_BACK").val();
	// 回退步骤
	var sel_back_prcs = "";
	$("input[name='PRCS']").each(function(i) {
		if (this.checked == true) {
			sel_back_prcs = this.value;
		}
	});

	if (sel_back_prcs == "") {
		showMessage(notselectedstep);
		return;
	}

	$.ajax({
		type : 'GET',
		url : 'go_back.php',
		cache : false,
		data : {
			'P': p,
			'RUN_ID' : q_run_id,
			'FLOW_ID' : q_flow_id,
			'PRCS_ID' : q_prcs_id,
			'FLOW_PRCS' : q_flow_prcs,
			'PRCS_KEY_ID' : q_prcs_key_id,
			'FLOW_PRCS_LAST' : sel_back_prcs,
			'CONTENT' : CONTENT
		},
		beforeSend : function() {
			$.ProLoading.show();
		},
		success : function(data) {
			$.ProLoading.hide();

			if (data == "WORKHASNOTGOBACK") {
				showMessage(workhasnotgoback);
				return;
			} else if (data == "WORKHASGOBACK") {
				showPageMessage(workhasgoback);
				$("#page_10").hide();
				delete_flow();
				return;
			}

			/*
			 * $("#page_7 > #wrapper_7 > #scroller_7").empty().append(data);
			 * $("#page_7").show('fast',function(){pageInit(7);}); $("#header
			 * div[id^='header_']").hide(); $("#header_7").show();
			 */
		},
		error : function(data) {
			$.ProLoading.hide();
			showMessage(getfature);
		}
	});
}

/**
 * 获取选择下一步骤界面内容
 */
function goOnWorkFlow(){
   action = $("input[name='turn_action']").val();
   var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']").val();
   if(prcs_id_next == '' || typeof(prcs_id_next) == 'undefined' ){return ;}
   $.ajax({
      type: 'GET',
      url: action,
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id, 'PRCS_ID_NEXT': prcs_id_next},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data)
      {
         $.ProLoading.hide(); 
         if(data == "NONEXTPRCS"){
            showPageMessage(nonextprcs);
            return;   
         }else if(data == "NOEDITPRIV"){
            showPageMessage(noeditpriv);
            return;  
         }else if(data == "NOSIGNFLOWPRIV"){
            showPageMessage(nosignflowpriv);
            return;
         }else if(data == "WORKCOMPLETE"){
            showPageMessage(workcomplete);
            delete_flow();
            return;   
         }
         
         if(prcs_id_next == 0){
            showPageMessage(data); 
         }else{
            $("#page_6 > #wrapper_6 > #scroller_6").empty().append(data);
            $("#page_6").show('fast',function(){pageInit(6);});
            $("#header div[id^='header_']").hide();
            $("#header_6").show();
         }
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage("获取失败");
      }
   });
}

/**
 * 获取选择下一步骤办理人界面内容
 */
function turnUserWorkFlow(){
   
   var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']").val();
   if(prcs_id_next == "")
   {
      showMessage(error);
      return;
   }else{
      prcs_id_next = decodeURIComponent(prcs_id_next);   //添加URL解码，兼容部分浏览器  
   }
	var POST_STR = "RUN_ID="+q_run_id+"&FLOW_ID="+q_flow_id+"&PRCS_ID="+q_prcs_id+"&FLOW_PRCS="+q_flow_prcs+"&PRCS_KEY_ID="+q_prcs_key_id+"&PRCS_ID_NEXT="+prcs_id_next;
	var prcs_id_next_arr = prcs_id_next.split(",");

   var _continue = true;
   var _error_step = 0;
	$.each(prcs_id_next_arr, function(key, val){
		if(val)
		{
		   var _zbems = $("#USER_ZB_" + val).find("em");
		   var _cbems = $("#USER_CB_" + val).find("em");
		   		   
		   //判断是否允许主办为空的情况
		   if(eval("typeof(allow_zb_isnull_"+val+") !=\"undefined\""))
		   {
   		   if(eval("allow_zb_isnull_"+val+" == '0'"))
   		   {
   		      if(_zbems.length == 0)
   		      {
   		         _continue = false;
   		         _error_step = val;
   		         errorblmsg = errorzbisnotnull;
		         }
   		   }else{
   		      if(_zbems.length == 0 && _cbems.length == 0)
   		      {
      		      _continue = false;
                  _error_step = val;
                  errorblmsg = errorblisnotnull;
               }
   		   }
		   }
		   
		   if(_zbems.length > 0)
		   {
			   //新版拼接主办人字符串
			   POST_STR += "&PRCS_USER_OP_" + val + "=" + $("#USER_ZB_" + val).find("em").attr("userid");
		   }
		   
			//新版经办人拼接
			var PRCS_USER_TMP = "";
			if(_cbems.length > 0)
		   {
   			$("#USER_CB_" + val).find("em").each(function()
   			{
   	    	  PRCS_USER_TMP += $(this).attr("userid") + ",";
   			});
   			POST_STR += "&PRCS_USER_" + val + "=" + PRCS_USER_TMP;
		   }
           
           if(document.getElementById("SMS_REMIND_NEXT"))
		  {
		  	  if(document.getElementById("SMS_REMIND_NEXT").checked){
			  	POST_STR += "&SMS_REMIND_NEXT=1";
			  }else{
			  	POST_STR += "&SMS_REMIND_NEXT=2";
			  }
		  }
		}
	});
	
	if(!_continue)
	{
	   showMessage(sprintf(errorblmsg,_error_step));
	   return;   
	}
   
   $.ajax({
      type: 'POST',
      url: 'turn_submit.php',
      cache: false,
      data: POST_STR+"&P="+p,
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data)
      {
         $.ProLoading.hide();
         
         if(data == "NOEDITPRIV"){
            showPageMessage(noeditpriv);
            return;  
         }else if(data == "NOSIGNFLOWPRIV"){
            showPageMessage(nosignflowpriv);
            return;   
         }else if(data == "WORKCOMPLETE"){
            showPageMessage(workcomplete);
            delete_flow();
            return;   
         }else if(data == "WORKHASTURNNEXT"){
            showPageMessage(workhasturnnext);
            delete_flow();
            return; 
         }
         
         /*
            $("#page_7 > #wrapper_7 > #scroller_7").empty().append(data);
            $("#page_7").show('fast',function(){pageInit(7);});
            $("#header div[id^='header_']").hide();
            $("#header_7").show();   
         */
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });
   
}

//保存表单
function saveWorkFlow(a){
   saveSignWorkFlow();
   var data = $("#edit_from").serialize();
   $.ajax({
      type: 'POST',
      url: 'edit_submit.php',
      cache: false,
      async: false,
      data: data + "&P="+p,
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data)
      {
         $.ProLoading.hide();
         //lp 2012/4/23 15:17:28 如果是从主办转交则保存，不跳转页面
         if(a) return;
         $.ajax({
            type: 'GET',
        	url: 'sign.php',
        	cache: false,
        	data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id, 'OP_FLAG': q_op_flag},
        	success: function(dataSign)
            {
        		$("#CONTENT").val("");
        		$("#editSignBox").empty().append(dataSign);
        		showMessage(formsuccess);
        		oiScroll_2.refresh();
            }
         })
         /*
         if(data == "NOEDITPRIV"){
            showPageMessage(noeditpriv);
            return;  
         }else{
            $("#page_8 > #wrapper_8 > #scroller_8").empty().append(data);
            $("#page_8").show('fast',function(){pageInit(8);});
            $("#header div[id^='header_']").hide();
            $("#header_8").show();   
         }
         */
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });     
}

//保存表单之后继续编辑
function continueEditFlow(){
   $.ajax({
      type: 'GET',
      url: 'edit.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id},
      beforeSend: function(){
         $.ProLoading.show();
      },
      success: function(data)
      {
         fileReadPage = 2;
         pre_page = 2;
         $.ProLoading.hide();
         $("#page_8").hide();
         if(data == "NOEDITPRIV"){
            //showMessage(noeditpriv);
            //return;
            showPageMessage(noeditpriv);
            delete_flow();
            return;
         }else{ 
            $("#page_2 > #wrapper_2 > #scroller_2").empty().append(data);
            $("#page_2").show('fast',function(){
               pageInit(2);
               $("#page_2 .container .read_detail:last").addClass("endline");
            });
            $("#header div[id^='header_']").hide();
            $("#header_2").show();
         }
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });      
}

function delete_flow()
{
   if(q_run_id!="")
   {
      refreshList();
      
      $("#workflow_list li").each(function(){
         if($(this).attr("q_run_id") == q_run_id && $(this).attr("q_prcs_id") == q_prcs_id)
            $(this).remove();
      });
   }
}

function showPageMessage(str){
   $("div[id^='page_']").hide();
   $("#page_7 > #wrapper_7 > #scroller_7").empty().append(reMakeMessage(str));
   $("#page_7").show('fast',function(){pageInit(7);});
   $("#header div[id^='header_']").hide();
   
   $("#header_7").show();
}

//2012/4/26 15:39:29 lp 刷新列表
function refreshList(){
   var $$page_dom = $("#page_1");
   var oUl = $$page_dom.find("#workflow_list");
   var lastedId =  oUl.find("li:first").attr("q_id");
   if(!lastedId) return;
	$.get(
		"/mobile/inc/getdata.php",
		{'A':"GetNew", 'STYPE':stype, "P":p, "LASTEDID": lastedId},
		function(m)
		{
			alert(p);
			return;
			if(m == "NONEWDATA")
			{
			   //showMessage(nonewdata);
			}else{
				var size = $("<ul>"+m+"</ul>").find("li").size();
            var osize = oUl.find("li").size();
            
            if(osize == 0)
               $$page_dom.find(".no_msg").hide();
                  
            oUl.prepend(m);
			}
		}
	);
}

//2012/6/18 2:52:29 lp 工作流选人扩展搜索
$.extend({
   workFlowSearch: function (options) 
   {
      var url = '/mobile/inc/get_contactlist.php';              
      var input = options.input;
      var list = options.list;
      var appendDom_zb = options.appendDom_zb;
      var appendDom_cb = options.appendDom_cb;
      var showbtn = options.showbtn;
      var nodate = options.nodate;
      var pageScroll = options.pageScroll;
      
      var $$input = $(input);
      var $$list = $(list);
      var orgHtml = $(list).html();
      var $$showbtn = $(showbtn);
      var $$nodate = $(nodate);
      
      var _tmp_key;
      var searchInterval = null;
      
      function init()
      {
         $$input.focus(function(e){
            //orgHtml = $(list).html();
            e.stopPropagation(); 
            searchInterval = null;
            searchInterval = window.setInterval(search_name,1000);
            $(this).addClass("hasNoBackGround");
         });
         
         $$input.blur(function(){
            if($(this).val() == '')
               $(this).removeClass("hasNoBackGround");
            window.clearInterval(searchInterval);
            searchInterval = null;
         });
         
         //2012/6/24 13:24:11 lp 绑定主办按钮点击事件
         $$list.find("a.ui-li-text-a").die("click").live("click",function(e)
         {
            e.stopPropagation();
            if($(this).hasClass("current"))
            {
               $(this).removeClass("current");
               $(this).parents("li").removeClass("active");
               remove_user("zb",$(this).parents("li"));
               return;  
            }else{
               if($(appendDom_zb).find("em").length > 0)
               {
                  var uid = $(appendDom_zb).find("em").attr("uid");
                  remove_user("onlyzb",uid);
                  
                  //$$list.find("a.current").parents("li").removeClass("active");
                  $$list.find("a.current").removeClass("current");   
               }
               
               $(this).parents("li").addClass("active");
               $(this).addClass("current");
               add_user("zb",$(this).parents("li"));
               return;
            }
         });
         
         //2012/6/24 13:24:11 lp 绑定列表点击事件
         $$list.find("li").die("click").live("click",function()
         {
            if($(this).hasClass("active"))
            {
               $(this).removeClass("active");
               currentA = $(this).find("a.current");
               if(currentA.length > 0)
               {
                  currentA.removeClass("current");
                  remove_user("zb", $(this));
                  return;                 
               }else{
                  remove_user("cb", $(this));
                  return;      
               }
            }else{
               $(this).addClass("active");
               that = $(this);
               _uid = that.attr("q_id");
               var haszb = hascb = false;
               if($(appendDom_zb).find("em").length > 0)
               {
                  $(appendDom_zb).find("em").each(function(){
                     if($(this).attr("uid") == _uid)
                     {
                        that.addClass("active");
                        that.find("a.ui-li-text-a").addClass("current");
                        haszb = true;
                        return false;   
                     }
                  });
                  
                  $(appendDom_cb).find("em").each(function(){
                     if($(this).attr("uid") == _uid)
                     {
                        that.addClass("active");
                        hascb = true; 
                        return false;
                        return;
                     }   
                  });
                  
                  //主办和从办都没有选择该人的时候，加入该人
                  if(!hascb && !hascb)
                  {
                     add_user("cb", $(this));
                  }
                  return;       
               }else{
                  $(this).find("a.ui-li-text-a").addClass("current");   
                  add_user("zb", $(this));
                  return;  
               }   
            }      
         });
         
         //2012/6/24 22:14:06 lp 绑定主办人的删除操作
         var appendDom_zb_oems = $(appendDom_zb).find("em");
         var appendDom_zb_ospans = $(appendDom_zb).find("em span");
         appendDom_zb_oems.die("click").live("click",function(e)
         {
            e.stopPropagation();
            if(!$(this).hasClass("active"))
            {
               $(appendDom_zb).find("em").removeClass("active");
               $(appendDom_zb).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
               $(this).addClass("active");
               $(this).find("span").animate({width: '16'},{complete: function(){$(this).show();}, duration: 200 });
            }else{
               $(this).removeClass("active");
               $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
            }
         });
         
         appendDom_zb_ospans.die("click").live("click",function(e)
         {
            e.stopPropagation();
            var emP = $(this).parent("em");
            emP.remove();
            
            //同时删除列表数据中主办对应的颜色
            var uid = emP.attr("uid");
            $$list.find("li").each(function()
            {
               if($(this).attr("q_id") == uid)
               {
                  $(this).find("a.ui-li-text-a").removeClass("current");
                  return false;
               } 
            });
            return;     
         });
         
         //2012/6/24 22:14:06 lp 绑定经办人的删除操作
         var appendDom_cb_oems = $(appendDom_cb).find("em");
         var appendDom_cb_ospans = $(appendDom_cb).find("em").find("span");
         appendDom_cb_oems.die("click").live("click",function(e)
         {
            e.stopPropagation();
            if(!$(this).hasClass("active"))
            {
               $(appendDom_cb).find("em").removeClass("active");
               $(appendDom_cb).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
               $(this).addClass("active");
               $(this).find("span").animate({width: '16'}, {complete: function(){$(this).show();}, duration: 200 });
            }else{
               $(this).removeClass("active");
               $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
            }
         });
         
         appendDom_cb_ospans.die("click").live("click",function(e)
         {
            e.stopPropagation();
            var emP = $(this).parent("em");
            emP.remove();
            
            var uid = emP.attr("uid");
            $$list.find("li").each(function()
            {
               if($(this).attr("q_id") == uid)
               {
                  //删除经办的时候同时如果是主办，则删除主办
                  if($(this).find("a.current").length > 0)
                  {
                     $(this).find("a").removeClass("current");
                     $(appendDom_zb).find("em").each(function()
                     {
                        if($(this).attr("uid") == uid)
                        {
                           $(this).remove();
                           return false;
                        }
                     }); 
                  }
                  $(this).removeClass("active");
                  return false;
               } 
            });
            return;     
         });
         
         
      }
      
      function add_user(t, o)
      {
         str = "";
         _oSelect_uid = o.attr("q_id");
         _oSelect_name = o.attr("q_name");
         _oSelect_user_id = o.attr("q_user_id");
         str = "<em uid='"+_oSelect_uid+"' userid='"+_oSelect_user_id+"'>" + _oSelect_name +"<span>—</span></em>";
         
         if(t == "zb")
         {
            $(appendDom_zb).append(str);
            
            //判断有无从办
            var cb_has = false;
            if($(appendDom_cb).find("em").length > 0)
            {
               $(appendDom_cb).find("em").each(function(){
                  if($(this).attr("uid") == _oSelect_uid){
                     cb_has = true;
                     return false;         
                  }   
               });     
            }
            
            if(!cb_has)
               $(appendDom_cb).append(str);
         }else{
            $(appendDom_cb).append(str);
         }
      }
      
      function remove_user(t, o)
      {
         _oSelect_uid = typeof(o) == "object" ? o.attr("q_id") : o;
         if(t == "zb")
         {
            $(appendDom_zb).find("em").each(function(){
               if($(this).attr("uid") == _oSelect_uid)
                  $(this).remove();
               else
                  return true;
            });
            
            $(appendDom_cb).find("em").each(function(){
               if($(this).attr("uid") == _oSelect_uid)
                  $(this).remove();
               else
                  return true;
            });
         }else if(t == "cb"){
            $(appendDom_cb).find("em").each(function(){
               if($(this).attr("uid") == _oSelect_uid)
                  $(this).remove();
               else
                  return true;
            });            
         }else{
            $(appendDom_zb).find("em").each(function(){
               if($(this).attr("uid") == _oSelect_uid)
                  $(this).remove();
               else
                  return true;
            });
         }
      }
      
      //2012/6/26 14:13:15 lp
      function refreshListStatu()
      {
         var zb_oems = $(appendDom_zb).find("em");
         var cb_oems = $(appendDom_cb).find("em");
         if(zb_oems.length > 0)
         {
            var zb_cell_id = zb_oems.attr("uid");  
            $(list).find("li").each(function(){
               if($(this).attr("q_id") == zb_oems.attr("uid"))
               {
                  $(this).find("a.ui-li-text-a").addClass("current");
                  return false;
               }
            });
         }
         
         if(cb_oems.length > 0)
         {
            cb_oems.each(function()
            {
               var cb_ceil_id = $(this).attr("uid");
               $(list).find("li").each(function()
               {
                  if($(this).attr("q_id") == cb_ceil_id)
                  {
                     $(this).addClass("active");
                     return false;
                  }
               });
            });   
         }
      }
      
      function search_name()
      {
         var key = $$input.val();
         if(key!="")
         {
            if(key!=_tmp_key)
            {
               $$showbtn.hide();
               _tmp_key = key;
               
               if(/^[A-Za-z0-9]+$/.test(key))
               {
                  var _key_len = key.length;
                  if(_key_len > 1)
                  {
                     for(var i = 0;i < key.length;i++)
                     {
                        reg = key.charAt(i) + "(.*)";
                     } 
                  }else{
                     reg = key + "(.*)";      
                  } 
                  
                  eval("reg = /(.*)" + reg + "/");
                  _orgObj = $("<ul>"+orgHtml+"</ul>");
                  _orgObj.find("li").each(function(){
                     q_name_index = $(this).attr("q_name_index");
                     if(reg.test(q_name_index))
                        return true;
                     else
                        $(this).remove();
                  });
                                      
               }else if(!isChineseChar(key))
               {
                  $.ajax({
                     type: 'GET',
                     url: url,
                     cache: false,
                     data: {"KWORD":key, "P":p ,"ACTION": "getNameIndex"},
                     beforeSend: function(){
                        $.ProLoading.show();   
                     },
                     success: function(data)
                     {
                        $.ProLoading.hide();
                        var nameArr = [];
                        nameArr = data.split("*");
                        eval("reg = /(.*)" + nameArr.join("\\*(.*)") + "/");
                        _orgObj = $("<ul>"+orgHtml+"</ul>");
                        _orgObj.find("li").each(function(){
                           q_name_index = $(this).attr("q_name_index");
                           //console.log(q_name_index + " " + reg);
                           if(reg.test(q_name_index))
                              return true;
                           else
                              $(this).remove();
                        });
                     }
                  });
               }else{
                  //如果为纯中文，则直接搜索结果列表
                  _orgObj = $("<ul>"+orgHtml+"</ul>");
                  var _key_len = key.length;
                  
                  var partten = '';
                  //如果包括多个汉字
                  if(_key_len > 1)
                  {
                     for(var i = 0;i < key.length;i++)
                     {
                        if(key.charCodeAt(i) > 128)
                        {
                           var partten = partten + key.charAt(i) + "(.*?)";
                        }
                     } 
                  } 
                  _orgObj.find("li").each(function(){
                     q_name = $(this).attr("q_name");
                     //执行数组循环判断
                     if(_key_len > 1)
                     {
                        if(eval("/" + partten + "/.test(q_name)"))
                           return true;
                        else
                           $(this).remove();
                     }else{
                        //单个汉字
                        if(q_name.indexOf(key) > -1)
                           return true;
                        else
                           $(this).remove();   
                     } 
                  });
               }
               
               li_len = _orgObj.find("li").size();
               if(li_len > 0 )
               {
                  $$nodate.hide();
                  $$list.empty().append(_orgObj).find("li:hidden").show();
                  if($(showbtn).length == 0 || li_len == 1){
                     $$list.find("li:last").css("border-bottom","none");
                  }
               }else{
                  $$list.empty();$$nodate.show();   
               }  
            }
            
            refreshListStatu();
            return;
         }else{
            if(_tmp_key == key && key == "")
               return;
               
            _tmp_key = key;
            //如果为点击删掉的，则全部显示列表

            $$list.empty().append(orgHtml);
            refreshListStatu();
            if($(showbtn).length == 0){
               $$list.find("li:hidden").show();
                $$list.find("li:last").css("border-bottom","none"); 
            }
            $$showbtn.show();
            $$nodate.hide();
            eval(pageScroll+".refresh()");
         }   
      }
      return{
         init: init,
         refresh: refreshListStatu    
      }
   }
});