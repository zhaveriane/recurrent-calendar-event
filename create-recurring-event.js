/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////

$(function() {
	$('#create-event-button').click(function() {
		if (checkInputs()) {
			var events = createEvent();
			console.log(events);
		}
	});
});

// End time must come after start time
function isValidEndTime() {
	var startTime = $('#event-start-date').val();
	var endTime = $('#event-end-date').val();
    return !(endTime < startTime);
}
function checkInputs() {
	if (!isValidEndTime()) {
		writeEventToScreen('End date must come after start date.');
		return false;
	}

	var frequency = $('#' + $('#recurrent-event-time-selector').val() + '-recurrent-freq').val();
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
	for (i = 0; i < monthIds.length; i++) {
		if ($(monthIds[i]).is(':checked')) {
			months.push(i);
		}
	}

	return months;
}



function createSimpleRecurringEvent(calEvent, endDate, yearInc, monthInc, dayInc) {
	eventsList = [];

	currentEvent = calEvent;
	while (currentEvent.before(endDate)) {
		console.log(currentEvent);
		eventsList.push(currentEvent);
		currentEvent = currentEvent.dupeEvent(yearInc, monthInc, dayInc);
	}

	return eventsList;
}
function createCustomYearlyRecurringEvent(calEvent, endDate, inc, units) {
	eventsList = [calEvent];
	currentEvent = calEvent;
	while (currentEvent.before(endDate)) {
		currentEvent = currentEvent.dupeEvent(0, 0, 1);
		yearOffset = currentEvent.getFullYear() - calEvent.getFullYear()
		if (units.include(currentEvent.getMonth()) && yearOffset%inc == 0) {
			eventsList.push(currentEvent)
		}
	}
	return eventsList;
}
function createCustomMonthlyRecurringEvent(calEvent, endDate, inc, units) {
	eventsList = [calEvent];
	currentEvent = calEvent;
	while (currentEvent.before(endDate)) {
		currentEvent = currentEvent.dupeEvent(0, 0, 1);
		monthOffset = currentEvent.getMonth() + 12*(currentEvent.getFullYear() - calEvent.getFullYear()) - calEvent.getMonth();
		if (units.include(currentEvent.getDate()) && monthOffset%inc == 0) {
			eventsList.push(currentEvent)
		}
	}
	return eventsList;
}
function createCustomWeeklyRecurringEvent(calEvent, endDate, inc, units) {
	eventsList = [calEvent];
	currentEvent = calEvent;
	weekOffset = 0;
	while (currentEvent.before(endDate)) {
		for (i = 0; i < units.length; i++) {
			days = units[i] - calEvent.getDay();
			if (days < 0) {
				days += 7;
			}
			currentEvent = calEvent.dupeEvent(0, 0, days + 7*weekOffset);
			if (currentEvent.before(endDate)) {
				eventsList.push(currentEvent);
			}
		}
		weekOffset += 1;
	}
	return eventsList;
}
function createEvent() {
	var eventName = $('#event-name').val();
	var eventLocation = $('#event-location').val();

	var startTime;
	var endTime;

	var allDayEvent = $('#all-day-event-checkbox').is(':checked');
	if (allDayEvent) {
		var eventTimeInput = $('#all-day-event-date').val();
		var eventTime = new Date(eventTimeInput);
		var year = eventTime.getFullYear();
		var month = eventTime.getMonth();
		var day = eventTime.getDate();
		startTime = eventTime;
		endTime = new Date(year, month, day, 23, 59, 59, 999);
	} else {
		startTimeInput = $('#event-start-date').val();
		startTime = new Date(startTimeInput);
		endTimeInput = $('#event-end-date').val();
		endTime = new Date(endTimeInput);
	}
	var calEvent = new CalendarEvent(eventName, eventLocation, startTime, endTime);

	var repeatOption = $('#recurrent-event-type-selector').val();
	if (repeatOption == 'none') {
		return calEvent;
	}



	var endDateInput = $('#recurrent-event-end-date').val();
	var endDate = new Date(endDateInput);
	var recurringEvents;

	if (repeatOption == 'day') {
		recurringEvents = createSimpleRecurringEvent(calEvent, endDate, 0, 0, 1);
	} else if (repeatOption == 'week') {
		recurringEvents = createSimpleRecurringEvent(calEvent, endDate, 0, 0, 7);
	} else if (repeatOption == 'month') {
		recurringEvents = createSimpleRecurringEvent(calEvent, endDate, 0, 1, 0);
	} else if (repeatOption == 'year') {
		recurringEvents = createSimpleRecurringEvent(calEvent, endDate, 1, 0, 0);
	} else { // handle custom repeat settings
		var frequencyOption = $('#recurrent-event-time-selector').val();

		if (frequencyOption == 'daily') {
			var inc = $('#daily-recurrent-freq').val();
			recurringEvents = createSimpleRecurringEvent(calEvent, endDate, 0, 0, inc);
		} else if (frequencyOption == 'weekly') {
			var inc = $('#weekly-recurrent-freq').val();
			var units = getWeeklyRepeatingDays();
			if (units.length == 0) {
				return calEvent;
			}
			recurringEvents = createCustomWeeklyRecurringEvent(calEvent, endDate, inc, units);
		} else if (frequencyOption == 'monthly') {
			var inc = $('#monthly-recurrent-freq').val();
			var units = getMonthlyRepeatingDays();
			if (units.length == 0) {
				return calEvent;
			}
			recurringEvents = createCustomMontlyRecurringEvent(calEvent, endDate, inc, units);
		} else { // yearly
			var inc = $('#yearly-recurrent-freq').val();
			var units = getYearlyRepeatingMonths();
			if (units.length == 0) {
				return calEvent;
			}
			recurringEvents = createCustomYearlyRecurringEvent(calEvent, endDate, inc, units);
		}
	}

	return new RecurrentCalendarEvent(recurringEvents);
}

function writeEventToScreen(eventString) {
	$('#new-event-text').text(eventString);
}