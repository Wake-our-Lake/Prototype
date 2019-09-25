var selectedTopic;
var selectedSubTopicGuid;

var GetDefaultCustomerDetails = function () {
    $.ajax({
        url: '/api/CustomerFeedback/GetCustomerProfile',
        type: "GET",
        datatype: "json",
        contenttype: 'application/json; charset=utf-8',
        context: this,
        success: function (data) {
            if (data == null)
                return;
            if (data != '' && data.customerName != '') {
                $('.g-recaptcha').remove();
                attachValidationRecaptcha();
                PopulateCustomerData(data);
                AlignFormFieldValues();
            }
        },
        error: function (xhr) {
            console.log('Login not successful - error');
        }
    });
}

$(document).ready(function () {
    GetDefaultCustomerDetails();

    jQuery.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^[a-z\d\-_\s]+$/i.test($.trim(value));
    }, "Please provide valid details");

    $(".data-usphone-number").mask("(999) 999-9999");

    $(".data-usphone-number").on("blur", function () {
        var last = $(this).val().substr($(this).val().indexOf("-") + 1);

        if (last.length == 5) {
            var move = $(this).val().substr($(this).val().indexOf("-") + 1, 1);

            var lastfour = last.substr(1, 4);

            var first = $(this).val().substr(0, 9);

            $(this).val(first + move + '-' + lastfour);
        }
    });

    $(".data-account-number").mask("999999999999");

    jQuery.validator.addMethod("zipcode", function (value, element) {
        return this.optional(element) || /^\d{5}(?:-\d{4})?$/.test(value);
    }, "Please provide a valid zipcode");

    jQuery.validator.addMethod("numbersonly", function (value, element) {
        return this.optional(element) || /^\d+([.,]\d{1,2})?$/.test(value);
    }, "Please provide a valid number");

    $.validator.addMethod(
        'mail',
        function (value, element) {
            return this.optional(element) || /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i.test(value);
        }, "Please provide a valid email address"

    );
});

var GetFaqsForSelectedSubTopic = function () {
    $.ajax({
        url: '/api/CustomerFeedback/GetFaqsForSelectedSubTopic',
        type: "GET",
        datatype: "json",
        contenttype: 'application/json; charset=utf-8',
        data: { 'selectedSubTopicGuid': selectedSubTopicGuid },
        context: this,
        async: false,
        success: function (data) {
            if (data.FaqsLinks != '' || data.RelatedFaqs.length > 0) {
                $("#faq-title-section, #faq-section, #sendus-contact-content-title, .sendus-contact-content, .recaptcha-submit-btn").show();
                $('#faq-links').append(data.FaqsLinks);
                if (data.RelatedFaqs != 'undefined' && data.RelatedFaqs.length > 0) {
                    for (i = 0; i < data.RelatedFaqs.length; i++) {
                        $('#feedback-faq').append('<p class="collapsed" data-toggle="collapse" data-target="#' + i + '" id="faq-question">' + data.RelatedFaqs[i].Question + '</p><div class="collapse" id="' + i + '"><p>' + data.RelatedFaqs[i].Answer + '</p></div>');
                    }
                }
                else {
                    $("#relatedFaqTitle").hide();
                }
            }
            else if (data.FaqsLinks == '' && data.RelatedFaqs.length == 0) {
                $('#faq-title-section').hide();
                $('#faq-section').hide();
                $("#sendus-contact-content-title, .sendus-contact-content, .recaptcha-submit-btn").show();
            }
            AddConditionalBlock();
        },
        error: function (xhr) {
            console.log('Get Faqs For Selected Sub Topic - error');
        }
    });
}

