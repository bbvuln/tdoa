/*
 * File: app/view/ProjTitle.js
 *
 */

Ext.define('ProjManage.view.ProjTitle', {
   extend: 'Ext.panel.Panel',
   alias: 'widget.ProjTitle',

   height: 0,
   html: '<div class="bodycolor"> <div style="float:right;"></div></div>',

   initComponent: function() {
      var me = this;

      me.callParent(arguments);
   }

});