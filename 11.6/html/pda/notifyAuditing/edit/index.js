$(document).ready(function() {
    tMobileSDK.ready(function() {  
        var toast = new Toast($("body"));
        var data = {
            l: {
                class: "",
                event: "history.back();",
                title: ""
            },
            c: {
                class: "",
                title: "��������"
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
					var detailsHtml = '<section class="ui-container notify-auditing-detail">'+
									'<div class="info-title" style="overflow:auto;"><div class="bor-bottom" style="overflow:auto;>'+
									'<span class="notify-info-title on-title"">����</span>'+
									'<span class="subject_title">'+dataInfo.subject+'</span>'+
									'</div></div>'+
									'<div class="info-title"><div class="bor-bottom">'+
									'<span class="notify-info-title on-title">������</span>'+
									'<span class="subject_title">'+dataInfo.from_name+'</span>'+
									'</div></div>';
					detailsHtml +=  '<div class="notify-info">'+
											'<div class="release-scope info-box">'+
												'<div class="notify-info-title notify-info-release-scope">������Χ</div>'+
												'<div class="scope-box bor-bottom">';
					var to_name = '';
					var user_name = '';
					var priv_name = '';
					if(dataInfo.to_name!=''){
						to_name = '<div class="scope-box-title">'+
										'<img class="scope-img" src="/pda/notifyAuditing/img/department_icon@3x.png">'+
										'<div class="scope-name">����</div>'+
										'<span class="scope-info">'+dataInfo.to_name+'</span>'+
									'</div>';
					}
					
					if(dataInfo.user_name!=''){
						user_name = '<div class="scope-box-title">'+
										'<img class="scope-img" src="/pda/notifyAuditing/img/personnel_icon@3x.png">'+
										'<div class="scope-name">��Ա</div>'+
										'<span class="scope-info">'+dataInfo.user_name+'</span>'+
									'</div>';
					}
					if(dataInfo.priv_name!=''){
						priv_name = '<div class="scope-box-title">'+
										'<img class="scope-img" src="/pda/notifyAuditing/img/role_icon@3x.png">'+
										'<div class="scope-name">��ɫ</div>'+
										'<span class="scope-info">'+dataInfo.priv_name+'</span>'+
									'</div>';
					}
					detailsHtml = detailsHtml+to_name+user_name+priv_name;	
					detailsHtml+=	'</div>'+
										'</div>'+
										'<div class="info-box info-box-time"><div class="bor-bottom">'+
											'<div class="notify-info-title notify-info-release-scope release-date" style="width:80px">����ʱ��</div>'+
											'<input type="text" value="' +dataInfo.send_time +'"readonly class="input-date-go input-date time_box" style="width:200px;"/>'+
											'<img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow">'+
										'</div></div>'+
										'<div class="info-box info-box-date"><div class="bor-bottom">'+
											'<div class="notify-info-title notify-info-release-scope release-date">��Ч����</div>'+
											'<input type="text" value="' +dataInfo.begin_date +'"readonly class="input-date-start input-date date_box"/>'+
											'<img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow">'+
										'</div></div>'+
										'<div class="info-box info-box-date"><div class="bor-bottom">'+
											'<div class="notify-info-title notify-info-release-scope release-date">��ֹ����</div>'+
											'<input type="text" value="' +dataInfo.end_date +'"readonly class="input-date-end input-date date_box"/>'+
											'<img src="/pda/officeProduct/add/img/btn_arrow-ri@3x.png" class="time-btn_arrow">'+
										'</div></div>'+
										'<div class="info-box"><div class="bor-bottom">'+
											'<div class="notify-info-title notify-info-release-scope release-date">�ö�</div>'+
											/* '<span class="release-date-info">'+dataInfo.top+'</span>'+ */
											'<label class="ui-switch" style="top:22px;">'+
												'<input type="checkbox" id="top_checked" />'+
											'</label>'+
										'</div></div>'+
										'<div class="info-box"><div class="bor-bottom">'+
											'<div class="notify-info-title notify-info-release-scope release-date">�ö�ʱ��</div>'+
											'<div class="ui-form-item ui-border-b top_int">'+
												// '<input type="number" id="top_input" autocapitalize="off" value="'+dataInfo.top_days+'">'+
												'<input type="tel" pattern="[0-9]*" id="top_input" autocapitalize="off" value="'+dataInfo.top_days+'"></input>'+
											'</div>'+
										'</div></div>'+
										'<div class="info-box"><div class="bor-bottom">'+
											'<div class="notify-info-title notify-info-release-scope release-date">��������</div>'+
											'<label class="ui-switch" style="top:22px;">'+
												'<input type="checkbox" checked="" id="sms_checked">'+
											'</label>'+
										'</div></div>'+
										'<div class="info-box"><div class="bor-bottom">'+
											'<div class="notify-info-title notify-info-release-scope release-date">������ҵ����</div>'+
											'<label class="ui-switch" style="top:22px;">'+
												'<input type="checkbox" checked="" id="sms_remind_checked">'+
											'</label>'+
										'</div></div>'+
									'</div>';
					var apply_info = '</section><div id="handleDiv"><div class="reject">ȡ��</div><div class="pass clearfix">ȷ��</div></div>';
	
					detailsHtml = detailsHtml+apply_info;	
	
					$('body').append(detailsHtml);
					
					var changeTop = function(){
						if(!$('#top_checked').attr('checked')){
							$('#top_input').attr('disabled',true).css('color','#333');
							
						}else{
							$('#top_input').removeAttr('disabled').css('color','#000');
						}
					}
					changeTop();
					$('body').on('touchend', function(el) {
						if(el.target.tagName != 'INPUT') {
							$('input').blur()
						}
					})
					
					$('#top_checked').on('change',function(){
						changeTop();
					})
					

					if(dataInfo.top=='1'){
						$('#top_checked').attr('checked','true');
					}
					if(dataInfo.check_sms=='1'){
						$('#sms_checked').attr('checked','true');
					}
					if(dataInfo.check_sns_remind=='1'){
						$('#sms_remind_checked').attr('checked','true');
					}
					var el = $('.notify-auditing-detail');
					$('#handleDiv').find(".pass").tap(function() {
						if($('.input-date-start').val()==''){
							tip('��������Ч����');
							return;
						}
						if($('.input-date-end').val()!=''){
							if ($('.input-date-end').val() < $('.input-date-start').val()) {
								tip("����ȷ������Ч���ں���ֹ����");
								return false;
							}
						}
						
						var params = {
							ATYPE:'approval',
							IS_APPROVE:1,
							NOTIFY_ID:getQueryString('id'),
							SEND_TIME:$('.input-date-go').val(),
							BEGIN_DATE:$('.input-date-start').val(),
							END_DATE:$('.input-date-end').val(),
							TOP:$('#top_checked').prop('checked')==true?'1':'0',
							TOP_DAYS:$('#top_input').val()==''?'0':$('#top_input').val(),
							CHECK_SMS:$('#sms_checked').prop('checked')==true?'1':'0',
							CHECK_SNS_REMIND:$('#sms_remind_checked').prop('checked')==true?'1':'0'
						};

						$.ajax({
							url:'/pda/notifyAuditing/data.php',
							data:params,
							success:function(res){
								res = JSON.parse(res);
								if(res.status==1){
									location.href = '/pda/notifyAuditing/';
								}
							}
						})
						
					});
					$('#handleDiv').find(".reject").tap(function() {
						history.back();
					});
					el.find(".date_box").each(function(index, item) {
						var defaultValue = "";
						var inputDateDom = $(this).find(".input-date");
						var dateType = "";
						if (inputDateDom.hasClass("input-date-start")) {
							dateType = "startTime";
							defaultValue = dataInfo.begin_date;
						}
						if (inputDateDom.hasClass("input-date-end")) {
							dateType = "endTime";
							defaultValue = dataInfo.end_date;
						}

						$(item)
							.mobiscroll()
							.date({
								theme: "ios7",
								display: "bottom",
								lang: "zh",
								mode: "scroller",
								dateFormat:"yyyy-mm-dd",
								dateOrder:'yyyymmdd',
								endYear: 3000,
								clearText:'���',
								buttons:['set', 'cancel','clear'],
								onShow: function(
									html,
									valueText,
									inst
								) {
									setTimeout(function() {
										$(".dwbg").css({
											top: "auto",
											bottom: 0
										});
									});
								},
								defaultValue: defaultValue
									? new Date(defaultValue)
									: new Date(),
								onSelect: function(valueText, inst) {
									//ѡ��ʱ�¼������ȷ���󣩣�valueText Ϊѡ���ʱ�䣬
									inputDateDom.attr(
										"value",
										valueText
									);
									
								},
								onClose:function(){
									if(dateType == "endTime"){
										inputDateDom.attr(
											"value",
											''
										);
									}
									
								}
							});
					});
					el.find(".time_box").each(function(index, item) {
						var defaultValue = "";
						var inputDateDom = $(this).find(".input-date");
						var dateType = "";
						if(inputDateDom.hasClass("input-date-go")){
							/* dateType = "goTime"; */
							defaultValue = dataInfo.send_time;
							defaultValue = defaultValue.replace(/-/g, '/');
						}
						$(item)
							.mobiscroll()
							.datetime({
								theme: "ios7",
								display: "bottom",
								lang: "zh",
								mode: "scroller",
								//preset : 'datetime', //����:�� �� �� ʱ ��
								//stepMinute: 15,
								//yearText: '��',
								//monthText: '��',
								timeFormat: 'HH:ii:ss',
								dateFormat: 'yyyy-mm-dd',
								timeOrder: 'HHiiss',
								timeWheels: 'HHiiss',
								dateOrder:'yyyymmdd',
								endYear: 3000,
								onShow: function(
									html,
									valueText,
									inst
								) {
									setTimeout(function() {
										$(".dwbg").css({
											top: "auto",
											bottom: 0
										});
									});
								},
								defaultValue: defaultValue
									? new Date(defaultValue)
									: new Date(),
								onSelect: function(valueText, inst) {
									//ѡ��ʱ�¼������ȷ���󣩣�valueText Ϊѡ���ʱ�䣬
									inputDateDom.attr(
										"value",
										valueText
									);
									
								}
							});
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