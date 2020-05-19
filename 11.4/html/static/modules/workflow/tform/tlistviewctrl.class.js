define('TListViewCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TListViewCtrl = Base.extend({

        initialize: function(config) {
            TListViewCtrl.superclass.initialize.call(this, config);
            
            var lv_table_id = "LV_" + config['item_id'];
            var read_only;
            var new_width = config['new_width'];
            if(config['add_op'] == 1)
            {
                var btn_add_id  = "add_btn_" + config['item_id']
                var btn_add_obj = $('#'+ btn_add_id);
                if(btn_add_obj)
                {
                    btn_add_obj.click(function(){
                        var add_row_num = parseInt($('#add_btn_num_'+config['item_id']).val());
                        for(var i=0; i<add_row_num; i++)
                        {
                            tb_addnew(lv_table_id, '0', '', '1', new_width);
                        }
                    });
                    
                }

                var btn_calc_id  = "calc_btn_" + config['item_id'];
                var btn_calc_obj = $('#'+ btn_calc_id);

                if(btn_calc_obj)
                {   
                    btn_calc_obj.click(function(){
                        
                        tb_cal(lv_table_id, config['lv_cal']);
                    
                    });
                }
               /* var btn_add = $('#');

                tb_addnew(lv_tb_id,read_only,row_value,is_del);
                var btn_del = 
                add_btn_\"".$this->_attr ['name']*/
            }
            
            if(config['init_value'] != "")
            {
                var arr_value = config['init_value'].split("\r\n");
                var value_count = arr_value.length;
                if(arr_value[value_count - 1] == "")
                {
                    value_count--;
                }
                for(var i = 0; i < value_count; i++)
                {
                    if(config['edit_op'] == 1)
                    {
                        tb_addnew(lv_table_id, 0, arr_value[i], config['delete_op'], new_width);
                        
                    }else
                    {
                        tb_addnew(lv_table_id, 1, arr_value[i], config['delete_op'], new_width);

                    }
                }
                // if($('#add_btn_'+config['item_id']).length > 0 && value_count < config['default_cols']){
                    // for(var j=0;j<config['default_cols']-value_count;j++){
                        // tb_addnew(lv_table_id, '0', '', '1');
                    // }
                // }
            }else{
                if($('#add_btn_'+config['item_id']).length > 0){
                    for(var j=0;j<config['default_cols'];j++){
                        tb_addnew(lv_table_id, '0', '', '1', new_width);
                    }
                }
            }

            this.$obj = $('input[name="'+config ['id']+'"]').eq(0);
            this.id = config.item_id;
            this.required = config.required;
            this.desc = config.desc;
            this.bindCalc(lv_table_id, config['lv_cal'], config['list_priv']);
            this.bindEvent();
        },
        
        setOffsetTop: function() {
            var obj_val = this.$obj.val();
            obj_val = obj_val && obj_val.replace(/(\n|\`)/g, "");
            var required_val = this.required,
                id = this.id;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.bindEvent();
                var objTop = $('#LV_'+id+'').find('td:last').prev().offset().top;
                $("body,html").animate({ 
                    scrollTop: objTop - 150
                },50); 
                return false;
            }            
        },
        
        onSubmit: function()
        {
            var obj_val = this.$obj.val();
            obj_val = obj_val && obj_val.replace(/(\n|\`)/g, "");
            var required_val = this.required,
                id = this.id;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                this.bindEvent();
                setTimeout(function(){
                    var api = $('#LV_'+id+'').find('td:last').prev().data('tipsy');
                    api && api.hide();
                }, 5000);
                return false;
            }
        },
        
        validation: function(s) {
            $('#LV_'+this.id+'').find('td:last').prev().tipsy({
                title: function () {
                    this.title = this.getAttribute('original-title');
                    this.removeAttribute('original-title');
                    return '<b style="color:#E25C5C;">' + s + '</b>';
                },
                html: true,
                fade: true,
                gravity: $.fn.tipsy.autoNS,
                opacity: 1,
                trigger: 'manual',
                container: '#content-main',
                fixPos: function(tp){ 
                //tp.left -= 50;  
                    return tp; 
                }
            }).tipsy('show');
        },
        
        bindEvent: function() {
            var domObj = null,
                self = this,
                a = $('#LV_'+self.id+'').find('td:last').prev();
            $('#LV_'+this.id+'').find('td').each(function(){
            
                if($(this).find('input').length == 1)
                {
                    domObj = $(this).find('input');
                }
                else if($(this).find('textarea').length == 1)
                {
                    domObj = $(this).find('textarea');
                }
                else if($(this).find('select').length == 1)
                {
                    domObj = $(this).find('select');
                }
                else if($(this).find('button').length == 1)
                {
                    domObj = $(this).find('button');
                }
                else
                {
                    domObj = $(this);
                }
                
                domObj.bind('click', function(){
                    var api = a.data('tipsy');
                    api && api.hide();
                });
               
            });
            
            $('#add_btn_'+this.id+'').bind('click', function(){
                var api = a.data('tipsy');
                api && api.hide();
            });
        },
        
        bindCalc:function(lv_table_id, lv_cal, list_priv){
             var func = function(){
                tb_cal(lv_table_id, lv_cal, list_priv);
                var func = arguments.callee; 
                setTimeout(func, 500); 
             };  
            
            func();
        }

    });
    exports.TListViewCtrl = window.TListViewCtrl = TListViewCtrl;
});

