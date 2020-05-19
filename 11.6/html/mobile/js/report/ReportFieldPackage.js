/*
 *  ReportManager
 *  by jx @2014-12-24
 *
 */

define('ReportFieldManager', ["ReportFieldLoder", "base"], function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var Fields = require('ReportFieldLoder');
    var getFieldClass = function (c) {
        var Field2ClassMap = {
            input: 'RRichtextField',
            user: 'RUserField',
            data: 'RDateField',
            select: 'RSelectField'
        };
        return Fields[c];
    };

    var ReportFieldManager = Base.extend({
        attrs: {
            rid: null,
            op: '',
            tableid:'',
            did:'',
            mobilestyle:'',
            workflow:'',
            P:'',
            from:'',
            writetime:'',
            wrapper: 'body'
        },
        initialize: function (config, store) {
            ReportFieldManager.superclass.initialize.call(this, config);
            this.$wrapper = $(this.get('wrapper'));
            this.register = store || [];
            this.instances = {};
            this.lists = [];
            this.initMainBlocks(store.main);
            this.initDetailBlocks(store.detail);
            this.initInfoBlocks(store.basic);
            this.bindEvent();
        },
        regist: function (cfg) {
            this.register.push(cfg);
        },
        factory: function (cfg, $wrapper) {
            var klass = getFieldClass(cfg.fieldtype),
                field;
            if (klass) {
                // cfg.editable = 1;
                field = new klass(cfg, $wrapper);
            }
            return field;
        },
        initMainBlocks: function (blocks){
            var self = this;
            $.each(blocks, function (i, block) {
                var $block = self.parseBlock(block);
                self.initFields(block.item, $block);
            });
        },
        initDetailBlocks: function (blocks){
            if(!blocks){
                return;
            }
            var self = this;
            $.each(blocks, function (i, block) {
                self.initListManager(block, self.$wrapper);
            });
        },
        initInfoBlocks: function (block){
            if(!block){
                return;
            }
            var self = this,
                $block = self.parseBlock(block);
            self.initFields(block.item, $block);
        },
        initListManager: function(cfg, $wrapper){
            if(!cfg){
                return;
            }
            this.lists.push(
                new ReportListFieldManager({ 
                    wrapper: $wrapper
                }, cfg)
            );
        },
        initFields: function (fields, $block) {
            var self = this,
                register = this.register,
                instances = this.instances;
            $.each(fields, function (i, cfg) {
                var instance = self.factory(this, $block);
                if (instance && instance.get('id')) {
                    instances[instance.get('id')] = instance;
                }
            });
        },
        bindEvent: function () {
            var self = this,
                runId = this.get('runId'),
                flowId = this.get('flowId');
			this.$wrapper.delegate('.report-block-header span', 'tap', function(){
				var str = $(this).text();
				$('#layer-wrapper').addClass('active').find('.layer-content').html(str);
			});
			$('#layer-wrapper').on('tap', function(e){
				e.stopPropagation();
				$(this).removeClass('active').find('.layer-content').html('');
			});
        },
        parseBlock: function(d){
            var tmpl = '\
<div class="reportBlock report-block-header clearfix">\
  <h3><span><%=title%></span></h3>\
</div>\
';
            var $block = $($.parseTpl(tmpl, d));
            this.$wrapper.append( $block );

            return $block;
        },
        createId: (function (i) {
            return function () {
                return i++;
            }
        })(0),
        save: function () {
            return this.$el.serializeArray();
        },
        appendFieldElement: function (el) {
            $(this.get('wrapper')).append(el);
        },
        destroy: function(){
            this.$el.remove();
        },
        updateFields: function(){
            
        },
        updateDataFromFields: function(){
            $.each(this.instances, function(i, field){
                field.updateDataFromField && field.updateDataFromField();
            });
        },
        serializeArray: function(){
            var self = this, ret = [], list = {};
            $.each(['rid', 'op','tableid','did','workflow','P','from','writetime'], function(i, v){
            	 ret.push({ name: v, value: self.get(v) });
            });
            
            $.each(this.instances, function(i, field){
                field.getData && ret.push(field.getData());
            });
            
            $.each(this.lists || [], function(i, l){
                list[l.getId()] = (l.serializeArray());
            });
           // console.log(list);
            ret.push({ name:'list', value: JSON.stringify(list)  });
            
            return ret;
        }
    });
    
    var ReportListFieldManager = ReportFieldManager.extend({
        attrs: {
            wrapper: 'body'
        },
        initialize: function (config, store) {
            ReportFieldManager.superclass.initialize.call(this, config);
            this.$wrapper = $(this.get('wrapper'));
            this.register = store || [];
            this.instances = {};
            this.$el = this.parseBlock(store);
            this.initFields(store.item, this.$el);
            (store.op == 'do') && this.buildCreateHelper();
            this.bindEvent();
        },
        getId: function(){
            return this.register.id;	
        },
        bindEvent: function(){
            var self = this;
            this.$el.on('tap click', '.report-create-helper, .report-list-icon-create', function(){
                self.createItem();
                
            });
        },
        initFields: function (fields, $block) {
            var self = this,
                register = this.register,
                instances = this.instances;
            $.each(fields, function (i, cfg) {
                var instance = self.factory(this, $block);
                if (instance && instance.get('id')) {
                    instances[instance.get('id')] = instance;
                }
                instance.on('click', $.proxy(self.itemClickHandle, self) );
            });
        },
        factory: function (cfg, $block) {
            var klass = getFieldClass('RListField'),
                field;
            if (klass) {
                field = new klass(cfg, $block);
            }
            return field;
        },
        parseBlock: function(d){
            var tmpl = '\
<div class="reportBlock report-block-header clearfix">\
  <h3><%=title%></h3>\
  <div class="report-block-header-op">'
    +(d.op == '1' ? '<a class="report-list-icon-create" href="javascript:void(0);"></a>' : '')+        
'<a class="report-list-icon-tableview" href="<%=obj.url%>"></a>\
</div></div>\
';
            var $block = $($.parseTpl(tmpl, d));
            this.$wrapper.append( $block );

            return $block;
        },
        buildCreateHelper: function(){
            this.$el.append('<div class="read_detail clearfix report-create-helper"><em>点击新建</em></div>');  
        },
        createItem: function(){
            var id = (new Date).getTime();
            var schema = {
                id: id,
                index: 'new',
                title: ( this.register.title ?  this.register.title + ' - ' : this.register.title ) + '新建',
                item: []
            };
            schema.item = $.extend(true, [], this.register.schema);

            this.initFields([schema], this.$el);
            
            this.itemClickHandle(this.instances[id], {
                close: function(){
                    this.$el.remove();
                    this.destroy();
                },
                save: function(){
                    this.state = 'add';
                }
            });
        },
        itemClickHandle: function(item, callbacks){
            //console.log(this, $item);
            var $panel = $('<div>').attr({
                'id': 'page-list-detail',
                'class': 'page'
            }).appendTo('body');
            var $inner = $('<div>').appendTo($panel);
            var $btnwrapper = $("<div style='text-align: center;margin-top:15px;'>").appendTo($panel);
            var $close = $('<button>').text('关闭').addClass("reportclose").appendTo($btnwrapper);
            var $save = $('<button>').text('保存').addClass("reportbtn").appendTo($btnwrapper);
            $panel.append('<div class="holder-40"></div>');
            $panel.append('<div class="layer-wrapper" id="layer-wrapper"><div class="layer-content"></div></div>');
            $('.page').removeClass('in');
            $close.click(function(){ 
                $panel.remove(); 
                $('#page1').addClass('in'); 
                callbacks && callbacks.close && callbacks.close.call(item);
            });
            $save.click(function(){
                l.updateDataFromFields();
                item.render();
                $panel.remove(); 
                $('#page1').addClass('in'); 
                callbacks && callbacks.save && callbacks.save.call(item);
            });
            
            l = new ReportFieldManager({
                wrapper: $inner
            }, {
                main: [item.cfg]
            });
            setTimeout(function(){

                $panel.addClass('in');
            }, 1)
        },
        serializeArray: function(){
            var ret = [];
            
            $.each(this.instances, function(i, field){
                var data = field.getData() 
                data && ret.push(field.getData());
            });
            
            return ret;
        }

    });
    
    exports.ReportFieldManager = window.ReportFieldManager = ReportFieldManager;
});

