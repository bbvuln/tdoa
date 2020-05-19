$(document).ready(function(){
    pageInit(1);
});
//读取子分类
function getReportNextList(obj,n)
{
   var topcode = $(obj).attr('rep_kid');
   $.ajax({
      type: 'GET',
      url: 'next_list.php',
      cache: false,
      data: {'P': p, 'topcode': topcode},
      beforeSend: function(){
          $("#overlay").show();
          $(".ui-loader").show();
      },
      success: function(data)
      {
          $("#overlay").hide();
          $(".ui-loader").hide();
         $("div[id^='page_']").hide();
         $("#page_2 > #wrapper_2 > #scroller_2").empty().append(data);
         $("#page_2").show('fast',function(){
           pageInit(2);
         });
         $("#header div[id^='header_']").hide();
         $("#header_2").show();
        
         if (n != 1)
         {
             g_pre_page = 1;
             g_now_page = 3;
         } else {
             g_pre_page = 2;
             g_now_page = 3;
         }
      },
      error: function(data){
          $("#overlay").hide();
          $(".ui-loader").hide();
         showMessage(getfature);
      }
   });
}

//读取报表表单
function getReportList(obj,n)
{
   var kindid = $(obj).attr('rep_kid');
   $.ajax({
      type: 'GET',
      url: 'report_list.php',
      cache: false,
      data: {'P': p, 'kindid': kindid},
      beforeSend: function(){
          $("#overlay").show();
          $(".ui-loader").show();
      },
      success: function(data)
      {
          $("#overlay").hide();
          $(".ui-loader").hide();
         $("div[id^='page_']").hide();
         $("#page_3 > #wrapper_3 > #scroller_3").empty().append(data);
         $("#page_3").show('fast',function(){
           pageInit(3);
         });
         $("#header div[id^='header_']").hide();
         $("#header_3").show();
         if (n != 1)
         {
             pre_page = 1;
             g_pre_page = 1;
         } else {
             pre_page = 2;
             g_pre_page = 2;
         }
         g_now_page = 3;
      },
      error: function(data){
          $("#overlay").hide();
          $(".ui-loader").hide();
         showMessage(getfature);
      }
   });
}

//读取报表单记录
function getReportRecord(obj)
{
   var repid = $(obj).attr('rep_id');
   $.ajax({
      type: 'GET',
      url: 'report_record.php',
      cache: false,
      data: {'P': p, 'repid': repid},
      beforeSend: function(){
          $("#overlay").show();
          $(".ui-loader").show();
      },
      success: function(data)
      {
         $("#overlay").hide();
         $(".ui-loader").hide();
         $("div[id^='page_']").hide();
         $("#page_4 > #wrapper_4 > #scroller_4").empty().append(data);
         $("#page_4").show('fast',function(){
           pageInit(4);
         });
         $("#header div[id^='header_']").hide();
         $("#header_4").show();
         $("#reportId").val(repid);
      },
      error: function(data){
         $("#overlay").hide();
         $(".ui-loader").hide();
         showMessage(getfature);
      }
   });
}


//读取记录详细信息
function getReportRecordDetail(obj,checkRead)
{
   if (checkRead == 0)
   {
	   alert(notread);
	   return false;
   }
   var id = $(obj).attr('tabdata_id');
   var tabid = $(obj).attr('tabid');
   var writetime = $(obj).attr('writetime');
   var repid = $(obj).attr('repid');
   var userid = $(obj).attr('userid');
   var organid = $(obj).attr('organid');
   $("#operate_writetime").val(writetime);
   $("#operate_repid").val(repid);
   $("#operate_userid").val(userid);
   $("#operate_organid").val(organid);
   $.ajax({
      type: 'GET',
      url: 'record_detail.php',
      cache: false,
      data: {'P': p, 'id': id, 'repid': repid,'userid':userid, 'organid':organid, 'tabid':tabid, 'writetime':writetime},
      beforeSend: function(){
          $("#overlay").show();
          $(".ui-loader").show();
      },
      success: function(data)
      {
          $("#overlay").hide();
          $(".ui-loader").hide();
         $("div[id^='page_']").hide();
         $("#page_5 > #wrapper_5 > #scroller_5").empty().append(data);
         $("#page_5").show('fast',function(){
           pageInit(5);
         });
         if($("#page_5").css('display') == 'none'){
        	 $("#page_5").show();
         }
         $("#header div[id^='header_']").hide();
         $("#header_5").show();
      },
      error: function(data){
          $("#overlay").hide();
          $(".ui-loader").hide();
         showMessage(getfature);
      }
   });
}

