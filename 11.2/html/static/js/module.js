var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko') && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var ua_match = /(trident)(?:.*rv:([\w.]+))?/.exec(userAgent) || /(msie) ([\w.]+)/.exec(userAgent);
var is_ie = ua_match && (ua_match[1] == 'trident' || ua_match[1] == 'msie') ? true : false;
if (typeof (LoadScript) != "function") {
    function LoadScript(url) {
        url = url.toLowerCase();
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var src = scripts[i].getAttribute('src');
            if (src) {
                src = src.toLowerCase();
                if (src == url || src + ".gz" == url || src == url + ".gz")
                    return;
            }
        }

        document.write('<scr' + 'ipt type="text/javascript" src="' + url + '"><\/scr' + 'ipt>');
        scripts = null;
    }
};

if (typeof (LoadCss) != "function") {
    function LoadCss(url) {
        url = url.toLowerCase();
        var links = document.getElementsByTagName('link');
        for (var i = 0; i < links.length; i++) {
            var href = links[i].getAttribute('href');
            if (href) {
                href = href.toLowerCase();
                if (href == url || href + ".gz" == url || href == url + ".gz")
                    return;
            }
        }

        document.write('<link href="' + url + '" type="text/css" rel="stylesheet" />');
        links = null;
    }
};

var gz_postfix = typeof (window.top.gz_postfix) == "string" ? window.top.gz_postfix : "";

function includesUser(current, selected){
    if(!current || !selected) return false
    var arr = selected.split(',');
	var newArr = [];
	for(var i=0; i<arr.length; i++){
		var item = arr[i]
		if(item != ''){
            newArr.push(item)
        }
	}
	var included = false
	for(var j=0; j<newArr.length; j++){
		var newitem = newArr[j]
		if(newitem == current){
			included = true
			break;
		}
	}
    return included
}
(function(window) {
    var Util = function() {

    }

    Util.prototype.hackRequestAnimationFrame = function(arguments) {
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        // requestAnimationFrame的回退
        if (!window.requestAnimationFrame) {
            var lastTime = 0;
            window.requestAnimationFrame = function(callback) {
                var now = new Date().getTime();
                var time = Math.max(16 - now - lastTime, 0);
                var id = setTimeout(callback, time);
                lastTime = now + time;
                return id;
            }
        }
    }

    Util.prototype.hackTransform = function() {
        // 兼容transform和WebkitTransform
        var docElem = document.documentElement;
        this.transformProperty = typeof docElem.style.transform == 'string' ?
            'transform' : 'WebkitTransform';
    }

    Util.prototype.hackEventListener = function() {
        if (document.addEventListener) this.eventListener = true;
    }

    Util.prototype.hackStyle = function(elem) {
        // 兼容IE8的样式获取
        if (window.getComputedStyle) {
            return window.getComputedStyle(elem);
        } else {
            return elem.currentStyle;
        }
    }

    // Draggable
    var Draggable = function(elem, options) {
        this.options = options || {};
        this.options.elemString = elem;
        this.init();
    }
    // 为了兼容IE8 只能放弃使用Object.create()实现继承
    var proto = Draggable.prototype = new Util();

    proto.init = function() {
        var context = this;
        this.setTargetDom();
        this.hackEventListener();
        if (!this.eventListener) this.options.backToPosition = true;
        if (this.eventListener) {
            this.elem.addEventListener('mousedown', this);
        } else {
            this.bindAttach();
            // 为了兼容IE8 优雅的代码全部需要改写
            this.elem.attachEvent('onmousedown', this.b_mousedown);
        }
        if (!this.options.cursorCancel) this.elem.style.cursor = 'move';
    }
    proto.setTargetDom = function() {
        this.elem = this.getDom(this.options.elemString);
        this.parentMove = this.getDom(this.options.parentMove);
        // 如果参数使用了parentMove接口，那么就使用parentMove作为拖拽的目标元素
        this.targetDom = this.parentMove || this.elem;
    }
    proto.getDom = function(elem) {
        if (typeof elem === 'string') {
            return document.querySelector(elem);
        } else {
            return elem;
        }
    }
    proto.bindAttach = function() {
        // bindAttach只是为了方便IE8下的事件绑定而写的一个方法 可以省略
        var context = this;
        var type = ['mousedown', 'mousemove', 'mouseup'];
        for (var i = 0, len = type.length; i < len; i++) {
            this['b_' + type[i]] = (function(i) {
                return function() {
                    context.event = window.event;
                    context[type[i]]();
                }
            }(i))
        }
    }
    proto.dragDown = function(event) {
        this.enable = true;
        this.hackTransform();
        this.addClassName();
        this.setIndex();
        this.style = this.hackStyle(this.targetDom);
        this.targetPosition = this.getPosition(this.style);
        this.startPoint = this.getCoordinate();
        this.movePoint = {
            x: 0,
            y: 0
        };
        this.setPositionProperty();
        this.bindCallBackEvent();
        this.render();
    }
    proto.addClassName=function(){
        if (this.options.addClassName) this.elem.className += ' ' + this.options.addClassName;
    }
    proto.setIndex=function(){
        // this.elem.style.zIndex=2147483647;
    }
    // 需要把transform上设置的值暂时转换到使用position属性实现
    // 这是为了方便拖拽过程中拖拽动画的实现 如果看的不太明白可以先行略过
    proto.getPosition = function(style) {
        var position = {};
        position.x = style.left == 'auto' ? 0 : parseInt(style.left, 10);
        position.y = style.top == 'auto' ? 0 : parseInt(style.top, 10);
        // 如果设置了backToPosition属性，那么我们就不需要修改初始的transform属性，直接跳出函数
        if (this.options.backToPosition) return position;
        position = this.addTransform(position);
        return position;
    }
    proto.addTransform = function(position) {
        var transform = this.style[this.transformProperty];
        if (!transform || transform.indexOf('matrix') == '-1') {
            // 如果当前元素没有设置transform属性，那么我们可以直接返回position
            return position;
        }
        // 如果是2D的transform，那么translate的值的索引以4开始，否则就是3D，以12开始
        var translateIndex = transform.indexOf('matrix3d') == '-1' ? 4 : 12;
        var transformArray = transform.split(',');
        this.translateX = parseInt(transformArray[translateIndex], 10);
        this.translateY = parseInt(transformArray[translateIndex + 1], 10);
        position.x += this.translateX;
        position.y += this.translateY;
        return position;
    }
    // 获取鼠标的坐标
    proto.getCoordinate = function() {
        if (this.eventListener) {
            return {
                // 最后的0是为了避免当 this.event.pageX==0 的时候会取 touches[0] 的值
                x: this.event.pageX || (this.event.touches && this.event.touches[0].pageX) || 0,
                y: this.event.pageY || (this.event.touches && this.event.touches[0].pageY) || 0
            }
        } else {
            return {
                // 兼容IE8的鼠标位置获取
                x: this.event.clientX + document.documentElement.scrollLeft,
                y: this.event.clientY + document.documentElement.scrollTop
            }
        }
    }
    proto.setPositionProperty = function() {
        var p = {
            fix: true,
            absolute: true,
            relative: true
        };
        if (!p[this.style.position]) {
            this.targetDom.style.position = 'fixed';
        }
        this.targetDom.style.cssText+=';'+'left:'+this.targetPosition.x + 'px;top:'+this.targetPosition.y + 'px;';
    }
    // 绑定之后的事件 比如mousemove和mouseup
    proto.bindCallBackEvent = function() {
        var context = this;
        var type = this.event.type;
        var handleObj = {
            mousedown: ['mousemove', 'mouseup'],
            touchstart: ['touchmove', 'touchend']
        }
        var handles = handleObj[type];
        this.handles = handles;
        // true绑定事件 false解绑事件
        this.bindEvent(true);
    }
    proto.bindEvent = function(isBind) {
        var context = this;
        var handles = this.handles;
        if (this.eventListener) {
            var eventListener = isBind ? 'addEventListener' : 'removeEventListener';
            handles.forEach(function(handle) {
                window[eventListener](handle, context);
            })
        } else {
            var eventListener = isBind ? 'attachEvent' : 'detachEvent';
            document[eventListener]('onmousemove', this.b_mousemove);
            document[eventListener]('onmouseup', this.b_mouseup);
        }
    }
    proto.render = function() {
        var context = this
        this.hackRequestAnimationFrame();
        this._render = function() {
            if (!context.enable) {
                // 通过直接return取消定时器
                return;
            }
            context.setTransform();
            requestAnimationFrame(context._render);
        }
        requestAnimationFrame(this._render);
    }
    proto.setTransform = function() {
        if (this.options.backToPosition) {
            this.targetDom.style[this.transformProperty] = 'translate3d(' + this.movePoint.x + 'px,' + this.movePoint.y + 'px,' + '0)';
        } else {
            var cssString = 'left:' + (this.movePoint.x + this.targetPosition.x) + 'px;top:' + (this.movePoint.y + this.targetPosition.y) + 'px;';
            // cssText会覆盖原样式 所以需要写+ 另外;是为了兼容IE8的cssText不返回; 不加上会出BUG
            this.targetDom.style.cssText += ';' + cssString;
        }
    }
    proto.dragMove = function() {
        var vector = this.getCoordinate();
        var moveVector = {
            x: vector.x - this.startPoint.x,
            y: vector.y - this.startPoint.y
        }
        moveVector = this.setGrid(moveVector);
        this.movePoint.x = this.options.axis == 'y' ? 0 : moveVector.x;
        this.movePoint.y = this.options.axis == 'x' ? 0 : moveVector.y;
    }
    proto.setGrid = function(moveVector) {
        if (!this.options.grid) return moveVector;
        var grid = this.options.grid;
        var vector = {};
        vector.x = grid.x ? Math.round(moveVector.x / grid.x) * grid.x : moveVector.x;
        vector.y = grid.y ? Math.round(moveVector.y / grid.y) * grid.y : moveVector.y;
        return vector;
    }
    proto.dragUp = function() {
        var context = this;
        this.enable = false;
        this.removeClassName();
        this.bindEvent(false);
        this.resetIndex();
        if (this.options.backToPosition) return;
        this.resetPosition();
    }
    proto.removeClassName=function(){
        if (this.options.addClassName) {
            var re = new RegExp("(?:^|\\s)" + this.options.addClassName + "(?:\\s|$)", "g");
            this.elem.className = this.elem.className.replace(re, '');
        }
    }
    proto.resetIndex=function(){
        // this.elem.style.zIndex='';
    }
    proto.resetPosition = function() {
        this.endPoint = {
            x: this.movePoint.x + this.targetPosition.x,
            y: this.movePoint.y + this.targetPosition.y
        }
        this.targetDom.style.cssText+=';left:'+this.endPoint.x + 'px;top:'+this.endPoint.y + 'px';
    }

    proto.touchstart = function(event) {
        this.dragDown(event);
    }
    proto.mousedown = function() {
        this.dragDown();
    }
    proto.mousemove = function() {
        this.dragMove();
    }
    proto.touchmove = function() {
        this.dragMove();
    }
    proto.mouseup = function() {
        this.dragUp();
    }
    proto.touchend = function() {
        this.dragUp();
    }
    // 通过handleEvent绑定事件
    proto.handleEvent = function(event) {
        this.event = event;
        var type = this.event.type;
        if (type) this[type]();
    }
    window.Draggable = Draggable;
}(window))


//通过js来添加选人控件需要的css样式
LoadCss('/static/common/userselect.css' + gz_postfix + '?20180116');

//选人控件角色、分组里面左侧选项点击之后增加相应的active
function leftItem() {
    var self = this
    if (jQuery(self).hasClass("active")) {
        return;
    } else {
        jQuery(self).parent().children(".block-left-item").removeClass("active");
        jQuery(self).addClass("active");
    }
};

//角色左边点击之后触发的ajax（获得数据填装角色右边）
function privAjax(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    var funcId = jQuery(".alert-modal-box").data("func_id");
    var moduleId = jQuery(".alert-modal-box").data("module_id");
    var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
    var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
    var useUid = jQuery(".alert-modal-box").data("use_uid");
    var privOp = jQuery(".alert-modal-box").data("priv_op");
    if (jQuery("#priv_item .block-right-header[title=" + jQuery(self).attr("title") + "]").length > 0) {
        jQuery("#priv_item").children().hide();
        jQuery("#priv_item .block-right-header[title=" + jQuery(self).attr("title") + "]").parent().show();
        return;
    }
    if (jQuery(".alert-modal-box").data("use_uid") == 1) {
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {
                ACTION: "bypriv",
                USER_PRIV: jQuery(self).attr("item_id"),
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    jQuery("#priv_item").children().hide();
                    jQuery("#priv_item .message").show();
                    jQuery("#priv_item .message").text(msg.msg);
                    return;
                } else if (msg.status == 1) {
                    jQuery("#priv_item").children().hide();
                    if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                        jQuery("#priv_item").append("<div class='block-right' id=priv_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>")
                    } else {
                        jQuery("#priv_item").append("<div class='block-right' id=priv_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div></div>")
                    }
                    jQuery.each(msg.data, function (index, element) {
                        if (element.priv_id == jQuery(self).attr("item_id")) {
                            jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' priv_special=" + element.user_id + "></span><span class='real-name'>" + element.user_name + "</span></div>");
                        } else {
                            if (jQuery("#priv_item_" + jQuery(self).attr("item_id")).find(".block-right-header[title='辅助角色']").length > 0) {
                                jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' priv_special=" + element.user_id + "></span><span class='real-name'>" + element.user_name + "</span></div>");
                            } else {
                                jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-header' style='margin-top:10px;' title='辅助角色'>辅助角色</div>");
                                jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' priv_special=" + element.user_id + "></span><span class='real-name'>" + element.user_name + "</span></div>");
                            }
                        }
                        var current = element.uid;
                        var selected = jQuery("input[name=" + id + "]").val();
                        var findIt = includesUser(current, selected)
                        if(findIt){
                            if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                return;
                            } else {
                                jQuery(".block-right-item[item_id='" + element.uid + "']").addClass("active");
                            }
                        }
                        if (element.attend_status != "") {
                            jQuery("#priv_item_" + jQuery(self).attr("item_id")).find(".block-right-item[item_id='" + element.uid + "']").append("<span class='status'> (" + element.attend_status + ")</span>")
                        }
                    })
                }
            }
        })
    } else {
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {
                ACTION: "bypriv",
                USER_PRIV: jQuery(self).attr("item_id"),
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    jQuery("#priv_item").children().hide();
                    jQuery("#priv_item .message").show();
                    jQuery("#priv_item .message").text(msg.msg);
                    return;
                } else if (msg.status == 1) {
                    jQuery("#priv_item").children().hide();
                    if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                        jQuery("#priv_item").append("<div class='block-right' id=priv_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>")
                    } else {
                        jQuery("#priv_item").append("<div class='block-right' id=priv_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div></div>")
                    }
                    jQuery.each(msg.data, function (index, element) {
                        if (element.priv_id == jQuery(self).attr("item_id")) {
                            jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' priv_special=" + element.user_id + "></span><span class='real-name'>" + element.user_name + "</span></div>");
                        } else {
                            if (jQuery("#priv_item_" + jQuery(self).attr("item_id")).find(".block-right-header[title='辅助角色']").length > 0) {
                                jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' priv_special=" + element.user_id + "></span><span class='real-name'>" + element.user_name + "</span></div>");
                            } else {
                                jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-header' style='margin-top:10px;' title='辅助角色'>辅助角色</div>");
                                jQuery("#priv_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name' priv_special=" + element.user_id + "></span><span class='real-name'>" + element.user_name + "</span></div>");
                            }
                        }

                        var current = element.user_id;
                        var selected = jQuery("input[name=" + id + "]").val();
                        var findIt = includesUser(current, selected)
                        if(findIt){
                            if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                return;
                            } else {
                                jQuery(".block-right-item[item_id='" + element.user_id + "']").addClass("active");
                            }
                        }
                        if (element.attend_status != "") {
                            jQuery("#priv_item_" + jQuery(self).attr("item_id")).find(".block-right-item[item_id=\'" + element.user_id + "\']").append("<span class='status'> (" + element.attend_status + ")</span>")
                        }
                    })
                }
            }
        })
    }
};

