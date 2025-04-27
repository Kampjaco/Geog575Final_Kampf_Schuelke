// Executes when the window loads
window.onload = function () {
    //////////////////////////////////////////////
    // MAP JAVASCRIPT //

    initializeMap();

    function initializeMap() {
        const map = L.map('map', {
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