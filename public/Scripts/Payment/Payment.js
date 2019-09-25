var PSE_BdHvOriginalSubmit;
var bdhvSubmitActor = null;
var bdhvHyperlinkClicked = false;
var bdhvSubmitCalledDirectly = false;
var hvSubmitHandled = false;
var mybillurl;
var _accountType;
var nonBdhvInputs;
var paymentModel;

$(document).ready(function () {
    hvSubmitHandled = false;
    AddBdhvClickEventHandlers();
    mybillurl = $('.view-bill').attr('href');
    $('.view-bill').attr('href', 'javascript:void(0)');
    $('#cf_schedulepayment:payment_account').attr('onchange', 'disableButtons(); bdhvSubmitCalledDirectly=true;bdhvPostBack()');
    ModifyMakeAPaymentHtml();
    nonBdhvInputs = new Array();
    if (document.forms['aspnetForm'] != null) {
        $(document.forms['aspnetForm'].elements).each(function () {
            var thisObj = $(this);
            if (thisObj.parents('#MakeAPayment #BdhvContent').length == 0) {
                nonBdhvInputs.push(thisObj.attr('name'));
            }
        });
    }

    if ($('#JsUrls') != null && $('#JsUrls') != undefined && $('#JsUrls').val() != null && $('#JsUrls').val() != undefined) {
        var jsUrls = $('#JsUrls').val();
        jsUrls = jsUrls.split("|");
        for (var i = 0; i < jsUrls.length; i++) {
            var scriptUrl = jsUrls[i];
            if (scriptUrl != null && scriptUrl != undefined && scriptUrl != "") {
                $.getScript(scriptUrl, function () {
                    console.log(scriptUrl);
                });
            }
        }
    }
    if ($('#JsCode') != null && $('#JsCode') != undefined) {
        var strScript = $('#JsCode').val();
        if (strScript != null && strScript != undefined && strScript != "") {
            finalScriptsToLoad = strScript;
            if (typeof (finalScriptsToLoad) != 'undefined' || finalScriptsToLoad != null || finalScriptsToLoad.length >= 0) {
                var parentElement = $('#MakeAPayment #BdhvContent').get(0);
                var lastScript = document.createElement('script');
                try {
                    lastScript.appendChild(finalScriptsToLoad);
                } catch (e) {
                    lastScript.text = finalScriptsToLoad;
                }
                parentElement.appendChild(lastScript);
            }
            $('#JsCode').val("");
        }
    }
});

$(document).ready(function () {
    if (getQueryStringValue('pay') == 'now') {
        var payTag = $('[data-target="#select-payment-option"]')
        if (payTag != null && payTag != 'undefined') {
            if ($(payTag).is(':visible')) {
                $('#select-payment-option').modal('show');
            }
        }
    }
});

function AddBdhvClickEventHandlers() {
    $('#MakeAPayment #BdhvContent input[type="submit"]').click(function (event) { bdhvSubmitActor = this; });
    $('#MakeAPayment #BdhvContent a[onclick^="return oamSubmitForm("]').click(function (event) { bdhvHyperlinkClicked = true; });
}

