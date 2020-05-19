/*
 * File: app/view/ProjList.js
 *
 */

Ext.define('ProjManage.view.ProjList', {
   extend: 'Ext.grid.Panel',
   alias: 'widget.ProjList',

   id: 'gridpanel',
   store: 'ProjList',
   columnLines: true,

   initComponent: function() {
      var me = this;

      Ext.applyIf(me, {
         columns: grid_column,
/*         [
            {
               xtype: 'rownumberer'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'action',
               text: '操作'
            //},
            //{
            //   xtype: 'gridcolumn',
            //   hidden: false,
            //   width: 63,
            //   dataIndex: 'PROJ_ID',
            //   text: '系统号'
            },
            {
               xtype: 'gridcolumn',
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
               dataIndex: 'PROJ_START_TIME',
               text: '开始'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_END_TIME',
               text: '结束'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_ACT_END_TIME',
               text: '结束（实际）'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_STATUS',
               text: '状态'
            }
         ],
*/
        // selModel: Ext.create('Ext.selection.CheckboxModel', {
        //    allowDeselect: true,
        //    injectCheckbox: 1
        // }),
         viewConfig: {
            loadMask: false
         },
         dockedItems: [
            {
               xtype: 'toolbar',
               dock: 'top',
               layout: {
                  pack: 'center',
                  type: 'hbox'
               },
               items: [
                  {
                     xtype: 'button',
                     style: 'background:white',
                     icon: '/static/images/search_1.png',
                     text: '查询',
                     listeners: {
                        click: {
                           fn: me.SearchProj,
                           scope: me
                        }
                     }
                  },'',
                  {
                     xtype: 'button',
                     style: 'background:white',
                     cls: 'newClick',
                     id: 'newClick',
                     icon: '/static/images/form.gif',
                     text: '新建项目',
                     listeners: {
                        click: {
                           fn: me.CreateNewProj,
                           scope: me
                        }
                     }
                  }
               ]
            },
            {
               xtype: 'toolbar',
               dock: 'top',
               items: [
                  {
                     xtype: 'combobox',
                     id: 'RANGE_CMP',
                     width: 127,
                     name: 'fanwei',
                     fieldLabel: '范围',
                     hideLabel: false,
                     labelWidth: 40,
                     store: 'fanwei',
                     valueField: 'value',
                     displayField:'text',
                     listeners: {
                        change: {
                           fn: me.fanweiChange,
                           scope: me
                        },
                        render: {
                           fn: me.onComboboxRender,
                           delay: 250,
                           scope: me
                        }
                     }
                  },
                  {
                     xtype: 'checkboxfield',
                     fieldLabel: 'Label',
                     hideLabel: true,
                     boxLabel: '显示已结束项目',
                     checked: true,
                     listeners: {
                        change: {
                           fn: me.ShowFinishedProject,
                           scope: me
                        }
                     }
                  }
               ]
            },
            {
               xtype: 'pagingtoolbar',
               id: 'gridpagebar',
               afterPageText: '页，共 {0} 页',
               beforePageText: '第',
               displayInfo: true,
               displayMsg: '第 {0} 至 {1} 条， 共 {2} 条',
               emptyMsg: '暂无项目',
               firstText: '第一页',
               lastText: '最后一页',
               nextText: '下一页',
               prependButtons: true,
               prevText: '前一页',
               refreshText: '刷新',
               store: 'ProjList',
               dock: 'bottom',
               beforechange:function(){refresh_proj_grid();},
               items: [
                  {
                     xtype: 'label',
                     text: '每页'
                  },
                  {
                     xtype: 'numberfield',
                     width: 50,
                     inputId: 'pagesize',
                     value: 10,
                     hideLabel: true,
                     step: 5,
                     minValue:0,
                     listeners: {
                        change: {
                           fn: me.onPageSizeChange,
                           delay: 1,
                           scope: me
                        }
                     }
                  },
                  {
                     xtype: 'label',
                     text: '条'
                  }
               ]
            }
         ]
      });

      me.callParent(arguments);
   },

   SearchProj: function(button, e, options) {
      refresh_proj_grid();
   },

   CreateNewProj: function(button, e, options) {
      if(NewPriv){
         var tabs = Ext.getCmp("center");
         var newtab = tabs.add({
            id :'Tab '+ (tabs.items.length + 1),
            closable:true,
            html:'<iframe frameborder=0 width=100% height=100% src="new/index.php"></iframe>',
            title:  '新建项目'
            //html : 'Another one'
         });


         tabs.setActiveTab(newtab);
      }else{
         alert("您没有立项权限，如需项目立项权限请与管理员联系开通！");
      }
   },

   fanweiChange: function(field, newValue, oldValue, options) {
      var filter = {property:"RANGE",value:newValue};
      refresh_proj_grid(filter);
   },

   onComboboxRender: function(abstractcomponent, options) {
      Ext.getCmp("RANGE_CMP").setValue(0);
   },

   ShowFinishedProject: function(field, newValue, oldValue, options) {
      var filter = {property:"HIDE_FINISHED",value:newValue};
      refresh_proj_grid(filter);

   },

   onPageSizeChange: function(field, newValue, oldValue, options) {
      newValue = parseInt(newValue,10);
      if(newValue<=0 || newValue>300){
         newValue = 10;
         alert("您设置的页面超出范围！");
         $("pagesize").value = newValue;
      }
      Ext.getCmp("gridpagebar").pageSize = newValue;
      refresh_proj_grid();
   }

});