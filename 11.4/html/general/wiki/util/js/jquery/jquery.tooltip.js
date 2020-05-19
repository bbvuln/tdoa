;(function($) {
		$.tooltip =  function(){			
				xOffset = 10;
				yOffset = 20;		
				$("[title!='']").each(function(){
				$(this).hover(function(e){											  
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
		};
})(jQuery);