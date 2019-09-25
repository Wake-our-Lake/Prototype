$("#Confirmenrollsubmit").click(function () {
    var path = window.location.href;
    $.ajax({
        url: "/api/BudgetBilling/EnrollConfirm",
        type: "POST",
        data: { 'urlpath': path },
        success: function (data) {
            if (data != undefined && data != "")
                if (data.url != undefined || data.url != "")
                    window.location.href = data.url;
        },
        error: function (data) {
            console.log("error in enroll", data.url);
        }
    });
});

$("#ConfirmUnEnrollsubmit").click(function () {
    var path = window.location.href;
    $.ajax({
        url: "/api/BudgetBilling/UNEnrollConfirm",
        type: "POST",
        data: { 'urlpath': path },
        success: function (data) {
            if (data != undefined || data != "")
                if (data.url != undefined && data.url != "")
                    window.location.href = data.url;
        },
        error: function (data) {
            console.log("error in UnEnroll", data.url);
        }
    });
});