var AddConditionalBlock = function () {
    //Adds validation for the form
    attachValidation();

    //Adds Conditional block div based on Topic selection	
    var selectedTopic = $("#topicDropDown :selected").text();

    if (selectedTopic.toLowerCase() == "Payment".toLowerCase()) {
        $(".conditional-leasing").hide();
        $("#gasWaterHeater").hide();
        $("#gasConversionBurner").hide();
        $(".conditional-reportascam").hide();
        $("#otherMainDiv").hide();

        var $dtPayments = $(".conditional-payments");
        var $dmPayments = $("#conditionalFields");
        $dmPayments.append($dtPayments);
        $dtPayments.show();
        $dtPayments.css('display', 'block');
        $("#conditionalFieldsTitle").css('display', 'block');
        attachValidationPaymentConditionalBlock();
    }
    else if (selectedTopic.toLowerCase() == "Leasing".toLowerCase()) {
        $(".conditional-payments").hide();
        $(".conditional-reportascam").hide();
        $("#otherMainDiv").hide();
        $("#gasWaterHeater").hide();
        $("#gasConversionBurner").hide();

        var $dtLeasing = $(".conditional-leasing");
        var $dmLeasing = $("#conditionalFields");
        $dmLeasing.append($dtLeasing);
        $dtLeasing.show();
        $dtLeasing.css('display', 'block');
        $("#conditionalFieldsTitle").css('display', 'block');
        attachValidationLeasingConditionalBlock();
    }
    else if (selectedTopic.toLowerCase() == "Report a scam".toLowerCase()) {
        $(".conditional-payments").hide();
        $(".conditional-leasing").hide();
        $("#gasWaterHeater").hide();
        $("#gasConversionBurner").hide();
        $("#otherMainDiv").hide();

        var $dtReportScam = $(".conditional-reportascam");
        var $dmReportScam = $("#conditionalFields");
        $dmReportScam.append($dtReportScam);
        $dtReportScam.show();
        $dtReportScam.css('display', 'block');
        $("#conditionalFieldsTitle").css('display', 'block');
        attachValidationReportScamConditionalBlock();
    }
    else if (selectedTopic.toLowerCase() == "Other".toLowerCase()) {
        $(".conditional-payments").hide();
        $(".conditional-leasing").hide();
        $("#gasWaterHeater").hide();
        $("#gasConversionBurner").hide();
        $(".conditional-reportascam").hide();

        var $dtOther = $("#otherMainDiv");
        var $dmOther = $("#conditionalFields");
        $dmOther.append($dtOther);
        $dtOther.show();
        $dtOther.css('display', 'block');
        $("#conditionalFieldsTitle").css('display', 'block');
        attachValidationOtherConditionalBlock();
    }
    else if (selectedTopic.toLowerCase() == "Billing".toLowerCase()) {
        $(".conditional-payments").hide();
        $(".conditional-leasing").hide();
        $("#gasWaterHeater").hide();
        $("#gasConversionBurner").hide();
        $(".conditional-reportascam").hide();
        $("#otherMainDiv").hide();
        $("#conditionalFieldsTitle").css('display', 'none');
    }
    else {
        $(".conditional-payments").hide();
        $(".conditional-leasing").hide();
        $("#gasWaterHeater").hide();
        $("#gasConversionBurner").hide();
        $(".conditional-reportascam").hide();
        $("#otherMainDiv").hide();
        $("#conditionalFieldsTitle").css('display', 'none');

    }
    if (($(".option-textholder").html() === "Billing") || ($(".option-textholder").html() === "myPSE Online Account") || ($(".option-textholder").html() === "Payment Arrangements")) {
        $("#conditionalFields").next().hide();
    }
    else {
        $("#conditionalFields").next().show();
    }

}

//Add rules for conditional payment
function attachValidationPaymentConditionalBlock() {
    var now = new Date()
    var startDate = new Date('2013-04-01');
    nextYr = now.getFullYear() + 1;
    oneYearLater = new Date();
    oneYearLater.setFullYear(nextYr);

    $('#paymentDate').datepicker({
        autoclose: true,
        startDate: startDate,
        endDate: oneYearLater

    });

    $('#paymentAmount').rules("add", {
        numbersonly: true,
        messages: {
            number: "Please specify a valid amount"
        }
    });
}

