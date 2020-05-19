$(function (){
	var x=0,width,height,ul=$(".slideshow"),bottom=$(".bottom"),t
	function img_block(){
		bottom.stop();
		ul.stop();
		$(".slideshow li").css("display","none");
		bottom.css({"height":"40px"});
		$("#xz").text(x+1);
        width=parseInt($(".slideshow li:eq("+x+")").css("width"));
		height=parseInt($(".slideshow li:eq("+x+")").css("height"));
		ul.animate({"width":width+"px","height":height+"px"},450,function (){
			$(".slideshow li:eq("+x+")").css("display","block");
			bottom.css("width",width+"px");
			bottom.animate({"height":"40px"});
			$(".left,.right").css({"width":width/2+"px","height":height+"px"})
			});
		};
	function rights(){
		if(x==$(".slideshow li").length-1){x=0;}
		else{x++};
		img_block();
		};
	$(document).ready(function() {
		$("#imgdata").text($(".slideshow li").length);
		img_block();
		
    });
	$(".right").click(function (){rights()});
	$(".left").click(function (){
		if(x==0){x=$(".slideshow li").length-1;}
		else{x--};
		img_block();
		});
	$(".right,.right").hover(function (){clearTimeout(t)});
});