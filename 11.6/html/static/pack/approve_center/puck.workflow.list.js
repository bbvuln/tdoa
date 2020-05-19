// "/static/js/jquery-1.10.2/jquery.min.js","/static/js/bootstrap/js/bootstrap.min.js","/static/js/jquery-1.5.1/jsrender/jsrender.min.js","/static/js/jquery-1.5.1/jquery-ui.custom.min.js","/static/modules/workflow/js/jquery.browser.js","/static/modules/workflow/js/jquery.curcss.js","/static/js/jquery-1.5.1/jquery.ui.autocomplete.min.js","/static/modules/workflow/js/jquery.browser.js","/static/js/jquery-1.5.1/jqGrid/js/grid.loader.js"
/* "/static/js/jquery-1.10.2/jquery.min.js" */

(function (e, t)
{
    var n, r, i = typeof t, o = e.location, a = e.document, s = a.documentElement, l = e.jQuery, u = e.$, c = {}, p = [], f = "1.10.2", d = p.concat, h = p.push, g = p.slice, m = p.indexOf, y = c.toString, v = c.hasOwnProperty, b = f.trim, x = function (e, t)
    {
        return new x.fn.init(e, t, r)
    }, w = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, T = /\S+/g, C = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, N = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, k = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, E = /^[\],:{}\s]*$/, S = /(?:^|:|,)(?:\s*\[)+/g, A = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, j = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g, D = /^-ms-/, L = /-([\da-z])/gi, H = function (e, t)
    {
        return t.toUpperCase()
    }, q = function (e)
    {
        (a.addEventListener || "load" === e.type || "complete" === a.readyState) && (_(), x.ready())
    }, _ = function ()
    {
        a.addEventListener ? (a.removeEventListener("DOMContentLoaded", q, !1), e.removeEventListener("load", q, !1)) : (a.detachEvent("onreadystatechange", q), e.detachEvent("onload", q))
    };
    x.fn = x.prototype = {
        jquery: f, constructor: x, init: function (e, n, r)
        {
            var i, o;
            if (!e)return this;
            if ("string" == typeof e)
            {
                if (i = "<" === e.charAt(0) && ">" === e.charAt(e.length - 1) && e.length >= 3 ? [null, e, null] : N.exec(e), !i || !i[1] && n)return !n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e);
                if (i[1])
                {
                    if (n = n instanceof x ? n[0] : n, x.merge(this, x.parseHTML(i[1], n && n.nodeType ? n.ownerDocument || n : a, !0)), k.test(i[1]) && x.isPlainObject(n))for (i in n)x.isFunction(this[i]) ? this[i](n[i]) : this.attr(i, n[i]);
                    return this
                }
                if (o = a.getElementById(i[2]), o && o.parentNode)
                {
                    if (o.id !== i[2])return r.find(e);
                    this.length = 1, this[0] = o
                }
                return this.context = a, this.selector = e, this
            }
            return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : x.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), x.makeArray(e, this))
        }, selector: "", length: 0, toArray: function ()
        {
            return g.call(this)
        }, get: function (e)
        {
            return null == e ? this.toArray() : 0 > e ? this[this.length + e] : this[e]
        }, pushStack: function (e)
        {
            var t = x.merge(this.constructor(), e);
            return t.prevObject = this, t.context = this.context, t
        }, each: function (e, t)
        {
            return x.each(this, e, t)
        }, ready: function (e)
        {
            return x.ready.promise().done(e), this
        }, slice: function ()
        {
            return this.pushStack(g.apply(this, arguments))
        }, first: function ()
        {
            return this.eq(0)
        }, last: function ()
        {
            return this.eq(-1)
        }, eq: function (e)
        {
            var t = this.length, n = +e + (0 > e ? t : 0);
            return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
        }, map: function (e)
        {
            return this.pushStack(x.map(this, function (t, n)
            {
                return e.call(t, n, t)
            }))
        }, end: function ()
        {
            return this.prevObject || this.constructor(null)
        }, push: h, sort: [].sort, splice: [].splice
    }, x.fn.init.prototype = x.fn, x.extend = x.fn.extend = function ()
    {
        var e, n, r, i, o, a, s = arguments[0] || {}, l = 1, u = arguments.length, c = !1;
        for ("boolean" == typeof s && (c = s, s = arguments[1] || {}, l = 2), "object" == typeof s || x.isFunction(s) || (s = {}), u === l && (s = this, --l); u > l; l++)if (null != (o = arguments[l]))for (i in o)e = s[i], r = o[i], s !== r && (c && r && (x.isPlainObject(r) || (n = x.isArray(r))) ? (n ? (n = !1, a = e && x.isArray(e) ? e : []) : a = e && x.isPlainObject(e) ? e : {}, s[i] = x.extend(c, a, r)) : r !== t && (s[i] = r));
        return s
    }, x.extend({
        expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""), noConflict: function (t)
        {
            return e.$ === x && (e.$ = u), t && e.jQuery === x && (e.jQuery = l), x
        }, isReady: !1, readyWait: 1, holdReady: function (e)
        {
            e ? x.readyWait++ : x.ready(!0)
        }, ready: function (e)
        {
            if (e === !0 ? !--x.readyWait : !x.isReady)
            {
                if (!a.body)return setTimeout(x.ready);
                x.isReady = !0, e !== !0 && --x.readyWait > 0 || (n.resolveWith(a, [x]), x.fn.trigger && x(a).trigger("ready").off("ready"))
            }
        }, isFunction: function (e)
        {
            return "function" === x.type(e)
        }, isArray: Array.isArray || function (e)
        {
            return "array" === x.type(e)
        }, isWindow: function (e)
        {
            return null != e && e == e.window
        }, isNumeric: function (e)
        {
            return !isNaN(parseFloat(e)) && isFinite(e)
        }, type: function (e)
        {
            return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? c[y.call(e)] || "object" : typeof e
        }, isPlainObject: function (e)
        {
            var n;
            if (!e || "object" !== x.type(e) || e.nodeType || x.isWindow(e))return !1;
            try
            {
                if (e.constructor && !v.call(e, "constructor") && !v.call(e.constructor.prototype, "isPrototypeOf"))return !1
            } catch (r)
            {
                return !1
            }
            if (x.support.ownLast)for (n in e)return v.call(e, n);
            for (n in e);
            return n === t || v.call(e, n)
        }, isEmptyObject: function (e)
        {
            var t;
            for (t in e)return !1;
            return !0
        }, error: function (e)
        {
            throw Error(e)
        }, parseHTML: function (e, t, n)
        {
            if (!e || "string" != typeof e)return null;
            "boolean" == typeof t && (n = t, t = !1), t = t || a;
            var r = k.exec(e), i = !n && [];
            return r ? [t.createElement(r[1])] : (r = x.buildFragment([e], t, i), i && x(i).remove(), x.merge([], r.childNodes))
        }, parseJSON: function (n)
        {
            return e.JSON && e.JSON.parse ? e.JSON.parse(n) : null === n ? n : "string" == typeof n && (n = x.trim(n), n && E.test(n.replace(A, "@").replace(j, "]").replace(S, ""))) ? Function("return " + n)() : (x.error("Invalid JSON: " + n), t)
        }, parseXML: function (n)
        {
            var r, i;
            if (!n || "string" != typeof n)return null;
            try
            {
                e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
            } catch (o)
            {
                r = t
            }
            return r && r.documentElement && !r.getElementsByTagName("parsererror").length || x.error("Invalid XML: " + n), r
        }, noop: function ()
        {
        }, globalEval: function (t)
        {
            t && x.trim(t) && (e.execScript || function (t)
            {
                e.eval.call(e, t)
            })(t)
        }, camelCase: function (e)
        {
            return e.replace(D, "ms-").replace(L, H)
        }, nodeName: function (e, t)
        {
            return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
        }, each: function (e, t, n)
        {
            var r, i = 0, o = e.length, a = M(e);
            if (n)
            {
                if (a)
                {
                    for (; o > i; i++)if (r = t.apply(e[i], n), r === !1)break
                } else for (i in e)if (r = t.apply(e[i], n), r === !1)break
            } else if (a)
            {
                for (; o > i; i++)if (r = t.call(e[i], i, e[i]), r === !1)break
            } else for (i in e)if (r = t.call(e[i], i, e[i]), r === !1)break;
            return e
        }, trim: b && !b.call("\ufeff\u00a0") ? function (e)
        {
            return null == e ? "" : b.call(e)
        } : function (e)
        {
            return null == e ? "" : (e + "").replace(C, "")
        }, makeArray: function (e, t)
        {
            var n = t || [];
            return null != e && (M(Object(e)) ? x.merge(n, "string" == typeof e ? [e] : e) : h.call(n, e)), n
        }, inArray: function (e, t, n)
        {
            var r;
            if (t)
            {
                if (m)return m.call(t, e, n);
                for (r = t.length, n = n ? 0 > n ? Math.max(0, r + n) : n : 0; r > n; n++)if (n in t && t[n] === e)return n
            }
            return -1
        }, merge: function (e, n)
        {
            var r = n.length, i = e.length, o = 0;
            if ("number" == typeof r)for (; r > o; o++)e[i++] = n[o]; else while (n[o] !== t)e[i++] = n[o++];
            return e.length = i, e
        }, grep: function (e, t, n)
        {
            var r, i = [], o = 0, a = e.length;
            for (n = !!n; a > o; o++)r = !!t(e[o], o), n !== r && i.push(e[o]);
            return i
        }, map: function (e, t, n)
        {
            var r, i = 0, o = e.length, a = M(e), s = [];
            if (a)for (; o > i; i++)r = t(e[i], i, n), null != r && (s[s.length] = r); else for (i in e)r = t(e[i], i, n), null != r && (s[s.length] = r);
            return d.apply([], s)
        }, guid: 1, proxy: function (e, n)
        {
            var r, i, o;
            return "string" == typeof n && (o = e[n], n = e, e = o), x.isFunction(e) ? (r = g.call(arguments, 2), i = function ()
            {
                return e.apply(n || this, r.concat(g.call(arguments)))
            }, i.guid = e.guid = e.guid || x.guid++, i) : t
        }, access: function (e, n, r, i, o, a, s)
        {
            var l = 0, u = e.length, c = null == r;
            if ("object" === x.type(r))
            {
                o = !0;
                for (l in r)x.access(e, n, l, r[l], !0, a, s)
            } else if (i !== t && (o = !0, x.isFunction(i) || (s = !0), c && (s ? (n.call(e, i), n = null) : (c = n, n = function (e, t, n)
                {
                    return c.call(x(e), n)
                })), n))for (; u > l; l++)n(e[l], r, s ? i : i.call(e[l], l, n(e[l], r)));
            return o ? e : c ? n.call(e) : u ? n(e[0], r) : a
        }, now: function ()
        {
            return (new Date).getTime()
        }, swap: function (e, t, n, r)
        {
            var i, o, a = {};
            for (o in t)a[o] = e.style[o], e.style[o] = t[o];
            i = n.apply(e, r || []);
            for (o in t)e.style[o] = a[o];
            return i
        }
    }), x.ready.promise = function (t)
    {
        if (!n)if (n = x.Deferred(), "complete" === a.readyState)setTimeout(x.ready); else if (a.addEventListener)a.addEventListener("DOMContentLoaded", q, !1), e.addEventListener("load", q, !1); else
        {
            a.attachEvent("onreadystatechange", q), e.attachEvent("onload", q);
            var r = !1;
            try
            {
                r = null == e.frameElement && a.documentElement
            } catch (i)
            {
            }
            r && r.doScroll && function o()
            {
                if (!x.isReady)
                {
                    try
                    {
                        r.doScroll("left")
                    } catch (e)
                    {
                        return setTimeout(o, 50)
                    }
                    _(), x.ready()
                }
            }()
        }
        return n.promise(t)
    }, x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t)
    {
        c["[object " + t + "]"] = t.toLowerCase()
    });
    function M(e)
    {
        var t = e.length, n = x.type(e);
        return x.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || "function" !== n && (0 === t || "number" == typeof t && t > 0 && t - 1 in e)
    }

    r = x(a), function (e, t)
    {
        var n, r, i, o, a, s, l, u, c, p, f, d, h, g, m, y, v, b = "sizzle" + -new Date, w = e.document, T = 0, C = 0, N = st(), k = st(), E = st(), S = !1, A = function (e, t)
        {
            return e === t ? (S = !0, 0) : 0
        }, j = typeof t, D = 1 << 31, L = {}.hasOwnProperty, H = [], q = H.pop, _ = H.push, M = H.push, O = H.slice, F = H.indexOf || function (e)
            {
                var t = 0, n = this.length;
                for (; n > t; t++)if (this[t] === e)return t;
                return -1
            }, B = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", P = "[\\x20\\t\\r\\n\\f]", R = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", W = R.replace("w", "w#"), $ = "\\[" + P + "*(" + R + ")" + P + "*(?:([*^$|!~]?=)" + P + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + W + ")|)|)" + P + "*\\]", I = ":(" + R + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + $.replace(3, 8) + ")*)|.*)\\)|)", z = RegExp("^" + P + "+|((?:^|[^\\\\])(?:\\\\.)*)" + P + "+$", "g"), X = RegExp("^" + P + "*," + P + "*"), U = RegExp("^" + P + "*([>+~]|" + P + ")" + P + "*"), V = RegExp(P + "*[+~]"), Y = RegExp("=" + P + "*([^\\]'\"]*)" + P + "*\\]", "g"), J = RegExp(I), G = RegExp("^" + W + "$"), Q = {
            ID: RegExp("^#(" + R + ")"),
            CLASS: RegExp("^\\.(" + R + ")"),
            TAG: RegExp("^(" + R.replace("w", "w*") + ")"),
            ATTR: RegExp("^" + $),
            PSEUDO: RegExp("^" + I),
            CHILD: RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + P + "*(even|odd|(([+-]|)(\\d*)n|)" + P + "*(?:([+-]|)" + P + "*(\\d+)|))" + P + "*\\)|)", "i"),
            bool: RegExp("^(?:" + B + ")$", "i"),
            needsContext: RegExp("^" + P + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + P + "*((?:-\\d)?\\d*)" + P + "*\\)|)(?=[^-]|$)", "i")
        }, K = /^[^{]+\{\s*\[native \w/, Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, et = /^(?:input|select|textarea|button)$/i, tt = /^h\d$/i, nt = /'|\\/g, rt = RegExp("\\\\([\\da-f]{1,6}" + P + "?|(" + P + ")|.)", "ig"), it = function (e, t, n)
        {
            var r = "0x" + t - 65536;
            return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(55296 | r >> 10, 56320 | 1023 & r)
        };
        try
        {
            M.apply(H = O.call(w.childNodes), w.childNodes), H[w.childNodes.length].nodeType
        } catch (ot)
        {
            M = {
                apply: H.length ? function (e, t)
                {
                    _.apply(e, O.call(t))
                } : function (e, t)
                {
                    var n = e.length, r = 0;
                    while (e[n++] = t[r++]);
                    e.length = n - 1
                }
            }
        }
        function at(e, t, n, i)
        {
            var o, a, s, l, u, c, d, m, y, x;
            if ((t ? t.ownerDocument || t : w) !== f && p(t), t = t || f, n = n || [], !e || "string" != typeof e)return n;
            if (1 !== (l = t.nodeType) && 9 !== l)return [];
            if (h && !i)
            {
                if (o = Z.exec(e))if (s = o[1])
                {
                    if (9 === l)
                    {
                        if (a = t.getElementById(s), !a || !a.parentNode)return n;
                        if (a.id === s)return n.push(a), n
                    } else if (t.ownerDocument && (a = t.ownerDocument.getElementById(s)) && v(t, a) && a.id === s)return n.push(a), n
                } else
                {
                    if (o[2])return M.apply(n, t.getElementsByTagName(e)), n;
                    if ((s = o[3]) && r.getElementsByClassName && t.getElementsByClassName)return M.apply(n, t.getElementsByClassName(s)), n
                }
                if (r.qsa && (!g || !g.test(e)))
                {
                    if (m = d = b, y = t, x = 9 === l && e, 1 === l && "object" !== t.nodeName.toLowerCase())
                    {
                        c = mt(e), (d = t.getAttribute("id")) ? m = d.replace(nt, "\\$&") : t.setAttribute("id", m), m = "[id='" + m + "'] ", u = c.length;
                        while (u--)c[u] = m + yt(c[u]);
                        y = V.test(e) && t.parentNode || t, x = c.join(",")
                    }
                    if (x)try
                    {
                        return M.apply(n, y.querySelectorAll(x)), n
                    } catch (T)
                    {
                    } finally
                    {
                        d || t.removeAttribute("id")
                    }
                }
            }
            return kt(e.replace(z, "$1"), t, n, i)
        }

        function st()
        {
            var e = [];

            function t(n, r)
            {
                return e.push(n += " ") > o.cacheLength && delete t[e.shift()], t[n] = r
            }

            return t
        }

        function lt(e)
        {
            return e[b] = !0, e
        }

        function ut(e)
        {
            var t = f.createElement("div");
            try
            {
                return !!e(t)
            } catch (n)
            {
                return !1
            } finally
            {
                t.parentNode && t.parentNode.removeChild(t), t = null
            }
        }

        function ct(e, t)
        {
            var n = e.split("|"), r = e.length;
            while (r--)o.attrHandle[n[r]] = t
        }

        function pt(e, t)
        {
            var n = t && e, r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || D) - (~e.sourceIndex || D);
            if (r)return r;
            if (n)while (n = n.nextSibling)if (n === t)return -1;
            return e ? 1 : -1
        }

        function ft(e)
        {
            return function (t)
            {
                var n = t.nodeName.toLowerCase();
                return "input" === n && t.type === e
            }
        }

        function dt(e)
        {
            return function (t)
            {
                var n = t.nodeName.toLowerCase();
                return ("input" === n || "button" === n) && t.type === e
            }
        }

        function ht(e)
        {
            return lt(function (t)
            {
                return t = +t, lt(function (n, r)
                {
                    var i, o = e([], n.length, t), a = o.length;
                    while (a--)n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }

        s = at.isXML = function (e)
        {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? "HTML" !== t.nodeName : !1
        }, r = at.support = {}, p = at.setDocument = function (e)
        {
            var n = e ? e.ownerDocument || e : w, i = n.defaultView;
            return n !== f && 9 === n.nodeType && n.documentElement ? (f = n, d = n.documentElement, h = !s(n), i && i.attachEvent && i !== i.top && i.attachEvent("onbeforeunload", function ()
            {
                p()
            }), r.attributes = ut(function (e)
            {
                return e.className = "i", !e.getAttribute("className")
            }), r.getElementsByTagName = ut(function (e)
            {
                return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length
            }), r.getElementsByClassName = ut(function (e)
            {
                return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
            }), r.getById = ut(function (e)
            {
                return d.appendChild(e).id = b, !n.getElementsByName || !n.getElementsByName(b).length
            }), r.getById ? (o.find.ID = function (e, t)
            {
                if (typeof t.getElementById !== j && h)
                {
                    var n = t.getElementById(e);
                    return n && n.parentNode ? [n] : []
                }
            }, o.filter.ID = function (e)
            {
                var t = e.replace(rt, it);
                return function (e)
                {
                    return e.getAttribute("id") === t
                }
            }) : (delete o.find.ID, o.filter.ID = function (e)
            {
                var t = e.replace(rt, it);
                return function (e)
                {
                    var n = typeof e.getAttributeNode !== j && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }), o.find.TAG = r.getElementsByTagName ? function (e, n)
            {
                return typeof n.getElementsByTagName !== j ? n.getElementsByTagName(e) : t
            } : function (e, t)
            {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" === e)
                {
                    while (n = o[i++])1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }, o.find.CLASS = r.getElementsByClassName && function (e, n)
                {
                    return typeof n.getElementsByClassName !== j && h ? n.getElementsByClassName(e) : t
                }, m = [], g = [], (r.qsa = K.test(n.querySelectorAll)) && (ut(function (e)
            {
                e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || g.push("\\[" + P + "*(?:value|" + B + ")"), e.querySelectorAll(":checked").length || g.push(":checked")
            }), ut(function (e)
            {
                var t = n.createElement("input");
                t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("t", ""), e.querySelectorAll("[t^='']").length && g.push("[*^$]=" + P + "*(?:''|\"\")"), e.querySelectorAll(":enabled").length || g.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), g.push(",.*:")
            })), (r.matchesSelector = K.test(y = d.webkitMatchesSelector || d.mozMatchesSelector || d.oMatchesSelector || d.msMatchesSelector)) && ut(function (e)
            {
                r.disconnectedMatch = y.call(e, "div"), y.call(e, "[s!='']:x"), m.push("!=", I)
            }), g = g.length && RegExp(g.join("|")), m = m.length && RegExp(m.join("|")), v = K.test(d.contains) || d.compareDocumentPosition ? function (e, t)
            {
                var n = 9 === e.nodeType ? e.documentElement : e, r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            } : function (e, t)
            {
                if (t)while (t = t.parentNode)if (t === e)return !0;
                return !1
            }, A = d.compareDocumentPosition ? function (e, t)
            {
                if (e === t)return S = !0, 0;
                var i = t.compareDocumentPosition && e.compareDocumentPosition && e.compareDocumentPosition(t);
                return i ? 1 & i || !r.sortDetached && t.compareDocumentPosition(e) === i ? e === n || v(w, e) ? -1 : t === n || v(w, t) ? 1 : c ? F.call(c, e) - F.call(c, t) : 0 : 4 & i ? -1 : 1 : e.compareDocumentPosition ? -1 : 1
            } : function (e, t)
            {
                var r, i = 0, o = e.parentNode, a = t.parentNode, s = [e], l = [t];
                if (e === t)return S = !0, 0;
                if (!o || !a)return e === n ? -1 : t === n ? 1 : o ? -1 : a ? 1 : c ? F.call(c, e) - F.call(c, t) : 0;
                if (o === a)return pt(e, t);
                r = e;
                while (r = r.parentNode)s.unshift(r);
                r = t;
                while (r = r.parentNode)l.unshift(r);
                while (s[i] === l[i])i++;
                return i ? pt(s[i], l[i]) : s[i] === w ? -1 : l[i] === w ? 1 : 0
            }, n) : f
        }, at.matches = function (e, t)
        {
            return at(e, null, null, t)
        }, at.matchesSelector = function (e, t)
        {
            if ((e.ownerDocument || e) !== f && p(e), t = t.replace(Y, "='$1']"), !(!r.matchesSelector || !h || m && m.test(t) || g && g.test(t)))try
            {
                var n = y.call(e, t);
                if (n || r.disconnectedMatch || e.document && 11 !== e.document.nodeType)return n
            } catch (i)
            {
            }
            return at(t, f, null, [e]).length > 0
        }, at.contains = function (e, t)
        {
            return (e.ownerDocument || e) !== f && p(e), v(e, t)
        }, at.attr = function (e, n)
        {
            (e.ownerDocument || e) !== f && p(e);
            var i = o.attrHandle[n.toLowerCase()], a = i && L.call(o.attrHandle, n.toLowerCase()) ? i(e, n, !h) : t;
            return a === t ? r.attributes || !h ? e.getAttribute(n) : (a = e.getAttributeNode(n)) && a.specified ? a.value : null : a
        }, at.error = function (e)
        {
            throw Error("Syntax error, unrecognized expression: " + e)
        }, at.uniqueSort = function (e)
        {
            var t, n = [], i = 0, o = 0;
            if (S = !r.detectDuplicates, c = !r.sortStable && e.slice(0), e.sort(A), S)
            {
                while (t = e[o++])t === e[o] && (i = n.push(o));
                while (i--)e.splice(n[i], 1)
            }
            return e
        }, a = at.getText = function (e)
        {
            var t, n = "", r = 0, i = e.nodeType;
            if (i)
            {
                if (1 === i || 9 === i || 11 === i)
                {
                    if ("string" == typeof e.textContent)return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)n += a(e)
                } else if (3 === i || 4 === i)return e.nodeValue
            } else for (; t = e[r]; r++)n += a(t);
            return n
        }, o = at.selectors = {
            cacheLength: 50,
            createPseudo: lt,
            match: Q,
            attrHandle: {},
            find: {},
            relative: {
                ">": {dir: "parentNode", first: !0},
                " ": {dir: "parentNode"},
                "+": {dir: "previousSibling", first: !0},
                "~": {dir: "previousSibling"}
            },
            preFilter: {
                ATTR: function (e)
                {
                    return e[1] = e[1].replace(rt, it), e[3] = (e[4] || e[5] || "").replace(rt, it), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                }, CHILD: function (e)
                {
                    return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || at.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && at.error(e[0]), e
                }, PSEUDO: function (e)
                {
                    var n, r = !e[5] && e[2];
                    return Q.CHILD.test(e[0]) ? null : (e[3] && e[4] !== t ? e[2] = e[4] : r && J.test(r) && (n = mt(r, !0)) && (n = r.indexOf(")", r.length - n) - r.length) && (e[0] = e[0].slice(0, n), e[2] = r.slice(0, n)), e.slice(0, 3))
                }
            },
            filter: {
                TAG: function (e)
                {
                    var t = e.replace(rt, it).toLowerCase();
                    return "*" === e ? function ()
                    {
                        return !0
                    } : function (e)
                    {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                }, CLASS: function (e)
                {
                    var t = N[e + " "];
                    return t || (t = RegExp("(^|" + P + ")" + e + "(" + P + "|$)")) && N(e, function (e)
                        {
                            return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== j && e.getAttribute("class") || "")
                        })
                }, ATTR: function (e, t, n)
                {
                    return function (r)
                    {
                        var i = at.attr(r, e);
                        return null == i ? "!=" === t : t ? (i += "", "=" === t ? i === n : "!=" === t ? i !== n : "^=" === t ? n && 0 === i.indexOf(n) : "*=" === t ? n && i.indexOf(n) > -1 : "$=" === t ? n && i.slice(-n.length) === n : "~=" === t ? (" " + i + " ").indexOf(n) > -1 : "|=" === t ? i === n || i.slice(0, n.length + 1) === n + "-" : !1) : !0
                    }
                }, CHILD: function (e, t, n, r, i)
                {
                    var o = "nth" !== e.slice(0, 3), a = "last" !== e.slice(-4), s = "of-type" === t;
                    return 1 === r && 0 === i ? function (e)
                    {
                        return !!e.parentNode
                    } : function (t, n, l)
                    {
                        var u, c, p, f, d, h, g = o !== a ? "nextSibling" : "previousSibling", m = t.parentNode, y = s && t.nodeName.toLowerCase(), v = !l && !s;
                        if (m)
                        {
                            if (o)
                            {
                                while (g)
                                {
                                    p = t;
                                    while (p = p[g])if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType)return !1;
                                    h = g = "only" === e && !h && "nextSibling"
                                }
                                return !0
                            }
                            if (h = [a ? m.firstChild : m.lastChild], a && v)
                            {
                                c = m[b] || (m[b] = {}), u = c[e] || [], d = u[0] === T && u[1], f = u[0] === T && u[2], p = d && m.childNodes[d];
                                while (p = ++d && p && p[g] || (f = d = 0) || h.pop())if (1 === p.nodeType && ++f && p === t)
                                {
                                    c[e] = [T, d, f];
                                    break
                                }
                            } else if (v && (u = (t[b] || (t[b] = {}))[e]) && u[0] === T)f = u[1]; else while (p = ++d && p && p[g] || (f = d = 0) || h.pop())if ((s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType) && ++f && (v && ((p[b] || (p[b] = {}))[e] = [T, f]), p === t))break;
                            return f -= i, f === r || 0 === f % r && f / r >= 0
                        }
                    }
                }, PSEUDO: function (e, t)
                {
                    var n, r = o.pseudos[e] || o.setFilters[e.toLowerCase()] || at.error("unsupported pseudo: " + e);
                    return r[b] ? r(t) : r.length > 1 ? (n = [e, e, "", t], o.setFilters.hasOwnProperty(e.toLowerCase()) ? lt(function (e, n)
                    {
                        var i, o = r(e, t), a = o.length;
                        while (a--)i = F.call(e, o[a]), e[i] = !(n[i] = o[a])
                    }) : function (e)
                    {
                        return r(e, 0, n)
                    }) : r
                }
            },
            pseudos: {
                not: lt(function (e)
                {
                    var t = [], n = [], r = l(e.replace(z, "$1"));
                    return r[b] ? lt(function (e, t, n, i)
                    {
                        var o, a = r(e, null, i, []), s = e.length;
                        while (s--)(o = a[s]) && (e[s] = !(t[s] = o))
                    }) : function (e, i, o)
                    {
                        return t[0] = e, r(t, null, o, n), !n.pop()
                    }
                }), has: lt(function (e)
                {
                    return function (t)
                    {
                        return at(e, t).length > 0
                    }
                }), contains: lt(function (e)
                {
                    return function (t)
                    {
                        return (t.textContent || t.innerText || a(t)).indexOf(e) > -1
                    }
                }), lang: lt(function (e)
                {
                    return G.test(e || "") || at.error("unsupported lang: " + e), e = e.replace(rt, it).toLowerCase(), function (t)
                    {
                        var n;
                        do if (n = h ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
                }), target: function (t)
                {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                }, root: function (e)
                {
                    return e === d
                }, focus: function (e)
                {
                    return e === f.activeElement && (!f.hasFocus || f.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                }, enabled: function (e)
                {
                    return e.disabled === !1
                }, disabled: function (e)
                {
                    return e.disabled === !0
                }, checked: function (e)
                {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                }, selected: function (e)
                {
                    return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                }, empty: function (e)
                {
                    for (e = e.firstChild; e; e = e.nextSibling)if (e.nodeName > "@" || 3 === e.nodeType || 4 === e.nodeType)return !1;
                    return !0
                }, parent: function (e)
                {
                    return !o.pseudos.empty(e)
                }, header: function (e)
                {
                    return tt.test(e.nodeName)
                }, input: function (e)
                {
                    return et.test(e.nodeName)
                }, button: function (e)
                {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                }, text: function (e)
                {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || t.toLowerCase() === e.type)
                }, first: ht(function ()
                {
                    return [0]
                }), last: ht(function (e, t)
                {
                    return [t - 1]
                }), eq: ht(function (e, t, n)
                {
                    return [0 > n ? n + t : n]
                }), even: ht(function (e, t)
                {
                    var n = 0;
                    for (; t > n; n += 2)e.push(n);
                    return e
                }), odd: ht(function (e, t)
                {
                    var n = 1;
                    for (; t > n; n += 2)e.push(n);
                    return e
                }), lt: ht(function (e, t, n)
                {
                    var r = 0 > n ? n + t : n;
                    for (; --r >= 0;)e.push(r);
                    return e
                }), gt: ht(function (e, t, n)
                {
                    var r = 0 > n ? n + t : n;
                    for (; t > ++r;)e.push(r);
                    return e
                })
            }
        }, o.pseudos.nth = o.pseudos.eq;
        for (n in{radio: !0, checkbox: !0, file: !0, password: !0, image: !0})o.pseudos[n] = ft(n);
        for (n in{submit: !0, reset: !0})o.pseudos[n] = dt(n);
        function gt()
        {
        }

        gt.prototype = o.filters = o.pseudos, o.setFilters = new gt;
        function mt(e, t)
        {
            var n, r, i, a, s, l, u, c = k[e + " "];
            if (c)return t ? 0 : c.slice(0);
            s = e, l = [], u = o.preFilter;
            while (s)
            {
                (!n || (r = X.exec(s))) && (r && (s = s.slice(r[0].length) || s), l.push(i = [])), n = !1, (r = U.exec(s)) && (n = r.shift(), i.push({
                    value: n,
                    type: r[0].replace(z, " ")
                }), s = s.slice(n.length));
                for (a in o.filter)!(r = Q[a].exec(s)) || u[a] && !(r = u[a](r)) || (n = r.shift(), i.push({
                    value: n,
                    type: a,
                    matches: r
                }), s = s.slice(n.length));
                if (!n)break
            }
            return t ? s.length : s ? at.error(e) : k(e, l).slice(0)
        }

        function yt(e)
        {
            var t = 0, n = e.length, r = "";
            for (; n > t; t++)r += e[t].value;
            return r
        }

        function vt(e, t, n)
        {
            var r = t.dir, o = n && "parentNode" === r, a = C++;
            return t.first ? function (t, n, i)
            {
                while (t = t[r])if (1 === t.nodeType || o)return e(t, n, i)
            } : function (t, n, s)
            {
                var l, u, c, p = T + " " + a;
                if (s)
                {
                    while (t = t[r])if ((1 === t.nodeType || o) && e(t, n, s))return !0
                } else while (t = t[r])if (1 === t.nodeType || o)if (c = t[b] || (t[b] = {}), (u = c[r]) && u[0] === p)
                {
                    if ((l = u[1]) === !0 || l === i)return l === !0
                } else if (u = c[r] = [p], u[1] = e(t, n, s) || i, u[1] === !0)return !0
            }
        }

        function bt(e)
        {
            return e.length > 1 ? function (t, n, r)
            {
                var i = e.length;
                while (i--)if (!e[i](t, n, r))return !1;
                return !0
            } : e[0]
        }

        function xt(e, t, n, r, i)
        {
            var o, a = [], s = 0, l = e.length, u = null != t;
            for (; l > s; s++)(o = e[s]) && (!n || n(o, r, i)) && (a.push(o), u && t.push(s));
            return a
        }

        function wt(e, t, n, r, i, o)
        {
            return r && !r[b] && (r = wt(r)), i && !i[b] && (i = wt(i, o)), lt(function (o, a, s, l)
            {
                var u, c, p, f = [], d = [], h = a.length, g = o || Nt(t || "*", s.nodeType ? [s] : s, []), m = !e || !o && t ? g : xt(g, f, e, s, l), y = n ? i || (o ? e : h || r) ? [] : a : m;
                if (n && n(m, y, s, l), r)
                {
                    u = xt(y, d), r(u, [], s, l), c = u.length;
                    while (c--)(p = u[c]) && (y[d[c]] = !(m[d[c]] = p))
                }
                if (o)
                {
                    if (i || e)
                    {
                        if (i)
                        {
                            u = [], c = y.length;
                            while (c--)(p = y[c]) && u.push(m[c] = p);
                            i(null, y = [], u, l)
                        }
                        c = y.length;
                        while (c--)(p = y[c]) && (u = i ? F.call(o, p) : f[c]) > -1 && (o[u] = !(a[u] = p))
                    }
                } else y = xt(y === a ? y.splice(h, y.length) : y), i ? i(null, a, y, l) : M.apply(a, y)
            })
        }

        function Tt(e)
        {
            var t, n, r, i = e.length, a = o.relative[e[0].type], s = a || o.relative[" "], l = a ? 1 : 0, c = vt(function (e)
            {
                return e === t
            }, s, !0), p = vt(function (e)
            {
                return F.call(t, e) > -1
            }, s, !0), f = [function (e, n, r)
            {
                return !a && (r || n !== u) || ((t = n).nodeType ? c(e, n, r) : p(e, n, r))
            }];
            for (; i > l; l++)if (n = o.relative[e[l].type])f = [vt(bt(f), n)]; else
            {
                if (n = o.filter[e[l].type].apply(null, e[l].matches), n[b])
                {
                    for (r = ++l; i > r; r++)if (o.relative[e[r].type])break;
                    return wt(l > 1 && bt(f), l > 1 && yt(e.slice(0, l - 1).concat({value: " " === e[l - 2].type ? "*" : ""})).replace(z, "$1"), n, r > l && Tt(e.slice(l, r)), i > r && Tt(e = e.slice(r)), i > r && yt(e))
                }
                f.push(n)
            }
            return bt(f)
        }

        function Ct(e, t)
        {
            var n = 0, r = t.length > 0, a = e.length > 0, s = function (s, l, c, p, d)
            {
                var h, g, m, y = [], v = 0, b = "0", x = s && [], w = null != d, C = u, N = s || a && o.find.TAG("*", d && l.parentNode || l), k = T += null == C ? 1 : Math.random() || .1;
                for (w && (u = l !== f && l, i = n); null != (h = N[b]); b++)
                {
                    if (a && h)
                    {
                        g = 0;
                        while (m = e[g++])if (m(h, l, c))
                        {
                            p.push(h);
                            break
                        }
                        w && (T = k, i = ++n)
                    }
                    r && ((h = !m && h) && v--, s && x.push(h))
                }
                if (v += b, r && b !== v)
                {
                    g = 0;
                    while (m = t[g++])m(x, y, l, c);
                    if (s)
                    {
                        if (v > 0)while (b--)x[b] || y[b] || (y[b] = q.call(p));
                        y = xt(y)
                    }
                    M.apply(p, y), w && !s && y.length > 0 && v + t.length > 1 && at.uniqueSort(p)
                }
                return w && (T = k, u = C), x
            };
            return r ? lt(s) : s
        }

        l = at.compile = function (e, t)
        {
            var n, r = [], i = [], o = E[e + " "];
            if (!o)
            {
                t || (t = mt(e)), n = t.length;
                while (n--)o = Tt(t[n]), o[b] ? r.push(o) : i.push(o);
                o = E(e, Ct(i, r))
            }
            return o
        };
        function Nt(e, t, n)
        {
            var r = 0, i = t.length;
            for (; i > r; r++)at(e, t[r], n);
            return n
        }

        function kt(e, t, n, i)
        {
            var a, s, u, c, p, f = mt(e);
            if (!i && 1 === f.length)
            {
                if (s = f[0] = f[0].slice(0), s.length > 2 && "ID" === (u = s[0]).type && r.getById && 9 === t.nodeType && h && o.relative[s[1].type])
                {
                    if (t = (o.find.ID(u.matches[0].replace(rt, it), t) || [])[0], !t)return n;
                    e = e.slice(s.shift().value.length)
                }
                a = Q.needsContext.test(e) ? 0 : s.length;
                while (a--)
                {
                    if (u = s[a], o.relative[c = u.type])break;
                    if ((p = o.find[c]) && (i = p(u.matches[0].replace(rt, it), V.test(s[0].type) && t.parentNode || t)))
                    {
                        if (s.splice(a, 1), e = i.length && yt(s), !e)return M.apply(n, i), n;
                        break
                    }
                }
            }
            return l(e, f)(i, t, !h, n, V.test(e)), n
        }

        r.sortStable = b.split("").sort(A).join("") === b, r.detectDuplicates = S, p(), r.sortDetached = ut(function (e)
        {
            return 1 & e.compareDocumentPosition(f.createElement("div"))
        }), ut(function (e)
        {
            return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
        }) || ct("type|href|height|width", function (e, n, r)
        {
            return r ? t : e.getAttribute(n, "type" === n.toLowerCase() ? 1 : 2)
        }), r.attributes && ut(function (e)
        {
            return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
        }) || ct("value", function (e, n, r)
        {
            return r || "input" !== e.nodeName.toLowerCase() ? t : e.defaultValue
        }), ut(function (e)
        {
            return null == e.getAttribute("disabled")
        }) || ct(B, function (e, n, r)
        {
            var i;
            return r ? t : (i = e.getAttributeNode(n)) && i.specified ? i.value : e[n] === !0 ? n.toLowerCase() : null
        }), x.find = at, x.expr = at.selectors, x.expr[":"] = x.expr.pseudos, x.unique = at.uniqueSort, x.text = at.getText, x.isXMLDoc = at.isXML, x.contains = at.contains
    }(e);
    var O = {};

    function F(e)
    {
        var t = O[e] = {};
        return x.each(e.match(T) || [], function (e, n)
        {
            t[n] = !0
        }), t
    }

    x.Callbacks = function (e)
    {
        e = "string" == typeof e ? O[e] || F(e) : x.extend({}, e);
        var n, r, i, o, a, s, l = [], u = !e.once && [], c = function (t)
        {
            for (r = e.memory && t, i = !0, a = s || 0, s = 0, o = l.length, n = !0; l && o > a; a++)if (l[a].apply(t[0], t[1]) === !1 && e.stopOnFalse)
            {
                r = !1;
                break
            }
            n = !1, l && (u ? u.length && c(u.shift()) : r ? l = [] : p.disable())
        }, p = {
            add: function ()
            {
                if (l)
                {
                    var t = l.length;
                    (function i(t)
                    {
                        x.each(t, function (t, n)
                        {
                            var r = x.type(n);
                            "function" === r ? e.unique && p.has(n) || l.push(n) : n && n.length && "string" !== r && i(n)
                        })
                    })(arguments), n ? o = l.length : r && (s = t, c(r))
                }
                return this
            }, remove: function ()
            {
                return l && x.each(arguments, function (e, t)
                {
                    var r;
                    while ((r = x.inArray(t, l, r)) > -1)l.splice(r, 1), n && (o >= r && o--, a >= r && a--)
                }), this
            }, has: function (e)
            {
                return e ? x.inArray(e, l) > -1 : !(!l || !l.length)
            }, empty: function ()
            {
                return l = [], o = 0, this
            }, disable: function ()
            {
                return l = u = r = t, this
            }, disabled: function ()
            {
                return !l
            }, lock: function ()
            {
                return u = t, r || p.disable(), this
            }, locked: function ()
            {
                return !u
            }, fireWith: function (e, t)
            {
                return !l || i && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], n ? u.push(t) : c(t)), this
            }, fire: function ()
            {
                return p.fireWith(this, arguments), this
            }, fired: function ()
            {
                return !!i
            }
        };
        return p
    }, x.extend({
        Deferred: function (e)
        {
            var t = [["resolve", "done", x.Callbacks("once memory"), "resolved"], ["reject", "fail", x.Callbacks("once memory"), "rejected"], ["notify", "progress", x.Callbacks("memory")]], n = "pending", r = {
                state: function ()
                {
                    return n
                }, always: function ()
                {
                    return i.done(arguments).fail(arguments), this
                }, then: function ()
                {
                    var e = arguments;
                    return x.Deferred(function (n)
                    {
                        x.each(t, function (t, o)
                        {
                            var a = o[0], s = x.isFunction(e[t]) && e[t];
                            i[o[1]](function ()
                            {
                                var e = s && s.apply(this, arguments);
                                e && x.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[a + "With"](this === r ? n.promise() : this, s ? [e] : arguments)
                            })
                        }), e = null
                    }).promise()
                }, promise: function (e)
                {
                    return null != e ? x.extend(e, r) : r
                }
            }, i = {};
            return r.pipe = r.then, x.each(t, function (e, o)
            {
                var a = o[2], s = o[3];
                r[o[1]] = a.add, s && a.add(function ()
                {
                    n = s
                }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function ()
                {
                    return i[o[0] + "With"](this === i ? r : this, arguments), this
                }, i[o[0] + "With"] = a.fireWith
            }), r.promise(i), e && e.call(i, i), i
        }, when: function (e)
        {
            var t = 0, n = g.call(arguments), r = n.length, i = 1 !== r || e && x.isFunction(e.promise) ? r : 0, o = 1 === i ? e : x.Deferred(), a = function (e, t, n)
            {
                return function (r)
                {
                    t[e] = this, n[e] = arguments.length > 1 ? g.call(arguments) : r, n === s ? o.notifyWith(t, n) : --i || o.resolveWith(t, n)
                }
            }, s, l, u;
            if (r > 1)for (s = Array(r), l = Array(r), u = Array(r); r > t; t++)n[t] && x.isFunction(n[t].promise) ? n[t].promise().done(a(t, u, n)).fail(o.reject).progress(a(t, l, s)) : --i;
            return i || o.resolveWith(u, n), o.promise()
        }
    }), x.support = function (t)
    {
        var n, r, o, s, l, u, c, p, f, d = a.createElement("div");
        if (d.setAttribute("className", "t"), d.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = d.getElementsByTagName("*") || [], r = d.getElementsByTagName("a")[0], !r || !r.style || !n.length)return t;
        s = a.createElement("select"), u = s.appendChild(a.createElement("option")), o = d.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t.getSetAttribute = "t" !== d.className, t.leadingWhitespace = 3 === d.firstChild.nodeType, t.tbody = !d.getElementsByTagName("tbody").length, t.htmlSerialize = !!d.getElementsByTagName("link").length, t.style = /top/.test(r.getAttribute("style")), t.hrefNormalized = "/a" === r.getAttribute("href"), t.opacity = /^0.5/.test(r.style.opacity), t.cssFloat = !!r.style.cssFloat, t.checkOn = !!o.value, t.optSelected = u.selected, t.enctype = !!a.createElement("form").enctype, t.html5Clone = "<:nav></:nav>" !== a.createElement("nav").cloneNode(!0).outerHTML, t.inlineBlockNeedsLayout = !1, t.shrinkWrapBlocks = !1, t.pixelPosition = !1, t.deleteExpando = !0, t.noCloneEvent = !0, t.reliableMarginRight = !0, t.boxSizingReliable = !0, o.checked = !0, t.noCloneChecked = o.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !u.disabled;
        try
        {
            delete d.test
        } catch (h)
        {
            t.deleteExpando = !1
        }
        o = a.createElement("input"), o.setAttribute("value", ""), t.input = "" === o.getAttribute("value"), o.value = "t", o.setAttribute("type", "radio"), t.radioValue = "t" === o.value, o.setAttribute("checked", "t"), o.setAttribute("name", "t"), l = a.createDocumentFragment(), l.appendChild(o), t.appendChecked = o.checked, t.checkClone = l.cloneNode(!0).cloneNode(!0).lastChild.checked, d.attachEvent && (d.attachEvent("onclick", function ()
        {
            t.noCloneEvent = !1
        }), d.cloneNode(!0).click());
        for (f in{
            submit: !0,
            change: !0,
            focusin: !0
        })d.setAttribute(c = "on" + f, "t"), t[f + "Bubbles"] = c in e || d.attributes[c].expando === !1;
        d.style.backgroundClip = "content-box", d.cloneNode(!0).style.backgroundClip = "", t.clearCloneStyle = "content-box" === d.style.backgroundClip;
        for (f in x(t))break;
        return t.ownLast = "0" !== f, x(function ()
        {
            var n, r, o, s = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;", l = a.getElementsByTagName("body")[0];
            l && (n = a.createElement("div"), n.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", l.appendChild(n).appendChild(d), d.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", o = d.getElementsByTagName("td"), o[0].style.cssText = "padding:0;margin:0;border:0;display:none", p = 0 === o[0].offsetHeight, o[0].style.display = "", o[1].style.display = "none", t.reliableHiddenOffsets = p && 0 === o[0].offsetHeight, d.innerHTML = "", d.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", x.swap(l, null != l.style.zoom ? {zoom: 1} : {}, function ()
            {
                t.boxSizing = 4 === d.offsetWidth
            }), e.getComputedStyle && (t.pixelPosition = "1%" !== (e.getComputedStyle(d, null) || {}).top, t.boxSizingReliable = "4px" === (e.getComputedStyle(d, null) || {width: "4px"}).width, r = d.appendChild(a.createElement("div")), r.style.cssText = d.style.cssText = s, r.style.marginRight = r.style.width = "0", d.style.width = "1px", t.reliableMarginRight = !parseFloat((e.getComputedStyle(r, null) || {}).marginRight)), typeof d.style.zoom !== i && (d.innerHTML = "", d.style.cssText = s + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = 3 === d.offsetWidth, d.style.display = "block", d.innerHTML = "<div></div>", d.firstChild.style.width = "5px", t.shrinkWrapBlocks = 3 !== d.offsetWidth, t.inlineBlockNeedsLayout && (l.style.zoom = 1)), l.removeChild(n), n = d = o = r = null)
        }), n = s = l = u = r = o = null, t
    }({});
    var B = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, P = /([A-Z])/g;

    function R(e, n, r, i)
    {
        if (x.acceptData(e))
        {
            var o, a, s = x.expando, l = e.nodeType, u = l ? x.cache : e, c = l ? e[s] : e[s] && s;
            if (c && u[c] && (i || u[c].data) || r !== t || "string" != typeof n)return c || (c = l ? e[s] = p.pop() || x.guid++ : s), u[c] || (u[c] = l ? {} : {toJSON: x.noop}), ("object" == typeof n || "function" == typeof n) && (i ? u[c] = x.extend(u[c], n) : u[c].data = x.extend(u[c].data, n)), a = u[c], i || (a.data || (a.data = {}), a = a.data), r !== t && (a[x.camelCase(n)] = r), "string" == typeof n ? (o = a[n], null == o && (o = a[x.camelCase(n)])) : o = a, o
        }
    }

    function W(e, t, n)
    {
        if (x.acceptData(e))
        {
            var r, i, o = e.nodeType, a = o ? x.cache : e, s = o ? e[x.expando] : x.expando;
            if (a[s])
            {
                if (t && (r = n ? a[s] : a[s].data))
                {
                    x.isArray(t) ? t = t.concat(x.map(t, x.camelCase)) : t in r ? t = [t] : (t = x.camelCase(t), t = t in r ? [t] : t.split(" ")), i = t.length;
                    while (i--)delete r[t[i]];
                    if (n ? !I(r) : !x.isEmptyObject(r))return
                }
                (n || (delete a[s].data, I(a[s]))) && (o ? x.cleanData([e], !0) : x.support.deleteExpando || a != a.window ? delete a[s] : a[s] = null)
            }
        }
    }

    x.extend({
        cache: {},
        noData: {applet: !0, embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},
        hasData: function (e)
        {
            return e = e.nodeType ? x.cache[e[x.expando]] : e[x.expando], !!e && !I(e)
        },
        data: function (e, t, n)
        {
            return R(e, t, n)
        },
        removeData: function (e, t)
        {
            return W(e, t)
        },
        _data: function (e, t, n)
        {
            return R(e, t, n, !0)
        },
        _removeData: function (e, t)
        {
            return W(e, t, !0)
        },
        acceptData: function (e)
        {
            if (e.nodeType && 1 !== e.nodeType && 9 !== e.nodeType)return !1;
            var t = e.nodeName && x.noData[e.nodeName.toLowerCase()];
            return !t || t !== !0 && e.getAttribute("classid") === t
        }
    }), x.fn.extend({
        data: function (e, n)
        {
            var r, i, o = null, a = 0, s = this[0];
            if (e === t)
            {
                if (this.length && (o = x.data(s), 1 === s.nodeType && !x._data(s, "parsedAttrs")))
                {
                    for (r = s.attributes; r.length > a; a++)i = r[a].name, 0 === i.indexOf("data-") && (i = x.camelCase(i.slice(5)), $(s, i, o[i]));
                    x._data(s, "parsedAttrs", !0)
                }
                return o
            }
            return "object" == typeof e ? this.each(function ()
            {
                x.data(this, e)
            }) : arguments.length > 1 ? this.each(function ()
            {
                x.data(this, e, n)
            }) : s ? $(s, e, x.data(s, e)) : null
        }, removeData: function (e)
        {
            return this.each(function ()
            {
                x.removeData(this, e)
            })
        }
    });
    function $(e, n, r)
    {
        if (r === t && 1 === e.nodeType)
        {
            var i = "data-" + n.replace(P, "-$1").toLowerCase();
            if (r = e.getAttribute(i), "string" == typeof r)
            {
                try
                {
                    r = "true" === r ? !0 : "false" === r ? !1 : "null" === r ? null : +r + "" === r ? +r : B.test(r) ? x.parseJSON(r) : r
                } catch (o)
                {
                }
                x.data(e, n, r)
            } else r = t
        }
        return r
    }

    function I(e)
    {
        var t;
        for (t in e)if (("data" !== t || !x.isEmptyObject(e[t])) && "toJSON" !== t)return !1;
        return !0
    }

    x.extend({
        queue: function (e, n, r)
        {
            var i;
            return e ? (n = (n || "fx") + "queue", i = x._data(e, n), r && (!i || x.isArray(r) ? i = x._data(e, n, x.makeArray(r)) : i.push(r)), i || []) : t
        }, dequeue: function (e, t)
        {
            t = t || "fx";
            var n = x.queue(e, t), r = n.length, i = n.shift(), o = x._queueHooks(e, t), a = function ()
            {
                x.dequeue(e, t)
            };
            "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
        }, _queueHooks: function (e, t)
        {
            var n = t + "queueHooks";
            return x._data(e, n) || x._data(e, n, {
                    empty: x.Callbacks("once memory").add(function ()
                    {
                        x._removeData(e, t + "queue"), x._removeData(e, n)
                    })
                })
        }
    }), x.fn.extend({
        queue: function (e, n)
        {
            var r = 2;
            return "string" != typeof e && (n = e, e = "fx", r--), r > arguments.length ? x.queue(this[0], e) : n === t ? this : this.each(function ()
            {
                var t = x.queue(this, e, n);
                x._queueHooks(this, e), "fx" === e && "inprogress" !== t[0] && x.dequeue(this, e)
            })
        }, dequeue: function (e)
        {
            return this.each(function ()
            {
                x.dequeue(this, e)
            })
        }, delay: function (e, t)
        {
            return e = x.fx ? x.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n)
            {
                var r = setTimeout(t, e);
                n.stop = function ()
                {
                    clearTimeout(r)
                }
            })
        }, clearQueue: function (e)
        {
            return this.queue(e || "fx", [])
        }, promise: function (e, n)
        {
            var r, i = 1, o = x.Deferred(), a = this, s = this.length, l = function ()
            {
                --i || o.resolveWith(a, [a])
            };
            "string" != typeof e && (n = e, e = t), e = e || "fx";
            while (s--)r = x._data(a[s], e + "queueHooks"), r && r.empty && (i++, r.empty.add(l));
            return l(), o.promise(n)
        }
    });
    var z, X, U = /[\t\r\n\f]/g, V = /\r/g, Y = /^(?:input|select|textarea|button|object)$/i, J = /^(?:a|area)$/i, G = /^(?:checked|selected)$/i, Q = x.support.getSetAttribute, K = x.support.input;
    x.fn.extend({
        attr: function (e, t)
        {
            return x.access(this, x.attr, e, t, arguments.length > 1)
        }, removeAttr: function (e)
        {
            return this.each(function ()
            {
                x.removeAttr(this, e)
            })
        }, prop: function (e, t)
        {
            return x.access(this, x.prop, e, t, arguments.length > 1)
        }, removeProp: function (e)
        {
            return e = x.propFix[e] || e, this.each(function ()
            {
                try
                {
                    this[e] = t, delete this[e]
                } catch (n)
                {
                }
            })
        }, addClass: function (e)
        {
            var t, n, r, i, o, a = 0, s = this.length, l = "string" == typeof e && e;
            if (x.isFunction(e))return this.each(function (t)
            {
                x(this).addClass(e.call(this, t, this.className))
            });
            if (l)for (t = (e || "").match(T) || []; s > a; a++)if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : " "))
            {
                o = 0;
                while (i = t[o++])0 > r.indexOf(" " + i + " ") && (r += i + " ");
                n.className = x.trim(r)
            }
            return this
        }, removeClass: function (e)
        {
            var t, n, r, i, o, a = 0, s = this.length, l = 0 === arguments.length || "string" == typeof e && e;
            if (x.isFunction(e))return this.each(function (t)
            {
                x(this).removeClass(e.call(this, t, this.className))
            });
            if (l)for (t = (e || "").match(T) || []; s > a; a++)if (n = this[a], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(U, " ") : ""))
            {
                o = 0;
                while (i = t[o++])while (r.indexOf(" " + i + " ") >= 0)r = r.replace(" " + i + " ", " ");
                n.className = e ? x.trim(r) : ""
            }
            return this
        }, toggleClass: function (e, t)
        {
            var n = typeof e;
            return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : x.isFunction(e) ? this.each(function (n)
            {
                x(this).toggleClass(e.call(this, n, this.className, t), t)
            }) : this.each(function ()
            {
                if ("string" === n)
                {
                    var t, r = 0, o = x(this), a = e.match(T) || [];
                    while (t = a[r++])o.hasClass(t) ? o.removeClass(t) : o.addClass(t)
                } else(n === i || "boolean" === n) && (this.className && x._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : x._data(this, "__className__") || "")
            })
        }, hasClass: function (e)
        {
            var t = " " + e + " ", n = 0, r = this.length;
            for (; r > n; n++)if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(U, " ").indexOf(t) >= 0)return !0;
            return !1
        }, val: function (e)
        {
            var n, r, i, o = this[0];
            {
                if (arguments.length)return i = x.isFunction(e), this.each(function (n)
                {
                    var o;
                    1 === this.nodeType && (o = i ? e.call(this, n, x(this).val()) : e, null == o ? o = "" : "number" == typeof o ? o += "" : x.isArray(o) && (o = x.map(o, function (e)
                    {
                        return null == e ? "" : e + ""
                    })), r = x.valHooks[this.type] || x.valHooks[this.nodeName.toLowerCase()], r && "set" in r && r.set(this, o, "value") !== t || (this.value = o))
                });
                if (o)return r = x.valHooks[o.type] || x.valHooks[o.nodeName.toLowerCase()], r && "get" in r && (n = r.get(o, "value")) !== t ? n : (n = o.value, "string" == typeof n ? n.replace(V, "") : null == n ? "" : n)
            }
        }
    }), x.extend({
        valHooks: {
            option: {
                get: function (e)
                {
                    var t = x.find.attr(e, "value");
                    return null != t ? t : e.text
                }
            }, select: {
                get: function (e)
                {
                    var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, l = 0 > i ? s : o ? i : 0;
                    for (; s > l; l++)if (n = r[l], !(!n.selected && l !== i || (x.support.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && x.nodeName(n.parentNode, "optgroup")))
                    {
                        if (t = x(n).val(), o)return t;
                        a.push(t)
                    }
                    return a
                }, set: function (e, t)
                {
                    var n, r, i = e.options, o = x.makeArray(t), a = i.length;
                    while (a--)r = i[a], (r.selected = x.inArray(x(r).val(), o) >= 0) && (n = !0);
                    return n || (e.selectedIndex = -1), o
                }
            }
        }, attr: function (e, n, r)
        {
            var o, a, s = e.nodeType;
            if (e && 3 !== s && 8 !== s && 2 !== s)return typeof e.getAttribute === i ? x.prop(e, n, r) : (1 === s && x.isXMLDoc(e) || (n = n.toLowerCase(), o = x.attrHooks[n] || (x.expr.match.bool.test(n) ? X : z)), r === t ? o && "get" in o && null !== (a = o.get(e, n)) ? a : (a = x.find.attr(e, n), null == a ? t : a) : null !== r ? o && "set" in o && (a = o.set(e, r, n)) !== t ? a : (e.setAttribute(n, r + ""), r) : (x.removeAttr(e, n), t))
        }, removeAttr: function (e, t)
        {
            var n, r, i = 0, o = t && t.match(T);
            if (o && 1 === e.nodeType)while (n = o[i++])r = x.propFix[n] || n, x.expr.match.bool.test(n) ? K && Q || !G.test(n) ? e[r] = !1 : e[x.camelCase("default-" + n)] = e[r] = !1 : x.attr(e, n, ""), e.removeAttribute(Q ? n : r)
        }, attrHooks: {
            type: {
                set: function (e, t)
                {
                    if (!x.support.radioValue && "radio" === t && x.nodeName(e, "input"))
                    {
                        var n = e.value;
                        return e.setAttribute("type", t), n && (e.value = n), t
                    }
                }
            }
        }, propFix: {"for": "htmlFor", "class": "className"}, prop: function (e, n, r)
        {
            var i, o, a, s = e.nodeType;
            if (e && 3 !== s && 8 !== s && 2 !== s)return a = 1 !== s || !x.isXMLDoc(e), a && (n = x.propFix[n] || n, o = x.propHooks[n]), r !== t ? o && "set" in o && (i = o.set(e, r, n)) !== t ? i : e[n] = r : o && "get" in o && null !== (i = o.get(e, n)) ? i : e[n]
        }, propHooks: {
            tabIndex: {
                get: function (e)
                {
                    var t = x.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : Y.test(e.nodeName) || J.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        }
    }), X = {
        set: function (e, t, n)
        {
            return t === !1 ? x.removeAttr(e, n) : K && Q || !G.test(n) ? e.setAttribute(!Q && x.propFix[n] || n, n) : e[x.camelCase("default-" + n)] = e[n] = !0, n
        }
    }, x.each(x.expr.match.bool.source.match(/\w+/g), function (e, n)
    {
        var r = x.expr.attrHandle[n] || x.find.attr;
        x.expr.attrHandle[n] = K && Q || !G.test(n) ? function (e, n, i)
        {
            var o = x.expr.attrHandle[n], a = i ? t : (x.expr.attrHandle[n] = t) != r(e, n, i) ? n.toLowerCase() : null;
            return x.expr.attrHandle[n] = o, a
        } : function (e, n, r)
        {
            return r ? t : e[x.camelCase("default-" + n)] ? n.toLowerCase() : null
        }
    }), K && Q || (x.attrHooks.value = {
        set: function (e, n, r)
        {
            return x.nodeName(e, "input") ? (e.defaultValue = n, t) : z && z.set(e, n, r)
        }
    }), Q || (z = {
        set: function (e, n, r)
        {
            var i = e.getAttributeNode(r);
            return i || e.setAttributeNode(i = e.ownerDocument.createAttribute(r)), i.value = n += "", "value" === r || n === e.getAttribute(r) ? n : t
        }
    }, x.expr.attrHandle.id = x.expr.attrHandle.name = x.expr.attrHandle.coords = function (e, n, r)
    {
        var i;
        return r ? t : (i = e.getAttributeNode(n)) && "" !== i.value ? i.value : null
    }, x.valHooks.button = {
        get: function (e, n)
        {
            var r = e.getAttributeNode(n);
            return r && r.specified ? r.value : t
        }, set: z.set
    }, x.attrHooks.contenteditable = {
        set: function (e, t, n)
        {
            z.set(e, "" === t ? !1 : t, n)
        }
    }, x.each(["width", "height"], function (e, n)
    {
        x.attrHooks[n] = {
            set: function (e, r)
            {
                return "" === r ? (e.setAttribute(n, "auto"), r) : t
            }
        }
    })), x.support.hrefNormalized || x.each(["href", "src"], function (e, t)
    {
        x.propHooks[t] = {
            get: function (e)
            {
                return e.getAttribute(t, 4)
            }
        }
    }), x.support.style || (x.attrHooks.style = {
        get: function (e)
        {
            return e.style.cssText || t
        }, set: function (e, t)
        {
            return e.style.cssText = t + ""
        }
    }), x.support.optSelected || (x.propHooks.selected = {
        get: function (e)
        {
            var t = e.parentNode;
            return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
        }
    }), x.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function ()
    {
        x.propFix[this.toLowerCase()] = this
    }), x.support.enctype || (x.propFix.enctype = "encoding"), x.each(["radio", "checkbox"], function ()
    {
        x.valHooks[this] = {
            set: function (e, n)
            {
                return x.isArray(n) ? e.checked = x.inArray(x(e).val(), n) >= 0 : t
            }
        }, x.support.checkOn || (x.valHooks[this].get = function (e)
        {
            return null === e.getAttribute("value") ? "on" : e.value
        })
    });
    var Z = /^(?:input|select|textarea)$/i, et = /^key/, tt = /^(?:mouse|contextmenu)|click/, nt = /^(?:focusinfocus|focusoutblur)$/, rt = /^([^.]*)(?:\.(.+)|)$/;

    function it()
    {
        return !0
    }

    function ot()
    {
        return !1
    }

    function at()
    {
        try
        {
            return a.activeElement
        } catch (e)
        {
        }
    }

    x.event = {
        global: {},
        add: function (e, n, r, o, a)
        {
            var s, l, u, c, p, f, d, h, g, m, y, v = x._data(e);
            if (v)
            {
                r.handler && (c = r, r = c.handler, a = c.selector), r.guid || (r.guid = x.guid++), (l = v.events) || (l = v.events = {}), (f = v.handle) || (f = v.handle = function (e)
                {
                    return typeof x === i || e && x.event.triggered === e.type ? t : x.event.dispatch.apply(f.elem, arguments)
                }, f.elem = e), n = (n || "").match(T) || [""], u = n.length;
                while (u--)s = rt.exec(n[u]) || [], g = y = s[1], m = (s[2] || "").split(".").sort(), g && (p = x.event.special[g] || {}, g = (a ? p.delegateType : p.bindType) || g, p = x.event.special[g] || {}, d = x.extend({
                    type: g,
                    origType: y,
                    data: o,
                    handler: r,
                    guid: r.guid,
                    selector: a,
                    needsContext: a && x.expr.match.needsContext.test(a),
                    namespace: m.join(".")
                }, c), (h = l[g]) || (h = l[g] = [], h.delegateCount = 0, p.setup && p.setup.call(e, o, m, f) !== !1 || (e.addEventListener ? e.addEventListener(g, f, !1) : e.attachEvent && e.attachEvent("on" + g, f))), p.add && (p.add.call(e, d), d.handler.guid || (d.handler.guid = r.guid)), a ? h.splice(h.delegateCount++, 0, d) : h.push(d), x.event.global[g] = !0);
                e = null
            }
        },
        remove: function (e, t, n, r, i)
        {
            var o, a, s, l, u, c, p, f, d, h, g, m = x.hasData(e) && x._data(e);
            if (m && (c = m.events))
            {
                t = (t || "").match(T) || [""], u = t.length;
                while (u--)if (s = rt.exec(t[u]) || [], d = g = s[1], h = (s[2] || "").split(".").sort(), d)
                {
                    p = x.event.special[d] || {}, d = (r ? p.delegateType : p.bindType) || d, f = c[d] || [], s = s[2] && RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"), l = o = f.length;
                    while (o--)a = f[o], !i && g !== a.origType || n && n.guid !== a.guid || s && !s.test(a.namespace) || r && r !== a.selector && ("**" !== r || !a.selector) || (f.splice(o, 1), a.selector && f.delegateCount--, p.remove && p.remove.call(e, a));
                    l && !f.length && (p.teardown && p.teardown.call(e, h, m.handle) !== !1 || x.removeEvent(e, d, m.handle), delete c[d])
                } else for (d in c)x.event.remove(e, d + t[u], n, r, !0);
                x.isEmptyObject(c) && (delete m.handle, x._removeData(e, "events"))
            }
        },
        trigger: function (n, r, i, o)
        {
            var s, l, u, c, p, f, d, h = [i || a], g = v.call(n, "type") ? n.type : n, m = v.call(n, "namespace") ? n.namespace.split(".") : [];
            if (u = f = i = i || a, 3 !== i.nodeType && 8 !== i.nodeType && !nt.test(g + x.event.triggered) && (g.indexOf(".") >= 0 && (m = g.split("."), g = m.shift(), m.sort()), l = 0 > g.indexOf(":") && "on" + g, n = n[x.expando] ? n : new x.Event(g, "object" == typeof n && n), n.isTrigger = o ? 2 : 3, n.namespace = m.join("."), n.namespace_re = n.namespace ? RegExp("(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, n.result = t, n.target || (n.target = i), r = null == r ? [n] : x.makeArray(r, [n]), p = x.event.special[g] || {}, o || !p.trigger || p.trigger.apply(i, r) !== !1))
            {
                if (!o && !p.noBubble && !x.isWindow(i))
                {
                    for (c = p.delegateType || g, nt.test(c + g) || (u = u.parentNode); u; u = u.parentNode)h.push(u), f = u;
                    f === (i.ownerDocument || a) && h.push(f.defaultView || f.parentWindow || e)
                }
                d = 0;
                while ((u = h[d++]) && !n.isPropagationStopped())n.type = d > 1 ? c : p.bindType || g, s = (x._data(u, "events") || {})[n.type] && x._data(u, "handle"), s && s.apply(u, r), s = l && u[l], s && x.acceptData(u) && s.apply && s.apply(u, r) === !1 && n.preventDefault();
                if (n.type = g, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(h.pop(), r) === !1) && x.acceptData(i) && l && i[g] && !x.isWindow(i))
                {
                    f = i[l], f && (i[l] = null), x.event.triggered = g;
                    try
                    {
                        i[g]()
                    } catch (y)
                    {
                    }
                    x.event.triggered = t, f && (i[l] = f)
                }
                return n.result
            }
        },
        dispatch: function (e)
        {
            e = x.event.fix(e);
            var n, r, i, o, a, s = [], l = g.call(arguments), u = (x._data(this, "events") || {})[e.type] || [], c = x.event.special[e.type] || {};
            if (l[0] = e, e.delegateTarget = this, !c.preDispatch || c.preDispatch.call(this, e) !== !1)
            {
                s = x.event.handlers.call(this, e, u), n = 0;
                while ((o = s[n++]) && !e.isPropagationStopped())
                {
                    e.currentTarget = o.elem, a = 0;
                    while ((i = o.handlers[a++]) && !e.isImmediatePropagationStopped())(!e.namespace_re || e.namespace_re.test(i.namespace)) && (e.handleObj = i, e.data = i.data, r = ((x.event.special[i.origType] || {}).handle || i.handler).apply(o.elem, l), r !== t && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()))
                }
                return c.postDispatch && c.postDispatch.call(this, e), e.result
            }
        },
        handlers: function (e, n)
        {
            var r, i, o, a, s = [], l = n.delegateCount, u = e.target;
            if (l && u.nodeType && (!e.button || "click" !== e.type))for (; u != this; u = u.parentNode || this)if (1 === u.nodeType && (u.disabled !== !0 || "click" !== e.type))
            {
                for (o = [], a = 0; l > a; a++)i = n[a], r = i.selector + " ", o[r] === t && (o[r] = i.needsContext ? x(r, this).index(u) >= 0 : x.find(r, this, null, [u]).length), o[r] && o.push(i);
                o.length && s.push({elem: u, handlers: o})
            }
            return n.length > l && s.push({elem: this, handlers: n.slice(l)}), s
        },
        fix: function (e)
        {
            if (e[x.expando])return e;
            var t, n, r, i = e.type, o = e, s = this.fixHooks[i];
            s || (this.fixHooks[i] = s = tt.test(i) ? this.mouseHooks : et.test(i) ? this.keyHooks : {}), r = s.props ? this.props.concat(s.props) : this.props, e = new x.Event(o), t = r.length;
            while (t--)n = r[t], e[n] = o[n];
            return e.target || (e.target = o.srcElement || a), 3 === e.target.nodeType && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, o) : e
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "), filter: function (e, t)
            {
                return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (e, n)
            {
                var r, i, o, s = n.button, l = n.fromElement;
                return null == e.pageX && null != n.clientX && (i = e.target.ownerDocument || a, o = i.documentElement, r = i.body, e.pageX = n.clientX + (o && o.scrollLeft || r && r.scrollLeft || 0) - (o && o.clientLeft || r && r.clientLeft || 0), e.pageY = n.clientY + (o && o.scrollTop || r && r.scrollTop || 0) - (o && o.clientTop || r && r.clientTop || 0)), !e.relatedTarget && l && (e.relatedTarget = l === e.target ? n.toElement : l), e.which || s === t || (e.which = 1 & s ? 1 : 2 & s ? 3 : 4 & s ? 2 : 0), e
            }
        },
        special: {
            load: {noBubble: !0}, focus: {
                trigger: function ()
                {
                    if (this !== at() && this.focus)try
                    {
                        return this.focus(), !1
                    } catch (e)
                    {
                    }
                }, delegateType: "focusin"
            }, blur: {
                trigger: function ()
                {
                    return this === at() && this.blur ? (this.blur(), !1) : t
                }, delegateType: "focusout"
            }, click: {
                trigger: function ()
                {
                    return x.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : t
                }, _default: function (e)
                {
                    return x.nodeName(e.target, "a")
                }
            }, beforeunload: {
                postDispatch: function (e)
                {
                    e.result !== t && (e.originalEvent.returnValue = e.result)
                }
            }
        },
        simulate: function (e, t, n, r)
        {
            var i = x.extend(new x.Event, n, {type: e, isSimulated: !0, originalEvent: {}});
            r ? x.event.trigger(i, null, t) : x.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
        }
    }, x.removeEvent = a.removeEventListener ? function (e, t, n)
    {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function (e, t, n)
    {
        var r = "on" + t;
        e.detachEvent && (typeof e[r] === i && (e[r] = null), e.detachEvent(r, n))
    }, x.Event = function (e, n)
    {
        return this instanceof x.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? it : ot) : this.type = e, n && x.extend(this, n), this.timeStamp = e && e.timeStamp || x.now(), this[x.expando] = !0, t) : new x.Event(e, n)
    }, x.Event.prototype = {
        isDefaultPrevented: ot,
        isPropagationStopped: ot,
        isImmediatePropagationStopped: ot,
        preventDefault: function ()
        {
            var e = this.originalEvent;
            this.isDefaultPrevented = it, e && (e.preventDefault ? e.preventDefault() : e.returnValue = !1)
        },
        stopPropagation: function ()
        {
            var e = this.originalEvent;
            this.isPropagationStopped = it, e && (e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0)
        },
        stopImmediatePropagation: function ()
        {
            this.isImmediatePropagationStopped = it, this.stopPropagation()
        }
    }, x.each({mouseenter: "mouseover", mouseleave: "mouseout"}, function (e, t)
    {
        x.event.special[e] = {
            delegateType: t, bindType: t, handle: function (e)
            {
                var n, r = this, i = e.relatedTarget, o = e.handleObj;
                return (!i || i !== r && !x.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
            }
        }
    }), x.support.submitBubbles || (x.event.special.submit = {
        setup: function ()
        {
            return x.nodeName(this, "form") ? !1 : (x.event.add(this, "click._submit keypress._submit", function (e)
            {
                var n = e.target, r = x.nodeName(n, "input") || x.nodeName(n, "button") ? n.form : t;
                r && !x._data(r, "submitBubbles") && (x.event.add(r, "submit._submit", function (e)
                {
                    e._submit_bubble = !0
                }), x._data(r, "submitBubbles", !0))
            }), t)
        }, postDispatch: function (e)
        {
            e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && x.event.simulate("submit", this.parentNode, e, !0))
        }, teardown: function ()
        {
            return x.nodeName(this, "form") ? !1 : (x.event.remove(this, "._submit"), t)
        }
    }), x.support.changeBubbles || (x.event.special.change = {
        setup: function ()
        {
            return Z.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (x.event.add(this, "propertychange._change", function (e)
            {
                "checked" === e.originalEvent.propertyName && (this._just_changed = !0)
            }), x.event.add(this, "click._change", function (e)
            {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), x.event.simulate("change", this, e, !0)
            })), !1) : (x.event.add(this, "beforeactivate._change", function (e)
            {
                var t = e.target;
                Z.test(t.nodeName) && !x._data(t, "changeBubbles") && (x.event.add(t, "change._change", function (e)
                {
                    !this.parentNode || e.isSimulated || e.isTrigger || x.event.simulate("change", this.parentNode, e, !0)
                }), x._data(t, "changeBubbles", !0))
            }), t)
        }, handle: function (e)
        {
            var n = e.target;
            return this !== n || e.isSimulated || e.isTrigger || "radio" !== n.type && "checkbox" !== n.type ? e.handleObj.handler.apply(this, arguments) : t
        }, teardown: function ()
        {
            return x.event.remove(this, "._change"), !Z.test(this.nodeName)
        }
    }), x.support.focusinBubbles || x.each({focus: "focusin", blur: "focusout"}, function (e, t)
    {
        var n = 0, r = function (e)
        {
            x.event.simulate(t, e.target, x.event.fix(e), !0)
        };
        x.event.special[t] = {
            setup: function ()
            {
                0 === n++ && a.addEventListener(e, r, !0)
            }, teardown: function ()
            {
                0 === --n && a.removeEventListener(e, r, !0)
            }
        }
    }), x.fn.extend({
        on: function (e, n, r, i, o)
        {
            var a, s;
            if ("object" == typeof e)
            {
                "string" != typeof n && (r = r || n, n = t);
                for (a in e)this.on(a, n, r, e[a], o);
                return this
            }
            if (null == r && null == i ? (i = n, r = n = t) : null == i && ("string" == typeof n ? (i = r, r = t) : (i = r, r = n, n = t)), i === !1)i = ot; else if (!i)return this;
            return 1 === o && (s = i, i = function (e)
            {
                return x().off(e), s.apply(this, arguments)
            }, i.guid = s.guid || (s.guid = x.guid++)), this.each(function ()
            {
                x.event.add(this, e, i, r, n)
            })
        }, one: function (e, t, n, r)
        {
            return this.on(e, t, n, r, 1)
        }, off: function (e, n, r)
        {
            var i, o;
            if (e && e.preventDefault && e.handleObj)return i = e.handleObj, x(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
            if ("object" == typeof e)
            {
                for (o in e)this.off(o, n, e[o]);
                return this
            }
            return (n === !1 || "function" == typeof n) && (r = n, n = t), r === !1 && (r = ot), this.each(function ()
            {
                x.event.remove(this, e, r, n)
            })
        }, trigger: function (e, t)
        {
            return this.each(function ()
            {
                x.event.trigger(e, t, this)
            })
        }, triggerHandler: function (e, n)
        {
            var r = this[0];
            return r ? x.event.trigger(e, n, r, !0) : t
        }
    });
    var st = /^.[^:#\[\.,]*$/, lt = /^(?:parents|prev(?:Until|All))/, ut = x.expr.match.needsContext, ct = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    x.fn.extend({
        find: function (e)
        {
            var t, n = [], r = this, i = r.length;
            if ("string" != typeof e)return this.pushStack(x(e).filter(function ()
            {
                for (t = 0; i > t; t++)if (x.contains(r[t], this))return !0
            }));
            for (t = 0; i > t; t++)x.find(e, r[t], n);
            return n = this.pushStack(i > 1 ? x.unique(n) : n), n.selector = this.selector ? this.selector + " " + e : e, n
        }, has: function (e)
        {
            var t, n = x(e, this), r = n.length;
            return this.filter(function ()
            {
                for (t = 0; r > t; t++)if (x.contains(this, n[t]))return !0
            })
        }, not: function (e)
        {
            return this.pushStack(ft(this, e || [], !0))
        }, filter: function (e)
        {
            return this.pushStack(ft(this, e || [], !1))
        }, is: function (e)
        {
            return !!ft(this, "string" == typeof e && ut.test(e) ? x(e) : e || [], !1).length
        }, closest: function (e, t)
        {
            var n, r = 0, i = this.length, o = [], a = ut.test(e) || "string" != typeof e ? x(e, t || this.context) : 0;
            for (; i > r; r++)for (n = this[r]; n && n !== t; n = n.parentNode)if (11 > n.nodeType && (a ? a.index(n) > -1 : 1 === n.nodeType && x.find.matchesSelector(n, e)))
            {
                n = o.push(n);
                break
            }
            return this.pushStack(o.length > 1 ? x.unique(o) : o)
        }, index: function (e)
        {
            return e ? "string" == typeof e ? x.inArray(this[0], x(e)) : x.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        }, add: function (e, t)
        {
            var n = "string" == typeof e ? x(e, t) : x.makeArray(e && e.nodeType ? [e] : e), r = x.merge(this.get(), n);
            return this.pushStack(x.unique(r))
        }, addBack: function (e)
        {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    });
    function pt(e, t)
    {
        do e = e[t]; while (e && 1 !== e.nodeType);
        return e
    }

    x.each({
        parent: function (e)
        {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        }, parents: function (e)
        {
            return x.dir(e, "parentNode")
        }, parentsUntil: function (e, t, n)
        {
            return x.dir(e, "parentNode", n)
        }, next: function (e)
        {
            return pt(e, "nextSibling")
        }, prev: function (e)
        {
            return pt(e, "previousSibling")
        }, nextAll: function (e)
        {
            return x.dir(e, "nextSibling")
        }, prevAll: function (e)
        {
            return x.dir(e, "previousSibling")
        }, nextUntil: function (e, t, n)
        {
            return x.dir(e, "nextSibling", n)
        }, prevUntil: function (e, t, n)
        {
            return x.dir(e, "previousSibling", n)
        }, siblings: function (e)
        {
            return x.sibling((e.parentNode || {}).firstChild, e)
        }, children: function (e)
        {
            return x.sibling(e.firstChild)
        }, contents: function (e)
        {
            return x.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : x.merge([], e.childNodes)
        }
    }, function (e, t)
    {
        x.fn[e] = function (n, r)
        {
            var i = x.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = x.filter(r, i)), this.length > 1 && (ct[e] || (i = x.unique(i)), lt.test(e) && (i = i.reverse())), this.pushStack(i)
        }
    }), x.extend({
        filter: function (e, t, n)
        {
            var r = t[0];
            return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? x.find.matchesSelector(r, e) ? [r] : [] : x.find.matches(e, x.grep(t, function (e)
            {
                return 1 === e.nodeType
            }))
        }, dir: function (e, n, r)
        {
            var i = [], o = e[n];
            while (o && 9 !== o.nodeType && (r === t || 1 !== o.nodeType || !x(o).is(r)))1 === o.nodeType && i.push(o), o = o[n];
            return i
        }, sibling: function (e, t)
        {
            var n = [];
            for (; e; e = e.nextSibling)1 === e.nodeType && e !== t && n.push(e);
            return n
        }
    });
    function ft(e, t, n)
    {
        if (x.isFunction(t))return x.grep(e, function (e, r)
        {
            return !!t.call(e, r, e) !== n
        });
        if (t.nodeType)return x.grep(e, function (e)
        {
            return e === t !== n
        });
        if ("string" == typeof t)
        {
            if (st.test(t))return x.filter(t, e, n);
            t = x.filter(t, e)
        }
        return x.grep(e, function (e)
        {
            return x.inArray(e, t) >= 0 !== n
        })
    }

    function dt(e)
    {
        var t = ht.split("|"), n = e.createDocumentFragment();
        if (n.createElement)while (t.length)n.createElement(t.pop());
        return n
    }

    var ht = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", gt = / jQuery\d+="(?:null|\d+)"/g, mt = RegExp("<(?:" + ht + ")[\\s/>]", "i"), yt = /^\s+/, vt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, bt = /<([\w:]+)/, xt = /<tbody/i, wt = /<|&#?\w+;/, Tt = /<(?:script|style|link)/i, Ct = /^(?:checkbox|radio)$/i, Nt = /checked\s*(?:[^=]|=\s*.checked.)/i, kt = /^$|\/(?:java|ecma)script/i, Et = /^true\/(.*)/, St = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, At = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: x.support.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }, jt = dt(a), Dt = jt.appendChild(a.createElement("div"));
    At.optgroup = At.option, At.tbody = At.tfoot = At.colgroup = At.caption = At.thead, At.th = At.td, x.fn.extend({
        text: function (e)
        {
            return x.access(this, function (e)
            {
                return e === t ? x.text(this) : this.empty().append((this[0] && this[0].ownerDocument || a).createTextNode(e))
            }, null, e, arguments.length)
        }, append: function ()
        {
            return this.domManip(arguments, function (e)
            {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType)
                {
                    var t = Lt(this, e);
                    t.appendChild(e)
                }
            })
        }, prepend: function ()
        {
            return this.domManip(arguments, function (e)
            {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType)
                {
                    var t = Lt(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        }, before: function ()
        {
            return this.domManip(arguments, function (e)
            {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        }, after: function ()
        {
            return this.domManip(arguments, function (e)
            {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        }, remove: function (e, t)
        {
            var n, r = e ? x.filter(e, this) : this, i = 0;
            for (; null != (n = r[i]); i++)t || 1 !== n.nodeType || x.cleanData(Ft(n)), n.parentNode && (t && x.contains(n.ownerDocument, n) && _t(Ft(n, "script")), n.parentNode.removeChild(n));
            return this
        }, empty: function ()
        {
            var e, t = 0;
            for (; null != (e = this[t]); t++)
            {
                1 === e.nodeType && x.cleanData(Ft(e, !1));
                while (e.firstChild)e.removeChild(e.firstChild);
                e.options && x.nodeName(e, "select") && (e.options.length = 0)
            }
            return this
        }, clone: function (e, t)
        {
            return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function ()
            {
                return x.clone(this, e, t)
            })
        }, html: function (e)
        {
            return x.access(this, function (e)
            {
                var n = this[0] || {}, r = 0, i = this.length;
                if (e === t)return 1 === n.nodeType ? n.innerHTML.replace(gt, "") : t;
                if (!("string" != typeof e || Tt.test(e) || !x.support.htmlSerialize && mt.test(e) || !x.support.leadingWhitespace && yt.test(e) || At[(bt.exec(e) || ["", ""])[1].toLowerCase()]))
                {
                    e = e.replace(vt, "<$1></$2>");
                    try
                    {
                        for (; i > r; r++)n = this[r] || {}, 1 === n.nodeType && (x.cleanData(Ft(n, !1)), n.innerHTML = e);
                        n = 0
                    } catch (o)
                    {
                    }
                }
                n && this.empty().append(e)
            }, null, e, arguments.length)
        }, replaceWith: function ()
        {
            var e = x.map(this, function (e)
            {
                return [e.nextSibling, e.parentNode]
            }), t = 0;
            return this.domManip(arguments, function (n)
            {
                var r = e[t++], i = e[t++];
                i && (r && r.parentNode !== i && (r = this.nextSibling), x(this).remove(), i.insertBefore(n, r))
            }, !0), t ? this : this.remove()
        }, detach: function (e)
        {
            return this.remove(e, !0)
        }, domManip: function (e, t, n)
        {
            e = d.apply([], e);
            var r, i, o, a, s, l, u = 0, c = this.length, p = this, f = c - 1, h = e[0], g = x.isFunction(h);
            if (g || !(1 >= c || "string" != typeof h || x.support.checkClone) && Nt.test(h))return this.each(function (r)
            {
                var i = p.eq(r);
                g && (e[0] = h.call(this, r, i.html())), i.domManip(e, t, n)
            });
            if (c && (l = x.buildFragment(e, this[0].ownerDocument, !1, !n && this), r = l.firstChild, 1 === l.childNodes.length && (l = r), r))
            {
                for (a = x.map(Ft(l, "script"), Ht), o = a.length; c > u; u++)i = l, u !== f && (i = x.clone(i, !0, !0), o && x.merge(a, Ft(i, "script"))), t.call(this[u], i, u);
                if (o)for (s = a[a.length - 1].ownerDocument, x.map(a, qt), u = 0; o > u; u++)i = a[u], kt.test(i.type || "") && !x._data(i, "globalEval") && x.contains(s, i) && (i.src ? x._evalUrl(i.src) : x.globalEval((i.text || i.textContent || i.innerHTML || "").replace(St, "")));
                l = r = null
            }
            return this
        }
    });
    function Lt(e, t)
    {
        return x.nodeName(e, "table") && x.nodeName(1 === t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
    }

    function Ht(e)
    {
        return e.type = (null !== x.find.attr(e, "type")) + "/" + e.type, e
    }

    function qt(e)
    {
        var t = Et.exec(e.type);
        return t ? e.type = t[1] : e.removeAttribute("type"), e
    }

    function _t(e, t)
    {
        var n, r = 0;
        for (; null != (n = e[r]); r++)x._data(n, "globalEval", !t || x._data(t[r], "globalEval"))
    }

    function Mt(e, t)
    {
        if (1 === t.nodeType && x.hasData(e))
        {
            var n, r, i, o = x._data(e), a = x._data(t, o), s = o.events;
            if (s)
            {
                delete a.handle, a.events = {};
                for (n in s)for (r = 0, i = s[n].length; i > r; r++)x.event.add(t, n, s[n][r])
            }
            a.data && (a.data = x.extend({}, a.data))
        }
    }

    function Ot(e, t)
    {
        var n, r, i;
        if (1 === t.nodeType)
        {
            if (n = t.nodeName.toLowerCase(), !x.support.noCloneEvent && t[x.expando])
            {
                i = x._data(t);
                for (r in i.events)x.removeEvent(t, r, i.handle);
                t.removeAttribute(x.expando)
            }
            "script" === n && t.text !== e.text ? (Ht(t).text = e.text, qt(t)) : "object" === n ? (t.parentNode && (t.outerHTML = e.outerHTML), x.support.html5Clone && e.innerHTML && !x.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : "input" === n && Ct.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : "option" === n ? t.defaultSelected = t.selected = e.defaultSelected : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }
    }

    x.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (e, t)
    {
        x.fn[e] = function (e)
        {
            var n, r = 0, i = [], o = x(e), a = o.length - 1;
            for (; a >= r; r++)n = r === a ? this : this.clone(!0), x(o[r])[t](n), h.apply(i, n.get());
            return this.pushStack(i)
        }
    });
    function Ft(e, n)
    {
        var r, o, a = 0, s = typeof e.getElementsByTagName !== i ? e.getElementsByTagName(n || "*") : typeof e.querySelectorAll !== i ? e.querySelectorAll(n || "*") : t;
        if (!s)for (s = [], r = e.childNodes || e; null != (o = r[a]); a++)!n || x.nodeName(o, n) ? s.push(o) : x.merge(s, Ft(o, n));
        return n === t || n && x.nodeName(e, n) ? x.merge([e], s) : s
    }

    function Bt(e)
    {
        Ct.test(e.type) && (e.defaultChecked = e.checked)
    }

    x.extend({
        clone: function (e, t, n)
        {
            var r, i, o, a, s, l = x.contains(e.ownerDocument, e);
            if (x.support.html5Clone || x.isXMLDoc(e) || !mt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (Dt.innerHTML = e.outerHTML, Dt.removeChild(o = Dt.firstChild)), !(x.support.noCloneEvent && x.support.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || x.isXMLDoc(e)))for (r = Ft(o), s = Ft(e), a = 0; null != (i = s[a]); ++a)r[a] && Ot(i, r[a]);
            if (t)if (n)for (s = s || Ft(e), r = r || Ft(o), a = 0; null != (i = s[a]); a++)Mt(i, r[a]); else Mt(e, o);
            return r = Ft(o, "script"), r.length > 0 && _t(r, !l && Ft(e, "script")), r = s = i = null, o
        }, buildFragment: function (e, t, n, r)
        {
            var i, o, a, s, l, u, c, p = e.length, f = dt(t), d = [], h = 0;
            for (; p > h; h++)if (o = e[h], o || 0 === o)if ("object" === x.type(o))x.merge(d, o.nodeType ? [o] : o); else if (wt.test(o))
            {
                s = s || f.appendChild(t.createElement("div")), l = (bt.exec(o) || ["", ""])[1].toLowerCase(), c = At[l] || At._default, s.innerHTML = c[1] + o.replace(vt, "<$1></$2>") + c[2], i = c[0];
                while (i--)s = s.lastChild;
                if (!x.support.leadingWhitespace && yt.test(o) && d.push(t.createTextNode(yt.exec(o)[0])), !x.support.tbody)
                {
                    o = "table" !== l || xt.test(o) ? "<table>" !== c[1] || xt.test(o) ? 0 : s : s.firstChild, i = o && o.childNodes.length;
                    while (i--)x.nodeName(u = o.childNodes[i], "tbody") && !u.childNodes.length && o.removeChild(u)
                }
                x.merge(d, s.childNodes), s.textContent = "";
                while (s.firstChild)s.removeChild(s.firstChild);
                s = f.lastChild
            } else d.push(t.createTextNode(o));
            s && f.removeChild(s), x.support.appendChecked || x.grep(Ft(d, "input"), Bt), h = 0;
            while (o = d[h++])if ((!r || -1 === x.inArray(o, r)) && (a = x.contains(o.ownerDocument, o), s = Ft(f.appendChild(o), "script"), a && _t(s), n))
            {
                i = 0;
                while (o = s[i++])kt.test(o.type || "") && n.push(o)
            }
            return s = null, f
        }, cleanData: function (e, t)
        {
            var n, r, o, a, s = 0, l = x.expando, u = x.cache, c = x.support.deleteExpando, f = x.event.special;
            for (; null != (n = e[s]); s++)if ((t || x.acceptData(n)) && (o = n[l], a = o && u[o]))
            {
                if (a.events)for (r in a.events)f[r] ? x.event.remove(n, r) : x.removeEvent(n, r, a.handle);
                u[o] && (delete u[o], c ? delete n[l] : typeof n.removeAttribute !== i ? n.removeAttribute(l) : n[l] = null, p.push(o))
            }
        }, _evalUrl: function (e)
        {
            return x.ajax({url: e, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0})
        }
    }), x.fn.extend({
        wrapAll: function (e)
        {
            if (x.isFunction(e))return this.each(function (t)
            {
                x(this).wrapAll(e.call(this, t))
            });
            if (this[0])
            {
                var t = x(e, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && t.insertBefore(this[0]), t.map(function ()
                {
                    var e = this;
                    while (e.firstChild && 1 === e.firstChild.nodeType)e = e.firstChild;
                    return e
                }).append(this)
            }
            return this
        }, wrapInner: function (e)
        {
            return x.isFunction(e) ? this.each(function (t)
            {
                x(this).wrapInner(e.call(this, t))
            }) : this.each(function ()
            {
                var t = x(this), n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        }, wrap: function (e)
        {
            var t = x.isFunction(e);
            return this.each(function (n)
            {
                x(this).wrapAll(t ? e.call(this, n) : e)
            })
        }, unwrap: function ()
        {
            return this.parent().each(function ()
            {
                x.nodeName(this, "body") || x(this).replaceWith(this.childNodes)
            }).end()
        }
    });
    var Pt, Rt, Wt, $t = /alpha\([^)]*\)/i, It = /opacity\s*=\s*([^)]*)/, zt = /^(top|right|bottom|left)$/, Xt = /^(none|table(?!-c[ea]).+)/, Ut = /^margin/, Vt = RegExp("^(" + w + ")(.*)$", "i"), Yt = RegExp("^(" + w + ")(?!px)[a-z%]+$", "i"), Jt = RegExp("^([+-])=(" + w + ")", "i"), Gt = {BODY: "block"}, Qt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, Kt = {
        letterSpacing: 0,
        fontWeight: 400
    }, Zt = ["Top", "Right", "Bottom", "Left"], en = ["Webkit", "O", "Moz", "ms"];

    function tn(e, t)
    {
        if (t in e)return t;
        var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = en.length;
        while (i--)if (t = en[i] + n, t in e)return t;
        return r
    }

    function nn(e, t)
    {
        return e = t || e, "none" === x.css(e, "display") || !x.contains(e.ownerDocument, e)
    }

    function rn(e, t)
    {
        var n, r, i, o = [], a = 0, s = e.length;
        for (; s > a; a++)r = e[a], r.style && (o[a] = x._data(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && nn(r) && (o[a] = x._data(r, "olddisplay", ln(r.nodeName)))) : o[a] || (i = nn(r), (n && "none" !== n || !i) && x._data(r, "olddisplay", i ? n : x.css(r, "display"))));
        for (a = 0; s > a; a++)r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
        return e
    }

    x.fn.extend({
        css: function (e, n)
        {
            return x.access(this, function (e, n, r)
            {
                var i, o, a = {}, s = 0;
                if (x.isArray(n))
                {
                    for (o = Rt(e), i = n.length; i > s; s++)a[n[s]] = x.css(e, n[s], !1, o);
                    return a
                }
                return r !== t ? x.style(e, n, r) : x.css(e, n)
            }, e, n, arguments.length > 1)
        }, show: function ()
        {
            return rn(this, !0)
        }, hide: function ()
        {
            return rn(this)
        }, toggle: function (e)
        {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function ()
            {
                nn(this) ? x(this).show() : x(this).hide()
            })
        }
    }), x.extend({
        cssHooks: {
            opacity: {
                get: function (e, t)
                {
                    if (t)
                    {
                        var n = Wt(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {"float": x.support.cssFloat ? "cssFloat" : "styleFloat"},
        style: function (e, n, r, i)
        {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style)
            {
                var o, a, s, l = x.camelCase(n), u = e.style;
                if (n = x.cssProps[l] || (x.cssProps[l] = tn(u, l)), s = x.cssHooks[n] || x.cssHooks[l], r === t)return s && "get" in s && (o = s.get(e, !1, i)) !== t ? o : u[n];
                if (a = typeof r, "string" === a && (o = Jt.exec(r)) && (r = (o[1] + 1) * o[2] + parseFloat(x.css(e, n)), a = "number"), !(null == r || "number" === a && isNaN(r) || ("number" !== a || x.cssNumber[l] || (r += "px"), x.support.clearCloneStyle || "" !== r || 0 !== n.indexOf("background") || (u[n] = "inherit"), s && "set" in s && (r = s.set(e, r, i)) === t)))try
                {
                    u[n] = r
                } catch (c)
                {
                }
            }
        },
        css: function (e, n, r, i)
        {
            var o, a, s, l = x.camelCase(n);
            return n = x.cssProps[l] || (x.cssProps[l] = tn(e.style, l)), s = x.cssHooks[n] || x.cssHooks[l], s && "get" in s && (a = s.get(e, !0, r)), a === t && (a = Wt(e, n, i)), "normal" === a && n in Kt && (a = Kt[n]), "" === r || r ? (o = parseFloat(a), r === !0 || x.isNumeric(o) ? o || 0 : a) : a
        }
    }), e.getComputedStyle ? (Rt = function (t)
    {
        return e.getComputedStyle(t, null)
    }, Wt = function (e, n, r)
    {
        var i, o, a, s = r || Rt(e), l = s ? s.getPropertyValue(n) || s[n] : t, u = e.style;
        return s && ("" !== l || x.contains(e.ownerDocument, e) || (l = x.style(e, n)), Yt.test(l) && Ut.test(n) && (i = u.width, o = u.minWidth, a = u.maxWidth, u.minWidth = u.maxWidth = u.width = l, l = s.width, u.width = i, u.minWidth = o, u.maxWidth = a)), l
    }) : a.documentElement.currentStyle && (Rt = function (e)
    {
        return e.currentStyle
    }, Wt = function (e, n, r)
    {
        var i, o, a, s = r || Rt(e), l = s ? s[n] : t, u = e.style;
        return null == l && u && u[n] && (l = u[n]), Yt.test(l) && !zt.test(n) && (i = u.left, o = e.runtimeStyle, a = o && o.left, a && (o.left = e.currentStyle.left), u.left = "fontSize" === n ? "1em" : l, l = u.pixelLeft + "px", u.left = i, a && (o.left = a)), "" === l ? "auto" : l
    });
    function on(e, t, n)
    {
        var r = Vt.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function an(e, t, n, r, i)
    {
        var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0;
        for (; 4 > o; o += 2)"margin" === n && (a += x.css(e, n + Zt[o], !0, i)), r ? ("content" === n && (a -= x.css(e, "padding" + Zt[o], !0, i)), "margin" !== n && (a -= x.css(e, "border" + Zt[o] + "Width", !0, i))) : (a += x.css(e, "padding" + Zt[o], !0, i), "padding" !== n && (a += x.css(e, "border" + Zt[o] + "Width", !0, i)));
        return a
    }

    function sn(e, t, n)
    {
        var r = !0, i = "width" === t ? e.offsetWidth : e.offsetHeight, o = Rt(e), a = x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, o);
        if (0 >= i || null == i)
        {
            if (i = Wt(e, t, o), (0 > i || null == i) && (i = e.style[t]), Yt.test(i))return i;
            r = a && (x.support.boxSizingReliable || i === e.style[t]), i = parseFloat(i) || 0
        }
        return i + an(e, t, n || (a ? "border" : "content"), r, o) + "px"
    }

    function ln(e)
    {
        var t = a, n = Gt[e];
        return n || (n = un(e, t), "none" !== n && n || (Pt = (Pt || x("<iframe frameborder='0' width='0' height='0'/>").css("cssText", "display:block !important")).appendTo(t.documentElement), t = (Pt[0].contentWindow || Pt[0].contentDocument).document, t.write("<!doctype html><html><body>"), t.close(), n = un(e, t), Pt.detach()), Gt[e] = n), n
    }

    function un(e, t)
    {
        var n = x(t.createElement(e)).appendTo(t.body), r = x.css(n[0], "display");
        return n.remove(), r
    }

    x.each(["height", "width"], function (e, n)
    {
        x.cssHooks[n] = {
            get: function (e, r, i)
            {
                return r ? 0 === e.offsetWidth && Xt.test(x.css(e, "display")) ? x.swap(e, Qt, function ()
                {
                    return sn(e, n, i)
                }) : sn(e, n, i) : t
            }, set: function (e, t, r)
            {
                var i = r && Rt(e);
                return on(e, t, r ? an(e, n, r, x.support.boxSizing && "border-box" === x.css(e, "boxSizing", !1, i), i) : 0)
            }
        }
    }), x.support.opacity || (x.cssHooks.opacity = {
        get: function (e, t)
        {
            return It.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
        }, set: function (e, t)
        {
            var n = e.style, r = e.currentStyle, i = x.isNumeric(t) ? "alpha(opacity=" + 100 * t + ")" : "", o = r && r.filter || n.filter || "";
            n.zoom = 1, (t >= 1 || "" === t) && "" === x.trim(o.replace($t, "")) && n.removeAttribute && (n.removeAttribute("filter"), "" === t || r && !r.filter) || (n.filter = $t.test(o) ? o.replace($t, i) : o + " " + i)
        }
    }), x(function ()
    {
        x.support.reliableMarginRight || (x.cssHooks.marginRight = {
            get: function (e, n)
            {
                return n ? x.swap(e, {display: "inline-block"}, Wt, [e, "marginRight"]) : t
            }
        }), !x.support.pixelPosition && x.fn.position && x.each(["top", "left"], function (e, n)
        {
            x.cssHooks[n] = {
                get: function (e, r)
                {
                    return r ? (r = Wt(e, n), Yt.test(r) ? x(e).position()[n] + "px" : r) : t
                }
            }
        })
    }), x.expr && x.expr.filters && (x.expr.filters.hidden = function (e)
    {
        return 0 >= e.offsetWidth && 0 >= e.offsetHeight || !x.support.reliableHiddenOffsets && "none" === (e.style && e.style.display || x.css(e, "display"))
    }, x.expr.filters.visible = function (e)
    {
        return !x.expr.filters.hidden(e)
    }), x.each({margin: "", padding: "", border: "Width"}, function (e, t)
    {
        x.cssHooks[e + t] = {
            expand: function (n)
            {
                var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n];
                for (; 4 > r; r++)i[e + Zt[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        }, Ut.test(e) || (x.cssHooks[e + t].set = on)
    });
    var cn = /%20/g, pn = /\[\]$/, fn = /\r?\n/g, dn = /^(?:submit|button|image|reset|file)$/i, hn = /^(?:input|select|textarea|keygen)/i;
    x.fn.extend({
        serialize: function ()
        {
            return x.param(this.serializeArray())
        }, serializeArray: function ()
        {
            return this.map(function ()
            {
                var e = x.prop(this, "elements");
                return e ? x.makeArray(e) : this
            }).filter(function ()
            {
                var e = this.type;
                return this.name && !x(this).is(":disabled") && hn.test(this.nodeName) && !dn.test(e) && (this.checked || !Ct.test(e))
            }).map(function (e, t)
            {
                var n = x(this).val();
                return null == n ? null : x.isArray(n) ? x.map(n, function (e)
                {
                    return {name: t.name, value: e.replace(fn, "\r\n")}
                }) : {name: t.name, value: n.replace(fn, "\r\n")}
            }).get()
        }
    }), x.param = function (e, n)
    {
        var r, i = [], o = function (e, t)
        {
            t = x.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        if (n === t && (n = x.ajaxSettings && x.ajaxSettings.traditional), x.isArray(e) || e.jquery && !x.isPlainObject(e))x.each(e, function ()
        {
            o(this.name, this.value)
        }); else for (r in e)gn(r, e[r], n, o);
        return i.join("&").replace(cn, "+")
    };
    function gn(e, t, n, r)
    {
        var i;
        if (x.isArray(t))x.each(t, function (t, i)
        {
            n || pn.test(e) ? r(e, i) : gn(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
        }); else if (n || "object" !== x.type(t))r(e, t); else for (i in t)gn(e + "[" + i + "]", t[i], n, r)
    }

    x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t)
    {
        x.fn[t] = function (e, n)
        {
            return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }
    }), x.fn.extend({
        hover: function (e, t)
        {
            return this.mouseenter(e).mouseleave(t || e)
        }, bind: function (e, t, n)
        {
            return this.on(e, null, t, n)
        }, unbind: function (e, t)
        {
            return this.off(e, null, t)
        }, delegate: function (e, t, n, r)
        {
            return this.on(t, e, n, r)
        }, undelegate: function (e, t, n)
        {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        }
    });
    var mn, yn, vn = x.now(), bn = /\?/, xn = /#.*$/, wn = /([?&])_=[^&]*/, Tn = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Cn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Nn = /^(?:GET|HEAD)$/, kn = /^\/\//, En = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, Sn = x.fn.load, An = {}, jn = {}, Dn = "*/".concat("*");
    try
    {
        yn = o.href
    } catch (Ln)
    {
        yn = a.createElement("a"), yn.href = "", yn = yn.href
    }
    mn = En.exec(yn.toLowerCase()) || [];
    function Hn(e)
    {
        return function (t, n)
        {
            "string" != typeof t && (n = t, t = "*");
            var r, i = 0, o = t.toLowerCase().match(T) || [];
            if (x.isFunction(n))while (r = o[i++])"+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }

    function qn(e, n, r, i)
    {
        var o = {}, a = e === jn;

        function s(l)
        {
            var u;
            return o[l] = !0, x.each(e[l] || [], function (e, l)
            {
                var c = l(n, r, i);
                return "string" != typeof c || a || o[c] ? a ? !(u = c) : t : (n.dataTypes.unshift(c), s(c), !1)
            }), u
        }

        return s(n.dataTypes[0]) || !o["*"] && s("*")
    }

    function _n(e, n)
    {
        var r, i, o = x.ajaxSettings.flatOptions || {};
        for (i in n)n[i] !== t && ((o[i] ? e : r || (r = {}))[i] = n[i]);
        return r && x.extend(!0, e, r), e
    }

    x.fn.load = function (e, n, r)
    {
        if ("string" != typeof e && Sn)return Sn.apply(this, arguments);
        var i, o, a, s = this, l = e.indexOf(" ");
        return l >= 0 && (i = e.slice(l, e.length), e = e.slice(0, l)), x.isFunction(n) ? (r = n, n = t) : n && "object" == typeof n && (a = "POST"), s.length > 0 && x.ajax({
            url: e,
            type: a,
            dataType: "html",
            data: n
        }).done(function (e)
        {
            o = arguments, s.html(i ? x("<div>").append(x.parseHTML(e)).find(i) : e)
        }).complete(r && function (e, t)
            {
                s.each(r, o || [e.responseText, t, e])
            }), this
    }, x.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t)
    {
        x.fn[t] = function (e)
        {
            return this.on(t, e)
        }
    }), x.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: yn,
            type: "GET",
            isLocal: Cn.test(mn[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Dn,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
            converters: {"* text": String, "text html": !0, "text json": x.parseJSON, "text xml": x.parseXML},
            flatOptions: {url: !0, context: !0}
        },
        ajaxSetup: function (e, t)
        {
            return t ? _n(_n(e, x.ajaxSettings), t) : _n(x.ajaxSettings, e)
        },
        ajaxPrefilter: Hn(An),
        ajaxTransport: Hn(jn),
        ajax: function (e, n)
        {
            "object" == typeof e && (n = e, e = t), n = n || {};
            var r, i, o, a, s, l, u, c, p = x.ajaxSetup({}, n), f = p.context || p, d = p.context && (f.nodeType || f.jquery) ? x(f) : x.event, h = x.Deferred(), g = x.Callbacks("once memory"), m = p.statusCode || {}, y = {}, v = {}, b = 0, w = "canceled", C = {
                readyState: 0,
                getResponseHeader: function (e)
                {
                    var t;
                    if (2 === b)
                    {
                        if (!c)
                        {
                            c = {};
                            while (t = Tn.exec(a))c[t[1].toLowerCase()] = t[2]
                        }
                        t = c[e.toLowerCase()]
                    }
                    return null == t ? null : t
                },
                getAllResponseHeaders: function ()
                {
                    return 2 === b ? a : null
                },
                setRequestHeader: function (e, t)
                {
                    var n = e.toLowerCase();
                    return b || (e = v[n] = v[n] || e, y[e] = t), this
                },
                overrideMimeType: function (e)
                {
                    return b || (p.mimeType = e), this
                },
                statusCode: function (e)
                {
                    var t;
                    if (e)if (2 > b)for (t in e)m[t] = [m[t], e[t]]; else C.always(e[C.status]);
                    return this
                },
                abort: function (e)
                {
                    var t = e || w;
                    return u && u.abort(t), k(0, t), this
                }
            };
            if (h.promise(C).complete = g.add, C.success = C.done, C.error = C.fail, p.url = ((e || p.url || yn) + "").replace(xn, "").replace(kn, mn[1] + "//"), p.type = n.method || n.type || p.method || p.type, p.dataTypes = x.trim(p.dataType || "*").toLowerCase().match(T) || [""], null == p.crossDomain && (r = En.exec(p.url.toLowerCase()), p.crossDomain = !(!r || r[1] === mn[1] && r[2] === mn[2] && (r[3] || ("http:" === r[1] ? "80" : "443")) === (mn[3] || ("http:" === mn[1] ? "80" : "443")))), p.data && p.processData && "string" != typeof p.data && (p.data = x.param(p.data, p.traditional)), qn(An, p, n, C), 2 === b)return C;
            l = p.global, l && 0 === x.active++ && x.event.trigger("ajaxStart"), p.type = p.type.toUpperCase(), p.hasContent = !Nn.test(p.type), o = p.url, p.hasContent || (p.data && (o = p.url += (bn.test(o) ? "&" : "?") + p.data, delete p.data), p.cache === !1 && (p.url = wn.test(o) ? o.replace(wn, "$1_=" + vn++) : o + (bn.test(o) ? "&" : "?") + "_=" + vn++)), p.ifModified && (x.lastModified[o] && C.setRequestHeader("If-Modified-Since", x.lastModified[o]), x.etag[o] && C.setRequestHeader("If-None-Match", x.etag[o])), (p.data && p.hasContent && p.contentType !== !1 || n.contentType) && C.setRequestHeader("Content-Type", p.contentType), C.setRequestHeader("Accept", p.dataTypes[0] && p.accepts[p.dataTypes[0]] ? p.accepts[p.dataTypes[0]] + ("*" !== p.dataTypes[0] ? ", " + Dn + "; q=0.01" : "") : p.accepts["*"]);
            for (i in p.headers)C.setRequestHeader(i, p.headers[i]);
            if (p.beforeSend && (p.beforeSend.call(f, C, p) === !1 || 2 === b))return C.abort();
            w = "abort";
            for (i in{success: 1, error: 1, complete: 1})C[i](p[i]);
            if (u = qn(jn, p, n, C))
            {
                C.readyState = 1, l && d.trigger("ajaxSend", [C, p]), p.async && p.timeout > 0 && (s = setTimeout(function ()
                {
                    C.abort("timeout")
                }, p.timeout));
                try
                {
                    b = 1, u.send(y, k)
                } catch (N)
                {
                    if (!(2 > b))throw N;
                    k(-1, N)
                }
            } else k(-1, "No Transport");
            function k(e, n, r, i)
            {
                var c, y, v, w, T, N = n;
                2 !== b && (b = 2, s && clearTimeout(s), u = t, a = i || "", C.readyState = e > 0 ? 4 : 0, c = e >= 200 && 300 > e || 304 === e, r && (w = Mn(p, C, r)), w = On(p, w, C, c), c ? (p.ifModified && (T = C.getResponseHeader("Last-Modified"), T && (x.lastModified[o] = T), T = C.getResponseHeader("etag"), T && (x.etag[o] = T)), 204 === e || "HEAD" === p.type ? N = "nocontent" : 304 === e ? N = "notmodified" : (N = w.state, y = w.data, v = w.error, c = !v)) : (v = N, (e || !N) && (N = "error", 0 > e && (e = 0))), C.status = e, C.statusText = (n || N) + "", c ? h.resolveWith(f, [y, N, C]) : h.rejectWith(f, [C, N, v]), C.statusCode(m), m = t, l && d.trigger(c ? "ajaxSuccess" : "ajaxError", [C, p, c ? y : v]), g.fireWith(f, [C, N]), l && (d.trigger("ajaxComplete", [C, p]), --x.active || x.event.trigger("ajaxStop")))
            }

            return C
        },
        getJSON: function (e, t, n)
        {
            return x.get(e, t, n, "json")
        },
        getScript: function (e, n)
        {
            return x.get(e, t, n, "script")
        }
    }), x.each(["get", "post"], function (e, n)
    {
        x[n] = function (e, r, i, o)
        {
            return x.isFunction(r) && (o = o || i, i = r, r = t), x.ajax({
                url: e,
                type: n,
                dataType: o,
                data: r,
                success: i
            })
        }
    });
    function Mn(e, n, r)
    {
        var i, o, a, s, l = e.contents, u = e.dataTypes;
        while ("*" === u[0])u.shift(), o === t && (o = e.mimeType || n.getResponseHeader("Content-Type"));
        if (o)for (s in l)if (l[s] && l[s].test(o))
        {
            u.unshift(s);
            break
        }
        if (u[0] in r)a = u[0]; else
        {
            for (s in r)
            {
                if (!u[0] || e.converters[s + " " + u[0]])
                {
                    a = s;
                    break
                }
                i || (i = s)
            }
            a = a || i
        }
        return a ? (a !== u[0] && u.unshift(a), r[a]) : t
    }

    function On(e, t, n, r)
    {
        var i, o, a, s, l, u = {}, c = e.dataTypes.slice();
        if (c[1])for (a in e.converters)u[a.toLowerCase()] = e.converters[a];
        o = c.shift();
        while (o)if (e.responseFields[o] && (n[e.responseFields[o]] = t), !l && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = o, o = c.shift())if ("*" === o)o = l; else if ("*" !== l && l !== o)
        {
            if (a = u[l + " " + o] || u["* " + o], !a)for (i in u)if (s = i.split(" "), s[1] === o && (a = u[l + " " + s[0]] || u["* " + s[0]]))
            {
                a === !0 ? a = u[i] : u[i] !== !0 && (o = s[0], c.unshift(s[1]));
                break
            }
            if (a !== !0)if (a && e["throws"])t = a(t); else try
            {
                t = a(t)
            } catch (p)
            {
                return {state: "parsererror", error: a ? p : "No conversion from " + l + " to " + o}
            }
        }
        return {state: "success", data: t}
    }

    x.ajaxSetup({
        accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
        contents: {script: /(?:java|ecma)script/},
        converters: {
            "text script": function (e)
            {
                return x.globalEval(e), e
            }
        }
    }), x.ajaxPrefilter("script", function (e)
    {
        e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), x.ajaxTransport("script", function (e)
    {
        if (e.crossDomain)
        {
            var n, r = a.head || x("head")[0] || a.documentElement;
            return {
                send: function (t, i)
                {
                    n = a.createElement("script"), n.async = !0, e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function (e, t)
                    {
                        (t || !n.readyState || /loaded|complete/.test(n.readyState)) && (n.onload = n.onreadystatechange = null, n.parentNode && n.parentNode.removeChild(n), n = null, t || i(200, "success"))
                    }, r.insertBefore(n, r.firstChild)
                }, abort: function ()
                {
                    n && n.onload(t, !0)
                }
            }
        }
    });
    var Fn = [], Bn = /(=)\?(?=&|$)|\?\?/;
    x.ajaxSetup({
        jsonp: "callback", jsonpCallback: function ()
        {
            var e = Fn.pop() || x.expando + "_" + vn++;
            return this[e] = !0, e
        }
    }), x.ajaxPrefilter("json jsonp", function (n, r, i)
    {
        var o, a, s, l = n.jsonp !== !1 && (Bn.test(n.url) ? "url" : "string" == typeof n.data && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Bn.test(n.data) && "data");
        return l || "jsonp" === n.dataTypes[0] ? (o = n.jsonpCallback = x.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, l ? n[l] = n[l].replace(Bn, "$1" + o) : n.jsonp !== !1 && (n.url += (bn.test(n.url) ? "&" : "?") + n.jsonp + "=" + o), n.converters["script json"] = function ()
        {
            return s || x.error(o + " was not called"), s[0]
        }, n.dataTypes[0] = "json", a = e[o], e[o] = function ()
        {
            s = arguments
        }, i.always(function ()
        {
            e[o] = a, n[o] && (n.jsonpCallback = r.jsonpCallback, Fn.push(o)), s && x.isFunction(a) && a(s[0]), s = a = t
        }), "script") : t
    });
    var Pn, Rn, Wn = 0, $n = e.ActiveXObject && function ()
        {
            var e;
            for (e in Pn)Pn[e](t, !0)
        };

    function In()
    {
        try
        {
            return new e.XMLHttpRequest
        } catch (t)
        {
        }
    }

    function zn()
    {
        try
        {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t)
        {
        }
    }

    x.ajaxSettings.xhr = e.ActiveXObject ? function ()
    {
        return !this.isLocal && In() || zn()
    } : In, Rn = x.ajaxSettings.xhr(), x.support.cors = !!Rn && "withCredentials" in Rn, Rn = x.support.ajax = !!Rn, Rn && x.ajaxTransport(function (n)
    {
        if (!n.crossDomain || x.support.cors)
        {
            var r;
            return {
                send: function (i, o)
                {
                    var a, s, l = n.xhr();
                    if (n.username ? l.open(n.type, n.url, n.async, n.username, n.password) : l.open(n.type, n.url, n.async), n.xhrFields)for (s in n.xhrFields)l[s] = n.xhrFields[s];
                    n.mimeType && l.overrideMimeType && l.overrideMimeType(n.mimeType), n.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest");
                    try
                    {
                        for (s in i)l.setRequestHeader(s, i[s])
                    } catch (u)
                    {
                    }
                    l.send(n.hasContent && n.data || null), r = function (e, i)
                    {
                        var s, u, c, p;
                        try
                        {
                            if (r && (i || 4 === l.readyState))if (r = t, a && (l.onreadystatechange = x.noop, $n && delete Pn[a]), i)4 !== l.readyState && l.abort(); else
                            {
                                p = {}, s = l.status, u = l.getAllResponseHeaders(), "string" == typeof l.responseText && (p.text = l.responseText);
                                try
                                {
                                    c = l.statusText
                                } catch (f)
                                {
                                    c = ""
                                }
                                s || !n.isLocal || n.crossDomain ? 1223 === s && (s = 204) : s = p.text ? 200 : 404
                            }
                        } catch (d)
                        {
                            i || o(-1, d)
                        }
                        p && o(s, c, p, u)
                    }, n.async ? 4 === l.readyState ? setTimeout(r) : (a = ++Wn, $n && (Pn || (Pn = {}, x(e).unload($n)), Pn[a] = r), l.onreadystatechange = r) : r()
                }, abort: function ()
                {
                    r && r(t, !0)
                }
            }
        }
    });
    var Xn, Un, Vn = /^(?:toggle|show|hide)$/, Yn = RegExp("^(?:([+-])=|)(" + w + ")([a-z%]*)$", "i"), Jn = /queueHooks$/, Gn = [nr], Qn = {
        "*": [function (e, t)
        {
            var n = this.createTween(e, t), r = n.cur(), i = Yn.exec(t), o = i && i[3] || (x.cssNumber[e] ? "" : "px"), a = (x.cssNumber[e] || "px" !== o && +r) && Yn.exec(x.css(n.elem, e)), s = 1, l = 20;
            if (a && a[3] !== o)
            {
                o = o || a[3], i = i || [], a = +r || 1;
                do s = s || ".5", a /= s, x.style(n.elem, e, a + o); while (s !== (s = n.cur() / r) && 1 !== s && --l)
            }
            return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n
        }]
    };

    function Kn()
    {
        return setTimeout(function ()
        {
            Xn = t
        }), Xn = x.now()
    }

    function Zn(e, t, n)
    {
        var r, i = (Qn[t] || []).concat(Qn["*"]), o = 0, a = i.length;
        for (; a > o; o++)if (r = i[o].call(n, t, e))return r
    }

    function er(e, t, n)
    {
        var r, i, o = 0, a = Gn.length, s = x.Deferred().always(function ()
        {
            delete l.elem
        }), l = function ()
        {
            if (i)return !1;
            var t = Xn || Kn(), n = Math.max(0, u.startTime + u.duration - t), r = n / u.duration || 0, o = 1 - r, a = 0, l = u.tweens.length;
            for (; l > a; a++)u.tweens[a].run(o);
            return s.notifyWith(e, [u, o, n]), 1 > o && l ? n : (s.resolveWith(e, [u]), !1)
        }, u = s.promise({
            elem: e,
            props: x.extend({}, t),
            opts: x.extend(!0, {specialEasing: {}}, n),
            originalProperties: t,
            originalOptions: n,
            startTime: Xn || Kn(),
            duration: n.duration,
            tweens: [],
            createTween: function (t, n)
            {
                var r = x.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
                return u.tweens.push(r), r
            },
            stop: function (t)
            {
                var n = 0, r = t ? u.tweens.length : 0;
                if (i)return this;
                for (i = !0; r > n; n++)u.tweens[n].run(1);
                return t ? s.resolveWith(e, [u, t]) : s.rejectWith(e, [u, t]), this
            }
        }), c = u.props;
        for (tr(c, u.opts.specialEasing); a > o; o++)if (r = Gn[o].call(u, e, c, u.opts))return r;
        return x.map(c, Zn, u), x.isFunction(u.opts.start) && u.opts.start.call(e, u), x.fx.timer(x.extend(l, {
            elem: e,
            anim: u,
            queue: u.opts.queue
        })), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
    }

    function tr(e, t)
    {
        var n, r, i, o, a;
        for (n in e)if (r = x.camelCase(n), i = t[r], o = e[n], x.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = x.cssHooks[r], a && "expand" in a)
        {
            o = a.expand(o), delete e[r];
            for (n in o)n in e || (e[n] = o[n], t[n] = i)
        } else t[r] = i
    }

    x.Animation = x.extend(er, {
        tweener: function (e, t)
        {
            x.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
            var n, r = 0, i = e.length;
            for (; i > r; r++)n = e[r], Qn[n] = Qn[n] || [], Qn[n].unshift(t)
        }, prefilter: function (e, t)
        {
            t ? Gn.unshift(e) : Gn.push(e)
        }
    });
    function nr(e, t, n)
    {
        var r, i, o, a, s, l, u = this, c = {}, p = e.style, f = e.nodeType && nn(e), d = x._data(e, "fxshow");
        n.queue || (s = x._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, l = s.empty.fire, s.empty.fire = function ()
        {
            s.unqueued || l()
        }), s.unqueued++, u.always(function ()
        {
            u.always(function ()
            {
                s.unqueued--, x.queue(e, "fx").length || s.empty.fire()
            })
        })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], "inline" === x.css(e, "display") && "none" === x.css(e, "float") && (x.support.inlineBlockNeedsLayout && "inline" !== ln(e.nodeName) ? p.zoom = 1 : p.display = "inline-block")), n.overflow && (p.overflow = "hidden", x.support.shrinkWrapBlocks || u.always(function ()
        {
            p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
        }));
        for (r in t)if (i = t[r], Vn.exec(i))
        {
            if (delete t[r], o = o || "toggle" === i, i === (f ? "hide" : "show"))continue;
            c[r] = d && d[r] || x.style(e, r)
        }
        if (!x.isEmptyObject(c))
        {
            d ? "hidden" in d && (f = d.hidden) : d = x._data(e, "fxshow", {}), o && (d.hidden = !f), f ? x(e).show() : u.done(function ()
            {
                x(e).hide()
            }), u.done(function ()
            {
                var t;
                x._removeData(e, "fxshow");
                for (t in c)x.style(e, t, c[t])
            });
            for (r in c)a = Zn(f ? d[r] : 0, r, u), r in d || (d[r] = a.start, f && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
        }
    }

    function rr(e, t, n, r, i)
    {
        return new rr.prototype.init(e, t, n, r, i)
    }

    x.Tween = rr, rr.prototype = {
        constructor: rr, init: function (e, t, n, r, i, o)
        {
            this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (x.cssNumber[n] ? "" : "px")
        }, cur: function ()
        {
            var e = rr.propHooks[this.prop];
            return e && e.get ? e.get(this) : rr.propHooks._default.get(this)
        }, run: function (e)
        {
            var t, n = rr.propHooks[this.prop];
            return this.pos = t = this.options.duration ? x.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : rr.propHooks._default.set(this), this
        }
    }, rr.prototype.init.prototype = rr.prototype, rr.propHooks = {
        _default: {
            get: function (e)
            {
                var t;
                return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = x.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
            }, set: function (e)
            {
                x.fx.step[e.prop] ? x.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[x.cssProps[e.prop]] || x.cssHooks[e.prop]) ? x.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
            }
        }
    }, rr.propHooks.scrollTop = rr.propHooks.scrollLeft = {
        set: function (e)
        {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    }, x.each(["toggle", "show", "hide"], function (e, t)
    {
        var n = x.fn[t];
        x.fn[t] = function (e, r, i)
        {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(ir(t, !0), e, r, i)
        }
    }), x.fn.extend({
        fadeTo: function (e, t, n, r)
        {
            return this.filter(nn).css("opacity", 0).show().end().animate({opacity: t}, e, n, r)
        }, animate: function (e, t, n, r)
        {
            var i = x.isEmptyObject(e), o = x.speed(t, n, r), a = function ()
            {
                var t = er(this, x.extend({}, e), o);
                (i || x._data(this, "finish")) && t.stop(!0)
            };
            return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
        }, stop: function (e, n, r)
        {
            var i = function (e)
            {
                var t = e.stop;
                delete e.stop, t(r)
            };
            return "string" != typeof e && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function ()
            {
                var t = !0, n = null != e && e + "queueHooks", o = x.timers, a = x._data(this);
                if (n)a[n] && a[n].stop && i(a[n]); else for (n in a)a[n] && a[n].stop && Jn.test(n) && i(a[n]);
                for (n = o.length; n--;)o[n].elem !== this || null != e && o[n].queue !== e || (o[n].anim.stop(r), t = !1, o.splice(n, 1));
                (t || !r) && x.dequeue(this, e)
            })
        }, finish: function (e)
        {
            return e !== !1 && (e = e || "fx"), this.each(function ()
            {
                var t, n = x._data(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = x.timers, a = r ? r.length : 0;
                for (n.finish = !0, x.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;)o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                for (t = 0; a > t; t++)r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    });
    function ir(e, t)
    {
        var n, r = {height: e}, i = 0;
        for (t = t ? 1 : 0; 4 > i; i += 2 - t)n = Zt[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    x.each({
        slideDown: ir("show"),
        slideUp: ir("hide"),
        slideToggle: ir("toggle"),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
    }, function (e, t)
    {
        x.fn[e] = function (e, n, r)
        {
            return this.animate(t, e, n, r)
        }
    }), x.speed = function (e, t, n)
    {
        var r = e && "object" == typeof e ? x.extend({}, e) : {
            complete: n || !n && t || x.isFunction(e) && e,
            duration: e,
            easing: n && t || t && !x.isFunction(t) && t
        };
        return r.duration = x.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in x.fx.speeds ? x.fx.speeds[r.duration] : x.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function ()
        {
            x.isFunction(r.old) && r.old.call(this), r.queue && x.dequeue(this, r.queue)
        }, r
    }, x.easing = {
        linear: function (e)
        {
            return e
        }, swing: function (e)
        {
            return .5 - Math.cos(e * Math.PI) / 2
        }
    }, x.timers = [], x.fx = rr.prototype.init, x.fx.tick = function ()
    {
        var e, n = x.timers, r = 0;
        for (Xn = x.now(); n.length > r; r++)e = n[r], e() || n[r] !== e || n.splice(r--, 1);
        n.length || x.fx.stop(), Xn = t
    }, x.fx.timer = function (e)
    {
        e() && x.timers.push(e) && x.fx.start()
    }, x.fx.interval = 13, x.fx.start = function ()
    {
        Un || (Un = setInterval(x.fx.tick, x.fx.interval))
    }, x.fx.stop = function ()
    {
        clearInterval(Un), Un = null
    }, x.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, x.fx.step = {}, x.expr && x.expr.filters && (x.expr.filters.animated = function (e)
    {
        return x.grep(x.timers, function (t)
        {
            return e === t.elem
        }).length
    }), x.fn.offset = function (e)
    {
        if (arguments.length)return e === t ? this : this.each(function (t)
        {
            x.offset.setOffset(this, e, t)
        });
        var n, r, o = {top: 0, left: 0}, a = this[0], s = a && a.ownerDocument;
        if (s)return n = s.documentElement, x.contains(n, a) ? (typeof a.getBoundingClientRect !== i && (o = a.getBoundingClientRect()), r = or(s), {
            top: o.top + (r.pageYOffset || n.scrollTop) - (n.clientTop || 0),
            left: o.left + (r.pageXOffset || n.scrollLeft) - (n.clientLeft || 0)
        }) : o
    }, x.offset = {
        setOffset: function (e, t, n)
        {
            var r = x.css(e, "position");
            "static" === r && (e.style.position = "relative");
            var i = x(e), o = i.offset(), a = x.css(e, "top"), s = x.css(e, "left"), l = ("absolute" === r || "fixed" === r) && x.inArray("auto", [a, s]) > -1, u = {}, c = {}, p, f;
            l ? (c = i.position(), p = c.top, f = c.left) : (p = parseFloat(a) || 0, f = parseFloat(s) || 0), x.isFunction(t) && (t = t.call(e, n, o)), null != t.top && (u.top = t.top - o.top + p), null != t.left && (u.left = t.left - o.left + f), "using" in t ? t.using.call(e, u) : i.css(u)
        }
    }, x.fn.extend({
        position: function ()
        {
            if (this[0])
            {
                var e, t, n = {top: 0, left: 0}, r = this[0];
                return "fixed" === x.css(r, "position") ? t = r.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), x.nodeName(e[0], "html") || (n = e.offset()), n.top += x.css(e[0], "borderTopWidth", !0), n.left += x.css(e[0], "borderLeftWidth", !0)), {
                    top: t.top - n.top - x.css(r, "marginTop", !0),
                    left: t.left - n.left - x.css(r, "marginLeft", !0)
                }
            }
        }, offsetParent: function ()
        {
            return this.map(function ()
            {
                var e = this.offsetParent || s;
                while (e && !x.nodeName(e, "html") && "static" === x.css(e, "position"))e = e.offsetParent;
                return e || s
            })
        }
    }), x.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (e, n)
    {
        var r = /Y/.test(n);
        x.fn[e] = function (i)
        {
            return x.access(this, function (e, i, o)
            {
                var a = or(e);
                return o === t ? a ? n in a ? a[n] : a.document.documentElement[i] : e[i] : (a ? a.scrollTo(r ? x(a).scrollLeft() : o, r ? o : x(a).scrollTop()) : e[i] = o, t)
            }, e, i, arguments.length, null)
        }
    });
    function or(e)
    {
        return x.isWindow(e) ? e : 9 === e.nodeType ? e.defaultView || e.parentWindow : !1
    }

    x.each({Height: "height", Width: "width"}, function (e, n)
    {
        x.each({padding: "inner" + e, content: n, "": "outer" + e}, function (r, i)
        {
            x.fn[i] = function (i, o)
            {
                var a = arguments.length && (r || "boolean" != typeof i), s = r || (i === !0 || o === !0 ? "margin" : "border");
                return x.access(this, function (n, r, i)
                {
                    var o;
                    return x.isWindow(n) ? n.document.documentElement["client" + e] : 9 === n.nodeType ? (o = n.documentElement, Math.max(n.body["scroll" + e], o["scroll" + e], n.body["offset" + e], o["offset" + e], o["client" + e])) : i === t ? x.css(n, r, s) : x.style(n, r, i, s)
                }, n, a ? i : t, a, null)
            }
        })
    }), x.fn.size = function ()
    {
        return this.length
    }, x.fn.andSelf = x.fn.addBack, "object" == typeof module && module && "object" == typeof module.exports ? module.exports = x : (e.jQuery = e.$ = x, "function" == typeof define && define.amd && define("jquery", [], function ()
    {
        return x
    }))
})(window);
/* "/static/js/bootstrap/js/bootstrap.min.js" */

!function (t)
{
    "use strict";
    t(function ()
    {
        t.support.transition = function ()
        {
            var t = function ()
            {
                var t = document.createElement("bootstrap"), e = {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd otransitionend",
                    transition: "transitionend"
                }, i;
                for (i in e)
                {
                    if (t.style[i] !== undefined)
                    {
                        return e[i]
                    }
                }
            }();
            return t && {end: t}
        }()
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (e, i)
    {
        this.options = i;
        this.$element = t(e).delegate('[data-dismiss="modal"]', "click.dismiss.modal", t.proxy(this.hide, this));
        this.options.remote && this.$element.find(".modal-body").load(this.options.remote)
    };
    e.prototype = {
        constructor: e, toggle: function ()
        {
            return this[!this.isShown ? "show" : "hide"]()
        }, show: function ()
        {
            var e = this, i = t.Event("show");
            this.$element.trigger(i);
            if (this.isShown || i.isDefaultPrevented())return;
            this.isShown = true;
            this.escape();
            this.backdrop(function ()
            {
                var i = t.support.transition && e.$element.hasClass("fade");
                if (!e.$element.parent().length)
                {
                    e.$element.appendTo(document.body)
                }
                e.$element.show();
                if (i)
                {
                    e.$element[0].offsetWidth
                }
                e.$element.addClass("in").attr("aria-hidden", false);
                i ? e.$element.one(t.support.transition.end, function ()
                {
                    e.$element.focus().trigger("shown")
                }) : e.$element.focus().trigger("shown")
            })
        }, hide: function (e)
        {
            e && e.preventDefault();
            var i = this;
            e = t.Event("hide");
            this.$element.trigger(e);
            if (!this.isShown || e.isDefaultPrevented())return;
            this.isShown = false;
            this.escape();
            t(document).off("focusin.modal");
            this.$element.removeClass("in").attr("aria-hidden", true);
            t.support.transition && this.$element.hasClass("fade") ? this.hideWithTransition() : this.hideModal()
        }, escape: function ()
        {
            var t = this;
            if (this.isShown && this.options.keyboard)
            {
                this.$element.on("keyup.dismiss.modal", function (e)
                {
                    e.which == 27 && t.hide()
                })
            } else if (!this.isShown)
            {
                this.$element.off("keyup.dismiss.modal")
            }
        }, hideWithTransition: function ()
        {
            var e = this, i = setTimeout(function ()
            {
                e.$element.off(t.support.transition.end);
                e.hideModal()
            }, 500);
            this.$element.one(t.support.transition.end, function ()
            {
                clearTimeout(i);
                e.hideModal()
            })
        }, hideModal: function ()
        {
            var t = this;
            this.$element.hide();
            this.backdrop(function ()
            {
                t.removeBackdrop();
                t.$element.trigger("hidden")
            })
        }, removeBackdrop: function ()
        {
            this.$backdrop && this.$backdrop.remove();
            this.$backdrop = null
        }, backdrop: function (e)
        {
            var i = this, n = this.$element.hasClass("fade") ? "fade" : "";
            if (this.isShown && this.options.backdrop)
            {
                var s = t.support.transition && n;
                this.$backdrop = t('<div class="modal-backdrop ' + n + '" />').appendTo(document.body);
                this.$backdrop.click(this.options.backdrop == "static" ? t.proxy(this.$element[0].focus, this.$element[0]) : t.proxy(this.hide, this));
                if (s)this.$backdrop[0].offsetWidth;
                this.$backdrop.addClass("in");
                if (!e)return;
                s ? this.$backdrop.one(t.support.transition.end, e) : e()
            } else if (!this.isShown && this.$backdrop)
            {
                this.$backdrop.removeClass("in");
                t.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one(t.support.transition.end, e) : e()
            } else if (e)
            {
                e()
            }
        }
    };
    var i = t.fn.modal;
    t.fn.modal = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("modal"), o = t.extend({}, t.fn.modal.defaults, n.data(), typeof i == "object" && i);
            if (!s)n.data("modal", s = new e(this, o));
            if (typeof i == "string")s[i](); else if (o.show)s.show()
        })
    };
    t.fn.modal.defaults = {backdrop: true, keyboard: true, show: true};
    t.fn.modal.Constructor = e;
    t.fn.modal.noConflict = function ()
    {
        t.fn.modal = i;
        return this
    };
    t(document).on("click.modal.data-api", '[data-toggle="modal"]', function (e)
    {
        var i = t(this), n = i.attr("href"), s = t(i.attr("data-target") || n && n.replace(/.*(?=#[^\s]+$)/, "")), o = s.data("modal") ? "toggle" : t.extend({remote: !/#/.test(n) && n}, s.data(), i.data());
        e.preventDefault();
        s.modal(o).one("hide", function ()
        {
            i.focus()
        })
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = "[data-toggle=dropdown]", i = function (e)
    {
        var i = t(e).on("click.dropdown.data-api", this.toggle);
        t("html").on("click.dropdown.data-api", function ()
        {
            i.parent().removeClass("open")
        })
    };
    i.prototype = {
        constructor: i, toggle: function (e)
        {
            var i = t(this), o, a;
            if (i.is(".disabled, :disabled"))return;
            o = s(i);
            a = o.hasClass("open");
            n();
            if (!a)
            {
                if ("ontouchstart" in document.documentElement || true)
                {
                    t('<div class="dropdown-backdrop"/>').insertBefore(t(this)).on("click", n)
                }
                o.toggleClass("open")
            }
            i.focus();
            return false
        }, keydown: function (i)
        {
            var n, o, a, r, h, l;
            if (!/(38|40|27)/.test(i.keyCode))return;
            n = t(this);
            i.preventDefault();
            i.stopPropagation();
            if (n.is(".disabled, :disabled"))return;
            r = s(n);
            h = r.hasClass("open");
            if (!h || h && i.keyCode == 27)
            {
                if (i.which == 27)r.find(e).focus();
                return n.click()
            }
            o = t("[role=menu] li:not(.divider):visible a", r);
            if (!o.length)return;
            l = o.index(o.filter(":focus"));
            if (i.keyCode == 38 && l > 0)l--;
            if (i.keyCode == 40 && l < o.length - 1)l++;
            if (!~l)l = 0;
            o.eq(l).focus()
        }
    };
    function n()
    {
        t(".dropdown-backdrop").remove();
        t(e).each(function ()
        {
            s(t(this)).removeClass("open")
        })
    }

    function s(e)
    {
        var i = e.attr("data-target"), n;
        if (!i)
        {
            i = e.attr("href");
            i = i && /#/.test(i) && i.replace(/.*(?=#[^\s]*$)/, "")
        }
        n = i && t(i);
        if (!n || !n.length)n = e.parent();
        return n
    }

    var o = t.fn.dropdown;
    t.fn.dropdown = function (e)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("dropdown");
            if (!s)n.data("dropdown", s = new i(this));
            if (typeof e == "string")s[e].call(n)
        })
    };
    t.fn.dropdown.Constructor = i;
    t.fn.dropdown.noConflict = function ()
    {
        t.fn.dropdown = o;
        return this
    };
    t(document).on("click.dropdown.data-api", n).on("click.dropdown.data-api", ".dropdown form", function (t)
    {
        t.stopPropagation()
    }).on("click.dropdown.data-api", e, i.prototype.toggle).on("keydown.dropdown.data-api", e + ", [role=menu]", i.prototype.keydown)
}(window.jQuery);
!function (t)
{
    "use strict";
    function e(e, i)
    {
        var n = t.proxy(this.process, this), s = t(e).is("body") ? t(window) : t(e), o;
        this.options = t.extend({}, t.fn.scrollspy.defaults, i);
        this.$scrollElement = s.on("scroll.scroll-spy.data-api", n);
        this.selector = (this.options.target || (o = t(e).attr("href")) && o.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a";
        this.$body = t("body");
        this.refresh();
        this.process()
    }

    e.prototype = {
        constructor: e, refresh: function ()
        {
            var e = this, i;
            this.offsets = t([]);
            this.targets = t([]);
            i = this.$body.find(this.selector).map(function ()
            {
                var i = t(this), n = i.data("target") || i.attr("href"), s = /^#\w/.test(n) && t(n);
                return s && s.length && [[s.position().top + (!t.isWindow(e.$scrollElement.get(0)) && e.$scrollElement.scrollTop()), n]] || null
            }).sort(function (t, e)
            {
                return t[0] - e[0]
            }).each(function ()
            {
                e.offsets.push(this[0]);
                e.targets.push(this[1])
            })
        }, process: function ()
        {
            var t = this.$scrollElement.scrollTop() + this.options.offset, e = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight, i = e - this.$scrollElement.height(), n = this.offsets, s = this.targets, o = this.activeTarget, a;
            if (t >= i)
            {
                return o != (a = s.last()[0]) && this.activate(a)
            }
            for (a = n.length; a--;)
            {
                o != s[a] && t >= n[a] && (!n[a + 1] || t <= n[a + 1]) && this.activate(s[a])
            }
        }, activate: function (e)
        {
            var i, n;
            this.activeTarget = e;
            t(this.selector).parent(".active").removeClass("active");
            n = this.selector + '[data-target="' + e + '"],' + this.selector + '[href="' + e + '"]';
            i = t(n).parent("li").addClass("active");
            if (i.parent(".dropdown-menu").length)
            {
                i = i.closest("li.dropdown").addClass("active")
            }
            i.trigger("activate")
        }
    };
    var i = t.fn.scrollspy;
    t.fn.scrollspy = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("scrollspy"), o = typeof i == "object" && i;
            if (!s)n.data("scrollspy", s = new e(this, o));
            if (typeof i == "string")s[i]()
        })
    };
    t.fn.scrollspy.Constructor = e;
    t.fn.scrollspy.defaults = {offset: 10};
    t.fn.scrollspy.noConflict = function ()
    {
        t.fn.scrollspy = i;
        return this
    };
    t(window).on("load", function ()
    {
        t('[data-spy="scroll"]').each(function ()
        {
            var e = t(this);
            e.scrollspy(e.data())
        })
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (e)
    {
        this.element = t(e)
    };
    e.prototype = {
        constructor: e, show: function ()
        {
            var e = this.element, i = e.closest("ul:not(.dropdown-menu)"), n = e.attr("data-target"), s, o, a;
            if (!n)
            {
                n = e.attr("href");
                n = n && n.replace(/.*(?=#[^\s]*$)/, "")
            }
            if (e.parent("li").hasClass("active"))return;
            s = i.find(".active:last a")[0];
            a = t.Event("show", {relatedTarget: s});
            e.trigger(a);
            if (a.isDefaultPrevented())return;
            o = t(n);
            this.activate(e.parent("li"), i);
            this.activate(o, o.parent(), function ()
            {
                e.trigger({type: "shown", relatedTarget: s})
            })
        }, activate: function (e, i, n)
        {
            var s = i.find("> .active"), o = n && t.support.transition && s.hasClass("fade");

            function a()
            {
                s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");
                e.addClass("active");
                if (o)
                {
                    e[0].offsetWidth;
                    e.addClass("in")
                } else
                {
                    e.removeClass("fade")
                }
                if (e.parent(".dropdown-menu"))
                {
                    e.closest("li.dropdown").addClass("active")
                }
                n && n()
            }

            o ? s.one(t.support.transition.end, a) : a();
            s.removeClass("in")
        }
    };
    var i = t.fn.tab;
    t.fn.tab = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("tab");
            if (!s)n.data("tab", s = new e(this));
            if (typeof i == "string")s[i]()
        })
    };
    t.fn.tab.Constructor = e;
    t.fn.tab.noConflict = function ()
    {
        t.fn.tab = i;
        return this
    };
    t(document).on("click.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function (e)
    {
        e.preventDefault();
        t(this).tab("show")
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (t, e)
    {
        this.init("tooltip", t, e)
    };
    e.prototype = {
        constructor: e, init: function (e, i, n)
        {
            var s, o, a, r, h;
            this.type = e;
            this.$element = t(i);
            this.options = this.getOptions(n);
            this.enabled = true;
            a = this.options.trigger.split(" ");
            for (h = a.length; h--;)
            {
                r = a[h];
                if (r == "click")
                {
                    this.$element.on("click." + this.type, this.options.selector, t.proxy(this.toggle, this))
                } else if (r != "manual")
                {
                    s = r == "hover" ? "mouseenter" : "focus";
                    o = r == "hover" ? "mouseleave" : "blur";
                    this.$element.on(s + "." + this.type, this.options.selector, t.proxy(this.enter, this));
                    this.$element.on(o + "." + this.type, this.options.selector, t.proxy(this.leave, this))
                }
            }
            this.options.selector ? this._options = t.extend({}, this.options, {
                trigger: "manual",
                selector: ""
            }) : this.fixTitle()
        }, getOptions: function (e)
        {
            e = t.extend({}, t.fn[this.type].defaults, this.$element.data(), e);
            if (e.delay && typeof e.delay == "number")
            {
                e.delay = {show: e.delay, hide: e.delay}
            }
            return e
        }, enter: function (e)
        {
            var i = t.fn[this.type].defaults, n = {}, s;
            this._options && t.each(this._options, function (t, e)
            {
                if (i[t] != e)n[t] = e
            }, this);
            s = t(e.currentTarget)[this.type](n).data(this.type);
            if (!s.options.delay || !s.options.delay.show)return s.show();
            clearTimeout(this.timeout);
            s.hoverState = "in";
            this.timeout = setTimeout(function ()
            {
                if (s.hoverState == "in")s.show()
            }, s.options.delay.show)
        }, leave: function (e)
        {
            var i = t(e.currentTarget)[this.type](this._options).data(this.type);
            if (this.timeout)clearTimeout(this.timeout);
            if (!i.options.delay || !i.options.delay.hide)return i.hide();
            i.hoverState = "out";
            this.timeout = setTimeout(function ()
            {
                if (i.hoverState == "out")i.hide()
            }, i.options.delay.hide)
        }, show: function ()
        {
            var e, i, n, s, o, a, r = t.Event("show");
            if (this.hasContent() && this.enabled)
            {
                this.$element.trigger(r);
                if (r.isDefaultPrevented())return;
                e = this.tip();
                this.setContent();
                if (this.options.animation)
                {
                    e.addClass("fade")
                }
                o = typeof this.options.placement == "function" ? this.options.placement.call(this, e[0], this.$element[0]) : this.options.placement;
                e.detach().css({top: 0, left: 0, display: "block"});
                this.options.container ? e.appendTo(this.options.container) : e.insertAfter(this.$element);
                i = this.getPosition();
                n = e[0].offsetWidth;
                s = e[0].offsetHeight;
                switch (o)
                {
                    case"bottom":
                        a = {top: i.top + i.height, left: i.left + i.width / 2 - n / 2};
                        break;
                    case"top":
                        a = {top: i.top - s, left: i.left + i.width / 2 - n / 2};
                        break;
                    case"left":
                        a = {top: i.top + i.height / 2 - s / 2, left: i.left - n};
                        break;
                    case"right":
                        a = {top: i.top + i.height / 2 - s / 2, left: i.left + i.width};
                        break
                }
                this.applyPlacement(a, o);
                this.$element.trigger("shown")
            }
        }, applyPlacement: function (t, e)
        {
            var i = this.tip(), n = i[0].offsetWidth, s = i[0].offsetHeight, o, a, r, h;
            i.offset(t).addClass(e).addClass("in");
            o = i[0].offsetWidth;
            a = i[0].offsetHeight;
            if (e == "top" && a != s)
            {
                t.top = t.top + s - a;
                h = true
            }
            if (e == "bottom" || e == "top")
            {
                r = 0;
                if (t.left < 0)
                {
                    r = t.left * -2;
                    t.left = 0;
                    i.offset(t);
                    o = i[0].offsetWidth;
                    a = i[0].offsetHeight
                }
                this.replaceArrow(r - n + o, o, "left")
            } else
            {
                this.replaceArrow(a - s, a, "top")
            }
            if (h)i.offset(t)
        }, replaceArrow: function (t, e, i)
        {
            this.arrow().css(i, t ? 50 * (1 - t / e) + "%" : "")
        }, setContent: function ()
        {
            var t = this.tip(), e = this.getTitle();
            t.find(".tooltip-inner")[this.options.html ? "html" : "text"](e);
            t.removeClass("fade in top bottom left right")
        }, hide: function ()
        {
            var e = this, i = this.tip(), n = t.Event("hide");
            this.$element.trigger(n);
            if (n.isDefaultPrevented())return;
            i.removeClass("in");
            function s()
            {
                var e = setTimeout(function ()
                {
                    i.off(t.support.transition.end).detach()
                }, 500);
                i.one(t.support.transition.end, function ()
                {
                    clearTimeout(e);
                    i.detach()
                })
            }

            t.support.transition && this.$tip.hasClass("fade") ? s() : i.detach();
            this.$element.trigger("hidden");
            return this
        }, fixTitle: function ()
        {
            var t = this.$element;
            if (t.attr("title") || typeof t.attr("data-original-title") != "string")
            {
                t.attr("data-original-title", t.attr("title") || "").attr("title", "")
            }
        }, hasContent: function ()
        {
            return this.getTitle()
        }, getPosition: function ()
        {
            var e = this.$element[0];
            return t.extend({}, typeof e.getBoundingClientRect == "function" ? e.getBoundingClientRect() : {
                width: e.offsetWidth,
                height: e.offsetHeight
            }, this.$element.offset())
        }, getTitle: function ()
        {
            var t, e = this.$element, i = this.options;
            t = e.attr("data-original-title") || (typeof i.title == "function" ? i.title.call(e[0]) : i.title);
            return t
        }, tip: function ()
        {
            return this.$tip = this.$tip || t(this.options.template)
        }, arrow: function ()
        {
            return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow")
        }, validate: function ()
        {
            if (!this.$element[0].parentNode)
            {
                this.hide();
                this.$element = null;
                this.options = null
            }
        }, enable: function ()
        {
            this.enabled = true
        }, disable: function ()
        {
            this.enabled = false
        }, toggleEnabled: function ()
        {
            this.enabled = !this.enabled
        }, toggle: function (e)
        {
            var i = e ? t(e.currentTarget)[this.type](this._options).data(this.type) : this;
            i.tip().hasClass("in") ? i.hide() : i.show()
        }, destroy: function ()
        {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }
    };
    var i = t.fn.tooltip;
    t.fn.tooltip = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("tooltip"), o = typeof i == "object" && i;
            if (!s)n.data("tooltip", s = new e(this, o));
            if (typeof i == "string")s[i]()
        })
    };
    t.fn.tooltip.Constructor = e;
    t.fn.tooltip.defaults = {
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: false,
        container: false
    };
    t.fn.tooltip.noConflict = function ()
    {
        t.fn.tooltip = i;
        return this
    }
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (t, e)
    {
        this.init("popover", t, e)
    };
    e.prototype = t.extend({}, t.fn.tooltip.Constructor.prototype, {
        constructor: e, setContent: function ()
        {
            var t = this.tip(), e = this.getTitle(), i = this.getContent();
            t.find(".popover-title")[this.options.html ? "html" : "text"](e);
            t.find(".popover-content")[this.options.html ? "html" : "text"](i);
            t.removeClass("fade top bottom left right in")
        }, hasContent: function ()
        {
            return this.getTitle() || this.getContent()
        }, getContent: function ()
        {
            var t, e = this.$element, i = this.options;
            t = (typeof i.content == "function" ? i.content.call(e[0]) : i.content) || e.attr("data-content");
            return t
        }, tip: function ()
        {
            if (!this.$tip)
            {
                this.$tip = t(this.options.template)
            }
            return this.$tip
        }, destroy: function ()
        {
            this.hide().$element.off("." + this.type).removeData(this.type)
        }
    });
    var i = t.fn.popover;
    t.fn.popover = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("popover"), o = typeof i == "object" && i;
            if (!s)n.data("popover", s = new e(this, o));
            if (typeof i == "string")s[i]()
        })
    };
    t.fn.popover.Constructor = e;
    t.fn.popover.defaults = t.extend({}, t.fn.tooltip.defaults, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    t.fn.popover.noConflict = function ()
    {
        t.fn.popover = i;
        return this
    }
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (e, i)
    {
        this.options = t.extend({}, t.fn.affix.defaults, i);
        this.$window = t(window).on("scroll.affix.data-api", t.proxy(this.checkPosition, this)).on("click.affix.data-api", t.proxy(function ()
        {
            setTimeout(t.proxy(this.checkPosition, this), 1)
        }, this));
        this.$element = t(e);
        this.checkPosition()
    };
    e.prototype.checkPosition = function ()
    {
        if (!this.$element.is(":visible"))return;
        var e = t(document).height(), i = this.$window.scrollTop(), n = this.$element.offset(), s = this.options.offset, o = s.bottom, a = s.top, r = "affix affix-top affix-bottom", h;
        if (typeof s != "object")o = a = s;
        if (typeof a == "function")a = s.top();
        if (typeof o == "function")o = s.bottom();
        h = this.unpin != null && i + this.unpin <= n.top ? false : o != null && n.top + this.$element.height() >= e - o ? "bottom" : a != null && i <= a ? "top" : false;
        if (this.affixed === h)return;
        this.affixed = h;
        this.unpin = h == "bottom" ? n.top - i : null;
        this.$element.removeClass(r).addClass("affix" + (h ? "-" + h : ""))
    };
    var i = t.fn.affix;
    t.fn.affix = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("affix"), o = typeof i == "object" && i;
            if (!s)n.data("affix", s = new e(this, o));
            if (typeof i == "string")s[i]()
        })
    };
    t.fn.affix.Constructor = e;
    t.fn.affix.defaults = {offset: 0};
    t.fn.affix.noConflict = function ()
    {
        t.fn.affix = i;
        return this
    };
    t(window).on("load", function ()
    {
        t('[data-spy="affix"]').each(function ()
        {
            var e = t(this), i = e.data();
            i.offset = i.offset || {};
            i.offsetBottom && (i.offset.bottom = i.offsetBottom);
            i.offsetTop && (i.offset.top = i.offsetTop);
            e.affix(i)
        })
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = '[data-dismiss="alert"]', i = function (i)
    {
        t(i).on("click", e, this.close)
    };
    i.prototype.close = function (e)
    {
        var i = t(this), n = i.attr("data-target"), s;
        if (!n)
        {
            n = i.attr("href");
            n = n && n.replace(/.*(?=#[^\s]*$)/, "")
        }
        s = t(n);
        e && e.preventDefault();
        s.length || (s = i.hasClass("alert") ? i : i.parent());
        s.trigger(e = t.Event("close"));
        if (e.isDefaultPrevented())return;
        s.removeClass("in");
        function o()
        {
            s.trigger("closed").remove()
        }

        t.support.transition && s.hasClass("fade") ? s.on(t.support.transition.end, o) : o()
    };
    var n = t.fn.alert;
    t.fn.alert = function (e)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("alert");
            if (!s)n.data("alert", s = new i(this));
            if (typeof e == "string")s[e].call(n)
        })
    };
    t.fn.alert.Constructor = i;
    t.fn.alert.noConflict = function ()
    {
        t.fn.alert = n;
        return this
    };
    t(document).on("click.alert.data-api", e, i.prototype.close)
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (e, i)
    {
        this.$element = t(e);
        this.options = t.extend({}, t.fn.button.defaults, i)
    };
    e.prototype.setState = function (t)
    {
        var e = "disabled", i = this.$element, n = i.data(), s = i.is("input") ? "val" : "html";
        t = t + "Text";
        n.resetText || i.data("resetText", i[s]());
        i[s](n[t] || this.options[t]);
        setTimeout(function ()
        {
            t == "loadingText" ? i.addClass(e).attr(e, e) : i.removeClass(e).removeAttr(e)
        }, 0)
    };
    e.prototype.toggle = function ()
    {
        var t = this.$element.closest('[data-toggle="buttons-radio"]');
        t && t.find(".active").removeClass("active");
        this.$element.toggleClass("active")
    };
    var i = t.fn.button;
    t.fn.button = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("button"), o = typeof i == "object" && i;
            if (!s)n.data("button", s = new e(this, o));
            if (i == "toggle")s.toggle(); else if (i)s.setState(i)
        })
    };
    t.fn.button.defaults = {loadingText: "loading..."};
    t.fn.button.Constructor = e;
    t.fn.button.noConflict = function ()
    {
        t.fn.button = i;
        return this
    };
    t(document).on("click.button.data-api", "[data-toggle^=button]", function (e)
    {
        var i = t(e.target);
        if (!i.hasClass("btn"))i = i.closest(".btn");
        i.button("toggle")
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (e, i)
    {
        this.$element = t(e);
        this.options = t.extend({}, t.fn.collapse.defaults, i);
        if (this.options.parent)
        {
            this.$parent = t(this.options.parent)
        }
        this.options.toggle && this.toggle()
    };
    e.prototype = {
        constructor: e, dimension: function ()
        {
            var t = this.$element.hasClass("width");
            return t ? "width" : "height"
        }, show: function ()
        {
            var e, i, n, s;
            if (this.transitioning || this.$element.hasClass("in"))return;
            e = this.dimension();
            i = t.camelCase(["scroll", e].join("-"));
            n = this.$parent && this.$parent.find("> .accordion-group > .in");
            if (n && n.length)
            {
                s = n.data("collapse");
                if (s && s.transitioning)return;
                n.collapse("hide");
                s || n.data("collapse", null)
            }
            this.$element[e](0);
            this.transition("addClass", t.Event("show"), "shown");
            t.support.transition && this.$element[e](this.$element[0][i])
        }, hide: function ()
        {
            var e;
            if (this.transitioning || !this.$element.hasClass("in"))return;
            e = this.dimension();
            this.reset(this.$element[e]());
            this.transition("removeClass", t.Event("hide"), "hidden");
            this.$element[e](0)
        }, reset: function (t)
        {
            var e = this.dimension();
            this.$element.removeClass("collapse")[e](t || "auto")[0].offsetWidth;
            this.$element[t !== null ? "addClass" : "removeClass"]("collapse");
            return this
        }, transition: function (e, i, n)
        {
            var s = this, o = function ()
            {
                if (i.type == "show")s.reset();
                s.transitioning = 0;
                s.$element.trigger(n)
            };
            this.$element.trigger(i);
            if (i.isDefaultPrevented())return;
            this.transitioning = 1;
            this.$element[e]("in");
            t.support.transition && this.$element.hasClass("collapse") ? this.$element.one(t.support.transition.end, o) : o()
        }, toggle: function ()
        {
            this[this.$element.hasClass("in") ? "hide" : "show"]()
        }
    };
    var i = t.fn.collapse;
    t.fn.collapse = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("collapse"), o = t.extend({}, t.fn.collapse.defaults, n.data(), typeof i == "object" && i);
            if (!s)n.data("collapse", s = new e(this, o));
            if (typeof i == "string")s[i]()
        })
    };
    t.fn.collapse.defaults = {toggle: true};
    t.fn.collapse.Constructor = e;
    t.fn.collapse.noConflict = function ()
    {
        t.fn.collapse = i;
        return this
    };
    t(document).on("click.collapse.data-api", "[data-toggle=collapse]", function (e)
    {
        var i = t(this), n, s = i.attr("data-target") || e.preventDefault() || (n = i.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, ""), o = t(s).data("collapse") ? "toggle" : i.data();
        i[t(s).hasClass("in") ? "addClass" : "removeClass"]("collapsed");
        t(s).collapse(o)
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (e, i)
    {
        this.$element = t(e);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = i;
        this.options.pause == "hover" && this.$element.on("mouseenter", t.proxy(this.pause, this)).on("mouseleave", t.proxy(this.cycle, this))
    };
    e.prototype = {
        cycle: function (e)
        {
            if (!e)this.paused = false;
            if (this.interval)clearInterval(this.interval);
            this.options.interval && !this.paused && (this.interval = setInterval(t.proxy(this.next, this), this.options.interval));
            return this
        }, getActiveIndex: function ()
        {
            this.$active = this.$element.find(".item.active");
            this.$items = this.$active.parent().children();
            return this.$items.index(this.$active)
        }, to: function (e)
        {
            var i = this.getActiveIndex(), n = this;
            if (e > this.$items.length - 1 || e < 0)return;
            if (this.sliding)
            {
                return this.$element.one("slid", function ()
                {
                    n.to(e)
                })
            }
            if (i == e)
            {
                return this.pause().cycle()
            }
            return this.slide(e > i ? "next" : "prev", t(this.$items[e]))
        }, pause: function (e)
        {
            if (!e)this.paused = true;
            if (this.$element.find(".next, .prev").length && t.support.transition.end)
            {
                this.$element.trigger(t.support.transition.end);
                this.cycle(true)
            }
            clearInterval(this.interval);
            this.interval = null;
            return this
        }, next: function ()
        {
            if (this.sliding)return;
            return this.slide("next")
        }, prev: function ()
        {
            if (this.sliding)return;
            return this.slide("prev")
        }, slide: function (e, i)
        {
            var n = this.$element.find(".item.active"), s = i || n[e](), o = this.interval, a = e == "next" ? "left" : "right", r = e == "next" ? "first" : "last", h = this, l;
            this.sliding = true;
            o && this.pause();
            s = s.length ? s : this.$element.find(".item")[r]();
            l = t.Event("slide", {relatedTarget: s[0], direction: a});
            if (s.hasClass("active"))return;
            if (this.$indicators.length)
            {
                this.$indicators.find(".active").removeClass("active");
                this.$element.one("slid", function ()
                {
                    var e = t(h.$indicators.children()[h.getActiveIndex()]);
                    e && e.addClass("active")
                })
            }
            if (t.support.transition && this.$element.hasClass("slide"))
            {
                this.$element.trigger(l);
                if (l.isDefaultPrevented())return;
                s.addClass(e);
                s[0].offsetWidth;
                n.addClass(a);
                s.addClass(a);
                this.$element.one(t.support.transition.end, function ()
                {
                    s.removeClass([e, a].join(" ")).addClass("active");
                    n.removeClass(["active", a].join(" "));
                    h.sliding = false;
                    setTimeout(function ()
                    {
                        h.$element.trigger("slid")
                    }, 0)
                })
            } else
            {
                this.$element.trigger(l);
                if (l.isDefaultPrevented())return;
                n.removeClass("active");
                s.addClass("active");
                this.sliding = false;
                this.$element.trigger("slid")
            }
            o && this.cycle();
            return this
        }
    };
    var i = t.fn.carousel;
    t.fn.carousel = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("carousel"), o = t.extend({}, t.fn.carousel.defaults, typeof i == "object" && i), a = typeof i == "string" ? i : o.slide;
            if (!s)n.data("carousel", s = new e(this, o));
            if (typeof i == "number")s.to(i); else if (a)s[a](); else if (o.interval)s.pause().cycle()
        })
    };
    t.fn.carousel.defaults = {interval: 5e3, pause: "hover"};
    t.fn.carousel.Constructor = e;
    t.fn.carousel.noConflict = function ()
    {
        t.fn.carousel = i;
        return this
    };
    t(document).on("click.carousel.data-api", "[data-slide], [data-slide-to]", function (e)
    {
        var i = t(this), n, s = t(i.attr("data-target") || (n = i.attr("href")) && n.replace(/.*(?=#[^\s]+$)/, "")), o = t.extend({}, s.data(), i.data()), a;
        s.carousel(o);
        if (a = i.attr("data-slide-to"))
        {
            s.data("carousel").pause().to(a).cycle()
        }
        e.preventDefault()
    })
}(window.jQuery);
!function (t)
{
    "use strict";
    var e = function (e, i)
    {
        this.$element = t(e);
        this.options = t.extend({}, t.fn.typeahead.defaults, i);
        this.matcher = this.options.matcher || this.matcher;
        this.sorter = this.options.sorter || this.sorter;
        this.highlighter = this.options.highlighter || this.highlighter;
        this.updater = this.options.updater || this.updater;
        this.source = this.options.source;
        this.$menu = t(this.options.menu);
        this.shown = false;
        this.listen()
    };
    e.prototype = {
        constructor: e, select: function ()
        {
            var t = this.$menu.find(".active").attr("data-value");
            this.$element.val(this.updater(t)).change();
            return this.hide()
        }, updater: function (t)
        {
            return t
        }, show: function ()
        {
            var e = t.extend({}, this.$element.position(), {height: this.$element[0].offsetHeight});
            this.$menu.insertAfter(this.$element).css({top: e.top + e.height, left: e.left}).show();
            this.shown = true;
            return this
        }, hide: function ()
        {
            this.$menu.hide();
            this.shown = false;
            return this
        }, lookup: function (e)
        {
            var i;
            this.query = this.$element.val();
            if (!this.query || this.query.length < this.options.minLength)
            {
                return this.shown ? this.hide() : this
            }
            i = t.isFunction(this.source) ? this.source(this.query, t.proxy(this.process, this)) : this.source;
            return i ? this.process(i) : this
        }, process: function (e)
        {
            var i = this;
            e = t.grep(e, function (t)
            {
                return i.matcher(t)
            });
            e = this.sorter(e);
            if (!e.length)
            {
                return this.shown ? this.hide() : this
            }
            return this.render(e.slice(0, this.options.items)).show()
        }, matcher: function (t)
        {
            return ~t.toLowerCase().indexOf(this.query.toLowerCase())
        }, sorter: function (t)
        {
            var e = [], i = [], n = [], s;
            while (s = t.shift())
            {
                if (!s.toLowerCase().indexOf(this.query.toLowerCase()))e.push(s); else if (~s.indexOf(this.query))i.push(s); else n.push(s)
            }
            return e.concat(i, n)
        }, highlighter: function (t)
        {
            var e = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
            return t.replace(new RegExp("(" + e + ")", "ig"), function (t, e)
            {
                return "<strong>" + e + "</strong>"
            })
        }, render: function (e)
        {
            var i = this;
            e = t(e).map(function (e, n)
            {
                e = t(i.options.item).attr("data-value", n);
                e.find("a").html(i.highlighter(n));
                return e[0]
            });
            e.first().addClass("active");
            this.$menu.html(e);
            return this
        }, next: function (e)
        {
            var i = this.$menu.find(".active").removeClass("active"), n = i.next();
            if (!n.length)
            {
                n = t(this.$menu.find("li")[0])
            }
            n.addClass("active")
        }, prev: function (t)
        {
            var e = this.$menu.find(".active").removeClass("active"), i = e.prev();
            if (!i.length)
            {
                i = this.$menu.find("li").last()
            }
            i.addClass("active")
        }, listen: function ()
        {
            this.$element.on("focus", t.proxy(this.focus, this)).on("blur", t.proxy(this.blur, this)).on("keypress", t.proxy(this.keypress, this)).on("keyup", t.proxy(this.keyup, this));
            if (this.eventSupported("keydown"))
            {
                this.$element.on("keydown", t.proxy(this.keydown, this))
            }
            this.$menu.on("click", t.proxy(this.click, this)).on("mouseenter", "li", t.proxy(this.mouseenter, this)).on("mouseleave", "li", t.proxy(this.mouseleave, this))
        }, eventSupported: function (t)
        {
            var e = t in this.$element;
            if (!e)
            {
                this.$element.setAttribute(t, "return;");
                e = typeof this.$element[t] === "function"
            }
            return e
        }, move: function (t)
        {
            if (!this.shown)return;
            switch (t.keyCode)
            {
                case 9:
                case 13:
                case 27:
                    t.preventDefault();
                    break;
                case 38:
                    t.preventDefault();
                    this.prev();
                    break;
                case 40:
                    t.preventDefault();
                    this.next();
                    break
            }
            t.stopPropagation()
        }, keydown: function (e)
        {
            this.suppressKeyPressRepeat = ~t.inArray(e.keyCode, [40, 38, 9, 13, 27]);
            this.move(e)
        }, keypress: function (t)
        {
            if (this.suppressKeyPressRepeat)return;
            this.move(t)
        }, keyup: function (t)
        {
            switch (t.keyCode)
            {
                case 40:
                case 38:
                case 16:
                case 17:
                case 18:
                    break;
                case 9:
                case 13:
                    if (!this.shown)return;
                    this.select();
                    break;
                case 27:
                    if (!this.shown)return;
                    this.hide();
                    break;
                default:
                    this.lookup()
            }
            t.stopPropagation();
            t.preventDefault()
        }, focus: function (t)
        {
            this.focused = true
        }, blur: function (t)
        {
            this.focused = false;
            if (!this.mousedover && this.shown)this.hide()
        }, click: function (t)
        {
            t.stopPropagation();
            t.preventDefault();
            this.select();
            this.$element.focus()
        }, mouseenter: function (e)
        {
            this.mousedover = true;
            this.$menu.find(".active").removeClass("active");
            t(e.currentTarget).addClass("active")
        }, mouseleave: function (t)
        {
            this.mousedover = false;
            if (!this.focused && this.shown)this.hide()
        }
    };
    var i = t.fn.typeahead;
    t.fn.typeahead = function (i)
    {
        return this.each(function ()
        {
            var n = t(this), s = n.data("typeahead"), o = typeof i == "object" && i;
            if (!s)n.data("typeahead", s = new e(this, o));
            if (typeof i == "string")s[i]()
        })
    };
    t.fn.typeahead.defaults = {
        source: [],
        items: 8,
        menu: '<ul class="typeahead dropdown-menu"></ul>',
        item: '<li><a href="#"></a></li>',
        minLength: 1
    };
    t.fn.typeahead.Constructor = e;
    t.fn.typeahead.noConflict = function ()
    {
        t.fn.typeahead = i;
        return this
    };
    t(document).on("focus.typeahead.data-api", '[data-provide="typeahead"]', function (e)
    {
        var i = t(this);
        if (i.data("typeahead"))return;
        i.typeahead(i.data())
    })
}(window.jQuery);
/* "/static/js/jquery-1.5.1/jsrender/jsrender.min.js" */

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
/* "/static/js/jquery-1.5.1/jquery-ui.custom.min.js" */

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
;(function (b, j)
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
;(function (b)
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
            } else c = g / (2 * Math.PI) * Math.asin(d / h);
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
/* "/static/modules/workflow/js/jquery.browser.js" */

(function ($)
{
    var C = navigator.userAgent.toLowerCase();
    jQuery.browser = {
        version: (C.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
        safari: /webkit/.test(C),
        opera: /opera/.test(C),
        msie: /msie/.test(C) && !/opera/.test(C),
        mozilla: /mozilla/.test(C) && !/(compatible|webkit)/.test(C)
    };
})(jQuery);
/* "/static/modules/workflow/js/jquery.curcss.js" */

(function (window, undefined)
{
    var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i, ralpha = /alpha\([^)]*\)/, ropacity = /opacity=([^)]*)/, rfloat = /float/i, rdashAlpha = /-([a-z])/ig, rupper = /([A-Z])/g, rnumpx = /^-?\d+(?:px)?$/i, rnum = /^-?\d/, cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, cssWidth = ["Left", "Right"], cssHeight = ["Top", "Bottom"], getComputedStyle = document.defaultView && document.defaultView.getComputedStyle, styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat", fcamelCase = function (all, letter)
    {
        return letter.toUpperCase();
    };
    jQuery.extend({
        curCSS: function (elem, name, force)
        {
            var ret, style = elem.style, filter;
            if (!jQuery.support.opacity && name === "opacity" && elem.currentStyle)
            {
                ret = ropacity.test(elem.currentStyle.filter || "") ? (parseFloat(RegExp.$1) / 100) + "" : "";
                return ret === "" ? "1" : ret;
            }
            if (rfloat.test(name))
            {
                name = styleFloat;
            }
            if (!force && style && style[name])
            {
                ret = style[name];
            } else if (getComputedStyle)
            {
                if (rfloat.test(name))
                {
                    name = "float";
                }
                name = name.replace(rupper, "-$1").toLowerCase();
                var defaultView = elem.ownerDocument.defaultView;
                if (!defaultView)
                {
                    return null;
                }
                var computedStyle = defaultView.getComputedStyle(elem, null);
                if (computedStyle)
                {
                    ret = computedStyle.getPropertyValue(name);
                }
                if (name === "opacity" && ret === "")
                {
                    ret = "1";
                }
            } else if (elem.currentStyle)
            {
                var camelCase = name.replace(rdashAlpha, fcamelCase);
                ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
                if (!rnumpx.test(ret) && rnum.test(ret))
                {
                    var left = style.left, rsLeft = elem.runtimeStyle.left;
                    elem.runtimeStyle.left = elem.currentStyle.left;
                    style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
                    ret = style.pixelLeft + "px";
                    style.left = left;
                    elem.runtimeStyle.left = rsLeft;
                }
            }
            return ret;
        }
    })
})(window);
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
/* "/static/modules/workflow/js/jquery.browser.js" */

(function ($)
{
    var C = navigator.userAgent.toLowerCase();
    jQuery.browser = {
        version: (C.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1],
        safari: /webkit/.test(C),
        opera: /opera/.test(C),
        msie: /msie/.test(C) && !/opera/.test(C),
        mozilla: /mozilla/.test(C) && !/(compatible|webkit)/.test(C)
    };
})(jQuery);
/* "/static/js/jquery-1.5.1/jqGrid/js/grid.loader.js" */

function jqGridInclude()
{
    var pathtojsfiles = "/static/js/jquery-1.5.1/jqGrid/js/";
    var gzfix = '';
    var modules = [{include: true, incfile: 'i18n/grid.locale-cn.js'}, {
        include: true,
        incfile: 'grid.base.js'
    }, {include: true, incfile: 'grid.common.js'}, {include: true, incfile: 'grid.formedit.js'}, {
        include: false,
        incfile: 'grid.inlinedit.js'
    }, {include: false, incfile: 'grid.celledit.js'}, {include: true, incfile: 'grid.subgrid.js'}, {
        include: true,
        incfile: 'grid.treegrid.js'
    }, {include: true, incfile: 'grid.grouping.js'}, {include: true, incfile: 'grid.custom.js'}, {
        include: false,
        incfile: 'grid.tbltogrid.js'
    }, {include: false, incfile: 'grid.import.js'}, {include: true, incfile: 'jquery.fmatter.js'}, {
        include: true,
        incfile: 'JsonXml.js'
    }, {include: false, incfile: 'grid.jqueryui.js'}, {include: false, incfile: 'grid.filter.js'}];
    var filename;
    for (var i = 0; i < modules.length; i++)
    {
        if (modules[i].include === true)
        {
            filename = pathtojsfiles + modules[i].incfile + gzfix;
            if (jQuery.browser.safari)
            {
                jQuery.ajax({url: filename, dataType: 'script', async: false, cache: true});
            } else
            {
                if (jQuery.browser.msie)
                {
                    document.write('<script charset="utf-8" type="text/javascript" src="' + filename + '"></script>');
                } else
                {
                    IncludeJavaScript(filename);
                }
            }
        }
    }
    function IncludeJavaScript(jsFile)
    {
        var oHead = document.getElementsByTagName('head')[0];
        var oScript = document.createElement('script');
        oScript.setAttribute('type', 'text/javascript');
        oScript.setAttribute('language', 'javascript');
        oScript.setAttribute('src', jsFile);
        oHead.appendChild(oScript);
    }
}
jqGridInclude();
