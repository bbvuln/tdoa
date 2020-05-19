define('TFieldManager', ['TFieldLoader',"base"], function(require, exports, module){    
    var $ = jQuery;
    var Base = require('base');
    var Fields = require('TFieldLoader');
    var TFieldManager = Base.extend({
        attrs: {
            runId: null,
            flowId: null,
            wrapper: 'body',
            dblclickHandle: function(){}
        },
        initialize: function(config, store) {
            TFieldManager.superclass.initialize.call(this, config);
            this.register = store || [];
            this.instances = {};
            this.initFields();
            this.bindEvent();
        },
        
        regist: function(cfg) {
            this.register.push(cfg);
        },
        
        factory: function(cfg) {
            try
            {
                var klass = Fields[cfg.type], field;
                if(klass){
                    field = new klass(cfg);
                }
                return field;
            }
            catch(e)
            {
                return false;
            }
        },
        
        initFields: function() {
            var register = this.register,
                instances = this.instances,
                factory = this.factory
                throwErr = true;
            $.each(register, function(i, cfg){
                var instance = factory(cfg);
                if(instance === false && cfg.type.indexOf('TCUSTOM_') != -1)
                {
                    throwErr = false;
                    return false;
                }
                else if(instance && instance.get('id')){
                    instances[instance.get('id')] = instance;
                }
            });
            if(throwErr === false)
            {
                alert(td_lang.general.workflow.msg_308);
            }
			if(typeof parent.unlockButton != 'undefined')
			{
				parent.unlockButton();
			}
        },
        
        setFields: function(datas) {
            var self = this;
            $.each(datas || [], function(){
                var field = self.instances[this.id];
                if(typeof this.value !== 'undefined'){
                    field && field.setValue && field.setValue(this.value);
                }
                if(typeof this.defaultValue !== 'undefined'){
                    field && field.setDefaultValue && field.setDefaultValue(this.defaultValue);
                }
            });
        },
        
        //扩展控件保存JS处理机制
        /*
        onHandleSubmit: function() {
            var self = this;
            var ret = true;
            $.each(self.instances || [], function(){
                if(typeof this.onHandleSubmit == 'function')
                {
                    ret = this.onHandleSubmit();
                    if(typeof ret !== 'undefined')
                    {
                        ret = false;
                        return false;
                    }
                }
            });
            if(ret === false)
            {
                return false;
            }
        },
        */
        
        //必填字段保存JS处理机制
        onSubmit: function() {
            var self = this, ret = null, topStatus = true;
            $.each(self.instances, function() {
                var field = this;
                if(typeof field.onSubmit == 'function')
                {
                    if(field && field.onSubmit){
                        var status = field && field.onSubmit && field.onSubmit();
                        ret = ret === false ? false : status;
                        //移动到必填字段位置
                        if(topStatus)
                        {
                            topStatus = ( field && field.setOffsetTop && field.setOffsetTop() ) === false ? false : true;
                        }
                    }
                }
            });
            return ret;
        },  
        
        //必填字段保存JS处理机制
        validation: function(datas) {
            var self = this;
            $.each(datas || [], function() {
                var field = self.instances[this.id];
                if(typeof field.validation == 'function')
                {
                    field && field.validation && field.validation(this.desc);
                }
            });
        },
        
        bindEvent: function() {
            var self = this, 
                runId = this.get('runId'), 
                flowId = this.get('flowId'),
                dblclickHandle = this.get('dblclickHandle');
            $(this.get('wrapper'))
                .find('input,textarea')
                .filter(function(){
                    var $this = $(this);                    
                    return !($this.is(':reset,:file,:button,.AUTO,.FETCH,:disabled') || !(this.name ? this.name.match(/DATA_/gi) : false) || this.readOnly || this.readOnly === '' || $this.parents('.LIST_VIEW').size()) 
                })
                .bind('dblclick', function(e){ 
                    dblclickHandle(this, runId, flowId);
                })
                .filter('input:text,textarea')
                .bind('keypress', function(e){ 
                    if(e.which == 10){
                        dblclickHandle(this, runId, flowId);
                    }
                });
            //backspace
            $('body').keydown(function(e){
                var target = e.target,
                    $target = $(target),
                    preventPress = false;
                if( e.which == 8 ){
                    preventPress = $target.is('input,textarea') 
                                    ? ( $target.is(':disabled') || target.readOnly || target.readOnly === '' )
                                    : true;
                    return !preventPress;
                }
            }); 
            
        }
    });
    exports.TFieldManager = window.TFieldManager = TFieldManager;
});


