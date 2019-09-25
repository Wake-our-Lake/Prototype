; (function ($) {

    // Default settings for the plugin
    var defaults = {
        data: [],
        tag: 'img',
        mode: 'display',
        LS_Variable: '__HotspotPlugin_LocalStorage',
        hiddenClass: 'hidden',
        interactivity: 'click',
        hotspotClass: 'HotspotPlugin_Hotspot fa fa-question-circle',
        hotspotOverlayClass: 'HotspotPlugin_Overlay',
        // Enable ajax
        ajax: false,

        ajaxOptions: {
            url: ''
        }
    };
    //Constructor
    function Hotspot(element, options) {

        // Overwriting defaults with options
        this.config = $.extend(true, {}, defaults, options);

        this.element = element;
        this.imageEl = element.find(this.config.tag);
        this.imageParent = this.imageEl.parent();
        this.broadcast = '';
        var widget = this;

        // Event API for users
        $.each(this.config, function (index, val) {
            if (typeof val === 'function') {
                widget.element.on(index + '.hotspot', function () {
                    val(widget.broadcast);
                });
            };
        });

        this.init();
    }

    Hotspot.prototype.init = function () {

        this.getData();

        if (this.config.mode != 'admin') {
            return;
        };

        var height = this.imageEl[0].height;
        var width = this.imageEl[0].width;

        // Masking the image
        $('<span/>', {
            html: '<p>This is Admin-mode. Click this Pane to Store Messages</p>'
        }).css({
            'height': height + 'px',
            'width': width + 'px'
        }).addClass(this.config.hotspotOverlayClass).appendTo(this.imageParent);

        var widget = this;
        var data = [];
    }

    Hotspot.prototype.getData = function () {
        var widget = this;

        if (localStorage.getItem(this.config.LS_Variable) === null && this.config.data.length == 0) {

            if (this.config.ajax) {
                // Making AJAX call to fetch Data
                var dataObject = {
                    data: {
                        HotspotPlugin_mode: "Retrieve"
                    }
                };
                var ajaxSettings = $.extend({}, this.config.ajaxOptions, dataObject);
                $.ajax(ajaxSettings)
                    .done(function (data) {
                        localStorage.setItem(widget.config.LS_Variable, data);
                        var obj = JSON.parse(data);
                        widget.beautifyData();
                    })
                    .fail(function () {
                        return;
                    });
            } else {
                return;
            }

        }

        if (this.config.mode == 'admin' && localStorage.getItem(this.config.LS_Variable) === null) {
            return;
        }

        this.beautifyData();
    }

    Hotspot.prototype.beautifyData = function () {
        var widget = this;

        if (this.config.mode != 'admin' && this.config.data.length != 0) {
            var obj = this.config.data;
        } else {
            var raw = localStorage.getItem(this.config.LS_Variable);
            var obj = JSON.parse(raw);
        }

        for (var i = obj.length - 1; i >= 0; i--) {
            var el = obj[i];

            if (this.config.interactivity === 'none') {
                var htmlBuilt = $('<div/>');
            } else {
                var htmlBuilt = $('<div/>').addClass(this.config.hiddenClass);
            }

            $.each(el, function (index, val) {
                if (typeof val === "string") {
                    $('<div/>', {
                        html: val
                    }).addClass('Hotspot_' + index).appendTo(htmlBuilt);
                };
            });

            var div = $('<div/> ', {
                html: htmlBuilt
            }).css({
                'top': el.Y + '%',
                'left': el.X + '%'
            }).addClass(this.config.hotspotClass).appendTo(this.element);


            if (widget.config.interactivity === 'click') {
                div.on(widget.config.interactivity, function (event) {

                    if ($("body").hasClass("mobile-device")) {


                        if (parseFloat($(this).css('left')) < 200) {
                            $(this).children('div').css("left", "0px");

                        }
                        else {
                            $(this).children('div').css("right", "0px");
                        }
                    }
                    else {
                        if (parseFloat($(this).css('left')) < 350) {
                            $(this).children('div').css("left", "0px");

                        }
                        else {
                            $(this).children('div').css("right", "0px");
                        }
                    }


                    if ($(this).children('div').hasClass('hidden'))
                        $('.HotspotPlugin_Hotspot >div ').addClass('hidden');
                    $(this).children('div').toggleClass('hidden');
                });
                htmlBuilt.css('display', 'block');
            } else {
                htmlBuilt.removeClass(this.config.hiddenClass);
            }

            if (this.config.interactivity === 'none') {
                htmlBuilt.css('display', 'block');
            }
        };
    };



    $.fn.hotspot = function (options) {
        new Hotspot(this, options);
        return this;
    }

}(jQuery));