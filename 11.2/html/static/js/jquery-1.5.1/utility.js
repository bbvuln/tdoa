(function($){
	$.extend({
		showTip : function(content){
			var obj = $(content);
			obj.appendTo("body");
			var myleft=($("body").width()-obj.width())/2+$("body").attr("scrollLeft");
	  		var mytop=($("body").height()-obj.height())/3+$("body").attr("scrollTop");
			obj.css("left",myleft).css("top",mytop).fadeIn("slow");
			window.setTimeout(function(){obj.fadeOut(1000);},1000);
			window.setTimeout(function(){obj.remove();},2000);
		},
	
		tooltip : function(){			
			xOffset = 10;
			yOffset = 20;		
			$("[title!='']").each(function(){
				$(this).hover(
				function(e){											  
					this.t = this.title;
					this.title = "";									  
					$("body").append("<div id='tooltip'>"+ this.t +"</div>");
					$("#tooltip")
						.css("top",(e.pageY - xOffset) + "px")
						.css("left",(e.pageX + yOffset) + "px")
						.fadeIn("fast");		
	    			},
				function(){
					this.title = this.t;		
					$("#tooltip").remove();
	    		});	
				$(this).mousemove(function(e){
					$("#tooltip")
						.css("top",(e.pageY - xOffset) + "px")
						.css("left",(e.pageX + yOffset) + "px");
				});
	 		});			
		},
	
		tooltipForm : function(){			
			xOffset = 10;
			yOffset = 20;
			$("[name^='DATA_']").each(function(){
		  		//初始化title信息	
				$(this).hover(
				function(e){			
					var $tooltip = $('#tooltip'), title, targetCache;
					
					if($tooltip.length) {																				//修复ie下点击select时，title丢失的问题 by JinXin @ 2012-5-15
						targetCache = $tooltip.data('tooltip-cache');
						title = targetCache.target.title = targetCache.title;
					} 
					targetCache = {
						target : this,
						title : title = this.title
					};	
					this.title = "";
					
					!$tooltip.length && $("body").append("<p id='tooltip'></p>");
					$("#tooltip")
						.data('tooltip-cache',targetCache)
						.html( td_lang.inc.msg_52 + title + "&nbsp;&nbsp;" + td_lang.inc.msg_53 + this.name.substr(5) )
						.css("top",(e.pageY - xOffset) + "px")
						.css("left",(e.pageX + yOffset) + "px")
						.fadeIn("fast");		
	    		},
				function(){
					var targetCache = $("#tooltip").data("tooltip-cache");
					if(targetCache&&targetCache.target){
						targetCache.target == this && (this.title = targetCache.title);
					}
					$("#tooltip").remove();
	    		});
	  			$(this).mousemove(function(e){
					$("#tooltip")
						.css("top",(e.pageY - xOffset) + "px")
						.css("left",(e.pageX + yOffset) + "px");
				});		
	  		});		
		}
	});	
})(jQuery);