//分组左边点击之后触发的ajax（获得数据填装分组右边）
function groupAjax(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    var funcId = jQuery(".alert-modal-box").data("func_id");
    var moduleId = jQuery(".alert-modal-box").data("module_id");
    var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
    var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
    var useUid = jQuery(".alert-modal-box").data("use_uid");
    var privOp = jQuery(".alert-modal-box").data("priv_op");
    if (jQuery("#" + jQuery(self).attr("block") + "_item .block-right-header[title=" + jQuery(self).attr("title") + "]").length > 0) {
        jQuery("#" + jQuery(self).attr("block") + "_item").children().hide();
        jQuery("#" + jQuery(self).attr("block") + "_item .block-right-header[title=" + jQuery(self).attr("title") + "]").parent().show();
        return;
    }
    if (jQuery(".alert-modal-box").data("use_uid") == 1) {
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {
                ACTION: "bygroup",
                GROUP_ID: jQuery(self).attr("item_id"),
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    jQuery("#" + jQuery(self).attr("block") + "_item").children().hide();
                    jQuery("#" + jQuery(self).attr("block") + "_item .message").show();
                    jQuery("#" + jQuery(self).attr("block") + "_item .message").text(msg.msg);
                    return;
                } else if (msg.status == 1) {
                    jQuery("#group_item").children().hide();
                    if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                        jQuery("#group_item").append("<div class='block-right' id=group_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>")
                    } else {
                        jQuery("#group_item").append("<div class='block-right' id=group_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div></div>")
                    }
                    jQuery.each(msg.data, function (index, element) {
                        if (element.attend_status == "") {
                            jQuery("#group_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>");
                        } else {
                            jQuery("#group_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>");
                        }
                        var current = element.uid;
                        var selected = jQuery("input[name=" + id + "]").val();
                        var findIt = includesUser(current, selected)
                        if(findIt){
                            if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                return;
                            } else {
                                jQuery(".block-right-item[item_id='" + element.uid + "']").addClass("active");
                            }
                        }
                    })
                }
            }
        })
    } else {
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {
                ACTION: "bygroup",
                GROUP_ID: jQuery(self).attr("item_id"),
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    jQuery("#" + jQuery(self).attr("block") + "_item").children().hide();
                    jQuery("#" + jQuery(self).attr("block") + "_item .message").show();
                    jQuery("#" + jQuery(self).attr("block") + "_item .message").text(msg.msg);
                    return;
                } else if (msg.status == 1) {
                    jQuery("#group_item").children().hide();
                    if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                        jQuery("#group_item").append("<div class='block-right' id=group_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>")
                    } else {
                        jQuery("#group_item").append("<div class='block-right' id=group_item_" + jQuery(self).attr("item_id") + "><div class='block-right-header' title=" + jQuery(self).find("span").text() + ">" + jQuery(self).find("span").text() + "</div></div>")
                    }
                    jQuery.each(msg.data, function (index, element) {
                        if (element.attend_status == "") {
                            jQuery("#group_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>");
                        } else {
                            jQuery("#group_item_" + jQuery(self).attr("item_id")).append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>");
                        }
                        var current = element.user_id;
                        var selected = jQuery("input[name=" + id + "]").val();
                        var findIt = includesUser(current, selected)
                        if(findIt){
                            if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                return;
                            } else {
                                jQuery(".block-right-item[item_id='" + element.user_id + "']").addClass("active");
                            }
                        }
                    })
                }
            }
        })
    }
};

//全部添加的点击事件
function addAll(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    if (jQuery(".alert-modal-box").attr("data-select-dept") == "selectdept" && jQuery("input[name=" + id + "]").val() == "ALL_DEPT" || jQuery("input[name=" + id + "]").val() == "ALL_DEPT,") {
        if (typeof (org_select_callbacks) == 'object') {
            org_select_callbacks.remove && org_select_callbacks.remove.apply(this,["ALL_DEPT", "全体部门"]);
        }
        jQuery("input[name=" + id + "]").val("");
        jQuery("textarea[name=" + name + "]").val("");
        jQuery("input[name=" + name + "]").val("");
        userSaveAndBind[id] = [];
        userSaveAndBind[name] = [];
        jQuery.each(jQuery(self).parent().find(".block-right-item"), function (index, element) {
            if (jQuery(element).hasClass("active")) {
                return;
            } else {
                jQuery(element).addClass("active");
                userSaveAndBind[id].push(jQuery(element).attr("item_id"));
                userSaveAndBind[name].push(jQuery(element).find("span.real-name").text());
                if (typeof (org_select_callbacks) == 'object') {
                    org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(element).attr("item_id"), jQuery(element).find("span.real-name").text()]);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name").toString() + "]").find("a.close").attr("data-to-id", id);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name").toString() + "]").find("a.close").data("to-id", id);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name").toString() + "]").find("a.close").attr("data-to-name", name);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name").toString() + "]").find("a.close").data("to-name", name);
                }
            }
        });
        jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString() + ",");
        jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
    } else {
        jQuery.each(jQuery(self).parent().find(".block-right-item"), function (index, element) {
            if (jQuery(element).hasClass("active")) {
                return;
            } else {
                jQuery(element).addClass("active");
                userSaveAndBind[id].push(jQuery(element).attr("item_id"));
                userSaveAndBind[name].push(jQuery(element).find("span.real-name").text());
                if (typeof (org_select_callbacks) == 'object') {
                    org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(element).attr("item_id"), jQuery(element).find("span.real-name").text()]);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name") + "]").find("a.close").attr("data-to-id", id);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name") + "]").find("a.close").data("to-id", id);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name") + "]").find("a.close").attr("data-to-name", name);
                    jQuery("input#" + id).parent().find("span[data-tag-text=" + jQuery(element).attr("item_name") + "]").find("a.close").data("to-name", name);
                }
            }
        });
        jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString() + ",");
        jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
		
		//修正选人控件在部门tab下全部添加后，已选中的人在在线tab中未选中，而造成重复选择的问题
		jQuery.each(jQuery(self).parent().find(".block-right-item"), function (index, element) {
            var item_id = jQuery(element).attr('item_id');
            var current = item_id;
            var selected = jQuery("input[name=" + id + "]").val();
            var findIt = includesUser(current, selected)
            if(findIt){
                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
					return;
				} else {
					jQuery(".block-right-item[item_id='" + item_id + "']").addClass("active");
				}
            }
		});
    }
};

//全部删除的点击事件
function deleteAll(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    if(jQuery("input[name=" + id + "]").val() == "ALL_DEPT") {
        if (typeof (org_select_callbacks) == 'object') {
            org_select_callbacks.remove && org_select_callbacks.remove.apply(this, ["ALL_DEPT", "全体部门"]);
        }
        userSaveAndBind[id] = [];
        userSaveAndBind[name] = [];
        jQuery("input[name=" + id + "]").val("");
        jQuery("textarea[name=" + name + "]").val("");
        jQuery("input[name=" + name + "]").val("");
        return;
    } else {
        jQuery.each(jQuery(self).parent().find(".block-right-item"), function (index, element) {
            jQuery(".block-right-item[item_id='" + jQuery(element).attr("item_id") + "']").removeClass("active");
            if (typeof (org_select_callbacks) == 'object') {
                org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [jQuery(element).attr("item_id"), jQuery(element).find("span.real-name").text()]);
            }
            userSaveAndBind.removeByValue(userSaveAndBind[id], jQuery(element).attr("item_id"));
            userSaveAndBind.removeByValue(userSaveAndBind[name], jQuery(element).find("span.real-name").text());
        })
        jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString() + ",");
        jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        if (jQuery("input[name=" + id + "]").val() == "," || jQuery("textarea[name=" + name + "]").val() == "," || jQuery("input[name=" + name + "]").val() == ",") {
            jQuery("input[name=" + id + "]").val("");
            jQuery("textarea[name=" + name + "]").val("");
            jQuery("input[name=" + name + "]").val("");
        }
    }
};

//所以右侧、人的点击事件
function rightItemClick(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    if (jQuery(self).hasClass("active")) {
        jQuery(".block-right-item[item_id='" + jQuery(self).attr("item_id") + "']").removeClass("active");
        if (typeof (org_select_callbacks) == 'object') {
            org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [jQuery(self).attr("item_id"), jQuery(self).find("span.real-name").text()]);
        }
        userSaveAndBind.removeByValue(userSaveAndBind[id], jQuery(self).attr("item_id"));
        userSaveAndBind.removeByValue(userSaveAndBind[name], jQuery(self).find("span.real-name").text());
        jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString() + ",");
        jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        jQuery("textarea[name=" + name + "]").text(userSaveAndBind[name].toString() + ",");
        jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        if (jQuery("input[name=" + id + "]").val() == "," || jQuery("textarea[name=" + name + "]").val() == "," || jQuery("input[name=" + name + "]").val() == ",") {
            jQuery("input[name=" + id + "]").val("");
            jQuery("textarea[name=" + name + "]").val("");
            jQuery("input[name=" + name + "]").val("");
        }
    } else {
        jQuery(".block-right-item[item_id='" + jQuery(self).attr("item_id") + "']").addClass("active");
        if (userSaveAndBind[id] == "ALL_DEPT") {
            if (typeof (org_select_callbacks) == 'object') {
                org_select_callbacks.remove && org_select_callbacks.remove.apply(this, ["ALL_DEPT", "全体部门"]);
                org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(self).attr("item_id"), jQuery(self).find("span.real-name").text()]);
                jQuery("input#" + id).parent().find("a.close").attr("data-to-id", id);
                jQuery("input#" + id).parent().find("a.close").data("to-id", id);
                jQuery("input#" + id).parent().find("a.close").attr("data-to-name", name);
                jQuery("input#" + id).parent().find("a.close").data("to-name", name);
            }
            userSaveAndBind[id] = [];
            userSaveAndBind[name] = [];
            userSaveAndBind[id].push(jQuery(self).attr("item_id"));
            userSaveAndBind[name].push(jQuery(self).attr("item_name"));
            jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString() + ",");
            jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
            jQuery("textarea[name=" + name + "]").text(userSaveAndBind[name].toString() + ",");
            jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        } else {
            userSaveAndBind[id].push(jQuery(self).attr("item_id"));
            userSaveAndBind[name].push(jQuery(self).find("span.real-name").text());
            if (typeof (org_select_callbacks) == 'object') {
                jQuery("input#" + id).parent().find("a.close").attr("data-to-id", id);
                jQuery("input#" + id).parent().find("a.close").data("to-id", id);
                jQuery("input#" + id).parent().find("a.close").attr("data-to-name", name);
                jQuery("input#" + id).parent().find("a.close").data("to-name", name);
                org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(self).attr("item_id"), jQuery(self).find("span.real-name").text()]);
            }
            jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString() + ",");
            jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
            jQuery("textarea[name=" + name + "]").text(userSaveAndBind[name].toString() + ",");
            jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString() + ",");
        }
    }
};

