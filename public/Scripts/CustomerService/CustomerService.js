function btnGo(restult, object) {
    $("#managehidden").val(restult);
    var result = $(object).parent().prev().find('select').val();
    $("#manageactionhidden").val(result);
    if (result == "" || result == "Select An Action") {
        event.preventDefault();
        alert("Please select action...");
    }
}

$(document).ready(function () {
    var deliveryRegion = $('#selectDeliveryRegion option:selected').val();
    var futureDeliveryRegion = $('#selectFutureDeliveryRegion option:selected').val();

    if (deliveryRegion == "Foreign" || deliveryRegion == "Military")
        $('#divSelectCountry').show();
    else
        $('#divSelectCountry').css('display', 'none');

    if (futureDeliveryRegion == "Foreign" || futureDeliveryRegion == "Military")
        $('#divSelectFutureCountry').show();
    else
        $('#divSelectFutureCountry').css('display', 'none');

    if ($('#SelectedStartDate').length) {
        _getMoveInStartAndEndDate();
    }

    DisablePastDate();

    var bothDateLesser = '{"EditMailingAddress": "Edit Mailing Address"}';
    var bothDateLesserArray = jQuery.parseJSON(bothDateLesser);

    var startDateLesser = '{"EditMailingAddress": "Edit Mailing Address","StopService": "Stop Service","MoveService": "Move Service"}';
    var startDateLesserArray = jQuery.parseJSON(startDateLesser);

    var startDateGreater = '{"cancelstopstart":"Cancel Start Service Request","changestartstop": "Change Start Service Request","EditMailingAddress": "Edit Mailing Address"}';
    var startDateGreaterArray = jQuery.parseJSON(startDateGreater);
    var stopDateGreater = '{"EditMailingAddress": "Edit Mailing Address","cancelstop":"Cancel Stop Service Request", "changestop":"Change Stop Service Request"}';
    var stopDateGreaterArray = jQuery.parseJSON(stopDateGreater);
    var todayDate = new Date();
    var currentDate = todayDate.getUTCMonth() + 1 + '/' + todayDate.getUTCDate() + '/' + todayDate.getUTCFullYear();
    todayDate = new Date(currentDate);

    if ($(".manage-premises-datatable").length != 0) {
        var $managePremisesdatatable = $('#manage-premises-table');
        var _managePremisesUrl = '/api/CustomerService/GetMyPremises';

        function renderManagePremises() {
            function addOptionToSelect(data, type, row, meta) {
                var actionArray = bothDateLesserArray;
                var sDate = null;
                if (row.contractAccountStartDate != '' && row.contractAccountStartDate != null) {
                    sDate = new Date(row.contractAccountStartDate);
                }
                var eDate = null;
                if (row.contractAccountEndDate != '' && row.contractAccountEndDate != null) {
                    eDate = new Date(row.contractAccountEndDate);
                }
                if (sDate < todayDate && eDate < todayDate) {
                    actionArray = bothDateLesserArray;
                }
                if (sDate <= todayDate && eDate == null) {
                    actionArray = startDateLesserArray;
                }
                if (sDate <= todayDate && eDate > todayDate) {
                    actionArray = stopDateGreaterArray;
                }
                if (sDate > todayDate && eDate == null) {
                    actionArray = startDateGreaterArray;
                }
                var divEle = $("<div class='select-action'></div>");
                var lableDom = $("<label class='hide' for =premises-" + row.AccountNumber + "></label>");
                $(divEle).prepend(lableDom);
                var $select = $("<select></select>", {
                    "id": 'premises-' + row.AccountNumber,
                    "value": row.AccountNumber,
                    "class": "form-control",
                    "aria-labe1": 'premiseslabel-' + row.AccountNumber

                });

                var defaultselect = $("<option value=''>Select An Action</option>");
                $select = $select.append(defaultselect);

                $.each(actionArray, function (k, v) {
                    var $option = $("<option></option>", {
                        "text": v,
                        "value": v
                    });
                    if (data === v) {
                        $option.attr("selected", "selected")
                    }
                    $select.append($option);
                });
                $(divEle).append($select);
                return $(divEle).prop("outerHTML");
            }
            function getMailingAddress(data, type, row) {
                var btnGo = row.premiseId + ',' + row.serviceAddress.line_1 + "," + row.serviceAddress.line_2 + "," + row.serviceAddress.city + "," + row.serviceAddress.state + "," + row.serviceAddress.postal_code + "," + row.contractAccountStartDate + "," + row.contractAccountEndDate + "," + row.installationAccountNumber;
                var select = addOptionToSelect(data, type, row);
                return '<div class="row"><p class="col-xs-12 col-sm-12">' + data.line_1 + " " + data.line_2 + " " + data.city + " " + data.state + " " + data.postal_code + '</p><p class=" col-xs-12 col-sm-12 hidden-lg hidden-md hidden-sm">' + row.premiseId +
                    '</p><p class="col-xs-12 col-sm-12 hidden-lg hidden-md hidden-sm">' + 'Move In Date:' + datevalidate(row.contractAccountStartDate) + '</p><p class="col-xs-12 col-sm-12 hidden-lg hidden-md hidden-sm">' + 'Move Out Date:' + datevalidate(row.contractAccountEndDate) + '</p><div class="col-xs-12 col-sm-12 hidden-lg hidden-md hidden-sm"><div class="col-xs-8 col-sm-8 no-padding"><div class="form-group custom-select-arrow errorDiv">' + select + '</div><div class="errorMessage"></div></div><div><button class="col-xs-4 col-sm-4 btn-action" onclick="btnGo(' + "'" + btnGo + "'" + ', this);">Go</button></div></div></div>';

            }

            function datevalidate(managedate) {
                if (managedate == null || managedate == '') {
                    return "";
                }
                else {
                    return managedate;
                }
            }

            $managePremisesdatatable.DataTable({
                dom: 'Bfrtip',
                "destroy": true,
                "responsive": true,
                ajax: {
                    url: _managePremisesUrl,
                    processing: true,
                    serverSide: true,
                    cache: true,
                    type: "GET",
                    dataType: "json",
                    contenttype: 'application/json; charset=utf-8',
                    context: this,
                    dataSrc: function (data) {
                        if (data == null || data.premises == null || data.premises.length == 0) {
                            $("#manage-premises-wrapper").addClass("hide");
                            $(".loader-contentarea").removeClass("show", "hide");
                            document.location.href = "/";
                        }
                        else {
                            return data.premises;
                        }
                    }
                },
                "language": {
                    "loadingRecords": "Please wait - loading..."
                },
                "order": [[1, "asc"]],
                "aoColumnDefs": [
                    { 'bSortable': false, 'aTargets': [4] }
                ],
                "fnRowCallback": function (row, data, index) {
                    $(row).attr("id", "row_" + index);
                    return row;
                },
                columns: [
                    {
                        "data": "serviceAddress",
                        "render": getMailingAddress
                    },
                    {
                        "data": "installationAccountNumber",
                        "render": function (data, type, row, meta) {
                            return '<p class="hidden-xs">' + row.installationAccountNumber + '</p>'
                        },
                        className: "hidden-xs"
                    },
                    {
                        "data": "contractAccountStartDate",
                        "sType": "date",
                        className: "hidden-xs hidden-sm hidden-md"
                    },
                    {
                        "data": "contractAccountEndDate",
                        "sType": "date",
                        className: "hidden-xs hidden-sm hidden-md"
                    },
                    {
                        "render": addOptionToSelect,
                        className: "hidden-xs"
                    },
                    {
                        "data": "premiseId",
                        "render": function (data, type, row, meta) {
                            var btnGo = row.premiseId + ',' + row.serviceAddress.line_1 + "," + row.serviceAddress.line_2 + "," + row.serviceAddress.city + "," + row.serviceAddress.state + "," + row.serviceAddress.postal_code + "," + row.contractAccountStartDate + "," + row.contractAccountEndDate + "," + row.installationAccountNumber;
                            if (data) {
                                btnGo = '<button class="btn-action" onclick="btnGo(' + "'" + btnGo + "'" + ', this);">GO</button>';
                            }
                            return btnGo;
                        },
                        className: "hidden-xs"
                    }
                ],
                buttons: [{
                    extend: 'csv',
                    className: "hide",
                    filename: "Manage Premises"
                }],
                drawCallback: function () {
                    $('#manage-premises-load-more').toggle(this.api().page.hasMore());
                }
            });
            var input = $('#manage-premises-table_filter label input');
            $('#manage-premises-table_filter label').addClass("text-hide").css('margin-bottom', '5px');
            input.addClass("table-search form-control");
            var searchPlaceHolderText = document.getElementById("searchTextPlaceholder");
            input.attr("placeholder", searchPlaceHolderText.value);
            input.after("<span class='Icon-search'><i class='fa fa-search'></i></span>");
        }
        renderManagePremises();
    }
    $('#manage-premises-load-more').on('click', function () {
        event.preventDefault();
        $managePremisesdatatable.DataTable().page.loadMore();
    });
});

