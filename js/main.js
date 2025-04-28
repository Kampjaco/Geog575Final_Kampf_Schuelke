// Executes when the window loads
window.onload = function () {

    //////////////////////////////////////////////
    //Semi Global Variables
    
    //Leaflet map
    var map;

    //GeoJSON files
    var countyJson;
    var hospitalJson;
    var serDevJson;

    //////////////////////////////////////////////
    // MAP JAVASCRIPT //

    //Creates Leaflet map
    initializeMap();

    //Creates GeoJSOND layers
    createLayers();

    //Creates and adds a legend for the county layer
    addLegend();

    //Create layer group to toggle through different layers
    createToggleMenu();

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

    //COUNTY STYLING AND POPUP HELPER FUNCTIONS
 
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
    // POPULATION PYRAMID JAVASCRIPT //

    d3.csv("data/age_pyramid_data.csv").then(function(data) {
        // Filter the data for a specific county and year
        const countyData = prepareData(data, "Adams County", 1970);
        renderPyramid(countyData);
    });

    function prepareData(data, county, year) {
        const selectedCounty = data.find(d => d.COUNTY === county);

        const ageGroups = [
            "under_5", "5_to_9", "10_to_14", "15_to_17", "18_and_19",
            "20", "21", "22_to_24", "25_to_29", "30_to_34",
            "35_to_44", "45_to_54", "55_to_59", "60_and_61",
            "62_to_64", "65_to_74", "75_to_84", "85_and_over"
        ];

        return ageGroups.map(ageGroup => ({
            ageGroup: ageGroup.replace(/_/g, " ").replace("and", "&"),
            total: +selectedCounty[`${ageGroup}_${year}`] || 0
        }));
    }

    function renderPyramid(data) {
        const width = 800;
        const height = 600;
        const margin = { top: 20, right: 30, bottom: 40, left: 40 };

        const svg = d3.select("#pyramid-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.total)])
            .range([margin.left, width - margin.right]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.ageGroup))
            .range([height - margin.bottom, margin.top])
            .padding(0.1);

        // X-Axis
        svg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).ticks(5));

        // Y-Axis
        svg.append("g")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).tickSize(0));

        // Total Population Bars
        svg.selectAll(".bar-total")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar-total")
            .attr("x", x(0))
            .attr("y", d => y(d.ageGroup))
            .attr("width", d => x(d.total) - x(0))
            .attr("height", y.bandwidth())
            .attr("fill", "steelblue");
    }
};