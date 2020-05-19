$(document).ready(function(){
   pageInit(1);   
});

//����б�����ù���
$("#workflow_list li").live("click", function(){
   $$a = $(this);
   //ȫ�ֱ���
   q_run_id      = $$a.attr("q_run_id");
   q_flow_id     = $$a.attr("q_flow_id");
   q_prcs_id     = $$a.attr("q_prcs_id");
   q_flow_prcs   = $$a.attr("q_flow_prcs");
   q_op_flag     = $$a.attr("q_op_flag");
   
   editWorkFlow();
   g_pre_page = 1;
   g_now_page = 2;
});

//����½������¼�
$("ul.comm-list li").live("click tap",function(){
	   $$a = $(this);
	   if($(this).hasClass("files"))
	   {
	      getFlowNew($$a.attr("q_id"));
	   }
	   else if($(this).hasClass("folder"))
	   {
		  getFlowNewlist($$a.attr("q_id"),$$a.attr("q_name"),now_sort);
	   }
});

//��ѯ�������¼�
$("#search_list li").live("click", function(){
   $$a = $(this);
   //ȫ�ֱ���
   q_run_id      = $$a.attr("q_run_id");
   q_flow_id     = $$a.attr("q_flow_id");
   q_prcs_id     = $$a.attr("q_prcs_id");
   q_flow_prcs   = $$a.attr("q_flow_prcs");
   q_op_flag     = $$a.attr("q_op_flag");
   
   if($(this).hasClass("active") || $(this).hasClass("received"))
   {
	   editWorkFlow();
	   g_pre_page = 15;
	   g_now_page = 2;
   }
   else
   {
	   getflowContent();
	   g_pre_page = 15;
	   g_now_page = 3;
   }
   
});

//���칤��
function editWorkFlow()
{
   
   $.ajax({
      type: 'GET',
      url: 'edit.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs},
      beforeSend: function(){
         $.ProLoading.show();
      },
      success: function(data)
      {
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
        	 $("div[id^='page_']").hide();
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

//��ȡ����������
function getflowContent()
{
   $.ajax({
      type: 'GET',
      url: 'form.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs},
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
        	 $("div[id^='page_']").hide();
            $("#page_3 > #wrapper_3 > #scroller_3").empty().append(data);
            $("#page_3").show('fast',function(){
               pageInit(3);
               $("#page_3 .container .read_detail:last").addClass("endline");
            });
            $("#header div[id^='header_']").hide();
            $("#header_3").show();
         }
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });
}

//��ȡԭʼ������
function showOriginalForm()
{
	$.ajax({
		type: 'GET',
		url: 'original_form.php',
		cache: false,
		data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag},
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
function clearOriginalForm(){
    $("#scroller_9").empty();
}
//��ȡ�б�ؼ�������
function listview(listitem,listname)
{
	$.ajax({
		type: 'GET',
		url: 'listview.php',
		cache: false,
		data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag, 'LISTITEM':listitem, 'LISTNAME':listname},
		beforeSend: function(){
			$.ProLoading.show();       
		},
		success: function(data){
            reback(3 ,16);
			$.ProLoading.hide();
			if(data == "NOREADFLOWPRIV"){
				showPageMessage(noreadflowpriv);
				delete_flow();
				return;        
			}else{
				$("#page_9 > #wrapper_9 > #scroller_9").empty().append(data);
				$("#page_9").show('fast',function(){
					pageInit(9);
				});
				$("#header_2").hide();
				$("#header_16").show();
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
   //lp 2012/4/23 15:14:40 ת��ʱ���ӱ���
   saveWorkFlow('ISFORMTURN'); 
   var flow_type = $("input[name='FLOW_TYPE']").val();
   var url = flow_type == 2 ? 'turn_user.php' : 'turn.php';
   var page_num = flow_type == 2 ? '6' : '5';
   turn_back_page = flow_type == 2 ? '2' : '5';
   TOP_FLAG = $("input[name='TOP_FLAG']").val(); 
   $.ajax({
      type: 'GET',
      url: url,
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'FLOW_TYPE':flow_type,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'TOP_FLAG': TOP_FLAG},
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
         
         $("#page_"+page_num+" > #wrapper_"+page_num+" > #scroller_"+page_num).empty().append(data);
         $(".pages").hide();
         reback(2,page_num);
         $("#page_"+page_num).show('fast',function(){
            pageInit(page_num);
            $("#page_"+page_num+" .container .read_detail:last").addClass("endline");
         });
         $("#header div[id^='header_']").hide();
         $("#header_"+page_num).show();
      },
      error: function(data){
         $.ProLoading.hide(); 
         showMessage(getfature);
      }
   });
}
/**
 * ��ȡ��ǩ��������
 */
function signWorkFlow(){
   $.ajax({
      type: 'GET',
      url: 'sign.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag},
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
         
         //lp 2012/4/17 16:14:03 ���Ӱ�����Ϲ���
         if(q_op_flag == 0){
         			
         }
         
         $("#header div[id^='header_']").hide();
         $("#header_4").show();
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });
}

//��ǩ�ı���
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
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'CONTENT':CONTENT},
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
         showMessage(getfature);
      }
   });   
}
//���̹�������
function saveRelationWorkFlow() {
    var params = {};
    params.flow_id = $('input[name=FLOW_ID]').val();
    params.run_id = $('input[name=RUN_ID]').val();
    params.flow_prcs = $('input[name=FLOW_PRCS]').val();
    params.prcs_id = $('input[name=PRCS_ID]').val();
    params.prcs_key_id = $('input[name=PRCS_KEY_ID]').val();
    params.flow_list_info = $('#back_list').val();
    
    $.ajax({
        url:'contact_submit.php',
        data:params,
        type:'POST',
        success:function(){
            
        },
        error:function(){

        }
        
    })
}
//��ǩ�������
function stopWorkFlow(){
   $.ajax({
      type: 'GET',
      url: 'stop.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs},
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
         showMessage(getfature);
      }
   });
}

