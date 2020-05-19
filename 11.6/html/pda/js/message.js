if(!+'\v1') {
    (function(f){
        window.setTimeout =f(window.setTimeout);
        window.setInterval =f(window.setInterval);
    })(function(f){
        return function(c,t){
            var a=[].slice.call(arguments,2);
            return f(function(){
                c.apply(this,a)},t)
            }
    });
}

$(document).bind("mobileinit", function(){
	$.mobile.ajaxLinksEnabled = false;
	//$.mobile.ajaxEnabled = false;
  	$.mobile.loadingMessage = td_lang.pda.msg_2;//"加载中"
  	$.mobile.pageLoadErrorMessage = td_lang.pda.msg_2;//"页面加载错误"
});
	

