XA.component.search.ajax = (function ($, document) {
    var ApiModel, getPrameterByName;

    getPrameterByName = function (name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    ApiModel = Backbone.Model.extend({
        getData: function (properties) {
            var siteName = getPrameterByName("sc_site");            
            Backbone.ajax({
                dataType: "json",
                url: properties.url + "&site=" + siteName,
                success: function(data){
                    properties.callback(data);
                }
            });
        }
    });

    return new ApiModel();

}(jQuery, document));