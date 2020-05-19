/*
 * File: app/view/ProjTitle.js
 *
 */

Ext.define('ProjManage.view.ProjTitle', {
   extend: 'Ext.panel.Panel',
   alias: 'widget.ProjTitle',

   height: 64,
   html: '<div class="bodycolor"><img src="/static/images/project/task.png"></div>',

   initComponent: function() {
      var me = this;

      me.callParent(arguments);
   }

});