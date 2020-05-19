;(function(win, $){
    var tWorkflow = {
        update: function(data){
            if(data.reload){
				location.href = data.reload;
			}else{
				parent.unlockButton();
				'title' in data && this.setTitle( data.title ); 
                if(data.feedback)
                {
                    this.setFeedback( data.feedback ); 
                }
                else
                {
                    this.setFeedbackNull(); 
                } 
				data.macroSigns && this.setMacroSigns( data.macroSigns ); 
				data.fields && this.setFields( data.fields ); 
				data.signRefresh && window.LoadSignData && window.LoadSignData();
				this.clearFeedback();
			}
        },
        setTitle: function(title){
			if($('#run_name_block', parent.document).find('#Symbol').length == 0)
			{
				jQuery('#run_name_block', parent.document).text(title);
				jQuery('#run_name_block', parent.document).attr('title',title);
			}
            $('#run_name_block', parent.document).find('#Symbol,#run_name_old').attr('value', title).val(title);
        },
        setFeedback: function(feedback){
            $('#content-remark .remake-list').html(feedback);
        },
        setFeedbackNull: function(){
            $('#content-remark .remake-list').html("");
        },
        setMacroSigns: function(signs){
            $.each(signs || [], function(){
                $('[macro-id="' + this.id + '"]').html(this.value);
            });
        },
        setFields: function(data){
            fieldManager ? fieldManager.setFields(data) : location.reload();
        },
        validation: function(data){
            fieldManager ? fieldManager.validation(data.fields) : location.reload();
        },
        clearFeedback: function(){
            try{
                setHtml("CONTENT");
            }catch(e){}
        }
    };

    function turnCallback(ret){
        switch(ret.status){
            case 'success':
                tWorkflow.update(ret);
				if(typeof ret.runName != 'undefined' && ret.runName != '')
				{
					tWorkflow.setTitle(ret.runName);
				}
                if(ret.onekey_next_flag == 1){
                    var result = parent.turnSubmitOneKey();
                    parent.closeSaveDiv();
                    //parent.unlockButton();
                    if(result){
                        parent.workflowGoBackAction(ret.status);
                    }else{
                        jQuery('#onekey_next_flag').val(0);
                    }
                    return;
                }else{
                    parent.loadWorkHandleNext();
                    //parent.unlockButton();
                    parent.workflowGoBackAction(ret.status);
                }
                break;
            case 'update':
				if(typeof ret.runName != 'undefined' && ret.runName != '')
				{
					tWorkflow.setTitle(ret.runName);
				}
                tWorkflow.update(ret);
                parent.closeSaveDiv();
                //parent.unlockButton();
                break;   
            case 'cancel':
                parent.closeSaveDiv();
                //parent.unlockButton();
                break;
            case 'back':
                tWorkflow.update(ret);
                parent.closeSaveDiv();
                //parent.unlockButton();
                break;
            case 'turned':
                parent.closeSaveDiv();
                parent.workflowGoBackAction(ret.status);
                break;                
            case 'validation':
                parent.closeSaveDiv();
                //parent.unlockButton();
                tWorkflow.validation(ret);
                break;
            default:
                break;
        }
    }


    win.tWorkflow = tWorkflow;
    win.turnCallback = turnCallback;

})(window, jQuery);


function ShowBackDialog(id,vTopOffset)
{
   if(typeof arguments[1] == "undefined")
     vTopOffset = 90;
     
   var bb=(document.compatMode && document.compatMode!="BackCompat") ? document.documentElement : document.body;
   $("overlay").style.width = Math.max(parseInt(bb.scrollWidth),parseInt(bb.offsetWidth))+"px";
   $("overlay").style.height = Math.max(parseInt(bb.scrollHeight),parseInt(bb.offsetHeight))+"px";;
   $("overlay").style.display = 'block';  
   $(id).style.display = 'block';    
   $(id).style.left = ((bb.offsetWidth - $(id).offsetWidth)/2)+"px";
   if(document.body.clientHeight > (document.getElementById("sel_prcs").offsetHeight + vTopOffset)){
    $(id).style.top  = ((document.body.clientHeight -document.getElementById("sel_prcs").offsetHeight)/2 - 15)+"px";
   }else{
    $(id).style.top = "0px";
   }
   
}

