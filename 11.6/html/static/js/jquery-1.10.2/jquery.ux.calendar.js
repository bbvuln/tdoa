(function($) {

	var now = new Date();
	var thisMonth = now.getMonth();
	var thisYear = now.getFullYear();
	// jQuery plugin initialisation
	$.fn.calendarWidget = function(params) {
		this.data('calendarWidget', new CalendarWidget(this, params));
		return this;
	};

	$.fn.calendarWidget.defaultOptions = {
		month: thisMonth,
		year: thisYear,
		maxYear: parseInt(thisYear + 2),
		minYear: parseInt(thisYear - 2),
		clickCallback: $.noop,
        onclick: $.noop,
		initCallback: $.noop,
		monthNames: '1 2 3 4 5 6 7 8 9 10 11 12'.split(' '),
		dayNames:  ['日', '一', '二', '三', '四', '五', '六'],
		prev_handle: '<em class="prev_month"><b></b></em>',
		next_handle: '<em class="next_month"><b></b></em>'
	};

	function CalendarWidget(el, params) {
		this.el = el;
		var me = this;
		var opts = this.options = $.extend($.fn.calendarWidget.defaultOptions, params);
		
        this.render();

		el.delegate('td.current-month', 'click.calendarWidget', function(e){
			if(false === opts.onclick.call(this, me, e)){
				return false;
			}
			$('td.current-month', el).removeClass('active');
			$(this).addClass('active');
            opts.clickCallback.call(this, me, e)
		});

		opts.initCallback.apply(this, arguments);

	}

	CalendarWidget.prototype = {
		constructor: CalendarWidget,		
        render: function(){
            var el = this.el;
            var me = this;
            var opts = this.options;
            var monthNames = opts.monthNames;
            var dayNames = opts.dayNames;
            var month = this.month = i = parseInt(opts.month);
            var year = this.year = parseInt(opts.year);
            var m = 0;
            var table = '';
        
            table += ('<h3 id="current-month" class="calendar-title"><i class="year">' + year + '</i>年<i class="month">' + monthNames[month] + '</i>月</h3>');

            table += ('<table class="calendar-month " ' + 'id="calendar-month' + i + ' " cellspacing="0">');

            table += '<tr>';

            for (d = 0; d < 7; d++) {
                table += '<th class="weekday">' + dayNames[d] + '</th>';
            }

            table += '</tr>';

            var days = getDaysInMonth(month, year);
            var firstDayDate = new Date(year, month, 1);
            var firstDay = firstDayDate.getDay();

            var prev_days = getDaysInMonth(month, year);
            var firstDayDate = new Date(year, month, 1);
            var firstDay = firstDayDate.getDay();

            var prev_m = month == 0 ? 11 : month - 1;
            var prev_y = prev_m == 11 ? year - 1 : year;
            var prev_days = getDaysInMonth(prev_m, prev_y);
            firstDay = (firstDay == 0 && firstDayDate) ? 7 : firstDay;

            var i = 0;
            for (j = 0; j < 42; j++) {

                if ((j < firstDay)) {
                    table += ('<td class="other-month"><span class="day">' + (prev_days - firstDay + j + 1) + '</span></td>');
                } else if ((j >= firstDay + getDaysInMonth(month, year))) {
                    i = i + 1;
                    table += ('<td class="other-month"><span class="day">' + i + '</span></td>');
                } else {
                    table += ('<td data-day="' + (j - firstDay + 1) + '" class="current-month day' + (j - firstDay + 1) + '"><span class="day">' + (j - firstDay + 1) + '</span></td>');
                }
                if (j % 7 == 6) table += ('</tr>');
            }

            table += ('</table>');

            var $table = $(table);

            el.html($table);

            if(opts.prev_handle && opts.next_handle){
                var $title = $('h3.calendar-title', el);
                if( opts.minYear && !( opts.minYear == year && month == 0 ) ){
                    $(opts.prev_handle).prependTo( $title ).click( $.proxy(this.prevMonth, this) );
                }
                if( opts.maxYear && !( opts.maxYear == year && month == 11 ) ){
                    $(opts.next_handle).appendTo( $title ).click( $.proxy(this.nextMonth, this) );
                }
            }
            
            opts.renderCallback && opts.renderCallback.call(this);
        },           
        prevMonth: function(){
			var settings = this.options;
			var month = this.month;
			if(month == 0){
				this.year--;
				month = 11;
			}else{
				month--;
			}
			this.month = month;

			settings.month = month;
			settings.year = this.year;			
			this.render();
		},          
		nextMonth: function(){
			var settings = this.options;
			var month = this.month;
			if(month == 11){
				this.year++;
				month = 0;
			}else{
				month++;
			}
			this.month = month;

			settings.month = month;
			settings.year = this.year;
			this.render();
		},
        getActive: function(){
            return this.el.find('.active').attr('data-day');
        },
        setActive: function(d){
            var el = this.el;
            el.find('td.current-month').removeClass('active');
            el.find('[data-day=' + d + ']').addClass('active');
        },
        clearActive: function(){            
            this.el.find('td').removeClass('active');
        },
		today: function(){
			var settings = this.options;
			
			if(settings.month !== thisMonth || settings.year !== thisYear){
				settings.month = thisMonth;
				settings.year = thisYear;
                this.render();
			}
			var selector = '.day' + now.getDate();
			$(selector, this.el).click();
		}
	};




	function getDaysInMonth(month, year) {
		var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		if ((month == 1) && (year % 4 == 0) && ((year % 100 != 0) || (year % 400 == 0))) {
			return 29;
		} else {
			return daysInMonth[month];
		}
	}

})(jQuery);