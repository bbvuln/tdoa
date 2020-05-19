/*
**	Anderson Ferminiano
**	contato@andersonferminiano.com -- feel free to contact me for bugs or new implementations.
**	jQuery ScrollPagination
**	28th/March/2011
**	http://andersonferminiano.com/jqueryscrollpagination/
**	You may use this script for free, but keep my credits.
**	Thank you.
*/

(function( $ ){
	 
		 
 $.fn.scrollPagination = function(options) {
  	
		var opts = $.extend($.fn.scrollPagination.defaults, options);  
		var target = opts.scrollTarget;
		if (target == null){
			target = obj; 
	 	}
		opts.scrollTarget = target;
	 
		return this.each(function() {
		  $.fn.scrollPagination.init($(this), opts);
		});

  };
  
  $.fn.stopScrollPagination = function(){
	  return this.each(function() {
	 	$(this).attr('scrollPagination', 'disabled');
	  });
	  
  };
  
  $.fn.scrollPagination.loadContent = function(obj, opts){
	 var target = opts.scrollTarget;
	 var mayLoadContent = $(target).scrollTop()+opts.heightOffset >= $(document).height() - $(target).height();
	 if (mayLoadContent){
		 if (opts.beforeLoad != null){
			opts.beforeLoad(); 
		 }
		/* $(obj).children().attr('rel', 'loaded');
		 $.ajax({
			  type: 'POST',
			  url: opts.contentPage,
			  data: opts.contentData,
			  success: function(data){
				$(obj).append(data); 
				var objectsRendered = $(obj).children('[rel!=loaded]');
				
				if (opts.afterLoad != null){
					opts.afterLoad(objectsRendered);	
				}
			  },
			  dataType: 'html'
		 });*/
		 var c = obj.children().length;
		 var n = c + 3;
		 recursion(n);
/*		 for(var i = c;i < c+3;i++){
			 if(reportsArr[i]===undefined){
				 //$('#loading').fadeOut();
				 $('#nomoreresults').fadeIn();
				 $('#content').stopScrollPagination();
			 }else{
				 var id = "report_"+reportsArr[i]
				 var color=Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase();
				 obj.append($('<div class="content_2" id="'+id+'" style="background-color:#'+color+'"><div class="title"><span><a href="javascript:closeWindow(\''+id+'\')">¹Ø±Õ</a></span></div><div class="container"><iframe src="get.php?rid='+reportsArr[i]+'" style="width:100%;height:260px;scrolling=no;overflow-x:hidden"></iframe></div><div class="touying_x"></div><div class="touying_y"></div></div>'));
			 }
		 }*/
	 }
	 
  };
  
  $.fn.scrollPagination.init = function(obj, opts){
	 var target = opts.scrollTarget;
	 $(obj).attr('scrollPagination', 'enabled');
	
	 $(target).scroll(function(event){
		if ($(obj).attr('scrollPagination') == 'enabled'){
	 		$.fn.scrollPagination.loadContent(obj, opts);		
		}
		else {
			event.stopPropagation();	
		}
	 });
	 
	// $.fn.scrollPagination.loadContent(obj, opts);
	 
 };
	
 $.fn.scrollPagination.defaults = {
      	 'contentPage' : null,
     	 'contentData' : {},
		 'beforeLoad': null,
		 'afterLoad': null	,
		 'scrollTarget': null,
		 'heightOffset': 0		  
 };	
})( jQuery );