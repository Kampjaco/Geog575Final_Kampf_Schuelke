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

    //Selected year from dropdown menu
    var selectedYear = "F1970_65_1";

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
            zoom: 6,
            minZoom: 6,  // Set your desired zoom-out limit
            maxZoom: 16  // Optional: limit zoom in
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
            subdomains: 'abcd',
        }).addTo(map);

        // Create a custom control for the year selector
        const yearControl = L.control({ position: 'topright' });

        yearControl.onAdd = function () {
            const div = L.DomUtil.create('div', 'year-control');

            div.innerHTML = `
                <select id="year-selector" class="form-select">
                    <option value="F1970_65_1">1970</option>
                    <option value="F1980_65_1">1980</option>
                    <option value="F1990_65_1">1990</option>
                    <option value="F2000_65_1">2000</option>
                    <option value="F2010_65_1">2010</option>
                    <option value="F2020_65_1">2020</option>
                </select>
            `;

            return div;
        };

        // Add the year control to the map
        yearControl.addTo(map);
    }

    function createLayers() {
 
        countyJson = L.geoJSON(countyData, {
            style: county_style,
            onEachFeature: onEachCounty
        }).addTo(map);

        //Critical Hospitals icon
        const hospitalIcon = L.icon({
            iconUrl: 'img/hospital.png',
            iconSize: [20, 20],    
            iconAnchor: [15, 30],        
            popupAnchor: [0, -30]  
        });
        
        //Healthcare Service Delivery Sites Icon
        const healthServIcon = L.icon({
            iconUrl: 'img/health_serv.png',
            iconSize: [20, 20],      
            iconAnchor: [15, 30],       
            popupAnchor: [0, -30]  
        });

        hospitalJson = L.geoJSON(criticalHospitalData, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: hospitalIcon });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>Hospital:</b> ${feature.properties.FACILITY_N}`)
            }
        });

        console.log(countyData)

        servDevJson = L.geoJSON(healthcareDevSitesData, {
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, { icon: healthServIcon });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(`<b>Site:</b> ${feature.properties.SITE_NM}`)
            }
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
            div.innerHTML += '<h5>% Over 65</h5>'; // Add title to legend
            for (var i = 0; i < percents.length; i++) {
                div.innerHTML +=
                    '<i style="background:' + colors[i] + '"></i> ' +
                    percents[i] + (percents[i + 1] ? '&ndash;' + percents[i + 1] + '<br>' : '+');
            }

            // Icon section title
            div.innerHTML += '<hr><h5>Facilities</h5>';

            // Add hospital icon
            div.innerHTML +=
                '<img src="img/hospital.png" style="width:15px; vertical-align:middle;"> Hospital<br>';

            // Add service delivery site icon
            div.innerHTML +=
                '<img src="img/health_serv.png" style="width:15px; vertical-align:middle;"> Service Site<br>';


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

    //Styles map on decade change
    document.getElementById("year-selector").addEventListener("change", function (e) {
        selectedYear = e.target.value; // Update selected year
        countyJson.setStyle(county_style); // Reapply styling to update colors
    });
 
    //Executes when a county is highlighted
    function onEachCounty(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: function(e) {
                showCountyPopup(e);
                updatePyramid(e.target.feature.properties.COUNTY_1, selectedYear.slice(1,5)); //Slice selected year because we only want the number value, not the other text used in identifying the shapefile field
            }
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

        selectedYear = document.getElementById("year-selector").value;

        const popupContent = `<strong>${props.COUNTY_1}</strong><br>` +
                             `Population Percentage over 65 y/o: ${props[selectedYear]}%`;

        const popup = L.popup({
            closeButton: false,
            offset: L.point(10, 0)
        })
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);
    }

    function county_style(feature) {
        return {
            fillColor: getCountyColor(feature.properties[selectedYear]),
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

    // Variables to store pinned pyramid data
    let pinnedLeftData = null;
    let pinnedMiddleData = null;
    let currentPyramidData = null; 

    function updatePyramid(county, year) {
        d3.csv("data/age_pyramid_data.csv").then(function(data) {
            // Filter the data for the selected county and year
            const countyPyramidData = prepareData(data, county, year);

            // Store the current pyramid data for rendering
            currentPyramidData = countyPyramidData; // Add the current pyramid data
            
            // Remove the existing unpinned pyramid SVG
            d3.select(getUnpinnedChart()).select("svg").remove();

            //Renders a pyramid if there is an unpinned container
            if(!pinnedLeftData || !pinnedMiddleData) {

                renderPyramid(currentPyramidData);
                // Update header content
                document.getElementById("pyramid-header-one").textContent = `${county} ${year} Population Pyramid`;
                document.getElementById("pyramid-instruction").classList.add("d-none"); 
                document.getElementById("pin-left").classList.remove("d-none");
            }

            document.getElementById("pin-left").addEventListener("click", function() {
                togglePin("pin-left");
            
                if (pinnedLeftData) {
                    pinnedLeftData = null;
                    document.getElementById("pyramid-header-one").textContent = "Population Pyramid"; // Reset header
                } else {
                    pinnedLeftData = currentPyramidData;
                }
            });
            
            document.getElementById("pin-middle").addEventListener("click", function() {
                togglePin("pin-middle");
            
                if (pinnedMiddleData) {
                    pinnedMiddleData = null;
                    document.getElementById("pyramid-header-two").textContent = "Pinned Pyramid"; // Reset header
                } else {
                    pinnedMiddleData = currentPyramidData;
                }
            });

        

        });
    }

    function togglePin(buttonId) {
        let button = document.getElementById(buttonId);

        //Makes middle container visible after pinning left container
        document.getElementById("middle-container").classList.remove("d-none");
        
        // Check current state and toggle text
        if (button.textContent === "Pin") {
            button.textContent = "Unpin";
        } else {
            button.textContent = "Pin";
        }
    }


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
        const width = window.innerWidth * 0.25;
        const height = window.innerHeight * 0.7;
        const margin = { top: 20, right: 30, bottom: 40, left: 47 };
    
        const svg = d3.select(getUnpinnedChart())
            .append("svg")
            .attr("width", width)
            .attr("height", height);
        console.log(svg);
    
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
    
        // Add Total Numbers to the End of Bars
        svg.selectAll(".bar-label")
            .data(data)
            .enter().append("text")
            .attr("class", "bar-label")
            .attr("x", d => x(d.total) + 5) // Slight offset for visibility
            .attr("y", d => y(d.ageGroup) + y.bandwidth() / 2)
            .attr("dy", "0.35em") // Vertically center the text
            .style("fill", "black")
            .style("font-size", "12px") // Adjust font size as needed
            .text(d => d.total); // Display the total value
    }

    function getUnpinnedChart() {

        //No pinned left data
        if(!pinnedLeftData) {
            return "#left-pyramid-chart";
        //No pinned middle data
        } else if(!pinnedMiddleData) {
            return "#middle-pyramid-chart";
        }
        //Both cotainers have pinned graphs
        return;
        
    }

};