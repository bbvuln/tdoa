
(function($) {
	$.fn.placeholder = function(options) {
		var defaults = {
			labelMode: false,
			labelStyle: {},
			labelAlpha: false,
			labelAcross: false
		};
		var params = $.extend({}, defaults, options || {});
		
		//����
		var funLabelAlpha = function(elementEditable, elementCreateLabel) {
			if (elementEditable.val() === "") {
				elementCreateLabel.css("opacity", 0.4).html(elementEditable.data("placeholder"));
			} else {
				elementCreateLabel.html("");	
			}
		};
		
		$(this).each(function() {
			var element = $(this), isPlaceholder = "placeholder" in document.createElement("input"), placeholder = element.attr("placeholder");

			// �����������
			// �� û��placeholder����ֵ
			// �� valueģ�⣬ͬʱ��֧��placeholder���Ե������
			// �� labelģ�⣬�����������������ݣ�ͬʱ��֧��placeholder���Ե������
			if (!placeholder || (!params.labelMode && isPlaceholder) || (params.labelMode && !params.labelAcross && isPlaceholder)) { return; }

			// �洢����Ϊ��ʱ�����placeholder����
			element.data("placeholder", placeholder);
			
			// labelģ��
			if (params.labelMode) {			
				var idElement = element.attr("id"), elementLabel = null;
				if (!idElement) {
					idElement = "placeholder" + Math.random();	
					element.attr("id", idElement);
				}
				
				// ״̬��ʼ��
				elementLabel = $('<label class="placeholderLabel" for="'+ idElement +'"></label>').css($.extend({
					lineHeight: "1.3",
					position: "absolute",
					color: "graytext",
					cursor: "text",
    				left: "30px",
    				top: "5px"
				}, params.labelStyle)).insertBefore(element);				
				
				// �¼���
				if (params.labelAlpha) {
					// �����Ϊ��focus͸���ȸı佻��
					element.bind({
						"focus": function() {
							funLabelAlpha($(this), elementLabel);
						},
						"input": function() {
							funLabelAlpha($(this), elementLabel);
						},
						"blur": function() {
							if (this.value === "") {
								elementLabel.css("opacity", 1).html(placeholder);  
							}	
						}
					});	
					
					//IE6~8��֧��oninput�¼�����Ҫ���а�
					if (!window.screenX) {
						element.bind("keyup", function() {
							funLabelAlpha($(this), elementLabel);	
						});
						element.get(0).onpaste = function() {
							setTimeout(function() {
								funLabelAlpha(element, elementLabel);	
							}, 30);	
						}
					}
					
					// �Ҽ��¼�
					elementLabel.get(0).oncontextmenu = function() {
						element.trigger("focus");
						return false;	
					}
				} else {
					//����ǵ�����value����
					element.bind({
						"focus": function() {
							elementLabel.html("");
						},
						"blur": function() {
							if ($(this).val() === "") {
								elementLabel.html(placeholder);	
							}
						}
					});	
				}
				
				// ���ݳ�ʼ��
				if (params.labelAcross) {
					element.removeAttr("placeholder");	
				}
				
				if (element.val() === "") {
					elementLabel.html(placeholder);	
				}
			} else {
				// valueģ��
				element.bind({
					"focus": function() {
						if ($(this).val() === placeholder) {
							$(this).val("");
						}
						$(this).css("color", "");	
					},
					"blur": function() {
						if ($(this).val() === "") {
							$(this).val(placeholder).css("color", "graytext");    
						}	
					}
				});	
				
				// ��ʼ��
				if (element.val() === "") {
					element.val(placeholder).css("color", "graytext");      
				}
			}	
		});
	};	
})(jQuery);