function ErrorPageCancelaction() {

    $("#SubmitStatus").val("cancel");

}
function ErrorPageSubmition() {

    $("#SubmitStatus").val("accept");

}
$(document).on('click', '#BusinessInfoNext', function (e) {
    e.preventDefault();
    var form_data = {
        'FirstName': $('#firstName').val(),
        'MiddleName': $('#mi').val(),
        'LastName': $('#lastName').val(),
        'Email': $('#contactEmail').val(),
        'Phone.Type': $('#selectPhone').val(),
        'Phone.Number': $('#phone').val(),
        'Phone.Extension': $('#ext').val()
    };
    $.ajax({
        url: "/api/CustomerService/CustomerInformationNext",
        type: "POST",
        data: form_data,
        success: function (data) {

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Error in Business Partner Search");
        }
    })
});

function SaveServiceDetails() {
    var myTableArray = [];
    $("table#servicesInstallationTable tbody tr").each(function () {
        var tableData = $(this).find('.fa-check-circle').parents('tr').find('td');
        if (tableData.length > 0) {
            myTableArray.push($(this).find('#serviceID').text());
        }
    });

    $.ajax({
        url: "/api/CustomerService/SaveServicesData",
        type: "POST",
        data: { services: myTableArray },
        async: false,
        success: function (data) {
            return true;
        },
        error: function (data) {
            console.log("Error: in Services page");
        }
    });
}

