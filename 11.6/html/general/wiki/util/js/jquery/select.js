//��¼�ϴ����������
var highlightindex=0;
var last_data = '';
function getdata()
{
	 //�����Զ���ȫ��ͨ��CSS���ò�ȫ���λ�ô�С����ʽ
	var wordInput = $("#QDFPDWMC");
    var wordInputOffset = wordInput.offset();
    $("#auto").hide().css("border","1px black solid").css("position","relative").css("background-color","white")
    .css("top",wordInputOffset.top+wordInput.height() + 1 +"px")
    .css("left",wordInputOffset.left -2).width(wordInput.width() + 6).css("position","absolute");
   wordInput.keyup(function(event)
   {
	    var myEvent = event||window.event;
        var keyCode = myEvent.keyCode;
        //������������ĸ���˸�delete���ո�������ּ���Ӧ�ý��ı����е�������Ϣ���͸�������,���У��ո�������ּ��ļ���ʹ����������Ҳ��֧��~~
       if((keyCode >= 65 && keyCode<=90) || (keyCode >= 48 && keyCode <= 57) ||(keyCode>=96 && keyCode<=105) || keyCode == 46 || keyCode == 8 || keyCode == 32)
	   {
			var data = 'val='+$("#QDFPDWMC").val();
			if($("#QDFPDWMC").val() == "" || $("#QDFPDWMC").val() == last_data)
		    {
				return false;
			}
			last_data = $("#QDFPDWMC").val();
			$.ajax({
			type:'post',
			url:'c_oncont.php',
			data:data,
			success:function(cont)
			{
			//alert(cont);
				if(cont != "")
				{
					var name = cont.split(",");
					//alert(name);
					autoCompletion(name);
				}
			}

			});
      }
      else if(keyCode == 38 || keyCode==40)
	  {
            //��������������38����40����
			//alert(highlightindex);
            if(keyCode == 38)
			{
                //up
                var autoNodes = $("#auto").children("div");
                if(highlightindex !=-1)
                {
                    autoNodes.eq(highlightindex).css("background-color","white");
                    highlightindex--;
                }
				else
				{
                    highlightindex = autoNodes.length -1;
                }
               
                if(highlightindex == -1)
				{
                    //����޸�����ֵ�Ժ�index���-1����������ָ�����һ��Ԫ��
                    highlightindex = autoNodes.length -1;
                }
               //�����ڱ����������ݱ�ɻ�ɫ
                autoNodes.eq(highlightindex).css("background-color","yellow");
            }
            if(keyCode == 40)
			{
                //down
                var autoNodes = $("#auto").children("div");
                if(highlightindex !=-1)
                {
                    autoNodes.eq(highlightindex).css("background-color","white");
                }
                highlightindex++;
                if(highlightindex == autoNodes.length)
				{
                   //����޸�����ֵ�Ժ�index���-1����������ָ�����һ��Ԫ��
                    highlightindex = 0;
                }
               //�����ڱ����������ݱ�ɻ�ɫ
                autoNodes.eq(highlightindex).css("background-color","yellow");
            }
           
        }
		else if(keyCode == 13)
		{
           //������µ��ǻس�
           
            //�������и���������
			alert(comText);
            if(highlightindex !=-1)
            {
                var comText = $("#auto").hide().children("div").eq(highlightindex).text();
                highlightindex=-1;
				
                wordInput.val(comText); //���ı������ݸĳ�ѡ����
				alert(comText);
				//$("form:form1").submit(); 
             //�ύform����û����仰�����»س��󣬽���ֻ�ı����ı���������ݣ���������form����ͼ���˻س�����Ĭ��Ϊsubmit���ύ�����ı���ı�֮ǰ�����ݣ�������������򵥵ķ�ʽ�������ı������ݸı��Ժ�ǿ���ύform�����ݣ���ʱ���ύ�����ݾ���ѡ���
            }
           //������û�и���������
            else
			{
                $("#auto").hide();
               //���ı���ʧȥ����
                wordInput.get(0).blur();
            }
       }
  });
  $(document).click(function()
  {
	 $("#auto").hide();
  });
}
 
/*
name[0] = '����|0001';
name[1] = '����|0001';
//�������˵������,��һ��,�����������ĸ�ֵ��ͨ��java������д��.�����һ��jspҳ��.û�취,ԭ�������Ŀ��û����MVC������..�ڶ�,�м�ӹܵ�������Ϊ�����ҵ������..����Ĵ�������Ҳ�ǻ�ȥ������ܵ�����..��ʵ�����ұȽ���.���ð�����ȥ�ܵ����ǲ��ָ�д��.��������
name[2] = '����|0002';
name[3] = '����|0003';
*/

function autoCompletion(name)
{
    var wordInput = $("#QDFPDWMC");
    var wordInputOffset = wordInput.offset();

    var wordText = wordInput.val();
    var autoNode = $("#auto");
    if(wordText!="")
    {
				timeoutId = setTimeout(function()
				{
//                
				autoNode.html(" ");
				var wordNodes = new Array();
				var p = 0;
				for(var i = 0; i < name.length; i ++)
				{
					var dwmc = name[i].split("|")[0];
					//alert(dwmc);
					//if(beginWith(wordText,dwmc))
				    {
						 wordNodes[p++] = dwmc;
					}
				 }
              
              	for(var i = 0; i < wordNodes.length; i++)
				{
                   //��ȡ��������
//                    var wordNode = $(this);
                   //�½�div�ڵ㽫�������ݼ��뵽�½��Ľڵ���,���½��Ľڵ���뵽������Ľڵ���
                    var newDivNode = $("<div>").attr("id",i);
                    newDivNode.html(wordNodes[i]).appendTo(autoNode);
                   
                    //�����������¼��������ڵ�;
                    newDivNode.mouseover(function()
					{
                        if(highlightindex != -1)
						{
                            $("#auto").children("div").eq(highlightindex).css("background-color","white");
                        }
                        highlightindex = $(this).attr("id");
                        $(this).css("background-color","yellow");
                    });
                    //��������Ƴ��¼���ȡ����ǰ�����ڵ�
                    newDivNode.mouseout(function()
					{
                        $(this).css("background-color","white");
                    });
                   //����������¼������Խ��в�ȫ
                    newDivNode.click(function()
					{
						$("#auto").hide();
                        var comText = $(this).text(); 
                        highlightindex=-1;
                        wordInput.val(comText);
						//key1();
						showNumber(comText);
						//$("form:form1").submit(); 
                    });
                }
                if(wordNodes.length>0)
				{
                   $("#auto").show();
                }
				else 
				{
					$("#auto").hide();
					highlightindex=-1;
                }
				},10);
           
             }
			 else
			 {
                autoNode.hide();
                highlightindex=-1;
             }
}