//Add rules for conditional Leasing
function attachValidationLeasingConditionalBlock() {
    $("input[name='ownerOption']").rules("add", {
        required: true,
        messages: {
            required: "This field is required",
        }
    });
    $("input[name='leasedOption']").rules("add", {
        required: true,
        messages: {
            required: "This field is required",
        }
    });
}

//Add rules for Conditional Report a scam
function attachValidationReportScamConditionalBlock() {
    $("#selectScamPaymentMode").parent(".select-wrapper").removeClass("is-selected");

    var now = new Date();
    $('#incidentDate').datepicker({
        autoclose: true,
        startDate: "-30d",
        endDate: now

    });

    $("input[name='permissionOption']").rules("add", {
        required: true,
        messages: {
            required: "This field is required",
        }
    });
    $("input[name='callerRequestOption']").rules("add", {
        required: true,
        messages: {
            required: "This field is required",
        }
    });
    $("input[name='enforcementOption']").rules("add", {
        required: true,
        messages: {
            required: "This field is required",
        }
    });
    $('#scamAmountPaid').rules("add", {
        numbersonly: true,
        messages: {
            number: "Please specify a valid amount",
        }
    });
}

//Add rules for Conditional Other
function attachValidationOtherConditionalBlock() {
    var now = new Date()
    previousYr = now.getFullYear() - 1;
    oneYearBefore = new Date();
    oneYearBefore.setFullYear(previousYr);

    $('#payFromDate').datepicker({
        autoclose: true,
        startDate: oneYearBefore,
        endDate: now
    });

    $("input[name='testamentaryOption']").rules("add", {
        required: true,
        messages: {
            required: "This field is required",
        }
    });
    $("input[name='noticePSE']").rules("add", {
        required: true,
        messages: {
            required: "This field is required",
        }
    });
    $("input[name='OutageReportedTitle']").rules("add", {
        required: true,
        messages: {
            number: "This field is required",
        }
    });
    $('#outageStreetAddress').rules("add", {
        alphanumeric: true,
        messages: {
            alphanumeric: "Please provide valid details"
        }
    });
    $('#outageStreetAddress1').rules("add", {
        alphanumeric: true,
        messages: {
            alphanumeric: "Please provide valid details"
        }
    });
    $('#outageCity').rules("add", {
        alphanumeric: true,
        messages: {
            alphanumeric: "Please provide valid details"
        }
    });
    $('#outageZipcode').rules("add", {
        zipcode: true,
        messages: {
            alphanumeric: "Please provide a valid zipcode"
        }
    });
}

function attachValidationRecaptcha() {

    if ($('.g-recaptcha').length > 0) {
        // Adding hiddencaptcha validation
        $(".hiddenRecaptcha").rules("add", {
            required: true,
            messages: {
                required: "Please confirm you're not a robot",
            }
        });
    } else {
        if ($(".hiddenRecaptcha").length > 0) {
            // Removing hiddencaptcha validation
            $(".hiddenRecaptcha").rules('remove');
            $(".hiddenRecaptcha").removeClass('required');
            $(".hiddenRecaptcha").removeClass('error');
            $(".hiddenRecaptcha").valid();
        }
    }
}

//Clears the form values and validations
function ResetForm() {
    var validator = $("#inquiry-contact").validate({
        errorPlacement: function (error, element) {
            error.appendTo(element.parents('.errorDiv').next(".errorMessage"));
        }
    });

    validator.destroy();

    if ($('#signInHeadline').css('display') == 'none')
        return;

    $('input[type="text"]').val('');
    $('input[type="radio"]').prop("checked", false);
    $('textarea').val('');

    $('#contactPhoneType').next().html('');
    $('#contactPhoneType').prop('selectedIndex', 1);
    $('#contactPhoneType').change();

    $('#selectPayment').next().html('');
    $('#selectPayment').prop('selectedIndex', 0);
    $('#selectPayment').change();

    $('#selectScamPaymentMode').next().html('');
    $('#selectScamPaymentMode').prop('selectedIndex', 0);
    $('#selectScamPaymentMode').change();

    $('#selectGasAppliance').next().html('');
    $('#selectGasAppliance').prop('selectedIndex', 0);
    $('#selectGasAppliance').change();

    $('#phonetype').next().html('');
    $('#phonetype').prop('selectedIndex', 1);
    $('#phonetype').change();
}

