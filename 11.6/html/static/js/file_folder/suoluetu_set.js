FF.url = {
    api : 'api.php'
};
var tag;
var count=0;
//�ļ�ѡ�����
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
                this.tipsDom.html('����·��ļ��հ�������ж�ѡ��');
                break;
            case 1 :
                if(count.length > 0){
                    count.text(parseInt(count.text()) + 1);
                }else{
                    this.optsWrapperDom.show();
                    this.tipsDom.html('�Ѿ�ѡ��<span node-type="file.selectCount">1</span>���ļ�');
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
                this.tipsDom.html('�Ѿ�ѡ��<span node-type="file.selectCount">1</span>���ļ�').find("[node-type='file.selectCount']").text(n);
        }

        //�������ȫѡ��
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
    getSelect: function(action){//��ȡѡ�е��ļ�
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
                   	   alert('����δ��ǩ�ĵ��ļ�����Щ���ܱ�һ�����أ������Ҫ��������ǩ����Щ�ļ�!');
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
            this.tipsDom.html('�Ѿ�ѡ��<span node-type="file.selectCount">1</span>���ļ�').find("[node-type='file.selectCount']").text(n);
        }else{
            FileSelect.tips(count);//��̬ˢ��ѡ���ļ�����
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

    //�ļ�ȫѡ
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

    //�ļ�����
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
                      alert("ǩ��ʧ��");
                      return;
                  }
                });
            }
            break;
            case 'file.download': 
              var select = FileSelect.getSelect(action); 
              if(tag==1)return;//����δǩ���ļ� ��������
              if(file_count > 1 && window.confirm("һ�����ض���ļ���Ҫ�ڷ���������ѹ��������ռ�ý϶������CPU��Դ��ȷ�����������𣿸ò����벻Ҫ���س���128MB�Ĵ��ļ�"))
                  window.location.href = "down.php?FILE_SORT=" + FF.params.FILE_SORT +"&SORT_ID=" + FF.params.SORT_ID +"&start=" + FF.params.start +"&CONTENT_ID=" + select; 
              else if(file_count == 1)
                  window.location.href = "down.php?FILE_SORT=" + FF.params.FILE_SORT +"&SORT_ID=" + FF.params.SORT_ID +"&start=" + FF.params.start +"&CONTENT_ID=" + select;
              break;
        }
    });

});