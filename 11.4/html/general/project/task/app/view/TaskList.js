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
               text: '操作'
            },
            //{
             //  xtype: 'gridcolumn',
            //   width: 50,
            //   dataIndex: 'TASK_ID',
            //   text: '系统号'
            //},
            {
               xtype: 'gridcolumn',
               width: 80,
               dataIndex: 'PROJ_NUM',
               text: '项目编号'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_NAME',
               text: '项目名称'
            },
            {
               xtype: 'gridcolumn',
               width: 84,
               dataIndex: 'TASK_NAME',
               text: '任务名称'
            },
            {
               xtype: 'gridcolumn',
               width: 62,
               dataIndex: 'TASK_LEVEL',
               text: '任务等级'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_START_TIME',
               text: '开始日期'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_TIME',
               text: '工期'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_END_TIME',
               text: '结束日期'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_END_TIME',
               text: '项目结束日期'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'TASK_STATUS',
               text: '状态'
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
                     text: '结束任务'
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
                     boxLabel: '显示已结束任务',
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
               afterPageText: '页，共 {0} 页',
               beforePageText: '第',
               displayInfo: true,
               displayMsg: '第 {0} 至 {1} 条， 共 {2} 条',
               emptyMsg: '暂无项目',
               firstText: '第一页',
               lastText: '最后一页',
               nextText: '下一页',
               prevText: '前一页',
               refreshText: '刷新',
               store: 'ProjList',
               dock: 'bottom',
               items: [
                  /*{
                     xtype: 'numberfield',
                     width: 115,
                     inputId: 'pagesize',
                     value: 10,
                     fieldLabel: '每页条数',
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
      Ext.getCmp("ProjNameList").setValue("输入关键词查询项目名称...");
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