var module_searchtimer = null;
//搜索框的输入事件
function keyUP(e) {
    jQuery(".main-block").css("display", "none");
    jQuery("#block_query").css("display", "block");
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    var funcId = jQuery(".alert-modal-box").data("func_id");
    var moduleId = jQuery(".alert-modal-box").data("module_id");
    var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
    var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
    var useUid = jQuery(".alert-modal-box").data("use_uid");
    var privOp = jQuery(".alert-modal-box").data("priv_op");
    if (jQuery(".alert-modal-box").data("use_uid") == 1) {
		module_searchtimer && clearTimeout(module_searchtimer);
		module_searchtimer = setTimeout(function ()
		{
			jQuery.ajax({
				type: "POST",
				url: "/module/user_select/data.php",
				data: {
					ACTION: "query",
					KEYWORD: jQuery(self).val(),
					FUNC_ID: funcId,
					MODULE_ID: moduleId,
					PRIV_NO_FLAG: privNoFlag,
					MANAGE_FLAG: manageFlag,
					USE_UID: useUid,
					PRIV_OP: privOp
				},
				dataType: "json",
				success: function (msg) {
					jQuery("#navMenu a").removeClass("active");
					if (msg.status == 0) {
						jQuery("#query_item_0").html("");
						jQuery("#query_item_0").append("<div class='block-right' id='query_item_0'><div class='message'>无符合条件的用户</div></div>");
						return;
					} else {
						jQuery("#query_item_0").html("");
						if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
							jQuery("#query_item_0").append("<div class='block-right-header' title='查询人员'>查询人员</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div>");
						} else {
							jQuery("#query_item_0").append("<div class='block-right-header' title='查询人员'>查询人员</div>");
						}
						jQuery.each(msg.data, function (index, element) {
							if (element.attend_status == "") {
								jQuery("#query_item_0").append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
							} else {
								jQuery("#query_item_0").append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                            var current = element.uid;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                    return;
                                } else {
                                    jQuery(".block-right-item[item_id='" + element.uid + "']").addClass("active");
                                }
                            }
						})
					}
				}
			})
		},800)
    } else {
		module_searchtimer && clearTimeout(module_searchtimer);
		module_searchtimer = setTimeout(function ()
		{
			jQuery.ajax({
				type: "POST",
				url: "/module/user_select/data.php",
				data: {
					ACTION: "query",
					KEYWORD: jQuery(self).val(),
					FUNC_ID: funcId,
					MODULE_ID: moduleId,
					PRIV_NO_FLAG: privNoFlag,
					MANAGE_FLAG: manageFlag,
					USE_UID: useUid,
					PRIV_OP: privOp
				},
				dataType: "json",
				success: function (msg) {
					jQuery("#navMenu a").removeClass("active");
					if (msg.status == 0) {
						jQuery("#query_item_0").html("");
						jQuery("#query_item_0").append("<div class='block-right' id='query_item_0'><div class='message'>无符合条件的用户</div></div>");
						return;
					} else {
						jQuery("#query_item_0").html("");
						if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
							jQuery("#query_item_0").append("<div class='block-right-header' title='查询人员'>查询人员</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div>");
						} else {
							jQuery("#query_item_0").append("<div class='block-right-header' title='查询人员'>查询人员</div>");
						}
						jQuery.each(msg.data, function (index, element) {
							if (element.attend_status == "") {
								jQuery("#query_item_0").append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
							} else {
								jQuery("#query_item_0").append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                            var current = element.user_id;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                    return;
                                } else {
                                    jQuery(".block-right-item[item_id='" + element.user_id + "']").addClass("active");
                                }
                            }
						})
					}
				}
			})
		},800)
    }
};

var priv_searchtimer = null;
//只有选择角色时的搜索框输入事件（由于触发的ajax不同，返回的数据结构也不同）
function privKeyUp(e) {
    jQuery(".main-block").css("display", "none");
    jQuery("#block_query").css("display", "block");
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    var funcId = jQuery(".alert-modal-box").data("func_id");
    var moduleId = jQuery(".alert-modal-box").data("module_id");
    var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
    var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
    var useUid = jQuery(".alert-modal-box").data("use_uid");
    var privOp = jQuery(".alert-modal-box").data("priv_op");
	priv_searchtimer && clearTimeout(priv_searchtimer);
	priv_searchtimer = setTimeout(function ()
	{
		jQuery.ajax({
			type: "POST",
			url: "/module/priv_select/data.php",
			data: {
				ACTION: "query",
				KEYWORD: jQuery(self).val(),
				FUNC_ID: funcId,
				MODULE_ID: moduleId,
				PRIV_NO_FLAG: privNoFlag,
				MANAGE_FLAG: manageFlag,
				USE_UID: useUid,
				PRIV_OP: privOp
			},
			dataType: "json",
			success: function (msg) {
				jQuery("#navMenu a").removeClass("active");
				if (msg.status == 0) {
					jQuery("#query_item_0").html("");
					jQuery("#query_item_0").append("<div class='block-right' id='query_item_0'><div class='message'>无符合条件的用户</div></div>");
					return;
				} else {
					jQuery("#query_item_0").html("");
					jQuery("#query_item_0").append("<div class='block-right-header' title='查询角色'>查询角色</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div>");
					jQuery.each(msg.data, function (index, element) {
						if(!element.user_priv) {
							jQuery("#query_item_0").append("<div class='block-right-header' style='background:#F8F8F8;margin-top: 5px;' title=" + element.title + ">" + element.title + "</div>")
						} else {
							jQuery("#query_item_0").append("<div class='block-right-item' item_id=\'" + element.user_priv + "\' item_name=" + element.priv_name + " user_id=\'" + element.user_priv + "\'><span class='name'></span><span class='real-name'>" + element.priv_name + "</span></div>")
                            var current = element.user_priv;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                    return;
                                } else {
                                    jQuery(".block-right-item[item_id='" + element.user_priv + "']").addClass("active");
                                }
                            }
						}
					})
				}
			}
		})
	},800)
}

//确定按钮的点击事件
function bigButtonClick(e) {
    jQuery(".alert-modal-box").remove();
};

//选人控件上侧导航的点击事件，各个页面的隐藏显示切换
function navMenuClick(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    if (jQuery(self).hasClass("active")) {
        return;
    } else {
        jQuery(self).parent().find("a.active").removeClass("active");
        jQuery(".main-block").css("display", "none")
        jQuery(self).addClass("active");
        jQuery("#block_" + jQuery(self).attr("block")).css("display", "block");
    }
    if (jQuery(self).attr("block") == "selected") {
        if(jQuery(".alert-modal-box").data("to-id") == "ROLE" || jQuery(".alert-modal-box").data("role") == "role") {
            userSaveAndBind.initPrivSelected(id);
        } else {
            userSaveAndBind.initSelected(id);
        }
    }
};

//个人事务->工作日志里面选完人之后出现span标签情况的时候，点击span上的关闭按钮出发的点击事件
function spanCloseClick() {
    var self = this;
    userSaveAndBind.removeByValue(userSaveAndBind[jQuery(self).attr("data-to-id")], jQuery(self).parent().attr("data-tag-value"))
    userSaveAndBind.removeByValue(userSaveAndBind[jQuery(self).attr("data-to-name")], jQuery(self).parent().attr("data-tag-text"))
};

function cancelClick(id, name) {
    var self = this;
    userSaveAndBind.removeByValue(userSaveAndBind[TO_ID], jQuery(self).parent().attr("userid"))
};

//如果选人控件为单选的时候，选择的时候的点击事件
function selectSingleItemClick(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    if (jQuery(self).hasClass("active")) {
        jQuery(self).removeClass("active");
        if (typeof (org_select_callbacks) == 'object') {
            org_select_callbacks.remove && org_select_callbacks.remove.apply(this, [jQuery(self).attr("item_id"), jQuery(self).attr("item_name")]);
        }
        userSaveAndBind.removeByValue(userSaveAndBind[id], jQuery(self).attr("item_id"));
        userSaveAndBind.removeByValue(userSaveAndBind[name], jQuery(self).attr("item_name"));
        jQuery("input[name=" + name + "]").val("");
        jQuery("input[name=" + id + "]").val("");
        jQuery("textarea[name=" + name + "]").val("");
        jQuery("textarea[name=" + name + "]").text("");
    } else {
        jQuery(self).addClass("active");
        userSaveAndBind[id] = [];
        userSaveAndBind[name] = [];
        userSaveAndBind[id].push(jQuery(self).attr("item_id"));
        userSaveAndBind[name].push(jQuery(self).find("span.real-name").text());
        jQuery("input[name=" + name + "]").val(jQuery(self).find("span.real-name").text());
        jQuery("textarea[name=" + name + "]").val(jQuery(self).find("span.real-name").text());
        jQuery("textarea[name=" + name + "]").text(jQuery(self).find("span.real-name").text());
        jQuery("input[name=" + id + "]").val(jQuery(self).attr("item_id"));
        jQuery(".alert-modal-box").remove();
        if (typeof (org_select_callbacks) == 'object') {
            jQuery("input#" + id).parent().find("a.close").attr("data-to-id", id);
            jQuery("input#" + id).parent().find("a.close").data("to-id", id);
            jQuery("input#" + id).parent().find("a.close").attr("data-to-name", name);
            jQuery("input#" + id).parent().find("a.close").data("to-name", name);
            org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(self).attr("item_id"), jQuery(self).find("span.real-name").text()]);
        }
    }
};

//选人控件为单选时清除按钮的点击事件
function buttonClearClick(e) {
    var id = e.data[0];
    var name = e.data[1];
    userSaveAndBind[id] = [];
    userSaveAndBind[name] = [];
    jQuery("input[name=" + name + "]").val("");
    jQuery("input[name=" + id + "]").val("");
    jQuery(".alert-modal-box").find(".block-right-item").removeClass("active");
};

//选人控件有全部部门时，全部部门的点击事件
function allDept(e) {
    var self = this;
    var id = e.data[0];
    var name = e.data[1];
    if(userSaveAndBind[id] == "ALL_DEPT") {
        jQuery(".alert-modal-box").remove();
        return;
    } else {
        if(userSaveAndBind[id] == ""){
            if (typeof (org_select_callbacks) == 'object') {
                org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(self).attr("item_id"), jQuery(self).attr("item_name")]);
                jQuery("input#" + id).parent().find("a.close").attr("data-to-id", id);
                jQuery("input#" + id).parent().find("a.close").data("to-id", id);
                jQuery("input#" + id).parent().find("a.close").attr("data-to-name", name);
                jQuery("input#" + id).parent().find("a.close").data("to-name", name);
            }
            userSaveAndBind[id].push(jQuery(self).attr("item_id"));
            userSaveAndBind[name].push(jQuery(self).attr("item_name"));
            jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString());
            jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString());
            jQuery("textarea[name=" + name + "]").text(userSaveAndBind[name].toString());
            jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString());
            jQuery(".alert-modal-box").remove();
        } else {
            if (typeof (org_select_callbacks) == 'object') {
                for(var i=0;i<userSaveAndBind[id].length;i++) {
                    org_select_callbacks.remove && org_select_callbacks.remove.apply(this,[userSaveAndBind[id][i],userSaveAndBind[name][i]]);
                }
                org_select_callbacks.add && org_select_callbacks.add.apply(this, [jQuery(self).attr("item_id"), jQuery(self).attr("item_name")]);
                jQuery("input#" + id).parent().find("a.close").attr("data-to-id", id);
                jQuery("input#" + id).parent().find("a.close").data("to-id", id);
                jQuery("input#" + id).parent().find("a.close").attr("data-to-name", name);
                jQuery("input#" + id).parent().find("a.close").data("to-name", name);
            }
            userSaveAndBind[id] = [];
            userSaveAndBind[name] = [];
            userSaveAndBind[id].push(jQuery(self).attr("item_id"));
            userSaveAndBind[name].push(jQuery(self).attr("item_name"));
            jQuery("input[name=" + id + "]").val(userSaveAndBind[id].toString());
            jQuery("textarea[name=" + name + "]").val(userSaveAndBind[name].toString());
            jQuery("textarea[name=" + name + "]").text(userSaveAndBind[name].toString());
            jQuery("input[name=" + name + "]").val(userSaveAndBind[name].toString());
            jQuery(".alert-modal-box").remove();
        }
    }
};

