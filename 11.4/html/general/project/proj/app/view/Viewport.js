/*
 * File: app/view/Viewport.js
 *
 */

Ext.define('ProjManage.view.Viewport', {
   extend: 'ProjManage.view.MyViewport',
   renderTo: Ext.getBody(),
   requires: [
      'ProjManage.view.ProjDetail',
      'ProjManage.view.MyViewport'
   ]
});