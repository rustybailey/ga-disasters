
var width = 700,
    height = 700;

var svg = d3.select(".map-container").append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")

d3.json("data/ga-counties.json", function(error, ga) {
  d3.csv("data/disasters.csv", function(error, data){
    var consolidatedData = {};
    var disasterTypes = [];

    data.forEach(function(v,i){
      if(disasterTypes.indexOf(v["HAZARD_TYPE_COMBO"]) === -1){
        disasterTypes.push(v["HAZARD_TYPE_COMBO"])
      }
    });

    disasterTypes.sort().forEach(function(v, i){
      d3.select("select").append("option")
        .attr("value", v)
        .text(v)
    })

    data.forEach(function(v,i){
      if(v["FIPS_CODE"] in consolidatedData) {
        consolidatedData[v["FIPS_CODE"]].total += 1
        if(v["HAZARD_TYPE_COMBO"] in consolidatedData[v["FIPS_CODE"]]) {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] += 1
        } else {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] = 1
        }
      } else {
        consolidatedData[v["FIPS_CODE"]] = {}
        consolidatedData[v["FIPS_CODE"]].total = 1
        if(v["HAZARD_TYPE_COMBO"] in consolidatedData[v["FIPS_CODE"]]) {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] += 1
        } else {
          consolidatedData[v["FIPS_CODE"]][v["HAZARD_TYPE_COMBO"]] = 1
        }
        
      }
    });

    var maxFreq = d3.max(d3.values(consolidatedData), function(d) {return d.total});
    d3.select(".low").text(1);
    d3.select(".high").text(maxFreq);

    var color = d3.scale.linear()
        .domain([1, maxFreq])
        .range(["#C9E4FF","#08306B"]);

    var counties = topojson.feature(ga, ga.objects.counties);
    var mapData = counties.features;

    mapData.forEach(function(v,i){
      var id = v.id;
      var thisData = consolidatedData[id] || 0;
      v.data = thisData;
    });


    var projection = d3.geo.albersUsa()
      .scale(8000)
      .translate([-1200, -400]);

    var path = d3.geo.path().projection(projection);
    svg.append("path")
      .datum(counties)
      .attr("d", path);

    svg.selectAll(".county")
        .data(mapData)
      .enter().append("path")
        .attr("class", function(d) { return "county " + d.id; })
        .attr("fill", function(d) { return d.data.total > 0 ? color(d.data.total) : "white"})
        .attr("d", path)
        .attr("stroke", "lightgrey")
        .on("mouseover", function(){return tooltip.style("visibility", "visible");})
        .on("mousemove", function(d){
          return tooltip
            .style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px")
            .text(d.properties.name + " : " + (d.data.total || 0))
        })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    d3.select("select").on("change", function(){
      var selected = d3.select(this)[0][0][this.selectedIndex];
      var type = selected.value;
      maxFreq = d3.max(d3.values(consolidatedData), function(d) {return d[type]});
      d3.select(".high").text(maxFreq);
      color.domain([0, maxFreq]);
      d3.selectAll(".county")
        .attr("fill", function(d) { return d.data[type] > 0 ? color(d.data[type]) : "white" })
        .on("mousemove", function(d){
          return tooltip
            .style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px")
            .text(d.properties.name + " : " + (d.data[type] || 0))
        })
    })
  });
});