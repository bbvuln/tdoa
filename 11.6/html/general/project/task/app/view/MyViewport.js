/*
 * File: app/view/MyViewport.js
 *
 */

Ext.define('ProjManage.view.MyViewport', {
   extend: 'Ext.container.Viewport',
   requires: [
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
               xtype: 'ProjTitle',
               collapseMode: 'header',
               region: 'north'
            },
            {
               xtype: 'ProjTab',
               deferredRender: false,
               region: 'center',
               layout: {
                  deferredRender: false,
                  type: null
               }
            }
         ]
      });

      me.callParent(arguments);
   }

});