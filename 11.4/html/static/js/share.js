var short_url;
var jiathis_config;
//取消分享
function cancelShare(share_id,module_id){ 
    var url = '/share/cancel.php';
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            share_id : share_id,
            module_id : module_id
        },
        success: function(data){
            
        },
        error: function (){
            alert("获取数据请求失败");
        }
    });
    document.getElementById('qxShare').setAttribute('class','dis_none');
}
//分享弹框
function shareShow(module,module_id){
    var url = '/share/handle.php';
    $.ajax({
        type: 'GET',
        url: url,
        data: {
            module : module,
            module_id : module_id
        },
        success: function(data){
            var data = JSON.parse(data);
            if(data.status == "1")
            {                
                if(data.img_url !='')
                {
                    $("#erweima").attr('src',data.img_url);
                }
                if( data.short_url != ""){
                    $('#copy_inp').val(data.short_url);
                    short_url = data.short_url;
                    jiathis_config = {
                        title:data.title,
                        summary:data.content,
                        url:short_url
                    }
                }
            }else{
                alert("获取短链接失败");
            }
        },
        error: function (data){
            alert("获取数据请求失败");
        }
    });    
    document.getElementById('shareBox').setAttribute('class','dis_show');
    document.getElementById('share').setAttribute('class','dis_show');
}




//关闭分享弹框
function shareDel(){
    document.getElementById('shareBox').setAttribute('class','dis_none');
    document.getElementById('share').setAttribute('class','dis_none');
}

//二维码弹框
function erweimaShow(){
    
    document.getElementById('erweima_box').setAttribute('class','dis_show');
    document.getElementById('share').setAttribute('class','dis_none');
}

//关闭二维码
function erweimaDel(){
    document.getElementById('erweima_box').setAttribute('class','dis_none');
    document.getElementById('shareBox').setAttribute('class','dis_none');
}

//复制弹框
function copyShow(){
    document.getElementById('copy_box').setAttribute('class','dis_show');
    document.getElementById('copyShaDow').setAttribute('class','dis_show');
    
}

//关闭复制弹框
function copyDel(){
    document.getElementById('copy_box').setAttribute('class','dis_none');
    document.getElementById('copyShaDow').setAttribute('class','dis_none');
}

//复制url内容
function copyUrl(){
    document.getElementById('copy_inp').select(); 
    document.execCommand("Copy"); 
    alert('已复制');
}


