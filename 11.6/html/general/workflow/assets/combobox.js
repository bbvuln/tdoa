(function( $ ) {
	$.widget( "ui.combobox", {
	    options: {
	        width: 200,
	        selectable: true
	    },
	    
		_create: function() {
			var input,
			    cur_category = null,
				self = this,
				select = this.element.hide(),
				
				selected = select.children( ":selected" ),
				value = selected.val() ? selected.text() : "",
				wrapper = $( "<span>" )
					.addClass( "ui-combobox" )
					.width(self.options.width)
					.insertAfter( select );
			input = $( "<input>" )
				.appendTo( wrapper )
				.val( value )
				.addClass( "SmallInput" )
				.width(self.options.width-40)
				.autocomplete({
					delay: 0,
					width:100,
					minLength: 0,
					source: function( request, response ) {
						var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
						response( select.children( "option" ).map(function() {
							var text = $( this ).text();
							var node = $( this ).attr("node");
							var category = $( this ).attr("category");
							if ( this.value && ( !request.term || matcher.test(text) ) )
								return {
									node : node,
								    category : category,
									label: text.replace(
										new RegExp(
											"(?![^&;]+;)(?!<[^<>]*)(" +
											$.ui.autocomplete.escapeRegex(request.term) +
											")(?![^<>]*>)(?![^&;]+;)", "gi"
										), "<strong>$1</strong>" ),
									value: text,
									option: this
								};
						}) );
					},
					select: function( event, ui ) {
						ui.item.option.selected = true;
						self._trigger( "selected", event, {				
							item: ui.item.option
						});
						if(select.attr("onchange")){
							select.change();
						}
						self.cur_category = "";
					},
					change: function( event, ui ) {
						if ( !ui.item ) {
							var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
								valid = false;
							select.children( "option" ).each(function() {
								if ( $( this ).text().match( matcher ) ) {
									this.selected = valid = true;
									return false;
								}
							});
							if ( !valid ) {
								// remove invalid value, as it didn't match anything
								$( this ).val( "" );
								select.val( "" );
								input.data( "autocomplete" ).term = "";
								return false;
							}
						}
					}
				})

			input.data( "autocomplete" )._renderItem = function( ul, item ) {
			    if(item.category && item.category !="" && item.category != self.cur_category){
			        var li = $("<li class='ui-autocomplete-category'><span class='category-text'>" + item.category + "</span></li>");	        
			        self.cur_category = item.category;
			    }else {
					var li = $( "<li></li>" );
				}
				if(item.node && item.node == "root"){
					var a = $("<a><span class='root'>" +item.label + "</span></a>" );
				}else {
					var lineClass;
					if(select.find("option:last").val() == item.option.value){
					    lineClass = "lineBottom";
					}else {
						lineClass = "lineCenter";
					}
					var a = $("<a class='"+lineClass+"'><span class='leaf'>" +item.label + "</span></a>" );
				}
				if(select.find("option:selected").val() == item.option.value){
				    a.addClass("selected");
				}
				return li.data( "item.autocomplete", item )
					.append(a)
					.appendTo( ul );
			};
            
            if(self.options.selectable)
            {
			    $( "<a>" )
			    	.attr( "tabIndex", -1 )
			    	.appendTo( wrapper )
			    	.addClass( "ui-combobox-dropdown" )
			    	.append("<span></span>")
			    	.click(function() {
			    		// close if already visible
			    		if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
			    			input.autocomplete( "close" );
			    			return;
			    		}
                
			    		// work around a bug (likely same cause as #5265)
			    		$( this ).blur();
                
			    		// pass empty string as value to search for, displaying all results		    		
			    		input.autocomplete( "search", "");
			    		//add by ts 2012-06-13
			    		var ul = $(".ui-menu");
			    		ul.zIndex(10);
			    		var a = ul.find("a[class~='selected']");
			    		if(a.length > 0){
			    			var positionTop = a.position().top;
			    			if(positionTop > ul.height()-a.height()){
			    				ul.scrollTop(positionTop-ul.height()+a.height());
			    			}
			    		}
			    		var textWidth = input.width();
			    		if($.browser.msie){
			    			var menuWidth = ul.width()+5;
			    			ul.width(Math.max(textWidth,menuWidth));
			    		}else {
			    			var menuWidth = ul.width()+20;
			    			ul.width(Math.max(textWidth,menuWidth));
			    		}
			    		input.focus();
			    	});
			    }
		},

		destroy: function() {
			this.wrapper.remove();
			this.element.show();
			$.Widget.prototype.destroy.call( this );
		}
    });
})( jQuery );