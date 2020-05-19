
    (function($){
        $(document).ready(function(){
            var columnType = '';

            var powerManage = {
                init:function(){
                    this.getTreeInfo()
                },
                //��ȡ��������
                getTreeInfo:function(){
                    var _this = this;
                    $('#portalPowerTree').jstree({
                        'core': {
                            'data': 
                            {   //��̨���󵽵���Ⱦ����
                                'url':'/general/appbuilder/web/portal/portalcontents/getcolumns', //�������ݵ�ַ
                                'dataType': "json", //�������ݵ�����
                                'data': function (node) { //�������
                                    if(node.id=='#'){
                                        return {'portal_id':0,'is_new':'','portal_name':'','priv_manage':'1'};
                                    }else{
                                        return {'portal_id':node.original.portal_id,'is_new':node.original.is_new,'portal_name':node.text,'template_id':node.original.template_id,'priv_manage':'1'};
                                    }
                                }
                            }
                        },
                        'types': {                         //�������ͼƬ����ʾ��ʽ
                            // "default": {
                            //     "icon": "fa fa-folder tree-item-icon-color icon-lg"
                            // },
                            "file": {
                                "icon": "fa fa-file tree-item-icon-color icon-lg"
                            }
                        },
                        'plugins': [                       //����������ǲ���Ĺ���
                            'types',                      //����������ͼ�꣬�������һ����
                            // 'contextmenu',                //�ı��˵�
                            'wholerow',                   //
                            'unique'                      //����----��ֹ�ظ���(����ӵ�)
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
                            alert('��ȡȨ������ʧ��');
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
                            alert('��ȡȨ������ʧ��');
                        }
                    })
                }
            };
            powerManage.init();
            window.powerManage = powerManage;
        });
    })(jQuery);
