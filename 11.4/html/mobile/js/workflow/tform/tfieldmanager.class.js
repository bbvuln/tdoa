define('TFieldManager', ['TFieldLoader',"base"], function(require, exports, module){    
    var $ = jQuery;
    var Base = require('base');
    var Fields = require('TFieldLoader');
    var TFieldManager = Base.extend({
        attrs: {
            runId: null,
            flowId: null,
            wrapper: 'body'
        },
        initialize: function(config, store) {
            TFieldManager.superclass.initialize.call(this, config);
            this.register = store || [];
            this.instances = {};
            this.initFields();
            this.bindEvent();
        },
        regist: function(cfg){
            this.register.push(cfg);
        },
        factory: function(cfg) {
            var klass = Fields[cfg.type], field;
            if(klass){
                field = new klass(cfg);
            }
            return field;
        },
        initFields: function() {
            var register = this.register,
                instances = this.instances,
                factory = this.factory;
            $.each(register, function(i, cfg){
                var instance = factory(cfg);
                if(instance && instance.get('id')){
                    instances[instance.get('id')] = instance;
                }
            });
        },
        bindEvent: function(){
            
        },
        saveWorkFlow: function(a){
            // 先判断是不是有附件待上传，如果有则先上传附件
            upload_area_a_length = jQuery('[id^="UPLOAD_AREA_"]').find('a').length;
            if(upload_area_a_length != 0 && a != 'upload_file_success'){
                showLoading(fileuploading);
                uploadStart();
                return;
            }
            if(a == 'upload_file_success'){
                hideLoading();
            }
            saveSignWorkFlow();
            savePublicWorkFlow(); // 存公共附件
            var data = $("#edit_from").serialize();
            $.ajax({
                type: 'POST',
                url: 'edit_submit.php',
                cache: false,
                async: false,
                data: data + "&P="+p,
                beforeSend: function(){
                    $.ProLoading.show();       
                },
                success: function(data){
                    $.ProLoading.hide();
                    if(a && a != 'upload_file_success') return;
                    if(control_type == 'turn_all') turn_all(); 
                    $.ajax({
                        type: 'GET',
                	    url: 'sign.php',
                	    cache: false,
                	    data: {'P': p, 'RUN_ID': q_run_id,'FLOW_ID': q_flow_id,'PRCS_ID': q_prcs_id,'FLOW_PRCS': q_flow_prcs, 'OP_FLAG': q_op_flag},
                	    success: function(dataSign)
                        {
                		    $("#CONTENT").val("");
                		    $("#editSignBox").empty().append(dataSign);
                		    $("#editSignBox .read_detail").last().addClass("endline");
                		    showMessage(formsuccess);
                        }
                    });
                },
                error: function(data){
                    $.ProLoading.hide();  
                    showMessage(getfature);
                }
            });
        },
        
        //必填字段保存JS处理机制
        onSubmit: function() {
            var self = this, ret = null;
            $.each(self.instances, function() {
                var field = this;
                if(typeof field.onSubmit == 'function')
                {
                    var status = field && field.onSubmit && field.onSubmit();  
                    ret = ret === false ? false : status;
                }
            });
            return ret;
        }
    });
    exports.TFieldManager = window.TFieldManager = TFieldManager;
});


