/*
 * File: app.js
 *
 */

Ext.Loader.setConfig({
   enabled: true
});

Ext.application({
   models: [
      'ProjList'
   ],
   stores: [
      'ProjList',
      'DuringTypeStore',
      'ProjNameList'
   ],
   views: [
      'MyViewport',
      'ProjDetail',
      'ProjTab',
      'ProjTitle',
      'TaskList'
   ],
   autoCreateViewport: true,
   name: 'ProjManage',
   //controllers: [
   //   'TaskList',
   //   'ProjTab'
   //],

   launch: function() {
      Ext.get(Ext.query(".x-tbar-loading")[0].parentNode).on("click",function(e){
         e.stopEvent();//修正刷新按钮无法传递参数的BUG
         refresh_grid();
      });
   }

});
