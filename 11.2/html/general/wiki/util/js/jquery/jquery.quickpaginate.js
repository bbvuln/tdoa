jQuery.fn.quickpaginate = function( settings ) {

	settings = jQuery.extend({
   
		perpage: 6,
		
		pager : null,
		
		showcounter : true,
		
		prev : "qp_next",

		next : "qp_prev",
		
		pagenumber : "qp_pagenumber",
		
		totalnumber : "qp_totalnumber",
		
		counter : "qp_counter"

	}, settings);

	var cm;
	
	var total;
	
	var last = false;
	
	var first = true;
	
	var items = jQuery(this);
	
	var nextbut;
	
	var prevbut;
	
	var init = function()
	{
		items.show();
		
		total = items.size();
				
		if ( items.size() > settings.perpage )
		{
			items.filter(":gt("+(settings.perpage-1)+")").hide();
			
			cm = settings.perpage;
			
			setNav();
		}
	};
	
	var goNext = function()
	{
		if ( !last )
		{
			var nm = cm + settings.perpage;
			items.hide();
			
			items.slice( cm, nm ).show();
			cm = nm;
			
			if ( cm >= total  )
			{
				last = true;
				nextbut.addClass("qp_disabled");
			}
			
			if ( settings.showcounter ) settings.pager.find("."+settings.pagenumber).text(cm/settings.perpage);
			
			prevbut.removeClass("qp_disabled");
			first = false;
		}
	};
	
	var goPrev = function()
	{
		if ( !first )
		{
			var nm = cm-settings.perpage;
			items.hide();
			
			items.slice( (nm - settings.perpage), nm ).show();
			cm = nm;
			
			if ( cm == settings.perpage  )
			{
				first = true;
				prevbut.addClass("qp_disabled");
			}
			
			if ( settings.showcounter ) settings.pager.find("."+settings.pagenumber).text(cm/settings.perpage);
			
			nextbut.removeClass("qp_disabled");
			last = false;
		}
	};
	
	var setNav = function()
	{
		if ( settings.pager === null )
		{	
			settings.pager = jQuery('<div class="qc_pager"></div>');
			items.eq( items.size() -1 ).after(settings.pager);
		}
		
		var pagerNav = $('<a class="'+settings.prev+'" href="javascript:;">&laquo; '+td_lang.global.page_up+'</a><a class="'+settings.next+'" href="javascript:;">'+td_lang.global.page_down+' &raquo;</a>');
		
		jQuery(settings.pager).append( pagerNav );
		
		if ( settings.showcounter )
		{
			var counter = '&nbsp;&nbsp;&nbsp;&nbsp;<span class="'+settings.counter+'"><span class="'+settings.pagenumber+'"></span> / <span class="'+settings.totalnumber+'"></span></span>&nbsp;&nbsp;&nbsp;&nbsp;';
			
			settings.pager.find("."+settings.prev).after( counter );
			
			settings.pager.find("."+settings.pagenumber).text( 1 );
			settings.pager.find("."+settings.totalnumber).text( Math.ceil(total / settings.perpage) );
		}

		nextbut = settings.pager.find("."+settings.next);
			
		prevbut = settings.pager.find("."+settings.prev);
		
		prevbut.addClass("qp_disabled");
		
		nextbut.click(function(){
			goNext();
			return false;
		});
		
		prevbut.click(function(){
			goPrev();
			return false;
		});
		
	};
	
	init(); // run the function
};