// ��ȡ����ҳ��
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
			'FLOW_PRCS' : q_flow_prcs,
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
			showMessage("��ȡʧ��");
		}
	});
}

//ִ�л��˲���
function goOnSelBackWorkFlow()
{
	// ��ǩ����
	var CONTENT = $("#CONTENT_BACK").val();
	// ���˲���
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
			'FLOW_PRCS_LAST' : sel_back_prcs,
			'CONTENT' : CONTENT,
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
				$("#page_10").hide();
				delete_flow();
				showMessage(workhasgoback);
				gohome();
				return;
			}
		},
		error : function(data) {
			$.ProLoading.hide();
			showMessage(getfature);
		}
	});
}

/**
 * ��ȡѡ����һ�����������
 */
function goOnWorkFlow(){
	//�ж��Ƿ�������ǿ��ת��
	 var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH']").val(); //δ������ϵľ�����
   var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //ǿ��ת��
   if(TURN_PRIV != 1 && NOT_ALL_FINISH !=""){
			alert("������["+NOT_ALL_FINISH+"]��δ������ϣ����ܽ������̣�");
			return;
	 }
		if(TURN_PRIV == 1 && NOT_ALL_FINISH !=""){
			if(confirm('������['+NOT_ALL_FINISH+']��δ������ϣ�ȷ��Ҫ����������')){
                 //alert("ȷ��");
                 //return true;
      }else{
                 //alert("ȡ��");
                 return ;
      }
		}
		
   action = $("input[name='turn_action']").val();
   var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']").val();
   var flow_type = $("input[name='FLOW_TYPE']").val();
   if((prcs_id_next == '' || typeof(prcs_id_next) == 'undefined') &&  flow_type != 2){
    showMessage(noselectedstep);
    return ;
   }
   $.ajax({
      type: 'GET',
      url: action,
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_ID_NEXT': prcs_id_next, 'FLOW_TYPE': flow_type},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data)
      {
         $.ProLoading.hide(); 
         reback(g_now_page,6);
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
         showMessage(getfature);
      }
   });
}

/**
 * ��ȡѡ����һ��������˽�������
 */
