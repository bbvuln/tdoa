(function( $ ) {
	$.widget( "ui.combobox", {
	    options: {
	        width: 120,
	        selectable: true,
            className:"span3"
	    },
	    
		_create: function() {
			var input,
			    cur_category = null,
				self = this,
				select = this.element.hide(),
				selected = select.children( ":selected" ),
				value = selected.val() ? selected.text() : "",
                isDisabled = jQuery("#isDisabled"),
				wrapper = $( "<span>" )
					.addClass( "ui-combobox" )
					//.width(self.options.width)
					.css({"margin-right":"16px"})
					.insertAfter( select );
                    
            //优化工作委托编辑时流程名称不可选     
            if(isDisabled.length > 0)
            {
                var disabled = true;
            }
            else
            {
                var disabled = false;
            }
            
			input = $( "<input>" )
				.appendTo( wrapper )
				.val( value )
				.width(self.options.width)
				//.addClass(this.options.className)
				.prop("type", "text")
				.attr("id", "flow_name")
                .attr("disabled",disabled)
				.css({
					"text-align":"left", 
					"background-color":"#ffffff",
					"-moz-border-radius":"4px 0 0 4px",
					"-webkit-border-radius":"4px 0 0 4px",
					"border-radius":"4px 0 0 4px"
				})
				.keydown(function(){
					var ul = $(".ui-menu");
		    		var textWidth = input.outerWidth(true);
		    		ul.width(textWidth + 32);
	    			var ul_top = input.offset().top+input.outerHeight(true);
	    			ul.css("top", ul_top);
		    		ul.zIndex(2000);
		    		var a = ul.find("a[class~='selected']");
		    		if(a.length > 0){
		    			var positionTop = a.position().top;
		    			if(positionTop > ul.height()-a.height()){
		    				ul.scrollTop(positionTop-ul.height()+a.height());
		    			}
		    		}
				})
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
							var level = $( this ).attr("level");
							if ( this.value && ( !request.term || matcher.test(text) ) )
								return {
									node : node,
								    category : category,
								    level : level,
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
				var pad = "<span class='tree-blank-span'>&nbsp;</span>";
				pad_str = str_pad("",item.level-1,pad,0);
				if(item.category && item.category !="" && item.category != self.cur_category){
					var li = $("<li class='ui-autocomplete-category'>"+pad_str+"<span class='category-text'>" + item.category + "</span></li>");	        
				    self.cur_category = item.category;
				}else {
					var li = $( "<li></li>" );
				}
				
				if(item.node && item.node == "root"){
					var a = $("<a><span class='root'>" +item.label + "</span></a>" );
				}else {
					var a = $("<a class=''>"+pad_str+pad+"<span class='leaf'>" +item.label + "</span></a>" );
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
			    $( "<button type='button'>" )
			    	.attr( "tabIndex", -1 )
			    	.appendTo( wrapper )
			    	.addClass("btn dropdown-toggle")
                    .attr("disabled",disabled)
			    	.css({
						"margin-left":"-1px",
						"-moz-border-radius":"0 4px 4px 0",
						"-webkit-border-radius":"0 4px 4px 0",
						"border-radius":"0 4px 4px 0",
						"vertical-align":"top"
					})
			    	.append("<span class='caret'></span>")
			    	.click(function() {
			    		// close if already visible
			    		if ( input.autocomplete( "widget" ).is( ":visible" ) ) {
			    			input.autocomplete( "close" );
			    			return false;
			    		}
                
			    		// work around a bug (likely same cause as #5265)
			    		$( this ).blur();
			    		// pass empty string as value to search for, displaying all results		    		
			    		input.autocomplete( "search", "");
			    		//add by ts 2012-06-13
			    		var ul = $(".ui-menu");
			    		var textWidth = input.outerWidth(true);
			    		ul.width(textWidth + 32);
		    			var ul_top = input.offset().top+input.outerHeight(true);
		    			ul.css("top", ul_top);
			    		ul.zIndex(2000);
			    		var a = ul.find("a[class~='selected']");
			    		if(a.length > 0){
			    			var positionTop = a.position().top;
			    			if(positionTop > ul.height()-a.height()){
			    				ul.scrollTop(positionTop-ul.height()+a.height());
			    			}
			    		}
			    		/*
			    		if($.browser.msie){
			    			//var menuWidth = ul.width()+5;
			    			//ul.width(Math.max(textWidth,select.width()+46));
			    			ul.width(textWidth + 32);
			    		}else {
			    			//ul.width(Math.max(textWidth,select.width()+46));
			    			ul.width(textWidth + 32);
			    		}
			    		*/
			    		//if(ul.offset().top === 0){
                           // console.log(input.offset().top);
			    		//}
			    		input.focus();
			    	});
			    }
		},

		destroy: function() {
			try{
				this.wrapper.remove();
				this.element.show();
				$.Widget.prototype.destroy.call( this );
			}catch(e){
				
			}
			
		}
    });
})( jQuery );

function str_pad(str,length,pad,padType)
{
    if(length <= str.length)
    {
        return str;
    }
    switch(padType)
    {
        case 0: //左侧
        var leftLength = length-str.length;
        for(var i=0;i<leftLength;i++)
        {
            str = pad+str;
        }
        break;
    }
    return str;
}