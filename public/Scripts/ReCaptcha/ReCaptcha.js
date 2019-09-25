$(window).bind('load', function () {
    var form = $('.custom-form');
    if (form) {

        $(form).click(function () {
            var recaptcha = document.getElementById("recaptcha");

            if (recaptcha)
            {
                var recaptchaResponse = grecaptcha.getResponse();
                if (recaptchaResponse.length == 0)
                {
                    document.getElementById('captchaError').innerHTML = "You can't leave Captcha Code empty";
                    return false;
                }
                else
                {
                    document.getElementById('captchaError').innerHTML = "";
                    $('.googleRecaptchaClass').val(recaptchaResponse);
                    return true;
                }
            }
         
        });
    }
});