//从控件html中得到用户填写的配置信息
function gethtml() {
    debugger
    var res;
    var _title = '';
    var _value = '';
    var _type = '';
    var _valuelist = '';
    $.each($("#mapTable > tbody"), function(i){
        var billType = this.id;
        var tbody = $(this);
        var row_num = tbody.children('tr').length-1;
        var r_title = "";
        var r_type  = "";
        var r_value = "";
        var r_valuelist = "";
        for (var i=1;i<= row_num ;i++) {
            if (typeof tbody.find('#tdTitle_'+i).val()== "undefined" || typeof tbody.find('#tdValue_'+i).val()=='undefined') {
                continue;
            }
            r_title += tbody.find('#tdTitle_'+i).val()+'`';
            r_type  += tbody.find('#tdType_'+i).val()+'`';
            r_value += tbody.find('#tdValue_'+i).val()+'`';
            r_valuelist += tbody.find('#tdValuelist_'+i).val()+'`';
        }
        //去除末尾的
        r_title        = r_title.substr(0,r_title.length-1);
        r_type         = r_type.substr(0,r_type.length-1);
        r_value        = r_value.substr(0,r_value.length-1);
        r_valuelist    = r_valuelist.substr(0,r_valuelist.length-1);


        _title += billType + ':' + r_title + ',';
        _value += billType + ':' + r_value + ',';
        _type  += billType + ':' + r_type + ',';
        _valuelist += billType + ':' + r_valuelist + ',';
    });
    console.log(_type);
    //去除末尾的
    _title        = _title.substr(0,_title.length-1);
    _type         = _type.substr(0,_type.length-1);
    _value        = _value.substr(0,_value.length-1);
    _valuelist    = _valuelist.substr(0,_valuelist.length-1);
    res = {title:_title,value:_value,type:_type,valuelist:_valuelist};
    return res;
}

//逐行渲染票据模板
function add_r(modelType,row_i,data)
{
    var row_num = jQuery('#row_num').val();
    if (row_num === "") {
        row_num =1;
    } else {
        ++row_num;
    }
    var rHtml =
        '<tr id="tr_'+ (row_i+1) +'" class="TableData" style="text-align:center;" >'+
        '<td>' +
        '<input id="tdTitle_'+(row_i+1)+'" disabled="true" type="text" value="'+ data[row_i] +'" class="cke_dialog_ui_input_text" >' +
        '</td>'+
        '<td>' +
        '<select id="tdType_'+(row_i+1) +'" class="cke_dialog_ui_input_select" onchange="changeType('+ (row_i+1)+',\''+modelType+'\')">' +
        '<option value="1">列表</option>' +
        '<option value="0">其他</option>' +
        '</select>' +
        '</td>'+
        '<td>' +
        '<input type="text" value="" style="width:100%;text-align:left;" class="cke_dialog_ui_input_text"  id="tdValue_'+(row_i+1)+'">' +
        '</td>'+
        '<td>' +
        '<input type="text" value="" style="width:100%;text-align:left;" class="cke_dialog_ui_input_text"  id="tdValuelist_'+(row_i+1)+'">' +
        '</td>'+
        '</tr>';
    jQuery('#'+modelType).append(rHtml);
    jQuery('#row_num').val(data.length);
}

//不知道干什么用的，好像没用到
function del_r(num) {
    jQuery("#tr_"+num).remove();
}

//更换票据类型时，自动更换票据模板
// function modelChange(url,modelType) {
//     jQuery('#row_num').val("");
//
//     jQuery.ajax({
//         type: 'GET',
//         url: url + modelType,
//         success: function(data) {
//             if (data == "nodata") {
//                 alert('没有此模板信息');
//             } else {
//                 var configData = data;
//                 var configArr = configData.split(',');
//                 for (var i= 0 ;i<=configArr.length-1;i++) {
//                     add_r(modelType,i,configArr);
//                 }
//             }
//         },
//         error: function() {
//             alert('模板连接失败');
//         }
//     });
// }

//下拉框选择 （其他|列表） 的动态渲染
function changeType(val,modelType) {
    debugger
    var modelObj = jQuery('#'+modelType);
   var typef=  modelObj.find('#tdType_'+val+' option:selected').val();
   var listObj = modelObj.find('#tdValuelist_'+val);
   if (typef == 0) {
       listObj.val("");
       listObj.css('background','#D5D5D5');
       listObj.prop("disabled", true);
   } else {
       listObj.css('background','#FFFFFF');
       listObj.prop("disabled", false);
   }
}