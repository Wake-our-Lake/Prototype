(function($) {
    $(document).ready(function(){
        if ($("#wolPublicNoticeModal").length){
            $('#wolPublicNoticeModal').modal('show');
        }
    });
})(jQuery);

/*! jQuery Validation Plugin - v1.11.0 - 2/4/2013
 * https://github.com/jzaefferer/jquery-validation
 * Copyright (c) 2013 Jörn Zaefferer; Licensed MIT */

/*!
 * jQuery Validation Plugin 1.11.0
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-validation/
 * http://docs.jquery.com/Plugins/Validation
 *
 * Copyright 2013 Jörn Zaefferer
 * Released under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

(function() {

    function stripHtml(value) {
        // remove html tags and space chars
        return value.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
            // remove punctuation
            .replace(/[.(),;:!?%#$'"_+=\/\-]*/g, '');
    }
    jQuery.validator.addMethod("maxWords", function(value, element, params) {
        return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
    }, jQuery.validator.format("Please enter {0} words or less."));

    jQuery.validator.addMethod("minWords", function(value, element, params) {
        return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
    }, jQuery.validator.format("Please enter at least {0} words."));

    jQuery.validator.addMethod("rangeWords", function(value, element, params) {
        var valueStripped = stripHtml(value);
        var regex = /\b\w+\b/g;
        return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
    }, jQuery.validator.format("Please enter between {0} and {1} words."));

}());

jQuery.validator.addMethod("letterswithbasicpunc", function(value, element) {
    return this.optional(element) || /^[a-z\-.,()'"\s]+$/i.test(value);
}, "Letters or punctuation only please");

jQuery.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^\w+$/i.test(value);
}, "Letters, numbers, and underscores only please");

jQuery.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");

jQuery.validator.addMethod("nowhitespace", function(value, element) {
    return this.optional(element) || /^\S+$/i.test(value);
}, "No white space please");

jQuery.validator.addMethod("ziprange", function(value, element) {
    return this.optional(element) || /^90[2-5]\d\{2\}-\d{4}$/.test(value);
}, "Your ZIP-code must be in the range 902xx-xxxx to 905-xx-xxxx");

jQuery.validator.addMethod("zipcodeUS", function(value, element) {
    return this.optional(element) || /\d{5}-\d{4}$|^\d{5}$/.test(value);
}, "The specified US ZIP Code is invalid");

jQuery.validator.addMethod("zipcode", function(value, element) {
    return this.optional(element) || /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value);
}, "The specified US ZIP Code is invalid");

jQuery.validator.addMethod("zipcodeNew", function(value, element) {
    /// accepts 5 and 9 char
    return this.optional(element) || /^\d{5}(?:\d{4})?$/.test(value);
}, "The specified US ZIP Code is invalid");


jQuery.validator.addMethod("integer", function(value, element) {
    return this.optional(element) || /^-?\d+$/.test(value);
}, "A positive or negative non-decimal number please");

jQuery.validator.addMethod("alphaNumericSpace", function(value, element) {
    return this.optional(element) || /^[\w\-\s]+$/.test(value);
}, "Please enter valid alphanumeric Character");


// jQuery.validator.addMethod("password", function(value, element) {
// 	return this.optional(element) || /^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d^a-zA-Z0-9].{5,50}$/.test(value);
// }, "please make sure there is one number, one letter");
/**
 * Return true, if the value is a valid vehicle identification number (VIN).
 *
 * Works with all kind of text inputs.
 *
 * @example <input type="text" size="20" name="VehicleID" class="{required:true,vinUS:true}" />
 * @desc Declares a required input element whose value must be a valid vehicle identification number.
 *
 * @name jQuery.validator.methods.vinUS
 * @type Boolean
 * @cat Plugins/Validate/Methods
 */
jQuery.validator.addMethod("vinUS", function(v) {
    if (v.length !== 17) {
        return false;
    }
    var i, n, d, f, cd, cdv;
    var LL = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var VL = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 7, 9, 2, 3, 4, 5, 6, 7, 8, 9];
    var FL = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];
    var rs = 0;
    for (i = 0; i < 17; i++) {
        f = FL[i];
        d = v.slice(i, i + 1);
        if (i === 8) {
            cdv = d;
        }
        if (!isNaN(d)) {
            d *= f;
        } else {
            for (n = 0; n < LL.length; n++) {
                if (d.toUpperCase() === LL[n]) {
                    d = VL[n];
                    d *= f;
                    if (isNaN(cdv) && n === 8) {
                        cdv = LL[n];
                    }
                    break;
                }
            }
        }
        rs += d;
    }
    cd = rs % 11;
    if (cd === 10) {
        cd = "X";
    }
    if (cd === cdv) {
        return true;
    }
    return false;
}, "The specified vehicle identification number (VIN) is invalid.");

/**
 * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
 *
 * @example jQuery.validator.methods.date("01/01/1900")
 * @result true
 *
 * @example jQuery.validator.methods.date("01/13/1990")
 * @result false
 *
 * @example jQuery.validator.methods.date("01.01.1900")
 * @result false
 *
 * @example <input name="pippo" class="{dateITA:true}" />
 * @desc Declares an optional input element whose value must be a valid date.
 *
 * @name jQuery.validator.methods.dateITA
 * @type Boolean
 * @cat Plugins/Validate/Methods
 */
jQuery.validator.addMethod("dateITA", function(value, element) {
    var check = false;
    var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    if (re.test(value)) {
        var adata = value.split('/');
        var gg = parseInt(adata[0], 10);
        var mm = parseInt(adata[1], 10);
        var aaaa = parseInt(adata[2], 10);
        var xdata = new Date(aaaa, mm - 1, gg);
        if ((xdata.getFullYear() === aaaa) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === gg)) {
            check = true;
        } else {
            check = false;
        }
    } else {
        check = false;
    }
    return this.optional(element) || check;
}, "Please enter a correct date");

jQuery.validator.addMethod("dateNL", function(value, element) {
    return this.optional(element) || /^(0?[1-9]|[12]\d|3[01])[\.\/\-](0?[1-9]|1[012])[\.\/\-]([12]\d)?(\d\d)$/.test(value);
}, "Vul hier een geldige datum in.");

jQuery.validator.addMethod("time", function(value, element) {
    return this.optional(element) || /^([01]\d|2[0-3])(:[0-5]\d){1,2}$/.test(value);
}, "Please enter a valid time, between 00:00 and 23:59");
jQuery.validator.addMethod("time12h", function(value, element) {
    return this.optional(element) || /^((0?[1-9]|1[012])(:[0-5]\d){1,2}( ?[AP]M))$/i.test(value);
}, "Please enter a valid time in 12-hour format");



jQuery.validator.addMethod('validatePassword',  function (value)  {     
    return  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,}$/.test(value); 
},  'Please enter a valid Password.');

jQuery.validator.addMethod('validateSpecialCharacters',  function (value)  {     
    return  /[!@#$%^&*(),.?":{}|<>]/.test(value); 
},  'Please enter a valid Password.');

jQuery.validator.addMethod('usernameSpecialCharacters',  function (value)  {     
    return  /[#$%^&@!_.-]/.test(value); 
},  'Please enter a valid UserName with atleast one Special character.');
// ^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@!#$%^&*()_+-=?:]).*$

jQuery.validator.addMethod('passwordSpecialCharacters',  function (value)  { 
    return /^[A-Za-z0-9\-@!#$%^&*()_+=?:\w\s]*$/.test(value);     
    // return /[_\-!\@^: #$%^&*()+=?]/.test(value); 
},  'Please use valid characters');

jQuery.validator.addMethod('usernameAllowSpecialCharacters',  function (value)  {     
    //return  /[#$%^&@!_.-]/.test(value); 
    return  /^[ A-Za-z0-9#$%^&@!_.-\w\s]*$/.test(value); 
},  'Please enter a valid Special character only.');

jQuery.validator.addMethod('nameonBillSpecialCharacters',  function (value)  {     
    return  /^[A-Za-z0-9'&-\w\s]*$/.test(value); 
},  'Please enter a valid name.');
// ^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[@!#$%^&*()_+-=?:]).*$
// jQuery.validator.addMethod('passwordSpecialCharacters',  function (value)  {     
//     return /[^[_\-!\@^: #$%^&*()+=?]*|[`~{}\|<>,/;'"/\\\[\]]*]/.test(value) 
// },  'Please enter a valid Password with atleast one Special character');


$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var check = false;
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "No special Characters allowed here. Use only upper and lowercase letters (A through Z; a through z), numbers and punctuation marks (. , : ; ? ' ' \" - = ~ ! @ # $ % ^ & * ( ) _ + / < > { } )"
);

// jQuery.validator.addMethod("passwordSpecialCharacters", function( value, element ) {
//     var regex = new RegExp("^[_\-!\@^: #$%^&*()+=?]+$");
//     var key = value;

//     if (!regex.test(key)) {
//        return false;
//     }
//     return true;
// }, "please use only alphanumeric or alphabetic characters");





jQuery.validator.addMethod('validateEmail',  function (value)  {     
    return  /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(value); 
},  'Please enter a valid Email.');

// /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

/**
 * matches US phone number format
 *
 * where the area code may not start with 1 and the prefix may not start with 1
 * allows '-' or ' ' as a separator and allows parens around area code
 * some people may want to put a '1' in front of their number
 *
 * 1(212)-999-2345 or
 * 212 999 2344 or
 * 212-999-0983
 *
 * but not
 * 111-123-5434
 * and not
 * 212 123 4567
 */
jQuery.validator.addMethod("phoneUS", function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/);
}, "Please specify a valid phone number");

jQuery.validator.addMethod('phoneUK', function(phone_number, element) {
    phone_number = phone_number.replace(/\(|\)|\s+|-/g, '');
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:(?:\d{5}\)?\s?\d{4,5})|(?:\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3}))|(?:\d{3}\)?\s?\d{3}\s?\d{3,4})|(?:\d{2}\)?\s?\d{4}\s?\d{4}))$/);
}, 'Please specify a valid phone number');

jQuery.validator.addMethod('mobileUK', function(phone_number, element) {
    phone_number = phone_number.replace(/\s+|-/g, '');
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)7(?:[45789]\d{2}|624)\s?\d{3}\s?\d{3})$/);
}, 'Please specify a valid mobile number');

//Matches UK landline + mobile, accepting only 01-3 for landline or 07 for mobile to exclude many premium numbers
jQuery.validator.addMethod('phonesUK', function(phone_number, element) {
    phone_number = phone_number.replace(/\s+|-/g, '');
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[45789]\d{8}|624\d{6})))$/);
}, 'Please specify a valid uk phone number');
// On the above three UK functions, do the following server side processing:
//  Compare with ^((?:00\s?|\+)(44)\s?)?\(?0?(?:\)\s?)?([1-9]\d{1,4}\)?[\d\s]+)
//  Extract $2 and set $prefix to '+44<space>' if $2 is '44' otherwise set $prefix to '0'
//  Extract $3 and remove spaces and parentheses. Phone number is combined $2 and $3.
// A number of very detailed GB telephone number RegEx patterns can also be found at:
// http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_UK_Telephone_Numbers

//Matches UK postcode. based on http://snipplr.com/view/3152/postcode-validation/
jQuery.validator.addMethod('postcodeUK', function(postcode, element) {
    postcode = (postcode.toUpperCase()).replace(/\s+/g, '');
    return this.optional(element) || postcode.match(/^([^QZ][^IJZ]{0,1}\d{1,2})(\d[^CIKMOV]{2})$/) || postcode.match(/^([^QV]\d[ABCDEFGHJKSTUW])(\d[^CIKMOV]{2})$/) || postcode.match(/^([^QV][^IJZ]\d[ABEHMNPRVWXY])(\d[^CIKMOV]{2})$/) || postcode.match(/^(GIR)(0AA)$/) || postcode.match(/^(BFPO)(\d{1,4})$/) || postcode.match(/^(BFPO)(C\/O\d{1,3})$/);
}, 'Please specify a valid postcode');

// TODO check if value starts with <, otherwise don't try stripping anything
jQuery.validator.addMethod("strippedminlength", function(value, element, param) {
    return jQuery(value).text().length >= param;
}, jQuery.validator.format("Please enter at least {0} characters"));

// same as email, but TLD is optional
jQuery.validator.addMethod("email2", function(value, element, param) {
    return this.optional(element) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test(value);
}, jQuery.validator.messages.email);

// same as url, but TLD is optional
jQuery.validator.addMethod("url2", function(value, element, param) {
    return this.optional(element) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)*(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}, jQuery.validator.messages.url);

// NOTICE: Modified version of Castle.Components.Validator.CreditCardValidator
// Redistributed under the the Apache License 2.0 at http://www.apache.org/licenses/LICENSE-2.0
// Valid Types: mastercard, visa, amex, dinersclub, enroute, discover, jcb, unknown, all (overrides all other settings)
jQuery.validator.addMethod("creditcardtypes", function(value, element, param) {
    if (/[^0-9\-]+/.test(value)) {
        return false;
    }

    value = value.replace(/\D/g, "");

    var validTypes = 0x0000;

    if (param.mastercard) {
        validTypes |= 0x0001;
    }
    if (param.visa) {
        validTypes |= 0x0002;
    }
    if (param.amex) {
        validTypes |= 0x0004;
    }
    if (param.dinersclub) {
        validTypes |= 0x0008;
    }
    if (param.enroute) {
        validTypes |= 0x0010;
    }
    if (param.discover) {
        validTypes |= 0x0020;
    }
    if (param.jcb) {
        validTypes |= 0x0040;
    }
    if (param.unknown) {
        validTypes |= 0x0080;
    }
    if (param.all) {
        validTypes = 0x0001 | 0x0002 | 0x0004 | 0x0008 | 0x0010 | 0x0020 | 0x0040 | 0x0080;
    }
    if (validTypes & 0x0001 && /^(5[12345])/.test(value)) { //mastercard
        return value.length === 16;
    }
    if (validTypes & 0x0002 && /^(4)/.test(value)) { //visa
        return value.length === 16;
    }
    if (validTypes & 0x0004 && /^(3[47])/.test(value)) { //amex
        return value.length === 15;
    }
    if (validTypes & 0x0008 && /^(3(0[012345]|[68]))/.test(value)) { //dinersclub
        return value.length === 14;
    }
    if (validTypes & 0x0010 && /^(2(014|149))/.test(value)) { //enroute
        return value.length === 15;
    }
    if (validTypes & 0x0020 && /^(6011)/.test(value)) { //discover
        return value.length === 16;
    }
    if (validTypes & 0x0040 && /^(3)/.test(value)) { //jcb
        return value.length === 16;
    }
    if (validTypes & 0x0040 && /^(2131|1800)/.test(value)) { //jcb
        return value.length === 15;
    }
    if (validTypes & 0x0080) { //unknown
        return true;
    }
    return false;
}, "Please enter a valid credit card number.");

jQuery.validator.addMethod("ipv4", function(value, element, param) {
    return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
}, "Please enter a valid IP v4 address.");

jQuery.validator.addMethod("ipv6", function(value, element, param) {
    return this.optional(element) || /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i.test(value);
}, "Please enter a valid IP v6 address.");

/**
 * Return true if the field value matches the given format RegExp
 *
 * @example jQuery.validator.methods.pattern("AR1004",element,/^AR\d{4}$/)
 * @result true
 *
 * @example jQuery.validator.methods.pattern("BR1004",element,/^AR\d{4}$/)
 * @result false
 *
 * @name jQuery.validator.methods.pattern
 * @type Boolean
 * @cat Plugins/Validate/Methods
 */
jQuery.validator.addMethod("pattern", function(value, element, param) {
    if (this.optional(element)) {
        return true;
    }
    if (typeof param === 'string') {
        param = new RegExp('^(?:' + param + ')$');
    }
    return param.test(value);
}, "Invalid format.");


/*
 * Lets you say "at least X inputs that match selector Y must be filled."
 *
 * The end result is that neither of these inputs:
 *
 *  <input class="productinfo" name="partnumber">
 *  <input class="productinfo" name="description">
 *
 *  ...will validate unless at least one of them is filled.
 *
 * partnumber:  {require_from_group: [1,".productinfo"]},
 * description: {require_from_group: [1,".productinfo"]}
 *
 */
// jQuery.validator.addMethod("require_from_group", function(value, element, options) {
// 	var validator = this;
// 	var selector = options[1];
// 	var validOrNot = $(selector, element.form).filter(function() {
// 		return validator.elementValue(this);
// 	}).length >= options[0];

// 	if(!$(element).data('being_validated')) {
// 		var fields = $(selector, element.form);
// 		fields.data('being_validated', true);
// 		fields.valid();
// 		fields.data('being_validated', false);
// 	}
// 	return validOrNot;
// }, jQuery.format("Please fill at least {0} of these fields."));

/*
 * Lets you say "either at least X inputs that match selector Y must be filled,
 * OR they must all be skipped (left blank)."
 *
 * The end result, is that none of these inputs:
 *
 *  <input class="productinfo" name="partnumber">
 *  <input class="productinfo" name="description">
 *  <input class="productinfo" name="color">
 *
 *  ...will validate unless either at least two of them are filled,
 *  OR none of them are.
 *
 * partnumber:  {skip_or_fill_minimum: [2,".productinfo"]},
 *  description: {skip_or_fill_minimum: [2,".productinfo"]},
 * color:       {skip_or_fill_minimum: [2,".productinfo"]}
 *
 */
// jQuery.validator.addMethod("skip_or_fill_minimum", function(value, element, options) {
// 	var validator = this;
// 	var numberRequired = options[0];
// 	var selector = options[1];
// 	var numberFilled = $(selector, element.form).filter(function() {
// 		return validator.elementValue(this);
// 	}).length;
// 	var valid = numberFilled >= numberRequired || numberFilled === 0;

// 	if(!$(element).data('being_validated')) {
// 		var fields = $(selector, element.form);
// 		fields.data('being_validated', true);
// 		fields.valid();
// 		fields.data('being_validated', false);
// 	}
// 	return valid;
// }, jQuery.format("Please either skip these fields or fill at least {0} of them."));

// Accept a value from a file input based on a required mimetype
// jQuery.validator.addMethod("accept", function(value, element, param) {
// 	// Split mime on commas in case we have multiple types we can accept
// 	var typeParam = typeof param === "string" ? param.replace(/\s/g, '').replace(/,/g, '|') : "image/*",
// 	optionalValue = this.optional(element),
// 	i, file;

// 	// Element is optional
// 	if (optionalValue) {
// 		return optionalValue;
// 	}

// 	if ($(element).attr("type") === "file") {
// 		// If we are using a wildcard, make it regex friendly
// 		typeParam = typeParam.replace(/\*/g, ".*");

// 		// Check if the element has a FileList before checking each file
// 		if (element.files && element.files.length) {
// 			for (i = 0; i < element.files.length; i++) {
// 				file = element.files[i];

// 				// Grab the mimtype from the loaded file, verify it matches
// 				if (!file.type.match(new RegExp( ".?(" + typeParam + ")$", "i"))) {
// 					return false;
// 				}
// 			}
// 		}
// 	}

// 	// Either return true because we've validated each file, or because the
// 	// browser does not support element.files and the FileList feature
// 	return true;
// }, jQuery.format("Please enter a value with a valid mimetype."));

