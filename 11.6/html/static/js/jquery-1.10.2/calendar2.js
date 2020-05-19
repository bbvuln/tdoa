/**
 * Created by lijun on 2014/7/7.
 */
(function($) {

    //�ͻ���ʱ��
    var Today = new Date();
    var tY = Today.getFullYear();
    var tM = Today.getMonth();
    var tD = Today.getDate();


    /*****************************************************************************
     ����ƫ���趨
     *****************************************************************************/

    var conWeekend = 3;  // ��ĩ��ɫ��ʾ: 1=��ɫ, 2=��ɫ, 3=��ɫ, 4=������

    /*****************************************************************************
     ��������
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
    var Gan= ["��","��","��","��","��","��","��","��","��","��"];
    var Zhi= ["��","��","��","î","��","��","��","δ","��","��","��","��"];
    var Animals= ["��","ţ","��","��","��","��","��","��","��","��","��","��"];
    var solarTerm = ["С��","��","����","��ˮ","����","����","����","����","����","С��","â��","����","С��","����","����","����","��¶","���","��¶","˪��","����","Сѩ","��ѩ","����"];
    var sTermInfo = [0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758];
    var nStr1 = ['��','һ','��','��','��','��','��','��','��','��','ʮ'];
    var nStr2 = ['��','ʮ','إ','ئ','��'];
    var nStr3 = ['������','����һ','���ڶ�','������','������','������','������'];
    var nStr4 = ['��','��','��','��','��','��','��','��','��','ʮ','ʮһ','��'];
    var monthName = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];

    //�������� *��ʾ�ż���
    var sFtv = [
        "0101*����Ԫ��",
        "0202 ����ʪ����",
        "0207 ������Ԯ�Ϸ���",
        "0210 ���������",
        "0214 ���˽�",
        "0301 ���ʺ�����",
        "0303 ȫ��������",
        "0308 ���ʸ�Ů��",
        "0312 ֲ���� ����ɽ����������",
        "0314 ���ʾ�����",
        "0315 ����������Ȩ����",
        "0317 �й���ҽ�� ���ʺ�����",
        "0321 ����ɭ���� �����������ӹ�����",
        "0321 ���������",
        "0322 ����ˮ��",
        "0323 ����������",
        "0324 ������ν�˲���",
        "0325 ȫ����Сѧ����ȫ������",
        "0330 ����˹̹������",
        "0401 ���˽� ȫ�����������˶���(����) ˰��������(����)",
        "0407 ����������",
        "0422 ���������",
        "0423 ����ͼ��Ͱ�Ȩ��",
        "0424 �Ƿ����Ź�������",
        "0501 �����Ͷ���",
        "0504 �й����������",
        "0505 ��ȱ����������",
        "0508 �����ʮ����",
        "0512 ���ʻ�ʿ��",
        "0515 ���ʼ�ͥ��",
        "0517 ���������",
        "0518 ���ʲ������",
        "0520 ȫ��ѧ��Ӫ����",
        "0523 ����ţ����",
        "0531 ����������",
        "0601 ���ʶ�ͯ��",
        "0605 ���绷����",
        "0606 ȫ��������",
        "0617 ���λ�Į���͸ɺ���",
        "0623 ���ʰ���ƥ����",
        "0625 ȫ��������",
        "0626 ���ʷ���Ʒ��",
        "0701 �й������������� ���罨����",
        "0702 ��������������",
        "0707 �й�������ս��������",
        "0711 �����˿���",
        "0730 ���޸�Ů��",
        "0801 �й�������",
        "0808 �й����ӽ�(�ְֽ�)",
        "0815 �ձ���ʽ����������Ͷ����",
        "0908 ����ɨä�� �������Ź�������",
        "0910 ��ʦ��",
        "0914 ������������",
        "0916 ���ʳ����㱣����",
        "0918 �š�һ���±������",
        "0920 ȫ��������",
        "0927 ����������",
        "1001*����� ���������� �������˽�",
        "1001 ����������",
        "1002 ���ʺ�ƽ���������ɶ�����",
        "1004 ���綯����",
        "1008 ȫ����Ѫѹ��",
        "1008 �����Ӿ���",
        "1009 ���������� ���������",
        "1010 �������������� ���羫��������",
        "1013 ���籣���� ���ʽ�ʦ��",
        "1014 �����׼��",
        "1015 ����ä�˽�(�����Ƚ�)",
        "1016 ������ʳ��",
        "1017 ��������ƶ����",
        "1022 ���紫ͳҽҩ��",
        "1024 ���Ϲ��� ���緢չ��Ϣ��",
        "1031 �����ڼ���",
        "1107 ʮ������������������",
        "1108 �й�������",
        "1109 ȫ��������ȫ����������",
        "1110 ���������",
        "1111 ���ʿ�ѧ���ƽ��(����������һ��)",
        "1112 ����ɽ����������",
        "1114 ����������",
        "1117 ���ʴ�ѧ���� ����ѧ����",
        "1121 �����ʺ��� ���������",
        "1129 ������Ԯ����˹̹���������",
        "1201 ���簬�̲���",
        "1203 ����м�����",
        "1205 ���ʾ��ú���ᷢչ־Ը��Ա��",
        "1208 ���ʶ�ͯ������",
        "1209 ����������",
        "1210 ������Ȩ��",
        "1212 �����±������",
        "1213 �Ͼ�����ɱ(1937��)�����գ�����Ѫ��ʷ��",
        "1221 ����������",
        "1224 ƽ��ҹ",
        "1225 ʥ����",
        "1226 ë��ϯ����",
        "1229 ���������������"];

    //ĳ�µĵڼ������ڼ��� 5,6,7,8 ��ʾ������ 1,2,3,4 �����ڼ�
    var wFtv = [
        "0110 ������",
        "0150 ���������", //һ�µ����һ�������գ��µ�����һ�������գ�
        "0520 ����ĸ�׽�",
        "0530 ȫ��������",
        "0630 ���׽�",
        "0911 �����Ͷ���",
        "0932 ���ʺ�ƽ��",
        "0940 �������˽� �����ͯ��",
        "0950 ���纣����",
        "1011 ����ס����",
        "1013 ���ʼ�����Ȼ�ֺ���(������)",
        "1144 �ж���"];

    //ũ������
    var lFtv = [
        "0101*����",
        "0115 Ԫ����",
        "0202 ��̧ͷ��",
        "0323 �������� (����ʥĸ����)",
        "0505 �����",
        "0707 �����й����˽�",
        "0815 �����",
        "0909 ������",
        "1208 ���˽�",
        "1223 С��",
        "0100*��Ϧ"];


    /*****************************************************************************
     ���ڼ���
     *****************************************************************************/

        //====================================== ����ũ�� y���������
    function lYearDays(y) {
        var i, sum = 348;
        for(i=0x8000; i>0x8; i>>=1) sum += (lunarInfo[y-1900] & i)? 1: 0;
        return(sum+leapDays(y));
    }

    //====================================== ����ũ�� y�����µ�����
    function leapDays(y) {
        if(leapMonth(y)) return( (lunarInfo[y-1899]&0xf)==0xf? 30: 29);
        else return(0);
    }

    //====================================== ����ũ�� y�����ĸ��� 1-12 , û�򷵻� 0
    function leapMonth(y) {
        var lm = lunarInfo[y-1900] & 0xf;
        return(lm==0xf?0:lm);
    }

    //====================================== ����ũ�� y��m�µ�������
    function monthDays(y,m) {
        return( (lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
    }


    //====================================== ���ũ��, �������ڿؼ�, ����ũ�����ڿؼ�
    //                                       �ÿؼ������� .year .month .day .isLeap
    function Lunar(objDate) {

        var i, leap=0, temp=0;
        var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;

        for(i=1900; i<2100 && offset>0; i++) { temp=lYearDays(i); offset-=temp; }

        if(offset<0) { offset+=temp; i--; }

        this.year = i;

        leap = leapMonth(i); //���ĸ���
        this.isLeap = false;

        for(i=1; i<13 && offset>0; i++) {
            //����
            if(leap>0 && i==(leap+1) && this.isLeap==false)
            { --i; this.isLeap = true; temp = leapDays(this.year); }
            else
            { temp = monthDays(this.year, i); }

            //�������
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

    //==============================���ع��� y��ĳm+1�µ�����
    function solarDays(y,m) {
        if(m==1)
            return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
        else
            return(solarMonth[m]);
    }
    //============================== ���� offset ���ظ�֧, 0=����
    function cyclical(num) {
        return(Gan[num%10]+Zhi[num%12]);
    }

    //============================== ��������
    function calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,cYear,cMonth,cDay) {

        this.isToday    = false;
        //���
        this.sYear      = sYear;   //��Ԫ��4λ����
        this.sMonth     = sMonth;  //��Ԫ������
        this.sDay       = sDay;    //��Ԫ������
        this.week       = week;    //����, ��λ����
        //ũ��
        this.lYear      = lYear;   //��Ԫ��4λ����
        this.lMonth     = lMonth;  //ũ��������
        this.lDay       = lDay;    //ũ��������
        this.isLeap     = isLeap;  //�Ƿ�Ϊũ������?
        //����
        this.cYear      = cYear;   //����, 2������
        this.cMonth     = cMonth;  //����, 2������
        this.cDay       = cDay;    //����, 2������

        this.color      = '';

        this.lunarFestival = ''; //ũ������
        this.solarFestival = ''; //��������
        this.solarTerms    = ''; //����
    }

    //===== ĳ��ĵ�n������Ϊ����(��0С������)
    function sTerm(y,n) {
        var offDate = new Date( ( 31556925974.7*(y-1900) + sTermInfo[n]*60000  ) + Date.UTC(1900,0,6,2,5) );
        return(offDate.getUTCDate());
    }



    //======================================= ���ظ���ĸ����(���ֺ��һ�������ܺ�ĵ�һ����)
    function easter(y) {

        var term2=sTerm(y,5); //ȡ�ô�������
        var dayTerm2 = new Date(Date.UTC(y,2,term2,0,0,0,0)); //ȡ�ô��ֵĹ������ڿؼ�(����һ��������3��)
        var lDayTerm2 = new Lunar(dayTerm2); //ȡ��ȡ�ô���ũ��

        if(lDayTerm2.day<15) //ȡ���¸���Բ���������
            var lMlen= 15-lDayTerm2.day;
        else
            var lMlen= (lDayTerm2.isLeap? leapDays(y): monthDays(y,lDayTerm2.month)) - lDayTerm2.day + 15;

        //һ����� 1000*60*60*24 = 86400000 ����
        var l15 = new Date(dayTerm2.getTime() + 86400000*lMlen ); //�����һ����ԲΪ��������
        var dayEaster = new Date(l15.getTime() + 86400000*( 7-l15.getUTCDay() ) ); //����¸�����

        this.m = dayEaster.getUTCMonth();
        this.d = dayEaster.getUTCDate();

    }

    //====================== ��������
    function cDay(d){
        var s;

        switch (d) {
            case 10:
                s = '��ʮ'; break;
            case 20:
                s = '��ʮ'; break;
                break;
            case 30:
                s = '��ʮ'; break;
                break;
            default :
                s = nStr2[Math.floor(d/10)];
                s += nStr1[d%10];
        }
        return(s);
    }





    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //*       �����Ǵ����ݵĶ������������ǲ������Ҫ�߼�      *//
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $.fn.createCalendar = function() {
        //��ȡ���ô˲����jQuery wrapper
        var $container = this;
        //һ��ҳ��ֻ֧�ֳ�ʼ��һ��������
        if($container.length > 1) {
            $container = $($container[0]);
        }
        //������������html��ܺ���
        function framework(w) {
            //����������wrapper
            var $cal_wrapper = $('<div class="cal_wrapper"></div>');
            //����header��
            var $cal_header = $('<div class="cal_header"></div>');
            //������header
            var $header_l = $('<div class="header_l"></div>');
            //������header�е�������Ϣ
            var $cal_date = $('<div class="cal_date">2014-06-13 ������</div>');
            //����ũ����ʾ��Ϣ
            var $cal_lunar = $('<div class="cal_lunar"></div>');
            (function() {
                for(var i=0; i < 3; i++) {
                    $('<span>' + i + '</span>').appendTo($cal_lunar);
                }
            })();
            //��װ��header
            $header_l.append([$cal_date,$cal_lunar]);
            //������header
            var $header_r = $('<div class="header_r"></div>');
            //�������ѡ����
            var $cal_year = $('<div class="cal_year dropdownToolbarButton"></div>');
            (function() {
                var _select = $('<select></select>');
                for(var i=1900; i < 2100; i++) {
                    $('<option>' + i + '</option>').appendTo(_select);
                }
                _select.appendTo($cal_year);
            })();
            //�����·�ѡ����
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
            //���屾�°�ť
            var $cal_curmonth = $('<div class="cal_curmonth"></div>').append($('<button type="button">����</button>'));
            //��װ��header
            $header_r.append([$cal_year,$cal_month,$cal_curmonth]);
            //��װheader��
            $cal_header.append([$header_l,$header_r]);
            //�������������ݲ�
            var $cal_content = $('<div class="cal_content"></div>');
            //����table
            var $table = $('<table></table>');
            //����colgroup������col��
            var $colgroup = $('<colgroup></colgroup>');
            (function() {
                for(var i=0;i < 7;i++) {
                    var _col = $('<col width="14%">');
                    $colgroup.append(_col);
                }
            })();
            //����table head
            var $thead = $('<thead></thead>');
            (function() {
                var _tr = $('<tr></tr>');
                for(var i=0;i < 7;i++) {
                    if(i === 0)
                        $('<th class="weekend"><span>����</span>��</th>').appendTo(_tr);
                    if(i === 1)
                        $('<th><span>����</span>һ</th>').appendTo(_tr);
                    if(i === 2)
                        $('<th><span>����</span>��</th>').appendTo(_tr);
                    if(i === 3)
                        $('<th><span>����</span>��</th>').appendTo(_tr);
                    if(i === 4)
                        $('<th><span>����</span>��</th>').appendTo(_tr);
                    if(i === 5)
                        $('<th><span>����</span>��</th>').appendTo(_tr);
                    if(i === 6)
                        $('<th class="weekend"><span>����</span>��</th>').appendTo(_tr);
                }
                //��װtable head
                $thead.append(_tr);
            })();
            //����table body
            var $tbody = $('<tbody></tbody>');
            (function() {
                //�������forѭ������6��trԪ��
                for(var i=0; i < 6; i++) {
                    var _tr = $('<tr></tr>');
                    //�ڲ�forѭ������ÿһ���е�tdԪ��
                    for(var j=0;j < 7; j++) {
                        var _td = $('<td></td>');
                        var _cal_day = $('<div class="cal_day"></div>');
                        var _day_num = $('<div class="day_num">1</div>');
                        var _div = $('<div>��һ</div>');
                        _cal_day.append([_day_num,_div]);
                        _td.append(_cal_day);
                        _tr.append(_td);
                    }
                    $tbody.append(_tr);
                }
            })();
            //��װtable
            $table.append([$colgroup,$thead,$tbody]);
            //��װ���������ݲ�
            $cal_content.append($table);
            //��װ������wrapper
            $cal_wrapper.append([$cal_header,$cal_content]);
            //�������ģ�鵽����container
            w.append($cal_wrapper);
        }

        //����ҳ���ʼ������
        function init() {
            //����ҳ����
            framework($container);
            //��ʼ�� ������
            var cal = new Calendar(tY,tM);
            //Ϊ��ť�ؼ��Ȱ��¼�
            cal.events();
            //��Ⱦ������
            cal.render(tY,tM);
            cal.showLunarInfo(tD);
        }

        //��ʼ��������
        init();

        return this;
    };



    //Calendar�Ĺ��캯��/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /*
     ����˵��: ���������µ����ڣ����Ͽؼ�
     ʹ�÷�ʽ: OBJ = new calendar(��,��������);
     OBJ.length      ���ص��������
     OBJ.firstWeek   ���ص���һ������
     �� OBJ[����].�������� ����ȡ�ø���ֵ
     OBJ[����].isToday  �����Ƿ�Ϊ���� true �� false
     ���� OBJ[����] ���Բμ� calElement() �е�ע��
     */
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function Calendar(y,m) {

        this.$year = y;
        this.$month = m;
        var sDObj, lDObj, lY, lM, lD=1, lL, lX=0, tmp1, tmp2, tmp3;
        var cY, cM, cD; //����,����,����
        var lDPOS = new Array(3);
        var n = 0;
        var firstLM = 0;

        sDObj = new Date(y,m,1,0,0,0,0);    //����һ������

        this.length    = solarDays(y,m);    //������������
        this.firstWeek = sDObj.getDay();    //��������1�����ڼ�

        ////////���� 1900��������Ϊ������(60����36)
        if(m<2) cY=cyclical(y-1900+36-1);
        else cY=cyclical(y-1900+36);
        var term2=sTerm(y,2); //��������

        ////////���� 1900��1��С����ǰΪ ������(60����12)
        var firstNode = sTerm(y,m*2) //���ص��¡��ڡ�Ϊ���տ�ʼ
        cM = cyclical((y-1900)*12+m+12);

        //����һ���� 1900/1/1 �������
        //1900/1/1�� 1970/1/1 ���25567��, 1900/1/1 ����Ϊ������(60����10)
        var dayCyclical = Date.UTC(y,m,1,0,0,0,0)/86400000+25567+10;

        for(var i=0;i<this.length;i++) {

            if(lD>lX) {
                sDObj = new Date(y,m,i+1);    //����һ������
                lDObj = new Lunar(sDObj);     //ũ��
                lY    = lDObj.year;           //ũ����
                lM    = lDObj.month;          //ũ����
                lD    = lDObj.day;            //ũ����
                lL    = lDObj.isLeap;         //ũ���Ƿ�����
                lX    = lL? leapDays(lY): monthDays(lY,lM); //ũ���������һ��

                if(n==0) firstLM = lM;
                lDPOS[n++] = i-lD+1;
            }

            //�������������·ֵ�����, ������Ϊ��
            if(m==1 && (i+1)==term2) cY=cyclical(y-1900+36);
            //����������, �ԡ��ڡ�Ϊ��
            if((i+1)==firstNode) cM = cyclical((y-1900)*12+m+13);
            //����
            cD = cyclical(dayCyclical+i);

            //sYear,sMonth,sDay,week,
            //lYear,lMonth,lDay,isLeap,
            //cYear,cMonth,cDay
            this[i] = new calElement(y, m+1, i+1, nStr3[(i+this.firstWeek)%7],
                lY, lM, lD++, lL,
                cY ,cM, cD );
        }

        //����
        tmp1=sTerm(y,m*2  )-1;
        tmp2=sTerm(y,m*2+1)-1;
        this[tmp1].solarTerms = solarTerm[m*2];
        this[tmp2].solarTerms = solarTerm[m*2+1];
        if(m==3) this[tmp1].color = 'red'; //������ɫ

        //��������
        for(i in sFtv)
            if(sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
                if(Number(RegExp.$1)==(m+1)) {
                    this[Number(RegExp.$2)-1].solarFestival += RegExp.$4 + ' ';
                    if(RegExp.$3=='*') this[Number(RegExp.$2)-1].color = 'red';
                }

        //���ܽ���
        for(i in wFtv)
            if(wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
                if(Number(RegExp.$1)==(m+1)) {
                    tmp1=Number(RegExp.$2);
                    tmp2=Number(RegExp.$3);
                    if(tmp1<5)
                        this[((this.firstWeek>tmp2)?7:0) + 7*(tmp1-1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 + ' ';
                    else {
                        tmp1 -= 5;
                        tmp3 = (this.firstWeek+this.length-1)%7; //�������һ������?
                        this[this.length - tmp3 - 7*tmp1 + tmp2 - (tmp2>tmp3?7:0) - 1 ].solarFestival += RegExp.$5 + ' ';
                    }
                }

        //ũ������
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

        //�����ֻ������3��4��
        if(m==2 || m==3) {
            var estDay = new easter(y);
            if(m == estDay.m)
                this[estDay.d-1].solarFestival = this[estDay.d-1].solarFestival+' ����� Easter Sunday';
        }

        //if(m==2) this[20].solarFestival = this[20].solarFestival+unescape('%20%u6D35%u8CE2%u751F%u65E5');

        //��ɫ������
        if((this.firstWeek+12)%7==5)
            this[12].solarFestival += '��ɫ������';

        //����
        if(y==tY && m==tM) this[tD-1].isToday = true;

    }


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //Calendar��ԭ�Ͷ���
    Calendar.prototype = {

        //ԭ�Ͷ���Ĺ��캯��
        constructor: Calendar,

        //������Ⱦ����
        render: function() {
            var i,sD,s,size;

            //lijun ���������������ݴ浽֮ǰ�ı����У�ʡȥ�ַ��޸�
            var SY = this.$year;
            var SM = this.$month;

            //�����������Ԫ������
            var dayCells = $('.cal_day');
            var sCell,lCell;


            if(SY>1874 && SY<1909) yDisplay = '����' + (((SY-1874)==1)?'Ԫ':SY-1874);
            if(SY>1908 && SY<1912) yDisplay = '��ͳ' + (((SY-1908)==1)?'Ԫ':SY-1908);
            if(SY>1911 && SY<1950) yDisplay = '���' + (((SY-1911)==1)?'Ԫ':SY-1911);
            if(SY>1949) yDisplay = '����' + (((SY-1949)==1)?'Ԫ':SY-1949);

            for(i=0;i<42;i++) {

                sCell = dayCells[i].children[0];
                lCell = dayCells[i].children[1];

                sD = i - this.firstWeek;

                if(sD>-1 && sD<this.length) { //������
                    sCell.innerHTML = sD+1;

                    //��ĩ��ɫ
                    if(this[sD].week == "������" || this[sD].week == "������")
                        $(sCell).addClass('weekend');

                    if(this[sD].isToday) $(dayCells[i]).addClass('today'); //������ɫ

                    sCell.style.color = this[sD].color; //����������ɫ

                    if(this[sD].lDay==1) //��ʾũ����
                        lCell.innerHTML = '<b>'+(this[sD].isLeap?'��':'') + this[sD].lMonth + '��' + (monthDays(this[sD].lYear,this[sD].lMonth)==29?'С':'��')+'</b>';
                    else //��ʾũ����
                        lCell.innerHTML = cDay(this[sD].lDay);

                    s=this[sD].lunarFestival;
                    if(s.length>0) { //ũ������
                        if(s.length>6) s = s.substr(0, 4)+'...';
                        s = s.fontcolor('red');
                    }
                    else { //��������
                        s=this[sD].solarFestival;
                        if(s.length>0) {
                            size = (s.charCodeAt(0)>0 && s.charCodeAt(0)<128)?8:4;
                            if(s.length>size+2) s = s.substr(0, size)+'...';
                            s=(s=='��ɫ������')?s.fontcolor('black'):s.fontcolor('blue');
                        }
                        else { //إ�Ľ���
                            s=this[sD].solarTerms;
                            if(s.length>0) s = s.fontcolor('limegreen');
                        }
                    }

                    if(this[sD].solarTerms=='����') s = '������'.fontcolor('red');
                    if(this[sD].solarTerms=='â��') s = 'â��'.fontcolor('red');
                    if(this[sD].solarTerms=='����') s = '����'.fontcolor('red');
                    if(this[sD].solarTerms=='����') s = '����'.fontcolor('red');

                    if(s.length>0) lCell.innerHTML = s;

                }
                else { //������
                    $(dayCells[i]).children().text('');
                    $(dayCells[i]).css('border','none');
                }
            }
        },

        //�ػ溯��
        rerender: function() {
            this.recoverTdCss();
            this.render();
        },

        //�ָ��ϴ�δ�ֵ�Ԫ���border��ʽ
        recoverTdCss: function() {
            $('.cal_day').css({
                'border-bottom': '1px dotted #ccc',
                'border-radius': '4px',
                'border-right': '1px dotted #ccc'
            });
        },

        //�������¼�����
        events: function() {

            var _cal = this;
            //�������·�ѡ����
            var _yearSelector = $('.cal_year select');
            var _monthSelector = $('.cal_month select');
            var _currentY = $('.cal_year select option')[tY-1900];
            var _currentM = $('.cal_month select option')[tM];

            //�����û�ѡ�������
            var _selectedYear = tY;
            var _selectedMonth = tM;

            //�������
            _yearSelector.change(function() {
                _selectedYear = this.selectedIndex + 1900;
                _cal = new Calendar(_selectedYear,_selectedMonth);
                _cal.rerender();
                _cal.showLunarInfo(tD,_cal);
                //ȡ�������е�.today ������
                if(_selectedYear != tY || _selectedMonth != tM) {
                    $('.cal_day').removeClass('today');
                }
            });
            //�����·�
            _monthSelector.change(function() {
                _selectedMonth = this.selectedIndex;
                _cal = new Calendar(_selectedYear,_selectedMonth);
                _cal.rerender();
                _cal.showLunarInfo(tD,_cal);
                //ȡ�������е�.today ������
                if(_selectedYear != tY || _selectedMonth != tM) {
                    $('.cal_day').removeClass('today');
                }
            });
            //������°�ť
            $('.cal_curmonth button').click(function() {
                //���»��Ʊ�������
                _selectedYear = tY;
                _selectedMonth = tM;
                _cal = new Calendar(tY,tM);
                _cal.rerender(tY,tM);
                _cal.showLunarInfo(tD,_cal);
                $(_currentY).prop('selected','selected');
                $(_currentM).prop('selected','selected');
            });
            //�����������
            $('.cal_day').hover(function(e) {
                if($(this).children('.day_num').text() != "")
                    $(this).addClass('today');
                _cal.showLunarInfo($(this).children('.day_num').text(),_cal);
            },function(e) {
                $(this).removeClass('today');
                if(_selectedYear == tY && _selectedMonth == tM && $(this).children('.day_num').text() == tD) {
                        $(this).addClass('today');
                }
                _cal.showLunarInfo(tD,_cal);
            });
            //����·ݵ����°�ť
            $('.arrow').eq(0).click(function() {
                if(_selectedMonth > 0) {
                    _selectedMonth = _selectedMonth-1;
                    _cal = new Calendar(_selectedYear,_selectedMonth);
                    _cal.rerender();
                    _cal.showLunarInfo(tD,_cal);
                    //ȡ�������е�.today ������
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
                    //ȡ�������е�.today ������
                    if(_selectedYear != tY || _selectedMonth != tM) {
                        $('.cal_day').removeClass('today');
                    }
                }
            });


        },


        //�ػ���header��ʵʱ����ũ����Ϣ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        showLunarInfo: function(focusDay,cal) {
            //����hover�յ�Ԫ���header��ʵ��Ӱ��
            //���幫������������
            var _cal = cal;
            var _allDays;
            if(_cal != undefined) {
                _allDays = _cal.length;
            } else {
                _allDays = 32;
            }
            if(focusDay != "") {
                //����header����ʾ����
                if(focusDay < _allDays) {
                    $('.cal_date').text(this[focusDay-1].sYear+'-'+this[focusDay-1].sMonth+'-'+this[focusDay-1].sDay+' '+this[focusDay-1].week);
                    //����header����ʾ�����ũ����Ϣ
                    var _spans = $('.cal_lunar span');
                    $(_spans[0]).text(nStr4[this[focusDay-1].lMonth-1] + '��' + cDay(this[focusDay-1].lDay));
                    $(_spans[1]).text(this[focusDay-1].cYear + '�� ��'+Animals[(this.$year-4)%12]+'�꡿');
                    $(_spans[2]).text(this[focusDay-1].cMonth + '�� ' + this[focusDay-1].cDay + '��');
                } else {
                    $('.cal_date').text(this[_allDays-1].sYear+'-'+this[_allDays-1].sMonth+'-'+this[_allDays-1].sDay+' '+this[_allDays-1].week);
                    //����header����ʾ�����ũ����Ϣ
                    var _spans = $('.cal_lunar span');
                    $(_spans[0]).text(nStr4[this[_allDays-1].lMonth-1] + '��' + cDay(this[_allDays-1].lDay));
                    $(_spans[1]).text(this[_allDays-1].cYear + '�� ��'+Animals[(this.$year-4)%12]+'�꡿');
                    $(_spans[2]).text(this[_allDays-1].cMonth + '�� ' + this[_allDays-1].cDay + '��');
                }

                //��λ���·�ѡ��������ȷ���·�
                $($('.cal_year select option')[this.$year-1900]).prop('selected','selected');
                $($('.cal_month select option')[this.$month]).prop('selected','selected');
            }
        }
    }
})(jQuery);