var userSaveAndBind = {
    initDept: function (id, name, showbutton, errorCallback) {

        var funcId = jQuery(".alert-modal-box").data("func_id");
        var moduleId = jQuery(".alert-modal-box").data("module_id");
        var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
        var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
        var useUid = jQuery(".alert-modal-box").data("use_uid");
        var privOp = jQuery(".alert-modal-box").data("priv_op");

        //dept页面左边初始化ajax
        jQuery.ajax({
            type: "GET",
            url: "/module/user_select/data.php",
            data: {
                ACTION: "get_tree",
                SHOW_BUTTON: showbutton,
				MANAGE_FLAG: manageFlag
            },
            success: function (response) {
                jQuery("#dept_menu").html(response);
            },
			error:function(e){
				alert('请求发生错误')
			}
        })

        //dept页面右边ajax
        if (jQuery(".alert-modal-box").data("use_uid") == 1) {
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {
                    ACTION: "bydept",
                    FUNC_ID: funcId,
                    MODULE_ID: moduleId,
                    PRIV_NO_FLAG: privNoFlag,
                    MANAGE_FLAG: manageFlag,
                    USE_UID: useUid,
                    PRIV_OP: privOp
                },
                dataType: "json",
                success: function (msg) {
                    if (msg.status == 0) {
                        jQuery("#dept_item").children().hide();
                        if (jQuery("#dept_item .message").length > 0) {
                            jQuery("#dept_item .message").show();
                        } else {
                            jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                        }
                    } else if (msg.status == 1) {
                        jQuery("#dept_item").children().hide();
                        if (jQuery("#dept_item_myself").length > 0) {
                            jQuery("#dept_item_myself").show();
                            return;
                        }
                        if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                            jQuery("#dept_item").append("<div class='block-right' id='dept_item_myself'><div class='block-right-header' title=" + msg.data[0].dept_long_name + ">" + msg.data[0].dept_long_name + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                        } else {
                            jQuery("#dept_item").append("<div class='block-right' id='dept_item_myself'><div class='block-right-header' title=" + msg.data[0].dept_long_name + ">" + msg.data[0].dept_long_name + "</div></div>");
                        }
                        jQuery.each(msg.data, function (index, element) {
                            if (element.attend_status == "") {
                                jQuery("#dept_item #dept_item_myself").append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                            } else {
                                jQuery("#dept_item #dept_item_myself").append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                            var current = element.uid;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                    return;
                                } else {
                                    jQuery(".block-right-item[item_id='" + element.uid + "']").addClass("active");
                                }
                            }
                        })
                    }
                },
				error:function(e){
					alert('请求发生错误！')
				}
            })
        } else {
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {
                    ACTION: "bydept",
                    FUNC_ID: funcId,
                    MODULE_ID: moduleId,
                    PRIV_NO_FLAG: privNoFlag,
                    MANAGE_FLAG: manageFlag,
                    USE_UID: useUid,
                    PRIV_OP: privOp
                },
                dataType: "json",
                success: function (msg) {
                    if (msg.status == 0) {
                        jQuery("#dept_item").children().hide();
                        if (jQuery("#dept_item .message").length > 0) {
                            jQuery("#dept_item .message").show();
                        } else {
                            jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                        }
                    } else if (msg.status == 1) {
                        jQuery("#dept_item").children().hide();
                        if (jQuery("#dept_item_myself").length > 0) {
                            jQuery("#dept_item_myself").show();
                            return;
                        }
                        if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                            jQuery("#dept_item").append("<div class='block-right' id='dept_item_myself'><div class='block-right-header' title=" + msg.data[0].dept_long_name + ">" + msg.data[0].dept_long_name + "</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                        } else {
                            jQuery("#dept_item").append("<div class='block-right' id='dept_item_myself'><div class='block-right-header' title=" + msg.data[0].dept_long_name + ">" + msg.data[0].dept_long_name + "</div></div>");
                        }
                        jQuery.each(msg.data, function (index, element) {
                            if (element.attend_status == "") {
                                jQuery("#dept_item #dept_item_myself").append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                            } else {
                                jQuery("#dept_item #dept_item_myself").append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                            var current = element.user_id;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                    return;
                                } else {
                                    jQuery(".block-right-item[item_id='" + element.user_id + "']").addClass("active");
                                }
                            }
                        })
                    }
                },
				error:function(e){
					alert('请求发生错误')
				}
            })
        }
    },

    initSelectDept: function (id, name, showbutton) {
        var funcId = jQuery(".alert-modal-box").data("func_id");
        var moduleId = jQuery(".alert-modal-box").data("module_id");
        var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
        var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
        var useUid = jQuery(".alert-modal-box").data("use_uid");
        var privOp = jQuery(".alert-modal-box").data("priv_op");
        //left tree
        jQuery.ajax({
            type: "GET",
            url: "/module/dept_select/data.php",
            data: {
                ACTION: "get_tree",
                SHOW_BUTTON: showbutton,
				PRIV_OP: privOp
            },
            success: function (response) {
                jQuery("#dept_menu").html("");
                jQuery("#dept_menu").append(response);
            }
        })
        //right item
        jQuery.ajax({
            url: '/module/dept_select/data.php',
            type: "POST",
            data: {
                ACTION: "bydept",
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    if (jQuery("#dept_item .message").length > 0) {
                        jQuery("#dept_item .message").show()
                    } else {
                        jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                    }
                } else if (msg.status == 1) {
					
					jQuery("#dept_item").append("<div class='block-right' id='dept_item_0'></div>");
					if(msg.flag){
						jQuery("#dept_item_0").append("<div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div>");
					}
					if(jQuery(".alert-modal-box").attr("data-no-all") != "noall"){
						jQuery("#dept_item_0").append("<div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div>");
					}
					/*
					if(msg.flag){
						if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
							jQuery("#dept_item").append("<div class='block-right' id='dept_item_0'><div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
						} else {
							jQuery("#dept_item").append("<div class='block-right' id='dept_item_0'><div class='block-right-alldept' item_id='ALL_DEPT' item_name='全体部门'>全体部门</div></div>");
						}
					}else{
						if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
							jQuery("#dept_item").append("<div class='block-right' id='dept_item_0'><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
						}
					}
					*/
                    jQuery.each(msg.data, function (index, element) {
                        jQuery("#dept_item #dept_item_0").append("<div class='block-right-item' item_id=\'" + element.dept_id + "\' item_name=" + element.dept_name.replace(/\s/g, "") + "><span class='name dept'></span><span>" + element.dept_line + "</span><span class='real-name'>" + element.dept_name + "</span></div>")
                        var current = element.dept_id;
                        var selected = jQuery("input[name=" + id + "]").val();
                        var findIt = includesUser(current, selected)
                        if(findIt){
                            jQuery(".block-right-item[item_id='" + element.dept_id + "']").addClass("active");
                        }
                    })
                }
            }
        })
    },

    initSelectPriv: function (id, name, showbutton) {
        var funcId = jQuery(".alert-modal-box").data("func_id");
        var moduleId = jQuery(".alert-modal-box").data("module_id");
        var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
        var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
        var useUid = jQuery(".alert-modal-box").data("use_uid");
        var privOp = jQuery(".alert-modal-box").data("priv_op");
        //left tree
        jQuery.ajax({
            type: "GET",
            url: "/module/priv_select/data.php",
            data: {
                ACTION: "get_tree",
                SHOW_BUTTON: showbutton,
				PRIV_OP: privOp,
            },
            success: function (response) {
                jQuery("#dept_menu").html("");
                jQuery("#dept_menu").append(response);
            }
        })
		
		var priv_single_searchtimer = null;
		var filterPrivByKeyword = function(keyword){
			priv_searchtimer && clearTimeout(priv_searchtimer);
			priv_searchtimer = setTimeout(function (){
				jQuery.ajax({
					url: '/module/priv_select/data.php',
					type: "POST",
					data: {
						ACTION: "query",
						FUNC_ID: funcId,
						MODULE_ID: moduleId,
						PRIV_NO_FLAG: privNoFlag,
						MANAGE_FLAG: manageFlag,
						USE_UID: useUid,
						PRIV_OP: privOp,
						KEYWORD: keyword
					},
					dataType: "json",
					success: function (msg) {
						jQuery("#dept_item .message").remove()
						jQuery('#dept_item_0').html("<div class='block-right-header' title='选择角色'>选择角色</div>")
						if (msg.status == 0) {
							if (jQuery("#dept_item .message").length > 0) {
								jQuery("#dept_item .message").show()
							} else {
								jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
							}
						} else if (msg.status == 1) {
							jQuery.each(msg.data, function (index, element) {
								if (!element.priv_name) {
									jQuery("#dept_item #dept_item_0").append("<div class='block-right-header' style='background:#F8F8F8;margin-top: 5px;' title=" + element.name + ">" + element.name + "</div>")
								} else {
									jQuery("#dept_item #dept_item_0").append("<div class='block-right-item' item_id=\'" + element.user_priv + "\' item_name=" + element.priv_name.replace(/\s/g, '') + "><span class='name dept'></span><span class='real-name'>" + element.priv_name + "</span></div>");
                                    var current = element.user_priv;
                                    var selected = jQuery("input[name=" + id + "]").val();
                                    var findIt = includesUser(current, selected)
                                    if(findIt){
                                        jQuery(".block-right-item[item_id='" + element.user_priv + "']").addClass("active");
                                    }
								}
							})
							
						}
					}
				})
			}, 800)
		}

        //right item
        jQuery.ajax({
            url: '/module/priv_select/data.php',
            type: "POST",
            data: {
                ACTION: "",
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    if (jQuery("#dept_item .message").length > 0) {
                        jQuery("#dept_item .message").show()
                    } else {
                        jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                    }
                } else if (msg.status == 1) {
                    if (jQuery(".alert-modal-box").attr("data-no-all") == "noall" || jQuery(".alert-modal-box").attr("data-noall") == "noall") {
						//jQuery('#dept_item').append("<input class='priv-search-box' />")
                        jQuery("#dept_item").append("<div class='block-right' id='dept_item_0'><div class='block-right-header' title='选择角色'>选择角色</div></div>");
                    } else {
                        jQuery("#dept_item").append("<div class='block-right' id='dept_item_0'><div class='block-right-header' title='选择角色'>选择角色</div><div class='block-right-add'>全部添加</div><div class='block-right-remove'>全部删除</div></div>");
                    }
                    jQuery.each(msg.data, function (index, element) {
                        if (!element.priv_name) {
                            jQuery("#dept_item #dept_item_0").append("<div class='block-right-header' style='background:#F8F8F8;margin-top: 5px;' title=" + element.name + ">" + element.name + "</div>")
                        } else {
                            jQuery("#dept_item #dept_item_0").append("<div class='block-right-item' item_id=\'" + element.user_priv + "\' item_name=" + element.priv_name.replace(/\s/g, '') + "><span class='name dept'></span><span class='real-name'>" + element.priv_name + "</span></div>");
                            var current = element.user_priv;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                jQuery(".block-right-item[item_id='" + element.user_priv + "']").addClass("active");
                            }
                        }
                    })
					jQuery('body').delegate('.priv-search-box', 'keyup', function(){
						//console.log(jQuery(this).val())
						var keyword = jQuery(this).val()
						filterPrivByKeyword(keyword)
					})
                }
            }
        })
    },

    initSelectDeptSingle: function (id, name) {
        var funcId = jQuery(".alert-modal-box").data("func_id");
        var moduleId = jQuery(".alert-modal-box").data("module_id");
        var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
        var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
        var useUid = jQuery(".alert-modal-box").data("use_uid");
        var privOp = jQuery(".alert-modal-box").data("priv_op");
        //只有一个部门的ajax
        jQuery.ajax({
            url: '/module/dept_select/data.php',
            type: "POST",
            data: {
                ACTION: "bydept",
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    jQuery("#dept_item").children().hide();
                    if (jQuery("#dept_item .message").length > 0) {
                        jQuery("#dept_item .message").show();
                    } else {
                        jQuery("#dept_item").append("<div class='message'>" + msg.msg + "</div>");
                    }
                } else if (msg.status == 1) {
                    jQuery.each(msg.data, function (index, element) {
                        jQuery("#dept_item #dept_item_0").append("<div class='block-right-item' item_id=\'" + element.dept_id + "\' item_name=" + element.dept_name.replace(/\s/g, "") + "><span class='name dept'></span><span>" + element.dept_line + "</span><span class='real-name'>" + element.dept_name + "</span></div>")
                        var current = element.dept_id;
                        var selected = jQuery("input[name=" + id + "]").val();
                        var findIt = includesUser(current, selected)
                        if(findIt){
                            jQuery(".block-right-item[item_id='" + element.dept_id + "']").addClass("active");
                        }
                    })
                }
            }
        })
    },

    initOther: function (id, name) {
        var funcId = jQuery(".alert-modal-box").data("func_id");
        var moduleId = jQuery(".alert-modal-box").data("module_id");
        var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
        var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
        var useUid = jQuery(".alert-modal-box").data("use_uid");
        var privOp = jQuery(".alert-modal-box").data("priv_op");
        //priv页面初始化ajax
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {
                ACTION: "priv",
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 1) {
                    jQuery("#priv_menu").html("");
                    jQuery("#priv_item").html("");
                    jQuery.each(msg.data, function (index, element) {
                        if (element.item_id == undefined) {
                            jQuery("#priv_menu").append("<div class='block-left-header' title=" + element.title + ">" + element.name + "</div>");
                        } else {
                            jQuery("#priv_menu").append("<div class='block-left-item' action='bypriv' block='priv' title=" + element.priv_name + " item_id=\'" + element.item_id + "\'><span>" + element.priv_name + "</span></div>");
                        }
                    });
                    jQuery("#priv_item").append("<div class='message'>请选择角色</div>")
                } else if (msg.status == 0) {
                    jQuery("#priv_menu").html("");
                    jQuery("#priv_item").html("");
                    jQuery("#priv_menu").append("<div class='message'>暂无角色</div>")
                }
            },
			error:function(e){
				alert('请求发生错误')
			}
        });

        //group页面初始化ajax
        jQuery.ajax({
            type: "POST",
            url: "/module/user_select/data.php",
            data: {
                ACTION: "group",
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (msg) {
                if (msg.status == 0) {
                    jQuery("#group_menu").html("");
                    jQuery("#group_item").html("");
                    jQuery("#group_menu").append("<div class='message'>暂未设置分组</div>")
                } else if (msg.status == 1) {
                    jQuery("#block_group #group_menu").html("");
                    jQuery("#block_group #group_item").html("");
                    jQuery.each(msg.data, function (index, element) {
                        jQuery("#block_group #group_menu").append("<div class='block-left-header'>" + element.title + "</div>")
                        jQuery.each(element.data, function (index, deepelement) {
                            jQuery("#block_group #group_menu").append("<div class='block-left-item' action='bygroup' block='group' title=" + deepelement.group_name + " item_id=" + deepelement.group_id + "><span>" + deepelement.group_name + "</span></div>")
                        })
                        if(jQuery("#block_group #group_item").find(".message").length > 0) {

                        } else {
                            jQuery("#block_group #group_item").append("<div class='message'>请选择分组</div>");
                        }
                    })
                }
            },
			error:function(e){
				alert('请求发生错误')
			}
        });

        //online页面初始化ajax
        if (jQuery(".alert-modal-box").data("use_uid") == 1) {
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {
                    ACTION: "online",
                    FUNC_ID: funcId,
                    MODULE_ID: moduleId,
                    PRIV_NO_FLAG: privNoFlag,
                    MANAGE_FLAG: manageFlag,
                    USE_UID: useUid,
                    PRIV_OP: privOp
                },
                dataType: "json",
                success: function (msg) {
                    if(msg.status == 0) {
                        jQuery("#block_online").html("<div class='message'>" + msg.msg + "</div>")
                    } else if(msg.status == 1) {
                        jQuery("#online_item_0").html("");
                        if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                            jQuery("#online_item_0").append("<div class='block-right-header' title='在线人员'>在线人员</div>" +
                                "<div class='block-right-add'>全部添加</div>" +
                                "<div class='block-right-remove'>全部删除</div>");
                        } else {
                            jQuery("#online_item_0").append("<div class='block-right-header' title='在线人员'>在线人员</div>")
                        }
                        jQuery.each(msg.data, function (index, element) {
                            if (element.attend_status == "") {
                                jQuery("#online_item_0").append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                            } else {
                                jQuery("#online_item_0").append("<div class='block-right-item' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                            var current = element.uid;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                    return;
                                } else {
                                    jQuery(".block-right-item[item_id='" + element.uid + "']").addClass("active");
                                }
                            }
                        });
                    }
                },
				error:function(e){
					alert('请求发生错误')
				}
            })
        } else {
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {
                    ACTION: "online",
                    FUNC_ID: funcId,
                    MODULE_ID: moduleId,
                    PRIV_NO_FLAG: privNoFlag,
                    MANAGE_FLAG: manageFlag,
                    USE_UID: useUid,
                    PRIV_OP: privOp
                },
                dataType: "json",
                success: function (msg) {
                    if(msg.status == 0) {
                        jQuery("#block_online").html("<div class='message'>" + msg.msg + "</div>")
                    } else if(msg.status == 1) {
                        jQuery("#online_item_0").html("");
                        if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                            jQuery("#online_item_0").append("<div class='block-right-header' title='在线人员'>在线人员</div>" +
                                "<div class='block-right-add'>全部添加</div>" +
                                "<div class='block-right-remove'>全部删除</div>");
                        } else {
                            jQuery("#online_item_0").append("<div class='block-right-header' title='在线人员'>在线人员</div>")
                        }
                        jQuery.each(msg.data, function (index, element) {
                            if (element.attend_status == "") {
                                jQuery("#online_item_0").append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                            } else {
                                jQuery("#online_item_0").append("<div class='block-right-item' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                            var current = element.user_id;
                            var selected = jQuery("input[name=" + id + "]").val();
                            var findIt = includesUser(current, selected)
                            if(findIt){
                                if (jQuery("#myModal").length > 0 && jQuery("#myModalLabel").text() == "委托") {
                                    return;
                                } else {
                                    jQuery(".block-right-item[item_id='" + element.user_id + "']").addClass("active");
                                }
                            }
                        });
                    }
                },
				error:function(e){
					alert('请求发生错误')
				}
            })
        }
    },

    //由于selected页面特殊，单独初始化
    initSelected: function (id) {
        var id = id;
        var funcId = jQuery(".alert-modal-box").data("func_id");
        var moduleId = jQuery(".alert-modal-box").data("module_id");
        var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
        var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
        var useUid = jQuery(".alert-modal-box").data("use_uid");
        var privOp = jQuery(".alert-modal-box").data("priv_op");
        //selected页面初始化ajax
        if (jQuery(".alert-modal-box").data("use_uid") == 1) {
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {
                    ACTION: "selected",
                    TO_ID_STR: userSaveAndBind[id].toString(),
                    FUNC_ID: funcId,
                    MODULE_ID: moduleId,
                    PRIV_NO_FLAG: privNoFlag,
                    MANAGE_FLAG: manageFlag,
                    USE_UID: useUid,
                    PRIV_OP: privOp
                },
                dataType: "json",
                success: function (response) {

                    if (response.status == 0) {
                        jQuery("#block_selected .select-user-right #selected_item_0").html("");
                        jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='message'>" + response.msg + "</div>");
                    } else if (response.status == 1) {
                        jQuery("#block_selected .select-user-right #selected_item_0").html("");
                        if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                            jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-header' title='已选人员'>已选人员</div>" +
                                "<div class='block-right-add'>全部添加</div>" +
                                "<div class='block-right-remove'>全部删除</div>");
                        } else {
                            jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-header' title='已选人员'>已选人员</div>")
                        }
                        jQuery.each(response.data, function (index, element) {
                            if (element.attend_status == "") {
                                jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-item active' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                            } else {
                                jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-item active' item_id=\'" + element.uid + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                        })
                    }
                },
                error: function (XMLResponse) {
                    alert(XMLResponse.responseText);
                }
            });
        } else {
            jQuery.ajax({
                type: "POST",
                url: "/module/user_select/data.php",
                data: {
                    ACTION: "selected",
                    TO_ID_STR: userSaveAndBind[id].toString(),
                    FUNC_ID: funcId,
                    MODULE_ID: moduleId,
                    PRIV_NO_FLAG: privNoFlag,
                    MANAGE_FLAG: manageFlag,
                    USE_UID: useUid,
                    PRIV_OP: privOp
                },
                dataType: "json",
                success: function (response) {

                    if (response.status == 0) {
                        jQuery("#block_selected .select-user-right #selected_item_0").html("");
                        jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='message'>" + response.msg + "</div>");
                    } else if (response.status == 1) {
                        jQuery("#block_selected .select-user-right #selected_item_0").html("");
                        if (jQuery(".alert-modal-box").attr("data-no-all") != "noall") {
                            jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-header' title='已选人员'>已选人员</div>" +
                                "<div class='block-right-add'>全部添加</div>" +
                                "<div class='block-right-remove'>全部删除</div>");
                        } else {
                            jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-header' title='已选人员'>已选人员</div>")
                        }
                        jQuery.each(response.data, function (index, element) {
                            if (element.attend_status == "") {
                                jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-item active' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span></div>")
                            } else {
                                jQuery("#block_selected .select-user-right #selected_item_0").append("<div class='block-right-item active' item_id=\'" + element.user_id + "\' item_name=" + element.user_name.replace(/\s/g, "") + " user_id=\'" + element.user_id + "\' title=" + element.priv_name.replace(/\s/g, '') + "[" + element.dept_long_name + "]><span class='name'></span><span class='real-name'>" + element.user_name + "</span><span class='status'> (" + element.attend_status + ")</span></div>")
                            }
                        })
                    }
                },
                error: function (XMLResponse) {
                    alert(XMLResponse.responseText);
                }
            });
        }
    },

    initPrivSelected: function (id) {
        var id = id;
        var funcId = jQuery(".alert-modal-box").data("func_id");
        var moduleId = jQuery(".alert-modal-box").data("module_id");
        var privNoFlag = jQuery(".alert-modal-box").data("priv_no_flag");
        var manageFlag = jQuery(".alert-modal-box").data("manage_flag");
        var useUid = jQuery(".alert-modal-box").data("use_uid");
        var privOp = jQuery(".alert-modal-box").data("priv_op");
        //privselected页面初始化ajax
        jQuery.ajax({
            type: "POST",
            url: "/module/priv_select/data.php",
            data: {
                ACTION: "selected",
                TO_ID_STR: userSaveAndBind[id].toString(),
                FUNC_ID: funcId,
                MODULE_ID: moduleId,
                PRIV_NO_FLAG: privNoFlag,
                MANAGE_FLAG: manageFlag,
                USE_UID: useUid,
                PRIV_OP: privOp
            },
            dataType: "json",
            success: function (response) {

                if (response.status == 0) {
                    jQuery("#block_selected #selected_item #selected_item_0").html("");
                    jQuery("#block_selected #selected_item #selected_item_0").append("<div class='message'>" + response.msg + "</div>");
                } else if (response.status == 1) {
                    jQuery("#block_selected #selected_item #selected_item_0").html("");
                    jQuery("#block_selected #selected_item #selected_item_0").append("<div class='block-right-header' title='已选角色'>已选角色</div>" +
                        "<div class='block-right-add'>全部添加</div>" +
                        "<div class='block-right-remove'>全部删除</div>");
                    jQuery.each(response.data, function (index, element) {
                        if(!element.user_priv) {
                            jQuery("#block_selected #selected_item #selected_item_0").append("<div class='block-right-header' style='background:#F8F8F8;margin-top: 5px;' title=" + element.title + ">" + element.title + "</div>")
                        } else {
                            jQuery("#block_selected #selected_item #selected_item_0").append("<div class='block-right-item active' item_id=\'" + element.user_priv + "\' item_name=" + element.priv_name + " user_id=\'" + element.user_priv + "\' title=" + element.priv_name + "><span class='name'></span><span class='real-name'>" + element.priv_name + "</span></div>")
                        }
                    })
                }
            },
            error: function (XMLResponse) {
                alert(XMLResponse.responseText);
            }
        });
    },

    //为生成的角色绑定点击事件
    itemMostBindClick: function (id, name) {
        jQuery("#keyword").val("");
        jQuery(".alert-modal-box").delegate(".block-left-item", "click", leftItem);
        jQuery(".alert-modal-box").delegate("#priv_menu .block-left-item", "click", [id, name], privAjax);
        jQuery(".alert-modal-box").delegate("#group_menu .block-left-item", "click", [id, name], groupAjax);
        jQuery(".alert-modal-box").delegate(".block-right-add", "click", [id, name], addAll);
        jQuery(".alert-modal-box").delegate(".block-right-remove", "click", [id, name], deleteAll);
        jQuery(".alert-modal-box").delegate("#navMenu a", 'click', [id, name], navMenuClick);
    },

    blockRightItemClick: function (id, name) {
        jQuery(".alert-modal-box").delegate(".block-right-item", "click", [id, name], rightItemClick);
    },

    bigButtonClick: function (id, name) {
        jQuery(".alert-modal-box").delegate(".BigButtonA", "click", [id, name], bigButtonClick);
    },

    addAllDept: function (id, name) {
        jQuery(".alert-modal-box").delegate('.block-right-alldept', "click", [id, name], allDept);
    },

    bindKeyUp: function (id, name) {
        jQuery(".alert-modal-box").delegate("#keyword", 'keyup', [id, name], keyUP);
    },

    bindPrivKeyUp: function (id, name) {
        jQuery(".alert-modal-box").delegate("#keyword", 'keyup', [id, name], privKeyUp);
    },

    itemSelectDeptSingleBindClick: function (id, name) {
        jQuery(".alert-modal-box").delegate(".block-right-item", "click", [id, name], selectSingleItemClick);
        jQuery(".alert-modal-box").delegate(".BigButtonA", "click", [id, name], bigButtonClick);
        jQuery(".alert-modal-box").delegate(".BigButtonAHover", "click", [id, name], buttonClearClick);
    },

    //删除数组指定元素
    removeByValue: function (arr, val) {
		arr = arr || []
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    },

    //生成的小tag上的关闭按钮绑定事件
    closeSpanClick: function () {
        jQuery(document).undelegate("span.tag a.close", "click");
        jQuery(document).delegate("span.tag a.close", "click", spanCloseClick);
    },

    regexpCheck: function (element) {
        var string = "^" + element + ",|," + element + ",";
        var regexp = new RegExp(string, "ig");
        return regexp
    }
}

