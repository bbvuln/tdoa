/*
 * File: app/view/TaskList.js
 *
 */

Ext.define('ProjManage.view.TaskList', {
   extend: 'Ext.grid.Panel',
   alias: 'widget.TaskList',

   autoRender: true,
   autoShow: false,
   id: 'gridpanel',
   store: 'ProjList',
   columnLines: true,

   initComponent: function() {
      var me = this;

      Ext.applyIf(me, {
         columns: [
            {
               xtype: 'rownumberer',
               width: 28,
               text: ''
            },
            {
               xtype: 'gridcolumn',
               width: 87,
               dataIndex: 'action',
               text: '����'
            },
            //{
             //  xtype: 'gridcolumn',
            //   width: 50,
            //   dataIndex: 'TASK_ID',
            //   text: 'ϵͳ��'
            //},
            {
               xtype: 'gridcolumn',
               width: 80,
               dataIndex: 'PROJ_NUM',
               text: '��Ŀ���'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_NAME',
               text: '��Ŀ����'
            },
            {
               xtype: 'gridcolumn',
               width: 84,
               dataIndex: 'TASK_NAME',
               text: '��������'
            },
            {
               xtype: 'gridcolumn',
               width: 62,
               dataIndex: 'TASK_LEVEL',
               text: '����ȼ�'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_START_TIME',
               text: '��ʼ����'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_TIME',
               text: '����'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_END_TIME',
               text: '��������'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_END_TIME',
               text: '��Ŀ��������'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_STATUS',
               text: '״̬'
            }
         ],
         selModel: Ext.create('Ext.selection.CheckboxModel', {
            allowDeselect: true,
            injectCheckbox: 1
         }),
         viewConfig: {
            loadMask: false
         },
         dockedItems: [
            {
               xtype: 'toolbar',
               height: 30,
               width: 538,
               dock: 'top',
               items: [
                  {
                     xtype: 'button',
                     height: 25,
                     hidden: true,
                     width: 90,
                     icon: '/static/images/email_delete.gif',
                     text: '��������'
                  },
                  {
                     xtype: 'combobox',
                     id: 'dTimeType',
                     width: 97,
                     name: 'DuringType',
                     hideLabel: true,
                     disableKeyFilter: true,
                     forceSelection: true,
                     store: 'DuringTypeStore',
                     valueField: 'type',
                     listeners: {
                        change: {
                           fn: me.onDTimeTypeChange,
                           scope: me
                        },
                        render: {
                           fn: me.onDTimeTypeRender,
                           scope: me
                        }
                     }
                  },
                  {
                     xtype: 'combobox',
                     name: 'ProjNameList',
                     id: 'ProjNameList',
                     width: 300,
                     fieldLabel: 'Label',
                     hideLabel: true,
                     displayField: 'PROJ_NAME',
                     store: 'ProjNameList',
                     valueField: 'PROJ_ID',
                     typeAhead:true,
                     minChars:1,
                     pageSize: 10,
                     queryParam:'queryStr',
                     //queryMode:'local',
                     listeners: {
                        render: {
                           fn: me.onProjNameListRender,
                           scope: me
                        },
                        focus:  {
                           fn: me.onProjNameListFocus,
                           scope: me
                        },
                        select: {
                           fn: me.onProjNameListSelect,
                           scope: me
                        }
                     }
                  },
                  {
                     xtype: 'checkboxfield',
                     name: 'HideFinished',
                     id: 'HideFinished',
                     fieldLabel: 'Label',
                     hideLabel: true,
                     boxLabel: '��ʾ�ѽ�������',
                     checked: false,
                     listeners: {
                        change: {
                           fn: me.onCheckboxfieldChange,
                           scope: me
                        }
                     }
                  }
               ]
            },
            {
               xtype: 'pagingtoolbar',
               id: 'gridpagebar',
               width: 360,
               afterPageText: 'ҳ���� {0} ҳ',
               beforePageText: '��',
               displayInfo: true,
               displayMsg: '�� {0} �� {1} ���� �� {2} ��',
               emptyMsg: '������Ŀ',
               firstText: '��һҳ',
               lastText: '���һҳ',
               nextText: '��һҳ',
               prevText: 'ǰһҳ',
               refreshText: 'ˢ��',
               store: 'ProjList',
               dock: 'bottom',
               items: [
                  /*{
                     xtype: 'numberfield',
                     width: 115,
                     inputId: 'pagesize',
                     value: 10,
                     fieldLabel: 'ÿҳ����',
                     hideLabel: false,
                     labelWidth: 60,
                     step: 5,
                     minValue:1,
                     listeners: {
                        change: {
                           fn: me.onPageSizeChange,
                           delay: 250,
                           scope: me
                        }
                     }
                  }*/
               ]
            }
         ]
      });

      me.callParent(arguments);
   },

   onDTimeTypeChange: function(field, newValue, oldValue, options) {
      var filter = {property:"RANGE",value:newValue};
      refresh_grid(filter);
   },

   onDTimeTypeRender: function(abstractcomponent, options) {
      Ext.getCmp("dTimeType").setValue("0");
   },

   onProjNameListRender: function(abstractcomponent, options) {
      Ext.getCmp("ProjNameList").setValue("����ؼ��ʲ�ѯ��Ŀ����...");
   },
   onProjNameListFocus: function() {
      Ext.getCmp("ProjNameList").setValue("");
   },
   onProjNameListSelect: function(combo, records, options) {
      var newValue = combo.getValue();
      var filter = {property:"PROJ_ID",value:newValue};
      refresh_grid(filter);
   },

   onCheckboxfieldChange: function(field, newValue, oldValue, options) {

      var filter = {property:"HIDEFIN",value:newValue};
      refresh_grid(filter);

   },

   onPageSizeChange: function(field, newValue, oldValue, options) {
      Ext.getCmp("gridpagebar").pageSize = parseInt(newValue); 
      refresh_grid();
   }

});