$(document).ready(function() {
    tMobileSDK.ready(function() {
 
        var toast = new Toast($("body"));
        var data = {
            l: {
                class: "",
                event: "location.href = '/pda/notifyAuditing/index.php?type=unapproval';",
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
		var tip = function(str) {
            toast.show(str);
            // showDialog(str);
        };
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
						contentHtml = '<div class="content_box" style="overflow:scroll;">'+dataInfo.content+'</div>';
					}else if(dataInfo.format==2){
						/* contentHtml = '<a href='+dataInfo.content+'>'+dataInfo.content+'<a/>'; */
						contentHtml = '<span class="span_blue" onclick="openUrl(this)" data-url="'+dataInfo.content+'">'+dataInfo.content+'<span/>';
					}
					
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

					var apply_info = '</section><div id="handleDiv"><div class="reject">驳回</div><div class="pass clearfix">通过</div></div>';
					
					var buttons = '<div><div class="reject">驳回</div><div class="pass clearfix">通过</div></div>';			
					detailsHtml = detailsHtml+apply_info;	
					$('body').append(detailsHtml);
					var el = $('.notify-auditing-detail');
					var detailDom ='<div class="ui-dialog"><div class="ui-dialog-cnt"><div class="ui-dialog-bd">'+
					'<h3>公告通知驳回说明</h3>'+
					'<textarea value="" type="text" placeholder="" autocapitalize="off" id="reject-value"></textarea>'+
					'</div>'+
					'<div class="ui-dialog-ft">'+
					'<button type="button" data-role="button" class="btn-cancle">取消</button>'+
					'<button type="button" data-role="button" class="btn-submit">确定</button>'+
					'</div></div></div>';
					el.append(detailDom);
					
					$('#handleDiv').find(".pass").tap(function() {
						location.href = '/pda/notifyAuditing/edit/index.php?id='+getQueryString('id');
					});
					$('#handleDiv').find(".reject").tap(function() {
						el.find(".ui-dialog").addClass("show");
					});
					
					el.find(".btn-cancle").tap(function() {
						el.find("#reject-value").val("");
						el.find(".ui-dialog").removeClass("show");
					});
					el.find(".btn-submit").tap(function() {
						var value = el.find("#reject-value").val();
						if($.trim(value)!=''){
							submitReject(getQueryString('id'),value);
						}else{
							tip('请填写驳回说明');
						}
						
					});
				}
				
			})
		}
		
		var submitReject = function(id,value){
			$.ajax({
				url:'/pda/notifyAuditing/data.php',
				data:{
					ATYPE:"approval",
					NOTIFY_ID:id,
					REASON:value,
					IS_APPROVE:0
				},
				success:function(res){
					res = JSON.parse(res);
					if(res.status==1){
						location.href = '/pda/notifyAuditing/';
					}
				}
			})
		}

		
		getDetailsInfo(getQueryString('id'));
	});
});