function getNextDetail(tablist,userid,organid,writetime,repid)
{
    $.ajax({
        type: 'GET',
        url: 'next_detail.php',
        cache: false,
        data: {'tablist':tablist,'userid':userid,'organid':organid,'writetime':writetime,'repid':repid},
        beforeSend: function(){
            $("#overlay").show();
            $(".ui-loader").show();
        },
        success: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            $("div[id^='page_']").hide();
            $("#page_7 > #wrapper_7 > #scroller_7").empty().append(data);
            $("#page_7").show('fast',function(){
                pageInit(7);
            });
            $("#header div[id^='header_']").hide();
            $("#header_7").show();
        },
        error: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            showMessage(getfature);
        }
    });
}
//获取待办理事宜
function getTodo()
{
   $.ajax({
        type: 'GET',
        url: 'todo.php',
        cache: false,
        beforeSend: function(){
            $("#overlay").show();
            $(".ui-loader").show();
        },
        success: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            $("div[id^='page_']").hide();
            $("#page_9 > #wrapper_9 > #scroller_9").empty().append(data);
            $("#page_9").show('fast',function(){
                pageInit(9);
            });
            $("#header div[id^='header_']").hide();
            $("#header_9").show();
        },
        error: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            showMessage(getfature);
        }
    });	
}
//查询待办理页面
function searchTodo()
{
	   $.ajax({
	        type: 'GET',
	        url: 'search_todo.php',
	        cache: false,
            beforeSend: function(){
               $("#overlay").show();
               $(".ui-loader").show();
            },
	        success: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            $("div[id^='page_']").hide();
	            $("#page_10 > #wrapper_10 > #scroller_10").empty().append(data);
	            $("#page_10").show('fast',function(){
	                pageInit(10);
	            });
	            $("#header div[id^='header_']").hide();
	            $("#header_10").show();
	        },
	        error: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            showMessage(getfature);
	        }
	    });		
}

//待办理事宜详细信息
function getTodoDetail(obj)
{
	   var shixiang = $(obj).attr('shixiang');
	   var user = $(obj).attr('user');
	   var ptime = $(obj).attr('ptime');
	   var deadline = $(obj).attr('deadline');
	   var id = $(obj).attr('sid');
	   var repid = $(obj).attr('repid');
	   var userid = $(obj).attr('userid');
	   var organid = $(obj).attr('organid');
	   var writetime = $(obj).attr('writetime');
	   var workflow = $(obj).attr('workflow');
	   var u_list_str = $(obj).attr('u_list_str');
	   
	   $("#manage_repid").val(repid);
	   $("#manage_userid").val(userid);
	   $("#manage_organid").val(organid);
	   $("#manage_writetime").val(writetime);
	   $("#manage_workflow").val(workflow);
	   $("#manage_u_list_str").val(u_list_str);
	   $.ajax({
	        type: 'GET',
	        url: 'todo_detail.php',
	        cache: false,
	        data: {'shixiang':shixiang, 'user':user, 'ptime':ptime, 'deadline':deadline},
            beforeSend: function(){
               $("#overlay").show();
               $(".ui-loader").show();
            },
	        success: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            $("div[id^='page_']").hide();
	            $("#page_11 > #wrapper_11 > #scroller_11").empty().append(data);
	            $("#page_11").show('fast',function(){
	                pageInit(11);
	            });
	            $("#header div[id^='header_']").hide();
	            $("#header_11").show();
	        },
	        error: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            showMessage(getfature);
	        }
	    });		
}

//查询待办理事宜结果
function seachTodoSub()
{
	var searchTodo = $("#searchTodo").val();
	//alert(searchTodo);
	//return;
    $.ajax({
        type: 'GET',
        url: 'todo.php',
        cache: false,
        data: {'searchTodo':searchTodo},
        beforeSend: function(){
            $("#overlay").show();
            $(".ui-loader").show();
        },
        success: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            $("div[id^='page_']").hide();
            $("#page_9 > #wrapper_9 > #scroller_9").empty().append(data);
            $("#page_9").show('fast',function(){
                pageInit(9);
            });
            $("#header div[id^='header_']").hide();
            $("#header_9").show();
        },
        error: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            showMessage(getfature);
        }
    });		
}

