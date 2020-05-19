// ���� loaction.search
function parseSearch() {
    var search = location.search.substr(1)
    if(search === "") return {}
    var portionArray = search.split("&")
    var ret = {}

    portionArray.forEach(function(item, index) {
        var key = item.split("=")[0]
        var val = item.split("=")[1]
        ret[key] = val
    })

    return ret
}
//����ĸ��д
String.prototype.firstUpperCase = function() {
        return this.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
            return $1.toUpperCase() + $2.toLowerCase();
        });
    }
    //�����а���
if (!Array.prototype.includes) {
    Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
        'use strict';
        var O = Object(this);
        var len = parseInt(O.length) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1]) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) { k = 0; }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}
//���ֻ��ǧ��λ
var toThs = function(val) {
        if (isNaN(val)) { return 0; }
        var re = /\d{1,3}(?=(\d{3})+$)/g;
        var n = val.toString().replace(/^(\d+)((\.\d+)?)$/, function(s, s1, s2) {
            return s1.replace(re, "$&,") + s2;
        });
        return n
    }
    //ת������Ҵ�д
var numtoCL = {
    toS: function(num, m) {
        var op = {
            ch: '��һ�����������߰˾�',
            ch_u: '��ʮ��ǧ����',
            other: '����',
            toCL: this.toCL
        }
        m = typeof m == 'undefined' ? false : !!m; //Ĭ�ϼ�10��11�Ľз�
        return this.toCL.call(op, num, m);
    },
    toB: function(num, m) {
        var op = {
            ch: '��Ҽ��������½��ƾ�',
            ch_u: '��ʰ��Ǫ����',
            other: 'ؓ�c',
            toCL: this.toCL
        }
        m = typeof m == 'undefined' ? true : !!m; //Ĭ�ϲ���10��11�Ľз�
        return this.toCL.call(op, num, m);
    },
    toMoney: function(num) {
        var rmb = '',
            z = '��',
            u = 'Ԫ�Ƿ�'
        num = +num;
        var _num = Math.abs(num);
        if (_num >= 10000000000000000) { return '��������Χ!' }
        if (_num != _num) { return '��������!' }
        var _n = Math.round(_num * 100)
        _num = Math.floor(_num) * (num < 0 ? -1 : 1);
        if (_n % 100 > 0) {
            var xs_str = '',
                xs = _n.toString().slice(-2);
            xs_str += this.toB(xs[0]) + (xs[0] == 0 ? '' : u[1]);
            xs_str += xs[1] == 0 ? '' : this.toB(xs[1]) + u[2];
            return rmb + this.toB(_num) + u[0] + xs_str;
        } else {
            return rmb + this.toB(_num) + u[0] + (xs_str ? xs_str : z);
        }
    },
    toBMoney: function(num) {
        var rmb = '',
            z = '��',
            u = 'Ԫ�Ƿ�'
        num = +num;
        var _num = Math.abs(num);
        if (_num >= 10000000000000000) { return '��������Χ!' }
        if (_num != _num) { return '��������!' }
        var _n = Math.round(_num * 100)
        _num = Math.floor(_num) * (num < 0 ? -1 : 1);
        if (_n % 100 > 0) {
            var xs_str = '',
                xs = _n.toString().slice(-2);
            xs_str += this.toB(xs[0]) + (xs[0] == 0 ? '' : u[1]);
            xs_str += xs[1] == 0 ? '' : this.toB(xs[1]) + u[2];
            return rmb + this.toB(_num) + u[0] + xs_str;
        } else {
            return rmb + this.toB(_num) + u[0] + (xs_str ? xs_str : z);
        }
    },
    toSMoney: function(num) {
        var rmb = '',
            z = '��',
            u = 'Ԫ�Ƿ�'
        num = +num;
        var _num = Math.abs(num);
        if (_num >= 10000000000000000) { return '��������Χ!' }
        if (_num != _num) { return '��������!' }
        var _n = Math.round(_num * 100)
        _num = Math.floor(_num) * (num < 0 ? -1 : 1);
        if (_n % 100 > 0) {
            var xs_str = '',
                xs = _n.toString().slice(-2);
            xs_str += this.toS(xs[0]) + (xs[0] == 0 ? '' : u[1]);
            xs_str += xs[1] == 0 ? '' : this.toS(xs[1]) + u[2];
            return rmb + this.toS(_num) + u[0] + xs_str;
        } else {
            return rmb + this.toS(_num) + u[0] + (xs_str ? xs_str : z);
        }
    },
    toCL: function(num, m) {
        var n = Math.floor(Math.abs(num)),
            snum = Math.abs(num).toString(),
            sn = m ? snum.replace(/\..*$/, '') : n.toString(),
            anum = snum.split('.');
        var ch = this.ch || '��һ�����������߰˾�',
            ch_u = this.ch_u || '��ʮ��ǧ����',
            ch_o = this.other || '����',
            n0 = ch[0],
            reg = new RegExp(ch[0] + "*$"),
            reg1 = new RegExp(ch[0] + "+", 'g')
        var str_begin = "",
            str_end = "";
        if (n !== n) { return '��������!' }
        if (n >= 10000000000000000) { return '��������Χ!' }
        str_begin = num < 0 ? ch_o[0] : ''
        if (anum.length >= 2) {
            var xs = anum[1];
            if (xs) {
                str_end = ch_o[1]
                for (var x = 0; x < xs.length; x++) {
                    str_end += ch[+xs[x]]
                }
            }
        }
        if (!m) {
            if (n < 10) {
                return str_begin + ch[n] + str_end;
            }
            if (n < 20) {
                return str_begin + ch_u[1] + ch[+sn[1]].replace(reg, '') + str_end;
            }
        }
        if (sn.length == 1) {
            return str_begin + ch[n] + str_end;
        } else if (sn.length <= 4) {
            var str = '';
            for (var i = 0, n = sn.length; n--;) {
                var _num = +sn[i];
                str += this.toCL(sn[i], true) + (_num && n ? ch_u[n] : '')
                i++;
            }
            str = str.replace(reg1, n0);
            str = str.replace(reg, '');
            return str_begin + str + str_end;
        } else {
            var d = sn.length / 4 >> 0,
                y = sn.length % 4,
                str = '',
                es = y || 4;
            while (y == 0 || !ch_u[3 + d]) {
                y += 4;
                d--;
            }
            if (+sn.substr(0, y)) {
                str = this.toCL(sn.substr(0, y), m) + ch_u[3 + d] + this.toCL(sn.substr(y), true)
            } else {
                str = this.toCL(sn.substr(0, y), m) + this.toCL(sn.substr(y), true)
            }
            str = str.replace(reg1, n0);
            if (!m) { str = str.replace(reg, '') }
            return str_begin + str + str_end;
        }
    }
}
