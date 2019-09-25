$(document).ready(function () {
    pse_constructionservice.resetForm();
    pse_constructionservice.topicChange();
    pse_constructionservice.lookingForCostToInstallGasChange();
    pse_constructionservice.lookingForCostToInstallElectricChange();
    pse_constructionservice.addressCheckChange();
    pse_constructionservice.applianceOtherChange();
    pse_constructionservice.changeOtherChange();
    pse_constructionservice.addressCheckOnload();  
    pse_constructionservice.attachValidationRecaptcha();
});

var pse_constructionservice = {
    
    topicOnload: function () {
        switch ($('#SelectedTopic').val()) {
            case "Gas Availability":
                $('#gas').show();
                $('#gasYes').hide();
                $('#otherGasApplianceText').hide();
                $('#electric').hide();
                $('#electricYes').hide();
                $('#changeServiceList').hide();
                $('#otherChangeServiceText').hide();
                $('#gasORelectric').show();
                break;
            case "General questions":
                //hide all except description
                $('#gas').hide();
                $('#gasYes').hide();
                $('#otherGasApplianceText').hide();
                $('#electric').hide();
                $('#electricYes').hide();
                $('#changeServiceList').hide();
                $('#otherChangeServiceText').hide();
                $('#gasORelectric').hide();
                break;
            case "Electric Availability":
                $('#gas').hide();
                $('#gasYes').hide();
                $('#otherGasApplianceText').hide();
                $('#electric').show();
                $('#electricYes').hide();
                $('#changeServiceList').hide();
                $('#otherChangeServiceText').hide();
                $('#gasORelectric').show();
                break;
            case "Change existing services":
                $('#gas').hide();
                $('#gasYes').hide();
                $('#otherGasApplianceText').hide();
                $('#electric').hide();
                $('#electricYes').hide();
                $('#changeServiceList').show();
                $('#gasORelectric').hide();
                break;
            case "":
                $('#gas').hide();
                $('#gasYes').hide();
                $('#electric').hide();
                $('#electricYes').hide();
                $('#changeServiceList').hide();
                $('#otherChangeServiceText').hide();
                $('#gasORelectric').hide();
                break;
        }
    },

    costToInstallGasOnload: function () {
        switch ($('#SelectedLookingForCostToInstallGas').val()) {
            case "Yes":
                if ($('#SelectedTopic').val() == "Gas Availability") {
                    $('#gasYes').show();
                }
                else {
                    $('#gasYes').hide();
                    $('#otherGasApplianceText').hide();
                }
                break;
            case "No":
                $('#gasYes').hide();
                $('#otherGasApplianceText').hide();
                break;
            case "":
                $('#gasYes').hide();
                $('#otherGasApplianceText').hide();
                break;
        }
    },

    costToInstallElectricOnload: function () {
        switch ($('#SelectedLookingForCostToInstallElectric').val()) {
            case "Yes":
                if ($('#SelectedTopic').val() == "Electric Availability") {
                    $('#electricYes').show();
                }
                else {
                    $('#electricYes').hide();
                }
                break;
            case "No":
                $('#electricYes').hide();
                break;
            case "":
                $('#electricYes').hide();
                break;
        }
    },

    applianceOtherOnload: function () {
        if ($('#' + applianceOther).prop('checked')) {
            $('#otherGasApplianceText').show();
        }
        else {
            $('#otherGasApplianceText').hide();
        }
    },

    changeOtherOnload: function () {
        if ($('#' + changeOther).prop('checked')) {
            $('#otherChangeServiceText').show();
        }
        else {
            $('#otherChangeServiceText').hide();
        }
    },

    addressCheckOnload: function () {
        if ($('#AddressCheck').is(":checked")) {
            $('#HaveAddress').hide();
            $('#DoNotHaveAddress ').show();
            $('#Address1').removeAttr("required");
            $('#ParcelNumber').attr("required", "required");           
         }
        else {
            $('#HaveAddress').show();
            $('#DoNotHaveAddress ').hide();
            $('#Address1').attr("required", "required");
            $('#ParcelNumber').removeAttr("required");
        }
    },

    applianceOtherChange: function () {
        $('#' + applianceOther).change(function () {
            pse_constructionservice.applianceOtherOnload();
        });
    },
    attachValidationRecaptcha: function () {
        if ($('.g-recaptcha').length > 0) {
            // Adding hiddencaptcha validation
            $(".hiddenRecaptcha").rules("add", {
                required: true,
                messages: {
                    required: "Please confirm you're not a robot",
                }
            });
        } else {
            // Removing hiddencaptcha validation
            $(".hiddenRecaptcha").rules('remove');
            $(".hiddenRecaptcha").valid();
            $(".hiddenRecaptcha").removeClass('required');
            $(".hiddenRecaptcha").removeClass('error');
            $(".hiddenRecaptcha").valid();
        }
    },
    changeOtherChange: function () {
        $('#' + changeOther).change(function () {
            pse_constructionservice.changeOtherOnload();
        });
    },

    topicChange: function () {
        $('#SelectedTopic').change(function () {
            pse_constructionservice.topicOnload();
        });
    },

    lookingForCostToInstallGasChange: function () {
        $('#SelectedLookingForCostToInstallGas').change(function () {
            pse_constructionservice.costToInstallGasOnload();
        });
    },

    lookingForCostToInstallElectricChange: function () {
        $('#SelectedLookingForCostToInstallElectric').change(function () {
            pse_constructionservice.costToInstallElectricOnload();
        });
    },

    addressCheckChange: function () {
        $('#AddressCheck').change(function () {
            pse_constructionservice.addressCheckOnload();
        });
    },


    resetForm: function () {
        this.topicOnload();
        this.addressCheckOnload();
        this.costToInstallElectricOnload();
        this.costToInstallGasOnload();
        this.applianceOtherChange();
        this.changeOtherOnload();
    }
}
var InquiryFormItem = {
    InquirySelectedTopic: 'Please select the option',
    InquiryCostofGasInstall: 'Please select an option',
    InquiryKnowAboutInsallation: 'Please select an option',
    InquiryGasAppliances: 'Please select an appliance',
    InquirySquareFootage: 'Please enter squarefoot',
    InquiryServiceKind: 'Please select an option',
    InquiryServiceType: 'Please select an option',
    InquiryDistance: 'Please enter the distance from street',
    InquiryCostofElecticInstall: 'Please select an option',
    InquiryChangeService: 'Please select a change servie',
    InquiryOtherChange: 'Please specify',
    InquiryOtherGas: 'Please specify',
    Inquirydescription: 'Please enter the description',
    Inquiryaddress1: 'Please enter the address',
    Inquiryaddress2: 'Please enter the full address',
    Inquirycity: 'Please enter the city',
    Inquirystate: 'Please enter the state',
    Inquiryzipcode: 'Please enter the Zipcode',
    ParcelNo: 'Please enter the Parcel number',
    InquiryfName: 'Please enter the FirstName',
    InquirylName: 'Please enter the LastName',
    InquiryphNum: 'Please enter the Phone Number',
    InquiryeMail: 'Please enter the Email',
    InquirytimetoContact: 'Please enter the best time to contact you',
    InquiryRecaptcha: 'Please check Recaptcha field',
    GenericValidation: 'Please enter a value'
}



