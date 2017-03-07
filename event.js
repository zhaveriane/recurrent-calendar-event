/**
 * Event Object
 * args start and end time are Javascript Date objects
 * All day events have the same start and end time.
 */

var Event = function(name, loc, startTime, endTime) {
	Object.defineProperty(this, 'name', {value: name, writable: false});
	Object.defineProperty(this, 'loc', {value: loc, writable: false});
	Object.defineProperty(this, 'startTime', {value: startTime, writable: false});
	Object.defineProperty(this, 'endTime', {value: endTime, writable: false});

	this.toString = function() {
		var eventString = name + " at " + loc + ": " + startTime.toString() + "-" + endTime.toString();
		return eventString;
	}
};