//tile layer of map background
console.log("Map working!!");

var basemap=L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'",
    {
        attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
);

//map options created
var map=L.map("map", {
    center:[
        40.7, -94.5
    ],
    zoom:3
});

// add basemap tile layer to map
basemap.addTo(map);

//make an ajax call to retrieve geojson data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {
    //style it

    function styleInfo(feature){
        return {
            opacity:1,
            fillOpacity:1,
            fillColor:getColor(feature.geometry.coordinates[2]),
            color:"#000000",
            radius:getRadius(feature.properties.mag),
            stroke:true,
            weight:0.5
        };
    }

    //color based on magnitude of earthquake
    function getColor(depth){
        switch(true){
            case depth>90:
                return"#ea2c2c";
                case depth > 70:
                  return "#ea822c";
                case depth > 50:
                  return "#ee9c00";
                case depth > 30:
                  return "#eecc00";
                case depth > 10:
                  return "#d4ee00";
                default:
                  return "#98ee00";
              }
            }
            function getRadius(magnitude){
                if (magnitude===0) {
                    return 1;
                }
                return magnitude * 4;
            }

            // add geojson layer
            L.geoJson(data,{
                //turn it all into circlemarker feature
                pointToLayer: function (feature,latlng){
                    layer.bindPopup(
                        "Magnitude:"
                        +feature.propertties.mag
                        + "<br>Depth: "
                        + feature.geometry.coordinates[2]
                        + "<br>Location: "
                        + feature.properties.place

                    );
                }
            }). addTo(map);
            //legend to control the object
            var legend= L.control ({
                position:"bottomright"
            });
            // add the details to legend
            legend.onAdd=function(){
                var div =L.DomUtil.create("div", "info legend");

                
                var grades=[-20,-10,10,30,50,70,90];
                var colors =[
                    "#98ee00",
                    "#d4ee00",
                    "#eecc00",
                    "#ee9c00",
                    "#ea822c",
                    "#ea2c2c"
              
                ];
                // loop
                for (var i=0;1< grades.length; i++){
                    div.innerHTML +="<i style ='background:" + colors[i]+ "'></i<"
                     +grades[i] +(grades [i+1]? "&ndash;"+ grades [i+1]+"<br>": "+");

                }
                return div;
            };
            //add legend to map
            legend.addTo(map);
            
     });