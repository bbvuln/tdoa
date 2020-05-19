define('tDesktop/tDesktop.Nocbox',function(require, exports, module){
    var $ = window.jQuery;
    var Nocbox = {
        init: function(c){
            this.tDesktop = c.tDesktop;
            this.loadNoc();
            this.bindEvent();
        },
        bindEvent: function(){
            var self = this;
            self.tDesktop.EventManager.on('loadNoc:load',function() {
                self.loadNoc();
            });

            self.tDesktop.EventManager.on('notify:read',function(item) {
                var $target = $('#new_noc_list li[sms_id="'+item.sms_id+'"]');
                var url = item.url;
                var sms_id = item.sms_id;
                var type_id = item.type_id;
                //remove this
                self.removeNoc($target, sms_id, 0);
                if(url!=""){//open this url
                    self.openURL('', item.type_name, url);
                }
            });

            self.tDesktop.EventManager.on('nocbox:markAll',function(ids,msgIdStr) {
                self.removeNoc($('.noc_item_cancel'),ids,0,msgIdStr);
            })
            
            //click to read detail
            $('#new_noc_list').delegate('li', 'click', function(){
                var url = $(this).attr('url');
                var sms_id = $(this).attr('sms_id');
                var type_id = $(this).attr('type_id');
                //remove this
                self.removeNoc($(this),sms_id, 0);
                if(url!=""){//open this url
                    self.openURL('', '', url, '1');
                }
                
            });
            //click and read History
            $('#check_remind_histroy,#tohistory').click(function(){
                self.openURL('',td_lang.inc.msg_23, "sms/remind_center");
            });
            
            //click read all
            $('#ViewAllNoc').click(function(){
                var idstr = self.get_noc_idstr();
                $.ajax({
                    type: 'POST',
                    url: 'status_bar/sms_submit.php',
                    data: {'SMS_ID': idstr},
                    cache: false,
                    success: function(){
                        $('#new_noc_list').empty();
                        var datanum = self.get_noc_num();
                        $("#noc_item_num").html(datanum); 
                        $('#nodata_tips').show();
						$('#new_noc_list_wrapper').empty().hide();
						
						$('.noc-nav-bar').hide();
                        //$('.noc').addClass("null"); 
                    }
                });
            });
            //click all detail
            $('#ViewDetail').click(function(){
                var idstr = firsturl = separator = "";
                var idobj = $('#new_noc_list > .noc_item > .noc_item_data > li');
                var readobj = $('#new_noc_list > div.noc_item > .noc_item_title > .noc_item_read');
                var idstr_all = self.get_noc_idstr();
                idobj.each(function(){
                    url = $(this).attr("url");
                    sms_id = $(this).attr("sms_id");
                    if(url!="" && firsturl==""){
                        firsturl = url;
                    }
                    if(url!=""){
                        idstr += separator + $(this).attr("sms_id");
                        separator = ",";
                    }
                });
                window.open('/module/nav/?SMS_ID_STR='+idstr+'&NAV_MAIN_URL='+encodeURIComponent(firsturl));
                self.removeNoc(readobj,idstr_all, 0); 
            });
            $('#new_noc_list').delegate('.noc_item_read', 'click', function(){
                var idstr = idstr_all = firsturl = "";
                var separator = ",";
                var type_id = $(this).attr('type_id');
                var idstr_all = self.get_noc_idstr(type_id);
                self.removeNoc($(this),idstr_all, 0);
                var idobj = $("#new_noc_list > .noc_item_" + type_id + " > .noc_item_data > li");
                idobj.each(function(){
                    url = $(this).attr("url");
                    if(url == "")
                    {
                        return true;
                    }
                    sms_id = $(this).attr("sms_id");
                    if(url!="" && firsturl==""){
                        firsturl = url;
                    }
                    if(url!=""){
                        idstr += separator + $(this).attr("sms_id");
                        separator = ",";
                    }
                });
                url = '/module/nav/?SMS_ID_STR='+idstr+'&NAV_MAIN_URL='+encodeURIComponent(firsturl);
                if(idstr != "")
                {
                    self.openURL('', '', url, '1');
                }
            });
            $('#new_noc_list').delegate('.noc_item_cancel', 'click', function(){
                var type_id = $(this).attr('type_id');
                var idstr_all = self.get_noc_idstr(type_id);
                self.removeNoc($(this),idstr_all, 0);
            });
        },
        //get noc data
        loadNoc: function(flag){
            
            var self = this;
            var isTOS = true;
            flag = typeof(flag) == "undefined" ? "1" : "0";
            $.ajax({
                type: 'GET',
                url: 'status_bar/get_noc.php',
                data: {'FLAG': flag,'isTos': isTOS},
                dataType: "json",
                cache: false,
                success: function(data){
					
                    $('#nocbox_tips').hide();
                    if(data == null){
                        $('#nodata_tips').show();
						$('.noc-nav-bar').hide();
                        $('#new_noc_list_wrapper').empty().hide();
                    }
                    else{
                        $("#nodata_tips").hide();
						$('.noc-nav-bar').show();
                        self.formatNoc(data);
					}
                }
            });
        },
        //dat to dom
        formatNoc: function(data){
            var totalnum = "",
                  self = this;
			if($('#new_noc_list_wrapper').find('#new_noc_list').size()!=0){
				$('#new_noc_list_wrapper').show();
			}else{
				$('#new_noc_list_wrapper').append('<div id="new_noc_list" class="new_noc_list"></div>').show();	
			}
            $('#new_noc_list').empty();
	        $.each(data,function(key, item){ 
		        if(item.type_id == ""){
		            return false;
		        }
                item.content = decodeURIComponent(item.content);
                item.type_name = decodeURIComponent(item.type_name);
                item.send_time = decodeURIComponent(item.send_time);
                item.from_name = decodeURIComponent(item.from_name);
                
                //noc trigger notification,and this remind and sms'remind from_id means not same
                var tmpl = item.from_id;
                item.from_id = item.uid;
                item.uid = item.from_id;
                
                self.tDesktop.EventManager.trigger('message:create', item);  
                
                if($('#new_noc_list').find('.noc_item_'+item.type_id).size()!=0){
                    $('.noc_item_'+item.type_id+' > ul').append($("#nocitem-template").tmpl(item));	
                }else{
                    $('#new_noc_list').append($("#noc-template").tmpl(item));
                    $('.noc_item_'+item.type_id+' > ul').append($("#nocitem-template").tmpl(item));	
                }
            });
            $('.noc').addClass("on"); 
            var num = self.get_noc_num();
            $("#noc_item_num").html(num);
			
			
        },    
        //get noc count
        get_noc_num: function(){
            var totalnum = '';
        	totalnum = $("#new_noc_list > .noc_item > .noc_item_data > li").length;
        	return totalnum;	
        },
        //cal unnoc noc
        get_noc_idstr: function(type_id){
            var idstr = '';
            var separator = '';
            if(type_id!="" && typeof(type_id)!=="undefined")
            {
                var idsobj = $("#new_noc_list > .noc_item_" + type_id + " > .noc_item_data > li");
            }else
            {
                var idsobj = $("#new_noc_list > .noc_item > .noc_item_data > li");
            }	
            $.each(idsobj,function(){
                idstr += separator + $(this).attr("sms_id");
                separator = ",";
            });
            return idstr;
        },
        //remove
        removeNoc: function(obj, recvIdStr, del, msgIdStr){
            var self = this;
            if(!recvIdStr && !msgIdStr){ 
                return
            }
            $.ajax({
                type: 'POST',
                url: 'status_bar/sms_submit.php',
                data: {'SMS_ID':recvIdStr,'MSG_ID':msgIdStr},
                success: function(data){
                    var lis = obj.parents(".noc_item").find("li").size();
                    if(recvIdStr.indexOf(",")!='-1'){
                        obj.parents(".noc_item").remove()
                    }else{
                        lis == 1 ? obj.parents(".noc_item").remove() :	obj.remove();
                    }
                    var num = self.get_noc_num();
                    $("#noc_item_num").html(num);
                    if(num < 1){
                        $('#nodata_tips').show();
						$('#new_noc_list_wrapper').empty().hide();
						$('.noc-nav-bar').hide();
                    }
                }
            });
        },
        openURL: function(id, name, url, open_window, width, height, left, top){
            id = !id ? ('w' + (nextTabId++)) : id;
            if(open_window != "1")
            {
                window.setTimeout(function(){$().addTab(id, name, url, true)}, 1);
            }
            else
            {
                width = typeof(width) == "undefined" ? 780 : width;
                height = typeof(height) == "undefined" ? 550 : height;
                left = typeof(left) == "undefined" ? (screen.availWidth-width)/2 : left;
                top = typeof(top) == "undefined" ? (screen.availHeight-height)/2-30 : top;
                window.open(url, id, "height="+height+",width="+width+",status=0,toolbar=no,menubar=yes,location=no,scrollbars=yes,top="+top+",left="+left+",resizable=yes");
            }
        }
    };
    exports.Nocbox = Nocbox;
});