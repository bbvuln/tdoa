//autocomplete实现模糊选择
$(document).ready(function(){
    tag = '1';
    $("#TOGGLE_BLUR").click(function(){
       if(tag=='1'){
            $('#OFFICE_DEPOSITORY').val('-1');
            $('#OFFICE_PROTYPE').val('-1');
            $('#PRO_ID').val('-1');
            $("#BLURRED").show();
            $("#mytag").val('');
            $("#mytag").val('0');
            $(".set_only select").attr("disabled",true); 
            $("#PRO_NAME").focus();
            tag = '0';
        }else if(tag == '0'){
            $("#BLURRED").hide();
            $("#PRO_NAME").val('');
            $("#project-id").val('');
            $("#mytag").val('1');
            $(".set_only select").attr("disabled",false); 
            tag = '1';
       }
    });
    $("#PRO_NAME").keyup(function(){
        $("#project-id").val('');
    });
    
  $(function() {
    $( "#PRO_NAME" ).autocomplete({
      minLength: 0,
      source: '../apply/name_ajax.php',
      focus: function( event, ui ) {
        $( "#PRO_NAME" ).val( ui.item.text );
        $( "#project-id" ).val( ui.item.id ); 
        return false;
      },
      select: function( event, ui ) {
        $("#PRO_NAME").val( ui.item.text );
        $("#project-id" ).val( ui.item.id ); 
        $("#stock").val( ui.item.stock ); 
        $("#THIS_PRICCE").val( ui.item.pro_price );
        $("#getstock").html(ui.item.stock);
        $("#np").dpNumberPicker({
         value: 0,
         min: 0,         
         max: ui.item.stock,
         afterChange: function(){
            var num = $(this).find('input').val();//获取input的值
            if(num>=parseInt(ui.item.stock)){
                $('#StockAlert').show();
            }
            else{
            $('#StockAlert').hide();
            }
            $('#TRANS_QTY').val(num);//将值放入隐藏域

         },         
     });
        return false;
      }
    })
    .data('uiAutocomplete')._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a data-id = '"+item.id+"'>" + item.text + "</a>" )
        .appendTo( ul );
    };
  });
});
