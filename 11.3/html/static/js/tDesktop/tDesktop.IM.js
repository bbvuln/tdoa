var formatTime = function(c){
    var c = parseInt(c) * 1000;
    var a = new Date();
    a = a.getTime();
    var g = new Date(c);
    var b = new Date(a);
    var f = a - c;
    var e = "";
    function d(h){ 
        return h < 10 ? ("0" + h) : h
    }
    if(f < 0){
        e = "";
    }else{ 
        if(f < (60 * 1000)){
            e = parseInt(f / 1000) + td_lang.inc.msg_169
        }else{
            if(f < (60 * 60 * 1000)){
                e = parseInt(f / 60 / 1000) + td_lang.inc.msg_170
            }else{
                if(f < (24 * 60 * 60 * 1000)){
                    if(g.getDate() == b.getDate()){
                        e = td_lang.inc.msg_182 + d(g.getHours()) + ":" + d(g.getMinutes())   
                    }else{
                        e = (g.getMonth() + 1) + td_lang.inc.msg_171 + g.getDate() + td_lang.inc.msg_172 + d(g.getHours()) + ":" + d(g.getMinutes())  
                    }
                }else{
                    if(f < (365 * 24 * 60 * 60 * 1000)){
                        if(g.getFullYear() == b.getFullYear()){
                            e = (g.getMonth() + 1) + td_lang.inc.msg_171  + g.getDate() + td_lang.inc.msg_172 + d(g.getHours()) + ":" + d(g.getMinutes())    
                        }else{
                            e = g.getFullYear() + "-" + (g.getMonth() + 1) + "-" + g.getDate() + " " + d(g.getHours()) + ":" + d(g.getMinutes())   
                        }
                    }else{
                        e = g.getFullYear() + "-" + (g.getMonth() + 1) + "-" + g.getDate() + " " + d(g.getHours()) + ":" + d(g.getMinutes())    
                    }
                }
            }
        }
    }
    return e
};
window.formatTime = formatTime;
define('tDesktop/tDesktop.IM',function(require, exports, module){
    var $ = window.jQuery;
    var Comet = {
        init: function(c){
            var self = this;
            self.tDesktop = c.tDesktop;
            //noc sms toggle
            $("#msg-tool .btn").click(function(){
                $(".msg-tool .btn").removeClass("btn-primary");
                $(this).addClass("btn-primary");
                var target = $(this).attr("msg-panel");
                $(".msg-panel").removeClass("active");
                $("#"+target).addClass("active");
            }); 
            //newsms online
            timer_sms_mon = window.setTimeout(function(){
                self.sms_mon();
            }, 3000);
            //online
            window.setTimeout(function(){
                self.online_mon();
            }, monInterval.online*1000);   
			
        },
        noc_mon: function(){
            var self = this;
            //trigger noc load
            self.tDesktop.EventManager.trigger('loadNoc:load');
        },
        //settimeout 3s comet
        sms_mon: function(){
            var self = this;
            if(timer_sms_mon)
            {
                window.clearTimeout(timer_sms_mon);
                timer_sms_mon = null;
            }
            timer_sms_mon = window.setTimeout(function(){
                self.sms_mon();
            }, monInterval.sms*1000);
            $.ajax({
                type: 'GET',
                url: '../inc/new_sms.php',
                data: {'now': new Date().getTime()},
                success: function(data){
                    if(data.indexOf("1") >= 0)
                    {
                        $('#new_sms_sound').html(newSmsSoundHtml);
                        if(data.substr(0, 1) == "1")
                        {
                            //trigger load noc
                            self.noc_mon();
                        }
                        else if(data.substr(1, 1) == "1")
                        {
                            //trigger load sms
                            self.tDesktop.EventManager.trigger('LoadSms:load');
                        }
                    }
                }
            });
        },
        online_mon: function(){
            var self = this;
            $.ajax({
                async:true,
                url: 'ipanel/user/user_count.php',
                dataType: 'text',
                success: function(data){
                    try{
                        eval(data);
                    }
                    catch(ex){
                    }
                    online_count = typeof(online_array) == 'object' ? online_array[0] : 0;
                    $(".user_online").text(online_count);
                    $('#user_online').triggerHandler('_show');
                },
                error: function (request, textStatus, errorThrown){}
            });
            
            window.setTimeout(function(){
                self.online_mon();
            }, monInterval.online*1000);
            
        }
    };
    var Chat = {
        init: function(c){
            this.tDesktop = c.tDesktop;
            this.initSmsbox();
            var self = this;
            setTimeout(function(){
                self.initAttach();
            }, 2000);
            self.hideChat();
            this.bindEvent();
        },
        uploader: {},
        initSmsbox: function(){
            var self = this;
            if(bSmsPriv){
            	//self.tDesktop.EventManager.trigger('LoadSms:load');
                self.loadSms();
            }
            else{
                return;
            }
        },
        bindEvent: function(){
            var self = this;
            self.tDesktop.EventManager.on('LoadSms:load',function() {
                self.loadSms();
            });
            //read msg
            self.tDesktop.EventManager.on('msg:read', function(sms){
                var online = null;
                $.ajax({
                    type: 'GET',
                    url: '/general/userinfo.php',
                    data: {'UID': sms.from_id},
                    success: function(d){
                        online = d.data.online_flag;
                        sms.online_status = online;
                        sms.avatar = d.data.avatar;
						
						
						//获取勋章
						//jQuery.get('/general/person_info/mymedals/mock.json',{
						jQuery.post('/general/appbuilder/web/hr/hrmedals/mymedal',{
							keyword: '',
							page: 1,
							pageSize: 10,
							uid: sms.from_id
						}, function(response){
							if(response.status == '1'){
								var $list = jQuery('#chat-medal-list')
								$list.html('')
								var html = ''
								var data = response.data || []
								//console.log(data.length)
								// if(data.length < 1){
									// jQuery('#chat-medal-list').hide();
								// }
								if(data.length > 6){
									data = data.slice(0,6) 
									jQuery('#chat-medal-more').removeClass('hide');
								}
								for(var i=0;i<data.length;i++ ){
									$list.append('<img title="'+ data[i].name +'" style="float:left;width:16px;height:16px;margin-right:3px;border-radius:3px;" class="miniprofile-medal" src="'+data[i].icon+'" />');
								}
							}
						})
						
                        self.render(sms);
                        self.showChat();
                        $('#smsbox_textarea').focus();
                    }
                });
            });
            //click user load sms
            $('#smsbox_list_container').delegate('.chatuser', 'click', function(){
                $(this).show();
                $('#smsbox_msg_container').find('.chatmsg').remove();
                var id = $(this).attr('group_id');
				var uid = $(this).attr('user');
                $('#smsbox_textarea').html("").focus();
                $('.chatuser').removeClass('active unread');
                $(this).addClass('active');
                $(this).children(".count").text("");
                selectedRecvSmsIdStr = selectedSendSmsIdStr = '';
                selectedRecvFromIdStr = '';
                $('#chat-title').text($(this).find('span').text());
                
                var online = $(this).attr("online");
                if(online == 1){
                    $('#chat-status').attr("class","chat-status chat-online");
                }
                else if(online == 2){
                    $('#chat-status').attr("class","chat-status chat-busy");
                }
                else if(online == 3){
                    $('#chat-status').attr("class","chat-status chat-leave");
                }
                else{
                    $('#chat-status').attr("class","chat-status chat-offline");
                }

				jQuery.post('/general/appbuilder/web/hr/hrmedals/mymedal',{
					keyword: '',
					page: 1,
					pageSize: 10,
					uid: uid
				}, function(response){
					if(response.status == '1'){
						var $list = jQuery('#chat-medal-list')
						$list.html('')
						var html = ''
						var data = response.data || []
						// if(data.length < 1){
							// jQuery('#chat-medal-list').hide();
						// }
						if(data.length > 6){
							data = data.slice(0,6) 
							$('#chat-medal-more').removeClass('hide');
						}
						for(var i=0;i<data.length;i++ ){
							$list.append('<img title="'+ data[i].name +'" style="float:left;width:16px;height:16px;margin-right:3px;border-radius:3px;" class="miniprofile-medal" src="'+data[i].icon+'" />');
						}
					}
				})
				
                
                //render history messages before the current newSmsArray's messages
                if(self.historyMsg.users[id] && self.historyMsg.users[id].curPage !== 1){
                    self.historyMsg.render(self.historyMsg.users[id].historyMessage);
                }

                //set href for #moreHistoryMsg
                self.historyMsg.setHref(id);

                for(var i=0; i< newSmsArray.length; i++)
                {
                    if(!((newSmsArray[i].from_id == id && newSmsArray[i].to_id == loginUser.uid) || (newSmsArray[i].from_id == loginUser.uid && newSmsArray[i].to_id == id)))
                        continue;
                    if(newSmsArray[i].receive){
                        selectedRecvSmsIdStr += newSmsArray[i].sms_id + ',';
                        selectedRecvFromIdStr += newSmsArray[i].from_id + ',';
                    }
                    else{
                        selectedSendSmsIdStr += newSmsArray[i].sms_id + ',';
                    }
                    newSmsArray[i].unread = 0;
                    var from_name = newSmsArray[i].from_name;
                    var time = newSmsArray[i].send_time.indexOf(' ') > 0 ? newSmsArray[i].send_time : newSmsArray[i].send_time;
                    var from_type_name = newSmsArray[i].from_type_name;
                    var data = new Object;
                    data.sms_id = newSmsArray[i].sms_id;
                    data.receive = newSmsArray[i].receive;
                    data.user = newSmsArray[i].from_id;
                    data.type_id = newSmsArray[i].type_id;
                    data.from_type_name = from_type_name;
                    data.from_name = from_name;
                    data.time = time;
                    data.content = newSmsArray[i].content;
                    data.url = newSmsArray[i].url;
                    data.from_id = newSmsArray[i].from_id;
                    if(newSmsArray[i].avatar.indexOf(".")!=-1 && newSmsArray[i].avatar.indexOf('/')==-1){
                        data.avatar = '/inc/attach_old.php?ATTACHMENT_ID=avatar&ATTACHMENT_NAME='+newSmsArray[i].avatar+'&DIRECT_VIEW=1'; 
                    }else if(newSmsArray[i].avatar.indexOf('/')!=-1){
                        data.avatar = newSmsArray[i].avatar;
                    }else{
                        data.avatar = static_server + '/static/images/avatar/'+newSmsArray[i].avatar+'.png';	
                    }
                    var html = $("#chatMsg-template").tmpl(data);
                    $('#smsbox_msg_container').append(html);
                    $("#smsbox_msg_container").scrollTop($("#smsbox_msg_container")[0].scrollHeight);
                }
                var lis = $('#smsbox_list_container .chatuser');
                var acliindex = lis.index($('.chatuser.active'));
                self.removeSms(selectedRecvSmsIdStr, selectedSendSmsIdStr, 0 ,acliindex,selectedRecvFromIdStr);
            });
            //click closebtn after username
            $("#smsbox_list_container").delegate(".chatuser i", "click", function(){
                var target = $(this).parent(".chatuser");
                var id = target.attr("group_id");
                var prev = target.prev();
                var next = target.next();
                target.remove();
                if(next.length > 0){
                    next.trigger('click');
                }
                else if(prev.length > 0){
                    prev.trigger('click');
                }
                else{
                    self.hideChat();   
                }
                $('#chat-delete').hide();

                if(self.historyMsg.users[id]){
                    self.historyMsg.users[id].curPage = 1;
                    self.historyMsg.users[id].historyMessage = [];
                }
                return false;
            });
            $("#smsbox_msg_container").delegate(".imPanel[node-type='tMImage']", "click", function(e){
                var _href = $(this).attr('node-data'); 
                e.stopPropagation();
                if(typeof(window.external.PlayVoiceMsg) == "undefined")
                {
                    mytop=(screen.availHeight-510)/2;
                    myleft=(screen.availWidth-660)/2;
                    window.open(_href, "imageShow", "height=510, width=660, top="+mytop+", left="+myleft+",toolbar=no, menubar=no, scrollbars=yes, resizable=no, location=no, status=no");
                }else{
                    if(parent && parent.openURL)
                    {
                        parent.openURL(_href);  
                    }
                }
                return;
            });
            //close chat dialog
            $('#smsbox_toolbar_del').click(function(){
                if($('.chatuser:visible').length > 1){
                    $('#chat-delete').show();
                }
                else{
                    $('#smsbox_list_container').html("");
                    //$('#smsbox_msg_container').remove('.chatmsg');
                    $('#smsbox_msg_container').find('.chatmsg').remove();
                    self.hideChat();
                }
                //clear all historyMsg users
                self.historyMsg.users = [];
            });
            //minify the dialog
            $('#smsbox_toolbar_shrink').click(function(){
                //$('#chat-wrapper').toggleClass('mini');
                //console.log(this);
                if($(this).text() === "-"){
                    self.minimize();
                } else {
                    self.maximize();
                }

            });

            //quick reply
            $("#quickBar").click(function(){
                $(".quickReply").toggleClass("active");
                $("#smsbox_rapid_reply option:first").attr('selected','selected');
            });
            //close all
            $('#closeAllChat').click(function(){
                $('#smsbox_list_container').html("");
                //$('#smsbox_msg_container').remove('.chatmsg');
                $('#smsbox_msg_container').find('.chatmsg').remove();
                $('#chat-delete').hide();
                self.hideChat();
            });
            //close current
            $('#closeActiveChat').click(function(){
                var active = $('.chatuser.active');
                var prev = $('.chatuser.active').prev();
                var next = $('.chatuser.active').next();
                active.remove();
                if(next.length > 0 && next.is(":visible")){
                    next.trigger('click');
                }
                else if(prev.length > 0 && prev.is(":visible")){
                    prev.trigger('click');
                }
                else{
                    self.hideChat();   
                }
                $('#chat-delete').hide();
            });
            //close dialog
            $('#chatDeleteClose').click(function(){
                $('#chat-delete').hide();
            });
            //rapid reply
            $('#smsbox_rapid_reply').change(function(){
                if(this.selectedIndex == 0)
                    return;
                $('#smsbox_textarea').val(this.options[this.selectedIndex].text)
            });
            //ctrl enter send
            $('#smsbox_textarea').keypress(function(event){
                if(event.keyCode == 10 || event.ctrlKey && event.which == 13)
                    $('#smsbox_send_msg').triggerHandler('click');
            });
            //send btn click
            $('#smsbox_send_msg').click(function(){
                self.sendMsg();
            });
            //load more history message
            $('#moreHistoryMsg').click(function() {
                //find the current active user
                var currentUser = $('.chatuser').filter(function(index,item){
                    if($(item).hasClass('active'))
                        return true;
                });
                var currentUid = $(currentUser).attr('group_id');

                self.historyMsg.loadMore(currentUid);
            })
			
			$('#chat-medal-more,#chat-medal-list').click(function(){
				var currentUser = $('.chatuser').filter(function(index,item){
                    if($(item).hasClass('active'))
                        return true;
                });
                var currentUid = $(currentUser).attr('user');
				var user_name = $(currentUser).find('.fromname').text();
				createTab("medal"+currentUid,user_name+medal_title,"person_info/mymedals/?uid="+currentUid+"&user_id=","")
			})
        },
        showChat: function(){
            this.maximize();
            $('#chat-wrapper').show();
            $('#chat-wrapper').addClass("active");
        },
        hideChat: function(){
            $('#chat-wrapper').removeClass("active");
            $('#chat-wrapper').hide();
        },
        //init chat attach webuploader
        initAttach: function(){
            var self = this,
                $list = $('#smsbox_msg_container'),
                avatar = $("#loginavatar").attr("src");    
            //init
            self.uploader = new WebUploader.Uploader({
                resize: false,
                duplicate: true,
                auto: true,
                dnd: '#smsbox_textarea',
                swf: '/static/js/webuploader/Uploader.swf',
                server: '/module/upload/upload.php?module=im',
                pick: '#uploadBar'
            });
            //upload ing
            self.uploader.on( 'fileQueued', function( file ) {   
                var date = new Date(),
                    time = date.toTimeString().substr(0,5),
                    filesize = WebUploader.Base.formatSize(file.size);
                $list.append( '<div class="chatmsg to clearfix" sms_id="" type_id="" url="" from_type_name="">' +
                '<div class="chat-popbox-dialogbox-time">'+ time +'</div>' +
                '<div class="chat-popbox-dialogbox">' +
                    '<div class="chat-popbox-avatar">' +
                        '<img src="'+ avatar+'" class="ui-li-thumb"/>' +
                    '</div>' +
                     '<div class="chat-popbox-bg">' + 
                     '<div id="' + file.id + '" class="item" title="' + file.name +'">' +
                        '<div><input type="hidden" class="fileid" /><span class="filename">'+ file.name+'</span><span class="filesize">( '+ filesize +' )</span></div><div class="uploadimg"></div><p class="status"></p>' +
                     '</div>' +
                     '</div>' + 
                '</div>' +
                '</div>');
                var $li = $( '#'+file.id );
                self.uploader.makeThumb( file, function( error, ret ) {
                    if ( error ) {
                        //$li.text('预览错误');
                    } else {
                        $li.find(".uploadimg").html('<img alt="' + file.name + '" src="' + ret + '" />');
                    }
                });
                var date = new Date();
                newSmsArray[newSmsArray.length] = {sms_id:"",avatar:$("#loginavatar").attr("src"),to_id:$(".chatuser.active").attr("user"),from_id:loginUser.uid,from_name:loginUser.user_name,type_id:"0",type_name:"网页版微讯",send_time:date.toTimeString().substr(0,5),unread:0,content:file.name,url:"",receive:0};
                //this is local msg，arguments is server's response
                //console.log(this,arguments);
            });
            //upload progress
            self.uploader.on( 'uploadProgress', function( file, percentage ) {
                var $li = $( '#'+file.id ),
                    $percent = $li.find('.progress .bar');
                //avoid repeat create
                if ( !$percent.length ) {
                    $percent = $('<div class="progress progress-striped active">' +
                      '<div class="bar" role="progressbar" style="width: 0%">' +
                      '</div>' +
                    '</div>').appendTo( $li ).find('.bar');
                }
                $percent.css( 'width', percentage * 100 + '%' );
            });
            //upload complete
            self.uploader.on( 'uploadComplete', function( file ) {
                $( '#'+file.id ).find('.progress').fadeOut();
            });
            //upload success
            self.uploader.on( 'uploadSuccess', function( file ) {
                $( '#'+file.id +" .status").text(uploadsuccess);
                $( '#'+file.id +" .fileid").val(arguments[1].id);
                var self = this;
                var fileid = $( '#'+file.id +" .fileid").val();
                var uid = $(".chatuser.active").attr("user");
                var userid = $(".chatuser.active span").text();
                $.ajax({
                    type: 'GET',
                    url: 'index_simple_submit.inc.php',
                    data: {
                        uid: uid,
                        userid: userid,
                        fileid: fileid,
                        filename: file.name,
                        flag: 0
                    },
                    success: function(data){
                        //console.log(data);
                    }
                });
                setTimeout(function(){
                    $( '#'+file.id +" .status").fadeOut();
                }, 1000); 
            });
            //upload error
            self.uploader.on( 'uploadError', function( file ) {
                $( '#'+file.id +" .status").text(uploaderror);
                setTimeout(function(){
                    $( '#'+file.id +" .status").fadeOut();
                }, 1000); 
            });
        },
        //uid,username,avatar and all sms info
        render: function(sms){
            var self = this;
            sms.count = 0;
            /*sms format
            var sms = {
                sms_id: "",
                avatar: "",
                to_id: "",
                from_id: "",
                from_name: "",
                from_type_name: "",
                type_id: "",
                type_name: "",
                send_time: "",
                unread: null,
                content: "",
                receive: "",
                online_status: 1
            };
            */
            if($('.chatuser[user="'+sms.from_id+'"]').length <= 0 ){
                $('#smsbox_list_container').append($("#chatUser-template").tmpl(sms));
                $('#smsbox_list_container .chatuser[user='+sms.from_id+']').trigger("click");  
            }
            else{
                $('.chatuser[user="'+sms.from_id+'"]').attr("online",sms.online_status);
                $('.chatuser[user="'+sms.from_id+'"]').trigger('click');  
            }          
        },
        //when new sms load user
        loadSms: function(flag){
            var self = this;
            flag = typeof(flag) == "undefined" ? "1" : "0";
            $.ajax({
                type: 'GET',
                url: 'status_bar/get_msg.php',
                dataType: "json",
                data: {'FLAG': flag},
                success: function(data){
                    var array = data;
                    $.each(array,function(key, item){ 
                        item.from_name = decodeURIComponent(item.from_name);
                        item.content = decodeURIComponent(item.content);
                        item.from_type_name = decodeURIComponent(item.from_type_name);
                        item.type_name = decodeURIComponent(item.type_name);
                        item.url = decodeURIComponent(item.url);
                        item.send_time = decodeURIComponent(item.send_time);
                        item.avatar = decodeURIComponent(item.avatar);
                        item.type_id = 'message';
                    });
                    
                    for(var i=0; i< array.length; i++)
                    {
                        var sms_id = array[i].sms_id;
                        var bFound = false;
                        for(var j=0; j< newSmsArray.length; j++)
                        {
                            if(sms_id == newSmsArray[j].sms_id)
                            {
                                bFound = true;
                                break;
                            }
                        }
                        if(!bFound){
                            newSmsArray[newSmsArray.length] = array[i]; 
                            //sms trigger msg tip
                            //console.log('message:create');
                            self.tDesktop.EventManager.trigger('message:create', array[i]); 
                        }
                    }
                    self.formatSms(); 
                    //send and receive sms，trigger recentlist update
                    self.tDesktop.EventManager.trigger('msg:update');
                    
                }
            }); 
        },
        formatSms: function(active){
            var self = this;
            var array = [];
            for(var i=newSmsArray.length-1; i >= 0; i--)
            {
            	var count = 0;
                if(newSmsArray[i].receive != '1')
                    continue;
                var id = newSmsArray[i].from_id;
                if(typeof(array[id]) != "undefined" && newSmsArray[i].unread == 1)
                {
                    array[id].count++;
                    //continue;
                }
                if(newSmsArray[i].unread == 1){
                	count++;
                }
                var from_name = newSmsArray[i].from_name;
                var time = newSmsArray[i].send_time.indexOf(' ') > 0 ? newSmsArray[i].send_time : newSmsArray[i].send_time;
                 
                if(newSmsArray[i].avatar.indexOf(".")!=-1 && newSmsArray[i].avatar.indexOf('/')==-1){
                    var avatar = '/inc/attach_old.php?ATTACHMENT_ID=avatar&ATTACHMENT_NAME='+newSmsArray[i].avatar+'&DIRECT_VIEW=1'; 
                }else if(newSmsArray[i].avatar.indexOf('/')!=-1 && newSmsArray[i].avatar!=1 && newSmsArray[i].avatar!=0 ){
                    var avatar = newSmsArray[i].avatar;
                }else{
                    var avatar = static_server + '/static/images/avatar/'+newSmsArray[i].avatar+'.png';	
                }
                var unread = array[id] && array[id].unread ? (array[id].unread || newSmsArray[i].unread) : newSmsArray[i].unread;
                var num = array[id]? array[id].count: count;
                array[id] = {from_name:from_name, count:num, avatar:avatar, time:time, content:newSmsArray[i].content, unread:unread};
                //array[id] = {from_name:from_name, avatar:avatar, time:time, content:newSmsArray[i].content, unread:unread};
                
            }
            for(var id in array)
            {
                var data = new Object;
                data.from_id = id;
                data.avatar = array[id].avatar;
                data.content = array[id].content;
                data.count = array[id].count;
                data.from_name = array[id].from_name;
                data.time = array[id].time;
                data.unread = array[id].unread ? "unread" : "";
                //comet sms
                if($('.chatuser[user="'+data.from_id+'"]').length < 1){
                    $('#smsbox_list_container').append($("#chatUser-template").tmpl(data));
                }
                else{
                    if($('.chatuser[user="'+data.from_id+'"]').hasClass("active")){
                        $('.chatuser[user="'+data.from_id+'"]').trigger("click");
                        self.maximize();
                    }
                    else{
                        if(data.count!=0){
                        	$('.chatuser[user="'+data.from_id+'"] .count').text(data.count);
                        }
                    }
                }
            }
        },
        //read sms and delete remove sms
        removeSms: function(recvIdStr, sendIdStr, del , acliindex, selectedRecvFromIdStr){
        	//console.warn('MSG_ID',recvIdStr, 'UID_STR',selectedRecvFromIdStr);
            var self = this;
            if(!recvIdStr) 
                return;
            $.ajax({
                type: 'POST',
                url: 'status_bar/sms_submit.php',
                data: {'MSG_ID':recvIdStr, 'DEL':del, 'UID_STR': selectedRecvFromIdStr},
                dataType: 'text',
                success: function(data){
                },
                error: function (request, textStatus, errorThrown){
                    var msg2 = sprintf(td_lang.inc.msg_112,textStatus);
                    alert(msg2);
                }
            });
        },
        //send sms
        sendMsg: function(){
            var msg = $('#smsbox_textarea').val(),
                $button = $("#smsbox_send_msg");
            if(!msg){
                return;
            }
            var user_id = $('#smsbox_list_container .active').attr('user');
            var user_name = $('#smsbox_list_container .active').find("span").text();
            if(!user_id)
            {
                alert(td_lang.inc.msg_22);
                return;
            }
            var reg = /\n/g;
            var content = msg.replace(reg,"<br>").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            $button.button('loading');
            $.ajax({
                type: 'POST',
                url: 'status_bar/msg_send.php',
                data: {'TO_UID':user_id, 'CONTENT':content, 'charset':'utf-8'},
                dataType: 'text',
                success: function(d){
                    var d = JSON.parse(d);
                    var date = new Date();
                    var data = new Object;
                    data.sms_id = d.sms_id;
                    data.from_id = d.from_id;
                    data.user = loginUser.uid;
                    data.from_name = loginUser.user_name;
                    data.time = date.toTimeString().substr(0,5);
                    data.content = content;
                    data.type_id = "0";
                    data.from_type_name = "微讯网页版";
                    data.url = "";
                    data.receive = 0;
                    data.avatar = $("#loginavatar").attr("src");
                    var html = $("#chatMsg-template").tmpl(data);
                    $('#smsbox_msg_container').append(html);
                    $('#smsbox_msg_container').animate({scrollTop: $('#smsbox_msg_container')[0].scrollHeight}, 300);
                    newSmsArray[newSmsArray.length] = {sms_id:d.sms_id,avatar:data.avatar,to_id:user_id,from_id:loginUser.uid,from_name:loginUser.user_name,type_id:"0",type_name:"个人微讯",send_time:date.toTimeString().substr(0,5),unread:0,content:content,url:"",receive:0};
                    $('#smsbox_textarea').val("");
                    //send and receive sms trigger recentlist
                    self.tDesktop.EventManager.trigger('msg:update');
                    $button.button('reset');
                },
                error: function (request, textStatus, errorThrown){
                    var msg1 = sprintf(td_lang.inc.msg_108,"网络好像出了问题，请稍后再试");
                    alert(msg1);
                }
            });
            $('#smsbox_textarea').trigger('focus'); 
        },
        strlen: function(str){
            return str.replace(/[^\x00-\xff]/g, 'xx').length;
        },
        getSmsIds: function(){
            var recvIds = sendIds = '';
            for(var i=newSmsArray.length-1; i >= 0; i--)
            {
                if(newSmsArray[i].sms_id == '')
                    continue;
            
                if(newSmsArray[i].receive == '1')
                    recvIds += newSmsArray[i].sms_id + ',';
                else
                    sendIds += newSmsArray[i].sms_id + ',';
            }
            return { recv : recvIds, send : sendIds };
        },
        // },
        historyMsg: {
            users: [],//define an array to store all the contact users in recently
            curPage: 1,
            maxPageLimit: 10,
            itemsPerPage: 6,
            $el: $('#moreHistoryMsg'),
            init: function(){

            },
            loadMore: function(currentUid){
                var self = this;
                var uid = currentUid;
                if(self.users[uid] === undefined){
                    //create a new object to contain the informations of this contact
                    self.users[uid] = {
                        curPage: 1,
                        lastId: '',
                        historyMessage: []
                    };
                }

                //get the last sms_id
                self.users[uid].lastId = $('#moreHistoryMsg').next().attr('sms_id') || '';

                //retrive history messages from the server
                if(self.users[uid].curPage < self.maxPageLimit){
                    self.$el.find('a').hide();
                    self.$el.find('img').show();
                    self.fetchData(uid,self.users[uid]);
                } else {               
                    self.setHref(uid);
                }
            },
            fetchData: function(uid,user){
                var self = this;
                $.ajax({
                    type: "GET",
                    url: "/general/status_bar/get_msg.php",
                    dataType: "json",
                    //jsonp: "callbackParam",
                    //jsonpCallback: "success_jsonpCallback",
                    data: {
                        toId: uid,
                        lastId: user.lastId,
                        curPage: user.curPage,
                        maxPageLimit: self.maxPageLimit,
                        itemsPerPage: self.itemsPerPage
                    },
                    success: function(data){
                        self.$el.find('a').show();
                        self.$el.find('img').hide();
                        if(data.length === 0) return;
                        //merge the data into HistoryMessage list
                        user.historyMessage = data ? _.union(user.historyMessage,data) : user.historyMessage;
                        //console.info(uid,user.historyMessage);
                        //render the new data
                        self.render(data);
                        //update the current page number
                        user.curPage++;
						$('#smsbox_msg_container').animate({scrollTop: $('#smsbox_msg_container')[0].scrollHeight}, 300);
                    }
                })
            },
            render: function(data){
                //sort the data by sms_id
                data.sort(function(a,b){
                    return a.sms_id - b.sms_id;
                });
                $.each(data,function(index,item){
                    item.content = decodeURIComponent(item.content);
                    item.time = decodeURIComponent(item.send_time);
                    //console.info(item.sms_id);
                    if(item.avatar.indexOf(".")!=-1 && item.avatar.indexOf('/')==-1){
                        item.avatar = '/inc/attach_old.php?ATTACHMENT_ID=avatar&ATTACHMENT_NAME='+item.avatar+'&DIRECT_VIEW=1'; 
                    }else if(item.avatar.indexOf('/')!=-1){
                        item.avatar = item.avatar;
                    }else{
                        item.avatar = static_server + '/static/images/avatar/'+item.avatar+'.png';  
                    }
                })

                $("#chatMsg-template").tmpl(data).insertAfter('#moreHistoryMsg');
            },
            //set the proper herf to link to the page which contains the full history messages for current user
            setHref: function(id){
                if(!this.users[id]){
                    $('#moreHistoryMsg').find('a').removeAttr('href');
                    return;
                }
                if(this.users[id].curPage < this.maxPageLimit){
                    $('#moreHistoryMsg').find('a').removeAttr('href');
                } else {
                    $('#moreHistoryMsg').find('a').attr('href','/general/sms/msg_center/user_msg.php?UID=' + id);
                }
                
            }
        },
        minimize: function (){
            $('#chat-wrapper').addClass('mini');
            $('#smsbox_toolbar_shrink').html('<i class="iconfont">&#xe680;</i>');
        },
        maximize: function () {
            $('#chat-wrapper').removeClass('mini');
            $('#smsbox_toolbar_shrink').html('-');
        }
    };
    var RecentList = {
        init: function(c){
            this.tDesktop = c.tDesktop;
            this.render();
            this.bindEvent();
        },
        render: function(){
            $.ajax({
                url: '/general/status_bar/get_recent.php',
                type: 'post',
                success: function(d){
                    var d = JSON.parse(d);
                    if(d.length > 0){
                        $("#rec_tips").hide();
                        $('.recentlist').show();
                        $.each(d, function(k, v){
							v.content = v.content ? v.content : '';
                            v.content = v.content.replace(/<\/?[^>]*>/g,'');
                        })
                        var recentHtml = $("#recentList-template").tmpl(d);
                        $('.recentlist').html(recentHtml);
                    }else{
                        $("#rec_tips").show();
                        $('.recentlist').hide();
                    }
                },
                error: function(e){
//                    alert(e);
                }
            });
        },
        openSend: function(){
            $(".weixun-panel").removeClass("active");
            $("#send").addClass("active");
        },
        bindEvent: function(){
            var self = this;
            //send and recieve sms
            self.tDesktop.EventManager.on('msg:update', function(sms){
                self.render();
            });
            //in multisend
            $("#tosend").click(function(){
                self.openSend();   
                self.tDesktop.EventManager.trigger('multisend:in');
                self.tDesktop.EventManager.trigger('MultiSend:initUpload');
            });
            //recent click item
            $(".recentlist").delegate(".recentItem", "click", function(){
                $(".recentItem").removeClass("active");
                $(this).addClass("active");
                var fromid = $(this).attr('fromid');
                var fromname = $(this).find('.rec_name').text();
                var avatar = $(this).find('img').attr('src');
                var sms = {
                    sms_id: "",
                    avatar: avatar,
                    to_id: "",
                    from_id: fromid,
                    from_name: fromname,
                    from_type_name: "",
                    type_id: "",
                    type_name: "",
                    send_time: "",
                    unread: null,
                    content: "",
                    receive: ""
                };
                self.tDesktop.EventManager.trigger('msg:read', sms);
            });
            //update recentlist
            $("#refresh-rec").click(function(){
                self.render();
            });
        }
    };
    var MultiSend = {
        init: function(c){
            this.tDesktop = c.tDesktop;
            this.bindEvent();
            this.initAutocomplete(); 
        },
        //uploader: {},
        bindEvent: function(){
            var self = this;
            self.tDesktop.EventManager.on('MultiSend:initUpload',function(){
                self.initUpload();
            });   
            self.usertags = $('#user-tags').tags({
                callbacks: {
                    remove: function(){
                        var c = self.usertags.serialize();
                        $('#userid').val(c.value ? c.value + ',' : c.value);
                        $('#username').val(c.text ? c.text + ',' : c.text);
                        self.setTagControl("del");  
                    },
                    clear: function(){
                        $("#userid").val("");
                        $("#username").val("");
                        $("#clearall").hide();
                        $("#getmore").hide();
                        $("#no-tag-tips").show();
                    }
                }
            }).data('tags');
            $(window).resize(function(){
                var count = $("#user-tags .tag").length;
                if(count >= 1){
                    $("#no-tag-tips").hide();
                    $("#clearall").show();
                }
                else{
                    $("#no-tag-tips").show();
                    $("#clearall").hide();
                }
                self.showGetMore();
            });
            //back to recent
            $("#torecent").click(function(){
                $(".weixun-panel").removeClass("active");
                $("#recent").addClass("active");
            });
            //click user
            $('#adduser').click(function(event){
                var module_id = 'tdesktop', 
                to_id = "TO_UID", 
                to_name = "TO_NAME", 
                manage_flag, 
                form_name = "";
                window.org_select_callbacks = window.org_select_callbacks || {};
                window.org_select_callbacks.add = function(item_id, item_name){
                    self.usertags.add({ value: item_id, text: item_name });   
                    self.setTagControl();
                };
                window.org_select_callbacks.remove = function(item_id, item_name){
                    self.usertags.remove(item_id);
                };                
                window.org_select_callbacks.clear = function(){      
                    self.usertags.clear(); 
                };
                SelectUser('', module_id, to_id, to_name, manage_flag, form_name,'',event);
                return false;
            });
            //show more user
            $("#getmore").click(function(){
                $(".sendwrapper").addClass("on");
                $("#user-tags").css("height","auto");
                $("#getmore").hide();
            });
            $("#clearall").click(function(){
                self.usertags.clear(); 
            });
            $("#sms_send").click(function(){
                var userid = $("#userid").val();
                var username = $("#username").val();
                var content = $("#sms_content").val();
                var attachidstr = "",
                    attachnamestr = "",
                    attachstr = "";
                $("#uploadlist .item").each(function(){
                    attachnamestr += $(this).attr("title") + ",";
                    attachidstr += $(this).find(".fileid").val();
                    var field = $(this).find(".fileid").val(); 
                    attachstr += field.substr(0,field.length-1) + "." + $(this).attr("title")+",";
                });
                self.send(userid, username, content, attachidstr,attachnamestr,attachstr);
            });
        },
        //send
        send: function(userid, username, content, attachidstr,attachnamestr, attachstr){
            if($.trim(userid) == ""){
                alert(unselectuser);
                return;
            }
            if($.trim(content) == "" && attachidstr == "" ){
                alert(no_content_tip);
                return;
            }
            var self = this;
            var $button = $("#sms_send");
            $button.button('loading');
            $.ajax({
                url: 'index_simple_submit.inc.php',
                data: { 
                    useridstr: userid,
                    username: username,
                    content: content,
                    attachidstr: attachidstr,
                    attachnamestr: attachnamestr,
                    attachstr: attachstr,
                    flag: 1, //1 multi，0 chat dialog send
                    'charset':'utf-8'
                },
                async: true,
                type: 'get',
                success: function(d){
                    if(d = "ok"){
                        self.usertags.clear(); 
                        $("#userid,#username,#sms_content").val("");
                        $("#no-tag-tips").show();
                        $("#clearall").hide();
                        $("#uploadlist").html("");
                        self.uploader.reset();
                        $button.button('reset');
                        alert(sendsuccess);
                    }
                },
                error: function(){
                    $button.button('reset');
                }
            });
        },
        initAutocomplete: function(){ 
            var self = this;
            $.fn.typeahead.Constructor.prototype.blur = function () {
                var that = this;
                setTimeout(function () { that.hide() }, 250);
            };
            var that = this;
            var userlist = {};
            $('#search').typeahead({
                source: function (query, process) { 
                    $.ajax({
                        url: 'search.php',
                        data: { 
                            term: query
                        },
                        async: true,
                        type: 'get',
                        success: function(d){
                            d = JSON.parse(d);
                            userlist = d; 
                            var results = _.map(d, function (user) {
                                if(user.id !== "__SEARCH_HELP__")
                                    return user.id + "";
                            });
                            process(results);
                        }
                    });
                },
                matcher: function (item) {
                    return true;
                },
                highlighter: function (id) {
                    var user = _.find(userlist, function (p) {
                        return p.id == id;
                    });
                    return user.value;
                },
                updater: function (id) {
                    var user = _.find(userlist, function (p) {
                        return p.id == id;
                    });
                    that.setSelectedUser(user);
                }
            });
            this.setSelectedUser = function (user) {
                self.usertags.add({ value: user.id, text: user.value });
                var namestr = $("#userid").val();
                var textstr = $("#username").val();
                var namearr=namestr.split(",");
                var textarr=textstr.split(",");
                if(namestr.indexOf(user.id) >= 0){
                    return;
                }
                else{
                    namestr += user.id + ",";
                    textstr += user.value + ",";
                    $("#userid").val(namestr);
                    $("#username").val(textstr);
                    self.setTagControl();
                }  
            }
        },
        //tag clear and show hide
        setTagControl: function(del){
            var count = $("#user-tags .tag").length;
            if(del == "del"){
                if(count > 1){
                    $("#no-tag-tips").hide();
                    $("#clearall").show();
                }
                else{
                    $("#no-tag-tips").show();
                    $("#clearall").hide();
                }
            }
            else{
                if(count >= 0){
                    $("#no-tag-tips").hide();
                    $("#clearall").show();
                }
                else{
                    $("#no-tag-tips").show();
                    $("#clearall").hide();
                }
            }
            this.showGetMore();
        },
        //is show more btn
        showGetMore: function(){
            $("#user-tags").css("height","auto");
            var scrollheight = $("#user-tags")[0].scrollHeight;
            var height = $("#user-tags").height();
            //more than tag'height，show morebtn，calcular int
            if(scrollheight > height){
                var tag_h = $("#user-tags .tag").outerHeight(true);
                var availnum = Math.floor(height/tag_h);
                availnum = parseInt(availnum);
                height = tag_h*(availnum);
                $("#user-tags").height(height);
                var topValue = $("#user-tags").position().top+height;
                $("#getmore").show();
                //more bnt position
                $("#getmore").css("top", topValue+"px");
            } 
            else{
                $("#getmore").hide();
            }
        },
        //init uploader
        initUpload: function(){  
            var self = this,
                $list = $('#uploadlist');
            if(self.uploader){
                return;
            }
            var uploader = new WebUploader.Uploader({
                resize: false,
                auto: true,
                swf: '/static/js/webuploader/Uploader.swf',
                server: '/module/upload/upload.php',
                pick: '#picker',
                fileNumLimit: 5
            });
            self.uploader = uploader;
            self.uploader.on( 'fileQueued', function( file ) {
                self.addFile(file);
            });
            self.uploader.on('error', function(handler) {
    			if(handler=="Q_EXCEED_NUM_LIMIT"){
    			    alert(uploadnumlimit);
    			}
    			if(handler=="F_DUPLICATE"){
    			    alert(uploadduplicate);
    			}
        	});
            self.uploader.on( 'uploadProgress', function( file, percentage ) {
                var $li = $( '#'+file.id ),
                    $percent = $li.find('.progress .bar');
                if ( !$percent.length ) {
                    $percent = $('<div class="progress progress-striped active">' +
                      '<div class="bar" role="progressbar" style="width: 0%">' +
                      '</div>' +
                    '</div>').appendTo( $li ).find('.bar');
                }
                $percent.css( 'width', percentage * 100 + '%' );
                
            });
            self.uploader.on( 'uploadComplete', function( file ) {
                $( '#'+file.id ).find('.progress').fadeOut();
            });
            self.uploader.on( 'uploadSuccess', function( file ) {
				$( '#'+file.id +" .filename").html(arguments[1].name);
                $( '#'+file.id +" img").attr("src", arguments[1].icon);
                $( '#'+file.id +" .fileid").val(arguments[1].id);
            });
            self.uploader.on( 'uploadError', function( file ) {
                alert(file.name + uploaderror);
            });
            self.tDesktop.EventManager.on('multisend:in',function(){
                self.uploader.refresh();
            });    
        },
        addFile: function(file){
            var self = this,
                $list = $('#uploadlist');
            $list.append( '<div id="' + file.id + '" class="item" title="' + file.name +'">' +
                '<img src="" /><span class="filename"></span><input type="hidden" class="fileid" /><div class="close"></div>' +
            '</div>' );
            //console.log(this,arguments);
            var $li = $( '#'+file.id );
            $li.on( 'click', '.close', function() {
                self.removeFile(file);
            });
        },
        removeFile: function(file){
            var self = this;
            var fileid = $( '#'+file.id +" .fileid").val();
            $.ajax({
                url: '/module/upload/delete.php',
                data: { 
                    fileid: fileid,
                    filename: file.name
                },
                async: true,
                type: 'get',
                success: function(d){
                    self.uploader.removeFile( file );
                    $("#"+file.id).remove();
                }
            });
        }
    };
    var Org = {
        init: function(c){
            this.tDesktop = c.tDesktop;
            this.bindEvent(); 
            this.getOnlineCount();
        },
        bindEvent: function(){
            var self = this;
            //show inline start comet
            $('#user_online').bind('_show', function(){
                var ipanel_org = frames['orgTree0_iframe'];
                if(ipanel_org){
                    if(ipanel_org.contentWindow && typeof(ipanel_org.contentWindow.tree) == "object")
        	        {
        	            ipanel_org.contentWindow.tree.reload();
        	        }
        	        else
        	        {
                        ipanel_org.tree.reload();
                    }
                    if(timer_online_tree_ref){
                        window.clearInterval(timer_online_tree_ref);
                    }
                    timer_online_tree_ref = window.setInterval(function(){
                        var ipanel_org1 = frames['orgTree0_iframe'];
                        if(ipanel_org1.contentWindow && typeof(ipanel_org1.contentWindow.tree) == "object")
            	        {
            	            ipanel_org1.contentWindow.tree.reload();
            	        }
            	        else
            	        {
                            ipanel_org1.tree.reload();
                        }
                    }, monInterval.online*5*1000);
                }
                else{
                    self.getOrg();
                }
                
            });
			
            //show all stop comet
            $('#user_online').bind('_hide', function(){
                if(timer_online_tree_ref)
                    window.clearInterval(timer_online_tree_ref);
            });  
            //comet online
            self.tDesktop.EventManager.on('online:comet',function(){
                $('#user_online').triggerHandler('_show');
                self.getOnlineCount();
            });    
            //stop Comet
            self.tDesktop.EventManager.on('online:stopcomet',function(){
                $('#user_online').triggerHandler('_hide');
            }); 
            //online and all toggle
            $('#org_tool .btn').click(function(){
                var target = $(this).attr('user-type');
                $('#org_tool .btn').removeClass('btn-primary');
                $(this).addClass('btn-primary');
                $('.online-panel').hide();
                $('#'+target).show();
            });
        },
        getOnlineCount: function(){
            $.ajax({
                async:true,
                url: 'ipanel/user/user_count.php',
                dataType: 'text',
                success: function(data){
                    try{
                        eval(data);
                    }
                    catch(ex){
                    }
                    online_count = typeof(online_array) == 'object' ? online_array[0] : 0;
                    $(".user_online").text(online_count);
                },
                error: function (request, textStatus, errorThrown){}
            });
        },
        getOrg: function(){
            //init online
            if($("#orgTree0").html() == "")
            {
                $("#orgTree0").html('<iframe id="orgTree0_iframe" allowTransparency= "true" src="" border="0" frameborder="0" framespacing="0" marginheight="0" marginwidth="0" style="width:100%;height:98%;"></iframe>');
                $("#orgTree0 iframe").attr('src', ("/inc/user_tree.php?FROM=WebOS&TREE_ID=orgTree0&SHOW_IP=" + show_ip + "&SHOW_BUTTON=" + show_button + "&JSON_URL=" + jsonURL0));
            }
            //init all
            if($("#orgTree1").html() == "")
            {
                $("#orgTree1").html('<iframe id="orgTree1_iframe" allowTransparency= "true" src="" border="0" frameborder="0" framespacing="0" marginheight="0" marginwidth="0" style="width:100%;height:98%;"></iframe>');
                $("#orgTree1 iframe").attr('src', ("/inc/user_tree.php?FROM=WebOS&TREE_ID=orgTree1&SHOW_IP=" + show_ip + "&SHOW_BUTTON=" + show_button + "&JSON_URL=" + jsonURL1));
            }
            //$('#user_online').triggerHandler('_show');
        },
        //click org username open chat dialog
        nodeclick: function(uid, title){
            var self = this;
            var avatar = "";
            $.ajax({
                type: 'GET',
                url: '/general/userinfo.php',
                data: {'UID': uid},
                success: function(d){
                    avatar = d.data.avatar;
                    var sms = {
                        sms_id: "",
                        avatar: avatar,
                        to_id: "",
                        from_id: uid,
                        from_name: title,
                        from_type_name: "",
                        type_id: "",
                        type_name: "",
                        send_time: "",
                        unread: null,
                        content: "",
                        receive: ""
                    };
                    self.tDesktop.EventManager.trigger('msg:read', sms);
                }
            });  
        }
    };
    exports.IM = {
        init: function(c){
            this.tDesktop = c.tDesktop;
            Comet.init({tDesktop: this.tDesktop});
            MultiSend.init({tDesktop: this.tDesktop});
            Chat.init({tDesktop: this.tDesktop});
            RecentList.init({tDesktop: this.tDesktop});
            Org.init({tDesktop: this.tDesktop});
        },
        Comet: Comet,
        Chat: Chat,
        RecentList: RecentList,
        MultiSend: MultiSend,
        Org: Org
    }
});