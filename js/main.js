//Executes when the window loads
window.onload = function () {
    //Semi global variables

    //Leaflet map
    var map;

    //GeoJSON files
    var countyJson
    var hospitalJson
    var servDevJson

    //Layer groups
    

    
    //////////////////////////////////////////////
    /////////////////////////////////////////////
    // MAP JAVASCRIPT //

    //Creates Leaflet Map
    initializeMap();

    //Creates GeoJSON layers
    createLayers();

    //Creates and adds a legend to the layers with people 65+ percentage
    addLegend();

    //Create layer groups to toggle on and off
    createToggleMenu()





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

          console.log(countyData)

    }


    function createLayers() {

        countyJson = L.geoJSON(countyData, {
            style: county_style,
            onEachFeature: onEachCounty
        }).addTo(map);

        hospitalJson = L.geoJSON(criticalHospitalData, {

        });

        servDevJson = L.geoJSON(healthcareDevSitesData, {

        });

    }

    function addLegend() {
        // Create a custom legend control
        var legend = L.control({ position: 'bottomleft' }); // Change position as needed

        legend.onAdd = function (map) {
            // Create a div element for the legend
            var div = L.DomUtil.create('div', 'legend');

            //Ranges and gradient colors
            var percents = [5, 10, 15, 20, 25, 30];
            var colors = ['#feebe2', '#fcc5c0', '#fa9fb5', '#f768a1', '#c51b8a', '#7a0177']; // Matching colors

            // Generate legend content
            div.innerHTML += '<h4>% Over 65</h4>'; // Add title to legend
            for (var i = 0; i < percents.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    percents[i] + (percents[i + 1] ? '&ndash;' + percents[i + 1] + '<br>' : '+');
            }

            return div;
        };
        legend.addTo(map);
    }

    function createToggleMenu() {

        var overlays = {
            "County Percentages": countyJson,
            "Critical Access Hospitals": hospitalJson,
            "Health Care Service Delivery Sites": servDevJson
        };

        L.control.layers(null, overlays).addTo(map);
    }
   

    //County styling a popup helper functions

    //Executes when a county is highlighted
    function onEachCounty(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: showCountyPopup
        });
    }

    // Highlight style
    function highlightFeature(e) {
        const layer = e.target;

        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.9
        });

        // Bring to front if supported
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    // Reset style
    function resetHighlight(e) {
        countyJson.resetStyle(e.target);
        map.closePopup(); // Hide popup
    }

    // Show popup on mouse over county
    function showCountyPopup(e) {
        const layer = e.target;
        const props = layer.feature.properties;

        const popupContent = `<strong>${props.COUNTY_1}</strong><br>` +
                             `Population Percentage over 65 y/o: ${props.F2020_65_1}%`;

        const popup = L.popup({
            closeButton: false,
            autoPan: false,
            offset: L.point(10, 0)
        })
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);
    }

    //Style counties
    function county_style(feature) {
        return {
            fillColor: getCountyColor(feature.properties.F2020_65_1),
            weight: 1,
            opacity: 1,
            color: 'gray',
            fillOpacity: 1
        };
    }

    //Color counties based on percentage of residents who are 65+
    function getCountyColor(d) {
        return  d > 30 ? '#7a0177' :
                d > 25 ? '#c51b8a' :
                d > 20 ? '#f768a1' :
                d > 15 ? '#fa9fb5' :
                d > 10 ? '#fcc5c0' :
                d >= 5 ? '#feebe2' :
                         '#ffffff'; // Default color if value is below 5
    }



    //////////////////////////////////////////////
    /////////////////////////////////////////////
    // POPULATION PYRAMID JAVASCRIPT //













}