// // Older "accept" file extension method. Old docs: http://docs.jquery.com/Plugins/Validation/Methods/accept
// jQuery.validator.addMethod("extension", function(value, element, param) {
// 	param = typeof param === "string" ? param.replace(/,/g, '|') : "png|jpe?g|gif";
// 	return this.optional(element) || value.match(new RegExp(".(" + param + ")$", "i"));
// }, jQuery.format("Please enter a value with a valid extension."));
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
    
    $.validator.addMethod(
        'phoneUSA', 
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

//Additional article video modal

$(document).ready(function () {

    // Gets the video src from the data-src on each button

    var $videoSrc;
    $('.articlevideo-link').click(function () {
        $videoSrc = $(this).data("src");
    });
    

    // when the modal is opened autoplay it
    $('#articleModal').on('shown.bs.modal', function (e) {

        // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
        $("#video").attr('src', $videoSrc + "?rel=0&amp;showinfo=0&amp;modestbranding=1&amp;autoplay=1");
    })

    // stop playing the youtube video when I close the modal
    $('#articleModal').on('hide.bs.modal', function (e) {
        // a poor man's stop video
        $("#video").attr('src', $videoSrc);
    })
    // document ready
});


$(document).on('click', '.dropdown.mega-dropdown', function(e) {  
    $(this).addClass('open').siblings().removeClass('open');
});

function activeMenuSwitch(e){
    $('.sub-navigation .mega-dropdown').on('shown.bs.dropdown', function(){
        $(this).siblings().removeClass('open');
    });
    if(e){
        if(!$(e.target).hasClass('mega-dropdown-menu') || !$(e.target).parents('.mega-dropdown-menu').length){
            $('.dropdown-secondary').removeClass('open subMenuShow');
        }        
    }
}
function setHeight() {
    if ($(window).width() <= 991) {
        windowHeight = $(window).innerHeight();
        $('.dropdown-menu.mega-dropdown-menu').css('min-height', windowHeight);
    } else {
        $('.dropdown-menu.mega-dropdown-menu').css('min-height', '0');
    }
  };

$(window).on('resize',function () {
    setHeight();
});
$(window).on('load',function () {
    setHeight();
});

activeMenuSwitch();
$(document).on('click', function(e) { 
    activeMenuSwitch(e);
});
$(document).on('click', 'a[href]', function (e) {
	if ($(e.currentTarget).parents("#confirmationModal").hasClass('modal')) { return false; }
	var a = new RegExp('/' + window.location.host + '/');
	var chkValue = this.href;
	if(!isNativeURL(chkValue)){		
		if (this.href != "" && !a.test(this.href)) {
			e.preventDefault();
			$('#confirmationModal').find('.btn-ok').attr('href',$(this).attr('href'));
			$('#confirmationModal').css({ 'z-index': 9090 }).modal();			
		}		
	}
});
$(document).on('click', '#confirmationModal .btn-ok', function (e) {
	e.preventDefault();
	$('#confirmationModal').modal("hide");					
	window.open($(this).attr("href"));
	$(this).attr("href", "");			
	return false;
});
function isNativeURL(val){
	return val.indexOf("javascript") == 0 || val.indexOf("mailto") == 0 || val.indexOf("tel") == 0 || val.indexOf("ftp") == 0;
}
$(document).ready(function(){
	if($(".jumbotron.wol-banner").length > 0 || $(".wol-secondary-header").length > 0 || $(".article-banner").length > 0 || $(".article-lg-banner").length > 0 || $(".rebates-banner").length > 0 ) {
		$(".breadcrumb-wrap").hide();
	}
	if($(".wol-primary-nav").length > 0 && $(".progress-tracker").length > 0) {
		$(".breadcrumb-wrap").hide();
		$("main").css("margin-top","45px");
	}
	if($(".budget-payment-plan .user-account-info-wrapper").length > 0) {
		$(".budget-payment-plan .pagetitle h4").addClass("table-head");
	}
	if($(".wol-breadcrumb").length > 0) {
		$(".main-container, .top-container-settings").addClass("page-breadcrumb");
		$(".separator").css("padding-top","20px");
		if($('.mywol').length > 0) {
			$(".breadcrumb-wrap").addClass('bg-grey');
			$(".wol-panel").css("margin-top","0");
		}
	}		
	// if($(".carbon-banner").length > 0) {
	// 	$(".breadcrumb-wrap").css("height","74px");
	// }	
	if($(".wol-secondary-header").length > 0) {
		if($(".main-container").length > 0) {
			$(".main-container").addClass('secondary-main-container');
		}
	}		
});


var _primaryNav,
    _secondaryNav,
    _tempPrimary,
    _tempSecondary;
$(window).on('resize',function () {
    //console.log('resize');
    //swapmenu();
});
$(window).on('load',function () {
    //console.log('load');
    //swapmenu();
});
function swapmenu() { console.log('came');
    if ($(window).width() <= 991) {
        _primaryNav = $('.wol-primary-nav');
        _secondaryNav = $('.wol-secondary-nav');

        _tempPrimary = _primaryNav.clone();
        _tempSecondary = _secondaryNav.clone();

        if (!_secondaryNav.is(':empty')) {
            _primaryNav.replaceWith(_tempSecondary);
            _secondaryNav.replaceWith(_tempPrimary);
        }
    }
}
$('.search-initial').click(function() {
    $(this).hide();
    $('.wol-search-box').addClass('search-fullWidth');
    $('.search-items').show();
});
$('.search-items .search-close').click(function() {
    $('.search-items').hide();
    $('.wol-search-box').removeClass('search-fullWidth');
    $('.search-initial').show();
});

// $(document).on('click', '.sub-navigation li.mega-dropdown', function () {    
//     var  expDate  = new Date('9999, 12, 30');
//     if($(this).hasClass("residential")) {
//         $.cookie("RedirectionCookie","Residential",{ path: '/', expires: expDate });                    
//     }
//     if($(this).hasClass("business")) {
//         $.cookie("RedirectionCookie","Business",{ path: '/', expires: expDate });
//     }
// });

// function activateCurrentMenu(){    
//     var _accessToken = $.cookie("RedirectionCookie");    
//     if(_accessToken) {
//         if(_accessToken == "Residential"){
//             $(".residential").addClass("open");
//             $(".business").removeClass("open");
//         }
//         else if(_accessToken == "Business"){
//             $(".business").addClass("open");
//             $(".residential").removeClass("open");
//         }
//     }
// }

// $(document).ready(function(e){    
//     activateCurrentMenu();
// });
// Coveo Search  
function searchInitial(){
    if ($(window).width() <= 991) { 
        if ($(".wol-search-box .search-initial").length <= 0) {
            $(".wol-search-box ").prepend("<div class='search-initial visible-xs visible-sm'><label>SEARCH</label><i class='fa fa-search'></i></div>");
        }      
    }
}  
$(window).on('resize',function (e) {
    searchInitial()
});

$(document).ready(function(e){    
    searchInitial()
});
$(document).on('click', '.search-initial', function() {  
    if ($(window).width() <= 991) {     
        $(".wol-search-box").css('width','100%');   
        $(".wol-search-box .CoveoSearchButton").show();
        $(".wol-search-box .CoveoSearchbox .magic-box").show();
        $(".search-initial").hide();        
    }
});
$(document).on('click', '.magic-box-clear', function() {  
    if ($(window).width() <= 991) {        
        $(".wol-search-box .CoveoSearchbox .magic-box").hide();  
        $(".wol-search-box").css('width','75%');         
        $(".search-initial").show();
        $(".wol-search-box .CoveoSearchButton").hide();
    }
});
$(document).ready(function(){
  var windowWidth = $(window).width();
  if(windowWidth <= 768) //for iPad & smaller devices
    $(document).on('click', '.wol-footer-menus h6', function(e) {
        if($(this).hasClass("menus-open")){ 
            $(this).removeClass("menus-open");
            $(this).next("ul").hide(); 
        }
        else{
            $('.wol-footer-menus ul').hide();
            $('.wol-footer-menus h6').removeClass("menus-open");
            $(this).addClass("menus-open");
            $(this).next("ul").slideToggle();
        }
    });
}); 
 

// $(".jumbotron").each(function() {
//     var attr = $(this).attr('data-image-src');

//     if (typeof attr !== typeof undefined && attr !== false) {
//         $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr + ') center center');
//     }
// });
// $(".article-hero-banner").each(function() {
//     var attr = $(this).attr('data-image-src');

//     if (typeof attr !== typeof undefined && attr !== false) {
//         $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0), rgb(0, 0, 0)), url(' + attr + ') center bottom');
//     }
// });


/*Home & Artcile banner retina image implementation*/


$(function() {

    function isHighDensity() {
             var queryIpad = '(-webkit-min-device-pixel-ratio: 2),\
          (min--moz-device-pixel-ratio: 2),\
          (-o-min-device-pixel-ratio: 2),\
          (min-device-pixel-ratio: 2),\
          (min-resolution: 192dpi)';

             return (window.devicePixelRatio >= 2 && window.matchMedia('(min-width: 768px)').matches && window.matchMedia(queryIpad).matches);
    }
    function isRetina() {

             var query = '(-webkit-min-device-pixel-ratio: 2),\
          (min--moz-device-pixel-ratio: 2),\
          (-o-min-device-pixel-ratio: 2),\
          (min-device-pixel-ratio: 2),\
          (min-resolution: 192dpi)';

             return (window.devicePixelRatio >= 2 || (window.matchMedia && window.matchMedia(query).matches));
    }
function changeBg() {
   $('[data-img-src-desktop-normal]').each(function() {
           var attr_desk = $(this).attr('data-img-src-desktop-normal');
           if($(this).hasClass('no-bg-gradient')){
            
             if (isHighDensity()) {
                var attr_desk_high = $(this).attr('data-img-src-desktop-high');
                 if (attr_desk_high != '') {
                         $(this).css('background', 'url(' + attr_desk_high + ') center center');
                 } else {
                     $(this).css('background', 'url(' + attr_desk + ') center center');
                 }
             } else if (isRetina()) {
                var attr_mobile_high = $(this).attr('data-img-src-mobile-high');
                 if (attr_mobile_high != '') {
                         $(this).css('background', 'url(' + attr_mobile_high + ') center center');
                 } else {
                     $(this).css('background', 'url(' + attr_desk + ') center center');
                 }
  
             } else if ($(window).width() >= 768) {
                 var attr_desk = $(this).attr('data-img-src-desktop-normal');
                 if (attr_desk != '') {
                         $(this).css('background', 'url(' + attr_desk + ') center center');
                 } else {
                     $(this).css('background', 'url(' + attr_desk + ') center center');
                 }
             } else {
                var attr_mobile = $(this).attr('data-img-src-mobile-normal');
                 if (attr_mobile != '') {
                         $(this).css('background', 'url(' + attr_mobile + ') center center');
                 } else {
                     $(this).css('background', 'url(' + attr_desk + ') center center');
                 }
             }
           }else{
            if (isHighDensity()) {
                var attr_desk_high = $(this).attr('data-img-src-desktop-high');
                 if (attr_desk_high != '') {
                         $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_desk_high + ') center center');
                 } else {
                     $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_desk + ') center center');
                 }
             } else if (isRetina()) {
                var attr_mobile_high = $(this).attr('data-img-src-mobile-high');
                 if (attr_mobile_high != '') {
                         $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_mobile_high + ') center center');
                 } else {
                     $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_desk + ') center center');
                 }
  
             } else if ($(window).width() >= 768) {
                 var attr_desk = $(this).attr('data-img-src-desktop-normal');
                 if (attr_desk != '') {
                         $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_desk + ') center center');
                 } else {
                     $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_desk + ') center center');
                 }
             } else {
                var attr_mobile = $(this).attr('data-img-src-mobile-normal');
                 if (attr_mobile != '') {
                         $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_mobile + ') center center');
                 } else {
                     $(this).css('background', 'linear-gradient(rgba(255, 255, 255, 0) 40%, rgb(0, 0, 0)), url(' + attr_desk + ') center center');
                 }
             }
            
          
           }

       });
}
changeBg();



//responsive image for desktop & mobile view 
function changeResponsiveBg() {
    $('[data-img-src-desktop]').each(function() {
        var attr_desk = $(this).attr('data-img-src-desktop');
        if ($(window).width() >= 768) {
         
                var attr_desk = $(this).attr('data-img-src-desktop');
                if (attr_desk != '') {
                        $(this).css('background', 'url(' + attr_desk + ') center center');
                } else {
                    $(this).css('background', 'url(' + attr_desk + ') center center');
                }
        }
        else {
            var attr_mobile = $(this).attr('data-img-src-mobile');
             if (attr_mobile != '') {
                     $(this).css('background', 'url(' + attr_mobile + ') center center');
             } else {
                 $(this).css('background', 'url(' + attr_desk + ') center center');
             }
         }
        });
    }
    changeResponsiveBg();
       $(window).resize(function() {
           changeBg();
           changeResponsiveBg();
       });

});


$(document).ready(function () {
    $('#play-video').on('click', function (ev) {
        $("#video").show();
        $("#video")[0].src += "&autoplay=1";
        ev.preventDefault();
    });
});
// $(".jumbotron").css('background', function () {
//     var bg = ('url(' + $(this).data("image-src") + ') no-repeat center center fixed');
//     return bg;
// });

$(document).ready(function () {
    var actioncount = $(".call-to-action-item").length;
    //alert(actioncount); 
    if (actioncount == 5) {
        $(".call-to-action-item:first").parent().addClass("col-md-offset-1");
    }
    if (actioncount == 4) {
        $(".call-to-action-item:first").parent().addClass("col-md-offset-2");
    }
    if (actioncount == 3) {
        $(".call-to-action-item:first").parent().addClass("col-md-offset-3");
    }
    if (actioncount == 2) {
        $(".call-to-action-item:first").parent().addClass("col-md-offset-4");
    }
    if (actioncount == 1) {
        $(".call-to-action-item:first").parent().addClass("col-md-offset-5");
    }
});
$("#_logout").click(function () {

    Wollogout();
});
$("#_signout").click(function () {
    Wollogout();
});

$(".logInOut").click(function () {
    Wollogout();
});

function Wollogout() {
    
}

