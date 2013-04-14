/**
 *
 * A JQUERY LATITUDE AND LONGITUDE LOCATION PICKER
 * version 0.0
 *
 * Supports multiple maps. Works on touchscreen. Easy to customize markup and CSS.
 *
 * by Alessandro Staniscia and Richard Dancsi.
 */

// for ie9 doesn't support debug console >>>
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () {
};
// ^^^



var OLLatLonPicker = (function () {

    var _self = this;

    // VARS
    _self.vars = {
        ID:null,
        map:null,
        markers:null,
        latLongProj : new OpenLayers.Projection("EPSG:4326")
    } ;

    var setField= function (lat,lng)
    {
        var location = new OpenLayers.LonLat(lng,lat).transform(_self.vars.map.getProjectionObject(),_self.vars.latLongProj);
        $(_self.vars.cssID + ".gllpLongitude").val(location.lon);
        $(_self.vars.cssID + ".gllpLatitude").val(location.lat);
    }

    var setMarker= function (lat,lng)
    {
        _self.vars.markers.clearMarkers();
        var location = new OpenLayers.LonLat(lng,lat);
        var size = new OpenLayers.Size(21,25);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
        _self.vars.markers.addMarker(new OpenLayers.Marker(location,icon.clone()));
        _self.vars.map.panTo(location);

        $(_self.vars.cssID).trigger("location_changed", $(_self.vars.cssID));
    } ;

    // For reverse geocoding
    var getLocationName = function (position) {
        console.log("getLocationName");
        console.log(position);
    };

    // search function
    var performSearch = function (string, silent) {
        console.log("performSearch");
        console.log(string);
        console.log(silent);
    };




    ///////////////////////////////////////////////////////////////////////////////////////////////
    // PUBLIC FUNCTIONS  //////////////////////////////////////////////////////////////////////////
    var publicfunc = {

        // INITIALIZE MAP ON DIV //////////////////////////////////////////////////////////////////
        init:function (object) {
            if (!$(object).attr("id")) {
                if ($(object).attr("name")) {
                    $(object).attr("id", $(object).attr("name"));
                } else {
                    $(object).attr("id", "_MAP_" + Math.ceil(Math.random() * 10000));
                }
            }

            _self.vars.ID = $(object).attr("id");
            _self.vars.cssID = "#" + _self.vars.ID + " ";
            defLat = $(_self.vars.cssID + ".gllpLatitude").val() ? $(_self.vars.cssID + ".gllpLatitude").val() : 41.9;
            defLng = $(_self.vars.cssID + ".gllpLongitude").val() ? $(_self.vars.cssID + ".gllpLongitude").val() : 12.483333;
            defZoom = $(_self.vars.cssID + ".gllpZoom").val() ? parseInt($(_self.vars.cssID + ".gllpZoom").val()) : 3;


            _self.vars.map = new OpenLayers.Map( $(_self.vars.cssID + ".gllpMap").get(0), {
                theme: null
            });
            var baseLayer = new OpenLayers.Layer.OSM();
            _self.vars.map.addLayer(baseLayer);

            var center = new OpenLayers.LonLat(defLng,defLat);
            _self.vars.map.setCenter(center,defZoom);
            _self.vars.markers = new OpenLayers.Layer.Markers("Position");
            _self.vars.map.addLayer(_self.vars.markers);



            var LLPClickControl = OpenLayers.Class(OpenLayers.Control, {
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },
                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    );
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.trigger
                        }, this.handlerOptions
                    );
                },

                trigger: function(e) {
                    lonlat = _self.vars.map.getLonLatFromPixel(e.xy)
                    setMarker(lonlat.lat,lonlat.lon);
                    setField(lonlat.lat,lonlat.lon);
                }

            });


            var clickControl = new LLPClickControl();
            _self.vars.map.addControl(clickControl);
            clickControl.activate();


            setMarker(center.lat,center.lon);
            setField(center.lat,center.lon);


            // Update location and zoom values based on input field's value
            $(_self.vars.cssID + ".gllpUpdateButton").bind("click", function () {
                var lat = $(_self.vars.cssID + ".gllpLatitude").val();
                var lng = $(_self.vars.cssID + ".gllpLongitude").val();
                var location = new OpenLayers.LonLat(lng,lat).transform(_self.vars.latLongProj,_self.vars.map.getProjectionObject());

                setMarker(location.lat,location.lon);
            });

            // Search function by search button
            $(_self.vars.cssID + ".gllpSearchButton").bind("click", function () {
                performSearch($(_self.vars.cssID + ".gllpSearchField").val(), false);
            });

            // Search function by gllp_perform_search listener
            $(document).bind("gllp_perform_search", function (event, object) {
                performSearch($(object).attr('string'), true);
            });

        }

    }

    return publicfunc;
});

(function ($) {
    $(document).ready(function () {
        $(".gllpLatlonPicker").each(function () {
            (new OLLatLonPicker()).init($(this));
        });
    });

    $(document).bind("location_changed", function (event, object) {
        console.log("changed: " + $(object).attr('id'));
    });

})(jQuery);
