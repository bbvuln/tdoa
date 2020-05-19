define('tDesktop/tDesktop.Theme',function(require, exports, module){
    var $ = window.jQuery;
    var Theme = {
        init: function(){
            this.bindEvent();
        },
        bindEvent: function(){
            var self = this;
            
            $("#theme").click(function(){
            	if(theme_select_priv == 0){
            		alert(theme_select_tip);
            		return;
            	}
                $('#theme').toggleClass('on');
                if($("#theme_panel:visible").length){
                    $("#theme_panel").slideUp();
                    $('#overlay_theme').hide();
                    return;
                }
                if($('#theme_slider').text() == "")
                {
                    //create theme Image
                    for(var id in themeArray)
                    {
                        if(themeArray[id].src=="") return; 
                        var aobj =   $('<a class="theme_thumb" hidefocus="hidefocus"><img src="'+themeArray[id].src+'" /><span>' + themeArray[id].title + '</span></a>');
                        aobj.attr("index",id);
                        $('#theme_slider').append(aobj);
                    }
                    //select current theme
                    $('#theme_slider a.theme_thumb').each(function(){
                        var index = $(this).attr("index");
                        if(ostheme == index){
                            $(this).find("span").addClass("focus");
                        }
                    });
                    //toggle theme
                    $("#theme_slider").delegate('a.theme_thumb', 'click', function(){
                        var index = $(this).attr("index");
                        if(ostheme == index){return;}
                        self.setTheme(index);
                        $('#theme_slider a.theme_thumb span').removeClass("focus");
                        $(this).find("span").addClass("focus");
                    });
                }
                //panel position
                $('.over-mask-layer').hide();
                $('#overlay_theme').show();
                $('#theme_panel').slideDown();
            });
            $('#overlay_theme').click(function(){
                $('#theme').trigger('click');
            });
        },
        setTheme: function(themeid){
            var flag = false;
            $.ajax({
                async: false,
                data: {"themeid": themeid},
                url: '/general/person_info/theme/switch.php',
                success: function(r) {
                    if (r == "+ok") {
                        flag = true;  
                        window.location.reload();
                    }
                }
            });
            return flag;
            //edit theme edit session and reload this
        }
    };
    exports.Theme = Theme;
});