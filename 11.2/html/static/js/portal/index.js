
jQuery.noConflict();
(function($){
    $(document).ready(function($){
        $('#top a.oa_general').click(function(){
            if(from_ispirit)
                window.external.OA_SMS("/general/?ISPIRIT=1", "MAX", "OPEN_URL");
            else
                window.open('/general/?ISPIRIT=1');
        });
        
        $('.portal').click(function(){
            var id = $(this).attr('portal_id');
            var title = $(this).attr('portal_name');
            var url = $(this).attr('portal_link');
            
            if(from_ispirit)
            {
                window.external.OA_SMS(url, "MAX", "OPEN_URL");
            }
            else if(typeof(top.openURL) == 'function')
            {
                if(top.bTabStyle)
                {
                    top.openURL('portal_' + id, title, url);
                }
                else
                {
                    top.openURL(url);
                }
            }
            else
            {
                window.open(url, 'portal_' + id);
            }
        });
    });
})(jQuery);