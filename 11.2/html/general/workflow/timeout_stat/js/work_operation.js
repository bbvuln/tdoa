jQuery(document).ready(function(){
	jQuery.noConflict();
	jQuery('#myTab a').click(function (e) {
		if(jQuery(this).parent().attr("class") == "active"){
			return false;	
		}
		var currentShowDivId = jQuery("div[class^='tab-pane'][class$='tab-pane active']").attr("id");
		var hrefStr = jQuery(this).attr('href');
		var pageUrl = hrefStr.substring(1);
		jQuery("#workflow-data-list").attr("src", pageUrl+".php?pageType="+pageUrl);
	})
});

function loadModal()
{
	jQuery('#myModal').modal({
		keyboard: true,
		backdrop:"static"
	});
    jQuery('#myModal').css('top','15px');
    jQuery('.modal-body').css('max-height', jQuery(window).height()-150);
    jQuery('.modal-footer').css('padding', '8px 15px 8px');
}

function getSelectRows()
{
	return jQuery(window.frames["workflow-data-list"].document).find("#gridTable").jqGrid('getGridParam','selarrrow');	
}

function checkSelectRows()
{
	var selectRows = getSelectRows();
	if(selectRows == ""){
		alert(td_lang.general.workflow.msg_56);
		return false;
	}
	return true
}

function getRunData(selectRows){
	var runData = new Array();
	for(var i = 0; i < selectRows.length; i++){
		var dataTr = jQuery(window.frames["workflow-data-list"].document).find("#gridTable").find("tr[role='row'][id='"+selectRows[i]+"']");
		run_id = dataTr.find("td[aria-describedby='gridTable_run_id']").html();
		run_name = dataTr.find("td[aria-describedby='gridTable_run_name']").html().replace(/="javascript(.*)"/ig, '=\"javascript:;\"');
		prcs_name = dataTr.find("td[aria-describedby='gridTable_prcs_name']").html().replace(/="javascript(.*)"/ig, '=\"javascript:;\"');
		var selectData = {'run_id':run_id, 'run_name':run_name, 'prcs_name':prcs_name};
		runData.push(selectData);
	}
	return runData;
}
function delete_work_run(run_id){
	if(!confirm(td_lang.general.workflow.msg_57)){
		return false;
	}
	jQuery(window.frames["workflow-data-list"].document).find("#gridTable").jqGrid('setSelection',run_id);
	jQuery("tr[run_id='"+run_id+"']").remove();
}
function check_form(){
	var checkType = jQuery('.modal-body').find("tbody:first").attr('id').replace("Data", "");
	switch(checkType){
		case "intrust":
			try{
				jQuery("input[type='text'][name^='intrust_run_']").each(function(){
					if(jQuery(this).val() == ""){
						var run_id = jQuery(this).parent().parent().attr("run_id");
						throw sprintf(td_lang.general.workflow.msg_58, run_id, td_lang.general.workflow.msg_59);
						return false;
					}
				});		
			}catch(e){
				alert(e);
				return false;
			}
			alert("todosubmit@intrust");
			break;
		case "pending":
			alert("todosubmit@pending");
			break;
		case "comment":
			try{
				jQuery("textarea[name^='comment_run_']").each(function(){
					if(jQuery(this).val() == ""){
						var run_id = jQuery(this).parent().parent().parent().parent().attr("run_id");
						throw sprintf(td_lang.general.workflow.msg_58, run_id, td_lang.general.workflow.msg_59);
						return false;
					}
				});		
			}catch(e){
				alert(e);
				return false;
			}
			alert("todosubmit@comment");
			break;
		default:
			break;
	}
}