function createAllAlertModal() {
    var modal = '<div class="alert-modal-box">' +
        '<div class="alert-modal-box-background" id="alert-modal-box-background"></div>' +
        '<div class="alert-modal-box-text-box" ondragstart="return false;" unselectable="on" >' +
        '<div id="north">' +
        '<div id="navMenu" style="width:auto;">' +
        '<a href="javascript:;" onclick="return false" title="已选人员" block="selected" hidefocus="hidefocus"><span>已选</span></a>' +
        '<a href="javascript:;" onclick="return false" title="按部门选择" block="dept" hidefocus="hidefocus"><span>部门</span></a>' +
        '<a href="javascript:;" onclick="return false" title="按角色选择" block="priv" hidefocus="hidefocus"><span>角色</span></a>' +
        '<a href="javascript:;" onclick="return false" title="按分组选择" block="group" hidefocus="hidefocus"><span>分组</span></a>' +
        '<a href="javascript:;" onclick="return false" title="从在线人员选择" block="online" hidefocus="hidefocus"><span>在线</span></a>' +
        '</div>' +
        '</div>' +
		'<div id="navRight" style="position:absolute;top:0;right:0;z-index:99;width:120px;">' +
        '<div class="search">' +
        '<div class="search-body">' +
        '<div class="search-input"><input notlogin_flag="" id="keyword" type="text" value=""></div>' +
        '<div id="search_clear" class="search-clear" style="display:none;"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="main-block" id="block_selected">' +
        '<div class="select-user-right single" id="selected_item">' +
        '<div class="block-right" id="selected_item_0"></div>' +
        '</div>' +
        '</div>' +
        '<div class="main-block" id="block_dept">' +
        '<div class="select-user-left moduleContainer" id="dept_menu"></div>' +
        '<div class="select-user-right" id="dept_item"></div>' +
        '</div>' +
        '<div class="main-block" id="block_priv">' +
        '<div class="select-user-left" id="priv_menu"></div>' +
        '<div class="select-user-right" id="priv_item"></div>' +
        '</div>' +
        '<div class="main-block" id="block_group">' +
        '<div class="select-user-left" id="group_menu"></div>' +
        '<div class="select-user-right" id="group_item"></div>' +
        '</div>' +
        '<div class="main-block" id="block_online">' +
        '<div class="select-user-right single" id="online_item">' +
        '<div class="block-right" id="online_item_0"></div>' +
        '</div>' +
        '</div>' +
        '<div class="main-block" id="block_query">' +
        '<div class="select-user-right single" id="query_item">' +
        '<div class="block-right" id="query_item_0"></div>' +
        '</div>' +
        '</div>' +
        '<div id="south">' +
        '<input type="button" class="BigButtonA btn" value="确定">&nbsp;&nbsp;' +
        '</div>' +
        '</div>' +
        '</div>';
    jQuery("body").append(modal);
};

function createDeptAlertModal() {
    var modal = '<div class="alert-modal-box dept-alert-modal">' +
        '<div class="alert-modal-box-background" id="alert-modal-box-background"></div>' +
        '<div class="alert-modal-box-text-box" ondragstart="return false;" unselectable="on" >' +
		
		'<div id="north">' +
        '<div id="navMenu" style="width:auto;">' +
        '<a href="javascript:;" onclick="return false" title="按部门选择" block="selected" class="active"  hidefocus="hidefocus"><span>部门</span></a>' +
        '</div>' +
        '</div>' +
		
        '<div class="main-block" id="block_dept">' +
        '<div class="select-user-left moduleContainer" id="dept_menu"></div>' +
        '<div class="select-user-right" id="dept_item"></div>' +
        '</div>' +
        '<div id="south">' +
        '<input type="button" class="BigButtonA btn" value="确定">&nbsp;&nbsp;' +
        '</div>' +
        '</div>'
    jQuery("body").append(modal);
};

function createPrivAlertModal() {
    var modal = '<div class="alert-modal-box priv-alert-modal">' +
        '<div class="alert-modal-box-background" id="alert-modal-box-background"></div>' +
        '<div class="alert-modal-box-text-box" ondragstart="return false;" unselectable="on" >' +
        '<div id="north">' +
        '<div id="navMenu" style="width:auto;">' +
        '<a href="javascript:;" onclick="return false" title="已选人员" block="selected" hidefocus="hidefocus"><span>已选</span></a>' +
        '<a href="javascript:;" onclick="return false" title="按部门选择" block="dept" hidefocus="hidefocus" class=""><span>部门</span></a>' +
        '</div>' +
        '</div>' +
		'<div id="navRight" style="position:absolute;top:0;right:0;z-index:99;width:120px;">' +
        '<div class="search">' +
        '<div class="search-body">' +
        '<div class="search-input"><input notlogin_flag="" id="keyword" type="text" value=""></div>' +
        '<div id="search_clear" class="search-clear" style="display:none;"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="main-block" id="block_selected">' +
        '<div class="select-user-right single" id="selected_item">' +
        '<div class="block-right" id="selected_item_0"></div>' +
        '</div>' +
        '</div>' +
        '<div class="main-block" id="block_dept">' +
        '<div class="select-user-left moduleContainer" id="dept_menu"></div>' +
        '<div class="select-user-right" id="dept_item"></div>' +
        '</div>' +
        '<div class="main-block" id="block_query">' +
        '<div class="select-user-right single" id="query_item">' +
        '<div class="block-right" id="query_item_0"></div>' +
        '</div>' +
        '</div>' +
        '<div id="south">' +
        '<input type="button" class="BigButtonA btn" value="确定">&nbsp;&nbsp;' +
        '</div>' +
        '</div>'
    jQuery("body").append(modal);
};

