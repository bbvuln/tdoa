define('TTextCtrl', function(require, exports, module){
    var $ = jQuery;
    var Base = require('base');
    var TTextCtrl = Base.extend({
        initialize: function(config) {
            TTextCtrl.superclass.initialize.call(this, config);
            this.$obj = $('input[name="'+config.id+'"]').eq(0);
            this.$config = config;
            this.id = config.id;
            this.low_id = config.id.toLowerCase();
            this.required = config.required;
            this.desc = config.desc;
        },

        onSubmit: function() {
            var obj_val = this.$obj.val()
            var required_val = this.required;
            var low_id = this.low_id;
            if((obj_val == '' || typeof obj_val == 'undefined') && required_val)
            {
                this.validation(this.desc);
                setTimeout(function(){
                    jQuery("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
                return false;
            }
            else
            {
                var ret = this.checkType();
                return ret;
            }
        },
        
        checkType: function() {
            var obj_val = this.$obj.val();
            var check_flag = true;
            var err_msg = '';
            var validation = this.$obj.attr('validation');
            var low_id = this.low_id;
            if(validation)
            {
                var arr = validation.split(";");
                if(arr.length == 1) //只设置了最小长度
                {
                    // var type_arr = arr[0].split(":");
                    var len_arr = arr[0].split(":");
                    // var type = type_arr[1];
                    var len = len_arr[1]; 
                }
                else if(arr.length == 2)
                {
                    if(arr[1] == "" || arr[1] == undefined) //只设置了类型
                    {
                        var type_arr = arr[0].split(":");
                        var type = type_arr[1];
                    }
                    else    //设置了最小长度和类型
                    {
                        var type_arr = arr[0].split(":");
                        var len_arr = arr[1].split(":");
                        var type = type_arr[1];
                        var len = len_arr[1];
                    }
                }
                
                //判断数据类型
                switch(type)
                {
                    case "email":
                        var emailExp = new RegExp("[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\\.[a-zA-Z]{2,4}");
                        if(!obj_val.match(emailExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,形如example@126.com ";//" 格式不符,形如example@126.com"
                        }
                        break;
                    case "int":
                        var intExp = new RegExp("^[0-9]+$");
                        if(!obj_val.match(intExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,应为整数 ";//" 格式不符,应为整数"
                        }
                        break; 
                    case "date":
                        var dateExp = new RegExp("^\\d{4}[\\/-]\\d{1,2}[\\/-]\\d{1,2}$");
                        if(!obj_val.match(dateExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,应为日期类型 ";//" 格式不符,应为日期类型"
                        }
                        break;
                    case "float":
                        var floatExp = new RegExp("^(-?\\d+)(\\.\\d+)?$");   
                        if(!obj_val.match(floatExp) && obj_val != "")
                        {
                            check_flag = false;
                            err_msg += "格式不符,应为浮点数如123.45 ";//" 格式不符,应为浮点数如123.45"
                        }
                        break;               
                    default:
                        break;
                }
                
                //判断数据长度
                if(len!="" && obj_val.length < len)
                {
                    check_flag = false;
                    var msg1 = sprintf("内容长度不应小于%s", len);
                    err_msg += msg1;
                }
            }
            
            if(check_flag === false)
            {
                this.validation(err_msg);
                setTimeout(function(){
                    jQuery("#div_alert_"+low_id+"").removeClass("div_alert_show");
                }, 5000);
            }
            return check_flag;
        },

        validation: function(desc){
            jQuery("#div_alert_"+this.low_id+"").html(desc);
            jQuery("#div_alert_"+this.low_id+"").addClass("div_alert_show");
        }
    });
    exports.TTextCtrl = window.TTextCtrl = TTextCtrl;
});