/*
 * File: app/store/ProjList.js
 *
 */

Ext.define('ProjManage.store.ProjList', {
   extend: 'Ext.data.Store',
   requires: [
      'ProjManage.model.ProjList'
   ],

   constructor: function(cfg) {
      var me = this;
      cfg = cfg || {};
      me.callParent([Ext.apply({
         storeId: 'ProjList',
         model: 'ProjManage.model.ProjList',
         clearOnPageLoad: true,
         autoDestroy: true,
         pageSize: 10,
         remoteFilter: true,
         proxy: {
            type: 'ajax',
            url: 'griddata.php',
            reader: {
               type: 'json',
               root: 'datastr',
               totalProperty: 'results'
            }
         },
         fields: grid_field
/*         [
            {
               name: 'PROJ_NO'
            },
            {
               name: 'PROJ_NAME'
            },
            {
               name: 'PROJ_ID'
            },
            {
               name: 'PROJ_END_TIME'
            },
            {
               name: 'PROJ_START_TIME'
            },
            {
               name: 'action'
            }
         ]
*/
      }, cfg)]);
   }
});