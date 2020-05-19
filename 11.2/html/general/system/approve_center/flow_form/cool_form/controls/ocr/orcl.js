

function gethtml()
{

    var row_num =  jQuery('#row_num').val();
    var r_title = "";
    var r_type="";
    var r_value="";
    var r_valuelist="";
    for(var i=1;i<= row_num ;i++)
    {
        if(typeof jQuery('#tdTitle_'+i).val()== "undefined" || typeof jQuery('#tdValue_'+i).val()=='undefined'  )
        {
            continue;
        }
         r_title += jQuery('#tdTitle_'+i).val()+'`';
         r_type += jQuery('#tdType_'+i).val()+'`';
         r_value += jQuery('#tdValue_'+i).val()+'`'
         r_valuelist += jQuery('#tdValuelist_'+i).val()+'`'
    }


    var arr = {title:r_title,value:r_value,type:r_type,valuelist:r_valuelist};
    return arr;
}


function add_r(type,row_i,data)
{


        var row_num = jQuery('#row_num').val();
        if(row_num === "")
        {
            row_num =1;
        }else
        {
            ++row_num;
        }
        if(type == 2)
        {
            var rHtml = '<tr class="TableData"  style="text-align:center;" id="tr_'+ (row_i+1) +'">'+
                '<td><input disabled="true" type="text" value="'+ data[row_i] +'"  class="cke_dialog_ui_input_text" id="tdTitle_'+(row_i+1) +'"></td>'+
                '<td><select id="tdType_'+(row_i+1) +'" class="cke_dialog_ui_input_select" onchange="changeType('+ (row_i+1)+')"><option value="1">列表</option><option value="0">其他</option></select></td>'+
                '<td><input type="text" value="" style="width:100%;text-align:left;" class="cke_dialog_ui_input_text"  id="tdValue_'+(row_i+1)+'"></td>'+
                '<td id="tdadd"><input type="text" value="" style="width:100%;text-align:left;" class="cke_dialog_ui_input_text"  id="tdValuelist_'+(row_i+1)+'"></td>'+
                ' </tr>'
            jQuery('#mapTable').append(rHtml);
            jQuery('#row_num').val(data.length);

        }else
        {
            var rHtml = '<tr class="TableData"  style="text-align:center;" id="tr_'+ row_num +'">'+
                '<td><input type="text" value=""  class="cke_dialog_ui_input_text" id="tdTitle_'+row_num +'"></td>'+
                '<td><input type="text" value="" style="width:100%;text-align:left;" class="cke_dialog_ui_input_text"  id="tdValue_'+row_num +'"></td>'+
                '<td><a title="删除" href="javascript:del_r('+ row_num + ')"><img src="/static/images/form/delete.png"></a></td>'+
                ' </tr>'

            jQuery('#mapTable').append(rHtml);
            jQuery('#row_num').val(row_num);
        }



}

function del_r(num)
{

    jQuery("#tr_"+num).remove();
    //var numCount =  jQuery('#row_num').val(row_num);
  //  jQuery('#row_num').val(numCount-1);
}

// InitStyle();
function modelChange(url,val)
{
    jQuery('#row_num').val("");
    jQuery('#mapTable').html("");
    if(val != "diy")
    {

        jQuery('#actDel').hide();
        jQuery('#btn_add').hide();

        jQuery.ajax({
            type: 'GET',
            url: url + val,
            success: function(data){
                if(data == "nodata")
                {
                    alert('没有此模板信息');
                }else
                {
                    var configData = data;
                    var configArr = configData.split(',');


                    for(var i= 0 ;i<=configArr.length-1;i++)
                    {
                        add_r(2,i,configArr);
                    }

                }


            },
            error: function(){
                alert('模板连接失败');
            }
        });
    }else
    {
        jQuery('#actDel').show();
        jQuery('#btn_add').show();
        //var mapTitle =  jQuery(el).attr('maptitle');
       // var mapValue =  jQuery(el).attr('mapvalue');
       // alert(mapValue);
        add_r();
    }

}


function changeType(val)
{
   var typef=  jQuery('#tdType_'+val+' option:selected').val();
   if(typef == 0)
   {
       jQuery('#tdValuelist_'+val).hide();

   }else
   {
       jQuery('#tdValuelist_'+val).show();
   }

}