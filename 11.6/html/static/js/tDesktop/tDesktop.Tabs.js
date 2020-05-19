define('tDesktop/tDesktop.Tabs', function(require, exports, module){
    var $ = window.jQuery;
    var pulser = require('tDesktop/tDesktop.Pulse');
    var Tabs = {
        init: function(){
            this.initTabs();
        },
        initTabs: function(){
            var self = this;
            $(window).resize(function(){
                self.resizeLayout();
            });
            self.resizeLayout();
            $('#tabs_container').tabs({
                tabsLeftScroll:'tabs_left_scroll',
                tabsRightScroll:'tabs_right_scroll',
                panelsContainer:'center',
                secondTabsContainer: 'funcbar_left'
            });
            $('#funcbar_left').delegate('.second-tab-item','click',function(){
                var self = $(this);
                var url = self.attr('action');
                var id = self.attr('secondTabId');
                $("#tabs_"+id+"_iframe").attr('src',url);
            });
        },
        resizeLayout: function(){
            var wWidth = (window.document.documentElement.clientWidth || window.document.body.clientWidth || window.innerHeight);
            var width = wWidth - $('#logo').outerWidth() - $('#infobar').outerWidth();
            $('#tabs_container').width(width - $('#tabs_left_scroll').outerWidth() - $('#tabs_right_scroll').outerWidth() - 2);
            $('#taskbar').width(width-2);
            $('#tabs_container').triggerHandler('_resize');
        },
        createTab: function(id, name, code, open_window){

            var self = this;
            jQuery('#funcbar_left > div.second-tabs-container').hide();
            if(id.toString().indexOf('portal_') == 0 || code.indexOf('http://') == 0 || code.indexOf('https://') == 0 || code.indexOf('ftp://') == 0)
            {
                self.openURL(id, name, code, open_window);
                return;
            }
            else if(code.indexOf('file://') == 0)
            {
                winexe(name, code.substr(7));
                return;
            }
            var url = "";
            if(id >= 10000 && id <= 14999)
                url = '/fis/' + code;
            else if(id >= 15000 && id <= 15499)
                url = '/hr/' + code;
            else if(id >= 650 && id <= 1000 || code.length > 4 && code.substr(code.length-4).toLowerCase() == ".jsp")
                url = '/app/' + code;
            else
                url = '/general/' + code;
            if(url.indexOf(".") < 0 && url.indexOf("?") < 0  && url.indexOf("#") < 0 && url.substring(url.length-1) != "/")
                url += "/";

            //new window open or not oa'module
            if(open_window == "1" || url.indexOf('/general/') != 0)
            {
                self.openURL(id, name, url, open_window);
                return;
            }

            var url2 = 'http://www.tongda2000.com' + url;
            var parse = url2.match(/^(([a-z]+):\/\/)?([^\/\?#]+)\/*([^\?#]*)\??([^#]*)#?(\w*)$/i); //*/
            var path = parse[4];
            var query = parse[5];

            //meu url
            var pos = path.lastIndexOf('/');
            if(pos > 0 && path.substr(pos+1).indexOf('.') > 0 || query != "")
            {
                self.openURL(id, name, url, open_window);
                return;
            }

            jQuery.ajax({
                type: 'GET',
                url: '/inc/second_tabs.php',
                data: {'FUNC_CODE':escape(url)},
                dataType: 'text',
                success: function(data){
                    var array = self.Text2Object(data);
                    if(typeof(array) != "object" || typeof(array.length) != "number" || array.length <= 0)
                    {
                        self.openURL(id, name, url, open_window);
                        return;
                    }
            
                    var index = 0;
                    var html = '';
                    for(var i=0; i< array.length; i++)
                    {
                        index = (array[i].active == "1") ? i : index;//默认打开第一个标签页地址
                        var className = (array[i].active == "1") ? ' class="second-tab-item active"' : 'class="second-tab-item"';
                        var href = (url.substr(url.length-1) != "/" && array[i].href.substr(0,1) != "/") ? (url + '/' + array[i].href) : (url + array[i].href);
                        html += '<a title="' + array[i].title + '" action="' + href + '" secondTabId="' + id + '"' + className + ' hidefocus="hidefocus"><span>' + array[i].text + '</span></a>';
                    }
            
                    html = '<div id="second_tabs_' + id + '" class="second-tabs-container">' + html +'</div>';
                    jQuery(html).appendTo('#funcbar_left');
            
                    var secondTabs = jQuery('#second_tabs_' + id);
                    jQuery('a', secondTabs).click(function(){
                        jQuery('a.active', secondTabs).removeClass('active');
                        jQuery(this).addClass('active');
                    });
            
                    if(jQuery('a.active', secondTabs).length <= 0)
                        jQuery('a:first', secondTabs).addClass('active');
                    jQuery('a:last', secondTabs).addClass('last');
            
                    url += url.substr(url.length-1) != "/" ? ("/"+array[index].href) : array[index].href;
                    self.addTab(id, name, url, true);
                },
                error: function (request, textStatus, errorThrown){
                    self.openURL(id, name, url, open_window);
                }
            });
        },
        addTab: function(id, title, url, closable, selected, callback){
            var self = this;
            if(!id) return;
            closable = (typeof(closable) == 'undefined') ? true : closable;
            selected = (typeof(selected) == 'undefined') ? true : selected;
            //var height = self.isTouchDevice() ? 'auto' : '100%';
            var height = '100%';
            jQuery('#tabs_container').tabs('add', {
                id: id,
                title: title,
                closable: closable,
                selected: selected,
                style: 'height:' + height + ';',
                content: '<iframe id="tabs_' + id + '_iframe" name="tabs_' + id + '_iframe" allowTransparency= "true"' + (!selected ? (' _src="' + url + '"') : '') + ' src="' + (selected ? url : '') + '"' + (selected ? (' onload="IframeLoaded(\'' + id + '\');"') : '') + ' border="0" frameborder="0" framespacing="0" marginheight="0" marginwidth="0" style="width:100%;height:' + height + ';"></iframe>',
                callback: function() {
                    pulser.pulseFormer();
                    callback && callback();
                }
            });
        },
        selectTab: function(id){
            $('#tabs_container').tabs('select', id);
        },
        closeTab: function(id){
            $('#tabs_container').tabs('close', id);
        },
        getSelected: function(){
            return $('#tabs_container').tabs('selected');

        },
        isTouchDevice: function(){
            try{
                document.createEvent("TouchEvent");
                return userAgent.indexOf("mobile") >= 0 || userAgent.indexOf("maxthon") < 0;
            }catch(e){
                return false;
            }
        },
        openURL: function(id, name, url, open_window, width, height, left, top){
            var self = this;
            id = !id ? ('w' + (nextTabId++)) : id;
            if(open_window != "1")
            {
                window.setTimeout(function(){self.addTab(id, name, url, true)}, 1);
            }
            else
            {
                width = typeof(width) == "undefined" ? 780 : width;
                height = typeof(height) == "undefined" ? 550 : height;
                left = typeof(left) == "undefined" ? (screen.availWidth-width)/2 : left;
                top = typeof(top) == "undefined" ? (screen.availHeight-height)/2-30 : top;
                window.open(url, id, "height="+height+",width="+width+",status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+top+",left="+left+",resizable=yes");
            }
        },
        Text2Object: function(data){
            var self = this;
            try{
                var func = new Function("return " + data);
                return func();
            }
            catch(ex){
                return '<b>' + ex.description + '</b><br /><br />' + self.HTML2Text(data) + '';
            }
        },
        HTML2Text: function(html){
            var div = document.createElement('div');
            div.innerHTML = html;
            return div.innerText;
        },
        IframeLoaded: function(id){
            var iframe = window.frames['tabs_' + id + '_iframe'];
            if(iframe && $('#tabs_link_' + id) && $('#tabs_link_' + id).innerText == '')
            {
                $('#tabs_link_' + id).innerText = !iframe.document.title ?  td_lang.inc.msg_27: iframe.document.title;
            }
            pulser.pulseLater();
        }
    };
    exports.Tabs = Tabs;
});