/*
 * File: app/model/ProjTree.js
 *
 */

Ext.define('ProjManage.model.ProjTree', {
   extend: 'Ext.data.Model',

   fields: [
      {
         name: 'PROJ_NAME'
      },
      {
         name: 'PROJ_STATUS'
      },
      {
         name: 'TIME_OUT'
      }
   ]
});