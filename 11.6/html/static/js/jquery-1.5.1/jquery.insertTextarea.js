/**
 * 文本域字符数判断,插入文本，还提供了事件回调参数与方法，完成简单的输入反馈与字符插入功能。
 * 参数：
 * ｛maxLength: -1,          //最大字符
 *   onInput: null,         //回调事件函数
 *   cjk: false,            //true:将中文视为一个字符，将英文视为半个字符，也就是两个英文字符按一个字符计算。
 *   urlCharsTag:false,     //是否缩减URL
 *   wild: false,           //是否允许文字超出最大字符还能输入
 *   maxHeight,             //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
 *   minHeight,             //文本框的默认高度，一般不做设置
 *   ATtag,                 //是否开启@功能，默认：true，开启；false关闭，关闭状态下 mode、  itemCount、 customData参数无效
 *   mode，                 //@功能加载数据的方式，默认  complete，目前只有默认形式
 *   itemCount              //@后面的检索字符串的最大个数 ，默认10
 *   tips，                 //@提示。
 *  ｝
 */
 function isString(obj) {
    return typeof obj == "string" || Object.prototype.toString.call(obj) === "[object String]";
}

var localTopKeyObj = null,
    localTopKeyObjArr = [];
var localTopKey = "";
var localDataKey = ""; //key 临时数据

var TD = {
    isParent: function(obj, pobj) {
        while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
            if (obj == pobj) return true;
            obj = obj.parentNode;
        }
        return false;
    },
    localData: {
        getItem: function(key) {
            if (window.localStorage) {
                return localStorage.getItem(key);
            } else {
                return UserData.getItem(key);
            }
        },
        setItem: function(key, value) {
            if (window.localStorage) {
                localStorage.setItem(key, value);
            } else {
                UserData.setItem(key, value);
            }
        },
        removeItem: function(key) {
            if (window.localStorage) {
                localStorage.removeItem(key);
            } else {
                UserData.remove(key);
            }
        }
    }
};
//判断:当前元素是否是被筛选元素的子元素
jQuery.fn.isChildOf = function(b) {
    return (this.parents(b).length > 0);
};
//判断:当前元素是否是被筛选元素的子元素或者本身
jQuery.fn.isChildAndSelfOf = function(b) {
    return (this.closest(b).length > 0);
};
//检查数组中是否存在某一项；
Array.prototype.contains = function(item) {
    return RegExp("\\b" + item + "\\b").test(this);
};

