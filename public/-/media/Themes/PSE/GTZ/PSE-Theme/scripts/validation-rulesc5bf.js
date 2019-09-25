$(document).ready(function(){
    jQuery.validator.addMethod("zipcode", function(value, element) {
        return this.optional(element) || /^\d{5}(?:-\d{4})?$/.test(value);
    }, "Please provide a valid zipcode");
    
    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-z]+$/i.test(value);
    }, "Please provide valid details");
    
    jQuery.validator.addMethod("address", function(value, element) {
        return this.optional(element) || /^[a-z\d\-_\s]+$/i.test(value);
    }, "Please provide valid details");
    
    jQuery.validator.addMethod("city", function(value, element) {
        return this.optional(element) || /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/i.test(value);
    }, "Please provide valid details");

    jQuery.validator.addMethod("numberninedigit", function(value, element) {
        return this.optional(element) || /^\d{9}(?:-\d{4})?$/.test(value);
    }, "Please provide valid details");
    jQuery.validator.addMethod("numbertwelvedigit", function(value, element) {
        return this.optional(element) || /^\d{12}(?:-\d{4})?$/.test(value);
    }, "Please provide valid details");
    $.validator.addMethod(
        'mail',
        function(value, element) {
            return this.optional(element) || /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\001-\010\013\014\016-\037!#-\[\]-\177]|\\[\001-\011\013\014\016-\177])*")@((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+(?:[A-Z]{2,6}\.?|[A-Z0-9-]{2,}\.?)$)|\[(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}\]$/i.test(value);
        },
        'Please provide valid email address.'
    );
    $.validator.addMethod('futureDate',function(value, element,targetDay) {
        var selectedDate = new Date(value);
        var futureDate= new Date();
        futureDate.setDate(new Date().getDate()+ targetDay[0]);
        futureDate.setHours(0);
        futureDate.setMinutes(0);
        futureDate.setSeconds(0);
        return this.optional(element) || futureDate > selectedDate;
    },'Please select date before 1 month');
    $.validator.addMethod('pastDate',function(value, element,targetDay) {
        var selectedDate = new Date(value);
        var futureDate= new Date();
        futureDate.setDate(new Date().getDate()- targetDay[0]);
        futureDate.setHours(0);
        futureDate.setMinutes(0);
        futureDate.setSeconds(0);
        return this.optional(element) || futureDate < selectedDate;
    },'Please select date after 6 month');
    
    $(".data-usphone-number").mask("(999) 999-9999");
    
    $(".data-usphone-number").on("blur", function() {
        $(this).valid();
        var last = $(this).val().substr($(this).val().indexOf("-") + 1);    
        if (last.length == 5) {
            var move = $(this).val().substr($(this).val().indexOf("-") + 1, 1);    
            var lastfour = last.substr(1, 4);    
            var first = $(this).val().substr(0, 9);    
            $(this).val(first + move + '-' + lastfour);
        }
    });

    $.validator.addMethod(
        'phoneUS', 
        function(phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 &&
            phone_number.match(/^\(?(\d{3})\)?[-\. ]?(\d{3})[-\. ]?(\d{4})( x\d{4})?$/);
        }, 
        'Please specify a valid phone number'
    );
    
    $.validator.addMethod("require_from_group", function(value, element, options) {
        var validator = this;
        var selector = options[1];
        var validOrNot = $(selector, element.form).filter(function() {
            return validator.elementValue(this);
        }).length >= options[0];
    
        if(!$(element).data('being_validated')) {
            var fields = $(selector, element.form);
            fields.data('being_validated', true);
            fields.valid();
            fields.data('being_validated', false);
        }
        return validOrNot;
    }, "Please fill at least {0} of these fields.");
    jQuery.validator.addMethod("nameOnBill", function (value, element) {
        return this.optional(element) || /^\S[a-zA-Z\s]*$/i.test(value);
    }, "Letters only please");
});