$("#selectDeliveryRegion").change(function () {
    var exists = $('#selectCountry option').filter(function () { return $(this).val() == ''; }).length;
    if (exists == 0)
        $('#selectCountry').prepend("<option value=''></option>").val('');

    var deliveryRegion = $('#selectDeliveryRegion option:selected').val();
    if (deliveryRegion == "Foreign" || deliveryRegion == "Military")
        $('#divSelectCountry').show();
    else
        $('#divSelectCountry').css('display', 'none')
});

$("#selectFutureDeliveryRegion").change(function () {
    var exists = $('#selectFutureCountry option').filter(function () { return $(this).val() == ''; }).length;
    if (exists == 0)
        $('#selectFutureCountry').prepend("<option value=''></option>").val('');

    var futureDeliveryRegion = $('#selectFutureDeliveryRegion option:selected').val();
    if (futureDeliveryRegion == "Foreign" || futureDeliveryRegion == "Military")
        $('#divSelectFutureCountry').show();
    else
        $('#divSelectFutureCountry').css('display', 'none')
});

$('#checkboxMailAddress').click(function () {
    $.ajax({
        url: "/api/CustomerService/GetServiceAddress",
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (data != undefined || data != "") {
                if ($('#checkboxMailAddress:checked').prop('checked')) {
                    $('#deliveryRegionShow').hide();
                    $('#attnToCare').val(data.CareOf);
                    $('#attnToCare').focus();
                    $('#streetAddress').val(data.Line1);
                    $('#streetAddress').focus();
                    $('#aptUnit').val(data.Line2);
                    $('#aptUnit').focus();
                    $('#city').val(data.City);
                    $('#city').focus();
                    $('#stateSelected').text('WA');
                    $('#zipCode').val(data.PostalCode);
                    $('#zipCode').focus();
                    $('#divSelectCountry').css('display', 'none');
                }
                else {
                    $('#deliveryRegionShow').show();
                    $('#attnToCare').val('');
                    $('#streetAddress').val('');
                    $('#aptUnit').val('');
                    $('#city').val('');
                    $('#zipCode').val('');
                }
            }
        },
        error: function (data) {
            console.log("Error: in getting the Service address");
        }
    });
});

