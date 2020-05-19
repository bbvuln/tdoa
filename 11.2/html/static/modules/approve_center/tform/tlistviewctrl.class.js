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
			this.row_required = $('table[id="LV_'+config['item_id']+'"]').attr('required');
            this.id = config.item_id;
            this.required = config.required;
            this.desc = config.desc;
			this.tempFlag = false;
            this.bindCalc(lv_table_id, config['lv_cal'], config['list_priv']);
            this.bindEvent();
			
			// if(typeof(listLoadFlag) !== 'undefined' && typeof(lastListName) !== 'undefined' && config['id'] == lastListName)
			// {
				// listLoadFlag = true;
			// }
        },
        
        setOffsetTop: function() {
            var obj_val = this.$obj.val();
            obj_val = obj_val && obj_val.replace(/(\n|\`)/g, "");
            var required_val = this.required,
                id = this.id;
            if(((obj_val == '' || typeof obj_val == 'undefined') && required_val) || this.tempFlag)
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
			this.tempFlag = false;
            var obj_val = this.$obj.val();
			var row_val = obj_val;
            obj_val = obj_val && obj_val.replace(/(\n|\`)/g, "");
            var required_val = this.required,
                id = this.id;
			var row_required_val = typeof(this.row_required) == 'undefined' ? '' : this.row_required;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val && row_required_val == '')
            {
                this.validation(this.desc);
                this.bindEvent();
                setTimeout(function(){
                    var api = $('#LV_'+id+'').find('td:last').prev().data('tipsy');
                    api && api.hide();
                }, 5000);
                return false;
            }else if(row_required_val != '')
			{
				var row_arr = row_required_val.split('`');
				var val_arr =  row_val == '' ?  '' : row_val.split('\n');
				var temp_arr = [];
				if(val_arr != '')
				{
					for(var i=0;i<val_arr.length;i++)
					{
						if(val_arr[i] == '')
							continue;
						var ceil_arr = val_arr[i].split('`');
						for(var j=0;j<ceil_arr.length;j++)
						{
							temp_arr[j] = typeof(temp_arr[j]) == 'undefined' ? ceil_arr[j]+'`' : temp_arr[j]+ceil_arr[j]+'`';
						}
					}
				}
				
				for(var m=0;m<row_arr.length;m++)
				{
					if(row_arr[m] == 0)
						continue;
					var flag = false;
					var temp_val = temp_arr.length == 0 ? "" : temp_arr[m];
					if(row_arr[m] == 1)
					{
						if(temp_val == '')
						{
							flag = true;
						}else
						{
							temp_val = temp_val.substr(0, temp_val.length-1);
							var tempArr = temp_val.split('`');
							for(var i=0;i<tempArr.length;i++)
							{
								if(tempArr[i] == '')
								{
									flag = true;
									break;
								}
							}
						}
						if(flag == true)
						{
							this.tempFlag = flag;
							this.validation(this.desc,m+1);
							this.bindEvent(m+1);
						}
					}
				}
				setTimeout(function(){
					var row_required_val = $('table[id="LV_'+id+'"]').attr('required');
					var row_arr = row_required_val.split('`');
					for(var m=0;m<row_arr.length;m++)
					{
						if(row_arr[m] == 0)
							continue;
						var api = $('#LV_'+id+'').find("td").eq(m+1).data('tipsy');
						api && api.hide();
					}
				}, 5000);
				if(this.tempFlag == true)
					return false;
			}
        },
        
        validation: function(s,i) {
			var ceil_show = typeof(i) != 'undefined' && i!= '' ? $('#LV_'+this.id+'').find("td").eq(i) : $('#LV_'+this.id+'').find('td:last').prev();
            ceil_show.tipsy({
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
        bindEvent: function(i) {
            var domObj = null,
                self = this,
                //a = $('#LV_'+self.id+'').find('td:last').prev();
			a = typeof(i) != 'undefined' && i!= '' ? $('#LV_'+self.id+'').find("td").eq(i) : $('#LV_'+self.id+'').find('td:last').prev();
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

