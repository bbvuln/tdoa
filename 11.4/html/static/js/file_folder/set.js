
jQuery.noConflict();
(function($){
   $(document).ready(function(){
      var rows = $('tr[index]');
      rows.hover(
         function(){$(this).addClass('TableRowHover');},
         function(){$(this).removeClass('TableRowHover');}
      );
      rows.click(function(){
         $(this).toggleClass('TableRowActive');
         var checkbox = $('#checkbox_'+$(this).attr('index')).get(0);
         checkbox.checked = $(this).attr('class').indexOf('TableRowActive') > -1;
         if($('input[name=email_select]:checked').length > 1)
            $('#label_down').text('批量下载');
         else
            $('#label_down').text('下载');
         
         return true;
      });
      
      $('#allbox').click(function(){
         var checked = this.checked;
         $('tr[index]').each(function(){
            var active = $(this).attr('class').indexOf('TableRowActive') > -1;
            if(checked && !active || !checked && active)
               $(this).trigger('click');
         });   
         if($('input[name=email_select]:checked').length > 1)
            $('#label_down').text('批量下载');
         else
            $('#label_down').text('下载');
      });
   });
})(jQuery);

//删除文件验证
function delete_content(CONTENT_ID,FILE_SORT,SORT_ID,start)
{
  msg="确定要删除该文件吗？这将不可恢复！";
  if(window.confirm(msg))
  {
    URL="delete.php?FILE_SORT=" + FILE_SORT +"&SORT_ID=" + SORT_ID +"&start=" + start +"&CONTENT_ID=" + CONTENT_ID;
    window.location=URL;
  }
}
//排序处理
function order_by(FILE_SORT,SORT_ID,start,field,asc_desc)
{
 window.location="folder.php?FILE_SORT=" + FILE_SORT +"&SORT_ID=" + SORT_ID +"&start=" + start +"&FIELD="+field+"&ASC_DESC="+asc_desc;
}
/*
 * 单独处理下载功能的未签阅的文件 wrj 20140402
 * qianyue=1已签阅
 * tag = 1 不再重复提醒 返回false
 */
function get_checked_tag(action)
{
    var checked_str="";
    var dom = document.getElementsByName("email_select");
    var tag = 0;
    var dom0 = document.getElementsByName("qianyue");
    for(i=0;i<dom.length;i++)
    {
        var el = dom.item(i);
        if(el.checked)
        {  val=el.value;
           var qianyue = dom0.item(i).value;
            if(qianyue==1||action!='down')
            {
                checked_str+=val + ",";
            }else{
                if(tag==0){
             	   alert('含有未被签阅的文件，这些不能被一起下载，如果需要下载请先签阅这些文件!');
             	   tag = 1;
             	   return false;
                }
            }
        }
    }

    if(i==0)
    {
        el=document.getElementsByName("email_select");
        if(el.checked)
        {
            val=el.value;
            checked_str+=val + ",";
        }
    }
    return checked_str;
}
//下载操作处理
function do_action_tag(action,FILE_SORT,SORT_ID,start)
{
	delete_str=get_checked_tag(action);
	if(delete_str == false){return;} //判断是否含有未签约文件，含有则return
    var id_array=delete_str.split(",");
    var count=id_array.length-1;
    if(count <= 0)
    {
       alert("请至少选择一个文件");
       return;
    }
    switch(action)
    {
	    case "sign":
	        window.location="sign.php?CONTENT_ID_STR=" + delete_str +"&FILE_SORT="+FILE_SORT+"&SORT_ID="+SORT_ID+"&start="+start;
	        break;
	    case "down":
		    if(count>1 && window.confirm("一次下载多个文件需要在服务器上做压缩处理，会占用较多服务器CPU资源，确定继续下载吗？该操作请不要下载超过128MB的大文件"))
		       location = "down.php?FILE_SORT="+FILE_SORT+"&SORT_ID="+SORT_ID+"&start="+start+"&CONTENT_ID=" + delete_str;
		    else if(count==1)
		       location = "down.php?FILE_SORT="+FILE_SORT+"&SORT_ID="+SORT_ID+"&start="+start+"&CONTENT_ID=" + delete_str;
		    break;
    }
	    
}