function turnUserWorkFlow(){
   
  var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']").val();
   var preset = $("input[name='PRESET']").val();
   var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH_NEXT']").val(); //δ������ϵľ�����
   var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //ǿ��ת��

   if(prcs_id_next == "")
   {
      showMessage(error);
      return;
   }else{
      prcs_id_next = decodeURIComponent(prcs_id_next);   //���URL���룬���ݲ��������  
   }
	var POST_STR = "RUN_ID="+q_run_id+"&FLOW_ID="+q_flow_id+"&PRCS_ID="+q_prcs_id+"&FLOW_PRCS="+q_flow_prcs+"&PRCS_ID_NEXT="+prcs_id_next+"&PRESET="+preset;
	var prcs_id_next_arr = prcs_id_next.split(",");

   var _continue = true;
   var _error_step = 0;
	$.each(prcs_id_next_arr, function(key, val){
		if(val)
		{
		   var _zbems = $("#USER_ZB_" + val).find("em");
		   var _cbems = $("#USER_CB_" + val).find("em");
		   if($("#TOP_DEFAULT_" + val).val() != undefined)
		   	 POST_STR += "&TOP_DEFAULT_" + val + "=" + $("#TOP_DEFAULT_" + val).val();
		   		   
		   //�ж��Ƿ���������Ϊ�յ����
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
			   //�°�ƴ���������ַ���
			   POST_STR += "&PRCS_USER_OP_" + val + "=" + $("#USER_ZB_" + val).find("em").attr("userid");
		   }
		   
			//�°澭����ƴ��
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
  
  	if(TURN_PRIV != 1 && NOT_ALL_FINISH !=""){
			alert("������["+NOT_ALL_FINISH+"]��δ������ϣ�����ת�����̣�");
			return;
		}
		if(TURN_PRIV == 1 && NOT_ALL_FINISH !=""){
			if(confirm('������['+NOT_ALL_FINISH+']��δ������ϣ�ȷ��Ҫת����һ������')){
                 //alert("ȷ��");
                 //return true;
      }else{
                 //alert("ȡ��");
                 return ;
      }
		}
   $.ajax({
      type: 'POST',
      url: 'turn_submit.php',
      cache: false,
      data: POST_STR + "&P=" + p,
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data)
      {
         $.ProLoading.hide();
         reback(g_now_page,7);
         if(data == "NOEDITPRIV"){
            showPageMessage(noeditpriv);
            return;  
         }else if(data == "NOSIGNFLOWPRIV"){
            showPageMessage(nosignflowpriv);
            return;   
         }else if(data == "WORKCOMPLETE"){
            showPageMessage(workcomplete);
            delete_flow();
            back2list && back2list(workcomplete);
            return;   
         }else if(data == "WORKHASTURNNEXT"){
            showPageMessage(workhasturnnext);
            delete_flow();
            back2list && back2list(workhasturnnext);
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
//�����
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
         
         //lp 2012/4/23 15:17:28 ����Ǵ�����ת���򱣴棬����תҳ��
         if(a) return;
         $.ajax({
            type: 'GET',
        	url: 'sign.php',
        	cache: false,
        	data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag},
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

//�����֮������༭
function continueEditFlow(){
   $.ajax({
      type: 'GET',
      url: 'edit.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs},
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

//2012/4/26 15:39:29 lp ˢ���б�
function refreshList(){
	var url = "/pda/inc/getdata.php";
	if(typeof(mobile_dataurl) != "undefined")
		url = mobile_dataurl;
   var $$page_dom = $("#page_1");
   var oUl = $$page_dom.find("#workflow_list");
   var lastedId =  oUl.find("li:first").attr("q_id");
   if(!lastedId) return;
	$.get(url, {'A':"GetNew", 'STYPE':stype, "P":p, "LASTEDID": lastedId},
		function(m)
		{
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

// �½�����
function newFlow() {
	$.ajax({
		type : 'GET',
		url : 'new_list.php',
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
			if(data == "NOCREATERUNPRIV"){
	            showPageMessage(nocreaterunpriv);
	            return;
	        }
			$("#page_1").hide();
			$("#page_11 > #wrapper_11 > #scroller_11 ul").empty().append(data);
			$("#page_11").show('fast', function() {
				pageInit(11);
			});
			$("#header div[id^='header_']").hide();
			$("#header_11").show();
		},
		error : function(data) {
			$.ProLoading.hide();
			showMessage(getfature);
		}
	});
}

function searchFlow()
{
	$.ajax({
      type: 'GET',
      url: 'search_flow.php',
      cache: true,
      data: {'P': p},
      beforeSend: function(){
            $.ProLoading.show();
         },
      success: function(data){
    	  $.ProLoading.hide();
    	  $("#page_1").hide();
          $("#page_14 > #wrapper_14 > #scroller_14").empty().append(data);
          $("#page_14").show('fast',function(){
             pageInit(14);
             $("#page_14 .container .read_detail:last").addClass("endline");
          });
          
          $("#header div[id^='header_']").hide();
          $("#header_14").show();
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });
}

function searchFlowList()
{
	var search_name = $("input[name='SEARCH_NAME']").val();
	var search_run_id = $("input[name='SEARCH_RUN_ID']").val();
	$.ajax({
	      type: 'GET',
	      url: 'search_list.php',
	      cache: true,
	      data: {'P': p,'SEARCH_NAME':search_name,'SEARCH_RUN_ID':search_run_id},
	      beforeSend: function(){
	            $.ProLoading.show();
	         },
	      success: function(data){
	         $.ProLoading.hide();  
	         if(data == 'NOFLOWLIST'){
	        	 showMessage(noflowlist);
	            return;
	         }else{	
	        	 $("#page_14").hide();
	            $("#page_15 > #wrapper_15 > #scroller_15 ul").empty().append(data);
	            $("#page_15").show('fast',function(){pageInit(15);});
	            $("#header div[id^='header_']").hide();
	            $("#header_15").show();
	         }
	      },
	      error: function(data){
	         $.ProLoading.hide();  
	         showMessage(getfature);
	      }
	   });
}

//չ���½������б�
function getFlowNewlist(SORT_ID,SORT_NAME,PARENT_SORT)
{
   $.ajax({
      type: 'GET',
      url: 'new_list.php',
      cache: true,
      data: {'P': p,'SORT_ID': SORT_ID,'SORT_NAME_TMP': SORT_NAME,'PARENT_SORT': PARENT_SORT},
      beforeSend: function(){
            $.ProLoading.show();
         },
      success: function(data){
         $.ProLoading.hide();  
         if(data == 'NOFLOWLIST'){
        	 showMessage(noflowlist);
            return;
         }else{
            $("#page_12 > #wrapper_12 > #scroller_12 ul").empty().append(data);
            $("#page_12").show('fast',function(){pageInit(12);});
            $("#header div[id^='header_']").hide();
            $("#header_12").show();  
         }
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });
}

//��ȡ�½�����ҳ��
function getFlowNew(FLOW_ID)
{
	$.ajax({
	      type: 'GET',
	      url: 'new_edit.php',
	      cache: true,
	      data: {'P': p,'FLOW_ID': FLOW_ID},
	      beforeSend: function(){
	            $.ProLoading.show();
	         },
	      success: function(data){
	    	  $.ProLoading.hide();
	          $("#page_13 > #wrapper_13 > #scroller_13").empty().append(data);
	          $("#page_13").show('fast',function(){
	             pageInit(13);
	             $("#page_13 .container .read_detail:last").addClass("endline");
	          });
	          
	          $("#header div[id^='header_']").hide();
	          $("#header_13").show();
	      },
	      error: function(data){
	         $.ProLoading.hide();  
	         showMessage(getfature);
	      }
	   });
}

function saveNewWorkFlow()
{
	var RUN_NAME = $("input[name='RUN_NAME']").val();
	if(RUN_NAME == "")
	{
		showMessage(norunname);
		return;
	}
	
	var RUN_NAME_LEFT = $("input[name='RUN_NAME_LEFT']");
	var RUN_NAME_RIGHT = $("input[name='RUN_NAME_RIGHT']");
	if(RUN_NAME_LEFT.length > 0 && force_pre_set == 1)
	{
		if(RUN_NAME_LEFT.val() == "")
		{
			showMessage(noprefix);
			return;
		}
	}
	if(RUN_NAME_RIGHT.length > 0 && force_pre_set == 1)
	{
		if(RUN_NAME_RIGHT.val() == "")
		{
			showMessage(nosuffix);
			return;
		}
	}
	
	var data = $("#new_from").serialize();
	
	$.ajax({
	      type: 'POST',
	      url: 'new_submit.php',
	      cache: false,
	      async: false,
	      data: data + "&P="+p,
	      beforeSend: function(){
	         $.ProLoading.show();       
	      },
	      success: function(data)
	      {
	    	  $.ProLoading.hide();
	         if(data == "NORUNNAME")
	         {
	        	 showMessage(norunname);
	        	 return;
	         }
	         else if(data == "NAMEREPEAT")
	         {
	        	 showMessage(namerepeat);
	        	 return;
	         }
	         else if(data == "NOCREATERUN")
	         {
	        	 showMessage(nocreaterun);
	        	 return;
	         }
	         else
	         {
	        	 $("#page_2 > #wrapper_2 > #scroller_2").empty().append(data);
	        	 $("div[id^='page_']").hide();
	        	 editWorkFlow();
	        	 g_pre_page = 1;
	      	     g_now_page = 2;
	        	 refreshList();
	         }
	      },
	      error: function(data){
	         $.ProLoading.hide();  
	         showMessage(getfature);
	      }
	   });
}

//������ѯ�б�������չ
function pullUp_search_list()
{
	var oUl = $("#page_" + 15).find("ul.comm-list");
	var currIterms = oUl.find("li").size();
    
    //lp 2012/5/2 0:59:57 ���ӻ�ȡ����ʱ����������
    if(currIterms > 0){
       lastGetId = oUl.find("li:last").attr("q_id");    
    }
    
    var search_name = $("input[name='SEARCH_NAME']").val();
    $.get(
       "search_list.php", 
       {'A':"GetMore", 'STYPE':stype, "P":p, "CURRITERMS": currIterms, "LASTGETID": lastGetId, "SEARCH_NAME":search_name},
       function(data)
       {
          oUl.append(data);
          oiScroll.refresh();
          if(noshowPullUp_15)
          {
        	  $$page_dom.find(".pullUp").hide();
        	  $$page_dom.find(".scroller").append('<div class="loadingComplete">' + td_lang.pda.msg_8 + '</div>');
          }
       }
    );
}

function pullDown_search_list(){
	showMessage(td_lang.pda.msg_1);
	oiScroll.refresh();
	return;	
}

// 2012/6/18 2:52:29 lp ������ѡ����չ����
$.extend({
   workFlowSearch: function (options) 
   {
   	var defaults = {
			url: "/pda/inc/get_contactlist.php"
		};
				
		var options = $.extend(true, defaults, options);
      var input = options.input;
      var list = options.list;
      var appendDom_top = options.appendDom_top;
      var appendDom_zb = options.appendDom_zb;
      var appendDom_cb = options.appendDom_cb;
      var showbtn = options.showbtn;
      var nodate = options.nodate;
      var pageScroll = options.pageScroll;
      var url = options.url;
      
      if(typeof(mobile_contactlisturl) != "undefined")
			url = mobile_contactlisturl;
      
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
         
         //2012/6/24 13:24:11 lp �����찴ť����¼�
         $$list.find("a.ui-li-text-a").die("click").live("click",function(e)
         {            
            //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
            if(false === fixDbClick.call(this, e)){
                return false;
            }
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
         
         //2012/6/24 13:24:11 lp ���б����¼�
         $$list.find("li").die("click").live("click",function(e)
         {            
            //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
            if(false === fixDbClick.call(e.target, e)){
                return false;
            }

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
                  
                  //����ʹӰ춼û��ѡ����˵�ʱ�򣬼������
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
         
         //2012/6/24 22:14:06 lp �������˵�ɾ������
         var appendDom_zb_oems = $(appendDom_zb).find("em");
         var appendDom_zb_ospans = $(appendDom_zb).find("em span");
         appendDom_zb_oems.die("click").live("click",function(e)
         {            
            //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
            if(false === fixDbClick.call(this, e)){
                return false;
            }
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
            //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
            if(false === fixDbClick.call(this, e)){
                return false;
            }
            e.stopPropagation();
            var emP = $(this).parent("em");
            emP.remove();
            
            //ͬʱɾ���б������������Ӧ����ɫ
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
         
         //2012/6/24 22:14:06 lp �󶨾����˵�ɾ������
         var appendDom_cb_oems = $(appendDom_cb).find("em");
         var appendDom_cb_ospans = $(appendDom_cb).find("em").find("span");
         appendDom_cb_oems.die("click").live("click",function(e)
         {
            //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
            if(false === fixDbClick.call(this, e)){
                return false;
            }
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
            //�޸�chrome�µ����������ε�bug by JinXin @ 2012/10/15
            if(false === fixDbClick.call(this, e)){
                return false;
            }
            e.stopPropagation();
            var emP = $(this).parent("em");
            emP.remove();
            
            var uid = emP.attr("uid");
            $$list.find("li").each(function()
            {
               if($(this).attr("q_id") == uid)
               {
                  //ɾ�������ʱ��ͬʱ��������죬��ɾ������
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
         str = "<em uid='"+_oSelect_uid+"' userid='"+_oSelect_user_id+"'>" + _oSelect_name +"<span>��</span></em>";
         
         if(t == "zb")
         {
         	if($(appendDom_top).val() == 0 || $(appendDom_top).val() == undefined)
         	{
            	$(appendDom_zb).append(str);
        	}
        	else 
        	{
        		$$list.find("a.ui-li-text-a").removeClass("current");
        	}
            
            //�ж����޴Ӱ�
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
                  //���Ϊ�����ģ���ֱ����������б�
                  _orgObj = $("<ul>"+orgHtml+"</ul>");
                  var _key_len = key.length;
                  
                  var partten = '';
                  //��������������
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
                     //ִ������ѭ���ж�
                     if(_key_len > 1)
                     {
                        if(eval("/" + partten + "/.test(q_name)"))
                           return true;
                        else
                           $(this).remove();
                     }else{
                        //��������
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
            //���Ϊ���ɾ���ģ���ȫ����ʾ�б�

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