jQuery(document).ready(function(){
    var sizeArr = getLogGridTableSize();

     var MENU_FLOW_ID = jQuery('#MENU_FLOW_ID').val();
     $.getJSON("/general/workflow/get_flow_list.inc.php",{"FLOW_ID":MENU_FLOW_ID,"action":1,"root":true},function(jsonData){
        $("#FLOW_ID").html("");
        $.each(jsonData,function(i,t){
            $("#FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
            //$("#DEL_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
            $("#EXP_FLOW_ID").append('<option value="'+t.value+'" category="'+t.category+'" node="'+t.node+'" '+t.selected+' level="'+t.level+'">'+t.txt+'</option>');
        });
        $("#FLOW_ID").combobox();
        //$("#DEL_FLOW_ID").combobox();
        $("#EXP_FLOW_ID").combobox();

    });
    jQuery(document).on("click", '#queryBtn', function(){
        var FLOW_ID = jQuery("#FLOW_ID").val();
        
        var USER_TYPE = jQuery("select[name='USER_TYPE']").val()==''?'':jQuery("select[name='USER_TYPE']").val();
        var TO_ID = jQuery("input[name='TO_ID']").val()==''?'':jQuery("input[name='TO_ID']").val();
        var RUN_ID = jQuery("input[name='RUN_ID']").val()==''?'':jQuery("input[name='RUN_ID']").val();
        var RUN_NAME = jQuery("input[name='RUN_NAME']").val()==''?'':jQuery("input[name='RUN_NAME']").val();
        var WORK_LEVEL     = jQuery("#work_level").val();
        var url = 'data/getdata.php?FLOW_ID='+FLOW_ID+'&USER_TYPE='+USER_TYPE+'&TO_ID='+TO_ID+'&RUN_ID='+RUN_ID+'&RUN_NAME='+RUN_NAME+'&pageType='+pageType+'&WORK_LEVEL='+WORK_LEVEL;
        jQuery("#gridTable").jqGrid('setGridParam',{
            url:url,
            page:1
        }).trigger('reloadGrid');
      //设置催办按钮是否显示 王瑞杰 20140421
        if($('.TIME_OUT_USER').length > 0){
            $('#smsBtn').show();
        }else{
            $('#smsBtn').hide();
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
    
    //工作监控中转交
    jQuery(document).on('click', '.users-add', function(){
        var prcs_next = jQuery(this).attr('prcs_next');
        var gather_node_have_flag = jQuery(this).attr('gather_node_have_flag');
        var free_prcs = jQuery(this).attr('prcs_type') == 'free';
        var prcs_back = jQuery(this).attr('prcs_back'); //子流程返回父流程步骤
        
        if(gather_node_have_flag === '1'){
            alert(td_lang.general.workflow.msg_247);
            return false;
        }
        if(prcs_next){
            var prcs_next_id = free_prcs ? '' : prcs_next;
            urlStr="../list/turn/user_select/?FLOW_ID="+flow_id+"&RUN_ID="+run_id+"&PRCS_ID="+prcs_id+"&PRCS_ID_NEXT="+prcs_next_id+"&LINE_COUNT="+prcs_next + "&PRCS_BACK=" + prcs_back + "&IS_MANAGE=IS_MANAGE" + "&PRCS_KEY_ID=" + prcs_key_id;
            loc_x=220;
            loc_y=200;
            if(is_ie){
                loc_x=document.body.scrollLeft+event.clientX-event.offsetX-220;
                loc_y=document.body.scrollTop+event.clientY-event.offsetY;
            }
            LoadDialogWindow(urlStr,self,loc_x, loc_y, 380, 350);
        }
    });
    jQuery(document).on('click', '#others-add', function() {
        urlStr = "../list/turn/user_select/?FLOW_ID=" + flow_id + "&RUN_ID=" + run_id + "&REMINDE_FLAG=1";
        loc_x = 220;
        loc_y = 200;
        if (is_ie) {
            loc_x = document.body.scrollLeft + event.clientX - event.offsetX - 220;
            loc_y = document.body.scrollTop + event.clientY - event.offsetY;
        }
        LoadDialogWindow(urlStr, self, loc_x, loc_y, 380, 350);
    });
    //向以下人员发送事务提醒消息
    jQuery(document).on('click', '.work-msg-title', function(){
        var img_src = jQuery('#msg-control>img').attr('src');
        var img_src_arr = img_src.split('/');
        var pic_name = img_src_arr[img_src_arr.length -1 ];
        if(pic_name == 'unfold.png'){
            jQuery('#msg-control>img').attr('src', img_src.replace('unfold.png', 'fold.png'));
        }else{
            jQuery('#msg-control>img').attr('src', img_src.replace('fold.png', 'unfold.png'));
        }
        jQuery('#work-msg-content').toggle();
    });
    jQuery(document).on('click', '#all_check', function(){
        var $this = jQuery(this);
        if(this.className.match(/disable/)){
            return;
        }
        //全选
        if(!this.className.match(/active/)){
            jQuery("li[id^='next_prcs_']").each(function(i, v){
                if((!jQuery(v).hasClass('active')) && jQuery(v).attr('id') != 'next_prcs_0' && sync_deal == 1){
                    jQuery(v).trigger('click');
                }
            });
            $this.addClass('active');
        //全消
        }else{
            jQuery("li[id^='next_prcs_'][class*='active']").each(function(i, v){
                if(jQuery(v).attr('id') != 'next_prcs_0' && sync_deal == 1){
                    jQuery(v).trigger('click');
                }
            });
            $this.removeClass('active');
        }
    });
    jQuery(document).on('click', '.sms-check', function(){
        jQuery(this).toggleClass('sms-bg-static');
    });
    jQuery(document).on('click', '.email-check', function(){
        jQuery(this).toggleClass('email-bg-static');
    });
    jQuery(document).on('click', '.mobile-check', function(){
        jQuery(this).toggleClass('mobile-bg-static');
    });
    
    //转交操作
    jQuery('#work_run_form_submit').on('click', function(){ // 工作转交下一步的确认操作
    
        // 用户自定义js脚本执行程序
        var beforeCustomScript = jQuery("#turnBeforeCustomScript").val();
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
    
        if (typeof turn_submit_flag == 'undefined') {
            jQuery(this).next().trigger('click');
            return false;
        }

        if (flow_type == 2)
        {
            //save_free_prcs.call(this);
            var $nextPrcs = jQuery('#workFreeNextPrcs');
            var chose_obj = jQuery(window.frames["work_form_data"].document).find('#PRCS_CHOOSE');
            var freePrcsData = window.freePrcsSelector.serialize();

            if (freePrcsData === false) {
                return false;
            } else {
                var $freeInput = jQuery(window.frames["work_form_data"].document).find('#freePrcsData');
                if (!$freeInput.size()) {
                    $freeInput = jQuery('<input type="hidden">').attr({
                        id: 'freePrcsData',
                        name: 'freePrcsDataName'
                    });
                    $freeInput.appendTo(jQuery(window.frames["work_form_data"].document).find('form[name="form1"]'));
                }
                $freeInput.val(JSON.stringify(freePrcsData));
            }

            try {
                var next_prcs = prcs_id + 1;
                var flow_prcs = window['flow_type'];
                if (jQuery('#PRCS_USER' + flow_prcs).val() == '') {
                    throw td_lang.general.workflow.msg_245;
                    return false;
                }
                if (jQuery('#TOP_FLAG' + flow_prcs).val() === '0' && jQuery('#PRCS_OP_USER' + flow_prcs).val() == '') {
                    throw td_lang.general.workflow.msg_244;
                    return false;
                }
                chose_obj.val(next_prcs);
                jQuery(window.frames["work_form_data"].document).find('#next_prcs_num').val(next_prcs);
                if(!confirm(td_lang.general.workflow.msg_266)){
                    return false;
                }
            } catch (e) {
                alert(e);
                return false;
            }
        }
        else
        {

            if(jQuery("li[id^='next_prcs_'][class*='active']").length == 0){
                alert(td_lang.general.workflow.msg_249);
                return false;
            }
            if((jQuery("li[id^='next_prcs_'][class*='active']").length != jQuery("#work-next-prcs-block").find('li').length)){
                if(jQuery("li[id^='next_prcs_'][class*='active']").length == 1 && jQuery("li[id^='next_prcs_'][class*='active']").attr('id') == 'next_prcs_0'){
                    if(!confirm(td_lang.general.workflow.msg_250)){
                        return false;
                    }
                }else{
                    alert(td_lang.general.workflow.msg_244);
                    return false;
                }
            }

            var other_show_info = jQuery('#op_user_show_info').find('font[color="red"]').find('div[self_type="other"]');
            if(other_show_info.length > 0){
                var show_text = '';
                jQuery(other_show_info).each(function(i, v){
                    show_text += jQuery.trim(jQuery(v).html())+'，';
                });
                if(show_text != ''){
                    show_text = show_text.substr(0, (show_text.length-1));
                }
                if(!confirm(sprintf(td_lang.general.workflow.msg_266, show_text))){
                    return false;
                }
            }
            var chose_obj = jQuery(window.frames["work_form_data"].document).find('#PRCS_CHOOSE');
            try{
                jQuery("li[id^='next_prcs_'][class*='active']").each(function(i, v){
                    var obj_choose_prcs = jQuery(v);
                    var flow_prcs = obj_choose_prcs.attr("id").substr(10);
                    if(jQuery('#PRCS_USER'+flow_prcs).val() == ''){
                        throw td_lang.general.workflow.msg_245;
                        return false;
                    }
                    if(jQuery('#TOP_FLAG'+flow_prcs).val() === '0' && jQuery('#PRCS_OP_USER'+flow_prcs).val() == ''){
                        throw td_lang.general.workflow.msg_244;
                        return false;
                    }
                    if(obj_choose_prcs.attr("id") === "next_prcs_0"){
                        chose_obj.val("");
                    }else{
                        chose_obj.val(chose_obj.val()+jQuery("li[id^='next_prcs_']").index(obj_choose_prcs)+",");
                    }
                    jQuery(window.frames["work_form_data"].document).find('#next_prcs_num').val(obj_choose_prcs.attr("id").substr(10));

                });
            }catch(e){
                alert(e);
                return false;
            }
            jQuery(this).attr("disabled", true);
            var s_prcs_to = "";
            jQuery('#workPrcsData').find("li[id^='next_prcs_']").each(function(){
                var a_prcs_id = jQuery(this).attr('id').split('_');
                if(a_prcs_id.length == 3){
                    var s_prcs_id = a_prcs_id[2];
                    if(s_prcs_id == "END"){
                        s_prcs_to += "0,";
                    }else{
                        s_prcs_to += s_prcs_id+",";
                    }
                }
            });
        }
        var info_str = "";
        jQuery('.work-msg-op-title').find('span').each(function() {
            if (jQuery(this).attr('class').indexOf('-bg-static') > 0) {
                info_str += '0,';
            } else {
                info_str += '1,';
            }
        });
        var RUN_PRCS_NAME = jQuery("#RUN_PRCS_NAME").val();
		// var next_prcs_id = "";
		// jQuery("li[id^='next_prcs_'][class*='active']").each(function(i,v){
			// if(jQuery(v).attr("notcheckprcs") == 0 && (jQuery(v).attr("the_before_step") !=1 || jQuery(v).attr("check_is_myself") ==1))
			// {
				// next_prcs_id += jQuery(v).attr("id").substr(10)+",";
			// }
		// });
        // jQuery(window.frames["work_form_data"].document).find("#next_prcs_id").val(next_prcs_id);
        jQuery(window.frames["work_form_data"].document).find("#info_str").val(info_str);
        jQuery(window.frames["work_form_data"].document).find("#PRCS_TO").val(s_prcs_to);
        jQuery(window.frames["work_form_data"].document).find("#RUN_PRCS_NAME").val(RUN_PRCS_NAME);
        $form1 = jQuery(window.frames["work_form_data"].document).find("form[name='form1']");
        jQuery('.users-select-block').find("input[type='hidden']").clone(true).appendTo($form1);
        if(jQuery('#SMS_CONTENT').length != 0)
        {
            jQuery('#SMS_CONTENT').clone(true).appendTo($form1);
        }
        jQuery('.prcs_settign_block').find("input[id^='TIME_OUT_']").clone(true).appendTo($form1);
        jQuery("#VIEW_USER_ID").clone(true).appendTo($form1);
        jQuery("#remind_others_id").clone(true).appendTo($form1);
        jQuery("input[name^='PLUGIN_']").clone(true).appendTo($form1);
        jQuery(window.frames["work_form_data"])[0].CheckForm('tok'); // 保存表单并转交 下一步

        //用户自定义js脚本执行程序
        var afterCustomScript = jQuery("#turnAfterCustomScript").val();
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
        
    });
    
//    jQuery(window).resize(function(){
//        var sizeArr = getLogGridTableSize();
//        jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
//        jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
//    });
    
    
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
            });
            var FLOW_ID = jQuery("#FLOW_ID").val() || MENU_FLOW_ID;
            var USER_TYPE = jQuery("select[name='USER_TYPE']").val()==''?'':jQuery("select[name='USER_TYPE']").val();
            var TO_ID = jQuery("input[name='TO_ID']").val()==''?'':jQuery("input[name='TO_ID']").val();
            var RUN_ID = jQuery("input[name='RUN_ID']").val()==''?'':jQuery("input[name='RUN_ID']").val();
            var RUN_NAME = jQuery("input[name='RUN_NAME']").val()==''?'':jQuery("input[name='RUN_NAME']").val();
            var WORK_LEVEL     = jQuery("#work_level").val();
            //var page    =    jQuery("#gridTable").getGridParam("page");
            //alert(page);
            var url = 'data/getdata.php?FLOW_ID='+FLOW_ID+'&USER_TYPE='+USER_TYPE+'&TO_ID='+encodeURI(TO_ID)+'&RUN_ID='+RUN_ID+'&RUN_NAME='+RUN_NAME+'&pageType='+pageType+'&WORK_LEVEL='+WORK_LEVEL;
            jQuery("#gridTable").jqGrid({
                datatype:"json",
                mtype: 'POST',//注释掉此行可看到传递到后台的参数
                url: url,
                height: sizeArr.vHeight,
                width: sizeArr.vWidth,
                multiselect: true,
                shrinkToFit: false, //用于控制列宽是否按比例进行计算
                colModel:columns.fields,
                //sortname:'RUN_ID',
                sortorder:'DESC',
                viewrecords:true,
                //multiselect: true,
                //multiselectWidth: 30,
                subGridWidth: 30,
                rowNum:jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10,
                rowList:[10,20,30,40,50,60,70,80,90,100],
                pager:"#pager",
                loadBeforeSend:function(xhr,settings){
                    var number = jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10;
                    number = parseInt(number)*10;
                    jQuery("#gridTable").setGridParam({rowNum:number});
                },
                loadComplete:function(xhr){
                    var number = jQuery.cookie(cookieName+"_perpage") ? jQuery.cookie(cookieName+"_perpage") : 10;
                    jQuery("#gridTable").setGridParam({rowNum:number});
                    var I = 0;
                    var key ;
                    jQuery("#gridTable").find('tr').each(function(){
                        I++;
                        if( I != 1)
                        {
                            key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
                            if(key%2 != 0)
                            {
                                jQuery(this).addClass("alt");
                            }
                        }
                    });
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
                    //设置催办按钮是否显示 王瑞杰 20140421
                    if($('.TIME_OUT_USER').length > 0){
                        $('#smsBtn').show();
                    }else{
                        $('#smsBtn').hide();
                    }
                    if(jQuery(this).getGridParam("records") == 0)
                    {
                        jQuery("#sorry").attr({style: "margin-top:55px;display:block" });
                        jQuery("#gridTable").jqGrid('setGridHeight',0);
                    }
                    else
                    {
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
                },
            });
        });
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
        jQuery("#gridTable").jqGrid('setGridHeight',0);
    }else{
        jQuery("#gridTable").jqGrid('setGridWidth',sizeArr.vWidth);
        jQuery("#gridTable").jqGrid('setGridHeight',sizeArr.vHeight);
    }
}
function collapse(flag)
{
    var I = 0;
    var key ;
    var K = 0;
    jQuery("#gridTable").find('tr').each(function(){
        I++;
        if( I != 1)
        {
            key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
            if(key == flag)
            {
                if(K == 0)
                {
                    var tdhtml = jQuery(this).find("td").eq(1).find("a").html();
                    if(typeof(tdhtml)!='undefined' && tdhtml.indexOf('icon-plus') !== -1)
                    {
                        jQuery(this).find("td").eq(1).find("a").html("<i class=\"icon-minus\"></i>");
                        jQuery(this).find("td").eq(1).find('a').attr('title', '点击收起');
                        collapse_show(flag);
                    }else{
                        jQuery(this).find("td").eq(1).find("a").html("<i class=\"icon-plus\"></i>");
                        jQuery(this).find("td").eq(1).find('a').attr('title', '点击展开');
                        collapse_hide(flag);
                    }
                }
                K++;
            }
        }
    });
}
function collapse_show(flag)
{
    //alert(flag);
    var I = 0;
    var key ;
    var K = 0;
    jQuery("#gridTable").find('tr').each(function(){
        I++;
        if( I != 1)
        {
            key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
            if(key == flag)
            {
                if(K != 0)
                {
                        jQuery(this).show();    
                }
                K++;
            }
        }
    });
}
function collapse_hide(flag)
{
    //alert(flag);
    var I = 0;
    var key ;
    var K = 0;
    jQuery("#gridTable").find('tr').each(function(){
        I++;
        if( I != 1)
        {
            key = jQuery(this).find("input[name='TR_ID']").attr("tr_id");
            if(key == flag)
            {
                if(K != 0)
                {
                        jQuery(this).hide();
                }
                K++;
            }
        }
    });
}
function work_run_restore_single_work(run_id, prcs_key_id){
    var url="/module/workflow/engine/re_pause_work.php?run_id_str="+run_id+"&prcs_key_id_str="+prcs_key_id;
    jQuery.get(url,{},function(data){
        alert(td_lang.general.workflow.msg_314);//工作已恢复
        jQuery("#gridTable").jqGrid('setGridParam', { serializeGridData : function(e){ e.connstatus = 1;  return e;} }).trigger('reloadGrid');
    });
}