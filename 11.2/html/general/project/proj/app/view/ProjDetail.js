/*
 * File: app/view/ProjDetail.js
 *
 */

Ext.define('ProjManage.view.ProjDetail', {
   extend: 'Ext.panel.Panel',
   alias: 'widget.ProjDetail',

   hidden: false,
   id: 'detail',
   layout: {
      type: 'fit'
   },
   closable: true,
   closeAction: 'hide',
   title: '项目详情',

   initComponent: function() {
      var me = this;

      Ext.applyIf(me, {
         items: [
            {
               xtype: 'tabpanel',
               getDetail: function(PROJ_ID) {
                  this.query("panel")[0].update(this.getFrame(PROJ_ID,'info'));
                  this.query("panel")[1].update(this.getFrame(PROJ_ID,'file'));
                  this.query("panel")[2].update(this.getFrame(PROJ_ID,'task'));
                  this.query("panel")[3].update(this.getFrame(PROJ_ID,'bug'));
                  this.query("panel")[4].update(this.getFrame(PROJ_ID,'forum'));
                  this.query("panel")[5].update(this.getFrame(PROJ_ID,'comment'));
               },
               getFrame: function(PROJ_ID, URL) {
                  if(PROJ_ID){
                     return  "<iframe frameborder=0 width=\"100%\" height=\"100%\" src=\""+URL+"/index.php?PROJ_ID="+PROJ_ID+"\"></iframe>";
                  }else
                  {
                     return "ERROR LOADING DATA";
                  }
               },
               height: 200,
               style: 'font-size:20px;',
               activeTab: 0,
               items: [
                  {
                     xtype: 'panel',
                     cls: 'info',
                     frame: false,
                     height: 29,
                     html: '<iframe src="about:blank" id=info width=100% height=100% ></iframe>',
                     layout: {
                        type: 'fit'
                     },
                     title: '基本信息'
                  },
                  {
                     xtype: 'panel',
                     cls: 'file',
                     html: '<iframe src="about:blank" id=file width=100% height=100% ></iframe>',
                     title: '项目文档'
                  },
                  {
                     xtype: 'panel',
                     cls: 'task',
                     html: '<iframe src="about:blank" id=task width=100% height=100% ></iframe>',
                     title: '任务列表'
                  },
                  {
                     xtype: 'panel',
                     cls: 'bug',
                     html: '<iframe src="about:blank" id=bug width=100% height=100% ></iframe>',
                     title: '问题追踪'
                  },
                  {
                     xtype: 'panel',
                     cls: 'forum',
                     html: '<iframe src="about:blank" id=forum width=100% height=100% ></iframe>',
                     title: '讨论区'
                  },
                  {
                     xtype: 'panel',
                     cls: 'comment',
                     html: '<iframe src="about:blank" id=comment width=100% height=100% ></iframe>',
                     title: '项目批注'
                  }
               ]
            }
         ]
      });

      me.callParent(arguments);
   }

});