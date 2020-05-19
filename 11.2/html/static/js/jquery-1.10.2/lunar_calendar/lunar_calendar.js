/**
 * Created by lijun on 2014/7/7.
 */
(function($) {

    //客户端时间
    var Today = new Date();
    var tY = Today.getFullYear();
    var tM = Today.getMonth();
    var tD = Today.getDate();


    /*****************************************************************************
     个人偏好设定
     *****************************************************************************/

    var conWeekend = 3;  // 周末颜色显示: 1=黑色, 2=绿色, 3=红色, 4=隔周休

    /*****************************************************************************
     日期资料
     *****************************************************************************/

    var lunarInfo= [
        0x4bd8,0x4ae0,0xa570,0x54d5,0xd260,0xd950,0x5554,0x56af,0x9ad0,0x55d2,
        0x4ae0,0xa5b6,0xa4d0,0xd250,0xd255,0xb54f,0xd6a0,0xada2,0x95b0,0x4977,
        0x497f,0xa4b0,0xb4b5,0x6a50,0x6d40,0xab54,0x2b6f,0x9570,0x52f2,0x4970,
        0x6566,0xd4a0,0xea50,0x6a95,0x5adf,0x2b60,0x86e3,0x92ef,0xc8d7,0xc95f,
        0xd4a0,0xd8a6,0xb55f,0x56a0,0xa5b4,0x25df,0x92d0,0xd2b2,0xa950,0xb557,
        0x6ca0,0xb550,0x5355,0x4daf,0xa5b0,0x4573,0x52bf,0xa9a8,0xe950,0x6aa0,
        0xaea6,0xab50,0x4b60,0xaae4,0xa570,0x5260,0xf263,0xd950,0x5b57,0x56a0,
        0x96d0,0x4dd5,0x4ad0,0xa4d0,0xd4d4,0xd250,0xd558,0xb540,0xb6a0,0x95a6,
        0x95bf,0x49b0,0xa974,0xa4b0,0xb27a,0x6a50,0x6d40,0xaf46,0xab60,0x9570,
        0x4af5,0x4970,0x64b0,0x74a3,0xea50,0x6b58,0x5ac0,0xab60,0x96d5,0x92e0,
        0xc960,0xd954,0xd4a0,0xda50,0x7552,0x56a0,0xabb7,0x25d0,0x92d0,0xcab5,
        0xa950,0xb4a0,0xbaa4,0xad50,0x55d9,0x4ba0,0xa5b0,0x5176,0x52bf,0xa930,
        0x7954,0x6aa0,0xad50,0x5b52,0x4b60,0xa6e6,0xa4e0,0xd260,0xea65,0xd530,
        0x5aa0,0x76a3,0x96d0,0x4afb,0x4ad0,0xa4d0,0xd0b6,0xd25f,0xd520,0xdd45,
        0xb5a0,0x56d0,0x55b2,0x49b0,0xa577,0xa4b0,0xaa50,0xb255,0x6d2f,0xada0,
        0x4b63,0x937f,0x49f8,0x4970,0x64b0,0x68a6,0xea5f,0x6b20,0xa6c4,0xaaef,
        0x92e0,0xd2e3,0xc960,0xd557,0xd4a0,0xda50,0x5d55,0x56a0,0xa6d0,0x55d4,
        0x52d0,0xa9b8,0xa950,0xb4a0,0xb6a6,0xad50,0x55a0,0xaba4,0xa5b0,0x52b0,
        0xb273,0x6930,0x7337,0x6aa0,0xad50,0x4b55,0x4b6f,0xa570,0x54e4,0xd260,
        0xe968,0xd520,0xdaa0,0x6aa6,0x56df,0x4ae0,0xa9d4,0xa4d0,0xd150,0xf252,
        0xd520];

    var solarMonth= [31,28,31,30,31,30,31,31,30,31,30,31];
    var Gan= ["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"];
    var Zhi= ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];
    var Animals= ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];
    var solarTerm = ["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"];
    var sTermInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
    var nStr1 = ['日','一','二','三','四','五','六','七','八','九','十'];
    var nStr2 = ['初','十','廿','卅','□'];
    var nStr3 = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    var nStr4 = ['正','二','三','四','五','六','七','八','九','十','十一','腊'];
    var monthName = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

    //公历节日 *表示放假日
    var sFtv = [
        "0101*新年元旦",
        "0202 世界湿地日",
        "0207 国际声援南非日",
        "0210 国际气象节",
        "0214 情人节",
        "0301 国际海豹日",
        "0303 全国爱耳日",
        "0308 国际妇女节",
        "0312 植树节 孙中山逝世纪念日",
        "0314 国际警察日",
        "0315 国际消费者权益日",
        "0317 中国国医节 国际航海日",
        "0321 世界森林日 消除种族歧视国际日",
        "0322 世界水日",
        "0323 世界气象日",
        "0324 世界防治结核病日",
        "0325 全国中小学生安全教育日",
        "0330 巴勒斯坦国土日",
        "0401 愚人节",
        "0407 世界卫生日",
        "0422 世界地球日",
        "0423 世界图书和版权日",
        "0424 亚非新闻工作者日",
        "0501 国际劳动节",
        "0504 中国五四青年节",
        "0505 碘缺乏病防治日",
        "0508 世界红十字日",
        "0512 国际护士节",
        "0515 国际家庭日",
        "0517 世界电信日",
        "0518 国际博物馆日",
        "0520 全国学生营养日",
        "0523 国际牛奶日",
        "0531 世界无烟日",
        "0601 国际儿童节",
        "0605 世界环境日",
        "0606 全国爱眼日",
        "0617 防治荒漠化和干旱日",
        "0623 国际奥林匹克日",
        "0625 全国土地日",
        "0626 国际反毒品日",
        "0701 中国共产党建党日 世界建筑日",
        "0702 国际体育记者日",
        "0707 中国人民抗日战争纪念日",
        "0711 世界人口日",
        "0730 非洲妇女日",
        "0801 中国建军节",
        "0808 中国男子节(爸爸节)",
        "0815 日本正式宣布无条件投降日",
        "0908 国际扫盲日 国际新闻工作者日",
        "0910 教师节",
        "0914 世界清洁地球日",
        "0916 国际臭氧层保护日",
        "0918 九·一八事变纪念日",
        "0920 全国爱牙日",
        "0927 世界旅游日",
        "1001*国庆节",
        "1002 国际和平与民主自由斗争日",
        "1004 世界动物日",
        "1008 全国高血压日",
        "1008 世界视觉日",
        "1009 世界邮政日 万国邮联日",
        "1010 辛亥革命纪念日 世界精神卫生日",
        "1013 世界保健日 国际教师节",
        "1014 世界标准日",
        "1015 国际盲人节(白手杖节)",
        "1016 世界粮食日",
        "1017 世界消除贫困日",
        "1022 世界传统医药日",
        "1024 联合国日 世界发展信息日",
        "1031 世界勤俭日",
        "1107 十月社会主义革命纪念日",
        "1108 中国记者日",
        "1109 全国消防安全宣传教育日",
        "1110 世界青年节",
        "1111 国际科学与和平周(本日所属的一周)",
        "1112 孙中山诞辰纪念日",
        "1114 世界糖尿病日",
        "1117 国际大学生节 世界学生节",
        "1121 世界问候日 世界电视日",
        "1129 国际声援巴勒斯坦人民国际日",
        "1201 世界艾滋病日",
        "1203 世界残疾人日",
        "1205 国际经济和社会发展志愿人员日",
        "1208 国际儿童电视日",
        "1209 世界足球日",
        "1210 世界人权日",
        "1212 西安事变纪念日",
        "1213 南京大屠杀(1937年)纪念日！",
        "1221 国际篮球日",
        "1224 平安夜",
        "1225 圣诞节",
        "1226 毛主席诞辰",
        "1229 国际生物多样性日"];

    //某月的第几个星期几。 5,6,7,8 表示到数第 1,2,3,4 个星期几
    var wFtv = [
        "0110 黑人日",
        "0150 世界麻风日", //一月的最后一个星期日（月倒数第一个星期日）
        "0520 国际母亲节",
        "0530 全国助残日",
        "0630 父亲节",
        "0911 美国劳动节",
        "0932 国际和平日",
        "0940 国际聋人节 世界儿童日",
        "0950 世界海事日",
        "1011 国际住房日",
//        "1013 国际减轻自然灾害日(减灾日)",
        "1144 感恩节"];

    //农历节日
    var lFtv = [
        "0101*春节",
        "0115 元宵节",
        "0202 龙抬头节",
        "0323 妈祖生辰 (天上圣母诞辰)",
        "0505 端午节",
        "0707 七夕",
        "0815 中秋节",
        "0909 重阳节",
        "1208 腊八节",
        "1223 小年",
        "0100*除夕"];


    /*****************************************************************************
     日期计算
     *****************************************************************************/

        //====================================== 返回农历 y年的总天数
    function lYearDays(y) {
        var i, sum = 348;
        for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0;
        return(sum+leapDays(y));
    }

    //====================================== 返回农历 y年闰月的天数
    function leapDays(y) {
        if(leapMonth(y)) return( (lunarInfo[y-1899]&0xf)==0xf? 30: 29);
        else return(0);
    }

    //====================================== 返回农历 y年闰哪个月 1-12 , 没闰返回 0
    function leapMonth(y) {
        var lm = lunarInfo[y-1900] & 0xf;
        return(lm==0xf?0:lm);
    }

    //====================================== 返回农历 y年m月的总天数
    function monthDays(y,m) {
        return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
    }


    //====================================== 算出农历, 传入日期控件, 返回农历日期控件
    //                                       该控件属性有 .year .month .day .isLeap
    function Lunar(objDate) {

        var i, leap=0, temp=0;
        var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;

        for(i=1900; i<2100 && offset>0; i++) { temp=lYearDays(i); offset-=temp; }

        if(offset<0) { offset+=temp; i--; }

        this.year = i;

        leap = leapMonth(i); //闰哪个月
        this.isLeap = false;

        for(i=1; i<13 && offset>0; i++) {
            //闰月
            if(leap>0 && i==(leap+1) && this.isLeap==false)
            { --i; this.isLeap = true; temp = leapDays(this.year); }
            else
            { temp = monthDays(this.year, i); }

            //解除闰月
            if(this.isLeap==true && i==(leap+1)) this.isLeap = false;

            offset -= temp;
        }

        if(offset==0 && leap>0 && i==leap+1)
            if(this.isLeap)
            { this.isLeap = false; }
            else
            { this.isLeap = true; --i; }

        if(offset<0){ offset += temp; --i; }

        this.month = i;
        this.day = offset + 1;
    }

    //==============================返回公历 y年某m+1月的天数
    function solarDays(y,m) {
        if(m==1)
            return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
        else
            return(solarMonth[m]);
    }
    //============================== 传入 offset 返回干支, 0=甲子
    function cyclical(num) {
        return(Gan[num%10]+Zhi[num%12]);
    }

    //============================== 阴历属性
    function calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,cYear,cMonth,cDay) {

        this.isToday    = false;
        //瓣句
        this.sYear      = sYear;   //公元年4位数字
        this.sMonth     = sMonth;  //公元月数字
        this.sDay       = sDay;    //公元日数字
        this.week       = week;    //星期, 三位中文
        //农历
        this.lYear      = lYear;   //公元年4位数字
        this.lMonth     = lMonth;  //农历月数字
        this.lDay       = lDay;    //农历日数字
        this.isLeap     = isLeap;  //是否为农历闰月?
        //八字
        this.cYear      = cYear;   //年柱, 2个中文
        this.cMonth     = cMonth;  //月柱, 2个中文
        this.cDay       = cDay;    //日柱, 2个中文

        this.color      = '';

        this.lunarFestival = ''; //农历节日
        this.solarFestival = ''; //公历节日
        this.solarTerms    = ''; //节气
    }

    //===== 某年的第n个节气为几日(从0小寒起算)
    function sTerm(y,n) {
        var offDate = new Date( ( 31556925974.7*(y-1900) + sTermInfo[n]*60000  ) + Date.UTC(1900,0,6,2,5) );
        return(offDate.getUTCDate());
    }



    //======================================= 返回该年的复活节(春分后第一次满月周后的第一主日)
    function easter(y) {

        var term2=sTerm(y,5); //取得春分日期
        var dayTerm2 = new Date(Date.UTC(y,2,term2,0,0,0,0)); //取得春分的公历日期控件(春分一定出现在3月)
        var lDayTerm2 = new Lunar(dayTerm2); //取得取得春分农历

        if(lDayTerm2.day<15) //取得下个月圆的相差天数
            var lMlen= 15-lDayTerm2.day;
        else
            var lMlen= (lDayTerm2.isLeap? leapDays(y): monthDays(y,lDayTerm2.month)) - lDayTerm2.day + 15;

        //一天等于 1000*60*60*24 = 86400000 毫秒
        var l15 = new Date(dayTerm2.getTime() + 86400000*lMlen ); //求出第一次月圆为公历几日
        var dayEaster = new Date(l15.getTime() + 86400000*( 7-l15.getUTCDay() ) ); //求出下个周日

        this.m = dayEaster.getUTCMonth();
        this.d = dayEaster.getUTCDate();

    }

    //====================== 中文日期
    function cDay(d){
        var s;

        switch (d) {
            case 10:
                s = '初十'; break;
            case 20:
                s = '二十'; break;
                break;
            case 30:
                s = '三十'; break;
                break;
            default :
                s = nStr2[Math.floor(d/10)];
                s += nStr1[d%10];
        }
        return(s);
    }





    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //*       以上是纯数据的东西，接下来是插件的主要逻辑      *//
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $.fn.lunarCalendar = function() {
        //获取调用此插件的jQuery wrapper
        var $container = this;
        //一个页面只支持初始化一个万年历
        if($container.length > 1) {
            $container = $($container[0]);
        }
        //创建万年历的html框架函数
        function framework(w) {
            //定义最外层的wrapper
            var $cal_wrapper = $('<div class="cal_wrapper"></div>');
            //定义header层
            var $cal_header = $('<div class="cal_header"></div>');
            //定义左header
            var $header_l = $('<div class="header_l"></div>');
            //定义今日信息（cal_today_info）
            var $cal_today_info = $('<div class="cal_todayInfo"></div>');
            //定义左header中的日期信息
            var $cal_date = $('<div class="cal_date">2014-06-13 星期五</div>');
            //定义公历节日显示信息
            var $cal_sFest = $('<div class="cal_sFest">我们在这里显示节日信息</div>');
            //组装今日信息
            $cal_today_info.append([$cal_date,$cal_sFest])
            //定义农历显示信息
            var $cal_lunar = $('<div class="cal_lunar"></div>');
            (function() {
                for(var i=0; i < 3; i++) {
                    $('<span>' + i + '</span>').appendTo($cal_lunar);
                }
            })();
            //组装左header
            $header_l.append([$cal_today_info,$cal_lunar]);
            //定义右header
            var $header_r = $('<div class="header_r"></div>');
            //定义年份选择器
            var $cal_year = $('<div class="cal_year dropdownToolbarButton"></div>');
            (function() {
                var _select = $('<select></select>');
                for(var i=1900; i < 2100; i++) {
                    $('<option>' + i + '</option>').appendTo(_select);
                }
                _select.appendTo($cal_year);
            })();
            //定义月份选择器
            var $cal_month = $('<div class="cal_month"></div>');
            (function() {
                var $toggle_group = $('<div class="toggle_group"></div>');
                var _arrowL = $('<span class="arrow"><</span>');
                var _select = $('<select></select>');
                for(var i=0; i < 12; i++) {
                    $('<option>' + (i+1) + '</option>').appendTo(_select);
                }
                var _arrowR = $('<span class="arrow">></span>');
                $toggle_group.append([_arrowL,_select,_arrowR]);
                $toggle_group.appendTo($cal_month);
            })();
            //定义本月按钮
            var $cal_curmonth = $('<div class="cal_curmonth"></div>').append($('<button type="button">本月</button>'));
            //组装右header
            $header_r.append([$cal_year,$cal_month,$cal_curmonth]);
            //组装header层
            $cal_header.append([$header_l,$header_r]);
            //定义万年历内容层
            var $cal_content = $('<div class="cal_content"></div>');
            //定义table
            var $table = $('<table></table>');
            //定义colgroup，设置col宽
            var $colgroup = $('<colgroup></colgroup>');
            (function() {
                for(var i=0;i < 7;i++) {
                    var _col = $('<col width="14%">');
                    $colgroup.append(_col);
                }
            })();
            //定义table head
            var $thead = $('<thead></thead>');
            (function() {
                var _tr = $('<tr></tr>');
                for(var i=0;i < 7;i++) {
                    if(i === 0)
                        $('<th class="weekend"><span>星期</span>日</th>').appendTo(_tr);
                    if(i === 1)
                        $('<th><span>星期</span>一</th>').appendTo(_tr);
                    if(i === 2)
                        $('<th><span>星期</span>二</th>').appendTo(_tr);
                    if(i === 3)
                        $('<th><span>星期</span>三</th>').appendTo(_tr);
                    if(i === 4)
                        $('<th><span>星期</span>四</th>').appendTo(_tr);
                    if(i === 5)
                        $('<th><span>星期</span>五</th>').appendTo(_tr);
                    if(i === 6)
                        $('<th class="weekend"><span>星期</span>六</th>').appendTo(_tr);
                }
                //组装table head
                $thead.append(_tr);
            })();
            //定义table body
            var $tbody = $('<tbody></tbody>');
            (function() {
                //定义外层for循环创建6排tr元素
                for(var i=0; i < 6; i++) {
                    var _tr = $('<tr></tr>');
                    //内层for循环创建每一行中的td元素
                    for(var j=0;j < 7; j++) {
                        var _td = $('<td></td>');
                        var _cal_day = $('<div class="cal_day"></div>');
                        var _day_num = $('<div class="day_num">1</div>');
                        var _div = $('<div class="day_lunar">初一</div>');
                        _cal_day.append([_day_num,_div]);
                        _td.append(_cal_day);
                        _tr.append(_td);
                    }
                    $tbody.append(_tr);
                }
            })();
            //组装table
            $table.append([$colgroup,$thead,$tbody]);
            //组装万年历内容层
            $cal_content.append($table);
            //组装最外层的wrapper
            $cal_wrapper.append([$cal_header,$cal_content]);
            //添加日历模块到外层的container
            w.append($cal_wrapper);
        }

        //定义页面初始化函数
        function init() {
            //创建页面框架
            framework($container);
            //初始化 万年历
            var cal = new Calendar(tY,tM);
            //为按钮控件等绑定事件
            cal.events();
            //渲染万年历
            cal.render(tY,tM);
            cal.showLunarInfo(tD);
        }

        //初始化万年历
        init();

        return this;
    };



    //Calendar的构造函数/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
     功能说明: 返回整个月的日期；资料控件
     使用方式: OBJ = new calendar(年,零起算月);
     OBJ.length      返回当月最大日
     OBJ.firstWeek   返回当月一日星期
     由 OBJ[日期].属性名称 即可取得各项值
     OBJ[日期].isToday  返回是否为今日 true 或 false
     其他 OBJ[日期] 属性参见 calElement() 中的注解
     */
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function Calendar(y,m) {

        this.$year = y;
        this.$month = m;
        var sDObj, lDObj, lY, lM, lD=1, lL, lX=0, tmp1, tmp2, tmp3;
        var cY, cM, cD; //年柱,月柱,日柱
        var lDPOS = new Array(3);
        var n = 0;
        var firstLM = 0;

        sDObj = new Date(y,m,1,0,0,0,0);    //当月一日日期

        this.length    = solarDays(y,m);    //公历当月天数
        this.firstWeek = sDObj.getDay();    //公历当月1日星期几

        ////////年柱 1900年立春后为庚子年(60进制36)
        if(m<2) cY=cyclical(y-1900+36-1);
        else cY=cyclical(y-1900+36);
        var term2=sTerm(y,2); //立春日期

        ////////月柱 1900年1月小寒以前为 丙子月(60进制12)
        var firstNode = sTerm(y,m*2) //返回当月「节」为几日开始
        cM = cyclical((y-1900)*12+m+12);

        //当月一日与 1900/1/1 相差天数
        //1900/1/1与 1970/1/1 相差25567日, 1900/1/1 日柱为甲戌日(60进制10)
        var dayCyclical = Date.UTC(y,m,1,0,0,0,0)/86400000+25567+10;

        for(var i=0;i<this.length;i++) {

            if(lD>lX) {
                sDObj = new Date(y,m,i+1);    //当月一日日期
                lDObj = new Lunar(sDObj);     //农历
                lY    = lDObj.year;           //农历年
                lM    = lDObj.month;          //农历月
                lD    = lDObj.day;            //农历日
                lL    = lDObj.isLeap;         //农历是否闰月
                lX    = lL? leapDays(lY): monthDays(lY,lM); //农历当月最后一天

                if(n==0) firstLM = lM;
                lDPOS[n++] = i-lD+1;
            }

            //依节气调整二月分的年柱, 以立春为界
            if(m==1 && (i+1)==term2) cY=cyclical(y-1900+36);
            //依节气月柱, 以「节」为界
            if((i+1)==firstNode) cM = cyclical((y-1900)*12+m+13);
            //日柱
            cD = cyclical(dayCyclical+i);

            //sYear,sMonth,sDay,week,
            //lYear,lMonth,lDay,isLeap,
            //cYear,cMonth,cDay
            this[i] = new calElement(y, m+1, i+1, nStr3[(i+this.firstWeek)%7],
                lY, lM, lD++, lL,
                cY ,cM, cD );
        }

        //节气
        tmp1=sTerm(y,m*2  )-1;
        tmp2=sTerm(y,m*2+1)-1;
        this[tmp1].solarTerms = solarTerm[m*2];
        this[tmp2].solarTerms = solarTerm[m*2+1];
        if(m==3) this[tmp1].color = 'red'; //清明颜色

        //公历节日
        for(i in sFtv)
            if(sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
                if(Number(RegExp.$1)==(m+1)) {
                    this[Number(RegExp.$2)-1].solarFestival += RegExp.$4 + ' ';
                    if(RegExp.$3=='*') this[Number(RegExp.$2)-1].color = 'red';
                }

        //月周节日
        for(i in wFtv)
            if(wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
                if(Number(RegExp.$1)==(m+1)) {
                    tmp1=Number(RegExp.$2);
                    tmp2=Number(RegExp.$3);
                    if(tmp1<5)
                        this[((this.firstWeek>tmp2)?7:0) + 7*(tmp1-1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 + ' ';
                    else {
                        tmp1 -= 5;
                        tmp3 = (this.firstWeek+this.length-1)%7; //当月最后一天星期?
                        this[this.length - tmp3 - 7*tmp1 + tmp2 - (tmp2>tmp3?7:0) - 1 ].solarFestival += RegExp.$5 + ' ';
                    }
                }

        //农历节日
        for(i in lFtv)
            if(lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
                tmp1=Number(RegExp.$1)-firstLM;
                if(tmp1==-11) tmp1=1;
                if(tmp1 >=0 && tmp1<n) {
                    tmp2 = lDPOS[tmp1] + Number(RegExp.$2) -1;
                    if( tmp2 >= 0 && tmp2<this.length && this[tmp2].isLeap!=true) {
                        this[tmp2].lunarFestival += RegExp.$4 + ' ';
                        if(RegExp.$3=='*') this[tmp2].color = 'red';
                    }
                }
            }

        //复活节只出现在3或4月
        if(m==2 || m==3) {
            var estDay = new easter(y);
            if(m == estDay.m)
                this[estDay.d-1].solarFestival = this[estDay.d-1].solarFestival+' 复活节 Easter Sunday';
        }

        //if(m==2) this[20].solarFestival = this[20].solarFestival+unescape('%20%u6D35%u8CE2%u751F%u65E5');

        //黑色星期五
        if((this.firstWeek+12)%7==5)
            this[12].solarFestival += '黑色星期五';

        //今日
        if(y==tY && m==tM) this[tD-1].isToday = true;

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Calendar的原型对象
    Calendar.prototype = {

        //原型对象的构造函数
        constructor: Calendar,

        //日历渲染函数
        render: function() {
            var i,sD,s, l,st;

            //lijun 把日历和年月数据存到之前的变量中，省去字符修改
            var SY = this.$year;
            var SM = this.$month;

            //定义日历表格元素数组
            var dayCells = $('.cal_day');
            var sCell,lCell;


            if(SY>1874 && SY<1909) yDisplay = '光绪' + (((SY-1874)==1)?'元':SY-1874);
            if(SY>1908 && SY<1912) yDisplay = '宣统' + (((SY-1908)==1)?'元':SY-1908);
            if(SY>1911 && SY<1950) yDisplay = '民国' + (((SY-1911)==1)?'元':SY-1911);
            if(SY>1949) yDisplay = '建国' + (((SY-1949)==1)?'元':SY-1949);

            for(i=0;i<42;i++) {

                sCell = dayCells[i].children[0];
                lCell = dayCells[i].children[1];

                sD = i - this.firstWeek;

                if(sD>-1 && sD<this.length) { //日期内
                    sCell.innerHTML = sD+1;

                    //周末颜色
                    if(this[sD].week == "星期六" || this[sD].week == "星期日")
                        $(sCell).addClass('weekend');

                    if(this[sD].isToday) $(dayCells[i]).addClass('today'); //今日颜色

                    sCell.style.color = this[sD].color; //法定假日颜色

                    if(this[sD].lDay==1) //显示农历月
                        lCell.innerHTML = '<b>'+(this[sD].isLeap?'闰':'') + this[sD].lMonth + '月' + (monthDays(this[sD].lYear,this[sD].lMonth)==29?'小':'大')+'</b>';
                    else //显示农历日
                        lCell.innerHTML = cDay(this[sD].lDay);


                    s = this[sD].solarFestival;
                    if( s != '') {
                        if( s == "黑色星期五") {
                            $(lCell).addClass('blackFriday');
                        } else {
                            $(lCell).addClass('solarFestivalColor');
                        }
                        lCell.innerHTML = s;
                    }

                    st = this[sD].solarTerms;
                    if( st != '') {
                        $(lCell).addClass('solarTerm').removeClass('solarFestivalColor');
                        lCell.innerHTML = st;
                        if(st=='清明' || st=='芒种' || st=='夏至' || st=='冬至') {
                            $(lCell).addClass('lunarFestivalColor').removeClass('solarTerm');
                        };
                    }

                    l = this[sD].lunarFestival;
                    if( l != '') {
                        $(lCell).addClass('lunarFestivalColor').removeClass('solarFestivalColor solarTerm');
                        lCell.innerHTML = l;
                    }

                }
                else { //非日期
                    $(dayCells[i]).children().text('');
                    $(dayCells[i]).removeClass('recover_cellCss').addClass('unrendered_cell');
                }
            }
        },

        //重绘函数
        rerender: function() {
            $('.cal_day').removeClass('unrendered_cell').addClass('recover_cellCss');
            $('.day_lunar').removeClass().addClass('day_lunar');
            this.render();
        },

        //日历绑定事件函数
        events: function() {

            var _cal = this;
            //定义年月份选择器
            var _yearSelector = $('.cal_year select');
            var _monthSelector = $('.cal_month select');
            var _currentY = $('.cal_year select option')[tY-1900];
            var _currentM = $('.cal_month select option')[tM];

            //定义用户选择的年月
            var _selectedYear = tY;
            var _selectedMonth = tM;

            //更改年份
            _yearSelector.change(function() {
                _selectedYear = this.selectedIndex + 1900;
                _cal = new Calendar(_selectedYear,_selectedMonth);
                _cal.rerender();
                _cal.showLunarInfo(tD,_cal);
                //取消日历中的.today 类属性
                if(_selectedYear != tY || _selectedMonth != tM) {
                    $('.cal_day').removeClass('today');
                }
            });
            //更改月份
            _monthSelector.change(function() {
                _selectedMonth = this.selectedIndex;
                _cal = new Calendar(_selectedYear,_selectedMonth);
                _cal.rerender();
                _cal.showLunarInfo(tD,_cal);
                //取消日历中的.today 类属性
                if(_selectedYear != tY || _selectedMonth != tM) {
                    $('.cal_day').removeClass('today');
                }
            });
            //点击本月按钮
            $('.cal_curmonth button').click(function() {
                //重新绘制本月日历
                _selectedYear = tY;
                _selectedMonth = tM;
                _cal = new Calendar(tY,tM);
                _cal.rerender(tY,tM);
                _cal.showLunarInfo(tD,_cal);
                $(_currentY).prop('selected','selected');
                $(_currentM).prop('selected','selected');
            });
            //鼠标悬浮日期
            $('.cal_day').hover(function(e) {
                if($(this).children('.day_num').text() != "")
                    $(this).addClass('current_hover');
                _cal.showLunarInfo($(this).children('.day_num').text(),_cal);
            },function(e) {
                $(this).removeClass('current_hover');
                if(_selectedYear == tY && _selectedMonth == tM && $(this).children('.day_num').text() == tD) {
                        $(this).addClass('today');
                }
                _cal.showLunarInfo(tD,_cal);
            });
            //点击月份的上下按钮
            $('.arrow').eq(0).click(function() {
                if(_selectedMonth > 0) {
                    _selectedMonth = _selectedMonth-1;
                    _cal = new Calendar(_selectedYear,_selectedMonth);
                    _cal.rerender();
                    _cal.showLunarInfo(tD,_cal);
                    //取消日历中的.today 类属性
                    if(_selectedYear != tY || _selectedMonth != tM) {
                        $('.cal_day').removeClass('today');
                    }
                }
            });
            $('.arrow').eq(1).click(function() {
                if(_selectedMonth < 11) {
                    _selectedMonth = _selectedMonth+1;
                    _cal = new Calendar(_selectedYear,_selectedMonth);
                    _cal.rerender();
                    _cal.showLunarInfo(tD,_cal);
                    //取消日历中的.today 类属性
                    if(_selectedYear != tY || _selectedMonth != tM) {
                        $('.cal_day').removeClass('today');
                    }
                }
            });


        },


        //重绘左header，实时更新农历信息///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        showLunarInfo: function(focusDay,cal) {
            //消除hover空单元格对header现实的影响
            //定义公历当月总天数
            var _cal = cal;
            var _allDays;
            if(_cal != undefined) {
                _allDays = _cal.length;
            } else {
                _allDays = 32;
            }
            if(focusDay != "") {
                //在左header中显示今天
                if(focusDay < _allDays) {
                    $('.cal_date').text(this[focusDay-1].sYear+'-'+this[focusDay-1].sMonth+'-'+this[focusDay-1].sDay+' '+this[focusDay-1].week);
                    if(this[focusDay-1].lunarFestival || this[focusDay-1].solarFestival) {
                        $('.cal_sFest').text(this[focusDay-1].lunarFestival ? this[focusDay-1].lunarFestival : this[focusDay-1].solarFestival);
                        $('.cal_todayInfo').removeClass('noFestival');
                    } else{
                        $('.cal_sFest').text('');
                        $('.cal_todayInfo').addClass('noFestival');
                    }
                    //在左header中显示今天的农历信息
                    var _spans = $('.cal_lunar span');
                    $(_spans[0]).text(nStr4[this[focusDay-1].lMonth-1] + '月' + cDay(this[focusDay-1].lDay));
                    $(_spans[1]).text(this[focusDay-1].cYear + '年 【'+Animals[(this.$year-4)%12]+'年】');
                    $(_spans[2]).text(this[focusDay-1].cMonth + '月 ' + this[focusDay-1].cDay + '日');
                } else {
                    $('.cal_date').text(this[_allDays-1].sYear+'-'+this[_allDays-1].sMonth+'-'+this[_allDays-1].sDay+' '+this[_allDays-1].week);
                    //在左header中显示今天的农历信息
                    var _spans = $('.cal_lunar span');
                    $(_spans[0]).text(nStr4[this[_allDays-1].lMonth-1] + '月' + cDay(this[_allDays-1].lDay));
                    $(_spans[1]).text(this[_allDays-1].cYear + '年 【'+Animals[(this.$year-4)%12]+'年】');
                    $(_spans[2]).text(this[_allDays-1].cMonth + '月 ' + this[_allDays-1].cDay + '日');
                }

                //定位年月份选择器的正确年月份
                $($('.cal_year select option')[this.$year-1900]).prop('selected','selected');
                $($('.cal_month select option')[this.$month]).prop('selected','selected');
            }
        }
    }
})(jQuery);