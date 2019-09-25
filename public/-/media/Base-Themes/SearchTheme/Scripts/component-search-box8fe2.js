XA.component.search.box = (function ($, document) {
    var api = {},
        searchBoxViews = [],
        searchBoxModels = [],
        queryModel,
        urlHelperModel,
        searchResultModels,
        initialized = false;

    var SearchBoxModel = Backbone.Model.extend({
        defaults: {
            searchEngine: "",
            typeahead: "",
            dataProperties: {},
            searchQuery: "",
            loadingInProgress: false,
            sig: []
        },
        initSearchEngine: function () {
            var inst = this,
                searchEngine = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace("name"),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    limit: inst.get("dataProperties").p,
                    remote: {
                        url: urlHelperModel.createPredictiveSearchUrl(inst.get("dataProperties"), inst.get("searchQuery")),
                        filter: function(list) {
                            var searchArr = [];
                            return _.map(list.Results, function(item) { return { html: item.Html }; });
                        },
                        replace: function () {
                            var valueProvider = inst.get("valueProvider"),
                                searchQuery = valueProvider();

                            return urlHelperModel.createPredictiveSearchUrl(inst.get("dataProperties"), searchQuery);
                        },
                        ajax: {
                            beforeSend: function () {
                                inst.set({"loadingInProgress": true});
                            },
                            complete: function () {
                                inst.set({"loadingInProgress": false});
                            }
                        }
                    }
                });

            searchEngine.initialize();
            this.set({searchEngine: searchEngine});
        }
    });

    var SearchBoxView = XA.component.search.baseView.extend({
        initialize: function () {
            var inst = this, 
                dataProperties = this.$el.data(),
                hashObj = queryModel.parseHashParameters(window.location.hash),
                $searchBox = this.$el.find(".search-box-input"),
                typeahead;
                
            dataProperties.properties.targetSignature = dataProperties.properties.targetSignature !== null ? dataProperties.properties.targetSignature : ""; 

            this.model.set({dataProperties: dataProperties.properties});
            this.model.set("sig", this.translateSignatures(dataProperties.properties.searchResultsSignature, "q"));
            this.model.initSearchEngine();
            this.model.on("change:loadingInProgress", this.loading, this);

            typeahead = this.$el.find(".search-box-input").typeahead({
                hint: true,
                minLength: 2
            },
            {
                source: inst.model.get("searchEngine").ttAdapter(),
                displayKey: function () { return inst.$el.find(".search-box-input.tt-input").val(); },
                templates: {
                    suggestion: function (data) {
                        return '<div class="sugesstion-item">' + data.html + '</div>';
                    }
                }
            }).on('typeahead:selected', function (event, datum) {
                var link = $(datum.html).find("a");

                if (link.length) {
                    window.location.href = $(link[0]).attr("href");
                }
            });

            //TODO: Seems like bellow line isn't needed as updateSearchBoxValue() function will be callend when hash will change - to be tested in non/multi signatures cases
            //$searchBox.val(hashObj[this.model.get("sig")] !== undefined ? hashObj[this.model.get("sig")] : "");

            this.model.set({typeahead: typeahead});
            this.model.set({valueProvider: function() {
                return inst.$el.find(".search-box-input.tt-input").val();
            }});
            XA.component.search.vent.on("hashChanged", this.updateSearchBoxValue.bind(this));
        },
        events: {
            "click .search-box-button": "updateQueryModelClick",
            "click .search-box-button-with-redirect": "updateQueryWithRedirect",
            "keypress .search-box-input.tt-input": "predictiveSearch",
            "keydown .search-box-input.tt-input": "predictiveSearch"
        },        
        loading: function() {
            this.$el.toggleClass("loading-in-progress");
        },
        updateQueryWithRedirect: function(event) {
            event.preventDefault();

            var resultPage = this.model.get("dataProperties").resultPage,
                targetSignature = this.model.get("dataProperties").targetSignature,
                searchResultsSignature = this.model.get("dataProperties").searchResultsSignature,
                query = this.$el.find(".search-box-input.tt-input").val(),
                sig = this.model.get("sig"),
                queryWithSignature = {};

            if (targetSignature !== "") {
                queryWithSignature = this.updateSignaturesHash([targetSignature + "_q"], query, this.createOffsetObject())
            } else {
                queryWithSignature = this.updateSignaturesHash(sig, query, this.createOffsetObject())
            }
            
            window.location.href = urlHelperModel.createRedirectSearchUrl(resultPage, queryWithSignature, searchResultsSignature, targetSignature);
        },
        updateQueryModelClick: function(event) {
            event.preventDefault();
            var query = this.$el.find(".search-box-input.tt-input").val();
            this.updateQueryModel(query);
        },
        updateQueryModel: function(query){
            var searchValue = {},
                offsetSignatures = this.translateSignatures(this.model.get("dataProperties").searchResultsSignature, "e"),
                sig = this.model.get("sig"),
                i;

            for (i = 0; i < sig.length; i++) {
                searchValue[sig[i]] = query;
                searchValue[offsetSignatures[i]] = 0;
            }

            queryModel.updateHash(searchValue, this.model.get("dataProperties").targetUrl);
        },
        predictiveSearch: function (event) {
            var query = this.$el.find(".search-box-input.tt-input").val(),
                targetSignature = this.model.get("dataProperties").targetSignature,
                searchResultsSignature = this.model.get("dataProperties").searchResultsSignature,
                resultPage = this.model.get("dataProperties").resultPage,
                sig = this.model.get("sig"),
                queryWithSignature = {};

            if (event.keyCode === 13) {
                event.preventDefault();

                if (resultPage === "") {
                    this.updateQueryModel(query);
                    this.$el.find(".search-box-input.tt-input").val(query);
                    this.$el.find(".search-box-input.tt-input").blur();
                } else {
                    if (targetSignature !== "") {
                        queryWithSignature = this.updateSignaturesHash([targetSignature + "_q"], query, this.createOffsetObject())
                    } else {
                        queryWithSignature = this.updateSignaturesHash(sig, query, this.createOffsetObject())
                    }
                    window.location.href = urlHelperModel.createRedirectSearchUrl(resultPage, queryWithSignature, searchResultsSignature, targetSignature);
                }
            }
        },
        createOffsetObject: function() {
            var sig = this.model.get("sig"),
                targetSignature = this.model.get("dataProperties").targetSignature,
                signature = targetSignature !== "" ? targetSignature : this.model.get("dataProperties").searchResultsSignature,  
                offsetSignatures = this.translateSignatures(signature, "e"),
                offsetObject = {},
                i;

            for (i = 0; i < sig.length; i++) {
                offsetObject[offsetSignatures[i]] = 0;
            }

            return offsetObject;
        },
        updateSearchBoxValue: function () {
            var hashObj = queryModel.parseHashParameters(window.location.hash),
                el = this.$el.find(".search-box-input.tt-input"),
                sig = this.model.get("sig"),
                i;

            for (i = 0; i < sig.length; i++) {
                if (hashObj.hasOwnProperty(sig[i])) {
                    el.val(hashObj[sig[i]]);
                } else {
                    el.val("");
                }
            }
        }
    });

    api.init = function() {
        if ($("body").hasClass("on-page-editor") || initialized) {
            return;
        }
        queryModel = XA.component.search.query;
        searchResultModels = XA.component.search.results.searchResultModels;
        urlHelperModel = XA.component.search.url;

        var searchBox = $(".search-box:not(.initialized)");
        _.each(searchBox, function(elem){
            var $el = $(elem);
            var boxModel = new SearchBoxModel();
            searchBoxModels.push(boxModel);
            searchBoxViews.push(new SearchBoxView({el: $el, model: boxModel}));
            $el.addClass("initialized");
        });

        initialized = true;
    };

    api.searchBoxViews = searchBoxViews;
    api.searchBoxModels = searchBoxModels;

    return api;

}(jQuery, document));

XA.register('searchBox', XA.component.search.box);
