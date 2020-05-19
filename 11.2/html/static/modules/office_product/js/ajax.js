var $=jQuery;
//ajax删除方法
$(document).ready(function(){
    $('.delete').click(function(){
        var a=confirm('确定要删除?');
        if(!a){
            return;
        }
        var name = $(this).attr('name');
        var id   = $(this).attr('id');
        var action = $(this).attr('action');
        $.ajax({
            type: 'POST',
            url: '/inc/utility_office.php',
            cache: false,
            data: {
                "name": name,
                "id": id,
                "action":action,
            },
            success: function(data)
            {
                if(data==1)
                {
                    $('#tr_'+id).hide('slow');
                }else{
                    alert("删除失败请重试！");
                }
            }
        });
    });
    $('.update_grant').click(function(){
        var id   = $(this).attr('id');
        var delet= $(this);
        $.ajax({
            type: 'POST',
            url: '/inc/utility_office.php',
            cache: false,
            data: {
                "id": id,
                "action":"update_grant",
            },
            success: function(data)
            {
                if(data==1)
                {
                    alert('发放成功');
                    //delet.parents('.GRANT_STATUS').html('已发放');
                    //$('#transhistory_'+id).hide('slow');
                    window.location.reload();
                }else{
                    alert("发放失败请重试！");
                }
            }
        });
    });
    //审核通过或失败操作  dept_approval/pending_list.php
    $('.status').click(function(){

        var checknum = $("#checknum").val();
        if(checknum=='0')
        {
            return false;
        }
        var id   = $(this).attr('id');
        var trans_id_str = $("#trans_id_str").val();
        var pro_id_str   = $("#pro_id_str").val();
        var TRANS_ID     = $("#TRANS_ID").val();
        var CYCLE_NO     = $("#CYCLE_NO").val();
        var RETURN_DATE  = $("#RETURN_DATE").val();
        var repeat       = $("#repeat").val();
        //var del= $(this);
        this.disabled=true;
        $.ajax({
            type: 'POST',
            url: '/inc/utility_office.php',
            cache: false,
            data: {
                "id": id,
                "trans_id_str": trans_id_str,
                "pro_id_str": pro_id_str,
                "trans_id": TRANS_ID,
                "cycle_no": CYCLE_NO,
                "return_date": RETURN_DATE,
                "repeat": repeat,
                "action":"status"
            },
            success: function(data)
            {
                if(data==1)
                {
                    alert('审批成功');
                    window.location.href='pending_list.php';
                }else if(data==2)
                {
                    alert('库存不足');
                }
                else
                {
                    alert("审批失败请重试！");
                }
            }
        });
    });
    //库存--放弃操作
    $('.trans_del').click(function(){
        var id   = $(this).attr('id');
        //var del= $(this);
        $.ajax({
            type: 'POST',
            url: '/inc/utility_office.php',
            cache: false,
            data: {
                "id": id,
                "action":"MY_TRANSHISTORY_DEL"
            },
            success: function(data)
            {
                if(data!='3')
                {
                    alert('操作成功');
                    if(data == '1')
                    {
                        window.location.href = 'query_list.php?action=two';
                    }
                    else if(data == '2'){
                        window.location.href = 'query_list.php?action=one';
                    }
                }else{
                    alert("操作失败请重试！");
                }
            }
        });
    });
    /**
     * 全选 by 王瑞杰
     * 信息管理列表
     *
     */
    $("#allbox_for").change(function(){
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
     * 分页
     */
    var element = $("#email-pagination");
    var row = $("#per_pages").val();
    var total = $("#total_pages").val();
    var page = $("#page").val();
    var options = {
        currentPage: 1,
        numberOfPages: 1,
        totalPages: 10,
        itemTexts: function (type, page, current) {
            switch (type) {
                case "first":
                    return "<a href='#.php?page="+page+"&per_pages="+row+"'>首页</a>";
                case "prev":
                    return "<a href='#.php?page="+page+"&per_pages="+row+"'>上一页</a>";
                case "next":
                    return "<a href='#.php?page="+page+"&per_pages="+row+"'>下一页</a>";
                case "last":
                    return "<a href='#.php?page="+total+"&per_pages="+row+"'>末页</a>";
                case "page":
                    return "<a href='#.php?page="+page+"&per_pages="+row+"'>"+page+"</a>";
            }
        },
        onPageChanged: function(e,oldPage,newPage){
            $('.page-changed-select').val(newPage);
        }
    }
//    element.bootstrapPaginator(options);

});
// 根据库获取物品类型下拉信息
function depositoryOfTypeOne(id,type)
{
    var action = '';
    if(id != '')
    {
        if(type=='1')
        {
            action = 'get_office_type1';
        }else{
            action = 'get_office_type';
        }
        $.ajax({
            type: "POST",
            url: "/inc/utility_office.php",
            data: {
                'id': id,
                'action': action
            },
            success: function(data){
                $('#OFFICE_PROTYPE'+type).html(data);
                $('#PRO_ID'+type).html(data);
            }
        });
    }

}
// 根据物品类型获取办公用品下拉信息
function depositoryOfProductsOne(id,type)
{
    var action = '';
    var flag =($('#TRANS_FLAG_LOG').val());
    $('#DEPOSITORY_ID').val(id);
    if(id != '')
    {
        if(type=='1')
        {
            action = 'get_office1';
        }else{
            action = 'get_office';
        }
        $.ajax({
            type: "POST",
            url: "/inc/utility_office.php",
            data: {
                'id': id,
                'action': action,
                'type': type,
                'flag': flag
            },
            success: function(data){
                if(type=='2'){type='';}
                $('#PRO_ID'+type).html(data);
            }
        });
    }
}

//获得办公用品库存
function GetProduct(id)
{
    if(id != '' && id!='-1')
    {
        $.ajax({
            type: "POST",
            url: "/inc/utility_office.php",
            data: {
                'id': id,
                'action': 'get_pro_stock'
            },
            success: function(data){
                if(data!='false'){
                    $("#STOCK").val(data);
                    var set_stock_tag = $("#set_stock_tag").val();
                    if(set_stock_tag == '1')//需要填写申请数量 进行验证
                    {
                        var set_exit = $('#TRANS_QTY').val();
                        $("#getstock").html(data);
                        if(set_exit =='')//初始化
                        {
                            set_exit = '0';
                        }
                        $("#np").dpNumberPicker({
                            value: parseInt(set_exit),
                            min: 1,
                            max: data,
                            editable: true,
                            afterChange: function(){
                                var num = $(this).find('input').val();//获取input的值
                                if(num>=parseInt(data)){
                                    $('#StockAlert').show();
                                }
                                else{
                                    $('#StockAlert').hide();
                                }
                                $('#TRANS_QTY').val(num);//将值放入隐藏域

                            },
                        });
                    }
                }else{
                    alert('提交数量超过库存，请重新填写！');
                    return (false);
                }
            }
        });
    }
    //获取单价
    get_price(id);
}
function get_price(id)
{
    if(id != "")
    {
        $.ajax({
            type: "POST",
            url: "/inc/utility_office.php",
            data: {
                'id': id,
                'action': 'get_price'
            },
            success: function(data){
                if(data != 'false')
                {
                    $('#THIS_PRICCE').val(data);
                }
            }
        });
    }
}
//验证提交数量是否超过库存
function check_pro_stock(id,TRANS_QTY,type)
{
    if(id != '')
    {
        $.ajax({
            type: "POST",
            url: "/inc/utility_office.php",
            data: {
                'id': id,
                'trans_qty': TRANS_QTY,
                'type': type,
                'action': 'check_pro_stock'
            },
            success: function(data){
                if($.trim(data)=='1')
                {
                    document.form1.submit();
                }
                else if(data=='2')
                {
                    alert('提交数量超过库存，请重新填写！');
                    return (false);
                }
            }
        });
    }
}

//办公用品申领页面表单验证
function CheckForm()
{
    var PRO_NAME = $('#PRO_NAME').val();
    var OFFICE_DEPOSITORY = $('#OFFICE_DEPOSITORY').val();

    if($("#mytag").val() == '1')
    {

        if(OFFICE_DEPOSITORY=="-1")
        {
            alert("请选择办公用品库！");
            $('#OFFICE_DEPOSITORY').focus();
            return (false);
        }else
        {
            var status1 = "";
            $.ajax({
                async:false,
                type: 'GET',
                url:'check_no.php',
                data:{
                    OFFICE_DEPOSITORY:OFFICE_DEPOSITORY
                },
                success: function(d){
                    status1 = d;
                }
            });
            var DEPT_MANAGER = $("input[name='DEPT_MANAGER']").val();
            if(status1==1 && DEPT_MANAGER=="")
            {
                alert("请选择部门审批人！");
                return false;
            }
        }

        var OFFICE_PROTYPE = $('#OFFICE_PROTYPE').val();
        if(OFFICE_PROTYPE=="-1")
        {
            alert("请选择办公用品类别！");
            $('#OFFICE_PROTYPE').focus();
            return (false);
        }

        var PRO_ID = $('#PRO_ID').val();
        var PRO_ID_TEXT = $('#PRO_ID_TEXT').val();
        if(PRO_ID=="-1" || PRO_ID_TEXT=="")
        {
            alert("请选择办公用品！");
            $('#PRO_ID').focus();
            return (false);
        }
    }
    else
    {
        if(OFFICE_DEPOSITORY =="-1" && PRO_NAME == '')
        {
            alert("办公用品模糊名称不能为空！");
            $('#PRO_NAME').focus();
            return (false);
        }
    }
    var TRANS_QTY = $('#TRANS_QTY').val();
    if(TRANS_QTY == '' || TRANS_QTY == '0')
    {
        alert("申请数量不能为0！");
        $('#np').focus();
        return (false);
    }else if(checknum(TRANS_QTY)=="0")
    {
        alert("申请数量必须为数字！");
        $('#np').focus();
        return (false);
    }else
    {
        if($("#mytag").val() == '0')
        {
            var project_id = $('#project-id').val();
            if(project_id=="")
            {
                alert("无对应办公用品信息，请重新检索");
            }
            else
            {
                var status1 = "";
                $.ajax({
                    async:false,
                    type: 'GET',
                    url:'check_no.php',
                    data:{
                        action: 'vague',
                        project_id:project_id
                    },
                    success: function(d){
                        status1 = d;
                    }
                });
                var DEPT_MANAGER = $("input[name='DEPT_MANAGER']").val();
                if(status1==1 && DEPT_MANAGER=="")
                {
                    alert("请选择部门审批人！");
                    return false;
                }
                check_pro_stock(project_id,TRANS_QTY,'apply');
            }
        }else
        {
            check_pro_stock(PRO_ID,TRANS_QTY,'apply');
        }

    }
    /*var REMARK = $('#REMARK').val();
     if(REMARK=="")
     {
     alert("备注信息不能为空！");
     $('#REMARK').focus();
     return (false);
     }*/
    var type=$("select[name='TRANS_FLAG']").val();
    /*if(type==3){
     var pro_id=$('#PRO_ID').val();
     if(pro_id==''){
     pro_id=$('#project-id').val();
     }
     var num=$('#TRANS_QTY').val();
     $.ajax({
     type:'POST',
     url: '/inc/utility_office.php',
     data: {
     'pro_id': pro_id,
     'num':num,
     'action':'project_num',
     },
     success: function(data) {
     switch(data)
     {
     case '1': alert('系统错误');break;
     case '2': alert('该物品不可归还');break;
     case '4': alert('归还数大于借出数');break;
     case '5': alert('该物品没有借出');break;
     }
     if(data==3){
     document.form1.submit();
     }
     }

     });
     }else{
     if(TRANS_QTY && REMARK){
     document.form1.submit();
     }else{alert(TRANS_QTY+'----'+REMARK)}
     }*/
}
function checknum(p)
{
    var l = p.length;
    var count=0;
    for(var i=0; i<l; i++)
    {
        var digit = p.charAt(i);
        if(digit == "." )
        {
            ++count;
            if(count>1)
            {
                return 0;
            }
        }
        else if(digit < "0" || digit > "9")
        {
            return 0;
        }
    }
    return 1;
}
function check_one(el)
{
    if(!el.checked)
        $("#allbox_for").prop('checked',false);
}
function get_checked(office_select)
{
    delete_str="";
    var str_ist = office_select;
    for(i=0;i<document.getElementsByName(str_ist).length;i++)
    {
        el=document.getElementsByName(str_ist).item(i);
        if(el.checked)
        {  val=el.value;
            delete_str+=val + ",";
        }
    }

    if(i==0)
    {
        el=document.getElementsByName(str_ist);
        if(el.checked)
        {  val=el.value;
            delete_str+=val + ",";
        }
    }
    return delete_str;
}
//信息管理中删除办公用品
function delete_office()
{
    delete_str=get_checked('office_select');
    if(delete_str=="")
    {
        alert("删除所选办公用品，请至少选择其中一条。");
        return;
    }
    msg='确认删除该用品吗？删除后该用品的全部信息将被清除！';
    if(window.confirm(msg))
    {
        $.ajax({
            type: 'POST',
            url: '/inc/utility_office.php',
            data: {
                'PRO_ID': delete_str,
                "action":'office_del',
            },
            success: function(data) {
//                  var rows = $("#per_pages").val();
//                  var page = $("#page").val();
//                  window.location.href = 'import.php?per_pages='+rows+'&page='+page;
                if(data=="1")
                {
                    var str_id = delete_str.split(","); //字符分割
                    for (i=0;i<str_id.length;i++ )
                    {
                        if(str_id[i] !=''){
                            $("#tr_"+str_id[i]).hide("slow");
                        }
                    }
                }else{
                    alert('删除失败');
                }
            }
        });
    }
}
//页面重置时清除最大库存提示
function clear_stock()
{
    $("#StockAlert").hide();
    $('#TRANS_QTY').val(0);
}