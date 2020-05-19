jQuery(document).ready(function(){

    function checkSelectRows()
    {
        // alert(3)
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

    function getSelectRows()
    {
    	jQuery('#modal_header_div').find('input').hide();
    	jQuery(".ajax-result-block").hide();
    	return jQuery(document).find("#gridTable").jqGrid('getGridParam','selarrrow');
    }


    function loadModal()
    {
    	jQuery('#myModalOfTurn').modal({
    		keyboard: true,
    		backdrop:"static"
    	});
        jQuery('#myModalOfTurn').css('top','15px');
        jQuery('.modal-body').css('max-height', jQuery(window).height()-150);
        jQuery('.modal-footer').css('padding', '8px 15px 8px');
    }

    function getRunData(selectRows){
    	var runData = new Array();
    	var flowDelegateTypeArr = new Array();
		var run_id_str = '';
		var flow_id_str = '';
		var prcs_key_id_str = '';
		var flow_prcs_str = '';
		var prcs_id_str = '';
    	for(var i = 0; i < selectRows.length; i++){
    		var dataTr = jQuery(document).find("#gridTable").find("tr[role='row'][id='"+selectRows[i]+"']");
    		var run_id = dataTr.find("td[aria-describedby='gridTable_RUN_ID']").attr("title");
    		var prcs_key_id = dataTr.find("td[aria-describedby='gridTable_RUN_ID']").find('input').attr("prcs_key_id");
    		var flow_id = dataTr.find("td[aria-describedby='gridTable_RUN_ID']").find('input').attr("flow_id");
    		var flow_prcs = dataTr.find("td[aria-describedby='gridTable_RUN_ID']").find('input').attr("flow_prcs");
    		var prcs_id = dataTr.find("td[aria-describedby='gridTable_RUN_ID']").find('input').attr("prcs_id");
    		var flow_type = dataTr.find("td[aria-describedby='gridTable_RUN_ID']").find('input').attr("flow_type");
			if(flow_type == 2)
			{
				continue;
			}
			run_id_str += run_id+',';
			flow_id_str += flow_id+',';
			prcs_key_id_str += prcs_key_id+',';
			flow_prcs_str += flow_prcs+',';
			prcs_id_str += prcs_id+',';
    	}
    	var resultData = {"run_id_str": run_id_str,"flow_id_str":flow_id_str,"prcs_key_id_str":prcs_key_id_str,"flow_prcs_str":flow_prcs_str,"prcs_id_str":prcs_id_str};
    	return resultData;
    }

    function work_run_turn_all(pageName)
    {
    	if(checkSelectRows()){
            loadModal();
    		open_bootcss_modal("myModalOfTurn","880","5");
            var selectRows = getSelectRows();
            var resultData = getRunData(selectRows);
            var runData = resultData;
    		jQuery('#myModalOfTurn .modal-body').load('./work_next_sole.php',runData,function(msg){
    			jQuery('#PLUGIN_TURN_BEFORE_POSITION').html(jQuery.templates('#PLUGIN_TURN_BEFORE_POSITION_Tmpl').render({end_script:'</script>'}));
				jQuery('#PLUGIN_TURN_AFTER_POSITION').html(jQuery.templates('#PLUGIN_TURN_AFTER_POSITION_Tmpl').render({end_script:'</script>'}));
            })
        }
    }


    jQuery('body').on('click','#workRunBatchTransfer',function(){
        work_run_turn_all()
    })





















});
