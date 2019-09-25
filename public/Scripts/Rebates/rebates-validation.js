if (typeof captcha_validation !== "undefined") {
    $("#rebatesEnergyAdvisor").validate({
        ignore: ".ignore",
        rules: {
            "hiddenRecaptcha": {
                required: true
            }
        },
        messages: {
            hiddenRecaptcha: {
                required: captcha_validation.captchaFormNotArobot
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
        }
    });
}
$("#rebatesEnergyEfficiency").rules("add", {
    required: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyEfficiency
    }
});

$("#rebatesEnergyFirstName").rules("add", {
    required: true,
    city: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyFirstName
    }
});

$("#rebatesEnergyMiddleName").rules("add", {
    required: false,
    city: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyFirstName
    }
});

$("#rebatesEnergyLastName").rules("add", {
    required: true,
    city: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyLastName
    }
});

$("#rebatesEnergyAccountNumber").rules("add", {
    number: true,
    minlength: 12,
    maxlength: 12,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyAccountNumber
    }
});

$("#rebatesEnergyMail").rules("add", {
    required: true,
    mail: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyMail
    }
});

$("#rebatesEnergyAddressOne").rules("add", {
    required: true,
    address: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyAddressOne
    }
});

$("#rebatesEnergyAddressTwo").rules("add", {
    required: false,
    address: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyAddressOne
    }
});

$("#rebatesEnergyZipCode").rules("add", {
    required: true,
    zipcode: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyZipCode
    }
});

$("#rebatesEnergyCity").rules("add", {
    required: true,
    city: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyCity
    }
});

$("#rebatesEnergyState").rules("add", {
    required: false,
    city: true,
    messages: {
        required: rebatessEnergyAdvisor.rebatesEnergyState
    }
});

$(".rebates-readmore-btn").click(function () {
    $('.rebates-readmore-less').toggleClass('hide show');
    $(this).toggleClass('fa-plus fa-minus');
});

$(".energy-advisor .trimspace").blur(function () {
    $(this).val($.trim($(this).val()));
});


$("#ask-advisor").click(function (event) {
    //get the validator and validate form explicityly before submit.
    var validator = $("#rebatesEnergyAdvisor");
    validator.validate();
    if (validator.valid()) {
        return true;
    }
    else {
        return false;
    }
});

