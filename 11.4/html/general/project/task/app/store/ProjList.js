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
         autoLoad: true,
         filterOnLoad: false,
         storeId: 'ProjList',
         model: 'ProjManage.model.ProjList',
         /*sortRoot: 'datastr',*/
         pageSize: 10,
         remoteFilter: true,
         proxy: {
            type: 'ajax',
            url: 'query.php',
            reader: {
               type: 'json',
               root: 'datastr',
               totalProperty: 'results'
            }
         },
         listeners:{beforeload:function(store,operation, eOpts){
            if(operation.filters.length<=0)
            {
                var RANGE = Ext.getCmp("dTimeType") ? Ext.getCmp("dTimeType").getValue() : '';
                var PROJ_ID = Ext.getCmp("ProjNameList") ? Ext.getCmp("ProjNameList").getValue() : '';
                var HIDEFIN = Ext.getCmp("HideFinished") ? Ext.getCmp("HideFinished").getValue() : '';
                if(PROJ_ID == "输入关键词查询项目名称...")
                {
                    PROJ_ID = "";
                }
                operation.filters.push({property:"HIDEFIN",value:String(HIDEFIN)});
                operation.filters.push({property:"PROJ_ID",value:PROJ_ID});
                operation.filters.push({property:"RANGE",value:RANGE});
            }
         }},
         fields: grid_field
      }, cfg)]);
   }
});