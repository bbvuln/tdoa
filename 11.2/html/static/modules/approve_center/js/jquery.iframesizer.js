/**
 * Resizes the height of an iframe when the content changes height
 * @author Daniel Staver IXD AS
 * @param {Object} options Object with options sent to iframeSizer
 * @param {Integer} options.interval Intervallet scriptet skal kjøres med
 */
(function($) {
    $.fn.iframeSizer = function( settings ) {
        var options = $.extend({
            interval: 400
        }, settings );

        var iframe      = $(this),
            oldHeight   = 0,
            oldLocation = '';

        // Function to poll iframe document for a resized calculator
        var checkHeight = function(){
            // IE will trigger an exception if the child document is not loaded
            // and the document.domain variable for that document is not yet set
            try {
                var height = iframe.contents().find('body').height();

                // Height is different, trigger iframeNewHeight event
                if( height > 0 && height != oldHeight ) {
                    oldHeight = height;
                    iframe.trigger( 'iframeNewHeight', [height] );
                }
            } catch(e) {

            }
        }

        // Poll iframe for a new height
        var checkHeightInterval = setInterval( checkHeight, options.interval );

        // Binds iframe to iframeNewHeight event
        iframe.bind( 'iframeNewHeight', function( e, height ) {
            iframe.height( height );
        });
    }
})(jQuery);