$("#_securitySubmit").click(function () {

    if ($('#createaccount-security-questions').valid()) {
        var encrypt1 = $('#firstSecurityQuestAnswertxt').val();
        var encode1 = escape(encrypt1);
        $('#firstSecurityQuestAnswer').val(encode1);
        var encoded1 = encode1.replace(/./g, '*'); //replacing with asterisck
        $('#firstSecurityQuestAnswertxt').val(encoded1);
        var encrypt2 = $('#secondSecurityQuestAnswertxt').val();
        var encode2 = escape(encrypt2);
        $('#secondSecurityQuestAnswer').val(encode2);
        var encoded2 = encode2.replace(/./g, '*'); //replacing with asterisck
        $('#secondSecurityQuestAnswertxt').val(encoded2);
        var encrypt3 = $('#thirdSecurityQuestAnswertxt').val();
        var encode3 = escape(encrypt3);
        $('#thirdSecurityQuestAnswer').val(encode3);
        var encoded3 = encode3.replace(/./g, '*'); //replacing with asterisck
        $('#thirdSecurityQuestAnswertxt').val(encoded3);
        var encrypt4 = $('#fourthSecurityQuestAnswertxt').val();
        var encode4 = escape(encrypt4);
        $('#fourthSecurityQuestAnswer').val(encode4);
        var encoded4 = encode4.replace(/./g, '*'); //replacing with asterisck
        $('#fourthSecurityQuestAnswertxt').val(encoded4);
        $('#createaccount-security-questions').validate().settings.ignore = "*";
    }

    var formdata = $("#createaccount-security-questions").serialize();

    $.ajax({
       
    });

    return false;
});
function eyeHide() {
    $('.toggle-password').toggleClass("fa-eye-slash fa-eye");
    var x = document.getElementById("Password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
// $(".toggle-password").click(function () {

//     $(this).toggleClass("fa-eye-slash fa-eye");
//     var input = $($(this).attr("toggle"));
//     if (input.attr("type") == "password") {
//         input.attr("type", "text");
//     } else {
//         input.attr("type", "password");
//     }
// });

//create account - contact information form Js


$(document).ready(function() {
    if ($("#create-account-form-containere .server-validation-error").val() == "") {
        $(".server-validation-error").css("margin-top", "0");
    }
    /*XXX------------for custom-select-----------XXX*/
    $(".custom-select").change(function() {
        var selectedOption = $(this).find(":selected").text();
        $(this).next(".option-textholder").text(selectedOption);
    }).trigger('change');

    $(".custom-select").each(function() {
        $(this).on({
            'focus': function() {
                $(this).parent().addClass('is-selected');
                if ($(this).val() == "") {
                    $(this).parent().next("label.floating-label").css({ 'color': '#006671' });
                } else if ($(this).val() != "") {
                    console.log("select val");
                    $(this).parent().next("label.floating-label").css({ 'color': '#006671' });
                }
            },
            'blur': function() {
                if ($('option:selected', this).text() == "") {
                    $(this).parent().removeClass('is-selected');
                }
                $(this).parent().next("label.floating-label").css({ 'color': '#717171' });
            }
        });
        if ($(this).parent().find('.option-textholder').text().length > 0) {
            $(this).parent().addClass('is-selected');
            $(this).parents().next("label.floating-label").css({ 'color': '#717171' });
        }

    });


    //for custom-textfield//
    $(".custom-textfield .form-control").each(function() {
        $(this).on({
            'focus': function() {
                $(this).siblings().addClass('is-text');
                $(this).next("label").css({ 'color': '#006671' });
            },
            'blur': function() {
                if ($(this).val() == "") {
                    $(this).siblings().removeClass('is-text');
                    $(this).next("label").css({ 'color': '#717171' });
                } else if ($(this).val() != "") {
                    $(this).next("label").css({ 'color': '#717171' });
                    // $(this).siblings().addClass('is-text');
                }
            }
        });
        if ($(this).val().length > 0) {
            $(this).siblings().addClass('is-text');
        }
        // else{
        //     $(this).siblings().removeClass('is-text');
        // }
    });


    // create account step indicator alignment.
    if ($(window).width() >= 768) {
        $('.form-progress-tracker').each(function(index, value) {
            var stepLength = $(this).find('.form-step').length;

            if (stepLength == 5) {
                $(this).parent('.step-indicator').addClass("col-md-12 col-md-offset-0");
            } else if (stepLength == 4) {
                $(this).parent('.step-indicator').addClass("col-md-10 col-md-offset-1");
            } else if (stepLength == 3) {
                $(this).parent('.step-indicator').addClass("col-md-8 col-md-offset-2");
            } else if (stepLength == 2) {
                $(this).parent('.step-indicator').addClass("col-md-6 col-md-offset-3");
            } else if (stepLength == 1) {
                $(this).parent('.step-indicator').addClass("col-md-4 col-md-offset-4");
            }
            // else{
            //     $(this).parent().removeClass().addClass("step-indicator");
            // }
        });
    }

});


$('ul.transformer-tabs li a').click(function() {
    if ($(this).parents('ul.transformer-tabs').hasClass('test')) {
        $(this).parents('ul.transformer-tabs').removeClass('test');
    } else {
        $(this).parents('ul.transformer-tabs').addClass('test');
    }
});

//*create account info security question select box filtering*//
$(function() {
    var security = $('.security-questions-content .custom-select');
    security.change(function() {
        $('.security-questions-content .custom-select span > option').unwrap();
        security.find('option').show().end().each(function() {
            $('option[value="' + $(this).val() + '"]:not(:selected):not([value=""])', security).wrap("<span>").parent().hide();
        });
    }).change();
});

$('.user-account-info-body').on('click', 'button', function(x) {

    var accountnumb = $(this).parents().closest('.account-info').find('.account-no').text();
    $("#txtAcctNumber").val(accountnumb);
    console.log('hello123');
});

/*copy paste restrict in password type field*/

// $(document).ready(function () {  // commentig as per bug number 2662
//     $('input[type=password]').bind('copy paste', function (e) {
//        e.preventDefault();
//     });
//  });
$('[data-authorised-detail] ul.nav li').click(function () {
    $('[data-authorised-detail] ul.nav li').removeClass('active');
    $(this).addClass('active');
});
if($(".load-datatable").length != 0) {
    $(function(){        
        renderBillingHistory();
        renderDocumentHistory();            
    }); 
    $('body').tooltip({
        selector: '[rel=tooltip]'
    });
    function showFilter(e, index) {      
        $("div[data-customfilter-dropdown] .errorMessage").hide();           
        var _th = $(e.target).parent();    
        var _targetFilter = _th.attr("data-filter");       
        var _thPos = _th.offset(); 
        var _thHight = _th.outerHeight();        
        $('div['+ _targetFilter+']').removeClass("hide").siblings("div[data-customfilter-dropdown]").addClass("hide");        
        $('div['+_targetFilter+']').width(_th.width());  
        $('div['+_targetFilter+']').css({ 'left': _thPos.left, 'top': (_thPos.top + _thHight) });                          
        e.stopPropagation();
    }
    function configFilter($this, colArray) {
        setTimeout(function () {
            var _tableName = $this[0].id;        
            $.each(colArray, function (i, arg) {                
                $('#' + _tableName + ' th:eq(' + arg + ')').append('<div class="fa fa-filter custom-filter" onclick="showFilter(event,\'' + _tableName + '_' + arg + '\')" ></div>');                                 
            });             
        });        
    }
    function amountrangefilter(colVal,minVal,maxVal){             
            $.fn.dataTable.ext.search.push(            
            function( settings, data, dataIndex ) {                
                var _iColumn = colVal;
                var _iMin = parseFloat($("#"+minVal).val()) * 1;            
                var _iMax = parseFloat($("#"+maxVal).val()) * 1;                       
                var _columnVal = data[_iColumn];
                _columnVal = _columnVal.replace("$","");
                _columnVal = _columnVal.replace(",","");
                var _iAmount = _columnVal * 1;             
                    
                    if ( isNaN(_iMin) && isNaN(_iMax) )
                    {
                        return true;
                    }
                    else if ( isNaN(_iMin) && _iAmount <= _iMax )
                    {
                        return true;
                    }
                    else if ( _iMin < _iAmount && isNaN(_iMax))
                    {
                        return true;
                    }
                    else if ( _iMin <= _iAmount && _iAmount <= _iMax )
                    {
                        return true;
                    }
                    return false;
            }
        );
    }
    function filterByDate(column, startDate, endDate) {               
         $.fn.dataTableExt.afnFiltering.pop();                                
            $.fn.dataTableExt.afnFiltering.push(
                function( oSettings, aData, iDataIndex ) {
                var _rowDate = normalizeDate(aData[column]);
                var _start,_end; 
                
                if(startDate && endDate) {
                    _start = normalizeDate(startDate);
                    _end = normalizeDate(endDate);
                    if (_start <= _rowDate && _rowDate <= _end) {
                    return true;
                    } else if (_rowDate >= _start && _end === '' && _start !== ''){
                    return true;
                    } else if (_rowDate <= _end && _start === '' && _end !== ''){
                    return true;
                    } else {
                    return false;
                    }
                }
            }
            );
    }
            
    var normalizeDate = function(dateString) {
        var _date = new Date(dateString);
        var _normalized = _date.getFullYear() + '' + (("0" + (_date.getMonth() + 1)).slice(-2)) + '' + ("0" + _date.getDate()).slice(-2);
        return _normalized;
    }  
         
    $("div[data-customfilter-dropdown]").click(function(e){
        e.stopPropagation();
    });
    $(document).click(function(){
        $("div[data-customfilter-dropdown]").addClass("hide");
    });    
    $('.wol-datatable th').click(function(e) {  
        if(!(e.target.tagName.toLowerCase() == "span")){
            e.stopImmediatePropagation();
        }
    });    
}
if($(".load-datatable").length != 0) {
    var _currentPage = location.pathname;
    _currentPage = _currentPage.split("/").pop().replace(".html","");
    if(_currentPage === "account-history" || _currentPage  === "document-history" || _currentPage  === "billing-and-payment-history"  || _currentPage === "" || _currentPage === "index" ) { 
        var _billingHistoryUrl = '../../../src/js/data/account-history/billing-and-payment-history1.json';
        var _documentHistoryUrl = '../../../src/js/data/account-history/document-history1.json';
        var _billingTransactionInfo = " _START_ - _END_ of _TOTAL_ transactions";
        var _billingTransactionFilterInfo = " ( filtered from _MAX_ entries )";        
        var _documentTransactionInfo = " _START_ - _END_ of _TOTAL_ transactions";
        var _documentTransactionFilterInfo  = " ( filtered from _MAX_ entries )";
        var _billingZeroRecordInfo = "No records available";
        var _billingEmptyRecordInfo = "";
        var _documentZeroRecordInfo = "No records available"; 
        var _documentEmptyRecordInfo = "";
        var _billingInsertUrl, _billingHistoryPdfUrl, _documentDownloadUrl;
        var _insertIconUrl= "/Content/wol/images/insert.png";
        var _billingSortValue = [4];
        var _documentSortValue = true;
        $("#select-account").on('change', function() {
            var _accountNumber = this.value;    
            _billingHistoryUrl = '../../../src/js/data/account-history/billing-and-payment-history'+ _accountNumber+'.json';
            _documentHistoryUrl = '../../../src/js/data/account-history/document-history'+ _accountNumber+'.json';
            renderBillingHistory();
            renderDocumentHistory();                
        });
}
var $billingHistory = $('#billing-history-table');     
var _billingDataLength = "", _searchString = "", _searchActivity = "", _filterLength = 0; 
var uniqueType = [], uniqueActivity = [], docFilterArr = [], payFilterArr = [];
var minAmount =  $('#minAmount').attr("id"),
    maxAmount = $('#maxAmount').attr("id");  
    function renderBillingHistory(){
        $.fn.dataTable.ext.errMode = 'none';
        $("div[data-customfilter-dropdown]").find('input[type=text]').val('');
        $.fn.dataTableExt.afnFiltering.length = 0;
        $("#billing-export-csv, #billing-history-table").removeClass("hide");                          
        $.ajax({
            url: _billingHistoryUrl,
            success:function(data) {                                
                if(data == null || data.billingPayment == null || data.billingPayment.length == 0) {            
                    $("#billing-export-csv, #billing-history-table").addClass("hide");                          
                }
                else {
                    _billingDataLength = data.billingPayment.length;
                }
            }
        });
        $billingHistory.DataTable({                       
            dom: 'Bfrtip',
            "destroy":true,
            "responsive": true,
            "autoWidth": false,               
            ajax: {
                url: _billingHistoryUrl,
                dataSrc: 'billingPayment',                
            },                                 
            "language": {
                "loadingRecords": "Please wait - loading...",                
                "zeroRecords": _billingZeroRecordInfo,
                "info": _billingTransactionInfo,
                "infoEmpty": _billingEmptyRecordInfo,
                "infoFiltered": _billingTransactionFilterInfo                
            },            
            "order": [[ 0, "desc" ]],    
            "aoColumnDefs": [
                { 'bSortable': false, 'aTargets': _billingSortValue },
                {
                    "aTargets": [ 2 ],
                "bVisible": false,
                "bSearchable": false
                }
            ],                  
            columns: [                                                              
                {                     
                    "data": "ConvertedActivityDate",
                    "sType": "date"                                  
                },
                {
                    "data":"ActivityType",
                    "render": function(data, type, row, meta) {
                        if(data) {
                            switch(data.toLowerCase()) {
                                case 'deferral' : 
                                    return '<p class="hidden">'+row.ActivityId+'</p>'+'<i class="activity-icon fa fa-clock-o"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;
                                case 'budgetbill' : 
                                    return '<p class="hidden">'+row.ActivityId+'</p>'+'<i class="activity-icon fa fa-money"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;
                                case 'payment' : 
                                    return '<p class="hidden">'+row.ActivityId+'</p>'+'<i class="activity-icon fa fa-check"></i><a class="activity-data pay-link"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;
                                case 'billing' : 
                                    return '<p class="hidden">'+row.ActivityId+'</p>'+'<i class="activity-icon fa fa-dollar"></i><a class="activity-data pay-link"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break; 
                                case 'paymentarrangement' : 
                                    return '<p class="hidden">'+row.ActivityId+'</p>'+'<i class="activity-icon fa fa-handshake-o"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;                           
                                default  : 
                                    return '';
                            }
                        }                        
                    }
                },
                {
                    "data":"ActivityType",
                    "render": function(data, type, row, meta) {
                        if(data) {
                            switch(data.toLowerCase()) {
                                case 'deferral' : 
                                    return '<i class="activity-icon fa fa-clock-o"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;
                                case 'budgetbill' : 
                                    return '<i class="activity-icon fa fa-money"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;
                                case 'payment' : 
                                    return '<i class="activity-icon fa fa-check"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;
                                case 'billing' : 
                                    return '<i class="activity-icon fa fa-dollar"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break; 
                                case 'paymentarrangement' : 
                                    return '<i class="activity-icon fa fa-handshake-o"></i><a class="activity-data"><span>'+ row.DocumentType + '</span><i class="mobile-icon fa fa-angle-right"></i></a>';
                                    break;                           
                                default  : 
                                    return '';
                            }
                        }                        
                    }
                },
                {                    
                    "data":"Amount",
                    "render": function(data, type, row, meta) {                                          
                        return commaSeparateNumber(row.Amount);
                   }
                },                                
                {
                    "data":"BillPdfUrl",
                    "render": function(data, type, row, meta) {
                        var pdfURL = "", insertURL = "";
                        if (data) {
                            pdfURL =  '<a target="_blank" class="download-bill" href='+ data +'><i class="fa fa-file-pdf-o"></i>Bill PDF</a>';
                        }                        
                        if (row.InsertUrl) {
                            insertURL = '<a target="_blank" class="open-inserturl" href='+ row.InsertUrl +'><img src='+_insertIconUrl+' alt="insert" />Insert</a>';
                        }                        
                        return pdfURL+insertURL;

                    },
                    className:"hidden-xs"
                }                        
            ],                  
            initComplete: function (settings, json) {                    
                $("#billing-history-table .custom-filter").remove();
                configFilter(this, [0,1,2]);                         
                this.api().columns(1).every( function () {                                  
                    $('div[data-activity-filter] select').remove();
                    var select = $('<select class="form-control" aria-label="activityfilter"><option value="">Select One..</option></select>')
                    .insertAfter( $('div[data-activity-filter] .filter-header'));                    
                    var columnName = $(this.header()).text().replace(/\s+/g, "_");  
                    for(var d = 0;d<json.billingPayment.length;d++) {
                        var  _activityType = json.billingPayment[d].ActivityType
                        if( _activityType !== "" && _activityType !== null) {                         
                            var uniqueData = _activityType.toLowerCase();
                            uniqueActivity.push(uniqueData); 
                            uniqueActivity =  $.unique(uniqueActivity);
                        }
                    }                  
                    
                    for(var i = 0; i < uniqueActivity.length; i++) {   
                        var _activityValue;       
                        if(uniqueActivity[i] === "billing"){
                            _activityValue = "Activity_0";
                        }
                        else if(uniqueActivity[i] === "payment"){
                            _activityValue = "Activity_1";
                        }     
                        else if(uniqueActivity[i] === "paymentarrangement"){
                            _activityValue = "Activity_2";
                        }                         
                        else if(uniqueActivity[i] === "budgetbill"){
                            _activityValue = "Activity_3";
                        }
                        else {
                            _activityValue = "";
                        }                                                
                        select.append( '<option value="'+ _activityValue +'" id="'+ columnName+"_"+i +'">'+ uniqueActivity[i] +'</option>' );
                    }      
                    uniqueActivity = [];              
                });                               
            },
            buttons: [{
                extend: 'csv',
                className:"hide",                            
                filename:"wol billing and payment history",
                exportOptions: {                    
                    columns: [0,2,3]
                }
            }],
            drawCallback: function() {    
                $('#billing-load-more').toggle(this.api().page.hasMore());
            }                       
        }); 
    }   
    $('#billing-export-csv').on('click', function(){          
        $billingHistory.parent("div").find(".buttons-csv").click();
    });
    $('#billing-load-more').on('click', function(){              
        $billingHistory.DataTable().page.loadMore();
    });        
    $('[data-update-activity]').on('click', function(e){
        e.preventDefault();
        _searchActivity = "";
        _searchActivity = $(this).parents("div[data-activity-filter]").find('select').val();              
        $billingHistory.DataTable().column(1).search(
            _searchActivity,
            true, false
        ).draw();                    
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');                
        billingFilterResult(e);     
    });   
    $('[data-update-amount]').on( "click",function(e){   
        var minVal = $("#minAmount").val(),
            maxVal = $("#maxAmount").val();
        if(!minVal) {
            $('#minAmount').next('.errorMessage').show();
        }
        else {
            $('#minAmount').next('.errorMessage').hide();
        }
        if(!maxVal) {
            $('#maxAmount').next('.errorMessage').show();
        }
        else {
            $('#maxAmount').next('.errorMessage').hide();
        }
        if(minVal && maxVal) {
            amountrangefilter(3,minAmount,maxAmount);
            $(this).parents("div[data-customfilter-dropdown]").addClass('hide'); 
            $billingHistory.DataTable().draw();  
            billingFilterResult(e);
        }     
    }); 
    $('[data-update-activitydate]').on('click', function(e){ 
        var startDate = $('#billingFromDate input[type=text]').val(),
            endDate = $('#billingToDate input[type=text]').val();         
        if(!startDate) {
            $('#billingFromDate').next('.errorMessage').show();
        }
        else {
            $('#billingFromDate').next('.errorMessage').hide();
        }
        if(!endDate) {
            $('#billingToDate').next('.errorMessage').show();
        }
        else {
            $('#billingToDate').next('.errorMessage').hide();
        }
        if(startDate && endDate) {
            if($("#minAmount").val() && $("#maxAmount").val()) {
                $('[data-update-amount]').click();
            }
            filterByDate(0, startDate, endDate);             
            $(this).parents("div[data-customfilter-dropdown]").addClass('hide');                         
            $billingHistory.DataTable().draw();
            billingFilterResult(e);
        }
    });
    
    $('.clear-billing-date').on('click',function(e){
        e.preventDefault();            
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');
        $(this).parents("div[data-customfilter-dropdown]").find('input[type=text]').val('');                              
        $.fn.dataTableExt.afnFiltering.length = 0;
        $('[data-update-activity]').click();
        if($("#minAmount").val() && $("#maxAmount").val()) {
            $('[data-update-amount]').click();
        }
        $('[data-update-activity]').click();
        $billingHistory.DataTable().draw();        
        _filterLength = $billingHistory.DataTable().rows( { filter : 'applied'} ).nodes().length;
        if(_billingDataLength == _filterLength) {
            _searchActivity = "";_searchString = "";
            billingFilterResult(e);
        }
    }); 
    $('.clear-activity').on('click',function(e){        
        e.preventDefault();            
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');        
        $(this).parents("div[data-customfilter-dropdown]").find('select').val('');        
        $billingHistory.DataTable().column(1).search('', true, false).draw();       
        $billingHistory.dataTable().fnDraw(); 
        _filterLength = $billingHistory.DataTable().rows( { filter : 'applied'} ).nodes().length;
        if(_billingDataLength == _filterLength) {
            _searchActivity = "";_searchString = "";
            billingFilterResult(e);
        }              
    });
    $('.clear-amount').on('click',function(e){
        e.preventDefault();            
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');
        $(this).parents("div[data-customfilter-dropdown]").find('input[type=text]').val('');                
        amountrangefilter(3,minAmount,maxAmount);       
        $billingHistory.DataTable().draw();
        _filterLength = $billingHistory.DataTable().rows( { filter : 'applied'} ).nodes().length;
        if(_billingDataLength == _filterLength) {
            _searchActivity = "";_searchString = "";
            billingFilterResult(e);
        }
    });    
    $('.clear-payment').on('click',function(e){        
        e.preventDefault();            
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');               
        $(this).parents("div[data-customfilter-dropdown]").find('input:checkbox').each(function (index, checkbox) {
            if (checkbox.checked) {
                checkbox.checked = false;
            }
        });                    
        $billingHistory.DataTable().column(4).search('', true, false).draw();  
        $billingHistory.dataTable().fnDraw();    
        _filterLength = $billingHistory.DataTable().rows( { filter : 'applied'} ).nodes().length;
        if(_billingDataLength == _filterLength) {
            _searchActivity = "";_searchString = "";
            billingFilterResult(e);
        }        
    });
    $('[data-customfilter-dropdown] .close-menu').on( "click",function(e){
        e.stopPropagation();        
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');
    });    
    
    $('#billingFromDate,#billingToDate').datepicker({        
        format:"mm/dd/yy",
        autoclose: true
    }); 
}
function amountValidate(e){
    var regex = new RegExp("^[0-9-.\b]+$");
    var key = String.fromCharCode(!e.charCode ? e.which : e.charCode);             
    if(!((e.keyCode == 37 && e.which == 0) || (e.keyCode == 39 && e.which == 0) || (e.keyCode == 46 && e.which == 0) || e.keyCode ==9)){
       if(!regex.test(key)){
          return false;      
       }        
    }
}
function billingFilterResult(e){
    var _filterArr = [], _filterData = [], _uniqueFilterData = [], _targetfilter = ""; 
    _targetfilter = $(e.target.attributes)[1].name;        
    $billingHistory.DataTable().rows( { search:'applied' } ).data().each(function(value, index) {
        _filterArr.push(value);            
    });        
    if (_targetfilter === "data-update-amount" || _targetfilter === "data-update-payment" || _targetfilter === "data-update-activitydate" || _targetfilter === "data-clear-filter") {
        $('div[data-activity-filter] select').remove();    
        var select = $('<select class="form-control" aria-label="activityfilter"><option value="">Select One..</option></select>')
                        .insertAfter( $('div[data-activity-filter] .filter-header'));
        for(var _i = 0; _i < _filterArr.length; _i++) {
            if(_filterArr[_i].ActivityType !== "" && _filterArr[_i].ActivityType !== null) {
                _filterData.push((_filterArr[_i].ActivityType).toLowerCase());      
            }              
        }
        for(var _j=0; _j < _filterData.length; _j++){
            if(_uniqueFilterData.indexOf(_filterData[_j]) == -1)
            _uniqueFilterData.push(_filterData[_j]);  
        }
        for(var _k = 0; _k < _uniqueFilterData.length; _k++) { 
            var _filterValue;       
            if(_uniqueFilterData[_k] === "billing"){
                _filterValue = "Activity_0";
            }
            else if(_uniqueFilterData[_k] === "payment"){
                _filterValue = "Activity_1";
            }     
            else if(_uniqueFilterData[_k] === "paymentarrangement"){
                _filterValue = "Activity_2";
            }             
            else if(_uniqueFilterData[_k] === "budgetbill"){
                _filterValue = "Activity_3";
            }
            else {
                _filterValue = "";
            }         
            select.append('<option value="'+ _filterValue +'" id="'+"DocumentType_"+ _k +'">'+ _uniqueFilterData[_k] +'</option>' )
        }       
        $('div[data-activity-filter] select').val(_searchActivity);        
        _filterData.pop(); _uniqueFilterData.pop();
    }        
}


$(document).on('click', '.download-bill', function(e) {
    e.preventDefault();    
    var _billingPdfUrl;
    _billingPdfUrl = $(this).attr("href");
    window.open(_billingHistoryPdfUrl + _billingPdfUrl, "_blank");
});

$(document).on('click', '.open-inserturl', function(e) {
    e.preventDefault();   
    var _billingInsertPdfUrl;
    _billingInsertPdfUrl = $(this).attr("href");   
    window.open(_billingInsertUrl + _billingInsertPdfUrl, "_blank");
});


$(document).on('click', '.activity-data', function(e) {    
    if ($(window).width() <= 767) {
        tableMobileView(e,$billingHistory);
    }
});
function tableMobileView(e,targetTable){    
    var data = targetTable.DataTable().row( e.target.closest('tr') ).data();    
    var _mblArray = [], _mblth = [];
    var _thcount = targetTable.DataTable().columns().header().length;
    for(var i=0;i<_thcount;i++){        
        var theadtxt = $(targetTable.DataTable().columns(i).header()).text().replace(/\s+/g, "") 
        if( theadtxt != "ActivityType") {
        _mblth.push(theadtxt);
        }
    }            
    if(data.ConvertedActivityDate != null) {
    _mblArray.push(data.ConvertedActivityDate);
    }
    else{
        _mblArray.push("");
    }
    if(data.DocumentType != null) {
    _mblArray.push(data.DocumentType);
    }
    else{
        _mblArray.push("");
    }
    
    var _billAmount = data.Amount;
    if(_billAmount >= 0) {
        _billAmount =  "$" + _billAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
    }
    else {
        _billAmount = _billAmount.toLocaleString(undefined, {minimumFractionDigits: 2});
        _billAmount = _billAmount.replace("-","-$"); 
    }
    _mblArray.push(_billAmount);    
    var mpdfURL = "", minsertURL = "";
    if (data.BillPdfUrl) {
        mpdfURL =  '<a target="_blank" class="download-bill" href='+ data.BillPdfUrl +'><i class="fa fa-file-pdf-o"></i>Bill PDF</a>';
    }                        
    if (data.InsertUrl) {
        minsertURL = '<a target="_blank" class="open-inserturl" href='+ data.InsertUrl +'><img src='+_insertIconUrl+' alt="insert" />Insert</a>';
    }    

    _mblArray.push(mpdfURL + minsertURL);
    
    var _mbllist = "";
    for(var j = 0; j<_mblArray.length;j++) {
        _mbllist += '<li><span>'+_mblth[j]+'</span><span>' + _mblArray [j]+ '</span></li>';
    }
    var _mobileData = '<div class="col-sm-12 list-view-data"><a class="back-btn"><i class="fa fa-angle-left"></i>Back</a><ul>' +
    _mbllist +     '</ul></div>';
    _mblArray.pop();
    $(".wol-datatable").hide(500);
    $("#billing-history-wrapper").append(_mobileData);
}
$(document).on('click', '.back-btn', function(e) {
    $(".wol-datatable").show(500);    
    $(".list-view-data").hide(500);
    $(".list-view-data").remove();
});



if($(".load-datatable").length != 0) {    
var $documentHistorytable = $('#document-history-table');    
// var _documentHistoryUrl = '../../src/js/data/account-history/document-history1.json';
// var _documentTransactionInfo = " _START_ - _END_ of _TOTAL_ transactions";
// var _documentTransactionFilterInfo  = " ( filtered from _MAX_ entries )";
var _uniqueDocument = [], _searchAddress = "", _searchDoc = "", _counter = 0, _documentDataLength = "",_filterLength = 0; 
    function renderDocumentHistory(){
        $.fn.dataTable.ext.errMode = 'none';
        $("div[data-customfilter-dropdown]").find('input[type=text]').val('');
        $.fn.dataTableExt.afnFiltering.length = 0;
        $("#document-history-wrapper").removeClass("hide");      
        $("#no-document-history").addClass("hide");
        $.ajax({
            url: _documentHistoryUrl,
            success:function(data) {                
                if(data == null || data.documentHistory == null || data.documentHistory.length == 0) {            
                    $("#document-history-wrapper").addClass("hide");      
                    $("#no-document-history").removeClass("hide");                    
                }
                else {
                    _documentDataLength = data.documentHistory.length;     
                }
            }
        });
        $documentHistorytable.DataTable({
            dom: 'Bfrtip',
            "responsive": true,   
            "destroy":true,
            ajax: {
                url: _documentHistoryUrl,
                dataSrc: 'documentHistory',
                processing: true,
            },                     
            "language": {     
                "loadingRecords": "Please wait - loading...",                           
                "zeroRecords": _documentZeroRecordInfo,
                "info": _documentTransactionInfo,
                "infoEmpty": _documentEmptyRecordInfo,                
                "infoFiltered": _documentTransactionFilterInfo
            },
            "order": [[ 1, "desc" ]],     
            "aoColumnDefs": [
                { 'bSortable': _documentSortValue, 'aTargets': [0,1] }
            ],                   
            columns: [
                {                    
                    "data":"DocumentType",
                    "render": function(data, type, row, meta) {
                        if(row.DocumentUrl!="")
                        {
                            return '<a target="_blank" class="download-doc" href="'+row.DocumentUrl+'"><i class="fa fa-file-pdf-o"></i>'+data+'</a>';
                        }
                        else
                        {
                            return '<div><i class="fa fa-file-pdf-o"></i>'+data+'</div>';
                        }
                    }
                },                                               
                {                     
                    "data": "ConvertedDate",
                    "sType": "date"                                      
                }                       
            ],         
            initComplete: function (settings, json) {
                $("#document-history-table .custom-filter").remove();
                configFilter(this, [0,1]);                
                this.api().columns(0).every( function () {                   
                    var column = this;
                    var columnName = $(this.header()).text().replace(/\s+/g, "_");                    
                    $('div[data-document-filter] .checkbox').remove();                      
                    column.data().unique().sort().each( function ( d, j ) {
                        if(d !== "" && d !== null) {                             
                            var _uniqueData = d.toLowerCase();                            
                            _uniqueDocument.push(_uniqueData); 
                            _uniqueDocument =  $.unique(_uniqueDocument);
                        }                                                
                    });                                      
                    
                    for(var i = 0; i < _uniqueDocument.length; i++) {                                                      
                        var _documentCount = $documentHistorytable.DataTable().column(0).data().filter( function (value, index) {
                            value = value.toLowerCase();
                            return value == _uniqueDocument[i] ? true : false;
                        }).length;                              
                        $('div[data-document-filter] .filter-header').after( '<div class="checkbox"><label for="' + columnName+"_"+i + '"><input type="checkbox" value="' + _uniqueDocument[i] + '" id="' + columnName+"_"+i +'" />' + _uniqueDocument[i] +"(" + _documentCount + ")"+'</label></div>' );                        
                    } 
                    _uniqueDocument = [];
                });                 
            },
            buttons: [{
                extend: 'csv',
                className: "hide",                
                filename:"document history",                
            }],
            drawCallback: function(){
                $('#document-load-more').toggle(this.api().page.hasMore());
            }                       
        }); 
    }       
    $('#document-export-csv').on('click', function(){  
        $documentHistorytable.parent("div").find(".buttons-csv").click();
    });
    $('[data-customfilter-dropdown] .close-menu').on( "click",function(e){
        e.stopPropagation();        
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');
    });
    $('#document-load-more').on('click', function(){              
        $documentHistorytable.DataTable().page.loadMore();
    });            
    $('[data-update-document]').on('click', function(e){            
        e.preventDefault();         
        _searchDoc = ""; _counter = 0;   
        $(this).parents("div[data-document-filter]").find('input:checkbox').each(function (index, checkbox) {
            if (checkbox.checked) {
                _searchDoc += (_counter == 0) ? checkbox.value : '|' + checkbox.value;
                _counter++;
            }
        });                        
        $documentHistorytable.DataTable().column(0).search(_searchDoc,
            true, false
        ).draw();           
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');
        documentFilterResult(e);
    });
    $('[data-update-datefilter]').on('click', function(e){            
        var fromDate = $('#fromDate input[type=text]').val(),
            toDate = $('#toDate input[type=text]').val();       
        if(!fromDate) {
            $('#fromDate').next('.errorMessage').show();
        }
        else {
            $('#fromDate').next('.errorMessage').hide();
        }
        if(!toDate) {
            $('#toDate').next('.errorMessage').show();
        }
        else {
            $('#toDate').next('.errorMessage').hide();
        }   
        if(fromDate && toDate) {           
            filterByDate(1, fromDate, toDate);                                     
            $(this).parents("div[data-customfilter-dropdown]").addClass('hide');
            $documentHistorytable.DataTable().draw(); 
            documentFilterResult(e);     
        }     
    });
    $('.clear-document').on('click',function(e){
        e.preventDefault();            
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');        
        $(this).parents("div[data-customfilter-dropdown]").find('input:checkbox').each(function (index, checkbox) {
            if (checkbox.checked) {
                checkbox.checked = false;
            }
        });            
        $documentHistorytable.DataTable().column(0).search('', true, false).draw();        
        $documentHistorytable.DataTable().draw(); 
        _filterLength = $documentHistorytable.DataTable().rows( { filter : 'applied'} ).nodes().length;
        if(_documentDataLength == _filterLength) {
            _searchDoc = "";
            documentFilterResult(e);
        }
    });
    $('.clear-document-date').on('click',function(e){
        e.preventDefault();            
        $(this).parents("div[data-customfilter-dropdown]").addClass('hide');
        $(this).parents("div[data-customfilter-dropdown]").find('input[type=text]').val('');
        $.fn.dataTableExt.afnFiltering.length = 0;                   
        $('[data-update-document]').click();
        $documentHistorytable.DataTable().draw();
        _filterLength = $documentHistorytable.DataTable().rows( { filter : 'applied'} ).nodes().length;
        if(_documentDataLength == _filterLength) {
            _searchDoc = "";
            documentFilterResult(e);
        }
    });     
          
    $('#fromDate,#toDate').datepicker({        
        format:"mm/dd/yy",
        autoclose: true
    }); 
}
function documentFilterResult(e){
    var _filterArr = [], _filterData = [], _uniqueFilterData = [], _targetfilter = ""; 
    _targetfilter = $(e.target.attributes)[1].name;        
    $documentHistorytable.DataTable().rows( { search:'applied' } ).data().each(function(value, index) {
        _filterArr.push(value);            
    });     
    if( _targetfilter === "data-update-datefilter" || _targetfilter === "data-clear-filter") {
        $('div[data-document-filter] .checkbox').remove();          
        for(var _i = 0; _i < _filterArr.length; _i++) {      
            if(_filterArr[_i].DocumentType !== "" && _filterArr[_i].DocumentType !== null) {          
                _filterData.push((_filterArr[_i].DocumentType).toLowerCase());   
            }
        }         
        for(var _j = 0; _j < _filterData.length; _j++){
            if(_uniqueFilterData.indexOf(_filterData[_j]) == -1)
            _uniqueFilterData.push(_filterData[_j]);  
        } 
        for(var _k = 0; _k < _uniqueFilterData.length; _k++) {  
            var _filterdocCount = $documentHistorytable.DataTable().column(0, { search:'applied' } ).data().filter(function(value, index) {                
                value = value.toLowerCase();
                return value == _uniqueFilterData[_k] ? true : false;
            }).length;          
            $('div[data-document-filter] .filter-header').after( '<div class="checkbox"><label for="' +"DocumentType_"+ _k + '"><input type="checkbox" value="' + _uniqueFilterData[_k] + '" id="' +"DocumentType_" + _k +'" />' + _uniqueFilterData[_k] +'(' + _filterdocCount + ')' + '</label></div>' );
        }
        var _strDocArr = _searchDoc.split("|");    
        for (var _l = 0; _l < _strDocArr.length; _l++) {                  
            $('div[data-document-filter]').find('input[type=checkbox][value="'+ _strDocArr[_l] +'"]').prop('checked', true);    
        }  
        _filterData.pop(); _uniqueFilterData.pop();
    }
}

$(document).on('click', '.download-doc', function(e) {
    e.preventDefault();    
    var _documentpdfUrl;
    _documentpdfUrl = $(this).attr("href");    
    window.open(_documentDownloadUrl + _documentpdfUrl, "_blank");    
});


$(document).ready(function () {
    // sitecore has to comment this line var _manageAccountApiUrl
    // var _accountSelectorUrl = '../../../src/js/data/account-selector/document-history2.json';
       if(typeof _accountSelectorUrl != "undefined") {
       
       var words = [];
       var dataSrc = [];
   
   
    //    $.ajax({
    //        url: _accountSelectorUrl,
    //        success: function (data) {
    //            //alert("success");
    //        }
    //    });
       var ac_no_selected = $(".account-info .account-no").text();
   
       var accountdetails = $('#account-details').DataTable({
           "pageLength": 4,
           "info": false,
           "ordering": true,
   
           ajax: {
               url: _accountSelectorUrl,
               dataSrc: 'accountselector',
               processing: true,
           },
           "columnDefs": [ // hiding pastdueamt column for sorting in desc 
            {
                "targets": [ 3 ],
                "visible": false,
                "searchable": false
            }
        ] ,
           "columns": [
   
               {
                   "data": "AccountStatus",
                   "render": function (data, type, row, meta) {
                    var comm_icon="~/media/Project/wol/Portal/AccountSelector/icon-commercial.png";
                    //var comm_icon="/Content/wol/images/icon-commercial.png"; //uncomment when u are checking locally in fed site
                    var res_icon="~/media/Project/wol/Portal/AccountSelector/icon-residential.png";
                    //var res_icon="/Content/wol/images/icon-residential.png"; //uncomment when u are checking locally in fed site
                    var L1 = row.ServiceAddress.Line_1;
                    var L2 = row.ServiceAddress.Line_2;
                    var City = row.ServiceAddress.City;
                    var State = row.ServiceAddress.State;
                    var Po_code = row.ServiceAddress.Postal_Code;
                    var Cr_of = row.ServiceAddress.Care_Of;
                    
                       switch (data) {
                           case 'Active':
                           if ((row.PastDueAmount > 0) || (row.DunningStatus >= 5)) { // dunning & past Due amount account icon
                                if (row.ServiceAddress  ==  null) {
                                    return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                                }else if (L1.trim() == ""  &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of == null ) {
                                    return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                                } // these condition is only when careof having null data
                                else if (L1.trim() == ""  &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of.trim() == "" ) {
                                    return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                                }// checking empty values
                                else if (L1 == null  &&  L2 == null  &&  City == null && State == null &&  Po_code == null && Cr_of == null ) {
                                    return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                                } // checking null values
                                else if ((L2.trim() == "" && Cr_of == "") || (L2.trim() == "" && Cr_of == null)) {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+'</span></p>';   
                                }else if (L1.trim() == "" && L2.trim() == "") {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                }else if (L1 == null && L2 == null) {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                }else if (L1 == null || L1.trim() == "") {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                }else if (L2 == null || L2.trim() == "") {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                                }else if (City == null || City.trim() == "") {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                }else if (State == null || State.trim() == "") {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+Po_code+" "+Cr_of+'</span></p>';
                                }else if (Po_code == null || Po_code.trim() == "") {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+"" +  ','+""+State+" "+Cr_of+'</span></p>';
                                }else if (Cr_of == null || Cr_of.trim() == "") {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1.trim()+" "+L2.trim()+""+', '+""+City.trim()+""+', '+""+State.trim()+" "+Po_code.trim()+'</span></p>';
                                }else {
                                    return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                                }
                            }
                            else if(row.AccountType == "Commercial"){
                                   if (row.ServiceAddress  ==  null) {                     
                                       return  '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   }else if (L1.trim() == "" &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of == null ) {
                                       return  '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   } // these condition is only for asreg10 data
                                   else if (L1.trim() == ""  &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of.trim() == "" ) {
                                       return  '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   }// checking empty values
                                   else if (L1 == null  &&  L2 == null  &&  City == null && State == null &&  Po_code == null && Cr_of == null ) {
                                       return  '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   } // checking null values
                                   else if ((L2.trim() == "" && Cr_of == "") || (L2.trim() == "" && Cr_of == null)) {
                                    return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+'</span></p>';                
                                    }// checking null values line_2 & careof values is null or empty
                                   else if (L1 == null || L1.trim() == "") {
                                       return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+ L2 +""+', '+""+City+""+', '+""+State +" "+Po_code+" "+Cr_of+'</span></p>';
                                   }else if (L2 == null || L2.trim() == "") {
                                       return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                                   } else if (City  == null || City.trim() == "") {
                                       return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                   } else if (State == null || State.trim() == "") {
                                       return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+Po_code+" "+Cr_of+'</span></p>';
                                   } else if (Po_code == null || Po_code.trim() == "") {
                                       return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Cr_of+'</span></p>';
                                   }else if (Cr_of == null || Cr_of.trim() == "") {
                                       return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+'</span></p>';
                                   } else {
                                       return '<p class="acc-status"><img src='+comm_icon+' alt="commercial"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                                   }
                               }
                            else if(row.AccountType == "Residential") {  
                                   if (row.ServiceAddress  ==  null) {                     
                                       return  '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   }else if (L1.trim() == ""  &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of == null ) {
                                       return  '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   } // these condition is only for when care of having null data
                                   else if (L1.trim() == ""  &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of.trim() == "" ) {
                                       return  '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   }// checking empty values
                                   else if (L1 == null  &&  L2 == null  &&  City == null && State == null &&  Po_code == null && Cr_of == null ) {
                                       return  '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';
                                   } // checking null values
                                   else if ((L2.trim() == "" && Cr_of == "") || (L2.trim() == "" && Cr_of == null)) {
                                    return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+'</span></p>';                
                                    }// checking null values line_2 & careof values is null or empty
                                   else if (L1.trim() == ""  &&  L2.trim() == "") {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">' +  City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                   }else if (L1 == null && L2 == null) {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">' +  City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                   }else if (L1 == null || L1.trim() == "") {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+ L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                   } else if (L2 == null || L2.trim() == "") {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                                   } else if (City == null || City.trim() == "") {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                                   } else if (State == null || State.trim() == "") {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+Po_code+" "+Cr_of+'</span></p>';
                                   } else if (Po_code == null || Po_code.trim() == "") {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Cr_of+'</span></p>';
                                   } else if (Cr_of == null || Cr_of.trim() == "") {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+'</span></p>';
                                   } else {
                                       return '<p class="acc-status"><img src='+res_icon+' alt="Residential"  class="status-icon"><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                                   }
                               }
                               
                               // break;
                           case 'Closed':
                               if (row.ServiceAddress  ==  null) {
                                   return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                               }else if (L1.trim() == ""  &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of == null ) {
                                   return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                               } // these condition is only when careof having null data
                               else if (L1.trim() == ""  &&  L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of.trim() == "" ) {
                                   return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                               }// checking empty values
                               else if (L1 == null  &&  L2 == null  &&  City == null && State == null &&  Po_code == null && Cr_of == null ) {
                                   return  '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="address-null visible-xs">NA</span></p>';            
                               } // checking null values
                               else if ((L2.trim() == "" && Cr_of == "") || (L2.trim() == "" && Cr_of == null)) {
                                return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+'</span></p>';   
                                }
                               else if (L1.trim() == "" && L2.trim() == "") {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                               }else if (L1 == null && L2 == null) {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                               }else if (L1 == null || L1.trim() == "") {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                               } else if (L2 == null || L2.trim() == "") {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                               } else if (City == null || City.trim() == "") {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';
                               } else if (State == null || State.trim() == "") {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+Po_code+" "+Cr_of+'</span></p>';
                               } else if (Po_code == null || Po_code.trim() == "") {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+"" +  ','+""+State+" "+Cr_of+'</span></p>';
                               } else if (Cr_of == null || Cr_of.trim() == "") {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1.trim()+" "+L2.trim()+""+', '+""+City.trim()+""+', '+""+State.trim()+" "+Po_code.trim()+'</span></p>';
                               }else {
                                   return '<p class="acc-status"><i class="status-icon fa fa-warning"></i><span>' + row.AccountStatus + '</span><span class="visible-xs mobile-address">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</span></p>';                
                               }
                               //return '<p><i class="status-icon fa fa-warning"></i><span>'+ row.AccountStatus + '</span><span class="visible-xs mobile-address">' + L1 + " " + L2 + " " + City + " " + State + " "+ row.ServiceAddress.Country + " " + Po_code + '</span></p>';
                               // break;
                           default:
                               return '';
                       }
   
                   }
               },
               {
                   "data": "ContractAccountId",
                   "render": function (data, type, row, meta) {
                       return '<p class="accountnum">' + row.ContractAccountId + '</p>'
                   }
               },
               {
                   
                   "data": "ServiceAddress",
                   "render": function (data, type, row, meta) {
                    var L1 = row.ServiceAddress.Line_1;
                    var L2 = row.ServiceAddress.Line_2;
                    var City = row.ServiceAddress.City;
                    var State = row.ServiceAddress.State;
                    var Po_code = row.ServiceAddress.Postal_Code;
                    var Cr_of = row.ServiceAddress.Care_Of;

                       if (row.ServiceAddress  ==  null) {                    
                           return  '<p class="acc-status hidden-xs">NA</p>';                
                       }else if (L1.trim() == "" && L2.trim() == "" && City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of == null ) {
                           return  '<p class="acc-status hidden-xs">NA</p>';
                       } // these condition is only when othes values empty only caref of having null values 
                       else if (L1.trim() == ""  && L2.trim() == ""  &&  City.trim() == "" && State.trim() == "" &&  Po_code.trim() == "" && Cr_of.trim() == "" ) {
                           return  '<p class="acc-status hidden-xs">NA</p>';
                       }// checking empty values
                       else if (L1 == null  &&  L2 == null && City == null && State == null &&  Po_code == null && Cr_of == null ) {
                           return  '<p class="acc-status hidden-xs">NA</p>';
                       } // checking null values
                        else if ((L2.trim() == "" && Cr_of == "") || (L2.trim() == "" && Cr_of == null)) {
                        return  '<p class="acc-status hidden-xs">'+L1+""+', '+""+City+""+', '+""+State+" "+Po_code+'</p>'                
                        }
                       else if (L1.trim() == ""  &&  L2.trim() == "") {
                           return  '<p class="acc-status hidden-xs">' + City +""+', '+""+State+" "+Po_code+ " "+Cr_of+'</p>'
                       }else if (L1 ==  null && L2 == null) {
                           return  '<p class="acc-status hidden-xs">'+City+""+', '+""+State+" "+Po_code+ " "+Cr_of+'</p>'
                       }else if (L1 ==  null || L1.trim() == "") {
                           return  '<p class="acc-status hidden-xs">'+ L2+" "+', '+""+City+""+', '+""+State+" "+Po_code+ " "+Cr_of +'</p>'
                       } else if (L2 ==  null || L2.trim() == "") {
                           return  '<p class="acc-status hidden-xs">'+L1+" "+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of +'</p>'                
                       } else if (City  ==  null || City.trim() == "") {
                           return  '<p class="acc-status hidden-xs">'+L1+" "+L2+""+', '+""+State+" "+Po_code+" "+Cr_of + '</p>'
                       } else if (State ==  null || State.trim() == "") {
                           return  '<p class="acc-status hidden-xs">' + L1+" "+L2+""+', '+""+City+" "+', '+""+Po_code+ " "+Cr_of+'</p>'
                       } else if (Po_code ==  null || Po_code.trim() == "") {
                           return  '<p class="acc-status hidden-xs">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Cr_of+'</p>'
                       }else if (Cr_of ==  null || Cr_of.trim() == "") {
                           return  '<p class="acc-status hidden-xs">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+'</p>'
                       }
                       else {
                           return  '<p class="acc-status hidden-xs">'+L1+" "+L2+""+', '+""+City+""+', '+""+State+" "+Po_code+" "+Cr_of+'</p>'
                       }
                   }
               },
               {
                "data": "PastDueAmount",
                "render": function(data, type, row, meta) {
                        return '<p>' + row.PastDueAmount + '</p>';                
                }
            }
           ],
   
           "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
               switch (aData.AccountStatus) {
                   case 'Closed':
                       $(nRow).addClass("inactive");
                       break;
               }
   
               if (aData.ContractAccountId == ac_no_selected) {
                   $(nRow).attr('id', 'selected-account');
   
               }
           },
           initComplete: function () {
               // past due amount column sort by Desc Order
            accountdetails.order([3,'desc']).draw();
                // hiding row based on what account selected on account header
               $('#account-details').DataTable().row("#selected-account").remove().draw();
               if ($('#account-details').DataTable().data().count() <= 4) {
                   $(".link-view-account").hide();
               }
           
           }
       });
       $('#account-details tbody').on('click', 'tr', function (x) {
   
           var accountnum = $(this).find('.accountnum').text();
           var _selectedAccountUrl;
   
           $.ajax({
               url: _selectedAccountUrl,
               type: 'POST',
               datatype: "json",
               contenttype: 'application/json; charset=utf-8',
               data: {
                   contractAccountNum: accountnum
               },
               context: this,
               success: function (data) {
                   // console.log("accounted selected");
                   window.location.reload();
   
               },
               error: function (xhr) {
                   console.log('error');
               }
           });
       });
       }
   });
$(document).ready(function() {

    if ($(".load-account-datatable").length != 0) {
        var $accountselectortable = $('#account-selector-table-more-than-5');
        
        if (typeof _manageAccountApiUrl != "undefined") {

            var _manageAccountUrl = _manageAccountApiUrl;
            var words = [];
            var dataSrc = [];


            var uniqueDocument = [];
            //commneting this    

            function renderAccountSelectorData() {
                $("#daccount-selector-wrapper").removeClass("hide");
                $("#no-account-selector").addClass("hide");
               
                function getMailingAddress(data, type, row) {
                    if (data.ServiceAddress  ==  null) {                     
                        return "<div> NA </div>";
                    } else if (data.ServiceAddress.Line_1.trim() == "" && data.ServiceAddress.Line_2.trim() == "" && data.ServiceAddress.City.trim() == "" && data.ServiceAddress.State.trim() == "" && data.ServiceAddress.Postal_Code.trim() == "" && data.ServiceAddress.Care_Of == null) {
                        return "<div> NA </div>";
                    } // these condition is only when othes values empty only carefof having null values 
                    else if (data.ServiceAddress.Line_1.trim() == "" && data.ServiceAddress.Line_2.trim() == "" && data.ServiceAddress.City.trim() == "" && data.ServiceAddress.State.trim() == "" && data.ServiceAddress.Postal_Code.trim() == "" && data.ServiceAddress.Care_Of.trim() == "") {
                        return "<div> NA </div>";
                    } // checking empty values
                    else if (data.ServiceAddress.Line_1 == null && data.ServiceAddress.Line_2 == null && data.ServiceAddress.City == null && data.ServiceAddress.State == null && data.ServiceAddress.Postal_Code == null && data.ServiceAddress.Care_Of == null) {
                        return "<div> NA </div>";
                    } // checking null values
                    else if ((data.ServiceAddress.Line_2.trim() == "" && data.ServiceAddress.Care_Of == "") || (data.ServiceAddress.Line_2.trim() == "" && data.ServiceAddress.Care_Of == null)) {
                        return '<div>' + data.ServiceAddress.Line_1 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + '</div>';
                    } else if (data.ServiceAddress.Line_1.trim() == "" && data.ServiceAddress.Line_2.trim() == "") {
                        return '<div>' + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + "" + data.ServiceAddress.Postal_Code + "" + data.ServiceAddress.Care_Of + '</div>';                
                    } else if (data.ServiceAddress.Line_1 ==  null && data.ServiceAddress.Line_2 == null) {
                        return '<div>' + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + " " + data.ServiceAddress.Care_Of + '</div>';
                    } else if (data.ServiceAddress.Line_1 ==  null || data.ServiceAddress.Line_1.trim() == "") {
                        return '<div>' + data.ServiceAddress.Line_2 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + " " + data.ServiceAddress.Care_Of + '</div>';
                    } else if (data.ServiceAddress.Line_2 ==  null || data.ServiceAddress.Line_2.trim() == "") {
                        return '<div>' + data.ServiceAddress.Line_1 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + " " + data.ServiceAddress.Care_Of + '</div>';                
                    } else if (data.ServiceAddress.City  ==  null || data.ServiceAddress.City.trim() == "") {
                        return '<div>' + data.ServiceAddress.Line_1 + " " + data.ServiceAddress.Line_2 + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + " " + data.ServiceAddress.Care_Of + '</div>';
                    } else if (data.ServiceAddress.State ==  null || data.ServiceAddress.State.trim() == "") {
                        return '<div>' + data.ServiceAddress.Line_1 + " " + data.ServiceAddress.Line_2 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.Postal_Code + " " + data.ServiceAddress.Care_Of + '</div>';
                    } else if (data.ServiceAddress.Country ==  null || data.ServiceAddress.Country.trim() == "") {
                        return '<div>' + data.ServiceAddress.Line_1 + " " + data.ServiceAddress.Line_2 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + " " + data.ServiceAddress.Care_Of + '</div>';                
                    } else if (data.ServiceAddress.Postal_Code ==  null || data.ServiceAddress.Postal_Code.trim() == "") {
                        return '<div>' + data.ServiceAddress.Line_1 + " " + data.ServiceAddress.Line_2 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Care_Of + '</div>';
                    } else if (data.ServiceAddress.Care_Of == null || data.ServiceAddress.Care_Of.trim() == "") {
                        return '<div>' + data.ServiceAddress.Line_1 + " " + data.ServiceAddress.Line_2 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + '</div>';
                    } else {
                        return '<div>' + data.ServiceAddress.Line_1 + " " + data.ServiceAddress.Line_2 + "" + ', ' + "" + data.ServiceAddress.City + "" + ', ' + "" + data.ServiceAddress.State + " " + data.ServiceAddress.Postal_Code + " " + data.ServiceAddress.Care_Of + '</div>';
                    }
                }

                var ac_no_selected = $(".account-info .account-no").text();

                var accountSelectorDataTable = $('#account-selector-table-more-than-5').DataTable({



                    dom: 'Bfrtip',
                    "destroy": true,
                    ajax: {
                        url: _manageAccountUrl,
                        dataSrc: 'accountselector',
                        processing: true,
                    },
                    serverside: true,
                    "language": {
                        "lengthMenu": "Display _MENU_ records per page",
                        "zeroRecords": "No records available",                        
                        "infoEmpty": "No records available"
                         
                    },

                    "order": [
                        [0, 'desc'],
                        [1, 'desc'],
                        [2, 'desc'],
                        [3, 'desc'],
                        [4, 'desc']
                    ],
                    "columnDefs": [ // hide column

                        {
                            "targets": [5],
                            "visible": false,
                            "searchable": false
                        }
                    ],
                   


                    columns: [{
                            "data": "AccountStatus",
                            "render": function(data, type, row, meta) {

                                switch (data) {
                                    case 'Active':
                                        if ((row.PastDueAmount > 0) || (row.DunningStatus >= 5)) { // dunning & past Due amount account icon
                                            return '<i class="activity-icon fa fa-warning"></i>' + row.AccountStatus;
                                        } else if (row.AccountType == "Commercial") {
                                            return '<img src="~/media/Project/WOL/Portal/AccountSelector/icon-commercial.png" alt="Commercial"  class="activity-icon">' + row.AccountStatus;
                                        } else if (row.AccountType == "Residential") {                                            
                                            return '<img src="~/media/Project/WOL/Portal/AccountSelector/icon-residential.png" alt="Residentials"  class="activity-icon">' + row.AccountStatus;
                                        }

                                        
                                    case 'Closed':
                                        return '<i class="activity-icon fa fa-warning"></i>' + row.AccountStatus;
                                        break;

                                    default:
                                        return 'NA';
                                }

                            }
                        },
                        {
                            "data": "ContractAccountId",
                            "render": function(data, type, row, meta) {

                                return '<p class="accountnum">' + row.ContractAccountId + '</p>';
                            }
                        },

                        {
                            "data": getMailingAddress

                        },
                        {
                            "data": "DueDate",
                            "render": function(data, type, row, meta) {                                
                                if (row.DueDate == null) {
                                    return "NA"
                                } else {
                                    var dateParts = data.split('-'); 
                                    var month = dateParts[1];
                                    var day = dateParts[2];
                                    var year = dateParts[0];
                                    return month + "/" + day + "/" + year;
                                    
                                     
                                }

                            }
                        },

                        {
                            "data": "AmountDue",
                            "render": function(data, type, row, meta) {
                                return commaSeparateNumber(row.AmountDue);
                            }
                        },
                        {
                            "data": "PastDueAmount",
                            "render": function(data, type, row, meta) {

                                return '<p>' + row.PastDueAmount + '</p>';                
                            }
                        },
                        {
                            "data": "AmountDue",
                            "render": function(data, type, row, meta) {
                                return '<button class="wol-form-btn" type="submit" data-toggle="modal" data-target="#select-payment-option" > Pay Now<i class="fa fa-chevron-right"></i></button>';
                                
                                

                                if ($(window).width() < 767) {
                                    return '<button class="wol-form-btn" type="submit" > Pay Now <i class="fa fa-chevron-right"></i></button>';
                                }




                            }
                        }

                    ],

                    "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull, x) {
                        
                        switch (aData.AccountStatus) {
                            case 'Closed':

                                $(nRow).addClass("inactive");
                                break;
                        }
                        if (aData.ContractAccountId == ac_no_selected) {
                            $(nRow).attr('id', 'selected-account');
                            }
                    },
                    initComplete: function() {
                        
                        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_1");
                        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_2");
                        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_3");
                        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_4");
                        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_5");

                        
                        if (accountSelectorDataTable.data().count() <= 10) {
                            $(".dt-more-container").hide();
                            
                            $('#account-selector-table-more-than-5_filter').addClass("hide");

                        } else if (accountSelectorDataTable.data().count() >= 11) {
                            $('#account-selector-table-more-than-5_filter').removeClass("hide");
                        }

                        var api = this.api();

                        // Populate a dataset for autocomplete functionality
                        // using data from first, second and third columns
                        api.cells('tr', [1, 2]).every(function() {
                            // Get cell data as plain text
                            var data = $('<div>').html(this.data()).text();
                            if (dataSrc.indexOf(data) === -1) {
                                dataSrc.push(data);
                            }
                        });

                        

                        // Sort by column past due amount 
                        accountSelectorDataTable.order([5, 'desc']).draw();


                        $('#account-selector-table-more-than-5_filter input[type="search"]').unbind();

                        // Initialize Typeahead plug-in
                        $('#account-selector-table-more-than-5_filter input[type="search"]', api.table().container())
                            .typeahead({
                                source: dataSrc,
                                autoSelect: false, // disable auto select in searchbox
                                afterSelect: function(value) {

                                    
                                    api.search(value).draw();
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_1");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_2");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_3");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_4");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_5");

                                },

                            });

                        $('#account-selector-table-more-than-5_filter input[type="search"]').bind("keyup", function(x) {
                            var key = x.keyCode || x.which;
                            if (key == 13) {
                                if ($(x.target).val() === "") {
                                    accountSelectorDataTable.search($(x.target).val()).draw();
                                } else {
                                    var myValue = $(".table-search").val();
                                    $accountselectortable.DataTable().search(myValue).draw();
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_1");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_2");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_3");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_4");
                                    $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_5");
                                }
                            }
                        });

                    },
                    buttons: [{
                        extend: 'csv',
                        className: "hide",
                        filename: "document history",
                    }],
                    drawCallback: function() {
                        $('#account-selector-load-more').toggle(this.api().page.hasMore());
                    }
                });
                var input = $('.account-selector-manage #account-selector-table-more-than-5_filter label input');
                $('.account-selector-manage #account-selector-table-more-than-5_filter label').addClass("text-hide");
                input.addClass("table-search form-control");
                input.parents("#account-selector-table-more-than-5_filter").addClass("hide");
                input.attr("placeholder", "Search Account Number or Address");
                input.after("<span class='Icon-search'><i class='fa fa-search'></i></span>");


            }
            renderAccountSelectorData();
        }
    }
    $('#account-selector-load-more').on('click', function() {
        $accountselectortable.DataTable().page.loadMore();
        setTimeout(
            function() {
                if (!$('#account-selector-load-more').is(':visible')) {
                    $('#account-selector-load-more').parent().css("border-bottom", "none");
                }
            },
            500);
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_1");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_2");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_3");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_4");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_5");
    });

    $('#account-selector-table-more-than-5_filter span.Icon-search').on("click", function() {
        
        var myValue = $(".table-search").val();
       


        $accountselectortable.DataTable().search(myValue).draw();
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_1");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_2");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_3");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_4");
        $('table#account-selector-table-more-than-5 tbody tr td').removeClass("sorting_5");




    });



    $('#account-selector-table-more-than-5 tbody').on('click', 'tr td', function(x) {
       
        var accountnum = $(this).parent().find('.accountnum').text();
        $("#txtAcctNumber").val(accountnum); // passing account number to payment gateway forpayment
       
        var _accountSelectorUrl = '/api/AccountSelector/GetContractAccountJson';
        var _selectedAccountUrl = '/api/AccountSelector/AccountCard';
        var _myaccountUrl = _myAccountUrl;
        if ($(this).find("button").length == 0) {
            $.ajax({
                url: _selectedAccountUrl,
                type: 'POST',
                datatype: "json",
                contenttype: 'application/json; charset=utf-8',
                data: {
                    contractAccountNum: accountnum
                },
                context: this,
                success: function(data) {
                    window.location.href = _myaccountUrl;

                   

                },
                error: function(xhr) {
                    console.log('error');
                }
            });

        }
    });
});

