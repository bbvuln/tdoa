var $=jQuery;
function check_product_manage()
{
	var reg = new RegExp("^[0-9]*$");
	var reg1 = new RegExp("^[0-9]+(.[0-9]{1,3})?$");
	
	var PRO_NAME = $("input[name=PRO_NAME]").val();
	if(PRO_NAME=='')
	{
		alert('�칫��Ʒ���Ʋ���Ϊ��');
		return false;
	}
	var OFFICE_DEPOSITORY = $("select[name=OFFICE_DEPOSITORY]").val();
	if(OFFICE_DEPOSITORY=='')
	{
		alert('��ѡ��칫��Ʒ��');
		return false;
	}
	var OFFICE_TYPE2 = $("select[name=OFFICE_TYPE2]").val();
	if(OFFICE_TYPE2=='')
	{
		alert('��ѡ��칫��Ʒ��Ʒ�Ǽ�����');
		return false;
	}
	var OFFICE_PROTYPE = $("select[name=OFFICE_PROTYPE]").val();
	if(OFFICE_PROTYPE=='' || OFFICE_PROTYPE=='-1')
	{
		alert('��ѡ��칫��Ʒ���');
		return false;
	}
	/*var PRO_CODE = $("input[name=PRO_CODE]").val();
	if(PRO_CODE=='')
	{
		alert('�칫��Ʒ���벻��Ϊ��');
		return false;
	}*/
	var PRO_STOCK = $("input[name=PRO_STOCK]").val();
	if(PRO_STOCK=='')
	{
		alert('��ǰ��治��Ϊ��');
		return false;
	}else if(!reg.test(PRO_STOCK))
	{
		alert('���ֻ��Ϊ����');
		return false;
	}
	var PRO_LOWSTOCK = $("input[name=PRO_LOWSTOCK]").val();
	var PRO_MAXSTOCK = $("input[name=PRO_MAXSTOCK]").val();
	if(parseInt(PRO_MAXSTOCK) < parseInt(PRO_LOWSTOCK))
	{
		alert('��߾����治��С����;����棡');
		return false;
	}
	var PRO_DESC = $("textarea[name=PRO_DESC]").val();
	if(PRO_DESC=='')
	{
		alert('���/�ͺŲ���Ϊ��');
		return false;
	}
	var PRO_PRICE = $("input[name=PRO_PRICE]").val();
	if(PRO_PRICE!="" && !reg1.test(PRO_PRICE))
	{
		alert('��������ȷ�ļ۸�');
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
					alert("ͬ���²��������ͬ����,���/�ͺ���ͬ�İ칫��Ʒ");
				}
			}
	});	
}