function work_run_intrust(pageName)
{	
	if(checkSelectRows()){
		loadModal();
		jQuery('.modal-body').load('data/'+pageName+'.php',function(){
			var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
			var runData = getRunData(selectRows)
			var Data = {"runData":runData}
			var template = jQuery.templates("#intrustDataTmpl");
			var htmlOutput = template.render(Data);
			jQuery("#intrustData").html(htmlOutput);
			jQuery('#quick_select_btn').click(function(){ 
				var module_id = '', 
				to_id = "quick_select_hidden", 
				to_name = "quick_select", 
				manage_flag, 
				form_name = "form1"; 
				window.org_select_callbacks = window.org_select_callbacks || {}; 
				window.org_select_callbacks.add = function(item_id, item_name){ 
					jQuery("input[type='hidden'][name^='intrust_run_hidden_']").val(item_id);
					jQuery("input[type='text'][name^='intrust_run_']").val(item_name);
				}; 
				window.org_select_callbacks.remove = function(item_id, item_name){ 
					jQuery("input[type='hidden'][name^='intrust_run_hidden_']").val('');
					jQuery("input[type='text'][name^='intrust_run_']").val('');						
				};				 
				window.org_select_callbacks.clear = function(){					 
					jQuery("input[type='hidden'][name^='intrust_run_hidden_']").val('');
					jQuery("input[type='text'][name^='intrust_run_']").val('');			  
				}; 
				SelectUserSingle('5', module_id, to_id, to_name, manage_flag, form_name); 
				return false; 
			}); 
			jQuery("button[btntype='work_run_intrust']").click(function(){
				var module_id = '', 
				to_id = jQuery(this).attr("intrust_hidden"), 
				to_name = jQuery(this).attr("intrust"), 
				manage_flag, 
				form_name = "form1"; 
				window.org_select_callbacks = window.org_select_callbacks || {}; 
				window.org_select_callbacks.add = function(item_id, item_name){}; 
				window.org_select_callbacks.remove = function(item_id, item_name){}; 
				window.org_select_callbacks.clear = function(){}; 
				SelectUserSingle('5', module_id, to_id, to_name, manage_flag, form_name); 
				return false; 
			});
		});
	}
}

function quick_select_data(){
	WdatePicker({
		el:'quick_select',
		dateFmt:'yyyy-MM-dd HH:mm:ss',
		onpicked:function(){	
			jQuery('input[name^="pending_run_"]').val(jQuery(this).val());
		},
		oncleared:function(){
			jQuery('input[name^="pending_run_"]').val('');	
		}
	});
}

function work_run_pending(pageName)
{
	if(checkSelectRows()){
		loadModal();
		jQuery('.modal-body').load('data/'+pageName+'.php',function(){
			var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
			var runData = getRunData(selectRows)
			var Data = {"runData":runData}
			var template = jQuery.templates("#pendingDataTmpl");
			var htmlOutput = template.render(Data);
			jQuery("#pendingData").html(htmlOutput);
			jQuery('.quick-date-select').click(function(){
				var padding_id = jQuery(this).attr("pending");
				jQuery("#"+padding_id).click();
			});
		});
	}
}

function work_run_comment(pageName)
{
	if(checkSelectRows()){
		loadModal();
		jQuery('.modal-body').load('data/'+pageName+'.php',function(){
			var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
			var runData = getRunData(selectRows)
			var Data = {"runData":runData}
			var template = jQuery.templates("#commentDataTmpl");
			var htmlOutput = template.render(Data);
			jQuery("#commentData").html(htmlOutput);
			jQuery("#quick_select_btn").click(function(){
				show_edit();
			});
			jQuery("#quickSubmit").click(function(){
				if(jQuery('#ContentArea').val() == ""){
					alert(td_lang.general.workflow.msg_62);
					return false
				}
				jQuery('textarea[name^="comment_run_"]').val(jQuery('#ContentArea').val());
				close_edit();
			});
			jQuery(window).resize(function(){
				var altLeft = (jQuery('.modal-body').outerWidth(true)-jQuery('#alertElement').outerWidth(true))/2+jQuery('.modal-body').offset().left;
				var altTop = (jQuery('.modal-body').outerHeight(true)-jQuery('#alertElement').outerHeight(true))/2+jQuery('.modal-body').offset().top;
				jQuery('#alertElement').css({'left':altLeft, 'top':altTop});
			});
		});
	}
}

function work_run_export(pageName)
{
	if(checkSelectRows()){
		alert("todoexport");
		return false;
		loadModal();
		jQuery('.modal-body').load('data/'+pageName+'.php',function(){
			
		});
	}
}