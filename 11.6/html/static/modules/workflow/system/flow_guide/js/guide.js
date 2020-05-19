jQuery(document).ready(function()
{
	//----iframe----宽高的算法
	jQuery(window).resize(function(){
		jQuery('#menu_left').css('height',setTreeHight());
		jQuery('#guide-view-frame').css('height',setTreeHight());
		jQuery('#guide-view-frame').css('width',setWidth());
	});
	jQuery(window).trigger('resize');
	//------宽高的算法结束------
}
)
function GuideView(id,options){
            
    var self = this;        
            
    this.id = id || 'guideContainer';
    
    this.$element = $('#'+this.id);
    
    this.items = [];
    
    this.getOption(options);
    
    if(typeof options.items === 'object'){
        for(var i in options.items){
        
            this.addItem(options.items[i]);
                    
        }
    }
    
}

GuideView.getFunc = function(func){
    
    var funcs = func.split('.'),
    o = window;
    
    for( k in funcs ){
        
        o = o[funcs[k]];
    }
    
    return o;
}

GuideView.prototype.getOption = function(options){
    
    var defaults = {
    
        template: $('#guideTemplate')
    
    };
    
    this.option = $.extend({},defaults,options);
}

GuideView.prototype.addItem = function(item){
            
    this.items.push(item);
}

GuideView.prototype.setItem = function(i, item){
            
    this.items[i] = item;
}

GuideView.prototype.removeItem = function(i){
            
    this.items.splice(i, 1);
}

GuideView.prototype.render = function(items){
    
    var template = this.option.template;
    
    items = items || this.items;
    
    var block = template.tmpl(items),
    
    ul = $("<ul class='guide-block clearfix'></ul>").html(block);
    
    this.$element.html(ul);

    this.initListener(items);
    
    this.bindEvent();
}

GuideView.prototype.bindEvent = function(){

    var listener = this.listener || {};

    this.$element.find('button').bind('click', function(e){

        var id = $(this).attr('id');

        if(typeof listener[id] === 'object'){
        
            var func = GuideView.getFunc( listener[id].funcName );
            
            (typeof func === 'function') && func.apply(this, listener[id].args);

        }
    });

}

GuideView.prototype.initListener = function(items){

    var me = this;

    me.listener = {};
    
    items = items || this.items;
    
    $.each(items, function(i, item){
    
        var m_id = item.id ;
        
        if(item.specBtns){
            $.each(item.specBtns, function(j, btn){
                me.listener[m_id + '_' + btn.id] = {
                    funcName: btn.funcName,
                    args: btn.args
                };
            });
        }
        if(item.commonBtns){
            $.each(item.commonBtns, function(j, btn){
                me.listener[m_id + '_' + btn.id] = {
                    funcName: btn.funcName,
                    args: btn.args
                };
            });
        }
    });
}
 function setTreeHight()
 {
	 var windowsHeight=jQuery(window).outerHeight(true);
	 var bottomHeight=jQuery('.top_info').outerHeight(true);
	 var MainDivHeight=windowsHeight-(bottomHeight+10)
	 return MainDivHeight;
 }
 function setWidth()
 {
	 var windowsWidth=jQuery(window).outerWidth(true); 
	 var leftWidth=jQuery('#bottom_info_left').outerWidth(true);
	 var MainDivWidth=windowsWidth-(leftWidth+9);	 
	 return MainDivWidth;
 }
