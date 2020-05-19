/*
 * File: app/view/ProjTree.js
 *
 */

Ext.define('ProjManage.view.ProjTree', {
   extend: 'Ext.tree.Panel',
   alias: 'widget.ProjTree',

   autoRender: true,
   id: 'treepanel',
   width: 230,
   collapsible: true,
   title: '��Ŀ����ͼ',
   store: 'ProjTree',
   displayField: 'PROJ_NAME',
   useArrows: true,
   rootVisible:false,

   initComponent: function() {
      var me = this;

      Ext.applyIf(me, {
         viewConfig: {
            autoScroll: true
         },
         columns: [
            {
               xtype: 'treecolumn',
               dataIndex: 'PROJ_NAME',
               flex: 1,
               text: '��Ŀ����'
            },
            {
               xtype: 'gridcolumn',
               renderer: function(value, metaData, record, rowIndex, colIndex, store, view) {
                  var st_color , st_text;
                  switch(record.data["PROJ_STATUS"])
                  {
                     case '0':st_color='#947BD1';st_text='������';break;
                     case '1':st_color='blue';st_text='������';break;
                     case '2':st_color='green';st_text='������';break;
                     case '3':st_color='red';st_text='�ѽ���';break;
                     case '4':st_color='#6d9dd5';st_text='������';break;
					 //״̬Ϊ9��ʾΪ������
                     default : st_color='blue';st_text='������';break;
                  }
                  if(record.data["TIME_OUT"]==1){
                     st_color='red';
                     st_text='�ѳ�ʱ';
                  }
                  return '<font color="'+st_color+'">'+st_text+'</font>';
               },
               dataIndex: 'PROJ_STATUS',
               groupable: true,
               text: '״̬'
            }
         ],
         root: {
            text: 'default',
            expanded: true,
            children: [
               {
                  text: 'default',
                  leaf: true
               }
            ]
         },
         dockedItems: [
            {
               xtype: 'toolbar',
               height: 60,
               width: 230,
               dock: 'top',
               items: [
                  {
                     xtype: 'fieldcontainer',
                     height: 60,
                     width: 230,
                     layout: {
                        type: 'column'
                     },
                     fieldLabel: '����',
                     hideLabel: true,
                     items: [
                        {
                           contentEl: 'PROJ_TYPE'
                        },
                        {
                           contentEl: 'STATUS'
                        },
                        {
                           xtype: 'button',
                           id: 'treeRefresh',
                           text: 'ˢ��',
                           listeners: {
                              click: {
                                 fn: me.onButtonClick,
                                 scope: me
                              }
                           }
                        },
                        {
                           xtype: 'datefield',
                           width: 100,
                           inputId: 'TREE_DATE1',
                           name: 'TREE_DATE1',
                           fieldLabel: 'Label',
                           hideLabel: true,
                           format: 'Y-m-d'
                        },
                        {
                           xtype: 'label',
                           text: ' �� '
                        },
                        {
                           xtype: 'datefield',
                           width: 100,
                           inputId: 'TREE_DATE2',
                           name: 'TREE_DATE2',
                           fieldLabel: 'Label',
                           hideLabel: true,
                           format: 'Y-m-d'
                        }
                     ]
                  }
               ]
            },
            {
               xtype: 'toolbar',
               height: 40,
               width: 230,
               dock: 'top',
               items: [
                  {
                     xtype: 'fieldcontainer',
                     height: 40,
                     width: 230,
                     margin:'0 0 0 10',
                     layout: {
                        type: 'column'
                     },
                     fieldLabel: '����',
                     hideLabel: true,
                     items: [
                        {
                           xtype: 'button',
                           height: 25,
                           width: 100,
                           id: 'xx',
                           text: '����',
                           listeners: {
                              click: {
                                 fn: me.onBackClick,
                                 scope: me
                              }
                           }
                        }
                     ]
                  }
               ]
            }
          
         ],
         listeners: {
            itemclick: {
               fn: me.SelProj,
               scope: me
            }
         }
      });

      me.callParent(arguments);
   },

   onButtonClick: function(button, e, options) {
     refresh_proj_tree();
   },
   onBackClick: function ()
   {
    location='/general/project/portal/';
    },

   SelProj: function(tablepanel, record, item, index, e, options) {
      e.stopEvent();
      var PROJ_ID = record.data.id;
      var PROJ_NAME = record.data.PROJ_NAME;
      if(PROJ_NAME){
         detail_proj(PROJ_ID,PROJ_NAME);
      }
   }

});