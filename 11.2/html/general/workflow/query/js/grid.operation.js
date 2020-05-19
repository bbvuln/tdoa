jQuery(document).ready(function(){
    var sizeArr = getLogGridTableSize();
    var flow_id_exp = jQuery("#FLOW_ID").val();
    var form_name = jQuery("#flow_name").val();
    var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
    if(!MENU_FLOW_ID){
        jQuery("#query_excel").hide();
        jQuery("#query_zip").hide();
    }
    jQuery.getJSON("/general/workflow/get_flow_list.inc.php",{"FLOW_ID":MENU_FLOW_ID,"action":4,"root":true},function(jsonData){
        jQuery("#FLOW_ID").html("");
        jQuery("#exp_flow_id").html("");
        jQuery.each(jsonData,function(i,t){
            jQuery("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
            jQuery("#exp_flow_id").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');

        });
        jQuery("#FLOW_ID").combobox();
        jQuery("#exp_flow_id").combobox();
        jQuery('#exp_flow_id').find('option[value='+flow_id_exp+']').attr('selected',true);
        if(MENU_FLOW_ID){
            jQuery('#do_search').click();
        }
    });
    jQuery(document).on("click", "#time_dropdown_menu", function()
    {
        var inteligent_id = jQuery("#btn_time").find('span').attr("data_value");
        var now = new Date();
        var year = now.getFullYear();//年
        if(inteligent_id=="this-year")
        {
            var timeArray = getThisYear(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="this-quarterly")
        {
            
            var timeArray = getThisQuarterly(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="prev-quarterly")
        {
            var timeArray = getPrevQuarterly(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="prev-year")
        {
            var timeArray = getPrevYear(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="this-month")
        {
            var timeArray = getThisMonth(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="prev-month")
        {
            var timeArray = getPrevMonth(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="this-week")
        {
            var timeArray = getThisWeek(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="prev-week")
        {
            var timeArray = getPrevWeek(false);
            jQuery("#begin_time").val(timeArray[0]);
            jQuery("#end_time").val(timeArray[1]);
        }
        else if(inteligent_id=="all-clear")
        {
            jQuery("#begin_time").val("");
            jQuery("#end_time").val("");
        }
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
    
    jQuery(document).on('click', "#query_export", function(){
        jQuery('#exp_flow_id').val(document.form1.FLOW_ID.value);
        jQuery('#EXP_RUN_ID').val(jQuery.trim(jQuery('#RUN_ID').val()));
        jQuery('#EXP_RUN_NAME').val(jQuery.trim(jQuery('#run_name').val()));
        jQuery('#exp_begin_time').val(jQuery.trim(jQuery('#begin_time').val()));
        jQuery('#query_export_area').val(jQuery.trim(jQuery('#FLOW_QUERY_TYPE').val()));
        jQuery('#exp_flow_name').val(jQuery.trim(jQuery('#flow_name').val()));
        jQuery('#exp_end_time').val(jQuery.trim(jQuery('#end_time').val()));
        jQuery('#exp_FLOW_STATUS').val(jQuery.trim(jQuery('#FLOW_STATUS').val()));
        jQuery('#exp_user').val(jQuery.trim(jQuery('#TO_NAME').val()));
        jQuery('#exp_user_id').val(jQuery.trim(jQuery('#TO_ID').val()));
        jQuery('#exp_work_level').val(jQuery.trim(jQuery('#work_level').val()));
        set_user();
        open_bootcss_modal("div_export","780","5");//修改窗口大小    
        var flow_id=document.form1.FLOW_ID.value;
        var flow_name=jQuery.trim(jQuery('#flow_name').val());
        jQuery('#exp_flow_id').find('option[value='+flow_id+']').attr('selected',true);
        jQuery('input[class=ui-autocomplete-input]').val(flow_name);
        jQuery('#flow_name').css("margin-bottom","0px");
        jQuery('#div_export_body').load();
    });
//    jQuery(window).resize(function(){
//
//    var sizeArr = getLogGridTableSize();
//    jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
//    jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
//        
//    });
    
    if(!MENU_FLOW_ID){
        jQuery.getJSON("data/getcolumns.php", {
                "date":Date.parse(new Date()),
                "cookieName":cookieName,
                'vWidth':jQuery(document.body).width()-2,
                'pageType':pageType
            },
            function(columns){
                jQuery.each(columns.fields, function(i,t){
                    if(t.sortable == ""){
                        columns.fields[i].sortable = false;
                    }else if(t.checkable == ""){
                        columns.fields[i].checkable = false;
                    }else if(t.resizable == ""){
                        columns.fields[i].resizable = false;
                    }
                    columns.fields[i].hidden = (t.hidden === 'true' ? true : false);
                    columns.fields[i].title = (t.title === 'false' ? false : true);
                });
                var FLOW_ID        = jQuery("#FLOW_ID").val() || MENU_FLOW_ID;
                var BEGIN_TIME    = jQuery("#begin_time").val();
                var END_TIME     = jQuery("#end_time").val();
                var WORK_LEVEL     = jQuery("#work_level").val();
                var FLOW_STATUS    = jQuery("select[name='FLOW_STATUS']").val();
                var RUN_ID        = jQuery("input[name='RUN_ID']").val()==''?'':jQuery("input[name='RUN_ID']").val();
                var RUN_NAME    = jQuery("#run_name").val()==''?'':jQuery("#run_name").val();
                var FLOW_QUERY_TYPE = jQuery("select[name='FLOW_QUERY_TYPE']").val()==''?'':jQuery("select[name='FLOW_QUERY_TYPE']").val();
                var TO_ID        = jQuery("input[name='TO_ID']").val()==''?'':jQuery("input[name='TO_ID']").val();
                var url = 'data/getdata.php?pageType='+pageType+'&FLOW_ID='+FLOW_ID+'&BEGIN_TIME='+BEGIN_TIME+'&END_TIME='+END_TIME+'&RUN_ID='+RUN_ID+'&FLOW_STATUS='+FLOW_STATUS+'&RUN_NAME='+RUN_NAME+'&FLOW_QUERY_TYPE='+FLOW_QUERY_TYPE+'&TO_ID='+TO_ID+'&WORK_LEVEL='+WORK_LEVEL;
                jQuery("#gridTable").jqGrid({
                    datatype:"json",
                    mtype: 'POST',//注释掉此行可看到传递到后台的参数
                    url: url,
                    height: sizeArr.vHeight,
                    width: sizeArr.vWidth,
                    shrinkToFit: false, //用于控制列宽是否按比例进行计算
                    colModel:columns.fields,
                    //sortname:'BEGIN_TIME',
                    sortorder:'DESC',
                    viewrecords:true,
                    multiselect: true,
                    multiselectWidth: 30,
                    //multiboxonly: true,
                    subGridWidth: 30,
                    rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
                    rowList:[10,20,30,40,50,60,70,80,90,100],
                    onSelectRow:function(){
                        var run_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                        jQuery('#RUN_ID_STR').val(run_id_str);
                        if(run_id_str != "")
                        {
                            jQuery("#selected_query_export_form").css("display","inline");
                            jQuery("#query_export").css("display","none");
                        }
                        else
                        {
                            jQuery("#selected_query_export_form").css("display","none");
                            jQuery("#query_export").css("display","");
                        }
                    },
                    onSelectAll:function(){
                        var run_id_str = jQuery("#gridTable").jqGrid('getGridParam', 'selarrrow');
                        jQuery('#RUN_ID_STR').val(run_id_str);
                        if(run_id_str != "")
                        {
                            jQuery("#selected_query_export_form").css("display","inline");
                            jQuery("#query_export").css("display","none");
                        }
                        else
                        {
                            jQuery("#selected_query_export_form").css("display","none");
                            jQuery("#query_export").css("display","");
                        }
                    },
                    pager:"#pager",
                    loadComplete:function(xhr){
                        //jQuery("tr[role='rowheader']").find("th:eq(1)").css({"text-align":"left"});
                        //jQuery("tr[role='rowheader']").find("th:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
                        //jQuery("tr[role='row']").find("td:eq(0)").css({"border-right":"1px solid transparent","text-align":"right"});
                        jQuery("td[aria-describedby=gridTable_OPERATION]").removeAttr("title");
                        jQuery('#RUN_ID_STR').val('');
                        jQuery('#THE_FLOW_ID').val(FLOW_ID);
                        jQuery("#selected_query_export_form").css("display","none");
                        jQuery("#query_export").css("display","");
                        jQuery("#gridTable").find("tr:even").addClass("alt");
                        jQuery("#gridTable").addClass("word_wrap");
                        jQuery('#current_page').html(jQuery(this).getGridParam("page"));
                        jQuery('#gopage_url').val(jQuery(this).getGridParam("url"));
                        jQuery('#gopage').val(jQuery(this).getGridParam("page"));
                        jQuery('#total_page').html(jQuery('#sp_1_pager').html());
                        jQuery('#total_records').html(jQuery(this).getGridParam("records"));
                        jQuery("select.ui-pg-selbox").change(function(){
                            jQuery.cookie(cookieName+"_perpage",jQuery(this).val(),{expires:30});
                        });
                        jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').css({
                            "display":"inline-block",
                            "margin-left": "4px",
                            "cursor":"pointer"
                        });
                        if(jQuery(this).getGridParam("records") == 0)
                        {
                            jQuery("#sorry").attr({style: "margin-top:55px;display:block" });
                            jQuery("#gridTable").jqGrid('setGridHeight',0);
                        }else{
                            sizeArr = getLogGridTableSize();
                            jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
                            jQuery("#sorry").css('display', 'none');
                        }
                        jQuery("td[aria-describedby$='create_time'],td[aria-describedby$='prcs_name'],td[aria-describedby$='prcs_time']").find('.ui-icon').click(function(){
                            var detail_block = jQuery(this).parent().find('.detail-block');
                            if(detail_block.css('display') == "block"){
                                detail_block.css('display', 'none');
                                jQuery(this).removeClass("ui-icon-minus");
                                jQuery(this).addClass("ui-icon-plus");
                            }else{
                                detail_block.css('display','block');
                                jQuery(this).removeClass("ui-icon-plus");
                                jQuery(this).addClass("ui-icon-minus");
                            }
                            return false;
                        });
                        loadPager();
                    },
                    resizeStop:function(newWidth, index){
                        var colName = jQuery("#gridTable").getGridParam('colModel')[index].name;
                        jQuery.cookie(cookieName+"_"+colName+"_width",newWidth,{expires:30});
                    }
                });
            });
    }

    jQuery('#flow_name').typeahead({
        source: function (query, process) {
            return jQuery.get('/general/workflow/list/data/getflow.php', { query: query }, function (data) {
                if(data.options.length == 0){
                    jQuery('#flow_id').attr('value', "-1");    
                }
                var resultList = jQuery(data.options).map(function (item) {
                    var aItem = { id: data.options[item].flow_id, name: data.options[item].flow_name, sort_name: data.options[item].flow_sort_name};
                    return JSON.stringify(aItem);
                });
                return process(resultList);
            });
        },
        minLength : 1,
        items:10000000,
        highlighter: function (obj) {
            var item = JSON.parse(obj);
            var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
            return item.sort_name+"<span class='flow-name-span'>&nbsp;</span>"+item.name.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                return '<strong>' + match + '</strong>'
            })
        },
        updater: function (obj) {
            var item = JSON.parse(obj);
            jQuery('#flow_id').attr('value', item.id);
            return item.name;
        }
    });
    jQuery(document).on('keydown', '#search_para', function(e){
        if(e.keyCode == 13){
           jQuery('#normalSearchBtn').click();
        }    
    });
    jQuery(document).on('keydown', '#flow_name,#run_name', function(e){
        if(e.keyCode == 13){
            if(jQuery(this).id == 'flow_name' && jQuery('#flow_id').val() == ""){
                return false;
            }
           jQuery('#advSearchBtn').click();
        }    
    });
    jQuery(window).resize((function(t1, t2){
        //防止短时间内多次触发resize，xp ie8精灵会卡死
        return function(){
            t1 && clearTimeout(t1);
            t2 && clearTimeout(t2);
            t1 = setTimeout(setTimeoutgetGridTableSize, 300); 
            t2 = setTimeout(setTimeoutgetGridTableSize, 600);
            //用两个定时器是因为精灵调整大小的api，在调整窗口的过程中就可能触发resize事件，而不是调整结束后
        }        
    })());
});

//JS延迟算宽高
function setTimeoutgetGridTableSize()
{
    var sizeArr = getLogGridTableSize();
    if(jQuery("#gridTable").getGridParam("records") == 0)
    {
        //jQuery("#gridTable").jqGrid('setGridHeight',0);
    }else{
        jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
        jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
    }
}

function check_form()
{
    var FLOW_ID        = jQuery("#FLOW_ID").val();
    jQuery("#do_query_flow_id").val(FLOW_ID); //yzx to remeber the flow_id of query done
//    var BEGIN_TIME    = jQuery("#begin_time").val();
//    var END_TIME     = jQuery("#end_time").val();
//    var FLOW_STATUS    = jQuery("select[name='FLOW_STATUS']").val();
//    var RUN_ID        = jQuery("input[name='RUN_ID']").val()==''?'':jQuery("input[name='RUN_ID']").val();
//    var RUN_NAME    = jQuery("#run_name").val()==''?'':jQuery("#run_name").val();
//    var FLOW_QUERY_TYPE = jQuery("select[name='FLOW_QUERY_TYPE']").val()==''?'':jQuery("select[name='FLOW_QUERY_TYPE']").val();
//    var TO_ID        = jQuery("input[name='TO_ID']").val()==''?'':jQuery("input[name='TO_ID']").val();    
//    var url = 'data/getdata.php?pageType='+pageType+'&FLOW_ID='+FLOW_ID+'&BEGIN_TIME='+BEGIN_TIME+'&END_TIME='+END_TIME+'&RUN_ID='+RUN_ID+'&FLOW_STATUS='+FLOW_STATUS+'&RUN_NAME='+RUN_NAME+'&FLOW_QUERY_TYPE='+FLOW_QUERY_TYPE+'&TO_ID='+TO_ID;
    if(FLOW_ID != "all" && FLOW_ID != "")
    {
        jQuery("#query_excel").show();
        jQuery("#query_zip").show();
    }else{
        jQuery("#query_excel").hide();
        jQuery("#query_zip").hide();
    }   
    
}

function set_user()
{
    var SET_USER = document.getElementById("SET_USER");
    var query_export_area= jQuery("#query_export_area").val();
    if(document.form1.FLOW_QUERY_TYPE.value==6 || document.form1.FLOW_QUERY_TYPE.value==8){
        SET_USER.style.display="inline";
    }else{
        SET_USER.style.display="none";
    }
    if(query_export_area == 6 || query_export_area == 8)
    {
        jQuery("#div_exp_user_called").css("display","inline");
    }else{
        jQuery("#div_exp_user_called").css("display","none");
    }
}
//强制结束
function enforcement_end_run()
{
    var runIdStr="";
    var flowIdStr="";
    var beginDeptStr="";
    var rowid=jQuery("#gridTable").jqGrid('getGridParam','selarrrow');
    if(rowid == "" || rowid == "undefined")
    {
        alert(td_lang.general.workflow.msg_56);
        return false
    }
    jQuery("#gridTable").find('tr').each(function(){
        var runId = jQuery(this).find("td[aria-describedby='gridTable_RUN_ID']").html();
        if(jQuery("#jqg_gridTable_"+runId).is(":checked"))
        {
            
            var flowId = jQuery("#FLOW_ID_"+runId).val();
            var beginDept = jQuery("#BEGIN_DEPT_"+runId).val();
            runIdStr+=runId+",";
            flowIdStr+=flowId+",";
            beginDeptStr+=beginDept+",";
        }
    });
    var msg=td_lang.general.workflow.msg_9;
    if(window.confirm(msg))
    {
        jQuery.get("/module/workflow/engine/verify_end_work.php",{"RUN_ID_STR":runIdStr,"FLOW_ID":flowIdStr,"BEGIN_DEPT":beginDeptStr},function(data)
        {    
            jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
            if(data != "ALL"){
                alert(sprintf(td_lang.system.workflow.msg_39,data));
            }      
        });
    }
}
//管理员强制删除
function delete_run_sel()
{
    var runIdStr="";
    var flowIdStr="";
    var beginDeptStr="";
    var rowid=jQuery("#gridTable").jqGrid('getGridParam','selarrrow');
    if(rowid == "" || rowid == "undefined")
    {
        alert(td_lang.general.workflow.msg_56);
        return false
    }
    jQuery("#gridTable").find('tr').each(function(){
        var runId = jQuery(this).find("td[aria-describedby='gridTable_RUN_ID']").html();
        if(jQuery("#jqg_gridTable_"+runId).is(":checked"))
        {
            
            var flowId = jQuery("#FLOW_ID_"+runId).val();
            var beginDept = jQuery("#BEGIN_DEPT_"+runId).val();
            runIdStr+=runId+",";
            flowIdStr+=flowId+",";
            beginDeptStr+=beginDept+",";
        }
    });
    var msg=td_lang.general.workflow.msg_6;
    if(window.confirm(msg))
    {
        jQuery.get("/module/workflow/engine/delete_work.php",{"RUN_ID_STR":runIdStr,"FLOW_ID":flowIdStr,"BEGIN_DEPT":beginDeptStr},function(data)
        {    
            jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
            if(data != "ALL"){
                alert(sprintf(td_lang.system.workflow.msg_40,data));
            }   
        });
    }
}
//导出excel
function export_run_sel()
{
    var runId=jQuery("#gridTable").jqGrid('getGridParam','selarrrow');
    if(runId == "" || runId == "undefined")
    {
        alert(td_lang.general.workflow.msg_56);
        return false;
    }
    window.location="excel_data.php?FLOW_ID="+jQuery("#do_query_flow_id").val()+"&RUN_ID_STR="+runId; //yzx
    
}
//导出ZIP
function zip_run_sel()
{
    var runId=jQuery("#gridTable").jqGrid('getGridParam','selarrrow');
    if(runId == "" || runId == "undefined")
    {
        alert(td_lang.general.workflow.msg_56);
        return false
    }
    window.location="export_zip.php?RUN_ID_STR="+runId;

}