//批量上传
function upload_init() {
  var settings = {
    file_upload_limit : 0,
    file_queue_limit : 0,
    custom_settings : {
      uploadArea : "fsUploadArea",
      progressTarget : "fsUploadProgress",
      startButtonId : "btnStart",
      cancelButtonId : "btnCancel"
    },
    debug: false,

    // Button Settings
    button_text : "<span class='textUpload'>批量上传</span>",
    button_text_top_padding : 1,
    button_text_left_padding : 18,
    button_placeholder_id : "spanButtonUpload",
    button_width: 70,
    button_height: 18,
    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
    button_cursor: SWFUpload.CURSOR.HAND,

    // The event handler functions are defined in handlers.js
    file_queued_handler : fileQueued,
    file_queue_error_handler : fileQueueError,
    file_dialog_complete_handler : fileDialogComplete,
    upload_start_handler : uploadStart,
    upload_progress_handler : uploadProgress,
    upload_error_handler : uploadError,
    upload_success_handler : uploadSuccess,
    //upload_complete_handler : uploadComplete,
    queue_complete_handler : queueCompleteEventHandler  // Queue plugin event
  };

  swfupload = new SWFUpload(jQuery.extend(true, {}, settings, window.upload_cfg));
}



function queueCompleteEventHandler(){
  jQuery('#btnCancel').attr('disabled', true);
}



function go_end() {
  window.location.href = '#end';
}

function new_attach()
{
    if(document.form1.NEW_TYPE.value=="")
    { 
        alert("请选择文件类型！");
        return (false);
    }
    if(document.form1.NEW_NAME.value=="")
    { 
        alert("附件名不能为空！");
        return (false);
    }
    CheckForm('S');
    return false;
}


function go_sign()
{
    return;
}


function stop_run()
{
    var msg="本流程为自由流程，可以随时结束，确认要结束该工作流程吗？";
    if(window.confirm(msg))
    {
        CheckForm("7");   //标志位5为结束流程 add by lx 20090728
    }
}

function clear_check()
{
  mouse_is_out=false;
}

function edit_run_name()
{
  CheckForm("N");
}

function select_run_name()
{
    var loc_x=(screen.availWidth-300)/2;
    var loc_y=(screen.availHeight-100)/2;
    window.open("select_run_name.php?FLOW_ID="+window.g_flow_id+"&RUN_ID="+window.g_run_id,"select_run_name","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=300,height=400,left="+loc_x+",top="+loc_y);
}

function clear_run_name()
{
    RUN_NAME.value="";
}

function disp_form(id)
{       
    var cur_tab = "tab_"+id;
    jQuery(".navTab li").each(function(){
        var tab = jQuery(this);
        if(tab.attr("id") == cur_tab)
        {
            tab.addClass("navTab_On");
        }
        else
        {
            tab.removeClass("navTab_On");
            if(tab.attr("id") > cur_tab)
                tab.removeClass("left").addClass("right");
            else
                tab.removeClass("right").addClass("left");
        }
    });
    
    var cur_body = "body"+id;
    jQuery("div[id^='body']").each(function(){
        var body = jQuery(this);
        if(body.attr("id") == cur_body)
            body.slideDown();
        else
        {
          body.hide();
        }
    });
    if(id==1)
    {
        jQuery("#body2,#body3").show();
    }
}

function AddUserShow()
{
    ClearUser('TO_ID', 'TO_NAME');
    $("add_msg").innerHTML="";
    ShowDialog("add_user");
}
function add_user()
{
  var to_id = document.form1.TO_ID.value;
  if(to_id=="")
  {
    alert("请选择经办人员！");
    return;
  }
  else
  {
      jQuery.get("../flow_view/add_user.php?FLOW_ID=<?=$FLOW_ID?>&RUN_ID=<?=$RUN_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>",{"TO_ID":to_id},function(data){
          if(data==0)
              jQuery("#add_msg").html("您没有此权限！");
          else if(data==1)
            jQuery("#add_msg").html("此用户已经为本步骤经办人！");
          else if(data==2)
          {
            jQuery("#add_msg").html("操作已成功");
            ClearUser('TO_ID', 'TO_NAME');    
          } 
      });
   }
}