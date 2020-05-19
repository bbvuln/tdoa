// "/static/js/jquery-1.5.1/jquery.min.js","/static/js/jquery-1.5.1/jquery-ui.custom.min.js","/static/js/jquery-1.5.1/jquery.ui.autocomplete.min.js","/static/js/jquery-1.5.1/tooltip/jquery.tooltip.min.js","/static/js/jquery-1.5.1/jsrender/jsrender.gbk.min.js","/static/js/jquery-1.5.1/jquery.tipsy/jquery.tipsy.js","/static/js/dialog.js","/static/js/mouse_mon.js","/static/js/tdPass.js","/general/approve_center/list/input_form/js/work_handle.js","/general/approve_center/list/input_form/form.js","/static/modules/workflow/js/runtime.js","/static/js/arale/base/1.1.1/base.js","/static/js/arale/class/1.1.0/class.js","/static/js/arale/events/1.1.0/events.js"
/* "/static/js/jquery-1.5.1/jquery.min.js" */
/*!
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */
(function (a, b)
{
    function cg(a)
    {
        return d.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }

    function cd(a)
    {
        if (!bZ[a])
        {
            var b = d("<" + a + ">").appendTo("body"), c = b.css("display");
            b.remove();
            if (c === "none" || c === "")c = "block";
            bZ[a] = c
        }
        return bZ[a]
    }

    function cc(a, b)
    {
        var c = {};
        d.each(cb.concat.apply([], cb.slice(0, b)), function ()
        {
            c[this] = a
        });
        return c
    }

    function bY()
    {
        try
        {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b)
        {
        }
    }

    function bX()
    {
        try
        {
            return new a.XMLHttpRequest
        } catch (b)
        {
        }
    }

    function bW()
    {
        d(a).unload(function ()
        {
            for (var a in bU)bU[a](0, 1)
        })
    }

    function bQ(a, c)
    {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var e = a.dataTypes, f = {}, g, h, i = e.length, j, k = e[0], l, m, n, o, p;
        for (g = 1; g < i; g++)
        {
            if (g === 1)for (h in a.converters)typeof h === "string" && (f[h.toLowerCase()] = a.converters[h]);
            l = k, k = e[g];
            if (k === "*")k = l; else if (l !== "*" && l !== k)
            {
                m = l + " " + k, n = f[m] || f["* " + k];
                if (!n)
                {
                    p = b;
                    for (o in f)
                    {
                        j = o.split(" ");
                        if (j[0] === l || j[0] === "*")
                        {
                            p = f[j[1] + " " + k];
                            if (p)
                            {
                                o = f[o], o === !0 ? n = p : p === !0 && (n = o);
                                break
                            }
                        }
                    }
                }
                !n && !p && d.error("No conversion from " + m.replace(" ", " to ")), n !== !0 && (c = n ? n(c) : p(o(c)))
            }
        }
        return c
    }

    function bP(a, c, d)
    {
        var e = a.contents, f = a.dataTypes, g = a.responseFields, h, i, j, k;
        for (i in g)i in d && (c[g[i]] = d[i]);
        while (f[0] === "*")f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
        if (h)for (i in e)if (e[i] && e[i].test(h))
        {
            f.unshift(i);
            break
        }
        if (f[0] in d)j = f[0]; else
        {
            for (i in d)
            {
                if (!f[0] || a.converters[i + " " + f[0]])
                {
                    j = i;
                    break
                }
                k || (k = i)
            }
            j = j || k
        }
        if (j)
        {
            j !== f[0] && f.unshift(j);
            return d[j]
        }
    }

    function bO(a, b, c, e)
    {
        if (d.isArray(b) && b.length)d.each(b, function (b, f)
        {
            c || bq.test(a) ? e(a, f) : bO(a + "[" + (typeof f === "object" || d.isArray(f) ? b : "") + "]", f, c, e)
        }); else if (c || b == null || typeof b !== "object")e(a, b); else if (d.isArray(b) || d.isEmptyObject(b))e(a, ""); else for (var f in b)bO(a + "[" + f + "]", b[f], c, e)
    }

    function bN(a, c, d, e, f, g)
    {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h = a[f], i = 0, j = h ? h.length : 0, k = a === bH, l;
        for (; i < j && (k || !l); i++)l = h[i](c, d, e), typeof l === "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = bN(a, c, d, e, l, g)));
        (k || !l) && !g["*"] && (l = bN(a, c, d, e, "*", g));
        return l
    }

    function bM(a)
    {
        return function (b, c)
        {
            typeof b !== "string" && (c = b, b = "*");
            if (d.isFunction(c))
            {
                var e = b.toLowerCase().split(bB), f = 0, g = e.length, h, i, j;
                for (; f < g; f++)h = e[f], j = /^\+/.test(h), j && (h = h.substr(1) || "*"), i = a[h] = a[h] || [], i[j ? "unshift" : "push"](c)
            }
        }
    }

    function bo(a, b, c)
    {
        var e = b === "width" ? bi : bj, f = b === "width" ? a.offsetWidth : a.offsetHeight;
        if (c === "border")return f;
        d.each(e, function ()
        {
            c || (f -= parseFloat(d.css(a, "padding" + this)) || 0), c === "margin" ? f += parseFloat(d.css(a, "margin" + this)) || 0 : f -= parseFloat(d.css(a, "border" + this + "Width")) || 0
        });
        return f
    }

    function ba(a, b)
    {
        b.src ? d.ajax({
            url: b.src,
            async: !1,
            dataType: "script"
        }) : d.globalEval(b.text || b.textContent || b.innerHTML || ""), b.parentNode && b.parentNode.removeChild(b)
    }

    function _(a)
    {
        return "getElementsByTagName" in a ? a.getElementsByTagName("*") : "querySelectorAll" in a ? a.querySelectorAll("*") : []
    }

    function $(a, b)
    {
        if (b.nodeType === 1)
        {
            var c = b.nodeName.toLowerCase();
            b.clearAttributes(), b.mergeAttributes(a);
            if (c === "object")b.outerHTML = a.outerHTML; else if (c !== "input" || a.type !== "checkbox" && a.type !== "radio")
            {
                if (c === "option")b.selected = a.defaultSelected; else if (c === "input" || c === "textarea")b.defaultValue = a.defaultValue
            } else a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value);
            b.removeAttribute(d.expando)
        }
    }

    function Z(a, b)
    {
        if (b.nodeType === 1 && d.hasData(a))
        {
            var c = d.expando, e = d.data(a), f = d.data(b, e);
            if (e = e[c])
            {
                var g = e.events;
                f = f[c] = d.extend({}, e);
                if (g)
                {
                    delete f.handle, f.events = {};
                    for (var h in g)for (var i = 0, j = g[h].length; i < j; i++)d.event.add(b, h + (g[h][i].namespace ? "." : "") + g[h][i].namespace, g[h][i], g[h][i].data)
                }
            }
        }
    }

    function Y(a, b)
    {
        return d.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function O(a, b, c)
    {
        if (d.isFunction(b))return d.grep(a, function (a, d)
        {
            var e = !!b.call(a, d, a);
            return e === c
        });
        if (b.nodeType)return d.grep(a, function (a, d)
        {
            return a === b === c
        });
        if (typeof b === "string")
        {
            var e = d.grep(a, function (a)
            {
                return a.nodeType === 1
            });
            if (J.test(b))return d.filter(b, e, !c);
            b = d.filter(b, e)
        }
        return d.grep(a, function (a, e)
        {
            return d.inArray(a, b) >= 0 === c
        })
    }

    function N(a)
    {
        return !a || !a.parentNode || a.parentNode.nodeType === 11
    }

    function F(a, b)
    {
        return (a && a !== "*" ? a + "." : "") + b.replace(r, "`").replace(s, "&")
    }

    function E(a)
    {
        var b, c, e, f, g, h, i, j, k, l, m, n, o, q = [], r = [], s = d._data(this, "events");
        if (a.liveFired !== this && s && s.live && !a.target.disabled && (!a.button || a.type !== "click"))
        {
            a.namespace && (n = new RegExp("(^|\\.)" + a.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)")), a.liveFired = this;
            var t = s.live.slice(0);
            for (i = 0; i < t.length; i++)g = t[i], g.origType.replace(p, "") === a.type ? r.push(g.selector) : t.splice(i--, 1);
            f = d(a.target).closest(r, a.currentTarget);
            for (j = 0, k = f.length; j < k; j++)
            {
                m = f[j];
                for (i = 0; i < t.length; i++)
                {
                    g = t[i];
                    if (m.selector === g.selector && (!n || n.test(g.namespace)) && !m.elem.disabled)
                    {
                        h = m.elem, e = null;
                        if (g.preType === "mouseenter" || g.preType === "mouseleave")a.type = g.preType, e = d(a.relatedTarget).closest(g.selector)[0];
                        (!e || e !== h) && q.push({elem: h, handleObj: g, level: m.level})
                    }
                }
            }
            for (j = 0, k = q.length; j < k; j++)
            {
                f = q[j];
                if (c && f.level > c)break;
                a.currentTarget = f.elem, a.data = f.handleObj.data, a.handleObj = f.handleObj, o = f.handleObj.origHandler.apply(f.elem, arguments);
                if (o === !1 || a.isPropagationStopped())
                {
                    c = f.level, o === !1 && (b = !1);
                    if (a.isImmediatePropagationStopped())break
                }
            }
            return b
        }
    }

    function C(a, c, e)
    {
        var f = d.extend({}, e[0]);
        f.type = a, f.originalEvent = {}, f.liveFired = b, d.event.handle.call(c, f), f.isDefaultPrevented() && e[0].preventDefault()
    }

    function w()
    {
        return !0
    }

    function v()
    {
        return !1
    }

    function g(a)
    {
        for (var b in a)if (b !== "toJSON")return !1;
        return !0
    }

    function f(a, c, f)
    {
        if (f === b && a.nodeType === 1)
        {
            f = a.getAttribute("data-" + c);
            if (typeof f === "string")
            {
                try
                {
                    f = f === "true" ? !0 : f === "false" ? !1 : f === "null" ? null : d.isNaN(f) ? e.test(f) ? d.parseJSON(f) : f : parseFloat(f)
                } catch (g)
                {
                }
                d.data(a, c, f)
            } else f = b
        }
        return f
    }

    var c = a.document, d = function ()
    {
        function I()
        {
            if (!d.isReady)
            {
                try
                {
                    c.documentElement.doScroll("left")
                } catch (a)
                {
                    setTimeout(I, 1);
                    return
                }
                d.ready()
            }
        }

        var d = function (a, b)
        {
            return new d.fn.init(a, b, g)
        }, e = a.jQuery, f = a.$, g, h = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/, i = /\S/, j = /^\s+/, k = /\s+$/, l = /\d/, m = /^<(\w+)\s*\/?>(?:<\/\1>)?$/, n = /^[\],:{}\s]*$/, o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, p = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, q = /(?:^|:|,)(?:\s*\[)+/g, r = /(webkit)[ \/]([\w.]+)/, s = /(opera)(?:.*version)?[ \/]([\w.]+)/, t = /(msie) ([\w.]+)/, t_11 = /(trident)(?:.*rv:([\w.]+))?/, u = /(mozilla)(?:.*? rv:([\w.]+))?/, v = navigator.userAgent, w, x = !1, y, z = "then done fail isResolved isRejected promise".split(" "), A, B = Object.prototype.toString, C = Object.prototype.hasOwnProperty, D = Array.prototype.push, E = Array.prototype.slice, F = String.prototype.trim, G = Array.prototype.indexOf, H = {};
        d.fn = d.prototype = {
            constructor: d, init: function (a, e, f)
            {
                var g, i, j, k;
                if (!a)return this;
                if (a.nodeType)
                {
                    this.context = this[0] = a, this.length = 1;
                    return this
                }
                if (a === "body" && !e && c.body)
                {
                    this.context = c, this[0] = c.body, this.selector = "body", this.length = 1;
                    return this
                }
                if (typeof a === "string")
                {
                    g = h.exec(a);
                    if (!g || !g[1] && e)return !e || e.jquery ? (e || f).find(a) : this.constructor(e).find(a);
                    if (g[1])
                    {
                        e = e instanceof d ? e[0] : e, k = e ? e.ownerDocument || e : c, j = m.exec(a), j ? d.isPlainObject(e) ? (a = [c.createElement(j[1])], d.fn.attr.call(a, e, !0)) : a = [k.createElement(j[1])] : (j = d.buildFragment([g[1]], [k]), a = (j.cacheable ? d.clone(j.fragment) : j.fragment).childNodes);
                        return d.merge(this, a)
                    }
                    i = c.getElementById(g[2]);
                    if (i && i.parentNode)
                    {
                        if (i.id !== g[2])return f.find(a);
                        this.length = 1, this[0] = i
                    }
                    this.context = c, this.selector = a;
                    return this
                }
                if (d.isFunction(a))return f.ready(a);
                a.selector !== b && (this.selector = a.selector, this.context = a.context);
                return d.makeArray(a, this)
            }, selector: "", jquery: "1.5.1", length: 0, size: function ()
            {
                return this.length
            }, toArray: function ()
            {
                return E.call(this, 0)
            }, get: function (a)
            {
                return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
            }, pushStack: function (a, b, c)
            {
                var e = this.constructor();
                d.isArray(a) ? D.apply(e, a) : d.merge(e, a), e.prevObject = this, e.context = this.context, b === "find" ? e.selector = this.selector + (this.selector ? " " : "") + c : b && (e.selector = this.selector + "." + b + "(" + c + ")");
                return e
            }, each: function (a, b)
            {
                return d.each(this, a, b)
            }, ready: function (a)
            {
                d.bindReady(), y.done(a);
                return this
            }, eq: function (a)
            {
                return a === -1 ? this.slice(a) : this.slice(a, +a + 1)
            }, first: function ()
            {
                return this.eq(0)
            }, last: function ()
            {
                return this.eq(-1)
            }, slice: function ()
            {
                return this.pushStack(E.apply(this, arguments), "slice", E.call(arguments).join(","))
            }, map: function (a)
            {
                return this.pushStack(d.map(this, function (b, c)
                {
                    return a.call(b, c, b)
                }))
            }, end: function ()
            {
                return this.prevObject || this.constructor(null)
            }, push: D, sort: [].sort, splice: [].splice
        }, d.fn.init.prototype = d.fn, d.extend = d.fn.extend = function ()
        {
            var a, c, e, f, g, h, i = arguments[0] || {}, j = 1, k = arguments.length, l = !1;
            typeof i === "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i !== "object" && !d.isFunction(i) && (i = {}), k === j && (i = this, --j);
            for (; j < k; j++)if ((a = arguments[j]) != null)for (c in a)
            {
                e = i[c], f = a[c];
                if (i === f)continue;
                l && f && (d.isPlainObject(f) || (g = d.isArray(f))) ? (g ? (g = !1, h = e && d.isArray(e) ? e : []) : h = e && d.isPlainObject(e) ? e : {}, i[c] = d.extend(l, h, f)) : f !== b && (i[c] = f)
            }
            return i
        }, d.extend({
            noConflict: function (b)
            {
                a.$ = f, b && (a.jQuery = e);
                return d
            }, isReady: !1, readyWait: 1, ready: function (a)
            {
                a === !0 && d.readyWait--;
                if (!d.readyWait || a !== !0 && !d.isReady)
                {
                    if (!c.body)return setTimeout(d.ready, 1);
                    d.isReady = !0;
                    if (a !== !0 && --d.readyWait > 0)return;
                    y.resolveWith(c, [d]), d.fn.trigger && d(c).trigger("ready").unbind("ready")
                }
            }, bindReady: function ()
            {
                if (!x)
                {
                    x = !0;
                    if (c.readyState === "complete")return setTimeout(d.ready, 1);
                    if (c.addEventListener)c.addEventListener("DOMContentLoaded", A, !1), a.addEventListener("load", d.ready, !1); else if (c.attachEvent)
                    {
                        c.attachEvent("onreadystatechange", A), a.attachEvent("onload", d.ready);
                        var b = !1;
                        try
                        {
                            b = a.frameElement == null
                        } catch (e)
                        {
                        }
                        c.documentElement.doScroll && b && I()
                    }
                }
            }, isFunction: function (a)
            {
                return d.type(a) === "function"
            }, isArray: Array.isArray || function (a)
            {
                return d.type(a) === "array"
            }, isWindow: function (a)
            {
                return a && typeof a === "object" && "setInterval" in a
            }, isNaN: function (a)
            {
                return a == null || !l.test(a) || isNaN(a)
            }, type: function (a)
            {
                return a == null ? String(a) : H[B.call(a)] || "object"
            }, isPlainObject: function (a)
            {
                if (!a || d.type(a) !== "object" || a.nodeType || d.isWindow(a))return !1;
                if (a.constructor && !C.call(a, "constructor") && !C.call(a.constructor.prototype, "isPrototypeOf"))return !1;
                var c;
                for (c in a)
                {
                }
                return c === b || C.call(a, c)
            }, isEmptyObject: function (a)
            {
                for (var b in a)return !1;
                return !0
            }, error: function (a)
            {
                throw a
            }, parseJSON: function (b)
            {
                if (typeof b !== "string" || !b)return null;
                b = d.trim(b);
                if (n.test(b.replace(o, "@").replace(p, "]").replace(q, "")))return a.JSON && a.JSON.parse ? a.JSON.parse(b) : (new Function("return " + b))();
                d.error("Invalid JSON: " + b)
            }, parseXML: function (b, c, e)
            {
                a.DOMParser ? (e = new DOMParser, c = e.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b)), e = c.documentElement, (!e || !e.nodeName || e.nodeName === "parsererror") && d.error("Invalid XML: " + b);
                return c
            }, noop: function ()
            {
            }, globalEval: function (a)
            {
                if (a && i.test(a))
                {
                    var b = c.head || c.getElementsByTagName("head")[0] || c.documentElement, e = c.createElement("script");
                    d.support.scriptEval() ? e.appendChild(c.createTextNode(a)) : e.text = a, b.insertBefore(e, b.firstChild), b.removeChild(e)
                }
            }, nodeName: function (a, b)
            {
                return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
            }, each: function (a, c, e)
            {
                var f, g = 0, h = a.length, i = h === b || d.isFunction(a);
                if (e)
                {
                    if (i)
                    {
                        for (f in a)if (c.apply(a[f], e) === !1)break
                    } else for (; g < h;)if (c.apply(a[g++], e) === !1)break
                } else if (i)
                {
                    for (f in a)if (c.call(a[f], f, a[f]) === !1)break
                } else for (var j = a[0]; g < h && c.call(j, g, j) !== !1; j = a[++g])
                    {
                    }
                return a
            }, trim: F ? function (a)
            {
                return a == null ? "" : F.call(a)
            } : function (a)
            {
                return a == null ? "" : (a + "").replace(j, "").replace(k, "")
            }, makeArray: function (a, b)
            {
                var c = b || [];
                if (a != null)
                {
                    var e = d.type(a);
                    a.length == null || e === "string" || e === "function" || e === "regexp" || d.isWindow(a) ? D.call(c, a) : d.merge(c, a)
                }
                return c
            }, inArray: function (a, b)
            {
                if (b.indexOf)return b.indexOf(a);
                for (var c = 0, d = b.length; c < d; c++)if (b[c] === a)return c;
                return -1
            }, merge: function (a, c)
            {
                var d = a.length, e = 0;
                if (typeof c.length === "number")for (var f = c.length; e < f; e++)a[d++] = c[e]; else while (c[e] !== b)a[d++] = c[e++];
                a.length = d;
                return a
            }, grep: function (a, b, c)
            {
                var d = [], e;
                c = !!c;
                for (var f = 0, g = a.length; f < g; f++)e = !!b(a[f], f), c !== e && d.push(a[f]);
                return d
            }, map: function (a, b, c)
            {
                var d = [], e;
                for (var f = 0, g = a.length; f < g; f++)e = b(a[f], f, c), e != null && (d[d.length] = e);
                return d.concat.apply([], d)
            }, guid: 1, proxy: function (a, c, e)
            {
                arguments.length === 2 && (typeof c === "string" ? (e = a, a = e[c], c = b) : c && !d.isFunction(c) && (e = c, c = b)), !c && a && (c = function ()
                {
                    return a.apply(e || this, arguments)
                }), a && (c.guid = a.guid = a.guid || c.guid || d.guid++);
                return c
            }, access: function (a, c, e, f, g, h)
            {
                var i = a.length;
                if (typeof c === "object")
                {
                    for (var j in c)d.access(a, j, c[j], f, g, e);
                    return a
                }
                if (e !== b)
                {
                    f = !h && f && d.isFunction(e);
                    for (var k = 0; k < i; k++)g(a[k], c, f ? e.call(a[k], k, g(a[k], c)) : e, h);
                    return a
                }
                return i ? g(a[0], c) : b
            }, now: function ()
            {
                return (new Date).getTime()
            }, _Deferred: function ()
            {
                var a = [], b, c, e, f = {
                    done: function ()
                    {
                        if (!e)
                        {
                            var c = arguments, g, h, i, j, k;
                            b && (k = b, b = 0);
                            for (g = 0, h = c.length; g < h; g++)i = c[g], j = d.type(i), j === "array" ? f.done.apply(f, i) : j === "function" && a.push(i);
                            k && f.resolveWith(k[0], k[1])
                        }
                        return this
                    }, resolveWith: function (d, f)
                    {
                        if (!e && !b && !c)
                        {
                            c = 1;
                            try
                            {
                                while (a[0])a.shift().apply(d, f)
                            } catch (g)
                            {
                                throw g
                            } finally
                            {
                                b = [d, f], c = 0
                            }
                        }
                        return this
                    }, resolve: function ()
                    {
                        f.resolveWith(d.isFunction(this.promise) ? this.promise() : this, arguments);
                        return this
                    }, isResolved: function ()
                    {
                        return c || b
                    }, cancel: function ()
                    {
                        e = 1, a = [];
                        return this
                    }
                };
                return f
            }, Deferred: function (a)
            {
                var b = d._Deferred(), c = d._Deferred(), e;
                d.extend(b, {
                    then: function (a, c)
                    {
                        b.done(a).fail(c);
                        return this
                    },
                    fail: c.done,
                    rejectWith: c.resolveWith,
                    reject: c.resolve,
                    isRejected: c.isResolved,
                    promise: function (a)
                    {
                        if (a == null)
                        {
                            if (e)return e;
                            e = a = {}
                        }
                        var c = z.length;
                        while (c--)a[z[c]] = b[z[c]];
                        return a
                    }
                }), b.done(c.cancel).fail(b.cancel), delete b.cancel, a && a.call(b, b);
                return b
            }, when: function (a)
            {
                var b = arguments.length, c = b <= 1 && a && d.isFunction(a.promise) ? a : d.Deferred(), e = c.promise();
                if (b > 1)
                {
                    var f = E.call(arguments, 0), g = b, h = function (a)
                    {
                        return function (b)
                        {
                            f[a] = arguments.length > 1 ? E.call(arguments, 0) : b, --g || c.resolveWith(e, f)
                        }
                    };
                    while (b--)a = f[b], a && d.isFunction(a.promise) ? a.promise().then(h(b), c.reject) : --g;
                    g || c.resolveWith(e, f)
                } else c !== a && c.resolve(a);
                return e
            }, uaMatch: function (a)
            {
                a = a.toLowerCase();
                var b = r.exec(a) || s.exec(a) || t.exec(a) || t_11.exec(a) || a.indexOf("compatible") < 0 && u.exec(a) || [];
                if (b[1] == 'trident')
                {
                    b[1] = 'msie';
                }
                return {browser: b[1] || "", version: b[2] || "0"}
            }, sub: function ()
            {
                function a(b, c)
                {
                    return new a.fn.init(b, c)
                }

                d.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.subclass = this.subclass, a.fn.init = function b(b, c)
                {
                    c && c instanceof d && !(c instanceof a) && (c = a(c));
                    return d.fn.init.call(this, b, c, e)
                }, a.fn.init.prototype = a.fn;
                var e = a(c);
                return a
            }, browser: {}
        }), y = d._Deferred(), d.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (a, b)
        {
            H["[object " + b + "]"] = b.toLowerCase()
        }), w = d.uaMatch(v), w.browser && (d.browser[w.browser] = !0, d.browser.version = w.version), d.browser.webkit && (d.browser.safari = !0), G && (d.inArray = function (a, b)
        {
            return G.call(b, a)
        }), i.test(" ") && (j = /^[\s\xA0]+/, k = /[\s\xA0]+$/), g = d(c), c.addEventListener ? A = function ()
        {
            c.removeEventListener("DOMContentLoaded", A, !1), d.ready()
        } : c.attachEvent && (A = function ()
        {
            c.readyState === "complete" && (c.detachEvent("onreadystatechange", A), d.ready())
        });
        return d
    }();
    (function ()
    {
        d.support = {};
        var b = c.createElement("div");
        b.style.display = "none", b.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";
        var e = b.getElementsByTagName("*"), f = b.getElementsByTagName("a")[0], g = c.createElement("select"), h = g.appendChild(c.createElement("option")), i = b.getElementsByTagName("input")[0];
        if (e && e.length && f)
        {
            d.support = {
                leadingWhitespace: b.firstChild.nodeType === 3,
                tbody: !b.getElementsByTagName("tbody").length,
                htmlSerialize: !!b.getElementsByTagName("link").length,
                style: /red/.test(f.getAttribute("style")),
                hrefNormalized: f.getAttribute("href") === "/a",
                opacity: /^0.55$/.test(f.style.opacity),
                cssFloat: !!f.style.cssFloat,
                checkOn: i.value === "on",
                optSelected: h.selected,
                deleteExpando: !0,
                optDisabled: !1,
                checkClone: !1,
                noCloneEvent: !0,
                noCloneChecked: !0,
                boxModel: null,
                inlineBlockNeedsLayout: !1,
                shrinkWrapBlocks: !1,
                reliableHiddenOffsets: !0
            }, i.checked = !0, d.support.noCloneChecked = i.cloneNode(!0).checked, g.disabled = !0, d.support.optDisabled = !h.disabled;
            var j = null;
            d.support.scriptEval = function ()
            {
                if (j === null)
                {
                    var b = c.documentElement, e = c.createElement("script"), f = "script" + d.now();
                    try
                    {
                        e.appendChild(c.createTextNode("window." + f + "=1;"))
                    } catch (g)
                    {
                    }
                    b.insertBefore(e, b.firstChild), a[f] ? (j = !0, delete a[f]) : j = !1, b.removeChild(e), b = e = f = null
                }
                return j
            };
            try
            {
                delete b.test
            } catch (k)
            {
                d.support.deleteExpando = !1
            }
            !b.addEventListener && b.attachEvent && b.fireEvent && (b.attachEvent("onclick", function l()
            {
                d.support.noCloneEvent = !1, b.detachEvent("onclick", l)
            }), b.cloneNode(!0).fireEvent("onclick")), b = c.createElement("div"), b.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";
            var m = c.createDocumentFragment();
            m.appendChild(b.firstChild), d.support.checkClone = m.cloneNode(!0).cloneNode(!0).lastChild.checked, d(function ()
            {
                var a = c.createElement("div"), b = c.getElementsByTagName("body")[0];
                if (b)
                {
                    a.style.width = a.style.paddingLeft = "1px", b.appendChild(a), d.boxModel = d.support.boxModel = a.offsetWidth === 2, "zoom" in a.style && (a.style.display = "inline", a.style.zoom = 1, d.support.inlineBlockNeedsLayout = a.offsetWidth === 2, a.style.display = "", a.innerHTML = "<div style='width:4px;'></div>", d.support.shrinkWrapBlocks = a.offsetWidth !== 2), a.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
                    var e = a.getElementsByTagName("td");
                    d.support.reliableHiddenOffsets = e[0].offsetHeight === 0, e[0].style.display = "", e[1].style.display = "none", d.support.reliableHiddenOffsets = d.support.reliableHiddenOffsets && e[0].offsetHeight === 0, a.innerHTML = "", b.removeChild(a).style.display = "none", a = e = null
                }
            });
            var n = function (a)
            {
                var b = c.createElement("div");
                a = "on" + a;
                if (!b.attachEvent)return !0;
                var d = a in b;
                d || (b.setAttribute(a, "return;"), d = typeof b[a] === "function"), b = null;
                return d
            };
            d.support.submitBubbles = n("submit"), d.support.changeBubbles = n("change"), b = e = f = null
        }
    })();
    var e = /^(?:\{.*\}|\[.*\])$/;
    d.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (d.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet: !0},
        hasData: function (a)
        {
            a = a.nodeType ? d.cache[a[d.expando]] : a[d.expando];
            return !!a && !g(a)
        },
        data: function (a, c, e, f)
        {
            if (d.acceptData(a))
            {
                var g = d.expando, h = typeof c === "string", i, j = a.nodeType, k = j ? d.cache : a, l = j ? a[d.expando] : a[d.expando] && d.expando;
                if ((!l || f && l && !k[l][g]) && h && e === b)return;
                l || (j ? a[d.expando] = l = ++d.uuid : l = d.expando), k[l] || (k[l] = {}, j || (k[l].toJSON = d.noop));
                if (typeof c === "object" || typeof c === "function")f ? k[l][g] = d.extend(k[l][g], c) : k[l] = d.extend(k[l], c);
                i = k[l], f && (i[g] || (i[g] = {}), i = i[g]), e !== b && (i[c] = e);
                if (c === "events" && !i[c])return i[g] && i[g].events;
                return h ? i[c] : i
            }
        },
        removeData: function (b, c, e)
        {
            if (d.acceptData(b))
            {
                var f = d.expando, h = b.nodeType, i = h ? d.cache : b, j = h ? b[d.expando] : d.expando;
                if (!i[j])return;
                if (c)
                {
                    var k = e ? i[j][f] : i[j];
                    if (k)
                    {
                        delete k[c];
                        if (!g(k))return
                    }
                }
                if (e)
                {
                    delete i[j][f];
                    if (!g(i[j]))return
                }
                var l = i[j][f];
                d.support.deleteExpando || i != a ? delete i[j] : i[j] = null, l ? (i[j] = {}, h || (i[j].toJSON = d.noop), i[j][f] = l) : h && (d.support.deleteExpando ? delete b[d.expando] : b.removeAttribute ? b.removeAttribute(d.expando) : b[d.expando] = null)
            }
        },
        _data: function (a, b, c)
        {
            return d.data(a, b, c, !0)
        },
        acceptData: function (a)
        {
            if (a.nodeName)
            {
                var b = d.noData[a.nodeName.toLowerCase()];
                if (b)return b !== !0 && a.getAttribute("classid") === b
            }
            return !0
        }
    }), d.fn.extend({
        data: function (a, c)
        {
            var e = null;
            if (typeof a === "undefined")
            {
                if (this.length)
                {
                    e = d.data(this[0]);
                    if (this[0].nodeType === 1)
                    {
                        var g = this[0].attributes, h;
                        for (var i = 0, j = g.length; i < j; i++)h = g[i].name, h.indexOf("data-") === 0 && (h = h.substr(5), f(this[0], h, e[h]))
                    }
                }
                return e
            }
            if (typeof a === "object")return this.each(function ()
            {
                d.data(this, a)
            });
            var k = a.split(".");
            k[1] = k[1] ? "." + k[1] : "";
            if (c === b)
            {
                e = this.triggerHandler("getData" + k[1] + "!", [k[0]]), e === b && this.length && (e = d.data(this[0], a), e = f(this[0], a, e));
                return e === b && k[1] ? this.data(k[0]) : e
            }
            return this.each(function ()
            {
                var b = d(this), e = [k[0], c];
                b.triggerHandler("setData" + k[1] + "!", e), d.data(this, a, c), b.triggerHandler("changeData" + k[1] + "!", e)
            })
        }, removeData: function (a)
        {
            return this.each(function ()
            {
                d.removeData(this, a)
            })
        }
    }), d.extend({
        queue: function (a, b, c)
        {
            if (a)
            {
                b = (b || "fx") + "queue";
                var e = d._data(a, b);
                if (!c)return e || [];
                !e || d.isArray(c) ? e = d._data(a, b, d.makeArray(c)) : e.push(c);
                return e
            }
        }, dequeue: function (a, b)
        {
            b = b || "fx";
            var c = d.queue(a, b), e = c.shift();
            e === "inprogress" && (e = c.shift()), e && (b === "fx" && c.unshift("inprogress"), e.call(a, function ()
            {
                d.dequeue(a, b)
            })), c.length || d.removeData(a, b + "queue", !0)
        }
    }), d.fn.extend({
        queue: function (a, c)
        {
            typeof a !== "string" && (c = a, a = "fx");
            if (c === b)return d.queue(this[0], a);
            return this.each(function (b)
            {
                var e = d.queue(this, a, c);
                a === "fx" && e[0] !== "inprogress" && d.dequeue(this, a)
            })
        }, dequeue: function (a)
        {
            return this.each(function ()
            {
                d.dequeue(this, a)
            })
        }, delay: function (a, b)
        {
            a = d.fx ? d.fx.speeds[a] || a : a, b = b || "fx";
            return this.queue(b, function ()
            {
                var c = this;
                setTimeout(function ()
                {
                    d.dequeue(c, b)
                }, a)
            })
        }, clearQueue: function (a)
        {
            return this.queue(a || "fx", [])
        }
    });
    var h = /[\n\t\r]/g, i = /\s+/, j = /\r/g, k = /^(?:href|src|style)$/, l = /^(?:button|input)$/i, m = /^(?:button|input|object|select|textarea)$/i, n = /^a(?:rea)?$/i, o = /^(?:radio|checkbox)$/i;
    d.props = {
        "for": "htmlFor",
        "class": "className",
        readonly: "readOnly",
        maxlength: "maxLength",
        cellspacing: "cellSpacing",
        rowspan: "rowSpan",
        colspan: "colSpan",
        tabindex: "tabIndex",
        usemap: "useMap",
        frameborder: "frameBorder"
    }, d.fn.extend({
        attr: function (a, b)
        {
            return d.access(this, a, b, !0, d.attr)
        }, removeAttr: function (a, b)
        {
            return this.each(function ()
            {
                d.attr(this, a, ""), this.nodeType === 1 && this.removeAttribute(a)
            })
        }, addClass: function (a)
        {
            if (d.isFunction(a))return this.each(function (b)
            {
                var c = d(this);
                c.addClass(a.call(this, b, c.attr("class")))
            });
            if (a && typeof a === "string")
            {
                var b = (a || "").split(i);
                for (var c = 0, e = this.length; c < e; c++)
                {
                    var f = this[c];
                    if (f.nodeType === 1)if (f.className)
                    {
                        var g = " " + f.className + " ", h = f.className;
                        for (var j = 0, k = b.length; j < k; j++)g.indexOf(" " + b[j] + " ") < 0 && (h += " " + b[j]);
                        f.className = d.trim(h)
                    } else f.className = a
                }
            }
            return this
        }, removeClass: function (a)
        {
            if (d.isFunction(a))return this.each(function (b)
            {
                var c = d(this);
                c.removeClass(a.call(this, b, c.attr("class")))
            });
            if (a && typeof a === "string" || a === b)
            {
                var c = (a || "").split(i);
                for (var e = 0, f = this.length; e < f; e++)
                {
                    var g = this[e];
                    if (g.nodeType === 1 && g.className)if (a)
                    {
                        var j = (" " + g.className + " ").replace(h, " ");
                        for (var k = 0, l = c.length; k < l; k++)j = j.replace(" " + c[k] + " ", " ");
                        g.className = d.trim(j)
                    } else g.className = ""
                }
            }
            return this
        }, toggleClass: function (a, b)
        {
            var c = typeof a, e = typeof b === "boolean";
            if (d.isFunction(a))return this.each(function (c)
            {
                var e = d(this);
                e.toggleClass(a.call(this, c, e.attr("class"), b), b)
            });
            return this.each(function ()
            {
                if (c === "string")
                {
                    var f, g = 0, h = d(this), j = b, k = a.split(i);
                    while (f = k[g++])j = e ? j : !h.hasClass(f), h[j ? "addClass" : "removeClass"](f)
                } else if (c === "undefined" || c === "boolean")this.className && d._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : d._data(this, "__className__") || ""
            })
        }, hasClass: function (a)
        {
            var b = " " + a + " ";
            for (var c = 0, d = this.length; c < d; c++)if ((" " + this[c].className + " ").replace(h, " ").indexOf(b) > -1)return !0;
            return !1
        }, val: function (a)
        {
            if (!arguments.length)
            {
                var c = this[0];
                if (c)
                {
                    if (d.nodeName(c, "option"))
                    {
                        var e = c.attributes.value;
                        return !e || e.specified ? c.value : c.text
                    }
                    if (d.nodeName(c, "select"))
                    {
                        var f = c.selectedIndex, g = [], h = c.options, i = c.type === "select-one";
                        if (f < 0)return null;
                        for (var k = i ? f : 0, l = i ? f + 1 : h.length; k < l; k++)
                        {
                            var m = h[k];
                            if (m.selected && (d.support.optDisabled ? !m.disabled : m.getAttribute("disabled") === null) && (!m.parentNode.disabled || !d.nodeName(m.parentNode, "optgroup")))
                            {
                                a = d(m).val();
                                if (i)return a;
                                g.push(a)
                            }
                        }
                        if (i && !g.length && h.length)return d(h[f]).val();
                        return g
                    }
                    if (o.test(c.type) && !d.support.checkOn)return c.getAttribute("value") === null ? "on" : c.value;
                    return (c.value || "").replace(j, "")
                }
                return b
            }
            var n = d.isFunction(a);
            return this.each(function (b)
            {
                var c = d(this), e = a;
                if (this.nodeType === 1)
                {
                    n && (e = a.call(this, b, c.val())), e == null ? e = "" : typeof e === "number" ? e += "" : d.isArray(e) && (e = d.map(e, function (a)
                    {
                        return a == null ? "" : a + ""
                    }));
                    if (d.isArray(e) && o.test(this.type))this.checked = d.inArray(c.val(), e) >= 0; else if (d.nodeName(this, "select"))
                    {
                        var f = d.makeArray(e);
                        d("option", this).each(function ()
                        {
                            this.selected = d.inArray(d(this).val(), f) >= 0
                        }), f.length || (this.selectedIndex = -1)
                    } else this.value = e
                }
            })
        }
    }), d.extend({
        attrFn: {val: !0, css: !0, html: !0, text: !0, data: !0, width: !0, height: !0, offset: !0},
        attr: function (a, c, e, f)
        {
            if (!a || a.nodeType === 3 || a.nodeType === 8 || a.nodeType === 2)return b;
            if (f && c in d.attrFn)return d(a)[c](e);
            var g = a.nodeType !== 1 || !d.isXMLDoc(a), h = e !== b;
            c = g && d.props[c] || c;
            if (a.nodeType === 1)
            {
                var i = k.test(c);
                if (c === "selected" && !d.support.optSelected)
                {
                    var j = a.parentNode;
                    j && (j.selectedIndex, j.parentNode && j.parentNode.selectedIndex)
                }
                if ((c in a || a[c] !== b) && g && !i)
                {
                    h && (c === "type" && l.test(a.nodeName) && a.parentNode && d.error("type property can't be changed"), e === null ? a.nodeType === 1 && a.removeAttribute(c) : a[c] = e);
                    if (d.nodeName(a, "form") && a.getAttributeNode(c))return a.getAttributeNode(c).nodeValue;
                    if (c === "tabIndex")
                    {
                        var o = a.getAttributeNode("tabIndex");
                        return o && o.specified ? o.value : m.test(a.nodeName) || n.test(a.nodeName) && a.href ? 0 : b
                    }
                    return a[c]
                }
                if (!d.support.style && g && c === "style")
                {
                    h && (a.style.cssText = "" + e);
                    return a.style.cssText
                }
                h && a.setAttribute(c, "" + e);
                if (!a.attributes[c] && (a.hasAttribute && !a.hasAttribute(c)))return b;
                var p = !d.support.hrefNormalized && g && i ? a.getAttribute(c, 2) : a.getAttribute(c);
                return p === null ? b : p
            }
            h && (a[c] = e);
            return a[c]
        }
    });
    var p = /\.(.*)$/, q = /^(?:textarea|input|select)$/i, r = /\./g, s = / /g, t = /[^\w\s.|`]/g, u = function (a)
    {
        return a.replace(t, "\\$&")
    };
    d.event = {
        add: function (c, e, f, g)
        {
            if (c.nodeType !== 3 && c.nodeType !== 8)
            {
                try
                {
                    d.isWindow(c) && (c !== a && !c.frameElement) && (c = a)
                } catch (h)
                {
                }
                if (f === !1)f = v; else if (!f)return;
                var i, j;
                f.handler && (i = f, f = i.handler), f.guid || (f.guid = d.guid++);
                var k = d._data(c);
                if (!k)return;
                var l = k.events, m = k.handle;
                l || (k.events = l = {}), m || (k.handle = m = function ()
                {
                    return typeof d !== "undefined" && !d.event.triggered ? d.event.handle.apply(m.elem, arguments) : b
                }), m.elem = c, e = e.split(" ");
                var n, o = 0, p;
                while (n = e[o++])
                {
                    j = i ? d.extend({}, i) : {
                        handler: f,
                        data: g
                    }, n.indexOf(".") > -1 ? (p = n.split("."), n = p.shift(), j.namespace = p.slice(0).sort().join(".")) : (p = [], j.namespace = ""), j.type = n, j.guid || (j.guid = f.guid);
                    var q = l[n], r = d.event.special[n] || {};
                    if (!q)
                    {
                        q = l[n] = [];
                        if (!r.setup || r.setup.call(c, g, p, m) === !1)c.addEventListener ? c.addEventListener(n, m, !1) : c.attachEvent && c.attachEvent("on" + n, m)
                    }
                    r.add && (r.add.call(c, j), j.handler.guid || (j.handler.guid = f.guid)), q.push(j), d.event.global[n] = !0
                }
                c = null
            }
        },
        global: {},
        remove: function (a, c, e, f)
        {
            if (a.nodeType !== 3 && a.nodeType !== 8)
            {
                e === !1 && (e = v);
                var g, h, i, j, k = 0, l, m, n, o, p, q, r, s = d.hasData(a) && d._data(a), t = s && s.events;
                if (!s || !t)return;
                c && c.type && (e = c.handler, c = c.type);
                if (!c || typeof c === "string" && c.charAt(0) === ".")
                {
                    c = c || "";
                    for (h in t)d.event.remove(a, h + c);
                    return
                }
                c = c.split(" ");
                while (h = c[k++])
                {
                    r = h, q = null, l = h.indexOf(".") < 0, m = [], l || (m = h.split("."), h = m.shift(), n = new RegExp("(^|\\.)" + d.map(m.slice(0).sort(), u).join("\\.(?:.*\\.)?") + "(\\.|$)")), p = t[h];
                    if (!p)continue;
                    if (!e)
                    {
                        for (j = 0; j < p.length; j++)
                        {
                            q = p[j];
                            if (l || n.test(q.namespace))d.event.remove(a, r, q.handler, j), p.splice(j--, 1)
                        }
                        continue
                    }
                    o = d.event.special[h] || {};
                    for (j = f || 0; j < p.length; j++)
                    {
                        q = p[j];
                        if (e.guid === q.guid)
                        {
                            if (l || n.test(q.namespace))f == null && p.splice(j--, 1), o.remove && o.remove.call(a, q);
                            if (f != null)break
                        }
                    }
                    if (p.length === 0 || f != null && p.length === 1)(!o.teardown || o.teardown.call(a, m) === !1) && d.removeEvent(a, h, s.handle), g = null, delete t[h]
                }
                if (d.isEmptyObject(t))
                {
                    var w = s.handle;
                    w && (w.elem = null), delete s.events, delete s.handle, d.isEmptyObject(s) && d.removeData(a, b, !0)
                }
            }
        },
        trigger: function (a, c, e)
        {
            var f = a.type || a, g = arguments[3];
            if (!g)
            {
                a = typeof a === "object" ? a[d.expando] ? a : d.extend(d.Event(f), a) : d.Event(f), f.indexOf("!") >= 0 && (a.type = f = f.slice(0, -1), a.exclusive = !0), e || (a.stopPropagation(), d.event.global[f] && d.each(d.cache, function ()
                {
                    var b = d.expando, e = this[b];
                    e && e.events && e.events[f] && d.event.trigger(a, c, e.handle.elem)
                }));
                if (!e || e.nodeType === 3 || e.nodeType === 8)return b;
                a.result = b, a.target = e, c = d.makeArray(c), c.unshift(a)
            }
            a.currentTarget = e;
            var h = d._data(e, "handle");
            h && h.apply(e, c);
            var i = e.parentNode || e.ownerDocument;
            try
            {
                e && e.nodeName && d.noData[e.nodeName.toLowerCase()] || e["on" + f] && e["on" + f].apply(e, c) === !1 && (a.result = !1, a.preventDefault())
            } catch (j)
            {
            }
            if (!a.isPropagationStopped() && i)d.event.trigger(a, c, i, !0); else if (!a.isDefaultPrevented())
            {
                var k, l = a.target, m = f.replace(p, ""), n = d.nodeName(l, "a") && m === "click", o = d.event.special[m] || {};
                if ((!o._default || o._default.call(e, a) === !1) && !n && !(l && l.nodeName && d.noData[l.nodeName.toLowerCase()]))
                {
                    try
                    {
                        l[m] && (k = l["on" + m], k && (l["on" + m] = null), d.event.triggered = !0, l[m]())
                    } catch (q)
                    {
                    }
                    k && (l["on" + m] = k), d.event.triggered = !1
                }
            }
        },
        handle: function (c)
        {
            var e, f, g, h, i, j = [], k = d.makeArray(arguments);
            c = k[0] = d.event.fix(c || a.event), c.currentTarget = this, e = c.type.indexOf(".") < 0 && !c.exclusive, e || (g = c.type.split("."), c.type = g.shift(), j = g.slice(0).sort(), h = new RegExp("(^|\\.)" + j.join("\\.(?:.*\\.)?") + "(\\.|$)")), c.namespace = c.namespace || j.join("."), i = d._data(this, "events"), f = (i || {})[c.type];
            if (i && f)
            {
                f = f.slice(0);
                for (var l = 0, m = f.length; l < m; l++)
                {
                    var n = f[l];
                    if (e || h.test(n.namespace))
                    {
                        c.handler = n.handler, c.data = n.data, c.handleObj = n;
                        var o = n.handler.apply(this, k);
                        o !== b && (c.result = o, o === !1 && (c.preventDefault(), c.stopPropagation()));
                        if (c.isImmediatePropagationStopped())break
                    }
                }
            }
            return c.result
        },
        props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),
        fix: function (a)
        {
            if (a[d.expando])return a;
            var e = a;
            a = d.Event(e);
            for (var f = this.props.length, g; f;)g = this.props[--f], a[g] = e[g];
            a.target || (a.target = a.srcElement || c), a.target.nodeType === 3 && (a.target = a.target.parentNode), !a.relatedTarget && a.fromElement && (a.relatedTarget = a.fromElement === a.target ? a.toElement : a.fromElement);
            if (a.pageX == null && a.clientX != null)
            {
                var h = c.documentElement, i = c.body;
                a.pageX = a.clientX + (h && h.scrollLeft || i && i.scrollLeft || 0) - (h && h.clientLeft || i && i.clientLeft || 0), a.pageY = a.clientY + (h && h.scrollTop || i && i.scrollTop || 0) - (h && h.clientTop || i && i.clientTop || 0)
            }
            a.which == null && (a.charCode != null || a.keyCode != null) && (a.which = a.charCode != null ? a.charCode : a.keyCode), !a.metaKey && a.ctrlKey && (a.metaKey = a.ctrlKey), !a.which && a.button !== b && (a.which = a.button & 1 ? 1 : a.button & 2 ? 3 : a.button & 4 ? 2 : 0);
            return a
        },
        guid: 1e8,
        proxy: d.proxy,
        special: {
            ready: {setup: d.bindReady, teardown: d.noop}, live: {
                add: function (a)
                {
                    d.event.add(this, F(a.origType, a.selector), d.extend({}, a, {handler: E, guid: a.handler.guid}))
                }, remove: function (a)
                {
                    d.event.remove(this, F(a.origType, a.selector), a)
                }
            }, beforeunload: {
                setup: function (a, b, c)
                {
                    d.isWindow(this) && (this.onbeforeunload = c)
                }, teardown: function (a, b)
                {
                    this.onbeforeunload === b && (this.onbeforeunload = null)
                }
            }
        }
    }, d.removeEvent = c.removeEventListener ? function (a, b, c)
    {
        a.removeEventListener && a.removeEventListener(b, c, !1)
    } : function (a, b, c)
    {
        a.detachEvent && a.detachEvent("on" + b, c)
    }, d.Event = function (a)
    {
        if (!this.preventDefault)return new d.Event(a);
        a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? w : v) : this.type = a, this.timeStamp = d.now(), this[d.expando] = !0
    }, d.Event.prototype = {
        preventDefault: function ()
        {
            this.isDefaultPrevented = w;
            var a = this.originalEvent;
            a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        }, stopPropagation: function ()
        {
            this.isPropagationStopped = w;
            var a = this.originalEvent;
            a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        }, stopImmediatePropagation: function ()
        {
            this.isImmediatePropagationStopped = w, this.stopPropagation()
        }, isDefaultPrevented: v, isPropagationStopped: v, isImmediatePropagationStopped: v
    };
    var x = function (a)
    {
        var b = a.relatedTarget;
        try
        {
            if (b !== c && !b.parentNode)return;
            while (b && b !== this)b = b.parentNode;
            b !== this && (a.type = a.data, d.event.handle.apply(this, arguments))
        } catch (e)
        {
        }
    }, y = function (a)
    {
        a.type = a.data, d.event.handle.apply(this, arguments)
    };
    d.each({mouseenter: "mouseover", mouseleave: "mouseout"}, function (a, b)
    {
        d.event.special[a] = {
            setup: function (c)
            {
                d.event.add(this, b, c && c.selector ? y : x, a)
            }, teardown: function (a)
            {
                d.event.remove(this, b, a && a.selector ? y : x)
            }
        }
    }), d.support.submitBubbles || (d.event.special.submit = {
        setup: function (a, b)
        {
            if (this.nodeName && this.nodeName.toLowerCase() !== "form")d.event.add(this, "click.specialSubmit", function (a)
            {
                var b = a.target, c = b.type;
                (c === "submit" || c === "image") && d(b).closest("form").length && C("submit", this, arguments)
            }), d.event.add(this, "keypress.specialSubmit", function (a)
            {
                var b = a.target, c = b.type;
                (c === "text" || c === "password") && d(b).closest("form").length && a.keyCode === 13 && C("submit", this, arguments)
            }); else return !1
        }, teardown: function (a)
        {
            d.event.remove(this, ".specialSubmit")
        }
    });
    if (!d.support.changeBubbles)
    {
        var z, A = function (a)
        {
            var b = a.type, c = a.value;
            b === "radio" || b === "checkbox" ? c = a.checked : b === "select-multiple" ? c = a.selectedIndex > -1 ? d.map(a.options, function (a)
            {
                return a.selected
            }).join("-") : "" : a.nodeName.toLowerCase() === "select" && (c = a.selectedIndex);
            return c
        }, B = function B(a)
        {
            var c = a.target, e, f;
            if (q.test(c.nodeName) && !c.readOnly)
            {
                e = d._data(c, "_change_data"), f = A(c), (a.type !== "focusout" || c.type !== "radio") && d._data(c, "_change_data", f);
                if (e === b || f === e)return;
                if (e != null || f)a.type = "change", a.liveFired = b, d.event.trigger(a, arguments[1], c)
            }
        };
        d.event.special.change = {
            filters: {
                focusout: B, beforedeactivate: B, click: function (a)
                {
                    var b = a.target, c = b.type;
                    (c === "radio" || c === "checkbox" || b.nodeName.toLowerCase() === "select") && B.call(this, a)
                }, keydown: function (a)
                {
                    var b = a.target, c = b.type;
                    (a.keyCode === 13 && b.nodeName.toLowerCase() !== "textarea" || a.keyCode === 32 && (c === "checkbox" || c === "radio") || c === "select-multiple") && B.call(this, a)
                }, beforeactivate: function (a)
                {
                    var b = a.target;
                    d._data(b, "_change_data", A(b))
                }
            }, setup: function (a, b)
            {
                if (this.type === "file")return !1;
                for (var c in z)d.event.add(this, c + ".specialChange", z[c]);
                return q.test(this.nodeName)
            }, teardown: function (a)
            {
                d.event.remove(this, ".specialChange");
                return q.test(this.nodeName)
            }
        }, z = d.event.special.change.filters, z.focus = z.beforeactivate
    }
    c.addEventListener && d.each({focus: "focusin", blur: "focusout"}, function (a, b)
    {
        function c(a)
        {
            a = d.event.fix(a), a.type = b;
            return d.event.handle.call(this, a)
        }

        d.event.special[b] = {
            setup: function ()
            {
                this.addEventListener(a, c, !0)
            }, teardown: function ()
            {
                this.removeEventListener(a, c, !0)
            }
        }
    }), d.each(["bind", "one"], function (a, c)
    {
        d.fn[c] = function (a, e, f)
        {
            if (typeof a === "object")
            {
                for (var g in a)this[c](g, e, a[g], f);
                return this
            }
            if (d.isFunction(e) || e === !1)f = e, e = b;
            var h = c === "one" ? d.proxy(f, function (a)
            {
                d(this).unbind(a, h);
                return f.apply(this, arguments)
            }) : f;
            if (a === "unload" && c !== "one")this.one(a, e, f); else for (var i = 0, j = this.length; i < j; i++)d.event.add(this[i], a, h, e);
            return this
        }
    }), d.fn.extend({
        unbind: function (a, b)
        {
            if (typeof a !== "object" || a.preventDefault)for (var e = 0, f = this.length; e < f; e++)d.event.remove(this[e], a, b); else for (var c in a)this.unbind(c, a[c]);
            return this
        }, delegate: function (a, b, c, d)
        {
            return this.live(b, c, d, a)
        }, undelegate: function (a, b, c)
        {
            return arguments.length === 0 ? this.unbind("live") : this.die(b, null, c, a)
        }, trigger: function (a, b)
        {
            return this.each(function ()
            {
                d.event.trigger(a, b, this)
            })
        }, triggerHandler: function (a, b)
        {
            if (this[0])
            {
                var c = d.Event(a);
                c.preventDefault(), c.stopPropagation(), d.event.trigger(c, b, this[0]);
                return c.result
            }
        }, toggle: function (a)
        {
            var b = arguments, c = 1;
            while (c < b.length)d.proxy(a, b[c++]);
            return this.click(d.proxy(a, function (e)
            {
                var f = (d._data(this, "lastToggle" + a.guid) || 0) % c;
                d._data(this, "lastToggle" + a.guid, f + 1), e.preventDefault();
                return b[f].apply(this, arguments) || !1
            }))
        }, hover: function (a, b)
        {
            return this.mouseenter(a).mouseleave(b || a)
        }
    });
    var D = {focus: "focusin", blur: "focusout", mouseenter: "mouseover", mouseleave: "mouseout"};
    d.each(["live", "die"], function (a, c)
    {
        d.fn[c] = function (a, e, f, g)
        {
            var h, i = 0, j, k, l, m = g || this.selector, n = g ? this : d(this.context);
            if (typeof a === "object" && !a.preventDefault)
            {
                for (var o in a)n[c](o, e, a[o], m);
                return this
            }
            d.isFunction(e) && (f = e, e = b), a = (a || "").split(" ");
            while ((h = a[i++]) != null)
            {
                j = p.exec(h), k = "", j && (k = j[0], h = h.replace(p, ""));
                if (h === "hover")
                {
                    a.push("mouseenter" + k, "mouseleave" + k);
                    continue
                }
                l = h, h === "focus" || h === "blur" ? (a.push(D[h] + k), h = h + k) : h = (D[h] || h) + k;
                if (c === "live")for (var q = 0, r = n.length; q < r; q++)d.event.add(n[q], "live." + F(h, m), {
                    data: e,
                    selector: m,
                    handler: f,
                    origType: h,
                    origHandler: f,
                    preType: l
                }); else n.unbind("live." + F(h, m), f)
            }
            return this
        }
    }), d.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error".split(" "), function (a, b)
    {
        d.fn[b] = function (a, c)
        {
            c == null && (c = a, a = null);
            return arguments.length > 0 ? this.bind(b, a, c) : this.trigger(b)
        }, d.attrFn && (d.attrFn[b] = !0)
    }), function ()
    {
        function u(a, b, c, d, e, f)
        {
            for (var g = 0, h = d.length; g < h; g++)
            {
                var i = d[g];
                if (i)
                {
                    var j = !1;
                    i = i[a];
                    while (i)
                    {
                        if (i.sizcache === c)
                        {
                            j = d[i.sizset];
                            break
                        }
                        if (i.nodeType === 1)
                        {
                            f || (i.sizcache = c, i.sizset = g);
                            if (typeof b !== "string")
                            {
                                if (i === b)
                                {
                                    j = !0;
                                    break
                                }
                            } else if (k.filter(b, [i]).length > 0)
                            {
                                j = i;
                                break
                            }
                        }
                        i = i[a]
                    }
                    d[g] = j
                }
            }
        }

        function t(a, b, c, d, e, f)
        {
            for (var g = 0, h = d.length; g < h; g++)
            {
                var i = d[g];
                if (i)
                {
                    var j = !1;
                    i = i[a];
                    while (i)
                    {
                        if (i.sizcache === c)
                        {
                            j = d[i.sizset];
                            break
                        }
                        i.nodeType === 1 && !f && (i.sizcache = c, i.sizset = g);
                        if (i.nodeName.toLowerCase() === b)
                        {
                            j = i;
                            break
                        }
                        i = i[a]
                    }
                    d[g] = j
                }
            }
        }

        var a = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, e = 0, f = Object.prototype.toString, g = !1, h = !0, i = /\\/g, j = /\W/;
        [0, 0].sort(function ()
        {
            h = !1;
            return 0
        });
        var k = function (b, d, e, g)
        {
            e = e || [], d = d || c;
            var h = d;
            if (d.nodeType !== 1 && d.nodeType !== 9)return [];
            if (!b || typeof b !== "string")return e;
            var i, j, n, o, q, r, s, t, u = !0, w = k.isXML(d), x = [], y = b;
            do {
                a.exec(""), i = a.exec(y);
                if (i)
                {
                    y = i[3], x.push(i[1]);
                    if (i[2])
                    {
                        o = i[3];
                        break
                    }
                }
            } while (i);
            if (x.length > 1 && m.exec(b))if (x.length === 2 && l.relative[x[0]])j = v(x[0] + x[1], d); else
            {
                j = l.relative[x[0]] ? [d] : k(x.shift(), d);
                while (x.length)b = x.shift(), l.relative[b] && (b += x.shift()), j = v(b, j)
            } else
            {
                !g && x.length > 1 && d.nodeType === 9 && !w && l.match.ID.test(x[0]) && !l.match.ID.test(x[x.length - 1]) && (q = k.find(x.shift(), d, w), d = q.expr ? k.filter(q.expr, q.set)[0] : q.set[0]);
                if (d)
                {
                    q = g ? {
                        expr: x.pop(),
                        set: p(g)
                    } : k.find(x.pop(), x.length === 1 && (x[0] === "~" || x[0] === "+") && d.parentNode ? d.parentNode : d, w), j = q.expr ? k.filter(q.expr, q.set) : q.set, x.length > 0 ? n = p(j) : u = !1;
                    while (x.length)r = x.pop(), s = r, l.relative[r] ? s = x.pop() : r = "", s == null && (s = d), l.relative[r](n, s, w)
                } else n = x = []
            }
            n || (n = j), n || k.error(r || b);
            if (f.call(n) === "[object Array]")if (u)if (d && d.nodeType === 1)for (t = 0; n[t] != null; t++)n[t] && (n[t] === !0 || n[t].nodeType === 1 && k.contains(d, n[t])) && e.push(j[t]); else for (t = 0; n[t] != null; t++)n[t] && n[t].nodeType === 1 && e.push(j[t]); else e.push.apply(e, n); else p(n, e);
            o && (k(o, h, e, g), k.uniqueSort(e));
            return e
        };
        k.uniqueSort = function (a)
        {
            if (r)
            {
                g = h, a.sort(r);
                if (g)for (var b = 1; b < a.length; b++)a[b] === a[b - 1] && a.splice(b--, 1)
            }
            return a
        }, k.matches = function (a, b)
        {
            return k(a, null, null, b)
        }, k.matchesSelector = function (a, b)
        {
            return k(b, null, null, [a]).length > 0
        }, k.find = function (a, b, c)
        {
            var d;
            if (!a)return [];
            for (var e = 0, f = l.order.length; e < f; e++)
            {
                var g, h = l.order[e];
                if (g = l.leftMatch[h].exec(a))
                {
                    var j = g[1];
                    g.splice(1, 1);
                    if (j.substr(j.length - 1) !== "\\")
                    {
                        g[1] = (g[1] || "").replace(i, ""), d = l.find[h](g, b, c);
                        if (d != null)
                        {
                            a = a.replace(l.match[h], "");
                            break
                        }
                    }
                }
            }
            d || (d = typeof b.getElementsByTagName !== "undefined" ? b.getElementsByTagName("*") : []);
            return {set: d, expr: a}
        }, k.filter = function (a, c, d, e)
        {
            var f, g, h = a, i = [], j = c, m = c && c[0] && k.isXML(c[0]);
            while (a && c.length)
            {
                for (var n in l.filter)if ((f = l.leftMatch[n].exec(a)) != null && f[2])
                {
                    var o, p, q = l.filter[n], r = f[1];
                    g = !1, f.splice(1, 1);
                    if (r.substr(r.length - 1) === "\\")continue;
                    j === i && (i = []);
                    if (l.preFilter[n])
                    {
                        f = l.preFilter[n](f, j, d, i, e, m);
                        if (f)
                        {
                            if (f === !0)continue
                        } else g = o = !0
                    }
                    if (f)for (var s = 0; (p = j[s]) != null; s++)if (p)
                    {
                        o = q(p, f, s, j);
                        var t = e ^ !!o;
                        d && o != null ? t ? g = !0 : j[s] = !1 : t && (i.push(p), g = !0)
                    }
                    if (o !== b)
                    {
                        d || (j = i), a = a.replace(l.match[n], "");
                        if (!g)return [];
                        break
                    }
                }
                if (a === h)if (g == null)k.error(a); else break;
                h = a
            }
            return j
        }, k.error = function (a)
        {
            throw"Syntax error, unrecognized expression: " + a
        };
        var l = k.selectors = {
            order: ["ID", "NAME", "TAG"],
            match: {
                ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
            },
            leftMatch: {},
            attrMap: {"class": "className", "for": "htmlFor"},
            attrHandle: {
                href: function (a)
                {
                    return a.getAttribute("href")
                }, type: function (a)
                {
                    return a.getAttribute("type")
                }
            },
            relative: {
                "+": function (a, b)
                {
                    var c = typeof b === "string", d = c && !j.test(b), e = c && !d;
                    d && (b = b.toLowerCase());
                    for (var f = 0, g = a.length, h; f < g; f++)if (h = a[f])
                    {
                        while ((h = h.previousSibling) && h.nodeType !== 1)
                        {
                        }
                        a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
                    }
                    e && k.filter(b, a, !0)
                }, ">": function (a, b)
                {
                    var c, d = typeof b === "string", e = 0, f = a.length;
                    if (d && !j.test(b))
                    {
                        b = b.toLowerCase();
                        for (; e < f; e++)
                        {
                            c = a[e];
                            if (c)
                            {
                                var g = c.parentNode;
                                a[e] = g.nodeName.toLowerCase() === b ? g : !1
                            }
                        }
                    } else
                    {
                        for (; e < f; e++)c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b);
                        d && k.filter(b, a, !0)
                    }
                }, "": function (a, b, c)
                {
                    var d, f = e++, g = u;
                    typeof b === "string" && !j.test(b) && (b = b.toLowerCase(), d = b, g = t), g("parentNode", b, f, a, d, c)
                }, "~": function (a, b, c)
                {
                    var d, f = e++, g = u;
                    typeof b === "string" && !j.test(b) && (b = b.toLowerCase(), d = b, g = t), g("previousSibling", b, f, a, d, c)
                }
            },
            find: {
                ID: function (a, b, c)
                {
                    if (typeof b.getElementById !== "undefined" && !c)
                    {
                        var d = b.getElementById(a[1]);
                        return d && d.parentNode ? [d] : []
                    }
                }, NAME: function (a, b)
                {
                    if (typeof b.getElementsByName !== "undefined")
                    {
                        var c = [], d = b.getElementsByName(a[1]);
                        for (var e = 0, f = d.length; e < f; e++)d[e].getAttribute("name") === a[1] && c.push(d[e]);
                        return c.length === 0 ? null : c
                    }
                }, TAG: function (a, b)
                {
                    if (typeof b.getElementsByTagName !== "undefined")return b.getElementsByTagName(a[1])
                }
            },
            preFilter: {
                CLASS: function (a, b, c, d, e, f)
                {
                    a = " " + a[1].replace(i, "") + " ";
                    if (f)return a;
                    for (var g = 0, h; (h = b[g]) != null; g++)h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                    return !1
                }, ID: function (a)
                {
                    return a[1].replace(i, "")
                }, TAG: function (a, b)
                {
                    return a[1].replace(i, "").toLowerCase()
                }, CHILD: function (a)
                {
                    if (a[1] === "nth")
                    {
                        a[2] || k.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
                        var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                        a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
                    } else a[2] && k.error(a[0]);
                    a[0] = e++;
                    return a
                }, ATTR: function (a, b, c, d, e, f)
                {
                    var g = a[1] = a[1].replace(i, "");
                    !f && l.attrMap[g] && (a[1] = l.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(i, ""), a[2] === "~=" && (a[4] = " " + a[4] + " ");
                    return a
                }, PSEUDO: function (b, c, d, e, f)
                {
                    if (b[1] === "not")if ((a.exec(b[3]) || "").length > 1 || /^\w/.test(b[3]))b[3] = k(b[3], null, null, c); else
                    {
                        var g = k.filter(b[3], c, d, !0 ^ f);
                        d || e.push.apply(e, g);
                        return !1
                    } else if (l.match.POS.test(b[0]) || l.match.CHILD.test(b[0]))return !0;
                    return b
                }, POS: function (a)
                {
                    a.unshift(!0);
                    return a
                }
            },
            filters: {
                enabled: function (a)
                {
                    return a.disabled === !1 && a.type !== "hidden"
                }, disabled: function (a)
                {
                    return a.disabled === !0
                }, checked: function (a)
                {
                    return a.checked === !0
                }, selected: function (a)
                {
                    a.parentNode && a.parentNode.selectedIndex;
                    return a.selected === !0
                }, parent: function (a)
                {
                    return !!a.firstChild
                }, empty: function (a)
                {
                    return !a.firstChild
                }, has: function (a, b, c)
                {
                    return !!k(c[3], a).length
                }, header: function (a)
                {
                    return /h\d/i.test(a.nodeName)
                }, text: function (a)
                {
                    return "text" === a.getAttribute("type")
                }, radio: function (a)
                {
                    return "radio" === a.type
                }, checkbox: function (a)
                {
                    return "checkbox" === a.type
                }, file: function (a)
                {
                    return "file" === a.type
                }, password: function (a)
                {
                    return "password" === a.type
                }, submit: function (a)
                {
                    return "submit" === a.type
                }, image: function (a)
                {
                    return "image" === a.type
                }, reset: function (a)
                {
                    return "reset" === a.type
                }, button: function (a)
                {
                    return "button" === a.type || a.nodeName.toLowerCase() === "button"
                }, input: function (a)
                {
                    return /input|select|textarea|button/i.test(a.nodeName)
                }
            },
            setFilters: {
                first: function (a, b)
                {
                    return b === 0
                }, last: function (a, b, c, d)
                {
                    return b === d.length - 1
                }, even: function (a, b)
                {
                    return b % 2 === 0
                }, odd: function (a, b)
                {
                    return b % 2 === 1
                }, lt: function (a, b, c)
                {
                    return b < c[3] - 0
                }, gt: function (a, b, c)
                {
                    return b > c[3] - 0
                }, nth: function (a, b, c)
                {
                    return c[3] - 0 === b
                }, eq: function (a, b, c)
                {
                    return c[3] - 0 === b
                }
            },
            filter: {
                PSEUDO: function (a, b, c, d)
                {
                    var e = b[1], f = l.filters[e];
                    if (f)return f(a, c, b, d);
                    if (e === "contains")return (a.textContent || a.innerText || k.getText([a]) || "").indexOf(b[3]) >= 0;
                    if (e === "not")
                    {
                        var g = b[3];
                        for (var h = 0, i = g.length; h < i; h++)if (g[h] === a)return !1;
                        return !0
                    }
                    k.error(e)
                }, CHILD: function (a, b)
                {
                    var c = b[1], d = a;
                    switch (c)
                    {
                        case"only":
                        case"first":
                            while (d = d.previousSibling)if (d.nodeType === 1)return !1;
                            if (c === "first")return !0;
                            d = a;
                        case"last":
                            while (d = d.nextSibling)if (d.nodeType === 1)return !1;
                            return !0;
                        case"nth":
                            var e = b[2], f = b[3];
                            if (e === 1 && f === 0)return !0;
                            var g = b[0], h = a.parentNode;
                            if (h && (h.sizcache !== g || !a.nodeIndex))
                            {
                                var i = 0;
                                for (d = h.firstChild; d; d = d.nextSibling)d.nodeType === 1 && (d.nodeIndex = ++i);
                                h.sizcache = g
                            }
                            var j = a.nodeIndex - f;
                            return e === 0 ? j === 0 : j % e === 0 && j / e >= 0
                    }
                }, ID: function (a, b)
                {
                    return a.nodeType === 1 && a.getAttribute("id") === b
                }, TAG: function (a, b)
                {
                    return b === "*" && a.nodeType === 1 || a.nodeName.toLowerCase() === b
                }, CLASS: function (a, b)
                {
                    return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                }, ATTR: function (a, b)
                {
                    var c = b[1], d = l.attrHandle[c] ? l.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c), e = d + "", f = b[2], g = b[4];
                    return d == null ? f === "!=" : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1
                }, POS: function (a, b, c, d)
                {
                    var e = b[2], f = l.setFilters[e];
                    if (f)return f(a, c, b, d)
                }
            }
        }, m = l.match.POS, n = function (a, b)
        {
            return "\\" + (b - 0 + 1)
        };
        for (var o in l.match)l.match[o] = new RegExp(l.match[o].source + /(?![^\[]*\])(?![^\(]*\))/.source), l.leftMatch[o] = new RegExp(/(^(?:.|\r|\n)*?)/.source + l.match[o].source.replace(/\\(\d+)/g, n));
        var p = function (a, b)
        {
            a = Array.prototype.slice.call(a, 0);
            if (b)
            {
                b.push.apply(b, a);
                return b
            }
            return a
        };
        try
        {
            Array.prototype.slice.call(c.documentElement.childNodes, 0)[0].nodeType
        } catch (q)
        {
            p = function (a, b)
            {
                var c = 0, d = b || [];
                if (f.call(a) === "[object Array]")Array.prototype.push.apply(d, a); else if (typeof a.length === "number")for (var e = a.length; c < e; c++)d.push(a[c]); else for (; a[c]; c++)d.push(a[c]);
                return d
            }
        }
        var r, s;
        c.documentElement.compareDocumentPosition ? r = function (a, b)
        {
            if (a === b)
            {
                g = !0;
                return 0
            }
            if (!a.compareDocumentPosition || !b.compareDocumentPosition)return a.compareDocumentPosition ? -1 : 1;
            return a.compareDocumentPosition(b) & 4 ? -1 : 1
        } : (r = function (a, b)
        {
            var c, d, e = [], f = [], h = a.parentNode, i = b.parentNode, j = h;
            if (a === b)
            {
                g = !0;
                return 0
            }
            if (h === i)return s(a, b);
            if (!h)return -1;
            if (!i)return 1;
            while (j)e.unshift(j), j = j.parentNode;
            j = i;
            while (j)f.unshift(j), j = j.parentNode;
            c = e.length, d = f.length;
            for (var k = 0; k < c && k < d; k++)if (e[k] !== f[k])return s(e[k], f[k]);
            return k === c ? s(a, f[k], -1) : s(e[k], b, 1)
        }, s = function (a, b, c)
        {
            if (a === b)return c;
            var d = a.nextSibling;
            while (d)
            {
                if (d === b)return -1;
                d = d.nextSibling
            }
            return 1
        }), k.getText = function (a)
        {
            var b = "", c;
            for (var d = 0; a[d]; d++)c = a[d], c.nodeType === 3 || c.nodeType === 4 ? b += c.nodeValue : c.nodeType !== 8 && (b += k.getText(c.childNodes));
            return b
        }, function ()
        {
            var a = c.createElement("div"), d = "script" + (new Date).getTime(), e = c.documentElement;
            a.innerHTML = "<a name='" + d + "'/>", e.insertBefore(a, e.firstChild), c.getElementById(d) && (l.find.ID = function (a, c, d)
            {
                if (typeof c.getElementById !== "undefined" && !d)
                {
                    var e = c.getElementById(a[1]);
                    return e ? e.id === a[1] || typeof e.getAttributeNode !== "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : []
                }
            }, l.filter.ID = function (a, b)
            {
                var c = typeof a.getAttributeNode !== "undefined" && a.getAttributeNode("id");
                return a.nodeType === 1 && c && c.nodeValue === b
            }), e.removeChild(a), e = a = null
        }(), function ()
        {
            var a = c.createElement("div");
            a.appendChild(c.createComment("")), a.getElementsByTagName("*").length > 0 && (l.find.TAG = function (a, b)
            {
                var c = b.getElementsByTagName(a[1]);
                if (a[1] === "*")
                {
                    var d = [];
                    for (var e = 0; c[e]; e++)c[e].nodeType === 1 && d.push(c[e]);
                    c = d
                }
                return c
            }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute !== "undefined" && a.firstChild.getAttribute("href") !== "#" && (l.attrHandle.href = function (a)
            {
                return a.getAttribute("href", 2)
            }), a = null
        }(), c.querySelectorAll && function ()
        {
            var a = k, b = c.createElement("div"), d = "__sizzle__";
            b.innerHTML = "<p class='TEST'></p>";
            if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0)
            {
                k = function (b, e, f, g)
                {
                    e = e || c;
                    if (!g && !k.isXML(e))
                    {
                        var h = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                        if (h && (e.nodeType === 1 || e.nodeType === 9))
                        {
                            if (h[1])return p(e.getElementsByTagName(b), f);
                            if (h[2] && l.find.CLASS && e.getElementsByClassName)return p(e.getElementsByClassName(h[2]), f)
                        }
                        if (e.nodeType === 9)
                        {
                            if (b === "body" && e.body)return p([e.body], f);
                            if (h && h[3])
                            {
                                var i = e.getElementById(h[3]);
                                if (!i || !i.parentNode)return p([], f);
                                if (i.id === h[3])return p([i], f)
                            }
                            try
                            {
                                return p(e.querySelectorAll(b), f)
                            } catch (j)
                            {
                            }
                        } else if (e.nodeType === 1 && e.nodeName.toLowerCase() !== "object")
                        {
                            var m = e, n = e.getAttribute("id"), o = n || d, q = e.parentNode, r = /^\s*[+~]/.test(b);
                            n ? o = o.replace(/'/g, "\\$&") : e.setAttribute("id", o), r && q && (e = e.parentNode);
                            try
                            {
                                if (!r || q)return p(e.querySelectorAll("[id='" + o + "'] " + b), f)
                            } catch (s)
                            {
                            } finally
                            {
                                n || m.removeAttribute("id")
                            }
                        }
                    }
                    return a(b, e, f, g)
                };
                for (var e in a)k[e] = a[e];
                b = null
            }
        }(), function ()
        {
            var a = c.documentElement, b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector, d = !1;
            try
            {
                b.call(c.documentElement, "[test!='']:sizzle")
            } catch (e)
            {
                d = !0
            }
            b && (k.matchesSelector = function (a, c)
            {
                c = c.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                if (!k.isXML(a))try
                {
                    if (d || !l.match.PSEUDO.test(c) && !/!=/.test(c))return b.call(a, c)
                } catch (e)
                {
                }
                return k(c, null, null, [a]).length > 0
            })
        }(), function ()
        {
            var a = c.createElement("div");
            a.innerHTML = "<div class='test e'></div><div class='test'></div>";
            if (a.getElementsByClassName && a.getElementsByClassName("e").length !== 0)
            {
                a.lastChild.className = "e";
                if (a.getElementsByClassName("e").length === 1)return;
                l.order.splice(1, 0, "CLASS"), l.find.CLASS = function (a, b, c)
                {
                    if (typeof b.getElementsByClassName !== "undefined" && !c)return b.getElementsByClassName(a[1])
                }, a = null
            }
        }(), c.documentElement.contains ? k.contains = function (a, b)
        {
            return a !== b && (a.contains ? a.contains(b) : !0)
        } : c.documentElement.compareDocumentPosition ? k.contains = function (a, b)
        {
            return !!(a.compareDocumentPosition(b) & 16)
        } : k.contains = function ()
        {
            return !1
        }, k.isXML = function (a)
        {
            var b = (a ? a.ownerDocument || a : 0).documentElement;
            return b ? b.nodeName !== "HTML" : !1
        };
        var v = function (a, b)
        {
            var c, d = [], e = "", f = b.nodeType ? [b] : b;
            while (c = l.match.PSEUDO.exec(a))e += c[0], a = a.replace(l.match.PSEUDO, "");
            a = l.relative[a] ? a + "*" : a;
            for (var g = 0, h = f.length; g < h; g++)k(a, f[g], d);
            return k.filter(e, d)
        };
        d.find = k, d.expr = k.selectors, d.expr[":"] = d.expr.filters, d.unique = k.uniqueSort, d.text = k.getText, d.isXMLDoc = k.isXML, d.contains = k.contains
    }();
    var G = /Until$/, H = /^(?:parents|prevUntil|prevAll)/, I = /,/, J = /^.[^:#\[\.,]*$/, K = Array.prototype.slice, L = d.expr.match.POS, M = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    d.fn.extend({
        find: function (a)
        {
            var b = this.pushStack("", "find", a), c = 0;
            for (var e = 0, f = this.length; e < f; e++)
            {
                c = b.length, d.find(a, this[e], b);
                if (e > 0)for (var g = c; g < b.length; g++)for (var h = 0; h < c; h++)if (b[h] === b[g])
                {
                    b.splice(g--, 1);
                    break
                }
            }
            return b
        }, has: function (a)
        {
            var b = d(a);
            return this.filter(function ()
            {
                for (var a = 0, c = b.length; a < c; a++)if (d.contains(this, b[a]))return !0
            })
        }, not: function (a)
        {
            return this.pushStack(O(this, a, !1), "not", a)
        }, filter: function (a)
        {
            return this.pushStack(O(this, a, !0), "filter", a)
        }, is: function (a)
        {
            return !!a && d.filter(a, this).length > 0
        }, closest: function (a, b)
        {
            var c = [], e, f, g = this[0];
            if (d.isArray(a))
            {
                var h, i, j = {}, k = 1;
                if (g && a.length)
                {
                    for (e = 0, f = a.length; e < f; e++)i = a[e], j[i] || (j[i] = d.expr.match.POS.test(i) ? d(i, b || this.context) : i);
                    while (g && g.ownerDocument && g !== b)
                    {
                        for (i in j)h = j[i], (h.jquery ? h.index(g) > -1 : d(g).is(h)) && c.push({
                            selector: i,
                            elem: g,
                            level: k
                        });
                        g = g.parentNode, k++
                    }
                }
                return c
            }
            var l = L.test(a) ? d(a, b || this.context) : null;
            for (e = 0, f = this.length; e < f; e++)
            {
                g = this[e];
                while (g)
                {
                    if (l ? l.index(g) > -1 : d.find.matchesSelector(g, a))
                    {
                        c.push(g);
                        break
                    }
                    g = g.parentNode;
                    if (!g || !g.ownerDocument || g === b)break
                }
            }
            c = c.length > 1 ? d.unique(c) : c;
            return this.pushStack(c, "closest", a)
        }, index: function (a)
        {
            if (!a || typeof a === "string")return d.inArray(this[0], a ? d(a) : this.parent().children());
            return d.inArray(a.jquery ? a[0] : a, this)
        }, add: function (a, b)
        {
            var c = typeof a === "string" ? d(a, b) : d.makeArray(a), e = d.merge(this.get(), c);
            return this.pushStack(N(c[0]) || N(e[0]) ? e : d.unique(e))
        }, andSelf: function ()
        {
            return this.add(this.prevObject)
        }
    }), d.each({
        parent: function (a)
        {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null
        }, parents: function (a)
        {
            return d.dir(a, "parentNode")
        }, parentsUntil: function (a, b, c)
        {
            return d.dir(a, "parentNode", c)
        }, next: function (a)
        {
            return d.nth(a, 2, "nextSibling")
        }, prev: function (a)
        {
            return d.nth(a, 2, "previousSibling")
        }, nextAll: function (a)
        {
            return d.dir(a, "nextSibling")
        }, prevAll: function (a)
        {
            return d.dir(a, "previousSibling")
        }, nextUntil: function (a, b, c)
        {
            return d.dir(a, "nextSibling", c)
        }, prevUntil: function (a, b, c)
        {
            return d.dir(a, "previousSibling", c)
        }, siblings: function (a)
        {
            return d.sibling(a.parentNode.firstChild, a)
        }, children: function (a)
        {
            return d.sibling(a.firstChild)
        }, contents: function (a)
        {
            return d.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : d.makeArray(a.childNodes)
        }
    }, function (a, b)
    {
        d.fn[a] = function (c, e)
        {
            var f = d.map(this, b, c), g = K.call(arguments);
            G.test(a) || (e = c), e && typeof e === "string" && (f = d.filter(e, f)), f = this.length > 1 && !M[a] ? d.unique(f) : f, (this.length > 1 || I.test(e)) && H.test(a) && (f = f.reverse());
            return this.pushStack(f, a, g.join(","))
        }
    }), d.extend({
        filter: function (a, b, c)
        {
            c && (a = ":not(" + a + ")");
            return b.length === 1 ? d.find.matchesSelector(b[0], a) ? [b[0]] : [] : d.find.matches(a, b)
        }, dir: function (a, c, e)
        {
            var f = [], g = a[c];
            while (g && g.nodeType !== 9 && (e === b || g.nodeType !== 1 || !d(g).is(e)))g.nodeType === 1 && f.push(g), g = g[c];
            return f
        }, nth: function (a, b, c, d)
        {
            b = b || 1;
            var e = 0;
            for (; a; a = a[c])if (a.nodeType === 1 && ++e === b)break;
            return a
        }, sibling: function (a, b)
        {
            var c = [];
            for (; a; a = a.nextSibling)a.nodeType === 1 && a !== b && c.push(a);
            return c
        }
    });
    var P = / jQuery\d+="(?:\d+|null)"/g, Q = /^\s+/, R = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, S = /<([\w:]+)/, T = /<tbody/i, U = /<|&#?\w+;/, V = /<(?:script|object|embed|option|style)/i, W = /checked\s*(?:[^=]|=\s*.checked.)/i, X = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        area: [1, "<map>", "</map>"],
        _default: [0, "", ""]
    };
    X.optgroup = X.option, X.tbody = X.tfoot = X.colgroup = X.caption = X.thead, X.th = X.td, d.support.htmlSerialize || (X._default = [1, "div<div>", "</div>"]), d.fn.extend({
        text: function (a)
        {
            if (d.isFunction(a))return this.each(function (b)
            {
                var c = d(this);
                c.text(a.call(this, b, c.text()))
            });
            if (typeof a !== "object" && a !== b)return this.empty().append((this[0] && this[0].ownerDocument || c).createTextNode(a));
            return d.text(this)
        }, wrapAll: function (a)
        {
            if (d.isFunction(a))return this.each(function (b)
            {
                d(this).wrapAll(a.call(this, b))
            });
            if (this[0])
            {
                var b = d(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function ()
                {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1)a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        }, wrapInner: function (a)
        {
            if (d.isFunction(a))return this.each(function (b)
            {
                d(this).wrapInner(a.call(this, b))
            });
            return this.each(function ()
            {
                var b = d(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        }, wrap: function (a)
        {
            return this.each(function ()
            {
                d(this).wrapAll(a)
            })
        }, unwrap: function ()
        {
            return this.parent().each(function ()
            {
                d.nodeName(this, "body") || d(this).replaceWith(this.childNodes)
            }).end()
        }, append: function ()
        {
            return this.domManip(arguments, !0, function (a)
            {
                this.nodeType === 1 && this.appendChild(a)
            })
        }, prepend: function ()
        {
            return this.domManip(arguments, !0, function (a)
            {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild)
            })
        }, before: function ()
        {
            if (this[0] && this[0].parentNode)return this.domManip(arguments, !1, function (a)
            {
                this.parentNode.insertBefore(a, this)
            });
            if (arguments.length)
            {
                var a = d(arguments[0]);
                a.push.apply(a, this.toArray());
                return this.pushStack(a, "before", arguments)
            }
        }, after: function ()
        {
            if (this[0] && this[0].parentNode)return this.domManip(arguments, !1, function (a)
            {
                this.parentNode.insertBefore(a, this.nextSibling)
            });
            if (arguments.length)
            {
                var a = this.pushStack(this, "after", arguments);
                a.push.apply(a, d(arguments[0]).toArray());
                return a
            }
        }, remove: function (a, b)
        {
            for (var c = 0, e; (e = this[c]) != null; c++)if (!a || d.filter(a, [e]).length)!b && e.nodeType === 1 && (d.cleanData(e.getElementsByTagName("*")), d.cleanData([e])), e.parentNode && e.parentNode.removeChild(e);
            return this
        }, empty: function ()
        {
            for (var a = 0, b; (b = this[a]) != null; a++)
            {
                b.nodeType === 1 && d.cleanData(b.getElementsByTagName("*"));
                while (b.firstChild)b.removeChild(b.firstChild)
            }
            return this
        }, clone: function (a, b)
        {
            a = a == null ? !1 : a, b = b == null ? a : b;
            return this.map(function ()
            {
                return d.clone(this, a, b)
            })
        }, html: function (a)
        {
            if (a === b)return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(P, "") : null;
            if (typeof a !== "string" || V.test(a) || !d.support.leadingWhitespace && Q.test(a) || X[(S.exec(a) || ["", ""])[1].toLowerCase()])d.isFunction(a) ? this.each(function (b)
            {
                var c = d(this);
                c.html(a.call(this, b, c.html()))
            }) : this.empty().append(a); else
            {
                a = a.replace(R, "<$1></$2>");
                try
                {
                    for (var c = 0, e = this.length; c < e; c++)this[c].nodeType === 1 && (d.cleanData(this[c].getElementsByTagName("*")), this[c].innerHTML = a)
                } catch (f)
                {
                    this.empty().append(a)
                }
            }
            return this
        }, replaceWith: function (a)
        {
            if (this[0] && this[0].parentNode)
            {
                if (d.isFunction(a))return this.each(function (b)
                {
                    var c = d(this), e = c.html();
                    c.replaceWith(a.call(this, b, e))
                });
                typeof a !== "string" && (a = d(a).detach());
                return this.each(function ()
                {
                    var b = this.nextSibling, c = this.parentNode;
                    d(this).remove(), b ? d(b).before(a) : d(c).append(a)
                })
            }
            return this.pushStack(d(d.isFunction(a) ? a() : a), "replaceWith", a)
        }, detach: function (a)
        {
            return this.remove(a, !0)
        }, domManip: function (a, c, e)
        {
            var f, g, h, i, j = a[0], k = [];
            if (!d.support.checkClone && arguments.length === 3 && typeof j === "string" && W.test(j))return this.each(function ()
            {
                d(this).domManip(a, c, e, !0)
            });
            if (d.isFunction(j))return this.each(function (f)
            {
                var g = d(this);
                a[0] = j.call(this, f, c ? g.html() : b), g.domManip(a, c, e)
            });
            if (this[0])
            {
                i = j && j.parentNode, d.support.parentNode && i && i.nodeType === 11 && i.childNodes.length === this.length ? f = {fragment: i} : f = d.buildFragment(a, this, k), h = f.fragment, h.childNodes.length === 1 ? g = h = h.firstChild : g = h.firstChild;
                if (g)
                {
                    c = c && d.nodeName(g, "tr");
                    for (var l = 0, m = this.length, n = m - 1; l < m; l++)e.call(c ? Y(this[l], g) : this[l], f.cacheable || m > 1 && l < n ? d.clone(h, !0, !0) : h)
                }
                k.length && d.each(k, ba)
            }
            return this
        }
    }), d.buildFragment = function (a, b, e)
    {
        var f, g, h, i = b && b[0] ? b[0].ownerDocument || b[0] : c;
        a.length === 1 && typeof a[0] === "string" && a[0].length < 512 && i === c && a[0].charAt(0) === "<" && !V.test(a[0]) && (d.support.checkClone || !W.test(a[0])) && (g = !0, h = d.fragments[a[0]], h && (h !== 1 && (f = h))), f || (f = i.createDocumentFragment(), d.clean(a, i, f, e)), g && (d.fragments[a[0]] = h ? f : 1);
        return {fragment: f, cacheable: g}
    }, d.fragments = {}, d.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (a, b)
    {
        d.fn[a] = function (c)
        {
            var e = [], f = d(c), g = this.length === 1 && this[0].parentNode;
            if (g && g.nodeType === 11 && g.childNodes.length === 1 && f.length === 1)
            {
                f[b](this[0]);
                return this
            }
            for (var h = 0, i = f.length; h < i; h++)
            {
                var j = (h > 0 ? this.clone(!0) : this).get();
                d(f[h])[b](j), e = e.concat(j)
            }
            return this.pushStack(e, a, f.selector)
        }
    }), d.extend({
        clone: function (a, b, c)
        {
            var e = a.cloneNode(!0), f, g, h;
            if ((!d.support.noCloneEvent || !d.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !d.isXMLDoc(a))
            {
                $(a, e), f = _(a), g = _(e);
                for (h = 0; f[h]; ++h)$(f[h], g[h])
            }
            if (b)
            {
                Z(a, e);
                if (c)
                {
                    f = _(a), g = _(e);
                    for (h = 0; f[h]; ++h)Z(f[h], g[h])
                }
            }
            return e
        }, clean: function (a, b, e, f)
        {
            b = b || c, typeof b.createElement === "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || c);
            var g = [];
            for (var h = 0, i; (i = a[h]) != null; h++)
            {
                typeof i === "number" && (i += "");
                if (!i)continue;
                if (typeof i !== "string" || U.test(i))
                {
                    if (typeof i === "string")
                    {
                        i = i.replace(R, "<$1></$2>");
                        var j = (S.exec(i) || ["", ""])[1].toLowerCase(), k = X[j] || X._default, l = k[0], m = b.createElement("div");
                        m.innerHTML = k[1] + i + k[2];
                        while (l--)m = m.lastChild;
                        if (!d.support.tbody)
                        {
                            var n = T.test(i), o = j === "table" && !n ? m.firstChild && m.firstChild.childNodes : k[1] === "<table>" && !n ? m.childNodes : [];
                            for (var p = o.length - 1; p >= 0; --p)d.nodeName(o[p], "tbody") && !o[p].childNodes.length && o[p].parentNode.removeChild(o[p])
                        }
                        !d.support.leadingWhitespace && Q.test(i) && m.insertBefore(b.createTextNode(Q.exec(i)[0]), m.firstChild), i = m.childNodes
                    }
                } else i = b.createTextNode(i);
                i.nodeType ? g.push(i) : g = d.merge(g, i)
            }
            if (e)for (h = 0; g[h]; h++)!f || !d.nodeName(g[h], "script") || g[h].type && g[h].type.toLowerCase() !== "text/javascript" ? (g[h].nodeType === 1 && g.splice.apply(g, [h + 1, 0].concat(d.makeArray(g[h].getElementsByTagName("script")))), e.appendChild(g[h])) : f.push(g[h].parentNode ? g[h].parentNode.removeChild(g[h]) : g[h]);
            return g
        }, cleanData: function (a)
        {
            var b, c, e = d.cache, f = d.expando, g = d.event.special, h = d.support.deleteExpando;
            for (var i = 0, j; (j = a[i]) != null; i++)
            {
                if (j.nodeName && d.noData[j.nodeName.toLowerCase()])continue;
                c = j[d.expando];
                if (c)
                {
                    b = e[c] && e[c][f];
                    if (b && b.events)
                    {
                        for (var k in b.events)g[k] ? d.event.remove(j, k) : d.removeEvent(j, k, b.handle);
                        b.handle && (b.handle.elem = null)
                    }
                    h ? delete j[d.expando] : j.removeAttribute && j.removeAttribute(d.expando), delete e[c]
                }
            }
        }
    });
    var bb = /alpha\([^)]*\)/i, bc = /opacity=([^)]*)/, bd = /-([a-z])/ig, be = /([A-Z])/g, bf = /^-?\d+(?:px)?$/i, bg = /^-?\d/, bh = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, bi = ["Left", "Right"], bj = ["Top", "Bottom"], bk, bl, bm, bn = function (a, b)
    {
        return b.toUpperCase()
    };
    d.fn.css = function (a, c)
    {
        if (arguments.length === 2 && c === b)return this;
        return d.access(this, a, c, !0, function (a, c, e)
        {
            return e !== b ? d.style(a, c, e) : d.css(a, c)
        })
    }, d.extend({
        cssHooks: {
            opacity: {
                get: function (a, b)
                {
                    if (b)
                    {
                        var c = bk(a, "opacity", "opacity");
                        return c === "" ? "1" : c
                    }
                    return a.style.opacity
                }
            }
        },
        cssNumber: {zIndex: !0, fontWeight: !0, opacity: !0, zoom: !0, lineHeight: !0},
        cssProps: {"float": d.support.cssFloat ? "cssFloat" : "styleFloat"},
        style: function (a, c, e, f)
        {
            if (a && a.nodeType !== 3 && a.nodeType !== 8 && a.style)
            {
                var g, h = d.camelCase(c), i = a.style, j = d.cssHooks[h];
                c = d.cssProps[h] || h;
                if (e === b)
                {
                    if (j && "get" in j && (g = j.get(a, !1, f)) !== b)return g;
                    return i[c]
                }
                if (typeof e === "number" && isNaN(e) || e == null)return;
                typeof e === "number" && !d.cssNumber[h] && (e += "px");
                if (!j || !("set" in j) || (e = j.set(a, e)) !== b)try
                {
                    i[c] = e
                } catch (k)
                {
                }
            }
        },
        css: function (a, c, e)
        {
            var f, g = d.camelCase(c), h = d.cssHooks[g];
            c = d.cssProps[g] || g;
            if (h && "get" in h && (f = h.get(a, !0, e)) !== b)return f;
            if (bk)return bk(a, c, g)
        },
        swap: function (a, b, c)
        {
            var d = {};
            for (var e in b)d[e] = a.style[e], a.style[e] = b[e];
            c.call(a);
            for (e in b)a.style[e] = d[e]
        },
        camelCase: function (a)
        {
            return a.replace(bd, bn)
        }
    }), d.curCSS = d.css, d.each(["height", "width"], function (a, b)
    {
        d.cssHooks[b] = {
            get: function (a, c, e)
            {
                var f;
                if (c)
                {
                    a.offsetWidth !== 0 ? f = bo(a, b, e) : d.swap(a, bh, function ()
                    {
                        f = bo(a, b, e)
                    });
                    if (f <= 0)
                    {
                        f = bk(a, b, b), f === "0px" && bm && (f = bm(a, b, b));
                        if (f != null)return f === "" || f === "auto" ? "0px" : f
                    }
                    if (f < 0 || f == null)
                    {
                        f = a.style[b];
                        return f === "" || f === "auto" ? "0px" : f
                    }
                    return typeof f === "string" ? f : f + "px"
                }
            }, set: function (a, b)
            {
                if (!bf.test(b))return b;
                b = parseFloat(b);
                if (b >= 0)return b + "px"
            }
        }
    }), d.support.opacity || (d.cssHooks.opacity = {
        get: function (a, b)
        {
            return bc.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
        }, set: function (a, b)
        {
            var c = a.style;
            c.zoom = 1;
            var e = d.isNaN(b) ? "" : "alpha(opacity=" + b * 100 + ")", f = c.filter || "";
            c.filter = bb.test(f) ? f.replace(bb, e) : c.filter + " " + e
        }
    }), c.defaultView && c.defaultView.getComputedStyle && (bl = function (a, c, e)
    {
        var f, g, h;
        e = e.replace(be, "-$1").toLowerCase();
        if (!(g = a.ownerDocument.defaultView))return b;
        if (h = g.getComputedStyle(a, null))f = h.getPropertyValue(e), f === "" && !d.contains(a.ownerDocument.documentElement, a) && (f = d.style(a, e));
        return f
    }), c.documentElement.currentStyle && (bm = function (a, b)
    {
        var c, d = a.currentStyle && a.currentStyle[b], e = a.runtimeStyle && a.runtimeStyle[b], f = a.style;
        !bf.test(d) && bg.test(d) && (c = f.left, e && (a.runtimeStyle.left = a.currentStyle.left), f.left = b === "fontSize" ? "1em" : d || 0, d = f.pixelLeft + "px", f.left = c, e && (a.runtimeStyle.left = e));
        return d === "" ? "auto" : d
    }), bk = bl || bm, d.expr && d.expr.filters && (d.expr.filters.hidden = function (a)
    {
        var b = a.offsetWidth, c = a.offsetHeight;
        return b === 0 && c === 0 || !d.support.reliableHiddenOffsets && (a.style.display || d.css(a, "display")) === "none"
    }, d.expr.filters.visible = function (a)
    {
        return !d.expr.filters.hidden(a)
    });
    var bp = /%20/g, bq = /\[\]$/, br = /\r?\n/g, bs = /#.*$/, bt = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, bu = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, bv = /(?:^file|^widget|\-extension):$/, bw = /^(?:GET|HEAD)$/, bx = /^\/\//, by = /\?/, bz = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, bA = /^(?:select|textarea)/i, bB = /\s+/, bC = /([?&])_=[^&]*/, bD = /(^|\-)([a-z])/g, bE = function (a, b, c)
    {
        return b + c.toUpperCase()
    }, bF = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/, bG = d.fn.load, bH = {}, bI = {}, bJ, bK;
    try
    {
        bJ = c.location.href
    } catch (bL)
    {
        bJ = c.createElement("a"), bJ.href = "", bJ = bJ.href
    }
    bK = bF.exec(bJ.toLowerCase()), d.fn.extend({
        load: function (a, c, e)
        {
            if (typeof a !== "string" && bG)return bG.apply(this, arguments);
            if (!this.length)return this;
            var f = a.indexOf(" ");
            if (f >= 0)
            {
                var g = a.slice(f, a.length);
                a = a.slice(0, f)
            }
            var h = "GET";
            c && (d.isFunction(c) ? (e = c, c = b) : typeof c === "object" && (c = d.param(c, d.ajaxSettings.traditional), h = "POST"));
            var i = this;
            d.ajax({
                url: a, type: h, dataType: "html", data: c, complete: function (a, b, c)
                {
                    c = a.responseText, a.isResolved() && (a.done(function (a)
                    {
                        c = a
                    }), i.html(g ? d("<div>").append(c.replace(bz, "")).find(g) : c)), e && i.each(e, [c, b, a])
                }
            });
            return this
        }, serialize: function ()
        {
            return d.param(this.serializeArray())
        }, serializeArray: function ()
        {
            return this.map(function ()
            {
                return this.elements ? d.makeArray(this.elements) : this
            }).filter(function ()
            {
                return this.name && !this.disabled && (this.checked || bA.test(this.nodeName) || bu.test(this.type))
            }).map(function (a, b)
            {
                var c = d(this).val();
                return c == null ? null : d.isArray(c) ? d.map(c, function (a, c)
                {
                    return {name: b.name, value: a.replace(br, "\r\n")}
                }) : {name: b.name, value: c.replace(br, "\r\n")}
            }).get()
        }
    }), d.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (a, b)
    {
        d.fn[b] = function (a)
        {
            return this.bind(b, a)
        }
    }), d.each(["get", "post"], function (a, c)
    {
        d[c] = function (a, e, f, g)
        {
            d.isFunction(e) && (g = g || f, f = e, e = b);
            return d.ajax({type: c, url: a, data: e, success: f, dataType: g})
        }
    }), d.extend({
        getScript: function (a, c)
        {
            return d.get(a, b, c, "script")
        },
        getJSON: function (a, b, c)
        {
            return d.get(a, b, c, "json")
        },
        ajaxSetup: function (a, b)
        {
            b ? d.extend(!0, a, d.ajaxSettings, b) : (b = a, a = d.extend(!0, d.ajaxSettings, b));
            for (var c in{context: 1, url: 1})c in b ? a[c] = b[c] : c in d.ajaxSettings && (a[c] = d.ajaxSettings[c]);
            return a
        },
        ajaxSettings: {
            url: bJ,
            isLocal: bv.test(bK[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": "*/*"
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText"},
            converters: {"* text": a.String, "text html": !0, "text json": d.parseJSON, "text xml": d.parseXML}
        },
        ajaxPrefilter: bM(bH),
        ajaxTransport: bM(bI),
        ajax: function (a, c)
        {
            function v(a, c, l, n)
            {
                if (r !== 2)
                {
                    r = 2, p && clearTimeout(p), o = b, m = n || "", u.readyState = a ? 4 : 0;
                    var q, t, v, w = l ? bP(e, u, l) : b, x, y;
                    if (a >= 200 && a < 300 || a === 304)
                    {
                        if (e.ifModified)
                        {
                            if (x = u.getResponseHeader("Last-Modified"))d.lastModified[k] = x;
                            if (y = u.getResponseHeader("Etag"))d.etag[k] = y
                        }
                        if (a === 304)c = "notmodified", q = !0; else try
                        {
                            t = bQ(e, w), c = "success", q = !0
                        } catch (z)
                        {
                            c = "parsererror", v = z
                        }
                    } else
                    {
                        v = c;
                        if (!c || a)c = "error", a < 0 && (a = 0)
                    }
                    u.status = a, u.statusText = c, q ? h.resolveWith(f, [t, c, u]) : h.rejectWith(f, [u, c, v]), u.statusCode(j), j = b, s && g.trigger("ajax" + (q ? "Success" : "Error"), [u, e, q ? t : v]), i.resolveWith(f, [u, c]), s && (g.trigger("ajaxComplete", [u, e]), --d.active || d.event.trigger("ajaxStop"))
                }
            }

            typeof a === "object" && (c = a, a = b), c = c || {};
            var e = d.ajaxSetup({}, c), f = e.context || e, g = f !== e && (f.nodeType || f instanceof d) ? d(f) : d.event, h = d.Deferred(), i = d._Deferred(), j = e.statusCode || {}, k, l = {}, m, n, o, p, q, r = 0, s, t, u = {
                readyState: 0,
                setRequestHeader: function (a, b)
                {
                    r || (l[a.toLowerCase().replace(bD, bE)] = b);
                    return this
                },
                getAllResponseHeaders: function ()
                {
                    return r === 2 ? m : null
                },
                getResponseHeader: function (a)
                {
                    var c;
                    if (r === 2)
                    {
                        if (!n)
                        {
                            n = {};
                            while (c = bt.exec(m))n[c[1].toLowerCase()] = c[2]
                        }
                        c = n[a.toLowerCase()]
                    }
                    return c === b ? null : c
                },
                overrideMimeType: function (a)
                {
                    r || (e.mimeType = a);
                    return this
                },
                abort: function (a)
                {
                    a = a || "abort", o && o.abort(a), v(0, a);
                    return this
                }
            };
            h.promise(u), u.success = u.done, u.error = u.fail, u.complete = i.done, u.statusCode = function (a)
            {
                if (a)
                {
                    var b;
                    if (r < 2)for (b in a)j[b] = [j[b], a[b]]; else b = a[u.status], u.then(b, b)
                }
                return this
            }, e.url = ((a || e.url) + "").replace(bs, "").replace(bx, bK[1] + "//"), e.dataTypes = d.trim(e.dataType || "*").toLowerCase().split(bB), e.crossDomain || (q = bF.exec(e.url.toLowerCase()), e.crossDomain = q && (q[1] != bK[1] || q[2] != bK[2] || (q[3] || (q[1] === "http:" ? 80 : 443)) != (bK[3] || (bK[1] === "http:" ? 80 : 443)))), e.data && e.processData && typeof e.data !== "string" && (e.data = d.param(e.data, e.traditional)), bN(bH, e, c, u);
            if (r === 2)return !1;
            s = e.global, e.type = e.type.toUpperCase(), e.hasContent = !bw.test(e.type), s && d.active++ === 0 && d.event.trigger("ajaxStart");
            if (!e.hasContent)
            {
                e.data && (e.url += (by.test(e.url) ? "&" : "?") + e.data), k = e.url;
                if (e.cache === !1)
                {
                    var w = d.now(), x = e.url.replace(bC, "$1_=" + w);
                    e.url = x + (x === e.url ? (by.test(e.url) ? "&" : "?") + "_=" + w : "")
                }
            }
            if (e.data && e.hasContent && e.contentType !== !1 || c.contentType)l["Content-Type"] = e.contentType;
            e.ifModified && (k = k || e.url, d.lastModified[k] && (l["If-Modified-Since"] = d.lastModified[k]), d.etag[k] && (l["If-None-Match"] = d.etag[k])), l.Accept = e.dataTypes[0] && e.accepts[e.dataTypes[0]] ? e.accepts[e.dataTypes[0]] + (e.dataTypes[0] !== "*" ? ", */*; q=0.01" : "") : e.accepts["*"];
            for (t in e.headers)u.setRequestHeader(t, e.headers[t]);
            if (e.beforeSend && (e.beforeSend.call(f, u, e) === !1 || r === 2))
            {
                u.abort();
                return !1
            }
            for (t in{success: 1, error: 1, complete: 1})u[t](e[t]);
            o = bN(bI, e, c, u);
            if (o)
            {
                u.readyState = 1, s && g.trigger("ajaxSend", [u, e]), e.async && e.timeout > 0 && (p = setTimeout(function ()
                {
                    u.abort("timeout")
                }, e.timeout));
                try
                {
                    r = 1, o.send(l, v)
                } catch (y)
                {
                    status < 2 ? v(-1, y) : d.error(y)
                }
            } else v(-1, "No Transport");
            return u
        },
        param: function (a, c)
        {
            var e = [], f = function (a, b)
            {
                b = d.isFunction(b) ? b() : b, e[e.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
            c === b && (c = d.ajaxSettings.traditional);
            if (d.isArray(a) || a.jquery && !d.isPlainObject(a))d.each(a, function ()
            {
                f(this.name, this.value)
            }); else for (var g in a)bO(g, a[g], c, f);
            return e.join("&").replace(bp, "+")
        }
    }), d.extend({active: 0, lastModified: {}, etag: {}});
    var bR = d.now(), bS = /(\=)\?(&|$)|()\?\?()/i;
    d.ajaxSetup({
        jsonp: "callback", jsonpCallback: function ()
        {
            return d.expando + "_" + bR++
        }
    }), d.ajaxPrefilter("json jsonp", function (b, c, e)
    {
        var f = typeof b.data === "string";
        if (b.dataTypes[0] === "jsonp" || c.jsonpCallback || c.jsonp != null || b.jsonp !== !1 && (bS.test(b.url) || f && bS.test(b.data)))
        {
            var g, h = b.jsonpCallback = d.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, i = a[h], j = b.url, k = b.data, l = "$1" + h + "$2", m = function ()
            {
                a[h] = i, g && d.isFunction(i) && a[h](g[0])
            };
            b.jsonp !== !1 && (j = j.replace(bS, l), b.url === j && (f && (k = k.replace(bS, l)), b.data === k && (j += (/\?/.test(j) ? "&" : "?") + b.jsonp + "=" + h))), b.url = j, b.data = k, a[h] = function (a)
            {
                g = [a]
            }, e.then(m, m), b.converters["script json"] = function ()
            {
                g || d.error(h + " was not called");
                return g[0]
            }, b.dataTypes[0] = "json";
            return "script"
        }
    }), d.ajaxSetup({
        accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
        contents: {script: /javascript|ecmascript/},
        converters: {
            "text script": function (a)
            {
                d.globalEval(a);
                return a
            }
        }
    }), d.ajaxPrefilter("script", function (a)
    {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), d.ajaxTransport("script", function (a)
    {
        if (a.crossDomain)
        {
            var d, e = c.head || c.getElementsByTagName("head")[0] || c.documentElement;
            return {
                send: function (f, g)
                {
                    d = c.createElement("script"), d.async = "async", a.scriptCharset && (d.charset = a.scriptCharset), d.src = a.url, d.onload = d.onreadystatechange = function (a, c)
                    {
                        if (!d.readyState || /loaded|complete/.test(d.readyState))d.onload = d.onreadystatechange = null, e && d.parentNode && e.removeChild(d), d = b, c || g(200, "success")
                    }, e.insertBefore(d, e.firstChild)
                }, abort: function ()
                {
                    d && d.onload(0, 1)
                }
            }
        }
    });
    var bT = d.now(), bU, bV;
    d.ajaxSettings.xhr = a.ActiveXObject ? function ()
    {
        return !this.isLocal && bX() || bY()
    } : bX, bV = d.ajaxSettings.xhr(), d.support.ajax = !!bV, d.support.cors = bV && "withCredentials" in bV, bV = b, d.support.ajax && d.ajaxTransport(function (a)
    {
        if (!a.crossDomain || d.support.cors)
        {
            var c;
            return {
                send: function (e, f)
                {
                    var g = a.xhr(), h, i;
                    a.username ? g.open(a.type, a.url, a.async, a.username, a.password) : g.open(a.type, a.url, a.async);
                    if (a.xhrFields)for (i in a.xhrFields)g[i] = a.xhrFields[i];
                    a.mimeType && g.overrideMimeType && g.overrideMimeType(a.mimeType), (!a.crossDomain || a.hasContent) && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                    try
                    {
                        for (i in e)g.setRequestHeader(i, e[i])
                    } catch (j)
                    {
                    }
                    g.send(a.hasContent && a.data || null), c = function (e, i)
                    {
                        var j, k, l, m, n;
                        try
                        {
                            if (c && (i || g.readyState === 4))
                            {
                                c = b, h && (g.onreadystatechange = d.noop, delete bU[h]);
                                if (i)g.readyState !== 4 && g.abort(); else
                                {
                                    j = g.status, l = g.getAllResponseHeaders(), m = {}, n = g.responseXML, n && n.documentElement && (m.xml = n), m.text = g.responseText;
                                    try
                                    {
                                        k = g.statusText
                                    } catch (o)
                                    {
                                        k = ""
                                    }
                                    j || !a.isLocal || a.crossDomain ? j === 1223 && (j = 204) : j = m.text ? 200 : 404
                                }
                            }
                        } catch (p)
                        {
                            i || f(-1, p)
                        }
                        m && f(j, k, m, l)
                    }, a.async && g.readyState !== 4 ? (bU || (bU = {}, bW()), h = bT++, g.onreadystatechange = bU[h] = c) : c()
                }, abort: function ()
                {
                    c && c(0, 1)
                }
            }
        }
    });
    var bZ = {}, b$ = /^(?:toggle|show|hide)$/, b_ = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, ca, cb = [["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"], ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"], ["opacity"]];
    d.fn.extend({
        show: function (a, b, c)
        {
            var e, f;
            if (a || a === 0)return this.animate(cc("show", 3), a, b, c);
            for (var g = 0, h = this.length; g < h; g++)e = this[g], f = e.style.display, !d._data(e, "olddisplay") && f === "none" && (f = e.style.display = ""), f === "" && d.css(e, "display") === "none" && d._data(e, "olddisplay", cd(e.nodeName));
            for (g = 0; g < h; g++)
            {
                e = this[g], f = e.style.display;
                if (f === "" || f === "none")e.style.display = d._data(e, "olddisplay") || ""
            }
            return this
        }, hide: function (a, b, c)
        {
            if (a || a === 0)return this.animate(cc("hide", 3), a, b, c);
            for (var e = 0, f = this.length; e < f; e++)
            {
                var g = d.css(this[e], "display");
                g !== "none" && !d._data(this[e], "olddisplay") && d._data(this[e], "olddisplay", g)
            }
            for (e = 0; e < f; e++)this[e].style.display = "none";
            return this
        }, _toggle: d.fn.toggle, toggle: function (a, b, c)
        {
            var e = typeof a === "boolean";
            d.isFunction(a) && d.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || e ? this.each(function ()
            {
                var b = e ? a : d(this).is(":hidden");
                d(this)[b ? "show" : "hide"]()
            }) : this.animate(cc("toggle", 3), a, b, c);
            return this
        }, fadeTo: function (a, b, c, d)
        {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
        }, animate: function (a, b, c, e)
        {
            var f = d.speed(b, c, e);
            if (d.isEmptyObject(a))return this.each(f.complete);
            return this[f.queue === !1 ? "each" : "queue"](function ()
            {
                var b = d.extend({}, f), c, e = this.nodeType === 1, g = e && d(this).is(":hidden"), h = this;
                for (c in a)
                {
                    var i = d.camelCase(c);
                    c !== i && (a[i] = a[c], delete a[c], c = i);
                    if (a[c] === "hide" && g || a[c] === "show" && !g)return b.complete.call(this);
                    if (e && (c === "height" || c === "width"))
                    {
                        b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];
                        if (d.css(this, "display") === "inline" && d.css(this, "float") === "none")if (d.support.inlineBlockNeedsLayout)
                        {
                            var j = cd(this.nodeName);
                            j === "inline" ? this.style.display = "inline-block" : (this.style.display = "inline", this.style.zoom = 1)
                        } else this.style.display = "inline-block"
                    }
                    d.isArray(a[c]) && ((b.specialEasing = b.specialEasing || {})[c] = a[c][1], a[c] = a[c][0])
                }
                b.overflow != null && (this.style.overflow = "hidden"), b.curAnim = d.extend({}, a), d.each(a, function (c, e)
                {
                    var f = new d.fx(h, b, c);
                    if (b$.test(e))f[e === "toggle" ? g ? "show" : "hide" : e](a); else
                    {
                        var i = b_.exec(e), j = f.cur();
                        if (i)
                        {
                            var k = parseFloat(i[2]), l = i[3] || (d.cssNumber[c] ? "" : "px");
                            l !== "px" && (d.style(h, c, (k || 1) + l), j = (k || 1) / f.cur() * j, d.style(h, c, j + l)), i[1] && (k = (i[1] === "-=" ? -1 : 1) * k + j), f.custom(j, k, l)
                        } else f.custom(j, e, "")
                    }
                });
                return !0
            })
        }, stop: function (a, b)
        {
            var c = d.timers;
            a && this.queue([]), this.each(function ()
            {
                for (var a = c.length - 1; a >= 0; a--)c[a].elem === this && (b && c[a](!0), c.splice(a, 1))
            }), b || this.dequeue();
            return this
        }
    }), d.each({
        slideDown: cc("show", 1),
        slideUp: cc("hide", 1),
        slideToggle: cc("toggle", 1),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
    }, function (a, b)
    {
        d.fn[a] = function (a, c, d)
        {
            return this.animate(b, a, c, d)
        }
    }), d.extend({
        speed: function (a, b, c)
        {
            var e = a && typeof a === "object" ? d.extend({}, a) : {
                complete: c || !c && b || d.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !d.isFunction(b) && b
            };
            e.duration = d.fx.off ? 0 : typeof e.duration === "number" ? e.duration : e.duration in d.fx.speeds ? d.fx.speeds[e.duration] : d.fx.speeds._default, e.old = e.complete, e.complete = function ()
            {
                e.queue !== !1 && d(this).dequeue(), d.isFunction(e.old) && e.old.call(this)
            };
            return e
        }, easing: {
            linear: function (a, b, c, d)
            {
                return c + d * a
            }, swing: function (a, b, c, d)
            {
                return (-Math.cos(a * Math.PI) / 2 + .5) * d + c
            }
        }, timers: [], fx: function (a, b, c)
        {
            this.options = b, this.elem = a, this.prop = c, b.orig || (b.orig = {})
        }
    }), d.fx.prototype = {
        update: function ()
        {
            this.options.step && this.options.step.call(this.elem, this.now, this), (d.fx.step[this.prop] || d.fx.step._default)(this)
        }, cur: function ()
        {
            if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null))return this.elem[this.prop];
            var a, b = d.css(this.elem, this.prop);
            return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
        }, custom: function (a, b, c)
        {
            function g(a)
            {
                return e.step(a)
            }

            var e = this, f = d.fx;
            this.startTime = d.now(), this.start = a, this.end = b, this.unit = c || this.unit || (d.cssNumber[this.prop] ? "" : "px"), this.now = this.start, this.pos = this.state = 0, g.elem = this.elem, g() && d.timers.push(g) && !ca && (ca = setInterval(f.tick, f.interval))
        }, show: function ()
        {
            this.options.orig[this.prop] = d.style(this.elem, this.prop), this.options.show = !0, this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), d(this.elem).show()
        }, hide: function ()
        {
            this.options.orig[this.prop] = d.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        }, step: function (a)
        {
            var b = d.now(), c = !0;
            if (a || b >= this.options.duration + this.startTime)
            {
                this.now = this.end, this.pos = this.state = 1, this.update(), this.options.curAnim[this.prop] = !0;
                for (var e in this.options.curAnim)this.options.curAnim[e] !== !0 && (c = !1);
                if (c)
                {
                    if (this.options.overflow != null && !d.support.shrinkWrapBlocks)
                    {
                        var f = this.elem, g = this.options;
                        d.each(["", "X", "Y"], function (a, b)
                        {
                            f.style["overflow" + b] = g.overflow[a]
                        })
                    }
                    this.options.hide && d(this.elem).hide();
                    if (this.options.hide || this.options.show)for (var h in this.options.curAnim)d.style(this.elem, h, this.options.orig[h]);
                    this.options.complete.call(this.elem)
                }
                return !1
            }
            var i = b - this.startTime;
            this.state = i / this.options.duration;
            var j = this.options.specialEasing && this.options.specialEasing[this.prop], k = this.options.easing || (d.easing.swing ? "swing" : "linear");
            this.pos = d.easing[j || k](this.state, i, 0, 1, this.options.duration), this.now = this.start + (this.end - this.start) * this.pos, this.update();
            return !0
        }
    }, d.extend(d.fx, {
        tick: function ()
        {
            var a = d.timers;
            for (var b = 0; b < a.length; b++)a[b]() || a.splice(b--, 1);
            a.length || d.fx.stop()
        }, interval: 13, stop: function ()
        {
            clearInterval(ca), ca = null
        }, speeds: {slow: 600, fast: 200, _default: 400}, step: {
            opacity: function (a)
            {
                d.style(a.elem, "opacity", a.now)
            }, _default: function (a)
            {
                a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = (a.prop === "width" || a.prop === "height" ? Math.max(0, a.now) : a.now) + a.unit : a.elem[a.prop] = a.now
            }
        }
    }), d.expr && d.expr.filters && (d.expr.filters.animated = function (a)
    {
        return d.grep(d.timers, function (b)
        {
            return a === b.elem
        }).length
    });
    var ce = /^t(?:able|d|h)$/i, cf = /^(?:body|html)$/i;
    "getBoundingClientRect" in c.documentElement ? d.fn.offset = function (a)
    {
        var b = this[0], c;
        if (a)return this.each(function (b)
        {
            d.offset.setOffset(this, a, b)
        });
        if (!b || !b.ownerDocument)return null;
        if (b === b.ownerDocument.body)return d.offset.bodyOffset(b);
        try
        {
            c = b.getBoundingClientRect()
        } catch (e)
        {
        }
        var f = b.ownerDocument, g = f.documentElement;
        if (!c || !d.contains(g, b))return c ? {top: c.top, left: c.left} : {top: 0, left: 0};
        var h = f.body, i = cg(f), j = g.clientTop || h.clientTop || 0, k = g.clientLeft || h.clientLeft || 0, l = i.pageYOffset || d.support.boxModel && g.scrollTop || h.scrollTop, m = i.pageXOffset || d.support.boxModel && g.scrollLeft || h.scrollLeft, n = c.top + l - j, o = c.left + m - k;
        return {top: n, left: o}
    } : d.fn.offset = function (a)
    {
        var b = this[0];
        if (a)return this.each(function (b)
        {
            d.offset.setOffset(this, a, b)
        });
        if (!b || !b.ownerDocument)return null;
        if (b === b.ownerDocument.body)return d.offset.bodyOffset(b);
        d.offset.initialize();
        var c, e = b.offsetParent, f = b, g = b.ownerDocument, h = g.documentElement, i = g.body, j = g.defaultView, k = j ? j.getComputedStyle(b, null) : b.currentStyle, l = b.offsetTop, m = b.offsetLeft;
        while ((b = b.parentNode) && b !== i && b !== h)
        {
            if (d.offset.supportsFixedPosition && k.position === "fixed")break;
            c = j ? j.getComputedStyle(b, null) : b.currentStyle, l -= b.scrollTop, m -= b.scrollLeft, b === e && (l += b.offsetTop, m += b.offsetLeft, d.offset.doesNotAddBorder && (!d.offset.doesAddBorderForTableAndCells || !ce.test(b.nodeName)) && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), f = e, e = b.offsetParent), d.offset.subtractsBorderForOverflowNotVisible && c.overflow !== "visible" && (l += parseFloat(c.borderTopWidth) || 0, m += parseFloat(c.borderLeftWidth) || 0), k = c
        }
        if (k.position === "relative" || k.position === "static")l += i.offsetTop, m += i.offsetLeft;
        d.offset.supportsFixedPosition && k.position === "fixed" && (l += Math.max(h.scrollTop, i.scrollTop), m += Math.max(h.scrollLeft, i.scrollLeft));
        return {top: l, left: m}
    }, d.offset = {
        initialize: function ()
        {
            var a = c.body, b = c.createElement("div"), e, f, g, h, i = parseFloat(d.css(a, "marginTop")) || 0, j = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";
            d.extend(b.style, {
                position: "absolute",
                top: 0,
                left: 0,
                margin: 0,
                border: 0,
                width: "1px",
                height: "1px",
                visibility: "hidden"
            }), b.innerHTML = j, a.insertBefore(b, a.firstChild), e = b.firstChild, f = e.firstChild, h = e.nextSibling.firstChild.firstChild, this.doesNotAddBorder = f.offsetTop !== 5, this.doesAddBorderForTableAndCells = h.offsetTop === 5, f.style.position = "fixed", f.style.top = "20px", this.supportsFixedPosition = f.offsetTop === 20 || f.offsetTop === 15, f.style.position = f.style.top = "", e.style.overflow = "hidden", e.style.position = "relative", this.subtractsBorderForOverflowNotVisible = f.offsetTop === -5, this.doesNotIncludeMarginInBodyOffset = a.offsetTop !== i, a.removeChild(b), a = b = e = f = g = h = null, d.offset.initialize = d.noop
        }, bodyOffset: function (a)
        {
            var b = a.offsetTop, c = a.offsetLeft;
            d.offset.initialize(), d.offset.doesNotIncludeMarginInBodyOffset && (b += parseFloat(d.css(a, "marginTop")) || 0, c += parseFloat(d.css(a, "marginLeft")) || 0);
            return {top: b, left: c}
        }, setOffset: function (a, b, c)
        {
            var e = d.css(a, "position");
            e === "static" && (a.style.position = "relative");
            var f = d(a), g = f.offset(), h = d.css(a, "top"), i = d.css(a, "left"), j = e === "absolute" && d.inArray("auto", [h, i]) > -1, k = {}, l = {}, m, n;
            j && (l = f.position()), m = j ? l.top : parseInt(h, 10) || 0, n = j ? l.left : parseInt(i, 10) || 0, d.isFunction(b) && (b = b.call(a, c, g)), b.top != null && (k.top = b.top - g.top + m), b.left != null && (k.left = b.left - g.left + n), "using" in b ? b.using.call(a, k) : f.css(k)
        }
    }, d.fn.extend({
        position: function ()
        {
            if (!this[0])return null;
            var a = this[0], b = this.offsetParent(), c = this.offset(), e = cf.test(b[0].nodeName) ? {
                top: 0,
                left: 0
            } : b.offset();
            c.top -= parseFloat(d.css(a, "marginTop")) || 0, c.left -= parseFloat(d.css(a, "marginLeft")) || 0, e.top += parseFloat(d.css(b[0], "borderTopWidth")) || 0, e.left += parseFloat(d.css(b[0], "borderLeftWidth")) || 0;
            return {top: c.top - e.top, left: c.left - e.left}
        }, offsetParent: function ()
        {
            return this.map(function ()
            {
                var a = this.offsetParent || c.body;
                while (a && (!cf.test(a.nodeName) && d.css(a, "position") === "static"))a = a.offsetParent;
                return a
            })
        }
    }), d.each(["Left", "Top"], function (a, c)
    {
        var e = "scroll" + c;
        d.fn[e] = function (c)
        {
            var f = this[0], g;
            if (!f)return null;
            if (c !== b)return this.each(function ()
            {
                g = cg(this), g ? g.scrollTo(a ? d(g).scrollLeft() : c, a ? c : d(g).scrollTop()) : this[e] = c
            });
            g = cg(f);
            return g ? "pageXOffset" in g ? g[a ? "pageYOffset" : "pageXOffset"] : d.support.boxModel && g.document.documentElement[e] || g.document.body[e] : f[e]
        }
    }), d.each(["Height", "Width"], function (a, c)
    {
        var e = c.toLowerCase();
        d.fn["inner" + c] = function ()
        {
            return this[0] ? parseFloat(d.css(this[0], e, "padding")) : null
        }, d.fn["outer" + c] = function (a)
        {
            return this[0] ? parseFloat(d.css(this[0], e, a ? "margin" : "border")) : null
        }, d.fn[e] = function (a)
        {
            var f = this[0];
            if (!f)return a == null ? null : this;
            if (d.isFunction(a))return this.each(function (b)
            {
                var c = d(this);
                c[e](a.call(this, b, c[e]()))
            });
            if (d.isWindow(f))
            {
                var g = f.document.documentElement["client" + c];
                return f.document.compatMode === "CSS1Compat" && g || f.document.body["client" + c] || g
            }
            if (f.nodeType === 9)return Math.max(f.documentElement["client" + c], f.body["scroll" + c], f.documentElement["scroll" + c], f.body["offset" + c], f.documentElement["offset" + c]);
            if (a === b)
            {
                var h = d.css(f, e), i = parseFloat(h);
                return d.isNaN(i) ? h : i
            }
            return this.css(e, typeof a === "string" ? a : a + "px")
        }
    }), a.jQuery = a.$ = d
})(window);
/* "/static/js/jquery-1.5.1/jquery-ui.custom.min.js" */
/*!
 * jQuery UI 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function (c, j)
{
    function k(a)
    {
        return !c(a).parents().andSelf().filter(function ()
        {
            return c.curCSS(this, "visibility") === "hidden" || c.expr.filters.hidden(this)
        }).length
    }

    c.ui = c.ui || {};
    if (!c.ui.version)
    {
        c.extend(c.ui, {
            version: "1.8.12",
            keyCode: {
                ALT: 18,
                BACKSPACE: 8,
                CAPS_LOCK: 20,
                COMMA: 188,
                COMMAND: 91,
                COMMAND_LEFT: 91,
                COMMAND_RIGHT: 93,
                CONTROL: 17,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                INSERT: 45,
                LEFT: 37,
                MENU: 93,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SHIFT: 16,
                SPACE: 32,
                TAB: 9,
                UP: 38,
                WINDOWS: 91
            }
        });
        c.fn.extend({
            _focus: c.fn.focus, focus: function (a, b)
            {
                return typeof a === "number" ? this.each(function ()
                {
                    var d = this;
                    setTimeout(function ()
                    {
                        c(d).focus();
                        b && b.call(d)
                    }, a)
                }) : this._focus.apply(this, arguments)
            }, scrollParent: function ()
            {
                var a;
                a = c.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function ()
                {
                    return /(relative|absolute|fixed)/.test(c.curCSS(this, "position", 1)) && /(auto|scroll)/.test(c.curCSS(this, "overflow", 1) + c.curCSS(this, "overflow-y", 1) + c.curCSS(this, "overflow-x", 1))
                }).eq(0) : this.parents().filter(function ()
                {
                    return /(auto|scroll)/.test(c.curCSS(this, "overflow", 1) + c.curCSS(this, "overflow-y", 1) + c.curCSS(this, "overflow-x", 1))
                }).eq(0);
                return /fixed/.test(this.css("position")) || !a.length ? c(document) : a
            }, zIndex: function (a)
            {
                if (a !== j)return this.css("zIndex", a);
                if (this.length)
                {
                    a = c(this[0]);
                    for (var b; a.length && a[0] !== document;)
                    {
                        b = a.css("position");
                        if (b === "absolute" || b === "relative" || b === "fixed")
                        {
                            b = parseInt(a.css("zIndex"), 10);
                            if (!isNaN(b) && b !== 0)return b
                        }
                        a = a.parent()
                    }
                }
                return 0
            }, disableSelection: function ()
            {
                return this.bind((c.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (a)
                {
                    a.preventDefault()
                })
            }, enableSelection: function ()
            {
                return this.unbind(".ui-disableSelection")
            }
        });
        c.each(["Width", "Height"], function (a, b)
        {
            function d(f, g, l, m)
            {
                c.each(e, function ()
                {
                    g -= parseFloat(c.curCSS(f, "padding" + this, true)) || 0;
                    if (l)g -= parseFloat(c.curCSS(f, "border" + this + "Width", true)) || 0;
                    if (m)g -= parseFloat(c.curCSS(f, "margin" + this, true)) || 0
                });
                return g
            }

            var e = b === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], h = b.toLowerCase(), i = {
                innerWidth: c.fn.innerWidth,
                innerHeight: c.fn.innerHeight,
                outerWidth: c.fn.outerWidth,
                outerHeight: c.fn.outerHeight
            };
            c.fn["inner" + b] = function (f)
            {
                if (f === j)return i["inner" + b].call(this);
                return this.each(function ()
                {
                    c(this).css(h, d(this, f) + "px")
                })
            };
            c.fn["outer" + b] = function (f, g)
            {
                if (typeof f !== "number")return i["outer" + b].call(this, f);
                return this.each(function ()
                {
                    c(this).css(h, d(this, f, true, g) + "px")
                })
            }
        });
        c.extend(c.expr[":"], {
            data: function (a, b, d)
            {
                return !!c.data(a, d[3])
            }, focusable: function (a)
            {
                var b = a.nodeName.toLowerCase(), d = c.attr(a, "tabindex");
                if ("area" === b)
                {
                    b = a.parentNode;
                    d = b.name;
                    if (!a.href || !d || b.nodeName.toLowerCase() !== "map")return false;
                    a = c("img[usemap=#" + d + "]")[0];
                    return !!a && k(a)
                }
                return (/input|select|textarea|button|object/.test(b) ? !a.disabled : "a" == b ? a.href || !isNaN(d) : !isNaN(d)) && k(a)
            }, tabbable: function (a)
            {
                var b = c.attr(a, "tabindex");
                return (isNaN(b) || b >= 0) && c(a).is(":focusable")
            }
        });
        c(function ()
        {
            var a = document.body, b = a.appendChild(b = document.createElement("div"));
            c.extend(b.style, {minHeight: "100px", height: "auto", padding: 0, borderWidth: 0});
            c.support.minHeight = b.offsetHeight === 100;
            c.support.selectstart = "onselectstart" in b;
            a.removeChild(b).style.display = "none"
        });
        c.extend(c.ui, {
            plugin: {
                add: function (a, b, d)
                {
                    a = c.ui[a].prototype;
                    for (var e in d)
                    {
                        a.plugins[e] = a.plugins[e] || [];
                        a.plugins[e].push([b, d[e]])
                    }
                }, call: function (a, b, d)
                {
                    if ((b = a.plugins[b]) && a.element[0].parentNode)for (var e = 0; e < b.length; e++)a.options[b[e][0]] && b[e][1].apply(a.element, d)
                }
            }, contains: function (a, b)
            {
                return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b)
            }, hasScroll: function (a, b)
            {
                if (c(a).css("overflow") === "hidden")return false;
                b = b && b === "left" ? "scrollLeft" : "scrollTop";
                var d = false;
                if (a[b] > 0)return true;
                a[b] = 1;
                d = a[b] > 0;
                a[b] = 0;
                return d
            }, isOverAxis: function (a, b, d)
            {
                return a > b && a < b + d
            }, isOver: function (a, b, d, e, h, i)
            {
                return c.ui.isOverAxis(a, d, h) && c.ui.isOverAxis(b, e, i)
            }
        })
    }
})(jQuery);
;/*!
 * jQuery UI Widget 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function (b, j)
{
    if (b.cleanData)
    {
        var k = b.cleanData;
        b.cleanData = function (a)
        {
            for (var c = 0, d; (d = a[c]) != null; c++)b(d).triggerHandler("remove");
            k(a)
        }
    } else
    {
        var l = b.fn.remove;
        b.fn.remove = function (a, c)
        {
            return this.each(function ()
            {
                if (!c)if (!a || b.filter(a, [this]).length)b("*", this).add([this]).each(function ()
                {
                    b(this).triggerHandler("remove")
                });
                return l.call(b(this), a, c)
            })
        }
    }
    b.widget = function (a, c, d)
    {
        var e = a.split(".")[0], f;
        a = a.split(".")[1];
        f = e + "-" + a;
        if (!d)
        {
            d = c;
            c = b.Widget
        }
        b.expr[":"][f] = function (h)
        {
            return !!b.data(h, a)
        };
        b[e] = b[e] || {};
        b[e][a] = function (h, g)
        {
            arguments.length && this._createWidget(h, g)
        };
        c = new c;
        c.options = b.extend(true, {}, c.options);
        b[e][a].prototype = b.extend(true, c, {
            namespace: e,
            widgetName: a,
            widgetEventPrefix: b[e][a].prototype.widgetEventPrefix || a,
            widgetBaseClass: f
        }, d);
        b.widget.bridge(a, b[e][a])
    };
    b.widget.bridge = function (a, c)
    {
        b.fn[a] = function (d)
        {
            var e = typeof d === "string", f = Array.prototype.slice.call(arguments, 1), h = this;
            d = !e && f.length ? b.extend.apply(null, [true, d].concat(f)) : d;
            if (e && d.charAt(0) === "_")return h;
            e ? this.each(function ()
            {
                var g = b.data(this, a), i = g && b.isFunction(g[d]) ? g[d].apply(g, f) : g;
                if (i !== g && i !== j)
                {
                    h = i;
                    return false
                }
            }) : this.each(function ()
            {
                var g = b.data(this, a);
                g ? g.option(d || {})._init() : b.data(this, a, new c(d, this))
            });
            return h
        }
    };
    b.Widget = function (a, c)
    {
        arguments.length && this._createWidget(a, c)
    };
    b.Widget.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {disabled: false},
        _createWidget: function (a, c)
        {
            b.data(c, this.widgetName, this);
            this.element = b(c);
            this.options = b.extend(true, {}, this.options, this._getCreateOptions(), a);
            var d = this;
            this.element.bind("remove." + this.widgetName, function ()
            {
                d.destroy()
            });
            this._create();
            this._trigger("create");
            this._init()
        },
        _getCreateOptions: function ()
        {
            return b.metadata && b.metadata.get(this.element[0])[this.widgetName]
        },
        _create: function ()
        {
        },
        _init: function ()
        {
        },
        destroy: function ()
        {
            this.element.unbind("." + this.widgetName).removeData(this.widgetName);
            this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled ui-state-disabled")
        },
        widget: function ()
        {
            return this.element
        },
        option: function (a, c)
        {
            var d = a;
            if (arguments.length === 0)return b.extend({}, this.options);
            if (typeof a === "string")
            {
                if (c === j)return this.options[a];
                d = {};
                d[a] = c
            }
            this._setOptions(d);
            return this
        },
        _setOptions: function (a)
        {
            var c = this;
            b.each(a, function (d, e)
            {
                c._setOption(d, e)
            });
            return this
        },
        _setOption: function (a, c)
        {
            this.options[a] = c;
            if (a === "disabled")this.widget()[c ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled ui-state-disabled").attr("aria-disabled", c);
            return this
        },
        enable: function ()
        {
            return this._setOption("disabled", false)
        },
        disable: function ()
        {
            return this._setOption("disabled", true)
        },
        _trigger: function (a, c, d)
        {
            var e = this.options[a];
            c = b.Event(c);
            c.type = (a === this.widgetEventPrefix ? a : this.widgetEventPrefix + a).toLowerCase();
            d = d || {};
            if (c.originalEvent)
            {
                a = b.event.props.length;
                for (var f; a;)
                {
                    f = b.event.props[--a];
                    c[f] = c.originalEvent[f]
                }
            }
            this.element.trigger(c, d);
            return !(b.isFunction(e) && e.call(this.element[0], c, d) === false || c.isDefaultPrevented())
        }
    }
})(jQuery);
;/*!
 * jQuery UI Mouse 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function (b)
{
    b.widget("ui.mouse", {
        options: {cancel: ":input,option", distance: 1, delay: 0}, _mouseInit: function ()
        {
            var a = this;
            this.element.bind("mousedown." + this.widgetName, function (c)
            {
                return a._mouseDown(c)
            }).bind("click." + this.widgetName, function (c)
            {
                if (true === b.data(c.target, a.widgetName + ".preventClickEvent"))
                {
                    b.removeData(c.target, a.widgetName + ".preventClickEvent");
                    c.stopImmediatePropagation();
                    return false
                }
            });
            this.started = false
        }, _mouseDestroy: function ()
        {
            this.element.unbind("." + this.widgetName)
        }, _mouseDown: function (a)
        {
            a.originalEvent = a.originalEvent || {};
            if (!a.originalEvent.mouseHandled)
            {
                this._mouseStarted && this._mouseUp(a);
                this._mouseDownEvent = a;
                var c = this, e = a.which == 1, f = typeof this.options.cancel == "string" ? b(a.target).parents().add(a.target).filter(this.options.cancel).length : false;
                if (!e || f || !this._mouseCapture(a))return true;
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet)this._mouseDelayTimer = setTimeout(function ()
                {
                    c.mouseDelayMet = true
                }, this.options.delay);
                if (this._mouseDistanceMet(a) && this._mouseDelayMet(a))
                {
                    this._mouseStarted = this._mouseStart(a) !== false;
                    if (!this._mouseStarted)
                    {
                        a.preventDefault();
                        return true
                    }
                }
                true === b.data(a.target, this.widgetName + ".preventClickEvent") && b.removeData(a.target, this.widgetName + ".preventClickEvent");
                this._mouseMoveDelegate = function (d)
                {
                    return c._mouseMove(d)
                };
                this._mouseUpDelegate = function (d)
                {
                    return c._mouseUp(d)
                };
                b(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                a.preventDefault();
                return a.originalEvent.mouseHandled = true
            }
        }, _mouseMove: function (a)
        {
            if (b.browser.msie && !(document.documentMode >= 9) && !a.button)return this._mouseUp(a);
            if (this._mouseStarted)
            {
                this._mouseDrag(a);
                return a.preventDefault()
            }
            if (this._mouseDistanceMet(a) && this._mouseDelayMet(a))(this._mouseStarted = this._mouseStart(this._mouseDownEvent, a) !== false) ? this._mouseDrag(a) : this._mouseUp(a);
            return !this._mouseStarted
        }, _mouseUp: function (a)
        {
            b(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
            if (this._mouseStarted)
            {
                this._mouseStarted = false;
                a.target == this._mouseDownEvent.target && b.data(a.target, this.widgetName + ".preventClickEvent", true);
                this._mouseStop(a)
            }
            return false
        }, _mouseDistanceMet: function (a)
        {
            return Math.max(Math.abs(this._mouseDownEvent.pageX - a.pageX), Math.abs(this._mouseDownEvent.pageY - a.pageY)) >= this.options.distance
        }, _mouseDelayMet: function ()
        {
            return this.mouseDelayMet
        }, _mouseStart: function ()
        {
        }, _mouseDrag: function ()
        {
        }, _mouseStop: function ()
        {
        }, _mouseCapture: function ()
        {
            return true
        }
    })
})(jQuery);
;(function (c)
{
    c.ui = c.ui || {};
    var n = /left|center|right/, o = /top|center|bottom/, t = c.fn.position, u = c.fn.offset;
    c.fn.position = function (b)
    {
        if (!b || !b.of)return t.apply(this, arguments);
        b = c.extend({}, b);
        var a = c(b.of), d = a[0], g = (b.collision || "flip").split(" "), e = b.offset ? b.offset.split(" ") : [0, 0], h, k, j;
        if (d.nodeType === 9)
        {
            h = a.width();
            k = a.height();
            j = {top: 0, left: 0}
        } else if (d.setTimeout)
        {
            h = a.width();
            k = a.height();
            j = {top: a.scrollTop(), left: a.scrollLeft()}
        } else if (d.preventDefault)
        {
            b.at = "left top";
            h = k = 0;
            j = {top: b.of.pageY, left: b.of.pageX}
        } else
        {
            h = a.outerWidth();
            k = a.outerHeight();
            j = a.offset()
        }
        c.each(["my", "at"], function ()
        {
            var f = (b[this] || "").split(" ");
            if (f.length === 1)f = n.test(f[0]) ? f.concat(["center"]) : o.test(f[0]) ? ["center"].concat(f) : ["center", "center"];
            f[0] = n.test(f[0]) ? f[0] : "center";
            f[1] = o.test(f[1]) ? f[1] : "center";
            b[this] = f
        });
        if (g.length === 1)g[1] = g[0];
        e[0] = parseInt(e[0], 10) || 0;
        if (e.length === 1)e[1] = e[0];
        e[1] = parseInt(e[1], 10) || 0;
        if (b.at[0] === "right")j.left += h; else if (b.at[0] === "center")j.left += h / 2;
        if (b.at[1] === "bottom")j.top += k; else if (b.at[1] === "center")j.top += k / 2;
        j.left += e[0];
        j.top += e[1];
        return this.each(function ()
        {
            var f = c(this), l = f.outerWidth(), m = f.outerHeight(), p = parseInt(c.curCSS(this, "marginLeft", true)) || 0, q = parseInt(c.curCSS(this, "marginTop", true)) || 0, v = l + p + (parseInt(c.curCSS(this, "marginRight", true)) || 0), w = m + q + (parseInt(c.curCSS(this, "marginBottom", true)) || 0), i = c.extend({}, j), r;
            if (b.my[0] === "right")i.left -= l; else if (b.my[0] === "center")i.left -= l / 2;
            if (b.my[1] === "bottom")i.top -= m; else if (b.my[1] === "center")i.top -= m / 2;
            i.left = Math.round(i.left);
            i.top = Math.round(i.top);
            r = {left: i.left - p, top: i.top - q};
            c.each(["left", "top"], function (s, x)
            {
                c.ui.position[g[s]] && c.ui.position[g[s]][x](i, {
                    targetWidth: h,
                    targetHeight: k,
                    elemWidth: l,
                    elemHeight: m,
                    collisionPosition: r,
                    collisionWidth: v,
                    collisionHeight: w,
                    offset: e,
                    my: b.my,
                    at: b.at
                })
            });
            c.fn.bgiframe && f.bgiframe();
            f.offset(c.extend(i, {using: b.using}))
        })
    };
    c.ui.position = {
        fit: {
            left: function (b, a)
            {
                var d = c(window);
                d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                b.left = d > 0 ? b.left - d : Math.max(b.left - a.collisionPosition.left, b.left)
            }, top: function (b, a)
            {
                var d = c(window);
                d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                b.top = d > 0 ? b.top - d : Math.max(b.top - a.collisionPosition.top, b.top)
            }
        }, flip: {
            left: function (b, a)
            {
                if (a.at[0] !== "center")
                {
                    var d = c(window);
                    d = a.collisionPosition.left + a.collisionWidth - d.width() - d.scrollLeft();
                    var g = a.my[0] === "left" ? -a.elemWidth : a.my[0] === "right" ? a.elemWidth : 0, e = a.at[0] === "left" ? a.targetWidth : -a.targetWidth, h = -2 * a.offset[0];
                    b.left += a.collisionPosition.left < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            }, top: function (b, a)
            {
                if (a.at[1] !== "center")
                {
                    var d = c(window);
                    d = a.collisionPosition.top + a.collisionHeight - d.height() - d.scrollTop();
                    var g = a.my[1] === "top" ? -a.elemHeight : a.my[1] === "bottom" ? a.elemHeight : 0, e = a.at[1] === "top" ? a.targetHeight : -a.targetHeight, h = -2 * a.offset[1];
                    b.top += a.collisionPosition.top < 0 ? g + e + h : d > 0 ? g + e + h : 0
                }
            }
        }
    };
    if (!c.offset.setOffset)
    {
        c.offset.setOffset = function (b, a)
        {
            if (/static/.test(c.curCSS(b, "position")))b.style.position = "relative";
            var d = c(b), g = d.offset(), e = parseInt(c.curCSS(b, "top", true), 10) || 0, h = parseInt(c.curCSS(b, "left", true), 10) || 0;
            g = {top: a.top - g.top + e, left: a.left - g.left + h};
            "using" in a ? a.using.call(b, g) : d.css(g)
        };
        c.fn.offset = function (b)
        {
            var a = this[0];
            if (!a || !a.ownerDocument)return null;
            if (b)return this.each(function ()
            {
                c.offset.setOffset(this, b)
            });
            return u.call(this)
        }
    }
})(jQuery);
;jQuery.effects || function (f, j)
{
    function n(c)
    {
        var a;
        if (c && c.constructor == Array && c.length == 3)return c;
        if (a = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(c))return [parseInt(a[1], 10), parseInt(a[2], 10), parseInt(a[3], 10)];
        if (a = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(c))return [parseFloat(a[1]) * 2.55, parseFloat(a[2]) * 2.55, parseFloat(a[3]) * 2.55];
        if (a = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(c))return [parseInt(a[1], 16), parseInt(a[2], 16), parseInt(a[3], 16)];
        if (a = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(c))return [parseInt(a[1] + a[1], 16), parseInt(a[2] + a[2], 16), parseInt(a[3] + a[3], 16)];
        if (/rgba\(0, 0, 0, 0\)/.exec(c))return o.transparent;
        return o[f.trim(c).toLowerCase()]
    }

    function s(c, a)
    {
        var b;
        do {
            b = f.curCSS(c, a);
            if (b != "" && b != "transparent" || f.nodeName(c, "body"))break;
            a = "backgroundColor"
        } while (c = c.parentNode);
        return n(b)
    }

    function p()
    {
        var c = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle, a = {}, b, d;
        if (c && c.length && c[0] && c[c[0]])for (var e = c.length; e--;)
        {
            b = c[e];
            if (typeof c[b] == "string")
            {
                d = b.replace(/\-(\w)/g, function (g, h)
                {
                    return h.toUpperCase()
                });
                a[d] = c[b]
            }
        } else for (b in c)if (typeof c[b] === "string")a[b] = c[b];
        return a
    }

    function q(c)
    {
        var a, b;
        for (a in c)
        {
            b = c[a];
            if (b == null || f.isFunction(b) || a in t || /scrollbar/.test(a) || !/color/i.test(a) && isNaN(parseFloat(b)))delete c[a]
        }
        return c
    }

    function u(c, a)
    {
        var b = {_: 0}, d;
        for (d in a)if (c[d] != a[d])b[d] = a[d];
        return b
    }

    function k(c, a, b, d)
    {
        if (typeof c == "object")
        {
            d = a;
            b = null;
            a = c;
            c = a.effect
        }
        if (f.isFunction(a))
        {
            d = a;
            b = null;
            a = {}
        }
        if (typeof a == "number" || f.fx.speeds[a])
        {
            d = b;
            b = a;
            a = {}
        }
        if (f.isFunction(b))
        {
            d = b;
            b = null
        }
        a = a || {};
        b = b || a.duration;
        b = f.fx.off ? 0 : typeof b == "number" ? b : b in f.fx.speeds ? f.fx.speeds[b] : f.fx.speeds._default;
        d = d || a.complete;
        return [c, a, b, d]
    }

    function m(c)
    {
        if (!c || typeof c === "number" || f.fx.speeds[c])return true;
        if (typeof c === "string" && !f.effects[c])return true;
        return false
    }

    f.effects = {};
    f.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderColor", "color", "outlineColor"], function (c, a)
    {
        f.fx.step[a] = function (b)
        {
            if (!b.colorInit)
            {
                b.start = s(b.elem, a);
                b.end = n(b.end);
                b.colorInit = true
            }
            b.elem.style[a] = "rgb(" + Math.max(Math.min(parseInt(b.pos * (b.end[0] - b.start[0]) + b.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[1] - b.start[1]) + b.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(b.pos * (b.end[2] - b.start[2]) + b.start[2], 10), 255), 0) + ")"
        }
    });
    var o = {
        aqua: [0, 255, 255],
        azure: [240, 255, 255],
        beige: [245, 245, 220],
        black: [0, 0, 0],
        blue: [0, 0, 255],
        brown: [165, 42, 42],
        cyan: [0, 255, 255],
        darkblue: [0, 0, 139],
        darkcyan: [0, 139, 139],
        darkgrey: [169, 169, 169],
        darkgreen: [0, 100, 0],
        darkkhaki: [189, 183, 107],
        darkmagenta: [139, 0, 139],
        darkolivegreen: [85, 107, 47],
        darkorange: [255, 140, 0],
        darkorchid: [153, 50, 204],
        darkred: [139, 0, 0],
        darksalmon: [233, 150, 122],
        darkviolet: [148, 0, 211],
        fuchsia: [255, 0, 255],
        gold: [255, 215, 0],
        green: [0, 128, 0],
        indigo: [75, 0, 130],
        khaki: [240, 230, 140],
        lightblue: [173, 216, 230],
        lightcyan: [224, 255, 255],
        lightgreen: [144, 238, 144],
        lightgrey: [211, 211, 211],
        lightpink: [255, 182, 193],
        lightyellow: [255, 255, 224],
        lime: [0, 255, 0],
        magenta: [255, 0, 255],
        maroon: [128, 0, 0],
        navy: [0, 0, 128],
        olive: [128, 128, 0],
        orange: [255, 165, 0],
        pink: [255, 192, 203],
        purple: [128, 0, 128],
        violet: [128, 0, 128],
        red: [255, 0, 0],
        silver: [192, 192, 192],
        white: [255, 255, 255],
        yellow: [255, 255, 0],
        transparent: [255, 255, 255]
    }, r = ["add", "remove", "toggle"], t = {
        border: 1,
        borderBottom: 1,
        borderColor: 1,
        borderLeft: 1,
        borderRight: 1,
        borderTop: 1,
        borderWidth: 1,
        margin: 1,
        padding: 1
    };
    f.effects.animateClass = function (c, a, b, d)
    {
        if (f.isFunction(b))
        {
            d = b;
            b = null
        }
        return this.queue("fx", function ()
        {
            var e = f(this), g = e.attr("style") || " ", h = q(p.call(this)), l, v = e.attr("className");
            f.each(r, function (w, i)
            {
                c[i] && e[i + "Class"](c[i])
            });
            l = q(p.call(this));
            e.attr("className", v);
            e.animate(u(h, l), a, b, function ()
            {
                f.each(r, function (w, i)
                {
                    c[i] && e[i + "Class"](c[i])
                });
                if (typeof e.attr("style") == "object")
                {
                    e.attr("style").cssText = "";
                    e.attr("style").cssText = g
                } else e.attr("style", g);
                d && d.apply(this, arguments)
            });
            h = f.queue(this);
            l = h.splice(h.length - 1, 1)[0];
            h.splice(1, 0, l);
            f.dequeue(this)
        })
    };
    f.fn.extend({
        _addClass: f.fn.addClass, addClass: function (c, a, b, d)
        {
            return a ? f.effects.animateClass.apply(this, [{add: c}, a, b, d]) : this._addClass(c)
        }, _removeClass: f.fn.removeClass, removeClass: function (c, a, b, d)
        {
            return a ? f.effects.animateClass.apply(this, [{remove: c}, a, b, d]) : this._removeClass(c)
        }, _toggleClass: f.fn.toggleClass, toggleClass: function (c, a, b, d, e)
        {
            return typeof a == "boolean" || a === j ? b ? f.effects.animateClass.apply(this, [a ? {add: c} : {remove: c}, b, d, e]) : this._toggleClass(c, a) : f.effects.animateClass.apply(this, [{toggle: c}, a, b, d])
        }, switchClass: function (c, a, b, d, e)
        {
            return f.effects.animateClass.apply(this, [{add: a, remove: c}, b, d, e])
        }
    });
    f.extend(f.effects, {
        version: "1.8.12", save: function (c, a)
        {
            for (var b = 0; b < a.length; b++)a[b] !== null && c.data("ec.storage." + a[b], c[0].style[a[b]])
        }, restore: function (c, a)
        {
            for (var b = 0; b < a.length; b++)a[b] !== null && c.css(a[b], c.data("ec.storage." + a[b]))
        }, setMode: function (c, a)
        {
            if (a == "toggle")a = c.is(":hidden") ? "show" : "hide";
            return a
        }, getBaseline: function (c, a)
        {
            var b;
            switch (c[0])
            {
                case"top":
                    b = 0;
                    break;
                case"middle":
                    b = 0.5;
                    break;
                case"bottom":
                    b = 1;
                    break;
                default:
                    b = c[0] / a.height
            }
            switch (c[1])
            {
                case"left":
                    c = 0;
                    break;
                case"center":
                    c = 0.5;
                    break;
                case"right":
                    c = 1;
                    break;
                default:
                    c = c[1] / a.width
            }
            return {x: c, y: b}
        }, createWrapper: function (c)
        {
            if (c.parent().is(".ui-effects-wrapper"))return c.parent();
            var a = {
                width: c.outerWidth(true),
                height: c.outerHeight(true),
                "float": c.css("float")
            }, b = f("<div></div>").addClass("ui-effects-wrapper").css({
                fontSize: "100%",
                background: "transparent",
                border: "none",
                margin: 0,
                padding: 0
            });
            c.wrap(b);
            b = c.parent();
            if (c.css("position") == "static")
            {
                b.css({position: "relative"});
                c.css({position: "relative"})
            } else
            {
                f.extend(a, {position: c.css("position"), zIndex: c.css("z-index")});
                f.each(["top", "left", "bottom", "right"], function (d, e)
                {
                    a[e] = c.css(e);
                    if (isNaN(parseInt(a[e], 10)))a[e] = "auto"
                });
                c.css({position: "relative", top: 0, left: 0, right: "auto", bottom: "auto"})
            }
            return b.css(a).show()
        }, removeWrapper: function (c)
        {
            if (c.parent().is(".ui-effects-wrapper"))return c.parent().replaceWith(c);
            return c
        }, setTransition: function (c, a, b, d)
        {
            d = d || {};
            f.each(a, function (e, g)
            {
                unit = c.cssUnit(g);
                if (unit[0] > 0)d[g] = unit[0] * b + unit[1]
            });
            return d
        }
    });
    f.fn.extend({
        effect: function (c)
        {
            var a = k.apply(this, arguments), b = {options: a[1], duration: a[2], callback: a[3]};
            a = b.options.mode;
            var d = f.effects[c];
            if (f.fx.off || !d)return a ? this[a](b.duration, b.callback) : this.each(function ()
            {
                b.callback && b.callback.call(this)
            });
            return d.call(this, b)
        }, _show: f.fn.show, show: function (c)
        {
            if (m(c))return this._show.apply(this, arguments); else
            {
                var a = k.apply(this, arguments);
                a[1].mode = "show";
                return this.effect.apply(this, a)
            }
        }, _hide: f.fn.hide, hide: function (c)
        {
            if (m(c))return this._hide.apply(this, arguments); else
            {
                var a = k.apply(this, arguments);
                a[1].mode = "hide";
                return this.effect.apply(this, a)
            }
        }, __toggle: f.fn.toggle, toggle: function (c)
        {
            if (m(c) || typeof c === "boolean" || f.isFunction(c))return this.__toggle.apply(this, arguments); else
            {
                var a = k.apply(this, arguments);
                a[1].mode = "toggle";
                return this.effect.apply(this, a)
            }
        }, cssUnit: function (c)
        {
            var a = this.css(c), b = [];
            f.each(["em", "px", "%", "pt"], function (d, e)
            {
                if (a.indexOf(e) > 0)b = [parseFloat(a), e]
            });
            return b
        }
    });
    f.easing.jswing = f.easing.swing;
    f.extend(f.easing, {
        def: "easeOutQuad", swing: function (c, a, b, d, e)
        {
            return f.easing[f.easing.def](c, a, b, d, e)
        }, easeInQuad: function (c, a, b, d, e)
        {
            return d * (a /= e) * a + b
        }, easeOutQuad: function (c, a, b, d, e)
        {
            return -d * (a /= e) * (a - 2) + b
        }, easeInOutQuad: function (c, a, b, d, e)
        {
            if ((a /= e / 2) < 1)return d / 2 * a * a + b;
            return -d / 2 * (--a * (a - 2) - 1) + b
        }, easeInCubic: function (c, a, b, d, e)
        {
            return d * (a /= e) * a * a + b
        }, easeOutCubic: function (c, a, b, d, e)
        {
            return d * ((a = a / e - 1) * a * a + 1) + b
        }, easeInOutCubic: function (c, a, b, d, e)
        {
            if ((a /= e / 2) < 1)return d / 2 * a * a * a + b;
            return d / 2 * ((a -= 2) * a * a + 2) + b
        }, easeInQuart: function (c, a, b, d, e)
        {
            return d * (a /= e) * a * a * a + b
        }, easeOutQuart: function (c, a, b, d, e)
        {
            return -d * ((a = a / e - 1) * a * a * a - 1) + b
        }, easeInOutQuart: function (c, a, b, d, e)
        {
            if ((a /= e / 2) < 1)return d / 2 * a * a * a * a + b;
            return -d / 2 * ((a -= 2) * a * a * a - 2) + b
        }, easeInQuint: function (c, a, b, d, e)
        {
            return d * (a /= e) * a * a * a * a + b
        }, easeOutQuint: function (c, a, b, d, e)
        {
            return d * ((a = a / e - 1) * a * a * a * a + 1) + b
        }, easeInOutQuint: function (c, a, b, d, e)
        {
            if ((a /= e / 2) < 1)return d / 2 * a * a * a * a * a + b;
            return d / 2 * ((a -= 2) * a * a * a * a + 2) + b
        }, easeInSine: function (c, a, b, d, e)
        {
            return -d * Math.cos(a / e * (Math.PI / 2)) + d + b
        }, easeOutSine: function (c, a, b, d, e)
        {
            return d * Math.sin(a / e * (Math.PI / 2)) + b
        }, easeInOutSine: function (c, a, b, d, e)
        {
            return -d / 2 * (Math.cos(Math.PI * a / e) - 1) + b
        }, easeInExpo: function (c, a, b, d, e)
        {
            return a == 0 ? b : d * Math.pow(2, 10 * (a / e - 1)) + b
        }, easeOutExpo: function (c, a, b, d, e)
        {
            return a == e ? b + d : d * (-Math.pow(2, -10 * a / e) + 1) + b
        }, easeInOutExpo: function (c, a, b, d, e)
        {
            if (a == 0)return b;
            if (a == e)return b + d;
            if ((a /= e / 2) < 1)return d / 2 * Math.pow(2, 10 * (a - 1)) + b;
            return d / 2 * (-Math.pow(2, -10 * --a) + 2) + b
        }, easeInCirc: function (c, a, b, d, e)
        {
            return -d * (Math.sqrt(1 - (a /= e) * a) - 1) + b
        }, easeOutCirc: function (c, a, b, d, e)
        {
            return d * Math.sqrt(1 - (a = a / e - 1) * a) + b
        }, easeInOutCirc: function (c, a, b, d, e)
        {
            if ((a /= e / 2) < 1)return -d / 2 * (Math.sqrt(1 - a * a) - 1) + b;
            return d / 2 * (Math.sqrt(1 - (a -= 2) * a) + 1) + b
        }, easeInElastic: function (c, a, b, d, e)
        {
            c = 1.70158;
            var g = 0, h = d;
            if (a == 0)return b;
            if ((a /= e) == 1)return b + d;
            g || (g = e * 0.3);
            if (h < Math.abs(d))
            {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            return -(h * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g)) + b
        }, easeOutElastic: function (c, a, b, d, e)
        {
            c = 1.70158;
            var g = 0, h = d;
            if (a == 0)return b;
            if ((a /= e) == 1)return b + d;
            g || (g = e * 0.3);
            if (h < Math.abs(d))
            {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
            return h * Math.pow(2, -10 * a) * Math.sin((a * e - c) * 2 * Math.PI / g) + d + b
        }, easeInOutElastic: function (c, a, b, d, e)
        {
            c = 1.70158;
            var g = 0, h = d;
            if (a == 0)return b;
            if ((a /= e / 2) == 2)return b + d;
            g || (g = e * 0.3 * 1.5);
            if (h < Math.abs(d))
            {
                h = d;
                c = g / 4
            } else c = g / (2 * Math.PI) * Math.asin(d /
                    h);
            if (a < 1)return -0.5 * h * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g) + b;
            return h * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * e - c) * 2 * Math.PI / g) * 0.5 + d + b
        }, easeInBack: function (c, a, b, d, e, g)
        {
            if (g == j)g = 1.70158;
            return d * (a /= e) * a * ((g + 1) * a - g) + b
        }, easeOutBack: function (c, a, b, d, e, g)
        {
            if (g == j)g = 1.70158;
            return d * ((a = a / e - 1) * a * ((g + 1) * a + g) + 1) + b
        }, easeInOutBack: function (c, a, b, d, e, g)
        {
            if (g == j)g = 1.70158;
            if ((a /= e / 2) < 1)return d / 2 * a * a * (((g *= 1.525) + 1) * a - g) + b;
            return d / 2 * ((a -= 2) * a * (((g *= 1.525) + 1) * a + g) + 2) + b
        }, easeInBounce: function (c, a, b, d, e)
        {
            return d - f.easing.easeOutBounce(c, e - a, 0, d, e) + b
        }, easeOutBounce: function (c, a, b, d, e)
        {
            return (a /= e) < 1 / 2.75 ? d * 7.5625 * a * a + b : a < 2 / 2.75 ? d * (7.5625 * (a -= 1.5 / 2.75) * a + 0.75) + b : a < 2.5 / 2.75 ? d * (7.5625 * (a -= 2.25 / 2.75) * a + 0.9375) + b : d * (7.5625 * (a -= 2.625 / 2.75) * a + 0.984375) + b
        }, easeInOutBounce: function (c, a, b, d, e)
        {
            if (a < e / 2)return f.easing.easeInBounce(c, a * 2, 0, d, e) * 0.5 + b;
            return f.easing.easeOutBounce(c, a * 2 - e, 0, d, e) * 0.5 + d * 0.5 + b
        }
    })
}(jQuery);
;
/* "/static/js/jquery-1.5.1/jquery.ui.autocomplete.min.js" */
(function ($)
{
    $.widget("ui.autocomplete", {
        options: {minLength: 1, delay: 300}, _create: function ()
        {
            var self = this, doc = this.element[0].ownerDocument;
            this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({
                role: "textbox",
                "aria-autocomplete": "list",
                "aria-haspopup": "true"
            }).bind("keydown.autocomplete", function (event)
            {
                var keyCode = $.ui.keyCode;
                switch (event.keyCode)
                {
                    case keyCode.PAGE_UP:
                        self._move("previousPage", event);
                        break;
                    case keyCode.PAGE_DOWN:
                        self._move("nextPage", event);
                        break;
                    case keyCode.UP:
                        self._move("previous", event);
                        event.preventDefault();
                        break;
                    case keyCode.DOWN:
                        self._move("next", event);
                        event.preventDefault();
                        break;
                    case keyCode.ENTER:
                    case keyCode.NUMPAD_ENTER:
                        if (self.menu.active)
                        {
                            event.preventDefault()
                        }
                    case keyCode.TAB:
                        if (!self.menu.active)
                        {
                            return
                        }
                        self.menu.select(event);
                        break;
                    case keyCode.ESCAPE:
                        self.element.val(self.term);
                        self.close(event);
                        break;
                    case keyCode.LEFT:
                    case keyCode.RIGHT:
                    case keyCode.SHIFT:
                    case keyCode.CONTROL:
                    case keyCode.ALT:
                    case keyCode.COMMAND:
                    case keyCode.COMMAND_RIGHT:
                    case keyCode.INSERT:
                    case keyCode.CAPS_LOCK:
                    case keyCode.END:
                    case keyCode.HOME:
                        break;
                    default:
                        clearTimeout(self.searching);
                        self.searching = setTimeout(function ()
                        {
                            self.search(null, event)
                        }, self.options.delay);
                        break
                }
            }).bind("focus.autocomplete", function ()
            {
                self.selectedItem = null;
                self.previous = self.element.val()
            }).bind("blur.autocomplete", function (event)
            {
                clearTimeout(self.searching);
                self.closing = setTimeout(function ()
                {
                    self.close(event);
                    self._change(event)
                }, 150)
            });
            this._initSource();
            this.response = function ()
            {
                return self._response.apply(self, arguments)
            };
            this.menu = $("<ul></ul>").addClass("ui-autocomplete").appendTo("body", doc).mousedown(function ()
            {
                setTimeout(function ()
                {
                    clearTimeout(self.closing)
                }, 13)
            }).menu({
                focus: function (event, ui)
                {
                    var item = ui.item.data("item.autocomplete");
                    if (false !== self._trigger("focus", null, {item: item}))
                    {
                        if (/^key/.test(event.originalEvent.type))
                        {
                            self.element.val(item.value)
                        }
                    }
                }, selected: function (event, ui)
                {
                    var item = ui.item.data("item.autocomplete");
                    if (false !== self._trigger("select", event, {item: item}))
                    {
                        self.element.val(item.value)
                    }
                    self.close(event);
                    var previous = self.previous;
                    if (self.element[0] !== doc.activeElement)
                    {
                        self.element.focus();
                        self.previous = previous
                    }
                    self.selectedItem = item
                }, blur: function (event, ui)
                {
                    if (self.menu.element.is(":visible"))
                    {
                        self.element.val(self.term)
                    }
                }
            }).zIndex(this.element.zIndex() + 1).css({top: 0, left: 0}).hide().data("menu");
            if ($.fn.bgiframe)
            {
                this.menu.element.bgiframe()
            }
        }, destroy: function ()
        {
            this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup");
            this.menu.element.remove();
            $.Widget.prototype.destroy.call(this)
        }, _setOption: function (key)
        {
            $.Widget.prototype._setOption.apply(this, arguments);
            if (key === "source")
            {
                this._initSource()
            }
        }, _initSource: function ()
        {
            var array, url;
            if ($.isArray(this.options.source))
            {
                array = this.options.source;
                this.source = function (request, response)
                {
                    response($.ui.autocomplete.filter(array, request.term))
                }
            } else if (typeof this.options.source === "string")
            {
                url = this.options.source;
                this.source = function (request, response)
                {
                    $.getJSON(url, request, response)
                }
            } else
            {
                this.source = this.options.source
            }
        }, search: function (value, event)
        {
            value = value != null ? value : this.element.val();
            if (value.length < this.options.minLength)
            {
                return this.close(event)
            }
            clearTimeout(this.closing);
            if (this._trigger("search") === false)
            {
                return
            }
            return this._search(value)
        }, _search: function (value)
        {
            this.term = this.element.addClass("ui-autocomplete-loading").val();
            this.source({term: value}, this.response)
        }, _response: function (content)
        {
            if (content && content.length)
            {
                content = this._normalize(content);
                this._suggest(content);
                this._trigger("open")
            } else
            {
                this.close()
            }
            this.element.removeClass("ui-autocomplete-loading")
        }, close: function (event)
        {
            clearTimeout(this.closing);
            if (this.menu.element.is(":visible"))
            {
                this._trigger("close", event);
                this.menu.element.hide();
                this.menu.deactivate()
            }
        }, _change: function (event)
        {
            if (this.previous !== this.element.val())
            {
                this._trigger("change", event, {item: this.selectedItem})
            }
        }, _normalize: function (items)
        {
            if (items.length && items[0].label && items[0].value)
            {
                return items
            }
            return $.map(items, function (item)
            {
                if (typeof item === "string")
                {
                    return {label: item, value: item}
                }
                return $.extend({label: item.label || item.value, value: item.value || item.label}, item)
            })
        }, _suggest: function (items)
        {
            var ul = this.menu.element.empty().zIndex(this.element.zIndex() + 1), menuWidth, textWidth;
            this._renderMenu(ul, items);
            this.menu.deactivate();
            this.menu.refresh();
            this.menu.element.show().position({my: "left top", at: "left bottom", of: this.element, collision: "none"});
            menuWidth = ul.width("").width();
            textWidth = this.element.width();
            ul.width(Math.max(menuWidth, textWidth))
        }, _renderMenu: function (ul, items)
        {
            var self = this;
            $.each(items, function (index, item)
            {
                self._renderItem(ul, item)
            })
        }, _renderItem: function (ul, item)
        {
            return $("<li></li>").data("item.autocomplete", item).append("<a>" + item.label + "</a>").appendTo(ul)
        }, _move: function (direction, event)
        {
            if (!this.menu.element.is(":visible"))
            {
                this.search(null, event);
                return
            }
            if (this.menu.first() && /^previous/.test(direction) || this.menu.last() && /^next/.test(direction))
            {
                this.element.val(this.term);
                this.menu.deactivate();
                return
            }
            this.menu[direction](event)
        }, widget: function ()
        {
            return this.menu.element
        }
    });
    $.extend($.ui.autocomplete, {
        escapeRegex: function (value)
        {
            return value.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1")
        }, filter: function (array, term)
        {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(term), "i");
            return $.grep(array, function (value)
            {
                return matcher.test(value.label || value.value || value)
            })
        }
    })
}(jQuery));
(function ($)
{
    $.widget("ui.menu", {
        _create: function ()
        {
            var self = this;
            this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({
                role: "listbox",
                "aria-activedescendant": "ui-active-menuitem"
            }).click(function (event)
            {
                if (!$(event.target).closest(".ui-menu-item a").length)
                {
                    return
                }
                event.preventDefault();
                self.select(event)
            });
            this.refresh()
        }, refresh: function ()
        {
            var self = this;
            var items = this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem");
            items.children("a").addClass("ui-corner-all").attr("tabindex", -1).mouseenter(function (event)
            {
                self.activate(event, $(this).parent())
            }).mouseleave(function ()
            {
                self.deactivate()
            })
        }, activate: function (event, item)
        {
            this.deactivate();
            if (this.hasScroll())
            {
                var offset = item.offset().top - this.element.offset().top, scroll = this.element.attr("scrollTop"), elementHeight = this.element.height();
                if (offset < 0)
                {
                    this.element.attr("scrollTop", scroll + offset)
                } else if (offset > elementHeight)
                {
                    this.element.attr("scrollTop", scroll + offset - elementHeight + item.height())
                }
            }
            this.active = item.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end();
            this._trigger("focus", event, {item: item})
        }, deactivate: function ()
        {
            if (!this.active)
            {
                return
            }
            this.active.children("a").removeClass("ui-state-hover").removeAttr("id");
            this._trigger("blur");
            this.active = null
        }, next: function (event)
        {
            this.move("next", ".ui-menu-item:first", event)
        }, previous: function (event)
        {
            this.move("prev", ".ui-menu-item:last", event)
        }, first: function ()
        {
            return this.active && !this.active.prev().length
        }, last: function ()
        {
            return this.active && !this.active.next().length
        }, move: function (direction, edge, event)
        {
            if (!this.active)
            {
                this.activate(event, this.element.children(edge));
                return
            }
            var next = this.active[direction + "All"](".ui-menu-item").eq(0);
            if (next.length)
            {
                this.activate(event, next)
            } else
            {
                this.activate(event, this.element.children(edge))
            }
        }, nextPage: function (event)
        {
            if (this.hasScroll())
            {
                if (!this.active || this.last())
                {
                    this.activate(event, this.element.children(":first"));
                    return
                }
                var base = this.active.offset().top, height = this.element.height(), result = this.element.children("li").filter(function ()
                {
                    var close = $(this).offset().top - base - height + $(this).height();
                    return close < 10 && close > -10
                });
                if (!result.length)
                {
                    result = this.element.children(":last")
                }
                this.activate(event, result)
            } else
            {
                this.activate(event, this.element.children(!this.active || this.last() ? ":first" : ":last"))
            }
        }, previousPage: function (event)
        {
            if (this.hasScroll())
            {
                if (!this.active || this.first())
                {
                    this.activate(event, this.element.children(":last"));
                    return
                }
                var base = this.active.offset().top, height = this.element.height();
                result = this.element.children("li").filter(function ()
                {
                    var close = $(this).offset().top - base + height - $(this).height();
                    return close < 10 && close > -10
                });
                if (!result.length)
                {
                    result = this.element.children(":first")
                }
                this.activate(event, result)
            } else
            {
                this.activate(event, this.element.children(!this.active || this.first() ? ":last" : ":first"))
            }
        }, hasScroll: function ()
        {
            return this.element.height() < this.element.attr("scrollHeight")
        }, select: function (event)
        {
            this._trigger("selected", event, {item: this.active})
        }
    })
}(jQuery));
/* "/static/js/jquery-1.5.1/tooltip/jquery.tooltip.min.js" */
;(function ($)
{
    var helper = {}, current, title, tID, IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent), track = false;
    $.tooltip = {
        blocked: false,
        defaults: {
            style: "yellow",
            delay: 200,
            fade: false,
            showURL: false,
            extraClass: "",
            top: 15,
            left: 15,
            id: "tooltip",
            track: true
        },
        block: function ()
        {
            $.tooltip.blocked = !$.tooltip.blocked
        }
    };
    $.fn.extend({
        tooltip: function (settings)
        {
            settings = $.extend({}, $.tooltip.defaults, settings);
            createHelper(settings);
            return this.each(function ()
            {
                $.data(this, "tooltip", settings);
                this.tOpacity = helper.parent.css("opacity");
                this.tooltipText = this.title;
                $(this).removeAttr("title");
                this.alt = ""
            }).mouseover(save).mouseout(hide).click(hide)
        }, fixPNG: IE ? function ()
        {
            return this.each(function ()
            {
                var image = $(this).css('backgroundImage');
                if (image.match(/^url\(["']?(.*\.png)["']?\)$/i))
                {
                    image = RegExp.$1;
                    $(this).css({
                        'backgroundImage': 'none',
                        'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
                    }).each(function ()
                    {
                        var position = $(this).css('position');
                        if (position != 'absolute' && position != 'relative')$(this).css('position', 'relative')
                    })
                }
            })
        } : function ()
        {
            return this
        }, unfixPNG: IE ? function ()
        {
            return this.each(function ()
            {
                $(this).css({'filter': '', backgroundImage: ''})
            })
        } : function ()
        {
            return this
        }, hideWhenEmpty: function ()
        {
            return this.each(function ()
            {
                $(this)[$(this).html() ? "show" : "hide"]()
            })
        }, url: function ()
        {
            return this.attr('href') || this.attr('src')
        }
    });
    function createHelper(settings)
    {
        if (helper.parent)return;
        helper.parent = $('<div id="' + settings.id + '" class="' + settings.style + '"><h3></h3><div class="body"></div><div class="url"></div></div>').appendTo(document.body).hide();
        if ($.fn.bgiframe)helper.parent.bgiframe();
        helper.title = $('h3', helper.parent);
        helper.body = $('div.body', helper.parent);
        helper.url = $('div.url', helper.parent)
    }

    function settings(element)
    {
        return $.data(element, "tooltip")
    }

    function handle(event)
    {
        if (settings(this).delay)tID = setTimeout(show, settings(this).delay); else show();
        track = !!settings(this).track;
        $(document.body).bind('mousemove', update);
        update(event)
    }

    function save()
    {
        if ($.tooltip.blocked || this == current || (!this.tooltipText && !settings(this).bodyHandler))return;
        current = this;
        title = this.tooltipText;
        if (settings(this).bodyHandler)
        {
            helper.title.hide();
            var bodyContent = settings(this).bodyHandler.call(this);
            if (bodyContent.nodeType || bodyContent.jquery)
            {
                helper.body.empty().append(bodyContent)
            } else
            {
                helper.body.html(bodyContent)
            }
            helper.body.show()
        } else if (settings(this).showBody)
        {
            var parts = title.split(settings(this).showBody);
            helper.title.html(parts.shift()).show();
            helper.body.empty();
            for (var i = 0, part; (part = parts[i]); i++)
            {
                if (i > 0)helper.body.append("<br/>");
                helper.body.append(part)
            }
            helper.body.hideWhenEmpty()
        } else
        {
            helper.title.html(title).show();
            helper.body.hide()
        }
        if (settings(this).showURL && $(this).url())helper.url.html($(this).url().replace('http://', '')).show(); else helper.url.hide();
        helper.parent.addClass(settings(this).extraClass);
        if (settings(this).fixPNG)helper.parent.fixPNG();
        handle.apply(this, arguments)
    }

    function show()
    {
        tID = null;
        if ((!IE || !$.fn.bgiframe) && settings(current).fade)
        {
            if (helper.parent.is(":animated"))helper.parent.stop().show().fadeTo(settings(current).fade, current.tOpacity); else helper.parent.is(':visible') ? helper.parent.fadeTo(settings(current).fade, current.tOpacity) : helper.parent.fadeIn(settings(current).fade)
        } else
        {
            helper.parent.show()
        }
        update()
    }

    function update(event)
    {
        if ($.tooltip.blocked)return;
        if (event && event.target.tagName == "OPTION")
        {
            return
        }
        if (!track && helper.parent.is(":visible"))
        {
            $(document.body).unbind('mousemove', update)
        }
        if (current == null)
        {
            $(document.body).unbind('mousemove', update);
            return
        }
        helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
        var left = helper.parent[0].offsetLeft;
        var top = helper.parent[0].offsetTop;
        if (event)
        {
            left = event.pageX + settings(current).left;
            top = event.pageY + settings(current).top;
            var right = 'auto';
            if (settings(current).positionLeft)
            {
                right = $(window).width() - left;
                left = 'auto'
            }
            helper.parent.css({left: left, right: right, top: top})
        }
        var v = viewport(), h = helper.parent[0];
        if (v.x + v.cx < h.offsetLeft + h.offsetWidth)
        {
            left -= h.offsetWidth + 20 + settings(current).left;
            helper.parent.css({left: left + 'px'}).addClass("viewport-right")
        }
        if (v.y + v.cy < h.offsetTop + h.offsetHeight)
        {
            top -= h.offsetHeight + 20 + settings(current).top;
            helper.parent.css({top: top + 'px'}).addClass("viewport-bottom")
        }
    }

    function viewport()
    {
        return {x: $(window).scrollLeft(), y: $(window).scrollTop(), cx: $(window).width(), cy: $(window).height()}
    }

    function hide(event)
    {
        if ($.tooltip.blocked)return;
        if (tID)clearTimeout(tID);
        current = null;
        var tsettings = settings(this);

        function complete()
        {
            helper.parent.removeClass(tsettings.extraClass).hide().css("opacity", "")
        }

        if ((!IE || !$.fn.bgiframe) && tsettings.fade)
        {
            if (helper.parent.is(':animated'))helper.parent.stop().fadeTo(tsettings.fade, 0, complete); else helper.parent.stop().fadeOut(tsettings.fade, complete)
        } else complete();
        if (settings(this).fixPNG)helper.parent.unfixPNG()
    }

    $.extend({
        showTip: function (content)
        {
            var tip = $("<div></div>");
            tip.addClass("tip").html(content).appendTo("body");
            var myleft = ($("body").width() - tip.width()) / 2 + $("body").attr("scrollLeft");
            var mytop = ($("body").height() - tip.height()) / 3 + $("body").attr("scrollTop");
            tip.css("left", myleft).css("top", mytop).fadeIn("slow");
            window.setTimeout(function ()
            {
                tip.fadeOut(1000)
            }, 1000);
            window.setTimeout(function ()
            {
                tip.remove()
            }, 2000)
        }
    })
})(jQuery);
/* "/static/js/jquery-1.5.1/jsrender/jsrender.gbk.min.js" */
(function (n, t, i)
{
    "use strict";
    function it(n, t)
    {
        t && t.onError && t.onError(n) === !1 || (this.name = "JsRender Error", this.message = n || "JsRender error")
    }

    function o(n, t)
    {
        var i;
        n = n || {};
        for (i in t)n[i] = t[i];
        return n
    }

    function ct(n, t, i)
    {
        return (!k.rTag || arguments.length) && (a = n ? n.charAt(0) : a, v = n ? n.charAt(1) : v, f = t ? t.charAt(0) : f, h = t ? t.charAt(1) : h, w = i || w, n = "\\" + a + "(\\" + w + ")?\\" + v, t = "\\" + f + "\\" + h, l = "(?:(?:(\\w+(?=[\\/\\s\\" + f + "]))|(?:(\\w+)?(:)|(>)|!--((?:[^-]|-(?!-))*)--|(\\*)))\\s*((?:[^\\" + f + "]|\\" + f + "(?!\\" + h + "))*?)", k.rTag = l + ")", l = new RegExp(n + l + "(\\/)?|(?:\\/(\\w+)))" + t, "g"), et = new RegExp("<.*>|([^\\\\]|^)[{}]|" + n + ".*" + t)), [a, v, f, h, w]
    }

    function ei(n, t)
    {
        t || (t = n, n = i);
        var e, f, o, u, r = this, s = !t || t === "root";
        if (n)
        {
            if (u = r.type === t ? r : i, !u)if (e = r.views, r._.useKey)
            {
                for (f in e)if (u = e[f].get(n, t))break
            } else for (f = 0, o = e.length; !u && f < o; f++)u = e[f].get(n, t)
        } else if (s)while (r.parent.parent)u = r = r.parent; else while (r && !u)u = r.type === t ? r : i, r = r.parent;
        return u
    }

    function lt()
    {
        var n = this.get("item");
        return n ? n.index : i
    }

    function oi(n, t)
    {
        var u, f = this, r = t && t[n] || (f.ctx || {})[n];
        return r = r === i ? f.getRsc("helpers", n) : r, r && typeof r == "function" && (u = function ()
        {
            return r.apply(f, arguments)
        }, o(u, r)), u || r
    }

    function si(n, t, u)
    {
        var h, f, o, e = +u === u && u, s = t.linkCtx;
        return e && (u = (e = t.tmpl.bnds[e - 1])(t.data, t, r)), o = u.args[0], (n || e) && (f = s && s.tag || {
                _: {inline: !s},
                tagName: n + ":",
                flow: !0,
                _is: "tag"
            }, f._.bnd = e, s && (s.tag = f, u.ctx = c(u.ctx, s.view.ctx)), f.tagCtx = u, u.view = t, f.ctx = u.ctx || {}, delete u.ctx, t._.tag = f, n = n !== "true" && n, n && ((h = t.getRsc("converters", n)) || p("Unknown converter: {{" + n + ":")) && (f.depends = h.depends, o = h.apply(f, u.args)), o = e && t._.onRender ? t._.onRender(o, t, e) : o, t._.tag = i), o
    }

    function hi(n, t)
    {
        for (var e = this, u = r[n], f = u && u[t]; f === i && e;)u = e.tmpl[n], f = u && u[t], e = e.parent;
        return f
    }

    function ci(n, t, u, f)
    {
        var ft, s, et, nt, k, l, tt, it, h, d, y, ot, v, ut, w = "", g = +f === f && f, a = t.linkCtx || 0, b = t.ctx, st = u || t.tmpl, ht = t._;
        for (n._is === "tag" && (s = n, n = s.tagName), g && (f = (ot = st.bnds[g - 1])(t.data, t, r)), tt = f.length, s = s || a.tag, l = 0; l < tt; l++)h = f[l], y = h.tmpl, y = h.content = y && st.tmpls[y - 1], u = h.props.tmpl, l || u && s || (v = t.getRsc("tags", n) || p("Unknown tag: {{" + n + "}}")), u = u || (s ? s : v).template || y, u = "" + u === u ? t.getRsc("templates", u) || e(u) : u, o(h, {
            tmpl: u,
            render: rt,
            index: l,
            view: t,
            ctx: c(h.ctx, b)
        }), s || (v._ctr ? (s = new v._ctr, ut = !!s.init, s.attr = s.attr || v.attr || i) : s = {render: v.render}, s._ = {inline: !a}, a && (a.attr = s.attr = a.attr || s.attr, a.tag = s, s.linkCtx = a), (s._.bnd = ot || a) && (s._.arrVws = {}), s.tagName = n, s.parent = k = b && b.tag, s._is = "tag", s._def = v), ht.tag = s, h.tag = s, s.tagCtxs = f, s.flow || (d = h.ctx = h.ctx || {}, et = s.parents = d.parentTags = b && c(d.parentTags, b.parentTags) || {}, k && (et[k.tagName] = k), d.tag = s);
        for (s.rendering = {}, l = 0; l < tt; l++)h = s.tagCtx = f[l], s.ctx = h.ctx, !l && ut && (s.init(h, a, s.ctx), ut = i), (ft = s.render) && (it = ft.apply(s, h.args)), w += it !== i ? it : h.tmpl ? h.render() : "";
        return delete s.rendering, s.tagCtx = s.tagCtxs[0], s.ctx = s.tagCtx.ctx, s._.inline && (nt = s.attr) && nt !== "html" && (w = nt === "text" ? wt.html(w) : ""), g && t._.onRender ? t._.onRender(w, t, g) : w
    }

    function b(n, t, r, u, f, e, o, s)
    {
        var c, l, a, y = t === "array", v = {
            key: 0,
            useKey: y ? 0 : 1,
            id: "" + fi++,
            onRender: s,
            bnds: {}
        }, h = {
            data: u,
            tmpl: f,
            content: o,
            views: y ? [] : {},
            parent: r,
            ctx: n,
            type: t,
            get: ei,
            getIndex: lt,
            getRsc: hi,
            hlp: oi,
            _: v,
            _is: "view"
        };
        return r && (c = r.views, l = r._, l.useKey ? (c[v.key = "_" + l.useKey++] = h, a = l.tag, v.bnd = y && (!a || !!a._.bnd && a)) : c.splice(v.key = h.index = e !== i ? e : c.length, 0, h), h.ctx = n || r.ctx), h
    }

    function li(n)
    {
        var t, i, r, u, f;
        for (t in y)if (u = y[t], (f = u.compile) && (i = n[t + "s"]))for (r in i)i[r] = f(r, i[r], n, t, u)
    }

    function ai(n, t, i)
    {
        var u, r;
        return typeof t == "function" ? t = {
            depends: t.depends,
            render: t
        } : ((r = t.template) && (t.template = "" + r === r ? e[r] || e(r) : r), t.init !== !1 && (u = t._ctr = function ()
        {
        }, (u.prototype = t).constructor = u)), i && (t._parentTmpl = i), t
    }

    function at(r, u, f, o, s, h)
    {
        function v(i)
        {
            if ("" + i === i || i.nodeType > 0)
            {
                try
                {
                    a = i.nodeType > 0 ? i : !et.test(i) && t && t(n.document).find(i)[0]
                } catch (u)
                {
                }
                return a && (i = a.getAttribute(ht), r = r || i, i = e[i], i || (r = r || "_" + ui++, a.setAttribute(ht, r), i = e[r] = at(r, a.innerHTML, f, o, s, h))), i
            }
        }

        var l, a;
        return u = u || "", l = v(u), h = h || (u.markup ? u : {}), h.tmplName = r, f && (h._parentTmpl = f), !l && u.markup && (l = v(u.markup)) && l.fn && (l.debug !== u.debug || l.allowCode !== u.allowCode) && (l = l.markup), l !== i ? (r && !f && (tt[r] = function ()
        {
            return u.render.apply(u, arguments)
        }), l.fn || u.fn ? l.fn && (u = r && r !== l.tmplName ? c(h, l) : l) : (u = vt(l, h), ut(l, u)), li(h), u) : void 0
    }

    function vt(n, t)
    {
        var i, f = d.wrapMap || {}, r = o({
            markup: n,
            tmpls: [],
            links: {},
            tags: {},
            bnds: [],
            _is: "template",
            render: rt
        }, t);
        return t.htmlTag || (i = ii.exec(n), r.htmlTag = i ? i[1].toLowerCase() : ""), i = f[r.htmlTag], i && i !== f.div && (r.markup = u.trim(r.markup), r._elCnt = !0), r
    }

    function vi(n, t)
    {
        function u(e, o, s)
        {
            var l, h, a, c;
            if (e && "" + e !== e && !e.nodeType && !e.markup)
            {
                for (a in e)u(a, e[a], o);
                return r
            }
            return o === i && (o = e, e = i), e && "" + e !== e && (s = o, o = e, e = i), c = s ? s[f] = s[f] || {} : u, h = t.compile, (l = k.onBeforeStoreItem) && (h = l(c, e, o, h) || h), e ? o === null ? delete c[e] : c[e] = h ? o = h(e, o, s, n, t) : o : o = h(i, o), h && o && (o._is = n), (l = k.onStoreItem) && l(c, e, o, h), o
        }

        var f = n + "s";
        r[f] = u, y[n] = t
    }

    function rt(n, t, f, o, s, h)
    {
        var w, ut, nt, v, tt, it, rt, k, y, ft, d, et, a, l = this, ot = !l.attr || l.attr === "html", g = "";
        if (o === !0 && (rt = !0, o = 0), l.tag ? (k = l, l = l.tag, ft = l._, et = l.tagName, a = k.tmpl, t = c(t, l.ctx), y = k.content, k.props.link === !1 && (t = t || {}, t.link = !1), f = f || k.view, n = n === i ? f : n) : a = l.jquery && (l[0] || p('Unknown template: "' + l.selector + '"')) || l, a && (!f && n && n._is === "view" && (f = n), f && (y = y || f.content, h = h || f._.onRender, n === f && (n = f.data, s = !0), t = c(t, f.ctx)), f && f.data !== i || ((t = t || {}).root = n), a.fn || (a = e[a] || e(a)), a))
        {
            if (h = (t && t.link) !== !1 && ot && h, d = h, h === !0 && (d = i, h = f._.onRender), u.isArray(n) && !s)for (v = rt ? f : o !== i && f || b(t, "array", f, n, a, o, y, h), w = 0, ut = n.length; w < ut; w++)nt = n[w], tt = b(t, "item", v, nt, a, (o || 0) + w, y, h), it = a.fn(nt, tt, r), g += v._.onRender ? v._.onRender(it, tt) : it; else v = rt ? f : b(t, et || "data", f, n, a, o, y, h), ft && !l.flow && (v.tag = l), g += a.fn(n, v, r);
            return d ? d(g, v) : g
        }
        return ""
    }

    function p(n)
    {
        throw new r.sub.Error(n);
    }

    function s(n)
    {
        p("Syntax error\n" + n)
    }

    function ut(n, t, i, r)
    {
        function v(t)
        {
            t -= f, t && h.push(n.substr(f, t).replace(nt, "\\n"))
        }

        function c(t)
        {
            t && s('Unmatched or missing tag: "{{/' + t + '}}" in template:\n' + n)
        }

        function y(e, l, y, w, b, k, d, g, tt, it, rt, ut)
        {
            k && (b = ":", w = "html"), it = it || i;
            var at, st, ht = l && [], ot = "", et = "", ct = "", lt = !it && !b && !d;
            y = y || b, v(ut), f = ut + e.length, g ? p && h.push(["*", "\n" + tt.replace(dt, "$1") + "\n"]) : y ? (y === "else" && (ti.test(tt) && s('for "{{else if expr}}" use "{{else expr}}"'), ht = u[6], u[7] = n.substring(u[7], ut), u = o.pop(), h = u[3], lt = !0), tt && (tt = tt.replace(nt, " "), ot = ft(tt, ht, t).replace(ni, function (n, t, i)
            {
                return t ? ct += i + "," : et += i + ",", ""
            })), et = et.slice(0, -1), ot = ot.slice(0, -1), at = et && et.indexOf("noerror:true") + 1 && et || "", a = [y, w || !!r || "", ot, lt && [], 'params:"' + tt + '",props:{' + et + "}" + (ct ? ",ctx:{" + ct.slice(0, -1) + "}" : ""), at, ht || 0], h.push(a), lt && (o.push(u), u = a, u[7] = f)) : rt && (st = u[0], c(rt !== st && st !== "else" && rt), u[7] = n.substring(u[7], ut), u = o.pop()), c(!u && rt), h = u[3]
        }

        var a, p = t && t.allowCode, e = [], f = 0, o = [], h = e, u = [, , , e];
        return n = n.replace(gt, "\\$&"), c(o[0] && o[0][3].pop()[0]), n.replace(l, y), v(n.length), (f = e[e.length - 1]) && c("" + f !== f && +f[7] === f[7] && f[0]), yt(e, i ? n : t, i)
    }

    function yt(n, i, r)
    {
        var c, f, e, l, a, y, st, ht, ct, lt, ft, p, o, et, v, tt, w, it, at, b, pt, wt, ot, rt, k, h = 0, u = "", g = "", ut = {}, bt = n.length;
        for ("" + i === i ? (v = r ? 'data-link="' + i.replace(nt, " ").slice(1, -1) + '"' : i, i = 0) : (v = i.tmplName || "unnamed", i.allowCode && (ut.allowCode = !0), i.debug && (ut.debug = !0), p = i.bnds, et = i.tmpls), c = 0; c < bt; c++)if (f = n[c], "" + f === f)u += '\nret+="' + f + '";'; else if (e = f[0], e === "*")u += "" + f[1]; else
        {
            if (l = f[1], a = f[2], it = f[3], y = f[4], g = f[5], at = f[7], (wt = e === "else") || (h = 0, p && (o = f[6]) && (h = p.push(o))), (ot = e === ":") ? (l && (e = l === "html" ? ">" : l + e), g && (rt = "prm" + c, g = "try{var " + rt + "=[" + a + "][0];}catch(e){" + rt + '="";}\n', a = rt)) : (it && (tt = vt(at, ut), tt.tmplName = v + "/" + e, yt(it, tt), et.push(tt)), wt || (w = e, pt = u, u = ""), b = n[c + 1], b = b && b[0] === "else"), y += ",args:[" + a + "]}", ot && o || l && e !== ">")
            {
                if (k = new Function("data,view,j,u", " // " + v + " " + h + " " + e + "\n" + g + "return {" + y + ";"), k.paths = o, k._ctxs = e, r)return k;
                ft = 1
            }
            if (u += ot ? "\n" + (o ? "" : g) + (r ? "return " : "ret+=") + (ft ? (ft = 0, lt = !0, 'c("' + l + '",view,' + (o ? (p[h - 1] = k, h) : "{" + y) + ");") : e === ">" ? (ht = !0, "h(" + a + ");") : (ct = !0, "(v=" + a + ")!=" + (r ? "=" : "") + 'u?v:"";')) : (st = !0, "{tmpl:" + (it ? et.length : "0") + "," + y + ","), w && !b)
            {
                if (u = "[" + u.slice(0, -1) + "]", (r || o) && (u = new Function("data,view,j,u", " // " + v + " " + h + " " + w + "\nreturn " + u + ";"), o && ((p[h - 1] = u).paths = o), u._ctxs = e, r))return u;
                u = pt + '\nret+=t("' + w + '",view,this,' + (h || u) + ");", o = 0, w = 0
            }
        }
        u = "// " + v + "\nvar j=j||" + (t ? "jQuery." : "js") + "views" + (ct ? ",v" : "") + (st ? ",t=j._tag" : "") + (lt ? ",c=j._cnvt" : "") + (ht ? ",h=j.converters.html" : "") + (r ? ";\n" : ',ret="";\n') + (d.tryCatch ? "try{\n" : "") + (ut.debug ? "debugger;" : "") + u + (r ? "\n" : "\nreturn ret;\n") + (d.tryCatch ? "\n}catch(e){return j._err(e);}" : "");
        try
        {
            u = new Function("data,view,j,u", u)
        } catch (kt)
        {
            s("Compiled template code:\n\n" + u, kt)
        }
        return i && (i.fn = u), u
    }

    function ft(n, t, i)
    {
        function b(b, k, d, g, nt, tt, it, rt, et, ot, st, ht, ct, lt, at, vt, yt, pt, wt, kt)
        {
            function gt(n, i, r, f, o, s, h)
            {
                if (i && (t && (u === "linkTo" && (e = t.to = t.to || [], e.push(nt)), (!u || l) && t.push(nt)), i !== "."))
                {
                    var c = (r ? 'view.hlp("' + r + '")' : f ? "view" : "data") + (h ? (o ? "." + o : r ? "" : f ? "" : "." + i) + (s || "") : (h = r ? "" : f ? o || "" : i, ""));
                    return c = c + (h ? "." + h : ""), c.slice(0, 9) === "view.data" ? c.slice(5) : c
                }
                return n
            }

            var dt;
            if (tt = tt || "", d = d || k || ht, nt = nt || et, ot = ot || yt || "", it)s(n); else return t && vt && !c && !o && (!u || l || e) && (dt = p[r], kt.length - 2 > wt - dt && (dt = kt.slice(dt, wt + 1), vt = v + ":" + dt + f, vt = w[vt] = w[vt] || ut(a + vt + h, i, !0), vt.paths || ft(dt, vt.paths = [], i), (e || t).push({_jsvOb: vt}))), c ? (c = !ct, c ? b : '"') : o ? (o = !lt, o ? b : '"') : (d ? (r++, p[r] = wt++, d) : "") + (pt ? r ? "" : u ? (u = l = e = !1, "\b") : "," : rt ? (r && s(n), u = nt, l = g, "\b" + nt + ":") : nt ? nt.split("^").join(".").replace(bt, gt) + (ot ? (y[++r] = !0, nt.charAt(0) !== "." && (p[r] = wt), ot) : tt) : tt ? tt : at ? (y[r--] = !1, at) + (ot ? (y[++r] = !0, ot) : "") : st ? (y[r] || s(n), ",") : k ? "" : (c = ct, o = lt, '"'))
        }

        var u, e, l, w = i.links, y = {}, p = {0: -1}, r = 0, o = !1, c = !1;
        return (n + " ").replace(kt, b)
    }

    function c(n, t)
    {
        return n && n !== t ? t ? o(o({}, t), n) : n : t && o({}, t)
    }

    function pt(n)
    {
        return st[n] || (st[n] = "&#" + n.charCodeAt(0) + ";")
    }

    if ((!t || !t.views) && !n.jsviews)
    {
        var u, g, l, et, a = "{", v = "{", f = "}", h = "}", w = "^", bt = /^(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g, kt = /(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)([#~]?[\w$.^]+)?\s*((\+\+|--)|\+|-|&&|\|\||===|!==|==|!=|<=|>=|[<>%*!:?\/]|(=))\s*|([#~]?[\w$.^]+)([([])?)|(,\s*)|(\(?)\\?(?:(')|("))|(?:\s*(([)\]])(?=\s*\.|\s*\^)|[)\]])([([]?))|(\s+)/g, nt = /[ \t]*(\r\n|\n|\r)/g, dt = /\\(['"])/g, gt = /['"\\]/g, ni = /\x08(~)?([^\x08]+)\x08/g, ti = /^if\s/, ii = /<(\w+)[>\s]/, ot = /[\x00`><"'&]/g, ri = ot, ui = 0, fi = 0, st = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "\x00": "&#0;",
            "'": "&#39;",
            '"': "&#34;",
            "`": "&#96;"
        }, ht = "data-jsv-tmpl", tt = {}, y = {
            template: {compile: at},
            tag: {compile: ai},
            helper: {},
            converter: {}
        }, r = {
            jsviews: "v1.0.0-beta",
            render: tt,
            settings: {delimiters: ct, debugMode: !0, tryCatch: !0},
            sub: {View: b, Error: it, tmplFn: ut, parse: ft, extend: o, error: p, syntaxError: s},
            _cnvt: si,
            _tag: ci,
            _err: function (n)
            {
                return d.debugMode ? "Error: " + (n.message || n) + ". " : ""
            }
        };
        (it.prototype = new Error).constructor = it, lt.depends = function ()
        {
            return [this.get("item"), "index"]
        };
        for (g in y)vi(g, y[g]);
        var e = r.templates, wt = r.converters, pi = r.helpers, yi = r.tags, k = r.sub, d = r.settings;
        t ? (u = t, u.fn.render = rt) : (u = n.jsviews = {}, u.isArray = Array && Array.isArray || function (n)
            {
                return Object.prototype.toString.call(n) === "[object Array]"
            }), u.render = tt, u.views = r, u.templates = e = r.templates, yi({
            "else": function ()
            {
            }, "if": {
                render: function (n)
                {
                    var t = this;
                    return t.rendering.done || !n && (arguments.length || !t.tagCtx.index) ? "" : (t.rendering.done = !0, t.selected = t.tagCtx.index, t.tagCtx.render())
                }, onUpdate: function (n, t, i)
                {
                    for (var r, f, u = 0; (r = this.tagCtxs[u]) && r.args.length; u++)if (r = r.args[0], f = !r != !i[u].args[0], !!r || f)return f;
                    return !1
                }, flow: !0
            }, "for": {
                render: function (n)
                {
                    var t = this, f = t.tagCtx, e = !arguments.length, r = "", o = e || 0;
                    return t.rendering.done || (e ? r = i : n !== i && (r += f.render(n), o += u.isArray(n) ? n.length : 1), (t.rendering.done = o) && (t.selected = f.index)), r
                }, onArrayChange: function (n, t)
                {
                    var i, u = this, r = t.change;
                    if (this.tagCtxs[1] && (r === "insert" && n.target.length === t.items.length || r === "remove" && !n.target.length || r === "refresh" && !t.oldItems.length != !n.target.length))this.refresh(); else for (i in u._.arrVws)i = u._.arrVws[i], i.data === n.target && i._.onArrayChange.apply(i, arguments);
                    n.done = !0
                }, flow: !0
            }, include: {flow: !0}, "*": {
                render: function (n)
                {
                    return n
                }, flow: !0
            }
        }), wt({
            html: function (n)
            {
                return n != i ? String(n).replace(ri, pt) : ""
            }, attr: function (n)
            {
                return n != i ? String(n).replace(ot, pt) : n === null ? null : ""
            }, url: function (n)
            {
                return n != i ? encodeURI(String(n)) : n === null ? null : ""
            }
        }), ct()
    }
})(this, this.jQuery);
//@ sourceMappingURL=jsrender.min.js.map
/* "/static/js/jquery-1.5.1/jquery.tipsy/jquery.tipsy.js" */
(function ($)
{
    function fixTitle($ele)
    {
        if ($ele.attr('title') || typeof($ele.attr('original-title')) != 'string')
        {
            $ele.attr('original-title', $ele.attr('title') || '').removeAttr('title');
        }
    }

    function Tipsy(element, options)
    {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        fixTitle(this.$element);
    }

    Tipsy.prototype = {
        show: function ()
        {
            var title = this.getTitle();
            if (title && this.enabled)
            {
                var $tip = this.tip();
                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy';
                $tip.remove().css({
                    top: 0,
                    left: 0,
                    visibility: 'hidden',
                    display: 'block'
                }).appendTo(this.options.container);
                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });
                var actualWidth = $tip[0].offsetWidth, actualHeight = $tip[0].offsetHeight;
                var gravity = (typeof this.options.gravity == 'function') ? this.options.gravity.call(this.$element[0]) : this.options.gravity;
                var tp;
                switch (gravity.charAt(0))
                {
                    case'n':
                        tp = {
                            top: pos.top + pos.height + this.options.offset,
                            left: pos.left + pos.width / 2 - actualWidth / 2
                        };
                        break;
                    case's':
                        tp = {
                            top: pos.top - actualHeight - this.options.offset,
                            left: pos.left + pos.width / 2 - actualWidth / 2
                        };
                        break;
                    case'e':
                        tp = {
                            top: pos.top + pos.height / 2 - actualHeight / 2,
                            left: pos.left - actualWidth - this.options.offset
                        };
                        break;
                    case'w':
                        tp = {
                            top: pos.top + pos.height / 2 - actualHeight / 2,
                            left: pos.left + pos.width + this.options.offset
                        };
                        break;
                }
                if (gravity.length == 2)
                {
                    if (gravity.charAt(1) == 'w')
                    {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else
                    {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }
                tp = $.isFunction(this.options.fixPos) ? this.options.fixPos(tp) : tp;
                $tip.css(tp).addClass('tipsy-' + gravity);
                if (this.options.fade)
                {
                    $tip.stop().css({
                        opacity: 0,
                        display: 'block',
                        visibility: 'visible'
                    }).animate({opacity: this.options.opacity});
                } else
                {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        }, hide: function ()
        {
            if (this.options.fade)
            {
                this.tip().stop().fadeOut(function ()
                {
                    $(this).remove();
                });
            } else
            {
                this.tip().remove();
            }
        }, getTitle: function ()
        {
            var title, $e = this.$element, o = this.options;
            fixTitle($e);
            var title, o = this.options;
            if (typeof o.title == 'string')
            {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function')
            {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        }, tip: function ()
        {
            if (!this.$tip)
            {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"/></div>');
            }
            return this.$tip;
        }, validate: function ()
        {
            if (!this.$element[0].parentNode)
            {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        }, enable: function ()
        {
            this.enabled = true;
        }, disable: function ()
        {
            this.enabled = false;
        }, toggleEnabled: function ()
        {
            this.enabled = !this.enabled;
        }
    };
    $.fn.tipsy = function (options)
    {
        if (options === true)
        {
            return this.data('tipsy');
        } else if (typeof options == 'string')
        {
            return this.data('tipsy')[options]();
        }
        options = $.extend({}, $.fn.tipsy.defaults, options);
        function get(ele)
        {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy)
            {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }

        function enter()
        {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0)
            {
                tipsy.show();
            } else
            {
                setTimeout(function ()
                {
                    if (tipsy.hoverState == 'in')tipsy.show();
                }, options.delayIn);
            }
        };
        function leave()
        {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0)
            {
                tipsy.hide();
            } else
            {
                setTimeout(function ()
                {
                    if (tipsy.hoverState == 'out')tipsy.hide();
                }, options.delayOut);
            }
        };
        if (!options.live)this.each(function ()
        {
            get(this);
        });
        if (options.trigger != 'manual')
        {
            var binder = options.live ? 'live' : 'bind', eventIn = options.trigger == 'hover' ? 'mouseenter' : 'focus', eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }
        return this;
    };
    $.fn.tipsy.defaults = {
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 1,
        title: 'title',
        trigger: 'hover',
        container: 'body'
    };
    $.fn.tipsy.elementOptions = function (ele, options)
    {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };
    $.fn.tipsy.autoNS = function ()
    {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };
    $.fn.tipsy.autoWE = function ()
    {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };
})(jQuery);
/* "/static/js/dialog.js" */
var $ = function (id)
{
    return document.getElementById(id);
};
function ShowDialog(id, vTopOffset)
{
    if (typeof arguments[1] == "undefined")
        vTopOffset = 90;
    var bb = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
    $("overlay").style.width = Math.max(parseInt(bb.scrollWidth), parseInt(bb.offsetWidth)) + "px";
    $("overlay").style.height = Math.max(parseInt(bb.scrollHeight), parseInt(bb.offsetHeight)) + "px";
    $("overlay").style.display = 'block';
    $(id).style.display = 'block';
    $(id).style.left = ((bb.offsetWidth - $(id).offsetWidth) / 2) + "px";
    $(id).style.top = (vTopOffset + bb.scrollTop) + "px";
}
function HideDialog(id)
{
    $("overlay").style.display = 'none';
    $(id).style.display = 'none';
}
function ShowOutPage(id)
{
    $(id).style.display = 'block';
}
function HideOutPage(id)
{
    $(id).style.display = 'none';
}
/* "/static/js/mouse_mon.js" */
var $ = function (id)
{
    return document.getElementById(id);
};
var userAgent = navigator.userAgent.toLowerCase();
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var ua_match = /(trident)(?:.*rv:([\w.]+))?/.exec(userAgent) || /(msie) ([\w.]+)/.exec(userAgent);
var is_ie = ua_match && (ua_match[1] == 'trident' || ua_match[1] == 'msie') ? true : false;
var mouse_is_out = true;
function moue_over()
{
    mouse_is_out = false;
}
function moue_out()
{
    mouse_is_out = true;
}
function attachBody()
{
    if (window.attachEvent)
    {
        document.body.attachEvent("onmouseover", moue_over);
        document.body.attachEvent("onmouseout", moue_out);
    }
    else
    {
        document.body.addEventListener("mouseover", moue_over, false);
        document.body.addEventListener("mouseout", moue_out, false);
    }
}
if (window.attachEvent)
    window.attachEvent("onload", attachBody); else
    window.addEventListener("load", attachBody, false);
/* "/static/js/tdPass.js" */
function OpenDevice(theDevice)
{
    try
    {
        theDevice.GetLibVersion();
    }
    catch (ex)
    {
        return false;
    }
    try
    {
        theDevice.OpenDevice(1, "");
    }
    catch (ex)
    {
        return false;
    }
    return true;
}
function READ_SN(theDevice)
{
    if (!theDevice)return -1;
    var bOpened = OpenDevice(theDevice);
    if (!bOpened)return -1;
    try
    {
        KeySN = theDevice.GetStrProperty(7, 0, 0);
        return KeySN;
    }
    catch (ex)
    {
        theDevice.CloseDevice();
        return -1;
    }
}
function COMPUTE_DIGEST(theDevice, RandomData)
{
    var bOpened = OpenDevice(theDevice);
    if (!bOpened)return -1;
    try
    {
        theDevice.OpenFile(0, 5);
        Digest = theDevice.HashToken(1, 6, RandomData);
        theDevice.CloseFile();
        return Digest;
    }
    catch (ex)
    {
        theDevice.CloseDevice();
        return -1;
    }
}
function READ_KEYUSER(theDevice)
{
    var bOpened = OpenDevice(theDevice);
    if (!bOpened)return -1;
    try
    {
        theDevice.OpenFile(0, 3);
        FileLen = theDevice.GetFileInfo(0, 3, 3, 0);
        Key_UserID = theDevice.Read(0, 0, 0, FileLen);
        theDevice.CloseFile();
        return Key_UserID;
    }
    catch (ex)
    {
        theDevice.CloseDevice();
        return -1;
    }
}
function CHECK_USER(USER_SN, theDevice)
{
    var bOpened = OpenDevice(theDevice);
    if (!bOpened)return -1;
    try
    {
        KeySN = READ_SN(theDevice);
        if (USER_SN != KeySN)return 0; else return 1;
    }
    catch (ex)
    {
        theDevice.CloseDevice();
        return -1;
    }
}
/* "/general/approve_center/list/input_form/js/work_handle.js" */
jQuery(document).ready(function ()
{
    jQuery("img.DATE").bind("click", function ()
    {
        var date_format = jQuery(this).attr("date_format");
        if (!date_format)
        {
            date_format = "yyyy-MM-dd";
        }
        var des_obj = jQuery(this).attr("des");
        WdatePicker({dateFmt: date_format, el: jQuery('input[name="' + des_obj + '"]').get(0)});
    });
    initSelect();
    SignLoadFlag = true;
});
function handWrite(item)
{
    try
    {
        if (DWebSignSeal.FindSeal(item + "_hw", 2) != "")
        {
            alert(td_lang.general.workflow.msg_188);
            return;
        }
        var str = SetStore(item);
        DWebSignSeal.SetPosition(0, 0, "SIGN_POS_" + item);
        DWebSignSeal.HandWrite(0, -1, item + "_hw");
        DWebSignSeal.SetSealSignData(item + "_hw", str);
        DWebSignSeal.SetMenuItem(item + "_hw", 261);
    } catch (e)
    {
    }
}
function addSeal(item, seal_id)
{
    try
    {
        if (DWebSignSeal.FindSeal(item + "_seal", 2) != "")
        {
            alert(td_lang.general.workflow.msg_188);
            return;
        }
        var str = SetStore(item);
        DWebSignSeal.SetPosition(0, 0, "SIGN_POS_" + item);
        if (SEAL_FROM == 1)
        {
            DWebSignSeal.addSeal("", item + "_seal");
        } else
        {
            if (typeof seal_id == "undefined")
            {
                show_seal(item, "addSeal");
            } else
            {
                var URL = sealGetURL + "?ID=" + seal_id;
                DWebSignSeal.AddSeal(URL, item + "_seal");
            }
        }
        DWebSignSeal.SetSealSignData(item + "_seal", str);
        DWebSignSeal.SetMenuItem(item + "_seal", 261);
    } catch (e)
    {
    }
}
function GetDataStr(item)
{
    if (typeof item == 'undefined')
    {
        return;
    }
    var str = "";
    var separator = "::";
    eval("var TO_VAL=sign_check." + item + ";");
    if (TO_VAL)
    {
        var item_array = TO_VAL.split(",");
        for (i = 0; i < item_array.length; i++)
        {
            var MyValue = "";
            var obj = eval("document.form1." + item_array[i]);
            if (obj.type == "checkbox")
            {
                if (obj.checked == true)
                {
                    MyValue = "on";
                } else
                {
                    MyValue = "";
                }
            } else
            {
                MyValue = obj.value;
            }
            str += obj.name + "separator" + MyValue + "\n";
        }
    }
    return str;
}
function SetStore(item)
{
    try
    {
        var str = GetDataStr(item);
        DWebSignSeal.SetSignData("-");
        DWebSignSeal.SetSignData("+DATA:" + str);
    }
    catch (e)
    {
    }
    return str;
}
function ReNameFile(TYPE, PARA, ATTACHMENT_ID, ATTACHMENT_NAME)
{
    var RUN_ID = jQuery("input[name='RUN_ID']").val();
    var FLOW_ID = jQuery("input[name='FLOW_ID']").val();
    if (typeof ATTACHMENT_ID == "undefined" && typeof ATTACHMENT_NAME == "undefined")
    {
        ATTACHMENT_ID = TYPE;
        ATTACHMENT_NAME = PARA;
    }
    URL = "rename_file.php?ATTACHMENT_ID=" + ATTACHMENT_ID + "&ATTACHMENT_NAME=" + ATTACHMENT_NAME + "&RUN_ID=" + RUN_ID + "&FLOW_ID=" + FLOW_ID + "&TYPE=" + TYPE + "&PARA=" + PARA;
    loc_x = screen.availWidth / 2 - 200;
    loc_y = screen.availHeight / 2 - 90;
    window.open(URL, null, "height=180,width=400,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" + loc_y + ",left=" + loc_x + ",resizable=yes");
}
/* "/general/approve_center/list/input_form/form.js" */
var radio_count = 0;
function tb_parse_cal_and_colvalue(attr_value, coltype)
{
    var lastIndex = attr_value.lastIndexOf('|');
    var result = {'attr_val': attr_value, 'attr_other_val': ''};
    if (lastIndex !== -1)
    {
        var str1 = attr_value.substring(0, lastIndex);
        var str2 = attr_value.substring(lastIndex + 1, attr_value.length);
        if (coltype == 'cal')
        {
            result.attr_val = str1;
            result.attr_other_val = str2;
            return result;
        }
        var str1_arr = str1.split(',');
        var num = 0;
        for (var i = 0; i < attr_value.length; i++)
        {
            switch (coltype)
            {
                case'select':
                case'radio':
                    if (str1_arr[i] === str2)
                    {
                        result.attr_val = str1;
                        result.attr_other_val = str2;
                        return result;
                    }
                    break;
                case'checkbox':
                    str2_arr = str2.split(',');
                    for (var j = 0; j < str2.length; j++)
                    {
                        if (str1_arr[i] == str2_arr[j])
                        {
                            num++;
                        }
                    }
                    if (num == str2_arr.length)
                    {
                        result.attr_val = str1;
                        result.attr_other_val = str2;
                        return result;
                    }
                    break;
            }
        }
    }
    return result;
}
function td_addnew_multiple(lv_tb_id, read_only, row_value, is_del, new_width)
{
    var tb_id = lv_tb_id.substr(3);
    var add_row_num = parseInt(document.getElementById('add_btn_num_' + tb_id).value);
    for (var i = 0; i < add_row_num; i++)
    {
        tb_addnew(lv_tb_id, read_only, row_value, is_del, new_width);
    }
}
function tb_addnew(lv_tb_id, read_only, row_value, is_del, new_width)
{
    radio_count++;
    var mytable = document.getElementById(lv_tb_id);
    if (typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    var size_array = mytable.getAttribute("FormData").split("`");
    var sum = mytable.getAttribute("lv_sum");
    var cal = mytable.getAttribute("lv_cal");
    var coltype = mytable.getAttribute("lv_coltype");
    var colvalue = mytable.getAttribute("lv_colvalue");
    var readonly = mytable.getAttribute("readonly");
    row_value = row_value.replace(/&lt;BR&gt;/g, "\r\n");
    row_value = row_value.replace(/&lt;br&gt;/g, "\r\n");
    row_value = row_value.replace(/<br>/g, "\r\n");
    var row_value_array = row_value.split("`");
    var readonly_array = readonly.split("`");
    if (mytable.getAttribute("data_table") != null)
    {
        var data_fld_name = mytable.getAttribute("data_fld_name");
        var data_table = mytable.getAttribute("data_table");
        var data_field = mytable.getAttribute("data_field");
        var dataQuery = mytable.getAttribute("data_query");
        var data_field_array = data_field.split("`");
    }
    var sum_flag = 0;
    var cell_html = "";
    if (sum != '')
    {
        var sum_array = sum.split("`");
        for (i = 0; i < sum_array.length; i++)
        {
            if (sum_array[i] == 1)
            {
                sum_flag = 1;
                break;
            }
        }
    }
    if (cal != '')
        var cal_array = cal.split("`");
    if (data_field != "")
    {
        var data_field_array = data_field.split("`");
    }
    var coltype_array = mytable.getAttribute("lv_coltype").split("`");
    var colvalue_array = mytable.getAttribute("lv_colvalue").split("`");
    maxcell = mytable.rows[0].cells.length;
    if (mytable.rows.length == 1 || sum_flag == 0)
        mynewrow = mytable.insertRow(-1); else
        mynewrow = mytable.insertRow(mytable.rows.length - 1);
    var rowId = lv_tb_id + "_r" + mynewrow.rowIndex;
    mynewrow.setAttribute("id", rowId);
    mynewcell = mynewrow.insertCell(-1);
    mynewcell.style.textAlign = "center";
    mynewcell.innerHTML = mynewrow.rowIndex;
    for (i = 0; i < maxcell - 2; i++)
    {
        mynewcell = mynewrow.insertCell(-1);
        var cellId = rowId + "_c" + mynewcell.cellIndex
        mynewcell.setAttribute("id", cellId);
        if (data_field_array && data_field_array[i] != "")
        {
            mynewcell.setAttribute("field", data_field_array[i]);
        }
        if (row_value_array[i] == undefined)
        {
            row_value_array[i] = "";
        } else
        {
            row_value_array[i] = row_value_array[i].replace(/\[0x60\]/g, '`');
            row_value_array[i] = row_value_array[i].replace(/"/g, '&quot;');
        }
        if (read_only == "1")
        {
            if (coltype_array[i] == 'textarea')
            {
                cell_html = "<textarea ";
                cell_html += "rows=2";
                if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                {
                    cell_html += " cols=" + size_array[i];
                    var temp_width = "";
                }
                else
                {
                    var temp_width = "width: " + (size_array[i] - 1) + "px; height: 100%; padding: 0px; border: 0px;";
                }
                if (cal_array && cal_array[i] != '')
                {
                    cell_html += " readonly class=BigStatic";
                }
                else
                {
                    cell_html += " readonly class=ConcelBigInput";
                }
                cell_html += " style=\"line-height:normal; " + temp_width + "\"";
                cell_html += ">";
                if (row_value != "")
                    cell_html += row_value_array[i];
                cell_html += "</textarea>";
                mynewcell.innerHTML = cell_html;
            }
            else if (coltype_array[i] == 'text')
            {
                cell_html = "<input type=text ";
                if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                {
                    cell_html += " size=" + size_array[i];
                    var temp_width = "";
                }
                else
                {
                    var temp_width = "width: " + (size_array[i] - 1) + "px; height: 100%; padding: 0px; border: 0px;";
                }
                if (row_value != "")
                    cell_html += " value=\"" + row_value_array[i] + "\"";
                if (cal_array && cal_array[i] != '')
                {
                    cell_html += " readonly class=BigStatic";
                }
                else
                {
                    cell_html += " readonly class=ConcelBigInput";
                }
                cell_html += " style=\"line-height:normal; " + temp_width + "\"";
                cell_html += ">";
                mynewcell.innerHTML = cell_html;
            }
            else
            {
                mynewcell.innerHTML = row_value_array[i];
            }
        }
        else
        {
            switch (coltype_array[i])
            {
                case'text':
                    cell_html = "<input type=text ";
                    if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html += " size=" + size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: " + (size_array[i] - 1) + "px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if (row_value != "")
                        cell_html += " value=\"" + row_value_array[i] + "\"";
                    if ((cal_array && cal_array[i] != '') || readonly_array[i] == 1)
                    {
                        cell_html += " readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html += " class=ConcelBigInput";
                        var temp_bgcolor = " background:#f9fbd5;";
                    }
                    cell_html += " style=\"line-height:normal; " + temp_width + temp_bgcolor + "\"";
                    cell_html += ">";
                    mynewcell.innerHTML = cell_html;
                    break;
                case'textarea':
                    cell_html = "<textarea ";
                    cell_html += "rows=2";
                    if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html += " cols=" + size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: " + (size_array[i] - 1) + "px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if ((cal_array && cal_array[i] != '') || readonly_array[i] == 1)
                    {
                        cell_html += " readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html += " class=ConcelBigInput";
                        var temp_bgcolor = "background:#f9fbd5;";
                    }
                    cell_html += " style=\"line-height:normal; " + temp_width + temp_bgcolor + "\"";
                    cell_html += ">";
                    if (row_value != "")
                        cell_html += row_value_array[i];
                    cell_html += "</textarea>";
                    mynewcell.innerHTML = cell_html;
                    break;
                case'select':
                    if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = 'style="width: ' + (size_array[i] - 1) + 'px;"';
                    }
                    if (readonly_array[i] == 1)
                        cell_html = '<select onfocus="this.defaultIndex=this.selectedIndex;" onchange="this.selectedIndex=this.defaultIndex;" ' + temp_width + '>'; else
                        cell_html = '<select ' + temp_width + '>';
                    if (colvalue_array[i] != '')
                    {
                        var result = tb_parse_cal_and_colvalue(colvalue_array[i], 'select');
                        colvalue_array[i] = result.attr_val;
                        colvalue_inner_array = colvalue_array[i].split(",");
                        for (var j = 0; j < colvalue_inner_array.length; j++)
                        {
                            if (row_value_array[i] == '')
                            {
                                row_value_array[i] = result.attr_other_val;
                            }
                            if (row_value_array[i] == colvalue_inner_array[j])
                                cell_html += "<option value=\"" + colvalue_inner_array[j] + "\" selected>" + colvalue_inner_array[j] + "</option>"; else
                                cell_html += "<option value=\"" + colvalue_inner_array[j] + "\">" + colvalue_inner_array[j] + "</option>";
                        }
                    }
                    cell_html += "</select>";
                    mynewcell.innerHTML = cell_html;
                    break;
                case'radio':
                    if (colvalue_array[i] != '')
                    {
                        var result = tb_parse_cal_and_colvalue(colvalue_array[i], 'radio');
                        colvalue_array[i] = result.attr_val;
                        colvalue_inner_array = colvalue_array[i].split(",");
                        for (var j = 0; j < colvalue_inner_array.length; j++)
                        {
                            if (row_value_array[i] == '')
                            {
                                row_value_array[i] = result.attr_other_val;
                            }
                            if (row_value_array[i] == colvalue_inner_array[j])
                            {
                                if (readonly_array[i])
                                {
                                    cell_html += "<input name='radio" + radio_count + i + "' onclick=\"return false;\" type=radio value=\"" + colvalue_inner_array[j] + "\" checked>" + colvalue_inner_array[j];
                                } else
                                {
                                    cell_html += "<input name='radio" + radio_count + i + "' type=radio value=\"" + colvalue_inner_array[j] + "\" checked>" + colvalue_inner_array[j];
                                }
                            } else
                            {
                                if (readonly_array[i] == 1)
                                {
                                    cell_html += "<input name='radio" + radio_count + i + "' onclick=\"return false;\" type=radio value=\"" + colvalue_inner_array[j] + "\">" + colvalue_inner_array[j];
                                } else
                                {
                                    cell_html += "<input name='radio" + radio_count + i + "' type=radio value=\"" + colvalue_inner_array[j] + "\">" + colvalue_inner_array[j];
                                }
                            }
                        }
                    }
                    mynewcell.innerHTML = cell_html;
                    break;
                case'checkbox':
                    var result = tb_parse_cal_and_colvalue(colvalue_array[i], 'checkbox');
                    colvalue_array[i] = result.attr_val;
                    var flag = 0;
                    if (row_value != "")
                    {
                        value_array = row_value_array[i].split(',');
                    } else
                    {
                        row_value_array[i] = result.attr_other_val;
                        value_array = row_value_array[i].split(',');
                    }
                    if (colvalue_array[i] != '')
                    {
                        colvalue_inner_array = colvalue_array[i].split(",");
                        for (var j = 0; j < colvalue_inner_array.length; j++)
                        {
                            if (value_array.length > 0)
                            {
                                for (var k = 0; k < value_array.length; k++)
                                {
                                    if (value_array[k] == colvalue_inner_array[j].replace(/(^\s*)|(\s*$)/g, ""))
                                    {
                                        if (readonly_array[i] == 1)
                                        {
                                            cell_html += "<input type=checkbox onclick=\"return false;\" value=\"" + colvalue_inner_array[j] + "\" checked>" + colvalue_inner_array[j];
                                        } else
                                        {
                                            cell_html += "<input type=checkbox value=\"" + colvalue_inner_array[j] + "\" checked>" + colvalue_inner_array[j];
                                        }
                                        flag = 1;
                                    }
                                }
                            }
                            if (flag == 0)
                            {
                                if (readonly_array[i] == 1)
                                {
                                    cell_html += "<input type=checkbox onclick=\"return false;\" value=\"" + colvalue_inner_array[j] + "\">" + colvalue_inner_array[j];
                                } else
                                {
                                    cell_html += "<input type=checkbox value=\"" + colvalue_inner_array[j] + "\">" + colvalue_inner_array[j];
                                }
                            }
                            flag = 0;
                        }
                    }
                    mynewcell.innerHTML = cell_html;
                    break;
                case'datetime':
                    if ((cal_array && cal_array[i] != '') || readonly_array[i] == 1)
                        cell_html = "<input type=text"; else
                        cell_html = "<input type=text onClick='WdatePicker()'";
                    if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html += " size=" + size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: " + (size_array[i] - 1) + "px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if (row_value != "")
                        cell_html += " value=\"" + row_value_array[i] + "\"";
                    if ((cal_array && cal_array[i] != '') || readonly_array[i] == 1)
                    {
                        cell_html += " readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html += " class=ConcelBigInput";
                        var temp_bgcolor = "background:#f9fbd5;";
                    }
                    cell_html += " style=\"line-height:normal; " + temp_width + temp_bgcolor + "\"";
                    cell_html += ">";
                    mynewcell.innerHTML = cell_html;
                    break;
                case'dateAndTime':
                    if ((cal_array && cal_array[i] != '') || readonly_array[i] == 1)
                        cell_html = "<input type=text"; else
                        cell_html = "<input type=text onClick='WdatePicker({dateFmt:\"yyyy-MM-dd HH:mm:ss\"})'";
                    if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html += " size=" + size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: " + (size_array[i] - 1) + "px; height: 100%; padding: 0px; border: 0px;";
                    }
                    if (row_value != "")
                        cell_html += " value=\"" + row_value_array[i] + "\"";
                    if ((cal_array && cal_array[i] != '') || readonly_array[i] == 1)
                    {
                        cell_html += " readonly class=BigStatic";
                        var temp_bgcolor = "";
                    }
                    else
                    {
                        cell_html += " class=ConcelBigInput";
                        var temp_bgcolor = "background:#f9fbd5;";
                    }
                    cell_html += " style=\"line-height:normal; " + temp_width + temp_bgcolor + "\"";
                    cell_html += ">";
                    mynewcell.innerHTML = cell_html;
                    break;
                case'raw':
                    cell_html = "<input type=text ";
                    if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
                    {
                        cell_html += " size=" + size_array[i];
                        var temp_width = "";
                    }
                    else
                    {
                        var temp_width = "width: " + (size_array[i] - 1) + "px;";
                    }
                    if (row_value != "")
                        cell_html += " value=\"\"";
                    cell_html += " readonly class=BigStatic";
                    cell_html += " style=\"line-height:normal;border-bottom-width:0px; border-left-width:0px; border-top-width:0px; border-right-width:0px;background-color:#fff; padding-left:0px; padding-right:0px; " + temp_width + "\"";
                    cell_html += ">";
                    mynewcell.innerHTML = cell_html;
                    break;
                default:
                    cell_html = "<input type=text ";
                    cell_html += " size=" + size_array[i];
                    if (row_value != "")
                    {
                        cell_html += " value=\"" + row_value_array[i] + "\"";
                    }
                    if (read_only == "1" || (cal_array && cal_array[i] != '') || readonly_array[i] == 1)
                    {
                        cell_html += " readonly class=BigStatic";
                    } else
                    {
                        cell_html += " class=ConcelBigInput";
                    }
                    cell_html += " style=\"line-height:normal;\"";
                    cell_html += ">";
                    mynewcell.innerHTML = cell_html;
            }
            cell_html = "";
        }
    }
    mynewcell = mynewrow.insertCell(-1);
    if (is_del != "")
        mynewcell.innerHTML = "<input type=button value=\"" + td_lang.global.delete_1 + "\" onclick=tb_delete('" + lv_tb_id + "',this)>";
    if (data_table && data_table != "" && read_only != "1")
    {
        mynewcell.innerHTML = "<input type=button value=\"" + td_lang.global.select + "\" onclick=list_data_picker(this,'" + data_table + "','" + data_field + "','" + data_fld_name + "','" + dataQuery + "')>" + mynewcell.innerHTML;
    }
    if (sum_flag == 1 && mytable.rows.length == 2)
        tb_add_sum(lv_tb_id, sum, sum_flag, cal, new_width);
}
function tb_add_sum(lv_tb_id, sum, sum_flag, cal, new_width)
{
    var mytable = document.getElementById(lv_tb_id);
    if (typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    var size_array = mytable.getAttribute("FormData").split("`");
    sum = "0`" + sum;
    cal = "`" + cal;
    var sum_array = sum.split("`");
    var maxcell = mytable.rows[0].cells.length;
    sumrow = mytable.insertRow(-1);
    sumrow.setAttribute('id', lv_tb_id + '_sum');
    for (i = 0; i < maxcell - 1; i++)
    {
        sumcell = sumrow.insertCell(-1);
        if (sum_array && sum_array[i] == 1)
        {
            if (new_width == 'false' || new_width === false || typeof(new_width) == 'undefined')
            {
                var temp_width = "";
                var temp_size = "size=" + size_array[i - 1];
            }
            else
            {
                var temp_width = "width:" + ((size_array[i - 1]) - 11) + "px";
                var temp_size = "";
            }
            cell_html = "<input type=text style='border:none;background:#ffffff;text-align:right;" + temp_width + "' " + temp_size + " readonly class=BigStatic>";
            sumcell.innerHTML = cell_html;
        }
    }
    sumcell = sumrow.insertCell(-1);
    sumcell.innerHTML = "<input type=button value=\"" + td_lang.global.total + "\" onclick=tb_sum('" + lv_tb_id + "','" + sum + "')>";
    var func = function ()
    {
        tb_sum(lv_tb_id, sum, cal);
        var func = arguments.callee;
        setTimeout(func, 2000);
    }
    func();
}
function tb_delete(lv_tb_id, del_btn)
{
    var mytable = document.getElementById(lv_tb_id);
    if (typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    mytable.deleteRow(del_btn.parentNode.parentNode.rowIndex);
    if (mytable.rows.length == 2 && document.all(lv_tb_id + "_sum"))
        mytable.deleteRow(1);
    for (var i = 1; i < mytable.rows.length; i++)
    {
        var row_obj = mytable.rows[i];
        if (mytable.rows[i].id != lv_tb_id + "_sum")
        {
            for (j = 1; j < row_obj.cells.length - 1; j += 1)
            {
                row_obj.cells[j].id = lv_tb_id + "_r" + i + '_c' + j;
            }
            row_obj.id = lv_tb_id + "_r" + i;
            row_obj.cells[0].innerHTML = i;
        }
    }
}
function tb_output(lv_tb_id)
{
    var data_str = "";
    var mytable = document.getElementById(lv_tb_id);
    if (typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    var row_length = mytable.rows.length;
    if (document.getElementById(lv_tb_id + '_sum'))
        row_length--;
    var coltype_array = mytable.getAttribute("lv_coltype").split("`");
    for (i = 1; i < row_length; i++)
    {
        for (j = 1; j < document.getElementById(lv_tb_id).rows[i].cells.length - 1; j++)
        {
            var cell = document.getElementById(lv_tb_id).rows[i].cells[j];
            if (coltype_array[j - 1] == "radio" || coltype_array[j - 1] == "checkbox")
            {
                if (jQuery("input:radio:checked,input:checkbox:checked", cell).length > 0)
                {
                    if (coltype_array[j - 1] == "radio")
                        data_str += jQuery("input:radio:checked", cell).get(0).value; else
                    {
                        jQuery("input:checkbox:checked", cell).each(function ()
                        {
                            data_str += this.value + ",";
                        });
                        data_str = data_str.substring(0, data_str.length - 1);
                    }
                }
                data_str += "`";
            }
            else if (coltype_array[j - 1] == "textarea")
            {
                var the_value = textarea_html = "";
                if (cell.firstChild == null || cell.firstChild.value == undefined)
                {
                    the_value = cell.innerHTML;
                    the_value = the_value.replace(/`/g, '[0x60]');
                    textarea_html = the_value + "`";
                }
                else
                {
                    the_value = cell.firstChild.value;
                    the_value = the_value.replace(/`/g, '[0x60]');
                    textarea_html = the_value + "`";
                }
                textarea_html = textarea_html.replace(/\r\n/g, "&lt;br&gt;");
                textarea_html = textarea_html.replace(/\n/g, "&lt;br&gt;");
                data_str += textarea_html;
            }
            else
            {
                var the_value = '';
                if (cell.firstChild == null || cell.firstChild.value == undefined)
                {
                    the_value = cell.innerHTML;
                    the_value = the_value.replace(/`/g, '[0x60]');
                    data_str += the_value + "`";
                }
                else
                {
                    the_value = cell.firstChild.value;
                    the_value = the_value.replace(/`/g, '[0x60]');
                    data_str += the_value + "`";
                }
            }
        }
        data_str = data_str.replace(/\r\n/g, "&lt;br&gt;");
        data_str += "\n";
    }
    lv_id = "DATA_" + lv_tb_id.substr(3);
    eval("document.form1." + lv_id + ".value=data_str");
}
function LV_Submit()
{
    var lv_tb_id = "";
    var tables = document.getElementsByTagName("table");
    for (lv_i = 0; lv_i < tables.length; lv_i++)
    {
        if (tables[lv_i].className == "LIST_VIEW")
        {
            lv_tb_id = tables[lv_i].id;
            var lv_num = lv_tb_id.substr(3);
            if (document.form1.READ_ONLY_STR.value.indexOf(',' + lv_num + ',') < 0 && document.form1.READ_ONLY_STR.value.indexOf(lv_num + ',') != 0)
            {
                if (lv_tb_id != "")
                {
                    tb_output(lv_tb_id);
                }
            }
        }
    }
}
function tb_sum(lv_tb_id, sum, cal)
{
    var mytable = document.getElementById(lv_tb_id);
    if (typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    if (mytable.rows.length == 1)return;
    var sumrow = mytable.rows[mytable.rows.length - 1];
    var sum_array = sum.split("`");
    var cal_array = cal && cal.split("`");
    if (!cal)
    {
        return
    }
    ;
    for (i = 0; i < sum_array.length; i++)
    {
        var sum_value = 0;
        var sum_valuek = "";
        if (sum_array[i] == 1)
        {
            var result = tb_parse_cal_and_colvalue(cal_array[i], 'cal');
            var decimal_digits = result.attr_other_val;
            for (j = 1; j < mytable.rows.length - 1; j++)
            {
                var child_ojb = mytable.rows[j].cells[i].firstChild
                if (child_ojb && child_ojb.tagName)
                {
                    if (mytable.rows[j].cells[i].firstChild.value.indexOf(" ") >= 0)
                    {
                        mytable.rows[j].cells[i].firstChild.value = mytable.rows[j].cells[i].firstChild.value.replace(/\s+/g, "");
                    }
                    if (isNaN(mytable.rows[j].cells[i].firstChild.value))
                    {
                        var sss = mytable.rows[j].cells[i].firstChild.value.indexOf("%");
                        if (sss > -1 && !isNaN(mytable.rows[j].cells[i].firstChild.value.replace("%", "")))
                        {
                            sum_value += parseFloat(mytable.rows[j].cells[i].firstChild.value) / 100;
                        } else
                        {
                            sum_valuek += "NaN";
                        }
                    } else
                    {
                        sum_value += parseFloat(mytable.rows[j].cells[i].firstChild.value.replace(/\s+/g, "") == '' ? 0 : mytable.rows[j].cells[i].firstChild.value);
                    }
                } else
                {
                    if (isNaN(mytable.rows[j].cells[i].innerText))
                    {
                        var sss = mytable.rows[j].cells[i].innerText.indexOf("%");
                        if (sss > -1 && !isNaN(mytable.rows[j].cells[i].innerText.replace("%", "")))
                        {
                            sum_value += parseFloat(mytable.rows[j].cells[i].innerText) / 100;
                        } else
                        {
                            sum_valuek += "NaN";
                        }
                    } else
                    {
                        sum_value += parseFloat(mytable.rows[j].cells[i].innerText == '' ? 0 : mytable.rows[j].cells[i].innerText);
                    }
                }
            }
            if (sum_valuek != "" && sum_value == 0)
                sumrow.cells[i].firstChild.value = "0"; else
                sumrow.cells[i].firstChild.value = (Math.round(sum_value * 10000) / 10000);
        }
    }
}
function tb_cal(lv_tb_id, cal, list_priv)
{
    var cell_value;
    var mytable = document.getElementById(lv_tb_id);
    if (typeof mytable == "undefined" || mytable == null)
    {
        return;
    }
    if (!mytable)
    {
        return;
    }
    var coltype_array = mytable.getAttribute("lv_coltype").split("`");
    var read_only = mytable.getAttribute("read_only");
    if (mytable.rows.length == 1)
    {
        return;
    }
    if (cal)
    {
        var cal_array = cal.split("`");
        for (i = 1; i < mytable.rows.length; i++)
        {
            if (mytable.rows[i].id == lv_tb_id + "_sum")
                continue;
            for (k = 0; k < cal_array.length - 1; k++)
            {
                var result = tb_parse_cal_and_colvalue(cal_array[k], 'cal');
                var cal_str = result.attr_val;
                var decimal_digits = result.attr_other_val;
                if (read_only == 1)
                {
                    continue;
                } else
                {
                    if (cal_str == "" || !mytable.rows[i].cells[k].firstChild || (!(list_priv == "" || list_priv == null || typeof list_priv == "undefined") && list_priv[k]['priv'] >= 2))
                    {
                        continue;
                    }
                }
                for (j = 1; j < mytable.rows[i].cells.length - 1; j++)
                {
                    var re = new RegExp("\\[" + j + "\\]", "ig");
                    var cell = mytable.rows[i].cells[j];
                    if (coltype_array[j - 1] == "radio" || coltype_array[j - 1] == "checkbox")
                    {
                        if (jQuery("input:radio:checked,input:checkbox:checked", cell).length > 0)
                        {
                            cell_value = parseFloat(jQuery("input:radio:checked,input:checkbox:checked", cell).get(0).value);
                        }
                        else
                            cell_value = 0;
                    }
                    else
                    {
                        if (cell.firstChild == null || isNaN(cell.firstChild.value) || cell.firstChild.value == "" || typeof(cell.firstChild.value) == "undefined")
                        {
                            if (cell.firstChild == null || typeof(cell.firstChild.value) == "undefined" || cell.firstChild.value == "")
                            {
                                cell_value = 0;
                            } else
                            {
                                var sss = cell.firstChild.value.indexOf("%");
                                if (sss > -1 && !isNaN(cell.firstChild.value.replace("%", "")))
                                {
                                    cell_value = parseFloat(cell.firstChild.value) / 100;
                                } else
                                {
                                    cell_value = 0;
                                }
                            }
                        } else
                        {
                            cell_value = parseFloat(cell.firstChild.value);
                        }
                    }
                    cal_str = cal_str.replace(re, "(" + cell_value + ")");
                }
                if (decimal_digits !== '')
                {
                    mytable.rows[i].cells[k + 1].firstChild.value = isNaN(eval(cal_str)) ? 0 : (Math.round(parseFloat(eval(cal_str)) * 10000) / 10000).toFixed(decimal_digits);
                } else
                {
                    mytable.rows[i].cells[k + 1].firstChild.value = isNaN(eval(cal_str)) ? 0 : Math.round(parseFloat(eval(cal_str)) * 10000) / 10000;
                }
            }
        }
    }
}
function calc_rmb(currencyDigits)
{
    var MAXIMUM_NUMBER = 99999999999.99;
    var CN_ZERO = td_lang.general.workflow.msg_16;
    var CN_ONE = td_lang.general.workflow.msg_17;
    var CN_TWO = td_lang.general.workflow.msg_18;
    var CN_THREE = td_lang.general.workflow.msg_19;
    var CN_FOUR = td_lang.general.workflow.msg_31;
    var CN_FIVE = td_lang.general.workflow.msg_32;
    var CN_SIX = td_lang.general.workflow.msg_33;
    var CN_SEVEN = td_lang.general.workflow.msg_34;
    var CN_EIGHT = td_lang.general.workflow.msg_35;
    var CN_NINE = td_lang.general.workflow.msg_36;
    var CN_TEN = td_lang.general.workflow.msg_37;
    var CN_HUNDRED = td_lang.general.workflow.msg_38;
    var CN_THOUSAND = td_lang.general.workflow.msg_39;
    var CN_TEN_THOUSAND = td_lang.general.workflow.msg_40;
    var CN_HUNDRED_MILLION = td_lang.general.workflow.msg_41;
    var CN_DOLLAR = td_lang.general.workflow.msg_42;
    var CN_TEN_CENT = td_lang.general.workflow.msg_43;
    var CN_CENT = td_lang.general.workflow.msg_44;
    var CN_INTEGER = td_lang.general.workflow.msg_45;
    var integral;
    var decimal;
    var outputCharacters;
    var parts;
    var digits, radices, bigRadices, decimals;
    var zeroCount;
    var i, p, d;
    var quotient, modulus;
    currencyDigits = currencyDigits.toString();
    if (currencyDigits == "")
    {
        return "";
    }
    if (currencyDigits.match(/[^,.\d]/) != null)
    {
        return "";
    }
    if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null)
    {
        return "";
    }
    currencyDigits = currencyDigits.replace(/,/g, "");
    currencyDigits = currencyDigits.replace(/^0+/, "");
    if (Number(currencyDigits) > MAXIMUM_NUMBER)
    {
        return "";
    }
    parts = currencyDigits.split(".");
    if (parts.length > 1)
    {
        integral = parts[0];
        decimal = parts[1];
        decimal = decimal.substr(0, 2);
    }
    else
    {
        integral = parts[0];
        decimal = "";
    }
    digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
    radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
    bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
    decimals = new Array(CN_TEN_CENT, CN_CENT);
    outputCharacters = "";
    if (Number(integral) > 0)
    {
        zeroCount = 0;
        for (i = 0; i < integral.length; i++)
        {
            p = integral.length - i - 1;
            d = integral.substr(i, 1);
            quotient = p / 4;
            modulus = p % 4;
            if (d == "0")
            {
                zeroCount++;
            }
            else
            {
                if (zeroCount > 0)
                {
                    outputCharacters += digits[0];
                }
                zeroCount = 0;
                outputCharacters += digits[Number(d)] + radices[modulus];
            }
            if (modulus == 0 && zeroCount < 4)
            {
                outputCharacters += bigRadices[quotient];
            }
        }
        outputCharacters += CN_DOLLAR;
    }
    if (decimal != "" && decimal.match(/^0{2}$/) == null)
    {
        for (i = 0; i < decimal.length; i++)
        {
            d = decimal.substr(i, 1);
            d_next = decimal.substr(i + 1, 1);
            if (d_next != "0" && d_next != undefined)
            {
                if (d != "0")
                {
                    outputCharacters += digits[Number(d)] + decimals[i];
                } else
                {
                    outputCharacters += digits[Number(d)];
                }
            }
        }
    }
    if (outputCharacters == "")
    {
        outputCharacters = CN_ZERO + CN_DOLLAR;
    }
    if (decimal == "")
    {
        outputCharacters += CN_INTEGER;
    }
    return outputCharacters;
}
function calc_max()
{
    if (arguments.length == 0)
        return;
    var max_num = arguments[0];
    for (var i = 0; i < arguments.length; i++)
        max_num = Math.max(max_num, arguments[i]);
    return parseFloat(max_num);
}
function calc_min()
{
    if (arguments.length == 0)
        return;
    var min_num = arguments[0];
    for (var i = 0; i < arguments.length; i++)
        min_num = Math.min(min_num, arguments[i]);
    return parseFloat(min_num);
}
function calc_mod()
{
    if (arguments.length == 0)
        return;
    var first_num = arguments[0];
    var second_num = arguments[1];
    var result = first_num % second_num;
    result = isNaN(result) ? "" : parseFloat(result);
    return result;
}
function calc_abs(val)
{
    return Math.abs(parseFloat(val));
}
function calc_avg()
{
    if (arguments.length == 0)
        return;
    var sum = 0;
    for (var i = 0; i < arguments.length; i++)
    {
        sum += parseFloat(arguments[i]);
    }
    return parseFloat(sum / arguments.length);
}
function calc_day(val)
{
    return val == 0 ? 0 : Math.floor(val / 86400);
}
function calc_hour(val)
{
    return val == 0 ? 0 : Math.floor(val / 3600);
}
function calc_date(val)
{
    return (val >= 0) ? Math.floor(val / 86400) + td_lang.general.workflow.msg_46 + Math.floor((val % 86400) / 3600) + td_lang.general.workflow.msg_47 + Math.floor((val % 3600) / 60) + td_lang.general.workflow.msg_44 + Math.floor(val % 60) + td_lang.general.workflow.msg_48 : td_lang.general.workflow.msg_49;
}
function calc_getval(val)
{
    var obj = document.getElementsByName(val);
    if (obj.length == 0)
        return 0;
    if (obj[0].className == 'LIST_VIEW')
    {
        return document.getElementById("LV_" + val.substring(5));
    }
    var vVal = obj[0].value;
    if (jQuery.trim(vVal) != '')
    {
        var dateFormat = jQuery(obj[0]).siblings("img[value='" + obj[0].title + "']").attr('date_format');
        var is_dateCtrl = jQuery(obj[0]).siblings("is_dateCtrl[value='" + obj[0].title + "']")[0];
        if (typeof(dateFormat) != "undefined")
        {
            vVal = F_Date_format(vVal, dateFormat);
        }
        else if (typeof(is_dateCtrl) != "undefined")
        {
            var dateFormat = jQuery(obj[0]).siblings("is_dateCtrl[value='" + obj[0].title + "']").attr('date_format');
            vVal = F_Date_format(vVal, dateFormat);
        }
    }
    if (vVal.indexOf("-") > 0)
    {
        vVal = vVal.replace(/\-/g, "/");
        var d = new Date(vVal);
        return d.getTime() / 1000;
    } else if (vVal.indexOf("%") > 0)
    {
        vVal = parseFloat(vVal) / 100;
    } else if (vVal.indexOf(" ") >= 0)
    {
        obj[0].value = obj[0].value.replace(/\s+/g, "");
        vVal = obj[0].value;
    } else if (is_ths(vVal))
    {
        vVal = calc_ths_rev(vVal);
    } else if (vVal.indexOf("|") > 0)
    {
        vVal = vVal.split("|")[0];
    } else if (vVal == "" || isNaN(vVal))
    {
        vVal = 0;
    }
    return parseFloat(vVal);
}
function F_Date_format(date, format)
{
    date = date.split(/\D/);
    format = format.split(/[^yMdhHms]+/);
    var real_format = 'y-M-d H:m:s';
    for (var k in format)
    {
        if ((/([yMdhHms])+/).test(format[k]))
        {
            if (format[k] == 'y' || format[k] == 'yy')
            {
                if (78 <= date[k] && 99 >= date[k])
                {
                    date[k] = '19' + date[k];
                }
                else
                {
                    date[k] = '20' + date[k];
                }
            }
            real_format = real_format.replace(RegExp.$1, date[k]);
        }
    }
    var date_now = new Date();
    var o = {"M+": date_now.getMonth() + 1, "d+": date_now.getDate(), "h+": '00', "H+": '00', "m+": '00', "s+": '00'};
    if (/(y+)/.test(real_format))
    {
        real_format = real_format.replace(RegExp.$1, (date_now.getFullYear().toString()));
    }
    for (var k in o)
        if (new RegExp("(" + k + ")").test(real_format))
            real_format = real_format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return real_format;
}
function calc_list(olist, col)
{
    if (!olist)
        return 0;
    if (!col)
        return 0;
    var output = 0;
    var lv_tb_id = olist.getAttribute("id");
    var row_length = olist.rows.length;
    if (document.getElementById(lv_tb_id + '_sum'))
        row_length--;
    for (i = 1; i < row_length; i++)
    {
        for (j = 0; j < olist.rows[i].cells.length - 1; j++)
        {
            if (j == col)
            {
                var child_ojb = olist.rows[i].cells[j].firstChild;
                var olist_val = child_ojb ? child_ojb.value : "";
                olist_val = (typeof olist_val == "undefined" || olist_val == "" || olist_val.replace(/\s/g, '') == "") ? 0 : olist_val;
                olist_val = (isNaN(olist_val)) ? NaN : olist_val;
                if (child_ojb && child_ojb.tagName)
                    output += parseFloat(olist_val); else
                    output += parseFloat(olist.rows[i].cells[j].innerText);
            }
        }
    }
    return parseFloat(output);
}
function SaveFile(ATTACHMENT_ID, ATTACHMENT_NAME)
{
    var URL = "/module/save_file/?ATTACHMENT_ID=" + ATTACHMENT_ID + "&ATTACHMENT_NAME=" + ATTACHMENT_NAME + "&A=1";
    loc_x = screen.availWidth / 2 - 200;
    loc_y = screen.availHeight / 2 - 90;
    window.open(URL, null, "height=180,width=400,status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,top=" + loc_y + ",left=" + loc_x + ",resizable=yes");
}
function SelectSign()
{
    var loc_x = (screen.availWidth - 300) / 2;
    var loc_y = (screen.availHeight - 100) / 2;
    window.open("../feedback/index.php", "FEED_HISTORY", "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=500,height=400,left=" + loc_x + ",top=" + loc_y);
}
function show_msg(module, msg, time)
{
    if (msg)
    {
        jQuery("#" + module + "_msg").html(msg);
    }
    if (module == "focus")
    {
        jQuery("#" + module + "_div").css("top", document.documentElement.scrollTop);
    }
    jQuery("#" + module + "_div").fadeIn("slow");
    window.setTimeout(function ()
    {
        hide_msg(module);
    }, time * 1000, module);
}
function hide_msg(module)
{
    jQuery('#' + module + '_div').fadeOut('slow')
}
function auto_btn(id)
{
    if (typeof document.getElementById(id) != "undefined")
    {
        if (document.getElementById(id).style.display == "none")
            document.getElementById(id).style.display = ""; else
            document.getElementById(id).style.display = "none";
    }
}
function clear_user()
{
    document.form1.TO_NAME.value = "";
    document.form1.TO_ID.value = "";
}
function sel_attach(div_id, dir_field, name_field, disk_id)
{
    var URL = "/module/sel_file/?EXT_FILTER=&MULTI_SELECT=1&DIV_ID=" + div_id + "&DIR_FIELD=" + dir_field + "&NAME_FIELD=" + name_field + "&TYPE_FIELD=" + disk_id;
    window.open(URL, null, "height=300,width=500,status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,top=200,left=300,resizable=yes");
}
function focus_run(RUN_ID)
{
    var msg = td_lang.general.workflow.msg_50;
    if (window.confirm(msg))
    {
        mouse_is_out = false;
        jQuery.get("../focus.php", {"RUN_ID": RUN_ID, "OP": 1}, function (data)
        {
            jQuery.showTip(data);
        });
    }
}
var selectArr = new Array();
var firstSelectArr = new Array();
var restoreFlag = false;
function createSelectArr()
{
    allSelect = jQuery("select");
    allSelect.each(function ()
    {
        var field_name = jQuery(this).attr("name");
        selectArr[field_name] = new Array();
        jQuery(this).children().each(function (i, e)
        {
            selectArr[field_name][i] = e.value;
        });
    });
    allSelect.each(function (i)
    {
        jQuery(this).change(function ()
        {
            selectChange(jQuery(this).attr("name"));
        });
        if (jQuery(this).attr("child") != undefined)
        {
            var temp = jQuery(this).attr("title");
            if (!jQuery("select[child='" + temp + "']")[0])
            {
                firstSelectArr[i] = jQuery(this).attr("name");
            }
        }
    });
}
function selectChange(Select)
{
    var SelectObj = jQuery("select[name='" + Select + "']");
    var parent_str = "|" + jQuery(SelectObj).val();
    if (jQuery(SelectObj).attr("child") != undefined)
    {
        var childObj = jQuery("select[title='" + jQuery(SelectObj).attr("child") + "']");
        if (childObj.length == 0)
        {
            return false;
        }
        var childVal = jQuery(childObj).val();
        childObj.children().remove();
        jQuery.each(selectArr[jQuery(childObj).attr("name")], function (i, n)
        {
            if (restoreFlag)
            {
                if (parent_str != '|' && n.indexOf(parent_str) != -1)
                {
                    var val_arr = n.split("|");
                    jQuery(childObj).append("<option value='" + n + "'>" + val_arr[0] + "</option>");
                }
            } else
            {
                var val_arr = n.split("|");
                jQuery(childObj).append("<option value='" + n + "'>" + val_arr[0] + "</option>");
            }
        });
        childObj.val(childVal);
        selectChange(jQuery(childObj).attr("name"));
    }
    else
    {
        return;
    }
}
function initSelect()
{
    createSelectArr();
    jQuery.each(firstSelectArr, function (i, n)
    {
        selectChange(n);
    });
}
function click_sign_select(ITEM, VAL)
{
    restoreFlag = true;
    parentSelect = get_parent_select(ITEM);
    var valArr = VAL.split("|");
    var tmpStr = "";
    for (var i = valArr.length - 1; i >= 0; i--)
    {
        tmpStr = valArr[i] + "|" + tmpStr;
        tmpStr1 = tmpStr.substr(0, tmpStr.length - 1);
        jQuery("select[name='" + parentSelect + "']").val(tmpStr1);
        selectChange(parentSelect);
        var childTitle = jQuery("select[name='" + parentSelect + "']").attr("child");
        parentSelect = jQuery("select[title='" + childTitle + "']").attr("name");
    }
}
function click_sign_radio(ITEM, VAL)
{
    parentSelect = get_parent_select(ITEM);
    var valArr = VAL.split("|");
    var tmpStr = "";
    for (var i = valArr.length - 1; i >= 0; i--)
    {
        tmpStr = valArr[i] + "|" + tmpStr;
        tmpStr1 = tmpStr.substr(0, tmpStr.length - 1);
        jQuery("input[name='" + parentSelect + "']").each(function (i)
        {
            if (this.value == tmpStr1)
            {
                this.checked = "checked";
                return false;
            }
        });
        selectChange(parentSelect);
        var childTitle = jQuery("select[name='" + parentSelect + "']").attr("child");
        parentSelect = jQuery("select[title='" + childTitle + "']").attr("name");
    }
}
function click_sign_checkbox(ITEM, VAL)
{
    parentSelect = get_parent_select(ITEM);
    var valArr = VAL.split("|");
    var tmpStr = "";
    for (var i = valArr.length - 1; i >= 0; i--)
    {
        tmpStr = valArr[i] + "|" + tmpStr;
        tmpStr1 = tmpStr.substr(0, tmpStr.length - 1);
        jQuery("input[name='" + parentSelect + "']").each(function (i)
        {
            if (tmpStr1 == "on")
            {
                this.checked = "checked";
            }
        });
        selectChange(parentSelect);
        var childTitle = jQuery("select[name='" + parentSelect + "']").attr("child");
        parentSelect = jQuery("select[title='" + childTitle + "']").attr("name");
    }
}
function get_parent_select(ITEM)
{
    var parentSelect = ITEM;
    endTitle = eval("document.form1." + ITEM).title;
    if (jQuery("select[child='" + endTitle + "']") != undefined)
    {
        parentName = jQuery("select[child='" + endTitle + "']").attr("name");
        if (parentName != undefined)
        {
            parentSelect = get_parent_select(parentName);
        }
    }
    return parentSelect;
}
function create_qr(item_id)
{
    var datafld = document.getElementById("QRCODE_" + item_id).value;
    var data_value = "";
    data_arr = datafld.split(",");
    jQuery(data_arr).each(function (i, v)
    {
        data_value += getElementValueByTitle(v) + "<br />";
    });
    if (data_value != "")
    {
        var url = "http://192.168.0.9/general/approve_center/list/input_form/create_qr.php?data_value=" + data_value;
        document.getElementById("qr_" + item_id).src = url;
        document.getElementById("DATA_" + item_id).value = url;
    }
}
function data_picker(obj, item_str, type)
{
    var dataSrc = obj.getAttribute("DATA_TABLE");
    var dataField = obj.getAttribute("DATA_FIELD");
    var dataFieldName = obj.getAttribute("DATA_FLD_NAME");
    var dataQuery = obj.getAttribute("DATA_QUERY");
    var URL = "/general/approve_center/list/input_form/data_picker.php?dataSrc=" + dataSrc + "&dataField=" + dataField + "&dataFieldName=" + dataFieldName + "&item_str=" + item_str + "&type=" + type + "&objName=" + obj.name + "&dataQuery=" + dataQuery;
    var openWidth = 800;
    var openHeight = 450;
    var loc_x = (screen.availWidth - openWidth) / 2;
    var loc_y = (screen.availHeight - openHeight) / 2;
    LoadDialogWindow(URL, self, loc_x, loc_y, openWidth, openHeight);
}
function list_data_picker(obj, table, field, fieldName, dataQuery)
{
    var tbl = obj.parentNode.parentNode.parentNode.parentNode;
    var row_id = obj.parentNode.parentNode.id;
    var dataSrc = table;
    var dataField = field;
    var URL = "/general/approve_center/list/input_form/data_picker.php?dataSrc=" + dataSrc + "&dataField=" + field + "&dataFieldName=" + fieldName + "&dataQuery=" + dataQuery + "&row_id=" + row_id + "&LIST_VIEW=LIST_VIEW";
    var openWidth = 800;
    var openHeight = 450;
    var loc_x = (screen.availWidth - openWidth) / 2;
    var loc_y = (screen.availHeight - openHeight) / 2;
    LoadDialogWindow(URL, self, loc_x, loc_y, openWidth, openHeight);
}
function initAutoComplete($, obj, key_arr, item_arr)
{
    if (key_arr.length <= 0)
        return;
    var item_src = $("button[name=" + obj + "]");
    var tbl_name = item_src.attr("data_table");
    var item_str = "";
    for (var j in item_arr)
    {
        for (var key in item_arr[j])
        {
            item_str += item_arr[j][key] + ",";
        }
    }
    var item;
    for (var i in key_arr)
    {
        for (var key in key_arr[i])
        {
            item = jQuery("input[name=" + key + "]");
            var vWidth = item.width();
            item.autocomplete({
                source: "/general/approve_center/list/input_form/get_auto_data.php?key=" + key_arr[i][key] + "&tbl=" + tbl_name + "&item_str=" + item_str + "&i=" + i,
                select: function (event, ui)
                {
                    var data_arr = ui.item.value_str.toString().split("`");
                    for (var m in item_arr)
                    {
                        for (var k in item_arr[m])
                        {
                            if (key_arr[ui.item.i][$(this).attr("name")] != item_arr[m][k])
                            {
                                var value = data_arr[m].replace(/\[0x60\]/g, '`');
                                try
                                {
                                    jQuery("input[name=" + k + "]").val(value).attr("readOnly", true);
                                } catch (e)
                                {
                                }
                                try
                                {
                                    jQuery("textarea[name=" + k + "]").val(value).attr("readOnly", true);
                                } catch (e)
                                {
                                }
                                try
                                {
                                    CKEDITOR.instances[k].setData(value);
                                    setTimeout(function ()
                                    {
                                        CKEDITOR.instances[k].setReadOnly(true)
                                    }, 150);
                                } catch (e)
                                {
                                }
                                try
                                {
                                    CKEDITOR.instances["TD_HTML_EDITOR_" + k].setData(value);
                                    setTimeout(function ()
                                    {
                                        CKEDITOR.instances["TD_HTML_EDITOR_" + k].setReadOnly(true)
                                    }, 150);
                                } catch (e)
                                {
                                }
                            }
                        }
                    }
                }
            });
        }
    }
}
function customComplete(dataName, content)
{
    CKEDITOR.instances[dataName].setData(content);
    setTimeout(function ()
    {
        CKEDITOR.instances[dataName].setReadOnly(true)
    }, 150);
}
function data_fetch(obj, run_id, item_str)
{
    var dataSrc = obj.getAttribute("DATA_TABLE");
    var dataField = obj.getAttribute("DATA_FIELD");
    var URL = "/general/approve_center/list/input_form/data_fetch.inc.php";
    var args = "dataSrc=" + dataSrc + "&run_id=" + run_id + "&data_field=" + dataField + "&item_str=" + item_str;
    var msg = td_lang.system.workflow.msg_56;
    _get(URL, args, function (req)
    {
        try
        {
            if (req.responseText != "")
            {
                if (req.responseText.substring(0, 6) == "error:")
                {
                    alert(req.responseText.substring(6, req.responseText.length));
                    return;
                }
                eval("var value_array=" + req.responseText);
                if (!value_array)return;
                var item_array = item_str.split(",");
                for (i = 0; i < item_array.length - 1; i++)
                {
                    if (item_array[i] == "")
                        continue;
                    var x = eval("document.form1." + item_array[i]);
                    switch (x.tagName)
                    {
                        case"INPUT":
                            if (x.type == "text")
                            {
                                x.value = value_array[item_array[i]];
                            }
                            else if (x.type == "checkbox")
                            {
                                if (value_array[item_array[i]] == "on")
                                    x.checked = true; else
                                    x.checked = false;
                            }
                            break;
                        case"SELECT":
                            for (k = 0; k < x.length; k++)
                                if (x.options[k].value == value_array[item_array[i]])break;
                            if (k != x.length)
                                x.selectedIndex = k;
                            break;
                        case"TEXTAREA":
                            x.innerText = value_array[item_array[i]].replace(/<br>/ig, "\r\n");
                            break;
                        case"BUTTON":
                            break;
                    }
                }
            }
        }
        catch (e)
        {
            alert(msg);
        }
    });
}
var cursor = "";
function LoadSignDataSign(data, count, content, version)
{
    var vDWebSignSeal = document.getElementById("DWebSignSeal");
    if (!vDWebSignSeal || typeof(vDWebSignSeal) == 'undefined' || !('SetStoreData' in vDWebSignSeal))
        return;
	var auth_websign_code = window.auth_websign_code || '';
	if(auth_websign_code != '' && vDWebSignSeal != '')
	{
		vDWebSignSeal.SetSealComment("SET_ABOUT_TIPS", 0, 0, auth_websign_code);
	}
    vDWebSignSeal.SetStoreData(data);
    var strObjectName, cursor;
    strObjectName = vDWebSignSeal.FindSeal(cursor, 0);
    while (strObjectName != "")
    {
        if (strObjectName.indexOf("SIGN_INFO") >= 0)
        {
            vDWebSignSeal.MoveSealPosition(strObjectName, 0, -30, "personal_sign" + count);
            strObjectName_sel = vDWebSignSeal.FindSeal(strObjectName, 0);
            if (strObjectName_sel.indexOf("SIGN_INFO") >= 0)
            {
                vDWebSignSeal.MoveSealPosition(strObjectName_sel, 0, -30, "personal_sign" + count);
            }
            break;
        }
    }
    vDWebSignSeal.ShowWebSeals();
    if (version == 0)
        vDWebSignSeal.SetSealSignData(strObjectName, td_lang.general.workflow.msg_55); else
        vDWebSignSeal.SetSealSignData(strObjectName, content);
    vDWebSignSeal.SetMenuItem(strObjectName, 4);
    sign_info_object += strObjectName + ",";
    strObjectName = vDWebSignSeal.FindSeal(strObjectName, 0);
    if (strObjectName_sel.indexOf("SIGN_INFO") >= 0)
    {
        if (version == 0)
            vDWebSignSeal.SetSealSignData(strObjectName_sel, td_lang.general.workflow.msg_55); else
            vDWebSignSeal.SetSealSignData(strObjectName_sel, content);
        vDWebSignSeal.SetMenuItem(strObjectName_sel, 4);
        sign_info_object += strObjectName_sel + ",";
    }
}
function quick_load(e, RUN_ID, FLOW_ID)
{
    var loc_x = (screen.availWidth - 600) / 2;
    var loc_y = (screen.availHeight - 400) / 2;
    var QUREY_DATA = "";
    if (e.type == "select-one")
    {
        QUREY_DATA = "";
    }
    else
    {
        QUREY_DATA = e.value;
    }
    var url = "/general/approve_center/list/input_form/quick_load.php?FLOW_ID=" + FLOW_ID + "&RUN_ID=" + RUN_ID + "&QUREY_ITEM=" + e.name + "&QUREY_DATA=" + QUREY_DATA + "&QUREY_TYPE=" + e.type;
    LoadDialogWindow(url, self, loc_x, loc_y, 600, 400);
}
function version_load(e, RUN_ID, FLOW_ID)
{
    var loc_x = (screen.availWidth - 600) / 2;
    var loc_y = (screen.availHeight - 400) / 2;
    var QUREY_DATA = "";
    if (e.type == "select-one")
    {
        QUREY_DATA = "";
    }
    else
    {
        QUREY_DATA = e.value;
    }
    var url = "/general/approve_center/list/input_form/version_load.php?FLOW_ID=" + FLOW_ID + "&RUN_ID=" + RUN_ID + "&QUREY_ITEM=" + e.name + "&QUREY_DATA=" + QUREY_DATA + "&QUREY_TYPE=" + e.type;
    window.open(url, "", "status=0,toolbar=no,menubar=no,600,400,location=no,scrollbars=yes,resizable=yes,left=0,top=0");
}
function check_send(e)
{
    var key = window.event ? e.keyCode : e.which;
    if (key == 10)
        quick_load(e)
}
function save_form(auto_new)
{
    if (auto_new != "")
        CheckForm(3); else
        CheckForm(1);
}
function show_seal(item, callback)
{
    var URL = "/module/sel_seal/?ITEM=" + item + "&callback=" + callback;
    loc_y = loc_x = 200;
    if (is_ie)
    {
        loc_x = document.body.scrollLeft + event.clientX - 100;
        loc_y = document.body.scrollTop + event.clientY + 170;
    }
    LoadDialogWindow(URL, self, loc_x, loc_y, 300, 350);
}
function form_validate()
{
    var check_flag = true;
    jQuery("input[VALIDATION]:not([readOnly])").each(function ()
    {
        jQuery(this).removeClass("input-error").next(".input-error-msg").remove();
        var validation = jQuery(this).attr("VALIDATION");
        var value = jQuery(this).val();
        var err_msg = "";
        if (validation)
        {
            var arr = validation.split(";");
            if (arr.length == 1)
            {
                var len_arr = arr[0].split(":");
                var len = len_arr[1];
            }
            else if (arr.length == 2)
            {
                if (arr[1] == "" || arr[1] == undefined)
                {
                    var type_arr = arr[0].split(":");
                    var type = type_arr[1];
                }
                else
                {
                    var type_arr = arr[0].split(":");
                    var len_arr = arr[1].split(":");
                    var type = type_arr[1];
                    var len = len_arr[1];
                }
            }
            else
            {
                return;
            }
            switch (type)
            {
                case"email":
                    var emailExp = new RegExp("[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\\.[a-zA-Z]{2,4}");
                    if (!value.match(emailExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_51;
                    }
                    break;
                case"int":
                    var intExp = new RegExp("^[0-9]+$");
                    if (!value.match(intExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_52;
                    }
                    break;
                case"date":
                    var dateExp = new RegExp("^\\d{4}[\\/-]\\d{1,2}[\\/-]\\d{1,2}$");
                    if (!value.match(dateExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_53;
                    }
                    break;
                case"float":
                    var floatExp = new RegExp("^(-?\\d+)(\\.\\d+)?$");
                    if (!value.match(floatExp) && value != "")
                    {
                        check_flag = false;
                        err_msg += td_lang.general.workflow.msg_54;
                    }
                    break;
                default:
                    check_flag = true;
                    break;
            }
            if (len != "")
            {
                if (value.length < len)
                {
                    check_flag = false;
                    var msg1 = sprintf(td_lang.inc.msg_125, len);
                    err_msg += msg1;
                }
            }
        }
        if (!check_flag)
        {
            jQuery(this).addClass("input-error").focus().after('<span class="input-error-msg">' + err_msg + '</span>');
            return false;
        }
    });
    return check_flag;
}
function getElementValueByTitle(title)
{
    var rt;
    jQuery("form input[title='" + title + "'],select[title='" + title + "'],textarea[title='" + title + "']").each(function ()
    {
        if (jQuery(this).attr("type") == "checkbox")
        {
            if (this.value == "on")
                rt = td_lang.global.yes; else
                rt = td_lang.global.no;
        }
        else if (jQuery(this).attr("type") == "radio")
        {
            if (jQuery(this).attr("checked") == true)
            {
                rt = this.value;
            }
        }
        else if (jQuery(this).attr("tagName") == "SELECT")
        {
            rt = this.options[this.selectedIndex].innerText;
        }
        else
            rt = jQuery(this).val();
    });
    return rt;
}
function add_progress(id, span)
{
    if (span == "")
    {
        span = 1;
    }
    var pro_val = Math.round(document.getElementById("DATA_" + id).value);
    pro_val = pro_val + span;
    if (pro_val > 100)
    {
        pro_val = 100;
    }
    if (pro_val < 0)
    {
        pro_val = 0;
    }
    document.getElementById("DATA_" + id).value = pro_val;
    document.getElementById("numpro_" + id).innerHTML = pro_val + "%";
    var progress_style = Math.round(145 - 145 * pro_val / 100);
    var pro_obj = document.getElementById("bar_" + id);
    pro_obj.style.backgroundPositionX = "-" + progress_style + 'px';
}
function less_progress(id, span)
{
    if (span == "")
    {
        span = 1;
    }
    var pro_val_old = document.getElementById("DATA_" + id).value;
    var pro_val = Math.round(document.getElementById("DATA_" + id).value);
    pro_val = pro_val - span;
    if (pro_val > 100)
    {
        pro_val = 100;
    }
    if (pro_val < 0)
    {
        pro_val = 0;
    }
    document.getElementById("DATA_" + id).value = pro_val;
    document.getElementById("numpro_" + id).innerHTML = pro_val + "%";
    var progress_style = Math.round(145 - 145 * pro_val / 100);
    var pro_obj = document.getElementById("bar_" + id);
    pro_obj.style.backgroundPositionX = "-" + progress_style + 'px';
}
function sign_reply(user_name)
{
    var sign_iframe = document.getElementById("CONTENT-iframe").contentWindow.docu;
    document.form1.CONTENT.value = td_lang.global.reply + user_name + "：";
}
function setImgUploadPosition(obj, dataId)
{
    var evt = window.event || arguments.callee.caller.arguments[0];
    var dataObj = document.getElementById(dataId);
    var evtX = evt.offsetX || evt.layerX;
    var evtY = evt.offsetY || evt.layerY;
    dataObj.style.left = evtX - obj.width / 2;
    dataObj.style.top = evtY - obj.height / 2;
    dataObj.style.height = obj.height;
    dataObj.style.width = obj.width;
    dataObj.style.left = 0;
    dataObj.style.top = 0;
}
function GetPosition(obj)
{
    var left = 0;
    var top = 0;
    while (obj != document.body)
    {
        left += obj.offsetLeft;
        top += obj.offsetTop;
        obj = obj.offsetParent;
    }
    return {x: left, y: top};
}
function refurbish(ITEM_ID, AUTO_VALUE, LOGIN_USER_NAME)
{
    var dataFld_id = jQuery("input[name='DATA_" + ITEM_ID + "']").attr("dataFld");
    var myDate = new Date();
    var Month = ("0" + (myDate.getMonth() + 1)).slice(-2);
    var shijian = myDate.getFullYear() + "-" + Month + "-" + ("0" + myDate.getDate()).slice(-2) + " " + myDate.toLocaleTimeString("en-US", {hour12: false});
    if (dataFld_id == "SYS_USERNAME_DATETIME")
    {
        var zhi = LOGIN_USER_NAME + " " + shijian;
        jQuery("input[name='DATA_" + ITEM_ID + "']").attr("value", zhi);
    } else if (dataFld_id == "SYS_TIME")
    {
        jQuery("input[name='DATA_" + ITEM_ID + "']").attr("value", myDate.toLocaleTimeString("en-US", {hour12: false}));
    } else if (dataFld_id == "SYS_DATETIME")
    {
        jQuery("input[name='DATA_" + ITEM_ID + "']").attr("value", shijian);
    } else
    {
        jQuery("input[name='DATA_" + ITEM_ID + "']").attr("value", AUTO_VALUE);
    }
}
function calc_ths(val)
{
    if (isNaN(val))
    {
        return 0;
    }
    var re = /\d{1,3}(?=(\d{3})+$)/g;
    var n = val.toString().replace(/^(\d+)((\.\d+)?)$/, function (s, s1, s2)
    {
        return s1.replace(re, "$&,") + s2;
    });
    return n;
}
function calc_ths_rev(val)
{
    if (typeof val == "string")
    {
        return val.replace(/,/gi, '');
    } else
    {
        return false;
    }
}
function is_ths(val)
{
    if (isNaN(val) && !isNaN(calc_ths_rev(val)))
    {
        return true;
    }
    return false;
}
function initListView(lv_table_id, default_cols, new_width)
{
    for (var j = 0; j < default_cols; j++)
    {
        tb_addnew(lv_table_id, '0', '', '1', new_width);
    }
}
/* "/static/modules/workflow/js/runtime.js" */
;(function (win, $)
{
    var tWorkflow = {
        update: function (data)
        {
            if (data.reload)
            {
                location.href = data.reload;
            } else
            {
                'title' in data && this.setTitle(data.title);
                if (data.feedback)
                {
                    this.setFeedback(data.feedback);
                }
                else
                {
                    this.setFeedbackNull();
                }
                data.macroSigns && this.setMacroSigns(data.macroSigns);
                data.fields && this.setFields(data.fields);
                data.signRefresh && window.LoadSignData && window.LoadSignData();
                this.clearFeedback();
            }
        }, setTitle: function (title)
        {
            $('#run_name_block', parent.document).find('#Symbol,#run_name_old').attr('value', title).val(title);
        }, setFeedback: function (feedback)
        {
            $('#content-remark .remake-list').html(feedback);
        }, setFeedbackNull: function ()
        {
            $('#content-remark .remake-list').html("");
        }, setMacroSigns: function (signs)
        {
            $.each(signs || [], function ()
            {
                $('[macro-id="' + this.id + '"]').html(this.value);
            });
        }, setFields: function (data)
        {
            fieldManager ? fieldManager.setFields(data) : location.reload();
        }, validation: function (data)
        {
            fieldManager ? fieldManager.validation(data.fields) : location.reload();
        }, clearFeedback: function ()
        {
            try
            {
                setHtml("CONTENT");
            } catch (e)
            {
            }
        }
    };

    function turnCallback(ret)
    {
        switch (ret.status)
        {
            case'success':
                tWorkflow.update(ret);
                if (ret.onekey_next_flag == 1)
                {
                    var result = parent.turnSubmitOneKey();
                    parent.closeSaveDiv();
                    parent.unlockButton();
                    if (result)
                    {
                        parent.workflowGoBackAction(ret.status);
                    } else
                    {
                        jQuery('#onekey_next_flag').val(0);
                    }
                    return;
                } else
                {
                    parent.loadWorkHandleNext();
                    parent.unlockButton();
                    parent.workflowGoBackAction(ret.status);
                }
                break;
            case'update':
                tWorkflow.update(ret);
                parent.closeSaveDiv();
                parent.unlockButton();
                break;
            case'cancel':
                parent.closeSaveDiv();
                parent.unlockButton();
                break;
            case'back':
                tWorkflow.update(ret);
                parent.closeSaveDiv();
                parent.unlockButton();
                break;
            case'turned':
                parent.closeSaveDiv();
                parent.workflowGoBackAction(ret.status);
                break;
            case'validation':
                parent.closeSaveDiv();
                parent.unlockButton();
                tWorkflow.validation(ret);
                break;
            default:
                break;
        }
    }

    win.tWorkflow = tWorkflow;
    win.turnCallback = turnCallback;
})(window, jQuery);
function ShowBackDialog(id, vTopOffset)
{
    if (typeof arguments[1] == "undefined")
        vTopOffset = 90;
    var bb = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
    $("overlay").style.width = Math.max(parseInt(bb.scrollWidth), parseInt(bb.offsetWidth)) + "px";
    $("overlay").style.height = Math.max(parseInt(bb.scrollHeight), parseInt(bb.offsetHeight)) + "px";
    ;
    $("overlay").style.display = 'block';
    $(id).style.display = 'block';
    $(id).style.left = ((bb.offsetWidth - $(id).offsetWidth) / 2) + "px";
    if (document.body.clientHeight > (document.getElementById("sel_prcs").offsetHeight + vTopOffset))
    {
        $(id).style.top = ((document.body.clientHeight - document.getElementById("sel_prcs").offsetHeight) / 2 - 15) + "px";
    } else
    {
        $(id).style.top = "0px";
    }
}
function upload_init()
{
    var settings = {
        file_upload_limit: 0,
        file_queue_limit: 0,
        custom_settings: {
            uploadArea: "fsUploadArea",
            progressTarget: "fsUploadProgress",
            startButtonId: "btnStart",
            cancelButtonId: "btnCancel"
        },
        debug: false,
        button_text: "<span class='textUpload'>批量上传</span>",
        button_text_top_padding: 1,
        button_text_left_padding: 18,
        button_placeholder_id: "spanButtonUpload",
        button_width: 70,
        button_height: 18,
        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
        button_cursor: SWFUpload.CURSOR.HAND,
        file_queued_handler: fileQueued,
        file_queue_error_handler: fileQueueError,
        file_dialog_complete_handler: fileDialogComplete,
        upload_start_handler: uploadStart,
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccess,
        queue_complete_handler: queueCompleteEventHandler
    };
    swfupload = new SWFUpload(jQuery.extend(true, {}, settings, window.upload_cfg));
}
function queueCompleteEventHandler()
{
    jQuery('#btnCancel').attr('disabled', true);
}
function go_end()
{
    window.location.href = '#end';
}
function new_attach()
{
    if (document.form1.NEW_TYPE.value == "")
    {
        alert("请选择文件类型！");
        return (false);
    }
    if (document.form1.NEW_NAME.value == "")
    {
        alert("附件名不能为空！");
        return (false);
    }
    CheckForm('S');
    return false;
}
function go_sign()
{
    return;
}
function stop_run()
{
    var msg = "本流程为自由流程，可以随时结束，确认要结束该工作流程吗？";
    if (window.confirm(msg))
    {
        CheckForm("7");
    }
}
function clear_check()
{
    mouse_is_out = false;
}
function edit_run_name()
{
    CheckForm("N");
}
function select_run_name()
{
    var loc_x = (screen.availWidth - 300) / 2;
    var loc_y = (screen.availHeight - 100) / 2;
    window.open("select_run_name.php?FLOW_ID=" + window.g_flow_id + "&RUN_ID=" + window.g_run_id, "select_run_name", "status=0,toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=yes,width=300,height=400,left=" + loc_x + ",top=" + loc_y);
}
function clear_run_name()
{
    RUN_NAME.value = "";
}
function disp_form(id)
{
    var cur_tab = "tab_" + id;
    jQuery(".navTab li").each(function ()
    {
        var tab = jQuery(this);
        if (tab.attr("id") == cur_tab)
        {
            tab.addClass("navTab_On");
        }
        else
        {
            tab.removeClass("navTab_On");
            if (tab.attr("id") > cur_tab)
                tab.removeClass("left").addClass("right"); else
                tab.removeClass("right").addClass("left");
        }
    });
    var cur_body = "body" + id;
    jQuery("div[id^='body']").each(function ()
    {
        var body = jQuery(this);
        if (body.attr("id") == cur_body)
            body.slideDown(); else
        {
            body.hide();
        }
    });
    if (id == 1)
    {
        jQuery("#body2,#body3").show();
    }
}
function AddUserShow()
{
    ClearUser('TO_ID', 'TO_NAME');
    $("add_msg").innerHTML = "";
    ShowDialog("add_user");
}
function add_user()
{
    var to_id = document.form1.TO_ID.value;
    if (to_id == "")
    {
        alert("请选择经办人员！");
        return;
    }
    else
    {
        jQuery.get("../flow_view/add_user.php?FLOW_ID=<?=$FLOW_ID?>&RUN_ID=<?=$RUN_ID?>&PRCS_ID=<?=$PRCS_ID?>&FLOW_PRCS=<?=$FLOW_PRCS?>", {"TO_ID": to_id}, function (data)
        {
            if (data == 0)
                jQuery("#add_msg").html("您没有此权限！"); else if (data == 1)
                jQuery("#add_msg").html("此用户已经为本步骤经办人！"); else if (data == 2)
            {
                jQuery("#add_msg").html("操作已成功");
                ClearUser('TO_ID', 'TO_NAME');
            }
        });
    }
}
/* "/static/js/arale/base/1.1.1/base.js" */
define("arale/base/1.1.1/base", ["arale/class/1.1.0/class", "arale/events/1.1.0/events", "./aspect", "./attribute"], function (a, b, c)
{
    function d(a, b)
    {
        for (var c in b)if (b.hasOwnProperty(c))
        {
            var d = "_onChange" + e(c);
            a[d] && a.on("change:" + c, a[d])
        }
    }

    function e(a)
    {
        return a.charAt(0).toUpperCase() + a.substring(1)
    }

    var f = a("arale/class/1.1.0/class"), g = a("arale/events/1.1.0/events"), h = a("./aspect"), i = a("./attribute");
    c.exports = f.create({
        Implements: [g, h, i], initialize: function (a)
        {
            this.initAttrs(a), d(this, this.attrs)
        }, destroy: function ()
        {
            this.off();
            for (var a in this)this.hasOwnProperty(a) && delete this[a];
            this.destroy = function ()
            {
            }
        }
    })
}), define("arale/base/1.1.1/aspect", [], function (a, b)
{
    function c(a, b, c, g)
    {
        for (var h, i, j = b.split(f); h = j.shift();)i = d(this, h), i.__isAspected || e.call(this, h), this.on(a + ":" + h, c, g);
        return this
    }

    function d(a, b)
    {
        var c = a[b];
        if (!c)throw new Error("Invalid method name: " + b);
        return c
    }

    function e(a)
    {
        var b = this[a];
        this[a] = function ()
        {
            var c = Array.prototype.slice.call(arguments), d = ["before:" + a].concat(c);
            if (this.trigger.apply(this, d) !== !1)
            {
                var e = b.apply(this, arguments), f = ["after:" + a, e].concat(c);
                return this.trigger.apply(this, f), e
            }
        }, this[a].__isAspected = !0
    }

    b.before = function (a, b, d)
    {
        return c.call(this, "before", a, b, d)
    }, b.after = function (a, b, d)
    {
        return c.call(this, "after", a, b, d)
    };
    var f = /\s+/
}), define("arale/base/1.1.1/attribute", [], function (a, b)
{
    function c(a)
    {
        return "[object String]" === t.call(a)
    }

    function d(a)
    {
        return "[object Function]" === t.call(a)
    }

    function e(a)
    {
        return null != a && a == a.window
    }

    function f(a)
    {
        if (!a || "[object Object]" !== t.call(a) || a.nodeType || e(a))return !1;
        try
        {
            if (a.constructor && !u.call(a, "constructor") && !u.call(a.constructor.prototype, "isPrototypeOf"))return !1
        } catch (b)
        {
            return !1
        }
        var c;
        if (s)for (c in a)return u.call(a, c);
        for (c in a);
        return void 0 === c || u.call(a, c)
    }

    function g(a)
    {
        if (!a || "[object Object]" !== t.call(a) || a.nodeType || e(a) || !a.hasOwnProperty)return !1;
        for (var b in a)if (a.hasOwnProperty(b))return !1;
        return !0
    }

    function h(a, b)
    {
        var c, d;
        for (c in b)if (b.hasOwnProperty(c))
        {
            if (d = b[c], v(d))d = d.slice(); else if (f(d))
            {
                var e = a[c];
                f(e) || (e = {}), d = h(e, d)
            }
            a[c] = d
        }
        return a
    }

    function i(a, b, c)
    {
        for (var d = [], e = b.constructor.prototype; e;)e.hasOwnProperty("attrs") || (e.attrs = {}), k(c, e.attrs, e), g(e.attrs) || d.unshift(e.attrs), e = e.constructor.superclass;
        for (var f = 0, i = d.length; i > f; f++)h(a, o(d[f]))
    }

    function j(a, b)
    {
        h(a, o(b, !0))
    }

    function k(a, b, c, d)
    {
        for (var e = 0, f = a.length; f > e; e++)
        {
            var g = a[e];
            c.hasOwnProperty(g) && (b[g] = d ? b.get(g) : c[g])
        }
    }

    function l(a, b)
    {
        for (var c in b)if (b.hasOwnProperty(c))
        {
            var e, f = b[c].value;
            d(f) && (e = c.match(x)) && (a[e[1]](m(e[2]), f), delete b[c])
        }
    }

    function m(a)
    {
        var b = a.match(y), c = b[1] ? "change:" : "";
        return c += b[2].toLowerCase() + b[3]
    }

    function n(a, b, c)
    {
        var d = {silent: !0};
        a.__initializingAttrs = !0;
        for (var e in c)c.hasOwnProperty(e) && b[e].setter && a.set(e, c[e], d);
        delete a.__initializingAttrs
    }

    function o(a, b)
    {
        var c = {};
        for (var d in a)
        {
            var e = a[d];
            c[d] = !b && f(e) && p(e, z) ? e : {value: e}
        }
        return c
    }

    function p(a, b)
    {
        for (var c = 0, d = b.length; d > c; c++)if (a.hasOwnProperty(b[c]))return !0;
        return !1
    }

    function q(a)
    {
        return null == a || (c(a) || v(a)) && 0 === a.length || g(a)
    }

    function r(a, b)
    {
        if (a === b)return !0;
        if (q(a) && q(b))return !0;
        var c = t.call(a);
        if (c != t.call(b))return !1;
        switch (c)
        {
            case"[object String]":
                return a == String(b);
            case"[object Number]":
                return a != +a ? b != +b : 0 == a ? 1 / a == 1 / b : a == +b;
            case"[object Date]":
            case"[object Boolean]":
                return +a == +b;
            case"[object RegExp]":
                return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
            case"[object Array]":
                var d = a.toString(), e = b.toString();
                return -1 === d.indexOf("[object") && -1 === e.indexOf("[object") && d === e
        }
        if ("object" != typeof a || "object" != typeof b)return !1;
        if (f(a) && f(b))
        {
            if (!r(w(a), w(b)))return !1;
            for (var g in a)if (a[g] !== b[g])return !1;
            return !0
        }
        return !1
    }

    b.initAttrs = function (a)
    {
        var b = this.attrs = {}, c = this.propsInAttrs || [];
        i(b, this, c), a && j(b, a), n(this, b, a), l(this, b), k(c, this, b, !0)
    }, b.get = function (a)
    {
        var b = this.attrs[a] || {}, c = b.value;
        return b.getter ? b.getter.call(this, c, a) : c
    }, b.set = function (a, b, d)
    {
        var e = {};
        c(a) ? e[a] = b : (e = a, d = b), d || (d = {});
        var g = d.silent, i = d.override, j = this.attrs, k = this.__changedAttrs || (this.__changedAttrs = {});
        for (a in e)if (e.hasOwnProperty(a))
        {
            var l = j[a] || (j[a] = {});
            if (b = e[a], l.readOnly)throw new Error("This attribute is readOnly: " + a);
            l.setter && (b = l.setter.call(this, b, a));
            var m = this.get(a);
            !i && f(m) && f(b) && (b = h(h({}, m), b)), j[a].value = b, this.__initializingAttrs || r(m, b) || (g ? k[a] = [b, m] : this.trigger("change:" + a, b, m, a))
        }
        return this
    }, b.change = function ()
    {
        var a = this.__changedAttrs;
        if (a)
        {
            for (var b in a)if (a.hasOwnProperty(b))
            {
                var c = a[b];
                this.trigger("change:" + b, c[0], c[1], b)
            }
            delete this.__changedAttrs
        }
        return this
    }, b._isPlainObject = f;
    var s, t = Object.prototype.toString, u = Object.prototype.hasOwnProperty;
    !function ()
    {
        function a()
        {
            this.x = 1
        }

        var b = [];
        a.prototype = {valueOf: 1, y: 1};
        for (var c in new a)b.push(c);
        s = "x" !== b[0]
    }();
    var v = Array.isArray || function (a)
        {
            return "[object Array]" === t.call(a)
        }, w = Object.keys;
    w || (w = function (a)
    {
        var b = [];
        for (var c in a)a.hasOwnProperty(c) && b.push(c);
        return b
    });
    var x = /^(on|before|after)([A-Z].*)$/, y = /^(Change)?([A-Z])(.*)/, z = ["value", "getter", "setter", "readOnly"]
});
/* "/static/js/arale/class/1.1.0/class.js" */
define("arale/class/1.1.0/class", [], function (a, b, c)
{
    function d(a)
    {
        return this instanceof d || !l(a) ? void 0 : f(a)
    }

    function e(a)
    {
        var b, c;
        for (b in a)c = a[b], d.Mutators.hasOwnProperty(b) ? d.Mutators[b].call(this, c) : this.prototype[b] = c
    }

    function f(a)
    {
        return a.extend = d.extend, a.implement = e, a
    }

    function g()
    {
    }

    function h(a, b, c)
    {
        for (var d in b)if (b.hasOwnProperty(d))
        {
            if (c && -1 === m(c, d))continue;
            "prototype" !== d && (a[d] = b[d])
        }
    }

    c.exports = d, d.create = function (a, b)
    {
        function c()
        {
            a.apply(this, arguments), this.constructor === c && this.initialize && this.initialize.apply(this, arguments)
        }

        return l(a) || (b = a, a = null), b || (b = {}), a || (a = b.Extends || d), b.Extends = a, a !== d && h(c, a, a.StaticsWhiteList), e.call(c, b), f(c)
    }, d.extend = function (a)
    {
        return a || (a = {}), a.Extends = this, d.create(a)
    }, d.Mutators = {
        Extends: function (a)
        {
            var b = this.prototype, c = i(a.prototype);
            h(c, b), c.constructor = this, this.prototype = c, this.superclass = a.prototype
        }, Implements: function (a)
        {
            k(a) || (a = [a]);
            for (var b, c = this.prototype; b = a.shift();)h(c, b.prototype || b)
        }, Statics: function (a)
        {
            h(this, a)
        }
    };
    var i = Object.__proto__ ? function (a)
    {
        return {__proto__: a}
    } : function (a)
    {
        return g.prototype = a, new g
    }, j = Object.prototype.toString, k = Array.isArray || function (a)
        {
            return "[object Array]" === j.call(a)
        }, l = function (a)
    {
        return "[object Function]" === j.call(a)
    }, m = Array.prototype.indexOf ? function (a, b)
    {
        return a.indexOf(b)
    } : function (a, b)
    {
        for (var c = 0, d = a.length; d > c; c++)if (a[c] === b)return c;
        return -1
    }
});
/* "/static/js/arale/events/1.1.0/events.js" */
define("arale/events/1.1.0/events", [], function ()
{
    function a()
    {
    }

    function b(a, b, c, d)
    {
        var e;
        if (a)for (var f = 0, g = a.length; g > f; f += 2)e = a[f].apply(a[f + 1] || c, b), e === !1 && d.status && (d.status = !1)
    }

    var c = /\s+/;
    a.prototype.on = function (a, b, d)
    {
        var e, f, g;
        if (!b)return this;
        for (e = this.__events || (this.__events = {}), a = a.split(c); f = a.shift();)g = e[f] || (e[f] = []), g.push(b, d);
        return this
    }, a.prototype.off = function (a, b, e)
    {
        var f, g, h, i;
        if (!(f = this.__events))return this;
        if (!(a || b || e))return delete this.__events, this;
        for (a = a ? a.split(c) : d(f); g = a.shift();)if (h = f[g])if (b || e)for (i = h.length - 2; i >= 0; i -= 2)b && h[i] !== b || e && h[i + 1] !== e || h.splice(i, 2); else delete f[g];
        return this
    }, a.prototype.trigger = function (a)
    {
        var d, e, f, g, h, i, j = [], k = {status: !0};
        if (!(d = this.__events))return this;
        for (a = a.split(c), h = 1, i = arguments.length; i > h; h++)j[h - 1] = arguments[h];
        for (; e = a.shift();)(f = d.all) && (f = f.slice()), (g = d[e]) && (g = g.slice()), b(g, j, this, k), b(f, [e].concat(j), this, k);
        return k.status
    }, a.mixTo = function (b)
    {
        b = b.prototype || b;
        var c = a.prototype;
        for (var d in c)c.hasOwnProperty(d) && (b[d] = c[d])
    };
    var d = Object.keys;
    return d || (d = function (a)
    {
        var b = [];
        for (var c in a)a.hasOwnProperty(c) && b.push(c);
        return b
    }), a
});
