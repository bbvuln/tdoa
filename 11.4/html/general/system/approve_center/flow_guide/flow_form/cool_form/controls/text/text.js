function changeDataType(el)
{
    if(typeof el == 'undefined')
    {
        var optionDataType = jQuery('#txtVariable').find('option:selected').attr('dataType');
    }
    else
    {
        var optionDataType = jQuery(el).find('option:selected').attr('dataType');
    }
	if(optionDataType == '')
	{
		jQuery('#txtDataType').attr('disabled', false);
		jQuery('#txtDataType').find('option[value="text"]').prop('selected', true);
	}
	else if(optionDataType == 'money' || optionDataType == 'varchar')
	{
		jQuery('#txtDataType').attr('disabled', true);
		jQuery('#txtDataType').find('option[value="text"]').prop('selected', true);
	}
	else if(optionDataType == 'number')
	{
		jQuery('#txtDataType').attr('disabled', true);
		jQuery('#txtDataType').find('option[value="number"]').prop('selected', true);
	}
	else if(optionDataType == 'float')
	{
		jQuery('#txtDataType').attr('disabled', true);
		jQuery('#txtDataType').find('option[value="float"]').prop('selected', true);
	}
	else if(optionDataType == 'date' || optionDataType == 'time' || optionDataType == 'datestamp')
	{
		jQuery('#txtDataType').attr('disabled', true);
		jQuery('#txtDataType').find('option[value="date"]').prop('selected', true);
	}
	else if(optionDataType == 'email')
	{
		jQuery('#txtDataType').attr('disabled', true);
		jQuery('#txtDataType').find('option[value="email"]').prop('selected', true);
	}
}