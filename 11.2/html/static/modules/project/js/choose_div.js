//复选框选择下一步
jQuery(function()
{
    //定义数组
    var arr=new Array();
    arr["proj_attribute"] = td_lang.general.project.guide.attribute;
    arr["proj_user"] = td_lang.general.project.guide.user;
    arr["proj_task"] = td_lang.general.project.guide.task;
    arr["proj_file_sort"] = td_lang.general.project.guide.file_sort;
    arr["proj_diy"] = td_lang.general.project.guide.diy;
    arr["proj_approve"] = td_lang.general.project.guide.approve;
    //选择界面下一步点击事件
    jQuery("#select_next").click(function()
    {
        jQuery(".welcome").hide();
        var left_html = '';
        
        //循环复选框
        jQuery("input[name='ck']").each(function()
        {
            //获取当前value
            var value = jQuery(this).val();
            //删除没有选中的div
            if(this.checked == false)
            {            
                jQuery("#_"+value).remove();
            }
            //显示选中的导航
            if(this.checked)
            {
               left_html += "<li id='_"+value+"'><p class='"+value+"-1'></p>"+arr[value]+"</li>";
            }
        });
        left_html = '<li class="active" id="_proj_attribute"><p class="proj_attribute-1"></p>'+arr['proj_attribute']+'</li>' 
        + left_html
        + '<li id="_proj_approve"><p class="proj_approve-1"></p>'+arr['proj_approve']+'</li>';
        jQuery("#xmglbar").html(left_html);

            jQuery("#proj_select").hide();
            jQuery("#proj_attribute,#proj_left").show();
            jQuery("#select_next").hide();
            jQuery("#guide_next").show();
            //jQuery("#guide_prev").show();
            jQuery("#select_prev").show(); 
            
                if(jQuery("#_task").is(":checked") == true)
                {   
                    jQuery("#create_task").attr("name","CREATE_TASK"); 
                }
                
                if(jQuery("#_file_sort").is(":checked") == true)
                {   
                    jQuery("#create_file").attr("name","CREATE_FILE"); 
                }
        jQuery("#xmglbar").jScrollPane({"autoReinitialise": true});
    });
         
    jQuery("#select_prev").click(function(){
        jQuery("#proj_select").show();
        jQuery("#proj_attribute,#proj_left").hide();
        jQuery("#select_next").show();
        jQuery("#guide_next").hide();
        //jQuery("#guide_prev").show();
        jQuery("#select_prev").hide();
        jQuery(".welcome").show();
        jQuery("#xmglbar").jScrollPane().data().jsp.destroy();
    });
  
    function check()
    {
        // 获取时间节点
        var start_time = jQuery("#PROJ_START_TIME").val().replace(/-/g,"/");
        var end_time = jQuery("#PROJ_END_TIME").val().replace(/-/g,"/");
        var starttime = new Date(start_time);//返回的是时间节点
        var endtime = new Date(end_time);
        
        //基本属性非空验证
        if(jQuery.trim(jQuery("#PROJ_NUM").val())=="")
        {
            alert('项目编号不能为空！');
             return (false);
        }else
        {
            var PROJ_NUM = jQuery("#PROJ_NUM").val();
            var status1 = 0;
            jQuery.ajax({
                async:false,
                type: 'GET',
                url:'check_proj_no.php',
                data:{
                    PROJ_NUM:PROJ_NUM
                    },
                success: function(d){
                    if(d!="OK")
                    {
                        status1 = 1;
                        alert(d);    
                    }
                }
            });
            if(status1==1)
            {
                return false;
            }
        }
        if(jQuery("#USER_CUST_DEFINE").val()==null)
        {
            alert('项目类型不能为空！');
             return (false);
        }
        if(jQuery.trim(jQuery("#PROJ_NAME").val())=="")
        {
            alert('项目名称不能为空！');
             return (false);
        }
        if(jQuery.trim(jQuery("#PROJ_START_TIME").val())=="" || jQuery.trim(jQuery("#PROJ_END_TIME").val())=="")
        {
            alert('项目周期不能为空！');
             return (false);
        }
        if(endtime < starttime)
        { 
            alert("项目计划周期的结束时间不能小于开始时间！");
            return (false);
        }
       /* if(jQuery.trim(jQuery("#PROJ_NUM").val())=="" || jQuery("#USER_CUST_DEFINE").val()=="choose" || jQuery.trim(jQuery("#PROJ_NAME").val())=="" || jQuery.trim(jQuery("#PROJ_START_TIME").val())=="" || jQuery.trim(jQuery("#PROJ_END_TIME").val())=="")
        {
            alert(td_lang.general.project.guide.no_null);//必填项目不能为空
           return (false);
        }
        else if(endtime < starttime)
        { 
            alert(td_lang.general.project.guide.time);//项目计划周期的结束时间不能小于开始时间！
            return (false);
        }
        */
        //干系人非空验证
        if(jQuery.trim(jQuery("#PROJ_OWNER").val())=="" || jQuery.trim(jQuery("#PROJ_LEADER").val())=="")
        {
            alert(td_lang.general.project.guide.no_null);//必填项目不能为空
            return (false);
        }
        //任务非空验证
        var task_start_time = jQuery("#TASK_START_TIME").val().replace(/-/g,"/");
        var task_end_time = jQuery("#TASK_END_TIME").val().replace(/-/g,"/");
        var start_time_task = new Date(task_start_time);//返回的是时间节点
        var end_time_task = new Date(task_end_time);
        if(jQuery.trim(jQuery("#TASK_NO").val())=="" || jQuery.trim(jQuery("#TASK_NAME").val())=="" || jQuery.trim(jQuery("#TASK_USER").val())=="" || jQuery.trim(jQuery("#TASK_START_TIME").val())=="" || jQuery.trim(jQuery("#TASK_END_TIME").val())=="")
        {
            alert(td_lang.general.project.guide.no_null);//必填项目不能为空
            return (false);
        }
        else if(end_time_task < start_time_task)
        { 
            alert(td_lang.general.project.guide.time);//项目计划周期的结束时间不能小于开始时间！
            return (false);
        }
        if(jQuery.trim(jQuery("#SORT_NO").val())=="" || jQuery.trim(jQuery("#SORT_NAME").val())=="" )
        {
            alert(td_lang.general.project.guide.no_null);//必填项目不能为空
            return (false);
        }
        return (true);
    }
    jQuery("#guide_next").click(function()
    { 
        if(check())
        {
            var jQuerynow_active = jQuery("li[id^='_proj'].active").attr("id");
            var jQuerynow_guide = "#proj_"+jQuerynow_active.substr(6);
            var jQuerynext_guide = "#proj_"+jQuery("#"+jQuerynow_active).next("li").attr("id").substr(6);
            
            jQuery(jQuerynow_guide).hide();
            jQuery(jQuerynext_guide).show();
            
            jQuery("#"+jQuerynow_active).attr("class","");
            jQuery("#"+jQuerynow_active).next().attr("class","active");
            
            if(jQuery("#"+jQuerynow_active).next("li").attr("id") == "_proj_approve")
            {
                jQuery("#guide_next").hide();
                jQuery("#sure_approve").show();
                jQuery("#sure_proj").show();
            }
            if(jQuerynow_active == "_proj_attribute")
            {
                jQuery("#guide_prev").show();
                jQuery("#select_prev").hide(); 
            }
        }
        
    });

    jQuery("#guide_prev").click(function()
    {
        if(check())
        {
            var jQuerynow_active = jQuery("li[id^='_proj'].active").attr("id");
            var jQuerynow_guide = "#proj_"+jQuerynow_active.substr(6);
            var jQueryprev_guide = "#proj_"+jQuery("#"+jQuerynow_active).prev("li").attr("id").substr(6);
            jQuery(jQuerynow_guide).hide();
            jQuery(jQueryprev_guide).show();
            jQuery("#"+jQuerynow_active).attr("class","");
            jQuery("#"+jQuerynow_active).prev().attr("class","active");
            
            if(jQuery("#"+jQuerynow_active).prev("li").attr("id") == "_proj_attribute")
            {
                jQuery("#guide_prev").hide();   
                jQuery("#select_prev").show();   
            }
            if(jQuerynow_active == "_proj_approve")
            {
                jQuery("#sure_approve").hide();
                jQuery("#sure_proj").hide();
                jQuery("#guide_next").show();
            }
        }
    });
    //基本信息,审批必选的
    jQuery("#_new, #_approve").click(function()
    {
        this.checked =!this.checked;
    });
    //预算添加
    jQuery("#budget_add").click(function(){
        jQuery("#budget_hide_div").show();
    });
    //预算取消
    jQuery("#budget_delete").click(function()
    {
        jQuery("input[style='count']").val("");
        jQuery("#total").val(0.00);
        jQuery("#budget_hide_div").hide();
    });
    //预算保存
    jQuery("#budget_save").click(function()
    { 
        var total = 0.00;
        var flag = true; 
        jQuery(".budget-amount").each(function()
        {   
            if(jQuery.trim(jQuery(this).val()) != "")
            {   
                if(!isNaN(jQuery(this).val()))
                {   
                    total += parseFloat(jQuery.trim(jQuery(this).val()));
                    flag = true;
                }
                else
                {
                    alert(td_lang.general.project.guide.number);//请输入有效数字
                    flag = false;
                    return false;
                }  
            }
        });
        if(flag)
        {
            jQuery("#total").val(total);
            jQuery("#budget_hide_div").hide();
        }
    });
  //全选
    jQuery("#check_all").click(function()
    {
        jQuery("input[name='ck']").each(function()
        {
            this.checked = true;
        });
    });
    //取消全选
    jQuery("#check_reset").click(function()
    {
       jQuery("input[name='ck']").removeAttr("checked");  
    });
    //移动鼠标显示描述
    jQuery(".table-hover").find("label").mouseenter(function()
    {
        var thislabel = jQuery(".table-hover").find("label").index(this) + 1;
        jQuery(".describe").children("div").hide().eq(thislabel).show();
    });
    
});