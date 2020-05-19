jQuery(function (){
    jQuery(document).ready(function() {
        var moduleCenter = {
            init: function(){
                this.get_module_info();
            },
            get_module_info: function(m){
                jQuery.ajax({
                    type: 'GET',
                    url:'get_set_val.php',
                    data:{
                        action: "init",
                        module_type_str: m
                    },
                    async: true,
                    success:function(d){
                        var k = d.module_str;
                        var v = d.val;
                        var p = d.priv;
                        if(k.indexOf('1') >= 0){
                            jQuery("#email_manager").empty();
                            jQuery("#email_manager").html(v["1"]);
                        }
                        if(p==1){
                            jQuery("#module_priv_1").show();
                            jQuery("#set_priv_1").show();
                        }else if(k.indexOf('1')>=0){
                            jQuery("#module_priv_1").show();
                        }
                        
                        if(k.indexOf('2') >= 0){
                            jQuery("#diary_manager").empty();
                            jQuery("#diary_manager").html(v["2"]);
                        }
                        if(p==1){
                            jQuery("#module_priv_2").show();
                            jQuery("#set_priv_2").show();
                        }else if(k.indexOf('2')>=0){
                            jQuery("#module_priv_2").show();
                        }
                        
                        if(k.indexOf('3') >= 0){
                            jQuery("#notify_manager").empty();
                            jQuery("#notify_manager").html(v["3"]);
                        }
                        if(p==1){
                            jQuery("#module_priv_3").show();
                            jQuery("#set_priv_3").show();
                        }else if(k.indexOf('3')>=0){
                            jQuery("#module_priv_3").show();
                        }
                        
                        if(k.indexOf('4') >= 0){
                            jQuery("#knowledge_manager").empty();
                            jQuery("#knowledge_manager").html(v["4"]);
                        }
                        if(p==1){
                            jQuery("#module_priv_4").show();
                            jQuery("#set_priv_4").show();
                        }else if(k.indexOf('4')>=0){
                            jQuery("#module_priv_4").show();
                        }
                        
                        if(k.indexOf('5') >= 0){
                            jQuery("#hr_manager").empty();
                            jQuery("#hr_manager").html(v["5"]);
                        }
                        if(p==1){
                            jQuery("#module_priv_5").show();
                            jQuery("#set_hr_manager").show();
                        }else if(k.indexOf('5')>=0){
                            jQuery("#module_priv_5").show();
                        }
                        
                        if(k.indexOf('6') >= 0){
                            jQuery("#approve_center_manager").empty();
                            jQuery("#approve_center_manager").html(v["6"]);
                        }
                        if(p==1){
                            jQuery("#module_priv_6").show();
                            jQuery("#set_priv_6").show();
                        }else if(k.indexOf('6')>=0){
                            jQuery("#module_priv_6").show();
                        }
                    }
                });
            },
            edit_manager: function(m){
                if(!m){
                    return null;
                }
                
                jQuery.ajax({
                    type: 'GET',
                    url:'get_set_val.php',
                    data:{
                        action: "edit",
                        module_type: m
                    },
                    async: true,
                    success:function(d){
                        if(d){
                            jQuery('#to_id').val(d.user_id);
                            jQuery('#to_name').val(d.user_name);
                            jQuery('#dept_id').val(d.dept_id);
                            jQuery('#dept_name').val(d.dept_name);
                            jQuery('#priv_id').val(d.priv_id);
                            jQuery('#priv_name').val(d.priv_name);
                        }
                    }
                });
            },
            reshow: function(m, a){
                if(!m || !a){
                    return null;
                }
                
                var m_name_arr = new Array();
                m_name_arr[1] = "email";
                m_name_arr[2] = "diary";
                m_name_arr[3] = "notify";
                m_name_arr[4] = "knowledge";
                m_name_arr[5] = "hr";
                m_name_arr[6] = "approve_center";
                var module_id = m_name_arr[m];
                jQuery("#"+module_id+"_manager").empty();
                jQuery("#"+module_id+"_manager").html(a);
            }
        };
        
        window.moduleCenter = moduleCenter;
        moduleCenter.init();
        
        jQuery("[data-toggle='modal']").click(function(){
            var module_type = jQuery(this).attr('data-type');
            jQuery('#module_type').val(module_type);
            moduleCenter.edit_manager(module_type);
        });
        
        jQuery("button[type='submit']").click(function(){
            var to_id = jQuery('#to_id').val();
            var dept_id = jQuery('#dept_id').val();
            var priv_id = jQuery('#priv_id').val();
            var module_type = jQuery('#module_type').val(); 
            jQuery.ajax({
                type: 'GET',
                url:'set_manage.php',
                data:{
                    to_id: to_id,
                    dept_id: dept_id,
                    priv_id: priv_id,
                    module_type: module_type
                },
                async: false,
                success:function(d){
                    if(d == 'success'){
//                        moduleCenter.reshow(module_type, d.val);
                        alert("设置成功！");
                    }else{
                        alert("设置失败！");
                    }
                }
            });
        });
       if((window.external && typeof window.external.OA_SMS != 'undefined') || $("#login_theme").val() < 10)
		{
		   jQuery("[data-type='work_form']").click(function(){
				window.open("/general/system/approve_center/flow_form");
			});
			
			jQuery("[data-type='work_flow']").click(function(){
				window.open("/general/system/approve_center/flow_guide");
			});
			
			jQuery("[data-type='work_sort']").click(function(){
				window.open("/general/system/approve_center/flow_sort");
			});
			jQuery("[data-type='work_hook']").click(function(){
				window.open("/general/system/approve_center/flow_hook");
			});

			jQuery("[data-type='diary_setting']").click(function(){
				window.open("/general/system/diary");
			});
			
			jQuery("[data-type='notify_setting']").click(function(){
				window.open("/general/system/notify");
			});
			
			jQuery("[data-type='knowledge_file']").click(function(){
				window.open("/general/system/file_folder");
			});
			
			jQuery("[data-type='knowledge_netdisk']").click(function(){
				window.open("/general/system/netdisk");
			});
			
			jQuery("[data-type='knowledge_image']").click(function(){
				window.open("/general/picture");
			});
			
			jQuery("[data-type='email_setting']").click(function(){
				window.open("/general/system/email");
			});
			
			jQuery("#set_hr_manager").click(function(){
				window.open("/general/hr/setting/hr_manager");
			});
			
			jQuery("[data-type='hr_attendance']").click(function(){
				window.open("/general/hr/setting/attendance");
			});
			
			jQuery("[data-type='hr_hrms']").click(function(){
				window.open("/general/hr/setting/hr_code");
			});
		}
		else
		{
			jQuery("[data-type='work_form']").click(function(){
                
            	top.createTab(37,'设计表单','system/approve_center/flow_form','');
			});
			jQuery("[data-type='work_flow']").click(function(){
				top.createTab(135,'设计流程','system/approve_center/flow_guide','');
			});
			jQuery("[data-type='work_sort']").click(function(){
				top.createTab(136,'分类设置','system/approve_center/flow_sort','');
			});
			jQuery("[data-type='work_hook']").click(function(){
				top.createTab(253,'业务引擎设置','system/approve_center/flow_hook','');
			});
			
			jQuery("[data-type='diary_setting']").click(function(){
				top.createTab(146,'工作日志设置','system/diary','');
			});
			
			jQuery("[data-type='notify_setting']").click(function(){
				top.createTab(197,'公告通知设置','system/notify','');
			});
			
			jQuery("[data-type='knowledge_file']").click(function(){
				top.createTab(36,'公共文件柜设置','system/file_folder','');
			});
			jQuery("[data-type='knowledge_netdisk']").click(function(){
				top.createTab(77,'网络硬盘设置','system/netdisk','');
			});
			jQuery("[data-type='knowledge_image']").click(function(){
				top.createTab(116,'图片浏览设置','system/picture','');
			});
			
			jQuery("[data-type='email_setting']").click(function(){
				top.createTab(538,'电子邮件设置','system/email','');
			});
			
			jQuery("#set_hr_manager").click(function(){
				top.createTab(512,'人力资源管理员','hr/setting/hr_manager','');
			});
			jQuery("[data-type='hr_attendance']").click(function(){
				top.createTab(39,'考勤设置','hr/setting/attendance','');
			});
			jQuery("[data-type='hr_hrms']").click(function(){
				top.createTab(513,'HRMS代码设置','hr/setting/hr_code','');
			});
		}     
    });
});