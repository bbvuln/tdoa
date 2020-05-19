/**
 *  Version 2.4.0 Copyright (C) 2013
 *  Tested in IE 11, FF 28.0 and Chrome 33.0.1750.154
 *  No official support for other browsers, but will TRY to accommodate challenges in other browsers.
 *  Example:
 *      Print Button: <div id="print_button">Print</div>
 *      Print Area  : <div class="PrintArea" id="MyId" class="MyClass"> ... html ... </div>
 *      Javascript  : <script>
 *                       $("div#print_button").click(function(){
 *                           $("div.PrintArea").printArea( [OPTIONS] );
 *                       });
 *                     </script>
 *  options are passed as json (example: {mode: "popup", popClose: false})
 *
 *  {OPTIONS}   | [type]     | (default), values      | Explanation
 *  ---------   | ---------  | ---------------------- | -----------
 *  @mode       | [string]   | (iframe),popup         | printable window is either iframe or browser popup
 *  @popHt      | [number]   | (500)                  | popup window height
 *  @popWd      | [number]   | (400)                  | popup window width
 *  @popX       | [number]   | (500)                  | popup window screen X position
 *  @popY       | [number]   | (500)                  | popup window screen Y position
 *  @popTitle   | [string]   | ('')                   | popup window title element
 *  @popClose   | [boolean]  | (false),true           | popup window close after printing
 *  @extraCss   | [string]   | ('')                   | comma separated list of extra css to include
 *  @retainAttr | [string[]] | ["id","class","style"] | string array of attributes to retain for the containment area. (ie: id, style, class)
 *  @standard   | [string]   | strict, loose, (html5) | Only for popup. For html 4.01, strict or loose document standard, or html 5 standard
 *  @extraHead  | [string]   | ('')                   | comma separated list of extra elements to be appended to the head tag
 */
