/***
 * version:backTop.1.0.js
 * by   zfc
***/
$(function() {
	$.fn.TOP = function(options) {
		var defaults = {			
			showHeight : 150,
			speed : 500,
			animate : false
		};
		
		
		var options = $.extend(defaults,options);
		$("body").prepend("<div id='totop'><a></a></div>");
		var $toTop = $(this);
		var $top = $("#totop");
		var $ta = $("#totop a");
		$toTop.scroll(function(){
			var scrolltop=$(this).scrollTop();		
			if(scrolltop>=options.showHeight){				
				$top.fadeIn(options.speed);
			}
			else{
				$top.fadeOut(options.speed);
			}
		});	
		$ta.hover(function(){ 		
			$(this).addClass("cur");	
		},function(){			
			$(this).removeClass("cur");		
		});	
		$top.click(function(){
			if(options.animate){
				$("body").append("<div id='toTOP' style='color:"+options.color+"'>I am change!</div>");
			
				var x = $("html").css("overflow-x");
				var y = $("html").css("overflow-y");
				
				$("html").css({"overflow-x":"hidden","overflow-y":"hidden"});
				$toTop.animate({scrollTop: 0,marginLeft:"100%"}, options.speed);
				$("#toTOP").animate({left:"50%"}, options.speed+100,function(){
					$(this).animate({left:"-100%"}, options.speed+100);
				});
				$toTop.animate({marginLeft:"0%"}, options.speed,function(){
					$("html").css({"overflow-x":x,"overflow-y":y});
					$("#toTOP").remove();
				});
			
			}else{
				$toTop.animate({scrollTop: 0}, options.speed);
				
			}
			
		});
	}
});
