
    (function($){
        $(document).ready(function(){
            var columnType = '';

            var powerManage = {
                init:function(){
                    this.getTreeInfo()
                },
                //获取树的数据
                getTreeInfo:function(){
                    var _this = this;
                    $('#portalPowerTree').jstree({
                        'core': {
                            'data': 
                            {   //后台请求到的渲染数据
                                'url':'/general/appbuilder/web/portal/portalcontents/getcolumns', //请求数据地址
                                'dataType': "json", //请求数据的类型
                                'data': function (node) { //请求参数
                                    if(node.id=='#'){
                                        return {'portal_id':0,'is_new':'','portal_name':'','priv_manage':'1'};
                                    }else{
                                        return {'portal_id':node.original.portal_id,'is_new':node.original.is_new,'portal_name':node.text,'template_id':node.original.template_id,'priv_manage':'1'};
                                    }
                                }
                            }
                        },
                        'types': {                         //这里就是图片的显示格式
                            // "default": {
                            //     "icon": "fa fa-folder tree-item-icon-color icon-lg"
                            // },
                            "file": {
                                "icon": "fa fa-file tree-item-icon-color icon-lg"
                            }
                        },
                        'plugins': [                       //插件，下面是插件的功能
                            'types',                      //可以设置其图标，在上面的一样。
                            // 'contextmenu',                //文本菜单
                            'wholerow',                   //
                            'unique'                      //独特----防止重复。(新添加的)
                        ]
                    });
                    $('#portalPowerTree').bind("activate_node.jstree", function (obj, e) {
                        $('#add_new').attr('checked',false);
                        $('#delate_new').attr('checked',false);
                        if(e.node.original.source == '0'  || e.node.original.source == '1'){
                            $('#welcome_power').addClass('hide');
                            $('#complete_box').addClass('hide');
                            $('#custom_box').addClass('hide');
                            $('#power_box').removeClass('hide');
                            var powerParams = {};
                            if(e.node.parent != '#'){
                                $('#portal_id').val(e.node.original.portal_id);
                                $('#column_id').val(e.node.original.column_id);
                                powerParams.portal_id = e.node.original.portal_id;
                                powerParams.column_id = e.node.original.column_id;
                            }else{
                                $('#portal_id').val(e.node.original.portal_id);
                                $('#column_id').val(e.node.original.column_id);
                                powerParams.portal_id = e.node.original.portal_id;
                                powerParams.column_id = e.node.original.column_id;
                            }
                            
                            powerParams.use_flag = e.node.original.use_flag;
                            powerParams.type = e.node.original.type;
                            columnType = e.node.original.type;
                            _this.getPowerInfo(powerParams);
                        }else{
                            $('#welcome_power').addClass('hide');
                            $('#complete_box').addClass('hide');
                            $('#custom_box').removeClass('hide');
                            $('#power_box').addClass('hide');
                        }
                        

                    });
                    
                },
                getPowerInfo:function(params){
                    var _this = this;
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalpriv/showpriv',
                        data:params,
                        success:function(res){
                            if(res.status==1){
                                $('#DEPT_IDS').val(res.data[0].dept_id);
                                $('#DEPT_NAMES').val(res.data[0].dept_name);
                                $('#PRIV_IDS').val(res.data[0].priv_id);
                                $('#PRIV_NAMES').val(res.data[0].priv_name);
                                $('#USER_IDS').val(res.data[0].user_id);
                                $('#USER_NAMES').val(res.data[0].user_name);

                                $('#DELE_DEPT_IDS').val(res.data[0].delete_dept_id);
                                $('#DELE_DEPT_NAMES').val(res.data[0].delete_dept_name);
                                $('#DELE_PRIV_IDS').val(res.data[0].delete_priv_id);
                                $('#DELE_PRIV_NAMES').val(res.data[0].delete_priv_name);
                                $('#DELE_USER_IDS').val(res.data[0].delete_user_id);
                                $('#DELE_USER_NAMES').val(res.data[0].delete_user_name);
                                
                                
                            }
                            
                        },
                        error:function(){
                            alert('获取权限数据失败');
                        }
                    })
                },
                submitPower:function(){
                    var params = {};
                    params.DEPT_IDS = $('#DEPT_IDS').val();
                    params.PRIV_IDS = $('#PRIV_IDS').val();
                    params.USER_IDS = $('#USER_IDS').val();

                    params.DELE_DEPT_IDS = $('#DELE_DEPT_IDS').val();
                    params.DELE_PRIV_IDS = $('#DELE_PRIV_IDS').val();
                    params.DELE_USER_IDS = $('#DELE_USER_IDS').val();

                    params.portal_id = $('#portal_id').val();
                    params.column_id = $('#column_id').val();

                    params.type = columnType;
                    
                    $('#add_new').prop('checked')?params.add_new = 'on':params.add_new = '';
                    $('#delate_new').prop('checked')?params.delate_new = 'on':params.delate_new = '';
                    
                    $.ajax({
                        type:'GET',
                        url:'/general/appbuilder/web/portal/portalpriv/addpriv',
                        data:params,
                        success:function(res){
                            if(res.status == 1){
                                $('#complete_box').removeClass('hide');
                                $('#power_box').addClass('hide');
                            }
                            
                        },
                        error:function(){
                            alert('获取权限数据失败');
                        }
                    })
                }
            };
            powerManage.init();
            window.powerManage = powerManage;
        });
    })(jQuery);
