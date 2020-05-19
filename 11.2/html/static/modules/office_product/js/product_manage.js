var $=jQuery;
function check_product_manage()
{
	var reg = new RegExp("^[0-9]*$");
	var reg1 = new RegExp("^[0-9]+(.[0-9]{1,3})?$");
	
	var PRO_NAME = $("input[name=PRO_NAME]").val();
	if(PRO_NAME=='')
	{
		alert('办公用品名称不能为空');
		return false;
	}
	var OFFICE_DEPOSITORY = $("select[name=OFFICE_DEPOSITORY]").val();
	if(OFFICE_DEPOSITORY=='')
	{
		alert('请选择办公用品库');
		return false;
	}
	var OFFICE_TYPE2 = $("select[name=OFFICE_TYPE2]").val();
	if(OFFICE_TYPE2=='')
	{
		alert('请选择办公用品物品登记类型');
		return false;
	}
	var OFFICE_PROTYPE = $("select[name=OFFICE_PROTYPE]").val();
	if(OFFICE_PROTYPE=='' || OFFICE_PROTYPE=='-1')
	{
		alert('请选择办公用品类别');
		return false;
	}
	/*var PRO_CODE = $("input[name=PRO_CODE]").val();
	if(PRO_CODE=='')
	{
		alert('办公用品编码不能为空');
		return false;
	}*/
	var PRO_STOCK = $("input[name=PRO_STOCK]").val();
	if(PRO_STOCK=='')
	{
		alert('当前库存不能为空');
		return false;
	}else if(!reg.test(PRO_STOCK))
	{
		alert('库存只能为数字');
		return false;
	}
	var PRO_LOWSTOCK = $("input[name=PRO_LOWSTOCK]").val();
	var PRO_MAXSTOCK = $("input[name=PRO_MAXSTOCK]").val();
	if(parseInt(PRO_MAXSTOCK) < parseInt(PRO_LOWSTOCK))
	{
		alert('最高警戒库存不能小于最低警戒库存！');
		return false;
	}
	var PRO_DESC = $("textarea[name=PRO_DESC]").val();
	if(PRO_DESC=='')
	{
		alert('规格/型号不能为空');
		return false;
	}
	var PRO_PRICE = $("input[name=PRO_PRICE]").val();
	if(PRO_PRICE!="" && !reg1.test(PRO_PRICE))
	{
		alert('请输入正确的价格');
		return false;
	}
	if($("input[name=PRO_ID]").val()!="")
	{
		var PRO_ID = $("input[name=PRO_ID]").val();
	}else
	{
		var PRO_ID ="";
	}
	$.ajax({
			type: 'POST',
			url: '/inc/utility_office.php',
			cache: false,
			data: {
						"PRO_ID": PRO_ID,
						"PRO_NAME": PRO_NAME,
						"OFFICE_DEPOSITORY": OFFICE_DEPOSITORY,
						"OFFICE_PROTYPE": OFFICE_PROTYPE,
						"PRO_DESC": PRO_DESC,
						"action":"check_add"
				   },
			success: function(data)
			{
				if(data==1)
				{
					$('#check_product').submit();
				}else
				{
					alert("同库下不允许出现同名称,规格/型号相同的办公用品");
				}
			}
	});	
}