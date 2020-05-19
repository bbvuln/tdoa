define('TComplex', ["ComplexFieldLoder","base"], function(require, exports, module){
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var Fields = require('ComplexFieldLoder');
    var Math = require('math');
    var TComplexManager = Base.extend({
        attrs: {
            runId: null,
            flowId: null,
            wrapper: 'body'
        },
        initialize: function( parentId, layout, store) {
			TComplexManager.superclass.initialize.call(this, parentId, layout, store);
            var self = this;
            this.parentId = parentId;
            this.layout = layout||[];
            this.store = store||[];
            this.register = store||[];
            this.instances = {};
            this.fieldsInstance = {};
            this.initGroups();
            this.bindEvent();
        },

        bindEvent: function(){
        },
        regist: function(cfg){
            this.register.push(cfg);
        },
        factory: function(cfg) {
            var self = this;
            var info = self.getFieldType(cfg);

            if(info.type ==='text') {
                info.type = "CTextField";
            }else if(info.type ==='textarea') {
                info.type = "CTextAreaField";
            }else if(info.type ==='date') {
                info.type = "CDateField";
            }

            if(info.type){
                var klass = Fields[info.type], field;
                cfg.fieldmanager = this;
                if( info.row !== '' && info.col !== '') {
                    cfg.row = info.row;
                    cfg.col = info.col;
                }
                if(klass){
                    field = new klass(cfg);
                }
                return field;
            }
        },
        getFieldType: function (cfg) {
            var self = this;
            var flag = false;
            var col = '';
            var row = '';
            self.layout.forEach(function (item,index) {
                item.forEach(function (ele,n) {
                    if(ele.value === cfg.name){
                        flag =  ele.type;
                        col = ele.col;
                        row = ele.row;
                    }
                })
            })
            return {
                'row':row,
                'col':col,
                'type':flag
            };
        },
        initGroups: function(){
        	var self = this,
        		register = self.register,
                instances = self.instances,
                layout = self.layout,
                $grouplist = $('#'+self.parentId+'');
                $grouplist.html('');
			$.each(register, function (i, group) {
                var instance = new TGroup(self.parentId, group, $grouplist,layout);
				if(instance && instance.get('index')){
                	instances[instance.get('index')+i] = instance;
                }
                // console.log('instances',instances);
            });

            $.each(instances, function (k, v) {
				self.initFields(v);
            });

            $('.formloading').addClass('hide');
        },
        initFields: function(group) {
            var self = this,
        		fields = group.$config.data,
        		groupid = group.$config.id;
        		instances = this.instances,
        		factory = this.factory;
                $.each(fields, function (i, field) {
                    try {
                        field.parentid = groupid;
                        var instance = self.factory(field);
                        if(instance && instance.get('name')){
                    	    self.fieldsInstance[instance.get('parentid')+'-'+instance.get('name')] = instance;
                    	    group.childs[instance.get('name')] = instance;
                        }
                    } catch (error) {
                        console.log(error);
                    }
                });
        },
        onSubmit: function () {
            var self = this, ret = [], ret_status = true;
        	if(self.instances){
        		$.each(self.instances, function(i, group){
                    try {
                        var currArr = [];
                        var currIndex = {};
                        if(group.$config.index === 1) {
                            $.each(group.childs, function(n, v){
                                var currFlag = v.onSubmit();
                                if(v.onSubmit && !v.onSubmit()){

                                    ret_status = false;
                                }
                            })
                        }
                    } catch (error) {
                        console.log(error);
                    }
                })
            };
            return ret_status;
        },
        getSaveData: function (complex) {
            // console.log(12313)
            // var self = this, ret = [], ret_status = true;
        	// if(complex && complex.instances){
        	// 	$.each(complex.instances, function(i, group){
            //         try {
            //             var currArr = [];
            //             var currIndex = {};
            //             if(group.$config.index === 1) {
            //                 $.each(group.childs, function(n, v){
            //                     v.getData && currArr.push(v.getData());
            //                 })
            //                 currIndex[group.parentId] = currArr;
            //                 ret.push(currIndex);
            //             }
            //         } catch (error) {
            //             console.log(error);
            //         }
            //     })
            // };
            // return ret;
        }
    });
    //var instance = new TGroup(i, group, $grouplist);
    var TGroup = Base.extend({
    	initialize: function(parentId, config, $wrapper,layout) {
            TGroup.superclass.initialize.call(this, config);
            this.parentId = parentId;
            this.$wrapper = $wrapper;
            this.$config = config;
            this.$config.id = ''+parentId+'-'+config.index;
            this.layout = layout;
            this.initGroups(this.$config);
            this.childs = {};
        },
        initGroups: function(config){
        	var self = this;
        	var html = self.parseHtml(config);
            this.$wrapper.append(html);
            var wrapperId = '#'+config.id+'';
            self.parseDetail(wrapperId);
        },
        parseDetail:function (wrapperId) {
            var self = this;
            var selfConfig = JSON.parse(JSON.stringify(self.layout));
            selfConfig.forEach(function(item,index,arr){
                item.forEach(function(ele,n){
                    ele.length = item.length
                })
            });
            var configs = {
                'config' : selfConfig
            }
            try {
                jQuery("#f-complex-wrapper-tmpl").tmpl(configs).appendTo(wrapperId);
            } catch (error) {
                console.log(error);
            }
        },
		parseHtml: function(c){
            var self = this;
            var hidestr = "";
		    //若组内所有控件均是hidden,则加allhidden类名
		    if(c.allhidden!=undefined && c.allhidden == true){
		        hidestr+=' allhidden';
		    }
		    if(c.hidden!=undefined && c.hidden == true){
		        hidestr+=' hidden';
		    }
		    if(c.allhidden == true && c.hidden == false){
		        hidestr+=' hidden';
		    }
		    if(c.hidden == true){
		        hidestr+=' hidden';
            }
		 	var html = $('<div class="group-block '+ hidestr +' '+ c.index +'"  data-index='+ c.index+' ><div class="group-title"></div><div id='+self.parentId+'-'+c.index+' class="group-fields"></div></div>');
             return html;
		}
    });


    exports.TComplexManager = window.TComplexManager = TComplexManager;
});
