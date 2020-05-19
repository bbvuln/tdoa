var cometUpload = null;
(function($){
    $(document).ready(function(){
		
        var Safedoc = {
            uploader: null,
            init: function(){
                this.bindEvent();
                this.initUpload();
				this.getModule();//��ȡ�˵�
				//Ĭ��ѡ�С�ģ�顱 
				$("#operatemenu").hide();
				window.count = 0;
            },
			
			// �����󶨵���¼�
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
				
				//ģ����Զ����л�
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
				
				//�޲�������ѡ��ť����Ч��bug
				$('body').delegate('#uploadModal','click',function(){
					$(window).resize();
				});
				$('body').delegate('#toUploadModal', 'click', function(){
					self.initUpload()
				});
				
				//�½���ȫ�ĵ�Ŀ¼
				$('#createModal').delegate('#create_ok','click',function(){
					var sort_no = $('#createNumber').val();
					var sort_name = $('#createName').val();
					if($('#createNumber').val() == "" || $('#createName').val() == ""){
						alert('��ź����Ʋ�����Ϊ�գ�');
						return false;
					}else if(isNaN(sort_no)||sort_no<=0||!(/^\d+$/.test(sort_no))){
						alert('���ֻ����������������');
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
									alert("��ȫ�ĵ�Ŀ¼�Ѵ��ڣ�");
								}
								return false;
							},
							error:function(){
								alert("�½���ȫ�ĵ�Ŀ¼ʧ�ܣ�");
							}
						});
					}
					return false;
				});
				
				//�޸İ�ȫ�ĵ�Ŀ¼
				$('body').delegate('#alter-group','click',function(){
					$("#alterModal").show();
					var sort_no = $("#safe_modules").find("a.active").attr("sortno");
					var oldName = $("#safe_modules").find("a.active").text();
					$('#alterNumber').val(sort_no);
					$('#alterName').val(oldName);			
                });
				
				//�޸��ĵ�����
				$(".modal-footer").delegate("#alter_ok","click",function(){
					var sort_id = $("#safe_modules").find("a.active").attr("sortid");
					var sort_no = $('#alterNumber').val();
					var sort_name = $('#alterName').val();
					if($('#sort_no').val() == "" || $('#sort_name').val() == ""){
						alert('��ź����Ʋ�����Ϊ�գ�');
						return false;
					}else if(isNaN(sort_no)||sort_no <= 0 || !(/^\d+$/.test(sort_no))){
						alert('���ֻ����������������');
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
									alert('�޸İ�ȫ�ĵ�Ŀ¼ʧ�ܣ�');
									self.NavList(sort_id);
								}
								return false;
							},
							error:function(){
								alert("�޸İ�ȫ�ĵ�ʧ�ܣ�");
								return false;
							}
						});	
					}
				});	
				
				//ɾ����ȫ�ĵ�Ŀ¼
				$('#delete-group').click(function(){
					if(confirm('�Ƿ�ɾ����Ŀ¼��'))
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
										alert("û���Զ���Ŀ¼�����½�Ŀ¼��")
										return false;
									}
								}else{
									alert("Ŀ¼�����ĵ�������ɾ����Ŀ¼!");
								}
								return false;
							},
							error:function(){
								alert("ɾ��ʧ��!");
								return false;
							}
						});
					}
					else
					{
					   return false;
					}
				});
				
				//ɾ����ȫ�ĵ�
				$('body').delegate('.operate-delete','click',function(){
					
					if(confirm('�Ƿ�ɾ�����ļ���')){
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
								alert("�ļ�ɾ������ʧ��");
							}
						});
					}else{
						return false;
					}
				});
				
				//��ת���ɹ����ĵ�
				$('body').delegate(".convert-open","click",function(){
					var url = $(this).attr("data-url");
					window.open(url);
				});
				
				//�ϴ�����İ�ť
				$('#uploader_close').click(function(){
					$("#uploadModal").data('modal').hide()
				});
				$('#uploader_ok').click(function(){
					$("#uploadModal").data('modal').hide()
				});
				
				//ת���ĵ�
				$('body').delegate('.operate-convert','click',function(){
					var target = $(this);
					var file_id = $(this).attr('fileid');	
					var notIE = 0;
					if(!(/msie/ig.test(navigator.userAgent))){
						alert("����IE�������ת���ļ���");
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
								alert("�ļ�ת��ʧ�ܣ�");
							}
						});
					}
					return false;
				});
				
				//����
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
											$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name��+��'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span><a href="javascript:;" data-url="'+ d[index].url+'" class="convert-open">��</a></span><span><a href="javascript:;" fileid="' + d[index].file_id +'"class="operate-delete">ɾ��</a></span></td></tr>')
										}else{
											$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name��+��'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span ><a href="javascript:;" fileid="' + d[index].file_id +'" class="operate-convert" data-toggle="modal"  data-target="#convertModal" id="convert-modal">ת��</a></span><span><a href="javascript:;" fileid="' + d[index].file_id +'"  class="operate-delete">ɾ��</a></span></td></tr>')
										}
									})
								}else{
									$('.sd_file_list tbody').remove();
									alert("û�д��ؼ��ֵ��ļ���");
									return false;
								}
							},
							error:function(){
								alert("��ȫ�ĵ��б�ʧ�ܣ�");
							}
						});
					}	
				});
            },
			
			// �ϴ��ļ�
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
                    // �����ظ�����
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
                    //�ϴ��ɹ�������չ����ʾ��Ӧͼ��
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
                //this������Ϣ��argumentsΪserver���ص���Ϣ
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
			
			//�ύ�ϴ����ļ�
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
						alert("�ϴ��ļ�ʧ�ܣ�");
					}
				});
			},
			
			//�����ϴ��ļ�ת��
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
								alert("ת������ʱ��");
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
							alert("�ļ�ת���ɹ�!");
							$('#uploadModal').data("modal").hide();
							$('#layout').hide();
							var sortid = $(".safe_modules.active").find("a.active").attr("sortid");
							var typeid = $(".safe_modules.active").find("a.active").parents(".safe_modules").attr("id");
							self.DocList(typeid,sortid);
							
						}else if(data == 2){
							$('#convertModal').hide();
							alert("�ļ�ת��ʧ�ܣ�");
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
						alert("�ļ�ת��ʧ�ܣ�");
						window.clearInterval(cometUpload);
					}
				});
			},
			
			//��ȡģ��˵�
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
						self.DocList(typeid,sortid);//��ȡ�ļ��б�
						// self.search(typeid,sortid);
					},
					error:function(){
						alert("���ذ�ȫ�ĵ������б�ʧ�ܣ�");
					}
				});
			},
			
			// ��ȡ�Զ��尲ȫ�ĵ������б�
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
							alert("û���Զ���Ŀ¼�����½�Ŀ¼��")
						}
						return false;
					},
					error:function(){
						alert("���ذ�ȫ�ĵ������б�ʧ�ܣ�");
					}
				});
			},
			
			// ��ȫ�ĵ�Ŀ¼���б�
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
									$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name��+��'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span><a href="javascript:;" data-url="'+ d[index].url+'" class="convert-open">��</a></span><span ><a href="javascript:;" fileid="' + d[index].file_id +'"  class="operate-delete">ɾ��</a></span></td></tr>')
								}else{
									$('.sd_file_list').append('<tr><td><a href="javascript:;">' + d[index].attachment_name��+��'</a></td><td>' + d[index].file_size +'</td><td>'+ d[index].create_time +'</td><td ><span><a href="javascript:;" fileid="' + d[index].file_id +'" class="operate-convert" data-toggle="modal"  data-target="#convertModal" id="convert-modal">ת��</a></span><span><a href="javascript:;" fileid="' + d[index].file_id +'"  class="operate-delete">ɾ��</a></span></td></tr>')
								}
							});
							
						}else{
							$('.sd_file_list tbody').remove();
							$('#tip').show();
						}
						
					},
					error:function(){
						alert("��ȫ�ĵ��б�ʧ�ܣ�");
					}
				});
			}

        };
        window.Safedoc = Safedoc;
        Safedoc.init();
    });     
})(jQuery);