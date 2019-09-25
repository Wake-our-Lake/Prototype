var captcha_validation = {
    captchaFormNotArobot: 'Please confirm you\'re not a robot'
};
$("#hiddenRecaptcha").rules("add", {
    required: true,
    messages: {
        required: captcha_validation.captchaFormNotArobot
    }
});
function recaptchaCallback() {

    if (grecaptcha.getResponse() == '') {
        $('#hiddenRecaptcha').val("");
    } else {
        $('#hiddenRecaptcha').val(grecaptcha.getResponse());
        var recaptchaServerError = $('.server-validation-error').html();
        if (recaptchaServerError != "undefined") {
            $('.server-validation-error').html('');
        }
        //create account landing page submit enable function after recaptcha validation
        $(".form-create-account").each(function () {
            var valid = $(this).validate().checkForm();
            if (valid) {
                $('.next').prop("disabled", false);
            }
        });
    }
    $('#hiddenRecaptcha').valid();
};

function recaptchaExpiredCallback() {
    $('#hiddenRecaptcha').val("");
};

function validateCaptcha(callback) {
    var captchaElement = $('.g-recaptcha');
    if (captchaElement.length > 0) {
        var recaptchaResponse = grecaptcha.getResponse();
        $.ajax("/api/PseRECaptcha/ValidateCaptcha", {
            type: "POST",
            data: { 'captchaResponse': recaptchaResponse },
            success: function (result) {
                if (result != '' && result.toLowerCase() == 'true') {
                    $(".g-recaptcha").remove();
                    callback();
                } else {
                    var errorDiv = $("#hiddenRecaptcha").parent().next();
                    errorDiv.html("<label id=\"hiddenRecaptcha-error\" class=\"error\" for=\"hiddenRecaptcha\">" + "Server side captcha validation error" + "</label>");
                }
            },
            error: function (jqXHR, status, error) {
                var errorDiv = $("#hiddenRecaptcha").parent().next();
                errorDiv.html("<label id=\"hiddenRecaptcha-error\" class=\"error\" for=\"hiddenRecaptcha\">" + "Server side captcha validation error" + "</label>");
            }
        });
    }
    else {
        callback();
    }
}



function validateCaptchaPaymentSync(callback) {
    var captchaElement = $('.g-recaptcha');
    if (captchaElement.length > 0) {
        var recaptchaResponse = grecaptcha.getResponse();
        $.ajax("/api/PseRECaptcha/ValidateCaptcha", {
            type: "POST",
            async: false,
            data: { 'captchaResponse': recaptchaResponse },
            success: function (result) {
                if (result != '' && result.toLowerCase() == 'true') {
                    $(".g-recaptcha").remove();
                    callback();
                } else {
                    var errorDiv = $("#hiddenRecaptcha").parent().next();
                    errorDiv.html("<label id=\"hiddenRecaptcha-error\" class=\"error\" for=\"hiddenRecaptcha\">" + "Server side captcha validation error" + "</label>");
                }
            },
            error: function (jqXHR, status, error) {
                var errorDiv = $("#hiddenRecaptcha").parent().next();
                errorDiv.html("<label id=\"hiddenRecaptcha-error\" class=\"error\" for=\"hiddenRecaptcha\">" + "Server side captcha validation error" + "</label>");
            }
        });
    }
    else {
        callback();
    }
}