$("#topicDropDown").change(function () {
    $('#subTopicDropDown').next().html('');
    $('#subTopicDropDown').prop('selectedIndex', 0);
    $('#subTopicDropDown').change();

    ResetForm();

    $('#subTopicDropDown option:not(:first)').remove();
    $('#subSubTopicDropDown option:not(:first)').remove();
    $('#faq-links').empty();
    $('#feedback-faq').empty();

    var selectedTopicGuid = $("#topicDropDown").val();
    selectedTopic = selectedTopicGuid;

    if (selectedTopicGuid != '') {
        $.ajax({
            url: '/api/CustomerFeedback/GetSubTopicsForSelectedTopic',
            type: "GET",
            datatype: "json",
            contenttype: 'application/json; charset=utf-8',
            data: { 'selectedTopicGuid': selectedTopicGuid },
            context: this,
            success: function (data) {
                if (data.Topics.length > 0) {
                    $("#subTopicDropDownDiv").show();
                    $.each(data, function (i, item) {
                        for (i = 0; i < item.length; i++) {
                            $('#subTopicDropDown').append('<option value="' + item[i].Guid + '">' + item[i].Description + '</option>');
                        }
                    });

                    $("#subSubTopicDropDownDiv").hide();
                    $("#faq-title-section, #sendus-contact-content-title, .sendus-contact-content, .help-inquiry, .sendus-contact-content, .recaptcha-submit-btn").hide();
                }
            },
            error: function (xhr) {
                console.log('Get Sub Topics For Selected Topic - error');
            }
        });
    }
    else {
        $("#subTopicDropDownDiv").hide();
        $("#subSubTopicDropDownDiv").hide();
        $("#faq-title-section, #sendus-contact-content-title, .sendus-contact-content, .help-inquiry, .sendus-contact-content, .recaptcha-submit-btn").hide();
    }
});


$("#subTopicDropDown").change(function () {
    $('#subSubTopicDropDown').next().html('');
    $('#subSubTopicDropDown').prop('selectedIndex', 0);
    $('#subSubTopicDropDown').change();

    ResetForm();

    selectedSubTopicGuid = $("#subTopicDropDown").val();
    $('#subSubTopicDropDown option:not(:first)').remove();
    $('#faq-links').empty();
    $('#feedback-faq').empty();
    $("#faq-title-section, #sendus-contact-content-title, .help-inquiry, .recaptcha-submit-btn").hide();

    if (selectedSubTopicGuid != '') {
        $.ajax({
            url: '/api/CustomerFeedback/GetSubSubTopicsForSelectedSubtopic',
            type: "GET",
            datatype: "json",
            contenttype: 'application/json; charset=utf-8',
            data: { 'selectedSubTopicGuid': selectedSubTopicGuid },
            context: this,
            async: false,
            success: function (data) {
                if (data.Topics.length > 0) {
                    $("#subSubTopicDropDownDiv").show();
                    $.each(data, function (i, item) {
                        for (i = 0; i < item.length; i++) {
                            $('#subSubTopicDropDown').append('<option value="' + item[i].Guid + '">' + item[i].Description + '</option>');
                        }
                    });

                    $("#faq-title-section, #faq-section, #sendus-contact-content-title, .sendus-contact-content, .sendus-contact-content, .recaptcha-submit-btn").hide();
                }
                else {
                    $("#subSubTopicDropDownDiv").hide();

                    //AJAX call for gettting FAQs for the selected sub topic
                    GetFaqsForSelectedSubTopic();
                }
            },
            error: function (xhr) {
                console.log('Get Sub Sub Topics For Selected topic - error');
            }
        });
    }
    else {
        $("#subSubTopicDropDownDiv").hide();
        $("#faq-title-section, #sendus-contact-content-title, .sendus-contact-content, .help-inquiry, .recaptcha-submit-btn").hide();
    }
});


