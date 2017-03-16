// For simplicity this calendar has no backend.
// An event is created as an Event object with customizable parameters.

/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////

$(function() {
	$('#create-event-button').click(function() {
		if (checkInputs()) {
			var evt = createEvent();
			console.log("Event created:\n" + evt);
		}
	});
});



function getWeeklyRepeatingDays() {
	var days = [];

	var weekdayIds = ['#weekday-sun', '#weekday-mon', '#weekday-tue', '#weekday-wed', '#weekday-thu', '#weekday-fri', 
		'#weekday-sat'];
	var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	for (i = 0; i < weekdayIds.length; i++) {
		if ($(weekdayIds[i]).is(':checked')) {
			days.push(weekdays[i]);
		}
	}

	return days;
}
function getMonthlyRepeatingDays() {
	var days = [];

	var monthdayIds = ['#month-1', '#month-2', '#month-3', '#month-4', '#month-5', '#month-6', '#month-7', '#month-8',
		'#month-9', '#month-10', '#month-11', '#month-12', '#month-13', '#month-14', '#month-15', '#month-16',
		'#month-17', '#month-18', '#month-19', '#month-20', '#month-21', '#month-22', '#month-23', '#month-24',
		'#month-25', '#month-26', '#month-27', '#month-28', '#month-29', '#month-30', '#month-31'];
	for (i = 0; i < monthdayIds.length; i++) {
		if ($(monthdayIds[i]).is(':checked')) {
			days.push(i+1);
		}
	}

	return days;
}
function getYearlyRepeatingMonths() {
	var months = [];

	var monthIds = ['#year-jan', '#year-feb', '#year-mar', '#year-apr', '#year-may', '#year-jun', '#year-jul', 
		'#year-aug', '#year-sept', '#year-oct', '#year-nov', '#year-dec'];
	var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	for (i = 0; i < monthIds.length; i++) {
		if ($(monthIds[i]).is(':checked')) {
			months.push(monthNames[i]);
		}
	}

	return months;
}



function createEvent() {
	var eventName = $('#event-name').val();
	var eventLocation = $('#event-location').val();

	var startTime;
	var endTime;

	var allDayEvent = $('#all-day-event-checkbox').is(':checked');
	if (allDayEvent) {
		startTime = $('#all-day-event-date').datetimepicker('getValue');
		var year = startTime.getFullYear();
		var month = startTime.getMonth();
		var day = startTime.getDate();
		endTime = new Date(year, month, day, 23, 59, 59, 999);
	} else {
		startTime = $('#event-start-date').datetimepicker('getValue');
		endTime = $('#event-end-date').datetimepicker('getValue');
	}
	var evt = new CalendarEvent(eventName, eventLocation, startTime, endTime);

	var repeatOption = $('#recurrent-event-type-selector').val();
	if (repeatOption == 'none') {
		return evt;
	}



	evt.repeatEvery = 1;
	evt.repeatOption = repeatOption;
	var endDate = $('#recurrent-event-end-date').datetimepicker('getValue');
	evt.endRepeat = endDate;



	if (repeatOption == 'custom') {
		repeatOption = $('#recurrent-event-time-selector').val();
		var repeatEvery;
		var repeatOn;

		if (repeatOption == 'day') {
			repeatEvery = $('#dayly-recurrent-freq').val();
		} else if (repeatOption == 'week') {
			repeatEvery = $('#weekly-recurrent-freq').val();
			repeatOn = getWeeklyRepeatingDays();
			if (repeatOn.length == 0) {
				return evt;
			}
		} else if (repeatOption == 'month') {
			repeatEvery = $('#monthly-recurrent-freq').val();
			repeatOn = getMonthlyRepeatingDays();
			if (repeatOn.length == 0) {
				return evt;
			}
		} else { // year
			repeatEvery = $('#yearly-recurrent-freq').val();
			repeatOn = getYearlyRepeatingMonths();
			if (repeatOn.length == 0) {
				return evt;
			}
		}

		evt.repeatOption = repeatOption;
		evt.repeatEvery = repeatEvery;
		evt.repeatOn = repeatOn;
	}

	return evt;
}