define('ReportFieldLoder', ["RTextField","RAttachField","RImageField", "RUserField", "RDateField", "RSelectField", "RRichtextField","RDeptField","RListField"], function (require, exports, module) {
    var depends = module.dependencies;
    for (var i in depends) {
        var mod = require(depends[i]);
        exports[depends[i]] = mod ? mod[depends[i]] : null;
    }
});

define('RTextField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var Base = require('base');
    var RTextField = Base.extend({
        attrs: {
            id: null
        },
        initialize: function (cfg, $wrapper) {
            RTextField.superclass.initialize.call(this, cfg);
            this.cfg = cfg;
            this.$el = $(this.parseTpl(cfg));
            this.$field = this.getField();
            this.$wrapper = $wrapper;
            this.appendFieldElement(this.$el);
            this.bindEvent();
            this.initialized();
        },
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<input value="<%=colvalue%>" name="<%=id%>" type="text" />'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        appendFieldElement: function(el){
            this.$wrapper.append(el);
        },
        getField: function(){ return this.$el.find('input') },
        getValue: function(){ return this.getField().val() },
        updateDataFromField: function(){
            var oldvalue = this.cfg.colvalue;
            this.cfg.colvalue = this.getField().val();
            this.cfg.isChanged = !(oldvalue == this.cfg.colvalue);
        },
        getData: function(){
            var ret = {};
            if(this.cfg.editable){
                ret.name = this.cfg.id;
                ret.value = this.getValue();
                ret.displaystyle = this.cfg.displaystyle;   
            }
            return ret;
        },
        initialized: function(){
            this.cfg.editable == "1" && this.$el.addClass('field-editable');
        },
        bindEvent: function(){}

    });
    exports.RTextField = window.RTextField = RTextField;
});

