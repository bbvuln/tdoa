define("tDesktop19/tDesktop.Theme", function(require, exports, module) {
    var $ = window.jQuery;
    var Theme = {
        init: function() {
            this.bindEvent();
        },
        bindEvent: function() {
            var self = this;
            $("#theme").click(function() {
                if (theme_select_priv == 0) {
                    alert(theme_select_tip);
                    return;
                } else {
                    var $target = $(this).find("#themeWrap");
                    if ($(".siderbar-options-wrap.on").size() >= 1) {
                        self.closeOptWrap();
                    } else {
                        if ($target.hasClass("on")) {
                            $target.attr("class", "siderbar-options-wrap");
                            $("#themeWrap").hide();
                        } else {
                            $target.attr("class", "siderbar-options-wrap on");
                            $("#themeWrap").show();
                        }
                    }
                }
            });
          /*   $(".theme-item").click(function() {
                var type = $(this).attr("data-type");
                $(".theme-item i").removeClass("active");
                $(this)
                    .find("i")
                    .addClass("active");
                if (type == "tos") {
                    $("#themeColorWrap").hide();
                    self.setTheme(15);
                } else {
                    $("#themeColorWrap").show();
                }
            }); */
			//更改主题颜色
            $(".theme-color-item").click(function() {
                var color = $(this).attr("data-color");
                $(".theme-color-item i").removeClass("active");
                $(this)
                    .find("i")
                    .addClass("active");
                $("body").attr("class", "TOS " + color);
                self.setThemeColor(color);
                var iframes = $("iframe");
                iframes.each(function(i, item) {
					var tab_id = INDEX_TAB_ID? "tabs_portal_" + INDEX_TAB_ID + "_iframe":null
                    if (item.id === tab_id) {
						//信息中心更改主题的接口
                        var portal_iframe = item.contentWindow;
						var CHANGETHEME = portal_iframe.CHANGETHEME;
						if (CHANGETHEME) {
							CHANGETHEME(color);
						}
                    }
				});
            });
        },
        closeOptWrap: function() {
            $(".siderbar-options-wrap.on").each(function() {
                $(this)
                    .removeClass("on")
                    .hide();
            });
        },
   /*      setTheme: function(themeid) {
            var flag = false;
            $.ajax({
                async: false,
                data: { themeid: themeid },
                url: "/general/person_info/theme/switch.php",
                success: function(r) {
                    if (r == "+ok") {
                        flag = true;
                        window.location.reload();
                    }
                }
            });
            return flag;
        }, */
        setThemeColor: function(color) {
            $.ajax({
                async: false,
                data: { colour: color },
                url: "/general/status_bar/set_theme.php",
                success: function(r) {
                    if (r == "+ok") {
                        window.location.reload();
                    }
                }
            });
        }
    };
    exports.Theme = Theme;
});
