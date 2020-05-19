define('tDesktop/tDesktop.Notification',function(require, exports, module){
    var $ = window.jQuery;
    require('miniNotification');
    require('backbone');
    var tDesktop = window.tDesktop;
    //--------------------------------------------define Message'model-----------------------------------------------
    var Msg = Backbone.Model.extend({
        defaults: {
            id: "",//the id of the model
            mid: "",
            name: "",//the name of the message sender
            module: "",//the type of the model
            title: "",
            msg: "",//the content of the model
            num: 1,//the count of the model
            closable: true,//is the model closable
            autoClose: true
        },
        //items: [],//store the items of the msg
        initialize: function(item) {//initialize the model if necessary
            //init code goes here
            this.items = [];
            this.addItem(item);
        },
        addItem: function(item){
            var allKeys = [];
            $.each(this.items,function(index,_item){
                allKeys.push(_item.key);
            })
            if($.inArray(item.key,allKeys) === -1){
                this.items.push(item); 
                this.set({
                    title: item.title,
                    mid: item.mid,
                    msg: item.msg,
                    num: this.size(),
                    url: item.url
                }); 
            }  
        },
        removeLastItem: function(){
            this.items.pop();
            var last = this.getLastItem(); 
            if(last){
                this.set({
                    title: last.title,
                    mid: last.mid,
                    msg: last.msg,
                    num: this.size(),
                    url: last.url
                }); 
            }else{
                this.destroy();
            }  
        },
        getLastItem: function(){
            return _.last(this.items);
        },
        size: function(){
            return this.items.length;
        },
        getData: function(){
            return $({}, this.getLastItem(), { num: this.size() });
        },
        sync: function(){
            //console.log(this, arguments);
        }
    });


    //-------------------------------------------define Message's collection-------------------------------------------
    var MsgList = Backbone.Collection.extend({
        model: Msg,
        url: 'index.php',
        addItem: function(item){
            var self = this,
                model = this.findWhere({id: item.id});   
            if(model){
                model.addItem(item);
            }else{
                this.add(item);

                item.autoClose && setTimeout((function(id){
                    return function(){
                        var item = self.findWhere({id: id});
                        item && item.destroy();
                        calculateItemPosition();
                    }
                })(item.id), 6000);
            }

        },
        removeGroup: function(id){
            var models = this.where({ id: id });
            this.remove(models);return;
            models.each(function(model){
                model.unset();
            });
        },
        clear: function(noagain){
            var self = this;
            this.each(function(model){
                model.destroy();
            });
            //strange bug,when clear, surplus one msg temporary deal like this by jx
            // !noagain && setTimeout(function(){ self.clear(1) }, 100);
        }
    });

    //init one msg list
    var msgs = new MsgList;
    window.msgs = msgs;
    //--------------------------------------------定义Message的单个View----------------------------------------------------
    var MsgView = Backbone.View.extend({
        tagName: "li",

        //temp function
        template: $("#item-template").template(),

        //bind delegate click
        events: {
            "click .msg-close": "destroy",
            "click": "clickHandle",
            "click .ignore-this": "destroy",
            "click .ignore-all": "ignoreAllMessage",
            "click .mark-read": "markRead",
            "click .mark-all": "markAll"
        },

        initialize: function() {
            var self = this;
            
            //make sure functions are called in the right scope
            _.bindAll(this, 'render','remove');

            //listen to model changes
            this.model.bind('change',this.render);
            this.model.bind('destroy',this.remove);
//            tDesktop.EventManager.on('msg:read', function(sms){
//                //var targetmodel = msgs.where({module: "sms",id: sms.from_id});
//                //console.log(targetmodel);
//            });

        },

        render: function() {
            //update el with stored template
            var data = this.model.toJSON();
                
            var element = jQuery.tmpl(this.template, data);
            $(this.el).html(element);
            return this;
        },

        //remove element when model is destroyed
        remove: function() {
            $(this.el).remove();
            msgs.ignoreThis && msgs.ignoreThis(this.model);
        },

        //destroy model when "li.msg-wrapper" is clicked
        destroy: function() {
            this.model.destroy();
            calculateItemPosition();
            return false;
        },
        
        clickHandle: function(){
            if(this.model.items.length <= 1) {
                this.destroy();
            }
            msgs.clickCallback && msgs.clickCallback(this.model);
            this.model.removeLastItem();
        },

        ignoreAllMessage: function() {
            msgs.ignoreAll && msgs.ignoreAll(this);
            return false;
        },

        markRead: function(){
            this.model.destroy();
            calculateItemPosition();
            msgs.readThis && msgs.readThis(this.model);
            return false;
        },

        markAll: function(){
            //msgs.ignoreAll && msgs.ignoreAll(this);
            msgs.readAll && msgs.readAll(this);
            return false;
        }
        
    });


    //---------------------------------------define the whole UI of the Plugin-------------------------------------------------------------------
    var ListView = Backbone.View.extend({
        //our app already present in the HTML
        el: $('.msg-list'),


        //at initialization, we bind to the relevant events on the "msgs" collection, when items are added or changed.
        initialize: function() {
            _.bindAll(this, 'addOne', 'addAll');
            msgs.bind('add', this.addOne);
            msgs.bind('refresh', this.addAll);
            msgs.bind('reset',this.removeAll);
        },



        //add a single msg item to the list by creating a view for it and appending its element to the <ul class"msg-list">
        addOne: function(msg) {
            var view = new MsgView({model: msg});
            $('.msg-list').prepend(view.render().el);
            //calculate the item position
            calculateItemPosition();
        },

        //add all items in the msgs collection at once
        addAll: function() {
            msgs.each(this.addOne);
        },

        removeAll: function() {
            $('.msg-list').animate({
                right: -300,
                opacity: 0
            },{
                duration: 500,
                complete: function() {
                    $('.msg-list li').remove();
                    $(this).css({
                        right: 0,
                        opacity: 1
                    })
                }
            });

        }


    });

    var calculateItemPosition = (function() {
        var timer;
        return function() {
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                _calculateItemPosition();
            }, 300);
        }
    })();

    function _calculateItemPosition() {
        //count the number of the models in the collection
        var totalHeight = $('.center').height() + parseInt(jQuery('.center').css('bottom')) - 75,
            singleHeight = $('.msg-list .msg-wrapper').outerHeight(true) || 70,
            itemCount = Math.floor(totalHeight/singleHeight),
            elBottom = totalHeight - itemCount*singleHeight,
            el = $('.msg-list');
        if(itemCount >= msgs.length) {
            elBottom = totalHeight - msgs.length * singleHeight;
            el.animate({bottom: elBottom});
            if(msgs.length <= 0) {
                el.animate({bottom: 1200});
            }
        } else {
            el.animate({bottom: (elBottom+5)});
        }
    }

    $(window).resize(calculateItemPosition);
    

    //Alert msg tip
    var Alert = function(msg,type) {
        $('#mini-notification').miniNotification({
            closeButton: true,
            closeButtonText: 'x',
            closeButtonClass:'closeMsg',
            onLoad: function() {
                $('#mini-notification .inner p').text(msg);
                $('#mini-notification').addClass(type);
            }
        });
    };

    //tDesktop EventManager bind event
    function bindEvents(tD) {
        //--------------Alert--------------
        tD.EventManager.on('alert',function(arg) {//bind show this from bottom function
            Alert(arg.content,arg.type);
        });

        //---------System Message----------
        tD.EventManager.on('message:create',function(cfg) {//bind create system msg function
            //console.log('cfg',cfg)
            var arg;
            if(cfg.type_id == 'message'){
                arg = {
                    id: cfg.type_id + '-' + cfg.from_id,
                    mid: cfg.type_id,
                    closable: true,
                    title: cfg.from_name,
                    msg: $('<div>').html(cfg.content).text(),    
                    module: 'message',
                    autoClose: false,
                    key: cfg.sms_id,
                    url: cfg.url,
                    data: cfg
                };
            }else{
                arg = {
                    id: cfg.type_id + '-' + cfg.from_id,
                    mid: cfg.type_id,
                    closable: true,
                    title: cfg.from_name,
                    autoClose: !cfg.url,
                    msg: cfg.type_name,
                    key: cfg.sms_id,
                    url: cfg.url,
                    data: cfg
                };
            }
            //received msg don't show again
            if(cfg.receive !== "1"){
                return;
            }

            if(cfg.type_id !== "message" && cfg.remind_flag !== "1"){
                return;
            }
            //arg.autoClose =1;
            msgs.addItem(arg);

        });

        tD.EventManager.on('message:remove',function(arg) {//ignore the single model 忽略单条提醒
           var sms_ids = [];
           var smsIdStr = '';
           $.each(arg.items,function(index,item) {
               sms_ids.push(item.key);
           });
           smsIdStr = sms_ids.join(",");

        });

        tD.EventManager.on('message:clear',function(arg) {
            //ignore all the models 忽略所有提醒
           var all_msgs_items = [];
           var smsIdStr = '';
           $.each(msgs.models,function(index,_msg) {
               $.each(_msg.items,function(n,item) {
                   all_msgs_items.push(item.key);
               })
           });
           smsIdStr = all_msgs_items.join(",");

            msgs.trigger('reset');
            msgs.reset();
        });

        tD.EventManager.on('message:read',function(arg) {//mark have read this message   
           var sms_ids = [];
           var smsIdStr = '';
           console.log(arg);
           $.each(arg.items,function(index,item) {
               sms_ids.push(item.key);
           });
           smsIdStr = sms_ids.join(",");

//           $.ajax({
//               type: "POST",
//               url: "status_bar/sms_submit.php",
//               data: {'SMS_ID': smsIdStr},
//               success: function(status) {
//                   tD.initNocbox();
//               }
//           })
        });

        tD.EventManager.on('message:readall',function(arg) {
            //mark all these messages have been read
           var all_sms_items = [];
           var all_msgs_items = [];
           var smsIdStr = '';
           var msgIdStr = '';
           $.each(msgs.models,function(index,_msg) {
               $.each(_msg.items,function(n,item) {
                   if(item.mid == 'message'){
                        all_msgs_items.push(item.key);
                    }else{
                        all_sms_items.push(item.key);
                        }
                   
               })
           });
           smsIdStr = all_sms_items.join(",");
           msgIdStr = all_msgs_items.join(",");
            
           tD.EventManager.trigger('nocbox:markAll',smsIdStr,msgIdStr);

           // $.ajax({
           //     type: "POST",
           //     url: "status_bar/sms_submit.php",
           //     data: {'SMS_ID': smsIdStr},
           //     success: function(status) {
           //          msgs.trigger('reset');
           //          msgs.reset();
                    
           //     }
           // })
            msgs.trigger('reset');
            msgs.reset();
        });




        msgs.clickCallback = function(model){
            var eventType = model.get('module') == 'message' ? 'msg:read' : 'notify:read';
            if(eventType == 'msg:read') {////如果是消息模块，则该条目全部移除
                model.destroy();
                calculateItemPosition();
            }
            tD.EventManager.trigger( eventType, model.getLastItem().data );
        };

        msgs.ignoreThis = function(model) {
            tD.EventManager.trigger('message:remove',model);
        };

        msgs.ignoreAll = function(view) {
            tD.EventManager.trigger('message:clear',view);
        };

        msgs.readThis = function(model) {
            tD.EventManager.trigger('message:read',model);
        };

        msgs.readAll = function(view) {
            tD.EventManager.trigger('message:readall',view);
        };
    }


    module.exports = {
        init: function(tDesktop) {
            var app = new ListView;
            bindEvents(tDesktop);
        }
    };

});