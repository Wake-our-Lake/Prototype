'use strict';

(function ($) {
    var selectors = {
        root: '.hotspot-image',
        imageContainer: '.hotspot-image__image',
        hotspot: '.fa',
        hotspotInformation: '.hotspot-item',
        scPageEditor: '.on-page-editor',
        scChromeElement: '.scEnabledChrome'
    };

    var classes = {
        activeHotspot: 'hotspot-image__hotspot--active'
    };

    var _sendRequest = function _sendRequest(x, y, title) {

        var apiUrl = '/api/Billing/SaveHotspotCoordintes';

        var config = $(selectors.root).data();

        return $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                'HotspotImageId': $(".tab.active .hotspot-image").data().hotspotImageId,
                'XLocation': x,
                'YLocation': y,
                'Title': title,
                'DatabaseName': config.databaseName
            },
            success: function success(data) {
                location.reload();
            },
            error: function error(data) {
                throw Error('Unable to POST event to the service');
            }
        });
    };

    var _addHotspot = function _addHotspot(x, y) {
        // this will be done after confirmation from sitecore that item is created
        $('.js-hotspots').append('<span class="' + selectors.hotspot + '" style="top: ' + y + '%; left: ' + x + '%; "></span>');
    };

    // show hide content item
    var _toggleContentForHotspot = function _toggleContentForHotspot($hotspot) {
        var $hotspotWidget = $hotspot.closest(selectors.root);
        var hotspotID = $hotspot.attr('data-hotspot-id');
        var $hotspotInformationItems = $hotspotWidget.find(selectors.hotspotInformation);
        var $selectedHotspotContent = $hotspotInformationItems.filter('[data-hotspot-id="' + hotspotID + '"]');

        // if already active
        if ($hotspot.hasClass(classes.activeHotspot)) {
            $hotspot.removeClass(classes.activeHotspot);
            $selectedHotspotContent.slideUp().attr('aria-hidden', true);
        } else {
            _closeHotspotContent($hotspotWidget);
            $hotspot.addClass(classes.activeHotspot);
            $selectedHotspotContent.slideDown().attr('aria-hidden', false);
        }
    };

    var _closeHotspotContent = function _closeHotspotContent($hotspotWidget) {
        var $hotspotInformationItems = $hotspotWidget.find(selectors.hotspotInformation);
        $hotspotWidget.find(selectors.hotspot).removeClass(classes.activeHotspot);
        $hotspotInformationItems.slideUp().attr('aria-hidden', true);
    };

    var _addAddHotspotEventListeners = function _addAddHotspotEventListeners() {
        $(selectors.imageContainer + ' ' + selectors.scChromeElement).on('click', function (e) {
            e.preventDefault();
            var $this = $(e.target);

            if ($this.hasClass(selectors.hotspot)) {
                alert('You cannot add a hotspot to the same location-test');
            } else {

                var offset = $this.offset();

                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;

                var imageHeight = $this.height();
                var imageWidth = $this.width();

                var yPos = (y / imageHeight * 100).toFixed(2);
                var xPos = (x / imageWidth * 100).toFixed(2);

                var title = prompt('Title of your hotspot item:');
                _sendRequest(xPos, yPos, title);
            }
        });
        $(selectors.hotspot).on('click', function (e) {

            var $input = $(this);
            $.confirm($input.attr("data-hotspot-id"));

        });



    };
    var _deleteOk = function (Id) {
        var apiUrl = '/api/Billing/RemoveHotspotCoordinates';

        var config = $(".tab.active .hotspot-image").data();

        return $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'json',
            data: {
                'itemId': Id,
                'DatabaseName': config.databaseName
            },
            success: function success(data) {
                location.reload();
            },
            error: function error(data) {
                throw Error('Unable to POST event to the service');
            }
        });

    };
    $.extend({
        confirm: function (Id) {
            var result = confirm("You cannot add a hotspot to the same location. Do you want to remove the selected hotspot!");
            if (result == true) {

                _deleteOk(Id);
            }
        }
    });
    var _addEventListeners = function _addEventListeners() {
        if ($('.on-page-editor').length) {
            $('.hotspot-controls__activate').on('click', function (e) {
                e.preventDefault();
                $(e.target).hide();
                $('.hotspot-controls__deactivate').show();
                _addAddHotspotEventListeners();
            });

            $('.hotspot-controls__deactivate').on('click', function (e) {
                e.preventDefault();
                $(e.target).hide();
                $('.hotspot-controls__activate').show();
                //$(selectors.imageContainer).off('click');
                // remove event listeners
                $(selectors.imageContainer + ' ' + selectors.scChromeElement).off('click');
                $(selectors.hotspot).off('click');
            });
        } else {
            $(selectors.hotspot).on('click', function (e) {
                _toggleContentForHotspot($(e.target));
            });
        }
    };

    var _displayInitialState = function _displayInitialState() {
        // hide the deactivate button by default
        $('.hotspot-controls__deactivate').hide();

        if (!$('.on-page-editor').length) {
            // remove all dot active states
            var $hotspots = $(selectors.root).find(selectors.hotspot);
            $hotspots.removeClass(classes.activeHotspot);

            // show first dot
            var $firstHotspot = $hotspots.first();
            $firstHotspot.addClass(classes.activeHotspot);
            var hotspotId = $firstHotspot.attr('data-hotspot-id');
            $(selectors.hotspotInformation).hide();
            $(selectors.hotspotInformation).filter('[data-hotspot-id="' + hotspotId + '"]').slideUp();
        };
    };

    var init = function init() {
        if ($(selectors.root).length) {
            _addEventListeners();
            _displayInitialState();
        }
    };

    init();
})(jQuery);