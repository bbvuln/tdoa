var TD_ContextMenu_Listener = [
{   //复选框
    AddItems : function( menu, tag, tagName ) {
		if ( tagName == 'INPUT' && tag.type == 'checkbox' )
		{
			menu.AddSeparator() ;
			menu.AddItem( 'td_checkbox', '复选框属性', 49 ) ;
		}
	}
},
{
	AddItems : function( menu, tag, tagName ) {
		menu.AddItem( 'td_delete'	, FCKLang.td_delete	, 100, FCKCommands.GetCommand( 'td_delete' ).GetState() == FCK_TRISTATE_DISABLED ) ;
        //menu.AddItem( 'SelectAll', FCKLang.td_SelectAll , 100, FCKCommands.GetCommand( 'SelectAll' ).GetState() == FCK_TRISTATE_DISABLED ) ; 
    }
},
{
	AddItems : function( menu, tag, tagName )
	{
		if ( tagName == 'IMG' && !tag.getAttribute( '_fckfakelement' ) )
		{
			menu.AddSeparator() ;
			if ( (cntrlSelected = FCKSelection.GetSelectedElement()) ) {
				if (cntrlSelected.getAttribute('className') == 'LIST_VIEW' ||cntrlSelected.getAttribute('class') == 'LIST_VIEW') { //列表控件（class和className分别适应IE和FF） by dq 090523
			    menu.AddItem( 'td_listview', '列表控件属性', 37 ) ;
				} else if (cntrlSelected.getAttribute('className') == 'DATE' ||cntrlSelected.getAttribute('class') == 'DATE') {
					menu.AddItem( 'td_calendar', '日历控件属性', 37 ) ;
				} else if (cntrlSelected.getAttribute('className') == 'USER' ||cntrlSelected.getAttribute('class') == 'USER') {
					menu.AddItem( 'td_user', FCKLang.td_user, 37 ) ;
				} else if (cntrlSelected.getAttribute('className') == 'SIGN' ||cntrlSelected.getAttribute('class') == 'SIGN') {
					menu.AddItem( 'td_sign', '签章控件属性', 37 ) ;
				} else if(cntrlSelected.getAttribute('className') == 'RADIO' ||cntrlSelected.getAttribute('class') == 'RADIO')
	            {
    	            menu.AddItem('td_radio','单选框属性', 37);
  	            } else if(cntrlSelected.getAttribute('className') == 'PROGRESSBAR' ||cntrlSelected.getAttribute('class') == 'PROGRESSBAR')
	            {
    	            menu.AddItem('td_progressbar','进度条属性', 37);
  	            } else if(cntrlSelected.getAttribute('className') == 'IMGUPLOAD' ||cntrlSelected.getAttribute('class') == 'IMGUPLOAD')
	            {
    	            menu.AddItem('td_imgupload','图片上传属性', 37);
  	            } else if(cntrlSelected.getAttribute('className') == 'FILEUPLOAD' ||cntrlSelected.getAttribute('class') == 'FILEUPLOAD')
	            {
    	            menu.AddItem('td_fileupload','附件上传属性', 37);
  	            } else if(cntrlSelected.getAttribute('className') == 'QRCODE' ||cntrlSelected.getAttribute('class') == 'QRCODE')
	            {
    	            menu.AddItem('td_qrcode','二维码属性', 37);
  	            } else if(cntrlSelected.getAttribute('className') == 'MOBILE_SEAL' ||cntrlSelected.getAttribute('class') == 'MOBILE_SEAL')
	            {
    	            menu.AddItem('td_mobile_seal','移动签章属性', 37);
  	            } else {
    			    menu.AddItem( 'Image', FCKLang.ImageProperties, 37 ) ;
    			}
			} 
		}
	}
},
{
	AddItems : function( menu, tag, tagName )
	{
		if ( tagName == 'INPUT' && tag.type == 'text' )
		{
			menu.AddSeparator() ;
			if ( (cntrlSelected = FCKSelection.GetSelectedElement()) ) {
				if (cntrlSelected.className == 'AUTO') {
			        menu.AddItem( 'td_auto', '宏控件属性', 51 ) ;
				} else if (cntrlSelected.getAttribute('class') == 'CALC'||cntrlSelected.getAttribute('className') == 'CALC') {
			        menu.AddItem( 'td_calcu', '计算控件属性', 51 ) ;
				} else {
                    menu.AddItem( 'td_textfield', '单行输入框属性', 51 ) ;
			    }
			} 
		}
	}
},
{
	AddItems : function( menu, tag, tagName )
	{	
		if ( tagName == 'BUTTON' ) {
  		    if ( (cntrlSelected = FCKSelection.GetSelectedElement()) ) {
				if (cntrlSelected.getAttribute('class') == 'DATA'||cntrlSelected.getAttribute('className') == 'DATA') {
				    menu.AddSeparator() ;	
			        menu.AddItem( 'td_data_select', '数据选择控件属性', 54 ) ;
				} else if (cntrlSelected.getAttribute('class') == 'FETCH'||cntrlSelected.getAttribute('className') == 'FETCH') {
				    menu.AddSeparator() ;	
			        menu.AddItem( 'td_data_fetch', '表单数据控件属性', 54 ) ;
				}  else if (cntrlSelected.getAttribute('class') == 'DATA_EXT'||cntrlSelected.getAttribute('className') == 'DATA_EXT') {
				    menu.AddSeparator() ;	
			        menu.AddItem( 'td_data_select_ext', '外部数据选择属性', 54 ) ;
				} 
			} 
		}
	}
},
{
	AddItems : function( menu, tag, tagName )
	{
		if ( tagName == 'SELECT' )
		{
			menu.AddSeparator() ;

			if ( (cntrlSelected = FCKSelection.GetSelectedElement()) ) {
				if (cntrlSelected.options[cntrlSelected.selectedIndex].text == '{MACRO}') {
					menu.AddItem( 'td_auto', '宏控件属性', 51 ) ;
				} else {
                    menu.AddItem( 'td_listmenu', '下拉菜单属性', 53 ) ;
			  }
			} 
		}
	}
},
{
	AddItems : function( menu, tag, tagName )
	{
		if ( tagName == 'TEXTAREA' )
		{
			menu.AddSeparator() ;
			menu.AddItem( 'td_textarea', '多行输入框属性', 52 ) ;
		}
	}
}
];


for ( var i = 0 ; i < TD_ContextMenu_Listener.length ; i++ )
{
	FCK.ContextMenu.RegisterListener(TD_ContextMenu_Listener[i]) ;
}