define('RAttachField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var time=new Date().getTime();
    var mobilestyle=$("#mobilestyle").val();
    var RAttachField = RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<span id="file'+time+'"></span><button type="button" action="addfile">上传附件</button><input value="<%=colvalue%>" name="<%=id%>" id="filevalue'+time+'" type="hidden" />'
    : '<span><%=colvalue%></span><input value="<%=filename%>" name="<%=id%>" type="hidden" /> ') +
  '</div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        bindEvent: function(){
	        	this.$el.delegate('button[action="addfile"]','click', function(){
	        		if(mobilestyle==1)
	        		{
						document.location ="addfile:"+time+":other";
					}
					else
					{
						window.Android.selectfile('addfile',time,'other');
					}
				});
        }

    });
      exports.RAttachField = window.RAttachField = RAttachField;
   
});
define('RImageField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var mobilestyle=$("#mobilestyle").val();
    var RImageField= RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<span> <img id="<%=id%>" class="uploadimg" src="<%=src%>"></span><button type="button" action="addimg">上传图片</button><input value="<%=colvalue%>" name="<%=id%>" id="<%=id%>value" type="hidden" />'
    : '<span id="<%=id%>"><%=colvalue%></span><div><img src="<%=src%>"></div><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        bindEvent: function(){
            var self = this;
	        	this.$el.delegate('button[action="addimg"]','click', function(){
	        		if(mobilestyle==1)
	        		{
					   document.location ="addimg:"+self.cfg.id+":other";
					}
					else
					{
						window.Android.selectimg('addimg',self.cfg.id,'other');
					}
				});
        }

    });
      exports.RImageField = window.RImageField = RImageField;
   
});
define('RUserField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var mobilestyle=$("#mobilestyle").val();
    var RUserField = RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field">\
    <span id="<%=id%>"><%=colvalue%></span><input value="<%=value%>" name="<%=id%>" type="hidden" id="<%=id%>value"/>\
    ' + (cfg.editable == 1 ?
      '<span ></span><button type="button" action="selectuser" >选择</button>'
    : '') +
  '</div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        getValue: function(){
            return this.$el.find('input[type="hidden"]').val()
        },
        bindEvent: function(){
            var self = this;
            this.$el.delegate('button[action="selectuser"]','click', function(){	
            	 if(mobilestyle==1){
            		//document.location ="selectuser:"+time;
            		document.location ="selectuser:" + self.cfg.id;
                }else{
                      //console.log(self.cfg.id);
               	    window.Android.selectAddress('selectuser',self.cfg.id);
                }
            });
        }

    });
  
     exports.RUserField = window.RUserField = RUserField;
});

define('RDateField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RDateField = RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field">\
    ' + (cfg.editable == 1 ?
      '<input value="<%=colvalue%>" name="<%=id%>" type="text" />'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        initialized: function(){
            if(this.cfg.editable){
                var $input = this.getField();
                $input
                .mobiscroll()
                .date({
                    theme: 'ios7',
                    display: 'bottom',
                    lang: 'zh',
                    mode: 'scroller',
                    dateOrder: 'ddMMyy',
                    dateFormat: this.cfg.displaystyle
                })
                //.setDate(this.cfg.colvalue);    
                this.cfg.editable == "1" && this.$el.addClass('field-editable');
            }
        }

    });
    exports.RDateField = window.RDateField = RDateField;
});
define('RSelectField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RSelectField = RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field">\
  ' + (cfg.editable == 1 ?
      '<div class="select_arrow"><select value="<%=colvalue%>" name="<%=id%>" title="<%=colname%>"></select><span class="caret"></span></div>'
    : '<span><%=colvalue%></span><input value="<%=colvalue%>" name="<%=id%>" type="hidden" />') +
  '</div>\
</div>\
';

            return $.parseTpl(tmpl, cfg)
        },
        renderOption: function (cfg) {
            var code_select_value = cfg.code_select_value,
                opData = code_select_value ? code_select_value.split('|') : [],
                html = [];
            $.each(opData, function () {
                if (this == '') {
                    return
                }
                var selected = this == cfg.colvalue ? ' selected ' : '';
                html.push('<option value="' + this + '" ' + selected + '>' + this + '</option>');
            });
            this.$field.append(html.join(''));
        }, 
        getField: function(){ 
            return this.$el.find('select') 
        },
        initialized: function(){
            this.renderOption(this.cfg);
            this.cfg.editable == "1" && this.$el.addClass('field-editable');
        }

    });
    exports.RSelectField = window.RSelectField = RSelectField;
});

