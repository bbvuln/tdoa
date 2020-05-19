;(function($, win){
 
    $.fn.attachmenu = function(){
        this.each(function(){        
            this.onmouseover = null;
            this.removeAttribute('onmouseover');
            var $this = $(this),
            $menu = $('#' + this.id + '_menu');
            $menu.css({ 
                display: 'block',
                visiblity: 'hidden'
            });            
            var menuHeihgt = $menu.height();
            $menu.css({ 
                display: 'none',
                visiblity: 'visible'
            });
            
            $this           
            .mouseover(function(e){
                var $this = $(this),
                pos = $this.position(),
                winHeight = $(window).height();
                
                if(menuHeihgt + e.clientY <= winHeight){      
                    pos.top += 20;   
                }else{                
                    pos.top -= menuHeihgt;             
                }
                $menu.css({
                    top: pos.top,
                    left: pos.left,
                    display: 'block'
                });
            }).mouseleave(function(){
                var timer = setTimeout(function(){
                    $menu.hide();
                },200);
                $menu.data('attachMenuTimer', timer);
            });
            $menu.mouseleave(function(){
                this.style.display = 'none';
            }).mouseenter(function(){
                var timer = $(this).data('attachMenuTimer');
                timer && clearTimeout(timer);
            });
        });
    };
    
    $.attachmenu = function(){
        $('span[id^=attach][onmouseover]').attachmenu();
    };
    
    $(function(){
        $.attachmenu();
    });
    
})(jQuery, window);