$('#checkboxFutureMailAddress').click(function () {
    $.ajax({
        url: "/api/CustomerService/GetFutureServiceAddress",
        type: "POST",
        dataType: "json",
        success: function (data) {
            if (data != undefined || data != "") {
                if ($('#checkboxFutureMailAddress:checked').prop('checked')) {
                    $('#futureDeliveryRegionShow').hide();
                    $('#futureAttnToCare').val(data.CareOf);
                    $('#futureAttnToCare').focus();
                    $('#futureStreetAddress').val(data.Line1);
                    $('#futureStreetAddress').focus();
                    $('#futureAptUnit').val(data.Line2);
                    $('#futureAptUnit').focus();
                    $('#futureCity').val(data.City);
                    $('#futureCity').focus();
                    $('#futureStateSelected').text('WA');
                    $('#futureZipCode').val(data.PostalCode);
                    $('#futureZipCode').focus();
                    $('#divSelectFutureCountry').css('display', 'none');
                }
                else {
                    $('#futureDeliveryRegionShow').show();
                    $('#futureAttnToCare').val('');
                    $('#futureStreetAddress').val('');
                    $('#futureAptUnit').val('');
                    $('#futureCity').val('');
                    $('#futureZipCode').val('');
                }
            }
        },
        error: function (data) {
            console.log("Error: in getting the Future Service address");
        }
    });
});

$(".activateService").click(function () {

    if ($(this).has('.btn-invert-action').length !== 0) {
        $(this).html('');
        $(this).html('<i class="fa fa-check-circle"></i>Activated');
    }

    else if ($(this).has('.fa-check-circle').length !== 0) {
        $(this).html('');
        $(this).html('<a class="btn btn-invert-action">ACTIVATE</a>');
    }
});

var _getMoveInStartAndEndDate = function () {
    var apiUrl = '/api/CustomerService/GetMoveInDateRange';
    var todayDate = new Date();
    var maxDate = new Date();
    return $.ajax({
        url: apiUrl,
        type: 'POST',
        dataType: 'json',
        success: function success(data) {
            todayDate = new Date(parseInt(data.MoveInFromDate.substr(6)));
            todayDate = todayDate.getMonth() + 1 + '/' + todayDate.getDate() + '/' + todayDate.getFullYear();
            maxDate = new Date(parseInt(data.MoveInToDate.substr(6)));
            maxDate = maxDate.getMonth() + 1 + '/' + maxDate.getDate() + '/' + maxDate.getFullYear();
            $('#SelectedStartDate').datepicker({
                autoclose: true,
                startDate: todayDate,
                endDate: maxDate,
                beforeShowDay: function (date) {
                    var array = data.InvalidDates;
                    var string = formatDate(date);

                    if (array.indexOf(string) != -1) {
                        return false;
                    }
                    else {
                        return true;
                    }
                },
            });
        },
        error: function error(data) {
            throw Error('Unable to POST event to the service');
        }
    });
};

$('#SelectedStartDate').on('show', function (e) {
    console.debug('show', e.date, $(this).data('stickyDate'));
    if (e.date) {
        $(this).data('stickyDate', e.date); 3
    }
    else {
        $(this).data('stickyDate', null);
    }
});

$('#SelectedStartDate').on('hide', function (e) {
    console.debug('hide', e.date, $(this).data('stickyDate'));
    var stickyDate = $(this).data('stickyDate');

    if (!e.date && stickyDate) {
        console.debug('restore stickyDate', stickyDate);
        $(this).datepicker('setDate', stickyDate);
        $(this).data('stickyDate', null);
    }
});
function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return getMonth(date) + "/" + getDate(date) + "/" + date.getFullYear();
}
function getMonth(date) {
    var month = date.getMonth() + 1;
    return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}
function getDate(date) {
    var valDate = date.getDate();
    return valDate < 10 ? '0' + valDate : '' + valDate; // ('' + Date) for string result
}

//Check Account Information
$("#btnActInfo").click(function () {
    var nameOntheBill = $("#nameOnBill").val();
    var accountNumber = $("#accNumber").val();

    if (nameOntheBill == null || nameOntheBill == "") {
        $("#nameOntheBill").val("fill the name");
        return;
    }
    else if (accountNumber == null || accountNumber == "") {
        $("#accNumber").val("fill the account number");
        return;
    }
    else {
        $.ajax({
            url: "/api/CustomerService/AccountInformationNext",
            type: "POST",
            data: { nameOntheBill: nameOntheBill, accountNumber: accountNumber },
            success: function (data) {
                if (data != undefined || data != "") {
                }
            },
            error: function (data) {
                console.log("Error: in finding the account information");
            }
        });
    }
});