$(".InquiryFormItem-submit .inquirySubmit").on("click", function () {
    $("#SubmitCSInquiryForm").valid();
});

$("#SubmitCSInquiryForm").validate({    
    ignore: ":hidden:not(#hiddenRecaptcha)",
    rules: {
        "hiddenRecaptcha": {
            required: true
        }
    },
    messages: {
        "hiddenRecaptcha": {
            required: InquiryFromValidation.recaptcha
        }
    },
    errorPlacement: function (error, element) {
        error.appendTo(element.parents('.errorDiv').next(".errorMessage"));
    }
});



$("#SelectedTopic").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.topic
    }
});

$("#SelectedLookingForCostToInstallGas").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.costofgasinstall
    }
});

$("#DistanceFromStreet").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.distance
    }
});

$("#SelectedKnowAboutOurInstallationRequirement").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.knowaboutinstallation
    }
});

$("#SelectedServiceKind").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.servicekind
    }
});

$("#SelectedLookingForCostToInstallElectric").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.costofelectricinstall
    }
});

$("#SelectedServiceType").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.servicetype
    }
});


$("#OtherGasAppliance").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.othergas
    }
});

$("#SquareFootage").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.squarefootage
    }
});

$("#OtherChangeService").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.otherchange
    }
});

$("#Description").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.description
    }
});
$("#Address1").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.address1
    }
});

$("#ParcelNumber").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.parcelnumber
    }
});
$("#City").rules("add", {
    required: true,
    city: true,
    messages: {
        required: InquiryFromValidation.city
    }
});

$("#State").rules("add", {
    required: true,
    lettersonly: true,
    messages: {
        required: InquiryFromValidation.state
    }
});
$("#Zipcode").rules("add", {
    required: true,
    zipcode: true,
    messages: {
        required: InquiryFromValidation.zipcode
    }
});



$("#FirstName").rules("add", {
    required: true,
    nameWithSpaceOnly: true,
    messages: {
        required: InquiryFromValidation.firstname
    }
});

$("#LastName").rules("add", {
    required: true,
    nameWithSpaceOnly: true,
    messages: {
        required: InquiryFromValidation.lastname
    }
});

$("#PhoneNumber").inputmask({ "mask": "(999) 999-9999" });

$("#PhoneNumber").rules("add", {
    required: true,
    phoneUSA: true,
    messages: {
        required: InquiryFromValidation.phonenumber
    }
});


$("#EmailAddress").rules("add", {
    required: true,
    mail: true,
    messages: {
        required: InquiryFromValidation.email
    }
});

$("#TimeToContact").rules("add", {
    required: true,
    messages: {
        required: InquiryFromValidation.timetocontact
    }
});

jQuery.validator.addMethod("nameWithSpaceOnly", function (value, element) {
    return this.optional(element) || /^[a-zA-Z\s'%]*$/i.test(value);
}, "Only letters and space please");

