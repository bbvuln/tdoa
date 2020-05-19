
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