//Check Account Additional Information
$("#btnActAdditionalInfo").click(function () {
    var phoneNumber = $("#phone").val();
    var email = $("#contactEmail").val();
    var zipcode = $("#zipCode").val();

    if (phoneNumber == null || phoneNumber == "") {
        $("#phone").val("fill the number");
        return;
    }
    else if (email == null || email == "") {
        $("#contactEmail").val("fill the email");
        return;
    }
    else if (zipcode == null || zipcode == "") {
        $("#zipCode").val("fill the zip code");
        return;
    }
    else {
        $.ajax({
            url: "/api/CustomerService/AdditionalInformationNext",
            type: "POST",
            data: { phoneNumber: phoneNumber, email: email, zipcode: zipcode },
            success: function (data) {
                if (data != undefined || data != "") {
                }
            },
            error: function (data) {
                console.log("Error: in finding the account information");
            }
        });
    }
});

//Check Account Additional Information
$("#btnActAdditionalInfo").click(function () {
    var phoneNumber = $("#phone").val();
    var email = $("#contactEmail").val();
    var zipcode = $("#zipCode").val();

    if (phoneNumber == null || phoneNumber == "") {
        $("#phone").val("fill the number");
        return;
    }
    else if (email == null || email == "") {
        $("#contactEmail").val("fill the email");
        return;
    }
    else if (zipcode == null || zipcode == "") {
        $("#zipCode").val("fill the zip code");
        return;
    }
    else {
        $.ajax({
            url: "/api/CustomerService/AdditionalInformationNext",
            type: "POST",
            data: { phoneNumber: phoneNumber, email: email, zipcode: zipcode },
            success: function (data) {
                if (data != undefined || data != "") {
                }
            },
            error: function (data) {
                console.log("Error: in finding the additional information");
            }
        });
    }
});

var DisablePastDate = function () {
    //Disabling past date
    var now = new Date();
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);
    $('#startDate').attr('min', today);
}

$(document).on('click', '#AdditionAccount', function (e) {
    e.preventDefault();
    var form_data = {
        'FirstName': $('#firstName').val(),
        'MiddleName': $('#mi').val(),
        'LastName': $('#lastName').val(),
        'Email': $('#contactEmail').val(),
        'Phone.Type': $('#selectPhone').val(),
        'Phone.Number': $('#phone').val(),
        'Phone.Extension': $('#ext').val(),
        'RelationshipCategory': $('#relationType').val(),
    };
    $.ajax({
        url: "/api/CustomerService/AccountAdditionsNext",
        type: "POST",
        data: form_data,
        success: function (data) {

        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Error in Business Partner Search");
        }
    })
});

$("#startServiceSelection").click(function () {
    $.ajax({
        url: "/api/CustomerService/CustomerServiceLandingPage",
        type: "POST",
        success: function (data) {
            if (data != undefined && data != "") {
                $("#pushItUp").html('');
                $("#pushItUp").html(data);
            }
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("Error in getting the start service page");
        }
    })
});

$(document).ready(function () {

    $(".addFutureAddress").click(function () {
        var futureAddress = this.getAttribute('data-futureAddress');
        $("#futureAddress").val(futureAddress);
    });
})

$(document).ready(function () {
    $(".address-validation-radio").click(function () {
        var mailingAddress;
        if ($("input:radio[id='responseMailAddress']").is(":checked")) {
            mailingAddress = {
                'CareOf': $('#hdnResponseCareOf').val(),
                'Line1': $('#hdnResponseAddress1').val(),
                'Line2': $('#hdnResponseAddress2').val(),
                'City': $('#hdnResponseCity').val(),
                'State': $('#hdnResponseState').val(),
                'Country': $('#hdnResponseCountry').val(),
                'PostalCode': $('#hdnResponsePostalCode').val()
            };
        }
        else if ($("input:radio[id='enteredMailAddress']").is(":checked")) {
            mailingAddress = {
                'CareOf': $('#hdncurrentCareOf').val(),
                'Line1': $('#hdncurrentAddress1').val(),
                'Line2': $('#hdncurrentAddress2').val(),
                'City': $('#hdncurrentCity').val(),
                'State': $('#hdncurrentState').val(),
                'Country': $('#hdncurrentCountry').val(),
                'PostalCode': $('#hdncurrentPostalCode').val()
            };
        }

        $.ajax({
            url: "/api/CustomerService/SaveAddressInSession",
            type: "POST",
            data: { 'mailingAddress': mailingAddress },
            success: function (data) {
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Error in Save Mailing Address Next");
            }
        })
    });
})



