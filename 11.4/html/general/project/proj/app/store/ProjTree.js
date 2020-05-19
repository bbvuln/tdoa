/*
 * File: app/store/ProjTree.js
 *
 */

Ext.define('ProjManage.store.ProjTree', {
   extend: 'Ext.data.TreeStore',
   requires: [
      'ProjManage.model.ProjTree'
   ],

   constructor: function(cfg) {
      var me = this;
      cfg = cfg || {};
      me.callParent([Ext.apply({
         storeId: 'ProjTree',
         root: 'items',
         model: 'ProjManage.model.ProjTree',
         proxy: {
            type: 'ajax',
            url: 'treedata.php',
            reader: {
               type: 'json',
               totalProperty: 'results'
            }
         }
      }, cfg)]);
   }
});