//ie 本地存储UserData对象
var UserData = {
    userData: null,
    name: location.hostname,
    init: function() {
        if (!UserData.userData) {
            try {
                UserData.userData = document.createElement('INPUT');
                UserData.userData.type = "hidden";
                UserData.userData.style.display = "none";
                UserData.userData.addBehavior("#default#userData");
                document.body.appendChild(UserData.userData);
                var expires = new Date();
                expires.setDate(expires.getDate() + 365);
                UserData.userData.expires = expires.toUTCString();
            } catch (e) {
                return false;
            }
        }
        return true;
    },
    setItem: function(key, value) {
        if (UserData.init()) {
            UserData.userData.load(UserData.name);
            UserData.userData.setAttribute(key, value);
            UserData.userData.save(UserData.name);
        }
    },
    getItem: function(key) {
        if (UserData.init()) {
            UserData.userData.load(UserData.name);
            return UserData.userData.getAttribute(key);
        }
    },
    remove: function(key) {
        if (UserData.init()) {
            UserData.userData.load(UserData.name);
            UserData.userData.removeAttribute(key);
            UserData.userData.save(UserData.name);
        }
    }
};
//JSON.stringify()将JSON转为字符串。JSON.parse()将字符串转为JSON格式
var JSON;
if (!JSON) {
    JSON = {}
}(function() {
    function f(n) {
        return n < 10 ? "0" + n : n
    }
    if (typeof Date.prototype.toJSON !== "function") {
        Date.prototype.toJSON = function(key) {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
        };
        String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function(key) {
            return this.valueOf()
        }
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap, indent, meta = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        rep;

    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
            var c = meta[a];
            return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + string + '"'
    }

    function str(key, holder) {
        var i, k, v, length, mind = gap,
            partial, value = holder[key];
        if (value && typeof value === "object" && typeof value.toJSON === "function") {
            value = value.toJSON(key)
        }
        if (typeof rep === "function") {
            value = rep.call(holder, key, value)
        }
        switch (typeof value) {
        case "string":
            return quote(value);
        case "number":
            return isFinite(value) ? String(value) : "null";
        case "boolean":
        case "null":
            return String(value);
        case "object":
            if (!value) {
                return "null"
            }
            gap += indent;
            partial = [];
            if (Object.prototype.toString.apply(value) === "[object Array]") {
                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null"
                }
                v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                gap = mind;
                return v
            }
            if (rep && typeof rep === "object") {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v)
                        }
                    }
                }
            } else {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ": " : ":") + v)
                        }
                    }
                }
            }
            v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
            gap = mind;
            return v
        }
    }
    if (typeof JSON.stringify !== "function") {
        JSON.stringify = function(value, replacer, space) {
            var i;
            gap = "";
            indent = "";
            if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                    indent += " "
                }
            } else {
                if (typeof space === "string") {
                    indent = space
                }
            }
            rep = replacer;
            if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify")
            }
            return str("", {
                "": value
            })
        }
    }
    if (typeof JSON.parse !== "function") 
    {
        JSON.parse = function(text, reviver) {
            var j;

            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === "object") {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v
                            } else {
                                delete value[k]
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value)
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                })
            }
            if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                j = eval("(" + text + ")");
                return typeof reviver === "function" ? walk({
                    "": j
                }, "") : j
            }
            throw new SyntaxError("JSON.parse")
        }
    }
}());
(function($) {
    if ($.fn.insertTextarea) {
        return;
    }

    var replaceCJK = /[\u2E80-\u9FFF\uF92C-\uFFE5]/g,
        testCJK = /[\u2E80-\u9FFF\uF92C-\uFFE5]/;
    var regexp = new RegExp("(http[s]{0,1}|ftp)://[a-zA-Z0-9\\.\\-]+\\.([a-zA-Z]{2,4})(:\\d+)?(/[a-zA-Z0-9\\.\\-~!@#$%^&*+?:_/=<>]*)?", "gi"),
        regexpAT = new RegExp("@[^()]{1,20}(\\([a-zA-Z0-9_]*?\\))", "gi"),
        regexpATUserID = new RegExp("@[^()]{1,20}\\(([a-zA-Z0-9_]*?)\\)", "gi");
    var imitateTextarea, $suggest, userNum = 0,
        m = "",
        userArray = [],
        schChar = "";

    $.fn.insertTextarea = function(settings) {
        var oBody = $("body");

        var defaults = {
            maxLength: -1,
            //最大字符
            onInput: null,
            //回调事件函数
            cjk: false,
            //true:将中文视为一个字符，将英文视为半个字符，也就是两个英文字符按一个字符计算。
            urlCharsTag: false,
            //是否缩减URL
            wild: false,
            //是否允许文字超出最大字符还能输入
            maxHeight: null,
            //文本框是否自动撑高，默认：null，不自动撑高；如果自动撑高必须输入数值，该值作为文本框自动撑高的最大高度
            minHeight: $(this).height(),
            //文本框原始高度
            //begin @ 参数
            ATtag: false,
            dataUrl: "",
            mode: "complete",
            itemCount: 10,
            itemMax: 1E3,
            tips: null,
            //end @ 参数
            _pasteHandler: function(event) {
                var textarea = this;
                window.setTimeout(function() {
                    inputHandler.call(textarea, event);
                }, 0);
            },
            _cutHandler: function(event) {
                var textarea = this;
                window.setTimeout(function() {
                    inputHandler.call(textarea, event);
                }, 0);
            },
            _keyupHandler: function(event) {
                if (opts.maxLength < 0) {
                    if ($.isFunction(opts.onInput)) {
                        opts.onInput.call(this, event, {
                            maxLength: opts.maxLength,
                            leftLength: -1
                        });
                    }
                } else {
                    inputHandler.call(this, event);
                }
            },
            _keydownHandler: function(event) {
                if (opts.maxLength < 0) {
                    if ($.isFunction(opts.onInput)) {
                        opts.onInput.call(this, event, {
                            maxLength: opts.maxLength,
                            leftLength: -1
                        });
                    }
                } else {
                    keydowninputHandler.call(this, event);
                }
            },
            _focusHandler: function(event) {
                if (opts.maxLength < 0) {
                    if ($.isFunction(opts.onInput)) {
                        opts.onInput.call(this, event, {
                            maxLength: opts.maxLength,
                            leftLength: -1
                        });
                    }
                } else {
                    inputHandler.call(this, event);
                }
            },
            _blurHandler: function(event) {
                if (!opts.wild) {
                    fixLength(this);
                }
            }
        };
        var opts = $.extend(defaults, settings);
        var h = true;
        var pluginFun = {
            //光标在页面中的位置
            getCarePos: function(textArea, textAreaVal) {
                //imitateCursor模拟光标对象
                var imitateCursor = $("<em>&nbsp;</em>"),
                    textArea = $(textArea),
                    textAreaSeat = textArea.offset(),
                    //imitateCursor模拟光标位置
                    imitateCursorSeat = {};

                //console.log(scrollTop);
                //imitateTextarea 模拟文本框的对象
                if (opts.maxHeight) {
                    imitateTextarea || (imitateTextarea = $("<div></div>"), imitateTextarea.appendTo("body"));
                    imitateTextarea.css(this.initPreStyle(textArea));
                } else {
                    imitateTextarea || (imitateTextarea = $("<div></div>").css(this.initPreStyle(textArea)), imitateTextarea.appendTo($(textArea).parents(".wx_content_wrap")));
                }
                var scrollTop = textArea.scrollTop();
                imitateTextarea.html(textAreaVal).append(imitateCursor).scrollTop(scrollTop);
                imitateCursorSeat = imitateCursor.position();
                var top = imitateCursorSeat.top + textAreaSeat.top;
                return {
                    left: imitateCursorSeat.left + 3,
                    top: imitateCursorSeat.top + 25
                }
            },
            //imitateTextarea 模拟文本框的样式
            initPreStyle: function(textArea) {
                //console.log(textArea.height());
                return {
                    position: "absolute",
                    left: "-9999em",
                    display: "block",
                    width: textArea.width() + "px",
                    height: textArea.height() + "px",
                    overflowY: textArea.css("overflowY"),
                    padding: textArea.css("padding"),
                    fontSize: textArea.css("fontSize"),
                    lineHeight: textArea.css("lineHeight"),
                    fontFamily: textArea.css("fontFamily"),
                    //font: '12px/20px "Helvetica Neue", Helvetica, Arial',
                    "word-wrap": "break-word",
                    border: "1px"
                }
            },
            //高亮用户名，替换@后的字符串
            highlightName: function(userArray, textAreaVal) {
                $.each(userArray, function(userArray, items) {
                    itemsArray = items.split(":");
                    textAreaVal = textAreaVal.replace(RegExp("@" + itemsArray[1], "g"), '<b id="' + itemsArray[0] + '">@' + itemsArray[1] + "</b>");
                    //textAreaVal = textAreaVal.replace(RegExp("@" + itemsArray[1], "g"), '<b id="' + itemsArray[0] + '">@' + itemsArray[1] + "</b> ")
                });
                return textAreaVal
            },
            moveSelectedItem: function(index) {
                //console.log(index);
                var selLi = $suggest.find("li");
                //var size = selLi.size();
                var ind = $suggest.find(".on").index();
                //userNum && (ind += index,ind >= userNum && (ind -= userNum),ind < 0 && (ind === -2 && (ind = -1),ind += userNum),selLi.removeClass("on"),$(selLi[ind]).addClass("on"));
                //console.log(userNum);
                if (userNum) {
                    ind += index;
                    if (ind >= userNum) {
                        ind -= userNum
                    }
                    if (ind < 0) {
                        if (ind === -2) {
                            ind = -1;
                        }
                        ind += userNum;
                    }

                    if (userNum > 10 && ind >= 5) {
                        //var nowScrollTop=24* (ind-5);
                        $suggest.find(".autoCmt").scrollTop(24 * (ind - 5))
                    }

                    if (ind == 0) {
                        $suggest.find(".autoCmt").scrollTop(0)
                    }
                    selLi.removeClass("on");
                    $(selLi[ind]).addClass("on");
                }

            },

            //删除@后面的检索字符
            deleteRangeText: function(textArea, delCharL) {
                //光标位置
                var cursorSeat = getInsertPos(textArea),
                    textAreaScT = textArea.scrollTop,
                    textAreaVal = textArea.value;
                textArea.value = delCharL > 0 ? textAreaVal.slice(0, cursorSeat - delCharL) + textAreaVal.slice(cursorSeat) : textAreaVal.slice(0, cursorSeat) + textAreaVal.slice(cursorSeat - delCharL);
                setInsertPos(textArea, cursorSeat - (delCharL < 0 ? 0 : delCharL));
                firefox = /firefox/.test(navigator.userAgent.toLowerCase()) && setTimeout(function() {
                    if (textArea.scrollTop !== textAreaScT) {
                        textArea.scrollTop = textAreaScT;
                    }
                }, 10)
            },
            whole2sim: function(a, sp) {
                a = a.split(sp);
                for (var b = "", c = 0; c < a.length; ++c) b += a[c].charAt(0) || "?";
                return b.toLowerCase()
            },
            strEscapeReg: function(a) {
                for (var b = [], c = 0; c < a.length; c++) {
                    var g = a.charAt(c);
                    switch (g) {
                    case ".":
                    case "$":
                    case "^":
                    case "{":
                    case "[":
                    case "(":
                    case "|":
                    case ")":
                    case "*":
                    case "+":
                    case "?":
                    case "\\":
                        b.push("\\x" + g.charCodeAt(0).toString(16).toUpperCase());
                        break;
                    default:
                        b.push(g)
                    }
                }
                return b.join("")
            },
            sim: function(a, b) {
                var c = a.indexOf(b);
                return c == -1 ? null : [c, b.length]
            }
        };
        // This is the prefect get caret position function.
        // You can use it cross browsers.


        function getInsertPos(textbox) {
            var iPos = 0;
            if(document.selection)
            {
                textbox.focus();
                var range = document.selection.createRange();
                var rangeCopy = range.duplicate();
                rangeCopy.moveToElementText(textbox);
                while (range.compareEndPoints("StartToStart", rangeCopy) > 0) {
                    range.moveStart("character", -1);
                    iPos++;
                }
            }else if(textbox.selectionStart || textbox.selectionStart == "0")
            {
                iPos = textbox.selectionStart; 
            };
            return iPos;
        }

        // This is the prefect set caret position function.
        // You can use it cross browsers.


        function setInsertPos(textbox, iPos) {
            //console.log(iPos)
            textbox.focus();
            if (textbox.selectionStart || textbox.selectionStart == "0") {
                textbox.selectionStart = iPos;
                textbox.selectionEnd = iPos;
            } else if (document.selection) {
                var range = textbox.createTextRange();
                range.moveStart("character", iPos);
                range.collapse(true);
                range.select();
            }
        }

        function isGreateMaxLength(strValue, strDelete) {
            var maxLength = opts.cjk ? opts.maxLength * 2 : opts.maxLength;
            if (maxLength > 0) {
                var valueLength = (opts.cjk ? strValue.replace(replaceCJK, "lv") : strValue).replace(/\r/g, "").length;
                var deleteLength = (strDelete ? (opts.cjk ? strDelete.replace(replaceCJK, "lv") : strDelete).replace(/\r/g, "").length : 0);

                return valueLength - deleteLength > maxLength;
            } else {
                return false;
            }
        }

        function fixLength(textbox) {
            var maxLength = opts.cjk ? opts.maxLength * 2 : opts.maxLength;
            if (maxLength > 0) {
                var strValue = textbox.value.replace(/\r/g, "");
                if (isGreateMaxLength(strValue)) {
                    if (opts.cjk) {
                        for (var i = 0, index = 0; i < maxLength; index++) {
                            if (testCJK.test(strValue.charAt(index))) {
                                i += 2;
                            } else {
                                i += 1;
                            }
                        }
                        maxLength = index;
                    }

                    textbox.value = strValue.substr(0, maxLength);
                }
            }
        }
        //用户列表键盘操作，向下，向上，回车等等。


        function keydowninputHandler(event) {
            h = (event.ctrlKey || event.metaKey) && event.keyCode === 65 || event.shiftKey && (event.keyCode === 37 || event.keyCode === 39) ? !1 : !0;
            if ($suggest && $suggest.is(":visible") && $suggest.find("ul").length) switch (event.keyCode) {
            case 32:
                $suggest.hide();
                break;
            case 38:
                event.preventDefault();
                pluginFun.moveSelectedItem(-1);
                break;
            case 40:
                event.preventDefault();
                pluginFun.moveSelectedItem(1);
                break;
            case 9:
            case 13:
                event.preventDefault()
            }

        }

        function inputHandler(event) {
            // truck extra input text
            var strValue = this.value.replace(/\r/g, "");
            if (!opts.wild && isGreateMaxLength(strValue)) {
                // remember the scroll top position.
                var scrollTop = this.scrollTop,
                    insertPos = getInsertPos(this),
                    deleteLength = 0;

                if (opts.cjk) {
                    var overLength = strValue.replace(replaceCJK, "lv").length - opts.maxLength * 2;
                    for (var i = 0; i < overLength; deleteLength++) {
                        if (testCJK.test(strValue.charAt(insertPos - deleteLength - 1))) {
                            i += 2;
                        } else {
                            i += 1;
                        }
                    }
                } else {
                    deleteLength = strValue.length - opts.maxLength;
                }

                var iInsertToStartLength = insertPos - deleteLength;
                this.value = strValue.substr(0, iInsertToStartLength) + strValue.substr(insertPos);
                setInsertPos(this, iInsertToStartLength);

                // set back the scroll top position.
                this.scrollTop = scrollTop;
            }

            if (opts.ATtag) 
            { 
                //光标位置
                var offset = getInsertPos(this);
                //光标位置最后一个字符
                var preChar = event.target.value.charAt(offset - 1);
                event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 13 && event.keyCode !== 16 && event.keyCode !== 9 && getATData(this, preChar, offset);
                (event.keyCode === 9 || event.keyCode === 13) && $suggest && $suggest.find(".on").size() && $suggest.is(":visible") && selSuggestList(this);
            }
            //自动撑高
            var maxHeight = opts.maxHeight;
            if (maxHeight && jQuery.type(maxHeight) === "number") {
                autoTextarea(this, maxHeight);
            }

            if ($.isFunction(opts.onInput)) {
                // callback for input handler
                opts.onInput.call(this, event, {
                    maxLength: opts.maxLength,
                    leftLength: getLeftLength(this)
                });
            }
        }

        function getSelectedText(textbox) {
            var strText = "";
            if (textbox.selectionStart || textbox.selectionStart == "0") {
                strText = textbox.value.substring(textbox.selectionStart, textbox.selectionEnd);
            } else {
                strText = document.selection.createRange().text;
            }
            return strText.replace(/\r/g, "");
        }
        //获取@用户ID //regexpATUserID


        function getATUserID(textbox) {
            if (opts.ATtag) {
                var matchATusers1, matchATusersID = [];
                while (matchATusers1 = regexpATUserID.exec(textbox.value)) {
                    if (matchATusers1 != null) {
                        matchATusersID.push(matchATusers1[1]);

                    }
                }
            }
        }
        //获取剩余字符数
        function getLeftLength(textbox) {
            //var matchATusers=regexpAT.exec(textbox.value);
            var userIDLen = 0;
            if (opts.ATtag) {
                var matchATusers;
                while (matchATusers = regexpAT.exec(textbox.value)) {
                    if (matchATusers != null) {
                        userIDLen += matchATusers[1].length;

                    }
                }
            }


            if (opts.urlCharsTag) {
                var urls = textbox.value.match(regexp) || [];
                //console.log(urls);
                var urlsNum = urls.length;
                var urlLen = 0;
                for (var i = 0; i < urlsNum; i++) {
                    urlLen += urls[i].length
                }
                return opts.cjk ? Math.round(((opts.maxLength * 2 - textbox.value.replace(/\r/g, "").replace(replaceCJK, "lv").length) + urlLen + userIDLen) / 2) - 10 * urlsNum : opts.maxLength - textbox.value.replace(/\r/g, "").length;
            } else {
                return opts.cjk ? Math.round((opts.maxLength * 2 - textbox.value.replace(/\r/g, "").replace(replaceCJK, "lv").length + userIDLen) / 2) : opts.maxLength - textbox.value.replace(/\r/g, "").length;
            }

        }

        function autoTextarea(textbox, maxHeight) {
            var height, style = textbox.style;
            textbox.style.height = opts.minHeight + 'px';
            if (textbox.scrollHeight > opts.minHeight) {
                if (maxHeight && textbox.scrollHeight > maxHeight) {
                    height = maxHeight;
                    style.overflowY = 'scroll';
                } else {
                    height = textbox.scrollHeight;
                    style.overflowY = 'hidden';
                }
                style.height = height + 'px';
                textbox.currHeight = parseInt(style.height);
            }
        }

        function unbindEvents(textbox, opts) {
            $(textbox).unbind("paste", opts._pasteHandler).unbind("cut", opts._cutHandler).unbind("keyup", opts._keyupHandler).unbind("keydown", opts._keydownHandler).unbind("blur", opts._blurHandler).unbind("focus", opts._focusHandler);

        }

        function bindEvents(textbox, opts) {
            var $textbox = $(textbox);

            if (opts.maxLength < 0) {
                $textbox.bind("keyup", opts._keyupHandler);
            } else {
                $textbox.bind("paste", opts._pasteHandler).bind("cut", opts._cutHandler).bind("keyup", opts._keyupHandler).bind("keydown", opts._keydownHandler).bind("blur", opts._blurHandler).bind("focus", opts._focusHandler);
                if (!opts.wild) {
                    fixLength(textbox);
                }
            }
        }

        function getATData(textArea, lastChar, mouseIndex) {
            //console.log(lastChar);
            //textArea this对象
            //lastChar:最后一个字符
            //mouseIndex:光标位置
            var textAreaVal = textArea.value,
                //最后一个@的位置
                lastATIndex = textAreaVal.substring(0, mouseIndex).lastIndexOf("@"),
                //最后一个@后面空格的位置
                lastATSpaceIndex = textAreaVal.substring(lastATIndex, mouseIndex).indexOf(" "),
                //光标在页面中的位置
                mouseOffset = {};
            //console.log(lastATIndex+"------"+textAreaVal.substring(lastATIndex, mouseIndex)+"-----|"+lastATSpaceIndex);


            function b(r) 
            {
                var o = {
                    info: {}
                },
                x = {
                    info: {}
                },
                v = {};

                if ($.isArray(r.info)) 
                {
                    for (var t = 0; t < r.info.length; ++t) 
                    {
                        o.info[r.info[t][0]] = r.info[t][1];
                        x.info[r.info[t][0]] = r.info[t][3];

                        if (r.info[t][2]) 
                        {
                            v[r.info[t][0]] = [r.info[t][2].toLowerCase(), pluginFun.whole2sim(r.info[t][2], "|"), r.info[t][3]]
                        }
                    }
                } else {
                    o = r
                }
                return [o, v, x]
            }

            schChar = textAreaVal.substring(lastATIndex + 1, mouseIndex);
            if (opts.mode === "complete") {
                if (lastChar === "@") {
                    mouseOffset = pluginFun.getCarePos(textArea, textAreaVal.substring(0, mouseIndex - 1));
                    showSuggest(textArea, mouseOffset);
                }
            }

            if (lastATIndex !== -1) {
                if (lastATSpaceIndex === -1) {
                    if (opts.mode === "complete" && schChar.length <= 10) {
                        mouseOffset = pluginFun.getCarePos(textArea, textAreaVal.substring(0, lastATIndex));
                        showSuggest(textArea, mouseOffset);
                        showSuggestTip()
                    }
                    if (!TD.localData.getItem("localDataTime") || (schChar && ((new Date).getTime() - TD.localData.getItem("localDataTime") > 432E5))) 
                    {

                        $.ajax({
                            url: opts.dataUrl,
                            dataType: "json",
                            type: "GET",
                            cache: false,
                            success: function(data) {
                                var localDataStr = JSON.stringify(data);

                                var r = b(data);

                                TD.localData.setItem(localDataKey, localDataStr);
                                TD.localData.setItem("localDataTime", (new Date).getTime());
                                showATList(schChar, r[0], r[1], r[2]);
                                showSuggest(textArea, mouseOffset);
                            },
                            error: function() {
                                $suggest && $suggest.hide();
                            }

                        });
                    } else {
                        var localDataJson = JSON.parse(TD.localData.getItem(localDataKey));
                        
                        var r = b(localDataJson);
                        showATList(schChar, r[0], r[1], r[2]);
                        showSuggest(textArea, mouseOffset);
                    }

                } else {
                    $suggest && $suggest.hide();
                }

            } else {
                $suggest && $suggest.hide();
            }
        }

        function showATList(schChar, uName, uIndex, uDept) 
        {
            var sChar = pluginFun.strEscapeReg(schChar),
                //转换@后输入的特殊字符，".,$,^,{,[,(,|,),*,+,?,\\"
                sCharRegExp = RegExp("(^" + sChar + ")", "i"),
                //匹配正则
                sCharRegExpGlobal = RegExp("(" + sChar + ")", "ig"),
                r = 10,
                uNameObj = uName.info,
                //用户名对象
                uNameArray = [],
                uIDArray = [],
                uIndex = uIndex || {},
                //v = {},
                itemNum = 0; //列表数
                
                //用户名部门
                uDeptObj = uDept.info;
            
            if (sChar)
            {
                //删除的时候显示
                for (var i in uNameObj) 
                {
                    if (itemNum >= opts.itemMax) {
                        break;
                    }
                    if (uNameObj[i] && (i.match(sCharRegExp) || uNameObj[i].match(sCharRegExp))) 
                    {
                        uNameArray.push(uNameObj[i].replace(sCharRegExp, "<b>" + RegExp.$1 + "</b>") + (i.substr(0, 1) == "*" ? '<em class="ico_qGroup"></em>' : ""));
                        uIDArray.push(i);
                        //v[i] = 1;
                        itemNum++;
                    }
                    //l++;
                }

                //
                if (itemNum < opts.itemMax) 
                {
                    var schCharLower = schChar.toLowerCase(); //小写的检索文本
                    for (i in uNameObj) {
                        if (itemNum >= opts.itemMax) {
                            break;
                        }
                        if (!(!uIndex[i])) 
                        {
                            if (r = pluginFun.sim(uIndex[i][1], schCharLower)) 
                            {
                                //console.log(uIndex[i]);

                                uNameArray.push(uNameObj[i].substring(0, r[0]) + "<b>" + uNameObj[i].substring(r[0], r[0] + r[1]) + "</b>" + uNameObj[i].substring(r[0] + r[1]) + (i.substr(0, 1) == "*" ? '<em class="ico_qGroup"></em>' : ""));

                                if($.inArray(i, uIDArray) == -1){
                                    uIDArray.push(i);
                                    itemNum++
                                }
                            }
                            //l++
                        }
                    }
                }
                if (itemNum < opts.itemMax) 
                {
                    for (i in uNameObj) 
                    {
                        if (itemNum >= opts.itemMax) {
                            break;
                        }
                        if (uNameObj[i] && (i.slice(1).match(sCharRegExpGlobal) || uNameObj[i].slice(1).match(sCharRegExpGlobal))) 
                        {

                            uNameArray.push(uNameObj[i].replace(sCharRegExpGlobal, "<b>" + RegExp.$1 + "</b>") + (i.substr(0, 1) == "*" ? '<em class="ico_qGroup"></em>' : ""));

                            if($.inArray(i, uIDArray) == -1){
                                uIDArray.push(i);
                                itemNum++
                            }
                        }
                        //l++
                    }
                }

            } else {
                //localTopKeyObj
                TD.localData.getItem(localTopKey) || TD.localData.setItem(localTopKey, "{}");

                //localTopKeyObj:本地TOP数据的json对象;localTopKeyObjArr: 本地TOP数据的json对象临时存储的用户ID数组
                if (!localTopKeyObj) {
                    localTopKeyObj = JSON.parse(TD.localData.getItem(localTopKey));
                }

                //localTopKeyObjArr: 本地TOP数据的json对象临时存储的用户ID数组
                $.each(localTopKeyObj, function(i, val) {
                    //如果该数据项已经存在，则不加人该数组
                    if (!localTopKeyObjArr.contains(i)) {
                        localTopKeyObjArr.push(i);
                    }
                });
                //localTopKeyArray本地TOP数据的json对象临时存储的用户ID数组和@次数数组
                //例如：[{account:"feiwen8772",count:2},{account:"yure",count:1}]
                var localTopKeyArray = [],
                    useraccount;
                for (useraccount in localTopKeyObj) {
                    localTopKeyArray.push({
                        account: useraccount,
                        count: localTopKeyObj[useraccount]
                    });
                }
                //console.log(localTopKeyObj);
                //localTopKeyArray排序
                localTopKeyArray = localTopKeyArray.sort(function(c, e) {
                    return e.count - c.count;
                });
                //本地TOP数据计数，
                var j = 0;
                for (var usersArrNum = localTopKeyArray.length; j < usersArrNum; j++) {
                    //如果本地TOP数据计数大于等于10，break
                    if (j >= r) {
                        break;
                    }
                    //userAccountItem 本地TOP数据数组中用户名
                    var userAccountItem = localTopKeyArray[j].account;
                    //uNameObj=uName.info,//用户名对象
                    var userNameItem = ""; //用户名
                    if (userNameItem = uNameObj[userAccountItem]) 
                    {

                        uNameArray.push(userNameItem);
                        itemNum++;
                        uIDArray.push(userAccountItem);
                        //v[p] = 1
                        //console.log(uNameArray);
                    }
                }
                //console.log(localTopKeyObjArr);
            }

            //var UserListHtml = '<div class="autoCmt"><ul><li>' +uNameArray.join('</li><li>') + "</li></ul></div>";
            var UserListHtml = '<div class="autoCmt"><ul>';
            $.each(uIDArray, function(index, val) {
                //console.log(uNameArray[index]);
                UserListHtml += '<li id="' + val + '">' + uNameArray[index] + " - " + uDeptObj[val] + '</li>';
            });
            UserListHtml += "</ul></div>";
            $suggest.append(UserListHtml);
            if (uNameArray.length > 10) {
                $suggest.find(".autoCmt").css({
                    "height": 260,
                    "overflow": "auto"
                });
            }
            $suggest.find("li").hasClass("on") || $suggest.find("li:first").attr("class", "on");
            userNum = $suggest.find("li").size();

        }
        //点击或者选取

        function selSuggestList(textArea) {
            var str = $suggest.find(".on").text() || "";
            var userID = $suggest.find(".on").attr("id");
            var userHTML = str.split(" ")[0];
            //userArray.push(userID + ":" + userName);
            //userArray = $.unique(userArray);
            //lp 删除掉之后不会出现IE插入@人之后，在前面的情况
            pluginFun.deleteRangeText(textArea, schChar.length);
            $suggest.hide();
            insertCon(textArea, userHTML + " ");
            localTopData(userID);

            //自动撑高
            var maxHeight = opts.maxHeight;
            if (maxHeight && jQuery.type(maxHeight) === "number") {
                autoTextarea(textArea, maxHeight);
            }
        }
        //本地Top值操作


        function localTopData(userID) {
            //判断@某人是否已经存在本地TOP值中，已经存在的话+1；
            if (!localTopKeyObjArr.contains(userID)) {
                localTopKeyObjArr.push(userID);
                localTopKeyObj[userID] = 1;
            } else {
                localTopKeyObj[userID] += 1;
            }
            //本地存储
            TD.localData.setItem(localTopKey, JSON.stringify(localTopKeyObj));
        }

        function showSuggestTip() {
            $suggest.html('<div class="bd">' + opts.tips + "</div>")
        }

        function showSuggest(textArea, mouseOffset) {
            //console.log(mouseOffset);
            $("#db-suggest-flist").remove();
            $suggest = $(".db-suggest-list");
            if (!$suggest.length) {
                $suggest = $('<div class="db-suggest-list suggest-overlay"></div>');
                $(textArea).parents(".wx_content_wrap").append($suggest);
            }
            var left = 0;
            if(mouseOffset.left + $suggest.outerWidth(true) > $(textArea).outerWidth(true)){
                left = $(textArea).outerWidth(true) - $suggest.outerWidth(true) - 10;
            }else{
                left = mouseOffset.left;
            }
            $suggest.css({
                top: mouseOffset.top + "px",
                left: left + "px"
            }).show();
            $suggest.find("li").click(function(event) {
                selSuggestList(textArea)
            });
            //鼠标选择用户
            $suggest.find("li").hover(function() {
                $(this).parent().children(".on").removeClass().end().end().toggleClass("on");
            });

        }

        //点击页面其他地方
        var thatTextArea = this;
        oBody.click(function(event) {
            //console.log(TD.isParent(event.target,thatTextArea[0]));
            if (!TD.isParent(event.target, thatTextArea[0])) {
                $suggest && $suggest.length && $suggest.hide();
            }
        });

        function insertCon(obj, strText, t, r) {
            if (opts.wild || !isGreateMaxLength(obj.value + strText, getSelectedText(obj))) {

                //过滤重复内容
                if (r) {
                    var strTextS = obj.value.indexOf(strText);
                    if (strTextS >= 0) {
                        obj.value = obj.value.replace(strText, "");
                        setInsertPos(obj, strTextS);
                    }
                }

                if (document.selection) {
                    obj.focus();
                    var range = document.selection.createRange();
                    range.text = strText;
                    //range.moveStart ('character', -l);
                    var wee = range.text.length;
                    if (t) {
                        var l = obj.value.length;
                        range.moveEnd("character", wee + t);
                        t <= 0 ? range.moveStart("character", wee - 2 * t - strText.length) : range.moveStart("character", wee - t - strText.length);
                        range.select();
                    }
                } else if (obj.selectionStart || obj.selectionStart == "0") {
                    var startPos = obj.selectionStart;
                    var endPos = obj.selectionEnd;
                    var scrollTop = obj.scrollTop;

                    obj.value = obj.value.substring(0, startPos) + strText + obj.value.substring(endPos, obj.value.length);
                    obj.focus();

                    var cPos = startPos + strText.length;
                    obj.selectionStart = cPos;
                    obj.selectionEnd = cPos;
                    obj.scrollTop = scrollTop;
                    if (t) {
                        obj.setSelectionRange(startPos - t, obj.selectionEnd + t);
                        obj.focus();
                    }
                } else {
                    obj.value += strText;
                    obj.focus();
                }

                // fired when insert text has finished
                if ($.isFunction(opts.onInput)) {
                    opts.onInput.call(this, {
                        type: "insert"
                    }, {
                        maxLength: opts.maxLength,
                        leftLength: getLeftLength(obj)
                    });
                }
            }
        }
        //获取@用户ID //regexpATUserID
        this.getATUserID = function() {
            var $textbox = this.filter("textarea");
            if (opts.ATtag) {
                var matchATusers, matchATusersID = [];
                while (matchATusers = regexpATUserID.exec($textbox.val())) {
                    if (matchATusers != null) {
                        matchATusersID.push(matchATusers[1]);

                    }
                }
            }
            return matchATusersID;
        };

        this.maxLength = function(maxLength) {
            if (maxLength) {
                opts.maxLength = maxLength;
                return this.filter("textarea").each(function() {
                    unbindEvents(this, $(this).data("textbox-opts"));
                    $(this).data("textbox-opts", opts);
                    bindEvents(this, opts);
                }).end();
            } else {
                return opts.maxLength;
            }
        };

        this.insertPos = function(value) {
            var $textbox = this.filter("textarea");

            if (typeof value == "undefined") {
                return $textbox.length ? getInsertPos($textbox[0]) : null;
            } else if ($textbox.length) {
                if (isString(value) && value.toLowerCase() == "start") {
                    value = 0;
                } else if (isString(value) && value.toLowerCase() == "end") {
                    value = $textbox[0].value.replace(/\r/g, "").length;
                }

                setInsertPos($textbox[0], Math.min(Math.max(parseInt(value) || 0, 0), $textbox[0].value.replace(/\r/g, "").length));
            }

            return this;
        };

        this.input = function(callback) {
            if ($.isFunction(callback)) {
                opts.onInput = callback;
                return this.filter("textarea").each(function() {
                    $(this).data("textbox-opts", opts);
                }).end();
            }

            return this;
        };

			this.fixLength = function() {
			   return this.filter("textarea").each(function() {
			       fixLength(this);
			   }).end();
			};

			this.insertText = function(strText, t, r) {
				strText = strText.replace(/\r/g, "");
				return this.filter("textarea").each(function() {
					insertCon(this, strText, t, r)
				}).end();
			};

			this.getContentLen = function() {
				var $textbox = this.filter("textarea");
				return getLeftLength($textbox[0]);
			};

			return this.filter("textarea").each(function() {
				var $textbox = $(this);

				if (settings) {
					if ($textbox.data("textbox-opts")) {
					  unbindEvents(this, $textbox.data("textbox-opts"));
					  $textbox.data("textbox-opts", opts);
					  bindEvents(this, opts);
					} else {
					  $textbox.data("textbox-opts", opts);
					  bindEvents(this, opts);
					}
				} else {
					if ($textbox.data("textbox-opts")) {
						opts = $textbox.data("textbox-opts");
					}
				}
			}).end();

        /*oBody.delegate(".suggest-overlay li","hover",function(){
        $(this).parent().children(".on").removeClass().end().end().toggleClass("on");
    });
    oBody.click(function() {
        $suggest && $suggest.length && $suggest.hide()
    });*/
    };
})(jQuery);