$("#subSubTopicDropDown").change(function () {
    ResetForm();

    var selectedSubSubTopicGuid = $("#subSubTopicDropDown").val();
    $('#faq-links').empty();
    $('#feedback-faq').empty();

    if (selectedSubSubTopicGuid != '') {
        $.ajax({
            url: '/api/CustomerFeedback/GetFaqsForSelectedSubSubTopic',
            type: "GET",
            datatype: "json",
            contenttype: 'application/json; charset=utf-8',
            data: { 'selectedSubSubTopicGuid': selectedSubSubTopicGuid },
            context: this,
            success: function (data) {
                if (data.FaqsLinks != '' || data.RelatedFaqs.length > 0) {
                    $("#faq-title-section, #faq-section, #sendus-contact-content-title, .sendus-contact-content, .recaptcha-submit-btn").show();
                    $('#faq-links').append(data.FaqsLinks);
                    if (data.RelatedFaqs.length > 0) {
                        for (i = 0; i < data.RelatedFaqs.length; i++) {
                            $('#feedback-faq').append('<p class="collapsed" data-toggle="collapse" data-target="#' + i + '" id="faq-question">' + data.RelatedFaqs[i].Question + '</p><div class="collapse" id="' + i + '"><p>' + data.RelatedFaqs[i].Answer + '</p></div>');
                        }
                    }
                    else {
                        $("#relatedFaqTitle").hide();
                    }
                }
                else if (data.FaqsLinks == '' && data.RelatedFaqs.length == 0) {
                    $('#faq-title-section').hide();
                    $('#faq-section').hide();
                    $("#sendus-contact-content-title, .sendus-contact-content, .recaptcha-submit-btn").show();
                }

                //Adds conditional blocks for the selected topic
                AddConditionalBlock();
            },
            error: function (xhr) {
                console.log('Get Faqs For Selected Sub Sub Topic - error');
            }
        });
    }
    else {
        $("#faq-title-section, #faq-section, #sendus-contact-content-title, .sendus-contact-content, .recaptcha-submit-btn").hide();
    }
});

var PopulateCustomerData = function (data) {
    //ResetForm();
    $('#signInHeadline').css('display', 'none');
    $('.sign-in').css('display', 'none');

    if (data.OrganizationName == '' && data.OrganizationName.length == 0) {
        if (data.FistName !== '' && data.FistName.length !== 0) {
            $("#firstName").prop("readonly", true);
        }
        if (data.MiddleName !== '' && data.MiddleName.length !== 0) {
            $("#initial").prop("readonly", true);
        }
        if (data.LastName !== '' && data.LastName.length !== 0) {
            $("#lastName").prop("readonly", true);
        }
    }

    //Pre-populate Customer profile card					  
    $('.customer-inquiry-media').css('display', 'block');
    $('#signedInUserName').append(data.FistName).append(' ').append(data.LastName);
    $('#signedInUserAddress').append(data.MailingAddress.Line1).append(' ').append(data.MailingAddress.Line2)
        .append(' ').append(data.MailingAddress.City).append(', ').append(data.MailingAddress.State).append(' ').append(data.MailingAddress.PostalCode);
    $('#signedInUserAccountNumber').append(data.ContractAccountId);

    //Pre-populate the form with user details
    if (data.OrganizationName == '' && data.OrganizationName.length == 0) {
        $("#firstName").val(data.FistName);
        $("#initial").val(data.MiddleName);
        $("#lastName").val(data.LastName);
    }

    switch (data.PrimaryPhone) {
        case "home":
            $.each(data.Phones, function () {
                if ("home" == this.PhoneType) {
                    $("#phoneNumber").val(this.Number);
                    $("#phonetype").val("home").change();;
                };
            });
            break;
        case "work":
            $.each(data.Phones, function () {
                if ("work" == this.PhoneType) {
                    $("#phoneNumber").val(this.Number);
                    $("#phonetype").val("work").change();;
                };
            });
            break;
        case "cell":
            $.each(data.Phones, function () {
                if ("cell" == this.PhoneType) {
                    $("#phoneNumber").val(this.Number);
                    $("#phonetype").val("mobile").change();;
                };
            });
            break;
        default:
            break;

    }
    $("#accNumber").val(data.ContractAccountId);
    $("#streetAddres1").val(data.MailingAddress.Line1);
    $("#streetAddres2").val(data.MailingAddress.Line2);
    $("#contactCity").val(data.MailingAddress.City);
    $("#contactZip").val(data.MailingAddress.PostalCode);
    $("#login-username-section").trigger("reset");
    $('.bs-customer-signin-modal-md').modal('hide')

}
//Sign in Button Click
$("#btnSign").click(function () {

    PopulateDetailsForCustomer();
});


