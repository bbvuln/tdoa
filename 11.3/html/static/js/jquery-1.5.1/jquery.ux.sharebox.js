(function($){
	
	var current = null;
	$.fn.sharebox = function(options)
	{
		var settings = $.extend(true, {}, $.fn.sharebox.defaults, options);
		return $(this).each(function(){
			var o = new $.sharebox($(this), settings);
			o.init();
			$(this).data('sharebox', o);
		});
	};
	
	$.sharebox = function(el, settings){
		var me = this, $sharebox = el;
		this.el = el;
		this.textarea = null;
		this.settings = settings;
		this.hiddendata = '';

		
		this.init = function() 
		{
			var modebox = "wx_"+ settings.mode + "_box";
			
			if(settings.custStyle)
				modebox+=" " + settings.custStyle;

			if(settings.mode == "repost")
				modebox+=" wx_hover";

			var overlayHtml = '<div class="inputoverlay" node-type="overlay"></div>';
			var boxWrapHtml = '<div class="wx_content_wrap"></div>';
			
			var shareHtml = '<div class="input">';
				 shareHtml += 	'<textarea class="wx_content" node-type="contentBox" tabindex="1" hidefocus>' + settings.lang.tips_default +'</textarea>';
				 shareHtml += '</div>';
			
			//share box tool
			var toolWrapHtml = '<div class="wx_tool_wrap" node-type="toolWrap"></div>';

			var toolTopicHtml =		'<a href="javascript:void(0)" hidefocus="hidefocus" class="insert_tools insert_topic" data-type="topicbox" node-type="toolBtn" title="' + settings.lang.insert_topic +'">话题</a>';

			var toolEmotionHtml =	'<a href="javascript:void(0)" hidefocus="hidefocus" class="insert_tools insert_emotion" data-type="emotionbox" node-type="toolBtn" title="' + settings.lang.insert_emotion +'">表情</a>';

			var toolAtHtml =	'<a href="javascript:void(0)" hidefocus="hidefocus" class="insert_tools insert_person" data-type="personbox" node-type="toolBtn" title="' + settings.lang.insert_person +'"></a>';

			if(settings.btn.image){
				var toolPicHtml =	'<a href="javascript:void(0)" hidefocus="hidefocus" class="insert_tools insert_pic" data-type="imagebox" node-type="toolBtn" title="' + settings.lang.insert_pic +'">图片</a>';
			}else{
				var toolPicHtml = '';
			}
			if(settings.btn.voice){
				var toolVoiceHtml =	'<a href="javascript:void(0)" hidefocus="hidefocus" class="insert_tools insert_voice" data-type="voicebox" node-type="toolBtn" title="' + settings.lang.insert_voice +'"></a>';	
			}else{
				var toolVoiceHtml = '';
			}
			
			
			//share box send btns
			var sendWrapHtml = '<div class="sendFun"></div>';
			var postBtnHtml = '<a href="javascript:;" node-type="sendBtn" class="sendBtn" title="' + settings.lang.tips_publish +'">' + settings.lang.send_btn_text +'</a>';
			// var commentBtnHtml = '<a class="T_btn_a T_fr commentBtn" node-type="sendBtn" title=""><span><b></b><em></em></span></a>';
			//var commentBtnHtml = '<input type="button" class="sendBtn commentBtn" value="" title="">'; 
			
			//share box count              
			var countHtml = '<span class="countTxt"><em class="wx_letter">' + settings.maxletter +'</em></span>';
			
			//struction of userlist
	      	var userBoxHtml = '<div class="userbox"></div>';
	      	var topicBoxHtml = '<div class="topicbox"></div>';
			
			//sharebox mode of comment
			var btnHtml = '';
			btnHtml = settings.mode == "comment" ? commentBtnHtml : postBtnHtml;
			
			if(settings.mode == "repost")
			{
				$sharebox.append($(boxWrapHtml).html(shareHtml)).addClass(modebox).append($(toolWrapHtml).html(toolTopicHtml + toolEmotionHtml).append($(sendWrapHtml).html(btnHtml + countHtml)));
			}else if(settings.mode == "mini"){
				$sharebox.append($(toolWrapHtml).html(toolTopicHtml + toolEmotionHtml).append($(sendWrapHtml).html(btnHtml + countHtml))).append($(boxWrapHtml).html(shareHtml)).addClass(modebox);	
			}else{
				$sharebox.append($(boxWrapHtml).html(shareHtml)).addClass(modebox).append($(toolWrapHtml).html(toolTopicHtml + toolEmotionHtml + toolPicHtml + toolVoiceHtml).append($(sendWrapHtml).html(btnHtml + countHtml)));	
			}

			$sharebox.prepend(overlayHtml);

			//init textarea
			me.textAreaIt.init();

			
			//init image
			if(settings.btn.image)
			{
				//me.image.init($sharebox.find("[node-type='toolBtn'][data-type='imagebox']"));
			}
				
			//triggler open emotion panel
			$sharebox.find("[node-type='toolBtn'][data-type='emotionbox']").click(function()
			{
				var emotionbox = "." + $(this).attr("data-type");
				var oemo = $(emotionbox, $sharebox);
				if(oemo.length > 0)
				{
					if(!oemo.is(':visible'))
	 					openPanel($sharebox, oemo);
	 				else
	 					oemo.hide();		
				}else{
					me.Emotion.init($(this));
					openPanel($sharebox, $(emotionbox, $sharebox));
					me.Emotion.load();
				}
			});

			//triggler open voice panel
			$sharebox.find("[node-type='toolBtn'][data-type='voicebox']").click(function()
			{
				me.overlay.show();

				var voicebox = "." + $(this).attr("data-type");
				var oemo = $(voicebox, $sharebox);
				if(oemo.length > 0)
				{
					if(!oemo.is(':visible'))
	 					openPanel($sharebox, oemo);
	 				else
	 					oemo.hide();
				}else{
					me.voice.init($(this));
					openPanel($sharebox, $(voicebox, $sharebox));
					me.voice.build();
				}
			});

			//triggler open image panel
			$sharebox.find("[node-type='toolBtn'][data-type='imagebox']").click(function()
			{
                if($(this).parents('.multi-img').length)//if the multi-img-panel was open,then return false
                    return false;
				var imagebox = "." + $(this).attr("data-type");
				var oemo = $(imagebox, $sharebox);
				if(oemo.length > 0)
				{
					if(!oemo.is(':visible'))
	 					openPanel($sharebox, oemo);
	 				else
	 					oemo.hide();
				}else{
					me.image.init($(this));
					openPanel($sharebox, $(imagebox, $sharebox), function(){					
						setTimeout(function(){
							me.image.initUpload();	
						}, 100)
					});
				}
			});

			//triggler open topic panel
			$sharebox.find("[node-type='toolBtn'][data-type='topicbox']").click(function(e)
			{
				$sharebox.find(".panelbox").hide();
				var contentBox = $sharebox.find("[node-type='contentBox']");
				if(contentBox.val() == settings.lang.tips_default)
					contentBox.val("");
				me.content.add("#"+settings.lang.tips_topic+"#", e);
			});
			
			//triggler send evt
			$sharebox.find("a[node-type='sendBtn']").click(function()
			{
				var contentValue = $sharebox.find(".wx_content").val();
				if(contentValue =="")
				{
					$sharebox.find(".wx_content").focus();
					return;
				}else{
					contentValue = me.content.format(contentValue);
					me.content.send();
				}
			});

			$sharebox.find("[node-type='contentBox']").bind({
				"focus, click": function(){
					$sharebox.parents('.feed-sharebox').addClass("wx_hover");
					if($(this).val() == settings.lang.tips_default)
					{
						$(this).val("");
						me.textAreaIt.reset();
						$sharebox.find(".countTxt").show();
					}
					return false;
				}
			});

			$sharebox.data("sharebox-isInit", true);

			$sharebox.click(function(e){
				e.stopPropagation();
			})
			
			if(settings.mode!="repost")
			{
				$('body').click(function(e){
					me.textAreaIt.mini(e);	
				});
			}else{
				$sharebox.find("[node-type='contentBox']").click().focus();	
			}
		}
	
		function openPanel(_pbox, _self, evt)
		{
			_pbox.find(".panelbox").hide();
			_self.show();
			if(typeof evt == "function")
			{
				evt();	
			}	
		}

		this.textAreaIt = 
		{
			init: function()
			{
			   $sharebox.find(".wx_content").insertTextarea({
					maxLength: settings.maxletter,
					wild: true,
					cjk: true,
					urlCharsTag:true,
					ATtag: settings.atTag,
					dataUrl: settings.searchUserUrl,
					tips: settings.lang.tips_suggest,
					onInput: function(event, status)
					{
						if(parseInt(status.leftLength) == settings.maxletter && $(this).val() == ""){
							$sharebox.find(".countTxt").html('<em class="wx_letter">' + status.leftLength +'</em>');
							$sharebox.find(".sendBtn").addClass("sendBtn_disabled");
							$sharebox.find(".wx_content").removeClass("wx_content_disabled");
						}else if(parseInt(status.leftLength) >= 0)
						{
							$sharebox.find(".countTxt").html('<em class="wx_letter">' + status.leftLength +'</em>');
							$sharebox.find(".sendBtn").removeClass("sendBtn_disabled");
							$sharebox.find(".wx_letter").removeClass("sendLetter_error");
							$sharebox.find(".wx_content").removeClass("wx_content_disabled");
						}else{
							$sharebox.find(".countTxt").html('<em class="wx_letter">' + Math.abs(status.leftLength) +'</em>');
							$sharebox.find(".wx_letter").addClass("sendLetter_error");
							$sharebox.find(".sendBtn").addClass("sendBtn_disabled");
							$sharebox.find(".wx_content").addClass("wx_content_disabled");
						}
					}
				});

				if(settings.mode == "post")
					$sharebox.find(".sendBtn").addClass("sendBtn_disabled");

				if(settings.hideBtn == true)
					$sharebox.find(".sendBtn").hide();

				me.textarea = $sharebox.find(".wx_content").insertTextarea();

				settings.initCallBack();
			},
			reset: function(){
				$sharebox.find(".countTxt .wx_letter").text(settings.maxletter);
				$sharebox.find(".sendBtn").addClass("sendBtn_disabled");
				me.overlay.hide();
			},
			mini: function(){
				var dom = $sharebox.find(".wx_content");
				if((dom.val() == "" || dom.val() == settings.lang.tips_default) && ($('.multi-img').length === 0))
				{
					$sharebox.parents('.feed-sharebox').removeClass("wx_hover");
					dom.val(settings.lang.tips_default);
					$sharebox.find(".countTxt").hide();
					$sharebox.find(".panelbox").hide();
					me.overlay.hide();
				}	
			},
			getcontent: function(){
				return $sharebox.find(".wx_content").val();
			}
		};

		this.image = 
		{
			init: function(_this)
			{
				var that = this;
				//struction of voive	            
				var imageBoxHtml = '<div class="T_layer panelbox imagebox">';
					imageBoxHtml += 	'<div class="bg">';
					imageBoxHtml += 		'<div class="T_boxcontent">';
					imageBoxHtml +=         	'<a class="T_close" href="javascript:void(0);" title="' + settings.lang.close_btn_text +'"></a>';
					imageBoxHtml +=         	'<div class="layer_image">';
					imageBoxHtml += 				'<div class="detail clearfix">';
					imageBoxHtml += 					'<div class="detail_wrap">'
					imageBoxHtml += 						'<div class="image_btns" node-type="imageBtns">';
					imageBoxHtml += 							'<a node-type="imageRecordOpts" node-data="start" href="javascript:void(0);" class="T_btn_a image_startBtn"><b id="wb-image-swfupload"></b><span>'+ settings.lang.uploadimage_btn_text +'</span></a>';
					imageBoxHtml += 						'</div>';
					imageBoxHtml += 						'<div class="image_type_desc">' + settings.lang.tips_image_type +'</div>';
					imageBoxHtml += 						'<div id="image_thumbnails" class="image_thumbnails" node-type="imageThumbnails">';
					imageBoxHtml += 							'<div class="image_thumbnails_opts" node-type="imageThumbDelete" title="'+ settings.lang.delimage_btn_text +'"></div>';
					imageBoxHtml += 						'</div>';
					imageBoxHtml +=                      '</div>';
					imageBoxHtml += 				'</div>';
					imageBoxHtml += 			'</div>';
					imageBoxHtml += 		'</div>';
					imageBoxHtml += 		'<div class="arrow arrow_t"></div>';
					imageBoxHtml += 	'</div>';
					imageBoxHtml += '</div>';

				var _imagebox =  $(imageBoxHtml);
				_this.parent().append(_imagebox);



				//bind close emotion panel event
				_imagebox.find("a.T_close").bind("click", function(){
					_imagebox.hide();
				});

                //lijun modified this for cancel the uploading of current image
				_imagebox.find("[node-type='imageThumbDelete']").bind("click", function(){
//					$(this).parent().find('img').remove();
                    $(this).parent().hide();
				});

				//settings.btn.image && this.initUpload();
			},
			reset: function(){
				$sharebox.find('.imagebox').hide().remove();	
			},
			initUpload: function()
			{
				var settings = getSwfuploadConfig();
				settings.button_placeholder_id = 'wb-image-swfupload';
				settings.custom_settings = {
      				uploadArea: 'image_thumbnails',
      				progressTarget : "fsUploadProgress"
      			};
      			new SWFUpload(settings);
			}
		};

		this.voice = 
		{
			recordInterval: null,
			init: function(_this)
			{
				var that = this;
				//struction of voive	            
				var voiceBoxHtml = '<div class="T_layer panelbox voicebox">';
					 voiceBoxHtml += 	'<div class="bg">';
					 voiceBoxHtml += 		'<div class="T_boxcontent">';
					 voiceBoxHtml +=         	'<a class="T_close" href="javascript:void(0);" title="' + settings.lang.close_btn_text +'"></a>';
					 voiceBoxHtml +=         	'<div class="layer_voice">';
					 voiceBoxHtml += 				'<div class="detail clearfix">';
					 voiceBoxHtml += 					'<div class="detail_wrap"></div>';
					 voiceBoxHtml += 				'</div>';
					 voiceBoxHtml += 			'</div>';
					 voiceBoxHtml += 		'</div>';
					 voiceBoxHtml += 		'<div class="arrow arrow_t"></div>';
					 voiceBoxHtml += 	'</div>';
					 voiceBoxHtml += '</div>';

				var _voicebox =  $(voiceBoxHtml);
				_this.parent().append(_voicebox);

				//bind close emotion panel event
				_voicebox.find("a.T_close").bind("click", function(){
					that.reset();
					_voicebox.hide();
				});
			},
			build: function(){
				var that = this;
				var _html = '<div class="voice_bar"><div class="voice_sec"><span node-type="voiceRecordSec">0</span>/60</div><div class="voice_process_wrapper"><div class="voice_process_bar" node-type="voiceProcessBar"></div></div></div>';

				_html += '<div class="voice_btns" node-type="voiceBtns">';
				_html += '<a node-type="voiceRecordOpts" node-data="start" href="javascript:void(0);" class="T_btn_a voice_startBtn"><span>'+settings.lang.record_btn_text+'</span></a>';
				_html += '<a node-type="voiceRecordOpts" node-data="cancel" href="javascript:void(0);" class="T_btn_c voice_cancelBtn"><span>'+settings.lang.cancel_btn_text+'</span></a>';
				_html += '<a node-type="voiceRecordOpts" node-data="send" href="javascript:void(0);" class="T_btn_d voice_sendBtn"><span>'+settings.lang.send_btn_text+'</span></a>';
				_html += '</div>';

				var _jqdom_voicebox = $sharebox.find('.voicebox');
				_jqdom_voicebox.find(".detail_wrap").html(_html);

				_jqdom_voicebox.find(".detail_wrap [node-type='voiceRecordOpts'][node-data='start']").click(function(){
					$(this).parent("[node-type='voiceBtns']").addClass("recording");
					
					settings.record.start();

					var secDom = _jqdom_voicebox.find("[node-type='voiceRecordSec']");
					var processDom = _jqdom_voicebox.find("[node-type='voiceProcessBar']");
					that.recordInterval =  setInterval(function(){
						var t = parseInt(secDom.text()) + 1;
						if(t == 61)
						{
							settings.record.send();
							that.reset();
							_jqdom_voicebox.hide();
							return;
						}
						secDom.text(t);
						processDom.css('width', t*100/60 + "%");
					}, 1000)

				});

				_jqdom_voicebox.find(".detail_wrap [node-type='voiceRecordOpts'][node-data='cancel']").click(function(){
					settings.record.cancel();
					that.reset();
					_jqdom_voicebox.hide();
				});

				_jqdom_voicebox.find(".detail_wrap [node-type='voiceRecordOpts'][node-data='send']").click(function(){
					settings.record.send();
					that.reset();
					_jqdom_voicebox.hide();
				});
			},
			reset : function()
			{
				if(this.recordInterval)
				{
					clearInterval(this.recordInterval);
					this.recordInterval = null;	
				}

				var _jqdom_voicebox = $sharebox.find('.voicebox');
				_jqdom_voicebox.find("[node-type='voiceProcessBar']").css('width', 0);
				
				_jqdom_voicebox.find("[node-type='voiceBtns']").removeClass("recording");
				_jqdom_voicebox.find("[node-type='voiceRecordSec']").text(0);

				me.overlay.hide();
				me.hd.set('');
			}
		};

		this.overlay = {
			show: function(){
				$sharebox.find('[node-type="overlay"]').show();
			},
			hide: function(){
				$sharebox.find('[node-type="overlay"]').hide();
			}
		};
			
		this.Emotion = 
		{
			stores:{},
			init:function(_this)
			{
				var that = this;
				//struction of emotion	            
				var emotionBoxHtml = '<div class="T_layer panelbox emotionbox">';
					 emotionBoxHtml += 	'<div class="bg">';
					 emotionBoxHtml += 		'<div class="T_boxcontent">';
					 emotionBoxHtml +=         '<a class="T_close" href="javascript:void(0);" title="' + settings.lang.close_btn_text +'"></a>';
					 emotionBoxHtml +=         '<div class="layer_faces">';
					 emotionBoxHtml += 				'<div class="tab W_textb"><p></p></div>';
					 emotionBoxHtml += 				'<div class="detail clearfix">';
					 emotionBoxHtml += 					'<div class="detail_wrap"></div>';
					 emotionBoxHtml += 				'</div>';
					 emotionBoxHtml += 			'</div>';
					 emotionBoxHtml += 		'</div>';
					 emotionBoxHtml += 		'<div class="arrow arrow_t"></div>';
					 emotionBoxHtml += 	'</div>';
					 emotionBoxHtml += '</div>';
					 
				var tabHtml = '';
				if(settings.emotionSkins)
				{
					_class = settings.closeBtnHover;
					$.each(settings.emotionSkins, function(key, val){
						tabHtml +='<a href="javascript:void(0);" class="' + _class + '" data-type="' + key +'">' + settings.emotionSkins[key] +'</a>';
						_class = '';	
					});
				}
				
				var _emotionbox =  $(emotionBoxHtml);
				_this.parent().append(_emotionbox);
				

				//bind toggle emotion event
				_emotionbox.find(".tab p").html(tabHtml).find("a").bind('click', function(){
					that.load($(this).attr("data-type"));
					$(this).siblings().removeClass(settings.closeBtnHover);
					$(this).addClass(settings.closeBtnHover);
				});

				//bind close emotion panel event
				_emotionbox.find("a.T_close").bind("click", function(){
					_emotionbox.hide();
				});

				var element = _emotionbox.find(".detail_wrap").jScrollPane({
					"autoReinitialise": true,
					"mouseWheelSpeed" : 50
				});
				var api = element.data('jsp');
				this.stores.api = api;
				
			},
			load:function(skintype)
			{
				var that = this;
				var _jqdom_emotionbox = $sharebox.find(settings.emotionboxObj);
				if(!skintype) 
					skintype = _jqdom_emotionbox.find(".tab a:first").attr("data-type");
				
				if(that.stores[skintype])
				{
					that.build(skintype, that.stores[skintype]);
					return;
				}
			
				$.ajax({
					url: settings.getEmotionUrl,
					type: 'GET',
					data: {'skintype' : skintype},
					cache: true,
					dataType: 'json',
					beforSend: function()
					{
						_jqdom_emotionbox.find(".detail_wrap").html(loadingDom);		
					},
					success: function(jsondata)
					{
						if(jsondata!=null && jsondata!="")
						{
							that.stores[skintype] = jsondata;
							that.build(skintype, jsondata);	
						}
					},
					error: function(){
						_jqdom_emotionbox.find(".detail_wrap").html("Load err");
					}
				});
			},
			build:function(skintype, jsondata)
			{
				var _jqdom_emotionbox = $sharebox.find(settings.emotionboxObj);
				var _html = '<ul class="faces_list clearfix">';
				for(var i=0; i< jsondata.length; i++)
				{
		 			_html+= '<li data-type="'+ skintype +'" data-type-id="' + jsondata[i].id +'" data-type-title="' + jsondata[i].name +'"><img src="'+ settings.resourceUrl + skintype + "/" + jsondata[i].id + '.gif" alt="' + jsondata[i].name +'" title="' + jsondata[i].name +'"></li>';		
				}
				_html += '</ul>';
				
				if(this.stores.api)
				{
					this.stores.api.getContentPane().html(_html);
				}else{
					_jqdom_emotionbox.find(".detail_wrap").html(_html);	
				}

				//bind emotion click event
				_jqdom_emotionbox.find(".faces_list").delegate("li", "click", function(e){
					me.content.addEmo($(this), e);
					_jqdom_emotionbox.hide();
					return;
				});
			}
		};

		this.hd = 
		{
			set: function(str){
				me.hiddendata = str;
			},
			get: function(){
				return me.hiddendata;
			}
		};
		
		this.content = 
		{
			add: function(str, event)
			{
				me.textarea.insertText(str, -1);
				event.preventDefault();	
			},
			addEmo: function(obj, event)
			{	
				var str = '';
				var type = obj.attr("data-type");
				var title = obj.attr("data-type-title");
				var wx_content = $sharebox.find(".wx_content");
				if(wx_content.val() == settings.lang.tips_default)
					wx_content.val("");
				str = type == settings.defaultEmotionSkin ? title : type + title;
				me.textarea.insertText("["+ str +"]");
			   	event.preventDefault();
			},
			addUserTopic: function(str)
			{
			},
			getlength: function()
			{								
			},
			getcontent: function () {
				return $sharebox.find(".wx_content").val();
			},
			format: function(str){
				
				//replace enter
			   var str = str.replace(/\n/g," ");
			   return str;
			},
			send: function()
			{
				var that = this;
				var wx_content = $sharebox.find(".wx_content");
				if(0 > parseInt(me.textarea.getContentLen()))
				{
					that.ban();
					return;	
				}
				var contentValue = wx_content.val();

				//增加隐藏的值
				var hdstr = me.hd.get();
				if(hdstr!=""){
					contentValue+= hdstr;	
				}

				settings.ajaxData.content = contentValue;

				$.ajax({
					url: settings.ajaxData.saveUrl,
					type: 'POST',
					data: settings.ajaxData,
					beforSend: function()
					{
						//
					},
					success: function(jsondata)
					{
                        if(typeof jsondata == 'string'){
    						jsondata = JSON.parse(jsondata);
                        }
						if(jsondata.code == "ok" || jsondata.status == "1")
						{
							me.hiddendata = '';
							wx_content.val('');
							$sharebox.find('#image_thumbnails').empty().hide();
							$sharebox.find('.imagebox').hide();
							me.textAreaIt.mini();
							settings.postCallback();
							that.init();
						}else{
							alert(jsondata.msg || jsondata);	
						}
					},
					error: function(){
						//
					}
				});	
			},
			ban: function(){
			 	$sharebox.find(".wx_content").addClass("wx_content_disabled");	
			},
			init: function()
			{
				$sharebox.find(".sendBtn").addClass("sendBtn_disabled");
				$sharebox.find(".wx_letter").text(settings.maxletter);
			}
		};
	
		this.getImg = function(obj)
		{
			var skins = obj.attr("data-type");
			var emoid = obj.attr("data-type-id");
			return '<img src="'+ this.settings.resourceUrl + skins + "/" + emoid + '.gif" data-type="' + skins + '" data-type-id="' + emoid +'" />';
		};
	};
	
	$.fn.sharebox.defaults = {
		lang: $.noop,
		maxletter: '',
		mode: "post",
		emotionboxObj: ".emotionbox",
		emotionSkins: $.noop,
		defaultEmotionSkin: '',
		resourceUrl: '',
		getEmotionUrl: '',
		getTopicUrl: "modules/box_topics.php",
		searchUserUrl: null,
		closeBtnHover: "current T_texta",
		atTag: false,
		custStyle: null,
		ajaxData: $.noop,
		record: $.noop,
		btn: {'voice' : false, 'image' : true},
		initCallBack : function(){},
		getNewAjaxData : function(){},
		imgClick:function(event){
			alert($(event.target).attr("src"));
		},
		getImg:function(src){
			return getImg(src);
		}
	};

})(jQuery);