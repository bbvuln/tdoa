var short_url;
var jiathis_config;
//ȡ������
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
            alert("��ȡ��������ʧ��");
        }
    });
    document.getElementById('qxShare').setAttribute('class','dis_none');
}
//������
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
                alert("��ȡ������ʧ��");
            }
        },
        error: function (data){
            alert("��ȡ��������ʧ��");
        }
    });    
    document.getElementById('shareBox').setAttribute('class','dis_show');
    document.getElementById('share').setAttribute('class','dis_show');
}




//�رշ�����
function shareDel(){
    document.getElementById('shareBox').setAttribute('class','dis_none');
    document.getElementById('share').setAttribute('class','dis_none');
}

//��ά�뵯��
function erweimaShow(){
    
    document.getElementById('erweima_box').setAttribute('class','dis_show');
    document.getElementById('share').setAttribute('class','dis_none');
}

//�رն�ά��
function erweimaDel(){
    document.getElementById('erweima_box').setAttribute('class','dis_none');
    document.getElementById('shareBox').setAttribute('class','dis_none');
}

//���Ƶ���
function copyShow(){
    document.getElementById('copy_box').setAttribute('class','dis_show');
    document.getElementById('copyShaDow').setAttribute('class','dis_show');
    
}

//�رո��Ƶ���
function copyDel(){
    document.getElementById('copy_box').setAttribute('class','dis_none');
    document.getElementById('copyShaDow').setAttribute('class','dis_none');
}

//����url����
function copyUrl(){
    document.getElementById('copy_inp').select(); 
    document.execCommand("Copy"); 
    alert('�Ѹ���');
}


