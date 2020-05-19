jQuery.noConflict();

function showFrame(flag) {
    jQuery("#task-detail").toggle(flag);
    jQuery("#task-container").toggle(!flag);
} 

function delete_attach(ATTACHMENT_ID,ATTACHMENT_NAME)
{
  	var msg = sprintf("确定要删除文件 '%s' 吗？", ATTACHMENT_NAME);
  	if(window.confirm(msg))
  	{
  		ITask.delelteAttach(ATTACHMENT_ID,ATTACHMENT_NAME);
	}
}

(function($){
    String.prototype.format = function(args){
        var result = this;
        if (arguments.length > 0) {    
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
        }
        return result;
    }
    
    
    var router = "router.php";   
    var ITask = {
    	log: function(){
    			try {
    				console.log(arguments);
    			}catch(e){}
    	},
        request_url : {
            "createTask"     : router + "/Task/createTask",
            "editTask"     : router + "/Task/editTask",
            "searchTask"     : router + "/Task/searchTask",
            "sortTask"		: router + "/Task/sortTask",
            "getTaskList"    : router + "/Task/getTaskList",
            "getTaskCount"   : router + "/Task/getTaskCount",
            "deleteTask"     : router + "/Task/deleteTask",
            "hangupTask"	: router + "/Task/hangupTask",
            "recycleTask"     : router + "/Task/recycleTask",
            "rerunTask"     : router + "/Task/rerunTask",
            "goonTask"     : router + "/Task/goonTask",
            "haltTask"     : router + "/Task/haltTask",
            "doneTask"     : router + "/Task/doneTask",
            "changeCategory" : router + "/Task/changeCategory",
            "deleteCategory" : router + "/TaskCategory/deleteCategory",
            "createTaskMsg"  : router + "/TaskMessage/createTaskMsg",
            "deleteTaskMsg"  : router + "/TaskMessage/deleteTaskMsg",
            "getCategoryList"  : router + "/TaskCategory/getCategoryList",
            "createCategory" : router + "/TaskCategory/createCategory",
            "getUser"        : router + "/Task/getUser",
            "setTaskStar"    : router + "/Task/setTaskStar",
            "prcsTask"    : router + "/Task/prcsTask",
            "getMainStatus"  : router + "/Task/getMainStatus",
            "checkCataName"	:router + "/TaskCategory/checkCataName"
        },
        
        //Do initialization.
        init : function(){                                           
            //Tips for ie6.
            if($.browser.version == "6.0")
            {
                this.popWindow("browser-tip");
            }
            this.getTaskCount();
            this.bindEvent();
            $("#nav li:first").trigger("click");
            this.getCategoryList();
            $(window).triggerHandler("resize");
                
        },
        
        attachPositionFix:function(div){
        	$.each(div[0].childNodes, function(){
        		if(this.nodeType == 3){
        			$(this).remove();	
        		}	
        	});       	
        	$('[id^=attach][onmouseover]', div).each(function(){  		
        		this.onmouseover = null;
        		var $this = $(this),
        		$menu = $('#' + this.id + '_menu');
        		
	        	$this
	        	.css({
	        		'display': 'block',
	        		'line-height': '22px'
	        	})
	        	.mouseover(function(){
					var $this = $(this),
					pos = $this.position();
					pos.top += 20;
					$menu.css({
	        			top: pos.top,
	        			left: pos.left,
	        			display: 'block'
	        		});
				}).mouseleave(function(){
					var timer = setTimeout(function(){
						$menu.hide();
					},500);
					
					$menu.data('menuTimer', timer);
				});
				$menu.mouseleave(function(){
					this.style.display = 'none';
				}).mouseenter(function(){
					var timer = $(this).data('menuTimer');
					timer && clearTimeout(timer);
				});
        	});
        },
        delelteAttach : function(ATTACHMENT_ID,ATTACHMENT_NAME){
        	$span = $('#ATTACHMENT_div span a:contains("'+ATTACHMENT_NAME+'")').parent();
        	$div  = $('#ATTACHMENT_div div[title="'+ATTACHMENT_NAME+'"]');
        	var form = $('form[name=form_task]');
        	$("#ATTACHMENT_ID_OLD",form).val($("#ATTACHMENT_ID_OLD",form).val().replace(ATTACHMENT_ID + ",",''));
        	$("#ATTACHMENT_NAME_OLD",form).val($("#ATTACHMENT_NAME_OLD",form).val().replace(ATTACHMENT_NAME + "*",''));
        	$span.remove();
        	$div.remove();
			//yc
			$span2 = $('#ATTACHMENTS_div span a:contains("'+ATTACHMENT_NAME+'")').parent();
        	$div2 = $('#ATTACHMENTS_div div[title="'+ATTACHMENT_NAME+'"]');
			var form2 = $('form[name=form_tasks]');
			$("#ATTACHMENT_ID_OLDS",form2).val($("#ATTACHMENT_ID_OLDS",form2).val().replace(ATTACHMENT_ID + ",",''));
        	$("#ATTACHMENT_NAME_OLDS",form2).val($("#ATTACHMENT_NAME_OLDS",form2).val().replace(ATTACHMENT_NAME + "*",''));
			$span2.remove();
        	$div2.remove();
        },
        //bind event to element.
        bindEvent : function() {
            //Adjust layout size.
            $(window).resize(function(){
                var height = $(window).height() - $('#header').outerHeight();
                var width  = $(window).width() - $('#content-left').outerWidth();
                $('#content').height(height);
                //$('#content-right').width(width);
                $('#task-list-container').width(Math.max(width-20,550));
                $("#nav-list").height(height-$("#task-create").outerHeight()-7).scroll();
            });
           
            
        	$(".fold").live("click", function(){
        		var parent_id = $(this).parent().data("AID");
        		$("#task-list li[PARENT_ID = "+parent_id+"]").toggle();
        		var $handle = $(".fold i",$(this).parent());
                if($handle.hasClass('carat')){
                    return;
                }
                $handle.attr('class', $handle.hasClass('minus') ? 'plus' : 'minus');
                 if ($(".t-star").css("display") == "none") {$(".star").hide();$(".star-yellow").hide();};
        	});
        	
            $("#category-root").live("hover", function(event){
                if (event.type == 'mouseenter') {
					$(this).children(".add").show();
		        }else {
				    $("#category-root").css({"background":"none"});
				    $(this).children(".add").hide();
		        }
		    });
	        $("#category li").live("hover", function(event) {
		        if (event.type == 'mouseenter') {
					$(this).children(".i-edit").show();
		        }else {
					$(this).children(".i-edit").hide();
		        }
		    });
		    
		    $(".search-form input").keydown(function(e){
　              if(e.keyCode == 13)
                {
                    ITask.search();
                }
            });
            
            $("#category-root a").click(function(){
                $("i",this).toggleClass("close");
                $("#category").toggle();
                
            })

            $("#task-close, #category-close, #category-close, #confirm-close, #search-close, #prcs-close, #tasks-close").click(function(){$.modal.close();});		
                        
            $("#search-adv-link").click(function(){ITask.searchAdv();});
            
            //Bind click event to the <li> element in left sidebar
            $("#content-left ul li").live("click",function(){
                var old = $("#content-left .selected").removeClass("selected");
                $(this).addClass("selected");
                showFrame(false);
                //Get task list.
                ITask.getTaskList();
            });
            
            //Bind click event to the <li><a> element in task list.
            $("#content-right #task-list li .title a").live("click",function(){
                showFrame(true);
                var li = $(this).parents('.task-item:first'),taskid;
                taskid = li.data("TASK").TASK_ID;
               
                $("#task-detail #main").attr("src", "frames/task.php?TASK_ID="+taskid);
            });     
                   
		    $("#task-create").click(function(){
		    	var year,day,month,date;
		    	date = new Date();
		    	year = date.getFullYear();
		    	month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + parseInt(date.getMonth() + 1);
		    	day = date.getDate()>9 ? date.getDate() : '0' + date.getDate();			    	
		        ITask.popWindow("task-content");
		        $("input[name='BEGIN_DATE']").val(year + '-' + month + '-' + day);
                ITask.taskDecompose.init($('#task-decompose-box')); 
                ITask.taskDecompose.add().add().add();
		    });
		    
			$('#task-decompose-box').bind('scroll', function(){			
				this.style.zoom = '1';
				this.style.zoom = 'normal';									
			});
			
			if($.browser.msie && ($.browser.version == '6.0' || $.browser.version == '7.0')){
				$('#task-container').bind('scroll',function(){		
					this.style.zoom = 'normal';	
					this.style.zoom = '1';								
				});	
			}
		    //任务分类  
			$("#category-root .add").click(function(){
			    ITask.popWindow("category-content");
			    $("#category-content .popwindow-title").html("添加自定义分类");
			    $("#category-delete").hide();
			});  
			$("#category i.i-edit").live("click",function(){
			    ITask.popWindow("category-content");
			    var li = $(this).parent();
			    var form =  $("form[name='form_category']");
			    var category = li.data("CATEGORY");		
			    $("input[name='CAT_NAME']",form).val(category.CAT_NAME);
			    $("#CAT_DESC",form).val(category.CAT_DESC);
			    $("input[name='CAT_AID']",form).val(category.AID);
			    $("input[name='CAT_ORDER_ID']",form).val(category.ORDER_ID);
			    $("#category-content .popwindow-title").html("编辑自定义分类");
			}); 
			
			
 	        $("#TASKER_DIV .item").live("hover", function(event) {
		        if (event.type == 'mouseenter') {
					$(this).addClass("select");	
		        }else {
					$(this).removeClass("select");
		        }
		        /*
		  		$(this).dblclick(function(event){
				    $(this).focus();
		  		    $("#TASKER").attr("contenteditable",false);
		  		    $(this).attr("contenteditable",true);
		        });
		        */
	        });
	        
	        $("#TASKER_DIV").bind('keydown', function (e) {
	            if($("#TASKER_DIV .select").size() == 1)
	            {
			        switch (e.keyCode) 
			        {
			            case 8:
			            case 46:
			                //删除
			                var tasker = $("#TASKER").val();
			                var uid = $("#TASKER_DIV .select").attr("uid");
			                if(tasker.indexOf(uid+",")==0)
                                $("#TASKER").val(tasker.replace(uid+",",""));
                            else if(tasker.indexOf(","+uid+",")>0)
                                $("#TASKER").val(tasker.replace(","+uid+",",","));
					        $("#TASKER_DIV .select").remove()
				            break
			        }
			    }
		    });
 	        
            $("#task-submit").live('click', function(){
            	$("#task-content form input[name='TASK_CREATE_CALLBACK']").val("ITask.createTaskCallback");
            	        	
                if($("#task-content form input[name='TITLE']").val() == "")
                {
                    alert("任务标题不能为空！");
                    $("#task-content form input[name='TITLE']")[0].focus();
                    return;
                }    
                if($("#task-content form input[name='BEGIN_DATE']").val() == "")
                {
                    alert("开始日期不能为空！");
                    $("#task-content form input[name='BEGIN_DATE']")[0].focus();
                    return;
                }    
                if($("#task-content form input[name='END_DATE']").val() == "")
                {
                    alert("截止日期不能为空！");
                    $("#task-content form input[name='END_DATE']")[0].focus();
                    return;
                }
                if($("#task-content form input[name='BEGIN_DATE']").val() > $("#task-content form input[name='END_DATE']").val())
                {
                    alert("开始日期不能大于截止日期！");
                    $("#task-content form input[name='END_DATE']")[0].focus();
                    return;
                }
                
                var passflag = true;
                var itaskflag = 1;
                $('.task-decompose-item').each(function(i){
                	var j = i+1;
                	if(!$("#task-decompose-descript-"+j).val() && !$("#task-decompose-users-name-"+j).val() && !$("#task-decompose-datetimes-from-"+j).val() && !$("#task-decompose-datetimes-to-"+j).val()){ 
						if(itaskflag == $('.task-decompose-item').size())
							itaskflag = false;
						else
							itaskflag = itaskflag + 1;
                		return;	
                	}
                	else{
	                	if($("#task-decompose-descript-"+j).val() == ""){
	                		alert("第"+j+"条任务描述不能为空");
	                		$("#task-decompose-descript-"+j)[0].focus();
	                		passflag = false;
	                		return false;
	                	}   
	                	if($("#task-decompose-users-name-"+j).val() == ""){
	                		alert("第"+j+"条任务执行人不能为空");
	                		$("#task-decompose-users-label-"+j)[0].focus();
	                		passflag = false;
	                		return false;
	                	}                  	 
	                	if($("#task-decompose-datetimes-from-"+j).val() == ""){
	                		alert("第"+j+"条任务开始日期不能为空");
	                		$("#task-decompose-datetimes-from-"+j)[0].focus();
	                		passflag = false;
	                		return false;
	                	}                  	 
	                	if($("#task-decompose-datetimes-to-"+j).val() == ""){
	                		alert("第"+j+"条任务截止日期不能为空");
	                		$("#task-decompose-datetimes-to-"+j)[0].focus();
	                		passflag = false;
	                		return false;
	                	}                    	 
	                	if($("#task-decompose-datetimes-from-"+j).val() > $("#task-decompose-datetimes-to-"+j).val()){
	                		alert("第"+j+"条任务开始日期不能大于截止日期");
	                		$("#task-decompose-datetimes-to-"+j)[0].focus();
	                		passflag = false;
	                		return false;
	                	} 
	                	if($("input[name='BEGIN_DATE']").val() > $("#task-decompose-datetimes-from-"+j).val()){
	                		alert("第"+j+"条任务开始日期早于主任务开始日期");
	                		$("#task-decompose-datetimes-from-"+j)[0].focus();
	                		passflag = false;
	                		return false;
	                	} 
	                	if($("input[name='END_DATE']").val() < $("#task-decompose-datetimes-to-"+j).val()){
	                		alert("第"+j+"条任务截止日期晚于主任务截止日期");
	                		$("#task-decompose-datetimes-to-"+j)[0].focus();
	                		passflag = false;
	                		return false;
	                	}
	                }
                });
                if(!itaskflag){
	                if(confirm('您还没有分解任务，确定要保存吗？')){
		                if(passflag){              	
		                	$('#task-content form').submit();
		                }
		            }
	        	}else {
	        		
		                if(passflag){               	
		                	$('#task-content form').submit();
		                }	        		
	        	}     
            });
			//yc
			 $("#tasks-submit").live('click', function(){
            	$("#tasks-content form input[name='TASK_CREATE_CALLBACK']").val("ITask.createTaskCallback");
				$('#tasks-content form').submit();
                
            });
            
            $("#category-submit").live('click', function(){
                if($("#category-content form input[name='CAT_NAME']").val() == "")
                {
                    alert("分类名称不能为空！");
                    return;
                }
                var aid = $("#category-content form input[name='CAT_AID']").val();
                var flag = "true";
                var temName = $("#category-content form input[name='CAT_NAME']").val();
                
                ITask.request("checkCataName",{"temName":temName, "aid":aid},function(data,stat){
                	if(stat=="-1"){
                		alert("分类名称重复！");
                		$("#category-content form input[name='CAT_NAME']")[0].select();
                		return false;
                	}else{                	
	                	ITask.request("createCategory", $("#category-content form").serialize(), function(category){ 
	                		ITask.getCategoryList();
	                		ITask.getTaskCount();
	                    	$.modal.close();
	                	});
                	}
                });
            });
            $("#category-delete").live('click', function(){
                var confirmMsg = confirm("确定要删除当前分类吗?");
                CAT_ID = $("#category-content form input[name='CAT_AID']").val();
                var li = $("li[key=category][val=key_"+CAT_ID+"]");
                if (confirmMsg==true)
			    {
                	ITask.request("deleteCategory", {"CAT_ID":CAT_ID}, function(stat){   	 
                    if(stat >= 0){
                        li.hide();                        
                    }
                    $.modal.close();                		
                	});
			    }
            });
            $("#search-submit").live('click', function(){
            	if(($("#TASK_START_DATE_S").val() > $("#TASK_START_DATE_E").val() && $("#TASK_START_DATE_E").val()!='') || 
            	($("#TASK_END_DATE_S").val() > $("#TASK_END_DATE_E").val() && $("#TASK_END_DATE_E").val()!='')){
					alert("请输入正确的时间段！");
	            }
	            else{
	            	var alert_flag = 'alert';
	            	$("form[name='form_search_task'] input").each(function(){	            				            				
	            				alert_flag = (this.value == '' && alert_flag == 'alert') ? 'alert' : '';
	            		});
	            	if(alert_flag == ''){
	            		var para = $("#search-content form").serialize()+'&fix='+$("#content-left li.selected").attr("val");
	            		var para_to = new Array();
		            	ITask.request("searchTask", para, function(data){  
		            		paras=para.split("&");
		            		for (i=0;i<paras.length ;i++ ) 
						    {    
						    	temp_arr = paras[i].split("=");
						    	temp_key = temp_arr[0];
						    	temp_val = temp_arr[1];
//						    	if(temp_key=="TASKER"){
//						    		temp_val = temp_val.replace(/%2C/g,",");
//						    	}
						    	para_to[temp_key] = temp_val;
						    } 
		                	$("#task-title").show();    	                   
		                    ITask.createTaskList(data);                
							ITask.pageBar.init($('#pageArea'),{
								url:"searchTask",
								curPage:data.data.page_cur,
								totalPage:data.data.page_total,
								dataExtend: function(p){
									p = p || {};
									return $.extend({}, p, para_to);	
								},
								callback: function(data, stat){
            						ITask.createTaskList(data);
								}
							});
		                    $.modal.close();
		                });
	               }else{
	               		alert('请输入需要查询的条件！');
	               	} 
	            }
            }); 
            
            $("#prcs-submit").live('click', function(){
                var prcs = $("#prcs-content form [name=TASK_PRCS]").val();
                var $line = $("#prcs-content form").data('task-active-line');
                ITask.request("prcsTask", $("#prcs-content form").serialize(), function(data, stat){        	 
                    if(stat >= 0){
                        $line.data('TASK').PROGRESS = prcs;
                        $line.find('.prcs b').html(prcs+'%');
						$line.find('.date').html(data);
                        if(prcs=="100"){
                        	  $line.hide();       
                              ITask.getTaskCount();
                              ITask.getTaskList();
                        }        
                    }                    
                    $.modal.close();
                });
            });
            
            $(".star, .star-yellow").live("click", function(){
                var star = $(this);
                var aid = star.parent().data("AID");
                var starFlag = 1;
                if($(this).attr("class")=="star-yellow"){
                    starFlag = 0;
                }
                
                ITask.request("setTaskStar", {"aid":aid,"star":starFlag}, function(data,stat){
                    if(stat >= 0)
                    {
                        if(starFlag) {
                            star.attr("class", "star-yellow");
//                            ITask.refreshNumber("star", 1);
                            ITask.getTaskCount();
                        }else {
                            star.attr("class", "star"); 
//                            ITask.refreshNumber("star", -1);
                            ITask.getTaskCount();
                            //如果是星标列表视图则去除
                            if($("#content-left ul li[val='star']").hasClass("selected"))
                            {
//                                star.parent().remove();
								ITask.getTaskList();
                                if($("#task-list li").length == 0)
                                {
                                    $("#task-title").hide();
                                    $("#no-task-msg").show();

                                    
                                }								
                            }
                        }
                    }
                    $.modal.close();                       
                }); 
            });
            
            $(".task-modify").live("click",function(){
            	ITask.popWindow("task-content");
            	ITask.taskDecompose.init($('#task-decompose-box')); 
                var TASK_ID = $(this).parents('.task-item:first').data("TASK").TASK_ID;
            	ITask.editTask(TASK_ID);
            });
            
            $(".task-hangup").live("click",function(){            	       	               	
                ITask.popWindow("confirm-content");
                var CURRENT = $(this).parents('.task-item:first');
                var AID = CURRENT.data("TASK").AID;            
                var confirmMsg = "确定要挂起任务吗?";
		        $("#confirm-data").html(confirmMsg);
		        $("#confirm-submit").click(function(){
		            ITask.request("hangupTask", {"aid":AID}, function(data,stat){
		                if(stat >= 0){
		                      var $children = $('.task-item[parent_id='+AID+']');
		                      ITask.getTaskCount();
		                      ITask.getTaskList();
		                       if($("#task-list li").length == 0){
		                           $("#task-title").hide();
		                           $("#no-task-msg").show();
		                       }
		                   }
						   $.modal.close();  
		                }); 
		            });
	            });      
            
            $(".task-delete").live("click",function(){
                ITask.popWindow("confirm-content");
                var del = $(this);
                var TASK_ID = del.parents('.task-item:first').data("TASK").TASK_ID;
                var AID = del.parents('.task-item:first').data("TASK").AID;

                if($("#content-left ul li[val='recycle']").hasClass("selected"))//彻底删除
                {
                   var confirmMsg = "确定要删除任务吗?";
                   $("#confirm-data").html(confirmMsg);
                   $("#confirm-submit").click(function(){
                       ITask.request("deleteTask", {"task_id":TASK_ID}, function(data,stat){
                           if(stat >= 0)
                           {   
                              var $children = $('.task-item[parent_id='+AID+']');
							  $children.remove();
                              ITask.getTaskCount();
                              del.parents('.task-item:first').remove();
                              if($("#task-list li").length == 0)
                              {
                                  $("#task-title").hide();
                                  $("#no-task-msg").show();
                              }
                           }
                           $.modal.close();  
                  
                       }); 
                   });  
                }
                else//移到回收站
                {
                   var confirmMsg = "确定要将任务移动到回收站吗?";
                   $("#confirm-data").html(confirmMsg);
                   $("#confirm-submit").click(function(){
                       ITask.request("recycleTask", {"task_id":TASK_ID}, function(data,stat){
                           if(stat >= 0)
                           {
//                             ITask.refreshNumber("recycle", 1);
//                             ITask.refreshNumber("all", -1);
//                             ITask.refreshNumber("create", -1);
//                             ITask.refreshNumber("perf", -1);
                              ITask.getTaskCount();
                              del.parents('.task-item:first').remove();
                              var $children = $('.task-item[parent_id='+AID+']');
							  $children.remove();
                              if($("#task-list li").length == 0)
                              {
                                  $("#task-title").hide();
                                  $("#no-task-msg").show();

                              }
                           }
                           $.modal.close();  
                  
                       }); 
                   });  
                }      
            }); 
            $(".task-prcs").live("click",function(){
                ITask.popWindow("prcs-content");
                var del = $(this);
                var PROGRESS = del.parents('.task-item:first').data("TASK").PROGRESS;		                
                var AID = del.parents('.task-item:first').data("TASK").AID;				
			    var form =  $("form[name='form_prcs_edit']");
                
                form.data('task-active-line', del.parents('.task-item:first'));
			    $("#TASK_PRCS",form).val(PROGRESS);
			    $("input[name='AID']",form).val(AID);  
            });
						
			//yc
			$(".tasks-annex").live("click",function(){
				ITask.popWindow("tasks-content");
				//console.log($(".tasks-content").text());
				//$(".tasks-content").empty();
				var TASK_ID = $(this).parents('.task-item:first').data("TASK").TASK_ID;
				ITask.editTasks(TASK_ID);	
            });
			            
            $(".task-rerun").live("click",function(){
             	var CURRENT = $(this).parents('.task-item:first');
             	var PID = CURRENT.data("TASK").PARENT_ID;
             	var confirmMsg = "确定要恢复执行任务吗?";
                ITask.request("getMainStatus",{"PARENT_ID":PID},function(data){
                	try{
                		if(data.data[0].DELFLAG == '1'){
	                		alert("该任务的主任务已被删除不能恢复执行！");
	                		return false;    
	                	}
                	}catch(e){}               	
		                ITask.popWindow("confirm-content");           	
		                var TASK_ID = CURRENT.data("TASK").TASK_ID;
		                var AID = CURRENT.data("TASK").AID;
		            	$("#confirm-data").html(confirmMsg);
		            	$("#confirm-submit").click(function(){
		                       ITask.request("rerunTask", {"task_id":TASK_ID,"aid":AID}, function(data,stat){
		                           if(stat >= 0)
		                           {
		//								ITask.refreshNumber("recycle", -1);
		//								ITask.refreshNumber("perf", 1);
		//								ITask.refreshNumber("all", 1);
		                              ITask.getTaskCount();
		                              ITask.getTaskList();
		                              if($("#task-list li").length == 0)
		                              {
		                                  $("#task-title").hide();
		                                  $("#no-task-msg").show();
		                                 // $(".msg-content").html("没有完成的协同任务！");
		                              }
		                           }
		                           $.modal.close();  
		                  
		                       }); 
		                });	
		        }); 	          
            }); 
            
            $(".task-goon").live("click",function(){
                var confirmMsg = "确定要恢复执行任务吗?";  
            	var CURRENT = $(this).parents('.task-item:first');
                var AID = CURRENT.data("TASK").AID;
                var PID = CURRENT.data("TASK").PARENT_ID;
                ITask.request("getMainStatus",{"PARENT_ID":PID},function(data){
                	try{
                		if(data.data[0].OPFLAG == 'H'){
	                		alert("该任务的主任务已被挂起不能恢复执行！");
	                		return false;    
	                	}
                	}catch(e){}               	     	
                ITask.popWindow("confirm-content");
            	$("#confirm-data").html(confirmMsg);
            	$("#confirm-submit").click(function(){
                       ITask.request("goonTask", {"aid":AID}, function(data,stat){
                           if(stat >= 0)
                           {
                              ITask.getTaskCount();
                              ITask.getTaskList();
                              if($("#task-list li").length == 0)
                              {
                                  $("#task-title").hide();
                                  $("#no-task-msg").show();
                              }
                           }
                           $.modal.close();  
                  
                       }); 
                   });	          
            });
           });  
            
        },
        
        //Get count of tasks by state.
        getTaskCount : function() {
            this.request("getTaskCount", {}, function(data){
                $("#nav li").each(function(){
                    var cnt = data[$(this).attr("val")];
                    if(cnt >0)
                    {
                        $(".cnt",this).html(cnt).show();
                    }
                    else
                    {
                        $(".cnt",this).hide();
                    }
                });      
                $("#category li").each(function(){
                    var cnt = data[$(this).attr("val")];
                    if(cnt >0)
                    {
                        $(".cnt",this).html(cnt).show();
                    }
                    else
                    {
                        $(".cnt",this).hide();
                    }
                });
                $("#others li").each(function(){
                    var cnt = data[$(this).attr("val")];
                    if(cnt >0)
                    {
                        $(".cnt",this).html(cnt).show();
                    }
                    else
                    {
                        $(".cnt",this).hide();
                    }
                });             
            });
        },
        getCategoryList : function() {        	
            $("#category").html("");
            this.request("getCategoryList", {}, function(data){
                if(data.total > 0)
                {
                    for(var i in data.data)
                    {
                        var category = data.data[i];
                        ITask.createCategory(category);
                    }
			        ITask.createCateRemove();
                }
            });           
        },
        search : function() {
			var para = {"TASK_TITLE": $(".search-input").val(),"fix":$("#content-left li.selected").attr("val")};
			ITask.request("searchTask", para, function(data){ 
				ITask.createTaskList(data);
				$(".msg-content").html("查询结果为空!");
				ITask.pageBar.init($('#pageArea'),{
					url:"searchTask",
					curPage:data.data.page_cur,
					totalPage:data.data.page_total,
					dataExtend: function(p){
						p = p || {};
						return $.extend({}, p, para);	
					},
					callback: function(data, stat){
            			ITask.createTaskList(data);
					}
				}
				);
				$.modal.close();
			});
        },
        searchAdv : function() {
            $("#search-content").modal({
		        overlayId: 'popwindow-overlay',
				containerId: 'popwindow-container',
				opacity: 65,
				position: [10,],
				overlayClose: true,
				onOpen: function (d) {
                    container = d.container[0];
			        d.overlay.fadeIn('normal', function () {
				        $("#search-content", container).show();
				        var title = $(".popwindow-title", container);
				        title.show();
				        d.container.slideDown('normal');
			        });
			        
			        //高级搜索-任务成员
					$("#TASKER_NAME").autocomplete({
		 		        minLength:1,  
		 		        width:100,
		 		        source:ITask.request_url["getUser"],
				        select:function(event,ui){
				            event.preventDefault();
				            var tasker = $("#TASKER").val();
				            if(tasker.indexOf(","+ui.item.id+",")>0 || ui.item.id.indexOf(ui.item.id+",")==0)
				            {
				                alert("已经添加该用户！");
				                return;
				            }
				            $("#TASKER").val(tasker+ui.item.id+",");
				            $("#TASKER_NAME").before("<div class='item' uid='"+ui.item.id+"'>"+ui.item.value+";</div>").val("");
				        }
		 	        });
		        },
		        onClose: function (d) {
		        	d.container.animate(
		        		{top:"-" + (d.container.height() + 20)},
		        		500,
		        		function () {
		        			$.modal.close(); 
		        		}
		        	);
		        }
	        }); 
        },
        
        //Display a message after sth happen, e.g create or modify or delte a task and so on.
        showMessage : function(msg){
            $("#status-msg").html(msg)
            var left = $("#header").width()/2 - $("#status-msg").outerWidth()/2;
            $("#status-msg").css("left",left).fadeIn("slow");
            window.setTimeout(function(){$("#status-msg").fadeOut(1000)},2500);
            //window.setTimeout(function(){$("#status-msg").remove()},4000);
        },
        
        //Pop up a model dialog for interaction, e.g fill form, add category and so on.
        popWindow : function(div){
            $("#"+div).modal({
					overlayId: 'popwindow-overlay',
					containerId: 'popwindow-container',
					opacity: 65
	        });
	        $(window).triggerHandler("resize");
        },
        initCategory : function(){
            
        },
        
        //Draw sidebar icons with raphael.
        /*
        drawIcon : function(){
            $("#content-left ul li i").each(function(){
                var y = $(this).offset().top;
                var x = $(this).offset().left;
                var r = Raphael(x + 5, y + 2, 40, 40);
                var className = $(this).attr("class");
                if(ITask.icon_path[className]!="")
                {
                    var obj = r.path(ITask.icon_path[className]).attr({fill: "#444", stroke: "none"});
                    obj.transform("s0.7");
                    ITask.icon_path_obj[className] = obj;
                }
            });
        },
        */
        //Drag task to custom category with visual feedback.
        initTaskDragDrop : function() {
            var dragOpenHand = "url('style/images/openhand.cur'),move";
            var dragCloseHand = "url('style/images/closehand.cur'),move";
            $(".task-item").draggable({
                appendTo: 'body',
                zIndex: 65535,
                handle: $(".drag"),
			    cursor: dragOpenHand,
			    helper: function( event ) {
				    return $( "<div class='drag-helper'>"+td_lang.general.itask.msg_1+"</div>" );
			    },
			    start: function(event, ui) {
			        $(this).addClass("drag-highlight");
			        $("li[key=category][val=key_0]").show();
			    },
			    stop: function(event, ui) {
			        $("li[key=category][val=key_0]").hide();
			        $(this).removeClass("drag-highlight");
			    }
		    }); 
		    $("#category li").droppable({
			    accept: ".task-item",
			    activeClass: "drop-active",
			    hoverClass: "drop-hover",
			    drop: function( event, ui ) {
						var para = {"AID": $(ui.draggable).data().AID,"CATAGORY_ID":$(this).attr("val")};
						ITask.request("sortTask", para, function(data){						
				    		ITask.getTaskList();
				    		ITask.getTaskCount();
						});
						 $.modal.close();
			    }
		    });   
        },
        request : function(action, data, callback){
            if(this.request_url[action] == "")
            {
                this.showMessage(td_lang.general.itask.msg_2);
                return;
            }
            this.request_url[action];
            $.ajax({
                type: "POST",
                url: this.request_url[action],
                data: data,
                cache: false,
                success: function(ret){
                    callback && callback(ret.retData, ret.retStat);

                    if(ret.retMsg != "")
                    {
                        ITask.showMessage(ret.retMsg);
                    }
                },
                error: function(data){
                	//alert(arguments[0].responseText);
                }
            });
        },
        createCategory : function(category) {
            if(typeof category != "object")
                return;
                
            var li = $('<li key="category" val=""><a class="li-item"><i class="i-category"></i><span class="cat-title"></span><span class="number"></span><span class="cnt"></span></a><i class="i-edit" title="编辑分类"></i></li>');
            li.attr("val", "key_"+category.AID);
            li.data("CATEGORY", category);
            $(".cat-title",li).html(category.CAT_NAME).attr("title",category.CAT_DESC);
            if(category.COUNT>0){           	
	            $(".cnt",li).html(category.COUNT);
            }
            else{
            	$("span.cnt",li).hide();
            }
            $("#category").prepend(li);
            var el = li.find(".cat-title");
            if(el.html().replace(/[^\x00-\xff]/g,"**").length > 7){
          		el.html(el.html().substr(0,5) + "...");
            }
        },
        createCateRemove : function() {                
            var li = $('<li key="category" val="key_0" class="CateRemove" style="display:none"><span>从分类移出</span></li>');
            $("#category").append(li);
        },
		createTask : function(task, top) {
            var OperationConfig = {
                hangup: {
                    label: '挂起',
                    name: 'hangup'
                },
                prcs: {
                    label: '进度',
                    name: 'prcs'
                },
                modify: {
                    label: '修改',
                    name: 'modify'
                },
                deletes: {
                    label: '删除',
                    name: 'delete'
                },
                goon: {
                    label: '执行',
                    name: 'goon'
                },
		        annex: {
                    label: '附件',
                    name: 'annex'
                },
                rerun: {
                    label: '恢复',
                    name: 'rerun'
                }
            },
            TmplItem = '<li> <a class="task-{name}" href="javascript:void(0);">{label}</a></li>',
	        TmplItem_perf = '<li> <a class="tasks-{name}" href="javascript:void(0);">{label}</a></li>',
            TmplMore = '<li id="task-item-dropdown-{id}" class="task-operation-item"> <a href="#task-item-dropdown-{id}" class="dropdown-toggle" data-toggle="dropdown">更多 <b class="caret"></b></a><ul class="dropdown-menu"></ul></li>';
                 
            task.END_DATE = task.END_DATE == "0000-00-00" ? "" : task.END_DATE;       
            $("#no-task-msg").hide();
            var li = $('<li class="task-item"><div class="drag"></div><div class="fold"></div><div class="star"></div><div class="creator"></div><div class="operator"></div><div class="title"><a href="javascript:;"></a></div><div class="prcs"><b></b></div><div class="date"></div><div class="operation"></div></li>');
            var $opration = $('<ul></ul>');      
            li.data("AID",task.AID).data("TASK",task).attr("PARENT_ID", task.PARENT_ID);  

			if(task.val == "create"){	             
            	$opration.append(TmplItem.format(OperationConfig.modify) + TmplItem.format(OperationConfig.deletes));
	            $opration.append(TmplItem.format(OperationConfig.hangup));
            }
            else if(task.val == "perf"){//yc
					$opration.append(TmplItem_perf.format(OperationConfig.annex));
	            	$opration.append(TmplItem.format(OperationConfig.hangup));	            	
            }
            else if(task.val == "star"){
            	if(task.OPRATOR_FLAG==1){            		
	                $opration.append(TmplItem.format(OperationConfig.hangup));
            	}
            	if(task.PARENT_ID == 0){
                    $opration.append(TmplItem.format(OperationConfig.modify));
            	}
            }
            else if(task.val == "done"){            	
            	 $opration.append('<li>-</li>');
            }
            else if(task.val == "halt"){
            	//子任务单独挂起时显示恢复操作，子任务连同主任务一起挂起时不显示恢复
            	if(task.OPRATOR_FLAG==1 && task.IF_GOON == 1){
            	 	$opration.append(TmplItem.format(OperationConfig.goon));
            	}
            	if(task.PARENT_ID == 0 && task.CREATOR_NAME == "我"){
					$opration.append(TmplItem.format(OperationConfig.goon));            	
            	}
            }
            else if(task.val == "recycle"){
            	if(task.DEL_FLAG==1 && task.IF_RERUN == 1){
            	 	$opration.append(TmplItem.format(OperationConfig.rerun));
            	}
            	if(task.PARENT_ID == 0 && task.CREATOR_NAME == "我"){
					$opration.append(TmplItem.format(OperationConfig.rerun));    
					$opration.append(TmplItem.format(OperationConfig.deletes));          	
            	}            	 
            }
            else if(task.val == "category"){
            	if(task.OP_FLAG=="H"){
            		if(task.OPRATOR_FLAG==1 && task.IF_GOON == 1){
            		 	$opration.append(TmplItem.format(OperationConfig.goon));
            		}
            		if(task.PARENT_ID == 0 && task.CREATOR_NAME == "我"){
						$opration.append(TmplItem.format(OperationConfig.goon));            	
            		}           
	        	}
	        	else{
	        		if(task.PROGRESS=="100"){
            			$opration.append('<li>-</li>');          			
	        		}
	        		else{
	        			if(task.DEL_FLAG==1){	        				
			            	if(task.DEL_FLAG==1 && task.IF_RERUN == 1){
			            	 	$opration.append(TmplItem.format(OperationConfig.rerun));
			            	}
			            	if(task.PARENT_ID == 0 && task.CREATOR_NAME == "我"){
								$opration.append(TmplItem.format(OperationConfig.rerun));    
								$opration.append(TmplItem.format(OperationConfig.deletes));          	
			            	}  
	        			}
	        			else{
	        				$opration.append(TmplItem.format(OperationConfig.hangup));
	        			
            				if(task.PARENT_ID == 0){
            		   			$opration.append(TmplItem.format(OperationConfig.modify));
            				}
            			}  
	        		}
	        			               	
	        	}      	
            }
            else{            	 
            	 $opration.append('<li>-</li>');
            }
            if(task.val == "halt" || task.val == "recycle" || task.val == "done" || task.val == "category"){
         		$(".t-star").hide();
         	}
            else{ 
            	$(".t-star").show();
            }
            
            
            if(task.STAR > 0 && task.val != 'halt' && task.OPRATOR_FLAG==1)
            {	
	        	$(".star",li).attr("class", "star-yellow");  
            } 
            if(task.PARENT_ID == 0){
            	if(task.TITLE.replace(/[^\x00-\xff]/g,"**").length > 30)
            		task.TITLE = task.TITLE.substr(0,30) + "...";
            	$(".title a",li).html(task.TITLE);
            }
            else{
            	if(task.CONTENT.replace(/[^\x00-\xff]/g,"**").length > 30)
            		task.CONTENT = task.CONTENT.substr(0,30) + "...";
            	$(".title a",li).html(task.CONTENT);
            }
            //other's task  
            if(task.OPRATOR_FLAG!=1)
            {
                $(".drag",li).attr("class","no-drag");
                $(".star",li).css('visibility','hidden');
            }
            else{
            	if(task.val != "recycle" && task.val != "done" && task.val != "halt" && task.OP_FLAG != "H" && task.PROGRESS != "100"  && task.DEL_FLAG != 1)
            		{
            			//$opration.html(TmplItem.format(OperationConfig.prcs))
            			$opration.append(TmplItem.format(OperationConfig.prcs));
            		}
            }
            
            $(".operation",li).append($opration);
            $(".creator",li).html(task.CREATOR_NAME);
            $(".operator",li).html(task.OPRATOR_NAME);
            $(".prcs>b",li).html(task.PROGRESS+'%');
            $(".date",li).html(task.END_DATE);
            $(".fold",li).html();

            if(top){
                $("#task-list").prepend(li);
            	if(task.val == "halt" || task.val == "recycle" || task.val == "done" || task.val == "category"){
            		$(".star").hide();
            		$(".star-yellow").hide();
            	}
            }
            else{
                $("#task-list").append(li);
            	if(task.val == "halt" || task.val == "recycle" || task.val == "done" || task.val == "category") {
            		$(".star").hide();
            		$(".star-yellow").hide();
            	}
            }
                
        },
        
        createTaskCallback : function(ret){
	        var task = ret.retData;
	
	        if(ret.retMsg != "")
	        {
	            ITask.showMessage(ret.retMsg);
	        }
	        
	    	$("#task-title").show();       
	        $.modal.close();
	        if(task.METHOD=="UPDATE"){
	        }
	        else{
	            if(!task.AID)
                    return;
	        	ITask.createTask(task);
				ITask.getTaskCount();
	        }
	        if(typeof task.CATEGORY_ID != "undefined")
	        {
				ITask.getTaskCount();                              
	        }
	        ITask.getTaskList();    	
	    },
	    
        createTaskList : function(data) {
        	$("#task-list").empty();
        	var id_arr = [];
            if(data.total > 0)
            {
                for(var i in data.data)
                {
                    var task = data.data[i];
                    if(!task.AID)
                    	continue;
                    ITask.createTask(task);
                }
                ITask.initTaskDragDrop();
                $("#task-title").show();
                $("#no-task-msg").hide();
                ITask.getTaskCount();
                //$("#task-container").scroll();
            }
            else
            {
            	var current = jQuery("#others li[class=selected]").attr("val")
                $("#task-title").hide();
                $("#no-task-msg").show();
                switch (current) {
                	case "done": $(".msg-content").html("当前没有已完成的任务！");  break;              
                	case "halt": $(".msg-content").html("当前没有已挂起的任务！"); break;
                	case "recycle": $(".msg-content").html("当前没有已删除的任务！");   break;
                	default :  $(".msg-content").html("目前没有协同任务，请单击左侧按钮'发起协同'创建任务。");
                }
            }
        },
        
        getTaskList : function() {
        	var para = {"key": $("#content-left li.selected").attr("key"), "val": $("#content-left li.selected").attr("val")};
        	this.request("getTaskList", para, function(data){
            	ITask.createTaskList(data);   
					
				ITask.pageBar.init($('#pageArea'),{
					url:"getTaskList",
					curPage:data.data.page_cur,
					totalPage:data.data.page_total,
					dataExtend: function(p){
						p = p || {};
						return $.extend({}, p, para);	
					},
					callback: function(data, stat){
            			ITask.createTaskList(data);
					}
				});
                
                $('#pageArea')[data.total > 0 ? 'show' : 'hide']();
            }); 
        },
        refreshNumber : function(val, pm) {
            var li;
            if(typeof val == "Number") {
                li = $("#category li[val='" + val + "']");
            } else { 
                var li = $("#content-left ul li[val='" + val + "']");
            }
            $("span.number",li).html(pm>0? "+1":"-1").css({opacity:"100",top:"0px",fontSize:"18px"}).animate({opacity:"0",top:"-20px",fontSize:"12px"},1500);
            
            var cnt = $("span.cnt",li).html()==""? 0 : $("span.cnt",li).html();
            cnt = parseInt(cnt)+pm;
            $("span.cnt",li).html(cnt);
            if(cnt==0){
            	$("span.cnt",li).hide();
            }
            else{            	
            	$("span.cnt",li).show();
            }
        },
        editTask: function(id){
            ITask.request("editTask", { id: id }, function(data){
            	var form = $('form[name=form_task]');
            	$.each(data, function(i, v){
            		if(i == 'CONTENT'){
            			re = /<br>/g;
            			v = v.replace(re,"\n");
            		}
            	    $('[name='+i+']', form).val(v);
            	});
				$('#ATTACHMENT_div').html(data["ATTACHMENT"]);
            	ITask.taskDecompose.load(data);
            	ITask.attachPositionFix($('#ATTACHMENT_div'));            	
            });
        },//yc
	 	 editTasks: function(id){
            ITask.request("editTask", { id: id }, function(data){
            	var form = $('form[name=form_tasks]');
            	$.each(data, function(i, v){
            		if(i == 'CONTENT'){
            			re = /<br>/g;
            			v = v.replace(re,"\n");
            		}
            	    $('[name='+i+']', form).val(v);
            	});
				$('#ATTACHMENTS_div').html(data["ATTACHMENT"]);
            	ITask.taskDecompose.load(data);
            	ITask.attachPositionFix($('#ATTACHMENTS_div'));            	
            });
        },  
        pageBar: {        
        	tmpl: [
				'第<span id="pageNumber" class="pageNumber">{curPage}/{totalPage}</span>页',
				'<a href="javascript:;" data-cmd="pageFirst" class="pageFirstDisable" title="首页"></a>',
  				'<a href="javascript:;" data-cmd="pagePrevious" class="pagePreviousDisable" title="上一页"></a>',
  				'<a href="javascript:;" data-cmd="pageNext" class="pageNext" title="下一页"></a>',
  				'<a href="javascript:;" data-cmd="pageLast" class="pageLast" title="末页"></a>',
  				'转到 第 <input type="text" size="3" class="SmallInput" data-cmd="page_no" style="text-align:center;"> 页 ',
  				'<a href="javascript:;" data-cmd="pageGoto" class="pageGoto" title="转到"></a>'
  			].join(''),
  			
        	init: function(el, opts){
        		this.el = el;
        		this.opts = opts;
        		
        		if(this.inited ==true){
        			this.update();
        			return this;
        		}
        			
        		this.render();
        		this.bindEvent();
        		this.update();
        		this.inited = true;
        		return this;
        	},
        	destroy: function(){
        		
        	},
        	render: function(){
        		this.el.html(this.tmpl.format(this.opts));
        	},
        	bindEvent: function(){
        		var me = this;
                this.el.delegate('[data-cmd = pageFirst]', 'click.pagebar', function(){
                    me.first();
                });
                this.el.delegate('[data-cmd = pagePrevious]', 'click.pagebar', function(){
                    me.pre();
                });
                this.el.delegate('[data-cmd = pageNext]', 'click.pagebar', function(){
                    me.next();
                });
                this.el.delegate('[data-cmd = pageLast]', 'click.pagebar', function(){
                    me.last();
                });
                this.el.delegate('[data-cmd = pageGoto]', 'click.pagebar', function(){
                    me.pageGoto($('[data-cmd = page_no]',me.el).val());
                });
                this.el.delegate('[data-cmd = page_no]', 'keydown.pagebar', function(e){
                	if(e.keyCode == 13){
                    	me.pageGoto($('[data-cmd = page_no]',me.el).val());
                	}
                });
        	},
        	update: function(){//改按钮样式，刷新pagebar数据
        		var el = this.el,
        		opts = this.opts;
        		$('.pageNumber', el).html(opts.curPage+"/"+opts.totalPage);
        		
        		$('[data-cmd = pageFirst]',el).attr("class", opts.curPage==1 ? "pageFirstDisable":"pageFirst");
        		$('[data-cmd = pagePrevious]',el).attr("class", opts.curPage==1 ? "pagePreviousDisable":"pagePrevious");
        		
        		$('[data-cmd = pageNext]',el).attr("class", opts.curPage==opts.totalPage ? "pageNextDisable":"pageNext");
        		$('[data-cmd = pageLast]',el).attr("class", opts.curPage==opts.totalPage ? "pageLastDisable":"pageLast");

        	},
        	next: function(){
        		this.goto(this.opts.curPage+1);
        	},
        	pre: function(){
        		this.goto(this.opts.curPage-1);
        		
        	},
        	first: function(){
        		if(this.opts.curPage==1){
        			return;	
        		}
        		this.goto(1);		
        	},
        	last: function(){
        		if(this.opts.totalPage==this.opts.curPage){
        			return;	
        		}
        		this.goto(this.opts.totalPage);         		
        	},
        	goto: function(page){
        		var me = this,
        		opts = this.opts,
        		page = page || opts.curPage;
        		data = { page: page, pageSize: opts.pageSize };
        		data = opts.dataExtend ? opts.dataExtend(data) : data;
        		if(page>opts.totalPage || page<1){
        			return;
        		}
        		ITask.request(this.opts.url, data, function(data, stat){
        			me.opts.curPage = page;	
        			me.update();
        			opts.callback && opts.callback(data, stat);
        		});
        	},
        	pageGoto: function(page){
        		
        		var opts = this.opts;
        		if(page>opts.totalPage || page<1 || !/^[0-9]*$/.test(page)){
        			ITask.showMessage("请输入1至"+opts.totalPage+"的整数");
        			return;
        		}
        		this.goto(page);     
        	}
        	
        },
        
        //分解任务
        taskDecompose: {
            init: function(el){
                this.el = el;
                this.counter = 0;
                this.render();
                this.bindEvent();
                return this;
               // this.el.scroll({autoReinitialise:true});
            },
            destory: function(){
            
            },
            DefaultValue: (function(support){
                return {
                    num: 0,
                    descript: '',
                    username: '',
                    userlabel: '',
                    timefrom: '',
                    timeto: '',
                    aid: 0
                }
            })('placeholder' in document.createElement('input')),
            render: function(){
                var el = this.el;
                el.wrap("<div class='task-decompose-wrapper'></div>");
                el.parent().append("<div class='task-decompose-toolbar'><b class='task-decompose-add' title='增加子任务'></b></div>");
                el.html("<ul class='task-decompose'></ul><input type='hidden' name='task-decompose-counter' id='task-decompose-counter' value='0'/>");
                return this;
            },
            renderItem: function(){
                this.add();
                this.add();
                return this;
            },
            getTmpl: function(t){
                var TEMPLATE = {
                    item: [
                        '<li class="task-decompose-item">',
                        '    <div class="task-decompose-num">{num}</div>',
                        '    <div class="task-decompose-descript">',
                        '        <input value="{descript}" name="task-decompose-descript-{num}" class="form-input" id="task-decompose-descript-{num}" type="text" placeholder="任务描述" size=55/>',
                        '    </div>',
                        '    <div class="task-decompose-users">',
                        '        <label id="task-decompose-users-{num}" class="task-decompose-users-wrapper item-select"><b class="usericon" title="选择人员"></b>',
                        '            <input value="{userlabel}" name="task-decompose-users-label-{num}" id="task-decompose-users-label-{num}" type="text" placeholder="" title="执行人"/>',
                        '            <input value="{username}" data-user-label="{userlabel}" type="hidden" name="task-decompose-users-name-{num}" id="task-decompose-users-name-{num}">',
                        '        </label>',
                        '    </div>', 
                        '    <div class="task-decompose-datetimes">',
                        '        <div id="task-decompose-datetimes-{num}" class="task-decompose-datetimes-wrapper">',
                        '            ',
                        '            <input class="form-input" value="{timefrom}" id="task-decompose-datetimes-from-{num}" name="task-decompose-datetimes-from-{num}" type="text" size=10 onClick="WdatePicker()" title="开始日期"/>',
                        '            到',
                        '            <input class="form-input" value="{timeto}" id="task-decompose-datetimes-to-{num}" name="task-decompose-datetimes-to-{num}" type="text" size=10 onClick="WdatePicker()" title="截止日期"/>',
                        '        </div>',
                        '    </div>',
                        '    <a href="###" class="task-decompose-close">x</a>',
                        '	 <input type="hidden" id="task-decompose-aid-{num}" name="task-decompose-aid-{num}" value="{aid}"/>',
                        '</li>'
                    ].join('')
                };
                                
                return TEMPLATE[t];
            
            },
            format: function(result, args){
                if (arguments.length > 1) {    
                    if (arguments.length == 2 && typeof (args) == "object") {
                        for (var key in args) {
                            if(args[key]!=undefined){
                                var reg = new RegExp("({" + key + "})", "g");
                                result = result.replace(reg, args[key]);
                            }
                        }
                    }
                }
                return result;
            },
            bindEvent: function(){
                var me = this;
                this.el.delegate('.task-decompose-close', 'click', function(){
                    me.remove($(this).parent('li').index());
                });
                this.el.parent().delegate('.task-decompose-toolbar .task-decompose-add', 'click', function(){
                    me.add();
                });
                this.el.delegate('b.usericon', 'click', function(){
                    var id = $(this).siblings('input:hidden').attr("name");
                    var name = $(this).siblings('input:text').attr("name");
                    me.singleUserSelector($(this).parent('.userPicker').data('userPicker'), '', id, name, 0, 'form_task',1);
                });
                this.el.delegate('#task-decompose-box','scroll',function(){
                });
                return this;
            },
            singleUserSelector: function(userpicker, MODULE_ID,TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME,USE_UID){
            
                window.org_select_callbacks = window.org_select_callbacks || {};
                
                window.org_select_callbacks.add = function(item_id, item_name){
                    if(!item_id || !item_name)
                        return;
                    userpicker.singlePick(item_id, item_name);                    
                };
                window.org_select_callbacks.remove = function(){
                    userpicker.clearItem();                    
                };                
                window.org_select_callbacks.clear = function(){
                    userpicker.clearItem();                    
                };
                
                SelectUserSingle('',MODULE_ID,TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME,USE_UID);
            
            },
            validate: function(){
            
            
            },
            add: function(params){
                var format = this.format,
                defaults = this.DefaultValue,
                sItem = this.getTmpl('item');
               
                params = params || {};
                params.num = ++this.counter;
                $('.task-decompose', this.el).append(format(sItem, $.extend({}, defaults, params)));
                if(!($.browser.msie && $.browser.version == '6.0')&&!($.browser.msie && $.browser.version == '7.0')){
               	    $('[id^=task-decompose-][id$=' + params.num + '][placeholder]', this.el).placeholder({labelMode:true});
            	}
            	
                $('#task-decompose-users-'+this.counter).userPicker({
                    singleMode: true
                });
                
                this.updateCounter();
                return this;
            },
            remove: function(i){
                $('li:eq(' + i +')', this.el).remove();
                this.fixNum(i);
                this.counter--;
                this.updateCounter();
                return this;
            },
            updateCounter: function(){
                $('#task-decompose-counter').val(this.counter);
                return this;
            },
            load: function(data){
                if(!data['task-decompose-counter']){
                    return ;
                }
                for(var i = 1, l = parseInt(data['task-decompose-counter']); i <= l; i++){
                    this.add({
                        num: i,
                        descript: data['task-decompose-descript-' + i],
                        username:  data['task-decompose-users-name-' + i],
                        userlabel:  data['task-decompose-users-label-' + i],
                        timefrom:  data['task-decompose-datetimes-from-' + i],
                        timeto:  data['task-decompose-datetimes-to-' + i],
                        aid:	data['task-decompose-aid-'+i]
                    });
                }
            },
            fixNum: function(j){
                if(j+1 == this.counter){
                    return this;
                }
                var counter = this.counter,
                context = this.el;
                for(var i = j + 1 || 1; i <= counter; i++){           
                    $('[id^=task-decompose-][id$=' + i + ']', context).each(function(){
                        var n = i;
                        if(this.name){
                            this.name = this.name.replace(new RegExp('-' + n + '$'), '-' + (n - 1));
                        }
                        this.id = this.id.replace(new RegExp('-' + n + '$'), '-' + (n - 1));     
                     
                    });                    
                }
                
                $('.task-decompose-num', context).each(function(n){
                    this.innerHTML = n+1;
                });
                return this;
            }
        }       
    };   
	window.ITask = ITask;
    $.fn.extend({
        scroll : function(){
            $(this).jScrollPane({"autoReinitialise": true });
            /*
            var bars = '.jspHorizontalBar, .jspVerticalBar';
            $(this).bind('jsp-initialised', function (event, isScrollable) {      
				    $(this).find(bars).hide();			
			    }).jScrollPane({"autoReinitialise":true}).hover(			
				    function () {
				    	$(this).find(bars).stop().fadeTo('fast', 0.9);
				    },
				    function () {
				    	$(this).find(bars).stop().fadeTo('fast', 0);
				    }
			    );
			*/
        },
        userPicker: (function(){
            var userPicker = function(opts){
                var c = $.extend(true, {}, $.fn.userPicker.defaults, opts);
                this.each(function(){
                    var self = $(this);
                    self.addClass('userPicker');

                    $(c.userlabel_selector, self)
                        .autocomplete(c)
                        .bind('keydown.userPicker', function(e){
                            var $target = $(e.target),
                            $context = $target.parent('.userPicker:first'),
                            userPicker = $context.data('userPicker'),
                            $item = $('.item', $context),
                            $tasker = $(c.username_selector, $context);
                            
                            if(c.singleMode && e.which != 13 && e.which != 9){
                                $item.remove();
                                $tasker.attr('data-user-label', '').val('');                        
                            }
                        })
                        .bind('blur', function(e){
                            this.value = '';
                        });

                    self.delegate(".item", "hover.userPicker", function(event) {
                    
                        $(this)[event.type == 'mouseenter' ? 'addClass' : 'removeClass']("select");
                        
                        $(this).siblings(c.userlabel_selector).focus();
                        
                    }).live('keydown.userPicker', function (e) {
                    
                        var $tasker = $(c.username_selector, this),
                        tasker = $tasker.val(),
                        $selected = $(".select", this),
                        selectedName = $selected.text().replace(/[;]$/,''),
                        uid = $selected.attr("uid"),
                        uname = $selected.attr('data-user-label');
                        
                        if($selected.size() == 1){
                            switch (e.keyCode){
                                case 8:
                                case 46:
                                    //删除
                                    if(tasker.indexOf(uid+",") == 0){
                                        $tasker.val(tasker.replace(uid + ",", "")).attr('data-user-label', uname.replace(selectedName + ',', ''));
                                    }else if(tasker.indexOf(","+uid+",")>0){
                                        $tasker.val(tasker.replace("," + uid + ",", ",")).attr('data-user-label', uname.replace(',' + selectedName + ',', ','));
                                    }
                                    $selected.remove();
                                    
                                    if($tasker.val() == ''){
                                        var p = $tasker.attr('_placeholder');
                                        $tasker.attr({ placeholder:p, _placeholder:'' });
                                    }else{
                                        var p = $tasker.attr('placeholder');
                                        $tasker.attr({ placeholder:'', _placeholder:p });
                                    }                            
                                    break;
                                default:
                                    if(c.singleMode){
                                        $selected.remove();
                                        $tasker.attr('data-user-label', '').val('');
                                    }
                                    break;
                            }
                        }
                    });
                    var t = (new Date).getTime();
                    self.data('userPicker', { 
                        el: self,
                        options: c,
                        singlePick: singlePick,
                        refreshItem: refreshItem,
                        clearItem: clearItem,
                        t: t
                    });
                    self.data('userPicker').refreshItem();
                });
                
                function clearItem(){
                    var $username = $(c.username_selector, this.el),
                    $userlabel = $(c.userlabel_selector, this.el),
                    labels = $username.attr('data-user-label').split(','),
                    names = $username.val().split(',');
                    
                    $('.item', this.el).remove();
                    $userlabel.val('');
                    $username.val('').attr('data-user-label', '');
                }
                
                function refreshItem(){
                    var $username = $(c.username_selector, this.el),
                    $userlabel = $(c.userlabel_selector, this.el),
                    labels = $username.attr('data-user-label').split(','),
                    names = $username.val().split(',');
                    
                    $('.item', this.el).remove();
                    $userlabel.val('');
                    
                    $.each(names, function(i,n){
                        if(n == '' || n == 'undefined'){
                            return;
                        }
                        $userlabel.before("<div class='item' uid='" + n + "'>" + labels[i] || '' + "</div>");
                    });
                }
                
                function singlePick(id, name){
                    var $context = this.el;
                    $(c.username_selector, $context).val(id + ",").attr('data-user-label', name + ',');
                    $('.item', $context).remove();
                    var $label = $(c.userlabel_selector, $context)
                        .before("<div class='item' uid='" + id + "'>" + name + "</div>")
                        .val("")
                        .removeClass('userPick-error');
                }
                
                return this;
            };
            userPicker.defaults = {
                minLength: 1,  
                width: 'auto',
                source: ITask.request_url.getUser,
                singleMode: false,
                select: function(event, ui){
                    var $target = $(event.target),
                    $context = $target.parents('.userPicker:first'),
                    userPicker = $context.data('userPicker'),
                    c = userPicker.options;
                    event.preventDefault();
                    
                    if(c.singleMode){
                        if('id' in ui.item){
                            $(c.username_selector, $context).val(ui.item.id + ",");
                            $('.item', $context).remove();
                            var $label = $(c.userlabel_selector, $context)
                                .before("<div class='item' uid='" + ui.item.id + "'>" + ui.item.value + "</div>")
                                .val("")
                                .removeClass('userPick-error');
                                
                            
                        }else{
                            $(c.userlabel_selector, $context).addClass('userPick-error');                        
                        }
                    }else{                    
                        var tasker = $(c.username_selector, $context).val(),
                        label = $(c.username_selector, $context).attr('data-user-label');
                        
                        if(tasker.indexOf("," + ui.item.id + ",") > 0 || tasker.indexOf(ui.item.id + ",")==0){
                            alert("已经添加该用户！");
                            return;
                        }
                        
                        $(c.username_selector, $context).val(tasker + ui.item.id + ",").attr('data-user-label', label + ui.item.value + ',');
                        $(c.userlabel_selector, $context).before("<div class='item' uid='" + ui.item.id + "'>" + ui.item.value + ";</div>").val("");
                    }
                },
                username_selector: 'input:hidden',
                userlabel_selector: 'input:visible'
            };
            
            return userPicker;
        })()
    });
    
    $(function(){       
        ITask.init();
        $.getScript('js/jquery.dropdown.js', function(){
            $('.dropdown-toggle').dropdown();
        });
        if(!($.browser.msie && ($.browser.version == '6.0' || $.browser.version == '7.0'))){
        	$.getScript('js/jquery.placeholder.js', function(){
            	$('[placeholder]').placeholder({labelMode:true});
        	});
        }
        
        
        
        
        
        
        
        
        
        try{
            //精灵
            if(top.location.href.match(/ispirit/)){
                window.external.OA_SMS(window.screen.availWidth-100, window.screen.availHeight-120, "SET_SIZE");
            }
            //消息提醒            
            if(top.location.href.match(/itask/)){     
                try{                    //精灵消息提醒
                    window.external.OA_SMS(window.screen.availWidth-100, window.screen.availHeight-120, "SET_SIZE");
                }catch(e){              //浏览器弹窗消息提醒
                    window.moveTo(0,0);
                    window.resizeTo(window.screen.availWidth-100,window.screen.availHeight-100);
                    window.focus();
                    $(window).resize();
                }
            }
            if(!top.ostheme || top.ostheme < 10){       //老主题                
                $(window).resize();
            }else{      //新主题     
                $(window).resize();                
            }            
        }catch(e){            
		}
    });
})(jQuery);

jQuery(document).ready(function(){
	if(s_action_from == "pagefrom"){
		jQuery("#task-create").click();		
	}
	
});