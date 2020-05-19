(function($){
    $.fn.preventScroll = function(){
        $(this).each(function(){  
            var _this = this;  
            if(navigator.userAgent.indexOf('Firefox') >= 0){ 
                _this.addEventListener('DOMMouseScroll',function(e){  
                    _this.scrollTop += e.detail > 0 ? 60 : -60;     
                    e.preventDefault();  
                },false);   
            }else{  
                _this.onmousewheel = function(e){     
                    e = e || window.event;     
                    _this.scrollTop += e.wheelDelta > 0 ? -120 : 120;
                    return false;  
                };  
            }  
        })    
    };
})(jQuery);