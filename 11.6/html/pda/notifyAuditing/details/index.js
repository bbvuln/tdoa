$(document).ready(function() {
    tMobileSDK.ready(function() {
        var toast = new Toast($("body"));
        var data = {
            l: {
                class: "",
                event: "location.href = '/pda/notifyAuditing/index.php?type=approval';",
                title: ""
            },
            c: {
                class: "",
                title: "审批详情"
            },
            r: {
                show: false
            }
        };
        tMobileSDK.buildHeader(data);
		
		var getQueryString = function(name){
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
			var r = window.location.search.substr(1).match(reg); 
			if (r != null) return decodeURI(decodeURI(r[2])); return null;
		};
		function openUrl(ele){
			var url = ele.getAttribute('data-url');
			tMobileSDK.openUrl({
				url:url,
				onSuccess:'',
				onFail:function(){alert('打开失败');}
			});
		}
		window.openUrl = openUrl;
		var getDetailsInfo = function(id){
			$.ajax({
				url:'/pda/notifyAuditing/data.php',
				data:{
					ATYPE:"getContent",
					NOTIFY_ID:id
				},
				success:function(res){
					res = JSON.parse(res);
					var dataInfo = res.data;
					dataInfo.top = dataInfo.top=='0'?'否':'是';
					dataInfo.check_sms = dataInfo.check_sms=='0'?'无事务提醒':'发送事务提醒';
					dataInfo.check_sns_remind = dataInfo.check_sns_remind=='0'?'无分享':'分享到企业社区';
					dataInfo.attachment_link = dataInfo.attachment_link=='无'?'':dataInfo.attachment_link;
					var detailsHtml = '<section class="ui-container notify-auditing-detail">'+
									'<div class="info-title">'+
										'<div class="title-text">'+dataInfo.type_name+'</div>'+
										'<div class="apply-name">'+dataInfo.from_name+'</div>'+
										'<div class="apply-date">'+dataInfo.begin_date+'</div>'+
									'</div>'+
									'<div class="info">'+
									'<div class="subject" style="color:'+dataInfo.subject_color+'">'+dataInfo.subject+'</div>';
					var contentHtml = '';
					if(dataInfo.format==0){
						contentHtml = '<div style="overflow:scroll;">'+dataInfo.content+'</div>';
					}else if(dataInfo.format==2){
						if(dataInfo.content=='http://'){
							dataInfo.content = ' ';
						}
						contentHtml = '<span class="span_blue" onclick="openUrl(this)" data-url="'+dataInfo.content+'">'+dataInfo.content+'<span/>';
					}
					/* else if(){
						contentHtml = '<iframe src='+dataInfo.content+'><iframe/>';
					} */
					
										/*'<div class="subject">'+dataInfo.subject+'</div>'+
										 dataInfo.content+ 
										'<iframe src='+dataInfo.content+'><iframe/>'+*/
					detailsHtml += 	contentHtml;
									
					detailsHtml +=  dataInfo.attachment_link+
					'</div>'+
									    '<div class="notify-info">'+
											'<div class="release-scope info-box">'+
												'<div class="notify-info-title notify-info-release-scope">发布范围</div>'+
												'<div class="scope-box">';
					var to_name = '';
					var user_name = '';
					var priv_name = '';
					if(dataInfo.to_name!=''){
						to_name = '<div class="scope-box-title">'+
										'<img class="scope-img" src="/pda/notifyAuditing/img/department_icon@3x.png">'+
										'<div class="scope-name">部门</div>'+
										'<span class="scope-info">'+dataInfo.to_name+'</span>'+
									'</div>';
					}
					
					if(dataInfo.user_name!=''){
						user_name = '<div class="scope-box-title">'+
										'<img class="scope-img" src="/pda/notifyAuditing/img/personnel_icon@3x.png">'+
										'<div class="scope-name">人员</div>'+
										'<span class="scope-info">'+dataInfo.user_name+'</span>'+
									'</div>';
					}
					if(dataInfo.priv_name!=''){
						priv_name = '<div class="scope-box-title">'+
										'<img class="scope-img" src="/pda/notifyAuditing/img/role_icon@3x.png">'+
										'<div class="scope-name">角色</div>'+
										'<span class="scope-info">'+dataInfo.priv_name+'</span>'+
									'</div>';
					}
					var end_date = '';
					if(dataInfo.end_date!=''){
						end_date = '<div class="info-box">'+
										'<div class="notify-info-title notify-info-release-scope release-date">终止日期</div>'+
										'<span class="release-date-info">'+dataInfo.end_date+'</span>'+
									'</div>';
					}
					detailsHtml = detailsHtml+to_name+user_name+priv_name;	
					detailsHtml+=	'</div>'+
										'</div>'+
										'<div class="info-box">'+
											'<div class="notify-info-title notify-info-release-scope release-date">发布时间</div>'+
											'<span class="release-date-info">'+dataInfo.send_time+'</span>'+
										'</div>'+
										'<div class="info-box">'+
											'<div class="notify-info-title notify-info-release-scope release-date">生效日期</div>'+
											'<span class="release-date-info">'+dataInfo.begin_date+'</span>'+
										'</div>'+
										end_date+
										'<div class="info-box">'+
											'<div class="notify-info-title notify-info-release-scope release-date">置顶</div>'+
											'<span class="release-date-info">'+dataInfo.top+'</span>'+
										'</div>'+
										// '<div class="info-box">'+
										// 	'<div class="notify-info-title notify-info-release-scope release-date">事务提醒</div>'+
										// 	'<span class="release-date-info info-easy">'+dataInfo.check_sms+','+dataInfo.check_sns_remind+'</span>'+
										// '</div>'+
									'</div>';
					var apply_info = '';
					if(dataInfo.is_pass==0){
						apply_info = '<div class="apply-info">'+
										'<div class="apply-opinion">审批意见</div>'+
										'<div class="apply-opinion-content">'+dataInfo.reason+'</div>'+
									'</div>'+
								'</section>';
					}else{
						apply_info = '</section>';
					}
					detailsHtml = detailsHtml+apply_info;
								
								
					$('body').append(detailsHtml);
				}
				
			})
		}

		
		getDetailsInfo(getQueryString('id'));
	});
});