//点评
function comment(RUN_ID,FLOW_ID,BEGIN_DEPT,ARCHIVE_ID){
    if(typeof(ARCHIVE_ID) != 'undefined'){
        var ARCHIVE_ID_STR = "&ARCHIVE_ID="+ARCHIVE_ID;
    }else{
        var ARCHIVE_ID_STR = '';
    }
    var myleft=(screen.availWidth-550)/2;
    var mytop=(screen.availHeight-200)/2;
    window.open("/module/workflow/engine/verify_work.php?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID+"&BEGIN_DEPT="+BEGIN_DEPT+ARCHIVE_ID_STR,"comment","status=0,toolbar=no,menubar=no,width=550,height=200,location=no,scrollbars=yes,resizable=no,left="+myleft+",top="+mytop);
}

//关注
function focus_run(RUN_ID,FLOW_ID,FLOW_NAME,OP)
{   
    var OP_DESC=OP==1?td_lang.general.workflow.msg_4:td_lang.general.workflow.msg_5;//"关注":"取消关注"
    var msg2 = sprintf(td_lang.inc.msg_126,OP_DESC);
    var msg=msg2;
    if(window.confirm(msg))
    {
        jQuery.get("/module/workflow/engine/focus_work.php",{"RUN_ID":RUN_ID,"OP":OP,"FLOW_ID":FLOW_ID,"FLOW_NAME":FLOW_NAME},function(data)
        {
            //jQuery.showTip(data);
            //jQuery("#gridTable").trigger('reloadGrid');
            jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
        });
    }
}
//强制结束
function end_run(run_id_one,flow_id,begin_dept)
{
    var msg=td_lang.general.workflow.msg_2;//"确认要强制结束所选工作吗？"
    if(window.confirm(msg))
    {
        if(typeof run_id_one == "undefined")
            var run_str=get_run_str();
        else
            var run_str=run_id_one;
        if(run_str=="")
        {
            alert(td_lang.general.workflow.msg_3);//"要结束工作，请至少选择其中一项。"
            return;
        }
        jQuery.get("/module/workflow/engine/verify_end_work.php",{"RUN_ID_STR":run_str,"FLOW_ID":flow_id,"BEGIN_DEPT":begin_dept},function(data)
        {
              //jQuery.showTip(data);
                jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
          });
    }
}
//恢复执行
function restore_run(RUN_ID,flow_id,begin_dept)
{
    var msg=td_lang.general.workflow.msg_1;//"确认要将此工作恢复到执行中吗？"
    if(window.confirm(msg))
    {
        var url="/module/workflow/engine/restore_work.php?RUN_ID="+RUN_ID+"&FLOW_ID="+flow_id+"&BEGIN_DEPT="+begin_dept;
        jQuery.get(url,{},function(data){
            //jQuery.showTip(data);
            jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
        });
    }
}

//查看工作
function view_work(menu_flag, run_id, prcs_key_id, flow_id, prcs_id, flow_prcs){ 
    var url = "/general/workflow/document_list/print/index.php?actionType=view";
    url += "&MENU_FLAG="+menu_flag;
    url += "&RUN_ID="+run_id;
    url += "&PRCS_KEY_ID="+prcs_key_id;
    url += "&FLOW_ID="+flow_id;
    //url += "&PRCS_ID="+prcs_id;
    //url += "&FLOW_PRCS="+flow_prcs;
    var tmp_height = jQuery(window.parent.parent) ? jQuery(window.parent.parent.document).height() : jQuery(document).height()
    var configStr = "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width="+(jQuery(document).width()-20)+",height="+tmp_height+",left=-4,top=0";
    window.open(url, "view_work_"+run_id, configStr);
}

//工作删除
function delete_run(RUN_ID,FLOW_ID,BEGIN_DEPT)
{
    var msg=td_lang.general.workflow.msg_6;//"确认要删除所选工作吗？"
    if(window.confirm(msg))
    {
        jQuery.get("/module/workflow/engine/delete_work.php",{"RUN_ID_STR":RUN_ID,"FLOW_ID":FLOW_ID,"BEGIN_DEPT":BEGIN_DEPT},function(data)
        {
            
            //if(data== 1)
           // {
                //jQuery.showTip(td_lang.general.workflow.msg_7);//该工作已删除
                jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
           // }
           // else
           // {
                //alert(td_lang.general.workflow.msg_8);
           // }
                
        });
    }
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
//委托
function work_run_intrust(key_prcs_id)
{    

    loadModal();
    jQuery('#myModal_intrust').load('/module/workflow/engine/data/work_run_intrust.php',function(){

        jQuery('#myModalLabel').html(td_lang.general.workflow.msg_59);
        
        var key ;
        jQuery("#gridTable").find('tr').each(function(){
        
            key = jQuery(this).find('input[prcs_key_id='+key_prcs_id+']').length;
            if(key == 1){    
                var run_id =jQuery("#RUN_ID_"+key_prcs_id).val();
                var flow_name = jQuery(this).find("td[aria-describedby='gridTable_flow_name']").find('a').html();
                //var run_name = jQuery(this).find("td[aria-describedby='gridTable_RUN_NAME']").find('a').html();
                //var prcs_name = jQuery(this).find("td[aria-describedby='gridTable_TIME']").find('a').html();
                var delegate_type = jQuery("#FREE_OTHER_"+run_id).val();
                var flow_prcs = jQuery("#FLOW_PRCS_"+run_id).val();
                var prcs_id = jQuery("#PRCS_ID_"+key_prcs_id).val();
                var flow_id = jQuery("#FLOW_ID_"+run_id).val();
                var from_user_name = jQuery("#FROM_USER_NAME_"+key_prcs_id).val();
                var run_name = jQuery("#RUN_NAME_"+key_prcs_id).val();
                var prcs_name = jQuery("#PRCS_NAME_"+key_prcs_id).val();
                var op_flag = jQuery("#OP_FLAG_"+key_prcs_id).val();
                
                var selectData = {
                    'run_id':run_id, 
                    'run_name':run_name, 
                    'prcs_name':prcs_name, 
                    'prcs_key_id':key_prcs_id,
                    'flow_id':flow_id, 
                    'prcs_id':prcs_id, 
                    'delegate_type':delegate_type, 
                    'flow_prcs':flow_prcs,
                    'from_user_name':from_user_name,
                    'op_flag':op_flag
                };
                var SMS_CONTENT_SIZE = td_lang.general.workflow.msg_258 + run_name;
                jQuery("#SMS_CONTENT").val(SMS_CONTENT_SIZE);
                var resultData = selectData;
                var Data = {"runData":resultData};
                var template = jQuery.templates("#intrustDataTmpl");
                var htmlOutput = template.render(Data);
                jQuery("#intrustData").html(htmlOutput);
                jQuery("button[btntype='work_run_intrust']").click(function(){//普通操作

                    var attrTrObj = jQuery(this).parent().parent();
                    
                    var delegate_type = attrTrObj.attr('delegate_type');
                    if(delegate_type === '2'){ //自由委托  btn-primary
                        var module_id = '', 
                        to_id = attrTrObj.find('input[type="hidden"]').attr('id'), 
                        to_name = attrTrObj.find('input[type="text"]').attr('id'),  
                        manage_flag = '1', 
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
            }
        });
    });
}
function LoadWindow(FREE_OTHER,FLOW_ID, RUN_ID, PRCS_ID, FLOW_PRCS, TO_ID, TO_NAME)
{
    if(FREE_OTHER==1)
    {
        var URL="/general/workflow/document_list/others/user_select_prcs/?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
        var w=250;
        var h=300;
    }
    else if(FREE_OTHER==3)
    {
        var URL="/general/workflow/document_list/others/user_select_all/?FLOW_ID="+FLOW_ID+"&RUN_ID="+RUN_ID+"&PRCS_ID="+PRCS_ID+"&FLOW_PRCS="+FLOW_PRCS+"&TO_ID="+TO_ID+"&TO_NAME="+TO_NAME;
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
//弹出窗口
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
function check_form()
{
    try{
        jQuery("input[type='text'][name^='intrust_run_']").each(function(){ //验证
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
            var from_user_name = btnObj.attr("from_user_name");
            var op_flag = btnObj.attr("op_flag");
            var to_user = textObj.val();
            var datasrc = {"run_id": run_id,
                           "prcs_key_id": prcs_key_id,
                           "prcs_id": prcs_id,
                           "flow_prcs": flow_prcs,
                           "to_user": to_user,
                           "from_user_name": from_user_name,
                           "op_flag": op_flag
                           };
    
            jQuery.ajax({
                type: "POST",
                url: "/module/workflow/engine/data/work_to_intrust.php",
                cache: false,
                async: false,
                data: datasrc,
                error: function(msg){
                    alert(msg);
                },
                success: function(msg){
                    if(msg == ""){
                        var error_html = "<a href='javascript:;' data-toggle='tooltip' data-placement='top' title='' class='result_ok'></a>";
                        dataTrObj.find("td:eq(3)").find('.result-block').html(error_html);
                    }else if(msg.substring(0, 5) == "ERROR"){
                        var msg_arr = msg.split("|");
                        var msg_info = msg_arr[1];
                        var error_html = "<a href='javascript:;' data-toggle='tooltip' data-placement='top' title='"+msg_info+"' class='result_error'></a>";
                        dataTrObj.find("td:eq(3)").find('.result-block').html(error_html);
                        jQuery('.result_error').tooltip('show');
                    }else{
                        alert(msg);
                    }
                }
            });
        });    
    
        if(jQuery('#intrustData').find('.result_error').length > 0){//有错误提示则不提交
            return false;
                        
    
        }else{    //提交
            var detaile_count = 0;
            jQuery(".ajax-result-block").html(td_lang.general.workflow.msg_118);
            jQuery(".ajax-result-block").css("display", "block");
            jQuery('#work_run_submit').attr("disabled", true);
            var msg_check = jQuery("#intrust_sms").is(":checked") ? "checked" : "";
            var mobile_check = jQuery("#intrust_mobile").is(":checked") ? "checked" : "";
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
                var from_user_name = btnObj.attr("from_user_name");
                var op_flag = btnObj.attr("op_flag");
                var to_user = textObj.val();
    
    
                jQuery.ajax({
                    type: "POST",
                    url: "/module/workflow/engine/data/work_to_intrust.php?action=submit",
                    cache: false,
                    async: false,
                    data: {"run_id":run_id,"prcs_key_id":prcs_key_id,"prcs_id":prcs_id,"flow_prcs":flow_prcs,"to_user":to_user,"mobile_check":mobile_check,"msg_check":msg_check,"sms_content":sms_content,"run_name":run_name,"flow_id":flow_id,"from_user_name":from_user_name,"op_flag":op_flag},
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
                //window.refreshGrid();
                jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
            }, 2000);
        }
    }catch(e){
        alert(e);
        return false;
    }
}
//工作催办
function reminders(run_id,flow_id,run_name)
{
    jQuery.get("/module/workflow/engine/flow_reminders.php",{"RUN_ID":run_id,"FLOW_ID":flow_id,"RUN_NAME":run_name},function(data)
    {
        alert(td_lang.general.workflow.msg_246);
    });
}
//查看实际流程图
function flow_view(RUN_ID,FLOW_ID)
{
    var myleft=(screen.availWidth-800)/2;
    window.open("/general/workflow/document_list/flow_view/?RUN_ID="+RUN_ID+"&FLOW_ID="+FLOW_ID,RUN_ID,"status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=400,left="+myleft+",top=100");
}

function guide_flow(flow_id, flow_name)
{
    new_work(flow_name, '/general/workflow/document_new/edit.php?FLOW_ID=' + flow_id);
}
function new_work(title, url)
{
    if(window.top.bTabStyle)
    {
        top.openURL('', title, url); 
    }
    else
    {
        window.location = url;
    }
}

//转交
function transmission(RUN_ID,PRCS_KEY_ID,FLOW_ID,PRCS_ID,FLOW_PRCS,RUN_NAME,PRCS_NAME)
{
    jQuery('#work_run_form_submit').attr("disabled", false);
    open_bootcss_modal('myModalForm', "960", "5");
    loadWorkHandleNext(RUN_ID,PRCS_KEY_ID,FLOW_ID,PRCS_ID,FLOW_PRCS,RUN_NAME,PRCS_NAME);
}

function loadWorkHandleNext(run_id,prcs_key_id,flow_id,prcs_id,flow_prcs,RUN_NAME,PRCS_NAME){// 流程办理时转交下一步处理函数
    jQuery('#myModalForm').find('#myModalForm_intrust').html(td_lang.inc.msg_30);
    jQuery('#myModalForm').find('#myModalForm_intrust').load('work_next.php?flow_id='+flow_id+'&prcs_key_id='+prcs_key_id+'&run_id='+run_id+'&prcs_id='+prcs_id+'&prcs_name='+encodeURIComponent(PRCS_NAME)+'&flow_prcs='+flow_prcs,function(msg){
        
//        if(RUN_NAME.length>50){
//            RUN_NAME = RUN_NAME.substr(0, 50)+"...";
//        }
        jQuery('#myModalFormLabel').html('NO. '+run_id+' '+RUN_NAME);
        return false;
        
    });
}

function bindCheckBtnEvent(){
    jQuery('#all_check').show().on('refreshCheckStatus', function(){
        var status = true; //默认全选active
        jQuery("li.workflow-node[id^='next_prcs_'][condition!='false']").each(function(i, v){
            if(jQuery(v).attr('id') != 'next_prcs_0' && sync_deal == 1 && !this.className.match(/active/)){
                status = false; //有任意步骤未被选择 
            }
        });
        jQuery(this)[ status ? 'addClass' : 'removeClass' ]('active');
    });
}

function addPrcsJsonDatas(data){
    var Data = {"prcsData":data.prcsData};
    var template = jQuery.templates("#workPrcsTmpl");
    var htmlOutput = template.render(Data);
    jQuery("#workPrcsData").html(htmlOutput);
    jQuery(data.prcsData).each(function(i, v){
        var prcs_name_obj = jQuery("#next_prcs_"+v.prcs_num).find('a:first');
        var prcs_back = v.prcs_back;
        if(prcs_name_obj.attr('title') === '0'){
            prcs_name_obj.attr('title', '<strong>'+td_lang.general.workflow.msg_241+'</strong>');
        }else{
            prcs_name_obj.attr('title', prcs_name_obj.attr('title') + "：" + prcs_name_obj.text());
        }
        var prcs_obj_li = jQuery("#next_prcs_"+v.prcs_num);
        if (prcs_back != undefined) 
        {
            prcs_obj_li.attr("prcs_back", prcs_back); //是否子流程返回父流程
        }
        if(typeof v.prcs_in_condition != 'undefined' && v.prcs_in_condition != ''){
            var condition_desc = '';
            var condition_desc_title = '';
            var prcs
            if(v.prcs_in_condition.substring(0, 5) == 'SETOK'){
                condition_desc = td_lang.general.workflow.msg_236;
                condition_desc_title = td_lang.general.workflow.msg_238;
                prcs_obj_li.attr('condition', 'true');
            }else{
                condition_desc = td_lang.general.workflow.msg_237;
                condition_desc_title = td_lang.general.workflow.msg_239;
                prcs_obj_li.attr('condition', 'false');
            }
            var a = jQuery('<a>'+condition_desc+'</a>').attr('title', '<strong>'+condition_desc_title+'：<br />'+v.prcs_in_condition.replace('SETOK', '')+'</strong>');
            prcs_obj_li.find('ol').append(a);
        }
    });
    jQuery(".workflow-node").find('a').tooltip();
    sync_deal = data.sync_deal; //并发
    turn_priv = data.turn_priv;// 强制转交
    gather_node = data.gather_node;// 强制合并
    if(sync_deal == 2){
        jQuery('#prcs_title').append('&nbsp;&nbsp;&nbsp;&nbsp;<font color="red">'+td_lang.general.workflow.msg_242+'</font>');
    }
    var sms_content = jQuery('#myModalForm').find('#SMS_CONTENT').val();
    jQuery(".workflow-node").click(function(){
        var prcs_type = jQuery("#PRCS_TYPE").val();
        var next_prcs_id =jQuery("#NEXT_PRCS_TYPE").val();
        var prcs_info_arr = jQuery(this).attr('id').split('_');
        if(prcs_info_arr.length != 3){
            return false;
        }
        var prcs_num = prcs_info_arr[2];
        var $this = jQuery(this);
        if($this.attr('condition') == 'false'){
            return false;
        }
        // 禁止并发
        if(sync_deal == 0){
            if(prcs_type != 3)
            {
                $this.siblings().removeClass('active');
                $this.addClass('active');
            }else //柔性转交
            {
                //$this.siblings().removeClass('active');
                if(flow_prcs == prcs_num)
                {
                    jQuery(".workflow-node[id='next_prcs_"+prcs_num+"']").addClass('active');
                    jQuery(".workflow-node[id='next_prcs_"+next_prcs_id+"']").removeClass('active');
                    return false;
                   
                }else
                {
                    jQuery(".workflow-node[id='next_prcs_"+prcs_num+"']").addClass('active');
                    jQuery(".workflow-node[id='next_prcs_"+flow_prcs+"']").removeClass('active');
                }
            }
            if(prcs_info_arr[2] === "0" && $this.attr("prcs_back") == undefined){
                jQuery("#work-next-prcs-block").html('');
                jQuery('div[data_type="next"]').hide();
                if(jQuery('#myModalForm').find('#SMS_CONTENT').length != 0)
                {
                    jQuery('#myModalForm').find('#SMS_CONTENT').val(sms_content.replace(td_lang.general.workflow.msg_259, td_lang.general.workflow.msg_260));
                }
                return false;
            }
            jQuery('#myModalForm').find('#SMS_CONTENT').val(sms_content);
            jQuery('div[data_type="next"]').show();
            var prcsBlockData = new Array();
            var prcs_uname = new Array();
            var prcs_uname_arr = $this.attr('prcs_uname').split(',');
            if(prcs_type == 3) //柔性转交
            {
                if(flow_prcs == prcs_num) //柔性步骤
                {
                    var prcs_uname_str = jQuery("#PRCS_USER"+flow_prcs).val();
                    var prcs_uid_arr = prcs_uname_str.split(',');
                }else
                {
                    var prcs_uid_arr = $this.attr('prcs_uid').split(',');
                }

            }else
            {
                var prcs_uid_arr = $this.attr('prcs_uid').split(',');
            }
            jQuery(prcs_uname_arr).each(function(i, v){
                if(v != ""){
                    prcs_uname.push({"user_id":prcs_uid_arr[i], "uname": v, 'gather_node_have_flag':$this.attr('gather_node_have_flag')});
                }
            });
            var prcsBlockData = [{
                'prcs_num':prcs_num, 
                'prcs_back': $this.attr('prcs_back'),
                'top_flag':$this.attr('top_flag'), 
                'prcs_op_uid':$this.attr('prcs_op_uid'), 
                'prcs_op_uname':$this.attr('prcs_op_uname'), 
                'prcs_uid':$this.attr('prcs_uid'), 
                'time_out':$this.attr('time_out'),
                'time_out_modify':$this.attr('time_out_modify'),
                'prcs_uname': prcs_uname,
                'gather_node_have_flag':$this.attr('gather_node_have_flag'), 
                'next_prcs_name':$this.attr('next_prcs_name')
            }];
            var template = jQuery.templates("#workNextPrcsUserTmpl");
            var htmlOutput = template.render(prcsBlockData);
            jQuery("#work-next-prcs-block").html(htmlOutput);
            jQuery('.workflow-node-title-text[title]').tooltip();
            if( $this.attr('user_lock') !== '0'){
                jQuery("#TOP_FLAG_SHOW"+prcs_num).attachmenu();
            }else{
                if($this.attr('auto_type')!==""&&jQuery(".user-tags").length!==0)
                {
                    jQuery('#chose_user' + prcs_num).click(function() {//yzx不允许修改默认人员
                        alert(td_lang.general.workflow.msg_247);
                        return false;
                    });
                    jQuery('.close').hide();//yzx 隐藏人员删除
                }
            	jQuery('#TOP_FLAG_SHOW'+prcs_num).click(function(){
            	    
            		alert(td_lang.general.workflow.msg_248);
            		return false;
            	});
            }
            
        }else if( sync_deal == 1){ // 允许并发
            bindCheckBtnEvent();
            if($this.hasClass('active')){
                $this.removeClass('active');
                jQuery("#work-next-prcs-block [prcs_id_next="+prcs_num+']').remove();
                jQuery('#all_check').removeClass('active');
            }else{
                $this.addClass('active');
                jQuery('#all_check').trigger('refreshCheckStatus');
                if(prcs_info_arr[2] === "0"){
                    jQuery("#work-next-prcs-block").html('');
                    jQuery(".workflow-node[id!='next_prcs_0']").removeClass('active');
                    jQuery('#all_check').removeClass('active');
                    if(jQuery('#myModalForm').find('#SMS_CONTENT').length != 0)
                    {
                        jQuery('#myModalForm').find('#SMS_CONTENT').val(sms_content.replace(td_lang.general.workflow.msg_259, td_lang.general.workflow.msg_260));
                    }
                    jQuery('div[data_type="next"]').hide();
                    return false;
                }
                jQuery('#myModalForm').find('#SMS_CONTENT').val(sms_content);
                jQuery(".workflow-node[id='next_prcs_0']").removeClass('active');
                jQuery('div[data_type="next"]').show();
                var prcsBlockData = new Array();
                var prcs_uname = new Array();
                var prcs_uname_arr = $this.attr('prcs_uname').split(',');
                var prcs_uid_arr = $this.attr('prcs_uid').split(',');
                jQuery(prcs_uname_arr).each(function(i, v){
                    if(v != ""){
                        prcs_uname.push({"user_id":prcs_uid_arr[i], "uname": v, 'gather_node_have_flag':$this.attr('gather_node_have_flag')});
                    }
                });
                var prcsBlockData = [{
                    'prcs_num':prcs_num, 
                    'top_flag':$this.attr('top_flag'), 
                    'prcs_op_uid':$this.attr('prcs_op_uid'), 
                    'prcs_op_uname':$this.attr('prcs_op_uname'), 
                    'prcs_uid':$this.attr('prcs_uid'),  
                    'time_out':$this.attr('time_out'),
                    'time_out_modify':$this.attr('time_out_modify'),
                    'prcs_uname': prcs_uname, 
                    'gather_node_have_flag':$this.attr('gather_node_have_flag'),
                    'next_prcs_name':$this.attr('next_prcs_name')
                }];
                var template = jQuery.templates("#workNextPrcsUserTmpl");
                var htmlOutput = template.render(prcsBlockData);
                var current_index = jQuery("li[id^='next_prcs_'][class*='active']").index($this);
                var before_insert_id = '';
                jQuery("li[id^='next_prcs_'][class*='active']").each(function(i, v){
                    var unit_index = jQuery("li[id^='next_prcs_'][class*='active']").index(jQuery(v));
                    if(unit_index > current_index){
                        before_insert_id = jQuery(v).attr('id');
                        return false;
                    }
                })
                if(before_insert_id != ''){
                    var prcs_num_arr = before_insert_id.split('_');
                    if(prcs_num_arr.length == 3){
                        var search_num = prcs_num_arr[2];
                        jQuery('li[prcs_id_next="'+search_num+'"]').before(jQuery(htmlOutput));
                    }
                }else{
                    jQuery("#work-next-prcs-block").append(htmlOutput);
                }
                jQuery('.workflow-node-title-text[title]').tooltip();
                if( $this.attr('user_lock') !== '0'){
                    jQuery("#TOP_FLAG_SHOW"+prcs_num).attachmenu();
                }else{
                   if($this.attr('auto_type')!==""&&jQuery(".user-tags").length!==0)
                    {
                        jQuery('#chose_user' + prcs_num).click(function() {//yzx不允许修改默认人员
                            alert(td_lang.general.workflow.msg_247);
                            return false;
                        });
                        jQuery('.close').hide();//yzx 隐藏人员删除
                    }
                	jQuery('#TOP_FLAG_SHOW'+prcs_num).click(function(){
                	    
                		alert(td_lang.general.workflow.msg_248);
                		return false;
                	});
                }
            }
        }else if( sync_deal == 2){   //强制并发
            if(prcs_info_arr[2] === "0"){//结束
                 if($this.hasClass('active')){
                     
                 }else{
                     $this.addClass('active'); 
                     jQuery(".workflow-node[id!='next_prcs_0']").removeClass('active');
                     jQuery('div[data_type="next"]').hide();
                 }
                if(jQuery('#myModalForm').find('#SMS_CONTENT').length != 0)
                {
                    jQuery('#myModalForm').find('#SMS_CONTENT').val(sms_content.replace(td_lang.general.workflow.msg_259, td_lang.general.workflow.msg_260));
                }
                jQuery("#work-next-prcs-block").html('');
                return false;
            }else{//非结束
                jQuery('#myModalForm').find('#SMS_CONTENT').val(sms_content);
                jQuery('#all_check').hide().addClass('disable');
                if($this.hasClass('active')){//取消
                    
                }else{//选中
                    jQuery(".workflow-node[id!='next_prcs_0'][condition!='false']").addClass('active'); 
                    jQuery(".workflow-node[id='next_prcs_0']").removeClass('active');
                    jQuery('div[data_type="next"]').show();
                    jQuery(".workflow-node[id!='next_prcs_0'][condition!='false']").each(function(i, v){
                        $v = jQuery(v);
                         var prcsBlockData = new Array();
                            var prcs_uname = new Array();
                            var prcs_uname_arr = $v.attr('prcs_uname').split(',');
                            var prcs_uid_arr = $v.attr('prcs_uid').split(',');
                            jQuery(prcs_uname_arr).each(function(i, v){
                                if(v != ""){
                                    prcs_uname.push({"user_id":prcs_uid_arr[i], "uname": v, 'gather_node_have_flag':$v.attr('gather_node_have_flag')});
                                }
                            });
                            var prcs_num_arr = $v.attr('id').split('_');
                            var prcs_num = prcs_num_arr[2];
                            var prcsBlockData = [{
                                'prcs_num':prcs_num, 
                                'top_flag':$v.attr('top_flag'), 
                                'prcs_op_uid':$v.attr('prcs_op_uid'), 
                                'prcs_op_uname':$v.attr('prcs_op_uname'), 
                                'prcs_uid':$v.attr('prcs_uid'),  
                                'time_out':$v.attr('time_out'),
                                'time_out_modify':$v.attr('time_out_modify'),
                                'prcs_uname': prcs_uname, 
                                'gather_node_have_flag':$v.attr('gather_node_have_flag'),
                                'next_prcs_name':$v.attr('next_prcs_name')
                            }];
                            var template = jQuery.templates("#workNextPrcsUserTmpl");
                            var htmlOutput = template.render(prcsBlockData)
                            jQuery("#work-next-prcs-block").append(htmlOutput);
                            jQuery('.workflow-node-title-text[title]').tooltip();
                            if( $v.attr('user_lock') !== '0'){
                                jQuery("#TOP_FLAG_SHOW"+prcs_num).attachmenu();
                            }else{
                                if($v.attr('auto_type')!==""&&jQuery(".user-tags").length!==0)
                                {
                                    jQuery('#chose_user' + prcs_num).click(function() {//yzx不允许修改默认人员
                                        alert(td_lang.general.workflow.msg_247);
                                        return false;
                                    });
                                    jQuery('.close').hide();//yzx 隐藏人员删除
                                }
                            	jQuery('#TOP_FLAG_SHOW'+prcs_num).click(function(){
                            	    
                            		alert(td_lang.general.workflow.msg_248);
                            		return false;
                            	});
                            }
                    });
                }
            }
        }
        jQuery('.modal-body').trigger('scroll');
    });
    if(sync_deal == 1 || sync_deal == 2){
        jQuery('[id^="next_prcs_"]').trigger('click');
    }else if(data.defaultNextPrcs){
        jQuery('#next_prcs_'+data.defaultNextPrcs).click();
    }
}

function set_top(flag, line_count){
    jQuery("#TOP_FLAG"+line_count).val(flag);
    if(flag==0)
    {
        document.getElementById('TOP_FLAG_SHOW'+line_count).innerHTML = td_lang.general.workflow.msg_251; //"主办人："
    }     
    else if(flag=="1")
    {
        document.getElementById('TOP_FLAG_SHOW'+line_count).innerHTML= td_lang.general.workflow.msg_252; //"先接收者主办：";
    }
    else
    {
        document.getElementById('TOP_FLAG_SHOW'+line_count).innerHTML= td_lang.general.workflow.msg_253; //"无主办人会签：";
    }
      
    if(flag!="0")
    {
       jQuery("#PRCS_OP_USER"+line_count).val("");
       jQuery("#host_op_block_div"+line_count).find(".user-tags").remove();
    }
   
   document.getElementById("TOP_FLAG_SHOW"+line_count+'_menu').style.display = 'none';
}

function setEditableField(bid) {

    var prcsid = bid.replace("freePrcsEditableField", "");
    var urlStr = "set_item.php?FLOW_ID=" + window.flow_id + "&RUN_ID=" + window.run_id + "&PRCS_ID=" + prcsid + "&PRCS_ID_NEXT=" + window.prcs_next_id + "&LINE_COUNT=" + window.prcs_next;
    loc_x = 220;
    loc_y = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - event.offsetX - 220;
        loc_y = document.body.scrollTop + event.clientY - event.offsetY;
    }
    LoadDialogWindow(urlStr, self, loc_x, loc_y, 973, 460);
}
(function($) {
    //自由流程选择 by jx
    function FreePrcsSelector() {
        this.init.apply(this, arguments);
    }
    var opts = {
        id: 'workFreePrcs', //容器
        index: 3, //默认最小从第三步开始设计自由流程
        data: null //已保存的自由流程数据
    };
    FreePrcsSelector.prototype = {
        constructor: FreePrcsSelector,
        init: function(opts) {
            this.$el = $('#' + opts.id);
            this._index = this.index = parseInt(opts.index || 3, 10);
            this.data = opts.data || {};
            this.readonly = opts.readonly || false;
            this.free_preset = opts.free_preset; //流程是否允许预设步骤 --YZX

            this.data.length && this.load(this.data);
            if (this.free_preset != 0) {
                !this.readonly && this.renderCtrl();
            }
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            this.$el.delegate('[data-cmd="del"]', 'click', function() {
                var id = $(this).parents('.work-free-prcs-block').first().attr('data-id');
                self.remove(id);
            });
            this.$el.delegate('[data-cmd="setEditableField"]', 'click', function() {
                var id = $(this).parents('.work-free-prcs-block').first().attr('data-id');
                self.setField(id);
            });
        },
        render: function(data) {
            var template = $.templates("#workFreePrcsBlockTmpl");
            return template.render(data);
        },
        renderCtrl: function() {
            var $btns = $('<div></div>').insertAfter(this.$el).css('margin-bottom', 10);
            this.$add = $('<button class="btn btn-small btn-info">增加自由步骤</button>').appendTo($btns);
            this.$clear = $('<button class="btn btn-small btn-danger">重置自由步骤</button>').appendTo($btns).css('margin-left', 10);
            this.$add.click($.proxy(this.add, this));
            this.$clear.click($.proxy(this.clear, this));
        },
        add: function() {
            var $el = this.$el,
                data = {id: this.guid(),index: this.index++},
                $html = $(this.render(data));
            $el.append($html);

            var prcs_data = {
                prcs_num: data.id,
                next_prcs_name: '预设步骤',
                top_flag: 0,
                prcs_type: 'free'
            };

            this.renderItem(prcs_data);
        },
        remove: function(id) {
            $('#work-free-prcs-block-' + id).remove();
            this.index--;
            this.resetIndex();
        },
        load: function(data) {
            if (!data) {
                return;
            }
            var self = this;
            $.each(data, function(i, n) {
                self.renderItem(n.prcsData[0]);
            });
        },
        renderItem: function(data) {
            if (!data) {
                return;
            }
            var prcs_data = data;
            var $html = $('#work-free-prcs-block-' + data.prcs_num);
            var nodeHtml = $.templates("#workPrcsTmpl").render({prcsData: prcs_data});
            var resultHtml = $.templates("#workNextPrcsUserTmpl").render(prcs_data);
            //console.log("容器", $html);
            //console.log("数据", data);
            $html.find('.workflow-procs-nodes').html(nodeHtml);
            $html.find('.workflow-procs-nodes-result').html(resultHtml);
            $html.find('.workflow-node').addClass('active');
            jQuery("#TOP_FLAG_SHOW" + prcs_data.prcs_num).attachmenu();
        },
        clear: function() {
            this.index = this._index;
            this.$el.find('.default-free').remove();
        },
        guid: function() {
            var i = 8, store = [];
            while (i) {
                store.push(Math.floor(Math.random() * 16.0).toString(16));
                i--;
            }
            return store.join('');
        },
        resetIndex: function() {
            var index = parseInt(this._index, 10);
            //console.log(index);
            this.$el.find('.work-free-prcs-block').each(function(i, n) {
                n.setAttribute('data-index', index + i);
                $(n).find('.work-prcs-title-text b').text(index + i);
            });
        },
        setField: function(i) {
            setEditableField('freePrcsEditableField' + i);
        },
        /*
         * 获取自由流程选择结果 return [object | false]
         */
        serialize: function() {
            var check_flag = true, json = [];
            /*
             *    .work-free-prcs-block-next    下一步骤 php生成
             *    .work-free-prcs-block         预设步骤 js生成
             */
            this.$el.find('.work-free-prcs-block-next,.work-free-prcs-block').each(function(i, n) {
                var index = n.getAttribute('data-index');
                var flow_prcs = n.getAttribute('data-id');
                if (jQuery('#PRCS_USER' + flow_prcs).val() == '') {
                    alert(td_lang.general.workflow.msg_245);
                    check_flag = false;
                    return false;
                }
                if (jQuery('#TOP_FLAG' + flow_prcs).val() === '0' && jQuery('#PRCS_OP_USER' + flow_prcs).val() == '') {
                    alert(td_lang.general.workflow.msg_244);
                    check_flag = false;
                    return false;
                }
                json.push({
                    index: index,
                    top_flag: jQuery('#TOP_FLAG' + flow_prcs).val(),
                    prcs_op_user: jQuery('#PRCS_OP_USER' + flow_prcs).val(),
                    prcs_user: jQuery('#PRCS_USER' + flow_prcs).val(),
                    editable_field: jQuery('#freePrcsEditableField' + flow_prcs).val()
                });
            });
            //  console.log(jQuery('#freePrcsEditableField8').val());
            return check_flag && json;
        }
    };

    window.FreePrcsSelector = FreePrcsSelector;
})(jQuery);