//Sign in functionality 
var PopulateDetailsForCustomer = function () {
    var selectedTopic = $("#topicDropDown :selected").text();
    if ($("#Username").val() != '' && $("#Password").val() != '') {
        $.ajax({
            url: '/api/CustomerFeedback/CustomerAuthentication',
            type: "GET",
            datatype: "json",
            contenttype: 'application/json; charset=utf-8',
            data: { 'UserName': $("#Username").val(), 'Password': $("#Password").val(), 'SelectedTopic': selectedTopic },
            context: this,
            success: function (data) {
                $("#loginInvalid").css('display', 'none');

                if (data.CustomerName == null/* && data.ContractAccountId == null*/) {
                    $("#loginInvalid").css('display', 'block');
                }
                else if (data != '' && data.customerName != '') {

                    $('.g-recaptcha').remove();
                    attachValidationRecaptcha();
                    PopulateCustomerData(data);

                    AlignFormFieldValues();
                    $(".information-content .errorMessage").html('');
                }
            },
            error: function (xhr) {
                console.log('Login not successful - error');
            }
        });
    }
}


//Leasing
$("input[name='leasedOption']").change(function () {
    $('.conditional-leasing input').each(function () {
        if ($(this).val() == "") {
            $(this).siblings().removeClass('is-text');
        }
        else {
            $(this).siblings().addClass('is-text');
        }
    });

    if ($("input[name='leasedOption']:checked").val().toLowerCase() == 'Gas Water Heater'.toLowerCase()) {
        $('#Make1').val('');
        $('#Model1').val('');
        $('#Make1').siblings('')
        $('#gasConversionBurner').css('display', 'none');
        $('#gasWaterHeater').css('display', 'block');
    }

    else if ($("input[name='leasedOption']:checked").val().toLowerCase() == 'Gas Conversion Burner'.toLowerCase()) {
        $('#Make').val('');
        $('#Model').val('');
        $('#SerialNumber').val('');
        $('#gasWaterHeater').css('display', 'none');
        $('#gasConversionBurner').css('display', 'block');
    }
});

//Report a Scam
$("input[name='enforcementOption']").change(function () {
    $("#reportScamAmountPaid").next().html('')
    if ($("input[name='enforcementOption']:checked").val().toLowerCase() == 'Yes'.toLowerCase()) {
        $('#Make1').val('');
        $('#Model1').val('');
        $('#reportScamAmountPaid').css('display', 'block');
        $('#reportScamPaymentModeTitle').css('display', 'block');
        $('#reportScamPaymentMode').css('display', 'block');
    }
    else if ($("input[name='enforcementOption']:checked").val().toLowerCase() == 'No'.toLowerCase()) {
        $("#scamAmountPaid").val('');
        $('#selectScamPaymentMode').next().html('');
        $('#selectScamPaymentMode').prop('selectedIndex', 0);
        $("#selectScamPaymentMode").parent(".select-wrapper").removeClass("is-selected");
        $('#reportScamAmountPaid').css('display', 'none');
        $('#reportScamPaymentModeTitle').css('display', 'none');
        $('#reportScamPaymentMode').css('display', 'none');
    }
});

