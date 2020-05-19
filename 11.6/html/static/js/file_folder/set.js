
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
            $('#label_down').text('��������');
         else
            $('#label_down').text('����');
         
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
            $('#label_down').text('��������');
         else
            $('#label_down').text('����');
      });
   });
})(jQuery);

//ɾ���ļ���֤
function delete_content(CONTENT_ID,FILE_SORT,SORT_ID,start)
{
  msg="ȷ��Ҫɾ�����ļ����⽫���ɻָ���";
  if(window.confirm(msg))
  {
    URL="delete.php?FILE_SORT=" + FILE_SORT +"&SORT_ID=" + SORT_ID +"&start=" + start +"&CONTENT_ID=" + CONTENT_ID;
    window.location=URL;
  }
}
//������
function order_by(FILE_SORT,SORT_ID,start,field,asc_desc)
{
 window.location="folder.php?FILE_SORT=" + FILE_SORT +"&SORT_ID=" + SORT_ID +"&start=" + start +"&FIELD="+field+"&ASC_DESC="+asc_desc;
}
/*
 * �����������ع��ܵ�δǩ�ĵ��ļ� wrj 20140402
 * qianyue=1��ǩ��
 * tag = 1 �����ظ����� ����false
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
             	   alert('����δ��ǩ�ĵ��ļ�����Щ���ܱ�һ�����أ������Ҫ��������ǩ����Щ�ļ�!');
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
//���ز�������
function do_action_tag(action,FILE_SORT,SORT_ID,start)
{
	delete_str=get_checked_tag(action);
	if(delete_str == false){return;} //�ж��Ƿ���δǩԼ�ļ���������return
    var id_array=delete_str.split(",");
    var count=id_array.length-1;
    if(count <= 0)
    {
       alert("������ѡ��һ���ļ�");
       return;
    }
    switch(action)
    {
	    case "sign":
	        window.location="sign.php?CONTENT_ID_STR=" + delete_str +"&FILE_SORT="+FILE_SORT+"&SORT_ID="+SORT_ID+"&start="+start;
	        break;
	    case "down":
		    if(count>1 && window.confirm("һ�����ض���ļ���Ҫ�ڷ���������ѹ��������ռ�ý϶������CPU��Դ��ȷ�����������𣿸ò����벻Ҫ���س���128MB�Ĵ��ļ�"))
		       location = "down.php?FILE_SORT="+FILE_SORT+"&SORT_ID="+SORT_ID+"&start="+start+"&CONTENT_ID=" + delete_str;
		    else if(count==1)
		       location = "down.php?FILE_SORT="+FILE_SORT+"&SORT_ID="+SORT_ID+"&start="+start+"&CONTENT_ID=" + delete_str;
		    break;
    }
	    
}
