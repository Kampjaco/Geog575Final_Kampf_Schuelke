//Executes when the window loads
window.onload = function () {
    //Semi global variables

    
    //////////////////////////////////////////////
    /////////////////////////////////////////////
    // MAP JAVASCRIPT //

    initializeMap();

    function initializeMap() {

        var map = L.map('map').setView([44.54746726659841, -89.96017005851391], 7);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    }





























}