function commaSeparateNumber(val) {    
    return "$" + parseFloat(val).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

}
$(document).ready(function() {

    // if ($("form").is(".server-error")) {

    //     $(".server-error").addClass("show");
    //     $(".server-error").prev(".editable-container").addClass("hide");
    // }
    if ($("form").is(".server-error")) {

        $(".server-error").show();
        $(".server-error").prev(".editable-container").hide();
        // $(".act-cancel-btn").click(function() {
        //     $(".server-validation-error").text("");
        // });
    } else {
        $(".server-error").hide();
        $(".server-error").prev(".editable-container").show();
    }
    $(".act-cancel-btn").click(function() {
        $(".server-validation-error").text("");
    });
    $("#phone-content .editable-text").text(function(i, text) {
        text = text.replace(/(\d\d\d)(\d\d\d)(\d\d\d\d)/, "($1) $2-$3");
        return text;
    });
    // $(".act-cancel-btn").click(function() {
    //     $(this).parent("form").find(".form-group input").val("");
    // });
});



// encrypting field value on submit event for , creating for submitting spcial charcter in sitecore solution
// create account security question submit 
$("#createaccount-security-questions.create-account-by-ac-no .wol-btn-primary").on('click', function(event) {
    if($('#createaccount-security-questions').valid()){
        var encrypt1 = $('#firstSecurityQuestAnswertxt').val();
        var encode1 = escape(encrypt1);
		$('#firstSecurityQuestAnswer').val(encode1);
        var encoded1=encode1.replace(/./g, '*'); //replacing with asterisck
        $('#firstSecurityQuestAnswertxt').val(encoded1);
        var encrypt2 = $('#secondSecurityQuestAnswertxt').val();
        var encode2 = escape(encrypt2);
		 $('#secondSecurityQuestAnswer').val(encode2);
        var encoded2=encode2.replace(/./g, '*'); //replacing with asterisck
        $('#secondSecurityQuestAnswertxt').val(encoded2);
        var encrypt3 = $('#thirdSecurityQuestAnswertxt').val();
        var encode3 = escape(encrypt3);
		 $('#thirdSecurityQuestAnswer').val(encode3);
        var encoded3=encode3.replace(/./g, '*'); //replacing with asterisck
        $('#thirdSecurityQuestAnswertxt').val(encoded3);
        var encrypt4 = $('#fourthSecurityQuestAnswertxt').val();
        var encode4 = escape(encrypt4);
		$('#fourthSecurityQuestAnswer').val(encode4);
        var encoded4=encode4.replace(/./g, '*'); //replacing with asterisck
        $('#fourthSecurityQuestAnswertxt').val(encoded4);
        $('#createaccount-security-questions').validate().settings.ignore = "*"; // ignore valiadtion after first click
    }
});

