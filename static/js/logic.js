var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(queryUrl).then(function(data) {
    console.log(data);
    createFeatures(data.features);
})

function createFeatures(earthquakeData){
    function markerColor(magnitude) {
        switch (true) {
            case magnitude > 6:
                return "red";
            case magnitude > 5:
                return "orangered";
            case magnitude > 4:
                return "orange";
            case magnitude > 3:
                return "gold"
            case magnitude > 2:
                return "yellow"
            default:
                return "lightgreen";
        };
    };

    function markerRadius(magnitude) {
        if (magnitude === 0) {
            return 1
        }
        else {
            return magnitude * 4
        };
    };

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
        "</h3><hr><p>" + new Date(feature.properties.time) + 
        "</p><hr><p>" + feature.properties.mag +"</p>"); 
    };
 
    var earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                opacity: 1,
                fillOpacity: 1,
                fillColor: markerColor(feature.properties.mag), 
                color: "white",
                radius: markerRadius(feature.properties.mag),
                stroke: true,
                weight: 1
                
            });
        },
        onEachFeature: onEachFeature
    });
 
    createMap(earthquakes);
    // earthquakes.addTo(myMap);
}



function createMap(earthquakes){
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    }); 

    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        Earthquakes: earthquakes
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71 
        ],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
}
