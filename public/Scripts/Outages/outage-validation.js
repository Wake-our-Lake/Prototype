/*uncomment below code if the data comes in US Phone number format */

jQuery.validator.addMethod("phoneUSA", function (phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(\+?1-?)?(\([0-9]\d{2}\)|[0-9]\d{2})-?[0-9]\d{2}-?\d{4}$/);
}, "Please specify a valid phone number");

$("#outageLoggedinVerifiedPhone, #streetUserPhoneNumber,#outageVerifiedAddressPhone,#outageVerifiedAddressMobile").inputmask("(999) 999-9999");

if (typeof captcha_validation !== "undefined") {
    $("#reportElectricOutage").validate({
        ignore: [],
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
/*Report Electric Outage Fields*/

$("#reportElectricOutageFirstAddress").rules("add", {
    required: true,
    address: true,
    messages: {
        required: Addressvalidation.reportaddressfirstname
    }
});
$("#secondAddress").rules("add", {
    address: true,
    messages: {
        required: Addressvalidation.reportaddressfirstname
    }
});
$("#reportElectricOutageReportCity").rules("add", {
    required: true,
    city: true,
    messages: {
        required: Addressvalidation.reportCity
    }
});
$("#reportElectricOutageZipCode").rules("add", {
    required: true,
    zipcode: true,
    messages: {
        required: Addressvalidation.zipCode
    }
});

$("#reportElectricOutageHiddenRecaptcha").rules("add", {
    required: true,
    messages: {
        required: Addressvalidation.reportaddressnotarobot
    }
});

/*Report Electric Outage Different Address Fields*/

$("#reportElectricOutageDifferent").validate({
    errorPlacement: function (error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

$("#reportElectricOutageDifferentFirstAddress").rules("add", {
    required: true,
    address: true,
    messages: {
        required: Addressvalidation.reportaddressfirstname
    }
});
$("#secondAddress").rules("add", {
    address: true,
    messages: {
        required: Addressvalidation.reportaddressfirstname
    }
});
$("#reportElectricOutageDifferentreportCity").rules("add", {
    required: true,
    city: true,
    messages: {
        required: Addressvalidation.reportCity
    }
});
$("#reportElectricOutageDifferentzipCode").rules("add", {
    required: true,
    zipcode: true,
    messages: {
        required: Addressvalidation.zipCode
    }
});

/*Report Electric Outage Close Address Fields*/

$('#outageCloseAddressForm').validate({
    rules: {
        closeAddress: {
            required: true,
            address: true,
        }
    },
    messages: {
        closeAddress: {
            required: nearbyaddressvalidation.closeaddressvalidation
        }
    },
    errorPlacement: function (error, element) {
        error.appendTo(element.parents().next('.errorMessage'));
    }
});

/*Report Electric Outage Verified Address Fields*/

$('#outageVerifiedAddress').validate({
    errorPlacement: function (error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

$("#outageVerifiedAddressPhone").rules("add", {
    required: true,
    phoneUSA: true,
    messages: {
        required: verifyAddressvalidation.verifiedaddressphone
    }
});
$("#outageVerifiedAddressMobile").rules("add", {
    phoneUSA: true,
    messages: {
        required: verifyAddressvalidation.verifiedaddressphone
    }
});
$("#outageVerifiedAddressEmail").rules("add", {
    mail: true,
    messages: {
        required: verifyAddressvalidation.verifiedaddressemail
    }
});

if ($('#outageVerifiedAddressPhone').val() == '') {
    $('#verifySamePhoneno').prop('disabled', true);
} else {
    $('#verifySamePhoneno').prop('disabled', false);
}
$('#outageVerifiedAddressPhone').on('change', function () {
    if ($('#outageVerifiedAddressPhone').hasClass('valid')) {
        $('#verifySamePhoneno').prop('disabled', false);
    } else {
        $('#outageVerifiedAddressMobile').val('');
        $('#verifySamePhoneno').prop('checked', false);
        $('#verifySamePhoneno').prop('disabled', true);
    }
});
$('#verifySamePhoneno').change(function (e) {
    var verifymobilenumber = $('#outageVerifiedAddressMobile');
    if ($('#outageVerifiedAddressPhone').hasClass('valid')) {
        var contact = $('#outageVerifiedAddressPhone').val();
        if (e.target.checked) {
            $(verifymobilenumber).focus().val(contact).blur();
        }
    } else {
        $(verifymobilenumber).focus().val("").blur();
    }
});
$('input[name=CallBackNumber]').keyup(function () {
    $('#verifySamePhoneno').prop('disabled', false);
})


/*Report Electric Outage Loggedin Fields*/

$('#outageReportLoggedinLocation').validate({
    errorPlacement: function (error, element) {
        error.appendTo(element.parents().next('.errorMessage'));
    }
});

$("#outageLoggedinVerifiedPhone").rules("add", {
    required: true,
    phoneUSA: true,
    messages: {
        required: Outageloggedinvalidation.loggedinverifiedphoneno
    }
});

/*Street light Fields*/
if (typeof captcha_validation !== "undefined") {
    $("#outageStreetLight").validate({
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

$("#streetFirstName").rules("add", {
    required: true,
    city: true,
    messages: {
        required: Streetlightvalidation.streetFirstName
    }
});
$("#streetMiddleName").rules("add", {
    address: true,
    messages: {
        required: Streetlightvalidation.streetLastName
    }
});
$("#streetLastName").rules("add", {
    required: true,
    city: true,
    messages: {
        required: Streetlightvalidation.streetLastName
    }
});
$("#streetUserMail").rules("add", {
    required: true,
    mail: true,
    messages: {
        required: Streetlightvalidation.streetUserMail
    }
});
$("#streetUserPhoneNumber").rules("add", {
    required: true,
    phoneUSA: true,
    messages: {
        required: Streetlightvalidation.streetMobUserNumber1
    }
});

$("#streetLightClosestAddress").rules("add", {
    required: true,
    address: true,
    messages: {
        required: Streetlightvalidation.streetLightClosestAddress
    }
});

$("#streetLightZipCode").rules("add", {
    required: true,
    zipcode: true,
    messages: {
        required: Streetlightvalidation.lightZipCode
    }
});

$("#streetLightCity").rules("add", {
    required: true,
    city: true,
    messages: {
        required: Streetlightvalidation.streetLightCity
    }
});

$("#streetlightLocationDescription").rules("add", {
    required: true,
    messages: {
        required: Streetlightvalidation.lightAdditionalComments
    }
});

$("#streetlightProblemDescription").rules("add", {
    required: true,
    messages: {
        required: Streetlightvalidation.StreetproblemDescription
    }
});

$("#streetLightPoleNumber").rules("add", {
    address: true,
    messages: {
        required: Streetlightvalidation.StreetproblemDescription
    }
});

$("#streetlightAdditionalComments").rules("add", {
    messages: {
        required: Streetlightvalidation.lightAdditionalComments
    }
});

$('[data-loggedin-input]').each(function () {
    $('input[type=radio]:first', this).attr('checked', true);
    $('input[type=checkbox]:first', this).attr('checked', true);
});

$('input[name="CustomerContactNumber"]').on('change', function () {
    if ($(this).hasClass('other-phoneno')) {
        $('.loggedin-number').removeClass('hide');
    } else {
        $('.loggedin-number').addClass('hide');
    }
});

if ($('.outages-report-loggedin .other-phoneno').is(':checked')) {
    $('.loggedin-number').removeClass('hide');
} else {
    $('.loggedin-number').addClass('hide');
}

$(".outage-forms .trimspace").blur(function () {
    $(this).val($.trim($(this).val()));
});

//reCaptcha validation
/* Streetlight Outage */
$("#submit-streetlight").click(function (event) {
    //get the validator and validate form explicityly before submit.
    var validator = $("#outageStreetLight");
    validator.validate();
    if (validator.valid()) {
        return true;
    }
    else {
        return false;
    }
});

/* Electric Outage Address */
$("#Addressnavigation").click(function (event) {
    //get the validator and validate form explicityly before submit.
    var validator = $("#reportElectricOutage");
    validator.validate();
    if (validator.valid()) {
        return true;
    }
    else {
        return false;
    }
});
