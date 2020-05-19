jQuery(document).ready(function(){
    onLoadListItem();
    var rid = jQuery('#rid').val(); //新建权限操作
    jQuery("#add_priv").click(function(){
        var add_rid = jQuery('#add_rid').val();
        var select_range = jQuery('#ADD_DEPT').val();
        var add_dept = jQuery('#ADD_TO_ID').val();
        var add_user = jQuery('#ADD_COPY_TO_ID').val();
        if(checkFormUser() == true)
        {
            if(select_range == "OTHER")
            {
                if(checkFormDept() == true)
                {
                    jQuery.ajax(
                        {
                            type: "POST",
                            url: "data/add.php",
                            data: {"ADD_RID": add_rid, "ADD_DEPT": add_dept, "ADD_USER": add_user, "RANGE": select_range},
                            success: function(){
                                ClearUser('ADD_TO_ID', 'ADD_TO_NAME');
                                ClearUser('ADD_COPY_TO_ID', 'ADD_COPY_TO_NAME');
                                jQuery('#ADD_DEPT').find("option[id='ALL_DEPT']").attr({"selected":"selected"});
                                jQuery("#dept_title").css("display", "none");
                                jQuery("#dept_content").css("display", "none");
                                jQuery('#hide_window_close').click();
                                jQuery("#form_tab_infos").load("list.php?rid="+rid+"",function(){});
                            },
                        }
                    );
                }
            }else
            {
                jQuery.ajax(
                    {
                        type: "POST",
                        url: "data/add.php",
                        data: {"ADD_RID": add_rid, "ADD_USER": add_user, "RANGE": select_range},
                        success: function(){
                            ClearUser('ADD_TO_ID', 'ADD_TO_NAME');
                            ClearUser('ADD_COPY_TO_ID', 'ADD_COPY_TO_NAME');
                            jQuery('#ADD_DEPT').find("option[id='ALL_DEPT']").attr({"selected":"selected"});
                            jQuery('#hide_window_close').click();
                            jQuery("#form_tab_infos").load("list.php?rid="+rid+"",function(){});
                        },
                    }
                );
            }
        }
    });
    //编辑权限操作
    jQuery("#edit_priv").click(function(){
        var edit_pid = jQuery('#edit_pid').val();
        var edit_rid = jQuery('#edit_rid').val();
        var select_range = jQuery('#EDIT_DEPT').val();
        var edit_dept = jQuery('#EDIT_TO_ID').val();
        var edit_user = jQuery('#EDIT_COPY_TO_ID').val();
        if(checkEditFormUser() == true)
        {
            if(select_range == "EDIT_OTHER")
            {
                if(checkEditFormDept() == true)
                {
                    jQuery.ajax(
                        {
                            type: "POST",
                            url: "data/update.php",
                            data: {"EDIT_PID": edit_pid, "EDIT_RID": edit_rid, "EDIT_DEPT": edit_dept, "EDIT_USER": edit_user, "RANGE": select_range},
                            success: function(){
                                jQuery('#edit_hide_window_close').click();
                                jQuery("#form_tab_infos").load("list.php?rid="+rid+"",function(){});
                            },
                        }
                    );
                }
            }else
            {
                jQuery.ajax(
                    {
                        type: "POST",
                        url: "data/update.php",
                        data: {"EDIT_PID": edit_pid, "EDIT_RID": edit_rid, "EDIT_USER": edit_user, "RANGE": select_range},
                        success: function(){
                            jQuery('#edit_hide_window_close').click();
                            jQuery("#form_tab_infos").load("list.php?rid="+rid+"",function(){}); 
                        },
                    }
                );
            }
        }
    });
});
//添加权限
function add_authority(){
    open_bootcss_modal("div_authority","600","5");//修改窗口大小
    jQuery('#div_authority_body').load();
}
//编辑权限
function edit_authority(pid,rid,dept_id,dept_str,user_id,user_str)
{
    jQuery('#edit_pid').val(pid);
    jQuery('#edit_rid').val(rid);
    jQuery('#EDIT_TO_ID').val(dept_id);
    jQuery('#EDIT_TO_NAME').val(dept_str);
    jQuery('#EDIT_COPY_TO_ID').val(user_id);
    jQuery('#EDIT_COPY_TO_NAME').val(user_str);
    if(dept_id == "ALL_DEPT")
    {
        jQuery("[name='EDIT_DEPT']").find("option[value='EDIT_ALL_DEPT']").attr("selected",true);
        jQuery("#edit_dept_title").css("display", "none");
        jQuery("#edit_dept_content").css("display", "none");
        ClearUser('EDIT_TO_ID', 'EDIT_TO_NAME');
    }else if(dept_id == "DEPT")
    {
        jQuery("[name='EDIT_DEPT']").find("option[value='EDIT_DEPT']").attr("selected",true);
        jQuery("#edit_dept_title").css("display", "none");
        jQuery("#edit_dept_content").css("display", "none");
        ClearUser('EDIT_TO_ID', 'EDIT_TO_NAME');
    }else
    {
        jQuery("[name='EDIT_DEPT']").find("option[value='EDIT_OTHER']").attr("selected",true);
        jQuery("#edit_dept_title").css("display", "block");
        jQuery("#edit_dept_content").css("display", "block");
    }
    open_bootcss_modal("div_edit_authority","600","5");
    jQuery("#div_edit_authority").load();
}
function change_dept(obj)
{
    var dept_name = obj;
    if(dept_name == "OTHER")
    {
        jQuery("#dept_title").css("display", "block");
        jQuery("#dept_content").css("display", "block");
    }else
    {
        jQuery("#dept_title").css("display", "none");
        jQuery("#dept_content").css("display", "none");
    }
}
function edit_change_dept(obj)
{
    var dept_name = obj;
    if(dept_name == "EDIT_OTHER")
    {
        jQuery("#edit_dept_title").css("display", "block");
        jQuery("#edit_dept_content").css("display", "block");
    }else
    {
        jQuery("#edit_dept_title").css("display", "none");
        jQuery("#edit_dept_content").css("display", "none");
    }
}
function checkFormUser()
{
    var msg_user = td_lang.system.workflow.msg_31;
    if(jQuery.trim(jQuery("#ADD_COPY_TO_ID").val()) == "")
    {
        alert(msg_user);
        return false;
    }else{
        return true;
    }
}
function checkFormDept()
{
    var msg_dept = td_lang.system.workflow.msg_32;
    if(jQuery.trim(jQuery("#ADD_TO_ID").val()) == "")
    {
        alert(msg_dept);
        return false;
    }else{
        return true;
    }
}
function checkEditFormUser()
{
    var msg_user = td_lang.system.workflow.msg_31;
    if(jQuery.trim(jQuery("#EDIT_COPY_TO_ID").val()) == "")
    {
    	alert(msg_user);
        return false;
    }else{
        return true;
    }
}
function checkEditFormDept()
{
    var msg_dept = td_lang.system.workflow.msg_32;
    if(jQuery.trim(jQuery("#EDIT_TO_ID").val()) == "")
    {
    	alert(msg_dept);
        return false;
    }else{
        return true;
    }
}
function onLoadListItem()
{
    var rid = jQuery('#rid').val();
    jQuery("#form_tab_infos").load("list.php?rid="+rid+"",function(){});
}
function ClearUser(TO_ID, TO_NAME)
{
    if(TO_ID=="" || TO_ID=="undefined" || TO_ID== null)
    {
     TO_ID="TO_ID";
     TO_NAME="TO_NAME";
    }
    document.getElementsByName(TO_ID)[0].value="";
    document.getElementsByName(TO_NAME)[0].value="";
}
function deleteItem(data)
{
    var rid = jQuery('#rid').val();
    var msg_del = td_lang.system.workflow.msg_33;
    var pid = data;
    if(window.confirm(msg_del))
    {
        jQuery.ajax(
            {
                type: "POST",
                url: "data/delete.php",
                data: {"PID": pid},
                success: function(){
                    jQuery("#form_tab_infos").load("list.php?rid="+rid+"",function(){});
                }
            }
        )
    }
};