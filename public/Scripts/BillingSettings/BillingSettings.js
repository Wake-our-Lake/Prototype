$('#btnRequestChange').click(function (e) {
    var url = window.location.href;
    e.preventDefault();
    var validator = $("#preferenceBillingDateRange");
    validator.validate();
    if (validator.valid()) {
        var selectedDropValue = $('#preferenceBillingDateRange').val();
        $.ajax({
            type: "POST",
            data: { 'selectedDateRange': selectedDropValue },
            url: "/api/BillingSettings/ChangeDueDateRequest",
            success: function (result, status, xhr) {
                if (result) {
                    var checkDateChanged = new RegExp("/ChangeDueDateConfirmed/");
                    if (!checkDateChanged.test(url)) {
                        url = url + "?ChangeDueDateConfirmed=true";
                    }
                    window.location.replace(url);
                }
            },
        });
    }
});

$(document).ready(function () {
    if (document.forms.frmAgentSSO != undefined) {
        document.forms.frmAgentSSO.submit();
    }
});

