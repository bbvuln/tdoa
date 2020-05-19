
//datePicker���ڿؼ� v1.0

//var calendar = new datePicker();
//calendar.init({
//    'trigger': '#demo1', /*ѡ�����������������*/
//    'type': 'date',/*date ��������ѡ�� datetime ��������ʱ��ѡ�� time ����ʱ��ѡ�� ym ��������ѡ��*/
//    'minDate':'1900-1-1',/*��С����*/
//    'maxDate':new Date().getFullYear()+'-'+(new Date().getMonth()+1)+'-'+new Date().getDate(),/*�������*/
//    'onSubmit':function(){/*ȷ��ʱ�����¼�*/
//        var theSelectData=calendar.value;
//    },
//    'onClose':function(){/*ȡ��ʱ�����¼�*/
//    }
//});

window.datePicker = (function() {
    var MobileCalendar = function() {
        this.gearDate;
        this.minY = 1900;
        this.minM = 1;
        this.minD = 1;
        this.maxY = 2099;
        this.maxM = 12;
        this.maxD = 31;
        this.value="";
    };

    var cssHtm='.gearYM,.gearDate,.gearDatetime,.gearTime{font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:8px;background-color:rgba(0,0,0,0.2);display:block;position:fixed;top:0;left:0;width:100%;height:100%;z-index:9900;overflow:hidden;-webkit-animation-fill-mode:both;animation-fill-mode:both}.date_ctrl{vertical-align:middle;background-color:#d5d8df;color:#000;margin:0;height:auto;width:100%;position:absolute;left:0;bottom:0;z-index:9901;overflow:hidden;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.slideInUp{animation:slideInUp .3s ease;-webkit-animation:slideInUp .3s ease;}@-webkit-keyframes slideInUp{from{-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}.ym_roll,.date_roll,.datetime_roll,.time_roll{display:-webkit-box;width:100%;height:auto;overflow:hidden;font-weight:bold;background-color:transparent;-webkit-mask:-webkit-gradient(linear,0% 50%,0% 100%,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(top,#debb47 50%,rgba(36,142,36,0))}.ym_roll>div,.date_roll>div,.datetime_roll>div,.time_roll>div{font-size:2.3em;height:6em;float:left;background-color:transparent;position:relative;overflow:hidden;-webkit-box-flex:4}.ym_roll>div .gear,.date_roll>div .gear,.datetime_roll>div .gear,.time_roll>div .gear{width:100%;float:left;position:absolute;z-index:9902;margin-top:-6em}.date_roll_mask{-webkit-mask:-webkit-gradient(linear,0% 40%,0% 0%,from(#debb47),to(rgba(36,142,36,0)));-webkit-mask:-webkit-linear-gradient(bottom,#debb47 50%,rgba(36,142,36,0));padding:0 0 3em 0}.date_roll>div:nth-child(2){-webkit-box-flex:2}.date_roll>div:nth-child(1),.datetime_roll>div:nth-child(1){-webkit-box-flex:4}.datetime_roll>div:first-child{-webkit-box-flex:6}.datetime_roll>div:last-child{-webkit-box-flex:6}.date_grid{position:relative;top:2em;width:100%;height:2em;margin:0;box-sizing:border-box;z-index:0;border-top:1px solid #abaeb5;border-bottom:1px solid #abaeb5}.date_grid>div{color:#000;position:absolute;right:0;top:0;font-size:.8em;line-height:2.5em}.date_roll>div:nth-child(3) .date_grid>div{left:42%}.datetime_roll>div .date_grid>div{right:0}.datetime_roll>div:first-child .date_grid>div{left:auto;right:0%}.datetime_roll>div:last-child .date_grid>div{left:50%}.time_roll>div:nth-child(1) .date_grid>div{right:1em}.ym_roll>div:nth-child(1) .date_grid>div{right:.1em}.ym_roll>div .date_grid>div,.time_roll>div .date_grid>div{right:1.5em}.date_btn{color:#0575f2;font-size:1.6em;font-weight:bold;line-height:1em;text-align:center;padding:.8em 1em}.date_btn_box:before,.date_btn_box:after{content:"";position:absolute;height:1px;width:100%;display:block;background-color:#96979b;z-index:15;-webkit-transform:scaleY(0.33);transform:scaleY(0.33)}.date_btn_box{display:-webkit-box;-webkit-box-pack:justify;-webkit-box-align:stretch;background-color:#f1f2f4;position:relative}.date_btn_box:before{left:0;top:0;-webkit-transform-origin:50% 20%;transform-origin:50% 20%}.date_btn_box:after{left:0;bottom:0;-webkit-transform-origin:50% 70%;transform-origin:50% 70%}.date_roll>div:nth-child(1) .gear{text-indent:20%}.date_roll>div:nth-child(2) .gear{text-indent:-20%}.date_roll>div:nth-child(3) .gear{text-indent:-55%}.datetime_roll>div .gear{width:100%;text-indent:-25%}.datetime_roll>div:first-child .gear{text-indent:-10%}.datetime_roll>div:last-child .gear{text-indent:-50%}.ym_roll>div .gear,.time_roll>div .gear{width:100%;}.ym_roll>div:nth-child(1) .gear,.time_roll>div:nth-child(1) .gear{width:100%;text-indent:10%}.tooth{height:2em;line-height:2em;text-align:center}';
    var cssEle = document.createElement("style");
	cssEle.type = "text/css";
	cssEle.appendChild(document.createTextNode(cssHtm));
	document.getElementsByTagName("head")[0].appendChild(cssEle);

    MobileCalendar.prototype = {
        init: function(params) {
            this.type = params.type;
            this.format = params.format;
            this.optyear='';//�ϴ�ѡ�����
            this.optMonth='';
            this.optDay='';
            this.optHour='';
            this.optMinute='';
            this.optsecond='';
            this.trigger = document.querySelector(params.trigger);
            if (this.trigger.getAttribute("data-lcalendar") != null) {
                var arr = this.trigger.getAttribute("data-lcalendar").split(',');
                var minArr = arr[0].split('-');
                this.minY = ~~minArr[0];
                this.minM = ~~minArr[1];
                this.minD = ~~minArr[2];
                var maxArr = arr[1].split('-');
                this.maxY = ~~maxArr[0];
                this.maxM = ~~maxArr[1];
                this.maxD = ~~maxArr[2];
            };
            if (params.minDate) {
                var minArr = params.minDate.split('-');
                this.minY = ~~minArr[0];
                this.minM = ~~minArr[1];
                this.minD = ~~minArr[2];
            };
            if (params.maxDate) {
                var maxArr = params.maxDate.split('-');
                this.maxY = ~~maxArr[0];
                this.maxM = ~~maxArr[1];
                this.maxD = ~~maxArr[2];
            };
            this.onClose= params.onClose;
            this.onSubmit= params.onSubmit;
            this.onChange= params.onChange;
            this.bindEvent(this.type);
        },
        bindEvent: function(type) {
            var _self = this;
            var isTouched = false , isMoved = false;
            var pree;
            //�������ڲ��
            function popupDate(e) {
                _self.gearDate = document.createElement("div");
                _self.gearDate.className = "gearDate";
                _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                    '<div class="date_btn_box">' +
                    '<div class="date_btn lcalendar_cancel">ȡ��</div>' +
                    '<div class="date_btn lcalendar_finish">ȷ��</div>' +
                    '</div>' +
                    '<div class="date_roll_mask">' +
                    '<div class="date_roll">' +
                    '<div>' +
                    '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear date_dd" data-datetype="date_dd"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div><div class="date_bg" style="width:100%;height:100%;"></div>';
                document.body.appendChild(_self.gearDate);
                dateCtrlInit();
                var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                lcalendar_finish.addEventListener('touchstart', finishMobileDate);
                var lcalendar_bg = _self.gearDate.querySelector(".date_bg");
                lcalendar_bg.addEventListener('click', closeMobileCalendar);
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                var date_dd = _self.gearDate.querySelector(".date_dd");
                date_yy.addEventListener('touchstart', gearTouchStart);
                date_mm.addEventListener('touchstart', gearTouchStart);
                date_dd.addEventListener('touchstart', gearTouchStart);
                date_yy.addEventListener('touchmove', gearTouchMove);
                date_mm.addEventListener('touchmove', gearTouchMove);
                date_dd.addEventListener('touchmove', gearTouchMove);
                date_yy.addEventListener('touchend', gearTouchEnd);
                date_mm.addEventListener('touchend', gearTouchEnd);
                date_dd.addEventListener('touchend', gearTouchEnd);
                //-------------------------------------------------------------
                lcalendar_cancel.addEventListener('click', closeMobileCalendar);
                lcalendar_finish.addEventListener('click', finishMobileDate);
                date_yy.addEventListener('mousedown', gearTouchStart);
                date_mm.addEventListener('mousedown', gearTouchStart);
                date_dd.addEventListener('mousedown', gearTouchStart);
                date_yy.addEventListener('mousemove', gearTouchMove);
                date_mm.addEventListener('mousemove', gearTouchMove);
                date_dd.addEventListener('mousemove', gearTouchMove);
                date_yy.addEventListener('mouseup', gearTouchEnd);
                date_mm.addEventListener('mouseup', gearTouchEnd);
                date_dd.addEventListener('mouseup', gearTouchEnd);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', gearTouchOut);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', gearTouchOut);
            }
            //��ʼ�������ղ��Ĭ��ֵ
            function dateCtrlInit(e) {
                var date = new Date();
                var dateArr = {
                    yy: date.getYear(),
                    mm: date.getMonth(),
                    dd: date.getDate() - 1
                };
                if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(_self.trigger.value)) {
                    rs = _self.trigger.value.match(/(^|-)\d{1,4}/g);
                    dateArr.yy = rs[0] - _self.minY;
                    dateArr.mm = rs[1].replace(/-/g, "") - 1;
                    dateArr.dd = rs[2].replace(/-/g, "") - 1;
                } else {
                    CtrlInit(dateArr, _self.optyear,_self.optMonth,_self.optDay,_self.optHour,_self.optMinute,_self.optsecond)
                }
                if(!e){
                    _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
                    _self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
                }
                _self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
                setDateGearTooth();
            }
                      //�����ղ��
                      function popupDD(e) {
                        _self.gearDate = document.createElement("div");
                        _self.gearDate.className = "gearDate";
                        _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                        '<div class="date_btn_box">' +
                        '<div class="date_btn lcalendar_cancel">ȡ��</div>' +
                        '<div class="date_btn lcalendar_finish">ȷ��</div>' +
                        '</div>' +
                        '<div class="date_roll_mask">' +
                        '<div class="ym_roll">' +
                        '<div>' +
                        '<div class="gear date_dd" data-datetype="date_dd"></div>' +
                        '<div class="date_grid">' +
                        '<div>��</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div><div class="date_bg" style="width:100%;height:100%;"></div>';
                        document.body.appendChild(_self.gearDate);
                        dateCtrlInit('dd');
                        var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                        lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                        var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                        lcalendar_finish.addEventListener('touchstart', finishMobileDD);
                        var lcalendar_bg = _self.gearDate.querySelector(".date_bg");
                        lcalendar_bg.addEventListener('click', closeMobileCalendar);
                        var date_dd = _self.gearDate.querySelector(".date_dd");
                        date_dd.addEventListener('touchstart', gearTouchStart);
                        date_dd.addEventListener('touchmove', gearTouchMove);
                        date_dd.addEventListener('touchend', gearTouchEnd);
                        //-------------------------------------------------------------
                        lcalendar_cancel.addEventListener('click', closeMobileCalendar);
                        lcalendar_finish.addEventListener('click', finishMobileDD);
                        date_dd.addEventListener('mousedown', gearTouchStart);
                        date_dd.addEventListener('mousemove', gearTouchMove);
                        date_dd.addEventListener('mouseup', gearTouchEnd);
                        _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', gearTouchOut);
                        _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', gearTouchOut);
                    }

             //�����²��
             function popupMM(e) {
                _self.gearDate = document.createElement("div");
                _self.gearDate.className = "gearDate";
                _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                '<div class="date_btn_box">' +
                '<div class="date_btn lcalendar_cancel">ȡ��</div>' +
                '<div class="date_btn lcalendar_finish">ȷ��</div>' +
                '</div>' +
                '<div class="date_roll_mask">' +
                '<div class="ym_roll">' +
                '<div>' +
                '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                '<div class="date_grid">' +
                '<div>��</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div><div class="date_bg" style="width:100%;height:100%;"></div>';
                document.body.appendChild(_self.gearDate);
                ymCtrlInit('m');
                var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                lcalendar_finish.addEventListener('touchstart', finishMobileMM);
                var lcalendar_bg = _self.gearDate.querySelector(".date_bg");
                lcalendar_bg.addEventListener('click', closeMobileCalendar);
                var date_mm = _self.gearDate.querySelector(".date_mm");
                date_mm.addEventListener('touchstart', gearTouchStart);
                date_mm.addEventListener('touchmove', gearTouchMove);
                date_mm.addEventListener('touchend', gearTouchEnd);
                //-------------------------------------------------------------
                lcalendar_cancel.addEventListener('click', closeMobileCalendar);
                lcalendar_finish.addEventListener('click', finishMobileMM);
                date_mm.addEventListener('mousedown', gearTouchStart);
                date_mm.addEventListener('mousemove', gearTouchMove);
                date_mm.addEventListener('mouseup', gearTouchEnd);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', gearTouchOut);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', gearTouchOut);
            }
                       //��������
                       function popupYYYY(e) {
                        _self.gearDate = document.createElement("div");
                        _self.gearDate.className = "gearDate";
                        _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                            '<div class="date_btn_box">' +
                            '<div class="date_btn lcalendar_cancel">ȡ��</div>' +
                            '<div class="date_btn lcalendar_finish">ȷ��</div>' +
                            '</div>' +
                            '<div class="date_roll_mask">' +
                            '<div class="ym_roll">' +
                            '<div>' +
                            '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                            '<div class="date_grid">' +
                            '<div>��</div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</div><div class="date_bg" style="width:100%;height:100%;"></div>';
                        document.body.appendChild(_self.gearDate);
                        ymCtrlInit('y');
                        var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                        lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                        var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                        lcalendar_finish.addEventListener('touchstart', finishMobileYYYY);
                        var lcalendar_bg = _self.gearDate.querySelector(".date_bg");
                        lcalendar_bg.addEventListener('click', closeMobileCalendar);
                        var date_yy = _self.gearDate.querySelector(".date_yy");
                        date_yy.addEventListener('touchstart', gearTouchStart);
                        date_yy.addEventListener('touchmove', gearTouchMove);
                        date_yy.addEventListener('touchend', gearTouchEnd);
                        //-------------------------------------------------------------
                        lcalendar_cancel.addEventListener('click', closeMobileCalendar);
                        lcalendar_finish.addEventListener('click', finishMobileYYYY);
                        date_yy.addEventListener('mousedown', gearTouchStart);
                        date_yy.addEventListener('mousemove', gearTouchMove);
                        date_yy.addEventListener('mouseup', gearTouchEnd);
                        _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', gearTouchOut);
                        _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', gearTouchOut);
                    }
            //�������²��
            function popupYM(e) {
                _self.gearDate = document.createElement("div");
                _self.gearDate.className = "gearDate";
                _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                    '<div class="date_btn_box">' +
                    '<div class="date_btn lcalendar_cancel">ȡ��</div>' +
                    '<div class="date_btn lcalendar_finish">ȷ��</div>' +
                    '</div>' +
                    '<div class="date_roll_mask">' +
                    '<div class="ym_roll">' +
                    '<div>' +
                    '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div><div class="date_bg" style="width:100%;height:100%;"></div>';
                document.body.appendChild(_self.gearDate);
                ymCtrlInit();
                var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                lcalendar_finish.addEventListener('touchstart', finishMobileYM);
                var lcalendar_bg = _self.gearDate.querySelector(".date_bg");
                lcalendar_bg.addEventListener('click', closeMobileCalendar);
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                date_yy.addEventListener('touchstart', gearTouchStart);
                date_mm.addEventListener('touchstart', gearTouchStart);
                date_yy.addEventListener('touchmove', gearTouchMove);
                date_mm.addEventListener('touchmove', gearTouchMove);
                date_yy.addEventListener('touchend', gearTouchEnd);
                date_mm.addEventListener('touchend', gearTouchEnd);
                //-------------------------------------------------------------
                lcalendar_cancel.addEventListener('click', closeMobileCalendar);
                lcalendar_finish.addEventListener('click', finishMobileYM);
                date_yy.addEventListener('mousedown', gearTouchStart);
                date_mm.addEventListener('mousedown', gearTouchStart);
                date_yy.addEventListener('mousemove', gearTouchMove);
                date_mm.addEventListener('mousemove', gearTouchMove);
                date_yy.addEventListener('mouseup', gearTouchEnd);
                date_mm.addEventListener('mouseup', gearTouchEnd);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', gearTouchOut);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', gearTouchOut);
            }
            //��ʼ�����²��Ĭ��ֵ
            function ymCtrlInit(e) {
                var date = new Date();
                var dateArr = {
                    yy: date.getYear(),
                    mm: date.getMonth()
                };
                if (/^\d{4}-\d{1,2}$/.test(_self.trigger.value)) {
                    rs = _self.trigger.value.match(/(^|-)\d{1,4}/g);
                    dateArr.yy = rs[0] - _self.minY;
                    dateArr.mm = rs[1].replace(/-/g, "") - 1;
                } else {
                    dateArr.yy = dateArr.yy + 1900 - _self.minY;
                }
                if(e!='y'){
                    _self.gearDate.querySelector(".date_mm").setAttribute("val", dateArr.mm);
                }
                if(e!='m'){
                    _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
                }
                setDateGearTooth();
            }
            //��������+ʱ����
            function popupDateTime(e) {
                _self.gearDate = document.createElement("div");
                _self.gearDate.className = "gearDatetime";
                _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                    '<div class="date_btn_box">' +
                    '<div class="date_btn lcalendar_cancel">ȡ��</div>' +
                    '<div class="date_btn lcalendar_finish">ȷ��</div>' +
                    '</div>' +
                    '<div class="date_roll_mask">' +
                    '<div class="datetime_roll">' +
                    '<div>' +
                    '<div class="gear date_yy" data-datetype="date_yy"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear date_mm" data-datetype="date_mm"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear date_dd" data-datetype="date_dd"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear time_hh" data-datetype="time_hh"></div>' +
                    '<div class="date_grid">' +
                    '<div>ʱ</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear time_mm" data-datetype="time_mm"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear time_ss" data-datetype="time_ss"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' + //date_roll
                    '</div>' + //date_roll_mask
                    '</div><div class="date_bg" style="width:100%;height:100%;"></div>';
                document.body.appendChild(_self.gearDate);
                dateTimeCtrlInit();
                var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                lcalendar_finish.addEventListener('touchstart', finishMobileDateTime);
                var lcalendar_bg = _self.gearDate.querySelector(".date_bg");
                lcalendar_bg.addEventListener('click', closeMobileCalendar);
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var date_mm = _self.gearDate.querySelector(".date_mm");
                var date_dd = _self.gearDate.querySelector(".date_dd");
                var time_hh = _self.gearDate.querySelector(".time_hh");
                var time_mm = _self.gearDate.querySelector(".time_mm");
                var time_ss = _self.gearDate.querySelector(".time_ss");
                date_yy.addEventListener('touchstart', gearTouchStart);
                date_mm.addEventListener('touchstart', gearTouchStart);
                date_dd.addEventListener('touchstart', gearTouchStart);
                time_hh.addEventListener('touchstart', gearTouchStart);
                time_mm.addEventListener('touchstart', gearTouchStart);
                time_ss.addEventListener('touchstart', gearTouchStart);
                date_yy.addEventListener('touchmove', gearTouchMove);
                date_mm.addEventListener('touchmove', gearTouchMove);
                date_dd.addEventListener('touchmove', gearTouchMove);
                time_hh.addEventListener('touchmove', gearTouchMove);
                time_mm.addEventListener('touchmove', gearTouchMove);
                time_ss.addEventListener('touchmove', gearTouchMove);
                date_yy.addEventListener('touchend', gearTouchEnd);
                date_mm.addEventListener('touchend', gearTouchEnd);
                date_dd.addEventListener('touchend', gearTouchEnd);
                time_hh.addEventListener('touchend', gearTouchEnd);
                time_mm.addEventListener('touchend', gearTouchEnd);
                time_ss.addEventListener('touchend', gearTouchEnd);
                //-------------------------------------------------------------
                lcalendar_cancel.addEventListener('click', closeMobileCalendar);
                lcalendar_finish.addEventListener('click', finishMobileDateTime);
                date_yy.addEventListener('mousedown', gearTouchStart);
                date_mm.addEventListener('mousedown', gearTouchStart);
                date_dd.addEventListener('mousedown', gearTouchStart);
                time_hh.addEventListener('mousedown', gearTouchStart);
                time_mm.addEventListener('mousedown', gearTouchStart);
                time_ss.addEventListener('mousedown', gearTouchStart);
                date_yy.addEventListener('mousemove', gearTouchMove);
                date_mm.addEventListener('mousemove', gearTouchMove);
                date_dd.addEventListener('mousemove', gearTouchMove);
                time_hh.addEventListener('mousemove', gearTouchMove);
                time_mm.addEventListener('mousemove', gearTouchMove);
                time_ss.addEventListener('mousemove', gearTouchMove);
                date_yy.addEventListener('mouseup', gearTouchEnd);
                date_mm.addEventListener('mouseup', gearTouchEnd);
                date_dd.addEventListener('mouseup', gearTouchEnd);
                time_hh.addEventListener('mouseup', gearTouchEnd);
                time_mm.addEventListener('mouseup', gearTouchEnd);
                time_ss.addEventListener('mouseup', gearTouchEnd);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', gearTouchOut);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', gearTouchOut);
            }
            //��ʼ���Զ���ؼ�Ĭ��ֵ
            function CtrlInit(dateArr,optyear,optMonth,optDay,optHour,optMinute,optsecond){
                    dateArr.yy = optyear =='' ? dateArr.yy : parseInt(optyear)-1900
                    dateArr.mm = optMonth =='' ? dateArr.mm : parseInt(optMonth)-1
                    dateArr.dd = optDay =='' ? dateArr.dd : parseInt(optDay)-1
                    dateArr.hh = optHour =='' ? dateArr.hh : parseInt(optHour)
                    dateArr.mi = optMinute ==''? dateArr.mi : parseInt(optMinute)
                    dateArr.ss = optsecond =='' ? dateArr.ss : parseInt(optsecond)
                return dateArr
            }
            //��ʼ��������ʱ������Ĭ��ֵ
            function dateTimeCtrlInit() {
                var date = new Date();
                var dateArr = {
                    yy: date.getYear(),
                    mm: date.getMonth(),
                    dd: date.getDate() - 1,
                    hh: date.getHours(),
                    mi: date.getMinutes(),
                    ss: date.getSeconds()
                };
                if (/^\d{4}-\d{1,2}-\d{1,2}\s\d{2}:\d{2}:\d{2}$/.test(_self.trigger.value)) {
                    rs = _self.trigger.value.match(/(^|-|\s|:)\d{1,4}/g);
                    dateArr.yy = rs[0] - _self.minY;
                    dateArr.mm = rs[1].replace(/-/g, "") - 1;
                    dateArr.dd = rs[2].replace(/-/g, "") - 1;
                    dateArr.hh = parseInt(rs[3].replace(/\s0?/g, ""));
                    dateArr.mi = parseInt(rs[4].replace(/:0?/g, ""));
                    dateArr.ss = parseInt(rs[5].replace(/:0?/g, ""))
                } else {
                    CtrlInit(dateArr, _self.optyear,_self.optMonth,_self.optDay,_self.optHour,_self.optMinute,_self.optsecond)
                }
                _self.gearDate.querySelector(".date_yy").setAttribute("val", dateArr.yy);
                _self.gearDate.querySelector(".date_mm").setAttribute("val" ,dateArr.mm);
                _self.gearDate.querySelector(".date_dd").setAttribute("val", dateArr.dd);
                setDateGearTooth();
                _self.gearDate.querySelector(".time_hh").setAttribute("val", dateArr.hh);
                _self.gearDate.querySelector(".time_mm").setAttribute("val", dateArr.mi);
                _self.gearDate.querySelector(".time_ss").setAttribute("val", dateArr.ss);
                setTimeGearTooth();
            }
            //����ʱ����
            function popupTime(e) {
                _self.gearDate = document.createElement("div");
                _self.gearDate.className = "gearDate";
                _self.gearDate.innerHTML = '<div class="date_ctrl slideInUp">' +
                    '<div class="date_btn_box">' +
                    '<div class="date_btn lcalendar_cancel">ȡ��</div>' +
                    '<div class="date_btn lcalendar_finish">ȷ��</div>' +
                    '</div>' +
                    '<div class="date_roll_mask">' +
                    '<div class="time_roll">' +
                    '<div>' +
                    '<div class="gear time_hh" data-datetype="time_hh"></div>' +
                    '<div class="date_grid">' +
                    '<div>ʱ</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear time_mm" data-datetype="time_mm"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear time_ss" data-datetype="time_ss"></div>' +
                    '<div class="date_grid">' +
                    '<div>��</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' + //time_roll
                    '</div>' +
                    '</div><div class="date_bg" style="width:100%;height:100%;"></div>';
                document.body.appendChild(_self.gearDate);
                timeCtrlInit();
                var lcalendar_cancel = _self.gearDate.querySelector(".lcalendar_cancel");
                lcalendar_cancel.addEventListener('touchstart', closeMobileCalendar);
                var lcalendar_finish = _self.gearDate.querySelector(".lcalendar_finish");
                lcalendar_finish.addEventListener('touchstart', finishMobileTime);
                var lcalendar_bg = _self.gearDate.querySelector(".date_bg");
                lcalendar_bg.addEventListener('click', closeMobileCalendar);
                var time_hh = _self.gearDate.querySelector(".time_hh");
                var time_mm = _self.gearDate.querySelector(".time_mm");
                var time_ss = _self.gearDate.querySelector(".time_ss");
                time_hh.addEventListener('touchstart', gearTouchStart);
                time_mm.addEventListener('touchstart', gearTouchStart);
                time_ss.addEventListener('touchstart', gearTouchStart);
                time_hh.addEventListener('touchmove', gearTouchMove);
                time_mm.addEventListener('touchmove', gearTouchMove);
                time_ss.addEventListener('touchmove', gearTouchMove);
                time_hh.addEventListener('touchend', gearTouchEnd);
                time_mm.addEventListener('touchend', gearTouchEnd);
                time_ss.addEventListener('touchend', gearTouchEnd);
                //-------------------------------------------------------------
                lcalendar_cancel.addEventListener('click', closeMobileCalendar);
                lcalendar_finish.addEventListener('click', finishMobileTime);
                time_hh.addEventListener('mousedown', gearTouchStart);
                time_mm.addEventListener('mousedown', gearTouchStart);
                time_ss.addEventListener('mousedown', gearTouchStart);
                time_hh.addEventListener('mousemove', gearTouchMove);
                time_mm.addEventListener('mousemove', gearTouchMove);
                time_ss.addEventListener('mousemove', gearTouchMove);
                time_hh.addEventListener('mouseup', gearTouchEnd);
                time_mm.addEventListener('mouseup', gearTouchEnd);
                time_ss.addEventListener('mouseup', gearTouchEnd);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseleave', gearTouchOut);
                _self.gearDate.querySelector(".date_roll_mask").addEventListener('mouseup', gearTouchOut);
            }
            //��ʼ��ʱ������Ĭ��ֵ
            function timeCtrlInit() {
                var d = new Date();
                var dateArr = {
                    hh: d.getHours(),
                    mm: d.getMinutes(),
                    ss: d.getSeconds(),
                };
                if (/^\d{2}:\d{2}:\d{2}$/.test(_self.trigger.value)) {
                    rs = _self.trigger.value.match(/(^|:)\d{2}/g);
                    dateArr.hh = parseInt(rs[0].replace(/^0?/g, ""));
                    dateArr.mm = parseInt(rs[1].replace(/:0?/g, ""))
                    dateArr.ss = parseInt(rs[2].replace(/:0?/g, ""))
                }else{
                    CtrlInit(dateArr, _self.optyear,_self.optMonth,_self.optDay,_self.optHour,_self.optMinute,_self.optsecond)
                }
                _self.gearDate.querySelector(".time_hh").setAttribute("val", dateArr.hh);
                _self.gearDate.querySelector(".time_mm").setAttribute("val", dateArr.mm);
                _self.gearDate.querySelector(".time_ss").setAttribute("val", dateArr.ss);
                setTimeGearTooth();
            }
            //�������ڽڵ����
            function setDateGearTooth() {
                var passY = _self.maxY - _self.minY + 1;
                var date_yy = _self.gearDate.querySelector(".date_yy");
                var itemStr = "";
                if (date_yy && date_yy.getAttribute("val")) {
                    //�õ���ݵ�ֵ
                    var yyVal = parseInt(date_yy.getAttribute("val"));
                    //p ��ǰ�ڵ�ǰ����Ҫչʾ�Ľڵ����
                    for (var p = 0; p <= passY - 1; p++) {
                        itemStr += "<div class='tooth'>" + (_self.minY + p) + "</div>";
                    }
                    date_yy.innerHTML = itemStr;
                    var top = Math.floor(parseFloat(date_yy.getAttribute('top')));
                    if (!isNaN(top)) {
                        top % 2 == 0 ? (top = top) : (top = top + 1);
                        top > 8 && (top = 8);
                        var minTop = 8 - (passY - 1) * 2;
                        top < minTop && (top = minTop);
                        date_yy.style["-webkit-transform"] = 'translate3d(0,' + top + 'em,0)';
                        date_yy.setAttribute('top', top + 'em');
                        yyVal = Math.abs(top - 8) / 2;
                        date_yy.setAttribute("val", yyVal);
                    } else {
                        date_yy.style["-webkit-transform"] = 'translate3d(0,' + (8 - yyVal * 2) + 'em,0)';
                        date_yy.setAttribute('top', 8 - yyVal * 2 + 'em');
                    }
                }
                var date_mm = _self.gearDate.querySelector(".date_mm");
                if (date_mm && date_mm.getAttribute("val")) {

                    itemStr = "";
                    //�õ��·ݵ�ֵ
                    var mmVal = parseInt(date_mm.getAttribute("val"));
                    var maxM = 11;
                    var minM = 0;
                    //����ݵ������ֵ
                    if (yyVal == passY - 1) {
                        maxM = _self.maxM - 1;
                    }
                    //����ݵ�����Сֵ
                    if (yyVal == 0) {
                        minM = _self.minM - 1;
                    }
                    //p ��ǰ�ڵ�ǰ����Ҫչʾ�Ľڵ����
                    for (var p = 0; p < maxM - minM + 1; p++) {
                        itemStr += "<div class='tooth'>" + (minM + p + 1) + "</div>";
                    }
                    date_mm.innerHTML = itemStr;
                    if (mmVal > maxM) {
                        mmVal = maxM;
                        date_mm.setAttribute("val", mmVal);
                    } else if (mmVal < minM) {
                        mmVal = maxM;
                        date_mm.setAttribute("val", mmVal);
                    }
                    date_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - (mmVal - minM) * 2) + 'em,0)';
                    date_mm.setAttribute('top', 8 - (mmVal - minM) * 2 + 'em');
                }
                var date_dd = _self.gearDate.querySelector(".date_dd");
                if (date_dd && date_dd.getAttribute("val")) {
                    itemStr = "";
                    //�õ����ڵ�ֵ
                    var ddVal = parseInt(date_dd.getAttribute("val"));
                    //�����·ݵ�����
                    var maxMonthDays = calcDays(yyVal, mmVal);
                    //p ��ǰ�ڵ�ǰ����Ҫչʾ�Ľڵ����
                    var maxD = maxMonthDays - 1;
                    var minD = 0;
                    //������·ݵ������ֵ
                    if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
                        maxD = _self.maxD - 1;
                    }
                    //���ꡢ�µ�����Сֵ
                    if (yyVal == 0 && _self.minM == mmVal + 1) {
                        minD = _self.minD - 1;
                    }
                    for (var p = 0; p < maxD - minD + 1; p++) {
                        itemStr += "<div class='tooth'>" + (minD + p + 1) + "</div>";
                    }
                    date_dd.innerHTML = itemStr;
                    if (ddVal > maxD) {
                        ddVal = maxD;
                        date_dd.setAttribute("val", ddVal);
                    } else if (ddVal < minD) {
                        ddVal = minD;
                        date_dd.setAttribute("val", ddVal);
                    }
                    date_dd.style["-webkit-transform"] = 'translate3d(0,' + (8 - (ddVal - minD) * 2) + 'em,0)';
                    date_dd.setAttribute('top', 8 - (ddVal - minD) * 2 + 'em');
                } else {
                    return false;
                }
            }
            //����ʱ��ڵ����
            function setTimeGearTooth() {
                var time_hh = _self.gearDate.querySelector(".time_hh");
                if (time_hh && time_hh.getAttribute("val")) {
                    var i = "";
                    var hhVal = parseInt(time_hh.getAttribute("val"));
                    for (var g = 0; g <= 23; g++) {
                        i += "<div class='tooth'>" + g + "</div>";
                    }
                    time_hh.innerHTML = i;
                    time_hh.style["-webkit-transform"] = 'translate3d(0,' + (8 - hhVal * 2) + 'em,0)';
                    time_hh.setAttribute('top', 8 - hhVal * 2 + 'em');
                }
                var time_mm = _self.gearDate.querySelector(".time_mm");
                if (time_mm && time_mm.getAttribute("val")) {
                    var i = "";
                    var mmVal = parseInt(time_mm.getAttribute("val"));
                    for (var g = 0; g <= 59; g++) {
                        i += "<div class='tooth'>" + g + "</div>";
                    }
                    time_mm.innerHTML = i;
                    time_mm.style["-webkit-transform"] = 'translate3d(0,' + (8 - mmVal * 2) + 'em,0)';
                    time_mm.setAttribute('top', 8 - mmVal * 2 + 'em');
                }
                var time_ss = _self.gearDate.querySelector(".time_ss");
                if (time_ss && time_ss.getAttribute("val")) {
                    var i = "";
                    var ssVal = parseInt(time_ss.getAttribute("val"));
                    for (var g = 0; g <= 59; g++) {
                        i += "<div class='tooth'>" + g + "</div>";
                    }
                    time_ss.innerHTML = i;
                    time_ss.style["-webkit-transform"] = 'translate3d(0,' + (8 - ssVal * 2) + 'em,0)';
                    time_ss.setAttribute('top', 8 - ssVal * 2 + 'em');
                }
            }
            //���·��������
            function calcDays(year, month) {
                if (month == 1) {
                    year += _self.minY;
                    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0 && year % 4000 != 0)) {
                        return 29;
                    } else {
                        return 28;
                    }
                } else {
                    if (month == 3 || month == 5 || month == 8 || month == 10) {
                        return 30;
                    } else {
                        return 31;
                    }
                }
            }
            //������ʼ
            function gearTouchStart(e) {
            	if (isMoved || isTouched) return;
                isTouched = true;
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches ? e.targetTouches[0].screenY : e.pageY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                };
                pree=e;
            }
            //��ָ�ƶ�
            function gearTouchMove(e) {
            	if (!isTouched) return;
            	isMoved = true;
                e.preventDefault();
                if(pree) var target = pree.target; else
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                target["new_" + target.id] = e.targetTouches ? e.targetTouches[0].screenY : e.pageY;
                target["n_t_" + target.id] = (new Date()).getTime();
                //var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / target.clientHeight;
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 18 / 370;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'em');
            }
            //�뿪��Ļ
            function gearTouchEnd(e) {
            	if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;
                e.preventDefault();
                if(pree) var target = pree.target; else
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if (Math.abs(flag) <= 0.2) {
                    target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                } else {
                    if (Math.abs(flag) <= 0.5) {
                        target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                        target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                    } else {
                        target["spd_" + target.id] = flag / 2;
                    }
                }
                if (!target["pos_" + target.id]) {
                    target["pos_" + target.id] = 0;
                }
                rollGear(target);
                pree=null;
            };
            //�뿪����
            function gearTouchOut(e) {
            	gearTouchEnd(pree);
            };
            //����Ч��
            function rollGear(target) {
                var d = 0;
                var stopGear = false;
                var passY = _self.maxY - _self.minY + 1;
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.1 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {} else {
                        speed = 0.1;
                        var b = Math.round(pos / 2) * 2;
                        if (Math.abs(pos - b) < 0.05) {
                            stopGear = true;
                        } else {
                            if (pos > b) {
                                pos -= speed
                            } else {
                                pos += speed
                            }
                        }
                    }
                    if (pos > 8) {
                        pos = 8;
                        stopGear = true;
                    }
                    switch (target.dataset.datetype) {
                        case "date_yy":
                            var minTop = 8 - (passY - 1) * 2;
                            if (pos < minTop) {
                                pos = minTop;
                                stopGear = true;
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                        case "date_mm":
                            var date_yy = _self.gearDate.querySelector(".date_yy");
                            //�õ���ݵ�ֵ
                            var yyVal = parseInt(date_yy.getAttribute("val"));
                            var maxM = 11;
                            var minM = 0;
                            //����ݵ������ֵ
                            if (yyVal == passY - 1) {
                                maxM = _self.maxM - 1;
                            }
                            //����ݵ�����Сֵ
                            if (yyVal == 0) {
                                minM = _self.minM - 1;
                            }
                            var minTop = 8 - (maxM - minM) * 2;
                            if (pos < minTop) {
                                pos = minTop;
                                stopGear = true;
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2 + minM;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                        case "date_dd":
                            var date_yy = _self.gearDate.querySelector(".date_yy");
                            var date_mm = _self.gearDate.querySelector(".date_mm");
                            //�õ���ݵ�ֵ
                            var yyVal = parseInt(date_yy.getAttribute("val"));
                            //�õ��·ݵ�ֵ
                            var mmVal = parseInt(date_mm.getAttribute("val"));
                            //�����·ݵ�����
                            var maxMonthDays = calcDays(yyVal, mmVal);
                            var maxD = maxMonthDays - 1;
                            var minD = 0;
                            //������·ݵ������ֵ
                            if (yyVal == passY - 1 && _self.maxM == mmVal + 1) {
                                maxD = _self.maxD - 1;
                            }
                            //���ꡢ�µ�����Сֵ
                            if (yyVal == 0 && _self.minM == mmVal + 1) {
                                minD = _self.minD - 1;
                            }
                            var minTop = 8 - (maxD - minD) * 2;
                            if (pos < minTop) {
                                pos = minTop;
                                stopGear = true;
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2 + minD;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                        case "time_hh":
                            if (pos < -38) {
                                pos = -38;
                                stopGear = true;
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                        case "time_mm":
                            if (pos < -110) {
                                pos = -110;
                                stopGear = true;
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                            case "time_ss":
                            if (pos < -110) {
                                pos = -110;
                                stopGear = true;
                            }
                            if (stopGear) {
                                var gearVal = Math.abs(pos - 8) / 2;
                                setGear(target, gearVal);
                                clearInterval(target["int_" + target.id]);
                            }
                            break;
                        default:
                    }
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                    d++;
                }, 30);
            }
            //���Ʋ��������ͣ����ֵ
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
                if (/date/.test(target.dataset.datetype)) {
                    setDateGearTooth();
                } else {
                    setTimeGearTooth();
                }
            }
            //ȡ��
            function closeMobileCalendar(e) {
                e.preventDefault();
                isTouched = isMoved = false;
                if(_self.onClose) _self.onClose();
                var evt = new CustomEvent('input');
                _self.trigger.dispatchEvent(evt);
                document.body.removeChild(_self.gearDate);
            }
            //����ȷ��
            function finishMobileDate(e) {
                var passY = _self.maxY - _self.minY + 1;
                var mount = _self.gearDate.querySelector(".date_yy")
                var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
                var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
                date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
                var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
                date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
                _self.trigger.value = (date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd;
                _self.optyear = (date_yy % passY + _self.minY)
                _self.optMonth = date_mm;
                _self.optDay = date_dd;
                if(_self.format!=''){
                    _self.trigger.value = moment(_self.trigger.value).format(_self.format)
                }
                _self.value = _self.trigger.value;
                if(_self.onSubmit) _self.onSubmit();
                closeMobileCalendar(e);
            }
            //����ȷ��
            function finishMobileYM(e) {
                var passY = _self.maxY - _self.minY + 1;
                var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
                var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
                date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
                _self.trigger.value = (date_yy % passY + _self.minY) + "��" + date_mm + "��" ;
                _self.value = _self.trigger.value;
                if(_self.onSubmit) _self.onSubmit();
                closeMobileCalendar(e);
            }
            //  //��ȷ��
             function finishMobileDD(e) {
                var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
                date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
                _self.trigger.value = date_dd;
                _self.value = _self.trigger.value;
                if(_self.onSubmit) _self.onSubmit();
                closeMobileCalendar(e);
            }
            //    //��ȷ��
               function finishMobileMM(e) {
                var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
                date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
                _self.trigger.value = date_mm;
                _self.value = _self.trigger.value;
                if(_self.onSubmit) _self.onSubmit();
                closeMobileCalendar(e);
            }
               //��ȷ��
               function finishMobileYYYY(e) {
                var passY = _self.maxY - _self.minY + 1;
                var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
                _self.trigger.value = (date_yy % passY + _self.minY);
                _self.value = _self.trigger.value;
                if(_self.onSubmit) _self.onSubmit();
                closeMobileCalendar(e);
            }
            //����ʱ��ȷ��
            function finishMobileDateTime(e) {
                var passY = _self.maxY - _self.minY + 1;
                var date_yy = parseInt(Math.round(_self.gearDate.querySelector(".date_yy").getAttribute("val")));
                var date_mm = parseInt(Math.round(_self.gearDate.querySelector(".date_mm").getAttribute("val"))) + 1;
                date_mm = date_mm > 9 ? date_mm : '0' + date_mm;
                var date_dd = parseInt(Math.round(_self.gearDate.querySelector(".date_dd").getAttribute("val"))) + 1;
                date_dd = date_dd > 9 ? date_dd : '0' + date_dd;
                var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
                time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
                var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
                time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
                var time_ss = parseInt(Math.round(_self.gearDate.querySelector(".time_ss").getAttribute("val")));
                time_ss = time_ss > 9 ? time_ss : '0' + time_ss;
                _self.trigger.value  =  (date_yy % passY + _self.minY) + "-" + date_mm + "-" + date_dd + " " + time_hh + ":" + time_mm + ":" + time_ss;
                _self.optyear = (date_yy % passY + _self.minY)
                _self.optMonth = date_mm;
                _self.optDay = date_dd;
                _self.optHour = time_hh;
                _self.optMinute = time_hh;
                _self.optsecond = time_ss;
                if(_self.format!=''){
                    _self.trigger.value = moment(_self.trigger.value).format(_self.format)
                }
                _self.value =  _self.trigger.value;
                if(_self.onSubmit) _self.onSubmit();
                closeMobileCalendar(e);
            }
            //ʱ��ȷ��
            function finishMobileTime(e) {
                var time_hh = parseInt(Math.round(_self.gearDate.querySelector(".time_hh").getAttribute("val")));
                time_hh = time_hh > 9 ? time_hh : '0' + time_hh;
                var time_mm = parseInt(Math.round(_self.gearDate.querySelector(".time_mm").getAttribute("val")));
                time_mm = time_mm > 9 ? time_mm : '0' + time_mm;
                var time_ss = parseInt(Math.round(_self.gearDate.querySelector(".time_ss").getAttribute("val")));
                time_ss = time_ss > 9 ? time_ss : '0' + time_ss;
                _self.trigger.value =(time_hh.length < 2 ? "0" : "") + time_hh + (time_mm.length < 2 ? ":0" : ":") + time_mm +(time_ss.length < 2 ? ":0" : ":") + time_ss;
                _self.optHour=time_hh;
                _self.optMinute=time_mm;
                _self.optsecond=time_ss;
                if(_self.format!=''){
                    _self.trigger.value = moment(_self.trigger.value).format(_self.format)
                }
                _self.value = _self.trigger.value;
                if(_self.onSubmit) _self.onSubmit();
                closeMobileCalendar(e);
            }
            _self.trigger.addEventListener('click', {
                "yyyy":popupYYYY,
                'mm':popupMM,
                'dd':popupDD,
                "ym": popupYM,
                "date": popupDate,
                "datetime": popupDateTime,
                "time": popupTime
            }[type]);
        }
    }
    return MobileCalendar;
})();
