/*
 * File: app/store/fanwei.js
 *
 */

Ext.define('ProjManage.store.fanwei', {
   extend: 'Ext.data.Store',

   constructor: function(cfg) {
      var me = this;
      cfg = cfg || {};
      me.callParent([Ext.apply({
         storeId: 'MyStore',
         data: [
            {
               value: 0,
               text: '所有范围'
            },
            {
               value: 1,
               text: '我管理的'
            },
            {
               value: 2,
               text: '我参与的'
            }
         ],
         fields: [
            {
               name: 'value'
            },
            {
               name: 'text'
            }
         ]
      }, cfg)]);
   }
});