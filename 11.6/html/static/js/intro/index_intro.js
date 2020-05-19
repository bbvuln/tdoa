function show_intro()
{
    jQuery("#start_menu").trigger('click');
    document.getElementById("show_intro_back").style.display="block";
    document.getElementById("show_intro_content").style.display="block";
}
function hide_intro_guide()
{
    document.getElementById("show_intro_back").style.display="none";
    document.getElementById("show_intro_content").style.display="none";
}
function hide_intro_guide_forever()
{
    //cook = parseInt(cook) + 3;
    //document.cookie = "LOGIN_FIRST="+ escape (cook) + ";expires=" + cook_time.toGMTString()+";path=/";
    
    document.getElementById("show_intro_back").style.display="none";
    document.getElementById("show_intro_content").style.display="none";
    
    jQuery.ajax({
        type: 'get',
        url:'/inc/utility_intro.php',
        data: "change_val=3"
    });
}

function show_guide()
{
    document.getElementById("show_guide_content").style.display="block";
    document.getElementById("show_guide_back").style.display="block";
}

function hide_show_guide()
{
    document.getElementById("show_guide_content").style.display="none";
    document.getElementById("show_guide_back").style.display="none";
}