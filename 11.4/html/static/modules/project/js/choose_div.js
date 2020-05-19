//��ѡ��ѡ����һ��
jQuery(function()
{
    //��������
    var arr=new Array();
    arr["proj_attribute"] = td_lang.general.project.guide.attribute;
    arr["proj_user"] = td_lang.general.project.guide.user;
    arr["proj_task"] = td_lang.general.project.guide.task;
    arr["proj_file_sort"] = td_lang.general.project.guide.file_sort;
    arr["proj_diy"] = td_lang.general.project.guide.diy;
    arr["proj_approve"] = td_lang.general.project.guide.approve;
    //ѡ�������һ������¼�
    jQuery("#select_next").click(function()
    {
        jQuery(".welcome").hide();
        var left_html = '';
        
        //ѭ����ѡ��
        jQuery("input[name='ck']").each(function()
        {
            //��ȡ��ǰvalue
            var value = jQuery(this).val();
            //ɾ��û��ѡ�е�div
            if(this.checked == false)
            {            
                jQuery("#_"+value).remove();
            }
            //��ʾѡ�еĵ���
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
        // ��ȡʱ��ڵ�
        var start_time = jQuery("#PROJ_START_TIME").val().replace(/-/g,"/");
        var end_time = jQuery("#PROJ_END_TIME").val().replace(/-/g,"/");
        var starttime = new Date(start_time);//���ص���ʱ��ڵ�
        var endtime = new Date(end_time);
        
        //�������Էǿ���֤
        if(jQuery.trim(jQuery("#PROJ_NUM").val())=="")
        {
            alert('��Ŀ��Ų���Ϊ�գ�');
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
            alert('��Ŀ���Ͳ���Ϊ�գ�');
             return (false);
        }
        if(jQuery.trim(jQuery("#PROJ_NAME").val())=="")
        {
            alert('��Ŀ���Ʋ���Ϊ�գ�');
             return (false);
        }
        if(jQuery.trim(jQuery("#PROJ_START_TIME").val())=="" || jQuery.trim(jQuery("#PROJ_END_TIME").val())=="")
        {
            alert('��Ŀ���ڲ���Ϊ�գ�');
             return (false);
        }
        if(endtime < starttime)
        { 
            alert("��Ŀ�ƻ����ڵĽ���ʱ�䲻��С�ڿ�ʼʱ�䣡");
            return (false);
        }
       /* if(jQuery.trim(jQuery("#PROJ_NUM").val())=="" || jQuery("#USER_CUST_DEFINE").val()=="choose" || jQuery.trim(jQuery("#PROJ_NAME").val())=="" || jQuery.trim(jQuery("#PROJ_START_TIME").val())=="" || jQuery.trim(jQuery("#PROJ_END_TIME").val())=="")
        {
            alert(td_lang.general.project.guide.no_null);//������Ŀ����Ϊ��
           return (false);
        }
        else if(endtime < starttime)
        { 
            alert(td_lang.general.project.guide.time);//��Ŀ�ƻ����ڵĽ���ʱ�䲻��С�ڿ�ʼʱ�䣡
            return (false);
        }
        */
        //��ϵ�˷ǿ���֤
        if(jQuery.trim(jQuery("#PROJ_OWNER").val())=="" || jQuery.trim(jQuery("#PROJ_LEADER").val())=="")
        {
            alert(td_lang.general.project.guide.no_null);//������Ŀ����Ϊ��
            return (false);
        }
        //����ǿ���֤
        var task_start_time = jQuery("#TASK_START_TIME").val().replace(/-/g,"/");
        var task_end_time = jQuery("#TASK_END_TIME").val().replace(/-/g,"/");
        var start_time_task = new Date(task_start_time);//���ص���ʱ��ڵ�
        var end_time_task = new Date(task_end_time);
        if(jQuery.trim(jQuery("#TASK_NO").val())=="" || jQuery.trim(jQuery("#TASK_NAME").val())=="" || jQuery.trim(jQuery("#TASK_USER").val())=="" || jQuery.trim(jQuery("#TASK_START_TIME").val())=="" || jQuery.trim(jQuery("#TASK_END_TIME").val())=="")
        {
            alert(td_lang.general.project.guide.no_null);//������Ŀ����Ϊ��
            return (false);
        }
        else if(end_time_task < start_time_task)
        { 
            alert(td_lang.general.project.guide.time);//��Ŀ�ƻ����ڵĽ���ʱ�䲻��С�ڿ�ʼʱ�䣡
            return (false);
        }
        if(jQuery.trim(jQuery("#SORT_NO").val())=="" || jQuery.trim(jQuery("#SORT_NAME").val())=="" )
        {
            alert(td_lang.general.project.guide.no_null);//������Ŀ����Ϊ��
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
    //������Ϣ,������ѡ��
    jQuery("#_new, #_approve").click(function()
    {
        this.checked =!this.checked;
    });
    //Ԥ�����
    jQuery("#budget_add").click(function(){
        jQuery("#budget_hide_div").show();
    });
    //Ԥ��ȡ��
    jQuery("#budget_delete").click(function()
    {
        jQuery("input[style='count']").val("");
        jQuery("#total").val(0.00);
        jQuery("#budget_hide_div").hide();
    });
    //Ԥ�㱣��
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
                    alert(td_lang.general.project.guide.number);//��������Ч����
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
  //ȫѡ
    jQuery("#check_all").click(function()
    {
        jQuery("input[name='ck']").each(function()
        {
            this.checked = true;
        });
    });
    //ȡ��ȫѡ
    jQuery("#check_reset").click(function()
    {
       jQuery("input[name='ck']").removeAttr("checked");  
    });
    //�ƶ������ʾ����
    jQuery(".table-hover").find("label").mouseenter(function()
    {
        var thislabel = jQuery(".table-hover").find("label").index(this) + 1;
        jQuery(".describe").children("div").hide().eq(thislabel).show();
    });
    
});