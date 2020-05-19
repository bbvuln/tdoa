/**
 * �ı����ַ����ж�,�����ı������ṩ���¼��ص������뷽������ɼ򵥵����뷴�����ַ����빦�ܡ�
 * ������
 * ��maxLength: -1,          //����ַ�
 *   onInput: null,         //�ص��¼�����
 *   cjk: false,            //true:��������Ϊһ���ַ�����Ӣ����Ϊ����ַ���Ҳ��������Ӣ���ַ���һ���ַ����㡣
 *   urlCharsTag:false,     //�Ƿ�����URL
 *   wild: false,           //�Ƿ��������ֳ�������ַ���������
 *   maxHeight,             //�ı����Ƿ��Զ��Ÿߣ�Ĭ�ϣ�null�����Զ��Ÿߣ�����Զ��Ÿ߱���������ֵ����ֵ��Ϊ�ı����Զ��Ÿߵ����߶�
 *   minHeight,             //�ı����Ĭ�ϸ߶ȣ�һ�㲻������
 *   ATtag,                 //�Ƿ���@���ܣ�Ĭ�ϣ�true��������false�رգ��ر�״̬�� mode��  itemCount�� customData������Ч
 *   mode��                 //@���ܼ������ݵķ�ʽ��Ĭ��  complete��Ŀǰֻ��Ĭ����ʽ
 *   itemCount              //@����ļ����ַ����������� ��Ĭ��10
 *   tips��                 //@��ʾ��
 *  ��
 */
 function isString(obj) {
    return typeof obj == "string" || Object.prototype.toString.call(obj) === "[object String]";
}

var localTopKeyObj = null,
    localTopKeyObjArr = [];
var localTopKey = "";
var localDataKey = ""; //key ��ʱ����

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
//�ж�:��ǰԪ���Ƿ��Ǳ�ɸѡԪ�ص���Ԫ��
jQuery.fn.isChildOf = function(b) {
    return (this.parents(b).length > 0);
};
//�ж�:��ǰԪ���Ƿ��Ǳ�ɸѡԪ�ص���Ԫ�ػ��߱���
jQuery.fn.isChildAndSelfOf = function(b) {
    return (this.closest(b).length > 0);
};
//����������Ƿ����ĳһ�
Array.prototype.contains = function(item) {
    return RegExp("\\b" + item + "\\b").test(this);
};

