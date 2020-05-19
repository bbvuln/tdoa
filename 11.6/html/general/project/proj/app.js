/*
 * File: app.js
 *
 */

Ext.Loader.setConfig({
   enabled: true
});

Ext.application({
   models: [
      'ProjList',
      'ProjTree'
   ],
   stores: [
      'ProjList',
      'ProjTree',
      'fanwei'
   ],
   views: [
      'MyViewport',
      'ProjDetail',
      'ProjTab',
      'ProjTitle',
      'ProjList',
      'MyFieldSet',
      'ProjTree'
   ],
   autoCreateViewport: true,
   name: 'ProjManage',

   launch: function() {
      Ext.get(Ext.query(".x-tbar-loading")[0].parentNode).on("click",function(e){
         e.stopEvent();
         refresh_proj_grid();
      });

   }

});
