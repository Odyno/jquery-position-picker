jquery-position-picker
======================================

A jQuery plugin that creates a location picker on your webpage using OpenLayer as map view and geocoding with Google Geocoding API. Works on touchscreen. Easy to customize markup and CSS.
This is a code repository, but if you want a demo page, the newest live demo will always be http://www.staniscia.net/repository/lat-lon-picker/
Also, you might find other interesting things on my blog at http://www.staniscia.net


MORE INFO
---------

When you click on Map to set the position:
- You'll have the fresh lattitude, longitude and zoom values in (optional hidden) fields
- You can set your own latitude, longitude and zoom values.
- You'll have the fresh the altitude values in (optional hidden) fields

With search address:
- If the search has results, the first element will appear on the map (with the default zoom value 10)
- You can set default latitude, longitude and zoom values in (optional hidden) fields
- If you don't give an ID to the map, the script generates one; feel free to use custom ID's though

With reverse lookup:
- After the position change you'll have the location name in the gllpLocationName field
- If there is no value, the field will be emptied

With event system after all position change:
- The "location_changed" event will also be fired with the gllLatlonPicker Node JQuery object as attribute
- The "elevation_changed" event will also be fired with the gllLatlonPicker Node JQuery object as attribute
- The "location_name_changed" event will also be fired with the gllLatlonPicker Node JQuery object as attribute


INSTALL
=======

Import jQuery and OpenLayer js:
````
<script src="js/jquery-1.7.2.min.js"></script>
<script src="js/OpenLayers.js"></script>
````

Import the plugin:
````
<link href="css/jquery-position-picker.css" rel="stylesheet" type="text/css"/>
<script src="js/jquery-position-picker.debug.js"></script>
````

Add a HTML markup:
````
<fieldset class="gllpLatlonPicker">
	<input type="text" class="gllpSearchField">
    <input type="button" class="gllpSearchButton" value="search">
	<div class="gllpMap">Google Maps</div>
	<input type="hidden" class="gllpLatitude" value="20"/>
	<input type="hidden" class="gllpLongitude" value="20"/>
	<input type="hidden" class="gllpZoom" value="3"/>
</fieldset>
````
(See more options in the demo http://www.staniscia.net/repository/lat-lon-picker/ )


LICENSE
=======


jquery-position-picker   version 0.1

Copyright 2013  Alessandro Staniscia ( alessandro@staniscia.net )

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License, version 2, as
published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA




This code uses:
 * jQuery javascript library http://jquery.com/
 * OpenLayer javascript library http://www.openlayers.org/
 * Google Elevation API: https://developers.google.com/maps/documentation/elevation/
 * Google Geocoding API: https://developers.google.com/maps/documentation/geocoding/


ABOUT
=====

Alessandro Staniscia
- Sito: http://www.staniscia.net
- Twitter: https://twitter.com/alexstani
- Linkedin: http://it.linkedin.com/in/stanisciaalessandro/

This project is fork of wonderful project of Richard Dancsi ( https://github.com/wimagguc/jquery-latitude-longitude-picker-gmaps )


CHANGELOG
=====

v0.0.2-SNAPSHOT
------
* Removed unused file
* jQuery scope fix for all .ajax() function
* Fix bug to load element with specified id to input field
* Using jquery .find() function to load field content

v0.0.1
------
Release