//ie ���ش洢UserData����
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
//JSON.stringify()��JSONתΪ�ַ�����JSON.parse()���ַ���תΪJSON��ʽ
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
            //����ַ�
            onInput: null,
            //�ص��¼�����
            cjk: false,
            //true:��������Ϊһ���ַ�����Ӣ����Ϊ����ַ���Ҳ��������Ӣ���ַ���һ���ַ����㡣
            urlCharsTag: false,
            //�Ƿ�����URL
            wild: false,
            //�Ƿ��������ֳ�������ַ���������
            maxHeight: null,
            //�ı����Ƿ��Զ��Ÿߣ�Ĭ�ϣ�null�����Զ��Ÿߣ�����Զ��Ÿ߱���������ֵ����ֵ��Ϊ�ı����Զ��Ÿߵ����߶�
            minHeight: $(this).height(),
            //�ı���ԭʼ�߶�
            //begin @ ����
            ATtag: false,
            dataUrl: "",
            mode: "complete",
            itemCount: 10,
            itemMax: 1E3,
            tips: null,
            //end @ ����
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
            //�����ҳ���е�λ��
            getCarePos: function(textArea, textAreaVal) {
                //imitateCursorģ�������
                var imitateCursor = $("<em>&nbsp;</em>"),
                    textArea = $(textArea),
                    textAreaSeat = textArea.offset(),
                    //imitateCursorģ����λ��
                    imitateCursorSeat = {};

                //console.log(scrollTop);
                //imitateTextarea ģ���ı���Ķ���
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
            //imitateTextarea ģ���ı������ʽ
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
            //�����û������滻@����ַ���
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

            //ɾ��@����ļ����ַ�
            deleteRangeText: function(textArea, delCharL) {
                //���λ��
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
        //�û��б���̲��������£����ϣ��س��ȵȡ�


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
                //���λ��
                var offset = getInsertPos(this);
                //���λ�����һ���ַ�
                var preChar = event.target.value.charAt(offset - 1);
                event.keyCode !== 38 && event.keyCode !== 40 && event.keyCode !== 13 && event.keyCode !== 16 && event.keyCode !== 9 && getATData(this, preChar, offset);
                (event.keyCode === 9 || event.keyCode === 13) && $suggest && $suggest.find(".on").size() && $suggest.is(":visible") && selSuggestList(this);
            }
            //�Զ��Ÿ�
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
        //��ȡ@�û�ID //regexpATUserID


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
        //��ȡʣ���ַ���
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
            //textArea this����
            //lastChar:���һ���ַ�
            //mouseIndex:���λ��
            var textAreaVal = textArea.value,
                //���һ��@��λ��
                lastATIndex = textAreaVal.substring(0, mouseIndex).lastIndexOf("@"),
                //���һ��@����ո��λ��
                lastATSpaceIndex = textAreaVal.substring(lastATIndex, mouseIndex).indexOf(" "),
                //�����ҳ���е�λ��
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
                //ת��@������������ַ���".,$,^,{,[,(,|,),*,+,?,\\"
                sCharRegExp = RegExp("(^" + sChar + ")", "i"),
                //ƥ������
                sCharRegExpGlobal = RegExp("(" + sChar + ")", "ig"),
                r = 10,
                uNameObj = uName.info,
                //�û�������
                uNameArray = [],
                uIDArray = [],
                uIndex = uIndex || {},
                //v = {},
                itemNum = 0; //�б���
                
                //�û�������
                uDeptObj = uDept.info;
            
            if (sChar)
            {
                //ɾ����ʱ����ʾ
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
                    var schCharLower = schChar.toLowerCase(); //Сд�ļ����ı�
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

                //localTopKeyObj:����TOP���ݵ�json����;localTopKeyObjArr: ����TOP���ݵ�json������ʱ�洢���û�ID����
                if (!localTopKeyObj) {
                    localTopKeyObj = JSON.parse(TD.localData.getItem(localTopKey));
                }

                //localTopKeyObjArr: ����TOP���ݵ�json������ʱ�洢���û�ID����
                $.each(localTopKeyObj, function(i, val) {
                    //������������Ѿ����ڣ��򲻼��˸�����
                    if (!localTopKeyObjArr.contains(i)) {
                        localTopKeyObjArr.push(i);
                    }
                });
                //localTopKeyArray����TOP���ݵ�json������ʱ�洢���û�ID�����@��������
                //���磺[{account:"feiwen8772",count:2},{account:"yure",count:1}]
                var localTopKeyArray = [],
                    useraccount;
                for (useraccount in localTopKeyObj) {
                    localTopKeyArray.push({
                        account: useraccount,
                        count: localTopKeyObj[useraccount]
                    });
                }
                //console.log(localTopKeyObj);
                //localTopKeyArray����
                localTopKeyArray = localTopKeyArray.sort(function(c, e) {
                    return e.count - c.count;
                });
                //����TOP���ݼ�����
                var j = 0;
                for (var usersArrNum = localTopKeyArray.length; j < usersArrNum; j++) {
                    //�������TOP���ݼ������ڵ���10��break
                    if (j >= r) {
                        break;
                    }
                    //userAccountItem ����TOP�����������û���
                    var userAccountItem = localTopKeyArray[j].account;
                    //uNameObj=uName.info,//�û�������
                    var userNameItem = ""; //�û���
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
        //�������ѡȡ

        function selSuggestList(textArea) {
            var str = $suggest.find(".on").text() || "";
            var userID = $suggest.find(".on").attr("id");
            var userHTML = str.split(" ")[0];
            //userArray.push(userID + ":" + userName);
            //userArray = $.unique(userArray);
            //lp ɾ����֮�󲻻����IE����@��֮����ǰ������
            pluginFun.deleteRangeText(textArea, schChar.length);
            $suggest.hide();
            insertCon(textArea, userHTML + " ");
            localTopData(userID);

            //�Զ��Ÿ�
            var maxHeight = opts.maxHeight;
            if (maxHeight && jQuery.type(maxHeight) === "number") {
                autoTextarea(textArea, maxHeight);
            }
        }
        //����Topֵ����


        function localTopData(userID) {
            //�ж�@ĳ���Ƿ��Ѿ����ڱ���TOPֵ�У��Ѿ����ڵĻ�+1��
            if (!localTopKeyObjArr.contains(userID)) {
                localTopKeyObjArr.push(userID);
                localTopKeyObj[userID] = 1;
            } else {
                localTopKeyObj[userID] += 1;
            }
            //���ش洢
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
            //���ѡ���û�
            $suggest.find("li").hover(function() {
                $(this).parent().children(".on").removeClass().end().end().toggleClass("on");
            });

        }

        //���ҳ�������ط�
        var thatTextArea = this;
        oBody.click(function(event) {
            //console.log(TD.isParent(event.target,thatTextArea[0]));
            if (!TD.isParent(event.target, thatTextArea[0])) {
                $suggest && $suggest.length && $suggest.hide();
            }
        });

        function insertCon(obj, strText, t, r) {
            if (opts.wild || !isGreateMaxLength(obj.value + strText, getSelectedText(obj))) {

                //�����ظ�����
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
        //��ȡ@�û�ID //regexpATUserID
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