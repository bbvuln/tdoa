//记录上次请求的数据
var highlightindex=0;
var last_data = '';
function getdata()
{
	 //隐藏自动补全框并通过CSS设置补全框的位置大小及样式
	var wordInput = $("#QDFPDWMC");
    var wordInputOffset = wordInput.offset();
    $("#auto").hide().css("border","1px black solid").css("position","relative").css("background-color","white")
    .css("top",wordInputOffset.top+wordInput.height() + 1 +"px")
    .css("left",wordInputOffset.left -2).width(wordInput.width() + 6).css("position","absolute");
   wordInput.keyup(function(event)
   {
	    var myEvent = event||window.event;
        var keyCode = myEvent.keyCode;
        //如果输入的是字母，退格，delete，空格或者数字键，应该将文本框中的最新信息发送给服务器,其中，空格键和数字键的加入使得输入中文也能支持~~
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
            //如果输入的是向上38向下40按键
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
                    //如果修改索引值以后index变成-1，则将索引中指向最后一个元素
                    highlightindex = autoNodes.length -1;
                }
               //让现在被高亮的内容变成黄色
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
                   //如果修改索引值以后index变成-1，则将索引中指向最后一个元素
                    highlightindex = 0;
                }
               //让现在被高亮的内容变成黄色
                autoNodes.eq(highlightindex).css("background-color","yellow");
            }
           
        }
		else if(keyCode == 13)
		{
           //如果按下的是回车
           
            //下拉框有高亮的内容
			alert(comText);
            if(highlightindex !=-1)
            {
                var comText = $("#auto").hide().children("div").eq(highlightindex).text();
                highlightindex=-1;
				
                wordInput.val(comText); //将文本框内容改成选中项
				alert(comText);
				//$("form:form1").submit(); 
             //提交form。若没有这句话，按下回车后，仅仅只改变了文本框里的内容，但是由于form本身就监控了回车按键默认为submit，提交的是文本框改变之前的内容，解决这个问题最简单的方式就是在文本框内容改变以后强制提交form的内容，此时，提交的内容就是选中项。
            }
           //下拉框没有高亮的内容
            else
			{
                $("#auto").hide();
               //让文本框失去焦点
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
name[0] = '名字|0001';
name[1] = '名字|0001';
//这个部分说明两点,第一是,这里这个数组的赋值是通过java代码来写的.这个是一个jsp页面.没办法,原来这个项目就没用用MVC来做的..第二,中间加管道符是因为具体的业务需求..下面的代码里面也是会去掉这个管道符的..其实就是我比较懒.懒得把里面去管道符那部分改写了.就是这样
name[2] = '名字|0002';
name[3] = '名字|0003';
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
                   //获取单词内容
//                    var wordNode = $(this);
                   //新建div节点将单词内容加入到新建的节点中,将新建的节点加入到弹出框的节点中
                    var newDivNode = $("<div>").attr("id",i);
                    newDivNode.html(wordNodes[i]).appendTo(autoNode);
                   
                    //增加鼠标进入事件，高亮节点;
                    newDivNode.mouseover(function()
					{
                        if(highlightindex != -1)
						{
                            $("#auto").children("div").eq(highlightindex).css("background-color","white");
                        }
                        highlightindex = $(this).attr("id");
                        $(this).css("background-color","yellow");
                    });
                    //增加鼠标移出事件，取消当前高亮节点
                    newDivNode.mouseout(function()
					{
                        $(this).css("background-color","white");
                    });
                   //增加鼠标点击事件，可以进行补全
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
