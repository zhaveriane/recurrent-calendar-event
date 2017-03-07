$(function() {
    $(function() {
        $("#event-name").focus();
    });

    $('#all-day-event-checkbox').change(function() {
        if (this.checked) {
            showAllDayEventOptions();
        } else {
            hideAllDayEventOptions();
        }
    });

    $('#recurrent-event-type-selector').change(function() {
        var val = $("#recurrent-event-type-selector option:selected").val();
        hideRecurrentEventOptions();
        hideRecurrentEventDetails();
        
        if (val == "custom") {
            showRecurrentEventOptions();
        } else {
            resetAllRecurrentEventDetails();
        }

        if (val == ("none")) {
            hideRecurrentEventEndDetails();
        } else {
            showRecurrentEventEndDetails();
        }
    });

    $('#recurrent-event-time-selector').change(function() {
        var val = $("#recurrent-event-time-selector option:selected").val();
        hideRecurrentEventDetails();

        if (val == "daily") {
            $('#daily-recurrent-details').removeClass("hidden");
        } else if (val == "weekly") {
            $('#weekly-recurrent-details').removeClass("hidden");
        } else if (val == "monthly") {
            $('#monthly-recurrent-details').removeClass("hidden");
        } else if (val == "yearly") {
            $('#yearly-recurrent-details').removeClass("hidden");
        }
    });

    $('input[type=text]').focus(function() { 
        $(this).select(); 
    });
});

// Functions to reset recurrent event interface
function hideRecurrentEventDetails() {
    $('#daily-recurrent-details').addClass("hidden");
    $('#weekly-recurrent-details').addClass("hidden");
    $('#monthly-recurrent-details').addClass("hidden");
    $('#yearly-recurrent-details').addClass("hidden");
}
function hideRecurrentEventOptions() {
    $('#recurrent-event-details-line').addClass("hidden");
    $('#recurrent-event-details').addClass("hidden");
}
function showRecurrentEventOptions() {
    $('#recurrent-event-details-line').removeClass("hidden");
    $('#recurrent-event-details').removeClass("hidden");
    $('#daily-recurrent-details').removeClass("hidden");
}
function resetAllRecurrentEventDetails() {
    $('#recurrent-event-time-selector').val('daily');
    $('.weekday-checkbox').prop('checked', false);
    $('.day-checkbox').prop('checked', false);
    $('.month-checkbox').prop('checked', false);
}
function showAllDayEventOptions() {
    $('#start-time-row').addClass("hidden");
    $('#end-time-row').addClass("hidden");
    $('#all-day-event-row').removeClass("hidden");
}
function hideAllDayEventOptions() {
    $('#all-day-event-row').addClass("hidden");
    $('#start-time-row').removeClass("hidden");
    $('#end-time-row').removeClass("hidden");
    $('#all-day-event-date').val('');
}
function showRecurrentEventEndDetails() {
    $('#recurrent-event-end-date-row').removeClass("hidden");
}
function hideRecurrentEventEndDetails() {
    $('#recurrent-event-end-date-row').addClass("hidden");
    $('#recurrent-event-end-date').val('');
}