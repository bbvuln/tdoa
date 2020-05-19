var $=jQuery;
$(document).ready(function(){
	$(window).resize(function(){
		$('.product_main_div').css('height',setMainDivHeight());
		$('.code_fine_center').css('height',setMainDivHeight());
	});
	$(window).trigger('resize');
	
});
function setMainDivHeight()
{
	var windowsHeight=$(window).outerHeight(true);
	if($('.code_fine_top').length>0)
	{
		var windowsTopHeight=$('.code_fine_top').outerHeight(true);
	}
	if($('.bottom_div').length>0){
		var windowsBottomHeight=$('.bottom_div').outerHeight(true);
	}
	var MainDivHeight=windowsHeight-(25+windowsBottomHeight+windowsTopHeight);
	return MainDivHeight;
}
//-------物品类别的处理---------
var codeDefine={
	CheckForm:function()
	{
		var type_name=$('#TYPE_NAME').val();
		if(type_name=='')
		{
			alert(tip);
			$('#TYPE_NAME').focus();
			return false;
		}
		var CODE_ID=$('#CODE_ID').val();//判断是否为编辑
		var flag='1';
		var DEPOSITORY=$('#DEPOSITORY').val();
		var TYPE_ORDER=$('#TYPE_ORDER').val();
		if(CODE_ID==undefined){
			$.post('new_product_category.php',{'DEPOSITORY':DEPOSITORY,'flag':flag,'type_name':type_name,'TYPE_ORDER':TYPE_ORDER},function(data){
				if(data=='sameName')
				{
					$('.tip').show();
					$('#tip_message').html(tip_maessage);
					$('#TYPE_NAME').val('');
					$('#TYPE_NAME').focus();
//					$('.tip').hide(5000);
					return false;
				}
				else if(data=='true')
				{
					$('#tip_message').html('');
					$('#tip_message').html(success_maessage);
					$('.tip').show();
//					$('.tip').hide(3000);
				}
			});	
		}
		else
		{
			$.post('type_update.php',{'DEPOSITORY':DEPOSITORY,'CODE_ID':CODE_ID,'type_name':type_name,'TYPE_ORDER':TYPE_ORDER},function(data){
				if(data=='sameName')
				{
					$('.tip').show();
					$('#tip_message').html(tip_maessage);
					$('#TYPE_NAME').val('');
					$('#TYPE_NAME').focus();
//					$('.tip').hide(5000);
					return false;
				}
				else if(data=='true')
				{
					$('.tip').show();
					$('#tip_message').html(success_maessage);
					
				}
			});	
		}
	},
	ReFillForm:function()
	{
		window.location="codedefine.php?kname=OFFICE_PROTYPE&codeid=OFFICE_PROTYPE";
	}	
}
 var check_legal_product={
		
		check_is_legal:function()
		{
			 var PRO_NAME = document.form1.PRO_NAME.value;
			 if(PRO_NAME=="")
			 { 
			     alert(td_lang.office_product.msg8);
			   	 form1.PRO_NAME.focus();
			     return false;
			 }
			 var OFFICE_DEPOSITORY=document.form1.OFFICE_DEPOSITORY.value;
			 if(OFFICE_DEPOSITORY=="")
			 {
				 alert(td_lang.office_product.msg9);
				 return false;
			 }
			 var OFFICE_PROTYPE=document.form1.OFFICE_PROTYPE.value;
			 if(OFFICE_PROTYPE==""||OFFICE_PROTYPE=='-1')
			 {
				 alert(td_lang.office_product.msg10);
				 return false;
			 }
			 var PRO_STOCK=document.form1.PRO_STOCK.value;
			 var PRO_LOWSTOCK=document.form1.PRO_LOWSTOCK.value;
			 var PRO_MAXSTOCK=document.form1.PRO_MAXSTOCK.value;
			 
			 if(PRO_STOCK=="")
			 {
				 alert(td_lang.office_product.msg11);
				 form1.PRO_STOCK.focus();
				 return false;
			 }
			 if(isNaN(PRO_STOCK))
			 {
				 alert(td_lang.office_product.msg12);
				 form1.PRO_STOCK.focus();
				 return false;
			 }
			 if(PRO_LOWSTOCK!==""&isNaN(PRO_LOWSTOCK))
			 {
				 alert(td_lang.office_product.msg13);
				 form1.PRO_LOWSTOCK.focus();
				 return false;
			 }
			 if(PRO_MAXSTOCK!==''&isNaN(PRO_MAXSTOCK))
			 {
				 alert(td_lang.office_product.msg14);
				 form1.PRO_MAXSTOCK.focus();
				 return false;
			 }
			 if(PRO_LOWSTOCK!==""&&parseInt(PRO_STOCK)<parseInt(PRO_LOWSTOCK))
			 {
				 alert(td_lang.office_product.msg15);
				 form1.PRO_LOWSTOCK.value='';
				 form1.PRO_LOWSTOCK.focus();
				 return false;
			 }
			 if(PRO_LOWSTOCK!==""&&parseInt(PRO_STOCK)>parseInt(PRO_MAXSTOCK))
			 {
				 alert(td_lang.office_product.msg16);
				 form1.PRO_MAXSTOCK.value='';
				 form1.PRO_MAXSTOCK.focus();
				 return false;
			 }
			 var PRO_PRICE=document.form1.PRO_PRICE.value;
			 if(PRO_PRICE!==''&&isNaN(PRO_PRICE))
			 {
				 alert(td_lang.office_product.msg17);
				 form1.PRO_PRICE.value='';
				 form1.PRO_PRICE.focus();
				 return false;
			 }
			 jQuery('#check_product').submit();			 
		}
}