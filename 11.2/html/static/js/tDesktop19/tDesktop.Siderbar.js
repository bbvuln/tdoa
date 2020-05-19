define('tDesktop19/tDesktop.Siderbar',function(require, exports, module){
    var $ = window.jQuery;
    var Siderbar = {
        init: function(){
            this.bindEvent();
        },
        bindEvent: function(){
            var self = this;
			//菜单、组织、消息
			$('#siderbar').delegate(".siderbar-nav-item","click",function(){
				var id = $(this).attr("data-id");
				$(".siderbar-nav-item").removeClass("actived");
				$(this).addClass("actived");
				$(".west-item").removeClass("active");
				$("#"+id).addClass("active");
				if($(".siderbar-options-wrap.on").size()>=1){
					self.closeOptWrap();
				}
				if($('body').hasClass("left-mini")){
					$('#handlebar i').attr("class","iconfont icon-handlebar");
					$('#handlebar i').attr("data-type","close");
					$('body').removeClass("left-mini");
					$("#west").show();
					$('#handlebar').css("left","268px");
					$('#funcbar,#center').css("left","276px");
				}		
			});
			//工作台
			$('#siderbar').delegate("#workbenchset","click",function(){
				var $target = $(this).find("#workbenchWrap");
				if($(".siderbar-options-wrap.on").size()>=1){
					self.closeOptWrap();
				}else{
					if($target.hasClass("on")){
						$target.attr("class","siderbar-options-wrap");
						$("#workbenchWrap").hide();
					}else{
						$target.attr("class","siderbar-options-wrap on");
						$("#workbenchWrap ul").empty();
						self.getWorklist();
						$("#workbenchWrap").show();
					}
				}
			});
			//工作台管理
			$('#workbenchWrap').delegate(".workbench-setting-icon","click",function(e){
				var url = window.location.origin+'/portal/views/workbench/';
				createTab && createTab('workbench',woorkbenchManage,url,'');
			});
			//工作台详情
			$('.workbench-wrap').delegate("li","click",function(e){
				var id = $(this).attr("data-id"),
					name = $(this).text(),
					url = window.location.origin + '/portal/views/handle/index.php?#/workbench/' + id;
				createTab && createTab('my-workbench' + id, name, url, '');
			});
			// 任务中心
			$('#siderbar').delegate("#task","click",function(){
				window.createTab('taskcenter', td_lang.general.project.msg_3, 'task_center', false);
			});
			// 下载中心
			$('#siderbar').delegate("#download","click",function(){
				var $target = $(this).find("#downloadWrap");
				if($(".siderbar-options-wrap.on").size()>=1){
					self.closeOptWrap();
				}else{
					if($target.hasClass("on")){
						$target.attr("class","siderbar-options-wrap");
						$("#downloadWrap").hide();
					}else{
						$target.attr("class","siderbar-options-wrap on");
						$("#downloadWrap").show();
					}
				}
			});
			
			//侧栏选项显隐
			$(".siderbar-options-btn i").click(function(){
				var type = $(this).attr("data-type");
				if($(".siderbar-options-wrap.on").size()>=1){
					self.closeOptWrap();
				}else{
					if(type=="close"){
						$(".siderbar-options-btn i").attr("class","iconfont icon-opt-open");
						$(".siderbar-options-btn i").attr("data-type","open");
					}else{
						$(".siderbar-options-btn i").attr("class","iconfont icon-opt-close");
						$(".siderbar-options-btn i").attr("data-type","close");
					}
					$(".siderbar-list").toggle();
				}
			})
        },
		closeOptWrap:function(){
			$(".siderbar-options-wrap.on").each(function(){
				$(this).removeClass("on").hide();
			});
		},
		//获取工作台数据
        getWorklist: function(){
            $.ajax({
				url: '/general/appbuilder/web/portal/workbench/getworklist',
				type: 'get',
                success: function(response) {
					var data=response.data;
					if(data.length>0){
						for(var i=0;i<data.length;i++){
							$("#workbenchWrap ul").append('<li data-id="'+ data[i].id+'">'+ data[i].name + '</li>');
						} 
				   }else{
					   $("#workbenchWrap ul").append('<p>暂无内容</p>');
				   }
                }
            });
        }
		
    };
    exports.Siderbar = Siderbar;
});