function attachValidation() {
    $("#inquiry-contact").validate({
        ignore: ".ignore",
        errorPlacement: function (error, element) {
            error.appendTo(element.parents('.errorDiv').next(".errorMessage"));
        },
        rules: {
            contactMessage: "required",
            firstName: {
                required: true,
                alphanumeric: true,
            },
            lastName: {
                required: true,
                alphanumeric: true,
            },
            initial: {
                alphanumeric: true
            },
            phoneNumber: {
                required: true,
                phoneUSA: true
            },
            phonetype: "required",
            accNumber: {
                number: true,
                minlength: 12,
                maxlength: 12
            },
            streetAddres1: {
                required: true,
                alphanumeric: true
            },
            streetAddres2: {
                alphanumeric: true
            },
            contactCity: {
                required: true,
                alphanumeric: true
            },
            contactZip: {
                required: true,
                zipcode: true,
            },
            completeForm: {
                required: true,
                alphanumeric: true
            },
            contactPhone: {
                required: true,
                phoneUSA: true
            },
            contactPhoneType: "required",
            contactEmail: {
                required: true,
                mail: true
            }
        },
        messages: {
            contactMessage: "Please enter your message",
            firstName:
            {
                required: "Please enter first name",
                alphanumeric: "Please provide valid details",
            },
            initial: {
                alphanumeric: "Please provide valid details",
            },
            lastName: {
                required: "Please enter last name",
                alphanumeric: "Please provide valid details",
            },
            phoneNumber: {
                required: "Please enter your phone number"
            },
            phonetype: "Please select Phone type",
            accNumber: "Account number should have 12 digits",
            streetAddres1:
            {
                required: "Please enter your street address",
                alphanumeric: "Please provide valid details",
            },
            streetAddres2:
            {
                alphanumeric: "Please provide valid details",
            },
            contactCity:
            {
                required: "Please enter your city",
                alphanumeric: "Please provide valid details",
            },
            contactZip: {
                required: "Please enter your Zip Code",
                zipcode: "Please provide a valid zipcode",
            },
            completeForm: {
                required: "Please enter your name",
                alphanumeric: "Please provide valid details",
            },
            contactPhone: {
                required: "Please enter your phone number"
            },
            contactPhoneType: "Please select phone type",
            contactEmail: {
                required: "Please enter your mail address",
                mail: "Please provide a valid email address",
            }
        }
    });
    attachValidationRecaptcha();
    $("#inquiry-contact").validate();
}

