//Pattern: "Self-Executing Anonymous Function: Part 2" http://appendto.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
(function (foodtruckmap, $, undefined) {
    /**
     * @param {object} foodTruck
     * @param {string} foodTruck.Applicant
     * @param {string} foodTruck.Address
     * @param {string} foodTruck.FacilityType
     * @param {string} foodTruck.FoodItems
     * @param {number} foodTruck.Latitude
     * @param {number} foodTruck.Longitude
     * @param {google.maps.Map} map
     */
    function createMarkerAndInfoWindow(foodTruck, map) {
        var latLng = new google.maps.LatLng(foodTruck.Latitude, foodTruck.Longitude);
        var marker = new google.maps.Marker({
            map: map,
            position: latLng,
            title: foodTruck.Applicant
        });

        var header = '<h4>' + foodTruck.Applicant + '</h4>';
        var facilityTypeDetail = '';
        if (foodTruck.FacilityType != "Truck") {
            facilityTypeDetail = ' (' + foodTruck.FacilityType + ')'
        }
        var details = '<h5>' + foodTruck.Address + facilityTypeDetail + '</h5>' + '<p>' + foodTruck.FoodItems + '</p>';
        var infoWindow = new google.maps.InfoWindow({
            content: header + details
        });

        return {
            marker: marker,
            infoWindow: infoWindow
        }
    }

    function mapsCallback() {
        const initialZoom = 13;
        const initialLatitude = 37.760;
        const initialLongitude = -122.44;

        var mapElement = document.getElementById('map');
        var map = new google.maps.Map(mapElement, {
            center: {lat: initialLatitude, lng: initialLongitude},
            zoom: initialZoom
        });

        var markersAndInfoWindows = [];
        $.getJSON('https://points-of-interest-1308.appspot.com/poi', function (foodTrucks) {
            $.each(foodTrucks, function (i, foodTruck) {
                var result = createMarkerAndInfoWindow(foodTruck, map);
                markersAndInfoWindows.push(result)
            });

            $.each(markersAndInfoWindows, function (i1, current) {
                current.marker.addListener('click', function () {
                    current.infoWindow.open(map, current.marker);
                });
                $.each(markersAndInfoWindows, function (i2, other) {
                    if (i1 != i2) {
                        current.marker.addListener('click', function () {
                            other.infoWindow.close();
                        });
                    }
                });
            });
        });
    }

    foodtruckmap.mapsCallback = mapsCallback;
}(window.foodtruckmap = window.foodtruckmap || {}, jQuery));