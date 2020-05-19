/*
 * File: app/store/DuringTypeStore.js
 *
 */

Ext.define('ProjManage.store.DuringTypeStore', {
   extend: 'Ext.data.Store',

   constructor: function(cfg) {
      var me = this;
      cfg = cfg || {};
      me.callParent([Ext.apply({
         storeId: 'MyArrayStore',
         data: [
            {
               type: '0',
               text: '所有范围'
            },
            {
               type: '1',
               text: '本周任务'
            },
            {
               type: '2',
               text: '本月任务'
            },
            {
               type: '3',
               text: '未来任务'
            }
         ],
         fields: [
            {
               name: 'type'
            },
            {
               name: 'text'
            }
         ]
      }, cfg)]);
   }
});