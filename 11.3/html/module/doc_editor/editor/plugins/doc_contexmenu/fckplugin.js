var doc_ContextMenu_Listener = [
{   //复选框
    AddItems : function( menu, tag, tagName ) {
		if ( tagName == 'INPUT' && tag.type == 'checkbox' )
		{
			menu.AddSeparator() ;
			menu.AddItem( 'doc_checkbox', '复选框属性', 49 ) ;
		}
	}
},
{
	AddItems : function( menu, tag, tagName ) {
		menu.AddItem( 'doc_delete'	, FCKLang.doc_delete	, 100, FCKCommands.GetCommand( 'doc_delete' ).GetState() == FCK_TRISTATE_DISABLED ) ;
        //menu.AddItem( 'SelectAll', FCKLang.doc_SelectAll , 100, FCKCommands.GetCommand( 'SelectAll' ).GetState() == FCK_TRISTATE_DISABLED ) ; 
    }
},
{
	AddItems : function( menu, tag, tagName )
	{
		if ( tagName == 'INPUT' && tag.type == 'text' )
		{
			menu.AddSeparator() ;
            menu.AddItem( 'doc_textfield', '单行输入框属性', 51 ) ;

		}
	}
},
{
	AddItems : function( menu, tag, tagName )
	{
		if ( tagName == 'TEXTAREA' )
		{
			menu.AddSeparator() ;
			menu.AddItem( 'doc_textarea', '多行输入框属性', 52 ) ;
		}
	}
}
];


for ( var i = 0 ; i < doc_ContextMenu_Listener.length ; i++ )
{
	FCK.ContextMenu.RegisterListener(doc_ContextMenu_Listener[i]) ;
}


//添加“删除控件”菜单项
var FCKDeleteCommand = function()
{
	this.Name = 'doc_delete' ;
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
            if(cntrlTagName == "INPUT" || cntrlTagName == "TEXTAREA" || cntrlTagName == "SELECT")
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
	},

	GetState : function()
	{
		return FCK.EditMode != FCK_EDITMODE_WYSIWYG ?
				FCK_TRISTATE_DISABLED :
				FCK.GetNamedCommandState( 'Cut' ) ;
	}
};

FCKCommands.RegisterCommand( 'doc_delete',new FCKDeleteCommand ( 'doc_delete', '删除控件') );