// Preference center security question - encrypted response.
// encrypting field value on change event for , creating for submitting spcial charcter in sitecore solution

$("#createaccount-security-questions1 .wol-btn-primary.act-update-btn").on('click', function(event) {
    if($('#createaccount-security-questions1').valid()){
        var encrypt = $('#firstSecurityQuestAnswer').val();
        var encoded = escape(encrypt);
        $('#firstSecurityQuestAnswer').val(encoded);
		$('#createaccount-security-questions1').validate().settings.ignore = "*";
    }
	   
});

$("#createaccount-security-questions2 .wol-btn-primary.act-update-btn").on('click', function(event) {
	if($('#createaccount-security-questions2').valid()){
        var encrypt = $('#secondSecurityQuestAnswer').val();
		var encoded = escape(encrypt);
		$('#secondSecurityQuestAnswer').val(encoded);
		$('#createaccount-security-questions2').validate().settings.ignore = "*";
    }
    
});
$("#createaccount-security-questions3 .wol-btn-primary.act-update-btn").on('click', function(event) {
	if($('#createaccount-security-questions3').valid()){
        var encrypt = $('#thirdSecurityQuestAnswer').val();
		var encoded = escape(encrypt);
		$('#thirdSecurityQuestAnswer').val(encoded);
		$('#createaccount-security-questions3').validate().settings.ignore = "*";
    }
   
});
$("#createaccount-security-questions4 .wol-btn-primary.act-update-btn").on('click', function(event) {
	if($('#createaccount-security-questions4').valid()){
        var encrypt = $('#fourthSecurityQuestAnswer').val();
    var encoded = escape(encrypt);
    $('#fourthSecurityQuestAnswer').val(encoded);
		$('#createaccount-security-questions4').validate().settings.ignore = "*";
    }
    
});

// forgot password security question 
//$("#Answer").on('change', function(event) {
    $("#forgotPasswordSecurity .wol-btn-primary").on('click', function(event) {  
        if($('#forgotPasswordSecurity').valid()){
            var encrypt = $('#Answertxt').val();
            var encode = escape(encrypt);
            $('#Answer').val(encode);
            var encoded=encode.replace(/./g, '*'); //replacing with asterisck
            $('#Answertxt').val(encoded);
            $('#forgotPasswordSecurity').validate().settings.ignore = "*";
        }
    });
$(document).ready(function(){
    $('.article-video').click(function(){
        video = '<iframe class="article-vd-player" src="'+ $(this).children().attr('data-video') + '"></iframe>';
        $(this).replaceWith(video);
        $('.video-headlines, .article-video-section .play-btn').hide();
        $(".article-vd-player")[0].src += "&autoplay=1";
    });
});
$(document).ready(function () {

    if ($(".load-aboutUs-datatable").length != 0) {
        var $accountselectortable = $('#aboutUs-years-datatable');
        var _accountSelectorUrl = '../../../src/js/data/aboutUs/aboutUs.json';
       
       
        function renderAboutUsData() {
            $("#aboutUs-datatable-wrapper").removeClass("hide");           
            $.ajax({
                url: _accountSelectorUrl,
                success: function (data) {
                    if (data.aboutUs.length == 0) {
                        $("#aboutUs-datatable-wrapper").addClass("hide");
                       
                    }
                }
            });            

            var aboutUsDataTable = $('#aboutUs-years-datatable').DataTable({
                responsive: true,       
                dom: 'Bfrtip',
                "destroy": true,
                ajax: {
                    url: _accountSelectorUrl,
                    dataSrc: 'aboutUs',
                    processing: true,
                },
                serverside: true,
                "language": {
                    "lengthMenu": "Display _MENU_ records per page",
                    "zeroRecords": "No records available",                    
                    "infoEmpty": "No records available"                    
                  },

                "order": [[0, 'desc']],

               
                columns: [
                    {
                        "data": "year",
                        "render": function (data, type, row, meta) {
                            return '<p>' + row.year + '</p>'
                        }
                    },

                    {
                        "data": "Title",
                        "render": function (data, type, row, meta) {
                            return '<p>' + row.Title + '</p>'
                        }
                    }
                ],
                buttons: [{
                    extend: 'csv',
                    className: "hide",
                    filename: "aboutUs",
                }],
            
                drawCallback: function () {
                    $('#aboutUs-load-more').toggle(this.api().page.hasMore());
                }
            });         
            

        }
        renderAboutUsData();
    }
    $('#aboutUs-load-more').on('click', function () {
        $accountselectortable .DataTable().page.loadMore();
    });
});
$(document).ready(function(){
    // Add minus icon for collapse element which is open by default
    $(".wol-accordion .collapse.in").each(function(){
        $(this).siblings(".wol-accordion .panel-heading").find(".fa").addClass("fa-minus").removeClass("fa-plus");
    });
    
    // Toggle plus minus icon on show hide of collawol element
    $(".wol-accordion .collapse").on('show.bs.collapse', function(){
        $(this).parent().find(".fa").removeClass("fa-plus").addClass("fa-minus");
    }).on('hide.bs.collapse', function(){
        $(this).parent().find(".fa").removeClass("fa-minus").addClass("fa-plus");
    });

// show more and less more
  $('.show-content').on('click',function(){
    if($(this).text().toLowerCase().trim() == "show more"){
        $(this).parent().find('.more-content').show();
        $(this).text("Show Less ")
    }else if($(this).text().toLowerCase().trim() == "show less"){
        $(this).parent().find('.more-content').hide();
        $(this).text("Show More ")
    }
  });

  // Vertical navigation 
  
  $(".eletter-list a").click(function(){
    console.log("hello");
    $(this).tab('show');
    
   
}); 

  $(".eletter-list li").click(function(){
      $("#e-newsletter").addClass("active");    
  });

  $(".vertical-navigation-list li").click(function(){   
    if($(this).hasClass("sub-navigation")){
        $(this).find(".eletter-list").removeClass("hide");
    }
    else{
        $(this).closest(".vertical-navigation-list").find(".eletter-list").addClass("hide");
    }    
  });

});
$('.startservice-common').on('touchstart click', '.start-img', function(){
  $('.startservice-common .start-img').removeClass('active');
  $(this).addClass('active');
});

$('.addFutureAddress').on('click', function(e){
  e.preventDefault();
    $('.futureMailAddress').removeClass('hide');
  $('.addFutureAddress').hide();
})

$('#update-startDate').datepicker({
  autoclose :true,
  orientation: "auto"
});


$(document).ready(function(){
    var clicks = 0;
    $('#add-form a').click(function() {
        if (clicks == 0){
            $('.miltiform-wrapper').removeClass('hide');           
        } else{
            $('.clonedInput').clone().appendTo(".miltiform-wrapper");                    
        }
        ++clicks;
    });

});
$('#addressDate').datepicker({        
    autoclose: true
});

    

$(document).ready(function() {
    if ($('.video-slider').length > 0) {
        initiateSlick();
        $('.video-slider').on('afterChange', function(event, slick, currentSlide, nextSlide) {
            $(this).find('video').get(0).pause();
            $(this).find('.slick-active video').get(0).play();
        });
    }
});

function initiateSlick() {
    $('.video-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 30000,
        dots: false,
        infinite: true,
        adaptiveHeight: true,
        arrows: true,
        asNavFor: $('.video-thumbnails')
    });
    $('.video-thumbnails').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: $('.video-slider'),
        focusOnSelect: true,
        infinite: true,
        arrows: true
    });
    $('.wol-video-gallery .video-thumbnails').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        asNavFor: $('.video-slider'),
        focusOnSelect: true,
        infinite: true,
        arrows: true
    });
}
$(window).resize(function(){
    if($('.video-slider').length > 0) {
        $('.video-slider').slick('resize');
        $('.video-slider .slick-arrow').css({'top':$('.video-wrapper').innerHeight()/2+'px'});
    }    
})

// Account selector dropdown js

if ($(window).width() >= 768) {
    $('.user-account-info').find('.dropdown').click(function() {
        $('.data-account-holder td:first-child').width($('.user-account-info li:first-child').innerWidth() - 40);
        $('.data-account-holder td:nth-child(2)').width($('.user-account-info li:nth-child(2)').innerWidth() - 12);
        // $('.data-account-holder td:nth-child(3)').width($('.user-account-info li:nth-child(3)').innerWidth());
        
        if ($('#account-details').find('.accountnum').text() == $(this).find('.account-no').text()) {
            $('#account-details').find('tr').hide();
        }
        // $(this).find('.account-no').text();
        // $('#account-details').find('.accountnum').has($(this).find('.account-no').text()).parents().hide();
    });
}

//Mobile view secondary header dropdown select functionality:
function selectMenu() {
    $('.navbar-brand').text($('#secondary-navbar').children('.navbar-nav').find('.active a').hide().text());
};

$(window).resize(function() {
    
    if ($(window).width() <= 767) {
        selectMenu();
    }
});


// Microsite mobile view navigation
function micrositeMenu() {
    $('.microsite-navigation .navbar-brand').text($('#microsite-navbar').children('.navbar-nav').find('.active').hide().text());
};
if ($(window).width() <= 767) {
    micrositeMenu();
}

$(document).ready(function() {
    if ($(".user-account-info-body .row .col-md-3").html() != undefined) {
        var payText = $(".user-account-info-body .row .col-md-3").html().trim();
        if (payText == '') {
            $(".user-account-info-body .row .col-md-9").removeClass("col-md-9").addClass("col-md-12");
        }
    }
    
});

// code  for passing account numbr to payement gateway 
$('.user-account-info-body').on('click', 'button', function(x) {
    var accountnumb = $(this).parents('.user-account-info-body').find('.account-no').text();
    $("#txtAcctNumber").val(accountnumb);
});
$( "#aboutInquiry" ).on('change', function(e) {
    if(this.value !='') {
      $( ".bitmore-option" ).show();
    }
    else {
      $( ".bitmore-option" ).hide();
      $(".customer-feedback-title, .sendus-contact-content, .help-inquiry, .sendus-contact-content, .recaptcha-submit-btn").hide();
    }
  });

$( "#bitMore" ).change(function() {
  if(this.value !='') {
    $(".customer-feedback-title, .sendus-contact-content, .help-inquiry, .sendus-contact-content, .recaptcha-submit-btn").show();
  }
  else {
    $( ".bitmore-option" ).hide();
    $(".customer-feedback-title, .sendus-contact-content, .help-inquiry, .sendus-contact-content, .recaptcha-submit-btn").hide();
  }
});

$('.acc-no-help').tooltip();

if ($('#calendar').length !== 0){

    $('#calendar').fullCalendar({
        // calendar properties
        theme: true,

        editable: false,

        // header
        header: {
            left: 'prev ',
            center: 'title',
            right: 'next'
        },


        events: [
            // all day event
            {
                title: 'Meeting',
                className: ["event-color"],
                start: '2018-05-12',
                allDay: true
            },          
            {
                title: 'Conference',
                start: '2018-10-13',
                className: ["event-color"],                
                allDay: true
            },            
            {
                title: 'Dentist',
                start: '2018-06-09T11:30:00',
                end: '2018-06-09T012:30:00',
                className: ["event-color"],
                allDay: false
            }
        ],       
        textColor: 'white', 
        eventRender: function (event, element, view) {
            var dateString = event.start.format("YYYY-MM-DD");

            $(view.el[0]).find('.fc-day[data-date=' + dateString + ']').css('background-color', '#006671');
            var eventOccured = $(view.el[0]).find('.fc-day-top[data-date=' + dateString + ']');
            if (eventOccured.length != null)
                $(view.el[0]).find('.fc-day-top[data-date=' + dateString + ']').find('.fc-day-number').css({
                    'color': '#fff', 'font-size': '14px', 'font-family': 'roboto-medium', 'position': 'inherit',
                    'left': '0px', 'bottom': '19px'
                });
        }

    });

    $(".fc-prev-button,.fc-next-button").find('.ui-icon').remove('.ui-icon');
    $(".fc-prev-button").append('<i class="fa fa-chevron-left"...</i>');
    $(".fc-next-button").append('<i class="fa fa-chevron-right"...</i>');

    function addPrefixZero() {
        $('.fc-day-number').each(function () {
            var day = $(this).html(); //get the contents of the td
            //for any fields where the content is one character long, add a leading zero
            if (day.length == 1) {
                $(this).html("0" + day);
            }
        });
    }
    $(".fc-prev-button").click(function () {
        addPrefixZero();
    });
    $(".fc-next-button").click(function () {
        addPrefixZero();
    });

    window.onload = function () {
        addPrefixZero();
    }

}

$(document).ready(function () {
    if ($(".load-calendarlist").length != 0) {
        var $micrositeCalendarList1 = $('#microsite-calendar-table');
        var _micrositeCalendarUrl = '../../../src/js/data/microsites/microsoft-calendar.json';
         
        //var _uniqueDocument = [], _calendarDataLength = "";
        function renderCalendarData() {

            $.ajax({
                url: _micrositeCalendarUrl,
                success: function (data) {
                    if (data.calendarData.length == 0) {
                        $("#microsite-calendar-wrapper").addClass("hide");
                       
                    }
                }                
            });
            var micrositesCalendar = $('#microsite-calendar-table').DataTable({
           
                responsive: true,       
                dom: 'Bfrtip',
                "destroy": true,
                ajax: {
                    url: _micrositeCalendarUrl,
                    dataSrc: 'calendarData',
                    processing: true,
                },
                serverside: true,
                "language": {
                    "lengthMenu": "Display _MENU_ records per page",
                    "zeroRecords": "No records available",                    
                    "infoEmpty": "No records available"                    
                  },

                "order": [[0, 'desc']],               
                
                columns: [
                    {
                        "data": "date",
                        "render": function (data, type, row, meta) {
                            //return '<p  class="day-Date" href="'+row.date+'"></p><p  class="day-Date" href="'+row.day+'"></p>';
                            return '<p>' + row.date + '</p>' + '<p>' + row.day + '</p>';
                            
                        }
                    },
                    {
                        "data": "eventTitle",
                        "render": function (data, type, row, meta) {
                            return '<div class="h8">' + row.eventTitle + '</div>' + '<p>' + row.eventLocation + '</p>';
                        }
                    },
                    {
                        "data": "goTask",
                        "render": function (data, type, row, meta) {
                            return '<a class=" wol-anchor-link">' + row.goTask + '<i class="fa fa-chevron-right"></i></a>';
                           
                        }
                    }
                ],
                buttons: [{
                    extend: 'csv',
                    className: "hide",
                    filename: "microCalendar",
                }],
            
                drawCallback: function () {
                    $('#microsite-calendar-load-more').toggle(this.api().page.hasMore());
                }               
            });
        }
        renderCalendarData();
    }
    $('#microsite-calendar-load-more').on('click', function () {
        $micrositeCalendarList1.DataTable().page.loadMore();
    });
});
//$(document).ready(function () {
if ($(".load-calendarlist").length != 0) {
    var $micrositeCalendarList2 = $('#microsite-calendar-list-table');
    var _micrositeCalendarUrl = '../../../src/js/data/microsites/microsoft-calendar.json';

    //var _uniqueDocument = [], _calendarDataLength = "";
    function renderCalendarListData() {

        $.ajax({
            url: _micrositeCalendarUrl,
            success: function (data) {
                if (data.calendarData.length == 0) {
                    $("#microsite-calendar-list-wrapper").addClass("hide");

                }
            }
        });
        var micrositesCalendarList = $('#microsite-calendar-list-table').DataTable({

            responsive: true,
            dom: 'Bfrtip',
            "destroy": true,
            ajax: {
                url: _micrositeCalendarUrl,
                dataSrc: 'calendarData',
                processing: true,
            },
            serverside: true,
            "language": {
                "lengthMenu": "Display _MENU_ records per page",
                "zeroRecords": "No records available",
                "infoEmpty": "No records available"
            },

            "order": [[0, 'desc']],

            columns: [
                {
                    "data": "date",
                    "render": function (data, type, row, meta) {
                        //return '<p  class="day-Date" href="'+row.date+'"></p><p  class="day-Date" href="'+row.day+'"></p>';
                        return '<p>' + row.date + '</p>' + '<p>' + row.day + '</p>';

                    }
                },
                {
                    "data": "eventTitle",
                    "render": function (data, type, row, meta) {
                        return '<div class="h8">' + row.eventTitle + '</div>' + '<p>' + row.eventLocation + '</p>';
                    }
                },
                {
                    "data": "goTask",
                    "render": function (data, type, row, meta) {
                        return '<a class=" wol-anchor-link">' + row.goTask + '<i class="fa fa-chevron-right"></i></a>';

                    }
                }
            ],
            buttons: [{
                extend: 'csv',
                className: "hide",
                filename: "microCalendar",
            }],

            drawCallback: function () {
                $('#microsite-calendar-list-load-more').toggle(this.api().page.hasMore());
            }
        });
    }
    renderCalendarListData();
}
$('#microsite-calendar-list-load-more').on('click', function () {
    $micrositeCalendarList2.DataTable().page.loadMore();
});
$('[data-calendar-nav] ul.nav li').click(function () {
    $('[data-calendar-nav] ul.nav li').removeClass('active');
    $(this).addClass('active');
});
//});
$('#stopDate').datepicker({
    autoclose: true
});
$('.panel-disconnected .panel-heading .close-field').click(function() {
    $('.panel-disconnected').parent().hide();
});

// Terms and conditional based modal popup
// $('.termscheckbox :checkbox').change(function() {
//     var _termsmodal = $(this).attr("data-target");
//     if (this.checked) {
//         $(_termsmodal).modal('show');
//     }
// });
$(document).on("click",".termsmodal .close",function(){
    var _targetmodal = $(this).parents(".modal").attr("id");
    $('[data-modal="'+_targetmodal+'"]').prop('checked', false);  
});
$(document).on("click",".termsmodal .btn-action",function(){
    var _targetmodal = $(this).parents(".modal").attr("id");    
    $("#"+_targetmodal).modal('hide');
});

// Flex fix
$(".savings-energy-center").parents('.col-md-4.row-eq-height').addClass("flexwrapper");
$(document).ready(function () {

    if ($(".load-aboutUs-comp-datatable").length != 0) {
        var $aboutUscomponenttable = $('#aboutUs-datatable');
        var _aboutUscomponentUrl = '../../../src/js/data/aboutUs/aboutUs-comp.json';


        function renderAboutUsComponentData() {
            $("#aboutUs-comp-table-wrapper").removeClass("hide");
            $.ajax({
                url: _aboutUscomponentUrl,
                success: function (data) {
                    if (data.aboutUs.length == 0) {
                        $("#aboutUs-comp-table-wrapper").addClass("hide");

                    }
                }
            });

            var aboutUsCompDataTable = $('#aboutUs-datatable').DataTable({
                responsive: true,
                dom: 'Bfrtip',
                "destroy": true,
                ajax: {
                    url: _aboutUscomponentUrl,
                    dataSrc: 'aboutUs',
                    processing: true,
                },
                serverside: true,
                "language": {
                    "lengthMenu": "Display _MENU_ records per page",
                    "zeroRecords": "No records available",
                    "infoEmpty": "No records available"
                },

                "order": [[0, 'desc']],
               
                columns: [
                    {
                        "data": "scheduleType",
                        "render": function (data, type, row, meta) {
                            return '<p>' + row.scheduleType + '</p>'
                        }
                    },
                    {
                        "data": "Title",
                        "render": function (data, type, row, meta) {
                            return '<p>' + row.Title + '</p>'
                        }
                    },
                    {
                        "data": "date",
                        "render": function (data, type, row, meta) {
                            return '<p>' + row.date + '</p>'
                        }
                    },
                    {
                        "data": "schedulelink",
                        "render": function (data, type, row, meta) {
                            return '<p><a class="wol-link-primary" href="#">' + row.schedulelink + '</a></p>'
                        }
                    }
                ],
                buttons: [{
                    extend: 'csv',
                    className: "hide",
                    filename: "aboutUs",
                }],

                drawCallback: function () {
                    $('#aboutUs-comp-load-more').toggle(this.api().page.hasMore());
                }
            });


        }
        renderAboutUsComponentData();
    }
    $('#aboutUs-comp-load-more').on('click', function () {
        $aboutUscomponenttable.DataTable().page.loadMore();
    });
});
//print option

$(document).ready(function(){
    $(".print-wrapper .print").click(function(){
        window.print();  
    });
});
$("#accountpi-step2 #SelectedPhoneType").on("change", function() {

    if ($(this).val() == "Cell") {
        $(this).closest("#accountpi-step2").find(".custom-checkbox").removeClass("hide");
        $(this).closest("#accountpi-step2").find(".custom-checkbox").next(".errorMessage").removeClass("hide");
    } else {
        $(this).closest("#accountpi-step2").find(".custom-checkbox").addClass("hide");
        $(this).closest("#accountpi-step2").find(".custom-checkbox").next(".errorMessage").addClass("hide");
        $(this).closest('.form-create-account').find('#checkbox').prop("checked", false);
    }

});


// Password Validation
// -----------------------------------------