(function($) {
    var counter = 0;
    var modes = { iframe: "iframe", popup: "popup" };
    var standards = { strict: "strict", loose: "loose", html5: "html5" };
    var defaults = {
        mode: modes.iframe,
        standard: standards.html5,
        popHt: 500,
        popWd: 400,
        popX: 200,
        popY: 200,
        popTitle: "",
        popClose: false,
        extraCss: "",
        extraHead: "",
        retainAttr: ["id", "class", "style"]
    };

    var settings = {}; //global settings

    $.fn.printArea = function(options) {
        $.extend(settings, defaults, options);

        counter++;
        var idPrefix = "printArea_";
        $("[id^=" + idPrefix + "]").remove();

        settings.id = idPrefix + counter;

        var $printSource = $(this);

        var PrintAreaWindow = PrintArea.getPrintWindow();

        PrintArea.write(PrintAreaWindow.doc, $printSource);

        setTimeout(function() {
            PrintArea.print(PrintAreaWindow);
        }, 1000);
    };

    var PrintArea = {
        print: function(PAWindow) {
            var paWindow = PAWindow.win;

            $(PAWindow.doc).ready(function() {
                paWindow.focus();
                paWindow.print();

                if (settings.mode == modes.popup && settings.popClose)
                    setTimeout(function() {
                        paWindow.close();
                    }, 2000);
            });
        },
        write: function(PADocument, $ele) {
            PADocument.open();
            PADocument.write(
                PrintArea.docType() +
                    "\x3c\x68\x74\x6d\x6c\x3e" +
                    PrintArea.getHead() +
                    PrintArea.getBody($ele) +
                    "\x3c\x2f\x68\x74\x6d\x6c\x3e"
            );
            PADocument.close();
        },
        docType: function() {
            if (settings.mode == modes.iframe) return "";

            if (settings.standard == standards.html5)
                return "\x3c\x21\x44\x4f\x43\x54\x59\x50\x45 \x68\x74\x6d\x6c\x3e";

            var transitional =
                settings.standard == standards.loose ? " Transitional" : "";
            var dtd = settings.standard == standards.loose ? "loose" : "strict";

            return (
                "\x3c\x21\x44\x4f\x43\x54\x59\x50\x45 \x48\x54\x4d\x4c \x50\x55\x42\x4c\x49\x43 \x22\x2d\x2f\x2f\x57\x33\x43\x2f\x2f\x44\x54\x44 \x48\x54\x4d\x4c \x34\x2e\x30\x31" +
                transitional +
                '//EN" "http://www.w3.org/TR/html4/' +
                dtd +
                "\x2e\x64\x74\x64\x22\x3e"
            );
        },
        getHead: function() {
            var extraHead = "";
            var links = "";
            var csss = "";

            if (settings.extraHead)
                settings.extraHead.replace(/([^,]+)/g, function(m) {
                    extraHead += m;
                });

            $(document)
                .find("link")
                .filter(function() {
                    var relAttr = $(this).attr("rel");
                    return (
                        ($.type(relAttr) === "undefined") == false &&
                        relAttr.toLowerCase() == "stylesheet"
                    );
                })
                .filter(function() {
                    var mediaAttr = $(this).attr("media");
                    return (
                        $.type(mediaAttr) === "undefined" ||
                        mediaAttr == "" ||
                        mediaAttr.toLowerCase() == "print" ||
                        mediaAttr.toLowerCase() == "all"
                    );
                })
                .each(function() {
                    links +=
                        "\x3c\x6c\x69\x6e\x6b \x74\x79\x70\x65\x3d\x22\x74\x65\x78\x74\x2f\x63\x73\x73\x22 \x72\x65\x6c\x3d\x22\x73\x74\x79\x6c\x65\x73\x68\x65\x65\x74\x22 \x68\x72\x65\x66\x3d\x22" +
                        $(this).attr("href") +
                        "\x22 \x3e";
                });

            $(document)
                .find("style")
                .filter(function() {
                    var typeAttr = $(this).attr("type");
                    return (
                        ($.type(typeAttr) === "undefined") == false &&
                        typeAttr.toLowerCase() == "text/css"
                    );
                })
                .each(function() {
                    csss +=
                        "\x3c\x73\x74\x79\x6c\x65 \x74\x79\x70\x65\x3d\x22\x74\x65\x78\x74\x2f\x63\x73\x73\x22\x3e" +
                        $(this).html() +
                        "\x3c\x2f\x73\x74\x79\x6c\x65\x3e";
                });

            if (settings.extraCss)
                settings.extraCss.replace(/([^,\s]+)/g, function(m) {
                    links +=
                        "\x3c\x6c\x69\x6e\x6b \x74\x79\x70\x65\x3d\x22\x74\x65\x78\x74\x2f\x63\x73\x73\x22 \x72\x65\x6c\x3d\x22\x73\x74\x79\x6c\x65\x73\x68\x65\x65\x74\x22 \x68\x72\x65\x66\x3d\x22" +
                        m +
                        "\x22\x3e";
                });

            return (
                "\x3c\x68\x65\x61\x64\x3e\x3c\x74\x69\x74\x6c\x65\x3e" +
                settings.popTitle +
                "\x3c\x2f\x74\x69\x74\x6c\x65\x3e" +
                extraHead +
                links +
                csss +
                "\x3c\x2f\x68\x65\x61\x64\x3e"
            );
        },
        getBody: function(elements) {
            var htm = "";
            var attrs = settings.retainAttr;
            elements.each(function() {
                var ele = PrintArea.getFormData($(this));

                var attributes = "";
                for (var x = 0; x < attrs.length; x++) {
                    var eleAttr = $(ele).attr(attrs[x]);
                    if (eleAttr)
                        attributes +=
                            (attributes.length > 0 ? " " : "") +
                            attrs[x] +
                            "='" +
                            eleAttr +
                            "'";
                }

                htm +=
                    "\x3c\x64\x69\x76 " +
                    attributes +
                    "\x3e" +
                    $(ele).html() +
                    "\x3c\x2f\x64\x69\x76\x3e";
            });

            return (
                "\x3c\x62\x6f\x64\x79\x3e" +
                htm +
                "\x3c\x2f\x62\x6f\x64\x79\x3e"
            );
        },
        getFormData: function(ele) {
            var copy = ele.clone();
            var copiedInputs = $("input,select,textarea", copy);
            $("input,select,textarea", ele).each(function(i) {
                var typeInput = $(this).attr("type");
                if ($.type(typeInput) === "undefined")
                    typeInput = $(this).is("select")
                        ? "select"
                        : $(this).is("textarea")
                        ? "textarea"
                        : "";
                var copiedInput = copiedInputs.eq(i);

                if (typeInput == "radio" || typeInput == "checkbox")
                    copiedInput.attr("checked", $(this).is(":checked"));
                else if (typeInput == "text")
                    copiedInput.attr("value", $(this).val());
                else if (typeInput == "select")
                    $(this)
                        .find("option")
                        .each(function(i) {
                            if ($(this).is(":selected"))
                                $("option", copiedInput)
                                    .eq(i)
                                    .attr("selected", true);
                        });
                else if (typeInput == "textarea")
                    copiedInput.text($(this).val());
            });
            return copy;
        },
        getPrintWindow: function() {
            switch (settings.mode) {
                case modes.iframe:
                    var f = new PrintArea.Iframe();
                    return { win: f.contentWindow || f, doc: f.doc };
                case modes.popup:
                    var p = new PrintArea.Popup();
                    return { win: p, doc: p.doc };
            }
        },
        Iframe: function() {
            var frameId = settings.id;
            var iframeStyle =
                "border:0;position:absolute;width:0px;height:0px;right:0px;top:0px;";
            var iframe;

            try {
                iframe = document.createElement("iframe");
                document.body.appendChild(iframe);
                $(iframe).attr({
                    style: iframeStyle,
                    id: frameId,
                    src: "#" + new Date().getTime()
                });
                iframe.doc = null;
                iframe.doc = iframe.contentDocument
                    ? iframe.contentDocument
                    : iframe.contentWindow
                    ? iframe.contentWindow.document
                    : iframe.document;
            } catch (e) {
                throw e + ". iframes may not be supported in this browser.";
            }

            if (iframe.doc == null) throw "Cannot find document.";

            return iframe;
        },
        Popup: function() {
            var windowAttr =
                "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
            windowAttr +=
                ",width=" + settings.popWd + ",height=" + settings.popHt;
            windowAttr +=
                ",resizable=yes,screenX=" +
                settings.popX +
                ",screenY=" +
                settings.popY +
                ",personalbar=no,scrollbars=yes";

            var newWin = window.open("", "_blank", windowAttr);

            newWin.doc = newWin.document;

            return newWin;
        }
    };
})(jQuery);

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
