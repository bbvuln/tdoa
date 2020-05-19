$(document).ready(function(){
    pageInit(1);
    $(".turn_btn").bind("touchstart mousedown", function(e){
        $(this).addClass('active'); 
    }).bind("touchend mouseup", function(e){ 
        $(this).removeClass('active');
    });
});
//点击列表主办该工作
$("#workflow_list li").live("click", function(){
   $$a = $(this);
   q_run_id      = $$a.attr("q_run_id");
   q_flow_id     = $$a.attr("q_flow_id");
   q_prcs_id     = $$a.attr("q_prcs_id");
   q_flow_prcs   = $$a.attr("q_flow_prcs");
   q_prcs_key_id = $$a.attr("q_prcs_key_id");
   q_op_flag     = $$a.attr("q_op_flag");
   editWorkFlow();
   g_pre_page = 1;
   g_now_page = 2;
});
 function call_back()
{
    var msg="下一步骤尚未接收时可收回至本步骤重新办理，确认要收回吗？";
    if(window.confirm(msg)){
        $.ajax({
            type: 'GET',
            url: '/general/workflow/list/call_back.php',
            data: {'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'MOBILE_CALL_BACK':1},
            beforeSend: function(){
            $.ProLoading.show();
            },
            success: function(data){
                if(data == 0)
                {
                    alert("工作已收回");
                    showPageMessage(workhasturnnext);
                    delete_flow();
                    back2list && back2list(workhasturnnext);
                    return;
                }
                if(data == 1)
                {
                    alert("您没有权限！");
                }
                if(data == 2)
                {
                    alert("对方已接收，不能收回");
                }
            },
            error: function(data){
                $.ProLoading.hide(); 
            }        
        });
    }
}
//一键转交
function turn_all(){
    upload_area_a_length = jQuery('[id^="UPLOAD_AREA_"]').find('a').length;
    if(control_type == '' && upload_area_a_length != 0)
    {
        control_type = 'turn_all';
        TFieldManager.prototype.saveWorkFlow();
        return;
    }
    else if(control_type == '' && upload_area_a_length == 0)
    {
        TFieldManager.prototype.saveWorkFlow(); 
    }
	var turnall_flag = $("input[name='turnall_flag']").val();
	var next_prcs = $("input[name='next_prcs']").val();
	var top_default = $("input[name='top_default']").val();
	var next_user = $("input[name='next_user']").val();
	var is_disposable = $("input[name='is_disposable']").val();
	var next_user_name = $("input[name='next_user_name_dispos']").val();
	var next_prcs_name = $("input[name='next_prcs_name_dispos']").val();
    var flow_type = $("input[name='FLOW_TYPE']").val();
    var turn_priv = $("input[name='turn_priv']").val();
	var prcs_back = $("input[name='one_key_prcs_back']").val();
    var turn_priv_flag = $("input[name='turn_priv_flag']").val();
	var NOT_ALL_FINISH = $("input[name='not_finish_user']").val();
    
    if(turn_priv != 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null) && flow_type == 1){
		alert("经办人["+NOT_ALL_FINISH+"]尚未办理完毕，不能转交流程！");
		return;
	}
	if((turn_priv == 1 || flow_type == 2) && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
		if(confirm('经办人['+NOT_ALL_FINISH+']尚未办理完毕，确认要转交下一步骤吗？')){
            turn_priv_flag = 1
        }else{
            return ;
        }
    }
    
	$.ajax({
		type: 'POST',
		url: 'turn_submit.php',
		cache: false,
		data : {
		    'P': p,
			'RUN_ID' : q_run_id,
			'FLOW_ID' : q_flow_id,
			'PRCS_ID' : q_prcs_id,
			'FLOW_PRCS' : q_flow_prcs,
            'PRCS_KEY_ID' : q_prcs_key_id,
			'TURNALL_FLAG' : turnall_flag,
			'NEXT_PRCS_STR' : next_prcs,
			'TOP_DEFAULT_STR' : top_default,
			'NEXT_USER_STR' : next_user,
            'PRCS_BACK' : prcs_back,
            'TURN_PRIV' : turn_priv,
            'TURN_PRIV_FLAG' : turn_priv_flag,
            'FLOW_TYPE' : flow_type,
			'IS_DISPOSABLE' : is_disposable
		},
		success: function(data)
		{
			if(data == "NOEDITPRIV"){
				showPageMessage(noeditpriv);
				return;  
			}else if(data.indexOf("NOTALLFINISH") != -1){
                var ARR_NOT_ALL_FINISH = new Array();
                var ARR_NOT_ALL_FINISH = data.split("|");
                var NOT_ALL_FINISH_NEW = ARR_NOT_ALL_FINISH[1];
                if(turn_priv != 1 && flow_type == 1){
                    alert('经办人['+NOT_ALL_FINISH_NEW+']尚未办理完毕，不能转交流程！');
                    return;
                }
                if(turn_priv == 1 || flow_type == 2){
                    if(confirm('经办人['+NOT_ALL_FINISH_NEW+']尚未办理完毕，确认要转交下一步骤吗？')){
                        jQuery("input[name='turn_priv_flag']").val(1);  //可以强制转交标记
                        turn_all();
                        return;
                    }else{
                        return;
                    }
                }
                
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
				back2list && back2list("工作已转交至"+next_user_name+"("+next_prcs_name+")");
				return; 
			}else if(data == "NOTURNALLCONDITION" || data == "NOTURNCONDITION"){
                turnWorkFlow();
                control_type = '';
                $("#header div[id^='header_']").hide();
                $("#header_5").show();
                reback(g_now_page, 5);
                return;
            }
      	},
      	error: function(data){ 
         	showMessage(getfature);
      	}
    });
}
//办理界面编辑状态
function editWorkFlow()
{
    $.ajax({
        type: 'GET',
        url: 'prcs_info.php',
        cache: false,
        data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'actionType':q_action_type},
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            fileReadPage = 2;
            pre_page = 2;
            $.ProLoading.hide();
            if(data == "NOEDITPRIV"){
                showPageMessage(noeditpriv);
                delete_flow();
                return;
            }else{
                $("#page_2 > #wrapper_2 > #scroller_2").empty().append(data);
                $("#page_2").show('fast',function(){
                    pageInit(2);
                    $("#page_2 .container .read_detail:last,#page_2 .container form .read_detail:last,#editSignBox .read_detail:last").addClass("endline");
                    //$("#page_2 .container .prcs_id:last").addClass("active");
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
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID': q_prcs_key_id},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data)
      {
         pre_page = 3;
         fileReadPage = 3;
         $.ProLoading.hide();
         if(data == "NOREADFLOWPRIV"){
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
				showPageMessage(noreadflowpriv);
				delete_flow();
				return;        
			}else{
				$("#page_9 > #wrapper_9 > #scroller_9").empty().append(data);
				$("#page_9").show('fast',function(){
					pageInit(9);
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
//获取列表控件表单内容
function listview(listitem,listname)
{
    $("#header_2").hide();
    window.Android.OpenListView(p,q_run_id,q_flow_id,q_prcs_id,q_flow_prcs,q_op_flag,listitem,listname);
}
/*
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
        		$("#editSignBox .read_detail:last").addClass("endline");
        		showMessage(formsuccess);
            }
         })
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage(getfature);
      }
   });     
}
*/
// 转交跳转至选步骤页面，同时增加保存
function turnWorkFlow()
{
   //修改 流程办理转交时，点击返回 会签意见会重复提交的情况 DJ 14/8/28
   // TFieldManager.prototype.saveWorkFlow('ISFORMTURN'); 
   TFieldManager.prototype.saveWorkFlow(); 
   var flow_type = $("input[name='FLOW_TYPE']").val();
   var url = 'turn.php';
   var page_num = '5';
   turn_back_page = '5';
   TOP_FLAG = $("input[name='TOP_FLAG']").val(); 
   $.ajax({
      type: 'GET',
      url: url,
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'FLOW_TYPE': flow_type},
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
        else if(data.indexOf("noMeetCondition") >= 0 && flow_type != 2){
            reback(g_now_page, 11);
        }
        $("#page_"+page_num+" > #wrapper_"+page_num+" > #scroller_"+page_num).empty().append(data);
        $(".pages").hide();
        $("#page_"+page_num).show('fast',function(){
            pageInit(page_num);
            $("#page_"+page_num+" .container .read_detail:last").addClass("endline");
            $("body").delegate(".setItemClass","click",function(){
                var setItemId = this.id;
                var setItemIdIndexOf = setItemId.indexOf("_");
                var setItemIdNum = setItemId.substr(setItemIdIndexOf+1);
                var freeItemVal = jQuery("#FREE_ITEM_"+setItemIdNum).val();
                $.ajax({
                    type: 'GET',
                    url: 'set_item.php',
                    cache: false,
                    data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'setItemId':setItemId,'freeItemVal': freeItemVal},
                    beforeSend: function(){
                        $.ProLoading.show();      
                    },
                    success: function(data){
                        reback(g_now_page, 12);
                        $.ProLoading.hide();
                        $("#page_11 > #wrapper_11 > #scroller_11").empty().append(data);
                        $(".pages").hide();
                        $("#page_11").show('fast',function(){
                            pageInit(12);
                            $("#page_11 .container .read_detail:last").addClass("endline");
    });
                        $("#header div[id^='header_']").hide();
                        $("#header_11").show();
                    },
                    error: function(data){
                        $.ProLoading.hide(); 
                        showMessage("获取失败");
                    }
                });
            });
        });
        $("#header div[id^='header_']").hide();
        $("#header_"+page_num).show();
      },
      error: function(data){
         $.ProLoading.hide(); 
         showMessage("获取失败");
      }
   });
}

// 委托
function intrustWorkFlow()
{
   var flow_type = $("input[name='FLOW_TYPE']").val();
   var url = 'intrust.php';
   var page_num = '17';
   TOP_FLAG = $("input[name='TOP_FLAG']").val();
   $.ajax({
      type: 'GET',
      url: url,
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'FLOW_TYPE': flow_type},
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
        else if(data.indexOf("noMeetCondition") >= 0 && flow_type != 2){
            reback(g_now_page, page_num);
        }
        $("#page_"+page_num+" > #wrapper_"+page_num+" > #scroller_"+page_num).empty().append(data);
        $(".pages").hide();
        $("#page_"+page_num).show('fast',function(){
            pageInit(page_num);
            $("#page_"+page_num+" .container .read_detail:last").addClass("endline");
            $("body").delegate(".setItemClass","click",function(){
                var setItemId = this.id;
                var setItemIdIndexOf = setItemId.indexOf("_");
                var setItemIdNum = setItemId.substr(setItemIdIndexOf+1);
                var freeItemVal = jQuery("#FREE_ITEM_"+setItemIdNum).val();
                $.ajax({
                    type: 'GET',
                    url: 'set_item.php',
                    cache: false,
                    data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'setItemId':setItemId,'freeItemVal': freeItemVal},
                    beforeSend: function(){
                        $.ProLoading.show();
                    },
                    success: function(data){
                        reback(g_now_page, 12);
                        $.ProLoading.hide();
                        $("#page_"+page_num+" > #wrapper_"+page_num+" > #scroller_"+page_num+"").empty().append(data);
                        $(".pages").hide();
                        $("#page_"+page_num).show('fast',function(){
                            pageInit(12);
                            $("#page_"+page_num+" .container .read_detail:last").addClass("endline");
                        });
                        $("#header div[id^='header_']").hide();
                        $("#header_"+page_num).show();
                    },
                    error: function(data){
                        $.ProLoading.hide();
                        showMessage("获取失败");
                    }
                });
            });
        });
        $("#header div[id^='header_']").hide();
        $("#header_"+page_num).show();
      },
      error: function(data){
         $.ProLoading.hide();
         showMessage("获取失败");
      }
   });
}
//获取会签界面内容
function signWorkFlow(){
   $.ajax({
      type: 'GET',
      url: 'sign.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID': q_prcs_key_id, 'OP_FLAG': q_op_flag},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data){
         $.ProLoading.hide();
         $("#page_4 > #wrapper_4 > #scroller_4 .tform").empty().append(data);
         $("#page_4").show('fast',function(){
            pageInit(4);
            $("#page_4 .container .read_detail:last").addClass("endline");
         });
         
         //增加办理完毕功能
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
   var ATTACHMENT_ID = jQuery("[name='SIGN_KEY']").val();
   var ATTACHMENT_NAME = jQuery("[name='SIGN']").val();
   if((CONTENT == "" || typeof CONTENT == "undefined") && (ATTACHMENT_ID == "" || typeof ATTACHMENT_ID == "undefined")){
      return;
   }
   $.ajax({
      type: 'GET',
      url: 'sign_submit.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'CONTENT':CONTENT, 'ATTACHMENT_ID':ATTACHMENT_ID, 'ATTACHMENT_NAME':ATTACHMENT_NAME},
      beforeSend: function(){
         $.ProLoading.show();
         jQuery("[name='SIGN_KEY']").val('');
         jQuery("[name='SIGN']").val('');
      },
      success: function(data){
         $.ProLoading.hide();
      },
      error: function(data){
         $.ProLoading.hide();  
         showMessage("获取失败");
      }
   });   
}

function savePublicWorkFlow(){
    var ATTACHMENT_ID = jQuery("[name='PUBLIC_KEY']").val();
    var ATTACHMENT_NAME = jQuery("[name='PUBLIC']").val();
    if(ATTACHMENT_ID == '' || typeof ATTACHMENT_ID == 'undefined'){
        return;
    }
    $.ajax({
        type: 'POST',
        url: 'public_submit.php',
        cache: false,
        data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'ATTACHMENT_ID':ATTACHMENT_ID, 'ATTACHMENT_NAME':ATTACHMENT_NAME},
        beforeSend: function(){
            $.ProLoading.show();   
            jQuery("[name='PUBLIC_KEY']").val('');
            jQuery("[name='PUBLIC']").val('');         
        },
        success: function(data){
            $.ProLoading.hide();
        },
        error: function(data){
            $.ProLoading.hide();  
            showMessage("获取失败");
        }
    })
}

//会签办理完毕
function stopWorkFlow(type){
   var top_flag = jQuery("#top_flag").val();
   // var top_flag = 2;
   var stopType = type;
   var feedback_content = jQuery("#CONTENT").val();
   var is_disposable = $("input[name='is_disposable']").val();
   feedback_content = jQuery.trim(feedback_content);
   $.ajax({
      type: 'GET',
      url: 'stop.php',
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs,'PRCS_KEY_ID':q_prcs_key_id,'top_flag': top_flag,'feedback_content': feedback_content,'stop_type': stopType,'is_disposable': is_disposable},
      beforeSend: function(){
         $.ProLoading.show();       
      },
      success: function(data){
         $.ProLoading.hide();
         if(data == "NOSUBEDITPRIV"){
            alert(nosubeditpriv);
            delete_flow();
            return;   
         }else if(data == "WORKDONECOMPLETE"){
         	// showPageMessage(workdonecomplete);
            back2list && back2list(workdonecomplete);
            delete_flow();
            return;
         }else if(data == "SIGNISNOTEMPTY"){
         	alert(signisnotempty);
            return;
         }else if(data == "TURNNEXT"){
            turnWorkFlow();
	    	reback(g_now_page, 5);
            return;   
         }else if(data == "TURNALL"){
            gotoWork("turn_all");
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
    //保存表单及会签
    TFieldManager.prototype.saveWorkFlow();
	$.ajax({
		type : "GET",
		url : "sel_back.php",
		cache : false,
		data : {
		    "P": p,
			"RUN_ID" : q_run_id,
			"FLOW_ID" : q_flow_id,
			"PRCS_ID" : q_prcs_id,
			"FLOW_PRCS" : q_flow_prcs,
            "PRCS_KEY_ID" : q_prcs_key_id
		},
		beforeSend : function() {
			$.ProLoading.show();
		},
		success : function(data) {
			$.ProLoading.hide();
			reback(g_now_page,10);
			$("#page_10 > #wrapper_10 > #scroller_10").empty().append(data);
			$("#page_10").show('fast', function() {
				pageInit(10);
				$("#page_2").hide();
				$("#page_10 .container .tform .read_detail:last").addClass("endline");
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
function goOnSelBackWorkFlow(control_type)
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

    if(CONTENT.trim() === "")
    {
        showMessage(gobackcontentisnull);
        return;
    }
    var plugin_str = '';
    var data = {
        'P': p,
        'RUN_ID' : q_run_id,
        'FLOW_ID' : q_flow_id,
        'PRCS_ID' : q_prcs_id,
        'FLOW_PRCS' : q_flow_prcs,
        'PRCS_KEY_ID' : q_prcs_key_id,
        'FLOW_PRCS_LAST' : sel_back_prcs,
        'CONTENT' : CONTENT
    };
    if(control_type){
        var form_plugin = document.form_plugin;
        plugin_arr = jQuery(form_plugin).serializeArray();
        data['TRIGGER'] = control_type;
        for(var v in plugin_arr){
            data[plugin_arr[v]['name']] = plugin_arr[v]['value'];
        }
    }

	$.ajax({
		type : 'GET',
		url : 'go_back.php',
		cache : false,
		data : data,
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
				back2list && back2list(workhasgoback);
				return;
			} else if (data == "TRIGGER") {
                p_pre_page = 10;
                goOnTriggerPage('BACK');
                return;
            } else{
                
                showPageMessage(data);
				$("#page_10").hide();
				delete_flow();
				back2list && back2list(workhasgoback);
            }
		},
		error : function(data) {
			$.ProLoading.hide();
			showMessage(getfature);
		}
	});
}
//获取选人界面
function goOnWorkFlow(new_prcs_id_next, turn_action){
   var RX_PRCS = "";
   var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH']").val(); //未办理完毕的经办人
   var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //强制转交
   var PRCS_BACK_LEN = $("input[name='prcs_back']").length; //是否返回父流程
   var SMS_REMIND_NEXT = 0;
   var SYNC_DEAL = $("input[name='SYNC_DEAL']").val();

   if($(".rx_prcs").length > 0)
   {
        var RX_PRCS = $(".rx_prcs").val();   //柔性节点步骤名称
        RX_PRCS = $.trim(RX_PRCS);
        var checkedClass = $(".rx_prcs").prev().prev().attr("class");
        
        if(checkedClass.indexOf("checked") > 0)
        {
            if(RX_PRCS == "")
            {
                alert("柔性节点步骤名称不能为空！");
                return;
            }
        }
   }
   
   if($("#SMS_REMIND_NEXT").length > 0)
   {
        if(document.getElementById("SMS_REMIND_NEXT").checked)
        {
            SMS_REMIND_NEXT = 1;
        }
        else
        {
            SMS_REMIND_NEXT = 0;
        }
   }

   if(turn_action == "" || typeof(turn_action) == 'undefined')
   {
        var action = $("input[name='TURN_ACTION']").val();
   }
   else
   {
        var action = turn_action;
   }
   
   if(new_prcs_id_next == "" || typeof(prcs_id_next) == 'undefined')
   {
        var prcs_id_next = ($("input[name='NEW_PRCS_ID_NEXT1']").val() == "" || typeof($("input[name='NEW_PRCS_ID_NEXT1']").val()) == "undefined") ? $("input[name='NEW_PRCS_ID_NEXT']").val() : $("input[name='NEW_PRCS_ID_NEXT1']").val();
   }
   else
   {
        var prcs_id_next = new_prcs_id_next;
   }
   
   if(prcs_id_next == 0 || typeof(prcs_id_next) == 'undefined')
   {
        if(TURN_PRIV != 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null))
        {
           alert("经办人["+NOT_ALL_FINISH+"]尚未办理完毕，不能结束流程！");
           return;
        }
        if(TURN_PRIV == 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
            if(confirm('经办人['+NOT_ALL_FINISH+']尚未办理完毕，确认要结束流程吗？'))
            {}
            else
            {
                return ;
            }
        }
   }
   var flow_type = $("input[name='FLOW_TYPE']").val();
   if(PRCS_BACK_LEN > 0)
   {
        action = "turn_user.php";
   }
   if((prcs_id_next == '' || typeof(prcs_id_next) == 'undefined') &&  flow_type != 2){
      showMessage(noselectedstep);
      return ;
   }
   //自由流程添加预设步骤
   if(flow_type == 2)
   {
        var freeStepVal = jQuery("input[name='FREE_STEP']").val();
   }
   $.ajax({
      type: 'GET',
      url: action,
      cache: false,
      data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'PRCS_KEY_ID': q_prcs_key_id, 'PRCS_ID_NEXT': prcs_id_next, 'SMS_REMIND_NEXT': SMS_REMIND_NEXT, 'RX_PRCS': RX_PRCS, 'FLOW_TYPE': flow_type, 'FREE_STEP': freeStepVal},
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
	    	back2list && back2list(workcomplete);
            return;   
         }/*else if(data.indexOf("no_msg*") >= 0)
         {
            var no_msg = data.substring(data.indexOf("*")+1);
            return
         }*/
         
         if(prcs_id_next == 0 && PRCS_BACK_LEN == 0){
            showPageMessage(data); 
         }else{
            reback(g_now_page,6);
            $("#page_6 > #wrapper_6 > #scroller_6").empty().append(data);
            $(".pages").hide();
            $("#page_6").show('fast',function(){
                pageInit(6);
            });
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

//选人界面提交操作
function turnUserWorkFlow(control_type){
   var prcs_back = '';
   var rx_prcs = '';
   var prcs_id_next = $("input[name='NEW_PRCS_ID_NEXT']").val();
   var prcs_id_next1 = $("input[name='NEW_PRCS_ID_NEXT1']").val();
   var free_step = $("input[name='FREE_STEP']").val();
   var preset = $("input[name='PRESET']").val();
   var VIEW_USER_ID = $("input[name='VIEW_USER_ID']").val();    //传阅人
   var prcs_back_len = $("input[name='prcs_back']").length; //是否返回父流程
   var flow_type = $("input[name='FLOW_TYPE']").val();
   // var prcs_op_uid = $("input[name='prcs_op_uid']").val();  //子流程返回父流程默认主办人
   // var prcs_uid = $("input[name='prcs_uid']").val();    //子流程返回父流程默认经办人
   var NOT_ALL_FINISH = $("input[name='NOT_ALL_FINISH_NEXT']").val(); //未办理完毕的经办人
   var TURN_PRIV = $("input[name='TURN_PRIV']").val(); //强制转交
   var RX_PRCS_LEN = $("#rx_prcs").length;  //柔性节点步骤名称
   var plugin_str = "";
   if(control_type){
        var form_plugin = document.form_plugin;
        plugin_str = jQuery(form_plugin).serialize();
        plugin_str = (plugin_str != "") ? "&TRIGGER="+control_type+"&"+plugin_str : "";
   }
   if(RX_PRCS_LEN > 0)
   {
       rx_prcs = $("#rx_prcs").val();
   }

   if(prcs_back_len > 0)
   {
        prcs_back = $("input[name='prcs_back']").val();  //子流程返回父流程步骤
   }
   if(prcs_id_next == "" || typeof(prcs_id_next) == 'undefined')
   {
      showMessage(error);
      return;
   }else{
      prcs_id_next = decodeURIComponent(prcs_id_next);//添加URL解码，兼容部分浏览器  
      if(free_step != "" && typeof(free_step) != 'undefined')
      {
            free_step = decodeURIComponent(free_step);
      }
   }
	var POST_STR = "RUN_ID="+q_run_id+"&FLOW_ID="+q_flow_id+"&PRCS_ID="+q_prcs_id+"&FLOW_PRCS="+q_flow_prcs+"&PRCS_KEY_ID="+q_prcs_key_id+"&PRCS_ID_NEXT="+prcs_id_next+"&FREE_STEP="+free_step+"&VIEW_USER_ID="+VIEW_USER_ID+"&PRCS_BACK="+prcs_back+"&RX_PRCS="+rx_prcs+plugin_str;
    if(free_step != "" && typeof(free_step) != undefined)
    {
        if(typeof(prcs_id_next1) !='undefined'){
            var prcs_id_next_str1 = prcs_id_next1 + free_step;
            var prcs_id_next_arr1 = prcs_id_next_str1.split(",");
        }
        var prcs_id_next_str = prcs_id_next + free_step;
        var prcs_id_next_arr = prcs_id_next_str.split(",");
    }
    else
    {
        var prcs_id_next_arr = prcs_id_next.split(",");
        if(typeof(prcs_id_next1) !='undefined'){
            var prcs_id_next_arr1 = prcs_id_next1.split(",");
        }
    }

   var _continue = true;
   var _error_step = 0;
	$.each(prcs_id_next_arr, function(key, val){
		if(val)
		{
		   var _zbems = $("#USER_ZB_" + val).find("em");
		   var _cbems = $("#USER_CB_" + val).find("em");
           var _topdefault = $("#TOP_DEFAULT_" + val);
           var _smsremind = $("#SMS_REMIND_NEXT_" + val);
           var _freeitem = (prcs_id_next1 != "" && typeof(prcs_id_next1) !='undefined') ? $("#FREE_ITEM_" + prcs_id_next_arr1[key]) : $("#FREE_ITEM_" + val);
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
           
           if(_topdefault.length > 0)
           {
                POST_STR += "&TOP_DEFAULT_" + val + "=" + $("#TOP_DEFAULT_" + val).val();
           }
           
           if(_freeitem.length > 0)
           {
                var free_item_val = (prcs_id_next1 != "") ? $("#FREE_ITEM_" + prcs_id_next_arr1[key]).val() : $("#FREE_ITEM_" + val).val();
                POST_STR += "&FREE_ITEM_" + val + "=" + free_item_val;
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
           
           // if(document.getElementById("SMS_REMIND_NEXT"))
		  // {
		  	  // if(document.getElementById("SMS_REMIND_NEXT").checked){
			  	// POST_STR += "&SMS_REMIND_NEXT=1,";
			  // }else{
			  	// POST_STR += "&SMS_REMIND_NEXT=2,";
			  // }
		  // }
            if(_smsremind.length > 0)
            {
                if(document.getElementById("SMS_REMIND_NEXT_" + val).checked)
                {
                    POST_STR += "&SMS_REMIND_NEXT_" + val + "=1";
                }
                else
                {
                    POST_STR += "&SMS_REMIND_NEXT_" + val + "=0";
                }
            }
		}
	});
	
	if(!_continue)
	{
	   showMessage(sprintf(errorblmsg,_error_step));
	   return;   
	}
	
	if(TURN_PRIV != 1 && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null) && flow_type == 1){
		alert("经办人["+NOT_ALL_FINISH+"]尚未办理完毕，不能转交流程！");
		return;
	}
	if((TURN_PRIV == 1 || flow_type == 2) && (NOT_ALL_FINISH !="" && NOT_ALL_FINISH != undefined && NOT_ALL_FINISH != null)){
		if(confirm('经办人['+NOT_ALL_FINISH+']尚未办理完毕，确认要转交下一步骤吗？')){
        }else{
            return ;
        }
    }
    POST_STR += "&FLOW_TYPE="+flow_type;
// alert(POST_STR)
// return;
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
         if(data == "TRIGGER"){
            p_pre_page = 6;
            goOnTriggerPage('TURN');
            return;
         }
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

// 删除流程
function cancel_flow()
{
    $.ajax({
        type: 'GET',
        url: 'delete_work.php',
        cache: false,
        data: {'RUN_ID_STR': q_run_id,'FLOW_ID': q_flow_id,'BEGIN_DEPT': q_flow_id},
        success: function(data)
        {
            if(data == "ALL"){
                delete_flow();
                back2list('流程号为【'+q_run_id+'】的流程已删除');
                return;
            }else{
                showMessage(data);
                return;
            }
        },
        error: function(data){
            showMessage('流程未删除');
            return;
        }
    });
}

function showPageMessage(str){
   $("div[id^='page_']").hide();
   $("#page_7 > #wrapper_7 > #scroller_7").empty().append(reMakeMessage(str));
   $("#page_7").show('fast',function(){pageInit(7);});
   $("#header div[id^='header_']").hide();
   $("#header_7").show();
}

//刷新列表
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

function goOnTriggerPage(type){
    g_tirgger_type = type;
    var data = {"P": p, "flow_id": q_flow_id, "run_id": q_run_id, "flow_prcs": q_flow_prcs, "prcs_id": q_prcs_id, "prcs_key_id": q_prcs_key_id, "type": g_tirgger_type};
    $.ajax({
        type: 'POST',
        url: 'trigger.php',
        cache: false,
        data: data,
        beforeSend: function(){
            $.ProLoading.show();
        },
        success: function(data)
        {
            $.ProLoading.hide();
            reback(g_now_page,'plugin');
            $("#page_plugin > #wrapper_plugin > #scroller_plugin").empty().append(data);
            
            jQuery('#PLUGIN_'+g_tirgger_type+'_BEFORE_POSITION').html(jQuery.templates('#PLUGIN_'+g_tirgger_type+'_BEFORE_POSITION_Tmpl').render({end_script:'</script>'}));
            jQuery('#PLUGIN_'+g_tirgger_type+'_AFTER_POSITION').html(jQuery.templates('#PLUGIN_'+g_tirgger_type+'_AFTER_POSITION_Tmpl').render({end_script:'</script>'}));
            
            $(".pages").hide();
            $("#page_plugin").show('fast',function(){
                pageInit('plugin');
            });
            $("#header div[id^='header_']").hide();
            $("#header_plugin").show();
            
         },
        error: function(data){
            $.ProLoading.hide();
            showMessage(triggerloadfile);
        }
    });
}
function turnTrigger()
{
    var trigger_type = g_tirgger_type.toLowerCase();
    //用户自定义js脚本执行程序
    var beforeCustomScript = jQuery("#"+trigger_type+"BeforeCustomScript").val();
    if(typeof beforeCustomScript !== 'undefined')
    {
        var customScriptArr = beforeCustomScript.split(",");
        for(var customScriptCount = 0; customScriptCount < customScriptArr.length; customScriptCount++)
        {
            if (typeof window[customScriptArr[customScriptCount]] == 'function')
            {
                var ret = window[customScriptArr[customScriptCount]]();
                // console.log(ret);
                if(typeof ret !== 'undefined')
                {
                    return;
                } 
            } 
        }
    }
    
    if(g_tirgger_type == 'TURN'){
        turnUserWorkFlow('TURN');
    }else if(g_tirgger_type == 'INTRUST'){
        goOnWorkFlowIntrust('INTRUST')
    }else if(g_tirgger_type == 'BACK'){
        goOnSelBackWorkFlow('BACK')
    }
    
    //用户自定义js脚本执行程序
    var afterCustomScript = jQuery("#"+trigger_type+"AfterCustomScript").val();
    if(typeof afterCustomScript !== 'undefined')
    {
        var customScriptArr = afterCustomScript.split(",");
        for(var customScriptCount = 0; customScriptCount < customScriptArr.length; customScriptCount++)
        {
            if (typeof window[customScriptArr[customScriptCount]] == 'function')
            {
                var ret = window[customScriptArr[customScriptCount]]();
                if(typeof ret !== 'undefined')
                {
                    return;
                } 
            } 
        }
    }
}

//工作流选人扩展搜索
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
         //绑定主办按钮点击事件
         $$list.delegate("a.ui-li-text-a","click",function(e){
			var user_lock = jQuery(this).attr('user_lock');
			var auto_type = jQuery(this).attr('auto_type');
			if (user_lock == '0' && auto_type !="" && jQuery('.read_detail_fem ').find('em').length != 0 ) 
			{
				alert("您无权更改此步骤默认人员");
				return false;
			}
            //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
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
         /*
         $$list.find("a.ui-li-text-a").die("click").live("click",function(e)
         {            
            //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
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
         */
         
         //绑定列表点击事件
         $$list.delegate("li","click",function(e){
			var user_lock = jQuery(this).attr('user_lock');
			var auto_type = jQuery(this).attr('auto_type');
			if (user_lock == '0' && auto_type !="" && jQuery('.read_detail_fem ').find('em').length != 0) 
			{
				return false;
			}
            //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
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
         /*
         $$list.find("li").die("click").live("click",function(e)
         {
            //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
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
         */
         //绑定主办人的删除操作
         var appendDom_zb_oems = $(appendDom_zb).find("em");
         var appendDom_zb_ospans = $(appendDom_zb).find("em span");
         $(appendDom_zb).delegate("em","click",function(e){
			var user_lock = jQuery(this).attr('user_lock');
			var auto_type = jQuery(this).attr('auto_type');
			if (user_lock == '0' && auto_type !="" && appendDom_zb_oems.length != 0) 
			{
				return false;
			}
            //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
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
         $(appendDom_zb).delegate("em span","click",function(e){
            //修复chrome下单击触发两次的bug
            if(false === fixDbClick.call(this, e)){
                return false;
            }
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
         
         //绑定经办人的删除操作
         var appendDom_cb_oems = $(appendDom_cb).find("em");
         var appendDom_cb_ospans = $(appendDom_cb).find("em").find("span");
         $(appendDom_cb).delegate("em","click",function(e){
			var user_lock = jQuery(this).attr('user_lock');
			var auto_type = jQuery(this).attr('auto_type');
			if (user_lock == '0' && auto_type !="" && appendDom_cb_oems.length != 0) 
			{
				return false;
			}
            //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
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
         $(appendDom_cb).delegate("em span","click",function(e){
            //修复chrome下单击触发两次的bug by JinXin @ 2012/10/15
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
         	if($(appendDom_top).val() == 0 || $(appendDom_top).val() == undefined)
         	{
            	$(appendDom_zb).append(str);
        	}
        	else 
        	{
        		$$list.find("a.ui-li-text-a").removeClass("current");
        	}
            
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
      
      function search_name(opt)
      {
        var reg = "";
        if(opt){
            var key = opt;
        }
        else{
            var key = $$input.val();
        }
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
                        reg += key.charAt(i) + "(.*)";
                     } 
                  }else{
                     reg = key + "(.*)";
                  } 
                  eval("reg = /(.*)" + reg + "/");
                  _orgObj = $("<ul>"+orgHtml+"</ul>");
                  _orgObj.find("li").each(function(){
                     q_name_index = $(this).attr("q_name_index");
                     q_user_id = $(this).attr("q_user_id");
                     if(reg.test(q_name_index) || reg.test(q_user_id)){
                        return true;
                     }
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

function goOnWorkFlowIntrust(control_type){
    var sms_remind = $("input[name='SMS_REMIND']").prop("checked") === true ? 1 : 0;
    // var sms_remind = $("input[name='SMS_REMIND']").val();
    var intrusto = $("#INTRUSTO").find("em").attr("userid");
    var username = $("#INTRUSTO").find("em").html();
    if(typeof(intrusto) == 'undefined'){
        alert('请先选择要委托的人员');
        return;
    }
    var plugin_str = '';
    var data = {
        'P': p,
        'RUN_ID' : q_run_id,
        'FLOW_ID' : q_flow_id,
        'PRCS_ID' : q_prcs_id,
        'FLOW_PRCS' : q_flow_prcs,
        'PRCS_KEY_ID' : q_prcs_key_id,
        'SMS_REMIND' : sms_remind,
        'INTRUSTO' : intrusto
    };
    if(control_type){
        var form_plugin = document.form_plugin;
        plugin_arr = jQuery(form_plugin).serializeArray();
        data['TRIGGER'] = control_type;
        for(var v in plugin_arr){
            data[plugin_arr[v]['name']] = plugin_arr[v]['value'];
        }
        // console.log(plugin_str);
        // plugin_str = (plugin_str != "") ? "&TRIGGER="+control_type+"&"+plugin_str : "";
    }
    $.ajax({
        type: 'POST',
        url: 'intrust_submit.php',
        cache: false,
        data : data,
        success: function(data)
        {
            if(data == 'NONORMAL'){
                alert('当前工作状态不在办理中，不允许委托');
                return;
            }else if(data == 'NOCB2ZB'){
                alert('不能将经办工作委托给主办人');
                return;
            }else if(data == 'NOCB2CB'){
                alert('不能将经办工作委托给其它经办人');
                return;
            }else if(data == 'NOZB2ZB'){
                alert('不能将主办工作委托给主办人(自己转自己情况)');
                return;
            }else if(data == 'SUCCESS'){

                //处理成功的情况
                //alert('委托成功');
                showPageMessage('委托成功');
                back2list && back2list('委托成功');
                return;
            }else if(data == "TRIGGER"){
                p_pre_page = 17;
                goOnTriggerPage('INTRUST');
                return;
            }
        },
        error: function(data){
            showMessage(getfature);
        }
    });
}

//工作流委托选人扩展搜索
$.extend({
    workFlowIntrustSearch: function (options)
    {
        var defaults = {
            url: "/pda/inc/get_contactlist.php"
        };

        var options = $.extend(true, defaults, options);
        var input = options.input;
        var list = options.list;
        var appendDom_wt = options.appendDom_wt;
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

            //绑定列表点击事件
            $$list.delegate("li","click",function(e){
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
                        remove_user($(this));
                    }else{
                        remove_user($(this));
                    }
                    return;
                }else{
                    $$list.find("li").each(function()
                    {
                        if($(this).hasClass("active")){
                            $(this).removeClass("active");
                            remove_user($(this));
                        }
                    });
                    $(this).addClass("active");
                    that = $(this);
                    _uid = that.attr("q_id");
                    var haswt = false;
                    if($(appendDom_wt).find("em").length > 0)
                    {
                        $(appendDom_wt).find("em").each(function(){
                            if($(this).attr("uid") == _uid)
                            {
                                that.addClass("active");
                                that.find("a.ui-li-text-a").addClass("current");
                                haswt = true;
                                return false;
                            }
                        });

                        if(!haswt)
                        {
                            add_user($(this));
                        }
                        return;
                    }else{
                        $(this).find("a.ui-li-text-a").addClass("current");
                        add_user($(this));
                        return;
                    }
                }
            });

            //绑定委托人的删除操作
            $(appendDom_wt).delegate("em","click",function(e){
                if(false === fixDbClick.call(this, e)){
                    return false;
                }
                e.stopPropagation();
                if(!$(this).hasClass("active"))
                {
                    $(appendDom_wt).find("em").removeClass("active");
                    $(appendDom_wt).find("em span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                    $(this).addClass("active");
                    $(this).find("span").animate({width: '16'}, {complete: function(){$(this).show();}, duration: 200 });
                }else{
                    $(this).removeClass("active");
                    $(this).find("span").animate({width: '0'},{complete: function(){$(this).hide();}, duration: 200 });
                }
            });
            $(appendDom_wt).delegate("em span","click",function(e){
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
                        $(this).removeClass("active");
                        return false;
                    }
                });
                return;
            });

        }

        function add_user(o)
        {
            remove_user();
            str = "";
            _oSelect_uid = o.attr("q_id");
            _oSelect_name = o.attr("q_name");
            _oSelect_user_id = o.attr("q_user_id");
            str = "<em uid='"+_oSelect_uid+"' userid='"+_oSelect_user_id+"'>" + _oSelect_name +"<span>—</span></em>";
            $(appendDom_wt).append(str);
        }

        function remove_user(o)
        {
            $(appendDom_wt).find("em").each(function(){
                $(this).remove();
            });
        }

        function refreshListStatu()
        {
            var wt_oems = $(appendDom_wt).find("em");
            if(wt_oems.length > 0)
            {
                $(list).find("li").each(function(){
                    if($(this).attr("q_id") == wt_oems.attr("uid"))
                    {
                        $(this).addClass("active");
                        return false;
                    }
                });
            }
        }

        function search_name(opt)
        {
            var reg = "";
            if(opt){
                var key = opt;
            }
            else{
                var key = $$input.val();
            }
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
                                reg += key.charAt(i) + "(.*)";
                            }
                        }else{
                            reg = key + "(.*)";
                        }
                        eval("reg = /(.*)" + reg + "/");
                        _orgObj = $("<ul>"+orgHtml+"</ul>");
                        _orgObj.find("li").each(function(){
                            q_name_index = $(this).attr("q_name_index");
                            q_user_id = $(this).attr("q_user_id"); 
                             if(reg.test(q_name_index) || reg.test(q_user_id)){
                                return true;
                            }
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