/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////

$(function() {
	$('#create-event-button').click(function() {
		if (checkInputs()) {
			// writeEventToScreen(getEventText());
			createEvent();
		}
	});
});

// End time must come after start time
function isValidEndTime() {
	var startTime = $('#event-start-time').val();
	var endTime = $('#event-end-time').val();
    return !(endTime < startTime);
}
function checkInputs() {
	if (!isValidEndTime()) {
		writeEventToScreen('End date must come after start date.');
		return false;
	}

	var frequency = $('#' + $('#recurrent-event-time-selector').val() + '-recurrent-freq').val();
	console.log(frequency);
	if (!$.isNumeric(frequency)) {
		writeEventToScreen('Frequency must be a numeric value.');
		return false;
	}

	return true;
}



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
	var monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	for (i = 0; i < monthIds.length; i++) {
		if ($(monthIds[i]).is(':checked')) {
			months.push(monthsNames[i]);
		}
	}

	return months;
}



function createEvent() {
	var eventName = $('#event-name').val();
	var eventLocation = $('#event-location').val();

	var allDayEvent = $('#all-day-event-checkbox').is(':checked');
	if (allDayEvent) {
		var eventTime = $('#all-day-event-date').val();
		var year = eventTime.getFullYear();
		var month = eventTime.getMonth();
		var day = eventTime.getDate();
		var startTime = Date(year, month, day, 0, 0, 0, 0);
		var endTime = Date(year, month, day, 23, 59, 59, 999);
	} else {
		var startTime = $('#event-start-time').val();
		var endTime = $('#event-end-time').val();
	}

	var repeatOption = $('#recurrent-event-type-selector').val();
	if (repeatOption == 'none') {
		return Event(eventName, eventLocation, startTime, endTime);
	}

	var endDate = $('#recurrent-event-end-date').val();
	var eventsList = [Event(eventName, eventLocation, startTime, endTime)];
	if (repeatOption == 'day') {
	} else if (repeatOption == 'week') {
	} else if (repeatOption == 'month') {
	} else if (repeatOption == 'year') {
	} else { // custom
		var frequencyOption = $('#recurrent-event-time-selector').val();
		var frequency = 1;
		var repeatingUnits = [];
		if (frequencyOption == 'daily') {
			frequency = $('#daily-recurrent-freq').val();
		} else if (frequencyOption == 'weekly') {
			frequency = $('#weekly-recurrent-freq').val();
			repeatingUnits = getWeeklyRepeatingDays();
		} else if (frequencyOption == 'monthly') {
			frequency = $('#monthly-recurrent-freq').val();
			repeatingUnits = getMonthlyRepeatingDays();
		} else { // yearly
			frequency = $('#yearly-recurrent-freq').val();
			repeatingUnits = getYearlyRepeatingMonths();
		}
	}
}

function writeEventToScreen(eventString) {
	$('#new-event-text').text(eventString);
}