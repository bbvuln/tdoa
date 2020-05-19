define('tDesktop19/tDesktop.Layout',function(require, exports, module){
    var $ = window.jQuery;
    var Layout = Backbone.View.extend({
        el: 'body',
        events: {
            'click a.west-handle': 'leftHandle',
            'click a.east-handle': 'rightHandle',
            'click #funcmenu_switcher': 'toggleMenu'
        },
        initialize: function(c){
            _.bindAll(this, 'leftHandle', 'rightHandle', 'toggleMenu');
            this.initEastPanel();
			this.initRegPanel();
            this.tDesktop = c.tDesktop;
            //get menu status from localStorage
            if(localStorage.open_menu == 'open-menu') {
                $(this.el).addClass('open-menu');
                $('.funcmenu_switcher').addClass('active');
            } else {
                $(this.el).removeClass('open-menu');
                $('.funcmenu_switcher').removeClass('active');
            }
            if(localStorage.left_mini == 'left-mini') {
                $(this.el).addClass('left-mini');
            } else {
                $(this.el).removeClass('left-mini');
            }
        },
		initRegPanel:function(){
			if( $('#hero_bar').length > 0){
				$('#east,#west,#center').css('bottom','61px');
			}else{
				$('#east,#west,#center').css('bottom','0');
			}
		},
        leftHandle: function(){
            $(this.el).toggleClass('left-mini');
            if(window.localStorage || typeof window.localStorage != 'undefined'){
                if(localStorage.left_mini == '' || localStorage.left_mini == undefined) {
                    localStorage.left_mini = 'left-mini';
                } else {
                    localStorage.left_mini = '';
                }
            }
        },
        rightHandle: function(){
            $(this.el).toggleClass('right-mini');
            $('#eastbar').toggleClass('on');
        },
        toggleMenu: function(){
            $(this.el).toggleClass('open-menu');
            $('.funcmenu_switcher').toggleClass('active');
            if(window.localStorage || typeof window.localStorage != 'undefined'){
                if(localStorage.open_menu == '' || localStorage.open_menu == undefined) {
                    localStorage.open_menu = 'open-menu';
                } else {
                    localStorage.open_menu = '';
                }
            }
        },
        initEastPanel: function(){
            var self = this;
            $('.js-inOrg').click(function(){
                $('#eastbar').addClass('on');
                $('body').addClass('right-mini');
                $('.nav-pill').removeClass('active');
                $('.tab-pane').removeClass('active');
                $('[panelType="org"]').addClass('active');
                $('.pane-org').addClass('active');
                self.tDesktop19.EventManager.trigger('online:comet');
            });
            $('.js-inNocbox').click(function(){
                $('#eastbar').addClass('on');
                $('body').addClass('right-mini');
                $('.nav-pill').removeClass('active');
                $('.tab-pane').removeClass('active');
                $('[panelType="msg"]').addClass('active');
                $('.pane-msg').addClass('active');
                $(".msg-tool .btn").removeClass("btn-primary");
                $('[msg-panel="nocbox"]').addClass("btn-primary");
                $(".msg-panel").removeClass("active");
                $("#nocbox").addClass("active");
                self.tDesktop19.EventManager.trigger('online:stopcomet');
            });
            $('.js-inWeixun').click(function(){
                $('#eastbar').addClass('on');
                $('body').addClass('right-mini');
                $('.nav-pill').removeClass('active');
                $('.tab-pane').removeClass('active');
                $('[panelType="msg"]').addClass('active');
                $('.pane-msg').addClass('active');
                $(".msg-tool .btn").removeClass("btn-primary");
                $('[msg-panel="weixun"]').addClass("btn-primary");
                $(".msg-panel").removeClass("active");
                $("#weixun").addClass("active");
            });
            $('.nav-pill').click(function(){
                $('.nav-pill').removeClass('active');
                $('.tab-pane').removeClass('active');
                $(this).addClass('active');
                var target = $(this).attr('panelType');
                $('.pane-'+target).addClass('active');
                if(target == "org"){
                    //comet online
                    self.tDesktop19.EventManager.trigger('online:comet');
                }
                else{
                    //stop comet
                    self.tDesktop19.EventManager.trigger('online:stopcomet');
                }
            });    
            //toggle noc and sms
            $("#msg-tool .btn").click(function(){
                $(".msg-tool .btn").removeClass("btn-primary");
                $(this).addClass("btn-primary");
                var target = $(this).attr("msg-panel");
                $(".msg-panel").removeClass("active");
                $("#"+target).addClass("active");
				if(target=="nocbox" && tDesktop19.isTouchDevice()){
					tDesktop19.EventManager.trigger('iscroller:refresh','new_noc_list_wrapper');
				}
            }); 
        }
    });
    exports.Layout = Layout;
});
