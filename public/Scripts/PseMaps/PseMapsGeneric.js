
/*global $:true*/
/*global google:true*/
var _infowindow,
    _serviceUrl = Url;

$(function () {
    var _defaultPin = _.findWhere(pins, { PinType: "Location" }),
        _polyPin = _.findWhere(pins, { PinType: "Poly" }),
        _greenPin = _.findWhere(pins, { PinType: "Green" }),
        _orangePin = _.findWhere(pins, { PinType: "Orange" }),
        _image = _defaultPin != null ? _defaultPin.ImageUrl : "",
        _poly_image = _polyPin != null ? _polyPin.ImageUrl : "",
        _home_green = _greenPin != null ? _greenPin.ImageUrl : "",
        _home_orange = _orangePin != null ? _orangePin.ImageUrl : "",
        _mapData,
        ntloggid,
        _json,
        _area,
        _map,
        _status,
        _markers,
        i, j, k, m,
        _maxLengthAttrib,
        _markersArray,
        _contentsArray,
        _markerAttribs,
        _polyArray,
        _data,
        _markerItem,
        _estimatedRestorationTime,
        _lastUpadted,
        _startTime,
        _cause,
        _customersImpacted,
        _content,
        _bermudaTriangle,
        _pathdataArr,
        _descriptionLength,
        _pathNestedArray,
        _finalPoly,
        _listContent,
        _listViewData,
        _attrib,
        _attribContent,
        _attributesValuesList,
        _maxLengthAttrib,
        _listTable,
        _showPerPage,
        _numberOfItems,
        _numberOfPages,
        _navigationHtml,
        _currentLink,
        _divHeightOfTheMap,
        _offSetFromBottom,
        _mcOptions,
        _geocoder,
        _address1,
        _address2,
        _city,
        _zipcode,
        _state,
        _address,
        _home_icon,
        _ntloggedid,
        _emailTxt,
        _phnTxt,
        _isNotEmpty,
        _isEitherOneValid,
        _disableBtn,
        $outageTotalCount = '#outage-total-count',
        $customerAffectTotal = '#customer-affect-total',
        $bound = 'false',
        _filtersLoaded = false,
        _lastMapBounds;
    _listTable = $('#OutageListTable');
    _geocoder = new google.maps.Geocoder();

    function initMap() {
        _mapData = (function () {
            _json = null;
            $.ajax({
                'async': false,
                'global': false,
                'url': _serviceUrl,
                'dataType': "json",
                'success': function (data) {
                    _json = data;
                }
            });
            return _json;
        })();

        _map = new google.maps.Map(document.getElementById("map"), {
            center: {
                lat: 47.6,
                lng: -122.167
            },
            zoom: 7,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            fullscreenControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });
        if ($(window).width() <= 991) {
            _map.setOptions({
                zoomControl: false,
                mapTypeControl: false
            });
        }

        _infowindow = new google.maps.InfoWindow({
            disableAutoPan: false,
        });
        _markersArray = [];
        _contentsArray = [];
        _polyArray = [];
        _listViewData = [];
        _markerAttribs = [];
        _ntloggedid = [];

        if (_mapData != null) {

            // Setup filters if they exist in _mapData
            var _filters = _mapData.Common.Filters;

            // do not reload filters so user selections persist between calls. Only for retailers for now but is extensible to other types
            if (!_filtersLoaded && MapType == 'Retailers' && _filters != null) {
                var serviceTypeFilter = _.findWhere(_filters, { Name: "ServiceType" });
                var filterTemplate = '<li><label><input type="checkbox" value="{value}" aria-label="{value}" name="Filter" ><span class="filter-option-label">{label}</label></li>';
                var filterOptionsHtml = '';
                serviceTypeFilter.ValueOptions.forEach(function (e, i) {
                    var val = serviceTypeFilter.ValueOptions[i];
                    var optionHtml = filterTemplate.replace('{label}', val).replace('{value}', val);
                    filterOptionsHtml += optionHtml;
                });
                var clearButton = '<button type="button" class="btn btn-link clear">clear</button>';
                var updateButton = '<button type="button" class="btn btn-primary update">update</button>';

                $('#pse-maps-servicetype-selector')
                    .html(filterOptionsHtml)
                    .append(clearButton)
                    .append(updateButton);

                $('#pse-maps-retailers-filter').removeClass('hidden');
                $('#pse-maps-location-search').addClass('col-md-8');
                _filtersLoaded = true;
            }

            _mapData.PseMap.forEach(function (e, i) {

                _data = _mapData.PseMap[i];
                _attributesValuesList = '';
                _attrib = _data.DataProvider.Attributes;

                var markerImg = _image;
                var serviceType = "";
                if (MapType == "Projects") {
                    var serviceTypeAttr = _.findWhere(_attrib, { Name: "Service Type" });
                    if (serviceTypeAttr != null) {
                        serviceType = serviceTypeAttr.Value;
                        var projectPin = _.findWhere(pins, { PinType: serviceType });
                        markerImg = projectPin != null ? projectPin.ImageUrl : _image;
                    }
                }

                _markerItem = {
                    lat: _data.DataProvider.PointOfInterest.Latitude,
                    lng: _data.DataProvider.PointOfInterest.Longitude,
                    markerImg: markerImg
                };

                for (m = 0, _maxLengthAttrib = _attrib.length; m < _maxLengthAttrib; m++) {
                    if (_attrib[m].Value != null && _attrib[m].Value.length > 0 && !_attrib[m].NoDisplay) { // if .NoDisplay == true => do not add to attribute list
                        if (_attrib[m].Name == "Project Contact") { // update value if this is for project contact attribute
                            var managerName = _attrib[m].Value;
                            var managerEmail = _.findWhere(_attrib, { Name: "Contact Email" }).Value;
                            var managerPhone = _.findWhere(_attrib, { Name: "Contact Phone" }).Value;
                            _attrib[m].Value = '<a href="mailto:' + managerEmail + '" target="_blank">' + managerName + '</a><br />' + formatPhoneNumber(managerPhone);
                        }
                        var attName = '<span>' + _attrib[m].Name + ': </span>';
                        var attValue = _attrib[m].Value.indexOf("http") == 0 ? '<span><a href="' + _attrib[m].Value + '" target="_blank">Link to ' + _attrib[m].Name.toLowerCase() + '</a></span>' : '<span>' + _attrib[m].Value + '</span>';
                        _attributesValuesList += '<li>' + attName + attValue + '</li>';
                    }
                }


                $('.gm-style-iw').css('top', '15px !important');

                _attribContent = '<div id="bodyContent">' +
                    '	<div class="description"><h6>' + _data.DataProvider.PointOfInterest.Title + ' </h6><ul>' +
                    _attributesValuesList +
                    '		</ul> </div>' +
                    '</div>';

                _listContent = '<div class="col-xs-12 col-sm-6 col-md-4" id="mapListData">' +
                    '	<span class="listView-title">' + (i + 1) + '. ' + _data.DataProvider.PointOfInterest.Title + ' </span><ul>' +
                    _attributesValuesList +
                    '		</ul> ' +
                    '</div>';
                _markerAttribs.push(_data.DataProvider.PointOfInterest.Title + '</span><ul>' +
                    _attributesValuesList +
                    '		</ul> ' +
                    '</div>');
                _attributesValuesList = '';
                _markersArray.push(_markerItem);
                _contentsArray.push(_attribContent);
                _polyArray.push(_data.Polygon);
                _ntloggedid.push(_data.DataProvider.PointOfInterest.Id);

                if ($bound == 'true') {
                    if (typeof _data.BoundingBox !== undefined && _data.BoundingBox !== null) {
                        var rectangle = new google.maps.Rectangle({
                            bounds: new google.maps.LatLngBounds(new google.maps.LatLng(_data.BoundingBox.Min.Latitude, _data.BoundingBox.Min.Longitude), new google.maps.LatLng(_data.BoundingBox.Max.Latitude, _data.BoundingBox.Max.Longitude)),
                            map: _map,
                            fillOpacity: 0.2,
                            strokeOpacity: 0.5,
                            strokeWeight: 1
                        });
                    }
                }
                var location = new google.maps.LatLng(_data.DataProvider.PointOfInterest.Latitude, _data.DataProvider.PointOfInterest.Longitude);
                $('#interactiveMapNotify #deviceId').val(_data.DataProvider.PointOfInterest.Id);
            });

            _markers = _markersArray.map(function (location, ind) {
                var marker = new google.maps.Marker({
                    position: location,
                    icon: location.markerImg
                });
                marker.getCorrespondingContent = function () {
                    return _markerAttribs[ind];
                }

                google.maps.event.addListener(marker, 'click', function (evt) {
                    _infowindow.setContent(_contentsArray[ind]);
                    
                    _infowindow.open(_map, marker);
                    _map.panTo(location);
                   
                    var iwOuter = $('.gm-style-iw');
                    var iwBackground = iwOuter.prev();


                    // Removes background shadow DIV
                    iwBackground.children(':nth-child(2)').css({ 'display': 'none' });

                    // Removes white background DIV
                    iwBackground.children(':nth-child(4)').css({ 'display': 'none' });

                    var iwCloseBtn = iwOuter.next();

                    // Apply the desired effect to the close button
                    iwCloseBtn.css({ opacity: '1', right: '70px', top: '28px', cursor: "pointer" });
                    if ($(window).width() <= 991) {
                        iwCloseBtn.css({ right: '55px', top: '90px' });
                    }
                    iwCloseBtn.click(function () {
                        //other things you want to do when close btn is click
                        _infowindow.close();
                    });

                    
                    $('#deviceId').val(_ntloggedid[ind]);
                })

                return marker;
            });

            _bermudaTriangle = new google.maps.Polygon({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35
            });
            _pathdataArr = [], _pathNestedArray = [];

            for (i = 0; i < _polyArray.length; i++) {
                if (typeof _polyArray !== undefined && _polyArray !== null) {
                    if (_polyArray[i] != null) {
                        _descriptionLength = _polyArray[i].length;


                        for (k = 0; k < _descriptionLength; k++) {
                            _pathdataArr.push(new google.maps.LatLng(_polyArray[i][k].Latitude, _polyArray[i][k].Longitude));
                        }
                        _pathNestedArray.push(_pathdataArr);
                        _pathdataArr = [];
                    }
                }
            }
            for (j = 0; j < _pathNestedArray.length; j++) {
                _finalPoly = new google.maps.Polygon(_bermudaTriangle);
                _finalPoly.setPaths(_pathNestedArray[j]);
                _finalPoly.setMap(_map);
            }
            _mcOptions = {
                styles: [{
                    textColor: 'white',
                    height: 32,
                    url: _poly_image,
                    width: 32
                },
                {
                    textColor: 'white',
                    height: 32,
                    url: _poly_image,
                    width: 32
                },
                {
                    textColor: 'white',
                    height: 32,
                    url: _poly_image,
                    width: 32
                },
                {
                    textColor: 'white',
                    height: 32,
                    url: _poly_image,
                    width: 32
                },
                {
                    textColor: 'white',
                    height: 32,
                    url: _poly_image,
                    width: 32
                }
                ]
            };

            var markerCluster = new MarkerClusterer(_map, _markers, _mcOptions);
            google.maps.event.addDomListener(window, "load");

            function geocodeAddress(geocoder, resultsMap, _home_icon) {
                geocoder.geocode({
                    'address': _address
                },
                    function (results, status) {
                        if (status === 'OK') {
                            resultsMap.setCenter(results[0].geometry.location);
                            var marker = new google.maps.Marker({
                                map: resultsMap,
                                position: results[0].geometry.location,
                                icon: _home_icon
                            });
                        } else {
                            alert('Geocode was not successful for the following reason: ' + status);
                        }
                    });
            }

            google.maps.event.addListener(_map, 'bounds_changed', function (evt) {
                if (mapViewFlag != 0) {
                    _lastMapBounds = _map.getBounds();
                }
            });

            google.maps.event.addListener(_map, 'idle', function (evt) {
                var _resultData = "";
                var indx = 1;
                _listTable.empty();
                for (var d = 0; d < _markers.length; d++) {
                    var markerPosition = _markers[d].getPosition();
                    var containedInBounds = _lastMapBounds.contains(markerPosition);
                    if (containedInBounds) {
                        _resultData += '<div class="col-xs-12 col-sm-6 col-md-4 listView-container"><span class="listView-title">' + indx++ + '. ' + _markers[d].getCorrespondingContent() + '</div>';
                    }
                }
                _listTable[0].innerHTML = _resultData;

                if ($("#OutageListTable .listView-container").length > 9) {
                    $('.controls').show();
                    listPagination();
                } else {
                    $('.controls').hide();
                }
            });
        }

    }
    if (!isEditing && $('#map').length > 0) {
        initMap();
    }


    function getPageList(totalPages, page, maxLength) {
        if (maxLength < 5) throw "maxLength must be at least 5";

        function range(start, end) {
            return Array.from(Array(end - start + 1), function (_, i) {
                return i + start;
            });
        }

        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
        if (totalPages <= maxLength) {
            // no breaks in list
            return range(1, totalPages);
        }
        if (page <= maxLength - sideWidth - 1 - rightWidth) {
            // no break on left of page
            return range(1, maxLength - sideWidth - 1)
                .concat([0])
                .concat(range(totalPages - sideWidth + 1, totalPages));
        }
        if (page >= totalPages - sideWidth - 1 - rightWidth) {
            // no break on right of page
            return range(1, sideWidth)
                .concat([0])
                .concat(range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
        }
        // Breaks on both sides
        return range(1, sideWidth)
            .concat([0])
            .concat(range(page - leftWidth, page + rightWidth))
            .concat([0])
            .concat(range(totalPages - sideWidth + 1, totalPages));
    }

    function listPagination() {
        // Number of items and limits the number of items per page
        var numberOfItems = $("#OutageListTable .listView-container").length;
        var limitPerPage = 9;
        // Total pages rounded upwards
        var totalPages = Math.ceil(numberOfItems / limitPerPage);
        // Number of buttons at the top, not counting prev/next,
        // but including the dotted buttons.
        // Must be at least 5:
        var paginationSize = 9;
        var currentPage;

        function showPage(whichPage) {
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $("#OutageListTable .listView-container").hide()
                .slice((currentPage - 1) * limitPerPage,
                    currentPage * limitPerPage).show();
            // Replace the navigation items (not prev/next):            
            $(".controls span").slice(1, -1).remove();
            getPageList(totalPages, currentPage, paginationSize).forEach(function (item) {
                $("<span>").addClass("page-item pnumbers")
                    .addClass(item ? "current-page" : "disabled")
                    .toggleClass("active", item === currentPage).append(
                        $("<a>").addClass("page-link").attr({
                            href: "javascript:void(0)"
                        }).text(item || "...")
                    ).insertBefore("#next-page");
            });
            // Disable prev/next when at first/last page:
            $("#previous-page").toggleClass("disabled", currentPage === 1);
            $("#next-page").toggleClass("disabled", currentPage === totalPages);
            return true;
        }

        // Include the prev/next buttons:
        $(".controls").append(
            $("<span>").addClass("page-item").attr({
                id: "previous-page"
            }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"
                }).append(
                    $("<i>").addClass("fa fa-chevron-left")
                )
            ),
            $("<span>").addClass("page-item").attr({
                id: "next-page"
            }).append(
                $("<a>").addClass("page-link").attr({
                    href: "javascript:void(0)"
                }).append(
                    $("<i>").addClass("fa fa-chevron-right")
                )
            )
        );
        // Show the page links
        $("#OutageListTable").show();
        showPage(1);

        // Use event delegation, as these items are recreated later    
        $(document).on("click", ".controls span.current-page:not(.active)", function () {
            return showPage(+$(this).text());
        });
        $("#next-page").on("click", function () {
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            return showPage(currentPage - 1);
        });
    };



    $('#pse-search-txt').keyup(function (event) {
        if (event.keyCode == 13) {
            $('#MAPSearchBtn').click();
        }
    });

    this.Search = function () {
        var mapsearch = document.getElementById('pse-search-txt').value;        
        mapsearch = $.trim(mapsearch);
        if (mapsearch.length > 0) {
            _geocoder.geocode({
                'address': mapsearch + ", WA, USA"
            },
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var result = results[0];                        
                        var loc = result.geometry.location;
                        _map.panTo(loc);
                        _map.setZoom(11);                        
                    }
                });
        }

        $('#pse-search-txt').val('');
    }

    $('#pse-maps-servicetype-selector .update').on('click', function () {
        if (MapType == 'Retailers') {
            var selections = "";
            var divider = '';
            $('#pse-maps-servicetype-selector input:checked').each(function () {
                selections += divider + $(this).val();
                divider = ',';
            });
            _serviceUrl = Url + "&serviceType=" + selections;

            // reload search
            initMap();
        }
    });

    $('#pse-maps-servicetype-selector .clear').on('click', function () {
        if (MapType == 'Retailers') {
            var selections = "";
            var divider = '';
            $('#pse-maps-servicetype-selector input:checked').each(function () {
                $(this).prop('checked', false);
            });
        }
    });

    $('#pse-maps-servicetype-selector').on('click', function (event) {
        var events = $._data(document, 'events') || {};
        events = events.click || [];
        for (var i = 0; i < events.length; i++) {
            if (events[i].selector) {

                //Check if the clicked element matches the event selector
                if ($(event.target).is(events[i].selector)) {
                    events[i].handler.call(event.target, event);
                }

                // Check if any of the clicked element parents matches the 
                // delegated event selector (Emulating propagation)
                $(event.target).parents(events[i].selector).each(function () {
                    events[i].handler.call(this, event);
                });
            }
        }
        event.stopPropagation(); //Always stop propagation
    });


});

