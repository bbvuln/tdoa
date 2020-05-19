
function AddItem()
{
	var txt = jQuery('#txtText');
	var val = txt.val();
	if(val != "" && valid_ctrl_name(val))
	{
		jQuery('#cmbText').append('<option value="' + val + '">' + val + '</option>');
		txt.val('');
		txt.focus();
	}
}

function EditItem()
{
	var txt = jQuery('#txtText');
	var val = txt.val();
	if(val != "" && valid_ctrl_name(val))
	{
		var option = jQuery('#cmbText').find("option:selected");
		if(option.length > 0)
		{
			option.val(val);
			option.text(val);
			txt.val('');
			txt.focus();
		}
	}
}

function DeleteItem()
{
	var option = jQuery('#cmbText').find("option:selected");
	if(option.length > 0)
	{
		option.remove();
		jQuery('#txtText').val('');
	}
}

function OnSelectItem( combo )
{
	jQuery('#txtText').val(jQuery(combo).val());
}

function SetDefault()
{
	var option = jQuery('#cmbText').find("option:selected");
	if(option.length > 0)
	{
		jQuery('#txtDefault').val(option.val())
	}
}

function MoveUp()
{
	var option = jQuery('#cmbText').find("option:selected");
	if(option.length > 0)
	{
		if(option.prev().length > 0)
		{
			option.insertBefore(option.prev());
		}
	}
}

function MoveDown()
{
	var option = jQuery('#cmbText').find("option:selected");
	if(option.length > 0)
	{
		if(option.next().length > 0)
		{
			option.insertAfter(option.next());
		}
	}
}

function parseOptions(el)
{
	var dataCodes = jQuery(el).find('option:selected').attr('dataCodes');
	jQuery('#txtText').val('');
	jQuery('#txtDefault').val('');
	jQuery('#cmbText').empty();
	jQuery('#txtText').css('background-color', '#fff');
	jQuery('#txtText').prop('disabled', false);
	jQuery('#controlArea').css('display', '');
	if(dataCodes != '')
	{
		jQuery('#txtText').css('background-color', 'buttonface');
		jQuery('#txtText').prop('disabled', true);
		jQuery('#controlArea').css('display', 'none');
		var dataCodesArr = dataCodes.split(',');
		for(var count = 0; count < dataCodesArr.length; count++)
		{
			var optionHtml = '<option value="'+dataCodesArr[count]+'">'+dataCodesArr[count]+'</option>';
			jQuery('#cmbText').append(optionHtml);
		}
	}
}