$(document).ready(function () {
    $(".updateMailing").click(function () {
        var status;
        if ($("input:radio[id='redirectMailingAddress']").is(":checked")) {
            status = this.getAttribute('data-updateMailingAddress');
            $("#updateMailingAddress").val(status);
        }
        else if ($("input:radio[id='redirectOtherPages']").is(":checked")) {
            status = this.getAttribute('data-updateMailingAddress');
            $("#updateMailingAddress").val(status);
        }
    })
})

$(document).ready(function () {
    $(".mailing-address-radio").click(function () {
        var status;
        if ($("input:radio[id='forAllAccounts']").is(":checked")) {
            status = this.getAttribute('data-mailingAddress');
            $("#mailingAddress").val(status);
        }
        else if ($("input:radio[id='forThisAccounts']").is(":checked")) {
            status = this.getAttribute('data-mailingAddress');
            $("#mailingAddress").val(status);
        }
    })
})

$(function () {
    $('#identifierType').val('ZLAST4').change();
    $("#identifierType").change(function () {
        $("#identifierTypeName").val($('option:selected', this).text());
        $("#identifierTypeValue").val($('option:selected', this).val());
    });

    if ($('#PersonalIdentifier')) {
        if ($("#identifierTypeValue").val() == '') {
            // Assign initial drop down value to hidden variable
            $('#identifierTypeName').val($('#identifierType :selected').text());
            $("#identifierTypeValue").val($('#identifierType :selected').val());
        }
        else {
            // Set the drop down value to remember the previous choice
            $('#identifierType').val($("#identifierTypeValue").val()).change();
        }
    }
});

$(document).ready(function () {
    $(".customerType").click(function () {
        var selectedCustomerType = this.getAttribute('data-customertype');
        $("#selectedCustomerType").val(selectedCustomerType);
    });

    $(".buissinessType").click(function () {
        var selectedCustomerType = this.getAttribute('data-BuissinessType');
        $("#selectedBuissinessType").val(selectedCustomerType);
        var selectedBusinessTitle = this.getAttribute('data-BusinessTitle');
        $("#selectedBusinessDisplayName").val(selectedBusinessTitle);
    });

    $(".saveType").click(function () {
        var selectedUserType = this.getAttribute('data-selectedUserType');
        $("#selectedStartServiceType").val(selectedUserType);
    });
    $(".pmaselection").click(function () {
        var selectedPMA = this.getAttribute('data-selectedPMA');
        $("#selectedPmaOption").val(selectedPMA);
    });
    $(".customertypeselection").click(function () {
        var selectedLLCustomerType = this.getAttribute('data-selectedCustomerType');
        $("#selectedCustomerOption").val(selectedLLCustomerType);
    });
    $(".selectedaccountoptions").click(function () {
        var selectedAccOption = this.getAttribute('data-selectedAccountOption');
        $("#selectedAccountOption").val(selectedAccOption);
    });
    $(".selectCheckbox").click(function () {
        var isChecked = this.getAttribute('data-selected');
        $("#checkbox").val(isChecked);
    });
})



function checkSelection() {
    if ($("#selectedCustomerType").val() != undefined && $("#selectedCustomerType").val() != "") {
        return true;
    }

    if ($("#selectedStartServiceType").val() != undefined && $("#selectedStartServiceType").val() != "") {
        return true;
    }

    if ($("#selectedBuissinessType").val() != undefined && $("#selectedBuissinessType").val() != "") {
        return true;
    }
    if ($("#selectedPmaOption").val() != undefined && $("#selectedPmaOption").val() != "") {
        return true;
    }
    if ($("#selectedCustomerOption").val() != undefined && $("#selectedCustomerOption").val() != "") {
        return true;
    }
    if ($("#selectedAccountOption").val() != undefined && $("#selectedAccountOption").val() != "") {
        return true;
    }
    if ($("#checkbox").val() != undefined && $("#checkbox").val() != "") {
        return true;
    }
    return false;
}
$('#startDate').on('show', function (e) {
    console.debug('show', e.date, $(this).data('stickyDate'));
    if (e.date) {
        $(this).data('stickyDate', e.date); 3
    }
    else {
        $(this).data('stickyDate', null);
    }
});

$('#startDate').on('hide', function (e) {
    console.debug('hide', e.date, $(this).data('stickyDate'));
    var stickyDate = $(this).data('stickyDate');
    if (!e.date && stickyDate) {
        console.debug('restore stickyDate', stickyDate);
        $(this).datepicker('setDate', stickyDate);
        $(this).data('stickyDate', null);
    }
});
