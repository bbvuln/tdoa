$(function(){
    FormDesigner.on("editorLoaded",function(e, ev){            
        var editor = ev && ev.editor;
        if(!editor){
            return;
        }
        editor.IsCut = false;
        editor.setHeight(GetEditContentHeight());
        editor.focus();
        editor.addListener('keyup', function(evt){
            var preventKeyPress;
            var keyCode = evt.keyCode || evt.which;
            if (keyCode == evt.ctrlKey + 88 || keyCode == evt.ctrlKey + 120) {
                editor.IsCut = true;
            };
            // backspace delete
            if (keyCode == 8 || keyCode == 46)
            {
                var range = evt.editor.getSelection().getRanges()[0];
                if (range == null) return;
                var node = range.getEnclosedNode();
                if (node == null) return;
                
                if (node.$)
                {
                    var nodeName = node.$.tagName.toUpperCase();
                    var ctrlName = GetFieldTypeByTag(node.$);
                    if(ctrlName)
                    {
                        preventKeyPress = true;
                        evt.editor.getCommand('td_delete').exec();
                    }
                    else if (nodeName == "INPUT" || nodeName == "IMG" || nodeName == "TABLE" || nodeName == "A")
                    {
                        preventKeyPress = true;
                        range.deleteContents();
                        range.select(); 
                    }
                }
            }
            else
                preventKeyPress = false;
    
            return !preventKeyPress;
        });
        editor.addListener('beforePaste ', function(type,data){
            if(editor.IsCut == false){
                var pasteText = data.html || '';
                var cid = GetCtrlMaxId() || 0;
                /* 复制控件时修改id by jx @2013-12-24
                 * ie8(-): <INPUT value={MACRO} name=DATA_17 data-cke-saved-name="DATA_17" data-cke-editable="1">
                 * w3c:    <INPUT value="{MACRO}" name="DATA_17" data-cke-saved-name="DATA_17" data-cke-editable="1">
                 */
                var fixText = pasteText.replace(/<(?:.|\s)*?>/g, function(s0){
                    var match = s0.match(/([\-\s]name=[\"\']?DATA_)\d*([\"\']?)/g);
                    var ret = match ? s0.replace(/([\-\s]name=[\"\']?DATA_)\d*([\"\']?)/g, "$1"+(cid++)+"$2") : s0;
                    return ret;
                });
                data.html = fixText;
            }
            editor.IsCut = false;
        });
    });
});

Field2Class = {
    td_macro: 'AUTO',
    td_calc: 'CALC',
    td_dataselection: 'DATA',
    td_formdataselection: 'FETCH',
    td_extdataselection: 'DATA_EXT',
    td_listview: 'LIST_VIEW',
    td_calendar: 'DATE',
    td_orgselect: 'USER',
    td_radio: 'RADIO',
    td_progressbar: 'PROGRESSBAR',
    td_imageupload: 'IMGUPLOAD',
    td_fileupload: 'FILEUPLOAD',
    td_qrcode: 'QRCODE',
    td_websign: 'SIGN',
    td_mobilesign: 'MOBILE_SEAL'
};
function GetFieldClass(fieldType){
    var ret = Field2Class[fieldType] || fieldType;
    return ret;
}
function GetFieldTypeByTag(tag){
    var tagName = tag.nodeName && tag.nodeName.toUpperCase(),
        clsName = tag.className && tag.className.toUpperCase(),
        fieldType;
        
        //如果类中有CUSTOM则表示为自定义控件
        if(clsName.indexOf("CUSTOM") < 0)
        {
            switch (tagName){
                case 'INPUT':
                    if(tag.type == 'checkbox')
                    {
                        fieldType = 'td_checkbox';
                    }
                    else if(tag.type == 'text')
                    {   
                        if(clsName == 'AUTO')
                        {
                            fieldType = 'td_macro';
                        }
                        else if(clsName == 'CALC')
                        {
                            fieldType = 'td_calc';                        
                        }
                        else
                        {
                            fieldType = 'td_text';                        
                        }
                    }               
                    break;
                case 'SELECT':
                case 'OPTION':
                    while(tag.nodeName && tag.nodeName.toUpperCase() !== 'SELECT'){
                        tag = tag.parentNode;
                    }
                    clsName = tag.className && tag.className.toUpperCase();
                    if(clsName == 'AUTO')
                    {
                        fieldType = 'td_macro';
                    }
                    else
                    {
                        fieldType = 'td_select';
                    }
                    break;
                case 'BUTTON':
                    if(clsName == 'DATA')
                    {
                        fieldType = 'td_dataselection';
                    }
                    else if(clsName == 'FETCH')
                    {
                        fieldType = 'td_formdataselection';                        
                    }
                    else if(clsName == 'DATA_EXT')
                    {
                        fieldType = 'td_extdataselection';                        
                    }
                    break;
                case 'IMG':
                    if( tag.getAttribute( '_fckfakelement' ) ){
                        return;
                    }
                    if( clsName == 'LIST_VIEW' )
                    {
                        fieldType = 'td_listview';
                    }
                    else if(clsName == 'DATE')
                    {
                        fieldType = 'td_calendar';
                    }
                    else if(clsName == 'USER')
                    {
                        fieldType = 'td_orgselect';
                    }
                    else if(clsName == 'RADIO')
                    {
                        fieldType = 'td_radio';
                    }
                    else if(clsName == 'PROGRESSBAR')
                    {
                        fieldType = 'td_progressbar';
                    }
                    else if(clsName == 'IMGUPLOAD')
                    {
                        fieldType = 'td_imageupload';
                    }
                    else if(clsName == 'FILEUPLOAD')
                    {
                        fieldType = 'td_fileupload';
                    }
                    else if(clsName == 'QRCODE')
                    {
                        fieldType = 'td_qrcode';
                    }
                    else if(clsName == 'SIGN')
                    {
                        fieldType = 'td_websign';
                    }
                    else if(clsName == 'MOBILE_SEAL')
                    {
                        fieldType = 'td_mobilesign';
                    }
                    else if(clsName == 'MOBILE_WRITE_SEAL')
                    {
                        fieldType = 'td_mobilewritesign';
                    }
                    break;
                case 'TEXTAREA':
                    if(clsName == 'AUTO')
                    {
                        fieldType = 'td_macro';
                    }
                    else
                    {
                        fieldType = 'td_textarea';
                    }
                    break;                    
            }
            return fieldType;
        }
        else
        {
            clsName = clsName.toLowerCase();
            fieldType = "td_"+clsName;
            return fieldType;
        }
        
}

//编辑器高度
function GetEditContentHeight(){
    var outheight = $('.main-container').height();
    var toolheight = $('.edui-editor-toolbarbox').height()*1+32;
    return outheight-toolheight;
}
//获得editor实例对象
function GetFlowEditorInstance(){
    return UE.instants.ueditorInstant0;
}
//获得editor文档对象
function GetEditorDocument(){
    return GetFlowEditorInstance().document;
}
//获得当前dialog
function GetCurDialog(){
    var currentField = GetFlowEditorInstance().currentField;
    return GetFlowEditorInstance().getDialog(currentField);
}
//获得当前选中的元素
function GetEditorSelectedElement(){
    var ret, doc, $active;
    try{
        if(!ret){
            ret = UE.plugins[GetFlowEditorInstance().currentField].editdom;
        }
        /*
    	GetFlowEditorInstance().focus();
        doc = GetEditorDocument();
        $active = doc.getSelection().getSelectedElement();        
        if(!$active)
        {
            $active = doc.getSelection().getStartElement();
            if($active.getName() != 'button'){
                $active = null;
            }
        }
        ret = $active.getName() == 'body' ? null : $active['$'];
        */
        
    }catch(e){
        ret = null;
    }
    return ret;
}                   
//插入html到编辑器  
function ReplaceEditorHtml(html){
    var editor = GetFlowEditorInstance();
    var $selected = GetEditorSelectedElement();
    if($selected){
        jQuery($selected).replaceWith(html);
    }else{
        try{
            editor.execCommand('insertHtml', html );
        }catch(e){}
    }
}

//根据prop更新el元素的属性
function UpdateEditorElement(el, prop)
{
    if(!el || typeof(prop) != 'object')
    {
        return;
    }
    var propMap = 'async autofocus defaultValue location multiple nodeName nodeType readOnly seleced selectedIndex tagName'.split(' ');
    var attributeMap = ['hidden'];
    var $el = jQuery(el);
    $.each(prop, function(k, v){
        if($.inArray(k, attributeMap) != -1)
        {
            el.setAttribute(k, v);
        }
        else
        {
            if(k == 'value')
            {
                $el['val'](v);
                if(el.nodeName == 'TEXTAREA'){
                    $el.html(v);
                }else if(el.nodeName == 'INPUT' || el.nodeName == 'IMG'){
                    el.setAttribute('value', v);
                }
            }
            else if(k == 'option' && el.nodeName == 'SELECT')
            {
                $el.html(v);
            }
            else if(k == 'style' && typeof(v) == 'object')
            {
                $.each(v, function(sk, sv){
                    $el.css(sk, sv);
                });
            }
            else
            {
                if(v !== '')
                {
                    var method = $.inArray(k, propMap) == -1 ? 'attr' : 'prop';          
                    $el[method](k, v);  
                }
                else
                {
                    var method = $.inArray(k, propMap) == -1 ? 'removeAttr' : 'removeProp';          
                    $el[method](k, v);  
                }
            }
        }
    });
}


function GetCtrlMaxId()
{
    var ctrl_id = 0;
    jQuery.ajax({
        type: 'GET',
        async: false,
        url: './controls/inc/get_item.php',
        data: {
            FORM_ID: window.form_id || 0
        },
        success: function(data){
            ctrl_id = parseInt(data, 10) || 0;
        },
        error: function(req, errMsg){
            alert("Error " + req.status + ": " + errMsg);
        }
    });
    return ctrl_id;
}


function exec_cmd(cmd) {
    var editor = GetFlowEditorInstance();
    editor.execCommand(cmd);
    editor.focus();
    return;
}


function CheckForm(callback)
{
	var editor = GetFlowEditorInstance();
    var status = editor.queryCommandState('source');
        status == 1 && editor.execCommand('source');
	setTimeout(function(){
		var ret = true;
		var FORM_HTML = editor.getContent();
		if(FORM_HTML == "")
		{	
			alert(td_lang.system.workflow.msg_51);
			GetFlowEditorInstance().setContent("");
			ret = false;
		}
		else
		{
			var documents = GetEditorDocument();
			var docElements = documents.getElementsByTagName('*');
			var chkTitleArr = new Array();
			var chkNameArr = new Array();
			var chkTypeArr = new Array();
			var tagArr = ["INPUT","TEXTAREA","SELECT","IMG","BUTTON"];
			var size = docElements.length;
            if(size){
                docElements = docElements;
            }
			for(var i=0;i<size;i++){
				with(docElements[i]){
					var _title = getAttribute("title");
					var _name = getAttribute("name");
					var _tagName = tagName;
					if(jQuery.inArray(_tagName,tagArr) == -1){
						continue;
					}else if((typeof _name == "undefined" || _name == null || _name == "")&&(typeof _title == "undefined" || _title == null || _title == "")){
						continue;
					}else {
						var filedTag = GetFieldTypeByTag(docElements[i]);
						if(filedTag == 'td_websign' || filedTag == 'td_mobilesign' || filedTag == 'td_mobilewritesign')
						{
							var signum = _title.indexOf(":");
							_title = _title.substring(signum+1);
						}
						var titleIndex = jQuery.inArray(_title,chkTitleArr);
						var nameIndex = jQuery.inArray(_name,chkNameArr);
						if(_name == "" || _name == null){
							nameIndex = -1; //没有NAME属性控件的处理
						}
						var _pType = getPluginType(docElements[i]);
						if(tagName == "SELECT"){
							var maxOptionsLen = 150;
							if(jQuery(docElements[i]).find("option").length > maxOptionsLen){
								alert(sprintf(td_lang.system.workflow.msg_48 + maxOptionsLen + td_lang.system.workflow.msg_49, _title));
								ret = false;
								continue;
							}
						}
						
						
						if(filedTag == "td_calendar")     //照熙添加，日历控件绑定错误判断
						{
							var dateValue=jQuery(docElements[i]).attr('value');
							if(jQuery('input[title="'+dateValue+'"]',documents).size()==0)
							{
								alert(sprintf(td_lang.system.workflow.msg_55,dateValue,dateValue));
								ret = false;
								continue;
							}
						}
						
						if(titleIndex > -1 && _pType != td_lang.system.workflow.msg_50){
							var msg = td_lang.system.workflow.msg_47;
							msg += sprintf(td_lang.system.workflow.msg_43, "\n", _title, _pType, _name, "\n\n"); 					
							msg += sprintf(td_lang.system.workflow.msg_44, "\n", chkTitleArr[titleIndex], chkTypeArr[titleIndex], chkNameArr[titleIndex], "\n");
							alert(msg);
							ret = false;
							continue;
						}else if(nameIndex > -1){
							var msg = td_lang.system.workflow.msg_42;
							msg += sprintf(td_lang.system.workflow.msg_45,"\n", _title, _pType, _name, "\n\n");
							msg += sprintf(td_lang.system.workflow.msg_46,"\n",chkTitleArr[nameIndex],chkTypeArr[nameIndex],chkNameArr[nameIndex],"\n");
							alert(msg);
							ret = false;
							continue;
						}else {
							chkTitleArr.push(_title);
							chkNameArr.push(_name);
							chkTypeArr.push(_pType);
						}
					}
				}
			}
		}
		callback(ret);
	},1000);
}

function send(TYPE)
{
	CheckForm(function(flag){
		if(flag)
		{
			var editor = GetFlowEditorInstance(); 
			var FORM_HTML = editor.getContent();
            FORM_HTML = FORM_HTML.replace(/(<button.*?\stype=[\"\'])submit([\"\'\s])/gi, '$1button$2'); //IE8下会自动将button元素的type属性设置为submit
            FORM_HTML = FORM_HTML.replace(/<span style="display: none">&nbsp;<\/span>/gi, ''); //IE8下会产生这样的奇怪的代码
        	document.getElementById("TD_HTML_EDITOR_FORM_HTML_DATA").value=FORM_HTML;
			if(TYPE == 1)
			{
				document.form1.action = "submit.php?TYPE=1&e=ue";
			}
			else
			{
				document.form1.action = "submit.php?e=ue";
			}

			document.form1.submit();
		}	
	});	
}