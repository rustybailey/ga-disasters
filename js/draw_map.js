
// Set width and height for map container
var width = 700,
    height = 700;

// create svg within .map-container
var svg = d3.select(".map-container").append("svg")
  .attr("width", width)
  .attr("height", height);

// simple tooltip
var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");


d3.json("data/ga-counties.json", function(error, ga) {
  d3.csv("data/disasters.csv", function(error, data){
    var consolidatedData = {},
      disasterTypes = [];


    // Create an array of all disaster types
    data.forEach(function(v,i){
      if(disasterTypes.indexOf(v["HAZARD_TYPE_COMBO"]) === -1){
        disasterTypes.push(v["HAZARD_TYPE_COMBO"]);
      }
    });

    // Sort disaster array and create options
    // for the select box filter
    disasterTypes.sort().forEach(function(v, i){
      d3.select("select").append("option")
        .attr("value", v)
        .text(v)
    });


    // Using the data from the csv, create a new object containing
    // the frequency of disasters organized by county code.
    data.forEach(function(v,i){
      if(v["FIPS_CODE"] in consolidatedData) {
        consolidatedData[v["FIPS_CODE"]].total += 1;
        if(v["HAZARD_TYPE_COMBO"] in consolidatedData[v["FIPS_CODE"]]) {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] += 1;
        } else {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] = 1;
        }
      } else {
        consolidatedData[v["FIPS_CODE"]] = {};
        consolidatedData[v["FIPS_CODE"]].total = 1;
        if(v["HAZARD_TYPE_COMBO"] in consolidatedData[v["FIPS_CODE"]]) {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] += 1;
        } else {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] = 1;
        }
      }
    });

    // Get min/max based on total for scale
    var minMaxFreq = d3.extent(d3.values(consolidatedData), function(d) {return d.total});
    d3.select(".low").text(minMaxFreq[0]);
    d3.select(".high").text(minMaxFreq[1]);

    var color = d3.scale.linear()
        .domain(minMaxFreq)
        .range(["#C9E4FF", "#08306B"]);

    var counties = topojson.feature(ga, ga.objects.counties),
      mapData = counties.features;

    
    // Link frequency data to map features data
    mapData.forEach(function(v,i){
      var id = v.id,
        thisData = consolidatedData[id] || 0;
      v.data = thisData;
    });

    // Draw the map, scale and translate to focus on Georgia
    var projection = d3.geo.albersUsa()
      .scale(8000)
      .translate([-1200, -400]);

    var path = d3.geo.path().projection(projection);
    svg.append("path")
      .datum(counties)
      .attr("d", path);

    // Bind mapData to new paths and bind events for the tooltip
    svg.selectAll(".county")
        .data(mapData)
      .enter().append("path")
        .attr("class", function(d) { return "county " + d.id; })
        .attr("fill", function(d) { return d.data.total > 0 ? color(d.data.total) : "white"})
        .attr("d", path)
        .attr("stroke", "grey")
        .on("mouseover", function() { return tooltip.style("visibility", "visible"); })
        .on("mousemove", function(d) {
          return tooltip
            .style({
              "top": (d3.event.pageY - 10) + "px",
              "left": (d3.event.pageX + 10) + "px"
            })
            .text(d.properties.name + " : " + (d.data.total || 0));
        })
        .on("mouseout", function() { return tooltip.style("visibility", "hidden"); });

    // Filter data on disaster type when select box is changed
    d3.select("select").on("change", function(){
      var selected = d3.select("option:checked"),
        type = selected.attr("value");
      minMaxFreq = d3.extent(d3.values(consolidatedData), function(d) {return d[type]});
      d3.select(".low").text(minMaxFreq[0]);
      d3.select(".high").text(minMaxFreq[1]);
      color.domain(minMaxFreq);
      d3.selectAll(".county")
        .attr("fill", function(d) { return d.data[type] > 0 ? color(d.data[type]) : "white" })
        .on("mousemove", function(d) {
          return tooltip
            .style({
              "top": (d3.event.pageY - 10) + "px",
              "left": (d3.event.pageX + 10) + "px"
            })
            .text(d.properties.name + " : " + (d.data[type] || 0));
        });
    });
  });
});