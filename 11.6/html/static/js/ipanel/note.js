jQuery.noConflict();
(function($){
   
   $(document).ready(function(){

      //便签的下拉事件
      var menuTimerOrg = null;
      $("#sub_tabs_ul > li > a[module='note'] > span > span.dropdown").click(
         function(){
            $("#sub_menu_note").show(100);
            
            var offset = $(this).offset();
            $("#sub_menu_note").css({top:offset.top + $(this).height() - 1, left:offset.left});
         }
      );
      $("#sub_tabs_ul > li > a[module='note'] > span > span.dropdown").hover(
         function(){
         },
         function(){
            menuTimerOrg = window.setTimeout(function(){$("#sub_menu_note").hide(100);}, 300);
         }
      );
      
      //便签的鼠标滑过事件
      $("#sub_menu_note").hover(
         function(){
            if(menuTimerOrg)
               window.clearTimeout(menuTimerOrg);
         },
         function(){
            $(this).hide(100);
         }
      );
      $(".module_body").live("mouseover", function(){$(this).find(".note").show();$(this).addClass("module_body_back");});
   
      $(".module_body").live("mouseout", function(){$(this).find(".note").hide();$(this).find(".pubinfo").show();$(this).removeClass("module_body_back");});

      $("#note-header a").bind("click",function(){
          var color = $("#COLOR").val();
          var index = $(this).attr("index");
          $("#COLOR").val(index);
          $("#note-header a").removeClass("current");
          $(this).addClass("current");
          $("#note-header").removeClass("note-header-"+color).addClass("note-header-"+index);
          $("#note-content").removeClass("note-content-"+color).addClass("note-content-"+index);
          $("#note-foot").removeClass("note-header-"+color).addClass("note-header-"+index);
          $("#CONTENT").removeClass("note-textarea-"+color).addClass("note-textarea-"+index);
          $("#body").removeClass("color-style-"+color).addClass("color-style-"+index);        
      })    
   });     
})(jQuery);
//打开新建标签界面（OA精灵窗口或浏览器窗口）
function new_note()
{
    if(ispirit == '1')
    {
        //lp 增加Mac下判断
        if(i_ver=="3")
        {
             window.open ('new.php','newwindow','height=353,width=360,top=150,left=250,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
        }
        else
        {
            call_ispirit_func("new","","NOTES");
        }    
        /*if(window.external && window.external.OA_SMS)
            window.external.OA_SMS("new","","NOTES");
        else
            window.open ('new.php','newwindow','height=353,width=360,top=150,left=250,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')*/
    }
    else
    {
        window.open ('new.php','newwindow','height=353,width=360,top=150,left=250,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no') 
        //浏览器传统界面主题下新建便签，打开新窗口进行操作
    }
}

//打开编辑便签界面（OA精灵窗口或浏览器窗口）
function edit_note(note_id)
{
    if(ispirit == '1')
    {
        if(i_ver=="3")
        {
            window.open('new.php?note_id='+note_id,'newwindow','height=360,width=356,top=150,left=250,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
        }    
        else
        {
            call_ispirit_func("edit",note_id,"NOTES");
        }    
        /*if(window.external && window.external.OA_SMS)        
        {    
            window.external.OA_SMS("edit",note_id,"NOTES");
        }
        else
        {
            window.open('new.php?note_id='+note_id,'newwindow','height=360,width=356,top=150,left=250,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
        }*/    
            
    }
    else
    {
        window.open('new.php?note_id='+note_id,'newwindow','height=360,width=356,top=150,left=250,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no')
        //浏览器传统界面主题下编辑便签，打开新窗口进行操作
    }
}
function call_ispirit_func(arg1, arg2, arg3){
    if(window.external && typeof window.external.OA_SMS != 'undefined'){
        window.external.OA_SMS(arg1, arg2, arg3);
    }else{
        alert('请使用oa精灵客户端。');
    }
}
//删除便签，为了将增删改的接口程序都在ipanel/index.php中实现，在此加一个过度接口
function delete_note(note_id_str)
{
    if(i_ver=="3")
    {
        parent.delete_note(note_id_str);
        alert("删除成功!");
    }
    else
    {
        if(window.confirm(td_lang.general.note.msg_5))
        {
            parent.delete_note(note_id_str);
        }
    }    
    //alert("dd");
    //window.confirm("eee");
    //if(window.confirm(td_lang.general.note.msg_5))
    //{
        //parent.delete_note(note_id_str);
    //}
    //确认是否删除，然后ajax get方式删除
}

//导出便签，为了将导出功能的接口程序都在ipanel/index.php中实现，在此加一个过度接口
function export_txt()
{
    window.location='export_txt.php';
}

//打开分享便签界面（OA精灵窗口或浏览器窗口）
function share_email(note_id)
{
    if(ispirit == '1' && parent.note_to_email)
    {
        //parent.fw_email();
        parent.note_to_email(note_id)
    }
    else if(parent.send_note_email)
    {
        parent.send_note_email(note_id);
    }
    else
    {
        //兼容rtx
        alert('请使用oa精灵客户端。');
    }    
}
function share_weixun(note_id)
{
    if(ispirit == '1' && parent.note_to_share)
    {
        //parent.fw_message();
        parent.note_to_share(note_id);
    }
    else if(parent.send_weixun)
    {
        parent.send_weixun(note_id);
    }
    else
    {
        //兼容rtx
        alert('请使用oa精灵客户端。');
    }
}

//在界面添加一个便签块，并显示在所有便签块的最上边
function add_note_block(note_id, content, color)
{    
    var edit_text = "";
    content = set_sub(content,200);
    content = content.toString().replace(/(\r)*\n/g,"<br />").replace(/\s/g," "); 
    times = js_date_time();         
    var html = jQuery('<div class="module_body left-border-'+color+'" id="item_'+note_id+'" ><div class="content" onclick="edit_note(\''+note_id+'\')"><span class="contents" >'+content+
                '</span><div class="pubinfo"><div class="time" title="">'+times+'</div></div></div><div class="note" style="display:none">'+
                '<span class="dele">'+
                '<a href="javascript:share_email(\''+note_id+'\');" title="'+td_lang.general.note.msg_3+'"><img src="'+MYOA_STATIC_SERVER_JS+'/static/modules/note/images/5.png"></a> '+
                '<a href="javascript:share_weixun(\''+note_id+'\');" title="'+td_lang.general.note.msg_4+'"><img src="'+MYOA_STATIC_SERVER_JS+'/static/modules/note/images/6.png"></a>'+
                '<a href="javascript:delete_note(\''+note_id+'\');" title="'+td_lang.general.note.msg_6+'"><img src="'+MYOA_STATIC_SERVER_JS+'/static/modules/note/images/8.png"></a>'+
                '</span>'+
                '</div>'+
                '<div class="clearfix"></div></div>');
    if(jQuery("div").hasClass("msgbox"))
    {
       jQuery("#content_box").html(html); 
    }else
    {
        jQuery("#content_box").prepend(html);
    }
}

//在界面修改一个便签块的内容，如果是根据最后修改时间排序，则将该块移动到最上边；如果是根据创建时间排序，则不移动该块位置
function update_note_block(note_id, content, color)
{    
    var datetime = js_date_time();    
    content = set_sub(content,200);   
    content = content.toString().replace(/(\r)*\n/g,"<br />").replace(/\s/g," ");
    if(data_type!="0")
    {
        jQuery("#item_"+note_id + " .pubinfo .time").text(datetime);
    }
    jQuery("#item_"+note_id).removeClass().addClass("module_body left-border-"+color);
    jQuery("#item_"+note_id+" .contents ").html(content);
    if(data_type!="0")
    {
        jQuery("#content_box").prepend(jQuery("#item_"+note_id));
    }
}
function update_note_color(note_id,color)
{    
    var datetime = js_date_time();    
    if(data_type!="0")
    {
        jQuery("#item_"+note_id+" .pubinfo .time").text(datetime);
    }
    jQuery("#item_"+note_id).removeClass().addClass("module_body left-border-"+color);
    if(data_type!="0")
    {
        jQuery("#content_box").prepend(jQuery("#item_"+note_id));
    }
}
//根据NOTE_ID，在界面remove一个或多个便签块
function delete_note_block(note_id_str)
{
    jQuery("#item_"+note_id_str).remove();
}

function js_date_time() {
    var d = new Date();
    var vYear = d.getFullYear()
    var vMon = d.getMonth() + 1
    var vDay = d.getDate()
    var h = d.getHours(); 
    var m = d.getMinutes(); 
    var se = d.getSeconds(); 
    datetime = vYear +"年"+ vMon + "月" + vDay + "日 " + (h<10 ? "0"+ h : h)+":"+(m<10 ? "0" + m : m);
    //datetime=vYear+"-"+(vMon<10 ? "0" + vMon : vMon)+"-"+(vDay<10 ? "0"+ vDay : vDay)+" "+(h<10 ? "0"+ h : h)+":"+(m<10 ? "0" + m : m)+":"+(se<10 ? "0" +se : se);
    return datetime;
}

function get_more(){
    page++;
    jQuery.get("get_more.php",{ISPIRIT:ispirit,I_VER:i_ver,DATA_TYPE:data_type,PAGE:page},function(data){
        if(data!="")
        {
            document.getElementById('content_box').innerHTML += data;
        }
        else
        {
            note_nomore(td_lang.inc.msg_54);
        }    
    });
}

function note_nomore(str){
    var msg = document.getElementById("msg");
    var xoverlay = document.getElementById("xoverlay");
    var get_more_btn =  document.getElementById("get_more_btn");
    if(msg.style.display == "" || msg.style.display == "none" ){
        msg.innerHTML = str;
        msg.style.display = 'block';
        xoverlay.style.display = 'block';
        setTimeout(function(){
            msg.style.display = 'none';
            xoverlay.style.display = 'none';
            if(get_more_btn){get_more_btn.style.display = "none";}
        },2000);
    }   
}
function set_sub(str,n)
{  
    var strReg=/[^\x00-\xff]/g;  
    var strs=str.replace(strReg,"**");  
    var len=strs.length;  
    if(len>n)
    {  
        var newLen=Math.floor(n/2);  
        var strLen=str.length;  
        for(var i=newLen;i<strLen;i++)
        {  
            var newStr=str.substr(0,i).replace(strReg,"**");  
            if(newStr.length>=n)
            {  
                return str.substr(0,i)+"...";  
                break;  
            }  
        }  
    }
    else
    {  
        return str;  
    }  
}   

