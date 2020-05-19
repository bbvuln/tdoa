/*
 * File: app/view/MyViewport.js
 *
 */

Ext.define('ProjManage.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   requires: [
      'ProjManage.view.ProjTree',
      'ProjManage.view.ProjTitle',
      'ProjManage.view.ProjTab'
   ],

   layout: {
      type: 'border'
   },

   initComponent: function() {
      var me = this;

      Ext.applyIf(me, {
         items: [
            {
               xtype: 'ProjTab',
               deferredRender: false,
               region: 'center',
               layout: {
                  deferredRender: false,
                  type: null
               }
            },
            {
               xtype: 'ProjTree',
               region: 'west'
            }
         ]
      });

      me.callParent(arguments);
   }

});