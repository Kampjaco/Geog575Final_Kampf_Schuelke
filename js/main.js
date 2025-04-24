//Executes when the window loads
window.onload = function () {
    //Semi global variables

    var map;

    
    //////////////////////////////////////////////
    /////////////////////////////////////////////
    // MAP JAVASCRIPT //

    initializeMap();



    function initializeMap() {

        map = L.map('map', {
            center: [44.54599353054098, -89.8541798360329],
            zoom: 7,
            minZoom: 7,  // Set your desired zoom-out limit
            maxZoom: 16  // Optional: limit zoom in
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
          }).addTo(map);

    }

    var countyJson;

    countyJson = L.geoJSON(countyData, {
        style: county_style
    }).addTo(map);

    function county_style(feature) {
        return {
            color: '#7fed75'
        };
    }

















}