//获取办理中事宜
function getDoing()
{
   $.ajax({
        type: 'GET',
        url: 'doing.php',
        cache: false,
        beforeSend: function(){
           $("#overlay").show();
           $(".ui-loader").show();
        },
        success: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            $("div[id^='page_']").hide();
            $("#page_12 > #wrapper_12 > #scroller_12").empty().append(data);
            $("#page_12").show('fast',function(){
                pageInit(12);
            });
            $("#header div[id^='header_']").hide();
            $("#header_12").show();
        },
        error: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            showMessage(getfature);
        }
    });	
}

//查询办理中页面
function searchDoing()
{
	   $.ajax({
	        type: 'GET',
	        url: 'search_doing.php',
	        cache: false,
            beforeSend: function(){
               $("#overlay").show();
               $(".ui-loader").show();
            },
	        success: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            $("div[id^='page_']").hide();
	            $("#page_14 > #wrapper_14 > #scroller_14").empty().append(data);
	            $("#page_14").show('fast',function(){
	                pageInit(14);
	            });
	            $("#header div[id^='header_']").hide();
	            $("#header_14").show();
	        },
	        error: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            showMessage(getfature);
	        }
	    });		
}

//查询办理中事宜结果
function seachDoingSub()
{
	var searchDoing = $("#searchDoing").val();
	//alert(searchDoing);
	//return;
    $.ajax({
        type: 'GET',
        url: 'doing.php',
        cache: false,
        data: {'searchDoing':searchDoing},
        beforeSend: function(){
            $("#overlay").show();
            $(".ui-loader").show();
        },
        success: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            $("div[id^='page_']").hide();
            $("#page_12 > #wrapper_12 > #scroller_12").empty().append(data);
            $("#page_12").show('fast',function(){
                pageInit(12);
            });
            $("#header div[id^='header_']").hide();
            $("#header_12").show();
        },
        error: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            showMessage(getfature);
        }
    });		
}

//办理中事宜详细信息
function getDoingDetail(obj)
{
	   var shixiang = $(obj).attr('shixiang');
	   var user = $(obj).attr('user');
	   var ptime = $(obj).attr('ptime');
	   var deadline = $(obj).attr('deadline');
	   var id = $(obj).attr('sid');
	   var repid = $(obj).attr('repid');
	   var userid = $(obj).attr('userid');
	   var organid = $(obj).attr('organid');
	   var writetime = $(obj).attr('writetime');
	   var workflow = $(obj).attr('workflow');
	   var u_list_str = $(obj).attr('u_list_str');
	   
	   $("#manage_repid").val(repid);
	   $("#manage_userid").val(userid);
	   $("#manage_organid").val(organid);
	   $("#manage_writetime").val(writetime);
	   $("#manage_workflow").val(workflow);
	   $("#manage_u_list_str").val(u_list_str);
	   $.ajax({
	        type: 'GET',
	        url: 'doing_detail.php',
	        cache: false,
	        data: {'shixiang':shixiang, 'user':user, 'ptime':ptime, 'deadline':deadline},
            beforeSend: function(){
               $("#overlay").show();
               $(".ui-loader").show();
            },
	        success: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            $("div[id^='page_']").hide();
	            $("#page_13 > #wrapper_13 > #scroller_13").empty().append(data);
	            $("#page_13").show('fast',function(){
	                pageInit(13);
	            });
	            $("#header div[id^='header_']").hide();
	            $("#header_13").show();
	        },
	        error: function(data){
                $("#overlay").hide();
                $(".ui-loader").hide();
	            showMessage(getfature);
	        }
	    });		
}
//查询数据列表结果
function searchSubmit()
{
	var searchName = $("#searchName").val();
    var repId = $("#reportId").val();
    $.ajax({
        type: 'GET',
        url: 'report_record.php',
        cache: false,
        data: {'repid':repId,'searchName':searchName},
        beforeSend: function(){
            $("#overlay").show();
            $(".ui-loader").show();
        },
        success: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            $("div[id^='page_']").hide();
            $("#page_4 > #wrapper_4 > #scroller_4").empty().append(data);
            $("#page_4").show('fast',function(){
                pageInit(4);
            });
            $("#header div[id^='header_']").hide();
            $("#header_4").show();
        },
        error: function(data){
            $("#overlay").hide();
            $(".ui-loader").hide();
            showMessage(getfature);
        }
    });	
}