function createPrivSingleAlertModal() {
    var modal = '<div class="alert-modal-box privsingle-alert-modal">' +
        '<div class="alert-modal-box-background" id="alert-modal-box-background"></div>' +
        '<div class="alert-modal-box-text-box" ondragstart="return false;" unselectable="on" >' +
		
		'<div id="north">' +
        '<div id="navMenu" style="width:auto;">' +
        '<a href="javascript:;" onclick="return false" title="按部门选择" block="selected" class="active"  hidefocus="hidefocus"><span>部门</span></a>' +
        '</div>' +
        '</div>' +
		
		'<input class="priv-search-box" style="position: absolute;right: 22px;top: 5px;z-index: 99;width: 261px;">' +
        '<div class="main-block" id="block_dept">' +
        '<div class="select-user-left moduleContainer" id="dept_menu"></div>' +
        '<div class="select-user-right" id="dept_item" style="top:1px;"></div>' +
        '</div>' +
        '<div id="south">' +
        '<input type="button" class="BigButtonA btn" value="确定">&nbsp;&nbsp;' +
        '<input type="button" class="BigButtonAHover btn" value="清除">&nbsp;&nbsp;' +
        '</div>' +
        '</div>'
    jQuery("body").append(modal);
};

function createDeptSingleAlertModal() {
    var modal = '<div class="alert-modal-box deptsingle-alert-modal">' +
        '<div class="alert-modal-box-background" id="alert-modal-box-background"></div>' +
        '<div class="alert-modal-box-text-box" ondragstart="return false;" unselectable="on" >' +
		
		'<div id="north">' +
        '<div id="navMenu" style="width:auto;">' +
        '<a href="javascript:;" onclick="return false" title="按部门选择" block="selected" class="active" hidefocus="hidefocus"><span>选择部门</span></a>' +
        '</div>' +
        '</div>' +
		
        '<div class="main-block" id="block_dept">' +
        '<div class="select-user-right single" id="dept_item">' +
        '<div class="block-right" id="dept_item_0">' +
        '' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div id="south">' +
        '<input type="button" class="BigButtonA btn" value="确定">&nbsp;&nbsp;' +
        '<input type="button" class="BigButtonAHover btn" value="清除">&nbsp;&nbsp;' +
        '</div>' +
        '</div>'
    jQuery("body").append(modal);
};

function createUserSingleAlertModal() {
    var modal = '<div class="alert-modal-box usersingle-alert-modal">' +
        '<div class="alert-modal-box-background" id="alert-modal-box-background"></div>' +
        '<div class="alert-modal-box-text-box" ondragstart="return false;" unselectable="on" ><iframe id="iframebar" src="about:blank" frameBorder=0 marginHeight=0 marginWidth=0 style="position:absolute; visibility:inherit; height:100%;width:100%; background: transparent;top: 0;bottom: 0;z-index: -9; filter=\'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)\';" allowTransparency="true"></iframe>' +
        '<div id="north">' +
        '<div id="navMenu" style="width:auto;">' +
        '<a href="javascript:;" onclick="return false" title="按部门选择" block="dept" hidefocus="hidefocus"><span>部门</span></a>' +
        '<a href="javascript:;" onclick="return false" title="按角色选择" block="priv" hidefocus="hidefocus"><span>角色</span></a>' +
        '<a href="javascript:;" onclick="return false" title="按分组选择" block="group" hidefocus="hidefocus"><span>分组</span></a>' +
        '<a href="javascript:;" onclick="return false" title="从在线人员选择" block="online" hidefocus="hidefocus"><span>在线</span></a>' +
        '</div>' +
        '</div>' +
		'<div id="navRight" style="position:absolute;top:0;right:0;z-index:99;width:120px;">' +
        '<div class="search">' +
        '<div class="search-body">' +
        '<div class="search-input"><input notlogin_flag="" id="keyword" type="text" value=""></div>' +
        '<div id="search_clear" class="search-clear" style="display:none;"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="main-block" id="block_dept">' +
        '<div class="select-user-left moduleContainer" id="dept_menu"></div>' +
        '<div class="select-user-right" id="dept_item"></div>' +
        '</div>' +
        '<div class="main-block" id="block_priv">' +
        '<div class="select-user-left" id="priv_menu"></div>' +
        '<div class="select-user-right" id="priv_item"></div>' +
        '</div>' +
        '<div class="main-block" id="block_group">' +
        '<div class="select-user-left" id="group_menu"></div>' +
        '<div class="select-user-right" id="group_item"></div>' +
        '</div>' +
        '<div class="main-block" id="block_online">' +
        '<div class="select-user-right single" id="online_item">' +
        '<div class="block-right" id="online_item_0"></div>' +
        '</div>' +
        '</div>' +
        '<div class="main-block" id="block_query">' +
        '<div class="select-user-right single" id="query_item">' +
        '<div class="block-right" id="query_item_0"></div>' +
        '</div>' +
        '</div>' +
        '<div id="south">' +
        '<input type="button" class="BigButtonA btn" value="确定">&nbsp;&nbsp;' +
        '<input type="button" class="BigButtonAHover btn" value="清除">&nbsp;&nbsp;' +
        '</div>' +
        '</div>' +
        '</div>';
    jQuery("body").append(modal);
};

function LoadDialogWindow(URL, parent, loc_x, loc_y, width, height) {
    if (window.showModalDialog) {
        //if(is_ie){
        window.showModalDialog(URL, parent, "edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:" + width + "px;dialogHeight:" + height + "px;dialogTop:" + loc_y + "px;dialogLeft:" + loc_x + "px", true);
    } else {
        window.open(URL, "load_dialog_win", "height=" + height + ",width=" + width + ",status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" + loc_y + ",left=" + loc_x + ",resizable=yes,modal=yes,dependent=yes,dialog=yes,minimizable=no", true);
    }
}

