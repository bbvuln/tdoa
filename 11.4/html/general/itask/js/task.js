jQuery.noConflict();

(function($){
    function initTab()
    {        
        $('#tabs a').click(function(e) {
            e.preventDefault();
            if ($(this).closest("li").attr("class").substr(-7) == "-active") {
                return;     
            }
            else{             
                $("#tabs li a").each(function(){
                    $(this).removeClass($(this).attr('name') + "-active");
                });
                $(this).addClass($(this).attr('name') + "-active");
                $('#main').attr("src", $(this).attr('name').replace("-","_") + ".php?TASK_ID="+g_task_id);
            }
        });
        var firstTab = $("#tabs li:first a");
        firstTab.trigger("click");        
    }
    $(function() {
        $("#close a").click(function(){
            parent.showFrame(false);
        })
        
        $(window).resize(function(){
        
            var height = $(parent).height() - $('#header', parent.document).height() - $("#tabs").height()-10;
            var width = $(parent).width() - $('#content-left', parent.document).width()-10;
            $("#tab-content").width(width).height(height);    
        });
        $(window).triggerHandler("resize");
        
        initTab();
        
    });
})(jQuery);