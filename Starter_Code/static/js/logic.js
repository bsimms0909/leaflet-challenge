// Part 1: Create the Earthquake Visualization
// Using d3 to get the data and read the JSON file.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createMarkers);

// Create map object
let myMap = L.map("map").setView([39.8283, -98.5795], 5);

// Leaflet tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a function to handle the earthquake features.
function createMarkers(data) {
    // Create a function to determine the color based on depth
    function getColor(depth) {
        return depth > 100 ? '#d73027' :
            depth > 50 ? '#4575b4' :
                '#91bfdb';
    }

    // Create a function to determine the radius based on magnitude
    function getRadius(magnitude) {
        return magnitude * 5;
    }

    // Create a legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var depths = [-10, 10, 30, 50, 70, 90];
        var labels = [];

        div.innerHTML += '<h4>Depth</h4>';

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

    // Add the earthquake data to the map
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        }
    }).addTo(myMap);
}
