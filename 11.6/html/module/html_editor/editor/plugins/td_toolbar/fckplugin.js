FCKCommands.RegisterCommand( 'td_js_script', new FCKDialogCommand( 'td_js_script', 'JS脚本扩展', '/general/system/workflow/flow_form/cool_form/td_js_css.php?action=SCRIPT', 800, 450 ) ) ;

FCKCommands.RegisterCommand( 'td_css_script', new FCKDialogCommand( 'td_css_script', 'CSS样式扩展', '/general/system/workflow/flow_form/cool_form/td_js_css.php?action=CSS', 800, 450 ) ) ;

//FCKCommands.RegisterCommand( 'td_template', new FCKDialogCommand( 'td_template', '使用模板', '/module/html_editor/editor/dialog/fck_template.html', 500, 350 ) ) ;

FCKCommands.RegisterCommand( 'td_macro', new FCKDialogCommand( 'td_macro', '使用宏标记', '/general/system/workflow/flow_form/cool_form/macro.php', 500, 350 ) ) ;

FCKCommands.RegisterCommand( 'td_about', new FCKDialogCommand( 'td_about', '关于表单设计器', FCKPlugins.Items['td_toolbar'].Path+'about.html', 300, 220 ) ) ;


FCKToolbarItems.RegisterItem( 'td_js_script', new FCKToolbarButton( 'td_js_script'	, 'JS脚本扩展', null, null, null, true, FCKPlugins.Items['td_toolbar'].Path+'td_js_script.gif') );

FCKToolbarItems.RegisterItem( 'td_css_script', new FCKToolbarButton( 'td_css_script'	, 'CSS样式扩展', null, null, null, true, FCKPlugins.Items['td_toolbar'].Path+'td_css_script.gif' ) );

//FCKToolbarItems.RegisterItem( 'td_template', new FCKToolbarButton( 'td_template'	, '使用模板', null, null, null, true, FCKPlugins.Items['td_toolbar'].Path+'td_template.gif' ) );

FCKToolbarItems.RegisterItem( 'td_macro', new FCKToolbarButton( 'td_macro'	, '使用宏标记', null, null, null, true, FCKPlugins.Items['td_toolbar'].Path+'td_macro.gif' ) );

FCKToolbarItems.RegisterItem( 'td_about', new FCKToolbarButton( 'td_about'	, '关于表单设计器', null, null, null, true, FCKPlugins.Items['td_toolbar'].Path+'td_about.gif' ) );