var cometUpload = null;
(function($){
    $(document).ready(function(){
		
        var Safedoc = {
            uploader: null,
            init: function(){
                this.bindEvent();
                this.initUpload();
				this.getModule();//获取菜单
				//默认选中“模块” 
				$("#operatemenu").hide();
				window.count = 0;
            },
			
			// 导航绑定点击事件
            bindEvent: function(){
				var self = this;
                var $uploader = $("#inuploader"),
                    $safe_modules = $(".safe_modules");
					$safe_modules.delegate("a", "click", function(){
                    var $this = $(this);
                    $safe_modules.find("a").removeClass("active");
                    $this.addClass("active");
                    var sortid = $this.attr("sortid");
                    var typeid = $this.parents(".safe_modules").attr("id");
					self.DocList(typeid,sortid);
                })
				
				//模块和自定义切换
                $("body").delegate('#togglemenu .btn','click',function(){
                    var active = $(this).attr("target");
                    $("#togglemenu .btn").removeClass("btn-primary");
                    $(this).addClass("btn-primary");
                    $(".safe_modules").removeClass("active");
                    $("#"+active).addClass("active");
					if( active == "safe_menu"){
						$("#operatemenu").hide();
						$(".safe_modules li a").removeClass("active");
						$("#safe_menu li:first a").addClass("active");
						$("#toUploadModal").attr("disabled",false);
						var sortid = $("#safe_menu li:first a").attr("sortid");
						var typeid = $(".safe_modules.active").attr("id");
						self.DocList(typeid,sortid);
					}else{
						$("#operatemenu").show();
						self.NavList();
					}
                });
				
				//修补插件点击选择按钮后无效果bug
				$('body').delegate('#uploadModal','click',function(){
					$(window).resize();
				});
				$('body').delegate('#toUploadModal', 'click', function(){
					self.initUpload()
				});
				
				//新建安全文档目录
				$('#createModal').delegate('#create_ok','click',function(){
					var sort_no = $('#createNumber').val();
					var sort_name = $('#createName').val();
					if($('#createNumber').val() == "" || $('#createName').val() == ""){
						alert('序号和名称不可以为空！');
						return false;
					}else if(isNaN(sort_no)||sort_no<=0||!(/^\d+$/.test(sort_no))){
						alert('序号只允许输入正整数！');
					}else{
						$.ajax({
							type:'get',
							url:'safe.function.php',
							async: true,
							data:{
								action:'add_contents',
								sort_no :sort_no ,
								sort_name:sort_name
							},
							success:function(data){
								if(data == "ok"){
									$("#createModal").data("modal").hide();
									$("#layout").hide();
									$("#toUploadModal").attr("disabled",false);
									$('#createNumber,#createName').val("");
									self.NavList();
									
								}else{
									alert("安全文档目录已存在！");
								}
								return false;
							},
							error:function(){
								alert("新建安全文档目录失败！");
							}
						});
					}
					return false;
				});
				
				//修改安全文档目录
				$('body').delegate('#alter-group','click',function(){
					$("#alterModal").show();
					var sort_no = $("#safe_modules").find("a.active").attr("sortno");
					var oldName = $("#safe_modules").find("a.active").text();
					$('#alterNumber').val(sort_no);
					$('#alterName').val(oldName);			
                });
				
				//修改文档名称
				$(".modal-footer").delegate("#alter_ok","click",function(){
					var sort_id = $("#safe_modules").find("a.active").attr("sortid");
					var sort_no = $('#alterNumber').val();
					var sort_name = $('#alterName').val();
					if($('#sort_no').val() == "" || $('#sort_name').val() == ""){
						alert('序号和名称不可以为空！');
						return false;
					}else if(isNaN(sort_no)||sort_no <= 0 || !(/^\d+$/.test(sort_no))){
						alert('序号只允许输入正整数！');
					}else{
						$.ajax({
							type:'get',
							url:'safe.function.php',
							async: true,
							data:{
								action:'up_contents',
								sort_id:sort_id ,
								sort_no:sort_no ,
								sort_name:sort_name
							},
							success:function(data){
								if(data == "ok"){
									//$("#alterModal,.modal-backdrop").hide();
									$("#alterModal").data('modal').hide();
									self.NavList(sort_id);
								}else{
									alert('修改安全文档目录失败！');
									self.NavList(sort_id);
								}
								return false;
							},
							error:function(){
								alert("修改安全文档失败！");
								return false;
							}
						});	
					}
				});	
				
				//删除安全文档目录
				$('#delete-group').click(function(){
					if(confirm('是否删除该目录？'))
					{
						var sort_id = $('#safe_modules li a.active').attr('sortId');
						var sort_name = $('#safe_modules li a.active').text();
					   $.ajax({
							type:'get',
							url:'safe.function.php',
							async: true,
							data:{
								action:'del_contents',
								sort_id :sort_id ,
								sort_name:sort_name
							},
							success:function(data){
								if(data == "ok"){
									$('#safe_modules li a.active').parents("li").remove();
									var navlist = $('#safe_modules li');
									if(navlist.length>0){
										$('#safe_modules li:first a').addClass("active");
									}else{
										$("#toUploadModal").attr("disabled","disabled");
										$(".dropdown-toggle,#tip,.sd_content").hide();
										alert("没有自定义目录，请新建目录！")
										return false;
									}
								}else{
									alert("目录下有文档不可以删除该目录!");
								}
								return false;
							},
							error:function(){
								alert("删除失败!");
								return false;
							}
						});
					}
					else
					{
					   return false;
					}
				});
				
				//删除安全文档
				$('body').delegate('.operate-delete','click',function(){
					
					if(confirm('是否删除该文件？')){
						var target = $(this);
						var file_id = target.attr('fileid');	
						$.ajax({
							type: 'get',
							url: 'safe.function.php',
							data: {
								action:'edit_file',
								file_id:file_id
							},
							success:function(data){
								target.parents("tr").remove();
								if($('.sd_file_list tr').length <= 1){
									$("#tip").show();
								}else{
									return false;
								}
							}, 
							error:function(){
								alert("文件删除操作失败");
							}
						});
					}else{
						return false;
					}
				});
				
				//打开转换成功的文档
				$('body').delegate(".convert-open","click",function(){
					var url = $(this).attr("data-url");
					window.open(url);
				});
				
				//上传弹框的按钮
				$('#uploader_close').click(function(){
					$("#uploadModal").data('modal').hide()
				});
				$('#uploader_ok').click(function(){
					$("#uploadModal").data('modal').hide()
				});
				
				//转换文档
				$('body').delegate('.operate-convert','click',function(){
					var target = $(this);
					var file_id = $(this).attr('fileid');	
					var notIE = 0;
					if(!(/msie/ig.test(navigator.userAgent))){
						alert("请在IE浏览器下转换文件！");
					}else{
						$('#convertModal,#layout').show();
						$.ajax({
							type: 'get',
							url: 'safe.function.php',
							data: {
								action:'convert',
								file_id:file_id
							},
							success:function(data){
								cometUpload = window.setInterval(function(file){
									self.listenUploader(file_id);
								}, 5000);
								return false;
							},
							error:function(){
								alert("文件转换失败！");
							}
						});
					}
					return false;
				});
				
				//搜索
				$('body').delegate('#search-btn','click',function(){
					var keyword = $('#search-content').val();
					var typeid = $(".safe_modules.active").attr("id");
					var sortid = $(".safe_modules li a.active").attr("sortid");	
					if ( $('#search-content').val() == ""){
						self.DocList(typeid,sortid);
					}else{
						$.ajax({
							type: 'get',
							url: 'safe.function.php',
							data: {
								action: 'file_list',
								typeid: typeid,
								sort_id: sortid,
								keyword: keyword
							},
							success:function(data){
								d = JSON.parse(data);
								
								if(d.length > 0){
									$('.sd_file_list tbody').remove();
									$.each(d, function(index){
										if( parseInt(d[index].status)== 1){
											$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name　+　'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span><a href="javascript:;" data-url="'+ d[index].url+'" class="convert-open">打开</a></span><span><a href="javascript:;" fileid="' + d[index].file_id +'"class="operate-delete">删除</a></span></td></tr>')
										}else{
											$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name　+　'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span ><a href="javascript:;" fileid="' + d[index].file_id +'" class="operate-convert" data-toggle="modal"  data-target="#convertModal" id="convert-modal">转换</a></span><span><a href="javascript:;" fileid="' + d[index].file_id +'"  class="operate-delete">删除</a></span></td></tr>')
										}
									})
								}else{
									$('.sd_file_list tbody').remove();
									alert("没有带关键字的文件！");
									return false;
								}
							},
							error:function(){
								alert("安全文档列表失败！");
							}
						});
					}	
				});
            },
			
			// 上传文件
            initUpload: function(){
                var self = this;
				if(self.uploader){
					return;
				}
                self.uploader = new WebUploader.Uploader({
                    resize: false,
                    auto: true,
					duplicate: true,
                    swf: '/static/js/webuploader/Uploader.swf',
                    server: '/module/upload/upload.php?module=safedoc',
                    pick: {
						id:'#picker',
						multiple: false
					},
					accept:{
						title: 'Applications',
						extensions: 'doc,docx,pdf,txt',
						mimeTypes: 'application/pdf, application/msword'
					} 
                });
				
                self.uploader.on( 'fileQueued', function( file ) {
                    self.addFile(file);
					$('#onload,#layout').show();
					$('#picker').addClass("uplaoder-hide");
					$('#uploader_ok,#uploader_close').attr({"disabled":"disabled"});
                });
                self.uploader.on( 'uploadProgress', function( file, percentage ) {
                    var $li = $( '#'+file.id ),
                        $percent = $li.find('.progress .bar');
						$('#onload').css("display","block");
						$('#uploader_ok,#uploader_close').attr({"disabled":"disabled"});
						$('#picker').addClass("uplaoder-hide");
                    // 避免重复创建
                    if ( !$percent.length ) {
                        $percent = $('<div class="progress progress-striped active">' +
                          '<div class="bar" role="progressbar" style="width: 0%">' +
                          '</div>' +
                        '</div>').appendTo( $li ).find('.bar');
                    }
                    $percent.css( 'width', percentage * 100 + '%' );
                    
                });
                self.uploader.on( 'uploadSuccess', function( file ) {
                    var dataid = file.id;
                    $( '#'+file.id +" .filename").text(file.name);
                    // console.log(this,arguments);
                    //上传成功根据扩展名显示对应图标
                    $( '#'+file.id +" .fileid").val(arguments[1].id);
                    var filename = file.name;
                    var typeid = $(".safe_modules.active").attr("id");
                    var sortid = $(".safe_modules.active li a.active").attr("sortid");
					var fileid = $( '#'+dataid +" .fileid").val();
					self.submitFile(fileid,filename,typeid,sortid);
					$('#picker').addClass("uplaoder-hide");
					$('#onload').show();
					$('#uploader_ok,#uploader_close').attr({"disabled":"disabled"});
                });
                self.uploader.on( 'uploadComplete', function( file ) {
					//console.log(this,arguments);
                    $( '#'+file.id ).find('.progress').fadeOut();
					var typeid = $(".safe_modules.active").attr("id");
                    var sortid = $(".safe_modules.active li a.active").attr("sortid");
					self.DocList(typeid,sortid);
					$("#uploadModal").data('modal').hide()
					$('#convertModal').show();
                });
            },
			
            addFile: function(file){
                var self = this,
                $list = $('#uploadlist');
                $list.append( '<div id="' + file.id + '" class="item" title="' + file.name +'">' +
                    '<span class="filename">'+ file.name +'</span><input type="hidden" class="fileid" /><div class="close"></div>' +
                '</div>' );
                //this本地信息，arguments为server返回的信息
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
            },
			
			//提交上传的文件
			submitFile:function(id, name,typeid,sortid){
				var self = this;
				$.ajax({
					type: 'get',
					url: 'safe.function.php',
					data: {
						action:'safe',
						fileid:id,
						filename:name,
						typeid: typeid,
						sortid: sortid
					},
					success:function(data){
							cometUpload = window.setInterval(function(file){
								self.listenUploader(data);
							}, 5000);
					},
					error:function(){
						alert("上传文件失败！");
					}
				});
			},
			
			//监听上传文件转换
			listenUploader:function(fileid){
				count = count + 1;
				var self = this;
				$.ajax({
					type: 'get',
					url: 'safe.function.php',
					data: {
						action:'listen',
						file_id: fileid
					},
					success:function(data){ 
						if(data == 0){	
							if( count >= 4){
								window.clearInterval(cometUpload);
								$('#convertModal').hide();
								alert("转换请求超时！");
								$('#uploader_ok,#uploader_close').attr({"disabled":"disabled"});
								$('#convertModal,#layout').hide();
								count = 0;
							}else{
								return false;
							}	
							window.clearInterval(cometUpload);
						}else if(data == 1){
							window.clearInterval(cometUpload);
							$('#convertModal').hide();
							alert("文件转换成功!");
							$('#uploadModal').data("modal").hide();
							$('#layout').hide();
							var sortid = $(".safe_modules.active").find("a.active").attr("sortid");
							var typeid = $(".safe_modules.active").find("a.active").parents(".safe_modules").attr("id");
							self.DocList(typeid,sortid);
							
						}else if(data == 2){
							$('#convertModal').hide();
							alert("文件转换失败！");
							$('#uploadModal').data("modal").hide();
							$('#layout').hide();
							window.clearInterval(cometUpload);
						}
						window.clearInterval(cometUpload);
						$('#uploadlist').empty();
						$('#onload').hide();
						$('#uploader_ok,#uploader_close').attr("disabled",false);
						$('#picker').removeClass("uplaoder-hide");
						return false;
					},
					error:function(){
						alert("文件转换失败！");
						window.clearInterval(cometUpload);
					}
				});
			},
			
			//获取模块菜单
			getModule: function(){
				var self = this; 
			    $('#safe_menu').empty();
				$.ajax({
					type: 'get',
					url: 'safe.function.php',
					data: {
						action:'get_attmodule'
					},
					success:function(data){
						d = JSON.parse(data);
						$.each(d, function(k,v){
							$('#safe_menu').append('<li><a href="javascript:;" sortid="' + v.MODULE_ID + '"><i class="menu-icon"></i>' + v.MODULE_NAME + '</a></li>');
						});
						$('#safe_menu li:first a').addClass('active');
						var typeid = $(".safe_modules.active").attr("id");
						var sortid = $(".safe_modules li a.active").attr("sortid");		
						self.DocList(typeid,sortid);//获取文件列表
						// self.search(typeid,sortid);
					},
					error:function(){
						alert("加载安全文档导航列表失败！");
					}
				});
			},
			
			// 获取自定义安全文档导航列表
			NavList:function(sort_id){ 
				var self = this;
				$('#safe_modules li').remove();			
				$.ajax({
					type: 'get',
					url: 'safe.function.php',
					data: {
						action:'get_contents'
					},
					success:function(data){
						d = JSON.parse(data);
						if(d.length > 0){
							$('.dropdown-toggle,.sd_content').show();
							$.each(d,function(k,v){	
								$('#safe_modules').append('<li><a href="javascript:;" sortid="' + v.sort_id + '" sortno="' + v.sort_no + '"><i class="menu-icon"></i>' + v.sort_name + '</a></li>');
							});
							$('#safe_modules li:first a').addClass('active');
							var typeid = $(".safe_modules.active").attr("id");
							var sortid = $(".safe_modules li a.active").attr("sortid");		
							self.DocList(typeid,sortid);
						}else if(d.length<=0){
							$('.dropdown-toggle,.sd_content,#tip').hide();
							$('#toUploadModal').attr("disabled","disabled");
							alert("没有自定义目录，请新建目录！")
						}
						return false;
					},
					error:function(){
						alert("加载安全文档导航列表失败！");
					}
				});
			},
			
			// 安全文档目录子列表
			DocList:function(typeid,sortid){
				var self = this;
				$.ajax({
					type: 'get',
					url: 'safe.function.php',
					data: {
						action: 'file_list',
						typeid: typeid,
						sort_id: sortid
					},
					success:function(data){
						d = JSON.parse(data);
						if(d.length > 0){
							$('.sd_content').show();
							$('.sd_file_list tbody').remove();
							$('#tip').hide();
							$.each(d, function(index){
								if( parseInt(d[index].status)== 1){
									$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name　+　'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span><a href="javascript:;" data-url="'+ d[index].url+'" class="convert-open">打开</a></span><span ><a href="javascript:;" fileid="' + d[index].file_id +'"  class="operate-delete">删除</a></span></td></tr>')
								}else{
									$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name　+　'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span><a href="javascript:;" fileid="' + d[index].file_id +'" class="operate-convert" data-toggle="modal"  data-target="#convertModal" id="convert-modal">转换</a></span><span><a href="javascript:;" fileid="' + d[index].file_id +'"  class="operate-delete">删除</a></span></td></tr>')
								}
							});
							
						}else{
							$('.sd_file_list tbody').remove();
							$('#tip').show();
						}
						
					},
					error:function(){
						alert("安全文档列表失败！");
					}
				});
			}

        };
        window.Safedoc = Safedoc;
        Safedoc.init();
    });     
})(jQuery);