
//当前控件的ID编号
//页面Load时如果编辑器中有控件被选中，则设置为控件的ID编号
//页面Load时如果编辑器中没有控件被选中，则在CheckCtrlProp时调用get_ctrl_id获取
var ctrl_id = '';
//低版本ie 焦点选中dialog时会丢失选中元素，GetEditorSelectedElement()为空  load时缓存下
var activeElement = null;


window.onload = function(){
    InitStyle();
    jQuery(document).keydown(function(event){
        if(event.keyCode == 13)
        {
            if(!jQuery(event.target).is('textarea'))
            {
                initKeyListener();
                stopDefault(event);
            }
        }
        else if(event.keyCode == 27)
        {
            ue.getDialog(ue.currentField).close();
        }
    });
    jQuery(window).on('contextmenu', function(){ 
        return false; 
    });
    if(typeof(window.parent.GetEditorSelectedElement) == 'function'){
        var editorSelectedElement = window.parent.GetEditorSelectedElement();
        if(editorSelectedElement)
        {
            activeElement = editorSelectedElement;
        }
        //每次页面加载完成触发，是否有选中元素在每个页面中判断
        InitCtrlProp(editorSelectedElement);
        $('input:text:first').focus();
    }
}
ue = parent.UE.instants.ueditorInstant0;
ue.getDialog(ue.currentField).onok = function(){
    return sumitData();  
}
ue.getDialog(ue.currentField).oncancel = function(){
    if(parent.UE.plugins[ue.currentField].editdom){
        delete parent.UE.plugins[ue.currentField].editdom;
    }
}

function sumitData()
{
    var flag = CheckCtrlProp();
    if(flag && window.parent)
    {
        if(typeof(window.parent.GetEditorSelectedElement) == 'function')
        {
            var editorSelectedElement = window.parent.GetEditorSelectedElement() || activeElement;
            if(editorSelectedElement)
            {
                if(typeof(window.parent.UpdateEditorElement) == 'function')
                {
                    window.parent.UpdateEditorElement(editorSelectedElement, BuildCtrlProp());
                }
            }
            else
            {
                if(typeof(window.parent.ReplaceEditorHtml) == 'function')
                {
                    window.parent.ReplaceEditorHtml(BuildCtrlHTML());
                }
            }
        }
    }
    delete parent.UE.plugins[ue.currentField].editdom;
    return flag;
}

function initKeyListener()
{
    var flag = sumitData();
    flag && (ue.getDialog(ue.currentField).close());
}

function stopDefault(e)
{     
    if(e && e.preventDefault)
    {   
		e.preventDefault();  
    }
    else
    {    
		window.event.returnValue = false;   
    }  
    return false;  
} 

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

function valid_ctrl_name(val)
{
    var invalid_chars = "'\"\\\\<>&`";
    if(!valid_charactar(val, invalid_chars))
    {
        alert(sprintf(td_lang_utf8.system.workflow.msg_1, invalid_chars)); //不能包含%s等特殊字符
        return false;
    }
    
    return true;
}

function get_ctrl_id()
{
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: '/general/system/approve_center/flow_form/cool_form/controls/inc/get_item.php',
        data: {FLOW_ID:(typeof(window.parent.flow_id) == 'undefined' ? 0 : window.parent.flow_id),
            FLOW_PRCS:(typeof(window.parent.flow_prcs) == 'undefined' ? 0 : window.parent.flow_prcs),
            FORM_ID:(typeof(window.parent.form_id) == 'undefined' ? 0 : window.parent.form_id),
            VERSION_FORM_ID:(typeof(window.parent.form_id) == 'undefined' ? 0 : window.parent.version_form_id)
        },
        success: function(data){
            ctrl_id = data;
        },
        error: function(req, errMsg){
            alert("Error " + req.status + ": " + errMsg);
        }
    });
}