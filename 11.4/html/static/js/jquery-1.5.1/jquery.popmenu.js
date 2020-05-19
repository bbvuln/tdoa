(function($)
{
    $.fn.popMenu = function(settings)
    {
        var config = { 'delay': 300 };

        if (settings) $.extend(config, settings);
        
        this.each(function()
        {
            $(this)
            .find('ul').parent().bind('mouseover', function() {
                var o = $(this);
                if (o.attr('action')) clearTimeout(o.attr('action'));
                o.attr('action', setTimeout(function() { $(o).find('ul:first').show(); }, config['delay']));
            }).bind('mouseout', function() {
                var o = $(this);
                if (o.attr('action')) clearTimeout(o.attr('action'));
                o.attr('action', setTimeout(function() { $(o).find('ul:first').hide(); }, config['delay']));
            });
        });

        return this;
    };

})(jQuery);