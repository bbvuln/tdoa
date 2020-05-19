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
               text: '����'
            //},
            //{
            //   xtype: 'gridcolumn',
            //   hidden: false,
            //   width: 63,
            //   dataIndex: 'PROJ_ID',
            //   text: 'ϵͳ��'
            },
            {
               xtype: 'gridcolumn',
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
               dataIndex: 'PROJ_START_TIME',
               text: '��ʼ'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_END_TIME',
               text: '����'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_ACT_END_TIME',
               text: '������ʵ�ʣ�'
            },
            {
               xtype: 'gridcolumn',
               dataIndex: 'PROJ_STATUS',
               text: '״̬'
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
                     text: '��ѯ',
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
                     text: '�½���Ŀ',
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
                     fieldLabel: '��Χ',
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
                     boxLabel: '��ʾ�ѽ�����Ŀ',
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
               afterPageText: 'ҳ���� {0} ҳ',
               beforePageText: '��',
               displayInfo: true,
               displayMsg: '�� {0} �� {1} ���� �� {2} ��',
               emptyMsg: '������Ŀ',
               firstText: '��һҳ',
               lastText: '���һҳ',
               nextText: '��һҳ',
               prependButtons: true,
               prevText: 'ǰһҳ',
               refreshText: 'ˢ��',
               store: 'ProjList',
               dock: 'bottom',
               beforechange:function(){refresh_proj_grid();},
               items: [
                  {
                     xtype: 'label',
                     text: 'ÿҳ'
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
                     text: '��'
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
            title:  '�½���Ŀ'
            //html : 'Another one'
         });


         tabs.setActiveTab(newtab);
      }else{
         alert("��û������Ȩ�ޣ�������Ŀ����Ȩ���������Ա��ϵ��ͨ��");
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
         alert("�����õ�ҳ�泬����Χ��");
         $("pagesize").value = newValue;
      }
      Ext.getCmp("gridpagebar").pageSize = newValue;
      refresh_proj_grid();
   }

});