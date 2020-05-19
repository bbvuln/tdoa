jQuery(document).ready(function()
{
    var sort_id = jQuery("#sort_id").val();
    jQuery('.new_main_list').mouseover(function(){
        jQuery(this).css('background','#bfe3fc');
    }).mouseout(function(){
        jQuery(this).css('background','white');
    });
    jQuery('.dropdown-toggle').dropdown();
    jQuery(document).on("click", ".dropdown>.dropdown-menu>li", function()
    { //排序
        var checkedParent = jQuery(this).parent().parent().find("button[class$='dropdown-toggle']");
        var currentHtml = jQuery(checkedParent).html();
        var currentText =currentHtml.replace('<span class="caret" id="caret"></span>','');
        var checkedText = jQuery(this).find("a").html();
        var checkedObj = jQuery(this).clone(true);
        var checkedHtml = jQuery(checkedObj).html();
        var newOptionHtml = checkedHtml.replace(checkedText, currentText);
        var newCheckedHtml = currentHtml.replace(currentText, checkedText);
        jQuery(checkedParent).html(newCheckedHtml);
        jQuery(this).parent().append("<li>"+newOptionHtml+"</li>");
        jQuery(this).remove();
    });

    //回车键实现与鼠标点击同样的效果 王瑞杰 20140415
    jQuery(document).on('keydown', '#form_select', function(e){
        if(e.keyCode == 13){//判断是回车键
            flow_sort_list(0,'form_select');    //点击执行的函数
            return false;
        }
    });
    //setSize();
    flow_sort_parent(sort_id);
    flow_sort_list(sort_id);
    jQuery("#flow_sort_nav").html('<a title="常用工作" onclick=\'flow_sort_list(-1,"",this)\' href="#" nav_sort_parent="" nav_sort_id="-1" li_id="-1" is_nav="1">常用工作<em></em></a>');
    $("#f_new_block").menuAim({
        activate: activateSubmenu,
        deactivate:deactivateSubmenu,
        exitMenu: exitMenu
    });
});
function activateSubmenu(li)
{
    var menuId = $(li).attr("data-submenu-id");
    $(li).css('background','#EDEDED');
    $(li).attr('submenu_active','1');
    $(li).find('a').attr('li_id',menuId);
    $("#"+menuId).show();
}
function deactivateSubmenu(li)
{
    $(li).css('background','#F9F9F9');
    $("#f_new_block .child_menu").hide();
}
function exitMenu(li)
{
    $("li[submenu_active=1]").css('background','#F9F9F9');
    $(li).attr('submenu_active','0');
    $("#f_new_block .child_menu").hide();
}
//function setSize(){
//    var height = $(window).height() - $('#header').height();
//    jQuery(".new-tab-content").height(height -70);
//}
//function flow_show_hide(obj)
//{
//    jQuery(obj).nextAll().toggle();
//}
function form_select()
{
    flow_sort_list(0,'form_select')
}

