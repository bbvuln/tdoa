//添加“删除控件”菜单项，参照上面的FCKCutCopyCommand（拷贝修改） by dq 090522
var FCKDeleteCommand = function()
{
	this.Name = 'td_delete' ;
}

FCKDeleteCommand.prototype =
{
	Execute : function()
	{
		var enabled = false ;

        //删除控件时进行提示  add by lx 20090928 
        var cntrlSelected = FCKSelection.GetSelectedElement();
        if(cntrlSelected != null)
        {
            var cntrlClassName = cntrlSelected.className.toUpperCase();
            var cntrlTagName = cntrlSelected.tagName.toUpperCase();
            if(cntrlTagName == "INPUT" || cntrlTagName == "TEXTAREA" || cntrlTagName == "SELECT" || cntrlClassName == "LIST_VIEW" || cntrlClassName == "DATE" || cntrlClassName == "USER" || cntrlClassName == "DATA" || cntrlClassName == "FETCH")
            {
                var msg = "确认要删除控件吗？删除控件可能导致历史数据无法显示，确定要操作吗？";
                if(!window.confirm(msg))
                    return false;
            } 
        }
    
	    if ( FCKBrowserInfo.IsIE )
	    {
	    	var onEvent = function()
	    	{
	    		enabled = true ;
	    	} ;
    
	    	var eventName = 'on' + this.Name.toLowerCase() ;
    
	    	FCK.EditorDocument.body.attachEvent( eventName, onEvent ) ;
	    	FCK.ExecuteNamedCommand( 'Delete' ) ;
	    	FCK.EditorDocument.body.detachEvent( eventName, onEvent ) ;
	    }
	    else
	    {
	    	try
	    	{
	    		FCK.ExecuteNamedCommand( this.Name ) ;
	    		enabled = true ;
	    	}
	    	catch(e){}
	    }
/*  
	    	if ( !enabled )
	    		alert( FCKLang[ 'PasteError' + this.Name ] ) ;*/
	},

	GetState : function()
	{
		return FCK.EditMode != FCK_EDITMODE_WYSIWYG ?
				FCK_TRISTATE_DISABLED :
				FCK.GetNamedCommandState( 'Cut' ) ;
	}
};

FCKCommands.RegisterCommand( 'td_delete',new FCKDeleteCommand ( 'td_delete', '删除控件') );