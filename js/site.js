//Pattern: "Self-Executing Anonymous Function: Part 2" http://appendto.com/2010/10/how-good-c-habits-can-encourage-bad-javascript-habits-part-1/
(function (foodtruckmap, $, undefined) {
    foodtruckmap.markersAndInfoWindows = [];

    /**
     * @param {object} foodTruck
     * @param {string} foodTruck.Applicant
     * @param {string} foodTruck.Address
     * @param {number} foodTruck.Dayshours
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
        if (foodTruck.FacilityType != '' && foodTruck.FacilityType != 'Truck') {
            facilityTypeDetail = ' (' + foodTruck.FacilityType + ')'
        }
        var details = '<h5>' + foodTruck.Address + facilityTypeDetail + '</h5>' +
            '<p>Open: ' + foodTruck.Dayshours + '</p>' +
            '<p>' + foodTruck.FoodItems + '</p>';
        var infoWindow = new google.maps.InfoWindow({
            content: header + details
        });

        return {
            marker: marker,
            infoWindow: infoWindow
        }
    }

    foodtruckmap.loadData = function () {
        var position = foodtruckmap.userPosition.getPosition();
        var latitude = position.lat();
        var longitude = position.lng();
        var distance = $("#distance").val();
        var weekday = $("#weekday").val();
        var hour = $("#hour").val();
        var toRemove = foodtruckmap.markersAndInfoWindows.splice(0, foodtruckmap.markersAndInfoWindows.length);
        $.each(toRemove, function (index, markerAndInfoWindow) {
            markerAndInfoWindow.marker.setMap(null);
        });

        var markersAndInfoWindows = [];
        var url = 'https://points-of-interest-1308.appspot.com/poi' +
            '?latitude=' + latitude +
            '&longitude=' + longitude +
            '&distance=' + distance +
            '&weekday=' + weekday +
            '&hour=' + hour;
        $.getJSON(url, function (foodTrucks) {
            $.each(foodTrucks, function (i, foodTruck) {
                var result = createMarkerAndInfoWindow(foodTruck, foodtruckmap.map);
                markersAndInfoWindows.push(result)
            });

            $.each(markersAndInfoWindows, function (i1, current) {
                current.marker.addListener('click', function () {
                    current.infoWindow.open(foodtruckmap.map, current.marker);
                });
                $.each(markersAndInfoWindows, function (i2, other) {
                    if (i1 != i2) {
                        current.marker.addListener('click', function () {
                            other.infoWindow.close();
                        });
                    }
                });
                foodtruckmap.markersAndInfoWindows.push(current);
            });
        });
    };

    foodtruckmap.createMap = function () {
        const initialZoom = 13;
        const initialLatitude = 37.760;
        const initialLongitude = -122.44;

        var mapElement = document.getElementById('map');
        var center = new google.maps.LatLng(initialLatitude, initialLongitude);
        var map = new google.maps.Map(mapElement, {
            center: center,
            zoom: initialZoom
        });
        foodtruckmap.userPosition = new google.maps.Marker({
            position: center,
            map: map,
            icon: {
                url: 'https://points-of-interest-1308.appspot.com/favicon.ico'
            }
        });
        map.addListener('click', function (e) {
            foodtruckmap.userPosition.setPosition(e.latLng);
            foodtruckmap.loadData();
        });
        foodtruckmap.map = map;
    };

    foodtruckmap.setup = function () {
        $(document).ready(function () {
            var optionIndex;

            var distanceSelect = $("#distance");
            distanceSelect.keyup(function () {
                foodtruckmap.loadData();
            });
            distanceSelect.change(function () {
                foodtruckmap.loadData();
            });

            var now = new Date();

            var weekdaySelect = $("#weekday");
            var weekdaysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            for (optionIndex = 0; optionIndex <= 6; optionIndex++) {
                weekdaySelect.append($('<option></option>').val(optionIndex).html(weekdaysArray[optionIndex]));
            }
            weekdaySelect.val(now.getDay());
            weekdaySelect.change(function () {
                foodtruckmap.loadData();
            });

            var hourSelect = $("#hour");
            for (optionIndex = 0; optionIndex <= 23; optionIndex++) {
                hourSelect.append($('<option></option>').val(optionIndex).html(optionIndex));
            }
            hourSelect.val(now.getHours());
            hourSelect.change(function () {
                foodtruckmap.loadData();
            });

            foodtruckmap.loadData();
        });
    };

}(window.foodtruckmap = window.foodtruckmap || {}, jQuery));