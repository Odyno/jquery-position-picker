/**
 *
 * A JQUERY LATITUDE AND LONGITUDE LOCATION PICKER
 * version 0.0
 *
 * Supports multiple maps. Works on touchscreen. Easy to customize markup and CSS.
 *
 * by Alessandro Staniscia and Richard Dancsi.
 */




var OLLatLonPicker = (function () {

    var _self = this;

    // VARS
    _self.vars = {
        ID:null,
        map:null,
        markers:null,
        latLongProj : new OpenLayers.Projection("EPSG:4326")
    } ;

    var searchAddressOfPoint= function(lat,lng){
        $.ajax({
            url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false',
            dataType: 'json'
        }).error(function(data){
                console.log(data);
            }).done(function ( data ) {
                if (data['status']=='OK'){
                    setAddressField(data['results'][0].formatted_address);
                }     else{
                    setAddressField("");
                }
        });
    }


    var searchPointOfAddress = function (string, silent) {
        $.ajax({
            url: 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address='+string,
            dataType: 'json'
        }).done(function ( data ) {
                if (data['status']=='OK'){
                lat=data['results'][0].geometry.location.lat;
                lng=data['results'][0].geometry.location.lng;
                var location = new OpenLayers.LonLat(lng,lat).transform(_self.vars.latLongProj,_self.vars.map.getProjectionObject());
                setMarker(location.lat,location.lon,10);
                setField(location.lat,location.lon,_self.vars.map.getZoom());
                searchAddressOfPoint(lat,lng);
                }
        }).error(function(data){
                console.log(data);
        });
    }

    // for getting the elevation value for a position
    var searchElevation = function (lat,lng) {
        $.ajax({
            url: 'http://maps.googleapis.com/maps/api/elevation/json?sensor=false&locations='+lat+','+lng,
            dataType: 'json'
        }).done(function ( data ) {
                if (data['status']=='OK'){
                    elevation=data['results'][0].elevation;
                    $(_self.vars.cssID + ".gllpElevation").val(elevation.toFixed(3));
                }
            }).error(function(data){
                console.log(data);
            });
    };


    var setField= function (lat,lng,zoom)
    {
        var location = new OpenLayers.LonLat(lng,lat).transform(_self.vars.map.getProjectionObject(),_self.vars.latLongProj);
        $(_self.vars.cssID + ".gllpLongitude").val(location.lon.toFixed(5));
        $(_self.vars.cssID + ".gllpLatitude").val(location.lat.toFixed(5));
        $(_self.vars.cssID + ".gllpZoom").val(zoom);
        searchElevation(location.lat,location.lon);
    }

    var setAddressField= function (string)
    {
        $(_self.vars.cssID + ".gllpLocationName").val(string);
    }

    var setMarker= function (lat,lng,zoom)
    {
        _self.vars.markers.clearMarkers();
        var location = new OpenLayers.LonLat(lng,lat);
        var size = new OpenLayers.Size(21,25);
        var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
        var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
        _self.vars.markers.addMarker(new OpenLayers.Marker(location,icon.clone()));
        _self.vars.map.panTo(location);
        $(_self.vars.cssID).trigger("location_changed", $(_self.vars.cssID));
        _self.vars.map.zoomTo(zoom);
    } ;



    var setDefault= function (lat,lng,zoom)
    {
        var location = new OpenLayers.LonLat(lng,lat).transform(_self.vars.latLongProj,_self.vars.map.getProjectionObject());
        setMarker(location.lat,location.lon,zoom);
        setField(location.lat,location.lon,zoom);
        searchAddressOfPoint(location.lat,location.lon);
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
            defZoom = $(_self.vars.cssID + ".gllpZoom").val() ? parseInt($(_self.vars.cssID + ".gllpZoom").val()) : 10;


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
                    setMarker(lonlat.lat,lonlat.lon,_self.vars.map.zoom);
                    setField(lonlat.lat,lonlat.lon,_self.vars.map.zoom);
                    var location = new OpenLayers.LonLat(lonlat.lon,lonlat.lat).transform(_self.vars.map.getProjectionObject(),_self.vars.latLongProj);
                    searchAddressOfPoint(location.lat,location.lon);
                }

            });


            var clickControl = new LLPClickControl();
            _self.vars.map.addControl(clickControl);
            clickControl.activate();

            setDefault(defLat,defLng,defZoom);


            // Update location and zoom values based on input field's value
            $(_self.vars.cssID + ".gllpUpdateButton").bind("click", function () {
                var lat = $(_self.vars.cssID + ".gllpLatitude").val();
                var lng = $(_self.vars.cssID + ".gllpLongitude").val();
                var zoom = $(_self.vars.cssID + ".gllpZoom").val();
                var location = new OpenLayers.LonLat(lng,lat).transform(_self.vars.latLongProj,_self.vars.map.getProjectionObject());

                setMarker(location.lat,location.lon,zoom);
                searchAddressOfPoint(center.lat,center.lon);
            });

            // Search function by search button
            $(_self.vars.cssID + ".gllpSearchButton").bind("click", function () {
                searchPointOfAddress($(_self.vars.cssID + ".gllpSearchField").val(), false);
            });

            // Search function by gllp_perform_search listener
            $(document).bind("gllp_perform_search", function (event, object) {
                searchPointOfAddress($(object).attr('string'), true);
            });

        }

    }

    return publicfunc;
});

(function ($) {

    if (!window.console) window.console = {};
    if (!window.console.log) window.console.log = function () {
    };


    $(document).ready(function () {
        $(".gllpLatlonPicker").each(function () {
            (new OLLatLonPicker()).init($(this));
        });
    });

    $(document).bind("location_changed", function (event, object) {
        console.log("changed: " + $(object).attr('id'));
    });

})(jQuery);