var SubmitParameters = function () {
    submitObject = {
        TopicTitle: $("#topicDropDown").find('option:selected').text(),
        SubTopicTitle: $("#subTopicDropDown").find('option:selected').text(),
        SubSubTopicTitle: $("#subSubTopicDropDown").find('option:selected').text(),
        EnterMessage: $("#contactMessage").val(),
        FirstName: $("#firstName").val(),
        MiddleName: $("#initial").val(),
        LastName: $("#lastName").val(),
        PhoneNumber: $("#phoneNumber").val(),
        PhoneType: $("#phonetype").find('option:selected').text(),
        PseAccountNumber: $("#accNumber").val(),
        StreetAddress1: $("#streetAddres1").val(),
        StreetAddress2: $("#streetAddres2").val(),
        City: $("#contactCity").val(),
        ZipCode: $("#contactZip").val(),
        PersonName: $("#completeForm").val(),
        PersonPhoneNumber: $("#contactPhone").val(),
        PersonPhoneType: $("#contactPhoneType").find('option:selected').text(),
        EmailAddress: $("#contactEmail").val(),
        RecaptchaHiddenValue: $('#hiddenRecaptcha').val(),

        ConditionalPayments: {
            PaymentDate: $("#paymentDate").val(),
            PaidAmount: $("#paymentAmount").val(),
            PaymentMode: $("#selectPayment").find('option:selected').text()
        },

        ConditionalLeasing: {
            CustomerType: $("input[name='ownerOption']:checked").val(),
            ApplianceType: $("input[name='leasedOption']:checked").val(),
            Make: $('#Make').val(),
            Model: $('#Model').val(),
            SerialNumber: $('#SerialNumber').val(),
            Make1: $('#Make1').val(),
            Model1: $('#Model1').val()
        },

        ConditionalReportScam: {
            PermissionShareReport: $("input[name='permissionOption']:checked").val(),
            City: $("#City").val(),
            Reason: $("#addresspayment").val(),
            ImmediatePaymentRequested: $("input[name='callerRequestOption']:checked").val(),
            LanguageUsed: $("#Language").val(),
            IncidentDate: $("#incidentDate").val(),
            IncidentTime: $("#time").val(),
            DataRequestedFor: $("#scamAdditionalComments").val(),
            ScamPhoneNumber: $("#ScamPhoneNumber").val(),
            PhoneNumberCallBack: $("#PhoneNumberCallBack").val(),
            MakePayment: $("input[name='enforcementOption']:checked").val(),
            AmountPaid: $("#scamAmountPaid").val(),
            PaymentMode: $("#selectScamPaymentMode").find('option:selected').text()
        },

        ConditionalPseNotice: {
            CopyPaperwork: $("input[name='testamentaryOption']:checked").val(),
            CopyNoticeLeft: $("input[name='noticePSE']:checked").val()
        },

        ConditionalGasAppliance: {
            GasType: $("#selectGasAppliance").find('option:selected').text(),
            IssueGasNeedHelp: $("#otherAdditionalComments").val()
        },

        ConditionalOutage: {
            OutageReported: $("input[name='OutageReportedTitle']:checked").val(),
            OutageDate: $("#payFromDate").val(),
            Address1: $("#outageStreetAddress").val(),
            Address2: $("#outageStreetAddress1").val(),
            City: $("#outageCity").val(),
            ZipCode: $("#outageZipcode").val()
        }
    }

    $.ajax({
        url: '/api/CustomerFeedback/SubmitCustomerFeedback',
        type: "POST",
        datatype: "json",
        contenttype: 'application/json; charset=utf-8',
        data: submitObject,
        context: this,
        success: function (data) {
            if (data == true) {
                window.location.href = "/home/logcustomerfeedback/submitconfirmationpage"
            }
        },
        error: function (xhr) {
            console.log('Submit action - error');
        }
    });
}

$("#btnSubmit").click(function (e) {
    e.preventDefault();

    var validator = $("#inquiry-contact");
    if (validator.valid()) {
        SubmitParameters();
    }
});


var AlignFormFieldValues = function () {
    $('.information-content input').each(function () {
        if ($(this).val() == "") {
            $(this).siblings().removeClass('is-text');
        }
        else {
            $(this).siblings().addClass('is-text');
        }
    })
}

var CustomerFeedbackValidation = {
    inquiryContactPhone: "Please specify a valid contact number",
    inquiryPhoneNumber: "Please specify a valid phone number"

}

jQuery.validator.addMethod("phoneUSA", function (phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(\+?1-?)?(\([0-9]\d{2}\)|[0-9]\d{2})-?[0-9]\d{2}-?\d{4}$/);
}, "Please specify a valid phone number");


$("#phoneNumber, #contactPhone").inputmask({ "mask": "(999) 999-9999", greedy: false });


$("#phoneNumber, #contactPhone").blur(function () {
    $(this).valid();
});