# Aging America Public Health Dashboard

### Team Members
- Jacob Kampf
- Nathan Schuelke

### Final Proposal
PERSONA 

The targeted user in this project is Laura, a Public Health Analyst working for the Wisconsin Department of Health.  She is responsible for supporting strategic planning for health services across the entire state, especially in rural areas where healthcare access is uneven.  She works on identifying emerging public health needs and evaluating demographic trends as they relate to service allocation, aging populations and long-term care infrastructure. 

She holds a Master’s Degree in Public Health, but is not a GIS expert.  However, she regularly uses maps and data visualizations built by others in her organization to prepare reports for state and federal funding applications. 

She will use the application to identify counties that have had high percentage growths of people over 65 years old, then using those trends and population pyramids of each county she will predict where those trends will continue in the coming years. 

SCENARIO 

It is Monday morning, and Laura is preparing a proposal to request funding to expand healthcare services in Wisconsin counties, particularly in rural areas where there has been a high growth in elderly citizens. 

She opens the “Aging America” interactive map in her browser.  The primary representation is a choropleth map of Wisconsin counties, shaded by the percentage of population over 65 based on the 2020 census.  She can select different decades back to 1970 if she wishes.  If she wants to see more clearly how the population above 65 has changed since 1970, she can toggle the map view to show the growth or shrinkage of population above 65 for each county since 1970. 

She clicks on rural Vernon County.  A population pyramid appears on the right side of the screen, showing a bulge in 65+ age brackets in 2020.  She pins Vernon County to the top half of the right side, then selects urban Dane County, and compares the graphs.  Her hypothesis is confirmed – rural counties have been aging at a faster rate than urban counties. 

Then, she toggles the “Healthcare Facilities” layer – a point layer representation of hospitals and clinics.  She can see counties of high aging rates have few or no nearby facilities, suggesting a gap in service infrastructure. 

REQUIREMENTS 
 

Type 

Name 

Source 

Description 

Data 

NHGIS Census Data 

https://data2.nhgis.org/main 

Tabular census data for all WI counties from 1970 onwards 

Data 

Healthcare Facilities 

https://data.hrsa.gov/Content/Documents/map-services/Connect%20to%20HDW%20Map%20Data%20with%20ArcGIS%20Pro.pdf 

HRSA is a division of the US Dept. Of Health & Human Services.  Facilities in this dataset are federally funded or play a role in supporting underserved populations.  More research on our end needs to go into which facilities specifically will be used in the application 

Interactivity 

Leaflet 

https://leafletjs.com/ 

Open-source library used to create a slippy map and display shapefile data.  Will also have tools to toggle different layers on and off 

Interactivity 

D3 

https://d3js.org/ 

Open-source library used to create population pyramid visualization 

Software 

ArcGIS Pro 

ArcGIS Pro desktop application 

Standard GIS software.  Will be used to preprocess data and run analysis, such as Service Area analysis on Healthcare Facilities 

 

 

WIREFRAME 

Picture 

1. Initial View (Opening the Map) 

View title 

Dropdown toggle for decade selection 

Menu toggle  

Legend for data explanation 

Picture 

2. Map Views 

Dropdown toggle for decade selection 

Menu toggle 

Legend for data explanation on growth or shrinkage 

Picture 

3. County Selection (Vernon County Example) 

Selectable counties 

Population pyramid for selected county 

Pin toggle to compare county data 

Picture 

4. Comparison of Counties (Vernon vs Dane Example) 

Split view of pinned counties 

Dropdown toggle for decade selection 

Menu toggle 

Picture 

5. Healthcare Facility Layer 

Legend outlining facility type 






