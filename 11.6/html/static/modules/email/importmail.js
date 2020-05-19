$(function (){
	$(document).ready(function() {
        /**
         * ȫѡ by tl
         */
        $("#checkall").change(function(){
            var ischecked = $(this).prop('checked');
            if (ischecked) 
            {
                $(".table input[type='checkbox']").prop('checked',true);
            } 
            else 
            {
                $(".table input[type='checkbox']").prop('checked',false);
            }
        });
        /**
         * ��ҳ by tl
         */
        var element = $("#email-pagination");
        var row = $("#per_pages").val();
        var total = $("#total_pages").val();
        var page = $("#page").val();
        var options = {
            currentPage: page,
            numberOfPages: 5,
            totalPages: total,
            itemTexts: function (type, page, current) {
                switch (type) {
                    case "first":
                        return "<a href='import.php?page="+page+"&per_pages="+row+"'>��ҳ</a>";
                    case "prev":
                        return "<a href='import.php?page="+page+"&per_pages="+row+"'>��һҳ</a>";
                    case "next":
                        return "<a href='import.php?page="+page+"&per_pages="+row+"'>��һҳ</a>";
                    case "last":
                        return "<a href='import.php?page="+total+"&per_pages="+row+"'>ĩҳ</a>";
                    case "page":
                        return "<a href='import.php?page="+page+"&per_pages="+row+"'>"+page+"</a>";
                }
            },
            onPageChanged: function(e,oldPage,newPage){
                $('.page-changed-select').val(newPage);
            }
        }
        element.bootstrapPaginator(options);
        
        $.ajax({
            type: 'GET',
            url: 'import_value.php',
            data: {
                'OPT_TYPE': 'show'
            },
            cache: false,
            success: function(data) {
                //console.log(data);
            }
        });
    });
    
    $("input[name='EXCEL_FILE']").change(function (){
        $("input[name='show_file']").val($("input[name='EXCEL_FILE']").val());
    });
    
    $(".del_one").click(function(){
    	msg='ȷ��Ҫɾ����������';
        if(window.confirm(msg))
        {
       	 $.ajax({
                type: 'POST',
                url: 'webmail_delete.php',
                data: {
                    'MAIL_ID': this.id,
                    'TYPE': 'import'
                },
                cache: false,
                success: function(data) {
   		          var rows = $("#per_pages").val();
   		          var page = $("#page").val();
   		        	  window.location.href = 'import.php?per_pages='+rows+'&page='+page;
                    /*$("#mail"+EMAIL_ID).slideUp("slow");*/
                }
        });
       }
    });
});
function set_val(rows)
{
	window.location.href='import.php?per_pages='+rows;
}
function check_one(el)
{
	   if(!el.checked)
	      document.getElementById("checkall").checked=false;
}
function get_checked()
{
  delete_str="";
  for(i=0;i<document.getElementsByName("email_select").length;i++)
  {
      el=document.getElementsByName("email_select").item(i);
      if(el.checked)
      {  val=el.value;
         delete_str+=val + ",";
      }
  }

  if(i==0)
  {
      el=document.getElementsByName("email_select");
      if(el.checked)
      {  val=el.value;
         delete_str+=val + ",";
      }
  }
  return delete_str;
}
function delete_email()
{
  delete_str=get_checked();
  if(delete_str=="")
  {
     alert("Ҫɾ�����䣬������ѡ������һ����");
     return;
  }
  msg='ȷ��Ҫɾ����ѡ������';
  if(window.confirm(msg))
  {
	 	 $.ajax({
	          type: 'POST',
	          url: 'webmail_delete.php',
	          data: {
	              'MAIL_ID': delete_str,
	              'TYPE': 'import'
	          },
	          success: function(data) {
		          var rows = $("#per_pages").val();
		          var page = $("#page").val();
	        	  window.location.href = 'import.php?per_pages='+rows+'&page='+page;
	              /*var str_id = delete_str.split(","); //�ַ��ָ� 
	              for (i=0;i<str_id.length;i++ ) 
	              { 
		              $("#mail"+str_id[i]).fadeIn("slow");
	              }*/
	          }
	  });
  }
}