
//对话框事件的回调函数，确定为ok，取消为cancel，load为页面加载完成
window.onDialogEvent = function(e){
    switch(e.name){
        case 'ok':
            e.data.hide = true;
            if(typeof(OnOK) == 'function')
            {
                e.data.hide = OnOK();
            }
            break;
        case 'cancel':
            e.data.hide = true;
            break;
        case 'load':
            InitStyle();
            break;
    }
};

function InitStyle()
{
    jQuery('input[type="text"]').addClass('cke_dialog_ui_input_text');
    jQuery('input[type="file"]').addClass('cke_dialog_ui_input_text');
    jQuery('input[type="password"]').addClass('cke_dialog_ui_input_password');
    jQuery('input[type="radio"]').addClass('cke_dialog_ui_radio_input');
    jQuery('input[type="checkbox"]').addClass('cke_dialog_ui_checkbox_input');
    jQuery('textarea').addClass('cke_dialog_ui_input_textarea');
    jQuery('select').addClass('cke_dialog_ui_input_select');
    jQuery('a.button').addClass('cke_dialog_ui_button');
    jQuery('a.button span').addClass('cke_dialog_ui_button');
}

function valid_charactar(str, chars)
{
    var re = new RegExp("[" + chars + "]+", "i");
    return str.search(re) < 0;
}