function getQueryStringValue(value) {
    var url = window.location.href;
    value = value.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + value + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


function ModifyMakeAPaymentHtml() {
    var billsAvailableElm = $('#MakeAPayment div#BdhvContent #cf_billsummary\\:billsAvailable');
    if (billsAvailableElm.length > 0) {
        var billsAvailableElmParent = billsAvailableElm.parent();
        if (billsAvailableElmParent.prop('tagName').toLowerCase() == 'li' || billsAvailableElmParent.children().length == 1)
            billsAvailableElmParent.remove();
        else
            billsAvailableElm.remove();
    }


    var bankAccount = document.getElementById("cf_schedulepayment:payment_account");

    if (bankAccount != null && bankAccount != undefined) {
        bankAccount.setAttribute('onchange', 'disableButtons(); bdhvSubmitCalledDirectly=true;bdhvPostBack()');
    }

    // Modify main section
    var sectionTitle = $('#MakeAPayment div#BdhvContent div#cf-container div.cf-main_section div.cf-section_title span:first');
    if (sectionTitle.length == 1 && $.trim(sectionTitle.text()).toLowerCase() == "bill summary") {
        // replace text under title
        $('div.cf-main_section .cf-content_box_full:eq(1) div:first').html('<strong>Save time. Pay bills automatically using Worry-free Options.</strong>');

        // Hide icons
        $('.cf-option_box:last span.cf-alert_mobile').hide();
        $('.cf-option_box:last span.cf-pay_bill_auto').hide();

        // Remove text from Worry-free box
        $('.cf-option_box:last p p').remove();

        // Insert Worry-free Options into Options box
        $('.cf-option_box:first').append('<br/>');
        $('.cf-option_box:first').append($('.cf-option_box:last').html());
        $('.cf-option_box:last').hide();
    }
}

function HandleHvSubmit() {

    if (hvSubmitHandled)
        return false;
    var form = document.forms['aspnetForm'];
    var elements = {};
    for (i = 0; i < form.elements.length; i++) {
        elements[form.elements[i].name] = form.elements[i];
    }
    var elementName = 'aspnetForm:_idcl';
    var element = elements[elementName];
    if (typeof element == 'undefined')
        return false;
    var elementValue = element.getAttribute('value');
    if ((elementValue == null || elementValue.length == 0) && (typeof bdhvSubmitActor == 'undefined' || bdhvSubmitActor == null)
        && !(bdhvHyperlinkClicked || bdhvSubmitCalledDirectly))
        return false;

    if (typeof (PSE_BdHvOriginalSubmit) != 'undefined')
        PSE_BdHvOriginalSubmit()

    var submitControlNameInput = elements['SubmitControlName'];

    if (typeof submitControlNameInput == 'undefined') {
        alert('An unknown error occurred.');
        return true;
    }

    var duplicateElements = {};
    for (i = 0; i < form.elements.length; i++) {
        var iterValue = form.elements[i];
        if (iterValue.type == 'hidden') {
            var iterObject = $(iterValue);
            var iterValueAttribute = iterObject.attr('value');
            if ($(form.elements[iterValue.name]).length > 1
                && (typeof (duplicateElements[iterValue.name]) == 'undefined' || (iterValueAttribute != null && iterValueAttribute.length > 0))) {
                duplicateElements[iterValue.name] = iterValue;
            }
        }
    }

    jQuery.each(duplicateElements, function () {
        var finalDedupedObject = this;
        var duplicates = form.elements[this.name];
        $(duplicates).each(function () {
            if (this != finalDedupedObject)
                $(this).remove();
        });
    });

    if (typeof (bdhvSubmitActor) != 'undefined' && bdhvSubmitActor != null
        && $(form.elements[bdhvSubmitActor.name]).filter(function () {
            if ($(this).attr('type') == 'hidden')
                return true
        }).length == 0) {
        var submitHiddenInput = document.createElement('input');
        submitHiddenInput.type = 'hidden';
        var submitHiddenInputName = bdhvSubmitActor.name || bdhvSubmitActor.id;
        submitHiddenInput.name = submitHiddenInputName;
        submitHiddenInput.id = submitHiddenInputName;
        submitHiddenInput.value = bdhvSubmitActor.value;
        $('#MakeAPayment #BdhvContent').get(0).appendChild(submitHiddenInput);
    }

    hvSubmitHandled = true;
}

function LoadBDHVScript() {
    if ($('#JsCode') != null && $('#JsCode') != undefined) {
        var strScript = $('#JsCode').val();
        if (strScript != null && strScript != undefined && strScript != "") {
            finalScriptsToLoad = strScript;
            if (typeof (finalScriptsToLoad) != 'undefined' || finalScriptsToLoad != null || finalScriptsToLoad.length >= 0) {
                var parentElement = $('#MakeAPayment #BdhvContent').get(0);
                var lastScript = document.createElement('script');
                try {
                    lastScript.appendChild(finalScriptsToLoad);
                } catch (e) {
                    lastScript.text = finalScriptsToLoad;
                }
                parentElement.appendChild(lastScript);
            }
            $('#JsCode').val("");
        }
    }
}

function bdhvPostBack() {

    HandleHvSubmit();

    var formValues = $("#aspnetForm").serializeArray();

    $("#UpdateProgress").show();

    $.ajax("/api/Payment/BankAccountWithdrawalSubmit", {
        type: "POST",
        data: formValues,
        success: function (result) {
            hvSubmitHandled = false;
            bdhvSubmitActor = null;
            $("#MakeAPayment").html(result);
            if ($('#JsUrls') != null && $('#JsUrls') != undefined) {
                var jsUrls = $('#JsUrls').val();
                if (jsUrls != "" && jsUrls != null && jsUrls != undefined) {
                    jsUrls = jsUrls.split("|");
                    for (var i = 0; i < jsUrls.length; i++) {
                        var scriptUrl = jsUrls[i];
                        if (scriptUrl != null && scriptUrl != undefined && scriptUrl != "") {
                            $.getScript(scriptUrl)
                                .done(function (script, textStatus) {
                                    if (i == jsUrls.length) {
                                        LoadBDHVScript();
                                    }
                                })
                                .fail(function (jqxhr, settings, exception) {
                                    console.log("Triggered ajaxError handler.");
                                });
                        }
                    }
                    $('#JsUrls').val("");
                }
                else {
                    LoadBDHVScript();
                }
            }
            else {
                LoadBDHVScript();
            }
            var bdhvParent = $('#MakeAPayment div#BdhvContent');
            if (bdhvParent.length > 0) {
                ModifyMakeAPaymentHtml();
                AddBdhvClickEventHandlers();
            }

            $("#UpdateProgress").hide();
        },
        error: function (jqXHR, status, error) {
            $("#MakeAPayment").html(error);
            $("#UpdateProgress").hide();
        },
        complete: function () {
            return false;
        }
    });
}


var guest_validation = {
    zipCode: 'Please enter your zipcode',
    guestAccountNumber: 'Please enter your Account number',
    zipCodeNumberOnly: 'Please enter a valid zip code',
    accountNumberOnly: 'Please provide a valid 12 digit account number',
    accountMin: "Please enter at least 12 digits"

};
if (paymentModel != null && paymentModel.IGuestPaymentModel != null) {
    guest_validation.zipCode = paymentModel.IGuestPaymentModel.ZipcodeRequiredError,
        guest_validation.guestAccountNumber = paymentModel.IGuestPaymentModel.AccountRequiredError,
        guest_validation.zipCodeNumberOnly = paymentModel.IGuestPaymentModel.ZipcodeLengthError,
        guest_validation.accountNumberOnly = paymentModel.IGuestPaymentModel.InvalidAccountError,
        guest_validation.accountMin = paymentModel.IGuestPaymentModel.AccountLengthError
}
if (typeof captcha_validation !== "undefined") {
    $("#guestPaymentForm").validate({
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
$("#guestZipcode").rules("add", {
    required: true,
    number: true,
    minlength: 5,
    maxlength: 5,
    messages: {
        required: guest_validation.zipCode,
        number: guest_validation.zipCodeNumberOnly,
        minlength: guest_validation.zipCodeNumberOnly,
        maxlength: guest_validation.zipCodeNumberOnly
    }
});

$('#accountNumber').rules("add", {
    required: true,
    number: true,
    minlength: 12,
    maxlength: 12,
    messages: {
        required: guest_validation.guestAccountNumber,
        number: guest_validation.accountNumberOnly,
        minlength: guest_validation.accountMin
    }
});

$("#btnGuestPayment").click(function (event) {
    var validator = $("#guestPaymentForm");
    if (validator.valid()) {
        if (typeof grecaptcha != "undefined") {
            if ($("#accountNumber") != undefined) {
                if ($("#accountnumber").val() != undefined) {
                    $("#txtAcctNumber").val($("#accountNumber").val());
                }
            }
        }
        else {
            if ($("#accountNumber") != undefined) {
                if ($("#accountNumber").val() != undefined) {
                    $("#txtAcctNumber").val($("#accountNumber").val());
                }
            }
        }
    }
    else {
        return false;
    }
});



$("#btnMakePayment").click(function (event) {
    GetPaymentForm();
});


function GetPaymentForm() {
    var accountNumber = "";
    if ($("#txtAcctNumber") != undefined) {
        if ($("#txtAcctNumber").val() != undefined) {
            accountNumber = $("#txtAcctNumber").val();
            $('#txtPayNowAcctNumber').val(accountNumber);
        }
    }

    var baseUrl = "";
    if ($("#btnMakePayment") != undefined) {
        baseUrl = $("#btnMakePayment").attr("href");
    }
}

function GuestPaymentFormSubmit() {
    var accountNumber = "";
    if ($("#accountNumber") != undefined) {
        if ($("#accountNumber").val() != undefined) {
            accountNumber = $("#accountNumber").val();
        }
    }
    var zipCode = "";
    if ($("#guestZipcode") != undefined) {
        if ($("#guestZipcode").val() != undefined) {
            zipCode = $("#guestZipcode").val();
        }
    }
    var baseUrl = "";
    if ($("#btnGuestPayment") != undefined) {
        baseUrl = $("#btnGuestPayment").attr("href");
    }
}

$(document).on('click', '.view-bill', function (e) {
    e.preventDefault();
    if (_accountType != null && _accountType != undefined) {
        if (_accountType.toLowerCase() == "nonconsumption") {
            window.open(_viewBillPdfUrl, "_blank");
        }
        else {
            window.location.replace(mybillurl);
        }
    }
    else {
        window.location.replace(mybillurl);
    }
});