function flow_sort_list(sort_id,select_id,obj)
{
    //面包屑导航
    var flow_sort_nav_str = '';
    var sort_parent = '';

    if(jQuery(obj).attr('is_nav'))
    {
        sort_parent = jQuery(obj).attr('nav_sort_parent');
        flow_sort_nav_str = "<a is_nav='1' li_id='"+jQuery(obj).attr('li_id')+"' nav_sort_id='"+jQuery(obj).attr('nav_sort_id')+"' nav_sort_parent='"+jQuery(obj).attr('nav_sort_parent')+"' title='"+jQuery(obj).attr('title')+"'onclick='flow_sort_list("+jQuery(obj).attr('nav_sort_id')+",\"\",this)' href='#'>"+jQuery(obj).text()+"<em></em></a>";
        while(sort_parent && sort_parent!='undefined')
        {
            var parent_obj = jQuery("a[nav_sort_id="+sort_parent+"]");
            if(parent_obj.length!=0)
            {
                flow_sort_nav_str = "<a is_nav='1' li_id='"+parent_obj.attr('li_id')+"' nav_sort_id='"+parent_obj.attr('nav_sort_id')+"' nav_sort_parent='"+parent_obj.attr('nav_sort_parent')+"' title='"+parent_obj.attr('title')+"'onclick='flow_sort_list("+parent_obj.attr('nav_sort_id')+",\"\",this)' href='#'>"+parent_obj.text()+"<em></em></a> <span class=\"divider\" style=\"color:#666666;font-size:14px;font-weight: bold;\">&gt;&gt;</span> "+flow_sort_nav_str;
                sort_parent = parent_obj.attr('nav_sort_parent');
            }
            else
            {
                sort_parent ='';
                break;
            }
        }
    }
    else
    {
        sort_parent = jQuery(obj).attr('sort_parent');
        flow_sort_nav_str = "<a is_nav='1' li_id='"+jQuery(obj).attr('li_id')+"' nav_sort_id='"+jQuery(obj).attr('sort_id')+"' nav_sort_parent='"+jQuery(obj).attr('sort_parent')+"' title='"+jQuery(obj).attr('title')+"'onclick='flow_sort_list("+jQuery(obj).attr('sort_id')+",\"\",this)' href='#'>"+jQuery(obj).text()+"<em></em></a>";
        while(sort_parent && sort_parent!='undefined')
        {
            var parent_obj = jQuery("a[sort_id="+sort_parent+"]");
            if(parent_obj.length!=0)
            {
                flow_sort_nav_str = "<a is_nav='1' li_id='"+parent_obj.attr('li_id')+"' nav_sort_id='"+parent_obj.attr('sort_id')+"' nav_sort_parent='"+parent_obj.attr('sort_parent')+"' title='"+parent_obj.attr('title')+"'onclick='flow_sort_list("+parent_obj.attr('sort_id')+",\"\",this)' href='#'>"+parent_obj.text()+"<em></em></a> <span class=\"divider\" style=\"color:#666666;font-size:14px;font-weight: bold;\">&gt;&gt;</span> "+flow_sort_nav_str;
                sort_parent = parent_obj.attr('sort_parent');
            }
            else
            {
                sort_parent ='';
                break;
            }
        }
    }

    jQuery("#flow_sort_nav").html(flow_sort_nav_str);

    //隐藏子菜单
    $("#f_new_block .child_menu").hide();

    var user_id = jQuery("#user_id").val();
    var user_priv = jQuery("#user_priv").val();
    var user_other_priv = jQuery("#user_other_priv").val();
    var user_dept = jQuery("#user_dept").val();
    var user_other_dept = jQuery("#user_other_dept").val();
    if(select_id == 'form_select')
    {
        var flow_sort_nav_str = '<a title="全部工作" onclick=\'flow_sort_list(0,"",this)\' href="#" nav_sort_parent="" nav_sort_id="0" li_id="0" is_nav="1">全部工作<em></em></a>';
        jQuery("#flow_sort_nav").html(flow_sort_nav_str);
        $("li[data-submenu-id]").attr('class','');
        setTimeout(function(){$('[data-submenu-id=0]').attr('class','active');},100);

        var form_select = jQuery("#form_select").val();
        var data_val = {"action":"flow_sort_list","user_id":user_id,"sort_id":sort_id,"user_priv":user_priv,"user_other_priv":user_other_priv,"user_dept":user_dept,"user_other_dept":user_other_dept,"form_select":form_select};
    }else{
        var data_val = {"action":"flow_sort_list","user_id":user_id,"sort_id":sort_id,"user_priv":user_priv,"user_other_priv":user_other_priv,"user_dept":user_dept,"user_other_dept":user_other_dept};
    }

    jQuery.ajax
    ({
        url: "getdata.php",
        data: data_val,
        type: "POST",
        async: true,
        success: function(data){

            if(data != 2 && data != "[]")
            {
                var jsonData =jQuery.parseJSON(data);
                var Data = {"runData":jsonData}
                var template = jQuery.templates("#panel-inboxTmpl");
                var htmlOutput = template.render(Data);
                jQuery("#panel-inbox").html(htmlOutput);
            }else{
                jQuery("#panel-inbox").html("");
                jQuery('#panel-inbox').append('<div class="new-pane">'+td_lang.general.workflow.msg_192+'</div>');
                return;
            }

        },
        error: function(data){
            alert(data.responseText);
        }
    });
    //改变 一级菜单样式
    var parent_li_id = $(obj).attr('li_id');
    if(parent_li_id)
    {
        $("li[data-submenu-id]").attr('class','');
        setTimeout(function(){$('[data-submenu-id='+parent_li_id+']').attr('class','active');},100);
    }
    //流动到顶部
    $(document).scrollTop(0);
}
function flow_sort_parent(sort_id)
{
    var user_id = jQuery("#user_id").val();
    var user_priv = jQuery("#user_priv").val();
    var user_other_priv = jQuery("#user_other_priv").val();
    var user_dept = jQuery("#user_dept").val();
    var user_other_dept = jQuery("#user_other_dept").val();
    jQuery.ajax
    ({
        url: "flow_type.php",
        data: {"sort_id":sort_id,"user_priv":user_priv,"user_other_priv":user_other_priv,"user_dept":user_dept,"user_other_dept":user_other_dept},
        type: "POST",
        async: false,
        dataType: 'json',
        success: function(data){
            var Data = {"runData":data};
            var template = jQuery.templates("#f_new_blockTmpl");
            var htmlOutput = template.render(Data);
            jQuery("#f_new_block").html(htmlOutput);
            return;
        },
        error: function(data){
            alert(data.responseText);
        }
    });
}
function quick_flow(flow_id, flow_name, edit_str, plugin)
{

    var url = '/general/approve_center/new/edit.php?FLOW_ID=' + flow_id;
    if(edit_str != "")
    {
        var msg=sprintf(quick_flow_tips, edit_str);
        if(window.confirm(msg))
        {
            new_work(flow_name, url);
        }
    }
    else if(plugin == 1)
    {
        var msg=td_lang.general.workflow.msg_288;
        if(window.confirm(msg))
        {
            new_work(flow_name, url);
        }
    }
    else
    {
        new_work(flow_name, url + '&AUTO_NEW=1');
    }
}
function guide_flow(flow_id, flow_name)
{
    new_work(flow_name, '/general/approve_center/new/edit.php?FLOW_ID=' + flow_id);
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
function view_form(FLOW_ID,FORM_ID)
{
    myleft=(screen.availWidth-800)/2;
    window.open("/general/approve_center/form_view.php?FLOW_ID="+FLOW_ID+"FORM_ID="+FORM_ID,"form_view","status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=800,height=600,left="+myleft+",top=50");
}
function show_explanation(FLOW_ID)
{
    /* jQuery.ajax({
     type:"post",
     url:"/general/approve_center/new/show_explan.php",
     data:{"flow_id":FLOW_ID},
     success:function(html){
     jQuery("#div_explanation_body").html("");
     jQuery("#div_explanation_body").append(html);
     jQuery('#div_explanation').find('span[id^=attach][onmouseover]').attachmenu();
     }
     });
     open_bootcss_modal("div_explanation","780","5");
     jQuery('#div_explanation_body').load();
     */
    window.open('/general/approve_center/new/show_explan.php?flow_id='+FLOW_ID,'sss','width=700,height=400,left=200,top=200,toolbar=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=1');
}

function to_old_new_work()
{
    var currentuserid=document.getElementById("cur_user").value;
    var today = new Date();
    var expires = new Date();
    expires.setTime(today.getTime() + 1000*60*60*24*365);
    document.cookie = currentuserid+"_createnewwork=true; path=/general; expires=" + expires.toGMTString();
    window.location="/general/approve_center/new/new_old/index.php";
}