////////////////////////////// Map Legend function////////////////////////////////////////

$(document).on('click', '.legend', function () {
    if ($(this).hasClass('collapsed')) {
        $(this).parent().find('.less').hide();
        $(this).parent().find('.more').show();
        $(this).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(this).parent().find('.more').hide();
        $(this).parent().find('.less').show();
        $(this).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
    }
});

//   ######  Desktop List and Map View Toggle Functionality   #######  ///

var mapViewFlag;
$(".list-view-icon").on('click', function () {
    $(".map-view,.map-button-view").css('display', 'block');
    $(".list-view").css('display', 'none');
    $(".list-content").css("display", 'block');
    $("#map").css('display', 'none');
    mapViewFlag = 0;
});

$(".map-change-icon").on('click', function () {
    $(".map-view,.map-button-view").css('display', 'none');
    $(".list-view").css('display', 'block');
    $("#map").css('display', 'block');
    $(".list-content").css("display", 'none');
    mapViewFlag = 1;
});

//   ######  Mobile List and Map View toggle button Functionality   #######  ///

if ($(window).width() <= 767) {
    if (mapViewFlag == 0) {
        $('.btn-map, .list-content').show();
        $('#map, .btn-list').hide();
    } else {
        $('.btn-map, .list-content').hide();
        $('#map, .btn-list').show();
    }
}
$('.btn-map').on('click', function () {
    $('.btn-map, .list-content').hide();
    $('#map, .btn-list').show();
    mapViewFlag = 1
});
$('.btn-list').on('click', function () {
    $('.btn-map, .list-content').show();
    $('#map, .btn-list').hide();
    mapViewFlag = 0
});

function getQueryStringForSearch(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ("" + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return (!match) ? null : "(" + match[1] + ") " + match[2] + "-" + match[3];
}

$(document).ready(function () {
    var acessToken = getQueryStringForSearch('q');
    if (!(acessToken == null || typeof acessToken === "undefined" || acessToken == "")) {
        $('#pse-search-txt').val(acessToken);
        $('#MAPSearchBtn').click();
    }

    // Add contextual class for map type UI tweaks
    var mapTypeClass = MapType.toLowerCase().trim().replace(" ", "-");
    $('.outage-map-list').addClass(mapTypeClass);
    $('.map-container').addClass(mapTypeClass);
});