$(function passwordValidation() {

    var pwdInput = $('#Password');
    var pwdInputText = $('#UserName'); // This is the input type="text" version for showing password
    var pwdresetPassword = $("#PasswordPlaceholder");
    var pwdAccountSecurity = $("#NewPassword");
    var pwdValid = false;

    function validatePwdStrength() {

        var pwdValue = $("#Password").val(); // This works because when it's called it's called from the pwdInput, see end


        // Validate the length
        if (pwdValue.length > 7) {
            $(".icon-charLength-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-charLength-container").removeClass("client-validation-error");
            // $(".icon-charLength-container").css("color","green");
            pwdValid = true;
        } else {
            $(".icon-charLength-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-charLength-container").addClass("client-validation-error");
        }

        // Validate lowercase letter
        if (pwdValue.match(/[a-zA-Z]/)) {
            $(".icon-letter-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-letter-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
            //adding for checkin
        } else {
            $(".icon-letter-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-letter-container").addClass("client-validation-error");
            pwdValid = false;
        }

        // Validate number or special character
        if (pwdValue.match(/[0-9]/)) {
            $(".icon-number-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-number-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
        } else {
            {
                $(".icon-number-container .fa").removeClass("fa-check").addClass("fa-close");
                $(".icon-number-container").addClass("client-validation-error");
                pwdValid = false;
            }
        }
    }
    if ($("#accountpi-step2").length > 0) {
        validatePwdStrength();
        if ($("#Password").val() == "") {
            $(".icon-letter-container, .icon-number-container, .icon-charLength-container").removeClass("client-validation-error");
        }
    }


    // This works because when it's called it's called from the pwdInput, see end


    function validateResetPwdStrength() {

        var pwdValue = $("#PasswordPlaceholder").val(); // This works because when it's called it's called from the pwdInput, see end


        // Validate the length
        if (pwdValue.length > 7) {
            $(".icon-charLength-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-charLength-container").removeClass("client-validation-error");
            // $(".icon-charLength-container").css("color","green");
            pwdValid = true;
        } else {
            $(".icon-charLength-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-charLength-container").addClass("client-validation-error");
        }

        // Validate lowercase letter
        if (pwdValue.match(/[a-zA-Z]/)) {
            $(".icon-letter-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-letter-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
        } else {
            $(".icon-letter-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-letter-container").addClass("client-validation-error");
            pwdValid = false;
        }

        // Validate number or special character
        if (pwdValue.match(/[0-9]/)) {
            $(".icon-number-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-number-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
        } else {
            {
                $(".icon-number-container .fa").removeClass("fa-check").addClass("fa-close");
                $(".icon-number-container").addClass("client-validation-error");
                pwdValid = false;
            }
        }
    }
    if ($("#reset-password").length > 0) {
        validateResetPwdStrength();
        if ($("#PasswordPlaceholder").val() == "") {
            $(".icon-letter-container, .icon-number-container, .icon-charLength-container").removeClass("client-validation-error");
        }
    }

    function validateAccountPwd() {

        var pwdValue = $("#NewPassword").val(); // This works because when it's called it's called from the pwdInput, see end


        // Validate the length
        if (pwdValue.length > 7) {
            $(".icon-charLength-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-charLength-container").removeClass("client-validation-error");
            // $(".icon-charLength-container").css("color","green");
            pwdValid = true;
        } else {
            $(".icon-charLength-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-charLength-container").addClass("client-validation-error");
        }

        // Validate lowercase letter
        if (pwdValue.match(/[a-zA-Z]/)) {
            $(".icon-letter-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-letter-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
            //adding for checkin
        } else {
            $(".icon-letter-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-letter-container").addClass("client-validation-error");
            pwdValid = false;
        }

        // Validate number or special character
        if (pwdValue.match(/[0-9]/)) {
            $(".icon-number-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-number-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
        } else {
            {
                $(".icon-number-container .fa").removeClass("fa-check").addClass("fa-close");
                $(".icon-number-container").addClass("client-validation-error");
                pwdValid = false;
            }
        }

    }
    if ($("#update-pwd-credentials").length > 0) {
        validateAccountPwd();
        if ($("#NewPassword").val() == "") {
            $(".icon-letter-container, .icon-number-container, .icon-charLength-container").removeClass("client-validation-error");
        }
    }

    function validateUserName() {
        // Validate username
        // var unameValue = $(this).val();
        var unameValue = $("#UserName").val();
        if (unameValue.length >= 6) {
            // $('#length').removeClass('invalid').addClass('valid');
            $(".username-icon-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".username-icon-container").removeClass("client-validation-error");
            pwdValid = true;
        } else {
            $(".username-icon-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".username-icon-container").addClass("client-validation-error");
        }
    }
    if ($("#accountpi-step2").length > 0) {
        validateUserName();
        if ($("#Password").val() == "") {
            $(".username-icon-container").removeClass("client-validation-error");
        }
    }
    pwdInput.bind('change keyup input', validatePwdStrength); // Keyup is a bit unpredictable
    pwdInputText.bind('change keyup input', validateUserName); // This is the input type="text" version for showing password
    pwdresetPassword.bind('change keyup input', validateResetPwdStrength);
    pwdAccountSecurity.bind('change keyup input', validateAccountPwd);
    // jQuery Validation
    $(".validate-password").validate({
        // Add error class to parent to use Bootstrap's error styles
        highlight: function(element) {
            $(element).parent('.form-group').addClass('error');
        },
        unhighlight: function(element) {
            $(element).parent('.form-group').removeClass('error');
        },

        rules: {
            // Ensure passwords match
            "passwordCheckMasked": {
                equalTo: "#input-password"
            }
        },

        errorPlacement: function(error, element) {
            if (element.attr("name") == "password" || element.attr("name") == "passwordMasked") {
                error.insertAfter("#input-password");
            } else {
                error.insertAfter(element);
            }
            if (element.attr("name") == "passwordCheck" || element.attr("name") == "passwordCheckMasked") {
                error.insertAfter("#input-password-check");
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function(form, event) {
            //this runs when the form validated successfully
            validatePwdValid(form, event);
        }
    });
});



$(function() {

    $(".form-create-account").each(function() {


        var target = $(this).find('#SelectedPhoneType option:selected').val();

        if (target == "Cell") {

            $(this).find('#checkbox').prop("checked", true);
        }


        var valid = $(this).validate().checkForm();

        if (valid) {
            // alert('hi');
            $(this).find('.next, .wol-btn-primary').prop("disabled", false);
        } else {
            $(this).find('.next, .wol-btn-primary').prop("disabled", true);
        }



    });

    $('#accountpi-step2 #UserName , #accountpi-step2 #Password, #reset-password #PasswordPlaceholder , #reset-password #ConfirmPasswordPlaceholder').on('keypress', function(e) {
        if (e.which == 32)
            return false;
    });
});
//* text - edit functionality for individual field of phone  *// 
jQuery.validator.addMethod("phoneUSA", function(phone_number, element) {
    phone_number = phone_number.replace(/\s+/g, "");
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(\+?1-?)?(\([0-9]\d{2}\)|[0-9]\d{2})-?[0-9]\d{2}-?\d{4}$/);
}, "Please specify a valid phone number");
$(document).ready(function() {
    $(document).on("click touch", ".link-edit", function() {
        //$('.link-edit').on("click touch", function() {
        $("#phoneInfo,#workInfo,#mobileInfo").inputmask({ "mask": "(999) 999-9999", greedy: false });
        // inputmask("999-999-9999").mask(document.querySelectorAll(selector));

        $(this).closest(".info-panel").find(".editable-text").each(function() {
            var data = $(this).attr('title');
            var title = $(this).text();
            $(this).closest(".info-panel").find(".update-section").find('input.form-control').each(function() {

                $(this).closest(".info-panel").find(".update-section").find('input.form-control[id*=' + data + ']').val(title);
                $(this).closest(".info-panel").find(".update-section").find('input.form-control[name*=' + data + ']').val(title);
            });
        });

    });

});
$(document).ready(function() {
    $("#contactPhoneform").validate({
        rules: {
            LandLine: {
                required: true,
                //number: true,
                phoneUSA: true,
                //alphanumeric: true

            },
        },
        messages: {
            LandLine: {
                required: ContactPhoneForm.ContactPhoneFormLandlineRequired,
                // number: "Please enter only number",
                phoneUSA: ContactPhoneForm.ContactPhoneFormLandlineMinLength,
                // alphanumeric: "Please enter only alphanumeric characters",

            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });


    //$("#phoneInfo").blur(function() {
    $(document).on("blur touch", "#phoneInfo", function() {
        //  alert("Handler for .blur() called.");
        $("#contactPhoneform").valid();

    });

    $("#contactWorkform").validate({
        rules: {
            Work: {
                required: true,
                //number: true,
                // minlength: 10,
                phoneUSA: true

            },
        },
        messages: {
            Work: {
                required: ContactWorkForm.ContactWorkFormWorkRequired,
                // number: "Please enter only number",
                // minlength: ContactWorkForm.ContactWorkFormWorkMinLength,
                phoneUSA: ContactWorkForm.ContactWorkFormWorkMinLength,
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });
    //$("#workInfo").blur(function() {
    $(document).on("blur touch", "#workInfo", function() {
        //  alert("Handler for .blur() called.");
        $("#contactWorkform").valid();

    });

    $("#contactMobileform").validate({
        rules: {
            Mobile: {
                required: true,
                // number: true,
                // minlength: 10,
                // maxlength:12,
                // phoneUS:true,
                phoneUSA: true

            },
        },
        messages: {
            Mobile: {
                required: ContactMobileForm.ContactWorkFormMobileRequired,
                // minlength: ContactMobileForm.ContactWorkFormMobileMinLength,
                phoneUSA: ContactMobileForm.ContactWorkFormMobileMinLength,
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });
    //$("#mobileInfo").blur(function() {
    $(document).on("blur touch", "#mobileInfo", function() {
        //  alert("Handler for .blur() called.");
        $("#contactMobileform").valid();

    });
});
// Inputmask.extendAliases({
//     'numeric': {
//         autoUnmask: true,
//         allowPlus: false,
//         allowMinus: false
//     }
// });
//$("#NewPassword").on('blur change keyup', function() {
$(document).on("blur change keyup touch", "#NewPassword", function() {
    //alert("Handler for .blur() called.");
    var pwdValue = $("#NewPassword").val();

    // Validate the length
    if (pwdValue.length > 7) {
        $(".icon-charLength-container .fa").removeClass("fa-close").addClass("fa-check");
        $(".icon-charLength-container").removeClass("client-validation-error");
        // $(".icon-charLength-container").css("color","green");
        pwdValid = true;
    } else {
        $(".icon-charLength-container .fa").removeClass("fa-check").addClass("fa-close");
        $(".icon-charLength-container").addClass("client-validation-error");
    }

    // Validate lowercase letter
    if (pwdValue.match(/[a-zA-Z]/)) {
        $(".icon-letter-container .fa").removeClass("fa-close").addClass("fa-check");
        $(".icon-letter-container").removeClass("client-validation-error");

        pwdValid = pwdValid && true;
        //adding for checkin
    } else {
        $(".icon-letter-container .fa").removeClass("fa-check").addClass("fa-close");
        $(".icon-letter-container").addClass("client-validation-error");
        pwdValid = false;
    }

    // Validate number or special character
    if (pwdValue.match(/[0-9]/)) {
        $(".icon-number-container .fa").removeClass("fa-close").addClass("fa-check");
        $(".icon-number-container").removeClass("client-validation-error");

        pwdValid = pwdValid && true;
    } else {

        $(".icon-number-container .fa").removeClass("fa-check").addClass("fa-close");
        $(".icon-number-container").addClass("client-validation-error");
        pwdValid = false;
    }


});
$(document).ready(function() {
    $(document).on("click touch", ".link-edit", function() {
        //$('.link-edit').on("click touch", function() {

        // **MAINTAIN ACCOUNT- SECURITY  SETING UPDATE FUNCTIONALITY**//
        var selectsecurity1 = $('.selected-question1').text();
        var selectsecurity2 = $('.selected-question2').text();
        var selectsecurity3 = $('.selected-question3').text();
        var selectsecurity4 = $('.selected-question4').text();


        $('#SecurityOption option[value="' + selectsecurity1 + '"]').attr('selected', 'selected');

        $('#SecurityOption2 option[value="' + selectsecurity2 + '"]').attr('selected', 'selected');

        $('#SecurityOption3 option[value="' + selectsecurity3 + '"]').attr('selected', 'selected');

        $('#SecurityOption4 option[value="' + selectsecurity4 + '"]').attr('selected', 'selected');

        //*Update security question*//

        $("#createaccount-security-questions .act-update-btn").click(function(e) {

            e.preventDefault();


            if ($("#createaccount-security-questions").valid()) {
                //alert("success");

                $("#createaccount-security-questions").valid();

                var updatedQuestion1 = $('#securityOption').next('.option-textholder').text();
                // alert(updatedQuestion1);

                var updatedQuestion2 = $('#securityOption2').next('.option-textholder').text();

                var updatedQuestion3 = $('#securityOption3').next('.option-textholder').text();

                var updatedQuestion4 = $('#securityOption4').next('.option-textholder').text();


                // $('#account-security-agree-popup').modal('show');
                $('.selected-question1').text(updatedQuestion1);
                $('.selected-question2').text(updatedQuestion2);
                $('.selected-question3').text(updatedQuestion3);
                $('.selected-question4').text(updatedQuestion4);
            }
        });

        $(".custom-select").change(function() {
            var selectedOption = $(this).find(":selected").text();
            $(this).next(".option-textholder").text(selectedOption);
        }).trigger('change');


        $(".custom-select").each(function() {
            $(this).on({
                'focus': function() {
                    $(this).parent().addClass('is-selected');
                    if ($(this).val() == "") {
                        $(this).parent().next("label.floating-label").css({
                            'color': '#006671'
                        });
                    } else if ($(this).val() != "") {
                        console.log("select val");
                        $(this).parent().next("label.floating-label").css({
                            'color': '#006671'
                        });
                    }
                },
                'blur': function() {
                    if ($('option:selected', this).text() == "") {
                        $(this).parent().removeClass('is-selected');
                    }
                    $(this).parent().next("label.floating-label").css({
                        'color': '#717171'
                    });
                }
            });
            if ($(this).parent().find('.option-textholder').text().length > 0) {
                $(this).parent().addClass('is-selected');
                $(this).parents().next("label.floating-label").css({
                    'color': '#717171'
                });
            }
        });

        var unameValue = $("#UserName").val();
        var pwdValid = false;
        if (unameValue != undefined && unameValue.length >= 6) {
            // $('#length').removeClass('invalid').addClass('valid');
            $(".username-icon-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".username-icon-container").removeClass("client-validation-error");
            pwdValid = true;
        } else {
            $(".username-icon-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".username-icon-container").addClass("client-validation-error");
        }
        var pwdValue = $("#NewPassword").val();

        // Validate the length
        if (pwdValue != undefined && pwdValue.length > 7) {
            $(".icon-charLength-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-charLength-container").removeClass("client-validation-error");
            // $(".icon-charLength-container").css("color","green");
            pwdValid = true;
        } else {
            $(".icon-charLength-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-charLength-container").removeClass("client-validation-error");
        }

        // Validate lowercase letter
        if (pwdValue != undefined && pwdValue.match(/[a-zA-Z]/)) {
            $(".icon-letter-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-letter-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
            //adding for checkin
        } else {
            $(".icon-letter-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-letter-container").removeClass("client-validation-error");
            pwdValid = false;
        }

        // Validate number or special character
        if (pwdValue != undefined && pwdValue.match(/[0-9]/)) {
            $(".icon-number-container .fa").removeClass("fa-close").addClass("fa-check");
            $(".icon-number-container").removeClass("client-validation-error");

            pwdValid = pwdValid && true;
        } else {

            $(".icon-number-container .fa").removeClass("fa-check").addClass("fa-close");
            $(".icon-number-container").removeClass("client-validation-error");
            pwdValid = false;
        }





        //for custom-textfield//
        $(".custom-textfield .form-control").each(function() {
            $(this).on({
                'focus': function() {
                    $(this).siblings().addClass('is-text');
                    $(this).next("label").css({
                        'color': '#006671'
                    });
                },
                'blur': function() {
                    if ($(this).val() == "") {
                        $(this).siblings().removeClass('is-text');
                        $(this).next("label").css({
                            'color': '#717171'
                        });
                    } else if ($(this).val() != "") {
                        $(this).next("label").css({
                            'color': '#717171'
                        });
                        // $(this).siblings().addClass('is-text');
                    }
                }
            });
            if ($(this).val().length > 0) {
                $(this).siblings().addClass('is-text');
            } else {
                $(this).siblings().removeClass('is-text');
            }
        });



        // **MAINTAIN ACCOUNT- SECURITY  SETING UPDATE FUNCTIONALITY ENDS**//


        $(".update-section").hide();
        $(".link-edit , .editable-container").show();
        //console.log($(this));
        $(this).hide();
        $(this).closest(".editable-info-panel").find(".update-section").show();
        $(this).closest(".editable-info-panel").find(".editable-container").hide();

    });

    //$("#phone-content .link-edit,#account-credential .link-edit,.editable-security-question .link-edit").click(function() {
    $(document).on("click touch", "#phone-content .link-edit,#account-credential .link-edit,.editable-security-question .link-edit", function() {
        $(".update-section").hide();
        $(".link-edit , .editable-container").show();
        $(this).closest(".editable-container").next(".update-section").show();
        $(this).closest(".editable-container").hide();
    });

    $('.edit-info').focus();

    //$(".act-cancel-btn").on("click touch", function() {
    $(document).on("click touch", ".act-cancel-btn", function() {
        $(this).closest(".editable-info-panel").find(".editable-text").each(function() {
            var editedVal = $(this).val();
            var editedText = $(this).text();
            $(this).text(editedText);
        });

        $(this).closest(".editable-info-panel").find(".link-edit").show();
        $(this).closest(".editable-info-panel").find(".update-section").hide();
        $(this).closest(".editable-info-panel").find(".editable-container").show();

        $(".custom-textfield .form-control").each(function() {
            $(this).on({
                'focus': function() {
                    $(this).siblings().addClass('is-text');
                    $(this).next("label").css({
                        'color': '#006671'
                    });
                },
                'blur': function() {
                    if ($(this).val() == "") {
                        $(this).siblings().removeClass('is-text');
                        $(this).next("label").css({
                            'color': '#717171'
                        });
                    } else if ($(this).val() != "") {
                        $(this).next("label").css({
                            'color': '#717171'
                        });
                        // $(this).siblings().addClass('is-text');
                    }
                }
            });
            if ($(this).val().length > 0) {
                $(this).siblings().addClass('is-text');
            } else {
                $(this).siblings().removeClass('is-text');
            }
        });

    });

    $(".act-agree-condition,.act-otp-submit-btn").click(function() {

        $(".editable-info-panel").find(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").show();


        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".update-section").hide();
        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".editable-container").show();
    });

    //** Contact Info form validations **//


    //$("#mobileInfo,#phoneInfo,#workInfo").mask("999-999-9999");
    //$("#phoneInfo").inputmask({ "mask": "(999) 999-9999" });

    //$('.radio input:radio').change(function() {
    $(document).on("change touch", ".radio input:radio", function() {
        if  ($(this).val()  ===  '1') {


            $(".custom-select").change(function() {
                var selectedOption = $(this).find(":selected").text();
                $(this).next(".option-textholder").text(selectedOption);
            }).trigger('change');


            $(".custom-select").each(function() {
                $(this).on({
                    'focus': function() {
                        $(this).parent().addClass('is-selected');
                        if ($(this).val() == "") {
                            $(this).parent().next("label.floating-label").css({
                                'color': '#006671'
                            });
                        } else if ($(this).val() != "") {
                            console.log("select val");
                            $(this).parent().next("label.floating-label").css({
                                'color': '#006671'
                            });
                        }
                    },
                    'blur': function() {
                        if ($('option:selected', this).text() == "") {
                            $(this).parent().removeClass('is-selected');
                        }
                        $(this).parent().next("label.floating-label").css({
                            'color': '#717171'
                        });
                    }
                });
                if ($(this).parent().find('.option-textholder').text().length > 0) {
                    $(this).parent().addClass('is-selected');
                    $(this).parents().next("label.floating-label").css({
                        'color': '#717171'
                    });
                }
            });

            $("#account-are-you-sure").modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });
        } 
        else 
        if  ($(this).val()  ===  '2') {


            $(".custom-select").change(function() {
                var selectedOption = $(this).find(":selected").text();
                $(this).next(".option-textholder").text(selectedOption);
            }).trigger('change');


            $(".custom-select").each(function() {
                $(this).on({
                    'focus': function() {
                        $(this).parent().addClass('is-selected');
                        if ($(this).val() == "") {
                            $(this).parent().next("label.floating-label").css({
                                'color': '#006671'
                            });
                        } else if ($(this).val() != "") {
                            console.log("select val");
                            $(this).parent().next("label.floating-label").css({
                                'color': '#006671'
                            });
                        }
                    },
                    'blur': function() {
                        if ($('option:selected', this).text() == "") {
                            $(this).parent().removeClass('is-selected');
                        }
                        $(this).parent().next("label.floating-label").css({
                            'color': '#717171'
                        });
                    }
                });
                if ($(this).parent().find('.option-textholder').text().length > 0) {
                    $(this).parent().addClass('is-selected');
                    $(this).parents().next("label.floating-label").css({
                        'color': '#717171'
                    });
                }
            });

            $("#account-are-you-sure-other").modal({
                show: true,
                backdrop: 'static',
                keyboard: false
            });

        } 
    });
    // $("#standardAddressLink").click(function() {
    //     $("#account-are-you-sure").modal("show");
    //     $("#otherAddressRadio").prop("checked", false);
    //     $("#standardAddress").prop("checked", true);
    // });
    //$(".otherAddressContainer .link-edit").click(function() {
    $(document).on("click touch", ".otherAddressContainer .link-edit", function() {
        $("#otherAdressMain").removeClass("hide");
    });

    //$("#account-are-you-sure .act-sure-btn").click(function() {
    $(document).on("click touch", "#account-are-you-sure .act-sure-btn", function() {
        $(".otherMailingAddress p").removeClass("hide");
        $(".otherMailingAddress .update-section").css("display", "none");
    });

    $("#account-are-you-sure-other .act-sure-btn").click(function() {
        $(".otherMailingAddress p,.otherMailingAddress .update-section").removeClass("hide");
        $(".otherMailingAddress .update-section").show();
    });

    $("#account-are-you-sure .cancel,#account-are-you-sure .close").click(function() {
        $("#standardAddress").prop("checked", false);
        $("#otherAddressRadio").prop("checked", true);
    });

    $("#account-are-you-sure-other .cancel,#account-are-you-sure-other .close").click(function() {
        $("#otherAddressRadio").prop("checked", false);
        $("#standardAddress").prop("checked", true);
    });


    $("#selectRegion").change(function() {
        var selectedCountry = $("#selectRegion option:selected").text().toLowerCase();
        if (selectedCountry == "foreign") {
            $("#selectStateInfo").parent().parent(".custom-selectbox").hide();
            $("#selectCountryInfo").parent().parent(".custom-selectbox").show();
            $("#SelectedForeignState").parent(".custom-textfield").show();
        } else {
            $("#selectStateInfo").parent().parent(".custom-selectbox").show();
            $("#selectCountryInfo").parent().parent(".custom-selectbox").hide();
            $("#selectCountryInfo").parent().parent(".custom-selectbox").next(".errorMessage").text("");
            $(".otherSelectedForeignState").parent().parent(".custom-selectbox").hide();
            $("#SelectedForeignState").parent(".custom-textfield").hide();
            $("#SelectedForeignState").parent(".custom-textfield").next(".errorMessage").text("");
        }

    });

    $("#OtherselectRegion").change(function() {
        var otherselectedCountry = $("#OtherselectRegion option:selected").text().toLowerCase();
        if (otherselectedCountry == "foreign") {
            $("#otherselectStateInfo").parent().parent(".custom-selectbox").hide();
            $("#otherselectCountryInfo").parent().parent(".custom-selectbox").show();
            $("#OtherSelectedForeignState").parent(".custom-textfield").show();
        } else {
            $("#otherselectStateInfo").parent().parent(".custom-selectbox").show();
            $("#otherselectCountryInfo").parent().parent(".custom-selectbox").hide();
            $("#otherselectCountryInfo").parent().parent(".custom-selectbox").next(".errorMessage").text("");
            $("#OtherSelectedForeignState").parent(".custom-textfield").hide();
            $("#OtherSelectedForeignState").parent(".custom-textfield").next(".errorMessage").text("");
        }

    });
    // $("#account-are-you-sure .act-sure-btn").click(function() {
    //     // $(".otherAddressContainer").addClass("hide");
    //     // $(".otherMailingAddress p").addClass("hide");
    // });


    $("#contactPhoneform .act-update-condition").click(function() {
        if ($("#landlinesubscription").val() == "True") {
            if ($("#contactPhoneform").valid()) {
                $("#contactPhoneform").valid();
                $('#account-phone-popup').show();
                $(".modal-backdrop").css("display", "block");
            }

            return false;
        } else {
            $('#account-phone-popup').hide();
            $(".modal-backdrop").css("display", "none");
            return true;
        }

        $(".editable-info-panel").find(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").show();

        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".update-section").hide();
        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".editable-container").show();
    });
    $("#contactWorkform .act-update-condition").click(function() {
        if ($("#worksubscription").val() == "True") {
            if ($("#contactWorkform").valid()) {
                $("#contactWorkform").valid();
                $(".modal-backdrop").css("display", "block");
                $('#account-work-popup').show();
            }
            return false;
        } else {
            $(".modal-backdrop").css("display", "none");
            $('#account-work-popup').hide();
            return true;
        }

        $(".editable-info-panel").find(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").show();

        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".update-section").hide();
        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".editable-container").show();
    });

    $("#contactMobileform .act-update-condition").click(function() {
        if ($("#mobilesubscription").val() == "True") {
            if ($("#contactMobileform").valid()) {
                $("#contactMobileform").valid();
                $(".modal-backdrop").css("display", "block");
                $('#account-mobile-popup').show();
            }
            return false;
        } else {
            $(".modal-backdrop").css("display", "none");
            $('#account-mobile-popup').hide();
            return true;
        }

        $(".editable-info-panel").find(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").show();

        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".update-section").hide();
        $(".link-edit,.link-edit-landline,.link-edit-mobile,.link-edit-work").closest(".editable-info-panel").find(".editable-container").show();
    });
    $("#account-phone-popup .close").click(function() {
        $("#account-phone-popup").css("display", "none");
        $("#account-phone-popup").next(".modal-backdrop").css("display", "none")
    });
    $("#account-work-popup .close").click(function() {
        $("#account-work-popup").css("display", "none");
        $("#account-work-popup").next(".modal-backdrop").css("display", "none")
    });
    $("#account-mobile-popup .close").click(function() {
        $("#account-mobile-popup").css("display", "none");
        $("#account-mobile-popup").next(".modal-backdrop").css("display", "none")
    });
    $("#phone-content .link-edit").click(function() {

        $(".modal-backdrop").css("display", "none")
    });
    $("#phone-content .act-update-condition").click(function() {
        // if ($("#contactPhoneform").valid()) {
        //     $("#contactPhoneform").valid();
        //     $(".modal-backdrop").css("display", "block");
        // }
        // if ($("#contactMobileform").valid()) {
        //     $("#contactMobileform").valid();
        //     $(".modal-backdrop").css("display", "block");
        // }
        // if ($("#contactWorkform").valid()) {
        //     $("#contactWorkform").valid();
        //     $(".modal-backdrop").css("display", "block");
        // }
        //$(".modal-backdrop").css("display", "block")
    });

    $(document).ready(function() {

        var unameValue = $("#UserName").val();
        if (unameValue) {
            if (unameValue.length >= 6) {
                // $('#length').removeClass('invalid').addClass('valid');
                $(".username-icon-container .fa").removeClass("fa-close").addClass("fa-check");
                $(".username-icon-container").removeClass("client-validation-error");
                pwdValid = true;
            } else {
                $(".username-icon-container .fa").removeClass("fa-check").addClass("fa-close");
                $(".username-icon-container").addClass("client-validation-error");
            }
        }
        // if ($('.container-fluid').find('.preference-container').length != 0) {
        //     $('.tabs-side .tabs a').on('click', function(e) {
        //         localStorage.setItem('activeTab', $(this).attr('href'));
        //     });
        //     var activeTab = localStorage.getItem('activeTab');
        //     if (activeTab) {
        //         $('.tabs-side .tabs a,.tabs-side .item').removeClass('active');
        //         $(activeTab).addClass('active');
        //         $('.tabs-side .tabs a[href="' + activeTab + '"]').addClass('active');

        //     }
        // } else {
        //     localStorage.removeItem('activeTab');
        // }
        // if ($(window).width() <= 768) {
        //     if ($('.container-fluid').find('.preference-container').length != 0) {
        //         $('.tabs-side section.item').on('click', function(e) {
        //             localStorage.setItem('activeTab', $(this).attr('data-title'));
        //         });
        //         var activeTab = window.localStorage.getItem('activeTab');
        //         if (activeTab) {
        //             $('.tabs-side section.item,.tabs-side .item').removeClass('active');
        //             $(activeTab).addClass('active');
        //             $('.tabs-side section.item[data-title="' + activeTab + '"]').addClass('active');

        //         }
        //     } else {
        //         localStorage.removeItem('activeTab');
        //     }
        // }
        // if ($('.container-fluid').find('.preference-container').length != 0) {
        //     $('.tabs-side .tabs a').on('click', function(e) {
        //         localStorage.setItem('activeTab', $(this).attr('href'));
        //     });
        //     var activeTab = localStorage.getItem('activeTab');
        //     if (activeTab) {
        //         $('.tabs-side .tabs a,.tabs-side .item').removeClass('active');
        //         $(activeTab).addClass('active');
        //         $('.tabs-side .tabs a[href="' + activeTab + '"]').addClass('active');

        //     }
        // } else {
        //     localStorage.removeItem('activeTab');
        // }
        // if ($(window).width() <= 768) {
        //     if ($('.container-fluid').find('.preference-container').length != 0) {
        //         $('.tabs-side section.item').on('click', function(e) {
        //             localStorage.setItem('activeTab', $(this).attr('data-title'));
        //         });
        //         var activeTab = window.localStorage.getItem('activeTab');
        //         if (activeTab) {
        //             $('.tabs-side section.item,.tabs-side .item').removeClass('active');
        //             $(activeTab).addClass('active');
        //             $('.tabs-side section.item[data-title="' + activeTab + '"]').addClass('active');

        //         }
        //     } else {
        //         localStorage.removeItem('activeTab');
        //     }
        // }
    });

    $(".signed-in #_logout").click(function() {
        $('#phone-content form').keypress(function(event) {
            // localStorage.clear();	
            localStorage.removeItem('activeTab');
        });
    });
    $('#phone-content form').keypress(function(event) {

        if (event.keyCode == 13 || event.which == 13) {

            var errormsg = $("#phone-content form .errorMessage label").text();

            if (errormsg == '') {
                $(this).find('button.act-update-btn').trigger("click");
                $("#phone-content form").get(0).allowDefault = false;
            } else {
                event.preventDefault();
            }
            event.preventDefault();
            //         $("#update-pwd-credentials").valid();
            $("#contactPhoneform").valid();
            $("#contactWorkform").valid();
            $("#contactMobileform").valid();

        }
    });
    $('#contactEmailForm').keypress(function(event) {

        if (event.keyCode == 13 || event.which == 13) {

            var errormsg = $("#contactEmailForm .errorMessage label").text();

            if (errormsg == '') {
                $(this).find('button.act-update-btn').trigger("click");
                $("#contactEmailForm").get(0).allowDefault = false;
            } else {
                event.preventDefault();
            }
            event.preventDefault();
            //         $("#update-pwd-credentials").valid();
            $("#contactEmailForm").valid();

        }
    });

    // $('#phone-content form').keypress(function(event) {
    //     if (event.keyCode == 13 || event.which == 13) {
    //         if ($(this).isValid()) {
    //             // return false;
    //             //alert("success");
    //             $(this).valid();
    //             $('#account-phone-popup').modal('show');
    //         } else {

    //             $('#account-phone-popup').modal('hide');
    //         }

    //         // event.preventDefault();
    //         // return false;
    //         // $(this).find('button.act-update-btn').trigger("click");
    //         // alert("Enter");
    //         // if (!$("#contactPhoneform").valid()) {
    //         //     return false;
    //         //     //alert("success");
    //         // } else {

    //         //     $('#account-phone-popup').modal('show');
    //         // }

    //         // event.preventDefault();
    //         // $("#contactPhoneform").valid();
    //         // $("#contactWorkform").valid();
    //         // $("#contactMobileform").valid();
    //         // if ($(this).valid()) {
    //         //     alert("true");
    //         //     $(this).find('button.act-update-btn').trigger("click");
    //         // }
    //         // $("#contactPhoneform").find('button.act-update-btn').click(function() {
    //         //  $("#contactPhoneform").valid();
    //         // });
    //         // if ($('#contactPhoneform').valid()) {
    //         //     $("#account-phone-popup").modal("show");
    //         //     // $(this).find('button.act-update-btn').trigger("click");
    //         // }
    //         // $(this).find('button.act-update-btn').trigger("click");

    //         //event.preventDefault();
    //         // $("#contactAddress").valid();
    //         // $("#update-credentials").valid();
    //         // $("#otherAddressform").valid();
    //         // $("#contactEmailForm").valid();
    //         // $("#createaccount-security-questions1").valid();
    //         // $("#createaccount-security-questions2").valid();
    //         // $("#createaccount-security-questions3").valid();
    //         // $("#createaccount-security-questions4").valid();
    //         // //var validator13 = $("#otherAddressform").validate();

    //     }
    // });

    $('#otpmodal_close').click(function() {
        $('#account-otp-popup').css("display", "none");


    });
    $("#account-otp-popup .close").click(function() {
        $("#account-otp-popup").css("display", "none");
        $("#account-otp-popup").next(".modal-backdrop").css("display", "none")
    });

    // $('#account-email-popup .close').click(function() {
    //     $('#account-email-popup').css("display", "none");


    // });
    //$('#contactAddress #PostalCode,#otherAddressform #otherzipCodeInfo').mask("99999?-9999", "99999", { autoclear: false });
    $('#contactAddress #PostalCode,#otherAddressform #otherzipCodeInfo').inputmask("99999[-9999]", { greedy: false });

    $("#PostalCode").blur(function() {
        //  alert("Handler for .blur() called.");
        // alert("valid");
        $("#contactAddress").valid();

    });
    $("#otherzipCodeInfo").blur(function() {
        //  alert("Handler for .blur() called.");
        // alert("valid");
        $("#otherAddressform").valid();

    });

    $("#contactEmailForm .act-update-btn").click(function() {
        //alert($("#emailischeckedforebill").val());
        if ($("#emailischeckedforebill").val() == "True") {
            if ($("#contactEmailForm").valid()) {
                $("#contactEmailForm").valid();
                //alert("succ");
                $("#account-email-popup").modal("show");
            }

            // alert($("#emailischeckedforebill").val());

            return false;
        } else {
            $("#account-email-popup").modal("hide");
            return true;
        }
    });
    // $('#account-are-you-sure-other,#account-are-you-sure').modal({
    //     backdrop: 'static',
    //     //keyboard: true
    // });
    $(".link-edit").click(function() {

        $(".link-edit").closest(".editable-container").parent(".info-panel-body").next("form.update-section").find(".errorMessage label.error").remove();
        $(".link-edit").closest(".editable-container").next("form.update-section").find(".errorMessage label.error").remove();
    });
    $(".act-cancel-btn").click(function() {
        $(this).closest("form")[0].reset();
        $(this).closest("form.update-section").find(".errorMessage label.error").remove();
        //for custom-textfield cancel remove value//
        if ($(".custom-textfield .form-control").val() == "") {
            $(".custom-textfield .form-control").siblings().removeClass('is-text');
            $(".custom-textfield .form-control").next("label").css({
                'color': '#717171'
            });
        }

        $("form .server-validation-error").addClass("hide");
        $("form .errorMessage").removeClass("client-validation-error");
        $("form .errorMessage .fa").removeClass("fa-check").addClass("fa-close");


        // var validator7 = $("#otherAddressform").validate();
        // validator7.resetForm();

        var validator1 = $("#update-pwd-credentials").validate();

        var validator2 = $("#contactPhoneform").validate();
        var validator3 = $("#contactWorkform").validate();
        var validator4 = $("#contactMobileform").validate();
        var validator5 = $("#contactAddress").validate();
        var validator6 = $("#update-credentials").validate();
        if (validator1 != undefined && validator1.length >= 0) {
            validator1.resetForm();
        }
        if (validator2 != undefined && validator2.length >= 0) {
            validator2.resetForm();
        }
        if (validator3 != undefined && validator3.length >= 0) {
            validator3.resetForm();
        }
        if (validator4 != undefined && validator4.length >= 0) {
            validator4.resetForm();
        }
        if (validator5 != undefined && validator5.length >= 0) {
            validator5.resetForm();
        }
        if (validator6 != undefined && validator6.length >= 0) {
            validator6.resetForm();
        }
        if (validator8 != undefined && validator8.length >= 0) {
            var validator8 = $("#contactEmailForm").validate();
            validator8.resetForm();
        }
        if (validator9 != undefined && validator9.length >= 0) {
            var validator9 = $("#createaccount-security-questions1").validate();
            validator9.resetForm();
        }
        if (validator10 != undefined && validator10.length >= 0) {
            var validator10 = $("#createaccount-security-questions2").validate();
            validator10.resetForm();
        }

        if (validator11 != undefined && validator11.length >= 0) {
            var validator11 = $("#createaccount-security-questions3").validate();
            validator11.resetForm();
        }
        if (validator12 != undefined && validator12.length >= 0) {
            var validator12 = $("#createaccount-security-questions4").validate();
            validator12.resetForm();
        }
        if (validator13 != undefined && validator13.length >= 0) {
            var validator13 = $("#otherAddressform").validate();
            validator13.resetForm();
        }


    });
});
$(".load-content").click(function () {
    $(".loader-contentarea").addClass("show");
});

// To check if the page is in editor mode 
function isPageEditor() {
    if (typeof Sitecore == "undefined") {
        return false;
    }
    if (typeof Sitecore.PageModes == "undefined" || Sitecore.PageModes == null) {
        return false;
    }
    return Sitecore.PageModes.PageEditor != null;
}

//  Sitecore requirement
$(document).ajaxStart(function(){ 
    if(isPageEditor()==false)
    {
        $('.loader-contentarea').addClass('show'); 
    }
});
$(document).ajaxStop(function(){ 
    if(isPageEditor()==false)
    {
        $('.loader-contentarea').removeClass('show'); 
    }
});
    
/*  FOrgot username validation starts */
$("#forgot-username").validate({
    ignore: [],
    rules: {
        "hiddenRecaptcha": {
            required: function() {
                if (grecaptcha.getResponse() == '') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        UserName: {
            required: true,
            validateEmail: true
        },
        Email: {
            required: true,
            validateEmail: true
        },

    },
    messages: {
        UserName: {
            required: forgotUserNameValidation.forgotUserNameUserNameRequired,
            validateEmail: forgotUserNameValidation.forgotUserNameUserNamevalidateEmail

        },
        Email: {
            required: forgotUserNameValidation.forgotUserNameUserNameRequired,
            validateEmail: forgotUserNameValidation.forgotUserNameUserNamevalidateEmail

        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

//FOrgot password

$("#forgotPasswordStep1").validate({
    ignore: [],
    rules: {
        "hiddenRecaptcha": {
            required: function() {
                if (grecaptcha.getResponse() == '') {
                    return true;
                } else {
                    return false;
                }
            }
        },

        Username: {
            required: true,
            minlength: 6,
            maxlength: 50,
            // alphanumeric: true comente as perbug 2544
            usernameAllowSpecialCharacters: true

        },
        EmailPlaceholder: "required"

    },
    messages: {
        Username: {
            required: forgotPasswordValidation.forgotPasswordUserNameRequired,
            minlength: forgotPasswordValidation.forgotPasswordUserNameminLength,
            maxlength: forgotPasswordValidation.forgotPasswordUserNamemaxLength,
            usernameAllowSpecialCharacters: forgotPasswordValidation.forgotPasswordUserNamespecialCharcaters
                // alphanumeric: forgotPasswordValidation.forgotPasswordUserNamealpheNumeric

        },
        EmailPlaceholder: "Please enter your email address"
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});
// $(document).ready(function() {




$("#reset-password").validate({
    ignore: [],
    rules: {
        "hiddenRecaptcha": {
            required: function() {
                if (grecaptcha.getResponse() == '') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        Password: {
            required: true,
            maxlength: 64,
            passwordSpecialCharacters: true
        },

        ConfirmPassword: {

            equalTo: "#PasswordPlaceholder"
        }

    },
    messages: {
        Password: {
            required: resetPasswordValidation.resetPasswordRequired,
            maxlength: resetPasswordValidation.resetPasswordMaxLength,
            passwordSpecialCharacters: resetPasswordValidation.resetPasswordpasswordSpecialCharacters
        },
        ConfirmPassword: {
            required: resetPasswordValidation.resetPasswordConfirmPasswordRequired,
            equalTo: resetPasswordValidation.resetPasswordConfirmPasswordEqualTo
        }

    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

$("#demomixing").validate({
    rules: {
        Fname: "required123",

    },
    messages: {
        Fname: "Please enter your email address",
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

$("#createaccount-security-questions").validate({
    rules: {
        SecurityOption: "required",
        firstSecurityQuestAnswertxt: {
            required: true,
            minlength: 5,
            maxlength: 50,
            normalizer: function(value) {
                    return $.trim(value);
                }
                //nowhitespace:true
        },
        SecurityOption2: "required",
        secondSecurityQuestAnswertxt: {
            required: true,
            minlength: 5,
            maxlength: 50,
            normalizer: function(value) {
                return $.trim(value);
            }
        },
        SecurityOption3: "required",
        thirdSecurityQuestAnswertxt: {
            required: true,
            minlength: 5,
            maxlength: 50,
            normalizer: function(value) {
                return $.trim(value);
            }
        },
        SecurityOption4: "required",
        fourthSecurityQuestAnswertxt: {
            required: true,
            minlength: 5,
            maxlength: 50,
            normalizer: function(value) {
                return $.trim(value);
            }
        },

    },
    messages: {
        SecurityOption: createAccountSecurityQuestionValidation.createAccountSecurityMessageSecurityOption,
        firstSecurityQuestAnswertxt: {
            required: createAccountSecurityQuestionValidation.createAccountSecurityfirstAnswerRequired,
            minlength: createAccountSecurityQuestionValidation.createAccountSecurityfirstAnswerMinlength,
            maxlength: createAccountSecurityQuestionValidation.createAccountSecurityfirstAnswerMaxlength
        },
        SecurityOption2: createAccountSecurityQuestionValidation.createAccountSecurityMessageSecurityOption2,
        secondSecurityQuestAnswertxt: {
            required: createAccountSecurityQuestionValidation.createAccountSecuritySecondAnswerRequired,
            minlength: createAccountSecurityQuestionValidation.createAccountSecuritySecondAnswerMinlength,
            maxlength: createAccountSecurityQuestionValidation.createAccountSecuritySecondAnswerMaxlength
        },
        SecurityOption3: createAccountSecurityQuestionValidation.createAccountSecurityMessageSecurityOption3,
        thirdSecurityQuestAnswertxt: {
            required: createAccountSecurityQuestionValidation.createAccountSecurityThirdAnswerRequired,
            minlength: createAccountSecurityQuestionValidation.createAccountSecurityThirdAnswerMinlength,
            maxlength: createAccountSecurityQuestionValidation.createAccountSecurityThirdAnswerMaxlength
        },
        SecurityOption4: createAccountSecurityQuestionValidation.createAccountSecurityMessageSecurityOption4,
        fourthSecurityQuestAnswertxt: {
            required: createAccountSecurityQuestionValidation.createAccountSecurityFourAnswerRequired,
            minlength: createAccountSecurityQuestionValidation.createAccountSecurityFourAnswerMinlength,
            maxlength: createAccountSecurityQuestionValidation.createAccountSecurityFourAnswerMaxlength
        },
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
    }
});
//trim functionality for security question response field space removing before & after text 
$("#accountpi-step2 input,.security-questions-content input,#contactEmailForm input,#phone-content input,#contactAddress input,#otherAddressform input").blur(function() {
    $(this).val($.trim($(this).val()));
});

/*forgot password validation function starts here */

/*forgot password security question forgotPasswordSecurity*/

$("#forgotPasswordSecurity").validate({
    ignore: [],
    rules: {
        "hiddenRecaptcha": {
            required: function() {
                if (grecaptcha.getResponse() == '') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        Answertxt: {
            required: true,
            minlength: 5,
            maxlength: 50
        },

    },
    messages: {
        Answertxt: {
            required: forgotPasswordSecurity.forgotPasswordSecurityAnswerRequired,
            minlength: forgotPasswordSecurity.forgotPasswordSecurityAnswerMinlength,
            maxlength: forgotPasswordSecurity.forgotPasswordSecurityAnswerMaxlength
        }

    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

/*create account authorized - account credentials tab*/ // commented becasue no where  we using this script 
// $("#createaccount-step3").validate({
//     rules: {
//         UserName: {
//             required: true,
//             minlength: 6,
//             maxlength: 50,
//             alphanumeric: true

//         },
//         Password: {
//             required: true,
//             minlength: 6,
//             maxlength: 50
//         },

//         ConfirmPassword: {
//             required: true,

//             equalTo: "#Password"
//         }
//     },
//     messages: {

//         UserName: {
//             required: "Please enter your username",
//             minlength: "Please enter minimum length of 6 characters",
//             maxlength: "Please enter maximum length of 50 characters",
//             alphanumeric: "Please enter only alphanumeric characters"
//         },
//         Password: {
//             required: "Please enter your password",
//             minlength: "Please enter minimum length of 6 characters",
//             maxlength: "Please enter maximum length of 50 characters"
//         },
//         ConfirmPassword: {
//             required: "Please confirm your password",
//             equalTo: "Please give matching password"
//         }

//     },
//     errorPlacement: function(error, element) {
//         error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
//     }
// });

$("#create-account-by-tax-id").validate({
    rules: {
        orgName: "required",
        taxID: {
            required: true,
            number: true
        }

    },
    messages: {
        orgName: "Please enter your Org Name",
        taxID: {
            required: "Please enter your Tax ID",
            number: "Please enter only number"
        },
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

/*create account landing page validation*/

$("#create-account-by-ac-no").validate({
    ignore: [],
    rules: {
        "hiddenRecaptcha": {
            required: function() {
                if (grecaptcha.getResponse() == '') {
                    return true;
                } else {
                    return false;
                }
            }
        },
        NameOnBill: {
            required: true,
            normalizer: function(value) {
                return $.trim(value);
            },
            nameonBillSpecialCharacters: true
        },
        AccountNumber: {
            required: true,
            number: true,
            minlength: 12,
            maxlength: 12
        },
    },

    messages: {
        NameOnBill: {
            required: CreateAccountNameAccountNum.Nameonbillrequired,
            nameonBillSpecialCharacters: CreateAccountNameAccountNum.SpecialCharctersAllowed
        },
        AccountNumber: {
            required: CreateAccountNameAccountNum.AccountNumrequired,
            number: CreateAccountNameAccountNum.OnlyNumberAllowed,
            minlength: CreateAccountNameAccountNum.AccountNumminlength,
            maxlength: CreateAccountNameAccountNum.AccountNummaxlength
        },
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});
/***---submit button enabled after captach valiation checkbox checked  ---***/
function captchCallback() {
    $(".form-create-account").each(function() {
        var valid = $(this).validate().checkForm();
        if (valid) {
            $('.next').prop("disabled", false);
        }
    });
}

// username on bill spcial characters validation for maintain account
// $("#create-account-by-ac-no").on('blur change keyup', function(event) {
//     var nameOnbill = $('#NameOnBill').val();
//     // var passwordVal = $(this).find('#Password').val(); /[$#~*(){}\|<>,=+,/;:'"/?\\\[\]]/;
//     var nameOnbillNotAllowedRegex = /[0-9]/;
//     if ((nameOnbill.match(nameOnbillNotAllowedRegex))) {
//         alert("girish");
//         return false;
//     } else {

//         return true;
//     }

// });
// });
// $(document).ready(function() {
$("#reset-password").submit(function() {
    var valid = $(this).validate().checkForm();
    var passwordField = $(this).find('#PasswordPlaceholder');
    var btnNext = $(this).find('.wol-btn-primary');
    var letters = /[A-Za-z]/;
    var numbers = /[0-9]/;
    // if (passwordField.val().length >= 8 && ((passwordField.val().match(letters)) && (passwordField.val().match(numbers)))) {
    if (passwordField.val().length >= 8) {
        return true;
    } else {
        return false;
    }
});



// enabling validation on blur
$("#PasswordPlaceholder").on('blur change keyup submit', function(event) {
    $("#PasswordPlaceholder").valid();
});
// $("#reset-password").on('blur change keyup submit', function(event) { // commenting because we r handiling through jquery validation 2644

// $("#reset-password").on('blur change keyup submit', function(event) {

//     var passwordVal = $(this).find('#PasswordPlaceholder').val();
//     var usernameNotAllowedRegex = /[`~*(){}\|<>,=+,/;:'"/?\\\[\]]/;
//     var passwordNotAllowedRegex = /[`~{}\|<>,/;'"/\\\[\]]/;

//     // for checking the special characters for password
//     if ((passwordVal.match(passwordNotAllowedRegex))) {
//         $(".password-error-special-char").removeClass("hide");
//         return false;
//         // event.preventDefault();

//     // for checking the special characters for password
//     if ((passwordVal.match(passwordNotAllowedRegex))) {
//         $(".password-error-special-char").removeClass("hide");
//         return false;
//         // event.preventDefault();

//     } else {
//         $(".password-error-special-char").addClass("hide");
//         return true;
//     }
// });
$("#accountpi-step2").on('blur keyup submit', function(event) {
    var userNamVal = $('.username-textbox').val();
    var passwordVal = $(this).find('#Password').val();
    var usernameNotAllowedRegex = /[`~*(){}\|<>,=+,/;:'"/?\\\[\]]/;
    var passwordNotAllowedRegex = /[`~{}\|<>,/;'"/\\\[\]]/;

    if ((userNamVal.match(usernameNotAllowedRegex))) {
        $(".username-error-special-char").removeClass("hide");
        // return false;
        event.preventDefault();

    } else {
        $(".username-error-special-char").addClass("hide");
        // return true;
    }


    $(".server-validation-error").text("");
    if (userNamVal.length > 50) {
        $(".username-error-max-length").removeClass("hide");
        // $(".username-error-max-length").text("Please enter maxlength of 50 characters");
        event.preventDefault();
    } else if ($(".username-error-max-length").length > 0 && userNamVal.length < 50) {
        $(".username-error-max-length").addClass("hide");
        // $(".username-error-max-length").text("");

    }

    // // for checking the special characters for password  // commenting because we r handiling throughjquery validation 2644
    // if ((passwordVal.match(passwordNotAllowedRegex))) {
    //     $(".password-error-special-char").removeClass("hide");
    //     // return false;
    //     event.preventDefault();

    // } else {
    //     $(".password-error-special-char").addClass("hide");
    //     // return true;
    // }


});


// password spcial characters validation for maintain account // commenting because we r handiling throughjquery validation 2644
// $("#update-pwd-credentials").on('blur change keyup submit', function(event) {
//     // var userNamVal = $('.username-textbox').val();
//     var passwordVal = $(this).find('#NewPassword').val();
//     var usernameNotAllowedRegex = /[`~*(){}\|<>,=+,/;:'"/?\\\[\]]/;
//     var passwordNotAllowedRegex = /[`~{}\|<>,/;'"/\\\[\]]/;


//     // for checking the special characters for password
//     if ((passwordVal.match(passwordNotAllowedRegex))) {
//         $(".password-error-special-char").removeClass("hide");
//         // return false;
//         event.preventDefault();

//     } else {
//         $(".password-error-special-char").addClass("hide");
//         // return true;
//     }


// });

$(".form-create-account").on('blur change keyup', function() {
    var valid = $(this).validate().checkForm();
    var usernameNotAllowedRegex = /[`~*(){}\|<>,=+,/;:'"/?\\\[\]]/;
    var acUsername = $(this).find('#UserName');
    var confirmPwd = $(this).find('#ConfirmPassword');
    var btnNext = $(this).find('.next');
    //  var pwdPlaceholder = $(this).find('#ConfirmPasswordPlaceholder');

    if (valid) {

        $(this).find('.next, .wol-btn-primary').prop("disabled", false);

        if (acUsername.length != 0 && acUsername.val().length < 6) {
            btnNext.prop("disabled", true);
        } else if (confirmPwd.length != 0 && confirmPwd.val().length < 8) {
            btnNext.prop("disabled", true);
        }
        // else if (!(confirmPwd.val().match(/[0-9]/) && confirmPwd.val().match(/[a-zA-Z]/))) {
        //     btnNext.prop("disabled", true);
        // }
        else if ($("#accountpi-step2 #UserName").val().length > 50) {
            btnNext.prop("disabled", true);
        } else if (($("#accountpi-step2 #UserName").val().match(usernameNotAllowedRegex))) {
            btnNext.prop("disabled", true);
        }
    } else {
        $(this).find('.next, .wol-btn-primary').prop("disabled", true);
    }
});

// });

$("#CommonSignin").validate({
    rules: {

        Username: {
            required: true,
            // minlength:6,
            // maxlength: 50


        },
        Password: {
            required: true,
            //  minlength: 6,
            // maxlength: 50,

            // validatePassword: true
        },


    },
    messages: {
        Username: {
            required: "Please enter your username",
            // minlength: "Please maintain minimum length of 6 characters",
            // maxlength: "Please maintain minimum length of 50 characters",
            // alphanumeric: "Please enter in alphanumeric format"


        },
        Password: {
            required: "Please enter your password",
            // minlength: "Please enter minimum length of 6 characters",
            // maxlength: "Please enter maximum length of 50 characters",
            // passwordSpecialCharacters: "Please enter atleaast one special character"
            // validatePassword: "Please enter Atleast one number , one special character."
            passwordSpecialCharacters: "Please enter valid passowrd"
        },

    },
    errorPlacement: function(error, element) {
        error.appendTo(element.parent('.errorDiv').next(".errorMessage"));
    }
});

/* Ajax loader for singin click */
$("body").on("click", "button[name='CommonSignin']", function(e) {  

    if ($("#CommonSignin").valid()) {

        if($("#signinerrormessage").html().length!=0){   //code for hiding server side error on success.
            $("#signinerrormessage").empty();       
        }
        var successData="";

        $.ajax({
            url: '/api/wolauthentication/AsyncSignIn',
            type: "POST",
            datatype: "json",
            global:false,
            contenttype: 'application/json; charset=utf-8',
            data: $('#CommonSignin').serialize(),

            success: function(data) {
                successData=data;
            },
            
            complete: function(){

                var errorMessage = successData['ErrorMessage'];
                var returnUrl = successData['ReturnUrl'];
				
                if ((errorMessage === null || errorMessage === "") && returnUrl !== null) {
					$(".loader-contentarea").addClass("show"); // loading ajax loader icon.
                    window.location.href = returnUrl;
                } else if (errorMessage === null || errorMessage === "") {
                    $(".loader-contentarea").addClass("show");  // loading ajax loader icon.
                    var pageRedirect = $('#MyWolRedirectUrl').val();
                    window.location.href = pageRedirect;
                } else if (errorMessage === "locked") {
                    $('#signinerrormessage').html(successData['LockedMessage']);                
                } else if (errorMessage === "error") {
                    $('#signinerrormessage').html(successData['GenericMessage']);
                }
            },
            error: function(xhr) {

                console.log('error');

            }
        });

        return false;
    }
});

$("#accountpi-step1").validate({
    rules: {
        response: "required",
        securityOption: {
            required: true
        }

    },
    messages: {
        response: "Please enter your response",
        securityOption: {
            required: "Please select your security Option"
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
    }
});

$("#createaccount-step1").validate({
    rules: {
        FirstName: "required",
        LastName: "required",

        Email: "required",
        ConfirmEmail: {
            equalTo: "#Email"
        },

        Phone: {
            required: false,
            number: true,
            minlength: 10,
            maxlength: 10

        },

        phonetype: {
            required: true,

        },
        checkbox: {
            required: true,
            minlength: 1
        }
    },
    messages: {

        FirstName: "Please enter your first name",
        LastName: "Please enter your last name",

        Email: "Please enter your email",
        ConfirmEmail: {
            required: "Please confirm your email",
            equalTo: "Please give matching Email"
        },

        Phone: {
            number: "Please enter only number",
            maxlength: "Please enter minimum of 10 numbers",

        },
        phonetype: {
            required: "Please select your phone type",

        },
        checkbox: {
            required: "Agree the terms and condition"
        }

    },
    errorPlacement: function(error, element) {
        error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
    }
});


$("#createaccount-step2").validate({
    rules: {
        response: "required",
        securityOption: {
            required: true
        }

    },
    messages: {
        response: "Please enter your response",
        securityOption: {
            required: "Please select your security Option"
        }
    },
    errorPlacement: function(error, element) {
        error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
    }
});


//create account info validation
$("#accountpi-step2").validate({
    rules: {
        UserName: {
            required: true,
            // minlength:  6,
            // maxlength: 50,
            // usernameAllowSpecialCharacters: true,
            normalizer: function(value) {
                    return $.trim(value);
                }
                // alphanumeric: true

        },
        Password: {
            required: true,
            // minlength: 8,
            maxlength: 64,
            // regex: /[^[_\-!\@^: #$%^&*()+=?]{1}/,
            passwordSpecialCharacters: true
                // alphanumeric: true
        },

        ConfirmPassword: {

            equalTo: "#Password"
        },
        Email: {
            required: true,
            validateEmail: true
        },
        ConfirmEmail: {
            required: true,
            equalTo: "#Email"
        },

        Phone: {
            required: true,
            number: true,
            minlength: 10,
            maxlength: 10

        },
        PhoneNumberExtension: {
            number: true,
            minlength: 1,
            maxlength: 10
        },
        SelectedPhoneType: {
            required: true
        },
        checkbox: {
            required: true,
            minlength: 1
        }
    },
    messages: {

        UserName: {
            required: AccountInfoValidation.accountInfoUserNameRequired,
            maxlength: AccountInfoValidation.accountInfoUserNameMaxlength,
            usernameAllowSpecialCharacters: AccountInfoValidation.accountInfoUserNameUsernameSpecialCharacters

        },
        Password: {
            required: AccountInfoValidation.accountInfoPasswordRequired,
            maxlength: AccountInfoValidation.accountInfoPasswordMaxlength,
            passwordSpecialCharacters: AccountInfoValidation.accountInfoPasswordPasswordSpecialCharacters,
            //regex: AccountInfoValidation.accountInfoPasswordRegex,
            //alphanumeric: AccountInfoValidation.accountInfoPasswordAlphanumeric,
        },
        ConfirmPassword: {
            required: AccountInfoValidation.cpasswordd,
            equalTo: AccountInfoValidation.accountInfoConfirmPasswordEqualTo
        },
        Email: {
            required: AccountInfoValidation.accountInfoEmailRequired,
            validateEmail: AccountInfoValidation.accountInfoEmaiValidateEmaill
        },
        ConfirmEmail: {
            required: AccountInfoValidation.accountInfoConfirmEmailRequired,
            equalTo: AccountInfoValidation.accountInfoConfirmEmailEqualTo
        },

        Phone: {
            required: AccountInfoValidation.accountInfoPhoneRequired,
            number: AccountInfoValidation.accountInfoPhoneNumber,
            minlength: AccountInfoValidation.accountInfoPhoneMinlength,
            maxlength: AccountInfoValidation.accountInfoPhoneMaxlength

        },
        PhoneNumberExtension: {
            number: AccountInfoValidation.accountInfoPhoneNumberExtensionNumber,
            minlength: AccountInfoValidation.accountInfoPhoneNumberExtensionMinlength,
            maxlength: AccountInfoValidation.accountInfoPhoneNumberExtensionMaxlength
        },
        SelectedPhoneType: {
            required: AccountInfoValidation.accountInfoPhoneNumberSelectedPhoneType
        },
        checkbox: {
            required: AccountInfoValidation.accountInfoPhoneNumbercheckbox
        }

    },

    errorPlacement: function(error, element) {
        error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
    }
});

$("#forgotPasswordSecurity input").blur(function() {
    $(this).val($.trim($(this).val()));
});



//** Contact Info form validations **//
//$(document).ready(function() {



//$("#contactEmailForm .act-update-btn").click(function(e) {

//   e.preventDefault();
//create account info validation


//     if ($("#contactEmailForm").valid()) {
//         //alert("success");

//         $("#contactEmailForm").valid();
//         $('#account-email-popup').modal('show');
//     }
// });








// });

$(document).ready(function() {

    //create account info validation
    $("#createaccount-security-questions1").validate({
        rules: {
            SecurityOption: "required",
            firstSecurityQuestAnswer: {
                required: true,
                minlength: 5,
                maxlength: 50,
                normalizer: function(value) {
                    return $.trim(value);
                }

            },
        },
        messages: {
            SecurityOption: AccountSecurityQuestions1.AccountSecurityQuestions1MessageOption1,
            firstSecurityQuestAnswer: {
                required: AccountSecurityQuestions1.AccountSecurityQuestions1firstAnswerRequired,
                minlength: AccountSecurityQuestions1.AccountSecurityQuestions1firstAnswerMinlength,
                maxlength: AccountSecurityQuestions1.AccountSecurityQuestions1firstAnswerMaxlength
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });

    $("#createaccount-security-questions2").validate({
        rules: {
            SecurityOption2: "required",
            secondSecurityQuestAnswer: {
                required: true,
                minlength: 5,
                maxlength: 50,
                normalizer: function(value) {
                    return $.trim(value);
                }

            },
        },
        messages: {
            SecurityOption2: AccountSecurityQuestions2.AccountSecurityQuestions2MessageOption2,
            secondSecurityQuestAnswer: {
                required: AccountSecurityQuestions2.AccountSecurityQuestions2secondAnswerRequired,
                minlength: AccountSecurityQuestions2.AccountSecurityQuestions2secondAnswerMinlength,
                maxlength: AccountSecurityQuestions2.AccountSecurityQuestions2secondAnswerMaxlength,
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });

    $("#createaccount-security-questions3").validate({
        rules: {
            SecurityOption3: "required",
            thirdSecurityQuestAnswer: {
                required: true,
                minlength: 5,
                maxlength: 50,
                normalizer: function(value) {
                    return $.trim(value);
                }

            },
        },
        messages: {
            SecurityOption3: AccountSecurityQuestions3.AccountSecurityQuestions3MessageOption3,
            thirdSecurityQuestAnswer: {
                required: AccountSecurityQuestions3.AccountSecurityQuestions3thirdAnswerRequired,
                minlength: AccountSecurityQuestions3.AccountSecurityQuestions3thirdAnswerMinlength,
                maxlength: AccountSecurityQuestions3.AccountSecurityQuestions3thirdAnswerMaxlength,
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });

    $("#createaccount-security-questions4").validate({
        rules: {
            SecurityOption4: "required",
            fourthSecurityQuestAnswer: {
                required: true,
                minlength: 5,
                maxlength: 50,
                normalizer: function(value) {
                    return $.trim(value);
                }

            },
        },
        messages: {
            SecurityOption4: AccountSecurityQuestions4.AccountSecurityQuestions4MessageOption4,
            fourthSecurityQuestAnswer: {
                required: AccountSecurityQuestions4.AccountSecurityQuestions4fourthAnswerRequired,
                minlength: AccountSecurityQuestions4.AccountSecurityQuestions4fourthAnswerMinlength,
                maxlength: AccountSecurityQuestions4.AccountSecurityQuestions4fourthAnswerMaxlength,
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });
    $("#update-credentials").validate({
        rules: {
            UserName: {
                required: true,
                maxlength: 50,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            Password: {
                required: true,
            },
        },
        messages: {
            UserName: {
                required: updateCredentialsValidation.updateCredentialsUsernameRequired,
                maxlength: updateCredentialsValidation.updateCredentialsUsernameMaxlength,
            },
            Password: {
                required: updateCredentialsValidation.updateCredentialsPasswordRequired,
            },
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }

    });

    $("#update-pwd-credentials").validate({
        rules: {
            CurrentPassword: {
                required: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            NewPassword: {
                required: true,
                minlength:  8,
                maxlength: 64,

                normalizer: function(value) {
                    return $.trim(value);
                },
                passwordSpecialCharacters: true
            },
            ConfirmPassword: {
                required: true,
                equalTo: "#NewPassword"
            }
        },
        messages: {
            CurrentPassword: {
                required: updatePasswordCredentialsValidation.updatePasswordCredentialsCurrentRequired,
            },
            NewPassword: {
                required: updatePasswordCredentialsValidation.updatePasswordCredentialsNewRequired,
                minlength: updatePasswordCredentialsValidation.updatePasswordCredentialsNewMinlength,
                maxlength: updatePasswordCredentialsValidation.updatePasswordCredentialsNewMaxlength,
                passwordSpecialCharacters: updatePasswordCredentialsValidation.updatePasswordCredentialsSpecCharacters
            },
            ConfirmPassword: {
                required: updatePasswordCredentialsValidation.updatePasswordCredentialsConfirmRequired,
                equalTo: updatePasswordCredentialsValidation.updatePasswordCredentialsConfirmEqualTo
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }

    });


    $("#update-pwd-credentials").submit(function() {
        var valid = $(this).validate().checkForm();
        var passwordField = $(this).find('#NewPassword');
        var btnNext = $(this).find('.wol-btn-primary');
        var letters = /[A-Za-z]/;
        var numbers = /[0-9]/;
        // if (passwordField.val().length >= 8 && ((passwordField.val().match(letters)) && (passwordField.val().match(numbers)))) {
        if (passwordField.val().length >= 8) {
            return true;
        } else {
            return false;
        }
    });

    // username spcial characters validation for maintain account
    $("#update-credentials").on('blur change keyup submit', function(event) {
        var userNamVal = $('.username-textbox').val();
        // var passwordVal = $(this).find('#Password').val();
        var usernameNotAllowedRegex = /[`~*(){}\|<>,=+,/;:'"/?\\\[\]]/;
        var passwordNotAllowedRegex = /[`~{}\|<>,/;'"/\\\[\]]/;

        if ((userNamVal.match(usernameNotAllowedRegex))) {
            $(".username-error-special-char").removeClass("hide");
            // return false;
            event.preventDefault();

        } else {
            $(".username-error-special-char").addClass("hide");
            // return true;
        }

    });

    $("#NewPassword").on('blur change keyup submit', function(event) {
        // enabling jquery validation error message on blur, keyup
        $("#NewPassword").valid();
    });
    $("#contactWorkform .act-update-btn").click(function(e) {

        e.preventDefault();
        //create account info validation
        $("#contactWorkform").validate({
            rules: {
                Work: {
                    required: true,
                    //number: true,
                    minlength: 10,

                },
            },
            messages: {
                Work: {
                    required: ContactWorkForm.ContactWorkFormWorkRequired,
                    // number: "Please enter only number",
                    minlength: ContactWorkForm.ContactWorkFormWorkMinLength,
                }
            },
            errorPlacement: function(error, element) {
                error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
            }
        });

        if ($("#contactWorkform").valid()) {
            $("#contactWorkform").valid();
            $('#account-work-popup').modal('show');
        }
    });

    //create account info validation
    $("#contactAddress").validate({
        rules: {
            SelectedDeliveryRegion: {
                required: true
            },
            CareOf: {
                // required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            Line1: {
                required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            Line2: {
                required: false,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            City: {
                required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            SelectedForeignState: {
                required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            SelectedState: {
                required: true
            },
            SelectedCountry: {
                required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            PostalCode: {
                required: true,
                //number: true,
                minlength: 5,
                zipcode: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        },
        messages: {
            SelectedDeliveryRegion: {
                required: ContactAddress.ContactAddressRegionRequired
            },
            CareOf: {
                // required: ContactAddress.ContactAddressCareOfRequired
            },
            Line1: {
                required: ContactAddress.ContactAddressLine1Required,
                alphaNumericSpace: ContactAddress.ContactAddressLine1AlphaNumericSpace
            },
            Line2: {
                required: ContactAddress.ContactAddressLine2Required,
                alphaNumericSpace: ContactAddress.ContactAddressLine2AlphaNumericSpace
            },
            SelectedForeignState: {
                required: ContactAddress.ContactAddressSelectedForeignStateRequired,
                alphaNumericSpace: ContactAddress.ContactAddressForeignStatealphaNumericSpace
            },
            City: {
                required: ContactAddress.ContactAddressCityRequired,
                alphaNumericSpace: ContactAddress.ContactAddressCityAlphaNumericSpace
            },
            SelectedState: {
                required: ContactAddress.ContactAddressSelectedStateRequired
            },
            SelectedCountry: {
                required: ContactAddress.ContactAddressSelectedCountryRequired,
                alphaNumericSpace: ContactAddress.ContactAddressSelectedCountryalphaNumericSpace
            },
            PostalCode: {
                required: ContactAddress.ContactAddressPostalCodeRequired,
                //number: ContactAddress.ContactAddressPostalCodeNumber,
                minlength: ContactAddress.ContactAddressPostalCodeMinlength,
                zipcode: ContactAddress.ContactAddressPostalCodeZipcodeNew
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });

    $("#otherAddressform").validate({
        rules: {
            SelectedDeliveryRegion: {
                required: true
            },
            CareOf: {
                // required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            Line1: {
                required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            Line2: {
                required: false,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            City: {
                required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            SelectedState: {
                required: true,
                alphaNumericSpace: true
            },
            SelectedForeignState: {
                required: true,
                alphaNumericSpace: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            SelectedCountry: {
                required: true,
                alphaNumericSpace: true
            },
            PostalCode: {
                required: true,
                // number: true,
                minlength: 5,
                zipcode: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        },
        messages: {
            SelectedDeliveryRegion: {
                required: otherAddressForm.otherAddressFormSelectedDeliveryRegionRequired
            },
            CareOf: {
                // required: otherAddressForm.otherAddressFormCareOfRequired
            },
            Line1: {
                required: otherAddressForm.otherAddressFormLine1Required,
                alphaNumericSpace: otherAddressForm.otherAddressFormLine1alphaNumericSpace
            },
            Line2: {
                required: otherAddressForm.otherAddressFormLine2Required,
                alphaNumericSpace: otherAddressForm.otherAddressFormLine2alphaNumericSpace
            },
            City: {
                required: otherAddressForm.otherAddressFormCityRequired,
                alphaNumericSpace: otherAddressForm.otherAddressFormCityAlphaNumericSpace
            },
            SelectedState: {
                required: otherAddressForm.otherAddressFormSelectedStateRequired,
                alphaNumericSpace: otherAddressForm.otherAddressFormSelectedStateAlphaNumericSpace
            },
            SelectedForeignState: {
                required: otherAddressForm.otherAddressFormSelectedForeignStateRequired,
                alphaNumericSpace: otherAddressForm.otherAddressFormForeignStatealphaNumericSpace
            },
            SelectedCountry: {
                required: otherAddressForm.otherAddressFormSelectedCountryRequired,
                alphaNumericSpace: otherAddressForm.otherAddressFormSelectedCountryalphaNumericSpace
            },
            PostalCode: {
                required: otherAddressForm.otherAddressFormPostalCodeRequired,
                //number: otherAddressForm.otherAddressFormPostalCodeNumber,
                minlength: otherAddressForm.otherAddressFormPostalCodeMinlength,
                zipcode: otherAddressForm.otherAddressFormPostalCodeZipcodeNew
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });
    $("#contactEmailForm").validate({
        rules: {
            EmailAdress: {
                required: true,
                validateEmail: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
        },
        messages: {
            EmailAdress: {
                required: ContactEmailForm.ContactEmailFormEmailAddressRequired,
                validateEmail: ContactEmailForm.ContactEmailFormEmailAddressvalidateEmail
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });
    $("#contactPhoneform .act-update-btn").click(function(e) {

        e.preventDefault();
        //create account info validation

        $("#contactPhoneform").validate({
            rules: {
                LandLine: {
                    required: true,
                    //number: true,
                    phoneUSA: true,
                    //alphanumeric: true

                },
            },
            messages: {
                LandLine: {
                    required: ContactPhoneForm.ContactPhoneFormLandlineRequired,
                    // number: "Please enter only number",
                    phoneUSA: ContactPhoneForm.ContactPhoneFormLandlineMinLength,
                    // alphanumeric: "Please enter only alphanumeric characters",

                }
            },
            errorPlacement: function(error, element) {
                error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
            }
        });


        $("#phoneInfo").blur(function() {
            //  alert("Handler for .blur() called.");
            $("#contactPhoneform").valid();

        });

        if ($("#contactPhoneform").valid()) {
            //alert("success");

            $("#contactPhoneform").valid();
            $('#account-phone-popup').modal('show');
        }
    });
    $("#contactMobileform .act-update-btn").click(function(e) {

        e.preventDefault();
        //create account info validation

        $("#contactMobileform").validate({
            rules: {
                Mobile: {
                    required: true,
                    // number: true,
                    // minlength: 10,
                    // maxlength:12,
                    // phoneUS:true,
                    phoneUSA: true

                },
            },
            messages: {
                Mobile: {
                    required: ContactMobileForm.ContactWorkFormMobileRequired,
                    // minlength: ContactMobileForm.ContactWorkFormMobileMinLength,
                    phoneUSA: ContactMobileForm.ContactWorkFormMobileMinLength,
                }
            },
            errorPlacement: function(error, element) {
                error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
            }
        });

        if ($("#contactMobileform").valid()) {
            //alert("success");

            $("#contactMobileform").valid();
            $('#account-mobile-popup').modal('show');
        }
    });
    /*  OTP form validation  */
    $("#contactotpform").validate({
        rules: {
            VerificationCode: {
                required: true,
            },
        },
        messages: {
            VerificationCode: {
                required: OtpfieldValidation.ContactOtpVerification
                    // required: ContactMobileForm.ContactWorkFormMobileRequired,
            }
        },
        errorPlacement: function(error, element) {
            error.appendTo(element.closest('.errorDiv').next(".errorMessage"));
        }
    });

});

$(".rebates-readmore-btn").click(function() {
    $('.rebates-readmore-less').toggleClass('hide show');
    $(this).toggleClass('fa-plus fa-minus');
});
