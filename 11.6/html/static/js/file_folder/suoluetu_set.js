FF.url = {
    api : 'api.php'
};
var tag;
var count=0;
//文件选择操作
var FileSelect = 
{
    dom: '[node-type="file.domItem"]',
    optsWrapperDom: $("[node-type='file.optsWrapper']"),
    tipsDom: $("[node-type='file.selectTips']"),
    size: function(){
      return $(this.dom).length || 0;
    },
    select: function(t){
        this.tips(t);
    },
    selectAll: function(){
        this.tips(this.size());
    },
    unselectAll: function(){
        this.tips(0);
    },
    tips: function(n){
        var count = this.tipsDom.find("[node-type='file.selectCount']");
        switch(n)
        {
            case 0 :
                this.optsWrapperDom.hide();
                this.tipsDom.html('点击下方文件空白区域进行多选！');
                break;
            case 1 :
                if(count.length > 0){
                    count.text(parseInt(count.text()) + 1);
                }else{
                    this.optsWrapperDom.show();
                    this.tipsDom.html('已经选中<span node-type="file.selectCount">1</span>个文件');
                }
                break;
            case -1 :
                if(count.length > 0 && parseInt(count.text()) > 1){
                    count.text(parseInt(count.text()) - 1);
                }else{
                  this.optsWrapperDom.hide();
                  this.tips(0);
                }
                break;
            default :
                this.optsWrapperDom.show();
                this.tipsDom.html('已经选中<span node-type="file.selectCount">1</span>个文件').find("[node-type='file.selectCount']").text(n);
        }

        //如果不是全选的
        var _count = parseInt(this.tipsDom.find("[node-type='file.selectCount']").text());
        if(_count != this.size())
        {
            $("#selectAll")[0].checked = false;
        }else{
            $("#selectAll")[0].checked = true;  
        }
        return this;
    },
//     getSelect: function(){
//         var a = [];
//         $(this.dom).each(function(){
//             if($(this).hasClass("selected")){
//                 a.push($(this).attr("node-data"));      
//             }
//         });
//         return a.join(",");
//     },
    getSelect: function(action){//获取选中的文件
        var a = [];
        tag = 0;
        count=0;
        $(this.dom).each(function(){
            if($(this).hasClass("selected")){
                var id = $(this).attr("node-data");
                var qianyue = $('#qianyue_'+id).val();
                if(qianyue==1||action!='file.download')
                {
                    a.push($(this).attr("node-data")); 
                }else{
                    if(tag==0){
                   	   alert('含有未被签阅的文件，这些不能被一起下载，如果需要下载请先签阅这些文件!');
                   	   tag = 1;
                      }
                  	$(this).removeClass("selected");
                }   
            }
        });
        $(this.dom).each(function(){
            if($(this).hasClass("selected")){
            	count++;
            }
        });
		
        if(count==1){        
            this.tipsDom.html('已经选中<span node-type="file.selectCount">1</span>个文件').find("[node-type='file.selectCount']").text(n);
        }else{
            FileSelect.tips(count);//动态刷新选中文件数量
        }
      	//FileSelect.tips(count);
        return a.join(",");
    },
    getCount: function(){
        var a = [];
        $(this.dom).each(function(){
            if($(this).hasClass("selected")){
                a.push($(this).attr("node-data"));      
            }
        });
        return a.length;  
    }
}

$(function(){

    $("div[node-type='file.domList']").delegate("[node-type='file.domItem']",{
      "mouseenter" : function(){
          $(this).addClass("hover");
      },
      "mouseleave" : function(){
          $(this).removeClass("hover");
      },
      "click" :  function(){
          if($(this).hasClass("selected"))
          {
              $(this).removeClass("selected");
              FileSelect.select(-1);
          }
          else
          {
              $(this).addClass("selected");
              FileSelect.select(1);
          }
      }
    });

    //文件全选
    $("label[node-type='file.selectAll']").click(function(e){
        var input = $("#selectAll");
        if(input[0].checked)
        {
            input[0].checked = false;
            $(FileSelect.dom).removeClass("selected");
            FileSelect.tips(0);
        }
        else
        {
            input[0].checked = true;
            $(FileSelect.dom).addClass("selected");
            FileSelect.tips(FileSelect.size());
        }
        return false;
    });

     $("#selectAll").click(function(e){
        if(this.checked == true)
        {
            $(FileSelect.dom).addClass("selected");
            FileSelect.tips(FileSelect.size()); 
        }
        else
        {
            $(FileSelect.dom).removeClass("selected");
            FileSelect.tips(0);    
        }
        return;
    });
     
    $("[node-type='file.domList']").delegate("a", "click", function(e){
        e.stopPropagation();
    });

    //文件操作
    $("[node-type='fileOpts']").click(function(e){
        var lang = '';
        var action = $(this).attr("node-data");
        var file_count = FileSelect.getCount();
        switch(action)
        {
          case 'file.sign':
            var str = FileSelect.getSelect(action);
            if(str!="")
            {
                var data = {
                    CONTENT_ID_STR : str,
                    SORT_ID: FF.params.SORT_ID,
                    FILE_SORT: 1,
                    action: 'sign'
                };

                FF.fileSign(data, function(flag, backdata){
                  if(flag)
                  {
                      alert(backdata.tips);
                      var arr = str.split(",");
                      $.each(arr, function(i, n){
                          $("[node-type='file.domItem'][node-data='" + n + "']").find(".item-sign-statu").remove();
                      });
                      return;
                  }
                  else
                  {
                      alert("签阅失败");
                      return;
                  }
                });
            }
            break;
            case 'file.download': 
              var select = FileSelect.getSelect(action); 
              if(tag==1)return;//处理未签阅文件 不能下载
              if(file_count > 1 && window.confirm("一次下载多个文件需要在服务器上做压缩处理，会占用较多服务器CPU资源，确定继续下载吗？该操作请不要下载超过128MB的大文件"))
                  window.location.href = "down.php?FILE_SORT=" + FF.params.FILE_SORT +"&SORT_ID=" + FF.params.SORT_ID +"&start=" + FF.params.start +"&CONTENT_ID=" + select; 
              else if(file_count == 1)
                  window.location.href = "down.php?FILE_SORT=" + FF.params.FILE_SORT +"&SORT_ID=" + FF.params.SORT_ID +"&start=" + FF.params.start +"&CONTENT_ID=" + select;
              break;
        }
    });

});