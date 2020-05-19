/*
 * File: app/view/MyFieldSet.js
 *
 */

Ext.define('ProjManage.view.MyFieldSet', {
   extend: 'Ext.form.FieldSet',
   alias: 'widget.myfieldset',

   autoRender: true,
   margin:'5 0 5 0',
   contentEl: 'searchTable',
   layout: {
      type: 'column'
   },
   collapsible: true,
   title: '更多查询条件',

   initComponent: function() {
      var me = this;

      me.callParent(arguments);
   }

});