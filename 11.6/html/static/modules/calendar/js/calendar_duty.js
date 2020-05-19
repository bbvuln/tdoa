(function($){

    $.fn.calendarPopover = function(opts)
    {
        return this.each(function(){
            $(this).data('calendarPopover', new CalendarPopover( $(this), opts ));
        });
    }
    $.fn.calendarPopover.defaults = {
        title: '',
        container: window,
        content: ''
    };
    var CalendarPopover = function()
    {
        this.init.apply(this, arguments);
    }

    CalendarPopover.prototype.init = function(el, cfg)
    {
        this.$el = el;
        var opts = this.options = $.extend(true, {}, $.fn.calendarPopover.defaults, cfg);
        this.$container = $(opts.container);
        this.$content = this.$el.find('.popover-content');
        opts.content && this.setContent(opts.content)
        this.bindEvent();
    };
    CalendarPopover.prototype.bindEvent = function()
    {
        var self = this,
            $el = this.$el,
            opts = this.options;
        $el.on('click', '[data-cmd]', function()
        {
            var act = this.getAttribute('data-cmd'),
                cb = opts.callbacks || {};
            if( act && cb[act] && cb[act]() == false )
            {
                return false;
            };
            self.hide();
        });
    };
    CalendarPopover.prototype.setCallbacks = function(callbacks)
    {
        this.options.callbacks = callbacks;
    }
    CalendarPopover.prototype.show = function($target)
    {
        var $pop = this.$el,
            $container = this.$container,
            cWidth = $container.width(),
            cHeight = $container.height(),
            tWidth = $target.width(),
            pWidth = $pop.width(),
            pos = $target.offset(),
            arr = ['top','bottom','left','right'],
            dirc = 'left';
 /*
        console && console.dir({
            target: $target[0],
            'pos.left': pos.left,
            tWidth: tWidth,
            pWidth: pWidth,
            cWidth: cWidth,
            left: pos.left + tWidth + pWidth > cWidth - 100,
            right: pos.left + tWidth + pWidth < cWidth - 100,
            h : $pop.height(),
            top: pos.top
        })*/
        if(pos.left + tWidth + pWidth < cWidth)
        {
            $pop.css({
                top: pos.top + ( $target.height() - $pop.height() )/2,
                left: pos.left + tWidth + 5
            })
            dirc = 'right';
        }
        else if((pos.left + tWidth + pWidth > cWidth) && (pos.left > pWidth) )
        {
            $pop.css({
                top:  pos.top + ( $target.height() - $pop.height() )/2 - 5,
                left: pos.left - pWidth - 5
            })
            dirc = 'left';
        }
		 else //if(pos.top < $pop.height())
		{
			$pop.css({
                top:  pos.top + $target.height(),
                left: pos.left + ( tWidth - pWidth )/2
            })
            dirc = 'bottom';
        }
		// else
		// {
		// 	$pop.css({
        //         top:  pos.top - $target.height(),
        //         left: pos.left + ( tWidth - pWidth )/2
        //     })
        //     dirc = 'top';
        // }

        $pop.removeClass(arr.join(' ')).addClass(dirc + ' in show');
    };
    CalendarPopover.prototype.setContent = function(c)
    {
        this.$content.html(c);
    };
    CalendarPopover.prototype.hide = function()
    {
        this.$el.removeClass('in show');
    };
})(jQuery);