define('RRichtextField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RRichtextField = RTextField.extend({
        parseTpl: function (cfg) {
            cfg._colvlaue = cfg.colvalue;
            if(cfg.editable != "1"){
                cfg.colvalue = cfg.colvalue.replace(/\r\n/ig, "<br>");
            }
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field" style="height:auto;">\
    <div class="clearfix"></div>\
    '+ (cfg.editable ? '<textarea name="<%=id%>" ><%=colvalue%></textarea>' : '<div><%=colvalue%></div>') + '\
  </div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        getField: function(){ return this.$el.find('textarea') }

    });
    exports.RRichtextField = window.RRichtextField = RRichtextField;
});

define('RDeptField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var mobilestyle=$("#mobilestyle").val();
    var RDeptField = RTextField.extend({
        parseTpl: function (cfg) {
            var tmpl = '\
<div class="read_detail clearfix tag-<%=fieldtype%>">\
  <em><%=colname%>:</em>\
  <div class="field">\
      <span id="<%=id%>"><%=colvalue%></span><input value="<%=value%>" name="<%=id%>" type="hidden"  id="<%=id%>value"/>\
  ' + (cfg.editable == 1 ? '<span></span><button type="button" action="selectdept">选择</button>' : '' ) +
  '</div>\
</div>\
';
            return $.parseTpl(tmpl, cfg)
        },
        getValue: function(){
            return this.$el.find('input[type="hidden"]').val()
        },
        bindEvent: function(){
            var self = this;
            this.$el.delegate('button[action="selectdept"]','click', function(){    
                if(mobilestyle==1){
                    document.location ="selectdept:"+self.cfg.id;
                }else{
                    window.Android.selectDept('selectdept',self.cfg.id);
                }
            });
        }
    });
    exports.RDeptField = window.RDeptField = RDeptField;
});

define('RListField', function (require, exports, module) {
    var $ = window.jQuery || window.Zepto;
    var RTextField = require('RTextField').RTextField;
    var RListField = RTextField.extend({
        attrs: {
            id: null
        },
        initialize: function (cfg, $wrapper) {
            RTextField.superclass.initialize.call(this, cfg);
            var self = this;
            this.cfg = cfg;
            this.$el = $(this.parseTpl(cfg));
            this.$wrapper = $wrapper;
            this.appendFieldElement(this.$el);
            this.$el.on('click tap', function(){
                self.trigger('click', self); 
            });
        },
        parseTpl: function (cfg) {
            var id = this.get('id');
            var tmpl = (function(){
                var fields = [];
                $.each(cfg.item, function(i, v){
                    if(i == 0){
                        fields.push('<h6 class="clearfix"><b class="no">'+(cfg.index)+'</b><em>' + v.colname + ': ' + emptyHelper(v.colvalue) + '</em></h6>');
                    }else{
                        fields.push('<em>' + v.colname + ': ' + emptyHelper(v.colvalue) + '</em>');
                    }
                });
                
                return '<div class="read_detail clearfix tag-RListField">'+ fields.join('\n\r') +'</div>';
            })();
            return $.parseTpl(tmpl, cfg)
        },
        render: function(){
            this.$el.html( $(this.parseTpl(this.cfg)).html() );
        },
        appendFieldElement: function(el){
            this.$wrapper.append(el);
        },
        getData: function(){
            var ret = [];
            $.each(this.cfg.item, function(){
                this.isChanged && ret.push({
                    name: this.id,
                    value: this.colvalue
                })
            });
            
            return ret.length == 0 ? null : {
                id: this.cfg.id,
                state: this.state == 'add' ? 'add' : 'update', 
                item: ret
            };
        }

    });
    function emptyHelper(c){
        return c == '' ? ' - ' : c;
    }
    
    
    exports.RListField = window.RListField = RListField;
});


