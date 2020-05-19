jQuery(document).ready(function(){
	jQuery.noConflict();
    var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
    var param = MENU_FLOW_ID == '' ? '' : '&FLOW_ID=' + MENU_FLOW_ID;
	jQuery('#myTab a').click(function (e) {
		if(jQuery(this).parent().attr("class") == "active"){
			return false;	
		}
		var currentShowDivId = jQuery("div[class^='tab-pane'][class$='tab-pane active']").attr("id");
		var hrefStr = jQuery(this).attr('href');
		var pageUrl = hrefStr.substring(1);
		jQuery("#workflow-data-list").attr("src", pageUrl+".php?pageType="+pageUrl+param);
	});
    jQuery(window).resize(function(){
        jQuery('.modal-body').css('max-height', jQuery(window).height()-150);
    });
	jQuery(document).on("click", "#exp_time_dropdown_menu", function()
    {
        var inteligent_id = jQuery("#exp_btn_time").find('span').attr("data_value");
        var now = new Date();
        var year = now.getFullYear();//年
        if(inteligent_id=="exp-this-year")
        {
            var timeArray = getThisYear(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-this-quarterly")
        {
            
            var timeArray = getThisQuarterly(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-prev-quarterly")
        {
            var timeArray = getPrevQuarterly(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-prev-year")
        {
            var timeArray = getPrevYear(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-this-month")
        {
            var timeArray = getThisMonth(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-prev-month")
        {
            var timeArray = getPrevMonth(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-this-week")
        {
            var timeArray = getThisWeek(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-prev-week")
        {
            var timeArray = getPrevWeek(false);
            jQuery("#exp_begin_time").val(timeArray[0]);
            jQuery("#exp_end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="exp-all-clear")
        {
            jQuery("#exp_begin_time").val("");
            jQuery("#exp_end_time").val("");
        }
    });
});
jQuery(document).on('click', ".btn-group>.dropdown-menu>li", function ()
{
    jQuery(this).find("a").attr("href", "javascript:;");
    var buttonObj = jQuery(this).parent().parent().find("button[class*='btn']").first();
    jQuery(this).parent().parent().find("input:first").val(jQuery(this).find('span:first').attr('data_value'));
    var buttonHtml = buttonObj.html();
    var buttonText = buttonHtml.replace('<span class="caret"></span>', '');
    var selectedText = jQuery(this).find("a").html();
    buttonObj.html(buttonHtml.replace(buttonText, selectedText));
    var cloneObj = jQuery(this).clone(true);
    jQuery(cloneObj).html(cloneObj.html().replace(selectedText, buttonText));
    jQuery(this).parent().append(jQuery(cloneObj));
    jQuery(this).remove();
    if (buttonObj.attr("id") == 'pager-selbox')
    {
        var selectObj = jQuery("select[class='ui-pg-selbox']");
        if (selectObj && selectObj.length == 1)
        {
            selectObj.val(selectedText.replace(td_lang.general.workflow.msg_190, ''));
            selectObj.change();
        }
    }
});
jQuery(document).on('click', '.sms-check', function() {
    jQuery(this).toggleClass('sms-bg-static');
});
jQuery(document).on('click', '.email-check', function() {
    jQuery(this).toggleClass('email-bg-static');
});
jQuery(document).on('click', '.mobile-check', function() {
    jQuery(this).toggleClass('mobile-bg-static');
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
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
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

Array.prototype.unique = function()
{
	var n = {},r=[]; //n为hash表，r为临时数组
	for(var i = 0; i < this.length; i++) //遍历当前数组
	{
		if (!n[this[i]]) //如果hash表中没有当前项
		{
			n[this[i]] = true; //存入hash表
			r.push(this[i]); //把当前数组的当前项push到临时数组里面
		}
	}
	return r;
}
function getRunData(selectRows){
	var runData = new Array();
	var runFlowData = new Array();
	var flowDelegateTypeArr = new Array();
	for(var i = 0; i < selectRows.length; i++){
		var dataTr = jQuery(window.frames["workflow-data-list"].document).find("#gridTable").find("tr[role='row'][id='"+selectRows[i]+"']");
		var flow_id = dataTr.find("td[aria-describedby='gridTable_flow_id']").html();
		var delegate_type = dataTr.find("td[aria-describedby='gridTable_delegate_type']").html();
		flowDelegateTypeArr.push(delegate_type);
		var run_id = dataTr.find("td[aria-describedby='gridTable_run_id']").html();
		var prcs_key_id = dataTr.find("td[aria-describedby='gridTable_prcs_key_id']").html();
		var run_name = dataTr.find("td[aria-describedby='gridTable_run_name']").find('a').html();
		var prcs_name = dataTr.find("td[aria-describedby='gridTable_prcs_name']").find('a').html();
		var flow_prcs = dataTr.find("td[aria-describedby='gridTable_flow_prcs']").html();
		var prcs_id = (prcs_name.match(/\d+/g))[0];
		runFlowData.push(flow_id+"_"+prcs_id);
		var selectData = {
			'run_id':run_id, 
			'run_name':run_name, 
			'prcs_name':prcs_name, 
			'prcs_key_id':prcs_key_id,
			'flow_id':flow_id, 
			'prcs_id':prcs_id, 
			'delegate_type':delegate_type, 
			'flow_prcs':flow_prcs
		};
		runData.push(selectData);
	}
	var resultData = {"runData" : runData, "flowDelegateTypeArr":flowDelegateTypeArr, "runFlowDataArr":runFlowData};
	return resultData; //runData;
}
function delete_work_run(run_id){
	window.setSelection(run_id);
	var trObj = jQuery("tr[run_id='"+run_id+"']");
	var delegate_type = trObj.attr("delegate_type");
	if(delegate_type === '0'){
		if(jQuery("#intrustData").find("tr[class='work-run-data'][delegate_type='0']").length == 2){
			jQuery("#intrustData").find("tr[class='work-run-data'][delegate_type='0']:first").remove();
		}
	}else if(delegate_type === '2' || delegate_type === '3'){
		var child_str = trObj.find("input:first").attr("child_str");
		var child_str_arr = child_str.split("_");
		var flow_prcs_str = child_str_arr[3]+"_"+child_str_arr[4];
		if(jQuery("input[name^='intrust_run_hidden_"+flow_prcs_str+"_']").length == 1){
			jQuery("tr[flow_prcs_str='"+flow_prcs_str+"']").remove();
		}
	}
	jQuery("tr[run_id='"+run_id+"']").remove();
    
    //删除相应的触发器程序前台模板
    var plugin_obj = jQuery("tr[name='"+run_id+"']");
    if(plugin_obj.length > 0 )
    {
        plugin_obj.remove();
    }
}
//导出工作列表 确定按钮
function check_form(){
	var checkType = jQuery('.modal-body').find("tbody:first").attr('id').replace("Data", "");
	switch(checkType){
		case "intrust": //委托
			try{
                // 用户自定义js脚本执行程序
                var beforeCustomScript = jQuery("#intrustBeforeCustomScript").val();
                if(typeof beforeCustomScript !== 'undefined')
                {
                    var customScriptArr = beforeCustomScript.split(",");
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
                
				if(jQuery('#intrustData').find('.result_error').length > 0){//有错误提示则不提交
					return false;
								

				}else{	//提交
					var detaile_count = 0;
					jQuery(".ajax-result-block").html(td_lang.general.workflow.msg_118);
					jQuery(".ajax-result-block").css("display", "block");
					jQuery('#work_run_submit').attr("disabled", true);
                    var msg_check = jQuery('.sms-check').hasClass('sms-bg-static') == false ? 'checked' : '';
                    var mobile_check = jQuery('.mobile-check').hasClass('mobile-bg-static') == false ? 'checked' : '';
					var sms_content = jQuery('#SMS_CONTENT').val();
						

					jQuery("input[type='text'][name^='intrust_run_']").each(function(){
						if(jQuery(this).val() == ""){
							var run_id = jQuery(this).parent().parent().find("button:first").attr("run_id");
							throw sprintf(td_lang.general.workflow.msg_58, run_id, td_lang.general.workflow.msg_59);
							return false;
						}
						var dataTrObj = jQuery(this).parent().parent();
						var delegate_type = dataTrObj.attr('delegate_type');
						if(!delegate_type){
							return true;
						}
	

						var run_name = dataTrObj.find('td:eq(1)').html().replace(/<span(.*)<\/span>/ig, '');
						var btnObj = dataTrObj.find("button:first");
						var textObj = dataTrObj.find("input[type='hidden']:first");
						var run_id = btnObj.attr("run_id");
						var flow_id = btnObj.attr("flow_id");
						var prcs_key_id = btnObj.attr("prcs_key_id");
						var prcs_id = btnObj.attr("prcs_id");
						var flow_prcs = btnObj.attr("flow_prcs");
						var to_user = textObj.val();
                        var serializeVal = jQuery('#instrust_plugin').serialize();
                        if(serializeVal != "")
                        {
                            serializeVal = "&" + serializeVal;
                        }


						jQuery.ajax({
							type: "POST",
							url: "data/work_to_intrust.php?ispirit_export=1&page_type=instrust",
							cache: false,
							async: false,
							data: "action=submit&run_id="+run_id+"&prcs_key_id="+prcs_key_id+"&prcs_id="+prcs_id+"&flow_prcs="+flow_prcs+"&to_user="+to_user+"&mobile_check="+mobile_check+"&msg_check="+msg_check+"&sms_content="+sms_content+"&run_name="+run_name+"&flow_id="+flow_id+serializeVal,
							error: function(msg){
								alert(msg);

							},
							success: function(msg){
				
								if(msg == ""){
									var error_html = "<a href='javascript:;' data-toggle='tooltip' data-placement='top' title='' class='result_ok'></a>";
									dataTrObj.find("td:eq(3)").find('.result-block').html(error_html);
									detaile_count++;
								}else if(msg.substring(0, 5) == "ERROR"){
									var msg_arr = msg.split("|");
									var msg_info = msg_arr[1];
									var error_html = "<a href='javascript:;' data-toggle='tooltip' data-placement='top' title='"+msg_info+"' class='result_error'></a>";
									dataTrObj.find("td:eq(3)").find('.result-block').html(error_html);
									jQuery('.result_error').tooltip('show');
									detaile_count++;
								}else{
						
									jQuery('#work_run_submit').attr("disabled", false);
								}
							}
						});
					});	
					if(parseInt(detaile_count) > 0){
						jQuery(".ajax-result-block").html(td_lang.general.workflow.msg_119);
						jQuery(".ajax-result-block").css("color", "red");
					}else{
						jQuery(".ajax-result-block").html(td_lang.general.workflow.msg_120);
					}			
					setTimeout(function(){
						jQuery('#myModal').modal('hide');
						jQuery('#work_run_submit').attr("disabled", false);
						window.refreshGrid();
					}, 2000);	
                    
                    //用户自定义js脚本执行程序
                    var afterCustomScript = jQuery("#intrustAfterCustomScript").val();
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
				
			}catch(e){
				alert(e);
				return false;
			}
			break;
		case "pending"://挂起
			var prcs_key_id_str = "";
			var active_time = "";
			jQuery("input[type='text'][name^='pending_run_']").each(function(){ //验证					
				var prcs_key_id = jQuery(this).parent().parent().find("td").eq(0).attr("prcs_key_id");
				var run_id = jQuery(this).parent().parent().find("td").eq(0).text();
				prcs_key_id_str+=prcs_key_id + ",";	
				var run_id_str = "pending_run_"+ run_id;
				active_time += jQuery(this).parent().parent().find('[id='+run_id_str+']').val() + ",";		
			});
			var url="/module/approve_center/engine/pending_work.php?PRCS_KEY_ID_STR="+prcs_key_id_str+"&active_time="+active_time;
	        jQuery.get(url,{},function(data){
				window.refreshGrid();
	        	//jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
	        	jQuery('.close').click();
	        });
			break;
		case "comment"://批注
			try{
			
				var run_id_str = "";
				var content = "";

				jQuery("textarea[name^='comment_run_']").each(function(){
					//alert(jQuery(this).val());
					if(jQuery(this).val() == ""){
						
					}
					if(jQuery(this).val() == ""){
						var run_id = jQuery(this).parent().parent().parent().parent().attr("run_id");
						throw sprintf(td_lang.general.workflow.msg_284, run_id, td_lang.general.workflow.msg_61);
						return false;
					}else{
						var run_id 		= jQuery(this).parent().parent().parent().parent().attr("run_id");
						var prcs_key_id = jQuery(this).parent().parent().parent().attr("prcs_key_id");
						run_id_str += prcs_key_id+",";
						content += jQuery(this).val() + ",";
					}
				});	
				var url="/module/approve_center/engine/set_comment.php?run_id_str="+run_id_str+"&content="+content;
		        jQuery.get(url,{},function(data){
					window.refreshGrid();
		        	//jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
		        	jQuery('.close').click();
		        });	
			}catch(e){
				alert(e);
				return false;
			}
			
			break;
		case "export"://代办工作导出
			try{
				var url="data/work_to_export.php?ispirit_export=1&page_type=todo&action=export_mywork";
				jQuery("#form1").attr("action",url);
				jQuery("#form1").submit();
			}catch(e){
				return false;
			}
			break;
		case "export_instrust"://工作委托导出
			try{
				var url="data/work_to_export_instrust.php?ispirit_export=1&page_type=instrust&action=export_mywork";
				jQuery("#form1").attr("action",url);
				jQuery("#form1").submit();
			}catch(e){
				return false;
			}
			break;
		case "export_view"://工作传阅导出
			try{
				var url="data/work_to_export_view.php?ispirit_export=1&page_type=view&action=export_mywork";
				jQuery("#form1").attr("action",url);
				jQuery("#form1").submit();
			}catch(e){
				return false;
			}
			break;
		case "export_concern"://关注工作导出
			try{
				var url="data/work_to_export_concern.php?ispirit_export=1&page_type=concern&action=export_mywork";
				jQuery("#form1").attr("action",url);
				jQuery("#form1").submit();
			}catch(e){
				alert(e);
				return false;
			}			
 
			break;
		case "export_pending"://挂起工作导出
			try{
				var url="data/work_to_export_pending.php?ispirit_export=1&page_type=pending&action=export_mywork";
				jQuery("#form1").attr("action",url);
				jQuery("#form1").submit();
			}catch(e){
				alert(e);
				return false;
			}			
 
			break;
		case "export_settles"://办结工作导出
			try{
				var url="data/work_to_export_settles.php?ispirit_export=1&page_type=settles&action=export_mywork";
				jQuery("#form1").attr("action",url);
				jQuery("#form1").submit();
			}catch(e){
				alert(e);
				return false;
			}			
			break;
		case "export_data_all"://全部工作导出
			try{
				var url="data/work_to_export_data_all.php?ispirit_export=1&page_type=data_all&action=export_mywork";
				jQuery("#form1").attr("action",url);
				jQuery("#form1").submit();
			}catch(e){
				return false;
			}
			break;
		default:
			break;
	}
}

function work_run_intrust(pageName)
{	
	if(checkSelectRows()){
		loadModal();
		open_bootcss_modal("myModal","880","5");
        var selectRows = getSelectRows();
        var resultData = getRunData(selectRows);
        var runData = resultData.runData;
        var flow_ids = '';
        var flow_prcss = '';
        var run_ids = '';
        var prcs_ids = '';
        var prcs_key_ids = '';
        for(var i=0; i<runData.length; ++i)
        {
            flow_ids += runData[i].flow_id+',';
            flow_prcss += runData[i].flow_prcs+',';
            run_ids += runData[i].run_id+',';
            prcs_ids += runData[i].prcs_id+',';
            prcs_key_ids += runData[i].prcs_key_id+',';
        }
		jQuery('.modal-body').load('data/'+pageName+'.php?flow_ids='+flow_ids+'&flow_prcss='+flow_prcss+'&run_ids='+run_ids+'&prcs_ids='+prcs_ids+'&prcs_key_ids='+prcs_key_ids,function(){
			var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
			jQuery('#myModalLabel').html(td_lang.general.workflow.msg_59);
			var resultData = getRunData(selectRows);
			// alert(selectRows.length);
			var runHandleDataArr = new Array();
			var flowIdDataUniqueArr = resultData.runFlowDataArr.unique();
			var flowIdDataUniqueArrLen = flowIdDataUniqueArr.length;
			var forbidFlowData = new Array();
			var flow_id_num = 0;
			for(var i = 0; i < flowIdDataUniqueArrLen; i ++){
				var flow_prcs_str = flowIdDataUniqueArr[i];
				var flow_prcs_str_arr = flow_prcs_str.split('_');
				var delegate_type = "";
				if(flow_prcs_str_arr.length == 2){
					flow_id_num++;
					var flow_id = flow_prcs_str_arr[0];
					var prcs_id = flow_prcs_str_arr[1];
					var runIdData = new Array();
					var forbidData = new Array();
					for(var j = 0; j< resultData.runData.length; j++){
						if(resultData.runData[j].flow_id == flow_id && resultData.runData[j].prcs_id == prcs_id){
							if(resultData.runData[j].delegate_type === '0'){
								forbidData.push(resultData.runData[j]);
								delegate_type = '0';
							}else{
								runIdData.push(resultData.runData[j]);
								delegate_type = resultData.runData[j].delegate_type;
							}
						}
					}
					if(forbidData.length != 0){
						forbidFlowData.push({'forbidDataArr':forbidData});
					}else if(runIdData.length != 0){
						runHandleDataArr.push({"runIdData":runIdData,'flow_prcs_str':flow_prcs_str, 'delegate_type':delegate_type});
					}
				}
			}
			

			var Data = {"runData":runHandleDataArr, "forbidData":forbidFlowData};
			var template = jQuery.templates("#intrustDataTmpl");
			var htmlOutput = template.render(Data);
			jQuery("#intrustData").html(htmlOutput);
			jQuery('#PLUGIN_INTRUST_BEFORE_POSITION').html(jQuery.templates('#PLUGIN_INTRUST_BEFORE_POSITION_Tmpl').render({end_script:'</script>'}));
			jQuery('#PLUGIN_INTRUST_AFTER_POSITION').html(jQuery.templates('#PLUGIN_INTRUST_AFTER_POSITION_Tmpl').render({end_script:'</script>'}));
			jQuery("input[btntype='intrust_quick_select_btn']").click(function(){ //快捷操作
				var attrTrObj = jQuery(this).parent().parent();//原版获取tr
				var flow_prcs_str = attrTrObj.attr('flow_prcs_str');
				var delegate_type = attrTrObj.attr('delegate_type');
				if(delegate_type === '2'){//自由委托
					var module_id = '', 
					to_id = "quick_select_hidden_"+flow_prcs_str, 
					to_name = "quick_select_"+flow_prcs_str, 
					manage_flag = '0', 
					form_name = "form1"; 
					window.org_select_callbacks = window.org_select_callbacks || {}; 
					window.org_select_callbacks.add = function(item_id, item_name){ 
						jQuery("input[type='hidden'][child_str^='intrust_run_hidden_"+flow_prcs_str+"']").val(item_id);
						jQuery("input[type='text'][child_str^='intrust_run_"+flow_prcs_str+"']").val(item_name);
					}; 
					window.org_select_callbacks.remove = function(item_id, item_name){ 
						jQuery("input[type='hidden'][child_str^='intrust_run_hidden_"+flow_prcs_str+"']").val('');
						jQuery("input[type='text'][child_str^='intrust_run_"+flow_prcs_str+"']").val('');						
					};				 
					window.org_select_callbacks.clear = function(){					 
						jQuery("input[type='hidden'][child_str^='intrust_run_hidden_"+flow_prcs_str+"']").val('');
						jQuery("input[type='text'][child_str^='intrust_run_"+flow_prcs_str+"']").val('');			  
					}; 
					SelectUserSingle('5', module_id, to_id, to_name, manage_flag, form_name); 
					return false;
				}else if(delegate_type === '3'){ //按步骤设置的经办权限委托  btn-warning 
					var attrTrObj = jQuery(this).parent().parent();//原版获取tr

//					var attrTrObj = jQuery('.get_flow_prcs');//新版获取tr   王瑞杰
					var flow_prcs_str = attrTrObj.attr('flow_prcs_str');
					var flow_prcs_str_arr = flow_prcs_str.split('_');
					if(flow_prcs_str_arr.length == 2){
						var flow_id = flow_prcs_str_arr[0];
						var prcs_id = flow_prcs_str_arr[1];
						var attrBtnObj = jQuery('button[flow_id="'+flow_id+'"][prcs_id="'+prcs_id+'"]:first');
						var run_id = attrBtnObj.attr('run_id');
						var flow_prcs = attrBtnObj.attr('flow_prcs');
						var to_id = jQuery(this).parent().find('input[type="hidden"]:eq(0)').attr('id'); 
						var to_name = jQuery(this).parent().find('input[type="hidden"]:eq(1)').attr('id');
						window.workflow_intrust_select_callbacks = window.workflow_intrust_select_callbacks || {}; 
						window.workflow_intrust_select_callbacks.add = function(item_id, item_name){
							jQuery("input[type='hidden'][child_str^='intrust_run_hidden_"+flow_prcs_str+"']").val(item_id);
							jQuery("input[type='text'][child_str^='intrust_run_"+flow_prcs_str+"']").val(item_name);
						}
						LoadWindow(delegate_type,flow_id, run_id, prcs_id, flow_prcs, to_id, to_name);
					}
				}
			});
			jQuery("button[btntype='work_run_intrust']").click(function(){//普通操作
				var attrTrObj = jQuery(this).parent().parent();//原版获取tr 王瑞杰

//				var attrTrObj = jQuery('.get_flow_prcs');//新版获取tr   
				
				var delegate_type = attrTrObj.attr('delegate_type');
				if(delegate_type === '2'){ //自由委托  btn-primary
					var module_id = ''; 
					to_id = attrTrObj.find('input[type="hidden"]').attr('id'); 
					to_name = attrTrObj.find('input[type="text"]').attr('id');  
					manage_flag = '0'; 
					form_name = "form1"; 
					window.org_select_callbacks = window.org_select_callbacks || {}; 
					window.org_select_callbacks.add = function(item_id, item_name){}; 
					window.org_select_callbacks.remove = function(item_id, item_name){};				 
					window.org_select_callbacks.clear = function(){}; 
					SelectUserSingle('5', module_id, to_id, to_name, manage_flag, form_name); 
				}else if(delegate_type === '1'){//仅允许委托当前步骤经办人 btn-info 此类型不存在指操作，因为记录的RUN_ID不同，而经办人权限中用到了RUN_ID故单个处理
					var run_id = jQuery(this).attr('run_id');
					var flow_id = jQuery(this).attr('flow_id');
					var prcs_id = jQuery(this).attr('prcs_id');
					var flow_prcs = jQuery(this).attr('flow_prcs');
					var to_id = attrTrObj.find('input[type="hidden"]').attr('id'); 
					var to_name = attrTrObj.find('input[type="text"]').attr('id');
					LoadWindow(delegate_type,flow_id, run_id, prcs_id, flow_prcs, to_id, to_name);
				}else if(delegate_type === '3'){ //按步骤设置的经办权限委托  btn-warning
					var run_id = jQuery(this).attr('run_id');
					var flow_id = jQuery(this).attr('flow_id');
					var prcs_id = jQuery(this).attr('prcs_id');
					var flow_prcs = jQuery(this).attr('flow_prcs');
					var to_id = attrTrObj.find('input[type="hidden"]').attr('id'); 
					var to_name = attrTrObj.find('input[type="text"]').attr('id');
					LoadWindow(delegate_type,flow_id, run_id, prcs_id, flow_prcs, to_id, to_name);
				}
			});
			// var num = jQuery(".set_tag").size();
			if(selectRows.length == 1){
				if(delegate_type == '2' || delegate_type == '3'){//禁止委托流程委托提示
					var run_name = jQuery("#intrustData").find('tr:eq(1)').find('td:eq(1)').find("div:eq(0)").html().replace(/<span(.*)<\/span>/ig, '');
				}else if(delegate_type == '1'){
                    var run_name = jQuery("#intrustData").find('tr:first').find('td:eq(1)').find("div:eq(0)").html().replace(/<span(.*)<\/span>/ig, '');
                }else{
					var run_name = jQuery("#intrustData").find('tr:eq(1)').find('td:eq(1)').html().replace(/<span(.*)<\/span>/ig, '');
				} 
				var SMS_CONTENT_SIZE = td_lang.general.workflow.msg_258 + run_name;
				jQuery("#SMS_CONTENT").val(SMS_CONTENT_SIZE);
			}
		});
	}
}
function LoadWindow(FREE_OTHER,FLOW_ID, RUN_ID, PRCS_ID, FLOW_PRCS, TO_ID, TO_NAME)
{
	if(FREE_OTHER==1)
	{
		var URL="others/user_select_prcs/?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
		var w=250;
		var h=300;
	}
	else if(FREE_OTHER==3)
	{
		var URL="others/user_select_all/?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
		var w=400;
		var h=350;
	}
	var loc_y=loc_x=200;
	if(is_ie)
	{
		loc_x=document.body.scrollLeft+event.clientX-event.offsetX;
		loc_y=document.body.scrollTop+event.clientY-event.offsetY+210;
	}
	LoadDialogWindow(URL,self,loc_x, loc_y, w, h);
}

function quick_select_data(){
	WdatePicker({
		el:'pending_quick_select_btn',
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
		open_bootcss_modal("myModal","880","5");
		jQuery('.modal-body').load('data/'+pageName+'.php',function(){
			var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
			jQuery('#myModalLabel').html(td_lang.general.workflow.msg_60);
			jQuery('.quick-date-select').show();
			var resultData = getRunData(selectRows)
			var Data = {"runData":resultData.runData}
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

function work_run_refresh(pageName){
    window.refreshGrid();
}

function work_run_comment(pageName)
{
	if(checkSelectRows()){
		loadModal();
		open_bootcss_modal("myModal","880","5");
		jQuery('.modal-body').load('data/'+pageName+'.php',function(){
			var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
			jQuery('#myModalLabel').html(td_lang.general.workflow.msg_61);
			jQuery('#comment_quick_select_btn').show();
			var resultData = getRunData(selectRows)
			var Data = {"runData":resultData.runData}
			var template = jQuery.templates("#commentDataTmpl");
			var htmlOutput = template.render(Data);
			jQuery("#commentData").html(htmlOutput);
			jQuery("#comment_quick_select_btn").click(function(){
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

//弹出窗口样式接口 modal_id - 窗口id，tops - 上边距，widths - 窗口宽度 yhs - 2013.8.30
function open_bootcss_modal(modal_id,widths,tops)
{
	jQuery('#'+modal_id).modal
	({ 
		keyboard: false,
		backdrop:"static"
	}) 
	if(typeof(widths) == "undefined" || widths == "")
	{
		widths = 560;
	}
	 	if(typeof(tops) == "undefined" || tops == "")
	{
		tops = 10;
	}
 
	jQuery('#'+modal_id).css('width',widths+'px');
    jQuery('#'+modal_id).css('margin-left',-(widths/2)+'px');
    jQuery('#'+modal_id).css('top','15px');
    jQuery('.modal-body').css('max-height', jQuery(window).height()-150);
    jQuery('.modal-footer').css('padding', '8px 15px 8px');
}
function allornot(isall)
{
	if(isall==2)
	{
		jQuery('#top_id').nextAll().css("display","none");
	}
	else if(isall==1)
	{
		jQuery('#top_id').nextAll().css("display","block");
	}
}
function work_run_export()
{	
	jQuery('#myModalLabel').html(td_lang.general.workflow.msg_207);
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
	var run_name = jQuery(window.frames["workflow-data-list"].document).find("#run_name").val();
	var flow_name = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").text();
	var outoftime = jQuery(window.frames["workflow-data-list"].document).find("#select_outoftime").find("option:selected").text();
	var Priority = jQuery(window.frames["workflow-data-list"].document).find("#select_Priority").find("option:selected").text();
	var flow_id_check = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").val();
	var outoftime_check = jQuery(window.frames["workflow-data-list"].document).find("#select_outoftime").val();
	var Priority_check = jQuery(window.frames["workflow-data-list"].document).find("#work_level").val();
	var search_para = jQuery(window.frames["workflow-data-list"].document).find("#search_para").val();
	var flag_search=jQuery(window.frames["workflow-data-list"].document).find("#search_adv_div").css("display");
	var begin_dept_check = jQuery(window.frames['workflow-data-list'].document).find("#search_begin_dept").val();
	if(flag_search=='none'){
		run_name='';
		outoftime='';
		Priority='';
        var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
        if(MENU_FLOW_ID){
            flow_id_check=MENU_FLOW_ID;
        }else{
            flow_id_check='all';
            flow_name=td_lang.general.workflow.msg_215;
        }
		outoftime_check='';
		Priority_check='';
        begin_dept_check = '';
	}
	jQuery.ajax({
		type:"post",
        url:"data/work_run_export.php",
        data:{"run_name":run_name,"flow_name":flow_name,"outoftime":outoftime,"Priority":Priority,"flow_id_check":flow_id_check,"outoftime_check":outoftime_check,"Priority_check":Priority_check,"search_para":search_para,"begin_dept_check":begin_dept_check},
        success:function(html){
            jQuery('.modal-body').html("");
            jQuery('.disinlineblock').html("");
            jQuery('.modal-body').append(html);
            
			jQuery.getJSON('/general/approve_center/get_flow_list.inc.php', {root:true,action:3}, function(jsonData){
                jQuery("#export_flow_id").html("");
                jQuery.each(jsonData,function(i,t){
                	jQuery("#export_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
                });
                jQuery("#export_flow_id").combobox();
                    jQuery('#export_flow_id').find('option[value='+flow_id_check+']').attr('selected',true);
                jQuery('#flow_name').val(flow_name);
                jQuery('#flow_name').css("margin-bottom","0px");
			});
        }
    });
	open_bootcss_modal("myModal","700","5");
	jQuery('#myModal').load();
}
//工作委托
function work_run_export_instrust()
{	
	jQuery('#myModalLabel').html(td_lang.general.workflow.msg_214);
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
	var run_name = jQuery(window.frames["workflow-data-list"].document).find("#run_name").val();
	var flow_name = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").text();
	var flow_id_check = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").val();
	var search_para = jQuery(window.frames["workflow-data-list"].document).find("#search_para").val();
	var flag_search=jQuery(window.frames["workflow-data-list"].document).find("#search_adv_div").css("display");
	var begin_dept_check = jQuery(window.frames['workflow-data-list'].document).find("#search_begin_dept").val();
	if(flag_search=='none'){
		run_name='';
		intrust_man='';
		begin_dept_check = "";
        var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
        if(MENU_FLOW_ID){
            flow_id_check=MENU_FLOW_ID;
        }else{
            flow_id_check='all';
            flow_name=td_lang.general.workflow.msg_215;
        }
	}
	jQuery.ajax({
		type:"post",
        url:"data/work_run_export_instrust.php",
        data:{"run_name":run_name,"flow_name":flow_name,"flow_id_check":flow_id_check,"search_para":search_para,"begin_dept_check":begin_dept_check},
        success:function(html){
            jQuery('.modal-body').html("");
            jQuery('.disinlineblock').html("");
            jQuery('.modal-body').append(html);
            
			jQuery.getJSON('/general/approve_center/get_flow_list.inc.php', {root:true,action:3}, function(jsonData){
				jQuery("#export_instrust").html("");
				jQuery.each(jsonData,function(i,t){
					jQuery("#export_instrust").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
				});
				jQuery("#export_instrust").combobox();
		        jQuery('#export_instrust').find('option[value='+flow_id_check+']').attr('selected',true);
				jQuery('#flow_name').val(flow_name);
				jQuery('#flow_name').css("margin-bottom","0px");
			});
        }
    });
	open_bootcss_modal("myModal","700","5");
	jQuery('#myModal').load();
}
//关注工作导出页
function work_run_export_concern()
{	
	jQuery('#myModalLabel').html(td_lang.general.workflow.msg_208);
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
	var run_name = jQuery(window.frames["workflow-data-list"].document).find("#run_name").val();
	var flow_name = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").text();
	var flow_id_check = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").val();
	var search_para = jQuery(window.frames["workflow-data-list"].document).find("#search_para").val();
	var flag_search=jQuery(window.frames["workflow-data-list"].document).find("#search_adv_div").css("display");
	if(flag_search=='none'){
		run_name='';
        var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
        if(MENU_FLOW_ID){
            flow_id_check=MENU_FLOW_ID;
        }else{
            flow_id_check='all';
            flow_name=td_lang.general.workflow.msg_215;
        }
	}
	open_bootcss_modal("myModal","700","5");
	jQuery('#myModal').load();
	jQuery('.modal-body').html("");
	jQuery.ajax({
		type:"post",
        url:"data/work_run_export_concern.php",
        data:{"run_name":run_name,"flow_name":flow_name,"flow_id_check":flow_id_check,"search_para":search_para},
        success:function(html){
            jQuery('.modal-body').append(html);
			jQuery.getJSON('/general/approve_center/get_flow_list.inc.php', {root:true,action:3}, function(jsonData){
				jQuery("#export_concern_flow_id").html("");
				allornot(2);
				jQuery.each(jsonData,function(i,t){
					jQuery("#export_concern_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
				});
				jQuery("#export_concern_flow_id").combobox();
		        jQuery('#export_concern_flow_id').find('option[value='+flow_id_check+']').attr('selected',true);
				jQuery('#flow_name').val(flow_name);
				jQuery('#flow_name').css("margin-bottom","0px");
			});
        },
    });
}
//挂起工作导出页
function work_run_export_pending()
{	
	jQuery('#myModalLabel').html(td_lang.general.workflow.msg_209);
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
	var run_name = jQuery(window.frames["workflow-data-list"].document).find("#run_name").val();
	var flow_name = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").text();
	var flow_id_check = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").val();
 	var search_para = jQuery(window.frames["workflow-data-list"].document).find("#search_para").val();
	var flag_search=jQuery(window.frames["workflow-data-list"].document).find("#search_adv_div").css("display");
	var begin_dept_check = jQuery(window.frames['workflow-data-list'].document).find("#search_begin_dept").val();
	if(flag_search=='none'){
		run_name='';
		begin_dept_check= "";
        var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
        if(MENU_FLOW_ID){
            flow_id_check=MENU_FLOW_ID;
        }else{
            flow_id_check='all';
            flow_name=td_lang.general.workflow.msg_215;
        }
	}
	open_bootcss_modal("myModal","700","5");
	jQuery('#myModal').load();
	jQuery('.modal-body').html("");
	jQuery.ajax({
		type:"post",
        url:"data/work_run_export_pending.php",
        data:{"run_name":run_name,"flow_name":flow_name,"flow_id_check":flow_id_check,"search_para":search_para,"begin_dept_check":begin_dept_check},
        success:function(html){
            jQuery('.modal-body').append(html);
			jQuery.getJSON('/general/approve_center/get_flow_list.inc.php', {root:true,action:3}, function(jsonData){
				jQuery("#export_pending_flow_id").html("");
				allornot(2);
				jQuery.each(jsonData,function(i,t){
					jQuery("#export_pending_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
				});
				jQuery("#export_pending_flow_id").combobox();
				jQuery('#export_pending_flow_id').find('option[value='+flow_id_check+']').attr('selected',true);
				jQuery('#flow_name').val(flow_name);
				jQuery('#flow_name').css("margin-bottom","0px");
			});
        },
    });
}
//办结工作导出页
function work_run_export_settles()
{		
	jQuery('#myModalLabel').html(td_lang.general.workflow.msg_210);
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
	var run_name = jQuery(window.frames["workflow-data-list"].document).find("#run_name").val();
	var flow_name = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").text();
	var flow_id_check = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").val();
  	var search_para = jQuery(window.frames["workflow-data-list"].document).find("#search_para").val();
	var flag_search=jQuery(window.frames["workflow-data-list"].document).find("#search_adv_div").css("display");
	var begin_dept_check = jQuery(window.frames['workflow-data-list'].document).find("#search_begin_dept").val();
	var begin_time_check = jQuery(window.frames['workflow-data-list'].document).find("#begin_time").val();
	var end_time_check = jQuery(window.frames['workflow-data-list'].document).find("#end_time").val();
	if(flag_search=='none'){
		run_name='';
        var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
        if(MENU_FLOW_ID){
            flow_id_check=MENU_FLOW_ID;
        }else{
            flow_id_check='all';
            flow_name=td_lang.general.workflow.msg_215;
        }
		   begin_dept_check = "";
		   begin_time_check= "";
		   end_time_check = "";
	}
	open_bootcss_modal("myModal","700","5");
	jQuery('#myModal').load();
	jQuery('.modal-body').html("");
	jQuery.ajax({
		type:"post",
        url:"data/work_run_export_settles.php",
        data:{"run_name":run_name,"flow_name":flow_name,"flow_id_check":flow_id_check,"search_para":search_para,"begin_dept_check":begin_dept_check,'begin_time_check':begin_time_check,"end_time_check":end_time_check},
        success:function(html){
            jQuery('.modal-body').append(html);
			jQuery.getJSON('/general/approve_center/get_flow_list.inc.php', {root:true,action:3}, function(jsonData){
				jQuery("#export_settles_flow_id").html("");
				allornot(2);
				jQuery.each(jsonData,function(i,t){
					jQuery("#export_settles_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');					
				});
				jQuery("#export_settles_flow_id").combobox();
		        jQuery('#export_settles_flow_id').find('option[value='+flow_id_check+']').attr('selected',true);
				jQuery('#flow_name').val(flow_name);
				jQuery('#flow_name').css("margin-bottom","0px");
			});
        }
    });

}
//全部工作导出页
function work_run_export_data_all()
{	
	jQuery('#myModalLabel').html(td_lang.general.workflow.msg_213);
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
	var run_id = jQuery(window.frames["workflow-data-list"].document).find("#run_id").val();
	var run_name = jQuery(window.frames["workflow-data-list"].document).find("#run_name").val();
	var flow_name = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").text();
	var prcs_flag = jQuery(window.frames["workflow-data-list"].document).find("#prcs_flag").find("option:selected").val(); 
	var flow_id_check = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").val();
	var search_para = jQuery(window.frames["workflow-data-list"].document).find("#search_para").val();
	var flag_search=jQuery(window.frames["workflow-data-list"].document).find("#search_adv_div").css("display");
	var begin_dept_check = jQuery(window.frames['workflow-data-list'].document).find("#search_begin_dept").val();
	var begin_time_check = jQuery(window.frames['workflow-data-list'].document).find("#begin_time").val();
	var end_time_check = jQuery(window.frames['workflow-data-list'].document).find("#end_time").val();
	if(flag_search=='none'){
		run_name='';
        var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
        if(MENU_FLOW_ID){
            flow_id_check=MENU_FLOW_ID;
        }else{
            flow_id_check='all';
            flow_name=td_lang.general.workflow.msg_215;
        }
		Priority_check='';
	    begin_dept_check = "";
	    begin_time_check= "";
		end_time_check = "";
	}
	open_bootcss_modal("myModal","700","5");
	jQuery('#modal_id').load();
	jQuery('.modal-body').html("");
	jQuery.ajax({
		type:"post",
        url:"data/work_run_export_data_all.php",
        data:{"run_id":run_id,"run_name":run_name,"flow_name":flow_name,"flow_id_check":flow_id_check,"prcs_flag":prcs_flag,"search_para":search_para,"begin_dept_check":begin_dept_check,'begin_time_check':begin_time_check,"end_time_check":end_time_check},
        success:function(html){
            jQuery('.modal-body').append(html);
			jQuery.getJSON('/general/approve_center/get_flow_list.inc.php', {root:true,action:3}, function(jsonData){
				jQuery("#export_data_all").html("");
				allornot(2);
				jQuery.each(jsonData,function(i,t){
					jQuery("#export_data_all").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');					
				});
				jQuery("#export_data_all").combobox();
		        jQuery('#export_data_all').find('option[value='+flow_id_check+']').attr('selected',true);
				jQuery('#prcs_flag').find('option[value='+prcs_flag+']').attr('selected',true);
				jQuery('#flow_name').val(flow_name);
				jQuery('#flow_name').css("margin-bottom","0px");
			});
        },
    });

}

//挂起工作还原
function work_run_restore_work() 
{
	if(checkSelectRows()){
		var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
		var run_id_str="";
		var prcs_key_id_str="";
		for(var i = 0; i < selectRows.length; i++){
			var dataTr = jQuery(window.frames["workflow-data-list"].document).find("#gridTable").find("tr[role='row'][id='"+selectRows[i]+"']");
			var run_id = dataTr.find("td[aria-describedby='gridTable_run_id']").html();
			var prcs_key_id = dataTr.find("td[aria-describedby='gridTable_prcs_key_id']").html();
			run_id_str += run_id + ",";
			prcs_key_id_str += prcs_key_id + ",";
		}

		var url="/module/approve_center/engine/re_pause_work.php?run_id_str="+run_id_str+"&prcs_key_id_str="+prcs_key_id_str;
	    jQuery.get(url,{},function(data){
	    	window.refreshGrid();
	    	//jQuery('.close').click();
	    });	
	}
}

//取消关注
function work_run_cancel_concern() 
{

	if(checkSelectRows()){
		var selectRows = getSelectRows();
			if(selectRows == ""){
				return false;
			}
		var run_id_str="";
		var prcs_key_id_str="";
		flow_id_str = "";
		for(var i = 0; i < selectRows.length; i++){
			var dataTr = jQuery(window.frames["workflow-data-list"].document).find("#gridTable").find("tr[role='row'][id='"+selectRows[i]+"']");
			var run_id = dataTr.find("td[aria-describedby='gridTable_run_id']").html();
			var prcs_key_id = dataTr.find("td[aria-describedby='gridTable_prcs_key_id']").html();
			var flow_id = dataTr.find("td[aria-describedby='gridTable_flow_id']").html();
			run_id_str += run_id + ",";
			prcs_key_id_str += prcs_key_id + ",";
			flow_id_str += flow_id + ",";
		}
		var OP="";
		var OP_DESC = td_lang.general.workflow.msg_5;
		var msg = sprintf(td_lang.inc.msg_126,OP_DESC);
		
		if(window.confirm(msg))
	    {
	        jQuery.get("/module/approve_center/engine/focus_work.php",{"RUN_ID":run_id_str,"OP":OP,"FLOW_ID":flow_id_str},function(data)
	        {
	    	    window.refreshGrid();
	    	    //jQuery("#gridTable").trigger('reloadGrid');
	    	    //jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
	        });
	    }
	}
}

//新建工作导出页
function work_run_new_work()
{
	var url = "/general/approve_center/new/index.php";
    if(window.top.bTabStyle)
    {
        top.openURL('', td_lang.general.workflow.msg_254, url); 
    }
    else
    {
        window.location = url;
    }
}

//传阅工作导出
function work_run_export_view(){
	jQuery('#myModalLabel').html(td_lang.general.workflow.msg_319);
	jQuery('#modal_header_div').find('input').hide();
	jQuery(".ajax-result-block").hide();
	var run_name = jQuery(window.frames["workflow-data-list"].document).find("#run_name").val();
	var flow_name = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").text();
	var flow_id_check = jQuery(window.frames["workflow-data-list"].document).find("#flow_id").find("option:selected").val();
  	var search_para = jQuery(window.frames["workflow-data-list"].document).find("#search_para").val();
	var flag_search=jQuery(window.frames["workflow-data-list"].document).find("#search_adv_div").css("display");
	var begin_dept_check = jQuery(window.frames['workflow-data-list'].document).find("#search_begin_dept").val();
	if(flag_search=='none'){
		run_name='';
		begin_dept_check= "";
        var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
        if(MENU_FLOW_ID){
            flow_id_check=MENU_FLOW_ID;
        }else{
            flow_id_check='all';
            flow_name=td_lang.general.workflow.msg_215;
        }
	}
	open_bootcss_modal("myModal","700","5");
	jQuery('#myModal').load();
	jQuery('.modal-body').html("");
	jQuery.ajax({
		type:"post",
        url:"data/work_run_export_view.php",
        data:{"run_name":run_name,"flow_name":flow_name,"flow_id_check":flow_id_check,"search_para":search_para,'begin_dept_check':begin_dept_check},
        success:function(html){
            jQuery('.modal-body').append(html);
			jQuery.getJSON('/general/approve_center/get_flow_list.inc.php', {root:true,action:9}, function(jsonData){
				jQuery("#export_settles_flow_id").html("");
				allornot(2);
				jQuery.each(jsonData,function(i,t){
					jQuery("#export_settles_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');					
				});
				jQuery("#export_settles_flow_id").combobox();
		        jQuery('#export_settles_flow_id').find('option[value='+flow_id_check+']').attr('selected',true);
				jQuery('#flow_name').val(flow_name);
				jQuery('#flow_name').css("margin-bottom","0px");
			});
        }
    });
}