/*
 * File: app/view/ProjTab.js
 *
 */

Ext.define('ProjManage.view.ProjTab', {
   extend: 'Ext.tab.Panel',
   alias: 'widget.ProjTab',
   requires: [
      'ProjManage.view.MyFieldSet',
      'ProjManage.view.ProjList'
   ],

   hidden: false,
   id: 'center',
   closable: false,
   activeTab: 0,

   initComponent: function() {
      var me = this;

      Ext.applyIf(me, {
         items: [
            {
               xtype: 'panel',
               layout: {
                  type: 'fit'
               },
               title: '项目列表',
               dockedItems: [
                  {
                     xtype: 'myfieldset',
                     dock: 'top'
                  }
               ],
               items: [
                  {
                     xtype: 'ProjList'
                  }
               ]
            }
         ]
      });

      me.callParent(arguments);
   },

   ShowDetail: function(PROJ_ID, PROJ_NAME) {
      var Detail = Ext.getCmp('detail'+ PROJ_ID);
      if(!Detail){
         var tab = {
            id: 'detail'+ PROJ_ID,
            title:  PROJ_NAME ? PROJ_NAME : '项目详情',
            xtype: 'ProjDetail' 
         };
         var newtab = this.add(tab);
         this.setActiveTab(newtab);
         Ext.getCmp('detail'+ PROJ_ID).query('tabpanel')[0].getDetail(PROJ_ID);
      }else{
         this.setActiveTab(Detail);
      }
   }

});