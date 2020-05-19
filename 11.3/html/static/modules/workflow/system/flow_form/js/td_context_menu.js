
CKEDITOR.on( 'instanceReady', function( ev ){
    var editor = ev.editor;
    
    editor.addMenuGroup( 'td_field_group' );
    
    editor.addMenuItem( 'td_text_item', {
        label: '单行输入框属性',
        command: 'td_text',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_textarea_item', {
        label: '多行输入框属性',
        command: 'td_textarea',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_select_item', {
        label: '下拉菜单属性',
        command: 'td_select',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_radio_item', {
        label: '单选框属性',
        command: 'td_radio',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_checkbox_item', {
        label: '复选框属性',
        command: 'td_checkbox',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_listview_item', {
        label: '列表控件属性',
        command: 'td_listview',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_macro_item', {
        label: '宏控件属性',
        command: 'td_macro',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_calendar_item', {
        label: '日历控件属性',
        command: 'td_calendar',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_calc_item', {
        label: '计算控件属性',
        command: 'td_calc',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_orgselect_item', {
        label: '部门人员控件属性',
        command: 'td_orgselect',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_websign_item', {
        label: '签章控件属性',
        command: 'td_websign',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_dataselection_item', {
        label: '数据选择控件属性',
        command: 'td_dataselection',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_extdataselection_item', {
        label: '外部数据选择控件属性',
        command: 'td_extdataselection',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_formdataselection_item', {
        label: '表单数据控件属性',
        command: 'td_formdataselection',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_progressbar_item', {
        label: '进度条控件属性',
        command: 'td_progressbar',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_imageupload_item', {
        label: '图片上传控件属性',
        command: 'td_imageupload',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_fileupload_item', {
        label: '附件上传控件属性',
        command: 'td_fileupload',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_qrcode_item', {
        label: '二维码控件属性',
        command: 'td_qrcode',
        group: 'td_field_group'
    });
     
    editor.addMenuItem( 'td_mobilesign_item', {
        label: '移动签章控件属性',
        command: 'td_mobilesign',
        group: 'td_field_group'
    });
    
    editor.addMenuItem( 'td_mobilewritesign_item', {
        label: '移动手写签章控件属性',
        command: 'td_mobilewritesign',
        group: 'td_field_group'
    });
    
    //自定义控件
    var custom_controls = jQuery("#custom_controls_json").val();
    if(custom_controls != "" && typeof(custom_controls) != "undefined")
    {
        custom_controls = eval("(" + custom_controls + ")");
        for(var i=0; i<custom_controls.length; i++)  
        {
            editor.addMenuItem( ''+custom_controls[i].PKEY+'_item', {
                label: ''+custom_controls[i].NAME+'属性',
                command: custom_controls[i].PKEY,
                group: 'td_field_group'
            });
        } 
    }
    
    editor.addMenuItem( 'td_delete_item', {
        label: '删除控件',
        command: 'td_delete',
        group: 'td_field_group'
    });

    editor.contextMenu.addListener( function( ev ) {
        var tag = ev.$,
        ret = {},
        fieldType = GetFieldTypeByTag(tag);
        if(fieldType)
        {
            ret[fieldType + '_item'] = CKEDITOR.TRISTATE_OFF;
            ret['td_delete_item'] = CKEDITOR.TRISTATE_OFF;
        }
        return ret;
    });      
});