function SelectUser(FUNC_ID, MODULE_ID, TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME, USE_UID, NOTLOGIN_FLAG) {
    FUNC_ID = FUNC_ID || "";
    MODULE_ID = MODULE_ID || "";
    MANAGE_FLAG = MANAGE_FLAG || "";
    TITLE = "";
    FORM_NAME = FORM_NAME || "";
    USE_UID = USE_UID || "";
    NOTLOGIN_FLAG = NOTLOGIN_FLAG || "";
    PRIV_OP = "";
    TO_ID = TO_ID || "TO_ID";
    TO_NAME = TO_NAME || "TO_NAME";

    if (userSaveAndBind[TO_ID] == undefined) {
        userSaveAndBind[TO_ID] = [];
    }
    if (userSaveAndBind[TO_NAME] == undefined) {
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery("input[name=" + TO_ID + "]").val().toString() != userSaveAndBind[TO_ID].toString() + ",") {
        userSaveAndBind[TO_ID] = [];
        userSaveAndBind[TO_ID].push(jQuery("input[name=" + TO_ID + "]").val());
        userSaveAndBind[TO_ID] = userSaveAndBind[TO_ID].toString().split(",");
        if (userSaveAndBind[TO_ID][userSaveAndBind[TO_ID].length - 1] == "") {
            userSaveAndBind[TO_ID].pop();
        }
        if (jQuery("input[name=" + TO_NAME + "]").length > 0) {
            userSaveAndBind[TO_NAME] = [];
            userSaveAndBind[TO_NAME].push(jQuery("input[name=" + TO_NAME + "]").val());
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        } else {
            userSaveAndBind[TO_NAME] = [];
            userSaveAndBind[TO_NAME].push(jQuery("textarea[name=" + TO_NAME + "]").val()).toString().split(",");
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        }
    }
    if (jQuery("input[name=" + TO_ID + "]").val() == "") {
        userSaveAndBind[TO_ID] = [];
        userSaveAndBind[TO_NAME] = [];
    }

    //显示模态框
    if (jQuery(".alert-modal-box").length > 0) {
        jQuery(".alert-modal-box").remove();
    }
    createAllAlertModal();

    jQuery(".alert-modal-box").attr("data-to-id", TO_ID);
    jQuery(".alert-modal-box").attr("data-to-name", TO_NAME);
    jQuery(".alert-modal-box").attr("data-module_id", MODULE_ID);
    jQuery(".alert-modal-box").attr("data-func_id", FUNC_ID);
    jQuery(".alert-modal-box").attr("data-manage_flag", MANAGE_FLAG);
    jQuery(".alert-modal-box").attr("data-title", TITLE);
    jQuery(".alert-modal-box").attr("data-form_name", FORM_NAME);
    jQuery(".alert-modal-box").attr("data-use_uid", USE_UID);
    jQuery(".alert-modal-box").attr("data-notlogin_flag", NOTLOGIN_FLAG);
    jQuery(".alert-modal-box").attr("data-priv_op", PRIV_OP);
    jQuery(".alert-modal-box").attr("data-select-user", "selectuser");
    jQuery(".alert-modal-box").attr("data-ajax-url", "/module/user_select/data.php");

    //判断是否显示已选
    jQuery("#navMenu a").removeClass("active"); //去除a标签的active
    if (userSaveAndBind[TO_ID] != "") {
        jQuery(".alert-modal-box-text-box .main-block").hide();
        jQuery(".alert-modal-box-text-box #block_selected").show();
        jQuery("#navMenu a[block='selected']").addClass("active");
    } else {
        jQuery(".alert-modal-box-text-box .main-block").hide();
        jQuery(".alert-modal-box-text-box #block_dept").show();
        jQuery("#navMenu a[block='dept']").addClass("active");
    }

    if(window.external && typeof window.external.OA_SMS != 'undefined'){
        if (window.external.OA_SMS("","","GET_IE_VERSION") == 8 || window.external.OA_SMS("","","GET_IE_VERSION") == 6) {

        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    } else {
        if (navigator.appName == "Microsoft Internet Explorer") {
            if(document.all && document.querySelector && !document.addEventListener) {
                
            }
            if(document.all && document.addEventListener) {
                new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
            }
        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    }

    //初始化页面，触发每个选项的ajax，获得每个页面的数据，并填装
    userSaveAndBind.initDept(TO_ID, TO_NAME, 1);
    userSaveAndBind.initOther(TO_ID, TO_NAME);
    userSaveAndBind.initSelected(TO_ID);

    //绑定点击事件
    userSaveAndBind.itemMostBindClick(TO_ID, TO_NAME);
    userSaveAndBind.bindKeyUp(TO_ID, TO_NAME);
    userSaveAndBind.blockRightItemClick(TO_ID, TO_NAME);
    userSaveAndBind.bigButtonClick(TO_ID, TO_NAME);
    userSaveAndBind.closeSpanClick();

    jQuery('.alert-modal-box-background').click(function () {
        jQuery(".alert-modal-box").remove();
    })
}

function ClearUser(TO_ID, TO_NAME) {
    if (TO_ID == "" || TO_ID == "undefined" || TO_ID == null) {
        TO_ID = "TO_ID";
        TO_NAME = "TO_NAME";
    }
    document.getElementsByName(TO_ID)[0].value = "";
    document.getElementsByName(TO_NAME)[0].value = "";
    jQuery("textarea[name=" + TO_NAME + "]").text("");
    userSaveAndBind[TO_ID] = [];
    userSaveAndBind[TO_NAME] = [];
}

//工作流选择
function SelectPrcs(MODULE_ID, TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME, APPROVE_CENTER) {
    var openPrcsSelect = "flow_prcs_select";
    if (APPROVE_CENTER == 'approve_center') {
        openPrcsSelect = "bpm_prcs_select";
        URL = "/module/bpm_prcs_select/?MODULE_ID=" + MODULE_ID + "&TO_ID=" + TO_ID + "&TO_NAME=" + TO_NAME + "&MANAGE_FLAG=" + MANAGE_FLAG + "&FORM_NAME=" + FORM_NAME;
    } else {
        URL = "/module/flow_prcs_select/?MODULE_ID=" + MODULE_ID + "&TO_ID=" + TO_ID + "&TO_NAME=" + TO_NAME + "&MANAGE_FLAG=" + MANAGE_FLAG + "&FORM_NAME=" + FORM_NAME;
    }
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - 400;
        loc_y = document.body.scrollTop + event.clientY + 170;
    }
    window.open(URL, openPrcsSelect, "height=350,width=400,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top=" + loc_y + ",left=" + loc_x + ",resizable=yes");
}

function ClearPrcs(TO_ID, TO_NAME) {
    if (TO_ID == "" || TO_ID == "undefined" || TO_ID == null) {
        TO_ID = "TO_ID";
        TO_NAME = "TO_NAME";
    }
    document.getElementsByName(TO_ID)[0].value = "";
    document.getElementsByName(TO_NAME)[0].value = "";
}

function SelectUserSingle(FUNC_ID, MODULE_ID, TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME, USE_UID, OUT_FLAG, NOTLOGIN_FLAG) {
    FUNC_ID = FUNC_ID || "";
    MODULE_ID = MODULE_ID || "";
    MANAGE_FLAG = MANAGE_FLAG || "";
    TITLE = "";
    FORM_NAME = FORM_NAME || "";
    USE_UID = USE_UID || "";
    NOTLOGIN_FLAG = NOTLOGIN_FLAG || "";
    TO_ID = TO_ID || "TO_ID";
    PRIV_OP = "";
    OUT_FLAG = OUT_FLAG || "";
    TO_NAME = TO_NAME || "TO_NAME";

    if (userSaveAndBind[TO_ID] == undefined) {
        userSaveAndBind[TO_ID] = [];
    }
    if (userSaveAndBind[TO_NAME] == undefined) {
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery("input[name=" + TO_ID + "]").val() != "" && userSaveAndBind[TO_ID] == "") {
        userSaveAndBind[TO_ID].push(jQuery("input[name=" + TO_ID + "]").val());
        userSaveAndBind[TO_ID] = userSaveAndBind[TO_ID].toString().split(",");
        if (userSaveAndBind[TO_ID][userSaveAndBind[TO_ID].length - 1] == "") {
            userSaveAndBind[TO_ID].pop();
        }
        if (jQuery("input[name=" + TO_NAME + "]").length > 0) {
            userSaveAndBind[TO_NAME].push(jQuery("input[name=" + TO_NAME + "]").val());
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        } else {
            userSaveAndBind[TO_NAME].push(jQuery("textarea[name=" + TO_NAME + "]").text()).toString().split(",");
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        }
    }

    if (jQuery("input[name=" + TO_ID + "]").val() == "") {
        userSaveAndBind[TO_ID] = [];
        userSaveAndBind[TO_NAME] = [];
    }

    //显示模态框
    if (jQuery(".alert-modal-box").length > 0) {
        jQuery(".alert-modal-box").remove();
    }
    createUserSingleAlertModal();

    jQuery(".alert-modal-box").attr("data-to-id", TO_ID);
    jQuery(".alert-modal-box").attr("data-to-name", TO_NAME);
    jQuery(".alert-modal-box").attr("data-module_id", MODULE_ID);
    jQuery(".alert-modal-box").attr("data-no-all", "noall");
    jQuery(".alert-modal-box").attr("data-func_id", FUNC_ID);
    jQuery(".alert-modal-box").attr("data-manage_flag", MANAGE_FLAG);
    jQuery(".alert-modal-box").attr("data-title", TITLE);
    jQuery(".alert-modal-box").attr("data-form_name", FORM_NAME);
    jQuery(".alert-modal-box").attr("data-use_uid", USE_UID);
    jQuery(".alert-modal-box").attr("data-notlogin_flag", NOTLOGIN_FLAG);
    jQuery(".alert-modal-box").attr("data-priv_op", PRIV_OP);
    jQuery(".alert-modal-box").attr("data-no-all", "noall");
    jQuery(".alert-modal-box").attr("data-ajax-url", "/module/user_select/data.php");

    jQuery(".alert-modal-box-text-box #block_dept").show();
    jQuery("#navMenu a[block='dept']").addClass("active");

    if(window.external && typeof window.external.OA_SMS != 'undefined'){
        if (window.external.OA_SMS("","","GET_IE_VERSION") == 8 || window.external.OA_SMS("","","GET_IE_VERSION") == 6) {

        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    } else {
        if (navigator.appName == "Microsoft Internet Explorer") {
            if(document.all && document.querySelector && !document.addEventListener) {
                
            }
            if(document.all && document.addEventListener) {
                new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
            }
        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    }

    //初始化页面，触发每个选项的ajax，获得每个页面的数据，并填装
    userSaveAndBind.initDept(TO_ID, TO_NAME, 0);
    userSaveAndBind.initOther(TO_ID, TO_NAME);

    //绑定点击事件
    userSaveAndBind.itemMostBindClick(TO_ID, TO_NAME);
    userSaveAndBind.bindKeyUp(TO_ID, TO_NAME);
    userSaveAndBind.itemSelectDeptSingleBindClick(TO_ID, TO_NAME);

    jQuery('.alert-modal-box-background').click(function () {
        jQuery(".alert-modal-box").remove();
    })
}

function SelectDept(MODULE_ID, TO_ID, TO_NAME, PRIV_OP, FORM_NAME) {
    FUNC_ID = "";
    MODULE_ID = MODULE_ID || "";
    MANAGE_FLAG = "";
    TITLE = "";
    FORM_NAME = FORM_NAME || "";
    USE_UID = "";
    NOTLOGIN_FLAG = "";
    PRIV_OP = PRIV_OP || "";
    TO_ID = TO_ID || "TO_ID";
    TO_NAME = TO_NAME || "TO_NAME";
    if (userSaveAndBind[TO_ID] == undefined) {
        userSaveAndBind[TO_ID] = [];
    }
    if (userSaveAndBind[TO_NAME] == undefined) {
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery("input[name=" + TO_ID + "]").val() != "" && userSaveAndBind[TO_ID] == "") {
        userSaveAndBind[TO_ID].push(jQuery("input[name=" + TO_ID + "]").val());
        userSaveAndBind[TO_ID] = userSaveAndBind[TO_ID].toString().split(",");
        if (userSaveAndBind[TO_ID][userSaveAndBind[TO_ID].length - 1] == "") {
            userSaveAndBind[TO_ID].pop();
        }
        if (jQuery("input[name=" + TO_NAME + "]").length > 0) {
            userSaveAndBind[TO_NAME].push(jQuery("input[name=" + TO_NAME + "]").val());
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        } else {
            userSaveAndBind[TO_NAME].push(jQuery("textarea[name=" + TO_NAME + "]").text()).toString().split(",");
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        }
    }
    if (jQuery("input[name=" + TO_ID + "]").val() == "") {
        userSaveAndBind[TO_ID] = [];
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery(".alert-modal-box").length > 0) {
        jQuery(".alert-modal-box").remove();
    }
    createDeptAlertModal();

    jQuery(".alert-modal-box").attr("data-to-id", TO_ID);
    jQuery(".alert-modal-box").attr("data-to-name", TO_NAME);
    jQuery(".alert-modal-box").attr("data-module_id", MODULE_ID);
    jQuery(".alert-modal-box").attr("data-func_id", FUNC_ID);
    jQuery(".alert-modal-box").attr("data-manage_flag", MANAGE_FLAG);
    jQuery(".alert-modal-box").attr("data-title", TITLE);
    jQuery(".alert-modal-box").attr("data-form_name", FORM_NAME);
    jQuery(".alert-modal-box").attr("data-use_uid", USE_UID);
    jQuery(".alert-modal-box").attr("data-notlogin_flag", NOTLOGIN_FLAG);
    jQuery(".alert-modal-box").attr("data-priv_op", PRIV_OP);
    jQuery(".alert-modal-box").attr("data-select-dept", "selectdept");
    jQuery(".alert-modal-box").attr("data-ajax-url", "/module/dept_select/data.php");

    jQuery("#block_dept").css({
        "display": "block",
        //"top": "0"
    });

    if(window.external && typeof window.external.OA_SMS != 'undefined'){
        if (window.external.OA_SMS("","","GET_IE_VERSION") == 8 || window.external.OA_SMS("","","GET_IE_VERSION") == 6) {

        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    } else {
        if (navigator.appName == "Microsoft Internet Explorer") {
            if(document.all && document.querySelector && !document.addEventListener) {
                
            }
            if(document.all && document.addEventListener) {
                new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
            }
        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    }

    userSaveAndBind.initSelectDept(TO_ID, TO_NAME, 1);
    userSaveAndBind.itemMostBindClick(TO_ID, TO_NAME);
    userSaveAndBind.blockRightItemClick(TO_ID, TO_NAME);
    userSaveAndBind.bigButtonClick(TO_ID, TO_NAME);
    userSaveAndBind.addAllDept(TO_ID, TO_NAME);
    userSaveAndBind.closeSpanClick();

    jQuery('.alert-modal-box-background').click(function () {
        jQuery(".alert-modal-box").remove();
    })
}

function SelectDeptSingle(MODULE_ID, TO_ID, TO_NAME, PRIV_OP, FORM_NAME) {
    FUNC_ID = "";
    MODULE_ID = MODULE_ID || "";
    MANAGE_FLAG = "";
    TITLE = "";
    FORM_NAME = FORM_NAME || "";
    USE_UID = "";
    NOTLOGIN_FLAG = "";
    PRIV_OP = PRIV_OP || "";
    TO_ID = TO_ID || "TO_ID";
    TO_NAME = TO_NAME || "TO_NAME";

    if (userSaveAndBind[TO_ID] == undefined) {
        userSaveAndBind[TO_ID] = [];
    }
    if (userSaveAndBind[TO_NAME] == undefined) {
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery("input[name=" + TO_ID + "]").val() != "" && userSaveAndBind[TO_ID] == "") {
        userSaveAndBind[TO_ID].push(jQuery("input[name=" + TO_ID + "]").val());
        userSaveAndBind[TO_ID] = userSaveAndBind[TO_ID].toString().split(",");
        if (userSaveAndBind[TO_ID][userSaveAndBind[TO_ID].length - 1] == "") {
            userSaveAndBind[TO_ID].pop();
        }
        if (jQuery("input[name=" + TO_NAME + "]").length > 0) {
            userSaveAndBind[TO_NAME].push(jQuery("input[name=" + TO_NAME + "]").val());
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        } else {
            userSaveAndBind[TO_NAME].push(jQuery("textarea[name=" + TO_NAME + "]").text()).toString().split(",");
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        }
    }

    if (jQuery("input[name=" + TO_ID + "]").val() == "") {
        userSaveAndBind[TO_ID] = [];
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery(".alert-modal-box").length > 0) {
        jQuery(".alert-modal-box").remove();
    }
    createDeptSingleAlertModal();

    jQuery(".alert-modal-box").attr("data-to-id", TO_ID);
    jQuery(".alert-modal-box").attr("data-to-name", TO_NAME);
    jQuery(".alert-modal-box").attr("data-module_id", MODULE_ID);
    jQuery(".alert-modal-box").attr("data-func_id", FUNC_ID);
    jQuery(".alert-modal-box").attr("data-manage_flag", MANAGE_FLAG);
    jQuery(".alert-modal-box").attr("data-title", TITLE);
    jQuery(".alert-modal-box").attr("data-form_name", FORM_NAME);
    jQuery(".alert-modal-box").attr("data-use_uid", USE_UID);
    jQuery(".alert-modal-box").attr("data-notlogin_flag", NOTLOGIN_FLAG);
    jQuery(".alert-modal-box").attr("data-priv_op", PRIV_OP);
    jQuery(".alert-modal-box").attr("data-ajax-url", "/module/dept_select_single/data.php");

    jQuery("#block_dept").css({
        "display": "block",
        //"top": "0"
    });

    if(window.external && typeof window.external.OA_SMS != 'undefined'){
        if (window.external.OA_SMS("","","GET_IE_VERSION") == 8 || window.external.OA_SMS("","","GET_IE_VERSION") == 6) {

        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    } else {
        if (navigator.appName == "Microsoft Internet Explorer") {
            if(document.all && document.querySelector && !document.addEventListener) {
                
            }
            if(document.all && document.addEventListener) {
                new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
            }
        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    }

    userSaveAndBind.initSelectDeptSingle(TO_ID, TO_NAME);

    userSaveAndBind.itemSelectDeptSingleBindClick(TO_ID, TO_NAME);

    jQuery('.alert-modal-box-background').click(function () {
        jQuery(".alert-modal-box").remove();
    })
}

function SelectPriv(MODULE_ID, TO_ID, TO_NAME, PRIV_OP, FORM_NAME, FUNC_ID) {
    FUNC_ID = FUNC_ID || "";
    MODULE_ID = MODULE_ID || "";
    MANAGE_FLAG = "";
    TITLE = "";
    FORM_NAME = FORM_NAME || "";
    USE_UID = "";
    NOTLOGIN_FLAG = "";
    PRIV_OP = PRIV_OP || "";
    TO_ID = TO_ID || "TO_ID";
    TO_NAME = TO_NAME || "TO_NAME";
    if (userSaveAndBind[TO_ID] == undefined) {
        userSaveAndBind[TO_ID] = [];
    }
    if (userSaveAndBind[TO_NAME] == undefined) {
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery("input[name=" + TO_ID + "]").val() != "" && userSaveAndBind[TO_ID] == "") {
        userSaveAndBind[TO_ID].push(jQuery("input[name=" + TO_ID + "]").val());
        userSaveAndBind[TO_ID] = userSaveAndBind[TO_ID].toString().split(",");
        if (userSaveAndBind[TO_ID][userSaveAndBind[TO_ID].length - 1] == "") {
            userSaveAndBind[TO_ID].pop();
        }
        if (jQuery("input[name=" + TO_NAME + "]").length > 0) {
            userSaveAndBind[TO_NAME].push(jQuery("input[name=" + TO_NAME + "]").val());
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        } else {
            userSaveAndBind[TO_NAME].push(jQuery("textarea[name=" + TO_NAME + "]").text()).toString().split(",");
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        }
    }

    if (jQuery("input[name=" + TO_ID + "]").val() == "") {
        userSaveAndBind[TO_ID] = [];
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery(".alert-modal-box").length > 0) {
        jQuery(".alert-modal-box").remove();
    }
    createPrivAlertModal();

    jQuery(".alert-modal-box").attr("data-to-id", TO_ID);
    jQuery(".alert-modal-box").attr("data-to-name", TO_NAME);
    jQuery(".alert-modal-box").attr("data-module_id", MODULE_ID);
    jQuery(".alert-modal-box").attr("data-func_id", FUNC_ID);
    jQuery(".alert-modal-box").attr("data-manage_flag", MANAGE_FLAG);
    jQuery(".alert-modal-box").attr("data-title", TITLE);
    jQuery(".alert-modal-box").attr("data-form_name", FORM_NAME);
    jQuery(".alert-modal-box").attr("data-use_uid", USE_UID);
    jQuery(".alert-modal-box").attr("data-notlogin_flag", NOTLOGIN_FLAG);
    jQuery(".alert-modal-box").attr("data-priv_op", PRIV_OP);
    jQuery(".alert-modal-box").attr("data-role", "role");
    jQuery(".alert-modal-box").attr("data-ajax-url", "/module/priv_select/data.php");

    //判断是否显示已选
    jQuery("#navMenu a").removeClass("active"); //去除a标签的active
    if (userSaveAndBind[TO_ID] != "") {
        jQuery(".alert-modal-box-text-box .main-block").hide();
        jQuery(".alert-modal-box-text-box #block_selected").show();
        jQuery("#navMenu a[block='selected']").addClass("active");
    } else {
        jQuery(".alert-modal-box-text-box .main-block").hide();
        jQuery(".alert-modal-box-text-box #block_dept").show();
        jQuery("#navMenu a[block='dept']").addClass("active");
    }

    if(window.external && typeof window.external.OA_SMS != 'undefined'){
        if (window.external.OA_SMS("","","GET_IE_VERSION") == 8 || window.external.OA_SMS("","","GET_IE_VERSION") == 6) {

        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    } else {
        if (navigator.appName == "Microsoft Internet Explorer") {
            if(document.all && document.querySelector && !document.addEventListener) {
                
            }
            if(document.all && document.addEventListener) {
                new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
            }
        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    }

    userSaveAndBind.initSelectPriv(TO_ID, TO_NAME, 1)
    userSaveAndBind.itemMostBindClick(TO_ID, TO_NAME);
    userSaveAndBind.blockRightItemClick(TO_ID, TO_NAME);
    userSaveAndBind.bigButtonClick(TO_ID, TO_NAME);
    userSaveAndBind.closeSpanClick();
    userSaveAndBind.initPrivSelected(TO_ID, TO_NAME);
    userSaveAndBind.bindPrivKeyUp(TO_ID, TO_NAME);

    jQuery('.alert-modal-box-background').click(function () {
        jQuery(".alert-modal-box").remove();
    })
}

function SelectPrivSingle(MODULE_ID, TO_ID, TO_NAME, PRIV_OP, FORM_NAME, FUNC_ID) {
    FUNC_ID = FUNC_ID || "";
    MODULE_ID = MODULE_ID || "";
    MANAGE_FLAG = "";
    TITLE = "";
    FORM_NAME = FORM_NAME || "";
    USE_UID = "";
    NOTLOGIN_FLAG = "";
    PRIV_OP = PRIV_OP || "";
    TO_ID = TO_ID || "TO_ID";
    TO_NAME = TO_NAME || "TO_NAME";
    if (userSaveAndBind[TO_ID] == undefined) {
        userSaveAndBind[TO_ID] = [];
    }
    if (userSaveAndBind[TO_NAME] == undefined) {
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery("input[name=" + TO_ID + "]").val() != "" && userSaveAndBind[TO_ID] == "") {
        userSaveAndBind[TO_ID].push(jQuery("input[name=" + TO_ID + "]").val());
        userSaveAndBind[TO_ID] = userSaveAndBind[TO_ID].toString().split(",");
        if (userSaveAndBind[TO_ID][userSaveAndBind[TO_ID].length - 1] == "") {
            userSaveAndBind[TO_ID].pop();
        }
        if (jQuery("input[name=" + TO_NAME + "]").length > 0) {
            userSaveAndBind[TO_NAME].push(jQuery("input[name=" + TO_NAME + "]").val());
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        } else {
            userSaveAndBind[TO_NAME].push(jQuery("textarea[name=" + TO_NAME + "]").text()).toString().split(",");
            userSaveAndBind[TO_NAME] = userSaveAndBind[TO_NAME].toString().split(",");
            if (userSaveAndBind[TO_NAME][userSaveAndBind[TO_NAME].length - 1] == "") {
                userSaveAndBind[TO_NAME].pop();
            }
        }
    }

    if (jQuery("input[name=" + TO_ID + "]").val() == "") {
        userSaveAndBind[TO_ID] = [];
        userSaveAndBind[TO_NAME] = [];
    }

    if (jQuery(".alert-modal-box").length > 0) {
        jQuery(".alert-modal-box").remove();
    }
    createPrivSingleAlertModal();

    jQuery(".alert-modal-box").attr("data-to-id", TO_ID);
    jQuery(".alert-modal-box").attr("data-to-name", TO_NAME);
    jQuery(".alert-modal-box").attr("data-module_id", MODULE_ID);
    jQuery(".alert-modal-box").attr("data-func_id", FUNC_ID);
    jQuery(".alert-modal-box").attr("data-manage_flag", MANAGE_FLAG);
    jQuery(".alert-modal-box").attr("data-title", TITLE);
    jQuery(".alert-modal-box").attr("data-form_name", FORM_NAME);
    jQuery(".alert-modal-box").attr("data-use_uid", USE_UID);
    jQuery(".alert-modal-box").attr("data-notlogin_flag", NOTLOGIN_FLAG);
    jQuery(".alert-modal-box").attr("data-priv_op", PRIV_OP);
    jQuery(".alert-modal-box").attr("data-role", "role");
    jQuery(".alert-modal-box").attr("data-noall", "noall");
    jQuery(".alert-modal-box").attr("data-ajax-url", "/module/priv_select/data.php");

    jQuery("#block_dept").css({
        "display": "block",
        //"top": "0"
    });

    if(window.external && typeof window.external.OA_SMS != 'undefined'){
        if (window.external.OA_SMS("","","GET_IE_VERSION") == 8 || window.external.OA_SMS("","","GET_IE_VERSION") == 6) {

        } else {
            new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    } else {
        if (navigator.appName == "Microsoft Internet Explorer") {
            if(document.all && document.querySelector && !document.addEventListener) {
                
            }
            if(document.all && document.addEventListener) {
				new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
            }
        } else {
			new Draggable('#north',{parentMove:'.alert-modal-box-text-box'});
        }
    }

    userSaveAndBind.initSelectPriv(TO_ID, TO_NAME, 0)
    userSaveAndBind.itemMostBindClick(TO_ID, TO_NAME);
    userSaveAndBind.itemSelectDeptSingleBindClick(TO_ID, TO_NAME);

    jQuery('.alert-modal-box-background').click(function () {
        jQuery(".alert-modal-box").remove();
    })

}

function SelectOrg(MODULE_ID, TO_ID, TO_NAME, PRIV_OP, FORM_NAME, SINGLE_SELECT) {
    URL = "/module/org_select/?MODULE_ID=" + MODULE_ID + "&TO_ID=" + TO_ID + "&TO_NAME=" + TO_NAME + "&PRIV_OP=" + PRIV_OP + "&FORM_NAME=" + FORM_NAME + "&SINGLE_SELECT=" + SINGLE_SELECT;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - 100;
        loc_y = document.body.scrollTop + event.clientY + 170;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 250, 350);
}

function SelectMytable(TO_ID, TO_NAME, POS) {
    URL = "/module/mytable/?TO_ID=" + TO_ID + "&TO_NAME=" + TO_NAME + "&POS=" + POS;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - 100;
        loc_y = document.body.scrollTop + event.clientY + 170;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 500, 350);
}

function SelectPortal(TO_ID, TO_NAME) {
    URL = "/module/portal/?TO_ID=" + TO_ID + "&TO_NAME=" + TO_NAME;
    loc_x = 500;
    loc_y = 100;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX + 250;
        loc_y = document.body.scrollTop + event.clientY + 80;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 100, 350);
}

function SelectShortcut(TO_ID, TO_NAME) {
    URL = "/module/shortcut/?TO_ID=" + TO_ID + "&TO_NAME=" + TO_NAME;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - 100;
        loc_y = document.body.scrollTop + event.clientY + 170;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 500, 350);
}

function td_calendar(fieldname) {
    var URL = "/inc/calendar.php?FIELDNAME=" + fieldname;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - event.offsetX - 80;
        loc_y = document.body.scrollTop + event.clientY - event.offsetY + 140;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 300, 230);
}

function td_clock(fieldname) {
    var URL = "/inc/clock.php?FIELDNAME=" + fieldname;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - event.offsetX - 80;
        loc_y = document.body.scrollTop + event.clientY - event.offsetY + 140;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 280, 120);
}

function SelectAddr(FIELD, TO_ID, FORM_NAME) {
    URL = "/module/addr_select/?FIELD=" + FIELD + "&TO_ID=" + TO_ID + "&FORM_NAME=" + FORM_NAME;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - event.offsetX - 100;
        loc_y = document.body.scrollTop + event.clientY - event.offsetY + 170;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 600, 350); //这里设置了选人窗口的宽度和高度
}

function ClearAddr(TO_ID) {
    if (TO_ID == "" || TO_ID == "undefined" || TO_ID == null)
        return;
    document.getElementsByName(TO_ID)[0].value = "";
}

function AddFav(FAV_DESC, FAV_URL, OPEN_WINDOW) {
    URL = "/module/fav/?URL_DESC=" + encodeURIComponent(FAV_DESC) + "&URL=" + encodeURIComponent(FAV_URL) + "&OPEN_WINDOW=" + OPEN_WINDOW;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = (window.screen.availWidth - 400) / 2;
        loc_y = (window.screen.availHeight - 130) / 2 - 100;
    }
    window.open(URL, "fav", "height=220,width=600,status=0,toolbar=no,menubar=no,location=no,scrollbars=no,top=" + loc_y + ",left=" + loc_x + ",resizable=yes");
}

function LoadForeColorTable(ClickFunc) {
    var tColor = "";
    var tRowNum = 8;
    var tColorAry = new Array();
    tColorAry[0] = "#000000";
    tColorAry[1] = "#993300";
    tColorAry[2] = "#333300";
    tColorAry[3] = "#003300";
    tColorAry[4] = "#003366";
    tColorAry[5] = "#000080";
    tColorAry[6] = "#333399";
    tColorAry[7] = "#333333";

    tColorAry[8] = "#800000";
    tColorAry[9] = "#FF6600";
    tColorAry[10] = "#808000";
    tColorAry[11] = "#008000";
    tColorAry[12] = "#008080";
    tColorAry[13] = "#0000FF";
    tColorAry[14] = "#666699";
    tColorAry[15] = "#808080";

    tColorAry[16] = "#0066CC";
    tColorAry[17] = "#FF9900";
    tColorAry[18] = "#99CC00";
    tColorAry[19] = "#339966";
    tColorAry[20] = "#33CCCC";
    tColorAry[21] = "#3366FF";
    tColorAry[22] = "#800080";
    tColorAry[23] = "#999999";

    tColorAry[24] = "#FF00FF";
    tColorAry[25] = "#FFCC00";
    tColorAry[26] = "#FFFF00";
    tColorAry[27] = "#00FF00";
    tColorAry[28] = "#00FFFF";
    tColorAry[29] = "#00CCFF";
    tColorAry[30] = "#993366";
    tColorAry[31] = "#CCCCCC";

    tColorAry[32] = "#FF99CC";
    tColorAry[33] = "#FFCC99";
    tColorAry[34] = "#FFFF99";
    tColorAry[35] = "#CCFFCC";
    tColorAry[36] = "#CCFFFF";
    tColorAry[37] = "#99CCFF";
    tColorAry[38] = "#CC99FF";
    tColorAry[39] = "#FFFFFF";

    var tColorTableHTML = '<table cellpadding="0" cellspacing="0" class="ColorTable">';
    tColorTableHTML += '  <tr>';
    for (var ti = 0; ti < tColorAry.length; ti++) {
        tColorTableHTML += '    <td onmouseover="this.className=\'Selected\';" onmouseout="this.className=\'\';" onclick="' + ClickFunc + '(\'' + tColorAry[ti] + '\');"';
        if (tColor.toUpperCase() == tColorAry[ti])
            tColorTableHTML += ' class="Selected"';
        tColorTableHTML += '><div style="width:11px;height:11px;background-color:' + tColorAry[ti] + ';"></div></td>';
        if ((ti + 1) % tRowNum == 0 && ti + 1 != tColorAry.length) {
            tColorTableHTML += '  </tr>';
            tColorTableHTML += '  <tr>';
        };
    };
    tColorTableHTML += '  </tr>';
    tColorTableHTML += '</table>';

    return tColorTableHTML;
}

function LoadForeColorTable_notify(ClickFunc) {
    var tColor = "";
    var tRowNum = 6;
    var tColorAry = new Array();
    tColorAry[0] = "#000000";
    tColorAry[1] = "#78b800";
    tColorAry[2] = "#0159df";
    tColorAry[3] = "#630098";
    tColorAry[4] = "#e5ad00";
    tColorAry[5] = "#f00001";

    var tColorTableHTML = '<table cellpadding="0" cellspacing="0" class="ColorTable">';
    tColorTableHTML += '  <tr>';
    for (var ti = 0; ti < tColorAry.length; ti++) {
        tColorTableHTML += '    <td onmouseover="this.className=\'Selected\';" onmouseout="this.className=\'\';" onclick="' + ClickFunc + '(\'' + tColorAry[ti] + '\');"';
        if (tColor.toUpperCase() == tColorAry[ti])
            tColorTableHTML += ' class="Selected"';
        tColorTableHTML += '><div style="width:15px;height:19px;background-color:' + tColorAry[ti] + ';"></div></td>';
        if ((ti + 1) % tRowNum == 0 && ti + 1 != tColorAry.length) {
            tColorTableHTML += '  </tr>';
            tColorTableHTML += '  <tr>';
        };
    };
    tColorTableHTML += '  </tr>';
    tColorTableHTML += '</table>';

    return tColorTableHTML;
}

function SelectUserExternal(MODULE_ID, TO_ID, TO_NAME, MANAGE_FLAG, FORM_NAME) {
    URL = "/module/user_external_select/?MODULE_ID=" + MODULE_ID +
        "&TO_ID=" + TO_ID +
        "&TO_NAME=" + TO_NAME +
        "&MANAGE_FLAG=" + MANAGE_FLAG +
        "&FORM_NAME=" + FORM_NAME;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX + 60;
        loc_y = document.body.scrollTop + event.clientY + 170;
    }
    //window.open(URL);
    LoadDialogWindow(URL, self, loc_x, loc_y, 220, 350); //这里设置了选人窗口的宽度和高度
}

function SelectTable(TO_ID, DB_NAME, FORM_NAME) {
    URL = "/module/table_select/?TO_ID=" + TO_ID + "&DB_NAME=" + DB_NAME + "&FORM_NAME=" + FORM_NAME;
    loc_y = loc_x = 200;
    if (is_ie) {
        loc_x = document.body.scrollLeft + event.clientX - 100;
        loc_y = document.body.scrollTop + event.clientY;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 600, 450);
}

function ClearTable(TO_ID) {
    if (TO_ID == "" || TO_ID == "undefined" || TO_ID == null) {
        TO_ID = "TABLES";
    }
    document.getElementsByName(TO_ID)[0].value = "";
}
