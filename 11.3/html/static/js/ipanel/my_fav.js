
//Windows快捷组执行方法
function winexe(NAME, PROG)
{
    var URL="/general/winexe/?PROG="+PROG+"&NAME="+NAME;
    window.open(URL);
}

//给OA精灵的调用接口，设置常用菜单
function set_recent_funcs(func_id_str)
{
    recent_func_id = func_id_str;
    jQuery('#tabs a[index="RECENT"]').trigger('click');
}

(function($)
{
    //调整窗口大小
    $(window).resize(function(){
        $('#panels').height($(window).height() - $('#tabs').outerHeight());
    });
    
    $(document).ready(function()
    {
        $(window).triggerHandler('resize');
        
        //三个标签的点击事件，点击后设置标签为激活状态，并将对应的panel显示出来
        $("#tabs a").click(function(){
            $(this).siblings().removeClass("current");
            $(this).addClass("current");
            
            var index = $(this).attr('index');
            var cur_panel = $('#CONTAINER_' + index);
            cur_panel.siblings().hide();
            cur_panel.show();
            
            //如果对应的panel是常用菜单或panel为空，则重新加载panel内容
            if(index != 'SHORTCUT' || cur_panel.text() == '')
            {
                load_panel_data(index);
            }
        });
        
        //菜单的点击事件，点击后回调主框架菜单页面的对应菜单点击事件
        $(document).on('click', '#panels a[func_id]', function(){
            if(typeof(window.external.OA_SMS) != 'undefined')
            {
                window.external.OA_SMS($(this).attr('func_id'), '0', 'click_menu');
            }
        });
        
        //收藏网址的点击事件，点击后回调主框架菜单页面的OpenURL方法
        $(document).on('click', '#panels a[url]', function(){
            if(typeof(window.external.OA_SMS) != 'undefined')
            {
                window.external.OA_SMS($(this).attr('url'), '1', 'click_menu');
            }
        });
        
        //第一次打开页面时加载常用菜单
        set_recent_funcs(recent_func_id);
    });
    
    //加载指定panel的数据
    function load_panel_data(index)
    {
        if(index == 'RECENT')
        {
            set_funcs(index, recent_func_id);
        }
        else if(index == 'SHORTCUT')
        {
            set_funcs(index, shortcut);
            
            $.ajax({
                type: 'GET',
                url: 'menu_code.php',
                data: {'MENU_TYPE':'WINEXE'},
                dataType: 'text',
                success: function(data){
                    $('#CONTAINER_' + index).append(data);
                },
                error: function (request, textStatus, errorThrown){
                    alert(textStatus);
                }
            });
        }
        else if(index == 'FAV')
        {
            $.ajax({
                type: 'GET',
                url: 'menu_code.php',
                data: {'MENU_TYPE':index},
                dataType: 'text',
                success: function(data){
                    $('#CONTAINER_' + index).html(data);
                },
                error: function (request, textStatus, errorThrown){
                    alert(textStatus);
                }
            });
        }
    }
    
    //根据菜单ID和菜单缓存数组生成对应的HTML代码
    function set_funcs(index, func_id_str)
    {
        $('#CONTAINER_' + index).html('');
        
        var func_id_array = func_id_str.split(',');
        for(var i=0; i<func_id_array.length; i++)
        {
            var func_id = func_id_array[i];
            if(func_id == '')
            {
                continue;
            }
            
            if(typeof(func_array['f' + func_id]) != 'undefined')
            {
                var func = func_array['f' + func_id];
                var image = (icons.indexOf(func[2] + ',') == 0 || icons.indexOf(',' + func[2] + ',') > 0) ? func[2] : 'default';
                $('#CONTAINER_' + index).append('<a href="javascript:;" func_id="f' + func_id + '" title="' + func[0] + '"><img src="' + myoa_static_seerver + '/static/theme/13/images/app_icons/' + image + '.png" /><span>' + func[0] + '</span></a>');
            }
        }
    }
})(jQuery);